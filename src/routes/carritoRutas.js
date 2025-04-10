const express = require('express');
const router = express.Router();
const cartController = require('../controllers/carritoController'); // Controlador del carrito
const authMiddleware = require('../middlewares/authMiddleware'); // Middleware para autenticación

// Middleware para proteger rutas
router.use(authMiddleware);

// Rutas del carrito
router.get('/', cartController.getCart); // Obtener productos del carrito
router.post('/', cartController.addProduct); // Agregar producto al carrito
router.delete('/:productId', cartController.removeProduct); // Eliminar producto del carrito
router.delete('/', cartController.clearCart); // Vaciar carrito
router.get('/total', cartController.getTotal); // Obtener total del carrito

module.exports = router;