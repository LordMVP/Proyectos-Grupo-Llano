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
        $('#cmbReclamacion, #cmbReclamacionSuscripcion').on('change', that.llenarTablaValor);
        //$('#rbtnSusUnica, #rbtnSusMultiple').on('click', that.mostrarOcultarSuscripcion);
        //$('#rbtnNotaCalculo, #rbtnNotaValor').on('click', that.mostrarValoresNotas);

        $('#txtTipoDocumentoFiltro').on('change', that.consultarDocumentos);
        $('#txtTipoDocumentoFiltroSuscripcion').on('change', that.consultarDocumentosSuscripcion);
        $('#btnAgregarFiltro').on('click', that.agregarFiltro);
        $('#btnBuscarFacturas').on('click', that.consultarFacturas);
        //$('#cmbLiquidacion').on('change', that.consultarConcepto);
        $('#btnAgregarValor').on('click', that.agregarValor);
        $('#btnQuitarValor').on('click', that.eliminarValor);
        $('#btnAgregarFiltroAdicional').on('click', that.mostrarAgregarFiltro);
        $('#txtDocumentoFiltro').on('change', that.consultarLiquidaciones);
        $('#txtDocumentoFiltroSuscripcion').on('change', that.consultarLiquidacionesSuscripcion);

        $('.link-archivo').on('click', that.validarFacturasProcesadas);

        $('#btnAgregarRelacionado').on('click', that.agregarRelacionado);
        $('#btnQuitarRelacionado').on('click', that.quitarConceptosRelacionados);

        __dom.configurarTextoNumerico('txtFiltroSus, #txtFiltroCodAnt');
        $('#btnAplicarNotas').attr('disabled', true);
        that.configurarAutocomplete();
        notasControl.consultarMotivos(that.onConsultarMotivosCompleto);
        that.cargarComboMeses();
    },
    /**
     * Carga los posibles meses a afectar en los combos de meses
     * @returns {void}
     */
    cargarComboMeses: function () {
        var combo = $('#cmbCantidadMeses, #cmbMesesSus');
        var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        //var date = new Date(); -- se reemplaza fecha del cliente por fecha del servidor
        var date = __app.obtenerFechaSistema();
        var mes = date.getMonth();
        var id = 0;

        var contadorMeses = 5;
        var i = mes;
        while (contadorMeses >= 0) {
            combo.append($('<option>').val(id++).text(meses[i]));
            contadorMeses--;
            i = (i <= 0) ? meses.length - 1 : --i;
        }
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
         var data = {
            idprograma: 22
        };
        notasControl.controlComboContabilizacion(data,that.onValidacionPermisoComboContabilizacion);
      
        that.dialogoActual = $('#divDialogoBusquedaFactura').dialogo({
            modal: true,
            width: 850,
            title: 'Buscar facturas',
            buttons: {
                'Buscar': that.validarFiltroFactura
            }
        });
    },
    validarFiltroFactura: function () {
        var cantMes = $('#cmbMesesSus').val();
        var span = $('#pMensajeFiltroFacturas').text('');
        var liquidacion = $('#cmbLiquidacionSuscripcion').val();
        var documento = $('#txtDocumentoFiltroSuscripcion').val();
        var tipoDocumento = $('#txtTipoDocumentoFiltroSuscripcion').val();

        if (cantMes === '-1' || !cantMes) {
            span.text('#spanMensaje').show().text('Debe seleccionar mes a afectar');
            return;
        }

        if (!liquidacion || liquidacion === '-1' || !documento || documento === '-1' || !tipoDocumento || tipoDocumento === '-1') {
            span.text('Todos los campos son obligatorios, intente nuevamente');
            return;
        }
        notasModel.cantidadMesSuscripcion = cantMes;
        idsuscripcion = notasModel.suscripcion.idsuscripcion;
        var data = {
            tipo: 'S',
            meses: cantMes,
            iddocumento: documento,
            idliquidacion: liquidacion,
            idsuscripcion: idsuscripcion,
            idtipodocumento: tipoDocumento
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
                data['idtipouso'] = $('#txtTipoUso').val();
                data['idtipodocumento'] = $('#txtTipoDocumentoFiltro').val();
                data['iddocumento'] = $('#txtDocumentoFiltro').val();
                data['idliquidacion'] = $('#cmbLiquidacion').val();
                data['meses'] = $('#cmbCantidadMeses').val();
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
                    "fnRowCallback": function (nRow, aData) {
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
    /** Muestra cuadro de diálogo para agregar filtros de facturas
     * @returns {void}
     **/
    mostrarAgregarFiltro: function () {
        notasControl.consultarConceptosAutocomplete(function (data) {
            that.mostrarResultadoConcepto(data);

            that.dialogoActual = $('#divFiltroAdicionalFacturas').dialogo({
                resizable: false,
                width: 600,
                modal: true,
                position: {my: "center", at: "top+90", of: "body"},
                title: 'Filtro adicional de facturas',
                buttons: {
                    "Aceptar": function () {
                        that.aplicarFiltroFacturas();
                    },
                    'Cancelar': function () {
                        if (notasModel.filtroFactura.length > 0) {
                            __dom.lanzarAlerta(
                                    'Esto removerá los filtros por concepto ¿Desea eliminarlos y continuar?',
                                    __app.mensajes.atencion,
                                    function () {
                                        that.consultarFacturas();
                                        notasModel.filtroFactura = [];
                                        $('#tblFiltros').empty();
                                        //that.onConsultarFacturasCompleto({codigoRespuesta: 1, facturas: notasModel.facturas});
                                        that.dialogoActual.dialog('close');
                                    },
                                    function () {
                                        return;
                                    }
                            );
                        } else {
                            that.dialogoActual.dialog('close');
                        }
                    }
                }
            });

        });


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
                that.onConsultarLiquidacionCompleto(data, combo);
            });
        }
    },
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
            $('#txtLiquidacion, #txtLiquidacionRelacionado').val(cmbLiquidacion.text());
            var data = {
                tipo: 'D',
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
        var conc = $('#txtConcepto');
        if (notasModel.tipo === 'S') {
            liquidacion.idliquidacion = $('#cmbLiquidacionSus').val();
            liquidacion.liquidacion = $('#cmbLiquidacionSus option:selected').text();
        } else {
            liquidacion.idliquidacion = $('#cmbLiquidacion').val();
            liquidacion.liquidacion = $('#txtLiquidacion').val();
        }
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
        var formato = 'formatoLiquidacionConcepto';


        var comboreclamacion = null;
        if ($('#cmbLiquidacion').is(':visible')) { //si la pestaña de varias suscripciones está activa
            comboreclamacion = $('#cmbReclamacion').val();
        } else {
            comboreclamacion = $('#cmbReclamacionSuscripcion').val();
        }
        if (notasModel.valores.length === 0) {
            $('#btnQuitarValor').hide();
            $('#cmbLiquidacionSus').attr('disabled', false);
            return;
        }
        if ($('#rbtnNotaCalculo').prop('checked')) {
            formato = 'formatoLiquidacionConceptoCalculo';
        }
        if (comboreclamacion === 'S') {
            formatoLiquidacionConcepto.thead[3].html = '<option value="resta">Restar</option>';
        } else {
            formatoLiquidacionConcepto.thead[3].html = '<option value="suma" selected="selected">Sumar</option><option value="resta">Restar</option>';
        }


        $('#btnQuitarValor').show();
        $('#cmbLiquidacionSus').attr('disabled', true);
        var tabla = fillTable('tblValores', formato, 'notasModel.valores', '');
        var val = __dom.configurarTextoNumerico(tabla.find('tr td[header="thValor"] input:text'), false, true, true);
        tabla.find('tr td[header="thOperacion"] select').on('change', that.cambiarOperacionConcepto);
        tabla.find('tr td[header="thInformativos"] input[type="button"]').on('click', that.consultarConceptosInformativos);
        val.on('blur', that.agregarValorConcepto);
    },
    agregarValorConcepto: function () {
        var _this = $(this);
        var indice = _this.parent().parent().attr('data-fila');
        notasModel.valores[indice].valor = _this.val();
    },
    /**
     * Cambia en el modelo la operaciòn de la fila
     * @returns {void}
     */
    cambiarOperacionConcepto: function () {
        var _this = $(this);
        var indice = _this.parent().parent().attr('data-fila');
        notasModel.valores[indice].operacion = _this.val();
    },
    //<editor-fold desc="Funciones para agregar conceptos informativos" defaultstate="collapsed">
    /**
     * Hace la petición al servidor para consultar los conceptos relacionados al concepto de la fila
     * @returns {void}
     */
    consultarConceptosInformativos: function () {
        var _this = $(this);
        var indice = _this.parent().parent().attr('data-fila');
        var idconcepto = notasModel.valores[indice].idconcepto;
        var idliquidacion = notasModel.valores[indice].idliquidacion;
        var idLiquidacionFactura = $('#cmbLiquidacionSuscripcion').val();
        if (notasModel.conceptosInformativos[idconcepto]) {
            that.llenarComboInformativo(idconcepto);
            notasModel.idconceptoSeleccionado = idconcepto;
            that.abrirModalInformativos();
            return;
        }

        notasControl.consultarConceptosInformativos({idconcepto: idconcepto, idliquidacion: idliquidacion, idLiquidacionFactura: idLiquidacionFactura}, function (data) {
            that.onConsultarConceptoInformativos(data, idconcepto);
        });
    },
    /**
     * Llena el combo de los conceptos informativos segùn la información guardada en el modelo del concepto
     * @param {type} idconcepto
     * @returns {undefined}
     */
    llenarComboInformativo: function (idconcepto) {
        $('#cmbInformativos').empty().append('<option value="-1">Seleccione una opción</option>');
        var conceptos = notasModel.conceptosInformativos[idconcepto];
        for (var i = 0; i < conceptos.length; i++) {
            var concepto = conceptos[i];
            var option = $('<option>').attr('value', concepto.idconcepto).text(concepto.concepto);
            (!concepto.seleccionable) && option.attr('disabled', 'disabled');
            $('#cmbInformativos').append(option);
        }
    },
    /**
     * Obtiene los conceptos relacionados enviados por el servidor y valida que no se esté utilizando en otros
     * @param {Object} data - Respuesta con conceptos relacionados de un concepto
     * @param {number} idconcepto - id del concepto del que se consulto los respectivos conceptos
     * @returns {void}
     */
    onConsultarConceptoInformativos: function (data, idconcepto) {
        if (data.codigoRespuesta === 1) {
            var conceptos = that.validarConceptosEnUso(data.datos, idconcepto, $('#cmbInformativos'));
            notasModel.conceptosInformativos[idconcepto] = conceptos;
            notasModel.idconceptoSeleccionado = idconcepto;
            that.abrirModalInformativos();
            return;
        }
        __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
    },
    /**
     * Valida los conceptos informativos que se pueden seleccionar del concepto original
     * @param {array} conceptos - Arreglo con información de todos los conceptos relacionados
     * @param {number} idconcepto - Id del concepto que ejecutò la consulta
     * @param {jquery | null} combo - Objeto del dom que se llenará con los conceptos
     * @returns {Array}
     */
    validarConceptosEnUso: function (conceptos, idconcepto, combo) {
        (combo) && combo.empty().append('<option value="-1">Seleccione una opción</option>')
        var conceptosMostrar = [];
        for (var i = 0; i < conceptos.length; i++) {
            var concepto = conceptos[i];
            var estaEnUso = notasModel.conceptosUtilizados[concepto.idconcepto];
            var option = $('<option>').attr('value', concepto.idconcepto).text(concepto.concepto);
            concepto.seleccionable = !estaEnUso;
            conceptosMostrar.push(concepto);
            (combo) && combo.append(option);
            if (estaEnUso) {
                option.attr('disabled', 'disabled');
                estaEnUso.push(idconcepto);
            }
        }
        return conceptosMostrar;
    },
    /**
     * Muestra la opciòn de agregar conceptos relacionados
     * @param {number} idconcepto - Concepto del que se muestran los conceptos relacionados
     * @returns {undefined}
     */
    abrirModalInformativos: function () {
        if (!notasModel.idconceptoSeleccionado) {
            __dom.lanzarAlerta('Debe seleccionar un concepto para ingresar a esta opción', 'Error');
            return;
        }
        var conceptoOriginal = $('#tblValores tbody tr td[header="thConcepto"][data-value="' + notasModel.idconceptoSeleccionado + '"]').text();
        $('#txtConceptoRelacionado').val(conceptoOriginal);
        that.llenarTablaInformativos();
        $('#divDialogoConceptoInformativo').dialogo({
            width: 850,
            modal: true,
            title: 'Conceptos Informativos',
            buttons: {
                'Aceptar': that.aceptarCambiosRelacionados,
                'Cancelar': that.cancelarCambiosRelacionados
            }
        });
    },
    /**
     * Llena la tabla de los conceptos informativos segùn los conceptos que estén seleccionados
     * @returns {void}
     */
    llenarTablaInformativos: function () {
        var conceptos = notasModel.conceptosInformativos[notasModel.idconceptoSeleccionado];
        var conceptosSeleccionados = [];
        for (var i = 0; i < conceptos.length; i++) {
            var concepto = conceptos[i];
            (concepto.seleccionado) && conceptosSeleccionados.push(concepto);
        }
        (conceptosSeleccionados.length > 0) ? $('#detalleSeleccionRelacionado').show() : $('#detalleSeleccionRelacionado').hide();
        var tabla = fillTable('tblConceptosRelacionadosSeleccionados', 'formatoConceptosInformativos', conceptosSeleccionados, '');
        var valor = __dom.configurarTextoNumerico(tabla.find('tr td[header="thValor"] input:text'), false, true, true);
        valor.on('blur', function () {
            that.agregarValorInformativo(conceptos, $(this));
        });
    },
    /**
     * Agrega el concepto informativo a la tabla  y deshabilita la opción
     * @returns {void}
     */
    agregarRelacionado: function () {
        var idconcepto = parseInt($('#cmbInformativos').val());
        var estaEnTabla = $('#tblConceptosRelacionadosSeleccionados td[header="thConcepto"][data-value="' + idconcepto + '"]').length > 0;
        $('#spanErrorRelacionado').text('');
        if (idconcepto === -1 || isNaN(idconcepto)) {
            $('#spanErrorRelacionado').text('Debe seleccionar un concepto informativo vàlido');
            return;
        }
        if (notasModel.conceptosUtilizados[idconcepto] || estaEnTabla) {
            $('#spanErrorRelacionado').text('El concepto ya ha sido seleccionado en este u otro concepto');
            return;
        }
        var conceptos = notasModel.conceptosInformativos[notasModel.idconceptoSeleccionado];
        for (var i = 0; i < conceptos.length; i++) {
            var concepto = conceptos[i];
            if (parseInt(concepto.idconcepto) === idconcepto) {
                concepto.seleccionado = true;
                concepto.valor = 0;
                that.llenarTablaInformativos();
                $('#cmbInformativos').val('-1');
                $('#cmbInformativos option[value="' + idconcepto + '"]').attr('disabled', 'disabled');
                return;
            }
        }
    },
    /**
     * Guarda datos que están en la tabla actual pintado
     * @returns {void}
     */
    aceptarCambiosRelacionados: function () {
        var filas = $('#tblConceptosRelacionadosSeleccionados tr td[header="thConcepto"]');
        for (var i = 0; i < filas.length; i++) {
            var idconcepto = $(filas[i]).attr('data-value');
            notasModel.conceptosUtilizados[idconcepto] = that.agregarConceptoSeleccionado(parseInt(idconcepto));
        }
        for (var i = 0; i < notasModel.conceptosQuitados.length; i++) {
            that.quitarConceptoUtilizado(notasModel.conceptosQuitados[i]);
        }
        that.cerrarDialogoInformativos();
    },
    /**
     * Cambio el estado de seleccionable de los conceptos informativos que fueron seleccionados
     * @param {number} idconceptoSeleccionado - concepto que se está cambiando el estado
     * @returns {Array} Arreglo de los conceptos que tienen éste concepto relacionado
     */
    agregarConceptoSeleccionado: function (idconceptoSeleccionado) {
        var conceptoRelacionados = [];
        for (var idconcepto in notasModel.conceptosInformativos) {
            for (var k = 0; k < notasModel.conceptosInformativos[idconcepto].length; k++) {
                var concepto = notasModel.conceptosInformativos[idconcepto][k];
                if (parseInt(concepto.idconcepto) === idconceptoSeleccionado) {
                    conceptoRelacionados.push(idconcepto);
                    concepto.seleccionable = false;
                    break;
                }
            }
        }
        return conceptoRelacionados;

    },
    /**
     * Quita la información de seleccionado de un concepto informativo
     * @param {Object} concepto - Información del concepto que se desea quitar
     * @returns {void}
     */
    quitarConceptoUtilizado: function (idconcepto) {
        var conceptoConRelacion = notasModel.conceptosUtilizados[idconcepto];
        if (!conceptoConRelacion) {
            return;
        }
        for (var i = 0; i < conceptoConRelacion.length; i++) {
            var conceptos = notasModel.conceptosInformativos[conceptoConRelacion[i]];
            for (var j = 0; j < conceptos.length; j++) {
                var conceptoInf = conceptos[j];
                if (conceptoInf.idconcepto === idconcepto) {
                    conceptoInf.seleccionable = true;
                    break;
                }
            }
        }
        delete notasModel.conceptosUtilizados[idconcepto];
    },
    /**
     * Devuelve los conceptos tal cual como estaban antes de abrir el diálogo
     * @returns {void}
     */
    cancelarCambiosRelacionados: function () {
        var conceptos = notasModel.conceptosInformativos[notasModel.idconceptoSeleccionado];
        for (var i = 0; i < conceptos.length; i++) {
            var concepto = conceptos[i];
            if (concepto.seleccionado) {
                concepto.seleccionado = !!notasModel.conceptosUtilizados[concepto.idconcepto];
                var valor = $('#tblConceptosRelacionadosSeleccionados td[header="thConcepto"][data-value="' + concepto.idconcepto + '"]').parents('tr').find('td[header="thValor"]').attr('data-value');
                concepto.valor = isNaN(parseInt(valor)) ? null : parseInt(valor);

            }
        }
        for (var i = 0; i < notasModel.conceptosQuitados.length; i++) {
            var concepto = notasControl.consultarConceptoPorId(null, notasModel.conceptosQuitados[i]);
            concepto.seleccionado = true;
        }
        that.cerrarDialogoInformativos();
    },
    /**
     * Cierrar el diálogo de los informativos y borra la información guardada del concepto original
     * @returns {void}
     */
    cerrarDialogoInformativos: function () {
        var div = $('#divDialogoConceptoInformativo');
        div.find('#tblConceptosRelacionadosSeleccionados, #cmbInformativos').empty();
        div.find('#txtConceptoRelacionado').val('');
        div.find('#spanErrorRelacionado').text('');
        notasModel.idconceptoSeleccionado = null;
        notasModel.conceptosQuitados = [];
        div.dialog('close');

    },
    /**
     * Agrega el valor del concepto en la información guardada en el modelo
     * @param {Array} conceptos - Todos los conceptos informativos cargados en el diálogo
     * @param {jquery} _this - Caja de texto que disparó el evento blur
     * @returns {void}
     */
    agregarValorInformativo: function (conceptos, _this) {
        var valor = parseFloat(_this.val());
        var idconcepto = parseInt(_this.parents('tr').find('td[header="thConcepto"]').attr('data-value'));
        for (var i = 0; i < conceptos.length; i++) {
            var concepto = conceptos[i];
            if (parseInt(concepto.idconcepto) === idconcepto) {
                concepto.valor = isNaN(valor) ? null : valor;
                return;
            }
        }
    },
    /**
     * Quita los conceptos relacionados que están cargados actualmente
     * @returns {void}
     */
    quitarConceptosRelacionados: function () {
        var filas = $('#tblConceptosRelacionadosSeleccionados tbody');
        var conceptoQuitar = filas.find('[header="thSeleccion"] input:checked');
        for (var i = 0; i < conceptoQuitar.length; i++) {
            var fila = $(conceptoQuitar[i]).parents('tr');
            var idconcepto = fila.find('td[header="thConcepto"]').attr('data-value');
            var concepto = notasControl.consultarConceptoPorId(null, idconcepto);
            if (concepto) {
                fila.remove();
                concepto.seleccionado = false;
                notasModel.conceptosQuitados.push(concepto.idconcepto);
                $('#cmbInformativos option[value="' + idconcepto + '"]').removeAttr('disabled');
                filas.find('tr').length === 0 && $('#detalleSeleccionRelacionado').hide();
            }
        }
    },
    //</editor-fold>
    /** Elimina una fila de la tabla de valores de la nota
     * @returns {void}
     **/
    eliminarValor: function () {
        var check = $('#tblValores tbody tr td input:checked');
        if (check.length > 0) {
            for (var i = 0; i < check.length; i++) {
                var td = check[i].parentNode.parentNode.querySelectorAll('td[header="thConcepto"]')[0];
                var idconcepto = td.getAttribute('data-value');
                that.sliceConceptoValores(idconcepto);
            }
            that.llenarTablaValor();
        }
    },
    sliceConceptoValores: function (id) {
        id = parseInt(id);
        for (var j = 0; j < notasModel.valores.length; j++) {
            var idconcepto = parseInt(notasModel.valores[j].idconcepto);
            if (idconcepto === id) {
                notasModel.valores.splice(j, 1);
            }
        }
    },
    /** Valida la información para procesar las facturas
     * @returns {void}
     **/
    validarProcesar: function () {
        if (!!notasModel.facturas) {
            if (notasModel.facturasSeleccionadas.length > 0) {
                /*if(notasModel.filtroFactura.length <= 0){
                 __dom.lanzarAlerta('Debe ingresar al menos un filtro adicional', __app.mensajes.atencion);
                 return;
                 }*/
                var validacion = that.validarValores();
                if (notasModel.valores.length <= 0 || !validacion) {
                    __dom.lanzarAlerta('Debe ingresar valores para procesar notas', __app.mensajes.atencion);
                    return;
                }
            } else {
                __dom.lanzarAlerta(__app.mensajes.seleccionarFacturas, __app.mensajes.atencion);
                return;
            }

            __dom.lanzarAlerta('Esto procesará las notas ¿Desea continuar?',
                    __app.mensajes.atencion, that.procesarNotas, true);
        }
    },
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
        var combo = null;
        var comboreclamacion = null;
        var comboContabilizacion = null;
        var facturas = notasControl.obtenerFacturaSeleccionada();


        if ($('#cmbLiquidacion').is(':visible')) { //si la pestaña de varias suscripciones está activa
            combo = $('#cmbLiquidacion');
            comboreclamacion = $('#cmbReclamacion').val();
        } else {
            combo = $('#cmbLiquidacionSuscripcion');
            comboreclamacion = $('#cmbReclamacionSuscripcion').val();
            comboContabilizacion = $('#cmbContabilizacion').val();
        }
          
        if (facturas.length === 0) {
            return;
        }
        if (!comboreclamacion || comboreclamacion === '-1') {
            __dom.lanzarAlerta('Debe seleccionar el tipo de reclamación', __app.mensajes.atencion);
            return;
        }

        notasModel.conceptosValor = [];
        var idliquidacion = combo.val();
        var tipoliquidacion = combo.find('option:selected').attr('data-tipo');
        for (var c = 0; c < notasModel.valores.length; c++) {
            var val = notasModel.valores[c];
            var operacion = $('#tblValores').find('select:eq(' + c + ')').val();
            var valorNota = operacion === "suma" ? val.valor : val.valor * (-1);
            var informativos = that.obtenerConceptoInformativosConcepto(val.idconcepto);
            if(!informativos){
                __dom.lanzarAlerta('Debe digitar los valores de los conceptos informativos', __app.mensajes.atencion);
                return;
            }
            notasModel.conceptosValor.push({
                idconcepto: val.idconcepto,
                valor: valorNota,
                conceptosinformativos: informativos

            });
        }


        var data = {
            idliquidacion: idliquidacion,
            conceptos: notasModel.conceptosValor,
            facturas: facturas,
            tipoliquidacion: tipoliquidacion,
            reclamacion: comboreclamacion,
            tipocontabilidad: comboContabilizacion
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
        }, 2000),
                that.dialogoProceso = $('#divDialogProcesando').dialogo({
            modal: true,
            width: 550,
            closeOnEscape: false,
            //beforeClose: function (event, ui) { return false; },
            dialogClass: "noclose",
            title: 'Procesamiento facturas'
        });
    },
    obtenerConceptoInformativosConcepto: function (idconcepto) {
        var informativos = [];
        var guardados = notasModel.conceptosInformativos[idconcepto];
        if (!guardados || guardados.length === 0) {
            return [];
        }
        for (var i = 0, concepto; concepto = guardados[i], i < guardados.length; i++) {
            if(concepto.seleccionado){
                if(!concepto.valor || isNaN(parseInt(concepto.valor))){return false;};
                informativos.push(concepto);
            }
        }
        return informativos;
    },
    consultarProceso: function (data) {
        that.consultarErrores();
        switch (data.codigoRespuesta) {
            case 0:
                notasModel.procesoCompleto = true;
                that.dialogoProceso.dialog('close');
                clearInterval(notasModel.proceso);
                $('#btnAplicarNotas').removeAttr('disabled');
                for (var i = 0; i < notasModel.facturasSeleccionadas.length; i++) {
                    var idFactura = parseInt(notasModel.facturasSeleccionadas[i]);
                    var factura = notasControl.obtenerFacturaPorId(idFactura);
                    if (factura) {
                        factura.procesado = true;
                    }
                }
                $('#tblFacturas').DataTable().draw();
                break;
            case - 1:
                that.dialogoProceso.dialog('close');
                clearInterval(notasModel.proceso);
                break;
        }
    },
    consultarErrores: function () {
        var tblErrores = $('#tblErrores').empty();
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
    onProcesarNotasCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case - 1:
                __dom.lanzarAlerta(data.mensaje || data.mensajeError, __app.mensajes.atencion);
                break;
            case 0:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                break;
        }
    },
    verificarFactura: function () {
        var btn = $(this);
        var id = parseInt(btn.attr('data-id'));
        notasControl.verificarFactura({idfactura: id}, that.onVerificarFacturaCompleto);
    },
    onVerificarFacturaCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
            case - 1:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                break;
            case 1:
                fillTable('tblConceptosProcesados', 'formatoConceptosProcesados', data.conceptos, 'Conceptos');
                that.dialogoActual = $('#divDialogoConceptos').dialogo({
                    modal: true,
                    width: 850,
                    title: 'Datos de la factura #' + data.conceptos[0].idfactura,
                    buttons: {
                        'Aceptar': function () {
                            that.dialogoActual.dialog('close');
                        }
                    }
                });
                break;
        }
    },
    /** Valida que la asignación de los valores de los conceptos estén correctos
     * @returns {void}
     **/
    validarValores: function () {
        for (var i = 0; i < notasModel.valores.length; i++) {
            var valor = notasModel.valores[i];
            if (!valor.valor || valor.valor === null || valor.valor === '') {
                return false;
            }
        }
        return true;
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
                Aceptar: that.funcionAplicarNotas,
                Cancelar: function () {
                    dialogo.dialog('close');
                }
            }
        });
    },
    funcionAplicarNotas: function () {
        var comboreclamacion = null;
        if ($('#cmbLiquidacion').is(':visible')) { //si la pestaña de varias suscripciones está activa
            comboreclamacion = $('#cmbReclamacion').val();
        } else {
            comboreclamacion = $('#cmbReclamacionSuscripcion').val();
        }
        var cmbMotivo = $('#cmbMotivo');
        var txtComentarios = $('#txtComentarios');
        if (cmbMotivo.val() === '-1' || txtComentarios.val().trim() === '') {
            __dom.lanzarAlerta('Debe seleccionar un mótivo y agregar al menos un comentario.', __app.mensajes.atencion);
            return;
        }
        var infoEnviar = {
            idmotivo: cmbMotivo.val(),
            comentario: txtComentarios.val(),
            reclamacion: comboreclamacion};
        notasControl.aplicarNotas(infoEnviar, that.onAplicarNotasCompleto);
    },
    onAplicarNotasCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 1:
                var fxRecargar = function () {
                    window.location.reload();
                };
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion, fxRecargar, null, fxRecargar);
                return;
                break;
            case - 1:
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
        $('select').not('#cmbMesesSus').val('-1');
        $('input:text').val('');
        $('#divFacturas').hide();
    },
    onConsultarMotivosCompleto: function (data) {
        var cmbMotivos = $('#cmbMotivo').empty();
        switch (data.codigoRespuesta) {
            case 0:
                __dom.llenarCombo(cmbMotivos, [{idmotivo: -1, nombre: 'No hay motivos para asignar'}], 'idmotivo', 'nombre');
                break;
            case 1:
                __dom.llenarCombo(cmbMotivos, data.motivos, 'idmotivo', 'nombre');
                break;
        }
    },
    onValidacionPermisoComboContabilizacion: function(data){
        switch (data.codigoRespuesta) {
            case 0:
                    $('#divContabilizacion').hide();
             break;
           case 1:
                    $('#divContabilizacion').show();
             break;
        }
    }
};
notasVista.init();
