/**
 * @fileOverview Archivo de control para el proceso que genera suspensiones encargado de controlas las peticiones al servidor
 * @author AppFuture
 * @requires proceso.suspension.modelo.js
 * @version 1.1.0
 * @namespace procesoSuspensionControl
 */
var localizacionControl = {

    /**
     * Consulta los motivos de las suspensiones de acuerdo al tipo de suscripción
     * @deprecated version 1.0.0
     * @param {Object} data - Información para consultar
     * @param {Function} completado - Función que recibe respuesta del servidor
     */
    consultarLocalizacionCuadrilla: function(data, completado) {
        __cnn.ajax({
            'url': 'seguimiento/cuadrilla',
            'data': data,
            'completado': completado
        });
    }
};