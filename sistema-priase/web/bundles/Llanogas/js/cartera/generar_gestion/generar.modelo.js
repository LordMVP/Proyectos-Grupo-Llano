/**
 * @fileOverview Archivo de modelo para generar carteras
 * @author AppFuture
 * @version 1.0.0
 */
/** @namespace */
var generarModel = {
    suscripciones:[]
};
/**
 * Columnas para generar tabla de suscripciones para generar cartera
 * @type {Object}
 */
var formatoSuscripciones = [
        { "title": "Seleccionar", data: 'idsuscripcion',  'orderable': false},
        {title: 'Tipo Suscripción', data: 'tiposuscripcion'},
        {title: 'Tipo Uso', data: 'tipousosuscripcion'},
        {title: 'Liquidación', data: 'liquidacion'},
        {title: 'Cód. Suscripción', data: 'idsuscripcion'},
        {title: 'Nombre Suscriptor', data: 'suscriptor'},
        {title: "Ver facturas", data: "idsuscripcion", 'orderable': false},
        
    ];
/**
 * Formato para llenar la tabla de facturas de una suscripción
 * @type {Object}
 */
var formatoFacturas = {
    thead:[
        {'id':'thIdFactura', 'text':'Cód. Factura', 'sort':false, 'refer':'idfactura', 'type':'text'}, 
        {'id':'thNumFactura', 'text':'Núm. Factura', 'sort':false, 'refer':'numerofactura', 'type':'text'}, 
        {'id':'thVencimiento', 'text':'Fecha Venc.', 'sort':false, 'refer':'fechavencimiento', 'type':'text'}, 
        {'id':'thCiclo', 'text':'Ciclo - Periodo', 'sort':false, 'refer':'cicloperiodo', 'type':'text'},
        {'id':'thValorTotal', 'text':'Valor Total', 'sort':false, 'refer':'totalfactura', 'type':'currency'},
        {'id':'thValorPagado', 'text':'Valor Pagado', 'sort':false, 'refer':'pagadofactura', 'type':'currency'},
        {'id':'thSaldoFactura', 'text':'Saldo', 'sort':false, 'refer':'saldofactura', 'type':'currency'}
    ]
};

