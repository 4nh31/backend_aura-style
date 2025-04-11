const express = require('express');
const router = express.Router();
const cartController = require('../controllers/carritoController'); // Importar el controlador del carrito

// Middleware para proteger rutas
const authMiddleware = require('../middlewares/authMiddleware');
router.use(authMiddleware);

// Rutas del carrito
router.get('/', cartController.getCart); // Obtener productos del carrito
router.post('/', cartController.addProduct); // Agregar producto al carrito
router.put('/:productId', cartController.updateProductQuantity); // Actualizar cantidad de producto
router.delete('/:productId', cartController.removeProduct); // Eliminar producto del carrito
router.delete('/', cartController.clearCart); // Vaciar carrito

module.exports = router;