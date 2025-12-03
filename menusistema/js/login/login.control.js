/**
 * @fileOverview Archivo de control de peticiones AJAX para el inicio de sesión de Achagua
 * @author Appfuture Group SAS
 * @requires login.model.js
 * @version 1.0.0
 */

/** 
 * @module Login 
 */

/**
 * @namespace loginControl
 */
var loginControl = {

    /**
     * Envía una petición AJAX a Service.php para obtener la información del usuario. 
     * @data  {Objecto} data Un objeto de la forma: {i: '1', usuario:'', contrasena:'', empresa:'' }
     * @returns {Object}      Retorna el objeto con el usuario autenticado o error
     */
    obtenerLogin: function (data) {
        return loginControl.enviarPeticion({
            'url': 'src/service/Service.php',
            'async': false,
            'data': data
        });
    },

    /**
     * Envía una petición AJAX a Service.php para obtener la lista de empresas.
     * @data  {Objecto} data Un objeto de la forma: {i: '2'}
     * @returns {Object}      Retorna el objeto con la lista de empresas
     */
    obtenerEmpresas: function (data) {
        return loginControl.enviarPeticion({
            'url': 'src/service/Service.php',
            'async': false,
            'data': data
        });
    },

    /**
     * Envía una petición AJAX a Service.php para consultar si el usuario ha iniciado sesión.
     * @data  {Objecto} data Un objeto de la forma: {i: '-2'}
     * @returns {Object}      Retorna el objeto con la propiedad idacceso de tipo numérico.
     */
    obtenerUsuarioSesion: function (data) {
        return loginControl.enviarPeticion({
            'url': 'src/service/Service.php',
            'async': false,
            'data': data
        });
    },

    /**
     * Envía una petición AJAX a Service.php para cerrar la sesión del usuario.
     * @data  {Objecto} data Un objeto de la forma: {i: '-1'}
     * @returns {Object}      Retorna el objeto con la propiedad confirmaSalida de tipo numérico.
     */
    cerrarSesion: function (data) {
        return loginControl.enviarPeticion({
            'url': 'src/service/Service.php',
            'async': false,
            'data': data
        });
    },

    /**
     * Envía una petición AJAX con la configuración especificada.
     * @param  {Object} args Un objeto con la configuración de AJAX
     * @example
     *  loginControl.enviarPeticion({
     *      url:'src/service/test.php',
     *      data': (args.data) ? args.data : null,
     *      type': (args.metodo) ? args.metodo : 'POST',
     *      dataType': 'json',
     *      success': onSuccess,
     *      error': onError,
     *      beforeSend': onBeforeSend,
     *  });
     * @returns {void|object}      En caso de ser petición asincrona, se ejecuta el callback especificado en la opción success, de lo contrario se retorna un objeto con la respuesta del servidor.
     */
    enviarPeticion: function (args) {
        var result = undefined;
        var defecto = {
            'url': args.url,
            'data': (args.data) ? args.data : null,
            'type': (args.metodo) ? args.metodo : 'POST',
            'async': (args.async !== null || args.async !== undefined) ? args.async : true,
            'dataType': (args.tipo) ? args.tipo : 'json',
            'success': (args.async !== undefined && args.async === false) ? function (data) {
                result = data;
            } : args.completado,
            'error': (args.error) ? args.error : this.capturarError,
            'beforeSend': (!args.background) ? console.log("procesando menu") : null
        };
        $.ajax(defecto);
        return result;
    }
};

