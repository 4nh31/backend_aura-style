const express = require('express');
const usuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middlewares/authMiddleware'); // Asegúrate de importarlo
const router = express.Router();

router.get('/', authMiddleware, usuarioController.getAll);  // <-- Middleware agregado aquí
router.get('/:id', authMiddleware, usuarioController.getById);
router.post('/', authMiddleware, usuarioController.create);
router.put('/:id', authMiddleware, usuarioController.update);
router.delete('/:id', authMiddleware, usuarioController.delete);
router.post('/login', usuarioController.login);
module.exports = router;
