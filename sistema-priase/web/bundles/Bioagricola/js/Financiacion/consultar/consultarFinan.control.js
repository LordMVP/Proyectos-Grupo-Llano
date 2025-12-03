/**
 * @fileOverview Archivo de control para importar financiaciones
 * @author rsagudelo
 * @requires importar.modelo.js
 * @version 1.0.0
 */

/** @namespace */
var consultarControl = {

    /**
     * Consulta datos de la financiacion, segun el codigo o el id de la financiacion
     * @param {Function} success - Función que recibe la información enviada por el servidor
     * @param {Datos} data - Datos que se envian al controlador
     */
    consultarDatos: function (success,data) {
        __cnn.ajax({
            url: 'buscar/',
            data: data,
            completado: success
        });
    }
};
