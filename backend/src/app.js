const express = require('express');
const cors = require('cors');
const helmet = require('helmet') //Helmet es un middleware esencial para Node.js (especialmente con Express) que aumenta la seguridad de la aplicación configurando automáticamente varios encabezados HTTP. Protege contra vulnerabilidades comunes como ataques XSS, inyección de contenido, clickjacking y rastreo MIME
const path = require('path')
const AppError = require('./errors/AppError');
const globalErrorHandler = require('./middlewares/errorHandler')


const app = express();

//Configurar CORS para permitir acceso desde angular y react
app.use(cors({
    origin: ['http://localhost:4200', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization']
}))

//Configurar Helmet con politicas relajadas para desarrollo
app.use(helmet({
    crossOriginResourcePolicy: {policy: "cross-origin"},
    contentSecurityPolicy: false //Desactivar CSP en desarrollo para evitar bloqueos
}))

app.use(express.json())


//Servir arhcivos estáticos (imagenes subidas).

//Improtar rutas.
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const roleRoutes = require('./routes/roleRoutes')
const permisoRoutes = require('./routes/permisoRoutes')
const negocioRoutes = require('./routes/negocioRoutes')
const uploadRoutes = require('./routes/uploadsRoutes')


//Rutas de autenticacion y usuarios
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/roles', roleRoutes)
app.use('/api/permisos', permisoRoutes)
app.use('/api/negocios', negocioRoutes)
app.use('/api/upload', uploadRoutes)


//Manejo de rutas no encontradsa (404)
app.all(/(.*)/, (req, res, next)=>{
    next(new AppError(`No se pudo encontrar ${req.originalUrl} en este servidor`, 404))
})

//Middleware Global de Errores
app.use(globalErrorHandler)

module.exports = app;