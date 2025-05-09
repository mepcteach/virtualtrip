$(document).ready(function () {
    $("#registroForm").submit(function (event) {
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
          // alert("Usuario nuevo registrado correctamente.");
          // $("#registroForm")[0].reset();

         const datos = {
            nombre: $("#nombre").val(),
            apellidos: $("#apellidos").val(),
            correo: $("#correo").val(),
            direccion: $("#direccion").val(),
            telefono: $("#telefono").val(),
            clave: $("#clave").val(),
            rol: $("#rol").val()
        };

        $.ajax({
            url: "/core/registrar/",
            type: "POST",
            data: JSON.stringify(datos),
            contentType: "application/json",
            success: function (response) {
                alert(response.mensaje);
                $("#registroForm")[0].reset();
            },
            error: function (xhr) {
                const res = xhr.responseJSON;
                alert(res?.error || "Error al registrar.");
            }
        });

            
        }
    });
});
