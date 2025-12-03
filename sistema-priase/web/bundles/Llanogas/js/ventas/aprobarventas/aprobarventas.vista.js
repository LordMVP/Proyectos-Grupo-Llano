/**
 * @fileOverview Archivo de vista para aprobación de ventas
 * @author AppFuture - agomez
 * @requires registroventas.vista.js
 * @requires aprobarventa.control.js
 * @requires aprobarventa.modelo.js
 * @namespace aprobarVista
 * @version 1.0.0
 */

/**
 * Objeto que hace referencia al namespace aprobarVista
 * @type {object}
 */
var that = null;
var aprobarVista = {
    /**
     * Inicializa el programa de aprobación de ventas y asigna listeners a controles.
     * @returns {void}
     */
    init: function () {
        that = aprobarVista;
        self = registroVentasVista;
        that.configurarAutoComplete();
        registroVentasModelo.modelo = 'aprobarVista';
        $("#tabs, #pestanias").tabs();
        $('#btnBuscar').on('click', self.mostrarFiltro);
        $('#btnBuscarVenta').on('click', function () {
            self.validarBusqueda("'P','A','F'");
        });
        $('#btnContrato').on('click', self.imprimirContrato);
        $('#btnVerDetalle').on('click', self.mostrarDialogoTercero);
        $('#btnVerPropiedad').on('click', self.mostrarDialogoPropiedad);
        $('#btnAprobar, #btnEliminar').on('click', that.aprobacionVenta);
        self.appload = new Appload('#txtArchivos', {
            lg: esAppload,
            showDeleteBtn: false,
            showDownloadBtn: true,
            showUploadButton: false,
            showDiscardButton: false,
            showSingleUploadBtn: false,
            showSingleDiscardButton: false
        });
        self.apploadFinanciacion = new Appload('#txtArchivosFinanciacion', {
            showDeleteBtn: false,
            showDownloadBtn: true,
            showUploadButton: false,
            showDiscardButton: false,
            showSingleUploadBtn: false,
            showSingleDiscardButton: false,
            lg: esAppload
        });

        self.appload.control.change();
        self.apploadFinanciacion.control.change();
        $('.appload-input').css({color: '#FFF'});
        __dom.configurarTextoNumerico('txtFiltroIdPropiedad, #txtFiltroIdSuscripcion');
        __dom.configurarCalendario('txtFechaVenta, #txtFiltroFechaInicio, #txtFiltroFechaFin');
        __dom.configurarTextoNumerico('txtFiltroDocumento, #txtFiltroCodigoAnterior, #txtFiltroNumVenta');
        $('.appload-input').hide();
    },
    /**
     * Configura caja de texto para buscar tercerospor medio del autocomplete
     * @returns {void}
     */
    configurarAutoComplete: function () {
        __dom.configurarAutocomplete(
                $('#txtFiltroNombreTercero'), self.sourceAutoCompleteTercero,
                function (event, ui) {
                    registroVentasModelo.idTercero = ui.item.idVal;
                    $('#idTercero').val(ui.item.idVal);
                },
                function () {
                    registroVentasModelo.idTercero = undefined;
                    $('#idTercero').val('');
                }
        );
    },
    /** Captura la respuesta del servidor cuando se consultan las agendas para aprobación de venta
     * @returns {void}
     **/
    consultarAgenda: function () {
        var idventa = registroVentasModelo.informacionVenta.venta.idventa;
        aprobarControl.consultarAgenda({idventa: idventa}, function (data) {
            switch (data.codigoRespuesta) {
                case 0:
                    break;
                case 1:
                    $('#cmbAgenda').empty();
                    aprobarModelo.agenda = data.agendas;
                    __dom.llenarCombo($('#cmbAgenda'), data.agendas, 'idagenda', 'agenda');
                    break;
            }
        });
    },
    /** Obtiene las liquidaciones de la venta con sus respectivos concepto y son visualizados en tablas
     * @param {object} data - Respuesta del servidor con liquidaciones y conceptos
     * @returns {void}
     **/
    onConsultarCompletoVenta: function (data) {
        var estado = data.venta.estado;
        var txtEstado = 'Aprobada';
        if (estado === 'P') {
            txtEstado = 'Pendiente';
            $('#btnAprobar, #btnEliminar').removeAttr('disabled');
        }
        fillTable('tblLiquidaciones', 'formatoLiquidacion', data.venta.liquidaciones, 'Liquidaciones').show();
        $('#txtEstadoVenta').val(txtEstado);
        that.consultarAgenda();
    },
    /** En caso de que se vaya a aprobar la venta requiere la agenda  y la observación
     * @returns {void}
     **/
    aprobacionVenta: function () {
        if (!registroVentasModelo.informacionVenta) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarVenta, __app.mensajes.atencion);
            return;
        }
        var title = '';
        var button = {};
        var agendaoculto = $('#cmbAgenda, [for="cmbAgenda"]').hide();
        var accion = aprobarModelo.accion = $(this).attr('data-id');
        console.log("La accion  -->   "+accion);
        switch (accion) {
            case 'A'://Aprobar
                agendaoculto.show();
                title = 'Aprobar venta';
                var span = $('#pMensajeAprobar').text('');
                button.Aprobar = function () {
                    var observacion = $('#txtObservacionAprobacion').val();

                    if (agendaoculto.val() === '-1') {
                        span.text('Debe seleccionar la agenda de la venta', __app.mensajes.atencion);
                        return;
                    }

                    if (observacion.trim() === '') {
                        span.text(__app.mensajes.escribirObservacion, __app.mensajes.atencion);
                        return;
                    }
                    that.dialogoActual.dialog('close');
                    that.grabarAprobarEliminar();
                };
                break;
            case 'E'://Eliminar
                title = 'Eliminar venta';
                button.Eliminar = function () {
                   
                        /******************* 22/08/2017 *************************/  
                         var idventa = registroVentasModelo.informacionVenta.venta.idventa;
                          
                                   
                                aprobarControl.consultaHistoricos({idventa: idventa}, function (data) {
                                    
                                    switch (data.codigoRespuesta) {
                                        case '0':
                                            
                                             if ($('#txtObservacionAprobacion').val().trim() === '') {
                                                    span.text(__app.mensajes.escribirObservacion, __app.mensajes.atencion);
                                                    return;
                                            }
                                                 
                                                that.dialogoActual.dialog('close');
                                                that.grabarAprobarEliminar();
                    
                                            break;
                                        case '1':
                                            that.dialogoActual.dialog('close');     
                                            __dom.lanzarAlerta(" La venta Seleccionada ya tiene Historicos de Ventas, Ya no es Posible eliminarla", __app.mensajes.atencion);   
                                            break;
                                    }
                                });
                                 
                /********************************************/  
                   
                };
                break;
        }
        button.Cancelar = function () {
            that.limpiarDialogo();
            that.dialogoActual.dialog('close');
        };
        that.dialogoActual = $('#divAgenda').dialogo({
            width: 400,
            modal: true,
            title: title,
            position: {my: "center", at: "top+40%", of: "body"},
            buttons: button
        });


    },
    /** Confirma si el usuario desea aprobar/eliminar una venta
     * @returns {void}
     */
    grabarAprobarEliminar: function () {
        var accion = aprobarModelo.accion;
        var observacion = $('#txtObservacionAprobacion').val();
        var straccion = accion === 'E' ? 'eliminar' : 'aprobar';
        var idventa = registroVentasModelo.informacionVenta.venta.idventa;
        var agenda = aprobarControl.consultarAgendaPorId($('#cmbAgenda').val());
        
        if (registroVentasModelo.venta.estado !== 'P') {
            __dom.lanzarAlerta('La venta no se puede ' + straccion, __app.mensajes.atencion);
            return;
        }
        if ($('#txtMetodoPago').val() === "F" && accion === "A" && !registroVentasModelo.financiacion) {
            __dom.lanzarAlerta('No se encontró financiaciones de la venta, intente nuevamente');
            return;
        }

        $('#divCambioVenta p span').text(straccion);
        that.dialogoActual = $('#divCambioVenta').dialogo({
            modal: true,
            width: 350,
            title: straccion + ' venta',
            buttons: {
                Aceptar: function () {
                    that.dialogoActual.dialog('close');
                    aprobarControl.grabarAprobarEliminar({
                        idventa: idventa,
                        accion: accion,
                        agenda: agenda,
                        observacion: observacion
                    }, that.onAprobarEliminarCompleto);
                    that.limpiarDialogo();
                },
                Cancelar: function () {
                    that.limpiarDialogo();
                    that.dialogoActual.dialog('close');
                }
            }
        });
    },
    /** captura la respuesta del servidor, cuando se aprueba/elimina una consignación
     * @param {object} data - Confirmación de la eliminación-aprobación.
     * @returns {void}
     */
    onAprobarEliminarCompleto: function (data) {
        that.limpiarDialogo();
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                break;
            case 1:
                var fxRecargar = function () {
                    location.reload();
                };
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion, fxRecargar, false, fxRecargar);
        }
    },
    /**
     * Limpia el cuadro de diálogo donde se escriben obseravaciones de la aprobación 
     * @returns {undefined}
     */
    limpiarDialogo: function () {
        var div = $('#divAgenda');
        div.find('textarea').val('');
        div.find('select').val('-1');
    }
};
aprobarVista.init();
