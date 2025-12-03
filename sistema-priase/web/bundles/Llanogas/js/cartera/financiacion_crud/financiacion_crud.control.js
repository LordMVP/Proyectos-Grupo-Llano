/**
* @fileOverview Archivo de control de consultar financiación
* @author AppFuture
* @requires model.js
* @version 1.0.0
*/

/** @namespace */
var financiacionCrudControl = {
    /**
     * Consulta las suscripciones que coincidan con los parámetros de búsquedas.
     * @param  {object} data - Parámetros que se envían al servidor (idSuscripcion,codigoAnterior, idfinanciaciación y/o rango de fechas)
     * @param  {function} success - Función invocada cuando cargan datos desde servidor 
     * (financiacionCRUDVista.onFiltrarCompleto)
     * @returns {void}
     */
    filtrarSuscripcion:function(data, success){
        __cnn.ajax({
            data:data,
            url:'filtrar/',
            completado:success
        });
    },
    /**
     * Consulta las facturas de la suscripción seleccionada
     * @param  {object} data - Parámetros que se envían al servidor (idfinanciación)
     * @param  {function} success - Función invocada cuando cargan datos desde servidor 
     * (financiacionCRUDVista.onCargarFacturaCompleto)
     * @returns {void}
     */
    cargarFacturas:function(data, success){
        __cnn.ajax({
            data:data,
            url:'facturas/',
            completado:success
        });
    },
     /**
     * Consulta la factura con id específico
     * @param  {object} id - El id por el cuál se busca la factura
     * @returns {object} factura - Objeto con información de la factura
     */
    consultarFacturaPorId:function(id){
        id = parseInt(id);
        if (__app.esArreglo(financiacionCrudModel.facturas)) {
            for (var i = 0; i < financiacionCrudModel.facturas.length; i++) {
                var itemfactura = financiacionCrudModel.facturas[i];
                if (parseInt(itemfactura.idfactura) == id) {
                    return financiacionCrudModel.facturas[i];
                }
            }
        }
    },
    /**
     * Consulta las amortizaciones de una financiación
     * @param {object} data - Parámetros que se envían al servidor (idfinanciacion)
     * @param {function} success Función callback (financiacionCRUDVista.onCargarAmortizacionesCompleto)
     * @returns {void}
     */
    cargarAmortizaciones:function(data, success){
        __cnn.ajax({
            data:data,
            url:'amortizacion/',
            completado:success
        });
    },
    /**
     * Consulta el detalle de la amortización de una financiación
     * @param {object} data - Parámetros que se envían al servidor (idamortizacion)
     * @param {function} success Función callback (financiacionCRUDVista.onCargarDetallesFacturaCompleto)
     * @returns {void}
     */
    cargarDetalleAmortizaciones:function(data, success){
        __cnn.ajax({
            data:data,
            url:'amortizacion/detalle/',
            completado:success
        });
    },
    /**
     * Consulta valor financiable y valor no financiable de una factura
     * @param  {object} data - Parámetros que se envían al servidor (idfactura)
     * @param  {function} success - Función invocada cuando cargan datos desde servidor 
     * (financiacionCRUDVista.onCargarDetallesFacturaCompleto)
     * @returns {void}
     */
    cargarDetallesFactura:function(data, success){
        __cnn.ajax({
            data:data,
            url:'facturas/detalle_factura/',
            completado:success
        });
    },
    /**
     * Consulta los archivos adjuntos de una financiación
     * @param  {object} data - Parámetros que se envían al servidor (idfinanciacion)
     * @param  {function} success - Función invocada cuando cargan datos desde servidor 
     * (financiacionCRUDVista.onConsultarAdjuntosCompleto)
     * @returns {void}
     */
    consultarAdjuntos: function(data, success){
        __cnn.ajax({
            data:data,
            url:'amortizacion/adjuntos',
            completado:success
        });
    },
    consultarPermisosAdjuntar: function (Data,completado){
         __cnn.ajax({
            url: 'consultapermisosadjuntar/',
            data: Data,
            completado: completado
        });
    },
    /** Graba los archivos de una financiación
     * @param  {int} data - Lista de identificador de archivos subidos 
     * @param  {function} success - Función invocada cuando cargan datos desde servidor 
     * @returns {void}
     */
    grabarArchivos: function (data, success) {
        __cnn.ajax({
            url: '../generarfinanciacion/actualizar_adjuntos/',
            data: data,
            completado: success
        });
    }
    
};