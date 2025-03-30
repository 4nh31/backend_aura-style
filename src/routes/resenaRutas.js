const express = require('express');
const resenasController = require('../controllers/resenasController');
const verifyToken = require('../middlewares/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * /resenas:
 *   get:
 *     tags:
 *       - Reseñas
 *     summary: Obtener todas las reseñas
 *     description: Retorna una lista de todas las reseñas.
 *     responses:
 *       200:
 *         description: Lista de reseñas obtenida exitosamente.
 *       500:
 *         description: Error del servidor.
 */
router.get('/', resenasController.getAll);

/**
 * @swagger
 * /resenas:
 *   post:
 *     tags:
 *       - Reseñas
 *     summary: Crear una nueva reseña
 *     description: Crea una nueva reseña en el sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idUsuario:
 *                 type: integer
 *                 example: 1
 *               idProducto:
 *                 type: integer
 *                 example: 2
 *               calificacion:
 *                 type: integer
 *                 example: 5
 *               comentario:
 *                 type: string
 *                 example: "Excelente producto"
 *               fecha:
 *                 type: string
 *                 format: date
 *                 example: "2023-03-25"
 *     responses:
 *       201:
 *         description: Reseña creada con éxito.
 *       400:
 *         description: Faltan campos obligatorios.
 *       500:
 *         description: Error del servidor.
 */
router.post('/', resenasController.createResena);

/**
 * @swagger
 * /resenas/{id}:
 *   get:
 *     tags:
 *       - Reseñas
 *     summary: Obtener una reseña por ID
 *     description: Retorna los detalles de una reseña específica según el ID proporcionado.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la reseña que se desea obtener.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reseña encontrada exitosamente.
 *       404:
 *         description: Reseña no encontrada.
 *       500:
 *         description: Error del servidor.
 */
router.get('/:id', resenasController.getById);

/**
 * @swagger
 * /resenas/{id}:
 *   delete:
 *     tags:
 *       - Reseñas
 *     summary: Eliminar una reseña
 *     description: Elimina una reseña del sistema según el ID proporcionado.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la reseña que se desea eliminar.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reseña eliminada con éxito.
 *       404:
 *         description: Reseña no encontrada.
 *       500:
 *         description: Error del servidor.
 */
router.delete('/:id', resenasController.delete);

module.exports = router;
