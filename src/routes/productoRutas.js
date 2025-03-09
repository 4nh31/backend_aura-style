const express = require('express');
const productosController = require('../controllers/producosController');

const router = express.Router();

router.get('/', productosController.getAllProductos);
router.post('/', productosController.createProducto);

module.exports = router;