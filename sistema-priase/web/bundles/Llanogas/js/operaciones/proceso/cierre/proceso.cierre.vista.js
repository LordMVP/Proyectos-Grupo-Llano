/**
 * @fileOverview Archivo de vista para cierre de suspensiones y reconexiones
 * @author AppFuture
 * @requires proceso.cierre.control.js
 * @requires proceso.cierre.modelo.js
 * @version 1.0.0
 */

/**
 * Objeto que hace referencia al namespace procesoCierreVista
 * @type {object}
 */
var that = null;

/** @namespace */
var procesoCierreVista = {
    /**
     * Inicializa el programa de cierre de suspensión y reconexión y asigna listeners a controles.
     * @returns {void}
     */
    init: function (opcion) {
        that = this;
        $('#btnSuspension').on('click', that.prepararProcesoCierre);
        if (opcion === 0) {
            procesoCierreControl.consultarResumen(that.onConsultarResumenCompleto);
        } else {
            $('#divCampos').hide();
            that.consultarProgreso();
            setInterval(that.consultarProgreso, 10000);
        }
    },
    /**
     * Ejecuta el proceso de cierre de suspensiones y valida el ciclo 
     **/
    prepararProcesoCierre: function () {
        var ciclo = $('#cboCiclos').val();
        $('#spanProceso').text('');
        if (ciclo !== '-1') {
            procesoCierreControl.aplicarSuspensiones({idciclo: ciclo}, that.onEjecutarProceso);
        } else {
            $('#spanProceso').text(__app.mensajes.seleccionarCiclo);
        }
    },
    /**
     * Muestra alerta de ejecución del proceso
     **/
    onEjecutarProceso: function (data) {
        switch (data.codigoRespuesta) {
            case 1:
                __dom.lanzarAlerta(__app.mensajes.procesoLanzado, __app.mensajes.atencion, function () {
                    location.reload()
                });
                break;
        }
    },
    /**
     * Consulta el progreso del proceso de cierre de suspensiones y reconexiones
     **/
    consultarProgreso: function () {
        procesoCierreControl.consultarProgreso(that.actualizarProgreso);
    },
    /**
     * Actualiza la barra de progreso del informe de la ejecución del proceso.
     **/
    actualizarProgreso: function (data) {
        if (data.codigoRespuesta > 0) {
            if (data.progreso && data.progreso.idProceso) {
                $('#numeroRegistrosProcesados').text(data.progreso.numeroRegistrosProcesados);
            } else {
                $('#divCampos').show();
                location.reload();
            }
        }
    },
    /**
     * Recibe la información del resultado del proceso agrupados por el municipio puede que haya pasado al siguiente período o no
     * @param {Object} data - Respuesta del servidor
     */
    onConsultarResumenCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case -3:
                __dom.lanzarAlerta("No se generaron suspensiones y/o reconexiones en el nuevo período", "Atención");
                break;
            case 1:
                $('#divDialogoResumen').show();
                if (data.datos) {
                    var error = data.datos.nogeneradas;
                    var correcto = data.datos.generadas;
                    if (error.length > 0) {
                        fillTable('tblErrores', 'formatoErrores', error, 'Suspensiones y/o reconexiones que no pasan al siguiente período');
                    }
                    if (correcto.length > 0) {
                        fillTable('tblResumen', 'formatoGeneradas', correcto, 'Suspensiones y/o reconexiones generadas');
                    }
                }
                break;
        }
    }
};