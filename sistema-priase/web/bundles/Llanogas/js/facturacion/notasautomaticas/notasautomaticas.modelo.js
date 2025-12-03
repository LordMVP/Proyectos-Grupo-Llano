/**
 * @fileOverview Archivo de modelo para generar notas automáticas
 * @author AppFuture
 * @version 1.0.0
 */
/** @namespace */
var notasModel = {
    tipo : 'S',
    filtroFactura: [],
    valores: [],
    facturasSeleccionadas:[],
    conceptosInformativos: {}, ///{idconcepto: [conceptosrelacionados]}
    conceptosUtilizados: {}, ///{idconceptorelacionado: [idconcepto, idotroconcepto]}
    idconceptoSeleccionado: null,
    conceptosQuitados: []
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
 * Formato para llenar la tabla de conceptos
 * @type {Object}
 */
var formatoConceptos = {
    thead:[
        {'id':'thIdFactura', 'text':'Cód. Factura', 'sort':false, 'refer':'idfactura', 'type':'text'},
        {'id':'thCodConcepto', 'text':'Cód. Concepto', 'sort':false, 'refer':'iddetallefactura', 'type':'text'},
        {'id':'thDescripcion', 'text':'Descripción', 'sort':false, 'refer':'concepto', 'type':'text'},
        {'id':'thValorLiquidado', 'text':'Valor Liquidado', 'sort':false, 'refer':'valortotal', 'type':'numeric'},
        {'id':'thValorTotal', 'text':'Valor Total', 'sort':false, 'refer':'valor', 'type':'currency'},
        {'id':'thValorCanceado', 'text':'Valor Pagado', 'sort':false, 'refer':'valorpagado', 'type':'currency'},
        {'id':'thSaldo', 'text':'Saldo', 'sort':false, 'refer':'saldo', 'type':'currency'}
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
 * Formato para llenar la tabla de asignación de valores
 * @type {Object}
 */
var formatoLiquidacionConcepto = {
    thead:[
        {'id':'thSeleccion', 'text':'Seleccionar', 'sort':false, 'refer':'indice', 'type':'check', 'style':{'width':'10%'}},
        {'id':'thConcepto', 'text':'Concepto', 'sort':false, 'refer':'concepto', 'type':'text', 'valueField': 'idconcepto'},
        {'id':'thLiquidacion', 'text':'Liquidación', 'sort':false, 'refer':'liquidacion', 'type':'text', 'valueField': 'idliquidacion'},
        {'id':'thOperacion', 'text':'Operación', 'sort':false, 'refer':'operacion', 'type':'select', 'html': '<option value="suma" selected="selected">Sumar</option><option value="resta">Restar</option>' ,'style':{'width':'10%'}},
        {'id':'thValor', 'text':'Valor', 'sort':false, 'refer':'valor', 'type':'input', 'style':{'width':'10%'}},        
        {'id':'thInformativos', 'text':'Concepto Informativo', 'sort':false, 'refer':'idfactura', 'type':'button', 'style':{'width':'10%'}}
    ]
};
/**
 * Formato para llenar la tabla de conceptos informativos relacionados
 * @type {Object}
 */
var formatoConceptosInformativos = {
    thead:[
        {'id':'thSeleccion', 'text':'Seleccionar', 'sort':false, 'refer':'indice', 'type':'check', 'style':{'width':'13%'}},
        {'id':'thConcepto', 'text':'Concepto', 'sort':false, 'refer':'concepto', 'type':'text', 'valueField': 'idconcepto'},
        {'id':'thValor', 'text':'Valor', 'sort':false, 'refer':'valor', 'type':'input', 'style':{'width':'13%'}, 'valueField': 'valor'}
    ]
};
/**
 * Formato para llenar la tabla de asignación de valores
 * @type {Object}
 */
var formatoLiquidacionConceptoCalculo = {
    thead:[
        {'id':'thSeleccion', 'text':'Seleccionar', 'sort':false, 'refer':'idconcepto', 'type':'check', 'style':{'width':'10%'}},
        {'id':'thLiquidacion', 'text':'Liquidación', 'sort':false, 'refer':'liquidacion', 'type':'text', 'valueField': 'idliquidacion'},
        {'id':'thConcepto', 'text':'Concepto', 'sort':false, 'refer':'concepto', 'type':'text', 'valueField': 'idconcepto'},
        {'id':'thValor', 'text':'Valor', 'sort':false, 'refer':'valor', 'type':'input', 'style':{'width':'10%'}}
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

        /*
        {'id':'thValorNota', 'text':'Valor Nota', 'refer':'valornota', 'type':'currency'},
        {'id':'thResultado', 'text':'Resultado', 'refer':'resultado', 'type':'currency'},
        {'id':'thOperacion', 'text':'Operación', 'refer':'operacion', 'type':'function', 'tdCallback':'that.verificarOperacionConcepto'},
        */
    ]
};


var formatoErrores = {
    thead:[
        {'id':'thIdFactura', 'text':'Factura', 'refer':'idfactura', 'type':'text'},
        {'id':'thMensaje', 'text':'Mensaje', 'refer':'mensaje', 'type':'text'}
    ]
};

