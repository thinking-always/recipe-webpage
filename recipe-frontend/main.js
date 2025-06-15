// main.js
const token = localStorage.getItem("token");
if (!token) {
  alert("\uB85C\uADF8\uC778\uC774 \uD544\uC694\uD574\uC694.");
  window.location.href = "login.html";
}

let allRecipes = [];

function escapeHTML(str) {
  return str.replace(/[&<>"']/g, tag => (
    {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[tag]
  ));
}

function loadRecipes() {
  fetch("/recipes", {
    headers: { "Authorization": "Bearer " + token }
  })
    .then(res => res.json())
    .then(data => {
  if (data.success && data.data) {
    allRecipes = data.data;
    renderRecipes(allRecipes);
  } else {
    console.warn("불러오기 실패 또는 데이터 없음:", data);
    renderRecipes([]);  // 빈 배열로 렌더링
  }
});

}

function renderRecipes(list) {
  const container = document.getElementById("recipe-list");
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = "<p>\uB808\uC2DC\uD53C\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.</p>";
    return;
  }

  list.forEach(recipe => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h4>${escapeHTML(recipe.title)}</h4>
      <p>${escapeHTML(recipe.description.substring(0, 80))}...</p>
    `;
    container.appendChild(card);
  });
}

function searchRecipes() {
  const keyword = document.getElementById("search-input").value.toLowerCase();
  const filtered = allRecipes.filter(r => r.title.toLowerCase().includes(keyword));
  renderRecipes(filtered);
}

function createRecipe() {
  const title = document.getElementById("new-title").value.trim();
  const description = document.getElementById("new-desc").value.trim();
  if (!title || !description) {
    alert("\uC81C\uBAA9\uACFC \uB0B4\uC6A9\uC744 \uBAA8\uB450 \uC785\uB825\uD574\uC8FC\uC138\uC694.");
    return;
  }

  fetch("/recipes", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title, description })
  })
  .then(res => res.json())
  .then(() => {
    document.getElementById("new-title").value = "";
    document.getElementById("new-desc").value = "";
    loadRecipes();
  });
}

loadRecipes();
