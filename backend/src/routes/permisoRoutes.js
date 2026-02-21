const express = require('express');
const router = express.Router();
const permisoController = require('../controllers/permisoController');
const {protect} = require('../middlewares/authMiddleware');
const {restrictTo} = require('../middlewares/roleMiddleware');

//Todas las rutas requiren autenticación

router.use(protect)

router.route('/')
    .get(restrictTo('Leer'), permisoController.getAllPermisos)
    .get(restrictTo('Crear'), permisoController.createPermiso)

router.route('/:id')
    .get(restrictTo('Leer'), permisoController.getAllPermisoById)
    .get(restrictTo('Actualizar'), permisoController.updatePermiso)
    .get(restrictTo('Eliminar'), permisoController.deletePermiso)

module.exports = router;