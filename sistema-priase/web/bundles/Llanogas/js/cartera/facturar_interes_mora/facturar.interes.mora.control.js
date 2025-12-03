//el objeto facturarInteresMoraControl se encarga de las peticiones AJAX de la aplicación de facturar intereses por mora.
var facturarInteresMoraControl = {
    /**
     * Consulta las suscripciones que coincidan con los parámetros de búsquedas.
     * @param  {object} data - Parámetros que se envían al servidor (idsuscripcion,codigoanterior)
     * @param  {function} success - Función invocada cuando cargan datos desde servidor 
     * (condonarVista.consultaSuscripcionCompleto)
     * @returns {void}
     */
    consultarSuscripciones: function (data, success) {
        __cnn.ajax({
            url: 'suscripcion/',
            data: data,
            completado: success
        });
    },
    /** Consulta los municipios por el nombre
     * @param  {object} data - Parámetros que se envían al servidor (nombre)
     * @param  {function} success - Función invocada cuando cargan datos desde servidor 
     * (condonarVista.mostrarResultado)
     * @returns {void}
     */
    consultarMunicipio: function (data, success) {
        __cnn.ajax({
            url: 'municipios/',
            data: data,
            completado: success
        });
    },
    /** Consulta los documentos y tipos de documentos
     * @param  {object} data - Parámetros que se envían al servidor (datos)
     * @param  {function} success - Función invocada cuando cargan datos desde servidor 
     * (condonarVista.mostrarResultado)
     * @returns {void}
     */
    consultarDocumentos: function (data, success) {
        __cnn.ajax({
            url: 'documentos/',
            data: data,
            completado: success
        });
    },
    /**
     * Iniciar proceso de facturar el interés por mora
     * @param {type} success
     * @returns {undefined}
     */
    facturarInteres: function (data, success) {
        __cnn.ajax({
            data:data,
            url: 'generar/',
            completado: success
        });
    },

    /**
     * Envía la solicitud para facturar intereses por mora 
     * @param  {Object} data    Los datos de la petición al servidor
     * @param  {function} success Función de callback que se ejecuta con la respuesta del servidor
     * @returns {void}
     */
    facturarInteresMora: function (data, success) {
        __cnn.ajax({
            url: 'cartera/interes_mora/facturar',
            data: data,
            completado: success
        });
    },
    
    /**
     * Consulta el prgroso de la facturación de intereses por mora
     * @param  {function} success Callback que se ejecuta con la respuesta del servidor
     * @returns {void}
     */
    consultarProgreso: function(success){
        __cnn.ajax({
            url: 'progreso/',
            background: true,
            completado: success
        });
    },

    /**
     * Solicita al servidor la aprobación de las facturas
     * @param  {function} success Función de callback que se ejecuta cuando se aprueban las facturas
     * @returns {void}
     */
    aprobarFacturas: function(success){
        __cnn.ajax({
            url: 'aprobar/',
            completado: success
        });
    },

    /**
     * Consulta el resumen de las facturas aprobadas.
     * @param  {Function} success Función de callback que se ejecuta para mostrar el resumen del proceso    
     * @returns {void}
     */
    resumenFacturas: function(success){
        __cnn.ajax({
            url: 'resumen/',
            completado: success
        });
    }
};
