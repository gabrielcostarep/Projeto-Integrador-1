const emailInput = document.getElementById('email')
const passwordInput = document.getElementById('password')

const EmailErrorMessage = document.getElementById('email-error')
const PasswordErrorMessage = document.getElementById('password-error')

const form = document.getElementById('form')
const submitButton = document.getElementById('submit-button')

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

function validateEmail() {
  const email = emailInput.value

  if (!emailRegex.test(email)) {
		EmailErrorMessage.textContent = 'Por favor, insira um e-mail válido no formato: exemplo@dominio.com.'
		submitButton.disabled = true
		return false
  } else {
		EmailErrorMessage.textContent = ''
		submitButton.disabled = false
		return true
  } 
}

function validatePassword() {
  const password = passwordInput.value

  if (!passwordRegex.test(password)) {
		PasswordErrorMessage.textContent = 'A senha deve ter no mínimo 8 caracteres, incluindo: uma constra maiúscula, uma minúscula, um número e um caractere especial (@$!%*?&).'
		submitButton.disabled = true
		return false
  } else {
		PasswordErrorMessage.textContent = ''
		submitButton.disabled = false
		return true
  }
}

emailInput.addEventListener('input', validateEmail)
passwordInput.addEventListener('input', validatePassword)

if (window.location.pathname === '/recuperar-conta/') passwordInput.removeEventListener('input', validatePassword)


form.addEventListener('submit', function (e) {
	if (!validateEmail() || !validatePassword() || !validateRetryPassword() || !validateName()) {
		e.preventDefault()
	}
})