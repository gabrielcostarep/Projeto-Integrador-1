const copyButton = document.getElementById('copy')
const textLength = document.getElementById('text-length')
const textInput = document.getElementById('text-input')
const textOutput = document.getElementById('text-output')
const clearButton = document.getElementById('clear')
const translateButton = document.getElementById('translate-button')

const menu = document.getElementById('menu')

const sourceLanguage = document.getElementById('source-language')
const targetLanguage = document.getElementById('target-language')

const languageTextOrigin = document.getElementById('language-text-origin')
const languageTextDestination = document.getElementById('language-text-destination')

const switchLanguages = document.getElementById('arrow')

switchLanguages.addEventListener('click', function() {
  const sourceValue = sourceLanguage.value
  const targetValue = targetLanguage.value
  sourceLanguage.value = targetValue
  targetLanguage.value = sourceValue

  textLuanguageOrigin()
  textLuanguageDestination()
})

sourceLanguage.addEventListener('change', function() {
  let selectedValue = sourceLanguage.value
  let options = Array.from(targetLanguage.options)
  let newOption = options.find(option => option.value != selectedValue)
  if (newOption) {
    targetLanguage.value = newOption.value
    textLuanguageDestination()
  }

  textLuanguageOrigin()
})

targetLanguage.addEventListener('change', function() {
  let selectedValue = targetLanguage.value
  let options = Array.from(sourceLanguage.options)
  let newOption = options.find(option => option.value != selectedValue)
  if (newOption) {
    sourceLanguage.value = newOption.value
    textLuanguageOrigin()
  }

  textLuanguageDestination()
})

menu.addEventListener('click', function() {
  const menuContainer = document.querySelector('.menu-container')
  menuContainer.classList.toggle('menu-active')

  if (menuContainer.classList.contains('menu-active')) {
    menu.classList.remove('fa-clock-rotate-left')
    menu.classList.add('fa-times')
  } else {
    menu.classList.remove('fa-times')
    menu.classList.add('fa-clock-rotate-left')
  }
})


clearButton.addEventListener('click', function() {
  textInput.value = ''
  textOutput.textContent = ''
  updateTextLength()
})

copyButton.addEventListener('click', function() {
  const textOutput = document.getElementById('text-output')
  navigator.clipboard.writeText(textOutput.textContent)

  copyButton.classList.add('copied')
  setTimeout(function() {
    copyButton.classList.remove('copied')
  }, 2000)
})

textInput.addEventListener('input', updateTextLength)

function updateTextLength() {
  textLength.textContent = textInput.value.length

  if (textInput.value.length > 1000) {
    textInput.value = textInput.value.slice(0, 999)
  }

  if (textInput.value.length > 0) {
    translateButton.disabled = false
  } else {
    translateButton.disabled = true
  }
}

function textLuanguageOrigin() {
  const selectedOption = sourceLanguage.options[sourceLanguage.selectedIndex];
  languageTextOrigin.textContent = selectedOption.textContent;
}

function textLuanguageDestination() {
  const selectedOption = targetLanguage.options[targetLanguage.selectedIndex];
  languageTextDestination.textContent = selectedOption.textContent;
}

document.addEventListener('DOMContentLoaded', function() {
  textLuanguageOrigin()
  textLuanguageDestination()
})