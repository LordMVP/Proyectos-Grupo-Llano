/**
* @fileOverview Archivo de control de facturación de financiación
* @author angelicaGomez
* @requires facturar.financiacion.modelo.js
* @version 1.0.0
*/

/** @namespace */
var facturarFinanciacionControl = {
    /**
     * Envía ciclo seleccionado para iniciar facturación de las financiaciones
     * @param {object} data - Parámetros que se envían al servidor (idciclo)
     * @param {function} success - Función callback cuando el servidor da respuesta
     * @returns {void}
     */
    facturarFinanciacion: function(data, success) {
        __cnn.ajax({
            url: './generar/',
            data: data,
            completado: success
        });
    },

    /**
     * Consulta el progreso del proceso de facturar financiaciones.
     * @param  {Object} data    Los datos que se envían al servidor para hacer la consulta
     * @param  {function} success Función de callback que se ejecuta cuando se termina de consultar el prgreso del proceso.
     * @returns {void}
     */
    consultarProgreso: function(data, success){
        __cnn.ajax({
            url: './progreso/',
            data: data,
            completado: success,
            background: true
        });
    },

    /**
     * Consulta el resultado final del proceso de facturar financiación.
     * @param  {Object} data    Los datos que se envían al servidor para hacer la consulta
     * @param  {function} success Función de callback que se ejecuta cuando se consulta el resultado al final de facturar las financiaciones.
     * @returns {void}
     */
    consultarResultado: function(data, success){
        __cnn.ajax({
            url: 'resultado/',
            data: data,
            completado: success
        });
    },

    /**
     * Aprueba la facturación en el servidor
     * @param  {Object} data    Información con el id del ciclo que se va a aprobar
     * @param  {function} success Callback que se ejecuta cuando se termina de aprobar la facturación.
     * @returns {void}
     */
    aprobarFacturacion: function(data, success){
        __cnn.ajax({
            data: data,
            url: 'aprobar/',
            completado: success
        });
    }
};
