// Inicialización de Flatpickr para "Fecha desde"
flatpickr("#search-fecha-desde", {
    dateFormat: "Y-m-d", 
    maxDate: "today", // No permitir fechas futuras
    placeholder: "Selecciona la fecha desde...",
    onChange: function(selectedDates, dateStr, instance) {
        // Cuando se cambia "Fecha desde", actualiza la fecha mínima de "Fecha hasta"
        const fechaHasta = flatpickr("#search-fecha-hasta");
        fechaHasta.set('minDate', selectedDates[0]); // Establecer la fecha mínima de "Fecha hasta"
    }
});

// Inicialización de Flatpickr para "Fecha hasta"
flatpickr("#search-fecha-hasta", {
    dateFormat: "Y-m-d", 
    maxDate: "today", // No permitir fechas futuras
    placeholder: "Selecciona la fecha hasta..."
});
