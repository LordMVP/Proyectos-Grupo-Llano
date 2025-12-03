/**
 * @fileOverview Archivo de vista y control de recaudo rápido
 * @author Angélica Gómez
 * @requires control.js
 * @requires modelo.js
 * @version 1.2.0
 */
/**
 * Objeto que hace referencia al namespace recaudoRapidoVista
 * @type {Object}
 */
var self = null;

/** @namespace */
var recaudoRapidoVista = {
    /** Hace referencia al último dialogo abierto en la aplicación
     * @type {object}
     */
    dialogoActual: null,
    /**Inicializa el programa de recaudo rápido, y asigna eventos a los controles
     * @returns {void}
     */
    init: function () {
        self = recaudoRapidoVista;
        cargarBancos();
        __dom.configurarCalendarioTiempo('txtFechaPago');
        __dom.configurarTextoNumerico('txtValorPagado', false, true);
        recaudoRapidoControl.consultarEmpresaConvenio(self.consultarEmpresaConvenio);
        __dom.configurarTextoNumerico($('#txtSuscripcion')).on('keypress', self.clickEnter);

        var check = $('#divEmpresas input[type="checkbox"]').not('input[seleccionada="0"]');
        check.prop('checked', false);
        $('#btnGrabarFinal, #btnGrabar').on('click', self.guardarRecaudo);
        $('#txtSuscripcion').on('blur', self.blurSuscripcion);

        $('#btnCancelar').on('click', self.confirmarCancelar);
        $('#btnFormaPago').on('click', self.mostrarFormasPago);
        $('#btnAgregarForma').on('click', self.agregarFormaPago);
        $('#btnBuscarEmpresa').on('click', self.mostrarEmpresa);
        $('#btnImprimir').on('click', self.validarImpresion);
        $('#txtValorPagado').on('blur', self.validarPagoyFormaPago);
        $('#txtSuscripcion').focus();
    },
    /**
     * Agrega una forma de pago de tipo efectivo con el valor del recaudo agregagdo
     */
    validarPagoyFormaPago: function () {
        self.cancelarFormasPago();
        if (recaudoRapidoModelo.formasPago.length === 0) {
            $('#btnAgregarForma').click();
        }
        setTimeout(self.insertarPagoEfectivo, 50);
    },
    /**
     * Valida que el usuario tenga impresiones disponibles
     * @returns {void}
     */
    validarImpresion: function () {
        if (recaudoRapidoModelo.resumenRecaudo && recaudoRapidoModelo.autorizacion.estadoimpresion === 'A') {
            var auth = recaudoRapidoModelo.autorizacion.idimpresion;
            recaudoRapidoControl.actualizarAutorizacion({idimpresion: auth}, function (data) {
                if (data.codigoRespuesta === 1) {
                    recaudoRapidoModelo.autorizacion = data.datos.impresionrecaudo;
                    data.datos.impresionrecaudo.estadoimpresion !== 'A' ? $('#btnImprimir').attr('disabled', 'disabled') : null;
                }
            });
            imprimirTimbre('iFrameTimbre', recaudoRapidoModelo.resumenRecaudo);
        }
    },
    /** Valida si el usuario realmente quiere limpiar la caja de texto de suscripción
     * @returns {void}
     **/
    blurSuscripcion: function () {
        var _this = $(this);

        if (_this.val().trim() === '' && !!recaudoRapidoModelo.suscripciones) {
            var idsus = recaudoRapidoModelo.suscripciones[0].idsuscripcion;
            __dom.lanzarAlerta(
                    __app.mensajes.confirmacionCancelacion,
                    __app.mensajes.atencion,
                    function () {
                        self.limpiarFormulario();
                        $('#txtSuscripcion, #txtFactura').val('');
                    },
                    function () {
                        $('#txtSuscripcion').val(idsus);
                    }
            );

        }
    },
    /**Captura la respuesta del servidor cuando se está validando 
     *  si es un recaudador externo
     * @param {object} data - Respuesta del servidor
     * @returns {void}
     */
    validarRecaudadorExterno: function (data) {
        if (data.codigoRespuesta !== 1)
            return;

        var div = $('#divOcultar').hide();
        recaudoRapidoModelo.recaudoExterno = data.datos[0].recaudaexterno;
        if (data.datos[0].recaudaexterno === 'S') {
            self.mostrarEmpresa();
            div.show();
        }
    },
    /**Captura la respuesta del servidor cuando se consulta las empresas que tienen convenio con la empresa logueada.
     * @param {object} data - Respuesta del servidor con las empresas que tienen convenio
     * @returns {void}
     */
    consultarEmpresaConvenio: function (data) {
        $('#pMensajeEmpresa').text('');
        switch (data.codigoRespuesta) {
            case 1:
                var empresas = "";
                recaudoRapidoModelo.empresasConvenio = data.datos;
                $.each(data.datos, function (i, item) {
                    var div = $('<div>').append(
                            $('<input>').attr('type', 'checkbox')
                            .attr('id', 'chk_empresa_' + item.idempresa)
                            .val(item.idempresa)
                            .prop('checked', true),
                            $('<label>').attr('for', 'chk_empresa_' + item.idempresa)
                            .text(item.empresa)
                            );

                    empresas += item.empresa.substring(0, 3) + " - ";


                    $('#divEmpresas').append(div);
                    if (item.idempresa == $('#txtIdEmpresaHide').val()) {
                        $('#chk_empresa_' + item.idempresa).prop('checked', true).attr('disabled', true).attr('seleccionada', '0');
                    }

                });
                empresas = empresas.substring(0, empresas.length - 2);
                $('#txtEmpresa').val(empresas);
                break;
            case 0:
                $('#pMensajeEmpresa').text('No se encontraron empresas');
                break;
        }
        recaudoRapidoControl.validarRecaudadorExterno(self.validarRecaudadorExterno);
    },
    /**
     * Invoca funciones para visualizar información de la suscripción. Si el evento se disparó por teclear enter debido a que el enter es disparado por el lector de barras
     * @param {object} e - Evento que disparó la función
     * @returns {void}
     */
    clickEnter: function (e) {
        var _this = $(this);
        var txtSuscripcion = $('#txtSuscripcion');
        if (_this.attr('id') !== 'txtSuscripcion') {
            return;
        }
        if (e.which !== 13) {
            return;
        }
        if (_this.val().trim() === "") {
            return;
        }

        self.limpiarFormulario();
        var idsuscripcion = '';
        var valorFactura = null;
        $('#txtFactura').val('');
        var valorCodigo = txtSuscripcion.val().trim();

        if (valorCodigo.length > 10) {
            idsuscripcion = valorCodigo.substring(20, 30);
            idsuscripcion = parseInt(idsuscripcion);

            if (recaudoRapidoModelo.recaudoExterno === 'S') {
                valorFactura = valorCodigo.substring(34, 44);
                valorFactura = !isNaN(parseInt(valorFactura)) ? parseInt(valorFactura) : 0;
                recaudoRapidoModelo.valorFactura = valorFactura;
            }
        } else {
            idsuscripcion = valorCodigo;
        }
        txtSuscripcion.val(idsuscripcion);
        ///Se hace para verificar que primero se haya guardado los valores de la factura
        setTimeout(function () {
            self.consultarAjaxSuscripcion(idsuscripcion);
        }, 50);
    },
    /**
     * Consulta la información de una suscripción cuando la consulta es hecha por código ed barras
     * @param {number} idsuscripcion - Id de la suscripciónn que es sacada de la factura
     */
    consultarAjaxSuscripcion: function (idsuscripcion) {
        var btnForma = $('#btnAgregarForma');
        var btnGrabar = $('#btnGrabarFinal');
        var txtSuscripcion = $('#txtSuscripcion');
        var txtValor = $('#txtValorPagado').attr('disabled', 'disabled');
        if (isNaN(parseInt(idsuscripcion))) {
            txtSuscripcion.val('');
            __dom.lanzarAlerta('La suscripción debe ser un valor numérico', __app.mensajes.atencion, true);
            return;
        }

        btnForma.click();
        btnGrabar.focus();
        ///Cuando el usuario sea autónomo siempre pordrá editar el valor a pagar (Pedido por leorey)
        if (recaudoRapidoModelo.recaudoExterno === 'S') {
            txtValor.removeAttr('disabled');
        }
        recaudoRapidoControl.consultarSuscripcion({idsuscripcion: idsuscripcion}, self.cargarSuscripcion);
    },
    /**
     * Configura la vista actual para realizar el recaudo según la información de la suscripción actual
     * @param {Objeto} data - Información de la suscripción enviada por el servidor
     */
    cargarSuscripcion: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion, function () {
                    $('#txtSuscripcion').focus();
                });
                break;
            case 1:
                self.cargarFactura($('#txtSuscripcion').val());
                recaudoRapidoModelo.suscripciones = data.datos.suscripcion;
                var tiposdocumentos = data.datos.tipodocumentoanticipos;
                var cmb = $('#cmbTiposDocumento').empty();
                __dom.llenarCombo(cmb, tiposdocumentos, 'uni_tipdocument', 'tido_nombre').val(tiposdocumentos[0].uni_tipdocument);
                break;
        }
    },
    /** Consulta las facturas con saldo de la suscripción buscada y guarda la informción enviada por el servidor en el modelo
     * @returns {void}
     */
    cargarFactura: function (sus) {
        recaudoRapidoControl.consultarFacturas({suscripcion: sus}, self.onConsultarFacturasCompleto);
    },
    /**
     * Limpia la información cargada y recibe la información de las facturas que la suscripción tiene pendientes por pagar
     * @param {Object} data - Respuesta del servidor con facturas y conceptos pendientes de pago
     */
    onConsultarFacturasCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 1:
                recaudoRapidoModelo.facturas = data.datos.facturas;
                recaudoRapidoModelo.facturaspagar = JSON.parse(JSON.stringify(data.datos.facturas));
                recaudoRapidoModelo.conceptos = data.datos.conceptos;
                self.seleccionarEmpresaFactura(data.datos.facturas);
                break;
            case 0:
                self.configurarRecaudoAnticipo();
                recaudoRapidoModelo.facturas = [];
                recaudoRapidoModelo.facturaspagar = [];
                $('#divDetalles, #divFacturas').hide()
                        .find('#txtSaldoActual').val('');
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                break;
        }
    },
    /**
     * En caso de que el cliente no tenga facturas pendientes de pago y el recaudador sea externo
     * y se haya pagado se realiza un anticipo con el valor digitado
     */
    configurarRecaudoAnticipo: function () {
        if (recaudoRapidoModelo.recaudoExterno === 'S') {
            recaudoRapidoModelo.accion = 'anticipo';
            $('#txtValorPagado').val(recaudoRapidoModelo.valorFactura);
            self.insertarPagoEfectivo();
        }
    },
    /** Valida cuáles son las facturas de las empresas que no están seleccionadas y son ocultadas
     * @returns {void}
     **/
    validarEmpresasFactura: function (factura) {
        var check = $('#divEmpresas input[type="checkbox"]').not('input[seleccionada="0"]');
        $.each(check, function (i, item) {
            for (var e = 0; e < factura.length; e++) {
                var cont = 0;
                if (factura[e].idempresa == item.value) {
                    $(item).attr('disabled', false);
                    cont++;
                    break;
                }
                if (cont == 0) {
                    item.checked = false;
                    $(item).attr('disabled', true);
                }
            }
        });
        self.seleccionarEmpresaFactura();
    },
    /**
     * Carga la tabla de facturas de las suscripciones selecciondas
     * @returns {void}
     */
    cargarTablasFacturas: function () {
        if (!recaudoRapidoModelo.facturas) {
            return;
        }
        var total = 0;
        $('#divDetalles, #divFacturas').show();
        fillTable("tblFacturas", "formatoFacturas", "recaudoRapidoModelo.facturas", "Facturas");
        //.find('#txtSaldoActual').val(self.calcularSaldoActual(recaudoRapidoModelo));
        if (recaudoRapidoModelo.facturas.length > 0) {
            var fechaMenor = __app.obtenerFechaSistema();
            for (var i = 0; i < recaudoRapidoModelo.facturas.length; i++) {
                var factura = recaudoRapidoModelo.facturas[i];
                var fechaV = self.convertirFecha(factura.fechavencimiento);
                var numFactura = recaudoRapidoModelo.facturas[0].numero;
                if (fechaMenor > fechaV) {
                    fechaMenor = fechaV;
                    numFactura = factura.numero;
                }
            }
            var mes = (fechaMenor.getMonth() + 1) < 12 ? '0' + (fechaMenor.getMonth() + 1) : (fechaMenor.getMonth() + 1);
            var f = fechaMenor.getFullYear() + '-' + mes + '-' + fechaMenor.getDate();
            $('#txtFechaVencimiento').val(f);
            $('#txtFactura').val(numFactura);
            var totales = self.actualizarValorTotal();
            var total = totales.saldo;
        } else {
            var factura = recaudoRapidoModelo.facturas[0];
            if (factura) {
                total = parseInt(factura.saldofactura.split('.')[0]);
                $('#txtFechaVencimiento').val(factura.fechavencimiento);
                $('#txtValorPagado').val(total);
                $('#txtFactura').val(factura.numero);
            } else {
                __dom.lanzarAlerta(__app.mensajes.facturasSinSaldo, __app.mensajes.atencion, that.limpiarFormulario);
            }
        }
        if (recaudoRapidoModelo.recaudoExterno === 'N') {
            $('#txtSaldoActual').val(total);
        }
        setTimeout(self.insertarPagoEfectivo, 200);
        //self.validarProblemaAlPagar(total, totales);
    },
    /**
     * Valida que el valor de la factura sea igual a lo pagado sólo puede diferir si es recaudador externo
     * @deprecated
     * @param {number} total - Total de lo pagado
     * @param totales -
     */
    validarProblemaAlPagar: function (total, totales) {
        recaudoRapidoModelo.grabar = 'S';
        var vlrTimbre = recaudoRapidoModelo.valorFactura;
        var boolDiferenciaPrecio = vlrTimbre ? (total !== parseInt(vlrTimbre)) : false;
        if (recaudoRapidoModelo.recaudoExterno !== 'S' && boolDiferenciaPrecio) {
            recaudoRapidoModelo.grabar = 'N';
            $('#pValor span').text(total.toString().toCurrency());
            $('#pValorFact span').text(vlrTimbre.toString().toCurrency());
            self.dialogoActual = $('#divPagoError').dialogo({
                modal: true,
                width: 450,
                title: 'Problemas al pagar',
                buttons: {
                    Aceptar: function () {
                        self.dialogoActual.dialog('close');
                    }
                }
            });
        }

        setTimeout(self.insertarPagoEfectivo, 200);
    },
    /** Actualiza la sumatoria del saldo de las facturas pendientes por pagar
     * @returns {void}
     **/
    actualizarValorTotal: function () {
        var facturas = $('#tblFacturas tbody tr');
        var totalFacturas = 0;
        var totalSaldos = 0;
        var vlrPagar = 0;
        for (var index = 0; index < facturas.length; index++) {
            var tdvalor = $(facturas[index]).find('td[header="thValorTotal"]').attr('data-valor');
            var tdSaldo = $(facturas[index]).find('td[header="thSaldoFactura"]').attr('data-valor');

            var valor = parseInt(tdvalor.split('.')[0]);
            totalSaldos += parseInt(tdSaldo);
            totalFacturas += valor;
        }
        vlrPagar = totalSaldos;
        //totalFacturas = (!!recaudoRapidoModelo.valorFactura) ? recaudoRapidoModelo.valorFactura : totalFacturas;
        /*if (recaudoRapidoModelo.recaudoExterno === 'S') {
         vlrPagar = recaudoRapidoModelo.valorFactura > 0 ? recaudoRapidoModelo.valorFactura : totalSaldos;
         }*/

        if (recaudoRapidoModelo.accion !== 'anticipo') {
            $('#txtValorPagado').val(vlrPagar);
        }
        $('#txtSaldoActual').val(totalSaldos);
        return {total: totalFacturas, saldo: totalSaldos};
    },
    /** Agregar una forma de pago efectivo con valor del valor a pagar por defecto
     * @returns {void}
     **/
    insertarPagoEfectivo: function () {
        var txtPagado = parseFloat($('#txtValorPagado').val());
        if (!isNaN(txtPagado)) {
            var forma = $($('div#divFormasPago div#controlesFormasPago div[id^="divFormaPago"]')[0]);
            forma.find('input[id^="txtValor"]').val(txtPagado);
            guardarFormasDePago(recaudoRapidoModelo);
            self.actualizarSumatoria();
            if (recaudoRapidoModelo.accion !== 'anticipo')
                calcularPonderacion(recaudoRapidoModelo.facturaspagar, recaudoRapidoModelo.conceptos, parseFloat($('#txtFormaPago').val()));
        } else {
            $('#txtValorPagado').val(0);
        }
    },
    /**
     * Convierte a Date un string con formato yyyy-mm-dd+
     * @param {fecha} fecha - Variable que contiene la fecha
     * @returns {Date} date- string convertido en fecha.
     */
    convertirFecha: function (fecha) {
        var fArray = fecha.split('-');
        var date = new Date();
        date.setYear(fArray[0]);
        date.setMonth((fArray[1]) - 1);
        date.setDate(fArray[2]);
        return date;
    },
    /**
     * Muestra las formas de pago que se pueden aplicar al recaudo
     * @returns {void}
     */
    mostrarFormasPago: function () {
        if (!recaudoRapidoModelo.facturas && recaudoRapidoModelo.accion !== 'anticipo') {
            __dom.lanzarAlerta(__app.mensajes.facturasSinSaldo, __app.mensajes.atencion);
            return;
        }
        var dialogo = self.dialogoActual = $('#divFormasPago');
        dialogo.dialogo({
            resizable: false,
            width: 800,
            position: {my: "center", at: "top+90", of: "body"},
            modal: true,
            title: 'Formas de Pago',
            beforeClose: self.funcionCerrarDialogo,
            buttons: {
                Aceptar: function () {
                    var sumatoriaPago = parseInt($('#txtSumatoria').val());
                    var sumatoriaDeuda = parseInt($('#txtValorPagado').val());
                    if (sumatoriaPago !== sumatoriaDeuda) {
                        __dom.lanzarAlerta(__app.mensajes.valorPagadoMayorPagado, __app.mensajes.atencion);
                        return;
                    }
                    if (guardarFormasDePago(recaudoRapidoModelo)) {
                        self.funcionCerrarDialogo(null, true);
                        if (!!recaudoRapidoModelo.facturaspagar) {
                            calcularPonderacion(recaudoRapidoModelo.facturaspagar, recaudoRapidoModelo.conceptos, sumatoriaPago);
                        }
                    }
                },
                Cancelar: self.funcionCerrarDialogo
            }
        });
    },
    /**
     * Confirma que si va a cerrar el diálogo se perderán todas las formas de pago grabadas
     * @param {Event} e - Evento que genera la confirmación (Puede ser por el botón "close" o "Cancelar")
     * @param {bool}cerrar - No muestra la confirmación para cerrar sólo lo cierra sin borrar nada
     */
    funcionCerrarDialogo: function (e, cerrar) {
        if (cerrar === true) {
            self.dialogoActual.dialog('destroy');
            return;
        }
        __app.cancelarEvento(e);
        __dom.lanzarAlerta(
                __app.mensajes.confirmaCancelarFormasPago,
                __app.mensajes.tituloConfirmacion,
                function () { //en caso de aceptar
                    self.dialogoActual.dialog('destroy');
                    self.cancelarFormasPago();
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
        recaudoRapidoModelo.formasPago = [];
        $('#txtFormaPago, #txtSumatoria').val('');
        $('div#divFormasPago div#controlesFormasPago').html('');
    },
    /**
     * Agrega una nueva forma de pago a la interfaz
     * @returns {void}
     */
    agregarFormaPago: function () {
        recaudoRapidoModelo.formasPago.push({});
        var indice = recaudoRapidoModelo.formasPago.length - 1;
        recaudoRapidoModelo.formasPago[indice].indice = indice;
        var template = null;
        $.get('/achagua/sistema/web/bundles/Llanogas/templates/formaspago.html', function (_template) {
            template = $(_template).filter('#tplFormaPago').html();
            var info = $(Mustache.to_html(template, recaudoRapidoModelo.formasPago[indice]));
            info.find('#cmbBanco' + indice).html(bancos.html());
            $('div#divFormasPago div#controlesFormasPago').append(info);
            self.configurarForma(info, indice);
        });
    },
    /**
     * Configura la nueva forma de pago agregada a la interfaz gráfica
     * @param  {object} formas - Elemento HTML que contiene la información de las formas de pago
     * @param  {int} indice - Posición de la forma de pago, iniciando desde 0
     * @returns {void}
     */
    configurarForma: function (formas, indice) {
        var divFormas = $(formas);
        configurarNuevaFormaPago(divFormas, indice);
        divFormas.find('#txtValor' + indice).focusout(self.actualizarSumatoria);
        divFormas.find('button#btnRemoverForma' + indice).on('click', function () {
            self.eliminarForma(indice);
            $('div#divFormaPago' + indice).remove();
            self.actualizarSumatoria();
        });
    },
    /**
     * Elimina una forma de pago según el índice
     * @returns {void}
     */
    eliminarForma: function (indice) {
        for (var i = indice; i < recaudoRapidoModelo.formasPago.length; i++) {
            var forma = recaudoRapidoModelo.formasPago[i];
            if (forma.indice == indice) {
                recaudoRapidoModelo.formasPago.splice(i, 1);
            }
        }
    },
    /**
     * Actualiza la sumatoria en pesos de las formas de pago seleccionadas por el usuario
     * @returns {void}
     */
    actualizarSumatoria: function () {
        var nuevoValor = 0;
        $('div#divFormasPago').find('input[id^="txtValor"]').each(function (i, textbox) {
            var val = parseInt(textbox.value);
            nuevoValor += (!isNaN(val)) ? val : 0;
        });
        $('#txtFormaPago, #txtSumatoria').val(nuevoValor);
    },
    /** Muestra un dialogo con las empresas con las que se tiene convenio para el recaudo
     * @returns {void}
     */
    mostrarEmpresa: function () {
        recaudoRapidoModelo.check = $('div#divEmpresas input[type="checkbox"]:checked');
        self.dialogoActual = $('#divEmpresaConvenio').dialogo({
            modal: true,
            width: 450,
            title: 'Empresas',
            buttons: {
                Aceptar: function () {
                    self.seleccionarEmpresaFactura();
                    self.dialogoActual.dialog('close');
                },
                Cancelar: function () {
                    $('#divEmpresas input:checkbox').not('input[selecciona="0"]').prop('checked', false);
                    recaudoRapidoModelo.check.prop('checked', true);
                    self.dialogoActual.dialog('close');
                }
            }
        });
    },
    /**
     * Muestra las facturas de las empresas seleccionadas esto es para mostrar las facturas sólo de alguna empresa
     * esto solo es cuando son recaudador externo
     * @returns {void}
     */
    seleccionarEmpresaFactura: function () {
        var check = $('div#divEmpresas input[type="checkbox"]').not('div#divEmpresas input:checked');
        self.cargarTablasFacturas();
        var tds = $('#tblFacturas tbody tr td[header="thIdFactura"]');
        if (tds.length > 0) {
            var tds = $('#tblFacturas tbody tr td[header="thIdFactura"]');
            $.each(check, function (i, item) {
                for (var indice = 0; indice < tds.length; indice++) {
                    var td = tds[indice];
                    if (item.value == $(td).attr('data-value')) {
                        $(td).parent().remove();
                    }
                }
            });
        }
        if ($('#tblFacturas tbody tr').length === 0) {
            $('#tblFacturas').empty();

            recaudoRapidoModelo.accion = 'anticipo';
            self.configurarRecaudoAnticipo();
            if (!!recaudoRapidoModelo.suscripciones) {
                __dom.lanzarAlerta(__app.mensajes.facturasSinSaldo, __app.mensajes.atencion);
            }
        }
        self.actualizarValorTotal();
        if (recaudoRapidoModelo.facturaspagar) {
            for (var indexfac = 0; indexfac < recaudoRapidoModelo.facturaspagar.length; indexfac++) {
                var info = recaudoRapidoModelo.facturaspagar[indexfac];
                $.each(check, function (i, item) {
                    if (parseInt(item.value) === parseInt(info.idempresa)) {
                        recaudoRapidoModelo.facturaspagar.splice(indexfac, 1);
                    }
                });
            }
        }

        var seleccionados = "";
        $('div#divEmpresas input:checked').each(function (i, item) {
            seleccionados += $(item.parentElement).find('label').text().substring(0, 3) + " - ";
        });
        seleccionados = seleccionados.substring(0, seleccionados.length - 2);
        $('#txtEmpresa').val(seleccionados);

    },
    /**
     * Muestra diálogo de error cuando el recaudo no coincide en valores y no es recaudador externo
     * @deprecated
     */
    abrirModalPagoError: function () {
        self.dialogoActual = $('#divPagoError').dialogo({
            width: 450,
            title: 'Problemas al pagar',
            buttons: {
                Aceptar: function () {
                    self.dialogoActual.dialog('close');
                }
            }
        });
    },
    /**
     * Valida que el recaudo tenga toda la información necesaria para guardar el recaudo
     * @returns {boolean}
     */
    validadRecaudo: function () {
        var iddocumento = $('#cmbDocumentos').val();
        var pagar = parseInt($('#txtValorPagado').val());
        var pagado = parseInt($('#txtSaldoActual').val());
        var idtipodocumento = $('#cmbTiposDocumento').val();
        var diferencia = pagar - pagado;

        if (recaudoRapidoModelo.accion !== 'anticipo' && !recaudoRapidoModelo.facturas) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarFacturas, __app.mensajes.atencion);
            return false;
        }
        if (recaudoRapidoModelo.grabar === 'N' && recaudoRapidoModelo.recaudoExterno === 'N') {
            vista.abrirModalPagoError();
            return false;
        }
        if (!recaudoRapidoModelo.formasPago || recaudoRapidoModelo.formasPago.length === 0) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarOpcionPago, __app.mensajes.atencion);
            return false;
        }
        if (pagar <= 0 || isNaN(pagar)) {
            __dom.lanzarAlerta('No hay saldos y/o valores por pagar', __app.mensajes.atencion);
            return false;
        }
        if (diferencia > 0 || recaudoRapidoModelo.accion === 'anticipo') {
            if (iddocumento === '-1' || !iddocumento || idtipodocumento === '-1' || !idtipodocumento) {
                __dom.lanzarAlerta("Debe seleccionar un tipo de documento y documento.", __app.mensajes.atencion);
                return false;
            }
        }
        return true;
    },
    /**
     * Guardar información de las respectivas formas de pago que tienen sobrantes para generar anticipo
     * @param {Array} formas - Formas de pago que tiene el recaudo
     * @param {Object} recaudo - Información general del recaudo
     * @returns {Array}
     */
    grabarFormasPagoConAnticipo: function (formas, recaudo) {
        //Se contruye JSON de anticipo
        var pago = 0;
        var total = 0;
        var anticipo = 0;
        var ArrayFormasPago = [];
        var ArrayFormasAnticipo = [];
        var pagar = parseInt($('#txtValorPagado').val());
        var pagado = parseInt($('#txtSaldoActual').val());

        var restTotal = pagado;
        for (var x = 0; x < formas.length; x++) {
            if (total >= pagar) {
                //Cuando ya se haya pagado las facturas el sobrante es un anticipo
                anticipo += parseInt(formas[x].valor);
                ArrayFormasAnticipo.push(formas[x]);
                continue;
            }

            var deuda = pagado - total;
            total += parseInt(formas[x].valor);
            restTotal = pagado - total;

            if (restTotal <= 0) {
                var formaAnticipo = JSON.parse(JSON.stringify(formas[x]));
                formaAnticipo.valor = formas[x].valor - deuda;
                anticipo += formaAnticipo.valor;
                ArrayFormasAnticipo.push(formaAnticipo);
                pago += deuda;
                formas[x].valor = deuda;
            }
            ArrayFormasPago.push(formas[x]);
        }

        recaudo.pagado = pagado;
        recaudo.recaudoreal = pagado;
        recaudo.formasPagos = ArrayFormasPago;
        var recaudoAnticipo = self.armarObjetoAnticipo(ArrayFormasAnticipo, anticipo);


        var infoEnviar = {pago: recaudo, impresion: 1};
        recaudoRapidoControl.guardarRecaudo(infoEnviar, function (data) {
            var idrecaudopago = data.recaudo.idrecaudo;
            recaudoRapidoControl.guardarRecaudoAnticipo({anticipo: recaudoAnticipo, impresion: 1}, function (info) {
                __dom.lanzarAlerta(info.mensajeRespuesta + ' y ' + idrecaudopago, 'Información', function () {
                    self.limpiarFormulario();
                });
            });
        });
        return ArrayFormasPago;
    },
    /**
     * Envía la información al servidor para guardar el anticipo
     * @param {Array} formas - Formas de pago que generaran el anticipo
     */
    grabarAnticipo: function (formas) {
        var anticipo = 0;
        for (var f = 0; f < formas.length; f++) {
            anticipo += parseInt(formas[f].valor);
        }
        var recaudoAnticipo = self.armarObjetoAnticipo(formas, anticipo);
        recaudoRapidoControl.guardarRecaudoAnticipo({anticipo: recaudoAnticipo}, self.onGuardarCompleto);
    },
    /**
     * Construye objeto del anticipo con formas de pago, distribución e información del recaudo que se enviará al servidor para guardar
     * @param {Array} formas Formas de pago que generan el anticipo
     * @param {number} anticipo Valor del anticipo que se está guardando
     * @returns {Object}
     */
    armarObjetoAnticipo: function (formas, anticipo) {
        var idtipodocumento = $('#cmbTiposDocumento').val();
        var recaudoanticipo = self.armarObjetoRecaudo(anticipo, true);
        recaudoanticipo.idSuscripcion = $('#txtSuscripcion').val();
        var distribucion = [{
                idConcepto: 0,
                idDocumento: 0,
                valor: anticipo,
                idTipoDoc: idtipodocumento
            }];
        var recaudoAnticipo = {
            formasPagos: formas,
            recaudo: recaudoanticipo,
            distribucion: distribucion
        };
        return recaudoAnticipo;
    },
    /**
     * Construye objeto del recaudo para ser que se envíe al servidor y se guarde
     * @param {number} valor - Valor del recaudo realizado
     * @param {boolean} anticipo - Define si es un anticipo en ese caso se enviará la clase de pago en vez de documento
     * @returns {Object}
     */
    armarObjetoRecaudo: function (valor, anticipo) {
        var tercero = recaudoRapidoModelo.suscripciones[0].idtercero;
        var convenio = recaudoRapidoModelo.suscripciones[0].idconvenio;
        var suscriptor = recaudoRapidoModelo.suscripciones[0].idsuscriptor;
        var recaudo = {
            cambio: 0,
            ajuste: 0,
            pagado: valor,
            tercero: tercero,
            idTercero: tercero,
            convenio: convenio,
            idConvenio: convenio,
            suscriptor: suscriptor,
            idSuscriptor: suscriptor,
            sucursal: $('#cmbSucursal').val(),
            mediopago: $('#cmbMedioPago').val(),
            clasepago: anticipo ? $('#cmbDocumentos').val() : $('#cmbClasePago').val(),
            fecha: (recaudoRapidoModelo.recaudoExterno === 'S') ? $('#txtFechaPago').val() : null
        };
        return recaudo;
    },
    /**
     * Genera la distribución del recaudo a partir de las suscripciones que tiene el suscriptor  en las respectivas empresas
     * @returns {Array}
     */
    distribuirRecaudo: function () {
        var distribucion = [];
        for (var i = 0; i < recaudoRapidoModelo.suscripciones.length; i++) {
            var suscripcion = recaudoRapidoModelo.suscripciones[i];
            var objetoDistribucion = self.sumatoriaFacturasSuscripcion(suscripcion.idsuscripcion);

            objetoDistribucion.empresa = suscripcion.idempresa;
            objetoDistribucion.suscripcion = suscripcion.idsuscripcion;
            if (objetoDistribucion.facturas.length > 0) {
                distribucion.push(objetoDistribucion);
            }
        }
        return distribucion;
    },
    /**
     * Genera objeto de las facturas de una suscripción que se alcanzarón a pagar según el valor del recaudo realizado
     * @param {number} idsuscripcion - Suscripción de la que se está revisando las facturas
     * @returns {Array}
     */
    sumatoriaFacturasSuscripcion: function (idsuscripcion) {
        var valorSuscripcion = 0;
        var facturasRecaudo = [];
        for (var j = 0; j < recaudoRapidoModelo.facturaspagar.length; j++) {
            var factura = recaudoRapidoModelo.facturaspagar[j];
            if ((parseInt(factura.idsuscripcion) === parseInt(idsuscripcion)) && !!factura.abono && factura.abono > 0) {
                valorSuscripcion += factura.abono;
                facturasRecaudo.push({
                    version: factura.version,
                    factura: factura.idfactura,
                    suscripcion: factura.idsuscripcion,
                    conceptos: self.sumatoriaConceptosFacturas(factura.idfactura)
                });
            }
        }
        var objeto = {
            facturas: facturasRecaudo,
            valorSuscripcion: valorSuscripcion
        };
        return objeto;
    },
    /**
     * Genera arreglo de los conceptos de una factura según lo que se alcanzó a pagar con el valor del recaudo
     * @param {number} idfactura - Id de la factura de la que se observan los conceptos
     * @returns {Array}
     */
    sumatoriaConceptosFacturas: function (idfactura) {
        var arrConceptos = [];
        for (var k = 0; k < recaudoRapidoModelo.conceptos.length; k++) {
            var concepto = recaudoRapidoModelo.conceptos[k];
            if (concepto.idfactura === idfactura && !!concepto.abono && concepto.abono > 0) {
                arrConceptos.push({
                    idConcepto: concepto.iddetallefactura,
                    idFactura: concepto.idfactura,
                    valorPagado: concepto.abono
                });
            }
        }
        return arrConceptos;
    },
    /**
     * Valida el formulario nuevamente y si todo está correcto almacena la información del recaudo en un objeto JSON que será enviado a la capa del backend para que se efectue la transacción de guardar recaudo.
     * @returns {void}
     */
    guardarRecaudo: function () {
        if (!self.validadRecaudo()) {
            return;
        }
        $('#btnGrabar, #btnGrabarFinal').attr('disabled', 'disabled');
        var formas = almacenarFormasPago(recaudoRapidoModelo.formasPago);
        if (recaudoRapidoModelo.accion === 'anticipo') {
            self.grabarAnticipo(formas, true);
            return;
        }


        var pagar = parseInt($('#txtValorPagado').val());
        var pagado = parseInt($('#txtSaldoActual').val());

        var diferencia = pagar - pagado;
        var recaudo = self.armarObjetoRecaudo(pagar);
        recaudo.formasPagos = formas;
        recaudo.distribucion = self.distribuirRecaudo();
        var boolImprimir = $('#divRadioTimbre input:radio[name="radioTimbre"]:checked');
        var impresion = boolImprimir[0].id !== 'rbtnS' && recaudoRapidoModelo.recaudoExterno === 'S';
        if (recaudoRapidoModelo.recaudoExterno !== 'S' || diferencia === 0) {
            var infoEnviar = {pago: recaudo};
            impresion ? infoEnviar.impresion = 1 : 0;
            recaudoRapidoControl.guardarRecaudo(infoEnviar, self.onGuardarCompleto);
            return;
        }
        if (diferencia < 0) {
            var infoEnviar = {abono: recaudo};
            impresion ? infoEnviar.impresion = 1 : 0;
            recaudoRapidoControl.guardarRecaudoAbono(infoEnviar, self.onGuardarCompleto);
        } else if (diferencia > 0) {
            self.grabarFormasPagoConAnticipo(formas, recaudo);
        }
    },
    /**
     * Función de callback que se invoca cuando se termina de guardar el recaudo en el servidor
     * @param  {Object} data Objeto que retorna la información del servidor cuando se ha guardado un recaudo
     * @returns {void}
     */
    onGuardarCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 1:
                __dom.lanzarAlerta(data.mensajeRespuesta, 'Información', function () {
                    self.validarImpresionAlGrabar(data);
                });
                break;
            case -1:
                __dom.lanzarAlerta(__app.mensajes.errorGuardarRecaudo, __app.mensajes.atencion);
                break;
        }
    },
    /**
     * Valida si el usuario y el recaudo tiene permisos de impresiones del mismo  en caso de tener permisos ejecuta la primera impresión
     * @param {Object} data - Información que envía el servidor al momento de guardar el recaudo
     */
    validarImpresionAlGrabar: function (data) {
        var impresion = data.impresionrecaudo;
        var permitidas = (parseInt(impresion.impresionesauth) === parseInt(impresion.impresionesreal));
        permitidas = permitidas && parseInt(impresion.impresionesauth) > 0;
        if (impresion.estadoimpresion !== 'A' && !permitidas) {
            self.limpiarFormulario();
            return;
        }

        $('#btnImprimir').show();
        $('#btnGrabar, #btnGrabarFinal').hide();
        $('#btnFormaPago').attr('disabled', true);
        recaudoRapidoModelo.resumenRecaudo = data.recaudo;
        recaudoRapidoModelo.autorizacion = data.impresionrecaudo;
        var boolImprimir = $('#divRadioTimbre input:radio[name="radioTimbre"]:checked');
        if ((boolImprimir[0].id === 'rbtnS' || recaudoRapidoModelo.recaudoExterno !== 'S')) {
            imprimirTimbre('iFrameTimbre', recaudoRapidoModelo.resumenRecaudo);
            permitidas ? self.limpiarFormulario() : $('#btnImprimir').removeAttr('disabled');
        } else {
            self.limpiarFormulario();
            $('#txtFactura').val('');
            $('#txtSuscripcion').val('').focus();
        }
    },
    /** Confirma si el usuario desea cancelar la operación actual
     * @returns {void}
     */
    confirmarCancelar: function () {
        var btnImprimir = $('#btnImprimir').is(':visible');
        if (!!recaudoRapidoModelo.suscripciones) {
            if (btnImprimir) {
                self.limpiarFormulario();
                $('#txtFactura').val('');
                $('#txtSuscripcion').val('').focus();
                return;
            }
            __dom.lanzarAlerta(
                    __app.mensajes.confirmacionCancelacion,
                    __app.mensajes.atencion,
                    function () {
                        self.limpiarFormulario();
                        $('#txtSuscripcion, #txtFactura').val('');
                    },
                    true
                    );
        }
    },
    /**
     * Limpia los campos del formulario y borra formas de pago
     * @returns {void}
     */
    limpiarFormulario: function () {
        $('#btnImprimir').hide();
        $('#btnGrabar, #btnGrabarFinal').show().removeAttr('disabled');
        $('#btnFormaPago').attr('disabled', false);
        $('#divCabecera .divIzquierda input[type="text"]').not('#txtSuscripcion, #txtFactura').val('');
        $('#controlesFormasPago, #tblFacturas').html('');
        self.cancelarFormasPago();
        ext = recaudoRapidoModelo.recaudoExterno;
        recaudoRapidoModelo = {
            valorFactura: null,
            formasPago: [],
            recaudoExterno: ext,
            grabar: 'S'
        };
    }
};

recaudoRapidoVista.init();
