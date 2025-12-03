/**
 * @fileOverview Archivo de control de condonar conceptos de factura
 * @author angelicaGomez
 * @requires condonarCartera.modelo.js
 * @version 1.0.0
 */
var condonarControl = {
    /**
     * Consulta las suscripciones que coincidan con los parámetros de búsquedas.
     * @param  {object} data - Parámetros que se envían al servidor (idsuscripcion,codigoanterior)
     * @param  {function} success - Función invocada cuando cargan datos desde servidor 
     * (condonarVista.consultaSuscripcionCompleto)
     * @returns {void}
     */
    consultarSuscripciones: function (data, success) {
        __cnn.ajax({
            url: 'obtener_suscripcion',
            data: data,
            completado: success
        });
    },
    /** Consulta los municipios por el nombre
     * @param  {object} data - Parámetros que se envían al servidor (nombre)
     * @param  {function} success - Función invocada cuando cargan datos desde servidor 
     * (condonarVista.mostrarResultado)
     * @returns {void}
     */
    consultarMunicipio: function (data, success) {
        __cnn.ajax({
            url: 'obtener_municipios',
            data: data,
            completado: success
        });
    },
    /**
     * Consulta las facturas de una suscripción
     * @param  {object} data - Parámetros que se envían al servidor (idsuscripcion)
     * @param  {function} success - Función invocada cuando cargan datos desde servidor 
     * (condonarVista.consultaFacturasCompleto)
     * @returns {void}
     */
    consultarFacturas: function (data, success) {
        __cnn.ajax({
            url: 'obtener_facturas',
            data: data,
            completado: success
        });
    },
    /** Consulta los conceptos condonables de una factura
     * @returns {void}
     */
    consultarCondonableFacturaId: function (id) {
        var array = [];
        for (var j = 0; j < condonarModelo.condonables.length; j++) {
            if (condonarModelo.condonables[j].idfactura == id) {
                array.push(condonarModelo.condonables[j]);
            }
        }
        return array;
    },
    /** Consulta los conceptos no condonables de una factura
     * @returns {void}
     */
    consultarNoCondonableFacturaId: function (id) {
        var array = [];
        for (var j = 0; j < condonarModelo.nocondonables.length; j++) {
            if (condonarModelo.nocondonables[j].idfactura == id) {
                array.push(condonarModelo.nocondonables[j]);
            }
        }
        return array;
    },
    /** Retorna información de una factura por id
     * @returns {void}
     */
    consultarFacturaId: function (id) {
        for (var j = 0; j < condonarModelo.facturas.length; j++) {
            if (condonarModelo.facturas[j].idfactura == id) {
                return condonarModelo.facturas[j];
            }
        }
    },
    /** Consulta los conceptos seleccionados de una factura
     * @returns {void}
     */
    consultarConceptoSelect: function (id) {
        var conc = [];
        for (var j = 0; j < condonarModelo.conceptoseleccionado.length; j++) {
            if (condonarModelo.conceptoseleccionado[j].idfactura == id) {
                conc.push({conceptos: condonarModelo.conceptoseleccionado[j], indice: j});
            }
        }
        return conc;
    },

    /** Graba la condonaci�n
     * @param  {object} data - Par�metros que se env�an al servidor (nombre)
     * @param  {function} success - Funci�n invocada cuando cargan datos desde servidor 
     * (condonarVista.mostrarResultado)
     * @returns {void}
     */
    consultaPermisoBotonesSeleccionFacturas: function (data, success) {
        __cnn.ajax({
            url: 'consultar_permisos_botones_condonacion',
            data: data,
            completado: success
        });
    },

     /**
     * Consulta las facturas de Interes corriente de  una suscripci�n
     * @param  {object} data - Par�metros que se env�an al servidor (idsuscripcion)
     * @param  {function} success - Funci�n invocada cuando cargan datos desde servidor 
     * (condonarVista.consultaFacturasCompleto)
     * @returns {void}
     */
    consultarFacturasIntCorriente: function (data, success) {
        __cnn.ajax({
            url: 'obtener_facturas_IntCorriente',
            data: data,
            completado: success
        });
    },

    /** Graba la condonación
     * @param  {object} data - Parámetros que se envían al servidor (nombre)
     * @param  {function} success - Función invocada cuando cargan datos desde servidor 
     * (condonarVista.mostrarResultado)
     * @returns {void}
     */
    grabarCondonar: function (data, success) {
        __cnn.ajax({
            url: 'generar_condonacion',
            data: data,
            completado: success
        });
    }
};