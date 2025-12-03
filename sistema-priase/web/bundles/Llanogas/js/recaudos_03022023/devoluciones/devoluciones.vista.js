/**
 * @fileOverview Archivo de vista y control de Devoluciones
 * @author svanegas
 * @requires recaudos.js
 * @requires devoluciones.control.js
 * @requires devoluciones.modelo.js
 * @version 1.0.0
 */

/**
 * Objeto que hace referencia al namespace devolucionesVista
 * @type {Object}
 */
var that = null;


/** @namespace */
var devolucionesVista = {

	/**
     * Hace referencia al último dialogo abierto en la aplicación
     * @type {object}
     */
    dialogoActual: null,

    /**
     * Inicializa el programa de devoluciones
     * @returns {void}
     */
    init: function () {
    	that = this;
        var comandos = $('div#divComandos');
        comandos.find('#btnNuevo').on('click', function(){
            mostrarFiltroSuscriptores('div#camposBuscarSuscripcion', that.filtrarSuscriptor);
        });
        comandos.find('#btnGrabar').on('click', that.validarDevolucion);
        comandos.find('#btnCancelar').on('click', that.cancelarDevolucion);
    },
  
    /**
     * Valida la información del filtro de suscripciones y envía la solicitud al servidor para consultar a un suscriptor
     * @returns {void}
     */
    filtrarSuscriptor:function(){
		var filtro = $('div#camposBuscarSuscripcion');
        var suscripcion = filtro.find('#txtFiltroSus').val().trim();
        var doc = filtro.find('#txtFiltroDoc').val().trim();
        var codAnt = filtro.find('#txtFiltroCodAnt').val().trim();
        if (suscripcion == '' && doc == '' && codAnt == '') {
            filtro.find('#spanMensaje').text(__app.mensajes.camposInvalidosFiltro).show();
            return;
        }
        var data = {idsuscripcion: suscripcion, documento: doc, codanterior: codAnt};
        devolucionesControl.consultarSuscriptor(data, that.consultaSuscripcionCompleto);
    },

    /**
     * Función que se ejecuta cuando se termina de consultar suscripciones con devoluciones
     * @param  {Object} data Objeto con el resultado de la consulta de suscripciones
     * @returns {void}
     */
    consultaSuscripcionCompleto:function(data){
    	that.limpiarFormulario();
        switch (parseInt(data.codigoRespuesta)) {
            case 0:
                that.dialogoActual.find('#spanMensaje').text(__app.mensajes.sinResultados).show();
                break;
            case 1:
                var sus = null;
                if (data.suscripciones.length > 1) {
                    mostrarListaSuscripciones(data.suscripciones, that.dialogoActual, devolucionesModelo, that.cargarCabecera);
                } else {
                    sus = devolucionesModelo.suscripcion = data.suscripciones[0];
                    that.dialogoActual.find('#spanMensaje').hide();
                    that.dialogoActual.dialog('close');
                    that.cargarCabecera(sus);
                }
                break;
        }	
    },
    /**
     * Carga la información de la suscripción seleccionada y hace petición ajax para 
     * consultar las respectivas devoluciones
     * @returns {void}
     */
    cargarCabecera:function(sus){
    	var cabecera = $('div#divCabecera');
        cabecera.find('#txtIdSuscriptor').val(sus.idsuscriptor);
        cabecera.find('#txtNombre').val(sus.nombrecompleto);
        cabecera.find('#txtCodigoAnterior').val(sus.codanterior);
        cabecera.find('#txtSuscripcion').val(sus.suscripcion);
        cabecera.find('#txtIdSuscripcion').val(sus.idsuscripcion);
        cabecera.find('#txtDocumento').val(sus.cedula);
        devolucionesModelo.suscripcion = [sus];
        devolucionesControl.consultarDevoluciones({idsuscripcion:sus.idsuscripcion}, that.consultarDevolucionesCompleto);
    },
    /** Captura la respuesta del servidor cuando se consultan las devoluciones de una suscripción
     * @param {object} data - Respuesta del servidor con devoluciones de la suscripción
     * @returns {void}
     **/
    consultarDevolucionesCompleto:function(data){
        switch (parseInt(data.codigoRespuesta)) {
            case 1:
                devolucionesModelo.devoluciones = data.devoluciones;
                var table = fillTable("tblDevoluciones", "formatoDevoluciones", "devolucionesModelo.devoluciones", "Devoluciones");
                table.find('td[header="thSeleccion"] input').on('click', that.validarSeleccionar);
                table.find('td[header="thVer"] input').on('click', that.consultarDetalleDevolucion).attr('disabled', true);
                var txtNuevoValor = table.find('td[header="thValorNuevo"] input');
                txtNuevoValor.attr('disabled', 'disabled');
                txtNuevoValor.val('');
                txtNuevoValor.on('blur', that.validarValorDevolucion);
               
                __dom.configurarTextoNumerico(txtNuevoValor);
                break;
            case 0:
                devolucionesModelo.devoluciones = [];
                __dom.lanzarAlerta('La suscripción no tiene recaudos consignados y contabilizados para devolver.', __app.mensajes.atencion);
                break;
        }
    },
    /** Valida valores maximos y minimos ingresado x usuario
     * @returns {void}
     */
    validarValorDevolucion: function (e) {
        
        var objeto = $(this);
        
        var tr = objeto.parent().parent();
        var valorMaximo = parseInt(tr.find('td[header="thValor"]').attr('data-valor'));
        var valorDevolucion = parseInt(tr.find('td[header="thValorNuevo"] input').val());        
        valorDevolucion = isNaN(valorDevolucion) ? 0 : valorDevolucion;
        console.log(valorDevolucion +' > '+ valorMaximo);
        if (valorDevolucion > valorMaximo) {
            tr.find('td[header="thValorNuevo"] input').val(valorMaximo).focus() ;
        } else if (valorDevolucion < 1) {        
           tr.find('td[header="thValorNuevo"] input').val(valorMaximo).focus();
        }
    },

    /** Se valida la selección/deselección de las devoluciones 
     * @returns {void}
     **/
    validarSeleccionar: function(){
        var check = $(this);
        var trSeleccionada = check.parent().parent();
        if (check.is(':checked')) {
            trSeleccionada.addClass('selected')
                    .find('td[header="thVer"] input').attr('disabled', false);
            trSeleccionada.find('td[header="thValorNuevo"] input').attr('disabled', false);
            trSeleccionada.find('td[header="thValorNuevo"] input').val(trSeleccionada.find('td[header="thValor"]').attr('data-valor'));
        } else {
            trSeleccionada.removeClass('selected')
                    .find('td[header="thVer"] input')
                         .attr('disabled', 'disabled');
            trSeleccionada.find('td[header="thValorNuevo"] input').attr('disabled', true).val('');                
        }
    },
    /** Hace petición ajax para consultar los detalles de una devolución
     * @returns {void}
     **/
    consultarDetalleDevolucion: function(){
        var _this = $(this);
        var tipo = devolucionesModelo.tipoProceso = _this.parent().attr('data-value');
        devolucionesControl.consultarDetalles({idrecaudofactura : _this.attr('data-id'),
                                               tipo: tipo}, that.onConsultarDetalleCompleto);
    },
    /** Captura la respuesta del servidor cuando se consulta detalles de una devolución
     * @param {object} data - Respuesta del servidor con información de dicha devolución
     * @returns {void} 
     **/
    onConsultarDetalleCompleto: function(data){
        switch(data.codigoRespuesta){
            case 0:
            break;
            case 1:
                if(devolucionesModelo.tipoProceso === "R"){
                    devolucionesModelo.recaudo = [data.devoluciones];
                    fillTable("tblDetalleRecaudo", "formatoDetalleRecaudo", "devolucionesModelo.recaudo", "Recaudos").show(); 
                    $('#tblDetalleFactura').hide();   
                }else if(devolucionesModelo.tipoProceso === "F"){
                    devolucionesModelo.factura = [data.devoluciones];
                    fillTable("tblDetalleFactura", "formatoDetalleFactura", "devolucionesModelo.factura", "Facturas").show();
                    $('#tblDetalleRecaudo').hide();
                }
                $('div#divDetallesDevolucionDialog').dialogo({
                    width: 750,
                    modal: true,
                    title: 'Detalles de devolución',
                    buttons: {
                        Aceptar: function () {
                            $(this).dialog("close");
                        }
                    }
                });

            break;
        }
    },
    /** Confirma y válida la información de la devolución(es) a grabar
     * @returns {void}
     **/
    validarDevolucion:function(){

        if (!devolucionesModelo.suscripcion) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarSuscripcion, __app.mensajes.atencion);
            return;
        }

        if (!devolucionesModelo.devoluciones) {
            __dom.lanzarAlerta(__app.mensajes.suscripcionSinDevoluciones, __app.mensajes.atencion);
            return;
        }
        var devolucionesSeleccionadas = $('#tblDevoluciones tbody tr.selected');
        if (devolucionesSeleccionadas.length===0) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarDevoluciones, __app.mensajes.atencion);
            return;
        }
        $('#pMensajeGrabar').text('');
        that.dialogoActual = $('#divDetallesDevolucion').dialogo({
                resizable: false,
                width: 400,
                modal: true,
                title: 'Información de la Devolución',
                buttons: {
                    "Aceptar": function () {
                        that.grabarDevolucion();
                    }, Cancelar: function () {
                         that.dialogoActual.dialog("close");
                    }
                }
            });
    },
    /** Hace petición ajax para grabar las devoluciones 
     * @returns {void}
     **/
    grabarDevolucion: function(){
        if ($('#cboMotivoNota').val()==='-1') {
            $('#pMensajeGrabar').text(__app.mensajes.seleccionarMotivo);
            return;    
        }

        if ($('#txtObservaciones').val()==='') {
            $('#pMensajeGrabar').text(__app.mensajes.escribirObservacion);
            return;
        }
        var peticion = {
            idmotivo:$('#cboMotivoNota').val(),
            comentario:$('#txtObservaciones').val(),            
            idsuscripcion: devolucionesModelo.suscripcion[0].idsuscripcion
        };
        var devolucionesSeleccionadas = $('#tblDevoluciones tbody tr.selected');
        var devoluciones = [];
        for (var i = 0; i < devolucionesSeleccionadas.length; i++) {
            var d = $(devolucionesSeleccionadas[i]);
            var indice = d.attr('data-fila');
            var devolucion = d.find('td[header="thValorNuevo"] input').val();
            var iddistribucion = d.find('td[header="thiddistribucion"]').val();
            
            devoluciones.push({
                proceso:devolucionesModelo.devoluciones[indice].proceso,
                idfacturarecaudo:devolucionesModelo.devoluciones[indice].idfacturarecaudo,
                version:devolucionesModelo.devoluciones[indice].version,
                vlrdevolucion : devolucion,
                codigodistribucion : devolucionesModelo.devoluciones[indice].iddistribucion,
            });
        };
        peticion.devoluciones = devoluciones;
         that.dialogoActual.dialog('close');
        devolucionesControl.grabarDevolucion(peticion, that.onGrabarCompleto);    
    },
    /** Captura la respuesta del servidor cuando se graban devoluciones
     * @param {object} data - Respuesta del servidor con notas generadas
     * @returns {void}
     **/
    onGrabarCompleto:function(data){
        switch(data.codigoRespuesta){
            case 1:
                var mensaje = "<br />.Se agregarón las siguientes notas: ";
                for (var i = 0; i < data.notas.length; i++) {
                    mensaje += data.notas[i].idnota+"\n";
                };

                __dom.lanzarAlerta(data.mensaje+mensaje, __app.mensajes.atencion);
                that.limpiarFormulario();
                break;
            case 0:
                devolucionesModelo.devoluciones = [];
                __dom.lanzarAlerta(__app.mensajes.suscripcionSinDevoluciones, __app.mensajes.atencion);
                break;
        }
    },
    /** Confirma si desea cancelar la devolución
     * @return{void} 
     **/
    cancelarDevolucion:function(){
        if(!!devolucionesModelo.suscripcion){
            $('div#divConfirmCancelar').dialogo({
                resizable: false,
                heigth: 140,
                modal: true,
                title: 'Cancelar la operación',
                buttons: {
                    "Sí": function () {
                        $(this).dialog('close');
                        that.limpiarFormulario();
                    }, Cancelar: function () {
                        $(this).dialog("close");
                    }
                }
            });
        }
    },

    /**
     * Limpia el formulario y elimina la información actual del recaudo y el suscriptor de la interfaz
     * @returns {void}
     */
    limpiarFormulario: function () {
        $('#camposBuscarSuscripcion').find('input:text').val('');

        var cabecera = $('div#divCabecera');
        cabecera.find('input[type="text"]').val('');
        $('#pMensajeGrabar').text('');
        $('#tblDevoluciones').html('');
        devolucionesModelo = {};
    },




};

devolucionesVista.init();