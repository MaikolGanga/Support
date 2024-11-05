const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mi_base_de_datos', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('No se pudo conectar a MongoDB', err));
