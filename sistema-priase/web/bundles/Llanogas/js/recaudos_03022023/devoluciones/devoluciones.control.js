/**
* @fileOverview Archivo de control de Devoluciones
* @author svanegas
* @requires recaudos.js
* @requires abonos.modelo.js
* @version 1.0.0
*/

/** @namespace */
var devolucionesControl = {

	/**
	 * Consulta las suscripciones de acuerdo a los parámetros de suscripcion, codanterior o documento
	 * @param  {Object} data       El objeto con la información de la consulta
	 * @param  {Function} completado Función de callback que se invoca cuando responde el servidor
	 * @returns {void}
	 */
	consultarSuscriptor:function(data, completado){
		__cnn.ajax({
			url:'suscripciones/',
			data:data,
			completado:completado
		});
	},

	/**
	 * Consulta las devoluciones de una suscripción específica
	 * @param  {Object} data       el objeto con la propiedad idsuscripcion
	 * @param  {Function} completado Función de callback que carga la información de las devoluciones de la suscripción
	 * @returns {void}
	 */
	consultarDevoluciones:function(data, completado){
		__cnn.ajax({
			url:'cargar/devoluciones',
			data:data,
			completado:completado
		});	
	},

    /**
	 * Consulta los detalles del recado o factura según el proceso necesitado
     * @param {Object} data - Información enviada al servidor (idrecaudofactura)
     * @param {Function} completado - Función que recibe la información y muestra al usuario
     */
	consultarDetalles:function(data, completado){
		__cnn.ajax({
			url:'detallerecaudofactura/',
			data:data,
			completado:completado
		});
	},
    /**
	 * Guarda la información de la devolución realizada
     * @param {Object} data - Información detallada de la devolución (devoluciones, idmotivo, comentario, idsuscripcion)
     * @param {Function} completado - Función que verifica que todo se haya realizado correctamente
     */
	grabarDevolucion:function(data, completado){
		__cnn.ajax({
			url:'grabar/',
			data:data,
			completado:completado
		});
	}
	

};