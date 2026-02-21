const RoleModel = require('../models/roleModel');
const AppError = require('../errors/AppError');
const httpStatus = require('../constants/httpStatus');

//Closure: Una funcion que devuelve otra funcion (el middleware real)

const restrictTo = (requiredPermission) => {
    return async(req, res, next) =>{
        try{
            //1. Asegurarnos de que el usuario existe (protect ya debio ejecutarse)
            if(!req.user || !req.user.id_rol){
                return next (new AppError('Error de sesion: Usuario no identificado', httpStatus.INTERNAL_SERVER_ERROR))
            }

            //2. UbUSCAR LOS PERMISOS DEL ROL DEL USUARIO EN LA bd
            const userPermissions = await RoleModel.getPermissionByRoleId(req.user.id_rol);

            console.log(`Usuario: ${req.user.email } | ${req.user.id_rol} | Permisos: ${userPermissions}`)


            //3. verificar si tiene el permiso requerido
            if(!userPermissions){
                return next(new AppError('No tienes permisos para realizar esta accion.', httpStatus.FORBIDDEN))
            }

            //4. Acceso concedido
            next();
        }catch(error){
            next(error);
        }
    }
}

module.exports = { restrictTo }

//Este middleware se ejecutara despues de protect. Recibira el permiso requerido (ej: 'crear') y verificará si el usuario lo tiene