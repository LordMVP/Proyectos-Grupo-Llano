/**
 * @fileOverview Archivo modelo de condonar cartera castigada
 * @author angelicaGomez
 * @version 1.0.0
 */
/** @namespace */
var condonarModelo ={
    conceptos : []
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
        {'id':'thIdFactura', 'text':'Id. Factura', 'sort':false, 'refer':'idfactura', 'type':'text'}, 
        {'id':'thNumFactura', 'text':'Num. Factura', 'sort':false, 'refer':'numerofactura', 'type':'text','valueField':'version'}, 
        {'id':'thFechaFactura', 'text':'Fecha Vencimiento', 'sort':false, 'refer':'fechavencimiento', 'type':'text'}, 
        {'id':'thCiclo', 'text':'Ciclo', 'sort':false, 'refer':'ciclo', 'type':'text', 'valueField':'idciclo'},
        {'id':'thPeriodo', 'text':'Periodo', 'sort':false, 'refer':'periodo', 'type':'text', 'valueField':'idperiodo'},
        {'id':'thValorTotal', 'text':'Vlr. Total', 'sort':false, 'refer':'valorreal', 'type':'currency'}, 
        {'id':'thValorPagado', 'text':'Vlr. Pagado', 'sort':false, 'refer':'valorpagado', 'type':'currency'},
        {'id':'thSaldo', 'text':'Saldo', 'sort':false, 'refer':'saldo', 'type':'currency'},
        {'id':'thDetallesFactura', 'text':'Detalles', 'sort':false, 'type':'button','refer': 'numerofactura' ,'valueField':'idfactura', 'style':{'width':'10%'}}
    ]
};
/**
 * Formato para llenar la tabla de conceptos condonables de una factura
 * @type {Object}
 */
var formatoConceptos = {
    thead:[
        {'id':'thSeleccion', 'text':'Seleccionar', 'sort':false, 'refer':'idconcepto', 'type':'check','valueField':'iddetallefactura'},
        {'id':'thIdConcepto', 'text':'Id. Concepto', 'refer':'idconcepto', 'type':'text'},
        {'id':'thConcepto', 'text':'Concepto', 'refer':'nombre', 'type':'text'}, 
        {'id':'thValor', 'text':'Valor', 'refer':'valortotal', 'type':'currency'},
        {'id':'thSaldo', 'text':'Saldo', 'refer':'saldo', 'type':'currency'},
    ]
};
/**
 * Formato para llenar la tabla de conceptos no condonables de una factura
 * @type {Object}
 */
var formatoConceptosNoCondonable = {
    thead:[
        {'id':'thIdConcepto', 'text':'Id. Concepto', 'refer':'idconcepto', 'type':'text'}, 
        {'id':'thConcepto', 'text':'Concepto', 'refer':'nombre', 'type':'text'}, 
        {'id':'thValor', 'text':'Valor', 'refer':'valortotal', 'type':'currency'}
    ]
};