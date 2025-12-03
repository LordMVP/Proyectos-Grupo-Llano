/**
 * @fileOverview Archivo de vista y control de notas automáticas
 * @author angelicaGomez
 * @requires notasautomaticas.control.js
 * @requires notasautomaticas.modelo.js
 * @version 1.0.0
 */
/**
 * Objeto que hace referencia al namespace notasVista
 * @type {Object}
 */
var that = null;
/** @namespace */
var notasVista = {
    /** Hace referencia al último dialogo abierto en la aplicación
     * @type {object}
     */
    dialogoActual: null,
    /** Hace referencia al diálogo del procesamiento de facturas
     * @type {object}
     */
    dialogoProceso: null,
    /** Inicializa el programa de notas automáticas, y asigna listeners a los controles
     * @returns {void}
     */
    init: function () {
        that = this;


        $('#divPestanias').tabs();
        $('#divPestanias').on('click', 'a', that.mostrarOcultarSuscripcion);
        var activada = $("#divPestanias").tabs("option", "active");
        notasModel.tipo = $('#divPestanias a:eq(' + activada + ')').attr('data-tipo');
        //that.validarPestaniaHabilitada(arrayHabilitadas);

        $('#btnBuscar').on('click', that.filtrarSuscripciones);
        $('#btnCancelar').on('click', that.confirmarCancelar);
        $('#btnProcesar').on('click', that.validarProcesar);
        $('#btnAplicarNotas').on('click', that.aplicarNotas);
        $('#btnBuscarSuscripcion').on('click', that.mostrarFiltroSuscripcion);
        $('#btnBuscarFacturasSuscripcion').on('click', that.mostrarFiltroFacturaSuscripcion);
        //$('#rbtnSusUnica, #rbtnSusMultiple').on('click', that.mostrarOcultarSuscripcion);
        //$('#rbtnNotaCalculo, #rbtnNotaValor').on('click', that.mostrarValoresNotas);

        $('#txtTipoDocumentoFiltro').on('change', that.consultarDocumentos);
        $('#txtTipoDocumentoFiltroSuscripcion').on('change', that.consultarDocumentosSuscripcion);
        $('#btnAgregarFiltro').on('click', that.agregarFiltro);
        $('#btnBuscarFacturas').on('click', that.consultarFacturas);
        //$('#cmbLiquidacion').on('change', that.consultarConcepto);
        $('#btnAgregarValor').on('click', that.agregarValor);
        $('#btnQuitarValor').on('click', that.eliminarValor);

        $('#txtDocumentoFiltro').on('change', that.consultarLiquidaciones);
        $('#txtDocumentoFiltroSuscripcion').on('change', that.consultarLiquidacionesSuscripcion);
        $('.link-archivo').on('click', that.validarFacturasProcesadas);

        __dom.configurarTextoNumerico('txtFiltroSus, #txtFiltroCodAnt');
        $('#btnAplicarNotas').attr('disabled', true);
        that.configurarAutocomplete();
        notasControl.consultarMotivos(that.onConsultarMotivosCompleto);
    },
    /**
     * Asigna funcionalidad a cajas de texto para autocompletar con sus respectivas propiedades y recursos.
     * @returns {void}
     */
    configurarAutocomplete: function () {
        //Consulta municipios para filtrar una suscripción
        __dom.configurarAutocomplete(
                '#txtFiltroMunicipo', that.sourceAutoComplete,
                function (event, ui) {
                    notasModel.municipioFiltro = ui.item.idVal;
                    $('input#txtFiltroMunicipo').attr('data-id', ui.item.idVal);
                },
                function () {
                    notasModel.municipioFiltro = undefined;
                    $('input#txtFiltroMunicipo').removeAttr('data-id');
                }
        );
        __dom.configurarAutocomplete(
                '#txtMunicipio', that.sourceAutoComplete,
                function (event, ui) {
                    notasModel.municipio = ui.item.idVal;
                    $('input#txtMunicipio').attr('data-id', ui.item.idVal);
                    $('#txtBarrio').attr('disabled', false);
                },
                function () {
                    notasModel.municipio = undefined;
                    $('input#txtMunicipio').removeAttr('data-id');
                    $('#txtBarrio').attr('disabled', true);
                }
        );
        __dom.configurarAutocomplete(
                '#txtBarrio', that.sourceAutoCompleteBarrio,
                function (event, ui) {
                    notasModel.barrio = ui.item.idVal;
                    $('input#txtBarrio').attr('data-id', ui.item.idVal);
                },
                function (event, ui) {
                    notasModel.barrio = undefined;
                    $('input#txtBarrio').removeAttr('data-id');
                }
        );
    },
    /** Realiza la petición AJAX para consultar municipos de los autocomplete
     * @returns {void}
     */
    sourceAutoComplete: function (request, response) {
        that.request = request;
        that.response = response;
        var datos = {};
        if (request.term.trim() !== '') {
            datos.municipio = request.term;
            notasControl.consultarMunicipio(datos, that.mostrarResultado);
        }
    },
    /** Muestra el resultado de la consulta de los municipos en la lista desplegable.
     * @returns {void}
     */
    mostrarResultado: function (data) {
        if (data.codigoRespuesta === 1) {
            var result = [];
            $.each(data.municipios, function (i, item) {
                result.push({
                    label: item.municipio,
                    value: item.municipio,
                    idVal: item.idmunicipio,
                });
            });
            that.response(result);
        }
    },
    /** Realiza la petición AJAX para consultar los barrios del autocomplete
     * @returns {void}
     */
    sourceAutoCompleteBarrio: function (request, response) {
        that.request = request;
        that.response = response;
        var datos = {};
        if (request.term.trim() !== '' && !!$('#txtMunicipio').attr('data-id') && notasModel.municipio) {
            datos.barrio = request.term;
            datos.municipios = $('#txtMunicipio').attr('data-id');
            notasControl.consultarBarrio(datos, that.mostrarResultadoBarrio);
        }
    },
    /** Muestra el resultado de la consulta de los barrios en la lista desplegable.
     * @returns {void}
     */
    mostrarResultadoBarrio: function (data) {
        if (data.codigoRespuesta === 1) {
            var result = [];
            $.each(data.datos, function (i, item) {
                result.push({
                    label: item.barrio,
                    value: item.barrio,
                    idVal: item.idbarrio,
                });
            });
            that.response(result);
        }
    },
    /** Muestra el resultado de la consulta de los conceptos en la lista desplegable.
     * @returns {void}
     */
    mostrarResultadoConcepto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                $('#spanFiltroFactura').val(data.mensaje);
                break;
            case 1:
                __dom.llenarCombo('#cmbFiltroConceptos', data.conceptos, 'idconcepto', 'concepto');
                break
        }
    },
    /** Muestra el filtro de facturas según el tipo de
     * afectación que se haya elegido
     * @returns {void}
     **/
    mostrarOcultarSuscripcion: function () {
        notasModel.tipo = $(this).attr('data-tipo');
        notasModel.valores = [];
        that.llenarTablaValor();

        notasModel.filtroFactura = [];
        $('#divSuscripcion input:text').val('');
        $('#divFacturas, #btnQuitarFiltro, #btnQuitarValor').hide();
        $('#txtDocumentoFiltro, #tblFacturas, #tblFiltros, #txtConcepto').empty();

        switch (notasModel.tipo) {
            case 'S':
                $('#divCmbLiquidacion').show(0);
                $('#divTxtLiquidacion').hide(0);
                break;
            case 'V':
                notasModel.suscripcion = null;
                $('#divCmbLiquidacion').hide(0);
                $('#divTxtLiquidacion').show(0);
                break;
        }
    },
    /** Muestra cuadro de diálogo para buscar una suscripción
     * @returns {void}
     **/
    mostrarFiltroSuscripcion: function () {
        that.dialogoActual = $('#camposBuscarSuscripcion').dialogo({
            modal: true,
            width: 850,
            title: 'Buscar una suscripción'
        });
    },
    /** Muestra cuadro de diálogo para buscar una suscripción
     * @returns {void}
     **/
    mostrarFiltroFacturaSuscripcion: function () {
        if (!notasModel.suscripcion) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarSuscripcion, __app.mensajes.atencion);
            return;
        }
        that.dialogoActual = $('#divDialogoBusquedaFactura').dialogo({
            modal: true,
            width: 850,
            title: 'Buscar facturas',
            buttons: {
                'Buscar': that.validarFiltroFactura
            }
        });
    },

    /**
     * Valida el filtro de facturas y si todo está bien, consulta las facturas que coincidan con los filtros
     * @returns {void} 
     */
    validarFiltroFactura: function () {
        var span = $('#pMensajeFiltroFacturas').text('');
        var liquidacion = $('#cmbLiquidacionSuscripcion').val();
        var documento = $('#txtDocumentoFiltroSuscripcion').val();
        var tipoDocumento = $('#txtTipoDocumentoFiltroSuscripcion').val();

        if (!liquidacion || liquidacion === '-1' || !documento || documento === '-1' || !tipoDocumento || tipoDocumento === '-1') {
            span.text('Todos los campos son obligatorios, intente nuevamente');
            return;
        }
        //notasModel.cantidadMesSuscripcion = cantMes;
        idsuscripcion = notasModel.suscripcion.idsuscripcion;
        var data = {
            tipo: 'S',
            iddocumento: documento,
            idliquidacion: liquidacion,
            idsuscripcion: idsuscripcion,
            idtipodocumento: tipoDocumento,
            idciclo: notasModel.suscripcion.idciclo
        };
        notasControl.consultarFacturas({parametros: [data]}, that.onConsultarFacturasCompleto);

    },
    /** Valida información para consultar la suscripción, en caso de ser correcta
     * hace petición ajax para consultar suscripciones
     * @returns {void}
     **/
    filtrarSuscripciones: function () {
        var contenedor = $('#camposBuscarSuscripcion');
        contenedor.find('#spanMensaje').hide().text('');
        contenedor.find('.listaSeleccion').remove();
        var suscripcion = contenedor.find('#txtFiltroSus').val().trim();
        var documento = contenedor.find('#txtFiltroDoc').val().trim();
        var codanterior = contenedor.find('#txtFiltroCodAnt').val().trim();
        var municipio = contenedor.find('#txtFiltroMunicipo').attr('data-id');
        var propiedad = contenedor.find('#txtIdPropiedad').val().trim();
        if (municipio === '' || $('#txtFiltroMunicipo').val().trim() === '' || !notasModel.municipioFiltro) {
            contenedor.find('#spanMensaje').show().text(__app.mensajes.seleccionarMunicipio);
            contenedor.find('.listaSeleccion').remove();
            return;
        }
        if (suscripcion === '' && documento === '' && codanterior === '' && propiedad === '') {
            contenedor.find('#spanMensaje').show().text(__app.mensajes.camposInvalidosFiltro);
            contenedor.find('.listaSeleccion').remove();
            return;
        }
        var data = {
            cedula: documento,
            propiedad: propiedad,
            idmunicipio: municipio,
            idsuscripcion: suscripcion,
            codigoanterior: codanterior
        };
        notasControl.consultarSuscripciones(data, that.onFiltrarSuscripcionCompleto);
    },
    /** Captura la respuesta del servidor cuando se consultan las suscripciones
     * en caso de que haya más de una suscripción posibilita la selección de alguna
     * @param {object} data - Respuesta del servidor con suscripciones con coincidencias
     * @returns {void}
     **/
    onFiltrarSuscripcionCompleto: function (data) {
        that.reiniciarTablaValores();
        that.limpiarFormulario();
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(__app.mensajes.sinResultados, __app.mensajes.atencion);
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
                        label.text('Tercero: ' + susc.nombretercero + ' - ' + susc.cedula
                                + ' - Suscripción: ' + susc.idsuscripcion
                                + ' - Cód Anterior: ' + susc.codigoanterior);
                        div.append(radio).append(label);
                        divSuscripciones.append(div);
                    });
                    var btn = $('<button>').text('Seleccionar').addClass('btnSimple');
                    btn.on('click', function () {
                        var suscSeleccionada = that.dialogoActual.find('input[name="radio_suscripciones"]:checked');
                        if (suscSeleccionada.length > 0) {
                            sus = notasModel.suscripcion = data.suscripciones[parseInt(suscSeleccionada.attr('data-indice'))];
                            that.dialogoActual.find('#spanMensaje').hide();
                            that.dialogoActual.dialog('close');
                            divSuscripciones.remove();
                            that.cargarCabecera(sus);
                        } else {
                            that.dialogoActual.find('#spanMensaje').text(__app.mensajes.seleccionarOpcion).show();
                        }
                    });
                    divSuscripciones.insertAfter(that.dialogoActual.find('#spanMensaje'));
                    divSuscripciones.append(btn);
                } else {
                    sus = notasModel.suscripcion = data.suscripciones[0];
                    that.dialogoActual.find('#spanMensaje').hide();
                    that.dialogoActual.dialog('close');
                    that.cargarCabecera(sus);
                }
                break;
        }
    },
    /** Muestra la información de la suscripción elegida en el filtro y hace petición ajax
     * para consultar las facturas de la suscripción
     * @param {object} sus - Información de la suscripción seleccionada
     * @returns {void}
     **/
    cargarCabecera: function (sus) {
        notasModel.filtroFactura = [];
        $('#txtSuscripcion').val(sus.idsuscripcion);
        $('#txtDocumento').val(sus.cedula);
        $('#txtNombre').val(sus.nombretercero);
        $('#txtCodAnterior').val(sus.codigoanterior);
        $('#txtSuscMunicipo').val(sus.municipio);
        $('#txtSuscBarrio').val(sus.barrio);
        $('#txtDireccion').val(sus.direccion);
        $('#txtTelefono').val(sus.telefonofijo);
        $('#txtCelular').val(sus.telefonocelular);
        $('#txtSuscTipoUso').val(sus.tipousosuscripcion);


        var cmbLiquidacionSus = $('#cmbLiquidacionSus').empty().attr('disabled', 'disabled');
        var optLiquidacion = $('<option>').val(sus.idliquidacion).text(sus.liquidacion);
        cmbLiquidacionSus.append(optLiquidacion).val(sus.idliquidacion);

        var dataConceptos = {
            idliquidacion: sus.idliquidacion
        };
        notasControl.consultarTipoDocumentoSuscripcion({idsuscripcion: sus.idsuscripcion}, that.onConsultarTipoDocumentoCompleto);
        /*notasControl.consultarConceptos(dataConceptos, function (data) {
         if (data.codigoRespuesta === 1) {
         __dom.llenarCombo($('#txtConcepto'), data.conceptos, 'idconcepto', 'concepto');
         }
         });*/

    },

    /**
     * Se ejecuta cuando se terminan de consultar los tipos de de documento y carga el combo de tipos de documento
     * @param  {Object} data Respuesta del servidor
     * @returns {void}
     */
    onConsultarTipoDocumentoCompleto: function (data) {
        var cmbTipoDoc = $('#txtTipoDocumentoFiltroSuscripcion').empty();
        if (data.codigoRespuesta === 1) {
            __dom.llenarCombo(cmbTipoDoc, data.datos, 'idtipodocumento', 'tipodocumento');
        }
    },
    /** Valida la información del filtro de facturas en caso de que sea correcta hace petición ajax
     * para consultar facturas con coincidencias
     * @returns {void}
     **/
    consultarFacturas: function () {
        var tipo = notasModel.tipo;
        var data = {tipo: tipo};

        if (tipo === 'V') {
            var mensaje = '';
            var input = $('#divVariasSuscripciones').find('input:text[required="required"], select[required="required"]');
            for (var i = 0; i < input.length; i++) {
                var tag = input[i].tagName;
                var caja = $(input[i]);
                if ((tag === 'INPUT' && caja.val() === '') || (tag === 'SELECT' && (caja.val() === '-1' || caja.val() === null))) {
                    var label = caja.parent().find('label').text();
                    var nombre = label.substring(0, label.length - 1);
                    mensaje += 'El campo <b>' + nombre + '</b> es obligatorio <br>';
                }
            }
            if (mensaje !== '') {
                __dom.lanzarAlerta(mensaje, __app.mensajes.atencion);
                return;
            } else {
                data['idciclo'] = $('#txtCiclo').val();
                data['idtipodocumento'] = $('#txtTipoDocumentoFiltro').val();
                data['iddocumento'] = $('#txtDocumentoFiltro').val();
                data['idliquidacion'] = $('#cmbLiquidacion').val();
                data['idmunicipio'] = $('#txtMunicipio').val().trim() !== '' ?
                        $('#txtMunicipio').attr('data-id') : null;
                data['idbarrio'] = $('#txtBarrio').val().trim() !== '' ?
                        $('#txtBarrio').attr('data-id') : null;
            }
        }
        notasControl.consultarFacturas({parametros: [data]}, that.onConsultarFacturasCompleto);
    },
    /**Captura la respuesta del servidor cuando se consultan las facturas de un filtro
     * En caso de que si hayan facturas se visualizará en tablas paginadas y hace petición ajax
     * para consultar tipos de documentos de las facturas filtradas
     * @param {object} data - Respuesta del servidor con facturas con coincidencias
     * @returns {void}
     **/
    onConsultarFacturasCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                $('#divFacturas').hide();
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                break;
            case 1:
                if (that.dialogoActual) {
                    that.dialogoActual.dialog('close');
                }

                that.consultarConcepto($('#cmbLiquidacionSuscripcion'));

                for (var f = 0; f < data.facturas.length; f++) {
                    var fact = data.facturas[f];
                    fact.verificable = false;
                }
                if (!data.filtro) {
                    notasModel.facturas = data.facturas;
                } else {
                    notasModel.facturasFiltradas = data.facturas;
                }

                var table = $('#tblFacturas').empty();
                var tabla = table.dataTable({
                    "data": data.facturas,
                    "columns": formatoFacturas,
                    "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        var fila = $(nRow).attr('data-id', aData['idfactura']);
                        $(nRow).attr('data-value', aData['idsuscripcion']);
                        that.rowCallback(nRow, aData);
                    },
                    "language": {
                        url: "/achagua/sistema/web/bundles/Llanogas/js/facturacion/Spanish.json"
                    },
                    "destroy": true,
                    initComplete: that.agregarCheck
                });
                $('#divFacturas').show();
                break;
        }
    },
    /** Agrega checkbox en la cabecera de la tabla de facturas
     * @returns {void}
     **/
    agregarCheck: function () {
        var label = $('<label>').text('Selecc.').attr('for', 'checkSeleccion').css('display', 'inline-block');
        var check = $('<input>').attr({'type': 'checkbox', 'id': 'checkSeleccion'});
        check.on('click', that.seleccionarTodas);
        $($('#tblFacturas thead tr th')[0]).text('')
                .append(check, label)
                .attr('aria-label', '')
                .css({'text-align': 'left', 'padding-left': '8px'});
    },
    /** Selecciona todas la filas de la tabla de facturas
     * @returns {void}
     **/
    seleccionarTodas: function () {
        var check = $(this);
        var seleccionado = check.is(':checked');
        notasModel.facturasSeleccionadas = [];
        for (var i = 0; i < notasModel.facturas.length; i++) {
            notasModel.facturas[i].seleccionado = seleccionado;
            if (seleccionado) {
                notasModel.facturasSeleccionadas.push(notasModel.facturas[i].idfactura);
            }
        }
        $('#tblFacturas').DataTable().draw();
        //$('#tblFacturas tbody tr td input:checkbox').removeProp('checked');
    },
    /** Agrega controles con respectivo listener a tabla de facturas filtradas
     * @param nRow - Fila en la que se agregará el control
     * @param aData - Información asignada a la fila actual
     * @returns {void}
     **/
    rowCallback: function (nRow, aData) {
        nRow = $(nRow);
        var factura = aData['idfactura'];
        var seleccionado = (aData.seleccionado) ? aData.seleccionado : false;
        var procesado = aData.procesado;
        var atributos = {'data-id': factura};

        var label = $('<label>').text('Selecc.')
                .attr('for', 'checkSeleccion' + factura);
        var check = $('<input>').attr({
            'checked': seleccionado, // $(nRow).hasClass('selected'),
            'data-id': factura,
            'type': 'checkbox',
            'id': 'checkSeleccion' + factura
        });

        var btn = $('<button>').text('Detalles')
                .addClass('tblBtn')
                .attr(atributos)
                .attr('id', 'btnDetalle' + factura);

        var verficar = $('<button>').text('Verificar')
                .addClass('tblBtn')
                .attr(atributos)
                .attr('id', 'btnVerificar' + factura);

        if (seleccionado) {
            nRow.addClass('selected');
            btn.removeAttr('disabled');
            verficar.attr('disabled', !aData.verificable);
        } else {
            nRow.removeClass('selected');
            btn.attr('disabled', 'disabled');
            verficar.attr('disabled', 'disabled');
        }

        if (procesado) {
            verficar.removeAttr('disabled');
        } else {
            verficar.attr('disabled', 'disabled');
        }

        check.off('click').on('click', that.seleccionarFactura);
        btn.on('click', that.consultarDetalleFactura);
        verficar.on('click', that.verificarFactura);

        var tds = $(nRow).find('td');
        $(tds[11]).empty().append(btn);
        $(tds[12]).empty().append(verficar);
        $($(nRow).find(':nth-child(1)')[0]).empty().append(check, label);
    },
    /** Selecciona y habilita controles de una facturas
     * @returns {void}
     **/
    seleccionarFactura: function () {
        var _this = $(this);
        var fila = _this.parent().parent();
        var idFactura = _this.attr('data-id');
        var factura = notasControl.obtenerFacturaPorId(idFactura);
        if (_this.prop('checked')) {
            factura.seleccionado = true;
            fila.addClass('selected');
            fila.find('button[id^="btnDetalle"]').removeAttr('disabled');
            notasControl.agregarFacturaSeleccionada(idFactura);

            var btnAplicarNotas = $('#btnAplicarNotas');
            if (!btnAplicarNotas.is(':disabled')) {
                btnAplicarNotas.attr('disabled', 'disabled');
            }

        } else {
            factura.seleccionado = false;
            fila.removeClass('selected');
            fila.find('button').attr('disabled', 'disabled');
            $('#checkSeleccion').removeProp('checked');
            notasControl.removerFacturaSeleccionadaPorId(idFactura);
        }
    },

    /**
     * Valida el valor de la operación y retorna un texto asociado a la abreviatura
     * @param  {String} operacion Texto que se valida: NC, ND, NS
     * @returns {String}           Cadena de texto correspondiente a la abreviatura
     */
    verificarOperacionConcepto: function (operacion) {
        switch (operacion) {
            case 'NC':
                return 'Nota Crédito';
            case 'ND':
                return 'Nota Débito';
            case 'NS':
                return 'Nota saldo a favor y Anticipo';
            default:
                return operacion;

        }
    },
    /** Hace petición ajax para consultar los detalles de una factura.
     * @returns {void}
     **/
    consultarDetalleFactura: function () {
        var _this = $(this);
        notasControl.consultarDetallesFacturas({idfactura: _this.attr('data-id')}, that.onConsultarDetalleFacturaCompleto);
    },
    /** Captura la respuesta del servidor cuando se consultan los detalles de una facturas
     * y son mostrados en un cuadro de diálogo.
     * @param {object} data - Respuesta del servidor con los conceptos del detalle de la factura
     * @returns {void}
     **/
    onConsultarDetalleFacturaCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                break;
            case 1:
                notasModel.conceptos = data.conceptos;
                var fac = data.conceptos[0].idfactura
                fillTable('tblConceptos', 'formatoConceptos', 'notasModel.conceptos', 'Conceptos');
                $('#divDetalleFactura').dialogo({
                    modal: true,
                    width: 850,
                    title: 'Detalles de la factura' + fac,
                    buttons: {
                        'Aceptar': function () {
                            $(this).dialog('close');
                        }
                    }
                });
                break;
        }
    },
    /** Hace petición ajax para consultar los documentos según
     * tipo de documento y facturas filtradas cuando recibe la información se carga un combo
     * @returns {void}
     **/
    consultarDocumentos: function () {
        var _this = $(this);
        var combo = $('#txtDocumentoFiltro').empty();
        $('#cmbLiquidacion').empty();
        if (_this.val() !== '-1') {
            notasControl.consultarDocumentos({idtipodocumento: _this.val()}, function (data) {
                if (data.codigoRespuesta === 1) {
                    __dom.llenarCombo(combo, data.documentos, 'iddocumento', 'documento');
                }
            });
        }
    },
    /** Hace petición ajax para consultar los documentos según
     * tipo de documento y la suscripción seleccionada
     * @returns {void}
     **/
    consultarDocumentosSuscripcion: function () {
        var _this = $(this);
        var idsuscripcion = notasModel.suscripcion.idsuscripcion;
        $('#cmbLiquidacionSuscripcion').empty();
        var combo = $('#txtDocumentoFiltroSuscripcion').empty();
        if (_this.val() !== '-1') {
            var dataEnviar = {
                idtipodocumento: _this.val(),
                idsuscripcion: idsuscripcion
            }
            notasControl.consultarDocumentos(dataEnviar, function (data) {
                if (data.codigoRespuesta === 1) {
                    __dom.llenarCombo(combo, data.documentos, 'iddocumento', 'documento');
                }
            });
        }
    },
    /** Hace petición ajax para consultar liquidaciones según documento y tipodocumento
     *@return {void}
     **/
    consultarLiquidaciones: function () {
        var documento = $('#txtDocumentoFiltro').val();
        var tipodocumento = $('#txtTipoDocumentoFiltro').val();

        if (documento !== '-1' && documento !== '' && tipodocumento !== '-1') {
            var data = {
                iddocumento: documento,
                idtipodocumento: tipodocumento
            };
            var combo = $('#cmbLiquidacion').empty();
            notasControl.consultarLiquidacion(data, function (data) {
                that.onConsultarLiquidacionCompleto(data, combo)
            });
        }
    },

    /**
     * Se ejecuta cuando se terminan de consultar las liquidaciones.
     * @param  {Object} data  Respuesta del servidor
     * @param  {Object} combo El combo que se debe llenar con los datos.
     * @returns {void}
     */
    onConsultarLiquidacionCompleto: function (data, combo) {
        if (data.codigoRespuesta === 1) {
            for (var i = 0; i < data.liquidacion.length; i++) {
                var liquidacion = data.liquidacion[i];
                var opcion = $('<option>')
                        .text(liquidacion.liquidacion)
                        .val(liquidacion.idliquidacion)
                        .attr('data-tipo', liquidacion.tipoliquidacion);
                combo.append(opcion);
            }
        }
    },
    /** Hace petición ajax para consultar liquidaciones según documento, tipodocumento y suscripción
     *@return {void}ssssss
     **/
    consultarLiquidacionesSuscripcion: function () {
        var combo = $('#cmbLiquidacionSuscripcion').empty();
        var idsuscripcion = notasModel.suscripcion.idsuscripcion;
        var documento = $('#txtDocumentoFiltroSuscripcion').val();
        var tipodocumento = $('#txtTipoDocumentoFiltroSuscripcion').val();
        if (documento !== '-1' && documento !== '' && tipodocumento !== '-1') {
            var data = {
                iddocumento: documento,
                idsuscripcion: idsuscripcion,
                idtipodocumento: tipodocumento
            };
            notasControl.consultarLiquidacion(data, function (data) {
                that.onConsultarLiquidacionCompleto(data, combo);
            });
        }
    },
    /** Valida los campos obligatorios para un filtro adicional, que una combinación de filtro aún no exista,
     * en caso de todo ser correcto agrega el filtro adicional
     * @returns {void}
     **/
    agregarFiltro: function () {
        var cmbFiltroConcepto = $('#cmbFiltroConceptos');
        var idConcepto = cmbFiltroConcepto.val();
        var strConcepto = cmbFiltroConcepto.find('option:selected').text();

        if (cmbFiltroConcepto.val().trim() === '-1') {
            __dom.lanzarAlerta('Debe seleccionar un concepto', __app.mensajes.atencion);
            return;
        }

        if (notasControl.buscarConceptoFiltro(idConcepto)) {
            __dom.lanzarAlerta('El concepto ' + strConcepto + ' ya está en el filtro.', __app.mensajes.atencion);
            return;
        }

        notasModel.filtroFactura.push({
            idConcepto: idConcepto,
            valorconcepto: '',
            concepto: strConcepto
        });

        cmbFiltroConcepto.val('-1');
        that.llenarTablaFiltro();
    },
    /** Llena la tabla de filtros adicionales para aplicar a las facturas antes filtradas
     * y asigna listeners a sus controles.
     * @returns {void}
     **/
    llenarTablaFiltro: function () {
        $('#tblFiltros').empty();
        if (notasModel.filtroFactura.length > 0) {
            var tabla = fillTable('tblFiltros', 'formatoFiltro', 'notasModel.filtroFactura', 'Conceptos para la búsqueda');
            var input = __dom.configurarTextoNumerico(tabla.find('tr td[header="thValor"] input:text'), true);
            input.css('width', '90%');
            input.on('blur', function () {
                var _this = $(this);
                var indice = _this.parent().parent().attr('data-fila');
                notasModel.filtroFactura[indice].valorconcepto = _this.val();
            });
            tabla.find('tbody tr td[header="thEliminar"] input:button').on('click', that.eliminarFiltro);
        }
    },
    /** Elimina una fila de la tabla de filtros adicionales
     * @returns {void}
     **/
    eliminarFiltro: function () {
        var btn = $(this);
        var tr = btn.parent().parent();
        var indice = parseInt(tr.attr('data-indice'));
        notasModel.filtroFactura.splice(indice, 1);
        that.llenarTablaFiltro();
        return;
    },
    /** Hace petición ajax para consultar las facturas que coincidan con los dos filtros
     * @returns {void}
     **/
    aplicarFiltroFacturas: function () {
        var filtros = notasModel.filtroFactura;
        var strDoc = $('#txtTipoDocumentoFiltro').val();
        var strTipDoc = $('#txtDocumentoFiltro').val();

        if (filtros.length > 0) {
            var strConc = [];
            for (var i = 0; i < filtros.length; i++) {
                var filtro = filtros[i];
                var valor = filtro.valorconcepto.trim() === '' ? -1 : filtro.valorconcepto.trim()
                strConc.push({
                    idconcepto: filtro.idConcepto,
                    valor: valor
                });
            }
            var data = {
                documentos: strDoc,
                tipodocumentos: strTipDoc,
                conceptos: strConc
            };
            notasControl.consultarFacturasFiltro(data, that.onAplicarFiltroFacturaCompleto);
        } else {
            that.dialogoActual.dialog('close');
        }
    },
    /** Captura la respuesta del servidor cuando se conusltan las facturas con doble filtro
     * @param {object} data - Respuesta del servidor con facturas filtradas
     * @returns {void}
     **/
    onAplicarFiltroFacturaCompleto: function (data) {
        $('#spanFiltroFactura').text('');
        switch (data.codigoRespuesta) {
            case 0:
                $('#spanFiltroFactura').text('No se encontraron facturas, intente con otros filtros');
                break;
            case 1:
                data.filtro = true;
                that.onConsultarFacturasCompleto(data);
                that.dialogoActual.dialog('close');
                break;
        }
    },
    /** Consulta los conceptos de una liquidación y según el tipo de nota elegido
     * @returns {void}
     **/
    consultarConcepto: function (liq) {
        if (notasModel.tipo === 'V') {
            liq = $('#cmbLiquidacion');
        } else {
            liq = $('#cmbLiquidacionSuscripcion');
        }


        if (liq.val() !== '-1' && liq.val() !== '' && liq.val() !== null) {
            var cmbLiquidacion = liq.find('option:selected');
            $('#txtLiquidacion').val(cmbLiquidacion.text());
            var data = {
                tipo: 'C',
                idliquidacion: liq.val(),
                tipoliquidacion: cmbLiquidacion.attr('data-tipo')
            };
            notasControl.consultarConceptos(data, function (data) {
                if (data.codigoRespuesta === 1) {
                    __dom.llenarCombo($('#txtConcepto'), data.conceptos, 'idconcepto', 'concepto');
                }
            });
        }
    },
    /** Valida la información para Agregar / Asignar Valores para el tipo de nota elegido
     * @returns {void}
     **/
    agregarValor: function () {
        var liquidacion = {};
        if (notasModel.tipo === 'S') {
            liquidacion.idliquidacion = $('#cmbLiquidacionSus').val();
            liquidacion.liquidacion = $('#cmbLiquidacionSus option:selected').text();
        } else {
            liquidacion.idliquidacion = $('#cmbLiquidacion').val();
            liquidacion.liquidacion = $('#txtLiquidacion').val();
        }

        var conc = $('#txtConcepto');
        if (liquidacion.idliquidacion === '-1' || (conc.val() === '-1' || !conc.val())) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarLiquidacion + ' y concepto', __app.mensajes.atencion);
            return;
        }
        var idliq = parseInt(liquidacion.idliquidacion);
        var idconc = parseInt(conc.val());
        var combinacion = notasControl.consultarCombinacionLiquidacion(idliq, idconc);

        if (!combinacion) {
            __dom.lanzarAlerta('No se puede agregar, la combinación ya existe', __app.mensajes.atencion);
            return;
        }
        notasModel.valores.push({
            idliquidacion: idliq,
            liquidacion: liquidacion.liquidacion,
            idconcepto: idconc,
            concepto: conc.find('option:selected').text()
        });
        that.llenarTablaValor();

    },
    /** Llena la tabla de liquidación-conceptos para asignación de valores a la nota
     * y asigna listeners a sus controles.
     * @returns {void}
     **/
    llenarTablaValor: function () {
        $('#divValores').show();
        $('#tblValores').empty();
        if (notasModel.valores.length === 0) {
            $('#btnQuitarValor').hide();
            $('#cmbLiquidacionSus').attr('disabled', false);
            return;
        }


        $('#btnQuitarValor').show();
        $('#cmbLiquidacionSus').attr('disabled', true);
        fillTable('tblValores', 'formatoLiquidacionConcepto', 'notasModel.valores', '');
        //var val = __dom.configurarTextoNumerico(tabla.find('tr td[header="thValor"] input:text'), false, true, true);
        //val.on('blur', that.agregarValorConcepto);
    },

    /**
     * Agrega un valor a un concepto de una fila seleccionada.
     * @returns {void} 
     */
    agregarValorConcepto: function () {
        var _this = $(this);
        var indice = _this.parent().parent().attr('data-fila');
        notasModel.valores[indice].valor = _this.val();
    },
    /** Elimina una fila de la tabla de valores de la nota
     * @returns {void}
     **/
    eliminarValor: function () {
        var check = $('#tblValores tbody tr td input:checked');
        if (check.length > 0) {
            for (var i = check.length - 1; i >= 0; i--) {
                notasModel.valores.splice(i, 1);
            }
            that.llenarTablaValor();
        }
    },
    /** Valida la información para procesar las facturas
     * @returns {void}
     **/
    validarProcesar: function () {
        if (!!notasModel.facturas) {
            if (notasModel.facturasSeleccionadas.length === 0) {
                __dom.lanzarAlerta(__app.mensajes.seleccionarFacturas, __app.mensajes.atencion);
                return;
            }

            __dom.lanzarAlerta('Esto procesará las notas ¿Desea continuar?',
                    __app.mensajes.atencion, that.procesarNotas, true);
        }
    },

    /**
     * Reinicia la tabla de valores y borra los datos del modelo
     * @returns {void} 
     */
    reiniciarTablaValores: function () {
        $('#tblValores').empty();
        $('#divValores').hide();
        $('#btnQuitarValor').hide();
        notasModel.valores = [];
    },
    /** Hace petición ajax para procesar las facturas seleccionadas
     * @returns {void}
     **/
    procesarNotas: function () {
        var strConceptos = "";
        var idliquidacion = null;
        var tipoliquidacion = null;
        var facturas = notasControl.obtenerFacturaSeleccionada();
        if (facturas.length === 0) {
            __dom.lanzarAlerta('Debe seleccionar las facturas para procesar notas ', __app.mensajes.atencion);
            return;
        }
        if (notasModel.valores.length === 0) {
            __dom.lanzarAlerta('Debe seleccionar conceptos', __app.mensajes.atencion);
            return;
        }

        for (var c = 0; c < notasModel.valores.length; c++) {
            var val = notasModel.valores[c].idconcepto;
            strConceptos += val + ',';
        }

        strConceptos = strConceptos.substring(0, strConceptos.length - 1);
        if ($('#cmbLiquidacion').is(':visible')) { //si la pestaña de varias suscripciones está activa
            idliquidacion = $('#cmbLiquidacion').val();
            tipoliquidacion = $('#cmbLiquidacion option:selected').attr('data-tipo');
        } else {
            idliquidacion = $('#cmbLiquidacionSuscripcion').val();
            tipoliquidacion = $('#cmbLiquidacionSuscripcion option:selected').attr('data-tipo');
        }
        var data = {
            idliquidacion: idliquidacion,
            conceptos: strConceptos,
            facturas: facturas,
            tipoliquidacion: tipoliquidacion
        };

        notasModel.procesoCompleto = false;
        notasControl.procesaraFacturas(data, that.onProcesarNotasCompleto);
        notasModel.proceso = setInterval(function () {
            notasControl.consultarProceso(
                    that.consultarProceso,
                    function () { //función de callback en caso de error
                        clearInterval(notasModel.proceso);
                        that.consultarErrores();
                        that.dialogoProceso.dialog('close');
                    }
            );
        }, 7000);
        that.dialogoProceso = $('#divDialogProcesando').dialogo({
            modal: true,
            width: 550,
            closeOnEscape: false,
            //beforeClose: function (event, ui) { return false; },
            dialogClass: "noclose",
            title: 'Procesamiento facturas'
        });
    },

    /**
     * Consulta el progreso de la aplicación de las notas
     * @param  {Object} data Respuesta del servidor
     * @returns {void}      
     */
    consultarProceso: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                that.consultarErrores();
                notasModel.procesoCompleto = true;
                that.dialogoProceso.dialog('close');
                clearInterval(notasModel.proceso);
                if (!notasModel.procesoMal) {
                    $('#btnAplicarNotas').removeAttr('disabled');
                    for (var i = 0; i < notasModel.facturasSeleccionadas.length; i++) {
                        var idFactura = parseInt(notasModel.facturasSeleccionadas[i]);
                        var factura = notasControl.obtenerFacturaPorId(idFactura);
                        if (factura) {
                            factura.procesado = true;
                        }
                    }
                    $('#tblFacturas').DataTable().draw();
                }

                break;
            case -1:
                that.dialogoProceso.dialog('close');
                clearInterval(notasModel.proceso);
                break;
        }
    },

    /**
     * Consulta los errores de la aplicación de notas y carga la tabla de errores en caso de haberlos
     * @returns {void} 
     */
    consultarErrores: function () {
        $('#tblErrores').empty();
        notasControl.consultarErrores(function (data) {
            if (data.codigoRespuesta === 1 && data.errores.length > 0) {
                var caption = 'Errores (' + data.errores.length + ')';
                fillTable('tblErrores', 'formatoErrores', data.errores, caption);
                $('#divDialogoErrores').dialogo({
                    title: 'Errores encontrados',
                    modal: true,
                    width: 850,
                    buttons: {
                        'Aceptar': function () {
                            $('#divDialogoErrores').dialog('close');
                        }
                    }
                });
            }
        });
    },

    /**
     * Se ejecuta cuando se terminan de procesar las notas
     * @param  {Object} data Respuesta del servidor
     * @returns {void}
     */
    onProcesarNotasCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case -1:
                notaModelo.procesoMal = true;
                __dom.lanzarAlerta(data.mensaje || data.mensajeError, __app.mensajes.atencion);
                break;
            case 0:
                notaModelo.procesoMal = false;
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                break;
        }
    },

    /**
     * Verifica la factura seleccionada por su id
     * @returns {void} 
     */
    verificarFactura: function () {
        var btn = $(this);
        var id = parseInt(btn.attr('data-id'));
        notasControl.verificarFactura({idfactura: id}, that.onVerificarFacturaCompleto);
    },

    /**
     * Se ejecuta cuando se termina de verificar la factura y muestra el mensaje correspondientel al usuario, si hay conceptos, los muestra, 
     * tanto los informativos como los procesados
     * @param  {Object} data Respuesta del servidor
     * @returns {void}      
     */
    onVerificarFacturaCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                break;
            case -1:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                break;
            case 1:
                var idfactura = '';
                if (data.conceptos.length > 0) {
                    idfactura = data.conceptos[0].idfactura;
                    fillTable('tblConceptosProcesados', 'formatoConceptosProcesados', data.conceptos, 'Conceptos');
                }
                if (data.conceptosinformativos.length > 0) {
                    idfactura = data.conceptosinformativos[0].idfactura;
                    fillTable('tblConceptosInformativos', 'formatoConceptosInformativos', data.conceptosinformativos, 'Conceptos Informativos');
                }
                that.dialogoActual = $('#divDialogoConceptos').dialogo({
                    modal: true,
                    width: 850,
                    title: 'Datos de la factura #' + idfactura,
                    buttons: {
                        'Aceptar': function () {
                            that.dialogoActual.dialog('close');
                        }
                    }
                });
                break;
        }
    },
    /** Hace petición ajax para aplicar las notas realizadas
     * @returns {void}
     **/
    aplicarNotas: function () {
        var dialogo = $('#divDialogoMotivos').dialogo({
            modal: true,
            width: 450,
            closeOnEscape: false,
            dialogClass: "noclose",
            title: 'Mótivos de las notas',
            buttons: {
                Aceptar: function () {
                    var cmbMotivo = $('#cmbMotivo');
                    var txtComentarios = $('#txtComentarios');
                    if (cmbMotivo.val() === '-1' || txtComentarios.val().trim() === '') {
                        __dom.lanzarAlerta('Debe seleccionar un mótivo y agregar al menos un comentario.', __app.mensajes.atencion);
                        return;
                    }
                    notasControl.aplicarNotas({idmotivo: cmbMotivo.val(), comentario: txtComentarios.val()}, that.onAplicarNotasCompleto);
                },
                Cancelar: function () {
                    dialogo.dialog('close');
                }
            }
        });
    },

    /**
     * Se ejecuta cuando se han terminado de aplicar las notas crédito
     * @param  {Object} data Respuesta del servidor
     * @returns {void}      
     */
    onAplicarNotasCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 1:
                var fxRecargar = function () {
                    window.location.reload();
                };
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion, fxRecargar, null, fxRecargar);
                return;
                break;
            case -1:
                //__dom.lanzarAlerta("Error al aplicar las notas", __app.mensajes.atencion);
                fillTable('tblErrores', 'formatoErrores', data.errores, data.mensaje);
                $('#divDialogoErrores').dialogo({
                    title: 'Errores encontrados',
                    modal: true,
                    width: 850,
                    buttons: {
                        'Aceptar': function () {
                            $('#divDialogoErrores').dialog('close');
                        }
                    }
                });
                break;
        }
    },

    /**
     * Valida las facturas procesadas.
     * @param  {Event} e 
     * @returns {void}   
     */
    validarFacturasProcesadas: function (e) {
        if (!notasModel.procesoCompleto) {
            __dom.lanzarAlerta('No se han procesado facturas, debe procesar un paquete de facturas primero.', __app.mensajes.atencion);
            __app.cancelarEvento(e);
            return;
        }
    },
    /** Confirma si el usuario desea cancelar la operación actual
     * @returns {void}
     **/
    confirmarCancelar: function () {
        var callBackAceptar = function () {
            notasControl.eliminarTablas(function () {
                location.reload();
            });
        };
        __dom.lanzarAlerta(
                __app.mensajes.confirmacionCancelacion,
                __app.mensajes.atencion,
                callBackAceptar,
                true
                );
    },
    /** Limpia el formulario e información del modelo
     * @returns {void}
     **/
    limpiarFormulario: function () {
        $('#txtDocumentoFiltro,' +
                +' #tblFacturas, #tblFiltros').empty();
        $('input:text').val('');
        $('#divFacturas').hide();
        $('#');
    },

    /**
     * Se ejecuta cuando se terminan de consultar los motivos de las notas y carga el combo de motivos
     * @param  {Object} data Respuesta del servidor
     * @returns {void}      
     */
    onConsultarMotivosCompleto: function (data) {
        var cmbMotivos = $('#cmbMotivo').empty();
        switch (data.codigoRespuesta) {
            case 0:
                __dom.llenarCombo(cmbMotivo, [{idmotivo: -1, nombre: 'No hay motivos para asignar'}], 'idmotivo', 'nombre');
                break;
            case 1:
                __dom.llenarCombo(cmbMotivo, data.motivos, 'idmotivo', 'nombre');
                break;
        }
    }
};
notasVista.init();
