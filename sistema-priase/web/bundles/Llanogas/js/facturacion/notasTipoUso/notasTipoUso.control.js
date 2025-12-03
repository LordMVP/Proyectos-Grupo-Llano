/**
* @fileOverview Archivo de control de cartera castigada
* @author Appfuture
* @requires notasTipoUso.modelo.js
* @version 1.0.0
*/

/**
 * @namespace NotaControl
 */
var notaControl = {
    /**
     * Consulta las suscripciones según el filtro diligenciado por el usuario
     * @param  {Object} data       Los parámetros que se envían al servidor
     * @param  {Function} completado Función que se invoca cuando se terminan de
     * consultar las suscripciones
     * @returns {void}
     */
    consultarSuscripcion: function (data, completado) {
        __cnn.ajax({
            data: data,
            completado: completado,
            url: 'buscar/'
        });
    },
    /** Consulta municipios que coincidan con lo digitado para autocomplete
     * @param {int} data - nombre del municipio a consultar
     * @param {int} completado - Función callback notasVista.mostrarResultado
     * @returns {void}
     */
    consultarMunicipio: function (data, completado) {
        __cnn.ajax({
            data: data,
            completado: completado,
            url: 'municipios/'
        });
    },

    /**
     * Consulta las facturas por id de suscripción  
     * @param  {Object} data       Datos de la petición (idsuscrpcion)
     * @param  {Function} completado Invoca a onFiltrarFacturasCompleto
     * @returns {void}
     */
    consultarFacturas: function (data, completado) {
        __cnn.ajax({
            data: data,
            completado: completado,
            url: 'consultar_facturas/'
        });
    },

    /**@deprecated Candidato a borrar */
    consultarConcepto: function (data, completado) {
        __cnn.ajax({
            data: data,
            completado: completado,
            url: '../notas_automaticas/conceptos/'
        });
    },

    /**
     * Invoca el proceso de facturas para la suscripción seleccionada
     * @param  {Object} data       Los parámetros que se envían al servidor
     * @param  {Function} completado La función de callback que se dispara cuando el servidor indica que se ha iniciado el proceso
     * @returns {void}
     */
    procesarFacturas: function (data, completado) {
        __cnn.ajax({
            data: data,
            completado: completado,
            url: 'procesar/',
            modal: true
        });
    },


    /**
     * Consulta los errores del proceso
     * @param  {Function} completado Callback que se invoca con la respuesta del servidor
     * @returns {void}            
     */
    consultarErrores: function (completado) {
        __cnn.ajax({
            completado: completado,
            url: '../notas_automaticas/errores/'
        });
    },

    /**
     * Consulta los detalles de la facutura por id de factura
     * @param  {Object} data       Datos de la petición (idfactura)
     * @param  {Function} completado Función de callback onConsultarDetalleFacturaCompleto
     * @returns {void}
     */
    consultarDetallesFacturas: function (data, completado) {
        __cnn.ajax({
            data: data,
            completado: completado,
            url: 'factura/detalles/'
        });
    },

    /**
     * Consulta los motivos de las notas automáticas
     * @param  {Function} completado Invoca a onConsultarMotivosCompleto
     * @returns {void}
     */
    consultarMotivos: function (completado) {
        __cnn.ajax({
            completado: completado,
            url: '../notas_automaticas/motivos/'
        });
    },

    /**
     * Aplica las notas
     * @param  {Object} data       Objeto con estos datos (idmotivo, comentario, idfactura, idsuscripcion)
     * @param  {Function} completado Invoca a onAplicarNotasCompleto|
     * @returns {void}            
     */
    aplicarNotas: function (data, completado) {
        __cnn.ajax({
            data: data,
            completado: completado,
            url: 'aplicar/'
        });
    },

    /**
     * Elimina las tablas temporales antes de iniciar la aplicación
     * @returns {void} 
     */
    eliminarTablas: function () {
        __cnn.ajax({
            url: 'eliminartablas/',
            completado: function (data) {
                console.log(data);
            }
        });
    }
};