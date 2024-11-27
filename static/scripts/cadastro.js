const togglePassword = document.getElementById('togglePassword') // Botão para alternar a visibilidade da senha
const nameInput = document.getElementById('name') // Campo de entrada para o nome do usuário
const retryPasswordInput = document.getElementById('retry-password') // Campo para confirmação da senha

const nameErrorMessage = document.getElementById('name-error') // Elemento para exibir mensagem de erro relacionadas ao nome
const retryPasswordErrorMessage = document.getElementById('retry-password-error') // Elemento para exibir mensagem de erro relacionadas a confirmação da senha

// Função para validar a confirmação da senha
function validateRetryPassword() {
  if (passwordInput.value !== retryPasswordInput.value) { // Verifica se a senha e a confirmação da senha são diferentes
    retryPasswordErrorMessage.textContent = 'As senhas devem ser iguais.' // Exibe mensagem de erro
    submitButton.disabled = true // Desabilita o botão de envio
    return false
  } else {
    retryPasswordErrorMessage.textContent = '' // Limpa a mensagem de erro caso a validação seja bem-sucedida
    submitButton.disabled = false // Habilita o botão de envio
    return true
  }
}

// Função para validar o nome do usuário
function validateName() {
  if (nameInput.value.length < 3) { // Verifica se o nome possui menos de 3 caracteres
    nameErrorMessage.textContent = 'O nome deve ter pelo menos 3 caracteres.' // Exibe mensagem de erro
    submitButton.disabled = true // Desabilita o botão de envio
    return false
  } else {
    nameErrorMessage.textContent = '' // Limpa a mensagem de erro caso a validação seja bem-sucedida
    submitButton.disabled = false // Habilita o botão de envio
    return true
  }
}

// Função para alternar a visibilidade da senha
function togglePasswordVisibility() {
  if (passwordInput.type === "password") { // Verifica se a senha está oculta
    passwordInput.type = "text" // Torna o campo de senha visível
    retryPasswordInput.type = "text"
    togglePassword.classList.add("fa-eye") // Altera o icone do botão para "olho aberto"
    togglePassword.classList.remove("fa-eye-slash") // Remove o icone de "olho fechado"
  } else {
    passwordInput.type = "password" // Torna o campo de senha oculto
    retryPasswordInput.type = "password"
    togglePassword.classList.add("fa-eye-slash") // Altera o icone do botão para "olho fechado"
    togglePassword.classList.remove("fa-eye") // Remove o icone de "olho aberto"
  }
}

// Connfiguração de eventos para entrada de dados e ações do usuário
passwordInput.addEventListener('input', validateRetryPassword) // Valida a senha ao alterar a senha principal
retryPasswordInput.addEventListener('input', validateRetryPassword) // Garante que a confirmação da senha seja validada
nameInput.addEventListener('input', validateName) // Garante que o nome seja validado
togglePassword.addEventListener('click', togglePasswordVisibility) // Alternar a visibilidade da senha ao clicar no ícone