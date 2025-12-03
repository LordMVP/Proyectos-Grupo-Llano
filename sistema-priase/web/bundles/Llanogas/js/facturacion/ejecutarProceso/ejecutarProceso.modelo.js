/**
 * @fileOverview Archivo de modelo para ejecutar proceso de facturación
 * @author angelicaGomez
 * @version 1.0.0
 */
/** @namespace */
var ejecutarModelo ={
    ejecucion : []
};
/**
 * Formato para llenar la tabla del proceso que se está ejecutando
 * @type {Object}
 */
var formatoProceso = {
	thead:[
		{'id':'thIdProceso', 'text':'Id proceso', 'sort':false, 'refer':'idacceso', 'type':'text'},
        {'id':'thFecha', 'text':'Fecha', 'sort':false, 'refer':'fechainicio', 'type':'text'},
        {'id':'thNumRegistros', 'text':'Registros afectados', 'sort':false, 'refer':'cantidad', 'type':'text'},
        {'id':'thUsuario', 'text':'Usuario', 'sort':false, 'refer':'usuario', 'type':'text'},
    ]
};

/**
 * Formato para la tabla de errores del proceso
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
 * Formato para la tabla de facturas correctas
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

/**
 * Formato para los errores
 * @type {Array}
 */
var formatoErrores = [
		{'title':'Id. Factura', 'data':'idfactura'},
        {'title':'Mensaje', 'data':'mensaje'}
]