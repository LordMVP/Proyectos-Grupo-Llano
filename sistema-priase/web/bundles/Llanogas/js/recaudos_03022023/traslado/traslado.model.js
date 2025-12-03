/**
 * @fileOverview Archivo de modelo para tralado de  recaudo
 * @author AppFuture
 * @version 1.0.0
 */
/** @namespace */
var trasladoModel = {};
/**
 * Formato para llenar la tabla de suscripciones
 * @type {Object}
 */
 var formatoSuscripciones = {
    thead:[
        {'id':'thTipoLiquidacion', 'text':'Liquidación', 'refer':'tiposuscripcion', 'valueField':'idtiposuscripcion', 'type':'text'},
        {'id':'thIdSuscripcion', 'text':'Cod. Suscripción', 'refer':'idsuscripcion', 'type':'text'},
        {'id':'thCodAnterior', 'text':'Cod. Anterior', 'refer':'codigoanterior', 'type':'text'}
    ]
};

/**
 * Formato para llenar la tabla de facturas
 * @type {Object}
 */
var formatoFacturas = {
    thead:[
        {'id':'thIdFactura', 'text':'Cod. Factura', 'refer':'idfactura', 'type':'text'},
        {'id':'thNumFactura', 'text':'Num. Factura', 'refer':'numerofactura', 'type':'text'},
        {'id':'thVencimiento', 'text':'Fecha Venc.', 'refer':'fechavencimiento', 'type':'text'},
        {'id':'thIdSuscripcion', 'text':'Cod. Suscripción', 'refer':'idsuscripcion', 'type':'text'},
        {'id':'thTipoSuscripcion', 'text':'Suscripción', 'refer':'tiposuscripcion', 'type':'text'},
        {'id':'thCiclo', 'text':'Ciclo - Periodo', 'refer':'cicloperiodo', 'type':'text'},
        {'id':'thValorPagado', 'text':'Valor Pagado', 'refer':'totalpagadorecaudo', 'type':'currency'}
    ]
};
/**
 * Formato para llenar la tabla de suscripciones a las que se trasladará el recaudo
 * @type {Object}
 */
formatoSuscripcionesTrasnferir = {
	thead:[
		{'id':'thSeleccion', 'text':'Seleccionar', 'sort':false,
            'refer':'idsuscripcion', 'type':'check','style':{'width':'15%'}
        },
        {'id':'thTipoLiquidacion', 'text':'Liquidación', 'refer':'tiposuscripcion', 'type':'text'},
        {'id':'thIdSuscripcion', 'text':'Cod. Suscripción', 'refer':'idsuscripcion', 'type':'text'},
        {'id':'thCodAnterior', 'text':'Cod. Anterior', 'refer':'codanterior', 'type':'text'},
        {'id':'thTransferencia', 'text':'Vlr. Transferir', 'type':'input', style:{width:'20%'}}
    ]
};

