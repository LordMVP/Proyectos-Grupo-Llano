/**
 * @fileOverview Archivo de vista y control de reestructuración de financiación
 * @author AppFuture
 * @requires control.js
 * @requires modelo.js
 * @version 1.0.0
 */
/**
 * Objeto que hace referencia al namespace reestructuracionVista
 * @type {Object}
 */
var that = null;

/** @namespace */
var reestructuracionVista = {
    /** Hace referencia al último dialogo abierto en la aplicación
     * @type {object}
     */
    dialogoActual: null,
    /**Inicializa el programa de financiación, y asigna listeners a los controles
     * @returns {void}
     */
    init: function () {
        that = this;
        $('button#btnSuscripcion').on('click', that.mostrarFiltro);
        $('#btnCancelar').on('click', that.cancelarReestructuracion);
        $('#btnCargarFinanciaciones').on('click', that.consultarFinanciaciones);
        $('#btnCalcular').on('click', _that.calcularAmortizacion);
        $('#btnGrabar').on('click', that.validarReestructuracion);
        $('#btnImprimir').on('click', that.imprimir);
        $('#txtFechaActualImprimir').val($('#txtFechaActualImprimir').attr('value'))
        __dom.configurarTextoNumerico('txtFiltroSus');
    },
    /**Valida la información de suscripción y financiaciones  que se pueden imprimir
     * @returns {void}
     */
    imprimir: function () {
        if (!reestructurarModel.suscripcion) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarSuscripcion, __app.mensajes.atencion);
            return;
        }
        var tabla = $('#tblReestructuracion tbody tr');
        var financiacionSelect = tabla.find('td[header="thSeleccion"] input[type="checkbox"]:checked');
        if (financiacionSelect.length === 0) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarFinanciacion, __app.mensajes.atencion);
            return;
        }
        var f = tabla.find('td[header="thSeleccion"] input[type="checkbox"]').not(financiacionSelect);
        f.parent().parent().hide();
        window.print();
        f.parent().parent().show();
    },
    /** Muestra un dialogo con el formulario para la búsqueda de las suscripciones
     * @returns {void}
     */
    mostrarFiltro: function () {
        var filtro = $('div#camposBuscarSuscripcion');
        that.dialogoActual = filtro.dialogo({
            modal: true,
            width: 850,
            title: 'Buscar un suscriptor',
            buttons: {
                Buscar: that.filtrarSuscriptor
            }
        });
    },
    /** Valida la información del filtro de suscripción y envía la solicitud al servidor
     * @returns {void}
     */
    filtrarSuscriptor: function () {
        var filtro = $('div#camposBuscarSuscripcion');
        var suscripcion = filtro.find('#txtFiltroSus').val().trim();
        var doc = filtro.find('#txtFiltroDoc').val().trim();
        var codAnt = filtro.find('#txtFiltroCodAnt').val().trim();
        if (suscripcion === '' && doc === '' && codAnt === '') {
            filtro.find('#spanMensaje').text(__app.mensajes.camposInvalidosFiltro).show();
        } else {
            var data = {
                documento: doc,
                codAnterior: codAnt,
                idSuscripcion: suscripcion
            };
            control.consultarSuscripciones(data, that.consultaSuscripcionCompleto);
        }
    },
    /** Captura la respuesta enviada por el servidor, cuando se consultan las suscripciones.
     * @param  {object} data - El resultado de la petición ajax para guardar la información de la suscripción
     * @returns {void}
     */
    consultaSuscripcionCompleto: function (data) {

        switch (data.codigoRespuesta) {
            case 0:
                that.dialogoActual.find('#spanMensaje').show().text(data.mensaje);
                break;
            case 1:
                var sus = null;
                that.limpiarFormulario();
                if (data.suscripciones.length > 1) {
                    that.dialogoActual.find('div.listaSeleccion').remove();
                    var divSuscripciones = $('<div>').addClass('listaSeleccion');
                    $.each(data.suscripciones, function (s, susc) {
                        var div = $('<div>');
                        var radio = $('<input type="radio">');
                        radio.val(susc.idsuscripcion);
                        radio.attr('id', 'radio_susc_' + s);
                        radio.attr('data-indice', s);
                        radio.attr('name', 'radio_suscripciones');
                        var label = $('<label>').attr('for', 'radio_susc_' + s);
                        label.text(susc.documento + ' - ' + susc.nombre + ' - suscripción: ' + susc.idsuscripcion
                                + ' - Cód Anterior: ' + susc.codanterior
                                + ' - Tipo Suscripción: ' + susc.tiposuscripcion);
                        div.append(radio).append(label);
                        divSuscripciones.append(div);
                    });
                    var btn = $('<button>').text('Seleccionar').addClass('btnSimple');
                    btn.on('click', function () {
                        var suscSeleccionada = that.dialogoActual.find('input[name="radio_suscripciones"]:checked');
                        if (suscSeleccionada.length > 0) {
                            sus = reestructurarModel.suscripcion = data.suscripciones[parseInt(suscSeleccionada.attr('data-indice'))];
                            that.dialogoActual.find('#spanMensaje').hide();
                            that.dialogoActual.dialog('close');
                            divSuscripciones.remove();
                            that.cargarCabecera(sus, data.suscripciones);
                        } else {
                            that.dialogoActual.find('#spanMensaje').text(__app.mensajes.seleccionarOpcion).show();
                        }
                    });
                    divSuscripciones.insertAfter(that.dialogoActual.find('#spanMensaje'));
                    divSuscripciones.append(btn);
                } else {
                    sus = reestructurarModel.suscripcion = data.suscripciones[0];
                    that.dialogoActual.find('#spanMensaje').hide();
                    that.dialogoActual.dialog('close');
                    that.cargarCabecera(sus);
                }
                break;
        }
    },
    /** Carga la cabecera del formulario con los datos de la suscripción seleccionada.
     * @returns {void}
     */
    cargarCabecera: function (sus) {
        var cabecera = $('#cabecera');
        $('#txtSuscripcion, #txtSuscripcionImprimir').val(sus.idsuscripcion);
        cabecera.find('#txtCodAnterior').val(sus.codanterior);
        cabecera.find('#txtDocumento').val(sus.documento);
        $('#txtDireccionImprimir').val(sus.direccion);
        $('#txtNombre, #txtPropietarioImprimir').val(sus.nombre);
        cabecera.find('#txtTipoSuscripcion').val(sus.tiposuscripcion).attr('data-id', sus.idtiposuscripcion);
        control.consultarDiasPeriodo({idsuscripcion: sus.idsuscripcion}, that.onConsultarDiasPeriodo);
    },
    /**
     * Se ejecuta cuando se terminan de consultar los días del período
     * @param  {Object} data La respuesta del servidor
     * @returns {void}
     */
    onConsultarDiasPeriodo: function (data) {
        if (data.codigoRespuesta > 0) {
            reestructurarModel.diasterminoperiodo = data.diasterminoperiodo;
        }
    },
    /** Hace petición AJAX para consulta las financiaciones de la suscripción seleccionada.
     * @returns {void}
     */
    consultarFinanciaciones: function () {
        if (!!reestructurarModel.suscripcion) {
            control.consultarFinanciaciones({'idSuscripcion': reestructurarModel.suscripcion.idsuscripcion},
                    that.consultarFinanciacionCompleto);
        } else {
            __dom.lanzarAlerta(
                    __app.mensajes.seleccionarSuscripcion,
                    __app.mensajes.atencion);
        }
    },
    /** Captura la respuesta del servidor cuando se consultan las financiaciones de una suscripción.
     * Visualiza las financiaciones en una tabla y configura listeners de elementos.
     * @returns {void}
     */
    consultarFinanciacionCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                break;
            case 1:
                if (data.tablaFinanciacion.length > 0) {
                    reestructurarModel.financiaciones = data.tablaFinanciacion;
                    var tblReestructuracion = fillTable("tblReestructuracion", "formatoFinanciaciones", "reestructurarModel.financiaciones", "Reestructurar Financiaciones").show();
                    tblReestructuracion.find('#check_general_tblReestructuracion_0').off('click').hide();
                    var txtCuota = tblReestructuracion.find('td[header="thNuevasCuotas"] input');
                    var btnSimulador = tblReestructuracion.find('td[header="thSimulador"] input:button');
                    var cmbLiquidacion = tblReestructuracion.find('td select').attr('disabled', 'disabled');
                    //tblReestructuracion.find('select').html(reestructurarModel.opcionesLiquidacion).attr('disabled', 'disabled');
                    txtCuota.on('blur', that.validarCuotas);
                    __dom.configurarTextoNumerico(txtCuota);
                    cmbLiquidacion.on('change', that.validarLiquidacion);
                    btnSimulador.attr('disabled', 'disabled').on('click', that.mostrarSimulador);
                    tblReestructuracion.find('td[header="thSeleccion"] input').on('click', that.validarFinanciacionesSeleccionada);
                    txtCuota.attr({
                        'min': 1,
                        'max': 1,
                        'step': '1',
                        'type': 'number',
                        'disabled': 'disabled'
                    });
                }
                break;
        }
    },
    /**
     * Valida la liquidación que se a seleccionado de una financiación
     * Y hace petición ajax para consultar la tasa de interés de la misma
     * @returns {void}
     */
    validarLiquidacion: function () {
        var _this = $(this);
        var fila = $(_this.parents('tr')[0]);
        var txtCuota = fila.find('td[header="thNuevasCuotas"] input');
        var idfinanciacion = fila.find('td[header="thIdFinanciacion"]').text();
        if (_this.val() === '-1') {
            txtCuota.attr('max', 1);
            return;
        }
        var option = _this.find('option:selected');
        var infoLiquidacion = control.consultarLiquidacionFacturaPorId(idfinanciacion, _this.val());
        if (!option.attr('data-interes')) {
            control.consultarInteres({idliquidacion: _this.val()}, function (data) {
                if (data.codigoRespuesta === 1) {
                    option.attr('data-iva', data.interesiva);
                    option.attr('data-interes', data.interes);
                }
            });
        }
        option.attr('tipo-cuota', infoLiquidacion.tipocuota)
        option.attr('data-plazo', infoLiquidacion.maximoplazou);
        txtCuota.attr('max', infoLiquidacion.maximoplazou);
        txtCuota.blur();
    },
    /** Valida información para mostrar un cuadro de dialogo con el simulador de amortización para la financiación 
     * seleccionada.
     * @returns {void}
     */
    mostrarSimulador: function () {
        var fila = $(this).parent().parent();
        var filtro = $('div#divSimulador');
        var txtCuotas = fila.find('td[header="thNuevasCuotas"] input');
        var cmbLiquidacion = fila.find('td[header="thNuevaLiquidacion"] select');
        var txtCuotasAmortizadas = fila.find('td[header="thCuotasAmortizadas"]').text();
        var liquidacion =cmbLiquidacion.find('option:selected');
        var interesiva = liquidacion.attr('data-iva');
        var interes = liquidacion.attr('data-interes');
        var tipocuota = liquidacion.attr('tipo-cuota');

        $('#txtCapitalInicial').val(fila.find('td[header="thSdoCapital"]').attr('data-valor'));
        if (!interes) {
            __dom.lanzarAlerta('No se encontró tasa de interés para la liquidación', __app.mensajes.atencion, function () {
                cmbLiquidacion.focus();
            });
            return;
        }
        if (txtCuotas.val() === '') {
            txtCuotas.focus();
        }
        $("#divSimulador table").empty();
        $('#txtNumeroCuotas').val(txtCuotas.val());
        $('#txtIntereses').val(interes).attr('data-iva', interesiva).attr('tipo-cuota', tipocuota);
        $('#txtCuotasAmortizadas').val(txtCuotasAmortizadas);
        _that.calcularAmortizacion(reestructurarModel);
        $('#txtVlrCuotaMensualImprimir, #txtVlrPrimerCuotaImprimir').val(reestructurarModel.valorCuota).toTxtCurrency();
        that.dialogoActual = filtro.dialogo({
            width: 700,
            modal: true,
            title: 'Simulador de financiación',
            buttons: {
                Imprimir: that.imprimirSimulador,
                Cerrar: function () {
                    that.dialogoActual.dialog('close');
                }
            }
        });
    },
    /**
     * Imprime la tabla que simula la amortización de la financiación
     * @returns {void}
     */
    imprimirSimulador: function () {
        var logo = sessionStorage.getItem('logoEmpresa');
        var frame = document.getElementById('iframePrint');
        var c = frame.contentDocument.getElementById('contenido');
        frame.contentDocument.getElementById('title').innerText = 'Reestructurar financiaciones';
        var cp = document.getElementById('divSimulador').cloneNode(true);
        while (c.firstChild) {
            c.removeChild(c.firstChild);
        }
        c.appendChild(cp);
        $(c).find('#imgLogo').attr('src', '/achagua/img/logos_empresas/'+logo);
        $(c).find('#divSimulador').removeAttr('style');
        $(c).find('.inputImpresion').parent().removeAttr('style');

        var w = frame.contentWindow;
        w.focus();
        w.print();
    },
    /** Valida que las cuotas estén entre 1 y 24
     * @returns {void}
     */
    validarCuotas: function (e) {
        var _this = $(this);
        var tr = _this.parents('tr:eq(0)');
        var cuotas = parseInt(_this.val());
        var plazo = parseInt(tr.find('select option:selected').attr('data-plazo'));
        plazo = isNaN(plazo) ? 1 : plazo;
        if (cuotas > plazo) {
            _this.val(plazo).focus().select();
        } else if (cuotas < 1) {
            _this.val('1').focus().select();
        }
    },
    /** Revisa cuando una financiación es seleccionada/deseleccionada para habilitar o deshabilitar los controles
     * según sea el caso. Valida valor financiable
     * @returns {void}
     */
    validarFinanciacionesSeleccionada: function () {
        var check = $(this);
        var trSeleccionada = check.parent().parent().removeClass('selected');
        trSeleccionada.find('input:button, select').attr('disabled', 'disabled');
        var numCuotas = parseInt(trSeleccionada.find('td[header="thCuotasPendientes"]').text());
        trSeleccionada.find('td[header="thNuevasCuotas"] input').attr('disabled', 'disabled').val(numCuotas);
        //.val(trSeleccionada.find('td[header="thLiquidacion"]').attr('data-value'));
        if (check.is(':checked')) {
            trSeleccionada.addClass('selected');
            var txtCuotas = trSeleccionada.find('input[type="number"]');
            txtCuotas.removeAttr('disabled').blur();
            trSeleccionada.find('input[type="button"], select').removeAttr('disabled');
            return;
        }
    },
    /** Confirma si el usuario desea cancelar la reestructuración actual
     * @returns {void}
     */
    cancelarReestructuracion: function () {
        if (!!reestructurarModel.suscripcion) {
            __dom.lanzarAlerta(
                    __app.mensajes.confirmacionCancelacion,
                    __app.mensajes.atencion,
                    that.limpiarFormulario, true);
        }
    },
    /** Limpia los valores de los formularios, la tabla y el modelo
     * @returns {void}
     */
    limpiarFormulario: function () {
        $('input[type="text"]').not('#txtFechaActualImprimir').val('');
        $('#tblReestructuracion').html('');
        reestructurarModel = {
            suscripcion: null,
            financiaciones: null,
            opcionesLiquidacion: null
        };
    },
    /** Valida la información del documento de pago en caso de ser todo correcto y completo hace petición al servidor para guardar reestructuración
     * @returns {void}
     */
    validarReestructuracion: function () {
        if (!reestructurarModel.suscripcion) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarSuscripcion, __app.mensajes.atencion);
            return;
        }
        var financiacionSelect = $('#tblReestructuracion tbody tr td[header="thSeleccion"] input[type="checkbox"]:checked');
        if (!reestructurarModel.financiaciones || financiacionSelect.length === 0) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarFinanciacion, __app.mensajes.atencion);
            return;
        }

        for (var i = 0; i < financiacionSelect.length; i++) {
            var seleccionada = $(financiacionSelect[i]);
            var trPadre = seleccionada.parent().parent();
            var opcion = trPadre.find('td[header="thNuevaLiquidacion"] select').val();
            if (opcion === '-1' || !opcion) {
                var idFinanciacion = trPadre.find('td[header="thIdFinanciacion"]').text();
                __dom.lanzarAlerta('Debe seleccionar la liquidación a reestructurar, para la financiación ' + idFinanciacion, __app.mensajes.atencion);
                return;
            }
        }

        var financiaciones = [];
        $.each(financiacionSelect, function (f, fin) {
            fin = $(fin);
            var fila = fin.parent().parent();
            var idAmortizacion = 0;
            $.each(reestructurarModel.financiaciones, function (rf, rfin) {
                if (fin.val() == rfin.idfinanciacion) {
                    idAmortizacion = rfin.idamortizacionfinanciacion;
                }
            });
            financiaciones.push({
                idfinanciacion: fin.val(),
                idamortizacionfinanciacion: idAmortizacion,
                numerocuotasareestructurar: parseInt(fila.find('td[header="thNuevasCuotas"] input').val()),
                idliquidacion: fila.find('td[header="thNuevaLiquidacion"] select option:selected').val()
            });
        });
        control.guardarReestructuracion({reestructuracion: financiaciones}, that.guardarReestructuracionCompleto);
    },
    /** Captura la respuesta del servidor cuando se guarda reestructuración de financiación
     * @param {object} data - Respuesta del servidor al guardar reestructuración
     * @returns {void}
     */
    guardarReestructuracionCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(__app.mensajes.errorGuardarReestructuracion, __app.mensajes.tituloErrorInesperado);
                break;
            case 1:
                __dom.lanzarAlerta(__app.mensajes.registroExitoso, __app.mensajes.tituloExito);
                that.limpiarFormulario();
                break;
        }
    }
};

reestructuracionVista.init();
