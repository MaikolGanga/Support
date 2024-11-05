document.getElementById('importInput').addEventListener('change', handleFileSelect);

let currentPage = 0; // Página actual
const rowsPerPage = 12; // Límites de filas por página
const pages = []; // Arreglo para almacenar los datos de cada página

function handleFileSelect(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

        // Ignorar la primera fila (encabezados)
        jsonData.shift();

        // Dividir datos en páginas
        const totalRows = jsonData.length;
        for (let i = 0; i < totalRows; i += rowsPerPage) {
            pages.push(jsonData.slice(i, i + rowsPerPage));
        }

        loadPage(currentPage);
    };

    reader.readAsArrayBuffer(file);
}

function loadPage(pageNumber) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = ''; // Limpiar tabla antes de cargar nueva página

    const rows = pages[pageNumber] || [];
    rows.forEach((row, index) => {
        const newRow = {
            id: (pageNumber * rowsPerPage) + index + 1, // Asignar ID automático
            ingreso: formatDate(row[0]),
            atributo: row[1] || '',
            previsión: row[2] || '',
            admisión: row[3] || '',
            paciente: row[4] || '',
            médico: row[5] || '',
            fechaCx: formatDate(row[6]),
            proveedor: row[7] || '',
            estado: row[8] || '',
            fechaCargo: formatDate(row[9]),
            informe: row[10] || '',
            costoPendiente: formatCurrency(row[11]),
            costoCotizacion: formatCurrency(row[12]),
        };
        addRowToTable(newRow);
    });
    
    updatePagination();
}

function updatePagination() {
    const pageInfo = document.getElementById('pageInfo');
    pageInfo.innerText = `Página ${currentPage + 1} de ${pages.length}`;
}

function nextPage() {
    if (currentPage < pages.length - 1) {
        currentPage++;
        loadPage(currentPage);
    } else {
        alert('Ya estás en la última página.');
    }
}

function previousPage() {
    if (currentPage > 0) {
        currentPage--;
        loadPage(currentPage);
    } else {
        alert('Ya estás en la primera página.');
    }
}

function formatDate(date) {
    if (!date) return '';

    if (typeof date === 'number') {
        const excelDate = new Date((date - (25567 + 1)) * 86400 * 1000);
        return `${String(excelDate.getDate()).padStart(2, '0')}-${String(excelDate.getMonth() + 1).padStart(2, '0')}-${excelDate.getFullYear()}`;
    }

    let d;
    if (typeof date === 'string') {
        const dateParts = date.split(/[-\/\s]+/);
        if (dateParts.length === 3) {
            d = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
        }
    } else if (date instanceof Date) {
        d = date;
    }

    if (!d || isNaN(d.getTime())) {
        console.warn('Fecha no válida:', date);
        return '';
    }

    return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
}

function formatCurrency(value) {
    if (value === undefined || value === null || (typeof value !== 'number' && isNaN(parseFloat(value)))) {
        return "$0";
    }

    const numberValue = parseFloat(value);
    
    if (isNaN(numberValue)) {
        console.warn('Valor no numérico:', value);
        return "$0";
    }
    
    return `$${numberValue.toLocaleString('es-CL', { minimumFractionDigits: 0 })}`;
}

function addRowToTable(data) {
    const tableBody = document.getElementById('tableBody');
    const row = document.createElement('tr');

    row.innerHTML = `
        <td><input type="checkbox"></td>
        <td>${data.id}</td>
        <td>${data.ingreso}</td>
        <td>${data.atributo}</td>
        <td>${data.previsión}</td>
        <td>${data.admisión}</td>
        <td>${data.paciente}</td>
        <td>${data.médico}</td>
        <td>${data.fechaCx}</td>
        <td>${data.proveedor}</td>
        <td>${data.estado}</td>
        <td>${data.fechaCargo}</td>
        <td>${data.informe}</td>
        <td>${data.costoPendiente}</td>
        <td>${data.costoCotizacion}</td>
        <td>
            <button onclick="editRow(${data.id})">Editar</button>
            <button onclick="deleteRow(${data.id})">Eliminar</button>
        </td>
    `;

    tableBody.appendChild(row);
}

// Añadir eventos para la paginación
document.getElementById('prevPage').addEventListener('click', previousPage);
document.getElementById('nextPage').addEventListener('click', nextPage);
