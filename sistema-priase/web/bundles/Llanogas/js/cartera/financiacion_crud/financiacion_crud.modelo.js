/**
 * @fileOverview Archivo de modelo para consultar la financiación
 * @author AppFuture
 * @version 1.0.0
 */
/** @namespace */
var financiacionCrudModel = {
    archivos:[]
};
/**
 * Formato para llenar la tabla de facturas de una suscripción
 * @type {Object}
 */
var formatoFacturas = {
    thead:[
        {'id':'thIdFactura', 'text':'Cód. Factura', 'refer':'idfactura', 'type':'text'}, 
        {'id':'thNumFactura', 'text':'Núm. Factura', 'refer':'numerofactura', 'type':'text'}, 
        {'id':'thVencimiento', 'text':'Fecha', 'refer':'fecha', 'type':'text'}, 
        {'id':'thCiclo', 'text':'Ciclo', 'refer':'ciclo', 'type':'text'},
        {'id':'thPeriodo', 'text':'Periodo', 'refer':'periodo', 'type':'text'},
        {'id':'thValorTotal', 'text':'Valor Total', 'refer':'valortotal', 'type':'currency'},
        {'id':'thValorTotal', 'text':'Valor Financiado ', 'refer':'valorfinanciado', 'type':'currency'},
        {'id':'thVerDetalles', 'text':'Detalles', 'refer':'idfactura', 'type':'button', 'style': {'width': '10%'}}
    ]
};
/**
 * Formato para llenar la tabla de conceptos de una factura
 * @type {Object}
 */
var formatoConceptos = {
    thead:[
        {'id':'thIdConcepto', 'text':'Cod. Concepto', 'refer':'idconcepto', 'type':'text'}, 
        {'id':'thNombreConcepto', 'text':'Concepto', 'refer':'nombreconcepto', 'type':'text'}, 
        {'id':'thValor', 'text':'Valor', 'refer':'valor', 'type':'currency'}
    ]
};
/**
 * Formato para llenar la tabla de amortizaciones de la financiación
 * @type {Object}
 */
var formatoAmortizaciones = {
    thead:[
        {'id':'thIdAmortizacion', 'text':'Id. Amortización', 'refer':'idamortizacion', 'type':'text'}, 
        {'id':'thFecha', 'text':'Fecha', 'refer':'fecha', 'type':'text'}, 
        {'id':'thCuotaAmortizacion', 'text':'Cuotas Amortización', 'refer':'cuotasamortizadas', 'type':'text'},
        {'id':'thCiclo', 'text':'Ciclo', 'refer':'ciclo', 'type':'text'},
        {'id':'thPeriodo', 'text':'Periodo', 'refer':'periodo', 'type':'text'},
        {'id':'thVerDetalles', 'text':'Ver', 'refer':'idamortizacion', 'type':'button', 'style': {'width': '10%'}}
    ]
};

/**
 * Formato para la tabla de detalles de Amortización.
 * @type {Object}
 */
var formatoDetalleAmortizacion = {
    thead:[
        {'id':'thFactura', 'text':'Id Fac.', 'refer':'fac_ideregistro', 'type':'text'}, 
        {'id':'thNumFactura', 'text':'No. Fac.', 'refer':'fac_numero', 'type':'text'}, 
        {'id':'thConcepto', 'text':'Concepto', 'refer':'concepto', 'type':'text'}, 
        {'id':'thDocumento', 'text':'Documento', 'refer':'documento', 'type':'text'},
        {'id':'thTipoDocumento', 'text':'Tipo Doc.', 'refer':'tipodocumento', 'type':'text'},
        {'id':'thLiquidacion', 'text':'Liquidación', 'refer':'liquidacion', 'type':'text'},
        {'id':'thCiclo', 'text':'Ciclo', 'refer':'ciclo', 'type':'text'}, 
        {'id':'thPeriodo', 'text':'Periodo', 'refer':'periodo', 'type':'text'},
        {'id':'thValor', 'text':'Valor Real', 'refer':'valorreal', 'type':'currency'}
    ]    
};

