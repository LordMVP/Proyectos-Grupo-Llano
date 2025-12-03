/**
 * @fileOverview Archivo de vista y control para modificar suscripción
 * @author jeissonBarriga
 * @requires modificarsuscripcion.control.js
 * @requires modificarsuscripcion.modelo.js
 * @version 1.0.0
 */

/**
 * Objeto que hace referencia al namespace modificarsuscripcionVista
 * @type {object}
 */
var that = null;

/** @namespace */
var modificarsuscripcionVista = {
    /**
     * hace referencia al último diálogo abierto en la aplicación
     * @type {object}
     */
    dialogoActual: null,
    /**
     * Función que se invoca al inciar el objeto modificarsuscripcionVista, asigna comportamientos para los eventos de los controles.
     * @returns {void}
     */
    init: function () {
        that = this;
        __app.vistaActual = modificarsuscripcionVista;
        __app.controlActual = modificarsuscripcionControl;
        var comandos = $('div#divComandos');
        comandos.find('#btnBuscar').on('click', that.confirmarBuscarSuscripcion);
        comandos.find('#btnGrabar').on('click', that.validarGrabarSuscripcion);
        comandos.find('#btnCancelar').on('click', that.cancelarOperacion);


        $('#cboCiclo').on('change', that.onCicloChange);
        $('#btnBuscarSuscriptor').on('click', that.consultarSuscriptor);
        $('#btnVerConceptos').on('click', that.consultarConceptos);
        $('#btnAgregarDetalles').on('click', that.consultarTiposSuscripcion);
        $('#btnFinalizarSeleccionPropiedad').on('click', that.cargarPropiedad);
        $('#cboTipoUso').on('change', that.onTipoUsoChange);
        $('#cboLiquidacion').on('change', that.validarLiquidacionAnterior);
        $('#cboEstado').on('change', that.validarEstado);
        $('div#divBuscarSuscripcion').find('#cboMunicipio').on('change', that.consultarBarrios);
        $('#txtCantidad').on('blur', that.calcularValorTotal);
        $('#txtValorUnitario').on('blur', that.calcularValorTotal);
        $('#btnAgregarConceptos').on('click', that.mostrarDialogoConceptos);
        $('#btnAgregarLineaMatriz').on('click', that.getLineaMatris);
        $('#btnRetiraSucripcion').on('click', that.dropSucripcion);
        $('#btnVinculaSucripcion').on('click', that.vincularSucripcion);
        $('#btnBuscarSuscripcionVincular').on('click', that.onBuscaClienteVincularMatriz);
        $( "#cboActividadEconimica" ).change(function() {
            /*
                Esta función valida el cambio de actividad economica , en caso de que la actividad economica no aplique el Exento
                elimina el registro de la tabla de conceptos
            */
            var idtabla = document.getElementById("tblConceptos");
            var idfila;

            var actividadEco = $('#cboActividadEconimica option:selected').data('exento');
            if (actividadEco == null || actividadEco === '' ) {
                for (var i = 0, row; row = idtabla.rows[i]; i++) {
                    for (var j = 0, col; col = row.cells[j]; j++) {
                        if( parseInt(col.innerText) === 312){  // 312 es el uni_ideregistro de "Exento"
                            idfila = $(col).parent().attr('data-fila');
                        }
                    }
                }    
            }

            modificarsuscripcionModelo.fila = idfila;
            that.eliminarRegistro();
            __dom.lanzarAlerta("Esta actividad no se puede registrar como Exento", "Error");

        });

        $('#divBuscarSuscripcion').find('#cboBarrio, #txtNombreTerceroBuscar, #txtDocumentoTerceroBuscar,' +
                ' #txtDireccionBuscar, #txtNumeroCatastralBuscar, #txtNumeroRuta, #txtNumeroPropiedad,' +
                ' #txtIdSuscripcion, #txtCodigoAnterior').on('blur', that.definirCombinacion);
        __dom.configurarCalendario('txtFechaInicio, #txtFechaInicial, #txtFechaFinal');
        __dom.configurarCalendario('txtInicioEstado, #txtFinEstado');
        __dom.configurarTextoNumerico('txtIdSuscripcion');
        __dom.configurarTextoNumerico('txtValorUnitario', false, true, true);

        $('#txtInicioEstado').on('change', that.validarFinalEstado);
        $('#txtFinEstado').on('change', that.validarFinalEstado);
        $('#txtFechaInicial').on('change', that.validarFechaFinal);
        $('#txtFechaFinal').on('blur', that.validarFechaFinal);
        that.cargarAutocomplete();
        modificarsuscripcionModelo.modoConsulta = false;
        that.consultarActividadEconomica();
    },
    /**
     * Consulta los tipos de uso disponibles para agregar en un ciclo
     */
    onCicloChange: function () {
        var _this = $(this);
        $('#cboLiquidacion').empty();
        $('#cboTipoUso').empty().change();
        
        if (_this.val() !== '-1') {
            var data = {idciclo: _this.val()};
            modificarsuscripcionControl.consultarTiposUsoCiclo(data, that.onConsultarTiposUsoSuscripcionCompleto);
        }

    },
    /**
     * Consulta las liquidaciones segùn el tipo de uso selecciondo y limpia información cargada del tipo de uso cargado anteriormente
     */
    onTipoUsoChange: function () {
        $('#fieldsetConceptos').hide();
        $('#tblConceptos').empty();
        modificarsuscripcionModelo.conceptos = [];
        modificarsuscripcionModelo.conceptosSinAsignar = [];
        that.consultarLiquidaciones();
    },
    /** Valida que la fecha fin del estado no se anterior a la fecha inicial del estado
     * return {void}
     **/

    validarFinalEstado: function (limpiar) {
        var e = $(this);
        var _this = $('#txtInicioEstado');
        var fechaInicio = new Date(_this.val().replace(/-/gi, '/'));
        var txtFechaFin = $('#txtFinEstado');
        var fechaFinal = new Date(txtFechaFin.val());
        if (e.attr('id') === 'txtFinEstado' && fechaFinal < fechaInicio) {
            txtFechaFin.val(_this.val());
        } else if (fechaFinal < fechaInicio && limpiar !== false) {
            txtFechaFin.val('');
        }
        txtFechaFin.datepicker('destroy').datepicker({minDate: fechaInicio, dateFormat: 'yy/mm/dd'});
    },
    /**
     * Valida y configura caja de texto para que la fecha final no sea menor a la fecha actual
     * @returns {void}
     */
    validarFechaFinal: function (limpiar) {
        var e = $(this);
        var _this = $('#txtFechaInicial');
        var fechaActual = new Date(_this.val().replace(/-/gi, '/'));
        var txtFechaFin = $('#txtFechaFinal');
        var fechaFinal = new Date(txtFechaFin.val());
        if (e.attr('id') === 'txtFechaFinal' && fechaFinal < fechaActual) {
            txtFechaFin.val(_this.val());
        } else if (fechaFinal < fechaActual && limpiar !== false) {
            txtFechaFin.val('');
        }
        $('#txtFechaFinal').datepicker('destroy').datepicker({minDate: fechaActual, dateFormat: 'yy/mm/dd'});
    },
    /**
     * Actualiza el concepto que se está modificando en el modelo
     * @returns {void}
     **/
    actualizarConcepto: function (concepto) {
        var dialogo = $('div#divEditarConcepto');
        concepto.cantidad = dialogo.find('#txtCantidad').val().trim();
        concepto.valorunitario = dialogo.find('#txtValorUnitario').val().trim();
        concepto.valortotal = dialogo.find('#txtValorTotal').val().trim();
        concepto.fechainicio = dialogo.find('#txtFechaInicial').val().trim();
        concepto.fechafinal = dialogo.find('#txtFechaFinal').val().trim();
        that.llenarTablaConceptos();
    },
    /**
     * Adapta la interfaz para que sólo se pueda consultar sin ningún movimiento a base de datos 
     * @returns {void}
     **/
    configurarModoConsulta: function () {
        modificarsuscripcionModelo.modoConsulta = true;
        var fieldsets = $('#fieldsetDatosTercero, #fieldsetPropiedad, #fieldsetDetallesSuscripcion');
        var excepto = '#txtIdSuscripcion, #txtInicioEstado, #txtFinEstado';
        $('#fieldsetConceptos').show();
        fieldsets.show();
        $('#fieldsetDetallesSuscripcion').find('input[type = text], select').not(excepto).prop('disabled', false);
        $('#fieldsetDetallesSuscripcion').find('#txtFechaInicio,#txtCodigoAnterior, #txtFactorCorreccion, #cboTipoSuscripcion,#txtRuta').prop('disabled', true);
        fieldsets.find('input[type = button]').hide();
        $('#btnCambiarPropiedad').show();
    },
    /**
     * Hace petición ajax para consultar información adicional de la suscripción seleccionada
     * @param {number} idsuscripcion - Identificador de la suscripción
     * @returns {void}
     **/
    consultarDetalleSuscripcion: function (idsuscripcion) {
        var data = {'idsuscripcion': idsuscripcion};
        modificarsuscripcionControl.consultarDetalleSuscripcion(data, that.onconsultarDetalleSuscripcionCompleto);
    },
    /**
     * Confirma que el usuario desee eliminar la operación actual en caso de ser así limpia formulario
     * @returns {void}
     **/
    cancelarOperacion: function () {
        $('div#divConfirmarCancelar').dialogo({
            resizable: false,
            heigth: 140,
            modal: true,
            title: 'Cancelar la operación',
            buttons: {
                "Sí": function () {
                    that.reiniciarProceso();
                    $(this).dialog('close');
                }, No: function () {
                    $(this).dialog("close");
                }
            }
        });
    },
    /** Calcula valor total de un concepto a partir de la cantidad y valor unitario digitado
     * @returns {void}
     **/
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
    /** Configura la caja de texto para funcionalidad de autocomplete
     * @returns {void}
     **/
    cargarAutocomplete: function () {
        __dom.configurarAutocomplete(
                '#txtNombreTerceroBuscar, #txtNombreTerceroNuevo',
                that.sourceAutoComplete,
                function (event, ui) {
                    modificarsuscripcionModelo.idTercero = ui.item.idVal;
                    $(this).parent().find('#idTercero').val(ui.item.idVal);
                    $(event.target).attr('data-idtercer', ui.item.idVal);
                },
                function (txt) {
                    modificarsuscripcionModelo.idTercero = undefined;
                    txt.parent().find('#idTercero').val('');
                    txt.removeAttr('data-idtercer');
                }
        );
    },
    /** Carga la información del suscriptor seleccionado
     * @param {object} suscriptor - Información del suscriptor que se haya selecionado
     * @returns {void}
     **/
    cargarDatosTercero: function (suscriptor) {
        modificarsuscripcionModelo.modoConsulta = false;
        var infoSuscripcion = modificarsuscripcionModelo.suscripcion;
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

        $('#txtInicioEstado').val(infoSuscripcion.fechainicioestado);
        $('#txtFinEstado').val(infoSuscripcion.fechafinestado);
        that.validarFinalEstado(false);
    },
    /** Carga la información de la propiedad asignada a la suscripción seleccionada
     * @param {object} propiedad - Información de la propiedad
     * @returns {void}
     **/
    cargarPropiedad: function (propiedad) {
        var fieldset = $('fieldset#fieldsetPropiedad');
        modificarsuscripcionModelo.propiedadSeleccionada = propiedad;
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
    /** Carga la información de la suscripción seleccionada
     * @param {object} suscripcion - Información de la suscripción que se haya selecionado
     * @returns {void}
     **/
    cargarSuscripcion: function (suscripcion) {
        $('#btnAgregarConceptos').show();
        var fieldset = $('#fieldsetDetallesSuscripcion');
        fieldset.find('#txtIdSuscripcion').val(suscripcion.idsuscripcion);
        fieldset.find('#txtCodigoAnterior').val(suscripcion.codigoanterior);
        fieldset.find('#txtFechaInicio').val(suscripcion.fechainicio);
        fieldset.find('#txtDescripcion').val(suscripcion.descripcion);
        fieldset.find('#txtRuta').val(suscripcion.ruta);
        fieldset.find('#cboCiclo').val(modificarsuscripcionModelo.idciclo);
        if (!suscripcion.idactividadeconomica) {
            // var option = $('<option>').val(0).html('nulo');
            // $('#cboActividadEconimica').append(option).val(0);
        } else {
            fieldset.find('#cboActividadEconimica').val(suscripcion.idactividadeconomica);
            $('#cboActividadEconimica').zelectItem( $('#cboActividadEconimica option:selected').text() , false);
        }
        fieldset.find('#cboTipoSuscripcion').empty()
                .append($('<option>')
                        .text(suscripcion.tiposuscripcion)
                        .val(suscripcion.idtiposuscripcion));
        //fieldset.find('#txtCiclo').val(suscripcion.ciclo);
        fieldset.find('#cboLiquidacion').val(modificarsuscripcionModelo.idliquidacion);
        fieldset.find('#cboEstrato').val(suscripcion.estrato);

        fieldset.find('#txtFactorCorreccion').val(suscripcion.factorcorreccion);
        var comboEstado = fieldset.find('#cboEstado');
        if (suscripcion.estado === 'P' && comboEstado.find('option[value="P"]').length === 0) {
            comboEstado.append($('<option>').val('P').text('Pendiente'));
        } else if (suscripcion.estado !== 'P') {
            comboEstado.find('option[value="P"]').remove();
        }
        comboEstado.val(suscripcion.estado).change();
    },
    /** Confirma si desea iniciar una nueva búsqueda 
     * @returns {void}
     **/
    confirmarBuscarSuscripcion: function () {
        if (modificarsuscripcionModelo.accion !== 'I') {
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
    /** Confirma si el usuario desea eliminar un registro de conceptos
     * @returns {void}
     **/
    confirmarEliminar: function () {
        modificarsuscripcionModelo.fila = $(this).parent().parent().attr('data-fila');
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
    /** Consulta los barrios según el municipio
     * @return{void}
     **/
    consultarBarrios: function () {
        var idmunicipio = $(this).val();
        var data = {'idmunicipio': idmunicipio};
        modificarsuscripcionControl.consultarBarrios(data, that.onConsultarBarriosCompleto);
    },
    /**
     * Limpia y oculta la información de los conceptos asociados a la suscripción
     */
    limpiarTablaConceptos: function () {
        $('#tblConceptos').empty();
        $('#fieldsetConceptos').hide();
    },
    /**
     * Consulta los conceptos que se pueden asociar a una suscripción según la liquidación seleccionada
     */
    validarLiquidacionAnterior: function () {
        var idLiquidacionAnterior = modificarsuscripcionModelo.idliquidacion;
        var idLiquidacionActual = parseInt($('#cboLiquidacion').val());
        if (idLiquidacionActual === -1) {
            that.limpiarTablaConceptos();
            return;
        }
        if (idLiquidacionActual === idLiquidacionAnterior) {
            that.consultarConceptosDesdeModificar();
            return;
        }
        that.consultarConceptos();

    },
    /** Hace petición ajax para consultar conceptos según la liquidación seleccionada
     * @returns {void}
     **/
    consultarConceptos: function () {
        var fieldset = $('#fieldsetDetallesSuscripcion');
        var idliquidacion = fieldset.find('#cboLiquidacion').val();
        var idprograma = 58;
        var data = {'idliquidacion': idliquidacion, 'idprograma': idprograma};
        if (idliquidacion === null || idliquidacion === '-1') {
            __dom.lanzarAlerta(__app.mensajes.seleccionarLiquidacion, __app.mensajes.atencion);
            return;
        }
        modificarsuscripcionModelo.consultar = false;
        modificarsuscripcionControl.consultarConceptos(data, that.onConsultarConceptosCompleto);
    },
    /** Consulta los ciclos en función del ciclo y la ruta de la suscripción
     * @returns {void}
     **/
    consultarCiclos: function () {
        var idciclo = modificarsuscripcionModelo.idciclo;
        var idruta = modificarsuscripcionModelo.idruta;
        modificarsuscripcionControl.consultarCiclos({idruta: idruta, idciclo: idciclo}, that.onConsultarCiclosCompleto);
    },
    /** Consulta el cilo y la ruta correspondiente al municipio y al barrio
     * @returns {void}
     **/
    consultarCicloRuta: function () {
        var idmunicipio = modificarsuscripcionModelo.propiedadSeleccionada.idmunicipio;
        var idbarrio = modificarsuscripcionModelo.propiedadSeleccionada.idbarrio;
        var data = {idmunicipio: idmunicipio, idbarrio: idbarrio};
        modificarsuscripcionControl.consultarCicloRuta(data, that.onConsultarCicloRutaCompleto);
    },
    /** Consulta las liquidaciones según ciclo, tipo uso y municipio
     * @returns {void}
     **/
    consultarLiquidaciones: function () {
        var cboCiclo = $('#cboCiclo');
        var cboTipoUso = $('#cboTipoUso');
        if (cboTipoUso.val() !== '-1' && cboTipoUso.val()) {
            var idciclo = cboCiclo.val();
            var idtipousosuscripcion = cboTipoUso.val() === undefined ? modificarsuscripcionModelo.suscripcion.idtipousosuscripcion : cboTipoUso.val();
            var idmunicipio = modificarsuscripcionModelo.idmunicipio;
            var data = {idciclo: idciclo, idtipousosuscripcion: idtipousosuscripcion, idmunicipio: idmunicipio};
            modificarsuscripcionControl.consultarLiquidaciones(data, that.onConsultarLiquidacionesCompleto);

        } else {
            $('#cboLiquidacion').empty();
        }
    },

    /**
     * Valida el estado de la suscripción para configurar las fechas de inicio y fin de un estado
     */
    
    validarEstado: function () {
        var _this = $(this);
        if (_this.val() === 'E') {
            var fieldset = $('#fieldsetDetallesSuscripcion');
           var comboEstado = fieldset.find('#cboEstado');
            comboEstado.find('option[value!="E"]').attr('disabled', true);
        }        
        if (_this.val() === 'A' || _this.val() === 'E' || _this.val() === 'P') {
                $('#txtInicioEstado, #txtFinEstado')
                        .val('').attr('disabled', true);
            } else {
                $('#txtInicioEstado, #txtFinEstado')
                        .attr('disabled', false);
        }        
    },
    /** Valida la información para consultar una suscripción 
     * @returns {void}
     **/
    validarCamposBuscarSuscripcion: function () {
        if ($('#cboMunicipio').val() === '-1') {
            __dom.lanzarAlerta(__app.mensajes.seleccionarMunicipio, __app.mensajes.atencion);
            return;
        } else {
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
            } else {
                that.consultarSuscripcion();
            }
        }
    },
    /** Valida que la suscripción tenga un concepto por lo menos 
     * @returns {void}
     **/
    validarCantidadConceptos: function () {
        modificarsuscripcionModelo.fila = $(this).parent().parent().attr('data-fila');
        var conceptos = modificarsuscripcionModelo.conceptos;
        if (conceptos.length === 1) {
            __dom.lanzarAlerta('La suscripción debe tener al menos un concepto', __app.mensajes.atencion);
            return;
        }
        that.confirmarEliminar();
    },
    /** Valida que la información de la suscripción esté completa
     * @returns {void}
     **/
    validarCamposDetallesSuscripcion: function () {
        var excepto = '#txtIdSuscripcion, #txtInicioEstado, #txtFinEstado';
        var campos = $('#fieldsetDetallesSuscripcion').find('input:text, select').not(excepto);
        var camposRequeridos = modificarsuscripcionModelo.camposRequeridos = 0;
        $.each(campos, function (index, campo) {
            var valorCampo = $(campo).val();
            var idCampo = campo.id;

            if (idCampo !== '') {
                if (campo.tagName === 'INPUT') {
                    camposRequeridos = (valorCampo.trim() === '') ? camposRequeridos + 1 : camposRequeridos;
                } else if (campo.tagName === 'SELECT') {
                    camposRequeridos = (valorCampo === '-1' || valorCampo === '') ? camposRequeridos + 1 : camposRequeridos;
                }
            }
            
        });
        modificarsuscripcionModelo.camposRequeridos = camposRequeridos;
    },
    /** Valida que la información de la suscripción e información adicional y requerida esté en el formulario
     * debidamente  diligenciada para grabar en base de datos
     * @returns {void}
     **/
    validarGrabarSuscripcion: function () {
        if (!modificarsuscripcionModelo.modoConsulta) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarSuscripcion, __app.mensajes.atencion);
            return;
        }
        that.validarCamposDetallesSuscripcion();
        if (modificarsuscripcionModelo.camposRequeridos !== 0) {
            __dom.lanzarAlerta('Faltan campos obligatorios del detalle de la suscripción', __app.mensajes.atencion);
            return;
        }

        var cboCiclo = $('#cboCiclo');
        if (cboCiclo.val() === null || cboCiclo.val() === '-1') {
            __dom.lanzarAlerta(__app.mensajes.seleccionarCiclo, __app.mensajes.atencion);
            return;
        }

        that.validarTablaConceptos();
        if (modificarsuscripcionModelo.camposRequeridos === 0) {
            that.grabarSuscripcion();
            return;
        }
        __dom.lanzarAlerta('La cantidad y valor unitario de los conceptos es obligatorio.', __app.mensajes.atencion);
    },
    /** Valida que todos los conceptos de la tabla tengan cantidad y valor unitario
     * @returns {void}
     **/
    validarTablaConceptos: function () {
        var conceptos = $('#tblConceptos tbody tr');
        $.each(conceptos, function (index, concepto) {
            var valor = $(concepto).find('td[header="thValorTotal"]').text();
            if (valor === '' || valor === '-') {
                modificarsuscripcionModelo.camposRequeridos++;
            }
        });
    },
    /** Valida las acciones que se pueden realizar por concepto según el tipo de cálculo
     * @param {object} tabla - Tabla donde se visualizan los conceptos
     * @returns {void}
     **/
    validarTipoCalculo: function (tabla) {
        var conceptos = modificarsuscripcionModelo.conceptos;
        $.each(conceptos, function (index, concepto) {
            if (concepto.tipocalculo === 'F') {
                var fila = tabla.find('tr[data-fila = ' + index + ']');
                var btnEliminar = fila.find('td[header = "thEditar"] input[type = "button"]');
                btnEliminar.prop('disabled', true).addClass('btnDisabled');
            }
        });
    },
    /** Hace petición ajax para consultar una suscripción
     * @returns {void}
     **/
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
        var idsuscripcion = div.find('#txtIdSuscripcion').val().trim();var div = $('#divBuscarSuscripcion');
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
        modificarsuscripcionControl.consultarSuscripcion(data, that.onConsultarSuscripcionCompleto);

    },
    /** Hace petición ajax para consultar tipos de suscripción según el municipio
     * @returns {void}
     **/
    consultarTiposSuscripcion: function () {
        var idconvenio = modificarsuscripcionModelo.suscriptor.idconvenio;
        var idmunicipio = modificarsuscripcionModelo.propiedadSeleccionada.idmunicipio;
        var data = {idconvenio: idconvenio, idmunicipio: idmunicipio};
        $('#fieldsetDetallesSuscripcion').find('div.oculto').hide();
        modificarsuscripcionControl.consultarTiposSuscripcion(data, that.onConsultarTiposSuscripcionCompleto);
    },
    /** Hace petición ajax para consultar tipos de uso de suscripción según el ciclo
     * @returns {void}
     **/
    consultarTiposUsoSuscripcion: function (idtiposuscripcion) {
        idtiposuscripcion = idtiposuscripcion ? idtiposuscripcion : modificarsuscripcionModelo.idtiposuscripcion;
        var data = {idtiposuscripcion: idtiposuscripcion};
        modificarsuscripcionControl.consultarTiposUsoSuscripcion(data, that.onConsultarTiposUsoSuscripcionCompleto);
    },
    /** Hace petición ajax para consultar y validar si un concepto se puede eliminar
     * @returns {void}
     **/
    eliminarRegistro: function () {
        var fila = modificarsuscripcionModelo.fila;
        var concepto = modificarsuscripcionModelo.conceptos[fila];
        var idconcepto = concepto.idconcepto;
        var param = {'idconcepto': idconcepto};
        modificarsuscripcionControl.consultarEliminarConcepto(param,
                that.onConsultarEliminarConceptoCompleto);
    },
    /** Captura la respuesta del servidor cuando se valida la eliminación de un concepto
     * @param {object} data - Respuesta con validación de la eliminación
     * @returns {void}
     **/
    onConsultarEliminarConceptoCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(__app.mensajes.sinResultados, __app.mensajes.atencion);
                break;
            case 1:
                if (parseInt(data.eliminar) === 1) {
                    var fila = modificarsuscripcionModelo.fila;

                    var concepto = modificarsuscripcionModelo.conceptos[fila];
                    var idconcepto = concepto.idconcepto;

                    var param = {'idconcepto': idconcepto};
                    modificarsuscripcionControl.consultarConceptoPorId(param, that.cargarConceptoSinAsignar);
                    modificarsuscripcionModelo.conceptos.splice(fila, 1);
                    that.llenarTablaConceptos();
                } else {
                    __dom.lanzarAlerta('Lo sentimos, el concepto no se puede eliminar.', 'Eliminar concepto');
                }
                break;
        }
    },
    /**
     * Agrega un concepto a los conceptos que están disponibles para asignar y no se han asignado a la suscripción cuando el concepto se elimina
     * @param {Object} data - Información del concepto que se agrega
     */
    cargarConceptoSinAsignar: function (data) {
        if (data.codigoRespuesta === 1) {
            modificarsuscripcionModelo.conceptosSinAsignar.push(data.concepto[0]);
            that.cargarListaConceptosSinAsignar({
                codigoRespuesta: 1,
                conceptos: modificarsuscripcionModelo.conceptosSinAsignar
            });
        }
    },
    /** Agrupa la información a grabar y hace petición ajax para ser guardada
     * @returns {void}
     **/
    grabarSuscripcion: function () {
        var jsonGrabar = modificarsuscripcionModelo.jsonGrabar = {};
        var conceptos = modificarsuscripcionModelo.conceptos;
        var datosTercero = $('fieldset#fieldsetDatosTercero');
        var datosPropiedad = modificarsuscripcionModelo.propiedadSeleccionada;
        var detallesSuscripcion = $('fieldset#fieldsetDetallesSuscripcion');
        var cmbestado = detallesSuscripcion.find('#cboEstado').val();


        //datos de la suscripción
        var descripcion = detallesSuscripcion.find('#txtDescripcion').val();
        var idsuscriptor = datosTercero.find('#txtIdSuscriptor').val();
        var idtercero = datosTercero.find('#txtIdTercero').val();
        var idpropiedad = datosPropiedad.idpropiedad;
        var idmunicipio = datosPropiedad.idmunicipio;
        var idbarrio = datosPropiedad.idbarrio;
        var idtiposuscripcion = detallesSuscripcion.find('#cboTipoSuscripcion').val();
        var idtipousosuscripcion = detallesSuscripcion.find('#cboTipoUso').val();
        var idliquidacion = detallesSuscripcion.find('#cboLiquidacion').val();
        var idciclo = detallesSuscripcion.find('#cboCiclo').val();
        var fechainicio = detallesSuscripcion.find('#txtFechaInicio').val();
        var estrato = detallesSuscripcion.find('#cboEstrato').val();
        var factorcorreccion = detallesSuscripcion.find('#txtFactorCorreccion').val();
        var inicioestado = detallesSuscripcion.find('#txtInicioEstado').val();
        var finestado = detallesSuscripcion.find('#txtFinEstado').val();
        var idactividadeconomica = detallesSuscripcion.find('#cboActividadEconimica').val();
        if (cmbestado !== '-1') {
            var estado = cmbestado;
            if ((cmbestado === 'U' || cmbestado === 'R') && (inicioestado.trim() === '' || finestado.trim() === '')) {
                __dom.lanzarAlerta('La fecha inicio y fin del estado son obligatorias', __app.mensajes.atencion);
                return;
            }
        }
        jsonGrabar.suscripcion = {
            "accion": 'A',
            "idsuscripcion": datosPropiedad.idsuscripcion,
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
            "fechainicioestado": inicioestado,
            "fechafinestado": finestado,
            "idactividadeconomica": idactividadeconomica
        };

        //datos de los conceptos
        jsonGrabar.conceptos = [];
        if (!!conceptos) {
            $.each(conceptos, function (index, concepto) {
                jsonGrabar.conceptos[index] = {
                    "cantidad": concepto.cantidad,
                    "valorunitario": concepto.valorunitario !== 'NA' ? concepto.valorunitario : 0,
                    "valortotal": concepto.valortotal !== 'NA' ? concepto.valortotal : 0,
                    "fechainicio": concepto.fechainicio === '' ? null : concepto.fechainicio,
                    "fechafinal": concepto.fechafinal === '' ? null : concepto.fechafinal,
                    "idliquidacion": idliquidacion,
                    "idconcepto": concepto.idconcepto,
                    "estado": "A"
                };
            });
        }

        jsonGrabar.ruta = {'idruta': modificarsuscripcionModelo.ruta.idruta};
        var data = {'datos': jsonGrabar};
        modificarsuscripcionControl.grabarSuscripcion(data, that.onGrabarSuscripcionCompleto);
    },
    /** Obtiene las propiedades seleccionadas que no se han asignado 
     * @returns {void}
     **/
    leerFila: function () {
        var radio = that.dialogoActual.find('input[name="tblPropiedadesSinAsignar_radioGroup"]:checked');
        var indiceRegistro = modificarsuscripcionModelo.indiceRegistro = parseInt(radio.parent().parent().attr('data-fila'));
    },
    /** Valida la información de los conceptos para llenar la tabla
     * @return{void}
     **/
    llenarTablaConceptos: function () {
        var fieldset = $('fieldset#fieldsetConceptos');
        fieldset.find('table#tblConceptos').empty();
        if (modificarsuscripcionModelo.conceptos.length > 0) {
            console.debug('Llenando tabla..');
            var tabla = fillTable('tblConceptos', 'formatoConceptos', 'modificarsuscripcionModelo.conceptos', '');
            tabla.find('td[header = "thEditar"] input[type = "button"]').on('click', that.mostrarEditarConcepto);
            tabla.find('td[header = "thEliminar"] input[type = "button"]').on('click', that.confirmarEliminar);
            that.validarTipoCalculo(tabla);
            fieldset.show();
        } else {
            console.debug('no hay conceptos en el modelo');
            fieldset.hide();
        }
    },
    /** Carga la información de las propiedades asignadas en una tabla 
     * @returns {void}
     **/
    llenarTablaPropiedadesAsignadas: function () {
        $('table#tblPropiedadesAsignadas').empty();
        var propiedadesAsignadas = modificarsuscripcionModelo.propiedadesAsignadas;
        if (propiedadesAsignadas.length === 0) {
            $('#propiedadesAsignadas').find('span#mensaje').show();
            return;
        }
        fillTable('tblPropiedadesAsignadas', 'formatoPropiedadesAsignadas', 'modificarsuscripcionModelo.propiedadesAsignadas', '');
    },
    /** Carga la información de las propiedades que no se han asignado a ninguna suscripción en una tabla 
     * @returns {void}
     **/
    llenarTablaPropiedadesSinAsignar: function () {
        $('table#tblPropiedadesSinAsignar').empty();
        var propiedadesSinAsignar = modificarsuscripcionModelo.propiedadesSinAsignar;
        if (propiedadesSinAsignar.length === 0) {
            $('#propiedadesSinAsignar').find('span#mensaje').show();
            return;
        }
        var tabla = fillTable('tblPropiedadesSinAsignar', 'formatoPropiedadesSinAsignar', 'modificarsuscripcionModelo.propiedadesSinAsignar', '');
        tabla.find('input[name="tblPropiedadesSinAsignar_radioGroup"]').on('change', that.leerFila);
    },
    /** Abre cuadro de diálogo para hacer la búsqueda de una suscripción
     * @returns {void}
     **/
    mostrarBuscarSuscripcion: function () {
        modificarsuscripcionModelo.campoActivador = '';
        modificarsuscripcionModelo.combinacion = '';
        var filtro = $('#divBuscarSuscripcion');
        filtro.find('input[type = text], select').prop('disabled', false);
        filtro.find('#cboMunicipio').val('-1');
        filtro.find('#cboBarrio option').remove();
        filtro.find('input[type = text]').val('');
        filtro.find('select').val(-1);
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
    /** Captura la respuesta del servidor cuando se consultan barrios
     * @param {object} data - Arreglo con barrios enviados
     * @return{void} 
     **/
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
    /** Hace petición ajax para consultar conceptos 
     * @returns {void}
     */
    consultarConceptosDesdeModificar: function () {
        var data = {'idsuscripcion': modificarsuscripcionModelo.idsuscripcion};
        modificarsuscripcionControl.consultarConceptosDesdeModificar(data, that.onConsultarConceptosDesdeModificarCompleto);
    },
    /** Captura la respuesta del servidor cuando se consultan conceptos
     * @param {object} data - Respuesta del servidor con conceptos
     * @returns {void}
     */
    onConsultarConceptosDesdeModificarCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                var fieldset = $('fieldset#fieldsetConceptos');
                fieldset.find('table#tblConceptos').empty();
                fieldset.hide();
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                break;
            case 1:
                modificarsuscripcionModelo.conceptos = data.conceptos;
                that.llenarTablaConceptos();
                break;
        }
    },
    /** Captura la respuesta del servidor cuando se consulta una suscripción, y 
     * envía a otras funciones para cargar la información
     * @param {object} data - Respuesta del servidor con toda la información sobre la suscripción
     * @returns {void}
     **/
    onconsultarDetalleSuscripcionCompleto: function (data) {
        if (!!data) {
            var resumen = data.resumensuscripcion;
            var tercero = resumen.tercero;
            var propiedad = resumen.propiedad;
            var suscripcion = resumen.suscripcion;
            modificarsuscripcionModelo.consultar = true;
            modificarsuscripcionModelo.idmunicipio = propiedad.idmunicipio;
            modificarsuscripcionModelo.idtipousosuscripcion = suscripcion.idtipousosuscripcion;
            modificarsuscripcionModelo.idliquidacion = suscripcion.idliquidacion;
            modificarsuscripcionModelo.estado = suscripcion.estado;
            modificarsuscripcionModelo.idciclo = suscripcion.idciclo;
            modificarsuscripcionModelo.idruta = suscripcion.idruta;
            modificarsuscripcionModelo.idsuscripcion = suscripcion.idsuscripcion;
            modificarsuscripcionModelo.ruta = suscripcion.ruta;
            modificarsuscripcionModelo.idtiposuscripcion = suscripcion.idtiposuscripcion;
            
            //that.consultarConceptosDesdeModificar();
            that.consultarCiclos();
            that.cargarDatosTercero(tercero);
            that.cargarPropiedad(propiedad);
            that.cargarSuscripcion(suscripcion);
            that.configurarModoConsulta();
            $('#btnAgregarLineaMatriz').show();
            if(suscripcion.idtiposuscripcion != 1312){
                $('#btnAgregarLineaMatriz').hide();
            } 
        }
    },
    /** Captura la respuesta del servidor cuando se consultan los conceptos
     * @param {object} data - Respuesta del servidor con toda la información de los conceptos
     * @returns {void}
     **/
    onConsultarConceptosCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(__app.mensajes.sinResultados, __app.mensajes.atencion);
                $('#fieldsetConceptos').hide().find('#tblConceptos').empty();
                break;
            case 1:
                var conceptos = data.conceptos;
                $.each(conceptos, that.configurarConcepto);
                modificarsuscripcionModelo.conceptosSinAsignar = [];
                that.cargarListaConceptosSinAsignar({
                    codigoRespuesta: 1,
                    conceptos: conceptos
                });
                break;
        }
    },
    /**
     * Configura la información de los conceptos para su edición
     * @param {type} i - Posición en algún arreglo (esto es porque se llama desde un foreach)
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
    /** Captura la respuesta del servidor cuando se consultan ciclos 
     * @param {object} data - Arreglo con ciclos 
     * @return{void}
     **/
    onConsultarCiclosCompleto: function (data) {
        var cboCiclo = $('#cboCiclo').empty();
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                break;
            case 1:
                __dom.llenarCombo(cboCiclo, data.ciclos, 'idciclo', 'ciclo');
                if (modificarsuscripcionModelo.idciclo) {
                    $('#cboCiclo').val(modificarsuscripcionModelo.idciclo);
                    //        that.consultarTiposUsoSuscripcion();
                }
                if(modificarsuscripcionModelo.idsuscripcion !== '-1'){
                    that.consultarTiposUsoSuscripcion(modificarsuscripcionModelo.idtiposuscripcion);
                }
                break;
        }
    },
    /**
     * Hace peticion ajax para consultar las actividades economicas
     * @returns {undefined}
     */
    consultarActividadEconomica: function () {
        modificarsuscripcionControl.consultarActividadEconomica(that.onConsultarActividadEconomicaCompleto);
    },
    /** Captura la respuesta del servidor cuando se consultan ciclos y rutas según la suscripción
     * @param {object} data - Objeto de Arreglo con ciclos y arreglo con rutas
     * @return{void}
     **/
    onConsultarCicloRutaCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(__app.mensajes.sinResultados, __app.mensajes.atencion);
                break;
            case 1:
                modificarsuscripcionModelo.ruta = data.ruta;
                modificarsuscripcionModelo.ciclo = data.ciclo;
                var fieldset = $('fieldset#fieldsetDetallesSuscripcion');
                fieldset.find('#txtRuta').val(data.ruta.ruta).attr('idruta', data.ruta.idruta);
                //fieldset.find('#txtCiclo').val(data.ciclo.ciclo).attr('idciclo', data.ciclo.idciclo);
                fieldset.find('#cboCiclo').val(data.ciclo.ciclo);
                fieldset.find('#txtFactorCorreccion').val(modificarsuscripcionModelo.propiedadSeleccionada.factorcorreccion);
                //        that.consultarTiposUsoSuscripcion(modificarsuscripcionModelo.idciclo);
                break;
        }
    },
    /** Captura la respuesta del servidor cuando se consultan liquidaciones
     * @param {object} data - Arreglo con liquidaciones
     * @return{void}
     **/
    onConsultarLiquidacionesCompleto: function (data) {
        var cboLiquidacion = $('#cboLiquidacion').empty();
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                break;
            case 1:
                __dom.llenarCombo(cboLiquidacion, data.liquidaciones, 'idliquidacion', 'liquidacion');

                if (modificarsuscripcionModelo.idliquidacion && cboLiquidacion.find('option[value="' + modificarsuscripcionModelo.idliquidacion + '"]').length > 0) {
                    cboLiquidacion.val(modificarsuscripcionModelo.idliquidacion);
                    cboLiquidacion.change();
                    var datos = {
                        idliquidacion: $('#cboLiquidacion').val(),
                        idprograma: 58,
                        idsuscripcion: modificarsuscripcionModelo.suscripcion.idsuscripcion
                    };
                    modificarsuscripcionControl.consultarConceptos(datos, that.cargarListaConceptosSinAsignar);
                } else {
                    cboLiquidacion.val(-1);
                }
                break;
        }
    },
    /**
     * Carga los conceptos que tiene una suscripción disponibles para asignar en un listado del DOM
     * @param {Object} data - Información enviada por el servidor de los conceptos sin asignar de una suscripción
     */
    cargarListaConceptosSinAsignar: function (data) {
        var divListaConceptos = $('#divListaConceptos').html('');
        switch (data.codigoRespuesta) {
            case 0:
                divListaConceptos.html('No hay conceptos que no estén relacionados con la suscripción');
                modificarsuscripcionModelo.conceptosSinAsignar = [];
                break;
            case 1:
                modificarsuscripcionModelo.conceptosSinAsignar = data.conceptos;
                var template = '{{#conceptos}}<div class="divConcepto"><label for="chkConceptoSinAsignar_{{idconcepto}}">' +
                        '<input type="checkbox" style="margin-right:10px;" data-id="{{idconcepto}}" id="chkConceptoSinAsignar_{{idconcepto}}">' +
                        '{{concepto}}</label></div>{{/conceptos}}';
                divListaConceptos.html(Mustache.render(template, {conceptos: data.conceptos}));
                break;
        }
        
        
       
    },
    
    /** Captura la respuesta del servidor cuando se consultan suscripción
     * @param {object} data - Arreglo con suscripciones que cumplen con parámetros de búsqueda
     * @return{void}
     **/
    onConsultarSuscripcionCompleto: function (data) {
        that.reiniciarProceso();
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(__app.mensajes.sinResultados, __app.mensajes.atencion);
                break;
            case 1:
                modificarsuscripcionModelo.suscripciones = data.suscripciones;
                if (data.suscripciones.length > 1) {
                    that.dialogoActual.find('div.listaSeleccion, .btn-finalizar-consultar').remove();
                    that.dialogoActual.find('div.listaSeleccion').remove();
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
                        label.text(suscripcion.cedula + ' - ' + suscripcion.nombretercero + ' - ' + suscripcion.idsuscripcion);
                        div.append(radio).append(label);
                        divSuscripciones.append(div);
                    });
                    var btn = $('<button>').text('Finalizar').addClass('btnSimple btn-finalizar-consultar');
                    btn.on('click', function () {
                        var suscSeleccionada = that.dialogoActual.find('input[name="radio_suscripciones"]:checked');
                        if (suscSeleccionada.length > 0) {
                            var suscripcion = modificarsuscripcionModelo.suscripcion = data.suscripciones[suscSeleccionada.attr('data-indice')];
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
                    var suscripcion = modificarsuscripcionModelo.suscripcion = data.suscripciones[0];
                    that.dialogoActual.find('#spanMensaje').hide();
                    that.dialogoActual.dialog('close');
                    that.consultarDetalleSuscripcion(suscripcion.idsuscripcion);
                }
                break;
        }
    },
    /** Captura la respuesta del servidor cuando se consultan tipos de suscripción
     * @param {object} data - Arreglo con tipos de suscripción
     * @return{void}
     **/
    onConsultarTiposSuscripcionCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(__app.mensajes.sinResultados, __app.mensajes.atencion);
                break;
            case 1:
                var fieldset = $('fieldset#fieldsetDetallesSuscripcion');
                var cboTipoSuscripcion = fieldset.find('#cboTipoSuscripcion').empty();

                __dom.llenarCombo(cboTipoSuscripcion, data.tipossuscripcion, 'idtiposuscripcion', 'tiposuscripcion');
                fieldset.show();
                that.consultarCicloRuta();
                break;
        }
    },
    /** Captura la respuesta del servidor cuando se consultan tipos de uso de suscripción
     * @param {object} data - Arreglo con tipos de uso de suscripción
     * @return{void}
     **/
    onConsultarTiposUsoSuscripcionCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(__app.mensajes.sinResultados, __app.mensajes.atencion);
                break;
            case 1:
                var cboTipoUso = $('#cboTipoUso').empty();
                __dom.llenarCombo(cboTipoUso, data.tiposusosuscripcion, 'idtipousosuscripcion', 'tipousosuscripcion');
                if (modificarsuscripcionModelo.idtipousosuscripcion) {
                    $('#cboTipoUso').val(modificarsuscripcionModelo.idtipousosuscripcion);
                    if (!cboTipoUso.val()) {
                        cboTipoUso.val('-1');
                    }
                }
                that.consultarLiquidaciones();
                break;
        }
    },
    /** Captura la respuesta del servidor cuando se graba la modificación hecha a la suscripción
     * @param {object} data - Respuesta del servidor
     * @return{void}
     **/
    onGrabarSuscripcionCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 1:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.tituloExito, function () {
                    location.reload();
                });
                break;
        }
    },
    /**
     * Captura la respuesta del servidro cuando consulta las actividadea economicas
     * @param {type} data - Respuesta del servidor con las actividades economicas
     * @returns {undefined}
     */
    onConsultarActividadEconomicaCompleto: function (data) {
        modificarsuscripcionModelo.actividadesEconomicas = data.datos;
        var listadoActividades = data.datos;
        var optionsActividades = "<option value ='0' >nulo</option>";
        var cboActividadEconomica = $('#cboActividadEconimica').empty();

//        __dom.llenarCombo(cboActividadEconomica, data.datos, 'idunidad', 'nombre');

        listadoActividades.forEach( data => {
            codigo_exento = ( data.codexento === null  || data.codexento === "" ) ? "" : data.codexento ;
            optionsActividades += `<option value="${data.idunidad}" data-exento="${data.codexento}" >  ` + ((codigo_exento !== ""  ) ? "[CIUU " + data.codexento+"] - " : "")  + `  ${data.nombre} </option>`;
        });

        $('#cboActividadEconimica').html(optionsActividades);
        $('#cboActividadEconimica').zelect();
        var optionsActividades = "";
        var cboActividadEconomica = $('#cboActividadEconimica').empty();
//        __dom.llenarCombo(cboActividadEconomica, data.datos, 'idunidad', 'nombre');

        listadoActividades.forEach( data => {
            codigo_exento = ( data.codexento === null  || data.codexento === "" ) ? "" : data.codexento ;
            optionsActividades += `<option value="${data.idunidad}" data-exento="${data.codexento}" >  ` + ((codigo_exento !== ""  ) ? "[CIUU " + data.codexento+"] - " : "")  + `  ${data.nombre} </option>`;
        });

        $('#cboActividadEconimica').html(optionsActividades);
    },
    /** Limpia el formulario y elimina la información actual del recaudo y el suscriptor de la interfaz
     * @return{void}
     **/
    limpiarDialogoBuscarSuscriptor: function () {
        var dialogo = $('div#divBuscarSuscriptor');
        dialogo.find('input[type="text"]').val('');
        dialogo.find('#spanMensaje').hide();
        dialogo.find('div.listaSeleccion').remove();
        modificarsuscripcionModelo = {
        };
    },
    /** Muestra la información del concepto seleccionado para editar en el cuadro de diálogo de edición
     * @return{void}
     **/
    mostrarEditarConcepto: function () {
        var fila = modificarsuscripcionModelo.fila = $(this).parent().parent().attr('data-fila');
        var concepto = modificarsuscripcionModelo.conceptos[fila];
        var tipoRegistro = concepto.tiporegistro;
        var valor = concepto.valor;
        var valortotal = concepto.valortotal;
        var dialogo = $('div#divEditarConcepto');
        var txtCantidad = dialogo.find('input#txtCantidad');
        var txtValorUnitario = dialogo.find('input#txtValorUnitario');
        txtCantidad.val(concepto.cantidad);
        txtValorUnitario.val(concepto.valorunitario);
        dialogo.find('input#txtIdConcepto').val(concepto.idconcepto);
        dialogo.find('input#txtConcepto').val(concepto.concepto);
        dialogo.find('input#txtValorTotal').val(valortotal);
        dialogo.find('input#txtFechaInicial').val(concepto.fechainicio);
        dialogo.find('input#txtFechaFinal').val(concepto.fechafinal);
        that.validarFechaFinal(false);
        switch (tipoRegistro) {
            case 'U':
                txtCantidad.prop('disabled', true);
                txtValorUnitario.prop('disabled', !(valor === null));
                break;
            case 'N':
                txtValorUnitario.prop('disabled', true);
                txtCantidad.prop('disabled', true);
                break;
            case 'C':
            case 'T':
                txtCantidad.prop('disabled', false);
                txtValorUnitario.prop('disabled', !(valor === null));
                break;
        }

        that.dialogoActual = dialogo.dialogo({
            modal: true,
            width: 850,
            title: 'Editar Concepto',
            buttons: {
                Aceptar: function () {
                    that.actualizarConcepto(concepto);
                    $(this).dialog('close');
                }
            }
        });
    },
    /** Muestra la lista de terceros encontrados en el filtro de terceros por nombre
     * @param {object} Respuesta del servidor con listado de terceros
     * @returns {void}
     **/
    mostrarResultado: function (data) {
        var result = [];
        if (!data.terceros) {
            return;
        }

        $.each(data.terceros, function (i, item) {
            result.push({
                label: item.nombretercero,
                value: item.nombretercero,
                documento: item.documento,
                idVal: item.idtercero
            });
        });
        that.response(result);
    },
    /** Reinicia toda la página para iniciar una nueva actualización
     * @returns {void}
     **/
    reiniciarProceso: function () {
        modificarsuscripcionModelo = {};
        modificarsuscripcionModelo.accion = '';
        $('#btnAgregarConceptos').hide();
        $('#fieldsetPropiedad, #fieldsetDetallesSuscripcion, #fieldsetConceptos, #fieldsetLineaMatriz').hide();
        $('#fieldsetDatosTercero, #fieldsetPropiedad, #fieldsetDetallesSuscripcion, #fieldsetConceptos').find('input[type = button]').show();
        $('#fieldsetDetallesSuscripcion').find('input.sinBloqueo, select.sinBloqueo').prop('disabled', false);
        var fieldsets = $('#fieldsetDatosTercero, #fieldsetPropiedad, #fieldsetDetallesSuscripcion');
        var campos = fieldsets.find('input[type = text], textarea');
        var combos = fieldsets.find('select');
        campos.val('');
        combos.val(-1);
        $('#fieldsetDetallesSuscripcion').find('#cboLiquidacion').find('option').remove();
    },
    /** Función que invoca la petición AJAX para la carga de terceros
     * @return{void}
     **/
    sourceAutoComplete: function (request, response) {
        that.request = request;
        that.response = response;
        var datos = {};
        datos.nombre = request.term.trim();
        modificarsuscripcionControl.consultarTerceros(datos, that.mostrarResultado);
    },
    /**
     * Abre cuadro de diálogo para seleccionar conceptos a asociar a la suscripción, una vez se seleccionen los conceptos
     * se debe dar clic en aceptar para que sean agregados al modelo
     */
    mostrarDialogoConceptos: function () {
        var botones = {};
        if ($('#cboLiquidacion').val() === '-1') {
            that.cargarListaConceptosSinAsignar({'codigoRespuesta': 0});
        }
        if (modificarsuscripcionModelo.conceptosSinAsignar.length > 0) {
            if (!modificarsuscripcionModelo.conceptos) {
                modificarsuscripcionModelo.conceptos = [];
            }
            /**
             * Agrega los conceptos checkeados a los asignados
             * @constructor
             */
            botones.Agregar = function () {
                var checkeados = $('#divListaConceptos label input:checkbox:checked');
                if (checkeados.length === 0) {
                    __dom.lanzarAlerta('No ha seleccionado ningún concepto para asociar', __app.mensajes.atencion);
                    return;
                }
                for (var i = 0; i < checkeados.length; i++) {
                    var check = $(checkeados[i]);
                    var idConceptoCheckeado = parseInt(check.attr('data-id'));
                    for (var j = 0; j < modificarsuscripcionModelo.conceptosSinAsignar.length; j++) {
                        var conceptoSinAsignar = modificarsuscripcionModelo.conceptosSinAsignar[j];
                        
                        if (conceptoSinAsignar.idconcepto === idConceptoCheckeado) {

                            if (conceptoSinAsignar.idconcepto ===  312 ) {
                                var actividadEco = $('#cboActividadEconimica option:selected').data('exento');
                                if (actividadEco == null || actividadEco === '' ) {
                                    __dom.lanzarAlerta("Esta actividad no se puede registrar como Exento", "Error");
                                    break;
                                }
                                $('#cboActividadEconimica').prop('disabled',true);
                            }

                            that.configurarConcepto(0, conceptoSinAsignar);
                            modificarsuscripcionModelo.conceptos.push(conceptoSinAsignar);
                            modificarsuscripcionModelo.conceptosSinAsignar.splice(j, 1);
                            if (modificarsuscripcionModelo.conceptosSinAsignar.length > 0) {
                                that.cargarListaConceptosSinAsignar({
                                    codigoRespuesta: 1,
                                    conceptos: modificarsuscripcionModelo.conceptosSinAsignar
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
                that.llenarTablaConceptos();
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
    },
    
    getLineaMatris : function(){
        $('fieldset#fieldsetLineaMatriz').hide();
        var idSuscripcion = $('#txtIdSuscripcion').val();
        if(idSuscripcion == null || idSuscripcion == ''){
            __dom.lanzarAlerta("Por favor Buscar una Suscripción", "Error");
            return;
        }
        modificarsuscripcionControl.getClienteLineaMatriz({idsuscripcion:idSuscripcion}, that.mostrarResultadoLineaMatriz);
    },
    
    mostrarResultadoLineaMatriz : function(data){
        switch (data.codigoRespuesta){
            case 0 :
                __dom.lanzarAlerta(data.mensaje, "Error");
                $('fieldset#fieldsetLineaMatriz').show();
                break;
            case 1 : 
                $('fieldset#fieldsetLineaMatriz').show();
                that.armaTablaLineaMatriz(data);
                break;
        }
    },
    
    armaTablaLineaMatriz : function(data){
        var fieldset = $('fieldset#fieldsetLineaMatriz');
        fieldset.find('table#tblLineaMatriz').empty();
        if (data.clientelineamatriz.length > 0) {
            var tabla = fillTable('tblLineaMatriz', 'formatolineaMatriz', data.clientelineamatriz, ' Linea Matriz');
            tabla.find('thead th#thSeleccion input').on('mousedown', that.habilitarChecks);
            tabla.find('tbody tr td[header="thSeleccion"] input').on('click', that.seleccionarSuscripciones);
           
            fieldset.show();
        } else {
            console.debug('no hay conceptos en el modelo');
            fieldset.hide();
        }
    },
    
    dropSucripcion : function (){
       var tablaMatriz = $("#tblLineaMatriz tbody tr.selected");
       if(tablaMatriz.length == 0){
           __dom.lanzarAlerta("Por favor Seleccione una Suscripción", "Advertencia");
           return;
       }
       var suscripcionesVinculadas = [];
       for(var matriz = 0 ; matriz < tablaMatriz.length; matriz++){
           var filaSeleted = $(tablaMatriz[matriz]).find('td[header="thSeleccion"] input[type="checkbox"]');
           var idSuscripcionVinculada = filaSeleted.attr("value");
           var idSuscripcionMatriz = $("#txtIdSuscripcion").val();;
           suscripcionesVinculadas.push({
               idsuscripcionVinculada : idSuscripcionVinculada,
               idsuscripcionMatriz : idSuscripcionMatriz
           });
       }
           modificarsuscripcionControl.setRetiraClienteLineaMatriz({suscripcionesVinculadas:suscripcionesVinculadas}, that.respuestaRetiraSuscripcion);
    }, 
    
    respuestaRetiraSuscripcion : function(data){
        switch (data.codigoRespuesta){
            case -1:
                __dom.lanzarAlerta(data.mensaje, "Error");
                break;
            case 1:
                that.getLineaMatris();
        }
        
    },
    
    vincularSucripcion : function (){
        
        that.buscarSuscripcionMatriz();
    },
    
     /**
     * Habilita o deshabilita todos los checks de las facturas dependiendo del estado del check de la 
     * cabecera de la columna de selección
     * @returns {void}
     */
    habilitarChecks: function () {
        var estado = $(this).prop('checked');
        var checks = $('#tblLineaMatriz tbody td[header="thSeleccion"] input[type="checkbox"]');
        checks.prop('checked', estado);
        if (estado === true) {
            checks.parent().parent().addClass('selected');
        } else {
            checks.parent().parent().removeClass('selected');
        }
    },
    
    
     /** Función disparada cuando se selecciona/deselecciona una factura
     * @returns {void}
     */
    seleccionarSuscripciones: function () {
        var check = $(this);
        var trSeleccionada = check.parent().parent();
        var indice = parseInt(trSeleccionada.attr('data-fila'));
        if (check.prop('checked')) {
            trSeleccionada.addClass('selected').find('td[header="thSeleccion"] input');
                 trSeleccionada.find('td[header="thSeleccion"] input').prop('checked', true);
            return;
        }else{
            trSeleccionada.removeClass('selected').find('td[header="thSeleccion"] input');
                trSeleccionada.find('td[header="thSeleccion"] input').prop('checked', false);
            return;
        }
    },
    /** Confirma si desea iniciar una nueva búsqueda 
     * @returns {void}
     **/
    buscarSuscripcionMatriz: function () {
      
        $('#divBuscarSuscripcionVincular').dialogo({
            resizable: false,
            heigth: 350,
            width: 750,
            modal: true,
            title: 'Búsqueda Vincular Suscripcion',
            buttons: {
                "Vincular": function () {
                    $(this).dialog('close');
                    that.vinculaSuscripcionMatriz();
                }, Cancelar: function () {
                    $(this).dialog("close");
                }
            }
        });
    },

    onBuscaClienteVincularMatriz: function () {
        $('#mensajeAlertaDialogo').text('');
        if ($('#txtNombreSuscripcionVincular').val() == '' && $('#txtDireccionSuscripcionVincular').val() == '' && $('#txtIdeSuscripcionVincular').val() == '' && $('#txtPcodigoSuscripcionVincular').val() == '') {
            $('#mensajeAlertaDialogo').text('Error, Digite una de las opciones de Busqueda  ');
            $('#txtNombreSuscripcionVincular').focus();
            return;
        }
        var idSuscripcion = $('#txtIdSuscripcion').val();
        if($('#txtIdSuscripcion').val() == '' || $('#txtIdSuscripcion').val() == null){
            $('#mensajeAlertaDialogo').text('Error, Digite una de las opciones de Busqueda  ');
            return;
        }
        var data = {
            'nombreVincular': $('#txtNombreSuscripcionVincular').val(),
            'direcionVincular': $('#txtDireccionSuscripcionVincular').val(),
            'ideSuscripcionVinciular': $('#txtIdeSuscripcionVincular').val(),
            'pcodicoVincular': $('#txtPcodigoSuscripcionVincular').val(),
            idSuscripcionMatriz : idSuscripcion 

        };
        modificarsuscripcionControl.getClienteLineaMatrizParaVincular({data:data}, that.onResultadoConsultarClienteVincular);
    },

    onResultadoConsultarClienteVincular: function (data) {
        console.log(data);
        $('#tblResultadoFiltro').empty();
        __dom.ocultarCargador();
      //  registroProgramasUsuariosModel.usuarios = data.data.usuarios;
        if (parseInt(data.codigoRespuesta) === -1) {
            var pmensaje = $('#mensajeAlertaDialogo').text(data.mensaje);
            return;
        }
        var tablaUsuarios = fillTable("tblResultadoFiltro", "formatoBuscaClienteVincular", data.suscripcionAVincular, 'Suscripciones a Vincular').show();
         $('#divResultadosFiltro').show();
    }, 
    
    vinculaSuscripcionMatriz : function(){
        var idSuscripcionAVincular = $('table#tblResultadoFiltro input[type=radio]:checked').val();
         var idSuscripcion = $('#txtIdSuscripcion').val();
         var data = {
            idsuscripcionVinculada : idSuscripcionAVincular ,
            idSuscripcionMatriz : idSuscripcion
        };
        modificarsuscripcionControl.insertaClienteLineaMatrizAVincular({data:data}, that.onResultadoClienteVincular);
    },
    
    onResultadoClienteVincular: function(data){
        switch (data.codigoRespuesta){
            case -3:
                __dom.lanzarAlerta(data.suscripcionInsertada[0]['vinculada'], "Cliente vinculado a otra linea Matrix");
                break;
            case 1:
                that.getLineaMatris();
                __dom.lanzarAlerta("Se registro correctamente", "");
                break;
        }
    }
    

};

modificarsuscripcionVista.init();
