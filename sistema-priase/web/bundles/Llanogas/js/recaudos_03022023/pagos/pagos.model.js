/**
 * @fileOverview Archivo de modelo para pagos de recaudo
 * @author AppFuture
 * @version 1.0.0
 */
/** @namespace */
var pagosModel = {
    facturas: [],
    formasPago: [],
    conceptos: [],
};
/**
 * Formato para llenar la tabla de suscripciones
 * @type {Object}
 */
var formatoSuscripciones = {
    thead:[
        {'id':'thTipoLiquidacion', 'text':'Tipo Suscripción', 'refer':'tiposuscripcion', 'type':'text'},
        {'id':'thIdSuscripcion', 'text':'Cod. Suscripción', 'refer':'idsuscripcion', 'type':'text'},
        {'id':'thCodAnterior', 'text':'Cod. Anterior', 'refer':'codanterior', 'type':'text'},
        {'id':'thConvenio', 'text':'Convenio', 'refer':'nombreconvenio', 'type':'text'}
    ]
};
/**
 * Formato para llenar la tabla de facturas
 * @type {Object}
 */
var formatoFacturas = {
    thead:[
        {'id':'thNumFactura', 'text':'Cod. Factura', 'sort':false, 'refer':'idfactura', 'type':'text'},
        {'id':'thVencimiento', 'text':'Fecha Venc.', 'sort':false, 'refer':'fechavencimiento', 'type':'text'},
        {'id':'thIdSuscripcion', 'text':'Cód. Suscripción', 'sort':false, 'refer':'idsuscripcion', 'type':'text'},
        {'id':'thTipoSuscripcion', 'text':'Suscripción', 'sort':false, 'refer':'tiposuscripcion', 'type':'text'},
        {'id':'thCiclo', 'text':'Ciclo - Periodo', 'sort':false, 'refer':'cicloperiodo', 'type':'text'},
        {'id':'thValorTotal', 'text':'Valor Total', 'sort':false, 'refer':'valortotal', 'type':'currency'},
        {'id':'thValorPagado', 'text':'Valor Pagado', 'sort':false, 'refer':'valorpagado', 'type':'currency'},
        {'id':'thSaldoFactura', 'text':'Saldo', 'sort':false, 'refer':'saldofactura', 'type':'currency'}
    ]
};
/**
 * Formato para llenar la tabla de conceptos
 * @type {Object}
 */
var formatoConceptos = {
    thead:[
        {'id':'thIdFactura', 'text':'Cod. Factura', 'sort':false, 'refer':'idfactura', 'type':'text'},
        {'id':'thNumFactura', 'text':'Núm. Factura', 'sort':false, 'refer':'numero', 'type':'text'},
        {'id':'thCodConcepto', 'text':'Cod. Concepto', 'sort':false, 'refer':'iddetallefactura', 'type':'text'},
        {'id':'thDescripcion', 'text':'Descripción', 'sort':false, 'refer':'concepto', 'type':'text'},
        {'id':'thValorTotal', 'text':'Valor Total', 'sort':false, 'refer':'valor', 'type':'currency'},
        {'id':'thValorCanceado', 'text':'Valor Pagado', 'sort':false, 'refer':'valorpagado', 'type':'currency'},
        {'id':'thSaldo', 'text':'Saldo', 'sort':false, 'refer':'saldo', 'type':'currency'}
    ]
};


