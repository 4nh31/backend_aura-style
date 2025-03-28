const express = require('express');
const pedidoController = require('../controllers/pedidoController');

const router = express.Router();

router.get('/', pedidoController.getAllPedidos);
router.get('/:id', pedidoController.getPedidoById);
router.get('/usuario/:idUsuario', pedidoController.getPedidosByUsuario);
router.post('/', pedidoController.createPedido);
router.put('/:id', pedidoController.updatePedido);
router.delete('/:id', pedidoController.deletePedido);

module.exports = router;

const verifyToken = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /pedidos:
 *   get:
 *     tags:
 *       - Pedidos
 *     summary: Obtener todos los pedidos
 *     description: Retorna una lista de todos los pedidos.
 *     responses:
 *       200:
 *         description: Lista de pedidos obtenida exitosamente.
 *       500:
 *         description: Error del servidor.
 */
router.get('/', pedidoController.getAll);

/**
 * @swagger
 * /pedidos:
 *   post:
 *     tags:
 *       - Pedidos
 *     summary: Crear un nuevo pedido
 *     description: Crea un nuevo pedido en el sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha:
 *                 type: string
 *                 format: date
 *                 example: "2023-10-01"
 *               hora:
 *                 type: string
 *                 format: time
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
 *     responses:
 *       201:
 *         description: Pedido creado con éxito.
 *       400:
 *         description: Faltan campos obligatorios.
 *       500:
 *         description: Error del servidor.
 */
router.post('/', pedidoController.createPedido);

/**
 * @swagger
 * /pedidos/{id}:
 *   get:
 *     tags:
 *       - Pedidos
 *     summary: Obtener un pedido por ID
 *     description: Retorna los detalles de un pedido específico según el ID proporcionado.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del pedido que se desea obtener.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pedido encontrado exitosamente.
 *       404:
 *         description: Pedido no encontrado.
 *       500:
 *         description: Error del servidor.
 */
router.get('/:id', pedidoController.getById);

/**
 * @swagger
 * /pedidos/{id}:
 *   delete:
 *     tags:
 *       - Pedidos
 *     summary: Eliminar un pedido
 *     description: Elimina un pedido del sistema según el ID proporcionado.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del pedido que se desea eliminar.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pedido eliminado con éxito.
 *       404:
 *         description: Pedido no encontrado.
 *       500:
 *         description: Error del servidor.
 */
router.delete('/:id', pedidoController.delete);

module.exports = router;

