/**
 * @fileOverview Archivo de control para gestión de cartera
 * @author AppFuture
 * @requires model.js
 * @version 1.0.0
 */

/** @namespace */
var gestionarCarteraControl = {
    /**
     * Consulta los suscriptores que coincidan con los parámetros de búsquedas.
     * @param  {object} data - Parámetros que se envían al servidor (idsuscripcion,documento,codigoanterior)
     * @param  {function} completado - Función callback (gestionCarteraVista.filtrarSuscripcionCompleto)
     * @returns {void}
     */
    consultarSuscriptor: function (data, success) {
        return __cnn.ajax({
            'url': 'filtrar',
            data: data,
            completado: success
        });
    },
    /**
     * Consulta las facturas de una suscripción
     * @param  {object} data - Parámetros que se envían al servidor (idsuscripcion)
     * @param  {function} completado - Función callback (gestionCarteraVista.filtrarFacturasCompleto)
     * @returns {void}
     */
    consultarFacturas: function (data, success) {
        __cnn.ajax({
            url: 'facturas',
            data: data,
            completado: success
        });
    },
    
     /**
     * Consultar el detalle de una gestión
     * @param  {object} data - Parámetros que se envían al servidor (idgestion)
     * @param  {function} completado - Función callback (función anónima)
     * @returns {void}
     */
    consultarDetalleHistorial: function (data, success) {
        __cnn.ajax({
            url: 'historico_detalle',
            data: data,
            completado: success
        });
    },
    /**
     * Consulta la siguiente o anterior cartera de la base de datos
     * @param  {object} data - Parámetros que se envían al servidor (idGestionActual, opcion)
     * @param  {function} completado - Función callback (gestionCarteraVista.filtrarSuscripcionCompleto)
     * @returns {void}
     */
    consultarSiguienteAnterior: function (data, success) {
        __cnn.ajax({
            url: 'siguiente_anterior',
            data: data,
            completado: success
        });
    },
    /**
     * Consulta la primera o última cartera de la base de datos
     * @param  {object} data - Parámetros que se envían al servidor (opcion)
     * @param  {function} completado - Función callback (gestionCarteraVista.filtrarSuscripcionCompleto)
     * @returns {void}
     */
    consultarPrimeroUltimo: function (data, success) {
        __cnn.ajax({
            url: 'primero_ultimo',
            data: data,
            completado: success
        });
    },
    /**
     * Agrega la nueva gestión realizada a una cartera
     * @param  {object} data - Parámetros que se envían al servidor (parámetros de la cartera y los seguimientos hechos)
     * @param  {function} completado - Función callback (gestionCarteraVista.onGrabarGestionCompleto)
     * @returns {void}
     */
    grabarGestion: function (data, success) {
        __cnn.ajax({
            url: 'grabar',
            data: data,
            completado: success
        });
    },
    /**
     * Consulta el historial de seguimiento hechos a una cartera
     * @param  {object} data - Parámetros que se envían al servidor (idgestion)
     * @param  {function} completado - Función callback (gestionCarteraVista.onCargarHistorialCompleto)
     * @returns {void}
     */
    consultarHistorialSeguimientos: function (data, success) {
        __cnn.ajax({
            url: 'historico',
            data: data,
            completado: success
        });
    },
    /**
     * Consulta factura según un id específico
     * @param  {object} id - El id por el cuál se busca la factura
     * @returns {object} factura - Objeto con información de la factura 
     */
    getIdFacturaGestion: function (idFactura) {
        idFactura = parseInt(idFactura);
        var _self = this;
        for (i = 0; i < _self.facturas.length; i++) {
            if (_self.facturas[i].idfactura === idFactura) {
                return _self.facturas[i].idfacturagestion;
            }
        }
    }

};