/**
 * @fileOverview Archivo de modelo para generar financiación
 * @author AppFuture
 * @version 1.0.0
 */
/** @namespace */
var financiacionModel =  {
    archivos:[],
    maximoplazo: 1,
    descartaConceptos:[],
    descartaConceptosSeleccionados:[]
};
/**
 * Formato para llenar la tabla de facturas
 * @type {Object}
 */
var formatoFacturas = {
    thead:[
        {'id':'thSeleccion', 'text':'Seleccionar', 'sort':false, 
            'refer':'idfactura', 'type':'check',
            'style':{'width':'10%'}
        },
        {'id':'thNumFactura', 'text':'Num. Factura', 'sort':false, 'refer':'numerofactura', 'type':'text','valueField':'version', }, 
        {'id':'thFechaFactura', 'text':'Fecha Factura', 'sort':false, 'refer':'fechafactura', 'type':'text'}, 
        {'id':'thVencimiento', 'text':'Fecha Venc.', 'sort':false, 'refer':'fechavencimientofactura', 'type':'text'}, 
        {'id':'thCiclo', 'text':'Ciclo', 'sort':false, 'refer':'ciclo', 'type':'text', 'valueField':'idciclo'},
        {'id':'thPeriodo', 'text':'Periodo', 'sort':false, 'refer':'periodo', 'type':'text', 'valueField':'idperiodo'},
        {'id':'thValorTotal', 'text':'Vlr. Total', 'sort':false, 'refer':'valorfactura', 'type':'currency'}, 
        {'id':'thValorFinanciable', 'text':'Vlr. Financiable', 'sort':false, 'refer':'valorfinanciable', 'type':'function', 'tdCallback': 'generarFinanciacionVista.validarFinanciable'}, 
        {'id':'thValorNoFinanciable', 'text':'Vlr. No Financiable', 'sort':false, 'refer':'valornofinanciable', 'type':'function','tdCallback': 'generarFinanciacionVista.validarFinanciable'}, 
        {'id':'thValorPagado', 'text':'Vlr. Pagado', 'sort':false, 'refer':'valorpagado', 'type':'currency'},
        {'id':'thValorFinanciar', 'text':'Vlr. a Financiar', 'sort':false, 'refer':null, 'valueField': 'valorfinanciable', 'type':'input', 'style':{'width':'10%'}},
        {'id':'thDetallesFactura', 'text':'Detalles', 'sort':false, 'type':'button', 'valueField':'idfactura'}
    ]
};
/**
 * Formato para llenar la tabla de conceptos de una factura
 * @type {Object}
 */
var formatoConceptos = {
    thead:[
        {'id':'thConcepto', 'text':'Concepto', 'refer':'concepto', 'type':'text'}, 
        {'id':'thValor', 'text':'Valor', 'refer':'valor', 'type':'currency'}
    ]
};
/**
 * Formato para llenar la tabla de Descarte de conceptos de una factura
 * @type {Object}
 */
var formatoDescarteConceptos = {
    thead:[
        {'id':'thConcepto', 'text':'Concepto', 'refer':'concepto', 'type':'text'}, 
         {'id':'thSeleccion', 'text':'Seleccionar', 'sort':false, 'refer':'idconcepto', 'type':'check', 'valueField':'idconcepto'}
    ]
};
