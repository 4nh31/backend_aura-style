const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

/**
 * Envía un correo de recuperación de contraseña.
 * @param {string} email - Correo del usuario.
 * @param {string} token - Token de recuperación.
 */
const sendResetPasswordEmail = async (email, token) => {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    const mailOptions = {
        from: "noreply@tuapp.com",
        to: email,
        subject: "Recuperación de Contraseña",
        html: `<p>Has solicitado restablecer tu contraseña. Haz clic en el enlace para continuar:</p>
               <a href="${resetLink}">Restablecer Contraseña</a>
               <p>Si no solicitaste esto, ignora este correo.</p>`,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendResetPasswordEmail };
