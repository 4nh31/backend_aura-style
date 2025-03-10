const express = require('express');
const userRoutes = require('./routes/usuarioRutas');
const pedidoRoutes = require('./routes/pedidoRutas');
const productosRoutes = require('./routes/productoRutas');
const swaggerUI = require('swagger-ui-express');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();
//import swaggerUI from "swagger-ui-express";


const app = express();
app.use(express.json());
app.use("api-docs",swaggerUI.serve, swaggerUI.setup())

app.use('/usuarios', userRoutes);
app.use('/pedidos', pedidoRoutes);
app.use('/auth', authRoutes); 
app.use('/productos', productosRoutes);

console.log("Swagger disponible en http://localhost:3000/api-docs");
app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));
