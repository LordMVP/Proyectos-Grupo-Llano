/**
 * @fileOverview Archivo de modelo del programa de reunificación de financiaciones
 * @author AppFuture
 * @version 1.0.0
 */
/** @namespace */
var reunificarModel = {
    /**
     * Guarda la informació de la suscripción seleccionada
     * @type {Object}
     */
    suscripcion: null,

    /**
     * Guarda el total de la financiación.
     * @type {Number}
     */
    totalFinanciar:0
};
/**
 * Formato para llenar la tabla de financiación
 * @type {Object}
 */
var formatoFinanciaciones = {
    thead: [
        {'id':'thSeleccion', 'text':'Seleccionar', 'sort':false, 'refer':'idfinanciacion', 'type':'check', 'style':{'width':'15%'}},
        {'id': 'thIdFinanciacion', 'text': 'Cod. Financiación', 'sort': false, 'refer': 'idfinanciacion', 'type': 'text'},
        {'id': 'thIdAmortizacion', 'text': 'Cod. Amortización', 'sort': false, 'refer': 'idamortizacionfinanciacion', 'type': 'text'},
        {'id': 'thLiquidacion', 'text': 'Liquidación', 'sort': false, 'refer': 'liquidacion', 'type': 'text', 'valueField': 'idliquidacion'},
        {'id': 'thNumeroCuotas', 'text': 'Núm. Cuotas', 'sort': false, 'refer': 'numerocuotas', 'type': 'text'},
        {'id': 'thCuotasAmortizadas', 'text': 'Cuotas Amortizadas', 'sort': false, 'refer': 'cuotasamortizadas', 'type': 'text'},
        {'id': 'thCuotasPendientes', 'text': 'Cuotas Pendientes', 'sort': false, 'refer': 'cuotaspendientes', 'type': 'text'},
        {'id': 'thSaldoCapital', 'text': 'Saldo Capital', 'sort': false, 'refer': 'saldocapital', 'type': 'currency', 'valueField':'idfinanciacion'}
    ]
};
