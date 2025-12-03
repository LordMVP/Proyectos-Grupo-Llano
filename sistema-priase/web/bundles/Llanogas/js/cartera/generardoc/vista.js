/**
 * @fileOverview Archivo de vista y control para generar documento de pago
 * @author AppFuture
 * @requires generar.control.js
 * @requires generar.modelo.js
 * @version 1.0.0
 */
/**
 * Objeto que hace referencia al namespace generarDocVista
 * @type {Object}
 */
var that = null;
/** @namespace */
var generarDocVista = {
    /** Hace referencia al último dialogo abierto en la aplicación
     * @type {object}
     */
    dialogoActual: null,
    /**Inicializa el programa de generación de documento de pago, y asigna listeners a los controles
     * @returns {void}
     */
    init: function () {
        that = this;
        $('button#btnSuscripcion').on('click', that.mostrarFiltro);
        $('#btnCancelar').on('click', that.cancelarReestructuracion);
        $('#btnCargarFinanciaciones').on('click', that.consultarFinanciaciones);
        $('#btnCalcular').on('click', _that.calcularAmortizacion);
        $('#btnGrabar').on('click', that.validarGenerarDocumento);
        $('#btnImprimir').on('click', that.imprimir);
        __dom.configurarTextoNumerico('txtFiltroSus');
    },
    /**Valida la información de suscripción y financiaciones  que se puede imprimir
     * e imprime la financiaciones y conceptos
     * @returns {void}
     */
    imprimir: function () {
        if (!generarDocModel.suscripcion) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarSuscripcion, __app.mensajes.atencion);
            return;
        }
        var financiacionSelect = $('#tblFinanciaciones tbody tr td[header="thSeleccion"] input[type="checkbox"]:checked');
        if (!generarDocModel.financiaciones || financiacionSelect.length === 0) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarFinanciacion, __app.mensajes.atencion);
            return;
        }
        that.mostrarConcepto();
        if (generarDocModel.concepto.length > 0) {
            fillTable('tblConceptosImprimir', 'formatoConceptos', 'generarDocModel.concepto', 'Conceptos').show();
            $('#tblConceptosImprimir').css({'color': '#000'});
        }
        window.print();
        $('#tblConceptosImprimir').hide();
    },
    /** Mira los conceptos de las financiaciones y los agrupa en un arreglo
     * @returns {object} generarDocModel.concepto - Conceptos de las financiaciones seleccionadas
     */
    mostrarConcepto: function () {
        generarDocModel.concepto = [];
        for (var i = 0; i < generarDocModel.conceptosFinanciacion.length; i++) {
            var info = generarDocModel.conceptosFinanciacion[i];
            for (var j = 0; j < info.conceptos.length; j++) {
                generarDocModel.concepto.push(info.conceptos[j]);
            }
            ;
        }
        return generarDocModel.concepto;
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
                idSuscripcion: suscripcion,
                documento: doc,
                codAnterior: codAnt
            };
            control.consultarSuscripciones(data, that.consultaSuscripcionCompleto);
        }
    },
    /** Captura la respuesta enviada por el servidor, cuando se consultan las suscripciones.
     * En caso de llegar varias suscripciones posibilita la selección de una.
     * @param  {object} data - El resultado de la petición ajax para guardar la información de la suscripción
     * @returns {void}
     */
    consultaSuscripcionCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                that.dialogoActual.find('#spanMensaje').text(data.mensajeError).show();
                break;
            case 1:
                var sus = null;
                generarDocModel.aplicaint_par = data.parametros.abono_parcial;
                generarDocModel.aplicaint_tot = data.parametros.int_abon_total; 
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
                    var btn = $('<button>').text('seleccionar').addClass('btnSimple');
                    btn.on('click', function () {
                        var suscSeleccionada = that.dialogoActual.find('input[name="radio_suscripciones"]:checked');
                        if (suscSeleccionada.length > 0) {
                            sus = data.suscripciones[parseInt(suscSeleccionada.attr('data-indice'))];
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
                    sus = data.suscripciones[0];
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
        that.limpiarFormulario();
        var cabecera = $('#cabecera');
        generarDocModel.suscripcion = sus;
        $('#txtDireccionImprimir').val(sus.direccion);
        cabecera.find('#txtDocumento').val(sus.documento);
        cabecera.find('#txtCodAnterior').val(sus.codanterior);
        $('#txtNombre, #txtPropietarioImprimir').val(sus.nombre);
        $('#txtSuscripcion, #txtSuscripcionImprimir').val(sus.idsuscripcion);
        cabecera.find('#txtTipoSuscripcion').val(sus.tiposuscripcion).attr('data-id', sus.idtiposuscripcion);
        control.consultarDiasPeriodo({idsuscripcion: sus.idsuscripcion}, that.onConsultarDiasPeriodo);
    },

    /**
     * Se ejecuta cuando se terminan de consultar los días del período.
     * @param  {Object} data La respuesta del servidor  
     * @returns {void}
     */
    onConsultarDiasPeriodo: function (data) {
        if (data.codigoRespuesta > 0) {
            generarDocModel.diasterminoperiodo = data.diasterminoperiodo;
        }
    },
    /** Hace petición AJAX para consulta las financiaciones de una suscripción seleccionada.
     * @returns {void}
     */
    consultarFinanciaciones: function () {
        if (!!generarDocModel.suscripcion) {
            var data = {
                'idSuscripcion': generarDocModel.suscripcion.idsuscripcion
            };
            control.consultarFinanciaciones(data, that.consultarFinanciacionCompleto);
        } else {
            __dom.lanzarAlerta(__app.mensajes.seleccionarSuscripcion, __app.mensajes.atencion);
        }
    },
    /** Captura la respuesta del servidor cuando se consultan las financiaciones de una suscripción.
     * Visualiza las financiaciones en una tabla y configura listeners de elementos.
     * @param {object} data - Respuesta del servidor con financiaciones de la suscripción
     * @returns {void}
     */
    consultarFinanciacionCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(__app.mensajes.sinResultados, __app.mensajes.atencion);
                break;
            case 1:
                if (data.tablaFinanciacion.length > 0) {
                    generarDocModel.financiaciones = data.tablaFinanciacion;
                    var opcionesLiquidacion = "";
                    /*$.each(data.liquidaciones, function(l, liq) {
                     opcionesLiquidacion += '<option value="' + liq.idliquidacion + '" title="' + liq.liquidacion + '">' + liq.liquidacion + '</option>';
                     });*/
                    generarDocModel.opcionesLiquidacion = opcionesLiquidacion;
                    var tblFinanciaciones = fillTable("tblFinanciaciones", "formatoFinanciaciones", "generarDocModel.financiaciones", "Financiaciones");
                    tblFinanciaciones.find('#check_general_tblFinanciaciones_0').off('click').hide();
                    tblFinanciaciones.find('input[type="button"]').attr('disabled', 'disabled');
                    tblFinanciaciones.find('select').html(generarDocModel.opcionesLiquidacion).attr('disabled', 'disabled');
                    tblFinanciaciones.find('td[header="thConcepto"] input[type="button"]').on('click', that.mostrarConceptos);
                    tblFinanciaciones.find('td[header="thSimulador"] input[type="button"]').on('click', that.mostrarSimulador);
                    __dom.configurarTextoNumerico('tblFinanciaciones tbody tr td[header="thVlrDocPago"] input')
                            .attr('disabled', 'disabled')
                            .focusout(that.validarDocumentoPago);
                    __dom.configurarTextoNumerico('tblFinanciaciones tbody tr td[header="thNuevasCuotas"] input')
                            .attr({
                                'disabled': 'disabled',
                                'type': 'number',
                                'step': '1',
                                'min': 0,
                                'max': 24
                            })
                            .focusout(that.validarCuotas);
                    tblFinanciaciones.find('tbody tr td[header="thSeleccion"] input').on('click', that.validarFinanciacionesSeleccionada);
                    tblFinanciaciones.show();
                    //actualizar saldos de las filas
                    tblFinanciaciones.find('tbody tr').each(function (t, fila) {
                        fila = $(fila);
                        var saldoCapital = parseFloat(fila.find('td[header="thSdoCapital"]').attr('data-valor'));
                        var total = parseFloat(fila.find('td[header="thVlrDocPago"] input')[0].value);
                        fila.find('td[header="thNuevoSaldo"]').attr('data-valor');
                        var nuevoSaldo = (saldoCapital - total).toString();
                        fila.find('td[header="thNuevoSaldo"]').attr('data-valor', nuevoSaldo).text(nuevoSaldo.toCurrency());
                    });
                }
                break;
        }
    },
    /** Valida información para mostrar un cuadro de dialogo con el simulador de amortización para la financiación 
     * seleccionada. Permite la impresión del mismo.
     * @returns {void}
     */
    mostrarSimulador: function () {
        var filtro = $('div#divSimulador');
        var fila = $(this).parent().parent();

        var vlrDocumento = fila.find('td[header="thVlrDocPago"] input').val();
        var liquidacion = fila.find('td[header="thLiquidacion"]').attr('data-value');
        var tipocuota = fila.find('td[header="thIdFinanciacion"]').attr('data-value');
        var cantidadCuotas = parseInt(fila.find('td[header="thNuevasCuotas"] input').val());
        var valorFinanciacion = parseInt(fila.find('td[header="thNuevoSaldo"]').attr('data-valor'));

        if (isNaN(valorFinanciacion) || valorFinanciacion <= 0) {
            __dom.lanzarAlertaOk('La financiación está saldada y no se puede simular la amortización.', __app.mensajes.atencion);
            return;
        }
        if (isNaN(cantidadCuotas) || cantidadCuotas <= 0) {
            __dom.lanzarAlertaOk('No hay cuotas para financiar', __app.mensajes.atencion);
            return;
        }

        $('#txtNumeroCuotas').val(cantidadCuotas);
        $('#txtCapitalInicial').val(valorFinanciacion);
        var info = control.consultarInteres({idliquidacion: liquidacion});
        $('#txtIntereses').val(info.interes).attr('data-iva', info.interesiva).attr('tipo-cuota', tipocuota);
        $('#txtCuotaInicialImprimir').val(vlrDocumento.toString().toCurrency());

        if (_that.calcularAmortizacion(generarDocModel)) {
            $("#cuerpo tr").remove();
            var cuota = generarDocModel.valorCuota;
            $('#txtVlrCuotaMensualImprimir, #txtVlrPrimerCuotaImprimir').val(cuota.toString().toCurrency());
            that.dialogoActual = filtro.dialogo({
                modal: true,
                width: 700,
                position: {my: "center", at: "top+30", of: "body"},
                title: 'Simulador de financiación',
                buttons: {
                    Imprimir: that.imprimirSimulador,
                    Cerrar: function () {
                        that.dialogoActual.dialog('close');
                    }
                }
            });
        }
    },

    /**
     * Configura la hoja para impresión del simulador de crédito e invoca la ventana de impresión.
     * @returns {void}
     */
    imprimirSimulador: function () {
        var logo = sessionStorage.getItem('logoEmpresa');
        var frame = document.getElementById('iframePrint');
        var c = frame.contentDocument.getElementById('divBody');
        frame.contentDocument.getElementById('title').innerText = 'Generación de documento de pago';
        var cp = document.getElementById('divSimulador').cloneNode(true);
        /*while ($(c).find('#contenido')[0].firstChild) {
            $(c).find('#contenido')[0].removeChild(c.firstChild);
        }*/
        
        //Modificacion para impresion
        if ( $(c).find('#contenido')[0].hasChildNodes() ) {
            while ( $(c).find('#contenido')[0].childNodes.length >= 1 ) {
                $(c).find('#contenido')[0].removeChild( $(c).find('#contenido')[0].firstChild );
            }
        }
        
        $(c).find('#contenido')[0].appendChild(cp);
        $(c).find('#imgLogo').attr('src', '/achagua/img/logos_empresas/'+logo);
        $(c).find('#divSimulador').removeAttr('style');
        $(c).find('.inputImpresion').parent().removeAttr('style');
        var w = frame.contentWindow;
        w.focus();
        w.print();

    },
    /** Hace petición ajax para consultar los conceptos de una financiación
     * @returns {void}
     */
    mostrarConceptos: function () {
        var _this = $(this);
        generarDocModel.filaConcepto = _this.parent().parent().attr('data-fila');
        control.consultarConceptos({idfinanciacion: _this.attr('data-id')},
                that.onMostrarConceptosCompleto);
    },
    /** Captura la respuesta enviada por el servidor, cuando se consultan los conceptos de una financiación y 
     * lo muestra en un dialogo en caso de que la financiación ya tenga conceptos seleccionados los chequea.
     * @param  {object} data - El resultado de la petición ajax para guardar los conceptos de la financiación
     * @returns {void}
     */
    onMostrarConceptosCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(__app.mensajes.sinResultados, __app.mensajes.atencion);
                break;
            case 1:
                generarDocModel.concepto = data.conceptos;
                var tabla = fillTable('tblConceptos', 'formatoConceptos', 'generarDocModel.concepto', 'Conceptos');
                tabla.find('td[header="thSeleccion"] input[type="checkbox"]').on('click', that.seleccionarConcepto);
                var conceptosFinanciacion = control.consultarConceptosFila(generarDocModel.filaConcepto);
                for (var i = 0; i < conceptosFinanciacion.length; i++) {
                    var info = conceptosFinanciacion[i];
                    var checked = tabla.find('td[header="thSeleccion"] input[type="checkbox"]');
                    if (checked.length > 0) {
                        $.each(checked, function (i, check) {
                            for (var j = 0; j < info.conceptos.length; j++) {
                                if ($(check).parent().attr('data-value') == info.conceptos[j].iddetallefinanciacion) {
                                    $(check).click();
                                    check.checked = true;
                                    break;
                                }
                            }
                        });
                    }
                }
                var filtro = $('div#divConceptos');
                that.dialogoActual = filtro.dialogo({
                    modal: true,
                    width: 850,
                    title: 'Conceptos',
                    buttons: {
                        Aceptar: that.actualizarConceptos,
                        Cancelar: function () {
                            that.dialogoActual.dialog('close');
                        }
                    }
                });
                break;
        }
    },
    /** Guarda los conceptos de una financiación y actualiza el valor del documento de pago
     * @returns {void}
     */
    actualizarConceptos: function () {
        var fila = $('#tblFinanciaciones tbody tr[data-fila="' + generarDocModel.filaConcepto + '"]');


        var total = $('#txtTotalFinanciarConcepto').attr('data-valor') !== '' ? parseFloat($('#txtTotalFinanciarConcepto').attr('data-valor')) : 0;
        var saldoCapital = parseFloat(fila.find('td[header="thSdoCapital"]').attr('data-valor'));
        var cuota = parseInt(fila.find('td[header="thNumCuotas"]').text());
        fila.find('td[header="thVlrDocPago"] input[type="text"]')
                .val((total > 0) ? total : saldoCapital)
                .attr('disabled', (total > 0)).focus();
        //actualizar el nuevo saldo
        var nuevoSaldo = (saldoCapital - total).toString();
        fila.find('td[header="thNuevoSaldo"]').attr('data-valor', nuevoSaldo).text(nuevoSaldo.toCurrency());
        var cuotas = fila.find('td[header="thNuevasCuotas"] input');
        if (saldoCapital == total || (total == 0 && !isNaN(total))) {
            cuotas.val('0').attr('disabled', true);
        } else {
            cuotas.val(cuota).attr('disabled', false).attr('min', 1);
        }
        for (var i = 0; i < generarDocModel.conceptosFinanciacion.length; i++) {
            var info = generarDocModel.conceptosFinanciacion[i];
            if (info.fila === generarDocModel.filaConcepto) {
                generarDocModel.conceptosFinanciacion.splice(i, 1);
            }
        }
        if (!!generarDocModel.conceptosInfo) {
            generarDocModel.conceptosFinanciacion.push({fila: generarDocModel.filaConcepto,
                total: total,
                conceptos: generarDocModel.conceptosInfo});
        }
        that.actualizarSumatoria();
        $('#txtTotalFinanciarConcepto').attr('data-valor', '').val('');
        that.dialogoActual.dialog('close');
        generarDocModel.conceptosInfo = [];
    },
    /** Actualiza la sumatoria de los conceptos por financiación seleccionados
     * @returns {void}
     */
    seleccionarConcepto: function () {
        var totalConcepto = 0;
        generarDocModel.conceptosInfo = [];
        var conceptosSeleccionados = $('#tblConceptos tbody tr.selected');

        for (var indice = 0; indice < conceptosSeleccionados.length; indice++) {
            var fila = $(conceptosSeleccionados[indice]);
            var saldo = parseFloat(fila.find('td[header="thSaldo"]').attr('data-valor'));
            var concepto = {
                saldo: saldo,
                nombre: fila.find('td[header="thNombre"]').text(),
                idconcepto: fila.find('td[header="thSeleccion"] input').val(),
                iddetallefinanciacion: fila.find('td[header="thSeleccion"]').attr('data-value')
            };
            generarDocModel.conceptosInfo.push(concepto);
            totalConcepto = parseFloat(totalConcepto + saldo);
        }
        $('#txtTotalFinanciarConcepto').attr('data-valor', totalConcepto).val(totalConcepto).toTxtCurrency();
    },
    /**Valida el formulario del documento de pago y actualiza la sumatoria para el documento de pago.
     * @returns {void}
     */
    validarDocumentoPago: function () {
        var _this = $(this);
        var doc = parseFloat(_this.val());
        var fila = _this.parent().parent();
        var cuotas = fila.find('td[header="thCuotasPendientes"]');
        var txtNuevaCuota = fila.find('td[header="thNuevasCuotas"] input');
        var saldoCapital = parseFloat(fila.find('td[header="thSdoCapital"]').attr('data-valor'));
        if (doc < 1) {
            _this.val(1).focus().select();
            return;
        }
        if (doc > saldoCapital) {
            _this.val(saldoCapital).focus().select();
            return;
        }
        if (doc < saldoCapital) {
            var plazomaximo = parseInt(cuotas.attr('data-value'));
            var cuotaspendiente = parseInt(cuotas.text());
            var maximo = cuotaspendiente > plazomaximo ? plazomaximo : cuotaspendiente;
            txtNuevaCuota.val(maximo).attr('max', maximo).removeAttr('disabled');
        }
        if (doc === saldoCapital) {
            txtNuevaCuota.val('0').attr('disabled', true);
        }

        var nuevoSaldo = parseFloat(parseFloat(saldoCapital) - parseFloat(_this.val()));
        fila.find('td[header="thNuevoSaldo"]').attr('data-valor', nuevoSaldo).text(nuevoSaldo.toString().toCurrency());
        that.actualizarSumatoria();

    },
    /** Actualiza la sumatoria de las financiaciones
     * @returns {void}
     */
    actualizarSumatoria: function () {
        var sumatoria = 0;
        var inputs = $('#tblFinanciaciones tbody tr.selected td[header="thVlrDocPago"] input');
        $.each(inputs, function (i, input) {
            sumatoria = parseFloat(sumatoria + parseFloat(input.value));
        });
        
        $('#txtTotalReestructuracion').attr('data-valor', sumatoria).val(sumatoria.toString().toCurrency());
        $('#txtTotalCapitalRees').attr('data-valor', sumatoria).val(sumatoria.toString().toCurrency());         
        if(generarDocModel.aplicaint_par === "si" || generarDocModel.aplicaint_tot === "si")
        {
            that.GenerarInteresDocumento();
        }
        else
        {
            var tot_inte = 0 ;
            $('#txtTotalIntRees').attr('data-valor', tot_inte).val(tot_inte.toString().toCurrency());
        }   
    },
    /** Valida que las cuotas estén entre 1 y 24
     * @returns {void}
     */
    validarCuotas: function () {
        var _this = $(this);
        var cuotas = parseInt(_this.val());
        var fila = _this.parent().parent();
        var cuotaspendientes = fila.find('td[header="thCuotasPendientes"]');
        var vlrDocPago = parseFloat(fila.find('td[header="thVlrDocPago"] input').val());
        var saldoCapital = parseFloat(fila.find('td[header="thSdoCapital"]').attr('data-valor'));

        if (vlrDocPago === saldoCapital) {
            _this.val('0').attr('min', 0);
            return;
        }

        var plazomaximo = parseInt(cuotaspendientes.attr('data-value'));
        var cuotaspendiente = parseInt(cuotaspendientes.text());
        if (cuotas > plazomaximo || cuotas > cuotaspendiente) {
            var maximo = cuotaspendiente > plazomaximo ? plazomaximo : cuotaspendiente;
            _this.val(maximo).focus();
            return;
        }
        if (cuotas < 1) {
            var minimo = (vlrDocPago === saldoCapital) ? 0 : 1;
            _this.val(minimo).attr('min', minimo);
            return;
        }

        var nuevoSaldo = parseFloat(parseFloat(saldoCapital) - parseFloat(vlrDocPago));
        fila.find('td[header="thNuevoSaldo"]').attr('data-valor', nuevoSaldo).text(nuevoSaldo.toString().toCurrency());

    },
    /** Revisa cuando una financiación es seleccionada/deseleccionada para habilitar o deshabilitar los controles
     * según sea el caso. Invoca función para la sumatoria de las financiaciones seleccionadas.
     * @returns {void}
     */
    validarFinanciacionesSeleccionada: function () {
        var check = $(this);
        var trSeleccionada = check.parent().parent();
        var indice = parseInt(trSeleccionada.attr('data-fila'));
        if (check.is(':checked')) {
            //No se habilita el número de cuotas porque inicialmente está completo
            trSeleccionada.addClass('selected')
                    .find('td[header="thNuevasCuotas"] input').val(0);
            trSeleccionada.find('td[header="thSimulador"] input[type="button"], td[header="thConcepto"] input[type="button"], td[header="thVlrDocPago"] input[type="text"]')
                    .removeAttr('disabled');
        } else {
            trSeleccionada.removeClass('selected')
                    .find('td[header="thNuevasCuotas"] input')
                    .attr('disabled', 'disabled');
            trSeleccionada.find('td[header="thVlrDocPago"] input')
                    .val(parseFloat(trSeleccionada.find('td[header="thSdoCapital"]').attr('data-valor')));
            trSeleccionada.find('td[header="thSimulador"] input[type="button"],  td[header="thConcepto"] input[type="button"],td[header="thVlrDocPago"] input[type="text"]')
                    .attr('disabled', 'true');
            $('#txtTotalFinanciarConcepto').val('').attr('data-valor', '')
            for (var i = 0; i < generarDocModel.conceptosFinanciacion.length; i++) {
                var f = generarDocModel.conceptosFinanciacion[i];
                if (parseInt(f.fila) == indice) {
                    generarDocModel.conceptosFinanciacion.splice(i, 1);
                }
            }
        }
        that.actualizarSumatoria();
    },
    /** Confirma si el usuario desea cancelar la operación actual
     * @returns {void}
     */
    cancelarReestructuracion: function () {
        var imprimir = $('#btnImprimir').is(':visible');
        if (!!generarDocModel.suscripcion) {
            if (imprimir) {
                that.limpiarFormulario();
                return;
            }
            __dom.lanzarAlerta(
                    __app.mensajes.confirmacionCancelacion,
                    __app.mensajes.atencion,
                    that.limpiarFormulario, true
                    );
        }
    },
    /** Limpia los valores de los formularios, la tabla y el modelo
     * @returns {void}
     */
    limpiarFormulario: function () {
        $('input[type="text"]').not('#txtIntereses, #txtFechaActualImprimir').val('');
        $('#tblFinanciaciones').html('');
        $('#btnImprimir').hide();
        $('#btnGrabar').removeAttr('disabled');
        generarDocModel = {
            suscripcion: null,
            financiaciones: null,
            opcionesLiquidacion: null,
            aplicaint_par : generarDocModel.aplicaint_par ,
            aplicaint_tot : generarDocModel.aplicaint_tot ,
            opcionesLiquidacion: null,
            conceptosFinanciacion: []
        };
    },
    /** Valida la información del documento de pago en caso de ser todo correcto y completo hace petición al servidor para guardar documento
     * @returns {void}
     */
    validarGenerarDocumento: function () {
        if (!generarDocModel.suscripcion) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarSuscripcion, __app.mensajes.atencion);
            return;
        }
        var financiacionSelect = $('#tblFinanciaciones tbody tr td[header="thSeleccion"] input[type="checkbox"]:checked');
        if (!generarDocModel.financiaciones || financiacionSelect.length === 0) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarFinanciacion, __app.mensajes.atencion);
            return;
        }
        for (var i = 0; i < financiacionSelect.length; i++) {
            var fila = $(financiacionSelect[i]).parent().parent();
            var cuota = fila.find('td[header="thNuevasCuotas"] input[type="number"]').val();
            var saldo = parseFloat(fila.find('td[header="thSdoCapital"]').attr('data-valor'));
            var valor = parseFloat(fila.find('td[header="thVlrDocPago"] input[type="text"]').val());
            if (valor < saldo) {
                if (cuota <= 0) {
                    __dom.lanzarAlerta("El número de cuotas no pueden ser 0. ", __app.mensajes.atencion);
                    return;
                }
            }
        }
        var financiaciones = [];
        $.each(financiacionSelect, function (f, fin) {
            fin = $(fin);
            var fila = fin.parent().parent();
            var idAmortizacion = 0;
            $.each(generarDocModel.financiaciones, function (rf, rfin) {
                if (fin.val() == rfin.idfinanciacion) {
                    idAmortizacion = rfin.idamortizacionfinanciacion;
                }
            });
            if (!(parseFloat(fila.find('td[header="thVlrDocPago"] input').val()) == parseFloat(fila.find('td[header="thSdoCapital"]').attr('data-valor')))) {
                var conceptos = control.consultarConceptosFila(fila.attr('data-fila'));
                if (conceptos.length > 0) {
                    conceptos = conceptos[0].conceptos;
                }
            }

            financiaciones.push({
                idamortizacionfinanciacion: idAmortizacion,
                version: fin.parent().attr('data-value'),
                nuevascuotas: parseInt(fila.find('td[header="thNuevasCuotas"] input').val()),
                valordocumento: parseFloat(fila.find('td[header="thVlrDocPago"] input').val()),
                idsuscripcion: generarDocModel.suscripcion.idsuscripcion,
                idsuscriptor: generarDocModel.suscripcion.idsuscriptor,
                idliquidacion: fila.find('td[header="thNuevaLiquidacion"] select option:selected').val(),
                concepto: conceptos
            });
        });
        control.guardarDocumentoPago({financiaciones: financiaciones}, that.guardarDocumentoCompleto);
    },
      /** Captura la respuesta del servidor cuando se guarda documento de pago
     * @param {object} data - Respuesta del servidor al guardar documento
     * @returns {void}
     */
    guardarDocumentoCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta('Ocurrió un error al generar el documento de pago, intente de nuevo', __app.mensajes.tituloErrorInesperado);
                break;
            case 1:
                $('#btnImprimir').show();
                $('#btnGrabar').attr('disabled', 'disabled');
                __dom.lanzarAlerta(__app.mensajes.registroExitoso, __app.mensajes.tituloExito);
                break;
            case -1:
                __dom.lanzarAlerta(data.mensaje || data.mensajeError, __app.mensajes.atencion);
                break;
        }
    },
    /** Valida la información del documento de pago en caso de ser todo correcto y completo hace petición al servidor para guardar documento
     * @returns {void}
     */
    GenerarInteresDocumento: function () {
        var financiacionSelect = $('#tblFinanciaciones tbody tr td[header="thSeleccion"] input[type="checkbox"]:checked');
        var financiaciones = [];
        $.each(financiacionSelect, function (f, fin) {
            fin = $(fin);
            var fila = fin.parent().parent();
            var idAmortizacion = 0;
            $.each(generarDocModel.financiaciones, function (rf, rfin) {
                if (fin.val() == rfin.idfinanciacion) {
                    idAmortizacion = rfin.idamortizacionfinanciacion;
                }
            });
            if (!(parseFloat(fila.find('td[header="thVlrDocPago"] input').val()) == parseFloat(fila.find('td[header="thSdoCapital"]').attr('data-valor')))) {
                var conceptos = control.consultarConceptosFila(fila.attr('data-fila'));
                if (conceptos.length > 0) {
                    conceptos = conceptos[0].conceptos;
                }
            }
            financiaciones.push({
                idamortizacionfinanciacion: idAmortizacion,
                idfinancicaion: fin.val(),
                version: fin.parent().attr('data-value'),
                nuevascuotas: parseInt(fila.find('td[header="thNuevasCuotas"] input').val()),
                valordocumento: parseFloat(fila.find('td[header="thVlrDocPago"] input').val()),
                idsuscripcion: generarDocModel.suscripcion.idsuscripcion,
                idsuscriptor: generarDocModel.suscripcion.idsuscriptor,
                idliquidacion: fila.find('td[header="thNuevaLiquidacion"] select option:selected').val(),
                concepto: conceptos
            });
        });
        if ( financiaciones.length > 0)
        {
             control.generarInteresesDocumentoPago({financiaciones: financiaciones}, that.GenerarInteresDocumentoCompleto);
        }
        else
        {
             var tot_inte = 0;
             $('#txtTotalIntRees').attr('data-valor', tot_inte).val(tot_inte.toString().toCurrency());
        }
       
    },
    /** Captura la respuesta del servidor cuando se guarda documento de pago
     * @param {object} data - Respuesta del servidor al guardar documento
     * @returns {void}
     */
    GenerarInteresDocumentoCompleto: function (data) {
        var tot_inte = 0;
        var tot_capc= 0;
        var tot_capital = ($('#txtTotalReestructuracion').val()) ;
        var tot_capital = parseInt(tot_capital.replace(/[^0-9.-]+/g,""));
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta('Ocurrió un error al generar el interes para el documento de pago, intente de nuevo', __app.mensajes.tituloErrorInesperado);
                break;
            case 1:
                tot_inte = data.valor_interes ;
                tot_capc = data.valor_capital ;
                break;
            case -1:
                __dom.lanzarAlerta(data.mensaje || data.mensajeError, __app.mensajes.atencion);
                break;
        }
        if (tot_capc > 0 )
        {
            tot_capital = tot_capc + tot_inte ;
            $('#txtTotalCapitalRees').attr('data-valor', tot_capc).val(tot_capc.toString().toCurrency()); 
        }
        else 
        {
            tot_capital = tot_capital + tot_inte ; 
        }
        $('#txtTotalIntRees').attr('data-valor', tot_inte).val(tot_inte.toString().toCurrency());
        $('#txtTotalReestructuracion').attr('data-valor', tot_capital).val(tot_capital.toString().toCurrency());                
    }
};
generarDocVista.init();