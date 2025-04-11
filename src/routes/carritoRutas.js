const express = require('express');
const router = express.Router();
const cartController = require('../controllers/carritoController'); // Importar el controlador del carrito

// Middleware para proteger rutas
const authMiddleware = require('../middlewares/authMiddleware');
router.use(authMiddleware);

// Rutas del carrito
/**
 * @swagger
 * tags:
 *   name: carrito
 *   description: Endpoints para gestionar el carrito de compras del usuario
 */

/**
 * @swagger
 * /api/carrito:
 *   get:
 *     summary: Obtener los productos del carrito del usuario autenticado
 *     tags: [carrito]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de productos en el carrito
 *       500:
 *         description: Error al obtener el carrito
 */
router.get('/', cartController.getCart);

/**
 * @swagger
 * /api/carrito:
 *   post:
 *     summary: Agregar un producto al carrito del usuario autenticado
 *     tags: [carrito]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Producto añadido al carrito
 *       500:
 *         description: Error al añadir producto al carrito
 */
router.post('/', cartController.addProduct);

/**
 * @swagger
 * /api/carrito/{productId}:
 *   put:
 *     summary: Actualizar la cantidad de un producto en el carrito
 *     tags: [carrito]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cantidad actualizada
 *       400:
 *         description: La cantidad debe ser mayor a 0 o supera el stock disponible
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error al actualizar la cantidad
 */
router.put('/:productId', cartController.updateProductQuantity);

/**
 * @swagger
 * /api/carrito/{productId}:
 *   delete:
 *     summary: Eliminar un producto específico del carrito
 *     tags: [carrito]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto eliminado del carrito
 *       500:
 *         description: Error al eliminar el producto del carrito
 */
router.delete('/:productId', cartController.removeProduct);

/**
 * @swagger
 * /api/carrito:
 *   delete:
 *     summary: Vaciar completamente el carrito del usuario autenticado
 *     tags: [carrito]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Carrito vaciado correctamente
 *       500:
 *         description: Error al vaciar el carrito
 */
router.delete('/', cartController.clearCart);


module.exports = router;