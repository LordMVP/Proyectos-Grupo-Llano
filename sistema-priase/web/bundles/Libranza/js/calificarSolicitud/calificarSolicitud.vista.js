var that = null;
var calificarVista = {
    init: function () {
        that = calificarVista;
        $('#divTabs').tabs();
        //$('#aPrincipal').click();
        that.configurarAutocomplete();
        $('#btnGuardarCambio').on('click', that.guardarCambio);
        $('#btnCalcular').on('click', _that.calcularAmortizacion);
        $('#btnBuscar').on('click', that.abrirBuscar);
        $('#btnBuscarSolicitud').on('click', that.cargarInformacion);
        $('#btnCalificar').on('click', that.calificar);
        $('#btnAprobar').on('click', that.aprobarCredito);
        $('#btnRechazar').on('click', that.rechazarSolicitud);
        $('#btnCancelar').on('click', that.cancelarSolicitud);
        $('#btnSimulador').on('click', that.abrirSimulador);
        $('#cmbLiquidacion').on('change', that.cambiarTasaInteres);
        $('#btnCancelar').on('click', that.cancelarCalificacion);
        __dom.configurarTextoNumerico('txtSeguro', false, true).on('blur', that.validarPorcentaje);
        __dom.configurarTextoNumerico('txtMontoSolicitado, #txtNumRadicadoBuscar, #txtDocumentoBuscar');
        $('#txtMontoSolicitado').textoNumerico(false, false, true, '$', true).on('blur', that.validarMontoSolicitado);
        
        //that.onConsultarCalificaciones(simulacionInfo);
        __dom.configurarColapsable('.divContenedorColapsable');
        $('*[data-reference]').attr('disabled', 'disabled');
    },
    cambiarTasaInteres: function () {
        var _this = $(this);
        if (!_this.val() || _this.val() === '-1') {
            return;
        }
        var opcion = _this.find('option:selected');
        var interes = opcion.attr('data-interes');
        var tipocuota = opcion.attr('tipo-cuota');
        var interesiva = opcion.attr('data-iva');
        if (interes) {
            $('#txtIntereses').val(interes)
                    .attr('data-iva', interesiva)
                    .attr('tipo-cuota', tipocuota);
        } else {
            $('#txtIntereses').val('');
            __dom.lanzarAlerta('La liquidación no tiene tasa de interés, intente nuevamente', __app.mensajes.atencion);
        }

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
            datos.estado = 837;
            calificarControl.consultarTerceros(datos, that.mostrarResultado);
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
    guardarCambio: function () {
        if (that.credito || calificarModel.credito) {
            var monto = $('#txtMontoSolicitado').attr('data-valor');
            var plazo = $('#txtPlazo').val();
            if (monto.trim() === '' || plazo === '-1' || !plazo) {
                __dom.lanzarAlerta('El monto y el plazo del producto son obligatorios');
                return;
            }
            var info = calificarModel.credito;
            var montoCredito = parseInt(info.montosolicitado);
            if (parseInt(monto) !== montoCredito || parseInt(plazo) !== parseInt(info.plazo)) {
                var montoFormateado = monto.replace('$','').replace(',','');
                var dataEnviar = {
                    plazo: plazo,
                    monto: parseInt(montoFormateado),
                    idcredito: calificarModel.credito.numeroradicado
                };
                calificarControl.actualizarSolicitud(dataEnviar, that.onActualizarSolicitud);
            }
        } else {
            __dom.lanzarAlerta('Debe seleccionar una solicitud de crédito para ejecutar esta tarea', 'Atención');
        }
    },
    onActualizarSolicitud: function (data) {
        if (data.codigoRespuesta === 1) {
            __dom.lanzarAlerta(data.mensaje, __app.mensajes.atención);
            that.consultarCalificaciones(calificarModel.credito);
            calificarModel.calificado = false;
        }
    },
    calificar: function () {
        if (that.idcredito || calificarModel.credito) {
            var info = [];
            var liquidacion = $('#cmbLiquidacion');
            var trs = $('#tblCalificacion tbody tr');
            if (liquidacion.val() === '-1' || !liquidacion.val()) {
                __dom.lanzarAlerta('Debe seleccionar una liquidación', __app.mensajes.atencion);
                return;
            }

            for (var index = 0; index < trs.length; index++) {
                calificarModel.calificaciones[index].valor = $(trs[index]).find('input:text').val();
                calificarModel.calificaciones[index].idvalor = $(trs[index]).find('input:text').val();
                calificarModel.calificaciones[index].tasainteres = liquidacion.find('option:selected').attr('data-interes');
                info.push(calificarModel.calificaciones[index]);
            }
            if (info.length === 0) {
                __dom.lanzarAlerta('No se encontraron variables de calificación, intente nuevamente', __app.mensajes.atencion);
                return;
            }
            var dataEnviar = {parametros: info, idcredito: calificarModel.credito.numeroradicado};
            calificarControl.calificarSolicitud(dataEnviar, that.onCalificarCompleto);
        }
    },
    onCalificarCompleto: function (data) {
        if (data.codigoRespuesta === 1) {
            calificarModel.calificado = true;
            that.onConsultarCalificaciones(data);
        } else {
            calificarModel.calificado = false;
        }
    },
    cargarInformacion: function () {
        $('#aCalificacion').click();
        calificarModel.calificado = false;
        vista.validarConsulta(837, that.consultarCalificaciones);
        
    },
    consultarCalificaciones: function (credito) {
        if (that.idcredito) {
            $('#cmbLiquidacion').val(-1);
            calificarModel.credito = credito;
            var monto = $('#txtMontoSolicitado');
            $('#txtPlazo').removeAttr('disabled');
            $('#txtSeguro').val('0.035');
            $('#txtEstudioCredito').val('0');
            var montoactual = monto.attr('data-valor') ? monto.attr('data-valor') : monto.attr('title');
            monto.removeAttr('disabled').attr('data-valor', montoactual);
            var data = {
                idcredito: that.idcredito , 
                monto_credito: montoactual
            };
            calificarControl.consultarCalificaciones(data, that.onConsultarCalificaciones);
        }
    },
    abrirBuscar: function () {
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
    onConsultarCalificaciones: function (data) {
        if (data.codigoRespuesta === 1) {
            calificarModel.calificaciones = data.datos;
            if ($('#txtEstudioCredito').val() == 0 )
            {
                $('#txtEstudioCredito').val(data.datos1.estudio_credito);
                $('#txtEstudioCredito').removeAttr('disabled');
            }
            var tbl = fillTable('tblCalificacion', 'formatoCalificaciones', data.datos, '');
            var txt = tbl.find('tr td[header="thValorCalificacion"] input[type="text"]').on('blur', that.actualizarSumatoriaCalificacion);
            __dom.configurarTextoNumerico(txt);
            that.actualizarSumatoriaCalificacion();
        }
    },
    actualizarSumatoriaCalificacion: function () {
        var valor = 0;
        var trs = $('#tblCalificacion tbody tr');
        for (var j = 0; j < trs.length; j++) {
            var input = $(trs[j]).find('td').eq(2);
            valor += !isNaN(parseFloat(input.text())) ? parseFloat(input.text()) : 0;
        }
        $('#txtTotalCalificacion').val(valor.toFixed(1));
    },
    abrirSimulador: function () {
        if (that.idcredito) {
            var interes = $('#txtIntereses');
            if ($('#cmbLiquidacion').val() !== '-1' || interes.val().trim() !== '') {
                if (!(__dom.validarNumeroDecimal(interes.val()))) {
                    __dom.lanzarAlertaOk('Debe seleccionar una liquidación con tasa de interés', __app.mensajes.atencion);
                    return;
                }
                var filtro = $('div#divSimulador');
                var plazo = $('#txtPlazo').val();
                var monto = parseInt($('#txtMontoSolicitado').attr('data-valor'));
                filtro.find('#txtNumeroCuotas').val(plazo).on('blur', that.validarCuotas);
                filtro.find('#txtCapitalInicial').val(monto);
                that.dialogoActual = filtro.dialog({
                    modal: true,
                    width: 700,
                    position: {my: "center", at: "top+30", of: "body"},
                    title: 'Simulador de crédito',
                    buttons: {
                        Aceptar: function () {
                            that.dialogoActual.find('input:text').not(interes).val('');
                            that.dialogoActual.find('#divTbl').empty();
                            that.dialogoActual.dialog('close');
                        }
                    }
                });
            } else {
                __dom.lanzarAlerta('Debe seleccionar una liquidación ', __app.mensajes.atencion);
            }
        }
    },
    validarPorcentaje: function () {
        var _this = $(this);
        if (isNaN(parseInt(_this.val())) || parseInt(_this.val()) > 100) {
            _this.val((parseInt(_this.val()) > 100) ? 100 : '').focus().select();
        }
    },
    validarCuotas: function () {
        var _this = $(this);
        if (isNaN(parseInt(_this.val())) || parseInt(_this.val()) < 1) {
            _this.val(1).focus().select();
        }
    },
    /**
     * Valida que el moento solicitado sea mayor a 0
     * @returns {void}
     */
    validarMontoSolicitado: function () {
        var _this = $(this);
        var monto = isNaN(parseInt(_this.attr('data-valor'))) ? parseInt(_this.val()) : parseInt(_this.attr('data-valor'));
        if (isNaN(monto) || monto < 1) {
            _this.focus().select().val(1);
        }
    },
    cancelarCalificacion: function () {
        if (that.credito) {
            __dom.lanzarAlerta('Se borrará toda la información cargada ¿Desea continuar?', __app.mensajes.atencion,
                    function () {
                        window.location();
                    }, true);
        }
    },
    agregarValorVariable: function (value, td, obj) {
        var txt = $('<input>')
                .val(value)
                .addClass('tblTxt')
                .attr('type', 'text');
        if (obj.tipo === 'F') {
            txt.attr('disabled', 'disabled');
        }
        td.css({'width': '10%'});
        td.append(txt);
    },
    aprobarCredito: function () {
        var cmb = $('#cmbLiquidacion');
        var txtPorcentaje = $('#txtSeguro');
        var txtEstudio = $('#txtEstudioCredito');

        if (!calificarModel.credito) {
            __dom.lanzarAlerta('Debe seleccionar una solicitud de crédito para ejecutar esta tarea.', 'Atención');
            return;
        }
        if (!cmb.val() || cmb.val() === '-1') {
            __dom.lanzarAlerta('Debe seleccionar la liquidación', 'Atención', function () {
                cmb.focus();
            });
            return;
        }
        if (txtEstudio.val() === '') {
            __dom.lanzarAlerta('Debe digitar el valor del estudio de crédito', 'Atención', function () {
                txtEstudio.focus();
            });
            return;
        }
        if (txtPorcentaje.val() === '' || isNaN(parseFloat(txtPorcentaje.val()))) {
            __dom.lanzarAlerta('Debe digitar el porcentaje del seguro', 'Atención', function () {
                txtPorcentaje.focus();
            });
            return;
        }


        if (!calificarModel.calificado) {
            var ingreso = 0;
            for (var i = 0; i < calificarModel.calificaciones.length; i++) {
                ingreso += calificarModel.calificaciones[i].tipo === 'I' ? 1 : 0;
            }
            if (ingreso > 0) {
                __dom.lanzarAlerta('Debe calificar las variables para aprobar la solicitud.', 'Atención');
                return;
            }
        }

        $('#divAprobarSolicitud').dialog({
            modal: true,
            width: 350,
            'title': 'Aprobar crédito calificado',
            buttons: {
                'Aprobar': that.validarSolicitud,
                'Cancelar': function () {
                    $('#divAprobarSolicitud').dialog('close');
                }
            }
        });
    },
    validarSolicitud: function () {
        var div = $('#divAprobarSolicitud');
        var motivo = div.find('#cmbMotivo').val();
        var observacion = div.find('#txtObservacion').val();

        if (motivo !== '-1' && motivo && observacion.trim() !== '') {
            var trs = $('#tblCalificacion tbody tr');
            for (var index = 0; index < trs.length; index++) {
                calificarModel.calificaciones[index].valor = $(trs[index]).find('input:text').val();
            }
            var data = {
                idliquidacion: $('#cmbLiquidacion').val(),
                idcredito: that.idcredito,
                variables: calificarModel.calificaciones,
                idmotivo: motivo,
                comentario: observacion,
                estado: 838,
                seguro: $('#txtSeguro').val(),
                estudiocredito: $('#txtEstudioCredito').val()
            };
            calificarControl.aprobarSolicitud(data, that.onAprobarCompleto);
        } else {
            div.find('span').text('El motivo y la observación son obligatorios');
        }
    },
    rechazarSolicitud: function () {
        if (that.idcredito) {
            $('#divRechazarSolicitud').dialog({
                modal: true,
                width: 350,
                'title': 'Rechazar solicitud de crédito',
                buttons: {
                    'Rechazar': that.validarRechazarSolicitud,
                    'Cancelar': function () {
                        $('#divRechazarSolicitud').dialog('close');
                    }
                }
            });
        } else {
            __dom.lanzarAlerta('Debe seleccionar una solicitud de crédito para ejecutar esta tarea', 'Atención');
        }
    },
    validarRechazarSolicitud: function () {
        var div = $('#divRechazarSolicitud');
        var motivo = div.find('#cmbMotivoRechazo').val();
        var observacion = div.find('#txtObservacionRechazo').val();

        if (motivo !== '-1' && motivo && observacion.trim() !== '') {
            var data = {
                estado: 836,
                idmotivo: motivo,
                comentario: observacion,
                idcredito: that.idcredito
            };
            calificarControl.aprobarSolicitud(data, that.onAprobarCompleto);
        } else {
            div.find('span').text('El motivo y la observación son obligatorios');
        }
    },
    cancelarSolicitud: function () {
        if (that.idcredito) {
            __dom.lanzarAlerta('Se borrará toda la información cargada ¿Desea continuar?', __app.mensajes.atecion, function () {
                window.location.reload();
            }, true);
        }
    },
    onAprobarCompleto: function (data) {
        var fx = function () {
            window.location.reload();
        };
        __dom.lanzarAlerta(data.mensaje, __app.mensajes.atecion, fx, null, fx);
    }
};
calificarVista.init();
