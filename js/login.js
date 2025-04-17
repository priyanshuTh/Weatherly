document.addEventListener("DOMContentLoaded", () => {
  // Password visibility toggle
  document.querySelector(".fa-eye").addEventListener("click", function () {
    const passwordInput = document.getElementById("password");
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    this.classList.toggle("fa-eye-slash");
  });

  // Form validation
  document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!username || !password) {
      alert("Please fill in all fields");
      return;
    }

    // Simulate login success
    localStorage.setItem("isLoggedIn", "true");
    window.location.href = "../../index.html";
  });
});
