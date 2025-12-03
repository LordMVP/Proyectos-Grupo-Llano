/**
 * @fileOverview Archivo de modelo para gestionar cartera
 * @author AppFuture
 * @version 1.0.0
 */
/** @namespace */
var gestionarCarteraModel = {
    historial:[],
    seguimientos:[], 
    archivosActual: []
};

/**
 * Formato para llenar la tabla de facturas
 * @type {Object}
 */
var formatoFacturas = {
    thead:[
        {'id':'thIdFactura', 'text':'Cód. Factura', 'sort':false, 'refer':'idfactura', 'type':'text'}, 
        {'id':'thNumFactura', 'text':'Núm. Factura', 'sort':false, 'refer':'numero', 'type':'text'}, 
        {'id':'thVencimiento', 'text':'Fecha Venc.', 'sort':false, 'refer':'fechavencimiento', 'type':'text'}, 
        {'id':'thCiclo', 'text':'Ciclo', 'sort':false, 'refer':'cicloperiodo', 'type':'text'},
        {'id':'thValorTotal', 'text':'Valor Total', 'sort':false, 'refer':'valortotal', 'type':'currency'},
        {'id':'thValorPagado', 'text':'Valor Pagado', 'sort':false, 'refer':'valorpagado', 'type':'currency'},
        {'id':'thSaldoFactura', 'text':'Saldo', 'sort':false, 'refer':'saldofactura', 'type':'currency'},
        {'id':'thSeguimiento', 'text':'Seguimiento', 'sort':false, 'refer':'idfactura','valueField': 'estadogestion', 'type':'button', 'style': {'width': '10%'} }
    ]
};
/**
 * Formato para llenar la tabla de seguimientos de una cartera
 * @type {Object}
 */
var formatoHistorial = {
    thead:[
        {'id':'thIdDetalleGestion', 'text':'Id Detalle', 'sort':false, 'refer':'iddetallegestion', 'type':'text'}, 
        {'id':'IdFactura', 'text':'Id Factura', 'sort':false, 'refer':'idfactura', 'type':'text'},
        {'id':'thCiclo', 'text':'Ciclo', 'sort':false, 'refer':'ciclo', 'type':'text'}, 
        {'id':'thMedioComunicacion', 'text':'Medio Comunicación', 'sort':false, 'refer':'mediocomunicacion', 'type':'text'},
        {'id':'thPeriodo', 'text':'Periodo', 'sort':false, 'refer':'periodo', 'type':'text'},
        {'id':'thFechaGestion', 'text':'Fecha Gestión', 'sort':false, 'refer':'fechagestion', 'type':'text'}, 
        {'id':'thDetalle', 'text':'Ver Detalle', 'sort':false, 'refer':'iddetallegestion', 'type':'button', 'style': {'width': '10%'} }
    ]
};

