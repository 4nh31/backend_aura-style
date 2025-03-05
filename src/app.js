const express = require('express');
const userRoutes = require('./routes/usuarioRutas');
const pedidoRoutes = require('./routes/pedidoRutas');
const swaggerUI = require('swagger-ui-express');
//import swaggerUI from "swagger-ui-express";


const app = express();
app.use(express.json());
app.use("api-docs",swaggerUI.serve, swaggerUI.setup())

app.use('/usuarios', userRoutes);
app.use('/pedidos', pedidoRoutes);

console.log("Swagger disponible en http://localhost:3000/api-docs");
app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));
