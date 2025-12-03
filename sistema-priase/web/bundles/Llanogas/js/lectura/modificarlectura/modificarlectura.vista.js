/**
 * @fileOverview Archivo de vista y control para gestionar lectura
 * @author jeissonBarriga
 * @requires gestionarlectura.control.js
 * @requires gestionarlectura.modelo.js
 * @version 1.0.0
 */

/**
 * Objeto que hace referencia al namespace modificarLecturaVista
 * @type {object}
 */
var that = null;

/** @namespace */
var modificarLecturaVista = {
    /**
     * Hace referencia al último diálogo abierto en la aplicación
     * @type {object}
     */
    dialogoActual: null,
    /**
     * Template para mostrar las lecturas anterior y actual de una suscripción en el diálogo de filtro
     */
    tplSuscriptores: '<div class="div-lectura-suscripcion">' +
            '<p style="margin-bottom:5px;"><b>{{suscripcion.nombre}}</b> - Suscripción: {{suscripcion.idsuscripcion}} - Documento: {{suscripcion.documento}} </p>' +
            '<div>' +
            '<p style="margin-bottom:7px; margin-left:7px;"><b>Lecturas:</b></p>' +
            '        {{#lecturas.lecturaanterior}}' +
            '        <a data-idsuscripcion="{{suscripcion.idsuscripcion}}" data-idlectura="{{lecturas.lecturaanterior.idlecturaencabezado}}" class="btn-consulta-lectura"><i class="fa fa-search" style="margin-right:5px;"></i> ' +
            '        <span>Lectura Anterior: {{lecturas.lecturaanterior.fecha}}</span>' +
            '        </a>' +
            '        {{/lecturas.lecturaanterior}}' +
            '        {{#lecturas.lecturaactual}}' +
            '        <a data-idsuscripcion="{{suscripcion.idsuscripcion}}" data-idlectura="{{lecturas.lecturaactual.idlecturaencabezado}}" class="btn-consulta-lectura"><i class="fa fa-search" style="margin-right:5px;"></i> ' +
            '        <span>Lectura Actual: {{lecturas.lecturaactual.fecha}}</span>' +
            '        </a>' +
            '       {{/lecturas.lecturaactual}}' +
            '        {{#lecturas.lecturamedidor}}' +
            '        <a data-idsuscripcion="{{suscripcion.idsuscripcion}}" data-idlectura="{{lecturas.lecturamedidor.idlecturaencabezado}}" class="btn-consulta-lectura"><i class="fa fa-search" style="margin-right:5px;"></i> ' +
            '        <span>Cambio de Medidor: {{lecturas.lecturamedidor.fecha}}</span>' +
            '        </a>' +
            '       {{/lecturas.lecturamedidor}}' +
            '   </div><hr>' +
            '</div>',
    /**
     * Función que se invoca al inciar el objeto gestionarliquidacionVista. Asigna comportamientos para los eventos de los controles.
     * @returns {void}
     */
    init: function () {
        that = this;
        __app.vistaActual = modificarLecturaVista;
        __app.modeloActual = modificarLecturaModelo;
        var comandos = $('div#divComandos');
        comandos.find('#btnFiltrar').on('click', that.mostrarFiltro);
        comandos.find('#btnGrabar').on('click', that.validaTipoUsoFactura);
        comandos.find('#btnCancelar').on('click', that.cancelarOperacion);
        $('#btnCargarDetalleMedidor').on('click', that.filtrarMedidor);
        $('#btnHistorialMedidor').on('click', function () {
            $('#divEncabezadoHistorico').show();
        });
        $('#btnDetalleLectura').on('click', that.llenarTablaDetallesLectura);
        $('#btnAgregarLectura').on('click', that.mostrarAgregarLectura);
        $('#btnFiltrarSuscriptor').on('click', that.filtrarSuscriptor);
        $('#btnBuscarHistorial').on('click', that.consultarHistorial);
        $('#txtLecturaActual').on('blur', that.calcularConsumo);
        $('#txtFechaProgramacion').on('blur', that.validarFechaProgramacion);
        //Configuración de campos numéricos
        __dom.configurarTextoNumerico('txtFactorCorreccion', false, true);
        __dom.configurarTextoNumerico('txtFiltroSus, #txtFiltroDoc, #txtFiltroCodAnt,#txtLecturaActual');
        __dom.configurarTextoNumerico('txtLecturaAnteriorUltima, #txtLecturaActualUltima, #txtConsumoUltima,#txtConsumoPromedio');
        //Configuracion de calendarios
        __dom.configurarCalendario('txtFechaInicial, #txtFechaFinal');
        __dom.configurarCalendarioTiempo('txtFechaProgramacion');
        $('#txtFechaEjecucion').datetimepicker({
            minDate: 0,
            lang: 'es'
        });
        //Cargar combos

        $('#divAgregarLectura input[name="rbtnEjecutada"]').on('click', that.onRadioEjecutadaClick);
        that.consultarAnomalias();
        that.consultarNovedades();
        that.cargarAutocomplete();
        var cabecera = $('#divLecturaActual');
        cabecera.find('#txtLecturaAnteriorUltima').on('blur', that.calcularPromedioEncabezado);
        cabecera.find('#txtLecturaActualUltima').on('blur', that.calcularPromedioEncabezado);
    },
    /**
     * Verifica que la fecha de programación sea mayor a la del sistema para permitir digitar la lextura actual
     */
    validarFechaProgramacion: function () {
        var fecha = $('#txtFechaProgramacion').val();
        //var lectura = $('#txtLecturaActual').attr('disabled', false);
        if ($('#txtFechaProgramacion').val() !== '' && modificarLecturaModelo.accionCalcular === 'A') {
            $('#txtLecturaActual').attr('disabled', new Date(fecha) > __app.obtenerFechaSistema()); //new Date()); -- se reemplaza fecha del cliente por fecha del servidor
        }
    },
    /**
     * Muestra el filtro para consultar un suscriptor
     * @returns {void}
     */
    mostrarFiltro: function () {
        var filtro = $('div#camposBuscarSuscripcion');
        that.dialogoActual = filtro.dialogo({
            modal: true,
            width: 850,
            title: 'Buscar un suscriptor'
        });
    },
    /**
     * Pregunta al usuario si desea cancelar la operación actual si el usuario
     * desea cancelar, se limpia el formulario y se actualiza el modelo
     * @returns {void}
     */
    cancelarOperacion: function () {
        if (modificarLecturaModelo.suscripcion) {
            $('div#divConfirmarCancelar').dialogo({
                resizable: false,
                heigth: 140,
                modal: true,
                title: 'Cancelar la Operación',
                buttons: {
                    "Sí": function () {
                        $(this).dialog('close');
                        that.reiniciarProceso();
                    }, No: function () {
                        $(this).dialog("close");
                    }
                }
            });
        }
    },
    /**
     * Pregunta al usuario si desea eliminar el registro seleccionado, si el
     * usuario desea eliminarlo, se ejecuta el método de "eliminarRegistro"
     * @returns {void}
     */
    confirmarEliminar: function () {
        modificarLecturaModelo.indiceRegistro = parseInt($(this).parent().parent().attr('data-fila'));
        $('div#divConfirmarEliminar').dialogo({
            resizable: false,
            heigth: 140,
            modal: true,
            title: 'Eliminar registro',
            buttons: {
                "Sí": function () {
                    $(this).dialog('close');
                    that.eliminarRegistro();
                }, Cancelar: function () {
                    $(this).dialog("close");
                }
            }
        });
    },
    /**
     * valida la información del filtro de suscripciones y envía la solicitud
     * al servidor
     * @returns {void}
     */
    filtrarSuscriptor: function () {
        var filtro = $('div#camposBuscarSuscripcion');
        var idsuscripcion = filtro.find('#txtFiltroSus').val().trim();
        var documento = filtro.find('#txtFiltroDoc').val().trim();
        var codigoanterior = filtro.find('#txtFiltroCodAnt').val().trim();
        if (idsuscripcion === '' && documento === '' && codigoanterior === '') {
            filtro.find('#spanMensaje').text(__app.mensajes.camposInvalidosFiltro).show();
        } else {
            var data = {idsuscripcion: idsuscripcion, documento: documento, codigoanterior: codigoanterior};
            modificarLecturaControl.consultarSuscriptor(data, that.consultaSuscripcionCompleto);
        }
    },
    /**
     * Captura la respuesta enviada por el servidor tras la solicitud del
     * suscriptor si hay más de un suscriptor en la respuesta se muestra la
     * lista de suscriptores para que el usuario seleccione uno, de lo
     * contrario, se toma el único que llega en la respuesta.
     * @param  {Object} data Respuesta del servidor al consultar las suscripciones.
     * @returns {void}
     */
    consultaSuscripcionCompleto: function (data) {
        that.limpiarFormulario();
        switch (parseInt(data.codigoRespuesta)) {
            case 0:
                that.dialogoActual.find('#spanMensaje').text(__app.mensajes.sinResultados).show();
                break;
            case 1:
                var sus = null;
                //no hay lecturas, el servidor retorna un arreglo vacío
                if (data.datos.lecturas.lecturaactual && data.datos.lecturas.lecturaactual.length === 0) {
                    __dom.lanzarAlerta('No hay lecturas registradas.', __app.mensajes.atencion);
                    return;
                }

                that.reiniciarProceso();

                modificarLecturaModelo.suscripcion = data.datos;
                //si llegan múltiples registros, se muestra la lista de suscripciones, cada una con las lecturas
                if (__app.esArreglo(data.datos) && data.datos.length > 1) {
                    that.dialogoActual.find('#spanMensaje').text('Se han encontrado múltiples datos con este filtro de búsqueda');
                    var divSuscriptores = that.dialogoActual.find('div.listaSuscripciones').empty();
                    $.each(data.datos, function (s, susc) {
                        var div = $(Mustache.render(that.tplSuscriptores, susc));
                        div.find('.btn-consulta-lectura').on('click', that.consultarLectura);
                        divSuscriptores.append(div);
                    });
                    divSuscriptores.insertAfter(that.dialogoActual.find('#spanMensaje'));
                } else {
                    that.dialogoActual.find('#spanMensaje').text('Se han encontrado las siguientes lecturas:');
                    var divSuscriptores = that.dialogoActual.find('div.listaSuscripciones').empty();
                    var div = $(Mustache.render(that.tplSuscriptores, data.datos));
                    div.find('.btn-consulta-lectura').on('click', that.consultarLectura);
                    divSuscriptores.append(div);
                    divSuscriptores.insertAfter(that.dialogoActual.find('#spanMensaje'));
                }
                break;
        }
    },
    /**
     * Hace petición para obtener la información completa de la lectura de una suscripción
     * @param {Event} e - Evento que dispara la función (click sobre un link de búsqueda)
     */
    consultarLectura: function (e) {
        __app.cancelarEvento(e);
        var link = $(this);
        var idsuscripcion = link.attr('data-idsuscripcion');
        var idlectura = link.attr('data-idlectura');
        modificarLecturaControl.consultarInformacionLectura({idsuscripcion: idsuscripcion, idlectura: idlectura}, that.onConsultarLecturaCompleto);
    },
    /**
     * Obtiene la respuesta del servidor cuando se ha consultado la información detallada de la lectura
     * @param {Object} data - Respuesta del servidor
     */
    onConsultarLecturaCompleto: function (data) {
        $('.spanMensaje').text('');
        $('.listaSuscripciones').empty();
        if (data.codigoRespuesta !== 1) {
            __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
            return;
        }
        that.dialogoActual.dialog('close');
        modificarLecturaModelo.suscripcion = data.datos.suscripcion[0];
        that.cargarCabecera(data.datos.suscripcion[0]);
        that.consultarLecturaActualCompleto(data);
    },
    /**
     * Función de callback para establecer la información de la lectura actual
     * a partir de la respuesta obtenida del servidor.
     * @param  {Object} data Respuesta del servidor al consultar la lectura actual.
     * @returns {void}
     */
    consultarLecturaActualCompleto: function (data) {
        var encabezado = data.datos.encabezadolectura;
        var detallesLectura = data.datos.encabezadolectura.detalleslectura;


        if (!encabezado) {
            __dom.lanzarAlerta("No se encontró el encabezado de la lectura", __app.mensajes.atencion);
            return;
        }

        modificarLecturaModelo.encabezado = encabezado;
        modificarLecturaModelo.lecturaActual = encabezado.lecturaactual;

        that.cargarLecturaActual(encabezado);
        modificarLecturaModelo.detallesLectura = [];
        modificarLecturaModelo.clonDetallesLectura = [];

        if (!detallesLectura || detallesLectura.length === 0) {
            __dom.lanzarAlerta("No se encontraron detalles de la lectura", __app.mensajes.atencion);
            return;
        }

        modificarLecturaModelo.detallesLectura = detallesLectura;
        for (var i = 0; i < detallesLectura.length; i++) {
            var lectura = detallesLectura[i];
            lectura.empresa = lectura.empresalectura;
            lectura.empresalectura = lectura.idempresalectura;
        }


    },
    /**
     * Limpia el formulario y elimina la información actual del recaudo y el
     * suscriptor de la interfaz
     * @returns {void}
     */
    limpiarFormulario: function () {
        var cabecera = $('div#divCabecera');
        cabecera.find('input[type="text"]').val('');
        modificarLecturaModelo = {};
    },
    /**
     * Limpia la división que contiene los campos necesarios para agregar una
     * nueva lectura.
     * @returns {void}
     */
    limpiarDivAgregarLectura: function () {
        var divAgregarLectura = $('div#divAgregarLectura');
        divAgregarLectura.find('input[type="text"]').val('');
        divAgregarLectura.find('textarea').val('');
        divAgregarLectura.find('select').val(-1);
        divAgregarLectura.find('#cboEstado').val('A');
    },
    /**
     * Carga la cabecera con la información del suscriotor seleccionado del filtro
     * @returns {void}
     */
    cargarCabecera: function (sus) {
        var cabecera = $('div#divCabecera');
        cabecera.find('#txtIdSuscripcion').val(sus.idsuscripcion);
        cabecera.find('#txtNombre').val(sus.nombre);
        cabecera.find('#txtDocumento').val(sus.documento);
        cabecera.find('#txtIdMedidor').val(sus.idmedidor);
        cabecera.find('#txtDescripcionMedidor').val(sus.descripcionmedidor);
        cabecera.find('#txtCodigoAnterior').val(sus.codigoanterior);
        cabecera.find('#txtTipoUso').val(sus.tipouso);
        cabecera.find('#txtCicloPeriodo').val(sus.cicloperiodo);
    },
    /**
     * Carga la información de la lectura actual en la división correspondiente.
     * @returns {void}
     */
    cargarLecturaActual: function (lecturaActual) {
        var cabecera = $('#divLecturaActual');
        cabecera.find('#txtFecha').val(lecturaActual.fecha);
        cabecera.find('#txtLecturaAnteriorUltima').val(lecturaActual.lecturaanterior);
        cabecera.find('#txtLecturaActualUltima').val(lecturaActual.lecturaactual);
        cabecera.find('#txtConsumoUltima').val(lecturaActual.consumo);
        cabecera.find('#txtConsumoPromedio').val(lecturaActual.consumopromedio);
        cabecera.find('#txtFactorCorreccion').val(lecturaActual.factorcorreccion);
        cabecera.find('#txtObservacionesActual').val(lecturaActual.observaciones);
        cabecera.show();
    },
    /**
     * Lee y guarda en el modelo la información de la lectura que se desea
     * agreagar.
     * @returns {void}
     */
    leerCamposDivAgregarLectura: function () {
        var dialogo = $('#divAgregarLectura');
        var ultimo = parseInt(modificarLecturaModelo.detallesLectura.length) - 1;
        var agregarLectura = {};
        if (ultimo < 0) {
            agregarLectura.lecturaanterior = modificarLecturaModelo.encabezado.lecturaactual;
        } else {
            agregarLectura.lecturaanterior = parseInt(modificarLecturaModelo.detallesLectura[ultimo].lecturaactual);
        }
        agregarLectura.idsuscripcion = modificarLecturaModelo.suscripcion.idsuscripcion;
        agregarLectura.idmedidor = dialogo.find('#txtIdMedidorAgregarLectura').val();
        agregarLectura.estado = dialogo.find('#cboEstado').val();
        //agregarLectura.fecha = new Date().dateFormat('Y/m/d');  -- se reemplaza fecha del cliente por fecha del servidor
        agregarLectura.fecha = __app.obtenerFechaSistema().dateFormat('Y/m/d');
        
        agregarLectura.fechaprograma = dialogo.find('#txtFechaProgramacion').val();
        agregarLectura.lecturareal = dialogo.find('#txtLecturaActual').val();
        agregarLectura.consumo = dialogo.find('#txtConsumo').val() === '' ?
                0 : dialogo.find('#txtConsumo').val();
        agregarLectura.fechaejecuta = dialogo.find('#txtFechaEjecucion').val();
        agregarLectura.observacion = dialogo.find('#txtObservaciones').val();
        agregarLectura.terceroid = dialogo.find('#idEmpresaLectura').val();
        agregarLectura.lecturaactual = dialogo.find('#txtLecturaActual').val() === '' ?
                0 : dialogo.find('#txtLecturaActual').val();
        agregarLectura.novedad = $('#cboNovedades').val() === '-1' ? '' : $('#cboNovedades option:selected').text();
        agregarLectura.idanomalia = $('#cboAnomalias').val();// === '-1' ? '' : $('#cboAnomalias').val();
        agregarLectura.idnovedad = $('#cboNovedades').val();// === '-1' ? '' : $('#cboNovedades').val();
        agregarLectura.ejecutado = dialogo.find('input[name="rbtnEjecutada"]:checked').val();
        agregarLectura.empresalectura = $('#idEmpresaLectura').val();
        agregarLectura.empresa = $('#txtEmpresaLectura').val();
        agregarLectura.iddetallelectura = '';
        agregarLectura.idlecturaencabezado = modificarLecturaModelo.encabezado.idlecturaencabezado;
        modificarLecturaModelo.registroLeido = agregarLectura;
    },
    /**
     * Lee y guarda en el modelo la información de la lectura que se desea
     * agreagar.
     * @returns {void}
     */
    llenarTablaDetallesLectura: function () {
        $('table#tblDetalleLectura').empty();
        $('#spanMensajeLecturas').text('');
        if (modificarLecturaModelo.detallesLectura.length > 0) {
            var tabla = fillTable('tblDetalleLectura', 'formatoDetalle', 'modificarLecturaModelo.detallesLectura', '');
            tabla.find('td[header="thVer"] input[type="button"]').on('click', that.mostrarVerLectura);
            tabla.find('td[header="thEditar"] input[type="button"]').on('click', that.mostrarEditarLectura);
            tabla.find('td[header="thEliminar"] input[type="button"]').on('click', that.confirmarEliminar);

            for (var i = 0; i < modificarLecturaModelo.detallesLectura.length; i++) {
                var detalle = modificarLecturaModelo.detallesLectura[i];
                if (detalle.ejecutado === 'S' || detalle.estado === 'M') {
                    tabla.find('tbody tr[data-fila="' + i + '"] td[header="thEditar"] input:button').attr('disabled', 'disabled');
                    tabla.find('tbody tr[data-fila="' + i + '"] td[header="thEliminar"] input:button').attr('disabled', 'disabled');
                }
            }
        } else {
            $('#spanMensajeLecturas').text('La suscripción no tiene detalles de lectura.');
        }
        $('#divDetalleLectura').show();
    },
    /**
     * Limpia la tabla correspondiente al historial del medidor para luego
     * llenarla con la información actualizada del historial alojada en el modelo.
     * agreagar.
     * @returns {void}
     */
    llenarTablaHistorialMedidor: function () {
        $('table#tblHistorialMedidor').empty();
        var tabla = fillTable('tblHistorialMedidor', 'formatoHistorial', 'modificarLecturaModelo.historialMedidor', '');
        tabla.find('td[header="thVer"] input[type="button"]').on('click', that.mostrarVerEncabezadoHistorico);
    },
    /**
     * Realiza los bloqueos necesarios en los campos de la división de agregar
     * lectura.
     * agreagar.
     * @returns {void}
     */
    bloquearCamposAgregarLectura: function () {
        $('select#cboEstado').prop('disabled', true);
        $('select#cboAnomalias').prop('disabled', true);
        $('select#cboNovedades').prop('disabled', true);
        $('input:text#txtFechaEjecucion').prop('disabled', true);
        $('input:text#txtFechaProgramacion').prop('disabled', true);
        $('input:text#txtLecturaActual').prop('disabled', true);
        $('input:text#txtFactorCorreccionEmergente').prop('disabled', true);
        $('input:text#txtConsumo').prop('disabled', true);
        $('input:text#txtIdMedidorAgregarLectura').prop('disabled', true);
        $('input:text#txtEmpresaLectura').prop('disabled', true);
        $('input:text#txtIdLectura').prop('disabled', true);
        $('input:text#txtTerceroLectura').prop('disabled', true);
        $('input[type = radio][name = rbtnEjecutada]').prop('disabled', true).attr('checked', false);
        $('textarea#txtObservaciones').prop('disabled', true);
    },
    /**
     * Habilita los campos necesarios en la división de agregar lectura.
     * agreagar.
     * @returns {void}
     */
    desbloquearCamposAgregarLectura: function () {
        var div = $('#divAgregarLectura');
        var no = $('#txtFechaProgramacion, #txtLecturaActual, #txtEmpresaLectura');
        div.find('select, input:text, input:radio, textarea').not(no).prop('disabled', true);
        div.find('#cboEstado').val('A');
        div.find('input[type = radio][name = rbtnEjecutada]').attr('checked', false);
        $('textarea#txtObservaciones').prop('disabled', false);
    },
    /**
     * Muestra el detalle del medidor actual.
     * @returns {void}
     */
    mostrarDetalleMedidor: function () {
        var dialogo = $('div#divDetalleMedidor');
        that.dialogoActual = dialogo.dialogo({
            modal: true,
            width: 850,
            title: 'Detalles de Medidor',
            buttons: {
                Aceptar: function () {
                    $(this).dialog('close');
                }
            }
        });
    },
    /**
     * Muestra el formulario para agregar una lectura.
     * @returns {void}
     */
    mostrarAgregarLectura: function () {
        modificarLecturaModelo.accionCalcular = 'I';
        that.desbloquearCamposAgregarLectura();
        that.limpiarDivAgregarLectura();
        var dialogo = $('div#divAgregarLectura');
        dialogo.find('input#txtIdMedidorAgregarLectura').val(modificarLecturaModelo.suscripcion.idmedidor);
        dialogo.find('input#txtFactorCorreccionEmergente').val(modificarLecturaModelo.encabezado.factorcorreccion);

        dialogo.find('#txtFechaProgramacion, #txtEmpresaLectura').removeAttr('disabled');
        dialogo.find('#txtLecturaActual').attr('disabled', true);
        that.dialogoActual = dialogo.dialogo({
            modal: true,
            width: 850,
            title: 'Agregar Lectura',
            buttons: {
                Guardar: function () {
                    that.guardarLectura();
                },
                Cancelar: function () {
                    $(this).dialog('close');
                    that.limpiarDivAgregarLectura();
                }
            }
        });
    },
    /**
     * Realiza el cálculo del consumo en función de los valores de la lectura
     * actual, la lectura anterior y la acción a realizar (I = insertar,
     * A = actualizar).
     * @returns {void}
     */
    calcularConsumo: function () {
        var accionCalcular = modificarLecturaModelo.accionCalcular;
        var dialogo = $('#divAgregarLectura');
        var ultimo = modificarLecturaModelo.detallesLectura.length - 1;
        var lecturaActual = dialogo.find('#txtLecturaActual').val();
        var lecturaAnterior;
        if (lecturaActual === '') {
            lecturaActual = 0;
        }
        lecturaActual = parseInt(lecturaActual);
        switch (accionCalcular) {
            case 'I':
                if (modificarLecturaModelo.detallesLectura.length === 0) {
                    lecturaAnterior = modificarLecturaModelo.encabezado.lecturaactual;
                } else {
                    lecturaAnterior = parseInt(modificarLecturaModelo.detallesLectura[ultimo].lecturaactual);
                }
                break;
            case 'A':
                lecturaAnterior = parseInt(modificarLecturaModelo.detallesLectura[modificarLecturaModelo.indiceRegistro].lecturaanterior);
                break;
        }
        var digito = modificarLecturaModelo.encabezado.digitos;
        var consumo = ((Math.pow(10, digito) - 1) - lecturaAnterior) + lecturaActual;
        modificarLecturaModelo.consumo = (lecturaActual >= lecturaAnterior) ? lecturaActual - lecturaAnterior : consumo;
        dialogo.find('#txtConsumo').val(modificarLecturaModelo.consumo);
    },
    /**
     * Recalcula el consumo en función de las variaciones sufridas por la tabla.
     * @returns {void}
     */
    actualizarConsumo: function () {
        var detalles = modificarLecturaModelo.detallesLectura;
        var indiceRegistro = modificarLecturaModelo.indiceRegistro;
        var lecturaActual = detalles[indiceRegistro].lecturaactual;
        var lecturaAnterior = detalles[indiceRegistro].lecturaanterior;
        if (lecturaActual >= lecturaAnterior) {
            modificarLecturaModelo.consumo = lecturaActual - lecturaAnterior;
        } else {
            modificarLecturaModelo.consumo = Math.pow(10, lecturaAnterior.toString().length) - 1 - lecturaAnterior + lecturaActual;
        }
        detalles[indiceRegistro + 1].consumo = modificarLecturaModelo.consumo;
    },
    /**
     * Muestra el formulario que permite ver toda la información de la lectura
     * seleccionada.
     * @returns {void}
     */
    mostrarVerLectura: function () {
        var dialogo = $('div#divAgregarLectura');
        var indice = modificarLecturaModelo.indiceRegistro = parseInt($(this).parent().parent().attr('data-fila'));
        var registro = modificarLecturaModelo.detallesLectura[indice];

        that.bloquearCamposAgregarLectura();
        dialogo.find('#txtObservaciones').val(registro.observacion);
        dialogo.find('#txtFechaEjecucion').val(registro.fechaejecuta);
        dialogo.find('#txtFechaProgramacion').val(registro.fechaprograma);
        dialogo.find('#txtLecturaActual').val(registro.lecturaactual);
        dialogo.find('#txtConsumo').val(registro.consumo);
        dialogo.find('#txtIdMedidorAgregarLectura').val(modificarLecturaModelo.suscripcion.idmedidor);
        dialogo.find('#txtEmpresaLectura').val(registro.empresa).attr('data-id', registro.empresalectura);
        dialogo.find('#txtFactorCorreccionEmergente').val(modificarLecturaModelo.encabezado.factorcorreccion);
        dialogo.find('#txtIdLectura').val(registro.iddetallelectura);
        dialogo.find('#idEmpresaLectura').val(registro.idempresalectura);
        dialogo.find('#cboAnomalias').val(registro.idanomalia);
        dialogo.find('#cboNovedades').val(registro.idnovedad);
        dialogo.find('#cboEstado').val(registro.estado);
        dialogo.find('input[name="rbtnEjecutada"][value="' + registro.ejecutado + '"]').prop('checked', true);

        that.dialogoActual = dialogo.dialogo({
            modal: true,
            width: 850,
            title: 'Ver Lectura',
            buttons: {
                Aceptar: function () {
                    $(this).dialog('close');
                    that.limpiarDivAgregarLectura();
                }
            }
        });
    },
    /**
     * Muestra la división que contiene la información sobre el encabezado
     * seleccionado.
     * @returns {void}
     */
    mostrarVerEncabezadoHistorico: function () {
        var dialogo = $('div#divVerEncabezadoHistorico');
        var indice = modificarLecturaModelo.indiceRegistro = parseInt($(this).parent().parent().attr('data-fila'));
        var registro = modificarLecturaModelo.historialMedidor[indice];
        dialogo.find('#txtObservacionesHistorico').val(registro.observaciones);
        dialogo.find('#txtFechaHistorico').val(registro.fecha);
        dialogo.find('#txtCicloPeriodoHistorico').val(registro.cicloperiodo);
        dialogo.find('#txtLecturaActualHistorico').val(registro.lecturaactual);
        dialogo.find('#txtLecturaAnteriorHistorico').val(registro.lecturaanterior);
        dialogo.find('#txtConsumoHistorico').val(registro.consumo);
        dialogo.find('#txtIdMedidorHistorico').val(modificarLecturaModelo.suscripcion.idmedidor);
        dialogo.find('#txtFactorCorreccionEmergenteHistorico').val(modificarLecturaModelo.encabezado.factorcorreccion);
        dialogo.find('#txtIdLecturaHistorico').val(registro.iddetallelectura);
        that.dialogoActual = dialogo.dialogo({
            modal: true,
            width: 850,
            title: 'Ver Encabezado',
            buttons: {
                Aceptar: function () {
                    $(this).dialog('close');
                }
            }
        });
    },
    /**
     * Muestra el formulario que permite editar la lectura seleccionada.
     * @returns {void}
     */
    mostrarEditarLectura: function () {
        modificarLecturaModelo.accionCalcular = 'A';
        that.desbloquearCamposAgregarLectura();
        $('#divAgregarLectura')
        var dialogo = $('div#divAgregarLectura');
        var indiceRegistro = modificarLecturaModelo.indiceRegistro = parseInt($(this).parent().parent().attr('data-fila'));
        var registro = modificarLecturaModelo.detallesLectura[indiceRegistro];
        modificarLecturaModelo.lecturaAnterior = modificarLecturaModelo.detallesLectura[indiceRegistro].lecturaanterior;
        modificarLecturaModelo.lecturaActual = modificarLecturaModelo.detallesLectura[indiceRegistro].lecturaactual;
        dialogo.find('select, #txtFechaEjecucion, input:radio').prop('disabled', false);
        dialogo.find('#txtObservaciones').val(registro.observacion);
        dialogo.find('#txtFechaEjecucion').val(registro.fechaejecuta);
        dialogo.find('#txtFechaProgramacion').val(registro.fechaprograma);
        dialogo.find('#txtLecturaActual').val(registro.lecturaactual).removeAttr('disabled');
        dialogo.find('#txtConsumo').val(registro.consumo);
        dialogo.find('#txtIdMedidorAgregarLectura').val(modificarLecturaModelo.suscripcion.idmedidor);
        dialogo.find('#txtFactorCorreccionEmergente').val(modificarLecturaModelo.encabezado.factorcorreccion);
        dialogo.find('#idEmpresaLectura').val(registro.idempresalectura)
        dialogo.find('#txtEmpresaLectura')
                .val(registro.empresa)
                .attr('data-id', registro.empresalectura)
                .removeAttr('disabled');
        dialogo.find('#cboAnomalias').val(registro.idanomalia ? registro.idanomalia : '-1');
        dialogo.find('#cboNovedades').val(registro.idnovedad ? registro.idnovedad : '-1');
        dialogo.find('#cboEstado').val(registro.estado);
        dialogo.find('input:radio').each(function (i, radio) {
            if ($(radio).val() == registro.ejecutado) {
                $(radio).prop('checked', true);
            }
        });
        that.dialogoActual = dialogo.dialogo({
            modal: true,
            width: 850,
            title: 'Editar Lectura',
            buttons: {
                Guardar: function () {
                    that.editarLectura();
                },
                Cancelar: function () {
                    $(this).dialog('close');
                    that.limpiarDivAgregarLectura();
                }
            }
        });
    },
    /**
     * Muestra el formulario que permite editar la lectura seleccionada.
     * @returns {void}
     */
    editarLectura: function () {
        var indiceRegistro = modificarLecturaModelo.indiceRegistro;
        that.leerCamposDivAgregarLectura();
        var registroLeido = modificarLecturaModelo.registroLeido;
        var encontrado = false;
        registroLeido.indiceRegistro = modificarLecturaModelo.indiceRegistro;
        registroLeido.lecturaanterior = modificarLecturaModelo.detallesLectura[indiceRegistro].lecturaanterior;
        registroLeido.iddetallelectura = modificarLecturaModelo.detallesLectura[indiceRegistro].iddetallelectura;
        var ejecutado = $('#divAgregarLectura input[name="rbtnEjecutada"]:checked').val();
        if (ejecutado === 'S') {
            if (registroLeido.fechaejecuta === null) {
                __dom.lanzarAlerta('La fecha de ejecución es obligatoria', __app.mensajes.atencion);
                return;
            }
            if (registroLeido.idnovedad === '-1') {
                __dom.lanzarAlerta('Debe seleccionar una novedad', __app.mensajes.atencion);
                return;
            }
        }
        if (!(registroLeido.iddetallelectura === '')) {
            registroLeido.accion = "A";
            if (registroLeido.fechaejecuta !== '' && new Date(registroLeido.fechaprograma) > new Date(registroLeido.fechaejecuta)) {
                __dom.lanzarAlerta('La fecha de ejecución debe ser mayor a la fecha de programación', __app.mensajes.atencion);
                return;
            }
        } else {
            registroLeido.accion = "I";
        }
        $.each(jsonGrabar, function (indice, objeto) {
            if (objeto.indiceRegistro === modificarLecturaModelo.indiceRegistro) {
                that.jsonGrabarReplace(registroLeido, indice);
                encontrado = true;
            }
        });
        if (!encontrado) {
            that.jsonGrabarPush(registroLeido);
        }
        modificarLecturaModelo.detallesLectura[indiceRegistro] = registroLeido;
        that.llenarTablaDetallesLectura();
        that.dialogoActual.dialog('close');
    },
    /**
     * Elimina la lectura seleccionada en función de la existencia de dicho
     * registro en la base de datos.
     * @returns {void}
     */
    eliminarRegistro: function () {
        var indiceRegistro = modificarLecturaModelo.indiceRegistro;
        var detalleslectura = modificarLecturaModelo.detallesLectura;
        var registro = {};

        //se pregunta si el registro a eliminar se encuentra al inicio de la tabla pero no es el registro del encabezado
        if ((indiceRegistro === 0) && (detalleslectura[0].iddetallelectura !== modificarLecturaModelo.encabezado.idlecturaencabezado)) {
            if (detalleslectura[1]) {
                detalleslectura[1].lecturaanterior = modificarLecturaModelo.encabezado.lecturaactual;
                detalleslectura[1].consumo = parseInt(detalleslectura[1].consumo) + parseInt(detalleslectura[0].consumo);
            }
            //se pregunta si el registro a eliminar no es el último ni el primero de la tabla
        } else if (detalleslectura.length !== (indiceRegistro + 1) && indiceRegistro !== 0) {
            detalleslectura[indiceRegistro + 1].lecturaanterior = detalleslectura[indiceRegistro - 1].lecturaactual;
            detalleslectura[indiceRegistro + 1].consumo = parseInt(detalleslectura[indiceRegistro + 1].consumo) + parseInt(detalleslectura[indiceRegistro].consumo);
        }
        //se elimina el registro existente en el jsonGrabar independientemente de si tenía la acción "I" o "A"
        for (var i = (jsonGrabar.length - 1); i >= 0; i--) {
            if (jsonGrabar[i].indiceRegistro === modificarLecturaModelo.indiceRegistro) {
                registro = jsonGrabar[i];
                jsonGrabar.splice(i, 1);
            }
        }
        //si el registro a eliminar ya existe en la base de datos, se genera la acción "E" de eliminar dicho registro
        if (!(registro.iddetallelectura === '')) {
            registro.accion = "E";
            registro.iddetallelectura = detalleslectura[indiceRegistro].iddetallelectura;
            that.jsonGrabarPush(registro);
        }
        //se actualiza el jsonGrabar con los datos afectados por la eliminación (lecturaanterior, consumo)
        $.each(jsonGrabar, function (i, obj) {
            if (obj.indiceRegistro === modificarLecturaModelo.indiceRegistro) {
                var registroActualizado = detalleslectura[indiceRegistro + 1];
                that.jsonGrabarReplace(registroActualizado, i);
            }
        });
        that.actualizarIndices();
        modificarLecturaModelo.detallesLectura.splice(modificarLecturaModelo.indiceRegistro, 1);
        that.llenarTablaDetallesLectura();
    },
    /**
     * Se actualizan todos los índices de los registros afectados por la eliminación
     * en el jsonGrabar
     * @returns {void}
     */
    actualizarIndices: function () {
        $.each(jsonGrabar, function (i, obj) {
            if (obj.indiceRegistro > modificarLecturaModelo.indiceRegistro) {
                jsonGrabar[i].indiceRegistro = (parseInt(obj.indiceRegistro) - 1);
            }
        });
    },
    /**
     * Registra la lectura en la tabla de detalles y en el jsonGrabar.
     * @returns {void}
     */
    guardarLectura: function () {
        modificarLecturaModelo.indiceRegistro = (modificarLecturaModelo.detallesLectura.length);
        var lecturaActual = $('#divAgregarLectura').find('#txtLecturaActual').val();
        var fechaProgramacion = $('#txtFechaProgramacion').val().trim();
        if (fechaProgramacion === '') {
            __dom.lanzarAlerta('Debe seleccionar la fecha de programación', __app.mensajes.atencion);
            return;
        }
        if (modificarLecturaModelo.detallesLectura.length > 0) {
            var ultima = (modificarLecturaModelo.detallesLectura.length - 1);
            modificarLecturaModelo.lecturaAnterior = modificarLecturaModelo.detallesLectura[ultima].lecturaactual;
        } else {
            modificarLecturaModelo.lecturaAnterior = modificarLecturaModelo.encabezado.lecturaactual;
        }
        modificarLecturaModelo.lecturaActual = lecturaActual;
        that.leerCamposDivAgregarLectura();
        var registroLeido = modificarLecturaModelo.registroLeido;
        registroLeido.accion = "I";
        registroLeido.indiceRegistro = modificarLecturaModelo.indiceRegistro;
        modificarLecturaModelo.detallesLectura.push(modificarLecturaModelo.registroLeido);
        that.jsonGrabarPush(modificarLecturaModelo.registroLeido);
        that.llenarTablaDetallesLectura();
        that.dialogoActual.dialog('close');
        that.limpiarDivAgregarLectura();
    },
    /**
     * Hace un push en el json de grabado limpiando el registro de cualquier
     * objeto no deseado
     * @param  {Object} registro Es la lectura que se desea adicionar al jsonGrabar
     * * @returns {void}
     */
    jsonGrabarPush: function (registro) {
        var clonObjeto = {};
        $.each(registro, function (llave, valor) {
            if (!(typeof (valor) === 'object')) {
                clonObjeto[llave] = valor;
            }
        });
        jsonGrabar.push(clonObjeto);
    },
    /**
     * Reemplaza una lectura almacenada en el json de grabado por una nueva.
     * @param  {Object} registro Es la lectura que se desea guardar en lugar de
     * la está actualmente.
     * @param {Number} indice Representa la posición del arreglo jsonGrabar en
     * la cual se ejecutará el reeemplazo.
     * * @returns {void}
     */
    jsonGrabarReplace: function (registro, indice) {
        var clonObjeto = {};
        $.each(registro, function (llave, valor) {
            if (!(typeof (valor) === 'object')) {
                clonObjeto[llave] = valor;
            }
        });
        jsonGrabar[indice] = clonObjeto;
    },
    /**
     * Consulta el historial de lecturas de la suscripción.
     * * @returns {void}
     */
    consultarHistorial: function () {
        var idsuscripcion = modificarLecturaModelo.suscripcion.idsuscripcion;
        var fechainicial = $('#txtFechaInicial').val();
        var fechafinal = $('#txtFechaFinal').val();
        if (fechainicial === '' || fechafinal === '') {
            __dom.lanzarAlerta("Debe seleccionar un rango de fechas", __app.mensajes.atencion);
        } else {
            var data = {idsuscripcion: idsuscripcion, fechainicial: fechainicial, fechafinal: fechafinal};
            modificarLecturaControl.consultarHistorial(data, that.onConsultarHistorialCompleto);
        }
    },
    /**
     * Consulta el arreglo de anomalías existentes.
     * * @returns {void}
     */
    consultarAnomalias: function () {
        modificarLecturaControl.consultarAnomalias(that.onConsultarAnomaliasCompleto);
    },
    /**
     * Consulta el arreglo de novedades existentes.
     * * @returns {void}
     */
    consultarNovedades: function () {
        modificarLecturaControl.consultarNovedades(that.onConsultarNovedadesCompleto);
    },
    /**
     * Función de callback para guardar el historial del medidor en el modelo
     * y llenar la tabla de historial a partir de la respuesta obtenida del servidor.
     * @param  {Object} data Respuesta del servidor al consultar el historial del
     * medidor.
     * @returns {void}
     */
    onConsultarHistorialCompleto: function (data) {
        $('table#tblHistorialMedidor').empty()
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta('No se encontraron registros en el historial', __app.mensajes.atencion);
                break;
            case 1:
                modificarLecturaModelo.historialMedidor = data.historico;
                that.llenarTablaHistorialMedidor();
                break;
        }
    },
    /**
     * Función de callback asociada al botón "eliminar" presente en cada fila
     * de la tabla de detalle de lectura, que guarda el índice de la fila para
     * poder eliminar el registro.
     * @returns {void}
     */
    onEliminarLectura: function () {
        modificarLecturaModelo.indiceRegistro = parseInt($(this).parent().parent().attr('data-fila'));
        that.confirmarEliminar();
    },
    /**
     * Función de callback para llernar el combo de anomalías a partir de los
     * datos obtenidos de la consulta.
     * @param  {Object} data Respuesta del servidor al consultar las anomalías.
     * @returns {void}
     */
    onConsultarAnomaliasCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta('No se encontraron anomalías', __app.mensajes.atencion);
                break;
            case 1:
                var cboAnomalias = $('#cboAnomalias').empty();
                __dom.llenarCombo(cboAnomalias, data.anomalia, 'id', 'nombre');
                cboAnomalias.val('-1');
                break;
        }
    },
    /**
     * Función de callback para llernar el combo de novedades a partir de los
     * datos obtenidos de la consulta.
     * @param  {Object} data Respuesta del servidor al consultar las novedades.
     * @returns {void}
     */
    onConsultarNovedadesCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta('No se encontraron novedades', __app.mensajes.atencion);
                break;
            case 1:
                var cmbNovedades = $('#cboNovedades').empty();
                __dom.llenarCombo(cmbNovedades, data.novedad, 'id', 'nombre');
                cmbNovedades.val('-1');
                break;
        }
    },
    /**
     * Permite realizar la consulta del detalle del medidor a partir de su id.
     * @returns {void}
     */
    filtrarMedidor: function () {
        if (!modificarLecturaModelo.suscripcion.idpropiedad) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarSuscripcion, __app.mensajes.atencion);
            return;
        } else {
            var idmedidor = modificarLecturaModelo.suscripcion.idpropiedad;
            modificarLecturaControl.consultarDetalleMedidor({idmedidor: idmedidor}, that.consultarDetalleMedidorCompleto);
        }
    },
    /**
     * Función de callback para llernar la división que muestra el detalle del
     * medidor.
     * @param  {Object} data Respuesta del servidor al consultar el detalle del
     * medidor.
     * @returns {void}
     */
    consultarDetalleMedidorCompleto: function (data) {
        switch (parseInt(data.codigoRespuesta)) {
            case 0:
                that.dialogoActual.find('#spanMensaje').text(__app.mensajes.sinResultados).show();
                break;
            case 1:
                var medidor = modificarLecturaModelo.medidor = data.propiedad[0];
                $('#txtIdMedidorEmergente').val(modificarLecturaModelo.suscripcion.idmedidor);
                $('#txtMunicipio').val(medidor.municipio);
                $('#txtDireccion').val(medidor.direccion);
                $('#txtBarrio').val(medidor.barrio);
                $('#txtNumerocatastral').val(medidor.catastro);
                that.mostrarDetalleMedidor(data);
                break;
        }
    },
    /**
     * Carga el autocompletado de "empresa" fijando un mínimo de 3 caracteres para activarlo.
     * @returns {void}
     */
    cargarAutocomplete: function () {

        __dom.configurarAutocomplete(
                '#txtEmpresaLectura', that.sourceAutoComplete,
                function (event, ui) {
                    modificarLecturaModelo.idEmpresaLectura = ui.item.idVal;
                    $('#idEmpresaLectura').val(ui.item.idVal);
                },
                function () {
                    modificarLecturaModelo.idEmpresaLectura = undefined;
                    $('#idEmpresaLectura').val('');
                }
        );
    },
    /**
     * Función de callback que consulta la empresa que realiza la lectura y
     * llama a la función que muestra el resultado en el autocomplete.
     * @param  {Object} data Respuesta del servidor al consultar las empresas.
     * @returns {void}
     */
    sourceAutoComplete: function (request, response) {
        that.request = request;
        that.response = response;
        var datos = {};
        datos.nombre = request.term;
        modificarLecturaControl.buscarEmpresaLectura(datos, that.mostrarResultado);
    },
    /**
     * Gestiona el arreglo de empresas que se obtuvo de la consulta para mostrarlo como
     * una lista de opciones en el combo correspondiente.
     * @param  {Object} data Respuesta del servidor al consultar las empresas.
     * @returns {void}
     */
    mostrarResultado: function (data) {
        if (data.codigoRespuesta === 1) {
            var result = [];
            $.each(data.terceros, function (i, item) {
                result.push({
                    label: item.nombretercero,
                    value: item.nombretercero,
                    documento: item.documento,
                    idVal: item.idtercero
                });
            });
            that.response(result);
        }
    },
    /**
     * Valida la información de la modificación de lectura y en caso de ser correcta muestra confirmación de la lectura que se registrará
     */
    mostrarDialogoMotivos: function () {
        try {
            if (!modificarLecturaModelo.suscripcion) {
                __dom.lanzarAlerta('Debe seleccionar una suscripción', __app.mensajes.atencion);
                return;
            }

            if (!modificarLecturaModelo.encabezado) {
                __dom.lanzarAlerta('Debe seleccionar una lectura', __app.mensajes.atencion);
                return;
            }

            var validacionEncabezado = that.validarLecturaActual();
            if (validacionEncabezado === false) {
                return;
            }
            if (validacionEncabezado === 0) {
                that.guardarOperacion();
                return;
            }
            that.validarAplicarNota();
            var desviacion = that.validarDesviacionLectura();
            if (desviacion) {
                __dom.lanzarAlerta('La lectura que se registrará es ' + desviacion + ' ¿Desea continuar?', __app.mensajes.atencion, that.mostrarDialogoTipoNota, true);
                return;
            }
            that.mostrarDialogoTipoNota();
        } catch (e) {
            console.log(e);
        }
    },
    /**
     * Verifica que se haya seleccionado si desea aplicar notas o no
     * @returns {Boolean}
     */
    validarAplicarNota: function () {
        var aplicarNota = $('#cboAplicarNota').val();
        if (aplicarNota === '-1') {
            __dom.lanzarAlerta('Debe seleccionar una opción en el campo de aplicar nota', __app.mensajes.atencion);
            throw '';
        }
        return aplicarNota;
    },
    /**
     * En caso de que desea aplicar nota debe seleccionar el un motivo de nota y la observación para guardar
     */
    mostrarDialogoTipoNota: function () {
        try {
            var aplicarNotas = that.validarAplicarNota();
            if (aplicarNotas === 'N') {
                that.guardarOperacion();
                return;
            }
            $('#divMotivoNota').dialogo({
                modal: true,
                width: 850,
                title: 'Configurar nota por modificación',
                buttons: {
                    'Aceptar': function () {
                        if ($('#cmbMotivosNota').val() === '-1' || $('#txtObservacionesNota').val().trim() === '') {
                            __dom.lanzarAlerta('Debe seleccionar una novedad y escribir unas observaciones', __app.mensajes.atencion);
                            return;
                        }
                        that.guardarOperacion();
                    },
                    'Cancelar': function () {
                        $(this).dialog('close');
                    }
                }
            });
        } catch (e) {

        }
    },
    /**
     * Valida el tipo de desviación de la lectura modificada que se generará
     * @returns {void}
     */
    validarDesviacionLectura: function () {
        var consumoActual = parseInt($('#txtConsumoUltima').val());
        var lecturaActual = parseInt($('#txtLecturaActualUltima').val());
        var lecturaAnterior = parseInt($('#txtLecturaAnteriorUltima').val());
        var promedioConsumo = parseInt(modificarLecturaModelo.encabezado.consumopromedio);

        consumoActual = isNaN(consumoActual) ? 0 : consumoActual;
        lecturaActual = isNaN(lecturaActual) ? 0 : lecturaActual;
        var desviacionAlta = parseFloat(promedioConsumo + (promedioConsumo * 0.67));
        var desviacionBaja = parseFloat(promedioConsumo - (promedioConsumo * 0.67));
        lecturaAnterior = isNaN(lecturaAnterior) ? 0 : lecturaAnterior;
        if (lecturaActual < lecturaAnterior) {
            return ' <b> negativa </b>';
        }
        if (consumoActual < desviacionBaja) {
            return '<b> baja </b>';
        }
        if (consumoActual > desviacionAlta) {
            return ' <b> alta </b>';
        }

        return false;
    },
    /**
     * Valida la información de la lectura actual y la cantidad de cambios que hubo en la información
     * @returns {Boolean|number}
     */
    validarLecturaActual: function () {
        var mensaje = '';
        var cambios = 0;
        var campos = $('#divLecturaActual input:text');
        var lectura = modificarLecturaModelo.encabezado;

        for (var i = 0; i < campos.length; i++) {
            var caja = campos[i];
            if (caja.value.trim() === '') {
                var label = caja.previousElementSibling.innerText.replace(':', '');
                mensaje += ' El campo <b> ' + label + ' </b>  es obligatorio. </br> ';
                continue;
            }
            if (!!caja.getAttribute('data-campo')) {
                var valorEncabezado = lectura[caja.getAttribute('data-campo')];
                if (!valorEncabezado || (!!valorEncabezado && (lectura[caja.getAttribute('data-campo')].trim() !== caja.value.trim()))) {
                    cambios++;
                }
            }
        }
        if (mensaje !== '') {
            __dom.lanzarAlerta(mensaje, __app.mensajes.atencion);
            return false;
        }
        return cambios;
    },
    /**
     * Valida que se haya seleccionado un motivo de nota y  se haya escrito una observación
     * @returns {boolean}
     */
    validarMotivoNota: function () {
        if ($('#cmbMotivosNota').val() === '-1' || !$('#cmbMotivosNota').val()) {
            $('#mensajeDetalleNota').text('Debe seleccionar el motivo de la modificación');
            return false;
        }
        if ($('#txtObservacionesNota').val().trim() === '') {
            $('#mensajeDetalleNota').text('Debe digitar la observación de la modificación');
            return false;
        }
        return true;
    },
    /**
     * Realiza el guardado de la operación enviando el jsonGrabar como fuente
     * de información.
     * @returns {void}
     */
    guardarOperacion: function () {
        var cabecera = modificarLecturaModelo.encabezado;
        var validacion = that.validarLecturaActual();
        if (validacion === false) {
            return;
        }
        if (validacion === 0) {
            var desviacion = that.validarDesviacionLectura();
            if (desviacion) {
                __dom.lanzarAlerta('La lectura que se registrará es ' + desviacion + ' ¿Desea continuar?', __app.mensajes.atencion, function () {
                    that.enviarOperacion(validacion)
                }, true);
                return;
            }
        }
        var aplicarNotas = that.validarAplicarNota();
        if (validacion > 0 && aplicarNotas === 'S') {
            if (!that.validarMotivoNota()) {
                return;
            }
            cabecera.validarnota = true;
            cabecera.idmotivo = $('#cmbMotivosNota').val();
            cabecera.observaciones = $('#txtObservacionesNota').val();
            $('#divMotivoNota').dialogo('close');
        }
        that.enviarOperacion(validacion);
    },
    /**
     * Hace petición al servidor para guardar la modificación lectura
     * @param {number} validacion - Cantidad de cambios en la cabecera
     */
    enviarOperacion: function (validacion) {
        //Se válida los cambios de la cabecera 
        var cabecera = modificarLecturaModelo.encabezado;
        var observacion = $('#txtObservacionesActual').val();
        var factorcorreccion = $('#txtFactorCorreccion').val();
        var cambiofactor = (cabecera.factorcorreccion !== factorcorreccion);
        observacion += cambiofactor ? ' Factor corrección: ' + factorcorreccion : '';
        validacion += (cabecera.observaciones !== observacion) ? 1 : 0;
        validacion += (cabecera.factorcorreccion !== factorcorreccion) ? 1 : 0;

        cabecera.observaciones = observacion;
        cabecera.factorcorreccion = factorcorreccion;
        cabecera.consumo = $('#txtConsumoUltima').val();
        cabecera.consumopromedio = $('#txtConsumoPromedio').val();
        cabecera.lecturaactual = $('#txtLecturaActualUltima').val();
        cabecera.lecturaanterior = $('#txtLecturaAnteriorUltima').val();
        cabecera.idsuscripcion = modificarLecturaModelo.suscripcion.idsuscripcion;

        if (validacion > 0) {
            cabecera.cabeceracambiada = true;
        }
        var data = {
            datos: [],
            encabezado: cabecera
        };
        if (jsonGrabar.length > 0) {
            data.datos = jsonGrabar;
        }

        modificarLecturaControl.guardarOperacion(data, that.guardarOperacionCompleto);
    },
    /**
     * Función de callback para mostrar un mensaje de operación exitosa en caso
     * de lograr guardar.
     * @param  {Object} data Respuesta del servidor al guardar la operación.
     * @returns {void}
     */
    guardarOperacionCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 1:
                var fxRecargar = function () {
                    window.location.reload();
                };
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion, fxRecargar, null, fxRecargar);
                break;
        }
    },
    /**
     * Borra el contenido de las variables temporales del modelo, limpia y establece
     * todos los campos y tablas a su estado inicial.
     * @returns {void}
     */
    reiniciarProceso: function () {
        modificarLecturaModelo = {};
        jsonGrabar = [];
        //ocultar, limpiar o reiniciar elementos
        $('#divLecturaActual, #divDetalleLectura, #divEncabezadoHistorico').hide();
        $('input[type = text], textarea').val('');
        $('select').val(-1);
        $('table').empty();
    },
    /**
     * Si se selecciona que está ejecutado el estado cambia de inmediato el combo de estado a Ejecutado
     */
    onRadioEjecutadaClick: function () {
        var radio = $(this);
        if (radio.val() === 'S') {
            $('#cboEstado').val('E');
        }
    },
    /**
     * Calcula el último consumo según la ecuación para el cálculo
     */
    calcularPromedioEncabezado: function () {
        var cabecera = $('#divLecturaActual');
        var lecturaAnterior = parseInt(cabecera.find('#txtLecturaAnteriorUltima').val());
        var lecturaActual = parseInt(cabecera.find('#txtLecturaActualUltima').val());
        if (isNaN(lecturaAnterior) || isNaN(lecturaActual)) {
            __dom.lanzarAlerta('Debe ingresar la lectura anterior y/o lectura actual', __app.mensajes.atencion);
            return;
        }
        var factorCorreccion = parseFloat(cabecera.find('#txtFactorCorreccion').val());
        
        var consumo = ((Math.pow(10, modificarLecturaModelo.encabezado.digitos) - 1) - lecturaAnterior) + lecturaActual;
        consumo = (lecturaActual >= lecturaAnterior) ? lecturaActual - lecturaAnterior : consumo;
        consumo *= factorCorreccion;
        cabecera.find('input#txtConsumoUltima').val(Math.round(consumo));
    },
    
 
    
    validaTipoUsoFactura: function(){
         var aplicarNotas = that.validarAplicarNota();
            if (aplicarNotas === 'S') {
                that.validaTipoUso()
            }
            else{
                that.mostrarDialogoMotivos();
            }
        
    },
    
       validaTipoUso: function(){
        var data = {
            idsuscripcion: modificarLecturaModelo.suscripcion.idsuscripcion,
            idperiodolectura: modificarLecturaModelo.encabezado.idperiodolectura
        };
        
        modificarLecturaControl.validaTipoUsoSuscripcion(data, that.resultadoValidaTipoUsoFactura); 
    },
    
    resultadoValidaTipoUsoFactura: function(data){
        console.log(data);
        console.log(data.datos.fac_estado);
        try{
            if(data.datos[0].fac_estado != 'A'){
                __dom.lanzarAlerta('La Suscripcion no tiene la Factura Activa', __app.mensajes.atencion);
                throw '';
            }
            if (modificarLecturaModelo.suscripcion.idetipouso != data.datos[0].uni_tipusosuscr) {//data.datos[0].uni_tipusosuscr
                __dom.lanzarAlerta('La Suscripcion no tiene el Mismo tipo de uso de la Factura', __app.mensajes.atencion);
                throw '';
            }
            that.mostrarDialogoMotivos();
        } catch (e) {
            console.log(e);
        }
        
    }
};
modificarLecturaVista.init();
