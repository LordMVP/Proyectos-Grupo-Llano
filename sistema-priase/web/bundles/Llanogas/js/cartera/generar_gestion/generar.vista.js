/**
 * @fileOverview Archivo de vista y control de financiación
 * @author AppFuture
 * @requires generarControl.js
 * @requires generarModel.js
 * @version 1.0.0
 */
/**
 * Objeto que hace referencia al namespace generarGestionVista
 * @type {Object}
 */
var that = null;

/** @namespace */
var generarGestionVista = {
    /** Hace referencia al último dialogo abierto en la aplicación
     * @type {object}
     */
    dialogoActual: null,
    /**Inicializa el programa de generar gestión de financiación, y asigna listeners a los controles
     * @returns {void}
     */
    init: function () {
        that = this;
        $('#btnFiltrar').on('click', that.mostrarFiltro);
        $('#btnGuardar').on('click', that.generarGestion);
        $('#txtMorosidadFinal').on('blur', that.validarMorosidad);
        $('#cmbTipoDocumento').on('change', that.cargarDocumentos);
        __dom.configurarTextoNumerico('txtMorosidadInicial, #txtMorosidadFinal, #txtSaldoInicial, #txtSaldoFinal, #txtIdSuscripcion');
        that.cargarAutocompleteMunicipio();
    },
    /** Valida que la morosidad sea menor a 10000
     * @returns {void}
     **/
    validarMorosidad: function(){
        var _this = $(this);
        if(parseInt(_this.val()) > 9999){
            _this.val(9999);
        }
    },
    /**
     * Carga el autocompletado de municipios fijando un mínimo de 3 caracteres para activarlo.
     * @returns {void}
     */
    cargarAutocompleteMunicipio: function () {
        __dom.configurarAutocomplete(
            '#divFiltro #txtMunicipio',
            that.sourceAutoCompleteMunicipio,
            function(event, ui) {
                generarModel.idMunicipio = ui.item.idVal;
            },
            function(txt) {
                generarModel.idMunicipio = undefined;
            }
        );
    },
    /**
     * Función de callback que consulta los municipios y llama a la función que 
     * muestra el resultado en el autocomplete "Municipio".
     * @param  {Object} data Respuesta del servidor al consultar los municipios.
     * @returns {void}
     */
    sourceAutoCompleteMunicipio: function (request, response) {
        that.request = request;
        that.response = response;
        var data = {};
        data.municipio = request.term.trim();
        generarControl.consultarMunicipios(data, that.mostrarResultadoMunicipio);
    },
    /**
     * Gestiona el arreglo de municipios que se obtuvo de la consulta para mostrarlo como
     * una lista de opciones en el combo de municipio.
     * @param  {Object} data Respuesta del servidor al consultar los municipios.
     * @returns {void}
     */
    mostrarResultadoMunicipio: function (data) {
        if (data.codigoRespuesta === 1) {
            var result = [];
            $.each(data.datos, function (i, item) {
                result.push({
                    label: item.municipio,
                    value: item.municipio,
                    idVal: item.idproyecto
                });
            });
            that.response(result);
        }
    },
    /**
     * Valida la información de la gestión de cartera y envía petición AJAX para guardarla
     * @returns {void}
     */
    generarGestion: function () {
        var suscripciones = generarControl.obtenerSuscripcionesSeleccionada();
        var susc = $('#tblSuscripciones tbody tr input[type="checkbox"]:checked').parent().parent();
        if (suscripciones.length === 0) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarSuscripcion, __app.mensajes.atencion);
        } else {
            var gestionar = [];
            /*$.each(susc, function (s, sus) {
                var id = $(sus).attr('data-id');
                var suscripcion = $.grep(generarModel.suscripciones, function (obj) {
                    return parseInt(obj.idsuscripcion) === parseInt(id);
                });
                if (suscripcion.length > 0) {
                    suscripcion = suscripcion[0];
                    //var suscripcion = generarModel.suscripciones[indice];
                    gestionar.push({
                        idsuscripcion: suscripcion.idsuscripcion,
                        facturas: (function (_susc) {
                            var _facturas = [];
                            for (i = 0; i < _susc.facturas.length; i++) {
                                _facturas.push({idfactura: _susc.facturas[i].idfactura});
                            }
                            return _facturas;
                        })(suscripcion)
                    });
                }

            });*/
            generarControl.generarGestion({suscripciones: JSON.stringify(suscripciones)}, that.generarGestionCompleto);
        }
    },
    /** Captura la respuesta del servidor cuando se guarda la gestión de cartera
     * @returns {void}
     */
    generarGestionCompleto: function (data) {
        $('#divTablaSuscripciones').hide();
        $('#tblSuscripciones').empty();

        var recargar = function(){
            window.location.reload();
        };

        if (data.codigoRespuesta > 0) {
            __dom.lanzarAlerta(__app.mensajes.registroExitoso, __app.mensajes.atencion, recargar, null, recargar);
        }
        else {
            __dom.lanzarAlerta(__app.mensajes.errorGuardarInformacion, __app.mensajes.atencion);
        }
    },
    /** Muestra un dialogo con el formulario para la búsqueda de las suscripciones
     * @returns {void}
     */
    mostrarFiltro: function () {
        var filtro = $('div#divFiltro');
        that.dialogoActual = filtro.dialogo({
            modal: true,
            width: 850,
            title: 'Filtrar suscripciones',
            buttons: {
                'Buscar': that.filtrarSuscripciones
            }
        });
    },
    /** Consulta los documentos según el tipo de documento seleccionados.
     * @returns {void}
     */
    cargarDocumentos: function () {
        var idTipoDocSeleccionado = $(this).find('option:selected').val();
        if (idTipoDocSeleccionado !== '-1') {
            generarControl.consultarDocumentos({idtipodocumento: idTipoDocSeleccionado}, that.cargarDocumentosCompleto);
        } else {
            $('#cmbDocumento').html('');
        }
    },
    /** Captura respuesta del servidor cuando se consultan los documentos y se muestran en el combo
     * @returns {void}
     */
    cargarDocumentosCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 1:
                var cmbDocumento = $('#cmbDocumento');
                cmbDocumento.find('option').remove();
                $.each(data.datos, function (d, doc) {
                    cmbDocumento.append($('<option>').val(doc.iddocumento).text(doc.documento));
                });
                break;
        }
    },
    /** Valida la información del filtro de suscripción y envía la solicitud al servidor
     * @returns {void}
     */
    filtrarSuscripciones: function () {
        var municipio = $('#txtMunicipio').val();
      /*  if (municipio === '' || !generarModel.idMunicipio) {
            __dom.lanzarAlerta('El campo municipio es requerido.', __app.mensajes.atencion);
            return;
        }*/
        var tipoSuscripcion = $('#cmbTipoSuscripcion').val();
        if (tipoSuscripcion === '-1') {
            __dom.lanzarAlerta(__app.mensajes.seleccionarTipoSuscripcion, __app.mensajes.atencion);
            return;
        }
        //validar la morosidad
        var idSuscripcion = $('#txtIdSuscripcion').val();
        var morosidadinicial = parseInt($('#txtMorosidadInicial').val());
        var morosidadfinal = parseInt($('#txtMorosidadFinal').val());
        if (isNaN(morosidadfinal) || isNaN(morosidadinicial)) {
            __dom.lanzarAlerta(__app.mensajes.morosidadInvalida, __app.mensajes.errorValidacion);
            return;
        }
        if (morosidadinicial > morosidadfinal) {
            __dom.lanzarAlerta(__app.mensajes.morosidadRangoInvalido, __app.mensajes.errorValidacion);
            return;
        }
        //validar el saldo
        var saldoinicial = parseInt($('#txtSaldoInicial').val());
        var saldofinal = parseInt($('#txtSaldoFinal').val());
        if (isNaN(saldoinicial) || isNaN(saldofinal)) {
            __dom.lanzarAlerta(__app.mensajes.saldoInvalido, __app.mensajes.errorValidacion);
            return;
        }
        if (saldoinicial > saldofinal) {
            __dom.lanzarAlerta(__app.mensajes.salodRangoInvalido, __app.mensajes.errorValidacion);
            return;
        }
        if (saldoinicial <= 0) {
            __dom.lanzarAlerta('Saldo inicial debe ser mayor a 0', __app.mensajes.errorValidacion);
            return;
        }
        var tipoDoc = $('#cmbTipoDocumento').val();
        var documento = $('#cmbDocumento').val();
        var ciclo = $('#cmbCicloActivo').val();
        var peticion = {
            idmunicipio: (generarModel.idMunicipio === undefined ) ? -1 : generarModel.idMunicipio ,
            idsuscripcion: (idSuscripcion === "") ? -1 : idSuscripcion,
            idtiposuscripcion: tipoSuscripcion,
            idtipodocumento: tipoDoc === "-1" ? -1 : tipoDoc,
            iddocumento: documento === null ? -1 : documento,
            morosidad: {desde: morosidadinicial, hasta: morosidadfinal},
            saldo: {desde: saldoinicial, hasta: saldofinal}
        };
        if(ciclo !== '-1' && ciclo){
            peticion.idciclo = ciclo;
        }
        generarControl.consultarSuscripciones(peticion, that.consultarSuscripcionesCompleto);
    },
    /** Captura la respuesta enviada por el servidor, cuando se consultan las suscripciones y las visualiza en la tabla.
     * @param  {object} data - El resultado de la petición ajax para guardar la información de la suscripción
     * @returns {void}
     */
    consultarSuscripcionesCompleto: function (data) {
        that.dialogoActual.dialog('close');
        switch (data.codigoRespuesta) {
            case 0:

                $('#divTablaSuscripciones').hide();
                $('#tblSuscripciones').empty();
                __dom.lanzarAlerta(__app.mensajes.sinResultados, __app.mensajes.atencion);
                break;
            case 1:
                generarModel.suscripciones = data.datos;
                //var tblSuscripciones = fillTable("tblSuscripciones", "formatoSuscripciones", "generarModel.suscripciones", "Suscripciones");
                var table = $('#tblSuscripciones').empty();
                var tabla = table.dataTable({
                    "data": generarModel.suscripciones,
                    "columns": formatoSuscripciones,
                    "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        var fila = $(nRow).attr('data-id', aData['idsuscripcion']);
                        that.rowCallback(nRow, aData);
                    },
                    "language": {
                        url: "/achagua/sistema/web/bundles/Llanogas/js/facturacion/Spanish.json"
                    },
                    "destroy": true,
                    initComplete: that.agregarCheck
                });
                $('#divTablaSuscripciones').show();

                break;
        }
    },
    /**
     * Agrega un input checkbox en el header de la tabla cuando se termina de cargar
     * @returns {void}
     */
    agregarCheck: function () {
        var label = $('<label>').text('Seleccionar').attr('for', 'checkSeleccion');
        var check = $('<input>').attr({'type': 'checkbox', 'id': 'checkSeleccion'});
        check.on('click', that.seleccionarTodas);
        $($('#tblSuscripciones thead tr th')[0]).text('')
                .append(check, label)
                .attr('aria-label', '');
    },
    /**
     * Selecciona/Deselecciona todas las filas de la tabla
     * @returns {undefined}
     */
    seleccionarTodas: function () {
        var check = $(this);
        var seleccionado = check.is(':checked');
        for (var i = 0; i < generarModel.suscripciones.length; i++) {
            generarModel.suscripciones[i].seleccionado = seleccionado;
        }
        $('#tblSuscripciones').DataTable().draw();
    },
    /** Agrega controles con respectivo listener a tabla de suscripciones filtradas
     * @param nRow - Fila en la que se agregará el control
     * @param aData - Información asignada a la fila actual
     * @returns {void}
     **/
    rowCallback: function (nRow, aData) {
        nRow = $(nRow);
        var suscripcion = aData['idsuscripcion'];
        var seleccionado = (aData.seleccionado) ? aData.seleccionado : false;
        var label = $('<label>').text('Seleccionar')
                .attr('for', 'checkConceptoRelacionado_' + suscripcion);
        var check = $('<input>').attr({
            'checked': seleccionado, // $(nRow).hasClass('selected'),
            'data-id': suscripcion,
            'type': 'checkbox',
            'id': 'checkConceptoRelacionado_' + suscripcion
        });

        var btn = $('<button>').text('ver factura')
                .addClass('tblBtn')
                .attr('data-id', suscripcion)
                .attr('id', 'btnSuscripcionRelacionada_' + suscripcion);

        if (seleccionado) {
            nRow.addClass('selected');
        } else {
            nRow.removeClass('selected');
        }

        check.off('click').on('click', that.seleccionarFactura);
        btn.on('click', that.onVerFacturas);

        var tds = $(nRow).find('td');
        $(tds[6]).empty().append(btn);
        $($(nRow).find(':nth-child(1)')[0]).empty().append(check, label);
    },
    /** Selecciona y habilita controles de una facturas
     * @returns {void}
     **/
    seleccionarFactura: function () {
        var _this = $(this);
        var fila = _this.parent().parent();
        var factura = generarControl.obtenerSuscripcionPorId(_this.attr('data-id'));
        if (_this.prop('checked')) {
            factura.seleccionado = true;
            fila.addClass('selected');
        } else {
            factura.seleccionado = false;
            fila.removeClass('selected');
            $('#checkSeleccion').removeProp('checked');
        }
    },
    /** Consulta las facturas de la suscripción seleccionada
     * @returns {void}
     */
    onVerFacturas: function () {
        var _this = $(this);
        var idSuscripcion = parseInt(_this.attr('data-id'));
        var suscripcionActual = null;
        for (var i = 0; i < generarModel.suscripciones.length; i++) {
            if (parseInt(generarModel.suscripciones[i].idsuscripcion) === idSuscripcion) {
                suscripcionActual = generarModel.suscripciones[i];
            }
        }
        that.mostrarFacturas(suscripcionActual);
    },
    /** Muestra un dialogo con las facturas de la suscripción
     * @returns {void}
     */
    mostrarFacturas: function (susc) {
        var divFacturas = $('div#divFacturas');
        generarModel.facturas = susc.facturas;
        var tblFacturas = fillTable("tblFacturas", "formatoFacturas", "generarModel.facturas", "Facturas");
        that.dialogoActual = divFacturas.dialogo({
            modal: true,
            width: 800,
            title: 'Facturas de la suscripción ' + susc.idsuscripcion + ' - Tipo de Suscripción: ' + susc.tiposuscripcion,
            buttons: {
                Aceptar: function () {
                    that.dialogoActual.dialog('close');
                }
            }
        });
    }

};

generarGestionVista.init();
