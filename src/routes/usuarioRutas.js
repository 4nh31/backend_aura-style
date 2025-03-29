const express = require('express');
const usuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     description: Retorna una lista de todos los usuarios registrados en el sistema.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente.
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
 *     summary: Crea un nuevo usuario
 *     description: Registra un nuevo usuario en el sistema.
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
 *                 description: Nombre del usuario.
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario.
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario.
 *               telefono:
 *                 type: string
 *                 description: Teléfono del usuario (opcional).
 *               direccion:
 *                 type: string
 *                 description: Dirección del usuario (opcional).
 *               rol:
 *                 type: string
 *                 description: Rol del usuario (admin o cliente).
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente.
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
 *                 description: Nombre del usuario.
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario.
 *               password:
 *                 type: string
 *                 description: Nueva contraseña del usuario.
 *               telefono:
 *                 type: string
 *                 description: Teléfono del usuario.
 *               direccion:
 *                 type: string
 *                 description: Dirección del usuario.
 *               rol:
 *                 type: string
 *                 description: Rol del usuario.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente.
 *       400:
 *         description: Datos incorrectos o incompletos.
 *       500:
 *         description: Error del servidor.
 */
router.put('/:id', authMiddleware, usuarioController.update);

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Elimina un usuario
 *     description: Borra un usuario del sistema según su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a eliminar.
 *         schema:
 *           type: integer
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
 *     description: Inicia sesión con un usuario y devuelve un token JWT.
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
 *                 description: Correo electrónico del usuario.
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario.
 *     responses:
 *       200:
 *         description: Login exitoso. Devuelve un token JWT.
 *         content:
 *           application/json:
 *             example:
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Credenciales incorrectas.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error en el servidor.
 */
router.post('/login', usuarioController.login);

module.exports = router;
