var that = null;
var formatoCalificaciones = {
    thead: [
        {'id': 'thVariable', 'text': 'Variable', 'refer': 'nombrevariable', 'type': 'text'},
        {'id': 'thValor', 'text': 'Valor', 'refer': 'valor', 'type': 'text'},
        {'id': 'thValorCalificacion', 'text': 'Calificación', 'refer': 'calificacion', 'type': 'text'}
    ]
};
var aprobacionVista = {
    dialogoActual: null,
    idcredito: null,
    init: function () {
        that = aprobacionVista;
        that.configurarAutocomplete();
        $('#btnBuscar').on('click', that.mostrarDialogoBuscar);
        $('#btnAprobar').on('click', that.confirmarAprobar);
        $('#btnRechazar').on('click', that.confirmarRechazar);
        $('#btnCancelar').on('click', that.recargarPagina);
        $('#btnNegar').on('click', that.confirmarNegar);
        $('#btnBuscarSolicitud').on('click', that.consultarInformacion);
        $('#divTabs').tabs();
        __dom.configurarCalendario('txtFechaNacimiento, #txtFechaSolicitud, #fechaIngreso');
        __dom.configurarTextoNumerico('txtNumRadicadoBuscar, #txtDocumentoBuscar');
        __dom.configurarColapsable('.divContenedorColapsable');

        $('*[data-reference]').attr('disabled', 'disabled');
    },
    configurarAutocomplete: function () {
        __dom.configurarAutocomplete(
                $('input#txtNombreSolicitanteBuscar'),
                that.sourceAutoComplete,
                function (event, ui) {
                    $('input#txtNombreSolicitanteBuscar').attr('data-id', ui.item ? ui.item.idVal : '');
                },
                function () {
                    $('input#txtNombreSolicitanteBuscar').removeAttr('data-id');
                }
        );
    },
    sourceAutoComplete: function (request, response) {
        that.request = request;
        that.response = response;
        var datos = {};
        if (request.term.trim() !== "") {
            datos.nombre = request.term.trim();
            datos.estado = 838;
            aprobacionControl.consultarTerceros(datos, that.mostrarResultado);
        }
    },
    mostrarResultado: function (data) {
        if (data.codigoRespuesta === 1) {
            var result = [];
            $.each(data.datos, function (i, item) {
                result.push({
                    label: item.nombrecompleto,
                    value: item.nombrecompleto,
                    idVal: item.documento
                });
            });
            that.response(result);
        }
    },
    consultarInformacion: function () {
        vista.validarConsulta(838, function (credito) {
            __cnn.ajax({
                url: 'calificacion/',
                data: {idcredito: that.idcredito},
                completado: that.onCargarCalificacion
            });
        });
    },
    onCargarCalificacion: function (data) {
        if (data.codigoRespuesta === 1 && data.calificacion.length > 0) {
            var valorTotal = 0;
            for (var i = 0; i < data.calificacion.length; i++) {
                var calificacion = data.calificacion[i];
                var valorCalificado = parseFloat(calificacion.calificacion).toFixed(1);
                calificacion.calificacion = valorCalificado;
                valorTotal += parseFloat(valorCalificado);
            }
            $('#txtTotalCalificacion').val(valorTotal);
            fillTable('tblCalificaciones', 'formatoCalificaciones', data.calificacion, 'Calificación del crédito');
        }
    },
    mostrarDialogoBuscar: function () {
        that.dialogoActual = $('#divBuscarSolicitud').dialog({
            modal: true,
            width: 850,
            buttons: {
                'Cancelar': function () {
                    that.dialogoActual.dialog('close');
                }
            }
        });
    },
    confirmarRechazar: function () {
        if (that.idcredito) {
            $('#divRechazarSolicitud').dialog({
                modal: true,
                width: 350,
                'title': 'Rechazar solicitud de crédito',
                buttons: {
                    'Rechazar': that.rechazarSolicitud,
                    'Cancelar': function () {
                        $('#divRechazarSolicitud').dialog('close');
                    }
                }
            });
        } else {
            __dom.lanzarAlerta('Debe seleccionar una solicitud de crédito para ejecutar esta tarea', 'Atención');
        }
    },
    confirmarNegar: function () {
        if (that.idcredito) {
            $('#divNegarSolicitud').dialog({
                modal: true,
                width: 350,
                'title': 'Negar solicitud de crédito',
                buttons: {
                    'Negar': that.negarSolicitud,
                    'Cancelar': function () {
                        $('#divNegarSolicitud').dialog('close');
                    }
                }
            });
        } else {
            __dom.lanzarAlerta('Debe seleccionar una solicitud de crédito para ejecutar esta tarea', 'Atención');
        }
    },
    confirmarAprobar: function () {
        if (that.idcredito) {
            $('#divAprobarSolicitud').dialog({
                modal: true,
                width: 350,
                'title': 'Aprobar la solicitd de crédito',
                buttons: {
                    'Aprobar': that.aprobarSolicitud,
                    'Cancelar': function () {
                        $('#divAprobarSolicitud').dialog('close');
                    }
                }
            });
        } else {
            __dom.lanzarAlerta('Debe seleccionar una solicitud de crédito para ejecutar esta tarea', 'Atención');
        }
    },
    aprobarSolicitud: function () {
        if (that.idcredito) {
            var div = $('#divAprobarSolicitud');
            var motivo = div.find('#cmbMotivo').val();
            var observacion = div.find('#txtObservacion').val();

            if (motivo !== '-1' && motivo && observacion.trim() !== '') {
                var data = {
                    estado: 839,
                    motivo: motivo,
                    comentario: observacion,
                    idcredito: that.idcredito
                };
                aprobacionControl.aprobarSolicitud(data, that.onAprobarCompleto);
            } else {
                div.find('span').text('El motivo y la observación son obligatorios');
            }

        } else {
            __dom.lanzarAlerta('Debe seleccionar una solicitud de crédito para ejecutar esta tarea', 'Atención');
        }
    },
    rechazarSolicitud: function () {
        if (that.idcredito) {
            var div = $('#divRechazarSolicitud');
            var motivo = div.find('#cmbMotivoRechazar').val();
            var observacion = div.find('#txtObservacion2').val();

            if (motivo !== '-1' && motivo && observacion.trim() !== '') {
                var data = {
                    estado: 837, motivo: motivo,
                    idcredito: that.idcredito, comentario: observacion
                };
                aprobacionControl.aprobarSolicitud(data, that.onAprobarCompleto);
            }
        } else {
            __dom.lanzarAlerta('Debe seleccionar una solicitud de crédito para ejecutar esta tarea', 'Atención');
        }
    },
    negarSolicitud: function () {
        if (that.idcredito) {
            var div = $('#divNegarSolicitud');
            var motivo = div.find('#cmbMotivo2').val();
            var observacion = div.find('#txtObservacionNegar').val();

            if (motivo !== '-1' && motivo && observacion.trim() !== '') {
                var data = {
                    estado: '850',
                    idcredito: that.idcredito,
                    motivo: motivo, comentario: observacion
                };
                aprobacionControl.aprobarSolicitud(data, that.onAprobarCompleto);
            }
        } else {
            __dom.lanzarAlerta('Debe seleccionar una solicitud de crédito para ejecutar esta tarea', 'Atención');
        }
    },
    onAprobarCompleto: function (data) {
        var fxRecargar = function () {
            location.reload();
        };
        __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion,
                fxRecargar, null, fxRecargar);
    },
    recargarPagina: function () {
        if (that.idcredito) {
            __dom.lanzarAlerta('Se borrará toda la información cargada ¿Desea continuar?', 'Atención', function () {
                location.reload();
            }, true);
        }
    }
};
aprobacionVista.init();
