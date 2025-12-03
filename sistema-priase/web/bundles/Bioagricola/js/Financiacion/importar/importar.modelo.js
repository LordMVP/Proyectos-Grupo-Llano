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
        {'id': 'thSegmento', 'text': 'Segmento', 'sort': false, 'refer': 'mua_empresa', 'type': 'text'},
        {'id': 'thTipoUSo', 'text': 'Tipo Usuario', 'sort': false, 'refer': 'tip_suscripcion', 'type': 'text'},
        {'id': 'thCantProcesado', 'text': 'Cantidad Registro', 'sort': false, 'refer': 'cantidadregistrosprocesados', 'type': 'text'},
        {'id': 'thVlrProcesado', 'text': 'Valor Total', 'sort': false, 'refer': 'valorregistrosprocesados', 'type': 'numeric'},
    ]
};
/**
 * Formato que muestra el total de las financiaciones que no se pudieron subir
 * @type {Object}
 */
var formatoResumenErrores = {
    thead: [
        {'id': 'thMesaho', 'text': 'Mes y año', 'sort': false, 'refer': 'fin_mesaho', 'type': 'text'},        
        {'id': 'thMensaje', 'text': 'Mensaje', 'sort': false, 'refer': 'mensaje', 'type': 'text'},
        {'id': 'thTotalRegistros', 'text': 'Total Registros', 'sort': false, 'refer': 'fin_vlrtotal', 'type': 'numeric'}
    ]
};
