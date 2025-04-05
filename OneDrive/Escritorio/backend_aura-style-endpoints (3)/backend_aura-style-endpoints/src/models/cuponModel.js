const db = require('../config/db');
 
 class Cupon {
   // Obtener todos los cupones
   static async getAll() {
     const [rows] = await db.query('SELECT * FROM cupon');
     return rows;
   }
 
   // Crear un nuevo cupón
   static async create({ codigo, fecha_expiracion, tipo_descuento, valor_descuento }) {
     const [result] = await db.query(
       'INSERT INTO cupon (codigo, fecha_expiracion, tipo_descuento, valor_descuento) VALUES (?, ?, ?, ?)',
       [codigo, fecha_expiracion, tipo_descuento, valor_descuento]
     );
     return result;
   }
 
   // Obtener cupón por ID
   static async getById(id) {
     const [rows] = await db.query('SELECT * FROM cupon WHERE idCupon = ?', [id]);
     return rows[0];
   }
 
   // Eliminar un cupón
   static async delete(id) {
     const [result] = await db.query('DELETE FROM cupon WHERE idCupon = ?', [id]);
     return result;
   }
 
   // Validar un cupón por código
   static async validarCupon(codigo) {
     const [rows] = await db.query(
       'SELECT * FROM cupon WHERE codigo = ? AND fecha_expiracion >= CURDATE()',
       [codigo]
     );
     return rows[0];
   }
 }
 
 module.exports = Cupon;