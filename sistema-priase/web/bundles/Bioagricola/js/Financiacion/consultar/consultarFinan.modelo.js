/**
 * @fileOverview Archivo de modelo para importar financiaciones
 * @author rsagudelo
 * @version 1.0.0
 */
/** @namespace */
var consultarModelo = {};
/**
 * Formato para visualizar el progreso de la subida de las financiaciones
 * @type {Object}
 */
var formatoTerceros = {
    thead: [
        {'id': 'thTercero', 'text': 'Nombre', 'sort': false, 'refer': 'nombre', 'type': 'text'},
        {'id': 'thVlrFijo', 'text': 'Fijo', 'sort': false, 'refer': 'vlr_fijo', 'type': 'numeric'},
        {'id': 'thVlrVar', 'text': 'Variable', 'sort': false, 'refer': 'vlr_vr', 'type': 'numeric'},
        {'id': 'thVlrAjus', 'text': 'Ajuste', 'sort': false, 'refer': 'vlr_ajuste', 'type': 'numeric'},
        {'id': 'thVlrCam', 'text': 'Cambios', 'sort': false, 'refer': 'cambio', 'type': 'numeric'},
        {'id': 'thCamPag', 'text': 'Cambios Pag', 'sort': false, 'refer': 'cam_pag', 'type': 'numeric'},
        {'id': 'thVlrPagos', 'text': 'Valor Pagos', 'sort': false, 'refer': 'pago', 'type': 'numeric'},
        {'id': 'thVlrSdo', 'text': 'Saldo', 'sort': false, 'refer': 'saldo', 'type': 'numeric'}
    ]
};
/**
 * Formato que muestra el resumen de las financiaicones asociadas a un codigo de usuario
 * @type {Object}
 */
var formatoFinanciaciones = {  
    thead: [
        {'id': 'thIdUsuario', 'text': 'Usuario', 'sort': false, 'refer': 'mua_cod', 'type': 'text'},
        {'id': 'thIdFin', 'text': 'Id Finan', 'sort': false, 'refer': 'id_fin', 'type': 'text'},
        {'id': 'thFactura', 'text': 'Fac. Fin', 'sort': false, 'refer': 'lmf_fac', 'type': 'text'},
        {'id': 'thMesAho', 'text': 'Mes Fin', 'sort': false, 'refer': 'fin_mesaho', 'type': 'text'},
        {'id': 'thVlrTotal', 'text': 'Valor Financiado', 'sort': false, 'refer': 'fin_vlrtotal', 'type': 'numeric'},
        {'id': 'thVlrCam', 'text': 'Valor Cambios', 'sort': false, 'refer': 'cam_valor', 'type': 'numeric'},
        {'id': 'thVlrPagos', 'text': 'Valor Pagos', 'sort': false, 'refer': 'fin_pago', 'type': 'numeric'},
        {'id': 'thCuota', 'text': 'Cuota', 'sort': false, 'refer': 'fin_cuoemitidas', 'type': 'text'},
        {'id': 'thTotCuota', 'text': 'Total Cuotas', 'sort': false, 'refer': 'dfin_numcuotas', 'type': 'text'},
        {'id': 'thVlrSdo', 'text': 'Saldo', 'sort': false, 'refer': 'fin_sdo', 'type': 'numeric'}
    ]
};
/**
 * Formato que muestra el resumen de los Pagos de una financiaicon
 * @type {Object}
 */
var formatoPagos = { 
    thead: [       
        {'id': 'thIdFin', 'text': 'Id Finan', 'sort': false, 'refer': 'fin_ideregistro', 'type': 'text'},
        {'id': 'thIdPago', 'text': 'Id Pago', 'sort': false, 'refer': 'pag_ideregistro', 'type': 'text'},
        {'id': 'thVlrPago', 'text': 'Valor Pago', 'sort': false, 'refer': 'pfin_vlrtotal', 'type': 'numeric'},
        {'id': 'thVlrBio', 'text': 'Valor Bio', 'sort': false, 'refer': 'pfin_vlrbio', 'type': 'numeric'},
        {'id': 'thVlrFijo', 'text': 'Valor Fijo Ter', 'sort': false, 'refer': 'pfin_vlrterfijo', 'type': 'numeric'},
        {'id': 'thVlrVar', 'text': 'Vlr Var. Ter', 'sort': false, 'refer': 'pfin_vlrtervar', 'type': 'numeric'},
        {'id': 'thVlrAjus', 'text': 'Vlr Ajuste Ter', 'sort': false, 'refer': 'pfin_vlrteraju', 'type': 'numeric'},
        {'id': 'thVlrInteres', 'text': 'Vlr Interes', 'sort': false, 'refer': 'pfin_vlrinteres', 'type': 'numeric'},
        {'id': 'thTipoPago', 'text': 'Tipo Pago', 'sort': false, 'refer': 'pfin_tippago', 'type': 'text'}
    ]
};

/**
 * Formato que muestra las Amortizaciones de una financiacion
 * @type {Object}
 */
var formatoAmortizaciones = {
    thead: [
        {'id': 'thIdFin', 'text': 'Id Finan', 'sort': false, 'refer': 'fin_ideregistro', 'type': 'text'},
        {'id': 'thIdamm', 'text': 'Id Amortiz', 'sort': false, 'refer': 'am_ideregistro', 'type': 'text'},
        {'id': 'thNumCuota', 'text': 'Num. Cuota', 'sort': false, 'refer': 'am_numcuota', 'type': 'text'},
        {'id': 'thFecha', 'text': 'Fecha', 'sort': false, 'refer': 'am_fechagb', 'type': 'text'},
        {'id': 'thVlrTotal', 'text': 'Total Cuota', 'sort': false, 'refer': 'am_vlrtotal', 'type': 'numeric'},
        {'id': 'thVlrBio', 'text': 'Vlr Bio', 'sort': false, 'refer': 'am_vlrbio', 'type': 'numeric'},
        {'id': 'thVlrFijo', 'text': 'Fijo Apr', 'sort': false, 'refer': 'am_vlrterfij', 'type': 'numeric'},
        {'id': 'thVlrVar', 'text': 'Variable Apr', 'sort': false, 'refer': 'am_vlrtervar', 'type': 'numeric'},
        {'id': 'thVlrAjus', 'text': 'Ajuste Apr', 'sort': false, 'refer': 'am_vlrteraju', 'type': 'numeric'},
        {'id': 'thVlrInteres', 'text': 'Valor Int', 'sort': false, 'refer': 'am_vlrinteres', 'type': 'numeric'},
        {'id': 'thVlrcam', 'text': 'Vlr Cambios', 'sort': false, 'refer': 'cambio', 'type': 'numeric'},
        {'id': 'thVlrPagos', 'text': 'Vlr Pagos', 'sort': false, 'refer': 'pago', 'type': 'numeric'},
        {'id': 'thVlrSdo', 'text': 'Saldo Cuota', 'sort': false, 'refer': 'am_sdocuota', 'type': 'numeric'}
    ]
};

/**
 * Formato que muestra el resumen de todas las financiaicones
 * @type {Object}
 */
var resumenFinanciaciones = {  
    thead: [
        {'id': 'thMesAho', 'text': 'Mes', 'sort': false, 'refer': 'mes', 'type': 'text'},
        {'id': 'thCantidad', 'text': 'Cant. Finan', 'sort': false, 'refer': 'cantidad', 'type': 'numeric'},
        {'id': 'thCantEmitidas', 'text': 'Cuotas Emitidas', 'sort': false, 'refer': 'emitidas', 'type': 'numeric'},
        {'id': 'thTotCuotas', 'text': 'Total Cuotas', 'sort': false, 'refer': 'tot_cuotas', 'type': 'numeric'},
        {'id': 'thVlrTotal', 'text': 'Valor Financiado', 'sort': false, 'refer': 'total', 'type': 'numeric'},
        {'id': 'thVlrCam', 'text': 'Valor Cambios', 'sort': false, 'refer': 'cam_valor', 'type': 'numeric'},
        {'id': 'thVlrPagos', 'text': 'Valor Pagos', 'sort': false, 'refer': 'fin_pago', 'type': 'numeric'},
        {'id': 'thSdoBio', 'text': 'Sdo Bio', 'sort': false, 'refer': 'sdo_bio', 'type': 'numeric'},
        {'id': 'thSdoTerc', 'text': 'Sdo Terceros', 'sort': false, 'refer': 'sdo_terceros', 'type': 'numeric'},
        {'id': 'thVlrSdo', 'text': 'Saldo', 'sort': false, 'refer': 'fin_sdo', 'type': 'numeric'}
    ]
};

/**
 * Formato que muestra el resumen de valores de las Amortizaciones
 * @type {Object}
 */
var resumenAmortizaciones = {
    thead: [
        {'id': 'thMes', 'text': 'Mes Finan', 'sort': false, 'refer': 'mes', 'type': 'text'},
        {'id': 'thTotCuota', 'text': 'Cantidad de Cuotas', 'sort': false, 'refer': 'tot_emitidas', 'type': 'numeric'},
        {'id': 'thVlrTotal', 'text': 'Total Cuota', 'sort': false, 'refer': 'total', 'type': 'numeric'},
        {'id': 'thSdoBio', 'text': 'Sdo Bio', 'sort': false, 'refer': 'sdo_bio', 'type': 'numeric'},
        {'id': 'thSdoTerc', 'text': 'Sdo Terceros', 'sort': false, 'refer': 'sdo_tercero', 'type': 'numeric'},
        {'id': 'thSdoInt', 'text': 'Sdo Interes', 'sort': false, 'refer': 'sdo_interes', 'type': 'numeric'},
        {'id': 'thVlrcam', 'text': 'Vlr Cambios', 'sort': false, 'refer': 'cambio', 'type': 'numeric'},
        {'id': 'thVlrPagos', 'text': 'Vlr Pagos', 'sort': false, 'refer': 'pago', 'type': 'numeric'},
        {'id': 'thVlrSdo', 'text': 'Saldo Cuota', 'sort': false, 'refer': 'sdo', 'type': 'numeric'}
    ]
};

/**
 * Formato que muestra el resumen de los pagos ingresados
 * @type {Object}
 */
var resumenPagos = {
    thead: [
        {'id': 'thMes', 'text': 'Mes Fin', 'sort': false, 'refer': 'mes', 'type': 'text'},
        {'id': 'thTipo', 'text': 'Tipo Pago', 'sort': false, 'refer': 'tipo', 'type': 'text'},
        {'id': 'thCanTotal', 'text': 'Total Registros', 'sort': false, 'refer': 'tot_pagos', 'type': 'numeric'},
        {'id': 'thVlrTotal', 'text': 'Total Pagado', 'sort': false, 'refer': 'total', 'type': 'numeric'},
        {'id': 'thVlrBio', 'text': 'Vlr Bio', 'sort': false, 'refer': 'total_bio', 'type': 'numeric'},
        {'id': 'thVlrFijo', 'text': 'Fijo Apr', 'sort': false, 'refer': 'total_fijo', 'type': 'numeric'},
        {'id': 'thVlrVar', 'text': 'Variable Apr', 'sort': false, 'refer': 'total_var', 'type': 'numeric'},        
        {'id': 'thVlrAjus', 'text': 'Ajuste Apr', 'sort': false, 'refer': 'total_ajus', 'type': 'numeric'},
        {'id': 'thVlrInteres', 'text': 'Interes', 'sort': false, 'refer': 'total_interes', 'type': 'numeric'},
    ]
};

/**
 * Formato que muestra el resumen de la distribucion de terceros
 * @type {Object}
 */
var resumenTerceros = {
    thead: [
        {'id': 'thMes', 'text': 'Mes', 'sort': false, 'refer': 'mes', 'type': 'text'},
        {'id': 'thTercero', 'text': 'Nombre', 'sort': false, 'refer': 'nombre', 'type': 'text'},
        {'id': 'thVlrFijo', 'text': 'Fijo', 'sort': false, 'refer': 'vlr_fijo', 'type': 'numeric'},
        {'id': 'thVlrVar', 'text': 'Variable', 'sort': false, 'refer': 'vlr_vr', 'type': 'numeric'},
        {'id': 'thVlrAjus', 'text': 'Ajuste', 'sort': false, 'refer': 'vlr_ajuste', 'type': 'numeric'},
        {'id': 'thVlrCam', 'text': 'Cambios', 'sort': false, 'refer': 'cambio', 'type': 'numeric'},
        {'id': 'thCamPag', 'text': 'Cambios Pag', 'sort': false, 'refer': 'cam_pag', 'type': 'numeric'},
        {'id': 'thVlrPagos', 'text': 'Valor Pagos', 'sort': false, 'refer': 'pago', 'type': 'numeric'},
        {'id': 'thVlrSdo', 'text': 'Saldo', 'sort': false, 'refer': 'saldo', 'type': 'numeric'}
    ]
};
