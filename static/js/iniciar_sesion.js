$(document).ready(function () {
    $("#loginForm").submit(function (event) {
        event.preventDefault();
        let isValid = true;

        $(".error-message").hide();
        $(".form-control").removeClass("is-invalid");

        // Validar campo Correo (solo si está vacío)
        if ($("#correo").val().trim() === "") {
            $("#correo").addClass("is-invalid");
            $("#correo").next(".error-message").text("El correo es obligatorio.").show();
            isValid = false;
        }

        // Validar campo Contraseña (solo si está vacío)
        if ($("#clave").val().trim() === "") {
            $("#clave").addClass("is-invalid");
            $("#clave").next(".error-message").text("La contraseña es obligatoria.").show();
            isValid = false;
        }

        // Si ambos campos están llenos, mostrar mensaje
        if (isValid) {
            //alert("Inicio de sesión exitoso.");
            //$("#loginForm")[0].reset();
            const datos = {
                correo: $("#correo").val(),
                clave: $("#clave").val()
            };
        
            $.ajax({
                url: "/core/login/",
                type: "POST",
                data: JSON.stringify(datos),
                contentType: "application/json",
                success: function (response) {
                    alert(response.mensaje);
                    $("#loginForm")[0].reset();
                    // Redirigir  
                     window.location.href = "/viajes";
                },
                error: function (xhr) {
                    const res = xhr.responseJSON;
                    alert(res?.error || "Error al iniciar sesión.");
                }
            });


        }
    });
});
