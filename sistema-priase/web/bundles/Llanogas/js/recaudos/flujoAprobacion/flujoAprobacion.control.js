/**
 * @fileOverview Archivo de control de flujo de aprobación de consignaciones
 * @author AppFuture
 * @requires flujoAprobacion.modelo.js
 * @namespace flujoControl
 */
var flujoControl = {
    /**
     * Busca una consignación según los parámetros de búsqueda
     * @param {Object} data - Parámetros para filtrar consignaciones (fechainicio, fechafin, idconsignacion, idmediopago)
     * @param {Function} completado - Función que recibe la información de la consignación
     */
    buscarConsignacion: function (data, completado) {
        __cnn.ajax({
            'url': '../buscar/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta toda la información especifica de la consigación
     * @param {Object} data - Información enviada (idconsignacion)
     * @param {Function} completado  Función que recibe la información (onConsultarDetalleConsignacionCompleto)
     */
    consultarDetalleConsignacion: function (data, completado) {
        __cnn.ajax({
            'url': '../informacionconsolidado/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta la información de los tercero que pueden ser responsables
     * @param {Object} data - Información enviada al servidor (idmediopago)
     * @param {Function} completado - Función que recibe la información (consultarTerceroCompleto)
     */
    consultarTercero: function (data, completado) {
        __cnn.ajax({
            'url': 'terceros/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consultar los tipos de documento
     * @deprecated Se hace la petición desde la vistacargarBancosGlobal
     * @param {Object} data - Parámetros de búsqueda
     * @param {Function} completado - Función que recibe los tipos de documento
     */
    consultarTiposDocumento: function (data, completado) {
        __cnn.ajax({
            'url': 'tipo_documento/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Envía la petición al servidor para guardar la aprobación de la consignación
     * @param {Object} data - Información de la aprobación (accion 'A', idconsignacion,idterceroresponsable,idtipodocumento, descripcionseven)
     * @param completado - Función que verifica que el proceso se haya realizado correctamente
     */
    aprobacionConsignacion: function (data, completado) {
        __cnn.ajax({
            'url': 'aprobar/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Guarda los bancos en una variable local del arreglo de bancos
     * @returns {Array}
     */
    cargarBancosGlobal: function () {
        var resultado = __cnn.ajax({
            'url': '../../consultar_bancos/',
            'async': false,
            'background': true
        });
        return resultado;
    },
    /**
     * Consulta la informción de un banco según su id
     * @param {number} id - Id del banco que se desea buscar
     * @returns {Object}
     */
    consultarBancoPorId: function (id) {
        id = parseInt(id);
        for (var indice = 0; indice < bancos.bancos.length; indice++) {
            var banco = bancos.bancos[indice];
            if (parseInt(banco.idtercero) === id) {
                return banco;
            }
        }
    }
};