let currentId = 1; // Variable para llevar el control del ID
let providers = []; // Array para almacenar los proveedores
let currentPage = 1; // Página actual
const rowsPerPage = 18; // Filas por página
let editingProviderId = null; // ID del proveedor que se está editando
let deletingProviderId = null; // ID del proveedor que se va a eliminar

// Event listener para el botón de añadir
document.getElementById('addButton').addEventListener('click', function() {
    document.getElementById('modal').style.display = 'block'; // Abre el modal para añadir
    editingProviderId = null; // Reinicia el ID al abrir el modal
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

// Agregar o modificar proveedor
document.getElementById('addForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Evita el envío del formulario
    const providerName = document.getElementById('forecastInput').value; // Nombre del proveedor
    const providerRUT = document.getElementById('rutInput').value; // RUT del proveedor
    
    if (editingProviderId) {
        updateProvider(editingProviderId, providerName, providerRUT); // Modifica el proveedor existente
    } else {
        addProvider(providerName, providerRUT); // Agrega nuevo proveedor
    }
});

// Función para agregar proveedor
function addProvider(providerName, providerRUT) {
    if (providerName && providerRUT) {
        providers.push({ id: currentId, name: providerName, rut: providerRUT });
        currentId++;
        document.getElementById('addForm').reset(); // Resetea el formulario
        closeModal('modal'); // Cierra el modal
        renderTable(); // Renderiza la tabla
    } else {
        alert("Por favor, ingresa un nombre y un RUT para el proveedor.");
    }
}

// Función para abrir el modal de edición
function openEditModal(id, name, rut) {
    editingProviderId = id; // Guarda el ID del proveedor a editar
    document.getElementById('editForecastInput').value = name; // Rellena el campo de nombre
    document.getElementById('editRutInput').value = rut; // Rellena el campo de RUT
    document.getElementById('editModal').style.display = 'block'; // Abre el modal de edición
}

// Evento para guardar los cambios en el formulario de edición
document.getElementById('editForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Evita el envío del formulario
    const editedName = document.getElementById('editForecastInput').value;
    const editedRUT = document.getElementById('editRutInput').value;
    updateProvider(editingProviderId, editedName, editedRUT); // Actualiza el proveedor
});

// Función para actualizar proveedor
function updateProvider(id, newName, newRUT) {
    const index = providers.findIndex(p => p.id === id);
    if (index !== -1) {
        providers[index].name = newName; // Actualiza el nombre
        providers[index].rut = newRUT; // Actualiza el RUT
        document.getElementById('editForm').reset(); // Resetea el formulario de edición
        closeModal('editModal'); // Cierra el modal
        renderTable(); // Renderiza la tabla
    }
}

// Función para abrir el modal de eliminación
function openDeleteModal(id) {
    deletingProviderId = id; // Guarda el ID del proveedor a eliminar
    document.getElementById('deleteModal').style.display = 'block'; // Abre el modal de confirmación
}

// Función para eliminar proveedor
document.getElementById('confirmDeleteButton').addEventListener('click', function() {
    deleteProvider(deletingProviderId); // Elimina el proveedor
    closeModal('deleteModal'); // Cierra el modal de confirmación
});

// Función para eliminar proveedor
function deleteProvider(id) {
    providers = providers.filter(p => p.id !== id); // Filtra los proveedores
    reindexProviders(); // Reindexa los IDs
    renderTable(); // Renderiza la tabla
    showInfoModal(); // Muestra el modal de información
}

// Función para reindexar los IDs
function reindexProviders() {
    providers.forEach((provider, index) => {
        provider.id = index + 1; // Actualiza el ID para que sea consecutivo
    });
    currentId = providers.length > 0 ? providers[providers.length - 1].id + 1 : 1; // Actualiza currentId
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
function renderTable(filteredProviders = providers) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = ''; // Limpia el cuerpo de la tabla

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, filteredProviders.length);
    
    for (let i = startIndex; i < endIndex; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" class="itemCheckbox"></td>
            <td>${filteredProviders[i].id}</td>
            <td>${filteredProviders[i].name}</td>
            <td>${filteredProviders[i].rut}</td>
            <td>
                <i class='bx bxs-pencil edit-icon' title='Modificar' onclick='openEditModal(${filteredProviders[i].id}, "${filteredProviders[i].name}", "${filteredProviders[i].rut}")'></i>
                <i class='bx bxs-trash delete-icon' title='Eliminar' onclick='openDeleteModal(${filteredProviders[i].id})'></i>
            </td>
        `;
        tableBody.appendChild(row);
    }

    updatePagination(filteredProviders.length); // Actualiza la paginación
}

// Función para manejar la búsqueda
document.getElementById('searchInput').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase(); // Obtiene el término de búsqueda
    const filteredProviders = providers.filter(provider => 
        provider.name.toLowerCase().includes(searchTerm) || provider.rut.includes(searchTerm)
    );
    currentPage = 1; // Reinicia a la primera página
    renderTable(filteredProviders); // Renderiza la tabla con los resultados filtrados
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
    const totalPages = Math.ceil(providers.length / rowsPerPage);
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
                    const providerName = row[1]; // Suponiendo que el proveedor está en la segunda columna
                    const providerRUT = row[2]; // Suponiendo que el RUT está en la tercera columna
                    if (providerName && providerRUT) {
                        const newId = providers.length > 0 ? Math.max(...providers.map(p => p.id)) + 1 : 1;
                        providers.push({ id: newId, name: providerName, rut: providerRUT }); // Agrega el proveedor
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
    exportProvidersToXLSX(); // Llama a la función para exportar
});

// Función para exportar proveedores a un archivo XLSX
function exportProvidersToXLSX() {
    const worksheet = XLSX.utils.json_to_sheet(providers.map(p => ({
        ID: p.id,
        Proveedor: p.name,
        RUT: p.rut
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Proveedores");

    XLSX.writeFile(workbook, 'proveedores.xlsx');
}
