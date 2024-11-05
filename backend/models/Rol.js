const mongoose = require('mongoose');

const RolSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    permisos: { type: [String], default: [] }
});

module.exports = mongoose.model('Rol', RolSchema);
