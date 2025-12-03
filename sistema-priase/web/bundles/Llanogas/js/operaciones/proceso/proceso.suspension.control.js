/**
 * @fileOverview Archivo de control para el proceso que genera suspensiones encargado de controlas las peticiones al servidor
 * @author AppFuture
 * @requires proceso.suspension.modelo.js
 * @version 1.1.0
 * @namespace procesoSuspensionControl
 */
var procesoSuspensionControl = {

    /**
     * Consulta los motivos de las suspensiones de acuerdo al tipo de suscripción
     * @deprecated version 1.0.0
     * @param {Object} data - Información para consultar
     * @param {Function} completado - Función que recibe respuesta del servidor
     */
    consultarMotivosSuspension: function(data, completado) {
        __cnn.ajax({
            'url': 'consultar_motivos_suspension/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Ejecuta el proceso para generar las suspensiones
     * @param {Object} data - Información obligatoria para correcto funcionamiento (tipodeuso, desde, hasta, fechaini, fechafin)
     * @param {Function} completado - Función que verifica que se haya iniciado (ejecutoProceso)
     */
    aplicarSuspensiones: function(data, completado) {
        __cnn.ajax({
            'url': 'ejecutar_proceso/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta el progreso de la generación de suspensiones
     * @param completado
     */
    consultarProgreso: function(completado) {
        __cnn.ajax({
            'url': 'progreso/',
            'background': true,
            'completado': completado
        });
    },
    /**
     * Consulta el resumen del proceso
     * @param {Function} completado - Función que muestra la información al usuario
     * @param {Boolean} primerapeticion - Valida si es la primera vez que se consulta porque después no debe volver a mostrarse
     */
    consultarResultado: function(completado, primerapeticion) {
        __cnn.ajax({
            'url': 'resumen/',
            data: {primerapeticion:  primerapeticion}, 
            'completado': completado
        });
    },
    /**
     * Consulta lso tipos de uso de la empresa
     * @param {Function} completado - Función que obtiene el resultado del servidor
     * @deprecated
     */
    consultarTipoUso: function(completado) {
        __cnn.ajax({
            'url': 'consultar_tipo_uso/',
            'completado': completado
        });
    },
    
    consultarMunicipios: function(completado) {
        __cnn.ajax({
            'url': 'consultar_municipios/',
            'completado': completado
        });
    }
};