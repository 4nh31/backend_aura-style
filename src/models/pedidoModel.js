const db = require('../config/db');

class Pedido {
  // Obtener todos los pedidos
  static async getAll() {
<<<<<<< HEAD
    const [rows] = await db.query('SELECT * FROM Pedido');
=======
    const [rows] = await db.query('SELECT * FROM pedido');
>>>>>>> origin/endpoints
    return rows;
  }

  // Crear un pedido
  static async createPedido({ fecha, hora, estado, total, tipo_envio, idUsuario, idCupon }) {
    const [result] = await db.query(
      'INSERT INTO pedido (fecha, hora, estado, total, tipo_envio, idUsuario, idCupon) VALUES (?,?,?,?,?,?,?)',
      [fecha, hora, estado, total, tipo_envio, idUsuario, idCupon]
    );
    return result;
  }

  // Obtener un pedido por ID
  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM pedido WHERE idPedido = ?', [id]);
    return rows[0];
  }

  // Eliminar un pedido
  static async delete(id) {
    await db.query('DELETE FROM pedido WHERE idPedido = ?', [id]);
  }
}

module.exports = Pedido;