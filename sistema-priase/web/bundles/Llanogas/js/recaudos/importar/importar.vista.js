/**
 * @fileOverview Archivo de vista y control para importar recaudos
 * @author angelicaGomez
 * @requires recaudos.js
 * @requires importar.control.js
 * @requires importar.modelo.js
 * @version 1.0.0
 */

/**
 * Objeto que hace referencia al namespace importarVista
 * @type {Object}
 */
var that = null;
/** @namespace */
var importarVista = {

    data: null,
    /** Inicializa el programa para importar recaudos, y asigna listeners a controles
     * @returns {void}
     **/
    init: function () {
        that = importarVista;
        $('#btnCargar').on('click', that.subirAdjunto);
        $('#btnCancelar').on('click', that.confirmarCancelar);
        $('#cmbMedioPago').on('change', that.consultarSucursales);
        $('#btnEliminarResumen').on('click', importarControl.eliminarResumen);
        __dom.configurarCalendario('txtFechaPago');
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
        var select = $('#divPanelContenedor select');
        for (var i = 0; i < select.length; i++) {
            var cmb = $(select[i]);
            if (cmb.val() == '-1') {
                __dom.lanzarAlerta("Seleccione " + cmb.parent().find('label').text(), __app.mensajes.atencion);
                return;
            }
        }

        if (that.appload.files.length === 0) {
            __dom.lanzarAlerta('Seleccione archivos a cargar', __app.mensajes.atencion);
            return;
        }
        var data = {
            idformapago: $('#cmbFormaPago').val(),
            idmediopago: $('#cmbMedioPago').val(),
            idsucursal: $('div select#cmbSucursal').val(),
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
     * Consulta el progreso del proceso de cargar recaudos
     * @returns {void}
     */
    consultarProgreso: function () {
        var fxSuccess = function (data) {
            switch (data.codigoRespuesta) {
                case 0:
                    $('#divInfoProceso').hide();
                    clearInterval(that.interval);
                    $('#divComandos, #divPanelContenedor').show();
                    importarControl.consultarResumen(that.onConsultarResumenCompleto);
                    break;
                case 1:
                    $('#divInfoProceso').show();
                    $('#divComandos, #divPanelContenedor').hide();
                    fillTable('tblProceso', 'formatoProgreso', data.progreso, '');
                    break;
            }
        };
        importarControl.consultarProgreso(fxSuccess);
    },
    /**
     * Consulta el resultado de la importanción de recaudos realizada
     * @param {Object} data - Información enviada por el servidor con los recaudos subidos correctamente y los que no se pudieron cargae
     */
    onConsultarResumenCompleto: function (data) {
        if (data.codigoRespuesta > 0) {
            fillTable('tblResumen', 'formatoResumen', data.resumencorrectos, 'Recaudos correctos');
            }  
            if(data.resumenconerrores.length > 0){
                fillTable('tblResumenConProblemas', 'formatoResumenErrores', data.resumenconerrores, 'Recaudos sin cargar');
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
    consultarSucursales: function(){
        var idMedioPago = $('select#cmbMedioPago').val();
        importarControl.consultarSucursales( {idmediopago:idMedioPago} , that.cargarComboSucursales);
    },
    
    cargarComboSucursales:function(data){
        var data2 = '<label for="cmbSucursal"> Sucursal:</label>';
         data2 += data;
        $('#cmbSucursal').html(data2);
    }
};
importarVista.init();
