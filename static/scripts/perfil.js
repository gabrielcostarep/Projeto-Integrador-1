const form = document.getElementById('form')
const editButton = document.getElementById('submit-button')
const fullName = document.getElementById('full-name')
const passwordInput = document.getElementById('password')
const nameErrorMessage = document.getElementById('name-error')
const PasswordErrorMessage = document.getElementById('password-error')

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

const data = new Date()
const diaSemana = data.toLocaleString('pt-BR', { weekday: 'long' })
const diaMes = data.toLocaleString('pt-BR', { day: 'numeric' })
const mes = data.toLocaleString('pt-BR', { month: 'long' })
const ano = data.toLocaleString('pt-BR', { year: 'numeric' })

const dataFormatada = `${diaSemana}, ${diaMes} de ${mes} ${ano}`

document.getElementById('date').innerHTML = dataFormatada

function getDate() {
  const data = new Date()
  const diaSemana = data.toLocaleString('pt-BR', { weekday: 'long' })
  const diaMes = data.toLocaleString('pt-BR', { day: 'numeric' })
  const mes = data.toLocaleString('pt-BR', { month: 'long' })
  const ano = data.toLocaleString('pt-BR', { year: 'numeric' })

  const dataFormatada = `${diaSemana}, ${diaMes} de ${mes} ${ano}`

  document.getElementById('date').innerHTML = dataFormatada
}

getDate()

function validatePassword() {
  const password = passwordInput.value

  if (password.length === 0) {
    PasswordErrorMessage.textContent = ''
    editButton.disabled = false
    return true
  }

  if (!passwordRegex.test(password)) {
		PasswordErrorMessage.textContent = 'A senha deve ter no mínimo 8 caracteres, incluindo: uma letra maiúscula, uma minúscula, um número e um caractere especial (@$!%*?&).'
		editButton.disabled = true
		return false
  } else {
		PasswordErrorMessage.textContent = ''
		editButton.disabled = false
		return true
  }
}

function validateName() {
  if (fullName.value.length < 3) {
    nameErrorMessage.textContent = 'O nome deve ter pelo menos 3 caracteres.'
    editButton.disabled = true
    return false
  } else {
    nameErrorMessage.textContent = ''
    editButton.disabled = false
    return true
  }
}

passwordInput.addEventListener('input', validatePassword)
fullName.addEventListener('input', validateName)

form.addEventListener('submit', function (e) {
	if (!validatePassword() || !validateName()) {
		e.preventDefault()
	}
})

document.addEventListener('DOMContentLoaded', function() {
  const messages = document.getElementById('message-list');
  if (messages) {
    setTimeout(() => {
        messages.style.display = 'none';
    }, 5000);
  }
});