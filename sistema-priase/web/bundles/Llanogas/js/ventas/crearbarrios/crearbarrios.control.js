/**
 * @fileOverview Archivo de vista de crear barrios
 * @author Oscar Baquero
 * @requires crearBarrios.model.js
 * @version 1.0.0
 */

/** @namespace */

var crearBarriosControl = {
    /**
     * Consulta barrios x empresa 
     * @param  {object} data - Parámetros que se envían al servidor (idmunicipio,idcodigo)
     * @param  {function} completado - envoco (registroBarriosVista.onConsultarBarrio)
     * @returns {void}
     */
    consultarBarrios: function (data, completado) {
        __cnn.ajax({
            'url': '../consulta_barrio/',
            'data': data,
            'completado': completado
        });
    },
    
    grabarBarrio: function (data, completado){
        __cnn.ajax({
            'url': '../grabar_barrio/',
            'data': data,
            'completado': completado
        });
    },
    
    consultarRutasVinculadas: function (data, completado){
        __cnn.ajax({
            'url': '../rutas_vinculadas/',
            'data': data,
            'completado': completado
        });
    },
    validaRutasVinculadas: function(id){
        
        for (var i = 0; i < crearBarriosModel.rutasVinculadas.length; i++) {
            if(crearBarriosModel.rutasVinculadas[i].idruta == id){
                return true;
            }
        }    
        return false;
    },
    
    buscaRutasMunicipio: function (data, completado){
         __cnn.ajax({
            'url': '../rutas_municipio/',
            'data': data,
            'completado': completado
        });
    },
    consultarConsecutivo: function (data, completado) {
        __cnn.ajax({
            'url': '../consulta_consecutivo/',
            'data': data,
            'completado': completado
        });
    }
};