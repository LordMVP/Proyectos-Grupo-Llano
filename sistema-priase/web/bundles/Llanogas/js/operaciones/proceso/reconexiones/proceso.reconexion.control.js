/**
 * @fileOverview Archivo de control para el proceso que generar reconexiones encargado de controlar las peticiones al servidor
 * @requires proceso.reconexion.modelo.js
 * @namespace procesoReconexionControl
 * @author AppFuture
 * @version 1.0.0
 */

var procesoReconexionControl = {
    /**
     * Consulta los motivos de las suspensiones de acuerdo al tipo de suscripción
     * @deprecated
     */
    consultarMotivosSuspension: function(data, completado) {
        __cnn.ajax({
            'url': 'consultar_motivos_suspension/',
            'data': data,
            'completado': completado
        });
    },

    /**
     * Ejecuta el proceso de generación de reconexiones
     * @param data
     * @param completado
     */
    aplicarSuspensiones: function(data, completado) {
        __cnn.ajax({
            'url': 'ejecutar_proceso/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta el progreso de del proceso de generar reconexiones
     * @param {Function} completado - Función que evalúa el resultado del servidor
     */
    consultarProgreso: function(completado) {
        __cnn.ajax({
            'url': 'progreso/',
            'background': true,
            'completado': completado
        });
    },
    /**
     * Consulta el resumen del proceso es decr mostrará lo generado
     * @param {Function} completado - Función que verifica la respuesta del servidor
     */
    consultarResumen: function(completado) {
        __cnn.ajax({
            'url': 'resumen/',
            'completado': completado
        });
    }

};