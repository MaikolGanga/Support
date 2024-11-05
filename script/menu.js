document.addEventListener("DOMContentLoaded", function() {
    const toggleSubmenuLinks = document.querySelectorAll('.toggle-submenu');

    toggleSubmenuLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Evita el comportamiento predeterminado del enlace

            const submenuId = this.getAttribute('data-toggle');
            const submenu = document.getElementById(submenuId);
            const icon = this.querySelector('i.bx-chevron-right');

            // Cerrar otros submenús
            const allSubmenus = document.querySelectorAll('.submenu');
            allSubmenus.forEach(sm => {
                if (sm !== submenu) {
                    sm.style.display = 'none';
                    // Quitar la clase de rotación del ícono correspondiente
                    const iconToReset = sm.previousElementSibling.querySelector('i.bx-chevron-right');
                    if (iconToReset) {
                        iconToReset.classList.remove('rotate');
                    }
                }
            });

            // Alternar el submenú actual
            if (submenu.style.display === 'none' || submenu.style.display === '') {
                submenu.style.display = 'block';
                icon.classList.add('rotate'); // Rotar el ícono
            } else {
                submenu.style.display = 'none';
                icon.classList.remove('rotate'); // Volver a la posición original
            }
        });
    });
});
