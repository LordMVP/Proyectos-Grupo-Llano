/**
 * @fileOverview Archivo de vista y control de trasladar recaudos
 * @author svanegas
 * @requires recaudos.js
 * @requires trasladar.control.js
 * @requires trasladar.model.js
 * @version 1.0.0
 */

/**
 * Objeto que hace referencia al namespace trasladoVista
 * @type {Object}
 */
var that = null;
/** @namespace */
var trasladoVista = {
    /** Hace referencia al último dialogo abierto en la aplicación
     * @type {object}
     */
    dialogoActual: null,
    /**Inicializa el programa de traslado, y asigna listeners a los controles
     * @returns {void}
     */
    init: function() {
        dialogoActual:null,
        that = this;
        var comandos = $('div#divComandos');
        comandos.find('#btnMostrarFiltroRecaudos').on('click', that.mostrarFiltro);
        comandos.find('#btnGrabar').on('click', that.trasladarRecaudo);
        comandos.find('#btnCancelar').on('click', that.cancelarFormulario);

        $('#btnVerFormasPago').on('click', that.mostrarFormasPago);
        $('#btnRecaudo').on('click', that.buscarRecaudo);
        $('#btnSuscripcion').on('click', that.buscarSuscripcion);
        $('#btnBuscarRecaudo').on('click', that.filtrarRecaudo);

        __dom.configurarTextoNumerico('txtIdSuscriptorFiltro, #txtIdSuscripcionFiltro, #txtIdRegistroFiltro, #txtFiltroSus, #txtFiltroCodAnt, #txtFiltroDoc');
        __dom.configurarCalendario('txtFechaInicio, #txtFechaFin');
        $('#txtFechaInicio').on('change', that.configurarFechaFin);
    },
    /** Configurar que la fecha final no sea menos a la de inicio
     * @returns {void}
     */
    configurarFechaFin: function() {
        var _this = $(this);
        var fi = new Date(_this.val().replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3"));
        $('#txtFechaFin').datepicker('option', 'minDate', fi).val('');
    },
    /** Muestra un dialogo con formulario para la búsqueda de una suscripción
     * @returns {void}
     */
    mostrarFiltro: function() {
        var filtro = $('div#divFiltro');
        that.dialogoActual = filtro.dialogo({
            modal: true,
            width: 700,
            title: 'Buscar un recaudo'
        });
    },
    /** Valida información para hacer petición ajax para consultar las suscripciones con coincidencias
     * @returns {void}
     */
    filtrarRecaudo: function() {
        var dialogo = that.dialogoActual;
        var errores = 0;
        var idRecaudo = $('#txtIdRegistroFiltro').val().trim();
        if (idRecaudo !== "") {
            trasladoControl.consultarRecaudos({'idRegistro': idRecaudo}, that.onFiltrarCompleto);
            dialogo.find('.pMensaje').text('');
        } else {
            var idSuscripcion = $('#txtIdSuscripcionFiltro').val().trim();
            var idSuscriptor = $('#txtIdSuscriptorFiltro').val().trim();
            var fechaInicio = $('#txtFechaInicio').val();
            var fechaFin = $('#txtFechaFin').val();
            if (idSuscripcion !== '' || idSuscriptor !== '' && fechaInicio !== '' && fechaFin !== '') {
                var datos = {};
                if (idSuscripcion !== '') {
                    datos.idSuscripcion = idSuscripcion;
                }
                if (idSuscriptor !== '') {
                    datos.idSuscriptor = idSuscriptor;
                }
                datos.fechaInicio = fechaInicio + '2000/01/01';
                datos.fechaFin = fechaFin + '2020/12/12';
                trasladoControl.consultarRecaudos(datos, that.onFiltrarCompleto);
                dialogo.find('.pMensaje').text('');
            } else {
                dialogo.find('.pMensaje').text(__app.mensajes.camposIncompletosBuscarRecaudo);
            }
        }
    },
    /** Captura respuesta del servidor cuando se consultan suscripciones
     * @param {object} data - Respuesta del servidor con las suscripciones que coinciden
     * @returns {void}
     */
    onFiltrarCompleto: function(data) {
        var divResultadoFiltro = $('#divResultadoFiltro').html('');
        that.dialogoActual.find('.btnSeleccion').remove();
        switch (parseInt(data.codigoRespuesta)) {
            case 0:
                that.dialogoActual.find('.pMensaje').text(__app.mensajes.sinResultados).show();
                break;
            case 1:
                if (data.recaudos.length > 1) {
                    $.each(data.recaudos, function(i, item) {
                        var label = $('<label>');
                        label.attr({'for': 'rbtnRecaudo_' + i});
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
                        'id': 'btnSeleccionarRecaudo',
                        'class': 'btnSimple btnSeleccion'
                    });
                    btnSeleccionRecaudo.on('click', function() {
                        var seleccionado = divResultadoFiltro.find('input[name="rbtnRecaudos"]:checked');
                        if (seleccionado.length > 0) {
                            that.limpiarFormulario();
                            trasladoModel.recaudo = data.recaudos[parseInt(seleccionado.attr('data-indice'))];
                            that.dialogoActual.dialog('close');
                            that.cargarCabecera();
                        } else {
                            that.dialogoActual.find('.pMensaje').text(__app.mensajes.seleccionarOpcion);
                        }
                    });
                    btnSeleccionRecaudo.insertAfter(divResultadoFiltro);
                } else {
                    that.limpiarFormulario();
                    trasladoModel.recaudo = data.recaudos[0];
                    that.dialogoActual.dialog('close');
                    that.cargarCabecera();
                }
                break;
        }
    },
    /** Carga datos de la suscripción seleccionada y hace petición ajax consultando los detalles del mismo
     * @returns {void}
     */
    cargarCabecera: function() {
        var rec = trasladoModel.recaudo;
        $('#txtIdRecaudo').val(rec.idrecaudo);
        $('#txtFecha').val(rec.fecha).attr('title', rec.fecha);
        $('#txtDocumento').val(rec.terdocumento);
        $('#txtNombreTercero').val(rec.ternombrecompleto);
        $('#txtConvenio').val(rec.nombreconvenio).attr('data-id', rec.idconvenio);
        $('#txtValorTotal').val(rec.valor.toString().toCurrency());
        trasladoModel.suscriptor = {
            terdocumento:rec.terdocumento,
            ternombrecompleto:rec.ternombrecompleto,
            nombreconvenio:rec.nombreconvenio,
            idconvenio:rec.idconvenio
        };
        trasladoControl.consultarDetallesRecaudo({'idrecaudo': rec.idrecaudo}, that.onCargarDetallesCompleto);
    },
    /** Capura la respuesta del servidor y carga la lista de detalles del recaudo para revisar 
     * cuáles valores se trasladarán
     * @param {object} data - Respuesta del servidor con suscripciones, facturas y formas
     * @returns {void}
     */
    onCargarDetallesCompleto: function(data) {
        switch (parseInt(data.codigoRespuesta)) {
            case 0:
                __dom.lanzarAlerta(__app.mensajes.sinResultados, __app.mensajes.tituloErrorInesperado);
                break;
            case 1:
                trasladoModel.suscripciones = data.resultadoRecaudo.suscripciones;
                trasladoModel.facturas = data.resultadoRecaudo.facturas;
                trasladoModel.formasPago = data.resultadoRecaudo.formas;

                var tbl1 = fillTable("tblSuscripciones", "formatoSuscripciones", "trasladoModel.suscripciones", "Suscripciones");
                tbl1.show();

                if (__app.esArreglo(trasladoModel.facturas) && trasladoModel.facturas.length > 0) {
                    var tbl2 = fillTable("tblFacturas", "formatoFacturas", "trasladoModel.facturas", "Facturas");
                    tbl2.show();
                } else {
                    $('#tblFacturas').hide();
                }
                if (__app.esArreglo(trasladoModel.conceptos) && trasladoModel.conceptos.length > 0) {
                    var tbl3 = fillTable("tblConceptos", "formatoConceptos", "trasladoModel.conceptos", "Conceptos y Documentos");
                    tbl3.show();
                } else {
                    $('#tblConceptos').hide();
                }
                break;
        }
    },
    /** Muestra un cuadro de dialogo para configurar el traslado del recaudo
     * @returns {void}
     */
    trasladarRecaudo: function() {
        if (that.validarTraslado()) {
            var divMotivos = that.dialogoActual = $('div#divMotivos');
            divMotivos.dialogo({
                modal: true,
                width: 400,
                title: 'Trasladar Recaudo',
                buttons: {
                    Trasladar: function() {
                        divMotivos.dialog('close');
                        var suscripciones = [];
                        $('#tblSuscripcionesTransferir tbody .tblCheck:checked').each(function(i, item) {
                            item = $(item);
                            suscripciones.push(
                                {
                                    idsuscripcion: item.val(),
                                    valor: parseInt(item.parent().siblings('td[header="thTransferencia"]').find('input.tblTxt').val())
                                }
                            );
                        });
                        var data = {
                            idrecaudo: trasladoModel.recaudo.idrecaudo,
                            idmotivo: divMotivos.find('#cmbMotivos option:selected').val(),
                            comentario: divMotivos.find('#txtObservacion').val(),
                            idtercerodestino: trasladoModel.suscripcionesDestino[0].idtercero,
                            idsuscriptordestino: trasladoModel.suscripcionesDestino[0].idsuscriptor,
                            suscripciones: suscripciones
                        };
                        trasladoControl.confrimarTraslado(data, that.onTrasladarCompleto);
                    },
                    Cancelar: function() {
                        divMotivos.dialog('close');
                    }
                }
            });
        }
    },
    /** Valida toda la información del traslado en caso de que de error el usuario será advertido. De lo contrario
     * hace petición ajax para grabar el traslado.
     * @returns {void}
     */
    validarTraslado: function() {
        var errores = 0;

        if (trasladoModel.recaudo === null || trasladoModel.recaudo === undefined) {
            __dom.lanzarAlerta('Debe seleccionar un recaudo de origen', 'Atención');
            errores++;
            return;
        }

        if (trasladoModel.suscriptor === null || trasladoModel.suscriptor === undefined) {
            __dom.lanzarAlerta('Debe seleccionar un suscriptor para asignar el recaudo', 'Atención');
            errores++;
            return;
        }

        var suscripcionesSeleccionadas = $('#tblSuscripcionesTransferir tbody .tblCheck:checked');

        if (trasladoModel.suscripcionesDestino === null || trasladoModel.suscripcionesDestino === undefined || suscripcionesSeleccionadas.length === 0) {
            __dom.lanzarAlerta('Debe seleccionar al menos una suscripción de destino para asignar el recaudo', 'Atención');
            errores++;
            return;
        }

        var sum = 0;
        $.each(suscripcionesSeleccionadas, function(i, susc) {
            var susc = $(susc);
            sum += parseInt(susc.parent().siblings('td[header="thTransferencia"]').find('input.tblTxt').val());
            return;
        });

        var valorRecaudo = parseInt(trasladoModel.recaudo.valor);
        if (sum < valorRecaudo || sum > valorRecaudo) {
            
            that.dialogoActual = $('div#divAlertaTotales');
            $('#spanEsperado').text(trasladoModel.recaudo.valor.toString().toCurrency());  
            $('#spanRecibido').text(sum.toString().toCurrency());
            that.dialogoActual.dialogo({
                heigth: 350,
                modal: true,
                title: __app.mensajes.atencion,
                buttons: {
                    Aceptar: function () {
                        that.dialogoActual.dialog('close');
                    }
                }
            });
            errores++;
            return;
        }

        return !errores > 0;
    },
    /** Captura la respuesta del servidor cuando se hace el traslado del recaudo y limpia el formulari
     * @param {object} data - Respuesta del servidor al grabar traslado
     * @returns {void}
     */
    onTrasladarCompleto: function(data) {
        switch (data.codigoRespuesta) {
            case 1:
                __dom.lanzarAlerta(data.mensajeRespuesta, __app.mensajes.tituloExito);
                that.limpiarFormulario();
            break;
            case -3:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
            break;
        }
        that.dialogoActual.dialog('close');
    },
    /** Muestra cuadro de dialogo con las formas de pago de los detalles del recaudo que se trasladará
     * @returns {void}
     */
    mostrarFormasPago: function() {
        if (trasladoModel.recaudo !== null && !!trasladoModel.recaudo) {
            var contenido = null;
            if (trasladoModel.formasPago !== null && __app.esArreglo(trasladoModel.formasPago)) {
                contenido = $('<div>').addClass('listaSeleccion');
                trasladoModel.formasPago.forEach(function(item, i) {
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
                        position: {my: 'center', at: 'top+40%', of: 'body'},
                        title: 'Formas de Pago',
                        buttons: {
                            Aceptar: function() {
                                that.dialogoActual.dialog('close');
                            }
                        }
                    });
        }
    },
    /** Muestra cuadro de dialogo para la busqueda de suscripción a la que se traslada el recaudo.
     * @returns {void}
     */
    buscarSuscripcion: function() {
        if (!!trasladoModel.recaudo) {
            mostrarFiltroSuscriptores('div#camposBuscarSuscripcion', that.filtrarSuscriptor);
        } else {
            __dom.lanzarAlerta('Debe seleccionar primero un recaudo', __app.mensajes.atencion);
        }
    },
    /** Valida la información del filtro de suscripción y envía la solicitud al servidor
     * @returns {void}
     */
    filtrarSuscriptor: function() {
        var filtro = $('div#camposBuscarSuscripcion');
        var suscripcion = filtro.find('#txtFiltroSus').val().trim();
        var doc = filtro.find('#txtFiltroDoc').val().trim();
        var codAnt = filtro.find('#txtFiltroCodAnt').val().trim();
        if (suscripcion === '' && doc === '' && codAnt === '') {
            filtro.find('#spanMensaje').text(__app.mensajes.camposInvalidosFiltro).show();
        } else {
            var data = {idsuscripcion: suscripcion, documento: doc, codanterior: codAnt};
            trasladoControl.consultarSuscriptor(data, that.consultaSuscripcionCompleto);
        }
    },
    /** Captura la respuesta enviada por el servidor, cuando se consultan las suscripciones.
     * En caso de llegar varias suscripciones posibilita la selección de una.
     * @param  {object} data - El resultado de la petición ajax con las suscripciones que coinciden
     * @returns {void}
     */
    consultaSuscripcionCompleto: function(data) {
        switch (parseInt(data.codigoRespuesta)) {
            case 0:
                that.dialogoActual.find('#spanMensaje').text(__app.mensajes.sinResultados).show();
                break;
            case 1:
                var sus = null;
                if (data.suscripciones.length > 1) {
                    that.dialogoActual.find('div.listaSeleccion').remove();
                    var divSuscriptores = $('<div>').addClass('listaSeleccion');

                    $.each(data.suscripciones, function(s, susc) {
                        var div = $('<div>');
                        var radio = $('<input type="radio">');
                        radio.val(susc.idsuscriptor);
                        radio.attr('id', 'radio_susc_' + s);
                        radio.attr('data-indice', s);
                        radio.attr('name', 'radio_suscripciones');

                        var label = $('<label>').attr('for', 'radio_susc_' + s);
                        label.text(susc.cedula + ' - ' + susc.nombretercero + ' - Suscriptor: ' + susc.idsuscriptor +' - Suscripción: '+susc.idsuscripcion);
                        div.append(radio).append(label);
                        divSuscriptores.append(div);
                    });
                    var btn = $('<button>').text('seleccionar').addClass('btnSimple');
                    btn.on('click', function() {
                        var suscSeleccionada = that.dialogoActual.find('input[name="radio_suscripciones"]:checked');
                        if (suscSeleccionada.length > 0) {
                            sus = trasladoModel.suscriptor = data.suscripciones[parseInt(suscSeleccionada.attr('data-indice'))];
                            that.dialogoActual.find('#spanMensaje').hide();
                            that.dialogoActual.dialog('close');
                            divSuscriptores.remove();
                            trasladoModel.suscripcionesDestino = [];
                            for (var i = 0; i < data.suscripciones.length; i++) {
                                if (data.suscripciones[i].idsuscriptor === sus.idsuscriptor) {
                                    trasladoModel.suscripcionesDestino.push(data.suscripciones[i]);
                                }
                            }
                            that.cargarCabeceraDestino(sus, trasladoModel.suscripcionesDestino);
                        } else {
                            that.dialogoActual.find('#spanMensaje').text(__app.mensajes.seleccionarOpcion).show();
                        }
                    });
                    divSuscriptores.insertAfter(that.dialogoActual.find('#btnBuscar'));
                    divSuscriptores.append(btn);
                } else {
                    sus = trasladoModel.suscriptor = data.suscripciones[0];
                    susc = trasladoModel.suscripcionesDestino = data.suscripciones;
                    that.dialogoActual.find('#spanMensaje').hide();
                    that.dialogoActual.dialog('close');
                    that.cargarCabeceraDestino(sus, susc);
                }
                break;
        }
    },
    /** Carga la cabecera del formulario con los datos de la suscripción destino.
     * @returns {void}
     */
    cargarCabeceraDestino: function(sus, susc) {
        $('#txtIdSuscripcionDestino').val(sus.idsuscriptor);
        $('#txtSuscriptorDestino').val(sus.nombretercero);
        $('#txtDocSuscriptor').val(sus.cedula);
        var tbl1 = fillTable("tblSuscripcionesTransferir", "formatoSuscripcionesTrasnferir", "trasladoModel.suscripcionesDestino", "Suscripciones para Transferencia");
        tbl1.show();
        var selectorInputs = 'tblSuscripcionesTransferir tbody tr td[header="thTransferencia"] input[type="text"]';
        var txtNumericos = __dom.configurarTextoNumerico(selectorInputs);
        txtNumericos.css('width', '95%')
                .attr('disabled', 'disabled')
                .focusout(that.validarValorRecaudo)
                .each(function(i, item) {
                    $(item).attr('data-max', parseInt(trasladoModel.recaudo.valor));
                });
        tbl1.find('#check_general_tblSuscripcionesTransferir_0').off('click').hide();
        tbl1.find('tbody tr td[header="thSeleccion"] input').on('click', that.validarSuscripcionesSeleccionadas);
    },
    /** Valida que la suma del traslado sea equivalente al valor del recaudo inicial
     * @returns {void}
     */
    validarValorRecaudo: function() {
        var _this = $(this);
        var totalActual = 0;
        var checks = $('#tblSuscripcionesTransferir tbody tr td[header="thSeleccion"] input[type="checkbox"]');
        for (var i = 0; i < checks.length; i++) {
            check = $(checks[i]);
            if (check.is(':checked')) {
                var txtValor = check.parent().parent().find('td[header="thTransferencia"] input[type="text"]');
                totalActual += parseInt(txtValor.val());

                if (totalActual > trasladoModel.recaudo.valor) {
                    __dom.lanzarAlerta('El valor de las suscripciones no puede superar el total del recaudo', 'Atencion');
                    var dif = parseInt(txtValor.val()) - (totalActual - trasladoModel.recaudo.valor);
                    txtValor.val(dif);
                    break;
                }
            }
        }
        that.actualizarSumatorias();
    },
    /** Valida las suscripciones seleccionadas. Y actualiza transferencia
     * @returns {void}
     */
    validarSuscripcionesSeleccionadas: function() {
        var check = $(this);
        var trSeleccionada = check.parent().parent();
        var indice = parseInt(trSeleccionada.attr('data-fila'));
        if (check.is(':checked')) {
            trSeleccionada.addClass('selected')
                    .find('td[header="thTransferencia"] input')
                    .val('0')
                    .removeAttr('disabled');
        } else {
            trSeleccionada.removeClass('selected')
                    .find('td[header="thTransferencia"] input')
                    .val('')
                    .attr('disabled', 'disabled');
        }
        that.actualizarSumatorias();
    },
    /** Actualiza la sumatoria de las transferencias.
     * @returns {void}
     */
    actualizarSumatorias: function() {
        var txt = $('#txtTotalDestino');
        var valorTotal = 0;

        $('#tblSuscripcionesTransferir tbody tr.selected').each(function(f, fila) {
            fila = $(fila);
            valorTotal += parseInt(fila.find('td[header="thTransferencia"] input[type="text"]').val());
        });
        txt.val(valorTotal.toString().toCurrency());
    },

    /** Cancela la operación actual
     * @returns {void}
     */
    cancelarFormulario: function() {
        if(!!trasladoModel.suscriptor){
            __dom.lanzarAlerta(
                __app.mensajes.confirmacionCancelacion,
                __app.mensajes.tituloConfirmacion,
                function() {
                    that.limpiarFormulario();
                }
            );
        }
    },

    /** Limpia toda la información del formulario y elimina información del modelo
     * @returns {void}
     */
    limpiarFormulario: function() {
        $('input[type="text"], textarea').val('');
        $('.tabla').html('');
        $('#divResultadoFiltro').empty();
        $('#btnSeleccionarRecaudo').remove();
        trasladoModel = {};
    }

};

//inicia la operación del objeto trasladoVista
trasladoVista.init();
