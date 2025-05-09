from django.urls import path 
from . import views

urlpatterns = [
    path('registrar/', views.registrar_usuario, name='registrar_usuario'),
    path('login/', views.iniciar_sesion, name='iniciar_sesion'),
    path('modificar_perfil/', views.modificar_perfil, name='modificar_perfil'),
    path('recuperar/', views.recuperar_clave, name='recuperar_clave'), 
]