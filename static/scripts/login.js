const togglePassword = document.getElementById('togglePassword') // Botão para alternar a visibilidade da senha

// Alternar a visibilidade da senha ao clicar no botão
togglePassword.addEventListener('click', function() {
  if(passwordInput.type === "password") { // Verifica se a senha está oculta
    passwordInput.type = "text" // Torna o campo de senha visível
    togglePassword.classList.add("fa-eye") // Altera o icone do botão para "olho aberto"
    togglePassword.classList.remove("fa-eye-slash") // Remove o icone de "olho fechado"
  }
  else {
    passwordInput.type = "password" // Torna o campo de senha oculto
    togglePassword.classList.add("fa-eye-slash") // Altera o icone do botão para "olho fechado"
    togglePassword.classList.remove("fa-eye") // Remove o icone de "olho aberto"
  }
})
