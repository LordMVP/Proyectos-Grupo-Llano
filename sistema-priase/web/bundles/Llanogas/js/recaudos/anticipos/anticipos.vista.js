/**
 * @fileOverview Archivo de vista de anticipo (Funcionalidad del DOM)
 * @author svanegas
 * @requires recaudos.js
 * @requires anticipos.control.js
 * @requires anticipos.modelo.js
 * @version 1.1.0
 */
/**
 * El objeto that hace referencia a la vista actual del sistema.
 * @type {object}
 */
var that = null;

/** @namespace */
var anticiposVista = {
    /**
     * Hace referencia al último dialogo abierto por la aplicación
     * @type {object}
     */
    dialogoActual: null,
    /**
     * Incializa el programa de anticipos
     * @returns {void}
     */
    init: function () {
        that = this;
        cargarBancos();
        var comandos = $('div#divComandos');
        comandos.find('#btnNuevo').on('click', that.onNuevoClic);
        comandos.find('#btnGrabar').on('click', that.guardarRecaudo);
        comandos.find('#btnCancelar').on('click', that.cancelarAnticipo);
        comandos.find('#btnImprimir').on('click', that.validarImpresion);

        $('#cmbConvenio').on('change', that.onCambioConvenio);
        $('#btnFormaPago').on('click', that.mostrarFormasPago);
        $('#btnAgregarForma').on('click', that.agregarFormaPago);
        $('#btnAgregarAnticipo').on('click', that.mostrarNuevoAnticipo);
        $('#cmbTipoLiquidacion').on('change', that.validarTipoLiquidacion);
        $('#cmbTipoDocumento').on('change', that.consultarDocumentos);
        __dom.configurarTextoNumerico('txtFiltroSus, #txtFiltroDoc, #txtFiltroCodAnt');
        __dom.configurarTextoNumerico('txtValorAnticipo', false, true);
    },
    /**
     * Valida que el usuario tenga impresiones de timbre disponibles
     * @returns {void}
     */
    validarImpresion: function () {
//        if (anticiposModel.resumenRecaudo && anticiposModel.autorizacion.estadoimpresion === 'A') {
//            var auth = anticiposModel.autorizacion.idimpresion;
//            anticiposControl.actualizarAutorizacion({idimpresion: auth}, function (data) {
//                if (data.codigoRespuesta === 1) {
//                    anticiposModel.autorizacion = data.datos.impresionrecaudo;
//                    data.datos.impresionrecaudo.estadoimpresion !== 'A' ? $('#btnImprimir').attr('disabled', 'disabled'): null;
//                }
//            });
//            imprimirTimbre('iFrameTimbre', anticiposModel.resumenRecaudo);
//        }
        if (anticiposModel.cantidadImpresiones >= anticiposModel.documentomaximoImpresion) {
            $('#btnImprimir').attr('disabled', 'disabled');
            return;
        }
        if (anticiposModel.resumenRecaudo) {
            anticiposModel.cantidadImpresiones +=1;
            $('#btnImprimir').removeAttr('disabled');
            imprimirTimbre('iFrameTimbre', anticiposModel.resumenRecaudo);
        }

    },
    /**
     * Consulta los documentos y las liquidaciones según el tipo de documento seleccionado y son cargados en el combo
     * La función callback de la consulta está anidada
     */
    consultarDocumentos: function () {
        $('#cmbDocumentos,#cmbTipoLiquidacion,#cmbConcepto').empty();
        var idtipodocumento = $('#cmbTipoDocumento').val();
        var idsuscripcion = anticiposModel.suscripcion.idsuscripcion;
        var cmbDocumento = $('#cmbDocumentos');
        if (idtipodocumento !== '-1' && idtipodocumento) {
            anticiposControl.consultarDocumentos({idtipodocumento: idtipodocumento}, function (data) {
                var documentos = data.documentos;
                if (data.codigoRespuesta === 1) {
                    if (documentos.length === 0) {
                        __dom.lanzarAlerta('No se encontraron documentos.', __app.mensajes.atencion);
                    } else {
                        __dom.llenarCombo(cmbDocumento, data.documentos, 'iddocumento', 'documento');
                        if (anticiposModel.docSelected) {
                            cmbDocumento.val(anticiposModel.docSelected);
                            anticiposModel.docSelected = null;
                        }
                    }
                }
                anticiposControl.consultarTiposLiquidacion({'idtipodocumento': idtipodocumento, 'idsuscripcion': idsuscripcion}, that.onCompletoConsultarTiposLiquidacion);
            });
        }
    },
    /**
     * Obtiene la respuesta del servidor cuando se consultan las liquidaciones y son cargadas en un combo en caso de
     * que se esté modificando una línea se agrega valor por defecto y valida el mismo
     * @param data
     */
    onCompletoConsultarTiposLiquidacion: function (data) {
        switch (data.codigoRespuesta) {
            case 1:
                var tiposLiquidacion = data.tiposLiquidacion;
                if (tiposLiquidacion.length === 0) {
                    __dom.lanzarAlerta('No se encontraron tipos de liquidación.', __app.mensajes.atencion);
                    return;
                }
                var comboTiposLiquidacion = $('#cmbTipoLiquidacion').empty();
                __dom.llenarCombo(comboTiposLiquidacion, data.tiposLiquidacion, 'idliquidacion', 'liquidacion');
                if (anticiposModel.conceptoModificar) {
                    $('#divAnticipo').find('#cmbTipoLiquidacion').val(anticiposModel.conceptoModificar.idTipoLiquidacion);
                    that.validarTipoLiquidacion();
                }
                break;
        }
    },
    /**
     * Valida la información del anticipo, si todo está bien envía la solicitud de guardar el recaudo al servidor
     * @returns {void}
     */
    guardarRecaudo: function () {
        if (!anticiposModel.suscripcion) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarSuscripcion, __app.mensajes.atencion);
            return;
        }
        if (!anticiposModel.anticipo.anticipos || anticiposModel.anticipo.anticipos.length === 0) {
            __dom.lanzarAlerta(__app.mensajes.sinCambios, __app.mensajes.atencion);
            return;
        }
        if (!anticiposModel.formasPago || anticiposModel.formasPago.length === 0) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarOpcionPago, __app.mensajes.atencion);
            return;
        }

        if (parseFloat($('#txtFormaPago').val()) !== parseFloat($('#txtSumatoriaAnticipos').val())) {
            __dom.lanzarAlerta(__app.mensajes.valorPagadoDiferenteAnticipo, __app.mensajes.atencion);
            return;
        }

        var anticipo = {};
        /*configuracion del recaudo*/
        var recaudo = {};
        $('#btnGrabar').attr('disabled', 'disabled');
        recaudo.pagado = parseFloat($('#txtFormaPago').val());
        recaudo.cambio = parseFloat($('#txtCambio').val());
        recaudo.ajuste = parseFloat($('#txtAjuste').val());
        recaudo.mediopago = $('#cmbMedioPago').val();
        recaudo.clasepago = $('#cmbClasePago').val();
        recaudo.sucursal = $('#cmbSucursal').val();
        recaudo.idConvenio = anticiposModel.suscripcion.idconvenio;
        recaudo.idSuscriptor = anticiposModel.suscripcion.idsuscriptor;
        recaudo.idTercero = anticiposModel.suscripcion.idtercero;
        recaudo.idSuscripcion = anticiposModel.suscripcion.idsuscripcion;

        anticipo.recaudo = recaudo;

        /*configuracion de la distribucion*/
        var distribucion = [];
        $.each(anticiposModel.anticipo.anticipos, function (i, item) {
            var dist = {
                idPeriodo: parseInt(item.idPeriodo),
                idConcepto: parseInt(item.idConcepto),
                idDocumento: parseInt(item.idDocumento),
                idTipoDoc: parseInt(item.idTipoDoc),
                valor: item.valor
            };
            distribucion.push(dist);
        });
        anticipo.distribucion = distribucion;
        anticipo.formasPagos = almacenarFormasPago(anticiposModel.formasPago);
        anticiposControl.guardarRecaudo({anticipo: anticipo}, that.onGuardarCompleto);
    },
    /** Captura la respuesta del servidor cuando se guarda el anticipo
     * @param {object} data - Respuesta del servidor con información del recaudo generado
     * @returns {void}
     **/
    onGuardarCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 1:
                __dom.lanzarAlerta(data.mensajeRespuesta, __app.mensajes.atencion,
                        function () {
                            $('#btnGrabar').hide();
                            $('#btnImprimir').show();
                            $('#btnFormaPago').attr('disabled', true);
                            anticiposModel.resumenRecaudo = data.recaudo;
                            anticiposModel.autorizacion = data.impresionrecaudo;
                            anticiposModel.documentomaximoImpresion = data.documentomaximoImpresion;
                            if (anticiposModel.cantidadImpresiones >= anticiposModel.documentomaximoImpresion) {
                                $('#btnImprimir').attr('disabled', 'disabled');
                                return;
                            }
                            anticiposModel.cantidadImpresiones=1;
                            $('#btnImprimir').removeAttr('disabled');
                            imprimirTimbre('iFrameTimbre', anticiposModel.resumenRecaudo);
//                        if(data.impresionrecaudo.estadoimpresion !== 'A') {
//                            $('#btnImprimir').attr('disabled', 'disabled');
//                        }else{
//                            $('#btnImprimir').removeAttr('disabled');
//                            imprimirTimbre('iFrameTimbre', anticiposModel.resumenRecaudo);
//                        }
                        }
                );
                break;
            case -1:
                __dom.lanzarAlerta(__app.mensaje.errorGuardarRecaudo, __app.mensajes.atencion);
                break;
        }
    },
    /**
     * Envía la petición al servidor para buscar un suscriptor
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
            anticiposControl.consultarSuscriptor(data, that.consultaSuscripcionCompleto);
        }
    },
    /**
     * Captura la respuesta del servidor, en la consulta de suscriptores y muestra los resultados en una lista
     * si sólo existe una suscripción, la selecciona por defecto.
     * @param  {Object} data - Respuesta del servidor
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
                    mostrarListaSuscripciones(data.suscripciones, that.dialogoActual, anticiposModel, that.cargarCabecera);
                } else {
                    sus = anticiposModel.suscripcion = data.suscripciones[0];
                    that.dialogoActual.find('#spanMensaje').hide();
                    that.dialogoActual.dialog('close');
                    that.cargarCabecera(sus);
                }
                break;
        }
    },
    /** Carga la información del suscriptor seleccionado con las respectivas suscripciones
     * @param {object} sus - Información de la suscripción que se seleccionó
     * @returns {void}
     **/

    cargarCabecera: function (sus) {
        var cabecera = $('div#divCabecera');
        cabecera.find('#txtIdSuscriptor').val(sus.idsuscriptor);
        cabecera.find('#txtNombre').val(sus.nombretercero);
        cabecera.find('#txtDocumento').val(sus.cedula);

        anticiposModel.suscripciones = [];
        anticiposModel.suscripciones.push(sus);
        $('div#divDetalles').show('fast');
        var tbl = fillTable("tblSuscripciones", "formatoSuscripciones", "anticiposModel.suscripciones", "Suscripciones");
    },
    /**
     * Se ejecuta en el evento clic del botón Nuevo, y valida si ya existen suscripciones para limpiar los datos del formulario.
     * @returns {void}
     */
    onNuevoClic: function () {
        $('#camposBuscarSuscripcion').find('input[type="text"]').val('');
        if (anticiposModel.suscripciones && !anticiposModel.resumenRecaudo) {
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
     * Cancela la operación actual
     * @returns {void}
     */
    cancelarAnticipo: function () {
        if (anticiposModel.anticipo.anticipos.length > 0) {
            $('div#divConfirmCancelar').dialogo({
                resizable: false,
                heigth: 140,
                modal: true,
                title: __app.mensajes.tituloConfirmacion,
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
    /** Limpia el formulario de anticipos y anula el anticipo que se esté ejecutando
     * @returns {void}
     **/
    anularAnticipo: function () {
        anticiposModel.anticipo = {anticipos: []};
        anticiposModel.formasPago = [];
        $('#divConceptos').hide('fast');
        $('#tblAnticipo').html('');
        $('#txtSumatoriaAnticipos').val('');
        that.cancelarFormasPago();
    },
    /** Limpia toda la información que se esté visualizando en la interfaz
     * @returns {void}
     **/
    limpiarFormulario: function () {
        $('#btnGrabar').show();
        $('#btnImprimir').hide();
        var detalles = $('#divDetalles');
        var cabecera = $('div#divCabecera');
        $('#btnFormaPago').removeAttr('disabled');
        cabecera.find('input[type="text"]').val('');
        $('#btnGrabar').show().removeAttr('disabled');

        detalles.hide();
        $('#txtSumatoria').val('');
        detalles.find('table').empty();
        $('#controlesFormasPago').html('');
        anticiposModel = {
            anticipo: {
                anticipos: []
            },
            formasPago: []
        };
    },
    /**
     * Abre cuadro de diálogo para agregar las formas de pago del anticipo, antes ya debe estar grabada la información del anticipo
     */
    mostrarFormasPago: function () {
        if (anticiposModel.anticipo.anticipos.length === 0) {
            __dom.lanzarAlerta('Debe agregar o seleccionar anticipos', __app.mensajes.atencion);
            return;
        }
        var dialogo = that.dialogoActual = $('#divFormasPago');
        dialogo.dialogo({
            resizable: false,
            width: 800,
            position: {my: "center", at: "top+90", of: "body"},
            modal: true,
            title: 'Formas de Pago',
            beforeClose: that.funcionCerrarDialogo,
            buttons: {
                Aceptar: function () {
                    var sumatoriaPago = parseFloat($('#txtSumatoria').val());
                    var sumatoriaDeuda = parseFloat($('#txtSumatoriaAnticipos').val());
                    if (sumatoriaPago !== sumatoriaDeuda) {
                        __dom.lanzarAlerta(__app.mensajes.valorPagadoDiferenteAnticipo, __app.mensajes.atencion);
                        return;
                    }
                    if (guardarFormasDePago(anticiposModel)) {
                        that.funcionCerrarDialogo(null, true);
                        that.calcularAnticipo();
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
    /** Cancela las formas de pago que se hayan agregado
     * @returns {void}
     **/
    cancelarFormasPago: function () {
        anticiposModel.formasPago = [];
        $('#txtFormaPago, #txtSumatoria').val('');
        $('div#divFormasPago div#controlesFormasPago').html('');
    },
    /** Agrega nueva forma de pago en la interfaz para ser diligenciada 
     * @returns {void}
     **/
    agregarFormaPago: function () {
        anticiposModel.formasPago.push({});
        var indice = anticiposModel.formasPago.length - 1;
        anticiposModel.formasPago[indice].indice = indice;
        var template = null;
        $.get('/achagua/sistema/web/bundles/Llanogas/templates/formaspago.html', function (_template) {
            template = $(_template).filter('#tplFormaPago').html();
            var info = $(Mustache.to_html(template, anticiposModel.formasPago[indice]));
            info.find('#cmbBanco' + indice).html(bancos.html());
            $('div#divFormasPago div#controlesFormasPago').append(info);
            that.configurarForma(info, indice);
        });
    },
    /**Configura la nueva forma de pago y sus listeners.
     * @param {object} info - división de la forma de pago que se configura
     * @param {numbre} indice - Indice de la forma de pago
     **/
    configurarForma: function (info, indice) {
        var divFormas = $(info);
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
        for (var i = indice; i < anticiposModel.formasPago.length; i++) {
            var forma = anticiposModel.formasPago[i];
            if (forma.indice == indice) {
                anticiposModel.formasPago.splice(i, 1);
            }
        }
    },
    /** Actualiza la sumatoria en pesos que se han agregado con las formas de pago seleccionadas
     * @returns {void}
     **/
    actualizarSumatoria: function () {
        var nuevoValor = 0;
        $('div#divFormasPago').find('input[id^="txtValor"]').each(function (i, textbox) {
            var val = parseFloat(textbox.value);
            nuevoValor += (!isNaN(val)) ? val : 0;
        });
        $('#txtFormaPago, #txtSumatoria').val(nuevoValor);
    },
    /** Calcula y valida el valor del anticipo y lo compara con la sumatoria de las formas de pago.
     * @return{void}
     **/
    calcularAnticipo: function () {
        var txtValorPago = $('#txtFormaPago');
        if (txtValorPago.val().trim() !== "" && anticiposModel.formasPago.length > 0 && txtValorPago.val() > 0) {
            var txtSumatoria = $('#txtSumatoriaAnticipos');
            if (parseFloat(txtValorPago.val()) >= parseFloat(txtSumatoria.val())) {
                if (parseFloat(txtValorPago.val()) > parseFloat(txtSumatoria.val())) {
                    var resultCambio = __app.calcularCambio(parseFloat(txtSumatoria.val()), parseFloat(txtValorPago.val()));
                    $('#txtCambio').val(resultCambio.cambio);
                    $('#txtAjuste').val(resultCambio.ajuste);
                } else {
                    $('#txtCambio').val("0");
                    $('#txtAjuste').val("0");
                }
            } else {
                __dom.lanzarAlerta(__app.mensajes.valorPagadoDiferenteAnticipo, __app.mensajes.atencion);
            }
        } else {
            __dom.lanzarAlerta(__app.mensaje.agregarFormaPago, __app.mensajes.atencion);
        }
    },
    /** Abre cuadro de diálogo que permite agregar o modificar una fila de anticipo al recaudo,
     * La función actual no recibe parámetros explicitamente pero en caso de que llegaran los argumentos se toman para editar el anticipo
     * @param {string} 0 -  Título que se mostrará en el diálogo
     * @param {Object} 1 - Información del anticipo que se editará
     * @param {number} 2 - Posición del anticipo en el arreglo del modelo
     * @returns {void}
     **/
    mostrarNuevoAnticipo: function () {
        anticiposModel.docSelected = -1;
        $('#divAnticipo').find('select').empty();
        $('#divAnticipo').find('input[type="text"]').val('');
        var idSuscripcion = anticiposModel.suscripcion.idsuscripcion;
        if (!!idSuscripcion) {
            //este método no recibe parámetros de forma explicita, pero se depende de ellos y se valida la cantidad de parámetros que llegan
            //por medio del objeto arguments. en caso de que los parámetros que se envían a la función sean más de 2 se espera que la operación sea editar
            //de lo contrario, lo que se espera es agregar un anticipo
            var modificar = arguments.length > 1;
            var divAnticipos = $('div#divAnticipo');
            var anticipoOrden = ( parseInt($('#cmbClasePago').val()) == 251  ) ? 1 : null;
            console.log(anticipoOrden);
            divAnticipos.find('.pMensaje').text('');
            var indice = 0;
            var data = anticiposControl.consultarTiposDocumentoPorTipoUso({'idsuscripcion': idSuscripcion , 'anticipoOrden': anticipoOrden });
            if (data.codigoRespuesta === -3) {
                __dom.lanzarAlertaOk(data.mensajeError, __app.mensajes.atencion);
                return;
            }
            anticiposModel.tiposdocumento = data.tiposDocumento;
            var cmbTipoDocumento = divAnticipos.find('#cmbTipoDocumento').empty();
            var cmbPeriodos = divAnticipos.find('#cmbPeriodos').empty();
            var anticipoAnterior = arguments[1];
            __dom.llenarCombo(cmbTipoDocumento, data.tiposDocumento, 'idtipodocumento', 'tipodocumento');
            __dom.llenarCombo(cmbPeriodos, data.periodos, 'ideperiodo', 'periodo');
            if (modificar) { 
                divAnticipos.find('#cmbTipoDocumento').val(anticipoAnterior.idTipoDoc);
                that.consultarDocumentos();
                anticiposModel.docSelected = anticipoAnterior.idDocumento;
                divAnticipos.find('#txtValorAnticipo').val(anticipoAnterior.valor);
                indice = parseInt(arguments[2]);
            }
            divAnticipos.dialogo({
                resizable: false,
                width: 800,
                position: {my: "center", at: "top+200", of: "body"},
                modal: true,
                title: (modificar) ? arguments[0] : 'Agregar Anticipo',
                buttons: {
                    Aceptar: function () {
                        //<editor-fold desc="Valida y guarda la información del anticipo en el modelo" defaultstate="collapsed">
                        var tipoLiq = divAnticipos.find('#cmbTipoLiquidacion option:selected');
                        var documento = divAnticipos.find('#cmbDocumentos option:selected');
                        var tipoDoc = divAnticipos.find('#cmbTipoDocumento option:selected');
                        var concepto = divAnticipos.find('#cmbConcepto option:selected');
                        var periodo = divAnticipos.find('#cmbPeriodos option:selected');
                        var valor = divAnticipos.find('#txtValorAnticipo').val().trim();
                        var anticipo = {};
                        var errores = 0;
                        var msg = "";
                        if (tipoLiq.val() === '-1' && tipoDoc.val() === '-1' && desc.length === 0 && valor === "") {
                            errores++;
                            msg = __app.mensajes.camposInvalidosFiltro;
                        } else {
                            if ((tipoLiq.val() === '-1' || !tipoLiq.val()) && (tipoDoc.val() === '-1' && !tipoDoc.val())) {
                                errores++;
                                msg = __app.mensajes.tipoLiquidacion + " y/o documentos. ";
                            } else {
                                if ((tipoDoc.val() === '-1' || !tipoDoc.val())) {
                                    errores++;
                                    msg = '<br> Debe seleccionar tipo de documento.';

                                } else {


                                    anticipo.idTipoDoc = tipoDoc.val();
                                    anticipo.tipoDocumento = tipoDoc.text();
                                    anticipo.idDocumento = documento.val() !== '-1' ? documento.val() : 0;
                                    anticipo.documento = documento.val() !== '-1' ? documento.text() : '';
                                    anticipo.idTipoLiquidacion = tipoLiq.val() !== '-1' ? tipoLiq.val() : 0;
                                    anticipo.tipoLiquidacion = tipoLiq.val() !== '-1' ? tipoLiq.text() : '';
                                    anticipo.idConcepto = concepto.val() !== '-1' && concepto.val() ? concepto.val() : 0;
                                    anticipo.concepto = concepto.val() !== '-1' && concepto.val() ? concepto.text() : '';
                                    anticipo.idPeriodo = periodo.val() !== '-1' && periodo.val() ? periodo.val() : 0;
                                    anticipo.periodo = periodo.val() !== '-1' && periodo.val() ? periodo.text() : '';
                                }
                            }
                            if (isNaN(parseFloat(valor)) || valor === "") {
                                msg += "<br/> Debe digitar un valor de anticipo válido";
                                errores++;
                            } else {
                                anticipo.valor = parseFloat(valor);
                            }
                        }
                        if (errores > 0) {
                            divAnticipos.find('p.pMensaje').html(msg);
                        } else {
                            if (!modificar) {
                                anticiposModel.anticipo.anticipos.push(anticipo);
                            } else {
                                anticiposModel.anticipo.anticipos[indice] = anticipo;
                            }
                            that.cargarTablaAnticipos();
                            divAnticipos.find('#txtValorAnticipo').val('');
                            divAnticipos.find('#cmbTipoLiquidacion').val('-1');
                            divAnticipos.find('#cmbDocumentos').val('-1');
                            divAnticipos.find('#cmbTipoDocumento').val('-1');
                            $(this).dialog('close');
                        }
                        //</editor-fold>
                    },
                    Cancelar: function () {
                        var _this = $(this);
                        _this.find('input[type="text"]').val('');
                        _this.find('select').val('-1');
                        _this.dialog("close");
                    }
                }
            });
        } else {
            __dom.lanzarAlerta(__app.mensajes.seleccionarSuscripcion, __app.mensajes.atencion);
        }
    },
    /** Carga la tabla con los anticipos que se han registrado
     * @returns {void}
     **/
    cargarTablaAnticipos: function () {
        $('div#divConceptos').show();
        var tbl = fillTable("tblAnticipo", "formatoAnticipos", "anticiposModel.anticipo.anticipos", "Anticipos");
        tbl.find('td[header="thRemover"] input[type="button"]').on('click', that.removerAnticipoSeleccionado);
        tbl.find('td[header="thModificar"] input[type="button"]').on('click', that.modificarAnticipoSeleccionado);
        that.actualizarValorAnticipo();
    },
    /** Actualiza la sumatoria de pesos que debe pagar el usuario por el anticipo
     * @returns {void}
     **/
    actualizarValorAnticipo: function () {
        var suma = 0;
        for (i = 0; i < anticiposModel.anticipo.anticipos.length; i++) {
            suma = parseFloat(suma + parseFloat(anticiposModel.anticipo.anticipos[i].valor));
        }
        $('#txtSumatoriaAnticipos').val(suma);
    },
    /** Válida el tipo de liquidacón seleccionada y configura el formulario de acuerdo a las condiciones del caso de uso
     * @returns {void}
     **/
    validarTipoLiquidacion: function () {

        ///CORREGIR PARA VISUALIZAR TIPO DOCUMENTO SEGÚN LIQUIDACIÓN
        var seleccion = $('#cmbTipoLiquidacion').val();
        var cmbConceptos = $('#cmbConcepto').empty();
        if (seleccion === '-1') {
            return;
        }
        var data = {'idliquidacion': parseInt(seleccion)};
        var respuesta = anticiposControl.consultarConceptosTipoLiquidacion(data);
        if (respuesta.codigoRespuesta === 1) {
            if (respuesta.conceptos.length === 0) {
                __dom.lanzarAlerta("No se encontraron conceptos.", __app.mensajes.atencion);
                return;
            }
            __dom.llenarCombo(cmbConceptos, respuesta.conceptos, 'idconcepto', 'nombreconcepto');
            if (anticiposModel.conceptoModificar) {
                $('#cmbConcepto').val(anticiposModel.conceptoModificar.idConcepto);
                anticiposModel.conceptoModificar = null;
            }
        }
    },
    /** Elimina la información relacionada al anticipo que está seleccionado de la tabla de anticipos
     * @retrun {void}
     **/
    removerAnticipoSeleccionado: function (e) {
        var btn = $(this);
        __dom.lanzarAlerta("Se eliminará este anticipo, ¿Desea continuar?", __app.mensajes.atencion,
                (function () {
                    var indice = parseInt(btn.parent().parent().attr('data-fila'));
                    anticiposModel.anticipo.anticipos.splice(indice, 1);
                    if (anticiposModel.anticipo.anticipos.length > 0) {
                        that.cargarTablaAnticipos();
                    } else {
                        $('#divConceptos').hide('fast');
                        $('#txtSumatoriaAnticipos').val('');
                        $('#tblAnticipo').html('');
                    }
                }), null);
    },
    /** Despliega un cuadro de dialogo que permite actualizar la información del anticipo seleccionado
     * @returns {void}
     **/
    modificarAnticipoSeleccionado: function () {
        var indice = parseInt($(this).parent().parent().attr('data-fila'));
        anticiposModel.conceptoModificar = anticiposModel.anticipo.anticipos[indice];
        that.mostrarNuevoAnticipo('Editar Anticipo', anticiposModel.anticipo.anticipos[indice], indice);
    }
};

anticiposVista.init();
