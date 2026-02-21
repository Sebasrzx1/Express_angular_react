const catchAsync = require('../errors/catchAsyncs');
const AppError  = require('../errors/AppError');
const httpSatus = require('../constants/httpStatus')

/*Controlador para subir imagenes
Multer para procesar los archivos antes de llegar aqui
*/

exports.uploadImage = catchAsync(async(req, res, next) => {
    if(!file){
        return next(new AppError('No se recibio ningun archivo', httpSatus.BAD_REQUEST))
    }


    //Construir URL completa del archivo

    const imageUrl = `uploads/${req.file.filename}`;

    res.status(httpSatus.OK).json({
        status:'success',
        data: {
            filename: req.file.filename,
            url: imageUrl,
            size: req.file.size
        }
    })
})