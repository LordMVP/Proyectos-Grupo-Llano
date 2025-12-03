/**
 * @fileOverview Archivo de vista y control de gestionar la cartera
 * @author appfuture
 * @requires gestionar_cartera.control.js
 * @requires gestionar_cartera.modelo.js
 * @version 1.0.0
 */
/**
 * Objeto que hace referencia al namespace gestionCarteraVista
 * @type {Object}
 */
var that = null;
/** @namespace */
var gestionCarteraVista = {
    /** Hace referencia al último dialogo abierto en la aplicación
     * @type {object}
     */
    dialogoActual: null,
    /**Inicializa el programa de gestión de cartera, y asigna listeners a los controles
     * @returns {void}
     */
    init: function () {
        that = this;
        $('#btnFiltrar').on('click', that.mostrarFiltroSuscriptor);
        $('#btnGrabar').on('click', that.grabarGestion);
        $('#btnCancelar').on('click', that.confirmarCancelar);
        $('#btnCargarFacturas').on('click', that.filtrarFacturas);
        $('#btnNuevoSeguimiento').on('click', that.mostrarSeguimiento);
        $('#cmbMedioComunicacion').on('change', that.mostrarInformacionAdicional);
        $('#btnPrimero, #btnUltimo').on('click', that.consultarPrimeroUltimo);
        $('#btnAnterior, #btnSiguiente').on('click', that.consultarAnteriorSiguiente);
        $('#btnAdjuntarArchivo').on('click', that.mostrarAdjuntar);
        $("#txtArchivo").fileinput({
            uploadUrl: "adjuntar_archivo",
            allowedFileExtensions: ['pdf'],
            uploadAsync: true,
            overwriteInitial: false,
            showUpload: true,
            showRemove: true,
            maxFileSize: 4096}).on('fileuploaded', that.subirCompleto);


        __dom.configurarCalendario('txtFechaEstimadaPago');
        //$('#txtFechaEstimadaPago').datepicker('option', 'minDate', new Date()).val(''); -- Se reemplaza la fecha del cliente por la del servidor
        $('#txtFechaEstimadaPago').datepicker('option', 'minDate', __app.obtenerFechaSistema()).val('');
        __dom.configurarTextoNumerico('txtLecturaActual, #txtFiltroSus, #txtFiltroCodAnt');

    },
    /** Captura la respuesta del servidor cuando se carga un archivoAdjunto 
     * @param {object} data - Respuesta del servidor con información de la carga
     * @returns {void}
     **/
    subirCompleto: function (e, data) {
        if (data.response.codigoRespuesta === 1) {
            var info = data.response.datos;

            var div = $('#divArchivos');
            for (var i = 0; i < info.length; i++) {
                gestionarCarteraModel.archivosActual.push(info[i]);
                var a = $('<a>').text(info[i].nombrearchivo)
                        .attr('href', info[i].ruta)
                        .attr('target', '_blank');
                div.append(a);
            }
            $('#progressbar').html('100%');
        }
    },
    /** Hace petición ajax para consultar primera o última cartera registrada
     * @returns {void}
     */
    consultarPrimeroUltimo: function () {
        var data = {opcion: $(this).attr('id') === 'btnPrimero' ? 1 : 0};
        if (gestionarCarteraModel.seguimientos.length === 0) {
            that.limpiarFormulario();
            gestionarCarteraControl.consultarPrimeroUltimo(data, that.filtrarSuscripcionCompleto);
        } else {
            __dom.lanzarAlerta('Se perderán todos los datos sin grabar, ¿Desea continuar?',
                    __app.mensajes.atencion,
                    function () {
                        that.limpiarFormulario();
                        gestionarCarteraControl.consultarPrimeroUltimo(data, that.filtrarSuscripcionCompleto);
                    }, true);
        }
    },
    /** Hace petición ajax para consultar anterior o siguiente cartera registrada
     * @returns {void}
     */
    consultarAnteriorSiguiente: function () {
        var opcion = $(this).attr('id') === 'btnAnterior' ? 0 : 1;
        if (gestionarCarteraModel.seguimientos.length === 0) {
            if (!!gestionarCarteraModel.suscripcion && !!gestionarCarteraModel.suscripcion.idgestion) {
                var idgestion = gestionarCarteraModel.suscripcion.idgestion;
                var data = {
                    idGestionActual: idgestion,
                    opcion: opcion
                };
                gestionarCarteraControl.consultarSiguienteAnterior(data, that.filtrarSuscripcionCompleto);
            } else {
                gestionarCarteraControl.consultarPrimeroUltimo({opcion: 1}, that.filtrarSuscripcionCompleto);
            }
            that.limpiarFormulario();
        } else {
            __dom.lanzarAlerta('Se perderán todos los datos sin grabar, ¿Desea continuar?',
                    __app.mensajes.atencion,
                    function () {
                        if (!!gestionarCarteraModel.suscripcion && !!gestionarCarteraModel.suscripcion.idgestion) {
                            var idgestion = gestionarCarteraModel.suscripcion.idgestion
                            var data = {
                                idGestionActual: idgestion,
                                opcion: opcion
                            };
                            gestionarCarteraControl.consultarSiguienteAnterior(data, that.filtrarSuscripcionCompleto);
                        } else {
                            gestionarCarteraControl.consultarPrimeroUltimo({opcion: 1}, that.filtrarSuscripcionCompleto);
                        }
                        that.limpiarFormulario();
                    }, true);
        }
    },
    /** Muestra un dialogo con el formulario para la búsqueda por suscriptor
     * @returns {void}
     */
    mostrarFiltroSuscriptor: function () {
        var filtro = $('div#divFiltro');
        that.dialogoActual = filtro.dialogo({
            modal: true,
            width: 600,
            title: 'Filtrar suscripciones',
            buttons: {
                Buscar: that.filtrarSuscriptor
            }
        });
    },
    /** Muestra u oculta división para adjuntar archivos
     * @returns {void}
     */
    mostrarAdjuntar: function () {
        if ($('#archivoAdjunto').is(':visible')) {
            $('#archivoAdjunto').hide();
        } else {
            $('#archivoAdjunto').show();
        }
    },
    /** Valida la información digitada y hace petición ajax para consultar carteras
     * @returns {void}
     */
    filtrarSuscriptor: function () {
        var filtro = that.dialogoActual;
        var suscripcion = filtro.find('#txtFiltroSus').val().trim();
        var doc = filtro.find('#txtFiltroDoc').val().trim();
        var codAnt = filtro.find('#txtFiltroCodAnt').val().trim();
        if (suscripcion === '' && doc === '' && codAnt === '') {
            filtro.find('#spanMensaje').text(__app.mensajes.camposInvalidosFiltro).show();
        } else {
            var data = {idsuscripcion: suscripcion, documento: doc, codigoanterior: codAnt};
            gestionarCarteraControl.consultarSuscriptor(data, that.filtrarSuscripcionCompleto);
        }
    },
    /** Captura la respuesta del servidor cuando se obtienen suscripciones en caso de haber
     * varias posibilita la selección de una.
     * @param {object} data - Respuesta del servidor con información de la suscripción y cartera buscada.
     * @returns {void}
     */
    filtrarSuscripcionCompleto: function (data) {
        if (that.dialogoActual) {
            var span = that.dialogoActual.find('#spanMensaje').text('');
        }
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(__app.mensajes.sinResultados, __app.mensajes.atencion);

                break;
            case 1:
                var sus = null;
                if (data.datos.length > 1) {
                    that.dialogoActual.find('div.listaSeleccion').remove();
                    var divSuscriptores = $('<div>').addClass('listaSeleccion');
                    $.each(data.datos, function (s, susc) {
                        var div = $('<div>');
                        var estado = susc.estadogestion;
                        estado = (estado === 'C') ? 'Cerrada' : ((estado === 'A') ? 'Abierta' : ' - ');
                        var radio = $('<input type="radio">');
                        radio.val(susc.idsuscriptor);
                        radio.attr('id', 'radio_susc_' + s);
                        radio.attr('data-indice', s);
                        radio.attr('name', 'radio_suscripciones');
                        var label = $('<label>').attr('for', 'radio_susc_' + s);
                        label.text(susc.documento + ' - ' + susc.nombresuscriptor + ' - Suscripción: ' + susc.idsuscripcion + ' (' + susc.codigoanterior + ') - ' + estado);
                        div.append(radio).append(label);
                        divSuscriptores.append(div);
                    });
                    var btn = $('<button>').text('Seleccionar').addClass('btnSimple');
                    btn.on('click', function () {
                        var suscSeleccionada = that.dialogoActual.find('input[name="radio_suscripciones"]:checked');
                        if (suscSeleccionada.length > 0) {
                            sus = gestionarCarteraModel.suscripcion = data.datos[parseInt(suscSeleccionada.attr('data-indice'))];
                            that.dialogoActual.find('#spanMensaje').hide();
                            that.dialogoActual.dialog('close');
                            divSuscriptores.remove();
                            that.cargarCabecera();
                        } else {
                            span.text(__app.mensajes.seleccionarOpcion).show();
                        }
                    });
                    divSuscriptores.insertAfter(that.dialogoActual.find('#spanMensaje'));
                    divSuscriptores.append(btn);
                } else {
                    sus = gestionarCarteraModel.suscripcion = data.datos[0];
                    try {
                        that.dialogoActual.find('#spanMensaje').hide();
                        that.dialogoActual.dialog('close');
                    } catch (ex) {
                    }
                    that.cargarCabecera();
                }
                break;
        }
    },
    /** Carga la cabecera del formulario con los datos de la cartera seleccionada.
     * @returns {void}
     */
    cargarCabecera: function () {
        var susc = gestionarCarteraModel.suscripcion;
        var disabled = susc.estadogestion === 'C';
        var cabecera = $('#fsInfoSuscripcion');
        var fecha = susc.fecha.split('.')[0];

        cabecera.find('#txtFecha').val(fecha).attr('title', fecha);
        cabecera.find('#txtNombreSuscriptor').val(susc.nombresuscriptor);
        cabecera.find('#txtCicloPeriodo').val(susc.ciclo + ' - ' + susc.periodo).attr('title', susc.ciclo + ' - ' + susc.periodo);
        cabecera.find('#txtCodAnterior').val(susc.codigoanterior);
        cabecera.find('#txtIdSuscripcion').val(susc.idsuscripcion);
        cabecera.find('#txtNumGestion').val(susc.idgestion);
        cabecera.find('#txtTipoSuscripcion').val(susc.tiposuscripcion);
        cabecera.find('#txtTipoUso').val(susc.tipouso);
        cabecera.find('#cmbEstado').val(susc.estadogestion);
        cabecera.find('#txtTelefonoFijo').val(susc.telefonofijo);
        cabecera.find('#txtTelefonoCelular').val(susc.telefonocelular);
        cabecera.find('#txtDireccion').val(susc.direccion);
        

        gestionarCarteraModel.seguimiento = [];
        $('#tblFacturas, #tblHistorial').empty();
        $('#cmbEstado').attr('disabled', disabled);
        $('#btnGrabar').attr('disabled', disabled);
        disabled ? $('#btnNuevoSeguimiento').hide() : $('#btnNuevoSeguimiento').show();

        gestionarCarteraControl.consultarHistorialSeguimientos(
                {idgestion: gestionarCarteraModel.suscripcion.idgestion},
                that.onCargarHistorialCompleto
                );

    },
    /** Hace petición ajax para consultar las facturas de la cartera seleccionada.
     * @returns {void}
     */
    filtrarFacturas: function () {
        if (!!gestionarCarteraModel.suscripcion) {
            var idSeguimiento = $('#txtNumGestion').val();
            var idSuscripcion = gestionarCarteraModel.suscripcion.idsuscripcion;
            gestionarCarteraControl.consultarFacturas({idsuscripcion: idSuscripcion, idseguimiento:idSeguimiento}, that.filtrarFacturasCompleto);
        } else {
            __dom.lanzarAlerta(__app.mensajes.seleccionarSuscripcion, __app.mensajes.atencion);
        }
    },
    /** Captura la respuesta del servidor cuando se consultan las facturas de la cartera seleccionada.
     * @param {object} data -  Respuesta del servidor con facturas de la cartera.
     * @returns {void}
     */
    filtrarFacturasCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(__app.mensajes.sinResultados, __app.mensajes.atencion);
                break;
            case 1:
                gestionarCarteraModel.facturas = data.datos;
                var disabled = gestionarCarteraModel.suscripcion.estadogestion === 'C'
                var tblFacturas = fillTable("tblFacturas", "formatoFacturas", "gestionarCarteraModel.facturas", "Facturas");
                if (disabled) {
                    tblFacturas.find('thead tr th#thSeguimiento').hide();
                    tblFacturas.find('tbody tr td[header="thSeguimiento"]').hide();
                }
                tblFacturas.find('tbody tr td[header="thSeguimiento"] input').on('click', that.mostrarSeguimiento)

                break;
        }
    },
    /** Valida el medio de comunicación del seguimiento a realizar para mostrar información adicional a completar
     * @returns {void}
     */
    mostrarInformacionAdicional: function () {
        var content = $('#divSeguimiento');
        content.find('.visible').hide('fast').removeClass('visible');
        var divMostrar = '';
        switch (parseInt($(this).val())) {
            case 217:   //Visita
                divMostrar = $('#divInfoVisita');
                break;
            case 215:   //Carta
                divMostrar = $('#divInfoCarta');
                break;
            case 216:   //Llamada
                divMostrar = $('#divInfoLlamada');
                break;
        }
        if (divMostrar !== "") {
            divMostrar.show().addClass('visible');
        }
    },
    /** Muestra cuadro de diálogo con el seguimiento de una factura o de la suscripción
     * @returns {void}
     */
    mostrarSeguimiento: function () {
        var btn = $(this);

        var seguimientoSuscriptor = btn.attr('id') === 'btnNuevoSeguimiento' ? true : false; //si es seguimiento a un suscriptor o a una factura
        if (gestionarCarteraModel.suscripcion === undefined) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarSuscripcion, __app.mensajes.atencion);
            return;
        }
        gestionarCarteraModel.seguimientoSuscriptor = seguimientoSuscriptor;
        //validar si el seguimiento está en memoria
        var id = seguimientoSuscriptor ? gestionarCarteraModel.suscripcion.idsuscriptor : btn.attr('data-id');
        gestionarCarteraModel.id = id;
        var existe = false;
        for (var i = 0; i < gestionarCarteraModel.seguimientos.length; i++) {
            var seguimiento = gestionarCarteraModel.seguimientos[i];
            if ((seguimiento.idfacturagestion && seguimiento.idfacturagestion === id)) {
                existe = true;
                that.mostrarArchivos(seguimiento.archivos);
                that.cargarDatosSeguimiento(seguimiento); //Piden no mostrar nuevamente la información    
                break;
            }
        }
        var mensaje = seguimientoSuscriptor
                ? gestionarCarteraModel.suscripcion.nombresuscriptor
                : ' la factura: ' + btn.attr('data-id');

        var dialogo = $('div#divSeguimiento');
        dialogo.find('input:text, select, textarea').attr('disabled', false);
        that.dialogoActual = dialogo.dialogo({
            modal: true,
            width: 800,
            position: {my: "center", at: "top+90", of: "body"},
            title: 'Realizar seguimiento a ' + mensaje,
            buttons: {
                Aceptar: function () {
                    that.validarInformacionAdicional(btn, existe);
                },
                Cancelar: function () {
                    that.limpiarDialogo();
                    that.dialogoActual.dialog('close');
                }
            },
            close: function (event, ui) {
                that.limpiarDialogo();
            }
        });
    },

    /**
     * Muestra un diálogo con el seguimiento de la cartera.
     * @returns {void}
     */
    verDetalleHistorial: function () {
        var _this = $(this);
        var botones = {};
        var idgestion = _this.attr('data-id');
        var indice = parseInt(_this.parent().parent().attr('data-fila'));
        var div = $('#divSeguimiento');
        div.find('input:text, select, textarea').attr('disabled', idgestion);
        if (idgestion) {
            var msj = " # " + idgestion;
            botones.Aceptar = function () {
                that.limpiarDialogo();
                that.dialogoActual.dialog('close');
            };
            gestionarCarteraControl.consultarDetalleHistorial(
                    {iddetallegestion: idgestion},
                    that.onConsultarHistorialCompleto
                    );
        } else {
            for (var i = 0; i < gestionarCarteraModel.seguimientos.length; i++) {
                var seguimiento = gestionarCarteraModel.seguimientos[i];
                if (seguimiento.indice === indice) {
                    var msj = " a " + gestionarCarteraModel.suscripcion.nombresuscriptor;
                    gestionarCarteraModel.id = seguimiento.suscriptor;
                    that.cargarDatosSeguimiento(seguimiento);
                    that.mostrarArchivos(seguimiento.archivos);
                    botones.Aceptar = function () {
                        that.validarInformacionAdicional($('#btnNuevoSeguimiento'), indice);
                    };
                    botones.Cancelar = function () {
                        that.limpiarDialogo();
                        that.dialogoActual.dialog('close');
                    }
                    break;
                }
            }
        }

        var dialogo = $('div#divSeguimiento');
        dialogo.find('input:text, select, texarea').attr('disabled', idgestion);
        that.dialogoActual = dialogo.dialogo({
            modal: true,
            width: 800,
            position: {my: "center", at: "top+90", of: "body"},
            title: 'Seguimiento  ' + msj,
            buttons: botones,
            close: function (event, ui) {
                that.limpiarDialogo();
            }
        });
    },

    /**
     * Valida la respuesta del servidor y muestra la información del seguimiento y los archivos.
     * @param  {Object} data La respuesta del servidor.
     * @returns {void}
     */
    onConsultarHistorialCompleto: function (data) {
        if (data.codigoRespuesta === 1) {
            var info = data.datos;
            $('#btnAdjuntarArchivo').hide();
            if (info.adjuntos.length > 0) {
                that.mostrarArchivos(info.adjuntos);
            }
            that.cargarDatosSeguimiento(info);
        } else {
            that.limpiarDialogo();
            __dom.lanzarAlerta('No se encontró la información del seguimiento. Intente nuevamente', __app.atencion);
        }
    },

    /**
     * Muestra la lista de archivos en una división, en forma de links para descargar
     * @param  {Array} archivos Lista de archivos que se van a mostrar
     * @returns {void}
     */
    mostrarArchivos: function (archivos) {
        var div = $('#divArchivos').empty();
        for (var i = 0; i < archivos.length; i++) {
            var adj = archivos[i];
            var a = $('<a>').text(adj.nombrearchivo)
                    .attr('href', adj.ruta)
                    .attr('target', '_blank');
            div.append(a);
        }
    },
    /** Carga los datos del seguimiento seleccionado o del seguimiento de la suscripción
     * @returns {void}
     */
    cargarDatosSeguimiento: function (obj) {
        var c = $('#divSeguimiento');
        c.find('#cmbEtapa').val(obj.idetapa);
        c.find('#cmbMedioComunicacion').val(obj.idmediocomunicacion).change();
        var op = parseInt(obj.idmediocomunicacion);
        if (op === 217 || op === 215 || op === 216) {
            $.each(obj.informacion, function (i, info) {
                c.find('*[data-id="' + info.idtipificacion + '"]').val(info.valor);
            });
        }
    },
    /** Valida que la información adicional de los medios de comunicación estén completos
     * en caso de ser así el seguimiento es guardado.
     * @returns {void}
     */
    validarInformacionAdicional: function (btn, edicion) {
        var seguimientoSuscriptor = btn.attr('id') === 'btnNuevoSeguimiento' ? true : false; //si es seguimiento a un suscriptor o a una factura
        var content = $('#divSeguimiento');
        var c = null;
        var opcion = parseInt(content.find('#cmbMedioComunicacion').val());
        var valido = false;
        var obj = {};
        var selectorContenedor = "";
        var mensaje = '';


        if ($('#cmbEtapa').val() === '0') {
            $('#cmbEtapa').addClass('campoInvalido').focus();
            return
        }

        switch (opcion) {
            case 0:
                mensaje = 'Debe seleccionar un medio de comunicación';
                break;
            case 217:  //visita
                c = content.find('#divInfoVisita');
                if (that.validarCamposInformacion(c)) {
                    valido = true;
                    obj.idmediocomunicacion = 217;
                    obj.medioComunicacion = 'Visita';
                    selectorContenedor = "#divInfoVisita";
                }
                break;
            case 215:  //carta
                c = content.find('#divInfoCarta');
                if (that.validarCamposInformacion(c)) {
                    valido = true;
                    obj.idmediocomunicacion = 215;
                    obj.medioComunicacion = 'Carta';
                    selectorContenedor = "#divInfoCarta";
                }
                break;
            case 216:  //llamada
                c = content.find('#divInfoLlamada');
                if (that.validarCamposInformacion(c)) {
                    valido = true;
                    obj.idmediocomunicacion = 216;
                    obj.medioComunicacion = 'Llamada';
                    selectorContenedor = "#divInfoLlamada";
                }
                break;
        }
        //var fechaActual = new Date();  -- Se reemplaza fecha del cliente por fecha del servidor
        var fechaActual = __app.obtenerFechaSistema();
        var dia = (fechaActual.getDate() > 9) ? fechaActual.getDate() : "0" + fechaActual.getDate();
        var mes = (fechaActual.getMonth() > 9) ? fechaActual.getMonth() + 1 : "0" + (fechaActual.getMonth() + 1);

        obj.ciclo = gestionarCarteraModel.suscripcion.ciclo;
        obj.periodo = gestionarCarteraModel.suscripcion.periodo;
        obj.mediocomunicacion = obj.medioComunicacion;
        obj.fechagestion = fechaActual.getFullYear() + "-" + mes + "-" + dia;
        obj.idetapa = parseInt($('#cmbEtapa').val());
        obj.idfacturagestion = gestionarCarteraModel.seguimientoSuscriptor ? -1 : gestionarCarteraModel.id;
        obj.archivos = gestionarCarteraModel.archivosActual;

        if (!valido) {
            content.find('.pMensaje')
                    .text(mensaje === ''
                            ? 'Debe llenar todos los campos de ' + content.find('#cmbMedioComunicacion option:selected').text()
                            : mensaje
                            );
        } else {
            var info = [];
            $(selectorContenedor + ' *[data-id]').each(function (c, campo) {
                campo = $(campo);
                info.push({
                    nombre: campo.attr('data-nombre'),
                    valor: campo.val(),
                    idtipificacion: campo.attr('data-id')
                });
            });
            obj.informacion = info;
            if (seguimientoSuscriptor) {
                obj.suscriptor = gestionarCarteraModel.suscripcion.idsuscriptor;
                obj.tipoSeguimiento = 'suscriptor';
                obj.indice = !isNaN(parseInt(edicion)) ? parseInt(edicion) : gestionarCarteraModel.historial.length;

            } else {
                obj.tipoSeguimiento = 'factura';
            }
            if (!edicion && edicion !== 0) {
                gestionarCarteraModel.seguimientos.push(obj);
                if (seguimientoSuscriptor) {


                    gestionarCarteraModel.historial.push(obj);
                    that.llenarTablaHistorial();
                }
            } else {
                for (var i = 0; i < gestionarCarteraModel.seguimientos.length; i++) {
                    var seguimiento = gestionarCarteraModel.seguimientos[i];
                    if ((seguimiento.indice === obj.indice) || (seguimiento.factura && seguimiento.factura === obj.factura)) {
                        if (seguimiento.indice === obj.indice) {
                            var indice = seguimiento.indice;
                            gestionarCarteraModel.historial[indice] = obj;
                            that.llenarTablaHistorial();
                        }
                        gestionarCarteraModel.seguimientos[i] = obj;
                        break;
                    }
                }
            }
            that.limpiarDialogo();
        }
    },
    /** Limpia la información del cuadro de diálogo donde se registran los seguimientos
     * @returns {void}
     */
    limpiarDialogo: function () {
        var dialogo = $('#divSeguimiento');
        $('#btnAdjuntarArchivo').show();
        that.dialogoActual.dialog('close');
        dialogo.find('#divArchivos').empty();
        dialogo.find('input[type="text"], textarea').val('').removeClass('campoValido campoInvalido');
        dialogo.find('select').val(0).change().removeClass('campoValido').removeClass('campoInvalido');
        dialogo.find('#archivoAdjunto').hide();
        dialogo.find('#txtArchivo').fileinput('clear');
        dialogo.find('.pMensaje').text('');

    },
    /** Valida que los campos de los seguimientos estén llenos
     * @returns {void}
     */
    validarCamposInformacion: function (div) {
        var campos = div.find('input[type="text"], textarea, select');
        var c = 0;
        $.each(campos, function (i, item) {
            item = $(item);
            if (item.val() === '' || item.val() === '0') {
                item.addClass('campoInvalido').removeClass('campoValido');
                c++;
            } else {
                item.addClass('campoValido').removeClass('campoInvalido');
            }
        });
        return c > 0 ? false : true;
    },
    /** Valida y graba la gestión actual de la suscripción
     * @returns {void}
     */
    grabarGestion: function () {
        var errores = 0;
        if (gestionarCarteraModel.suscripcion === undefined) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarSuscripcion, __app.mensajes.atencion);
            errores++;
            return;
        }
        if (gestionarCarteraModel.seguimientos.length === 0) {
            __dom.lanzarAlerta('No ha realizado ningún seguimiento a esta suscripción. \nNo se almacenará información', __app.mensajes.atencion);
            errores++;
            return;
        }
        if (errores === 0) {
            var parametros = {};
            parametros.estado = $('#cmbEstado').val();
            parametros.idgestion = gestionarCarteraModel.suscripcion.idgestion;
            parametros.idsuscripcion = gestionarCarteraModel.suscripcion.idsuscripcion;
            parametros.seguimientos = [];

            $.each(gestionarCarteraModel.seguimientos, function (s, seg) {
                var seguimiento = {};

                seguimiento.idetapa = seg.idetapa;
                seguimiento.archivos = seg.archivos;
                seguimiento.informacion = seg.informacion;
                seguimiento.idfacturagestion = seg.idfacturagestion;
                seguimiento.idmediocomunicacion = seg.idmediocomunicacion;
                parametros.seguimientos.push(seguimiento);

            });
            gestionarCarteraControl.grabarGestion(parametros, that.onGrabarGestionCompleto);
        }
    },
    //se ejecuta cuando se termina de grabar la gestión de la cartera
    onGrabarGestionCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 1:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                that.limpiarFormulario();
                break;
        }

    },
    /** Captura la respuesta del servidor cuando se consultan el historal de la suscripción
     * @param {object} data - Respuesta del servidor con historial de la cartera seleccionada
     * @returns {void}
     */
    onCargarHistorialCompleto: function (data) {
        var fs = $('#fieldsetHistorial');
        switch (data.codigoRespuesta) {
            case 1:
                gestionarCarteraModel.historial = data.datos;
                that.llenarTablaHistorial();
                fs.show();
                break;
            case 0:
                fs.hide();
                __dom.lanzarAlerta('La cartera no tiene historial de seguimientos.', __app.mensajes.atencion);
                break;
            default:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                break;
        }
    },
    /** Carga información del historial de detalles de gestiòn.
     * @returns {void}
     */
    llenarTablaHistorial: function () {
        var fieldset = $('fieldset#fieldsetHistorial').show();
        fieldset.find('table#tblHistorial').empty();
        var tabla = fillTable('tblHistorial', 'formatoHistorial', 'gestionarCarteraModel.historial', '');
        tabla.find('tbody tr td[header="thDetalle"] input').on('click', that.verDetalleHistorial);
    },

    /**
     * Muestra un diálogo para confirmar la cancelación de la acción.
     * @returns {void}
     */
    confirmarCancelar: function () {
        __dom.lanzarAlerta(__app.mensajes.confirmacionCancelacion,
                __app.mensajes.atencion, that.limpiarFormulario, true);
    },

    /**
     * Limpia el formulario y el modelo
     * @returns {void}
     */
    limpiarFormulario: function () {
        $('#fsInfoSuscripcion  input:text').val('');
        $('#tblFacturas, #tblHistorial').empty();
        $('#fieldsetHistorial').hide();
        $('#divSeguimiento input:text').val('');
        $('#divSeguimiento select').val('0');
        gestionarCarteraModel = {
            archivosActual: [],
            seguimientos: [],
            historial: []
        };
    }

};

gestionCarteraVista.init();
