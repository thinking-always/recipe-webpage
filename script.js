function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  if (!username || !password) {
    alert("아이디와 비밀번호를 모두 입력해주세요.");
    return;
  }

  fetch("http://localhost:5000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.access_token) {
        alert("로그인 성공!");
        localStorage.setItem("token", data.access_token);
        window.location.href = "index.html";
      } else {
        alert("로그인 실패: " + (data.message || "아이디 또는 비밀번호 오류"));
      }
    })
    .catch(err => alert("로그인 중 오류 발생: " + err));
}


