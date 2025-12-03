/**
* @fileOverview Archivo de control de cartera castigada
* @author svanegas
* @requires recaudos.js
* @requires carteracast.model.js
* @version 1.0.0
*/

/** @namespace */
var carteraControl = {

    /**
     * Consulta los suscriptores con cartera castigada
     * @param  {object} data       Parámetros que se envían para consultar la información del suscriptor (idsuscripcion, codanterior, documento, estado)
     * @param  {Function} completado Función de callback que se ejecuta cuando se carga la suscripción (consultaSuscripcionCompleto)
     * @returns {void}
     */
    consultarSuscriptor: function (data, completado){
        __cnn.ajax({
            'url':'../consultar_suscriptor/',
            'data':data,
            'completado':completado
        });
    },

    /**
     * Consulta las facturas con saldo y que estén en estado castigado.
     * @param  {object} data       Parámetros que se envían para consultar las facturas de la suscripción seleccionada (idsuscripcion)
     * @param  {Function} completado Función de callback que se invoca cuando se terminan de cargar las facturas (cargarFacturasCompleto)
     * @returns {void}
     */
    consultarFacturas:function(data, completado){
        __cnn.ajax({
            'url':'../factura_cartera_castigada',
            'data':data,
            'completado':completado
        });
    },

    /**
     * Guarda la información del recaudo
     * @param  {object} data       Parámetros que se envían para guardar la información del recaudo (revisar carteracast.vista.js -> guardarRecaudo)
     * @param  {Function} completado Función de callback que se invoca cuando se agrega un nuevo recaudo
     * @returns {void}
     */
    guardarRecaudo:function(data, completado){
        __cnn.ajax({
            'url':'../registrar_recaudo_abono',
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
    /**
     * Consulta la información de una factura según su id
     * @param {number} id - Id de la factura que se está consultando
     * @param {Object} Información dela factura seleccionada
     */
    consultarFacturaPorId: function(id){
        id = parseInt(id);
        for(var i = 0; i < carteraModel.facturas.length; i++){
            var factura = carteraModel.facturas[i];
            if(parseInt(factura.idfactura) === id){
                return factura;
            }
        }
    }
};
