const express = require('express');
const productosController = require('../controllers/producosController');
const verifyToken = require('../middlewares/authMiddleware'); 
const router = express.Router();

router.get('/', productosController.getALL);
router.post('/', productosController.createProducto);
router.get('/:id', productosController.getById);
router.delete('/id', productosController.delete);

module.exports = router;