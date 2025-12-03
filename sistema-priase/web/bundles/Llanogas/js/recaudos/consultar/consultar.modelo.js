/**
 * Formato para llenar la tabla de las suscripciones que afectó el recaudos
 * @type {Object}
 */
var formatoSuscripciones = {
    thead:[
        {'id':'thTipoLiquidacion', 'text':'Liquidación', 'sort':false, 'refer':'tipoSuscripcion', 'type':'text'},
        {'id':'thIdSuscripcion', 'text':'Cód. Suscripción', 'sort':false, 'refer':'idSuscripcion', 'type':'text'}, 
        {'id':'thCodAnterior', 'text':'Cód. Anterior', 'sort':false, 'refer':'codigoAnterior', 'type':'text'}
    ]
};

/**
 * Formato para llenar la tabla de facturas
 * @type {Object}
 */
var formatoFacturas = {
    thead:[
        {'id':'thIdFactura', 'text':'Cód. Factura', 'sort':false, 'refer':'idFactura', 'type':'text'}, 
        {'id':'thNumFactura', 'text':'Num. Factura', 'sort':false, 'refer':'numeroFactura', 'type':'text'}, 
        {'id':'thVencimiento', 'text':'Fecha Venc.', 'sort':false, 'refer':'fechaVencimiento', 'type':'text'}, 
        {'id':'thIdSuscripcion', 'text':'Cód. Suscripción', 'sort':false, 'refer':'idSuscripcion', 'type':'text'}, 
        {'id':'thTipoSuscripcion', 'text':'Suscripción', 'sort':false, 'refer':'tipoSuscripcion', 'type':'text'}, 
        {'id':'thCiclo', 'text':'Ciclo - Periodo', 'sort':false, 'refer':'cicloperiodo', 'type':'text'},
        {'id':'thValorPagado', 'text':'Valor Pagado', 'sort':false, 'refer':'totalPagadoRecaudo', 'type':'currency'}
]
};
/**
 * Formato para llenar la tabla de conceptos afectados por el recaudo
 * @type {Object}
 */
var formatoConceptos = {
    thead:[
        {'id':'thIdFactura', 'text':'Cód. Factura', 'sort':false, 'refer':'idFactura', 'type':'text'}, 
        {'id':'thCodConcepto', 'text':'Cód. Concepto', 'sort':false, 'refer':'idConcepto', 'type':'text'}, 
        {'id':'thDescripcion', 'text':'Descripción', 'sort':false, 'refer':'descripcion', 'type':'text'}, 
        {'id':'thValorCanceado', 'text':'Valor Pagado', 'sort':false, 'refer':'valorPagado', 'type':'currency'}
    ]
};
/**
 * @fileoverview Archivo modelo para guardar toda la información del recaudo consultado
 * @namespace consultarModel
 */
var consultarModel = {
    recaudo:null,
    suscriptor:null,
    suscripciones:null,
    informacionPago:null,
    facturas:null,
    conceptos:null,
    formasPago:null
};
