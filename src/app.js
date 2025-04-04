const express = require('express');
const userRoutes = require('./routes/usuarioRutas');
const pedidoRoutes = require('./routes/pedidoRutas');
const productosRoutes = require('./routes/productoRutas');
const categoriaRoutes = require('./routes/categoriaRutas');
const pagoRoutes = require('./routes/pagoRutas'); 
const swaggerUI = require('swagger-ui-express');
const authRoutes = require('./routes/authRoutes');
const swaggerDocs = require('./swagger/swagger').swaggerDocs; 
require('dotenv').config();
const cors = require("cors");


const app = express();
app.use(express.json());
app.use("/api-docs",swaggerUI.serve, swaggerUI.setup(swaggerDocs))
app.use(cors());

app.use(cors({
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use('/usuarios', userRoutes);
app.use('/pedidos', pedidoRoutes);
app.use('/categorias', categoriaRoutes); 
app.use('/auth', authRoutes); 
app.use('/productos', productosRoutes);
app.use('/pagos', pagoRoutes); 

console.log("Swagger disponible en http://localhost:3000/api-docs");
app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));