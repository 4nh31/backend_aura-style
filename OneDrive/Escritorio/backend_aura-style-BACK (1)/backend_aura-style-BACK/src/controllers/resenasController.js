const db = require('../config/db');
const verifyToken = require('../middlewares/authMiddleware');

class ResenaController {
  // Obtener todas las reseñas (protegido con JWT)
  static async getAll(req, res) {
    verifyToken(req, res, async () => {
      try {
        const [rows] = await db.query('SELECT * FROM reseña');
        res.json(rows);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
  }

  // Crear una reseña (protegido con JWT)
  static async create(req, res) {
    verifyToken(req, res, async () => {
      const { idUsuario, idProducto, calificacion, comentario, fecha } = req.body;

      if (!idUsuario || !idProducto || !calificacion || !fecha) {
        return res.status(400).json({ error: 'idUsuario, idProducto, calificacion y fecha son obligatorios' });
      }

      try {
        const [result] = await db.query(
          'INSERT INTO reseña (idUsuario, idProducto, calificacion, comentario, fecha) VALUES (?, ?, ?, ?, ?)',
          [idUsuario, idProducto, calificacion, comentario, fecha]
        );
        res.status(201).json({ message: 'Reseña creada con éxito', id: result.insertId });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
  }

  // Obtener reseña por ID (protegido con JWT)
  static async getById(req, res) {
    verifyToken(req, res, async () => {
      const { id } = req.params;
      try {
        const [rows] = await db.query('SELECT * FROM reseña WHERE idResena = ?', [id]);
        if (!rows.length) return res.status(404).json({ error: 'Reseña no encontrada' });
        res.json(rows[0]);
      } catch (err) {
        res.status(500).json({ error: 'Error al buscar la reseña' });
      }
    });
  }

  // Eliminar una reseña (protegido con JWT)
  static async delete(req, res) {
    verifyToken(req, res, async () => {
      const { id } = req.params;
      try {
        await db.query('DELETE FROM reseña WHERE idResena = ?', [id]);
        res.json({ message: 'Reseña eliminada con éxito' });
      } catch (err) {
        res.status(500).json({ error: 'Error al eliminar la reseña' });
      }
    });
  }
}

module.exports = ResenaController;