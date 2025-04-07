const express = require('express');
const pedidoController = require('../controllers/pedidoController');
const verifyToken = require('../middlewares/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * /pedidos:
 *   get:
 *     tags:
 *       - Pedidos
 *     summary: Obtener todos los pedidos
 *     responses:
 *       200:
 *         description: Lista de pedidos obtenida exitosamente.
 */
router.get('/', verifyToken, pedidoController.getAll);

/**
 * @swagger
 * /pedidos/{id}:
 *   get:
 *     tags:
 *       - Pedidos
 *     summary: Obtener un pedido por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *       404:
 *         description: Pedido no encontrado
 */
router.get('/:id', verifyToken, pedidoController.getById);

/**
 * @swagger
 * /pedidos/{id}/productos:
 *   get:
 *     tags:
 *       - Pedidos
 *     summary: Obtener productos de un pedido
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de productos del pedido
 */
router.get('/:id/productos', verifyToken, pedidoController.getProductos);

/**
 * @swagger
 * /pedidos:
 *   post:
 *     tags:
 *       - Pedidos
 *     summary: Crear un nuevo pedido con productos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha:
 *                 type: string
 *                 example: "2023-10-01"
 *               hora:
 *                 type: string
 *                 example: "14:30:00"
 *               estado:
 *                 type: string
 *                 example: "Pendiente"
 *               total:
 *                 type: number
 *                 example: 299.99
 *               tipo_envio:
 *                 type: string
 *                 example: "Express"
 *               idUsuario:
 *                 type: integer
 *                 example: 1
 *               idCupon:
 *                 type: integer
 *                 example: 1
 *               productos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     idProducto:
 *                       type: integer
 *                       example: 2
 *                     cantidad:
 *                       type: integer
 *                       example: 3
 *     responses:
 *       201:
 *         description: Pedido creado exitosamente
 *       400:
 *         description: Datos incompletos
 */
router.post('/', verifyToken, pedidoController.createPedido);

/**
 * @swagger
 * /pedidos/{id}:
 *   delete:
 *     tags:
 *       - Pedidos
 *     summary: Eliminar un pedido
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pedido eliminado con éxito
 *       500:
 *         description: Error al eliminar
 */
router.delete('/:id', verifyToken, pedidoController.delete);

module.exports = router;
