/**
 * @fileOverview Archivo de vista y control de abonos
 * @author svanegas
 * @requires recaudos.js
 * @requires abonos.control.js
 * @requires abonos.modelo.js
 * @version 1.0.0
 */

/**
 * Objeto que hace referencia al namespace abonosVista
 * @type {Object}
 */
var that = null;

/** @namespace */
var abonosVista = {
    /**
     * hace referencia al último dialogo abierto en la aplicación
     * @type {object}
     */
    dialogoActual: null,
    /**
     * Constante para almacenar los estilos de las filas de las facturas que NO están vencidas
     * @type {String}
     */
    ESTILO_FILA_SELECCIONABLE: 'background-color:rgba(134, 199, 100, 0.6) !important',
    /**
     * Constante para los estilos de los conceptos a los que no se puede hacer abono
     * @type {String}
     */
    ESTILO_CONCEPTO_BLOQUEADO: 'background-color: #9b9b9b;color: #dbd4d4;',
    /**
     * inicializa el programa de abonos
     * @returns {void}
     */
    init: function () {
        that = this;
        __app.vistaActual = abonosVista;
        __app.controlActual = abonosControl;
        var comandos = $('div#divComandos');
        comandos.find('#btnNuevo').on('click', that.onNuevoClic);
        comandos.find('#btnGrabar').on('click', that.guardarRecaudo);
        comandos.find('#btnCancelar').on('click', that.cancelarAbono);
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
        if (abonosModel.resumenRecaudo && abonosModel.autorizacion.estadoimpresion === 'A') {
            var auth = abonosModel.autorizacion.idimpresion;
            abonosControl.actualizarAutorizacion({idimpresion: auth}, function (data) {
                if (data.codigoRespuesta === 1) {
                    abonosModel.autorizacion = data.datos.impresionrecaudo;
                    data.datos.impresionrecaudo.estadoimpresion !== 'A' ? $('#btnImprimir').attr('disabled', 'disabled') : null;
                }
            });
            imprimirTimbre('iFrameTimbre', abonosModel.resumenRecaudo);
        }
    },
    /**
     * Se ejecuta en el evento clic del botón Nuevo, y valida si ya existen suscripciones para limpiar los datos del formulario.
     * @returns {void}
     */
    onNuevoClic: function () {
        if (abonosModel.suscripcion && abonosModel.resumenRecaudo === null) {
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
     * valida la información del recaudo, si todo está bien, envía la petición al servidor
     * para guardar los detalles del recaudo
     * @returns {void}
     */
    guardarRecaudo: function () {
        if (!abonosModel.suscripcion) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarSuscripcion, __app.mensajes.atencion);
            return;
        }
        if (!abonosModel.facturas || $('#tblFacturas tbody tr td[header="thCheckFactura"] input:checked').length === 0) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarFacturas, __app.mensajes.atencion);
            return;
        }
        if (!abonosModel.formasPago || abonosModel.formasPago.length === 0) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarOpcionPago, __app.mensajes.atencion);
            return;
        }
        var recaudo = {};
        $('#btnGrabar').attr('disabled', 'disabled');
        recaudo.pagado = parseFloat($('#txtFormaPago').val());
        recaudo.cambio = parseFloat($('#txtCambio').val());
        recaudo.mediopago = $('#cmbMedioPago').val();
        recaudo.clasepago = $('#cmbClasePago').val();
        recaudo.sucursal = $('#cmbSucursal').val();
        recaudo.recaudoreal = parseFloat($('#txtSaldoActual').val());
        recaudo.ajuste = parseFloat($('#txtAjuste').val());
        recaudo.convenio = parseInt($('#txtConvenio').attr('data-id'));
        recaudo.suscriptor = abonosModel.suscripcion.idsuscriptor;
        recaudo.tercero = abonosModel.suscripcion.idtercero;
        recaudo.formasPagos = almacenarFormasPago(abonosModel.formasPago);
        recaudo.distribucion = [];

        var facturasRecaudo = [];
        for (var i = 0; i < abonosModel.facturas.length; i++) {
            var factura = abonosModel.facturas[i];
            //si la factura tiene abonos agrega la informaciòn a facturasConRecaudo
            if (!!abonosModel.facturas[i].abono && abonosModel.facturas[i].abono > 0) {
                var pos = facturasRecaudo.push({
                    factura: factura.idfactura,
                    suscripcion: factura.idsuscripcion,
                    version: factura.version,
                    conceptos: []
                }) - 1;
                for (var j = 0; j < abonosModel.conceptos.length; j++) {
                    var concepto = abonosModel.conceptos[j];
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

        recaudo.distribucion.push({
            empresa: abonosModel.suscripcion.idempresa,
            suscripcion: abonosModel.suscripcion.idsuscripcion,
            valorSuscripcion: parseFloat($('#txtFormaPago').val()),
            facturas: facturasRecaudo
        });

        abonosControl.guardarRecaudo({abono: recaudo}, that.onGuardarCompleto);
    },
    /**
     * Captura la respuesta enviada por el servidor, cuando se guarda la información del recaudo
     * @param  {object} data - El resultado de la petición ajax para guardar la información del abono
     * @returns {void}
     */
    onGuardarCompleto: function (data) {
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
                    abonosModel.autorizacion = impresion;
                    abonosModel.resumenRecaudo = data.recaudo;
                    $('#btnFormaPago').attr('disabled', true);
                    imprimirTimbre('iFrameTimbre', abonosModel.resumenRecaudo);
                    permitidas ? $('#btnImprimir').attr('disabled', 'disabled') : $('#btnImprimir').removeAttr('disabled');

                });
                break;
                break;
            case -1:
            case 0:
                __dom.lanzarAlerta(__app.mensajes.errorGuardarRecaudo, __app.mensaje.atencion);
                break;
        }
    },
    /**
     * Valida la información del filtro de suscripciones y envía la solicitud al servidor
     * @returns {void}
     */
    filtrarSuscriptor: function () {
        var filtro = $('div#camposBuscarSuscripcion');
        var suscripcion = filtro.find('#txtFiltroSus').val().trim();
        var doc = filtro.find('#txtFiltroDoc').val().trim();
        var codAnt = filtro.find('#txtFiltroCodAnt').val().trim();
        if (suscripcion == '' && doc == '' && codAnt == '') {
            filtro.find('#spanMensaje').text(__app.mensajes.camposInvalidosFiltro).show();
            return;
        }
        var data = {idsuscripcion: suscripcion, documento: doc, codanterior: codAnt};
        abonosControl.consultarSuscriptor(data, that.consultaSuscripcionCompleto);

    },
    /** Captura la respuesta enviada por el servidor tras la solicitud del suscriptor
     * si hay más de un suscriptor en la respuesta se muestra la lista de suscriptores para que el usuario
     * seleccione uno, de lo contrario, se toma el únique que llega en la respuesta
     * @param {Object} data - Información enviada por el servidor de las suscripciones que coinciden con los filtros
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
                    mostrarListaSuscripciones(data.suscripciones, that.dialogoActual, abonosModel, that.cargarCabecera);
                } else {
                    sus = abonosModel.suscripcion = data.suscripciones[0];
                    that.dialogoActual.find('#spanMensaje').hide();
                    that.dialogoActual.dialog('close');
                    that.cargarCabecera(sus);
                }
                break;
        }
    },
    /**
     * Carga la cabecera con la información del suscriotor seleccionado del filtro
     * @param  {object} sus - Es un objeto JSON con la información de la suscripción seleccionada para hacer el abono
     * @returns {void}
     */
    cargarCabecera: function (sus) {
        var cabecera = $('div#divCabecera');
        cabecera.find('#txtIdSuscriptor').val(sus.idsuscriptor);
        cabecera.find('#txtNombre').val(sus.nombretercero);
        cabecera.find('#txtDocumento').val(sus.cedula);
        cabecera.find('#txtConvenio').val(sus.nombreconvenio).attr('data-id', sus.idconvenio);
        abonosModel.suscripciones = [sus];
        $('div#divFacturas').hide();
        var tbl = fillTable("tblSuscripciones", "formatoSuscripciones", "abonosModel.suscripciones", "Suscripciones");
        tbl.find('td[header="thSeleccion"] input[type="checkbox"]').on('change', that.onSuscripcionSeleccionada);
        $('div#divDetalles').show('fast');
    },
    /**
     * Carga las facturas con saldo de la suscripción seleccionada
     * @returns {void}
     */
    cargarFacturas: function () {
        //si existe la suscripción dentro del modelo se consultan las facturas
        if (!!abonosModel.suscripcion) {
            abonosControl.consultarFacturas({suscripcion: abonosModel.suscripcion.idsuscripcion}, that.cargarFacturasCompleto);
        } else {
            __dom.lanzarAlerta(__app.mensajes.seleccionarSuscripcion, __app.mensajes.alerta);
        }
    },
    /**
     * Valida la respuesta del servidor a consultar las facturas de la suscripción y carga la tabla de facturas
     * @param  {object} respuesta  El objeto con la respuesta del servidor, que tiene la lista de facturas con saldo de la suscripción consultada
     * @returns {void}
     */
    cargarFacturasCompleto: function (respuesta) {
        switch (parseInt(respuesta.codigoRespuesta)) {
            case 1:
                abonosModel.facturas = respuesta.facturas;
                abonosModel.conceptos = respuesta.conceptos;
                for (var j = 0; j < respuesta.conceptos.length; j++) {
                    var concepto = respuesta.conceptos[j];
                    var factura = abonosControl.consultarFacturaPorId(concepto.idfactura);
                    if (factura) {
                        concepto.numero = factura.numero;
                    }
                }
                that.cargarTablasFacturas();
                $('#btnFormaPago').attr('disabled', false);
                break;
            case 0:
                abonosModel.facturas = [];
                $('div#divFacturas')
                        .hide()
                        .find('#txtSaldoActual')
                        .val('');
                __dom.lanzarAlerta(__app.mensajes.suscripcionSinFacturas, __app.mensajes.atencion);
                break;
        }
    },
    /**
     * Pregunta al usuario si desea cancelar la operación actual
     * si el usuario desea cancelar, se limpia el formulario y se actualiza el modelo
     * @returns {void}
     */
    cancelarAbono: function () {
        if (!!abonosModel.suscripcion) {
            $('div#divConfirmCancelar').dialogo({
                resizable: false,
                heigth: 140,
                modal: true,
                title: 'Cancelar la Operación',
                buttons: {
                    "Aceptar": function () {
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
     * Limpia el formulario y elimina la información actual del recaudo y el suscriptor de la interfaz
     * @returns {void}
     */
    limpiarFormulario: function () {
        $('#btnGrabar').show().removeAttr('disabled');
        $('#btnImprimir').removeAttr('disabled').hide();
        $('#btnFormaPago').attr('disabled', false);
        var cabecera = $('div#divCabecera');
        cabecera.find('input[type="text"]').val('');
        var detalles = $('#divDetalles');
        detalles.hide();
        detalles.find('table')
                .removeAttr('data')
                .removeAttr('format')
                .html('');
        abonosModel = {
            suscriptor: null,
            suscripciones: null,
            informacionPago: null,
            facturas: null,
            formasPago: [],
            resumenRecaudo: null
        };
        $('#controlesFormasPago').html('');
        $('#txtSumatoriaAnticipos').val('');

        if (!!formatoFacturas.thead[9]) {
            formatoFacturas.thead.pop();
        }

        if (!!formatoConceptos.thead[7]) {
            formatoConceptos.thead.pop();
            //formatoConceptos.thead.pop();
        }
    },
    /**
     * Muestra cuadro de dialogo las formas de pago que se pueden aplicar al recaudo
     * @returns {void}
     */
    mostrarFormasPago: function () {
        if (!abonosModel.facturas) {
            __dom.lanzarAlerta(__app.mensajes.facturasSinSaldo, __app.mensajes.atencion);
            return;
        }
        var dialogo = $('#divFormasPago');
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
                    if (sumatoriaPago > sumatoriaDeuda) {
                        __dom.lanzarAlerta(__app.mensajes.valorPagarMenorDeuda, __app.mensajes.atencion);
                        return;
                    } else {
                        if (guardarFormasDePago(abonosModel)) {
                            that.funcionCerrarDialogo(null, true);
                            that.calcularAbono();
                        }
                    }
                    
                },
                Cancelar: that.funcionCerrarDialogo,
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
                    that.calcularAbono();
                },
                function () {  return; }
        );
    },
    /**
     * Cancela las formas de pago y limpia la colección de formas de pago seleccionadas por el usuario
     * @returns {void}
     */
    cancelarFormasPago: function () {
        abonosModel.formasPago = [];
        $('#txtFormaPago, #txtSumatoria, #txtNuevoSaldo').val('');
        $('div#divFormasPago div#controlesFormasPago').html('');
    },
    /**
     * Agrega una nueva forma de pago a la interfaz
     * @returns {void}
     */
    agregarFormaPago: function () {
        abonosModel.formasPago.push({});
        var indice = abonosModel.formasPago.length - 1;
        abonosModel.formasPago[indice].indice = indice;
        var template = null;
        $.get('/achagua/sistema/web/bundles/Llanogas/templates/formaspago.html', function (_template) {
            template = $(_template).filter('#tplFormaPago').html();
            var info = $(Mustache.to_html(template, abonosModel.formasPago[indice]));
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
    configurarForma: function (formas, indice) {
        var divFormas = $(formas);
        configurarNuevaFormaPago(divFormas, indice);
        divFormas.find('#txtValor' + indice).focusout(that.actualizarSumatoria);
        divFormas.find('button#btnRemoverForma' + indice).on('click', function () {
            that.eliminarForma(indice);
            $('div#divFormaPago' + indice).remove();
            that.actualizarSumatoria();
        });
    },
    /**
     * Elimina una forma de pago según el índice
     * @returns {void}
     */
    eliminarForma: function (indice) {
        for (var i = indice; i < abonosModel.formasPago.length; i++) {
            var forma = abonosModel.formasPago[i];
            if (forma.indice == indice) {
                abonosModel.formasPago.splice(i, 1);
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
     * Calcula la deuda del usuario por las facturas seleccionadas y las compara con el valor
     * seleccionado en las formas de pago. Luego intenta aplicar el recaudo.
     * @returns {void}
     */
    calcularAbono: function () {
        if (!abonosModel.suscripciones && !abonosModel.facturas) {
            __dom.lanzarAlerta("Antes de calcular un pago debe cargar facturas o conceptos con saldo", "Información insuficiente");
            return;
        }

        var txtValorPago = $('#txtFormaPago');
        if (txtValorPago.val().trim() === "" && abonosModel.formasPago.length === 0 && txtValorPago.val() <= 0) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarOpcionPago, __app.mensajes.atencion);
            formatoFacturas.thead.splice(9, 1);
            formatoConceptos.thead.splice(7, 2);
            that.cargarTablasFacturas();
            return;
        }


        abonosControl.calcularDistribucionAbono(parseFloat(txtValorPago.val()));
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
                'id': 'thAbono',
                'text': 'Abono',
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
            }
            );
        }

        var nuevoSaldo = parseFloat($('#txtSaldoActual').val() - parseFloat($('#txtFormaPago').val()));
        $('#txtNuevoSaldo').val(nuevoSaldo);// <= 0 ? '0' : Math.abs(nuevoSaldo));
        $('#txtCambio').val("0");
        $('#txtAjuste').val("0");
        that.cargarTablasFacturas();
    },
    /**
     * Carga la tabla de facturas de las suscripciones selecciondas
     * @returns {void}
     */
    cargarTablasFacturas: function () {
        var tblFacturas = fillTable("tblFacturas", "formatoFacturas", "abonosModel.facturas", "Facturas");
        that.configurarCheckTablaFacturas(tblFacturas);


        $('div#divFacturas').show().find('#txtSaldoActual').val(calcularSaldoActual(abonosModel));
        var tbl3 = fillTable("tblConceptos", "formatoConceptos", "abonosModel.conceptos", "Conceptos y Documentos");
        tbl3.show();
    },

    /**
     * Recorre las facturas de la suscripción, y deja un check habilitado, para las facturas
     * que no están vencidas. Las facturas que están vencidas, deben quedar checkeadas por defecto
     * 
     * @param  {object} tbl La tabla de jQuery, después de invocar el método filltable
     * @returns {void}
     */
    configurarCheckTablaFacturas:function(tbl){
        var fechaSistema = __app.obtenerFechaSistema();
        var filasFacturas = tbl.find('tbody tr');
        tbl.find('thead th#thCheckFactura input:checkbox').remove();
        for (var i = 0; i < filasFacturas.length; i++) {
            var fila = $(filasFacturas[i]);
            fila.addClass('selected');
            
            var indiceFactura = parseInt(fila.attr('data-fila'));
            var check = fila.find('td[header="thCheckFactura"] input:checkbox');

            //se actualizan los datos en el modelo
            var factura = abonosModel.facturas[indiceFactura];
            if (factura.seleccionada === undefined) {
                factura.seleccionada = true;
            }
            if(factura.facturaVencida === undefined){
                factura.facturaVencida = true;
            }

            check.attr({'disabled':'disabled'});
            check.on('click', that.validarFacturaSeleccionada);            
            check.attr('checked', factura.seleccionada);

            //Se valida la fecha de vencimiento de las facturas.
            //Si la factura está vencida, el checkbox debe quedar deshabilitado y es obligatorio abonar a esa factura.
            var fechaVencimientoFactura = new Date(fila.find('td[header="thVencimiento"]').text());
            fechaVencimientoFactura.setDate(fechaVencimientoFactura.getDate()+1); //Ajuste de la fecha para que coincida con el valor real del vencimiento
            if ( fechaVencimientoFactura > fechaSistema ) {
                check.removeAttr('disabled');
                fila.attr({'style':that.ESTILO_FILA_SELECCIONABLE});
                factura.facturaVencida = false;
            }
        }
        that.actualizarSaldoFacturasSeleccionadas();
    },

    /**
     * Valida si la factura está seleccionada o no, para volver a contabilizar los valores del abono de acuerdo a los conceptos de la factura.
     * @param  {Event} e El evento clic que se dispara sobre el checkbox de cada factura de la tabla de facturas.
     * @returns {void}
     */
    validarFacturaSeleccionada:function(e){
        
        var check = $(this);
        var fila = check.parent().parent();
        
        var indiceFactura = parseInt( fila.attr('data-fila') );
        var factura = abonosModel.facturas[indiceFactura];
        factura.seleccionada = check.is(':checked');
        that.activarDesactivarConceptos(factura);
        that.actualizarSaldoFacturasSeleccionadas();

        if ($('#txtFormaPago').val() !== '') {
            that.calcularAbono();
            return;
        }
    },

    /**
     * Actualiza el campo de texto que muestra la suma de las facturas seleccionadas
     * @returns {void}
     */
    actualizarSaldoFacturasSeleccionadas:function(){
        $('#txtTotalFacturasSeleccionadas').val(abonosControl.calcularTotalFacturasSeleccionadas());
    },


    /**
     * Desactiva los conceptos de la factura que se envía por parámetro si ésta, está no está seleccionada,
     * Activa los conceptos de la factura, si está seleccionada.
     *  
     * @param  {Object} factura La factura que se va a analizar para mostrar u ocultar sus conceptos
     * @returns {void}
     */
    activarDesactivarConceptos:function(factura){
        var tblConceptos = $('#tblConceptos tbody');
        var indicesConceptosFactura = abonosControl.obtenerIndicesConceptosFactura(factura);
        if (!__app.esArreglo(indicesConceptosFactura)) {
            return;
        }

        for (var i = 0; i < indicesConceptosFactura.length; i++) {
            var indiceConcepto = indicesConceptosFactura[i];
            var concepto = abonosModel.conceptos[indiceConcepto];
            var fila = tblConceptos.find('tr[data-fila="'+indiceConcepto+'"]');
            if (factura.seleccionada) {
                concepto.seleccionado = true;
                continue;
            }
            concepto.seleccionado = false;
        }
    }

};

abonosVista.init();
