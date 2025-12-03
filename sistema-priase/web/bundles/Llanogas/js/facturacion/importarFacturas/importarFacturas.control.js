/**
* @fileOverview Archivo de control para importar facturas
* @author angelicaGomez
* @requires importarFacturas.modelo.js
* @version 1.0.0
*/

/** @namespace */
var importarFacturasControl = {
	
	cargarArchivo : function(completado){
		__cnn.ajax({
            url:'cargar_archivos/',
            completado: completado
        });
	},
        /**
     * Consulta el progreso de la subida de los recaudos
     * @param {Function} success - Función que recibe la información enviada por el servidor
     */
    consultarProgreso: function (success) {
        __cnn.ajax({
            url: 'progreso/',
            completado: success
        });
    },
    /**
     * Consulta el resumen final de los recaudos subidos en el servidor
     * @param {Function} success - Función que recibe la información enviada por el servidor
     */
    consultarResumen: function (success) {
        __cnn.ajax({
            url: 'resumen/',
            completado: success
        });
    },
    cancelaImportacion: function (success) {
        __cnn.ajax({
            url: 'cancelar_importacion/',
            completado: success
        });
    }
};

