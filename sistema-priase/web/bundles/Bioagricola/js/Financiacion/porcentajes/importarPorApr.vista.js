/**
 * @fileOverview Archivo de vista y control para importar los porcentajes de aprovechamiento
 * @author rsagudelo
 * @requires importarPorApr.control.js
 * @requires importarPorApr.modelo.js
 * @version 1.0.0
 */

/**
 * Objeto que hace referencia al namespace importarVista
 * @type {Object}
 */
var that = null;
/** @namespace */
var importarPorAprVista = {

    data: null,
    /** Inicializa el programa para importar porcentajes de Aprovechamiento, y asigna listeners a controles
     * @returns {void}
     **/
    init: function () {
        that = importarPorAprVista;
        $('#btnCargar').on('click', that.subirAdjunto);
        $('#btnCancelar').on('click', that.confirmarCancelar);
        $('#btnConsultar').on('click', that.consultarPorcentajes);
        $('#btnEliminarResumen').on('click', importarPorAprControl.eliminarResumen);
        __dom.configurarCalendario('txtFechaPago');
        $('#divTerceros').hide();
        that.appload = new Appload('#txtArchivo', {
            url: 'cargar/',
            fileTypes: ['txt', 'csv'],
            maxSize: 1024 * 1024 * 10,
            showErrors: true,
            traceErrors: true,
            showDownloadBtn: false,
            showDeleteBtn: false,
            showDiscardButton: false,
            showUploadButton: false,
            showSingleUploadBtn: false,
            onError: that.onErrorCargando,
            beforeSend: function () {
                __dom.mostrarCargador();
            },
            lg: esAppload
        });
        that.consultarProgreso();
        that.interval = setInterval(that.consultarProgreso, 5000);
        that.appload.addListener('onupload', that.cargarCompleto);

    },
    /**
     * Función ejecutada en caso de error al subir archivo
     * @param {Object} data - Información del error de subida
     */
    onErrorCargando: function (data) {
        __dom.ocultarCargador();
        __dom.lanzarAlerta('Ocurrió un error al cargar el archivo adjunto', __app.mensajes.atencion);
    },
    /** Sube los archivos al servidor con datos del programa
     * @returns {void}
     **/
    subirAdjunto: function () {
        if ($('#txtFechaPago').val() == '-1') {
            __dom.lanzarAlerta("Debe Ingresar el Mes a Procesar ", __app.mensajes.atencion);
            return;
        }   
        if (that.appload.files.length === 0) {
            __dom.lanzarAlerta('Seleccione archivos a cargar', __app.mensajes.atencion);
            return;
        }
        var data = {
            fechapago: $('#txtFechaPago').val()
        };
        that.appload.uploadFiles(data);
    },
    /** Captura la respuesta del servidor cuando se carga un archivo
     * @param {object} data - Respuesta del servidor con datos del archivo subido
     * @returns {void}
     **/
    cargarCompleto: function (data) {
        __dom.ocultarCargador();
        var fxRecargar = function () {
            window.location.reload();
        };
        switch (data.data.codigoRespuesta) {
            case 0:
            case -1:
                __dom.lanzarAlerta(data.data.mensaje, __app.mensajes.atencion);
                break;
            case 1:
                __dom.lanzarAlerta(data.data.mensaje, __app.mensajes.atencion, fxRecargar, null, fxRecargar);
                break;
        }
    },
    /** Confirma si el usuario desea cancelar la operación en tal caso se borran
     * datos del formulario y actualiza modelo.
     * @returns {void}
     */
    confirmarCancelar: function () {
        if (that.appload.files.length > 0) {
            $('#divCancelarOpe').dialogo({
                resizable: false,
                heigth: 140,
                modal: true,
                title: 'Cancelar operación',
                buttons: {
                    "Sí": function () {
                        that.limpiarFormulario();
                        $(this).dialog('close');
                    },
                    No: function () {
                        $(this).dialog('close');
                    }
                }
            });
        }
    },
    /**
     * Consulta el progreso del proceso de cargar Porcentajes de Aprovechamiento
     * @returns {void}
     */
    consultarProgreso: function () {
        var fxSuccess = function (data) {
            switch (data.codigoRespuesta) {
                case 0:
                    $('#divInfoProceso').hide();
                    clearInterval(that.interval);
                    $('#divComandos, #divPanelContenedor').show();
                    importarPorAprControl.consultarResumen(that.onConsultarResumenCompleto);
                    break;
                case 1:
                    $('#divInfoProceso').show();
                    $('#divComandos, #divPanelContenedor').hide();
                    fillTable('tblProceso', 'formatoProgreso', data.progreso, '');
                    break;
            }
        };
        importarPorAprControl.consultarProgreso(fxSuccess);
    },
    /**
     * Consulta el resultado de la importanción de los Porcentajes realizada
     * @param {Object} data - Información enviada por el servidor con los pagos subidos correctamente y las que no se pudieron cargarse
     */
    onConsultarResumenCompleto: function (data) {
        if (data.codigoRespuesta > 0) {
            fillTable('tblResumen', 'formatoResumen', data.resumencorrectos, 'Registros Cargados Correctamente');
            }  
            if(data.resumenconerrores.length > 0){
                fillTable('tblResumenConProblemas', 'formatoResumenErrores', data.resumenconerrores, 'Registros sin cargar');
            }
            return;
        
        $('#btnEliminarResumen').hide();
    },
    /**
     * Limpia el formulario y elimina la información de la importación.
     * @returns {void}
     */
    limpiarFormulario: function () {
        $('#select').val('-1');
        $('#txtArchivo').fileinput('clear');
    },
    
    /**
     * Consulta los datos de lo porcetaje por mes
     * @returns {void}
     */
    consultarPorcentajes: function () 
    {
        if ($('#txtFechaPago').val() == '') {
            __dom.lanzarAlerta("Debe Ingresar el Mes a Consultar ", __app.mensajes.atencion);
            return;
        }
        var data = {
            fechapago: $('#txtFechaPago').val()
        };       
        $('#divTerceros').hide();
        importarPorAprControl.consultarDatos(that.onConsultarPorcentajesCompleto, data); 
    },
    /**
     * muestra el resultado de la consulta de los procentajes de aprovechamiento
     * @param {Object} data - Información enviada por el servidor con los porcentajes consultados
     */
    onConsultarPorcentajesCompleto: function (data) {
         switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(data.mensaje , __app.mensajes.atencion);
                break;
            case 1: 
                if(data.por_terceros.length > 0)
                {
                    $('#divTerceros').show();
                    fillTable('tblTerceros', 'formatoTerceros', data.por_terceros, 'Distribucion de Terceros' );
                }
            break;
        }          
        return;   
    }

};
importarPorAprVista.init();
