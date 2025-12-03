/**
 * Objeto que hace referencia al namespace cargarLecturaVista
 * @type {object}
 */
var that = null;
/**
 * @fileOverview Archivo de control para el cargue de lecturas
 * @author appFuture
 * @version 1.0.0
 * @namespace cargarLecturaControl
 */
var cargarLecturaControl = {
    /**
     * Carga el archivo de las lecturas en el servidor
     * @param {Object} data - Configuración de la subida del archivo (file, tipocargue)
     * @param {Function} success - Función que verificar el resultado de la subida del archivo
     */
    cargarArchivo: function (data, success) {
        $.ajax({
            url: 'subir/',
            data: data,
            'type': 'POST',
            processData: false,
            contentType: false,
            dataType: 'json',
            success: function (data) {
                switch (data.codigoRespuesta) {
                    case -2:
                        __app.cerrarSesion();
                        break;
                    case -1:
                        __app.controlarError(data);
                        break;
                }
                success(data);
            },
            'beforeSend': __dom.mostrarCargador,
            'error': function(error){
                __app.ajustarAnchoMenu();
                __cnn.capturarError(error);
            }
        });
    },
    /**
     * Hace petición al servidor para consultar el resultado de procesar las lecturas del archivo
     * @param success
     */
    consultarResumen: function (success) {
        __cnn.ajax({
            url: 'resumen/',
            completado: success
        });
    }
};
/**
 * @fileOverview Archivo de vista para el cargue de lecturas
 * @author appFuture
 * @version 1.0.0
 */
/** @namespace */
var cargarLecturaVista = {
    /**
     * Inicializa el programa de cargue de lecturas
     * @returns {void}
     */
    init: function () {
        that = this;
        $('#btnGrabar').on('click', that.cargarLecturas);
        $('#btnCancelar').on('click', that.cancelarCargue);

    },
    /**
     * Se limpia la información cargada en la vista
     */
    cancelarCargue: function () {
        if (that.apptable) {
            that.apptable.destroy();
        }
        var _txt = $('#txtArchivo');
        _txt.replaceWith(_txt.clone(true));
    },
    /** Valida que el archivo exista 
     * @returns {void}
     */
    cargarLecturas: function () {
        var cbo = $('#cmbTipoCargue').val();
        var txt = document.getElementById("txtArchivo");

        if (txt.files.length === 0) {
            __dom.lanzarAlerta('Debe seleccionar el archivo a procesar, intente nuevamente', __app.mensajes.atencion);
            return;
        }
        var formData = new FormData();
        formData.append('tipocargue', cbo);
        formData.append('files', txt.files[0]);
        cargarLecturaControl.cargarArchivo(formData, that.onCargarCompleto);
    },
    /**
     * Obtiene la respuesta del servidor cuando se termina de subir el archivo y limpia el formulario
     * @param data
     */
    onCargarCompleto: function (data) {
        __dom.ocultarCargador();
        if (data.codigoRespuesta) {
            that.consultarResumen();
            if (that.apptable) {
                that.apptable.destroy();
            }
            $('#spanGuardars').text('');
            __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion, function () {
                var _txt = $('#txtArchivo');
                _txt.replaceWith(_txt.clone(true));
            });
        }
    },
    /**
     * Consulta el resultado de la subida del archivo
     */
    consultarResumen: function () {
        cargarLecturaControl.consultarResumen(that.onConsultarResumenCompleto);
    },
    /**
     * Obtiene la respuesta del servidor cuando se consulta el resumen del procesamiento del archivo subido y la muestra en la tabla 
     * @param {Object} data - Respuesta del servidor
     */
    onConsultarResumenCompleto: function (data) {
        if (data.codigoRespuesta === 1) {
            var columnaError = [
                {type: 'text', text: 'Fecha', headers: 'thFecha', data: 'fecha', class: 'string', sortType: 'number'},
                {type: 'text', text: 'Suscripción', headers: 'thSuscripcion', data: 'suscripcion', class: 'number', sortType: 'number'},
                {type: 'text', text: 'Filas afectadas', headers: 'thFilas', data: 'filasafectadas', class: 'number', sortType: 'number'},
                {type: 'text', text: 'Estado', headers: 'thEstado', data: 'estado', sortType: 'string'},
                {type: 'text', text: 'Mensaje', headers: 'thMensaje', data: 'descripcion', sortType: 'string'}
            ];

            var config = {
                pagination: true,
                searchable: false,
                cellNavigable: false,
                columns: columnaError,
                title: 'Resumen de últimas lecturas procesadas',
                linesPageRange: [10, 20, 30, 50],
                lg: lenguajeTabla
            };

            if (that.apptable) {
                that.apptable.destroy();
            }
            that.apptable = new Apptable('#tblErrores', config, data.resumen);
        }
    }

};
cargarLecturaVista.init();
