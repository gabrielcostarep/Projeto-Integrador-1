from django.shortcuts import redirect, render
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.contrib.auth.decorators import login_required
from django.contrib import messages

from django.shortcuts import get_object_or_404

from deep_translator import GoogleTranslator
from .models import TranslationHistory

User = get_user_model()

def userCreateView(request):
  if request.method == 'POST':
    name = request.POST.get('name')
    email = request.POST.get('email')
    password = request.POST.get('password')
    retry_password = request.POST.get('retry-password')

    context = {
      'name': name,
      'email': email,
      'password': password,
      'retry_password': retry_password
    }

    if not User.objects.filter(email=email).exists():
      user = User.objects.create_user(
        username=email,
        email=email,
        first_name=name,
        password=password
      )
      login(request, user)
      return redirect('home')
    else:
      messages.error(request, "Email já cadastrado.")
      return render(request, 'cadastro.html', context)
  return render(request, 'cadastro.html')

def loginView(request):
  if request.method == 'POST':
    email = request.POST.get('email')
    password = request.POST.get('password')

    context = {'email': email, 'password': password}

    try:
      user = User.objects.get(email=email)
    except User.DoesNotExist:
      messages.error(request, "Email não cadastrado.")
      return render(request, 'login.html', context)

    user = authenticate(request, username=email, password=password)
    if user is not None:
      login(request, user)
      next = request.POST.get('next')
      return redirect(next.strip('/') or 'home')
    else:
      messages.error(request, "Senha incorreta.")
      return render(request, 'login.html', context)
  return render(request, 'login.html')

def logoutView(request):
  logout(request)
  messages.success(request, "Deslogado com sucesso!")
  return redirect('login')

@login_required
def perfilView(request):
  user = request.user
  return render(request, 'perfil.html', {'user': user})

@login_required
def update_profile(request):
  user = request.user

  if request.method == 'POST':
    name = request.POST.get('name')
    password = request.POST.get('password')

    try:
      if name:
        user.first_name = name
      if password:
        user.set_password(password)
      user.save()
      login(request, user)
      messages.success(request, "Perfil atualizado com sucesso!")
      return redirect('perfil')
    except Exception as e:
      messages.error(request, f"Erro ao atualizar perfil: {e}")

  return render(request, 'perfil.html', {'user': user})

def recoverView(request):
  return render(request, 'recuperar-conta.html')

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
  
  languages = list(MAIN_LANGUAGES.items())
  
  if request.method == "GET":
    history = TranslationHistory.objects.filter(user=request.user).order_by('-id')

    return render(request, "main.html", {"languages": languages, "history": history})

  elif request.method == "POST":
    source_language = request.POST.get("source-language")
    target_language = request.POST.get("target-language")
    text_to_translate = request.POST.get("text-input")

    try:
      translated_text = GoogleTranslator(
        source=source_language, target=target_language
      ).translate(text_to_translate)

      TranslationHistory.objects.create(
        user=request.user,
        source_language=source_language,
        target_language=target_language,
        source_text=text_to_translate,
        translated_text=translated_text,
      )

      history = TranslationHistory.objects.filter(user=request.user).order_by('-id')

      return render( request, "main.html", { "languages": languages, "history": history, "text_to_translate": text_to_translate,"translated_text": translated_text})
    except Exception as e:
      return render(request, "main.html", { "languages": languages, "history": TranslationHistory.objects.filter(user=request.user).order_by('-id'), "error": str(e)})
  return render(request, "main.html", {"languages": languages})   
  
@login_required
def delete_translation(request):
  if request.method == "POST":
    translation_id = request.POST.get("translation_id")
    try:
      translation = get_object_or_404(TranslationHistory, id=translation_id, user=request.user)
      translation.delete()

      messages.success(request, "Tradução removida com sucesso!")
    except Exception as e:
      messages.error(request, f"Erro ao remover a tradução: {str(e)}")

    return redirect("home")

  messages.error(request, "Método inválido.")
  return redirect("home")

@login_required
def clear_history(request):
  try:
    TranslationHistory.objects.filter(user=request.user).delete()
    messages.success(request, "Histórico limpo com sucesso!")
  except Exception as e:
    messages.error(request, f"Erro ao limpar o histórico: {str(e)}")

  return redirect("home")