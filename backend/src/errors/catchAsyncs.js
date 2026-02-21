/* 
Wrapper para funciones asincronicas en Express
Captur automaticamente errores  ylos pasa al middlewware de manejo de errores
evita tener que esrcibir try/catch en cada controlador
*/

module.exports = (fn) => {
    return(req,res, next) => {
        fn(req, res, next).catch(next);
    }
}