/**
 * @fileOverview Archivo de vista y control de administrar financiación
 * @author AppFuture
 * @requires financiacion_crud.control.js
 * @requires financiacion_crud.modelo.js
 * @version 1.0.0
 */
/**
 * Objeto que hace referencia al namespace financiacionCRUDVista
 * @type {Object}
 */
var that = null;

/** @namespace */
var financiacionCRUDVista = {
    /** Hace referencia al último dialogo abierto en la aplicación
     * @type {object}
     */
    dialogoActual: null,
    /** Hace referencia a la factura seleccionada
     * @type {object}
     */
    facturaSeleccionada: null,
    /**Inicializa el programa de administrar financiación, y asigna listeners a los controles
     * @returns {void}
     */
    init: function () {
        that = this;
        $('#divNatural, #divAdjuntosFinanciacion').tabs();
        $('#btnBuscar').on('click', that.mostrarFiltro);
        $('#btnCancelar').on('click', that.cancelarConsulta);
        $('#btnCargarFacturas').on('click', that.cargarFacturas);
        $('#btnCargarAmortización').on('click', that.cargarAmortizaciones);        
        $('#btnSubirArchivos').on('click', that.actualizarInformacion);
        __dom.configurarCalendario('txtFechaInicio, #txtFechaFin');
        __dom.configurarTextoNumerico('txtFiltroSus, #txtFiltroFinanciacion');
        $('#txtFechaInicio').on('change', that.configurarFechaFin);
        $('#btnVerArchivos').on('click', that.consultarAdjuntos);
        $('#btnAdicionarArchivos').on('click', that.subirAdjuntosNew);
        that.appload = new Appload('#txtArchivo', {
            lg: esAppload,
            url: '../adjuntos/',
            showDeleteBtn: false,
            showDownloadBtn: true,
            showUploadButton: false,
            showDiscardButton: false,
            maxSize: 1024 * 1024 * 10,
            showSingleUploadBtn: false
        });
        $('a.appload-input').hide();
        that.appload.control.change();
        
      
        that.validarPermisosAdjuntar();
    },
    /** Consultar archivos adjuntos de una financiaciones
     * @returns {void}
     */
    consultarAdjuntos: function () {
        if (!!financiacionCrudModel.financiacion) {
            $('#divArchivos').toggle();
        } else {
            $('#divArchivos').hide();
        }
    },
    /** Configura que fecha fin no sea menor a fecha inicio
     * @returns {void}
     */
    configurarFechaFin: function () {
        var _this = $(this);
        var fi = new Date(_this.val().replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3"));
        $('#txtFechaFin').datepicker('option', 'minDate', fi).val('');
    },
    /** Muestra un dialogo con el formulario para la búsqueda de las suscripciones
     * @returns {void}
     */
    mostrarFiltro: function () {
        var filtro = $('div#camposBuscarSuscripcion');
        that.dialogoActual = filtro.dialogo({
            modal: true,
            width: 600,
            title: 'Buscar un suscripción',
            buttons: {
                Buscar: that.filtrarSuscriptor
            }
        });
    },
    /** Valida la información del filtro de suscripción y envía la solicitud al servidor
     * @returns {void}
     */
    filtrarSuscriptor: function () {
        var filtro = $('div#camposBuscarSuscripcion');
        var suscripcion = parseInt(filtro.find('#txtFiltroSus').val().trim());
        var codAnt = filtro.find('#txtFiltroCodAnt').val().trim();
        var idFinanciacion = parseInt(filtro.find('#txtFiltroFinanciacion').val().trim());
        var fechaInicio = $('#txtFechaInicio').val().trim();
        var fechaFin = $('#txtFechaFin').val().trim();
        var data = {};
        if (isNaN(idFinanciacion) && isNaN(suscripcion) && codAnt === '') {
            filtro.find('#spanMensaje').text(__app.mensajes.errorCamposConsultarFinanciaciones).show();
            return;
        }

        if (!isNaN(idFinanciacion)) {
            data.idfinanciacion = idFinanciacion;
        } else if (!isNaN(suscripcion) || !isNaN(codAnt)) {
            !codAnt !== '' ? data.codigoanterior = codAnt : null;
            !isNaN(suscripcion) ? data.idsuscripcion = suscripcion : null;
            if ((fechaInicio === '' && fechaFin !== '') || (fechaFin === '' && fechaInicio !== '')) {
                filtro.find('#spanMensaje').text('Si la búsqueda se realiza por fechas, ambos campos son obligatorios.').show();
                return;
            }
            if (fechaInicio !== '' && fechaFin !== '') {
                data.fechainicio = fechaInicio;
                data.fechafin = fechaFin;
            }
        }
        filtro.find('#spanMensaje').text('').hide();
        financiacionCrudControl.filtrarSuscripcion({parametros: data}, that.onFiltrarCompleto);
    },
    /** Captura la respuesta enviada por el servidor, cuando se consultan las suscripciones.
     * En caso de llegar varias suscripciones posibilita la selección de una.
     * @param  {object} data - El resultado de la petición ajax con las suscripciones que coinciden
     * @returns {void}
     */
    onFiltrarCompleto: function (data) {
        that.limpiarFormulario();
        switch (parseInt(data.codigoRespuesta)) {
            case 0:
                that.dialogoActual.find('#spanMensaje').text(__app.mensajes.sinResultados).show();
                break;
            case 1:
                that.dialogoActual.find('#spanMensaje').text();
                console.log(data);
                if (data.financiaciones.length > 1) {
                    that.dialogoActual.find('div.listaSeleccion').remove();
                    var divFinanciaciones = $('<div>').addClass('listaSeleccion');
                    $.each(data.financiaciones, function (f, fin) {
                        var div = $('<div>');
                        var radio = $('<input type="radio">');
                        radio.val(fin.idfinanciacion);
                        radio.attr('id', 'radio_fin_' + f);
                        radio.attr('data-indice', f);
                        radio.attr('name', 'radio_financiaciones');
                        var label = $('<label>').attr('for', 'radio_fin_' + f);
                        label.text(fin.documentosuscriptor + ' - ' + fin.suscriptor + ' - Financiación: ' + fin.idfinanciacion);
                        div.append(radio).append(label);
                        divFinanciaciones.append(div);
                    });
                    var btn = $('<button>').text('seleccionar').addClass('btnSimple');
                    btn.on('click', function () {
                        var finSeleccionada = that.dialogoActual.find('input[name="radio_financiaciones"]:checked');
                        if (finSeleccionada.length > 0) {
                            fin = financiacionCrudModel.financiacion = data.financiaciones[parseInt(finSeleccionada.attr('data-indice'))];
                            that.dialogoActual.find('#spanMensaje').hide();
                            that.dialogoActual.dialog('close');
                            divFinanciaciones.remove();
                            that.cargarCabecera(fin);
                        } else {
                            that.dialogoActual.find('#spanMensaje').text(__app.mensajes.seleccionarOpcion).show();
                        }
                    });
                    divFinanciaciones.insertAfter(that.dialogoActual.find('#spanMensaje'));
                    divFinanciaciones.append(btn);
                } else {
                    fin = financiacionCrudModel.financiacion = data.financiaciones[0];
                    that.dialogoActual.find('#spanMensaje').hide();
                    that.dialogoActual.dialog('close');
                    that.cargarCabecera(fin);
                }
                break;
        }
    },
    /** Carga la cabecera del formulario con los datos de la suscripción y financiación seleccionada.
     * @returns {void}
     */
    cargarCabecera: function (financiacion) {
        var cabecera = $('#divCabecera');
        var estado = financiacion.estado;
        switch (estado) {
            case 'A':
                estado = 'Activa';
                break;
            case 'U':
                estado = 'Unificada';
                break;
            case 'C':
                estado = 'Castigada';
                break;
        }
        cabecera.find('#txtSuscripcion').val(financiacion.idsuscripcion);
        cabecera.find('#txtSuscriptor').val(financiacion.idsuscriptor);
        cabecera.find('#txtDocumento').val(financiacion.documentosuscriptor);
        cabecera.find('#txtNombre').val(financiacion.suscriptor);
        cabecera.find('#txtCodAnterior').val(financiacion.codigoanterior);
        var divFinanciacion = $('#divFinanciacion');
        divFinanciacion.find('#txtEstado').val(estado);
        divFinanciacion.find('#txtNumFinanciacion').val(financiacion.idfinanciacion);
        divFinanciacion.find('#txtFecha').val(financiacion.fecha);
        divFinanciacion.find('#txtBanco').val(financiacion.nombrebanco);
        divFinanciacion.find('#txtCiclo').val(financiacion.ciclo);
        divFinanciacion.find('#txtPeriodo').val(financiacion.periodo);
        divFinanciacion.find('#txtDocSolicitante').val(financiacion.documentosolicita);
        divFinanciacion.find('#txtNombreSolicitante').val(financiacion.nombresolicita);
        divFinanciacion.find('#txtLiquidacion').val(financiacion.liquidacion);
        divFinanciacion.find('#txtDocumento').val(financiacion.documento);
        divFinanciacion.find('#txtNumCuotas').val(financiacion.numerocuotas);
        divFinanciacion.find('#txtTipoDocumento').val(financiacion.tipodocumento);
        divFinanciacion.find('#txtNumCuotasAmortizadas').val(financiacion.cuotasamortizadas);
        divFinanciacion.find('#txtSaldoCapital').val(financiacion.saldocapital).toTxtCurrency();
        divFinanciacion.find('#txtCapitalInicial').val(financiacion.capitalinicial).toTxtCurrency();
        divFinanciacion.find('#txtNumCuotasPendientes').val(financiacion.numerocuotas - financiacion.cuotasamortizadas);
        if (financiacion.codtipotercero === 'JUR') {
            $('#divJuridica').show();
            $('#divNatural').hide();
        }
        if (financiacion.codtipotercero === 'NAT') {
            $('#divJuridica').hide();
            $('#divNatural').show();
        }
        if (!!financiacion.informacionfinanciera) {
            var informacion = financiacion.informacionfinanciera;
            informacion.barrio = financiacion.barrio;
            informacion.correo = financiacion.correo;
            informacion.estrato = financiacion.estrato;
            informacion.municipio = financiacion.municipio;
            informacion.direccion = financiacion.direccion;
            informacion.telefonofijo = financiacion.telefonofijo;
            informacion.telefonocelular = financiacion.telefonocelular;

            that.cargarInformacionFinanciera(informacion);
        }
        if (that.appload.container) {
            that.appload.container.find('.files-list').empty();
        }
        if (!!financiacion.adjuntos) {
            that.mostrarArchivos(financiacion.adjuntos);
        } else {
            $('#divArchivos').append($('<span>').addClass('pMensaje').text('La financiación no tiene archivos adjuntos'));
        }
    },
    /** Muestra los archivos cargados en el servidor en una lista.
     * @param {object} data - Información de los archivos que se han cargado.
     * @returns {void}
     */
    mostrarArchivos: function (data) {
        if (data) {
            for (var i = 0; i < data.length; i++) {
                var info = data[i];
                var divItem = that.appload.addFileToList({url: info.ruta, name: info.nombre});

                divItem.find('.file-item-btns button').removeAttr('disabled');
                divItem.find('.file-item-btns .appload-btn-discard').attr('disabled', 'disabled');
                divItem.addClass('uploaded-item');
                $('<span class="fa fa-check-circle-o">').insertBefore(divItem.find('i.fa:first'));
            }
        }
    },

    /**
     * Carga la información financiera y actualiza totales
     * @param  {Object} info Objeto con la información financiera
     * @returns {void}
     */
    cargarInformacionFinanciera: function (info) {
        $('#divInfoFinanciera').show();
        var cant = info.cantidadexperiencia;
        var anio = parseInt(cant / 360);
        var campos = $('#divInfoFinanciera input:text');
        var mes = parseInt((cant - (anio * 360)) / 30);

        info.meslaborado = mes;
        info.aniolaborado = anio;
        for (var index = 0; index < campos.length; index++) {
            var campo = $(campos[index]);
            var informacion = info[campo.attr('data-reference')];
            campo.val(informacion);
        }
        that.actualizarTotales();
    },
    /**
     * Actualiza los totales de información financiera
     * @returns {void}
     */
    actualizarTotales: function () {
        var _this = $(this);
        var fieldsets = _this.parents('fieldset').length > 0 ? _this.parents('fieldset') : $('#divFinanciera fieldset');
        for (var f = 0; f < fieldsets.length; f++) {
            var total = 0;
            var fieldset = $(fieldsets[f]);
            var campos = fieldset.find('input:text[data-caja="number"]');
            for (var i = 0; i < campos.length; i++) {
                total += !isNaN(parseInt(campos[i].value)) ? parseInt(campos[i].value) : 0;
            }
            fieldset.find('input[data-caja="total"]').val(total).toTxtCurrency();
        }
    },
    /** Limpia toda la información del formulario y elimina información del modelo
     * @returns {void}
     */
    limpiarFormulario: function () {
        $('input[type="text"]').val('');
        $('#divArchivos span').remove();
        $('#divInfoFinanciera, #divArchivos').hide();
        //that.appload.container.find('.list-item').empty();
        $('#tblFacturas, #tblConceptos, #tblAmortizacion').empty();
        $('#divInfoFinanciera input:text').val('').attr('disabled', 'disabled');
        financiacionCrudModel = {};
    },
    /** Hace petición AJAX para consulta las facturas de la financiación seleccionada.
     * @returns {void}
     */
    cargarFacturas: function () {
        if (!financiacionCrudModel.financiacion) {
            __dom.lanzarAlerta('Debe seleccionar una financiación', __app.mensajes.atencion);
            return;
        }
        financiacionCrudControl.cargarFacturas(
                {idfinanciacion: financiacionCrudModel.financiacion.idfinanciacion},
                that.onCargarFacturaCompleto
                );
    },
    /** Captura la respuesta del servidor cuando se consultan las facturas de una financiación.
     * Visualiza las facturas en una tabla y configura elementos.
     * @returns {void}
     */
    onCargarFacturaCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(__app.mensajes.sinResultados, __app.mensajes.atencion);
                break;
            case 1:
                financiacionCrudModel.facturas = data.facturas;
                var tblFacturas = fillTable("tblFacturas", "formatoFacturas", "financiacionCrudModel.facturas", "Facturas");
                tblFacturas.find('tbody td[header="thVerDetalles"] input.tblBtn').on('click', that.mostrarDetallesFactura);
                break;
        }
    },
    /** Hace petición ajax para consultar los detalles de una factura
     * @returns {void}
     */
    mostrarDetallesFactura: function (e) {
        var _this = $(this);
        var idFactura = parseInt(_this.attr('data-id'));
        that.facturaSeleccionada = financiacionCrudControl.consultarFacturaPorId(idFactura);
        financiacionCrudControl.cargarDetallesFactura({idfactura: idFactura}, that.onCargarDetallesFacturaCompleto);
    },
    /** Captura la respuesta enviada por el servidor, cuando se consultan los detalles de una factura y lo muestra en un dialogo
     * @param  {object} data - El resultado de la petición ajax para guardar la información  del detalle de la factura
     * @returns {void}
     */
    onCargarDetallesFacturaCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(__app.mensajes.sinResultados, __app.mensajes.atencion);
            break;
            case 1:
                var factura = that.facturaSeleccionada;
                var divDetalles = $('#divDetallesFactura');
                var estado = factura.estado === 'F' ? 'Financiada' : 'Activa';
                
                divDetalles.find('#txtEstadoFactura').val(estado);
                financiacionCrudModel.conceptos = data.detallesfactura;
                divDetalles.find('#txtFechaFactura').val(factura.fecha);
                divDetalles.find('#txtIdFactura').val(factura.idfactura);
                divDetalles.find('#txtNumFactura').val(factura.numerofactura);
                divDetalles.find('#txtValorFactura').val(factura.valorfinanciado).toTxtCurrency();
                fillTable("tblConceptos", "formatoConceptos", "financiacionCrudModel.conceptos", "Conceptos");
                that.dialogoActual = divDetalles.dialogo({
                    modal: true,
                    width: 600,
                    title: 'Detalles de la Factura',
                    buttons: {
                        Aceptar: function () {
                            that.dialogoActual.dialog('close');
                        }
                    }
                });
                break;
        }
    },
    /** Hace petición ajax para consultar la amortización de la financiación
     * @returns {void}
     */
    cargarAmortizaciones: function () {
        if (financiacionCrudModel.financiacion === null) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarFinanciacion, __app.mensajes.atencion);
            return;
        }
        financiacionCrudControl.cargarAmortizaciones(
                {idfinanciacion: financiacionCrudModel.financiacion.idfinanciacion},
                that.onCargarAmortizacionesCompleto
                );
    },
    /** Captura la respuesta del servidor cuando se consulta amortizaciones de una financiación
     * @param {object} data - Respuesta del servidor con datos de amortización
     * @returns {void}
     */
    onCargarAmortizacionesCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta('No se encontraron amortizaciones', __app.mensajes.atencion);
                break;
            case 1:
                if (data.amortizaciones.length > 0) {
                    financiacionCrudModel.amortizaciones = data.amortizaciones;
                    var tblAmortizacion = fillTable("tblAmortizacion", "formatoAmortizaciones", "financiacionCrudModel.amortizaciones", "Amortización");
                    tblAmortizacion.find('td[header="thVerDetalles"] input[type="button"]').on('click', that.cargarDetalleAmortizacion);
                } else {
                    __dom.lanzarAlerta('No se encontraron amortizaciones', 'Atención');
                }
                break;
        }
    },
    /** Hace petición ajax para consultar los detalles de la amortización
     * @returns {void}
     */
    cargarDetalleAmortizacion: function () {
        var _this = $(this);
        if (financiacionCrudModel.financiacion === null) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarFinanciacion, __app.mensajes.atencion);
            return;
        }
        financiacionCrudControl.cargarDetalleAmortizaciones(
                {idamortizacion: _this.attr('data-id')},
                that.onCargarDetalleAmortizacionCompleto);
    },

    /**
     * Se ejecuta cuando se termina de consultar los detalles de la amortización.
     * @param  {object} data Respuesta del servidor
     * @returns {void}
     */
    onCargarDetalleAmortizacionCompleto: function (data) {
        if (data.codigoRespuesta === 1) {
            fillTable('tblDetalleAmortizacion', 'formatoDetalleAmortizacion', data.detalleamortizacion, 'Detalles de la Amortización');
            var divDetalles = $('#divDetalleAmortizacion');
            that.dialogoActual = divDetalles.dialogo({
                modal: true,
                width: 750,
                title: 'Detalles de la Amortización',
                buttons: {
                    Aceptar: function () {
                        that.dialogoActual.dialog('close');
                    }
                }
            });
        }
    },
    /**
     * Confirma si el usuario, desea cancelar la operación
     * @returns {void}
     */
    cancelarConsulta: function () {
        if (!!financiacionCrudModel.financiacion) {
            __dom.lanzarAlerta(
                    __app.mensajes.confirmacionCancelacion,
                    __app.mensajes.atencion,
                    that.limpiarFormulario,
                    true
                    );
        }
    },
    
      validarPermisosAdjuntar : function(){
        var data = {idPrograma: 37};
        financiacionCrudControl.consultarPermisosAdjuntar(data,that.ResultadoPermisosAdjuntar);
    },
    /** Captura la respuesta del servidor  cuando se consultan si usuario tiene permisos de grabación
     * @param {object} Data - Respuesta del servidor si usuario tiene permisos de grabación
     * @returns {void}
     * Oscar Baquero
     **/
    ResultadoPermisosAdjuntar:function (data){
        
        switch (data.codigorespuesta) {
          
            case -1:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                break;
                
            case 1:
                $('#btnAdicionarArchivos').show();
                break;
               
            default:
                
                break;
        }
    },
    
    subirAdjuntosNew: function (){
        $('#divAdjuntosFinanciacion').show();
          
        that.appload = new Appload('#txtArchivoNew', {
            url: '../generarfinanciacion/subir_archivo',
            lg: esAppload,
            multiple: true,
            showDeleteBtn: true,
            showDownloadBtn: true,
            showUploadButton: false,
            showDiscardButton: false,
            maxSize: 1024 * 1024 * 10,
            showSingleUploadBtn: false,
            fileTypes: ['pdf', 'doc', 'docx']
        });

        $('a.appload-input').css({color: '#FFF'});
        that.appload.addListener('onFileSelected', that.uploadFile);
        that.appload.addListener('onsingleupload', that.subirCompleto);
    },
    /**
     * Permite subir un archivo a penas es seleccionado
     * @param {object} data - Archivo que se subirá
     * @returns {void}
     */
    uploadFile: function (data) {
        console.log(data);
        if (!financiacionCrudModel.financiacion.idfinanciacion) {
            __dom.lanzarAlerta('No se encontró una financiación para subir soportes', __app.mensajes.atencion, function () {
             //   that.appload.container('.file-list .file-item:last').remove();
            });
            return;
        }
        if (that.appload.files.length > 0) {
            that.appload.singleUpload(data.data, {'modulo': 'financiacion'});
        }
    },
    /** Captura la respuesta del servidor, cuando se sube un archivo e invoca función para la visualización de 
     * los archivos subidos
     * @param {object} e - 
     * @param {object} data - Respuesta del servidor al cargar archivos
     * @returns {void}
     */
    subirCompleto: function (data) {
        $('#pMensaje').html('');
        data = data.data;
        switch (parseInt(data.codigoRespuesta)) {
            case 0:
                break;
            case 1:
                financiacionCrudModel.archivos = [];
                for (var i = 0; i < data.uploadedFiles.length; i++) {
                    var archivo = data.uploadedFiles[i].idarchivo;
                    financiacionCrudModel.archivos.push({idarchivo: archivo});
                    var btn = $('.files-list .file-item:last .file-item-btns button.appload-btn-delete');
                    btn.attr('data-id', archivo);
                    btn.on('click', that.eliminarArchivo);
                }
                break;
        }
    },
    /** Pide confirmación para eliminar un archivo en caso de ser "Sí"
     * Elimina un archivo de la lista de archivos y hace petición AJAX para eliminar el archivo del servidor.
     * @returns {void}
     */
    eliminarArchivo: function () {
        var _this = $(this);
        var id = _this.attr('data-id');
        $('div#divEliminarArchivo').dialogo({
            resizable: false,
            heigth: 140,
            modal: true,
            title: 'Eliminar archivo',
            buttons: {
                "Sí": function () {
                    $(this).dialog('close');
                    that.onEliminarCompleto(id, _this.parents('.file-item')[0]);
                }, Cancelar: function () {
                    $(this).dialog("close");
                }
            }
        });
    },

    /**
     * Invoca la actualización de la información de la financiación.
     * @returns {void}
     */
    actualizarInformacion: function () {
        var idfinanciacion = financiacionCrudModel.financiacion.idfinanciacion;
        if (idfinanciacion && financiacionCrudModel.archivos.length > 0) {
            var data = {
                archivos: financiacionCrudModel.archivos,
                numerofinanciacion: idfinanciacion
            };
            financiacionCrudControl.grabarArchivos(data, that.onActualizacionCompleto);
        }
    },

    /**
     * Muestra un mensaje indicando que la actualización fue exitosa y limpia el formulario.
     * @param  {Object} data La respuesta del servidor.
     * @returns {void}
     */
    onActualizacionCompleto: function (data) {
        if (data.codigoRespuesta === 1) {
            __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion, that.limpiarFormulario);
            $('#divAdjuntosFinanciacion').hide();
            location.reload();
        }
    }

};
financiacionCRUDVista.init();
