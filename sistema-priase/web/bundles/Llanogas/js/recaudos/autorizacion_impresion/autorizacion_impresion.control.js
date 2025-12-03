/**
* @fileOverview Archivo de control de gestión de autorizaciones de impresión
* @author AppFuture
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
            'url':'../consultar_recaudo/consultar_recaudos',
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
            'url':'../consultar_recaudo/obtener_informacion_recaudo',
            'data':data,
            'completado':completado
        });
    },
    /**
     * Consulta la información del usuario al que se le asignará autorizaciones de impresión
     * @param  {object} data - Parámetros que se envían al servidor (parametro)
     * @param  {function} success - Función invocada cuando cargan datos desde servidor 
     * (consultaVista.onCargarDetallesCompleto)
     * @returns {void}
     */
    consultarDetallesUsuario:function(data, completado){
        __cnn.ajax({
            'url':'informacion_usuario/',
            'data':data,
            'completado':completado
        });
    },
    /**
     * Consulta la cantidad máxima de impresiones por recaudo
     * @param  {object} data - Parámetros que se envían al servidor (idrecaudo)
     * @param  {function} success - Función callback (autorizacionVista función anónima)
     * @returns {void}
     */
    consultarLimite:function(data, completado){
        __cnn.ajax({
            'url':'limite_impresion/',
            'data':data,
            'completado':completado
        });
    },
    /**
     * Consulta las impresiones que tiene disponible un usuario
     * @param  {object} data - Parámetros que se envían al servidor (idrecaudo, idusuario)
     * @param  {function} success - Función callback (autorizacionVista función anónima)
     * @returns {void}
     */
    consultarImpresiones:function(data, completado){
        __cnn.ajax({
            'url':'informacion_impresion_usuario/',
            'data':data,
            'completado':completado
        });
    },
    /**
     * Registrar la cantidad de impresiones de un recaudo permitidas para un usuario
     * @param  {object} data - Parámetros que se envían al servidor (parametro)
     * @param  {function} success - Función invocada cuando cargan datos desde servidor 
     * (consultaVista.onCargarDetallesCompleto)
     * @returns {void}
     */
    registrarAutorizacionImpresion:function(data, completado){
        __cnn.ajax({
            'url':'registrar_impresion/',
            'data':data,
            'completado':completado
        });
    }
};