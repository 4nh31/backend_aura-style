const Pedido = require('../models/pedidoModel');

exports.getAll = async (req, res) => {
  try {
    const pedidos = await Pedido.getAll();
    res.json(pedidos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const pedido = await Pedido.getById(req.params.id);
    if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });
    res.json(pedido);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProductos = async (req, res) => {
  try {
    const productos = await Pedido.getProductosDePedido(req.params.id);
    res.json(productos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createPedido = async (req, res) => {
  const { fecha, hora, estado, total, tipo_envio, idUsuario, idCupon, productos } = req.body;

  if (!fecha || !hora || !estado || !total || !idUsuario || !productos || !productos.length) {
    return res.status(400).json({ error: 'Faltan campos obligatorios o productos' });
  }

  try {
    const { idPedido } = await Pedido.createPedidoConProductos({
      fecha, hora, estado, total, tipo_envio, idUsuario, idCupon, productos
    });

    res.status(201).json({ message: 'Pedido creado con éxito', id: idPedido });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear el pedido' });
  }
};

exports.delete = async (req, res) => {
  try {
    await Pedido.delete(req.params.id);
    res.json({ message: 'Pedido eliminado con éxito' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
