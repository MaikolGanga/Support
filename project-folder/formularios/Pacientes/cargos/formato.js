function formatCurrency(input) {
    // Obtener el valor actual y eliminar caracteres no numéricos
    let value = input.value.replace(/[^0-9]/g, '');

    // Convertir a número
    let numberValue = parseInt(value, 10);
    
    // Si no es un número, vaciar el campo
    if (isNaN(numberValue)) {
        input.value = '';
        return;
    }

    // Formatear como moneda en pesos chilenos
    input.value = numberValue.toLocaleString('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}