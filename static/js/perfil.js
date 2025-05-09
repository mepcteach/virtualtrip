$(document).ready(function () {
    $("#modificarPerfilForm").submit(function (event) {
        event.preventDefault();
        let isValid = true;

       
        $(".error-message").hide();
        $(".form-control, .form-select").removeClass("is-invalid");

        // Campos obligatorios
        const campos = ["#nombre", "#apellidos", "#correo", "#direccion", "#telefono", "#clave", "#rol"];
        const mensajes = [
            "El nombre es obligatorio.",
            "Los apellidos son obligatorios.",
            "El correo es obligatorio.",
            "La dirección es obligatoria.",
            "El teléfono es obligatorio.",
            "La clave es obligatoria.",
            "Selecciona un rol."
        ];

        campos.forEach((campo, i) => {
            if ($(campo).val().trim() === "") {
                $(campo).addClass("is-invalid");
                $(campo).next(".error-message").text(mensajes[i]).show();
                isValid = false;
            }
        });

        if (isValid) {
            const datos = {
                nombre: $("#nombre").val(),
                apellidos: $("#apellidos").val(),
                direccion: $("#direccion").val(),
                telefono: $("#telefono").val(),
                clave: $("#clave").val()  // puede estar vacío (para no modificar)
            };

            $.ajax({
                url: "/core/modificar_perfil/",
                type: "POST",
                data: JSON.stringify(datos),
                contentType: "application/json",
                headers: {
                    "X-CSRFToken": getCookie("csrftoken") // solo si usas protección CSRF
                },
                success: function (response) {
                    alert(response.mensaje); 
                    $("#clave").val(""); // Limpiar contraseña
                },
                error: function (xhr) { 
                    const res = xhr.responseJSON;
                    alert(res?.error);
                }
            });
        }
    });

    // Función para obtener el token CSRF desde cookies (si usas @csrf_protect)
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Verifica si este cookie empieza con el nombre que buscamos
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});
