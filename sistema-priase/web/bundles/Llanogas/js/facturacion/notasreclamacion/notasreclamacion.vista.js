/**
 * @fileOverview Archivo de vista y control de notas automáticas
 * @author angelicaGomez
 * @requires notasautomaticas.control.js
 * @requires notasautomaticas.modelo.js
 * @version 1.0.0
 */
/**
 * Objeto que hace referencia al namespace notasVista
 * @type {Object}
 */
var that = null;
/** @namespace */
var notasrVista = {
    /** Hace referencia al último dialogo abierto en la aplicación
     * @type {object}
     */
    dialogoActual: null,
    /** Hace referencia al diálogo del procesamiento de facturas
     * @type {object}
     */
    dialogoProceso: null,
    /** Inicializa el programa de notas automáticas, y asigna listeners a los controles
     * @returns {void}
     */
    init: function () {
        that = this;
        that.configurarAutocomplete();
        $('#divPestanias').tabs();
        $('#btnBuscar').on('click', that.filtrarSuscripciones);
        $('#btnCancelar').on('click', that.confirmarCancelar);
        $('#btnProcesar').on('click', that.validarProcesar);
        $('#btnAplicarNotas').on('click', that.aplicarNotas);
        $('#btnBuscarSuscripcion').on('click', that.mostrarFiltroSuscripcion);
        $('#btnBuscarNotasSuscripcion').on('click', that.BuscarNotasReclamacioSuscripcion);
        $('#btnAgregarFiltroAdicional').on('click', that.mostrarAgregarFiltro);
        $('#btnAgregarFiltro').on('click', that.agregarFiltro);
        
        window.onunload = notasrControl.eliminarSesion;
        window.onbeforeunload = notasrControl.eliminarSesion;
        $('.link-archivo').on('click', that.validarFacturasProcesadas);
        
        __dom.configurarTextoNumerico('txtFiltroSus, #txtFiltroCodAnt');
        $('#btnAplicarNotas').attr('disabled', true);
        notasrControl.consultarMotivos(that.onConsultarMotivosCompleto);      
    },
    
    /** Muestra cuadro de diálogo para buscar una suscripción
     * @returns {void}
    **/
    mostrarFiltroSuscripcion: function () {
        that.dialogoActual = $('#camposBuscarSuscripcion').dialogo({
            modal: true,
            width: 850,
            title: 'Buscar una suscripción'
        });
    },
    /** Muestra cuadro de diálogo para buscar una suscripción
     * @returns {void}
     **/
    
    /** Valida información para consultar la suscripción, en caso de ser correcta
     * hace petición ajax para consultar suscripciones
     * @returns {void}
     **/
    filtrarSuscripciones: function () {
        var contenedor = $('#camposBuscarSuscripcion');
        contenedor.find('#spanMensaje').hide().text('');
        contenedor.find('.listaSeleccion').remove();
        var suscripcion = contenedor.find('#txtFiltroSus').val().trim();
        var documento = contenedor.find('#txtFiltroDoc').val().trim();
        var codanterior = contenedor.find('#txtFiltroCodAnt').val().trim();
        var municipio = contenedor.find('#txtFiltroMunicipo').attr('data-id');
        var propiedad = contenedor.find('#txtIdPropiedad').val().trim();
        if (municipio === '' || $('#txtFiltroMunicipo').val().trim() === '') {
            contenedor.find('#spanMensaje').show().text(__app.mensajes.seleccionarMunicipio);
            contenedor.find('.listaSeleccion').remove();
            return;
        }
        if (suscripcion === '' && documento === '' && codanterior === '' && propiedad === '') {
            contenedor.find('#spanMensaje').show().text(__app.mensajes.camposInvalidosFiltro);
            contenedor.find('.listaSeleccion').remove();
            return;
        }
        var data = {
            cedula: documento,
            propiedad: propiedad,
            idmunicipio: municipio,
            idsuscripcion: suscripcion,
            codigoanterior: codanterior
        };
        notasrControl.consultarSuscripciones(data, that.onFiltrarSuscripcionCompleto);
    },
    /** Captura la respuesta del servidor cuando se consultan las suscripciones
     * en caso de que haya más de una suscripción posibilita la selección de alguna
     * @param {object} data - Respuesta del servidor con suscripciones con coincidencias
     * @returns {void}
     **/     
    onFiltrarSuscripcionCompleto: function (data) {
        that.reiniciarTablaValores();
        that.limpiarFormulario();
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(__app.mensajes.sinResultados, __app.mensajes.atencion);
                break;
            case 1:
                var sus = null;
                if (data.suscripciones.length > 1) {
                    that.dialogoActual.find('div.listaSeleccion').remove();
                    var divSuscripciones = $('<div>').addClass('listaSeleccion');
                    $.each(data.suscripciones, function (s, susc) {
                        var div = $('<div>');
                        var radio = $('<input type="radio">');
                        radio.val(susc.idsuscripcion);
                        radio.attr('id', 'radio_susc_' + s);
                        radio.attr('data-indice', s);
                        radio.attr('name', 'radio_suscripciones');
                        var label = $('<label>').attr('for', 'radio_susc_' + s);
                        label.text('Tercero: ' + susc.nombretercero + ' - ' + susc.cedula
                                + ' - Suscripción: ' + susc.idsuscripcion
                                + ' - Cód Anterior: ' + susc.codigoanterior);
                        div.append(radio).append(label);
                        divSuscripciones.append(div);
                    });
                    var btn = $('<button>').text('Seleccionar').addClass('btnSimple');
                    btn.on('click', function () {
                        var suscSeleccionada = that.dialogoActual.find('input[name="radio_suscripciones"]:checked');
                        if (suscSeleccionada.length > 0) {
                            sus = notasrModel.suscripcion = data.suscripciones[parseInt(suscSeleccionada.attr('data-indice'))];
                            that.dialogoActual.find('#spanMensaje').hide();
                            that.dialogoActual.dialog('close');
                            divSuscripciones.remove();
                            that.cargarCabecera(sus);
                        } else {
                            that.dialogoActual.find('#spanMensaje').text(__app.mensajes.seleccionarOpcion).show();
                        }
                    });
                    divSuscripciones.insertAfter(that.dialogoActual.find('#spanMensaje'));
                    divSuscripciones.append(btn);
                } else {
                    sus = notasrModel.suscripcion = data.suscripciones[0];
                    that.dialogoActual.find('#spanMensaje').hide();
                    that.dialogoActual.dialog('close');
                    that.cargarCabecera(sus);
                }
                break;
        }
    },
    /** Muestra la información de la suscripción elegida en el filtro 
     * @param {object} sus - Información de la suscripción seleccionada
     * @returns {void}
     **/    
    cargarCabecera: function (sus) {
        notasrModel.filtroFactura = [];
        $('#txtSuscripcion').val(sus.idsuscripcion);
        $('#txtDocumento').val(sus.cedula);
        $('#txtNombre').val(sus.nombretercero);
        $('#txtCodAnterior').val(sus.codigoanterior);
        $('#txtSuscMunicipo').val(sus.municipio);
        $('#txtSuscBarrio').val(sus.barrio);
        $('#txtDireccion').val(sus.direccion);
        $('#txtTelefono').val(sus.telefonofijo);
        $('#txtCelular').val(sus.telefonocelular);
        $('#txtSuscTipoUso').val(sus.tipousosuscripcion);
    },    
     /**
     * Asigna funcionalidad a cajas de texto para autocompletar con sus respectivas propiedades y recursos.
     * @returns {void}
     */
    configurarAutocomplete: function () {
        //Consulta municipios para filtrar una suscripción
        __dom.configurarAutocomplete(
                '#txtFiltroMunicipo', that.sourceAutoComplete,
                function (event, ui) {
                    notasrModel.municipioFiltro = ui.item.idVal;
                    $('input#txtFiltroMunicipo').attr('data-id', ui.item.idVal);
                },
                function () {
                    notasrModel.municipioFiltro = undefined;
                    $('input#txtFiltroMunicipo').removeAttr('data-id');
                }
        );
        __dom.configurarAutocomplete(
                '#txtMunicipio', that.sourceAutoComplete,
                function (event, ui) {
                    notasrModel.municipio = ui.item.idVal;
                    $('input#txtMunicipio').attr('data-id', ui.item.idVal);
                    $('#txtBarrio').attr('disabled', false);
                },
                function () {
                    notasrModel.municipio = undefined;
                    $('input#txtMunicipio').removeAttr('data-id');
                    $('#txtBarrio').attr('disabled', true);
                }
        );
        __dom.configurarAutocomplete(
                '#txtBarrio', that.sourceAutoCompleteBarrio,
                function (event, ui) {
                    notasrModel.barrio = ui.item.idVal;
                    $('input#txtBarrio').attr('data-id', ui.item.idVal);
                },
                function (event, ui) {
                    notasrModel.barrio = undefined;
                    $('input#txtBarrio').removeAttr('data-id');
                }
        );
    },
    /** Realiza la petición AJAX para consultar municipos de los autocomplete
     * @returns {void}
     */
    sourceAutoComplete: function (request, response) {
        that.request = request;
        that.response = response;
        var datos = {};
        if (request.term.trim() !== '') {
            datos.municipio = request.term;
            notasrControl.consultarMunicipio(datos, that.mostrarResultado);
        }
    },
    /** Muestra el resultado de la consulta de los municipos en la lista desplegable.
     * @returns {void}
     */
    mostrarResultado: function (data) {
        if (data.codigoRespuesta === 1) {
            var result = [];
            $.each(data.municipios, function (i, item) {
                result.push({
                    label: item.municipio,
                    value: item.municipio,
                    idVal: item.idmunicipio,
                });
            });
            that.response(result);
        }
    },
    /** Realiza la petición AJAX para consultar los barrios del autocomplete
     * @returns {void}
     */
    
     /** Busca las Notas en Reclamacion de la sucripcion Seleccionadae
     * @returns {void}
     */    
    BuscarNotasReclamacioSuscripcion: function () {    
        if (!notasrModel.suscripcion) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarSuscripcion, __app.mensajes.atencion);
            return;
        }
        idsuscripcion = notasrModel.suscripcion.idsuscripcion;
        var data = { idsuscripcion: idsuscripcion };
        notasrControl.consultarNotasR({parametros: [data]}, that.onConsultarNotasReclamacionCompleto);

    },
    
    /** Busca las Notas en Reclamacion de la sucripcion Seleccionadae
    * @returns {void}
    */
   
    /**Captura la respuesta del servidor cuando se consultan las Notas en Reclamacion de una suscripcion 
     * En caso de que si hayan Notas en Reclamacion se visualizará en tablas paginadas y hace petición ajax
     * para consultar tipos de documentos de las facturas filtradas
     * @param {object} data - Respuesta del servidor con la Notas en Reclamaiccon de una suscripcion 
     * @returns {void}
     **/
    onConsultarNotasReclamacionCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                $('#divFacturas').hide();
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                break;
            case 1:
                if (that.dialogoActual) {
                    that.dialogoActual.dialog('close');
                }
               // that.consultarConcepto($('#cmbLiquidacionSuscripcion'));

                for (var f = 0; f < data.facturas.length; f++) {
                    var fact = data.facturas[f];
                    fact.verificable = false;
                }
                if (!data.filtro) {
                    notasrModel.facturas = data.facturas;
                } else {
                    notasrModel.facturasFiltradas = data.facturas;
                }
                var table = $('#tblFacturas').empty();
                var tabla = table.dataTable({
                    "data": data.facturas,
                    "columns": formatoFacturas,
                    "fnRowCallback": function (nRow, aData) {
                        var fila = $(nRow).attr('data-id', aData['idfactura']);
                        $(nRow).attr('data-value', aData['idsuscripcion']);
                        that.rowCallback(nRow, aData);
                    },
                    "language": {
                        url: "/achagua/sistema/web/bundles/Llanogas/js/facturacion/Spanish.json"
                    },
                    "destroy": true,
                    initComplete: that.agregarCheck
                });
                $('#divFacturas').show();
                break;
        }
    },
    /** Agrega checkbox en la cabecera de la tabla de facturas
     * @returns {void}
     **/
    agregarCheck: function () {
        var label = $('<label>').text('Selecc.').attr('for', 'checkSeleccion').css('display', 'inline-block');
        var check = $('<input>').attr({'type': 'checkbox', 'id': 'checkSeleccion'});
        check.on('click', that.seleccionarTodas);
        $($('#tblFacturas thead tr th')[0]).text('')
                .append(check, label)
                .attr('aria-label', '')
                .css({'text-align': 'left', 'padding-left': '8px'});
    },
    /** Agrega controles con respectivo listener a tabla de facturas filtradas
     * @param nRow - Fila en la que se agregará el control
     * @param aData - Información asignada a la fila actual
     * @returns {void}
    **/
    rowCallback: function (nRow, aData) {
        nRow = $(nRow);
        var factura = aData['idfactura'];
        var seleccionado = (aData.seleccionado) ? aData.seleccionado : false;
        var procesado = aData.procesado;
        var atributos = {'data-id': factura};

        var label = $('<label>').text('Selecc.')
                .attr('for', 'checkSeleccion' + factura);
        var check = $('<input>').attr({
            'checked': seleccionado, // $(nRow).hasClass('selected'),
            'data-id': factura,
            'type': 'checkbox',
            'id': 'checkSeleccion' + factura
        });

        var btn = $('<button>').text('Detalles')
                .addClass('tblBtn')
                .attr(atributos)
                .attr('id', 'btnDetalle' + factura);

        var verficar = $('<button>').text('Verificar')
                .addClass('tblBtn')
                .attr(atributos)
                .attr('id', 'btnVerificar' + factura);

        if (seleccionado) {
            nRow.addClass('selected');
            btn.removeAttr('disabled');
            verficar.attr('disabled', !aData.verificable);
        } else {
            nRow.removeClass('selected');
            btn.attr('disabled', 'disabled');
            verficar.attr('disabled', 'disabled');
        }

        if (procesado) {
            verficar.removeAttr('disabled');
        } else {
            verficar.attr('disabled', 'disabled');
        }

        check.off('click').on('click', that.seleccionarNotaR);
        btn.on('click', that.consultarDetalleNotaR);
        verficar.on('click', that.verificarNotaR);

        var tds = $(nRow).find('td');
        $(tds[11]).empty().append(btn);
        $(tds[12]).empty().append(verficar);
        $($(nRow).find(':nth-child(1)')[0]).empty().append(check, label);
    }, 
    
    
    /** Selecciona y habilita controles de una facturas
     * @returns {void}
    **/
    seleccionarNotaR: function () {
        var _this = $(this);
        var fila = _this.parent().parent();
        var idFactura = _this.attr('data-id');
        var factura = notasrControl.obtenerFacturaPorId(idFactura);
        if (_this.prop('checked')) {
            factura.seleccionado = true;
            fila.addClass('selected');
            fila.find('button[id^="btnDetalle"]').removeAttr('disabled');
            notasrControl.agregarFacturaSeleccionada(idFactura);

            var btnAplicarNotas = $('#btnAplicarNotas');
            if (!btnAplicarNotas.is(':disabled')) {
                btnAplicarNotas.attr('disabled', 'disabled');
            }

        } else {
            factura.seleccionado = false;
            fila.removeClass('selected');
            fila.find('button').attr('disabled', 'disabled');
            $('#checkSeleccion').removeProp('checked');
            notasrControl.removerFacturaSeleccionadaPorId(idFactura);             
            var btnAplicarNotas = $('#btnAplicarNotas');
            if (!btnAplicarNotas.is(':disabled')) {
                btnAplicarNotas.attr('disabled', 'disabled');
            }
            for (var i = 0; i < notasrModel.facturasSeleccionadas.length; i++) {
                var idFactura = parseInt(notasrModel.facturasSeleccionadas[i]);
                var factura = notasrControl.obtenerFacturaPorId(idFactura);
                if (factura) {
                    factura.procesado = false;
                }
            }
            $('#tblFacturas').DataTable().draw();
        }
    },
    /** Selecciona todas la filas de la tabla de facturas
     * @returns {void}
     **/
    seleccionarTodas: function () {
        var check = $(this);
        var seleccionado = check.is(':checked');
        notasrModel.facturasSeleccionadas = [];
        for (var i = 0; i < notasrModel.facturas.length; i++) {
            notasrModel.facturas[i].seleccionado = seleccionado;
            if (seleccionado) {
                notasrModel.facturasSeleccionadas.push(notasrModel.facturas[i].idfactura);
            }
        }
        $('#tblFacturas').DataTable().draw();
        //$('#tblFacturas tbody tr td input:checkbox').removeProp('checked');
    },
    
    /** Muestra cuadro de diálogo para agregar filtros de facturas
     * @returns {void}
     **/
    mostrarAgregarFiltro: function () {
        notasrControl.consultarConceptosAutocomplete(function (data) {
            that.mostrarResultadoConcepto(data);

            that.dialogoActual = $('#divFiltroAdicionalFacturas').dialogo({
                resizable: false,
                width: 600,
                modal: true,
                position: {my: "center", at: "top+90", of: "body"},
                title: 'Filtro adicional de Notas en Reclamación',
                buttons: {
                    "Aceptar": function () {
                        that.aplicarFiltroNotasR();
                    },
                    'Cancelar': function () {
                        if (notasrModel.filtroFactura.length > 0) {
                            __dom.lanzarAlerta(
                                    'Esto removerá los filtros por concepto ¿Desea eliminarlos y continuar?',
                                    __app.mensajes.atencion,
                                    function () {
                                        that.BuscarNotasReclamacioSuscripcion();
                                        notasrModel.filtroFactura = [];
                                        $('#tblFiltros').empty();
                                        that.dialogoActual.dialog('close');
                                    },
                                    function () {
                                        return;
                                    }
                            );
                        } else {
                            that.dialogoActual.dialog('close');
                        }
                    }
                }
            });

        });


    },
    /** Muestra el resultado de la consulta de los conceptos en la lista desplegable.
     * @returns {void}
     */
    mostrarResultadoConcepto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                $('#spanFiltroFactura').val(data.mensaje);
                break;
            case 1:
                __dom.llenarCombo('#cmbFiltroConceptos', data.conceptos, 'idconcepto', 'concepto');
                break
        }
    },
    
    /** Valida los campos obligatorios para un filtro adicional, que una combinación de filtro aún no exista,
     * en caso de todo ser correcto agrega el filtro adicional
     * @returns {void}
     **/
    agregarFiltro: function () {
        var cmbFiltroConcepto = $('#cmbFiltroConceptos');
        var idConcepto = cmbFiltroConcepto.val();
        var strConcepto = cmbFiltroConcepto.find('option:selected').text();

        if (cmbFiltroConcepto.val().trim() === '-1') {
            __dom.lanzarAlerta('Debe seleccionar un concepto', __app.mensajes.atencion);
            return;
        }

        if (notasrControl.buscarConceptoFiltro(idConcepto)) {
            __dom.lanzarAlerta('El concepto ' + strConcepto + ' ya está en el filtro.', __app.mensajes.atencion);
            return;
        }

        notasrModel.filtroFactura.push({
            idConcepto: idConcepto,
            valorconcepto: '',
            concepto: strConcepto
        });

        cmbFiltroConcepto.val('-1');
        that.llenarTablaFiltro();
    },
    
      /** Llena la tabla de filtros adicionales para aplicar a las facturas antes filtradas
     * y asigna listeners a sus controles.
     * @returns {void}
     **/
    llenarTablaFiltro: function () {
        $('#tblFiltros').empty();
        if (notasrModel.filtroFactura.length > 0) {
            var tabla = fillTable('tblFiltros', 'formatoFiltro', 'notasrModel.filtroFactura', 'Conceptos para la búsqueda');
            var input = __dom.configurarTextoNumerico(tabla.find('tr td[header="thValor"] input:text'), true);
            input.css('width', '90%');
            input.on('blur', function () {
                var _this = $(this);
                var indice = _this.parent().parent().attr('data-fila');
                notasrModel.filtroFactura[indice].valorconcepto = _this.val();
            });
            tabla.find('tbody tr td[header="thEliminar"] input:button').on('click', that.eliminarFiltro);
        }
    },
    /** Elimina una fila de la tabla de filtros adicionales
     * @returns {void}
     **/
    eliminarFiltro: function () {
        var btn = $(this);
        var tr = btn.parent().parent();
        var indice = parseInt(tr.attr('data-indice'));
        notasrModel.filtroFactura.splice(indice, 1);
        that.llenarTablaFiltro();
        return;
    },
    /** Hace petición ajax para consultar las facturas que coincidan con los dos filtros
     * @returns {void}
     **/
    aplicarFiltroNotasR: function () {
        var filtros = notasrModel.filtroFactura;
        if (filtros.length > 0) {
            var strConc = [];
            for (var i = 0; i < filtros.length; i++) {
                var filtro = filtros[i];
                var valor = filtro.valorconcepto.trim() === '' ? -1 : filtro.valorconcepto.trim()
                strConc.push({
                    idconcepto: filtro.idConcepto,
                    valor: valor
                });
            }
            var data = {
                conceptos: strConc
            };
            notasrControl.consultarNotasRFiltro(data, that.onAplicarFiltroNotasRCompleto);
        } else {
            that.dialogoActual.dialog('close');
        }
    },
    /** Captura la respuesta del servidor cuando se conusltan las facturas con doble filtro
     * @param {object} data - Respuesta del servidor con facturas filtradas
     * @returns {void}
     **/
    onAplicarFiltroNotasRCompleto: function (data) {
        $('#spanFiltroFactura').text('');
        switch (data.codigoRespuesta) {
            case 0:
                $('#spanFiltroFactura').text('No se encontraron Notas en Reclamacion, intente con otros filtros');
                break;
            case 1:
                data.filtro = true;
                that.onConsultarNotasReclamacionCompleto(data);
                that.dialogoActual.dialog('close');
                break;
        }
    },     
    
        /** Hace petición ajax para consultar los detalles de una factura.
     * @returns {void}
     **/
    consultarDetalleNotaR: function () {
        var _this = $(this);
         var btnAplicarNotas = $('#btnAplicarNotas');
        if (!btnAplicarNotas.is(':disabled')) {
                btnAplicarNotas.attr('disabled', 'disabled');
            }
        for (var i = 0; i < notasrModel.facturasSeleccionadas.length; i++) {
            var idFactura = parseInt(notasrModel.facturasSeleccionadas[i]);
            var factura = notasrControl.obtenerFacturaPorId(idFactura);
            if (factura) {
                factura.procesado = false;
            }
        }
        $('#tblFacturas').DataTable().draw();
        notasrControl.consultarDetallesNotasR({idfactura: _this.attr('data-id')}, that.onConsultarDetalleNotaRCompleto);
    },  
    /** Captura la respuesta del servidor cuando se consultan los detalles de una facturas
     * y son mostrados en un cuadro de diálogo.
     * @param {object} data - Respuesta del servidor con los conceptos del detalle de la factura
     * @returns {void}
    **/   
    onConsultarDetalleNotaRCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                break;
            case 1:
                notasrModel.conceptos = data.conceptos ;
                var fac = data.conceptos[0].idfactura ;
                var tablaConceptos = fillTable('tblConceptos', 'formatoConceptos', 'notasrModel.conceptos', 'Conceptos');
                var input = __dom.configurarTextoNumerico(tablaConceptos.find('tr td[header="thValorAplicar"] input:text'), true);
                input.css('width', '90%');
                input.attr ('disabled', 'disabled');
                input.on('blur', that.ValidarValorConcepto ) ; 
                tablaConceptos.find('tbody tr td[header="thCheckbox"] input:checkbox').on('click', that.SeleccionarConcepto);
                that.seleccionarConceptos(tablaConceptos) ;
                $('#divDetalleFactura').dialogo({
                    modal: true,
                    width: 850,
                    title: 'Detalles de la Nota en Reclamación: ' + fac,
                    buttons: {
                        'Aceptar': function () {  
                            $('#divDetalleFactura').dialog('close');                        
                            that.mostrarTablaValor() ;
                        }
                    }
                });
                break;
        }
    },
    
    /** Selecciona y habilita la caja de Texto para un concepto de una facturas
     * @returns {void}
    **/
    ValidarValorConcepto: function () {        
        var _this = $(this);
        var valorconcepto = _this.val();
        var fila = _this.parent().parent();
        var iddetalle =  fila.find('input[type^="checkbox"]').attr('value');
        var detalle = notasrControl.obtenerDetallePorId(iddetalle);
        var valordetalle = parseInt(detalle.saldo); 
        if (valorconcepto == '' || valorconcepto > 0 )
        {
             __dom.lanzarAlerta('El Valor de Concepto debe ser "0" o menor a "0"', __app.mensajes.atencion);
              var valorconcepto = _this.val(valordetalle);
        }
        else
        {
            if ( valordetalle > valorconcepto )
             {                
                __dom.lanzarAlerta('No se Puede Aplicar un Valor mayor al Saldo ( ' + valordetalle+' )' , __app.mensajes.atencion);
                var valorconcepto = _this.val(valordetalle);
            }
             else 
             {       
                detalle.ValorAplicar = valorconcepto ;
                notasrControl.removerDetalleAplicadoPorId(iddetalle);
                notasrModel.valores.push(detalle);  
            }
        }
    },   
    /** Selecciona y habilita la caja de Texto para un concepto de una facturas
     * ademas adiciona ese detalle con los valores a se procesados
     * @returns {void}
    **/
    SeleccionarConcepto: function () {
        var _this = $(this);     
        var fila = _this.parent().parent();
        var idDetalle = _this.attr('value');
        if (_this.prop('checked')) {
            fila.addClass('selected');
            fila.find('input[type^="text"]').removeAttr('disabled');
            var btnAplicarNotas = $('#btnAplicarNotas');
            if (!btnAplicarNotas.is(':disabled')) {
                btnAplicarNotas.attr('disabled', 'disabled');
            }            
            var detalle = notasrControl.obtenerDetallePorId(idDetalle);
            var valordetalle = parseInt(detalle.saldo); 
            var valorconcepto =  fila.find('input[type^="text"]').attr('value');
            if ( valordetalle <= valorconcepto )
             {
               detalle.ValorAplicar = valorconcepto ;
               notasrModel.valores.push(detalle);
             } 
             else
             {
               detalle.ValorAplicar = null ;
               notasrModel.valores.push(detalle);
             }
        } else {
            fila.removeClass('selected');
            fila.find('input[type^="text"]').attr('disabled', 'disabled');
            $('#checkSeleccion').removeProp('checked');
            notasrControl.removerDetalleAplicadoPorId(idDetalle);
        }
    },    
    /** Selecciona y habilita los registros que estan seleccionados
     * ademas adiciona ese detalle con los valores a se procesados
     * @returns {void}
    **/
    seleccionarConceptos: function (tabla) {    
        if (notasrModel.valores.length > 0) {
            for (var i = 0; i <notasrModel.valores.length; i++) {
               var buscar = 'tbody tr td[header="thCheckbox"] input[type^="checkbox"][value^="'+notasrModel.valores[i].iddetallefactura+'"]' ;
               var elemento = tabla.find(buscar);
               elemento.prop("checked", true) ;
               var fila = elemento.parent().parent();
               fila.find('input[type^="text"]').removeAttr('disabled');              
               fila.find('input[type^="text"]').val(notasrModel.valores[i].ValorAplicar);              
            } 
        }
    },    
    /** Limpia el formulario e información del modelo
     * @returns {void}
     **/
    limpiarFormulario: function () {
        $('#txtDocumentoFiltro,' +
                +' #tblFacturas, #tblFiltros').empty();
        $('select').not('#cmbMesesSus').val('-1');
        $('input:text').val('');
        $('#divFacturas').hide();
        $('#');
    },
    
    /** Confirma si el usuario desea cancelar la operación actual
     * @returns {void}
     **/
    confirmarCancelar: function () {
        if (!!notasrModel.suscripcion || !!notasrModel.facturas) {
            __dom.lanzarAlerta(
                    __app.mensajes.confirmacionCancelacion,
                    __app.mensajes.atencion,
                    function () {
                        location.reload();
                    },
                    true
                    );
        }
    },

    /**
     * Reinicia y borra la información de la tabla de valores y del modelo
     * @returns {void}
     */
    reiniciarTablaValores: function () {
        $('#tblValores').empty();
        $('#divValores').hide();
        $('#btnQuitarValor').hide();
        notasrModel.valores = [];
    },
    
    /** Llena la tabla de liquidación-conceptos para asignación de valores a la nota
     * y asigna listeners a sus controles.
     * @returns {void}
     **/
    mostrarTablaValor: function () {  
        $('#tblValores').empty();
        $('#divValores').hide();
        var formato = 'formatoValoresAplicar';      
        if (notasrModel.valores.length > 0) {
            $('#divValores').show();
            var tablaValores = fillTable('tblValores', formato, 'notasrModel.valores', '');
            tablaValores.find('tbody tr td[header="thQuitar"] input:button').on('click', that.eliminarValor);               
        }
    },
    
    /** Elimina una fila de la tabla de valores de la nota
     * @returns {void}
     **/
    eliminarValor: function () {      
        var _this = $(this);     
        var idDetalle = _this.attr('data-id');
        notasrControl.removerDetalleAplicadoPorId(idDetalle);
        that.mostrarTablaValor() ;
    },
        /** Valida la información para procesar las facturas
     * @returns {void}
     **/
    validarProcesar: function () {
        if (!!notasrModel.facturas) {
            if (notasrModel.facturasSeleccionadas.length > 0) {
                var validacion = that.validarValores();
                if (notasrModel.valores.length <= 0 || !validacion) {
                    __dom.lanzarAlerta('Debe ingresar valores para procesar notas', __app.mensajes.atencion);
                    return;
                }
            } else {
                __dom.lanzarAlerta(__app.mensajes.seleccionarFacturas, __app.mensajes.atencion);
                return;
            }

            __dom.lanzarAlerta('Esto procesará las notas ¿Desea continuar?',
                    __app.mensajes.atencion, that.procesarNotas, true);
        }
    },
    /** Valida que la asignación de los valores de los conceptos estén correctos
     * @returns {void}
     **/
    validarValores: function () {
        for (var i = 0; i < notasrModel.valores.length; i++) {
            var valor = notasrModel.valores[i];
            if (!valor.ValorAplicar || valor.ValorAplicar === null || valor.ValorAplicar === '') {
                return false;
            }
        }
        return true;
    },
    /** Hace petición ajax para procesar las facturas seleccionadas
     * @returns {void}
     **/
    procesarNotas: function () {
        var norasr = notasrControl.obtenerNotasRSeleccionadas();
        if (norasr.length === 0) {
            return;
        }
        notasrModel.conceptosValor = [];
        for (var c = 0; c < notasrModel.valores.length; c++) {
            var val = notasrModel.valores[c];
            var ValorAplicar = parseInt(val.ValorAplicar) ;
            var saldo = parseInt(val.saldo) ;            
            notasrModel.conceptosValor.push({
                iddetallefactura: val.iddetallefactura,
                idfactura : val.idfactura,
                vlrcredito: ValorAplicar,
                vlrdebito : (saldo- ValorAplicar),
                saldo : saldo,
            });
        }
        var data = {
            conceptos: notasrModel.conceptosValor,
            notasr: norasr,
        };
        notasrModel.procesoCompleto = false;
        notasrControl.procesaraNotasR(data, that.onProcesarNotasCompleto);
    },

    /**
     * Se ejecuta cuando se termina de procesar las notas y muestra el mensaje correspondiente. Muestra el resultado en la tabla de facturas.
     * @param  {Object} data Respuesta del servidor
     * @returns {void}      
     */
    onProcesarNotasCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case -1:
                __dom.lanzarAlerta(data.mensaje || data.mensajeError, __app.mensajes.atencion);
                break;
            case 0:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                break;
            case 1:                
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);      
                notasrModel.procesoCompleto = true;
                $('#btnAplicarNotas').removeAttr('disabled');
                for (var i = 0; i < notasrModel.facturasSeleccionadas.length; i++) {
                    var idFactura = parseInt(notasrModel.facturasSeleccionadas[i]);
                    var factura = notasrControl.obtenerFacturaPorId(idFactura);
                    if (factura) {
                        factura.procesado = true;
                    }
                }
                $('#tblFacturas').DataTable().draw();
            break;
        }
    },

    /*Funcion que busca la Nota en Reclamacion procesada
     * para que sean verificadas por el usuario  
     * @returns {void}
     */
    verificarNotaR: function () {
        var btn = $(this);
        var id = parseInt(btn.attr('data-id'));
        console.log(notasrModel.facturas ) ; 
        notasrControl.verificarNotaR({idnotar: id}, that.onVerificarNotaRCompleto);
    },

    /**
     * Se ejecuta cuando se termina de verificar la nota de reclamación y carga la tabla de conceptos procesados
     * @param  {object} data Respuesta del servidor
     * @returns {void}
     */
    onVerificarNotaRCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
            case -1:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                break;
            case 1:
                fillTable('tblConceptosProcesados', 'formatoConceptosProcesados', data.conceptos, 'Conceptos');
                that.dialogoActual = $('#divDialogoConceptos').dialogo({
                    modal: true,
                    width: 850,
                    title: 'Datos de la factura # ' + data.conceptos[0].idfactura,
                    buttons: {
                        'Aceptar': function () {
                            that.dialogoActual.dialog('close');
                        }
                    }
                });
                break;
        }
    },
    
     /** Hace petición ajax para aplicar las notas realizadas
     * @returns {void}
     **/
    aplicarNotas: function () {
        var dialogo = $('#divDialogoMotivos').dialogo({
            modal: true,
            width: 450,
            closeOnEscape: false,
            dialogClass: "noclose",
            title: 'Mótivos de las notas',
            buttons: {
                Aceptar: that.funcionAplicarNotas,
                Cancelar: function () {
                    dialogo.dialog('close');
                }
            }
        });
    },

    /**
     * Aplica las notas siempre que se cumpla que se haya seleccionado un motivo y escrito un comentario. 
     * @returns {void}
     */
    funcionAplicarNotas: function () {     
        var cmbMotivo = $('#cmbMotivo');
        var txtComentarios = $('#txtComentarios');
        if (cmbMotivo.val() === '-1' || txtComentarios.val().trim() === '') {
            __dom.lanzarAlerta('Debe seleccionar un mótivo y agregar al menos un comentario.', __app.mensajes.atencion);
            return;
        }
        var infoEnviar = {
            idmotivo: cmbMotivo.val(),
            comentario: txtComentarios.val()
        };
        var btnAplicarNotas = $('#btnAplicarNotas');
        if (!btnAplicarNotas.is(':disabled')) {
             btnAplicarNotas.attr('disabled', 'disabled');
         }
        $('#divDialogoMotivos').find('input[type^="button"]').attr('disabled', 'disabled');
        notasrControl.aplicarNotas(infoEnviar, that.onAplicarNotasCompleto);
    },

    /**
     * Se ejecuta cuando se terminan de aplicar las notas, muestra el mensaje corespondiente o llena la tabla de errores en caso de haberlos
     * @param  {Object} data Respuesta del servidor
     * @returns {void}      
     */
    onAplicarNotasCompleto: function (data) {
        //console.log(data) ;
        switch (data.codigoRespuesta) {
            case 1:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                setTimeout(function () {
                    location.reload();
                }, 4000);
                return;
                break;
            case -1:
                fillTable('tblErrores', 'formatoErrores', data.errores, data.mensaje);
                $('#divDialogoErrores').dialogo({
                    title: 'Errores encontrados',
                    modal: true,
                    width: 850,
                    buttons: {
                        'Aceptar': function () {
                            $('#divDialogoErrores').dialog('close');
                        }
                    }
                });
                break;
        }
    },

    /**
     * Se ejecuta cuando se terminan de consultar los mótivos de las notas
     * @param  {Object} data Respuesta del servidor 
     * @returns {void}
     */
    onConsultarMotivosCompleto: function (data) {
        var cmbMotivos = $('#cmbMotivo').empty();
        switch (data.codigoRespuesta) {
            case 0:
                __dom.llenarCombo(cmbMotivo, [{idmotivo: -1, nombre: 'No hay motivos para asignar'}], 'idmotivo', 'nombre');
                break;
            case 1:
                __dom.llenarCombo(cmbMotivo, data.motivos, 'idmotivo', 'nombre');
                break;
        }
    }
};
notasrVista.init();
