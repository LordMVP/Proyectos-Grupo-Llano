/**
 * @fileOverview Archivo de modelo para modificación de suscripción
 * @author AppFuture
 * @version 1.0.0
 */
/** @namespace */
var modificarsuscripcionModelo = {};

/**
 * Formato para llenar la tabla de propiedades asignadas a la suscripción
 * @type {Object}
 */
var formatoPropiedadesAsignadas = {
    thead: [
        {'id': 'thTipoPropiedad', 'text': 'Tipo Propiedad', 'sort': false, 'refer': 'tipopropiedad', 'type': 'text'},
        {'id': 'thIdPropiedad', 'text': 'Id Propiedad', 'sort': false, 'refer': 'idpropiedad', 'type': 'text'},
        {'id': 'thMunicipio', 'text': 'Municipio', 'sort': false, 'refer': 'municipio', 'type': 'text'},
        {'id': 'thBarrio', 'text': 'Barrio', 'sort': false, 'refer': 'barrio', 'type': 'text'},
        {'id': 'thDireccion', 'text': 'Dirección', 'sort': false, 'refer': 'direccion', 'type': 'text'},
        {'id': 'thIdSuscripcion', 'text': 'Id Suscripción', 'sort': false, 'refer': 'idsuscripcion', 'type': 'text'},
        {'id': 'thCodigoAnterior', 'text': 'Código Anterior', 'sort': false, 'refer': 'codigoanterior', 'type': 'text'}
    ]
};
/**
 * Formato para llenar la tabla de propiedades del tercero que no se han asignado a ninguna suscripción
 * @type {Object}
 */
var formatoPropiedadesSinAsignar = {
    thead: [
        {'id': 'thSeleccionar', 'sort': false, 'refer': 'idpropiedad', 'type': 'radio'},
        {'id': 'thTipoPropiedad', 'text': 'Tipo Propiedad', 'sort': false, 'refer': 'tipopropiedad', 'type': 'text'},
        {'id': 'thIdPropiedad', 'text': 'Id Propiedad', 'sort': false, 'refer': 'idpropiedad', 'type': 'text'},
        {'id': 'thMunicipio', 'text': 'Municipio', 'sort': false, 'refer': 'municipio', 'type': 'text'},
        {'id': 'thBarrio', 'text': 'Barrio', 'sort': false, 'refer': 'barrio', 'type': 'text'},
        {'id': 'thDireccion', 'text': 'Dirección', 'sort': false, 'refer': 'direccion', 'type': 'text'},
        {'id': 'thDescripcion', 'text': 'Descripción', 'sort': false, 'refer': 'descripcion', 'type': 'text'}
    ]
};

/**
 * Formato para llenar la tabla de conceptos
 * @type {Object}
 */
var formatoConceptos = {
    thead: [
        {'id': 'thIdConcepto', 'text': 'Id Concepto', 'sort': false, 'refer': 'idconcepto', 'type': 'text'},
        {'id': 'thConcepto', 'text': 'Concepto', 'sort': false, 'refer': 'concepto', 'type': 'text'},
        {'id': 'thCantidad', 'text': 'Cantidad', 'sort': false, 'refer': 'cantidad', 'type': 'text'},
        {'id': 'thValorUnitario', 'text': 'Valor Unitario', 'sort': false, 'refer': 'valorunitario', 'type': 'text'},
        {'id': 'thValorTotal', 'text': 'Valor Total', 'sort': false, 'refer': 'valortotal', 'type': 'text'},
        {'id': 'thFechaInicial', 'text': 'Fecha Inicial', 'sort': false, 'refer': 'fechainicio', 'type': 'text'},
        {'id': 'thFechaFinal', 'text': 'Fecha Final', 'sort': false, 'refer': 'fechafinal', 'type': 'text'},
        {'id': 'thEditar', 'text': 'Editar', 'sort': false, 'type': 'button', 'style': {'width': '10%'}},
        {'id': 'thEliminar', 'text': 'Eliminar', 'sort': false, 'type': 'button', 'style': {'width': '10%'}}
    ]
};

/**
 * @deprecated
 * @type {Array}
 */
var datosTabla = [
    {
        idconcepto: 'id concepto',
        tipopropiedad: 'tipo',
        idpropiedad: 'id',
        municipio: 'municipio',
        barrio: 'barrio'
    }
];

/**
 * Formato que llena la tabla Linea Matriz
 * @type {Object}
 */
var formatolineaMatriz = {
    thead: [
        {'id': 'thSuscripcionesVinculadas', 'text': 'Suscripciones Vinculadas', 'sort': false, 'refer': 'suscripcionesvinculadas', 'type': 'text'},
        {'id': 'thPorcentaje', 'text': 'Porcentaje', 'sort': false, 'refer': 'porcentaje', 'type': 'text'},
        {'id': 'thSeleccion', 'text': 'Seleccione', 'sort': false, 'refer': 'idsuscripcion', 'type': 'check'},
    ]
};
/**
 * Formato que llena la tabla Linea Matriz
 * @type {Object}
 */
var formatoBuscaClienteVincular = {
    thead: [
        {'id': 'thSelector', 'text': 'Seleccionar', 'sort': false, 'refer': 'idesuscripcion', 'type': 'radio'},
        {'id': 'thSuscripcionesVinculadas', 'text': 'Suscripciones', 'sort': false, 'refer': 'idesuscripcion', 'type': 'text'},
        {'id': 'thSuscripcion', 'text': 'Suscripcion', 'sort': false, 'refer': 'suscripcion', 'type': 'text'}
    ]
};
