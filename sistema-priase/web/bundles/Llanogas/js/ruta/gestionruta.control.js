/**
 * @fileOverview Archivo de control gestionruta
 * @author oabaquero
 * @requires gestionruta.modelo.js
 * @version 1.0.0
 */

/** @namespace */

var gestionrutaControl = {

    buscarMunicipiosNuevo: function (success) {
        __cnn.ajax({
            url: 'busca_municipios_nuevo/',
            completado: success
        });
    },

    buscarRutas: function (data, completado) {
        __cnn.ajax({
            'url': 'buscar_rutas/',
            'data': data,
            'completado': completado
        });
    },

    buscaMunicipiosBarrios: function (data, completado) {
        __cnn.ajax({
            'url': 'busca_MunicipiosBarrios/',
            'data': data,
            'completado': completado
        });
    },
    
    consultaPeriodoVencimiento: function (data, completado) {
        __cnn.ajax({
            'url': 'consulta_periodoVencimiento/',
            'data': data,
            'completado': completado
        });
    },
     grabarRuta: function (data, completado){
         __cnn.ajax({
            'url': 'grabar_rutas_gestion/',
            'data': data,
            'completado': completado
        });
     },
     
     actualizaRutaPeriodosFechas: function (data, completado){
         __cnn.ajax({
            'url': 'actualiza_ruta_periodos_fechas/',
            'data': data,
            'completado': completado
        });
     }

};