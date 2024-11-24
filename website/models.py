from django.db import models
from django.conf import settings

class TranslationHistory(models.Model):
  user = models.ForeignKey(
    settings.AUTH_USER_MODEL,  # Refere-se ao modelo de usuário personalizado
    on_delete=models.CASCADE,  # Exclui as traduções se o usuário for deletado
    related_name="translations"  # Permite acessar traduções com user.translations.all()
  )
  source_language = models.CharField(max_length=50)  # Exemplo: 'en', 'pt', etc.
  target_language = models.CharField(max_length=50)  # Exemplo: 'es', 'fr', etc.
  source_text = models.TextField()  # Texto original enviado para tradução
  translated_text = models.TextField()  # Resultado da tradução
  created_at = models.DateTimeField(auto_now_add=True)  # Data e hora da tradução

  class Meta:
    ordering = ["-created_at"]  # Ordena as traduções mais recentes primeiro
    verbose_name = "Histórico de Tradução"
    verbose_name_plural = "Históricos de Tradução"

  def __str__(self):
    return f"Tradução de {self.user.email} ({self.source_language} -> {self.target_language})"