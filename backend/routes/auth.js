const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const Rol = require('../models/Rol');
const router = express.Router();

// Registro de usuario
router.post('/registro', async (req, res) => {
    const { nombre, email, contraseña, rol } = req.body;
    const hashedPassword = await bcrypt.hash(contraseña, 10);
    const nuevoUsuario = new Usuario({ nombre, email, contraseña: hashedPassword, rol });
    await nuevoUsuario.save();
    res.status(201).send('Usuario registrado');
});

// Inicio de sesión
router.post('/login', async (req, res) => {
    const { email, contraseña } = req.body;
    const usuario = await Usuario.findOne({ email }).populate('rol'); // Poblamos el rol
    if (!usuario || !(await bcrypt.compare(contraseña, usuario.contraseña))) {
        return res.status(401).send('Credenciales inválidas');
    }
    const token = jwt.sign({ id: usuario._id, rol: usuario.rol.nombre }, 'tu_secreto');
    res.json({ token });
});

module.exports = router;
