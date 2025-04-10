const db = require('../config/db'); // Conexión a la base de datos

// Obtener productos del carrito de un usuario
exports.getCartProducts = async (userId) => {
  const query = `
    SELECT cp.idProducto, p.nombre, p.precio, cp.cantidad, (p.precio * cp.cantidad) AS subtotal, ip.url AS imagen
    FROM carritoproducto cp
    JOIN producto p ON cp.idProducto = p.idProducto
    LEFT JOIN imagenproducto ip ON p.idProducto = ip.idProducto AND ip.es_principal = 1
    WHERE cp.idCarrito = (SELECT idCarrito FROM carrito WHERE idUsuario = ?);
  `;
  return db.query(query, [userId]);
};

// Agregar o actualizar producto en el carrito
exports.addOrUpdateProduct = async (cartId, productId, price, quantity) => {
  const query = `
    INSERT INTO carritoproducto (idCarrito, idProducto, precio_unitario, cantidad)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE cantidad = LEAST(cantidad + VALUES(cantidad), (SELECT stock FROM producto WHERE idProducto = VALUES(idProducto)));
  `;
  return db.query(query, [cartId, productId, price, quantity]);
};

// Eliminar producto del carrito
exports.removeProduct = async (cartId, productId) => {
  const query = `DELETE FROM carritoproducto WHERE idCarrito = ? AND idProducto = ?;`;
  return db.query(query, [cartId, productId]);
};

// Vaciar carrito
exports.clearCart = async (cartId) => {
  const query = `DELETE FROM carritoproducto WHERE idCarrito = ?;`;
  return db.query(query, [cartId]);
};

// Obtener total del carrito
exports.getCartTotal = async (cartId) => {
  const query = `
    SELECT SUM(precio_unitario * cantidad) AS total
    FROM carritoproducto
    WHERE idCarrito = ?;
  `;
  return db.query(query, [cartId]);
};