import express from 'express';
import { obtenerProductos, agregarProducto } from '../controllers/productoController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Productos
 *   description: Endpoints para la gestión de productos
 */

/**
 * @swagger
 * /productos:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Lista de productos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   idProducto:
 *                     type: integer
 *                     example: 1
 *                   nombre:
 *                     type: string
 *                     example: "Camiseta Negra"
 *                   descripcion:
 *                     type: string
 *                     example: "Camiseta de algodón 100%"
 *                   precio:
 *                     type: number
 *                     example: 19.99
 *                   stock:
 *                     type: integer
 *                     example: 50
 *                   idCategoria:
 *                     type: integer
 *                     example: 2
 */
router.get('/', obtenerProductos);

/**
 * @swagger
 * /productos:
 *   post:
 *     summary: Agregar un nuevo producto
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Camiseta Azul"
 *               descripcion:
 *                 type: string
 *                 example: "Camiseta de algodón azul"
 *               precio:
 *                 type: number
 *                 example: 24.99
 *               stock:
 *                 type: integer
 *                 example: 30
 *               idCategoria:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Producto agregado exitosamente
 *       400:
 *         description: Error en los datos proporcionados
 */
router.post('/', agregarProducto);

export default router;
