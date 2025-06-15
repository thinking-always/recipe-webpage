function escapeHTML(str) {
  return str.replace(/[&<>"']/g, tag => (
    {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[tag]
  ));
}

const token = localStorage.getItem("token");
if (!token) {
  alert("You are not logged in!");
  window.location.href = "login.html";
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

function addRecipe() {
  const title = document.getElementById("new-title").value.trim();
  const description = document.getElementById("new-description").value.trim();

  if (!title || !description) {
    alert("Please enter both title and description.");
    return;
  }

  fetch("/recipes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ title, description })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert("Recipe added successfully!");
      loadAllRecipes();
      document.getElementById("new-title").value = "";
      document.getElementById("new-description").value = "";
    } else {
      alert("Failed to add recipe.");
    }
  });
}

function deleteRecipe(id) {
  if (!confirm("Are you sure you want to delete this recipe?")) return;

  fetch(`/recipes/${id}`, {
    method: "DELETE",
    headers: { "Authorization": "Bearer " + token }
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert("Recipe deleted!");
      loadAllRecipes();
    } else {
      alert("Failed to delete recipe.");
    }
  });
}

function editRecipe(id) {
  const newTitle = prompt("Enter new title:");
  const newDescription = prompt("Enter new description:");

  if (!newTitle || !newDescription) {
    alert("Title and description are required.");
    return;
  }

  fetch(`/recipes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ title: newTitle, description: newDescription })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert("Recipe updated!");
      loadAllRecipes();
    } else {
      alert("Failed to update recipe.");
    }
  });
}

let allRecipes = [];

function loadAllRecipes() {
  fetch("/recipes", {
    headers: { "Authorization": "Bearer " + token }
  })
  .then(res => res.json())
  .then(data => {
    allRecipes = data.data;
    displayRecipes(allRecipes);
  });
}

function displayRecipes(recipes) {
  const list = document.getElementById("recipe-list");
  list.innerHTML = "";

  if (!recipes.length) {
    list.innerHTML = "<p>No recipes found</p>";
    return;
  }

  recipes.forEach(recipe => {
    const div = document.createElement("div");
    div.className = "recipe";
    div.id = `recipe-${recipe.id}`;
    div.innerHTML = `
      <h3>${escapeHTML(recipe.title)}</h3>
      <p>${escapeHTML(recipe.description.substring(0, 100))}...</p>
      <button onclick="event.stopPropagation(); editRecipe(${recipe.id})">Edit</button>
      <button onclick="event.stopPropagation(); deleteRecipe(${recipe.id})">Delete</button>
    `;
    div.addEventListener("click", () => openModal(recipe));
    list.appendChild(div);
  });
}

function openModal(recipe) {
  document.getElementById("modal-title").innerText = recipe.title;
  document.getElementById("modal-description").innerText = recipe.description;
  document.getElementById("modal").style.display = "block";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

function filterRecipes() {
  const keyword = document.getElementById("search-keyword").value.toLowerCase();
  const filtered = allRecipes.filter(r => r.title.toLowerCase().includes(keyword));
  displayRecipes(filtered);
}

loadAllRecipes();
