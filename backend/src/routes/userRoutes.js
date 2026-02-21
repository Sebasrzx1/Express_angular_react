const express = require('express');
const UserController = require('../controllers/userController');
const {protect} = require('../middlewares/authMiddleware')
const {restrictTo} = require('../middlewares/roleMiddleware');
const userController = require('../controllers/userController');

const router = express.Router();

//--- Zona protegida --- //
// A partir de aqui, el usuario DEBE tener token
router.use(protect);

//1. Obtener todos (solo quien tenga permiso 'Leer')
// GET /api/v1/users
router.get('/', restrictTo('Leer'), userController.getAll);

//2. crear usuario (Solo Admin/crear)
// POST /api/v1/users
router.post('/', restrictTo('Crear'), userController.create);

//3. Actualizar usuario (Solo Admin/crear)
// PUT /api/v1/users/:id
router.put('/:id', restrictTo('Actualizar'), userController.update);

//4. Eliminar usuario (Solo Admin/Eliminar)
// PUT /api/v1/users/:id
router.put('/:id', restrictTo('Eliminar'), userController.delete);

module.exports = router;