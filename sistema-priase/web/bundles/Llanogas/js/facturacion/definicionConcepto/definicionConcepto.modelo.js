/**
* @fileOverview Archivo de modelo de definición de conceptos
* @author Appfuture 
* @requires definicionConcepto.modelo.js
* @version 1.0.0
*/

/**
 * Formato de la tabla de conceptos se pueden seleccionar
 * @type {Object}
 */
var formatoConceptoASeleccionar = {
    thead: [
        {'id': 'thSeleccionar', 'text': 'Seleccionar', 'refer': 'idconcepto', 'type': 'check'},
        {'id': 'thNombre', 'text': 'Nombre', 'refer': 'nombre', 'type': 'text'},
        {'id': 'thAlias', 'text': 'Alias', 'refer': 'alias', 'type': 'text'},
        {'id': 'thValor', 'text': 'Valor', 'refer': 'valor', 'type': 'currency'},
        {'id': 'thOperacion', 'text': 'Operacion', 'refer': 'operacion', 'type': 'text'}
    ]
};

/**
 * Formato de conceptos seleccionados
 * @type {Object}
 */
var formatoConceptoSeleccionado = {
    thead: [
        {'id': 'thNombre', 'text': 'Nombre', 'refer': 'conceptorelacionado', 'type': 'text', 'valueField':'idregistro'},
        {'id': 'thFuncionConcepto', 'text':'Función', 'refer':'idfuncion', 'type':'select', 'datos':'definicionModelo.funcionesconceptos', 'valueText':'idfuncion', 'displayText':'nombre' }
    ]
};

/**
 * Formato de tabla de rangos
 * @type {Object}
 */
var formatoRango = {
    thead: [
        {'id': 'thRangoInicial', 'text': 'Rango inicial', 'refer': 'rangoinicial', 'type': 'text'},
        {'id': 'thRangoFinal', 'text': 'Rango final', 'refer': 'rangofinal', 'type': 'text'},
        {'id': 'thValor', 'text': 'Valor', 'refer': 'valor', 'type': 'text'},
        {'id': 'thFormula', 'text': 'Fórmula', 'refer': 'formula', 'type': 'function', 'tdCallback':'definicionVista.formulaJSONAaString' },
        {'id': 'thEditar', 'text': 'Editar', 'refer': 'idrango', 'type': 'button', 'style': {'width': '10%'}},
        {'id': 'thBorrar', 'text': 'Eliminar', 'refer': 'idrango', 'type': 'button', 'style': {'width': '10%'}}
    ]
};

/**
 * Formato de las tablas de contabilizaciones
 * @type {Object}
 */
var formatoContabilizacion = {
    thead: [
        {'id': 'tdDocumento', 'text': 'Documento', 'refer': 'documento', 'valueField':'iddocumento', 'type': 'text'},
        {'id': 'tdTipoDocumento', 'text': 'Tipo de Documento', 'refer': 'tipodocumento', 'valueField':'idtipodocumento', 'type': 'text'},
        {'id': 'thCodCuenta', 'text': 'Cód. cuenta', 'refer': 'codigo', 'type': 'text' },
        {'id': 'thNombreCuenta', 'text': 'Cuenta', 'refer': 'cuenta', 'type': 'text' },
        {'id': 'thNaturaleza', 'text': 'Naturaleza', 'refer': 'naturaleza', 'type': 'function', 'tdCallback':'definicionVista.tdCallbackMostrarNaturaleza'},
        {'id': 'thPorcentaje', 'text': 'Porcentaje', 'refer': 'porcentaje', 'type': 'text'},
        {'id': 'thEditar', 'text': 'Editar', 'refer': 'idcontabilizacion', 'type': 'button', 'style': {'width': '10%'}},
        {'id': 'thBorrar', 'text': 'Eliminar', 'refer': 'idcontabilizacion', 'type': 'button', 'style': {'width': '10%'}}
    ]
};

/**
 * Formato para la tabla de áreas de negocio
 * @type {Object}
 */
var formatoAreaNegocio = {
    thead: [
        {'id': 'thTipoSuscripción', 'text': 'Tipo suscripción', 'refer': 'tiposuscripcion', 'type': 'text'},
        {'id': 'thCodArea', 'text': 'Cód. área', 'refer': 'codigoarea', 'type': 'text'},
        {'id': 'thNomArea', 'text': 'Nombre área', 'refer': 'nombrearea', 'type': 'text'},
        {'id': 'thPorcentaje', 'text': 'Porcentaje', 'refer': 'porcentaje', 'type': 'text'},
        {'id': 'thEditar', 'text': 'Editar', 'refer': 'idrango', 'type': 'button', 'style': {'width': '10%'}},
        {'id': 'thBorrar', 'text': 'Eliminar', 'refer': 'idrango', 'type': 'button', 'style': {'width': '10%'}}
    ]
};

/**
 * Formato de la tabla de centros de costos
 * @type {Object}
 */
var formatoCentroCostos = {
    thead: [
        {'id': 'thDepartamento', 'text': 'Departamento empresa', 'refer': 'departamentoempresa', 'type': 'text'},
        {'id': 'thCodCentro', 'text': 'Cód. centro', 'refer': 'codigoempresa', 'type': 'text'},
        {'id': 'thNomCentro', 'text': 'Nombre centro', 'refer': 'nombrecuenta', 'type': 'text'},
        {'id': 'thPorcentaje', 'text': 'Porcentaje', 'refer': 'porcentaje', 'type': 'text'},
        {'id': 'thEditar', 'text': 'Editar', 'refer': 'idcentrocosto', 'type': 'button', 'style': {'width': '10%'}},
        {'id': 'thBorrar', 'text': 'Eliminar', 'refer': 'idcentrocosto', 'type': 'button', 'style': {'width': '10%'}}
    ]
};

/**
 * Formato de la tabla de contabilización de cruces
 * @type {Object}
 */
var formatoContabilizacionCruce = {
    thead: [
        {'id': 'thDocumento', 'text': 'Documento', 'refer': 'documento', 'type': 'text'},
        {'id': 'thTipoDocumento', 'text': 'Tipo de Documento', 'refer': 'tipodocumento', 'type': 'text'},
        {'id': 'thMedioPago', 'text': 'Medio de Pago', 'refer': 'mediopago', 'type': 'text'},
        {'id': 'thCodCuenta', 'text': 'Cód. Cuenta', 'refer': 'codigo', 'type': 'text'},
        {'id': 'thNombreCuenta', 'text': 'Cuenta', 'refer': 'cuenta', 'type': 'text'},
        {'id': 'thNaturaleza', 'text': 'Naturaleza', 'refer': 'naturaleza', 'type': 'function', 'tdCallback':'definicionVista.tdCallbackMostrarNaturaleza'},
        {'id': 'thPorcentaje', 'text': 'Porcentaje', 'refer': 'porcentaje', 'type': 'text'},
        {'id': 'thEditar', 'text': 'Editar', 'refer': 'idcentrocosto', 'type': 'button', 'style': {'width': '10%'}},
        {'id': 'thBorrar', 'text': 'Eliminar', 'refer': 'idcentrocosto', 'type': 'button', 'style': {'width': '10%'}}
    ]
};


var conceptoPrueba = {
    "definicionesconceptos": {
        "conceptos": {
            "accion": "I",
            "idconcepto": 40,
            "nombre": "(D) Interes Moratorio",
            "alias": "%Im",
            "abreviatura": "INTERES MORATORIO",
            "tipcalculo": "V",
            "valor": "123",
            "formula": "",
            "operacion": "S",
            "preliquidar": "S",
            "anticipo": "N",
            "pagprioridad": "0",
            "financiable": "S",
            "fechainicialvigencia": "2015/07/08",
            "fechafinalvigencia": "2015/07/08",
            "estado": "A",
            "idprograma": "15",
            "campoconcepto": "V",
            "tablaorigen": "1",
            "campo": "1",
            "nulo": "S",
            "condonable": "N",
            "deshabitado":"X",
            "puertapuerta":"X",
            "tarifaplena":"X",
            "homologacion":"X",
            "aforadoaseo":"X",
        },
        "relacionconceptos": [
            {
                "accion": "E",
                "idconcepto": "210",
                "idconceptorelacionado": "40",
                "nombretabla": "lec_lectura",
                "campo": "lec_actual",
                "liquidacion": null,
                "documento": null,
                "tipodocumento": 288,
                "acumula": "T",
                "cantidadacumula": 1
            }, {
                "accion": "E",
                "idconcepto": "96",
                "idconceptorelacionado": "40",
                "nombretabla": "lec_lectura",
                "campo": "lec_actual",
                "liquidacion": null,
                "documento": null,
                "tipodocumento": 288,
                "acumula": "T",
                "cantidadacumula": 1
            }
        ],
        "rangosconceptos": [
            {
                "accion": "E",
                "rangoinicial": "1",
                "rangofinal": "10",
                "idconcepto": "40",
                "valor": "2500",
                "formula": "a*b",
                "idconcepto": "20"
            }
        ]
    }
};


/** @namespace*/
var definicionModelo = {
    formulaHabilitada: false,
    formulaRangoHabilitada: false,
    formula: [],
    formulaRangoArray: [],
    rangosEliminar:[],
    accionConcepto: 'A',
    conceptosRelacionados: [],
    conceptosRelacionadosEliminar:[],
    tdRango: 0,
    contabilizaciones: [],
    contablizacionesEliminar:[],
    areasdenegocio:[],
    areasdenegocioEliminar:[],
    funcionesconceptos:[],
    centrosdecosto:[],
    centrosdecostoEliminar:[],
    contabilizacionesCruce:[],
    contabilizacionesCruceEliminar:[],
    contabilizacionesAnticipos:[],
    contabilizacionesAnticiposEliminar:[],
    tiposSuscripcion:[],
    colsConceptosAsociar: [
        {title: 'Seleccionar', data: null, width: '100px', render: function (data, type, full, meta) {
                var checkDataId = full.idconcepto;
                return '<input type="checkbox" id="checkConceptoRelacionado_' + checkDataId + '"/><label for="checkConceptoRelacionado_' + checkDataId + '">Seleccionar</label>';
            }
        },
        {title: 'Nombre', data: 'nombre'},
        {title: 'Alias', data: 'alias'},
        {title: 'Valor', sClass: 'td-currency', data: function (data) {
                return (data.valor === null) ? '<p>$0</p>' : ('$' + data.valor);
            }},
        {title: 'Operación', data: 'operacion'}
    ],
    tipoAcumulacion:[
        { valor:'A', nombre:'Actual' },
        { valor:'I', nombre:'Ilimitado' },
        { valor:'N', nombre:'Anterior' },
        { valor:'T', nombre:'Actual - Anterior' },
    ]
};
