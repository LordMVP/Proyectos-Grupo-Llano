
/**
 * Formato para llenar la tabla de facturas
 * @type {Object}
 */
var formatoFacturas = {
    thead:[
        {'id':'thIdFactura', 'text':'Cod. Factura', 'sort':false, 'refer':'idfactura', 'type':'text', 'valueField': 'idempresa'},
        {'id':'thNumFactura', 'text':'Num. Factura', 'sort':false, 'refer':'numero', 'type':'text'},
        {'id':'thVencimiento', 'text':'Fecha Venc.', 'sort':false, 'refer':'fechavencimiento', 'type':'text'},
        {'id':'thIdSuscripcion', 'text':'Cod. Suscripción', 'sort':false, 'refer':'idsuscripcion', 'type':'text'},
        {'id':'thTipoSuscripcion', 'text':'Suscripción', 'sort':false, 'refer':'tiposuscripcion', 'type':'text'},
        {'id':'thCiclo', 'text':'Ciclo - Periodo', 'sort':false, 'refer':'cicloperiodo', 'type':'text'},
        {'id':'thValorTotal', 'text':'Valor Total', 'sort':false, 'refer':'valortotal', 'type':'currency'},
        {'id':'thValorPagado', 'text':'Valor Pagado', 'sort':false, 'refer':'valorpagado', 'type':'currency'},
        {'id':'thSaldoFactura', 'text':'Saldo', 'sort':false, 'refer':'saldofactura', 'type':'currency'}
    ]
};
/** @namespace */
var recaudoRapidoModelo ={
    formasPago: []
};
