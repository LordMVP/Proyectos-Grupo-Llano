/**
 * @fileOverview Archivo de vista y control para procesar informe de aprovecgamiento
 * @author rsagudelo
 * @requires importar.control.js
 * @requires importar.modelo.js
 * @version 1.0.0
 */

/**
 * Objeto que hace referencia al namespace generarVista
 * @type {Object}
 */
var that = null;
/** @namespace */
var generarVista = {

    data: null,
    /** Inicializa el programa para generar el informe de aprovechamiento financiaciones especiales, y asigna listeners a controles
     * @returns {void}
     **/
    init: function () {
        that = generarVista;
        $('#btnCargar').on('click', that.subirAdjunto);
        $('#btnDescargar').on('click', that.descargarInforme);
        $('#btnCancelar').on('click', that.confirmarCancelar);
        $('#btnEliminarResumen').on('click', generarControl.eliminarResumen);
        __dom.configurarCalendario('txtFechaPago');
//        that.appload = new Appload('#txtArchivo', {
//            url: 'cargar/',
//            fileTypes: ['txt', 'csv'],
//            maxSize: 1024 * 1024 * 10,
//            showErrors: true,
//            traceErrors: true,
//            showDownloadBtn: false,
//            showDeleteBtn: false,
//            showDiscardButton: false,
//            showUploadButton: false,
//            showSingleUploadBtn: false,
//            onError: that.onErrorCargando,
//            beforeSend: function () {
//                __dom.mostrarCargador();
//            },
//            lg: esAppload
//        });
        
        //that.interval = setInterval(that.consultarProgreso, 5000);
        //that.appload.addListener('onupload', that.cargarCompleto);

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
//        if (that.appload.files.length === 0) {
//            __dom.lanzarAlerta('Seleccione archivos a cargar', __app.mensajes.atencion);
//            return;
//        }
        if($('#txtFechaPago').val()=='')
        {
            __dom.lanzarAlerta('Debe Seleccionar el mes a procesar...', __app.mensajes.atencion); 
        }
        var data = {
            fechapago: $('#txtFechaPago').val()
        };
        //that.appload.uploadFiles(data);
        generarControl.generarDatos(data,function(respuesta){
            console.log(respuesta);
            that.consultarProgreso();
            that.interval = setInterval(that.consultarProgreso, 5000);
        }) ;
        
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
     * Consulta el progreso del proceso de cargar financiaciones
     * @returns {void}
     */
    consultarProgreso: function () {
        var fxSuccess = function (data) {
            switch (data.codigoRespuesta) {
                case 0:
                    $('#divInfoProceso').hide();
                    clearInterval(that.interval);
                    $('#divComandos, #divPanelContenedor').show();
                    generarControl.consultarResumen(that.onConsultarResumenCompleto);
                    break;
                case 1:
                    $('#divInfoProceso').show();
                    $('#divComandos, #divPanelContenedor').hide();
                    fillTable('tblProceso', 'formatoProgreso', data.progreso, '');
                    break;
            }
        };
        generarControl.consultarProgreso(fxSuccess);
    },
    /**
     * Consulta el resultado de la importanción de financiaciones realizada
     * @param {Object} data - Información enviada por el servidor con los Registros procesados
     */
    onConsultarResumenCompleto: function (data) {
        if (data.codigoRespuesta > 0) {
            fillTable('tblResumen', 'formatoResumen', data.resumencorrectos, 'Registros Aprovechadores correctos');
            }  
            if(data.resumenconerrores.length > 0){
                fillTable('tblResumenConProblemas', 'formatoResumenErrores', data.resumenconerrores, 'Registros Aprovechadores sin Procesar');
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
     * Consulta el progreso del proceso de cargar pagos a las financiaciones
     * @returns {void}
     */
    descargarInforme: function () 
    {
        if($('#txtFechaPago').val()=='')
        {
            __dom.lanzarAlerta('Debe Seleccionar el mes a procesar...', __app.mensajes.atencion); 
            return ;
        }
        var data = {
            fechapago: $('#txtFechaPago').val()
        };
        generarControl.descargarDatos(that.onDescargarInformeCompleto, data); 
    },
    /**
     * Consulta el resultado de la importanción de pagos a las financiaciones realizada
     * @param {Object} data - Información enviada por el servidor con los pagos subidos correctamente y las que no se pudieron cargarse
     */
    onDescargarInformeCompleto: function (data) {
        if (data.codigoRespuesta == 0 ) 
        {
             __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion); 
            return;
         }
        if (data.codigoRespuesta == 2 ) 
        {
            var datos = data.datos ;
            that.descargarArchivo(that.generarTexto(datos), 'archivo.txt');  
            return;
         }  
    },
    descargarArchivo: function(contenidoEnBlob, nombreArchivo) {
        var reader = new FileReader();
        reader.onload = function (event) {
            var save = document.createElement('a');
            save.href = event.target.result;
            save.target = '_blank';
            save.download = nombreArchivo || 'archivo.dat';
            var clicEvent = new MouseEvent('click', {
                'view': window,
                    'bubbles': true,
                    'cancelable': true
            });
            save.dispatchEvent(clicEvent);
            (window.URL || window.webkitURL).revokeObjectURL(save.href);
        };
        reader.readAsDataURL(contenidoEnBlob);
    },
    generarTexto: function(datos) {
        var texto = [];        
        texto.push(datos);
        return new Blob(texto, {
            type: 'text/plain'
        });
    }
};
generarVista.init();
