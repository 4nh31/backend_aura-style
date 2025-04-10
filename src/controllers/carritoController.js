const cartModel = require('../models/carritoModel'); // Importar el modelo del carrito
const db = require('../config/db'); // Conexión a la base de datos

// Obtener productos del carrito
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.idUsuario; // Obtener ID del usuario autenticado
    const products = await cartModel.getCartProducts(userId);
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Agregar o actualizar producto en el carrito
exports.addProduct = async (req, res) => {
  try {
    const { productId, price, quantity } = req.body;
    const cartId = req.user.cartId; // Obtener ID del carrito del usuario
    await cartModel.addOrUpdateProduct(cartId, productId, price, quantity);
    res.status(200).json({ success: true, message: 'Producto agregado/actualizado en el carrito' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Eliminar producto del carrito
exports.removeProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const cartId = req.user.cartId;
    await cartModel.removeProduct(cartId, productId);
    res.status(200).json({ success: true, message: 'Producto eliminado del carrito' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Vaciar carrito
exports.clearCart = async (req, res) => {
  try {
    const cartId = req.user.cartId;
    await cartModel.clearCart(cartId);
    res.status(200).json({ success: true, message: 'Carrito vaciado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Obtener total del carrito
exports.getTotal = async (req, res) => {
  try {
    const cartId = req.user.cartId;
    const total = await cartModel.getCartTotal(cartId);
    res.status(200).json({ success: true, data: total });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};