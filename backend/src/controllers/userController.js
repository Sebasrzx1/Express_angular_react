const UserService = require("../services/userService");
const AppError = require("../errors/AppError");
const httpStatus = require("../constants/httpStatus");
const {
  validateCreateUser,
  validateUpdateUser,
} = require("../validations/userValidator"); // IMPORTACION NUEVA

//Desde los endpoits o routes se conectan con los controladores y estos se comunican con los servicios para recibir y dar respuesta.

const userController = {
  async getAll(req, res, next) {
    try {
      const users = await UserService.getAllUsers();
      res.status(httpStatus.OK).json({
        status: "success",
        result: users.length,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      //validacion con Zod
      const validation = validateCreateUser(req.body);

      if (!validation.success) {
        //Formateamos los errores para que sean legibles
        const errorMessage = validation.error.errors.map(e => e.message).join(", ");
        throw new AppError(errorMessage, httpStatus.BAD_REQUEST);
      }

      //Si pasa, se llama al servicio con los datos ya validados (validation.data)
      //Nota: Usar validation.data es mas seguro que req.body por que zod limpia campos extraños

      const newUser = await UserService.createUser(validation.data);

      res.status(httpStatus.CREATED).json({
        status: "success",
        data: newUser,
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      //validacion con Zod

      const validation = validateUpdateUser(req.body);

      if (!validation.success) {
        const errorMessage = validation.error.errors
          .map((e) => e.message)
          .join(", ");
        throw new AppError(errorMessage, httpStatus.BAD_REQUEST);
      }

      //Verificar que al menos envien un dato para actualizar
      if (Object.keys(validation.data).length === 0) {
        throw new AppError(
          "No se enviarion datos para actualizar",
          httpStatus.BAD_REQUEST,
        );
      }

      // Llamada al servicio
      const updated = await UserService.updateUser(id, validation.data);

      if (!updated) {
        //Puede que el usuario no exista, pero el servicio ya maneja eso lanzando error si no encuentra ID
        //Si devuelve false es porque no hubo cambios o error silencios.
      }

      res.status(httpStatus.OK).json({
        status: "success",
        message: "Usuario actualizado correctamente.",
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const {id} = req.params;
      const currentUserId = req.user.id_usuario;

      //Llamamos al servicio.
      //Si el usuario no existe, el servicio lanzará el error 404
      //si intenta borrarse a sí mismo, lanzara un error 403
      // Si todo sale biien, la ejecucion continua
      await UserService.deleteUser(id, currentUserId)
      
      res.status(httpStatus.OK).json({
        status: "success",
        message: "Usuario eliminado correctamente",
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userController;
