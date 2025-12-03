/**
 * @fileOverview Archivo de modelo de gestión de suscripciones
 * @author AppFuture
 * @version 1.0.0
 */
/** @namespace */
var gestionarsuscripcionModelo = {};
/**
 * Formato para llenar la tabla de las propiedades asignadas a una suscripción
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
 * Formato para llenar la tabla de las propiedades que aún no han sido asignadas a una suscripción
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
 * Formato para llenar la tabla de los conceptos asignados pero no se pueden eliminar (Cuando la vista es informativa)
 * @type {Object}
 */
var formatoConceptosConsultar = {
    thead: [
        {'id': 'thIdConcepto', 'text': 'Id Concepto', 'sort': false, 'refer': 'idconcepto', 'type': 'text'},
        {'id': 'thConcepto', 'text': 'Concepto', 'sort': false, 'refer': 'concepto', 'type': 'text'},
        {'id': 'thCantidad', 'text': 'Cantidad', 'sort': false, 'refer': 'cantidad', 'type': 'text'},
        {'id': 'thValorUnitario', 'text': 'Valor Unitario', 'sort': false, 'refer': 'valorunitario', 'type': 'currency'},
        {'id': 'thValorTotal', 'text': 'Valor Total', 'sort': false, 'refer': 'valortotal', 'type': 'currency'},
        {'id': 'thFechaInicial', 'text': 'Fecha Inicial', 'sort': false, 'refer': 'fechainicio', 'type': 'text'},
        {'id': 'thFechaFinal', 'text': 'Fecha Final', 'sort': false, 'refer': 'fechafinal', 'type': 'text'}
    ]
};

var datosTabla = [
    {
        idconcepto: 'id concepto',
        tipopropiedad: 'tipo',
        idpropiedad: 'id',
        municipio: 'municipio',
        barrio: 'barrio'
    }
];
