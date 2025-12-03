/**
* @fileOverview Archivo de control de financiación de ventas
* @author ...
* @requires financiarventas.modelo.js
* @version 1.0.0
*/

/** @namespace */
var reunificarControl = {
    
    /**
     * Carga información de la suscripción que coincidan con los parámetros de búsquedas.
     * @param  {object} data - Parámetros que se envían al servidor (idsuscripcion,idsuscripcion,codigoanterior)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor (reunificarFinanciacionVista.consultaSuscripcionCompleto)
     * @returns {void}
     */
    consultarSuscripciones:function(data, success){
        __cnn.ajax({
            url:'suscripciones/',
            data:data,
            completado:success
        });        
    },
    /**
     * Consulta las financiaciones de una suscripción.
     * @param  {object} data - Parámetros que se envían al servidor (idSuscripcion)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor (reunificarFinanciacionVista.onCargarFinanciacionesCompleto)
     * @returns {void}
     */
    consultarTablaFinanciaciones:function(data, success){
        __cnn.ajax({
            url:'../reestructurar/tabla_financiacion',
            data:data,
            completado:success
        });
    },
    /**
     * Consulta la información detallada de las financiaciones
     * @param  {object} data - Parámetros que se envían al servidor (idSuscripcion)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor (reunificarFinanciacionVista.onCargarInformacionCompleto)
     * @returns {void}
     */
    consultarInformacion:function(data, success){
        __cnn.ajax({
            data:data,
            url:'suscripciones/informacion/',
            completado:success
        });
    },
    /**
     * Consulta datos básicos de los terceros que pueden estar solicitando la financiación
     * @param  {object} data - Los parámetros que se envían al servidor (nombre)
     * @param  {function} success - Función invocada cuando cargan datos desde 
     * servidor (generarFinanciacionVista.mostrarResultado)
     * @returns {void}
     */
    buscarSolicitante:function(data, success){
        __cnn.ajax({
            url:'../../operaciones/suspensiones/consultar_terceros',
            data:data,
            completado:success
        });
    },
    /**
     * Consulta datos básicos de las entidades financieras
     * @param  {object} data - Los parámetros que se envían al servidor (nombre)
     * @param  {function} success - Función invocada cuando cargan datos desde 
     * servidor (generarFinanciacionVista.mostrarResultadoBanco)
     * @returns {void}
     */
    buscarBanco:function(data, success){
        __cnn.ajax({
            url:'../generarfinanciacion/consultar_bancos   ',
            data:data,
            completado:success
        });
    },
    /**
     * Graba la reunificación de las financiaciones
     * @param  {object} data - Parámetros que se envían al servidor (idsuscripcion, financiacion, reunificar)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor (reunificarFinanciacionVista.onGrabarCompleto)
     * @returns {void}
     */
    grabarReunificacion:function(data, success){
        __cnn.ajax({
            url:'grabar/',
            data:data,
            completado:success
        });        
    },
    /**
     * Consulta el porcentaje de interés según la liquidación seleccionada
     * @param  {int} data - Parámetros que se envían al servidor (idliquidacion)
     * @param  {function} success - Función invocada cuando cargan datos desde servidor (Función anónima)
     * @returns {void}
     */ 
    consultarInteres:function(data, success){
        __cnn.ajax({
            url:'../generarfinanciacion/obtener/interes',
            data:data,
            completado:success
        });
    },

    /**
     * Consulta las liquidaciones por tipo documento y documento
     * @param  {object} data - Parámetros que se envían al servidor (iddocumento,idtipodocumento)
     * @param  {function} success - Función invocada cuando cargan datos desde servidor 
     * (generarFinanciacionVista.onConsultarLiquidacionCompleto)
     * @returns {void}
     */
    consultarLiquidacion:function(data, success){
        __cnn.ajax({
            url:'../generarfinanciacion/consultar_liquidaciones',
            data:data,
            completado:success
        });
    }, 
    /** 
     * Consulta los documentos según el tipo de documento seleccionado
     * @param {object} data - Parámetros que se enviarán al servidor (idtipodocumento)
     * @param {function} success - Función callback (reunificarVista.onConsultarDocumentoCompleto)
     * @returns {void}
     **/
     consultarDocumentos: function(data, success){
        __cnn.ajax({
            url: 'documentos/',
            data: data,
            completado: success
        });
     },

     /**
      * Consulta los tipos de documento en el servidor
      * @param  {Object} data    Los datos de la petición al servidor
      * @param  {Function} success La función de callback que se ejecuta con la respuesta del servidor.
      * @returns {void}
      */
     consultarTiposDocumentos: function(data, success){
        __cnn.ajax({
            url: 'tipodocumentos/',
            data: data,
            completado: success
        });
     },

     /**
      * Consulta los días del período
      * @param  {Object} data    Los datos de la petición al servidor
      * @param  {Function} success Función de callback que se ejecuta con la respuesta del servidor.
      * @returns {void}
      */
     consultarDiasPeriodo: function(data, success){
        __cnn.ajax({
            url: '../consultas_dias/',
            data:data,
            completado: success
        });
    }
};