/**
 * @fileOverview Archivo de control para aplicar Cambios de Valor DxD financiaciones
 * @author rsagudelo
 * @requires importar.modelo.js
 * @version 1.0.0
 */

/** @namespace */
var aplicarControl = {
    /**
     * Consulta el progreso de la aplicacion de cambios DxD de las financiaciones
     * @param {Function} success - Función que recibe la información enviada por el servidor
     */
    consultarProgreso: function (success) {
        __cnn.ajax({
            url: 'progreso/',
            completado: success
        });
    },
    /**
     * Consulta el resumen final de la aplicacion de los DxD a las financiaciones 
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
     * Descargar el archivo con los registros cargads con error
     */
    descargarErrores: function (success , data) {
        __cnn.ajax({
            url: 'gen_errores/',
            data: data,
            completado: success
        });
    },
    
     /**
     * Descargar el archivo con los saldos de los de los Dxd
     */
    descargarSaldos: function (success , data) {
        __cnn.ajax({
            url: 'gen_saldos/',
            data: data,
            completado: success
        });
    }
    
};
