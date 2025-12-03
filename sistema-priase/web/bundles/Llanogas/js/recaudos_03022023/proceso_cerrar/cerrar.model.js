/** @namespace */
var cerrarModel={
    idMotivoSuspension:null
};
/**
 * Formato para llenar la tabla de resumen del proceso de cierre de recaudos
 * @type {Object}
 */
var formatoResumen = {
	thead: [
		{'id':'thMunicipio', 'text':'Municipio', 'sort':false, 'refer':'municipio', 'type':'text'}, 
		{'id':'thProcesados', 'text':'Cant. procesados', 'sort':false, 'refer':'numerosuscripciones', 'type':'text'}, 
		{'id':'thMensaje', 'text':'Mensaje', 'sort':false, 'refer':'mensaje', 'type':'text'} 
	]
};