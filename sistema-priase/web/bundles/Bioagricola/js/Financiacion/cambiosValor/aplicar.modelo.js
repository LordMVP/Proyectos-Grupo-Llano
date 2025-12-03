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
        {'id': 'thEstadoCambio', 'text': 'Estado Cambio', 'sort': false, 'refer': 'tipo_cambio', 'type': 'text'},
        {'id': 'thMesCambio', 'text': 'Mes Cambio', 'sort': false, 'refer': 'mes', 'type': 'text'},
        {'id': 'thCantProcesado', 'text': 'Cantidad Registro', 'sort': false, 'refer': 'cantidadregistrosprocesados', 'type': 'numeric'},
        {'id': 'thVlrBio', 'text': 'Valor Bio', 'sort': false, 'refer': 'vlr_bio', 'type': 'numeric'},
        {'id': 'thVlrTer', 'text': 'Valor Terceros', 'sort': false, 'refer': 'vlr_tercero', 'type': 'numeric'},
        {'id': 'thVlrTerPag', 'text': 'Valor Terceros Pag', 'sort': false, 'refer': 'vlr_tercero_pag', 'type': 'numeric'},
        {'id': 'thVlrsdoo', 'text': 'Sdo Cambio', 'sort': false, 'refer': 'vlr_sdo', 'type': 'numeric'},
        {'id': 'thVlrProcesado', 'text': 'Valor Total', 'sort': false, 'refer': 'valorregistrosprocesados', 'type': 'numeric'},
    ]
};
/**
 * Formato que muestra el total de las financiaciones que no se pudieron subir
 * @type {Object}
 */
var formatoResumenErrores = {                        
    thead: [
        {'id': 'thMensaje', 'text': 'Mensaje', 'sort': false, 'refer': 'mensaje', 'type': 'text'},
        {'id': 'thMesAho', 'text': 'Mes del Cambio', 'sort': false, 'refer': 'fin_mesaho', 'type': 'text'},
        {'id': 'thSUsuario', 'text': 'Usuario Act', 'sort': false, 'refer': 'des_usuapl', 'type': 'text'},
        {'id': 'thSValor', 'text': 'Valor Cambio', 'sort': false, 'refer': 'total', 'type': 'numeric'},
        {'id': 'thcantidad', 'text': 'Cantidad de Registros', 'sort': false, 'refer': 'cantidad', 'type': 'numeric'}
    ]
};
