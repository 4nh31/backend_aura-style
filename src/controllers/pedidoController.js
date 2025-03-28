
const Pedido = require('../models/pedidoModel');

exports.getAllPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.getAll();
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los pedidos" });
  }
};

exports.getPedidoById = async (req, res) => {
  try {
    const pedido = await Pedido.getById(req.params.id);
    if (pedido) res.json(pedido);
    else res.status(404).json({ message: "Pedido no encontrado" });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el pedido" });
  }
};

exports.getPedidosByUsuario = async (req, res) => {
  try {
    const pedidos = await Pedido.getByUsuario(req.params.idUsuario);
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los pedidos del usuario" });
  }
};

exports.createPedido = async (req, res) => {
  try {
    const pedidoId = await Pedido.create(req.body);
    res.status(201).json({ id: pedidoId, message: "Pedido creado con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el pedido" });
  }
};

exports.updatePedido = async (req, res) => {
  try {
    await Pedido.update(req.params.id, req.body);
    res.json({ message: "Pedido actualizado con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el pedido" });
  }
};

exports.deletePedido = async (req, res) => {
  try {
    await Pedido.delete(req.params.id);
    res.json({ message: "Pedido eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el pedido" });
  }
};

const db = require('../config/db');
const verifyToken = require('../middlewares/authMiddleware');

class Pedido {
  // Obtener todos los pedidos 
  static async getAll(req, res) {
    verifyToken(req, res, async () => {
      try {
        const [rows] = await db.query('SELECT * FROM Pedido');
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
          'INSERT INTO Pedido (fecha, hora, estado, total, tipo_envio, idUsuario, idCupon) VALUES (?,?,?,?,?,?,?)',
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
        const [rows] = await db.query('SELECT * FROM Pedido WHERE idPedido = ?', [id]);
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
        await db.query('DELETE FROM Pedido WHERE idPedido = ?', [id]);
        res.json({ message: 'Pedido eliminado con éxito' });
      } catch (err) {
        res.status(500).json({ error: 'Error al eliminar el pedido' });
      }
    });
  }
}


module.exports = Pedido; // Asegúrate de exportar la clase

