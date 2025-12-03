/**
 * @fileOverview Archivo de modelo de movimientos contables
 * @author AppFuture
 * @version 1.0.0
 */
/** @namespace */
movimientoModelo ={};
/**
 * Formato para llenar la tabla de movimientos contables
 * @type {Object}
 */
var formatoMovimiento = {
	thead:[
	{'id':'thIdProceso', 'text':'Id proceso', 'sort':false, 'refer':'idProceso', 'type':'text'},
        {'id':'thFecha', 'text':'Fecha', 'sort':false, 'refer':'fechaInicio', 'type':'text'},
        {'id':'thFechaFinal', 'text':'Fecha Final', 'sort':false, 'refer':'fechafinal', 'type':'text'},
        {'id':'thNumRegistros', 'text':'Registros afectados', 'sort':false, 'refer':'numeroRegistrosProcesados', 'type':'text'},
        {'id':'thUsuario', 'text':'Usuario', 'sort':false, 'refer':'usuario', 'type':'text'},
    ]
}