const bcrypt = require('bcrypt');
const db = require('../config/db'); // Asegúrate de que la configuración de la base de datos esté correctamente importada

const encryptPassword = async () => {
  const plainTextPassword = '123'; // La contraseña en texto plano que necesitas cifrar
  const email = 'admin@123.com'; // El correo electrónico del usuario cuya contraseña necesitas cifrar

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);

    await db.query('UPDATE usuario SET contrasena = ? WHERE correo = ?', [hashedPassword, email]);

    console.log('Contraseña cifrada y actualizada correctamente.');
  } catch (error) {
    console.error('Error al cifrar la contraseña:', error);
  }
};

encryptPassword();