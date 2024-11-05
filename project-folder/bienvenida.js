function mostrarFechaYHoraActual() {
    const ahora = new Date();
    const opcionesFecha = { year: 'numeric', month: 'long', day: 'numeric' };
    const fechaFormateada = ahora.toLocaleDateString('es-ES', opcionesFecha);
    const opcionesHora = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const horaFormateada = ahora.toLocaleTimeString('es-ES', opcionesHora);

    document.getElementById('currentDate').innerText = `${fechaFormateada} - ${horaFormateada}`;
}

// Mostrar la fecha y hora al cargar la página
mostrarFechaYHoraActual();

// Actualizar la hora cada segundo
setInterval(mostrarFechaYHoraActual, 1000);
