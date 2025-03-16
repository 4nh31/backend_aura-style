const db = require('../config/db');
const verifyToken = require('../middlewares/authMiddleware');

class Categoria {
  // Obtener todas las categorías (protegido con JWT)
  static async getAll(req, res) {
    verifyToken(req, res, async () => {
      try {
        const [rows] = await db.query('SELECT * FROM Categoria');
        res.json(rows);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
  }

  // Crear una categoría (protegido con JWT)
  static async createCategoria(req, res) {
    verifyToken(req, res, async () => {
      const { nombre, descripcion, parent_id } = req.body;

      if (!nombre) {
        return res.status(400).json({ error: 'El nombre es obligatorio' });
      }

      try {
        const [result] = await db.query(
          'INSERT INTO Categoria (nombre, descripcion, parent_id) VALUES (?,?,?)',
          [nombre, descripcion, parent_id]
        );
        res.status(201).json({ message: 'Categoría creada con éxito', id: result.insertId });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
  }

  // Obtener una categoría por ID (protegido con JWT)
  static async getById(req, res) {
    verifyToken(req, res, async () => {
      const { id } = req.params;
      try {
        const [rows] = await db.query('SELECT * FROM Categoria WHERE idCategoria = ?', [id]);
        if (!rows.length) return res.status(404).json({ error: 'Categoría no encontrada' });
        res.json(rows[0]);
      } catch (err) {
        res.status(500).json({ error: 'Error al buscar la categoría' });
      }
    });
  }

  // Eliminar una categoría (protegido con JWT)
  static async delete(req, res) {
    verifyToken(req, res, async () => {
      const { id } = req.params;

      try {
        await db.query('DELETE FROM Categoria WHERE idCategoria = ?', [id]);
        res.json({ message: 'Categoría eliminada con éxito' });
      } catch (err) {
        res.status(500).json({ error: 'Error al eliminar la categoría' });
      }
    });
  }
}

module.exports = Categoria;