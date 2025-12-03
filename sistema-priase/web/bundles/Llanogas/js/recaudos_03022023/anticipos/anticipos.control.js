/**
* @fileOverview Archivo de control de anticipos
* @author svanegas
* @requires recaudos.js
* @requires anticipos.modelo.js
* @version 1.1.0
*/

/** @namespace */
var anticiposControl = {
    
    /**
     * Consulta la información de un suscriptor
     * @param {object} data - Parámetros de búsqueda (idsuscripcion, documento, codanterior)
     * @param {function} completado - Función Callback (anticiposVista.consultaSuscripcionCompleto)
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
     * Hace petición para consultar los documentos según los filtros
     * @param {Object} data - Filtro de búsqueda (idtipodocumento)
     * @param {Function} completado - Función que procesa la información y la muestra al usuario
     */
    consultarDocumentos: function(data, completado){
        __cnn.ajax({
            'url':'../obtener/documentos/',
            'data':data,
            'completado':completado
        });
    },

    /**
     * Consulta las liquidaciones que pueden generar el anticipo según filtros
     * @param {Object} data - Filtro de búsqueda (la suscripción y el tipo de documento)
     * @param {Function} completado - Función que muestra la respuesta del servidor al usuario
     */
    consultarTiposLiquidacion: function(data, completado){
        __cnn.ajax({
            'url':'../obtener/liquidaciones/',
            'data':data,
            'completado':completado
        });
    },
    /**
     * Consulta los tipos de documentos asociados al tipo de uso de la suscripción (Función sincrona)
     * @param {Object} data - Parámetros que se envía al servidor (idsuscripcion)
     * @returns {Object} - Respuesta del servidor
     */
    consultarTiposDocumentoPorTipoUso:function(data){
        return __cnn.ajax({
            'url':'../obtener/tipos_documento/',
            'data':data,
            'async':false
        });
    },
    /**
     * Consulta los conceptos a los que se les puede aplicar un anticipo según filtros (Función síncrona)
     * @param {Object} data - Información que filtra en el servidor (idliquidacion)
     * @returns {Object} Respuesta del servidor
     */
    consultarConceptosTipoLiquidacion:function(data){
        return __cnn.ajax({
            'url':'../lista_conceptos_anticipos',
            'data':data,
            'async':false        
        });   
    },
    /**
     * Consulta los tipos de documento para la suscripción
     * @param {Object} data - Información enviada al servidor ()
     * @deprecated Ahora se debe utilizar consultarTiposDocumentoPorTipoUso
     * @returns {*}
     */
    consultarDocumentosSuscripcion:function(data){
        return __cnn.ajax({
            'url':'../lista_tiposdocumentos_anticipos',
            'data':data,
            'async':false
        });     
    },

    /**
     * Consulta los tipos de documento para la suscripción según una liquidación
     * @param {Object} data - Información enviada al servidor ()
     * @deprecated Ahora se debe utilizar consultarTiposDocumentoPorTipoUso
     * @returns {*}
     */
    consultarDocumentosLiquidacion:function(data){
        return __cnn.ajax({
            'url':'../lista_tiposdocumentos_por_liquidacion_anticipos',
            'data':data,
            'async':false
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
     * Envía la información al servidor para guardar el anticipo
     * @param {Object} data - Información del recaudo que se guardará (recaudo, distribucion y formasPagos)
     * @param {Function} completado - Función que valida si el proceso fue exitoso
     */
    guardarRecaudo:function(data, completado){
        __cnn.ajax({
            'url':'../registrar_recaudo_anticipos',
            'data':data,
            'completado':completado
        });
    },
    /**
     * Consulta los tipos de documento según una liqudiación
     * @param {number} id - Id de la liquidación de la que buscan los tipos de documento
     * @deprecated version 1.0.0
     * @returns {Object}
     */
    consultarLiquidacionTipoDoc: function(id){
        id = parseInt(id);
        for(var i = 0; i < anticiposModel.liquidaciones.length; i++){
            var liq = anticiposModel.liquidaciones[i];

            if(parseInt(liq.idliquidacion) === id){
                var arrayTipos = [];
                for(var j = 0; j < anticiposModel.tiposdocumento.length; j++){
                    var tipDoc = anticiposModel.tiposdocumento[j];
                    if(parseInt(tipDoc.idtipodocumento) === parseInt(liq.idtipodocumento)){
                        arrayTipos.push(tipDoc);
                    }
                }
                return {arraytipos: arrayTipos, tipos: liq.idtipodocumento};
            }
        }
    }
};