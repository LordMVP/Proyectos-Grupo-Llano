/**
 * @fileOverview Archivo de modelo de registrar rápido suspensiones y reconexiones
 * @author AppFuture
 * @version 1.0.0
 */
/** @namespace */
var registroModelo = {
    suspensiones:[],
    reconexiones:[],
    conceptosEliminados: [],
    tempWidth:{}  
};

/**
 * Formato para llenar la tabla de suscripciones
 * @type {Object}
 */
var formatoSuscripcion = {
    thead: [
        {'id': 'thIdSuscripcion', 'text': 'Id Suscripción', 'sort': false, 'refer': 'idsuscripcion', 'type': 'text'},
        {'id': 'thCodAnterior', 'text': 'Cód Anterior', 'sort': false, 'refer': 'codanterior', 'type': 'text'},
        {'id': 'thIdPropiedad', 'text': 'Id Propiedad', 'sort': false, 'refer': 'idpropiedad', 'type': 'text'},
        {'id': 'thTipoPropiedad', 'text': 'Tipo Propiedad', 'sort': false, 'refer': 'tipopropiedad', 'type': 'text'},
        {'id': 'thDireccion', 'text': 'Dirección', 'sort': false, 'refer': 'direccion', 'type': 'text'},
        {'id': 'thNovedad', 'text': 'Novedad', 'sort': false, 'refer': 'novedad', 'type': 'select'},
        {'id': 'thTercero', 'text': 'Tercero que ejecuta', 'sort': false, 'refer': 'tercero', 'type': 'text'},
        {'id': 'thTipo', 'text': 'Tipo', 'sort': false, 'refer': 'tipo', 'type': 'select'},
        {'id': 'thObservacion', 'text': 'Observación', 'sort': false, 'refer': 'observacion', 'type': 'radio'},
        {'id': 'thLectura', 'text': 'Lectura', 'sort': false, 'refer': 'lectura', 'type': 'input'},
        {'id': 'thTiempo', 'text': 'Hora', 'sort': false, 'refer': 'hora', 'type': 'input'},
        {'id': 'thEstado', 'text': 'Estado', 'sort': false, 'refer': 'estado', 'type': 'select', 'html': '<option></option>'},
        {'id': 'thConcepto', 'text': 'Concepto', 'sort': false, 'refer': 'concepto', 'type': 'input'}
    ]
};
/**
 * Formato para llenar la tabla de suspensiones
 * @type {Object}
 */
var formatoSuspension =[
    { "title": "Suscripción", data: 'idsuscripcion' },
    { "title": "Suspensión", data: "idsuspension" },
    { "title": "Secuencia de la ruta", data: "secuencia" },
    { "title": "Código anterior", data: "codigoanterior" },
    { "title": "Medidor", data: "medidor" },
    { "title": "Dirección", data: "direccion" , 'orderable': false },
    { "title": "Estado", data: "estado"},
    { "title": "Fecha de programación", data: "fechaprogramacion" },
    { "title": "Fecha de ejecución", data: "fechaejecucion", 'orderable': false},
    { "title": "Lectura", data: "lectura", 'orderable': false },
    { "title": "Observación", data: "observacion", 'orderable': false },
    { "title": "Novedad", data: "idnovedad", 'orderable': false },
    { "title": "Tipo de suspensión", data: "idtiposuspension", 'orderable': false },
    { "title": "Tercero ejecuta", data: "tercero", 'orderable': false },
    { "title": "Realizada", data: "realizada", 'orderable': false, 'autoWidth': false },
    { "title": "Valor total", data: "valortotal.toString().toCurrency()"}
];
/**
 * Formato para llenar la tabla de reconexiones
 * @type {Object}
 */
var formatoReconexion =[
    { "title": "Suscripción", data: 'idsuscripcion' },
    { "title": "Reconexión", data: "idreconexion" },
    { "title": "Secuencia de la ruta", data: "secuencia" },
    { "title": "Código anterior", data: "codigoanterior" },
    { "title": "Medidor", data: "medidor" },
    { "title": "Dirección", data: "direccion" , 'orderable': false },
    { "title": "Estado", data: "estado"},
    { "title": "Fecha de programación", data: "fechaprogramacion" },
    { "title": "Fecha de ejecución", data: "fechaejecucion", 'orderable': false},
    { "title": "Lectura", data: "lectura", 'orderable': false },
    { "title": "Observación", data: "observacion", 'orderable': false },
    { "title": "Novedad", data: "idnovedad", 'orderable': false },
    { "title": "Tercero ejecuta", data: "tercero", 'orderable': false },
    { "title": "Realizada", data: "realizada", 'orderable': false, 'autoWidth': false }, 
    { "title": "Valor total", data: "valortotal.toString().toCurrency()"}
];




