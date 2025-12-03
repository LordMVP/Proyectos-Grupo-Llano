/**
 * @fileOverview Archivo de vista y control de consultar estado de cuenta
 * @author AppFuture
 * @requires estado_cuenta.control.js
 * @requires estado_cuenta.modelo.js
 * @version 1.0.0
 */
/**
 * Objeto que hace referencia al namespace estadoCuentaVista
 * @type {Object}
 */
var that = null;

/** namespace*/
var estadoCuentaVista = {
    /**
     * hace referencia al último dialogo abierto en la aplicación
     * @type {object}
     */
    dialogoActual: null,
    /**
     * Inicializa el programa para la consulta del estado de una cuenta y asigna listeners a controles.
     * @returns {void}
     */
    init: function () {
        that = this;
        $('#btnSuscripcion').on('click', that.mostrarFiltroSuscriptor);
        $('#btnBuscarSuscripciones').on('click', that.filtrarSuscriptor);
        $('#btnImprimir').on('click', function () {
            window.print();
        });
        __dom.configurarCalendario('txtFiltroFecha');
        __dom.configurarTextoNumerico('txtFiltroSus, #txtFiltroCodAnt');
    },
    /**
     * Muestra un cuadro de diálogo para hacer filtro de suscripciones
     * @returns {void}
     */
    mostrarFiltroSuscriptor: function () {
        $('#divFiltro div.listaSeleccion').remove();
        var filtro = $('div#divFiltro');
        that.dialogoActual = filtro.dialogo({
            modal: true,
            width: 600,
            title: 'Filtrar suscripciones'
        });
    },
    /**
     * Valida la información del filtro de suscripciones y hace petición ajax para consultar suscriptor
     * @returns {void}
     */
    filtrarSuscriptor: function () {
        var filtro = that.dialogoActual;
        var fechaCorte = filtro.find('#txtFiltroFecha').val().trim();
        var suscripcion = filtro.find('#txtFiltroSus').val().trim();
        var doc = filtro.find('#txtFiltroDoc').val().trim();
        var codAnt = filtro.find('#txtFiltroCodAnt').val().trim();
        if (fechaCorte === '') {
            filtro.find('#spanMensaje').text(__app.mensajes.seleccionarFechaCorte).show();
            return;
        }
        if (suscripcion === '' && doc === '' && codAnt === '') {
            filtro.find('#spanMensaje').text(__app.mensajes.camposInvalidosFiltro).show();
            return;
        } else {
            var data = {fechacorte: fechaCorte, idsuscripcion: suscripcion, documentosuscriptor: doc, codigoanterior: codAnt};
            estadoCuentaControl.consultarSuscriptor(data, that.filtrarSuscripcionCompleto);
        }
    },
    /**
     * Recibe respuesta del servidor cuando se consulta un suscriptor
     * en caso de que hayan varias el usuario puede seleccionar una.
     * @param {array} data - Respuesta del servidor con suscripción(es) 
     * @returns {void}
     */
    filtrarSuscripcionCompleto: function (data) {
        $('#spanMensaje').text('');
        switch (data.codigoRespuesta) {
            case 0:
                sus = estadoCuentaModel.suscripcion = data.suscripciones[parseInt(suscSeleccionada.attr('data-indice'))];
                that.dialogoActual.find('#spanMensaje').hide();
                that.dialogoActual.dialog('close');
                divSuscriptores.remove();
                that.cargarCabecera();
                break;
            case 1:
                var sus = null;
                if (data.suscripciones.length > 1) {
                    that.dialogoActual.find('div.listaSeleccion').remove();
                    var divSuscriptores = $('<div>').addClass('listaSeleccion');
                    $.each(data.suscripciones, function (s, susc) {
                        var div = $('<div>');
                        var radio = $('<input type="radio">');
                        radio.val(susc.idsuscriptor);
                        radio.attr('id', 'radio_susc_' + s);
                        radio.attr('data-indice', s);
                        radio.attr('name', 'radio_suscripciones');
                        var label = $('<label>').attr('for', 'radio_susc_' + s);
                        label.text(susc.doctercero + ' - ' + susc.nombretercero + ' - Suscripción: ' + susc.idsuscripcion + ' (' + susc.codigoanterior + ')');
                        div.append(radio).append(label);
                        divSuscriptores.append(div);
                    });
                    var btn = $('<button>').text('seleccionar').addClass('btnSimple');
                    btn.on('click', function () {
                        var suscSeleccionada = that.dialogoActual.find('input[name="radio_suscripciones"]:checked');
                        if (suscSeleccionada.length > 0) {
                            sus = estadoCuentaModel.suscripcion = data.suscripciones[parseInt(suscSeleccionada.attr('data-indice'))];
                            that.dialogoActual.find('#spanMensaje').hide();
                            that.dialogoActual.dialog('close');
                            divSuscriptores.remove();
                            that.cargarCabecera();
                        } else {
                            that.dialogoActual.find('#spanMensaje').text(__app.mensajes.seleccionarOpcion).show();
                        }
                    });
                    divSuscriptores.insertAfter(that.dialogoActual.find('#btnBuscarSuscripciones'));
                    divSuscriptores.append(btn);
                } else {
                    sus = estadoCuentaModel.suscripcion = data.suscripciones[0];
                    try {
                        that.dialogoActual.find('#spanMensaje').hide();
                        that.dialogoActual.dialog('close');
                    } catch (ex) {
                    }
                    that.cargarCabecera();
                }
                break;
        }
    },
    /**
     * Carga la información de la cabecera del formulario con la información de la suscripción filtrada
     * @returns {void}
     */
    cargarCabecera: function () {
        var cabecera = $('#divCabecera');
        estadoCuentaModel.fechaCorte = $('#txtFiltroFecha').val();
        var susc = estadoCuentaModel.suscripcion;
        cabecera.find('#txtSuscripcion').val(susc.idsuscripcion);
        cabecera.find('#txtSuscriptor').val(susc.idsuscriptor);
        cabecera.find('#txtCodAnterior').val(susc.codigoanterior);
        cabecera.find('#txtDocumento').val(susc.doctercero);
        cabecera.find('#txtNombre').val(susc.nombretercero);
        cabecera.find('#txtFechaCorte').val($('#txtFiltroFecha').val());
        if (susc['facturacastigada']) {
            __dom.lanzarAlerta('La suscripción se encuentra castigada', __app.mensajes.atencion);
            $('#fsValoresFinanciada, #fsCarteraFinanciada, #fsCarteraNormal, #btnImprimir').hide();
            $('#divCarterasFinanciadas').html('');
            $('#divCarterasNormales').html('');
            $('#divValoresFinanciadas').html('');
        } else {
            estadoCuentaControl.consultarInformacion({idsuscripcion: susc.idsuscripcion, fechacorte: estadoCuentaModel.fechaCorte, fechainicio: estadoCuentaModel.fechainicio}, that.onCargarInformacionCompleto);
        }
    },
    /**
     * Recibe la respuesta del servidor cuando se consulta cartera de la suscripción
     * @param {array} data - Respues del servidor con información de la cartera de la suscripción
     * @returns {void}
     */
    onCargarInformacionCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(__app.mensajes.sinResultados, __app.mensajes.atencion);
                break;
            case 1:
                //mostrar informacion de carteras financiadas
                var divCarterasFinanciadas = $('#divCarterasFinanciadas').html('');
                var divCarterasNormales = $('#divCarterasNormales').html('');
                var divValoresFinanciadas = $('#divValoresFinanciadas').html('');
                var valorDeuda = data.valornormal + data.valorfinanciacion;
                var cabecera = $('#divCabecera');
                cabecera.find('#txtDiasCarteraNormal').val(data.diasmoranormal);
                cabecera.find('#txtDiasCarteraFinanciada').val(data.diasmorafinanciada);
                cabecera.find('#txtValorTotalNormal').val(data.valornormal);
                cabecera.find('#txtValorTotalFinanciada').val(data.valorfinanciacion);
                cabecera.find('#txtValorTotalAdeudado').val(valorDeuda);

                $('#fsValoresFinanciada, #fsCarteraFinanciada, #fsCarteraNormal, #btnImprimir').show();

                if (!!data.financiaciones) {
                    $.get('/achagua/sistema/web/bundles/Llanogas/templates/estadocuenta.html#templateCarteraFinanciada', function (_template) {
                        divCarterasFinanciadas.html(Mustache.render(_template, {financiaciones: data.financiaciones}));
                        divCarterasFinanciadas.find('input.txt-currency').toTxtCurrency();
                        divCarterasFinanciadas.find('td.td-currency').tdCurrency();
                    });
                    
                } else {
                    divCarterasFinanciadas.html('<p class="pMensaje">La suscripción no tiene financiaciones</p>');
                }

                if (!!data.vlrfinanciaciones) {
                    $.get('/achagua/sistema/web/bundles/Llanogas/templates/valoresfinanciacion.html#templateCarteraFinanciada', function (_template) {
                        divValoresFinanciadas.html(Mustache.render(_template, {vlrfinanciaciones: data.vlrfinanciaciones}));
                        divValoresFinanciadas.find('input.txt-currency').toTxtCurrency();
                        divValoresFinanciadas.find('td.td-currency').tdCurrency();
                    });
                } else {
                    divCarterasFinanciadas.html('<p class="pMensaje">La suscripción no tiene financiaciones</p>');
                }

                if (!!data.carteranormal) {
                    $.get('/achagua/sistema/web/bundles/Llanogas/templates/estadocuenta_normal.html#templateCarteraNormal', function (_template) {
                        divCarterasNormales.html(Mustache.render(_template, {carteranormal: data.carteranormal}));
                        divCarterasNormales.find('input.txt-currency').toTxtCurrency();
                        divCarterasNormales.find('td.td-currency').tdCurrency();
                    });
                } else {
                    divCarterasNormales.html('<p class="pMensaje">La suscripción no tiene registros de cartera normal</p>');
                }

                break;
        }
    },
    /**
     * Limpia formulario e información cargada.
     * @returns {void}
     */
    limpiarFormulario: function () {
        $('#divCabecera').find('input[type="text"]').val('');
        $('#divCarterasFinanciadas').html('');
        $('#divValoresFinanciadas').html('');
        $('#divCarterasNormales').html('');
        $('#fsValoresFinanciada, #fsCarteraFinanciada, #fsCarteraNormal, #btnImprimir').hide();
    }
};

estadoCuentaVista.init();