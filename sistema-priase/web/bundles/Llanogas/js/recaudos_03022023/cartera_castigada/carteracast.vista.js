/**
 * @fileOverview Archivo de vista y control de cartera castigada
 * @author svanegas
 * @requires recaudos.js
 * @requires carteracast.control.js
 * @requires carteracast.model.js
 * @version 1.0.0
 */


/**
 * Hace referencia a la vista actual (@see carteraVista)
 * @type {object}
 */
var that = null;

/** @namesace */
var carteraVista = {
    /**
     * Hace referencia al último dialogo abierto por la aplicación
     * @type {object}
     */
    dialogoActual: null,
    /**
     * Inicializa el programa de registro de recaudo de cartera castigada
     * @returns {void}
     */
    init: function () {
        that = this;
        __app.vistaActual = carteraVista;
        __app.controlActual = carteraControl;
        var comandos = $('div#divComandos');
        comandos.find('#btnNuevo').on('click', that.onNuevoClic);
        comandos.find('#btnGrabar').on('click', that.guardarRecaudo);
        comandos.find('#btnCancelar').on('click', that.cancelarPago);
        comandos.find('#btnImprimir').on('click', that.validarImpresion);
        $('#btnFormaPago').on('click', that.mostrarFormasPago);
        $('#btnCargarFacturas').on('click', that.cargarFacturas);
        $('#btnAgregarForma').on('click', that.agregarFormaPago);
        cargarBancos();
        __dom.configurarTextoNumerico('txtFiltroSus, #txtFiltroDoc, #txtFiltroCodAnt');
    },
    /**
     * Valida que el usuario tenga impresiones disponibles
     * @returns {void}
     */
    validarImpresion: function () {
        if (carteraModel.resumenRecaudo && carteraModel.autorizacion.estadoimpresion === 'A') {
            var auth = carteraModel.autorizacion.idimpresion;
            carteraControl.actualizarAutorizacion({idimpresion: auth}, function (data) {
                if (data.codigoRespuesta === 1) {
                    carteraModel.autorizacion = data.datos.impresionrecaudo;
                    data.datos.impresionrecaudo.estadoimpresion !== 'A' ? $('#btnImprimir').attr('disabled', 'disabled') : null;
                }
            });
            imprimirTimbre('iFrameTimbre', carteraModel.resumenRecaudo);
        }
    },
    /**
     * Se ejecuta en el evento clic del botón Nuevo, y valida si ya existen suscripciones para limpiar los datos del formulario.
     * @returns {void}
     */
    onNuevoClic: function () {
        if (carteraModel.suscripcion && carteraModel.resumenRecaudo === null) {
            $('div#divConfirmCancelar').dialogo({
                resizable: false,
                heigth: 140,
                modal: true,
                title: 'Cancelar la Operación',
                buttons: {
                    'Sí': function () {
                        $(this).dialog('close');
                        that.limpiarFormulario();
                        that.cancelarFormasPago();
                        mostrarFiltroSuscriptores('div#camposBuscarSuscripcion', that.filtrarSuscriptor);
                    }, Cancelar: function () {
                        $(this).dialog('close');
                    }
                }
            });
        } else {
            mostrarFiltroSuscriptores('div#camposBuscarSuscripcion', that.filtrarSuscriptor);
            that.limpiarFormulario();
            that.cancelarFormasPago();
        }
    },
    /**
     * Valida la información del recaudo y si toda la información se ha diligenciado correctamente, envía la información al servidor
     * para almacenar el recaudo de la cartera castigada
     * @returns {void}
     */
    guardarRecaudo: function () {
        if (!carteraModel.suscripcion) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarSuscripcion, __app.mensajes.atencion);
            return;
        }
        if (!carteraModel.facturas) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarFacturas, __app.mensajes.atencion);
            return;
        }
        if (!carteraModel.formasPago || carteraModel.formasPago.length === 0) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarOpcionPago, __app.mensajes.atencion);
            return;
        }
        //<editor-fold desc="Guarda la información del recaudos realizado" defaultstate="collapsed">
        var recaudo = {};
        $('#btnGrabar').attr('disabled', 'disabled');
        recaudo.pagado = parseFloat($('#txtFormaPago').val());
        recaudo.cambio = parseFloat($('#txtCambio').val());
        recaudo.recaudoreal = parseFloat($('#txtSaldoActual').val());
        recaudo.ajuste = parseFloat($('#txtAjuste').val());
        recaudo.mediopago = $('#cmbMedioPago').val();
        recaudo.clasepago = $('#cmbClasePago').val();
        recaudo.sucursal = $('#cmbSucursal').val();
        recaudo.convenio = 0;
        recaudo.suscriptor = carteraModel.suscripcion.idsuscriptor;
        recaudo.tercero = carteraModel.suscripcion.idtercero;
        recaudo.formasPagos = almacenarFormasPago(carteraModel.formasPago);
        recaudo.distribucion = [];
        //</editor-fold>
        //<editor-fold desc="Guarda la distribución del recaudo " defaultstate="collapsed">
        var facturasRecaudo = [];
        for (var i = 0; i < carteraModel.facturas.length; i++) {
            var factura = carteraModel.facturas[i];
            if (!!factura.abono && factura.abono > 0) {
                var pos = facturasRecaudo.push({
                    factura: factura.idfactura,
                    suscripcion: factura.idsuscripcion,
                    version: factura.version,
                    conceptos: []
                }) - 1;
                for (var j = 0; j < carteraModel.conceptos.length; j++) {
                    var concepto = carteraModel.conceptos[j];
                    if (concepto.idfactura === factura.idfactura && !!concepto.abono) {
                        facturasRecaudo[pos].conceptos.push({
                            idConcepto: concepto.iddetallefactura,
                            idFactura: concepto.idfactura,
                            valorPagado: concepto.abono
                        });
                    }
                }
            }
        }

        recaudo.distribucion.push({
            empresa: carteraModel.suscripcion.idempresa,
            suscripcion: carteraModel.suscripcion.idsuscripcion,
            valorSuscripcion: parseFloat($('#txtFormaPago').val()),
            facturas: facturasRecaudo
        });
        //</editor-fold>


        carteraControl.guardarRecaudo({abono: recaudo}, that.onGuardarCompleto);
    },
    /**
     * Cuando se finaliza la transacción para guardar el recado
     * se limpia el formulario y se informa al usuario del resultado del proceso
     * @param  {object} data Contiene la respuesta del servidor, con codigoRespuesta y mensajeRespuesta
     * @returns {void}
     */
    onGuardarCompleto: function (data) {
        __dom.ocultarCargador();
        switch (data.codigoRespuesta) {
            case 1:
                __dom.lanzarAlerta(data.mensajeRespuesta, 'Información', function () {

                    var impresion = data.impresionrecaudo;
                    var permitidas = (parseInt(impresion.impresionesauth) === parseInt(impresion.impresionesreal));
                    permitidas = permitidas && parseInt(impresion.impresionesauth) > 0;
                    if (impresion.estadoimpresion !== 'A' && !permitidas) {
                        that.limpiarFormulario();
                        return;
                    }

                    $('#btnGrabar').hide();
                    $('#btnImprimir').show();
                    $('#btnFormaPago').attr('disabled', true);
                    carteraModel.autorizacion = impresion;
                    carteraModel.resumenRecaudo = data.recaudo;
                    imprimirTimbre('iFrameTimbre', carteraModel.resumenRecaudo);
                    permitidas ? that.limpiarFormulario() : $('#btnImprimir').removeAttr('disabled');
                });
                break;
            case -1:
                __dom.lanzarAlerta(__app.mensajes.errorGuardarRecaudo, __app.mensajes.atencion);
                break;
        }
    },
    /**
     * Valida la información del filtro y envía la petición al servidor para obtener la información del suscriptor
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
            var data = {idsuscripcion: suscripcion, documento: doc, codanterior: codAnt, estado: 'C'};
            carteraControl.consultarSuscriptor(data, that.consultaSuscripcionCompleto);
        }
    },
    /**
     * Captura la respuesta del servidor cuando se filtra al suscriptor si hay más de un suscriptor se selecciona uno y se cargan las suscripciones de éste.
     * @param  {object} data La respuesta del servidor al consultar las suscripciones con facturas castigadas
     * @returns {void}
     */
    consultaSuscripcionCompleto: function (data) {
        that.limpiarFormulario();
        that.cancelarFormasPago();
        switch (parseInt(data.codigoRespuesta)) {
            case 0:
                that.dialogoActual.find('#spanMensaje').text(__app.mensajes.sinResultados).show();
                break;
            case 1:
                var sus = null;
                if (data.suscripciones.length > 1) {
                    mostrarListaSuscripciones(data.suscripciones, that.dialogoActual, carteraModel, that.cargarCabecera);
                } else {
                    sus = carteraModel.suscripcion = data.suscripciones[0];
                    that.dialogoActual.find('#spanMensaje').hide();
                    that.dialogoActual.dialog('close');
                    that.cargarCabecera(sus);
                }
                break;
        }
    },
    /**
     * Muestra la información del suscriptor en la cabecera del formulario
     * @param  {object} sus           JSON con la información de la suscripción con cartera castigada
     * @returns {void}
     */
    cargarCabecera: function (sus) {
        var cabecera = $('div#divCabecera');
        cabecera.find('#txtIdSuscriptor').val(sus.idsuscriptor);
        cabecera.find('#txtNombre').val(sus.nombretercero);
        cabecera.find('#txtDocumento').val(sus.cedula);
        carteraModel.suscripciones = [sus];
        $('div#divFacturas').hide();
        var tbl = fillTable("tblSuscripciones", "formatoSuscripciones", "carteraModel.suscripciones", "Suscripciones");
        tbl.find('td[header="thSeleccion"] input[type="checkbox"]').on('change', that.onSuscripcionSeleccionada);
        $('div#divDetalles').show('fast');
    },
    /**
     * Carga las facturas que estén castigadas, de las suscripciones seleccionadas
     * @returns {void}
     */
    cargarFacturas: function () {
        //si existe la suscripción dentro del modelo se consultan las facturas
        if (!!carteraModel.suscripcion) {
            carteraControl.consultarFacturas({suscripcion: carteraModel.suscripcion.idsuscripcion}, that.cargarFacturasCompleto);
        } else {
            __dom.lanzarAlerta(__app.mensajes.seleccionarSuscripcion, __app.mensajes.alerta);
        }
    },
    /**
     * Obtiene la respuesta del servidor y carga las facturas encontradas
     * @param  {Object} respuesta Respuesta del servidor
     * @returns {void}
     */
    cargarFacturasCompleto: function (respuesta) {
        switch (parseInt(respuesta.codigoRespuesta)) {
            case 1:
                carteraModel.facturas = respuesta.facturas;
                carteraModel.conceptos = respuesta.conceptos;
                for (var j = 0; j < respuesta.conceptos.length; j++) {
                    var concepto = respuesta.conceptos[j];
                    var factura = carteraControl.consultarFacturaPorId(concepto.idfactura);
                    if (factura) {
                        concepto.numero = factura.numero;
                    }
                }
                that.cargarTablasFacturas();
                break;
            case 0:
                carteraModel.facturas = [];
                $('div#divFacturas')
                        .hide()
                        .find('#txtSaldoActual')
                        .val('');
                __dom.lanzarAlerta(__app.mensajes.suscripcionSinFacturas, __app.mensajes.atencion);
                break;
        }
    },
    /**
     * Muestra un dialogo para confirmar si se desea cancelar la operación de recaudo actual
     * @returns {void}
     */
    cancelarPago: function () {
        if (!!carteraModel.suscripcion) {
            $('div#divConfirmCancelar').dialogo({
                resizable: false,
                heigth: 350,
                modal: true,
                title: 'Cancelar la Operación',
                buttons: {
                    "Sí": function () {
                        $(this).dialog('close');
                        that.limpiarFormulario();
                        that.cancelarFormasPago();
                    }, Cancelar: function () {
                        $(this).dialog("close");
                    }
                }
            });
        }
    },
    /**
     * Limpia el formulario actual, eliminando la información consultada previamente
     * @returns {void}
     */
    limpiarFormulario: function () {
        $('#btnImprimir').hide();
        $('#btnFormaPago').attr('disabled', false);
        $('#btnGrabar').show().removeAttr('disabled');
        var cabecera = $('div#divCabecera');
        cabecera.find('input[type="text"]').val('');
        cabecera.find('select#cmbConvenio').html('');
        var detalles = $('#divDetalles');
        detalles.hide();
        detalles.find('table')
                .removeAttr('data')
                .removeAttr('format')
                .html('');
        carteraModel = {
            suscriptor: null,
            suscripciones: null,
            informacionPago: null,
            facturas: null,
            formasPago: [],
            resumenRecaudo: null
        };
        if (!!formatoFacturas.thead[9]) {
            formatoFacturas.thead.pop();
        }

        $('#controlesFormasPago').html('');
        $('#txtSumatoria').val('');
    },
    /**
     * Muestra un dialogo para que el usuario seleccione las formas de pago con que hará el recaudo de la cartera castigada
     * @returns {void}
     */
    mostrarFormasPago: function () {
        if (!carteraModel.facturas) {
            __dom.lanzarAlerta(__app.mensajes.facturasSinSaldo, __app.mensajes.atencion);
            return;
        }
        that.dialogoActual = $('#divFormasPago');
        that.dialogoActual.dialogo({
            resizable: false,
            width: 800,
            position: {my: "center", at: "top+90", of: "body"},
            modal: true,
            title: 'Formas de Pago',
            beforeClose: that.funcionCerrarDialogo,
            buttons: {
                Aceptar: function () {
                    var sumatoriaPago = parseFloat($('#txtSumatoria').val());
                    var sumatoriaDeuda = parseFloat($('#txtSaldoActual').val());
                    if (sumatoriaPago > sumatoriaDeuda) {
                        __dom.lanzarAlerta(__app.mensajes.valorPagarMenorDeuda, __app.mensajes.atencion);
                        return;
                    } else {
                        if (guardarFormasDePago(carteraModel)) {
                            that.calcularPago();
                            that.funcionCerrarDialogo(null, true);
                        }
                    }
                },
                Cancelar: that.funcionCerrarDialogo
            }
        });
    },
    /**
     * Función que confirma si desea cerrar las formas de pago y eliminarlas
     * @param {Event} e - Evento que dispara la función
     * @param {boolean} cerrar - Valida si quiere ver confirmación
     */
    funcionCerrarDialogo: function (e, cerrar) {
        if (cerrar === true) {
            that.dialogoActual.dialog('destroy');
            return;
        }
        __app.cancelarEvento(e);
        __dom.lanzarAlerta(
                __app.mensajes.confirmaCancelarFormasPago,
                __app.mensajes.tituloConfirmacion,
                function () { //en caso de aceptar
                    that.dialogoActual.dialog('destroy');
                    that.cancelarFormasPago();
                },
                function () {
                    return;
                }
        );
    },
    /**
     * Cancela la selección de las formas de pago
     * @returns {void}
     */
    cancelarFormasPago: function () {
        carteraModel.formasPago = [];
        $('#txtFormaPago, #txtSumatoria').val('');
        $('div#divFormasPago div#controlesFormasPago').html('');
    },
    /**
     * Agrega una nueva forma de pago a la colección de formas de pago seleccionadas por el usuario
     * @returns {void}
     */
    agregarFormaPago: function () {
        carteraModel.formasPago.push({});
        var indice = carteraModel.formasPago.length - 1;
        carteraModel.formasPago[indice].indice = indice;
        var template = null;
        $.get('/achagua/sistema/web/bundles/Llanogas/templates/formaspago.html', function (_template) {
            template = $(_template).filter('#tplFormaPago').html();
            var info = $(Mustache.to_html(template, carteraModel.formasPago[indice]));
            info.find('#cmbBanco' + indice).html(bancos.html());
            $('div#divFormasPago div#controlesFormasPago').append(info);
            that.configurarForma(info, indice);
        });
    },
    /**
     * Configura la interfaz de formas de pago, para que se pueda actualizar o eliminar de la colección de formas de pago
     * @param  {object} info   Información de la forma de pago
     * @param  {int} indice posición de la forma de pago
     * @returns {void}
     */
    configurarForma: function (info, indice) {
        var divFormas = $(info);
        configurarNuevaFormaPago(divFormas, indice);
        divFormas.find('#txtValor' + indice).focusout(that.actualizarSumatoria);
        divFormas.find('button#btnRemoverForma' + indice).on('click', function () {
            carteraModel.formasPago.splice(indice, 1);
            $('div#divFormaPago' + indice).remove();
            that.actualizarSumatoria();
        });
    },
    /**
     * Actualiza la sumatoria de pesos que se han selecciona con cada forma de pago seleccionada por el usuario
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
    /**
     * Valida la deuda del usuario y a compara con la sumatoria de pesos selecciona por el usuario para determinar si la configuración del recaudo es válida.
     * @returns {void}
     */
    calcularPago: function () {
        var txtValorPago = $('#txtFormaPago');
        var valorPagado = parseFloat(txtValorPago.val());
        var saldoActual = parseFloat($('#txtSaldoActual').val());

        //si se ha seleccionado una suscripción con cartera castigada
        if (!!carteraModel.suscripciones && !!carteraModel.facturas) {
            if (txtValorPago.val().trim() !== "" && carteraModel.formasPago.length > 0 && valorPagado > 0) {
                calcularPonderacion(carteraModel.facturas, carteraModel.conceptos, valorPagado);
                var estiloResaltado = {'color': '#FFF', 'background-color': 'rgb(138, 182, 217)'};
                if (formatoFacturas.thead[9] === undefined) {
                    formatoFacturas.thead.push({
                        id: 'thNuevoSaldo',
                        text: 'Nuevo Saldo',
                        sort: false,
                        refer: 'nuevosaldo',
                        type: 'currency',
                        style: estiloResaltado
                    });
                }
                if (formatoConceptos.thead[7] === undefined) {
                    formatoConceptos.thead.push({
                        'id': 'thPago',
                        'text': 'Pago',
                        'sort': false,
                        'refer': 'abono',
                        'type': 'currency',
                        style: estiloResaltado
                    });
                    formatoConceptos.thead.push({
                        'id': 'thNuevoSaldo',
                        'text': 'Nuevo Saldo',
                        'sort': false,
                        'refer': 'nuevosaldo',
                        'type': 'currency',
                        'style': estiloResaltado
                    });
                }
                //calcularPonderacion(carteraModel.facturas, carteraModel.conceptos, valorPagado);
                var nuevoSaldo = parseFloat($('#txtSaldoActual').val() - parseFloat($('#txtFormaPago').val()));
                $('#txtNuevoSaldo').val(nuevoSaldo);// <= 0 ? '0' : Math.abs(nuevoSaldo));
                $('#txtCambio').val("0");
                $('#txtAjuste').val("0");
                that.cargarTablasFacturas();
            } else {
                __dom.lanzarAlerta(__app.mensajes.seleccionarOpcionPago, __app.mensajes.atencion);
            }
        } else {
            __dom.lanzarAlerta(__app.mensajes.seleccionarFacturas, __app.mensajes.atencion);
        }
    },
    /**
     * Carga la tabla de facturas, con base en la consulta de facturas castigadas de las sucripciones seleccionadas
     * @returns {void}
     */
    cargarTablasFacturas: function () {
        fillTable("tblFacturas", "formatoFacturas", "carteraModel.facturas", "Facturas");
        fillTable("tblConceptos", "formatoConceptos", "carteraModel.conceptos", "Conceptos");
        $('div#divFacturas')
                .show()
                .find('#txtSaldoActual')
                .val(calcularSaldoActual(carteraModel));
    }
};

carteraVista.init();
