const express = require('express');
const router = express.Router()
const negocioController = require('../controllers/negocioController');
const {protect} = require('../middlewares/authMiddleware');
const { restrictTo } = require('../middlewares/roleMiddleware'); 

//Todas las rutas estan protegidas
router.use(protect)

// GET /api/negocios - Obtener todos (requiere permiso leer)
router.get('/', restrictTo('Leer'), negocioController.getAllNegocios)

// GET /api/negocios/:id - Obtener uno por ID (requiere permiso leer)
router.get('/:id', restrictTo('Leer'), negocioController.getNegocioById)

// POST /api/negocios/:id - crear negocio (requiere permiso crear)
router.post('/', restrictTo('Crear'), negocioController.createNegocio)

// PUT /api/negocios/:id - Actualizar negocio (requiere permiso Actualizar)
router.put('/:id', restrictTo('Actualizar'), negocioController.updateNegocio)

module.exports = router;