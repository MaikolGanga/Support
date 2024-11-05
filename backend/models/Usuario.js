const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contraseña: { type: String, required: true },
    rol: { type: mongoose.Schema.Types.ObjectId, ref: 'Rol' }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);
