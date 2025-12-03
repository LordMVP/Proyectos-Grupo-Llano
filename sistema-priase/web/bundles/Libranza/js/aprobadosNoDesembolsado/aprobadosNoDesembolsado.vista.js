var that = null;
var aprobadosModel = {};
var aprobadosControl = {
    aprobarCredito: function(data, success){
        __cnn.ajax({
           url: 'aprobar/',
           data: data, 
           completado: success
        });
    }
};
var aprobadosVista = {
    dialogoActual: null,
    idcredito: null,
    init: function () {
        that = aprobadosVista;
        $('#divTabs').tabs();
        $('#btnBuscar').on('click', that.mostrarDialogoBuscar);
        $('*[data-reference]').attr('disabled', 'disabled');
        $('#btnAprobar').on('click', that.confirmarAprobar);
        $('#btnBuscarSolicitud').on('click', function () {
            vista.validarConsulta(884);
        });
    },
    mostrarDialogoBuscar: function () {
        that.dialogoActual = $('#divBuscarSolicitud');
        
        that.dialogoActual.find('span').text('');
        that.dialogoActual.find('.btn-seleccionar').remove();
        that.dialogoActual.find('#divResultadoFiltro').html('');
        
        that.dialogoActual.dialog({
            modal: true,
            width: 850,
            buttons: {
                'Cancelar': function () {
                    that.dialogoActual.dialog('close');
                }
            }
        });
    },
    confirmarAprobar: function () {
        if (that.idcredito) {
            $('#divAprobarSolicitud').dialog({
                modal: true,
                width: 350,
                'title': 'Confirmación',
                buttons: {
                    'Aprobar': that.validarSolicitud,
                    'Cancelar': function () {
                        $('#divAprobarSolicitud').dialog('close');
                    }
                }
            });
        } else {
            __dom.lanzarAlerta('Debe seleccionar una solicitud de crédito para ejecutar esta tarea', 'Atención');
        }
    },
    validarSolicitud: function () {
        var div = $('#divAprobarSolicitud');
        var motivo = div.find('#cmbMotivo').val();
        var observacion = div.find('#txtObservacion').val();

        if (motivo !== '-1' && motivo && observacion.trim() !== '') {
            var data = {
                estado: 839,
                idmotivo: motivo,
                comentario: observacion,
                idcredito: that.idcredito
            };
            aprobadosControl.aprobarCredito(data, that.onAprobarCompleto);
        } else {
            div.find('span').text('El motivo y la observación son obligatorios');
        }
    },
    onAprobarCompleto: function (data) {
        var fxRecargar = function () {
            location.reload();
        };
        __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion,
                fxRecargar, null, fxRecargar);
    }
};
aprobadosVista.init();