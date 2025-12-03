/**
* @fileOverview Archivo de control de financiación
* @author AppFuture
* @requires rapido.modelo.js
* @version 1.0.0
*/

/** @namespace */
var recaudoRapidoControl = {
	/**
     * Consulta las suscripciones que coincidan con los parámetros de búsquedas.
     * @param  {object} data - Parámetros que se envían al servidor (idsuscripcion,codigoAnterior)
     * @param  {function} success - Función invocada cuando cargan datos desde servidor 
     * (recaudoRapidoVista.cargarSuscripcion)
     * @returns {void}
     */
    consultarSuscripcion:function(data, completado){
        __cnn.ajax({
            'url':'rapido/informacion_suscripcion',
            'data':data,
            'completado':completado
        });
    },
	/**
     * Consulta las facturas de una suscripción
     * @param  {object} data - Parámetros que se envían al servidor (suscripcion)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor 
     * (recaudoRapidoVista.función )
     * @returns {void}
     */
	consultarFacturas:function(data, completado){
        __cnn.ajax({
            'url':'rapido/facturas_suscripcion',
            'data':data,
            'completado':completado
        });
    },
    /** Consulta las suscripción de una factura
     * @param  {object} data - Parámetros que se envían al servidor (idfactura)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor 
     * (recaudoRapidoVista.cargarSuscripcionFactura)
     * @returns {void}
     */
	consultarSuscripcionFactura:function(data, completado){
        __cnn.ajax({
            'url':'rapido/suscripcion_factura',
            'data':data,
            'completado':completado
        });
    },
    /** Valida si el recaudo será de un recaudador externo
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor 
     * (recaudoRapidoVista.validarRecaudadorExterno )
     * @returns {void}
     */
    validarRecaudadorExterno: function(completado){
        __cnn.ajax({
            'url':'rapido/recaudador_externo',
            'completado':completado
        });
    },
    /** Consulta las empresas que tengan convenio con la empresa logueada
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor 
     * (recaudoRapidoVista.consultarEmpresaConvenio )
     * @returns {void}
     */
    consultarEmpresaConvenio: function(completado){
        __cnn.ajax({
            'url':'rapido/empresas_recaudo',
            'completado':completado
        });
    },

    /**
     * guarda la información del recaudo de tipo pago
     * @param  {object} data -  Envía el objeto json para guardar la información del abono
     * @param  {function} completado función de callback recaudoRapidoVista.onGuardarCompleto
     * @returns {void}
     */
     guardarRecaudo:function(data, completado){
        __cnn.ajax({
            'url':'../registrar_recaudo_pago',
            'data':data,
            'completado':completado
        });
    },
    /**
     * guarda la información del recaudo de tipo abono
     * @param  {object} data - envía el objeto json para guardar la información del abono
     * @param  {function} completado función de callback recaudoRapidoVista.onGuardarCompleto
     * @returns {void}
     */
    guardarRecaudoAbono:function(data, completado){
        __cnn.ajax({
            'url':'../registrar_recaudo_abono',
            'data':data,
            'completado':completado
        });
    },
	/**
     * guarda la información del recaudo de tipo anticipo
     * @param  {object} data - envía el objeto json para guardar la información del abono
     * @param  {function} completado función de callback recaudoRapidoVista.onGuardarCompleto
     * @returns {void}
     */
    guardarRecaudoAnticipo:function(data, completado){
        __cnn.ajax({
            'url':'../registrar_recaudo_anticipos',
            'data':data,
            'completado':completado
        });
    },
    /**
     * Actualiza la cantidad de impresiones autorizadas por usuario
     * @param  {object} data Datos enviados al servidor (idimpresion)
     * @param  {function} completado función de callback (función anónima)
     * @returns {void}
     */
    actualizarAutorizacion:function(data, completado){
        __cnn.ajax({
            'url':'../impresiones/actualizar_impresion/',
            'data':data,
            'completado':completado
        });
    },
};
