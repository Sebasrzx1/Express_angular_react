const dotenv = require("dotenv").config();
const app = require("./src/app");

//Manejo de errores sincronos no capturados (ej: variable no definida)
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXECEPTION! Apagando servidor...");
  console.error(err.name, err.message);
  process.exit(1); // salida forzada
});

const pool = require("./src/config/conexion_db");
const PORT = process.env.PORT || 3000;

// 2. Funcion para iniciar el servidor

const startServer = async () => {
  try {
    //3. verificar conexcion a DB antes de levantar el servidor
    //Hacemos una consulta ligera ('SELECT 1') para asegurar que hay conexion

    await pool.query("SELECT 1");
    console.log("Conexion a Base de datos MYSQL inicializada");

    const server = app.listen(PORT, () => {
      console.log(`Servvidor corriendo en el puerto ${PORT}`);
      console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
    });


    //Manejo de promesas rechazadas no controladas (ej: fallo de conexion a DB en tiempo de ejecucion)
    process.on('unhandledRejection', (err)=>{
        console.error('UNHANDLED REJECTION! apagando servidor...')
        console.error(err.name, err.message);

        //Cerramos en el servidor amablemente antes de salir.
        server.close(() => {
            process.exit(1)
        })
    })

  } catch (error) {
    console.error('Error al conectar la base de datos: ', err.message)
    process.exit(1)
  }
};

startServer()