/**
* @fileOverview Archivo de control de financiación
* @author AppFuture
* @requires cerrar.model.js
* @version 1.0.0
*/

/** @namespace */
var  cerrarControl = {
   /** Inicia proceso para cerrar un recaudo en el servidor
     * @param  {function} data - Parámetros que se envían al servidor (idTipoSuscripcion) 
     * @param  {function} success - Función invocada cuando cargan datos desde servidor  (cerrarVista.ejecutoProceso)
     * @returns {void}
     */
    cerrarRecaudos: function(data, completado) {
        __cnn.ajax({
            'url': 'cerrar/',
            'data': data,
            'completado': completado
        });
    },
    /** Consulta el progreso de cierre de recaudo 
     * @param  {function} success - Función invocada cuando cargan datos desde servidor  (cerrarVista.actualizarProgreso)
     * @returns {void}
     */
    consultarProgreso: function(completado) {
        __cnn.ajax({
            'url': 'progreso/',
            'completado': completado
        });
    },
    /**
     * Consulta el resumen del proceso
     * @param {Function} completado - Función que recibe el resumen del proceso y lo muestra al usuario
     */
    consultarResumen: function(completado) {
        __cnn.ajax({
            'url': 'resumen/',
            'completado': completado
        });
    }

};