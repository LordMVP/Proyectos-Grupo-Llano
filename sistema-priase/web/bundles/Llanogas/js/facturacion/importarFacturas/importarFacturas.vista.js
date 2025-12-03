/**
 * @fileOverview Archivo de vista y control para importar facturas
 * @author angelicaGomez
 * @requires recaudos.js
 * @requires importarFacturas.control.js
 * @requires importarFacturas.modelo.js
 * @version 1.0.0
 */

/**
 * Objeto que hace referencia al namespace importarFacturasVista
 * @type {Object}
 */
var that = null;
/** @namespace */
var importarFacturasVista = {
    /**
     * Guarda una referencia al dialogo actual de la interfaz, al diálogo que esté abierto.
     * @type {Object}
     */
    dialogoActual: null,
    /** Inicializa el programa para importar facturas, y asigna listeners a controles
     * @returns {void}
     **/
    init: function () {
        $('#tabs').tabs();
        that = importarFacturasVista;
        
        var fila = $('#tblResultado tr:last');
        var celdas = fila.find('td').length;
        for (var i = 1; i <= 3 - celdas; i++) {
            fila.append($('<td>'));
        }

        if ($('#spanCodigo').attr('data') == 1) {
            $('#btnImprimir').on('click', function (e) {
                e.preventDefault();
                window.print();
            });
        } else {
            $('#btnCargar').on('click', that.cargarArchivo);
            $('#btnCancelar').on('click', that.confirmarCancelar);
        }
         that.appload = new Appload('#txtArchivo', {
            url: 'cargar_archivos/',
            fileTypes: ['xml'],
            maxSize: 1024 * 1024 *  100 * 100,
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
     * Solicita confirmación para enviar el cargue másivo
     * @returns {void} 
     */
    confirmarEnviar: function () {
        var tabActivo = $('#tabs').tabs('option', 'active');
        var operador = $($('div#tabs li a')[tabActivo]).attr('data') ;
        if (operador === "C") {  
            that.dialogoActual = $('#divConfirmaEliminar').dialogo({
                resizable: false,
                heigth: 140,
                modal: true,
                title: 'Continuar con el Cargue Masivo',
                buttons: {
                    Continuar: function () {
                        that.text.attr('type', 'text');                        
                        that.dialogoActual.dialog('close');
                        that.subirAdjunto();
                    },
                    Cancelar: function () {
                        that.dialogoActual.dialog('close');
                    }
                }
            });
        }
        else{
            that.subirAdjunto();
        }
    },
    /** Valida que el archivo que se intenta subir tenga la extensión y el peso necesario
     * @returns {void}
     **/
    cargarArchivo: function (e) {

        var tabActivo = $('#tabs').tabs('option', 'active') ;
        var operador = $($('div#tabs li a')[tabActivo]).attr('data') ;
 
        $('#txtOperacion').val(operador === "S" ? 'S' : 'C');
        if (operador === "S") {    
            $('select#cboCiclo').val(-1);            
            that.text = $('#txtArchivo');
            var x = $('#txtArchivoSuscripcion')[0];
            var proceso = $('#divInfoProceso');
            proceso.show();
        } else if (operador === "C") {
            var idCiclo = parseInt($('select#cboCiclo').val());
            if (idCiclo === -1 || !idCiclo) {
                __dom.lanzarAlerta(__app.mensajes.seleccionarCiclo, __app.mensajes.atencion);
                return;
            }
            var x = $('#txtArchivo')[0];
            that.text = $('#txtArchivoSuscripcion');
            var proceso = $('#divInfoProceso');
            proceso.show();
        }
      /*  if (x.value === '') {
            __dom.lanzarAlerta('Seleccione archivos a cargar', __app.mensajes.atencion);
            e.preventDefault();
            return;
        }

        for (var i = 0; i < x.files.length; i++) {
            file = x.files[i];

            var extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
            if (extension !== '.xml') {
                __dom.lanzarAlerta('El archivo ' + file.name + ' no tiene una extensión .xml y no se puede subir al sistema');
                __app.cancelarEvento(e);
                return;
            }
*/
        /*   if ('size' in file) {
                if (file.size > 157286400) {
                    __dom.lanzarAlerta('El achivo ' + file.name + ' excede  150Mb', __app.mensajes.atencion);
                    __app.cancelarEvento(e)
                    return;
                }
            }*/
        /*}*/
        that.confirmarEnviar();
    },
    /** Confirma si el usuario desea cancelar la operación en tal caso se borran
     * datos del formulario y actualiza modelo.
     * @returns {void}
     */
    confirmarCancelar: function () {
        that.dialogoActual = $('#divConfirmarCancelar').dialogo({
            resizable: false,
            heigth: 140,
            modal: true,
            title: 'Cancelar operación',
            buttons: {
                "Sí": function () {
                    that.dialogoActual.dialog('close');
                    that.limpiarFormulario();
                    
                },
                No: function () {
                    that.dialogoActual.dialog('close');
                }
            }
        });
    },
    
    subirAdjunto: function () {

        if (that.appload.files.length === 0) {
            __dom.lanzarAlerta('Seleccione archivos a cargar', __app.mensajes.atencion);
            return;
        }
        
        var idCiclo = parseInt($('select#cboCiclo').val());
        var operador = $('#txtOperacion').val();
        var data = {
            cboCiclo: idCiclo,
            operacion: operador
        };
        $('#divPanelContenedor').hide();
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
    
     /**
     * Consulta el progreso del proceso de importar Facturas
     * @returns {void}
     */
    consultarProgreso: function () {
        var fxSuccess = function (data) {
            switch (data.codigoRespuesta) {
                case 0:
                    $('#divInfoProceso').hide();
                    clearInterval(that.interval);
                    $('#btnCargar').show();
                    $('#divPanelContenedor').show();
                    importarFacturasControl.consultarResumen(that.onConsultarResumenCompleto);
                    break;
                case 1:
                    $('#divInfoProceso').show();
                    $('#divPanelContenedor').hide();
                    $('#btnCargar').hide();
                    fillTable('tblProceso', 'formatoProgreso', data.progreso, '');
                    break;
            }
        };
        importarFacturasControl.consultarProgreso(fxSuccess);
    },
    
     /**
     * Consulta el resultado de la importanción de recaudos realizada
     * @param {Object} data - Información enviada por el servidor con los recaudos subidos correctamente y los que no se pudieron cargae
     */
    onConsultarResumenCompleto: function (data) {
        if (data.codigoRespuesta > 0) {
            fillTable('tblResumen', 'formatoResumen', data.resumencorrectos, 'Facturas Procesadas');
            }  
            if(data.resumenconerrores.length > 0){
                fillTable('tblResumenConProblemas', 'formatoResumenErrores', data.resumenconerrores, 'Facturas con Errores');
                var empresa = $('#hiddenEmpresa').val();
                $('#thSuscripcionBio').empty();
                $('#thSuscripcionBio').text('Id. Sucripción '+ empresa);                
            }
            return;
    },
    
    /**
     * Limpia el formulario y elimina la información de la importación.
     * @returns {void}
     */
    limpiarFormulario: function () {
        $('#select').val('-1');
        //$('#txtArchivo').fileinput('clear');
        var fxSuccess = function (data) {
            var fxRecargar = function () {
                //window.location.reload();
                
            };
            switch (data.codigoRespuesta) {
                case 0:
                    __dom.lanzarAlerta("Error no se pudo cancelar", __app.mensajes.atencion, fxRecargar, null, fxRecargar);
                    break;
                case 1:
                   __dom.lanzarAlerta("Proceso cancelado por usuario", __app.mensajes.atencion, fxRecargar, null, fxRecargar);
                    break;
            }
        };
        importarFacturasControl.cancelaImportacion(fxSuccess);
        
    }
};
importarFacturasVista.init();