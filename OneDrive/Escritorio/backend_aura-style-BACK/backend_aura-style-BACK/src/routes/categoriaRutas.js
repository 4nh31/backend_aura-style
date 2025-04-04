const express = require('express');
const categoriaController = require('../controllers/categoriaController');
const verifyToken = require('../middlewares/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * /categorias:
 *   get:
 *     tags:
 *       - Categorias
 *     summary: Obtener todas las categorías
 *     description: Retorna una lista de todas las categorías.
 *     responses:
 *       200:
 *         description: Lista de categorías obtenida exitosamente.
 *       500:
 *         description: Error del servidor.
 */
router.get('/', categoriaController.getAll);

/**
 * @swagger
 * /categorias:
 *   post:
 *     tags:
 *       - Categorias
 *     summary: Crear una nueva categoría
 *     description: Crea una nueva categoría en el sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Ropa"
 *               descripcion:
 *                 type: string
 *                 example: "Ropa de alta calidad"
 *               parent_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Categoría creada con éxito.
 *       400:
 *         description: Faltan campos obligatorios.
 *       500:
 *         description: Error del servidor.
 */
router.post('/', categoriaController.createCategoria);

/**
 * @swagger
 * /categorias/{id}:
 *   get:
 *     tags:
 *       - Categorias
 *     summary: Obtener una categoría por ID
 *     description: Retorna los detalles de una categoría específica según el ID proporcionado.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la categoría que se desea obtener.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoría encontrada exitosamente.
 *       404:
 *         description: Categoría no encontrada.
 *       500:
 *         description: Error del servidor.
 */
router.get('/:id', categoriaController.getById);

/**
 * @swagger
 * /categorias/{id}:
 *   delete:
 *     tags:
 *       - Categorias
 *     summary: Eliminar una categoría
 *     description: Elimina una categoría del sistema según el ID proporcionado.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la categoría que se desea eliminar.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoría eliminada con éxito.
 *       404:
 *         description: Categoría no encontrada.
 *       500:
 *         description: Error del servidor.
 */
router.delete('/:id', categoriaController.delete);

module.exports = router;