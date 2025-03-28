const db = require('../config/db');

const bcrypt = require('bcrypt')


class Pedido {
  // Obtener todos los pedidos
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM Pedido');
    return rows;
  }


  // Crear un pedido
  static async createPedido({ fecha, hora, estado, total, tipo_envio, idUsuario, idCupon }) {
    const [result] = await db.query(
      'INSERT INTO Pedido (fecha, hora, estado, total, tipo_envio, idUsuario, idCupon) VALUES (?,?,?,?,?,?,?)',
      [fecha, hora, estado, total, tipo_envio, idUsuario, idCupon]
    );
    return result;
  }

  // Obtener un pedido por ID
  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM Pedido WHERE idPedido = ?', [id]);
    return rows[0];
  }


  // Obtener pedidos por ID de usuario
  static async getByUsuario(idUsuario) {
    const [rows] = await db.query('SELECT * FROM Pedido WHERE idUsuario = ?', [idUsuario]);
    return rows;
  }

  // Crear un nuevo pedido
  static async create(pedido) {
    const { idUsuario, fecha, total, estado } = pedido;
    const [result] = await db.query(
      'INSERT INTO Pedido (idUsuario, fecha, total, estado) VALUES (?, ?, ?, ?)',
      [idUsuario, fecha, total, estado]
    );
    return result.insertId;
  }

  // Actualizar un pedido
  static async update(id, pedido) {
    const { idUsuario, fecha, total, estado } = pedido;
    await db.query(
      'UPDATE Pedido SET idUsuario = ?, fecha = ?, total = ?, estado = ? WHERE idPedido = ?',
      [idUsuario, fecha, total, estado, id]
    );
    return true;
  }

  // Eliminar un pedido
  static async delete(id) {
    await db.query('DELETE FROM Pedido WHERE idPedido = ?', [id]);
    return true;
  }
}


module.exports = Pedido;

