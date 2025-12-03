/**
 * @fileOverview Archivo de vista y control de consignaciones
 * @author AngélicaG.
 * @requires consignaciones.control.js
 * @requires consignaciones.modelo.js
 * @version 1.0.0
 */
/**
 * Objeto que hace referencia al namespace consignacionesVista
 * @type {Object}
 */
var that;
/** @namespace */
var consignacionesVista = {
    /** Hace referencia al último dialogo abierto en la aplicación
     * @type {object}
     */
    dialogoActual: null,
    /**Inicializa el programa de consignación, y asigna listeners a los controles
     * @returns {void}
     */
    init: function () {
        that = this;
        cargarBancos();
        consignacionesControl.consultarEmpresaActual(that.onConsultarEmpresaCompleto);
        $('#cmbMedioPago,#cmbSucursal').on('change', that.consultarRecaudo);
        $('#btnVerRecaudos').on('click', that.consultarRecaudoEmpresa);
        $('#btnEditar').on('click', that.mostrarFiltros);
        $('#btnCancelar').on('click', that.cancelarConsignacion);
        $('#btnGrabar').on('click', that.grabarConsignacion);
        $('#btnVerRecaudoEmpresa').on('click', that.consultarDetallesRecaudo);
        $('#btnAgregarForma').on('click', that.agregarInformacionCheque);
        $('#btnAgregarBancoEfectivo,#btnAgregarBancoCheque').on('click', that.agregarBancos);
        __dom.configurarCalendario('txtFechaIFiltro, #txtFechaFFiltro');
        __dom.configurarTextoNumerico('txtValorFormaPagoEfectivo, #txtValorFormaPagoCheque', false, true, true);
        $('#txtValorFormaPagoCheque, #txtValorFormaPagoEfectivo').on('blur', that.sumarConsignado);

        $('#btnCancelarFormasPago').on('click', that.cancelarFormaPago);
        $('#btnAdjuntarArchivo').on('click', that.mostrarAdjuntar);
        //Se realiza el evento del botón
        $('#btnBuscarFiltro').on('click', that.filtrarConsignacion);
        $("#txtArchivo").fileinput({
            uploadUrl: "subirarchivo/",
            allowedFileExtensions: ['pdf'],
            uploadAsync: true,
            overwriteInitial: false,
            showUpload: true,
            showRemove: true,
            maxFileSize: 4096
        }).on('fileuploaded', that.subirCompleto);

    },
    onConsultarEmpresaCompleto: function (data) {
        if (data.codigoRespuesta === 1) {
            consignacionesModel.informacionEmpresaActual = data.empresa;
        }
    },
    /** Muestra u oculta división para adjuntar archivos
     * @returns {void}
     */
    mostrarAdjuntar: function () {
        if ($('#archivoAdjunto').is(':visible')) {
            $('#archivoAdjunto').hide();
        } else {
            $('#archivoAdjunto').show();
        }
    },
    /**
     * Valida información y hace petición ajax para consultar las fechas de recaudo con su respectivo valor
     * @returns {void}
     */
    consultarRecaudo: function () {
        that.limpiar();
        var gasto = $('#txtGasto');
        var faltante = $('#txtFaltante');
        var sobrante = $('#txtSobrante');
        var txtTotal = $('#txtTotalConsignado');
        $('#tblFechaRecaudo').empty();
        $('#divRecaudoEmpresa').hide();
        consignacionesModel.fechasRecaudo = '';

        gasto.val(gasto.attr('data-valor') ? gasto.attr('data-valor') : 0).toTxtCurrency();
        faltante.val(faltante.attr('data-valor') ? faltante.attr('data-valor') : 0).toTxtCurrency();
        sobrante.val(sobrante.attr('data-valor') ? sobrante.attr('data-valor') : 0).toTxtCurrency();
        txtTotal.val(txtTotal.attr('data-valor') ? txtTotal.attr('data-valor') : 0).toTxtCurrency();

        var sucursal = $('#cmbSucursal').val();
        var medioPago = $('#cmbMedioPago').val();
        if (sucursal > 0 && medioPago > 0) {
            var infoEnviar = {idsucursal: sucursal, idmediopago: medioPago};
            consignacionesControl.consultaRecaudos(infoEnviar, that.onConsultarRecaudoCompleto);
        }
    },
    /** Captura la respuesta del servidor, cuando se consultan las fechas de recaudo
     * @param {object} data - Respuesta del servidor con recaudos
     * @returns {void}
     */
    onConsultarRecaudoCompleto: function (data) {
        var span = $('#pMensaje').html('').hide();
        var divGeneral = $('#divCabecera').show();
        switch (parseInt(data.codigoRespuesta)) {
            case 0:
                if (consignacionesModel.accionGeneral === 'A') {
                    fillTable("tblFechaRecaudo", "formatoFechaRecaudo", [], "Fechas de recaudo");
                    $('#divFechasRecaudo').show();
                    that.fechasRecaudo();
                    return;
                }
                divGeneral.hide();
                span.text(__app.mensajes.sinResultados).show();
                break;
            case 1:
                consignacionesModel.fechasRecaudo = data.recaudos;
                var tbl = fillTable("tblFechaRecaudo", "formatoFechaRecaudo", "consignacionesModel.fechasRecaudo", "Fechas de recaudo");
                tbl.find('td[header="thSeleccionar"] input[type="checkbox"]').on('click', that.ocultarPorFechas);
                if (consignacionesModel.accionGeneral === 'A') {
                    that.fechasRecaudo();
                }
                $('#divFechasRecaudo, #tblFechaRecaudo').show();
                break;
        }
    },
    ocultarPorFechas: function () {
        $('#divConsignacion, #divRecaudoEmpresa').hide();
        if (consignacionesModel.accionGeneral === 'I') {
            $('#tblEfectivo, #tblCheque').empty().hide();
            $('#tblBancosEfectivo, #tblBancosCheque').hide();
            $('#divConsignacion tbody').empty();
        }
    },
    /** Agrega fechas de recaudo asociadas a una consignación en la tabla de recaudos.
     * @returns {void}
     */
    fechasRecaudo: function () {
        consignacionesModel.fechasConsignacion;
        var tabla = $('#tblFechaRecaudo');
        for (i = 0; i < consignacionesModel.fechasConsignacion.length; i++) {
            var fecha = consignacionesModel.fechasConsignacion[i];
            var input = $('<input>').attr('type', 'checkbox').val(fecha.fecha).attr('id', 'chk_' + fecha.fecha).prop('checked', true);

            var td = $('<td>').append(input, $('<label>').text('Seleccionar').attr('for', 'chk_' + fecha.fecha));
            var tr = $('<tr>').addClass('selected').append(td, $('<td>').text(fecha.fecha),
                $('<td>').addClass('td-currency').text(fecha.valor.toCurrency()));
            tabla.append(tr);
            input.on('change', function () {
                var _this = $(this);
                if (_this.prop('checked')) {
                    _this.parent().parent().addClass('selected');
                } else {
                    _this.parent().parent().removeClass('selected');
                }
            });
        }
    },
    /** Se validan fechas de recaudo y hacen petición ajax para consultar por empresay detalles del recaudo
     * @returns {void}
     */
    consultarRecaudoEmpresa: function () {
        var fechas = "";
        var seleccionado = $('#tblFechaRecaudo td input:checked');
        var tipomediopago = $('#cmbMedioPago option:selected').attr('data-tipo');

        if (tipomediopago === 'I' && seleccionado.length !== 1) {
            __dom.lanzarAlerta('Es un medio de pago interno, se debe seleccionar una fecha', __app.mensajes.atencion);
            return;
        }

        if (seleccionado.length > 0) {
            $.each(seleccionado, function (i, item) {
                fechas += "'" + item.value + "',";
            });
            fechas = fechas.substring(0, fechas.length - 1);
            var datos = {
                idsucursal: $('#cmbSucursal').val(),
                idmediopago: $('#cmbMedioPago').val(),
                fecha: fechas
            };

            consignacionesControl.consultarDetallesRecaudo(datos, function (data) {
                consignacionesModel.detallesRecaudo = data.recaudos;
            });
            datos.idconsignacion = !!consignacionesModel.idconsignacion ? consignacionesModel.idconsignacion : '';
            consignacionesControl.consultarEmpresasRecaudo(datos, that.onConsultarRecaudosEmpresa);
            //consignacionesControl.consultarCheques(datos, that.agregarCheque);
        }
    },
    /** Captura la respuesta del servidor, cuando se consultan los cheques
     * @param {object} data - Respuesta del servidor con recaudos
     * @returns {void}
     */
    agregarCheque: function (data) {
        consignacionesModel.cheques = data.cheques[0];
        switch (parseInt(data.codigoRespuesta)) {
            case 0:
                $('#pMensaje').text(__app.mensajes.sinResultados).show();
                break;
            case 1:
                fillTable("tblCheques", "formatoCheque", "consignacionesModel.cheques", "Cheques");
                break;
        }
    },
    /** Captura la respuesta del servidor, cuando se consultan los recaudos de las empresas
     * @param {object} data - Respuesta del servidor con recaudos por empresas
     * @returns {void}
     */
    onConsultarRecaudosEmpresa: function (data) {
        switch (parseInt(data.codigoRespuesta)) {
            case 0:
                $('#pMensaje').text(__app.mensajes.sinResultados).show();
                break;
            case 1:
                consignacionesModel.recaudosEmpresa = data.recaudos;
                if (data.mensajeError) {
                    $('#pMensajeRecaudo').text(data.mensajeError);
                    return;
                }
                var total = 0;
                var combosTablas = $('#divConsignacion table select[id^="cmbEmpresa"]');
                consignacionesControl.consultarEmpresasPermitidasConsignacion();
                fillTable("tblRecaudoEmpresa", "formatoRecaudoEmpresa", "consignacionesModel.recaudosEmpresa", "Recaudos por empresa");
                $('#divRecaudoEmpresa, #divConsignacion').show();
                for (var i = 0; i < consignacionesModel.recaudosEmpresa.length; i++) {
                    var recaudoEmp = consignacionesModel.recaudosEmpresa[i];
                    total = parseFloat(total + parseFloat(recaudoEmp.valor));
                }

                for (var indiceSelect = 0; indiceSelect < combosTablas.length; indiceSelect++) {
                    var campo = combosTablas[indiceSelect];
                    var valor = campo.value;
                    __dom.llenarCombo(campo, consignacionesModel.empresasDisponibles, 'idempresa', 'empresa').val(valor);
                    if (consignacionesControl.validarExistenciaEmpresa(campo.value)) {
                        campo.val(-1).change();
                    }
                }


                $('#txtTotalRecaudoEmpresa, #txtTotalRecaudado')
                    .val(total)
                    .attr('data-valor', total)
                    .toTxtCurrency();

                break;
        }
    },
    /** Muestra cuadro de dialogo con detalles de los recaudos seleccionados.
     * @returns {void}
     */
    consultarDetallesRecaudo: function () {
        $('#divRecaudos').html('');
        var template = null;
        $.get('/achagua/sistema/web/bundles/Llanogas/templates/recaudoFormaPago.html', function (_template) {
            template = $(_template).filter('#tplRecaudoFactura').html();
            var info = $(Mustache.to_html(template, {recaudos: consignacionesModel.detallesRecaudo}));
            $('#divRecaudos').append(info);
        });
        $('#divRecaudos').dialogo({
            modal: true,
            width: 850,
            height: 400,
            title: 'Detalles de Recaudos',
            buttons: {
                Aceptar: function () {
                    $(this).dialog('close');
                }
            }
        });
    },
    /**
     * Muestra dialogo para buscar consignaciones por rango de fechas, número y/o medio de pago
     * @returns {void}
     */
    mostrarFiltros: function () {
        var filtro = $('div#camposBuscarSuscripcion');
        that.dialogoActual = filtro.dialogo({
            modal: true,
            width: 850,
            title: 'Buscar consignación',
            buttons: {
                Cancelar: function () {
                    that.limpiarFiltro();
                    that.dialogoActual.dialog('close');
                }
            }
        });
    },
    /** Valida la información del filtro de consignaciones y hace petición ajax para la búsqueda
     * @returns {void}
     */
    filtrarConsignacion: function () {
        var filtro = $('div#camposBuscarSuscripcion');
        $('#spanMensaje').text('');
        var fechaInicio = filtro.find('#txtFechaIFiltro').val().trim();
        var fechaFin = filtro.find('#txtFechaFFiltro').val().trim();
        var consignacion = filtro.find('#txtNroConsignacion').val().trim();
        var medioPago = filtro.find('#cmbMedioPagoFiltro').val();
        var datos = {
            fechainicio: fechaInicio,
            fechafin: fechaFin,
            idconsignacion: consignacion,
            idmediopago: ''
        };
        if (consignacion === '' && medioPago === '-1' && fechaInicio === '') {
            $('#spanMensaje').text(__app.mensajes.seleccionarOpcion).show();
            return;
        } else if (medioPago !== '-1') {
            if (fechaInicio === '' || fechaFin === '') {
                $('#spanMensaje').text(__app.mensajes.seleccionarFechaCorte).show();
                return;
            } else {
                datos.idmediopago = medioPago;
            }
        }
        consignacionesControl.buscarConsignacion(datos, that.onConsultarConsignacionCompleto);
    },
    /** Captura la respuesta enviada por el servidor, cuando se consultan las consignaciones.
     * En caso de llegar varias consignaciones posibilita la selección de una.
     * @param  {object} data - El respuesta del servidor con las consignaciones que coinciden
     * @returns {void}
     */
    onConsultarConsignacionCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(__app.mensajes.sinResultados, __app.mensajes.atencion);
                break;
            case 1:
                consignacionesModel.consignacion = data.consignaciones;
                $('#divListaSelección').empty();
                if (data.consignaciones.length > 1) {
                    var divConsignaciones = $('<div>').addClass('listaSeleccion');
                    $.each(data.consignaciones, function (index, consignacion) {
                        var div = $('<div>');
                        var radio = $('<input type="radio">');
                        var label = $('<label>');
                        radio.val(consignacion.idconsignacion);
                        radio.attr('id', 'radio_susc_' + index);
                        radio.attr('data-indice', index);
                        radio.attr('name', 'radio_consignacion');

                        label.attr('for', 'radio_susc_' + index);
                        label.text(consignacion.idusuario + ' - ' + consignacion.idconsignacion + ' - '
                            + consignacion.fecha + ' - ' + consignacion.sucursal + ' - ' + consignacion.mediopago + ' - ' + consignacion.documento);
                        div.append(radio).append(label);
                        divConsignaciones.append(div);
                    });
                    var btn = $('<button>').text('Finalizar').addClass('btnSimple');
                    btn.on('click', function () {
                        var consignacionSeleccionada = $('input[name="radio_consignacion"]:checked');
                        if (consignacionSeleccionada.length > 0) {
                            var consignacion = consignacionesModel.consignacion = data.consignaciones[consignacionSeleccionada.attr('data-indice')];
                            $('#spanMensaje').hide();
                            that.limpiarFiltro();
                            that.dialogoActual.dialog('close');
                            divConsignaciones.remove();
                            that.consultarDetalleConsignacion(consignacion);
                        } else {
                            $('#spanMensaje').text(__app.mensajes.seleccionarOpcion).show();
                        }
                    });
                    divConsignaciones.append(btn);
                    $('#divListaSelección').append(divConsignaciones);
                } else {
                    var consignacion = consignacionesModel.consignacion = data.consignaciones[0];
                    $('#spanMensaje').hide();
                    that.limpiarFiltro();
                    that.dialogoActual.dialog('close');
                    that.consultarDetalleConsignacion(consignacion);
                }
        }
    },
    /** Confirma si el usuario desea cancelar la operación actual
     * @returns {void}
     */
    cancelarConsignacion: function () {
        if (!!consignacionesModel.recaudosEmpresa || $('#tblFechaRecaudo tbody').length > 0) {
            $('div#divConfirmCancelar').dialogo({
                resizable: false,
                heigth: 140,
                modal: true,
                title: 'Cancelar la operación',
                buttons: {
                    "Sí": function () {
                        $(this).dialog('close');
                        $('#cmbMedioPago').val("-1");
                        $('#cmbSucursal').val("-1");
                        that.limpiar();
                    }, Cancelar: function () {
                        $(this).dialog("close");
                    }
                }
            });
        }
    },
    /** Carga la cabecera del formulario con los datos de la consignación seleccionada. Y hace petición
     * ajax para consultar los detalles
     * @param  {object} data - El respuesta del servidor con información de la consignación seleccionada
     * @returns {void}
     */
    consultarDetalleConsignacion: function (data) {
        console.log("datos detalle consignaciòn  ");
        console.log(data);
        consignacionesModel.idconsignacion = data.idconsignacion;
        $('#txtIdConsignacion').attr('data-id', data.idconsignacion);
        $('#cmbMedioPago').val(data.idmediopago);
        $('#cmbSucursal').val(data.idsucursal);
        $('#cmbDocumento').val(data.iddocumento);
        $('#txtFecha').val(data.fecha);
        $('#txtFaltante').attr('data-valor', data.valorfaltante)
            .val(data.valorfaltante)
            .toTxtCurrency();
        $('#txtSobrante').attr('data-valor', data.valorsobrante)
            .val(data.valorsobrante)
            .toTxtCurrency();

        $('#txtGasto').attr('data-valor', data.valorgasto)
            .val(data.valorgasto)
            .toTxtCurrency();

        $('#txtCuentaPorPagar').attr('data-valor', data.valorcuentaporpagar)
            .val(data.valorcuentaporpagar)
            .toTxtCurrency();
        $('#txtTotalConsignado').val(data.totalconsignado)
            .attr('data-valor', data.totalconsignado)
            .toTxtCurrency();
        consignacionesControl.consultarDetalleConsignacion(
            {idconsignacion: data.idconsignacion},
            that.onConsultarDetalleConsignacionCompleto
        );
    },
    /** Captura respuesta del servidor cuando se consultan los detalles de una consignación.
     * Guarda la información en el modelo para ser guardada y tratada debidamente
     * @param  {object} data - El respuesta del servidor con detalles de la consignación seleccionada
     * @returns {void}
     */
    onConsultarDetalleConsignacionCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(__app.mensajes.sinResultados, __app.mensajes.atencion);
                break;
            case 1:

                $('#divArchivos').html('');
                $('#cmbMedioPago').change();
                var datos = data.consignacion;
                consignacionesModel.accionGeneral = 'A';

                consignacionesModel.detallesConsignacion = datos.detallesconsignacion;
                consignacionesModel.recaudosEmpresa = datos.consolidadoempresas;
                consignacionesModel.recaudosConsignacion = datos.recaudosdetalles;
                consignacionesModel.detallesRecaudo = datos.recaudosdetalles;
                consignacionesModel.fechasConsignacion = datos.recaudosfechas;
                consignacionesModel.archivos = datos.archivos;

                consignacionesModel.consignaciones = [];
                consignacionesModel.cheque = [];
                consignacionesModel.efectivo = [];
                that.mostrarArchivos(datos.archivos, true);
                $('#tblBancosEfectivo, #tblBancosCheque').hide();
                $('#divConsignacion, #tblEfectivo, #tblCheque').show();

                for (var i = 0; i < datos.detallesconsignacion.length; i++) {
                    var detalle = datos.detallesconsignacion[i];
                    if (detalle.idformapago == 78) {
                        consignacionesModel.cheque.push(detalle);
                        var informacion = [];
                        for (var j = 0; j < detalle.informacionadicional.length; j++) {
                            var inf = detalle.informacionadicional[j];
                            informacion.push({});
                            for (var k = 0; k < inf.length; k++) {
                                var id = inf[k].idtipificacion;
                                switch (id) {
                                    case 9:
                                        informacion[j].idbanco = inf[k].informacion;
                                        break;
                                    case 10:
                                        informacion[j].numCuenta = inf[k].informacion;
                                        break;
                                    case 11:
                                        informacion[j].numCheque = inf[k].informacion;
                                        break;
                                    case 12:
                                        informacion[j].documento = inf[k].informacion;
                                        break;
                                    case 13:
                                        informacion[j].nombre = inf[k].informacion;
                                        break;
                                    case 31:
                                        informacion[j].valor = inf[k].informacion;
                                        break;
                                }
                            }
                        }
                        consignacionesModel.cantBancoCheque++;
                        consignacionesModel.consignaciones.push({
                            consignacion: detalle.iddetalleconsignacion,
                            informacionadicional: informacion
                        });
                    } else {
                        consignacionesModel.efectivo.push(detalle);
                        consignacionesModel.cantBancoEfectivo++;
                    }
                }

                if (consignacionesModel.efectivo.length > 0) {
                    var tabla = fillTable('tblEfectivo', 'formatoPagoEfectivo', 'consignacionesModel.efectivo', 'Consignación (es) en efectivo');
                    tabla.find('td[header="thEliminarCheque"] input[type="button"]').on('click', that.eliminarFila);
                    var valor = that.sumarConsignaciones('Efectivo');
                    $('#txtValorFormaPagoEfectivo').val(valor);
                }
                if (consignacionesModel.cheque.length > 0) {
                    var tabla = fillTable('tblCheque', 'formatoPagoCheque', 'consignacionesModel.cheque', 'Consignación (es) en cheque');
                    tabla.find('td[header="thInformacionCheque"] input[type="button"]').on('click', that.mostrarFormasPago);
                    tabla.find('td[header="thEliminarCheque"] input[type="button"]').on('click', that.eliminarFila);
                    var valor = that.sumarConsignaciones('Cheque');
                    $('#txtValorFormaPagoCheque').val(valor);
                }
                that.onConsultarRecaudosEmpresa({codigoRespuesta: 1, recaudos: datos.consolidadoempresas});
                break;
        }
    },
    /** Valida el valor de las consignaciones y determina faltante, sobrante y gasto
     * @returns {void}
     */
    sumarConsignado: function () {
        var _this = $(this);

        $('#txtSobrante, #txtGasto, #txtFaltante , #txtCuentaPorPagar').val('0').attr('data-valor', '0');
        var txtValorCheque = $('#txtValorFormaPagoCheque').val();
        var txtValorEfectivo = $('#txtValorFormaPagoEfectivo').val();
        var totalCheque = isNaN(parseFloat(txtValorCheque)) ? 0 : parseFloat(txtValorCheque);
        var totalEfectivo = isNaN(parseFloat(txtValorEfectivo)) ? 0 : parseFloat(txtValorEfectivo);
        var total = parseFloat(totalCheque + totalEfectivo);

        $('#txtTotalConsignado').val(total)
            .attr('data-valor', total)
            .toTxtCurrency();
        var faltante = parseFloat($('#txtTotalRecaudado').attr('data-valor')) - total;
        if (faltante < 0) {
            var faltante = Math.abs(faltante);
            if (faltante <= 10000) {
                $('#txtSobrante').val(faltante)
                    .attr('data-valor', faltante)
                    .toTxtCurrency();
            } else {
                $('#txtCuentaPorPagar').val(faltante)
                    .attr('data-valor', faltante)
                    .toTxtCurrency();

            }

        } else if (faltante < 2000) {
            $('#txtGasto').val(faltante)
                .attr('data-valor', faltante)
                .toTxtCurrency();
        } else {
            $('#txtFaltante').val(faltante)
                .attr('data-valor', faltante)
                .toTxtCurrency();
        }
        var id = _this.attr('id');
        that.sumarConsignaciones((id === 'txtValorFormaPagoEfectivo' ? 'Efectivo' : 'Cheque'));
    },
    /** Agrega fila para agregar información de bancos de una consignación
     * @returns {void}
     */
    agregarBancos: function (e) {
        var btn = $(this);
        var empresas = consignacionesModel.empresasDisponibles;
        var _div = btn.parent().parent().parent();
        var divMayor = _div.attr('data-forma');
        var idDiv = _div.attr('id');

        var tipomediopago = $('#cmbMedioPago option:selected').attr('data-tipo');
        if (tipomediopago === 'E') {
            var filas = $('#tblEfectivo tbody tr, #tblCheque tbody tr, #tblBancosEfectivo tbody tr, #tblBancosCheque tbody tr').length;
            if (filas > 0) {
                __dom.lanzarAlerta('El medio de pago es <b>externo</b>, solo debe agregar una forma de pago', __app.mensajes.atencion);
                return;
            }
        }

        var tabla;
        var divGeneral = $('#' + idDiv);
        if (consignacionesModel.accionGeneral === 'A') {
            tabla = divGeneral.find('#tbl' + divMayor).show();
            if (!(tabla.find('thead').length > 0)) {
                var r = divGeneral.find('#tblBancos' + divMayor + ' thead').clone();
                tabla.append(r);
            }
            divGeneral.find('#tblBancos' + divMayor).hide();
        } else {
            tabla = divGeneral.find('#tblBancos' + divMayor).show();
            divGeneral.find('#tbl' + divMayor).hide();
        }

        var numero = divMayor === "Efectivo" ? consignacionesModel.cantBancoEfectivo++ : consignacionesModel.cantBancoCheque++;
        var complemento = '_' + divMayor + '_' + numero;

        var empresa = $('<select>').attr('id', 'cmbEmpresa' + complemento);
        __dom.llenarCombo(empresa, empresas, 'idempresa', 'empresa');

        //Agrega campos de la nueva fila cada uno con un elemento según se necesite
        var _empresa = that.agregarCampo('thEmpresa', 'cmbEmpresa', divMayor, numero);
        _empresa.find('select').html('').append(empresa.html());

        var banco = that.agregarCampo('thBanco', 'cmbBanco', divMayor, numero);
        var cuenta = that.agregarCampo('thCuenta', 'cmbCuenta', divMayor, numero);
        var tipoCuenta = that.agregarCampo('thTipoCuenta', 'cmbTipoCuenta', divMayor, numero);


        var styleValor = tabla.find('thead th[id="thValor' + divMayor + '"]').attr('style');
        var txtValor = $('<input>')
            .css({'padding': '1px'})
            .attr({
                'type': 'text',
                'data-id': numero,
                'id': 'txtValor' + complemento
            });
        var valor = $('<td>').attr('header', 'thValor' + divMayor)
            .attr('style', !!styleValor ? styleValor : "max-width: 100px")
            .append(txtValor);


        var styleFecha = tabla.find('thead th[id="thFecha' + divMayor + '"]').attr('style');
        var txtFecha = $('<input>')
            .attr('type', 'text')
            .css({'padding': '1px'})
            .attr('id', 'txtFecha' + complemento);
        var fecha = $('<td>').attr('header', 'thFecha' + divMayor)
            .attr('style', !!styleFecha ? styleFecha : "max-width: 100px")
            .append(txtFecha);

        if (divMayor === "Cheque") {
            var boton = $('<button>').addClass('tblBtn')
                .attr('id', 'btnInfo_' + divMayor + '_' + numero).text('Información');
            boton.on('click', that.mostrarFormasPago);
            var td = $('<td>').attr('header', 'thInformacion').append(boton);
        } else {
            var td = '';
        }

        var button = $('<input>').attr('type', 'button').addClass('tblBtn').attr('data-id', numero).val('Eliminar');
        button.on('click', that.eliminarFila);
        var eliminar = $('<td>').append(button);
        var tr = $('<tr>')
            .attr('modo', 'agregar')
            .attr('data-fila', numero)
            .append(_empresa, banco, tipoCuenta, cuenta, valor, fecha, td, eliminar);

        tabla.append(tr);

        tr.find('select, input:text').each(function (c, combo) {
            combo = $(combo);
            var w = combo.parent().width() - 5;
            combo.css({'max-width': w, 'min-width': w});
        });


        __dom.configurarCalendario('txtFecha' + complemento);
        $('#cmbEmpresa' + complemento).on('change', that.consultarBancos);
        $('#txtValor' + complemento).on('blur', that.sumarConsignaciones);
        __dom.configurarTextoNumerico('txtValor' + complemento, false, true);
        $('#cmbBanco' + complemento).on('change', function () {
            that.consultarTipoCuenta(divMayor, numero, $(this));
        });
        $('#cmbTipoCuenta' + complemento).on('change', function () {
            that.consultarCuentas(divMayor, numero, $(this));
        });
        $('#cmbCuenta' + complemento).on('change', that.fxChangeTipoCuenta);
    },
    /**
     * Una vez cambia el combo de cuenta se le asigna un título al mismo para que en caso de ser muy largo el usuario lo pueda ver completo
     */
    fxChangeTipoCuenta: function () {
        var _this = $(this);
        var texto = _this.find('option:selected').text();
        _this.attr('title', texto);
    },
    /** Agrega campo 'td' con un combo
     * @param  {string} header - Atributo header del campo 'td'
     * @param  {string} combo - Nombre del combo que se añade al campo
     * @param  {string} divMayor - Nombre de la división al que pertenece la tabla a la que se agregará el campo
     * @param  {int} numero - Número de la fila donde se agregará el campo
     * @type {object}
     */
    agregarCampo: function (header, combo, divMayor, numero) {
        var opcion = $('<option>').val('-1').text('Seleccione opción');
        var td = $('<td>').attr('header', header + divMayor)
            .append($('<select>').attr('id', combo + '_' + divMayor + '_' + numero).append(opcion));
        return td;
    },
    /** Suma el valor de los bancos por consignación y lo compara con el total de la consignación
     * @param  {string} div - Nombre de la división donde está la tabla de bancos a sumar
     * @returns {void}
     */
    sumarConsignaciones: function (div) {
        var _this = $(this);
        var divMayor = _this.parent().length > 0 ?
            $(_this.parents()[6]).attr('data-forma') :
            //_this.parent().parent().parent().parent().parent().parent().parent().attr('data-forma') :
            (typeof (div) === "string" ? div : '');

        var valorConsignacion = 0;
        var tabla = '';
        if (consignacionesModel.accionGeneral === 'A') {
            tabla = 'tbl' + divMayor;
        } else if (consignacionesModel.accionGeneral === 'I') {
            tabla = 'tblBancos' + divMayor;
        }
        var selector = $('#' + tabla + ' tbody td[header="thValor' + divMayor + '"]');
        $.each(selector, function (i, fila) {
            if (fila.children.length > 0) {
                var tdValor = isNaN(parseFloat($(fila.children).val())) ? 0 : parseFloat($(fila.children).val());
                valorConsignacion = parseFloat(valorConsignacion + tdValor);
            } else {
                var tdValor = parseFloat($(fila).attr('data-valor'));
                valorConsignacion = parseFloat(valorConsignacion + tdValor);
            }
        });

        /*
         if(typeof(div) === "string"){
         $('#txtValorFormaPago' + divMayor).val(valorConsignacion);
         }*/

        $('#txtTotal' + divMayor).val(valorConsignacion);

        consignacionesModel.valorconsignacion = valorConsignacion;
        $('#divTotal' + divMayor).show();
        var valorTotal = isNaN(parseFloat($('#txtValorFormaPago' + divMayor).val())) ? 0 : parseFloat($('#txtValorFormaPago' + divMayor).val());
        if (valorConsignacion !== valorTotal) {
            $('#txtTotal' + divMayor).addClass('campoInvalido').removeClass('campoValido');
        } else {
            $('#txtTotal' + divMayor).addClass('campoValido').removeClass('campoInvalido');
        }
        return valorConsignacion;
    },
    /** Confirma si el usuario desea eliminar una fila de la consignación
     * @returns {void}
     */
    eliminarFila: function () {
        var _this = $(this);
        var consignacion = parseInt(_this.attr('data-id'));
        var fila = _this.parent().parent().attr('data-fila');

        var table = _this.parent().parent().parent().parent();
        var idTable = table.attr('id');

        that.dialogoActual = $('div#divEliminarConsignacion').dialogo({
            resizable: false,
            heigth: 350,
            modal: true,
            title: 'Eliminar fila',
            buttons: {
                "Sí": function () {
                    var forma = '';
                    var tr = _this.parent().parent();
                    if ($('#' + idTable + "[id*='Efectivo']").length > 0) {
                        forma = 'Efectivo';
                        if (tr.find('select').length === 0) {
                            consignacionesModel.detallesEliminar.push({
                                accion: 'E',
                                iddetalleconsignacion: consignacion
                            });
                        }
                    } else {
                        for (var i = 0; i < consignacionesModel.consignaciones.length; i++) {
                            forma = 'Cheque';
                            var infoConsignacion = consignacionesModel.consignaciones[i];
                            if ($(tr).is('[modo]')) {
                                if (parseInt(infoConsignacion.fila) === fila) {
                                    consignacionesModel.consignaciones.splice(i, 1);
                                    consignacionesModel.detallesEliminar.push({
                                        accion: 'E',
                                        iddetalleconsignacion: consignacion
                                    });
                                    break;
                                }
                            } else if (parseInt(infoConsignacion.consignacion) === consignacion) {
                                consignacionesModel.consignaciones.splice(i, 1);
                                consignacionesModel.detallesEliminar.push({
                                    accion: 'E',
                                    iddetalleconsignacion: consignacion
                                });
                                break;
                            }
                        }
                    }
                    //Eliminar fila de la tabla.
                    var tr = _this.parent().parent();
                    if (tr.parent().find('tr').length === 1) {
                        tr.parent().parent().hide();
                        tr.parent().html('');
                    } else {
                        tr.remove();
                    }
                    that.sumarConsignaciones(forma);
                    that.dialogoActual.dialog("close");
                }, Cancelar: function () {
                    that.dialogoActual.dialog("close");
                }
            }
        });
    },
    /** Hace petición ajax para consultar los bancos que tienen convenio con la empresa de la fila
     * @returns {void}
     */
    consultarBancos: function () {
        var _this = $(this);
        var texto = _this.find('option:selected').text();

        var divMayor = $(_this.parents()[6]).attr('data-forma');
        var numero = _this.parent().parent().attr('data-fila');

        consignacionesModel.numero = numero;
        var detalle = divMayor + '_' + numero;
        consignacionesModel.divMayor = divMayor;

        var opcion = $('<option>').val('-1').text('Seleccione opción');
        _this.attr('title', texto);
        $('#cmbBanco_' + detalle).empty().append(opcion);
        $('#cmbCuenta_' + detalle).empty().append(opcion);
        $('#cmbTipoCuenta_' + detalle).empty().append(opcion);

        if (_this.val() !== '-1') {
            consignacionesControl.consultarBancos({
                idsucursal: $('#cmbSucursal').val(),
                idmediopago: $('#cmbMedioPago').val(),
                idempresa: _this.val()
            }, that.onConsultarBancosCompleto);
        }
    },
    /** Captura respuesta del servidor cuando se consultan bancos que tienen convenio con una empresa
     * @param  {object} data - Respuesta del servidor con bancos de una empresa
     * @returns {void}
     */
    onConsultarBancosCompleto: function (data) {
        switch (parseInt(data.codigoRespuesta)) {
            case 0:
                $('#pMensaje').text(__app.mensajes.sinResultados).show();
                break;
            case 1:
                var cmbBanco = $('#cmbBanco_' + consignacionesModel.divMayor + '_' + consignacionesModel.numero + '').empty();
                __dom.llenarCombo(cmbBanco, data.bancos, 'idbanco', 'banco');
                break;
        }
    },
    /** Hace petición ajax para consultar los tipos de cuenta que ofrece un banco
     * @returns {void}
     */
    consultarTipoCuenta: function (divMayor, numero, combo) {
        var texto = combo.find('option:selected').text();
        var opcion = $('<option>').val('-1').text("Seleccione una opción");

        consignacionesModel.numero = numero;
        var detalle = divMayor + '_' + numero;
        consignacionesModel.divMayor = divMayor;

        $('#cmbCuenta_' + detalle).empty().append(opcion);
        $('#cmbTipoCuenta_' + detalle).empty().append(opcion);
        combo.attr('title', texto);
        if (combo.val() !== '-1') {
            consignacionesControl.consultarTipoCuenta({
                idsucursal: $('#cmbSucursal').val(),
                idmediopago: $('#cmbMedioPago').val(),
                idbanco: combo.val()
            }, that.onConsultarTipoCuentaCompleto);
        }

    },
    /** Captura respuesta del servidor cuando se consultan tipo de cuenta
     * @param  {object} data - Respuesta del servidor con tipos de cuenta de un banco
     * @returns {void}
     */
    onConsultarTipoCuentaCompleto: function (data) {
        switch (parseInt(data.codigoRespuesta)) {
            case 0:
                $('#pMensaje').text(__app.mensajes.sinResultados).show();
                break;
            case 1:
                var cmbTipoCuenta = $('#cmbTipoCuenta_' + consignacionesModel.divMayor + '_' + consignacionesModel.numero + '').empty();
                cmbTipoCuenta.append($('<option>').text("Seleccione").val(-1));
                for (var i = 0; i < data.tipocuentas.length; i++) {
                    var item = data.tipocuentas[i];
                    if (item.tipocuenta === 'A') {
                        cmbTipoCuenta.append($('<option>').text('Ahorros').val(item.tipocuenta))
                    } else if (item.tipocuenta === 'C') {
                        cmbTipoCuenta.append($('<option>').text('Corriente').val(item.tipocuenta))
                    }
                }
                break;
        }
    },
    /** Hace petición ajax para consultar las cuentas
     * @returns {void}
     */
    consultarCuentas: function (divMayor, numero, combo) {
        var detalle = divMayor + '_' + numero;
        var texto = combo.find('option:selected').text();
        $('#cmbCuenta_' + detalle).empty()
            .append($('<option>').val('-1').text("Seleccione una opción"));
        consignacionesModel.divMayor = divMayor;
        consignacionesModel.numero = numero;
        combo.attr('title', texto);
        if (combo.val() !== '-1') {
            consignacionesControl.consultarCuentas({
                idsucursal: $('#cmbSucursal').val(),
                idmediopago: $('#cmbMedioPago').val(),
                idbanco: $('#cmbBanco_' + detalle).val(),
                idempresa: $('#cmbEmpresa_' + detalle).val(),
                tipocuenta: combo.val()
            }, that.onConsultarCuentasCompleto);
        }
    },
    /** Captura respuesta del servidor cuando se consultan cuenta
     * @param  {object} data - Respuesta del servidor con tipos de cuenta de un banco
     * @returns {void}
     */
    onConsultarCuentasCompleto: function (data) {
        switch (parseInt(data.codigoRespuesta)) {
            case 0:
                $('#pMensaje').text(__app.mensajes.sinResultados).show();
                break;
            case 1:
                var cmbTipoCuenta = $('#cmbCuenta_' + consignacionesModel.divMayor + '_' + consignacionesModel.numero + '').empty();
                __dom.llenarCombo(cmbTipoCuenta, data.cuentas, 'idbancocuenta', 'numerocuenta');
                break;
        }
    },
    /** Muestra un diálogo para agregar o eliminar información del cheques
     * @returns {void}
     */
    mostrarFormasPago: function () {
        var _this = $(this);
        that.cancelarFormasPago();
        var fila = _this.parent().parent().attr('data-fila');
        $('#btnCancelarFormasPago, #btnAgregarForma').show();
        that.dialogoActual = $('#divFormasPago').dialogo({
            width: 800,
            modal: true,
            title: 'Cheques',
            resizable: false,
            position: {my: "center", at: "top+90", of: "body"}
        });

        $('#btnAceptarFormasPago').off();
        $('#btnAceptarFormasPago').on('click', function () {
            that.aceptarFormaPago(fila);
        });
        $('#btnCancelarFormasPago').off('click');
        $('#btnCancelarFormasPago').on('click', function () {
            that.cancelarFormaPago(_this)
        });
        var con = consignacionesModel.consignaciones;
        for (var j = 0; j < con.length; j++) {
            if (con[j].fila) {
                if (con[j].fila === fila) {
                    that.validarInformacionCheque(con[j]);
                    break;
                }
                return;
            }
            if (con[j].consignacion) {
                if (parseInt(_this.attr('data-id')) === parseInt(con[j].consignacion)) {
                    that.validarInformacionConsignacion(con[j]);
                }
            }
        }
    },
    validarInformacionCheque: function (info) {
        if (!!info.informacionadicional) {
            for (var i = 0; i < info.informacionadicional.length; i++) {
                var cheque = info.informacionadicional[i];
                that.agregarInformacionCheque(cheque);
            }
        }
    },
    validarInformacionConsignacion: function (info) {
        $('#btnAceptarFormasPago').off('click');
        var fxCerrar = function () {
            that.cancelarFormasPago();
            that.dialogoActual.dialog('close');
        };
        for (var i = 0; i < info.informacionadicional.length; i++) {
            var cheque = info.informacionadicional[i];
            var div = that.agregarInformacionCheque(cheque);
            div.find('button').remove();
            div.find('input:text, select').attr('disabled', 'disabled');
        }
        $('#btnAceptarFormasPago').on('click', fxCerrar);
        $('#btnCancelarFormasPago, #btnAgregarForma').hide();
    },
    /** Valida la información del cheque y se guarda en el modelo.
     * @param {int} fila - Número de fila a la que pertenece la información que se está añadiendo/eliminando
     * @returns {void}
     */
    aceptarFormaPago: function (fila) {
        var sumatoriaPago = parseFloat($('#txtSumatoria').val());
        var tabla = $('#tblBancosCheque');
        var valorConsignacion = tabla.find('td[header="thValorCheque"] input[id="txtValor_Cheque_' + fila + '"]');
        valorConsignacion = parseFloat(valorConsignacion.val());
        if (sumatoriaPago > valorConsignacion) {
            __dom.lanzarAlerta(__app.mensajes.valorPagadoMayorDeuda, __app.mensajes.atencion);
            return;
        }
        if (sumatoriaPago < valorConsignacion) {
            __dom.lanzarAlerta('La sumatoria de los cheques debe ser igual al valor de la consignación', __app.mensajes.atencion);
            return;
        }

        if (guardarFormasDePago(consignacionesModel)) {
            var informacion = [];
            for (var i = 0; i < consignacionesModel.formasPago.length; i++) {
                var consignacion = consignacionesModel.formasPago[i];
                informacion.push({
                    nombre: consignacion.detalles.nombre,
                    documento: consignacion.detalles.doc,
                    idbanco: consignacion.detalles.idBanco,
                    banco: consignacion.detalles.banco,
                    numCheque: consignacion.cheque.numCheque,
                    numCuenta: consignacion.cheque.numCuenta,
                    valor: consignacion.valor
                });
            }
            for (i = 0; i < consignacionesModel.consignaciones.length; i++) {
                if (consignacionesModel.consignaciones[i].fila === fila) {
                    consignacionesModel.consignaciones.splice(i, 1);
                }
            }
            consignacionesModel.consignaciones.push({
                fila: fila,
                informacionadicional: informacion
            });
            that.dialogoActual.dialog("close");
            that.cancelarFormasPago();
        }
    },
    /** Confirma si el usuario desea eliminar la información de un cheque
     * @returns {void}
     */
    cancelarFormaPago: function (_this) {
        var idconsignacion = _this.attr('data-id');
        var fila = _this.parent().parent().attr('data-fila');

        __dom.lanzarAlerta(
            __app.mensajes.confirmaCancelarFormasPago,
            __app.mensajes.tituloConfirmacion,
            function () { //en caso de aceptar
                that.dialogoActual.dialog("close");
                for (var i = 0; i < consignacionesModel.consignaciones.length; i++) {
                    var consignacion = consignacionesModel.consignaciones[i];

                    if (consignacion.fila) {
                        if (parseInt(consignacion.fila) === parseInt(fila)) {
                            consignacionesModel.consignaciones.splice(i, 1);
                        }
                        return;
                    }

                    if (consignacion.consignacion) {
                        if (parseInt(consignacion.consignacion) === parseInt(idconsignacion)) {
                            consignacionesModel.consignaciones.splice(i, 1);
                        }
                    }
                }
                that.cancelarFormasPago();
            }, true
        );
    },
    /** Elimina la información de un cheque en interfaz y modelo
     * @returns {void}
     */
    cancelarFormasPago: function () {
        consignacionesModel.formasPago = [];
        $('#txtFormaPago, #txtSumatoria').val('');
        $('div#divFormasPago div#controlesFormasPago').html('');
    },
    /** Agrega campos para ingresar información de un cheque en caso de que el cheque
     * ya tenga información verifica para llenar los campos
     * @param {object} cheque - Información del cheque
     * @returns {void}
     */
    agregarInformacionCheque: function (cheque) {
        consignacionesModel.formasPago.push({});
        var indice = consignacionesModel.formasPago.length - 1;
        consignacionesModel.formasPago[indice].indice = indice;
        var div = $(tplFormaPagoCheque.replace(/{{i}}/g, indice));
        $('div#divFormasPago div#controlesFormasPago').append(div);

        that.configurarForma(div, indice);
        if (cheque.documento) {
            that.cargarInformacionCheque(cheque);
        }
        return div;
    },
    /**
     * Agrega la respectiva información del cheque en las cajas de texto
     * @param {Object} cheque - Objeto de la información del cheque
     */
    cargarInformacionCheque: function (cheque) {
        var div = $('div#divFormasPago div#controlesFormasPago div:last').parent();
        div.find($('input[id^="txtValor"]')).val(cheque.valor).blur();
        div.find($('input[id^="txtDocGirador"]')).val(cheque.documento);
        div.find($('input[id^="txtNombreGirador"]')).val(cheque.nombre);
        div.find($('select[id^="cmbBanco"]')).val(cheque.idbanco);
        div.find($('input[id^="txtNumCuenta"]')).val(cheque.numCuenta);
        div.find($('input[id^="txtNumCheque"]')).val(cheque.numCheque);
    },
    /** Configura los controles de la información de un cheque
     * @returns {void}
     */
    configurarForma: function (formas, indice) {
        var divFormas = $(formas);
        configurarNuevaFormaPago(divFormas, indice);
        divFormas.find('#cmbBanco' + indice).html(bancos.html());
        divFormas.find('#txtValor' + indice).on('blur', that.actualizarSumatoria);
        divFormas.find('button#btnRemoverForma' + indice).on('click', function () {
            consignacionesModel.formasPago.splice(indice, 1);
            $('div#divFormaPago' + indice).remove();
            that.actualizarSumatoria();
        });
    },
    /**
     * Actualiza la sumatoria en pesos de las formas de pago seleccionadas por el usuario
     * @returns {void}
     */
    actualizarSumatoria: function () {
        var nuevoValor = 0;
        $('div#divFormasPago').find('input[id^="txtValor"]').each(function (i, textbox) {
            var val = parseFloat(textbox.value);
            nuevoValor += (!isNaN(val)) ? val : 0;
        });
        $('#txtFormaPago, #txtSumatoria').val(nuevoValor);
    },
    /** Captura la respuesta del servidor, cuando se sube un archivo
     * @param {object} e -
     * @param {object} data - Respuesta del servidor al cargar archivos
     * @returns {void}
     */
    subirCompleto: function (e, data) {
        $('#pMensaje').html('');
        switch (parseInt(data.response.codigoRespuesta)) {
            case 0:
                break;
            case 1:
                that.mostrarArchivos(data.response.archivos, false);
                break;
        }
    },
    /** Muestra los archivos cargados en el servidor en una lista.
     * @param {object} data- información de los archivos que se han cargado.
     * @returns {void}
     */
    mostrarArchivos: function (data, accion) {
        var div = $('#divArchivos');
        for (var i = 0; i < data.length; i++) {
            var info = data[i];
            if (!accion) {
                consignacionesModel.archivos.push({accion: 'I', idarchivo: info.idarchivo});
            }
            var a = $('<a>').text(info.nombrearchivo).attr('href', info.ruta).attr('target', '_blank').attr('data-id', info.idarchivo);
            var eliminar = $('<button>').on('click', that.eliminarArchivo).addClass('btnSimple').append($('<i>').addClass('fa fa-trash'));
            var archivo = $('<div>').addClass('archivoSubido').append($('<i>').addClass('fa fa-file-pdf-o'), a, eliminar);
            div.append(archivo);
        }
    },
    /** Pide confirmación para eliminar un archivo en caso de ser "Sí"
     * Elimina un archivo de la lista de archivos y guarda id en modelo para eliminarla luego en el servidor.
     * @returns {void}
     */
    eliminarArchivo: function () {
        var _this = $(this);
        var id = _this.parent().children(':first').next().attr('data-id');
        $('div#divEliminarArchivo').dialogo({
            resizable: false,
            heigth: 140,
            modal: true,
            title: 'Eliminar archivo',
            buttons: {
                "Sí": function () {
                    $(this).dialog('close');
                    _this.parent().remove();
                    consignacionesModel.eliminarArchivo = {idarchivo: id};
                    for (var i = 0; i < consignacionesModel.archivos.length; i++) {
                        var archivo = consignacionesModel.archivos[i];
                        if (archivo.idarchivo === id) {
                            consignacionesModel.archivos.splice(i, 1);
                        }
                    }

                }, Cancelar: function () {
                    $(this).dialog("close");
                }
            }
        });

    },
    /** Captura respuesta del servidor cuando se elimina un archivo
     * @returns {void}
     */
    onEliminarArchivoCompleto: function (data) {
        switch (parseInt(data.codigoRespuesta)) {
            case 0:
                $('#pMensajeArchivo').text(__app.mensajes.sinResultados).show();
                break;
            case 1:
                $('#pMensajeArchivo').text(data.mensaje);
                break;
        }
    },
    /** Valida que la información sea completa de ser así hace petición ajax para guardar la consignación
     * en caso contrario muestra alerta con información de los errores
     * @returns {void}
     */
    grabarConsignacion: function () {
        //Valida que toda la información escencial este correcta.
        var erroresGlobal = 0;
        var mensajeGlobal = '';
        var txtVlrCheque = $('#txtValorFormaPagoCheque').val();
        var txtVlrEfectivo = $('#txtValorFormaPagoEfectivo').val();
        if (!consignacionesModel.recaudosEmpresa) {
            __dom.lanzarAlerta('Debe seleccionar recaudos a consignar.', __app.mensajes.atencion);
            return;
        }
        if ($('#cmbSucursal').val() === '-1' || $('#cmbDocumento').val() === '-1') {
            __dom.lanzarAlerta('Debe seleccionar una opción en los campos principales.', __app.mensajes.atencion);
            return;
        }

        if ($('#txtValorFormaPagoEfectivo').val().trim() === '' && $('#txtValorFormaPagoCheque').val().trim() === '') {
            __dom.lanzarAlerta('Debe diligenciar el valor de mínimo una consignación.', __app.mensajes.atencion);
            return;
        }

        var tipomediopago = $('#cmbMedioPago option:selected').attr('data-tipo');
        var valorTextoFormaPagoEfectivo = $('#txtValorFormaPagoEfectivo').val().trim();
        var valorTextoFormaPagoCheque = $('#txtValorFormaPagoCheque').val().trim();
        var valorFormaPagoEfectivo = parseFloat(valorTextoFormaPagoEfectivo === "" ? 0 : valorTextoFormaPagoEfectivo);
        var valorFormaPagoCheque = parseFloat(valorTextoFormaPagoCheque === "" ? 0 : valorTextoFormaPagoCheque);
        var suma = valorFormaPagoCheque + valorFormaPagoEfectivo;
        var valorRecaudoEmpresa = parseFloat($('#txtTotalRecaudoEmpresa').val().replace(/,/g, '').replace('$', ''));
        if (tipomediopago === 'I' && suma !== valorRecaudoEmpresa) {
            __dom.lanzarAlerta('El medio de pago es Interno, la suma de las formas de pago debe ser igual al total recaudado por empresa', __app.mensajes.atencion);
            return;
        }
        if (tipomediopago === 'E') {
            if (consignacionesModel.accionGeneral == 'A') {
                var filasEfectivo = $('#tblEfectivo tbody tr').length;
                var filasCheques = $('#tblCheque tbody tr').length;
                if ((filasEfectivo === 0 && filasCheques === 0) || (filasEfectivo === 1 && filasCheques === 1)) {
                    __dom.lanzarAlerta('El medio de pago es Externo, solo debe agregar una forma de pago', __app.mensajes.atencion);
                    return;
                }
                if (filasEfectivo > 1 || filasCheques > 1) {
                    __dom.lanzarAlerta('El medio de pago es Externo, solo debe agregar una forma de pago', __app.mensajes.atencion);
                    return;
                }
            }

            if (consignacionesModel.accionGeneral == 'I') {
                var filasEfectivo = $('#tblBancosEfectivo tbody tr').length;
                var filasCheques = $('#tblBancosCheque tbody tr').length;
                if ((filasEfectivo === 0 && filasCheques === 0) || (filasEfectivo === 1 && filasCheques === 1)) {
                    __dom.lanzarAlerta('El medio de pago es Externo, solo debe agregar  una forma de pago', __app.mensajes.atencion);
                    return;
                }
                if (filasEfectivo > 1 || filasCheques > 1) {
                    __dom.lanzarAlerta('El medio de pago es Externo, solo debe agregar una forma de pago', __app.mensajes.atencion);
                    return;
                }
            }
        }


        if ($('#tblBancosEfectivo tbody td').length === 0 && $('#tblBancosCheque tbody td').length === 0 &&
            $('#tblEfectivo tbody td').length === 0 && $('#tblCheque tbody td').length === 0) {
            __dom.lanzarAlerta('Debe diligenciar los datos de la consignación.', __app.mensajes.atencion);
            return;
        }

        if (consignacionesModel.archivos.length === 0) {
            __dom.lanzarAlerta(__app.mensajes.sinArchivos + " de soporte", __app.mensajes.atencion);
            return;
        }

        //Valida que la consignación en efectivo y su información estén en la tabla de efectivo
        if (txtVlrEfectivo.trim() !== '' && parseFloat(txtVlrEfectivo) > 0) {
            if ($('#txtTotalEfectivo').val().trim() !== txtVlrEfectivo.trim()) {
                __dom.lanzarAlerta('El valor a consignar y el total de los detalles no son iguales.', __app.mensajes.atencion);
                return;
            }
            if ($('#tblBancosEfectivo tbody td').length === 0 && $('#tblEfectivo tbody td').length === 0) {
                erroresGlobal++;
                mensajeGlobal += 'Debe diligenciar los detalles de la consignación con forma de pago <strong>Efectivo</strong>';
            }
        }
        if (txtVlrCheque.trim() !== '' && parseFloat(txtVlrCheque) > 0) {
            if ($('#txtTotalCheque').val().trim() !== txtVlrCheque.trim()) {
                __dom.lanzarAlerta('El valor a consignar y el total de los detalles no son iguales.', __app.mensajes.atencion);
                return;
            }
            if ($('#tblBancosCheque tbody td').length === 0 && $('#tblCheque tbody td').length === 0) {
                erroresGlobal++;
                mensajeGlobal += 'Debe diligenciar los detalles de la consignación con forma de pago <strong>Cheque</strong>';
            }
        }
        var validacionCheque = that.validarConsignacionCheque();
        if (!!validacionCheque) {
            erroresGlobal += validacionCheque.errores;
            mensajeGlobal += validacionCheque.mensaje;
        }
        var validacionEfectivo = that.validarConsignacionEfectivo();
        if (!!validacionEfectivo) {
            erroresGlobal += validacionEfectivo.errores;
            mensajeGlobal += validacionEfectivo.mensaje;
        }
        if (erroresGlobal > 0) {
            $('#pErrorGlobal').html(mensajeGlobal);
            $('#divErrores').dialogo({
                modal: true,
                width: 400,
                height: 400,
                title: 'Error al grabar ',
                buttons: {
                    Aceptar: function () {
                        $(this).dialog('close');
                    }
                }
            });
            return;
        }
        that.guardarObjetoConsignacion();
    },
    /**
     * Valida la información agregada en las tablas de cheque y efectivo
     * @param {jQuery} tabla - Objeto del DOM que representa una tabla y  es donde se encuentra toda la información de la forma de pago
     * @returns {Object} Informa si existen errores en la tabla y retorna el mensaje a mostrar
     */
    validarCamposTablas: function (tabla) {
        var invalido = false;
        var errores = 0;
        var mensaje = '';
        var selector = $('#' + tabla + ' td').find('input:text, select');
        for (var indiceCampos = 0; indiceCampos < selector.length; indiceCampos++) {
            var campo = selector[indiceCampos];
            var jcampo = $(campo);
            switch (campo.tagName) {
                case 'INPUT':
                    if (campo.value.trim() === '' && campo.type === 'text') {
                        invalido = true;
                    }
                    break;
                case 'SELECT':
                    if (campo.value === '-1' || !campo.value) {
                        invalido = true;
                    }
                    break;
            }
            if (invalido) {
                errores++;
                jcampo.addClass('campoInvalido');
                var id = jcampo.parent().attr("header");
                var text = $('#' + tabla + ' thead #' + id).text();
                var fila = parseInt(jcampo.parents('tr:eq(0)').find('input[type="button"]:last').attr('data-id')) + 1;
                mensaje += 'Debe seleccionar una opción en <strong>' + text + ' </strong> de la fila ' + fila + '<br>';
            }
        }
        return {
            mensaje: mensaje, errores: errores
        };
    },
    /**
     * Valida las tablas de cheque (dependiendo de cuál se esté mostrando) que tenga toda la información adicional y un valor
     * @returns {*}
     */
    validarConsignacionCheque: function () {
        //Valida que el valor de la consignación y la sumatoria de los valores de la consignación sean iguales
        var accion = consignacionesModel.accionGeneral;
        var txtVlrPago = $('#txtValorFormaPagoCheque').val();
        var tabla = (accion === 'I') ? 'tblBancosCheque' : 'tblCheque';

        if ($('#' + tabla + ' tbody td').length === 0) {
            return false;
        }

        var validacion = that.validarCamposTablas(tabla);
        var mensaje = validacion.mensaje;
        var errores = validacion.errores;
        if (txtVlrPago.trim() === '') {
            errores++;
            mensaje += 'Recuerde diligenciar <strong> Valor Total </strong> a consignar <br>';
        }

        var filas = $('#' + tabla + ' tbody tr');
        for (var i = 0; i < filas.length; i++) {
            var existe = 0;
            var fila = $(filas[i]);
            var tr = fila.find('input[type="button"]:last').attr('data-id');
            for (var indiceCheque = 0; indiceCheque < consignacionesModel.consignaciones.length; indiceCheque++) {
                if (parseInt(consignacionesModel.consignaciones[indiceCheque].fila) === parseInt(tr)) {
                    existe++;
                    break;
                }
                if (parseInt(consignacionesModel.consignaciones[indiceCheque].consignacion) === parseInt(tr)) {
                    existe++;
                    break;
                }
            }
            if (existe === 0) {
                errores++;
                mensaje += 'Ingrese información adicional de la fila ' + (parseInt(tr) + 1) + '<br>';
            }
        }

        if (errores > 0) {
            mensaje = '<br> <h3>Forma de pago: Cheque</h3> <hr>' + mensaje;
            return {
                mensaje: mensaje,
                errores: errores
            };
        }
    },
    /**
     * Valida que si hay filas de efectivo tenga el valor respectivamente
     * @returns {Object} Devuelve los errores en caso de que hayan
     */
    validarConsignacionEfectivo: function () {
        var accion = consignacionesModel.accionGeneral;
        var tabla = (accion === 'I') ? 'tblBancosEfectivo' : 'tblEfectivo';

        if ($('#' + tabla + ' tbody td').length === 0) {
            return false;
        }

        var validacion = that.validarCamposTablas(tabla, errores, mensaje);
        var mensaje = validacion.mensaje;
        var errores = validacion.errores;
        if ($('#txtValorFormaPagoEfectivo').val().trim() === '') {
            errores++;
            mensaje += 'Recuerde diligenciar <strong> Valor Total </strong> a consignar <br>';
        }
        if (errores > 0) {
            mensaje = '<h3>Forma de pago: Efectivo</h3> <hr>' + mensaje;
            return {
                mensaje: mensaje,
                errores: errores
            };
        }
    },
    /**
     * Construye todo el objeto de la consignación para enviarlo al servidor y guardar toda la información
     */
    guardarObjetoConsignacion: function () {
        var accion = consignacionesModel.accionGeneral;
        var tablaCheque = (accion === 'I') ? 'tblBancosCheque' : 'tblCheque';
        var tablaEfectivo = (accion === 'I') ? 'tblBancosEfectivo' : 'tblEfectivo';
        //Guarda la información de los cheques con sus detalles
        var infoadicional = [];
        var filasCheque = $('#' + tablaCheque + ' tbody tr');
        //<editor-fold desc="Construye información adicional para cada cheque registrado" defaultstate="collapsed">
        for (var i = 0; i < filasCheque.length; i++) {
            var f = $(filasCheque[i]);
            if (!f.attr("modo")) {
                continue;
            }
            var data_id = f.find('input[type="button"]:last').attr('data-id');
            for (var indiceInformacion = 0; indiceInformacion < consignacionesModel.consignaciones.length; indiceInformacion++) {
                var consignacion = consignacionesModel.consignaciones[indiceInformacion];
                if (parseInt(consignacion.fila) === parseInt(data_id)) {
                    for (var indiceInfoAdicional = 0; indiceInfoAdicional < consignacion.informacionadicional.length; indiceInfoAdicional++) {
                        var informacion = consignacion.informacionadicional[indiceInfoAdicional];
                        var info = [
                            {
                                informacion: informacion.nombre,
                                idtipificacion: 13,
                                nombretipificacion: 'Nombre Tercero Girador'
                            },
                            {
                                informacion: informacion.documento,
                                idtipificacion: 12,
                                nombretipificacion: 'Nit tercero Girador'
                            },
                            {
                                informacion: informacion.idbanco,
                                idtipificacion: 9,
                                nombretipificacion: 'Banco'
                            },
                            {
                                informacion: informacion.numCheque,
                                idtipificacion: 11,
                                nombretipificacion: 'Numero de Cheque'
                            },
                            {
                                informacion: informacion.numCuenta,
                                idtipificacion: 10,
                                nombretipificacion: 'Numero de Cuenta'
                            },
                            {
                                informacion: informacion.valor,
                                idtipificacion: 31,
                                nombretipificacion: 'valor'
                            }];
                        infoadicional.push(info);

                    }
                    $(data_id + ' select').length > 0;
                    var fecha = f.find('td[header="thFechaCheque"] input[id="txtFecha_Cheque_' + data_id + '"]').val() + ' 00:00:00';
                    fecha = fecha.replace(/\//g, '-');
                    consignacionesModel.detalle.push({
                        accion: 'I',
                        fecha: fecha,
                        idformapago: 78,
                        informacionadicional: infoadicional,
                        valor: f.find('td input[id="txtValor_Cheque_' + data_id + '"]').val(),
                        idbanco: f.find('td select[id="cmbBanco_Cheque_' + data_id + '"]').val(),
                        idempresa: f.find('td select[id="cmbEmpresa_Cheque_' + data_id + '"]').val(),
                        idbancocuenta: f.find('td select[id="cmbCuenta_Cheque_' + data_id + '"]').val(),
                        idtipocuenta: f.find('td select[id="cmbTipoCuenta_Cheque_' + data_id + '"]').val(),
                        numerocuenta: f.find('td select[id="cmbCuenta_Cheque_' + data_id + '"] option:selected').text()
                    });
                }
            }
        }
        //</editor-fold>
        //Guarda información de consignaciones en efectivo
        var filas = $('#' + tablaEfectivo + ' tbody tr');
        //<editor-fold desc="Guarda la información de cada registro guardado en efectivo " defaultstate="collapsed">
        $.each(filas, function (i, fila) {
            var data_id = fila.lastElementChild.firstElementChild.getAttribute('data-id');
            var f = $(fila);
            if (!!f.attr("modo")) {
                var date = $(fila).find('td[header="thFechaEfectivo"] input[id="txtFecha_Efectivo_' + data_id + '"]').val() + ' 00:00:00';
                date = date.replace(/\//g, '-');
                consignacionesModel.detalle.push({
                    accion: 'I',
                    idformapago: 75,
                    idempresa: $(fila).find('td[header="thEmpresaEfectivo"] select[id="cmbEmpresa_Efectivo_' + data_id + '"]').val(),
                    idbanco: $(fila).find('td[header="thBancoEfectivo"] select[id="cmbBanco_Efectivo_' + data_id + '"]').val(),
                    idtipocuenta: $(fila).find('td[header="thTipoCuentaEfectivo"] select[id="cmbTipoCuenta_Efectivo_' + data_id + '"]').val(),
                    idbancocuenta: $(fila).find('td[header="thCuentaEfectivo"] select[id="cmbCuenta_Efectivo_' + data_id + '"]').val(),
                    numerocuenta: $(fila).find('td[header="thCuentaEfectivo"] select[id="cmbCuenta_Efectivo_' + data_id + '"] option:selected').text(),
                    valor: $(fila).find('td[header="thValorEfectivo"] input[id="txtValor_Efectivo_' + data_id + '"]').val(),
                    fecha: date
                });
            }
        });
        //</editor-fold>

        for (var i = 0; i < consignacionesModel.detallesEliminar.length; i++) {
            consignacionesModel.detalle.push(consignacionesModel.detallesEliminar[i]);
        }
        if (consignacionesModel.detalle.length === 0 && consignacionesModel.accionGeneral === 'A') {
            __dom.lanzarAlerta(__app.mensajes.sinCambios, __app.mensajes.atencion);
            return;
        }

        //<editor-fold desc="Guarda la información de la consignación" defaultstate="collapsed">
        var datos = {};
        datos.consignacion = {
            accion: consignacionesModel.accionGeneral,
            idconsignacion: $('#txtIdConsignacion').attr('data-id'),
            idmediopago: $('#cmbMedioPago').val(),
            idsucursal: $('#cmbSucursal').val(),
            iddocumento: $('#cmbDocumento').val(),
            valorfaltante: parseFloat($('#txtFaltante').attr('data-valor')),
            valorsobrante: parseFloat($('#txtSobrante').attr('data-valor')),
            valorgasto: parseFloat($('#txtGasto').attr('data-valor')),
            valorcuentaporpagar: parseFloat($('#txtCuentaPorPagar').attr('data-valor'))
        };
        datos.archivos = [];
        datos.recaudos = that.guardarObjetoRecaudo();
        for (var i = 0; i < consignacionesModel.archivos.length; i++) {
            datos.archivos.push({idarchivo: consignacionesModel.archivos[i].idarchivo});
        }
        datos.detalleconsignacion = consignacionesModel.detalle;
        //</editor-fold>
        if (!!consignacionesModel.eliminarArchivo) {
            consignacionesControl.eliminarArchivo(consignacionesModel.eliminarArchivo, that.onEliminarArchivoCompleto);
        }
        consignacionesControl.grabarConsignacion({datos: JSON.stringify(datos)}, that.onGrabarCompleto);
    },
    /**
     * Construye el objeto para guardar los recaudos seleccionados para consignar, adicionalmente construye el objeto de los recaudos que han sido eliminados
     * @returns {Array} Recaudos que se enviarán al servidor
     */
    guardarObjetoRecaudo: function () {
        var recaudoGlobal = [];
        //En caso de que hayan recaudos en la consignación
        if (!!consignacionesModel.recaudosConsignacion) {
            //VALIDAR RECAUDOS PARA ELIMINAR
            for (var i = 0; i < consignacionesModel.recaudosConsignacion.length; i++) {
                var recaudoConsignacion = consignacionesModel.recaudosConsignacion[i];
                var esta = 0;
                for (var j = 0; j < consignacionesModel.detallesRecaudo.length; j++) {
                    var recaudo = consignacionesModel.detallesRecaudo[j];
                    if (recaudoConsignacion.idrecaudo === recaudo.idrecaudo) {
                        esta++;
                        break;
                    }
                }
                if (esta === 0) {
                    recaudoGlobal.push({
                        accion: 'E',
                        idrecaudo: recaudoConsignacion.idrecaudo,
                        version: recaudoConsignacion.version
                    });
                }
            }
            ///VALIDAR LOS QUE SE AGREGARÁN
            for (var j = 0; j < consignacionesModel.detallesRecaudo.length; j++) {
                var recaudo = consignacionesModel.detallesRecaudo[j];
                for (var i = 0; i < consignacionesModel.recaudosConsignacion.length; i++) {
                    var recaudoConsignacion = consignacionesModel.recaudosConsignacion[i];
                    var esta = 0;
                    if (recaudoConsignacion.idrecaudo === recaudo.idrecaudo) {
                        esta++;
                        break;
                    }
                }
                if (esta === 0) {
                    recaudoGlobal.push({accion: 'I', idrecaudo: recaudo.idrecaudo, version: recaudo.version});
                }
            }
            return recaudoGlobal;
        }
        for (var i = 0; i < consignacionesModel.detallesRecaudo.length; i++) {
            var recaudo = consignacionesModel.detallesRecaudo[i];
            recaudoGlobal.push({accion: 'I', idrecaudo: recaudo.idrecaudo, version: recaudo.version});
        }

        return recaudoGlobal;
    },
    /** Captura la respuesta del servidor cuando se graba una consignación
     * @param {object} data - Respuesta del servidor al consultar conceptos
     * @returns {void}
     */
    onGrabarCompleto: function (data) {
        $('#pMensaje').html('');
        switch (data.codigoRespuesta) {
            case 0:
                $('#pMensaje').text(__app.mensajes.sinResultados).show();

                break;
            case 1:
                var fxRecargar = function () {
                    location.reload()
                };
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion, fxRecargar, false, fxRecargar);
                consignacionesModel.idconsignacion = '';
                break;
        }
    },
    /** Limpia toda la información del formulario de busqueda
     * @returns {void}
     */
    limpiarFiltro: function () {
        $('#camposBuscarSuscripcion input[type="text"]').val('');
        $('#camposBuscarSuscripcion select').val('-1');
        $('#camposBuscarSuscripcion #spanMensaje').html('');
        $('#divListaSelección').html('');

    },
    /** Limpia toda la información del formulario y elimina información del modelo
     * @returns {void}
     */
    limpiar: function () {

        $('div#divFormasPago div#controlesFormasPago').empty();
        $('#divFechasRecaudo, #archivoAdjunto, #divConsignacion').hide();
        $('#tblFechaRecaudo tr td input:checked').attr('checked', false);
        $('#divRecaudoEmpresa, #divTotalEfectivo, #divTotalCheque').hide();

        idConsignacion = consignacionesModel.idconsignacion;
        infoEmpresa = consignacionesModel.informacionEmpresaActual;
        consignacionesModel = {
            cantBancoEfectivo: 0,
            cantBancoCheque: 0,
            numFormaPago: 0,
            formasPago: [],
            detalle: [],
            consignaciones: [],
            archivos: [],
            accionGeneral: 'I',
            detallesEliminar: [],
            idconsignacion: idConsignacion,
            informacionEmpresaActual: infoEmpresa
        };
        $('#controlesFormasPago input').val('');
        $('#txtArchivo').fileinput('reset');
        $('#tblEfectivo, #tblCheque').empty().hide();
        $('#tblBancosEfectivo, #tblBancosCheque').hide();
        $('#tblBancosEfectivo tbody, #tblBancosCheque tbody, #divArchivos').empty();
    },
    /** Valida el tipo de cuenta de una consignación
     * @returns {void}
     */
    validarTipoCuenta: function (valor) {
        if (valor == 'A') {
            return 'Ahorros';
        } else if (valor == 'C') {
            return 'Corriente';
        } else {
            return '-';
        }
    }


};
consignacionesVista.init();