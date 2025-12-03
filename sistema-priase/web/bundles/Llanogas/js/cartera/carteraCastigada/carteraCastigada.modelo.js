/**
 * @fileOverview Archivo de modelo para castigar cartera
 * @author AppFuture
 * @version 1.0.0
 */
/** @namespace */
var carteraModelo = {};

/**
 * Formato para llenar la tabla de suscripciones con saldo
 * @type {Object}
 */
var formatoSuscripcionSaldo = {
    thead: [
        {'id': 'thRecaudo', 'text': 'Id Recaudo', 'refer': 'idrecaudo', 'type': 'text'},
        {'id': 'thSuscripcion', 'text': 'Id Suscripción', 'refer': 'idsuscripcion', 'type': 'text'},
        {'id': 'thSaldo', 'text': 'Saldo', 'refer': 'saldorecaudo', 'type': 'currency'}
    ]
};

/**
 * Formato para llenar la tabla de resumen
 * @type {Object}
 */
var formatoResumen = {
    thead: [
        {'id': 'thDescripcion', 'text': 'Descripción', 'refer': 'descripcion', 'type': 'text'},
        {'id': 'thPrograma', 'text': 'Programa', 'refer': 'programa', 'type': 'text'},
        {'id': 'thEstado', 'text': 'Estado', 'refer': 'estado', 'type': 'text'},
        {'id': 'thSuscripcion', 'text': 'Suscripción', 'refer': 'idsuscripcion', 'type': 'text'},
        {'id': 'thFilasAfectadas', 'text': 'Filas Afectadas', 'refer': 'filasafectadas', 'type': 'text'},
        {'id': 'thFecha', 'text': 'Fecha', 'refer': 'fecha', 'type': 'text'}
    ]
};