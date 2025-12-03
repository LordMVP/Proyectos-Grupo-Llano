/**
 * @fileOverview Archivo de vista y control de pagos
 * @author svanegas
 * @requires recaudos.js
 * @requires pagos.control.js
 * @requires pagos.modelo.js
 * @version 1.0.0
 */

/**
 * Objeto que hace referencia al namespace abonosVista
 * @type {object}
 */
var that = null;

/** @namespace */
var pagosVista = {
    /**
     * hace referencia al último dialogo abierto en la aplicación
     * @type {object}
     */
    dialogoActual: null,
    /**
     * Función que se invoca al inciar el objeto pagosVista,asigna comportamientos para los eventos de los controles.
     * @returns {void}
     */
    init: function () {
        that = this;
        __app.vistaActual = pagosVista;
        __app.controlActual = pagosControl;
        var comandos = $('div#divComandos');
        comandos.find('#btnNuevo').on('click', that.onNuevoClic);
        comandos.find('#btnGrabar').on('click', that.guardarRecaudo);
        comandos.find('#btnCancelar').on('click', that.cancelarPago);
        $('#cmbConvenio').on('change', that.onCambioConvenio);
        $('#btnFormaPago').on('click', that.mostrarFormasPago);
        $('#btnCargarFacturas').on('click', that.cargarFacturas);
        $('#btnAgregarForma').on('click', that.agregarFormaPago);
        comandos.find('#btnImprimir').on('click', that.validarImpresion);
        cargarBancos();
        __dom.configurarTextoNumerico('txtFiltroSus, #txtFiltroDoc, #txtFiltroCodAnt');
    },
    /**
     * Valida que el usuario tenga impresiones disponibles
     * @returns {void}
     */
    validarImpresion: function () {
        if (pagosModel.resumenRecaudo && pagosModel.autorizacion.estadoimpresion === 'A') {
            var auth = pagosModel.autorizacion.idimpresion;
            pagosControl.actualizarAutorizacion({idimpresion: auth}, function (data) {
                if (data.codigoRespuesta === 1) {
                    pagosModel.autorizacion = data.datos.impresionrecaudo;
                    data.datos.impresionrecaudo.estadoimpresion !== 'A' ? $('#btnImprimir').attr('disabled', 'disabled') : null;
                }
            });
            imprimirTimbre('iFrameTimbre', pagosModel.resumenRecaudo);
        }
    },
    /**
     * Se ejecuta en el evento clic del botón Nuevo, y valida si ya existen suscripciones para limpiar los datos del formulario.
     * @returns {void}
     */
    onNuevoClic: function () {
        if (pagosModel.suscripcion && pagosModel.resumenRecaudo === null) {
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
     * Valida el formulario nuevamente y si todo está correcto almacena la información del recaudo en un objeto JSON que
     * será enviado a la capa del backend para que se efectue la transacción de guardar recaudo.
     * @returns {void}
     */
    guardarRecaudo: function () {
        if (!pagosModel.suscripciones) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarSuscripcion, __app.mensajes.atencion);
            return;
        }

        if (!pagosModel.facturas) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarFacturas, __app.mensajes.atencion);
            return;
        }

        if (!pagosModel.formasPago || pagosModel.formasPago.length === 0) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarOpcionPago, __app.mensajes.atencion);
            return;
        }

        //se construye el objeto JSON que será enviado al servidor.
        
        var recaudo = {};
        $('#btnGrabar').attr('disabled', 'disabled');
        recaudo.pagado = parseFloat($('#txtFormaPago').val());
        recaudo.cambio = parseFloat($('#txtCambio').val());
        recaudo.recaudoreal = parseFloat($('#txtSaldoActual').val());
        recaudo.mediopago = $('#cmbMedioPago').val();
        recaudo.clasepago = $('#cmbClasePago').val();
        recaudo.sucursal = $('#cmbSucursal').val();
        recaudo.ajuste = parseFloat($('#txtAjuste').val());
        recaudo.convenio = pagosModel.suscripciones[0].idconvenio;
        recaudo.suscriptor = pagosModel.suscripciones[0].idsuscriptor;
        recaudo.tercero = pagosModel.suscripciones[0].idtercero;
        recaudo.formasPagos = almacenarFormasPago(pagosModel.formasPago);
        recaudo.distribucion = [];

        //recorre las suscripciones
        for (var i = 0; i < pagosModel.suscripciones.length; i++) {
            var suscripcion = pagosModel.suscripciones[i];
            var valorSuscripcion = 0;
            var facturasRecaudo = [];
            //recorre las facturas

            for (var f = 0; f < pagosModel.facturas.length; f++) {
                var factura = pagosModel.facturas[f];
                if (factura.idsuscripcion === suscripcion.idsuscripcion) {
                    //si la factura tiene abonos agrega la informaciòn a facturasConRecaudo
                    if (!!pagosModel.facturas[f].abono && pagosModel.facturas[f].abono > 0) {
                        valorSuscripcion += factura.abono;
                        var pos = facturasRecaudo.push({
                            factura: factura.idfactura,
                            suscripcion: factura.idsuscripcion,
                            version: factura.version,
                            conceptos: []
                        }) - 1;
                        for (var j = 0; j < pagosModel.conceptos.length; j++) {
                            var concepto = pagosModel.conceptos[j];
                            if (concepto.idfactura === factura.idfactura && !!concepto.abono && concepto.abono > 0) {
                                facturasRecaudo[pos].conceptos.push({
                                    idConcepto: concepto.iddetallefactura,
                                    idFactura: concepto.idfactura,
                                    valorPagado: concepto.abono
                                });
                            }
                        }
                    }
                }
            }
            recaudo.distribucion.push({
                empresa: suscripcion.idempresa,
                suscripcion: suscripcion.idsuscripcion,
                valorSuscripcion: valorSuscripcion,
                facturas: facturasRecaudo
            });
        }
        pagosControl.guardarRecaudo({pago: recaudo}, that.onGuardarCompleto);
    },
    /**
     * Función de callback que se invoca cuando se termina de guardar el recaudo en el servidor
     * @param  {Object} data Objeto que retorna la información del servidor cuando se ha guardado un recaudo
     * @returns {void}
     */
    onGuardarCompleto: function (data) {
        if (data.codigoRespuesta === 1) {
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
                pagosModel.autorizacion = impresion;
                pagosModel.resumenRecaudo = data.recaudo;
                imprimirTimbre('iFrameTimbre', pagosModel.resumenRecaudo);
                permitidas ? that.limpiarFormulario() : $('#btnImprimir').removeAttr('disabled');
            });
        }
    },
    /**
     * Recorre la información del formulario de filtro y la envía al servidor para traer la lista de suscripciones.
     * @returns {void}
     */
    filtrarSuscriptor: function () {
        var filtro = $('div#camposBuscarSuscripcion');
        var suscripcion = filtro.find('#txtFiltroSus').val().trim();
        var doc = filtro.find('#txtFiltroDoc').val().trim();
        var codAnt = filtro.find('#txtFiltroCodAnt').val().trim();
        if (suscripcion == '' && doc == '' && codAnt == '') {
            filtro.find('#spanMensaje').text(__app.mensajes.camposInvalidosFiltro).show();
        } else {
            var data = {idsuscripcion: suscripcion, documento: doc, codanterior: codAnt};
            pagosControl.consultarSuscriptor(data, that.consultaSuscripcionCompleto);
        }
    },
    /**
     * Función de callback para mostrar los resultados de la búsqueda y el usuario pueda seleccionar un suscriptor o varias suscripciones para efectuar el recaudo.
     * @param  {Object} data Respuesta del servidor al consultar los suscriptores
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
                    mostrarListaSuscripciones(data.suscripciones, that.dialogoActual, pagosModel, that.consultarSuscripciones);
                } else {
                    that.dialogoActual.find('#spanMensaje').hide();
                    that.dialogoActual.dialog('close');
                    that.consultarSuscripciones(data.suscripciones[0]);
                }
                break;
        }
    },
    /**
     * Consulta las suscripciones que pertenecen al convenio del suscriptor
     * @param  {Object} suscripcion La suscripción de la cual se obtiene la información del suscriptor
     * @returns {void}
     */
    consultarSuscripciones: function (suscripcion) {
        pagosControl.consultarSuscripciones(
                {idsuscriptor: suscripcion.idsuscriptor},
                that.cargarCabecera
                );
    },
    /**
     * Carga la información de las suscripciones y el suscriptor seleccionado
     * @param  {Object} data Respuesta del servidor
     * @returns {void}
     */
    cargarCabecera: function (data) {
        switch (parseInt(data.codigoRespuesta)) {
            case 0:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                return;
                break;
            case 1:
                pagosModel.suscripciones = data.suscripciones;

                var sus = data.suscripciones[0];
                var cabecera = $('div#divCabecera');
                cabecera.find('#txtIdSuscriptor').val(sus.idsuscriptor);
                cabecera.find('#txtNombre').val(sus.nombretercero);
                cabecera.find('#txtDocumento').val(sus.cedula);
                cabecera.find('#txtConvenio').val(sus.nombreconvenio);
                var tbl1 = fillTable('tblSuscripciones', 'formatoSuscripciones', 'pagosModel.suscripciones', 'Suscripciones');
                $('#divDetalles').show();
                break;
        }
    },
    /**
     * Invoca la petición asincrona para cargar las facturas que pertenencen a las suscripciones seleccionadas
     * @returns {void}
     */
    cargarFacturas: function () {
        var ids = [];
        for (var i = 0; i < pagosModel.suscripciones.length; i++) {
            ids.push(pagosModel.suscripciones[i].idsuscripcion);
        }
        var strIds = JSON.stringify(ids).replace('[', '').replace(']', '');
        pagosControl.consultarFacturas({'suscripcion': strIds}, that.cargarFacturasCompleto);
    },
    /**
     * Función de callback que controla la respuesta del servidor cuando trae la consulta de las facturas.
     * @param  {Object} respuesta La respuesta del servidor con las facturas de las suscripciones seleccionadas
     * @returns {void}
     */
    cargarFacturasCompleto: function (respuesta) {
        switch (parseInt(respuesta.codigoRespuesta)) {
            case 1:
                pagosModel.facturas = respuesta.facturas;
                pagosModel.conceptos = respuesta.conceptos;

                for (var j = 0; j < respuesta.conceptos.length; j++) {
                    var concepto = respuesta.conceptos[j];
                    var factura = pagosControl.consultarFacturaPorId(concepto.idfactura);
                    if (factura) {
                        concepto.numero = factura.numero;
                    }
                }
                pagosModel.formasPago = [];
                that.cancelarFormasPago();
                that.cargarTablasFacturas();
                $('#btnFormaPago').attr('disabled', false);
                break;
            case 0:
                pagosModel.facturas = [];
                $('div#divFacturas')
                        .hide()
                        .find('#txtSaldoActual')
                        .val('');
                __dom.lanzarAlerta(__app.mensajes.suscripcionSinFacturas, 'Información');
                break;
        }
    },
    /** Confirma si el usuario desea cancelar la operación actual
     * @returns {void}
     */
    cancelarPago: function () {
        if (!!pagosModel.suscripciones) {
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
                    }, Cancelar: function () {
                        $(this).dialog('close');
                    }
                }

            });
        }
    },
    /** Limpia los valores de los formularios, la tabla y el modelo
     * @returns {void}
     */
    limpiarFormulario: function () {
        $('input[type="text"]').val('');
        $('#divDetalles table').html('');
        $('#btnImprimir, #divDetalles').hide();
        $('#btnFormaPago').attr('disabled', true);
        $('#btnGrabar').show().removeAttr('disabled');
        pagosModel = {
            facturas: [],
            formasPago: [],
            conceptos: [],
        };
        $('#controlesFormasPago, #txtSumatoria, select#cmbConvenio').html('');
    },
    /** Muestra cuadro de dialogo las formas de pago que se pueden aplicar al pago
     * @returns {void}
     */
    mostrarFormasPago: function () {
        if (pagosModel.facturas.length <= 0) {
            __dom.lanzarAlerta('No hay facturas con saldo', __app.mensajes.atencion);
            return;
        }
        var dialogo = $('#divFormasPago');
        dialogo.off('close');
        that.dialogoActual = dialogo.dialogo({
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
                    if (sumatoriaPago !== sumatoriaDeuda) {
                        __dom.lanzarAlerta(__app.mensajes.valorPagadoMayorDeuda, __app.mensajes.atencion);
                        return;
                    } else {
                        if (guardarFormasDePago(pagosModel)) {
                            that.funcionCerrarDialogo(null, true);
                            that.calcularPago();
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
                    if (e) {
                    }
                    return;
                }
        );
    },
    /**
     * Cancela las formas de pago y limpia la colección de formas de pago seleccionadas por el usuario
     * @returns {void}
     */
    cancelarFormasPago: function () {
        pagosModel.formasPago = [];
        $('#txtFormaPago, #txtSumatoria').val('');
        $('div#divFormasPago div#controlesFormasPago').html('');
    },
    /**
     * Agrega una nueva forma de pago a la interfaz
     * @returns {void}
     */
    agregarFormaPago: function () {
        pagosModel.formasPago.push({});
        var indice = pagosModel.formasPago.length - 1;
        pagosModel.formasPago[indice].indice = indice;
        var template = null;
        $.get('/achagua/sistema/web/bundles/Llanogas/templates/formaspago.html', function (_template) {
            template = $(_template).filter('#tplFormaPago').html();
            var info = $(Mustache.to_html(template, pagosModel.formasPago[indice]));
            info.find('#cmbBanco' + indice).html(bancos.html());
            $('div#divFormasPago div#controlesFormasPago').append(info);
            that.configurarForma(info, indice);
        });
    },
    /**
     * Configura la nueva forma de pago agregada a la interfaz gráfica
     * @param  {object} formas - Elemento HTML que contiene la información de las formas de pago
     * @param  {int} indice - Posición de la forma de pago, iniciando desde 0
     * @returns {void}
     */
    configurarForma: function (info, indice) {
        var divFormas = $(info);
        configurarNuevaFormaPago(divFormas, indice);
        divFormas.find('#txtValor' + indice).focusout(that.actualizarSumatoria);
        divFormas.find('button#btnRemoverForma' + indice).on('click', function () {

            $('div#divFormaPago' + indice).remove();
            that.eliminarForma(indice);
            that.actualizarSumatoria();
            if (indice < pagosModel.formasPago.length) {
                that.actualizarIndices(indice);
            }
        });
    },
    /**
     * Elimina una forma de pago según el índice
     * @returns {void}
     */
    eliminarForma: function (indice) {
        for (var i = indice; i < pagosModel.formasPago.length; i++) {
            var forma = pagosModel.formasPago[i];
            if (forma.indice == indice) {
                pagosModel.formasPago.splice(i, 1);
            }
        }
    },
    /**
     * Actualiza la sumatoria en pesos de las formas de pago y calcula diferencia con respecto al saldo de las facturas.
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
     * Calcular la deuda del usuario y muestra la información de las facturas y los conceptos
     * @returns {void}
     */
    calcularPago: function () {
        var txtValorPago = $('#txtFormaPago');
        if (!!pagosModel.suscripciones && !!pagosModel.facturas) {
            if (txtValorPago.val().trim() !== "" && pagosModel.formasPago.length > 0 && txtValorPago.val() > 0) {
                calcularPonderacion(pagosModel.facturas, pagosModel.conceptos, parseFloat(txtValorPago.val()));
                var estiloResaltado = {'color': '#FFF', 'background-color': 'rgb(138, 182, 217)'};
                if (formatoFacturas.thead[8] === undefined) {
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

                var nuevoSaldo = parseFloat($('#txtSaldoActual').val() - parseFloat($('#txtFormaPago').val()));
                $('#txtNuevoSaldo').val(nuevoSaldo < 0 ? '0' : Math.abs(nuevoSaldo));
                $('#txtCambio').val("0");
                $('#txtAjuste').val("0");
                that.cargarTablasFacturas();
            } else {
                __dom.lanzarAlerta("Debe agregar una forma de pago", "Información insuficiente");
                formatoFacturas.thead.splice(8, 1);
                formatoConceptos.thead.splice(7, 2);
                that.cargarTablasFacturas();
            }
        } else {
            __dom.lanzarAlerta("Antes de calcular un pago debe cargar facturas o conceptos con saldo", "Información insuficiente");
        }
    },
    /**
     * Muestra las facturas con saldo del usuario
     * @returns {void}
     */
    cargarTablasFacturas: function () {
        fillTable("tblFacturas", "formatoFacturas", "pagosModel.facturas", "Facturas");
        $('div#divFacturas').show();

        $('#txtSaldoActual').val(calcularSaldoActual(pagosModel));

        var tbl3 = fillTable("tblConceptos", "formatoConceptos", "pagosModel.conceptos", "Conceptos");
        tbl3.show();
    }
}

pagosVista.init();
