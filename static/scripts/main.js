const copyButton = document.getElementById('copy') // Botão para copiar o texto traduzido
const textLength = document.getElementById('text-length') // Exibe a contagem de caracteres do texto de entrada
const textInput = document.getElementById('text-input') // Área de texto para entrada do texto a ser traduzido
const textOutput = document.getElementById('text-output') // Elemento que exibe o texto traduzido
const clearButton = document.getElementById('clear') // Botão para limpar o texto de entrada e o resultado
const translateButton = document.getElementById('translate-button') // Botão para  fazer a tradução

const menu = document.getElementById('menu') // Ícone do menu para alternar a exibição do histórico

const sourceLanguage = document.getElementById('source-language') // Dropdown para selecionar o idioma de origem
const targetLanguage = document.getElementById('target-language') // Dropdown para selecionar o idioma de destino

const languageTextOrigin = document.getElementById('language-text-origin') // Exibe o nome do idioma de origem selecionado
const languageTextDestination = document.getElementById('language-text-destination') // Exibe o nome do idioma de destino selecionado

const switchLanguages = document.getElementById('arrow') // Botão para alternar os idiomas de origem e destino

// Alterna os valores entre os idiomas de origem e destino e atualiza os textos associados
switchLanguages.addEventListener('click', function() {
  const sourceValue = sourceLanguage.value
  const targetValue = targetLanguage.value
  sourceLanguage.value = targetValue
  targetLanguage.value = sourceValue

  textLuanguageOrigin() // Atualiza o texto do idioma de origem
  textLuanguageDestination() // Atualiza o texto do idioma de destino
})

// Atualiza o texto exibido e garante que o idioma de destino não seja igual ao de origem ao alterar o idioma de origem
sourceLanguage.addEventListener('change', function() {
  let selectedValue = sourceLanguage.value
  let options = Array.from(targetLanguage.options)
  let newOption = options.find(option => option.value != selectedValue) // Busca uma nova opção diferente da selecionada
  if (newOption) {
    targetLanguage.value = newOption.value
    textLuanguageDestination() // Atualiza o texto do idioma de destino
  }

  textLuanguageOrigin() // Atualiza o texto do idioma de origem
})

// Atualiza o texto exibido e garante que o idioma de origem não seja igual ao de destino ao alterar o idioma de destino
targetLanguage.addEventListener('change', function() {
  let selectedValue = targetLanguage.value
  let options = Array.from(sourceLanguage.options)
  let newOption = options.find(option => option.value != selectedValue) // Busca uma nova opção diferente da selecionada
  if (newOption) {
    sourceLanguage.value = newOption.value
    textLuanguageOrigin() // Atualiza o texto do idioma de origem
  }

  textLuanguageDestination() // Atualiza o texto do idioma de destino
})

// Alterna a visibilidade do menu e altera o icone de "fechar" ou de "relógio"
menu.addEventListener('click', function() {
  const menuContainer = document.querySelector('.menu-container')
  menuContainer.classList.toggle('menu-active')

  if (menuContainer.classList.contains('menu-active')) {
    menu.classList.remove('fa-clock-rotate-left') // Remove o ícone de relógio
    menu.classList.add('fa-times') // Adiciona o ícone de "fechar"
  } else {
    menu.classList.remove('fa-times') // Remove o ícone de "fechar"
    menu.classList.add('fa-clock-rotate-left') // Adiciona o ícone de relógio
  }
})

// Limpa o texto de entrada, o resultado traduzido e reseta a contagem de caracteres
clearButton.addEventListener('click', function() {
  textInput.value = ''
  textOutput.textContent = ''
  updateTextLength() // Atualiza a contagem de caracteres após limpar o texto
})

// Copia o texto traduzido para a área de transferência e exibe um feedback visual
copyButton.addEventListener('click', function() {
  const textOutput = document.getElementById('text-output')
  navigator.clipboard.writeText(textOutput.textContent) // Copia o texto para o clipboard

  copyButton.classList.add('copied') // Adiciona uma classe de feedback visual
  setTimeout(function() {
    copyButton.classList.remove('copied') // Remove o feedback após 2 segundos
  }, 2000)
})

// Atualiza a contagem de caracteres no texto de entrada e habilita/desabilita o botão de tradução
textInput.addEventListener('input', updateTextLength)

function updateTextLength() {
  textLength.textContent = textInput.value.length // Exibe o número de caracteres digitados

  if (textInput.value.length > 1000) {
    textInput.value = textInput.value.slice(0, 999) // Limita o número de caracteres a 1000
  }

  // Habilita o botão de tradução se houver texto, caso contrário, desabilita
  if (textInput.value.length > 0) {
    translateButton.disabled = false
  } else {
    translateButton.disabled = true
  }
}

// Atualiza o texto do idioma de origem exibido com base na seleção atual
function textLuanguageOrigin() {
  const selectedOption = sourceLanguage.options[sourceLanguage.selectedIndex];
  languageTextOrigin.textContent = selectedOption.textContent;
}

// Atualiza o texto do idioma de destino exibido com base na seleção atual
function textLuanguageDestination() {
  const selectedOption = targetLanguage.options[targetLanguage.selectedIndex];
  languageTextDestination.textContent = selectedOption.textContent;
}

// Garante que os textos de origem e destino sejam atualizados assim que o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
  textLuanguageOrigin()
  textLuanguageDestination()
})

document.addEventListener('DOMContentLoaded', () => {
  // Seleciona todos os elementos com a classe 'history-content'
  const historyItems = document.querySelectorAll('.history-content');

  // Seleciona os elementos do formulário que serão atualizados
  const sourceLanguageSelect = document.getElementById('source-language');
  const targetLanguageSelect = document.getElementById('target-language');
  const textInput = document.getElementById('text-input');
  const textOutput = document.getElementById('text-output');

  // Adiciona um evento de clique a cada item do histórico
  historyItems.forEach(item => {
    item.addEventListener('click', () => {
      // Obtém os valores das línguas de origem e destino, texto original e traduzido
      const sourceLanguage = item.querySelector('#sourceLanguage').textContent.trim();
      const targetLanguage = item.querySelector('#targetLanguage').textContent.trim();
      const sourceText = item.querySelector('.source-result').textContent.trim();
      const targetText = item.querySelector('.target-result').textContent.trim();

      // Atualiza os campos do formulário
      sourceLanguageSelect.value = sourceLanguage;
      targetLanguageSelect.value = targetLanguage;
      textInput.value = sourceText;
      textOutput.textContent = targetText;

      // Desabilita o botão de tradução, até uma alteração seja feita
      const translateButton = document.getElementById('translate-button');
      if (translateButton) {
        translateButton.disabled = true;
      }
    });
  });
});