/**
 * @fileOverview Archivo de modelo para importar Porcentajes
 * @author rsagudelo
 * @version 1.0.0
 */
/** @namespace */
var importarPorAprModelo = {};
/**
 * Formato para visualizar el progreso de la subida de los Porcentajes
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
 * Formato que muestra el total de los registros subidos o pendientes
 * @type {Object}
 */
var formatoResumen = {  
    
    thead: [
        {'id': 'thEstado', 'text': 'Estado Registro', 'sort': false, 'refer': 'estado', 'type': 'text'},
        {'id': 'thMes', 'text': 'Mes', 'sort': false, 'refer': 'mes', 'type': 'text'},
        {'id': 'thFijo', 'text': 'Por. Fijo', 'sort': false, 'refer': 'fijo', 'type': 'numeric'},
        {'id': 'thVariable', 'text': 'Por. Variable', 'sort': false, 'refer': 'variable', 'type': 'numeric'},
        {'id': 'thAjuste', 'text': 'Por. Ajuste', 'sort': false, 'refer': 'ajuste', 'type': 'numeric'},
        {'id': 'thViat', 'text': 'Por. Viat', 'sort': false, 'refer': 'viat', 'type': 'numeric'},
        {'id': 'thCantProcesado', 'text': 'Cantidad Registro', 'sort': false, 'refer': 'cantidadregistrosprocesados', 'type': 'text'},    ]
};
/**
 * Formato que muestra el total de los registros que no se pudieron subir
 * @type {Object}
 */
var formatoResumenErrores = {                    
    thead: [
        {'id': 'thTercero', 'text': 'Doc Tercero', 'sort': false, 'refer': 'ter_doc', 'type': 'text'},
        {'id': 'thMesaho', 'text': 'Mes', 'sort': false, 'refer': 'por_mesaho', 'type': 'text'},
        {'id': 'thVlrFijo', 'text': 'Por. Fijo', 'sort': false, 'refer': 'por_fijo', 'type': 'numeric'},
        {'id': 'thVlrFijo', 'text': 'Por. variable', 'sort': false, 'refer': 'por_var', 'type': 'numeric'},
        {'id': 'thVlrFijo', 'text': 'Por. Ajuste', 'sort': false, 'refer': 'por_ajus', 'type': 'numeric'},
        {'id': 'thVlrFijo', 'text': 'Por. Viat', 'sort': false, 'refer': 'por_viat', 'type': 'numeric'},
        {'id': 'thMensaje', 'text': 'Mensaje', 'sort': false, 'refer': 'mensaje', 'type': 'text'}
    ]
};

/**
 * Formato para visualizar la información de porcentajes de aprovechamiento
 * @type {Object}
 */
var formatoTerceros = {
    thead: [
        {'id': 'thTercero', 'text': 'Nombre', 'sort': false, 'refer': 'nombre', 'type': 'text'},
        {'id': 'thMes', 'text': 'Mes', 'sort': false, 'refer': 'papr_mesaho', 'type': 'text'},
        {'id': 'thVlrFijo', 'text': 'Fijo', 'sort': false, 'refer': 'papr_porfijo', 'type': 'text'},
        {'id': 'thVlrVar', 'text': 'Variable', 'sort': false, 'refer': 'papr_porvariable', 'type': 'text'},
        {'id': 'thVlrAjus', 'text': 'Ajuste', 'sort': false, 'refer': 'papr_porajuste', 'type': 'text'},
        {'id': 'thVlrViat', 'text': 'Viat', 'sort': false, 'refer': 'papr_porviat', 'type': 'text'}
    ]
};
