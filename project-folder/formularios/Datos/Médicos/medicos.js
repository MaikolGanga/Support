let currentId = 1; // Variable para llevar el control del ID
let medicals = []; // Array para almacenar los médicos
let currentPage = 1; // Página actual
const rowsPerPage = 18; // Filas por página
let editingMedicalId = null; // ID del médico que se está editando
let deletingMedicalId = null; // ID del médico que se va a eliminar

// Event listener para el botón de añadir
document.getElementById('addButton').addEventListener('click', function() {
    document.getElementById('modal').style.display = 'block'; // Abre el modal para añadir
    editingMedicalId = null; // Reinicia el ID al abrir el modal
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

// Agregar o modificar médico
document.getElementById('addForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Evita el envío del formulario
    const medicalInput = document.getElementById('forecastInput').value;
    
    if (editingMedicalId) {
        updateMedical(editingMedicalId, medicalInput); // Modifica el médico existente
    } else {
        addMedical(medicalInput); // Agrega nuevo médico
    }
});

// Función para agregar médico
function addMedical(medicalInput) {
    if (medicalInput) {
        medicals.push({ id: currentId, medical: medicalInput });
        currentId++;
        document.getElementById('addForm').reset(); // Resetea el formulario
        closeModal('modal'); // Cierra el modal
        renderTable(); // Renderiza la tabla
    } else {
        alert("Por favor, ingresa un médico.");
    }
}

// Función para abrir el modal de edición
function openEditModal(id, medical) {
    editingMedicalId = id; // Guarda el ID del médico a editar
    document.getElementById('editForecastInput').value = medical; // Rellena el campo de entrada
    document.getElementById('editModal').style.display = 'block'; // Abre el modal de edición
}

// Evento para guardar los cambios en el formulario de edición
document.getElementById('editForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Evita el envío del formulario
    const editedMedical = document.getElementById('editForecastInput').value;
    updateMedical(editingMedicalId, editedMedical); // Actualiza el médico
});

// Función para actualizar médico
function updateMedical(id, newMedical) {
    const index = medicals.findIndex(m => m.id === id);
    if (index !== -1) {
        medicals[index].medical = newMedical; // Actualiza el valor
        document.getElementById('editForm').reset(); // Resetea el formulario de edición
        closeModal('editModal'); // Cierra el modal
        renderTable(); // Renderiza la tabla
    }
}

// Función para abrir el modal de eliminación
function openDeleteModal(id) {
    deletingMedicalId = id; // Guarda el ID del médico a eliminar
    document.getElementById('deleteModal').style.display = 'block'; // Abre el modal de confirmación
}

// Función para eliminar médico
document.getElementById('confirmDeleteButton').addEventListener('click', function() {
    deleteMedical(deletingMedicalId); // Elimina el médico
    closeModal('deleteModal'); // Cierra el modal de confirmación
});

// Función para eliminar médico
function deleteMedical(id) {
    medicals = medicals.filter(m => m.id !== id); // Filtra los médicos
    reindexMedicals(); // Reindexa los IDs
    renderTable(); // Renderiza la tabla
    showInfoModal(); // Muestra el modal de información
}

// Función para reindexar los IDs
function reindexMedicals() {
    medicals.forEach((medical, index) => {
        medical.id = index + 1; // Actualiza el ID para que sea consecutivo
    });
    currentId = medicals.length > 0 ? medicals[medicals.length - 1].id + 1 : 1; // Actualiza currentId
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
function renderTable(filteredMedicals = medicals) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = ''; // Limpia el cuerpo de la tabla

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, filteredMedicals.length);
    
    for (let i = startIndex; i < endIndex; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" class="itemCheckbox"></td>
            <td>${filteredMedicals[i].id}</td>
            <td>${filteredMedicals[i].medical}</td>
            <td>
                <i class='bx bxs-pencil edit-icon' title='Modificar' onclick='openEditModal(${filteredMedicals[i].id}, "${filteredMedicals[i].medical}")'></i>
                <i class='bx bxs-trash delete-icon' title='Eliminar' onclick='openDeleteModal(${filteredMedicals[i].id})'></i>
            </td>
        `;
        tableBody.appendChild(row);
    }

    updatePagination(filteredMedicals.length); // Actualiza la paginación
}

// Función para manejar la búsqueda
document.getElementById('searchInput').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase(); // Obtiene el término de búsqueda
    const filteredMedicals = medicals.filter(medical => 
        medical.medical.toLowerCase().includes(searchTerm)
    );
    currentPage = 1; // Reinicia a la primera página
    renderTable(filteredMedicals); // Renderiza la tabla con los resultados filtrados
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
    const totalPages = Math.ceil(medicals.length / rowsPerPage);
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
                    const medical = row[1]; // Suponiendo que el médico está en la segunda columna
                    if (medical) {
                        const newId = medicals.length > 0 ? Math.max(...medicals.map(m => m.id)) + 1 : 1;
                        medicals.push({ id: newId, medical: medical }); // Agrega el médico
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
    exportMedicalsToXLSX(); // Llama a la función para exportar
});

// Función para exportar médicos a un archivo XLSX
function exportMedicalsToXLSX() {
    const worksheet = XLSX.utils.json_to_sheet(medicals.map(m => ({
        ID: m.id,
        Médico: m.medical
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Médicos");

    XLSX.writeFile(workbook, 'medicos.xlsx');
}
