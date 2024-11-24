from django.urls import path

from website import views

urlpatterns = [
    path('cadastrar/', views.userCreateView, name='cadastrar'),
    path('login/', views.loginView, name='login'),
    path('logout/', views.logoutView, name='logout'),
    path('perfil/', views.perfilView, name='perfil'),
    path('atualizar-perfil/', views.update_profile, name='atualizar-perfil'),
    path('recuperar-conta/', views.recoverView, name='recuperar-conta'),
    path('', views.homeView, name='home'),
    path("deletar-traducao/", views.delete_translation, name="deletar-traducao"),
    path("limpar-historico/", views.clear_history, name="limpar-historico"),
]
