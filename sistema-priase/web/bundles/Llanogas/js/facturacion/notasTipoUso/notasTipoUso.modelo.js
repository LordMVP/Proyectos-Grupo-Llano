var notaModelo = {
    valores: []
};

 var formatoFactura = {
    thead:[
        {'id':'thIdFactura', 'text':'Num. Factura', 'refer':'numero', 'type':'text'},
        {'id':'thFechaVencimiento', 'text':'Fec. Vencimiento', 'refer':'fechavencimiento', 'type':'text'},
        {'id':'thCodAnterior', 'text':'Cod. Anterior', 'refer':'codigoanterior', 'type':'text'},
        {'id':'thTipoSus', 'text':'Tipo Suscripción', 'refer':'tiposuscripcion', 'type':'text'},
        {'id':'thCicPer', 'text':'Ciclo - Periodo', 'refer':'cicloperiodo', 'type':'text'},
        {'id':'thValorTotal', 'text':'Vlr. Total', 'refer':'valortotal', 'type':'currency'},
        {'id':'thValorPagado', 'text':'Vlr. Pagado', 'refer':'valorpagado', 'type':'currency'},
        {'id':'thSaldo', 'text':'Saldo', 'refer':'saldo', 'type':'currency'},
        {'id':'thDetalles', 'text':'Detalles', 'refer':'idfactura', 'type':'function', 'tdCallback':'notaVista.validarTdDetalle'},
        {'id':'thVerificar', 'text':'Verificar', 'refer':'idfactura', 'type':'function', 'tdCallback':'notaVista.validarTdVerificar'}
    ]
};

/**
 * Formato para llenar la tabla de conceptos procesados en el dialogo de verificar
 * @type {Object}
 */
var formatoConceptosProcesados = {
    thead:[
        {'id':'thIdConcepto', 'text':'Cód. Concepto', 'refer':'idconcepto', 'type':'text'},
        {'id':'thConcepto', 'text':'Descripción', 'refer':'concepto', 'type':'text'},
        {'id':'thCantidad', 'text':'Cantidad', 'refer':'cantidad', 'type':'numeric'},
        {'id':'thValor', 'text':'Valor', 'sort':false, 'refer':'valortotal', 'type':'numeric'},
        {'id':'thValorTotal', 'text':'Valor Total', 'sort':false, 'refer':'valorreal', 'type':'currency'},
    ]
};

/**
 * Formato para llenar la tabla de conceptos
 * @type {Object}
 */
var formatoConceptos = {
    thead:[
        {'id':'thCodConcepto', 'text':'Cód. Concepto', 'sort':false, 'refer':'iddetallefactura', 'type':'text'},
        {'id':'thDescripcion', 'text':'Descripción', 'sort':false, 'refer':'concepto', 'type':'text'},
        {'id':'thValorLiquidado', 'text':'Valor Liquidado', 'sort':false, 'refer':'valortotal', 'type':'numeric'},
        {'id':'thValorTotal', 'text':'Valor Total', 'sort':false, 'refer':'valor', 'type':'currency'},
        {'id':'thValorCanceado', 'text':'Valor Pagado', 'sort':false, 'refer':'valorpagado', 'type':'currency'},
        {'id':'thSaldo', 'text':'Saldo', 'sort':false, 'refer':'saldo', 'type':'currency'}
    ]
};

/**
 * Formato para llenar la tabla de asignación de valores
 * @type {Object}
 */
var formatoLiquidacionConcepto = {
    thead:[
        {'id':'thSeleccion', 'text':'Selecc.', 'refer':'indice', 'type':'check', 'style':{'width':'10%'}},
        {'id':'thLiquidacion', 'text':'Liquidación', 'refer':'liquidacion', 'type':'text', 'valueField': 'idliquidacion'},
        {'id':'thConcepto', 'text':'Concepto', 'refer':'concepto', 'type':'text', 'valueField': 'idconcepto'},
        {'id':'thValor', 'text':'Valor', 'refer':'valor', 'type':'input', 'style':{'width':'10%'}}
    ]
};

var formatoErrores = {
    thead:[
        {'id':'thIdFactura', 'text':'Factura', 'refer':'idfactura', 'type':'text'},
        {'id':'thMensaje', 'text':'Mensaje', 'refer':'mensaje', 'type':'text'}
    ]  
};