/**
 * @fileOverview Archivo de modelo del proceso que cierra suspensiones y reconexiones
 * @namespace procesoCierreModel
 * @author AppFuture
 * @version 1.0.0
 */
var procesoCierreModel={
    idMotivoSuspension:null
};
/**
 * Formato para cargar las suspensiones y reconexiones que no pasaron al siguiente período
 * @type {Object}
 */
var formatoErrores = {
    thead: [
        {'id': 'thMunicipio', 'text': 'Municipio', 'refer': 'municipio', 'type': 'text'},
        {'id': 'thCantidad', 'text': 'Cant. errores', 'refer': 'recgeneradas', 'type': 'text'}
    ]
};
/**
 * Formato para cargar las suspensiones y reconexiones que fueron cerradas en el períodod actual y quedaron en el siguiente
 * @type {Object}
 */
var formatoGeneradas = {
    thead: [
        {'id': 'thMunicipio', 'text': 'Municipio', 'refer': 'municipio', 'type': 'text'},
        {'id': 'thCantidad', 'text': 'Cant. generadas', 'refer': 'recgeneradas', 'type': 'text'}
    ]
};
