var vista = null;
var formatoActivo = {
    thead: [
        {'id': 'thTipoActivo', 'text': 'TIPO ACTIVO', 'refer': 'tipoactivo', 'type': 'text'},
        {'id': 'thDetalle', 'text': 'DETALLE DEL BIEN', 'refer': 'detalle', 'type': 'text'},
        {'id': 'thDireccion', 'text': 'DIRECCIÓN O PLACA', 'refer': 'placadireccion', 'type': 'text'},
        {'id': 'thCiudad', 'text': 'CIUDAD', 'refer': 'ciudad', 'type': 'text'},
        {'id': 'thValor', 'text': 'VALOR COMERCIAL', 'refer': 'valorcomercial', 'type': 'currency'}
    ]
};
var formatoComentario = {
    thead: [
        {'id': 'thEtapa', 'text': 'Etapa', 'refer': 'etapa', 'type': 'text'},
        {'id': 'thFecha', 'text': 'Fecha', 'refer': 'fecha', 'type': 'text'},
        {'id': 'thMotivo', 'text': 'Motivo', 'refer': 'motivo', 'type': 'text'},
        {'id': 'thComentario', 'text': 'Comentario', 'refer': 'comentario', 'type': 'text'}
    ]
};

var busquedaSolicitudCredito = {
    validarConsulta: function (estado, functionCallback) {
        var span = that.dialogoActual.find('span').text('');
        var txtNumRadicadoBuscar = $('#txtNumRadicadoBuscar').val().trim();
        var txtNombreSolicitanteBuscar = $('#txtNombreSolicitanteBuscar').val().trim();
        var txtDocumentoBuscar = $('#txtDocumentoBuscar').val().trim();
        if (txtNumRadicadoBuscar === '' && txtNombreSolicitanteBuscar === '' && txtDocumentoBuscar === '') {
            span.text('No se encontraron parámetros de búsqueda');
            return;
        }
        if(txtNumRadicadoBuscar !== '' && isNaN(parseInt(txtNumRadicadoBuscar))){
            span.text('El número de radicado debe ser numérico, Intente nuevamente');
            return;
        }
        if (typeof functionCallback === 'function') {
            vista.functionCallback = functionCallback;
        }
        __cnn.ajax({
            url: '../registro/consultar/',
            data: {
                fecha: '',
                estado: estado,
                documento: txtDocumentoBuscar,
                radicado: txtNumRadicadoBuscar,
                nombre: txtNombreSolicitanteBuscar
            },
            completado: vista.onConsultarFormularioCompleto
        });
    },
    onConsultarFormularioCompleto: function (data) {
        that.dialogoActual.find('span').text('');
        that.dialogoActual.find('.btn-seleccionar').remove();
        var divResultadoFiltro = that.dialogoActual.find('#divResultadoFiltro').html('');
        if (data.codigoRespuesta === 1 && data.creditos.length > 0) {
            if (data.creditos.length > 1) {
                $.each(data.creditos, function (i, item) {
                    var label = $('<label>');
                    label.attr({
                        'for': 'rbtnCredito_' + i
                    });
                    var radio = $('<input>').attr({
                        'id': 'rbtnCredito_' + i,
                        'data-indice': i,
                        'type': 'radio',
                        'name': 'rbtnCredito'
                    });
                    var nombre = '  ' + item.primernombre + ' ' + item.primerapellido;
                    var span = $('<span>').text('Radicado: ' + item.numeroradicado + nombre + ' - Fecha: ' + item.fechasolicitud);
                    label.append(radio).append(span);
                    var div = $('<div>').append(label);
                    divResultadoFiltro.append(div);
                });
                var btnSeleccion = $('<button>');
                btnSeleccion.text('Seleccionar');
                btnSeleccion.attr({
                    'id': 'btnSeleccionRecaudo',
                    'class': 'btnSimple btn-seleccionar'
                });
                btnSeleccion.on('click', function () {
                    var seleccionado = divResultadoFiltro.find('input[name="rbtnCredito"]:checked');
                    if (seleccionado.length > 0) {
                        var info = data.creditos[seleccionado.attr('data-indice')];
                        vista.limpiarDialogo();
                        vista.cargarInfoFormulario(info);
                        vista.functionCallback ? vista.functionCallback(info) : '';
                    } else {
                        that.dialogoActual.find('.pMensaje').text(__app.mensajes.seleccionarOpcion);
                    }
                });
                btnSeleccion.insertAfter(divResultadoFiltro);
            } else {
                vista.limpiarDialogo();
                vista.cargarInfoFormulario(data.creditos[0]);
                vista.functionCallback ? vista.functionCallback(data.creditos[0]) : '';
            }
        } else {
            that.dialogoActual.find('span').text('No se encontraron registros');
        }
    },
    cargarInfoFormulario: function (form) {
        var contenedor = $('#contenedor');
        contenedor.find('div[data-reference]').empty();
        that.idcredito = form.numeroradicado;
        that.codigoradicado = form.codigo;
        form.nombreyapellidos = form.primernombre + form.primerapellido;
        
        var apellido = form.primerapellido.split(' ');
        //var anios = parseInt(form.dias / 365);
        var meses = parseInt(form.dias) / 30;
        //form.anosresidencia = anios;
        form.mesesresidencia = meses;
//        form.primernombre = nombre[0];
        //form.segundonombre = nombre[1];
        form.primerapellido = apellido[0];
        form.segundoapellido = apellido.length > 2 ? apellido[1] + ' ' +apellido[2] : apellido[1];
        that.informacionCredito = form;
        for (var i in form) {
            var jcontrol = contenedor.find('*[data-reference="' + i + '"]');
            var control = jcontrol[0];
            if (control) {
                var tagname = control.tagName;
                switch (tagname) {
                    case 'INPUT':
                    case 'TEXTAREA':
                        if (control.type === 'checkbox' || control.type === 'radio') {
                            for (var j = 0; j < form[i].length; j++) {
                                for (var k = 0; k < jcontrol.length; k++) {
                                    if ($(jcontrol[k]).attr('data-value') === form[i][j]) {
                                        jcontrol[k].checked = true;
                                        break;
                                    }
                                }
                            }
                        } else {
                            jcontrol.val(form[i]);
                        }
                        break;
                    case 'SELECT':
                        jcontrol.val(form[i]);
                        break;
                    case 'TABLE':
                        switch (i) {
                            case 'comentarios':
                                if (form[i]) {
                                    fillTable('tblComentarios', 'formatoComentario', form[i], 'Comentarios');
                                    jcontrol.parent().find('span').remove();
                                } else {
                                    jcontrol.parent().append($('<span>').addClass('pMensaje').text('No se encontraron comentarios registrados. '));
                                }
                                break;
                            case 'archivos':
                                var filas = jcontrol.find('tbody tr').hide();
                                for (var a = 0; a < form.archivos.length; a++) {
                                    var btn = filas.find('button[data-refer="' + form.archivos[a].tipo + '"]');
                                    btn.parents('tr:eq(0)').show();
                                    btn.attr('data-url', form.archivos[a].ruta)
                                            .on('click', function (e) {
                                                var puerto = window.location.port;
                                                if (puerto !== '') {
                                                    puerto = ':' + puerto;
                                                }
                                                $('<a>').attr({'href': window.location.protocol + '//' + window.location.hostname + puerto + $(this).attr('data-url'), 'target': '_blank'})[0].click();
                                            });
                                }
                                break;
                            case 'activos':
                                var totActivos = 0;

                                if (form[i].length === 0) {
                                    var div = jcontrol.parent();
                                    $('#tblActivos').empty();
                                    div.find('span').remove();
                                    div.append($('<span>').addClass('pMensaje').text('No se encontraron activos registrados '));
                                } else {
                                    for (var indice = 0; indice < form[i].length; indice++) {
                                        var activo = form[i][indice];
                                        activo.tipoactivo = activo.tipoactivo === 'Nulo' ? 'Otro' : activo.tipoactivo;
                                        totActivos += parseInt(activo.valorcomercial);
                                    }
                                    jcontrol.parent().find('span').remove();
                                    fillTable('tblActivos', 'formatoActivo', form[i], '');
                                }
                                $('#txtTotalActivos, #txtTotalActivos1').val(totActivos.toString().toCurrency());
                                break;
                        }
                        break;
                    case 'DIV':
                        switch (i) {
                            case 'referenciafamiliar':
                                jcontrol.find('span').remove();
                                if(form[i].length === 0){
                                    jcontrol.append($('<span>').addClass('pMensaje').text('No se encontraron referencias familiares de la persona'));
                                }
                                for (var z = 0; z < form.referenciafamiliar.length; z++) {
                                    var info = {tipo: 'familiar', indice: a, div: $('#divReferenciaFamiliares')};
                                    vista.agregarReferencia(form.referenciafamiliar[z], info);
                                }
                                break;
                            case 'referenciapersonal':
                                jcontrol.find('span').remove();
                                if (form[i].length === 0) {
                                    jcontrol.append($('<span>').addClass('pMensaje').text('No se encontraron referencias personales de la persona'));
                                }
                                for (var z = 0; z < form[i].length; z++) {
                                    var info = {tipo: 'personal', indice: a, div: $('#divReferenciaPersonales')};
                                    vista.agregarReferencia(form.referenciapersonal[z], info);
                                }
                                break;
                            case 'actividadeconomica':
                                for (var j = 0; j < form[i].length; j++) {
                                    vista.agregarActividad(form[i][j]);
                                }
                                break;
                            case 'experienciafinanciera':
                                jcontrol.find('span').remove();
                                if (form[i].length === 0) {
                                    jcontrol.append($('<span>').addClass('pMensaje').text('No se encontró información de experiencia financiera'));
                                }
                                for (var j = 0; j < form[i].length; j++) {
                                    var lbl = $('<div class="campo"><label>' + form[i][j].productofinanciero + '</label><input type="text" disabled="disabled" data-reference="cantexperienciafinanciera" data-id="' + form[i][j].idunidad + '" value="'+form[i][j].cantidad+'"></div>');
                                    jcontrol.append(lbl);
                                }
                                break;
                        }
                        break;
                }

            }
        }
        
        var monto = $('#txtMontoSolicitado').val();
        var totPasivo = $('#txtTotalPasivos').val();
        $('#txtMontoSolicitado').val( monto.trim() === '' ? 0 :  monto).toTxtCurrency();
        $('#txtTotalPasivos').val( totPasivo.trim() === '' ? 0 :  totPasivo).toTxtCurrency();
        vista.actualizarGastos();
        vista.actualizarIngresos();
    },
    actualizarIngresos: function () {
        var TotIngresos = 0;
        var controles = $('input:text[data-id="ingreso"]');
        for (var i = 0; i < controles.length; i++) {
            TotIngresos += controles[i].value !== '' ? parseFloat(controles[i].value) : 0;
            controles[i].value = controles[i].value.toCurrency();
        }
        var currency = $('input:text[data-currency="true"]');
        for (var j = 0; j < currency.length; j++) {
            $(currency[j]).attr('data-value', currency[j].value);
            currency[j].value = currency[j].value.toCurrency();
        }

        $('#txtTotalIngresosMes').attr('data-valor', TotIngresos)
                .val(TotIngresos.toString().toCurrency());
    },
    actualizarGastos: function () {
        var TotGastos = 0;
        var controles = $('input:text[data-id="gasto"]');
        for (var i = 0; i < controles.length; i++) {
            TotGastos += controles[i].value !== '' ? parseFloat(controles[i].value) : 0;
            controles[i].value = controles[i].value.toCurrency();
        }
        $('#txtTotalGastos').attr('data-valor', TotGastos)
                .val(TotGastos.toString().toCurrency());
    },
    agregarActividad: function (datos) {
        var div = $('div#divContenidoActividades');
        var data = {
            indice: 1,
            tipocargo: [{nombre: datos.tipocargoempleado}],
            empresas: [{nombretercero: datos.empresaempleado}],
            tipocontrato: [{nombre: datos.tipocontratoempleado}],
            actividadeseconomicas: [{nombre: datos.actividadeconomica}]
        };
        $.get('/achagua/sistema/web/bundles/Libranza/template/tplActividadEconomica.html', function (_template) {
            template = $(_template).filter('#tplActividadEconomica').html();
            var info = $(Mustache.to_html(template, data));
            div.append(info);
            var divPrincipal = div.find('div.divContenedorColapsable:last');
            divPrincipal.find('a.fa-times').remove();
            divPrincipal.find('select, input:text').attr('disabled', 'disabled');
            divPrincipal.find('.tituloColapsable span').text(data.nombreactividad);
            __dom.configurarColapsable(divPrincipal);
            for (var j in datos) {
                var jcontrol = divPrincipal.find('*[data-reference-actividad="' + j + '"]');
                if (jcontrol.length === 0) {
                    continue;
                }
                if (jcontrol[0].tagName === 'INPUT') {
                    jcontrol.val(datos[j]);
                    if (jcontrol.attr('data-currency')) {
                        jcontrol.val(datos[j].toCurrency());
                    }
                }
            }

        });
    },
    agregarReferencia: function (informacion, infotpl) {
        var data = {tiporeferencia: infotpl.tipo, 'indice': infotpl.indice};
        $.get('/achagua/sistema/web/bundles/Libranza/template/tplReferencias.html', function (_template) {
            template = $(_template).filter('#tplReferencias').html();
            var info = $(Mustache.to_html(template, data));
            $(infotpl.div).append(info);
            var nombre = informacion['nombrereferencia'];
            var apellido = informacion['apellidoreferencia'];
            var divPrincipal = $(infotpl.div).find('div.divContenedorColapsable:last');
            divPrincipal.find('a.fa-times').remove();
            divPrincipal.find('span[data-id="spanNombre"]').text(nombre);
            divPrincipal.find('span[data-id="spanApellido"]').text(apellido);
            divPrincipal.find('select, input:text').attr('disabled', 'disabled');
            if(infotpl.tipo === 'personal'){
                divPrincipal.find('[id^="cmbParentescoRef_"]').parent().remove();
            }
            
            
            for (var i in informacion) {
                var jcontrol = divPrincipal.find('*[data-reference-referencia="' + i + infotpl.tipo + '"]');
                if (jcontrol.length === 0) {
                    continue;
                }
                if (jcontrol[0].tagName === 'SELECT' && informacion[i]) {
                    jcontrol.append($('<option>').text(informacion[i]));
                    continue;
                }
                jcontrol.val(informacion[i]);
            }
            __dom.configurarColapsable(divPrincipal);
        });
    },
    limpiarDialogo: function () {
        var div = that.dialogoActual;
        div.find('input:text').val('');
        div.find('span').text('');
        if (div.hasClass('ui-dialog-content')) {
            div.dialog('close');
        }
    }
};
vista = busquedaSolicitudCredito;
