/**
 * @fileOverview Archivo de vista de cartera castigada
 * @author angelicaGomez
 * @requires carteraCastigada.control.js
 * @requires carteraCastigada.modelo.js
 * @version 1.0.0
 */

/**
 * Objeto que hace referencia al namespace carteraVista
 * @type {object}
 */
var that = null;
/** @namespace*/
var carteraVista = {

    primeraCarga: true,
    /**
     * Inicializa el prorama de cartera castigada y agrega listeners a controles
     * @returns {void}
     **/
    init: function () {
        that = carteraVista;
        $('#btnProcesarCartera').on('click', that.confirmarProcesar);
        carteraControl.consultarProgreso(that.consultarProgresoCompleto);
        /* carteraModelo.interval = setInterval(function () {
         carteraControl.consultarProgreso(that.consultarProgresoCompleto);
         }, 5000);*/
    },
    
    /** Captura la respuesta del servidor cuando se consultan la ejecución en proceso
     * @param {object} data - Respuesta del servidor por información de la ejecución
     * @returns {void}
     */
    consultarProgresoCompleto: function (data) {
        switch (data.estado.estado) {
            case 'I':  //el proceso ya terminó su ejecución, se muestra resumen del proceso
                that.limpiarFormulario();
                if (!that.primeraCarga) {
                    __dom.lanzarAlerta('Se ha finalizado el proceso', __app.mensajes.atencion);
                }
                carteraControl.consultarResumenProceso(that.onConsultarResumenCompleto);
                break;
            case 'A': //el proceso está activo, se debe mostrar la barra de progreso y la tabla del resultado
                $('#divCargando').show();
                $('#divControles').hide();
                $('#btnGenerarMovimiento').attr('disabled', 'disabled');
                $('#h3InformacionProceso').html('Proceso ejecutado por: ' + data.estado.usuario + ' - Desde el: ' + data.estado.fechaInicio.split('.')[0]);
                if (!carteraModelo.interval) {
                    carteraModelo.interval = setInterval(function () {
                        carteraControl.consultarProgreso(that.consultarProgresoCompleto);
                    }, 10000);
                }
                break;
        }
    },
    
    /**
     * Se ejecuta cuando se termina de consultar el resumen del proceso y llena la tabla con los datos del resumen.
     * @param  {Object} data Objeto con la respuesta del servidor.
     * @returns {void}
     */
    onConsultarResumenCompleto: function (data) {
        if (data.codigoRespuesta === 0) {
            that.limpiarFormulario();
            return;
        }

        fillTable('tblProgreso', 'formatoResumen', data.resumen, 'Resumen del último proceso ejecutado');
    },
    /**
     * Configura el formulario para iniciar un nuevo proceso
     * @returns {void}
     */
    limpiarFormulario: function () {
        $('#divCargando').hide();
        $('#divControles').show();
        $('#tblProgreso').empty();
        $('#h3InformacionProceso').html('');
        $('#btnGenerarMovimiento').removeAttr('disabled');
        clearInterval(carteraModelo.interval);
    },
    /**
     * Se muestra cuadro de diálogo para confirmar el proceso de castigo
     * @returns {void}
     */
    confirmarProcesar: function () {
        var ciclo = $('#cboCiclo').val();
        if (ciclo === '-1') {
            __dom.lanzarAlerta('Debe seleccionar ciclo', __app.mensajes.atencion);
            return;
        }
        that.dialogoActual = $('#divConfirmarProcesar').dialogo({
            modal: true,
            width: 550,
            title: 'Confirmar proceso',
            buttons: {
                Aceptar: function () {
                    __dom.lanzarAlerta('Se procederá a castigar la suscripción ¿realmente desea continuar?',
                            __app.mensajes.atencion,
                            that.procesarCartera, true);
                    that.dialogoActual.dialog('close');
                },
                Cancelar: function () {
                    that.dialogoActual.dialog('close');
                }
            }
        });
    },
    /**
     * Hace petición ajax para inciar el proceso de castigar cartera
     * @returns {void}
     */
    procesarCartera: function () {
        $('#tblProgreso').empty();
        that.primeraCarga = false;
        $('#divError').hide();
        var ciclo = $('#cboCiclo').val();
        carteraControl.procesarCartera({idciclo: ciclo}, that.onProcesarCompleto);
    },
    /**
     * Recibe la respuesta del servidor cuando se ejecuta el proceso
     * @param {array} data - Respuesta del servidor con información de suscripción
     * @returns {void}
     */
    onProcesarCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                var sus = data.suscripcionessaldo;
                if (!!sus && sus.length > 0) {
                    carteraModelo.suscripcionessaldo = sus;
                    fillTable("tblSuscripciones", "formatoSuscripcionSaldo", "carteraModelo.suscripcionessaldo", "Suscripciones con recaudos pendientes por aplicar ");
                    $('#pMensajeError').text(data.mensaje /*' No se pudo procesar/castigar  porque existen las siguientes suscripciones con saldo'*/);
                    $('#divError').show();
                }
                break;
            case 1:
                var fxRecargar = function () {
                    location.reload();
                }
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion, fxRecargar, null, fxRecargar);
                carteraControl.consultarProgreso(that.consultarProgresoCompleto);
                carteraModelo.interval = setInterval(function () {
                    carteraControl.consultarProgreso(that.consultarProgresoCompleto);
                }, 10000);
                break;
        }
    }

};

//Inicia el programa de cartera.
carteraVista.init();
