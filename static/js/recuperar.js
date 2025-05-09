$(document).ready(function () {
    $("#recuperarForm").submit(function (event) {
        event.preventDefault();
        let isValid = true;

        $(".error-message").hide();
        $(".form-control").removeClass("is-invalid");

        // Validar campo Correo
        const correo = $("#correo").val().trim();
        if (correo === "") {
            $("#correo").addClass("is-invalid");
            $("#correo").next(".error-message").text("El correo es obligatorio.").show();
            isValid = false;
        }

        if (isValid) {
            // Enviar solicitud al backend (ajusta la URL)
            $.ajax({
                url: "/core/recuperar/",
                type: "POST",
                contentType: "application/json",  // Asegúrate de que el tipo de contenido sea JSON
                data: JSON.stringify({ correo: correo }), 
                success: function(response) {
                    alert(response.mensaje || "Se ha enviado un enlace de recuperación al correo ingresado.");
                    $("#recuperarForm")[0].reset();
                },
                error: function(xhr) {
                    const res = xhr.responseJSON;
                    alert(res?.error || "Error al enviar el enlace.");
                }
            });
        }
    });

    // Función para obtener token CSRF
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let cookie of cookies) {
                cookie = cookie.trim();
                if (cookie.startsWith(name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});
