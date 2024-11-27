const emailInput = document.getElementById('email') // Campo de entrada para o e-mail
const passwordInput = document.getElementById('password') // Campo de entrada para a senha

const EmailErrorMessage = document.getElementById('email-error') // Elemento para exibir mensagem de erro relacionadas ao e-mail
const PasswordErrorMessage = document.getElementById('password-error') // Elemento para exibir mensagem de erro relacionadas a senha

const form = document.getElementById('form') // Formulário principal
const submitButton = document.getElementById('submit-button') // Botão de envio do formulário

// Expressões regulares para validar o e-mail e a senha
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ // Valida o formato de e-mail (exemplo@dominio.com)
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
// Valida a senha para que contenha:
// - Pelo menos 8 caracteres.
// - Uma letra maiúscula.
// - Uma letra minúscula.
// - Um número.
// - Um caractere especial (@$!%*?&).

// Função para validar o e-mail
function validateEmail() {
  const email = emailInput.value // Obtem o valor do campo de e-mail

  if (!emailRegex.test(email)) { // Valida o e-mail com base na regex
		EmailErrorMessage.textContent = 'Por favor, insira um e-mail válido no formato: exemplo@dominio.com.'
		submitButton.disabled = true // Desabilita o botão de envio
		return false
  } else {
		EmailErrorMessage.textContent = '' // Limpa a mensagem de erro
		submitButton.disabled = false // Habilita o botão de envio
		return true
  } 
}

// Função para validar a senha
function validatePassword() {
  const password = passwordInput.value // Obtem o valor do campo da senha

  if (!passwordRegex.test(password)) { // Valida a senha com base na regex
		PasswordErrorMessage.textContent = 'A senha deve ter no mínimo 8 caracteres, incluindo: uma constra maiúscula, uma minúscula, um número e um caractere especial (@$!%*?&).'
		submitButton.disabled = true // Desabilita o botão de envio
		return false
  } else {
		PasswordErrorMessage.textContent = '' // Limpa a mensagem de erro
		submitButton.disabled = false // Habilita o botão de envio
		return true
  }
}

// Eventos para entrada de dados e ações do usuário
emailInput.addEventListener('input', validateEmail) // Valida o e-mail ao digitar
passwordInput.addEventListener('input', validatePassword) // Valida a senha ao digitar

// Remoção de validação de senha na página de recuperação de conta
if (window.location.pathname === '/recuperar-conta/') { 
  passwordInput.removeEventListener('input', validatePassword)
}

// Validação geral antes do envio do formulário
form.addEventListener('submit', function (e) {
	// Impede o envio do formulário se alguma validação falhar
	if (!validateEmail() || !validatePassword() || !validateRetryPassword() || !validateName()) {
		e.preventDefault() // Impede o envio do formulário
	}
})