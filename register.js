function register() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  if (!username || !password) {
    alert("아이디와 비밀번호를 입력해주세요.");
    return;
  }

  fetch("http://localhost:5000/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.message === "User registered successfully") {
        alert("회원가입 성공! 이제 로그인해주세요.");
        window.location.href = "login.html";
      } else {
        alert("회원가입 실패: " + (data.message || "오류 발생"));
      }
    })
    .catch(err => alert("서버 오류: " + err));
}
