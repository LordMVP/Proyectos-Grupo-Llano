/**
 * @fileOverview Archivo de vista y control de condonar conceptos de factura
 * @author angelicaGomez
 * @requires condonarCartera.control.js
 * @requires condonarCartera.modelo.js
 * @version 1.0.0
 */
/**
 * Objeto que hace referencia al namespace condonarVista
 * @type {Object}
 */
var that = null;

/** @namespace */
var condonarVista = {
    /** Hace referencia al último dialogo abierto en la aplicación
     * @type {object}
     */
    dialogoActual: null,
    
    /**Inicializa el programa de condonar cartera castigada, y asigna listeners a los controles
     * @returns {void}
     */
    init: function () {
        that = condonarVista;
        $('button#btnSuscripcion').on('click', that.mostrarFiltro);
        $('#btnCargarFacturas').on('click', that.consultarFacturas);
        $('#btnCargarFacturasCastigadaIntCorriente').on('click', that.consultarFacturasCastigadaIntCorriente);
        $('#btnGrabar').on('click', that.validarGrabar);
        $('#btnImprimir').on('click', that.validarGrabar);
        $('#btnCancelar').on('click', that.confirmarCancelar);
        that.validaPermisoBotonesSeleccionFacturas();
    },
    /** Configura la tabla de conceptos e inicia impresión
     *  @returns {object}
     */
    imprimir: function () {
        var conceptosAll = [];
        for (var i = 0; i < condonarModelo.conceptos.length; i++) {
            var conc = condonarModelo.conceptos[i];
            for (var x = 0; x < conc.conceptos.length; x++) {
                conceptosAll.push(conc.conceptos[x]);
            }
        }
        condonarModelo.conceptosAll = conceptosAll;
        fillTable("tblConceptosCompletos", "formatoConceptos", "condonarModelo.conceptosAll", "Conceptos condonables").show();
        window.print();
        $('#tblConceptosCompletos').hide();
    },
    /** Muestra un dialogo con el formulario para la búsqueda de las suscripciones
     * @returns {void}
     */
    mostrarFiltro: function () {
        var filtro = $('div#camposBuscarSuscripcion');
        that.dialogoActual = filtro.dialogo({
            modal: true,
            width: 400,
            title: 'Buscar un suscripción',
            buttons: {
                Buscar: that.filtrarSuscriptor
            }
        });
    },
    /** Valida la información del filtro de suscripción y envía la solicitud al servidor
     * @returns {void}
     */
    filtrarSuscriptor: function () {
        var filtro = $('div#camposBuscarSuscripcion');
        var suscripcion = filtro.find('#txtFiltroSus').val().trim();
        var codigoanterior = filtro.find('#txtFiltroCodAnt').val().trim();
        if (suscripcion === '' && codigoanterior === '') {
            filtro.find('#spanMensaje').text(__app.mensajes.camposInvalidosFiltro).show();
        } else {
            var data = {
                idsuscripcion: suscripcion,
                codigoanterior: codigoanterior
            };
            condonarControl.consultarSuscripciones(data, that.consultaSuscripcionCompleto);
        }
    },
    /** Captura la respuesta enviada por el servidor, cuando se consultan las suscripciones.
     * En caso de llegar varias suscripciones posibilita la selección de una.
     * @param  {object} data - El resultado de la petición ajax con las suscripciones que coinciden
     * @returns {void}
     */
    consultaSuscripcionCompleto: function (data) {
        that.limpiarFormulario();
        $('#spanMensaje').text('');
        switch (data.codigoRespuesta) {
            case 0:
                $('#spanMensaje').text(data.mensaje);
                break;
            case 1:
                condonarModelo.suscripcion = data.suscripcion[0];
                that.cargarCabecera();
                that.dialogoActual.dialog('close');
                break;
        }
    },
    /** Carga la cabecera del formulario con los datos de la suscripción seleccionada.
     * @returns {void}
     */
    cargarCabecera: function () {
        var cabecera = $('#divCabecera');
        var sus = condonarModelo.suscripcion;
        $('#txtSuscripcion, #txtSuscripcionImprimir').val(sus.idsuscripcion);
        cabecera.find('#txtDocumento').val(sus.documentotercero);
        cabecera.find('#txtNombre').val(sus.nombretercero);
        cabecera.find('#txtCodAnterior').val(sus.codigoanterior);
        cabecera.find('#txtMunicipio').val(sus.municipio);
        cabecera.find('#txtBarrio').val(sus.barrio);
        cabecera.find('#txtDireccion').val(sus.direccion);
        cabecera.find('#txtTelefono').val(sus.telefonofijo);
        cabecera.find('#txtCelular').val(sus.telefonocelular);
    },
    /** Hace petición AJAX para consultar las facturas de una suscripción, son mostradas en una tabla
     * y se asignan los listeners de sus controles
     * @returns {void}
     */
    consultarFacturas: function () {
        $('#btnCargarFacturasCastigadaIntCorriente').attr('disabled',true);
        condonarModelo.conceptoseleccionado = [];
        if (!!condonarModelo.suscripcion) {
            condonarControl.consultarFacturas({idsuscripcion: condonarModelo.suscripcion.idsuscripcion}, function (data) {
                switch (data.codigoRespuesta) {
                    case 0:
                        __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                        break;
                    case 1:
                        if (data.facturascastigadas.length > 0) {
                            condonarModelo.conceptos = [];
                            condonarModelo.condonables = [];
                            condonarModelo.noCondonables = [];
                            condonarModelo.facturas = data.facturascastigadas;
                            var tblFac = fillTable("tblFacturas", "formatoFacturas", "condonarModelo.facturas", "Facturas");

                            /*tblFac.find('thead tr th#thSeleccion input').off('click');
                             tblFac.find('thead tr th#thSeleccion input').on('click', that.habilitarChecks);*/
                            tblFac.find('tbody tr td[header="thSeleccion"] input').off('click');
                            tblFac.find('tbody tr td[header="thSeleccion"] input').on('click', that.seleccionarFactura);
                            tblFac.find('tbody tr td[header="thDetallesFactura"] input')
                                    .on('click', that.mostrarConceptosFactura)
                                    .attr('disabled', true);
                            //remover el checkbox de la cabecera de la tabla
                            tblFac.find('thead tr th[id="thSeleccion"] input:checkbox').remove();
                            tblFac.show();
                        } else {
                            __dom.lanzarAlerta('Suscripción sin facturas', __app.mensajes.atencion);
                        }

                        break;
                }
            });
        }
    },

    /**
     * Habilita o deshabilita todos los checks de las facturas dependiendo del estado del check de la 
     * cabecera de la columna de selección
     * @returns {void}
     */
    habilitarChecks: function () {
        var estado = $(this).prop('checked');
        var checks = $('#tblFacturas tbody td[header="thSeleccion"] input[type="checkbox"]');
        checks.prop('checked', estado).click();
        if (estado === true) {
            checks.parent().parent().addClass('selected');
        } else {
            checks.parent().parent().removeClass('selected');
        }
    },
    /** Función disparada cuando se selecciona/deselecciona una factura
     * @returns {void}
     */
    seleccionarFactura: function () {
        var check = $(this);
        var trSeleccionada = check.parent().parent();
        var indice = parseInt(trSeleccionada.attr('data-fila'));
        if (check.prop('checked')) {
            trSeleccionada.addClass('selected').find('td[header="thDetallesFactura"] input').attr('disabled', false);
            var tbody = $('#tblFacturas tbody');
            for (var i = 0; i <= indice; i++) {
                var fila = tbody.find('tr[data-fila="'+i+'"]');
                fila.addClass('selected')
                        .find('td[header="thDetallesFactura"] input')
                        .attr('disabled', false);

                var checkFila = fila.find('td[header="thSeleccion"] input').prop('checked', true);
                
                if(i<indice){ 
                    checkFila.attr('disabled', 'disabled');
                }
                
                condonarModelo.idfactura = checkFila.val();
                condonarModelo.facturaSeleccionada = checkFila.parent();
                var conceptosFactura = condonarControl.consultarConceptos({idfactura: checkFila.val()});
                that.consultarConceptosFacturasSeleccionados(conceptosFactura);
            }
            return;
        }

        //si el check no está seleccionado
        trSeleccionada.removeClass('selected')
                .find('td[header="thDetallesFactura"] input')
                .attr('disabled', true);

        if (indice > 0) {
            var _fila = trSeleccionada.prev();
            _fila.find('td[header="thSeleccion"] input')
                    .prop('checked', true)
                    .removeAttr('disabled', 'disabled');
            _fila.find('td[header="thDetallesFactura"] input')
                    .removeAttr('disabled');
        }
        var concepto = condonarControl.consultarConceptosFacturaId(check.val());
        if (!!concepto) {
            condonarModelo.conceptos.splice(concepto.indice, 1);
        }

    },

    /**
     * Valida la respuesta del servidor al consultar los conceptos de las facturas seleccionadas y llena la tabla
     * de conceptos condonables     
     * @param  {object} data Respuesta del servidor con los conceptos
     * @returns {void}
     */
    consultarConceptosFacturasSeleccionados: function (data) {
        if (data.codigoRespuesta === 1) {
            condonarModelo.condonables = data.conceptoscondonables;
            that.llenarTablaConceptosCondonables();
            that.aceptarConceptos();
        }
    },
    /** Hace petición AJAX para consultar los conceptos condonables y no condonables de una factura
     * son mostrados en un cuadro de diálogo.
     * @returns {void}
     */
    mostrarConceptosFactura: function () {
        var _this = $(this);
        var numfactura = _this.attr('data-id');
        condonarModelo.facturaSeleccionada = _this.parent();
        var idfactura = condonarModelo.idfactura = _this.parent().attr('data-value');
        var data = condonarControl.consultarConceptos({idfactura: idfactura});
        if(data) {
            switch (data.codigoRespuesta) {
                case 0:
                    break;
                case 1:
                    condonarModelo.noCondonables = data.conceptosnocondonables;
                    condonarModelo.condonables = data.conceptoscondonables;
                    if (condonarModelo.noCondonables.length > 0) {
                        fillTable("tblConceptosNoCondonable", "formatoConceptosNoCondonable", "condonarModelo.noCondonables", "Conceptos no condonables");
                    }
                    that.llenarTablaConceptosCondonables();
                    that.mostrarDialogoDetalleFactura(numfactura);
                    break;
            }
        };
    },

    /**
     * Muestra el diálogo de los detalles de la factura seleccionada
     * @param  {Number} numfactura Número de la factura
     * @returns {void}
     */
    mostrarDialogoDetalleFactura: function (numfactura) {
        that.dialogoActual = $('#divConceptosFactura').dialogo({
            modal: true,
            width: 850,
            title: 'Conceptos de la factura #' + numfactura,
            buttons: {
                Aceptar: that.aceptarConceptos,
                Cancelar: function () {
                    that.dialogoActual.dialog('close');
                }
            }
        });
    },

    /**
     * Llena la tabla de conceptos condonables con base en los datos que están en el objeto condonarModelo.condonables
     * @returns {void}
     */
    llenarTablaConceptosCondonables: function () {
        if (condonarModelo.condonables.length > 0) {
            fillTable("tblConceptosCondonable", "formatoConceptos", "condonarModelo.condonables", "Conceptos condonables");
        }
        var conceptos = condonarControl.consultarConceptosFacturaId(condonarModelo.idfactura);
        var trs = $('#tblConceptosCondonable tbody tr');
        //Si es la primera vez que se cargan los conceptos de la factura
        if (!conceptos) {
            for (var t = 0; t < trs.length; t++) {
                var fila = $(trs[t]);
                fila.find('td[header="thSeleccion"] input').prop('checked', true);
                fila.addClass('selected');
            }
            return;
        }

        //en caso de tener conceptos seleccionados previamente
        conceptos = conceptos.conceptos.conceptos;
        for (var t = 0; t < trs.length; t++) {
            var check = $(trs[t]).find('td[header="thSeleccion"] input');
            for (var c = 0; c < conceptos.length; c++) {
                if (check.val() == conceptos[c].idconcepto)
                    check.click();
            }
        }
    },
    
    /** Guada los valores de los conceptos condonables seleccionados para una factura.
     * @returns {void}
     */
    aceptarConceptos: function () {
        var conceptoCondonables = $('#tblConceptosCondonable tbody tr.selected');
        var idfactura = condonarModelo.idfactura;
        var conceptoSelect = [];
        var sumaConceptos = 0;
        for (var c = 0; c < conceptoCondonables.length; c++) {
            var tr = $(conceptoCondonables[c]);
            var saldo = tr.find('td[header="thSaldo"]').attr('data-valor');
            conceptoSelect.push({
                idconcepto: tr.find('td[header="thSeleccion"] input').val(),
                iddetallefactura: tr.find('td[header="thSeleccion"]').attr('data-value'),
                nombre: tr.find('td[header="thConcepto"]').text(),
                saldo: tr.find('td[header="thSaldo"]').attr('data-valor'),
                valortotal: tr.find('td[header="thValor"]').attr('data-valor')
            });
            sumaConceptos += parseFloat(saldo);
        }
        var concepto = condonarControl.consultarConceptosFacturaId(idfactura);
        if (!!concepto) {
            concepto.conceptos.conceptos = conceptoSelect;
        } else {
            if (conceptoSelect.length > 0) {
                condonarModelo.conceptos.push({
                    idfactura: idfactura,
                    suma: sumaConceptos,
                    conceptos: conceptoSelect
                });
            }
        }
        condonarModelo.facturaSeleccionada.parent().find('td[header="thSaldo"]').text(sumaConceptos.toString().toCurrency());
        that.dialogoActual.dialog('close');
    },
    /** Valida la información de las facturas y conceptos condonables para su respectivo registro/impresión
     * @returns {void}
     */
    validarGrabar: function () {
        var _this = $(this);
        if (!condonarModelo.suscripcion) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarSuscripcion, __app.mensajes.atencion);
            return;
        }
        var facturaSelec = $('#tblFacturas tbody tr.selected');
        if (facturaSelec.length <= 0) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarFacturas, __app.mensajes.atencion);
            return;
        }
        var facturas = [];
        for (var i = 0; i < facturaSelec.length; i++) {
            var f = $(facturaSelec[i]);
            var idfactura = f.find('td[header="thDetallesFactura"]').attr('data-value');

            var numFac = f.find('td[header="thNumFactura"]').text();
            var factura = condonarControl.consultarFacturaId(idfactura);
            var conceptos = condonarControl.consultarConceptosFacturaId(idfactura);

            if (conceptos && conceptos.conceptos.conceptos.length>0) {
                conceptos = conceptos.conceptos;
                facturas.push({
                    saldo: conceptos.suma,
                    idfactura: factura.idfactura,
                    conceptos: conceptos.conceptos,
                    idsuscripcion: condonarModelo.suscripcion.idsuscripcion
                });
            } else {
                __dom.lanzarAlerta("Debe seleccionar los conceptos condonables de la factura #" + numFac, __app.mensajes.atencion);
                return;
            }
        }
        if (_this.attr('id') === "btnGrabar") {
            condonarControl.grabarCondonacion({facturas: facturas}, that.onGrabarCondonacionCompleto);
        } else {
            that.imprimir();
        }
    },

   /** Hace petici�n AJAX para consultar las facturas Amortizadas � de interes corriente de una suscripci�n, son mostradas en una tabla
     * y se asignan los listeners de sus controles
     * @returns {void}
     */
    consultarFacturasCastigadaIntCorriente: function () {
       $('#btnCargarFacturas').attr('disabled',true);
        condonarModelo.conceptoseleccionado = [];
        if (!!condonarModelo.suscripcion) {
            condonarControl.consultarFacturasCastigadaIntCorriente({idsuscripcion: condonarModelo.suscripcion.idsuscripcion}, function (data) {
	console.log(data);
                switch (data.codigoRespuesta) {
                    case 0:
                        __dom.lanzarAlerta('La suscripci�n no tiene facturas', __app.mensajes.atencion);
                        condonarModelo.nocondonables = [];
                        condonarModelo.condonables = [];
                        break;
                    case 1:
                        if (data.datos.length > 0) {
                            condonarModelo.facturas = data.datos;
                            condonarModelo.nocondonables = [];
                            condonarModelo.condonables = [];
                            var tblFac = fillTable("tblFacturas", "formatoFacturas", "condonarModelo.facturas", "Facturas");
                            tblFac.find('thead th#thSeleccion input').on('mousedown', that.habilitarChecks);
                            tblFac.find('tbody tr td[header="thSeleccion"] input').on('click', that.seleccionarFactura);
                            tblFac.find('tbody tr td[header="thDetallesFactura"] input')
                                    .on('click', that.mostrarConceptosFactura)
                                    .attr('disabled', true);
                            tblFac.show();
                            for (var f = 0; f < data.datos.length; f++) {
                                var fact = data.datos[f];
                                for (var cc = 0; cc < fact.conceptoscondonables.length; cc++) {
                                    var condonable = fact.conceptoscondonables[cc];
                                    condonable.idfactura = fact.idfactura;
                                    condonarModelo.condonables.push(condonable);
                                }
                                for (var cn = 0; cn < fact.conceptosnocondonables.length; cn++) {
                                    var noCondonable = fact.conceptosnocondonables[cn];
                                    noCondonable.idfactura = fact.idfactura;
                                    condonarModelo.nocondonables.push(noCondonable);
                                }
                            }


                        } else {
                            __dom.lanzarAlerta('La suscripci�n no tiene facturas', __app.mensajes.atencion);
                        }

	            break;
                }
            });
        }
    },

    /** Valida Permiso de activar botones para seleccionar Facturas Mora � Corriente
     * @returns {void}
     */
    validaPermisoBotonesSeleccionFacturas: function () {
        condonarControl.consultaPermisoBotonesSeleccionFacturas({idprograma:77},that.evaluaRespuestaPermisoBotones);
    },
       /** Valida Permiso de activar botones para seleccionar Facturas Mora � Corriente
     * @returns {void}
     */
    evaluaRespuestaPermisoBotones: function (data) {

        if (data.codigoRespuesta == 0) {
            __dom.lanzarAlerta(data.mensaje,"Error");
            return;
        } 
        for(var i=0; i<data.datos.length; i++){
            if (data.datos[i].idunidad == 2564) {
                $('#btnCargarFacturas').removeAttr('disabled');
            }
            if (data.datos[i].idunidad == 2565) {
                $('#btnCargarFacturasCastigadaIntCorriente').removeAttr('disabled');            
            }
        }
    },

    /** Recibe la respuesta del servidor cuando se condona la cartera cadtigada
     * @returns {void}
     */
    onGrabarCondonacionCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
            case 1:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion, function () {
                    location.reload();
                });
                break;
        }
    },
    /** Confirma si el usuario desea cancelar la operación actual
     * @returns {void}
     */
    confirmarCancelar: function () {
        if (!!condonarModelo.suscripcion) {
            that.dialogoActual = $('#divConfirmCancelar').dialogo({
                modal: true,
                width: 400,
                title: 'Confirmar cancelar',
                buttons: {
                    Aceptar: function () {
                        that.limpiarFormulario();
                        that.dialogoActual.dialog('close');
                    },
                    Cancelar: function () {
                        that.dialogoActual.dialog('close');
                    }
                }
            });
        }
    },
    /** Limpia el formulario actual y modelo
     * @returns {void}
     */
    limpiarFormulario: function () {
        $('#divCabecera input[type="text"]').val('');
        $('table').empty();
        condonarModelo = {
            conceptos: []
        };
    }

};
condonarVista.init();