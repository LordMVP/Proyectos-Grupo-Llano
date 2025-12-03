

var procesarFinanciacionEmergenciaControl = {
    /**
     * Consulta las suscripciones que coincidan con los parámetros de búsquedas.
     * @param  {object} data - Parámetros que se envían al servidor (idsuscripcion,codigoanterior)
     * @param  {function} success - Función invocada cuando cargan datos desde servidor 
     * (condonarVista.consultaSuscripcionCompleto)
     * @returns {void}
     */
    consultarSuscripciones: function (data, success) {
        __cnn.ajax({
            url: './../facturar_intereses_mora/suscripcion/',
            data: data,
            completado: success
        });
    }
    ,
    /** Consulta los municipios por el nombre
     * @param  {object} data - Parámetros que se envían al servidor (nombre)
     * @param  {function} success - Función invocada cuando cargan datos desde servidor 
     * (condonarVista.mostrarResultado)
     * @returns {void}
     */
    consultarMunicipio: function (data, success) {
        __cnn.ajax({
            url: 'municipio/',
            data: data,
            completado: success
        });
    },
    
    generaFinanciaEmergencia: function (data, success) {
        __cnn.ajax({
            url: 'generar/',
            data: data,
            completado: success
        });
    },
    
    consultaProceso: function ( success) {
        __cnn.ajax({
            url: 'proceso/',
            completado: success
        });
    },
    consultarResumen: function (success) {
        __cnn.ajax({
            url: 'consultar_resumen/',
            completado: success
        });
    }
};
