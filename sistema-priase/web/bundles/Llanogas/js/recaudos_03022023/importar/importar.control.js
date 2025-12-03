/**
 * @fileOverview Archivo de control para importar recaudos
 * @author appFuture
 * @requires importar.modelo.js
 * @version 1.0.0
 */

/** @namespace */
var importarControl = {
    /**
     * Consulta el progreso de la subida de los recaudos
     * @param {Function} success - Función que recibe la información enviada por el servidor
     */
    consultarProgreso: function (success) {
        __cnn.ajax({
            url: 'progreso/',
            completado: success
        });
    },
    /**
     * Consulta el resumen final de los recaudos subidos en el servidor
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
    
    consultarSucursales : function (data, success){
         __cnn.ajax({
            url: 'consultarsucursalmediopago/',
            data: data,
            completado: success
        });
    }
    
};
