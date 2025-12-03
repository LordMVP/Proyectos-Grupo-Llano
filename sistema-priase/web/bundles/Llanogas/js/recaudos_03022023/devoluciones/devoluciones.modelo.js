/** @namespace */
var devolucionesModelo = {

	suscripcion:null,
	devoluciones:null,
};

/**
 * Formato para llenar la tabla de las facturas y/o recaudos que se desean devolver
 * @type {Object}
 */
var formatoDevoluciones = {
    thead:[
        {'id':'thSeleccion', 'text':'Seleccionar', 'refer':'idfacturarecaudo', 'type':'check'}, 
        {'id':'thiddistribucion', 'text':'Codigo Distribucion', 'refer':'iddistribucion', 'type':'text'}, 
        {'id':'thfecha', 'text':'Fecha', 'refer':'fecha', 'type':'text'}, 
        {'id':'thDocumento', 'text':'Documento', 'refer':'documento','valueField':'iddocumento', 'type':'text'}, 
        {'id':'thTipoDocumento', 'text':'Tipo Documento', 'refer':'tipodocumento', 'type':'text'}, 
        {'id':'thValor', 'text':'Valor', 'refer':'valor', 'type':'currency'},
        {'id':'thValorNuevo', 'text':'Valor a Devolver', 'sort':false, 'refer':'valor', 'type':'input', 'style':{'width':'5%'}}, 
        {'id':'thVer', 'text': 'Ver Detalle', 'sort': false,'refer':'idfacturarecaudo', 'valueField':'proceso', 'type': 'button', 'style': {'width': '10%'}},
    ]
};
/**
 * Formato para llenar la tabla del detalle de la factura y sus valores
 * @type {Object}
 */
var formatoDetalleFactura = {
    thead:[
        {'id':'thNumero', 'text':'Numero', 'refer':'numero', 'type':'text'}, 
        {'id':'thfecha', 'text':'Fecha', 'refer':'fecha', 'type':'text'}, 
        {'id':'thSaldo', 'text':'Saldo', 'refer':'saldo', 'type':'currency'},
        {'id':'thValor', 'text':'Valor', 'refer':'valortotal', 'type':'currency'}
    ]
};

/**
 * Formato para llenar la tabla del detalle del recaudo y sus valores
 * @type {Object}
 */
var formatoDetalleRecaudo = {
    thead:[
    	{'id':'thIdRecaudo', 'text':'Id Recaudo', 'refer':'idrecaudo', 'type':'text'}, 
        {'id':'thfecha', 'text':'Fecha', 'refer':'fechapago', 'type':'text'}, 
        {'id':'thValorPagado', 'text':'Valor Pagado', 'refer':'pago', 'type':'currency'},
        {'id':'thValor', 'text':'Valor Total', 'refer':'valortotal', 'type':'currency'},
    ]
};