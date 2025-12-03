/**
 * @fileOverview Archivo de vista y control de condonar conceptos de factura
 * @author angelicaGomez
 * @requires condonarCartera.control.js
 * @requires condonarCartera.modelo.js
 * @version 1.0.0
 */
/**
 * Objeto que hace referencia al namespace condonarVista
 * @type {Object}
 */
var that = null;

/** @namespace */
var condonarVista = {
    /** Hace referencia al último dialogo abierto en la aplicación
     * @type {object}
     */
    dialogoActual: null,
    /**Inicializa el programa de condonar cartera corriente, y asigna listeners a los controles
     * @returns {void}
     */
    init: function () {
        that = condonarVista;
        $('button#btnSuscripcion').on('click', that.mostrarFiltro);
        $('#btnGrabar').on('click', that.confirmarGrabar);
        $('#btnImprimir').on('click', that.confirmarGrabar);
        $('#btnCancelar').on('click', that.confirmarCancelar);
        $('#btnCargarFacturas').on('click', that.consultarFacturas);
        $('#btnCargarFacturasIntCorriente').on('click', that.consultarFacturasIntCorriente);
        __dom.configurarTextoNumerico('txtFiltroSus');
        that.configurarAutocomplete();
        that.validaPermisoBotonesSeleccionFacturas();
    },
    /** Configura la tabla de conceptos e inicia impresión
     * @type {object}
     */
    imprimir: function () {
        var conceptosAll = [];
        for (var i = 0; i < condonarModelo.conceptoseleccionado.length; i++) {
            var conc = condonarModelo.conceptoseleccionado[i];
            for (var x = 0; x < conc.conceptos.length; x++) {
                conceptosAll.push(conc.conceptos[x]);
            }
        }
        condonarModelo.conceptosAll = conceptosAll;
        fillTable("tblConceptosCompletos", "formatoConceptos", "condonarModelo.conceptosAll", "Conceptos condonables").show();
        window.print();
        $('#tblConceptosCompletos').hide();
    },
    /** Configura campo de texto para autocomplete
     * @type {object}
     */
    configurarAutocomplete: function () {
        __dom.configurarAutocomplete(
                'input#txtMunicipio',
                that.sourceAutoComplete,
                function (event, ui) {
                    condonarModelo.idmunicipio = ui.item.idVal;
                },
                function (txt) {
                    condonarModelo.idmunicipio = undefined;
                }
        );
    },
    /** Realiza la petición AJAX para consultar los municipios del autocomplete 
     * @returns {void}
     */
    sourceAutoComplete: function (request, response) {
        that.request = request;
        that.response = response;
        var datos = {};
        datos.municipio = request.term;
        if (datos.municipio.trim() !== "") {
            condonarControl.consultarMunicipio(datos, that.mostrarResultado);
        }
    },
    /** Muestra el resultado de la consulta de los municipios en la lista desplegable.
     * @returns {void}
     */
    mostrarResultado: function (data) {
        if (data.codigoRespuesta == 1) {
            var result = [];
            $.each(data.datos, function (i, item) {
                result.push({
                    label: item.municipio,
                    value: item.municipio,
                    idVal: item.idmunicipio,
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
            heigth: 400,
            width: 550,
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
        var suscripcion = filtro.find('#txtFiltroSus').val().trim();
        var codigoanterior = filtro.find('#txtFiltroCodAnt').val().trim();
        if (!condonarModelo.idmunicipio) {
            filtro.find('#spanMensaje').text(__app.mensajes.seleccionarMunicipio).show();
        } else {
            if (suscripcion === '' && codigoanterior === '') {
                filtro.find('#spanMensaje').text(__app.mensajes.camposInvalidosFiltro).show();
            } else {
                var data = {
                    idmunicipio: condonarModelo.idmunicipio,
                    idsuscripcion: suscripcion,
                    codigoanterior: codigoanterior
                };
                condonarControl.consultarSuscripciones(data, that.consultaSuscripcionCompleto);
            }
        }
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

                if (data.datos.length > 1) {
                    $('#divListaSelección').empty();
                    var divSuscripciones = $('<div>').addClass('listaSeleccion');
                    $.each(data.suscripciones, function (index, suscripcion) {
                        var div = $('<div>');
                        var radio = $('<input type="radio">');
                        var label = $('<label>');
                        radio.val(suscripcion.idsuscripcion);
                        radio.attr('id', 'radio_susc_' + index);
                        radio.attr('data-indice', index);
                        radio.attr('name', 'radio_suscripciones');

                        label.attr('for', 'radio_susc_' + index);
                        label.text(suscripcion.cedula + ' - ' + suscripcion.nombretercero + ' - ' + suscripcion.idsuscripcion);
                        div.append(radio).append(label);
                        divSuscripciones.append(div);
                    });
                    var btn = $('<button>').text('Finalizar').addClass('btnSimple');
                    btn.on('click', function () {
                        var suscSeleccionada = $('input[name="radio_suscripciones"]:checked');
                        if (suscSeleccionada.length > 0) {
                            that.limpiarFormulario();
                            var suscripcion = condonarModelo.suscripcion = data.datos[suscSeleccionada.attr('data-indice')];
                            that.cargarCabecera();
                            $('#spanMensaje').hide();
                            that.dialogoActual.dialog('close');
                            divSuscripciones.remove();
                            condonarModelo.idsuscripcion = suscripcion.idsuscripcion;

                        } else {
                            $('#spanMensaje').text(__app.mensajes.seleccionarOpcion).show();
                        }
                    });
                    divSuscripciones.append(btn);
                    $('#divListaSelección').append(divSuscripciones);
                } else {
                    that.limpiarFormulario();
                    var suscripcion = condonarModelo.suscripcion = data.datos[0];
                    that.cargarCabecera();
                    $('#spanMensaje').hide();
                    condonarModelo.idsuscripcion = suscripcion.idsuscripcion;
                    that.dialogoActual.dialog('close');
                }
                break;
        }
    },
    /** Carga la cabecera del formulario con los datos de la suscripción seleccionada.
     * @returns {void}
     */
    cargarCabecera: function () {
        var cabecera = $('#divCabecera');
        var sus = condonarModelo.suscripcion;
        $('#txtSuscripcion, #txtSuscripcionImprimir').val(sus.idsuscripcion);
        cabecera.find('#txtDocumento').val(sus.documentotercero);
        cabecera.find('#txtNombre').val(sus.nombretercero);
        cabecera.find('#txtCodAnterior').val(sus.codigoanterior);
        cabecera.find('#txtMunicipio').val(sus.municipio);
        cabecera.find('#txtBarrio').val(sus.barrio);
        cabecera.find('#txtDireccion').val(sus.direccion);
        cabecera.find('#txtTelefono').val(sus.telefonofijo);
        cabecera.find('#txtCelular').val(sus.telefonocelular);
        that.dialogoActual.dialog('close');
    },
    /** Hace petición AJAX para consultar las facturas de una suscripción, son mostradas en una tabla
     * y se asignan los listeners de sus controles
     * @returns {void}
     */
    consultarFacturas: function () {
        $('#btnCargarFacturasIntCorriente').attr('disabled', true);
        condonarModelo.conceptoseleccionado = [];
        if (!!condonarModelo.suscripcion) {
            condonarControl.consultarFacturas({idsuscripcion: condonarModelo.suscripcion.idsuscripcion}, function (data) {
                switch (data.codigoRespuesta) {
                    case 0:
                        __dom.lanzarAlerta('La suscripción no tiene facturas', __app.mensajes.atencion);
                        condonarModelo.nocondonables = [];
                        condonarModelo.condonables = [];
                        break;
                    case 1:
                        if (data.datos.length > 0) {
                            condonarModelo.facturas = data.datos;
                            condonarModelo.nocondonables = [];
                            condonarModelo.condonables = [];
                            var tblFac = fillTable("tblFacturas", "formatoFacturas", "condonarModelo.facturas", "Facturas");
                            tblFac.find('thead th#thSeleccion input').on('mousedown', that.habilitarChecks);
                            tblFac.find('tbody tr td[header="thSeleccion"] input').on('click', that.seleccionarFactura);
                            tblFac.find('tbody tr td[header="thDetallesFactura"] input')
                                    .on('click', that.mostrarConceptosFactura)
                                    .attr('disabled', true);
                            tblFac.show();
                            for (var f = 0; f < data.datos.length; f++) {
                                var fact = data.datos[f];
                                for (var cc = 0; cc < fact.conceptoscondonables.length; cc++) {
                                    var condonable = fact.conceptoscondonables[cc];
                                    condonable.idfactura = fact.idfactura;
                                    condonarModelo.condonables.push(condonable);
                                }
                                for (var cn = 0; cn < fact.conceptosnocondonables.length; cn++) {
                                    var noCondonable = fact.conceptosnocondonables[cn];
                                    noCondonable.idfactura = fact.idfactura;
                                    condonarModelo.nocondonables.push(noCondonable);
                                }
                            }


                        } else {
                            __dom.lanzarAlerta('La suscripción no tiene facturas', __app.mensajes.atencion);
                        }

                        break;
                }
            });
        }
    },

    /**
     * Habilita todos los inputs de selección de la columna de seleccionar, en la tabla de Facturas.
     * @returns {void}
     */
    habilitarChecks: function () {
        $('#tblFacturas tbody td[header="thSeleccion"] input[type="checkbox"]').removeAttr('disabled');
    },
    /** Función disparada cuando se selecciona/deselecciona una factura
     * @returns {void}
     */
    seleccionarFactura: function () {
        var check = $(this);
        var trSeleccionada = check.parent().parent();
        var indice = parseInt(trSeleccionada.attr('data-fila'));
        var idfactura = check.val();
        if (check.prop('checked')) {
            var tablaFacturas = $('table tbody tr');
            for (var i = 0; i <= indice; i++) {
                that.checkedDetallesConceptos($(tablaFacturas[i]).find('td[header="thDetallesFactura"]').attr('data-value'), indice);
            }
            that.saldosCondonables();
            trSeleccionada.addClass('selected')
                    .find('td[header="thDetallesFactura"] input')
                    .attr('disabled', false);
            if (indice > 0) {
                for (var i = 0; i < indice; i++) {
                    var fila = $(trSeleccionada.siblings()[i]);
                    fila.addClass('selected')
                            .find('td[header="thDetallesFactura"] input')
                            .attr('disabled', false);
                    fila.find('td[header="thSeleccion"] input')
                            .prop('checked', true)
                            .attr('disabled', 'disabled');
                }
            }
        } else {
            trSeleccionada.removeClass('selected')
                    .find('td[header="thDetallesFactura"] input')
                    .attr('disabled', true);

            if (indice > 0) {
                var _fila = trSeleccionada;
                _fila.find('td[header="thSeleccion"] input')
                        .prop('checked', false)
                        .removeAttr('disabled', 'disabled');
                _fila.prev().find('td[header="thSeleccion"] input')
                        .removeAttr('disabled', 'disabled');
            }
            var concepto = condonarControl.consultarConceptoSelect(idfactura);
            if (!!concepto) {
                for (var i = concepto.length - 1; i >= 0; i--) {
                    condonarModelo.conceptoseleccionado.splice(concepto[i].indice, 1);
                }
            }
            that.saldosCondonables();
        }
    },
    /** Muestra los conceptos de una factura en un cuadro diálogo.
     * @returns {void}
     */
    mostrarConceptosFactura: function () {
        var _this = $(this);
        var idfactura = condonarModelo.idfactura = _this.parent().attr('data-value');
        condonarModelo.condonableFact = condonarControl.consultarCondonableFacturaId(condonarModelo.idfactura);
        condonarModelo.noCondonableFact = condonarControl.consultarNoCondonableFacturaId(condonarModelo.idfactura);

        if (condonarModelo.condonableFact.length > 0) {
            fillTable("tblConceptosCondonable", "formatoConceptos", "condonarModelo.condonableFact", "Conceptos condonables");
        }
        if (condonarModelo.noCondonableFact.length > 0) {
            fillTable("tblConceptosNoCondonable", "formatoConceptosNoCondonable", "condonarModelo.noCondonableFact", "Conceptos no condonables");
        }

        var trs = $('#tblConceptosCondonable tbody tr');
        var conceptos = condonarControl.consultarConceptoSelect(condonarModelo.idfactura);
        if (!!conceptos) {
            for (var dat = 0; dat < conceptos.length; dat++) {
                var dataConceptos = conceptos[dat].conceptos.conceptos;
                for (var t = 0; t < trs.length; t++) {
                    var check = $(trs[t]).find('td[header="thSeleccion"] input');
                    for (var c = 0; c < dataConceptos.length; c++) {
                        if (check.val() == dataConceptos[c].idconcepto)
                            check.click();
                    }
                }
            }
        }
        that.dialogoActual = $('#divConceptosFactura').dialogo({
            modal: true,
            width: 850,
            title: 'Conceptos de la factura #' + idfactura,
            buttons: {
                'Aceptar': that.aceptarConceptos,
                Cancelar: function () {
                    that.dialogoActual.dialog('close');
                }
            }
        });
    },
    /** Guada los valores de los conceptos condonables seleccionados para una factura.
     * @returns {void}
     */
    aceptarConceptos: function () {
        var conceptoCondonables = $('#tblConceptosCondonable tbody tr.selected');
        var idfactura = condonarModelo.idfactura;
        var conceptoSelect = [];
        for (var c = 0; c < conceptoCondonables.length; c++) {
            var tr = $(conceptoCondonables[c]);
            conceptoSelect.push({
                iddetallefactura: tr.find('td[header="thSeleccion"]').attr('data-value'),
                idconcepto: tr.find('td[header="thSeleccion"] input').val(),
                concepto: tr.find('td[header="thConcepto"]').text(),
                valor: tr.find('td[header="thValor"]').attr('data-valor'),
                saldo: tr.find('td[header="thSaldo"]').attr('data-valor')
            });
        }
        var concepto = condonarControl.consultarConceptoSelect(idfactura);
        if (!!concepto) {
            concepto.conceptos = conceptoSelect;
        } else {
            if (conceptoSelect.length > 0) {
                condonarModelo.conceptoseleccionado.push({
                    idfactura: idfactura,
                    conceptos: conceptoSelect
                });
            }
        }
        that.dialogoActual.dialog('close');
    },
    /** Valida la información para la condonación en caso de ser correcta graba/imprime
     * @returns {void}
     */
    confirmarGrabar: function () {
        var _this = $(this);
        if (!condonarModelo.suscripcion) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarSuscripcion, __app.mensajes.atencion);
            return;
        }
        var facturaSelec = $('#tblFacturas tbody tr.selected');
        if (facturaSelec.length <= 0) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarFacturas, __app.mensajes.atencion);
            return;
        }
        var facturas = [];
        for (var i = 0; i < facturaSelec.length; i++) {
            var f = $(facturaSelec[i]);
            var idfactura = f.find('td[header="thDetallesFactura"]').attr('data-value');
            var numFac = f.find('td[header="thNumFactura"]').text();
            var conceptos = condonarControl.consultarConceptoSelect(idfactura);
            var factura = condonarControl.consultarFacturaId(idfactura);
            if (!!conceptos) {
                var arrayIds = [];
                if (_this.attr('id') == "btnGrabar") {
                    for (var datc = 0; datc < conceptos.length; datc++) {
                        var dataConceptos = conceptos[datc].conceptos.conceptos;
                        $.each(dataConceptos, function (i, conc) {
                            arrayIds.push({idconcepto: conc.iddetallefactura});
                        });
                        var dataConceptos = arrayIds;
                    }
                } else {
                    for (var datco = 0; datco < conceptos.length; datco++) {
                        var dataConceptos = conceptos[datco].conceptos.conceptos;
                        dataConceptos = dataConceptos.conceptos;
                    }
                }
                facturas.push({
                    idfactura: factura.idfactura,
                    conceptos: dataConceptos
                });
            } else {
                __dom.lanzarAlerta("Debe seleccionar los conceptos para la factura #" + numFac, __app.mensajes.atencion);
                return;
            }
        }
        if (_this.attr('id') == "btnGrabar") {
            var divMotivos = that.dialogoActual = $('div#divMotivos');
            divMotivos.dialogo({
                modal: true,
                width: 400,
                position: {my: "center", at: "top+40%", of: "body"},
                title: 'Condonar cartera corriente',
                buttons: {
                    Cancelar: function () {
                        divMotivos.dialog('close');
                    },
                    Condonar: function () {
                        that.grabarCondonar(facturas);
                        divMotivos.dialog('close');
                    }
                }
            });
        } else {
            that.imprimir();
        }
    },
    /** Hace petición AJAX para grabar la condonación de la cartera corriente
     * @returns {void}
     */
    grabarCondonar: function (facturas) {
        if ($('#cmbMotivosNota').val() <= 0) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarMotivo, __app.mensajes.atencion);
            return;
        }
        if ($('#txtDescripcion').val().trim() == "") {
            __dom.lanzarAlerta(__app.mensajes.escribirDescripcion, __app.mensajes.atencion);
            return;
        }

        datos = {
            idmotivo: $('#cmbMotivosNota').val(),
            descripcion: $('#txtDescripcion').val(),
            suscripcion: {
                idsuscripcion: condonarModelo.suscripcion.idsuscripcion,
                facturas: facturas
            }
        };

        condonarControl.grabarCondonar(datos, that.onGrabarCondonacionCompleto);
    },

    /** Hace petici�n AJAX para consultar las facturas Amortizadas � de interes corriente de una suscripci�n, son mostradas en una tabla
     * y se asignan los listeners de sus controles
     * @returns {void}
     */
    consultarFacturasIntCorriente: function () {
        $('#btnCargarFacturas').attr('disabled', true);
        condonarModelo.conceptoseleccionado = [];
        if (!!condonarModelo.suscripcion) {
            condonarControl.consultarFacturasIntCorriente({idsuscripcion: condonarModelo.suscripcion.idsuscripcion}, function (data) {
                switch (data.codigoRespuesta) {
                    case 0:
                        __dom.lanzarAlerta('La suscripci�n no tiene facturas', __app.mensajes.atencion);
                        condonarModelo.nocondonables = [];
                        condonarModelo.condonables = [];
                        break;
                    case 1:
                        if (data.datos.length > 0) {
                            var saldoCondonables = 0;
                            condonarModelo.facturas = data.datos;
                            condonarModelo.nocondonables = [];
                            condonarModelo.condonables = [];
                            var tblFac = fillTable("tblFacturas", "formatoFacturas", "condonarModelo.facturas", "Facturas");
                            tblFac.find('thead th#thSeleccion input').on('mousedown', that.habilitarChecks);
                            tblFac.find('tbody tr td[header="thSeleccion"] input').on('click', that.seleccionarFactura);
                            tblFac.find('tbody tr td[header="thDetallesFactura"] input')
                                    .on('click', that.mostrarConceptosFactura)
                                    .attr('disabled', true);
                            tblFac.show();
                            for (var f = 0; f < data.datos.length; f++) {
                                var fact = data.datos[f];
                                for (var cc = 0; cc < fact.conceptoscondonables.length; cc++) {
                                    var condonable = fact.conceptoscondonables[cc];
                                    condonable.idfactura = fact.idfactura;
                                    condonarModelo.condonables.push(condonable);
                                    var saldoCondonables = saldoCondonables + parseFloat(condonable.saldo);
                                    $("#txtSaldoCondonable").val(saldoCondonables).toTxtCurrency();
                                }
                                for (var cn = 0; cn < fact.conceptosnocondonables.length; cn++) {
                                    var noCondonable = fact.conceptosnocondonables[cn];
                                    noCondonable.idfactura = fact.idfactura;
                                    condonarModelo.nocondonables.push(noCondonable);
                                }
                            }


                        } else {
                            __dom.lanzarAlerta('La suscripci�n no tiene facturas', __app.mensajes.atencion);
                        }

                        break;
                }
            });
        }
    },

    /** Valida Permiso de activar botones para seleccionar Facturas Mora � Corriente
     * @returns {void}
     */
    validaPermisoBotonesSeleccionFacturas: function () {
        condonarControl.consultaPermisoBotonesSeleccionFacturas({idprograma: 76}, that.evaluaRespuestaPermisoBotones);
    },
    /** Valida Permiso de activar botones para seleccionar Facturas Mora � Corriente
     * @returns {void}
     */
    evaluaRespuestaPermisoBotones: function (data) {

        if (data.codigoRespuesta == 0) {
            __dom.lanzarAlerta(data.mensaje, "Error");
            return;
        }
        for (var i = 0; i < data.datos.length; i++) {
            if (data.datos[i].idunidad == 2564) {
                $('#btnCargarFacturas').removeAttr('disabled');
            }
            if (data.datos[i].idunidad == 2565) {
                $('#btnCargarFacturasIntCorriente').removeAttr('disabled');
            }
        }
    },

    /** Recibe la respuesta del servidor cuando se condona la cartera corriente
     * @returns {void}
     */
    onGrabarCondonacionCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
            case 1:
            case - 1:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion, function () {
                    location.reload();
                });
                break;
        }
    },
    /** Confirma si el usuario desea cancelar la operación actual
     * @returns {void}
     */
    confirmarCancelar: function () {
        if (!!condonarModelo.suscripcion) {
            that.dialogoActual = $('#divConfirmCancelar').dialogo({
                modal: true,
                width: 400,
                title: 'Confirmar cancelar',
                buttons: {
                    Aceptar: function () {
                        that.limpiarFormulario();
                        that.dialogoActual.dialog('close');
                    },
                    Cancelar: function () {
                        that.dialogoActual.dialog('close');
                    }
                }
            });
        }
    },
    /** Limpia el formulario actual y modelo
     * @returns {void}
     */
    limpiarFormulario: function () {
        $('#divCabecera input[type="text"]').val('');
        $('#camposBuscarSuscripcion input[type="text"]').val('');
        $('table').empty();
        condonarModelo = {
            conceptoseleccionado: []
        }
    },
    /**
     * checked los detalles de las facturas a condonar
     * @param {type} idFactura
     * @param {type} indice
     * @returns {void}
     *  autor oabaquero
     */
    checkedDetallesConceptos: function (idFactura, indice) {
        var conceptoSelect = [];
        var facturas = [];
        var conceptos = [];
        for (i = 0; i < condonarModelo.condonables.length; i++) {
            if (condonarModelo.condonables[i].idfactura == idFactura) {
                conceptoSelect.push({
                    iddetallefactura: condonarModelo.condonables[i].iddetallefactura,
                    idconcepto: condonarModelo.condonables[i].idconcepto,
                    concepto: condonarModelo.condonables[i].concepto,
                    valor: condonarModelo.condonables[i].valor,
                    saldo: condonarModelo.condonables[i].saldo
                });
                if (conceptoSelect.length > 0) {
                    if (condonarModelo.conceptoseleccionado.length > 0) {
                        facturas = [];
                        for (var idx = 0; idx < condonarModelo.conceptoseleccionado.length; idx++) {
                            facturas.push(condonarModelo.conceptoseleccionado[idx]['idfactura']);
                            conceptos.push(condonarModelo.conceptoseleccionado[idx]['conceptos']);
                        }
                        if (facturas.indexOf(idFactura) < 0) {
                            condonarModelo.conceptoseleccionado.push({
                                idfactura: idFactura,
                                conceptos: conceptoSelect
                            });
                        }
                        conceptos = [];
                        for (var idxc = 0; idxc < condonarModelo.conceptoseleccionado.length; idxc++) {
                            conceptos.push(condonarModelo.conceptoseleccionado[idxc]['conceptos'][0].idconcepto + condonarModelo.conceptoseleccionado[idxc]['idfactura']);
                        }
                        if (conceptos.indexOf(conceptoSelect[0].idconcepto + idFactura) < 0) {
                            condonarModelo.conceptoseleccionado.push({
                                idfactura: idFactura,
                                conceptos: conceptoSelect
                            });
                        }
                    }
                    if (condonarModelo.conceptoseleccionado.length === 0) {
                        condonarModelo.conceptoseleccionado.push({
                            idfactura: idFactura,
                            conceptos: conceptoSelect
                        });
                    }
                    conceptoSelect = [];
                }
            }
        }
    },

    saldosCondonables: function () {
        var saldoCondonables = 0;
        if (condonarModelo.conceptoseleccionado.length === 0) {
            $("#txtSaldoCondonable").val(0).toTxtCurrency();
        }
        if (condonarModelo.conceptoseleccionado.length > 0) {
            for (i = 0; i < condonarModelo.conceptoseleccionado.length; i++) {
                saldoCondonables = saldoCondonables + parseFloat(condonarModelo.conceptoseleccionado[i].conceptos[0].saldo);
                $("#txtSaldoCondonable").val(saldoCondonables).toTxtCurrency();
            }
        }
    }
};
condonarVista.init();
