const NegocioService = require('../services/negocioService');
const catchAsync = require('../errors/catchAsyncs');
const httpSatus = require('../constants/httpStatus');
const {createNegocioSchema, updateNegocioSchema} = require('../validations/negocioValidator') //FALTA VALIDACION

exports.getAllNegocios = catchAsync(async(req, res, next)=>{
    const negocios = await NegocioService.getAllNegocios();

    res.status(httpSatus.OK).json({
        status:'success',
        results: negocios.length,
        data: negocios
    })
});
exports.getNegocioById = catchAsync(async(req, res, next)=>{
    const {id} = req.params
    const negocio = await NegocioService.getNegocioById(id);

    res.status(httpSatus.OK).json({
        status:'success',
        data: negocio
    })
});
exports.createNegocio = catchAsync(async(req, res, next)=>{

    //validar datos con zod
    const validatedData = createNegocioSchema.parse(req.body)
    const negocio = await NegocioService.createNegocio(validatedData);

    res.status(httpSatus.CREATED).json({
        status:'success',
        data: negocio
    })
});
exports.updateNegocio = catchAsync(async(req, res, next)=>{

    const {id} = req.params

    //validar datos con zod
    const validatedData = updateNegocioSchema.parse(req.body)
    const negocio = await NegocioService.updateNegocio(id, validatedData);

    res.status(httpSatus.OK).json({
        status:'success',
        message: 'Negocio actualizado'
    })
});
