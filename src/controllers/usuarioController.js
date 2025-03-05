const User = require('../models/usuarioModel');
const connection = require('../config/db.js'); // Se movió aquí para evitar errores

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

// Nueva función para obtener usuarios
exports.obtenerUsuarios = async (req, res) => {
  connection.query('SELECT * FROM Usuario', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error en la base de datos' });
    }
    res.json(results);
  });
};
