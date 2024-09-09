document.getElementById("fetch-button").addEventListener("click", fetchData);
document.getElementById("post-form").addEventListener("submit", createPost);

async function fetchData() {
  const users = await fetchUsers(); 
  renderLoadingState();
  try {
    const response = await fetch("http://localhost:3004/posts");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json(); 
    renderData(data, users);
  } catch (error) {
    renderErrorState();
  }
}

async function fetchUsers() {
  try {
    const response = await fetch("http://localhost:3004/users");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to load users");
    return [];
  }
}

function renderData(data, users) {
  const container = document.getElementById("data-container");
  container.innerHTML = ""; 

  if (data.length > 0) {
    data.forEach((item) => {
      const user = users.find(u => u.id === item.userId);
      const userName = user ? user.name : "Unknown User";

      const div = document.createElement("div");
      div.className = "item";
      div.innerHTML = `
        <strong>${item.title}</strong><br>
        <p>${item.body}</p>
        <small>By: ${userName}</small>
        <button onclick="deletePost(${item.id})">Delete</button>
      `;
      container.appendChild(div);
    });
  }
}

async function createPost(event) {
  event.preventDefault();
  const form = event.target;
  const postData = {
    userId: form.userId.value,
    title: form.title.value,
    body: form.body.value
  };

  try {
    const response = await fetch("http://localhost:3004/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(postData)
    });

    if (response.ok) {
      fetchData(); 
      form.reset(); 
    } else {
      console.error("Failed to create post");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function deletePost(postId) {
  try {
    const response = await fetch(`http://localhost:3004/posts/${postId}`, {
      method: "DELETE"
    });

    if (response.ok) {
      fetchData(); 
    } else {
      console.error("Failed to delete post");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

function renderErrorState() {
  const container = document.getElementById("data-container");
  container.innerHTML = "<p>Failed to load data</p>";
}

function renderLoadingState() {
  const container = document.getElementById("data-container");
  container.innerHTML = "<p>Loading...</p>";
}
