/**
 * @fileOverview Archivo de modelo para gestionar liquidación
 * @author jeissonBarriga
 * @version 1.0.0
 */
var gestionarliquidacionModelo = {
    municipiosOriginales: []
};

/**
 * Columnas para generar tabla de conceptos de una liquidación
 * @type {Object}
 */
var formatoConceptos = {
    thead: [
        {'id': 'thSeleccionar', 'text': 'Seleccionar', 'sort': false, 'refer': 'idconcepto', 'type': 'check'},
        {'id': 'thConcepto', 'text': 'Concepto', 'sort': false, 'refer': 'concepto', 'type': 'text'},
        {'id': 'thImprimir', 'text': 'Imprimir', 'sort': false, 'refer': 'imprimir', 'type': 'text'}
    ]
};
/**
 * Columnas para generar tabla de municipios vinculados a una liquidación
 * @type {Object}
 */
var formatoMunicipios = {
    thead: [
        {'id': 'thSeleccionar', 'sort': false, 'refer': 'idmunicipio', 'type': 'check', 'valueField': 'idregistroconcepto'},
        {'id': 'thMunicipio', 'text': 'Municipio Vinculado', 'sort': false, 'refer': 'municipio', 'type': 'text'}
    ]
};
/**
 * Columnas para generar tabla de tipos de uso vinculados de una liquidación
 * @type {Object}
 */
var formatoTiposUso = {
    thead: [
        {'id': 'thSeleccionar', 'sort': false, 'refer': 'idtipouso', 'type': 'check', 'valueField': 'idregistroconcepto'},
        {'id': 'thTiposUso', 'text': 'Tipo Uso Vinculado', 'sort': false, 'refer': 'tipouso', 'type': 'text'}
    ]
};
/**
 * Columnas para generar tabla de liquidaciones especiales 
 * @type {Object}
 */
var formatoLiquidacionesEspeciales = {
    thead: [
        {'id': 'thSeleccionar', 'sort': false, 'refer': 'idtipouso', 'type': 'check'},
        {'id': 'thCodigoSuscripcion', 'text': 'Cód. Suscripción', 'sort': false, 'refer': 'idsuscripcion', 'type': 'text'},
        {'id': 'thMunicipio', 'text': 'Municipio', 'sort': false, 'refer': 'municipio', 'type': 'text'},
        {'id': 'thTipoUso', 'text': 'Tipo Uso', 'sort': false, 'refer': 'tipouso', 'type': 'text'},
        {'id': 'thEstrato', 'text': 'Estrato', 'sort': false, 'refer': 'estrato', 'type': 'text'},
        {'id': 'thBarrio', 'text': 'Barrio', 'sort': false, 'refer': 'barrio', 'type': 'text'},
        {'id': 'thValorLimite', 'text': 'Vlr. Límite', 'sort': false, 'refer': 'valorlimite', 'type': 'text'}
    ]
};
/**
 * Formato para mostrar los municipios seleccionables
 * @type {Object}
 */
var formatoMunicipiosParaSelecionar = {
    thead: [
        {'id': 'thSeleccionar', 'sort': false, 'refer': 'idmunicipio', 'type': 'check'},
        {'id': 'thMunicipio', 'text': 'Municipio', 'sort': false, 'refer': 'municipio', 'type': 'text'}
    ]
};