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
        {'id': 'thTipoPago', 'text': 'Tipo Pago', 'sort': false, 'refer': 'tip_pago', 'type': 'text'},
        {'id': 'thTipoPago', 'text': 'Cant. Registros', 'sort': false, 'refer': 'cantidadregistrosprocesados', 'type': 'numeric'},
        {'id': 'thVlrBio', 'text': 'Valor Bio', 'sort': false, 'refer': 'vlr_bio', 'type': 'numeric'},
        {'id': 'thVlrfijo', 'text': 'Valor Fijo', 'sort': false, 'refer': 'vlr_ter_fijo', 'type': 'numeric'},
        {'id': 'thVlrvar', 'text': 'Valor Variable', 'sort': false, 'refer': 'vlr_ter_var', 'type': 'numeric'},
        {'id': 'thVlAjus', 'text': 'Valor Ajuste', 'sort': false, 'refer': 'vlr_ter_aju', 'type': 'numeric'},
        {'id': 'thVlInteres', 'text': 'Valor Interes', 'sort': false, 'refer': 'vlr_interes', 'type': 'numeric'},
        {'id': 'thVlSdo', 'text': 'Valor Sdo', 'sort': false, 'refer': 'vlr_sdo', 'type': 'numeric'},
        {'id': 'thVlrProcesado', 'text': 'Valor Total', 'sort': false, 'refer': 'valorregistrosprocesados', 'type': 'numeric'},
    ]
};
/**
 * Formato que muestra el total de las financiaciones que no se pudieron subir
 * @type {Object}
 */
var formatoResumenErrores = {
    thead: [
        {'id': 'thSuscripcion', 'text': 'cant Registros', 'sort': false, 'refer': 'mua_cod', 'type': 'numeric'},
        {'id': 'thVlrTotal', 'text': 'Valor Total', 'sort': false, 'refer': 'pag_vlrtotal', 'type': 'numeric'},
        {'id': 'thVlrBio', 'text': 'Valor Bio', 'sort': false, 'refer': 'pag_vlrbio', 'type': 'numeric'},
        {'id': 'thVlrfijo', 'text': 'Valor Fijo', 'sort': false, 'refer': 'pag_vlrterfijo', 'type': 'numeric'},
        {'id': 'thVlrvar', 'text': 'Valor Variable', 'sort': false, 'refer': 'pag_vlrtervar', 'type': 'numeric'},
        {'id': 'thVlAjus', 'text': 'Valor Ajuste', 'sort': false, 'refer': 'pag_vlrteraju', 'type': 'numeric'},
        {'id': 'thVlSdo', 'text': 'Valor Sdo', 'sort': false, 'refer': 'pag_vlrsdo', 'type': 'numeric'},
        {'id': 'thVlSdo', 'text': 'Tipo Pago', 'sort': false, 'refer': 'pag_tipopago', 'type': 'text'},
        {'id': 'thMensaje', 'text': 'Mensaje', 'sort': false, 'refer': 'mensaje', 'type': 'text'}
    ]
};
