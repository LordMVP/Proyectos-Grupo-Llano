/**
* @fileOverview Archivo de control de flujo de aprobación de una venta
* @author angelicaGomez
* @requires aprobarventa.modelo.js
* @version 1.0.0
*/

/** @namespace */
var aprobarControl ={

    /** Consulta agenda para programar una venta.
     * @param  {object} data - Los parámetros que se envían al servidor (idventa)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor (aprobarVista.consultarAgendaCompleto)
     * @returns {void}
     */
    consultarAgenda: function(data, completado) {
        __cnn.ajax({
            'url': 'agendas/',
            'data': data,
            'completado': completado
        });
    },
    /** Consulta agenda para programar una venta.
     * @param  {object} data - Los parámetros que se envían al servidor (idventa)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor (aprobarVista.consultarAgendaCompleto)
     * @returns {void}
     */
    grabarAprobarEliminar: function(data, completado) {
        __cnn.ajax({
            'url': 'aprobar/',
            'data': data,
            'completado': completado,
            modal:true
        });
    },
    /**
     * Consulta una agenda en las agendas guardadas en el modelo segùn el id enviado
     * @param {number} id Id de la agenda buscada
     * @returns {Object} Información de la agenda
     */

    consultarAgendaPorId: function(id){
        for(var a = 0; a < aprobarModelo.agenda.length; a++ ){
            agenda = aprobarModelo.agenda[a];
            if(agenda.idagenda == id){
                return agenda;
            }
        }
    },
    
     consultaHistoricos: function(data, completado) {
        __cnn.ajax({
            'url': 'consulta_historico_venta/',
            'data': data,
            'completado': completado,
            modal:true
        });
    }
};