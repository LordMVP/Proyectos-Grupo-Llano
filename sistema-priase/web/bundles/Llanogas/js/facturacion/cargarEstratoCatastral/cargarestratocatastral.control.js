/**
* @fileOverview Archivo de control para cargar factor corrección
* @author AppFuture
* @requires carteraCastigada.modelo.js
* @version 1.0.0
*/

/** @namespace */
var cargarestratocatastralControl = {
    /** Consulta un suscriptor segùn criterios de búsqueda en la aplicación
     * @param  {object} data - Los parámetros que se envían al servidor (idsuscripcion)
     * @returns {void}
     */
    consultarSuscriptor: function (data, completado){
        __cnn.ajax({
            'url':'consultar_suscriptor/',
            'data':data,
            'completado':completado
        });
    },
    

    consultartablatemporal: function (data, completado){
        __cnn.ajax({
            'url':'consultar_temp_estratocatastral/',
            'data':data,
            'completado':completado
        });
    },
    
    consultaresumentablatemporal: function (completado){
        __cnn.ajax({
            'url':'consultar_resumen_temp_estratocatastral/',
            'completado':completado
        });
    }
};