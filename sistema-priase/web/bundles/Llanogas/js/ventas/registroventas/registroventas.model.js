/**
 * @fileOverview Archivo de modelo de registrar ventas
 * @author angelicaGomez
 * @version 1.0.0
 */
/** @namespace */
var registroVentasModelo ={
    archivos: [],
    conceptos: [],
    conceptosLiquidados: [],
    modelo: 'registro',
    conceptosEliminados:[],
    historicoConceptosEliminados:[],
    botonesformatos: [],
    archivosEliminados: [],
    contador:[]
};


/** Formato para llenar la tabla de liquidaciones
 * @type {Object}
 */
 var formatoLiquidacion = {
    thead:[
    	{'id':'thIdLiquidacion', 'text':'Id Liquidación', 'refer':'idliquidacion', 'type':'text'}, 
        {'id':'thLiquidacion', 'text':'Liquidación', 'refer':'liquidacion', 'type':'text'}
    ]
};

/** Formato para llenar la tabla de financiaciones de una venta
 * @type {Object}
 */
 var formatoFinanciacion = {
    thead:[
        {'id':'thLiquidacion', 'text':'Tipo Financiación', 'refer':'liquidacion', 'type':'text'},
        {'id':'thInteres', 'text':'Interés', 'refer':'interes', 'type':'text'},
        {'id':'thVlrFinanciable', 'text':'Vlr. Financiado', 'refer':'valorfinanciar', 'type':'text'},
        {'id':'thValorCuotaInicial', 'text':'Vlr. Cuota Inicial', 'refer':'idliquidacion','type':'function','tdCallback': 'registroVentasVista.validarCuotaInicial'},
        {'id':'thDetallesFinanciacion', 'text':'Detalles', 'type':'button', 'refer':'idventafinanciacion', 'style':{'width':'10%'}}
    ]
};
/**
 * Formato para llenar la tabla de los detalles de la financiación
 * @type {Object}
 */
var formatoDetallesFinanciacion = {
    thead:[
    	{'id':'thIdConcepto', 'text':'Id Concepto', 'refer':'idconcepto', 'type':'text'}, 
        {'id':'thConcepto', 'text':'Concepto', 'refer':'concepto', 'type':'text'}, 
        {'id':'thCantidad', 'text':'Cantidad', 'refer':'cantidad', 'type':'numeric'}, 
        {'id':'thValorUnitario', 'text':'Valor Unitario', 'refer':'valorunitario', 'type':'currency', 'valueField':'valorunitario'},
        {'id':'thValorTotal', 'text':'Valor Total', 'refer':'valortotal', 'type':'currency'},
        {'id':'thValorFinanciado', 'text':'Valor Financiado', 'refer':'valorfinanciar', 'type':'currency'}
    ]
};

/** Formato para llenar la tabla de liquidaciones
 * @type {Object}
 */
 var formatoConceptosSeleccionar = {
    thead:[
    	{'id':'thSeleccionar', 'text':'Seleccionar', 'refer':'idconcepto', 'type':'check'}, 
    	{'id':'thIdConcepto', 'text':'Id Concepto', 'refer':'idconcepto', 'type':'text'}, 
        {'id':'thConcepto', 'text':'Concepto', 'refer':'concepto', 'type':'text'}
    ]
};
/**
 * Formato para llenar la tabla de conceptos
 * @type {Object}
 */
var formatoConceptos = {
    thead:[
    	{'id':'thIdConcepto', 'text':'Id Concepto', 'refer':'idconcepto', 'type':'text'}, 
        {'id':'thConcepto', 'text':'Concepto', 'refer':'concepto', 'type':'text'}, 
        {'id':'thCantidad', 'text':'Cantidad', 'refer':'cantidad', 'type':'text'}, 
        {'id':'thValorUnitario', 'text':'Valor Unitario', 'refer':'valorunitario', 'type':'numeric', 'valueField':'valorunitario'},
        {'id':'thValorTotal', 'text':'Valor Total', 'refer':'valortotal', 'type':'numeric'},
        {'id':'thValorVenta', 'text':'Valor Venta', 'refer':'valorreal', 'type':'currency'},
        {'id':'thEditar', 'text':'Editar','sort':false,  'refer':'idconcepto','type':'function','tdCallback': 'registroVentasVista.validarEdicion'},
        {'id':'thEliminar', 'text':'Quitar','sort':false,  'refer':'eliminar', 'valueField': 'idconcepto', 'type':'function','tdCallback': 'registroVentasVista.validarEliminar'}
    ]
};
/**
 * Formato para llenar la tabla de conceptos los conceptos informativos
 * @type {Object}
 */
var formatoConceptosInformativos = {
    thead:[
    	{'id':'thIdConcepto', 'text':'Id Concepto', 'refer':'idconcepto', 'type':'text'}, 
        {'id':'thConcepto', 'text':'Concepto', 'refer':'concepto', 'type':'text'}, 
        {'id':'thCantidad', 'text':'Cantidad', 'refer':'cantidad', 'type':'numeric'}, 
        {'id':'thValorUnitario', 'text':'Valor Unitario', 'refer':'valorunitario', 'type':'numeric', 'valueField':'valorunitario'},
        {'id':'thValorTotal', 'text':'Valor Total', 'refer':'valortotal', 'type':'numeric'},
        {'id':'thValorVenta', 'text':'Valor Venta', 'refer':'valorreal', 'type':'currency'}
    ]
};

/**
 * Formato para llenar la tabla de las ventas adicionales a la actual tienen un cliente
 * @type {Object}
 */
var formatoVentasSuscripcion = {
    thead:[
    	{'id':'thNumVenta', 'text':'Núm. venta', 'refer':'numeroventa', 'type':'text'}, 
    	{'id':'thFecha', 'text':'Fecha', 'refer':'fecha', 'type':'text'}, 
    	{'id':'thEstado', 'text':'Estado', 'refer':'estado', 'type':'function', 'tdCallback': 'registroVentasVista.validarEstadoVenta'}
    ]
};


/**
 * Formato de cambios realizados a una Venta
 * @type {Object}
 */
var formatoCambiosVentas = {
    thead:[
    	{'id':'thConcepto', 'text':'Concepto', 'refer':'concepto', 'type':'text'}, 
    	{'id':'thCantidadAnt', 'text':'Cantidad Anterior', 'refer':'cantidad_ant', 'type':'text'}, 
    	{'id':'thVlrUniAnt', 'text':'Vlr Uni Anterior', 'refer':'vlr_unitario_ant', 'type':'text'},
    	{'id':'thTotalAnt', 'text':'Total Anterior', 'refer':'total_ant', 'type':'text'},
    	{'id':'thCantidadNew', 'text':'Cantidad Nueva', 'refer':'cantidad_new', 'type':'text'},
    	{'id':'thVlrUniNew', 'text':'Vlr Uni Nueva', 'refer':'vlr_unitario_new', 'type':'text'},
    	{'id':'thTotalNew', 'text':'Total Nueva', 'refer':'total_new', 'type':'text'}
    ]
};
