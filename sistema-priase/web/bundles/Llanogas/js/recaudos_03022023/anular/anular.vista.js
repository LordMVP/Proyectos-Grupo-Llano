/**
 * @fileOverview Archivo de vista y control de anular recaudo
 * @author AppFuture
 * @requires anular.control.js
 * @requires anular.modelo.js
 * @version 1.0.0
 */
/**
 * Objeto que hace referencia al namespace anularVista
 * @type {Object}
 */
var that = null;
/** @namespace */
var anularVista = {
    /** Hace referencia al último dialogo abierto en la aplicación
     * @type {object}
     */
    dialogoActual: null,
    /**Inicializa el programa de anular concepto, y asigna listeners a los controles
     * @returns {void}
     */
    init: function() {
        that = this;
        var comandos = $('div#divComandos');
        comandos.find('#btnBuscar').on('click', that.mostrarFiltro);
        comandos.find('#btnGrabar').on('click', that.anularRecaudo);
        comandos.find('#btnCancelar').on('click', that.cancelarFormulario);
        $('#btnVerFormasPago').on('click', that.mostrarFormasPago);
        __dom.configurarTextoNumerico('txtIdSuscriptorFiltro, #txtIdSuscripcionFiltro, #txtIdRegistroFiltro');
        var inputFechas = __dom.configurarCalendario('txtFechaInicio, #txtFechaFin');
        $('#txtFechaInicio').on('change', that.configurarFechaFin);
    },
    /**Configura la fecha de fin para que no sea inferior a la fecha de incio
     * @returns {void}
     */
    configurarFechaFin: function() {
        var _this = $(this);
        var fi = new Date(_this.val());
        $('#txtFechaFin').datepicker('option', 'minDate', fi).val('');
    },
    
    /** Muestra un dialogo con el formulario para la búsqueda de las suscriptores
     * @returns {void}
     */
    mostrarFiltro: function() {
        var filtro = $('div#divFiltro');
        that.dialogoActual = filtro.dialogo({
            modal: true,
            width: 700,
            position: {my: "center", at: "top+30%", of: "body"},
            title: 'Buscar un recaudo',
            buttons: {
                Buscar: that.filtrarRecaudo
            }
        });
    },
    /** Valida la información del filtro de suscripción y envía la solicitud al servidor
     * @returns {void}
     */
    filtrarRecaudo: function() {
        var dialogo = that.dialogoActual;
        var errores = 0;
        var idRecaudo = $('#txtIdRegistroFiltro').val().trim();
        if (idRecaudo !== "") {
            anularControl.consultarRecaudos({'idRegistro': idRecaudo}, that.onFiltrarCompleto);
            dialogo.find('.pMensaje').html('');
        } else {
            var idSuscripcion = $('#txtIdSuscripcionFiltro').val().trim();
            var idSuscriptor = $('#txtIdSuscriptorFiltro').val().trim();
            var codAnterior = $('#txtCodAnteriorFiltro').val().trim();
            var fechaInicio = $('#txtFechaInicio').val();
            var fechaFin = $('#txtFechaFin').val();
            if ((idSuscripcion !== "" || idSuscriptor !== "" || codAnterior !== "") && fechaInicio !== "" && fechaFin !== "") {
                var datos = {};
                if (idSuscripcion !== "") {
                    datos.idSuscripcion = idSuscripcion;
                }
                if (idSuscriptor !== "") {
                    datos.idSuscriptor = idSuscriptor;
                }
                if (codAnterior !== "") {
                    datos.codAnterior = codAnterior;
                }
                datos.fechaInicio = fechaInicio + " 00:00:00";
                datos.fechaFin = fechaFin + " 23:59:59";
                anularControl.consultarRecaudos(datos, that.onFiltrarCompleto);
                dialogo.find('.pMensaje').html('');
            } else {
                $('#divResultadoFiltro').html('');
                dialogo.find('#btnSeleccionRecaudo').remove();
                dialogo.find('.pMensaje').html('Debe buscar por Id recaudo o por Id suscripción o Id suscriptor o Código anterior en rango de fechas');
            }
        }
    },
    /** Captura la respuesta enviada por el servidor, cuando se consultan las suscripciones.
     * Muestra los recaudos que coinciden.
     * @param  {object} data - El resultado de la petición ajax con recaudos que coinciden
     * @returns {void}
     */
    onFiltrarCompleto: function(data) {
        var divResultadoFiltro = $('#divResultadoFiltro').html('');
        that.dialogoActual.find('.btnSimple').remove();
        switch (data.codigoRespuesta) {
            case 0:
                that.dialogoActual.find('.pMensaje').text(__app.mensajes.sinResultados);
                break;
            case 1:
                if (data.recaudos.length > 1) {
                    $.each(data.recaudos, function(i, item) {
                        var label = $('<label>');
                        label.attr({
                            'for': 'rbtnRecaudo_' + i
                        });
                        var radio = $('<input>').attr({
                            'id': 'rbtnRecaudo_' + i,
                            'data-indice': i,
                            'type': 'radio',
                            'name': 'rbtnRecaudos'
                        });
                        var span = $('<span>').text('Recaudo: ' + item.idrecaudo + ' - Fecha: ' + item.fecha);
                        label.append(radio).append(span);
                        var div = $('<div>').append(label);
                        divResultadoFiltro.append(div);
                    });
                    var btnSeleccionRecaudo = $('<button>');
                    btnSeleccionRecaudo.text('Seleccionar');
                    btnSeleccionRecaudo.attr({
                        'id': 'btnSeleccionRecaudo',
                        'class': 'btnSimple'
                    });
                    btnSeleccionRecaudo.on('click', function() {
                        var seleccionado = divResultadoFiltro.find('input[name="rbtnRecaudos"]:checked');
                        if (seleccionado.length > 0) {
                            anularModel.recaudo = data.recaudos[parseInt(seleccionado.attr('data-indice'))];
                            that.dialogoActual.dialog('close');
                            $('#divFiltro input[type="text"]').val("");
                            that.cargarCabecera();
                        } else {
                            that.dialogoActual.find('.pMensaje').text(__app.mensajes.seleccionarOpcion);
                        }
                    });
                    btnSeleccionRecaudo.insertAfter(divResultadoFiltro);
                } else {
                    anularModel.recaudo = data.recaudos[0];
                    that.dialogoActual.dialog('close');
                    $('#divFiltro input[type="text"]').val("");
                    that.cargarCabecera();
                }
                break;
        }
    },
    /** Carga la cabecera del formulario con los datos del recado seleccionada.
     * Y hace petición ajax para consultar los detalles
     * @returns {void}
     */
    cargarCabecera: function() {
        var filtro = $('div#divFiltro');
        filtro.find('input:text').val('');
        filtro.find('p, span').text('');
        filtro.find('.listaSeleccion').html('');
        filtro.find('#btnSeleccionRecaudo').remove();
        var rec = anularModel.recaudo;
        $('#txtIdRecaudo').val(rec.idrecaudo);
        $('#txtFecha').val(rec.fecha).attr('title', rec.fecha);
        $('#txtDocumento').val(rec.terdocumento);
        $('#txtNombreTercero').val(rec.ternombrecompleto);
        $('#txtConvenio').val(rec.nombreconvenio).attr('data-id', rec.idconvenio);
        anularControl.consultarDetallesRecaudo({'idrecaudo': rec.idrecaudo}, that.onCargarDetallesCompleto);
    },
    /** Captura la respuesta enviada por el servidor, cuando se consultan las detalles del recaudo.
     * Llena las tablas con detalles del recuado
     * @param  {object} data - El resultado de la petición ajax con los detalles del recuado seleccionado.
     * @returns {void}
     */
    onCargarDetallesCompleto: function(data) {
        switch (parseInt(data.codigoRespuesta)) {
           case 0:
                __dom.lanzarAlerta(__app.mensajes.sinResultados, __app.mensajes.tituloErrorInesperado);
                break;
            case 1:
                anularModel.suscripciones = data.resultadoRecaudo.suscripciones;
                anularModel.facturas = data.resultadoRecaudo.facturas;
                anularModel.conceptos = data.resultadoRecaudo.conceptos;
                anularModel.formasPago = data.resultadoRecaudo.formas;
                var tbl1 = fillTable("tblSuscripciones", "formatoSuscripciones", "anularModel.suscripciones", "Suscripciones");
                tbl1.show();
                if (__app.esArreglo(anularModel.facturas) && anularModel.facturas.length > 0) {
                    var tbl2 = fillTable("tblFacturas", "formatoFacturas", "anularModel.facturas", "Facturas");
                    tbl2.show();
                } else {
                    $('#tblFacturas').hide();
                }
                if (__app.esArreglo(anularModel.conceptos) && anularModel.conceptos.length > 0) {
                    var tbl3 = fillTable("tblConceptos", "formatoConceptos", "anularModel.conceptos", "Conceptos y Documentos");
                    tbl3.show();
                } else {
                    $('#tblConceptos').hide();
                }
                break;
        }
    },
    /** Muestra un dialogo con motivos de anulación en caso de confirmar anular
     * envía petición ajax para anulación.
     * @returns {void}
     */
    anularRecaudo: function() {
        if(!!anularModel.recaudo){
            var divMotivos = that.dialogoActual = $('div#divMotivos');
            divMotivos.dialogo({
                modal: true,
                width: 400,
                position: {my: "center", at: "top+40%", of: "body"},
                title: 'Anular Recaudo',
                buttons: {
                    Anular: function() {

                        if (divMotivos.find('#txtObservacion').val().trim()==='') {
                            __dom.lanzarAlerta('Debe agregar unas observaciones', __app.mensajes.atencion);
                            return;
                        }


                        divMotivos.dialog('close');
                        var data = {
                            idRecaudo: anularModel.recaudo.idrecaudo,
                            idMotivo: divMotivos.find('#cmbMotivos option:selected').val(),
                            comentario: divMotivos.find('#txtObservacion').val(),
                            idSuscripcion: anularModel.suscripciones[0].idSuscripcion,
                            version: anularModel.recaudo.version

                        };
                        anularControl.confirmarAnulacion(data, that.onAnularCompleto);
                    },
                    Cancelar: function() {
                        divMotivos.dialog('close');
                    }
                }
            });
        }
    },
    
    /** Cancela la operación actual
     * @returns {void}
     */
    cancelarFormulario: function() {
        var cerrarDialogoConfirmacion = function(){
            return false;
        };

        that.limpiarDialogoFiltro();

        if (anularModel.recaudo !== null && anularModel.recaudo!==undefined) {
            __dom.lanzarAlerta(__app.mensajes.confirmacionCancelacion,
                __app.mensajes.tituloConfirmacion,
                that.limpiarFormulario,
                cerrarDialogoConfirmacion,
                cerrarDialogoConfirmacion
            );
        }
    },

    /**
     * Limpia el Dialogo del filtro de recaudos
     * @returns {void}
     */
    limpiarDialogoFiltro:function(){
        var divFiltro = $('#divFiltro');
        divFiltro.find('input[type="text"]').val('');
        divFiltro.find('.pMensaje').text('');
        divFiltro.find('#divResultadoFiltro').html('');
        divFiltro.find('#btnSeleccionRecaudo').remove();
    },
    
    /** Limpia toda la información del formulario y elimina información del modelo
     * @returns {void}
     */
    limpiarFormulario: function() {
        that.limpiarDialogoFiltro();
        $('#divFiltro input[type="text"]').val("");
        var divResultadoFiltro = $('#divResultadoFiltro').html('');
        that.dialogoActual.find('.btnSimple').remove();
        $('#fieldCabecera input[type="text"]').val('');
        $('#divMotivos select option:first').prop('selected', 'selected')
        $('#divMotivos textarea').val('');
        $('table').html('');
        anularModel = {};
    },
    /** Captura la respuesta enviada por el servidor, cuando se solicita anulación de un recaudo
     * @param  {object} data - El resultado de la petición ajax con respuesta de anulación.
     * @returns {void}
     */
    onAnularCompleto: function(data) {
        switch (data.codigoRespuesta) {
            case 1:
                __dom.lanzarAlerta(data.mensajeRespuesta, __app.mensajes.tituloExito);
                break;
            case -1:
                __dom.ocultarToast();
                __dom.lanzarAlerta(data.mensajeRespuesta, __app.mensajes.atencion);
            break;  
        }
        that.limpiarFormulario();
        that.dialogoActual.dialog('close');
    },
    /** Muestra pagos y formas de pagos aplicados al recaudo
     * @returns {void}
     */
    mostrarFormasPago: function() {
        if (anularModel.recaudo !== null && !!anularModel.recaudo.idrecaudo) {
            var contenido = null;
            if (anularModel.formasPago !== null && __app.esArreglo(anularModel.formasPago)) {
                contenido = $('<div>').addClass('listaSeleccion');
                anularModel.formasPago.forEach(function(item, i) {
                    var forma = $('<div>');
                    forma.text("Forma: " + item.formapago + " - Valor: $" + item.valorreal);
                    contenido.append(forma);
                });
            } else {
                contenido = $('<p>').addClass('pMensaje').text('No se encontraron formas de pago');
            }
            var divFormas = $('div#divFormasPago');
            divFormas.html('').append(contenido);
            that.dialogoActual = divFormas
                    .dialogo({
                        modal: true,
                        width: 400,
                        position: {my: "center", at: "top+40%", of: "body"},
                        title: 'Formas de Pago',
                        buttons: {
                            Aceptar: function() {
                                that.dialogoActual.dialog('close');
                            }
                        }
                    });
        }
    }
};
anularVista.init();