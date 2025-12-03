/**
 * @fileOverview Archivo de modelo para generar notas automáticas
 * @author AppFuture
 * @version 1.0.0
 */
/** @namespace */
var notasrModel = {
    tipo : 'S',
    filtroFactura: [],
    valores: [],
    facturasSeleccionadas:[],
    conceptosSeleccionados:[]    
};
/**
 * Columnas para generar tabla de facturas
 * @type {Object}
 */
var formatoFacturas = [
    { "title": "Selecc.", data: 'idfactura',  'orderable': false, width:'90px'},
	{ "title": "Id Suscripción", data:'idsuscripcion' },
	{ "title": "Id Factura", data:'idfactura'},
    { "title": "Núm. Factura", data: 'numero' },
    { "title": "Fec. Vencimiento", data: "fechavencimiento" },
    { "title": "Cód. Anterior", data: "codigoanterior" },
    { "title": "Tipo Suscripción", data: "tiposuscripcion" },
    { "title": "Ciclo - Periodo", data: "cicloperiodo" },
    { "title": "Vlr. Total", data: "valortotal.toString().toCurrency()" },
    { "title": "Vlr. Pagado", data: "valorpagado.toString().toCurrency()" },
    { "title": "Saldo", data: "saldo.toString().toCurrency()" },
    { "title": "Detalles", data: "idfactura", 'orderable': false},
    { "title": "Verificar", data: "idfactura", 'orderable': false }
];
/**
 * Formato para llenar la tabla de conceptos
 * @type {Object}
 */
var formatoConceptos = {
    thead:[
        {'id':'thCheckbox', 'text':'Select.', 'sort':false, 'refer':'iddetallefactura', 'type':'check' },
        {'id':'thIdFactura', 'text':'Cód. Factura', 'sort':false, 'refer':'idfactura', 'type':'text'},
        {'id':'thCodConcepto', 'text':'Cód. Concepto', 'sort':false, 'refer':'iddetallefactura', 'type':'text'},
        {'id':'thDescripcion', 'text':'Descripción', 'sort':false, 'refer':'concepto', 'type':'text'},
        {'id':'thValorLiquidado', 'text':'Valor Liquidado', 'sort':false, 'refer':'valortotal', 'type':'numeric'},
        {'id':'thValorTotal', 'text':'Valor Total', 'sort':false, 'refer':'valor', 'type':'currency'},
        {'id':'thValorCanceado', 'text':'Valor Pagado', 'sort':false, 'refer':'valorpagado', 'type':'currency'},
        {'id':'thSaldo', 'text':'Saldo', 'sort':false, 'refer':'saldo', 'type':'currency'},
        {'id':'thValorAplicar', 'text':'Valor a Aplicar', 'sort':false, 'refer':'saldo', 'type':'input'}
    ]
};
/**
 * Formato para llenar la tabla de Valores a aplicar a las notas en reclamacion 
 * @type {Object}
 */
var formatoValoresAplicar= {
    thead:[
        {'id':'thIdFactura', 'text':'Id. Factura', 'sort':false, 'refer':'idfactura', 'type':'text'},
        {'id':'thCodConcepto', 'text':'Id. Detalle Factura', 'sort':false, 'refer':'iddetallefactura', 'type':'text'},
        {'id':'thDescripcion', 'text':'Descripción Concepto', 'sort':false, 'refer':'concepto', 'type':'text'},
        {'id':'thValorLiquidado', 'text':'Valor Liquidado', 'sort':false, 'refer':'valortotal', 'type':'numeric'},
        {'id':'thSaldo', 'text':'Saldo', 'sort':false, 'refer':'saldo', 'type':'currency'},
        {'id':'thValorAplicar', 'text':'Valor a Aplicar', 'sort':false, 'refer':'ValorAplicar', 'type':'currency'},
        {'id':'thQuitar', 'text':'Quitar', 'refer':'iddetallefactura', 'type':'button', 'style':{'width':'10%', 'text-align':'center'}}
    ]
};
/**
 * Formato para llenar la tabla de filtros adicional de las facturas
 * @type {Object}
 */
var formatoFiltro = {
    thead:[
        {'id':'thConcepto', 'text':'Concepto', 'sort':false, 'refer':'concepto', 'type':'text', 'valueField': 'idconcepto', 'style':{'width':'60%'}},
        {'id':'thValor', 'text':'Valor', 'sort':false, 'refer':'valorconcepto', 'type':'input'},
        {'id':'thEliminar', text:'Eliminar', refer:'idconcepto', type:'button', 'style':{'width':'10%', 'text-align':'center'}}
    ]
};

/**
 * Formato para llenar la tabla de conceptos
 * @type {Object}
 */
var formatoFacturasVerificar = {
    thead:[
        {'id':'thIdFactura', 'text':'Núm. Factura', 'sort':false, 'refer':'numero', 'type':'text'},
        {'id':'thFechaVencimiento', 'text':'Fec. Vencimiento', 'sort':false, 'refer':'fechavencimiento', 'type':'text'},
        {'id':'thCodAnterior', 'text':'Cód. Anterior', 'sort':false, 'refer':'codigoanterior', 'type':'text'},
        {'id':'thTipoSus', 'text':'Tipo Suscripción', 'sort':false, 'refer':'tiposuscripcion', 'type':'text'},
        {'id':'thCicPer', 'text':'Ciclo - Periodo', 'sort':false, 'refer':'cicloperiodo', 'type':'text'},
        {'id':'thValorTotal', 'text':'Vlr. Total', 'sort':false, 'refer':'valortotal', 'type':'currency'},
        {'id':'thValorPagado', 'text':'Vlr. Pagado', 'sort':false, 'refer':'valorpagado', 'type':'currency'},
        {'id':'thSaldo', 'text':'Saldo', 'sort':false, 'refer':'saldo', 'type':'currency'},
        {'id':'thVerificar', 'text':'Verificar', 'sort':false, 'refer':'idfactura', 'type':'button', 'style':{'width':'10%'}}
    ]
};

/**
 * Formato para llenar la tabla de conceptos procesados en el dialogo de verificar
 * @type {Object}
 */
var formatoConceptosProcesados = {
    thead:[
        {'id':'thFactura', 'text':'Cód. Factura', 'refer':'numerofactura', 'type':'text'},
        {'id':'thConcepto', 'text':'Cód. Concepto', 'refer':'idconcepto', 'type':'text'},
        {'id':'thConcepto', 'text':'Descripción', 'refer':'concepto', 'type':'text'},
        {'id':'thValorInicial', 'text':'Valor Inicial', 'refer':'valorinicial', 'type':'currency'},
        {'id':'thSaldoConcepto', 'text':'Saldo Concepto', 'refer':'saldoconcepto', 'type':'currency'},
        {'id':'thValorPagado', 'text':'Valor Pagado', 'refer':'valorpagado', 'type':'currency'},

        {'id':'thNotaCredito', 'text':'Valor Nota Crédito', 'refer':'notacredito', 'type':'currency'},
        {'id':'thNotaDebito', 'text':'Valor Nota Débito', 'refer':'notadebito', 'type':'currency'},
        {'id':'thValorSaldo', 'text':'Valor Saldo a Favor', 'refer':'notasaldo', 'type':'currency'}
    ]
};


var formatoErrores = {
    thead:[
        {'id':'thIdFactura', 'text':'Factura', 'refer':'idfactura', 'type':'text'},
        {'id':'thMensaje', 'text':'Mensaje', 'refer':'mensaje', 'type':'text'}
    ]
};

