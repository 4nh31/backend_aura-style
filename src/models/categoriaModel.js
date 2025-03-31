const db = require('../config/db');

class Categoria {
  // Obtener todas las categorías
  static async getAll() {
<<<<<<< HEAD
    const [rows] = await db.query('SELECT * FROM categoria');
=======
    const [rows] = await db.query('SELECT * FROM Categoria');
>>>>>>> origin/endpoints
    return rows;
  }

  // Crear una categoría
  static async createCategoria({ nombre, descripcion, parent_id }) {
    const [result] = await db.query(
<<<<<<< HEAD
      'INSERT INTO categoria (nombre, descripcion, parent_id) VALUES (?,?,?)',
=======
      'INSERT INTO Categoria (nombre, descripcion, parent_id) VALUES (?,?,?)',
>>>>>>> origin/endpoints
      [nombre, descripcion, parent_id]
    );
    return result;
  }

  // Obtener una categoría por ID
  static async getById(id) {
<<<<<<< HEAD
    const [rows] = await db.query('SELECT * FROM categoria WHERE idCategoria = ?', [id]);
=======
    const [rows] = await db.query('SELECT * FROM Categoria WHERE idCategoria = ?', [id]);
>>>>>>> origin/endpoints
    return rows[0];
  }

  // Eliminar una categoría
  static async delete(id) {
<<<<<<< HEAD
    await db.query('DELETE FROM categoria WHERE idCategoria = ?', [id]);
=======
    await db.query('DELETE FROM Categoria WHERE idCategoria = ?', [id]);
>>>>>>> origin/endpoints
  }
}

module.exports = Categoria;