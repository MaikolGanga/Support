let currentId = 1; // Control del ID
let admissions = []; // Almacena admisiones
let currentPage = 1; // Página actual
const rowsPerPage = 18; // Filas por página
let editingAdmissionId = null; // ID de la admisión que se edita
let deletingAdmissionId = null; // ID de la admisión que se eliminará

// Event listener para el botón de añadir
document.getElementById('addButton').addEventListener('click', () => {
    document.getElementById('modal').style.display = 'block'; // Abre el modal
    editingAdmissionId = null; // Reinicia el ID
});

// Cerrar modales
document.querySelectorAll('.close').forEach((element) => {
    element.addEventListener('click', () => closeModal(element.closest('.modal').id));
});

// Cerrar modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none'; // Cierra el modal
}

// Formato de fecha DD-MM-YYYY
function formatDate(date) {
    if (typeof date === 'string') {
        const parts = date.split('-');
        if (parts.length === 3) {
            return `${parts[0]}-${parts[1]}-${parts[2]}`; // Cambia a DD-MM-YYYY
        }
    }
    return date; // Retorna el valor original si no se puede formatear
}

// Convertir número de fecha de Excel a formato legible
function excelDateToJSDate(excelDate) {
    const date = new Date((excelDate - 25569) * 86400 * 1000);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`; // Retorna en formato DD-MM-YYYY
}

// Agregar o modificar admisión
document.getElementById('addForm').addEventListener('submit', (e) => {
    e.preventDefault(); // Evita el envío
    const admissionName = document.getElementById('admissionInput').value;
    const patientName = document.getElementById('patientInput').value;
    const prevision = document.getElementById('previsionInput').value;
    const doctorName = document.getElementById('doctorInput').value;
    const date = formatDate(document.getElementById('dateInput').value); // Formato de fecha

    if (editingAdmissionId) {
        updateAdmission(editingAdmissionId, admissionName, patientName, prevision, doctorName, date);
    } else {
        addAdmission(admissionName, patientName, prevision, doctorName, date);
    }
});

// Función para agregar admisión
function addAdmission(admissionName, patientName, prevision, doctorName, date) {
    if (admissionName && patientName) {
        admissions.push({ id: currentId, admission: admissionName, patient: patientName, prevision, doctor: doctorName, date });
        currentId++;
        document.getElementById('addForm').reset(); // Resetea el formulario
        closeModal('modal'); // Cierra el modal
        renderTable(); // Renderiza la tabla
    } else {
        alert("Por favor, completa todos los campos.");
    }
}

// Abrir modal de edición
function openEditModal(id, admission, patient, prevision, doctor, date) {
    editingAdmissionId = id;
    document.getElementById('editAdmissionInput').value = admission;
    document.getElementById('editPatientInput').value = patient;
    document.getElementById('editForecastInput').value = prevision;
    document.getElementById('editDoctorInput').value = doctor;
    document.getElementById('editDateInput').value = date; // Formato de fecha
    document.getElementById('editModal').style.display = 'block'; // Abre modal
}

// Guardar cambios en edición
document.getElementById('editForm').addEventListener('submit', (e) => {
    e.preventDefault(); // Evita el envío
    const editedAdmission = document.getElementById('editAdmissionInput').value;
    const editedPatient = document.getElementById('editPatientInput').value;
    const editedPrevision = document.getElementById('editForecastInput').value;
    const editedDoctor = document.getElementById('editDoctorInput').value;
    const editedDate = document.getElementById('editDateInput').value; // Formato de fecha

    updateAdmission(editingAdmissionId, editedAdmission, editedPatient, editedPrevision, editedDoctor, editedDate);
});

// Actualizar admisión
function updateAdmission(id, newAdmission, newPatient, newPrevision, newDoctor, newDate) {
    const index = admissions.findIndex(a => a.id === id);
    if (index !== -1) {
        admissions[index] = { ...admissions[index], admission: newAdmission, patient: newPatient, prevision: newPrevision, doctor: newDoctor, date: newDate };
        document.getElementById('editForm').reset(); // Resetea formulario
        closeModal('editModal'); // Cierra modal
        renderTable(); // Renderiza la tabla
    }
}

// Abrir modal de eliminación
function openDeleteModal(id) {
    deletingAdmissionId = id; // Guarda ID
    document.getElementById('deleteModal').style.display = 'block'; // Abre modal
}

// Eliminar admisión
document.getElementById('confirmDeleteButton').addEventListener('click', () => {
    deleteAdmission(deletingAdmissionId); // Elimina admisión
    closeModal('deleteModal'); // Cierra modal
});

// Eliminar admisión
function deleteAdmission(id) {
    admissions = admissions.filter(a => a.id !== id); // Filtra admisiones
    reindexAdmissions(); // Reindexa IDs
    renderTable(); // Renderiza la tabla
    showInfoModal(); // Muestra modal de info
}

// Reindexar IDs
function reindexAdmissions() {
    admissions.forEach((admission, index) => {
        admission.id = index + 1; // Actualiza ID
    });
    currentId = admissions.length > 0 ? admissions[admissions.length - 1].id + 1 : 1; // Actualiza currentId
}

// Mostrar modal de información
function showInfoModal() {
    document.getElementById('infoModal').style.display = 'block'; // Abre modal
}

// Cerrar modal de información
document.getElementById('closeInfoButton').addEventListener('click', () => {
    closeModal('infoModal'); // Cierra modal
});

// Renderizar tabla
function renderTable(filteredAdmissions = admissions) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = ''; // Limpia tabla

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, filteredAdmissions.length);
    
    for (let i = startIndex; i < endIndex; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" class="itemCheckbox"></td>
            <td>${filteredAdmissions[i].id}</td>
            <td>${filteredAdmissions[i].admission}</td>
            <td>${filteredAdmissions[i].patient}</td>
            <td>${filteredAdmissions[i].prevision}</td>
            <td>${filteredAdmissions[i].doctor}</td>
            <td>${filteredAdmissions[i].date}</td>
            <td>
                <i class='bx bxs-pencil edit-icon' title='Modificar' onclick='openEditModal(${filteredAdmissions[i].id}, "${filteredAdmissions[i].admission}", "${filteredAdmissions[i].patient}", "${filteredAdmissions[i].prevision}", "${filteredAdmissions[i].doctor}", "${filteredAdmissions[i].date}")'></i>
                <i class='bx bxs-trash delete-icon' title='Eliminar' onclick='openDeleteModal(${filteredAdmissions[i].id})'></i>
            </td>
        `;
        tableBody.appendChild(row);
    }

    updatePagination(filteredAdmissions.length); // Actualiza paginación
}

// Actualizar paginación
function updatePagination(totalItems) {
    const totalPages = Math.ceil(totalItems / rowsPerPage);
    document.getElementById('pageInfo').textContent = `Página ${currentPage} de ${totalPages}`;

    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages || totalPages === 0;
}

// Seleccionar/deseleccionar todas las casillas
document.getElementById('selectAll').addEventListener('change', function() {
    const checkboxes = document.querySelectorAll('.itemCheckbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = this.checked;
    });
});

// Eventos de paginación
document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    const totalPages = Math.ceil(admissions.length / rowsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderTable();
    }
});

// Importación de archivos XLSX
document.getElementById('importInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1 });
            jsonData.forEach((row, index) => {
                if (index > 0) { // Salta cabecera
                    const admission = row[0]; // Columna de admisión (columna 1)
                    const patient = row[1]; // Columna de paciente (columna 2)
                    const prevision = row[2]; // Columna de previsión (columna 3)
                    const doctor = row[3]; // Columna de médico (columna 4)
                    const date = row[4]; // Fecha de Excel

                    // Convierte el número de fecha de Excel a formato legible
                    const formattedDate = typeof date === 'number' ? excelDateToJSDate(date) : formatDate(date);

                    // Solo agregar si las columnas de "Admisión" y "Paciente" no están vacías
                    if (admission && patient) {
                        admissions.push({ id: currentId, admission, patient, prevision, doctor, date: formattedDate });
                        currentId++;
                    }
                }
            });
            renderTable(); // Renderiza tabla después de importar
        };
        reader.readAsArrayBuffer(file);
    }
});

// Evento para el botón de exportar
document.getElementById('exportButton').addEventListener('click', () => exportAdmissionsToXLSX());

// Exportar admisiones a un archivo XLSX
function exportAdmissionsToXLSX() {
    const worksheet = XLSX.utils.json_to_sheet(admissions.map(a => ({
        ID: a.id,
        Admisión: a.admission,
        Paciente: a.patient,
        Previsión: a.prevision,
        Médico: a.doctor,
        Fecha: a.date // Se exporta en el mismo formato
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Admisiones");
    XLSX.writeFile(workbook, 'admisiones.xlsx');
}
