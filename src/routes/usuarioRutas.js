const express = require('express');
const usuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Operaciones relacionadas con los usuarios
 */

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     tags: [Usuarios]
 *     description: Retorna una lista de todos los usuarios registrados en el sistema.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 *       403:
 *         description: Acceso no autorizado.
 *       500:
 *         description: Error del servidor.
 */
router.get('/', authMiddleware, usuarioController.getAll);

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Obtiene un usuario por ID
 *     tags: [Usuarios]
 *     description: Retorna los datos de un usuario específico según su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a buscar.
 *         schema:
 *           type: integer
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario encontrado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error del servidor.
 */
router.get('/:id', authMiddleware, usuarioController.getById);

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Crea un nuevo usuario y su carrito
 *     tags: [Usuarios]
 *     description: Registra un nuevo usuario en el sistema y le asigna automáticamente un carrito.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - email
 *               - password
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               telefono:
 *                 type: string
 *               direccion:
 *                 type: string
 *               rol:
 *                 type: string
 *                 enum: [admin, cliente]
 *     responses:
 *       201:
 *         description: Usuario y carrito creados exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               message: "Usuario y carrito creados con éxito"
 *               idUsuario: 1
 *               idCarrito: 1
 *       400:
 *         description: Datos incorrectos o incompletos.
 *       500:
 *         description: Error del servidor.
 */
router.post('/', usuarioController.create);

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Actualiza un usuario
 *     tags: [Usuarios]
 *     description: Modifica los datos de un usuario existente.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a actualizar.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               telefono:
 *                 type: string
 *               direccion:
 *                 type: string
 *               rol:
 *                 type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente.
 *       500:
 *         description: Error del servidor.
 */
router.put('/:id', authMiddleware, usuarioController.update);

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Elimina un usuario
 *     tags: [Usuarios]
 *     description: Borra un usuario del sistema según su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a eliminar.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error del servidor.
 */
router.delete('/:id', authMiddleware, usuarioController.delete);

/**
 * @swagger
 * /usuarios/login:
 *   post:
 *     summary: Autenticación de usuario
 *     tags: [Usuarios]
 *     description: Inicia sesión con un usuario y devuelve un token JWT junto a datos del usuario.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso. Devuelve un token JWT.
 *         content:
 *           application/json:
 *             example:
 *               message: "Login exitoso"
 *               token: "jwt_token"
 *               idUsuario: 1
 *               idCarrito: 1
 *               username: "Juan"
 *               email: "juan@example.com"
 *               role: "cliente"
 *       401:
 *         description: Credenciales incorrectas.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error en el servidor.
 */
router.post('/login', usuarioController.login);

module.exports = router;
