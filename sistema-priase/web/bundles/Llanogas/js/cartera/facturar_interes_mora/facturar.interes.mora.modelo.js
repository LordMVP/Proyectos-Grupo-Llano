/**
 * @fileOverview Archivo de modelo para facturar interés por mora
 * @author AppFuture
 * @version 1.0.0
 */
/** @namespace */
var facturarInteresMoraModel = {

    /**
     * Deja un valor por defecto de C, que indica que se debe consultar el progreso de la facturación.
     * @type {String}
     */
    proceso: 'C'

};

/**
 * Formato para llenar la tabla de financiación
 * @type {Object}
 */
var formatoFinanciaciones = {
    thead: [
        {'id': 'thDocumento', 'text': 'Documento', 'sort': false, 'refer': 'nombredocumento', 'type': 'text', 'valueField': 'iddocumento'},
        {'id': 'thTipoDocumento', 'text': 'Tipo Documento', 'sort': false, 'refer': 'nombretipdocumento', 'type': 'text', 'valueField': 'idtipdocumento'}
    ]
};

/**
 * Formato de la tabla de conceptos que no hacen base.
 * @type {Object}
 */
var formatoConceptosNoBase = {
    thead: [
        {'id': 'thConcepto', 'text': 'Concepto', 'sort': false, 'refer': 'concepto', 'type': 'text', 'valueField': 'concepto'}
    ]
};

/**
 * Formato de la tabla de progreso de la facturación
 * @type {Object}
 */
var formatoProgreso = {
    thead: [
        {'id': 'thIdProceso', 'text': 'Id proceso', 'sort': false, 'refer': 'idacceso', 'type': 'text'},
        {'id': 'thFecha', 'text': 'Fecha', 'sort': false, 'refer': 'fechainicio', 'type': 'text'},
        {'id': 'thNumRegistros', 'text': 'Registros afectados', 'sort': false, 'refer': 'cantidad', 'type': 'text'},
        {'id': 'thUsuario', 'text': 'Usuario', 'sort': false, 'refer': 'usuario', 'type': 'text'},
    ]
};

/**
 * Formato para la tabla de resumen
 * @type {Object}
 */
var formatoResumen = {
    thead: [
        {'id': 'thMunicipio', 'text': 'Municipio', 'sort': false, 'refer': 'municipio', 'type': 'text'},
        {'id': 'thNumRegistros', 'text': 'Cant. facturas', 'sort': false, 'refer': 'facgeneradas', 'type': 'text'}
    ]
};
/**
 * Formato para llenar el resultado de las facturas generadas
 * @type {Object}
 */
var formatoResultado = {
    thead: [
        {'id': 'thFacturaImpar', 'text': 'Id. Factura', 'sort': false, 'refer': 'idfac', 'type': 'text'},
        {'id': 'thFacturaPar', 'text': 'Id. Factura', 'sort': false, 'refer': 'idfactura', 'type': 'text'},
    ]
};