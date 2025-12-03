/**
 * @fileOverview Archivo de modelo para facturar financiación
 * @author AppFuture
 * @version 1.0.0
 */
/** @namespace */
var facturarFinanciacionModel = { };

/**
 * Formato de la tabla de progreso de la aplicación.
 * @type {Object}
 */
formatoProgreso = {
	thead:[
		{'id':'thIdProceso', 'text':'Id proceso', 'sort':false, 'refer':'idacceso', 'type':'text'},
        {'id':'thFecha', 'text':'Fecha', 'sort':false, 'refer':'fechainicio', 'type':'text'},
        {'id':'thNumRegistros', 'text':'Registros afectados', 'sort':false, 'refer':'cantidad', 'type':'text'},
        {'id':'thUsuario', 'text':'Usuario', 'sort':false, 'refer':'usuario', 'type':'text'}
    ]
};

/**
 * Formato de la tabla de liquidaciones.
 * @type {Object}
 */
var formatoLiquidaciones = {
	thead : [
		{'id':'thLiquidacion', 'text':'Liquidación', 'refer':'liquidacion', 'type':'text','valueField':'idliquidacion'}, 
		{'id':'thConcepto', 'text':'Concepto', 'refer':'concepto', 'type':'text','valueField':'idconcepto'}, 
	]
};

/**
 * Formato de la tabla de Resultado
 * @type {Array}
 */
var formatoResultado = [
    { "title": "Liquidación", data: 'liquidacion' },
    { "title": "Id. Suscripción", data: "idsuscripcion" },
    { "title": "Mensaje ", data: "mensaje" }
];

/**
 * Formato con los mensajes de los errores o mensajes de cada facutura.
 * @type {Object}
 */
var formatoErroresAprobar = {
    thead : [
        {'id':'thFactura', 'text':'Num. Factura', 'refer':'idfactura', 'type':'text'}, 
        {'id':'thMensaje', 'text':'Mensaje', 'refer':'mensaje', 'type':'text'}, 
    ]
};

/**
 * Formato de errores del proceso.
 * @type {Object}
 */
var formatoErroresProceso = {
    thead:[
        {'id':'thIdSuscripcion', 'text':'Suscripción', 'refer':'idsuscripcion', 'type':'text'},
        {'id':'thIdLiquidacion', 'text':'Liquidación', 'refer':'idliquidacion', 'type':'text'},
        {'id':'thLiquidacion', 'text':'Liquidación', 'refer':'liquidacion', 'type':'text'},
        {'id':'thMenssaje', 'text':'Mensaje', 'refer':'mensaje', 'type':'text'}
    ]   
};

/**
 * Formato de las facturas correctas.
 * @type {Object}
 */
var formatoFacturasCorrectas = {
    thead:[
        {'id':'thMunicipio', 'text':'Municipio', 'refer':'municipio', 'type':'text'},
        {'id':'thIdTipoUso', 'text':'Id Tipo Uso', 'refer':'idtipouso', 'type':'text'},
        {'id':'thTipoUso', 'text':'Tipo de Uso', 'refer':'tipouso', 'type':'text'},
        {'id':'thValorTotal', 'text':'Valor Total', 'refer':'valortotal', 'type':'currency'},
        {'id':'thNumeroUsuarios', 'text':'Número de Usuarios', 'refer':'numerousuarios', 'type':'text'}
    ]  
};