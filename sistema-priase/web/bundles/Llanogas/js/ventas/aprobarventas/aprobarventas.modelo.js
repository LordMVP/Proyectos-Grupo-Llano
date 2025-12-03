/**
 * @fileOverview Archivo de modelo de flujo de aprobación de venta
 * @author angelicaGomez
 * @version 1.0.0
 */
/** @namespace */
var aprobarModelo ={};

/** Formato para llenar la tabla de conceptos
 * @type {Object}
 */
var formatoConceptos = {
    thead:[
    	{'id':'thIdConcepto', 'text':'Id Concepto', 'refer':'idconcepto', 'type':'text'}, 
        {'id':'thConcepto', 'text':'Concepto', 'refer':'concepto', 'type':'text'}, 
        {'id':'thCantidad', 'text':'Cantidad', 'refer':'cantidad', 'type':'text'}, 
        {'id':'thValorUnitario', 'text':'Valor Unitario', 'refer':'valorunitario', 'type':'currency', 'valueField':'valorunitario'},
        {'id':'thValorTotal', 'text':'Valor Total', 'refer':'valortotal', 'type':'currency'},
        {'id':'thValorVenta', 'text':'Valor Venta', 'refer':'valorreal', 'type':'currency'}
    ]
};
/**
 * Formato para llenar la tabla de conceptos financiables
 * @type {Object}
 */
var formatoConceptosFinanciables = {
    thead:[
        {'id':'thConcepto', 'text':'Concepto', 'refer':'concepto', 'type':'text', 'valueField': 'idconcepto'}, 
        {'id':'thCantidad', 'text':'Cantidad', 'refer':'cantidad', 'type':'text'},
        {'id':'thValUni', 'text':'Vlr. Unitario', 'refer':'valorunitario', 'type':'currency'},
        {'id':'thValTot', 'text':'Vlr. Total', 'refer':'valortotal', 'type':'currency'},
        {'id':'thValor', 'text':'Valor', 'refer':'valorreal', 'type':'currency'},
        {'id':'thValorFinanciar', 'text':'Vlr. a Financiar', 'sort':false, 'refer':'valorfinanciar', 'type':'currency'}
    ]
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