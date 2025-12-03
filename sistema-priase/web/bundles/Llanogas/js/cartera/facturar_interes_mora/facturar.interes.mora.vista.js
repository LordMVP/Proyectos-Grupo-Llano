/**
 * @fileOverview Archivo de vista y control de facturar interés por mora
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
var facturarInteresMoraVista = {
    /**Inicializa el programa de aplicar interés por mora, y asigna listeners a los controles
     * @returns {void}
     */
    init: function (proceso) {
        $('#tabs').tabs();
        self = facturarInteresMoraVista;
        self.configurarAutocomplete();
        self.configuracionInicial(proceso);
        $('#tabs').on('click', 'a', function () {
            facturarInteresMoraModel.proceso = $(this).attr('data');
        });
        $('#btnSuscripcion').on('click', self.mostrarFiltro);
        __dom.configurarTextoNumerico('txtSuscripcionFiltro, #txtCodAnterior');
        $('#btnAprobar').on('click', self.aprobarFacturas);
        $('input#btnFacturarInteresMora').on('click', self.btnFacturarInteresMoraClick);
    },

    /**
     * Invoca la solicitud para aprobar facturas.
     * @returns {void}
     */
    aprobarFacturas: function () {
        facturarInteresMoraControl.aprobarFacturas(self.onAprobarFacturasCompleto);
    },

    /**
     * Se ejecuta después de que se ha terminado la aprobación de facturas
     * @param  {Object} data La respuesta del servidor
     * @returns {void}
     */
    onAprobarFacturasCompleto: function (data) {
        if (data.codigoRespuesta === 1) {
            data.mensaje = data.mensaje + data.datos;
        }
        __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
        facturarInteresMoraControl.resumenFacturas(self.onConsultarResumenCompleto);
    },
    /**
     * Valida si hay un proceso ejecutándose de ser así inicia la consulta del progreso
     * @returns {void}
     **/
    configuracionInicial: function (proceso) {
        facturarInteresMoraModel.proceso = 'C';
        if (proceso > 0) {
            self.consultarProgreso();
            facturarInteresMoraModel.interval = setInterval(self.consultarProgreso, 3000);
        } else {
            facturarInteresMoraControl.resumenFacturas(self.onConsultarResumenCompleto);
        }
    },

    /**
     * Invoca la consulta del progreso del proceso de facturación.
     * @returns {void}
     */
    consultarProgreso: function () {
        facturarInteresMoraControl.consultarProgreso(self.onConsultarProgresoCompleto);
    },
    /** Captura la respuesta del servdor cuando se consulta el progreso del proceso ejectutado
     * @param{object} data- Información del proceso con cuántos registros afectados
     * @returns {void}
     **/
    onConsultarProgresoCompleto: function (data) {
        $('#tblProceso').empty();
        var combo = $('#divComboCiclo');
        var progreso = $('#divInfoProceso');
        if (data.codigoRespuesta === 1 && data.progreso.length !== 0) {
            combo.hide();
            progreso.show();
            $('#aSuscripcion').hide();
            $('#tabs').tabs('disable', 1);
            var info = data.progreso;
            fillTable("tblProceso", "formatoProgreso", info, "");
        } else {
            combo.show();
            progreso.hide();
            $('#aSuscripcion').show();
            $('#tabs').tabs('enable', 1);
            if (facturarInteresMoraModel.interval) {
                clearInterval(facturarInteresMoraModel.interval);
                facturarInteresMoraModel.interval = null;
            }
            facturarInteresMoraControl.resumenFacturas(self.onConsultarResumenCompleto);
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
                    facturarInteresMoraModel.idmunicipio = ui.item.idVal;
                },
                function () {
                    facturarInteresMoraModel.idmunicipio = undefined;
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
            facturarInteresMoraControl.consultarMunicipio(datos, self.mostrarResultado);
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
        if (!facturarInteresMoraModel.idmunicipio) {
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
                idmunicipio: facturarInteresMoraModel.idmunicipio,
                idsuscripcion: suscripcion,
                codigoanterior: codAnt
            };
            facturarInteresMoraControl.consultarSuscripciones(data, self.consultaSuscripcionCompleto);
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
                facturarInteresMoraModel.idsuscripcion = sus.idsuscripcion;
                self.dialogoActual.dialog('close');
                break;
        }
    },
    /** Obtiene el id del ciclo seleccionado y envía la solicitud de facturar financiaciones de dicho ciclo
     * @returns {void}
     */
    btnFacturarInteresMoraClick: function () {
        var data = null;
        var proceso = facturarInteresMoraModel.proceso;
        if (facturarInteresMoraModel.interval) {
            __dom.lanzarAlerta('Hay un proceso en ejecución, intente más tarde', __app.mensajes.atencion);
            return;
        }

        switch (proceso) {
            case 'C':
                var idCiclo = parseInt($('select#cboCiclo').val());
                if (idCiclo === -1 || !idCiclo) {
                    __dom.lanzarAlerta(__app.mensajes.seleccionarCiclo, __app.mensajes.atencion);
                    return;
                }
                data = {'accion': 'c', 'idciclo': idCiclo};
                break;
            case 'S':
                if (!facturarInteresMoraModel.idsuscripcion) {
                    __dom.lanzarAlerta(__app.mensajes.seleccionarSuscripcion, __app.mensajes.atencion);
                    return;
                }
                data = {'accion': 's', 'idsuscripcion': facturarInteresMoraModel.idsuscripcion};
                break;
        }
        facturarInteresMoraControl.consultarDocumentos(data, self.onCompletoFacturarInteresMora);
    },
    /** Captura la respuesta del servidor cuando se graba la facturación deñ interés por mora.
     * @param {object} data - Respuesta del servidor al grabar
     * @returns {void}
     */
    onCompletoFacturarInteresMora: function (data) {
        switch (data.codigoRespuesta) {
            case 0 :
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                break;
            case 1:
                $('#contenedorConceptos').show();
                facturarInteresMoraModel.documentos = data.datos.documentos;
                facturarInteresMoraModel.conceptosnobase = data.datos.conceptosnobase;
                fillTable("tblDocumentos", "formatoFinanciaciones", "facturarInteresMoraModel.documentos", "");
                fillTable("tblConceptosNoBase", "formatoConceptosNoBase", "facturarInteresMoraModel.conceptosnobase", "");

                if (facturarInteresMoraModel.conceptosnobase.length === 0) {
                    $('#contenedorConceptos').hide();
                }

                self.dialogoActual = $('div#divContinuar').dialogo({
                    modal: true,
                    width: 550,
                    title: 'Documentos y Tipo Documento',
                    buttons: {
                        Continuar: function () {
                            self.ejecutarProceso();
                        },
                        Cancelar: function () {
                            self.dialogoActual.dialog('close');
                        }
                    }
                });
                break;
            case -1:
                __dom.ocultarToast();
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                break;
        }
    },

    /**
     * Valida el tipo de acción que se debe ejecutar e invoca a la facturaciónd e intereses.
     * La ejecutación se puede hacer por Ciclo (C) o por suscripción (S)
     * @returns {void}
     */
    ejecutarProceso: function () {
        var accion = facturarInteresMoraModel.proceso;
        var data = {
            accion: accion
        };
        switch (accion) {
            case 'C':
                var idCiclo = parseInt($('select#cboCiclo').val());
                if (idCiclo === -1 || !idCiclo) {
                    __dom.lanzarAlerta(__app.mensajes.seleccionarCiclo, __app.mensajes.atencion);
                    return;
                }
                data.idciclo = idCiclo;
                break;
            case 'S':
                if (!facturarInteresMoraModel.idsuscripcion) {
                    __dom.lanzarAlerta(__app.mensajes.seleccionarSuscripcion, __app.mensajes.atencion);
                    return;
                }
                data.idsuscripcion = facturarInteresMoraModel.idsuscripcion;
                break;
        }

        facturarInteresMoraControl.facturarInteres(data, self.onGrabarCompleto);
    },
    /**
     * Recibe la respuesta del servidor cuando se ejecuta la facturación
     * @param {array} data - Respuesta del servidor
     * @returns {void}
     */
    onGrabarCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
            case 1:
                self.dialogoActual.dialog('close');
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion, self.validarProcesoLanzado);
                break;
            case -1:
                self.dialogoActual.dialog('close');
                __dom.ocultarToast();
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                break;
        }
    },

    /**
     * Valida si el proceso es C, y establece a configuración inicial de la aplicación. También limpia el formulario actual
     * @returns {void}
     */
    validarProcesoLanzado: function () {
        if (facturarInteresMoraModel.proceso === 'C') {
            self.configuracionInicial(1);
        }
        self.limpiarFormulario();
    },

    /**
     * Se ejecuta cuando se termina de consultar el resumen de la facturación y carga la tabla de errores y de 
     * facturas correctas, en caso de haber datos de resultado.
     * @param  {Object} data La respuesta del servidor
     * @returns {void}
     */
    onConsultarResumenCompleto: function (data) {
        $('#divResumenProceso').hide();
        if (data.codigoRespuesta === 1) {
            $('#divResumenProceso').show();
            if (data.datos) {
                var error = data.datos.nogeneradas;
                var correcto = data.datos.generadas;
                if (error.length > 0) {
                    fillTable('tblErrores', 'formatoResumen', error, 'Facturas que no se generaron');
                }
                if (correcto.length > 0) {
                    fillTable('tblResumen', 'formatoResumen', correcto, 'Facturas generadas');
                }
            }
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
        facturarInteresMoraModel.idsuscripcion = null;
    }
};

