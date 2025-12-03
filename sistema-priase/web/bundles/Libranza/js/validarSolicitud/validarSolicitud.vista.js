var that = null;
var validacionModel = {};
var validacionVista = {
    dialogoActual: null,
    idcredito: null,
    init: function () {
        $('#divTabs').tabs();
        that = validacionVista;
        that.configurarAutocomplete();
        $('#btnImprimir').on('click', that.imprimirFormulario);
        $('#btnBuscar').on('click', that.mostrarDialogoBuscar);
        $('#btnValidar').on('click', that.confirmarValidar);
        $('#btnBuscarSolicitud').on('click', function () {
            vista.validarConsulta(836);
        });
        $('*[data-reference]').attr('disabled', 'disabled');
        __dom.configurarColapsable('.divContenedorColapsable');
        $('#btnRechazar').on('click', that.confirmarRechazarSolicitud);
        __dom.configurarTextoNumerico('txtNumRadicadoBuscar, #txtDocumentoBuscar');
    },
    imprimirFormulario: function(){
        if (!that.idcredito) {
            __dom.lanzarAlerta('Debe seleccionar una solicitud de crédito para ejecutar esta tarea', 'Atención');
            return;
        }
        that.onImprimirCompleto();
    },
    onImprimirCompleto: function () {
        var link = $('#linkExportar');
        link.attr('href', 'http://10.43.51.171:8180/libranza/archivo/exportararchivopdf?solicitud='+that.codigoradicado);
        link[0].click();
    },
    configurarAutocomplete: function(){
        __dom.configurarAutocomplete(
            $('input#txtNombreSolicitanteBuscar'), 
            that.sourceAutoComplete,
            function(event, ui) {
                $('input#txtNombreSolicitanteBuscar').attr('data-id',ui.item ? ui.item.idVal : '');
             },
             function(){
                $('input#txtNombreSolicitanteBuscar').removeAttr('data-id');
             }
        );
    },
    sourceAutoComplete: function(request, response) {
        that.request = request;
        that.response = response;
        var datos = {};
        if (request.term.trim() !== "") {
            datos.nombre = request.term.trim();
            datos.estado = 836;
            validacionControl.consultarTerceros(datos, that.mostrarResultado);
        }
    },
    mostrarResultado: function(data) {
        if (data.codigoRespuesta === 1) {
            var result = [];
            $.each(data.datos, function(i, item) {
                result.push({
                    label: item.nombrecompleto,
                    value: item.nombrecompleto,
                    idVal: item.documento
                });
            });
            that.response(result);
        }
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
    confirmarValidar: function () {
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
                estado: 'A',
                idmotivo: motivo,
                comentario: observacion,
                idcredito: that.idcredito
            };
            validacionControl.validarSolicitud(data, that.onAprobarCompleto);
        } else {
            div.find('span').text('El motivo y la observación son obligatorios');
        }
    },
    confirmarRechazarSolicitud: function () {
        if (that.idcredito) {
            $('#divRechazarSolicitud').dialog({
                modal: true,
                width: 350,
                'title': 'Confirmación',
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
    rechazarSolicitud: function () {
        var div = $('#divRechazarSolicitud');
        var motivo = div.find('#cmbMotivoRechazo').val();
        var observacion = div.find('#txtObservacionRechazo').val();

        if (motivo !== '-1' && motivo && observacion.trim() !== '') {
            var data = {
                idmotivo: motivo,
                comentario: observacion,
                idcredito: that.idcredito
            };
            validacionControl.validarSolicitud(data, that.onAprobarCompleto);
        } else {
            div.find('span').text('El motivo y la observación son obligatorios');
        }
    },
    onAprobarCompleto: function (data) {
        var fx = function () {
            window.location.reload();
        };
        __dom.lanzarAlerta(data.mensaje, __app.mensajes.atecion, fx, null, fx);
    }
};
validacionVista.init();



