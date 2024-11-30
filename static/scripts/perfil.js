const form = document.getElementById('form') // Formulário de edição do perfil
const editButton = document.getElementById('submit-button') // Botão de edição do formulário
const fullName = document.getElementById('full-name') // Campo de entrada para o nome completo
const passwordInput = document.getElementById('password') // Campo de entrada para a senha
const nameErrorMessage = document.getElementById('name-error') // Elemento para exibir mensagem de erro relacionadas ao nome
const PasswordErrorMessage = document.getElementById('password-error') // Elemento para exibir mensagem de erro relacionadas a senha

// Expressão regular para validar a senha
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
// A senha deve conter pelo menos:
// - 8 caracteres
// - Uma letra maiúscula
// - Uma letra minúscula
// - Um número
// - Um caractere especial (@$!%*?&)

// Obtendo e formatando a data atual
const date = new Date() // Cria um objeto de data atual
const dayWeek = date.toLocaleString('pt-BR', { weekday: 'long' }) // Dia da semana em português
const dayMonth = date.toLocaleString('pt-BR', { day: 'numeric' }) // Dia do mês
const month = date.toLocaleString('pt-BR', { month: 'long' }) // Nome do mês
const year = date.toLocaleString('pt-BR', { year: 'numeric' }) // Ano com 4 dígitos

const dateFormatted = `${dayWeek}, ${dayMonth} de ${month} ${year}` // Data formatada em um texto legível

document.getElementById('date').innerHTML = dateFormatted

// Função para validar a senha
function validatePassword() {
  const password = passwordInput.value // Obtem o valor do campo da senha

  if (password.length === 0) { // Caso o campo da senha esteja vazio
    PasswordErrorMessage.textContent = '' // Limpa a mensagem de erro
    editButton.disabled = false // Mantém o botão de edição habilitado
    return true
  }

  if (!passwordRegex.test(password)) { // Valida a senha com base na regex
		PasswordErrorMessage.textContent = 'A senha deve ter no mínimo 8 caracteres, incluindo: uma letra maiúscula, uma minúscula, um número e um caractere especial (@$!%*?&).'
		editButton.disabled = true // Desabilita o botão de edição
		return false
  } else {
		PasswordErrorMessage.textContent = '' // Remove a mensagem de erro se a validação for bem-sucedida
		editButton.disabled = false // Habilita o botão de edição
		return true
  }
}

// Função para validar o nome do usuário
function validateName() {
  if (nameInput.value.length < 3) { // Verifica se o nome possui menos de 3 caracteres
    nameErrorMessage.textContent = 'O nome deve ter pelo menos 3 caracteres.' // Exibe mensagem de erro
    submitButton.disabled = true // Desabilita o botão de edição
    return false
  } else {
    nameErrorMessage.textContent = '' // Limpa a mensagem de erro caso a validação seja bem-sucedida
    submitButton.disabled = false // Habilita o botão de edição
    return true
  }
}

// Eventos para entrada de dados e ações do usuário
passwordInput.addEventListener('input', validatePassword) // Valida a senha ao digitar
fullName.addEventListener('input', validateName) // Valida o nome ao digitar

// Validação do formulário antes de enviar
form.addEventListener('submit', function (e) {
	if (!validatePassword() || !validateName()) { // Verifica se as validações foram bem-sucedidas
		e.preventDefault() // Impede o envio do formulário
	}
})

document.addEventListener("DOMContentLoaded", function () {
  const deleteAccountButton = document.getElementById("delete-account");
  const deleteModal = document.getElementById("delete-modal");
  const cancelDeleteButton = document.querySelector(".cancel-delete");

  // Abre o modal ao clicar no botão de exclusão
  deleteAccountButton.addEventListener("click", function () {
    deleteModal.style.display = "block";
  });

  // Fecha o modal ao clicar no botão de cancelar
  cancelDeleteButton.addEventListener("click", function () {
    deleteModal.style.display = "none";
  });

  // Fecha o modal ao clicar fora do conteúdo do modal
  window.addEventListener("click", function (event) {
    if (event.target === deleteModal) {
      deleteModal.style.display = "none";
    }
  });
});