//Funcion para manejo de errores
const manejoErrores = (error, pool, tabla) => {
    //console.log("Error producido: ", error);
    console.log("Codigo de error PG producido: ", error.code);
    switch (error.code) {
        case '28P01':
            console.log("autentificacion password falló o no existe usuario: " + pool.options.user);
            break;
        case '23505':
            console.log("No se puede agregar nuevamente al estudiante. ", error.detail);
            break;
        case '42P01':
            console.log("No existe la tabla consultada [" + tabla + "] ");
            break;
        case '22P02':
            console.log("la sintaxis de entrada no es válida para tipo integer");
            break;
        case '3D000':
            console.log("Base de Datos [" + pool.options.database + "] no existe");
            break;
        case '28000':
            console.log("El user/rol [" + pool.options.user + "] no existe");
            break;
        case '42601':
            console.log("Error de sintaxis en la instruccion SQL");
            break;
        case '42703':
            console.log("No existe la columna consultada. " + error.hint);
            break;
        case 'ENOTFOUND':
            console.log("Error en valor usado como localhost: " + pool.options.host);
            break;
        case 'ECONNREFUSED':
            console.log("Error en el puerto de conexion a BD, usando: " + pool.options.port);
            break;
        default:
            console.log("Error interno del servidor");
            break;
    }
};

module.exports = manejoErrores;
