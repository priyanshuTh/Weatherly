document.addEventListener("DOMContentLoaded", () => {
  // Password visibility toggle for both password fields
  document.querySelectorAll(".fa-eye").forEach((icon) => {
    icon.addEventListener("click", function () {
      const passwordInput = this.closest(".input-group").querySelector("input");
      const type =
        passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);
      this.classList.toggle("fa-eye-slash");
    });
  });

  // Form validation
  const form = document.querySelector("form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const firstName = document.querySelector(
      'input[placeholder="First Name"]'
    ).value;
    const lastName = document.querySelector(
      'input[placeholder="Last Name"]'
    ).value;
    const email = document.querySelector('input[type="email"]').value;
    const dob = document.querySelector('input[type="date"]').value;
    const password = document.querySelectorAll('input[type="password"]')[0]
      .value;
    const confirmPassword = document.querySelectorAll(
      'input[type="password"]'
    )[1].value;

    // Simple validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !dob ||
      !password ||
      !confirmPassword
    ) {
      alert("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Store signup info (in a real app, this would be sent to a server)
    localStorage.setItem(
      "signupInfo",
      JSON.stringify({
        firstName,
        lastName,
        email,
        dob,
      })
    );

    // Set logged in status
    localStorage.setItem("isLoggedIn", "true");

    // Redirect to home page
    window.location.href = "../index.html";
  });
});
