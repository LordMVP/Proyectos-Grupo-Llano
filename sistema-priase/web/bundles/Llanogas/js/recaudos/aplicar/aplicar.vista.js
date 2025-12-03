/**
 * @fileOverview Archivo de vista y control de aplicar recaudos
 * @author AppFuture
 * @requires aplicar.control.js
 * @requires aplicar.model.js
 * @version 1.0.0
 */
/**
 * Objeto que hace referencia al namespace aplicarVista
 * @type {Object}
 */
var that = null;
/** @namespace */
var aplicarVista = {
    /**Inicializa el programa de aplicar recaudos
     * @returns {void}
     */
    init: function (opcion) {
        that = this;
        debugger;
        $('#btnAplicarRecaudos').on('click', that.eventoAplicarRecaudos);
        var cboTipoSuscripcion = $('#cboTipoSuscripcion');
        if (opcion !== 0) {
            $('#divCamposProgreso').show();
            aplicarControl.consultarProgreso(that.actualizarProgreso);
            aplicarModel.interval = setInterval(that.consultarProgreso, 10000);

            return;
        }
        if (localStorage.getItem('procesoAplicaLanzado')) {
            that.consultarResumenProceso();
        }
        $('#divCamposProgreso').hide();
        cboTipoSuscripcion.on('change', that.eventoOnChangeCboTipoSuscripcion);

    },
    /** Realiza la petición AJAX para consultar motivos de suspensión para el tipo de suscripción
     * @returns {void}
     */
    eventoOnChangeCboTipoSuscripcion: function () {
        var idTipoSuscripcion = $('#cboTipoSuscripcion').val();
        var data = {};
        data.idTipoSuscripcion = idTipoSuscripcion;
        //aplicarControl.consultarMotivosSuspension(data, that.mostrarSuspension);
    },
    /** Captura la respuesta enviada por el servidor, cuando se consultan motivos de suspensión
     * @param  {object} data - El resultado de la petición ajax con motivos de suspensión
     * @returns {void}
     */
    /*mostrarSuspension: function(data) {
     var txtMotivosSuspension = $("#txtMotivoSuspension");
     switch (data.codigoRespuesta) {
     case 0:
     txtMotivosSuspension.val('N/A');
     aplicarModel.idMotivoSuspension = -1;
     break;
     case 1:
     var motivo = data.motivosSuspension[0];
     aplicarModel.idMotivoSuspension = motivo.idmotivosuspension;
     txtMotivosSuspension.val(motivo.motivosuspension);
     break;
     }
     },*/
    /** Valida información y realiza la petición AJAX para aplicar recaudos
     * @returns {void}
     */
    eventoAplicarRecaudos: function () {
        var cboTipoSuscripcion = $('#cboTipoSuscripcion');
        if (cboTipoSuscripcion.val() !== '-1') {
            var data = {
                idTipoSuscripcion: cboTipoSuscripcion.val(),
                //idMotivoSuspension: aplicarModel.idMotivoSuspension
            };
            aplicarControl.aplicarRecaudos(data, that.ejecutoProceso);
        } else {
            __dom.lanzarAlerta(__app.mensajes.seleccionarTipoSuscripcion, __app.mensajes.atencion);
        }
    },
    /** Captura la respuesta enviada por el servidor, cuando se aplican los recaudos
     * @param  {object} data - El resultado de la petición ajax respuesta de si empezó a aplicar recaudos
     * @returns {void}
     */
    ejecutoProceso: function (data) {
        switch (data.codigoRespuesta) {
            case 1:
                that.consultarProgreso();
                localStorage.setItem('procesoAplicaLanzado', 'true');
                var fx = function () {
                    window.location.reload();
                };
                __dom.lanzarAlerta(
                        __app.mensajes.procesoLanzado,
                        __app.mensajes.atencion,
                        fx, null, fx
                        );

                //aplicarModel.interval = setInterval(that.consultarProgreso, 10000);
                break;
        }
    },
    /**
     * Consulta el progreso del proceso de aplicación de recaudos
     */
    consultarProgreso: function () {
        aplicarControl.consultarProgreso(that.actualizarProgreso);
    },
    /** Captura la respuesta enviada por el servidor, cuando se consulta progreso de aplicar recaudos
     * @param  {object} data - El resultado de la petición ajax con progreso de aplicación de recaudos
     * @returns {void}
     */
    actualizarProgreso: function (data) {
        if (data.codigoRespuesta > 0) {
            $('#divCamposAplicar').hide();
            $('#divCamposProgreso').show();
            $('#spanFecha').text(data.progreso.fechaInicio);
            $('#spanUsuario').text(data.progreso.usuario);
            $('#numeroRegistrosProcesados').text(data.progreso.numeroRegistrosProcesados);
            return;
        }
        that.consultarResumenProceso();
    },
    /**
     * Consulta los resultados del proceso y elimina la petición al servidor que se hacía cada tiempo
     */
    consultarResumenProceso: function () {
        if (aplicarModel.interval) {
            clearInterval(aplicarModel.interval);
        }
        $('#divCamposAplicar').show();
        $('#divCamposProgreso').hide();
        localStorage.removeItem('procesoAplicaLanzado');
        aplicarControl.consultarResumen(that.onConsultarResumenCompleto);
    },
    /**
     * Obtiene el resumen del proceso y una vez el usuario termina de ver se actualiza la página
     * @param data
     */
    onConsultarResumenCompleto: function (data) {
        $('#tblResumen').empty();
        switch (data.codigoRespuesta) {
            case 1:
                var fxRecargar = function () {
                    location.reload();
                };
                fillTable('tblResumen', 'formatoResumen', data.resumen, 'Resultados de aplicar recaudos');
                $('#divResumenProceso').dialogo({
                    width: 850,
                    modal: true,
                    close: fxRecargar,
                    title: 'Resumen del proceso',
                    buttons: {
                        'Aceptar': fxRecargar
                    }
                });
                break;
            case -2:
            case 0:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                break;
        }
    }
};