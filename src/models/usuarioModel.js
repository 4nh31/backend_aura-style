const db = require('../config/db');

class User {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM usuario');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM usuario WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(user) {
    const { nombre, email, password } = user;
    const [result] = await db.query('INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)', [nombre, email, password]);
    return result.insertId;
  }

  static async update(id, user) {
    const { nombre, email, password } = user;
    await db.query('UPDATE usuario SET nombre = ?, correo = ?, contrasena = ? WHERE id = ?', [nombre, email, password, id]);
    return true;
  }

  static async delete(id) {
    await db.query('DELETE FROM usuario WHERE idUsuario = ?', [id]);
    return true;
  }
}

module.exports = User;
