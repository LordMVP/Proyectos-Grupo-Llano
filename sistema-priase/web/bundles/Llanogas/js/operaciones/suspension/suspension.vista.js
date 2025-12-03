/**
 * @fileOverview Archivo de vista y control de registro de ventas
 * @author Manuel Bonilla
 * @requires suspension.control.js
 * @requires suspension.model.js
 * @version 1.2.0
 */

/**
 * Objeto que hace referencia al namespace suspensionVista
 * @type {Object}
 */
var that = null;
/** @namespace */
var suspensionVista = {
    dialogoActual: null,
    /** Ciclo - Período actual para la suspensión
     * @type {Object}
     */
    cicloPeriodoActual: {},
    /** Objeto con información del detalle seleccionado
     * @type {Object}
     */
    detalleSeleccionado: {},
    /** Objeto con información de la reconexión seleccionada
     * @type {Object}
     */
    reconexionSeleccionada: {},
    /** Objeto con información obtenida en el filtro
     * @type {Object}
     */
    jsonResultadoFiltrar: {},
    //variable de control para llevar la cuenta de las suspensiones que se han visualizado
    pos: 0,
    /**
     * Inicializa el programa para gestión de suspensiones y reconexiones y asigna listeners a controles.
     * @returns {void}
     */
    init: function () {
        that = suspensionVista;

        //se configura un JSON con los eventos que se disparán en el evento clic de la botonera superior
        var eventos = {
            'nuevo': that.nuevaSuspension,
            'grabar': that.grabarNuevaSuspension,
            'primero': that.consultarOrdenSuspension,
            'anterior': that.consultarOrdenSuspension,
            'siguiente': that.consultarOrdenSuspension,
            'ultimo': that.consultarOrdenSuspension,
            'filtrar': that.visualizarFiltroSuscripciones,
            'eliminar': ''
        };
        __dom.configurarBotonera(eventos);
        __app.vistaActual = suspensionVista;
        __app.controlActual = suspensionControl;
        __app.modelo = suspensionModel;
        //Configura cajas de texto numéricas
        __dom.configurarTextoNumerico('txtLecturaSus, #txtLecturaRec, #txtValorTotalRec, #txtValorTotalSus');
        __dom.configurarTextoNumerico('txtFiltroSuscripcion, #txtFiltroCodigoAnterior, #txtFiltroDocumento'); //FiltroDocumento a evaluar BACKEND recibe sólo números
        __dom.configurarCalendarioTiempo('txtFechaProgramacionSus, #txtFechaEjecucionSus, #txtFechaGeneracionNuevaSus, ' +
                '#txtFechaAprobacionRec, #txtFechaEjecucionRec, #txtFechaProgramacionRec,' +
                '#txtFechaProcesamientoNuevaSus');

        $('#txtFechaProgramacionSus, #txtFechaProgramacionRec').on('change', that.configurarFechas);
        that.cargarCombosDetalleSuspension();
        that.cargarAutocompleteMunicipio();
        that.configurarAutocomplete();
        that.configurarFechas();
        $('#btnVerMasDetallesSuscripcion').on('click', that.verMasDetallesSuscripcion);
        $("#btnVerMasDetallesSuspension").on('click', that.verDetallesSuspension).attr("disabled", true);
        $('#btnNuevoDetaleSuspension').on('click', that.onSuspensionDetalles);
        $('#btnNuevaReconexion').on('click', that.onReconexionDetalles);
        $('#txtLecturaSus, #txtLecturaRec, #txtValorTotalRec').focus(that.limpiarCamposSusRex);
        $('table#tblSuspensiones, #tblReconexiones').hide();

        $('select#txtNovedadSuspensionSus').on('change', that.cambiarNovedadSuspension);
        $('select#txtNovedadReconexionRec').on('change', that.cambiarNovedadReconexion);
        $('select#txtMotivoSuspensionRec').change(function () {
            suspensionModel.currentIdMotivoRec = $(this).val();
        });
        $('select#txtMotivoSuspensionSus').change(function () {
            suspensionModel.currentIdMotivo = $(this).val();
        });
        $('div#camposBuscarSuscripcion').on('dialogclose', function () {
            $("div#camposBuscarSuscripcion").find('p').text(' ');
            $('div#divFiltroSuspensionesResultado').empty();
        });
    },
    /** Configura la fecha de fin para que no sea inferior a la fecha de incio
     * @returns {void}
     */
    configurarFechas: function () {
        var _this = $(this);
        var fechaactualSuspension = new Date($('#txtFechaactualSuspension').val());
        fechaactualSuspension.setDate(fechaactualSuspension.getDate() + 1);
        console.log(" Validacion Fecha Suspension :" + fechaactualSuspension);
        $('#txtFechaProgramacionRec').datetimepicker({
            minDate: fechaactualSuspension,
            lang: 'es'
        });
        var fechaactualReconexion = new Date($('#txtFechaactualSuspension').val());
        fechaactualReconexion.setDate(fechaactualReconexion.getDate() + 1);
        console.log(" Validacion Fecha Reconexion :" + fechaactualReconexion);
        $('#txtFechaProgramacionSus').datetimepicker({
            minDate: fechaactualReconexion,
            lang: 'es'
        });

        //var minDate = new Date(_this.val());
        if (_this.attr('id') === 'txtFechaProgramacionSus') {
            if (_this.val() === '') {
                _this.val($('#txtFechaActual').val());
            }
            var minDate = _this.val().split(' ');
            console.log(" Validacion Fecha Ejecucion :" + minDate[0]);
            $('#txtFechaEjecucionSus').datetimepicker('destroy');
            $('#txtFechaEjecucionSus').datetimepicker({
                minDate: minDate[0],
                lang: 'es'
            });
        } else if (_this.attr('id') === 'txtFechaProgramacionRec') {
            if (_this.val() === '') {
                _this.val($('#txtFechaActual').val());
            }
            var minDate = _this.val().split(' ');
            $('#txtFechaEjecucionRec').datetimepicker('destroy');
            $('#txtFechaEjecucionRec').datetimepicker({
                minDate: minDate[0],
                lang: 'es'
            });

        }

    },
    /** Limpia toda la información de suspensión y reconexión
     * @returns {void}
     */
    limpiarCamposSusRex: function () {
        if ($(this).val() === ' - ') {
            $(this).val('');
        }
    },
    /** Controla la navegación entre los encabezados de suspensión
     * @returns {void}
     */
    consultarOrdenSuspension: function () {
        var _this = $(this);
        var cant = __app.modelo.cabeceraSuspensiones.length;
        suspensionModel.accionEncabezado = 'C';
        if (cant > 1) {
            switch (_this.attr('id')) {
                case 'btnPrimero':
                    suspensionVista.pos = 0;
                    break;
                case 'btnAnterior':
                    if (suspensionVista.pos > 0) {
                        suspensionVista.pos--;
                    }
                    break;
                case 'btnSiguiente':
                    if (suspensionVista.pos < cant - 1) {
                        suspensionVista.pos++;
                    }
                    break;
                case 'btnUltimo':
                    suspensionVista.pos = cant - 1;
                    break;
            }
            $("#lbCantidadSuspensiones").text((suspensionVista.pos + 1) + " / " + cant + " suspensiones");
            suspensionVista.renderSuspensionVista();
        }
    },
    /** Carga los datos de la suspensión en la cabecera del formulario
     * @returns {void}
     */
    renderSuspensionVista: function () {
        var suspension = __app.modelo.cabeceraSuspensiones[suspensionVista.pos];
        suspensionVista.verSuspension(suspension);
        that.limpiarTablaDetallesConexion();
        that.limpiarTablaReconexion();
        //$('select#cmbEstadoNuevaSus').attr('value', suspension.estado);
        $('select#cmbEstadoNuevaSus').val(suspension.estado);
        $('input#txtCicloNuevaSus').val(suspension.ciclo);
        $('input#txtPeriodoNuevaSus').val(suspension.periodo);
        $('input#txtFechaGeneracionNuevaSus').val(suspension.fechageneracion);
        $('input#txtFechaGeneracionNuevaSus').val(suspension.fechageneracion);
        $('input#txtFechaAprobacionNuevaSus').val(suspension.fechaaprobacion);
        $('input#txtFechaProcesamientoNuevaSus').val(suspension.fechaprocesamiento);
        $('textarea#txtObservacionesNuevaSus').val(suspension.observacion);
    },
    /** Hace petición ajax para filtrar una suscripción según los parámetros digitados
     * @returns {void}
     **/
    buscarSuscripciones: function () {
        var divFiltrar = $("div#camposBuscarSuscripcion");
        var txtFiltroSuscripcion = divFiltrar.find('#txtFiltroSuscripcion');
        var txtFiltroDocumento = divFiltrar.find('#txtFiltroDocumento');
        var txtFiltroCodigoAnterior = divFiltrar.find('#txtFiltroCodigoAnterior');
        var btnFinalizar = divFiltrar.find("#btnFinalizarBuscarSuscripcion");
        var divFiltroSuspensionesResultado = $("div#divFiltroSuspensionesResultado");
        if (suspensionModel.idMunicipio === "" || !suspensionModel.idMunicipio) {
            $('#spanMensaje').text(__app.mensajes.seleccionarMunicipio).show();
        } else {
            if ($.trim(txtFiltroSuscripcion.val()) === "" && $.trim(txtFiltroDocumento.val()) === "" && $.trim(txtFiltroCodigoAnterior.val()) === "") {
                $('#spanMensaje').text(__app.mensajes.camposInvalidosFiltro).show();
            } else {
                var idsus = !isNaN(parseInt(txtFiltroSuscripcion.val())) ? parseInt(txtFiltroSuscripcion.val()) : '';
                var jsonParametros = {
                    'idsuscripcion': idsus,
                    'codanterior': txtFiltroCodigoAnterior.val(),
                    'documento': txtFiltroDocumento.val(),
                    'municipio': suspensionModel.idMunicipio
                };
                if ((jsonParametros.municipio !== undefined || jsonParametros.municipio !== null)) {
                    suspensionControl.consultarSuscripciones(jsonParametros, that.onConsultarSuscripcionCompleto);
                    btnFinalizar.hide();
                    divFiltroSuspensionesResultado.html('');
                }
            }
        }
    },
    /**
     * Captura la respuesta del servidor cuando se consulta una suscripción
     * @param {object} data - Respuesta del servidor con suscripciones que coincidan con los parámetros de búsqueda
     * @returns {void}
     **/
    onConsultarSuscripcionCompleto: function (data) {
        $('#camposBuscarSuscripcion input:text').val('');
        that.limpiarDatosEncabezado();
        suspensionModel.idMunicipio = '';
        switch (parseInt(data.codigoRespuesta)) {
            case 0:
                $('#spanMensaje').text(__app.mensajes.sinResultados, __app.mensajes.atencion).show();
                break;
            case 1:
                suspensionModel.suscripcion = data.datos;
                if (data.datos.length > 1) {
                    $('#divFiltroSuspensionesResultado').empty();
                    var divSuscripciones = $('<div>').addClass('listaSeleccion');
                    $.each(data.datos, function (index, suscripcion) {
                        var div = $('<div>');
                        var radio = $('<input type="radio">');
                        var label = $('<label>');
                        radio.val(suscripcion.idsuscripcion);
                        radio.attr('id', 'radio_susc_' + index);
                        radio.attr('data-indice', index);
                        radio.attr('name', 'radio_suscripciones');
                        label.attr('for', 'radio_susc_' + index);
                        label.text(suscripcion.documento + ' - ' + suscripcion.nombre + ' - ' + suscripcion.idsuscripcion);
                        div.append(radio).append(label);
                        divSuscripciones.append(div);
                    });
                    var btn = $('<button>').text('Finalizar').addClass('btnSimple');
                    btn.on('click', function () {
                        var suscSeleccionada = $('input[name="radio_suscripciones"]:checked');
                        if (suscSeleccionada.length > 0) {
                            var suscripcion = suspensionModel.suscripcion = data.datos[suscSeleccionada.attr('data-indice')];
                            $('#spanMensaje').hide();
                            divSuscripciones.remove();
                            suspensionModel.idSuscripcion = suscripcion.idsuscripcion;
                            suspensionModel.currentIdPropiedad = suscripcion.idpropiedad;
                            that.limpiarFormulario();
                            that.dialogoActual.dialog('close');
                            that.cargarCabecera(suscripcion);
                            suspensionVista.verSuspensiones(suscripcion.idsuscripcion);
                        } else {
                            $('#spanMensaje').text(__app.mensajes.seleccionarOpcion).show();
                        }
                    });
                    divSuscripciones.append(btn);
                    $('#divFiltroSuspensionesResultado').append(divSuscripciones);
                } else {
                    var suscripcion = suspensionModel.suscripcion = data.datos[0];
                    $('#spanMensaje').hide();
                    suspensionModel.idSuscripcion = suscripcion.idsuscripcion;
                    suspensionModel.currentIdPropiedad = suscripcion.idpropiedad;

                    that.limpiarFormulario();
                    that.dialogoActual.dialog('close');
                    that.cargarCabecera(suscripcion);
                    suspensionVista.verSuspensiones(suscripcion.idsuscripcion);
                }
                break;
            case 2:
                pMensaje.text(__app.mensajes.sinResultados);
                break;
        }
    },
    /** Carga la información de la suscripción actual y consulta el encabezado de suspensióon de la suscripción actual
     * @param {Object} suscripcion - Información de la suscripción buscada
     * @returns {void}
     **/
    cargarCabecera: function (suscripcion) {
        var div = $("div#divCabecera");
        suspensionControl.consultarCicloPeriodo({idsuscripcion: suscripcion.idsuscripcion}, function (data) {
            if (data.codigoRespuesta > 0) {
                that.cicloPeriodoActual = data.datos[0];
            } else {
                $("#lbCantidadSuspensiones").text('');

                $('#tblSuspensiones, #tblReconexiones').empty();
                __dom.lanzarAlerta('La suscripción no tiene un ciclo - período actual, intente nuevamente',
                        __app.mensajes.atencion,
                        function () {
                            that.limpiarFormulario();
                            $("#divDetalles").hide();
                            suspensionModel.idSuscripcion = null;
                        });
                return;

            }
        });
        var ciclo = that.cicloPeriodoActual;
        $("#divDetalles").hide();
        $('#txtCicloNuevaSus').val(ciclo.ciclo);
        $('#txtPeriodoNuevaSus').val(ciclo.periodo);
        div.find('#txtSuscripcion').val(suscripcion.idsuscripcion);
        div.find('#txtDocumento').val(suscripcion.documento);
        div.find('#txtNombre').val(suscripcion.nombre);
        div.find('#txtTipUso').val(suscripcion.tipouso);
        div.find('#txtConvenio').val(suscripcion.convenio);
        $("div#divFiltroSuspensionesResultado").empty();
        $('#tblSuspensiones, #tblReconexiones').empty().hide();
        $('#btnVerMasDetallesSuspension').attr("disabled", false);

    },
    /** Hace petición ajax para consultar los encabezados de una suscripción
     * @param {int} idSuscripcion - id de la suscripción buscada
     * @returns {void}
     **/
    verSuspensiones: function (idSuscripcion) {
        suspensionControl.consultarSuspensiones({'idsuscripcion': idSuscripcion}, function (data) {
            if (data.codigoRespuesta <= 0) {
                $("#lbCantidadSuspensiones").text("La suscripción no tiene suspensiones registradas");
                suspensionModel.cabeceraSuspensiones = null;
                $('#tblSuspensiones, #tblReconexiones').empty();
                $('#btnVerMasDetallesSuspension').attr('disabled', true);
            } else {
                suspensionVista.pos = data.datos.length - 1;
                $("#lbCantidadSuspensiones").text(data.datos.length + " / " + data.datos.length + " suspensiones");
                suspensionModel.cabeceraSuspensiones = data.datos;
                that.renderSuspensionVista();
            }
        });
    },
    /** Carga la información del encabezado seleccionado
     * @param {object} suspension - Información del encabezado seleccionado
     * @returns {void}
     **/
    verSuspension: function (suspension) {
        $("#txtCicloNuevaSus").val(suspension.ciclo);
        $("#txtPeriodo").val(suspension.periodo);
        $("#txtFechaGeneracionNuevaSus").val(suspension.fechageneracion);
        $("#txtFechaAprobacionNuevaSus").val(suspension.fechaaprobacion);
        $("#txtFechaProcesamientoNuevaSus").val(suspension.fechaprocesamiento);
        $("#txtObservacionesNuevaSus").val(suspension.observaciones);
        $("#cmbEstadoNuevaSus").val(suspension.estado);
        suspensionModel.suspensionSeleccionada = suspension;
        suspensionModel.idSuspensionSeleccionada = suspension.idsuspension;
    },
    /** Hace petición ajax para consultar los detalles de suspensión de un encabezado
     * @returns {void}
     **/
    verDetallesSuspension: function () {
        var suspension = suspensionModel.suspensionSeleccionada;
        if (!!suspension && suspension.idSuspension != -1) {
            suspensionControl.consultarDetallesSuspensiones({idsuspension: suspension.idsuspension}, function (data) {
                switch (parseInt(data.codigoRespuesta)) {
                    case 1:
                        $.each(data.datos, function (i, item) {
                            var motivo = suspensionVista.obtenerMotivo(item.idmotivosuspension);
                            item.motivoSuspension = motivo;
                            if (item.idnovedadsuspension !== null) {
                                var novedadSuspension = suspensionVista.obtenerNovedades(item.idnovedadsuspension);
                                item.novedadSuspension = novedadSuspension;
                            }
                        });
                        suspensionVista.verTablaDetallesSuspensiones(data);
                    default:
                        $("#divDetalles").show();
                        break;
                }
                //suspensionVista.verDetallesReconexiones();
                $('#btnVerMasDetallesSuspension').attr("disabled", true);
            });
        }
    },
    /** Hace petición ajax para consultar la información los detalles de reconexión del encabezado
     * @returns {void}
     **/
    verDetallesReconexiones: function () {
        var suspension = suspensionModel.suspensionSeleccionada;
        suspensionVista.verTablaDetallesReconexiones(
                suspensionControl.consultarDetallesReconexiones({'idsuspension': suspension.idsuspension}));
    },
    /** Hace petición ajax para consultar detalles de la suscripción seleccionada
     * @returns {void}
     **/
    verMasDetallesSuscripcion: function () {
        if (!!suspensionModel.idSuscripcion) {
            suspensionControl.consultarDetalleSuscripcion(
                    {'idSuscripcion': suspensionModel.idSuscripcion},
                    function (data) {
                        var info = data.datos[0];
                        var div = $("div#divDetallesSuspenciones");
                        div.find('#txtSuscripcionDetalle').val(suspensionModel.idSuscripcion);
                        div.find('#txtDocumentoDetalle').val(info.documento);
                        div.find('#txtNombreDetalle').val(info.nombre);
                        div.find('#txtCodigoDetalle').val(info.codanterior);
                        div.find('#txtTipoSuscripcionDetalle').val(info.tiposuscripcion);
                        div.find('#txtTipoLiquidacionDetalle').val(info.tipoliquidacion);
                        div.find('#txtPropiedadDetalle').val(info.propiedad);
                        div.find('#txtCodPropiedad').val(info.codpropiedad);
                        that.dialogoActual = div.dialogo({
                            modal: true,
                            width: 960,
                            title: 'Detalle suscripción',
                            buttons: {
                                'Aceptar': function () {
                                    div.dialog('close');
                                }
                            }

                        });
                    });
        }
    },
    /** Configura cajas de texto para agregar un nuevo encabezado
     * @returns {void}
     **/
    nuevaSuspension: function () {
        suspensionModel.accionEncabezado = 'N';
        if (suspensionModel.idSuscripcion > 0) {
            //var fechaActual = new Date(); -- Se reemplaza fecha del cliente por fecha del servidor
            var fechaActual = __app.obtenerFechaSistema();
            var mes = (fechaActual.getMonth() + 1).toString();
            mes = (mes.length < 2 ? "0" + mes : mes);
            var dia = (fechaActual.getDay() + 1).toString();
            dia = (dia.length < 2 ? "0" + dia : dia);
            var hora = fechaActual.getHours();
            var min = fechaActual.getMinutes().toString();
            min = (min.length < 2 ? "0" + min : min);
            var sec = fechaActual.getSeconds().toString();
            sec = (sec.length < 2 ? "0" + sec : sec);
            var fecha = fechaActual.getFullYear() + "-" + mes + "-" + dia + " " + hora + ":" + min + ":" + sec;
            //$('select#cmbEstadoNuevaSus').prop("disabled", false);
            $('textarea#txtObservacionesNuevaSus').prop("disabled", false).val("");
            $('input#txtFechaAprobacionNuevaSus, #txtFechaProcesamientoNuevaSus').val('');
            $('input#txtFechaGeneracionNuevaSus').prop("disabled", false).val(fecha);
        } else {
            __dom.lanzarAlerta(__app.mensajes.seleccionarSuscripcion, __app.mensajes.atencion);
        }
    },
    /**
     * Valida la información del nuevo encabezado y hace petición ajax para enviar la información del nuevo encabezado
     * @returns {void}
     **/
    grabarNuevaSuspension: function () {
        that.bloquearCamposSuspension();
        if (suspensionModel.idSuscripcion > 0 && suspensionModel.accionEncabezado === 'N') {
            var estado = ($('select#cmbEstadoNuevaSus').val() !== '0') ? $('select#cmbEstadoNuevaSus').val() : null;
            var observacion = ($('textarea#txtObservacionesNuevaSus').val() !== '') ? $('textarea#txtObservacionesNuevaSus').val() : null;
            var fechaGenerada = ($('input:text#txtFechaGeneracionNuevaSus').val() !== '') ? $('input#txtFechaGeneracionNuevaSus').val() : null;
            if (estado !== null && fechaGenerada !== null && observacion !== null) {
                var data = {
                    estado: estado,
                    observaciones: observacion,
                    fechageneracion: fechaGenerada,
                    idsuscripcion: suspensionModel.idSuscripcion,
                    idpropiedad: suspensionModel.currentIdPropiedad,
                    cicanio: that.cicloPeriodoActual.cicloanio,
                    fechaaprobacion: ($('input:text#txtFechaAprobacionNuevaSus').val() !== '') ? $('input:text#txtFechaAprobacionNuevaSus').val() + "" : null,
                    fechaprocesamiento: ($('input:text#txtFechaProcesamientoNuevaSus').val() !== '') ? $('input:text#txtFechaProcesamientoNuevaSus').val() + "" : null
                };
                suspensionControl.insertarNuevaSuspension(data, that.onGrabarNuevaSuspensionCompleto);
            } else {
                __dom.lanzarAlerta('Debe diligenciar los siguientes campos: <b>Estado</b>,' +
                        ' <b>Fecha de Generación</b>, <b>Observaciones</b>', __app.mensajes.atencion);
            }
        } else {
            __dom.lanzarAlerta('Debe seleccionar una suscripción y diligenciar el nuevo encabezado.', __app.mensajes.atencion);
        }
    },
    /**
     * Captura la respuesta del servidor para verificar si se guardó correctamente el encabezado y se pueden agregar detalles de suspensión
     * @param {object} data - Respuesta del servidor con id del encabezado creado
     * @returns {void}
     **/
    onGrabarNuevaSuspensionCompleto: function (data) {
        switch (parseInt(data.codigoRespuesta)) {
            case 1:
                suspensionModel.suspensionSeleccionada.idSuspension = data.datos;
                __dom.lanzarAlerta(data.mensaje, 'Creación Suspensión');
                suspensionVista.verSuspensiones(suspensionModel.idSuscripcion);
                $("#divDetalles").show();
                break;
        }
    },
    /** Deshabilita campos del encabezado para que sean de consulta
     * @returns {void}
     **/
    bloquearCamposSuspension: function () {
        $('#cmbEstado').prop("disabled", true);
        $('#txtCiclo').prop("disabled", true);
        $('#txtPeriodo').prop("disabled", true);
        $('#txtFechaGeneracion').prop("disabled", true);
        $('#txtFechaAprobacion').prop("disabled", true);
        $('#txtFechaProcesamiento').prop("disabled", true);
        $('#txtObservaciones').prop("disabled", true);
    },
    /** Carga la información de los detalles de suspensión de un encabezado
     * @param {object} detalles - Información de los detalles de suspensión
     * @returns {void}
     **/
    verTablaDetallesSuspensiones: function (detalles) {
        if (detalles.codigoRespuesta !== 0) {
            __app.modelo.detallesSuspensionesTabla = detalles.datos; //IMPORTANTE
            if ($('#tblSuspensiones').css('visibility') === 'hidden') {
                $('table#tblSuspensiones').css('visibility', 'visible');
            }
            var _tabla = fillTable('tblSuspensiones', '__app.modelo.formatoDetallesSuspension', '__app.modelo.detallesSuspensionesTabla', '').show();
            _tabla.find('td[header="thVer"] input[type="button"]').on('click', that.onSuspensionDetalles);
            _tabla.find('td[header="thEditar"] input[type="button"]').on('click', that.onSuspensionDetalles);
            _tabla.find('td[header="thEliminar"] input[type="button"]').on('click', that.onSuspensionDetalles);
            _tabla.find('td[header="thHabilitar"] input[type="button"]').on('click', that.onSuspensionDetallesHabilitar);
        }
    },

    onSuspensionDetallesHabilitar: function () {
        var este = $(this);
        var idDetalle = este.attr('id');
        var posicionDetalle = parseInt(idDetalle.substring(idDetalle.length - 1, idDetalle.length));
        var detalleObtenido = suspensionModel.detallesSuspensionesTabla[posicionDetalle];

        that.detalleSeleccionado = este.attr('data-id');
        if (suspensionModel.suspensionSeleccionada.estado !== 'A') {
            __dom.lanzarAlerta('El encabezado debe estar en estado activo para Habilitar', __app.mensajes.atencion);
            return;
        }
        var datos = {
            idsuspension: suspensionModel.suspensionSeleccionada.idsuspension,
            idregistrodetalle: detalleObtenido.iddetallesuspension,
            accion: 'ss'
        }

        suspensionControl.habilitarSSRX(datos, function (datos) {
            that.validarEdicionSuspension(datos, este.parent().parent())
        })
    },

    validarEdicionSuspension: function (datos, fila) {

        switch (datos.codigoRespuesta) {
            case 1:
                var id = fila.attr('data-fila');
                //debugger;
                fila.find('td[header="thFechaEjecucion"]').text('');
                suspensionModel.detallesSuspensionesTabla[parseInt(id)].fechaejecucion = null;
                __dom.lanzarAlerta(datos.mensaje, __app.mensajes.atencion);
                break;
            case - 1:
                __dom.lanzarAlerta(datos.mensaje, 'Error');
        }
    },
    /** Abre cuadro de diálogo para hacer la gestión del CRUD de los detalles de la suspensión, la gestión se hace
     * a partir del texto de los botones que se pueden presionar en la fila de los detalles de suspensión
     * @returns {void}
     **/
    onSuspensionDetalles: function () {
        if (suspensionModel.suspensionSeleccionada.idsuspension === -1) {
            __dom.lanzarAlerta('Debe grabar una suspensión primero, y luego generar detalle de suspension', 'Error');
            return;
        }
        that.limpiarCamposDetallesSuspension();
        var este = $(this);
        var idDetalle = este.attr('id');
        var posicionDetalle = parseInt(idDetalle.substring(idDetalle.length - 1, idDetalle.length));
        var detalleObtenido = suspensionModel.detallesSuspensionesTabla[posicionDetalle];
        that.detalleSeleccionado = este.attr('data-id');
        if (suspensionModel.suspensionSeleccionada.estado !== 'A' && este.val() !== 'Ver') {
            __dom.lanzarAlerta('El encabezado debe estar en estado activo', __app.mensajes.atencion);
            return;
        }


        if (detalleObtenido === undefined) {
            // Cuando no hay detalles de suspensión en la posición actual
            var diagNuevo = $('div#camposVerEditarDetSuspencion');
            that.bloquearCamposDetallesSuspension();
            that.desbloquearCamposNuevoDetalleSuspension();
            diagNuevo.dialogo({
                modal: true,
                width: 700,
                title: 'Nuevo detalle Suspensión',
                buttons: {
                    Guardar: that.resultadoNuevoDetalleSuspension,
                    Cerrar: that.resultadoVerDetalleSuspension
                }
            });
        } else {
            var botones = {};
            var editar = true;
            // <editor-fold desc="Valida la acción a realizar y configura el diálogo según sea el caso" defaultstate="collapsed">
            switch (este.val()) {
                case 'Nuevo Detalle Suspensión':
                    that.bloquearCamposDetallesSuspension();
                    that.desbloquearCamposNuevoDetalleSuspension();
                    botones.Guardar = that.resultadoNuevoDetalleSuspension;
                    break;
                case 'Ver':
                    that.bloquearCamposDetallesSuspension();
                    that.asignarCamposDetallesSuspension(detalleObtenido, 'V');
                    break;
                case 'Editar':
                    if (detalleObtenido.fechaejecucion === undefined || detalleObtenido.fechaejecucion === null || detalleObtenido.fechaejecucion === ' - ') {
                        that.desbloquearCamposDetallesSuspension();
                        that.asignarCamposDetallesSuspension(detalleObtenido);
                        that.detalleSeleccionado = detalleObtenido;
                        botones.Guardar = that.resultadoEditarDetalleSuspension;
                    } else {
                        __dom.lanzarAlerta('La suspensión tiene fecha de ejecución, no es posible editarla', 'Advertencia');
                        editar = false;
                    }
                    break;
                case 'Eliminar':
                    if (detalleObtenido.fechaejecucion === undefined || detalleObtenido.fechaejecucion === null || detalleObtenido.fechaejecucion === ' - ') {
                        __dom.lanzarAlerta('Se eliminará el detalle de suspensión ¿Desa eliminarlo?',
                                __app.mensajes.atencion,
                                function () {
                                    that.resultadoEliminarDetalleSuspension(detalleObtenido);
                                },
                                function () {
                                    //that.resultadoVerDetalleSuspension();
                                }
                        );
                    } else {
                        __dom.lanzarAlerta('El detalle de la suspensión tiene fecha de ejecución, no es posible eliminarla', 'Advertencia');
                    }
                    break;
            }
            //</editor-fold>
            if (este.val() !== 'Eliminar' && editar) {
                botones.Cerrar = that.resultadoVerDetalleSuspension;
                var diagNuevo = $('div#camposVerEditarDetSuspencion');
                diagNuevo.dialogo({
                    modal: true,
                    width: 700,
                    title: este.val().length <= 6 ? este.val() + ' Detalle de Suspensión' : este.val(),
                    buttons: botones
                });
            }

        }

    },
    /** Cierra cuadro de diálogo de gestión de detalle de suspensión.
     * @returns {void}
     **/
    resultadoVerDetalleSuspension: function () {
        $('div#camposVerEditarDetSuspencion').dialog('close');
    },
    /** Valida la información del detalle de suspensión que se está editando y en caso de ser correcta
     * es agregada al modelo y  recarga la tabla
     * @returns {void}
     **/
    resultadoEditarDetalleSuspension: function () {
        if ($('select#txtMotivoSuspensionSus').val() == 102 && $('input:radio[name=txtEjecutadaSus]:checked').attr("title") === 'S' && 
                ($('#txtNovedadSuspensionSus').val() == 1031 || $('#txtNovedadSuspensionSus').val() == 1032)) {
                var suscripcion = {
                    idSuscripcion: $('#txtSuscripcion').val()
                }
            suspensionControl.getInfFacturaFinancia(suscripcion, function(datos){
                
                if(parseInt(datos.codigoRespuesta) == -1){
                    __dom.lanzarAlerta("Cliente tiene Facturas ó Financiaciones con Saldo","Error");
                    return;
                }else{
                    that.respuestaFinanciaFactura();
                }
            });
        }
        else{
            that.respuestaFinanciaFactura();
        }
    },
    /**
     * Valida la información del detalle de suspensión que se agregará y en caso de ser correcta
     * es agregada al modelo y  recarga la tabla
     * @returns {void}
     **/
    resultadoNuevoDetalleSuspension: function () {
        if (suspensionModel.suspensionSeleccionada.estado !== 'A') {
            __dom.lanzarAlerta('El encabezado debe estar en estado activo', __app.mensajes.atencion);
            return;
        }
        if ( ($('#txtFechaProgramacionSus').val().trim() === '') || (suspensionModel.currentIdMotivo === '-1') || !suspensionModel.currentIdMotivo) {
            __dom.lanzarAlerta('Debe diligenciar los siguientes campos: <b>Motivo</b>, <b>Empresa Suspensión</b> y <b>Fecha Progamación</b>', __app.mensajes.atencion);
            return;
        }

        var data = {
            idsuspension: suspensionModel.suspensionSeleccionada.idsuspension,
            idmotivosuspension: (suspensionModel.currentIdMotivo !== 0) ? suspensionModel.currentIdMotivo : null,
            idnovedadsuspension: ($('#txtNovedadSuspensionSus').val() !== '-1') ? $('#txtNovedadSuspensionSus').val() : null,
            idtiposuspension: ($('#txtTipoSuspensionSus').val() !== '-1') ? $('#txtTipoSuspensionSus').val() : null,
            idtercerosuspension: ($('#idTerceroSuspensionSus').val() !== '-1') ? $('#idTerceroSuspensionSus').val() : null,
            lectura: ($('#txtLecturaSus').val() !== '') ? $('#txtLecturaSus').val() : null,
            fechaprogramacion: ($('#txtFechaProgramacionSus').val() !== '' || $('#txtFechaProgramacionSus').val() !== ' - ') ? $('#txtFechaProgramacionSus').val() : null,
            fechaejecucion: ($('#txtFechaEjecucionSus').val() !== '' || $('#txtFechaEjecucionSus').val() !== ' - ') ? $('#txtFechaEjecucionSus').val() : null,
            observacion: ($('#txtObservacionesSus').val() !== '') ? $('#txtObservacionesSus').val() : null,
            idconceptosuspension: ($("#txtConceptoSuspensionSus").val() !== '-1') ? $("#txtConceptoSuspensionSus").val() : null
        };
        var result = __app.controlActual.nuevoDetalleSuspension(data);
        if (result.registrosAfectados > 0) {
            __dom.lanzarAlerta('Se ha creado un nuevo detalle de suspension', __app.mensajes.atencion);
            suspensionModel.currentIdMotivo = 0;
        } else {
            __dom.lanzarAlerta(result.mensaje, __app.mensajes.atencion);
        }
        $('div#camposVerEditarDetSuspencion').dialog('close');
        that.limpiarTablaDetallesConexion();
        that.limpiarCamposDetallesSuspension();
    },
    /** Hace petición ajax para eliminar un detalle de suspensión
     * @returns {void}
     **/
    resultadoEliminarDetalleSuspension: function (detalle) {
        var data = {
            idregistrodetalle: detalle.iddetallesuspension
        };
        var result = suspensionControl.eliminarDetallesSuspensiones(data);
        if (result.registrosAfectados > 0) {
            __dom.lanzarAlerta('Se ha eliminado el detalle de la suspensión', __app.mensajes.atencion);
        }
        that.limpiarTablaDetallesConexion();
    },
    /**
     * Carga la información de los detalles de reconexión del encabezado y asigna eventos a los botones de la tabla
     * @param {object} detalles - Información de los detalles de reconexión
     * @returns {void}
     **/
    verTablaDetallesReconexiones: function (detalles) {
        __app.modelo.detallesReconexionesTabla = detalles;
        if (detalles.codigoRespuesta > 0) {
            var _tabla = fillTable('tblReconexiones', __app.modelo.formatoDetallesReconexion, __app.modelo.detallesReconexionesTabla.datos, '').show();
            _tabla.find('td[header="thVer"] input[type="button"]').on('click', that.onReconexionDetalles);
            _tabla.find('td[header="thEditar"] input[type="button"]').on('click', that.onReconexionDetalles);
            _tabla.find('td[header="thEliminar"] input[type="button"]').on('click', that.onReconexionDetalles);
            _tabla.find('td[header="thHabilitar"] input[type="button"]').on('click', that.onReconexionDetallesHabilitar);
        }
    },
    onReconexionDetallesHabilitar:function(){

        /***********************************************************************************************************************/
        var este = $(this);
        var idRecon = este.attr('id');
        var posicionReco = parseInt(idRecon.substring(idRecon.length - 1, idRecon.length));

        if (!isNaN(posicionReco)) {
            var reconexionObtenida = suspensionModel.detallesReconexionesTabla.datos[posicionReco];
        }
        if (suspensionModel.suspensionSeleccionada.estado !== 'A' && este.val() !== 'Ver') {
            __dom.lanzarAlerta('El encabezado debe estar en estado activo', __app.mensajes.atencion);
            return;
        }

        that.reconexionSeleccionada = este.attr('data-id');
        console.log(reconexionObtenida);
        /**************************************************************************************************************************/

        var datos = {
                idsuspension: suspensionModel.suspensionSeleccionada.idsuspension ,
                idreconexion : reconexionObtenida.idreconexion ,
                accion : 'rx'
        }

      suspensionControl.habilitarSSRX(datos,function (datos){that.validarEdicionReconexion(datos,este.parent().parent(),reconexionObtenida)}) 
    },
    validarEdicionReconexion:function (datos,fila,reconexionObtenida){

        switch (datos.codigoRespuesta){
            case 1:
                var id = fila.attr('data-fila');

                reconexionObtenida.fechaejecucion = ' - ';
                fila.find('td[header="thFechaEjecucion"]').text('');
                __dom.lanzarAlerta(datos.mensaje, __app.mensajes.atencion);
                break;
            case -1:
                __dom.lanzarAlerta(datos.mensaje, 'Error');
        }
    },
    /** Abre cuadro de diálogo para realiza la gestión del CRUD de los detalles de la reconexión  la acción necesaria se válida según el texto del botón
     * @returns {void}
     **/
    onReconexionDetalles: function () {
        if (suspensionModel.suspensionSeleccionada.idsuspension === -1) {
            __dom.lanzarAlerta('Debe grabar una suspensión primero, y luego generar detalle de reconexion', 'Error');
            return;
        }
        that.limpiarCamposReconexion();
        var este = $(this);
        var idRecon = este.attr('id');
        var posicionReco = parseInt(idRecon.substring(idRecon.length - 1, idRecon.length));
        var reconexionObtenida = 0;
        if (!isNaN(posicionReco)) {
            reconexionObtenida = suspensionModel.detallesReconexionesTabla.datos[posicionReco];
        }
        if (suspensionModel.suspensionSeleccionada.estado !== 'A' && este.val() !== 'Ver') {
            __dom.lanzarAlerta('El encabezado debe estar en estado activo', __app.mensajes.atencion);
            return;
        }

        that.reconexionSeleccionada = este.attr('data-id');
        if (reconexionObtenida === undefined) {
            that.validarSuspensionParaNuevaReconexion();
        } else {
            var botones = {};
            var editar = true;
            //<editor-fold desc="Se configura el diálogo según la acción">
            switch (este.val()) {
                case 'Nueva Reconexión':
                    that.validarSuspensionParaNuevaReconexion();
                    return;
                    break;
                case 'Ver':
                    that.bloquearCamposReconexion();
                    var data = {
                        idsuspension: reconexionObtenida.idcabecerasuspension,
                        iddetallesuspension: reconexionObtenida.idsuspension
                    };
                    suspensionControl.consultarMotivosReconexion(data, function (data) {
                        var combo = $('#txtMotivoSuspensionRec').empty();
                        __dom.llenarCombo(combo, data.datos.motivos, 'id', 'nombre').val(reconexionObtenida.idmotivoreconexion);
                    });
                    setTimeout(that.asignarCamposReconexion(reconexionObtenida, 'V'), 200);
                    break;
                case 'Editar':
                    if (reconexionObtenida.fechaejecucion === undefined || reconexionObtenida.fechaejecucion === null || reconexionObtenida.fechaejecucion === ' - ') {
                        that.desbloquearCamposReconexion();
                        var data = {
                            idsuspension: reconexionObtenida.idcabecerasuspension,
                            iddetallesuspension: reconexionObtenida.idsuspension
                        };
                        suspensionControl.consultarMotivosReconexion(data, function (data) {
                            var combo = $('#txtMotivoSuspensionRec').empty();
                            __dom.llenarCombo(combo, data.datos.motivos, 'id', 'nombre').val(reconexionObtenida.idmotivoreconexion);
                        });
                        setTimeout(that.asignarCamposReconexion(reconexionObtenida), 200);


                        botones.Guardar = that.resultadoEditarReconexion;
                    } else {
                        __dom.lanzarAlerta('El detalle de reconexión tiene fecha de ejecución, no es posible editarla', 'Advertencia');
                        editar = false;
                    }
                    break;
                case 'Eliminar':
                    if (reconexionObtenida.fechaEjecucion === undefined || reconexionObtenida.fechaEjecucion === null || reconexionObtenida.fechaEjecucion === ' - ') {
                        __dom.lanzarAlerta('Se eliminará el detalle de reconexión ¿Desea eliminarlo?',
                                __app.mensajes.atencion,
                                function () {
                                    that.resultadoEliminarReconexion();
                                },
                                function () {
                                    //that.resultadoVerReconexion();
                                }
                        );
                    } else {
                        __dom.lanzarAlerta('El detalle de reconexión tiene fecha de ejecución, no es posible eliminarla', 'Advertencia');
                    }
                    break;
            }
            //</editor-fold>
            if (este.val() !== 'Eliminar' && editar) {
                botones.Cerrar = that.resultadoVerReconexion;
                var diagNuevo = $('div#camposVerEditarReconexion');
                diagNuevo.dialogo({
                    modal: true,
                    width: 700,
                    title: este.val().length <= 6 ? este.val() + ' Detalle de Reconexión' : este.val(),
                    buttons: botones
                });
            }
        }
    },
    /** Hace petición ajax para consultar la última suspensión del encabezado y si hay pendientes por reconexión
     * @returns {void}
     **/
    validarSuspensionParaNuevaReconexion: function () {
        var data = {
            idsuspension: suspensionModel.suspensionSeleccionada.idsuspension
        };
        suspensionControl.consultarSuspensionParaReconexion(data, that.validarSuspensionParaNuevaReconexionCompletado);
    },
    /** Captura la respuesta del servidor cuando se consulta última suspensión del encabezado
     * @param {object} data - Respuesta del servidor para validar si se puede agregar nuevo detalles de reconexión
     * @returns {void}
     **/
    validarSuspensionParaNuevaReconexionCompletado: function (data) {
        if (data.codigoRespuesta > 0) {
            suspensionModel.detalleSuspensionActual = data.datos[0].iddetallesuspension;
            var data = {
                idsuspension: suspensionModel.idSuspensionSeleccionada,
                iddetallesuspension: suspensionModel.detalleSuspensionActual
            };
            if (suspensionModel.suspensionSeleccionada.estado === 'A') {
                suspensionControl.consultarMotivosReconexion(data, that.consultarMotivosReconexionCompletado);
            } else {
                __dom.lanzarAlerta('El encabezado debe estar en estado activo', __app.mensajes.atencion);
                return;
            }
        } else {
            __dom.lanzarAlerta('No existen suspensiones pendientes de reconexión', __app.mensajes.atencion);
            return;
        }
    },
    /** Cierra el dialogo para la edición de las reconexiones.
     * @returns {void}
     **/
    resultadoVerReconexion: function () {
        $('div#camposVerEditarReconexion').dialog('close');
    },
    /** Valida la información del detalle de reconexión que se está editando y en caso de ser correcta
     * es agregada al modelo y  recarga la tabla
     * @returns {void}
     **/
    resultadoEditarReconexion: function () {
        var ejecucion = $('#txtFechaEjecucionRec').val();
        var ejecutada = $('input:radio[name=txtEjecutadaRec]:checked');
        var motivo = $('select#txtMotivoSuspensionRec');
        var novedad = $('#txtNovedadReconexionRec').val();
        if (suspensionModel.suspensionSeleccionada.estado !== 'A') {
            __dom.lanzarAlerta('El encabezado debe estar en estado activo', __app.mensajes.atencion);
            return;
        }
        if (($('#txtFechaAprobacionRec').val() !== '') && ($('#txtMotivoSuspensionRec').val() !== '-1' && $('#txtMotivoSuspensionRec').val() !== null)) {

            if (ejecucion !== '') {
                if (!ejecutada.length > 0) {
                    __dom.lanzarAlerta('Debe seleccionar <b> Reconexión Efectiva </b>', __app.mensajes.atencion);
                    return;
                }
                if (($('#txtTerceroReconexionRec').val().trim() === '')) {
                    __dom.lanzarAlerta('Debe seleccionar <b> Empresa reconexión </b>', __app.mensajes.atencion);
                    return;
                }
            }
            if (ejecutada.attr("title") !== '') {
                if (ejecucion === '') {
                    __dom.lanzarAlerta('Debe seleccionar <b> Fecha de ejecución </b>', __app.mensajes.atencion);
                    return;
                }
                if (($('#txtTerceroReconexionRec').val().trim() === '')) {
                    __dom.lanzarAlerta('Debe seleccionar <b> Empresa reconexión </b>', __app.mensajes.atencion);
                    return;
                }
                if (new Date($('#txtFechaProgramacionRec').val()) > new Date(ejecucion)) {
                    __dom.lanzarAlerta('La fecha de programación debe ser menor a la fecha de ejecución', __app.mensajes.atencion);
                    return;
                }
            }
            var data = {
                idsuspension: suspensionModel.suspensionSeleccionada.idsuspension,
                idregistrodetalle: that.reconexionSeleccionada,
                iddetallesuspension: suspensionModel.detalleSuspensionActual,
                idmotivoreconexion: (motivo.val() !== '-1' && motivo !== '') ? motivo.val() : null,
                idconceptoreconexion: ($('#txtConceptoReconexionRec').val() !== '0') ? $('#txtConceptoReconexionRec').val() : null,
                fechaejecucion: (ejecucion !== '' && ejecucion !== ' - ') ? ejecucion : null,
                fechaprogramacion: ($('#txtFechaProgramacionRec').val() !== ' - ' && $('#txtFechaProgramacionRec').val() !== '') ? $('#txtFechaProgramacionRec').val() : null,
                fechaaprobacion: ($('#txtFechaAprobacionRec').val() !== ' - ' && $('#txtFechaAprobacionRec').val() !== '') ? $('#txtFechaAprobacionRec').val() : null,
                idterceroreconexion: ($('#idTerceroReconexionRec').val() !== ' - ' && $('#txtTerceroReconexionRec').val() !== '') ? $('#idTerceroReconexionRec').val() : null,
                observacion: ($('#txtObservacionesRec').val() !== '' && $('#txtObservacionesRec').val() !== ' - ') ? $('#txtObservacionesRec').val() : null,
                realizada: ($('input:radio[name=txtEjecutadaRec]:checked').attr("title") !== '') ? $('input:radio[name=txtEjecutadaRec]:checked').attr("title") : null,
                idempresareconecta: $('#txtTerceroReconexionRec').val(),
                valortotal: ($('#txtValorTotalRec').val() !== '' && $('#txtValorTotalRec').val() !== ' - ') ? $('#txtValorTotalRec').val() : 0
            };
            if ($('#txtLecturaRec').val() !== '' && $('#txtLecturaRec').val() !== ' - ')
                data.lectura = $('#txtLecturaRec').val();
            if (novedad !== '-1' && novedad !== '')
                data.idnovedadreconexion = novedad;

            var result = __app.controlActual.editarReconexion(data);
            if (result.registrosAfectados > 0) {
                that.limpiarTablaDetallesConexion();
                __dom.lanzarAlerta('Se ha editado la reconexión', __app.mensajes.atencion);
            }
            $('div#camposVerEditarReconexion').dialog('close');
            that.limpiarTablaReconexion();
            that.limpiarCamposReconexion();
        } else {
            __dom.lanzarAlerta('Debe diligenciar por lo menos uno de los siguientes campos:<b>Motivo</b>, <b>Fecha Aprobación</b>,' +
                    ' <b>Empresa Reconexión</b>', __app.mensajes.atencion);
        }
    },
    /** Valida la información del detalle de reconexión que se está editando y en caso de ser correcta
     * es agregada al modelo y  recarga la tabla
     * @returns {void}
     **/
    resultadoNuevaReconexion: function () {
        if (($('#txtFechaAprobacionRec').val() !== '') && ($('#txtMotivoSuspensionRec').val() !== '-1' && $('#txtMotivoSuspensionRec').val() !== null)) {
            var data = {
                idsuspension: suspensionModel.suspensionSeleccionada.idsuspension,
                iddetallesuspension: suspensionModel.detalleSuspensionActual,
                idmotivoreconexion: (suspensionModel.currentIdMotivoRec !== '-1') ? suspensionModel.currentIdMotivoRec : null,
                idnovedadreconexion: ($('#txtNovedadReconexionRec').val() !== '-1') ? $('#txtNovedadReconexionRec').val() : null,
                idconceptoReconexion: ($('#txtConceptoReconexionRec').val()) ? $('#txtConceptoReconexionRec').val() : null,
                fechaejecucion: ($('#txtFechaEjecucionRec').val() === '' ? null : $('#txtFechaEjecucionRec').val()),
                fechaprogramacion: ($('#txtFechaProgramacionRec').val() === '' ? null : $('#txtFechaProgramacionRec').val()),
                fechaaprobacion: ($('#txtFechaAprobacionRec').val() === '' ? null : $('#txtFechaAprobacionRec').val()),
                idterceroreconexion: ($('#idTerceroReconexionRec').val() !== '') ? $('#idTerceroReconexionRec').val() : null,
                idempresareconecta: ($('#idTerceroReconexionRec').val() !== '') ? $('#txtTerceroReconexionRec').val() : null,
                lectura: $('#txtLecturaRec').val(),
                observacion: $('#txtObservacionesRec').val(),
                valortotal: $('#txtValorTotalRec').val()
            };
            var result = __app.controlActual.nuevaReconexion(data);
            if (result.registrosAfectados > 0) {
                __dom.lanzarAlerta('Se ha creado una nueva Reconexión', __app.mensajes.atencion);
            } else {
                __dom.lanzarAlerta(result.mensaje, __app.mensajes.atencion);
            }
            $('div#camposVerEditarReconexion').dialog('close');
            that.limpiarTablaReconexion();
            that.limpiarCamposReconexion();
        } else {
            __dom.lanzarAlerta('Debe diligenciar por lo menos uno de los siguientes campos:<b>Motivo</b>, <b>Fecha Aprobación</b>,', __app.mensajes.atencion);
        }
    },
    /** Hace petición ajax para eliminar un detalles de reconexión y recarga la tabla
     * @returns {void}
     **/
    resultadoEliminarReconexion: function () {
        var data = {
            idregistrodetalle: that.reconexionSeleccionada
        };
        var result = suspensionControl.eliminarReconexion(data);
        if (result.registrosAfectados > 0) {
            __dom.lanzarAlerta('Se ha eliminado la reconexión', __app.mensajes.atencion);
        }
        that.limpiarTablaReconexion();
    },
    /** Obtiene el motivo de suspensión por medio de su identificador
     * @param {number} id - Identificador del motivo a buscar
     * @returns {void}
     **/
    obtenerMotivo: function (id) {
        var motivos = suspensionModel.motivosSuspensiones;
        var nombre = "";
        $.each(motivos, function (i, item) {
            if (item.id === id) {
                nombre = item.nombre;
                return;
            }
        });
        return nombre;
    },
    /*obtenerMotivoReconexion: function (id) {
     var motivos = suspensionModel.motivosReconexiones;
     var nombre = "";
     $.each(motivos, function (i, item) {
     if (item.id === id) {
     nombre = item.nombre;
     return;
     }
     });
     return nombre;
     },*/
    /** Obtiene la novedad de suspensión por medio de su identificador
     * @param {number} id - Identificador de la novedad a buscar
     * @returns {void}
     **/
    obtenerNovedades: function (id) {
        var novedades = suspensionModel.novedadesSuspensiones;
        var nombre = "";
        $.each(novedades, function (i, item) {
            if (item.id === id) {
                nombre = item.nombre;
                return;
            }
        });
        return nombre;
    },
    /** Bloquea los campos del formulario de la gestión de los detalles de suspensión para cuando se editará
     * @returns {void}
     **/
    bloquearCamposDetallesSuspension: function () {
        $('#camposVerEditarDetSuspencion').find('select, input:text, input:radio, textarea')
                .prop('disabled', true);
    },
    /** Debloquea los campos del formulario de la gestión de los detalles de suspensión
     * @returns {void}
     **/
    desbloquearCamposNuevoDetalleSuspension: function () {
        $('select#txtMotivoSuspensionSus, #txtFechaProgramacionSus,' +
                '#txtTerceroSuspensionSus').prop('disabled', false);
    },
    /** Debloquea los campos del formulario de la gestión de los detalles de suspensión
     * @returns {void}
     **/
    desbloquearCamposDetallesSuspension: function () {
        $('#camposVerEditarDetSuspencion').find('select, input:text,input:radio, textarea').not('#txtValorTotalSus')
                .prop('disabled', false);
    },
    /** Limpia los campos del formulario de la gestión de los detalles de suspensión
     * @returns {void}
     **/
    limpiarCamposDetallesSuspension: function () {
        var div = $('#camposVerEditarDetSuspencion');
        div.find('select').val('-1');
        $('#idTerceroSuspensionSus')
        div.find('input[type="text"], textarea, input:hidden').val('');
        $('input:radio[name="txtEjecutadaSus"]').prop('checked', false);
        $('#txtTerceroSuspensionSus').attr('data-id', null);
    },
    /** Carga la información de un detalle de suspensiones en el formulario
     * @param {object} detalle - Información del detalle de suspensión
     * @param {object} accion -
     * @returns {void}
     **/
    asignarCamposDetallesSuspension: function (detalle, accion) {
        $('input:radio[name="txtEjecutadaSus"]').prop('checked', false);


        $('select#txtMotivoSuspensionSus').val(detalle.idmotivosuspension);
        suspensionModel.currentIdMotivo = detalle.idmotivosuspension;
        $('#idTerceroSuspensionSus').val(detalle.idtercerosuspension);
        $('input:text#txtFechaProgramacionSus').val(detalle.fechaprogramacion);
        $('input:text#txtFechaEjecucionSus').val(detalle.fechaejecucion);
        $('input:text#txtTerceroSuspensionSus').val(detalle.nombretercerosuspension);
        $('select#txtNovedadSuspensionSus').val(detalle.idnovedadsuspension);
        $('select#txtTipoSuspensionSus').val(detalle.idtiposuspension);
        $("input:radio[name=txtEjecutadaSus][title=" + detalle.ejecutada + "]").prop('checked', true);
        $('input:text#txtLecturaSus').val(detalle.lectura);
        $('textarea#txtObservacionesSus').val(detalle.observacion);
        $("#txtValorTotalSus").val(detalle.valortotal);
        if (!detalle.fechaejecucion && accion !== 'V') {
            $('input:text#txtFechaProgramacionSus').change();
        }
    },
    /** Bloquea los campos del formulario de la gestión de los detalles de reconexión para cuando se editará
     * @returns {void}
     **/
    bloquearCamposReconexion: function () {
        $('#camposVerEditarReconexion').find('select, input:text, input[type="radio"], textarea').prop('disabled', true);
    },
    /** Desbloquea los campos del formulario de la gestión de los detalles de reconexión
     * @returns {void}
     **/
    desbloquearCamposNuevaReconexion: function () {
        var division = $('#camposVerEditarReconexion');
        $('#txtMotivoSuspensionRec, #txtFechaProgramacionRec, #txtFechaAprobacionRec').prop('disabled', false);
        division.find('select, input:text, textarea').val('');
        division.find('select').val('-1');
        division.find('input[name="txtEjecutadaRec"]:checked').prop('checked', false);

    },
    /** Desbloquea los campos del formulario de la gestión de los detalles de reconexión
     * @returns {void}
     **/
    desbloquearCamposReconexion: function () {
        var div = $('#camposVerEditarReconexion');
        div.find('select, input[type="text"], input[type="radio"], textarea').not('#txtValorTotalRec').prop('disabled', false);
    },
    /** Limpia los campos del formulario de la gestión de los detalles de reconexión
     * @returns {void}
     **/
    limpiarCamposReconexion: function () {
        var div = $('#camposVerEditarReconexion');
        div.find('select').val('-1');
        div.find('input[type="text"], textarea input:hidden').val('');
        $('input:radio[name=txtEjecutadaSus]').prop('checked', false);
    },
    /** Carga la información de un detalle de reconexión en el formulario
     * @param {object} detalle - Información del detalle de reconexión
     * @param {object} accion -
     * @returns {void}
     **/
    asignarCamposReconexion: function (detalle, accion) {
        $('select#txtMotivoSuspensionRec').val(detalle.idmotivoreconexion != null ? detalle.idmotivoreconexion : '-1');
        suspensionModel.currentIdMotivoRec = detalle.idmotivoreconexion;
        $('select#txtNovedadReconexionRec').val(detalle.idnovedadreconexion != null ? detalle.idnovedadreconexion : '-1');
        $('select#txtConceptoReconexionRec').val(detalle.concepto);
        $('input:text#txtFechaAprobacionRec').val(detalle.fechaaprobacion);
        $('input:text#txtFechaEjecucionRec').val(detalle.fechaejecucion);
        $('input:text#txtFechaProgramacionRec').val(detalle.fechaprogramacion).attr('data-id', detalle.fechaprogramacion);
        $('input:text#txtTerceroReconexionRec').val(detalle.nombreempresareconexion);
        $('input:hidden#idTerceroReconexionRec').val(detalle.idterceroreconexion);
        $('input:text#txtLecturaRec').val(detalle.lectura);
        $('input:text#txtValorTotalRec').val(detalle.valortotal);
        $('textarea#txtObservacionesRec').val(detalle.observaciones);
        $("input:radio[name=txtEjecutadaRec][title=" + detalle.realizada + "]").prop('checked', true);
        if (!detalle.fechaejecucion && accion !== 'V') {
            $('input:text#txtFechaProgramacionRec').change();
        }
    },
    /** Hace peticiones ajax para consultar información y cargar los combos
     * @returns {void}
     **/
    cargarCombosDetalleSuspension: function () {
        suspensionModel.estadosSuspensiones =
                suspensionControl.consultarParametros('consultar_estados_suspension').datos;
        //select motivo suspension
        var motivoSus = suspensionModel.motivosSuspensiones =
                suspensionControl.consultarParametros('consultar_motivos_suspension').datos;
        if (!!motivoSus) {
            __dom.llenarCombo($('select#txtMotivoSuspensionSus'), motivoSus, 'id', 'nombre');
        }


        //Tipos de Suspension
        var tipoSus = suspensionModel.tiposSuspensiones =
                suspensionControl.consultarParametros('consultar_tipos_suspension').datos;
        if (!!tipoSus) {
            __dom.llenarCombo($('select#txtTipoSuspensionSus'), tipoSus, 'idtiposuspension', 'tiposuspension');
        }


        //Select Novedad
        var detSus = suspensionModel.novedadesSuspensiones =
                suspensionControl.consultarParametros('consultar_novedades_suspension').datos;
        if (!!detSus) {
            __dom.llenarCombo($('select#txtNovedadSuspensionSus'), detSus, 'id', 'nombre');
        }

        //Select novedad reconexion
        var detRec = suspensionModel.novedadesReconexion =
                suspensionControl.consultarParametros('consultar_novedades_reconexion').datos;
        if (!!detRec) {
            __dom.llenarCombo($('select#txtNovedadReconexionRec'), detRec, 'id', 'nombre');
        }
    },
    /** Hace petición ajax para consultar el valor de la novedad de suspensión
     * @returns {void}
     **/
    cambiarNovedadSuspension: function () {
        var _this = $(this);
        $('#txtValorTotalSus').val('');
        if (_this.val() !== '-1') {
            suspensionControl.consultarValorSuspension({idnovedad: _this.val()}, function (data) {
                if (data.codigoRespuesta === 1) {
                    $('#txtValorTotalSus').val(data.datos.valortotal);
                }
            });
        }
    },
    /** Hace petición ajax para consultar el valor de la novedad de reconexión
     * @returns {void}
     **/
    cambiarNovedadReconexion: function () {
        var _this = $(this);
        $('#txtValorTotalRec').val('');
        if (_this.val() !== '-1') {
            suspensionControl.consultarValorReconexion({idnovedad: _this.val()}, function (data) {
                if (data.codigoRespuesta === 1) {
                    $('#txtValorTotalRec').val(data.datos.valortotal);
                }
            });
        }
    },
    /** Configura las cajas de texto para funcionalidad de autocomplete
     * @returns {void}
     **/
    configurarAutocomplete: function () {
        __dom.configurarAutocomplete(
                $('input#txtTerceroReconexionRec'),
                that.sourceAutoCompleteSus,
                function (event, ui) {
                    $('input#txtTerceroReconexionRec').val(ui.item ? ui.item.value : '');
                    $('input#idTerceroReconexionRec').val(ui.item ? ui.item.idVal : '');
                },
                function () {
                    $('input#idTerceroReconexionRec').val('');
                }
        );

        __dom.configurarAutocomplete(
                $('input#txtTerceroSuspensionSus'),
                that.sourceAutoCompleteSus,
                function (event, ui) {
                    $('input#txtTerceroSuspensionSus').val(ui.item ? ui.item.value : '');
                    $('input#idTerceroSuspensionSus').val(ui.item ? ui.item.idVal : '');
                },
                function () {
                    $('input#idTerceroSuspensionSus').val('');
                }
        );
    },
    /**
     * Hace petición al servidor para encontrar los terceros que coincidan con el texto digitado en la caja de texto
     * @param {Object} request - Información de la petición realizada por el autocomplete
     * @param {Object} response - Respuesta que recibe el autocomplete para mostrar al usuario
     */
    sourceAutoCompleteSus: function (request, response) {
        that.request = request;
        that.response = response;
        var datos = {};
        if (!request.term.trim() == "") {
            datos.nombre = request.term.trim();
            suspensionControl.cargarAutoCompleteRec(datos, that.mostrarResultadoSus);
        }
    },
    /**
     * Recibe la respuesta del servidor y la configura para mostrarla en la lista despleagada del autocomplete
     * @param {Object} data - Información enviada por el servidor con información de los terceros encontrados
     */
    mostrarResultadoSus: function (data) {
        if (data.codigoRespuesta === 1) {
            var result = [];
            $.each(data.datos, function (i, item) {
                result.push({
                    label: item.nombretercero,
                    value: item.nombretercero,
                    idVal: item.idtercero
                });
            });
            that.response(result);
        }
    },
    /**
     * Configura la caja de texto con id txtMunicipio para funcionalidad de autocomplete con municipios
     */
    cargarAutocompleteMunicipio: function () {
        __dom.configurarAutocomplete(
                $('#txtMunicipio'),
                that.sourceAutoCompleteMunicipio,
                function (event, ui) {
                    suspensionModel.idMunicipio = ui.item.idVal;
                },
                function () {
                    suspensionModel.idMunicipio = undefined;
                }
        );
    },
    /**
     * Hace petición al servidor para encontrar los municipios que coincidan con el texto digitado en la caja de texto
     * @param {Object} request - Información de la petición realizada por el autocomplete
     * @param {Object} response - Respuesta que recibe el autocomplete para mostrar al usuario
     */
    sourceAutoCompleteMunicipio: function (request, response) {
        that.request = request;
        that.response = response;
        var data = {};
        data.municipio = request.term.trim();
        suspensionControl.consultarMunicipios(data, that.mostrarResultadoMunicipio);
    },
    /**
     * Recibe la respuesta del servidor y la configura para mostrarla en la lista despleagada del autocomplete de municipios
     * @param {Object} data - Información enviada por el servidor con información de los municipios encontrados
     */
    mostrarResultadoMunicipio: function (data) {
        if (data.codigoRespuesta === 1) {
            var result = [];
            $.each(data.datos, function (i, item) {
                result.push({
                    label: item.municipio,
                    value: item.municipio,
                    idVal: item.idmunicipio
                });
            });
            that.response(result);
            $("div#camposBuscarSuscripcion").find("p").text("");
        } else {
            $("div#camposBuscarSuscripcion").find("p").text("No se encontraron municipios")
        }
    },
    /** Limpia la tabla de detalles de conexión
     * @return{void}
     **/
    limpiarTablaDetallesConexion: function () {
        $('table#tblSuspensiones').empty().hide();
        that.verDetallesSuspension();
    },
    /** Limpia la tabla de detalles de reconexión
     * @return{void}
     **/
    limpiarTablaReconexion: function () {
        $('table#tblReconexiones').empty().hide();
        that.verDetallesReconexiones();
    },
    /**
     * Muestra el filtro para hacer la consulta de la suscripción
     */
    visualizarFiltroSuscripciones: function () {
        var divFiltrar = $("div#camposBuscarSuscripcion");
        that.dialogoActual = $("div#camposBuscarSuscripcion").dialogo({
            modal: true,
            width: 700,
            title: 'Búsqueda de suscripción',
            buttons: {
                Buscar: that.buscarSuscripciones
            }
        });
    },
    /** Captura la respuesta del servidor del servidor cuando se consultan los motivos de reconexión
     * @param {Object} data - Respuesta del servidor con arreglo de motivos de reconexión
     * @returns {void}
     **/
    consultarMotivosReconexionCompletado: function (data) {
        if (data.codigoRespuesta > 0) {
            var combo = $('#txtMotivoSuspensionRec').empty();
            __dom.llenarCombo(combo, data.datos.motivos, 'id', 'nombre');
            var diagNuevo = $('div#camposVerEditarReconexion');
            that.bloquearCamposReconexion();
            that.desbloquearCamposNuevaReconexion();
            var date = data.datos.suspension.fechasuspension.split(' ');
            $('#txtFechaProgramacionRec, #txtFechaAprobacionRec').datetimepicker('destroy');
            $('#txtFechaProgramacionRec, #txtFechaAprobacionRec').datetimepicker({
                minDate: date[0],
                lang: 'es'
            });
            diagNuevo.dialogo({
                modal: true,
                width: 700,
                title: 'Nueva Reconexión',
                buttons: {
                    Guardar: that.resultadoNuevaReconexion,
                    Cerrar: that.resultadoVerReconexion
                }
            });
        } else {
            __dom.lanzarAlerta('No aplican motivos de reconexión para la última suspensión, Imposible crear nueva reconexión', __app.mensajes.atencion);
        }
    },
    /**
     * Consulta el valor asociado a un concepto por suspensión
     * @deprecated version 1.1.0
     * @param {Object} data - Información enviada por el servidor con valor de concepto
     */
    consultarValorConceptoSus: function (data) {
        if (data.codigoRespuesta > 0) {
            $("#txtValorTotalSus").val(data.datos);
        }
    },
    /**
     * Consulta el valor asociado a un concepto por reconexión
     * @deprecated version 1.1.0
     * @param {Object} data - Información enviada por el servidor con valor de concepto
     */
    consultarValorConceptoRec: function (data) {
        if (data.codigoRespuesta > 0) {
            $("#txtValorTotalRec").val(data.datos);
        }
    },
    /**
     * Limpia la parte superior del formulario donde se carga la información del encabezado de suspensión
     */
    limpiarDatosEncabezado: function () {
        var div = $('#divDatosSuspension');
        div.find('input:text').not('#txtCicloNuevaSus, #txtPeriodoNuevaSus').val('');
        div.find('select').val('A');
        suspensionModel.accionEncabezado = 'C';
    },
    /**
     * Limpia toda la información cargada en el formulario
     */
    limpiarFormulario: function () {
        $('#divDatosSuspension input:text').val('');
        $('#tabs #tblSuspensiones, #tabs #tblReconexiones').empty();
        that.limpiarDatosEncabezado();
    },
    
    respuestaFinanciaFactura: function(){
        if (suspensionModel.suspensionSeleccionada.estado !== 'A') {
            __dom.lanzarAlerta('El encabezado debe estar en estado activo', __app.mensajes.atencion);
            return;
        }
        if (($('#idTerceroSuspensionSus').val() !== '') && ($('#txtFechaProgramacionSus').val() !== '') && (suspensionModel.currentIdMotivo !== 0)) {
            var ejecutada = $('input:radio[name=txtEjecutadaSus]:checked').attr("title");
            var ejecucion = $('#txtFechaEjecucionSus').val();
            if (ejecucion !== '') {
                if (ejecutada === '' || !ejecutada) {
                    __dom.lanzarAlerta('Debe seleccionar <b> Suspensión Efectiva </b>', __app.mensajes.atencion);
                    return;
                }
            }
            if (ejecutada !== '') {
                if (ejecucion === '' || $('#txtNovedadSuspensionSus').val() === '-1' || $('#txtNovedadSuspensionSus').val() === null && ejecutada !== 'N') {
                    __dom.lanzarAlerta('Debe seleccionar <b> Fecha de ejecución </b> y <b> Novedad </b>', __app.mensajes.atencion);
                    return;
                }
                if (new Date($('#txtFechaProgramacionSus').val()) > new Date(ejecucion)) {
                    __dom.lanzarAlerta('La fecha de programación debe ser menor a la fecha de ejecución', __app.mensajes.atencion);
                    return;
                }

            }
            var data = {
                idSuscripcion: $('#txtSuscripcion').val(),
                idsuspension: suspensionModel.suspensionSeleccionada.idsuspension,
                idregistrodetalle: that.detalleSeleccionado.iddetallesuspension,
                idmotivosuspension: ($('select#txtMotivoSuspensionSus').val() !== '-1') ? $('select#txtMotivoSuspensionSus').val() : null,
                idnovedadsuspension: ($('#txtNovedadSuspensionSus').val() !== '-1') ? $('#txtNovedadSuspensionSus').val() : null,
                idtiposuspension: ($('#txtTipoSuspensionSus').val() !== '-1') ? $('#txtTipoSuspensionSus').val() : null,
                idtercerosuspension: ($('#idTerceroSuspensionSus').val() !== '-1') ? $('#idTerceroSuspensionSus').val() : null,
                lectura: ($('#txtLecturaSus').val() !== '' && $('#txtLecturaSus').val() !== ' - ') ? $('#txtLecturaSus').val() : null,
                fechaprogramacion: ($('#txtFechaProgramacionSus').val() !== '' && $('#txtFechaProgramacionSus').val() !== ' - ') ? $('#txtFechaProgramacionSus').val() : null,
                fechaejecucion: ($('#txtFechaEjecucionSus').val() !== '' && $('#txtFechaEjecucionSus').val() !== ' - ') ? $('#txtFechaEjecucionSus').val() : null,
                observacion: ($('#txtObservacionesSus').val() !== '') ? $('#txtObservacionesSus').val() : null,
                ejecutada: ($('input:radio[name=txtEjecutadaSus]:checked').attr("title") !== '') ? $('input:radio[name=txtEjecutadaSus]:checked').attr("title") : null,
                idconceptosuspension: ($("#txtConceptoSuspensionSus").val() !== '-1') ? $("#txtConceptoSuspensionSus").val() : null,
                valortotal: ($('#txtValorTotalSus').val().trim() !== '') ? $('#txtValorTotalSus').val() : null
            };
            var result = __app.controlActual.editarDetalleSuspension(data);
            if (result.registrosAfectados > 0) {
                __dom.lanzarAlerta('Se ha editado el detalle de suspension', __app.mensajes.atencion);
                suspensionModel.currentIdMotivo = 0;

            }
            $('div#camposVerEditarDetSuspencion').dialog('close');
            that.limpiarTablaDetallesConexion();
            that.limpiarCamposDetallesSuspension();
        } else {
            __dom.lanzarAlerta('Debe diligenciar los siguientes campos: <b>Motivo</b>, <b>Empresa Suspensión</b> y ' +
                    '<b>Fecha Progamación</b>', __app.mensajes.atencion);
        }
        
        
        
          
    }
};
