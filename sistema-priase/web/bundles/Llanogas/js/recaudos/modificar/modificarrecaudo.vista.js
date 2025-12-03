/**
 * @fileOverview Archivo de vista y control para modificar recaudo
 * @author jeissonBarriga
 * @requires modificarrecaudo.control.js
 * @requires modificarrecaudo.modelo.js
 * @version 1.0.0
 */
var that = null;
/** @namespace */
var modificarrecaudoVista = {
    /** Hace referencia al último dialogo abierto en la aplicación
     * @type {object}
     */
    dialogoActual: null,
    /**Inicializa el programa de modificación del recaudo, y asigna listeners a los controles
     * @returns {void}
     */
    init: function () {
        that = this;
        __app.vistaActual = modificarrecaudoVista;
        __app.controlActual = modificarrecaudoControl;
        __app.modeloActual = modificarrecaudoModelo;
        var comandos = $('div#divComandos');
        comandos.find('#btnBuscar').on('click', that.mostrarBuscarRecaudo);
        comandos.find('#btnGrabar').on('click', that.grabarOperacion).prop("disabled", false);
        comandos.find('#btnCancelar').on('click', that.cancelarOperacion);
        $('#btnAgregarForma').on('click', that.agregarFormaPago);
        $('#btnAgregarFormaPago').on('click', that.mostrarAgregarFormaPago);
        $('#divBuscarRecaudo').find('#btnBuscar').on('click', that.consultarRecaudos);
        $('#txtFechaInicio').on('change', that.configurarFechaFin);
        $('#dialogoAgregarFormaPago').find('#cmbFormaPago').on('change', that.configurarComboFormasPago);
        $('#cmbTipoLiquidacion').on('change', that.validarTipoLiquidacion);
        $('#cmbTipoDocumento').on('change', that.consultarDocumentos);
        //configurar calendarios
        __dom.configurarCalendario('txtFechaPago');
        __dom.configurarCalendario('txtFechaInicio, #txtFechaFin');

        //cargar los campos que tienen autocompletado
        that.cargarAutocompleteMunicipio();
        that.reiniciarProceso();

        cargarBancos();
    },
    /**
     * Diálogo para modificar las formas de pago del recaudo, se debe modificar desde aquí ya que no puede agregar varias
     * formas de pago en el mismo diálogo porque es para la edición de las existentes
     */
    configurarComboFormasPago: function () {
        var _this = $(this);
        var divFormas = $('#dialogoAgregarFormaPago');
        switch (parseInt(_this.val())) {
            case 0:
                divFormas.find('#divdetallesFormaPago, #divDetallesCheque, #divDetallesTarjeta')
                    .hide()
                    .find('input[type="textbox"]')
                    .val('');
                break;
            case 75:
                divFormas.find('#divdetallesFormaPago, #divDetallesCheque, #divDetallesTarjeta')
                    .hide()
                    .find('input[type="textbox"]')
                    .val('');
                break;
            case 76:
                divFormas.find('#divdetallesFormaPago, #divDetallesTarjeta')
                    .show();
                divFormas.find('#divDetallesCheque').hide()
                    .find('input[type="textbox"]')
                    .val('');
                break;
            case 77:
                divFormas.find('#divdetallesFormaPago, #divDetallesTarjeta')
                    .show();
                divFormas.find('#divDetallesCheque').hide()
                    .find('input[type="textbox"]')
                    .val('');
                break;
            case 78:
                divFormas.find('#divdetallesFormaPago, #divDetallesCheque')
                    .show();
                divFormas.find('#divDetallesTarjeta').hide()
                    .find('input[type="textbox"]')
                    .val('');
                break;
        }
    },
    /**
     * Configuta que la fecha fin no sea menor que la fecha inicio
     */
    configurarFechaFin: function () {
        var _this = $('#txtFechaInicio').val();
        if (_this.trim() !== '') {
            var fechaini = new Date(_this);
            $('#txtFechaFin').datepicker('option', 'minDate', fechaini);
        }
    },
    /**
     * Bloquea los campos de la división "Modificación del Recaudo".
     * @returns {void}
     */
    bloquearCamposModificacionRecaudo: function () {
        $('divDerecha').find('input[type = text]').val('');
        $('divDerecha').find('select').val(-1);
    },
    /**
     * Pregunta al usuario si desea cancelar la operación actual.
     * Si el usuario desea cancelar, se reinicia la operación.
     * @returns {void}
     */
    cancelarOperacion: function () {
        if (!!__app.modeloActual.recaudo) {
            $('div#divConfirmarCancelar').dialogo({
                resizable: false,
                heigth: 140,
                modal: true,
                title: 'Cancelar la Operación',
                buttons: {
                    "Sí": function () {
                        that.reiniciarProceso();
                        $('div#divComandos').find('#btnGrabar').prop('disabled', false);
                        $(this).dialog('close');
                    }, No: function () {
                        $(this).dialog("close");
                    }
                }
            });
        }
    },
    /**
     * Carga el autocompletado de municipios fijando un mínimo de 3 caracteres para activarlo.
     * @returns {void}
     */
    cargarAutocompleteMunicipio: function () {
        __dom.configurarAutocomplete(
            $('#divBuscarRecaudo #txtMunicipio'),
            that.sourceAutoCompleteMunicipio,
            function (event, ui) {
                __app.modeloActual.idMunicipio = ui.item.idVal;
            },
            function () {
                __app.modeloActual.idMunicipio = undefined;
            }
        );
    },
    /** Carga la información del recaudo seleccionado en la interfaz
     * @returns {void}
     **/
    cargarRecaudo: function () {
        that.limpiarBuscar();
        var recaudo = __app.modeloActual.recaudo;
        var fieldsetInformacionSuscriptor = $('#fieldsetInformacionSuscriptor');
        fieldsetInformacionSuscriptor.find('#txtIdRecaudo').val(recaudo.idrecaudo);
        fieldsetInformacionSuscriptor.find('#txtFecha').val(recaudo.fecha);
        fieldsetInformacionSuscriptor.find('#txtDocumento').val(recaudo.cedula);
        fieldsetInformacionSuscriptor.find('#txtNombreTercero').val(recaudo.nombre);
        fieldsetInformacionSuscriptor.find('#txtConvenio').val(recaudo.convenio);

        var divDerecha = $('#fieldsetModificarRecaudo');
        divDerecha.find('#cmbMedioPago').val(recaudo.mediopago);
        divDerecha.find('#cmbSucursal').val(recaudo.sucursal);
        divDerecha.find('#txtFechaPago').val(recaudo.fechapago);

        that.consultarInformacionRecaudo();
    },
    /**
     * Consulta los recaudos que coincidan con los campos diligenciados.
     * @returns {void}
     */
    consultarRecaudos: function () {

        var dialogo = $('#divBuscarRecaudo');

        //leer valores de los campos
        var municipio = __app.modeloActual.idMunicipio;
        var fechaini = dialogo.find('#txtFechaInicio').val().trim();
        var fechafin = dialogo.find('#txtFechaFin').val().trim();
        var clasepago = dialogo.find('#cboClasePago').val() !== '-1' ? dialogo.find('#cboClasePago').val() : '';
        var suscripcion = dialogo.find('#txtSuscripcion').val();
        var documento = dialogo.find('#txtCedula').val();
        var codigoanterior = dialogo.find('#txtCodigoAnterior').val();
        var idrecaudo = dialogo.find('#txtIdRegistroFiltro').val();

        //validar que el municipio fue diligenciado
        if (municipio === '' || municipio == undefined) {
            dialogo.find('#spanMensaje').show().text(__app.mensajes.seleccionarMunicipio);
            return;
        }
        //Validar que las fechas se hayan diligenciado
        if ((fechaini === '' || fechafin === '') && idrecaudo.trim() === '') {
            dialogo.find('#spanMensaje').show().text('Debe seleccionar un rango de fechas para la búsqueda');
            return;
        }
        var data = {
            'idrecaudo': idrecaudo,
            'municipio': municipio,
            'clasepago': clasepago,
            'suscripcion': suscripcion,
            'cedula': documento,
            'codigoanterior': codigoanterior,
            'fechainicio': fechaini !== '' ? fechaini + ' 00:00:00' : '',
            'fechafin': fechafin !== '' ? fechafin + ' 23:59:59' : ''
        };
        __app.controlActual.consultarRecaudos(data, that.onConsultarRecaudosCompleto);
    },
    /**
     * Envía petición al servidor para consultar la información de específica del recaudo buscado para modificación
     */
    consultarInformacionRecaudo: function () {
        var idrecaudo = __app.modeloActual.recaudo.idrecaudo;
        var data = {'idrecaudo': idrecaudo};
        __app.controlActual.consultarInformacionRecaudo(data, that.onConsultarInformacionRecaudoCompleto);
    },
    /**
     * Valida que estén diligenciados los campos obligatorios y construye un objeto
     * JSON con toda la información necesaria para guardar el recaudo.
     * @returns {void}
     */
    grabarOperacion: function () {
        if (!!__app.modeloActual.recaudo) {
            var divDerecha = $('#fieldsetModificarRecaudo');
            var recaudo = __app.modeloActual.recaudo;
            var idRecaudo = recaudo.idrecaudo;
            var idDocumento = divDerecha.find('#cboDocumentoValido').val();
            var idMedioPago = divDerecha.find('#cmbMedioPago').val() != '-1' ? divDerecha.find('#cmbMedioPago').val() : '';
            var idSucursal = divDerecha.find('#cmbSucursal').val();
            var fechaPago = divDerecha.find('#txtFechaPago').val().trim();
            var formaspago = modificarrecaudoModelo.formaspago;
            var valorTotalRecaudo = parseFloat(modificarrecaudoModelo.valorTotalRecaudo);
            var valorParcialFormasPago = parseFloat($('#txtValorParcial').attr('title'));

            //Validar que el valor parcial de los recaudos cubran el valor total del recaudo
            if (valorTotalRecaudo !== valorParcialFormasPago) {
                __dom.lanzarAlerta('La sumatoria de las formas de pago debe cubrir el valor total del recaudo.', __app.mensajes.atencion);
                return;
            }

            //validar que medio de pago, sucursal y fecha de pago estén diligenciados
            if (idMedioPago === '-1' || idSucursal === '-1' || fechaPago === '') {
                __dom.lanzarAlerta('Debe diligenciar todos los campos en Modificación de Recaudo', __app.mensajes.atencion);
                return;
            }
            var data = {
                'idRecaudo': idRecaudo,
                'idDocumento': idDocumento,
                'idMedioPago': idMedioPago,
                'idSucursal': idSucursal,
                'fechaPago': fechaPago,
                'formaspago': formaspago
            };
            __app.controlActual.grabarOperacion(data, that.onGrabarOperacionCompleto);
        }
    },
    /**
     * Llena la tabla de suscripciones a partir de un formato y un arreglo de suscripciones
     * definidos en el modelo.
     * @returns {void}
     */
    llenarTablaSuscripciones: function () {
        fillTable('tblSuscripciones', 'formatoSuscripciones', 'modificarrecaudoModelo.suscripciones', 'Suscripciones');
        $('#tblSuscripciones').show();
    },
    /**
     * Llena la tabla distribucion recaudo a partir de un formato y un arreglo de recaudos
     * definidos en el modelo.
     * @returns {void}
     */
    llenarDistribucionRecaudo: function () {
        var tablaDistribucion = fillTable('tblDistribucionRecaudo', 'formatoDistribucionRecaudo', 'modificarrecaudoModelo.distribucionrecaudo', 'Distribucion Recaudo');
        tablaDistribucion.find('td[header="thModifica"] input[type="button"]').on('click', that.mostrarDataAnticipo);
        $('#tblDistribucionRecaudo').show();
    },
    /**
     * Llena la tabla de facturas a partir de un formato y un arreglo de facturas
     * definidos en el modelo.
     * @returns {void}
     */
    llenarTablaFacturas: function () {
        $('#tblFacturas').empty().hide();
        if (modificarrecaudoModelo.facturas.length > 0) {
            fillTable('tblFacturas', 'formatoFacturas', 'modificarrecaudoModelo.facturas', 'Facturas');
            $('#tblFacturas').show();
        }
    },
    /**
     * Llena la tabla de formas de pago a partir de un formato y un arreglo de formas de pago
     * definidos en el modelo.
     * @returns {void}
     */
    llenarTablaFormasPago: function () {
        if (__app.modeloActual.recaudo.recaudoconsignado) {
            fillTable('tblFormasPago', 'formatoFormasPagoRecaudoConsignado', 'modificarrecaudoModelo.formaspago', 'Formas de Pago');
        } else {
            fillTable('tblFormasPago', 'formatoFormasPagoRecaudoSinConsignar', 'modificarrecaudoModelo.formaspago', 'Formas de Pago');
            $('#tblFormasPago').find('td[header="thEditarFormaPago"] input[type="button"]').on('click', that.editarFormaPago);
            $('#tblFormasPago').find('td[header="thEliminarFormaPago"] input[type="button"]').on('click', that.eliminarFormaPago);
        }
        $('#tblFormasPago').show();
        if (modificarrecaudoModelo.formaspago.length === 0) {
            $('#tblFormasPago').hide();
        }
    },
    /**
     * Muestra la ventana emergente "Buscar Recaudo".
     * @returns {void}
     */
    mostrarBuscarRecaudo: function () {
        var dialogo = $('#divBuscarRecaudo');
        //limpiar formulario "Buscar Recaudo"
        dialogo.find('input[type = text]').val('');
        dialogo.find('select').val(-1);
        that.dialogoActual = dialogo.dialogo({
            modal: true,
            width: 700,
            title: 'Buscar Recaudo'
        });
    },
    /**
     * Gestiona el arreglo de municipios que se obtuvo de la consulta para mostrarlo como
     * una lista de opciones en el combo de municipio.
     * @param  {Object} data Respuesta del servidor al consultar los municipios.
     * @returns {void}
     */
    mostrarResultadoMunicipio: function (data) {
        if (data.codigoRespuesta > 0) {
            var result = [];
            $.each(data.datos, function (i, item) {
                result.push({
                    label: item.municipio,
                    value: item.municipio,
                    idVal: item.idmunicipio
                });
            });
            that.response(result);
        }
    },
    /** Captura la respuesta del servidor cuando se consulta la información del recaudo
     * @param {object} data - Respuesta del servidor con información del recaudo
     * @returns {void}
     **/
    onConsultarInformacionRecaudoCompleto: function (data) {
        var recaudoConsignado = __app.modeloActual.recaudo.recaudoconsignado;
        var boolRecaudo = recaudoConsignado !== null || recaudoConsignado > 0;
        if (data.codigoRespuesta > 0) {
            modificarrecaudoModelo.suscripciones = data.datos.suscripciones;
            modificarrecaudoModelo.facturas = data.datos.facturas;
            modificarrecaudoModelo.formaspago = data.datos.formaspago;
            modificarrecaudoModelo.distribucionrecaudo = data.datos.distribucionRecaudo;

            that.llenarTablaSuscripciones();
            that.llenarTablaFacturas();
            that.llenarTablaFormasPago();
            that.llenarDistribucionRecaudo();
            that.validarValorTotalRecaudo();
            that.configurarFieldsetEditarFormasPago();

            $('#fieldsetModificarRecaudo').children().children().prop('disabled', boolRecaudo);
            $('div#divComandos').find('#btnGrabar').prop('disabled', boolRecaudo);
            boolRecaudo ? $('#mensajeRecaudoConsignado').show() : $('#mensajeRecaudoConsignado').hide();

        } else {
            $('#fieldsetModificarRecaudo').children().children().prop('disabled', boolRecaudo);
            $('div#divComandos').find('#btnGrabar').prop('disabled', boolRecaudo);
            boolRecaudo ? $('#mensajeRecaudoConsignado').show() : $('#mensajeRecaudoConsignado').hide();

            $('#tblSuscripciones, #tblFacturas, #tblFormasPago').empty().hide();
        }
    },
    /**
     * Valida que el recaudo no haya sido consignado en este caso permite editar las formas de pago de lo contrario sólo se muestran las actuales
     */
    configurarFieldsetEditarFormasPago: function () {
        var totalParcial = $('#txtValorParcial');
        $('#txtValorTotalRecaudo').toTxtCurrency();
        !isNaN(parseInt(totalParcial.val())) && totalParcial.toTxtCurrency();
        $('#fieldsetEditarFormasPago').show();
        if (__app.modeloActual.recaudo.recaudoconsignado) {
            $('#btnAgregarFormaPago').hide();
            totalParcial.parent().hide();
        } else {
            $('#btnAgregarFormaPago').show();
            totalParcial.parent().show();
        }
    },
    /**
     * Permite editar una forma de pago que está en la tabla de las formas de pago
     */
    editarFormaPago: function () {
        modificarrecaudoModelo.editando = true;
        modificarrecaudoModelo.filaEditar = $(this).parent().parent().attr('data-fila');
        that.mostrarAgregarFormaPago();
    },
    /**
     * Elimina una forma de pago que tenga el recaudo en la tabla  y valida que el valor del recaudo sea correspondiente
     */
    eliminarFormaPago: function () {
        var fila = $(this).parent().parent().attr('data-fila');
        modificarrecaudoModelo.formaspago.splice(fila, 1);
        that.llenarTablaFormasPago();
        that.validarValorTotalRecaudo();
    },
    /**
     * Limpia  la información de la forma de pago que se haya cargado en el diálogo de edición
     */
    limpiarDialogoFormaPago: function () {
        var dialogo = $('#dialogoAgregarFormaPago');
        dialogo.find('input[type="text"]').val('');
        dialogo.find('#divdetallesFormaPago, #divDetallesCheque, #divDetallesTarjeta').hide();
        dialogo.find('.campoValido').removeClass('campoValido');
        dialogo.find('.campoInvalido').removeClass('campoInvalido');
    },
    /**
     * Permite ver el saldo pendiente por agregar como forma de pago en el diálogo
     */
    establecerSaldoPendiente: function () {
        var valorTotalRecaudo = $('#txtValorTotalRecaudo').attr('title');
        var valorParcial = $('#txtValorParcial').attr('title');
        var saldoPendiente = (valorTotalRecaudo - valorParcial).toFixed(7);
        $('#dialogoAgregarFormaPago').find('#txtSaldoPendiente').val(saldoPendiente);
    },
    /** Muestra cuadro de dialogo las formas de pago que se pueden aplicar al pago
     * @returns {void}
     */
    mostrarAgregarFormaPago: function () {
        that.limpiarDialogoFormaPago();
        that.establecerSaldoPendiente();
        var dialogo = $('#dialogoAgregarFormaPago');
        dialogo.find('#cmbBanco').html(bancos.html());
        dialogo.find('input#txtFechaExpiracion')
            .mask('99/99')
            .focusout(function () {
                validarFechaExpiracion($(this));
            });
        dialogo.find('input#txtNumTarjeta').mask('9999-9999-9999-9999');
        __dom.configurarTextoNumerico('txtDocGirador');
        __dom.configurarTextoNumerico('txtValor', false, true, true);
        __dom.configurarTextoNumerico('txtNumCheque');
        __dom.configurarTextoNumerico('txtNumCuenta');
        $('#dialogoAgregarFormaPago').find('#cmbFormaPago').val(75);
        $('#dialogoAgregarFormaPago').find('#cmbFranquicia').val('Visa');
        if (modificarrecaudoModelo.editando) {
            that.cargarFormaPagoEditar();
        }
        dialogo.off('close');
        that.dialogoActual = dialogo.dialogo({
            resizable: false,
            width: 800,
            position: {my: "center", at: "top+90", of: "body"},
            modal: true,
            title: 'Agregar Forma de Pago',
            beforeClose: that.funcionCerrarDialogo,
            buttons: {
                Aceptar: function () {
                    if (that.agregarFormaPago()) {
                        that.funcionCerrarDialogo(null, true);
                    }
                },
                Cancelar: function () {
                    that.funcionCerrarDialogo(null, true);
                }
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
            that.limpiarDialogoFormaPago();
            modificarrecaudoModelo.editando = false;
            return;
        }
    },
    /**
     * Carga la información adicional de la forma de pago según el id del tipo de forma de pago
     */
    cargarFormaPagoEditar: function () {
        var filaEditar = modificarrecaudoModelo.filaEditar;
        var formaPagoEditar = modificarrecaudoModelo.formaspago[filaEditar];
        var divForma = $("#dialogoAgregarFormaPago");
        var idFormaPago = parseInt(formaPagoEditar.idtipoformapago);
        divForma.find('#cmbFormaPago').val(idFormaPago);
        divForma.find('#cmbFormaPago').change();
        divForma.find('#txtValor').val(formaPagoEditar.valorpagado);
        if (idFormaPago !== 75) {
            divForma.find('#txtDocGirador').val(formaPagoEditar.informacionAdicional[1].informacion);
            divForma.find('#txtNombreGirador').val(formaPagoEditar.informacionAdicional[0].informacion);
            divForma.find('#cmbBanco').val(formaPagoEditar.idbanco);
        }
        if (idFormaPago === 76 || idFormaPago === 77) {
            divForma.find('#cmbFranquicia').val(formaPagoEditar.informacionAdicional[3].informacion);
            divForma.find('#txtNumTarjeta').val(formaPagoEditar.informacionAdicional[4].informacion);
            divForma.find('#txtFechaExpiracion').val(formaPagoEditar.informacionAdicional[5].informacion);
        }
        if (idFormaPago === 78) {
            divForma.find('#txtNumCuenta').val(formaPagoEditar.informacionAdicional[4].informacion);
            divForma.find('#txtNumCheque').val(formaPagoEditar.informacionAdicional[3].informacion);
        }
    },
    /**
     * Agrega una nueva forma de pago a la tabla
     * @returns {void}
     */
    agregarFormaPago: function () {
        var errores = 0;
        var forma = {};
        var divForma = $("#dialogoAgregarFormaPago");
        var txtValor = divForma.find('#txtValor');
        var valor = txtValor.val().trim();
        if (valor !== "") {
            forma.informacionAdicional = [];
            forma.valorpagado = parseFloat(valor);
            forma.idrecaudo = $('#txtIdRecaudo').val();
            forma.idtipoformapago = divForma.find('#cmbFormaPago option:selected').val();
            forma.nombretipoformapago = divForma.find('#cmbFormaPago option:selected').text();
            txtValor.addClass('campoValido').removeClass('campoInvalido');
        } else {
            txtValor.focus().addClass('campoInvalido').removeClass('campoValido');
            errores++;
        }

        //Si la forma de pago NO es efectivo, se lee la información adicional
        if (forma.idtipoformapago !== '75') { //75:Efectivo
            divForma.find('#divdetallesFormaPago input[type="text"]').each(function (j, textbox) {
                if (textbox.value.trim() === "") {
                    $(textbox).focus().addClass('campoInvalido').removeClass('campoValido');
                    errores++;
                } else {
                    $(textbox).addClass('campoValido').removeClass('campoInvalido');
                }
            });
            forma.idbanco = divForma.find('#cmbBanco option:selected').val();
            var nombregirador = {
                idtipoinformacion: '13',
                nompretipoinformacion: 'Nombre Tercero Girador',
                informacion: divForma.find('#txtNombreGirador').val()
            };
            var documentogirador = {
                idtipoinformacion: '12',
                nompretipoinformacion: 'Nit tercero Girador',
                informacion: divForma.find('#txtDocGirador').val()
            };
            var nombrebanco = {
                idtipoinformacion: '9',
                nompretipoinformacion: 'Banco',
                informacion: divForma.find('#cmbBanco option:selected').text()
            };
            forma.informacionAdicional.push(nombregirador, documentogirador, nombrebanco);
        }
        //Si la forma de pago es por tarjeta de crédito o débito, se lee la información de la tarjeta
        if (forma.idtipoformapago === '77' || forma.idtipoformapago === '76') {  //76:Credito | 77:Debito
            divForma.find('#divDetallesTarjeta input[type="text"]').each(function (j, textbox) {
                if (textbox.value.trim() === "") {
                    $(textbox).focus().addClass('campoInvalido').removeClass('campoValido');
                    errores++;
                } else {
                    $(textbox).addClass('campoValido').removeClass('campoInvalido');
                }

                if (textbox.id.search('txtFechaExpiracion') !== -1) {
                    errores += validarFechaExpiracion(textbox) ? 0 : 1;
                }
            });
            var nombrefranquicia = {
                idtipoinformacion: '14',
                nompretipoinformacion: 'Franquicia',
                informacion: divForma.find('#cmbFranquicia option:selected').text()
            };
            var numerotarjeta = {
                idtipoinformacion: '15',
                nompretipoinformacion: 'Numero de Tarjeta',
                informacion: divForma.find('#txtNumTarjeta').val()
            };
            var fechavencimiento = {
                idtipoinformacion: '16',
                nompretipoinformacion: 'Fecha Vencimiento',
                informacion: divForma.find('#txtFechaExpiracion').val()
            };
            forma.informacionAdicional.push(nombrefranquicia, numerotarjeta, fechavencimiento);
            //Si la forma de pago es chque, se lee la información del cheque
        } else if (forma.idtipoformapago === '78') { //78:Cheque
            divForma.find('#divDetallesCheque input[type="text"]').each(function (j, textbox) {
                if (textbox.value.trim() === "") {
                    $(textbox).focus().addClass('campoInvalido').removeClass('campoValido');
                    errores++;
                } else {
                    $(textbox).addClass('campoValido').removeClass('campoInvalido');
                }
            });
            var numerocuenta = {
                idtipoinformacion: '10',
                nompretipoinformacion: 'Numero de Cuenta',
                informacion: divForma.find('#txtNumCuenta').val()
            };
            var numerocheque = {
                idtipoinformacion: '11',
                nompretipoinformacion: 'Numero de Cheque',
                informacion: divForma.find('#txtNumCheque').val()
            };
            forma.informacionAdicional.push(numerocuenta, numerocheque);
        }
        if (errores === 0) {
            if (!that.validarValorTotalRecaudo()) {
                __dom.lanzarAlerta('El valor parcial excede el valor total del recaudo', __app.mensajes.atencion);
                return false;
            }
            if (modificarrecaudoModelo.editando) {
                var filaEditar = modificarrecaudoModelo.filaEditar;
                modificarrecaudoModelo.formaspago[filaEditar] = forma;
                that.validarValorTotalRecaudo();
            } else {
                modificarrecaudoModelo.formaspago.push(forma);
            }
            that.llenarTablaFormasPago();
        }
        return (errores > 0) ? false : true;
    },
    /**
     * Valida que la sumatoria de las formas de pago no sea mayor al valor total del recaudo
     * @returns {boolean}
     */
    validarValorTotalRecaudo: function () {
        var valorTotalRecaudo = parseFloat(modificarrecaudoModelo.valorTotalRecaudo);
        var formasPago = modificarrecaudoModelo.formaspago;
        var valorActualFormasPago = 0;
        var filaEditar = modificarrecaudoModelo.editando ? parseInt(modificarrecaudoModelo.filaEditar) : null;
        $.each(formasPago, function (index, formaPago) {
            if (index !== filaEditar) {
                valorActualFormasPago += parseFloat(formaPago.valorpagado);
            }
        });
        var valorCampoTextoDialogo = $("#dialogoAgregarFormaPago").find('#txtValor').val().trim();
        if (valorCampoTextoDialogo) {
            valorActualFormasPago += parseFloat($("#dialogoAgregarFormaPago").find('#txtValor').val().trim());
        }
        if (valorActualFormasPago <= valorTotalRecaudo) {
            $('#txtValorParcial').val(valorActualFormasPago);
            $('#txtValorParcial').toTxtCurrency();
            return true;
        }
        return false;

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
            if (indice < modificarrecaudoModelo.formasPagoAgregar.length) {
                that.actualizarIndices(indice);
            }
        });
    },
    /**
     * Actualiza la sumatoria en pesos de las formas de pago y calcula diferencia con respecto al saldo de las facturas.
     * @returns {void}
     */
    actualizarSumatoria: function () {
        var nuevoValor = 0;
        $('div#dialogoAgregarFormaPago').find('input[id^="txtValor"]').each(function (i, textbox) {
            var val = parseFloat(textbox.value);
            nuevoValor += (!isNaN(val)) ? val : 0;
        });
        $('#txtFormaPago, #txtSumatoria').val(nuevoValor);
    },
    /**
     * Elimina una forma de pago según el índice
     * @returns {void}
     */
    eliminarForma: function (indice) {
        for (var i = indice; i < modificarrecaudoModelo.formasPagoAgregar.length; i++) {
            var forma = modificarrecaudoModelo.formasPagoAgregar[i];
            if (forma.indice == indice) {
                modificarrecaudoModelo.formasPagoAgregar.splice(i, 1);
            }
        }
    },
    /**
     * Cancela las formas de pago
     * @returns {void}
     */
    cancelarFormasPago: function () {
        $('#txtFormaPago, #txtSumatoria').val('');
        $('div#divFormasPago div#controlesFormasPago').html('');
    },
    /**
     * Función de callback para establecer los valores de los campos en el fieldset
     * "Informació del Recaudo" y llenar las tablas "Suscripciones" y "Facturas"
     * a partir de la respuesta obtenida del servidor.
     * @param  {Object} data Respuesta del servidor al consultar los recaudos.
     * @returns {void}
     */
    onConsultarRecaudosCompleto: function (data) {
        that.dialogoActual.find('#spanMensaje').text('');
        switch (data.codigoRespuesta) {
            case 0:
                that.dialogoActual.find('#spanMensaje').text(__app.mensajes.sinResultados).show();
                that.dialogoActual.find('div.listaSeleccion').remove();
                //__dom.lanzarAlerta(__app.mensajes.sinResultados, __app.mensajes.atencion);
                break;
            case 1:
               // var div =  $('div.divDerecha');
                var cboDocumentoValido  = $('#cboDocumentoValido');
                cboDocumentoValido.empty(); 
              //  var opcion = $('<option>').val(-1).text('Selecciona un Documento ..');            
               // cboDocumentoValido.append(opcion);
                for(var i=0; i<data.listadocumentosvalidos.length;i++){
                    var Documentovalido = data.listadocumentosvalidos[i];
                    var opcion = $('<option>').val(Documentovalido.iddocumento).text(Documentovalido.documento);                                    
                    cboDocumentoValido.append(opcion);
                }
              
                if (data.datos.length > 1) {
                    that.dialogoActual.find('div.listaSeleccion').remove();
                    var divRecaudos = $('<div>').addClass('listaSeleccion');
                    $.each(data.datos, function (index, recaudo) {
                        var div = $('<div>');
                        var radio = $('<input type="radio">');
                        var label = $('<label>');
                        radio.val(recaudo.idrecaudo);
                        radio.attr('id', 'radio_recaudo_' + index);
                        radio.attr('data-indice', index);
                        radio.attr('name', 'radio_recaudos');

                        label.attr('for', 'radio_recaudo_' + index);
                        label.text(recaudo.cedula + ' - ' + recaudo.nombre + ' - ' + recaudo.idrecaudo);
                        div.append(radio).append(label);
                        divRecaudos.append(div);
                    });
                    var btn = $('<button>').text('Finalizar').addClass('btnSimple');
                    btn.on('click', function () {
                        var recaudoSeleccionado = that.dialogoActual.find('input[name="radio_recaudos"]:checked');
                        if (recaudoSeleccionado.length > 0) {
                            __app.modeloActual.recaudo = data.datos[recaudoSeleccionado.attr('data-indice')];
                            var valorTotalRecaudo = __app.modeloActual.recaudo.valor;
                            modificarrecaudoModelo.valorTotalRecaudo = valorTotalRecaudo;
                            $('#txtValorTotalRecaudo').val(valorTotalRecaudo);
                            that.dialogoActual.find('#spanMensaje').hide();
                            that.dialogoActual.dialog('close');
                            divRecaudos.remove();
                            that.cargarRecaudo();
                        } else {
                            that.dialogoActual.find('#spanMensaje').text(__app.mensajes.seleccionarOpcion).show();
                        }
                    });
                    divRecaudos.insertAfter(that.dialogoActual.find('#spanMensaje'));
                    divRecaudos.append(btn);
                } else {
                    __app.modeloActual.recaudo = data.datos[0];
                    var valorTotalRecaudo = data.datos[0].valor;
                    modificarrecaudoModelo.valorTotalRecaudo = valorTotalRecaudo;
                    $('#txtValorTotalRecaudo').val(valorTotalRecaudo);
                    that.dialogoActual.find('#spanMensaje').hide();
                    that.dialogoActual.dialog('close');
                    that.cargarRecaudo();
                    console.debug(valorTotalRecaudo);
                }

                break;
        }
    },
    /**
     * Función de callback para notificar que la operación ha sido grabada exitosamente
     * y reiniciar el proceso.
     * @param  {Object} data Respuesta del servidor al grabar la operación.
     * @returns {void}
     */
    onGrabarOperacionCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 1:
                that.reiniciarProceso();
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.tituloExito);
                break;
        }
    },
    /**
     * Borra el contenido de las variables temporales del modelo, limpia y establece
     * todos los campos y tablas a su estado inicial.
     * @returns {void}
     */
    reiniciarProceso: function () {
        __app.modeloActual = {};
        $('input[type = "text"]').val('');
        $('select').val(-1);
        $('#tblSuscripciones, #tblFacturas, #tblFormasPago').empty().hide();
        $('#fieldsetEditarFormasPago').hide();
    },
    /**
     * Limpia el diálogo de búsqueda de recaudos
     */
    limpiarBuscar: function () {
        __app.modeloActual.idMunicipio = '';
        var div = $('#divBuscarRecaudo');
        div.find('input[type="text"]').val('');
        div.find('select').val('-1');
        div.find('p, .listaSeleccion').html('');
    },
    /**
     * Función de callback que consulta los municipios y llama a la función que
     * muestra el resultado en el autocomplete "Municipio".
     * @param  {Object} data Respuesta del servidor al consultar los municipios.
     * @returns {void}
     */
    sourceAutoCompleteMunicipio: function (request, response) {
        that.request = request;
        that.response = response;
        var data = {};
        data.municipio = request.term.trim();
        __app.controlActual.consultarMunicipios(data, that.mostrarResultadoMunicipio);
    },
    
     /** Abre cuadro de diálogo que permite agregar o modificar una fila de anticipo al recaudo,
     * La función actual no recibe parámetros explicitamente pero en caso de que llegaran los argumentos se toman para editar el anticipo
     * @param {string} 0 -  Título que se mostrará en el diálogo
     * @param {Object} 1 - Información del anticipo que se editará
     * @param {number} 2 - Posición del anticipo en el arreglo del modelo
     * @returns {void}
     **/
    mostrarDataAnticipo: function () {
        $('#divAnticipo').find('select').empty();
        var idSuscripcion = modificarrecaudoModelo.suscripciones[0].idsuscripcion;
        if (!!idSuscripcion) {
            //este método no recibe parámetros de forma explicita, pero se depende de ellos y se valida la cantidad de parámetros que llegan
            //por medio del objeto arguments. en caso de que los parámetros que se envían a la función sean más de 2 se espera que la operación sea editar
            //de lo contrario, lo que se espera es agregar un anticipo
            var modificar = arguments.length > 1;
            var divAnticipos = $('div#divAnticipo');
            divAnticipos.find('.pMensaje').text('');
            var indice = 0;
            var data = __app.controlActual.consultarTiposDocumentoPorTipoUso({'idsuscripcion': idSuscripcion});
            modificarrecaudoModelo.tiposdocumento = data.tiposDocumento;
            modificarrecaudoModelo.periodos = data.periodos;
            var cmbTipoDocumento = divAnticipos.find('#cmbTipoDocumento').empty();
            var cmbPeriodos = divAnticipos.find('#cmbPeriodos').empty();
            var anticipoAnterior = arguments[1];
            __dom.llenarCombo(cmbTipoDocumento, data.tiposDocumento, 'idtipodocumento', 'tipodocumento');
            __dom.llenarCombo(cmbPeriodos, data.periodos, 'ideperiodo', 'periodo');
            if (modificar) {
                divAnticipos.find('#cmbTipoDocumento').val(anticipoAnterior.idTipoDoc);
                that.consultarDocumentos();
                modificarrecaudoModelo.docSelected = anticipoAnterior.idDocumento;
                indice = parseInt(arguments[2]);
            }
            divAnticipos.dialogo({
                resizable: false,
                width: 800,
                position: {my: "center", at: "top+200", of: "body"},
                modal: true,
                title: (modificar) ? arguments[0] : 'Modificar Anticipo',
                buttons: {
                    Modificar: function () {
                        //<editor-fold desc="Valida y guarda la información del anticipo en el modelo" defaultstate="collapsed">
                        var tipoLiq = divAnticipos.find('#cmbTipoLiquidacion option:selected');
                        var documento = divAnticipos.find('#cmbDocumentos option:selected');
                        var tipoDoc = divAnticipos.find('#cmbTipoDocumento option:selected');
                        var concepto = divAnticipos.find('#cmbConcepto option:selected');
                        var periodos = divAnticipos.find('#cmbPeriodos option:selected');
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
                                    anticipo.idPeriodo = periodos.val() !== '-1' && periodos.val() ? periodos.val() : 0;
                                    anticipo.periodo = periodos.val() !== '-1' && periodos.val() ? periodos.text() : '';
                                    anticipo.idsuscripcion = modificarrecaudoModelo.suscripciones[0].idsuscripcion;
                                    anticipo.idrecaudo = modificarrecaudoModelo.distribucionrecaudo[0].idrecaudo;
                                    
                                    __app.controlActual.validaRecaudoFes({idrecaudo : anticipo.idrecaudo}, function(data){
                                        console.log(data);
                                         if (data.codigoRespuesta === 1) {
                                            if (data.fes.cantidad == 0) {
                                               __app.controlActual.setDistribucionRecaudo(anticipo, that.onsetDistribucionRecaudo); 
                                            }
                                            else{
                                                __dom.lanzarAlerta("Error, no se actualizo el recaudo, Cliente se Encuentra en Proceso de Liquidacion de factura de Servicio", __app.mensajes.atencion);
                                            }
                                         }
                                    });
                                    
                                }
                            }
                            
                        }
                        if (errores > 0) {
                            divAnticipos.find('p.pMensaje').html(msg);
                        } else {
                           
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
     /**
     * Consulta los documentos y las liquidaciones según el tipo de documento seleccionado y son cargados en el combo
     * La función callback de la consulta está anidada
     */
    consultarDocumentos: function () {
        $('#cmbDocumentos,#cmbTipoLiquidacion,#cmbConcepto').empty();
        var idtipodocumento = $('#cmbTipoDocumento').val();
        var idsuscripcion = modificarrecaudoModelo.suscripciones[0].idsuscripcion;
        var cmbDocumento = $('#cmbDocumentos');
        if (idtipodocumento !== '-1' && idtipodocumento) {
            __app.controlActual.consultarDocumentos({idtipodocumento: idtipodocumento}, function (data) {
                var documentos = data.documentos;
                if (data.codigoRespuesta === 1) {
                    if (documentos.length === 0) {
                        __dom.lanzarAlerta('No se encontraron documentos.', __app.mensajes.atencion);
                    } else {
                        __dom.llenarCombo(cmbDocumento, data.documentos, 'iddocumento', 'documento');
                        if (modificarrecaudoModelo.docSelected) {
                            cmbDocumento.val(modificarrecaudoModelo.docSelected);
                            modificarrecaudoModelo.docSelected = null;
                        }
                    }
                }
                __app.controlActual.consultarTiposLiquidacion({'idtipodocumento': idtipodocumento, 'idsuscripcion': idsuscripcion}, that.onCompletoConsultarTiposLiquidacion);
            });
        }
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
        var respuesta = __app.controlActual.consultarConceptosTipoLiquidacion(data);
        if (respuesta.codigoRespuesta === 1) {
            if (respuesta.conceptos.length === 0) {
                __dom.lanzarAlerta("No se encontraron conceptos.", __app.mensajes.atencion);
                return;
            }
            __dom.llenarCombo(cmbConceptos, respuesta.conceptos, 'idconcepto', 'nombreconcepto');
            if (modificarrecaudoModelo.conceptoModificar) {
                $('#cmbConcepto').val(modificarrecaudoModelo.conceptoModificar.idConcepto);
                modificarrecaudoModelo.conceptoModificar = null;
            }
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
                if (modificarrecaudoModelo.conceptoModificar) {
                    $('#divAnticipo').find('#cmbTipoLiquidacion').val(modificarrecaudoModelo.conceptoModificar.idTipoLiquidacion);
                    that.validarTipoLiquidacion();
                }
                break;
        }
    },
    onsetDistribucionRecaudo: function(data){
       that.consultarInformacionRecaudo();
    }
};
modificarrecaudoVista.init();
