const togglePassword = document.getElementById('togglePassword')
const nameInput = document.getElementById('name')
const retryPasswordInput = document.getElementById('retry-password')

const nameErrorMessage = document.getElementById('name-error')
const retryPasswordErrorMessage = document.getElementById('retry-password-error')

function validateRetryPassword() {
  if (passwordInput.value !== retryPasswordInput.value) {
    retryPasswordErrorMessage.textContent = 'As senhas devem ser iguais.'
    submitButton.disabled = true
    return false
  } else {
    retryPasswordErrorMessage.textContent = ''
    submitButton.disabled = false
    return true
  }
}

function validateName() {
  if (nameInput.value.length < 3) {
    nameErrorMessage.textContent = 'O nome deve ter pelo menos 3 caracteres.'
    submitButton.disabled = true
    return false
  } else {
    nameErrorMessage.textContent = ''
    submitButton.disabled = false
    return true
  }
}

function togglePasswordVisibility() {
  if (passwordInput.type === "password" && retryPasswordInput.type === "password") {
    passwordInput.type = "text"
    retryPasswordInput.type = "text"
    togglePassword.classList.add("fa-eye")
    togglePassword.classList.remove("fa-eye-slash")
  } else {
    passwordInput.type = "password"
    retryPasswordInput.type = "password"
    togglePassword.classList.add("fa-eye-slash")
    togglePassword.classList.remove("fa-eye")
  }
}


retryPasswordInput.addEventListener('input', validateRetryPassword)
passwordInput.addEventListener('input', validateRetryPassword)
nameInput.addEventListener('input', validateName)
togglePassword.addEventListener('click', togglePasswordVisibility)