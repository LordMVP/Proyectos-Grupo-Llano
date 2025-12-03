/**
 * @fileOverview Archivo de vista y control para consultar recaudos
 * @author AppFuture
 * @requires consultar.control.js
 * @requires consultar.modelo.js
 * @version 1.0.0
 */
/**
 * Objeto que hace referencia al namespace consultaVista
 * @type {Object}
 */
var that = null;
/** @namespace */
var consultaVista = {
    /** Hace referencia al último dialogo abierto en la aplicación
     * @type {object}
     */
    dialogoActual: null,
    /**Inicializa el programa de generación de documento de pago, y asigna listeners a los controles
     * @returns {void}
     */
    init: function () {
        that = this;
        var comandos = $('div#divComandos');
        comandos.find('#btnBuscar').on('click', that.mostrarFiltro);
        comandos.find('#btnCancelar').on('click', that.cancelarFormulario);
        comandos.find('#btnImprimir').on('click', that.imprimir);
        comandos.find('#btnImprimirTimbre').on('click', that.impresiontimbre);
        $('#btnVerFormasPago').on('click', that.mostrarFormasPago);

        __dom.configurarTextoNumerico('txtIdSuscripcionFiltro, #txtIdRegistroFiltro');
        __dom.configurarCalendario('txtFechaInicio, #txtFechaFin');
        $('#txtFechaInicio').on('change', that.configurarFechaFin);
    },
    /**
     * Valida que el usuario tenga autorización de imprimir el recaudo
     * @returns {void}
     */
    impresiontimbre: function () {
        if (consultarModel.autorizacion.estadoimpresion === 'A') {
            consultarControl.actualizarAutorizacion({idimpresion: consultarModel.autorizacion.idimpresion}, that.validarAutorizacion);
            imprimirTimbre('iFrameTimbre', consultarModel.detalleRecaudo);
        }
    },
    /**Valida la información de suscripción y facturas para imprimir
     * @returns {void}
     */
    imprimir: function () {
        if (consultarModel.recaudo !== null && !!consultarModel.recaudo.idRecaudo) {
            if (consultarModel.formasPago !== null && __app.esArreglo(consultarModel.formasPago)) {
                $('#divFormaPImprimir').show();
                consultarModel.formasPago.forEach(function (item, i) {
                    var vlrReal = item.valorReal.toCurrency();
                    $('#tblFormaPago tbody').append($('<tr><td>' + item.formaPago + '</td><td>' + vlrReal + '</td></tr>'));
                });
            }
            window.print();
        }
        $('#tblFormaPago tbody').html('');
        $('#divFormaPImprimir').hide();
    },
    /**Configura que la fecha de fin no sea inferior a la fecha de inicio
     * @returns {void}
     */
    configurarFechaFin: function () {
        var _this = $(this);
        var fi = new Date(_this.val().replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3"));
        $('#txtFechaFin').datepicker('option', 'minDate', fi)
                .val('');
    },
    /** Muestra un dialogo con el formulario para la búsqueda de recaudos
     * @returns {void}
     */
    mostrarFiltro: function () {
        var filtro = $('div#divFiltro');
        that.dialogoActual = filtro.dialogo({
            modal: true,
            width: 850,
            position: {my: "center", at: "top+30%", of: "body"},
            title: 'Buscar un recaudo',
            buttons: {
                Buscar: that.filtrarRecaudo
            }
        });
    },
    /** Valida la información del filtro de recaudo y envía la solicitud al servidor
     * @returns {void}
     */
    filtrarRecaudo: function () {
        var dialogo = that.dialogoActual;
        var errores = 0;
        var idRecaudo = $('#txtIdRegistroFiltro').val().trim();
        if (idRecaudo !== "") {
            consultarControl.consultarRecaudos({'idRegistro': idRecaudo}, that.onFiltrarCompleto);
            dialogo.find('.pMensaje').text('');
        } else {
            var idSuscripcion = $('#txtIdSuscripcionFiltro').val().trim();
            var fechaInicio = $('#txtFechaInicio').val();
            var fechaFin = $('#txtFechaFin').val();
            var codigoAnterior = $('#txtCodigoAnterior').val();
            if (((idSuscripcion !== "" || codigoAnterior !== "") && fechaInicio !== "" && fechaFin !== "")) {
                var datos = {};
                if (idSuscripcion !== "") {
                    datos.idSuscripcion = idSuscripcion;
                }
                datos.fechaInicio = fechaInicio + " 00:00:00";
                datos.fechaFin = fechaFin + " 23:59:59";
                datos.codigoAnterior = codigoAnterior;
                consultarControl.consultarRecaudos(datos, that.onFiltrarCompleto);
                dialogo.find('.pMensaje').text('');
            } else {
                dialogo.find('.pMensaje').text('Debe digitar un id de recaudo, o un id de suscripción o código anterior y un rango de fechas.');
            }
        }
    },
    /** Captura la respuesta enviada por el servidor, cuando se consultan los recaudos.
     * En caso de llegar varios recaudos posibilita la selección de uno.
     * @param  {object} data - El resultado de la petición ajax para guardar la información de la suscripción
     * @returns {void}
     */
    onFiltrarCompleto: function (data) {
        var divResultadoFiltro = $('#divResultadoFiltro').html('');
        that.dialogoActual.find('.btnSimple').remove();
        switch (data.codigoRespuesta) {
            case 0:
                that.dialogoActual.find('.pMensaje').text(__app.mensajes.sinResultados);
                break;
            case 1:
                if (data.recaudos.length > 1) {
                    $.each(data.recaudos, function (i, item) {
                        var label = $('<label>');
                        label.attr({
                            'for': 'rbtnRecaudo_' + i
                        });
                        var radio = $('<input>').attr({
                            'id': 'rbtnRecaudo_' + i,
                            'data-indice': i,
                            'type': 'radio',
                            'name': 'rbtnRecaudos'
                        });
                        var span = $('<span>').text('Recaudo: ' + item.idRecaudo + ' - Fecha: ' + item.fecha + ' - Documento: ' + item.documento);
                        label.append(radio).append(span);
                        var div = $('<div>').append(label);
                        divResultadoFiltro.append(div);
                    });
                    var btnSeleccionRecaudo = $('<button>');
                    btnSeleccionRecaudo.text('Seleccionar');
                    btnSeleccionRecaudo.attr({
                        'id': 'btnSeleccionRecaudo',
                        'class': 'btnSimple'
                    });
                    btnSeleccionRecaudo.on('click', function () {
                        var seleccionado = divResultadoFiltro.find('input[name="rbtnRecaudos"]:checked');
                        if (seleccionado.length > 0) {
                            consultarModel.recaudo = data.recaudos[parseInt(seleccionado.attr('data-indice'))];
                            that.dialogoActual.dialog('close');
                            that.cargarCabecera();
                        } else {
                            that.dialogoActual.find('.pMensaje').text(__app.mensajes.seleccionarOpcion);
                        }
                    });
                    btnSeleccionRecaudo.insertAfter(divResultadoFiltro);
                } else {
                    consultarModel.recaudo = data.recaudos[0];
                    that.dialogoActual.dialog('close');
                    that.cargarCabecera();
                }
                break;
        }
    },
    /** Carga la cabecera del formulario con los datos del recaudo seleccionada.
     * Y hace petición ajax para consultar los detalles del mismo
     * @returns {void}
     */
    cargarCabecera: function () {
        var rec = consultarModel.recaudo;
        $('#txtIdRecaudo').val(rec.idRecaudo);
        $('#txtFecha').val(rec.fecha).attr('title', rec.fecha);
        $('#txtDocumento').val(rec.documentoTercero);
        $('#txtNombreTercero').val(rec.nombreCompletoTercero);
        $('#txtConvenio').val(rec.nombreConvenio).attr('data-id', rec.idConvenio);
        $('#txtUsuario, #txtCantImpresiones').removeAttr('disabled'); //Es un campo de la interfaz de autorización
        if(consultarModel.accion === 'autorizacion'){
            $('#tblImpresiones').empty();
            $('#btnGrabar').removeAttr('disabled');
            autorizacionModel.idusuario = undefined;
            $('#txtDocumentoUsuario, #txtUsuario, #txtCantImpresiones').val('');
        }
        consultarControl.consultarLimite({'idrecaudo': rec.idRecaudo}, that.validarAutorizacion);
        consultarControl.consultarDetallesRecaudo({'idRecaudo': rec.idRecaudo}, that.onCargarDetallesCompleto);
    },
    /**
     * Recibe la respuesta del servidor al consultar el recaudo y valida si se puede imprimir el timbre
     * @param {Object} data - Información enviada por el servidor de autorizaciones de impresiones
     */
    validarAutorizacion: function (data) {
        if (data.codigoRespuesta === 1) {
            consultarModel.autorizacion = data.datos.impresionrecaudo ? data.datos.impresionrecaudo : data.datos;
            (consultarModel.autorizacion.estadoimpresion === 'A') ? $('#btnImprimirTimbre').removeAttr('disabled') : $('#btnImprimirTimbre').attr('disabled', 'disabled');
        } else {
            consultarModel.autorizacion = {};
            consultarModel.autorizacion.estado = 'G';
            $('#btnImprimirTimbre').attr('disabled', 'disabled');
        }
    },
    /** Captura la respuesta del servidor cuando se consultan los detalles de un recaudo.
     * @param {object} data - Respuesta del servidor con facturas, conceptos y pagos del recaudo.
     * @returns {void}
     */
    onCargarDetallesCompleto: function (data) {
        switch (parseInt(data.codigoRespuesta)) {
            case 0:
                __dom.lanzarAlerta(__app.mensajes.sinResultados, __app.mensajes.tituloErrorInesperado);
                break;
            case 1:
                var recaudo = data.resultadoRecaudo.inforecaudo;
                $('#txtValorPagado').val(recaudo.valorpagado.toCurrency());
                $('#txtCambio').val(recaudo.valorcambio.toCurrency());
                $('#txtAjuste').val(recaudo.valorajuste.toCurrency());
                $('#txtMedioPago').val(recaudo.mediopago);
                $('#txtClasePago').val(recaudo.documento);
                $('#txtSucursal').val(recaudo.sucursal);
                $('#txtCifrado').val(recaudo.cifrado);
                $('#txtFechaPago').val(recaudo.fechapago).attr('title', recaudo.fechapago);

                consultarModel.detalleRecaudo = recaudo;
                consultarModel.suscripciones = data.resultadoRecaudo.suscripciones;
                consultarModel.facturas = data.resultadoRecaudo.facturas;
                consultarModel.conceptos = data.resultadoRecaudo.conceptos;
                consultarModel.formasPago = data.resultadoRecaudo.formas;
                fillTable("tblSuscripciones", "formatoSuscripciones", "consultarModel.suscripciones", "Suscripciones");
                if (__app.esArreglo(consultarModel.facturas) && consultarModel.facturas.length > 0) {
                    fillTable("tblFactura", "formatoFacturas", "consultarModel.facturas", "Facturas").show();
                } else {
                    $('#tblFactura').hide();
                }
                if (__app.esArreglo(consultarModel.conceptos) && consultarModel.conceptos.length > 0) {
                    fillTable("tblConceptos", "formatoConceptos", "consultarModel.conceptos", "Conceptos y Documentos").show();
                } else {
                    $('#tblConceptos').hide();
                }
                break;
        }
    },
    /** Confirma si el usuario desea cancelar la operación actual
     * @returns {void}
     */
    cancelarFormulario: function () {
        if (consultarModel.recaudo) {
            __dom.lanzarAlerta(__app.mensajes.confirmacionCancelacion,
                    __app.mensajes.tituloConfirmacion,
                    that.limpiarFormulario,
                    true
                    );
        }
    },
    /** Limpia los valores de los formularios, la tabla y el modelo
     * @returns {void}
     */
    limpiarFormulario: function () {
        $('#divFiltro input[type="text"]').val("");
        var divResultadoFiltro = $('#divResultadoFiltro').html('');
        that.dialogoActual.find('.btnSimple').remove();
        $('#btnSeleccionRecaudo').remove();
        $('#fieldCabecera input[type="text"]').val('');
        $('table, #divResultadoFiltro').html('');
        consultarModel = {};
    },
    /** Muestra un dialogo con las formas de pago aplicadas al recaudo
     * @returns {void}
     */
    mostrarFormasPago: function () {
        if (consultarModel.recaudo !== null && !!consultarModel.recaudo.idRecaudo) {
            var contenido = null;
            if (consultarModel.formasPago !== null && __app.esArreglo(consultarModel.formasPago)) {
                contenido = $('<div>').addClass('listaSeleccion');
                consultarModel.formasPago.forEach(function (item, i) {
                    var forma = $('<div>');
                    forma.text('Forma: ' + item.formaPago + ' - Valor: ' + item.valorReal.toString().toCurrency());
                    contenido.append(forma);
                });
            } else {
                contenido = $('<p>').addClass('pMensaje').text('No se encontraron formas de pago');
            }
            var divFormas = $('div#divFormasPago').html('').append(contenido);
            that.dialogoActual = divFormas.dialogo({
                modal: true,
                width: 400,
                position: {my: "center", at: "top+40%", of: "body"},
                title: 'Formas de Pago',
                buttons: {
                    Aceptar: function () {
                        that.dialogoActual.dialog('close');
                    }
                }
            });
        }
    }
};
consultaVista.init();
