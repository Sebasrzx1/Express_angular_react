const express = require("express");
const router = express.Router();
const roleController = require("../controllers/roleControlller");
const { protect } = require("../middlewares/authMiddleware");
const { restrictTo } = require("../middlewares/roleMiddleware");

router.use(protect);

router
  .route("/")
  .get(restrictTo("Leer"), roleController.getAllRoles)
  .get(restrictTo("Crear"), roleController.createRole);

router
  .route("/:id")
  .get(restrictTo("Leer"), roleController.getAllRolesById)
  .get(restrictTo("Actualizar"), roleController.updateRole)
  .get(restrictTo("Eliminar"), roleController.deleteRole);

router.put('/:id/permisos', restrictTo('Actualizar'), roleController.assignPermissions);

module.exports = router;