/**
 * @fileOverview Archivo de modelo gestionRutaModel
 * @author oabaquero
 * @version 1.0.0
 */
/** @namespace */
var gestionrutaModel = {
    idRuta: [], update: [], insert: [], rutas: [], periodoVencimiento: [], periodoRutas:[], rutasCiclo: [], periodoReplicar:[], rutasReplicar:[]
};

var formatoRutasBarrios = {
    thead: [

        {'id': 'thMunicipio', 'text': 'Municipio', 'sort': false, 'refer': 'municipio', 'type': 'text'},
        {'id': 'thBarrio', 'text': 'Nombre Barrio', 'sort': false, 'refer': 'barrio', 'type': 'text'}
    ]
};

var formatoRutas = {
    thead: [
        {'id': 'thSelector', 'text': '', 'sort': false, 'refer': null, 'type': 'radio'},
        {'id': 'thCodigo', 'text': 'Código Ruta', 'sort': false, 'refer': 'idruta', 'type': 'text'},
        {'id': 'thNombre', 'text': 'Nombre Ruta', 'sort': false, 'refer': 'nomruta', 'type': 'text'}
    ]
};

var formatoPeriodoVencimiento = {
    thead: [
        {'id': 'thIdCodigo', 'text': 'Código Periodo', 'sort': false, 'refer': 'idperiodo', 'type': 'text'},
        {'id': 'thPeriodo', 'text': 'Nombre Periodo', 'sort': false, 'refer': 'nombre', 'type': 'text'},
        {'id': 'thFechaIni', 'text': 'Fecha Inicial', 'sort': false, 'refer': 'fecinicial', 'type': 'input'},
        {'id': 'thFechaFin', 'text': 'Fecha Final', 'sort': false, 'refer': 'fecfinal', 'type': 'input'},
        {'id': 'thFechaVencimiento', 'text': 'Fecha Vencimiento', 'sort': false, 'refer': 'fecvencimiento', 'type': 'input', 'style': {'width': '3%'}},
        {'id': 'thFechaSS', 'text': 'Fecha Suspencion', 'sort': false, 'refer': 'fecsuspension', 'type': 'input', 'style': {'width': '3%'}}
    ]
};

var formatoPeriodo = {
    thead: [
        {'id': 'thSelector', 'text': '', 'sort': false, 'refer': 'idperiodo', 'type': 'check'},
        {'id': 'thPeriodo', 'text': 'Nombre Periodo', 'sort': false, 'refer': 'nombre', 'type': 'text'}
    ]
};

var formatoRutasPeriodo = {
    thead: [
        {'id': 'thSelector', 'text': '', 'sort': false, 'refer': 'idruta', 'type': 'check'},
        {'id': 'thPeriodo', 'text': 'Nombre Ruta', 'sort': false, 'refer': 'nombre', 'type': 'text'}
    ]
};
