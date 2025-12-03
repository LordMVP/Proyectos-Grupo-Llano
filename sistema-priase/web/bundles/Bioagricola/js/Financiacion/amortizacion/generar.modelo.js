/**
 * @fileOverview Archivo de modelo para importar financiaciones
 * @author rsagudelo
 * @version 1.0.0
 */
/** @namespace */
var importarModelo = {};
/**
 * Formato para visualizar el progreso de la subida de las financiaciones
 * @type {Object}
 */
var formatoProgreso = {
    thead: [
        {'id': 'thIdProceso', 'text': 'Id proceso', 'sort': false, 'refer': 'idacceso', 'type': 'text'},
        {'id': 'thFecha', 'text': 'Fecha', 'sort': false, 'refer': 'fechainicio', 'type': 'text'},
        {'id': 'thNumRegistros', 'text': 'Registros afectados', 'sort': false, 'refer': 'cantidad', 'type': 'text'},
        {'id': 'thUsuario', 'text': 'Usuario', 'sort': false, 'refer': 'usuario', 'type': 'text'},
    ]
};
/**
 * Formato que muestra el total de las financiaciones subidas o pendientea
 * @type {Object}
 */
var formatoResumen = { 
    thead: [  
        {'id': 'thEstado', 'text': 'Estado Registro', 'sort': false, 'refer': 'estado', 'type': 'text'},
        {'id': 'thTipoPago', 'text': 'Cant. Registros', 'sort': false, 'refer': 'cantidadregistrosprocesados', 'type': 'numeric'},
        {'id': 'thSdo_fin', 'text': 'Saldo Financiación', 'sort': false, 'refer': 'sdo_fin', 'type': 'numeric'},
        {'id': 'thVlrBio', 'text': 'Sdo Amortizado Bio', 'sort': false, 'refer': 'sdo_am_bio', 'type': 'numeric'},
        {'id': 'thVlrfijo', 'text': 'Sdo Amortizado Fijo', 'sort': false, 'refer': 'sdo_am_ter_fijo', 'type': 'numeric'},
        {'id': 'thVlrvar', 'text': 'Sdo Amortizado Variable', 'sort': false, 'refer': 'sdo_am_ter_var', 'type': 'numeric'},
        {'id': 'thVlAjus', 'text': 'Sdo Amortizado Ajuste', 'sort': false, 'refer': 'sdo_am_ter_aju', 'type': 'numeric'},
        {'id': 'thVlrInteres', 'text': 'Sdo Amortizado Interes', 'sort': false, 'refer': 'sdo_am_interes', 'type': 'numeric'},
    ]
};
/**
 * Formato que muestra el resumen de las financiaciones que no se pudieron Procesar
 * @type {Object}
 */
var formatoResumenErrores = {
    thead: [
        {'id': 'thMensaje', 'text': 'Mensaje de Error', 'sort': false, 'refer': 'mensaje', 'type': 'text'},
        {'id': 'thcantidad', 'text': 'Cantidad de Registros', 'sort': false, 'refer': 'cantidad', 'type': 'numeric'}
    ]
};
