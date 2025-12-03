/**
 * @fileOverview Archivo de control para importar financiaciones
 * @author rsagudelo
 * @requires importar.modelo.js
 * @version 1.0.0
 */

/** @namespace */
var generarControl = {
    /**
     * Consulta el progreso de la subida de las financiaciones
     * @param {Function} success - Función que recibe la información enviada por el servidor
     */
    consultarProgreso: function (success) {
        __cnn.ajax({
            url: 'progreso/',
            completado: success
        });
    },
    /**
     * Consulta el resumen final de las financiaciones subidas en el servidor
     * @param {Function} success - Función que recibe la información enviada por el servidor
     */
    consultarResumen: function (success) {
        __cnn.ajax({
            url: 'resumen/',
            completado: success
        });
    },
    /**
     * Elimina la tabla de resumen en la base de datos
     */
    eliminarResumen: function (success) {
        __cnn.ajax({
            url: 'eliminar_tabla/',
            completado: function(){}
        });
    },
     /**
     * Descargar el archivo con las cuotas a cobrar
     */
    descargarDatos: function (success , data) {
        __cnn.ajax({
            url: 'generar/',
            data: data,
            completado: success
        });
    }
    
};
