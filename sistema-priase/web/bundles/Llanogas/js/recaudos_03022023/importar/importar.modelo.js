/**
 * @fileOverview Archivo de modelo para importar recaudos
 * @author angelicaGomez
 * @version 1.0.0
 */
/** @namespace */
var importarModelo = {};
/**
 * Formato para visualizar el progreso de la subido de los recaudos
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
 * Formato que muestra el total de los recaudos subidos por municipio
 * @type {Object}
 */
var formatoResumen = {
    thead: [
        {'id': 'thMunicipio', 'text': 'Municipio', 'sort': false, 'refer': 'municipio', 'type': 'text'},
        {'id': 'thFecha', 'text': 'Fecha', 'sort': false, 'refer': 'fechapago', 'type': 'text'},
        {'id': 'thRecaudaro', 'text': 'Medio Pago', 'sort': false, 'refer': 'nombrerecaudador', 'type': 'text'},
        {'id': 'thCantProcesado', 'text': 'Cantidad Recaudos', 'sort': false, 'refer': 'cantidadregistrosprocesados', 'type': 'text'},
        {'id': 'thVlrProcesado', 'text': 'Valor Total', 'sort': false, 'refer': 'valorregistrosprocesados', 'type': 'numeric'},
    ]
};
/**
 * Formato que muestra el total de los recaudos que no se pudieron subir por municipio
 * @type {Object}
 */
var formatoResumenErrores = {
    thead: [
        {'id': 'thSuscripcion', 'text': 'Id. Suscripción', 'sort': false, 'refer': 'idsuscripcion', 'type': 'text'},
        {'id': 'thMensaje', 'text': 'Mensaje', 'sort': false, 'refer': 'mensaje', 'type': 'text'}
    ]
};
