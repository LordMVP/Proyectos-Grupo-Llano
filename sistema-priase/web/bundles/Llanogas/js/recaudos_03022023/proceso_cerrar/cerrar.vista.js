/**
 * @fileOverview Archivo de vista y control de cerrar recaudo
 * @author AppFuture
 * @requires cerrar.control.js
 * @requires cerrar.model.js
 * @version 1.0.0
 */
/**
 * Objeto que hace referencia al namespace cerrarVista
 * @type {Object}
 */
var that = null;
/** @namespace */
var cerrarVista = {

    /**
     * Guarda interval para consultar el progreso del proceso
     */
    interval: null,
    /**Inicializa el programa de cerrar un recaudo, y asigna listeners a los controles
     * @returns {void}
     */
    init: function (opcion) {
        that = this;
//        sessionStorage.setItem({'proceso_cierre': false});
//        sessionStorage.setItem({'proceso_cierre': true});
        if (opcion === 0) {
            $('#divCamposProgreso').hide();
            $('#divResumenProceso').hide();
            $('#btnAplicarRecaudos').on('click', that.eventoCerrarRecaudos);
            cerrarControl.consultarResumen(that.onConsultarResumenCompleto);
        } else {
            $('#divCamposCierre').hide();
            that.consultarProgreso();
            cerrarModel.interval = setInterval(that.consultarProgreso, 10000);
        }


    },
    /**Consulta progreso de cerrar recaudo.
     * @returns {void}
     */
    consultarProgreso: function () {
        cerrarControl.consultarProgreso(that.actualizarProgreso);
    },
    /** Hace petición ajax para cerrar recaudo en el servidor
     * @returns {void}
     */
    eventoCerrarRecaudos: function () {
        var cmbCiclo = $('#cmbCiclo').val().trim();
        if (cmbCiclo === '-1') {
            __dom.lanzarAlerta('Debe seleccionar un ciclo', __app.mensajes.atencion);
            return;
        }
        cerrarControl.cerrarRecaudos({idciclo: cmbCiclo}, that.ejecutoProceso);
    },
    /** Muestra mensaje indicando que se ha iniciado el cierre de recaudo
     * @returns {void}
     */
    ejecutoProceso: function (data) {
        switch (data.codigoRespuesta) {
            case 1:
                var reload = function () {
                    window.location.reload();
                };
                __dom.lanzarAlerta(data.mensajeError, __app.mensajes.atencion, reload, null, reload);
                break;
            case 0:
                __dom.lanzarAlerta(data.mensajeError, __app.mensajes.atencion);
                break;
            default:
                that.consultarProgreso();

        }
    },
    /** Muestra avance de cierre de recaudo en la interfaz
     * @returns {void}
     */
    actualizarProgreso: function (data) {
        if (data.codigoRespuesta > 0) {
            $('#divCamposCierre').hide();
            $('#divCamposProgreso').show();
            $('#numeroRegistrosProcesados').text(data.progreso.numeroRegistrosProcesados);
        } else {
            if (cerrarModel.interval) {
                clearInterval(cerrarModel.interval);
            }
            $('#divCamposCierre').show();
            $('#divCamposProgreso').hide();
            cerrarControl.consultarResumen(that.onConsultarResumenCompleto);
        }
    },
    /**
     * Consulta el resumen del proceso una vez que ha terminado
     * @param {Object} data - Información que envía el servidor sobre el resumen del proceso
     */
    onConsultarResumenCompleto: function (data) {
        var fxReload = function () {
            location.reload();
        };
//        if (sessionStorage.getItem('proceso_cierre')) {
//            __dom.lanzarAlerta('El proceso ha finalizado correctamente.', __app.mensajes.atencion, fxReload, null, fxReload);
//        }
        if (data.codigoRespuesta === 1) {
            $('#tblResumen').empty();
            fillTable('tblResumen', 'formatoResumen', data.resumen, 'Resultados de cerrar recaudos');
            $('#divResumenProceso').show();
//            
//            that.dialogoActual =  $('#divResumenProceso').dialogo({
//                width: 850,
//                modal: true,
////                close: fxReload,
//                title: 'Resumen del proceso',
//                buttons: {
//                    'Aceptar': function(){
//                        that.dialogoActual.dialog('close');
//                    } 
//                }
//            });
//            $('#divResumenProceso').on('dialogclose', fxReload);
            return;
        }
    }
};