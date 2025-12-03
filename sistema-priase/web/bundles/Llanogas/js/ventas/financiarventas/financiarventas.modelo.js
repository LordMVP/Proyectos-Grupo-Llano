/**
 * @fileOverview Archivo de modelo de financiar ventas
 * @author angelicaGomez
 * @version 1.0.0
 */
/** @namespace */
var financiarModelo ={
    archivos : [],
    interesmaximo: 0,
    indiceFinanciacion: 0,
    valorNoFinanciable: 0,
    archivosEliminados: [],
    conceptoLiquidacion: [],
    liquidacionesUtilizadas: [], 
    numeropagare: 0, 
    idfinanciacion: 0
};
/**
 * Formato para llenar la tabla de facturas
 * @type {Object}
 */
var formatoFacturas = {
    thead:[
        {'id':'thNumFactura', 'text':'Núm. Factura', 'sort':false, 'refer':'numero', 'type':'text'}, 
        {'id':'thFechaFactura', 'text':'Fecha Factura', 'sort':false, 'refer':'fecha', 'type':'text'}, 
        {'id':'thVencimiento', 'text':'Fecha Venc.', 'sort':false, 'refer':'fechavencimiento', 'type':'text'}, 
        {'id':'thCicloPeriodo', 'text':'Ciclo - Periodo', 'sort':false, 'refer':'cicloperiodo', 'type':'text', 'valueField':'idciclo'},
        {'id':'thValorTotal', 'text':'Vlr. Total', 'sort':false, 'refer':'valortotal', 'type':'currency'}, 
        {'id':'thValorFinanciable', 'text':'Vlr. Financiable', 'sort':false, 'refer':'valorfinanciable', 'type':'currency'}, 
        {'id':'thValorNoFinanciable', 'text':'Vlr. No Financiable', 'sort':false, 'refer':'valornofinanciable', 'type':'currency'}, 
        {'id':'thValorPagado', 'text':'Vlr. Pagado', 'sort':false, 'refer':'valorpagadofactura', 'type':'currency'},
        {'id':'thValorFinanciar', 'text':'Vlr. a Financiar', 'sort':false, 'refer':null, 'type':'input', 'style':{'width':'10%'}},
        {'id':'thDetallesFactura', 'text':'Detalles', 'sort':false, 'type':'button', 'valueField':'idfactura'}
    ]
};
/**
 * Formato para llenar la tabla de conceptos financiables
 * @type {Object}
 */
var formatoConceptosFinanciables = {
    thead:[
        {'id':'thSeleccion', 'text':'Seleccionar', 'sort':false, 
            'refer':'idconcepto', 'type':'check','style':{'width':'10%'}
        },
        //{'id':'thIdConcepto', 'text':'Id. Concepto', 'refer':'idconcepto', 'type':'text'}, 
        {'id':'thConcepto', 'text':'Concepto', 'refer':'concepto', 'type':'text', 'valueField': 'idconcepto '}, 
        {'id':'thCantidad', 'text':'Cantidad', 'refer':'cantidad', 'type':'text'},
        {'id':'thValUni', 'text':'Vlr. Unitario', 'refer':'valorunitario', 'type':'currency'},
        {'id':'thValTot', 'text':'Vlr. Total', 'refer':'valortotal', 'type':'currency'},
        {'id':'thValorCuota', 'text':'Vlr. Cuota Inicial', 'refer':'valorcuota', 'type':'currency'},
        {'id':'thValorFinanciar', 'text':'Vlr. a Financiar', 'refer':'valorfinanciar', 'type':'text'}
    ]
};

/**
 * Formato para llenar la tabla de conceptos no financiables
 * @type {Object}
 */
var formatoConceptosNoFinanciable = {
    thead:[
        {'id':'thConcepto', 'text':'Concepto', 'refer':'concepto', 'type':'text', 'valueField': 'idconcepto '}, 
        {'id':'thCantidad', 'text':'Cantidad', 'refer':'cantidad', 'type':'text'},
        {'id':'thValUni', 'text':'Vlr. Unitario', 'refer':'valorunitario', 'type':'currency'},
        {'id':'thValTot', 'text':'Vlr. Total', 'refer':'valortotal', 'type':'currency'},
        {'id':'thValor', 'text':'Valor', 'refer':'valorreal', 'type':'currency'}
    ]
};
/**
 * Template para mostrar las financiaciones
 * @type {Object}
 */
var formatoTemplateFinanciacion = 
        '<div class="divContenedorColapsable" style="margin-right: 10px;">'+
        '<div class="divColapsable"><h4 class="tituloColapsable">Financiación <span class="spanTipoFinanciacion"></span> </h4><div class="btnColapsable"><a href="" class="fa fa-minus" tabindex="-1"></a><a href="" class="fa fa-times" tabindex="-2" style="margin-left: 8px;" data-indice="{{i}}"></a></div></div>'+
        '<div class="contenidoColapsable">'+
            '<div class="campo"><label for="cmbTipoFinanciacion_{{i}}">Tipo de financiación:</label><select id="cmbTipoFinanciacion_{{i}}" class="tipofinanciacion" data-indice="{{i}}"></select></div>'+
            '<div class="campo"><label for="txtInteresFinanciacion_{{i}}">Interés:</label><input type="text" id="txtInteresFinanciacion_{{i}}" class="interesfinanciacion" disabled="disabled" data-caja="number"/></div>'+
            '<table class="tabla" id="tblConceptosFinanciacion_{{i}}"></table>'+
            '<div class="campo"><label for="txtVlrFinanciableFinanciacion_{{i}}">Valor financiable:</label><input type="text" id="txtVlrFinanciableFinanciacion_{{i}}" disabled="disabled"/></div>'+
            '<div class="campo"><label for="txtVlrCuotaFinanciacion_{{i}}">Cuota inicial:</label><input type="text" id="txtVlrCuotaFinanciacion_{{i}}" disabled="disabled" /></div>'+
            '<div class="campo"><label for="txtVlrFinanciarFinanciacion_{{i}}">Valor a financiar:</label><input type="text" id="txtVlrFinanciarFinanciacion_{{i}}" class="valorafinanciar" disabled="disabled" /></div>'+
        '</div></div>';