// js/login.js
document.addEventListener("DOMContentLoaded", () => {
  // Already logged in? Skip straight to the dashboard.
  

  if (Auth.isLoggedIn()) {
    window.location.href = "dashboard.html";
    return;
  }

  const form = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const loginAlert = document.getElementById("loginAlert");
  const loginBtn = document.getElementById("loginBtn");

  function setFieldError(fieldId, errorId, message) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);
    if (message) {
      field.classList.add("has-error");
      error.textContent = message;
      error.classList.remove("hidden");
    } else {
      field.classList.remove("has-error");
      error.classList.add("hidden");
    }
  }

  function showAlert(message) {
    loginAlert.textContent = message;
    loginAlert.classList.remove("hidden");
  }
  function hideAlert() {
    loginAlert.classList.add("hidden");
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideAlert();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    let valid = true;
    if (!email) {
      setFieldError("emailField", "emailError", "Email is required.");
      valid = false;
    } else {
      setFieldError("emailField", "emailError", "");
    }
    if (!password) {
      setFieldError("passwordField", "passwordError", "Password is required.");
      valid = false;
    } else {
      setFieldError("passwordField", "passwordError", "");
    }
    if (!valid) return;

    loginBtn.disabled = true;
    loginBtn.textContent = "Signing in...";

    try {
      const data = await Api.login(email, password);
      Auth.setSession(data.token, data.user);
      window.location.href = "dashboard.html";
    } catch (err) {
      showAlert(err.message || "Invalid email or password.");
    } finally {
      loginBtn.disabled = false;
      loginBtn.textContent = "Sign in";
    }
  });
});
