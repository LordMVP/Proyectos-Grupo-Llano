/**
 * @fileOverview Archivo de vista y control de proceso de Financiacion emergencia
 * @author AppFuture
 * @requires control.js
 * @requires modelo.js
 * @version 1.0.0
 */
/**
 * Objeto que hace referencia al namespace facturarInteresMoraVista
 * @type {Object}
 */
var self = null;
/** @namespace */
var procesarFinanciacionVista = {
    /**Inicializa el proceso de financiaion emergencia
     * @returns {void}
     */
    init: function () {
        var idEmpresa = $('#txtIdEmpresa').val();
        if(idEmpresa == 325){
            $('input#btnProcesaFinancia').hide();
        }
        $('#tabs').tabs();
        self = procesarFinanciacionVista;
        self.configurarAutocomplete();
        $('#tabs').on('click', 'a', function () {
            procesarFinanciacionEmergenciaModel.proceso = $(this).attr('data');
        });
        $('#btnSuscripcion').on('click', self.mostrarFiltro);
        __dom.configurarTextoNumerico('txtSuscripcionFiltro, #txtCodAnterior');

        $('input#btnProcesaFinancia').on('click', self.btnProcesaFinanciaClick);
        $('input#btnCargaFactura').on('click', self.btnCargaArchivo);


        self.appload = new Appload('#txtArchivo', {
            url: 'subirarchivo_emergencia/',
            fileTypes: ['csv'],
            maxSize: 1024 * 1000,
            showErrors: true,
            traceErrors: true,
            showDownloadBtn: false,
            showDeleteBtn: false,
            showDiscardButton: false,
            showUploadButton: false,
            showSingleUploadBtn: false,
            onError: self.onErrorCargando,
            beforeSend: function () {
                __dom.mostrarCargador();
            },
            lg: esAppload
        });


        self.consultaProceso();
        self.interval = setInterval(self.consultaProceso, 5000);
    },

    btnCargaArchivo: function () {
        var idEmpresa = $('#txtIdEmpresa').val();
        if (idEmpresa == 325) {
            self.subirAdjunto();
            $('input#btnProcesaFinancia').show();
            $('input#btnCargaFactura').hide();
        }
    },

    /** Obtiene el id del ciclo seleccionado y envía la solicitud de facturar financiaciones de dicho ciclo
     * @returns {void}
     */
    btnProcesaFinanciaClick: function () {
        var idEmpresa = $('#txtIdEmpresa').val();
        if (idEmpresa == 325) {
            //self.subirAdjunto();
            data = {'accion': 'c', 'idsuscripcion': $('#txtIdEmpresa').val()};
            procesarFinanciacionEmergenciaControl.generaFinanciaEmergencia(data, self.resultadoGenerar);
        } else {
            var tabActivo = $('#tabs').tabs('option', 'active');
            var operador = $($('div#tabs li a')[tabActivo]).attr('data');
            var data = null;
            switch (operador) {
                case 'C':
                    var idCiclo = parseInt($('select#cboCiclo').val());
                    if (idCiclo === -1 || !idCiclo) {
                        __dom.lanzarAlerta(__app.mensajes.seleccionarCiclo, __app.mensajes.atencion);
                        return;
                    }
                    data = {'accion': 'c', 'idciclo': idCiclo};
                    procesarFinanciacionEmergenciaControl.generaFinanciaEmergencia(data, self.resultadoGenerar);
                    break;
                case 'S':
                    if (!procesarFinanciacionEmergenciaModel.idsuscripcion) {
                        __dom.lanzarAlerta(__app.mensajes.seleccionarSuscripcion, __app.mensajes.atencion);
                        return;
                    }
                    data = {'accion': 's', 'idsuscripcion': procesarFinanciacionEmergenciaModel.idsuscripcion};
                    procesarFinanciacionEmergenciaControl.generaFinanciaEmergencia(data, self.resultadoGenerar);
                    break;
            }
        }

    },

    resultadoGenerar: function (data) {
        console.log(data);
        switch (data.codigoRespuesta) {
            case 1:
                __dom.lanzarAlerta(data.mensaje);
                location.reload();
                break;
            case - 1:
                __dom.lanzarAlerta(data.mensaje);
                break;
        }
    },

    /** Configura campo de texto para autocomplete
     * @type {object}
     */
    configurarAutocomplete: function () {
        __dom.configurarAutocomplete(
                '#txtMunicipioFiltro',
                self.sourceAutoComplete,
                function (event, ui) {
                    procesarFinanciacionEmergenciaModel.idmunicipio = ui.item.idVal;
                },
                function () {
                    procesarFinanciacionEmergenciaModel.idmunicipio = undefined;
                }
        );
    },
    /** Realiza la petición AJAX para consultar los municipios del autocomplete 
     * @returns {void}
     */
    sourceAutoComplete: function (request, response) {
        self.request = request;
        self.response = response;
        var datos = {};
        datos.municipio = request.term;
        if (datos.municipio.trim() !== "") {
            procesarFinanciacionEmergenciaControl.consultarMunicipio(datos, self.mostrarResultado);
        }
    },
    /** Muestra el resultado de la consulta de los municipios en la lista desplegable.
     * @returns {void}
     */
    mostrarResultado: function (data) {
        if (data.codigoRespuesta == 1) {
            var result = [];
            $.each(data.datos, function (i, item) {
                result.push({
                    label: item.municipio,
                    value: item.municipio,
                    idVal: item.idmunicipio
                });
            });
            self.response(result);
        }
    },
    /** Muestra un dialogo con el formulario para la búsqueda de las suscripciones
     * @returns {void}
     */
    mostrarFiltro: function () {
        self.dialogoActual = $('div#camposBuscarSuscripcion').dialogo({
            modal: true,
            width: 550,
            title: 'Buscar un suscripción',
            buttons: {
                Buscar: self.filtrarSuscriptor,
                Cancelar: function () {
                    self.dialogoActual.dialog('close');
                }
            }
        });
    },
    /** Valida la información del filtro de suscripción y envía la solicitud al servidor
     * @returns {void}
     */
    filtrarSuscriptor: function () {
        if (!procesarFinanciacionEmergenciaModel.idmunicipio) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarMunicipio, __app.mensajes.atencion);
            return;
        }
        var filtro = $('div#camposBuscarSuscripcion');
        var suscripcion = filtro.find('#txtSuscripcionFiltro').val().trim();
        var codAnt = filtro.find('#txtCodAnterior').val().trim();
        if (suscripcion === '' && codAnt === '') {
            filtro.find('#spanMensaje').text(__app.mensajes.camposInvalidosFiltro).show();
        } else {
            var data = {
                idmunicipio: procesarFinanciacionEmergenciaModel.idmunicipio,
                idsuscripcion: suscripcion,
                codigoanterior: codAnt
            };
            procesarFinanciacionEmergenciaControl.consultarSuscripciones(data, self.consultaSuscripcionCompleto);
        }
    },
    /** Captura la respuesta enviada por el servidor, cuando se consultan las suscripciones.
     * En caso de llegar varias suscripciones posibilita la selección de una.
     * @param  {object} data - El resultado de la petición ajax con las suscripciones que coinciden
     * @returns {void}
     */
    consultaSuscripcionCompleto: function (data) {
        $('#spanMensaje').text('');
        switch (data.codigoRespuesta) {
            case 0:
                $('#spanMensaje').text(data.mensaje);
                break;
            case 1:
                self.limpiarFormulario();

                var sus = data.datos[0];
                $('#txtSuscripcion').val(sus.idsuscripcion);
                $('#txtDocumento').val(sus.cedula);
                $('#txtNombre').val(sus.nombretercero);
                $('#txtCodAnterior').val(sus.codigoanterior);
                $('#txtMunicipio').val(sus.municipio);
                $('#txtBarrio').val(sus.barrio);
                $('#txtDireccion').val(sus.direccion);
                procesarFinanciacionEmergenciaModel.idsuscripcion = sus.idsuscripcion;
                self.dialogoActual.dialog('close');
                break;
        }
    },

    /**
     * Limpia el formulario 
     * @returns {void}
     */
    limpiarFormulario: function () {
        var cab = $('#divCabecera');
        $('select').find('-1');
        cab.find('input:text').val('');
        procesarFinanciacionEmergenciaModel.idsuscripcion = null;
    },

    consultaProceso: function () {
        var fxSuccess = function (data) {
            switch (data.codigoRespuesta) {
                case 0:
                    $('#divInfoProceso').hide();
                    $('#divResumenProceso').show();
                    clearInterval(self.interval);
                    procesarFinanciacionEmergenciaControl.consultarResumen(self.onConsultarResumenCompleto);
                    break;
                case 1:
                    $('#divInfoProceso').show();
                    fillTable('tblProceso', 'formatoProgreso', data.progreso, '');
                    break;
            }
        };
        procesarFinanciacionEmergenciaControl.consultaProceso(fxSuccess);
    },

    onConsultarResumenCompleto: function (data) {
        if (data.codigoRespuesta > 0) {
            fillTable('tblResumen', 'formatoResumen', data.resumencorrectos, 'Suscripciones Procesadas').show();
        }
        if (data.resumenconerrores.length > 0) {
            fillTable('tblErrores', 'formatoResumenErrores', data.resumenconerrores, 'Facturas con Errores').show();
        }
        return;
    },

    subirAdjunto: function () {

        if (self.appload.files.length === 0) {
            __dom.lanzarAlerta('Seleccione archivos a cargar', __app.mensajes.atencion);
            return;
        }

        var data = {
            idempresa: $('#txtIdEmpresa').val()
        };
        self.appload.uploadFiles(data);
    },
};

procesarFinanciacionVista.init();