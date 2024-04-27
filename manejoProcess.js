// manejo del process.argv - capturar datos por la linea de comandos
const argumentos = process.argv.slice(2);
// posicion 0 funcion a usar
const funcion = argumentos[0];
// resto de posiciones los otros campos
const rut = argumentos[1];
const nombre = argumentos[2];
const curso = argumentos[3];
const nivel = argumentos[4];
// Definiendo una variable global con el nombre de la tabla
const tabla = process.env.TABLA || argumentos[5];
//usar argumentos por defecto

module.exports = { funcion, rut, nombre, curso, nivel, tabla };
// export { funcion, rut, nombre, curso, nivel };