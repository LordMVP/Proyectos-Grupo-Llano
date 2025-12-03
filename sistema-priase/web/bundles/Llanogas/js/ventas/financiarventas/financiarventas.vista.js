/**
 * @fileOverview Archivo de vista y control de financiación de ventas
 * @author Angélica Gómez
 * @requires financiarventas.control.js
 * @requires financiarventas.modelo.js
 * @version 1.0.0
 */

/**
 * Objeto que hace referencia al namespace financiarVista
 * @type {Object}
 */
var vista = null;
/** @namespace */
var financiarVista = {
    /** Hace referencia al último dialogo abierto en la aplicación
     * @type {object}
     */
    dialogoActual: null,
    /**Inicializa el programa para la financiación de ventas
     * @returns {void}
     */
    init: function () {
        vista = financiarVista;
        $('#divNatural').tabs();
        vista.configurarAutoComplete();
        $('#divTabFinanciaciones').tabs();
        $('#divAdjuntosFinanciacion').tabs();
        vista.fechaactual = $('#txtFecha').val();
        $('#btnBuscar').on('click', vista.mostrarBuscar);
        $('#txtFechaActualImpresion').val(vista.fechaactual);
        $('#btnGrabar').on('click', vista.validarFinanciacion);
        $('#btnBuscarVenta').on('click', vista.validarBusqueda);
        $('#btnCancelar').on('click', vista.cancelarFinanciacion);
        $('#btnVerSimulador').on('click', vista.mostrarSimulador);
        $('#btnSubirArchivos').on('click', vista.actualizarInformacion);
        $('#btnVerDetalleVenta').on('click', vista.mostrarDetalleVenta);
        $('#txtValorCuotaInicial').on('blur', vista.validarCuotaInicial);
        //$('input[data-caja="number"]').on('blur', vista.actualizarTotales);
        $('#txtValorCuotaInicial').on('focus', vista.asignarValorCuotaInicial);
        $('#btnAgregarFinanciacion').on('click', vista.agregarDivisionFinanciacion);
        $('#btnAgregarInfoFinanciera').on('click', vista.showInformacionFinanciera);
         $('#txtFechaIngresoLaboral').on('change',vista.calcularAnoMesxFechaIngreso);
        $('#btnGenerarNumeroPagare').on('click', vista.generarNumeroPagare);
        $('#divArchivosPagare .archivoSubido button').on('click', vista.validarContrato);
        $('#divArchivosContrato .archivoSubido button').on('click', function () {
            impresionVista.validarInfoImprimirContrato($(this), financiarModelo, 'venta');
        }); 
        $('#txtMesesExperienciaEmpresarial, #txtMesesExperienciaLaboral').on('blur', vista.validarMeses);
        vista.appload = new Appload('#txtArchivos', {
            lg: esAppload,
            multiple: true,
            showErrors: true,
            traceErrors: true,
            url: '../adjuntos/',
            showDeleteBtn: true,
            showDownloadBtn: true,
            showUploadButton: false,
            showDiscardButton: false,
            maxSize: 1024 * 1024 * 10,
            showSingleUploadBtn: false,
            fileTypes: ['pdf', 'doc', 'docx']
        });
        $('a.appload-input').css({color: '#FFF'});
        vista.appload.addListener('onsingleupload', vista.subirCompleto);
        vista.appload.addListener('onFileSelected', vista.uploadFile);
        __dom.configurarCalendarioMaxFecha('txtFechaIngresoLaboral');
        __dom.configurarColapsable('.divContenedorColapsable');
        __dom.configurarCalendario('txtFiltroFechaInicio, #txtFiltroFechaFin');
        __dom.configurarTextoNumerico('txtNumCuotas').on('blur', vista.validarCuotas);
        __dom.configurarTextoNumerico('txtFiltroIdPropiedad, #txtFiltroIdSuscripcion');
        __dom.configurarTextoNumerico('txtValorCuotaInicial, input[data-caja="number"]');
        __dom.configurarTextoNumerico('txtFiltroDocumento, #txtFiltroCodigoAnterior, #txtFiltroNumVenta, #txtEfectivo');

        vista.configurarTxtCurrencyHabilitado($('#divFinanciera input[type="text"][data-caja="number"]:not(input[disabled])'));
    },
    /** Calcula Cantidad en Años y Meses dependiendo de la Fecha de ingreso a laborar a hoy
     * @returns {void}
     */
    calcularAnoMesxFechaIngreso: function () {
        var fechaingreso = moment($('#txtFechaIngresoLaboral').val());
        var catidadmeses = moment(Date.now()).diff(fechaingreso, 'month') - moment(Date.now()).diff(fechaingreso, 'year') * 12;
        var catidadanos = moment(Date.now()).diff(fechaingreso, 'year');
        document.getElementById('txtAnioExperienciaLaboral').value = catidadanos;
        document.getElementById('txtMesesExperienciaLaboral').value = catidadmeses;
    },
    /**
     * Asigna eventos a cajas de texto para que convierta su valor en formato moneda
     * @param {object} caja - Objeto jQuery
     * @returns {void}
     */
    configurarTxtCurrencyHabilitado: function (caja) {
        caja.on('blur', function (e) {
            var _input = $(e.currentTarget);
            var valor = isNaN(parseInt(_input.val())) ? 0 : _input.val();
            $(_input).val(valor).toTxtCurrency();
            vista.actualizarTotales();
        });
        caja.on('focus', function (e) {
            var _input = $(e.currentTarget);
            _input.val(_input.attr('title'));
        });
    },
    /**
     * Muestra divisiones para agregar información financiera y permite descargar formato de vinculación a gas
     * @returns {void}
     */
    showInformacionFinanciera: function () {
        $('#divInfoFinanciera').show();
        $('#divArchivoVinculacion').show();
    },
    /** Valida que las cuotas estén entre 1 y el máximo de cuotas posibles
     * @returns {void}
     */
    validarCuotas: function (e) {
        var _this = $(this);
        var cuotas = parseInt(_this.val());
        if (cuotas > financiarModelo.plazomaximo) {
            _this.val(financiarModelo.plazomaximo).focus().select();
            return;
        }
        if (cuotas < 1) {
            _this.val('1').focus().select();
            return;
        }
        $('#txtNumCuotasImpresion').val(cuotas);
    },
    /**
     * Valida que el campo de meses no sea mayor a 11
     * @returns {void}
     */
    validarMeses: function () {
        var _this = $(this);
        if (!isNaN(parseInt(_this.val()))) {
            if (parseInt(_this.val()) > 11) {
                _this.val(11).focus().select();
            }
        }
    },
    /**
     * Actualiza los totales de información financiera
     * @returns {void}
     */
    actualizarTotales: function () {
        var _this = $(this);
        var fieldsets = _this.parents('fieldset').length > 0 ? _this.parents('fieldset') : $('#divFinanciera fieldset');
        for (var f = 0; f < fieldsets.length; f++) {
            var total = 0;
            var fieldset = $(fieldsets[f]);
            var campos = fieldset.find('input:text[data-caja="number"]').not('#txtEfectivo');
            for (var i = 0; i < campos.length; i++) {
                var campo = $(campos[i]);
                total += !isNaN(parseInt(campo.attr('title'))) ? parseInt(campo.attr('title')) : 0;
            }
            var cajaTotal = fieldset.find('input[data-caja="total"]').not('#txtEfectivo');
            cajaTotal.val(total).toTxtCurrency();

            if (cajaTotal.attr('id') === 'txtTotIngresos' || cajaTotal.attr('id') === 'txtTotEgreso') {
                vista.actualizarValorEfectivo();
            }
        }
    },
    /**
     * Calcula el valor de efectivo disponible según los ingresos y egresos en información financiera
     * @returns {void}
     */
    actualizarValorEfectivo: function () {
        var vlrEgreso = parseInt($('#txtTotEgreso').attr('title'));
        var vlrIngreso = parseInt($('#txtTotIngresos').attr('title'));
        vlrEgreso = isNaN(vlrEgreso) ? 0 : vlrEgreso;
        vlrIngreso = isNaN(vlrIngreso) ? 0 : vlrIngreso;

        var efectivo = vlrIngreso - vlrEgreso;
        efectivo = (efectivo > 0) ? efectivo : 0;

        $('#txtEfectivo').val(efectivo).toTxtCurrency();
    },
    /**
     * Actualiza la venta para agregar los archivos y el número de financiación
     * @returns {void}
     */
    actualizarInformacion: function () {
        var idfinanciacion = financiarModelo.idfinanciacion;
        if (idfinanciacion && financiarModelo.archivos.length > 0) {
            var idventa = financiarModelo.detallesVenta.venta.idventa;
            var data = {idventa: idventa,
                archivos: financiarModelo.archivos,
                numerofinanciacion: idfinanciacion};
            financiarControl.grabarArchivos({parametros: data}, vista.onActualizacionCompleto);
        }
    },
    /**
     * Valida que la venta se haya actualizado correctamente
     * @param  {data} - Respuesta del servidor
     * @returns {void}
     */
    onActualizacionCompleto: function (data) {
        if (data.codigoRespuesta === 1) {
            __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion, vista.limpiarFormulario, false, vista.limpiarFormulario);
        }
    },
    /**
     * Permite subir un archivo a penas es seleccionado
     * @param {object} data - Archivo que se subirá
     * @returns {void}
     */
    uploadFile: function (data) {
        if (!financiarModelo.idfinanciacion) {
            var fxRemoveList = function () {
                vista.appload.container('.file-list .file-item:last').remove();
            };
            __dom.lanzarAlerta('No se encontró una financiación para subir soportes', __app.mensajes.atencion, fxRemoveList, false, fxRemoveList);
            return;
        }
        if (vista.appload.files.length > 0) {
            vista.appload.singleUpload(data.data, {'modulo': 'financiacion'});
        }
    },
    /** Muestra un diálogo con el formulario para la búsqueda de una venta
     * @returns {void}
     */
    mostrarBuscar: function () {
        $('#spanMensaje').text('');
        vista.dialogoActual = $('#divBuscarVenta').dialogo({
            modal: true,
            width: 850,
            title: 'Buscar venta',
            buttons: {
                Cancelar: function () {
                    $(this).dialog('close');
                }
            }
        });
    },
    /** Valida la información del filtro de ventas y envía la solicitud al servidor
     * @returns {void}
     */
    validarBusqueda: function (estado) {
        var cont = 0;
        var selector = $('#divBuscarVenta input[type="text"]');
        $.each(selector, function (index, item) {
            if (item.value !== '') {
                cont++;
            }
        });
        if (cont > 0) {
            var inicial = $('#txtFiltroFechaInicio').val();
            var ffinal = $('#txtFiltroFechaFin').val();
            var parametros = {
                'estado': estado.toString() !== '[object Object]' ? estado : "'P'",
                'idventa': $('#txtFiltroNumVenta').val(),
                'cedula': $('#txtFiltroDocumento').val(),
                'idepropiedad': $('#txtFiltroIdPropiedad').val(),
                'idsuscripcion': $('#txtFiltroIdSuscripcion').val(),
                'nombretercero': $('#txtFiltroNombreTercero').val(),
                'codigoanterior': $('#txtFiltroCodigoAnterior').val(),
                'metodopago': 'F',
                'fechainicio': '',
                'fechafin': ''
            };
            if (inicial !== '' && ffinal !== '') {
                parametros.fechainicio = inicial;
                parametros.fechafin = ffinal;
            }
            financiarControl.consultarSuscripcion({parametros: parametros}, vista.onConsultarVentaCompleto);
        } else {
            $('#spanMensaje').text('Debe diligenciar como mínimo 2 campos.').show();
        }
    },
    /** Captura la respuesta enviada por el servidor, cuando se consultan las ventas, en caso de que
     * haya más de una. Se muestran en lista para que el usuario elija. 
     * @param  {object} data - El resultado de la petición ajax para guardar la información de la venta y suscripción
     * @returns {void}
     */
    onConsultarVentaCompleto: function (data) {
        $('#spanMensaje').text('');
        $('.btnFinalizar').remove();
        $('#divListaSelección').empty();
        switch (data.codigoRespuesta) {
            case 0:
                $('#spanMensaje').text(data.mensaje).show();
                break;
            case 1:
                vista.limpiarFormulario();
                financiarModelo.informacionVenta = data.listaventas;
                if (data.listaventas.length > 1) {
                    var divVenta = $('<div>').addClass('listaSeleccion');
                    $.each(data.listaventas, function (index, ventas) {
                        var venta = ventas.infoventa.venta;
                        var tercero = ventas.infoventa.infosuscripcion.tercero;
                        var propiedad = ventas.infoventa.infosuscripcion.propiedad;
                        var div = $('<div>');
                        var radio = $('<input type="radio">');
                        var label = $('<label>');
                        radio.val(venta.idventa);
                        radio.attr('id', 'radio_venta_' + index);
                        radio.attr('data-indice', index);
                        radio.attr('name', 'radio_venta');
                        label.attr('for', 'radio_venta_' + index);
                        label.text(venta.numeroventa + ' - ' + tercero.idsuscripcion + ' - ' + propiedad.municipio + ' - ' + propiedad.barrio + ' - ' + propiedad.direccion);
                        div.append(radio, label);
                        divVenta.append(div);
                    });
                    var btn = $('<button>').text('Finalizar').addClass('btnSimple btnFinalizar');
                    btn.on('click', function () {
                        var ventaSeleccionada = $('input[name="radio_venta"]:checked');
                        if (ventaSeleccionada.length > 0) {
                            vista.limpiarFiltro();
                            var venta = financiarModelo.informacionVenta = data.listaventas[ventaSeleccionada.attr('data-indice')].infoventa;
                            $('#spanMensaje').hide();
                            vista.dialogoActual.dialog('close');
                            divVenta.remove();
                            vista.onConsultarDetalleVentaCompleto(venta);
                        } else {
                            $('#spanMensaje').text(__app.mensajes.seleccionarOpcion).show();
                        }
                    });
                    $('#divListaSelección').append(divVenta);
                    btn.insertAfter($('#divListaSelección'));
                } else {
                    vista.limpiarFiltro();
                    var venta = financiarModelo.informacionVenta = data.listaventas[0].infoventa;
                    $('#spanMensaje').hide();
                    vista.dialogoActual.dialog('close');
                    vista.onConsultarDetalleVentaCompleto(venta);
                }
                break;
        }
    },
    /** Organiza la información de la venta y suscripción para ser mostrada en la interfaz, 
     * se invocan métodos con información que debe mostrar.
     * @param  {object} data - Detalle de la venta elegida o buscada.
     * @returns {void}
     */
    onConsultarDetalleVentaCompleto: function (data) {
        var venta = data.venta;
        var resumen = data.infosuscripcion;
        var vlrVenta = parseInt(venta.valortotal);
        var infoEnviar = {idventa: venta.idventa};
        financiarModelo.detallesVenta = data;
        financiarModelo.conceptos = resumen.conceptos;
        financiarModelo.valorConceptosNoFinanciable = 0;
        financiarModelo.detallesSuscripcion = data.infosuscripcion;
        financiarModelo.diasterminoperiodo = data.infosuscripcion.suscripcion.diasterminoperiodo;


        financiarControl.consultarLiquidacion(infoEnviar, vista.onConsultarLiquidacionCompleto);
        vista.consultarConceptosNoFinanciables();
        vista.onCargarInformaconImpresion(data);
        vista.onMostrarSuscripcion(resumen);
        vista.onMostrarVenta(venta);
        //setTimeout(vista.consultarFacturas(), 2000);  -- para qué es este setTimeout???
        $('#btnAgregarFinanciacion, #btnGrabar').removeAttr('disabled');
        $('#btnAgregarInfoFinanciera, #btnVerSimulador').removeAttr('disabled');
        $('#txtCodAnterior').val(resumen.propiedad.codigoanterior);

        if (data.financiacion !== null) {
            financiarModelo.cargarfinanciacionventa = true;
            financiarModelo.financiacionVenta = data.financiacion;
            financiarModelo.financiacionVenta.ciclo = venta.ciclo;
            var cuota = venta.cuotainicial ? venta.cuotainicial : '0';
            financiarModelo.financiacionVenta.periodo = venta.periodo;
            financiarModelo.idfinanciacion = venta.idfinanciacion ? venta.idfinanciacion : '-';
            $('#txtValorCuotaInicial').val(cuota).toTxtCurrency();
        } else {
            $('#txtValorCuotaInicial').val(vlrVenta).toTxtCurrency();
        }
    },
    /*calcularCuotaInicialDeFinanciacion: function (financiaciones) {
     var vlrCuota = 0;
     var vlrVentaTotal = parseInt(financiarModelo.detallesVenta.venta.valortotal);
     for (var i = 0; i < financiaciones.length; i++) {
     var financiacion = financiaciones[i];
     for (var indiceConcepto = 0; indiceConcepto < financiacion.conceptos.length; indiceConcepto++) {
     var concepto = financiacion.conceptos[indiceConcepto];
     vlrCuota += parseInt(concepto.valorcuotainicial);
     }
     }
     
     if (vlrCuota > 0) {
     vlrCuota = vlrVentaTotal - vlrCuota;
     }
     $('#txtValorCuotaInicial').val(vlrCuota).toTxtCurrency();
     },*/
    /**
     * Carga la información en cajas de texto que se muestran al imprimir simulador de amortización
     * @param {object} data - Información que se cargará
     * @returns {void}
     */
    onCargarInformaconImpresion: function (data) {
        var venta = data.venta;
        var resumen = data.infosuscripcion;
        var suscripcion = resumen.suscripcion;
        var div = $('#divImpresionAmortizaciones');
        div.find('#txtDireccionImpresion').val(resumen.propiedad.direccion);
        div.find('#txtIdSuscripcionImpresion').val(suscripcion.idsuscripcion);
        div.find('#NombrePropietarioImpresion').val(resumen.tercero.nombretercero);
        div.find('#txtValorVentaImpresion').val(venta.valortotal.toString().toCurrency());
    },
    /** Si la venta a sido financiada muestra la información de la financiación para ser modificada
     * @param {object} fin - Financiación de la venta seleccionada
     * @returns {void}
     **/
    mostrarFinanciacion: function (fin) {
        if (!!fin) {
            for (var indexFinanciacion = 0; indexFinanciacion < fin.financiable.length; indexFinanciacion++) {
                financiarModelo.cargarfinanciacionventa = (indexFinanciacion === fin.financiable.length - 1) ? 1 : true;
                var financiacion = fin.financiable[indexFinanciacion];
                vista.agregarFinanciacionCargada(financiacion.idliquidacion);
                //Si es la última ya pone el atributo en false
                $('#txtNumCuotas').val(financiacion.numerocuotas);
            }
            //vista.onConsultarFacturaCompleto(fin.nofinanciable);
            vista.cargarInformacionFinanciera(fin.informacionfinanciera);
            vista.mostrarArchivos(fin.adjuntos);
            vista.mostrarInformacionResumenFinanciacion(fin);
        }
    },
    /**
     * Carga la información bàsica de la financiación en las cajas de texto de la vista
     * @param  {Object} financiacion - Información de la financiación actual
     * @returns {void}
     */
    mostrarInformacionResumenFinanciacion: function (financiacion) {
        $('#divAdjuntosFinanciacion').show();
        var banco = financiacion.financieraentidad;
        var solicitante = financiacion.solicitante;

        financiarModelo.idEntidad = banco.idtercero;
        financiarModelo.idSolicitante = solicitante;
        $('#txtDocSolicitante').val(solicitante.cedula);
        $('#cmbParentesco').val(financiacion.financiable[0].idparentesco);
        $('#txtFecha').val(financiacion.financiable[0].fechafinanciacion);
        $('#txtBanco').val(banco.nombretercero).attr('data-id', banco.idtercero);
        $('#txtNumCuotas, #txtNumeroCuotas').val(financiacion.financiable[0].numerocuota);
        $('#txtNombreSolicitante').val(solicitante.nombretercero).attr('data-id', solicitante.idtercero);
    },
    /**
     * Agrega una división para cargar la información de la financiación según una liquidación y carga datos básicos del mismo
     * @param  {number} idliquidacion - Id de la liquidación que se cargará
     * @returns {void}
     */
    agregarFinanciacionCargada: function (idliquidacion) {
        var division = vista.agregarDivisionFinanciacion();
        var idventa = financiarModelo.detallesVenta.venta.idventa;
        if (!division) {
            return false;
        }
        var cmbLiquidacion = division.find('.tipofinanciacion');

        cmbLiquidacion.val(idliquidacion);
        vista.gestionLiquidaciones(cmbLiquidacion);
        var infoEnviar = {idliquidacion: idliquidacion, idventa: idventa};
        var data = financiarControl.consultarInteresFinanciacion(infoEnviar);
        vista.onConsultarInteresLiquidacion(data, infoEnviar, division);
    },
    /**
     * Valida que hayan liquidaciones para agregar una financiación de ser así agrega una división para digitar la financiación
     * @returns {object} Devuelve la última división creada para guardar una financiación
     */
    agregarDivisionFinanciacion: function () {
        if (!vista.validarFinanciacionesCompletas()) {
            return false;
        }
        return vista.renderizarTemplateFinanciacion();
    },
    /**
     * Obtiene el interés de una liquidación y se carga en la vista para luego calcular valores
     * @param  {Object} data - Respuesta del servidor
     * @param  {Object} infoEnviar - Información de la financiación para ser guardada en el modelo
     * @param  {jQuery} - División donde se carga toda la información de la financición
     * @returns {void}
     */
    onConsultarInteresLiquidacion: function (data, infoEnviar, division) {
        if (data.codigoRespuesta !== 1) {
            __dom.ocultarToast();
            __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
            return;
        }
        //Se hizo sincrono porque al cargar financiaciones se cruzaba información

        var interes = parseFloat(data.interes);
        var cmbLiquidacion = division.find('.tipofinanciacion');
        var txtInteres = division.find('input.interesfinanciacion');
        var infomacionConceptos = financiarControl.consultarConceptosFinanciacion(infoEnviar);
        vista.onConsultarConceptoLiquiquidacionCompleto(infomacionConceptos, infoEnviar, division);

        var liquidacion = financiarControl.consultarLiquidacionPorId(infoEnviar.idliquidacion);
        txtInteres.val(interes).attr('data-iva', data.interesiva);
        if (liquidacion) {
            txtInteres.attr('tipo-cuota', liquidacion.tipocuota)
        }
        division.find('.spanTipoFinanciacion').text(' - ' + cmbLiquidacion.find('option:selected').text());
        financiarModelo.interesmaximo = (interes > financiarModelo.interesmaximo) ? interes : financiarModelo.interesmaximo;
    },
    /**
     * Carga la información financiera que se grabó para la financiación
     * @param {object} infoFinanciera - Información juríica o personal y financiera
     * @returns {void}
     */
    cargarInformacionFinanciera: function (infoFinanciera) {
        if (infoFinanciera.length > 0) {
            var div = $('#divInfoFinanciera').show();
            infoFinanciera = infoFinanciera[0];
            var cant = infoFinanciera.cantidadexperiencia;

            var anio = parseInt(cant / 360);
            var mes = parseInt((cant - (anio * 360)) / 30);
            var campos = div.find('input:text, select').not('input[disabled="disabled"]');

            infoFinanciera.meslaborado = mes;
            infoFinanciera.aniolaborado = anio;
            for (var index = 0; index < campos.length; index++) {
                var campo = $(campos[index]);
                var informacion = infoFinanciera[campo.attr('data-reference')];
                campo.val(informacion).change();
                if (informacion) {
                    campo.blur();
                }
            }
            vista.actualizarTotales();
        }
    },
    /** Captura la respuesta del servidor cuando se consultan las liquidaciones
     * @param {object} data - Liquidaciones y tipo de documento
     * @returns {void}
     */
    onConsultarLiquidacionCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                financiarModelo.liquidaciones = [];
                financiarModelo.liquidacionesSinUtilizar = [];
                break;
            case 1:
                vista.validarMaximoPlazo(data.liquidaciones);
                financiarModelo.liquidaciones = JSON.parse(JSON.stringify(data.liquidaciones));
                financiarModelo.liquidacionesSinUtilizar = data.liquidaciones;

                if (financiarModelo.financiacionVenta && financiarModelo.cargarfinanciacionventa) {
                    vista.mostrarFinanciacion(financiarModelo.financiacionVenta);
                }
                break;
        }
    },
    /**
     * Valida cual es el máximo plazo entre las financiaciones guardadas
     * @param {object} liquidaciones - Información de las liquidaciones seleccionadas
     * @returns {void}
     */
    validarMaximoPlazo: function (liquidaciones) {
        var maximo = 100;
        for (var i = 0; i < liquidaciones.length; i++) {
            maximo = parseInt(liquidaciones[i].maximoplazo) < maximo ? parseInt(liquidaciones[i].maximoplazo) : maximo;
        }
        $('#txtNumCuotas').val(maximo);
        financiarModelo.plazomaximo = maximo ? maximo : 1;
    },
    /** Muestra información de la venta seleccionada en cajas de texto.
     * @param {object} suscriptor - Es un objeto JSON con la información de la venta seleccionada
     * @returns {void}
     */
    onMostrarVenta: function (venta) {
        var vlrVenta = parseFloat(venta.valortotal);
        financiarModelo.valorNoFinanciable = vlrVenta;
        financiarModelo.tipodocumento = venta.tipodocumento;
        var tipo = venta.tipo === 'S' ? 'Existente' : 'Nueva';
        var estado = financiarModelo.detallesSuscripcion.suscripcion.estado;

        $('#txtIdVenta').val(venta.idventa);
        $('#txtFechaVenta').val(venta.fecha);
        $('#btnVerDetalleVenta').attr('disabled', false);
        $('#txtNumeroVenta, #txtNumeroVentaDetalle').val(venta.numeroventa);
        $('#txtEstado').val(venta.estado === 'P' ? 'Pendiente' : 'Aprobada');
        $('#txtDocumentoVenta, #txtDocumentoDetalleVenta').val(venta.documento);
        $('#txtTipoDocumentoVenta, #txtTipoDocumentoDetalleVenta').val(venta.tipodocumento);

        $('#txtTipoVentaDetalle').val(tipo);
        $('#txtMetodoPago').val(venta.metodopago);
        $('#txtObservacionVenta').val(venta.observacion);
        $('#txtFechaAprobacion').val(venta.fechaaprobada);
        $('#txtFechaEliminado').val(venta.fechaeliminada);
        $('#txtNumFinanciacion').val(venta.idfinanciacion);
        $('#txtValorTotalVenta').val(vlrVenta).toTxtCurrency();

        if (estado === "P") {
            $('#txtDocumentoOrdenDetalle, #txtDocumentoOrden').val(venta.documentoordenservicio).attr('data-id', venta.iddocumentoordenservicio);
            $('#divDocumentoOrdenDetalle, #divDocumentoOrden').show();
        } else {
            $('#divDocumentoOrdenDetalle, #divDocumentoOrden').hide();
        }
    },
    /**
     * Muestra información de la suscripción seleccionada en cajas de texto.
     * @param {object} suscriptor - Es un objeto JSON con la información de la suscripción seleccionada
     * @returns {void}
     */
    onMostrarSuscripcion: function (suscriptor) {
        var tercero = suscriptor.tercero;
        var propiedad = suscriptor.propiedad;
        $('#txtDocumento').val(tercero.cedula);
        var suscripcion = suscriptor.suscripcion;
        $('#txtNombre').val(tercero.nombretercero);
        $('#txtTipoTercero').val(tercero.tipotercero)
                .attr('data-id', tercero.codtipotercero);
        $('#txtTipoIdentificacion').val(tercero.tipodocumento);
        switch (tercero.codtipotercero) {
            case 'NAT':
                $('#divLaboral, a[href="#divLaboral"]').show();
                $("#divNatural").tabs("option", "disabled", [1]);
                $('#divJuridica, a[href="#divJuridica"]').hide();
                $("#divNatural").tabs("enable", 0);
                $('a[href="#divLaboral"]').click();
                //var txtactividad = $('#txtOcupacionLaboral');
//                $('#txtTelefono1Laboral').val(tercero.telefonofijo);
//                $('#txtTelefono2Laboral').val(tercero.telefonocelular);
                break;
            case 'JUR':
                $("#divNatural").tabs("enable", 1);
                $('a[href="#divJuridica"]').click();
                $('#txtEstratoCat').val(suscripcion.estrato);
                $('#divLaboral, a[href="#divLaboral"]').hide();
                $('#divJuridica, a[href="#divJuridica"]').show();
                $("#divNatural").tabs("option", "disabled", [0]);
                //var txtactividad = $('#txtActividadEmpresarial');
                $('#txtBarrioEmpresarial').val(propiedad.barrio);
                $('#txtDireccionEmpresarial').val(propiedad.direccion);
                $('#txtMunicipioEmpresarial').val(propiedad.municipio);
                $('#txtDepartamentoEmpresarial').val(propiedad.departamento);
//                $('#txtTelefono1Empresarial').val(tercero.telefonofijo);
                $('#txtCorreoEmpresarial').val(tercero.correoelectronico);
//                $('#txtTelefono2Empresarial').val(tercero.telefonocelular);

                break;
        }
        //txtactividad.val(suscripcion.actividadeconomica);
        $('#txtTipoLiquidacion').val(suscripcion.liquidacion);
        financiarModelo.liquidacion = suscripcion.idliquidacion;
        //txtactividad.attr('data-id', suscripcion.idactividadeconomica);
        $('#txtCiclo').val(suscripcion.ciclo).attr('data-id', suscripcion.idciclo);
        $('#txtSuscripcion').val(suscripcion.idsuscripcion);
        $('#txtPeriodo').val(suscripcion.periodo).attr('data-id', suscripcion.idperiodo);
    },
    /** Valida la información de la venta para hacer petición al servidor
     * @returns {void}
     */
    consultarConceptosNoFinanciables: function () {
        if (financiarModelo.detallesVenta) {
            var id = financiarModelo.detallesVenta.venta.idventa;
            financiarControl.consultarFacturas({idventa: id}, vista.onConsultarFacturaCompleto);
        }
    },
    /** Captura la respuesta enviada por el servidor, cuando se consultan las facturas de una venta
     * y las visualiza en una tabla
     * @param  {object} data - El resultado de la petición ajax para guardar la información de la factura
     * @returns {void}
     */
    onConsultarFacturaCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 1:
                financiarModelo.financiable = data.factura.financiable;
                financiarModelo.nofinanciable = data.factura.nofinanciable;
                $('#divDetallesFactura').hide();
                var vlrNoFinanciable = 0;
                if (financiarModelo.nofinanciable.length > 0) {
                    $.each(data.factura.nofinanciable, function (i, conc) {
                        vlrNoFinanciable += parseFloat(conc.valorreal);
                    });
                    fillTable("tblConceptoNoFinanciable", "formatoConceptosNoFinanciable", "financiarModelo.nofinanciable", "Conceptos No Financiables");
                }
                financiarModelo.valorConceptosNoFinanciable = vlrNoFinanciable;
                $('#txtValorNoFinanciable').val(vlrNoFinanciable).toTxtCurrency();

                var vlrMayorPrimeraCuota = vlrNoFinanciable;
                var venta = financiarModelo.detallesVenta.venta;
                var vlrCuotaInicial = parseInt(venta.cuotainicial);
                vlrCuotaInicial = isNaN(vlrCuotaInicial) ? venta.valortotal : vlrCuotaInicial;

                if (vlrCuotaInicial > 0) {
                    vlrMayorPrimeraCuota = (vlrCuotaInicial >= vlrNoFinanciable) ? 0 : (vlrNoFinanciable - vlrCuotaInicial);
                }

                $('#txtValorCuotaInicial, #txtValorCuotaImpresion').val(vlrCuotaInicial).toTxtCurrency();
                $('#txtVlrMinimoPago').val(vlrMayorPrimeraCuota).toTxtCurrency();
                break;
            case 0:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                break;
        }
    },
    /** Muestra un dialogo con la infomación detallada de la venta
     * @returns {void}
     */
    mostrarDetalleVenta: function () {
        vista.dialogoActual = $('#divDetalleVenta').dialogo({
            modal: true,
            width: 850,
            title: 'Detalle de la venta',
            buttons: {
                Aceptar: function () {
                    $(this).dialog('close');
                }
            }
        });
    },
    /**
     * Asigna funcionalidad a cajas de texto para autocompletar con sus respectivas propiedades y recursos.
     * @returns {void}
     */
    configurarAutoComplete: function () {

        __dom.configurarAutocomplete(
                'input#txtNombreSolicitante',
                vista.sourceAutoComplete,
                function (event, ui) {
                    $('input#txtDocSolicitante').val(ui.item ? ui.item.documento : '');
                    financiarModelo.idSolicitante = ui.item.todo;
                },
                function (txt) {
                    $('input#txtDocSolicitante').val('');
                    financiarModelo.idSolicitante = undefined;
                }
        );
        __dom.configurarAutocomplete(
                '#txtBanco',
                vista.sourceAutoCompleteBanco,
                function (event, ui) {
                    $(this).attr('data-documento', ui.item.documento)
                            .attr('data-id', ui.item.idVal);
                    financiarModelo.idEntidad = ui.item.idVal;
                },
                function (txt) {
                    $(this).removeAttr('data-documento')
                            .removeAttr('data-id');
                    financiarModelo.idEntidad = undefined;
                }
        );
        __dom.configurarAutocomplete(
                'input#txtFiltroNombreTercero',
                vista.sourceAutoCompleteTercero,
                function (event, ui) {
                    financiarModelo.idTercero = ui.item.idVal;
                    financiarModelo.nombreTercero = ui.item.value;
                },
                function (txt) {
                    financiarModelo.idTercero = undefined;
                    financiarModelo.nombreTercero = undefined;
                }
        );
    },
    /** Realiza la solicitud AJAX para consultar los terceros que pueden solicitar financiación 
     * del autocomplete 
     * @returns {void}
     */
    sourceAutoComplete: function (request, response) {
        vista.request = request;
        vista.response = response;
        var datos = {};
        if (request.term.trim() !== '') {
            datos.nombre = request.term;
            financiarControl.buscarSolicitante(datos, vista.mostrarResultado);
        }
    },
    /** Muestra el resultado de la consulta de los terceros en la lista desplegable.
     * @returns {void}
     */
    mostrarResultado: function (data) {
        var result = [];
        if (data.codigoRespuesta == 1) {
            $.each(data.datos, function (i, item) {
                result.push({
                    label: item.nombretercero,
                    value: item.nombretercero,
                    documento: item.documento,
                    idVal: item.idtercero,
                    todo: item
                });
            });
        }
        vista.response(result);
    },
    /** Realiza la solicitud AJAX para consultar los bancos del autocomplete 
     * @returns {void}
     */
    sourceAutoCompleteBanco: function (request, response) {
        vista.request = request;
        vista.response = response;
        var datos = {};
        datos.nombre = request.term;
        financiarControl.buscarBanco(datos, vista.mostrarResultadoBanco);
    },
    /** Muestra el resultado de la consulta de los bancos en la lista desplegable.
     * @returns {void}
     */
    mostrarResultadoBanco: function (data) {
        var result = [];
        if (data.codigoRespuesta == 1) {
            $.each(data.bancos, function (i, item) {
                result.push({
                    label: item.nombretercero,
                    value: item.nombretercero,
                    documento: item.documento,
                    idVal: item.idtercero
                });
            });
        }
        vista.response(result);
    },
    /** Realiza la solicitud AJAX para consultar los terceros del autocomplete 
     * @returns {void}
     */
    sourceAutoCompleteTercero: function (request, response) {
        vista.request = request;
        vista.response = response;
        var datos = {};
        datos.nombre = request.term.trim();
        financiarControl.consultarTerceros(datos, vista.mostrarResultadoTercero);
    },
    /** Muestra el resultado de la consulta de los terceros en la lista desplegable.
     * @returns {void}
     */
    mostrarResultadoTercero: function (data) {
        var result = [];
        if (data.codigoRespuesta == 1) {
            $.each(data.datos, function (i, item) {
                result.push({
                    label: item.nombretercero,
                    value: item.nombretercero,
                    documento: item.documento,
                    idVal: item.idtercero
                });
            });
        }
        vista.response(result);
    },
    /** Captura la respuesta del servidor, cuando se sube un archivo e invoca función para la visualización de 
     * los archivos subidos
     * @param {object} e - 
     * @param {object} data - Respuesta del servidor al cargar archivos
     * @returns {void}
     */
    subirCompleto: function (data) {
        $('#pMensaje').html('');
        data = data.data;
        switch (parseInt(data.codigoRespuesta)) {
            case 0:
                break;
            case 1:
                for (var i = 0; i < data.uploadedFiles.length; i++) {
                    var archivo = data.uploadedFiles[i].idarchivo;
                    financiarModelo.archivos.push({idarchivo: archivo});
                    var divBtn = $('.files-list .file-item:last .file-item-btns');
                    var btn = divBtn.find('button.appload-btn-delete');
                    var btnDownload = divBtn.find('button.appload-btn-download');
                    btn.attr('data-id', archivo);
                    btn.on('click', vista.eliminarArchivo);
                    btnDownload.attr('data-url', archivo.ruta);
                    btnDownload.on('click', vista.descargarArchivo);
                }
                break;
        }
    },
    /**
     * Da clic sobre un vínculo para que se abra en una pestaña diferente el archivo a descargar
     * @param  {e}
     * @returns {void}
     */
    descargarArchivo: function (e) {
        $('<a>').attr({'href': $(e.currentTarget).attr('data-url'), 'target': '_blank'})[0].click();
    },
    /** Muestra los archivos cargados en el servidor en una lista.
     * @param {object} data - Información de los archivos que se han cargado.
     * @returns {void}
     */
    mostrarArchivos: function (data) {
        $('#adjuntosVenta').show();
        $('#divAdjunto span').remove();
        if (vista.appload.container) {
            vista.appload.container.find('.files-list').empty();
        }
        if (data) {
            financiarModelo.archivos = [];
            if (!vista.appload.container) {
                vista.appload.control.change();
            }
            for (var i = 0; i < data.length; i++) {
                var info = data[i];
                var divItem = vista.appload.addFileToList({url: info.ruta, name: info.nombrearchivo});

                financiarModelo.archivos.push({idarchivo: info.idarchivo});
                divItem.find('.file-item-btns button').removeAttr('disabled');
                divItem.find('.file-item-btns .appload-btn-discard').attr('disabled', 'disabled');
                var eliminar = divItem.find('.file-item-btns .appload-btn-delete');

                divItem.addClass('uploaded-item');
                eliminar.attr('data-id', info.idarchivo);
                eliminar.on('click', vista.eliminarArchivo);
                $('<span class="fa fa-check-circle-o">').insertBefore(divItem.find('i.fa:first'));
            }
        }
    },
    /** Pide confirmación para eliminar un archivo en caso de ser "Sí"
     * Elimina un archivo de la lista de archivos y hace petición AJAX para eliminar el archivo del servidor.
     * @returns {void}
     */
    eliminarArchivo: function () {
        var _this = $(this);
        var id = _this.attr('data-id');
        $('div#divEliminarArchivo').dialogo({
            resizable: false,
            heigth: 140,
            modal: true,
            title: 'Eliminar archivo',
            buttons: {
                "Sí": function () {
                    $(this).dialog('close');
                    financiarControl.eliminarArchivo({accion: 'E', idarchivo: id}, function (data) {
                        if (data.codigoRespuesta === 1) {
                            var archivo = financiarControl.consultarArchivoPorId(id);
                            financiarModelo.archivos.splice(archivo.indice, 1);
                            financiarModelo.archivosEliminados.push(id);
                            $(_this.parents('.file-item')[0]).remove();
                        }
                    });
                }, Cancelar: function () {
                    $(this).dialog("close");
                }
            }
        });
    },
    /**
     * Le asigna el valor a la cuota inicicial numérica
     * @returns {void}
     */
    asignarValorCuotaInicial: function () {
        var _this = $(this);
        if (_this.attr('title')) {
            _this.val(_this.attr('title'));
        }
    },
    /**
     * Valida la mayor valor primera cuota según la cuota inicial digitada
     * @returns {void}
     */
    validarCuotaInicial: function () {
        var _this = $('#txtValorCuotaInicial');
        var vlrTxt = parseInt(_this.attr('title'));
        var vlrNoFinanciable = financiarModelo.valorConceptosNoFinanciable;
        var vlrCuotaInicial = isNaN(parseInt(_this.val())) ? (isNaN(vlrTxt) ? 0 : vlrTxt) : parseInt(_this.val());

        var vlrMayorPrimeraCuota = vlrNoFinanciable;
        if (parseInt(_this.val()) > 0) {
            vlrMayorPrimeraCuota = (vlrCuotaInicial >= vlrNoFinanciable) ? 0 : (vlrNoFinanciable - vlrCuotaInicial);
        }
        $('#txtValorCuotaInicial, #txtValorCuotaImpresion').val(vlrCuotaInicial).toTxtCurrency();
        $('#txtVlrMinimoPago').val(vlrMayorPrimeraCuota).toTxtCurrency();
        vista.asignarValoresFinanciacion();
    },
    /**
     * Valida todas las posibles financiaciones y reparte la cuota inicial entre los
     * conceptos no financiables y el valor de los conceptos a financiar
     * @returns {void}
     */
    asignarValoresFinanciacion: function () {

        var _this = $('#txtValorCuotaInicial');
        var divs = $('#divFinanciaciones .divContenedorColapsable');
        var valorventa = parseFloat(financiarModelo.detallesVenta.venta.valortotal);
        var valorFinanciable = parseInt($('#txtValorFinanciable').attr('title'));
        var valorNoFinanciable = parseInt(financiarModelo.valorConceptosNoFinanciable);

        valorFinanciable = isNaN(valorFinanciable) ? 0 : valorFinanciable;
        var valorConceptosNoCargados = valorventa - valorFinanciable - valorNoFinanciable;
        //var valorCuota = parseInt(_this.attr('title')) - parseInt(financiarModelo.valorConceptosNoFinanciable);

        //Se tiene en cuenta el valor de los conceptos nos finanbles y los que no se han cargado
        var valorCuota = parseInt(_this.attr('title')) - (valorConceptosNoCargados + valorNoFinanciable);

        divs.find('input:text').removeAttr('data-valor-suma');

        if (parseFloat(_this.attr('title')) > valorventa) {
            _this.val(valorventa).focus().select();
            return;
        }

        if (isNaN(valorCuota) || valorCuota <= 0) {
            vista.asignarValorCuotaCero();
            return;
        }
        ///Primero se tiene en cuenta todos los conceptos no seleccionados para financiar
        valorCuota = vista.asignarValorConceptoNoFinanciados(valorCuota);
        //if (valorCuota > 0) {
        for (var indice = 0; indice < divs.length; indice++) {
            var actual = $(divs[indice]);
            var idliq = actual.find('.tipofinanciacion').val();
            var conceptos = financiarControl.consultarConceptosPorLiquidacion(idliq);
            if (conceptos) {
                if (conceptos.info.conceptos) {
                    valorCuota = vista.asignaValoresPorConcepto(conceptos.info.conceptos, actual, valorCuota);
                }
            }
        }
        //}
        vista.calcularValoresResumen();
    },
    /**
     * Asigna a los concepto el valor de la cuota = 0
     * @returns {void}
     */
    asignarValorCuotaCero: function () {

        var divs = $('#divFinanciaciones .divContenedorColapsable');
        divs.find('input:text').removeAttr('data-valor-suma');
        for (var indice = 0; indice < divs.length; indice++) {
            var divActual = $(divs[indice]);
            var valorFinanciar = 0;
            var valorFinanciable = 0;

            var tabla = divActual.find('table');
            var idliquidacion = divActual.find('.tipofinanciacion').val();

            var conceptos = financiarControl.consultarConceptosPorLiquidacion(idliquidacion);
            if (conceptos) {
                for (var index = 0; index < conceptos.info.conceptos.length; index++) {
                    var concepto = conceptos.info.conceptos[index];
                    var tr = tabla.find('tbody tr:eq(' + index + ')');
                    var tdCuota = tr.find('td:eq(5)');
                    var tdFinanciar = tr.find('td:eq(6)');
                    var valortotal = parseInt(concepto.valortotal);
                    var vlrFinanciarConcepto = (tr.find('input:checked').length > 0) ? valortotal : 0;

                    concepto.valorcuota = 0;
                    valorFinanciable += valortotal;
                    tdCuota.text('0'.toCurrency());
                    concepto.valorfinanciar = valortotal;
                    valorFinanciar += vlrFinanciarConcepto;
                    tdFinanciar.text(vlrFinanciarConcepto.toString().toCurrency());
                }
            }

            divActual.find('input[id^="txtVlrCuota"]').attr('data-valor-suma', 0);
            divActual.find('input[id^="txtVlrFinanciar"]').attr('data-valor-suma', valorFinanciar);
            divActual.find('input[id^="txtVlrFinanciable"]').attr('data-valor-suma', valorFinanciable);
        }
        vista.calcularValoresResumen();
    },
    /**
     * Calcula los totales según los resultados de las financiaciones 
     * @returns {void}
     */
    calcularValoresResumen: function () {
        var resumenVlrFinanciar = 0;
        var resumenVlrFinanciable = 0;
        var divFinanciaciones = $('#divFinanciaciones .divContenedorColapsable');
        var vlrCuotaResumen = parseInt(financiarModelo.detallesVenta.venta.valortotal);

        for (var i = 0; i < divFinanciaciones.length; i++) {
            var divActual = $(divFinanciaciones[i]);
            var txtCuotaInicial = divActual.find('input[id^="txtVlrCuota"]').val('');
            var txtVlrFinanciar = divActual.find('input[id^="txtVlrFinanciar"]').val('');
            var txtVlrFinanciable = divActual.find('input[id^="txtVlrFinanciable"]').val('');
            var vlrFinanciar = isNaN(parseInt(txtVlrFinanciar.attr('data-valor-suma'))) ? 0 : parseInt(txtVlrFinanciar.attr('data-valor-suma'));
            var vlrFinanciable = isNaN(parseInt(txtVlrFinanciable.attr('data-valor-suma'))) ? 0 : parseInt(txtVlrFinanciable.attr('data-valor-suma'));

            vlrCuotaResumen -= vlrFinanciar;
            resumenVlrFinanciar += vlrFinanciar;


            txtVlrFinanciar.val(vlrFinanciar).toTxtCurrency();
            txtVlrFinanciable.val(vlrFinanciable).toTxtCurrency();
            txtCuotaInicial.val(txtCuotaInicial.attr('data-valor-suma')).toTxtCurrency();
        }
        var listaConceptos = [];
        var listaFilas = $('div#divFinanciaciones table tbody tr');
        for (var i = 0; i < listaFilas.length; i++) {
            var fila = $(listaFilas[i]);
            var nombreConcepto = fila.find('td[header="thConcepto"]').text();
            var valorConcepto = fila.find('td[header="thValTot"]').attr('data-valor');
            var posicion = jQuery.inArray(nombreConcepto, listaConceptos);
            if (posicion === -1) {
                resumenVlrFinanciable += parseInt(valorConcepto);
                listaConceptos.push(nombreConcepto);
            }

        }
        //_this.val(financiarModelo.valorNoFinanciable);
        $('#txtValorFinanciable').val(resumenVlrFinanciable).toTxtCurrency();
        $('#txtValorFinanciar').val(resumenVlrFinanciar).toTxtCurrency();
        var cargandoInformacion = financiarModelo.cargarfinanciacionventa;

        if (cargandoInformacion) {
            var cuotaInicial = $('#txtValorCuotaInicial, #txtValorCuotaImpresion');

            cuotaInicial.val(vlrCuotaResumen).toTxtCurrency();
            $('#txtVlrMinimoPago').val(vlrCuotaResumen > 0 ? 0 : financiarModelo.valorConceptosNoFinanciable).toTxtCurrency();
            if (cargandoInformacion === 1) {
                var cuotaInicialVenta = financiarModelo.detallesVenta.venta.cuotainicial;
                if (cuotaInicialVenta) {
                    cuotaInicial.val(cuotaInicialVenta).toTxtCurrency();
                }
                financiarModelo.cargarfinanciacionventa = false;
                vista.validarCuotaInicial();
            }
        }
    },
    /**
     * Valida todos los conceptos financiables que no se han seleccionado para financiar
     * @returns {void}
     */
    asignarValorConceptoNoFinanciados: function (valorCuota) {

        var divs = $('#divFinanciaciones .divContenedorColapsable');
        divs.find('input:text').removeAttr('data-valor-suma');
        for (var indice = 0; indice < divs.length; indice++) {
            var divActual = $(divs[indice]);
            var cuotaInicial = 0;
            var valorConceptos = 0;

            var idliquidacion = divActual.find('.tipofinanciacion').val();
            var tablaConceptos = divActual.find('table tbody tr td[header="thSeleccion"] input:not(input:checked)');

            for (var indiceconcepto = 0; indiceconcepto < tablaConceptos.length; indiceconcepto++) {
                var chkConcepto = $(tablaConceptos[indiceconcepto]);
                var tr = chkConcepto.parents('tr:eq(0)');

                var idconcepto = chkConcepto.val();
                var vlrCuota = tr.find('td[header="thValorCuota"]');
                tr.find('td[header="thValorFinanciar"]').text("0".toCurrency());
                var infoConcepto = financiarControl.consultarConceptoPorIdyIdLiquidacion(idliquidacion, idconcepto);
                if (valorCuota <= 0) {
                    return false;
                }

                if (infoConcepto) {
                    valorConceptos += parseInt(infoConcepto.valortotal);
                    if (!vista.validarExistenciaConceptoOtrasTablas(idconcepto) && infoConcepto) {
                        var valorconcepto = parseInt(infoConcepto.valortotal);
                        var resta = valorCuota - valorconcepto;
                        infoConcepto.valorfinanciar = 0;


                        if (resta >= 0) {
                            valorCuota -= valorconcepto;
                            cuotaInicial += valorconcepto;
                            infoConcepto.valorcuota = valorconcepto;
                            vlrCuota.text(valorconcepto.toString().toCurrency());
                            continue;
                        }
                        resta = valorconcepto - valorCuota;
                        valorCuota -= (valorconcepto - resta);
                        cuotaInicial += valorconcepto - resta;
                        infoConcepto.valorcuota = valorconcepto - resta;
                        vlrCuota.text((valorconcepto - resta).toString().toCurrency());

                    }
                }

            }
            divActual.find('input[id^="txtVlrCuota"]').attr('data-valor-suma', cuotaInicial);
            divActual.find('input[id^="txtVlrFinanciable"]').attr('data-valor-suma', valorConceptos);
        }
        return valorCuota;
    },
    /**
     * Válida si un concepto está en otra tabla seleccionado o ya tiene asignada una cuota inicial
     * @param {type} idconcepto
     * @returns {undefined}
     */
    validarExistenciaConceptoOtrasTablas: function (idconcepto) {
        var existe = false;
        var divFinanaciaciones = $('#divFinanciaciones .divContenedorColapsable');
        var existenciaEnOtrasTablas = divFinanaciaciones.find('table tbody td[header="thSeleccion"] input[value="' + idconcepto + '"]');
        if (existenciaEnOtrasTablas.length === 0) {
            return false;
        }

        for (var indicechk = 0; indicechk < existenciaEnOtrasTablas.length; indicechk++) {
            var chkConcepto = $(existenciaEnOtrasTablas[indicechk]);
            var vlrCuotaInicialConcepto = chkConcepto.parents('tr:eq(0)').find('td[header="thValorCuota"]');
            if (chkConcepto.prop('checked') || parseInt(vlrCuotaInicialConcepto) > 0) {
                existe = true;
                break;
            }
        }
        return existe;
    },
    /**
     * Válida los valores de la financiación y es repartida entre los conceptos de las financiaciones
     * @param {object} conceptos - Información de los conceptos de una financiación
     * @param {number} tbl - Tabla donde se cargaron los conceptos que se financiarán
     * @param {number} valorCuota - Valor de la cuota inicial de la que se resta
     * @returns {void}
     */
    asignaValoresPorConcepto: function (conceptos, actual, valorCuota) {
        var tbl = actual.find('table');
        var conceptosSeleccionados = tbl.find('tbody input:checked');
        var txtCuotaInicial = actual.find('input[id^="txtVlrCuota"]');
        var txtVlrFinanciar = actual.find('input[id^="txtVlrFinanciar"]');
        var txtVlrFinanciable = actual.find('input[id^="txtVlrFinanciable"]');

        var valorTotal = parseInt(txtVlrFinanciable.attr('data-valor-suma'));
        var cuotaInicial = parseInt(txtCuotaInicial.attr('data-valor-suma'));
        var valorFinanciar = parseInt(txtVlrFinanciar.attr('data-valor-suma'));

        valorTotal = isNaN(valorTotal) ? 0 : valorTotal;
        cuotaInicial = isNaN(cuotaInicial) ? 0 : cuotaInicial;
        valorFinanciar = isNaN(valorFinanciar) ? 0 : valorFinanciar;




        for (var index = 0; index < conceptosSeleccionados.length; index++) {
            var chkConcepto = $(conceptosSeleccionados[index]);
            var tr = chkConcepto.parents('tr:eq(0)');
            var infoConcepto = financiarControl.consultarConceptosPorId(conceptos, chkConcepto.val());


            var tot = parseFloat(infoConcepto.valortotal);


            valorTotal += tot;
            var vlrCuota = tr.find('td:eq(5)');
            var vlrFinanciar = tr.find('td:eq(6)');
            if (valorCuota === 0) {
                infoConcepto.valorcuota = 0;
                valorFinanciar += tot;
                infoConcepto.valorfinanciar = tot;
                vlrCuota.text('0'.toCurrency());
                vlrFinanciar.text(tot.toString().toCurrency());
                continue;
            }
            var resta = valorCuota - tot;
            if (resta >= 0) {
                valorCuota -= tot;
                cuotaInicial += tot;
                infoConcepto.valorcuota = tot;
                infoConcepto.valorfinanciar = 0;
                vlrFinanciar.text('0'.toCurrency());
                vlrCuota.text(tot.toString().toCurrency());
                continue;
            }
            resta = tot - valorCuota;
            valorCuota -= tot - resta;
            cuotaInicial += tot - resta;
            infoConcepto.valorfinanciar = resta;
            infoConcepto.valorcuota = tot - resta;
            vlrFinanciar.text(resta.toString().toCurrency());
            vlrCuota.text((tot - resta).toString().toCurrency());
            valorFinanciar += resta;
        }

        txtCuotaInicial.attr('data-valor-suma', cuotaInicial);
        txtVlrFinanciable.attr('data-valor-suma', valorTotal);
        txtVlrFinanciar.attr('data-valor-suma', valorFinanciar);
        return valorCuota;
    },
    /**
     * Valida que hayan financiaciones y las financiaciones que se van a guardar tengan todos los datos completos 
     * @returns {boolean}
     */
    validarFinanciacionesCompletas: function () {
        var completo = true;
        var div = $('#divFinanciaciones');
        var tbls = div.find('table:empty').length;
        var cmbsLiquidaciones = div.find('select.tipofinanciacion');

        if (!financiarModelo.detallesVenta) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarSuscripcion, __app.mensajes.atencion);
            completo = false;
        }
        for (var i = 0; i < cmbsLiquidaciones.length; i++) {
            var cmbLiquidacion = $(cmbsLiquidaciones[i]);
            if (!cmbLiquidacion.val() || cmbLiquidacion.val() === '' || cmbLiquidacion.val() === '-1') {
                var fxAbrirFinanciacion = function () {
                    /*if (!isNaN(parseInt(idliquidacion))) {
                     $(cmbsLiquidaciones[i]).val(idliquidacion);
                     }*/
                    cmbLiquidacion.parents().eq(2).find('a.fa-plus').click();
                    cmbLiquidacion.focus();
                };
                __dom.lanzarAlerta('Debe completar la información de las financiaciones anteriores', __app.mensajes.atencion, fxAbrirFinanciacion, false, fxAbrirFinanciacion);
                completo = false;
            }
        }
        if (tbls > 0) {
            __dom.lanzarAlerta('Hay liquidaciones inválidas para financiar, intente nuevamente');
            completo = false;
        }
        if (financiarModelo.liquidacionesSinUtilizar.length === 0) {
            __dom.lanzarAlerta('No hay liquidaciones para agregar una nueva financiación ', __app.mensajes.atencion);
            completo = false;
        }
        return completo;
    },
    /**
     * Genera HTML con funcionalidad en sus controles
     * @returns {jQuery}
     */
    renderizarTemplateFinanciacion: function () {
        var divGeneralFinanciaciones = $('#divFinanciaciones');

        var divHtml = formatoTemplateFinanciacion.replace(/{{i}}/g, financiarModelo.indiceFinanciacion++);
        var divNuevaFinanciacion = $(divHtml);

        divGeneralFinanciaciones.append(divNuevaFinanciacion);
        vista.configurarFinanciacion(divNuevaFinanciacion);

        return divNuevaFinanciacion;
        /*var data = {i: financiarModelo.indiceFinanciacion++};
         $.get('/achagua/sistema/web/bundles/Llanogas/templates/tplFinanciacion.html', function (_template) {
         var template = $(_template).filter('#tplFinancacion').html();
         var info = $(Mustache.to_html(template, data));
         div.append(info);
         vista.configurarFinanciacion();
         
         return info;
         });*/
    },
    /**
     * Configura los campos de la última financiación agregada
     * @param {number} idliquidacion identificador del tipo de financiación que se agrega
     * @param {boolean} continuar Define si se cargará la información de la financiación
     * @returns {void}
     */
    configurarFinanciacion: function (divActual) {
        __dom.configurarColapsable(divActual);
        var cmbLiquidacion = divActual.find('select.tipofinanciacion');
        cmbLiquidacion.on('change', function () {
            vista.consultarInfoLiquidacion($(this));
        });

        divActual.find('a.fa-times').off('click').on('click', vista.eliminarFinanciacion);
        __dom.llenarCombo(cmbLiquidacion, financiarModelo.liquidacionesSinUtilizar, 'idliquidacion', 'liquidacion');
    },
    /** Válida la información de la financiación y en caso de ser correcta visualiza el simulador
     * @returns {void}
     **/
    simulador: function () {
        var _this = $(this);
        var divPadre = _this.parents().eq(2);
        var conceptos = divPadre.find('table tbody input:checked');
        if (conceptos.length === 0) {
            __dom.lanzarAlerta('Debe seleccionar conceptos a financiar.', __app.mensajes.atencion);
            return;
        }
        if ($('#txtNumCuotas').val().trim() === '') {
            var mensaje = __app.mensajes.escogerCuotasFinanciacion.replace('24', financiarModelo.plazomaximo);
            __dom.lanzarAlerta(mensaje, __app.mensajes.atencion);
            return;
        }
        if ($('#txtValorFinanciar').val().trim() === '') {
            __dom.lanzarAlerta(__app.mensajes.requiereValorFinanciarMayor, __app.mensajes.atencion);
            return;
        }
        if (divPadre.find('.interesfinanciacion').val().trim() === '') {
            var liq = divPadre.find('.tipofinanciacion');
            if (liq.val() !== '-1' && liq.val() !== '') {
                var nombreLiq = liq.find('option:selected').text();
                __dom.lanzarAlerta('La liquidación <b>' + nombreLiq + '</b> no tiene tasa de interés asociada, </br> Comuníquese con soporte');
            } else {
                __dom.lanzarAlerta(__app.mensajes.tipoFinanciacion, __app.mensajes.atencion);
            }
            return;
        }

        $('#txtNumeroCuotas').val($('#txtNumCuotas').val());
        $('#txtIntereses').val(divPadre.find('.interesfinanciacion').val());
        $('#txtCapitalInicial').val(divPadre.find('.valorafinanciar').attr('title'));
        $('#txtIntereses').attr('data-iva', divPadre.find('.interesfinanciacion').attr('data-iva'));
        _that.calcularAmortizacion(financiarModelo);

    },
    /**
     * Permite visualizar la posible amortización  de la financiación
     * @returns {void}
     */
    mostrarSimulador: function () {
        var divFinanciaciones = $('#divFinanciaciones .divContenedorColapsable');
        if (!financiarModelo.detallesVenta) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarSuscripcion, __app.mensajes.atencion);
        }
        if (divFinanciaciones.length === 0) {
            __dom.lanzarAlerta('Debe digitar financiaciones para simular.', __app.mensajes.atencion);
            return;
        }


        var vlrCuotas = 0;
        var divPrincipal = $('#divSimulador');
        var divTablas = $('#divTabFinanciaciones');
        var divFinanciaciones = $('#divFinanciaciones .divContenedorColapsable');

        divTablas.find('div').remove();
        var tabs = divTablas.find('.ui-tabs-nav').empty();
        for (var index = 0; index < divFinanciaciones.length; index++) {
            var div = $(divFinanciaciones[index]).find('.contenidoColapsable');
            var divamortizacion = vista.crearDivisionAmortizada(div, vlrCuotas);
            if (!divamortizacion) {
                continue;
            }
            var liquidacion = div.find('.tipofinanciacion');
            var nombreliquidacion = liquidacion.find('option:selected').text();
            var nameliquidacionmostrar = nombreliquidacion.substr(0, 15);
            tabs.append($('<li><a href="#divLiquidacion' + liquidacion.val() + '" title="' + nombreliquidacion + '">' + nameliquidacionmostrar + '</a></li>'));
            divTablas.append(divamortizacion);
        }
        if (tabs.children().length === 0) {
            __dom.lanzarAlerta('Debe digitar financiaciones para simular.', __app.mensajes.atencion);
            return;
        }
        divTablas.tabs("refresh");
        divTablas.tabs("option", "active", 0);
        vista.dialogoActual = divPrincipal.dialogo({
            modal: true,
            width: 980,
            position: {my: "center", at: "top+30", of: "body"},
            title: 'Simulador de financiación',
            buttons: {
                Imprimir: vista.cargaramortizaciones,
                Cerrar: function () {
                    vista.dialogoActual.dialog('close');
                }
            }
        });
    },
    /**
     * Carga en tablas los simuladores de amortización de la financiación para imprimir
     * @returns {void}
     */
    cargaramortizaciones: function () {
        var vlrCuotas = 0;
        var divPrincipal = $('#divImpresionAmortizaciones');
        var divTablas = divPrincipal.find('#divTablasAmortizacion').empty();
        var divFinanciaciones = $('#divFinanciaciones .divContenedorColapsable');
        var valorAproximadoPrimeraCuota = parseInt($('#txtVlrMinimoPago').attr('title'));

        for (var index = 0; index < divFinanciaciones.length; index++) {
            var div = $(divFinanciaciones[index]).find('.contenidoColapsable');
            var divamortizacion = vista.crearDivisionAmortizada(div);
            if (divamortizacion) {
                divTablas.append(divamortizacion);
                vlrCuotas += financiarModelo.valorCuota;
            }
        }

        valorAproximadoPrimeraCuota += parseFloat(vlrCuotas);
        $('#txtNumCuotasImpresion').val($('#txtNumCuotas').val());
        $('#txtVlrAproxCuotaImpresion').val(vlrCuotas).toTxtCurrency();
        $('#txtVlrAproxPrimerCuotaImpresion').val(valorAproximadoPrimeraCuota).toTxtCurrency();
        vista.imprimirSimulador();
    },
    /**
     * Configura la vista para mostrar las amortizaciones de las financiaciones
     * @param  {jQuery} div - División de la financiación
     * @returns {boolean|jQuery}
     */
    crearDivisionAmortizada: function (div) {
        var cantidadCuotas = $('#txtNumCuotas').val();
        var vlrFinanciar = div.find('.valorafinanciar');
        var txtinteres = div.find('.interesfinanciacion');
        var txtLiquidacion = div.find('.tipofinanciacion');
        var conceptos = div.find('table tbody input:checked');
        if (conceptos.length === 0) {
            return false;
        }
        //Si no tiene la información completa no se toma su amortización
        if (!vlrFinanciar.attr('title') || parseInt(vlrFinanciar.attr('title')) <= 0 || txtinteres.attr('title') === '') {
            return false;
        }
        txtinteres.removeAttr('data-iva');
        $('#txtIntereses').removeAttr('data-iva');
        $('#txtIntereses').val(txtinteres.val());
        $('#txtNumeroCuotas').val(cantidadCuotas);
        $('#txtCapitalInicial').val(vlrFinanciar.attr('title'));
        $('#txtIntereses').attr('data-iva', txtinteres.attr('data-iva'));
        $('#txtIntereses').attr('tipo-cuota', txtinteres.attr('tipo-cuota'));

        var tabla = _that.calcularAmortizacion(financiarModelo, true);
        return vista.crearHtmlSimulador(txtLiquidacion, txtinteres.val(), vlrFinanciar.val(), cantidadCuotas, tabla);
    },
    /**
     * Genera el HTML para pintar la amortización de cada una de las financiaciones
     * @param  {jQuery} liquidacion - Combo de la liquidación que se Válida
     * @param  {number}  interes - Porcentaje de interés generado por la liquidación
     * @param  {number} valor - Valor total financiada con ésta liquidación
     * @param  {number} cantidadCuotas - Cantidad de cuotas en la que se hizo ésta financiación
     * @param  {jQuery} tabla - Tabla de la amortización
     * @returns {jQuery}
     */
    crearHtmlSimulador: function (liquidacion, interes, valor, cantidadCuotas, tabla) {
        var nombreliquidacion = liquidacion.find('option:selected').text();

        var hr = $('<hr style="margin: 20px 0px; ">');
        var divTabla = $('<div>').css({'margin-top': '10px'}).append(tabla);
        var txtInteres = $('<div class="campo"><label>Intereses: </label><input type="text" class="inputImpresion" value="' + interes + '" disabled="disabled"></div>');
        var txtValor = $('<div class="campo"><label>Valor Financiado: </label><input type="text" class="inputImpresion" value="' + valor + '" disabled="disabled"></div>');
        var txtLiquidacion = $('<div class="campo"><label>Liquidación: </label><input type="text" class="inputImpresion" value="' + nombreliquidacion + '" disabled="disabled"></div>');
        var txtNumeroCuotas = $('<div class="campo"><label for="txtNumeroCuotas">Número de cuotas:</label><input type="text" id="txtNumeroCuotas" class="inputImpresion"  disabled="disabled"  value="' + cantidadCuotas + '" class="inputImpresion"/></div>');

        return $('<div>').attr('id', 'divLiquidacion' + liquidacion.val()).addClass('.divFinanciacionImpresion').append(hr, txtLiquidacion, txtInteres, txtValor, txtNumeroCuotas, divTabla);
    },
    /**
     * Imprime las tablas de amortizacionez de todas las financiaciones
     * @returns {void}
     */
    imprimirSimulador: function () {
        var frame = document.getElementById('iframePrint');
        var c = frame.contentDocument.getElementById('contenido');
        frame.contentDocument.getElementById('title').innerText = 'FINANCIACIÓN DE LA VENTA  ' + financiarModelo.detallesVenta.venta.idventa;
        var cp = document.getElementById('divImpresionAmortizaciones').cloneNode(true);
        while (c.firstChild) {
            c.removeChild(c.firstChild);
        }
        c.appendChild(cp);
        $(c).find('#divImpresionAmortizaciones').removeAttr('style');
        var w = frame.contentWindow;
        w.focus();
        w.print();
    },
    /**
     * Permite verificar que en las financiaciones actuales no se repita la liquidación
     * @param {object} selector - Combo que disparó el evento change
     * @returns {void}
     */
    gestionLiquidaciones: function (selector) {
        var indice = selector.attr('data-indice');
        var liquidacionUsadas = financiarModelo.liquidacionesUtilizadas;
        var liquidacionSinUso = financiarModelo.liquidacionesSinUtilizar;
        var combos = $('#divFinanciaciones .tipofinanciacion').not(selector);
        var utilizada = financiarControl.consultarUtilizadasPorIndice(indice);

        if (utilizada) {
            var existe = false;
            var conceptosLiquidacion = financiarControl.consultarConceptosPorLiquidacion(utilizada.idliquidacion);
            var liquidacionEliminar = financiarControl.consultarLiquidacionUtilizadaPorId(utilizada.idliquidacion);

            conceptosLiquidacion ? financiarModelo.conceptoLiquidacion.splice(conceptosLiquidacion.index, 1) : '';
            liquidacionEliminar ? financiarModelo.liquidacionesUtilizadas.splice(liquidacionEliminar.indice, 1) : '';

            for (var index = 0; index < liquidacionSinUso.length; index++) {
                if (parseInt(liquidacionSinUso[index].idliquidacion) === parseInt(utilizada.idliquidacion)) {
                    existe = true;
                    break;
                }
            }
            if (!existe) {
                liquidacionSinUso.push(utilizada);
            }
        }

        //Agrega al arreglo de las liquidaciones que ya han sido utilizadas
        for (var x = 0; x < liquidacionSinUso.length; x++) {
            var liquidacion = liquidacionSinUso[x];
            if (parseInt(liquidacion.idliquidacion) === parseInt(selector.val())) {
                liquidacion.posicion = indice;
                liquidacionUsadas.push(liquidacion);

                liquidacionSinUso.splice(x, 1);
            }
        }

        for (var h = 0; h < combos.length; h++) {
            var valueId = '-1';
            var cmb = $(combos[h]);
            var actual = financiarControl.consultarUtilizadasPorIndice(cmb.attr('data-indice'));
            var liquidaciones = JSON.parse(JSON.stringify(liquidacionSinUso));
            if (actual) {
                liquidaciones.push(actual);
                valueId = actual.idliquidacion;
            }
            __dom.llenarCombo(cmb, liquidaciones, 'idliquidacion', 'liquidacion').val(valueId);
        }
        var btn = $('#btnAgregarFinanciacion');
        vista.validarMaximoPlazo(liquidacionUsadas);
        liquidacionSinUso.length > 0 ? btn.removeAttr('disabled') : btn.attr('disabled', 'disabled');
    },
    /**
     * Elimina una financiación que se haya creado
     * @returns {void}
     */
    eliminarFinanciacion: function (e) {
        var _this = $(this);
        __app.cancelarEvento(e);
        var divPadre = _this.parents().eq(2);
        var cmbFinanciacion = divPadre.find('.tipofinanciacion');
        var mensaje = cmbFinanciacion.val() !== '-1' ? '<b>' + cmbFinanciacion.find('option:selected').text() + '</b>' : '';
        __dom.lanzarAlerta('Se eliminará la financiación ' + mensaje + ' ¿Desea continuar?', 'Advertencia',
                function () {
                    divPadre.remove();
                    cmbFinanciacion.val('-1');
                    financiarModelo.fineliminadas++;
                    vista.asignarValoresFinanciacion();
                    vista.gestionLiquidaciones(cmbFinanciacion);
                }, true
                );
    },
    /** Hace petición ajax para consultar la tasa de interés según el tipo de liquidación seleccionada
     * @returns {void}
     **/
    consultarInfoLiquidacion: function (comboFinanciacion) {
        var _this = comboFinanciacion;

        vista.gestionLiquidaciones(_this);
        var divPadre = _this.parents().eq(2);
        var vlrFinanciableAnterior = parseInt(divPadre.find('input[id^="txtVlrFinanciable"]').attr('data-valor'));

        divPadre.find('table').empty();
        divPadre.find('input:text').val('');
        divPadre.find('.spanTipoFinanciacion').text('');
        financiarModelo.valorNoFinanciable += !isNaN(vlrFinanciableAnterior) ? vlrFinanciableAnterior : 0;


        if (_this.val() !== '-1' && _this.val()) {

            var venta = financiarModelo.detallesVenta.venta.idventa;
            var infoEnviar = {idliquidacion: _this.val(), idventa: venta};
            var liquidacion = financiarControl.consultarLiquidacionPorId(infoEnviar.idliquidacion);
            financiarControl.consultarInteres(infoEnviar, function (data) {
                if (data.codigoRespuesta !== 1) {
                    __dom.ocultarToast();
                    __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                    return;
                }
                financiarControl.consultarConceptoLiquidacion(infoEnviar, function (data) {
                    vista.onConsultarConceptoLiquiquidacionCompleto(data, infoEnviar, divPadre);
                });

                divPadre.find('.spanTipoFinanciacion').text(' - ' + _this.find('option:selected').text());
                var txtInteres = divPadre.find('input.interesfinanciacion');
                txtInteres.val(data.interes).attr('data-iva', data.interesiva);
                if (liquidacion) {
                    txtInteres.attr('tipo-cuota', liquidacion.tipocuota)
                }
                financiarModelo.interesmaximo = (data.interes > financiarModelo.interesmaximo) ? data.interes : financiarModelo.interesmaximo;
            });
        }
    },
    /**
     * Obtiene la respuesta del servidor cuando se consultan los concepto financiables de la 
     * venta según la liquidación seleccionada
     * @param {object} data Listado con conceptos de una venta para financiar
     * @returns {void}
     */
    onConsultarConceptoLiquiquidacionCompleto: function (data, infoEnviar, divPadre) {
        if (!financiarModelo.conceptoLiquidacion) {
            financiarModelo.conceptoLiquidacion = [];
        }
        var liquidacion = financiarControl.consultarLiquidacionPorId(infoEnviar.idliquidacion);
        if (liquidacion) {
            infoEnviar.idtipodocumento = liquidacion.idtipodocumento;
        }

        infoEnviar.conceptos = data.conceptos;
        financiarModelo.conceptoLiquidacion.push(infoEnviar);
        vista.onConsultarConceptoLiquidacion(data, divPadre);
    },
    /**
     * Obtiene la respuesta del servidor cuando se consultan los conceptos de una liquidación
     * @param {object} data - Información enviada por el servidor con conceptos de una liquidación
     * @param {object} selector - División donde se encuentra la tabla dodne se cargarán los conceptos
     * @returns {object} Tabla cargada con conceptos
     */
    onConsultarConceptoLiquidacion: function (data, selector) {
        var tbl = selector.find('table')[0].id;
        if (data.codigoRespuesta !== 1) {
            __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
            return;
        }

        if (data.conceptos.length > 0) {
            var tblFinanciable = fillTable(tbl, "formatoConceptosFinanciables", data.conceptos, "Conceptos Financiables");
            tblFinanciable.find('tbody td[header="thValorCuota"]').text(0);
            tblFinanciable.find('tbody td[header="thValorFinanciar"]').text(0);
            tblFinanciable.find('tbody td[header="thSeleccion"] input[type="checkbox"]')
                    .on('click', vista.validarConceptoSeleccionada);

            var vlrFinanciable = 0;
            for (var z = 0; z < data.conceptos.length; z++) {
                vlrFinanciable += parseInt(data.conceptos[z].valortotal);
            }
            selector.find('input[id^="txtVlrFinanciable"]').val(vlrFinanciable).toTxtCurrency();
            //En caso de que la venta tenga financiaciones verifica la financiación que se está cargando y modifica campos por concepto
            if (financiarModelo.financiacionVenta && financiarModelo.cargarfinanciacionventa) {
                if (financiarModelo.financiacionVenta.financiable.length > 0) {
                    $('#divArchivoVinculacion').show();
                    vista.cargarInformacionFinanciacion(data, selector, tblFinanciable);
                }
                if (financiarModelo.cargarfinanciacionventa === 1) {
                    vista.calcularValoresResumen();
                }
                return;
            }
            vista.asignarValoresFinanciacion();
        }
    },
    /**
     * Carga la información de una financiación en las tablas y en el modelo
     * @returns {void}
     */
    cargarInformacionFinanciacion: function (data, selector, tbl) {
        var cuotaInicial = 0;
        var vlrFinanciar = 0;
        //var vlrFinanciable = 0;
        var txtVlrFinanciable = selector.find('input[id^="txtVlrFinanciable"]');
        var vlrFinanciable = txtVlrFinanciable.attr('title');

        var liquidacion = selector.find('.tipofinanciacion').val();
        for (var i = 0; i < financiarModelo.financiacionVenta.financiable.length; i++) {
            var financiacion = financiarModelo.financiacionVenta.financiable[i];

            if (parseInt(financiacion.idliquidacion) === parseInt(liquidacion)) {
                for (var j = 0; j < financiacion.conceptos.length; j++) {
                    var concepto = financiacion.conceptos[j];
                    var fila = tbl.find('tbody tr input[value="' + concepto.idconcepto + '"]').parents('tr');
                    var conceptoGuardado = financiarControl.consultarConceptosPorId(data.conceptos, concepto.idconcepto);
                    if (conceptoGuardado) {

                        fila.addClass('selected');
                        //vlrFinanciable += parseInt(concepto.valortotal);
                        vlrFinanciar += parseInt(concepto.valorfinanciar);
                        cuotaInicial += parseInt(concepto.valorcuotaincial);
                        conceptoGuardado.valorcuota = concepto.valorcuotaincial;
                        conceptoGuardado.valorfinanciar = concepto.valorfinanciar;
                        tbl.find('input[value="' + concepto.idconcepto + '"]').attr('checked', true);
                        fila.find('td[header="thValorCuota"]').text(concepto.valorcuotaincial.toString().toCurrency());
                        fila.find('td[header="thValorFinanciar"]').text(concepto.valorfinanciar.toString().toCurrency());
                    }
                }
                break;
            }
        }
        txtVlrFinanciable.attr('data-valor-suma', vlrFinanciable).attr('data-valor', vlrFinanciable);
        selector.find('input[id^="txtVlrFinanciar"]').attr('data-valor-suma', vlrFinanciar);
        selector.find('input[id^="txtVlrCuota"]').attr('data-valor-suma', cuotaInicial);
    },
	
	 /**
     * Hace petición ajax para consultar un número de pagaré
     * @returns {void}
     */
    generarNumeroPagare: function () {
        $('#btnGenerarNumeroPagare').attr('disabled', 'disabled');
        if (!financiarModelo.numeropagare) {
            var data = {idfinanciacion: financiarModelo.idfinanciacion};
            financiarControl.consultarNumeroPagare(data, function (data) {
                financiarModelo.numeropagare = data.numeropagare;
            });
        }
    },    
    
    /** Valida la información de la financiación si faltan campos obligatorios mostrará una alerta
     * en caso contrario invoca función para imprimir un contrato.
     * @returns {void}
     */
    validarContrato: function () {
        var _this = $(this);
        var nombre = _this.attr('data-id');
        var mensaje = '';
        if ((nombre === 'PagarePersonaNaturalFinal' || nombre === 'PagarePersonaJuridicaFinal') && !financiarModelo.numeropagare) {
            __dom.lanzarAlerta('Debe generar el número de pagaré para descargar el formato', 'Atención', function () {
                $('#btnGenerarNumeroPagare').focus();
            });
            return;
        }
        //if (!financiarModelo.suscripcion || !financiarModelo.idfinanciacion) {
        if (!financiarModelo.detallesSuscripcion) {
            mensaje += __app.mensajes.seleccionarSuscripcion + '.<br />';
        }
        //if (!financiarModelo.totalFinanciar || financiarModelo.totalFinanciar <= 0) {
        if ($('#txtValorFinanciar').val().trim() === '') {
            mensaje += __app.mensajes.requiereValorFinanciarMayor + '.<br />';
        }
        if ($('#txtNumCuotas').val().trim() === '') {
            mensaje += 'Para generar la financiación, debe escoger una cantidad de cuotas entre 1 y ' + financiarModelo.plazomaximo + ' .<br />';
        }
        if (!financiarModelo.idSolicitante) {
            mensaje += __app.mensajes.seleccionarSolicitante + '.<br />';
        }
        /*if (!financiarModelo.interes) {
            mensaje += __app.mensajes.tipoLiquidacion + '.<br />';
        } else {
            var result = _that.calcularAmortizacion(financiarModelo);
            if (result === false) {
                mensaje += __app.mensajes.tipoLiquidacion + '.<br />';
            }
        }*/
        if ($('#cmbParentesco').val() === '-1') {
            mensaje += 'Debe seleccionar el parentesco. <br/>';
        }

        if (mensaje !== '') {
            __dom.lanzarAlerta(mensaje, __app.mensajes.atencion);
            return;
        }
        impresionVista.validarInfoImprimirContrato(_this, financiarModelo, 'financiacionPostventa');
    },
    
	
    /** Restringe las selecciones de conceptos e invoca función para calcular la sumatoria de los saldos de las facturas.   
     * @returns {void}
     */
    validarConceptoSeleccionada: function (e) {
        var _this = $(this);
        var divPadre = _this.parents('.divContenedorColapsable:eq(0)');
        var idliquidacion = divPadre.find('select.tipofinanciacion').val();
        var txtFinanciable = divPadre.find('input[id^="txtVlrFinanciable"]');
        var vlrFinanciado = parseInt(txtFinanciable.attr('data-valor'));
        vlrFinanciado = isNaN(vlrFinanciado) ? 0 : vlrFinanciado;
        //Se busca los conceptos por la liquidación y luego por 
        var concepto = financiarControl.consultarConceptoPorIdyIdLiquidacion(idliquidacion, _this.val());
        if (concepto) {
            if (_this.prop('checked')) {
                vista.validarSeleccionConcepto(_this, concepto, divPadre, vlrFinanciado);
                return;
            }
            vlrFinanciado -= concepto.valortotal;
            txtFinanciable.attr('data-valor', vlrFinanciado);
            financiarModelo.valorNoFinanciable += parseInt(concepto.valortotal);
            vista.asignarValoresFinanciacion();
        }
        //vista.actualizarSumatorias();
    },
    /**
     * Valida si el concepto está seleccionado en otra tabla mostrar verificación
     * @returns {void}
     */
    validarSeleccionConcepto: function (_this, concepto, divPadre, vlrFinanciado) {
        var tablaActual = divPadre.find('table');
        var divDialog = $('#divAlertaConceptoRepetido');
        var tablas = $('#divFinanciaciones table').not(tablaActual);
        var txtFinanciable = divPadre.find('input[id^="txtVlrFinanciable"]');
        var liquidacion = divPadre.find('select.tipofinanciacion option:selected').text();
        var chkConcepto = tablas.find('input[value="' + concepto.idconcepto + '"]:checked');

        var fxContinuar = function () {
            vlrFinanciado += concepto.valortotal;
            txtFinanciable.attr('data-valor', vlrFinanciado);
            financiarModelo.valorNoFinanciable -= parseInt(concepto.valortotal);
            vista.asignarValoresFinanciacion();
        };

        if (chkConcepto.length === 0) {
            fxContinuar();
            return;
        }

        chkConcepto = $(chkConcepto[0]);
        var fxCancel = function () {
            _this.prop('checked', false);
            vista.dialogoActual.dialog('close');
            _this.parent().parent().removeClass('selected');
        };
        var fxAceptar = function () {
            fxContinuar();
            chkConcepto.prop('checked', false);
            vista.dialogoActual.dialog('close');
            chkConcepto.parent().parent().removeClass('selected');
        };
        var nombreFinanciacion = chkConcepto.parents('.divContenedorColapsable:eq(0)').find('span.spanTipoFinanciacion').text();
        divDialog.find('#spanNombreLiquidacion').text(liquidacion);
        divDialog.find('#spanNombreConcepto').text(concepto.concepto);
        divDialog.find('#spanNombreFinanciacion').text(nombreFinanciacion);
        vista.dialogoActual = divDialog.dialogo({
            modal: true,
            width: 550,
            dialogClass: "no-close",
            title: __app.mensajes.atencion,
            buttons: {
                'Sí': fxAceptar,
                'Cancelar': fxCancel
            }

        });
    },
    /** Valida la información de la financiación si faltan campos obligatorios mostrará alerta
     *  en caso contrario invoca función para grabar financiación.
     * @returns {void}
     */
    validarFinanciacion: function () {
        var mensaje = '';
        var parentesco = $('#cmbParentesco').val();
        var vlrFinanciar = $('#txtValorFinanciar').attr('title');
        var vlrVenta = parseInt(financiarModelo.detallesVenta.venta.valortotal);
        var vlrCuotaInicial = parseInt($('#txtValorCuotaInicial').attr('title'));
        if (!financiarModelo.detallesSuscripcion) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarSuscripcion, __app.mensajes.atencion);
            return;
        }
        var divConceptos = $('#divFinanciaciones .divContenedorColapsable');
        if (divConceptos.length === 0) {
            __dom.lanzarAlerta('Debe agregar financiaciones.', __app.mensajes.atencion, function () {
                $('#btnAgregarFinanciacion').focus();
            });
            return;
        }
        if (vlrCuotaInicial > 0) {
            if (vlrCuotaInicial < financiarModelo.valorConceptosNoFinanciable) {
                __dom.lanzarAlerta('La cuota inicial debe cubrir el valor no financiable', __app.mensajes.atencion);
                return;
            }

            if ((vlrCuotaInicial + parseInt(vlrFinanciar)) < vlrVenta) {
                __dom.lanzarAlerta('La cuota inicial debe ser mayor a la sumatoria de los conceptos no financiables y los conceptos no financiados', __app.mensajes.atencion);
                return;
            }
        } else if (parseInt(vlrFinanciar) < (vlrVenta - financiarModelo.valorConceptosNoFinanciable)) {
            __dom.lanzarAlerta('Debe financiar todos los conceptos. Intente nuevamente.', __app.mensajes.atencion);
            return;
        }



        for (var i = 0; i < divConceptos.length; i++) {
            var div = $(divConceptos[i]);
            var cmbliquidacion = div.find('.tipofinanciacion');
            var liquidacion = cmbliquidacion.find('option:selected').text();
            var conceptos = div.find('table tbody td input:checked');
            var interes = div.find('input.interesfinanciacion').val();

            if (!cmbliquidacion.val() || cmbliquidacion.val() === '-1') {
                __dom.lanzarAlerta('Debe digitar la información de la financiación #' + i + 1, __app.mensajes.atencion, function () {
                    cmbliquidacion.focus();
                });
                return;
            }

            if (interes === '') {
                __dom.lanzarAlerta('No se encontró tasa de intéres para la liquidacion <b>' + liquidacion + '</b> debe parametrizarla para financiar.', __app.mensajes.atencion, function () {
                    cmbliquidacion.focus();
                });
                return;
            }
            if (conceptos.length === 0) {
                var mensaje = "Debe seleccionar conceptos a financiar en la financiación <b>" + liquidacion + '</b>';
                __dom.lanzarAlerta(mensaje, __app.mensajes.atencion);
                return;
            }
        }
        if (!parentesco || parentesco === '-1') {
            mensaje += 'Debe seleccionar un parentesco. </br>';
        }
        if (!financiarModelo.idSolicitante) {
            mensaje += __app.mensajes.seleccionarSolicitante + '.<br />';
        }
        if (!financiarModelo.idEntidad) {
            mensaje += __app.mensajes.seleccionarBanco + '.<br />';
        }
        if ($('#txtNumCuotas').val().trim() === '') {
            mensaje += 'Para generar la financiación, debe escoger una cantidad de cuotas entre 1 y ' + financiarModelo.plazomaximo + ' .<br />';
        }
        if (financiarModelo.financiacionVenta && financiarModelo.archivos.length === 0) {
            mensaje += 'Debe subir archivos de la financiación. <br>';
        }
        if (isNaN(parseInt(vlrFinanciar)) || parseInt(vlrFinanciar) <= 0) {
            mensaje += 'No se encontraron valores para financiar';
        }
        if (mensaje !== '') {
            __dom.lanzarAlerta(mensaje, __app.mensajes.atencion);
            return;
        }
        if ($('#divInfoFinanciera').is(':hidden')) {
            __dom.lanzarAlerta('No ha agregado información financiera ¿Desea continuar?', 'Atención', vista.guardarFinanciacion, true);
            return;
        }
        vista.guardarFinanciacion();
    },
    /** Hace petición AJAX para grabar una financiación.
     * @returns {void}
     */
    guardarFinanciacion: function () {
        var financiacion = {
            "idsuscripcion": financiarModelo.detallesSuscripcion.suscripcion.idsuscripcion,
            "archivos": financiarModelo.archivos,
            "idbanco": financiarModelo.idEntidad,
            "numerocuotas": $('#txtNumCuotas').val(),
            "idciclo": $('#txtCiclo').attr('data-id'),
            "idperiodo": $('#txtPeriodo').attr('data-id'),
            "idsolicitante": financiarModelo.idSolicitante,
            "valortotalfinanciar": financiarModelo.totalFinanciar,
            "idventa": financiarModelo.detallesVenta.venta.idventa,
            "cuotainicial": $('#txtValorCuotaInicial').attr('title'),
            "archivoseliminados": financiarModelo.archivosEliminados,
            "financiaciones": []
        };

        if ($('#txtNumFinanciacion').val().trim() !== '') {
            financiacion.numerofinanciacion = $('#txtNumFinanciacion').val();
        }
        financiacion.informacion = {};
        impresionVista.accion = 'guardar';
        if (impresionVista.agregarInformacionContratoVinculacion(financiacion)) {
            financiacion.personanatural = financiacion.informacion.personanatural;
            financiacion.personajuridica = financiacion.informacion.personajuridica;
            financiacion.informacion = {};
        }

        var dataEnviar = vista.armarObjetoFinanciaciones(financiacion);
        $('#btnGrabar').attr('disabled', 'disabled');
        financiarControl.guardarFinanciacion({financiacion: dataEnviar}, vista.guardarFinanciacionCompleta);
    },
    /**
     * Construye un objeto de las financiaciones creadas
     * @returns {void}
     */
    armarObjetoFinanciaciones: function (financiacion) {
        var divFinanciacion = $('#divFinanciaciones .divContenedorColapsable');
        for (var indiceFinanciacion = 0; indiceFinanciacion < divFinanciacion.length; indiceFinanciacion++) {
            var divFinanciacionActual = $(divFinanciacion[indiceFinanciacion]);
            var liq = divFinanciacionActual.find('.tipofinanciacion').val();

            var infoLiq = financiarControl.consultarLiquidacionUtilizadaPorId(liq);
            var conceptosLiquidacion = financiarControl.consultarConceptosPorLiquidacion(liq).info;
            var conceptoSeleccionados = divFinanciacionActual.find('table tbody tr td[header="thSeleccion"] input:checked');
            var conceptos = [];

            if (conceptosLiquidacion) {
                for (var indiceConcepto = 0; indiceConcepto < conceptoSeleccionados.length; indiceConcepto++) {
                    var fila = $(conceptoSeleccionados[indiceConcepto]);
                    var concepto = financiarControl.consultarConceptosPorId(conceptosLiquidacion.conceptos, fila.val());
                    concepto.idventa = conceptosLiquidacion.idventa;
                    concepto.valorreal = parseFloat(concepto.valortotal);
                    conceptos.push(concepto);
                }
                financiacion.financiaciones.push({
                    idliquidacion: liq,
                    conceptos: conceptos,
                    idbanco: financiarModelo.idEntidad,
                    idventa: conceptosLiquidacion.idventa,
                    numerocuotas: $('#txtNumCuotas').val(),
                    idparentesco: $('#cmbParentesco').val(),
                    iddocumento: infoLiq.liquidacion.iddocumento,
                    idtipodocumento: infoLiq.liquidacion.idtipodocumento,
                    idsolicitante: financiarModelo.idSolicitante.idtercero,
                    valortotalfinanciar: divFinanciacionActual.find('.valorafinanciar').attr('title')
                });
            }
        }
        return financiacion;
    },
    /** Captura respuesta del servidor al guardar una financiación
     * @param {object} data - Respuesta del servidor
     * @returns {void}
     */
    guardarFinanciacionCompleta: function (data) {
        switch (data.codigoRespuesta) {
            case -1:
            case -3:
            case 0:
                var fxAceptar = function () {
                    $('#btnGrabar').removeAttr('disabled');
                };
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion, fxAceptar, false, fxAceptar);
                break;
            case 1:
                if (financiarModelo.financiacionVenta) {
                    __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion, vista.limpiarFormulario, false, vista.limpiarFormulario);
                    return;
                }
                __dom.lanzarAlerta(data.mensaje + '<br> Debe <b>descargar los formatos </b> y <b>subir los soportes </b> de la financiación. ', __app.mensajes.atencion,
                        function () {
                            vista.permitirSubirArchivo(data.datos);
                        }, false, function () {
                    vista.permitirSubirArchivo(data.datos);
                });
                break;
        }
    },
    /**
     * Configura la interfaz para que el usuario pueda subir archivos de la financiación
     * @returns {void}
     */
    permitirSubirArchivo: function (id) {
        if (vista.appload.container) {
            vista.appload.container.find('div.files-list').empty();
        }
        $('#btnSubirArchivos').show();
        $('#divAdjuntosFinanciacion').show();
        $('#liFormatos').show().find('a').click();
        $('#btnGrabar').attr('disabled', 'disabled');
        $('#divArchivosContrato button:eq(0)').focus();
        financiarModelo.idfinanciacion = id;
    },
    /** Pide confirmación para cancelar una financiación.
     * @returns {void}
     */
    cancelarFinanciacion: function () {
        if (financiarModelo.detallesSuscripcion) {
            $('div#divConfirmCancelar').dialogo({
                resizable: false,
                heigth: 140,
                modal: true,
                title: 'Cancelar la operación',
                buttons: {
                    "Sí": function () {
                        $(this).dialog('close');
                        vista.limpiarFormulario();
                    }, Cancelar: function () {
                        $(this).dialog("close");
                    }
                }
            });
        }
    },
    /** Limpia el dialogo de búsqueda
     * @returns {void}
     */
    limpiarFiltro: function () {
        var filtro = $('#divBuscarVenta');
        filtro.find('input[type="text"]').val('');
        $('#btnSubirArchivos').hide();
    },
    /** Quita toda la información mostrada en la pantalla
     * @returns {void}
     */
    limpiarFormulario: function () {
        $('#cmbParentesco').val('-1');
        $('input[type="text"]').val('');
        $('#divFinanciaciones').empty();
        $('#divArchivoVinculacion').hide();
        $('#divAdjuntosFinanciacion').hide();
        $('#btnGrabar').removeAttr('disabled');
        $('#tblConceptoNoFinanciable').empty();
        $('#divFinanciacion legend span').text('');
        var divFinanciera = $('#divInfoFinanciera').hide();
        $('#txtFecha, #txtFechaActualImpresion').val(vista.fechaactual);
        divFinanciera.find('input:text, select').val('').removeAttr('title');
        $('#divDetallesFactura, #divFinanciacion, #divArchivo, #divContrato').hide();
        $('#btnAgregarInfoFinanciera, #btnVerSimulador').attr('disabled', 'disabled');
        $('#btnVerDetalleVenta, #btnAgregarFinanciacion').attr('disabled', 'disabled');
        if (vista.appload.container) {
            vista.appload.container.find('.files-list').empty();
        }
        var plazo = financiarModelo.plazomaximo;
        var interes = financiarModelo.interesmaximo;
        financiarModelo = {
            archivos: [],
            plazomaximo: plazo,
            interesmaximo: interes,
            valorNoFinanciable: 0,
            archivosEliminados: [],
            conceptoLiquidacion: [],
            indiceFinanciacion: 0, liquidacionesUtilizadas: []};
    }
};
financiarVista.init();
