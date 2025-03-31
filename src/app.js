const express = require('express');
const userRoutes = require('./routes/usuarioRutas');
const pedidoRoutes = require('./routes/pedidoRutas');
const productosRoutes = require('./routes/productoRutas');
const categoriaRoutes = require('./routes/categoriaRutas'); // Nueva ruta
const pagoRoutes = require('./routes/pagoRutas'); //Ruta creada para pasarela de Pago con Paypal

const cuponRoutes = require('./routes/cuponRutas');
const resenasRoutes = require('./routes/resenaRutas');
const swaggerUI = require('swagger-ui-express');
const authRoutes = require('./routes/authRoutes');
const swaggerDocs = require('./swagger/swagger').swaggerDocs; // Importamos la configuración de Swagger
require('dotenv').config();


//import swaggerUI from "swagger-ui-express";
const app = express();
app.use(express.json());
// En tu archivo principal (app.js/index.js)
app.use(express.urlencoded({ extended: true }));
app.use("/api-docs",swaggerUI.serve, swaggerUI.setup(swaggerDocs))

const cors = require("cors");
//import swaggerUI from "swagger-ui-express";
app.use(cors({
    origin: "*", // Permite solicitudes desde cualquier dominio
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use('/usuarios', userRoutes);
app.use('/pedidos', pedidoRoutes);
app.use('/categorias', categoriaRoutes); // Ruta de categorías
app.use('/auth', authRoutes); 
app.use('/productos', productosRoutes);
app.use('/pagos', pagoRoutes); 
app.use('/resenas', resenasRoutes);
app.use('/cupones', cuponRoutes);

console.log("Swagger disponible en http://localhost:3000/api-docs");
app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));
