/**
* @fileOverview Archivo de control de generar documento de pago
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
     * (generarDocVista.consultaSuscripcionCompleto)
     * @returns {void}
     */
    consultarSuscripciones:function(data, success){
        __cnn.ajax({
            url:'financiacion/obtener/suscripciones/',
            data:data,
            completado:success
        });
    },
    
    /**
     * Consulta las financiaciones de la suscripción seleccionada.
     * @param  {object} data - Parámetros que se envían al servidor (idSuscripcion)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor 
     * (generarDocVista.consultarFinanciacionCompleto)
     * @returns {void}
     */
    consultarFinanciaciones:function(data, success){
        __cnn.ajax({
            url:'tabla_financiacion',
            data:data,
            completado:success
        });
    },
    
    /**
     * Guarda el nuevo documento de pago de la financiación
     * @param  {object} data - Parámetros que se envían al servidor (financiaciones)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor 
     * (generarDocVista.guardarDocumentoCompleto)
     * @returns {void}
     */
    guardarDocumentoPago:function(data, success){
        __cnn.ajax({
            url:'guardar_documento_pago',
            data:data,
            completado:success
        });
    },
    /**
     * Genera la intereses para el valor que se va abonar
     * @param  {object} data - Parámetros que se envían al servidor (financiaciones)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor 
     * (generarDocVista.GenerarInteresDocumentoCompleto)
     * @returns {void}
     */
    generarInteresesDocumentoPago:function(data, success){
        __cnn.ajax({
            url:'Gen_int_documento_pago',
            data:data,
            completado:success
        });
    },
    /**
     * Consulta los conceptos de una financiación
     * @param  {object} data - Parámetros que se envían al servidor (idfinanciacion)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor 
     * (generarDocVista.onMostrarConceptosCompleto)
     * @returns {void}
     */
    consultarConceptos: function(data, completado){
        __cnn.ajax({
            url:'financiacion/obtener/conceptos',
            data:data,
            completado:completado
        });
    },    
    /**
     * Consulta el porcentaje de interés según la liquidación seleccionada
     * @param  {int} data - Parámetros que se envían al servidor (idliquidacion)
     * @param  {function} success - Función invocada cuando cargan datos desde servidor (Función anónima)
     * @returns {void}
     */ 
    consultarInteres:function(data){
        return __cnn.ajax({
            url:'../cartera/generarfinanciacion/obtener/interes',
            data:data,
            async: false
        });
    },
    /**
     * Consulta los conceptos de una financiación seleccionada
     * @param  {object} id - El id o indice de una financiación
     * @returns {array} factura - Listado de conceptos
     */
    consultarConceptosFila : function(fila){
        var conceptos = [];
        for (var i = 0; i < generarDocModel.conceptosFinanciacion.length; i++) {
            var info = generarDocModel.conceptosFinanciacion[i];
            if (info.fila == fila) {
                conceptos.push(info);
            }
        }
        return conceptos;
    },

    /**
     * Consulta los días de un período específico
     * @param  {Object} data    Objeto con los datos de la petición al servidor
     * @param  {Function} success Función de callback que se ejecuta con la respuesta de la petición.
     * @returns {void}
     */
    consultarDiasPeriodo: function(data, success){
        __cnn.ajax({
            url: '../cartera/consultas_dias/',
            data:data,
            completado: success
        });
    }

};
