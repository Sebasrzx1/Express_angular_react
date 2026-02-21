const RoleModel = require('../models/roleModel');
const catchAsync = require('../errors/catchAsyncs');
const AppError = require('../errors/AppError');

//GET /api/roles - Obtenr todos los role s(con sus permisos)
exports.getAllRoles = catchAsync(async(req, res, next) => {
    const roles = await RoleModel.findAll();

    //Agregar permisos a cada rol
    const rolesWithPermisssions = await Promise.all(
        roles.map(async (role) => {
            const permissions = await RoleModel.getPermissionsWithIdByRoleId(role.id_rol);
            return {
                ...role,
                permisos: permissions
            };
        })
    );

    res.tatus(200).json({
        status: 'success',
        results: rolesWithPermisssions.length,
        data: rolesWithPermisssions
    })
});

//GET /api/roles/:id - Obtener un rol por ID (con sus permisos)
exports.getAllRolesById = catchAsync(async(req, res, next) => {
    const {id} = req.params 
    const role = await RoleModel.findById(id)

    if(!role){
        throw AppError('No se encontrol el rol con ese ID', 404)
    }


    //Obtener los permisos del rol con sus IDs para edición
    const permissions = await RoleModel.getPermissionsWithIdByRoleId(id);

    //Agregar permisos al objeto rol
    role.permisos = permissions;

    res.status(200).json({
        status: 'success',
        data: role
    })
})


// POST /api/roles - Crear un nuevo rol
exports.createRole = catchAsync(async (req, res, next) => {
  const { nombre, descripcion } = req.body;

  if (!nombre) {
    return next(new AppError('El nombre del rol es obligatorio', 400));
  }

  const roleId = await RoleModel.create({ nombre, descripcion });
  const role = await RoleModel.findById(roleId);

  res.status(201).json({
    status: 'success',
    data: role
  });
});


// PUT /api/roles/:id - Actualizar un rol
exports.updateRole = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;

  const affectedRows = await RoleModel.update(id, { nombre, descripcion });

  if (affectedRows === 0) {
    return next(new AppError('No se encontró el rol con ese ID', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Rol actualizado correctamente'
  });
});
// DELETE /api/roles/:id - Eliminar un rol
exports.deleteRole = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const affectedRows = await RoleModel.delete(id);

  if (affectedRows === 0) {
    return next(new AppError('No se encontró el rol con ese ID', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Rol eliminado correctamente'
  });
});


// PUT /api/roles/:id/permisos - Asignar permisos a un rol
exports.assignPermissions = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { permissionIds } = req.body;

  if (!Array.isArray(permissionIds)) {
    return next(new AppError('permissionIds debe ser un array', 400));
  }

  await RoleModel.assignPermissions(id, permissionIds);

  res.status(200).json({
    status: 'success',
    message: 'Permisos asignados correctamente'
  });
});
