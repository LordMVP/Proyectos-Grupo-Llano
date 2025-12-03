


var that = null;

/** @namespace */
var eliminarfacturaVista = {
    /**
     * hace referencia al último dialogo abierto en la aplicación
     * @type {object}
     */
    dialogoActual: null,
   
    /**
     * inicializa el programa de eliminarfactura
     * @returns {void}
     */
    init: function () {
        that = this;
        __app.vistaActual = eliminarfacturaVista;
        __app.controlActual = eliminarfacturaControl;
        var comandos = $('div#divComandos');
        comandos.find('#btnNuevo').on('click', that.onNuevoClic);
        comandos.find('#btnGrabar').on('click', that.guardarEliminaFactura);
        comandos.find('#btnCancelar').on('click', that.cancelarAbono); 
        
        $('#btnCargarFacturas').on('click', that.cargarFacturas);
        __dom.configurarTextoNumerico('txtFiltroSus, #txtFiltroDoc, #txtFiltroCodAnt');
    },
   
    /**
     * Se ejecuta en el evento clic del botón Nuevo, y valida si ya existen suscripciones para limpiar los datos del formulario.
     * @returns {void}
     */
    onNuevoClic: function () {
        if (eliminarfacturaModel.suscripcion && eliminarfacturaModel.resumenRecaudo === null) {
            $('div#divConfirmCancelar').dialogo({
                resizable: false,
                heigth: 140,
                modal: true,
                title: 'Cancelar la Operación',
                buttons: {
                    'Sí': function () {
                        $(this).dialog('close');
                        that.limpiarFormulario();
                        mostrarFiltroSuscriptores('div#camposBuscarSuscripcion', that.filtrarSuscriptor);
                    }, Cancelar: function () {
                        $(this).dialog('close');
                    }
                }
            });
        } else {
            mostrarFiltroSuscriptores('div#camposBuscarSuscripcion', that.filtrarSuscriptor);
            that.limpiarFormulario();
        }
    },
    /**
     * 
     * 
     * @returns {void}
     */
    guardarEliminaFactura: function () {
        if (!eliminarfacturaModel.suscripcion) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarSuscripcion, __app.mensajes.atencion);
            return;
        }
        if (!eliminarfacturaModel.facturas || $('#tblFacturas tbody tr td[header="thCheckFactura"] input:checked').length === 0) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarFacturas, __app.mensajes.atencion);
            return;
        }
        $('#btnGrabar').attr('disabled', 'disabled');
        var facturas = [];
        for (var i = 0; i < eliminarfacturaModel.facturas.length; i++) {
                facturas.push(eliminarfacturaModel.facturas[i].idfactura);

        }
        eliminarfacturaControl.actualizaFacturasuscripcion( {factura:facturas}, that.onGuardarCompleto);
 //$('#btnGrabar').hide();
    //                that.recargar();
      
    },
    /**
     * Captura la respuesta enviada por el servidor, cuando se guarda la información del recaudo
     * @param  {object} data - El resultado de la petición ajax para guardar la información del abono
     * @returns {void}
     */
    onGuardarCompleto: function (data) {
        
        switch (data.codigoRespuesta) {
            case 1:
                __dom.lanzarAlerta(data.mensajeRespuesta, 'Información', function () {
                    
                    $('#btnGrabar').hide();
                    that.recargar();
                });
                break;
                break;
            case -1:
            case 0:
                __dom.lanzarAlerta(__app.mensajes.errorGuardarRecaudo, __app.mensaje.atencion);
                break;
        }
    },
    
    recargar: function ()
    {
        location.reload();
    },
    /**
     * Valida la información del filtro de suscripciones y envía la solicitud al servidor
     * @returns {void}
     */
    filtrarSuscriptor: function () {
        var filtro = $('div#camposBuscarSuscripcion');
        var suscripcion = filtro.find('#txtFiltroSus').val().trim();
        var doc = filtro.find('#txtFiltroDoc').val().trim();
        var codAnt = filtro.find('#txtFiltroCodAnt').val().trim();
        var suscripciones =  $('#txtSuscripciones').val();
        if (suscripcion == '' && doc == '' && codAnt == '' && suscripciones == '' ) {
            filtro.find('#spanMensaje').text(__app.mensajes.camposInvalidosFiltro).show();
            return;
        }
        var data = {idsuscripcion: suscripcion, documento: doc, codanterior: codAnt, suscripcionesvarias:suscripciones};
        eliminarfacturaControl.consultarSuscriptor(data, that.consultaSuscripcionCompleto);

    },
    /** Captura la respuesta enviada por el servidor tras la solicitud del suscriptor
     * si hay más de un suscriptor en la respuesta se muestra la lista de suscriptores para que el usuario
     * seleccione uno, de lo contrario, se toma el únique que llega en la respuesta
     * @param {Object} data - Información enviada por el servidor de las suscripciones que coinciden con los filtros
     */
    consultaSuscripcionCompleto: function (data) {
        that.limpiarFormulario();
        switch (parseInt(data.codigoRespuesta)) {
            case 0:
                that.dialogoActual.find('#spanMensaje').text(__app.mensajes.sinResultados).show();
                break;
            case 1:
                var sus = null;

                if (data.suscripciones.length > 50) {
                    mostrarListaSuscripciones(data.suscripciones, that.dialogoActual, eliminarfacturaModel, that.cargarCabecera);
                } else {
                    eliminarfacturaModel.suscripcion = data.suscripciones;
                    sus = data.suscripciones[0];
                    that.dialogoActual.find('#spanMensaje').hide();
                    that.dialogoActual.dialog('close');
                    that.cargarCabecera(sus);
                }
                break;
        }
    },
    /**
     * Carga la cabecera con la información del suscriotor seleccionado del filtro
     * @param  {object} sus - Es un objeto JSON con la información de la suscripción seleccionada para hacer el abono
     * @returns {void}
     */
    cargarCabecera: function (sus) {
        var cabecera = $('div#divCabecera');
        cabecera.find('#txtIdSuscriptor').val(sus.idsuscriptor);
        cabecera.find('#txtNombre').val(sus.nombretercero);
        cabecera.find('#txtDocumento').val(sus.cedula);
        cabecera.find('#txtConvenio').val(sus.nombreconvenio).attr('data-id', sus.idconvenio);
        $('div#divFacturas').hide();
        var tbl = fillTable("tblSuscripciones", "formatoSuscripciones", "eliminarfacturaModel.suscripcion", "Suscripciones");
        tbl.find('td[header="thSeleccion"] input[type="checkbox"]').on('change', that.onSuscripcionSeleccionada);
        $('div#divDetalles').show('fast');
    },
     /**
     * Carga las facturas con saldo de la suscripción seleccionada
     * @returns {void}
     */
    cargarFacturas: function () {
        //si existe la suscripción dentro del modelo se consultan las facturas
        if (!!eliminarfacturaModel.suscripcion) {
            var suscripciones = [];
            for(var i=0; i < eliminarfacturaModel.suscripcion.length; i++ ){
                suscripciones.push(eliminarfacturaModel.suscripcion[i].idsuscripcion);
            }
            eliminarfacturaControl.consultarFacturas({suscripcion: suscripciones}, that.cargarFacturasCompleto);
        } else {
            __dom.lanzarAlerta(__app.mensajes.seleccionarSuscripcion, __app.mensajes.alerta);
        }
    },
   
    /**
     * Valida la respuesta del servidor a consultar las facturas de la suscripción y carga la tabla de facturas
     * @param  {object} respuesta  El objeto con la respuesta del servidor, que tiene la lista de facturas con saldo de la suscripción consultada
     * @returns {void}
     */
    cargarFacturasCompleto: function (respuesta) {
        switch (parseInt(respuesta.codigoRespuesta)) {
            case 1:
                eliminarfacturaModel.facturas = respuesta.facturas;
               
            
                that.cargarTablasFacturas();
                $('#btnFormaPago').attr('disabled', false);
                break;
            case 0:
                eliminarfacturaModel.facturas = [];
                $('div#divFacturas')
                        .hide()
                        .find('#txtSaldoActual')
                        .val('');
                __dom.lanzarAlerta(respuesta.mensajeError, __app.mensajes.atencion);
                break;
        }
    },
    /**
     * Pregunta al usuario si desea cancelar la operación actual
     * si el usuario desea cancelar, se limpia el formulario y se actualiza el modelo
     * @returns {void}
     */
    cancelarAbono: function () {
        if (!!eliminarfacturaModel.suscripcion) {
            $('div#divConfirmCancelar').dialogo({
                resizable: false,
                heigth: 140,
                modal: true,
                title: 'Cancelar la Operación',
                buttons: {
                    "Aceptar": function () {
                        $(this).dialog('close');
                        that.limpiarFormulario();
                        that.cancelarFormasPago();
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
        $('#btnGrabar').show().removeAttr('disabled');
        $('#btnImprimir').removeAttr('disabled').hide();
        
        var cabecera = $('div#divCabecera');
        cabecera.find('input[type="text"]').val('');
        var detalles = $('#divDetalles');
        detalles.hide();
        detalles.find('table')
                .removeAttr('data')
                .removeAttr('format')
                .html('');
        eliminarfacturaModel = {
            suscriptor: null,
            suscripciones: null,
            facturas: null
            
            
        };
        
        

        if (!!formatoFacturas.thead[9]) {
            formatoFacturas.thead.pop();
        }

        
    },
  
    /**
     * Función que confirma si desea cerrar las formas de pago y eliminarlas
     * @param {Event} e - Evento que dispara la función
     * @param {boolean} cerrar - Valida si quiere ver confirmación
     */
    funcionCerrarDialogo: function (e, cerrar) {
        if (cerrar === true) {
            that.dialogoActual.dialog('destroy');
            return;
        }
        __app.cancelarEvento(e);
        __dom.lanzarAlerta(
                __app.mensajes.confirmaCancelarFormasPago,
                __app.mensajes.tituloConfirmacion,
                function () { //en caso de aceptar
                    that.dialogoActual.dialog('destroy');
                    that.cancelarFormasPago();
                    that.calcularAbono();
                },
                function () {  return; }
        );
    },
   
  
    /**
     * Carga la tabla de facturas de las suscripciones selecciondas
     * @returns {void}
     */
    cargarTablasFacturas: function () {
        var tblFacturas = fillTable("tblFacturas", "formatoFacturas", "eliminarfacturaModel.facturas", "Facturas");
        $('div#divFacturas').show().find('#txtSaldoActual').val(calcularSaldoActual(eliminarfacturaModel));
    },

    

    /**
     * Valida si la factura está seleccionada o no, para volver a contabilizar los valores del abono de acuerdo a los conceptos de la factura.
     * @param  {Event} e El evento clic que se dispara sobre el checkbox de cada factura de la tabla de facturas.
     * @returns {void}
     */
    validarFacturaSeleccionada:function(e){
        
        var check = $(this);
        var fila = check.parent().parent();
        
        var indiceFactura = parseInt( fila.attr('data-fila') );
        var factura = eliminarfacturaModel.facturas[indiceFactura];
        factura.seleccionada = check.is(':checked');
        
        that.actualizarSaldoFacturasSeleccionadas();

    },

    /**
     * Actualiza el campo de texto que muestra la suma de las facturas seleccionadas
     * @returns {void}
     */
    actualizarSaldoFacturasSeleccionadas:function(){
        $('#txtTotalFacturasSeleccionadas').val(eliminarfacturaControl.calcularTotalFacturasSeleccionadas());
    }

};

eliminarfacturaVista.init();
