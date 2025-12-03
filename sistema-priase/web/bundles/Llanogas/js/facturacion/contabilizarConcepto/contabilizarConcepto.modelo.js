/**
 * @fileOverview Archivo de modelo de contabilizar conceptos
 * @author angelicaGomez
 * @version 1.0.0
 */
/** @namespace */
var contabilizarModelo = {
    /**
     * Arreglo de acciones de contabilización
     * @type {Array}
     */
    accionContabilizacion: [],

    /**
     * Arreglo de acciones de áreas.
     * @type {Array}
     */
    accionArea: [], 

    /**
     * Arreglo de centros de costos
     * @type {Array}
     */
    accionCentroCosto: [], 

    /**
     * Arreglo de conceptos de flujo
     * @type {Array}
     */
    accionConceptoFlujo: [], 

    /**
     * Arreglo de acciones de conceptos contables
     * @type {Array}
     */
    accionConceptoContable: [], 

    /**
     * Arreglo de acciones de flujos de consignación
     * @type {Array}
     */
    accionFlujoConsignacion: [],

    /**
     * Arreglo de acciones de consignaciones contables.
     * @type {Array}
     */
    accionConsignacionContable: [],

    /**
     * Arreglo de flujos de consignaciones.
     * @type {Array}
     */
    flujoconsignacion: [],

    /**
     * Arreglo de contabilización de consignaciones
     * @type {Array}
     */
    contableconsignacion: [],

    /**
     * Variable que lleva el control de los cambios que se hacen en la interfaz.
     * @type {Number}
     */
    cambiosGlobal: 0
};


/**
 * Formato de contablizaciones.
 * @type {Object}
 */
var formatoContabilizacion = {
    thead:[
        {'id':'thCuenta', 'text':'Nombre Cuenta', 'sort':false, 'refer':'cuenta', 'type':'text'},
        {'id':'thCodigo', 'text':'Cuenta', 'sort':false, 'refer':'numerocuenta', 'type':'text'},
        {'id':'thPorcentaje', 'text':'Porcentaje', 'sort':false, 'refer':'porcentaje', 'type':'text'},
        {'id':'thNaturaleza', 'text':'Naturaleza', 'sort':false, 'refer':'naturaleza', 'type':'function', 'tdCallback': 'contabilizarVista.tipoNaturaleza'}, 
        {'id':'thEditar', 'text':'Editar', 'sort':false, 'refer':'idcontabilizacion', 'type':'button', 'style':{'width':'10%'}, 'valueField': 'indice'},
        {'id':'thEliminar', 'text':'Eliminar', 'sort':false, 'refer':'idcontabilizacion', 'type':'button', 'style':{'width':'10%'}, 'valueField': 'indice'}
    ]
};

/**
 * Formato para la tabla de áreas de negocios
 * @type {Object}
 */
var formatoAreaNegocio = {
    thead:[
        {'id':'thTipoSuscripcion', 'text':'Tipo Suscripción', 'sort':false, 'refer':'tiposuscripcion', 'type':'text', 'valueField': 'idtiposusucripcion'},
        {'id':'thArea', 'text':'Nombre Área', 'sort':false, 'refer':'nombrearea', 'type':'text'},
        {'id':'thCodigo', 'text':'Código Área', 'sort':false, 'refer':'codigoarea', 'type':'text'},
        {'id':'thPorcentaje', 'text':'Porcentaje', 'sort':false, 'refer':'porcentaje', 'type':'text'},
        {'id':'thEditar', 'text':'Editar', 'sort':false, 'refer':'idareanegocio', 'type':'button', 'style':{'width':'10%'}, 'valueField': 'indice'},
        {'id':'thEliminar', 'text':'Eliminar', 'sort':false, 'refer':'idareanegocio', 'type':'button', 'style':{'width':'10%'}, 'valueField': 'indice'}
    ]
};

/**
 * Formato para la tabla de centros de costos
 * @type {Object}
 */
var formatoCentroCostos = {
    thead:[
        {'id':'thDepartamento', 'text':'Proceso', 'sort':false, 'refer':'proceso', 'type':'text', 'valueField': 'codigo'},
        {'id':'thCodCentro', 'text':'Cód. Centro Costo', 'sort':false, 'refer':'codigo', 'type':'text'},
        {'id':'thNombreCentro', 'text':'Nombre Centro Costo', 'sort':false, 'refer':'cuenta', 'type':'text', 'valueField': 'idcuenta'},
        {'id':'thPorcentaje', 'text':'Porcentaje', 'sort':false, 'refer':'porcentaje', 'type':'text'},
        {'id':'thEditar', 'text':'Editar', 'sort':false, 'refer':'idcentrocosto', 'type':'button', 'style':{'width':'10%'}, 'valueField': 'indice'},
        {'id':'thEliminar', 'text':'Eliminar', 'sort':false, 'refer':'idcentrocosto', 'type':'button', 'style':{'width':'10%'}, 'valueField': 'indice'}
    ]
};

/**
 * Formato para la tabla de conceptos de flujos
 * @type {Object}
 */
var formatoConceptoFlujo = {
    thead:[
        {'id':'thMedioPago', 'text':'Medio Pago', 'sort':false, 'refer':'cuenta', 'type':'text'},
        {'id':'thTipo', 'text':'Tipo', 'sort':false, 'refer':'tipo', 'type':'text'},
        {'id':'thConcepto', 'text':'Concepto Flujo', 'sort':false, 'refer': 'conceptocontable', 'valueField':'idconcepto', 'type':'text'},
        {'id':'thPorcentaje', 'text':'Porcentaje', 'sort':false, 'refer':'porcentaje', 'type':'text'},
        {'id':'thEliminar', 'text':'Eliminar', 'sort':false, 'refer':'idconceptoflujo', 'type':'button', 'style':{'width':'10%'}, 'valueField': 'indice'}
    ]
};


/**
 * Formato para la tabla de conceptos contables.
 * @type {Object}
 */
var formatoConceptoContable = {
    thead:[
        {'id':'thMedioPago', 'text':'Medio Pago', 'sort':false, 'refer':'cuenta', 'type':'text'},
        {'id':'thTipo', 'text':'Tipo', 'sort':false, 'refer':'tipo', 'type':'text'},
        {'id':'thConcepto', 'text':'Concepto Contable', 'sort':false, 'refer': 'conceptocontable', 'valueField':'idconcepto', 'type':'text'},
        {'id':'thPorcentaje', 'text':'Porcentaje', 'sort':false, 'refer':'porcentaje', 'type':'text'},
        {'id':'thEliminar', 'text':'Eliminar', 'sort':false, 'refer':'idconceptocontable', 'type':'button', 'style':{'width':'10%'}, 'valueField': 'indice'}
    ]
};