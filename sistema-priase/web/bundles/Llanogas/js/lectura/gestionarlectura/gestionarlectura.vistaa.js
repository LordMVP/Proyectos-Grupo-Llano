/**
 * @fileOverview Archivo de vista y control para gestionar lectura
 * @author jeissonBarriga
 * @requires gestionarlectura.control.js
 * @requires gestionarlectura.modelo.js
 * @version 1.0.0
 */

/**
 * Objeto que hace referencia al namespace gestionarlecturaVista
 * @type {object}
 */
var that = null;

/** @namespace */
var gestionarlecturaVista = {
   
    /**
     * Hace referencia al último diálogo abierto en la aplicación
     * @type {object}
     */
    dialogoActual: null,
    
    /**
     * Función que se invoca al inciar el objeto gestionarliquidacionVista. Asigna comportamientos para los eventos de los controles.
     * @returns {void}
     */
    init: function() {
        that = this;
        __app.vistaActual = gestionarlecturaVista;
        __app.modeloActual = gestionarlecturaModelo;
        var comandos = $('div#divComandos');
        comandos.find('#btnFiltrar').on('click', that.mostrarFiltro);
        comandos.find('#btnGrabar').on('click', that.guardarOperacion);
        comandos.find('#btnCancelar').on('click', that.cancelarOperacion);
        $('#btnCargarDetalleMedidor').on('click', that.filtrarMedidor);
        $('#btnHistorialMedidor').on('click', that.mostrarHistorialMedidor);
        $('#btnDetalleLectura').on('click', that.llenarTablaDetallesLectura);
        $('#btnAgregarLectura').on('click', that.mostrarAgregarLectura);
        $('#btnBuscarHistorial').on('click', that.consultarHistorial);
        $('#txtLecturaActual').on('blur', that.calcularConsumo);
        $('#txtFechaProgramacion').on('blur', that.validarFechaProgramacion);
        //Configuración de campos numéricos
        __dom.configurarTextoNumerico('txtFiltroSus, #txtFiltroDoc, #txtFiltroCodAnt,#txtLecturaActual');
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
    },
    /**
     * Verifica que la fecha de programación sea mayor a la del sistema para permitir digitar la lextura actual
     */
    validarFechaProgramacion: function(){
        var fecha = $('#txtFechaProgramacion').val();
        //var lectura = $('#txtLecturaActual').attr('disabled', false);
        if($('#txtFechaProgramacion').val() !== '' && gestionarlecturaModelo.accionCalcular === 'A'){
            $('#txtLecturaActual').attr('disabled', new Date(fecha) >  __app.obtenerFechaSistema()); // new Date()); -- se reemplaza fecha del cliente por fecha servidor
        }
    },
    
    /**
     * Muestra el filtro para consultar un suscriptor
     * @returns {void}
     */
    mostrarFiltro: function() {
        var filtro = $('div#camposBuscarSuscripcion');
        that.dialogoActual = filtro.dialogo({
            modal: true,
            width: 850,
            title: 'Buscar un suscriptor',
            buttons: {
                Buscar: that.filtrarSuscriptor
            }
        });
    },
    
    /**
     * Pregunta al usuario si desea cancelar la operación actual si el usuario
     * desea cancelar, se limpia el formulario y se actualiza el modelo
     * @returns {void}
     */
    cancelarOperacion: function() {
        if(gestionarlecturaModelo.suscripcion){
            $('div#divConfirmarCancelar').dialogo({
                resizable: false,
                heigth: 140,
                modal: true,
                title: 'Cancelar la Operación',
                buttons: {
                    "Sí": function() {
                        $(this).dialog('close');
                        that.reiniciarProceso();
                    }, No: function() {
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
    confirmarEliminar: function() {
        gestionarlecturaModelo.indiceRegistro = parseInt($(this).parent().parent().attr('data-fila'));
        $('div#divConfirmarEliminar').dialogo({
            resizable: false,
            heigth: 140,
            modal: true,
            title: 'Eliminar registro',
            buttons: {
                "Sí": function() {
                    $(this).dialog('close');
                    that.eliminarRegistro();
                }, Cancelar: function() {
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
    filtrarSuscriptor: function() {
        var filtro = $('div#camposBuscarSuscripcion');
        var idsuscripcion = filtro.find('#txtFiltroSus').val().trim();
        var documento = filtro.find('#txtFiltroDoc').val().trim();
        var codigoanterior = filtro.find('#txtFiltroCodAnt').val().trim();
        if (idsuscripcion === '' && documento === '' && codigoanterior === '') {
            filtro.find('#spanMensaje').text(__app.mensajes.camposInvalidosFiltro).show();
        } else {
            var data = {idsuscripcion: idsuscripcion, documento: documento, codigoanterior: codigoanterior};
            gestionarlecturaControl.consultarSuscriptor(data, that.consultaSuscripcionCompleto);
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
    consultaSuscripcionCompleto: function(data) {
        that.limpiarFormulario();
        switch (parseInt(data.codigoRespuesta)) {
            case 0:
                that.dialogoActual.find('#spanMensaje').text(__app.mensajes.sinResultados).show();
                break;
            case 1:
                var sus = null;
                that.reiniciarProceso();
                gestionarlecturaModelo.suscripcion = data.suscripciones;
                if (data.suscripciones.length > 1) {
                    that.dialogoActual.find('div.listaSeleccion').remove();
                    var divSuscriptores = $('<div>').addClass('listaSeleccion');
                    $.each(data.suscripciones, function(s, susc) {
                        var div = $('<div>');
                        var radio = $('<input type="radio">');
                        radio.val(susc.idsuscripcion);
                        radio.attr('id', 'radio_susc_' + s);
                        radio.attr('data-indice', s);
                        radio.attr('name', 'radio_suscripciones');

                        var label = $('<label>').attr('for', 'radio_susc_' + s);
                        label.text(susc.documento + ' - ' + susc.nombre + ' - Suscripción: ' + susc.idsuscripcion);
                        div.append(radio).append(label);
                        divSuscriptores.append(div);
                    });
                    var btn = $('<button>').text('Seleccionar').addClass('btnSimple');
                    btn.on('click', function() {
                        var suscSeleccionada = that.dialogoActual.find('input[name="radio_suscripciones"]:checked');
                        if (suscSeleccionada.length > 0) {
                            sus = gestionarlecturaModelo.suscripcion = data.suscripciones[parseInt(suscSeleccionada.attr('data-indice'))];
                            console.log(sus);
                            that.dialogoActual.find('#spanMensaje').hide();
                            that.dialogoActual.dialog('close');
                            divSuscriptores.remove();
                            that.consultarLecturaActual();
                            that.cargarCabecera(sus);
                        } else {
                            that.dialogoActual.find('#spanMensaje').text(__app.mensajes.seleccionarOpcion).show();
                        }
                    });
                    divSuscriptores.insertAfter(that.dialogoActual.find('#spanMensaje'));
                    divSuscriptores.append(btn);
                } else {
                    sus = gestionarlecturaModelo.suscripcion = data.suscripciones[0];
                    that.dialogoActual.find('#spanMensaje').hide();
                    that.dialogoActual.dialog('close');
                    that.consultarLecturaActual();
                    that.cargarCabecera(sus);
                }

                break;
        }
    },
    
    /**
     * Consulta la lectura actual para mostrarla en el encabezado
     * @returns {void}
     */
    consultarLecturaActual: function() {
        var cabecera = $('div#divLecturaActual');
        var idsuscripcion = gestionarlecturaModelo.suscripcion.idsuscripcion;
        if (idsuscripcion === '') {
            cabecera.find('#spanMensaje').text(__app.mensajes.camposInvalidosFiltro).show();
        } else {
            gestionarlecturaControl.consultarLecturaActual({idsuscripcion: idsuscripcion}, that.consultarLecturaActualCompleto);

        }
    },
    /**
     * Función de callback para establecer la información de la lectura actual
     * a partir de la respuesta obtenida del servidor.
     * @param  {Object} data Respuesta del servidor al consultar la lectura actual.
     * @returns {void}
     */
    consultarLecturaActualCompleto: function(data) {
        switch (parseInt(data.codigoRespuesta)) {
            case 0:
                __dom.lanzarAlerta(__app.mensajes.sinDetallesLectura, __app.mensajes.atencion);
                break;
            case 1:
                var encabezado = data.encabezado;
                var detallesLectura = data.encabezado.detalleslectura;
                gestionarlecturaModelo.encabezado = encabezado;
                gestionarlecturaModelo.lecturaActual = encabezado.lecturaactual;
                gestionarlecturaModelo.detallesLectura = detallesLectura;
                for(var i = 0; i < detallesLectura.length; i++){
                    var lectura = detallesLectura[i];
                    lectura.empresa = lectura.empresalectura;
                    lectura.empresalectura = lectura.idempresalectura;
                }
                gestionarlecturaModelo.clonDetallesLectura = [];
                that.cargarLecturaActual(encabezado);
                break;
        }
    },
    
    /**
     * Limpia el formulario y elimina la información actual del recaudo y el 
     * suscriptor de la interfaz
     * @returns {void}
     */
    limpiarFormulario: function() {
        var cabecera = $('div#divCabecera');
        cabecera.find('input[type="text"]').val('');
        gestionarlecturaModelo = {};
    },
    
    /**
     * Limpia la división que contiene los campos necesarios para agregar una
     * nueva lectura.
     * @returns {void}
     */
    limpiarDivAgregarLectura: function() {
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
    cargarCabecera: function(sus) {
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
    cargarLecturaActual: function(lecturaActual) {
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
    leerCamposDivAgregarLectura: function() {
        var dialogo = $('#divAgregarLectura');
        var ultimo = parseInt(gestionarlecturaModelo.detallesLectura.length) - 1;
        var agregarLectura = {};
        if (ultimo < 0) {
            agregarLectura.lecturaanterior = gestionarlecturaModelo.encabezado.lecturaactual;
        } else {
            agregarLectura.lecturaanterior = parseInt(gestionarlecturaModelo.detallesLectura[ultimo].lecturaactual);
        }
        agregarLectura.idsuscripcion = gestionarlecturaModelo.suscripcion.idsuscripcion;
        agregarLectura.idmedidor = dialogo.find('#txtIdMedidorAgregarLectura').val();
        agregarLectura.estado = dialogo.find('#cboEstado').val();
        //agregarLectura.fecha = new Date().dateFormat('Y/m/d'); -- se reemplaza fecha del cliente por fecha del sistema
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
        agregarLectura.novedad = $('#cboNovedades').val() === '-1' ? '': $('#cboNovedades option:selected').text();
        agregarLectura.idanomalia = $('#cboAnomalias').val();// === '-1' ? '' : $('#cboAnomalias').val();
        agregarLectura.idnovedad = $('#cboNovedades').val();// === '-1' ? '' : $('#cboNovedades').val();
        agregarLectura.ejecutado = dialogo.find('input[name="rbtnEjecutada"]:checked').val();
        agregarLectura.empresalectura = $('#idEmpresaLectura').val();
        agregarLectura.empresa = $('#txtEmpresaLectura').val();
        agregarLectura.iddetallelectura = '';
        agregarLectura.idlecturaencabezado = gestionarlecturaModelo.encabezado.idlecturaencabezado;
        gestionarlecturaModelo.registroLeido = agregarLectura;
    },
    
    /**
     * Lee y guarda en el modelo la información de la lectura que se desea 
     * agreagar.
     * @returns {void}
     */
    llenarTablaDetallesLectura: function() {
        $('table#tblDetalleLectura').empty();
        $('#spanMensajeLecturas').text('');
        if(gestionarlecturaModelo.detallesLectura.length > 0){
            var tabla = fillTable('tblDetalleLectura', 'formatoDetalle', 'gestionarlecturaModelo.detallesLectura', '');
            tabla.find('td[header="thVer"] input[type="button"]').on('click', that.mostrarVerLectura);
            tabla.find('td[header="thEditar"] input[type="button"]').on('click', that.mostrarEditarLectura);
            tabla.find('td[header="thEliminar"] input[type="button"]').on('click', that.confirmarEliminar);
            
            for(var i=0;i<gestionarlecturaModelo.detallesLectura.length;i++){
                var detalle = gestionarlecturaModelo.detallesLectura[i];
                if(detalle.ejecutado === 'S'){
                    tabla.find('tbody tr[data-fila="'+i+'"] td[header="thEditar"] input:button').attr('disabled', 'disabled');
                    tabla.find('tbody tr[data-fila="'+i+'"] td[header="thEliminar"] input:button').attr('disabled', 'disabled');
                }
            }
        }else{
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
    llenarTablaHistorialMedidor: function() {
        $('table#tblHistorialMedidor').empty();
        var tabla = fillTable('tblHistorialMedidor', 'formatoHistorial', 'gestionarlecturaModelo.historialMedidor', '');
        tabla.find('td[header="thVer"] input[type="button"]').on('click', that.mostrarVerEncabezadoHistorico);
    },
    
    /**
     * Realiza los bloqueos necesarios en los campos de la división de agregar
     * lectura.
     * agreagar.
     * @returns {void}
     */
    bloquearCamposAgregarLectura: function() {
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
        $('input[type = radio][name = rbtnEjecutada]').prop('disabled',true).attr('checked', false);
        $('textarea#txtObservaciones').prop('disabled', true);
    },
    
    /**
     * Habilita los campos necesarios en la división de agregar lectura.
     * agreagar.
     * @returns {void}
     */
    desbloquearCamposAgregarLectura: function() {
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
    mostrarDetalleMedidor: function() {
        var dialogo = $('div#divDetalleMedidor');
        that.dialogoActual = dialogo.dialogo({
            modal: true,
            width: 850,
            title: 'Detalles de Medidor',
            buttons: {
                Aceptar: function() {
                    $(this).dialog('close');
                }
            }
        });
    },
    
    /**
     * Muestra el historial del medidor en el rango de fechas especificado.
     * @returns {void}
     */
    mostrarHistorialMedidor: function() {
        $('#divEncabezadoHistorico').show();
    },
    
    
    /**
     * Muestra el formulario para agregar una lectura.
     * @returns {void}
     */
    mostrarAgregarLectura: function() {
        gestionarlecturaModelo.accionCalcular = 'I';
        that.desbloquearCamposAgregarLectura();
        that.limpiarDivAgregarLectura();
        var dialogo = $('div#divAgregarLectura');
        dialogo.find('input#txtIdMedidorAgregarLectura').val(gestionarlecturaModelo.suscripcion.idmedidor);
        dialogo.find('input#txtFactorCorreccionEmergente').val(gestionarlecturaModelo.encabezado.factorcorreccion);

        dialogo.find('#txtFechaProgramacion, #txtEmpresaLectura').removeAttr('disabled');
        dialogo.find('#txtLecturaActual').attr('disabled', true);
        that.dialogoActual = dialogo.dialogo({
            modal: true,
            width: 850,
            title: 'Agregar Lectura',
            buttons: {
                Guardar: function() {
                    that.guardarLectura();
                },
                Cancelar: function() {
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
    calcularConsumo: function() {
        var accionCalcular = gestionarlecturaModelo.accionCalcular;
        var dialogo = $('#divAgregarLectura');
        var ultimo = gestionarlecturaModelo.detallesLectura.length - 1;
        var lecturaActual = dialogo.find('#txtLecturaActual').val();
        var lecturaAnterior;
        if (lecturaActual === '') {
            lecturaActual = 0;
        }
        lecturaActual = parseInt(lecturaActual);
        switch (accionCalcular) {
            case 'I':
                if (gestionarlecturaModelo.detallesLectura.length === 0) {
                    lecturaAnterior = gestionarlecturaModelo.encabezado.lecturaactual;
                } else {
                    lecturaAnterior = parseInt(gestionarlecturaModelo.detallesLectura[ultimo].lecturaactual);
                }
                break;
            case 'A':
                lecturaAnterior = parseInt(gestionarlecturaModelo.detallesLectura[gestionarlecturaModelo.indiceRegistro].lecturaanterior);
                break;
        }
        var digito = gestionarlecturaModelo.encabezado.digitos;
        var consumo = ((Math.pow(10, digito) - 1) - lecturaAnterior) + lecturaActual;
        gestionarlecturaModelo.consumo = (lecturaActual >= lecturaAnterior) ? lecturaActual - lecturaAnterior : consumo;
        dialogo.find('#txtConsumo').val(gestionarlecturaModelo.consumo);
    },
    
    /**
     * Recalcula el consumo en función de las variaciones sufridas por la tabla.
     * @returns {void}
     */
    actualizarConsumo: function() {
        var detalles = gestionarlecturaModelo.detallesLectura;
        var indiceRegistro = gestionarlecturaModelo.indiceRegistro;
        var lecturaActual = detalles[indiceRegistro].lecturaactual;
        var lecturaAnterior = detalles[indiceRegistro].lecturaanterior;
        if (lecturaActual >= lecturaAnterior) {
            gestionarlecturaModelo.consumo = lecturaActual - lecturaAnterior;
        } else {
            gestionarlecturaModelo.consumo = Math.pow(10, lecturaAnterior.toString().length) - 1 - lecturaAnterior + lecturaActual;
        }
        detalles[indiceRegistro + 1].consumo = gestionarlecturaModelo.consumo;
    },
    
    /**
     * Muestra el formulario que permite ver toda la información de la lectura
     * seleccionada.
     * @returns {void}
     */
    mostrarVerLectura: function() {
        var dialogo = $('div#divAgregarLectura');
        var indice = gestionarlecturaModelo.indiceRegistro = parseInt($(this).parent().parent().attr('data-fila'));
        var registro = gestionarlecturaModelo.detallesLectura[indice];

        that.bloquearCamposAgregarLectura();
        dialogo.find('#txtObservaciones').val(registro.observacion);
        dialogo.find('#txtFechaEjecucion').val(registro.fechaejecuta);
        dialogo.find('#txtFechaProgramacion').val(registro.fechaprograma);
        dialogo.find('#txtLecturaActual').val(registro.lecturaactual);
        dialogo.find('#txtConsumo').val(registro.consumo);
        dialogo.find('#txtIdMedidorAgregarLectura').val(gestionarlecturaModelo.suscripcion.idmedidor);
        dialogo.find('#txtEmpresaLectura').val(registro.empresa).attr('data-id', registro.empresalectura);
        dialogo.find('#txtFactorCorreccionEmergente').val(gestionarlecturaModelo.encabezado.factorcorreccion);
        dialogo.find('#txtIdLectura').val(registro.iddetallelectura);
        dialogo.find('#idEmpresaLectura').val(registro.idempresalectura);
        dialogo.find('#cboAnomalias').val(registro.idanomalia);
        dialogo.find('#cboNovedades').val(registro.idnovedad);
        dialogo.find('#cboEstado').val(registro.estado);
        dialogo.find('input[name="rbtnEjecutada"][value="'+registro.ejecutado+'"]').prop('checked', true);
        
        that.dialogoActual = dialogo.dialogo({
            modal: true,
            width: 850,
            title: 'Ver Lectura',
            buttons: {
                Aceptar: function() {
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
    mostrarVerEncabezadoHistorico: function() {
        var dialogo = $('div#divVerEncabezadoHistorico');
        var indice = gestionarlecturaModelo.indiceRegistro = parseInt($(this).parent().parent().attr('data-fila'));
        var registro = gestionarlecturaModelo.historialMedidor[indice];
        dialogo.find('#txtObservacionesHistorico').val(registro.observaciones);
        dialogo.find('#txtFechaHistorico').val(registro.fecha);
        dialogo.find('#txtCicloPeriodoHistorico').val(registro.cicloperiodo);
        dialogo.find('#txtLecturaActualHistorico').val(registro.lecturaactual);
        dialogo.find('#txtLecturaAnteriorHistorico').val(registro.lecturaanterior);
        dialogo.find('#txtConsumoHistorico').val(registro.consumo);
        dialogo.find('#txtIdMedidorHistorico').val(gestionarlecturaModelo.suscripcion.idmedidor);
        dialogo.find('#txtFactorCorreccionEmergenteHistorico').val(gestionarlecturaModelo.encabezado.factorcorreccion);
        dialogo.find('#txtIdLecturaHistorico').val(registro.iddetallelectura);
        that.dialogoActual = dialogo.dialogo({
            modal: true,
            width: 850,
            title: 'Ver Encabezado',
            buttons: {
                Aceptar: function() {
                    $(this).dialog('close');
                }
            }
        });
    },
    
    /**
     * Muestra el formulario que permite editar la lectura seleccionada.
     * @returns {void}
     */
    mostrarEditarLectura: function() {
        gestionarlecturaModelo.accionCalcular = 'A';
        that.desbloquearCamposAgregarLectura();
        $('#divAgregarLectura')
        var dialogo = $('div#divAgregarLectura');
        var indiceRegistro = gestionarlecturaModelo.indiceRegistro = parseInt($(this).parent().parent().attr('data-fila'));
        var registro = gestionarlecturaModelo.detallesLectura[indiceRegistro];
        gestionarlecturaModelo.lecturaAnterior = gestionarlecturaModelo.detallesLectura[indiceRegistro].lecturaanterior;
        gestionarlecturaModelo.lecturaActual = gestionarlecturaModelo.detallesLectura[indiceRegistro].lecturaactual;
        dialogo.find('select, #txtFechaEjecucion, input:radio').prop('disabled',false);
        dialogo.find('#txtObservaciones').val(registro.observacion);
        dialogo.find('#txtFechaEjecucion').val(registro.fechaejecuta);
        dialogo.find('#txtFechaProgramacion').val(registro.fechaprograma);
        dialogo.find('#txtLecturaActual').val(registro.lecturaactual).removeAttr('disabled');
        dialogo.find('#txtConsumo').val(registro.consumo);
        dialogo.find('#txtIdMedidorAgregarLectura').val(gestionarlecturaModelo.suscripcion.idmedidor);
        dialogo.find('#txtFactorCorreccionEmergente').val(gestionarlecturaModelo.encabezado.factorcorreccion);
        dialogo.find('#idEmpresaLectura').val(registro.idempresalectura)
        dialogo.find('#txtEmpresaLectura')
                        .val(registro.empresa)
                        .attr('data-id', registro.empresalectura)
                        .removeAttr('disabled');
        dialogo.find('#cboAnomalias').val(registro.idanomalia?registro.idanomalia:'-1');
        dialogo.find('#cboNovedades').val(registro.idnovedad?registro.idnovedad:'-1');
        dialogo.find('#cboEstado').val(registro.estado);
        dialogo.find('input:radio').each(function(i, radio){
            if($(radio).val() == registro.ejecutado){
                $(radio).prop('checked', true);
            }
        });
        that.dialogoActual = dialogo.dialogo({
            modal: true,
            width: 850,
            title: 'Editar Lectura',
            buttons: {
                Guardar: function() {
                    that.editarLectura();
                },
                Cancelar: function() {
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
    editarLectura: function() {
        var indiceRegistro = gestionarlecturaModelo.indiceRegistro;
        that.leerCamposDivAgregarLectura();
        var registroLeido = gestionarlecturaModelo.registroLeido;
        var encontrado = false;
        registroLeido.indiceRegistro = gestionarlecturaModelo.indiceRegistro;
        registroLeido.lecturaanterior = gestionarlecturaModelo.detallesLectura[indiceRegistro].lecturaanterior;
        registroLeido.iddetallelectura = gestionarlecturaModelo.detallesLectura[indiceRegistro].iddetallelectura;
        var ejecutado = $('#divAgregarLectura input[name="rbtnEjecutada"]:checked').val();
        if(ejecutado === 'S'){
            if(registroLeido.fechaejecuta === null) {
                __dom.lanzarAlerta('La fecha de ejecución es obligatoria', __app.mensajes.atencion);
                return;        
            }
            if(registroLeido.idnovedad === '-1'){
                __dom.lanzarAlerta('Debe seleccionar una novedad', __app.mensajes.atencion);
                return;
            }
        }
        if (!(registroLeido.iddetallelectura === '')) {
            registroLeido.accion = "A";
            if(registroLeido.fechaejecuta !== ''  && new Date(registroLeido.fechaprograma) > new Date(registroLeido.fechaejecuta)){
                __dom.lanzarAlerta('La fecha de ejecución debe ser mayor a la fecha de programación', __app.mensajes.atencion);
                return;
            }
        } else {
            registroLeido.accion = "I";
        }
        $.each(jsonGrabar, function(indice, objeto) {
            if (objeto.indiceRegistro === gestionarlecturaModelo.indiceRegistro) {
                that.jsonGrabarReplace(registroLeido, indice);
                encontrado = true;
                console.debug(registroLeido);
            }
        });
        if (!encontrado) {
            that.jsonGrabarPush(registroLeido);
        }
        gestionarlecturaModelo.detallesLectura[indiceRegistro] = registroLeido;
        that.llenarTablaDetallesLectura();
        that.dialogoActual.dialog('close');
    },
    
    /**
     * Elimina la lectura seleccionada en función de la existencia de dicho 
     * registro en la base de datos.
     * @returns {void}
     */
    eliminarRegistro: function() {
        var indiceRegistro = gestionarlecturaModelo.indiceRegistro;
        var detalleslectura = gestionarlecturaModelo.detallesLectura;
        var registro = {};

        //se pregunta si el registro a eliminar se encuentra al inicio de la tabla pero no es el registro del encabezado
        if ((indiceRegistro === 0) && (detalleslectura[0].iddetallelectura !== gestionarlecturaModelo.encabezado.idlecturaencabezado)) {
            if (detalleslectura[1]) {
                detalleslectura[1].lecturaanterior = gestionarlecturaModelo.encabezado.lecturaactual;
                detalleslectura[1].consumo = parseInt(detalleslectura[1].consumo) + parseInt(detalleslectura[0].consumo);
            }
            //se pregunta si el registro a eliminar no es el último ni el primero de la tabla
        } else if (detalleslectura.length !== (indiceRegistro + 1) && indiceRegistro !== 0) {
            detalleslectura[indiceRegistro + 1].lecturaanterior = detalleslectura[indiceRegistro - 1].lecturaactual;
            detalleslectura[indiceRegistro + 1].consumo = parseInt(detalleslectura[indiceRegistro + 1].consumo) + parseInt(detalleslectura[indiceRegistro].consumo);
        }
        //se elimina el registro existente en el jsonGrabar independientemente de si tenía la acción "I" o "A"
        for (var i = (jsonGrabar.length - 1); i >= 0; i--) {
            console.debug(indiceRegistro);
            if (jsonGrabar[i].indiceRegistro === gestionarlecturaModelo.indiceRegistro) {
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
        $.each(jsonGrabar, function(i, obj) {
            if (obj.indiceRegistro === gestionarlecturaModelo.indiceRegistro) {
                var registroActualizado = detalleslectura[indiceRegistro + 1];
                that.jsonGrabarReplace(registroActualizado, i);
            }
        });
        that.actualizarIndices();
        gestionarlecturaModelo.detallesLectura.splice(gestionarlecturaModelo.indiceRegistro, 1);
        that.llenarTablaDetallesLectura();
    },
    
    
    /**
     * Se actualizan todos los índices de los registros afectados por la eliminación 
     * en el jsonGrabar
     * @returns {void}
     */
    actualizarIndices: function() {
        $.each(jsonGrabar, function(i, obj) {
            if (obj.indiceRegistro > gestionarlecturaModelo.indiceRegistro) {
                jsonGrabar[i].indiceRegistro = (parseInt(obj.indiceRegistro) - 1);
            }
        });
    },
    
    /**
     * Registra la lectura en la tabla de detalles y en el jsonGrabar.
     * @returns {void}
     */
    guardarLectura: function() {
        gestionarlecturaModelo.indiceRegistro = (gestionarlecturaModelo.detallesLectura.length);
        var lecturaActual = $('#divAgregarLectura').find('#txtLecturaActual').val();
        var fechaProgramacion = $('#txtFechaProgramacion').val().trim();
        if (fechaProgramacion === '') {
            __dom.lanzarAlerta('Debe seleccionar la fecha de programación', __app.mensajes.atencion);
            return;
        }
        if (gestionarlecturaModelo.detallesLectura.length > 0) {
            var ultima = (gestionarlecturaModelo.detallesLectura.length - 1);
            gestionarlecturaModelo.lecturaAnterior = gestionarlecturaModelo.detallesLectura[ultima].lecturaactual;
        }else{
            gestionarlecturaModelo.lecturaAnterior = gestionarlecturaModelo.encabezado.lecturaactual;
        }
        gestionarlecturaModelo.lecturaActual = lecturaActual;
        that.leerCamposDivAgregarLectura();
        var registroLeido = gestionarlecturaModelo.registroLeido;
        registroLeido.accion = "I";
        registroLeido.indiceRegistro = gestionarlecturaModelo.indiceRegistro;
        gestionarlecturaModelo.detallesLectura.push(gestionarlecturaModelo.registroLeido);
        that.jsonGrabarPush(gestionarlecturaModelo.registroLeido);
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
    jsonGrabarPush: function(registro) {
        var clonObjeto = {};
        $.each(registro, function(llave, valor) {
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
    jsonGrabarReplace: function(registro, indice) {
        var clonObjeto = {};
        $.each(registro, function(llave, valor) {
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
    consultarHistorial: function() {
        var idsuscripcion = gestionarlecturaModelo.suscripcion.idsuscripcion;
        var fechainicial = $('#txtFechaInicial').val();
        var fechafinal = $('#txtFechaFinal').val();
        if (fechainicial === '' || fechafinal === '') {
            __dom.lanzarAlerta("Debe seleccionar un rango de fechas", __app.mensajes.atencion);
        } else {
            var data = {idsuscripcion: idsuscripcion, fechainicial: fechainicial, fechafinal: fechafinal};
            gestionarlecturaControl.consultarHistorial(data, that.onConsultarHistorialCompleto);
        }
    },
    
    /**
     * Consulta el arreglo de anomalías existentes.
     * * @returns {void}
     */
    consultarAnomalias: function() {
        gestionarlecturaControl.consultarAnomalias(that.onConsultarAnomaliasCompleto);
    },
    
    /**
     * Consulta el arreglo de novedades existentes.
     * * @returns {void}
     */
    consultarNovedades: function() {
        gestionarlecturaControl.consultarNovedades(that.onConsultarNovedadesCompleto);
    },
    
    /**
     * Función de callback para guardar el historial del medidor en el modelo
     * y llenar la tabla de historial a partir de la respuesta obtenida del servidor.
     * @param  {Object} data Respuesta del servidor al consultar el historial del 
     * medidor.
     * @returns {void}
     */
    onConsultarHistorialCompleto: function(data) {
        $('table#tblHistorialMedidor').empty()
        switch (data.codigoRespuesta) {
           case 0:
                __dom.lanzarAlerta('No se encontraron registros en el historial', __app.mensajes.atencion);
                break;
            case 1:
                gestionarlecturaModelo.historialMedidor = data.historico;
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
    onEliminarLectura: function() {
        gestionarlecturaModelo.indiceRegistro = parseInt($(this).parent().parent().attr('data-fila'));
        that.confirmarEliminar();
    },
    
    /**
     * Función de callback para llernar el combo de anomalías a partir de los
     * datos obtenidos de la consulta.
     * @param  {Object} data Respuesta del servidor al consultar las anomalías.
     * @returns {void}
     */
    onConsultarAnomaliasCompleto: function(data) {
        switch (data.codigoRespuesta) {
           case 0:
                __dom.lanzarAlerta('No se encontraron anomalías', __app.mensajes.atencion);
                break;
            case 1:
                var cboAnomalias = $('#cboAnomalias').empty();
                __dom.llenarCombo(cboAnomalias, data.anomalia,'id','nombre');
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
    onConsultarNovedadesCompleto: function(data) {
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta('No se encontraron novedades', __app.mensajes.atencion);
                break;
            case 1:
                var cmbNovedades = $('#cboNovedades').empty();
                __dom.llenarCombo(cmbNovedades, data.novedad,'id','nombre');
                cmbNovedades.val('-1');
                break;
        }
    },
    
    /**
     * Permite realizar la consulta del detalle del medidor a partir de su id.
     * @returns {void}
     */
    filtrarMedidor: function() {
        if (!gestionarlecturaModelo.suscripcion) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarSuscripcion, __app.mensajes.atencion);
            return;
        } else {
            var idmedidor = gestionarlecturaModelo.suscripcion.idpropiedad;
            gestionarlecturaControl.consultarDetalleMedidor({idmedidor: idmedidor}, that.consultarDetalleMedidorCompleto);
        }
    },
    
    /**
     * Función de callback para llernar la división que muestra el detalle del medidor.
     * @param  {Object} data Respuesta del servidor al consultar el detalle del medidor.
     * @returns {void}
     */
    consultarDetalleMedidorCompleto: function(data) {
        switch (parseInt(data.codigoRespuesta)) {
           case 0:
                that.dialogoActual.find('#spanMensaje').text(__app.mensajes.sinResultados).show();
                break;
            case 1:
                var medidor = gestionarlecturaModelo.medidor = data.propiedad[0];
                $('#txtIdMedidorEmergente').val(gestionarlecturaModelo.suscripcion.idmedidor);
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
    cargarAutocomplete: function() {

        __dom.configurarAutocomplete(
            '#txtEmpresaLectura', that.sourceAutoComplete,
             function(event, ui) {
                gestionarlecturaModelo.idEmpresaLectura = ui.item.idVal;
                $('#idEmpresaLectura').val(ui.item.idVal);
            },
            function() {
                gestionarlecturaModelo.idEmpresaLectura = undefined;
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
    sourceAutoComplete: function(request, response) {
        that.request = request;
        that.response = response;
        var datos = {};
        datos.nombre = request.term;
        gestionarlecturaControl.buscarEmpresaLectura(datos, that.mostrarResultado);
    },
    
    /**
     * Gestiona el arreglo de empresas que se obtuvo de la consulta para mostrarlo como
     * una lista de opciones en el combo correspondiente.
     * @param  {Object} data Respuesta del servidor al consultar las empresas.
     * @returns {void}
     */
    mostrarResultado: function(data) {
        if(data.codigoRespuesta === 1){
            var result = [];
            $.each(data.terceros, function(i, item) {
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
     * Realiza el guardado de la operación enviando el jsonGrabar como fuente
     * de información.
     * @returns {void}
     */
    guardarOperacion: function() {
        if(jsonGrabar.length >0 ){
            gestionarlecturaControl.guardarOperacion({datos: jsonGrabar}, 
                    that.guardarOperacionCompleto);
        }
    },
    
    /**
     * Función de callback para mostrar un mensaje de operación exitosa en caso
     * de lograr guardar.
     * @param  {Object} data Respuesta del servidor al guardar la operación.
     * @returns {void}
     */
    guardarOperacionCompleto: function(data) {
        switch (data.codigoRespuesta) {
           case 1:
                __dom.lanzarAlerta(__app.mensajes.tituloExito, __app.mensajes.registroExitoso);
                that.reiniciarProceso();
                break;
        }
    },
    /**
     * Borra el contenido de las variables temporales del modelo, limpia y establece 
     * todos los campos y tablas a su estado inicial.
     * @returns {void}
     */
    reiniciarProceso: function () {
        gestionarlecturaModelo = {};
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
    onRadioEjecutadaClick:function(){
        var radio = $(this);
        if(radio.val()==='S'){
            $('#cboEstado').val('E');
        }
    }

};
gestionarlecturaVista.init();