const express = require('express');
const userRoutes = require('./routes/usuarioRutas');

const app = express();
app.use(express.json()); // Para leer JSON en las peticiones
app.use('/usuarios', userRoutes);

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));
