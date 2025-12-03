/**
 * @fileOverview Archivo de control para ejecutar procesos contables de facturación
 * @author angelicaGómez
 * @requires ejecutarProceso.modelo.js
 * @version 1.0.0
 */

/** @namespace */
var ejecutarControl = {
    /**
     * Ejecuta el proceso de facturación ya sea para una o varias suscripciones
     * @param  {object} data - Parámetros que se envían al servidor
     * @param  {function} success - Función invocada (ejecutarVista.onEjectutarCompleto)
     * @returns {void}
     */
    ejecutarProceso: function (data, completado) {
        __cnn.ajax({
            'url': '../procesar/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta la suscripción que concorde con la información de filtro
     * @param  {object} data - Parámetros que se envían al servidor (idsuscripcion, codigoanterior, cedula)
     * @param  {function} success - Función invocada (ejecutarVista.consultaSuscripcionCompleto)
     * @returns {void}
     */
    consultarSuscripcion: function (data, completado) {
        __cnn.ajax({
            'url': '../suscripciones/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta el progreso del proceso si es que se ejecuto con anterioridad
     * @param  {function} success - Función invocada (ejecutarVista.consultarEjecucion)
     * @returns {void}
     */
    consultarEjecucion: function (completado) {
        __cnn.ajax({
            'url': 'progreso',
            background: true,
            'completado': completado
        });
    },
    /**
     * Hace la liquidación de la(s) suscripción (es)
     * @param  {object} data - Parámetros que se envían al servidor (idsuscripcion, idciclo, idliquidacion)
     * @param  {function} success - Función invocada (ejecutarVista.onLiquidarCompleto)
     * @returns {void}
     */
    liquidarSuscripcion: function (data, completado) {
        __cnn.ajax({
            'url': '../suscripciones/liquidar/',
            'data': data,
            'completado': completado
        });
    },

    /**
     * Invoca la aprobación de la liquidación
     * @param  {Function} completado Callback que se invoca con al respuesta del servidor (ejecutarVista.onAprobarCompleto)
     * @param  {Object} data       Envía (idciclo y idsuscripcion)  
     * @returns {void}
     */
    aprobarLiquidacion: function (completado, data) {
        __cnn.ajax({
            'url': 'aprobar/',
            'data': data,
            'completado': completado
        });
    },

    /**
     * Invoca la eliminación de una liquidación
     * @param  {Function} completado invoca a (onAprobarCompleto)
     * @param  {Object} data       Parámetros que se envían (idciclo, idsuscripcion)
     * @returns {void}            
     */
    eliminarLiquidacion: function (completado, data) {
        __cnn.ajax({
            'url': 'eliminar_liquidacion/',
            'data': data,
            'completado': completado
        });
    },

    /**
     * Consulta los errores del proceso
     * @param  {Function} completado invoca a (onConsultarErroresCompleto)  
     * @param  {Object} data       Parámetros (idciclo)
     * @returns {void}
     */
    consultarErroresProceso: function (completado, data) {
        __cnn.ajax({
            'url': 'resultado/',
            'data': data,
            completado: completado
        });
    },
    liquidarVariasSuscripcion: function (data, completado) {
        __cnn.ajax({
            'url': '../suscripciones/liquidarvariassuscripciones/',
            'data': data,
            'completado': completado
        });
    },
};