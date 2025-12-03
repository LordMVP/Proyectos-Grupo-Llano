/**
* @fileOverview Archivo de control de aplicar recaudos
* @author AppFuture
* @requires aplicar.model.js
* @version 1.0.0
*/

/** @namespace */
var aplicarControl = {
    /**
     * Consulta motivos de suspensión de acuerdo al tipo de suscripción
     * @param  {object} data - Parámetros que se envían al servidor (idTipoSuscripcion)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor 
     * (aplicarVista.mostrarSuspension)
     * @returns {void}
     */
    consultarMotivosSuspension: function(data, completado) {
        __cnn.ajax({
            'url': 'consultar_motivos_suspension/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Ejecuta el proceso de aplicar recaudos
     * @param  {object} data - Parámetros que se envían al servidor (idTipoSuscripcion,idMotivoSuspension)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor (aplicarVista.ejecutoProceso)
     * @returns {void}
     */
    aplicarRecaudos: function(data, completado) {
        __cnn.ajax({
            'url': 'ejecutar_proceso/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta progreso de aplicación de recaudos
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor (aplicarVista.actualizarProgreso)
     * @returns {void}
     */
    consultarProgreso: function(completado) {
        __cnn.ajax({
            'url': 'progreso/',
            'completado': completado
        });
    },
    /**
     * Consulta el resumen del proceso de aplicar recaudos
     * @param {Function} completado - Función que muestra los resultados del servidor
     */
    consultarResumen: function(completado) {
        __cnn.ajax({
            'url': 'resumen/',
            'completado': completado
        });
    }
};