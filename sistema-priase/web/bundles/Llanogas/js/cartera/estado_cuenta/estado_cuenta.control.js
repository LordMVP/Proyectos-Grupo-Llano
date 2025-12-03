/**
* @fileOverview Archivo de control de consulta de estado de cuenta
* @author AppFuture
* @requires estado_cuenta.modelo.js
* @version 1.0.0
*/

/** @namespace */
var estadoCuentaControl = {
    /** Consulta suscriptores según parámetros de búsqueda
     * @param  {object} data - Los parámetros que se envían al servidor (fechacorte, idsuscriptor, documento, codigoanterior)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor (estadoCuentaVista.filtrarSuscripcionCompleto)
     * @returns {void}
     */
    consultarSuscriptor:function(data, success){
        __cnn.ajax({
            url:'consultar/suscripciones/',
            data:data,
            completado:success
        });
    },
    /**
     * Consulta información del estado de la cuenta de una suscripción 
     * @param {object} data - Parámetros a enviar al servidor (idsuscripcion)
     * @param {function} success - Función callback (estadoCuentaVista.onCargarInformacionCompleto)
     * @param {string} url - Routing para la consulta de la información del estado de la cartera
     * @returns {void}
     */
    consultarInformacion:function(data, success, url){
        __cnn.ajax({
            url:(!!url)?url:'consultar/informacion/',
            data:data,
            completado:success
        });
    }
    
};