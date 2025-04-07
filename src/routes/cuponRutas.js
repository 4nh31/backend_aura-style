const express = require('express');
const cuponController = require('../controllers/cuponController');
const verifyToken = require('../middlewares/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * /cupones:
 *   get:
 *     tags:
 *       - Cupones
 *     summary: Obtener todos los cupones
 *     description: Retorna una lista de todos los cupones disponibles.
 *     responses:
 *       200:
 *         description: Lista de cupones obtenida exitosamente.
 *       500:
 *         description: Error del servidor.
 */
router.get('/', cuponController.getAll);

/**
 * @swagger
 * /cupones:
 *   post:
 *     tags:
 *       - Cupones
 *     summary: Crear un nuevo cupón
 *     description: Agrega un nuevo cupón de descuento.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               codigo:
 *                 type: string
 *                 example: "VERANO2023"
 *               fecha_expiracion:
 *                 type: string
 *                 format: date
 *                 example: "2023-12-31"
 *               tipo_descuento:
 *                 type: string
 *                 example: "porcentaje"
 *               valor_descuento:
 *                 type: number
 *                 example: 15.00
 *     responses:
 *       201:
 *         description: Cupón creado con éxito.
 *       400:
 *         description: Faltan campos obligatorios.
 *       500:
 *         description: Error del servidor.
 */
router.post('/', cuponController.create);

/**
 * @swagger
 * /cupones/{id}:
 *   get:
 *     tags:
 *       - Cupones
 *     summary: Obtener un cupón por ID
 *     description: Retorna los detalles de un cupón específico según el ID proporcionado.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del cupón que se desea obtener.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cupón encontrado exitosamente.
 *       404:
 *         description: Cupón no encontrado.
 *       500:
 *         description: Error del servidor.
 */
router.get('/:id', cuponController.getById);

/**
 * @swagger
 * /cupones/{id}:
 *   delete:
 *     tags:
 *       - Cupones
 *     summary: Eliminar un cupón
 *     description: Elimina un cupón según el ID proporcionado.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del cupón que se desea eliminar.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cupón eliminado con éxito.
 *       404:
 *         description: Cupón no encontrado.
 *       500:
 *         description: Error del servidor.
 */
router.delete('/:id', cuponController.delete);

/**
 * @swagger
 * /cupones/validar/{codigo}:
 *   get:
 *     tags:
 *       - Cupones
 *     summary: Validar un cupón
 *     description: Verifica si un cupón es válido (no expirado) según su código.
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         description: Código del cupón a validar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cupón válido.
 *       404:
 *         description: Cupón no válido o expirado.
 *       500:
 *         description: Error del servidor.
 */
router.get('/validar/:codigo', cuponController.validar);

module.exports = router;