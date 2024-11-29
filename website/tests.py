from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from django.test import Client
from django.contrib.messages import get_messages

from .models import TranslationHistory

User = get_user_model()

class UserViewsTestCase(TestCase):

  def setUp(self):
    """Cria um usuário para testar as views"""
    self.user = User.objects.create_user(
      username="testuser@example.com", # Usando o e-mail como username
      email="testuser@example.com",
      first_name="Test User", # Usando name como first_name
      password="testpassword",
    )
    self.client = Client()

  def test_user_create_view_success(self):
    """Testa a criação de um novo usuário"""
    response = self.client.post(reverse('cadastrar'), {
      'username': 'newuser@example.com',
      'email': 'newuser@example.com',
      'name': 'Test User',
      'password': 'newpassword',
    })
    self.assertRedirects(response, reverse('home'))  # Redireciona após o login
    self.assertTrue(User.objects.filter(email="newuser@example.com").exists())
  
  def test_user_create_view_existing_email(self):
    """Testa a criação de um usuário com e-mail já existente"""
    response = self.client.post(reverse('cadastrar'), {
      'username': 'testuser@example.com',
      'email': 'testuser@example.com',
      'name': 'Test User',
      'password': 'testpassword',
    })
    self.assertContains(response, "Email já cadastrado.")
  
  def test_login_view_success(self):
    """Testa o login do usuário"""
    response = self.client.post(reverse('login'), {
      'email': 'testuser@example.com',
      'password': 'testpassword'
    })
    self.assertRedirects(response, reverse('home'))
  
  def test_login_view_invalid_email(self):
    """Testa o login com e-mail inválido"""
    response = self.client.post(reverse('login'), {
      'email': 'wrongemail@example.com',
      'password': 'testpassword'
    })
    self.assertContains(response, "Email não cadastrado.")
  
  def test_login_view_invalid_password(self):
    """Testa o login com senha incorreta"""
    response = self.client.post(reverse('login'), {
      'email': 'testuser@example.com',
      'password': 'wrongpassword'
    })
    self.assertContains(response, "Senha incorreta.")

  def test_logout_view(self):
    """Testa o logout do usuário"""
    self.client.login(username='testuser@example.com', password='testpassword')
    response = self.client.get(reverse('logout'))
    self.assertRedirects(response, reverse('login'))
    self.assertNotIn('_auth_user_id', self.client.session)  # Verifica se o usuário foi deslogado
  
  def test_perfil_view_authenticated(self):
    """Testa a visualização do perfil do usuário autenticado"""
    self.client.login(username='testuser@example.com', password='testpassword')
    response = self.client.get(reverse('perfil'))
    self.assertEqual(response.status_code, 200)
    self.assertContains(response, 'Test User')  # Verifique se o nome está na página
  
  def test_update_profile_view(self):
    """Testa a atualização do perfil do usuário"""
    self.client.login(username='testuser@example.com', password='testpassword')
    response = self.client.post(reverse('atualizar-perfil'), {
      'name': 'Updated User',
      'password': 'newpassword'
    })
    self.assertRedirects(response, reverse('perfil'))
    self.user.refresh_from_db()
    self.assertEqual(self.user.first_name, 'Updated User')  # Verifica se o nome foi atualizado
  
  def test_update_profile_view_invalid(self):
    """Testa a atualização do perfil com dados inválidos"""
    self.client.login(username='testuser@example.com', password='testpassword')
    response = self.client.post(reverse('atualizar-perfil'), {
        'name': '',  # Campo inválido
        'password': '',  # Campo inválido
    })
    self.assertEqual(response.status_code, 200)
    
    # Verifica se a mensagem de erro está presente
    self.assertContains(response, "Pelo menos um campo deve ser preenchido.")
    
  def test_home_view_authenticated(self):
    """Testa a visualização da home para um usuário autenticado"""
    self.client.login(username='testuser@example.com', password='testpassword')
    response = self.client.get(reverse('home'))
    self.assertEqual(response.status_code, 200)  # Espera o código de status 200
  
  def test_home_view_unauthenticated(self):
    """Testa o acesso à home sem autenticação"""
    response = self.client.get(reverse('home'))
    
    # Verificando se o redirecionamento para login está correto, incluindo o parâmetro 'next'
    self.assertRedirects(response, reverse('login') + '?next=' + reverse('home'))
  
  def test_clear_history(self):
    """Testa a limpeza do histórico de traduções"""
    self.client.login(username='testuser@example.com', password='testpassword')
    # Cria um histórico de tradução
    TranslationHistory.objects.create(
      user=self.user,
      source_language="pt",
      target_language="en",
      source_text="Olá",
      translated_text="Hello"
    )
    response = self.client.get(reverse('limpar-historico'))
    self.assertRedirects(response, reverse('home'))
    self.assertEqual(TranslationHistory.objects.filter(user=self.user).count(), 0)  # Verifica se o histórico foi limpo
  
  def test_delete_translation(self):
    """Testa a remoção de uma tradução do histórico"""
    self.client.login(username='testuser@example.com', password='testpassword')
    translation = TranslationHistory.objects.create(
      user=self.user,
      source_language="pt",
      target_language="en",
      source_text="Olá",
      translated_text="Hello"
    )
    response = self.client.post(reverse('deletar-traducao'), {'translation_id': translation.id})
    self.assertRedirects(response, reverse('home'))
    self.assertEqual(TranslationHistory.objects.filter(user=self.user).count(), 0)  # Verifica se a tradução foi removida

  def test_delete_account_success(self):
    """Testa a exclusão do usuário"""
    self.client.login(username='testuser@example.com', password='testpassword')
    # Faz uma requisição POST para a URL de exclusão
    response = self.client.post(reverse("deletar-conta"))
    
    # Verifica se o usuário foi excluído
    with self.assertRaises(User.DoesNotExist):
      User.objects.get(username="testuser@example.com")

    # Verifica se o redirecionamento ocorreu para a página de login
    self.assertRedirects(response, reverse("login"))

    # Verifica se a mensagem de sucesso está na storage de mensagens
    messages = list(get_messages(response.wsgi_request))
    self.assertIn("Conta excluída com sucesso!", [m.message for m in messages])

  def test_delete_account_invalid_method(self):
    """Testa a tentativa de exclusão do usuário com um método inválido"""
    self.client.login(username='testuser@example.com', password='testpassword')
    # Faz uma requisição GET para a URL de exclusão
    response = self.client.get(reverse("deletar-conta"))
    
    # Verifica se o usuário ainda existe
    self.assertTrue(User.objects.filter(username="testuser@example.com").exists())

    # Verifica se o redirecionamento ocorreu para a página inicial
    self.assertRedirects(response, reverse("perfil"))

    # Verifica se a mensagem de erro está na storage de mensagens
    messages = list(get_messages(response.wsgi_request))
    self.assertIn("Método inválido.", [m.message for m in messages])