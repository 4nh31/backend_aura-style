const express = require('express');
const productosController = require('../controllers/producosController');
const verifyToken = require('../middlewares/authMiddleware'); 
const authorizeRole = require('../middlewares/authorizeRole');
const router = express.Router();

/**
 * @swagger
 * /productos:
 *   get:
 *     tags:
 *       - Productos
 *     summary: Obtener todos los productos
 *     description: Retorna una lista de todos los productos disponibles.
 *     responses:
 *       200:
 *         description: Lista de productos obtenida exitosamente.
 *       500:
 *         description: Error del servidor.
 */
router.get('/', productosController.getALL);

/**
 * @swagger
 * /productos:
 *   post:
 *     tags:
 *       - Productos
 *     summary: Crear un nuevo producto
 *     description: Agrega un nuevo producto al inventario.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Camiseta Negra"
 *               descripcion:
 *                 type: string
 *                 example: "Camiseta de algodón de alta calidad"
 *               precio:
 *                 type: number
 *                 example: 299.99
 *               stock:
 *                 type: integer
 *                 example: 50
 *               idCategoria:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Producto agregado con éxito.
 *       400:
 *         description: Faltan campos obligatorios.
 *       500:
 *         description: Error del servidor.
 */
router.post('/',verifyToken,authorizeRole(['admin']), productosController.createProducto);

/**
 * @swagger
 * /productos/{id}:
 *   get:
 *     tags:
 *       - Productos
 *     summary: Obtener un producto por ID
 *     description: Retorna los detalles de un producto específico según el ID proporcionado.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto que se desea obtener.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto encontrado exitosamente.
 *       404:
 *         description: Producto no encontrado.
 *       500:
 *         description: Error del servidor.
 */
router.get('/:id', productosController.getById);

/**
 * @swagger
 * /productos/{id}:
 *   delete:
 *     tags:
 *       - Productos
 *     summary: Eliminar un producto
 *     description: Elimina un producto del inventario según el ID proporcionado.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto que se desea eliminar.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto eliminado con éxito.
 *       404:
 *         description: Producto no encontrado.
 *       500:
 *         description: Error del servidor.
 */
router.delete('/:id', productosController.delete);

/**
 * @swagger
 * /productos/{id}:
 *   put:
 *     summary: Actualiza un producto existente (Solo Admin)
 *     description: Modifica la información de un producto en la base de datos. Requiere autenticación con JWT y rol de administrador.
 *     tags: 
 *       - Productos
 *     security:
 *       - BearerAuth: []  # 🔐 Indica que se necesita autenticación con JWT
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Camiseta Negra"
 *               descripcion:
 *                 type: string
 *                 example: "Camiseta de algodón"
 *               precio:
 *                 type: number
 *                 example: 200
 *               stock:
 *                 type: integer
 *                 example: 15
 *               idCategoria:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Producto actualizado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Producto actualizado con éxito"
 *       400:
 *         description: Datos faltantes en la solicitud
 *       401:
 *         description: No autorizado (token inválido o no enviado)
 *       403:
 *         description: Prohibido (el usuario no tiene permisos de administrador)
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:id', verifyToken,authorizeRole(['admin']), Producto.updateProducto);


module.exports = router;
