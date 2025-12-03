/**
 * @fileOverview Archivo de vista y control de resumen de solicitudes de crédito
 * @author AppFuture
 * @version 1.0.0
 */
/**
 * Objeto que hace referencia al namespace resumenVista
 * @type {Object}
 */
var that = null;
/**
 * Objeto con lenguaje de apptable
 * @type {object}
 */
var lenguajeTabla = {
    linesPerPage: 'Líneas por página:',
    totalItems: 'Cantidad de Registros: #',
    currentPage: 'Página _# de #_ '
};
/**
 * Objeto con información de las columnas de la tabla de créditos buscados
 * @type {Array}
 */
var columnasCredito = [
    {'headers': 'thRadicado', 'text': 'No. Radicado', 'sortType': 'number', 'data': 'radicado', 'type': 'text'},
    {'headers': 'thEtapa', 'text': 'Etapa', 'data': 'etapa', 'type': 'text'},
    {'headers': 'thFecha', 'text': 'Fecha', 'data': 'fecha', 'type': 'text'},
    {'headers': 'thDocumento', 'text': 'Documento', 'data': 'documento', 'type': 'text'},
    {'headers': 'thNombre', 'text': 'Nombre', 'data': 'nombre', 'type': 'text'},
    {'headers': 'thValor', 'text': 'Valor', 'sortType': 'number', 'data': 'valor', 'type': 'currency'},
    {'headers': 'thPlazo', 'text': 'Plazo (meses)', 'sortType': 'number', 'data': 'plazo', 'type': 'text'},
    {'headers': 'thComentario', 'text': 'Comentarios', 'data': 'radicado', 'type': 'button'/*, 'class': 'tblBtn'*/},
    {'headers': 'thDetalles', 'text': 'Detalles', 'data': 'radicado', 'type': 'button'/*, 'class': 'tblBtn'*/}
];
var columnasCreditoFinanaciacion = [
    {'headers': 'thRadicado', 'text': 'No. Radicado', 'sortType': 'number', 'data': 'radicado', 'type': 'text'},
    {'headers': 'thEtapa', 'text': 'Etapa', 'data': 'etapa', 'type': 'text'},
    {'headers': 'thFecha', 'text': 'Fecha', 'data': 'fecha', 'type': 'text'},
    {'headers': 'thDocumento', 'text': 'Documento', 'data': 'documento', 'type': 'text'},
    {'headers': 'thNombre', 'text': 'Nombre', 'data': 'nombre', 'type': 'text'},
    {'headers': 'thValor', 'text': 'Valor', 'sortType': 'number', 'data': 'valor', 'type': 'currency'},
    {'headers': 'thPlazo', 'text': 'Plazo (meses)', 'sortType': 'number', 'data': 'plazo', 'type': 'text'},
    {'headers': 'thSuscripcion', 'text': 'Id. Suscripcion', 'sortType': 'number', 'data': 'idsuscripcion', 'type': 'text'},
    {'headers': 'thFinanciacion', 'text': 'Id. Financiacion', 'sortType': 'number', 'data': 'idfinanciacion', 'type': 'text'},
    {'headers': 'thEmpresa', 'text': 'Empresa', 'data': 'empresaempleado', 'type': 'text'},
    {'headers': 'thComentario', 'text': 'Comentarios', 'data': 'radicado', 'type': 'button'/*, 'class': 'tblBtn'*/},
    {'headers': 'thDetalles', 'text': 'Detalles', 'data': 'radicado', 'type': 'button'/*, 'class': 'tblBtn'*/}
];
var formatoComentario = {
    thead: [
        {'id': 'thEtapa', 'text': 'Etapa', 'refer': 'etapa', 'type': 'text'},
        {'id': 'thFecha', 'text': 'Fecha', 'refer': 'fecha', 'type': 'text'},
        {'id': 'thMotivo', 'text': 'Motivo', 'refer': 'motivo', 'type': 'text'},
        {'id': 'thComentario', 'text': 'Comentario', 'refer': 'comentario', 'type': 'text'}
    ]
};
var resumenModel = {};
/** @namespace */
var resumenVista = {
    /**
     * Función que inicializa la página para consultar resumen de créditos
     * @return {void}
     */
    init: function () {
        that = resumenVista;
        that.configurarAutocomplete();
        $('#btnBuscar').on('click', that.abrirBusqueda);
        resumenControl.consultarEtapas(that.cargarEtapas);
        $('#btnBuscarCreditos').on('click', that.validarBusqueda);
        $('#txtFechaInicio').on('blur', that.configurarFechaFin);
        __dom.configurarColapsable('.divContenedorColapsable');
        __dom.configurarCalendario('txtFechaInicio, #txtFechaFin');
        __dom.configurarTextoNumerico('txtMontoInicio, #txtMontoFin');
    },
    /**
     * Obtiene la respuesta del servidor cuando se consultan productos financieros y etapas de crédito
     * @param {object} data - Respuesta del servidor con listas de etapas y productos
     * @returns {void}
     */
    cargarEtapas: function (data) {
        if (data.codigoRespuesta === 1) {
            data.etapas.push({idunidad: 'T', nombre: 'Ver todos'});
            __dom.llenarCombo($('#cmbEtapa'), data.etapas, 'idunidad', 'nombre');
            __dom.llenarCombo($('#cmbProducto'), data.productos, 'idunidad', 'nombre');
            __dom.llenarCombo($('#cmbEmpresas'), data.empresas, 'idtercero', 'nombretercero');
        }
    },
    configurarAutocomplete: function () {
        __dom.configurarAutocomplete(
                $('input#txtNombreSolicitante'),
                that.sourceAutoComplete,
                function (event, ui) {
                    $('input#txtNombreSolicitante').attr('data-id', ui.item ? ui.item.idVal : '');
                },
                function () {
                    $('input#txtNombreSolicitante').removeAttr('data-id');
                }
        );
    },
    sourceAutoComplete: function (request, response) {
        that.request = request;
        that.response = response;
        var datos = {};
        if (request.term.trim() !== "") {
            datos.nombre = request.term.trim();
            resumenControl.consultarTerceros(datos, that.mostrarResultado);
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
    /**
     * Válida que la fecha final sea mayor a la fecha inicial
     * @returns {void}
     */
    configurarFechaFin: function () {
        var _this = $(this);
        var date = new Date(_this.val());
        //$('#txtFechaFin').datepicker('option', 'minDate', date); 
    },
    /**
     * Abre cuadro de diálogo para hacer la consulta de las solicitudes de crédito
     * @return {void}
     */
    abrirBusqueda: function () {
        $('#divFiltroCreditos').dialog({
            modal: true,
            width: '850',
            title: 'Buscar créditos y solicitudes',
            buttons: {
                'Cancelar': function () {
                    $('#divFiltroCreditos').dialog('close');
                }
            }
        });
    },
    /**
     * Válida la información del filtro en caso de que sea correcta
     * hace petición ajax para consultar los créditos.
     * @return {void}
     */
    validarBusqueda: function () {
        var div = $('#divFiltroCreditos');
        var span = div.find('span').text('');
        var etapa = div.find('#cmbEtapa').val();
        var montoFin = div.find('#txtMontoFin');
        var producto = div.find('#cmbProducto').val();
        var empresas = div.find('#cmbEmpresas').val();
        var fechaFin = div.find('#txtFechaFin').val();
        var fechaInicio = div.find('#txtFechaInicio').val();
        var montoInicio = div.find('#txtMontoInicio').val();
        var solicitante = div.find('#txtDocuemntoSol').val();        
        if(solicitante == '')
        {
            var solicitante = div.find('#txtNombreSolicitante').attr('data-id');
        }
        if (etapa === '-1' && producto === '-1' && empresas === '-1' && fechaInicio.trim() === '' && fechaFin.trim() === '' && montoInicio.trim() === '' && solicitante.trim() === '') {
            span.text('No se encontraron filtros de búsqueda');
            return;
        }
        if (parseInt(montoFin.val()) < parseInt(montoInicio)) {
            montoFin.val(montoInicio).blur().select();
            span.text('El monto final debe ser mayor al monto inicial');
            return;
        }
        if (fechaFin.trim() !== '' && fechaInicio.trim() === '') {
            span.text('Debe seleccionar una fecha de inicio');
            return;
        }
        var dataEnviar = {
            fechafin: fechaFin,
            montofin: montoFin.val(),
            fechainicio: fechaInicio,
            montoinicio: montoInicio,
            nombresolicitante: '',
            documentosolicitante: solicitante,
            etapa: etapa !== '-1' ? etapa : null,
            producto: producto !== '-1' ? producto : null,
            empresa: empresas !== '-1' ? empresas : null
        };
        resumenControl.consultarCredito({parametros: dataEnviar}, that.onConsultarCompleto);
    },
    /**
     * Captura la respuesta del servidor cuando se han consultado los créditos
     * @param {array} data - Respuesta del servidor con información de los créditos consultados
     * @return {void}
     */
    onConsultarCompleto: function (data) {
        var div = $('#divFiltroCreditos');
        if (data.codigoRespuesta === 1 && data.datos.length > 0) {
            div.dialog('close');
            var formato = columnasCredito;

            for (var index = 0; index < data.datos.length; index++) {
                if (data.datos[index].idetapa === 840) {
                    formato = columnasCreditoFinanaciacion;
                    break;
                }
            }
            var config = {
                title: 'Créditos ',
                columns: formato,
                pagination: true,
                onRowComplete: that.renderFila,
                linesPageRange: [10, 20, 30, 50, 100],
                lg: lenguajeTabla
            };
            resumenModel.creditos = data.datos;
            if (that.apptable) {
                that.apptable.destroy();
            }
            that.apptable = new Apptable('#tblSolicitudes', config, resumenModel.creditos);
        } else {
            div.find('span').text('No se encontraron resultados. Intente nuevamente');
        }
    },
    renderFila: function (item, tr) {
        tr.find('td[headers="thDetalles"] button').addClass('tblBtn').on('click', that.consultarDetalles);
        tr.find('td[headers="thComentario"] button').addClass('tblBtn').on('click', that.consultarComentario);

        if (tr.find('td[headers="thFinanciacion"]').length > 0) {
            if (!item.idfinanciacion) {
                tr.find('td[headers="thFinanciacion"]').text('-');
            }
            if (!item.idsuscripcion) {
                tr.find('td[headers="thSuscripcion"]').text('-');
            }
        }
    },
    consultarComentario: function () {
        var tr = $(this).parents('tr')[0];
        var item = that.apptable.getObjectById(tr.id);
        resumenControl.consultarComentarios({idcredito: item.radicado}, that.consultarComentariosCompleto);
    },
    consultarComentariosCompleto: function (data) {
        if (data.codigoRespuesta === 1) {
            fillTable('tblComentarios', 'formatoComentario', data.datos, 'Comentarios del crédito #' + data.radicado);
            $('#divComentarios').dialog({
                modal: true,
                width: 850,
                title: 'Comentarios del crédito',
                buttons: {
                    'Aceptar': function () {
                        $('#divComentarios').dialog('close');
                    }
                }
            });
        } else {
            __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
        }
    },
    consultarDetalles: function () {
        var tr = $(this).parents('tr')[0];
        var item = that.apptable.getObjectById(tr.id);
        $('#divDetallesSolicitud .divColapsable a.fa-minus').click();
        var a = $('<a>').attr({
            'href': 'informacion/?i=' + item.radicado + '&e=' + item.idetapa,
            'target': '_blank'
        });
        a.click();
        resumenControl.consultarInformacion({parametros: {idcredito: item.radicado, estado: item.idetapa}}, that.consultarInformacionCompleto);
    },
    consultarInformacionCompleto: function (data) {
        if (data.codigoRespuesta === 1) {
            $('#linkExportar')[0].click();
            /*var div = $('#divDetallesSolicitud');
             div.dialog({
             modal: true,
             width: 950,
             title: 'Detalles del crédito',
             buttons: {
             'Aceptar': function () {
             div.dialog('close');
             }
             }
             });
             that.cargarInfoFormulario(data.datos);*/
        } else {
            __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
        }
    },
    cargarInfoFormulario: function (form) {
        var contenedor = $('#divDetallesSolicitud');
        contenedor.find('div[data-reference]').empty();
        for (var i in form) {
            var jcontrol = contenedor.find('*[data-reference="' + i + '"]');
            var control = jcontrol[0];
            if (control) {
                if (control.tagName === 'INPUT' || control.tagName === 'TEXTAREA' || control.tagName === 'SELECT') {
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
                }
            }
        }
        that.actualizarGastos();
        that.actualizarIngresos();
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
        var activos = $('#txtTotalActivos').val();
        $('#txtTotalActivos').attr('data-valor', activos).val(activos.toString().toCurrency());
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
    }

};
resumenVista.init();
