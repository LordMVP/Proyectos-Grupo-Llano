/**
 * @fileOverview Archivo de control de peticiones AJAX para el inicio de sesión de Achagua
 * @author Appfuture Group SAS
 * @requires menu.control.js
 * @version 1.0.0
 */

/** 
 * @module Menú
 */

/**
 * @namespace menuControl
 */
var menuControl = {

    
    resultado: undefined,
    obtenerMenu: function(data, success) {
        menuControl.enviarPeticion({
            'url': '/achagua/src/service/Service.php',
            'data': data,
            'completado':success
        });
    },
    obtenerNombreUsuario: function(data) {
        return menuControl.enviarPeticion({
            'url': '/achagua/src/service/Service.php',
            'async': false,
            'data': data
        });
    },
    enviarPeticion: function(args) {
        var result = undefined;
        var defecto = {
            'url': args.url,
            'data': (args.data) ? args.data : null,
            'type': (args.metodo) ? args.metodo : 'POST',
            'async': (args.async !== null || args.async !== undefined) ? args.async : true,
            'dataType': (args.tipo) ? args.tipo : 'json',
            'success': (args.async !== undefined && args.async === false) ? function(data) {
                result = data;
            } : args.completado,
            'error': (args.error) ? args.error : this.capturarError//,
            //'beforeSend': (!args.background) ? console.log("procesando menu") : null
        };
        $.ajax(defecto);
        return result;
    }
};