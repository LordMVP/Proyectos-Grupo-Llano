/**
 * @fileOverview Archivo de vista y control de registro de ventas
 * @author Angélica Gómez
 * @requires registroventas.control.js
 * @requires registroventas.model.js
 * @version 1.0.0
 */

/**
 * Objeto que hace referencia al namespace registroVentasVista
 * @type {Object}
 */
var self = null;

/** @namespace */
var registroVentasVista = {
    /**
     * hace referencia al último dialogo abierto en la aplicación
     * @type {object}
     */
    dialogoActual: null,
    mostrandoValidacionFormatos: false,
    contador: 0,
    /**
     * Inicializa el programa para el registro de ventas y asigna listeners a controles.
     * @returns {void}
     */
    init: function () {
        self = registroVentasVista;
        self.cargarAutocomplete();
        self.establecerControlesAplicacion();
        self.configurarControlesAppload();
        self.configurarFuncionalidadControlesAplicacion();
        self.configurarControlesAplicacion();
        self.configurarBotonesArchivos();
        self.validarPermisosGrabar();
    },
    /**
     * Agrega eventos a los botones de los archivos
     * @returns {void}
     */
    configurarBotonesArchivos: function () {
        $('#divArchivosContrato').undelegate('.btnSimple', 'click');
        $('#divArchivosContrato').delegate('.btnSimple', 'click', function () {
            $(this).addClass('descargado');
        });
    },
    /**
     * Configura las cajas que se deshabilitan o habilitan según el estado de la venta
     * @returns {void}
     */
    establecerControlesAplicacion: function () {
        registroVentasModelo.fechaActual = $('#txtFechaVenta').val();
        var filtros = $('#divBuscarVenta input:text, #divDialogoBusqueda input:text, #divDialogoBusqueda select');
        var cajas = $('#divGeneral select, #divGeneral input:text').not('[disabled="disabled"]');
        registroVentasModelo.cajas = cajas.not(filtros);
    },
    /**
     * Se hacen configuraciones de los controles (campos numéricos, calendario, colapsable)
     * @returns {void}
     */
    configurarFuncionalidadControlesAplicacion: function () {
        __dom.configurarTextoNumerico($('input:text[data-caja="number"]'));
        __dom.configurarCalendario('txtFiltroFechaInicio, #txtFiltroFechaFin');
        __dom.configurarTextoNumerico('txtCantidad, #txtValor, #txtIdSuscripcion, #txtCodigoAnteriorBuscar');
        __dom.configurarColapsable('.divContenedorColapsable');
        $('a.fa-minus').click();
    },
    /**
     * Se configuran los controles de la aplicación involucrados en subida de archivos
     * @returns {void}
     */
    configurarControlesAppload: function () {
        self.configurarApploadAplicacion();
        $('#txtArchivosFinanciacion').change();
        $('#txtArchivos').next().css({'color': '#FFF'});
        $('#btnSubirArchivos').on('click', self.actualizarAdjuntosVenta);
    },
    /**
     * Se configuran los eventos de los controles de la aplicación
     * @returns {void}
     */
    configurarControlesAplicacion: function () {
        $('#tabs').tabs();
        $("#pestanias").tabs({disabled: [1, 2, 3]});
        $('#btnNuevo').on('click', self.mostrarBusqueda);
        $('#btnBuscar').on('click', self.mostrarFiltro);
        $('#btnGrabar').on('click', self.validarResolucion);
        $('#btnCancelar').on('click', self.cancelarVenta);
        $('#cmbMunicipio').on('change', self.consultarBarrios);
        $('#btnBuscarFiltro').on('click', self.consultarSuscripcion);
        $('#btnBuscarVenta').on('click', function () {
            self.validarBusqueda("'P', 'A', 'F'");
        });
        $('#btnVerDetalle').on('click', self.mostrarDialogoTercero);
        $('#btnVerPropiedad').on('click', self.mostrarDialogoPropiedad);
        $('#cmbFuncionarioCertificador').on('change', self.consultarFuncionarioCompleto);
        $('#txtFiltroLiquidacion').on('keyup', self.filtrarLiquidacion);
        $('#btnContrato').on('click', self.imprimirContrato);
        $('button[data-funcion="listas"]').on('click', self.mostrarLiquidacionSeleccionada);
        $('#btnLiquidar').on('click', self.validarInformacionLiquidar);
        $('#cmbTipoDocumento').on('change', self.consultarDocumento);
        $('#cmbDocumento').on('change', self.consultarLiquidaciones);
    },
    /**
     * Configura controles para subir archivos para la venta o para ver los archivos de la financiación
     * @returns {void}
     */
    configurarApploadAplicacion: function () {
        self.appload = new Appload('#txtArchivos', {
            multiple: true,
            url: '../adjuntos/',
            fileTypes: ['pdf', 'doc', 'docx'],
            maxSize: 102400 * 1024,
            showErrors: true,
            traceErrors: true,
            showDownloadBtn: true,
            showDeleteBtn: true,
            showDiscardButton: false,
            showSingleUploadBtn: false,
            showUploadButton: false,
            lg: esAppload
        });
        self.apploadFinanciacion = new Appload('#txtArchivosFinanciacion', {
            showDeleteBtn: false,
            showDownloadBtn: true,
            showUploadButton: false,
            showDiscardButton: false,
            showSingleUploadBtn: false,
            showSingleDiscardButton: false,
            lg: esAppload
        });
        self.appload.addListener('onsingleupload', self.subirCompleto);
        self.appload.addListener('onFileSelected', self.uploadFile);
    },
    /**
     * Captura el evento cuando se ha seleccionado un archivo para subir
     * @param {Object} data - Información del archivo seleccionado (data.data)
     * @returns {void}
     */
    uploadFile: function (data) {
        if (!self.validarSubidaArchivosVenta()) {
            return;
        }
        if (self.appload.files.length > 0) {
            self.appload.singleUpload(data.data, {'modulo': 'ventas'});
        }
    },
    /**
     * Valida que la venta permite subir archivos y se hayan descargado los formatos
     * @returns {Boolean}
     */
    validarSubidaArchivosVenta: function () {
        var cantFormatos = $('#divArchivosContrato .btnSimple').length;
        var cantDownload = $('#divArchivosContrato .btnSimple.descargado').length;
        var estadoActiva = registroVentasModelo.detallesSuscripcion.suscripcion.estado === 'A';
        var fxEliminarFile = function () {
            registroVentasVista.mostrandoValidacionFormatos = false;
            self.appload.container.find('div.file-item:last').not('.uploaded-item').remove();
        };

        if (!registroVentasModelo.venta && !registroVentasModelo.idVentaGrabada) {
            __dom.lanzarAlerta('No se encontró una venta para subir soportes, intente nuevamente', __app.mensajes.atencion, fxEliminarFile, false, fxEliminarFile);
            return false;
        }

        if ((!estadoActiva) && (cantDownload !== cantFormatos) && (!registroVentasModelo.venta.adjuntos || registroVentasModelo.venta.adjuntos.length === 0)) {
            if (!registroVentasVista.mostrandoValidacionFormatos) {
                registroVentasVista.mostrandoValidacionFormatos = true;
                __dom.lanzarAlerta('Debe descargar los formatos de la venta', __app.mensajes.atencion, fxEliminarFile, false, fxEliminarFile);
            } else {
                self.appload.container.find('div.file-item:last').not('.uploaded-item').remove();
            }
            return false;
        }
        return true;
    },
    /**
     * Consulta documentos por suscripción y tipo de documento
     * @returns {void}
     */
    consultarDocumento: function () {
        var cmb = $('#cmbTipoDocumento').val();
        if (!registroVentasModelo.venta.cargando) {
            $('#listaLiquidacionSeleccion .listaSeleccion').empty();
        }
        if (registroVentasModelo.modelo === 'aprobarVista') {
            return;
        }
        if (cmb !== '-1' && registroVentasModelo.suscripcion) {
            var data = {idtipodocumento: cmb, tipoventa: 'P'};
            registroVentasControl.consultarDocumento(data, self.onConsultarDocumentoCompleto);
            return;
        }
        $('#cmbDocumento').empty();
    },
    /**
     * Se carga combo de documentos y asigna valor en caso de que se esté cargando la venta
     * @param  {Object} data - Respuesta del servidor con arreglo de documentos
     * @returns {void}
     */
    onConsultarDocumentoCompleto: function (data) {
        var combo = $('#cmbDocumento');
        switch (data.codigoRespuesta)
        {
            case 0:
                combo.empty();
                $('#spanMensaje').text(__app.mensajes.sinResultados);
                break;
            case 1:
                __dom.llenarCombo(combo, data.documentos, "iddocumento", "documento");
                if (!!registroVentasModelo.venta.cargando) {
                    combo.val(registroVentasModelo.venta.iddocumento);
                    combo.change();
                    registroVentasModelo.venta.cargando = undefined;
                }
                break;
        }
    },
    /**
     * Muestra un dialogo con el formulario para la búsqueda de una suscripción
     * @returns {void}
     */
    mostrarBusqueda: function () {
        self.limpiarDialogoBuscarSuscripcion();
        self.dialogoActual = $('div#divDialogoBusqueda').dialogo({
            modal: true,
            width: 850,
            title: 'Buscar suscripción',
            buttons: {
                Cancelar: function () {
                    $(this).dialog('close');
                }
            }
        });
        $('.ui-dialog').css('top', ($(window).scrollTop() + 90) + 'px');
        ;
    },
    /**
     * Muestra un dialogo con el formulario para la búsqueda de una venta
     * @returns {void}
     */
    mostrarFiltro: function () {
        var filtro = $('div#divBuscarVenta');
        self.dialogoActual = filtro.dialogo({
            modal: true,
            width: 850,
            title: 'Buscar una venta',
            buttons: {
                Cancelar: function () {
                    self.limpiarFiltro();
                    $(this).dialog('close');
                }
            }
        });
    },
    /**
     * Consulta los barrios según el municipio seleccionado
     * @returns {void}
     */
    consultarBarrios: function () {
        var idmunicipio = $(this).val();
        if (idmunicipio !== '-1') {
            registroVentasControl.consultarBarrios({'idmunicipio': idmunicipio}, self.onConsultarBarriosCompleto);
        }
    },
    /**
     * Se carga combo de barrios
     * @param  {Array} data - Arreglo de barrios
     * @returns {void}
     */
    onConsultarBarriosCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                $('#spanMensaje').text(__app.mensajes.sinResultados);
                break;
            case 1:
                __dom.llenarCombo('#cmbBarrio', data.barrios, "idbarrio", "barrio");
                break;
        }
    },
    /** Valida la información del filtro de ventas 
     * @param {string} estado Estados permitidos a consultar separados por coma
     * @returns {void}
     */
    validarBusqueda: function (estado) {
        var cont = 0;
        var selector = $('#divBuscarVenta input[type="text"]');
        for (var i = 0; i < selector.length; i++) {
            if (selector[i].value !== '') {
                cont++;
                break;
            }
        }

        if (cont === 0) {
            $('#spanMensaje').text(__app.mensajes.diligenciarCampos).show();
            return;
        }
        self.consultarVenta(estado);
    },
    /**
     * Se consulta las ventas que coincidan con los parámetros de búsqueda
     * @param {string} estado Estados permitidos a consultar separados por coma
     * @returns {void}
     */
    consultarVenta: function (estado) {
        var inicial = $('#txtFiltroFechaInicio').val();
        var ffinal = $('#txtFiltroFechaFin').val();
        var parametros = {
            'estado': estado,
            'idventa': $('#txtFiltroNumVenta').val(),
            'cedula': $('#txtFiltroDocumento').val(),
            'idepropiedad': $('#txtFiltroIdPropiedad').val(),
            'idsuscripcion': $('#txtFiltroIdSuscripcion').val(),
            'nombretercero': $('#txtFiltroNombreTercero').val(),
            'codigoanterior': $('#txtFiltroCodigoAnterior').val(),
            'fechainicio': '',
            'fechafin': ''
        };
        if (inicial !== '' && ffinal !== '') {
            parametros.fechainicio = inicial;
            parametros.fechafin = ffinal;
        }
        registroVentasControl.consultarVenta({parametros: parametros}, self.onConsultarVentaCompleto);
    },
    /** Carga la información de la venta(s) encontradas en el sistema
     * @param  {Array} data - Arreglo con información de ventas encontradas
     * @returns {void}
     */
    onConsultarVentaCompleto: function (data) {




        $('.btnFinalizar').remove();
        $('#divListaSelección').empty();
        $('#divArchivosContrato .btnSimple').removeClass('descargado');
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(__app.mensajes.sinResultados, __app.mensajes.atencion);
                break;
            case 1:
                registroVentasModelo.informacionVenta = data.listaventas;
                if (data.listaventas.length === 1) {

                    /***************Nuevo 09/08/2017  OSCAR********************************/

                    self.cambiosDeVentas(data);

                    /******************************************************/

                    self.configurarAplicacionAlConsultarVenta(data.listaventas[0].infoventa);
                    return;
                }

                self.cambiosDeVentas(data);
                self.cargarVentasSeleccionables(data.listaventas);
                var btn = $('<button>').text('Finalizar').addClass('btnSimple btnFinalizar');
                btn.on('click', function () {
                    var ventaSeleccionada = $('input[name="radio_venta"]:checked');
                    if (ventaSeleccionada.length === 0) {
                        $('#pMensajeVenta').text(__app.mensajes.seleccionarOpcion).show();
                        return;
                    }
                    var venta = data.listaventas[ventaSeleccionada.attr('data-indice')].infoventa;
                    self.configurarAplicacionAlConsultarVenta(venta);
                });
                btn.insertAfter($('#divListaSelecciónVenta'));

                break;
        }
    },
    /********************************************************************************************************************************************/
    /********************************************************************************************************************************************/


    cambiosDeVentas: function (data) {

        $("#tblCambiosVentas").empty();
        for (var i = 0; i < data.listaventas[0].infoventa.detallesCambios.length; i++) {

            if (data.listaventas[0].infoventa.detallesCambios[i].length > 0) {
                for (var d = 0; d < data.listaventas[0].infoventa.detallesCambios[i].length; d++) {
                    var table = $('<table>').addClass('tabla');
                    table.attr('id', 'tbldetalleventa' + i);
                    $("#tblCambiosVentas").append(table);
                    fillTable('tbldetalleventa' + i, 'formatoCambiosVentas', data.listaventas[0].infoventa.detallesCambios[i], data.listaventas[0].infoventa.detallesCambios[i][d].comentario);
                }
            }
        }
    },

    /********************************************************************************************************************************************/
    /********************************************************************************************************************************************/


    /**
     * Configura el formulario para cargar la venta seleccionada en el filtro
     * @param {Object} venta - Objeto con información de la venta seleccionada
     * @returns {void}
     */
    configurarAplicacionAlConsultarVenta: function (venta) {
        self.limpiarFiltro();
        self.limpiarFormulario();
        registroVentasModelo.informacionVenta = venta;
        registroVentasModelo.suscripcion = venta.infosuscripcion.suscripcion;
        $('#pMensajeVenta').hide();
        $('#btnVerDetalle').attr('disabled', false);
        $('#btnVerPropiedad').attr('disabled', false);
        self.dialogoActual.dialog('close');
        self.onConsultarDetalleVentaCompleto(venta);
    },
    /**
     * Carga ventas en la parte inferior del dialogo de filtro cuando se retorna más de una venta
     * @param {Array} listaventas - Lista de objetos con información de ventas filtradas
     * @returns {void}
     */
    cargarVentasSeleccionables: function (listaventas) {
        var divVenta = $('<div>').addClass('listaSeleccion');
        for (var index = 0; index < listaventas.length; index++) {
            var ventas = listaventas[index];
            var venta = ventas.infoventa.venta;
            var tercero = ventas.infoventa.infosuscripcion.tercero;
            var propiedad = ventas.infoventa.infosuscripcion.propiedad;
            var div = $('<div>');
            var radio = $('<input type="radio">');
            var label = $('<label>');
            radio.val(venta.idventa);
            radio.attr('id', 'radio_venta_' + index);
            radio.attr('data-indice', index);
            radio.attr('name', 'radio_venta');

            label.attr('for', 'radio_venta_' + index);
            label.text(venta.numeroventa + ' - ' + tercero.idsuscripcion + ' - ' + propiedad.municipio + ' - ' + propiedad.barrio + ' - ' + propiedad.direccion);
            div.append(radio, label);
            divVenta.append(div);
        }
        $('#divListaSelecciónVenta').empty().append(divVenta);
    },
    /** Guarda información de la venta en el modelo e inicia el cargue de la información
     * @param  {object} data - Detalle de la venta elegida o buscada.
     * @returns {void}
     */
    onConsultarDetalleVentaCompleto: function (data) {
        if (!data.firmainstaladora) {
            __dom.lanzarAlerta('La venta no tiene firma instaladora.', 'Advertencia');
            return;
        }
        self.consultarFuncionario(data.firmainstaladora.idfirmainstaladora);
        if (self.appload.container) {
            self.appload.container.find('div.files-list').empty();
        }
        var venta = data.venta;
        var resumen = data.infosuscripcion;
        var suscriptor = resumen.tercero;
        var estadoSus = resumen.suscripcion.estado;
        //Se guarda información en el modelo para ser utilizada desde aprobarventa y registrar ventas
        registroVentasModelo.financiacion = data.financiacion;
        registroVentasModelo.idsuscripcion = suscriptor.idsuscripcion;
        registroVentasModelo.conceptosSuscripcion = resumen.conceptos;
        registroVentasModelo.detallesSuscripcion = resumen.suscripcion;
        registroVentasModelo.botonesformatos = $('#divArchivosContrato button');
        registroVentasModelo.detallesSuscripcion.propiedad = resumen.propiedad;
        registroVentasModelo.detallesSuscripcion.documentotercero = resumen.tercero.cedula;
        registroVentasModelo.detallesSuscripcion.nombretercero = resumen.tercero.nombretercero;
        registroVentasModelo.detallesSuscripcion.suscripcion = {estado: resumen.suscripcion.estado};
        registroVentasModelo.venta = venta;
        registroVentasModelo.venta.cargando = 1;
        $("#pestanias").tabs("enable", 1);
        $("#pestanias").tabs("enable", 2);


        $('#btnSubirArchivos').hide();
        $('#liAdjuntos, #liFormatos').show();
        var tipoVenta = estadoSus !== 'P' ? 'Suscripción existente' : 'Nueva matrícula';
        $('#txtTipoVenta').val(tipoVenta).attr('data-tipo', estadoSus !== 'P' ? 'P' : 'S');

        self.cargarInformacionVenta(venta);
        self.mostrarArchivos(venta.adjuntos);
        self.cargarPropiedad(resumen.propiedad);
        self.cargarInformacionAdicionalVenta(data);
        self.cargarSuscripcion(resumen.suscripcion);
        self.cargarInformacionTercero(resumen.tercero);

        var liquidaciones = '';
        for (var y = 0; y < venta.liquidaciones.length; y++) {
            liquidaciones += venta.liquidaciones[y].idliquidacion + ',';
        }
        liquidaciones = liquidaciones.substring(0, liquidaciones.length - 1);
        registroVentasModelo.stringLiquidacion = liquidaciones;
        self.validarVentaBuscada(data);
    },
    /**
     * Valida la información de una venta para configurar lo que podrá visualizar según el modelo y el estado de la venta
     * @returns {void}
     */
    validarVentaBuscada: function (data) {
        var venta = data.venta;
        var resumen = data.infosuscripcion;
        self.validarFinanciacion(venta, data.financiacion);
        var modeloAprobar = registroVentasModelo.modelo === 'aprobarVista';

        var estado = modeloAprobar ? 'A' : venta.estado;
        $('.appload-input').show();
        switch (estado) {
            case 'F':
            case 'A':
                $('#tblConcepto').empty();
                $('.appload-input').hide();
                $('#contenedorTodos').hide();
                $('#seleccionLiquidacion').hide();
                $('#txtEstadoVenta').val('Aprobada');
                $('#uploadFiles, #divConcepto').show();
                $('#btnAprobar, #btnEliminar, #btnGrabar, #btnLiquidar').attr('disabled', 'disabled');
                fillTable('tblConceptosInformativos', 'formatoConceptosInformativos', data.detalleventa, '');
                (registroVentasModelo.cajas) ? registroVentasModelo.cajas.attr('disabled', 'disabled') : null;
                fillTable('tblLiquidaciones', 'formatoLiquidacion', venta.liquidaciones, 'Liquidaciones').show();
                break;
            case 'P':
                $('#uploadFiles').show();
                $('.appload-input').show();
                $('#tblLiquidaciones').hide();
                if (registroVentasModelo.cajas) {
                    registroVentasModelo.cajas.removeAttr('disabled');
                }
                $('#txtEstadoVenta').val('Pendiente');
                $('#btnGrabar, #btnLiquidar').removeAttr('disabled');
                for (var h = 0; h < data.detalleventa.length; h++) {
                    data.detalleventa[h].eliminado = 'N';
                }
                self.cargarLiquidacionesVenta(venta.liquidaciones);
                self.onConsultarConceptosCompleto({codigoRespuesta: 1, conceptos: data.detalleventa});
                break;
        }

        if (modeloAprobar) {
            that.onConsultarCompletoVenta(data);
            return;
        }
        var info = {
            idmunicipio: resumen.propiedad.idmunicipio,
            idtipousosuscripcion: resumen.suscripcion.idtipousosuscripcion
        };
        registroVentasModelo.conceptosLiquidados = JSON.parse(JSON.stringify(data.detalleventa));
        //El setimeout esperera que se cargue la información en el modelo de la que depende la consulta
        setTimeout(registroVentasControl.consultarTipoDocumento(info, self.consultarTipoDocumento), 100);
    },
    /**
     * Valida la pestañas de visualización de financiación de ventas
     * return {void}
     */
    validarFinanciacion: function (venta, financiacion) {
        var modeloAprobar = registroVentasModelo.modelo === 'aprobarVista';
        if (venta.metodopago === 'F' && !!financiacion && (venta.estado !== 'P' || modeloAprobar)) {
            $('#liFinanciacion').show();
            financiacion.ciclo = venta.ciclo;
            $("#pestanias").tabs("enable", 3);
            financiacion.periodo = venta.periodo;
            self.consultarFinanciacionCompleto(financiacion);
            financiacion.numerofinanciacion = venta.idfinanciacion;
            var cuotaInicial = venta.cuotainicial ? venta.cuotainicial : 0;
            self.cargarValorCajaCurrency($('#txtValorCuotaInicial'), cuotaInicial);
            return;
        }
        $('#liFinanciacion').hide();
        $('#divInfoFinanciacion').hide();
        $("#pestanias").tabs("option", "disabled", [3]);
        $('#pFinanciacion').text('La venta no tiene financiaciones.');
    },
    /** Obtiene la información de la financiación de la venta y es visualizada en la pestaña
     * @param {object} data - Información de la financiación
     * @returns {void}
     **/
    consultarFinanciacionCompleto: function (fin) {
        if (!!fin) {
            var vlrCuota = 0;
            var vlrFinanciado = 0;
            var vlrFinanciable = 0;
            self.cargarInformacionFinanciacion(fin);
            self.mostrarArchivosFinanciacion(fin.adjuntos ? fin.adjuntos : []);
            $('#tblFinanciaciones, #tblNoFinanciables').empty();

            if (fin.financiable.length > 0) {
                var tblFinanciacion = fillTable("tblFinanciaciones", "formatoFinanciacion", fin.financiable, "Financiaciones de la venta");
                tblFinanciacion.find('tbody td[header="thDetallesFinanciacion"] input').on('click', self.verDetallesFinanciacion);
                for (var indice in fin.financiable) {
                    var financiacion = fin.financiable[indice];
                    vlrFinanciable += financiacion.valortotal ? parseFloat(financiacion.valortotal) : 0;
                    vlrCuota += financiacion.valorcuotaincial ? parseFloat(financiacion.valorcuotaincial) : 0;
                    vlrFinanciado += financiacion.valorfinanciar ? parseFloat(financiacion.valorfinanciar) : 0;
                }
                registroVentasModelo.financiaciones = fin.financiable;
            }
            if (fin.nofinanciable.length > 0) {
                fillTable("tblNoFinanciables", "formatoConceptosInformativos", fin.nofinanciable, "Conceptos No Financiables");
                for (var index in fin.nofinanciable) {
                    var concepto = fin.nofinanciable[index];
                    vlrCuota += concepto.valortotal ? parseFloat(concepto.valortotal) : 0;
                }
            }
            self.cargarValorCajaCurrency($('#txtValorMinPago'), vlrCuota);
            self.cargarValorCajaCurrency($('#txtValorFinanciar'), vlrFinanciado);
            self.cargarValorCajaCurrency($('#txtValorFinanciable'), vlrFinanciable);
        }
//        self.apploadFinanciacion.container.find('.appload-input').hide();
    },
    /**
     * Muestra dialogo con los detalles adicionales de una venta
     * @returns {void}
     */
    verDetallesFinanciacion: function () {
        var id = $(this).attr('data-id');
        var div = $('#divDetallesFinanciacion');
        var detalles = registroVentasControl.consultarConceptoFinanciacionPorId(id);
        if (!detalles) {
            return;
        }

        fillTable('tblDetalleFinanciacion', 'formatoDetallesFinanciacion', detalles, 'Formato de la financiacion #' + id);
        div.dialogo({
            width: 850,
            modal: true,
            title: 'Detalles de la financiación',
            buttons: {
                'Aceptar': function () {
                    div.dialog('close');
                }
            }
        });

    },
    /**
     * Convierte el valor de una caja de texto a formato currency
     * @param {object} caja - Caja de texto donde se agregarán los atributos
     * @param {number} valor - Valor de la caja que se pondrá en formato dinero
     * @returns {void}
     */
    cargarValorCajaCurrency: function (caja, valor) {
        var valorCurrency = valor.toString().toCurrency();
        caja.attr('data-value', valor);
        caja.val(valorCurrency);
    },
    /**
     * Carga la información de la financiación de una venta en las respectivas cajas de texto
     * @param {object} financiacion - Información de la financiación de la venta
     * @returns {void}
     */
    cargarInformacionFinanciacion: function (financiacion) {
        var solicitante = financiacion.solicitante;
        var entidad = financiacion.financieraentidad;
        var infoFinanciacion = financiacion.financiable[0];
        $('#pFinanciacion').text('');

        $('#divInfoFinanciacion').show();
        $('#divFinanciacion legend span').text(financiacion.numerofinanciacion);

        $('#txtCiclo').val(financiacion.ciclo);
        $('#txtPeriodo').val(financiacion.periodo);
        $('#txtNumCuotas').val(infoFinanciacion.numerocuota);
        $('#txtFecha').val(infoFinanciacion.fechafinanciacion);
        $('#txtDocSolicitante').val(financiacion.solicitante.cedula);
        $('#txtBanco').val(entidad.nombretercero).attr('data-id', financiacion.identidadfinanciera);
        $('#txtParentesto').val(infoFinanciacion.parentesco).attr('data-id', infoFinanciacion.idparentesco);
        $('#txtNombreSolicitante').val(solicitante.nombretercero).attr('data-id', financiacion.idsolicitante);
    },
    /** Cargar los archivos de la financiación en la vista
     * @param {object} data - Información de los archivos que se han cargado.
     * @returns {void}
     */
    mostrarArchivosFinanciacion: function (data) {
        var div = $('#divArchivos');
        div.find('span.pMensaje').remove();
        if (data.length > 0) {
            if (!self.apploadFinanciacion.container) {
                self.apploadFinanciacion.control.change();
            }
            for (var i = 0; i < data.length; i++) {
                var info = data[i];
                var divItem = self.apploadFinanciacion.addFileToList({url: info.ruta, name: info.nombrearchivo});
                $('<span class="fa fa-check-circle-o">').insertBefore(divItem.find('i.fa:first'));
                divItem.find('button').removeAttr('disabled');
                divItem.addClass('uploaded-item');
            }
        } else {
            div.append($('<span>').addClass('pMensaje').text('La financiación no tiene archivos adjuntos.'));
        }
    },
    /**
     * Valida la información del filtro de suscripciones y envía la solicitud al servidor
     * @returns {void}
     */
    consultarSuscripcion: function () {
        $('#spanMensaje').text('');
        if ($('#cmbMunicipio').val() === '' || $('#cmbMunicipio').val() === '-1') {
            __dom.lanzarAlerta('Elija un municipio', __app.mensajes.atencion);
            return;
        }
        var cont = 0;
        var selector = $('#divFiltroSuscriptor input[type="text"]');
        $('#divFiltroSuscriptor #cmbBarrio').val() === '-1' ? cont : cont++;
        var barrio = $('#cmbBarrio').val() === '-1' ? '' : $('#cmbBarrio').val();

        for (var index = 0; index < selector.length; index) {
            if (selector[index].value !== '') {
                cont++;
            }
        }
        if (cont === 0) {
            $('#spanMensaje').text(__app.mensajes.diligenciarCampos).show();
            return;
        }
        var data = {
            'idbarrio': barrio,
            'idmunicipio': $('#cmbMunicipio').val(),
            'direccion': $('#txtDireccionBuscar').val(),
            'idtercero': registroVentasModelo.idTercero,
            'idsuscripcion': $('#txtIdSuscripcion').val(),
            'cedula': $('#txtDocumentoTerceroBuscar').val(),
            'numerocatastral': $('#txtNumeroCatastralBuscar').val(),
            'numeropropiedad': $('#txtNumeroPropiedadBuscar').val(),
            'codigoanterior': $('#txtCodigoAnteriorBuscar').val(),
            'ruta': $('#txtNumeroRuta').val()
        };
        registroVentasControl.consultarSuscripcion(data, self.onConsultarSuscripcionCompleto);

    },
    /**
     * Captura la respuesta enviada por el servidor, cuando se consultan suscripciones, en caso de que
     * haya más de una se muestran en lista para que el usuario elija.
     * luego de elegir se hace petición al servidor de los detalles de dicha suscripción.
     * @param  {object} data - El resultado de la petición ajax para guardar la información de la suscripción
     * @returns {void}
     */
    onConsultarSuscripcionCompleto: function (data) {
        $('#divArchivosContrato .btnSimple').removeClass('descargado');
        $('.btnFinalizar').remove();
        $('#divListaSelección').empty();
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(__app.mensajes.sinResultados, __app.mensajes.atencion);
                break;
            case 1:
                registroVentasModelo.suscripcion = data.suscripciones;

                if (data.suscripciones.length === 1) {
                    self.onConsultarDetalleSuscripcionVenta(data.suscripciones[0]);
                    return;
                }
                var divSuscripciones = $('<div>').addClass('listaSeleccion');
                $.each(data.suscripciones, function (index, suscripcion) {
                    var div = $('<div>');
                    var radio = $('<input type="radio">');
                    var label = $('<label>');
                    radio.val(suscripcion.idsuscripcion);
                    radio.attr({
                        'data-indice': index,
                        'id': 'radio_susc_' + index,
                        'name': 'radio_suscripciones'
                    });

                    label.attr('for', 'radio_susc_' + index);
                    label.text(suscripcion.cedula + ' - ' + suscripcion.nombretercero + ' - ' + suscripcion.barrio + ' - ' + suscripcion.direccion);
                    div.append(radio).append(label);
                    divSuscripciones.append(div);
                });
                var btn = $('<button>').text('Finalizar').addClass('btnSimple btnFinalizar');
                btn.on('click', function () {
                    var suscSeleccionada = $('input[name="radio_suscripciones"]:checked');
                    if (suscSeleccionada.length === 0) {
                        $('#spanMensaje').text(__app.mensajes.seleccionarOpcion).show();
                    }
                    divSuscripciones.remove();
                    var suscripcion = registroVentasModelo.suscripcion = data.suscripciones[suscSeleccionada.attr('data-indice')];
                    self.onConsultarDetalleSuscripcionVenta(suscripcion);
                });
                $('#divListaSelección').append(divSuscripciones);
                btn.insertAfter($('#divListaSelección'));

                break;
        }
    },
    /**
     * Se termina de hacer la búsqueda de la suscripción
     * @param {object} suscripcion - Sucripción buscada y/o seleccionada
     * @returns {void}
     */
    onConsultarDetalleSuscripcionVenta: function (suscripcion) {
        $('#spanMensaje').hide();
        self.limpiarFormulario();
        registroVentasModelo.suscripcion = suscripcion;
        registroVentasModelo.idsuscripcion = suscripcion.idsuscripcion;
        registroVentasControl.consultarDetalleSuscripcion({'idsuscripcion': suscripcion.idsuscripcion},
                self.onconsultarDetalleSuscripcionCompleto);
        registroVentasControl.consultarVentaSuscripcion({'idsuscripcion': suscripcion.idsuscripcion, 'estado': "'P', 'A', 'F', 'E', 'C'"},
                self.onConsultarVentaSuscripcionCompleto);
        self.dialogoActual.dialog('close');
    },
    /**
     * Captura la respuesta del servidor cuando se consultan las ventas de una suscripción
     * @param {object} data - Respuesta del servidor con listado de las ventas  de una suscripción
     * @returns {void}
     */
    onConsultarVentaSuscripcionCompleto: function (data) {
        if (data.codigoRespuesta === 1) {
            var div = $('#divListadoVentasSucripcion');
            var idsuscripcion = registroVentasModelo.idsuscripcion;
            fillTable('tblVentasSucripcion', 'formatoVentasSuscripcion', data.listaventas, 'Ventas de la suscripción ' + idsuscripcion);

            div.dialogo({
                modal: true,
                width: 850,
                title: 'Ventas de la suscripción',
                buttons: {
                    Aceptar: function () {
                        div.dialog('close');
                    }
                }
            });
        }
    },
    /**
     * Captura la respuesta del servidor, cuando se consulta los detalles de la suscripción.
     * Carga en cajas de texto la información del tercero e invoca métodos para terminar de mostrar
     * la información de la suscripción
     * @param  {object} data - Respuesta del servidor, para mostrar información de la suscripción seleccionada
     * @returns {void}
     */
    onconsultarDetalleSuscripcionCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 1:
                var resumen = data.resumensuscripcion;
                var estadoSus = resumen.suscripcion.estado;

                registroVentasModelo.conceptosSuscripcion = resumen.conceptos;
                registroVentasModelo.detallesSuscripcion = data.resumensuscripcion;
                self.cargarInformacionTercero(resumen.tercero);
                self.cargarSuscripcion(resumen.suscripcion);
                self.cargarPropiedad(resumen.propiedad);

                $('#btnGrabar, #btnLiquidar').removeAttr('disabled');
                $('#btnVerDetalle').attr('disabled', false);
                $('#btnVerPropiedad').attr('disabled', false);
                $('#txtEstadoVenta').val('Pendiente');
                $('#txtTipoVenta').val((estadoSus !== 'P') ? 'Suscripción existente' : 'Nueva matrícula')
                        .attr('data-tipo', (estadoSus !== 'P') ? 'P' : 'S');
                registroVentasControl.consultarTipoDocumento({idmunicipio: resumen.propiedad.idmunicipio,
                    idtipousosuscripcion: resumen.suscripcion.idtipousosuscripcion}, self.consultarTipoDocumento);
                registroVentasModelo.venta = {estado: 'P', tipo: 'N'};
                break;
            case 0:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                break;
        }
    },
    /** Carga combo de tipos de documento y selecciona uno en caso de que se acabe de buscar la venta
     * @param {object} data - Respuesta del servidor con tipos de documeto
     * @returns {void}
     */
    consultarTipoDocumento: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                $('#spanMensaje').text(__app.mensajes.sinResultados);
                break;
            case 1:
                __dom.llenarCombo('#cmbTipoDocumento', data.tipodocumentos, "idtipodocumento", "tipodocumento");
                if (!!registroVentasModelo.venta.cargando) {
                    $('#cmbTipoDocumento').val(registroVentasModelo.venta.idtipodocumento);
                    $('#cmbTipoDocumento').change();
                }
                break;
        }
    },
    /**
     * Cargar las liquidaciones que tiene seleccionadas una venta que se ha buscado
     * @param {Array} liquidaciones - Arreglo con información de las liquidaciones de la venta
     * @returns {void}
     */
    cargarLiquidacionesVenta: function (liquidaciones) {
        for (var indice in liquidaciones) {
            var itemLista = self.agregarItemListaLiquidacion(liquidaciones[indice]);
            $('#listaLiquidacionSeleccionada .listaSeleccion').append(itemLista);
        }
    },
    /**
     * Muestra información de la venta buscada en cajas de texto.
     * @param {object} venta - Es un objeto JSON con la información de la venta seleccionada
     * @returns {void}
     */
    cargarInformacionVenta: function (venta) {
        $('#txtFechaVenta').val(venta.fecha);
        $('#txtNumeroVenta').val(venta.idventa);
        $('#txtMetodoPago').val(venta.metodopago);
        $('#txtMedioPagoFactura').val(venta.mediopagofactura);
        $('#txtObservacion').val(venta.observacion);
        $('#txtFechaAprobacion').val(venta.fechaaprobada);
        $('#txtFechaEliminado').val(venta.fechaeliminada);
        $('#cmbTipoDocumento').val(venta.idtipodocumento);
        $('#txtNumFinanciacion').val(venta.idfinanciacion);
        $('#txtValorVenta').val(venta.valortotal.toString().toCurrency());
        $('#txtDocumento').val(venta.documento).attr('data-id', venta.iddocumento);
        $('#txtTipoDocumento').val(venta.tipodocumento).attr('data-id', venta.idtipodocumento);
        registroVentasModelo.valorConceptos = venta.valortotal;
    },
    /**
     * Muestra información específica de la venta buscada en cajas de texto.
     * @param {object} data - Es un objeto JSON con la información específica de la venta
     * @returns {void}
     */
    cargarInformacionAdicionalVenta: function (data) {
        var asesor = data.asesor;
        var empresa = data.firmainstaladora;
        registroVentasModelo.asesor = asesor;
        var organismoinspeccion = data.organismoinspeccion;
        registroVentasModelo.idEmpresaInstaladora = empresa;
        if (asesor) {
            $('#txtDocumentoAsesorVenta').val(asesor.cedula);
            $('#txtTipoTerceroVenta').val(asesor.tipotercero);
            $('#txtNombreAsesorVenta').val(asesor.nombretercero);
        }
        $('#txtFechaFinCertificado').val(empresa.fincertificado);
        $('#txtFechaFinSIC').val(empresa.finsic);
        $('#txtEmpresaInstaladora').val(empresa.firmainstaladora);
        $('#txtFuncionarioCertificador').val(empresa.funcionario);
        $('#txtFechaInicioCertificado').val(empresa.iniciocertificado);
        $('#txtFechaInicioSIC').val(empresa.iniciosic);
        $('#cmbFuncionarioCertificador').val(empresa.cedulafuncionario);
        registroVentasModelo.idcompetenciafirma = empresa.idcompetenciafirma;
        $('#txtCertificado').val(empresa.competencia).attr('title', empresa.competencia);
        if (organismoinspeccion) {
            registroVentasModelo.idorganismoinspeccion = organismoinspeccion.idtercero;
            $('#txtOrganismosInspeccion').val(organismoinspeccion.nombretercero);
        }
    },
    /**
     * Muestra un dialogo con la información del tercero responsable de la suscripción.
     * @returns {void}
     */
    cargarInformacionTercero: function (suscriptor) {
        $('#txtNit').val(suscriptor.cedula);
        $('#txtNombre').val(suscriptor.nombretercero);
        $('#txtTipoTercero').val(suscriptor.tipotercero);
        $('#txtDetalleDocumento').val(suscriptor.cedula);
        $('#txtDetalleNombre').val(suscriptor.nombretercero);
        $('#txtIdTercero').val(suscriptor.idtercero);
        $('#txtTelefonoFijo').val(suscriptor.telefonofijo);
        $('#txtTelefonoCelular').val(suscriptor.telefonocelular);
        $('#txtIdSuscriptor').val(suscriptor.idsuscriptor);
        $('#txtConvenio').val(suscriptor.convenio);
        $('#txtDetalleDescripcion').val(suscriptor.descripcion);
    },
    /**
     * Muestra el dialogo con la información del tercero
     * @returns {void}
     */
    mostrarDialogoTercero: function () {
        self.dialogoActual = $('#divDetalleTercero').dialogo({
            modal: true,
            width: 850,
            title: 'Datos del tercero',
            buttons: {
                Aceptar: function () {
                    self.dialogoActual.dialog('close');
                }
            }
        });
    },
    /**
     * Carga información de la suscripción seleccionada en cajas de texto.
     * @param {object} suscripcion - Es un objeto JSON con la información de la suscripción seleccionada
     * @returns {void}
     */
    cargarSuscripcion: function (suscripcion) {
        $('#txtIdSuscripcionDetalle').val(suscripcion.idsuscripcion);
        $('#txtCodigoAnterior').val(suscripcion.codigoanterior);
        $('#txtTipoSuscripcion').val(suscripcion.tiposuscripcion);
        $('#txtLiquidacion').val(suscripcion.liquidacion);
        $('#txtTipoUso').val(suscripcion.tipousosuscripcion);
        $('#txtDescripcion').val(suscripcion.descripcion);
        $('#txtEstrato').val(suscripcion.estrato);
        var estado = suscripcion.estado === 'A' ? 'Activa' : (suscripcion.estado === 'U' ? 'Suspendido por el usuario' : 'Pendiente');
        $('#txtEstado').val(estado);

    },
    /**
     * Carga los datos de la propiedad en cajas de texto.
     * @param  {object} propiedad - Es un objeto JSON con la información de la propiedad.
     * @returns {void}
     */
    cargarPropiedad: function (propiedad) {
        registroVentasModelo.propiedadSeleccionada = propiedad;
        var altoriesgo = propiedad.altoriesgo === 'N' ? 'No' : 'Sí';
        var zona = propiedad.zona === 'U' ? 'Urbana' : 'Rural';
        $('#txtDirrecion').val(propiedad.direccion);
        $('#txtMunicipio').val(propiedad.municipio);
        $('#txtBarrio').val(propiedad.barrio);
        $('#txtNumeroPropiedad').val(propiedad.numeropropiedad);
        $('#txtTipoPropiedad').val(propiedad.tipopropiedad);
        $('#txtMunicipioPropiedad').val(propiedad.municipio);
        $('#txtBarrioPropiedad').val(propiedad.barrio);
        $('#txtDireccion').val(propiedad.direccion);
        $('#txtSeccion').val(propiedad.seccion);
        $('#txtManzana').val(propiedad.manzana);
        $('#txtAltoRiesgo').val(altoriesgo);
        $('#txtNumeroCatastral').val(propiedad.numerocatastral);
        $('#txtZona').val(zona);
        $('#txtDescripcionPropiedad').val(propiedad.descripcion);
    },
    /**
     * Despliega un cuadro de dialogo con la información de la propiedad de la suscripción seleccionada.
     * @returns {void}
     */
    mostrarDialogoPropiedad: function () {
        $('fieldset#fieldsetPropiedad').dialogo({
            modal: true,
            width: 850,
            title: 'Información Propiedad',
            buttons: {
                Aceptar: function () {
                    $(this).dialog('close');
                }
            }
        });
    },
    /**
     * Asigna funcionalidad a cajas de texto para autocompletar con sus respectivas propiedades y recursos.
     * @returns {void}
     */
    cargarAutocomplete: function () {
        __dom.configurarAutocomplete(
                $('#txtEmpresaInstaladora'), self.sourceAutoComplete,
                function (event, ui) {
                    registroVentasModelo.idEmpresaInstaladora = ui.item.idVal;
                    self.consultarFuncionario(ui.item.idVal);
                },
                function () {
                    registroVentasModelo.idEmpresaInstaladora = undefined;
                }
        );

        __dom.configurarAutocomplete(
                $('#txtNombreAsesorVenta'), self.sourceAutoCompleteAsesor,
                function (event, ui) {
                    registroVentasModelo.asesor = ui.item.todo;
                    $('#txtDocumentoAsesorVenta').val(ui.item.todo.documento);
                    $('#txtTipoTerceroVenta').val(ui.item.todo.tipotercero);
                },
                function () {
                    registroVentasModelo.asesor = undefined;
                    $('#txtDocumentoAsesorVenta').val('');
                    $('#txtTipoTerceroVenta').val('');
                }
        );
        __dom.configurarAutocomplete(
                $('#txtNombreTerceroBuscar, #txtFiltroNombreTercero'), self.sourceAutoCompleteTercero,
                function (event, ui) {
                    registroVentasModelo.idTercero = ui.item.idVal;
                    $('#idTercero').val(ui.item.idVal);
                },
                function () {
                    registroVentasModelo.idTercero = undefined;
                    $('#idTercero').val('');
                }
        );
        __dom.configurarAutocomplete(
                $('#txtOrganismosInspeccion'), self.sourceAutoCompleteOrganismos,
                function (event, ui) {
                    registroVentasModelo.idorganismoinspeccion = ui.item.idVal;
                },
                function () {
                    registroVentasModelo.idorganismoinspeccion = undefined;
                }
        );
    },
    /**
     * Se valida la información de txtNombreTerceroBuscar y hace la petición al servidor.
     * @param  {object} request - Valor actual de la entrada de texto para petición.
     * @param  {object} response - Lo que se genera a partir de la respuesta del servidor.
     * @returns {void}
     */
    sourceAutoCompleteTercero: function (request, response) {
        self.request = request;
        self.response = response;
        var datos = {};
        if (request.term.trim() !== "") {
            datos.nombre = request.term.trim();
            registroVentasControl.consultarTerceros(datos, self.mostrarResultadoTercero);
        }
    },
    /**
     * Captura la respuesta del servidor y la muestra de forma gráfica en el campo de texto.
     * @param {object} data - Información del tercero enviada por el servidor
     * @returns {void}
     */
    mostrarResultadoTercero: function (data) {
        var result = [];
        if (data.codigoRespuesta === 1) {
            for (var index in data.datos) {
                var item = data.datos[index];
                result.push({
                    label: item.nombretercero,
                    value: item.nombretercero,
                    documento: item.documento,
                    idVal: item.idtercero
                });
            }
            self.response(result);
        }
    },
    /**
     * Se valida la información de txtNombreAsesorVenta y hace la petición al servidor.
     * @param  {object} request - Valor actual de la entrada de texto para petición.
     * @param  {object} response - Lo que se genera a partir de la respuesta del servidor.
     * @returns {void}
     */
    sourceAutoCompleteAsesor: function (request, response) {
        self.request = request;
        self.response = response;
        var datos = {};
        if (request.term.trim() !== "") {
            datos.nombreasesor = request.term.trim();
            registroVentasControl.consultarAsesores(datos, self.mostrarResultadoAsesor);
        }
    },
    /**
     * Consulta la información de los organismos de control para autocomplete
     * @param {type} request - Información enviada al servidor
     * @param {type} response - Respuesta de coincidencias
     * @returns {void}
     */
    sourceAutoCompleteOrganismos: function (request, response) {
        self.request = request;
        self.response = response;
        var datos = {};
        if (request.term.trim() !== "") {
            datos.nombreorganismo = request.term.trim();
            registroVentasControl.consultarOrganismos(datos, self.mostrarResultadoOrganismo);
        }
    },
    /**
     * Captura la respuesta del servidor y la muestra de forma gráfica en el campo de texto.
     * @param {object} data - Información del asesor enviada por el servidor
     * @returns {void}
     */
    mostrarResultadoAsesor: function (data) {
        var result = [];
        if (data.codigoRespuesta === 1) {
            $.each(data.asesores, function (i, item) {
                result.push({
                    label: item.nombretercero,
                    value: item.nombretercero,
                    idVal: item.idtercero,
                    todo: item
                });
            });
        }
        self.response(result);
    },
    /**
     * Captura la respuesta del servidor y la muestra en una caja de texto
     * @param  {Object} data - Información del organismo enviada por el servidor
     * @returns {void}
     */
    mostrarResultadoOrganismo: function (data) {
        var result = [];
        if (data.codigoRespuesta === 1) {
            $.each(data.organismos, function (i, item) {
                result.push({
                    label: item.nombretercero,
                    value: item.nombretercero,
                    idVal: item.idtercero,
                    todo: item
                });
            });
        }
        self.response(result);
    },
    /**
     * Se valida la información de txtEmpresaInstaladora y hace la petición al servidor.
     * @param  {object} request - Valor actual de la entrada de texto para petición.
     * @param  {object} response - Lo que se genera a partir de la respuesta del servidor.
     * @returns {void}
     */
    sourceAutoComplete: function (request, response) {
        self.request = request;
        self.response = response;
        var datos = {};
        if (request.term.trim() !== "") {
            datos.nombrefirmainstaladora = request.term;
            registroVentasControl.consultarEmpresasInstaladora(datos, self.mostrarResultado);
        }
    },
    /**
     * Captura la respuesta del servidor y la muestra de forma gráfica en el campo de texto.
     * @param {object} data - Información de la firmas instaladoras enviada por el servidor
     * @returns {void}
     */
    mostrarResultado: function (data) {
        var result = [];
        if (data.codigoRespuesta === 1) {
            $.each(data.firmasinstaladoras, function (i, item) {
                result.push({
                    label: item.firmainstaladora,
                    value: item.firmainstaladora,
                    idVal: item.idfirmainstaladora
                });
            });
        }
        self.response(result);
    },
    /**
     * Hace petición ajax y captura la respuesta cuando se consultan los funcionarios según la
     * firma instaladora para llenar combo
     * @param {int} id - id de la firma instaladora elegida.
     * @returns {void}
     */
    consultarFuncionario: function (id) {
        registroVentasControl.consultarFuncionarios({idfirmainstaladora: id}, function (data) {
            switch (data.codigoRespuesta) {
                case 0:
                    $('#spanMensaje').text(__app.mensajes.sinResultados);
                    break;
                case 1:
                    registroVentasModelo.funcionarios = data.functionarios;
                    __dom.llenarCombo('#cmbFuncionarioCertificador', data.functionarios, "cedulafuncionario", "funcionario");
                    if (!!registroVentasModelo.venta) {
                        if (registroVentasModelo.venta.tipo !== 'N') {
                            $('#cmbFuncionarioCertificador').val(
                                    registroVentasModelo.informacionVenta.firmainstaladora.cedulafuncionario);
                        }
                    }
                    break;
            }
        });
    },
    /**
     * Visualiza la información en cajas de texto del funcionario que se haya elegido en
     * el combo que dispara el evento
     * @returns {void}
     */
    consultarFuncionarioCompleto: function () {
        if ($('#cmbFuncionarioCertificador').val() !== '-1') {
            var funcionario = registroVentasControl.consultarFuncionariosPorId($('#cmbFuncionarioCertificador').val());
            if (funcionario) {
                console.log(funcionario);
                $('#txtFechaFinCertificado').val(funcionario.fincertificado);
                $('#txtFechaFinSIC').val(funcionario.finsic);
                $('#txtFechaInicioCertificado').val(funcionario.iniciocertificado);
                $('#txtFechaInicioSIC').val(funcionario.iniciosic);
                registroVentasModelo.idcompetenciafirma = funcionario.idcompetenciafirma;
                $('#txtCertificado').val(funcionario.competencia).attr('title', funcionario.competencia);
            }
        }
    },
    /**
     * Valida el tipo de documento y suscripción y envía la solicitud al servidor
     * para consultar las liquidaciones
     * @returns {void}
     */
    consultarLiquidaciones: function () {
        if (registroVentasModelo.venta.estado === 'P') {
            $('#seleccionLiquidacion').show();
            if ($('#cmbDocumento').val() !== '-1' && $('#cmbTipoDocumento').val() !== '-1' && registroVentasModelo.idsuscripcion) {
                var data = {
                    iddocumento: $('#cmbDocumento').val(),
                    idtipodocumento: $('#cmbTipoDocumento').val(),
                    tipoventa: $('#txtTipoVenta').attr('data-tipo'),
                    idsuscripcion: registroVentasModelo.idsuscripcion
                };
                registroVentasControl.consultarLiquidacion(data, self.consultarLiquidacionesCompleto);
            } else {
                $('#listaLiquidacionSeleccion .listaSeleccion').empty();
            }
        }
    },
    /**
     * Carga liquidaciones consultas según documento y tipo de documento para seleccionar
     * @param {object} data - Respuesta del servidor.
     * @returns {void}
     */
    consultarLiquidacionesCompleto: function (data) {
        $('#listaLiquidacionSeleccion .listaSeleccion').empty();
        switch (data.codigoRespuesta) {
            case 0:
                $('#spanMensaje').text(__app.mensajes.sinResultados);
                break;
            case 1:
                var divLiquidaciones = $('#listaLiquidacionSeleccion .listaSeleccion');
                var divLiqSeleccionada = $('#listaLiquidacionSeleccionada .listaSeleccion');
                var liquidacionesSeleccionadas = divLiqSeleccionada.find('input:checkbox');
                for (var index = 0; index < data.tiposdocumentos.length; index++) {
                    var liquidacion = data.tiposdocumentos[index];
                    var existeSeleccionada = false;
                    for (var h = 0; h < liquidacionesSeleccionadas.length; h++) {
                        var idliquidacionactual = parseInt(liquidacionesSeleccionadas[h].value);
                        if (idliquidacionactual === parseInt(liquidacion.idliquidacion)) {
                            existeSeleccionada = true;
                        }
                    }
                    if (existeSeleccionada) {
                        continue;
                    }
                    var select = self.agregarItemListaLiquidacion(liquidacion);
                    divLiquidaciones.append(select);
                }
                $('#listaLiquidacionSeleccion').append(divLiquidaciones);
                break;
        }
    },
    /**
     * Se arma una división con información de la liquidación
     * @param {object} liquidacion - Información de la liquidación que se agrega
     * @returns {jQuery} Checbox con liquidación
     */
    agregarItemListaLiquidacion: function (liquidacion) {
        var label = $('<label>');
        var id = liquidacion.idliquidacion;
        var check = $('<input type="checkbox">');

        check.val(id);
        check.attr('data-indice', id);
        check.attr('id', 'check_liqu_' + id);
        label.attr('for', 'check_liqu_' + id);
        label.text(id + ' - ' + liquidacion.liquidacion);
        var select = $('<div>').append(check, label);
        return select;
    },
    /**
     * Filtra la liquidaciones consultadas según el valor del campo de texto txtFiltroLiquidacion
     * @returns {void}
     */
    filtrarLiquidacion: function () {
        $('#listaLiquidacionSeleccion .listaSeleccion div').hide();
        var nombre = $('#txtFiltroLiquidacion').val().trim().toUpperCase();
        $('#listaLiquidacionSeleccion div label').each(function (i, item) {
            item = $(item);
            if (item.text().toUpperCase().indexOf(nombre) !== -1) {
                item.parent().show();
            }
        });
    },
    /**
     * Acomoda las liquidaciones en las listas según el botón presionado e invoca método para consultar conceptos
     * @returns {void}
     */
    mostrarLiquidacionSeleccionada: function () {
        var accion = $(this).attr('data-id');

        var origen = accion === 'seleccionar' ? 'listaLiquidacionSeleccion' : 'listaLiquidacionSeleccionada';
        var destino = accion === 'seleccionar' ? 'listaLiquidacionSeleccionada' : 'listaLiquidacionSeleccion';
        if (this.id === 'btnAllLiquidarSeleccion' || this.id === 'btnAllLiquidarDeseleccion') {
            var divisiones = $('#' + origen + ' .listaSeleccion div');
            divisiones.find('input[type="checkbox"]').removeAttr('checked');
            $('#' + destino + ' .listaSeleccion').append(divisiones);
        } else {
            var selector = $('#' + origen + ' div input:checked').parent();
            $.each(selector, function (i, check) {
                var div = check.cloneNode(true);
                $('#' + destino + ' .listaSeleccion').append(div);
                $(div).find('input:checked').attr('checked', false);
                check.remove();
            });
        }
        $('#txtValorVenta').val('');
        self.consultarConceptos();
    },
    /**
     * Valida liquidaciones seleccionadas y hace petición al servidor para consultar los
     * conceptos de las mismas.
     * @returns {void}
     */
    consultarConceptos: function () {
        var liquidaciones = '';
        var selector = $('#listaLiquidacionSeleccionada input[type="checkbox"]');
        registroVentasModelo.conceptosEliminados = []; //SE ELIMINAN LOS CONCEPTOS A ELIMINAR
        if (selector.length > 0) {
            $.each(selector, function (i, item) {
                liquidaciones += item.value + ',';
            });
            liquidaciones = liquidaciones.substring(0, liquidaciones.length - 1);
            registroVentasModelo.stringLiquidacion = liquidaciones;
            registroVentasControl.consultarConcepto({liquidaciones: liquidaciones}, self.onConsultarConceptosCompleto);
        } else {
            $('#divConcepto').hide();
            $('#tblConcepto').empty();
            registroVentasModelo.stringLiquidacion = '';
            registroVentasModelo.conceptos = [];
        }
    },
    /**
     * Se carga tabla de conceptos según las liquidaciones seleccionadas
     * Los conceptos pueden ser: Informativos, Editables, 
     * @param {Object} data - Contiene lista con información de los conceptos de las liquidaciones
     * @returns {void}
     */
    onConsultarConceptosCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                $('#spanMensaje').text(__app.mensajes.sinResultados);
                $('#divConcepto').hide();
                break;
            case 1:
                $('#divConcepto').show();
                //registroVentasModelo.conceptos = [];
                //Validar la información que se guardará en el objeto de conceptos
                registroVentasModelo.conceptos = self.validarInformacionConcepto(data);
                if (registroVentasModelo.conceptos.length > 0) {
                    var conceptoInformativo = [];
                    var conceptosSeleccionar = [];
                    var conceptosEditables = [];
                    for (var i = 0; i < registroVentasModelo.conceptos.length; i++) {
                        var concepto = registroVentasModelo.conceptos[i];
                        concepto.eliminado = concepto.eliminado === 'N' ? 'N' : 'S';
                        var editable = concepto.tipocalculo === 'F' || concepto.editable === 'N' || concepto.tiporegistro === 'N';
                        var eliminable = (concepto.eliminar === 'N') || concepto.valornulo === 'N';
                        if (concepto.tiporegistro === 'U' && concepto.valorunitario && concepto.valorunitario.length > 0) {
                            var valor = concepto.valorunitario;
                            concepto.cantidad = 1;
                            concepto.editado = true;
                            concepto.valortotal = valor;
                            concepto.valorunitario = valor;
                        }

                        //Si el concepto es eliminar 'I' debe ser informativo (Cambio pedido por Leo 29/Abril)
                        if ((editable && eliminable) || concepto.eliminar === 'I') {
                            concepto.eliminado = 'N';
                            conceptoInformativo.push(concepto);
                        } else {
                            if (concepto.eliminado !== 'S' || eliminable) {
                                concepto.eliminado = 'N';
                                conceptosEditables.push(concepto);
                            } else {
                                conceptosSeleccionar.push(concepto);
                            }
                        }
                    }

                    if (conceptoInformativo.length > 0) {
                        $('#contenedorConceptos').show();
                        fillTable("tblConceptosInformativos", "formatoConceptosInformativos", conceptoInformativo, '');
                    } else {
                        $('#contenedorConceptos').hide();
                        $('#tblConceptosInformativos').empty();
                    }
                    if (conceptosSeleccionar.length > 0) {
                        $('#contenedorTodos').show();
                        var tbl1 = fillTable("tblConceptosSeleccionables", "formatoConceptosSeleccionar", conceptosSeleccionar, "");
                        tbl1.find('tbody td[header="thSeleccionar"] input:checkbox').on('click', self.seleccionarEditar);
                    } else {
                        $('#contenedorTodos').hide();
                        $('#tblConceptosSeleccionables').empty();
                    }
                    if (conceptosEditables.length > 0) {
                        var tbl = fillTable("tblConcepto", "formatoConceptos", conceptosEditables, "Conceptos");
                        tbl.find('td[header="thEditar"] input[type="button"]').on('click', self.editarConcepto);
                        tbl.find('td[header="thEliminar"] input[type="button"]').on('click', self.eliminarConcepto);
                    } else {
                        $('#tblConcepto').empty();
                    }
                    if (data.conceptosLiquidados) {
                        registroVentasModelo.conceptosLiquidados = JSON.parse(JSON.stringify(registroVentasModelo.conceptos));
                    }

                }
                break;
        }
    },
    /**
     * Valida la información de los conceptos para guardar en el modelo
     * @returns {void}
     */
    validarInformacionConcepto: function (data) {
        if (data.conceptosLiquidados) {
            //En caso de que sea eliminado mantiene el valor de la primera consulta realizada
            for (var c = 0; c < data.conceptosLiquidados.length; c++) {
                var conceptoLiquidado = data.conceptosLiquidados[c];
                if (conceptoLiquidado.eliminado === 'S') {
                    var concepto = registroVentasControl.consultarConceptoPorId(conceptoLiquidado.idconcepto);
                    if (concepto) {
                        conceptoLiquidado.valor = concepto.concepto.valor;
                        conceptoLiquidado.cantidad = concepto.concepto.cantidad;
                        conceptoLiquidado.valortotal = concepto.concepto.valortotal;
                        conceptoLiquidado.valorunitario = concepto.concepto.valorunitario;
                    }
                }
            }
            return JSON.parse(JSON.stringify(data.conceptosLiquidados));
        }
        if (data.conceptos) {
            return data.conceptos;
        }
    },
    /**
     * Cambia los conceptos de tablas en caso de que sea seleccionado para editarlo o al eliminarlo
     * @returns {void}
     */
    seleccionarEditar: function () {
        var _this = $(this);
        var conceptosAdd = [];
        var table = $('#tblConcepto tbody');
        var tagname = _this.parents().eq(2)[0].tagName;
        if (tagname === 'TBODY') {
            var concepto = registroVentasControl.consultarConceptoPorId(_this.val());
            var eliminado = registroVentasControl.consultarConceptoEliminadosPorId(_this.val());

            concepto = concepto.concepto;
            concepto.eliminado = 'N';
            _this.parents('tr').remove();
            if ($('#tblConceptosSeleccionables tbody tr').length === 0) {
                $('#contenedorTodos').hide();
            }
            if (eliminado) {
                registroVentasModelo.conceptosEliminados.splice(eliminado, 1);
            }
            if (table.length === 0) {
                conceptosAdd.push(concepto);
                var tbl = fillTable("tblConcepto", "formatoConceptos", conceptosAdd, "Conceptos");
                tbl.find('td[header="thEditar"] input[type="button"]').on('click', self.editarConcepto);
                tbl.find('td[header="thEliminar"] input[type="button"]').on('click', self.eliminarConcepto);
                return;
            }

            table.append(self.agregarFilaConcepto(concepto));
        } else if (tagname === 'THEAD') {
            var filaConceptos = $('#tblConceptosSeleccionables tbody tr td[header="thIdConcepto"]');
            for (var i = 0; i < filaConceptos.length; i++) {
                var idconcepto = filaConceptos[i].innerText;
                var concepto = registroVentasControl.consultarConceptoPorId(idconcepto);
                var eliminado = registroVentasControl.consultarConceptoEliminadosPorId(idconcepto);
                if (eliminado) {
                    registroVentasModelo.conceptosEliminados.splice(eliminado.indice, 1);
                }
                concepto.eliminado = 'N';
            }
            self.onConsultarConceptosCompleto({codigoRespuesta: 1, conceptos: registroVentasModelo.conceptos});
        }
    },
    /**
     * Agrega una fila con la información del concepto que se acaba de agregar
     * @returns {void}
     */
    agregarFilaConcepto: function (concepto) {
        var id = concepto.idconcepto;
        var valventa = concepto.valorreal;
        var cant = concepto.cantidad ? concepto.cantidad : '';
        var valtot = concepto.valortotal ? concepto.valortotal : '';
        valventa = valventa ? valventa.toString().toCurrency() : '';
        var valuni = concepto.valorunitario ? concepto.valorunitario : '';

        //Crear fila y las celdas de la fila
        var tdeditar = $('<td>').css({'width': '10%'});
        var tot = $('<td>').text(valtot).attr('header', 'thValorTotal').tdNumeric();
        var uni = $('<td>').text(valuni).attr('header', 'thValorUnitario').tdNumeric();

        var tdeliminar = $('<td>').attr('data-value', id).css({'width': '10%'});
        var ven = $('<td>').text(valventa).attr('data-value', valventa === '' ? 'Sin valor' : valventa).tdNumeric();
        var tr = $('<tr><td header="thIdConcepto">' + id + '</td><td header="thConcepto">' + concepto.concepto + '</td><td header="thCantidad">' + cant + '</td></tr>');

        var btnEditar = $('<input>').attr({
            'type': 'button',
            'value': 'Editar',
            'class': 'tblBtn',
            'data-id': id
        }).on('click', self.editarConcepto);
        var btnEliminar = $('<input>').attr({
            'type': 'button',
            'value': 'Quitar',
            'class': 'tblBtn'
        }).on('click', self.eliminarConcepto);

        tdeditar.append(btnEditar);
        tdeliminar.append(btnEliminar);
        if (concepto.tipocalculo === 'F' || concepto.editable === 'N' || concepto.tiporegistro === 'N') {
            btnEditar.attr('disabled', 'disabled');
        }
        return tr.append(uni, tot, ven, tdeditar, tdeliminar);
    },
    /**
     * Abre un dialogo para editar un concepto según sea permitido por su tipo de registro.
     * @returns {void}
     */
    editarConcepto: function () {
        var _this = $(this);
        var fila = _this.parent().parent();
        var concepto = registroVentasControl.consultarConceptoPorId(_this.attr('data-id'));
        concepto = concepto.concepto;

        var valor = concepto.valorunitario;
        $('#txtConcepto').val(fila.find('td[header="thConcepto"]').text());
        var txtValor = $('#txtValor');

        if (!isNaN(valor) && valor !== null && valor !== '') {
            txtValor.val(valor).attr('disabled', 'disabled');
        } else {
            txtValor.val('').removeAttr('disabled');
        }

        $('#txtCantidad').val(concepto.cantidad);
        switch (concepto.tiporegistro) {
            case 'T':
                if (!isNaN(valor) && valor !== null && valor !== '') {
                    txtValor.attr('disabled', 'disabled');
                    $('#txtCantidad').removeAttr('disabled');
                } else {
                    $('#txtCantidad, #txtValor').removeAttr('disabled');
                }
                break;
            case 'C':
                $('#txtCantidad').removeAttr('disabled');
                txtValor.attr('disabled', 'disabled');
                break;
            case 'U':
                $('#txtCantidad').attr('disabled', 'disabled').val('1');
                if (concepto.tipocalculo === 'V' && concepto.editable === 'S') {
                    txtValor.removeAttr('disabled');
                }
                break;
        }
        self.dialogoActual = $('#divEditarConcepto').dialogo({
            modal: true,
            width: 400,
            title: 'Editar concepto',
            buttons: {
                Aceptar: function () {
                    self.onEditarConceptoCompleto(fila, _this.attr('data-id'));
                    self.dialogoActual.dialog('close');
                },
                Cancelar: function () {
                    self.dialogoActual.dialog('close');
                }
            }
        });

    },
    /**
     * Visualiza los cambios hechos en el dialogo de edición de concepto en la respectiva tabla.
     * @returns {void}
     */
    onEditarConceptoCompleto: function (fila, id) {
        var valor = $('#txtValor').val().trim() !== "" ? parseInt($('#txtValor').val()) : 0;
        var cant = $('#txtCantidad').val().trim() !== "" ? parseInt($('#txtCantidad').val()) : 0;
        var total = valor * cant;

        fila.find('td[header="thCantidad"]').text(cant);
        fila.find('td[header="thValorTotal"]').text(total).tdNumeric();
        fila.find('td[header="thValorUnitario"]').text(valor).tdNumeric();
        var concepto = registroVentasControl.consultarConceptoPorId(id).concepto;
        concepto.editado = true;
        concepto.cantidad = cant;
        concepto.valortotal = total;
        concepto.valorunitario = valor;

    },
    /**
     * Confirma si desea eliminar un concepto, en tal caso hace petición ajax validando si se puede elimianr
     * @returns {void}
     */
    eliminarConcepto: function () {
        var _this = $(this);
        var tr = _this.parent().parent();
        var tabla = tr.parent().parent();
        var id = _this.parent().parent().find('td[header="thIdConcepto"]').text();
        //Si es el único registro limpia la tabla y oculta división
        if (tabla.find('tbody tr').length === 1) {
            tabla.empty();
        } else {
            tr.remove();
        }

        var concepto = registroVentasControl.consultarConceptoPorId(id);
        concepto = concepto.concepto;
        var id = concepto.idconcepto;
        concepto.eliminado = 'S';

        //Elimina el concepto de los el arreglo de conceptos liquidados
        var concLiquidado = registroVentasControl.consultarConceptoLiquidadoPorId(id);
        if (!!concLiquidado) {
            registroVentasModelo.conceptosLiquidados.splice(concLiquidado.indice, 1);
        }
        //Devuelve la fila para la tabla de los seleccionables
        if ($('#tblConceptosSeleccionables tbody tr').length === 0) {
            $('#contenedorTodos').show();
            var tbl1 = fillTable("tblConceptosSeleccionables", "formatoConceptosSeleccionar", [concepto], "");
            tbl1.find('tbody td[header="thSeleccionar"] input:checkbox').on('click', self.seleccionarEditar);
            return;
        }

        var tr = $('<tr><td id="tblConceptosSeleccionables_tdControl_check_' + id + '_' + id + '" header="thSeleccionar"><input type="checkbox" value="' + id + '" id="tblConceptosSeleccionables_td_check_' + id + '_' + id + '" class="tblCheck"><label for="tblConceptosSeleccionables_td_check_' + id + '_' + id + '">Seleccionar</label></td><td header="thIdConcepto">' + id + '</td><td header="thConcepto">' + concepto.concepto + '</td></tr>');
        tr.find('input').on('click', self.seleccionarEditar);
        $('#tblConceptosSeleccionables tbody').append(tr);

    },
    /** Captura la respuesta del servidor, cuando se sube un archivo
     * @param {object} e -
     * @param {object} data - Respuesta del servidor con información de los archivos cargados
     * @returns {void}
     */
    subirCompleto: function (data) {
        $('.pMensaje').html('');
        data = data.data;
        switch (parseInt(data.codigoRespuesta)) {
            case 0:
                break;
            case 1:
                for (var i = 0; i < data.uploadedFiles.length; i++) {
                    var archivo = data.uploadedFiles[i].idarchivo;
                    registroVentasModelo.archivos.push({idarchivo: archivo});
                    var divBtn = $('.files-list .file-item:last .file-item-btns');
                    var btn = divBtn.find('button.appload-btn-delete');
                    var btnDownload = divBtn.find('button.appload-btn-download');
                    btn.attr('data-id', archivo);
                    btn.on('click', self.eliminarArchivo);
                    btnDownload.on('click', self.descargarArchivo);
                    btnDownload.attr('data-url', data.uploadedFiles[i].ruta);
                }
                break;
        }
    },
    /**
     * Descarga los archivos que se han subido
     * @param {Event} e
     * @returns {void}
     */
    descargarArchivo: function (e) {
        $('<a>').attr({'href': $(e.currentTarget).attr('data-url'), 'target': '_blank'})[0].click();
    },
    /**
     * Guarda los archivos de la última venta que se ha guardado
     * @returns {void}
     */
    actualizarAdjuntosVenta: function () {
        var botones = $('#divArchivosContrato button');
        if (registroVentasModelo.botonesformatos.length === botones.length || registroVentasModelo.suscripcion.estado !== 'P') {
            var idventa = registroVentasModelo.idVentaGrabada;
            if (idventa && registroVentasModelo.archivos.length > 0) {
                var data = {numeroventa: idventa, archivos: registroVentasModelo.archivos};
                registroVentasControl.grabarArchivos({parametros: data}, self.onActualizacionCompleto);
            }
        } else {
            __dom.lanzarAlerta('No se han descargado los formatos de venta.');
        }
    },
    onActualizacionCompleto: function (data) {
        if (data.codigoRespuesta === 1) {
            __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion, self.limpiarFormulario, false, self.limpiarFormulario);
        }
    },
    /** Muestra los archivos cargados en el servidor en una lista.
     * @param {object} data - Información de los archivos que se han cargado.
     * @returns {void}
     */
    mostrarArchivos: function (data) {
        var div = $('#divAdjunto');
        div.find('span').remove();
        if (data.length === 0) {
            div.append($('<span>').addClass('pMensaje').text('La venta no tiene archivos adjuntos.'));
            return;
        }
        if (!self.appload.container) {
            self.appload.control.change();
        }
        var estadoventa = registroVentasModelo.venta.estado;
        for (var i = 0; i < data.length; i++) {
            var info = data[i];
            var divItem = self.appload.addFileToList({url: info.ruta, name: info.nombrearchivo});

            divItem.addClass('uploaded-item');
            divItem.find('.file-item-btns button').removeAttr('disabled');
            registroVentasModelo.archivos.push({idarchivo: info.idarchivo});
            var eliminar = divItem.find('.file-item-btns .appload-btn-delete');
            divItem.find('.file-item-btns .appload-btn-discard').attr('disabled', 'disabled');
            $('<span class="fa fa-check-circle-o">').insertBefore(divItem.find('i.fa:first'));

            if (estadoventa !== 'P') {
                eliminar.attr('disabled', 'disabled');
                continue;
            }
            eliminar.attr('data-id', info.idarchivo);
            eliminar.on('click', self.eliminarArchivo);
        }

    },
    /** Pide confirmación para eliminar un archivo en caso de ser "Sí"
     * Elimina un archivo de la lista de archivos y hace petición AJAX para eliminar el archivo del servidor.
     * @returns {void}
     */
    eliminarArchivo: function () {
        var _this = $(this);
        var id = _this.attr('data-id');
        self.dialogoActual = $('div#divEliminarArchivo').dialogo({
            resizable: false,
            heigth: 140,
            modal: true,
            title: 'Eliminar archivo',
            buttons: {
                "Sí": function () {
                    registroVentasControl.eliminarArchivo({accion: 'E', idarchivo: id}, function (data) {
                        self.onEliminarArchivoCompleto(data, _this);
                    });
                }, Cancelar: function () {
                    self.dialogoActual.dialog("close");
                }
            }
        });

    },
    /**
     * Obtiene la respuesta del servidor y elimina un archivo
     * @param {object} data - Respuesta del servidor 
     * @param {object} _this - Objeto del listado que se va a eliminar
     * @returns {void}
     */
    onEliminarArchivoCompleto: function (data, _this) {
        var id = _this.attr('data-id');
        self.dialogoActual.dialog('close');
        if (data.codigoRespuesta === 1) {
            debugger;
            var fxEliminarFile = function () {
                $(_this.parents('.file-item')[0]).remove();
            };
            __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion, fxEliminarFile, false, fxEliminarFile);
            var archivo = registroVentasControl.consultarArchivoPorId(id);
            if (archivo) {
                registroVentasModelo.archivosEliminados.push(id);
                registroVentasModelo.archivos.splice(archivo.indice, 1);
            }
        } else {
            __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
        }
    },
    /** Valida el formato que se desea imprimir.
     * @returns {void}
     */
    imprimirContrato: function () {
        var _this = $(this);
        var modelo = registroVentasModelo;
        var nombre = _this.attr('data-id');
        $('#divTemplateContrato').html('');
        if (!registroVentasControl.consultarBotonPorNombre(nombre)) {
            modelo.botonesformatos.push({btn: nombre});
        }
        if (modelo.venta || modelo.idVentaGrabada) {
            self.enviarInformacionDeAdjunto();
        }
    },
    /**
     * Construye objeto para descargar el formato de autorización
     * @returns {void}
     */
    enviarInformacionDeAdjunto: function () {
        var modelo = registroVentasModelo;
        var suscripcion = modelo.suscripcion;
        var propiedad = modelo.detallesSuscripcion.propiedad;
        var fecha = convertirPrecios.convertirFecha(modelo.fechaActual);
        var idventa = modelo.idVentaGrabada ? modelo.idVentaGrabada : modelo.venta.idventa;
        var numeroventa = modelo.venta.numeroventa;

        var data = {
            dias: fecha.dia,
            numeroventa: numeroventa,
            idventa: idventa,
            anioactual: fecha.anio,
            barrio: propiedad.barrio,
            mesactual: fecha.mesletras,
            estrato: suscripcion.estrato,
            direccion: propiedad.direccion,
            municipio: propiedad.municipio,
            documento: suscripcion.documentotercero,
            tipouso: suscripcion.tipousosuscripcion,
            idsuscripcion: suscripcion.codigoanterior,
            nombretercero: suscripcion.nombretercero,
            celular: modelo.informacionVenta.infosuscripcion.tercero.telefonocelular
        };
        registroVentasControl.exportarAutorizacion({informacion: data}, function (data) {
            if (data.codigoRespuesta === 1) {
                $('#linkFormato')[0].click();
            }
        });
    },
    /**
     * Valida que la información esté completa para liquidar
     * @returns {void}
     */
    validarInformacionLiquidar: function () {

        var filasConceptos = $('#tblConcepto tbody tr');
        if (!registroVentasModelo.idsuscripcion) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarSuscripcion, __app.mensajes.atencion);
            return;
        }
        if (registroVentasModelo.conceptos.length === 0) {
            __dom.lanzarAlerta('No se encontraron conceptos a liquidar, intente nuevamente', __app.mensajes.atencion);
            return;
        }
        if (filasConceptos.length === 0) {
            __dom.lanzarAlerta('No se han seleccionado conceptos para la venta, ¿Desea continuar con la liquidación?', __app.mensajes.atencion,
                    self.liquidarConcepto, true);
            return;
        }
        self.liquidarConcepto();
    },
    /**
     * Hace petición ajax con la información de los conceptos de las liquidaciones seleccionadas
     * para ser liquidarlos
     * @returns {void}
     */
    liquidarConcepto: function () {
        var cont = 0;
        var errores = '';
        var conceptos = [];

        for (var i = 0; i < registroVentasModelo.conceptos.length; i++) {
            var concepto = JSON.parse(JSON.stringify(registroVentasModelo.conceptos[i]));
            var cantidad = concepto.cantidad;
            var valornulo = concepto.valornulo;
            var valortotal = concepto.valortotal;
            var valorunitario = concepto.valorunitario;

            var editable = !(concepto.tipocalculo === 'F' || concepto.editable === 'N' || concepto.tiporegistro === 'N');
            if (editable && concepto.eliminado !== 'S') {
                var edicion = !concepto.editado && (isNaN(cantidad) || cantidad === null || cantidad === '');
                valornulo = valornulo === 'N' && valorunitario === 0;
                if ((isNaN(valortotal) || valortotal === null || valortotal === '') || edicion || valornulo) {
                    errores += 'Falta editar información del concepto <strong>' + concepto.concepto + '</strong><br />';
                    cont++;
                    continue; //saltar a la siguiente iteración
                }
            }
            if (concepto.eliminado === 'S') {
                concepto.valor = 0;
                concepto.cantidad = 0;
                concepto.valortotal = 0;
                concepto.valorunitario = 0;
                registroVentasModelo.conceptosEliminados.push(concepto.idconcepto);
            }
            conceptos.push(concepto);
        }
        if (cont > 0) {
            __dom.lanzarAlerta(errores, __app.mensajes.atencion);
            return;
        }
        if (registroVentasModelo.stringLiquidacion !== '') {
            var idsuscripcion = registroVentasModelo.idsuscripcion;
            var informacion = {
                idsuscripcion: idsuscripcion,
                conceptos: JSON.stringify(conceptos),
                liquidaciones: registroVentasModelo.stringLiquidacion
            };
            registroVentasControl.liquidarConcepto(informacion, self.onLiquidarConceptoCompleto);
        }

    },
    /** Se obtienen la información de los conceptos liquidados y se ordenan según su procedencia
     * @param {object} data - Respuesta del servidor con información de los conceptos liquidados
     * @returns {void}
     */
    onLiquidarConceptoCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case - 1:
                registroVentasModelo.conceptosEliminados = [];
                break;
            case 0:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                break;
            case 1:
                registroVentasModelo.cambialiquidacion = true;
                var conceptos = registroVentasModelo.conceptos;
                var conceptosLiquidados = data.venta.conceptos;
                for (var x = 0; x < conceptos.length; x++) {
                    var c = conceptos[x];
                    for (var y = 0; y < conceptosLiquidados.length; y++) {
                        var liquidado = conceptosLiquidados[y];
                        if (parseInt(c.idconcepto) === parseInt(liquidado.idconcepto)) {
                            c.editado = true;
                            liquidado.editado = true;
                            liquidado.editable = c.editable;
                        }
                    }
                }

                for (var x = conceptosLiquidados.length - 1; x >= 0; x--) {
                    var c = conceptosLiquidados[x];
                    c.eliminado = 'N';
                    for (var e = 0; e < registroVentasModelo.conceptosEliminados.length; e++) {
                        var eliminado = registroVentasModelo.conceptosEliminados[e];
                        if (parseInt(c.idconcepto) === parseInt(eliminado)) {
                            c.eliminado = 'S';
                        }
                    }
                }
                registroVentasModelo.conceptosEliminados = []; //SE ELIMINAN LOS CONCEPTOS A ELIMINAR
                var vlrConcepto = data.venta.valor.toString().toCurrency();

                $('#txtValorVenta').val(vlrConcepto);
                registroVentasModelo.valorConceptos = data.venta.valor;
                registroVentasModelo.conceptosLiquidados = conceptosLiquidados;
                self.onConsultarConceptosCompleto({codigoRespuesta: 1, conceptosLiquidados: conceptosLiquidados});
                break;
        }
    },
    /** Valida que los conceptos seleccionados ya estén liquidados
     * @returns {bool}
     */
    validarConceptoLiquidados: function () {
        var conA = JSON.stringify(registroVentasModelo.conceptos);
        var conB = JSON.stringify(registroVentasModelo.conceptosLiquidados);
        return conA === conB;
    },
    /**
     * Valida la información que es obligatoria para grabar la venta
     * @returns {Boolean}
     */
    validarInformacionVenta: function () {
        var metodo = $('#txtMetodoPago');
        var observacion = $('#txtObservacion');
        var numeroventa = $('#txtNumeroVenta').val();
        var selector = $('#listaLiquidacionSeleccionada input[type="checkbox"]');

        if (!registroVentasModelo.suscripcion) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarSuscripcion, __app.mensajes.atencion);
            return false;
        }
        var estadosuscripcion = registroVentasModelo.detallesSuscripcion.estado;
        if (!registroVentasModelo.asesor) {
            __dom.lanzarAlerta('Debe seleccionar un asesor.', __app.mensajes.atencion, function () {
                $('a[href="#divAsesor"]').click();
                $('#txtNombreAsesorVenta').focus();
            });
            return false;
        }
        if (!registroVentasModelo.idEmpresaInstaladora || !registroVentasModelo.idcompetenciafirma) {
            __dom.lanzarAlerta('Debe seleccionar empresa instaladora y funcionario.', __app.mensajes.atencion, function () {
                $('#txtEmpresaInstaladora').focus();
                $('a[href="#divFirmaInstaladora"]').click();
            });
            return false;
        }
        if (!registroVentasModelo.idorganismoinspeccion) {
            __dom.lanzarAlerta('Debe seleccionar organismo de inspección acreditado.', __app.mensajes.atencion, function () {
                $('#txtOrganismosInspeccion').focus();
                $('a[href="#divFirmaInstaladora"]').click();
            });
            return false;
        }
        if ($('#cmbTipoDocumento').val() === '-1' || $('#cmbDocumento').val() === '-1') {
            __dom.lanzarAlerta(__app.mensajes.seleccionarDocumentos, __app.mensajes.atencion);
            return false;
        }
        if (observacion.val().trim() === '') {
            __dom.lanzarAlerta(__app.mensajes.escribirObservacion, __app.mensajes.atencion, function () {
                observacion.focus();
            });
            return false;
        }
        if (metodo.val() === '-1') {
            __dom.lanzarAlerta('Debe seleccionar el método de pago.', __app.mensajes.atencion, function () {
                metodo.focus();
            });
            return false;
        }

        if (registroVentasModelo.conceptosLiquidados.length === 0 || !self.validarConceptoLiquidados()) {
            __dom.lanzarAlerta('Se encontraron conceptos sin liquidar, intente nuevamente.', __app.mensajes.atencion, function () {
                $('#btnLiquidar').focus();
            });
            return false;
        }
        if (registroVentasModelo.conceptosEliminados.length > 0) {
            __dom.lanzarAlerta('Se encontraron conceptos sin liquidar, intente nuevamente.', __app.mensajes.atencion, function () {
                $('#btnLiquidar').focus();
            });
            return false;
        }

        if (selector.length === 0) {
            __dom.lanzarAlerta(' No se encontraron liquidaciones seleccionadas ', __app.mensajes.atencion, function () {
                $('#listaLiquidacionSeleccion input[type="checkbox"]:eq(0)').focus();
            });
            return false;
        }

        if (registroVentasModelo.archivos.length === 0 && estadosuscripcion === 'P' && numeroventa.trim() !== '') {
            __dom.lanzarAlerta(__app.mensajes.sinArchivos, __app.mensajes.atencion, function () {
                $('.appload-input').focus();
                $('#liAdjuntos a').click();
            });
            return false;
        }

        return true;
    },
    /** Construye objeto de la venta y se envía a servidor
     * @returns {void}
     */
    grabarVenta: function () {
        var liquidaciones = [];
        var metodo = $('#txtMetodoPago');
        var medioPagoFactura = $('#txtMedioPagoFactura');
        var observacion = $('#txtObservacion');
        var tipdocumento = $('#cmbTipoDocumento');
        var selector = $('#listaLiquidacionSeleccionada input[type="checkbox"]');
        if (!self.validarInformacionVenta()) {
            return;
        }

        if (selector.length > 0) {
            $.each(selector, function (i, item) {
                liquidaciones.push({idliquidacion: item.value});
            });
        }
        var liquidados = [];
        for (var i = 0; i < registroVentasModelo.conceptosLiquidados.length; i++) {
            if (registroVentasModelo.conceptosLiquidados[i].eliminado !== 'S') {
                liquidados.push(registroVentasModelo.conceptosLiquidados[i]);
            }
        }
        var venta = {
            //estado: registroVentasModelo.venta.estado,
            valorventa: registroVentasModelo.valorConceptos,
            idtipodocumento: tipdocumento.val(),
            iddocumento: $('#cmbDocumento').val(),
            observacion: observacion.val(),
            cicloanio: registroVentasModelo.detallesSuscripcion.cicloanio,
            idciclo: registroVentasModelo.detallesSuscripcion.idciclo,
            idperiodo: registroVentasModelo.detallesSuscripcion.idperiodo,
            tipoventa: $('#txtTipoVenta').attr('data-tipo'),
            metodopago: metodo.val(),
            mediopagofactura: medioPagoFactura.val(),
            idcompetenciafirma: registroVentasModelo.idcompetenciafirma,
            idorganismoinspeccion: registroVentasModelo.idorganismoinspeccion,
            idsuscripcion: registroVentasModelo.suscripcion.idsuscripcion,
            idasesor: registroVentasModelo.asesor,
            detalleventa: liquidados,
            liquidaciones: liquidaciones,
            archivoseliminados: registroVentasModelo.archivosEliminados
        };
        if ($('#txtNumeroVenta').val().trim() !== '') {
            if (venta.metodopago !== registroVentasModelo.venta.metodopago) {
                venta.cambiametodopago = true;
            }
            venta.reiniciarFinanciacion = (venta.cambiametodopago) || registroVentasModelo.cambialiquidacion;
            venta.archivos = registroVentasModelo.archivos;
            venta.numeroventa = $('#txtNumeroVenta').val();
        }
        registroVentasModelo.ventaGrabar = venta;

        $('#btnGrabar').attr('disabled', 'disabled');
        $('.appload-input').hide();
        registroVentasControl.grabarVenta({venta: JSON.stringify(venta)}, self.onGrabarVentaCompleto);
    },
    /**
     * Consulta la resolución de la facturación que se utilizará para grabar la venta
     * @returns {void}
     */
    validarResolucion: function () {
        $('#btnGrabar').attr('disabled', 'disabled');
        if (!self.validarInformacionVenta()) {
            $('#btnGrabar').removeAttr('disabled');
            return;
        }
        var iddocumento = $('#cmbDocumento').val();
        registroVentasControl.validarResolucionFacturacion({iddocumento: iddocumento}, self.onValidarResolucion);
    },
    /**
     * Avisa al usuario si la resolución está por terminar.
     * @param {Object} data - Información sobre la resolución de facturación que se está manejando
     * @returns {void}
     */
    onValidarResolucion: function (data) {
        var div = $('#divValidacionResolucion');
        switch (data.codigoRespuesta) {
            case 0:
                self.grabarVenta();
                break;
            case 1:
                div.find('p').text(data.mensaje);
                div.dialogo({
                    modal: true,
                    width: 550,
                    height: 'auto',
                    title: 'Advertencia',
                    buttons: {
                        Aceptar: function () {
                            self.grabarVenta();
                            $(this).dialog('close');
                        },
                        Cancelar: function () {
                            $(this).dialog('close');
                        }
                    }
                });
                break;
        }
    },
    /** Valida si se grabó la venta y activa panel para subir archivos
     * @param {object} data - Respuesta del servidor al grabar venta
     * @returns {void}
     */
    onGrabarVentaCompleto: function (data) {
        $('#divArchivosContrato').find('.btnSimple').removeClass('descargado');
        switch (data.codigoRespuesta) {
            case 1:
                if ($('#txtNumeroVenta').val().trim() !== '') {
                    __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion, self.limpiarFormulario, false, self.limpiarFormulario);
                    return;
                }
                if (registroVentasModelo.detallesSuscripcion.suscripcion.estado === 'P') {
                    var fxSubirSoporte = function () {
                        self.permitirSubirArchivo(data.datos);
                    };
                    __dom.lanzarAlerta(data.mensaje + '<br> Debe <b>descargar el formato </b> y <b>subir los soportes </b> de la venta. ', __app.mensajes.atencion, fxSubirSoporte, false, fxSubirSoporte);
                }

                if (registroVentasModelo.detallesSuscripcion.suscripcion.estado === 'A') {
                    $('#spanMensajeFinal').html(data.mensaje + '</br>');
                    var div = $('#divConfirmarSubirArchivo').dialogo({
                        modal: true,
                        width: 550,
                        title: __app.mensajes.atencion,
                        buttons: {
                            'Sí': function () {
                                div.dialog('close');
                                self.permitirSubirArchivo(data.datos);
                                $('#liAdjuntos').show().find('a').click();
                                $('#divAdjunto a.appload-input').focus();
                            },
                            'No': function () {
                                div.dialog('close');
                                self.limpiarFormulario();
                            }
                        }
                    });
                }
                break;
            default :
                $('#btnGrabar').removeAttr('disabled');
                break;
        }
    },
    /**
     * Configura la interfaz para que el usuario pueda subir archivos de la venta
     * @returns {void}
     */
    permitirSubirArchivo: function (id) {
        if (self.appload.container) {
            self.appload.container.find('div.files-list').empty();
        }
        $("#pestanias").tabs("enable", 1);
        $("#pestanias").tabs("enable", 2);
        $('#liFormatos').show().find('a').click();
        $('#btnGrabar').attr('disabled', 'disabled');
        $('#liAdjuntos, #btnSubirArchivos').show();
        $('#divFormato button:eq(0)').focus();
        $('.appload-input').show();
        registroVentasModelo.idVentaGrabada = id;
    },
    /** Pregunta al usuario si desea cancelar la operación actual
     * si el usuario desea cancelar, se limpia el formulario y se actualiza el modelo
     * @returns {void}
     */
    cancelarVenta: function () {
        if (!!registroVentasModelo.suscripcion) {
            $('div#divConfirmCancelar').dialogo({
                resizable: false,
                width: 400,
                modal: true,
                title: 'Cancelar la operación',
                buttons: {
                    "Sí": function () {
                        $(this).dialog('close');
                        $('#cmbTipoDocumento').empty();
                        self.limpiarFormulario();
                    }, Cancelar: function () {
                        $(this).dialog("close");
                    }
                }
            });
        }
    },
    /** Limpia el formulario para buscar una venta
     * @returns {void}
     */
    limpiarFiltro: function () {
        var filtro = $('#divBuscarVenta');
        filtro.find('input[type="text"]').val('');
        $('.files-list .file-item.uploaded-item').remove();
    },
    /**
     * Limpia el formulario para búsquedas de suscripción visualizado en cuadro de dialogo.
     * @returns {void}
     */
    limpiarDialogoBuscarSuscripcion: function () {
        var dialogo = $('div#divDialogoBusqueda');
        dialogo.find('input[type="text"]').val('');
        dialogo.find('select').val('-1');
        dialogo.find('#spanMensaje').hide();
        $('#divListaSelección').empty();
    },
    /**
     * Limpia el formulario y elimina la información de la venta.
     * @returns {void}
     */
    limpiarFormulario: function () {
        $('#divArchivosContrato .btnSimple').removeClass('descargado');
        self.limpiarCajasFormulario();
        self.limpiarInformacionModelo();
        self.limpiarDialogoBuscarSuscripcion();
    },
    /**
     * Limpia toda la información del modelo
     * @returns {void}
     */
    limpiarInformacionModelo: function () {
        if (self.appload.container) {
            self.appload.container.find('.files-list').empty();
        }
        if (self.apploadFinanciacion) {
            self.apploadFinanciacion.container.find('.files-list').empty();
        }

        var cajas = registroVentasModelo.cajas;
        var modelo = registroVentasModelo.modelo;
        var fechaactual = registroVentasModelo.fechaActual;
        $("#txtFechaVenta").val(fechaactual);
        registroVentasModelo = {
            cajas: cajas,
            archivos: [],
            conceptos: [],
            modelo: modelo,
            botonesformatos: [],
            archivosEliminados: [],
            fechaActual: fechaactual,
            conceptosLiquidados: [],
            conceptosEliminados: []
        };
    },
    /**
     * Limpia los controles del formulario y deja todo como si se hubiera iniciado
     * @returns {void}
     */
    limpiarCajasFormulario: function () {
        $('a.fa-minus').click();
        $('#spanMensajeFinal').text('');
        $('#btnGrabar').removeAttr('disabled');
        $('.appload-input').show();
        $("#pestanias").tabs('option', 'enable', [1, 2, 3]);
        $('a[href="#divLiquidacionVenta"]').click(); //Queda la pestaña de concepto a liquidar activa
        $('.listaSeleccion, #tblLiquidaciones, #tblFinanciaciones').empty();//objetoVacio 
        $('#btnVerDetalle, #btnVerPropiedad').attr('disabled', 'disabled');
        var option = $('<option>').text('Seleccione una opción').val('-1');
        var combosSinModificar = $('#cmbTipoPago, #cmbMunicipio, #cmbTipoDocumento, #txtMetodoPago, #txtMedioPagoFactura');
        $('#liAdjuntos, #liFormatos, #divConcepto, #files-notifications, #liFinanciacion').hide(); //Ocultos

        $('select').not(combosSinModificar).empty().append(option);
        $('input[type="text"]:not("#txtFechaVenta")').val('');
        if (registroVentasModelo.cajas) {
            registroVentasModelo.cajas.removeAttr('disabled');
        }
        $('select').val('-1');
    },
    /** Valida si un concepto se puede editar según el tipo cálculo, tipo registro y si es editable
     * @param {String} valor - Valor del atributo seleccionado en el refer de la fila
     * @param {Jquery} td - Td que se está evaluando
     * @param {Array} obj - Información completa de la fila que se está cargando
     * @returns {void}
     */
    validarEdicion: function (valor, td, concepto) {
        //var concepto = registroVentasControl.consultarConceptoPorId(valor).concepto;
        if (!!concepto) {
            var input = $('<input>').attr({
                'type': 'button',
                'value': 'Editar',
                'data-id': valor,
                'class': 'tblBtn'
            });
            td.append(input);
            td.css({'width': '10%'});
            if (concepto.tipocalculo === 'F') {
                td.find('input[type="button"]').attr('disabled', 'disabled');
            } else if (concepto.editable === 'N') {
                td.find('input[type="button"]').attr('disabled', 'disabled');
            } else if (concepto.tiporegistro === 'N') {
                td.find('input[type="button"]').attr('disabled', 'disabled');
            }
        }
    },
    /**
     * Se agrega botón de eliminar concepto siempre y cuando se puedan eliminar
     * @param {String} valor - Valor del atributo seleccionado en el refer de la fila
     * @param {Jquery} td - Td que se está evaluando
     * @param {Array} obj - Información completa de la fila que se está cargando
     * @returns {void}
     */
    validarEliminar: function (valor, td, obj) {
        var input = $('<input>').attr({
            'type': 'button',
            'value': 'Quitar',
            'data-id': valor,
            'class': 'tblBtn'
        });
        td.append(input);
        td.css({'width': '10%'});
        if (obj.hasOwnProperty('eliminar')) {
            td.find('input[type="button"]').attr('disabled', (valor === 'N'));
        } else {
            td.find('input[type="button"]').attr('disabled', (obj.valornulo === 'N'));
        }
    },
    /**
     * Calcula la cuota inicial de una financiación
     * @param {String} valor - Valor del atributo seleccionado en el refer de la fila
     * @param {Jquery} td - Td que se está evaluando
     * @param {Array} obj - Información completa de la fila que se está cargando
     * @returns {String}
     */
    validarCuotaInicial: function (valor, td, obj) {
        var cuotaInicial = 0;
        for (var j = 0; j < obj.conceptos.length; j++) {
            cuotaInicial += parseInt(obj.conceptos[j].valorcuotaincial);
        }
        return cuotaInicial.toString().toCurrency();
    },
    /**
     * Devuelve el nombre del estado de la venta
     * @param {String} valor - Caracter que indice el estado de la venta
     * @returns {String}
     */
    validarEstadoVenta: function (valor) {
        var estado = '';
        switch (valor) {
            case 'P':
                estado = 'Pendiente';
                break;
            case 'A':
                estado = 'Aprobada';
                break;
            case 'C':
                estado = 'Certificada';
                break;
            case 'F':
                estado = 'Facturada';
                break;
            case 'E':
                estado = 'Eliminada';
                break;
        }
        return estado;
    },
    validarPermisosGrabar: function () {
        var data = {idPrograma: 18, idUnidad: 1434};
        registroVentasControl.consultarPermisosGrabar(data, self.ResultadoPermisosGrabar);
    },
    /** Captura la respuesta del servidor  cuando se consultan si usuario tiene permisos de grabación
     * @param {object} Data - Respuesta del servidor si usuario tiene permisos de grabación
     * @returns {void}
     * Oscar Baquero
     **/
    ResultadoPermisosGrabar: function (data) {

        switch (data.codigorespuesta) {

            case 0:
                $('#btnGrabar').hide();
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                break;

            default:

                break;
        }
    }
};
