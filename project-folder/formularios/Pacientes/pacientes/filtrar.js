document.addEventListener('DOMContentLoaded', () => {
    // Manejo de búsqueda
    document.getElementById('searchInput').addEventListener('input', applyFilters);
    document.getElementById('yearSelect').addEventListener('change', applyFilters);
    document.getElementById('monthSelect').addEventListener('change', applyFilters);
    document.getElementById('daySelect').addEventListener('change', applyFilters);

    // Función para aplicar filtros
    function applyFilters() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const selectedYear = document.getElementById('yearSelect').value;
        const selectedMonth = document.getElementById('monthSelect').value;
        const selectedDay = document.getElementById('daySelect').value;

        const filteredAdmissions = admissions.filter(admission => {
            // Asegúrate de que admission y sus propiedades existen
            if (!admission || typeof admission !== 'object') return false;

            const admissionName = (admission.admission || '').toString(); // Convertir a string
            const patientName = (admission.patient || '').toString(); // Convertir a string
            
            const dateParts = admission.date.split('-');
            const admissionYear = dateParts[2] || '';
            const admissionMonth = dateParts[1] || '';
            const admissionDay = dateParts[0] || '';

            const matchesSearch = 
                admissionName.toLowerCase().includes(searchTerm) || 
                patientName.toLowerCase().includes(searchTerm);
            
            const matchesDate = 
                (!selectedYear || admissionYear === selectedYear) &&
                (!selectedMonth || admissionMonth === selectedMonth) &&
                (!selectedDay || admissionDay === selectedDay);

            return matchesSearch && matchesDate;
        });

        currentPage = 1; // Reinicia página
        renderTable(filteredAdmissions); // Renderiza tabla filtrada
    }
});
