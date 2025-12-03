/**
 * @fileOverview Archivo de vista y control de facturar una financiación
 * @author AppFuture
 * @requires facturar.financiacion.control.js
 * @requires facturar.financiacion.modelo.js
 * @version 1.0.0
 */

var that = null;
/** @namespace */
//el objeto facturarFinanciacionVista se encarga de la interfaz gráfica de la aplicación de facturar financiación
var facturarFinanciacionVista = {
    dialogoActual: null,
    /**
     * Inicializa el programa para facturar financiación
     * @returns {void}
     */
    init: function () {
        that = this;
        $($('#cboCiclo').find('option')[1]).prop('selected', true);
        $('#cboCiclo').on('change', that.consultarProgreso);
        $('input#btnFacturarFinanciacion').on('click', that.confirmarFacturacion);
        $('#btnAprobarFac').on('click', that.aprobarFacturacion);
    },

    /**
     * Consulta el progreso de la facturación de las financiaciones
     * @returns {void}
     */
    consultarProgreso: function () {
        var ciclo = $('#cboCiclo').val();
        var data = {'idciclo': ciclo};
        if (ciclo !== '-1') {
            facturarFinanciacionControl.consultarProgreso(data, that.onConsultarProgreso);
        }
    },

    /**
     * Función que se ejecuta cuando se ha terminado de consultar el progreso, si no hay resultado (codigo de respuesta 0)
     * Se consulta el resultado final de la facturación. En caso contrario se muestra la tabla con el progreso actual de la facturación.
     * @param  {Object} data La respuesta del servidor
     * @returns {void}
     */
    onConsultarProgreso: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                clearInterval(facturarFinanciacionModel.interval);
                var data = {'idciclo': $('#cboCiclo').val()};
                $('#divProgreso').hide();
                $('#divCamposProceso').show();
                facturarFinanciacionControl.consultarResultado(data, that.onCosultarResultado);
                break;
            case 1:
                if (data.datos !== null) {
                    $('#divProgreso').show();
                    $('#divCamposProceso').hide();
                    $('#divErroresProceso').hide();
                    var progreso = [data.datos];
                    fillTable("tblProgreso", "formatoProgreso", progreso, "");
                }
                break;
        }
    },

    /**
     * Función que se ejecuta cuando se ha terminado de consultar el progreso de la facturación.
     * Si hay resultados muestra la tabla de errores y de facturas correctas.
     * @param  {Object} data Respuesta del servidor
     * @returns {void}
     */
    onCosultarResultado: function (data) {
        var divErroresProceso = $('#divErroresProceso');
        var errores = $('#fsResultadosConError').hide();
        var correctos = $('#fsResultadosCorrectas').hide();
        divErroresProceso.find('.tabla').empty();
        switch (data.codigoRespuesta) {
            case 0:
                divErroresProceso.hide();
                break;
            case -1:
                divErroresProceso.hide();
                break;
            case 1:

                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                divErroresProceso.show();
                if (data.errores && data.errores.length > 0) {
                    errores.show();
                    fillTable('tblErroresProceso', 'formatoErroresProceso', data.errores, 'Errores en el procesamiento');
                }
                if (data.correctos && data.correctos.length > 0) {
                    correctos.show();
                    fillTable('tblFacturasCorrectas', 'formatoFacturasCorrectas', data.correctos, 'Financiaciones facturadas');
                }
                break;
        }
    },

    /**
     * Valida el ciclo seleccionado y si hay alguna selección, invoca la aprobación de las facturas del ciclo
     * @returns {void}
     */
    aprobarFacturacion: function () {
        var ciclo = $('#cboCiclo').val();
        var data = {'idciclo': ciclo};
        if(ciclo !== '-1'){
            facturarFinanciacionControl.aprobarFacturacion(data, that.onAprobarFacturacionCompleto);
        }
    },

    /**
     * Se ejecuta cuando se ha terminado de ejecutar la aprobación de facturas. Si hay errores muestra la tabla de errores al aprobar.
     * Si todo está bien muestra un mensaje al cliente y se recarga la página.
     * @param  {Object} data Respuesta del servidor.
     * @returns {void}
     */
    onAprobarFacturacionCompleto: function (data) {
        var fxRecargar = function () {
            window.location.reload();
        };

        var divErroresProceso = $('#divErroresProceso');
        var errores = $('#fsResultadosConError').hide();
        var correctos = $('#fsResultadosCorrectas').hide();
        divErroresProceso.find('.tabla').empty();
        switch (data.codigoRespuesta) {
            case -1:
                divErroresProceso.show();
                if (data.errores) {
                    errores.show();
                    fillTable('tblErroresProceso', 'formatoErroresAprobar', data.errores, 'Errores al aprobar');
                }
                break;
            case -3:
                fxRecargar();
                break;
            default:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion, fxRecargar, null, fxRecargar);
                divErroresProceso.hide();
                break;
        }
    },

    /**
     * Valida el ciclo seleccionado y solicita la confirmación del usuario para continuar con la facturación.
     * @returns {void}
     */
    confirmarFacturacion: function () {
        var cmb = $('select#cboCiclo');
        if (parseInt(cmb.val()) === -1) {
            __dom.lanzarAlerta('Debe seleccionar el ciclo a facturar.', __app.mensajes.atencion);
            return;
        }
        var nombreCiclo = cmb.find('option:selected').text();
        __dom.lanzarAlerta('Se facturará el ciclo <b>' + nombreCiclo + '</b> ¿Desea continuar?', __app.mensajes.atencion, that.btnFacturarFinanciacionClick, true);
    },
    /**
     * Valida el ciclo seleccionado y hace petición ajax para facturar la financiación
     * @returns {void}
     */
    btnFacturarFinanciacionClick: function () {
        var idCiclo = parseInt($('select#cboCiclo').val());
        var idTipoSuscripcion = $('select#cboTipoSuscripcion').val() > 0 ? $('select#cboTipoSuscripcion').val() : '';
        var data = {'idciclo': idCiclo};
        facturarFinanciacionControl.facturarFinanciacion(data, that.onCompletoFacturarFinanciacion);
    },
    /**
     * Recibe la respuesta del servidor, cuando se termina la facturación de las financiaciones 
     * @param {array} data - Respuesta del servidor.
     * @returns {void}
     */
    onCompletoFacturarFinanciacion: function (data) {
        var codigo = parseInt(data.codigoRespuesta);
        switch (codigo) {
            case 1:
                that.proceso = true;
                that.consultarProgreso();
                facturarFinanciacionModel.estado = 'E'
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                facturarFinanciacionModel.interval = setInterval(that.consultarProgreso, 5000);
                break;
            case -3:
                $('#pInformacion').text(data.mensaje);
                fillTable('tblLiquidacion', 'formatoLiquidaciones', data.conceptos);
                that.dialogoActual = $('#diConfirmacion').dialogo({
                    modal: true,
                    width: 550,
                    title: 'Confirmar Facturación',
                    buttons: {
                        Continuar: function () {
                            that.facturarFinanciacion();
                        },
                        Cancelar: function () {
                            that.dialogoActual.dialog('close');
                        }
                    }
                });
                break;
            default:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                break;
        }
    },

    /**
     * Invoca al método de facturarFiananciacion del controlador y consulta el progreso en un intervalo de 5 segundos cada vez.
     * @returns {void}
     */
    facturarFinanciacion: function () {
        that.dialogoActual.dialog('close');
        facturarFinanciacionModel.estado = 'E'
        var data = {
            'idciclo': $('#cboCiclo').val(),
            'continua': 1
        };
        facturarFinanciacionControl.facturarFinanciacion(data, function () {
            that.consultarProgreso();
            facturarFinanciacionModel.interval = setInterval(that.consultarProgreso, 5000);
        });

    }
};

facturarFinanciacionVista.init();

