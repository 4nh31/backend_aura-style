const User = require('../models/usuarioModel');

exports.getAllUsers = async (req, res) => {
  const users = await User.getAll();
  res.json(users);
};

exports.getUserById = async (req, res) => {
  const user = await User.getById(req.params.id);
  if (user) res.json(user);
  else res.status(404).json({ message: "Usuario no encontrado" });
};

exports.createUser = async (req, res) => {
  const userId = await User.create(req.body);
  res.status(201).json({ id: userId, message: "Usuario creado con éxito" });
};

exports.updateUser = async (req, res) => {
  await User.update(req.params.id, req.body);
  res.json({ message: "Usuario actualizado con éxito" });
};

exports.deleteUser = async (req, res) => {
  await User.delete(req.params.id);
  res.json({ message: "Usuario eliminado con éxito" });
};
