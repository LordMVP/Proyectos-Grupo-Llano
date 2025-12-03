/**
 * @fileOverview Archivo de vista y control de reunificar financiación
 * @author AppFuture
 * @requires reunificar.control.js
 * @requires reunificar.modelo.js
 * @version 1.0.0
 */
/**
 * Objeto que hace referencia al namespace reunificarFinanciacionVista
 * @type {Object}
 */
var that = null;

/** @namespace */
var reunificarFinanciacionVista = {
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
        $('#btnCargarSimulador').on('click', that.mostrarSimulador);
        $('#btnCalcular').on('click', _that.calcularAmortizacion);
        $('#btnGrabar').on('click', that.grabarReunificacion);
        $('#btnCancelar').on('click', that.cancelarReunificacion);
        $('#btnImprimir').on('click', that.imprimir);
        $('#cmbTipoLiquidacion').on('change', that.consultarInteresCompleto);

        $('#cmbTipoDoc').on('change', that.consultarDocumentos);
        $('#cmbDocumentoFin').on('change', that.cargarFinanciaciones);

        __dom.configurarTextoNumerico('txtNumCuotas').on('blur', that.validarCuotas);
        that.configurarAutoComplete();
    },

    /**
     * Invoca la consulta de documentos por medio de una petición AJAX.
     * @returns {void}
     */
    consultarDocumentos: function () {
        var _this = $(this);
        if (_this.val() && _this.val() !== '-1') {
            that.cargarFinanciaciones();
            var data = {idtipodocumento: _this.val()};
            reunificarControl.consultarDocumentos(data, that.onConsultarDocumentosCompleto);
        } else {
            $('#divFinanciacion').hide();
            $('#tblFinanciaciones').empty();
        }
    },

    /**
     * Se ejecuta cuando se termina de hacer la consulta de los documentos
     * @param  {Object} data La respuesta del servidor
     * @returns {void}
     */
    onConsultarDocumentosCompleto: function (data) {
        var cmb = $('#cmbDocumentoFin').empty();
        if (data.codigoRespuesta === 1) {
            __dom.llenarCombo(cmb, data.documentos, 'iddocumento', 'documento');
        }
    },
    /**Valida la información de suscripción y financiaciones  que se puede imprimir
     * e imprime la financiaciones
     * @returns {void}
     */
    imprimir: function () {
        if (!reunificarModel.suscripcion) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarSuscripcion, __app.mensajes.atencion);
            return;
        }
        var financiacionSelect = $('#tblFinanciaciones tbody tr td[header="thSeleccion"] input[type="checkbox"]:checked');
        if (!reunificarModel.financiaciones || financiacionSelect.length === 0) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarFinanciacion, __app.mensajes.atencion);
            return;
        }
        if ($('#cmbTipoLiquidacion').val() === '-1') {
            __dom.lanzarAlerta(__app.mensajes.tipoLiquidacion, __app.mensajes.atencion);
            return;
        }
        window.print();
    },
    /**
     * Hace petición ajax para consultar el interés según la liquidación
     * @returns {void}
     */
    consultarInteresCompleto: function () {
        var cmbLiquidacion = $('#cmbTipoLiquidacion');
        if (cmbLiquidacion.val() === '-1') {
            reunificarModel.maximoplazo = 1;
            $('#txtInteres, #txtIntereses').val('');
            $('#txtNumCuotas').blur();
            return;
        }
        var info = {idliquidacion: cmbLiquidacion.val()};
        reunificarModel.maximoplazo = cmbLiquidacion.find('option:selected').attr('data-plazo');
        var tipocuota = cmbLiquidacion.find('option:selected').attr('tipo-cuota');
        reunificarControl.consultarInteres(info, function (data) {
            $('#txtInteres, #txtIntereses').val(data.interes).attr('data-iva', data.interesiva).attr('tipo-cuota', tipocuota);
            $('#txtFechaActualImprimir').val($('#txtFecha').val());
        });
        $('#txtNumCuotas').blur();
    },
    /**
     * Asigna funcionalidad a cajas de texto para autocompletar con sus respectivas propiedades y recursos.
     * @returns {void}
     */
    configurarAutoComplete: function () {

        __dom.configurarAutocomplete(
                'input#txtNombreSolicitante',
                that.sourceAutoComplete,
                function (event, ui) {
                    $('input#txtDocSolicitante').val(ui.item.documento);
                    reunificarModel.idSolicitante = ui.item.idVal;
                },
                function (txt) {
                    $('input#txtDocSolicitante').val('');
                    reunificarModel.idSolicitante = undefined;
                }
        );

        __dom.configurarAutocomplete(
                '#txtBanco',
                that.sourceAutoCompleteBanco,
                function (event, ui) {
                    $(this).val(ui.item ? ui.item.value : '')
                            .attr('data-id', ui.item.idVal);
                    reunificarModel.idEntidad = ui.item.idVal;
                },
                function (txt) {
                    $(this).removeAttr('data-id');
                    reunificarModel.idEntidad = undefined;
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
        datos.nombre = request.term;
        reunificarControl.buscarSolicitante(datos, that.mostrarResultado);
    },
    /** Muestra el resultado de la consulta de los terceros en la lista desplegable.
     * @returns {void}
     */
    mostrarResultado: function (data) {
        var result = [];
        if (data.codigoRespuesta === 1) {
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
        that.response(result);
    },
    /** Realiza la solicitud AJAX para consultar los bancos del autocomplete 
     * @returns {void}
     */
    sourceAutoCompleteBanco: function (request, response) {
        that.request = request;
        that.response = response;
        var datos = {};
        datos.nombre = request.term;
        reunificarControl.buscarBanco(datos, that.mostrarResultadoBanco);
    },
    /** Muestra el resultado de la consulta de los bancos en la lista desplegable.
     * @returns {void}
     */
    mostrarResultadoBanco: function (data) {
        var result = [];
        if (data.codigoRespuesta === 1) {
            $.each(data.bancos, function (i, item) {
                result.push({
                    label: item.nombretercero,
                    value: item.nombretercero,
                    documento: item.documento,
                    idVal: item.idtercero
                });
            });
        }
        that.response(result);
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
                idsuscripcion: suscripcion,
                documentotercero: doc,
                codigoanterior: codAnt
            };
            reunificarControl.consultarSuscripciones(data, that.consultaSuscripcionCompleto);
        }
    },
    /** Captura la respuesta enviada por el servidor, cuando se consultan las suscripciones.
     * En caso de haber más de una se muestran en lista para su respectiva selección
     * @param  {object} data - El resultado de la petición ajax para guardar la información de la suscripción
     * @returns {void}
     */
    consultaSuscripcionCompleto: function (data) {
        that.limpiarFormulario();
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                break;
            case 1:
                var sus = null;
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
                                + ' - Cód Anterior: ' + susc.codigoanterior
                                + ' - Tipo Suscripción: ' + susc.tiposuscripcion);
                        div.append(radio).append(label);
                        divSuscripciones.append(div);
                    });
                    var btn = $('<button>').text('Seleccionar').addClass('btnSimple');
                    btn.on('click', function () {

                        var suscSeleccionada = that.dialogoActual.find('input[name="radio_suscripciones"]:checked');
                        if (suscSeleccionada.length > 0) {
                            reunificarModel.suscripcion = data.suscripciones[parseInt(suscSeleccionada.attr('data-indice'))];
                            that.dialogoActual.find('#spanMensaje').hide();
                            that.dialogoActual.dialog('close');
                            divSuscripciones.remove();
                            that.cargarCabecera();
                        } else {
                            that.dialogoActual.find('#spanMensaje').text(__app.mensajes.seleccionarOpcion).show();
                        }
                    });
                    divSuscripciones.insertAfter(that.dialogoActual.find('#spanMensaje'));
                    divSuscripciones.append(btn);

                } else {
                    reunificarModel.suscripcion = data.suscripciones[0];
                    that.dialogoActual.find('#spanMensaje').hide();
                    that.dialogoActual.dialog('close');
                    that.cargarCabecera();
                }
                break;
        }
    },
    /** Carga la cabecera del formulario con los datos de la suscripción seleccionada.
     * @returns {void}
     */
    cargarCabecera: function () {
        var cabecera = $('#divCabecera');
        var suscripcion = reunificarModel.suscripcion;
        $('#txtSuscripcion, #txtSuscripcionImprimir').val(suscripcion.idsuscripcion);
        cabecera.find('#txtSuscriptor').val(suscripcion.idsuscriptor);
        cabecera.find('#txtDocumento').val(suscripcion.documento);
        $('#txtNombre, #txtPropietarioImprimir').val(suscripcion.nombre);
        cabecera.find('#txtCodAnterior').val(suscripcion.codigoanterior);
        $('#txtDireccionImprimir').val(suscripcion.direccion);
        var info = {idsuscripcion: suscripcion.idsuscripcion};
        reunificarControl.consultarTiposDocumentos(info, that.onConsultarTiposDocumento);
        reunificarControl.consultarDiasPeriodo(info, that.onConsultarDiasPeriodo);
    },

    /**
     * Se ejecuta cuando se terminan de consultar los días del período.
     * @param  {Object} data Respuesta del servidor.
     * @returns {void}
     */
    onConsultarDiasPeriodo: function (data) {
        if (data.codigoRespuesta > 0) {
            reunificarModel.diasterminoperiodo = data.diasterminoperiodo;
        }
    },

    /**
     * Se ejecuta cuando se terminan de ejecutar la consulta de documentos
     * @param  {Object} data Respuesta del servidor
     * @returns {void}
     */
    onConsultarTiposDocumento: function (data) {
        if (data.codigoRespuesta === 1) {
            var combo = $('#cmbTipoDoc').empty();
            __dom.llenarCombo(combo, data.tipodocumento, 'idtipodocumento', 'tipodocumento');
        }
    },
    /** Hace petición AJAX para consulta las financiaciones y detalles de una suscripción seleccionada.
     * @returns {void}
     */
    cargarFinanciaciones: function () {
        if (reunificarModel.suscripcion !== null) {
            var idsuscripcion = reunificarModel.suscripcion.idsuscripcion;
            var data = {
                idSuscripcion: idsuscripcion,
                idtipodocumento: $('#cmbTipoDoc').val(),
                validarcuota: 't'
            };
            var iddocumento = $('#cmbDocumentoFin').val();
            if (iddocumento !== null && iddocumento !== '-1' && iddocumento !== '0') {
                data.iddocumento = iddocumento;
            }
            reunificarControl.consultarTablaFinanciaciones(data, that.onCargarFinanciacionesCompleto);
            reunificarControl.consultarInformacion({idsuscripcion: idsuscripcion}, that.onCargarInformacionCompleto);
        } else {
            __dom.lanzarAlerta(__app.mensajes.seleccionarSuscripcion, __app.mensajes.atencion);
        }
    },
    /** Captura la respuesta del servidor cuando se consulta la informacion de las financiaciones.
     * @returns {void}
     */
    onCargarInformacionCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 1:
                //$('#cmbTipoDoc').val(data.documentostipos.idtipodocumento).change();
                $('#txtFecha').val(data.fechafinanciacion);
                $('#txtCiclo').val(data.ciclo)
                        .attr('title', data.ciclo)
                        .attr('data-id', data.idciclo);
                $('#txtPeriodo').val(data.periodo)
                        .attr('data-id', data.idperiodo);
                reunificarModel.estadoBusqueda = 'A';
                reunificarModel.liquidaciones = data.liquidaciones;
                var info = {idtipodocumento: $('#cmbTipoDoc').val()};
                reunificarModel.iddocumentofinanciacion = data.documentostipos.iddocumento;
                reunificarControl.consultarLiquidacion(info, that.onConsultarLiquidacionCompleto);
                break;
        }
    },

    /**
     * Se ejecuta cuando se termina de ejecutar la consulta de liquidaciones.
     * @param  {Object} data Respuesta del servidor
     * @returns {void}
     */
    onConsultarLiquidacionCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                break;
            case 1:
                var cmb = $('#cmbTipoLiquidacion').empty();
                reunificarModel.liquidacion = data.financiacion;
                cmb.append($('<option>').val('-1').text('Seleccione una opción'));
                for (var index = 0; index < data.financiacion.length; index++) {
                    var liquidacion = data.financiacion[index];
                    var option = $('<option>').val(liquidacion.idliquidacion);
                    option.attr('data-plazo', liquidacion.maximoplazoreunifica);
                    option.attr('tipo-cuota', liquidacion.tipocuota);
                    option.text(liquidacion.liquidacion);
                    cmb.append(option);
                }
                break;
        }
    },
    /** Captura la respuesta del servidor cuando se consulta las financiaciones de una suscripción.
     * Muestra las financiaciones en una tabla
     * @returns {void}
     */
    onCargarFinanciacionesCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta('La suscripción no tiene financiaciones', 'Atención');
                that.ocultarYLimpiarFinanciaciones();
                break;
            case 1:
                
                if (data.tablaFinanciacion.length <= 1) {
                    that.ocultarYLimpiarFinanciaciones();
                    __dom.lanzarAlerta('No hay suficientes financiaciones para reunificar', 'Atención');
                    return;
                }
                $('#divFinanciacion').slideDown();
                reunificarModel.financiaciones = data.tablaFinanciacion;
                var tblFinanciaciones = fillTable("tblFinanciaciones", "formatoFinanciaciones", "reunificarModel.financiaciones", "Financiaciones");
                tblFinanciaciones.find('tbody tr td[header="thSeleccion"] input').on('click', that.acumularFinanciacion);
                break;
        }
    },

    /**
     * Limpia la tabla de financiaciones, y el modelo
     * @returns {void}
     */
    ocultarYLimpiarFinanciaciones: function () {
        $('#tblFinanciaciones').empty();
        $('#divFinanciacion').slideUp('fast');
        reunificarModel.totalFinanciar = 0;
        reunificarModel.financiaciones = [];
    },
    /** Valida las financiaciones seleccionadas y suma los saldos que sería el valor total a financiar
     * @returns {void}
     */
    acumularFinanciacion: function () {
        var check = $(this);
        var trSeleccionada = check.parent().parent();
        //var filas = $('#tblFinanciaciones tbody tr td[header="thSeleccion"] input:checked');
        var saldo = parseInt(trSeleccionada.find('td[header="thSaldoCapital"]').attr('data-valor'));
        if (check.is(':checked')) {
            reunificarModel.totalFinanciar += saldo;
        } else {
            reunificarModel.totalFinanciar -= saldo;
        }
        $('#txtValorFinanciar').val(reunificarModel.totalFinanciar);
    },
    /** Valida qeu las cuotas sean entre 1 y 24
     * @returns {void}
     */
    validarCuotas: function (e) {
        var _this = $(this);
        var maximocuota = reunificarModel.maximoplazo;
        var cuotas = parseInt(_this.val());
        if (cuotas > maximocuota) {
            _this.val(maximocuota).focus().select();
            return;
        }
        if (cuotas < 1) {
            _this.val('1').focus().select();
            return;
        }
        reunificarModel.cuotas = cuotas;
    },
    /** Valida información para mostrar un cuadro de dialogo con el simulador de amortización para 
     * las financiaciones seleccionada. 
     * @returns {void}
     */
    mostrarSimulador: function () {
        if (!reunificarModel.cuotas) {
            __dom.lanzarAlerta('Para generar la financiación, debe escoger una cantidad de cuotas entre 1 y ' + reunificarModel.maximoplazo, __app.mensajes.atencion);
            return;
        }
        if ($('#cmbTipoLiquidacion').val() === '-1') {
            __dom.lanzarAlerta(__app.mensajes.tipoLiquidacion, __app.mensajes.atencion);
            return;
        }
        if (!reunificarModel.totalFinanciar || reunificarModel.totalFinanciar <= 0) {
            __dom.lanzarAlerta(__app.mensajes.requiereValorFinanciarMayor, __app.mensajes.atencion);
            return;
        }
        var filtro = $('div#divSimulador');
        $('#txtCapitalInicial').val($('#txtValorFinanciar').val());
        $('#txtNumeroCuotas').val($('#txtNumCuotas').val());
        _that.calcularAmortizacion(reunificarModel);
        var vlrCuota = reunificarModel.valorCuota.toString().toCurrency();
        $('#txtVlrCuotaMensualImprimir, #txtVlrPrimerCuotaImprimir').val(vlrCuota);
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
     * Configura la página de impresión e invoca la ventana de impresión
     * @returns {void}
     */
    imprimirSimulador: function () {
        var frame = document.getElementById('iframePrint');
        var c = frame.contentDocument.getElementById('contenido');
        frame.contentDocument.getElementById('title').innerText = 'Reunificación de financiaciones';
        var cp = document.getElementById('divSimulador').cloneNode(true);
        while (c.firstChild) {
            c.removeChild(c.firstChild);
        }
        c.appendChild(cp);
        $(c).find('#divSimulador').removeAttr('style');
        $(c).find('.inputImpresion').parent().removeAttr('style');

        var w = frame.contentWindow;
        w.focus();
        w.print();
    },
    /** Valida que la información digitada sea correcta y completa de ser así, hace petición AJAX
     * para grabar la reunificación, de lo contrario, mostrará alerta con errores.
     * @returns {void}
     */
    grabarReunificacion: function () {
        if (reunificarModel.suscripcion === null) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarSuscripcion, __app.mensajes.atencion);
            return;
        }
        var financiacionesSeleccionadas = $('#tblFinanciaciones tbody tr.selected');
        if (financiacionesSeleccionadas.length <= 0) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarFinanciacion, __app.mensajes.alerta);
            return;
        }
        if (financiacionesSeleccionadas.length < 2) {
            __dom.lanzarAlerta('No hay financiaciones suficientes para reunificar', __app.mensajes.alerta);
            return;
        }
        if (reunificarModel.idSolicitante === undefined) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarSolicitante, __app.mensajes.alerta);
            return;
        }
        if (reunificarModel.idEntidad === undefined) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarBanco, __app.mensajes.alerta);
            return;
        }
        if ($('#txtNumCuotas').val() === '') {
            __dom.lanzarAlerta('Para generar la financiación, debe escoger una cantidad de cuotas entre 1 y ' + reunificarModel.maximoplazo, __app.mensajes.alerta);
            return;
        }
        if ($('#cmbTipoLiquidacion').val() === '-1') {
            __dom.lanzarAlerta(__app.mensajes.seleccionarLiquidacion, __app.mensajes.alerta);
            return;
        }
        if (!$('#cmbTipoDoc').val() || $('#cmbTipoDoc').val() === '-1') {
            __dom.lanzarAlerta('Debe seleccionar tipo de documento', __app.mensajes.atencion);
            return;
        }
        var datos = {};
        var documento = $('#cmbDocumentoFin').val() !== '-1' ? $('#cmbDocumentoFin').val() : null;
        datos.idsuscripcion = reunificarModel.suscripcion.idsuscripcion;
        datos.financiacion = {
            idliquidacion: $('#cmbTipoLiquidacion').val(),
            valortotalfinanciaciones: $('#txtValorFinanciar').val(),
            idsolicita: reunificarModel.idSolicitante,
            identidadfinanciera: reunificarModel.idEntidad,
            cuotas: $('#txtNumCuotas').val(),
            idtercero: reunificarModel.suscripcion.idtercero,
            idtipodocumento: $('#cmbTipoDoc').val(),
            iddocumento: documento
        };
        datos.reunificar = [];
        financiacionesSeleccionadas.each(function (t, tr) {
            tr = $(tr);
            var saldoTd = tr.find('td[header="thSaldoCapital"]');
            datos.reunificar.push({
                idfinanciacion: saldoTd.attr('data-value'),
                saldo: parseInt(saldoTd.attr('data-valor'))
            });
        });
        reunificarControl.grabarReunificacion(datos, that.onGrabarCompleto);
    },
    /** Captura la respuesta del servidor cuando se graba la reunificación de las financiaciones
     * @param {object} data - Respuesta del servidor al grabar reunificación
     * @returns {void}
     */
    onGrabarCompleto: function (data) {
        //debugger;
        __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
        that.limpiarFormulario();
    },
    /** Cancela la operación actual (Crear o consultar financiación)
     * @returns {void}
     */
    cancelarReunificacion: function () {
        if (!!reunificarModel.suscripcion) {
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
        reunificarModel = {
            totalFinanciar: 0
        };
        $('#cmbTipoDoc').empty();
        $('input[type="text"]').val('');
        $('#tblFinanciaciones, #cmbTipoLiquidacion').html('');
        $('#divFinanciacion').hide();
    }
};
reunificarFinanciacionVista.init();