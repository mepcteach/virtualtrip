from django.shortcuts import render
from django.http import JsonResponse
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password, check_password
from .models import Usuario
import json
  

@csrf_exempt
def registrar_usuario(request):
    if request.method == "POST":
        data = json.loads(request.body)

        # Validación de campos obligatorios
        campos_obligatorios = ['nombre', 'apellidos', 'correo', 'direccion', 'telefono', 'clave', 'rol']
        for campo in campos_obligatorios:
            if campo not in data or not data[campo].strip():
                return JsonResponse({'success': False, 'error': f'Campo {campo} es obligatorio.'}, status=400)

        # Validación: correo ya registrado
        if Usuario.objects.filter(correo=data['correo']).exists():
            return JsonResponse({'success': False, 'error': 'El correo ya está registrado.'}, status=409)

        # Crear usuario
        try:
            usuario = Usuario.objects.create(
                nombre=data['nombre'],
                apellidos=data['apellidos'],
                correo=data['correo'],
                direccion=data['direccion'],
                telefono=data['telefono'],
                rol=int(data['rol']),
                contraseña=make_password(data['clave'])
            )
            return JsonResponse({'success': True, 'mensaje': 'Usuario registrado correctamente en Oracle.'})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=500)

    return JsonResponse({'success': False, 'error': 'Método no permitido.'}, status=405)

@csrf_exempt
def iniciar_sesion(request):
    if request.method == "POST":
        data = json.loads(request.body)

        correo = data.get('correo', '').strip()
        clave = data.get('clave', '').strip()

        if not correo or not clave:
            return JsonResponse({'success': False, 'error': 'Correo y contraseña son obligatorios.'}, status=400)

        try:
            usuario = Usuario.objects.get(correo=correo)
            if check_password(clave, usuario.contraseña):

                #Guardar el nombre del usuario en la sesión
                request.session['usuario_id'] = usuario.id
                request.session['usuario_nombre'] = usuario.nombre 

                 # Guardar mas campos relevantes en la sesión 
                request.session['usuario_apellidos'] = usuario.apellidos
                request.session['usuario_correo'] = usuario.correo
                request.session['usuario_direccion'] = usuario.direccion
                request.session['usuario_telefono'] = usuario.telefono
                request.session['usuario_rol'] = usuario.rol

                return JsonResponse({'success': True, 'mensaje': 'Inicio de sesión exitoso.'})
            else:
                return JsonResponse({'success': False, 'error': 'Contraseña incorrecta.'}, status=401)
        except Usuario.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'El correo no está registrado.'}, status=404)

    return JsonResponse({'success': False, 'error': 'Método no permitido.'}, status=405)

@csrf_exempt
def modificar_perfil(request):
    if request.method == "POST":
        data = json.loads(request.body)
        usuario_id = request.session.get('usuario_id')

        if not usuario_id:
            return JsonResponse({'success': False, 'error': 'Usuario no autenticado'}, status=401)

        try:
            usuario = Usuario.objects.get(id=usuario_id)
            usuario.nombre = data.get('nombre', usuario.nombre)
            usuario.apellidos = data.get('apellidos', usuario.apellidos)
            usuario.direccion = data.get('direccion', usuario.direccion)
            usuario.telefono = data.get('telefono', usuario.telefono)

            nueva_clave = data.get('clave', '').strip()
            if nueva_clave:
                usuario.contraseña = make_password(nueva_clave)

            usuario.save()

            return JsonResponse({'success': True, 'mensaje': 'Perfil actualizado correctamente'})
        except Usuario.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Usuario no encontrado'}, status=404)

    return JsonResponse({'success': False, 'error': 'Método no permitido'}, status=405)


@csrf_exempt
def recuperar_clave(request):
    if request.method == "POST":
        data = json.loads(request.body)
        correo = data.get('correo', '').strip().lower()  # Normalizar correo
        try:
            usuario = Usuario.objects.get(correo=correo)
        except Usuario.DoesNotExist:
            return JsonResponse({'error':  correo}, status=400)

        # Codificar el ID del usuario
        uidb64 = urlsafe_base64_encode(force_bytes(usuario.pk))

        # Crear enlace de restablecimiento
        reset_url = f'http://127.0.0.1:8000/restablecer/{uidb64}/'

        # Enviar correo electrónico
        send_mail(
            'Restablecimiento de contraseña',
            f'Para restablecer tu contraseña, haz clic en el siguiente enlace: {reset_url}',
            'no-reply@tudominio.com',
            [correo]
        )

        return JsonResponse({'mensaje': 'Correo enviado con instrucciones para restablecer la contraseña'})
    return render(request, 'recuperar_clave.html')


 