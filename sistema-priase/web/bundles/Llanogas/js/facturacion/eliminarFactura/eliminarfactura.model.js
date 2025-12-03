/**
 * Formato para llenar la tabla de suscripciones de un tercero
 * @type {Object}
 */

var formatoSuscripciones = {
    thead:[
        {'id':'thIdSuscripcion', 'text':'Id. Suscripción', 'refer':'idsuscripcion', 'type':'text'},
        {'id':'thCodAnterior', 'text':'Cod. Anterior', 'refer':'codanterior', 'type':'text'},
        {'id':'thTipoLiquidacion', 'text':'Liquidación', 'refer':'tiposuscripcion', 'type':'text'},
        {'id':'thNumeroMedidor', 'text':'Medidor', 'refer':'numeromedidor', 'type':'text'}
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
 * @fileoverview Archivo de modelo de los eliminarfactura donde se guarda toda la información del abono
 * @namespace eliminarfacturaModel
 */
var eliminarfacturaModel = {
    suscripciones:null,
    facturas:null
};
