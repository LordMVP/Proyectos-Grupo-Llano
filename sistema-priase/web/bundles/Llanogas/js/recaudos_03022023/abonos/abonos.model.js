/**
 * Formato para llenar la tabla de suscripciones de un tercero
 * @type {Object}
 */

var formatoSuscripciones = {
    thead:[
        {'id':'thIdSuscripcion', 'text':'Id. Suscripción', 'refer':'idsuscripcion', 'type':'text'},
        {'id':'thCodAnterior', 'text':'Cod. Anterior', 'refer':'codanterior', 'type':'text'},
        {'id':'thTipoLiquidacion', 'text':'Liquidación', 'refer':'tiposuscripcion', 'type':'text'}
    ]
};
/**
 * Formato para llenar la tabla de facturas con saldo de las suscripciones
 * @type {Object}
 */
var formatoFacturas = {
    thead:[
        {'id':'thCheckFactura', 'text':'Seleccionar', 'refer':'idfactura', 'type':'check'},
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
 * Formato para llenar la tabla de conceptos de las facturas con saldo
 * @type {Object}
 */
var formatoConceptos = {
    thead:[
        {'id':'thIdFactura', 'text':'Cod. Factura', 'sort':false, 'refer':'idfactura', 'type':'text'},
        {'id':'thNumFactura', 'text':'Num. Factura', 'sort':false, 'refer':'numero', 'type':'text'},
        {'id':'thCodConcepto', 'text':'Cod. Concepto', 'sort':false, 'refer':'iddetallefactura', 'type':'text'},
        {'id':'thDescripcion', 'text':'Descripción', 'sort':false, 'refer':'concepto', 'type':'text'},
        {'id':'thValorTotal', 'text':'Valor Total', 'sort':false, 'refer':'valor', 'type':'currency'},
        {'id':'thValorCanceado', 'text':'Valor Pagado', 'sort':false, 'refer':'valorpagado', 'type':'currency'},
        {'id':'thSaldo', 'text':'Saldo', 'sort':false, 'refer':'saldo', 'type':'currency'}
    ]
};
/**
 * @fileoverview Archivo de modelo de los abonos donde se guarda toda la información del abono
 * @namespace abonosModel
 */
var abonosModel = {
    suscripciones:null,
    informacionPago:null,
    facturas:null,
    formasPago:[],
    resumenRecaudo:null
};
