/**
 * @fileOverview Archivo de modelo para castigar cartera por suscripción
 * @author AppFuture
 * @version 1.0.0
 */
/** @namespace */
var carteraModelo ={};

/**
 * Formato para llenar la tabla de suscripciones con saldo
 * @type {Object}
 */
var formatoSuscripcionSaldo = {
    thead:[
        {'id':'thRecaudo', 'text':'Id Recaudo', 'refer':'idrecaudo', 'type':'text'}, 
        {'id':'thSuscripcion', 'text':'Id Suscripción', 'refer':'idsuscripcion', 'type':'text'}, 
        {'id':'thSaldo', 'text':'Saldo', 'refer':'saldorecaudo', 'type':'currency'}
    ]
};