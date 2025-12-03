/**
* @fileOverview Archivo de control de cerrar suspensiones y reconexiones
* @author AppFuture
* @requires proceso.cierre.modelo.js
* @version 1.0.0
*/

/** @namespace */
var procesoCierreControl = {

    /**
     * Ejecuta el proceso de cerrar suspensiones y reconexiones
     * @param {Objeto} data - Información para ejecutar (idciclo)
     * @param {Function} completado - Función que verifica que se haya iniciado correctamente
     */
    aplicarSuspensiones: function(data, completado) {
        __cnn.ajax({
            'url': 'ejecutar_proceso/',
            'data': data,
            'completado': completado
        });
    },

    /**
     * consulta el progreso del cierre de suspensiones y reconexiones.
     * @param completado
     */
    consultarProgreso: function(completado) {
        __cnn.ajax({
            'url': 'progreso/',
            'background': true,
            'completado': completado
        });
    },
    /**
     * Consulta el resultado final de la ejecución del proceso
     * @param {Function} completado - Función que recibe la infomación
     */
    consultarResumen: function(completado) {
        __cnn.ajax({
            'url': 'resumen/',
            'completado': completado
        });
    }
    

};