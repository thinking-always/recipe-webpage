// profile.js
const token = localStorage.getItem("token");
if (!token) {
  alert("\uB85C\uADF8\uC778 \uD6C4 \uC774\uC804\uD574\uC8FC\uC138\uC694");
  window.location.href = "login.html";
}

let userId = null;

// 1. 사용자 정보 로딩 (userId + bio)
fetch("/me", {
  headers: { "Authorization": "Bearer " + token }
})
  .then(res => res.json())
  .then(data => {
    userId = data.id;
    document.getElementById("bio").value = data.bio || "";
    loadMyRecipes();
  });

// 2. bio 저장하기
function saveBio() {
  const bio = document.getElementById("bio").value.trim();
  fetch("/me", {
    method: "PUT",
    headers: {
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ bio })
  })
    .then(res => res.json())
    .then(data => alert("\uC790\uAE30\uC18C\uAC1C\uAC00 \uC800\uC7A5\uB418\uC5C8\uC2B5\uB2C8\uB2E4."));
}

// 3. 내 레시피만 불러오기
function loadMyRecipes() {
  fetch("/recipes", {
    headers: { "Authorization": "Bearer " + token }
  })
    .then(res => res.json())
    .then(data => {
      const mine = data.data.filter(r => r.user_id == userId);
      const list = document.getElementById("my-recipe-list");
      list.innerHTML = "";
      mine.forEach(r => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `<h4>${r.title}</h4><p>${r.description}</p>`;
        list.appendChild(card);
      });
    });
}
