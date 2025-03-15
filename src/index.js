/*import express from 'express';
import connection from './config/db.js';
import productoRoutes from './routes/productoRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import swaggerUI from 'swagger-ui-express';
import specs from '../swagger/swagger.js';

const app = express();
const PORT = 3000;

// Middleware para procesar JSON
app.use(express.json());

// Documentación Swagger
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

// Usar las rutas
app.use('/productos', productoRoutes);
app.use('/usuarios', usuarioRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
*/