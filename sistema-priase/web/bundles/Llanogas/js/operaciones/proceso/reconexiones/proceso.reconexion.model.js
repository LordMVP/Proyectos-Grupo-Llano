/**
 * @fileOverview Archivo de modelo del proceso que genera reconexiones
 * @author AppFuture
 * @version 1.0.0
 * @namespace procesoReconexionModel
 */
var procesoReconexionModel={
    idMotivoReconexion:null
};
/**
 * Formato para llenar la tabla de los tipos de uso de una empresa
 * @type {Object}
 */
var formatoTiposDeUso = {
    thead: [
        {'id': 'thSeleccionar', 'text': 'Seleccionar', 'refer': 'idtipouso', 'type': 'check'},
        {'id': 'thTipoUso', 'text': 'Tipo uso', 'refer': 'tipouso', 'type': 'text'}
    ]
};
/**
 * Formato para cargar los "errores" y/o las generadas del proceso de generar reconexiones
 * @type {Object}
 */
var formatoErrores = {
    thead: [
        {'id': 'thMunicipio', 'text': 'Municipio', 'refer': 'municipio', 'type': 'text'},
        {'id': 'thCantidad', 'text': 'Cant. canceladas', 'refer': 'recgeneradas', 'type': 'text'}
    ]
};
/**
 * Formato para cargar la cantidad de reconexiones que fueron generadas por municipios
 * @type {Object}
 */
var formatoGeneradas = {
    thead: [
        {'id': 'thMunicipio', 'text': 'Municipio', 'refer': 'municipio', 'type': 'text'},
        {'id': 'thCantidad', 'text': 'Cant. generadas', 'refer': 'recgeneradas', 'type': 'text'}
    ]
};


/**
 * Formato para cargar los municipios de la empresa
 * @type {Object}
 */
var formatoMunicipios = {
    thead: [
        {'id': 'thIdmunicipio', 'text': 'Seleccionar', 'refer': 'idmunicipio', 'type': 'check'},
        {'id': 'thNombreMunicipio', 'text': 'Municipio', 'refer': 'municipio', 'type': 'text'}
    ]
};
