
/**
* @fileOverview Archivo de control de financiación
* @author jeissonBarriga
* @requires model.js
* @version 1.0.0
*/

/** @namespace */
var modificarrecaudoControl = {
    /**
     * Consulta las información adicional de un recaudo
     * @param  {object} data - Parámetros que se envían al servidor (idrecaudo)
     * @param  {function} completado - Función callback (modificarrecaudoVista.consultarInformacionRecaudoCompletado)
     * @returns {void}
     */
    consultarInformacionRecaudo: function(data, completado) {
        __cnn.ajax({
            'url': 'informacion_recaudos/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta los municipios para autocomplete
     * @param  {object} data - Parámetros que se envían al servidor (municipio)
     * @param  {function} completado - Función callback (modificarrecaudoVista.mostrarResultadoMunicipio)
     * @returns {void}
     */
    consultarMunicipios: function(data, completado) {
        __cnn.ajax({
            'url': 'obtener_municipios/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta recaudos según parámetros de búsqueda
     * @param  {object} data - Parámetros que se envían al servidor (municipio, fechas, suscripción, clase de pago)
     * @param  {function} completado - Función callback (modificarrecaudoVista.onConsultarRecaudosCompleto)
     * @returns {void}
     */
    consultarRecaudos: function(data, completado) {
        __cnn.ajax({
            'url': 'buscar_recaudos/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Graba la información del recaudo modificado 
     * @param  {object} data - Parámetros que se envían al servidor (idRecaudo, idMedioPago, idSucursal, fechaPago)
     * @param  {function} completado - Función callback (modificarrecaudoVista.onGrabarOperacionCompleto)
     * @returns {void}
     */
    grabarOperacion: function(data, completado) {
        __cnn.ajax({
            'data': data,
            'url': 'guardar_modificacion/',
            'completado': completado
        });
    },
    /**
     * Consulta los tipos de documentos asociados al tipo de uso de la suscripción (Función sincrona)
     * @param {Object} data - Parámetros que se envía al servidor (idsuscripcion)
     * @returns {Object} - Respuesta del servidor
     */
    consultarTiposDocumentoPorTipoUso:function(data){
        return __cnn.ajax({
            'url':'buscar/tipos_documento/',
            'data':data,
            'async':false
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
    setDistribucionRecaudo: function(data, completado){
        __cnn.ajax({
            'url':'set/distribucion_recaudo/',
            'data':data,
            'completado':completado
        });
    },
     validaRecaudoFes: function(data, completado){
        __cnn.ajax({
            'url':'set/valida_recaudo/',
            'data':data,
            'completado':completado
        });
    }
};
