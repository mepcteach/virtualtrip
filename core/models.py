from django.db import models
from django.contrib.auth.hashers import make_password, check_password

# Create your models here.
class Ciudad(models.Model):
    nombre = models.CharField(max_length=100)
    codigo_postal = models.CharField(max_length=10)

    def __str__(self):
        return self.nombre 
    


class Usuario(models.Model):
    nombre = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    correo = models.EmailField(unique=True)
    direccion = models.CharField(max_length=255)
    telefono = models.CharField(max_length=20)

    ROL_CHOICES = [
        (1, 'Administrador'),
        (2, 'Editor'),
        (3, 'Vendedor'),
        (4, 'Invitado'),
    ]
    rol = models.IntegerField(choices=ROL_CHOICES, default=4)

    # Nuevo campo
    contraseña = models.CharField(max_length=128)  # guardará hash

     # Agregar campo last_login
    last_login = models.DateTimeField(null=True, blank=True)

     # Agregar campo is_active
    is_active = models.DateTimeField(null=True, blank=True)
 
    
class Promocion(models.Model):
    titulo = models.CharField(max_length=100)
    descripcion = models.TextField()
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    activa = models.BooleanField(default=True)

    def __str__(self):
        return self.titulo


class Suscriptor(models.Model):
    correo = models.EmailField(unique=True)
    nombre = models.CharField(max_length=100)
    fecha_suscripcion = models.DateTimeField(auto_now_add=True)
    activo = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.nombre} ({self.correo})"
    
    
     #python manage.py makemigrations  
     #python manage.py migrate
