const db = require('../config/db');
const verifyToken = require('../middlewares/authMiddleware');

class Pedido {
  // Obtener todos los pedidos 
  static async getAll(req, res) {
    verifyToken(req, res, async () => {
      try {
        const [rows] = await db.query('SELECT * FROM pedido');
        res.json(rows);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
  }

  //Crear un nuevo pedido
  static async createPedido(req, res) {
    verifyToken(req, res, async () => {
      const { fecha, hora, estado, total, tipo_envio, idUsuario, idCupon } = req.body;

      if (!fecha || !hora || !estado || !total || !idUsuario) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
      }

      try {
        const [result] = await db.query(
          'INSERT INTO pedido (fecha, hora, estado, total, tipo_envio, idUsuario, idCupon) VALUES (?,?,?,?,?,?,?)',
          [fecha, hora, estado, total, tipo_envio, idUsuario, idCupon]
        );
        res.status(201).json({ message: 'Pedido creado con éxito', id: result.insertId });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
  }

  // Obtener un pedido por ID 
  static async getById(req, res) {
    verifyToken(req, res, async () => {
      const { id } = req.params;
      try {
        const [rows] = await db.query('SELECT * FROM pedido WHERE idPedido = ?', [id]);
        if (!rows.length) return res.status(404).json({ error: 'Pedido no encontrado' });
        res.json(rows[0]);
      } catch (err) {
        res.status(500).json({ error: 'Error al buscar el pedido' });
      }
    });
  }

  // Eliminar un pedido 
  static async delete(req, res) {
    verifyToken(req, res, async () => {
      const { id } = req.params;

      try {
        await db.query('DELETE FROM pedido WHERE idPedido = ?', [id]);
        res.json({ message: 'Pedido eliminado con éxito' });
      } catch (err) {
        res.status(500).json({ error: 'Error al eliminar el pedido' });
      }
    });
  }
}



module.exports = Pedido; // Asegúrate de exportar la clase

