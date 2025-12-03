/**
 * @fileOverview Archivo de modelo del proceso que genera suspensiones
 * @author AppFuture
 * @version 1.0.0
 * @namespace procesoSuspensionModel
 */
var procesoSuspensionModel = {
    idMotivoSuspension: null
};
/**
 * Formato que muestra los inconvenientes del proceso según municipio
 * @type {Object}
 */
var formatoErrores = {
    thead: [
        {'id': 'thMunicipio', 'text': 'Municipio', 'refer': 'municipio', 'type': 'text', 'refer': 'idmunicipio'},
        {'id': 'thCantidad', 'text': 'Cant. errores', 'refer': 'cantidad', 'type': 'text'}
    ]
};
/**
 * Formato que muestra la cantidad de suspensiones generadas por municipio
 * @type {Object}
 */
var formatoGeneradas = {
    thead: [
        {'id': 'thMunicipio', 'text': 'Municipio', 'refer': 'municipio', 'type': 'text'},
        {'id': 'thCantidad', 'text': 'Cant. generadas', 'refer': 'susgeneradas', 'type': 'text'}
    ]
};
/**
 * Formato para cargar los tipos de uso de la empresa
 * @type {Object}
 */
var formatoTipoUso = {
    thead: [
        {'id': 'thIdTipoUso', 'text': 'Seleccionar', 'refer': 'idtipouso', 'type': 'check'},
        {'id': 'thNombreTipoUso', 'text': 'Tipo de suscripción', 'refer': 'tipouso', 'type': 'text'}
    ]
};


/**
 * Formato para cargar los tipos de uso de la empresa
 * @type {Object}
 */
var formatoMunicipios = {
    thead: [
        {'id': 'thIdmunicipio', 'text': 'Seleccionar', 'refer': 'idmunicipio', 'type': 'check'},
        {'id': 'thNombreMunicipio', 'text': 'Municipio', 'refer': 'municipio', 'type': 'text'}
    ]
};