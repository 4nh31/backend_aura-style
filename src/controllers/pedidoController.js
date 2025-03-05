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
