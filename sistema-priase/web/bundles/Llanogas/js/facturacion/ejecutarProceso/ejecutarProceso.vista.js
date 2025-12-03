/**
 * @fileOverview Archivo de vista y control para ejecutar proceso de facturación
 * @author Angélica Gómez
 * @requires ejecutarProceso.control.js
 * @requires ejecutarProceso.modelo.js
 * @version 1.0.0
 */

/**
 * Objeto que hace referencia al namespace ejecutarVista
 * @type {Object}
 */
var that = null;

/** @namespace */
var ejecutarVista = {
    /**Inicializa el programa de movimiento contable, y asigna listeners a los controles
     * @returns {void}
     */
    init: function () {
        that = ejecutarVista;
        $('#btnBuscarSuscripcion').on('click', that.mostrarBuscar);
        $('#btnEjecutarProceso').on('click', that.confirmarEjecución);
        $('#cmbProceso').on('change', that.elegirProceso);
        $('#btnLiquidar').on('click', that.liquidarSuscripcion);
        $('#btnLiquidarVarias').on('click', that.variasSuscripciones);
        $('#btnAprobarLiquidacion, #btnAprobarLiquidacionUnica,#btnAprobarLiquidacionVarias').on('click', that.aprobarLiquidacion);
        $('#btnEliminarLiquidacion, #btnEliminarLiquidacionUnica, #btnEliminarLiquidacionVarias').on('click', that.eliminarLiquidacion);
        ejecutarControl.consultarEjecucion(that.consultarEjecucion);
        ejecutarModelo.interval = setInterval(function () {
            ejecutarControl.consultarEjecucion(that.consultarEjecucion);
        }, 20000);
    },
    /** Visualiza controles según el tipo de proceso a realizar
     * @returns {void}
     **/
    elegirProceso: function () {
        if ($('#cmbProceso').val() == 'masivo') {
            $('#divCabecera').show();
            $('#divVariasSuscripciones').hide();
            $('#divEspecifica').hide();
        } else if ($('#cmbProceso').val() == 'suscripcion') {
            $('#divCabecera').hide();
            $('#divVariasSuscripciones').hide();
            $('#divEspecifica').show();
        }
        else if ($('#cmbProceso').val() == 'variasSuscripciones') {
            $('#divCabecera').hide();
            $('#divEspecifica').hide();
            $('#divVariasSuscripciones').show();
        }
    },
    /** Abre cuadro de diálogo con formulario para buscar una suscripción
     * @returns {void}
     **/
    mostrarBuscar: function () {
        that.dialogoActual = $('#camposBuscarSuscripcion').dialogo({
            modal: true,
            width: 550,
            title: 'Buscar suscripción',
            buttons: {
                Buscar: that.filtrarSuscriptor,
                Cancelar: function () {
                    that.dialogoActual.dialog('close');
                }
            }
        });
    },
    /** Valida la información del filtro de suscripción y envía la solicitud al servidor
     * @returns {void}
     */
    filtrarSuscriptor: function () {
        var filtro = $('div#camposBuscarSuscripcion');
        var suscripcion = filtro.find('#txtSuscripcionFiltro').val().trim();
        var cedula = filtro.find('#txtDocumentoTer').val().trim();
        var codAnt = filtro.find('#txtCodAnterior').val().trim();
        if (suscripcion === '' && codAnt === '' && cedula === '') {
            filtro.find('#spanMensaje').text(__app.mensajes.camposInvalidosFiltro).show();
        } else {
            var data = {
                idsuscripcion: suscripcion,
                codigoanterior: codAnt,
                cedula: cedula
            };
            ejecutarControl.consultarSuscripcion(data, that.consultaSuscripcionCompleto);
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
                if (data.suscripciones.length > 1) {
                    that.dialogoActual.find('div.listaSeleccion').remove();
                    var divSuscripciones = $('<div>').addClass('listaSeleccion');
                    $.each(data.suscripciones, function (s, susc) {
                        var div = $('<div>');
                        var radio = $('<input type="radio">');
                        radio.val(susc.idsuscripcion);
                        radio.attr('id', 'radio_susc_' + s);
                        radio.attr('data-indice', s);
                        radio.attr('name', 'radio_suscripciones');
                        var label = $('<label>').attr('for', 'radio_susc_' + s);
                        label.text(susc.documento + ' - ' + susc.nombre + ' - suscripción: ' + susc.idsuscripcion
                                + ' - Cód Anterior: ' + susc.codanterior
                                + ' - Tipo Suscripción: ' + susc.tiposuscripcion);
                        div.append(radio).append(label);
                        divSuscripciones.append(div);
                    });
                    var btn = $('<button>').text('Seleccionar').addClass('btnSimple');
                    btn.on('click', function () {
                        var suscSeleccionada = that.dialogoActual.find('input[name="radio_suscripciones"]:checked');
                        if (suscSeleccionada.length > 0) {
                            sus = data.suscripciones[parseInt(suscSeleccionada.attr('data-indice'))];
                            divSuscripciones.remove();
                        } else {
                            that.dialogoActual.find('#spanMensaje').text(__app.mensajes.seleccionarOpcion).show();
                        }
                    });
                    divSuscripciones.insertAfter(that.dialogoActual.find('#spanMensaje'));
                    divSuscripciones.append(btn);
                } else {
                    sus = data.suscripciones[0];

                }
                that.dialogoActual.find('#spanMensaje').hide();
                that.dialogoActual.dialog('close');
                that.cargarSuscripcion(sus);
                ejecutarModelo.suscripcion = sus;
                break;
        }
    },
    /** Carga la cabecera del formulario con los datos de la suscripción seleccionada.
     * @param {object} suscriptor - Información de la suscripción seleccionada
     * @returns {void}
     */
    cargarSuscripcion: function (data) {
        var suscripcion = data;
        var fieldset = $('#fieldsetDetallesSuscripcion');
        fieldset.find('#txtNombreTercero').val(suscripcion.nombretercero);
        fieldset.find('#txtDocumentoTercero').val(suscripcion.cedula);
        fieldset.find('#txtIdSuscripcion').val(suscripcion.idsuscripcion);
        fieldset.find('#txtCodigoAnterior').val(suscripcion.codigoanterior);
        fieldset.find('#txtFechaInicio').val(suscripcion.fechainicio);
        fieldset.find('#txtDescripcion').val(suscripcion.descripcion);
        fieldset.find('#txtTipoSuscripcion').val(suscripcion.tiposuscripcion);
        fieldset.find('#txtRuta').val(suscripcion.ruta);
        fieldset.find('#txtCiclo').val(suscripcion.ciclo).attr('data-id', suscripcion.idciclo);
        fieldset.find('#txtTipoUso').val(suscripcion.tipousosuscripcion);
        fieldset.find('#txtLiquidacion').val(suscripcion.liquidacion).attr('data-id', suscripcion.idliquidacion);
        fieldset.find('#txtEstrato').val(suscripcion.estrato);
        fieldset.find('#txtEstado').val(suscripcion.estado);
        fieldset.find('#txtFactorCorreccion').val(suscripcion.factorcorreccion);
        fieldset.find('#txtSuscripciones').val("");
        fieldset.find('#txtSuscripciones').prop( "disabled", true );
    },
    /** Confirma si el usuario realmente desea iniciar el proceso de facturación
     * @returns {void}
     **/
    confirmarEjecución: function () {
        __dom.lanzarAlerta('Se va a ejecutar el proceso de facturación, ¿Desea continuar con la ejecución?',
                'Ejectutar proceso',
                function () {
                    that.lanzaProceso = true;
                    ejecutarControl.ejecutarProceso({
                        idciclo: $('#cmbCiclo').val(),
                        preliquidar: $('#cmbPreliquidar').val()
                    }, that.onEjectutarCompleto);
                }, true);
    },
    /** Captura la respuesta del servidor cuando se ejecuta el proceso.
     * @param {object} data - Respuesta del servidor con datos del inicio de la ejecución
     * @returns {void}
     **/
    onEjectutarCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 1:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                ejecutarControl.consultarEjecucion(that.consultarEjecucion);

                ejecutarModelo.interval = setInterval(function () {
                    ejecutarControl.consultarEjecucion(that.consultarEjecucion);
                }, 20000);

                $('#divCombo, #divEspecifica, #divCabecera').hide();
                $('#divProcesando, #divCargando').show();
                break;
            default:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                break;
        }
    },
    /** Captura la respuesta del servidor cuando se consulta el proceso en ejecución
     * @param {object} data - Respuesta del servidor con información del progreso del proceso en ejecución
     * @returns {void}
     **/
    consultarEjecucion: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                clearInterval(ejecutarModelo.interval);
                $('#divCombo').show();
                $('#divProcesando').hide();
                $('#cmbProceso').change();
                var data = {};
                data.idciclo = $('#cmbCiclo').val();
                ejecutarControl.consultarErroresProceso(that.onConsultarErroresCompleto, data);
                break;
            case 1:
                $('#divCombo, #divEspecifica, #divCabecera').hide();
                $('#divProcesando, #divCargando').show();
                ejecutarModelo.ejecucion = [];
                ejecutarModelo.ejecucion.push(data.datos);
                fillTable("tblEjecucion", "formatoProceso", "ejecutarModelo.ejecucion", "");
                //ejecutarControl.consultarErroresProceso(that.onConsultarErroresCompleto);
                break;
            default:
                clearInterval(ejecutarModelo.interval);
                $('#divCombo').show();
                $('#divProcesando').hide();
                $('#cmbProceso').change();
                break;
        }
    },
    /**
     * Valida el código de respuestas cuando consulta el resultado del proceso de facturación
     * @param {object} data - Respuesta del servidor
     * @returns {void}
     **/
    onConsultarErroresCompleto: function (data) {
        var divErroresProceso = $('#divErroresProceso');
        $('#fsCorrectasProceso').show();
        var correctos = $('#fsCorrectasProceso').hide();
        var errores = $('#fsErroresProceso').hide();
        divErroresProceso.find('.tabla').empty();
        switch (data.codigoRespuesta) {
            case 0:
                divErroresProceso.hide();
                break;
            case -1:
                divErroresProceso.hide();
                break;
            case -3:

                divErroresProceso.show();
                if (that.lanzaProceso) {
                    __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                }
                if (data.errores.length > 0) {
                    errores.show();
                    fillTable('tblErroresProceso', 'formatoErroresProceso', data.errores, 'Errores en el procesamiento');
                    fillTable('tblErroresProcesoVarias', 'formatoErroresProceso', data.errores, 'Errores en el procesamiento');
                }
                if (data.correctos.length > 0) {
                    correctos.show();
                    fillTable('tblFacturasCorrectas', 'formatoFacturasCorrectas', data.correctos, 'Facturas procesadas');
                    fillTable('tblFacturasCorrectasVarias', 'formatoFacturasCorrectas', data.correctos, 'Facturas procesadas');
                }
                break;
        }
    },
    /** Hace petición ajax 
     * @returns {void}
     **/
    liquidarSuscripcion: function () {
        if (!ejecutarModelo.suscripcion) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarSuscripcion, __app.mensajes.atencion);
            return;
        }
        var data = {
            idsuscripcion: ejecutarModelo.suscripcion.idsuscripcion,
            idciclo: ejecutarModelo.suscripcion.idciclo,
            idliquidacion: ejecutarModelo.suscripcion.idliquidacion,
            preliquidar: $('#cmbPreliquidar').val()
        };
        ejecutarControl.liquidarSuscripcion(data, that.onLiquidarCompleto);

    },
    /** 
     * Hace petición ajax para aprobar la liquidación
     * @returns {void}
     **/
    aprobarLiquidacion: function () {
        var data = {idciclo: $('#cmbCiclo').val()};
        var suscripciones = $('#txtSuscripciones').val();
        if (ejecutarModelo.suscripcion && $('#cmbProceso').val() == 'suscripcion') {
            data.idciclo = ejecutarModelo.suscripcion.idciclo;
            data.idsuscripcion = ejecutarModelo.suscripcion.idsuscripcion;
        }
        if (suscripciones != "" && $('#cmbProceso').val() == 'variasSuscripciones') {
            data.idciclo = 0;
            data.idsuscripcion = suscripciones;
        }
        ejecutarControl.aprobarLiquidacion(that.onAprobarCompleto, data);
    },
    /** 
     * Hace petición ajax para eliminar la liquidación pendiente
     * @returns {void}
     **/
    eliminarLiquidacion: function () {
        __dom.lanzarAlerta('Se borrará el registro <b>"' + $('#cmbCiclo').find('option:selected').text() + '"</b>' + ' permanentemente, ¿Desea continuar?', 'Atención', function () {
            var data = {};
            var suscripciones = $('#txtSuscripciones').val();
            data.idciclo = $('#cmbCiclo').val();
            if (ejecutarModelo.suscripcion && $('#cmbProceso').val() == 'suscripcion') {
                data.idciclo = ejecutarModelo.suscripcion.idciclo;
                data.idsuscripcion = ejecutarModelo.suscripcion.idsuscripcion;
            }
            if (suscripciones != "" && $('#cmbProceso').val() == 'variasSuscripciones') {
                data.idciclo = 0;
                data.idsuscripcion = suscripciones;
            }
            ejecutarControl.eliminarLiquidacion(that.onAprobarCompleto, data);
        }, true);
    },
    /** 
     * Recibe la respuesta del servidor cuando se aprueba la liquidación 
     
     **/
    onAprobarCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case -3:
                var dialogoErrores = $('#divTablaErrores');
                var table = $('#tblErrores').empty();
                var tabla = table.dataTable({
                    "data": data.errores,
                    "columns": formatoErrores,
                    "language": {
                        url: "/achagua/sistema/web/bundles/Llanogas/js/facturacion/Spanish.json"
                    },
                    "destroy": true,
                });

                dialogoErrores.dialogo({
                    resizable: false,
                    modal: true,
                    width: 850,
                    //height: 800,
                    title: 'Errores',
                    buttons: {
                        Aceptar: function () {
                            window.location.reload();
                        }
                    }
                });
                break;
            case 0:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                break;
            case 1:
                var fxRecargar = function () {
                    window.location.reload();
                };
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion, fxRecargar, null, fxRecargar);
                break;
        }
    },
    /**
     * Se ejecuta cuando se han terminado de hacer la liquidación
     * @param  {Object} data Respuesta del servidor
     * @returns {void}      
     */
    onLiquidarCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case -3:
                window.location.reload();
                break;
            case 1:
                __dom.lanzarAlerta('Se ha procesado la factura, puede buscarla con el ide ' + data.factura.idfactura);
                break;
        }
    },
    
    variasSuscripciones: function(){
        var suscripciones = $('#txtSuscripciones').val();
        if(suscripciones == "" && $('#txtIdSuscripcion').val() == ""){
            __dom.lanzarAlerta(__app.mensajes.seleccionarSuscripcion, __app.mensajes.atencion);
            return;
        }
        if(suscripciones == "" && $('#txtIdSuscripcion').val() != ""){
            that.liquidarSuscripcion();
        }
        if(suscripciones != "" && $('#txtIdSuscripcion').val() == ""){
                var data = {
                    variasSuscripciones:suscripciones,
                    idciclo:0,
                    preliquidar: $('#cmbPreliquidar').val()
                };
                ejecutarControl.liquidarVariasSuscripcion(data, that.onLiquidarVariasSuscripcionesCompleto);
        }
        
    },
    onLiquidarVariasSuscripcionesCompleto: function(data){
        switch (data.codigoRespuesta) {
            case -3:
                window.location.reload();
                break;
            case 1:
                ejecutarControl.consultarEjecucion(that.consultarEjecucion);
                ejecutarModelo.interval = setInterval(function () {
                    ejecutarControl.consultarEjecucion(that.consultarEjecucion);
                }, 20000);
                break;
        }
    }
};
ejecutarVista.init();
