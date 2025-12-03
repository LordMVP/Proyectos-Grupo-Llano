/**
 * Objeto del prototipo DOM para el control de eventos y funciones de la interfaz
 * @type {Dom}
 */
var dom = new Dom();

/**
 * @fileOverview Archivo de control de la interfaz de inicio de sesión.
 * @author Appfuture Group SAS
 * @requires login.modelo.js
 * @requires @see login.control.js
 * @version 1.0.0
 */


/** @module Login */

/** 
 * @namespace loginVista
 */
var loginVista = {

    /**
     * Inicializa los eventos y comportamientos de la interfaz gráfica.
     * @return {void}
     */
    init: function () {
        window.sessionStorage.clear();
        window.onresize = dom.ajustarContenido;
        loginVista.obtenerUsuarioEnSesion();
        $('#login_btn').on('click', this.irHome);
        loginVista.obtenerEmpresas();
    },

    /**
     * Valida las credenciales del usuario y en caso de ser válidas, redirecciona a home.html. 
     * En caso de error al iniciar sesión, muestra mensaje de error.
     * @return {void}
     */
    irHome: function () {
        if ($('#nit_txt').val() !== '' && $('#contrasena_txt').val() !== '' && $('#empresa_txt').val() !== "0") {
            var encript = $().crypt({
                method: 'md5',
                source: $('#contrasena_txt').val()
            });
            var data = {
                i: '1',
                usuario: $('#nit_txt').val(),
                contrasena: encript,
                empresa: $('#empresa_txt').val()
            };
            var result = loginControl.obtenerLogin(data);
            if (result.usuario !== undefined && result.idAcceso > 0) {
                sessionStorage.setItem('empresa', $('#empresa_txt option:selected').text());
                sessionStorage.setItem('logoEmpresa', result.logo);
                var tokenEncriptado = CryptoJS.AES.encrypt(result.token, CONFIGURACION.CLAVE_ENCRIPTACION);
                var datosPrisma = {
                    token: tokenEncriptado.toString(),
                    usuario: result.usuario,
                    empresa: $('#empresa_txt option:selected').text()
                };
                localStorage.setItem('datos_prisma', JSON.stringify(datosPrisma));
                window.location = 'home.html';
            } else if (result.codigoRespuesta === 0) {
                dom.lanzarAlertaOk('Error en Atenticación: ' + result.mensaje, 'Inicio de Sesión');
                $('#contrasena_txt').val('');
            }
        } else {
            dom.lanzarAlertaOk('Debe diligenciar todos los campos del formulario', 'Inicio de Sesión');
        }
    },

    /**
     * Consulta las empresas registradas en la base de datos para el inicio de sesión
     * @return {void}
     */
    obtenerEmpresas: function () {
        var data = {
            i: '2'
        };
        var resultado = loginControl.obtenerEmpresas(data).empresas;
        $.each(resultado, function (i, item) {
            $('#empresa_txt').append($('<option>').attr('value', item.empId).append(item.empNombre));
        });
    },

    /**
     * Consulta los usuarios conectados.
     * @return {void}
     */
    obtenerUsuarioEnSesion: function () {
        var data = {
            i: '-2'
        };
        var resultado = loginControl.obtenerUsuarioSesion(data);
        if (resultado.idacceso !== undefined && resultado.idacceso > 0) {
            loginVista.cerrarSesion();
        }
    },

    /**
     * Cierra la sesión del usuario actual
     * @return {void}
     */
    cerrarSesion: function () {
        var data = {
            i: '-1'
        };
        var resultado = loginControl.cerrarSesion(data);
        if (resultado.confirmaSalida !== undefined && resultado.confirmaSalida > 0) {
            window.sessionStorage.clear();
            window.localStorage.clear();
        }
    }
};
