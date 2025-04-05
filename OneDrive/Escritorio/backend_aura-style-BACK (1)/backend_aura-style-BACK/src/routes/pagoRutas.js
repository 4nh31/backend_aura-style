const express = require('express');
const pagoController = require('../controllers/pagoController');
const verifyToken = require('../middlewares/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * /pagos/crear-orden:
 *   post:
 *     tags:
 *       - Pagos
 *     summary: Crear una orden de pago con PayPal
 *     description: Crea una orden de pago en PayPal y devuelve el ID de la orden.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               total:
 *                 type: number
 *                 example: 100.00
 *               idPedido:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Orden de pago creada con éxito.
 *       400:
 *         description: Faltan campos obligatorios.
 *       500:
 *         description: Error del servidor.
 */
router.post('/crear-orden', pagoController.crearOrden);

/**
 * @swagger
 * /pagos/capturar/{orderID}:
 *   post:
 *     tags:
 *       - Pagos
 *     summary: Capturar un pago de PayPal
 *     description: Captura el pago de una orden de PayPal y actualiza el estado del pedido.
 *     parameters:
 *       - in: path
 *         name: orderID
 *         required: true
 *         description: ID de la orden de PayPal.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pago capturado con éxito.
 *       500:
 *         description: Error del servidor.
 */
router.post('/capturar/:orderID', pagoController.capturarPago);

module.exports = router;