/**
 * @fileoverview Archivo de modelo para el proceso de aplica
 * @namespace aplicarModel
 */
var aplicarModel={
    idMotivoSuspension:null
};
/**
 * Formato para cargar el resumen del proceso según el municipio
 * @type {Object}
 */
var formatoResumen = {
	thead: [
		{'id':'thMunicipio', 'text':'Municipio', 'sort':false, 'refer':'municipio', 'type':'text'}, 
		{'id':'thProcesados', 'text':'Cant. procesados', 'sort':false, 'refer':'numerosuscripciones', 'type':'text'}, 
		{'id':'thMensaje', 'text':'Mensaje', 'sort':false, 'refer':'mensaje', 'type':'text'} 
	]
};