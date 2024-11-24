const togglePassword = document.getElementById('togglePassword')

togglePassword.addEventListener('click', function() {
  if(passwordInput.type === "password") {
    passwordInput.type = "text"
    togglePassword.classList.add("fa-eye")
    togglePassword.classList.remove("fa-eye-slash")
  }
  else {
    passwordInput.type = "password"
    togglePassword.classList.add("fa-eye-slash")
    togglePassword.classList.remove("fa-eye")
  }
})
