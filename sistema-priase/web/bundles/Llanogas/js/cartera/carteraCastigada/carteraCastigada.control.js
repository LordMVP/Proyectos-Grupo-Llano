/**
* @fileOverview Archivo de control de cartera castigada
* @author angelicaGomez
* @requires carteraCastigada.modelo.js
* @version 1.0.0
*/

/** @namespace */
var carteraControl ={
    /** Inicia proceso de castigar cartera
     * @param  {object} data - Los parámetros que se envían al servidor (idciclo)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor (carteraVista.onProcesarCompleto)
     * @returns {void}
     */
    procesarCartera: function(data, completado) {
        __cnn.ajax({
            'url': 'ejecutar/', 
            'data': data,
            'completado': completado
        });
    }, 


    /**
     * Consulta en el servidor el estado del progreso de la aplicación de la cartera
     * @param  {function} success Función de callback que se ejecuta cuando se completa la petición
     * @returns {void}
     */
    consultarProgreso: function(success){
        __cnn.ajax({
           'url': 'progreso/programa/', //ejecutarlo cada tanto tiempo para verificar el estado de la ejecución del proceso.
           completado: success
        });
    },

    /**
     * Consulta en el servidor el resultado de la ejecución del proceso
     * @param  {function} success Función de callback que se ejecuta cuando se completa la petición
     * @returns {void}
     */
    consultarResumenProceso:function(success){
        __cnn.ajax({
           'url': 'progreso/', //ejecutarlo al final del proceso, este muestra el resumen.
           completado: success
        });
    }
        
};
