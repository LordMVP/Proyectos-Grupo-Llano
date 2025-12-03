/**
 * @fileOverview Archivo de modelo para generar documento de pago
 * @author AppFuture
 * @version 1.0.0
 */
/** @namespace */
var generarDocModel = {
    suscripcion:null,
    financiaciones:null,
    opcionesLiquidacion:null,
    aplicaint_par:'no',
    aplicaint_tot:'no',
    conceptosFinanciacion: []
};
/**
 * Formato para llenar la tabla de financiaciones.
 * @type {Object}
 */
var formatoFinanciaciones = {
    thead:[
        {'id':'thSeleccion', 'text':'Seleccionar', 'sort':false, 
            'refer':'idfinanciacion', 'type':'check', 'valueField':'version',
            'style':{'width':'10%'}
        },
        {'id':'thIdFinanciacion', 'text':'Financiación', 'sort':false, 'refer':'idfinanciacion', 'type':'text', 'valueField':'tipocuota'}, 
        {'id':'thSdoCapital', 'text':'Saldo Capital', 'sort':false, 'refer':'saldocapital', 'type':'currency'}, 
        {'id':'thNumCuotas', 'text':'Núm Cuotas', 'sort':false, 'refer':'numerocuotas', 'type':'text'}, 
        {'id':'thCuotasAmortizadas', 'text':'Cuotas Amortizadas', 'sort':false, 'refer':'cuotasamortizadas', 'type':'text'}, 
        {'id':'thCuotasPendientes', 'text':'Cuotas Pendientes', 'sort':false, 'refer':'cuotaspendientes', 'valueField': 'maximodocumento' ,'type':'text'},
        {'id':'thLiquidacion', 'text':'Liquidación', 'sort':false, 'refer':'liquidacion', 'type':'text', 'valueField':'idliquidacion'},
        {'id':'thVlrDocPago', 'text':'Valor Documento Pago', 'sort':false, 'refer':'saldocapital', 'type':'input', 'style':{'width':'5%'}},
        {'id':'thNuevasCuotas', 'text':'Nuevas Cuotas', 'sort':false, 'refer':'numerocuotas', 'type':'input', 'style':{'width':'5%'}}, 
        {'id':'thNuevoSaldo', 'text':'Nuevo Saldo', 'sort':false, 'refer':'saldocapital', 'type':'currency'}, 
        {'id':'thSimulador', 'text':'Simulador', 'sort':false, 'refer':'idfinanciacion', 'type':'button'},
        {'id':'thConcepto', 'text':'Concepto', 'sort':false, 'refer':'idfinanciacion', 'type':'button'}
    ]
};
/**
 * Formato para llenar la tabla de conceptos de una factura
 * @type {Object}
 */
var formatoConceptos = {
    thead:[
        {'id':'thSeleccion', 'text':'Seleccionar', 'sort':false, 'refer':'idconcepto', 'type':'check', 'valueField':'iddetallefinanciacion'},
        {'id':'thNombre', 'text':'Nombre', 'sort':false, 'refer':'nombre', 'type':'text'}, 
        {'id':'thSaldo', 'text':'Saldo', 'sort':false, 'refer':'saldo', 'type':'currency'}
    ]
};