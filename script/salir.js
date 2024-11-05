document.addEventListener("DOMContentLoaded", function() {
    const salirBtn = document.getElementById('salir-btn');
    const confirmOutModal = document.getElementById('confirm-out');
    const closeModal = document.querySelector('.close');
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');

    // Verifica si los elementos existen antes de añadir event listeners
    if (salirBtn && confirmOutModal) {
        salirBtn.addEventListener('click', function() {
            confirmOutModal.style.display = 'block'; // Muestra el modal de confirmación
        });
    }

    if (closeModal && confirmOutModal) {
        closeModal.addEventListener('click', function() {
            confirmOutModal.style.display = 'none'; // Cierra el modal
        });
    }

    if (noBtn && confirmOutModal) {
        noBtn.addEventListener('click', function() {
            confirmOutModal.style.display = 'none'; // Cierra el modal
        });
    }

    if (yesBtn) {
        yesBtn.addEventListener('click', function() {
            localStorage.removeItem('loggedUser'); // Elimina el usuario logueado
            window.location.href = 'login.html'; // Redirige al login
        });
    }
});
