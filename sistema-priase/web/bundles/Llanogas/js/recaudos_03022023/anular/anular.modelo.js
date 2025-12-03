/**
 * Formato para llenar la tabla de las suscripciones que fueron afectadas por el recaudos actual
 * @type {Object}
 */
var formatoSuscripciones = {
    thead:[
        {'id':'thTipoLiquidacion', 'text':'Liquidación', 'sort':false, 'refer':'tiposuscripcion', 'type':'text'},
        {'id':'thIdSuscripcion', 'text':'Cod. Suscripción', 'sort':false, 'refer':'idsuscripcion', 'type':'text'}, 
        {'id':'thCodAnterior', 'text':'Cod. Anterior', 'sort':false, 'refer':'codigoanterior', 'type':'text'}
    ]
};
/**
 * Formato para llenar la tabla de las facturas con el respectivo valor pagado por el recaudo
 * @type {Object}
 */
var formatoFacturas = {
    thead:[
        {'id':'thIdFactura', 'text':'Cod. Factura', 'sort':false, 'refer':'idfactura', 'type':'text'}, 
        {'id':'thNumFactura', 'text':'Num. Factura', 'sort':false, 'refer':'numerofactura', 'type':'text'}, 
        {'id':'thVencimiento', 'text':'Fecha Venc.', 'sort':false, 'refer':'fechavencimiento', 'type':'text'}, 
        {'id':'thIdSuscripcion', 'text':'Cod. Suscripción', 'sort':false, 'refer':'idsuscripcion', 'type':'text'}, 
        {'id':'thTipoSuscripcion', 'text':'Suscripción', 'sort':false, 'refer':'tiposuscripcion', 'valueField':'idtiposuscripcion', 'type':'text'}, 
        {'id':'thCiclo', 'text':'Ciclo - Periodo', 'sort':false, 'refer':'cicloperiodo', 'type':'text'},
        {'id':'thValorPagado', 'text':'Valor Pagado', 'sort':false, 'refer':'totalpagadorecaudo', 'type':'currency'},
    ]
};
/**
 * @fileoverview Archivo de modelo de anulación de recaudos, donde almacena información del recaudo
 * @namespace anularModel
 */
var anularModel = {
    recaudo:null,
    suscriptor:null,
    suscripciones:null,
    informacionPago:null,
    facturas:null,
    formasPago:null
};