/**
 * Formato para llenar la tabla de suscripciones
 * @type {Object}
 */
var formatoSuscripciones = {
    thead:[
        {'id':'thTipoLiquidacion', 'text':'Liquidación', 'refer':'tiposuscripcion', 'type':'text'},
        {'id':'thIdSuscripcion', 'text':'Cod. Suscripción', 'refer':'idsuscripcion', 'type':'text'},
        {'id':'thCodAnterior', 'text':'Cod. Anterior', 'refer':'codanterior', 'type':'text'}
    ]
};

/**
 * Formato para llenar la tabla de facturas castigadas
 * @type {Object}
 */
var formatoFacturas = {
    thead:[
        {'id':'thIdFactura', 'text':'Cod. Factura', 'refer':'idfactura', 'type':'text'},
        {'id':'thNumFactura', 'text':'Num. Factura', 'refer':'numero', 'type':'text'},
        {'id':'thVencimiento', 'text':'Fecha Venc.', 'refer':'fechavencimiento', 'type':'text'},
        {'id':'thIdSuscripcion', 'text':'Cod. Suscripción', 'refer':'idsuscripcion', 'type':'text'},
        {'id':'thTipoSuscripcion', 'text':'Suscripción', 'refer':'tiposuscripcion', 'type':'text'},
        {'id':'thCiclo', 'text':'Ciclo - Periodo', 'refer':'cicloperiodo', 'type':'text'},
        {'id':'thValorTotal', 'text':'Valor Total', 'refer':'valortotal', 'type':'currency'},
        {'id':'thValorPagado', 'text':'Valor Pagado', 'refer':'valorpagado', 'type':'currency'},
        {'id':'thSaldoFactura', 'text':'Saldo', 'refer':'saldofactura', 'type':'currency'}
    ]
};

/**
 * Formato para llenar la tabla de conceptos por factura
 * @type {Object}
 */
var formatoConceptos = {
    thead:[
        {'id':'thIdFactura', 'text':'Cod. Factura', 'refer':'idfactura', 'type':'text'},
        {'id':'thNumFactura', 'text':'Núm. Factura', 'refer':'numero', 'type':'text'},
        {'id':'thCodConcepto', 'text':'Cod. Concepto', 'refer':'iddetallefactura', 'type':'text'},
        {'id':'thDescripcion', 'text':'Descripción', 'refer':'concepto', 'type':'text'},
        {'id':'thValorTotal', 'text':'Valor Total', 'refer':'valor', 'type':'currency'},
        {'id':'thValorCanceado', 'text':'Valor Pagado', 'refer':'valorpagado', 'type':'currency'},
        {'id':'thSaldo', 'text':'Saldo', 'refer':'saldo', 'type':'currency'}
    ]
};

/** @namespace */
var carteraModel = {
    suscriptor:null,
    suscripciones:null,
    informacionPago:null,
    facturas:null,
    formasPago:[],
    resumenRecaudo:null
};
