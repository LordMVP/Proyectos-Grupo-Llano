/**
 * @fileOverview Archivo de control de condonar cartera castigada
 * @author angelicaGomez
 * @requires condonarCastigada.modelo.js
 * @version 1.0.0
 */
var condonarControl = {
    /**
     * Consulta las suscripciones que coincidan con los parámetros de búsquedas.
     * @param  {object} data - Parámetros que se envían al servidor (idsuscripcion,idterceros)
     * @param  {function} success - Función invocada cuando cargan datos desde servidor 
     * (condonarVista.consultaSuscripcionCompleto)
     * @returns {void}
     */
    consultarSuscripciones: function (data, success) {
        __cnn.ajax({
            url: 'filtrar_suscripcion/',
            data: data,
            completado: success
        });
    },
    /** Consulta las facturas de una suscripción
     * @param  {object} data - Parámetros que se envían al servidor (idsuscripcion)
     * @param  {function} success - Función invocada cuando cargan datos desde servidor 
     * (condonarVista.consultarFacturas)
     * @returns {void}
     */
    consultarFacturas: function (data, success) {
        __cnn.ajax({
            url: 'verfacturas/',
            data: data,
            completado: success
        });
    },
    /** Consulta los conceptos condonables de una factura
     * @param  {object} data - Parámetros que se envían al servidor (idfactura)
     * @param  {function} success - Función invocada cuando cargan datos desde servidor 
     * (condonarVista.consultarConceptosCondonables)
     * @returns {void}
     */
    consultarConceptos: function (data) {
        return __cnn.ajax({
            url: 'concepto/factura',
            data: data,
            async:false
        });
    },
    /** Consulta los conceptos de una factura por id
     * @param  {object} id - Id del concepto a buscar
     * @returns {void}
     */
    consultarConceptosFacturaId: function (id) {
        id = parseInt(id);
        for (var j = 0; j < condonarModelo.conceptos.length; j++) {
            if (parseInt(condonarModelo.conceptos[j].idfactura) === id) {
                return {conceptos: condonarModelo.conceptos[j], indice: j};
            }
        }
        return false;
    },
    /** Consulta factura por id
     * @param  {object} id - Id de la factura a buscar
     * @returns {void}
     */
    consultarFacturaId: function (id) {
        for (var j = 0; j < condonarModelo.facturas.length; j++) {
            if (condonarModelo.facturas[j].idfactura == id) {
                return condonarModelo.facturas[j];
            }
        }
    },

    /** Graba la condonaci�n
     * @param  {object} data - Par�metros que se env�an al servidor (nombre)
     * @param  {function} success - Funci�n invocada cuando cargan datos desde servidor 
     * (condonarVista.mostrarResultado)
     * @returns {void}
     */
    consultaPermisoBotonesSeleccionFacturas: function (data, success) {
        __cnn.ajax({
            url: 'consultar_castigada_permisos_botones_condonacion',
            data: data,
            completado: success
        });
    },

     /**
     * Consulta las facturas de Interes corriente de  una suscripci�n castigada
     * @param  {object} data - Par�metros que se env�an al servidor (idsuscripcion)
     * @param  {function} success - Funci�n invocada cuando cargan datos desde servidor 
     * (condonarVista.consultaFacturasCompleto)
     * @returns {void}
     */
    consultarFacturasCastigadaIntCorriente: function (data, success) {
        __cnn.ajax({
            url: 'obtener_facturas_castigada_IntCorriente',
            data: data,
            completado: success
        });
    },


    /** Graba las facturas a condonar
     * @param  {object} data - Parámetros que se envían al servidor (factura)
     * @param  {function} success - Función invocada cuando cargan datos desde servidor 
     * (condonarVista.onGrabarCompleto)
     * @returns {void}
     */
    grabarCondonacion: function (data, success) {
        __cnn.ajax({
            url: 'procesar/',
            data: data,
            completado: success
        });
    }
};