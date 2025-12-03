/**
 * @fileOverview Archivo de vista y control de financiación
 * @author AppFuture
 * @requires control.js
 * @requires modelo.js
 * @version 1.0.0
 */
/**
 * Objeto que hace referencia al namespace generarFinanciacionVista
 * @type {Object}
 */
var that = null;

/**
 * Variable que determina operación a realizar en evento click del botón a guardar
 * @type {String}
 */
var operacion = 'guardar';
/** @namespace */
var generarFinanciacionVista = {
    /** Hace referencia al último dialogo abierto en la aplicación
     * @type {object}
     */
    dialogoActual: null,
    /**Inicializa el programa de financiación, y asigna listeners a los controles
     * @returns {void}
     */
    init: function () {
        that = this;
        $('#divNatural, #divAdjuntosFinanciacion').tabs();
        $('#btnGrabar').on('click', that.validarFinanciacion);
        $('#btnCancelar').on('click', that.cancelarFinanciacion);
        $('#btnCargarFacturas').on('click', that.cargarFacturas);
        $('button#btnSuscripcion').on('click', that.mostrarFiltro);
        $('#btnCargarSimulador').on('click', that.validarSimulador);
        $('#btnSubirArchivos').on('click', that.actualizarInformacion);
        $('#cmbTipoLiquidacion').on('change', that.validarFinanciacion);
        $('#cmbTipoDocumento').on('change', that.cargarDocumentosPorTipo);
        //$('input[data-caja="number"]').on('blur', that.actualizarTotales);
        $('#btnGenerarNumeroPagare').on('click', that.generarNumeroPagare);
        $('#cmbTipoDocumento, #cmbDocumento').on('change', that.consultarLiquidacion);
        $('#divArchivosContrato .archivoSubido button').on('click', that.validarContrato);
        $('#btnAgregarInformacionFinanciera').on('click', that.mostrarInformacionFinanciera);
        $('#txtMesesExperienciaEmpresarial, #txtMesesExperienciaLaboral').on('blur', that.validarMeses);
        that.cajas = $('#divFormulario').find('input:text, select').not('[disabled], #txtFiltroCodAnt, #txtFiltroSus');
        $('#txtNombreSolicitante').on('change', function () {
            financiacionModel.idSolicitante = $('#txtNombreSolicitante').val() !== '' ? financiacionModel.idSolicitante : '';
        });
        $('#btnDescartaFacturas').on('click', that.buscaFacturaDescarteConceptos);


        that.configurarAutoComplete();
        that.appload = new Appload('#txtArchivo', {
            url: 'generarfinanciacion/subir_archivo',
            lg: esAppload,
            multiple: true,
            showDeleteBtn: true,
            showDownloadBtn: true,
            showUploadButton: false,
            showDiscardButton: false,
            maxSize: 1024 * 1024 * 10,
            showSingleUploadBtn: false,
            fileTypes: ['pdf', 'doc', 'docx']
        });

        $('a.appload-input').css({color: '#FFF'});
        __dom.configurarCalendario('txtFechaIngresoLaboral');
        that.appload.addListener('onFileSelected', that.uploadFile);
        that.appload.addListener('onsingleupload', that.subirCompleto);
        __dom.configurarTextoNumerico('txtNumCuotas').focusout(that.validarCuotas);
        __dom.configurarTextoNumerico('txtInteres', false, true, false).focusout(that.validarInteres);
        __dom.configurarTextoNumerico('txtCapitalInicial, input[data-caja="number"]');
        __dom.configurarTextoNumerico('txtNumeroCuotas, #txtFiltroSus, #txtFiltroCodAnt');
        controlFinanciacion.consultarParentescos(that.onConsultarParentescos);
        that.configurarTxtCurrencyHabilitado($('#divFinanciera input[type="text"][data-caja="number"]:not(input[disabled])'));
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
            that.actualizarTotales();
        });
        caja.on('focus', function (e) {
            var _input = $(e.currentTarget);
            _input.val(_input.attr('title'));
        });
    },
    /**
     * Obtiene la respuesta del servidor cuando se consultan los posibles parentesco
     * @param {object} data - Listado con parentescos del solicitante
     * @returns {void}
     */
    onConsultarParentescos: function (data) {
        if (data.codigoRespuesta === 1) {
            __dom.llenarCombo($('#cmbParentesco'), data.parentescos, 'idunidad', 'parentesco');
        }
    },

    /**
     * Muestra la información de la información financiera, tanto de persona natural como de jurídica, según sea el caso.
     * @returns {void}
     */
    mostrarInformacionFinanciera: function () {
        $('#divNatural').show();
        var div = $('#divInfoFinanciera').show();
        if ($('a[href="#divJuridica"]').is(':visible')) {
            div = ($('#divJuridica').is(':visible')) ? $('#divJuridica') : $('#divFinanciera');
        }
        if ($('a[href="#divNatural"]').is(':visible')) {
            div = ($('#divLaboral').is(':visible')) ? $('#divLaboral') : $('#divFinanciera');
        }
        $(div.find('input:text').not('input[disabled]')[0]).focus();
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
                    financiacionModel.archivos.push({idarchivo: archivo});
                    var btn = $('.files-list .file-item:last .file-item-btns button.appload-btn-delete');
                    btn.attr('data-id', archivo);
                    btn.on('click', that.eliminarArchivo);
                }
                break;
        }
    },

    /**
     * Invoca la actualización de la información de la financiación.
     * @returns {void}
     */
    actualizarInformacion: function () {
        var idfinanciacion = financiacionModel.idfinanciacion;
        if (idfinanciacion && financiacionModel.archivos.length > 0) {
            var data = {
                archivos: financiacionModel.archivos,
                numerofinanciacion: idfinanciacion
            };
            controlFinanciacion.grabarArchivos(data, that.onActualizacionCompleto);
        }
    },

    /**
     * Muestra un mensaje indicando que la actualización fue exitosa y limpia el formulario.
     * @param  {Object} data La respuesta del servidor.
     * @returns {void}
     */
    onActualizacionCompleto: function (data) {
        if (data.codigoRespuesta === 1) {
            __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion, that.limpiarFormulario);
        }
    },
    /**
     * Permite subir un archivo a penas es seleccionado
     * @param {object} data - Archivo que se subirá
     * @returns {void}
     */
    uploadFile: function (data) {
        if (!financiacionModel.idfinanciacion) {
            __dom.lanzarAlerta('No se encontró una financiación para subir soportes', __app.mensajes.atencion, function () {
                that.appload.container('.file-list .file-item:last').remove();
            });
            return;
        }
        if (that.appload.files.length > 0) {
            that.appload.singleUpload(data.data, {'modulo': 'financiacion'});
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
                    that.onEliminarCompleto(id, _this.parents('.file-item')[0]);
                }, Cancelar: function () {
                    $(this).dialog("close");
                }
            }
        });
    },
    /**
     * Hace petición ajax para eliminar un archivo de una financiación
     * @param {number} id - Id del archivo que se desea eliminar
     * @returns {void}
     */
    onEliminarCompleto: function (id, list) {
        controlFinanciacion.eliminarArchivo({accion: 'E', idarchivo: id}, function (data) {
            if (data.codigoRespuesta === 1) {
                var archivo = controlFinanciacion.consultarArchivoPorId(id);
                financiacionModel.archivos.splice(archivo.indice, 1);
                $(list).remove();
            }
        });
    },
    /**
     * Asigna funcionalidad a cajas de texto para autocompletar con sus respectivas propiedades y recursos.
     * @returns {void}
     */
    configurarAutoComplete: function () {
        // Autocompletado de terceros
        __dom.configurarAutocomplete(
                'input#txtNombreSolicitante',
                that.sourceAutoComplete,
                function (event, ui) {
                    $('input#txtDocSolicitante').val(ui.item ? ui.item.documento : '');
                    financiacionModel.idSolicitante = ui.item.todo;
                },
                function (txt) {
                    $('input#txtDocSolicitante').val('');
                    financiacionModel.idSolicitante = undefined;
                }
        );

        ///ESTO SE USA EN ALGUN LUGAR?
        __dom.configurarAutocomplete(
                'input#txtCodeudor',
                that.sourceAutoComplete,
                function (event, ui) {
                    financiacionModel.codeudor = ui.item.todo;
                },
                function () {
                    financiacionModel.codeudor = null;
                }
        );

        __dom.configurarAutocomplete(
                '#txtBanco',
                that.sourceAutoCompleteBanco,
                function (event, ui) {
                    $(this).attr('data-documento', ui.item.documento)
                            .attr('data-id', ui.item.idVal);
                    financiacionModel.idEntidad = ui.item.idVal;
                },
                function () {
                    $(this).removeAttr('data-documento')
                            .removeAttr('data-id');
                    financiacionModel.idEntidad = undefined;
                }
        );
    },
    /** Realiza la petición AJAX para consultar los terceros que pueden solicitar financiación
     * del autocomplete
     * @returns {void}
     */
    sourceAutoComplete: function (request, response) {
        that.request = request;
        that.response = response;
        var datos = {};
        if (request.term.trim() !== '') {
            datos.nombre = request.term;
            controlFinanciacion.buscarSolicitante(datos, that.mostrarResultado);
        }
    },
    /** Muestra el resultado de la consulta de los terceros en la lista desplegable.
     * @returns {void}
     */
    mostrarResultado: function (data) {
        if (data.codigoRespuesta === 1) {
            var result = [];
            $.each(data.datos, function (i, item) {
                result.push({
                    label: item.nombretercero,
                    value: item.nombretercero,
                    documento: item.documento,
                    idVal: item.idtercero,
                    todo: item
                });
            });
            that.response(result);
        }
    },
    /** Realiza la solicitud AJAX para consultar los bancos del autocomplete
     * @returns {void}
     */
    sourceAutoCompleteBanco: function (request, response) {
        that.request = request;
        that.response = response;
        var datos = {};
        datos.nombre = request.term;
        controlFinanciacion.buscarBanco(datos, that.mostrarResultadoBanco);
    },
    /** Muestra el resultado de la consulta de los bancos en la lista desplegable.
     * @returns {void}
     */
    mostrarResultadoBanco: function (data) {
        if (data.codigoRespuesta === 1) {
            var result = [];
            $.each(data.bancos, function (i, item) {
                result.push({
                    label: item.nombretercero,
                    value: item.nombretercero,
                    documento: item.documento,
                    idVal: item.idtercero
                });
            });
            that.response(result);
        }
    },
    /** Muestra un dialogo con el formulario para la búsqueda de las suscripciones
     * @returns {void}
     */
    mostrarFiltro: function () {
        var filtro = $('div#camposBuscarSuscripcion');
        that.dialogoActual = filtro.dialogo({
            modal: true,
            width: 400,
            title: 'Buscar un suscripción',
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
        var suscripcion = parseInt(filtro.find('#txtFiltroSus').val().trim());
        var codAnt = filtro.find('#txtFiltroCodAnt').val().trim();
        if (isNaN(suscripcion) && codAnt === '') {
            filtro.find('#spanMensaje').text(__app.mensajes.camposInvalidosFiltro).show();
            return;
        }
        var data = {};
        !isNaN(parseInt(codAnt)) ? data.codigoAnterior = codAnt : null;
        (!isNaN(suscripcion)) ? data.idSuscripcion = suscripcion : null;

        controlFinanciacion.consultarSuscripciones(data, that.consultaSuscripcionCompleto);

    },
    /** Captura la respuesta enviada por el servidor, cuando se consultan las suscripciones.
     * En caso de llegar varias suscripciones posibilita la selección de una.
     * @param  {object} data - El resultado de la petición ajax con las suscripciones que coinciden
     * @returns {void}
     */
    consultaSuscripcionCompleto: function (data) {
        that.limpiarFormulario();
        $('#spanMensaje').text('');
        switch (data.codigoRespuesta) {
            case 0:
                $('#spanMensaje').text(data.mensaje);
                break;
            case 1:
                that.limpiarFormulario();
                financiacionModel.tiposDocumentos = data.tiposdocumentos;
                financiacionModel.documentos = data.documentos;
                if (!data.tiposdocumentos || data.tiposdocumentos.length <= 0) {
                    __dom.lanzarAlerta(__app.mensajes.sinDocumentosTiposDoc, __app.mensajes.atencion);
                }
                financiacionModel.suscripcion = data.suscripcion[0];
                financiacionModel.fechaFinanciacion = data.fechaFinanciacion;
                financiacionModel.valorTope = data.topefinanciacion;
                financiacionModel.cicloPeriodo = {
                    idCiclo: data.idCiclo,
                    idPeriodo: data.idPeriodo,
                    ciclo: data.ciclo,
                    periodo: data.periodo
                };
                that.dialogoActual.dialog('close');
                that.cargarCabecera();
                break;
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
            var campos = fieldset.find('input:text[data-caja="number"]');
            for (var i = 0; i < campos.length; i++) {
                var campo = $(campos[i]);
                total += !isNaN(parseInt(campo.attr('title'))) ? parseInt(campo.attr('title')) : 0;
            }
            var cajaTotal = fieldset.find('input[data-caja="total"]').val(total.toString().toCurrency()).attr('data-value', total);

            if (cajaTotal.attr('id') === 'txtTotIngresos' || cajaTotal.attr('id') === 'txtTotEgreso') {
                that.actualizarValorEfectivo();
            }
        }
    },
    /**
     * Calcula el valor de efectivo disponible según los ingresos y egresos en información financiera
     * @returns {void}
     */
    actualizarValorEfectivo: function () {
        var vlrEgreso = parseInt($('#txtTotEgreso').attr('data-value'));
        var vlrIngreso = parseInt($('#txtTotIngresos').attr('data-value'));
        vlrEgreso = isNaN(vlrEgreso) ? 0 : vlrEgreso;
        vlrIngreso = isNaN(vlrIngreso) ? 0 : vlrIngreso;

        var efectivo = vlrIngreso - vlrEgreso;
        efectivo = (efectivo > 0) ? efectivo : 0;

        $('#txtEfectivo').val(efectivo).toTxtCurrency();
    },
    /** Carga la cabecera del formulario con los datos de la suscripción seleccionada.
     * @returns {void}
     */
    cargarCabecera: function () {
        var cabecera = $('#divCabecera');
        var ciclo = financiacionModel.cicloPeriodo;
        var suscripcion = financiacionModel.suscripcion;
        var estado = financiacionModel.suscripcion.estadosuscripcion;

        estado = estado === 'E' ? 'Eliminado' : (estado === 'A') ? 'Activa' : 'Pendiente';

        cabecera.find('#txtEstadoSuscripcion').val(estado);
        that.cargarInformacionTercero(financiacionModel.suscripcion);
        cabecera.find('#txtNombre').val(suscripcion.nombretercero);
        cabecera.find('#txtCodAnterior').val(suscripcion.codigoanterior);
        cabecera.find('#txtDocumento').val(suscripcion.documentotercero);
        $('#txtFecha').val(financiacionModel.fechaFinanciacion);
        var cmbTipoDocumento = cabecera.find('#cmbTipoDocumento').html('');
        $('#txtPeriodo').val(ciclo.periodo).attr('data-id', ciclo.idPeriodo);
        $('#txtSuscripcion, #txtSuscripcionImprimir').val(suscripcion.idsuscripcion);
        $('#txtCiclo').val(ciclo.ciclo).attr({'title': ciclo.ciclo, 'data-id': ciclo.idCiclo});

        for (var i = 0; i < financiacionModel.tiposDocumentos.length; i++) {
            var tipo = financiacionModel.tiposDocumentos[i];
            var option = $('<option>').val(tipo.idtipodocumento)
                    .attr('data-id', tipo.iddocumento)
                    .text(tipo.tipodocumento);
            cmbTipoDocumento.append(option);
        }
        cmbTipoDocumento.find('option:first').prop('selected', 'selected').change();
        controlFinanciacion.consultarDiasPeriodo({idsuscripcion: suscripcion.idsuscripcion}, that.onConsultarDiasPeriodo);
    },

    /**
     * Se ejecuta cuando se terminan de consultar los días del período.
     * @param  {Object} data La respuesta del servidor
     * @returns {void}
     */
    onConsultarDiasPeriodo: function (data) {
        if (data.codigoRespuesta > 0) {
            financiacionModel.diasterminoperiodo = data.diasterminoperiodo;
        }
    },
    /**
     * Carga la información de la suscripción/tercero para la información financiera
     * @returns {void}
     */
    cargarInformacionTercero: function (tercero) {
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
                $('#txtEstratoCat').val(tercero.estrato);
                $('#divJuridica, a[href="#divJuridica"]').show();
                $('#divLaboral, a[href="#divLaboral"]').hide();
                $("#divNatural").tabs("option", "disabled", [0]);
                //var txtactividad = $('#txtActividadEmpresarial');
                $('#txtBarrioEmpresarial').val(tercero.barrio);
                $('#txtDireccionEmpresarial').val(tercero.direccion);
                $('#txtMunicipioEmpresarial').val(tercero.municipio);
                $('#txtDepartamentoEmpresarial').val(tercero.departamento);
//                $('#txtTelefono1Empresarial').val(tercero.telefonofijo);
                $('#txtCorreoEmpresarial').val(tercero.correoelectronico);
//                $('#txtTelefono2Empresarial').val(tercero.telefonocelular);
                break;
        }

        //txtactividad.val(tercero.actividadeconomica);
        $('#txtDireccionImprimir').val(tercero.direccion);
        $('#txtPropietarioImprimir').val(tercero.nombretercero);
        //txtactividad.attr('data-id', tercero.idactividadeconomica);
    },
    /** Muestra los documentos por el tipo de documento seleccionado.
     * @returns {void}
     */
    cargarDocumentosPorTipo: function () {
        financiacionModel.descartaConceptosSeleccionados = [];
        financiacionModel.tipodocumento = $('#cmbTipoDocumento option:selected').text();
        controlFinanciacion.consultarDocumento({idsuscripcion: financiacionModel.suscripcion.idsuscripcion,
            idtipodocumento: $('#cmbTipoDocumento option:selected').val()}, function (data) {
            $('#cmbDocumento').empty();
            financiacionModel.documentos = data.documentos;
            __dom.llenarCombo($('#cmbDocumento'), data.documentos, 'iddocumento', 'documento');
        });
    },
    /** Hace petición AJAX para consulta las facturas de una suscripción seleccionada.
     * @returns {void}
     */
    cargarFacturas: function () {
        if (!!financiacionModel.suscripcion) {
            if ($('#cmbTipoDocumento option').length > 0 && $('#cmbTipoDocumento').val() > 0) {
                var data = {
                    idsuscripcion: financiacionModel.suscripcion.idsuscripcion,
                    iddocumento: $('#cmbDocumento option:selected').val() > 0 ? $('#cmbDocumento option:selected').val() : '',
                    idtipodocumento: $('#cmbTipoDocumento option:selected').val(),
                    descartaConceptos:''
                };
                controlFinanciacion.consultarFacturas(data, that.cargarFacturasCompleto);
            } else {
                __dom.lanzarAlerta(__app.mensajes.sinDocumentosTiposDoc, __app.mensajes.atencion);
            }
        }
    },
    /** Captura la respuesta del servidor cuando se consultan las facturas de una suscripción.
     * Visualiza las facturas en una tabla y configura elementos.
     * @returns {void}
     */
    cargarFacturasCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta((data.mensaje || data.mensajeError), __app.mensajes.atencion);
                $('#tblFacturas').empty();
                $('#divFinanciacion, #divAdjuntosFinanciacion').hide();
                break;
            case 1:
                if (data.facturas.length > 0) {
                    that.consultarLiquidacion();
                    financiacionModel.facturas = data.facturas;
                    var tblFac = fillTable("tblFacturas", "formatoFacturas", "financiacionModel.facturas", "Facturas").show();

                    tblFac.find('#check_general_tblFacturas_0').off('click').hide();
                    var btnDetalle = tblFac.find('tbody tr td[header="thDetallesFactura"] input');
                    btnDetalle.on('click', that.consultarDetallesFactura).attr('disabled', 'disabled');
                    tblFac.find('tbody tr td[header="thSeleccion"] input').on('click', that.validarFacturaSeleccionada);
                    var txtNumericos = tblFac.find('tbody tr td[header="thValorFinanciar"] input[type="text"]');
                    txtNumericos.css('width', '100px').attr('disabled', 'disabled').focusout(that.validarValorFinanciar);
                    __dom.configurarTextoNumerico(txtNumericos);
                } else {
                    $('#tblFacturas').empty();
                    $('#divFinanciacion').hide();
                    __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                }
                break;
        }
    },
    /** Hace petición ajax para consultar los detalles de una factura
     * @returns {void}
     */
    consultarDetallesFactura: function (e) {
        var btn = $(this);
        var idFactura = parseInt(btn.parent().attr('data-value'));
        financiacionModel.facturaSeleccionada = idFactura;
        controlFinanciacion.consultarDetallesFactura({'idfactura': idFactura}, that.onConsultarDetallesCompleto);
    },
    /** Captura la respuesta enviada por el servidor, cuando se consultan los detalles de una factura y lo muestra en un dialogo
     * @param  {object} data - El resultado de la petición ajax para guardar la información  del detalle de la factura
     * @returns {void}
     */
    onConsultarDetallesCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 1:
                var factura = controlFinanciacion.obtenerFacturaPodId(financiacionModel.facturaSeleccionada);
                if (!factura) {
                    return;
                }

                var div = $('#divDetallesFactura');
                var vlrNoFinanciable = div.find('#txtDetValorNoFinanciable').val('');
                var vlrFinanciable = div.find('#txtDetValorFinanciable').val('');
                div.find('#txtDetNumFactura').val(factura.numerofactura);
                div.find('table').empty();

                if (factura.valorfinanciable) {
                    vlrFinanciable.val(factura.valorfinanciable.toString().toCurrency());
                }
                if (factura.valornofinanciable) {
                    vlrNoFinanciable.val(factura.valornofinanciable.toString().toCurrency());
                }
                if (data.financiable.length > 0) {
                    var tblFinanciables = fillTable("tblConceptosFinanciables", "formatoConceptos", data.financiable, "Conceptos Financiables");
                    tblFinanciables.parent().css({'width': '49%'});
                    if (data.nofinanciable.length === 0) {
                        tblFinanciables.parent().css({'width': '95%'});
                    }
                }
                if (data.nofinanciable.length > 0) {
                    var tblNoFinanciable = fillTable("tblConceptosNoFinanciables", "formatoConceptos", data.nofinanciable, "Conceptos No Financiables");
                    tblNoFinanciable.parent().css({'width': '49%'});
                    if (data.financiable.length === 0) {
                        tblNoFinanciable.parent().css({'width': '95%'});
                    }
                }
                that.mostrarDialogoDetallesaFactura(factura.numerofactura);
                break;
        }
    },
    /**
     * Abre cuadro de diálogo con tablas de conceptos financiables y no financiables
     * @param {number} numerofactura - Número de la factura de la que se cargan detalles
     * @returns {void}
     */
    mostrarDialogoDetallesaFactura: function (numerofactura) {
        that.dialogoActual = $('#divDetallesFactura').dialogo({
            modal: true,
            width: 800,
            title: 'Detalles de la Factura #' + numerofactura,
            buttons: {
                Aceptar: function () {
                    financiacionModel.facturaSeleccionada = null;
                    that.dialogoActual.dialog('close');
                }
            }
        });
    },
    /** Restringe las selecciones de facturas e invoca función para calcular la sumatoria de los saldos de las facturas.
     * @returns {void}
     */
    validarFacturaSeleccionada: function (e) {
        var check = $(this);
        var trSeleccionada = check.parent().parent();
        var indice = parseInt(trSeleccionada.attr('data-fila'));
        var tdFinanciable = trSeleccionada.find('td[header="thValorFinanciable"]');
        var tdFinanciar = trSeleccionada.find('td[header="thValorFinanciar"] input');
        var tdDetalles = trSeleccionada.find('td[header="thDetallesFactura"] input');

        if (!check.is(':checked')) {
            that.actualizarSumatoriasFinanciacion();
            tdDetalles.attr('disabled', 'disabled');
            tdFinanciar.val('').attr('disabled', 'disabled');

            if (indice > 0) {
                var _fila = trSeleccionada.prev();
                _fila.find('input').removeAttr('disabled');
                _fila.find('td[header="thSeleccion"] input').prop('checked', true);
            }
            return;
        }

        var vlrFinanciable = parseFloat(tdFinanciable.attr('data-valor'));
        tdFinanciar.val(vlrFinanciable).removeAttr('disabled');
        trSeleccionada.addClass('selected');
        tdDetalles.removeAttr('disabled');
        //Si el evento se dispara al descheckear
        if (indice > 0) {
            for (var i = 0; i < indice; i++) {
                var fila = $(trSeleccionada.siblings()[i]);
                var vlrFinanciableFila = parseFloat(fila.find('td[header="thValorFinanciable"]').attr('data-valor'));
                fila.find('td[header="thDetallesFactura"] input').removeAttr('disabled');
                fila.addClass('selected')
                        .find('td[header="thValorFinanciar"] input')
                        .attr('disabled', 'disabled')
                        .val(vlrFinanciableFila);
                fila.find('td[header="thSeleccion"] input')
                        .attr('disabled', 'disabled')
                        .prop('checked', true);
            }
        }
        that.actualizarSumatoriasFinanciacion();
    },
    /** Suma cuanto se deberá pagar por las facturas seleccionadas.
     * @returns {void}
     */
    actualizarSumatoriasFinanciacion: function () {
        var txtMinPago = $('#txtValorMinPago, #txtCuotaInicialImprimir').val(0);
        var filas = $('#tblFacturas tbody tr.selected');
        var txtFinanciar = $('#txtValorFinanciar').val(0);
        var txtFinanciable = $('#txtValorFinanciable').val(0);
        if (filas.length === 0) {
            $('#divFinanciacion').hide();
            $('#divInfoFinanciera').hide();
            return;
        }

        var sumTotal = 0;
        var sumVlrFinanciar = 0;
        var sumNoFinanciable = 0;
        var sumVlrFinanciable = 0;
        $('#divFinanciacion').show();
        for (var f = 0; f < filas.length; f++) {
            var fila = $(filas[f]);
            sumTotal += parseFloat(fila.find('td[header="thValorTotal"]').text());
            sumVlrFinanciar += parseFloat(fila.find('td[header="thValorFinanciar"] input').val());
            sumVlrFinanciable += parseFloat(fila.find('td[header="thValorFinanciable"]').attr('data-valor'));
            sumNoFinanciable += parseFloat(fila.find('td[header="thValorNoFinanciable"]').attr('data-valor'));
        }
        financiacionModel.totalFacturas = sumTotal;
        txtFinanciar.val(sumVlrFinanciar).toTxtCurrency();
        financiacionModel.totalFinanciar = sumVlrFinanciar;
        txtFinanciable.val(sumVlrFinanciable).toTxtCurrency();
        var min = (sumVlrFinanciable - sumVlrFinanciar) + sumNoFinanciable;

        txtMinPago.val(min).toTxtCurrency();
    },
    /** Consulta las liquidaciones según el tipo de documento y documento seleccionados.
     * @returns {void}
     */
    consultarLiquidacion: function () {
        that.inicializarFacturas();
        var tipodocumento = $('#cmbTipoDocumento').val();
        if (tipodocumento > 0) {
            controlFinanciacion.consultarLiquidacion({idtipodocumento: tipodocumento}, that.onConsultarLiquidacionCompleto);
        }
    },
    /** Captura respuesta del servidor cuando se consultan las liquidaciones y se muestran en el combo
     * @returns {void}
     */
    onConsultarLiquidacionCompleto: function (data) {
        var cmb = $('#cmbTipoLiquidacion').empty();
        if (data.codigoRespuesta === 1 || !!data.financiacion) {
            var plazoglobal = 1000;
            cmb.append($('<option value="-1">Seleccione una opción </option>'));
            for (var i in data.financiacion) {
                var item = data.financiacion[i];
                var plazo = item.maximoplazo;
                plazoglobal = plazo < plazoglobal ? plazo : plazoglobal;
                var option = $('<option>').val(item.idliquidacion).text(item.liquidacion);
                option.attr({
                    'data-plazo': plazo,
                    'tipo-cuota': item.tipocuota,
                    'data-vence': item.financiarvencidas
                });
                cmb.append(option);
            }
            financiacionModel.plazomaximo = plazoglobal;
        }
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
    /** Valida que el valor a financiar no sea inferior a 0 ni mayor al valor de la factura.
     * @returns {void}
     */
    validarValorFinanciar: function () {
        var _this = $(this);
        var valor = parseFloat(_this.val());
        var max = parseFloat(_this.parent().attr('data-value'));
        if (valor > max) {
            _this.val(max);
            _this.focus().select();
        } else if (valor < 0) {
            _this.val(0);
            _this.focus().select();
        }
        that.actualizarSumatoriasFinanciacion();
    },
    /** Valida que las cuotas estén entre 1 y el máximo de cuotas posibles
     * @returns {void}
     */
    validarCuotas: function (e) {
        var _this = $(this);
        var cuotas = parseInt(_this.val());
        if (cuotas > financiacionModel.plazomaximo) {
            _this.val(financiacionModel.plazomaximo).focus().select();
        } else if (cuotas < 1) {
            _this.val('1').focus().select();
        }
        $('#txtNumeroCuotas').val(cuotas);
        financiacionModel.cuotas = cuotas;
    },
    /** Valida que el porcentaje de interés estén entre 0 y 10
     * @returns {void}
     */
    validarInteres: function (e) {
        var _this = $(this);
        var interes = parseFloat(_this.val());
        if (interes > 10) {
            _this.val('10').focus().select();
        } else if (interes < 0.1) {
            _this.val('0.1').select();
        } else {
            financiacionModel.interes = interes;
            $('#txtIntereses').val(interes).attr('data-iva', financiacionModel.interesiva);
        }
    },
    validarFacturasVencidas: function () {
        for (var i = 0; i < financiacionModel.facturas.length; i++) {
            var factura = financiacionModel.facturas[i];
            var fechavencimiento = new Date(factura.fechavencimientofactura);
            // if (new Date() >= fechavencimiento) {  -- Se reemplaza la fecha del cliente por la del servidor
            if (__app.obtenerFechaSistema() >= fechavencimiento) {
                return true;
            }
        }
        return false;
    },
    /** Valida la operación a realizar y que la información sea correcta sino es así
     * mostrará una alerta.
     * @returns {void}
     */
    validarFinanciacion: function (e) {
        var mensaje = '';
        var _this = $(this);
        var liq = $('#cmbTipoLiquidacion');
        var optionliq = liq.find('option:selected');
        if (liq.val() === '-1' || !liq.val()) {
            $('#txtInteres').val('');
            mensaje += 'Debe elegir <b>tipo liquidación</b>. <br />';
        }
        if (!financiacionModel.suscripcion) {
            mensaje += __app.mensajes.seleccionarSuscripcion + '.<br />';
        }
        if (!financiacionModel.facturas) {
            mensaje += __app.mensajes.seleccionarFacturas + '.<br />';
        }

        operacion = _this.attr('id') === 'cmbTipoLiquidacion' ? 'consultar' : 'guardar';
        switch (operacion) {
            case 'guardar':
                if (optionliq.attr('data-vence') === 'N' && !that.validarFacturasVencidas) {
                    mensaje += '';
                }
                if (!financiacionModel.idSolicitante) {
                    mensaje += __app.mensajes.seleccionarSolicitante + '.<br />';
                }
                if (!financiacionModel.idEntidad) {
                    mensaje += __app.mensajes.seleccionarBanco + '.<br />';
                }
                if (!financiacionModel.cuotas) {
                    mensaje += 'Para generar la financiación, debe escoger una cantidad de cuotas entre 1 y ' + financiacionModel.maximoplazo + '.<br />';
                }
                if (!financiacionModel.totalFinanciar || financiacionModel.totalFinanciar <= 0) {
                    mensaje += __app.mensajes.requiereValorFinanciarMayor + '.<br />';
                }
                if (financiacionModel.valorTope < financiacionModel.totalFinanciar) {
                    mensaje += 'Excede su cupo máximo de financiación. <br/>';
                }
                if ($('#cmbParentesco').val() === '-1' || !$('#cmbParentesco').val()) {
                    mensaje += 'Debe seleccionar el parentesco del solicitante';
                }
                if ($('#txtInteres').val().trim() === '') {
                    if (liq.val() !== '-1' && liq.val() !== '') {
                        var nombreLiq = liq.find('option:selected').text();
                        __dom.lanzarAlerta('La liquidación <b>' + nombreLiq + '</b> no tiene tasa de interés asociada, </br> Comuníquese con soporte');
                    } else {
                        __dom.lanzarAlerta(__app.mensajes.tipoLiquidacion, __app.mensajes.atencion);
                    }
                    return;
                }
                if (mensaje !== '') {
                    __dom.lanzarAlerta(mensaje, __app.mensajes.atencion);
                    return;
                }
                that.validarConceptosFinanciacion();
                break;
            case 'consultar':
                if (mensaje !== '') {
                    __dom.lanzarAlerta(mensaje, __app.mensajes.atencion);
                    return;
                }
                financiacionModel.plazomaximo = optionliq.attr('data-plazo');
                controlFinanciacion.consultarInteres({idliquidacion: liq.val()}, that.onConsultarInteresLiquidacion);
                that.validarConceptosFinanciacion();
                $('#txtInteres').change();
                break;
        }
    },
    /**
     * Captura la respuesta del servidor cuando se consulta la tasa de interés de una liquidación
     * @returns {void}
     */
    onConsultarInteresLiquidacion: function (data) {
        if (data.codigoRespuesta === -1) {
            $('#btnGrabar').attr('disabled', 'disabled');
            $('#txtInteres, #txtIntereses').val('');
            __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
            return;
        }
        $('#btnGrabar').removeAttr('disabled');
        financiacionModel.interes = data.interes;
        financiacionModel.interesiva = data.interesiva;
        var liq = $('#cmbTipoLiquidacion option:selected');
        $('#txtFechaActualImprimir').val($('#txtFecha').val());
        $('#txtInteres, #txtIntereses')
                .val(data.interes)
                .attr({'data-iva': data.interesiva, 'tipo-cuota': liq.attr('tipo-cuota')});
    },
    /** Valida los conceptos de la financiación de acuerdo al tipo de liquidación seleccionado
     * y las facturas seleccionadas.
     * @returns {void}
     */
    validarConceptosFinanciacion: function () {
        var idLiquidacion = $('#cmbTipoLiquidacion option:selected').val() !== '-1' && $('#cmbTipoLiquidacion').val() !== undefined ? parseInt($('#cmbTipoLiquidacion').val()) : 0;
        var facturasSeleccionadas = $('#tblFacturas tbody tr.selected');
        if (idLiquidacion <= 0 || facturasSeleccionadas.length === 0) {
            __dom.lanzarAlerta(__app.mensajes.tipoLiquidacion, __app.mensajes.atencion);
            return;
        }

        var parametrosValidacionConceptos = {idLiquidacion: idLiquidacion, facturas: []};
        $.each(facturasSeleccionadas, function (f, trFactura) {
            trFactura = $(trFactura);
            var idFactura = trFactura.find('td[header="thSeleccion"] input').val();
            parametrosValidacionConceptos.facturas.push(idFactura);
        });
        controlFinanciacion.validarConceptos(parametrosValidacionConceptos, that.validarConceptosCompleto);
    },
    /** Captura la respuesta del servidor cuando se consultan conceptos por liquidación y facturas,
     *  se despliega un dialogo para confirmar la acción a realizar con la financiación.
     * @param {object} data - Respuesta del servidor al consultar conceptos
     * @returns {void}
     */
    validarConceptosCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                that.guardarFinanciacion();
                break;
            case 1:
                var notificacion = $('#divConceptos');
                var ulConceptos = $('<ul>');
                if (!data.conceptos) {
                    if (operacion === 'guardar') {
                        that.guardarFinanciacion();
                    }
                    return;
                }

                $.each(data.conceptos, function (c, concepto) {
                    ulConceptos.append($('<li>').text(concepto.concepto));
                });
                var botones = {};
                var funcionCerrar = function () {
                    $(this).dialog('close');
                };
                notificacion.find('div.listaSeleccion').html('').append(ulConceptos);
                switch (operacion) {
                    case 'guardar':
                        botones.Cancelar = funcionCerrar;
                        botones.Continuar = function () {
                            that.guardarFinanciacion();
                            $(this).dialog('close');
                        };
                        break;
                    case 'consultar':
                        botones.Aceptar = funcionCerrar;
                        break;
                }
                that.dialogoActual = notificacion.dialogo({
                    modal: true,
                    width: 400,
                    title: 'Buscar un suscripción',
                    buttons: botones
                });
                break;
        }
    },
    /** Agrupa la información de la nueva financiación y hace petición AJAX para grabar información.
     * @returns {void}
     */
    guardarFinanciacion: function () {
        var financiacion = {
            // "idfinanciacion": financiacionModel.idfinanciacion,
            "idsuscripcion": financiacionModel.suscripcion.idsuscripcion,
            "idtipodocumento": $('#cmbTipoDocumento option:selected').val(),
            "iddocumento": $('#cmbDocumento option:selected').val() > 0 ? $('#cmbDocumento option:selected').val() : '',
            "idciclo": financiacionModel.cicloPeriodo.idCiclo,
            "idperiodo": financiacionModel.cicloPeriodo.idPeriodo,
            "idsolicitante": financiacionModel.idSolicitante,
            'idparentesco': $('#cmbParentesco').val(),
            "identidad": financiacionModel.idEntidad,
            "numerocuotas": financiacionModel.cuotas,
            "idliquidacion": $('#cmbTipoLiquidacion').val() ? $('#cmbTipoLiquidacion').val() : '',
            "valortotalfinanciar": financiacionModel.totalFinanciar,
            "valorfinanciable": $('#txtValorFinanciable').attr('title'),
            "archivos": financiacionModel.archivos

        };
        financiacion.informacion = {};
        impresionVista.accion = 'guardar';
        if (impresionVista.agregarInformacionContratoVinculacion(financiacion)) {
            financiacion.personanatural = financiacion.informacion.personanatural;
            financiacion.personajuridica = financiacion.informacion.personajuridica;
            financiacion.informacion = {};
        }

        var facturasSeleccionadas = $('#tblFacturas tbody tr.selected');
        financiacion.facturas = [];
        $.each(facturasSeleccionadas, function (f, trFactura) {
            trFactura = $(trFactura);
            var idFactura = trFactura.find('td[header="thSeleccion"] input').val();
            financiacion.facturas.push({
                idfactura: idFactura,
                valortotal: trFactura.find('td[header="thValorTotal"]').attr('data-value'),
                valorfinanciar: trFactura.find('td[header="thValorFinanciar"] input').val(),
                version: trFactura.find('td[header="thNumFactura"]').attr('data-value')
            });
        });
        controlFinanciacion.guardarFinanciacion(financiacion, that.guardarFinanciacionCompleta);
    },
    /** Captura la respuesta del servidor cuando se graba una financiación
     * @param {object} data - Respuesta del servidor al grabar financiación
     * @returns {void}
     */
    guardarFinanciacionCompleta: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(/*'Error al generar la financiación, intente de nuevo más tarde'*/data.mensaje, __app.mensajes.atencion);
                break;
            case 1:
                //that.limpiarFormulario();
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion, function () {
                    that.permitirImprimirFormatos(data.datos);
                }, false, function () {
                    that.permitirImprimirFormatos(data.datos)
                });
                break;
        }
    },
    /**
     * Habilita los campos para que se suban archivos de una financiación
     * @param {number} idfinanciacion - Identificador de la financiación guardada
     * @returns {void}
     */
    permitirImprimirFormatos: function (idfinanciacion) {
        if (that.appload.container) {
            that.appload.container.find('div.files-list').empty();
        }
        $('#btnSubirArchivos').show();
        $('#divAdjuntosFinanciacion').show();
        that.cajas.attr('disabled', 'disabled');
        $('#liFormatos').show().find('a').click();
        $('#btnGrabar').attr('disabled', 'disabled');
        financiacionModel.idfinanciacion = idfinanciacion;
        $('#btnGenerarNumeroPagare').removeAttr('disabled');
        $('#divArchivosContrato .archivoSubido:eq(0) button').focus();
        $('#btnAgregarInformacionFinanciera').attr('disabled', 'disabled');
    },
    /**
     * Hace petición ajax para consultar un número de pagaré
     * @returns {void}
     */
    generarNumeroPagare: function () {
        $('#btnGenerarNumeroPagare').attr('disabled', 'disabled');
        if (!financiacionModel.numeropagare) {
            var data = {idfinanciacion: financiacionModel.idfinanciacion};
            controlFinanciacion.consultarNumeroPagare(data, function (data) {
                financiacionModel.numeropagare = data.numeropagare;
            });
        }
    },
    /** Valida información para mostrar un cuadro de dialogo con el simulador de amortización para la financiación
     * seleccionada. Permite la impresión del mismo.
     * @returns {void}
     */
    validarSimulador: function () {
        if (!financiacionModel.facturas) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarFacturas, __app.mensajes.atencion);
            return;
        }
        if (!financiacionModel.cuotas) {
            __dom.lanzarAlerta('Para generar la financiación, debe escoger una cantidad de cuotas entre 1 y ' + financiacionModel.maximoplazo, __app.mensajes.atencion);
            return;
        }
        if (!financiacionModel.interes) {
            var liq = $('#cmbTipoLiquidacion');
            if (liq.val() !== '-1' && liq.val() !== '') {
                var nombreLiq = liq.find('option:selected').text();
                __dom.lanzarAlerta('La liquidación <b>' + nombreLiq + '</b> no tiene tasa de interés asociada, </br> Comuníquese con soporte');
            } else {
                __dom.lanzarAlerta(__app.mensajes.tipoLiquidacion, __app.mensajes.atencion);
            }
            return;
        }
        if (!financiacionModel.totalFinanciar || financiacionModel.totalFinanciar <= 0) {
            __dom.lanzarAlerta(__app.mensajes.requiereValorFinanciarMayor, __app.mensajes.atencion);
            return;
        }

        var cuotas = $('#txtVlrCuotaMensualImprimir, #txtVlrPrimerCuotaImprimir');
        $('#txtCapitalInicial').val($('#txtValorFinanciar').attr('title'));
        $('#txtNumeroCuotas').val($('#txtNumCuotas').val());

        _that.calcularAmortizacion(financiacionModel);
        cuotas.val(financiacionModel.valorCuota).toTxtCurrency();
        that.mostrarDialogoSimulador();
    },
    /**
     * Muestra un cuadro de diálogo con tabla de amortizador
     * @returns {void}
     */
    mostrarDialogoSimulador: function () {
        var filtro = $('div#divSimulador');
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
    },
    /**
     * Permite imprimir la tabla de la amortización de una financiación
     * @returns {void}
     */
    imprimirSimulador: function () {
        var logo = sessionStorage.getItem('logoEmpresa');
        var frame = document.getElementById('iframePrint');
        var c = frame.contentDocument.getElementById('contenido');
        frame.contentDocument.getElementById('title').innerText = 'Financiación';
        var cp = document.getElementById('divSimulador').cloneNode(true);
        while (c.firstChild) {
            c.removeChild(c.firstChild);
        }
        c.appendChild(cp);
        $(c).find('#imgLogo').attr('src', '/achagua/img/logos_empresas/' + logo);
        $(c).find('#divSimulador').removeAttr('style');
        $(c).find('.inputImpresion').parent().removeAttr('style');
        var w = frame.contentWindow;
        w.focus();
        w.print();
    },
    /** Muestra los archivos cargados en el servidor en una lista.
     * @param {object} data- información de los archivos que se han cargado.
     * @returns {void}
     */
    mostrarArchivos: function (data) {

        $('#adjuntosVenta').show();
        $('#divAdjunto span').remove();
        if (data) {
            financiacionModel.archivos = [];
            if (!that.appload.container) {
                that.appload.control.change();
            }
            for (var i = 0; i < data.length; i++) {
                var info = data[i];
                var divItem = that.appload.addFileToList({url: info.ruta, name: info.nombrearchivo});
                financiacionModel.archivos.push({idarchivo: info.idarchivo});
                divItem.find('.file-item-btns button').removeAttr('disabled');
                divItem.find('.file-item-btns .appload-btn-discard').attr('disabled', 'disabled');
                var eliminar = that.appload.container.find('.file-item-btns .appload-btn-delete');
                divItem.addClass('uploaded-item');
                eliminar.attr('data-id', info.idarchivo);
                eliminar.on('click', that.eliminarArchivo);
                $('<span class="fa fa-check-circle-o">').insertBefore(divItem.find('i.fa:first'));
            }
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
        if ((nombre === 'PagarePersonaNaturalFinal' || nombre === 'PagarePersonaJuridicaFinal') && !financiacionModel.numeropagare) {
            __dom.lanzarAlerta('Debe generar el número de pagaré para descargar el formato', 'Atención', function () {
                $('#btnGenerarNumeroPagare').focus();
            });
            return;
        }
        if (!financiacionModel.suscripcion || !financiacionModel.idfinanciacion) {
            mensaje += __app.mensajes.seleccionarSuscripcion + '.<br />';
        }
        if (!financiacionModel.totalFinanciar || financiacionModel.totalFinanciar <= 0) {
            mensaje += __app.mensajes.requiereValorFinanciarMayor + '.<br />';
        }
        if (!financiacionModel.cuotas) {
            mensaje += 'Para generar la financiación, debe escoger una cantidad de cuotas entre 1 y ' + financiacionModel.maximoplazo + '.<br />';
        }
        if (!financiacionModel.idSolicitante) {
            mensaje += __app.mensajes.seleccionarSolicitante + '.<br />';
        }
        if (!financiacionModel.interes) {
            mensaje += __app.mensajes.tipoLiquidacion + '.<br />';
        } else {
            var result = _that.calcularAmortizacion(financiacionModel);
            if (result === false) {
                mensaje += __app.mensajes.tipoLiquidacion + '.<br />';
            }
        }
        if ($('#cmbParentesco').val() === '-1') {
            mensaje += 'Debe seleccionar el parentesco. <br/>';
        }

        if (mensaje !== '') {
            __dom.lanzarAlerta(mensaje, __app.mensajes.atencion);
            return;
        }
        impresionVista.validarInfoImprimirContrato(_this, financiacionModel, 'financiacion');
    },
    /** Cancela la operación actual (Crear o consultar financiación)
     * @returns {void}
     */
    cancelarFinanciacion: function () {
        if (!!financiacionModel.suscripcion) {
            __dom.lanzarAlerta(
                    __app.mensajes.confirmacionCancelacion,
                    __app.mensajes.atencion,
                    that.limpiarFormulario,
                    function () {
                        return true;
                    }
            );
        }
    },
    /** Limpia toda la información del formulario y elimina información del modelo
     * @returns {void}
     */
    limpiarFormulario: function () {
        financiacionModel = {
            archivos: [],
            maximoplazo: 1
        };
        $("#cuerpo tr").remove();
        $('input[type="text"]').val('');
        that.cajas.removeAttr('disabled');
        var divNatural = $('#divNatural').hide();
        $('#divFinanciacion, #divAdjuntosFinanciacion').hide();
        divNatural.find('input:text, select').val('').removeAttr('title');
        $('#btnAgregarInformacionFinanciera, #btnGrabar').removeAttr('disabled');
        $('#cmbDocumento').append($('<option>').text('Seleccione una opción').val('-1'));
        $('#tblFacturas, select').not('#cmbParentesco, #divNatural select').html('');
        if (that.appload.container) {
            that.appload.container.find('.files-list').empty();
        }
        $('#txtArchivo').val('');
        //$("#txtArchivo").fileinput('clear');
    },
    /** Valida que el valor financiable de cada factura exista y sea mayor de cero
     * @returns {void}
     */
    validarFinanciable: function (valor, td) {
        if (!!valor) {
            td.addClass('td-currency');
            td.attr('data-valor', valor);
            return valor.toString().toCurrency();
        } else {
            td.addClass('td-currency');
            td.attr('data-valor', 0);
            return '0'.toCurrency();
        }
    },

    /**
     * Limpia los datos de la facturación.
     * @returns {void}
     */
    inicializarFacturas: function () {
       financiacionModel.facturas = [];
       $('#tblFacturas').empty();
       $('#divFinanciacion').hide();
       $('#divNatural').hide();
    },
    
    buscaFacturaDescarteConceptos : function(){
      financiacionModel.descartaConceptos   = [];
      financiacionModel.descartaConceptosSeleccionados = [];
      if (!!financiacionModel.suscripcion) {
            if ($('#cmbTipoDocumento option').length > 0 && $('#cmbTipoDocumento').val() > 0) {
                var data = {
                    idsuscripcion: financiacionModel.suscripcion.idsuscripcion,
                    iddocumento: $('#cmbDocumento option:selected').val() > 0 ? $('#cmbDocumento option:selected').val() : '',
                    idtipodocumento: $('#cmbTipoDocumento option:selected').val()
                };
                controlFinanciacion.consultarFacturaDescarteConcepto(data, that.cargarFacturaDescarteCompleto);
            } else {
                __dom.lanzarAlerta(__app.mensajes.sinDocumentosTiposDoc, __app.mensajes.atencion);
            }
        }
    },
    
    cargarFacturaDescarteCompleto : function(data){
        console.log(data);
        financiacionModel.descartaConceptos   = data.conceptos;
        var tblDescartaConceptos = fillTable("tblDescarteConceptos", "formatoDescarteConceptos", "financiacionModel.descartaConceptos", "Conceptos Financiables").show();
        tblDescartaConceptos.parent().css('width', '100%');
        tblDescartaConceptos.find('tbody tr td[header="thSeleccion"] input').on('click', that.conceptoSeleccionado);
        that.mostrarDialogoFacturaDescartaConceptos();
    },
    
    conceptoSeleccionado : function(){
        var filaSeleccionada = $(this);
        var fila = filaSeleccionada.parent().parent();
        fila.find('td[header="thSeleccion"]').attr('checked');
        if (filaSeleccionada.prop('checked')) {
            fila.find('td[header="thSeleccion"] input').prop('checked', true);
            
        }else{
            fila.find('td[header="thSeleccion"] input').prop('checked', false);
        }
       
        
    },
    
    /**
     * Abre cuadro de diálogo con tablas de Descarte conceptos
     * @returns {void}
     */
    mostrarDialogoFacturaDescartaConceptos: function () {
        that.dialogoActual = $('#divDescarteConcepto').dialogo({
            modal: true,
            width: 500,
            title: 'Descartar las facturas que contengan los siguientes conceptos:',
            buttons: {
                Aceptar: function () {
//                    var idconcepto = fila.find('td[header="thSeleccion"] input');
//        console.log(idconcepto.val());
//            financiacionModel.descartaConceptosSeleccionados.push(idconcepto.val());
                    that.cargaFacturaDescartaConceptos();
                    that.dialogoActual.dialog('close');
                },
                Cancelar: function () {
                    that.dialogoActual.dialog('close');
                }
            }
        });
    },
    
     cargaFacturaDescartaConceptos: function(){
          if ($('#cmbTipoDocumento option').length > 0 && $('#cmbTipoDocumento').val() > 0) {
          var filaSeleccionada = $(this);
          var tablaDescartaConcepto = $('#tblDescarteConceptos tbody tr input:checked');
          for(i=0;i< tablaDescartaConcepto.length;i++){
            financiacionModel.descartaConceptosSeleccionados.push($(tablaDescartaConcepto[i]).val());
          }
          
                var data = {
                    idsuscripcion: financiacionModel.suscripcion.idsuscripcion,
                    iddocumento: $('#cmbDocumento option:selected').val() > 0 ? $('#cmbDocumento option:selected').val() : '',
                    idtipodocumento: $('#cmbTipoDocumento option:selected').val(),
                    descartaConceptos: financiacionModel.descartaConceptosSeleccionados
                };
                controlFinanciacion.consultarFacturas(data, that.cargarFacturasCompleto);
            } else {
                __dom.lanzarAlerta(__app.mensajes.sinDocumentosTiposDoc, __app.mensajes.atencion);
            }
     }

};
