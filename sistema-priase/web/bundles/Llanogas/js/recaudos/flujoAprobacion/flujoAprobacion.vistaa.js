/**
 * @fileOverview Archivo de vista y control de flujo de aprobación de consignaciones
 * @author AngélicaG.
 * @requires flujoAprobacion.control.js
 * @requires flujoAprobacion.modelo.js
 * @version 1.0.0
 */
/**
 * Objeto que hace referencia al namespace flujoVista
 * @type {Object}
 */
var that = null;
var bancos = null;
/** @namespace */
var flujoVista = {
    /** Hace referencia al último dialogo abierto en la aplicación
     * @type {object}
     */
    dialogoActual: null,
    /** Inicializa el programa de flujo de aprobación consignación, y asigna listeners a los controles
     * @returns {void}
     */
    init: function () {
        that = flujoVista;
        bancos = flujoControl.cargarBancosGlobal();
        $('#btnBuscar').on('click', that.mostrarFiltros);
        $('#btnVerRecaudoEmpresa').on('click', that.consultarDetallesRecaudo);
        $('#btnBuscarFiltro').on('click', that.filtrarConsignacion);
        $('#btnCancelar').on('click', that.cancelarConsignacion);
        $('#btnAprobar, #btnEliminar').on('click', that.aprobacionConsignacion);
        __dom.configurarCalendario('txtFechaIFiltro, #txtFechaFFiltro');
    },
    /** Abre un cuadro de dialogo con detalles de los recaudos de una consignación
     * @returns {void}
     */
    consultarDetallesRecaudo: function () {
        $('#divRecaudos').html('');
        var template = null;
        $.get('/achagua/sistema/web/bundles/Llanogas/templates/recaudoFormaPago.html', function (_template) {
            template = $(_template).filter('#tplRecaudoFactura').html();
            var info = $(Mustache.to_html(template, {recaudos: flujoModelo.detallesRecaudo}));
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
    /** Muestra dialogo para buscar consignaciones por rango de fechas, número y/o medio de pago
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
        var mensaje = $('#spanMensaje').text('');
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
            mensaje.text(__app.mensajes.seleccionarOpcion).show();
            return;
        }
        if (medioPago !== '-1') {
            if (fechaInicio === '' || fechaFin === '') {
                $('#spanMensaje').text(__app.mensajes.seleccionarFechaCorte).show();
                return;
            }
            datos.idmediopago = parseInt(medioPago);
        }
        flujoControl.buscarConsignacion(datos, that.onConsultarConsignacionCompleto);
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
                flujoModelo.consignacion = data.consignaciones;
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
                            that.limpiar();
                            var consignacion = flujoModelo.consignacion = data.consignaciones[consignacionSeleccionada.attr('data-indice')];
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
                    that.limpiar();
                    var consignacion = flujoModelo.consignacion = data.consignaciones[0];
                    $('#spanMensaje').hide();
                    that.limpiarFiltro();
                    that.dialogoActual.dialog('close');
                    that.consultarDetalleConsignacion(consignacion);
                }
                break;
        }
    },
    /** Muestra los soportes de una consignación en una lista.
     * @param {object} data - información de los soportes
     * @returns {void}
     */
    mostrarArchivosConsignacion: function () {
        var div = $('#divArchivos').empty();
        for (var i = 0; i < flujoModelo.archivosConsignacion.length; i++) {
            var info = flujoModelo.archivosConsignacion[i];
            var a = $('<a>').text(info.nombrearchivo).attr('href', info.ruta).
                    attr('target', '_blank').attr('data-id', info.idarchivo);
            var archivo = $('<div>').addClass('archivoSubido').append($('<i>').addClass('fa fa-file-pdf-o'), a);
            div.append(archivo);
        }
    },
    /** Carga la cabecera del formulario con los datos de la consignación seleccionada. Y hace petición 
     * ajax para consultar los detalles
     * @param  {object} data - El respuesta del servidor con información de la consignación seleccionada
     * @returns {void}
     */
    consultarDetalleConsignacion: function (data) {
        var tipo = (parseFloat(data.valorgasto) > 0) ? 'GA' : ((parseFloat(data.valorsobrante) > 0) ? 'SO' : 'FA');
        flujoControl.consultarDetalleConsignacion(
                {idconsignacion: data.idconsignacion},
                that.onConsultarDetalleConsignacionCompleto);
        flujoControl.consultarTercero({idmediopago: data.idmediopago}, that.consultarTerceroCompleto);
//        flujoControl.consultarTiposDocumento(
//                {tipo: tipo, iddocumento: data.iddocumento},
//                that.onConsultarTipoDocumento);

        $.ajax({
            url: 'tipo_documento/',
            data: {tipo: tipo, iddocumento: data.iddocumento},
            type: 'POST',
            success: that.onConsultarTipoDocumento
        });
        flujoModelo.idConsignacion = data.idconsignacion;
        $('#divConsignacion, #divResumen, #divSoporte').show();
        $('#txtMedioPago').val(data.mediopago);
        $('#txtSucursal').val(data.sucursal);
        $('#txtDocumento').val(data.documento);
        $('#txtFecha').val(data.fecha);
        $('#txtTotalRecaudado, #txtTotalRecaudoEmpresa').val(data.totalrecaudado).toTxtCurrency();
        $('#txtTotalConsignado').val(data.totalconsignado).toTxtCurrency();
        $('#txtFaltante').val(data.valorfaltante).toTxtCurrency();
        $('#txtSobrante').val(data.valorsobrante).toTxtCurrency();
        $('#txtGasto').val(data.valorgasto).toTxtCurrency();
        $('#txtCuentaPorPagar').val(data.valorcuentaporpagar).toTxtCurrency();
    },
    /**
     * Se carga en un combo los tipos de documento posibles según la consignación actual, si es gasto, sobrante o faltante y el documento seleccionado
     * @param {Object} data - Información enviada por el servidor de los tipos de documento
     */
    onConsultarTipoDocumento: function (data) {       
        var combo = $('#cmbTipoDocumento');
        combo.html('');
        combo.append(new Option("Seleccione una opción", -1));
        if (data.codigoRespuesta === 1) {
            __dom.llenarCombo(combo, data.tiposdocumento, 'idtipodocumento', 'tipodocumento');
        }
    },
    /** Captura la respuesta enviada por el servidor, cuando se consultan los terceros y los carga en combo.
     * @param  {object} data - El respuesta del servidor con las consignaciones que coinciden
     * @returns {void}
     */
    consultarTerceroCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(__app.mensajes.sinResultados, __app.mensajes.atencion);
                break;
            case 1:
                var cmbResponsable = $('#cmbResponsable').empty();
                cmbResponsable.append($('<option>').text('Seleccione una opción').val(-1));
                $.each(data.terceros, function (index, tercero) {
                    cmbResponsable.append($('<option>').val(tercero.idterceroresponsable).text(tercero.nombretercero + ' - ' + tercero.cedula));
                });
                break;
        }
    },
    /** Muestra toda la información de la consignación
     * @param {object} data - información de los soportes
     * @returns {void}
     */
    onConsultarDetalleConsignacionCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(__app.mensajes.sinResultados, __app.mensajes.atencion);
                break;
            case 1:
                flujoModelo.detallesConsignacion = data.consignacion.detallesconsignacion;
                flujoModelo.recaudosEmpresa = data.consignacion.consolidadoempresas;
                flujoModelo.recaudosConsignacion = data.consignacion.recaudosdetalles;
                flujoModelo.detallesRecaudo = data.consignacion.recaudosdetalles;
                flujoModelo.fechasConsignacion = data.consignacion.recaudosfechas;
                flujoModelo.archivosConsignacion = data.consignacion.archivos;

                var totalEfectivo = 0;
                var totalCheques = 0;

                flujoModelo.consignaciones = [];
                flujoModelo.cheque = [];
                flujoModelo.efectivo = [];
                that.mostrarArchivosConsignacion();
                $('#divConsignacion, #tblEfectivo, #tblCheque').show();
                for (var i = 0; i < data.consignacion.detallesconsignacion.length; i++) {
                    var detalle = data.consignacion.detallesconsignacion[i];
                    if (detalle.idformapago !== 78) {
                        totalEfectivo += parseFloat(detalle.valor);
                        flujoModelo.efectivo.push(detalle);
                        flujoModelo.cantBancoEfectivo++;
                        that.onMostrartablaConsignacion(totalEfectivo, totalCheques);
                        continue;
                    }
                    flujoModelo.cheque.push(detalle);
                    var informacion = [];
                    for (var j = 0; j < detalle.informacionadicional.length; j++) {
                        var inf = detalle.informacionadicional[j];
                        informacion.push({});
                        for (var k = 0; k < inf.length; k++) {
                            var id = inf[k].idtipificacion;
                            var valor = inf[k].informacion;
                            switch (id) {
                                case 9:
                                    var banco = flujoControl.consultarBancoPorId(valor);
                                    informacion[j].idbanco = valor;
                                    informacion[j].banco = banco ? banco.nombretercero : ' BANCO ';
                                    break;
                                case 10:
                                    informacion[j].numCuenta = valor;
                                    break;
                                case 11:
                                    informacion[j].numCheque = valor;
                                    break;
                                case 12:
                                    informacion[j].documento = valor;
                                    break;
                                case 13:
                                    informacion[j].nombre = valor;
                                    break;
                                case 31:
                                    informacion[j].valor = valor;
                                    break;

                            }
                        }
                    }
                    flujoModelo.cantBancoCheque++;
                    totalCheques += parseFloat(detalle.valor);
                    flujoModelo.consignaciones.push({
                        consignacion: detalle.iddetalleconsignacion,
                        informacionadicional: informacion
                    });
                    that.onMostrartablaConsignacion(totalEfectivo, totalCheques);
                }
                break;
        }
    },
    /**
     * Carga todas las tablas de la consignación (bancos, recaudos, fechas, efectico)
     * @param {number} totalEfectivo - Total del valor consignado en efectivo
     * @param {number} totalCheques - Total del valor consignado mediante cheques
     */
    onMostrartablaConsignacion: function (totalEfectivo, totalCheques) {
        if (flujoModelo.efectivo.length > 0) {

            fillTable('tblBancosEfectivo', 'formatoPagoEfectivo', 'flujoModelo.efectivo', 'Consignación (es) en efectivo');
            $('#divEfectivo').show();
        }
        if (flujoModelo.cheque.length > 0) {
            var tabla = fillTable('tblBancosCheque', 'formatoPagoCheque', 'flujoModelo.cheque', 'Consignación (es) en cheque');
            tabla.find('td[header="thInformacionCheque"] input[type="button"]').on('click', that.mostrarFormasPago);
            $('#divCheque').show();
        }
        fillTable('tblFechaRecaudo', 'formatoFechaRecaudo', 'flujoModelo.fechasConsignacion', 'Fechas de recaudo');
        fillTable('tblRecaudoEmpresa', 'formatoRecaudoEmpresa', 'flujoModelo.recaudosEmpresa', 'Recaudos por empresa');
        $('#txtValorFormaPagoEfectivo').val(totalEfectivo.toString().toCurrency());
        $('#txtValorFormaPagoCheque, #txtSumatoria').val(totalCheques.toString().toCurrency());
    },
    /**
     * @deprecated Ahora es cargado en la función onMostrartablaConsignacion
     */
    onConsultarRecaudoCompleto: function (data) {
        __dom.ocultarCargador();
        flujoModelo.fechasRecaudo = data.recaudos;
        $('#divCabecera').show();
        fillTable("tblFechaRecaudo", "formatoFechaRecaudo", "flujoModelo.fechasRecaudo", "Fechas de recaudo");
        $('#divFechasRecaudo').show();
        $('#tblFechaRecaudo').show();
    },
    /**
     * @deprecated Ahora es cargado en la función onMostrartablaConsignacion
     */
    onConsultarRecaudosEmpresa: function (data) {
        flujoModelo.recaudosEmpresa = data.recaudos;
        if (data.mensajeError) {
            $('#pMensajeRecaudo').text(data.mensajeError);
        } else {
            var total = 0;
            var tbl = fillTable("tblRecaudoEmpresa", "formatoRecaudoEmpresa", "flujoModelo.recaudosEmpresa", "Recaudos por empresa");
            $('#divRecaudoEmpresa').show();
            $('#divConsignacion').show();
            for (i = 0; i < flujoModelo.recaudosEmpresa.length; i++) {
                total += parseFloat(flujoModelo.recaudosEmpresa[i].valor);
            }
            $('#txtTotalRecaudoEmpresa').val(total);
            $('#txtTotalRecaudado').val(total);
            tbl.show();
        }
    },
    /** Muestra cuadro de dialogo con información de un cheque
     * @returns {void}
     */
    mostrarFormasPago: function () {
        var _this = $(this);
        var fila = _this.attr('data-id');
        var dialogo = $('#divFormasPago');
        $('div#divFormasPago div#controlesFormasPago').empty();
        that.dialogoActual = dialogo.dialogo({
            resizable: false,
            width: 800,
            position: {my: "center", at: "top+90", of: "body"},
            modal: true,
            title: 'Cheques',
            buttons: {
                Aceptar: function () {
                    dialogo.dialog('close');
                }
            }
        });
        var con = flujoModelo.consignaciones;
        for (var j = 0; j < con.length; j++) {
            if (parseInt(con[j].consignacion) === parseInt(fila)) {
                for (var i = 0; i < con[j].informacionadicional.length; i++) {
                    var cheque = con[j].informacionadicional[i];
                    that.agregarInformacionCheque(cheque);
                }
            }
        }
    },
    /** Llena la información de un cheque en cuadros de texto 
     * @param {object} cheque - Información de un cheque
     * @returns {void}
     */
    agregarInformacionCheque: function (cheque) {
        flujoModelo.formasPago.push({});
        var indice = flujoModelo.formasPago.length - 1;
        flujoModelo.formasPago[indice].indice = indice;
        var divGeneral = $('div#divFormasPago div#controlesFormasPago');

        var divCheque = $(tplCheque.replace(/{{indice}}/g, indice));
        divGeneral.append(divCheque);
        if (cheque.documento) {
            divCheque.find('button.btnSimple').remove();
            divCheque.find('input, select').attr('disabled', 'disabled');
            divCheque.find($('input[id^="txtValor"]')).val(cheque.valor);
            divCheque.find('#cmbBanco' + indice).html('<option value="' + cheque.idbanco + '">' + cheque.banco + '</option>');
            divCheque.find($('input[id^="txtDocGirador"]')).val(cheque.documento);
            divCheque.find($('input[id^="txtNombreGirador"]')).val(cheque.nombre);
            divCheque.find($('select[id^="cmbBanco"]')).val(cheque.idbanco);
            divCheque.find($('input[id^="txtNumCuenta"]')).val(cheque.numCuenta);
            divCheque.find($('input[id^="txtNumCheque"]')).val(cheque.numCheque);
        }
    },
    /** Confirma si el usuario desea aprobar/eliminar una consignación
     * @returns {void}
     */
    aprobacionConsignacion: function () {
        if (!!flujoModelo.idConsignacion) {
            var filtro = $('#divCambioConsignacion');
            var accion = $(this).attr('data-id');
            var tercero = $('#cmbResponsable');
            var tipodocumento = $('#cmbTipoDocumento');
            var faltante = parseFloat($('#txtFaltante').attr('title')) === 0;
            var sobrante = parseFloat($('#txtSobrante').attr('title')) === 0;
            var gasto = parseFloat($('#txtGasto').attr('title')) === 0;
            var cuentaporpagar = parseFloat($('#txtCuentaPorPagar').attr('title')) === 0;
            var c = accion == 'E' ? 'eliminar' : 'aprobar';
            var descripcionseven = $('#txtdescripcionseven');
            filtro.find('p span').text(c);
            if (tercero.val() === '-1') {
                tercero.focus();
                __dom.lanzarAlerta('Recuerde seleccionar el tercero responsable', __app.mensajes.atencion);
                return;
            }
            if (!(faltante && sobrante && gasto && cuentaporpagar)) {
                if (tipodocumento.val() === '-1' && accion === 'A') {
                    tipodocumento.focus();
                    __dom.lanzarAlerta('Debe seleccionar tipo de documento', __app.mensajes.atencion);
                    return;
                }
            }
            if (descripcionseven.val() === "" || descripcionseven.val() == null || descripcionseven.val() == undefined) {
                descripcionseven.focus();
                __dom.lanzarAlerta('Recuerde hacer una descripcion', __app.mensajes.atencion);
                return;
            }
            that.dialogoActual = filtro.dialogo({
                modal: true,
                width: 350,
                title: c + ' consignación',
                buttons: {
                    Aceptar: function () {
                        that.aprobarEliminar(accion);
                    },
                    Cancelar: function () {
                        that.dialogoActual.dialog('close');
                    }
                }
            });
        }
    },
    /** Confirma si el usuario desea aprobar/eliminar una consignación
     * @returns {void}
     */
    aprobarEliminar: function (accion) {
        var tercero = $('#cmbResponsable').val();
        var idtipodocumento = $('#cmbTipoDocumento').val();
        var faltante = parseFloat(flujoModelo.consignacion.valorfaltante);
        var sobrante = parseFloat(flujoModelo.consignacion.valorsobrante);
        var gasto = parseFloat(flujoModelo.consignacion.valorgasto);
        var cuentaporpagar = parseFloat(flujoModelo.consignacion.cuentaporpagar);
        var descripcionseven = $('#txtdescripcionseven').val();
        if (accion === 'E' || (faltante === 0 && sobrante === 0 && gasto === 0 && cuentaporpagar == 0)) {
            flujoControl.aprobacionConsignacion(
                    {accion: accion,
                        idterceroresponsable: tercero,
                        idconsignacion: flujoModelo.idConsignacion}, that.onAprobarEliminarCompleto);
        } else if (accion === 'A') {
            var obj = {accion: accion,
                idconsignacion: flujoModelo.idConsignacion,
                idterceroresponsable: tercero,
                idtipodocumento: idtipodocumento,
                descripcionseven: descripcionseven
            };
            flujoControl.aprobacionConsignacion(obj, that.onAprobarEliminarCompleto);
        }
        that.dialogoActual.dialog('close');
    },
    /** Captura la respuesta del servidor, cuando se aprueba/elimina una consignación
     * @param {object} data - Confirmación de la eliminación-aprobación.
     * @returns {void}
     */
    onAprobarEliminarCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                break;
            case 1:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion, function () {
                    location.reload();
                });

        }
    },
    /** Confirma si el usuario desea cancelar la operación actual
     * @returns {void}
     */
    cancelarConsignacion: function () {
        if (!!flujoModelo.consignacion) {
            $('div#divConfirmCancelar').dialogo({
                resizable: false,
                heigth: 140,
                modal: true,
                title: 'Cancelar la operación',
                buttons: {
                    "Sí": function () {
                        $(this).dialog('close');
                        location.reload();
                    }, Cancelar: function () {
                        $(this).dialog("close");
                    }
                }
            });
        }
    },
    /** Limpia el formulario de búsqueda de consignación.
     * @returns {void}
     */
    limpiarFiltro: function () {
        $('#camposBuscarSuscripcion input[type="text"]').val('');
        $('#camposBuscarSuscripcion select').val('-1');
        $('#camposBuscarSuscripcion #spanMensaje').html('');
        $('#divListaSelección').html('');
        $('#txtdescripcionseven').val('');

    },
    /** Limpia toda la información del formulario y elimina información del modelo
     * @returns {void}
     */
    limpiar: function () {
        $('input[type="text"]').val('');
        $('#divEfectivo, #divCheque').hide();
        $('#divRecaudos, #divArchivos').empty();
        $('#tblBancosEfectivo, #tblBancosCheque').empty();
        $('#txtdescripcionseven').val('');
        flujoModelo = {
            formasPago: []
        };
    },
    /** Valida el tipo de cuenta de una consignación
     * @returns {void}
     */
    validarTipoCuenta: function (valor) {
        if (valor === 'A') {
            return 'Ahorros';
        } else if (valor === 'C') {
            return 'Corriente';
        } else {
            return '-';
        }
    }
};
flujoVista.init();
