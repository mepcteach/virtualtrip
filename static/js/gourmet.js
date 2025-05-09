$(document).ready(function() {
    $.get("/api/categorias/", function(data) {
        if (data.categories && data.categories.length > 0) {
            data.categories.forEach(function(categoria) {
                $("#categorias").append(`
                    <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                        <div class="card h-100 shadow-sm">
                            <img src="${categoria.strCategoryThumb}" class="card-img-top" alt="${categoria.strCategory}">
                            <div class="card-body">
                                <h5 class="card-title">${categoria.strCategory}</h5>
                                <p class="card-text text-truncate">${categoria.strCategoryDescription}</p>
                            </div>
                        </div>
                    </div>
                `);
            });
        } else {
            $("#categorias").html('<p class="text-danger">No se encontraron categorías.</p>');
        }
    }).fail(function() {
        $("#categorias").html('<p class="text-danger">Error al cargar los datos.</p>');
    });
});