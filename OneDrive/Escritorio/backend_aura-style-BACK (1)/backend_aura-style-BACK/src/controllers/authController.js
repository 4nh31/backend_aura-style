const db = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {sendResetPasswordEmail} = require("../services/mailservice");
require("dotenv").config();

class authController {
  /**
   * Iniciar sesión
   */
  static async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email y contraseña son obligatorios" });
    }

    try {
      const [users] = await db.query("SELECT * FROM usuario WHERE correo = ?", [email]);

      if (users.length === 0) {
        return res.status(401).json({ error: "Usuario no encontrado" });
      }

      const user = users[0];

      const passwordMatch = await bcrypt.compare(password, user.contrasena);
      if (!passwordMatch) {
        return res.status(401).json({ error: "Contraseña incorrecta" });
      }

      const token = jwt.sign(
        { idUsuario: user.idUsuario, rol: user.rol },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );

      res.json({ token, message: "Inicio de sesión exitoso" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  /**
   * Solicitar recuperación de contraseña
   */
  static async forgotPassword(req, res) {
    const { email } = req.body;

    try {
      const [user] = await db.query("SELECT * FROM usuario WHERE correo = ?", [email]);

      if (user.length === 0) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });

      await db.query(
        "UPDATE usuario SET reset_token = ?, token_expiration = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE correo = ?",
        [resetToken, email]
      );

      await sendResetPasswordEmail(email, resetToken);
      res.json({ message: "Correo de recuperación enviado" });
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  /**
   * Restablecer contraseña con token
   */
  static async resetPassword(req, res) {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const email = decoded.email;

      const [user] = await db.query(
        "SELECT * FROM usuario WHERE correo = ? AND reset_token = ? AND token_expiration > NOW()",
        [email, token]
      );

      if (user.length === 0) {
        return res.status(400).json({ message: "Token inválido o expirado" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await db.query(
        "UPDATE usuario SET contrasena = ?, reset_token = NULL, token_expiration = NULL WHERE correo = ?",
        [hashedPassword, email]
      );

      res.json({ message: "Contraseña restablecida con éxito" });
    } catch (error) {
      res.status(400).json({ message: "Token inválido o expirado" });
    }
  }
}

module.exports = authController;