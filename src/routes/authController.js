const express = require('express');
const AuthController = require('../controllers/authController');

const router = express.Router();

router.post('/login', AuthController.login);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Solicitar recuperación de contraseña
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Correo de recuperación enviado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.post("/forgot-password", AuthController.forgotPassword);
/**
 * @swagger
 * /reset-password/{token}:
 *   post:
 *     summary: Restablecer contraseña con token
 *     tags: [Autenticación]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token JWT de recuperación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Contraseña restablecida con éxito
 *       400:
 *         description: Token inválido o expirado
 */
router.post("/reset-password/:token", AuthController.resetPassword);
module.exports = router;
