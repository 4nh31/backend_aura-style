const db = require('../config/db');

class Resena {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM reseña');
    return rows;
  }

  static async createResena({ idUsuario, idProducto, calificacion, comentario, fecha }) {
    const [result] = await db.query(
      'INSERT INTO reseña (idUsuario, idProducto, calificacion, comentario, fecha) VALUES (?,?,?,?,?)',
      [idUsuario, idProducto, calificacion, comentario, fecha]
    );
    return result;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM reseña WHERE idResena = ?', [id]);
    return rows[0];
  }

  static async delete(id) {
    await db.query('DELETE FROM reseña WHERE idResena = ?', [id]);
  }
}

module.exports = Resena;