/**
 * @fileOverview Archivo de control para exportar notas automáticas
 * @author angelicaGomez
 * @requires exportarContabilizacion.control.js
 * @requires exportarContabilizacion.modelo.js
 * @version 1.0.0
 */
var exportarControl = {
    /** Consulta movimientos contables que se pueden exportar
     * @param {object} data - Información para consultar suscripción (idmovimiento)
     * @param {int} completado - Función callback exportarVista.onConsultarMovimientosExportarCompleto
     * @returns {void}
     */
    consultarMovimientoExportar: function (data, completado) {
        __cnn.ajax({
            data: data,
            completado: completado,
            url: 'movimientos/'
        });
    },
    /** Aprueba la contabilización que se a seleccionado
     * @param {object} data - Información que se envía al servidor (idmovimiento, idciclo)
     * @param {int} completado - Función callback exportarVista.onAprobarMovimiento
     * @returns {void}
     */
    aprobarMovimiento: function (data, completado) {
        __cnn.ajax({
            data: data,
            completado: completado,
            url: 'aprobar/',
            background: true
        });
    },
    /** Elimina los detalles de la contabilización que se a seleccionado
     * @param {object} data - Información que se envía al servidor (idmovimiento, idciclo)
     * @param {int} completado - Función callback exportarVista.onAprobarMovimiento
     * @returns {void}
     */
    eliminarMovimientos: function (data, completado) {
        __cnn.ajax({
            data: data,
            completado: completado,
            url: 'eliminar/',
            background: true
        });
    },
    consultarMovimientosCiclo: function (data, completado) {
        __cnn.ajax({
            url: 'movimientos/listado/',
            data: data,
            completado: completado
        });
    },
    /** Consulta los detalles de un movimiento por una rchivo excel
     * @param {object} data - Información para consultar errores (idmovimientodetalle)
     * @returns {void}
     */
    consultarDetallesMovimiento: function (data, completado) {
        __cnn.ajax({
            data: data,
            completado: completado,
            url: 'detalle/movimiento/'
        });
    },
    /** regenera movimiento contable
     * @returns {void}
     */
    reGenerarMovimientoContable: function (data, completado) {
        console.log(data);
        __cnn.ajax({
            url: 'regenerar/movimiento_contable/',
            data: data,
            completado: completado
        });
    },
};