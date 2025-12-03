/**
 * @fileOverview Archivo de modelo para reestructurar financiaciones
 * @author AppFuture
 * @version 1.0.0
 */
/** @namespace */
var reestructurarModel = {

    /**
     * Guarda la información de la suscripción seleccionada.
     * @type {Object}
     */
    suscripcion:null,

    /**
     * Guarda la información de las financiaciones de la suscripción
     * @type {Object}
     */
    financiaciones:null,

    /**
     * Guarda las opciones de la liquidación
     * @type {Object}
     */
    opcionesLiquidacion:null
};

/**
 * Formato para llenar la tabla de facturas
 * @type {Object}
 */
var formatoFinanciaciones = {
    thead:[
        {'id':'thSeleccion', 'text':'Seleccionar', 'sort':false, 
            'refer':'idfinanciacion', 'type':'check', 
            'style':{'width':'10%'}
        },
        {'id':'thIdFinanciacion', 'text':'Financiacion', 'sort':false, 'refer':'idfinanciacion', 'type':'text'}, 
        {'id':'thSdoCapital', 'text':'Saldo Capital', 'sort':false, 'refer':'saldocapital', 'type':'currency'}, 
        {'id':'thNumCuotas', 'text':'Núm Cuotas', 'sort':false, 'refer':'numerocuotas', 'type':'text'}, 
        {'id':'thCuotasAmortizadas', 'text':'Cuotas Amortizadas', 'sort':false, 'refer':'cuotasamortizadas', 'type':'text'}, 
        {'id':'thCuotasPendientes', 'text':'Cuotas Pendientes', 'sort':false, 'refer':'cuotaspendientes', 'type':'text'}, 
        {'id':'thNuevasCuotas', 'text':'Reestructurar cuotas a', 'sort':false, 'refer':'cuotaspendientes', 'type':'input', 'style':{'width':'5%'}}, 
        {'id':'thLiquidacion', 'text':'Liquidación', 'sort':false, 'refer':'liquidacion', 'type':'text', 'valueField':'idliquidacion'},      
        {'id':'thNuevaLiquidacion', 'text':'Liquidación a Reestructurar', 'sort':false, 'refer':'liquidaciones', 'type':'select', 'datos': 'liquidaciones', 'valueText': 'idliquidacion', 'displayText': 'liquidacion'},
        {'id':'thSimulador', 'text':'Simulador', 'sort':false, 'refer':'idfinanciacion', 'type':'button'} //carga el simulador
    ]
};
