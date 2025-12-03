/**
 * @fileOverview Archivo de modelo para importar financiaciones
 * @author rsagudelo
 * @version 1.0.0
 */
/** @namespace */
var generarModelo = {};
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
        {'id': 'thTercero', 'text': 'Tercero', 'sort': false, 'refer': 'tercero', 'type': 'text'},
        {'id': 'thMesFinan', 'text': 'Mes Financiacion', 'sort': false, 'refer': 'mesaaho', 'type': 'text'},
        {'id': 'thCantProcesado', 'text': 'Cantidad Registros', 'sort': false, 'refer': 'cantidad', 'type': 'numeric'},
        {'id': 'thVlrFijo', 'text': 'Valor Fijo', 'sort': false, 'refer': 'vlr_fijo', 'type': 'numeric'},
        {'id': 'thVlrvar', 'text': 'Valor Variable', 'sort': false, 'refer': 'vlr_variable', 'type': 'numeric'},
        {'id': 'thVlrajus', 'text': 'Valor Ajuste', 'sort': false, 'refer': 'vlr_ajuste', 'type': 'numeric'}
    ]
};
/**
 * Formato que muestra el total de las financiaciones que no se pudieron subir
 * @type {Object}
 */
var formatoResumenErrores = {                 
    thead: [
        {'id': 'thNomTercero', 'text': 'Tercero', 'sort': false, 'refer': 'tercero', 'type': 'text'},
        {'id': 'thMesFin', 'text': 'Mes Financiacion', 'sort': false, 'refer': 'mesaaho', 'type': 'text'},
        {'id': 'thMensaje', 'text': 'Mensaje', 'sort': false, 'refer': 'mensaje', 'type': 'text'},
        {'id': 'thCantidad', 'text': 'Cantidad Registros', 'sort': false, 'refer': 'cantidad', 'type': 'numeric'}
    ]
};
