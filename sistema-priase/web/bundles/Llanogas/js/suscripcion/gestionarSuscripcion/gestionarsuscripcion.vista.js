/**
 * @fileOverview Archivo de vista y control para gestionar suscripción
 * @author jeissonBarriga
 * @requires gestionarsuscripcion.control.js
 * @requires gestionarsuscripcion.modelo.js
 * @version 1.0.0
 */

/**
 * Objeto que hace referencia al namespace gestionarsuscripcionVista
 * @type {object}
 */
var that = null;

/** @namespace */
var gestionarsuscripcionVista = {
    /**
     * hace referencia al último diálogo abierto en la aplicación
     * @type {object}
     */
    dialogoActual: null,
    /**
     * Sirve para almacenar el tipo de operación del usuario (cosulta o inserción)
     * @type {object}
     */
    consulta: false,
    /**
     * Función que se invoca al inciar el objeto gestionarsuscripcionVista, asigna listeners para los eventos de los controles.
     * @returns {void}
     */
    init: function () {
        that = this;
        __app.vistaActual = gestionarsuscripcionVista;
        __app.controlActual = gestionarsuscripcionControl;
        var comandos = $('div#divComandos');
        comandos.find('#btnNuevo').on('click', that.iniciarNuevaSuscripcion);
        comandos.find('#btnBuscar').on('click', that.confirmarBuscarSuscripcion);
        comandos.find('#btnGrabar').on('click', that.validarGrabarSuscripcion);
        comandos.find('#btnCancelar').on('click', that.cancelarOperacion);
        $('#btnBuscarSuscriptor').on('click', that.consultarSuscriptor);
        $('#btnBuscarPropiedad').on('click', that.consultarPropiedades);
        //$('#btnVerConceptos').on('click', that.consultarConceptos); ---* eliminar
        //$('#btnVerConceptos').hide(0).css('display','none !important'); //se oculta el botón en la interfaz de gestionar suscripcion
        $('#cboLiquidacion').on('change', that.consultarConceptos);
        $('#cboTipoSuscripcion').on('change', that.consultarTiposUsoSuscripcion);
        $('#btnAgregarConceptos').on('click', that.mostrarDialogoConceptos);

        $('#btnAgregarDetalles').on('click', that.consultarTiposSuscripcion);
        $('#btnFinalizarSeleccionPropiedad').on('click', that.cargarPropiedad);
        $('#cboTipoUso').on('change', that.consultarLiquidaciones);
        $('div#divBuscarSuscripcion').find('#cboMunicipio').on('change', that.consultarBarrios);
        $('#txtCantidad').on('blur', that.calcularValorTotal);
        $('#txtValorUnitario').on('blur', that.calcularValorTotal);
        $('#divBuscarSuscripcion').find('#cboBarrio, #txtNombreTerceroBuscar, #txtDocumentoTerceroBuscar,' +
                ' #txtDireccionBuscar, #txtNumeroCatastralBuscar, #txtNumeroRuta, #txtNumeroPropiedad,' +
                ' #txtIdSuscripcion, #txtCodigoAnterior').on('blur', that.definirCombinacion);
        //configuracion de calendarios 
        __dom.configurarCalendario('txtFechaInicio, #txtFechaInicial, #txtFechaFinal');
        __dom.configurarTextoNumerico('txtIdSuscriptorNuevo, #txtCantidad, #txtIdSuscripcion');
        __dom.configurarTextoNumerico('txtValorUnitario', false, true, true);
        that.cargarAutocomplete();
        gestionarsuscripcionModelo.modoConsulta = false;

        $('#txtFechaInicial').on('change', that.validarFechaFinal);
    },
    /**
     * Valida que la fecha final no sea menor que la fecha inicial, inicializa el datepicker de la fecha final para que no permite fechas menores
     */
    validarFechaFinal: function () {
        var _this = $(this);
        var fechaActual = new Date(_this.val());
        var txtFechaFin = $('#txtFechaFinal');
        var fechaFinal = new Date(txtFechaFin.val());
        if (fechaFinal < fechaActual) {
            txtFechaFin.val('');
        }
        $('#txtFechaFinal').datepicker('destroy').datepicker({minDate: fechaActual, dateFormat: 'yy/mm/dd'});
    },
    /** Actualiza la información del concepto según los campos de texto del dialogo
     * @param {object} concepto - Información del concepto que se está editando
     * @returns {void}
     */
    actualizarConcepto: function (concepto) {
        var dialogo = $('div#divEditarConcepto');
        concepto.cantidad = dialogo.find('#txtCantidad').val().trim();
        concepto.valorunitario = dialogo.find('#txtValorUnitario').val().trim();
        concepto.valortotal = dialogo.find('#txtValorTotal').val().trim();
        concepto.fechainicio = dialogo.find('#txtFechaInicial').val().trim();
        concepto.fechafinal = dialogo.find('#txtFechaFinal').val().trim();
        that.llenarTablaConceptosAsignados();
    },
    /**
     * Cuando se consulta una suscripción no se permite editar nada de la información por lo que se deshbilita la edición y botones
     */
    configurarModoConsulta: function () {
        gestionarsuscripcionModelo.modoConsulta = true;
        var fieldsets = $('#fieldsetDatosTercero, #fieldsetPropiedad, #fieldsetDetallesSuscripcion, #fieldsetConceptos');
        fieldsets.show();
        fieldsets.find('input[type = text], select').prop('disabled', true);
        fieldsets.find('input[type = button]').hide();
    },
    /** Configura el formulario para cuando se está editando.
     * @returns {void}
     */
    configurarModoEdicion: function () {
        gestionarsuscripcionModelo.modoConsulta = true;
        var fieldsets = $('#fieldsetDatosTercero, #fieldsetPropiedad, #fieldsetDetallesSuscripcion, #fieldsetConceptos');
        fieldsets.find('input[type = button]').show();
    },
    /** Hace petición ajax para consultar los detalles de una suscripción
     * @param {int}  idsuscripcion - Identificador de la suscripción seleccionada
     * @returns {void}
     */
    consultarDetalleSuscripcion: function (idsuscripcion) {
        var data = {'idsuscripcion': idsuscripcion};
        gestionarsuscripcionControl.consultarDetalleSuscripcion(data, that.onconsultarDetalleSuscripcionCompleto);
    },
    /** Valida la información para la búsqueda de suscripciones y en caso de ser correcta hace 
     * petición ajax para consultar suscripciones que coincidan.
     * @returns {void}
     */
    consultarSuscriptor: function () {
        var dialogo = $('div#divBuscarSuscriptor');
        var idtercero = gestionarsuscripcionModelo.idTercero;
        var idsuscriptor = dialogo.find('#txtIdSuscriptorNuevo').val().trim();
        var cedula = dialogo.find('#txtDocumentoTerceroNuevo').val().trim();
        if (idsuscriptor === '' && cedula === '' && ($('#txtNombreTerceroNuevo').val() === '' && !!idTercero)) {
            dialogo.find('#spanMensaje').text(__app.mensajes.camposInvalidosFiltro).show();
        } else {
            var data = {idsuscriptor: idsuscriptor, idtercero: idtercero, cedula: cedula};
            gestionarsuscripcionControl.consultarSuscriptor(data, that.onConsultarSuscriptorCompleto);
        }
    },
    /** Confirma si el usuario desea cancelar la operación actual
     * @returns {void}
     */
    cancelarOperacion: function () {
        if (!!(gestionarsuscripcionModelo.suscriptor || gestionarsuscripcionModelo.suscripciones)) {
            $('div#divConfirmarCancelar').dialogo({
                resizable: false,
                heigth: 140,
                modal: true,
                title: 'Cancelar la Operación',
                buttons: {
                    "Sí": function () {
                        that.reiniciarProceso();
                        $(this).dialog('close');
                    }, No: function () {
                        $(this).dialog("close");
                    }
                }
            });
        }

    },
    /** Calcula el valor total de un concepto según la cantidad y valor escritos
     * @returns {void}
     */
    calcularValorTotal: function () {
        var cantidad = $('div#divEditarConcepto').find('input#txtCantidad').val().trim();
        var valorUnitario = $('div#divEditarConcepto').find('input#txtValorUnitario').val().trim();
        if ((cantidad === '') || (valorUnitario === '')) {
            $('div#divEditarConcepto').find('input#txtValorTotal').val('');
            return;
        }
        var valorTotal = (cantidad * valorUnitario);
        $('div#divEditarConcepto').find('input#txtValorTotal').val(valorTotal);
    },
    /** Configura caja de texto para funcionar con autocomplete
     * @returns {void}
     */
    cargarAutocomplete: function () {
        __dom.configurarAutocomplete(
                $('#txtNombreTerceroBuscar, #txtNombreTerceroNuevo'),
                that.sourceAutoComplete,
                function (event, ui) {
                    gestionarsuscripcionModelo.idTercero = ui.item.idVal;
                    $(event.target).parent().find('#idTercero').val(ui.item.idVal);
                    $(event.target).attr('data-idtercer', ui.item.idVal);
                },
                function (txt) {
                    gestionarsuscripcionModelo.idTercero = undefined;
                    txt.parent().find('#idTercero').val('');
                    txt.removeAttr('data-idtercer');
                }
        );
    },
    /** Carga la cabecera del formulario con los datos del tercero responsable de la suscripción seleccionada.
     * @param {object} suscriptor - Información del tercero
     * @returns {void}
     */
    cargarDatosTercero: function (suscriptor) {
        gestionarsuscripcionModelo.modoConsulta = false;
        var fieldset = $('fieldset#fieldsetDatosTercero');
        fieldset.find('#txtDocumento').val(suscriptor.cedula);
        fieldset.find('#txtNombre').val(suscriptor.nombretercero);
        fieldset.find('#txtIdTercero').val(suscriptor.idtercero);
        fieldset.find('#txtIdMedidor').val(suscriptor.idmedidor);
        fieldset.find('#txtTelefonoFijo').val(suscriptor.telefonofijo);
        fieldset.find('#txtTelefonoCelular').val(suscriptor.telefonocelular);
        fieldset.find('#txtIdSuscriptor').val(suscriptor.idsuscriptor);
        fieldset.find('#txtConvenio').val(suscriptor.convenio);
        fieldset.find('#txtDescripcion').val(suscriptor.descripcion);
    },
    /** Carga cajas de texto con los datos de la propiedad asociada a la suscripción seleccionada.
     * @param {object} suscriptor - Información de la propiedad
     * @returns {void}
     */
    cargarPropiedad: function (propiedad) {
        var fieldset = $('fieldset#fieldsetPropiedad');
        gestionarsuscripcionModelo.propiedadSeleccionada = propiedad;
        var altoriesgo = propiedad.altoriesgo === 'S' ? 'Sí' : 'No';
        fieldset.find('#txtNumeroPropiedad').val(propiedad.numeropropiedad);
        fieldset.find('#txtTipoPropiedad').val(propiedad.tipopropiedad);
        fieldset.find('#txtMunicipio').val(propiedad.municipio);
        fieldset.find('#txtBarrio').val(propiedad.barrio);
        fieldset.find('#txtDireccion').val(propiedad.direccion);
        fieldset.find('#txtSeccion').val(propiedad.seccion);
        fieldset.find('#txtManzana').val(propiedad.manzana);
        fieldset.find('#txtAltoRiesgo').val(altoriesgo);
        fieldset.find('#txtNumeroCatastral').val(propiedad.numerocatastral);
        fieldset.find('#txtDescripcion').val(propiedad.descripcion);
        var zona = propiedad.zona === 'U' ? 'Urbana' : 'Rural';
        fieldset.find('#txtZona').val(zona);
        fieldset.show();
    },
    /** Carga la cabecera del formulario con los datos de la suscripción seleccionada.
     * @param {object} suscriptor - Información de la suscripción seleccionada
     * @returns {void}
     */
    cargarSuscripcion: function (suscripcion) {
        var fieldset = $('#fieldsetDetallesSuscripcion');
        fieldset.find('#txtRuta').val(suscripcion.ruta);
        fieldset.find('#txtCiclo').val(suscripcion.ciclo);
        fieldset.find('#cboEstrato').val(suscripcion.estrato);
        fieldset.find('#txtFechaInicio').val(suscripcion.fechainicio);
        fieldset.find('#txtDescripcion').val(suscripcion.descripcion);
        fieldset.find('#txtIdSuscripcion').val(suscripcion.idsuscripcion);
        fieldset.find('#txtFactorCorreccion').val(suscripcion.factorcorreccion);
        fieldset.find('#txtCodigoAnterior').val(gestionarsuscripcionModelo.suscripciones.codigoanterior);

        fieldset.find('#cboLiquidacion').empty()
                .append($('<option>')
                        .text(suscripcion.liquidacion)
                        .val(suscripcion.idliquidacion));
        fieldset.find('#cboTipoUso').empty()
                .append($('<option>')
                        .text(suscripcion.tipousosuscripcion)
                        .val(suscripcion.idtipousosuscripcion));
        fieldset.find('#cboTipoSuscripcion').empty()
                .append($('<option>')
                        .text(suscripcion.tiposuscripcion)
                        .val(suscripcion.idtiposuscripcion));
        fieldset.find('#cboActividadEconimica').empty()
                .append($('<option>')
                        .text(suscripcion.actividadeconomica)
                        .val(suscripcion.idactividadeconomica));

        var comboEstado = fieldset.find('#cboEstado');
        if (suscripcion.estado === 'P' && comboEstado.find('option[value="P"]').length === 0) {
            comboEstado.append($('<option>').val('P').text('Pendiente'));
        }
        comboEstado.val(suscripcion.estado);
    },
    /** Confirma si el usuario desea iniciar una nueva búsqueda.
     * @returns {void}
     */
    confirmarBuscarSuscripcion: function () {
        $('#btnAgregarConceptos').hide();
        if (gestionarsuscripcionModelo.accion !== 'I') {
            that.mostrarBuscarSuscripcion();
            return;
        }
        $('#divConfirmarBuscarSuscripcion').dialogo({
            resizable: false,
            heigth: 140,
            modal: true,
            title: 'Confirmar Búsqueda',
            buttons: {
                "Sí": function () {
                    $(this).dialog('close');
                    that.reiniciarProceso();
                    that.mostrarBuscarSuscripcion();
                }, Cancelar: function () {
                    $(this).dialog("close");
                }
            }
        });
    },
    /** Confirma si el usuario desea eliminar un registro de la tabla conceptos.
     * @returns {void}
     */
    confirmarEliminar: function () {
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
    /** Hace petición ajax para consultar barrios según municipio.
     * @returns {void}
     */
    consultarBarrios: function () {
        gestionarsuscripcionControl.consultarBarrios({'idmunicipio': $(this).val()},
                that.onConsultarBarriosCompleto);
    },
    /** Hace petición ajax para consultar conceptos 
     * @returns {void}
     */
    consultarConceptosDesdeModificar: function () {
        var data = {'idsuscripcion': gestionarsuscripcionModelo.idsuscripcion};
        gestionarsuscripcionControl.consultarConceptosDesdeModificar(data, that.onConsultarConceptosDesdeModificarCompleto);
    },
    /** Hace petición ajax para consultar conceptos a partir de la liquidación seleccionada
     * @returns {void}
     */
    consultarConceptos: function () {
        var fieldset = $('#fieldsetDetallesSuscripcion');
        var idliquidacion = fieldset.find('#cboLiquidacion').val();
        var idprograma = 58;
        if (idliquidacion === null || idliquidacion === '-1') {
            __dom.lanzarAlerta('Debe seleccionar una liquidación', __app.mensajes.atencion);
            gestionarsuscripcionModelo.conceptos = [];
            var fieldset = $('fieldset#fieldsetConceptos').hide();
            fieldset.find('table#tblConceptos').empty();
            return;
        }
        var data = {'idliquidacion': idliquidacion, 'idprograma': idprograma};
        gestionarsuscripcionControl.consultarConceptos(data, that.onConsultarConceptosCompleto);
    },
    /** Hace petición ajax para consultar ciclo y ruta según municipio y barrio
     * @returns {void}
     */
    consultarCicloRuta: function () {
        var idmunicipio = gestionarsuscripcionModelo.propiedadSeleccionada.idmunicipio;
        var idbarrio = gestionarsuscripcionModelo.propiedadSeleccionada.idbarrio;
        var data = {idmunicipio: idmunicipio, idbarrio: idbarrio};
        gestionarsuscripcionControl.consultarCicloRuta(data, that.onConsultarCicloRutaCompleto);
    },
    /**
     * Hace peticion ajax para consultar las actividades economicas
     * @returns {undefined}
     */
    consultarActividadEconomica: function () {
        gestionarsuscripcionControl.consultarActividadEconomica(that.onConsultarActividadEconomicaCompleto);
    },
    /** Hace petición ajax para consultar propiedades asignadas a un tercero y las propiedades que 
     *  no se han asignado
     * @returns {void}
     */
    consultarPropiedades: function () {
        if (!gestionarsuscripcionModelo.suscriptor) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarSuscripcion, __app.mensajes.atencion);
            return;
        }
        var idtercero = gestionarsuscripcionModelo.suscriptor.idtercero;
        if (idtercero === '') {
            __dom.lanzarAlerta(__app.mensajes.seleccionarSuscripcion, __app.mensajes.atencion);
        } else {
            gestionarsuscripcionControl.consultarPropiedad({idtercero: idtercero}, that.onConsultarPropiedadCompleto);
        }
    },
    /** Hace petición ajax para consultar liquidaciones.
     * @returns {void}
     */
    consultarLiquidaciones: function () {
        var idtipousosuscripcion = $('#cboTipoUso').val();
        if (idtipousosuscripcion !== '-1' && idtipousosuscripcion) {
            var idciclo = gestionarsuscripcionModelo.ciclo.idciclo;
            var idmunicipio = gestionarsuscripcionModelo.propiedadSeleccionada.idmunicipio;
            var data = {idciclo: idciclo, idtipousosuscripcion: idtipousosuscripcion, idmunicipio: idmunicipio};
            gestionarsuscripcionControl.consultarLiquidaciones(data, that.onConsultarLiquidacionesCompleto);
        } else {
            $('#cboLiquidacion').empty();
        }
    },
    /** Valida la información del formulario de filtro de suscripción según la combinación 
     * establecida en caso de tener campos vacíos muestra alerta.
     * @returns {void}
     */
    validarCamposBuscarSuscripcion: function () {
        if ($('#cboMunicipio').val() === '-1' || !$('#cboMunicipio').val()) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarMunicipio, __app.mensajes.atencion);
            return;
        }

        var contador = 0;
        var campos = $('#divBuscarSuscripcion input');
        if ($('#cboBarrio').val() === '-1') {
            contador++;
            $.each(campos, function (i, campo) {
                if ($(campo).val() === '') {
                    contador++;
                }
            });
        }
        if (campos.length < contador) {
            __dom.lanzarAlerta(__app.mensajes.camposInvalidosFiltro, __app.mensajes.atencion);
            return;
        }

        that.consultarSuscripcion();

    },
    /** Valida la existencia de conceptos en la suscripción
     * @returns {void}
     */
    validarCantidadConceptos: function () {
        gestionarsuscripcionModelo.fila = $(this).parent().parent().attr('data-fila');
        that.confirmarEliminar();
    },
    /** Valida que los detalles de la suscripción estén completos
     * @returns {void}
     */
    validarCamposDetallesSuscripcion: function () {
        var no = $('#txtIdSuscripcion, #txtCodigoAnterior');
        var campos = $('#fieldsetDetallesSuscripcion').find('input[type = text], select').not(no);
        var camposRequeridos = gestionarsuscripcionModelo.camposRequeridos = 0;
        $.each(campos, function (index, campo) {
            var valorCampo = $(campo).val();
            camposRequeridos = ((valorCampo === '') || (valorCampo === '-1')) ? camposRequeridos + 1 : camposRequeridos;
        });
        gestionarsuscripcionModelo.camposRequeridos = camposRequeridos;

    },
    /** Valida información para grabar la suscripción
     * @returns {void}
     */
    validarGrabarSuscripcion: function () {
        if (gestionarsuscripcionModelo.modoConsulta) {
            __dom.lanzarAlerta('No puede grabar en modo consulta', __app.mensajes.atencion);
            return;
        }
        that.validarCamposDetallesSuscripcion();
        if (gestionarsuscripcionModelo.camposRequeridos !== 0) {
            __dom.lanzarAlerta('Debe llenar todos los campos en detalles de suscripción', __app.mensajes.atencion);
            return;
        }

        that.validarTablaConceptos();
        if (gestionarsuscripcionModelo.camposRequeridos === 0) {
            that.grabarSuscripcion();
            return;
        }
        __dom.lanzarAlerta('Debe llenar todas las celdas en la tabla conceptos y/o eliminar los conceptos que no se requieran', __app.mensajes.atencion);
    },
    /** Valida que todos los conceptos tengan valor total
     * @returns {void}
     */
    validarTablaConceptos: function () {
        var conceptos = $('#tblConceptos tbody tr');//gestionarsuscripcionModelo.conceptos;
        $.each(conceptos, function (index, concepto) {
            var valor = $(concepto).find('td[header="thValorTotal"]').text();
            if (valor === '' || valor === '-') {
                gestionarsuscripcionModelo.camposRequeridos++;
            }
        });
    },
    /** Valida tipo de cálculo para cada concepto en caso de ser F se deshabilita opción de editar
     * @returns {void}
     */
    validarTipoCalculo: function (tabla) {
        var conceptos = gestionarsuscripcionModelo.conceptos;
        $.each(conceptos, function (index, concepto) {
            if (concepto.tipocalculo === 'F') {
                var fila = tabla.find('tr[data-fila = ' + index + ']');
                var btnEliminar = fila.find('td[header = "thEditar"] input[type = "button"]');
                btnEliminar.prop('disabled', true).addClass('btnDisabled');
            }
        });
    },
    /** Hace petición ajax para consultar suscripciones que coincidan con los parámetros de.
     * @returns {void}
     */
    consultarSuscripcion: function () {
        var div = $('#divBuscarSuscripcion');
        var idmunicipio = div.find('#cboMunicipio').val().trim();
        var _idTerceroControl = div.find('#txtNombreTerceroBuscar').attr('data-idtercer');
        var idtercero = _idTerceroControl ? _idTerceroControl : null;
        var cedula = div.find('#txtDocumentoTerceroBuscar').val().trim();
        var direccion = div.find('#txtDireccionBuscar').val().trim();
        var numerocatastral = div.find('#txtNumeroCatastralBuscar').val().trim();
        var idbarrio = div.find('#cboBarrio').val();
        var numeropropiedad = div.find('#txtNumeroPropiedad').val().trim();
        var idsuscripcion = div.find('#txtIdSuscripcion').val().trim();
        var codigoanterior = div.find('#txtCodigoAnterior').val().trim();
        var ruta = div.find('#txtNumeroRuta').val().trim();

        var data = {
            'idmunicipio': idmunicipio,
            'idtercero': idtercero,
            'cedula': cedula,
            'direccion': direccion,
            'numerocatastral': numerocatastral,
            'idbarrio': idbarrio,
            'numeropropiedad': numeropropiedad,
            'idsuscripcion': idsuscripcion,
            'codigoanterior': codigoanterior,
            'ruta': ruta
        };
        gestionarsuscripcionControl.consultarSuscripcion(data, that.onConsultarSuscripcionCompleto);
    },
    /** Hace petición ajax para consultar los tipos de suscripción según convenio y municipio
     * @returns {void}
     */
    consultarTiposSuscripcion: function () {
        $('#btnAgregarConceptos').show();
        gestionarsuscripcionModelo.conceptosAsignados = [];
        var idconvenio = gestionarsuscripcionModelo.suscriptor.idconvenio;
        var idmunicipio = gestionarsuscripcionModelo.propiedadSeleccionada.idmunicipio;
        var data = {idconvenio: idconvenio, idmunicipio: idmunicipio};
        $('#fieldsetDetallesSuscripcion').find('div.oculto').hide();
        gestionarsuscripcionControl.consultarTiposSuscripcion(data, that.onConsultarTiposSuscripcionCompleto);
    },
    /** Hace petición ajax para consultar los tipos de uso suscripción según ciclo
     * @returns {void}
     */
    consultarTiposUsoSuscripcion: function (e) {
        /*
        var idtiposuscripcion = $(e.currentTarget).val();
        var data = {idtiposuscripcion: idtiposuscripcion};
        gestionarsuscripcionControl.consultarTiposUsoSuscripcion(data, that.onConsultarTiposUsoSuscripcionCompleto);
        */
        
        if (gestionarsuscripcionModelo.ciclo.idciclo) {
            var data = { idciclo: gestionarsuscripcionModelo.ciclo.idciclo };
            gestionarsuscripcionControl.consultarTiposUsoCiclo(data, that.onConsultarTiposUsoSuscripcionCompleto);
        }
    },
    /** Elimina un concepto del modelo y la tabla
     * @returns {void}
     */
    eliminarRegistro: function () {
        var fila = gestionarsuscripcionModelo.fila;
        var concepto = gestionarsuscripcionModelo.conceptosAsignados[fila];
        gestionarsuscripcionModelo.conceptosAsignados.splice(fila, 1);

        var idconcepto = concepto.idconcepto;

        var param = {'idconcepto': idconcepto};
        gestionarsuscripcionControl.consultarConceptoPorId(param, that.cargarConceptoSinAsignar);
        gestionarsuscripcionModelo.conceptos.splice(fila, 1);
        that.llenarTablaConceptosAsignados();
    },
    /** Hace petición ajax para grabar los cambios hechos de la suscripción.
     * @returns {void}
     */
    grabarSuscripcion: function () {
        var jsonGrabar = gestionarsuscripcionModelo.jsonGrabar = {};
        var datosTercero = $('fieldset#fieldsetDatosTercero');
        var datosPropiedad = gestionarsuscripcionModelo.propiedadSeleccionada;
        var detallesSuscripcion = $('fieldset#fieldsetDetallesSuscripcion');
        var conceptos = gestionarsuscripcionModelo.conceptosAsignados;

        //datos de la suscripción
        var estado = "P";
        var descripcion = detallesSuscripcion.find('#txtDescripcion').val();
        var idsuscriptor = datosTercero.find('#txtIdSuscriptor').val();
        var idtercero = datosTercero.find('#txtIdTercero').val();
        var idpropiedad = datosPropiedad.idpropiedad;
        var idmunicipio = datosPropiedad.idmunicipio;
        var idbarrio = datosPropiedad.idbarrio;
        var idtiposuscripcion = detallesSuscripcion.find('#cboTipoSuscripcion').val();
        var idtipousosuscripcion = detallesSuscripcion.find('#cboTipoUso').val();
        var idliquidacion = detallesSuscripcion.find('#cboLiquidacion').val();
        var idciclo = detallesSuscripcion.find('#txtCiclo').attr('idciclo');
        var fechainicio = detallesSuscripcion.find('#txtFechaInicio').val();
        var estrato = detallesSuscripcion.find('#cboEstrato').val();
        var factorcorreccion = detallesSuscripcion.find('#txtFactorCorreccion').val();
        var idactividadeconomica = detallesSuscripcion.find('#cboActividadEconimica').val();

        jsonGrabar.suscripcion = {
            "estado": estado,
            "descripcion": descripcion,
            "idsuscriptor": idsuscriptor,
            "idtercero": idtercero,
            "idpropiedad": idpropiedad,
            "idmunicipio": idmunicipio,
            "idbarrio": idbarrio,
            "idtiposuscripcion": idtiposuscripcion,
            "idtipousosuscripcion": idtipousosuscripcion,
            "idliquidacion": idliquidacion,
            "idciclo": idciclo,
            "fechainicio": fechainicio,
            "estrato": estrato,
            "factorcorreccion": factorcorreccion,
            "idactividadeconomica": idactividadeconomica
        };

        console.log(jsonGrabar.suscripcion);

        //datos de los conceptos
        jsonGrabar.conceptos = [];
        if (!!conceptos) {
            $.each(conceptos, function (index, concepto) {
                jsonGrabar.conceptos[index] = {
                    "cantidad": concepto.cantidad,
                    "valorunitario": concepto.valorunitario,
                    "valortotal": concepto.valortotal,
                    "fechainicio": concepto.fechainicio === '' ? null : concepto.fechainicio,
                    "fechafin": concepto.fechafinal === '' ? null : concepto.fechafinal,
                    "idliquidacion": idliquidacion,
                    "idconcepto": concepto.idconcepto,
                    "estado": "A"
                };
            });
        }

        jsonGrabar.ruta = {'idruta': gestionarsuscripcionModelo.ruta.idruta};
        var data = {'datos': jsonGrabar};
        gestionarsuscripcionControl.grabarSuscripcion(data, that.onGrabarSuscripcionCompleto);
    },
    /** Muestra dialogo para configurar una nueva suscripción
     * @returns {void}
     */
    iniciarNuevaSuscripcion: function () {
        that.consulta = false;
        that.limpiarDialogoBuscarSuscriptor();
        var filtro = $('div#divBuscarSuscriptor');
        that.dialogoActual = filtro.dialogo({
            modal: true,
            width: 850,
            title: 'Buscar un suscriptor'
        });
    },
    /** Consulta las propiedades que se asignarán...
     * @returns {void}
     */
    leerFila: function () {
        var radio = that.dialogoActual.find('input[name="tblPropiedadesSinAsignar_radioGroup"]:checked');
        var indiceRegistro = gestionarsuscripcionModelo.indiceRegistro = parseInt(radio.parent().parent().attr('data-fila'));
        console.log('indice fila: ' + indiceRegistro);
    },
    /** Carga información de conceptos en la tabla y configura los controles
     * @returns {void}
     */
    llenarTablaConceptos: function () {
        var fieldset = $('fieldset#fieldsetConceptos').hide();
        fieldset.find('table#tblConceptos').empty();
        if (gestionarsuscripcionModelo.conceptos.length > 0) {
            if (gestionarsuscripcionModelo.modoConsulta) {
                var tabla = fillTable('tblConceptos', 'formatoConceptosConsultar', 'gestionarsuscripcionModelo.conceptos', '').show();
            } else {
                var tabla = fillTable('tblConceptos', 'formatoConceptos', 'gestionarsuscripcionModelo.conceptos', '').show();
                tabla.find('td[header = "thEditar"] input[type = "button"]').on('click', that.mostrarEditarConcepto);
                tabla.find('td[header = "thEliminar"] input[type = "button"]').on('click', that.validarCantidadConceptos);
            }
            that.validarTipoCalculo(tabla);
            fieldset.show();
        }
    },
    /**
     * Carga la información de los conceptos asignados de una suscripción para poder editar
     */
    llenarTablaConceptosAsignados: function () {
        var fieldset = $('fieldset#fieldsetConceptos').hide();
        fieldset.find('table#tblConceptos').empty();
        if (gestionarsuscripcionModelo.conceptosAsignados.length > 0) {
            var tabla = fillTable('tblConceptos', 'formatoConceptos', 'gestionarsuscripcionModelo.conceptosAsignados', '').show();
            tabla.find('td[header = "thEditar"] input[type = "button"]').on('click', that.mostrarEditarConcepto);
            tabla.find('td[header = "thEliminar"] input[type = "button"]').on('click', that.validarCantidadConceptos);
            that.validarTipoCalculo(tabla);
            fieldset.show();
        }
    },
    /** Muestra las propiedades asignadas a la suscripción en la tabla
     * @returns {void}
     */
    llenarTablaPropiedadesAsignadas: function () {
        $('table#tblPropiedadesAsignadas').empty();
        var propiedadesAsignadas = gestionarsuscripcionModelo.propiedadesAsignadas;
        if (propiedadesAsignadas.length === 0) {
            $('#propiedadesAsignadas').find('span#mensaje').show();
            return;
        }
        fillTable('tblPropiedadesAsignadas', 'formatoPropiedadesAsignadas', 'gestionarsuscripcionModelo.propiedadesAsignadas', '');
    },
    /** Muestra todas las propiedades sin asignar en una tabla.
     * @returns {void}
     */
    llenarTablaPropiedadesSinAsignar: function () {
        $('table#tblPropiedadesSinAsignar').empty();
        if (gestionarsuscripcionModelo.propiedadesSinAsignar.length === 0) {
            $('#propiedadesSinAsignar').find('span#mensaje').show();
            return;
        }
        var tabla = fillTable('tblPropiedadesSinAsignar', 'formatoPropiedadesSinAsignar', 'gestionarsuscripcionModelo.propiedadesSinAsignar', '');
        tabla.find('input[name="tblPropiedadesSinAsignar_radioGroup"]').on('change', that.leerFila);
    },
    /** Muestra cuadro de dialogo con formulario para buscar suscripción
     * @returns {void}
     */
    mostrarBuscarSuscripcion: function () {
        gestionarsuscripcionModelo.campoActivador = '';
        gestionarsuscripcionModelo.combinacion = '';
        var filtro = $('div#divBuscarSuscripcion');
        filtro.find('input[type = text], select').prop('disabled', false);
        filtro.find('#cboMunicipio').val('-1').change();
        filtro.find('#cboBarrio option').remove();
        filtro.find('#divBuscarSuscripcion input[type = text]').val('');
        filtro.find('#divBuscarSuscripcion select').val(-1);
        that.dialogoActual = filtro.dialogo({
            modal: true,
            width: 850,
            close: function () {
                $(this).find('input:text').val('').siblings('select').val(-1);
                $(this).find('#txtNombreTerceroBuscar').removeAttr('data-idtercer');
                $(this).find('.listaSeleccion').empty();
                $(this).find('.btn-finalizar-consultar').remove();
            },
            position: {my: "center", at: "top", of: "#contenedor"},
            title: 'Buscar una suscripción',
            buttons: {
                Buscar: function () {
                    that.validarCamposBuscarSuscripcion();
                },
                Cancelar: function () {
                    $(this).dialog('close');
                }
            }
        });
    },
    /** Captura la respuesta del servidor cuando se consultan barrios.
     * @param {object} data - Respuesta del servidor con barrios de un municipio
     * @returns {void}
     */
    onConsultarBarriosCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(__app.mensajes.sinResultados, __app.mensajes.atencion);
                break;
            case 1:
                var cboBarrio = $('div#divBuscarSuscripcion #cboBarrio').empty();
                __dom.llenarCombo(cboBarrio, data.barrios, 'idbarrio', 'barrio');
                break;
        }
    },
    /** Captura la respuesta del servidor cuando se consulta los detalles de una suscripción
     * @param {object} data - Respuesta del servidor con detalles de una suscripción.
     * @returns {void}
     */
    onconsultarDetalleSuscripcionCompleto: function (data) {
        var resumen = data.resumensuscripcion;
        gestionarsuscripcionModelo.idsuscripcion = resumen.suscripcion.idsuscripcion;

        var divBuscador = $('#divBuscarSuscripcion');
        divBuscador.find('input:text').val('');
        divBuscador.find('select').val(-1);

        that.cargarDatosTercero(resumen.tercero);
        that.cargarPropiedad(resumen.propiedad);
        that.cargarSuscripcion(resumen.suscripcion);
        that.consultarConceptosDesdeModificar();
        that.configurarModoConsulta();
    },
    /**
     * Verifica si un concepto se puede eliminar de los asignados para la suscripción, en caso de ser así asigna el concepto a los conceptos sin asignar
     * @param data - Respuesta del servidor
     */
    onConsultarEliminarConceptoCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(__app.mensajes.sinResultados, __app.mensajes.atencion);
                break;
            case 1:
                if (parseInt(data.eliminar) === 1) {
                    var fila = gestionarsuscripcionModelo.fila;
                    gestionarsuscripcionModelo.conceptos.splice(fila, 1);

                    var concepto = gestionarsuscripcionModelo.conceptos[fila];
                    var idconcepto = concepto.idconcepto;

                    var param = {'idconcepto': idconcepto};
                    gestionarsuscripcionControl.consultarConceptoPorId(param, that.cargarConceptoSinAsignar);
                    gestionarsuscripcionModelo.conceptos.splice(fila, 1);
                    that.llenarTablaConceptos();
                } else {
                    __dom.lanzarAlerta('Lo sentimos, el concepto no se puede eliminar.', 'Eliminar concepto');
                }

                break;
        }
    },
    /** Captura la respuesta del servidor cuando se consulta las propiedades asignadas y sin asignar
     * @param {object} data - Respuesta del servidor con propiedades
     * @returns {void}
     */
    onConsultarPropiedadCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(__app.mensajes.sinResultados, __app.mensajes.atencion);
                break;
            case 1:
                gestionarsuscripcionModelo.propiedadesAsignadas = data.propiedades.asignadas;
                gestionarsuscripcionModelo.propiedadesSinAsignar = data.propiedades.sinasignar;
                that.mostrarSeleccionarPropiedad();
                break;
        }
    },
    /** Captura la respuesta del servidor cuando se consultan conceptos
     * @param {object} data - Respuesta del servidor con conceptos
     * @returns {void}
     */
    onConsultarConceptosDesdeModificarCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                var fieldset = $('fieldset#fieldsetConceptos').hide();
                fieldset.find('table#tblConceptos').empty();
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                break;
            case 1:
                var conceptos = gestionarsuscripcionModelo.conceptos = data.conceptos;
                if (!gestionarsuscripcionModelo.modoConsulta) {
                    $.each(conceptos, function (index, concepto) {
                        switch (concepto.tiporegistro) {
                            case "U":
                                concepto.cantidad = 1;
                                concepto.valorunitario =
                                        (concepto.valor || concepto.valor === 0) ? concepto.valor : '';
                                break;
                            case "N":
                                concepto.cantidad = concepto.valorunitario = 'NA';
                                break;
                            case "C":
                            case "T":
                                concepto.cantidad = '';
                                concepto.valorunitario =
                                        (concepto.valor || concepto.valor === 0) ? concepto.valor : '';
                                break;
                        }
                        concepto.fechainicial = concepto.fechafinal = '';
                        concepto.valortotal = (
                                (concepto.cantidad || concepto.cantidad === 0) &&
                                (concepto.valor || concepto.valor === 0)
                                ) ? (concepto.cantidad * concepto.valor) : '';
                    });
                }

                that.llenarTablaConceptos();
                break;
            case -3:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                break;
        }
    },
    /** Captura la respuesta del servidor cuando se consultan conceptos
     * @param {object} data - Respuesta del servidor con conceptos
     * @returns {void}
     */
    onConsultarConceptosCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(__app.mensajes.sinResultados, __app.mensajes.atencion);
                gestionarsuscripcionModelo.conceptos = [];
                var fieldset = $('fieldset#fieldsetConceptos').hide();
                fieldset.find('table#tblConceptos').empty();
                break;
            case 1:
                var conceptos = gestionarsuscripcionModelo.conceptos = data.conceptos;
                $.each(conceptos, function (index, concepto) {
                    that.configurarConcepto(index, concepto);
                });
                that.cargarListaConceptosSinAsignar(data);
                //that.llenarTablaConceptos();
                break;
            case -3:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                break;
        }
    },

    /**
     * Configura la información de los conceptos para su edición
     * @param {type} i - Posición en algún arreglo (esto es porque se llama desde un $.each)
     * @param {Object} concepto - Objeto con información del concepto que tiene asociado una suscripción
     */
    configurarConcepto: function (i, concepto) {
        switch (concepto.tiporegistro) {
            case "U":
                concepto.cantidad = 1;
                concepto.valorunitario =
                        (concepto.valor || concepto.valor === 0) ? concepto.valor : '';
                break;
            case "N":
                concepto.cantidad = concepto.valorunitario = 'NA';
                break;
            case "C":
            case "T":
                concepto.cantidad = '';
                concepto.valorunitario =
                        (concepto.valor || concepto.valor === 0) ? concepto.valor : '';
                break;
        }
        concepto.fechainicial = concepto.fechafinal = '';
        concepto.valortotal = (
                (concepto.cantidad || concepto.cantidad === 0) &&
                (concepto.valor || concepto.valor === 0)
                ) ? (concepto.cantidad * concepto.valor) : '';
    },
    /** Captura la respuesta del servidor cuando se consultan ciclo y ruta
     * @param {object} data - Respuesta del servidor con ciclo y ruta
     * @returns {void}
     */
    onConsultarCicloRutaCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(__app.mensajes.sinResultados, __app.mensajes.atencion);
                break;
            case 1:
                gestionarsuscripcionModelo.ruta = data.ruta;
                gestionarsuscripcionModelo.ciclo = data.ciclo;
                var fieldset = $('fieldset#fieldsetDetallesSuscripcion');
                fieldset.find('#txtRuta').val(data.ruta.ruta).attr('idruta', data.ruta.idruta);
                fieldset.find('#txtCiclo').val(data.ciclo.ciclo).attr('idciclo', data.ciclo.idciclo);
                fieldset.find('#txtFactorCorreccion').val(gestionarsuscripcionModelo.propiedadSeleccionada.factorcorreccion);
                that.consultarTiposUsoSuscripcion();
                break;
        }

    },
    /**
     * Captura la respuesta del servidro cuando consulta las actividadea economicas
     * @param {type} data - Respuesta del servidor con las actividades economicas
     * @returns {undefined}
     */
    onConsultarActividadEconomicaCompleto: function (data) {
        gestionarsuscripcionModelo.actividadesEconomicas = data;
        var cboActividadEconomica = $('#cboActividadEconimica').empty();
        __dom.llenarCombo(cboActividadEconomica, data.datos, 'idunidad', 'nombre');


    },
    /** Captura la respuesta del servidor cuando se consultan liquidaciones y carga un combo
     * @param {object} data - Respuesta del servidor con liquidaciones
     * @returns {void}
     */
    onConsultarLiquidacionesCompleto: function (data) {
        that.limpiarTablaConceptos();
        var cboLiquidacion = $('#cboLiquidacion').empty();
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(__app.mensajes.sinResultados, __app.mensajes.atencion);
                break;
            case 1:
                __dom.llenarCombo(cboLiquidacion, data.liquidaciones, 'idliquidacion', 'liquidacion');

                if (gestionarsuscripcionModelo.idliquidacion && cboLiquidacion.find('option[value="' + gestionarsuscripcionModelo.idliquidacion + '"]').length > 0) {
                    cboLiquidacion.val(gestionarsuscripcionModelo.idliquidacion);

                    var data = {
                        idliquidacion: $('#cboLiquidacion').val(),
                        idprograma: 58,
                        idsuscripcion: gestionarsuscripcionModelo.suscripcion.idsuscripcion
                    };
                    gestionarsuscripcionControl.consultarConceptos(data, that.cargarListaConceptosSinAsignar);
                } else {
                    cboLiquidacion.val(-1);
                }
                break;
        }
    },
    /** Captura la respuesta enviada por el servidor, cuando se consultan las suscripciones.
     * En caso de llegar varias suscripciones posibilita la selección de una.
     * @param  {object} data - Respuesta del servidor con suscripciones que coinciden con la búsqueda
     * @returns {void}
     */
    onConsultarSuscripcionCompleto: function (data) {
        that.reiniciarProceso();
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(__app.mensajes.sinResultados, __app.mensajes.atencion);
                break;
            case 1:
                that.consulta = true;
                gestionarsuscripcionModelo.suscripciones = data.suscripciones;
                if (data.suscripciones.length > 1) {
                    that.dialogoActual.find('div.listaSeleccion, .btn-finalizar-consultar').remove();
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
                        label.text(suscripcion.cedula + ' - ' + suscripcion.nombretercero + ' - ' + suscripcion.idsuscripcion + ' - ' + suscripcion.direccion);
                        div.append(radio).append(label);
                        divSuscripciones.append(div);
                    });
                    var btn = $('<button>').text('Finalizar').addClass('btnSimple btn-finalizar-consultar');
                    btn.on('click', function () {
                        var suscSeleccionada = that.dialogoActual.find('input[name="radio_suscripciones"]:checked');
                        if (suscSeleccionada.length > 0) {
                            var suscripcion = gestionarsuscripcionModelo.suscripciones = data.suscripciones[suscSeleccionada.attr('data-indice')];
                            that.dialogoActual.find('div.listaSeleccion, .btn-finalizar-consultar').remove();
                            that.dialogoActual.find('#spanMensaje').hide();
                            that.dialogoActual.dialog('close');
                            divSuscripciones.remove();
                            that.consultarDetalleSuscripcion(suscripcion.idsuscripcion);
                        } else {
                            that.dialogoActual.find('#spanMensaje').text(__app.mensajes.seleccionarOpcion).show();
                        }
                    });
                    divSuscripciones.insertAfter(that.dialogoActual.find('#spanMensaje'));
                    btn.insertAfter(divSuscripciones);
                } else {
                    var suscripcion = gestionarsuscripcionModelo.suscripciones = data.suscripciones[0];
                    that.dialogoActual.find('div.listaSeleccion, .btn-finalizar-consultar').remove();
                    that.dialogoActual.find('#spanMensaje').hide();
                    that.dialogoActual.dialog('close');
                    that.consultarDetalleSuscripcion(suscripcion.idsuscripcion);
                }
                break;
        }
    },
    /** Captura la respuesta del servidor cuando se consultan tipos de suscripciones y carga un combo
     * @param {object} data - Respuesta del servidor con tipos de suscripciones
     * @returns {void}
     */
    onConsultarTiposSuscripcionCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(__app.mensajes.sinResultados, __app.mensajes.atencion);
                break;
            case 1:
                var fecha = __app.obtenerFechaSistema();
                var mes = fecha.getMonth() + 1 < 10 ? '0' + (fecha.getMonth() + 1) : fecha.getMonth() + 1;
                var dia = fecha.getDate() < 10 ? '0' + (fecha.getDate()) : fecha.getDate();
                fecha = fecha.getFullYear() + '/' + mes + '/' + dia;
                var fieldset = $('fieldset#fieldsetDetallesSuscripcion').show();
                fieldset.find('#txtFechaInicio').val(fecha);
                var cboTipoSuscripcion = fieldset.find('#cboTipoSuscripcion').empty();
                var divDetalle = $('#fieldsetDetallesSuscripcion');
                __dom.llenarCombo(cboTipoSuscripcion, data.tipossuscripcion, 'idtiposuscripcion', 'tiposuscripcion');
                divDetalle.find('#cboEstado')
                        .removeClass('sinBloqueo')
                        .attr('disabled', 'disabled')
                        .append(
                                $('<option>')
                                .val('P').text('Pendiente').prop('selected', true)
                                );
                that.consultarCicloRuta();
                that.consultarActividadEconomica();
                break;
        }
    },
    /** Captura la respuesta del servidor cuando se consultan tipos de uso y carga un combo
     * @param {object} data - Respuesta del servidor con tipos de suscripciones
     * @returns {void}
     */
    onConsultarTiposUsoSuscripcionCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta('No se encontraron Tipos de uso para el ciclo '+gestionarsuscripcionModelo.ciclo.ciclo, __app.mensajes.atencion);
                break;
            case 1:
                var cboTipoUso = $('#cboTipoUso').empty();
                __dom.llenarCombo(cboTipoUso, data.tiposusosuscripcion, 'idtipousosuscripcion', 'tipousosuscripcion');
                break;
        }
    },
    /** Captura la respuesta enviada por el servidor, cuando se consultan las suscriptores.
     * En caso de llegar varios suscriptores posibilita la selección de uno.
     * @param  {object} data - Respuesta del servidor con suscriptores que coinciden con la búsqueda
     * @returns {void}
     */
    onConsultarSuscriptorCompleto: function (data) {
        that.reiniciarProceso();
        gestionarsuscripcionModelo.accion = 'I';
        switch (data.codigoRespuesta) {
            case 0:
                that.dialogoActual.find('#spanMensaje').text(__app.mensajes.sinResultados).show();
                break;
            case 1:
                var sus = null;
                gestionarsuscripcionModelo.suscriptores = data.suscriptores;
                if (data.suscriptores.length > 1) {
                    that.dialogoActual.find('div.listaSeleccion').remove();
                    var divSuscriptores = $('<div>').addClass('listaSeleccion');
                    $.each(data.suscriptores, function (s, susc) {
                        var div = $('<div>');
                        var radio = $('<input type="radio">');
                        radio.val(susc.idsuscriptor);
                        radio.attr('id', 'radio_susc_' + s);
                        radio.attr('data-indice', s);
                        radio.attr('name', 'radio_suscriptores');

                        var label = $('<label>').attr('for', 'radio_susc_' + s);
                        label.text(susc.cedula + ' - ' + susc.nombretercero + ' - ' + susc.idsuscriptor +
                                ' - Convenio: ' + susc.convenio + ' -Descripción: ');
                        var descripcion = susc.descripcion;
                        var divDescripcion = $('#divDescripcion');
                        var span = $('<span>');
                        div.append(radio).append(label);
                        divSuscriptores.append(div);
                        span.insertAfter(label);

                        span.attr('title', descripcion);

                        if (descripcion.length > 50) {
                            span.text(descripcion.substring(0, 50) + '...');
                        } else {
                            span.text(descripcion);
                        }

                    });
                    var btn = $('<button>').text('Finalizar').addClass('btnSimple');
                    btn.on('click', function () {
                        var suscSeleccionado = that.dialogoActual.find('input[name="radio_suscriptores"]:checked');
                        if (suscSeleccionado.length > 0) {
                            sus = gestionarsuscripcionModelo.suscriptor = data.suscriptores[parseInt(suscSeleccionado.attr('data-indice'))];
                            that.configurarModoEdicion();
                            that.dialogoActual.find('#spanMensaje').hide();
                            that.dialogoActual.dialog('close');
                            divSuscriptores.remove();
                            that.cargarDatosTercero(sus);
                        } else {
                            that.dialogoActual.find('#spanMensaje').text(__app.mensajes.seleccionarOpcion).show();
                        }
                    });
                    divSuscriptores.insertAfter(that.dialogoActual.find('#spanMensaje'));
                    divSuscriptores.append(btn);
                } else {
                    sus = gestionarsuscripcionModelo.suscriptor = data.suscriptores[0];
                    that.dialogoActual.find('#spanMensaje').hide();
                    that.configurarModoEdicion();
                    that.dialogoActual.dialog('close');
                    that.cargarDatosTercero(sus);
                }
                break;
        }
    },
    /** Captura la respuesta del servidor cuando se guarda la información de una suscripción
     * @param {object} data - Respuesta del servidor.
     * @returns {void}
     */
    onGrabarSuscripcionCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 1:
                that.reiniciarProceso();
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.tituloExito);
                break;
        }
    },
    /** Limpia los valores del filtro de búsqueda
     * @returns {void}
     */
    limpiarDialogoBuscarSuscriptor: function () {
        var dialogo = $('div#divBuscarSuscriptor');
        dialogo.find('input[type="text"]').val('');
        dialogo.find('#spanMensaje').hide();
        dialogo.find('div.listaSeleccion').remove();
        gestionarsuscripcionModelo = {};
    },
    /** Muestra cuadro de dialogo con campos para editar un concepto según el tipo de registro
     * @returns {void}
     */
    mostrarEditarConcepto: function () {
        var fila = gestionarsuscripcionModelo.fila = $(this).parent().parent().attr('data-fila');
        var concepto = gestionarsuscripcionModelo.conceptosAsignados[fila];
        var tipoRegistro = concepto.tiporegistro;
        var valor = concepto.valor;
        var dialogo = $('div#divEditarConcepto');
        var cant = dialogo.find('input#txtCantidad');
        var uni = dialogo.find('input#txtValorUnitario');
        cant.val(concepto.cantidad);
        uni.val(concepto.valorunitario);
        dialogo.find('input#txtIdConcepto').val(concepto.idconcepto);
        dialogo.find('input#txtConcepto').val(concepto.concepto);
        dialogo.find('input#txtValorTotal').val(concepto.valortotal);
        dialogo.find('input#txtFechaInicial').val(concepto.fechainicial);
        dialogo.find('input#txtFechaFinal').val(concepto.fechafinal);

        switch (tipoRegistro) {
            case 'U':
                uni.prop('disabled', !(valor === null));
                cant.prop('disabled', true).val('1');
                break;
            case 'N':
                uni.prop('disabled', true);
                cant.prop('disabled', true);
                break;
            case 'C':
            case 'T':
                cant.prop('disabled', false);
                uni.prop('disabled', !(valor === null))
                break;
        }
        that.dialogoActual = dialogo.dialogo({
            modal: true,
            width: 850,
            title: 'Editar Concepto',
            buttons: {
                Aceptar: function () {
                    that.actualizarConcepto(concepto);
                    that.dialogoActual.dialog('close');
                }
            }
        });
    },
    /** Muestra cuadro de dialogo para asignar una propiedad
     * @returns {void}
     */
    mostrarSeleccionarPropiedad: function () {
        $('#divSeleccionarPropiedad').find('span#mensaje').hide();
        that.llenarTablaPropiedadesAsignadas();
        that.llenarTablaPropiedadesSinAsignar();
        var dialogo = $('div#divSeleccionarPropiedad');
        that.dialogoActual = dialogo.dialogo({
            modal: true,
            width: 850,
            title: 'Seleccionar Propiedad',
            buttons: {
                Finalizar: function () {
                    var propiedadesSinAsignar = gestionarsuscripcionModelo.propiedadesSinAsignar;
                    if (propiedadesSinAsignar.length !== 0) {
                        var indice = gestionarsuscripcionModelo.indiceRegistro;
                        if (indice !== null && indice !== undefined) {
                            var propiedad = propiedadesSinAsignar[indice];
                            that.cargarPropiedad(propiedad);
                        }
                    }
                    $(this).dialog('close');
                }
            }
        });
    },
    /** Muestra el resultado de la consulta de los terceros en la lista desplegable.
     * @returns {void}
     */
    mostrarResultado: function (data) {
        var result = [];
        if (data.codigoRespuesta === 1) {
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
    /** Limpia los valores de los formularios, la tabla y el modelo
     * @returns {void}
     */
    reiniciarProceso: function () {
        gestionarsuscripcionModelo = {accion: ''};
        $('#fieldsetDetallesSuscripcion #cboLiquidacion option').remove();
        $('#fieldsetPropiedad, #fieldsetDetallesSuscripcion, #fieldsetConceptos').hide();
        $('#fieldsetDetallesSuscripcion').find('input.sinBloqueo, select.sinBloqueo').prop('disabled', false);
        var fieldsets = $('#fieldsetDatosTercero, #fieldsetPropiedad, #fieldsetDetallesSuscripcion, #fieldsetConceptos');
        fieldsets.find('input[ype="button"]').show();
        fieldsets.find('input[type = text], textarea').val('');
        fieldsets.find('select').val('-1');
    },
    /** Realiza la petición AJAX para consultar los terceros del autocomplete 
     * @returns {void}
     */
    sourceAutoComplete: function (request, response) {
        that.request = request;
        that.response = response;
        var datos = {};
        datos.nombre = request.term.trim();
        gestionarsuscripcionControl.consultarTerceros(datos, that.mostrarResultado);
    },
    /** Limpia la tabla de conceptos y el modelo de los conceptos
     * @returns {void}
     */
    limpiarTablaConceptos: function () {
        gestionarsuscripcionModelo.conceptos = [];
        var fieldset = $('fieldset#fieldsetConceptos').hide();
        fieldset.find('table#tblConceptos').empty();
    },
    /**
     * Agrega un concepto a los conceptos que están disponibles para asignar y no se han asignado a la suscripción cuando el concepto se elimina
     * @param {Object} data - Información del concepto que se agrega
     * @returns {void}
     */
    cargarConceptoSinAsignar: function (data) {
        if (data.codigoRespuesta === 1) {
            gestionarsuscripcionModelo.conceptosSinAsignar.push(data.concepto[0]);
            that.cargarListaConceptosSinAsignar({
                codigoRespuesta: 1,
                conceptos: gestionarsuscripcionModelo.conceptosSinAsignar
            });
        }
    },
    /**
     * Pinta los conceptos en una tabla para seleccionarlos con un checkbox.
     * @param {type} data
     * @returns {undefined}
     */
    cargarListaConceptosSinAsignar: function (data) {
        var divListaConceptos = $('#divListaConceptos').html('');
        switch (data.codigoRespuesta) {
            case 0:
                divListaConceptos.html('No hay conceptos que no estén relacionados con la suscripción');
                gestionarsuscripcionModelo.conceptosSinAsignar = [];
                break;
            case 1:
                gestionarsuscripcionModelo.conceptosSinAsignar = data.conceptos;
                var template = '{{#conceptos}}<div class="divConcepto"><label for="chkConceptoSinAsignar_{{idconcepto}}">' +
                        '<input type="checkbox" style="margin-right:10px;" data-id="{{idconcepto}}" id="chkConceptoSinAsignar_{{idconcepto}}">' +
                        '{{concepto}}</label></div>{{/conceptos}}';
                divListaConceptos.html(Mustache.render(template, {conceptos: data.conceptos}));
                break;
        }
    },
    /**
     * Muestra el dialogo de los conceptos para selecionar
     * @returns {undefined}
     */
    mostrarDialogoConceptos: function () {
        var botones = {};

        var idliquidacion = $('#cboLiquidacion').val();
        if (idliquidacion !== null && idliquidacion !== '' && idliquidacion !== '-1') {

            if (gestionarsuscripcionModelo.conceptosSinAsignar.length > 0) {
                botones.Agregar = function () {
                    var checks = $('#divListaConceptos label input:checkbox:checked');
                    if (checks.length === 0) {
                        __dom.lanzarAlerta('No ha seleccionado ningún concepto para asociar', __app.mensajes.atencion);
                        return;
                    }
                    for (var i = 0; i < checks.length; i++) {
                        var check = $(checks[i]);
                        var id = check.attr('data-id');
                        for (var j = 0; j < gestionarsuscripcionModelo.conceptosSinAsignar.length; j++) {
                            var concepto = gestionarsuscripcionModelo.conceptosSinAsignar[j];
                            if (concepto.idconcepto == id) {
                                gestionarsuscripcionModelo.conceptosAsignados.push(concepto);
                                that.configurarConcepto(0, concepto);

                                gestionarsuscripcionModelo.conceptosSinAsignar.splice(j, 1);
                                if (gestionarsuscripcionModelo.conceptosSinAsignar.length > 0) {
                                    that.cargarListaConceptosSinAsignar({
                                        codigoRespuesta: 1,
                                        conceptos: gestionarsuscripcionModelo.conceptosSinAsignar
                                    });
                                } else {
                                    that.cargarListaConceptosSinAsignar({
                                        codigoRespuesta: 0
                                    });
                                }
                                break;
                            }
                        }
                    }

                    that.llenarTablaConceptosAsignados();
                    ///agregar al modelo
                    $(this).dialog('close');
                };
            }

            botones.Cancelar = function () {
                $(this).dialog("close");
            };

            $('#divDialogoConceptos').dialogo({
                resizable: false,
                width: 300,
                modal: true,
                title: 'Seleccionar conceptos',
                buttons: botones
            });
        } else {
            __dom.lanzarAlerta('Debe seleccionar una liquidacion', 'Seleccionar liquidacion');
        }
    }

};

gestionarsuscripcionVista.init();
