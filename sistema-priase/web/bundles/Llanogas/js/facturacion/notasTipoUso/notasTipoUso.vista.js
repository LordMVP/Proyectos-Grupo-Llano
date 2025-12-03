/**
 * @fileOverview Archivo de vista y control de notas por tipo de uso
 * @author appFuture
 * @requires notasTipoUso.control.js
 * @requires notasTipoUso.modelo.js
 * @version 1.0.0
 */
/**
 * Objeto que hace referencia al namespace notasVista
 * @type {Object}
 */
var that = null;
/** @namespace */
var notaVista = {
    /** Hace referencia al último dialogo abierto en la aplicación
     * @type {object}
     */
    dialogoActual: null,
    /** Inicializa el programa de notas automáticas, y asigna listeners a los controles
     * @returns {void}
     */
    init: function () {
        that = notaVista;
        that.configurarAutoComplete();
        __dom.configurarTextoNumerico('txtFiltroSus, #txtFiltroCodAnt');
        $('#btnBuscarSuscripcion').on('click', that.buscarSuscripcion);
        $('#btnBuscar').on('click', that.filtrarSuscripciones);
        $('#btnBuscarFactura').on('click', that.filtroFacturas);
        $('#btnAplicarNotas').on('click', that.aplicarNotas);
        $('#btnCancelar').on('click', that.confirmarCancelar);
        $('#btnProcesar').on('click', that.validarProcesar);
        that.cargarComboMeses();
        notaControl.consultarMotivos(that.onConsultarMotivosCompleto);
        notaControl.eliminarTablas();
    },
    /**
     * Carga los posibles meses a afectar en los combos de meses
     * @returns {void}
     */
    cargarComboMeses: function () {
        var combo = $('#cmbCantidadMeses');
        var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        // var date = new Date(); -- Se reemplaza fecha del cliente por fecha del servidor
        var date = __app.obtenerFechaSistema();
        var mes = date.getMonth();
        var id = 0;

        var contadorMeses = 5;
        var i = mes;
        while (contadorMeses >= 0) {
            combo.append($('<option>').val(id++).text(meses[i]));
            contadorMeses--;
            i = (i <= 0) ? meses.length - 1 : --i;
        }
    },
    /** Configura cajas de texto para funcionalidad de autocomplete 
     * @returns {void}
     **/
    configurarAutoComplete: function () {
        __dom.configurarAutocomplete(
                '#txtFiltroMunicipo', that.sourceAutoComplete,
                function (event, ui) {
                    notaModelo.municipio = ui.item.idVal;
                    $('input#txtFiltroMunicipo').attr('data-id', ui.item.idVal);
                },
                function () {
                    notaModelo.municipio = undefined;
                    $('input#txtFiltroMunicipo').removeAttr('data-id');
                }
        );
    },
    /** Realiza la petición AJAX para consultar municipos de los autocomplete 
     * @returns {void}
     */
    sourceAutoComplete: function (request, response) {
        that.request = request;
        that.response = response;
        var datos = {};
        if (request.term.trim() !== '') {
            datos.municipio = request.term;
            notaControl.consultarMunicipio(datos, that.mostrarResultado);
        }
    },
    /** Muestra el resultado de la consulta de los municipos en la lista desplegable.
     * @returns {void}
     */
    mostrarResultado: function (data) {
        if (data.codigoRespuesta === 1) {
            var result = [];
            $.each(data.municipios, function (i, item) {
                result.push({
                    label: item.municipio,
                    value: item.municipio,
                    idVal: item.idmunicipio
                });
            });
            that.response(result);
        }
    },
    /** Muestra cuadro de diálogo para la consulta de suscripciones
     * @returns {void}
     **/
    buscarSuscripcion: function () {
        var div = $('#camposBuscarSuscripcion');
        that.dialogoActual = div.dialogo({
            modal: true,
            width: 850,
            title: 'Buscar una suscripción'
        });
    },
    /** Valida la información del filtro y hace petición ajax para consultar las suscripciones que cumplan con los parámetros
     * @returns {void}
     **/
    filtrarSuscripciones: function () {
        var contenedor = $('#camposBuscarSuscripcion');
        contenedor.find('#spanMensaje').hide().text('');
        contenedor.find('.listaSeleccion').remove();
        var suscripcion = contenedor.find('#txtFiltroSus').val().trim();
        var documento = contenedor.find('#txtFiltroDoc').val().trim();
        var codanterior = contenedor.find('#txtFiltroCodAnt').val().trim();
        var municipio = contenedor.find('#txtFiltroMunicipo').attr('data-id');
        if (municipio === '' || $('#txtFiltroMunicipo').val().trim() === '') {
            contenedor.find('#spanMensaje').show().text(__app.mensajes.seleccionarMunicipio);
            contenedor.find('.listaSeleccion').remove();
            return;
        } else if (suscripcion === '' && documento === '' && codanterior === '') {
            contenedor.find('#spanMensaje').show().text(__app.mensajes.camposInvalidosFiltro);
            contenedor.find('.listaSeleccion').remove();
            return;
        }
        var data = {
            idmunicipio: municipio,
            idsuscripcion: suscripcion,
            cedula: documento,
            codigoanterior: codanterior
        };
        $('#tblFactura').empty();
        notaModelo.facturas = null;
        $('#btnAplicarNotas').attr('disabled', 'disabled');
        notaControl.consultarSuscripcion(data, that.onFiltrarSuscripcionCompleto);
    },
    /** Captura la respuesta del servidor cuando se consultan las suscripciones
     * en caso de que haya más de una suscripción posibilita la selección de alguna
     * @param {object} data - Respuesta del servidor con suscripciones con coincidencias
     * @returns {void}
     **/
    onFiltrarSuscripcionCompleto: function (data) {
        // that.limpiarFormulario();
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(__app.mensajes.sinResultados, __app.mensajes.atencion);
                break;
            case 1:
                var sus = null;
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
                        label.text('Tercero: ' + susc.nombretercero + ' - ' + susc.cedula
                                + ' - Suscripción: ' + susc.idsuscripcion
                                + ' - Cód Anterior: ' + susc.codigoanterior);
                        div.append(radio).append(label);
                        divSuscripciones.append(div);
                    });
                    var btn = $('<button>').text('Seleccionar').addClass('btnSimple');
                    btn.on('click', function () {
                        var suscSeleccionada = that.dialogoActual.find('input[name="radio_suscripciones"]:checked');
                        if (suscSeleccionada.length > 0) {
                            sus = notaModelo.suscripcion = data.suscripciones[parseInt(suscSeleccionada.attr('data-indice'))];
                            that.dialogoActual.find('#spanMensaje').hide();
                            that.dialogoActual.dialog('close');
                            divSuscripciones.remove();
                            that.cargarCabecera(sus);
                        } else {
                            that.dialogoActual.find('#spanMensaje').text(__app.mensajes.seleccionarOpcion).show();
                        }
                    });
                    divSuscripciones.insertAfter(that.dialogoActual.find('#spanMensaje'));
                    divSuscripciones.append(btn);
                } else {
                    sus = notaModelo.suscripcion = data.suscripciones[0];
                    that.dialogoActual.find('#spanMensaje').hide();
                    that.dialogoActual.dialog('close');
                    that.cargarCabecera(sus);
                }
                break;
        }
    },
    /** Muestra la información de la suscripción elegida en el filtro y hace petición ajax
     * para consultar las facturas de la suscripción
     * @param {object} sus - Información de la suscripción seleccionada
     * @returns {void}
     **/
    cargarCabecera: function (sus) {
        $('#txtSuscripcion').val(sus.idsuscripcion);
        $('#txtDocumento').val(sus.cedula);
        $('#txtNombre').val(sus.nombretercero);
        $('#txtCodAnterior').val(sus.codigoanterior);
        $('#txtSuscMunicipo').val(sus.municipio);
        $('#txtSuscBarrio').val(sus.barrio);
        $('#txtDireccion').val(sus.direccion);
        $('#txtTelefono').val(sus.telefonofijo);
        $('#txtCelular').val(sus.telefonocelular);
        $('#txtCiclo').val(sus.ciclo);
        $('#txtLiquidacion').val(sus.liquidacion).attr('data-id', sus.idliquidacion);
        $('#txtSuscTipoUso').val(sus.tipousosuscripcion).attr('data-id', sus.idtipousosuscripcion);
        //notaControl.consultarTipoDocumento({idsuscripcion: sus.idsuscripcion}, that.onConsultarTipoDocumento);
    },
    /** Valida la información del filtro y hace petición ajax para consultar las facturas 
     * @returns {void}
     **/
    filtroFacturas: function () {
        //Antes se consultaba por documento y otros parámetros (Ver historial si se necesita)
        if (!!notaModelo.suscripcion) {
            var id = notaModelo.suscripcion.idsuscripcion;
            var datos = {
                idsuscripcion: id
                        //tipouso: $('#txtSuscTipoUso').attr('data-id')
            };
            $('#btnAplicarNotas').attr('disabled', 'disabled');
            notaControl.consultarFacturas(datos, that.onFiltrarFacturasCompleto);
        } else {
            __dom.lanzarAlerta(__app.mensajes.seleccionarSuscripcion, __app.mensajes.atencion);
        }
    },
    /** Captura la respuesta del servidor cuando se consultan facturas 
     * @param {object} data - Facturas para posible afectación
     * @returns {void}
     **/
    onFiltrarFacturasCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                $('#pMensajeFacturas').text('No se encontraron facturas');
                break;
            case 1:
                notaModelo.facturas = data.facturas;
                var tblFacturas = $('#tblFactura').empty();
                fillTable('tblFactura', 'formatoFactura', data.facturas, 'Facturas a afectar');
                tblFacturas.find('tbody td[header="thVerificar"] button').on('click', that.verificarFactura);
                //vuelve a seleccionar los objetos que ya estaban seleccionados
                //tblFacturas.find('tbody tr td[header="thVerificar"] button:not(:disabled)').parent().parent().find('td:first input:checkbox').click();

                $('#divFacturas').show();
                notaModelo.liquidacion = $('#cmbLiquidacion').val();
                /*notaControl.consultarConcepto(
                 {idliquidacion: notaModelo.liquidacion, tipo: 'D'},
                 that.onConsultarConcepto);*/
                that.dialogoActual.dialog('close');
                break;
        }
    },

    /**
     * Valida las facturas y solicita una confirmación antes de procesar las notas.
     * @returns {void} 
     */
    validarProcesar: function () {
        if (!notaModelo.facturas || notaModelo.facturas.length === 0) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarFacturas, __app.mensajes.atencion);
            return;
        }

        __dom.lanzarAlerta('Esto procesará las notas ¿Desea continuar?', __app.mensajes.atencion, that.procesarNotas, true);
    },

    /**
     * Invoca a la solicitud de procesar las notas
     * @returns {void} 
     */
    procesarNotas: function () {
        var data = {
            idfactura: notaModelo.facturas[0].idfactura,
            idsuscripcion: notaModelo.suscripcion.idsuscripcion
        };

        notaControl.procesarFacturas(data, that.onProcesarNotasCompleto);
    },

    /**
     * Se ejecuta cuando se terminan de procesar las notas, y muestra el resultado según la respuesta del servidor
     * @param  {Object} data Respuesta del servidor
     * @returns {void}      
     */
    onProcesarNotasCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case -1:
                __dom.lanzarAlerta(data.mensaje || data.mensajeError, __app.mensajes.atencion);
                break;
            case 0:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                break;
            case 1:
                notaModelo.procesados = true;
                $('#btnAplicarNotas').removeAttr('disabled');
                notaModelo.conceptosVerficar = data.listadetalles;
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                $('#tblFactura tr td[header="thVerificar"] button').removeAttr('disabled');
                break;
        }
    },

    /**
     * Verifica que haya notas procesadas y muestra un diálogo para seleccionar los motivos de las notas.
     * @returns {void} 
     */
    aplicarNotas: function () {
        if(!notaModelo.procesados){
            __dom.lanzarAlerta('No se han procesado las facturas, intente nuevamente.', __app.mensajes.atencion);
            return;
        }
        var dialogo = $('#divDialogoMotivos').dialogo({
            modal: true,
            width: 450,
            closeOnEscape: false,
            dialogClass: "noclose",
            title: 'Mótivos de las notas',
            buttons: {
                Aceptar: that.aceptarAplicacionNotas,
                Cancelar: function () {
                    dialogo.dialog('close');
                }
            }
        });
    },

    /**
     * Valida que se haya seleccionado un motivo y un comentario para las notas y solicita al servidor la aplicación de las notas
     * @returns {void} 
     */
    aceptarAplicacionNotas: function () {
        var cmbMotivo = $('#cmbMotivo');
        var txtComentarios = $('#txtComentarios');
        if (cmbMotivo.val() === '-1' || txtComentarios.val().trim() === '') {
            __dom.lanzarAlerta('Debe seleccionar un mótivo y agregar al menos un comentario.', __app.mensajes.atencion);
            return;
        }
        var infoEnviar = {
            idmotivo: cmbMotivo.val(), 
            comentario: txtComentarios.val(),
            idfactura: notaModelo.facturas[0].idfactura,
            idsuscripcion: notaModelo.suscripcion.idsuscripcion
        };
        notaControl.aplicarNotas(infoEnviar, that.onAplicarNotasCompleto);
    },

    /**
     * Se ejecuta cuando se han terminado de aplicar las notas y muestra el resultado
     * @param  {Objet} data Respuesta del servidor
     * @returns {void}      
     */
    onAplicarNotasCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 1:
                var fxRecargar = function () {
                    window.location.reload();
                };
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion, fxRecargar, null, fxRecargar);
                return;
                break;
            case -1:
                __dom.lanzarAlerta("Error al aplicar las notas", __app.mensajes.atencion);
                break;
        }
    },

    /**
     * Configura el evento click del botón de ver detalles de la factura
     * @param  {Object} val     Parámetro no usado, NO borrar
     * @param  {Object} td      Celda donde estará el botón, parámetro no usado, NO borrar
     * @param  {Object} factura Objeto con la información de la factura.
     * @returns {Object}         El nuevo botón que se crea para ver los detalles.
     */
    validarTdDetalle: function (val, td, factura) {
        var btn = $('<button>').addClass('tblBtn');
        btn.attr('data-id', factura.idfactura).text('Detalles');
        btn.on('click', that.consultarDetallesFactura);
        return btn;
    },

    /**
     * Construye un botón para verificar la factura selecionada.
     * @param  {Object} val     parámetro no usado, No borrar
     * @param  {Object} td      Parámetro no usado, No borrar
     * @param  {Object} factura Informació de la factura
     * @returns {Óbject}         Botón que se construye
     */
    validarTdVerificar: function (val, td, factura) {
        var btn = $('<button>').addClass('tblBtn');
        btn.attr('data-id', factura.idfactura).text('Verificar');
        if (factura.procesada) {
            btn.on('click', that.verificarFactura);
        } else {
            btn.attr('disabled', 'disabled');
        }
        return btn;
    },

    /**
     * Consulta los detalles de la factura seleccionada
     * @returns {void} 
     */
    consultarDetallesFactura: function () {
        var conceptos = notaModelo.conceptos;
        var idFactura = $(this).attr('data-id');

        if (!conceptos || conceptos.length === 0) {
            notaControl.consultarDetallesFacturas({idfactura: idFactura}, that.onConsultarDetalleFacturaCompleto);
        } else {
            that.mostrarTablaConceptos(conceptos, idFactura);
        }
    },

    /**
     * Muestra un diálogo con la información de los conceptos de la factura seleccionada.
     * @param  {Array} conceptos Arreglo de conceptos que se van a mostrar
     * @param  {String} idfactura Número de la factura
     * @param  {Object} formato   Formato para llenar la tabla de conceptos
     * @returns {void}           
     */
    mostrarTablaConceptos: function (conceptos, idfactura, formato) {
        if (!formato) {
            formato = 'formatoConceptos';
        }
        fillTable('tblConceptosProcesados', formato, conceptos, 'Conceptos de la factura ' + idfactura);
        $('#divDialogoConceptos').dialogo({
            modal: true,
            width: 850,
            title: 'Detalles de la factura ' + idfactura,
            buttons: {
                'Aceptar': function () {
                    $(this).dialog('close');
                }
            }
        });
    },

    /**
     * Verifica que la factura tenga conceptos por verificar y los muestra en una tabla.
     * @returns {void} 
     */
    verificarFactura: function () {
        var btn = $(this);
        var idFactura = btn.attr('data-id');
        var conceptos = notaModelo.conceptosVerficar;

        if (conceptos && conceptos.length > 0) {
            that.mostrarTablaConceptos(conceptos, idFactura, 'formatoConceptosProcesados');
            //notaControl.verificarFactura({idfactura: idFactura}, that.onVerificarFacturaCompleto);
        }else{
            __dom.lanzarAlerta('No se encontraron conceptos procesados, intente nuevamente', __app.mensajes.atencion);
        }
    },

    /**
     * Se ejecuta cuando se terminan de consultar los detalles de una factura y muestra la tabla de conceptos.
     * @param  {Object} data Respuesta del servidor
     * @returns {void}      
     */
    onConsultarDetalleFacturaCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                break;
            case 1:
                notaModelo.conceptos = data.conceptos;
                var idfactura = data.conceptos[0].idfactura
                that.mostrarTablaConceptos(data.conceptos, idfactura);
                break;
        }
    },

    /**
     * Se ejecuta cuando termina de cargar los motivos y llena el combo de motivos.
     * @param  {Object} data Respuesta del servidor
     * @returns {void}      
     */
    onConsultarMotivosCompleto: function (data) {
        var cmbMotivos = $('#cmbMotivo').empty();
        switch (data.codigoRespuesta) {
            case 0:
                __dom.llenarCombo(cmbMotivo, [{idmotivo: -1, nombre: 'No hay motivos para asignar'}], 'idmotivo', 'nombre');
                break;
            case 1:
                __dom.llenarCombo(cmbMotivo, data.motivos, 'idmotivo', 'nombre');
                break;
        }
    },

    /**
     * Verifiva el tipo de operación y retorna un texto más claro
     * @param  {String} operacion NC, ND, NS
     * @returns {String}           Retorna el texto respectivo a la abreviatura.
     */
    verificarOperacionConcepto: function (operacion) {
        switch (operacion) {
            case 'NC':
                return 'Nota Crédito';
            case 'ND':
                return 'Nota Débito';
            case 'NS':
                return 'Nota saldo a favor - Anticipo';
            default:
                return operacion;
        }
    },

    /**
     * Solicita la confirmación para cancelar el trabajo que se ha hecho en la interfaz y recarga la página.
     * @returns {void} 
     */
    confirmarCancelar: function(){
        if(notaModelo.suscripcion){
            var fxRecargar = function(){
                location.reload();
            }
            __dom.lanzarAlerta('Se cancelará el proceso actual ¿Desea continuar?', 'Advertencia', fxRecargar, true);
        }
    }

};
notaVista.init();