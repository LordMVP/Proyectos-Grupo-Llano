/**
 * @fileOverview Archivo de control de reestructuración de la financiación
 * @author AppFuture
 * @requires modelo.js
 * @version 1.0.0
 */

/** @namespace */
var control = {
    /**
     * Consulta las suscripciones que coincidan con los parámetros de búsquedas.
     * @param  {object} data - Parámetros que se envían al servidor (idSuscripcion,documento,codigoAnterior)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor 
     * (reestructuracionVista.consultaSuscripcionCompleto)
     * @returns {void}
     */
    consultarSuscripciones: function (data, success) {
        __cnn.ajax({
            url: 'reestructurar/suscripcion',
            data: data,
            completado: success
        });
    },
    /**
     * Consulta las financiaciones de la suscripción seleccionada.
     * @param  {object} data - Parámetros que se envían al servidor (idSuscripcion)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor 
     * (reestructuracionVista.consultarFinanciacionCompleto)
     * @returns {void}
     */
    consultarFinanciaciones: function (data, success) {
        __cnn.ajax({
            url: 'reestructurar/tabla_financiacion',
            data: data,
            completado: success
        });
    },
    /**
     * Guarda la reestructuración de la financiación
     * @param  {object} data - Parámetros que se envían al servidor (reestructuracion)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor 
     * (reestructuracionVista.guardarReestructuracionCompleto)
     * @returns {void}
     */
    guardarReestructuracion: function (data, success) {
        __cnn.ajax({
            url: 'reestructurar/guardar',
            data: data,
            completado: success
        });
    },
    /**
     * Consulta el porcentaje de interés según la liquidación seleccionada
     * @param  {int} data - Parámetros que se envían al servidor (idliquidacion)
     * @param  {function} success - Función invocada cuando cargan datos desde servidor (Función anónima)
     * @returns {void}
     */
    consultarInteres: function (data, success) {
        __cnn.ajax({
            url: '../cartera/generarfinanciacion/obtener/interes',
            data: data,
            completado: success
        });
    },
    /**
     * Busca la información de la liquidación de una financiación
     * @param {number} idfinanciacion - Identificador de la financiaicón que contiene la liquidación
     * @param {number} idliquidacion {- Identificador de la liquidación que se está buscando
     * @returns {object} - Información de una liquidacion
     */
    consultarLiquidacionFacturaPorId: function (idfinanciacion, idliquidacion) {
        idliquidacion = parseInt(idliquidacion);
        idfinanciacion = parseInt(idfinanciacion);
        for (var indexF = 0; indexF < reestructurarModel.financiaciones.length; indexF++) {
            var financiacion = reestructurarModel.financiaciones[indexF];
            if (parseInt(financiacion.idfinanciacion) === idfinanciacion) {
                return control.consultarLiquidacionPorId(financiacion.liquidaciones, idliquidacion);
            }
        }
    },

    /**
     * Consulta una liquidación por ID en el arreglo de liquidaciones
     * @param  {Array} array Arreglo donde se hará la búsqueda.
     * @param  {Number} id    Id de la liquidación que se buscará
     * @returns {Object}       Liquidación encontrada.
     */
    consultarLiquidacionPorId: function (array, id) {
        for (var indexL = 0; indexL < array.length; indexL++) {
            var liquidacion = array[indexL];
            if(parseInt(liquidacion.idliquidacion) === id){
                return liquidacion;
            }
        }
    },

    /**
     * Consulta los días del período
     * @param  {Object} data    Los datos de la petición
     * @param  {Function} success Función de callback que se ejecuta con la respuesta.
     * @returns {void}
     */
    consultarDiasPeriodo: function(data, success){
        __cnn.ajax({
            url: 'consultas_dias/',
            data:data,
            completado: success
        });
    }
};
