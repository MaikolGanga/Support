document.addEventListener("DOMContentLoaded", function() {
    // Cargar la página principal por defecto
    const iframe = document.getElementById("formulario-iframe");
    iframe.src = "project-folder/bienvenida.html"; // Cambia esto si la ruta es diferente

    // Selecciona todos los enlaces con la clase 'formulario-link'
    const links = document.querySelectorAll('.formulario-link');

    // Agrega un evento click a cada enlace
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Evita el comportamiento por defecto del enlace
            const target = this.getAttribute('data-target'); // Obtiene la ruta del atributo data-target
            iframe.src = target; // Cambia la fuente del iframe
        });
    });
});
