/**
* @fileOverview Archivo de control de traslado de recaudos
* @author AppFuture
* @requires trasladar.model.js
* @version 1.0.0
*/

/** @namespace */
var trasladoControl = {
    
    /**
     * Consulta recaudos de una suscripción
     * @param  {object} data - Parámetros que se envían al servidor (idRegistro)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor 
     * (trasladoVista.onFiltrarCompleto)
     * @returns {void}
     */
    consultarRecaudos: function(data, completado) {
        __cnn.ajax({
            'url': '../anular_recaudo/buscar_recaudos',
            'data': data,
            'completado': completado
        });
    },
    /** Consulta detalles e información de un recaudo 
     * @param  {object} data - Parámetros que se envían al servidor (idrecaudo)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor 
     * (trasladoVista.onCargarDetallesCompleto)
     * @returns {void}
     */
    consultarDetallesRecaudo:function(data, completado){
        __cnn.ajax({
            'url':'../anular_recaudo/informacion_recaudos',
            'data':data,
            'completado':completado
        });
    },
    /** Consulta suscripciones que coincidan con parámetros de búsqueda para hacer traslado
     * @param  {object} data - Parámetros que se envían al servidor (idsuscripcion, documento, codanterior)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor 
     * (trasladoVista.consultaSuscripcionCompleto)
     * @returns {void}
     */
    consultarSuscriptor:function(data, completado){
        __cnn.ajax({
            'url':'../consultar_suscriptor/',
            'data': data,
            'completado': completado
        });
    },
    
    /** Confirma el traslado del recaudo a otra suscripción
     * @param  {object} data - Parámetros que se envían al servidor (idrecaudo, idmotivo, comentario, idtercerodestino, idsuscriptordestino, suscripciones)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor 
     * (trasladoVista.onTrasladarCompleto)
     * @returns {void}
     */
    confrimarTraslado:function(data, completado){
        __cnn.ajax({
            'url':'grabar',
            'data': data,
            'completado': completado
        });
    }
};