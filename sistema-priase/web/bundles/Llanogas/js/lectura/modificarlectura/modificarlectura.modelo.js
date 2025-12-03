/**
 * @fileOverview Archivo de modelo para la modificación de lecturas
 * @author AppFuture
 * @version 1.0.0
 */
/** @namespace */
var modificarLecturaModelo = {};
var idEmpresaLectura = null;
/**
 * Formato para llenar la tabla de los detalles de una lectura
 * @type {Object}
 */
var formatoDetalle = {
    thead: [
        {'id': 'thFecha', 'text': 'Fecha', 'sort': false, 'refer': 'fecha', 'type': 'text'},
        {'id': 'thLecturaAnterior', 'text': 'Lectura Anterior', 'sort': false, 'refer': 'lecturaanterior', 'type': 'text'},
        {'id': 'thLecturaActual', 'text': 'Lectura Actual', 'sort': false, 'refer': 'lecturaactual', 'type': 'text'},
        {'id': 'thConsumo', 'text': 'Consumo', 'sort': false, 'refer': 'consumo', 'type': 'text'},
        {'id': 'thNovedad', 'text': 'Novedad', 'sort': false, 'refer': 'novedad', 'type': 'text'},
        {'id': 'thObservaciones', 'text': 'Observaciones', 'sort': false, 'refer': 'observacion', 'type': 'text'},
        {'id': 'thVer', 'text': 'Ver', 'sort': false,'valueField':'iddetallelectura', 'type': 'button', 'style': {'width': '10%'}},
        {'id': 'thEditar', 'text': 'Editar', 'sort': false, 'valueField':'iddetallelectura', 'type': 'button', 'style': {'width': '10%'}},
        {'id': 'thEliminar', 'text': 'Eliminar', 'sort': false, 'valueField':'iddetallelectura', 'type': 'button', 'style': {'width': '10%'}}
    ]
};
/**
 * Formato para llenar la tabla del historial de lecturas de una suscripción
 * @type {Object}
 */
var formatoHistorial = {
    thead: [
        {'id': 'thFecha', 'text': 'Fecha', 'sort': false, 'refer': 'fecha', 'type': 'text'},
        {'id': 'thLecturaAnterior', 'text': 'Lectura Anterior', 'sort': false, 'refer': 'lecturaanterior', 'type': 'text'},
        {'id': 'thLecturaActual', 'text': 'Lectura Actual', 'sort': false, 'refer': 'lecturaactual', 'type': 'text'},
        {'id': 'thConsumo', 'text': 'Consumo', 'sort': false, 'refer': 'consumo', 'type': 'text'},
        {'id': 'thObservaciones', 'text': 'Observaciones', 'sort': false, 'refer': 'observaciones', 'type': 'text'},
        {'id': 'thVer', 'text': 'Ver', 'sort': false, 'refer': 'idDetalleSuspension', 'type': 'button', 'style': {'width': '10%'}},
    ]
};
/** Arreglo de lecturas */
var jsonGrabar = [];
    