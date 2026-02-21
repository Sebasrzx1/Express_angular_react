//Aqui almacenaremos las constantes de los estados httpp para retuilizarlos en el return de estados.

module.exports = { 
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400, //Peticion incorrecta
    UNAUTHORIZED: 401, //No autorizado, es decir lanza que no se ha procesado porque carece de credenciales de autenticacion validas.
    FORBIDDEN: 403, //Prohibido, el servidor entiende la peticion pero se niega a autorizarla
    NOT_FOUND : 404, //No encontrado
    INTERNAL_SERVER_ERROR: 500 //fallos internos del servidor.
}