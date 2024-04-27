//Importar pg y su Clase Pool
const { Pool } = require("pg");

// para habiltar el uso del archivo de ambiente .env
require('dotenv').config();

// Configuración de la base de datos - Objeto de conexion
const config = {
    user:process.env.USER,
    host:process.env.HOST,
    password:process.env.PASSWORD,
    database:process.env.DATABASE,
    port:process.env.PORT
};

// Verificar que todos los parámetros necesarios estén presentes y tengan un valor válido
const requiredParams = ["user", "host", "password", "database", "port"];
for (const param of requiredParams) {
    if (!config[param]) {
        console.error(`Error: Falta el parámetro "${param}" en la configuración de la base de datos.`);
        process.exit(); // bota el servidor luego de tirar el error
    }
}

const pool = new Pool(config);

module.exports = pool;