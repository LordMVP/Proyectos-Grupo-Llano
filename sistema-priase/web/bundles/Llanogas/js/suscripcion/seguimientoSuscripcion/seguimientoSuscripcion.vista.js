/**
 * @fileOverview Archivo de vista para seguimiento de suscripción
 * @author angelicaGomez
 * @requires seguimientoSuscripcion.control.js
 * @requires seguimientoSuscripcion.modelo.js
 * @version 1.0.0
 */

/**
 * Objeto que hace referencia al namespace seguimientoVista
 * @type {object}
 */
var vista = null;

/** @namespace */
var seguimientoVista = {
    /**
     * hace referencia al último dialogo abierto en la aplicación
     * @type {object}
     */
    dialogoActual: null,
    /**
     * inicializa el programa de seguimiento de suscripción
     * @returns {void}
     */
    init: function () {
        vista = seguimientoVista;
        vista.cargarAutocomplete();
        __dom.configurarColapsable('.divContenedorColapsable');
        $('#divPestanias').tabs();
        $('#btnBuscar').on('click', vista.mostrarBusqueda);
        $('#btnCancelar').on('click', vista.confirmarCancelar);
        $('#btnBuscarFiltro').on('click', vista.consultarSuscripcion);
        $('#cmbMunicipio').on('change', vista.consultarBarrios);
        $('#txtFechaInicial, #txtFechaFinal').on('change', vista.opciones);
        $('#divPestanias li a').on('click', vista.opciones);
        $('#btnInformacion').on('click', vista.cargarInformacionTercero);
        $('#btnVerPropiedad').on('click', vista.mostrarDialogoPropiedad);
        $('#btnBuscarPropiedad').on('click', vista.consultarPropiedades);
        $('#btnAgregarDetalles').on('click', vista.consultarTiposSuscripcion);
        $('#cmbTipoUso').on('change', vista.consultarLiquidaciones);
        $('#cmbOtraEmpresa').on('change', vista.consultarOtrasFacturas);
        $('#cmbDocumentoFactura').on('change', vista.filtrarFacturaDocumento);
        $('#cmbDocumentoFacturaP').on('change', vista.filtrarFacturaDocumentoP);
        $('#cmbDocumento').on('change', vista.filtrarNotasPorDocumento);
        $('#cmbClasePago').on('change', vista.filtrarRecaudosClasePago);
        __dom.configurarCalendario('txtFechaInicial, #txtFechaFinal');
        __dom.configurarTextoNumerico('txtIdSuscripcion, #txtCodigoAnterior ,#txtTotalFacturas');
        $('#btnVerMas').on('click', function () {
            $('#fieldsetDetallesSuscripcion').show();
        });
        //$('#btnVerConceptos').on('click', vista.consultarConceptos);  },
    },
    /**
     * Consulta barrios a partir del municipio que haya sido 
     * seleccionado con anterioridad
     *  @return {void}
     */
    consultarBarrios: function () {
        var idmunicipio = $(this).val();
        var data = {'idmunicipio': idmunicipio};
        seguimientoControl.consultarBarrios(data, vista.onConsultarBarriosCompleto);
    },
    /**
     *  Captura la respuesta enviada por el servidor, sí llega 
     *  información de barrios los muestra en un combo
     * @param  {object} data - El resultado de la petición ajax para mostrar barrios
     * @returns {void}
     */
    onConsultarBarriosCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(__app.mensajes.sinResultados, __app.mensajes.atencion);
                break;
            case 1:
                var cboBarrio = $('#cmbBarrio').empty();
                __dom.llenarCombo('#cmbBarrio', data.barrios, 'idbarrio', 'barrio');
                break;
        }
    },
    /**
     * Muestra diálogo para hacer una búsquedas de suscripciones
     * @returns {void}
     */
    mostrarBusqueda: function () {
        vista.limpiarDialogoBuscarSuscripcion();
        vista.dialogoActual = $('div#divDialogoBusqueda').dialogo({
            modal: true,
            width: 850,
            title: 'Buscar suscripción',
            buttons: {
                Cancelar: function () {
                    $(this).dialog('close');
                }
            }

        });
    },
    /**
     * Hace las validaciones de la búsqueda, sí tiene los parámetros
     * necesatio hace la petición Ajax
     * @returns {void}
     */
    consultarSuscripcion: function () {
        var cont = 0;
        $('#spanMensaje').text('');
        var selector = $('#divDialogoBusqueda input[type=text]');
        $.each(selector, function (index, item) {
            if (item.value !== '') {
                cont++;
            }
        });
        $('#divDialogoBusqueda #cmbBarrio').val() === '-1' ? cont : cont++;
        $('#divDialogoBusqueda #txtNumeroRuta').val() === '-1' ? cont : cont++;

        if (cont > 0) {
            var municipio = $('#cmbMunicipio').val() === '' || $('#cmbMunicipio').val() === '-1' ? '' : $('#cmbMunicipio').val();
            var ruta = $('#txtNumeroRuta').val() !== '-1' ? $('#txtNumeroRuta').val() : '';
            var barrio = $('#cmbBarrio').val() === '-1' ? '' : $('#cmbBarrio').val();
            var data = {
                'idmunicipio': municipio,
                'idtercero': seguimientoModelo.idTercero,
                'cedula': $('#txtDocumentoTerceroBuscar').val(),
                'direccion': $('#txtDireccionBuscar').val(),
                'numerocatastral': $('#txtNumeroCatastralBuscar').val(),
                'idbarrio': barrio,
                'numeropropiedad': $('#txtNumeroPropiedadBuscar').val(),
                'idsuscripcion': $('#txtIdSuscripcion').val(),
                'codigoanterior': $('#divDialogoBusqueda #txtCodigoAnterior').val(),
                'idfactura': $('#divDialogoBusqueda #txtIdeFactura').val(),
                'ruta': ruta
            };
            seguimientoControl.consultarSuscripcion(data, vista.onConsultarSuscripcionCompleto);
        } else {
            $('#spanMensaje').text(__app.mensajes.diligenciarCampos).show();
        }

    },
    /**
     *
     * Captura la respuesta enviada por el servidor, cuando se guarda la información de la suscripción
     * si hay más de una suscripción en la respuesta se muestra la lista de suscriptores para que el usuario elija
     * @param  {object} data - El resultado de la petición ajax para guardar la información de la suscripción
     * @returns {void}
     */
    onConsultarSuscripcionCompleto: function (data) {
        $('.btnFinalizar').remove();
        $('#divListaSeleccion').empty();
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(__app.mensajes.sinResultados, __app.mensajes.atencion);
                break;
            case 1:
                seguimientoModelo.suscripcion = data.suscripciones;
                if (data.suscripciones.length > 1) {
                    var divSuscripciones = $('<div>').addClass('listaSeleccion');
                    $.each(data.suscripciones, function (index, suscripcion) {
                        var div = $('<div>');
                        var radio = $('<input type="radio">');
                        var label = $('<label>');
                        radio.val(suscripcion.idsuscripcion);
                        radio.attr('id', 'radio_susc_' + index);
                        radio.attr('data-indice', index);
                        radio.attr('name', 'radio_suscripciones');

                        label.attr('for', 'radio_susc_' + index);
                        label.text(suscripcion.cedula + ' - ' + suscripcion.nombretercero + ' - ' + suscripcion.idsuscripcion + ' - ' + suscripcion.barrio + ' - ' + suscripcion.codigoanterior + ' - ' + suscripcion.direccion);
                        div.append(radio).append(label);
                        divSuscripciones.append(div);
                    });
                    var btn = $('<button>').text('Finalizar').addClass('btnSimple btnFinalizar');
                    btn.on('click', function () {
                        vista.limpiar();
                        var suscSeleccionada = $('input[name="radio_suscripciones"]:checked');
                        if (suscSeleccionada.length > 0) {
                            var suscripcion = seguimientoModelo.suscripcion = data.suscripciones[suscSeleccionada.attr('data-indice')];
                            $('#spanMensaje').hide();
                            vista.dialogoActual.dialog('close');
                            divSuscripciones.remove();
                            vista.consultarDetalleSuscripcion(suscripcion.idsuscripcion);
                            $('#btnVerMas').attr('disabled', false);
                            $('#btnInformacion').attr('disabled', false);

                        } else {
                            $('#spanMensaje').text(__app.mensajes.seleccionarOpcion).show();
                        }
                    });
                    btn.insertAfter($('#divListaSeleccion'));
                    $('#divListaSeleccion').append(divSuscripciones);
                } else {
                    vista.limpiar();
                    var suscripcion = seguimientoModelo.suscripcion = data.suscripciones[0];
                    $('#spanMensaje').hide();
                    vista.dialogoActual.dialog('close');
                    vista.consultarDetalleSuscripcion(suscripcion.idsuscripcion);
                    $('#btnVerMas').attr('disabled', false);
                    $('#btnInformacion').attr('disabled', false);
                }
                break;
        }
    },
    /**
     * Hace petición ajax al servidor para traer detalles de una suscripcion 
     * @param {int} idsuscripcion - 
     * @returns {void}
     */
    consultarDetalleSuscripcion: function (idsuscripcion) {
        var data = {'idsuscripcion': idsuscripcion};
        seguimientoControl.consultarDetalleSuscripcion(data, vista.onconsultarDetalleSuscripcionCompleto);
    },
    /**
     *
     * Captura la respuesta enviada por el servidor para realizar peticiones 
     * sobre la suscripción buscada
     * @param  {object} data - El resultado de la petición ajax.
     * @returns {void}
     */

    onconsultarDetalleSuscripcionCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case - 1:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                $('#divPestanias').hide();
                return;
                break;
            case 1:
                seguimientoModelo.detallesSuscripcion = data.resumensuscripcion;
                var resumen = data.resumensuscripcion;
                var tercero = resumen.tercero;
                var propiedad = resumen.propiedad;
                var suscripcion = resumen.suscripcion;
                var conceptos = resumen.conceptos;
                seguimientoModelo.conceptos = conceptos;
                vista.cargarDatosTercero(tercero);
                vista.cargarSuscripcion(suscripcion);
                vista.cargarPropiedad(propiedad);
                break;
            case 0:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                break;
        }
    },
    /**
     * Muestra los datos básicos del tercero según la suscripción buscada
     * @param {object} suscriptor - Información del tercero
     * @returns {void}
     * 
     */
    cargarDatosTercero: function (suscriptor) {
        $('fieldset#fieldsetDatosTercero').show();
        $('#txtDocumento').val(suscriptor.cedula);
        $('#txtNombre').val(suscriptor.nombretercero);
        $('#txtIdSuscriptor').val(suscriptor.idsuscriptor);
        $('#txtConvenio').val(suscriptor.convenio);
    },
    /**
     * Muestra datos específicos del tercero buscado en un dialogo
     * @returns {void}
     */
    cargarInformacionTercero: function () {
        var suscriptor = seguimientoModelo.detallesSuscripcion.tercero;
        $('#txtIdTercero').val(suscriptor.idtercero);
        $('#txtTelefonoFijo').val(suscriptor.telefonofijo);
        $('#txtTelefonoCelular').val(suscriptor.telefonocelular);
        $('#txtDescripcion').val(suscriptor.descripcion);

        vista.dialogoActual = $('#divDetalleTercero').dialogo({
            modal: true,
            width: 850,
            title: 'Buscar suscripción',
            buttons: {
                Aceptar: function () {
                    vista.dialogoActual.dialog('close');
                }
            }
        });
    },
    /**
     * Muestra atributos de la suscripción que llega (la misma que se buscó).
     * @param {object} suscripcion - suscripción que se va a mostrar
     * @returns {void}
     */
    cargarSuscripcion: function (suscripcion) {
        var estado = suscripcion.estado;
        switch (estado) {
            case 'A':
                estado = 'Activa';
                break;
            case 'P':
                estado = 'Pendiente';
                break;
            case 'U':
                estado = 'Suspensión usuario';
                break;
            case 'R':
                estado = 'Suspensión Remodelación';
                break;
            case 'E'://
                estado = 'Eliminada';
                break;
        }


        $('#txtEstado').val(estado);
        $('#txtIdSuscripcionDetalle').val(suscripcion.idsuscripcion);
        $('#txtCodigoAnterior').val(suscripcion.codigoanterior);
        $('#txtFechaInicio').val(suscripcion.fechainicio);
        $('#txtDescripcion').val(suscripcion.descripcion);
        $('#txtTipoSuscripcion').val(suscripcion.tiposuscripcion);
        $('#txtRuta').val(suscripcion.ruta);
        $('#txtCiclo').val(suscripcion.ciclo);
        $('#txtTipoUso').val(suscripcion.tipousosuscripcion);
        $('#txtLiquidacion').val(suscripcion.liquidacion);
        $('#txtEstrato').val(suscripcion.estrato);
        $('#txtFactorCorreccion').val(suscripcion.factorcorreccion);
        $('#txtFechaMinima').val(suscripcion.fechaminima);
        $('#txtFechaMaxima').val(suscripcion.fechamaxima);
        $('#txtFechaSuspension').val(suscripcion.fechasuspension);
        $('#txtFechaInicial').val(suscripcion.fecinicio);
        $('#txtFechaFinal').val(suscripcion.fecfinal);
        vista.opciones();
    },
    /**
     * Muestra la propiedad de la suscripción buscada
     * @param {object} propiedad - Propiedad que se mostrará (propiedad de la suscripción buscada)
     * @returns {void}
     */
    cargarPropiedad: function (propiedad) {
        seguimientoModelo.propiedadSeleccionada = propiedad;
        $('#txtNumeroPropiedad').val(propiedad.numeropropiedad);
        $('#txtTipoPropiedad').val(propiedad.tipopropiedad);
        $('#txtMunicipio').val(propiedad.municipio);
        $('#txtBarrio').val(propiedad.barrio);
        $('#txtDireccion').val(propiedad.direccion);
        $('#txtSeccion').val(propiedad.seccion);
        $('#txtManzana').val(propiedad.manzana);
        $('#txtAltoRiesgo').val(propiedad.altoriesgo);
        $('#txtNumeroCatastral').val(propiedad.numerocatastral);
        $('#txtNumeroCatastralNacional').val(propiedad.numerocatastralnacional);
        $('#txtZona').val(propiedad.zona);
        $('#txtDescripcion').val(propiedad.descripcion);
    },
    /**
     * Muestra la información de la propiedad en un cuadro de dialogo
     * @returns {void}
     */
    mostrarDialogoPropiedad: function () {
        $('fieldset#fieldsetPropiedad').dialogo({
            modal: true,
            width: 850,
            title: 'Propiedad',
            buttons: {
                Aceptar: function () {
                    $(this).dialog('close');
                }
            }
        });
    },
    /**
     * Valida que haya un rango de fecha, si están, ejecuta un método según el id del objeto 
     * que disparó el evento click, los métodos que se ejecutan son de peticiones ajax para las consultas 
     * mostradas en las pestañas.
     * @returns {void}
     */
    opciones: function () {
        var id = $(this).attr('id');
        var fechainicial = $('#txtFechaInicial').val();
        var fechafinal = $('#txtFechaFinal').val();

//        if (id === 'txtFechaFinal' && (fechainicial === '' || fechafinal === '')) {
        if (fechainicial === '' || fechafinal === '') {
            __dom.lanzarAlerta("El rango de fechas es obligatorio.", __app.mensajes.atencion);
            $('#cmbOtraEmpresa').attr('disabled', true);
            $('#divPestanias').hide();
            return;
        }
        if (seguimientoModelo.suscripcion === undefined) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarSuscripcion, __app.mensajes.atencion);
            $('#divPestanias').hide();
            return;
        }

        var data = {
            idsuscripcion: seguimientoModelo.suscripcion.idsuscripcion,
            fechainicio: fechainicial,
            fechafin: fechafinal
        };

        //seguimientoControl.consultarFactura(data, vista.onConsultarFacturaCompleto);

//        if (id === 'txtFechaInicial' || id === 'txtFechaFinal') {
        if (fechainicial !== '' && fechafinal !== '') {
            $('#divPestanias').show(0);
            var seleccionada = $('#divPestanias ul li[aria-selected="true"]');
            if (seleccionada.length > 0) {
                //seleccionada.find('a').click();
                id = seleccionada.find('a').attr('id');
            }
        }
//        }

        switch (id) {
            case 'aFactura':
                seguimientoControl.consultarFactura(data, vista.onConsultarFacturaCompleto);
                break;
            case 'aRecaudo':
                seguimientoControl.consultarRecaudo(data, vista.onConsultarRecaudosCompleto);
                break;
            case 'aFinanciación':
                seguimientoControl.consultarFinanciaciones(data, vista.onConsultarFinanciacionCompleto);
                break;
            case 'aCartera':
                seguimientoControl.consultarCartera(data, vista.onConsultarCarteraCompleto);
                break;
            case 'aFacturaOtra':
                vista.consultarOtrasFacturas();
                break;
            case 'aNotas':
                seguimientoControl.consultarNotasFactura(data, vista.onConsultarNotasFCompleto);
                seguimientoControl.consultarNotasRecaudo(data, vista.onConsultarNotasRCompleto);
                break;
            case 'aLectura':
                seguimientoControl.consultarLecturaConsumo(data, vista.onConsultarLecturaConsumoCompleto);
                break;
            case 'aSuspensión':
                seguimientoControl.consultarEncabezado(data, vista.onConsultarEncabezadoCompleto);
                break;
            case 'aEstadoCuenta':
                estadoCuentaControl.consultarInformacion(
                        {idsuscripcion: data.idsuscripcion, fechacorte: data.fechafin},
                        vista.onConsultarEstadoCuentaCompleto,
                        '../../cartera/estado_cuenta/consultar/informacion/'
                        );
                break;
            case 'aSolicitudes':
                seguimientoControl.consultarPQR(data, vista.onConsultarSolicitudesCompleto);
                break;
            case 'aSeguimiento':
                seguimientoControl.consultarCertificaciones(data, vista.onConsultarSeguimientoCompleto);
                break;
            case 'aProvision':
                seguimientoControl.consultarProvision(data, vista.onConsultarProvisionCompleto);
                break;
            case 'aTarifas':
                seguimientoControl.consultarTarifas(data, vista.onConsultarTarifasCompleto);
                break;
            case 'aAuditoria':
                seguimientoControl.consultarAuditoria(data, vista.onConsultarAuditoriaCompleto);
                break;
        }
    },
    /**
     * Consulta las peticiones, quejas y reclamos realizadas por una suscripción
     * @param{Object} data - SOlicitudes enviadas desde el servidor
     */
    onConsultarSolicitudesCompleto: function (data) {
        if (data.codigoRespuesta === 1) {
            seguimientoModelo.solicitudes = data.pqr;
            var tabla = fillTable('tblSolicitudes', 'formatoPQR', 'seguimientoModelo.solicitudes', 'Peticiones, Quejas y Reclamos (PQR)').show();
            $('#pMensajeSolicitudes').text('');
        } else {
            seguimientoModelo.solicitudes = [];
            $('#tblSolicitudes').empty();
            $('#pMensajeSolicitudes').text(__app.mensajes.sinResultados);
        }
    },
    /**
     * Consulta las certificaciones que ha tenido una suscripción
     * @param{Object} data - Información enviada por el servidor de las certificaciones y sus fechas
     */
    onConsultarSeguimientoCompleto: function (data) {
        if (data.codigoRespuesta === 1) {
            seguimientoModelo.certificacion = data.certificacion;
            var tabla = fillTable('tblSeguimiento', 'formatoSeguimiento', 'seguimientoModelo.certificacion', 'Certificaciones').show();
            $('#pMensajeSeguimiento').text('');
        } else {
            seguimientoModelo.certificacion = [];
            $('#tblSeguimiento').empty();
            $('#pMensajeSeguimiento').text(__app.mensajes.sinResultados);
        }
    },
    /** Ajusta tamaño a pestañas para posibilitar scroll si es necesario
     * @returns {void}
     */
    ajustarScroll: function () {
        $(window).scrollTop($('#divPestanias div[aria-hidden="false"]').offset().top);
    },
    /** Captura respuesta del servidor cuando se consulta información de estado de cuenta
     * @param {object} data - Respuesta del servidor con información de estado de cuenta.
     * @returns {void}
     */
    onConsultarEstadoCuentaCompleto: function (data) {
        estadoCuentaVista.onCargarInformacionCompleto(data);
        $('#btnImprimir').hide();
    },
    /** Muestra tabla de facturas con facturas de un documento o en su defecto todas las facturas.
     * @returns {void}
     */
    filtrarFacturaDocumento: function () {
        $('#pMensajeFactura').text('');
        var cmb = $(this);
        var documento = cmb.val();
        var saldoFactura = 0;
        var label = $('#divTotalFacturas label');
        $('#txtTotalFacturas').empty();
        if (documento > 0) {
            seguimientoModelo.facturaDocumentoFiltro = [];
            for (i = 0; i < seguimientoModelo.factura.length; i++) {
                if (seguimientoModelo.factura[i].iddocumento == documento) {
                    seguimientoModelo.facturaDocumentoFiltro.push(seguimientoModelo.factura[i]);
                    saldoFactura = saldoFactura + parseFloat(seguimientoModelo.factura[i].saldofactura);
                }
            }
            var doc = cmb.find('option:selected').text();
            label.text("Saldo " + doc);
            $('#txtTotalFacturas').val(saldoFactura).toTxtCurrency();
            if (seguimientoModelo.facturaDocumentoFiltro.length > 0) {
                var tabla = fillTable('tblFacturas', 'formatoFacturas', 'seguimientoModelo.facturaDocumentoFiltro', 'Facturas de ' + doc).show();
                tabla.find('td[header="thDetalle"] input[type="button"]').on('click', vista.consultarConceptosFactura);
                tabla.find('td[header="thVerRecaudos"] input[type="button"]').on('click', vista.consultarRecaudosFactura);
            } else {
                $('#tblFacturas').html('');
                $('#pMensajeFactura').text('No hay facturas de ' + doc);
            }

        } else {
            seguimientoModelo.facturaDocumentoFiltro = null;
            var tabla = fillTable('tblFacturas', 'formatoFacturas', 'seguimientoModelo.factura', 'Facturas').show();
            tabla.find('td[header="thDetalle"] input[type="button"]').on('click', vista.consultarConceptosFactura);
            tabla.find('td[header="thVerRecaudos"] input[type="button"]').on('click', vista.consultarRecaudosFactura);
            for (i = 0; i < seguimientoModelo.factura.length; i++) {
                saldoFactura = saldoFactura + parseFloat(seguimientoModelo.factura[i].saldofactura);
            }
            label.text("Saldo Facturas");
            $('#txtTotalFacturas').val(saldoFactura).toTxtCurrency();

        }
    },
    /** Muestra tabla de facturas provisionadas con facturas de un documento o en su defecto todas las facturas.
     * @returns {void}
     */
    filtrarFacturaDocumentoP: function () {
        $('#pMensajeFactura').text('');
        var cmb = $(this);
        var documento = cmb.val();
        if (documento > 0) {
            seguimientoModelo.facturaDocumentoFiltroP = [];
            for (i = 0; i < seguimientoModelo.facturaP.length; i++) {
                if (seguimientoModelo.facturaP[i].iddocumento == documento) {
                    seguimientoModelo.facturaDocumentoFiltroP.push(seguimientoModelo.facturaP[i]);
                }
            }
            var doc = cmb.find('option:selected').text();
            if (seguimientoModelo.facturaDocumentoFiltroP.length > 0) {
                var tabla = fillTable('tblFacturasP', 'formatoFacturasP', 'seguimientoModelo.facturaDocumentoFiltroP', doc).show();
                tabla.find('td[header="thDetalle"] input[type="button"]').on('click', vista.consultarConceptosFacturaP);
                tabla.find('td[header="thVerRecaudos"] input[type="button"]').on('click', vista.consultarRecaudosFactura);
            } else {
                $('#tblFacturasP').html('');
                $('#pMensajeFacturaP').text('No hay ' + doc);
            }

        } else {
            seguimientoModelo.facturaDocumentoFiltroP = null;
            var tabla = fillTable('tblFacturasP', 'formatoFacturasP', 'seguimientoModelo.facturaP', 'Facturas (Provisión, Reclasificación, Castigo y Recuperación)').show();
            tabla.find('td[header="thDetalle"] input[type="button"]').on('click', vista.consultarConceptosFacturaP);
            tabla.find('td[header="thVerRecaudos"] input[type="button"]').on('click', vista.consultarRecaudosFactura);
        }
    },
    /** Muestra tabla de recaudos con recaudos de cierta clase de pago o en su defecto todos los recaudos.
     * @returns {void}
     */
    filtrarRecaudosClasePago: function () {
        var cmb = $(this);
        var clasePago = cmb.val();
        if (clasePago > 0) {
            seguimientoModelo.recaudosClaseFiltro = [];
            for (i = 0; i < seguimientoModelo.Recaudo.length; i++) {
                if (seguimientoModelo.Recaudo[i].idclasepago == clasePago) {
                    seguimientoModelo.recaudosClaseFiltro.push(seguimientoModelo.Recaudo[i]);
                }
            }
            var tabla = fillTable('tblRecaudo', 'formatoRecaudo', 'seguimientoModelo.recaudosClaseFiltro', 'Recaudos de ' + cmb.find('option:selected').text());
            tabla.find('td[header="thDetalle"] input[type="button"]').on('click', vista.consultarFacturaRecaudo);
        } else {
            var tabla = fillTable('tblRecaudo', 'formatoRecaudo', 'seguimientoModelo.Recaudo', 'Recaudos');
            tabla.find('td[header="thDetalle"] input[type="button"]').on('click', vista.consultarFacturaRecaudo);
        }
    },
    /**
     * Captura la respuesta del servidor, cuando se consultan facturas
     * @param {object} data - respuesta del servidor con facturas de una suscripción en un rango de fechas
     * @returns {void}
     */
    onConsultarFacturaCompleto: function (data) {
        $('table#tblFacturas').empty();
        switch (data.codigoRespuesta) {
            case 0:
                seguimientoModelo.factura = [];
                $('#tblFacturas').empty();
                $('#pMensajeFactura').text(__app.mensajes.sinResultados);
                break;
            case 1:
                var saldoFactura = 0;
                var label = $('#divTotalFacturas label');
                $('#txtTotalFacturas').empty();

                $('#pMensajeFactura').text('');
                seguimientoModelo.factura = data.facturas;
                var tabla = fillTable('tblFacturas', 'formatoFacturas', 'seguimientoModelo.factura', 'Facturas').show();
                tabla.find('td[header="thDetalle"] input[type="button"]').on('click', vista.consultarConceptosFactura);
                tabla.find('td[header="thVerRecaudos"] input[type="button"]').on('click', vista.consultarRecaudosFactura);
                var cboDocumento = $('#cmbDocumentoFactura').empty();
                __dom.llenarCombo(cboDocumento, data.documentos, 'iddocumento', 'documento');
                vista.ajustarScroll();
                for (i = 0; i < seguimientoModelo.factura.length; i++) {
                    saldoFactura = saldoFactura + parseFloat(seguimientoModelo.factura[i].saldofactura);
                }
                label.text("Saldo Facturas");
                $('#txtTotalFacturas').val(saldoFactura).toTxtCurrency();
                break;
        }
    },

    /**
     * Captura la respuesta del servidor, cuando se consultan facturas 
     * de (provisión, reclasificacion, castigo y recuperación) 
     * @param {object} data - respuesta del servidor con facturas de (provisión, reclasificacion, castigo y recuperación) 
     * de una suscripción en un rango de fechasy
     * @returns {void}
     */
    onConsultarProvisionCompleto: function (data) {
//        console.log(data);
        $('table#tblFacturasP').empty();
        switch (data.codigoRespuesta) {
            case 0:
                seguimientoModelo.facturaP = [];
                $('#tblFacturasP').empty();
                $('#pMensajeFacturaP').text(__app.mensajes.sinResultados);
                break;
            case 1:
                $('#pMensajeFacturaP').text('');
                seguimientoModelo.facturaP = data.facturas;
                var tabla = fillTable('tblFacturasP', 'formatoFacturasP', 'seguimientoModelo.facturaP', 'Facturas (Provisión, Reclasificación, Castigo y Recuperación)').show();
                tabla.find('td[header="thDetalle"] input[type="button"]').on('click', vista.consultarConceptosFacturaP);
                tabla.find('td[header="thVerRecaudos"] input[type="button"]').on('click', vista.consultarRecaudosFactura);
                var cboDocumento = $('#cmbDocumentoFacturaP').empty();
                __dom.llenarCombo(cboDocumento, data.documentos, 'iddocumento', 'documento');
                vista.ajustarScroll();
                break;
        }
    },
    /**
     * Hace petición ajax según id de la factura seleccionada para recibir detalles de la factura
     * @returns {void}
     */
    consultarConceptosFactura: function () {
        var data = {
            idfactura: $(this).attr('data-id')};
        seguimientoControl.consultarConcepto(data, vista.onConsultarConceptosFactura);
    },
    /**
     * Consulta los conceptos o detalle de una factura provisionada
     * @return{void}
     */
    consultarConceptosFacturaP: function () {
        var data = {
            idfactura: $(this).attr('data-id')};
        //console.log(data);
        seguimientoControl.consultarConceptoP(data, vista.onConsultarConceptosFactura);
    },
    /**
     * Consulta los conceptos o detalle de una factura genera por notas
     * @return{void}
     */
    consultarConceptosFacturaNotas: function () {
        var data = {
            idfactura: $(this).attr('data-id')};
        seguimientoControl.consultarConceptosNotasFactura(data, vista.onConsultarConceptosNotasFactura);
    },
    /**
     * Recibe los concepts de una factura generada por notas
     * @param{Object} data - Información enviada por el servidor
     */
    onConsultarConceptosNotasFactura: function (data) {
        $('#tblDetalleFactura').empty();

        switch (data.codigoRespuesta) {
            case 0:
                seguimientoModelo.conceptos = [];
                $('#tblDetalleFactura').empty();
                __dom.lanzarAlerta(__app.mensajes.sinResultados, __app.mensajes.atencion);
                break;
            case 1:
                seguimientoModelo.conceptos = data.conceptos;
                fillTable('tblDetalleFactura', 'formatoDetalleNota', 'seguimientoModelo.conceptos', 'Conceptos');
                $('#divDetalleFactura').dialogo({
                    modal: true,
                    width: 850,
                    title: 'Detalles de factura',
                    buttons: {
                        Aceptar: function () {
                            $(this).dialog('close');
                        }
                    }
                });
                break;
        }
    },
    /** Captura respuesta del servidor, cuando se consultan conceptos de una factura que se muestran en dialogo
     * @param {object} data -  respuesta del servidor (Conceptos por factura)
     * @returns {void}
     */
    onConsultarConceptosFactura: function (data) {
        $('#tblDetalleFactura').empty();

        switch (data.codigoRespuesta) {
            case 0:
                seguimientoModelo.conceptos = [];
                $('#tblDetalleFactura').empty();
                __dom.lanzarAlerta(__app.mensajes.sinResultados, __app.mensajes.atencion);
                break;
            case 1:
                seguimientoModelo.conceptos = data.conceptos;
                fillTable('tblDetalleFactura', 'formatoConceptos', 'seguimientoModelo.conceptos', 'Conceptos');
                $('#divDetalleFactura').dialogo({
                    modal: true,
                    width: 950,
                    title: 'Detalles de factura',
                    buttons: {
                        Aceptar: function () {
                            $(this).dialog('close');
                        }
                    }
                });
                break;
        }
    },
    /** Hace petición ajax para consultar los recaudos que afectan a una factura 
     * @returns {void}
     */
    consultarRecaudosFactura: function () {
        var idFactura = $(this).attr('data-id');
        var numero = $(this).parent().attr('data-value');
        seguimientoModelo.idFactura = idFactura;
        seguimientoModelo.numeroFactura = numero;
        seguimientoControl.consultarRecaudoFactura({'idfactura': idFactura}, vista.onConsultarRecaudoFacturaCompleto);
    },
    /** Captura respuesta del servidor, cuando se consultan recaudos que afectan una factura
     * @param {object} data -  respuesta del servidor con recaudos
     * @returns {void}
     */
    onConsultarRecaudoFacturaCompleto: function (data) {
        $('#tblRecaudo').empty();
        switch (data.codigoRespuesta) {
            case 0:
                seguimientoModelo.RecaudoFactura = [];
                $('#tblRecaudo').empty();
                __dom.lanzarAlerta(__app.mensajes.sinResultados, __app.mensajes.atencion);
                break;
            case 1:
                var idfactura = seguimientoModelo.idFactura;
                var numero = seguimientoModelo.numeroFactura;
                for (var i = 0; i < data.recaudos.length; i++) {
                    data.recaudos[i].idfactura = idfactura;
                    data.recaudos[i].numero = numero;

                }
                seguimientoModelo.RecaudoFactura = data.recaudos;
                fillTable('tblDetalleFactura', 'formatoRecaudoFactura', 'seguimientoModelo.RecaudoFactura', 'Recaudos');
                $('#divDetalleFactura').dialogo({
                    modal: true,
                    width: 950,
                    title: 'Recaudos que afectaron factura: ' + seguimientoModelo.idFactura,
                    buttons: {
                        Aceptar: function () {
                            $(this).dialog('close');
                        }
                    }});
                break;
        }
    },
    /** Captura respuesta del servidor, cuando se consulta el historial de recaudos de una suscripción
     * @param {object} data -  respuesta del servidor con recaudos
     * @returns {void}
     */
    onConsultarRecaudosCompleto: function (data) {
        $('#tblRecaudo').empty();
        switch (data.codigoRespuesta) {
            case 0:
                $('#pMensajeRecaudo').text(data.mensaje);
                seguimientoModelo.Recaudo = [];
                $('#tblRecaudo').empty();
                break;
            case 1:
                vista.ajustarScroll();
                $('#pMensajeRecaudo').text('');
                seguimientoModelo.Recaudo = data.recaudos;
                var table = fillTable('tblRecaudo', 'formatoRecaudo', 'seguimientoModelo.Recaudo', 'Recaudos').show();
                table.find('td[header="thDetalle"] input[type="button"]').on('click', vista.consultarFacturaRecaudo);
                $('#divDetalleRecaudo').show();
                var cboClasePago = $('#cmbClasePago').empty();
                __dom.llenarCombo(cboClasePago, data.clasespago, 'idclasepago', 'documento');
                break;
        }
    },
    /** Hace petición ajax para consultar las facturas afectadas por un recaudo
     * @returns {void}
     */
    consultarFacturaRecaudo: function () {
        var idRecaudo = $(this).attr('data-id');
        seguimientoControl.consultarFacturaRecaudo({idrecaudo: idRecaudo}, vista.onConsultarFacturaRecaudoCompleto);
    },
    /** Captura respuesta del servidor, cuando se consultan facturas afectadas por un recaudo
     * @param {object} data -  respuesta del servidor con facturas
     * @returns {void}
     */
    onConsultarFacturaRecaudoCompleto: function (data) {
        $('#tblConceptoFactura').empty();
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(data.mensaje, 'Atención');
                break;
            case 1:
                $('#pMensajeRecaudo').text('');
                seguimientoModelo.facturaRecaudo = data.facturas;
                var table = fillTable('tblFacturasRecaudo', 'formatoFacturaRecaudo', 'seguimientoModelo.facturaRecaudo', 'Facturas').show();
                table.find('td[header="thConcepto"] input[type="button"]').on('click', vista.consultarConceptosFacturaRecaudo);
                $('#divTblFactura').dialogo({
                    modal: true,
                    width: 950,
                    title: 'Facturas',
                    buttons: {
                        Aceptar: function () {
                            $(this).dialog('close');
                        }
                    }
                });
                break;
        }
    },
    /** Hace petición ajax según id de la factura seleccionada para recibir detalles de la factura
     * @returns {void}
     */
    consultarConceptosFacturaRecaudo: function () {
        var idFactura = $(this).attr('data-id');
        seguimientoModelo.idFactura = idFactura;
        seguimientoControl.consultarConcepto(
                {'idfactura': idFactura},
                vista.onConsultarConceptosFacturaRecaudoCompleto
                );
    },
    /** Captura respuesta del servidor, cuando se consultan conceptos de una factura que se muestran debajo
     * @param {object} data -  respuesta del servidor (Conceptos por factura)
     * @returns {void}
     */
    onConsultarConceptosFacturaRecaudoCompleto: function (data) {
        $('#tblConceptoFactura').empty();
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(data.mensaje, 'Atención');
                break;
            case 1:
                seguimientoModelo.conceptos = data.conceptos;
                fillTable('tblConceptoFactura', 'formatoConceptos', 'seguimientoModelo.conceptos', 'Conceptos de factura ' + seguimientoModelo.idFactura);
                break;
        }
    },
    /** Captura respuesta del servidor, cuando se consultan financiaciones de una suscripción
     * @param {object} data -  respuesta del servidor con financiaciones
     * @returns {void}
     */
    onConsultarFinanciacionCompleto: function (data) {
        $('#tblFinanciaciones').empty();
        switch (data.codigoRespuesta) {
            case 0:
                $('#pMensajeFinanciacion').text(__app.mensajes.sinResultados);
                seguimientoModelo.financiacion = [];
                $('#tblFinanciaciones').empty();
                break;
            case 1:
                $('#pMensajeFinanciacion').text('');
                seguimientoModelo.financiacion = data.financiaciones;
                var table = fillTable('tblFinanciaciones', 'formatoFinanciacion', 'seguimientoModelo.financiacion', 'Financiaciones ');
                table.find('td[header="thFactura"] input[type="button"]').on('click', vista.consultarFacturaFinanciacion);
                table.find('td[header="thAmortizaciones"] input[type="button"]').on('click', vista.consultarAmortizacionFinanciacion);
                break;
        }
    },
    /** Hace petición ajax para consultar facturas asociadas a la financiación
     * @returns {void}
     */
    consultarFacturaFinanciacion: function () {
        seguimientoControl.consultarFacturaFinanciaciones(
                {idfinanciacion: $(this).attr('data-id'),
                    fechainicio: $('#txtFechaInicial').val(),
                    fechafin: $('#txtFechaFinal').val()
                }, vista.onConsultarFacturaRecaudoCompleto);
    },
    /** Hace petición ajax para consultar amortización de una financiación
     * @returns {void}
     */
    consultarAmortizacionFinanciacion: function () {
        seguimientoControl.consultarAmortizaciones(
                {idfinanciacion: $(this).attr('data-id'),
                    fechainicio: $('#txtFechaInicial').val(),
                    fechafin: $('#txtFechaFinal').val()
                }, vista.onConsultarAmortizacionCompleto);
    },
    /** Captura respuesta del servidor, cuando se consulta la amortización de una factura
     * @param {object} data -  respuesta del servidor con amortización de una financiación
     * @returns {void}
     */
    onConsultarAmortizacionCompleto: function (data) {
        $('#tblAmortizaciones').empty();
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(data.mensaje, 'Atención');
                break;
            case 1:
                $('#pMensajeFinanciacion').text('');
                seguimientoModelo.amortizacion = data.facturas;
                fillTable('tblAmortizaciones', 'formatoAmortizacion', 'seguimientoModelo.amortizacion', 'Amortización');
                $('#divTblAmort').dialogo({
                    modal: true,
                    width: 950,
                    title: 'Amortizaciones ',
                    buttons: {
                        Aceptar: function () {
                            $(this).dialog('close');
                        }
                    }});
                break;
        }
    },
    /** Captura respuesta del servidor, cuando se consulta cartera de suscripción
     * @param {object} data -  respuesta del servidor con cartera
     * @returns {void}
     */
    onConsultarCarteraCompleto: function (data) {
        $('#tblCartera').empty();
        switch (data.codigoRespuesta) {
            case 0:
                seguimientoModelo.cartera = [];
                $('#tblCartera').empty();
                $('#pMensajeCartera').text(__app.mensajes.sinResultados);
                break;
            case 1:
                $('#pMensajeCartera').text('');
                seguimientoModelo.cartera = data.facturas;
                var table = fillTable('tblCartera', 'formatoCartera', 'seguimientoModelo.cartera', 'Cartera');
                table.find('td[header="thConcepto"] input[type="button"]').on('click', vista.consultarConceptosCartera);
                break;
        }
    }, /** Hace petición ajax para consultar conceptos de facturas de cartera
     * @returns {void}
     */
    consultarConceptosCartera: function () {
        var idFactura = seguimientoModelo.idFactura = $(this).attr('data-id');
        seguimientoControl.consultarConcepto(
                {'idfactura': idFactura},
                vista.onConsultarConceptosCarteraCompleto);
    },
    /** Captura respuesta del servidor, cuando se consultan conceptos de facturas de cartera
     * @param {object} data -  respuesta del servidor con conceptos de cartera
     * @returns {void}
     */
    onConsultarConceptosCarteraCompleto: function (data) {
        $('#tblConceptoCartera').empty();
        switch (data.codigoRespuesta) {
            case 0:
                seguimientoModelo.conceptos = [];
                $('#tblConceptoCartera').empty();
                $('#pMensajeCartera').text(__app.mensajes.sinResultados);
                break;
            case 1:
                $('#pMensajeCartera').text('');
                seguimientoModelo.conceptos = data.conceptos;
                fillTable('tblConceptoCartera', 'formatoConceptos', 'seguimientoModelo.conceptos', 'Conceptos de factura ' + seguimientoModelo.idFactura);
                $('#divTblCCartera').dialogo({
                    modal: true,
                    width: 950,
                    title: 'Conceptos de factura ',
                    buttons: {
                        Aceptar: function () {
                            $(this).dialog('close');
                        }
                    }});
                break;
        }
    },
    /**
     * Valida los valores de los conceptos
     * @returns {Number|String}
     */
    validarConceptoPorTipo: function (valor, td, obj) {
        if (obj.operacion === 'S') {
            return valor ? valor.toString().toCurrency() : '';
        }
        return parseFloat(valor).toFixed(2);
    },
    /** Hace petición ajax para consultar conceptos de facturas de cartera
     * @returns {void}
     */
    consultarConceptosNotaRecaudo: function () {
        var idRecaudo = seguimientoModelo.idRecaudoNota = $(this).attr('data-id');
        seguimientoControl.consultarConceptoRecaudo(
                {'idrecaudo': idRecaudo},
                vista.onConsultarConceptosRecaudoNotaCompleto);
    },
    /** Captura respuesta del servidor, cuando se consultan conceptos de facturas de cartera
     * @param {object} data -  respuesta del servidor con conceptos de cartera
     * @returns {void}
     */
    onConsultarConceptosRecaudoNotaCompleto: function (data) {
        $('#tblDetalleNota').empty();
        switch (data.codigoRespuesta) {
            case 0:
                seguimientoModelo.conceptos = [];
                $('#tblDetalleNota').empty();
                $('#pMensajeNotas').text(__app.mensajes.sinResultados);
                break;
            case 1:
                $('#pMensajeNotas').text('');
                seguimientoModelo.detallerecaudonota = data.conceptos;
                fillTable('tblDetalleNota', 'formatoDetalleRecaudo', 'seguimientoModelo.detallerecaudonota', 'Detalle de la nota  ' + seguimientoModelo.idRecaudoNota);
                $('#divDetalleNota').dialogo({
                    modal: true,
                    width: 950,
                    title: 'Conceptos de nota de recaudo ',
                    buttons: {
                        Aceptar: function () {
                            $(this).dialog('close');
                        }
                    }});
                break;
        }
    },
    /** Hace petición ajax para consultar facturas de otras empresas
     * @returns {void}
     */
    consultarOtrasFacturas: function () {
        var fechainicial = $('#txtFechaInicial').val();
        var fechafinal = $('#txtFechaFinal').val();
        seguimientoModelo.empresa = $('#cmbOtraEmpresa option:selected').text() !== 'Seleccione' ?
                $('#cmbOtraEmpresa option:selected').text() : 'todas las empresas';
        var data = {
            idempresa: $('#cmbOtraEmpresa').val(),
            idsuscriptor: seguimientoModelo.suscripcion.idsuscriptor,
            fechainicio: fechainicial, fechafin: fechafinal};
        seguimientoControl.consultarOtrasFacturas(data, vista.onConsultarOtrasFacturaCompleto);
    },
    /** Captura respuesta del servidor, cuando se consultan facturas de otra empresa
     * @param {object} data -  respuesta del servidor con facturas de una suscripción
     * @returns {void}
     */
    onConsultarOtrasFacturaCompleto: function (data) {
        $('#tblOtrasFacturas').empty();
        switch (data.codigoRespuesta) {
            case 0:
                $('#pMensajeOtraEmpresa').text(__app.mensajes.sinResultados);
                seguimientoModelo.cartera = [];
                $('#tblOtrasFacturas').empty();
                break;
            case 1:
                $('#pMensajeOtraEmpresa').text('');
                seguimientoModelo.cartera = data.facturas;
                var table = fillTable('tblOtrasFacturas', 'formatoFacturaRecaudo', 'seguimientoModelo.cartera', 'Facturas de ' + seguimientoModelo.empresa);
                table.find('td[header="thConcepto"] input[type="button"]').on('click', vista.consultarConceptosCartera);
                break;
        }
    },
    /** Captura respuesta del servidor, cuando se consulta notas de factura
     * @param {object} data -  respuesta del servidor con notas
     * @returns {void}
     */
    onConsultarNotasFCompleto: function (data) {
        $('#tblNotasFactura').empty();
        switch (data.codigoRespuesta) {
            case 0:
                seguimientoModelo.notaFactura = [];
                $('#tblNotasFactura').empty();
                $('#pMensajeNotas').text('No se encontraron notas de factura.');
                break;
            case 1:
                $('#pMensajeNotas').text('');
                seguimientoModelo.notaFactura = data.facturas;
                for (var i = 0; i < data.facturas.length; i++) {
                    var factura = data.facturas[i];
                    var documento = {'iddocumento': factura.iddocumento, 'documento': factura.documento};
                    if (!seguimientoControl.consultarDocumentosNotaPorId(factura.iddocumento)) {
                        seguimientoModelo.documentosNotas.push(documento);
                    }
                }
                var table = fillTable('tblNotasFactura', 'formatoNotaFactura', 'seguimientoModelo.notaFactura', 'Notas de factura');
                table.find('td[header="thDetalle"] input[type="button"]').on('click', vista.consultarConceptosFacturaNotas);
                __dom.llenarCombo($('#cmbDocumento'), seguimientoModelo.documentosNotas, 'iddocumento', 'documento');
                break;
        }
    },
    /** Captura respuesta del servidor, cuando se consulta notas de recaudo
     * @param {object} data -  respuesta del servidor con notas
     * @returns {void}
     */
    onConsultarNotasRCompleto: function (data) {
        $('#tblNotasRecaudo').empty();
        switch (data.codigoRespuesta) {
            case 0:
                $('#pMensajeNotas').text('No se encontraron notas de recaudo.');
                seguimientoModelo.notaRecaudo = [];
                $('#tblNotasRecaudo').empty();
                break;
            case 1:
                $('#pMensajeNotas').text('');
                seguimientoModelo.notaRecaudo = data.facturas;
                for (var i = 0; i < data.facturas.length; i++) {
                    var factura = data.facturas[i];
                    var documento = {'iddocumento': factura.iddocumento, 'documento': factura.documento};
                    if (!seguimientoControl.consultarDocumentosNotaPorId(factura.iddocumento)) {
                        seguimientoModelo.documentosNotas.push(documento);
                    }
                }
                var table = fillTable('tblNotasRecaudo', 'formatoNotaRecaudo', 'seguimientoModelo.notaRecaudo', 'Notas de recaudo');
                table.find('td[header="thDetalle"] input[type="button"]').on('click', vista.consultarConceptosNotaRecaudo);
                __dom.llenarCombo($('#cmbDocumento'), seguimientoModelo.documentosNotas, 'iddocumento', 'documento');
                break;
        }
    },
    /**
     * Se filtran las notas recaudo y factura según el documento seleccionado
     */
    filtrarNotasPorDocumento: function () {
        var _this = $(this);
        var tablas = $('#tblNotasRecaudo, #tblNotasFactura').show();
        var documento = _this.find('option:selected').text();
        tablas.find('caption span').remove();
        tablas.find('tr').show();

        if (_this.val() !== '-1' && _this.val()) {
            var trCoinciden = tablas.find('td[header="thDocumento"][data-value="' + _this.val() + '"]');
            tablas.find('caption').append($('<span>').text('  Documento: ' + documento));
            trCoinciden = trCoinciden.parents('tr');
            tablas.find('tbody tr').not(trCoinciden).hide();
            if ($('#tblNotasRecaudo tbody tr:visible').length === 0) {
                $('#tblNotasRecaudo').hide();
            }
            if ($('#tblNotasFactura tbody tr:visible').length === 0) {
                $('#tblNotasFactura').hide();
            }

        }

    },
    /** Captura respuesta del servidor, cuando se consulta lecturas / consumos
     * @param {object} data -  respuesta del servidor con lecturas
     * @returns {void}
     */
    onConsultarLecturaConsumoCompleto: function (data) {
        $('#tblLectura').empty();
        switch (data.codigoRespuesta) {
            case 0:
                $('#pMensajeLectura').text(__app.mensajes.sinResultados);
                seguimientoModelo.lecturaConsumo = [];
                $('#tblLectura').empty();
                break;
            case 1:
                $('#pMensajeLectura').text('');
                seguimientoModelo.lecturaConsumo = data.datosuspension;
                var table = fillTable('tblLectura', 'formatoLectura', 'seguimientoModelo.lecturaConsumo', 'Lectura / Consumo ');
                table.find('td[header="thVer"] input[type="button"]').on('click', function () {
                    seguimientoControl.ConsultarDetalleConsumo({idlectura: $(this).attr('data-id')},
                            vista.onConsultarDetalleConsumoCompleto);
                });
                table.find('td[header="thDetalle"] input[type="button"]').on('click', function () {
                    seguimientoControl.consultarDetalleLectura({idlectura: $(this).attr('data-id')},
                            vista.onConsultarDetalleLecturaCompleto);
                });
                break;
        }
    },
    /** Captura respuesta del servidor, cuando se consultan  detalles de un consumo y lo muestra en dialogo
     * @param {object} data -  respuesta del servidor con detalles del consumo
     * @returns {void}
     */
    onConsultarDetalleConsumoCompleto: function (data) {
        $('#tblVerLecturaConsumo').empty();
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                break;
            case 1:
                $('#pMensajeLectura').text('');
                seguimientoModelo.detalleConsumo = data.facturas;
                fillTable('tblVerLecturaConsumo', 'formatoDetalleConsumo', 'seguimientoModelo.detalleConsumo', 'Detalle del consumo ');
                $('#divVerLecturaConsumo').dialogo({
                    modal: true,
                    width: 950,
                    title: 'Consumo ',
                    buttons: {
                        Aceptar: function () {
                            $(this).dialog('close');
                        }
                    }});
                break;
        }
    },
    /** Captura respuesta del servidor, cuando se consultan  detalles de la lectura y lo muestra en dialogo
     * @param {object} data -  respuesta del servidor con detalles de lectura
     * @returns {void}
     */
    onConsultarDetalleLecturaCompleto: function (data) {
        $('#tblDetalleLectura').empty();
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                break;
            case 1:
                $('#pMensajeLectura').text('');
                seguimientoModelo.detalleLectura = data.facturas;
                fillTable('tblDetalleLectura', 'formatoDetalleLectura', 'seguimientoModelo.detalleLectura', 'Detalle de lectura ');
                $('#divDetalleLectura').dialogo({
                    modal: true,
                    width: 950,
                    title: 'Detalle de lectura ',
                    buttons: {
                        Aceptar: function () {
                            $(this).dialog('close');
                        }
                    }});
                break;
        }
    },
    /** Captura respuesta del servidor, cuando se consultan  encabezados de reconexión / suspensión
     * @param {object} data -  respuesta del servidor con información de reconexión / suspensión
     * @returns {void}
     */
    onConsultarEncabezadoCompleto: function (data) {
        $('#tblSuspensionReconexion,#tblSuspensionReconexion,#tblReconexion, #tblSuspension').empty();
        $('#pMensajeSuspension, #pMensajeReconexion, #pMensajeSuspension').text('');
        switch (data.codigoRespuesta) {
            case 0:
                $('#pMensajeSuspension').text(__app.mensajes.sinResultados);
                seguimientoModelo.encabezado = [];
                $('#tblSuspensionReconexion').empty();
                break;
            case 1:
                seguimientoModelo.encabezado = data.datosuspension;
                var table = fillTable('tblSuspensionReconexion', 'formatoEncabezado', 'seguimientoModelo.encabezado', 'Encabezado ');
                table.find('td[header="thVer"] input[type="button"]').on('click', vista.consultarSuspensionReconexion);
                break;
        }
    },
    /** Hace petición ajax para consultar suspensión y/o reconexión de un encabezado.
     * @returns {void}
     */
    consultarSuspensionReconexion: function () {
        $('#pMensajeSuspension, #pMensajeReconexion, #pMensajeSuspension').text('');
        var idSuspensionReconexion = seguimientoModelo.idSuspensionReconexion = $(this).attr('data-id');
        var data = {idsuspensionreconexion: idSuspensionReconexion};
        seguimientoControl.consultarSuspension(data, vista.onConsultarSuspensionCompleto);
        seguimientoControl.consultarReconexion(data, vista.onConsultarReconexionCompleto);
    },
    /** Captura respuesta del servidor, cuando se consultan  suspensiones
     * @param {object} data -  respuesta del servidor con suspensiones
     * @returns {void}
     */
    onConsultarSuspensionCompleto: function (data) {
        $('#tblSuspension').empty();
        switch (data.codigoRespuesta) {
            case 0:
                $('#pMensajeSuspension').text('No se encontraron suspensiones.');
                seguimientoModelo.suspension = [];
                $('#tblSuspension').empty();
                break;
            case 1:
                $('#pMensajeSuspension').text('');
                $('#tblSuspension').show();
                seguimientoModelo.suspension = data.facturas;
                fillTable('tblSuspension', 'formatoSuspension', 'seguimientoModelo.suspension', 'Suspensiones ');
                break;
        }
    },
    /** Captura respuesta del servidor, cuando se consultan  reconexiones
     * @param {object} data -  respuesta del servidor con reconexiones
     * @returns {void}
     */
    onConsultarReconexionCompleto: function (data) {
        $('#tblReconexion').empty();
        switch (data.codigoRespuesta) {
            case 0:
                $('#pMensajeReconexion').text('No se encontraron reconexiones.');
                seguimientoModelo.reconexion = [];
                $('#tblReconexion').empty();
                break;
            case 1:
                $('#pMensajeReconexion').text('');
                $('#divSuspensionReconexion').show();
                seguimientoModelo.reconexion = data.facturas;
                fillTable('tblReconexion', 'formatoReconexion', 'seguimientoModelo.reconexion', 'Reconexiones ');
                break;
        }
    },
    /**
     * Configura cajas de texto que se autocompletaran con los nombre de terceros
     * @returns {void}
     */
    cargarAutocomplete: function () {
        __dom.configurarAutocomplete(
                $('input#txtNombreTerceroBuscar'),
                vista.sourceAutoComplete,
                function (event, ui) {
                    seguimientoModelo.idTercero = ui.item.idVal;
                },
                function () {
                    seguimientoModelo.idTercero = undefined;
                }
        );
    },
    /** Realiza la petición AJAX para consultar los terceros del autocomplete 
     * @returns {void}
     */
    sourceAutoComplete: function (request, response) {
        vista.request = request;
        vista.response = response;
        var datos = {};
        datos.nombre = request.term.trim();
        seguimientoControl.consultarTerceros(datos, vista.mostrarResultado);
    },
    /** Muestra el resultado de la consulta de los terceros en la lista desplegable.
     * @returns {void}
     */
    mostrarResultado: function (data) {
        var result = [];
        if (data.codigoRespuesta === 1) {
            $.each(data.datos, function (i, item) {
                result.push({
                    label: item.nombretercero,
                    value: item.nombretercero,
                    documento: item.documento,
                    idVal: item.idtercero
                });
            });
            vista.response(result);
        }
    },
    /**
     * Pide confirmación para reiniciar búsqueda.
     * @returns {void}
     */
    nuevaBusqueda: function () {
        $('div#divConfirmCancelar').dialogo({
            resizable: false,
            heigth: 150,
            modal: true,
            title: 'Confirmar búsqueda',
            buttons: {
                "Sí": function () {
                    $(this).dialog('close');
                    vista.limpiar();
                }, Cancelar: function () {
                    $(this).dialog("close");
                }
            }
        });
    },
    /** Confirma si el usuario desea cancelar la operación actual
     * @returns {void}
     */
    confirmarCancelar: function () {
        if (!!seguimientoModelo.suscripcion) {
            $('div#divConfirmCancelar').dialogo({
                resizable: false,
                heigth: 150,
                modal: true,
                title: 'Cancelar operación',
                buttons: {
                    "Sí": function () {
                        $(this).dialog('close');
                        vista.limpiar();
                    }, Cancelar: function () {
                        $(this).dialog("close");
                    }
                }
            });
        }
    },
    /**
     * Limpia cajas de texto del cuadro de diálogo donde se hacen la búsqueda
     * @returns {void}
     */
    limpiarDialogoBuscarSuscripcion: function () {
        var dialogo = $('div#divFiltroSuscriptor');
        dialogo.find('input[type="text"]').val('');
        dialogo.find('select').val('-1');
        dialogo.find('#spanMensaje').hide();
        $('#divListaSeleccion').empty();
    },
    /**
     * Reinicia página 
     * @returns {void}
     */
    limpiar: function () {
        seguimientoModelo = {
            documentosNotas: []
        };
        $('#spanMensaje').hide();
        $('#btnVerMas, #btnInformacion').attr('disabled', true);
        $('#divCarterasFinanciadas, #divCarterasNormales').html('');
        var fieldsets = $('#fieldsetPropiedad, #fieldsetDetallesSuscripcion, #divPestanias').hide();
        $('#fieldsetDatosTercero input[type = text]').val('');
        fieldsets.find('input[type = text], textarea').val('');
        $('#txtFechaInicial, #txtFechaFinal').val('');
        fieldsets.find('select').val(-1);
        $('#divPestanias table').empty();
    },
    /**
     * Muestra sólo la fecha sin horas
     * @param data - Fecha a la quue se le quita las horas
     * @returns {string}
     */
    validarFechaEmision: function (data) {
        return data.split(' ')[0];
    },
    /**
     * CUando se muestra una fecha con horas se le quita los milisegundo
     * @param data - Fecha a la que le quita milisegundo
     * @returns {string}
     */
    validarFechaCompleta: function (data) {
        if (data) {
            return data.split('.')[0];
        }
    },

    /**
     * Captura la respuesta del servidor, cuando se consultan las Tarifas 
     * de un cliente
     * @param {object} data - respuesta del servidor con informacion de las tarifas
     * de una suscripción en un rango de fechas y
     * @returns {void}
     */
    onConsultarTarifasCompleto: function (data) {
        $('table#tblTarifas').empty();
        switch (data.codigoRespuesta) {
            case 0:
                seguimientoModelo.tarifas = [];
                $('#tblTarifas').empty();
                $('#pMensajeTarifas').text(__app.mensajes.sinResultados);
                break;
            case 1:
                $('#pMensajeTarifas').text('');
                seguimientoModelo.tarifas = data.tarifas;
                var tabla = fillTable('tblTarifas', 'formatoTarifas', 'seguimientoModelo.tarifas', 'Tarifas').show();
                tabla.find('td[header="thDetallesTarifas"] input[type="button"]').on('click', vista.consultarAllConceptosFactura);
                vista.ajustarScroll();
                break;
        }
    },
    /**
     * Hace petición ajax según id de la factura seleccionada para recibir detalles de la factura
     * @returns {void}
     */
    consultarAllConceptosFactura: function () {
        var data = {
            idfactura: $(this).attr('data-id')};
        seguimientoControl.consultarAllConcepto(data, vista.mostrarAllConceptosFactura);
    },
    /** Hace petición AJAX para consultar los conceptos condonables y no condonables de una factura
     * son mostrados en un cuadro de diálogo.
     * @returns {void}
     */
    mostrarAllConceptosFactura: function (data) {
        console.log(data);
        $('#tblDetalleFacturaTarifa').empty();
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                break;
            case 1:
                $('#pMensajeTarifas').text('');
                seguimientoModelo.detalleLectura = data.conceptos;
                fillTable('tblDetalleFacturaTarifa', 'formatoAllConceptos', 'seguimientoModelo.detalleLectura', 'Detalles Conceptos ').show();
                $('#divDetalleFacturaTarifa').dialogo({
                    modal: true,
                    width: 950,
                    title: 'Detalle de factura Tarifa ',
                    buttons: {
                        Aceptar: function () {
                            $(this).dialog('close');
                        }
                    }});
                break;

        }
        ;
    },
    
    /**
     * Captura la respuesta del servidor, cuando se consulta laAuditoria  
     * de un cliente
     * @param {object} data - respuesta del servidor con informacion de las Actualizaciones
     * de una suscripción en un rango de fechas y
     * @returns {void}
     */
    onConsultarAuditoriaCompleto: function (data) {
        $('table#tblAuditoriaSuscripcion').empty();
        $('table#tblAuditoriaTercero').empty();
        $('table#tblAuditoriaPropiedad').empty();
        $('table#tblAuditoriaConceptoExento').empty();
        $('table#tblAuditoriaRuta').empty();
        switch (data.codigoRespuesta) {
            case 0:
                seguimientoModelo.auditoria = [];
                $('#tblAuditoriaSuscripcion').empty();
                $('#tblAuditoriaTercero').empty();
                $('#tblAuditoriaPropiedad').empty();
                $('#tblAuditoriaConceptoExento').empty();
                $('#tblAuditoriaRuta').empty();
                $('#pMensajeAuditoria').text(__app.mensajes.sinResultados);
                break;
            case 1:
                $('#pMensajeTarifas').text('');
                seguimientoModelo.auditoria = data.auditoria;
                fillTable('tblAuditoriaSuscripcion', 'formatoAuditoriaSuscripcion', 'seguimientoModelo.auditoria.auditoriasuscripcion', 'Suscripción').show();
                fillTable('tblAuditoriaTercero', 'formatoAuditoriaTercero', 'seguimientoModelo.auditoria.auditoriaterceros', 'Tercero').show();
                fillTable('tblAuditoriaPropiedad', 'formatoAuditoriaPropiedad', 'seguimientoModelo.auditoria.auditoriapropiedades', 'Propiedad').show();
                fillTable('tblAuditoriaConceptoExento', 'formatoAuditoriaConceptoExento', 'seguimientoModelo.auditoria.auditoriaconceptoexento', 'Concepto').show();
                fillTable('tblAuditoriaRuta', 'formatoAuditoriaRuta', 'seguimientoModelo.auditoria.auditoriaruta', 'Ruta').show();
                vista.ajustarScroll();
                
                break;
        }
    }

};
seguimientoVista.init();
