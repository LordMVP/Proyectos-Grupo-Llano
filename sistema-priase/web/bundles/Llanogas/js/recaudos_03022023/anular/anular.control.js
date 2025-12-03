/**
* @fileOverview Archivo de control de anular Recaudo
* @author AppFuture
* @requires modelo.js
* @version 1.0.0
*/

/** @namespace */
var anularControl = {
    /**
     * Consulta los recaudos que coincidan con los parámetros de búsquedas.
     * @param  {object} data - Parámetros que se envían al servidor (idRegistro,idSuscripcion,
     * idSuscriptor, fechainicio, fechafin)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor (anularVista.onFiltrarCompleto)
     * @returns {void}
     */
    consultarRecaudos: function (data, completado){
        __cnn.ajax({
            'url':'buscar_recaudos',
            'data':data,
            'completado':completado
        });
    },    
    /**
     * Consulta los detalles de un recaudo por su id
     * @param  {object} data - Parámetros que se envían al servidor (idrecaudo)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor (anularVista.onCargarDetallesCompleto)
     * @returns {void}
     */
    consultarDetallesRecaudo:function(data, completado){
        __cnn.ajax({
            'url':'informacion_recaudos',
            'data':data,
            'completado':completado
        });
    },
    /**
     * Solicita la anulación del recaudo seleccionado
     * @param  {object} data - Los parámetros que se envían al servidor (idRecaudo,idMotivo, comentario, idSuscripcion)
     * @param  {function} completado - Función invocada cuando cargan datos desde 
     * servidor (anularVista.onAnularCompleto)
     * @returns {void}
     */
    confirmarAnulacion:function(data, completado){
        __cnn.ajax({
            'url':'registrar_anulacion',
            'data':data,
            'completado':completado
        });
    }
};