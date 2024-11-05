let currentId = 1; // Variable para llevar el control del ID
let forecasts = []; // Array para almacenar las previsiones
let currentPage = 1; // Página actual
const rowsPerPage = 10; // Filas por página
let editingForecastId = null; // ID de la previsión que se está editando
let deletingForecastId = null; // ID de la previsión que se va a eliminar

// Event listener para el botón de añadir
document.getElementById('addButton').addEventListener('click', function() {
    document.getElementById('modal').style.display = 'block'; // Abre el modal para añadir
    editingForecastId = null; // Reinicia el ID al abrir el modal
});

// Cerrar modales
document.querySelectorAll('.close').forEach((element) => {
    element.addEventListener('click', function() {
        closeModal(this.closest('.modal').id); // Cierra el modal
    });
});

// Función para cerrar modales
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none'; // Cierra el modal
}

// Agregar previsión
document.getElementById('addForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Evita el envío del formulario
    const forecastInput = document.getElementById('forecastInput').value;
    
    if (editingForecastId) {
        updateForecast(editingForecastId, forecastInput); // Modifica la previsión existente
    } else {
        addForecast(forecastInput); // Agrega nueva previsión
    }
});

// Función para agregar previsión
function addForecast(forecastInput) {
    if (forecastInput) {
        forecasts.push({ id: currentId, forecast: forecastInput });
        currentId++;
        document.getElementById('addForm').reset(); // Resetea el formulario
        closeModal('modal'); // Cierra el modal
        renderTable(); // Renderiza la tabla
    } else {
        alert("Por favor, ingresa una previsión.");
    }
}

// Función para abrir el modal de edición
function openEditModal(id, forecast) {
    editingForecastId = id; // Guarda el ID de la previsión a editar
    document.getElementById('editForecastInput').value = forecast; // Rellena el campo de entrada
    document.getElementById('editModal').style.display = 'block'; // Abre el modal de edición
}

// Evento para guardar los cambios en el formulario de edición
document.getElementById('editForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Evita el envío del formulario
    const editedForecast = document.getElementById('editForecastInput').value;
    updateForecast(editingForecastId, editedForecast); // Actualiza la previsión
});

// Función para actualizar previsión
function updateForecast(id, newForecast) {
    const index = forecasts.findIndex(f => f.id === id);
    if (index !== -1) {
        forecasts[index].forecast = newForecast; // Actualiza el valor
        document.getElementById('editForm').reset(); // Resetea el formulario de edición
        closeModal('editModal'); // Cierra el modal
        renderTable(); // Renderiza la tabla
    }
}

// Función para abrir el modal de eliminación
function openDeleteModal(id) {
    deletingForecastId = id; // Guarda el ID de la previsión a eliminar
    document.getElementById('deleteModal').style.display = 'block'; // Abre el modal de confirmación
}

// Función para eliminar previsión
document.getElementById('confirmDeleteButton').addEventListener('click', function() {
    deleteForecast(deletingForecastId); // Elimina la previsión
    closeModal('deleteModal'); // Cierra el modal de confirmación
});

// Función para eliminar previsión
function deleteForecast(id) {
    forecasts = forecasts.filter(f => f.id !== id); // Filtra las previsiones
    reindexForecasts(); // Reindexa los IDs
    renderTable(); // Renderiza la tabla
    showInfoModal(); // Muestra el modal de información
}

// Función para reindexar los IDs
function reindexForecasts() {
    forecasts.forEach((forecast, index) => {
        forecast.id = index + 1; // Actualiza el ID para que sea consecutivo
    });
    currentId = forecasts.length > 0 ? forecasts[forecasts.length - 1].id + 1 : 1; // Actualiza currentId
}

// Función para mostrar el modal de información
function showInfoModal() {
    document.getElementById('infoModal').style.display = 'block'; // Abre el modal de información
}

// Cerrar modal de información
document.getElementById('closeInfoButton').addEventListener('click', function() {
    closeModal('infoModal'); // Cierra el modal de información
});

// Función para renderizar la tabla
function renderTable(filteredForecasts = forecasts) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = ''; // Limpia el cuerpo de la tabla

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, filteredForecasts.length);
    
    for (let i = startIndex; i < endIndex; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" class="itemCheckbox"></td>
            <td>${filteredForecasts[i].id}</td>
            <td>${filteredForecasts[i].forecast}</td>
            <td>
                <i class='bx bxs-pencil edit-icon' title='Modificar' onclick='openEditModal(${filteredForecasts[i].id}, "${filteredForecasts[i].forecast}")'></i>
                <i class='bx bxs-trash delete-icon' title='Eliminar' onclick='openDeleteModal(${filteredForecasts[i].id})'></i>
            </td>
        `;
        tableBody.appendChild(row);
    }

    updatePagination(filteredForecasts.length); // Actualiza la paginación
}

// Función para manejar la búsqueda
document.getElementById('searchInput').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase(); // Obtiene el término de búsqueda
    const filteredForecasts = forecasts.filter(forecast => 
        forecast.forecast.toLowerCase().includes(searchTerm)
    );
    currentPage = 1; // Reinicia a la primera página
    renderTable(filteredForecasts); // Renderiza la tabla con los resultados filtrados
});

// Función para actualizar la paginación
function updatePagination(totalItems) {
    const totalPages = Math.ceil(totalItems / rowsPerPage);
    document.getElementById('pageInfo').textContent = `Página ${currentPage} de ${totalPages}`;

    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages || totalPages === 0;
}

// Evento para seleccionar o deseleccionar todas las casillas
document.getElementById('selectAll').addEventListener('change', function() {
    const checkboxes = document.querySelectorAll('.itemCheckbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = this.checked;
    });
});

// Eventos para la paginación
document.getElementById('prevPage').addEventListener('click', function() {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
    }
});

document.getElementById('nextPage').addEventListener('click', function() {
    const totalPages = Math.ceil(forecasts.length / rowsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderTable();
    }
});

// Manejo de importación de archivos XLSX
document.getElementById('importInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];

            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Obtiene datos como un array
            jsonData.forEach((row, index) => {
                if (index > 0) { // Salta la cabecera
                    const forecast = row[1]; // Suponiendo que la previsión está en la segunda columna
                    if (forecast) {
                        const newId = forecasts.length > 0 ? Math.max(...forecasts.map(f => f.id)) + 1 : 1;
                        forecasts.push({ id: newId, forecast: forecast }); // Agrega la previsión
                    }
                }
            });

            renderTable(); // Renderiza la tabla después de importar
        };
        reader.readAsArrayBuffer(file);
    }
});

// Evento para el botón de exportar
document.getElementById('exportButton').addEventListener('click', function() {
    exportForecastsToXLSX(); // Llama a la función para exportar
});

// Función para exportar previsiones a un archivo XLSX
function exportForecastsToXLSX() {
    const worksheet = XLSX.utils.json_to_sheet(forecasts.map(f => ({
        ID: f.id,
        Previsión: f.forecast
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Previsiones");

    XLSX.writeFile(workbook, 'previsiones.xlsx');
}