/**
 * @fileOverview Archivo de vista de cartera castigada
 * @author angelicaGomez
 * @requires carteraCastigadaSuscripcion.control.js
 * @requires carteraCastigadaSuscripcion.modelo.js
 * @version 1.0.0
 */

/**
 * Objeto que hace referencia al namespace carteraVista
 * @type {object}
 */
 var that = null;
 /** @namespace */
 var carteraVista = {
     dialogoActual : null,
 	/**
    * Inicializa el prorama de cartera castigada y agrega listeners a controles
    * @returns {void}
    **/
    init : function(){
        that = carteraVista;
        $('#btnBuscarSuscripcion').on('click', that.mostrarBuscar);
        $('#btnProcesarCartera').on('click', that.confirmarProcesar);
     },
    /** Abre cuadro de diálogo con formulario para buscar una suscripción
    * @returns {void}
    **/
     mostrarBuscar : function(){
     	that.dialogoActual = $('#camposBuscarSuscripcion').dialogo({
     		modal: true,
            width: 400,
            title: 'Buscar suscripción',
            buttons: {
                Buscar : that.filtrarSuscriptor,
                Cancelar: function() {
                    that.dialogoActual.dialog('close');
                }
            }
     	});
     }, 
     /** Valida la información del filtro de suscripción y envía la solicitud al servidor
     * @returns {void}
     */
    filtrarSuscriptor: function() {
        var filtro = $('div#camposBuscarSuscripcion');
        var suscripcion = filtro.find('#txtSuscripcionFiltro').val().trim();
        var codAnt = filtro.find('#txtCodTercero').val().trim();
        if (suscripcion === '' && codAnt === '') {
            filtro.find('#spanMensaje').text(__app.mensajes.camposInvalidosFiltro).show();
        } else {
            var data = {
                idsuscripcion: suscripcion,
                codigoanterior: codAnt
            };
            carteraControl.consultarSuscripciones(data, that.consultaSuscripcionCompleto);
        }
    },

    /** Captura la respuesta enviada por el servidor, cuando se consultan las suscripciones.
     * En caso de llegar varias suscripciones posibilita la selección de una.
     * @param  {object} data - El resultado de la petición ajax con las suscripciones que coinciden
     * @returns {void}
     */
    consultaSuscripcionCompleto: function(data) {
        $('#spanMensaje').text('');
        $('#divError').hide();
        switch (data.codigoRespuesta) {
            case 0:
                $('#spanMensaje').text(data.mensaje);
                break;
            case 1:
                carteraModelo.suscripcion = data.suscripcion[0];
                var sus = data.suscripcion[0];
                $('#txtSuscripcion').val(sus.idsuscripcion);
                $('#txtDocumento').val(sus.documentotercero);
                $('#txtNombre').val(sus.nombretercero);
                $('#txtCodAnterior').val(sus.codigoanterior);
                $('#txtMunicipio').val(sus.municipio);
                $('#txtBarrio').val(sus.barrio);
                $('#txtDireccion').val(sus.direccion);
                $('#txtRuta').val(sus.ruta);
                $('#txtMedidor').val(sus.numeropropiedad);
                $('#txtTelefono').val(sus.telefonofijo);
                $('#txtCelular').val(sus.telefonocelular);
                that.dialogoActual.dialog('close');
                break;
        }
    },

    /** Confirma si el usuario desea castigar la cartera
     * @returns {void}
     */
    confirmarProcesar: function(){
        if(!carteraModelo.suscripcion){
            __dom.lanzarAlerta(__app.mensajes.seleccionarSuscripcion, __app.mensajes.atencion);
            return;
        }


        carteraControl.validarSuscripcion({idsuscripcion:carteraModelo.suscripcion.idsuscripcion}, function(data){
            var mensaje = ''
            switch(data.codigoRespuesta){
                case 0:
                    mensaje = 'Esta suscripción tiene sus pagos al día, ¿realmente desea castigarla?';
                break;
                case 1:
                    mensaje = 'Se procederá a castigar la suscripción ¿confirma que desea continuar?';
                break;
            }

            __dom.lanzarAlerta(mensaje, 
                  __app.mensajes.atencion, 
                  that.procesarCartera, 
                  function(){return;}
            );

            /*
            that.dialogoActual = $('#divConfirmarProcesar').dialogo({
                modal: true,
                width: 550,
                title: 'Confirmar proceso',
                buttons: {
                    Aceptar : function(){
                        __dom.lanzarAlerta(mensaje,
                                            __app.mensajes.atencion, 
                                            that.procesarCartera, 
                                            true);
                        that.dialogoActual.dialog('close');
                    },
                    Cancelar: function() {
                        that.dialogoActual.dialog('close');
                    }
                }
            });
            */    
        });


        
    },
    /**
     * Hace petición ajax para ejecutar proceso de castigar cartera por suscripción
     * @returns {void}
     */
    procesarCartera : function(){
        $('#divError').hide();
        var ciclo = $('#cboCiclo').val();
        carteraControl.procesarCartera({ idsuscripcion: carteraModelo.suscripcion.idsuscripcion }, 
                                      that.onProcesarCompleto);
    },
    
    /**
     * Recibe la respuesta del servidor cuando se ejecuta el proceso, y visualiza la información en la tabla
     * @param {array} data- Respuesta del servidor con suscripciones con facturas con saldos
     * @returns {void}
     */
    onProcesarCompleto : function(data){
      switch (data.codigoRespuesta) {
        case 0:
            var sus = data.suscripcionessaldo;
            if(!!sus && sus.length > 0){
                carteraModelo.suscripcionessaldo = sus;
                fillTable("tblSuscripciones", "formatoSuscripcionSaldo", "carteraModelo.suscripcionessaldo", "");
                $('#pMensajeError').text(data.mensaje /*' No se pudo procesar/castigar  porque existen las siguientes suscripciones con saldo'*/);
                $('#divError').show();
            }
          break;
        case 1:
          __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion,
            function(){
                location.reload();
            });
          
          break;
      }
    }
 };
 carteraVista.init();
