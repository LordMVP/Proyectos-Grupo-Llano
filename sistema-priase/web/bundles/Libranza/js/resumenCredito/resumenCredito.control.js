/**
 * @fileOverview Archivo de control para consultar créditos y solicitudes de créditos
 * @author AppFuture
 * @version 1.0.0
 */

/** @namespace */
var resumenControl = {
    consultarEtapas: function (success) {
        __cnn.ajax({
            url: 'etapas/',
            completado: success
        });
    },
    consultarCredito: function(data, success){
        __cnn.ajax({
            url: 'creditos/',
            data: data,
            completado: success
        });
    },
    consultarInformacion: function(data, success){
        __cnn.ajax({
            url: 'informacion/',
            data: data,
            completado: success
        });
    },
    consultarComentarios: function(data, success){
        __cnn.ajax({
            url: 'comentarios/',
            data: data,
            completado: success
        });
    },
    consultarTerceros: function(data, success){
        __cnn.ajax({
            url: '../terceros/',
            data: data,
            completado: success
        });
    }
};