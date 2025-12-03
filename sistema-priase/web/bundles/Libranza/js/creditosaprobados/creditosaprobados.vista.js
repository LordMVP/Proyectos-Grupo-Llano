var that = null;
var formatoTabla = {
    thead: [
        {'id': 'thSelect', 'text': 'Seleccionar', 'refer': 'radicado', 'type': 'check'},
        {'id': 'thRadicado', 'text': 'No. Radicado', 'sort': false, 'refer': 'radicado', 'type': 'text'},
        {'id': 'thDocumento', 'text': 'Documento', 'refer': 'documento', 'type': 'text'},
        {'id': 'thFecha', 'text': 'Fecha', 'sort': false, 'refer': 'fecha', 'type': 'text'},
        {'id': 'thNombre', 'text': 'Nombre', 'sort': false, 'refer': 'nombre', 'type': 'text'},
        {'id': 'thValor', 'text': 'Valor', 'sort': false, 'refer': 'valor', 'type': 'currency'},
        {'id': 'thInteres', 'text': 'Interés', 'sort': false, 'refer': 'interes', 'type': 'text'},
        {'id': 'thPlazo', 'text': 'Plazo (meses)', 'refer': 'plazo', 'type': 'text'},
        {'id': 'thSeguro', 'text': 'Seguro', 'refer': 'seguro', 'type': 'text'},
        {'id': 'thEstudioCredito', 'text': 'Estudio Credito', 'refer': 'estudiocredito', 'type': 'currency'},
        {'id': 'thCuota', 'text': 'Cuota', 'refer': 'cuota', 'type': 'currency'}
    ]
};

var formatoFinanciacion = {
    thead: [
        {'id': 'thSuscripción', 'text': 'Id. Suscripción', 'refer': 'idsuscripcion', 'type': 'text'},
        {'id': 'thRadicado', 'text': 'No. Radicado', 'sort': false, 'refer': 'idcredito', 'type': 'text'},
        {'id': 'thFinanciacion', 'text': 'Id. Financiación', 'refer': 'idfinanciacion', 'type': 'text'}
    ]
};


var creditosControl = {
    consultarCreditos: function (completado) {
        __cnn.ajax({
            url: 'obtener/',
            completado: completado
        });
    },
    aprobarSinDesembolsarCreditos: function (data, success) {
        __cnn.ajax({
            url: 'aprobar_sin_desembolsar/',
            data: data,
            completado: success
        });
    },
    desembolsarCreditos: function (data, success) {
        __cnn.ajax({
            url: 'aprobar/',
            data: data,
            completado: success
        });
    }
};
var creditosVista = {
    init: function () {
        that = this;
        creditosControl.consultarCreditos(that.onConsultarCompleto);
        $('#btnDesembolsar').on('click', that.desembolsarCreditos);
        $('#btnAprobar').on('click', that.abrirDialogoAprobar);
    },
    abrirDialogoAprobar: function () {
        var chk = $('#tblSolicitudes tbody td input:checked');
        if (chk.length > 0) {
            __dom.lanzarAlerta('Se aprobarán ' + chk.length + ' créditos sin desembolsar el dinero ¿Desea continuar?', 'Advertencia', function () {
                var div = $('#divAprobarSolicitud');
                div.find('span').text('');
                div.dialog({
                    modal: true,
                    width: 350,
                    'title': 'Confirmación',
                    buttons: {
                        'Aprobar': that.aprobarSolicitud,
                        'Cancelar': function () {
                            $('#divAprobarSolicitud').dialog('close');
                        }
                    }
                });
            }, true);
        } else {
            __dom.lanzarAlerta('No ha seleccionado créditos para desembolsar', __app.mensajes.atencion);
        }
    },
    aprobarSolicitud: function () {
        var div = $('#divAprobarSolicitud');
        var motivo = $('#cmbMotivoAprobar').val();
        var comentario = $('#txtObservacion').val();
        if (!motivo || motivo === '-1' || comentario.trim() === '') {
            div.find('span').text('El motivo y la observación son obligatorias');
            return;
        }

        var creditos = [];
        var chk = $('tbody td input:checked');
        for (var j = 0; j < chk.length; j++) {
            var obj = {idcredito: chk.val()};
            creditos.push(obj);
        }
        var dataEnviar = {
            motivo: motivo,
            comentario: comentario,
            creditos: creditos, estado: 884
        };
        creditosControl.aprobarSinDesembolsarCreditos(dataEnviar, that.onDesembolsarCompleto);
    },
    onConsultarCompleto: function (data) {
        if (data.codigoRespuesta === 1 && data.datos.length > 0) {
            fillTable('tblSolicitudes', 'formatoTabla', data.datos, 'Créditos Aprobados');
        } else {
            $('#spanMensaje').text('No se encontraron créditos para desembolsar');
        }
    },
    desembolsarCreditos: function () {
        var chk = $('#tblSolicitudes tbody td input:checked');
        if (chk.length > 0) {
            var div = $('#divCicloDesembolsar');
            div.find('span').text(chk.length);
            div.dialog({
                modal: true,
                width: 550,
                title: __app.mensajes.atencion,
                buttons: {
                    'Continuar': that.validarDesembolsar,
                    'Cancelar': function () {
                        div.dialog('close');
                    }
                }
            });
        } else {
            __dom.lanzarAlerta('No ha seleccionado créditos para desembolsar', __app.mensajes.atencion);
        }
    },
    validarDesembolsar: function () {
        var div = $('#divCicloDesembolsar');
        var cmb = div.find('#cmbCiclo').val();
        var p = div.find('p.pMensaje').text('');
        var chk = $('#tblSolicitudes tbody td input:checked');

        if (!cmb || cmb === '-1') {
            p.text('Debe seleccionar el ciclo para continuar');
            return;
        }
        var creditos = [];
        div.dialog('close');
        for (var j = 0; j < chk.length; j++) {
            var obj = {idcredito: chk[j].value};
            creditos.push(obj);
        }
        var infoEnviar = {creditos: creditos, idciclo: cmb};
        creditosControl.desembolsarCreditos(infoEnviar, that.onDesembolsarCompleto);
    },
    onDesembolsarCompleto: function (data) {
        var fxRecargar = function () {
            location.reload();
        };

        var divDialog = $('#divDialogoFinanciaciones');
        divDialog.find('p').text(data.mensaje);
        fillTable('tblFinanciacionesGeneradas', 'formatoFinanciacion', data.datos, 'Financiaciones generadas');
        divDialog.dialog({
            modal: true,
            close: fxRecargar,
            width: 550,
            title: 'Atención',
            buttons: {
                'Aceptar': fxRecargar
            }
        });
    }
};

creditosVista.init();
