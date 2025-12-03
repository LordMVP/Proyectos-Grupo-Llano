/**
* @fileOverview Archivo de control para consultar recaudo
* @author AppFuture
* @requires consultar.modelo.js
* @version 1.0.0
*/

/** @namespace */
var consultarControl = {
    /**
     * Consulta los recaudos que coincidan con los parámetros de búsquedas.
     * @param  {object} data - Parámetros que se envían al servidor (idRegistro,idSuscripcion,fechaInicio,fechaFin)
     * @param  {function} success - Función invocada cuando cargan datos desde servidor 
     * (consultaVista.onFiltrarCompleto)
     * @returns {void}
     */
    consultarRecaudos: function (data, completado){
        __cnn.ajax({
            'url':'consultar_recaudos',
            'data':data,
            'completado':completado
        });
    },    
    /**
     * Consulta facturas, conceptos y formas de pago de un recaudo
     * @param  {object} data - Parámetros que se envían al servidor (idRecaudo)
     * @param  {function} success - Función invocada cuando cargan datos desde servidor 
     * (consultaVista.onCargarDetallesCompleto)
     * @returns {void}
     */
    consultarDetallesRecaudo:function(data, completado){
        __cnn.ajax({
            'url':'obtener_informacion_recaudo',
            'data':data,
            'completado':completado
        });
    },
    /**
     * Consulta el límite de impresiones de un recaudo que tiene un usuario
     * @param  {object} data - Parámetros que se envían al servidor (idRecaudo)
     * @returns {void}
     */
    consultarLimite:function(data, success){
        __cnn.ajax({
            'url':'../impresiones/informacion_impresion_usuario/',
            'data':data,
            completado: success
        });
    },
    /**
     * Consulta el límite de impresiones de un recaudo que tiene un usuario
     * @param  {object} data - Parámetros que se envían al servidor (idRecaudo)
     * @returns {void}
     */
    actualizarAutorizacion:function(data, success){
        __cnn.ajax({
            'url':'../impresiones/actualizar_impresion/',
            'data':data,
            completado: success
        });
    }
};