// Conexion a base de datos
const pool = require('./conexion.js'); 
// manejo de errores
const manejoErrores = require('./manejoErrores.js');
// argv
const { funcion, rut, nombre, curso, nivel, tabla } = require('./manejoProcess.js');
// para habiltar el uso del archivo de ambiente .env
require('dotenv').config();
// console.log('tabla desde env: ',process.env.TABLA) // esto fue porq en algun momento no funciona pero ahora si, creo que estaba cargando (?)

//FUNCIONES

//Funcion para validar rut
const validarRut = (rut) => {
    const rutExpReg = /^\d{1,2}\.\d{3}\.\d{3}-\d{1,2}$/;
    return rutExpReg.test(rut);
}
//Funcion para consultar todos los estudiantes
const getEstudiantes = async () => {
    try {
        const res = await pool.query(
            {
                rowMode: "array",
                text: `SELECT * FROM ${tabla}`
            }
        );
        if (res.rows != 0) {
            console.log("Registro actual de Estudiantes:", res.rows);
        } else {
            console.log("No hay registros de estudiantes");
        }
    } catch (error) {
        // manejo general de errores
        manejoErrores(error, pool, tabla);
    }
}
//Funcion para consultar por rut
const consultaRut = async ({ rut }) => {
    try {
        const res = await pool.query(
            {
                text: `SELECT * FROM ${tabla} WHERE rut = $1`,
                values: [rut]
            }
        );
        if (!rut) {
            console.log("Debe ingresar el campo rut")
        }
        else if (!validarRut(rut)) {
            console.log("El rut ingresado no tiene el formato correcto, ejemplo: 11.111.111-1")
        }
        else if (res.rows == 0) {
            console.log("El rut ingresado no existe");
        } else {
            console.log("Estudiante consultado: ", res.rows[0]);
        }
    } catch (error) {
        // manejo general de errores
        manejoErrores(error, pool, tabla);
    }
}
//Funcion para agregar un nuevo estudiante
const nuevoEstudiante = async ({ rut, nombre, curso, nivel }) => {
    try {
        if (!validarRut(rut)) {
            console.log("El rut ingresado no tiene el formato correcto ejemplo: 11.111.111-1");
        } else if (!nombre || !curso || !nivel) {
            console.log("Debe ingresar los campos rut, nombre, curso y nivel");
        } else {
            const res = await pool.query(
                {
                    text: `INSERT INTO ${tabla} values ($1, $2, $3, $4) RETURNING *`,
                    values: [rut, nombre, curso, nivel]
                }
            );
            console.log(`Estudiante ${nombre} agregado con éxito`);
            console.log("Estudiante Agregado: ", res.rows[0]);
        }
    } catch (error) {
        // manejo general de errores
        manejoErrores(error, pool, tabla);
    }
}
//Funcion para editar un estudiante por su nombre
const editarEstudiante = async ({ rut, nombre, curso, nivel }) => {
    try {
        const res = await pool.query(
            {
                text:`UPDATE ${tabla} SET nombre = $2, curso = $3, nivel = $4 WHERE rut = $1 RETURNING *`,
                values:[rut, nombre, curso, nivel]
            }
        );
        if (!validarRut(rut)) {
            console.log("El rut ingresado no tiene el formato correcto, ejemplo: 11.111.111-1");
        } else if (!nombre || !curso || !nivel) {
            console.log("Debe ingresar los campos rut, nombre curso y nivel");
        } else if (res.rows == 0) {
            console.log("El estudiante ingresado no existe");
        }
        else {
            console.log(`Estudiante ${nombre} editado con éxito`);
            console.log("Estudiante Editado: ", res.rows[0]);
        }
    } catch (error) {
        // manejo general de errores
        manejoErrores(error, pool, tabla);
    }
}
//Funcion para eliminar un estudiante por su rut
const eliminarEstudiante = async ({ rut }) => {
    try {
        const res = await pool.query(
            {
                text:`DELETE FROM ${tabla} where rut = $1 RETURNING *`,
                values:[rut]
            }
        );
        if (!rut) {
            console.log("Debe ingresar el campo rut")
        }
        else if (!validarRut(rut)) {
            console.log("El rut ingresado no tiene el formato correcto, ejemplo: 11.111.111-1")
        }
        //res.rows.length == 0 //res.rows == [] ta malo //res.rows == 0 tampoco xq 
        else if (res.rowCount == 0) {
            console.log("El rut ingresado no existe");
        } else {
            console.log(`Registro de Estudiante con rut ${rut} eliminado con éxito`);
        }
    } catch (error) {
        // manejo general de errores
        manejoErrores(error, pool, tabla);
    }
}
// Funcion IIFE que recibe de la linea de comando y llama funciones asincronas internas
(() => {
    // recibir funciones y campos de la linea de comando
    switch (funcion) {
        case 'nuevo':
            nuevoEstudiante({ rut, nombre, curso, nivel })
            break;
        case 'rut':
            consultaRut({ rut })
            break;
        case 'consulta':
            getEstudiantes()
            break;
        case 'editar':
            editarEstudiante({ rut, nombre, curso, nivel })
            break;
        case 'eliminar':
            eliminarEstudiante({ rut })
            break;
        default:
            console.log("Funcion: " + funcion + " no es valida")
            break;
    }
    pool.end()
})()
// instrucciones de uso:
// ingresar nuevo estudiante: node server nuevo 13.245.003-8 'Pedro Paramo' 'Biologia' 5
// consultar todos: node server consulta
// consultar por rut: node server rut 13.245.003-8
// editar estudiante por nombre: node server editar 13.245.003-8 'Pedro Paramo' 'Biologia II' 8
// eliminar estudiante por rut:  node server eliminar 13.245.003-8 (editado) 