from django.shortcuts import redirect, render
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.contrib.auth.decorators import login_required
from django.contrib import messages

from django.shortcuts import get_object_or_404

from deep_translator import GoogleTranslator
from .models import TranslationHistory

User = get_user_model() # Obtém o modelo de usuário personalizado do Django

# Função para criação de um novo usuário
def userCreateView(request):
  if request.method == 'POST':
    name = request.POST.get('name')
    email = request.POST.get('email')
    password = request.POST.get('password')
    retry_password = request.POST.get('retry-password')

    # Contexto a ser enviado para o template, inclui os dados preenchidos
    context = {
      'name': name,
      'email': email,
      'password': password,
      'retry_password': retry_password
    }

    # Verifica se o email já está cadastrado
    if not User.objects.filter(email=email).exists():
      user = User.objects.create_user(
        username=email,
        email=email,
        first_name=name,
        password=password
      )
      login(request, user) # Faz login automaticamente após o cadastro
      return redirect('home') # Redireciona para a página inicial
    else:
      messages.error(request, "Email já cadastrado.")
      return render(request, 'cadastro.html', context) # Re-renderiza a página de cadastro com erro e campos preenchidos
    
  return render(request, 'cadastro.html') # Exibe a página de cadastro se a requisição não for POST

# Função de login do usuário
def loginView(request):
  if request.method == 'POST':
    email = request.POST.get('email')
    password = request.POST.get('password')

    # Contexto a ser enviado para o template, inclui os dados preenchidos
    context = {'email': email, 'password': password}

    # Tenta encontrar o usuário pelo email
    try:
      user = User.objects.get(email=email)
    except User.DoesNotExist:
      messages.error(request, "Email não cadastrado.")
      return render(request, 'login.html', context)

    # Tenta autenticar o usuário com as credenciais fornecidas
    user = authenticate(request, username=email, password=password)
    if user is not None:
      login(request, user) # Faz login se a autenticação for bem-sucedida
      return redirect('home')
    else:
      messages.error(request, "Senha incorreta.")
      return render(request, 'login.html', context) # Re-renderiza a página de login com erro e campos preenchidos
    
  return render(request, 'login.html')

# Função de logout
def logoutView(request):
  logout(request) # Faz logout do usuário
  messages.success(request, "Deslogado com sucesso!") # Mensagem de sucesso após logout
  return redirect('login')

# Função que exibe a página de perfil do usuário
@login_required
def perfilView(request):
  user = request.user # Obtém o usuário autenticado
  return render(request, 'perfil.html', {'user': user}) # Renderiza a página de perfil com os dados do usuário

# Função que atualiza o perfil do usuário
@login_required
def update_profile(request):
  user = request.user

  if request.method == 'POST':
    name = request.POST.get('name')
    password = request.POST.get('password')

    # Valida que ao menos um campo foi preenchido
    if not name and not password:
      messages.error(request, "Pelo menos um campo deve ser preenchido.") # Mensagem de erro se nenhum campo for preenchido
      return render(request, 'perfil.html', {'user': user}) # Renderiza a página de perfil com erro

    try:
      if name:
        user.first_name = name # Atualiza o nome do usuário
      if password:
        user.set_password(password) # Atualiza a senha do usuário
      user.save() # Salva as alterações no banco de dados
      login(request, user) # Reautentica o usuário após mudança de senha
      messages.success(request, "Perfil atualizado com sucesso!")
      return redirect('perfil')
    except Exception as e:
      messages.error(request, f"Erro ao atualizar perfil: {e}")
      return render(request, 'perfil.html', {'user': user}) # Renderiza a página de perfil com erro

  return render(request, 'perfil.html', {'user': user})

# Função de recuperação de conta
def recoverView(request):
  return render(request, 'recuperar-conta.html')

# Função principal que exibe a página inicial
@login_required
def homeView(request):
  MAIN_LANGUAGES = {
      "pt": "Português",
      "en": "Inglês",
      "es": "Espanhol",
      "fr": "Français",
      "de": "Alemão",
      "it": "Italiano",
      "ja": "Japonês",
      "zh": "Chinês",
    }
  
  languages = list(MAIN_LANGUAGES.items()) # Converte o dicionário em lista de tuplas (código, nome)

  # Obtém os idiomas selecionados da requisição
  selected_origin = request.GET.get('origin', 'pt')
  selected_destination = request.GET.get('destination', 'en')
  
  if request.method == "GET":
    history = TranslationHistory.objects.filter(user=request.user).order_by('-id') # Exibe o histórico de traduções do usuário

    return render(request, "main.html", {
      "languages": languages,
      "history": history,
      "selected_origin": selected_origin,
      "selected_destination": selected_destination
    })

  elif request.method == "POST":
    # Obtém os dados da tradução (idioma de origem, destino e o texto)
    source_language = request.POST.get("source-language")
    target_language = request.POST.get("target-language")
    text_to_translate = request.POST.get("text-input")

    try:
      # Realiza a tradução com o Google Translator
      translated_text = GoogleTranslator(
        source=source_language, target=target_language
      ).translate(text_to_translate)

      # Salva o histórico de tradução
      TranslationHistory.objects.create(
        user=request.user,
        source_language=source_language,
        target_language=target_language,
        source_text=text_to_translate,
        translated_text=translated_text,
      )

      history = TranslationHistory.objects.filter(user=request.user).order_by('-id')

      return render( request, "main.html", {
        "languages": languages,
        "history": history,
        "text_to_translate": text_to_translate,
        "translated_text": translated_text,
        "selected_origin": source_language, # Passa o idioma de origem e destino para a página
        "selected_destination": target_language # Passa o idioma de origem e destino para a página
      })
    
    except Exception as e:
      return render(request, "main.html", {
        "languages": languages,
        "history": TranslationHistory.objects.filter(user=request.user).order_by('-id'),
        "error": str(e), # Exibe o erro se a tradução falhar
        "selected_origin": selected_origin, # Passa o idioma de origem e destino para a página
        "selected_destination": selected_destination # Passa o idioma de origem e destino para a página
      })
    
  return render(request, "main.html", {
    "languages": languages,
    "selected_origin": selected_origin,
    "selected_destination": selected_destination
  })   

# Função para excluir uma tradução específica do histórico
@login_required
def delete_translation(request):
  if request.method == "POST":
    translation_id = request.POST.get("translation_id")
    try:
      # Obtém a tradução pelo ID e deleta se for do usuário atual
      translation = get_object_or_404(TranslationHistory, id=translation_id, user=request.user)
      translation.delete()

      messages.success(request, "Tradução removida com sucesso!")
    except Exception as e:
      messages.error(request, f"Erro ao remover a tradução: {str(e)}")

    return redirect("home")

  messages.error(request, "Método inválido.") # Mensagem de erro se o método não for POST
  return redirect("home")

# Função para limpar todo o histórico de traduções
@login_required
def clear_history(request):
  try:
    # Deleta todas as traduções do histórico do usuário
    TranslationHistory.objects.filter(user=request.user).delete()
    messages.success(request, "Histórico limpo com sucesso!")
  except Exception as e:
    messages.error(request, f"Erro ao limpar o histórico: {str(e)}")

  return redirect("home")

# Função para excluir a conta do usuário
@login_required
def delete_account(request):
  if request.method == "POST":
    try:
      # Deleta o usuário
      request.user.delete() # Deleta o usuário autenticado
      messages.success(request, "Conta excluída com sucesso!")
    except Exception as e:
      messages.error(request, f"Erro ao excluir a conta: {str(e)}")

    return redirect("login")

  messages.error(request, "Método inválido.") # Mensagem de erro se o método não for POST
  return redirect("perfil")

