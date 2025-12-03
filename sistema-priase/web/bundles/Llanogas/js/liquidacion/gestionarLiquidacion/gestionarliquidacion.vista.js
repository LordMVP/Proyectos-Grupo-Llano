/**
 * @fileOverview Archivo de vista y control para gestionar liquidación
 * @author jeissonBarriga
 * @requires gestionarliquidacion.control.js
 * @requires gestionarliquidacion.modelo.js
 * @version 1.0.0
 */

/**
 * Objeto que hace referencia al namespace gestionarsuscripcionVista
 * @type {object}
 */
var that = null;

/** @namespace */
var gestionarliquidacionVista = {
    /**
     * hace referencia al último diálogo abierto en la aplicación
     * @type {object}
     */
    dialogoActual: null,
    /**
     * Función que se invoca al inciar el objeto gestionarliquidacionVista. Asigna comportamientos para los eventos de los controles.
     * @returns {void}
     */
    init: function () {
        that = this;
        __app.vistaActual = gestionarliquidacionVista;
        __app.controlActual = gestionarliquidacionControl;
        var comandos = $('div#divComandos');
        comandos.find('#btnNuevo').on('click', that.iniciarNuevoProceso);
        comandos.find('#btnBuscar').on('click', that.mostrarBuscarLiquidacion);
        comandos.find('#btnGrabar').on('click', that.grabarOperacion);
        comandos.find('#btnCancelar').on('click', that.cancelarOperacion);
        $('#fieldsetLiquidacion').find('#cboClasificacion').on('change', that.consultarDocumentos);
        $('#fieldsetLiquidacion').find('#cboDocumento').on('change', that.consultarTiposDocumento);
        $('#fieldsetLiquidacion').find('#txtInicioVigencia').on('change', that.validarCampoInicioVigencia);
        $('#fieldsetLiquidacionEspecial #cboMunicipioSelecionado').on('change', that.cambiarMunicipio);
        $('#fieldsetLiquidacion').find('#txtFinVigencia').on('change', that.validarCampoFinVigencia);
        $('#fieldsetLiquidacion').find('#txtLiquidacion').on('blur', that.validarCampoLiquidacion);
        $('#fieldsetAgregarConceptos').find('#txtConcepto').on('blur', that.validarCampoConcepto);
        $('#fieldsetOtrasVinculaciones').find('#txtMunicipio').on('blur', that.validarCampoMunicipio);
        $('#fieldsetAgregarConceptos').find('#btnAgregar').on('click', that.agregarConcepto);
        $('#fieldsetAgregarConceptos').find('#btnQuitarConceptos').on('click', that.quitarConceptos);
        $('#fieldsetOtrasVinculaciones').find('#btnAgregarMunicipio').on('click', that.agregarMunicipio);
        $('#fieldsetOtrasVinculaciones').find('#btnQuitarMunicipio').on('click', that.quitarMunicipios);
        $('#fieldsetOtrasVinculaciones').find('#btnAgregarTipoUso').on('click', that.agregarTipoUso);
        $('#fieldsetOtrasVinculaciones').find('#btnQuitarTipoUso').on('click', that.quitarTiposUso);
        $('#fieldsetLiquidacionEspecial').find('#btnBuscarSuscripcion').on('click', that.mostrarBuscarSuscripcion);
        $('#divBuscarSuscripcion').find('#btnBuscarSuscripcion').on('click', that.consultarSuscripcion);
        $('#fieldsetLiquidacion').find('#btnAgregarConceptos').on('click', that.mostrarAgregarConceptos);
        $('#fieldsetAgregarConceptos').find('#btnOtrasVinculaciones').on('click', that.mostrarOtrasVinculaciones);
        $('#fieldsetOtrasVinculaciones').find('#btnLiquidacionEspecial').on('click', that.mostrarLiquidacionEspecial);
        $('#fieldsetLiquidacionEspecial').find('#btnAgregarLiquidacionEspecial').on('click', that.agregarLiquidacionEspecial);
        $('#fieldsetLiquidacionEspecial').find('#btnReiniciarLiquidacionEspecial').on('click', that.limpiarCamposLiquidacionEspecial);
        $('#fieldsetLiquidacionEspecial').find('#btnQuitarLiquidacionEspecial').on('click', that.quitarLiquidacionesEspeciales);
        $('#divBuscarLiquidacion #btnBuscarLiquidacion').on('click', that.consultarLiquidacionParametrizada);

        //configurar calendarios
        __dom.configurarCalendario('txtInicioVigencia, #txtFinVigencia');
        //$('#txtInicioVigencia').datepicker('option', 'minDate', new Date()).val(''); -- Se reemplaza fecha del cliente por fecha de servidor
        $('#txtInicioVigencia').datepicker('option', 'minDate', __app.obtenerFechaSistema()).val('');
        
        //configurar campos numéricos
        __dom.configurarTextoNumerico('txtDiaVencimiento, #txtDiaSuspension, #divBuscarLiquidacion #txtIdLiquidacion, #txtValorLimiteAprobado');
        //cargar los campos que tienen autocompletado
        that.cargarAutocompleteBarrio();
        that.cargarAutocompleteConcepto();
        that.cargarAutocompleteLiquidacion();
        that.cargarAutocompleteLiquidacionParametrizada();
        that.consultarMunicipios();
        that.reiniciarProceso();
        that.consultarTiposUso();
        that.consultarMunicipiosPorUsuario();
    },
    /**
     * Agrega un concepto a la tabla de conceptos y muestra el botón de quitar conceptos.
     * Si no se ha elegido un concepto se mostrará una alerta.
     * @returns {void}
     */
    agregarConcepto: function () {
        var concepto = $('#fieldsetAgregarConceptos #txtConcepto').val().trim();

        var idconcepto = gestionarliquidacionModelo.idConcepto;
        var conceptos = gestionarliquidacionModelo.conceptos;
        var imprimir = $('input[name = rbtnImprimirRecibo]:checked').val();
        var objeto = {
            'concepto': concepto,
            'idconcepto': idconcepto,
            'imprimir': imprimir,
            'accion': 'I'
        };
        if (!(idconcepto || idconcepto === 0) || concepto === '') {
            __dom.lanzarAlerta('Debe seleccionar un concepto', __app.mensajes.atencion);
            return;
        }
        var encontrado = 0;
        $.each(conceptos, function (index, conceptoModelo) {
            if (conceptoModelo.concepto === concepto) {
                encontrado++;
            }
        });
        if (encontrado === 0) {
            conceptos.push(objeto);
            $('#fieldsetAgregarConceptos').find('#btnQuitarConceptos').show();
            $('#fieldsetAgregarConceptos').find('#txtConcepto').val('');
            that.llenarTablaConceptos();
            return;
        }
        $('#fieldsetAgregarConceptos').find('#txtConcepto').val('');
        __dom.lanzarAlerta('El concepto ya está registrado', __app.mensajes.atencion);

    },
    /**
     * Agrega una liquidación especial a la tabla de liquidaciones especiales y 
     * muestra el botón de quitar liquidaciones especiales.
     * @returns {void}
     */
    agregarLiquidacionEspecial: function () {
        var fielset = $('#fieldsetLiquidacionEspecial');
        var idsuscripcion = fielset.find('#txtCodigoSuscripcion').val();
        var munSelect = fielset.find('#cboMunicipioSelecionado');
        var municipio = munSelect.val() === '-1' ? '' : munSelect.find('option:selected').text();
        var tipSelect = fielset.find('#cboTipoUsoSeleccionado');
        var tipouso = tipSelect.val() === '-1' ? '' : tipSelect.find('option:selected').text();
        var estratoSeleccionado = fielset.find('#cboEstrato option:selected').text();
        var estrato = estratoSeleccionado === 'Seleccione' ? '' : estratoSeleccionado;
        var barrio = fielset.find('#txtBarrio').val().trim();
        var valorlimite = fielset.find('#txtValorLimiteAprobado').val().trim();
        if (idsuscripcion || idsuscripcion === 0) {
            var sus = gestionarliquidacionModelo.suscripcion;
            gestionarliquidacionModelo.liquidacionesEspeciales.push(
                    {'accion': 'I', 'idsuscripcion': idsuscripcion,
                        'idmunicipio': sus.idmunicipio, 'municipio': sus.municipio,
                        'idtipouso': sus.idtipousosuscripcion, 'idbarrio': sus.idbarrio,
                        'tipouso': sus.tipousosuscripcion, 'estrato': sus.estrato, 'barrio': sus.barrio});
            $('#btnQuitarLiquidacionEspecial').show();
        } else {
            if (municipio == '' && tipouso == '' && estrato == '' && barrio == '' && valorlimite == '') {
                __dom.lanzarAlerta('Debe seleccionar una suscripción o digitar los campos.', __app.mensajes.atencion);
                return;
            }
            if ((barrio !== '' || estrato !== '') && municipio == '') {
                __dom.lanzarAlerta(__app.mensajes.seleccionarMunicipio, __app.mensajes.atencion);
                return;
            }
            var liquidacionEspecial = {
                'accion': 'I',
                'idmunicipio': munSelect.val(),
                'municipio': municipio,
                'idtipouso': tipSelect.val() !== '-1' ? tipSelect.val() : '',
                'tipouso': tipouso,
                'estrato': estrato,
                'barrio': barrio,
                'idbarrio': $('#txtIdBarrio').val(),
                'valorlimite': valorlimite
            }
            gestionarliquidacionModelo.liquidacionesEspeciales.push(liquidacionEspecial);
            $('#btnQuitarLiquidacionEspecial').show();

        }
        if (gestionarliquidacionModelo.accion === 'I') {
            $('#fieldsetLiquidacionEspecial').find('#btnQuitarLiquidacionEspecial').show();
        }
        that.limpiarCamposLiquidacionEspecial();
        that.llenarTablaLiquidacionesEspeciales();

    },
    /** Limpia las cajas de texto del formulario de liquidación especial 
     * @returns {void}
     **/
    limpiarCamposLiquidacionEspecial: function () {
        var fieldset = $('#fieldsetLiquidacionEspecial');
        fieldset.find('input[type="text"], select').not('#txtBarrio').attr('disabled', false);
        fieldset.find('input[type="text"]').val('').attr('disabled', false);
        fieldset.find('select').val(-1);
    },
    /**
     * Agrega un municipio a la tabla de municipios y muestra el botón de quitar municipios.
     * Si no se ha seleccionado un municipio se mostrará una alerta.
     * @returns {void}
     */
    agregarMunicipio: function () {
        var municipios = gestionarliquidacionModelo.municipios;// municipios  almacenados
        var tbody = $('#divDialogoMunicipios tbody');
        for (var i = 0; i < municipios.length; i++) {
            var id = municipios[i].idmunicipio;
            if (municipios[i].accion != 'E') {
                var input = tbody.find('tr td[header="thSeleccionar"] input[value="' + id + '"]');
                if (input.prop("checked") != true) {
                    input.click();
                }
            }
        }
        var dialogo = $('div#divDialogoMunicipios');
        dialogo.dialogo({
            modal: true,
            width: 700,
            position: {my: "center", at: "top+30", of: "body"},
            title: 'Municipios',
            buttons: {
                Selecionar: that.selecionarMunicipios,
                Cerrar: function () {
                    $(this).dialog('close');
                }
            }
        });
    },
    /**
     * Agrega un tipo de uso a la tabla de tipos de uso y muestra el botón de quitar tipos de uso.
     * Si no se ha seleccionado un tipo de uso se mostrará una alerta.
     * @returns {void}
     */
    agregarTipoUso: function () {
        var tiposUso = gestionarliquidacionModelo.tiposUso;
        var idtipouso = parseInt($('#fieldsetOtrasVinculaciones').find('#cboTipoUso').val());
        if (idtipouso === -1) {
            __dom.lanzarAlerta('Debe seleccionar un tipo de uso', __app.mensajes.atencion);
            return;
        }
        var encontrado = 0;
        $.each(tiposUso, function (index, tipousoModelo) {
            if (tipousoModelo.idtipouso === idtipouso) {
                encontrado++;
            }
        });
        if (encontrado === 0) {
            var tipouso = $('#fieldsetOtrasVinculaciones').find('#cboTipoUso').find('option:selected').html();
            gestionarliquidacionModelo.tiposUso.push({'idtipouso': idtipouso, 'tipouso': tipouso, 'accion': 'I'});
            that.llenarComboTipoUsoSeleccionado();
            that.llenarTablaTiposUso();
            $('#fieldsetOtrasVinculaciones').find('#btnQuitarTipoUso').show();
            $('#fieldsetOtrasVinculaciones').find('#cboTipoUso').val(-1);
            return;
        }
        $('#fieldsetOtrasVinculaciones').find('#cboTipoUso').val(-1);
        __dom.lanzarAlerta('El tipo de uso ya está registrado', __app.mensajes.atencion);
    },
    /**
     * Pregunta al usuario si desea cancelar la operación actual.
     * Si el usuario desea cancelar, se reinicia la operación.
     * @returns {void}
     */
    cancelarOperacion: function () {
        var accion = gestionarliquidacionModelo.accion;
        if (accion !== '') {
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
    /**
     * Carga el autocompletado de barrios fijando un mínimo de 3 caracteres para activarlo.
     * @returns {void}
     */
    cargarAutocompleteBarrio: function () {
        __dom.configurarAutocomplete(
                '#fieldsetLiquidacionEspecial #txtBarrio',
                that.sourceAutoCompleteBarrio,
                function (event, ui) {
                    gestionarliquidacionModelo.idBarrio = ui.item.idVal;
                    $('#txtIdBarrio').val(ui.item.idVal);
                },
                function (txt) {
                    gestionarliquidacionModelo.idBarrio = undefined;
                    $('#txtIdBarrio').val('');
                }
        );
    },
    /**
     * Carga el autocompletado de conceptos fijando un mínimo de 3 caracteres para activarlo.
     * @returns {void}
     */
    cargarAutocompleteConcepto: function () {
        __dom.configurarAutocomplete(
                '#fieldsetAgregarConceptos #txtConcepto',
                that.sourceAutoCompleteConcepto,
                function (event, ui) {
                    gestionarliquidacionModelo.idConcepto = ui.item.idVal;
                },
                function (txt) {
                    gestionarliquidacionModelo.idConcepto = undefined;
                }
        );
    },
    /**
     * Carga el autocompletado de liquidaciones fijando un mínimo de 3 caracteres para activarlo.
     * @returns {void}
     */
    cargarAutocompleteLiquidacion: function () {
        __dom.configurarAutocomplete(
                '#txtLiquidacion',
                that.sourceAutoCompleteLiquidacion,
                function (event, ui) {
                    if (event.target.id === 'txtLiquidacion') {
                        gestionarliquidacionModelo.idLiquidacion = ui.item.idVal;
                        gestionarliquidacionModelo.idestructura = ui.item.idestructura;
                    }
                    gestionarliquidacionModelo.idLiquidacionParametrizada = ui.item.idVal;
                },
                function (txt) {
                    if (txt[0].id === 'txtLiquidacion') {
                        gestionarliquidacionModelo.idLiquidacion = undefined;
                        gestionarliquidacionModelo.idestructura = undefined;
                    }
                    gestionarliquidacionModelo.idLiquidacionParametrizada = undefined;
                }
        );
    },
    /**
     * Carga el autocompletado de liquidaciones fijando un mínimo de 3 caracteres para activarlo.
     * @returns {void}
     */
    cargarAutocompleteLiquidacionParametrizada: function () {
        __dom.configurarAutocomplete(
                '#txNombreLiquidacion',
                that.sourceAutoCompleteLiquidacionParametrizada,
                function (event, ui) {
                    $('#txNombreLiquidacion').attr('data-id', ui.item.idVal);
                    //gestionarliquidacionModelo.idLiquidacionParametrizada = ui.item.idVal;
                },
                function (txt) {
                    $('#txNombreLiquidacion').removeAttr('data-id');
                }
        );
    },
    /**
     * Consulta los documentos asociados a la clasificación seleccionada.
     * Si la clasificación seleccionada es Convenio o Campaña se mostrará el botón de liquidación especial.
     * @returns {void}
     */
    consultarDocumentos: function () {
        
        
        $('#fieldsetLiquidacion').find('#cboDocumento').find('option').remove();
        var clasificacion = $('#fieldsetLiquidacion #cboClasificacion').find('option:selected').html();
        var btnLiquidacionEspecial = $('#fieldsetOtrasVinculaciones #btnLiquidacionEspecial');
        var idclasificacion = $('#fieldsetLiquidacion').find('#cboClasificacion').val();
        
        $('#divCboTipoCuota').hide();
        $('#divCboPermiteVenta').hide();
        btnLiquidacionEspecial.hide();
        $('#fieldsetLiquidacionEspecial').hide();
        if (idclasificacion === '-1' || idclasificacion === null) {
            return;
        }
        var data = {'idclasificacion': idclasificacion};
        gestionarliquidacionControl.consultarDocumentos(data, that.onConsultarDocumentosCompleto);
        if (clasificacion === 'Convenio' || clasificacion === 'Campaña') {
            btnLiquidacionEspecial.show();
        }
        if(idclasificacion === 'FI'){
            $('#divCboTipoCuota').show();
        }
         if (clasificacion === 'Convenio' || clasificacion === 'Campaña' || clasificacion === 'Venta') {
            $('#divCboPermiteVenta').show();
        }        
    },
    /**
     * Consulta las liquidaciones parametrizadas  que coincidan con los campos diligenciados.
     * Se debe eleligir una liquidación de la cual se tomará toda la información necesaria
     * para llenar los campos disponibles
     * @returns {void}
     */
    consultarLiquidacionParametrizada: function () {
        var divLiquidacion = $('#divBuscarLiquidacion');
        var idliquidacion = divLiquidacion.find('#txtIdLiquidacion').val().trim();
        var idliquidacionautocomplete = divLiquidacion.find('#txNombreLiquidacion').attr('data-id');
        if (idliquidacion === '' && !idliquidacionautocomplete) {
            __dom.lanzarAlerta(__app.mensajes.camposInvalidosFiltro, __app.mensajes.atencion);
            return;
        }
        var data = {};
        data.idliquidacion = idliquidacion;
        that.dialogoActual.dialog('close');
        if (idliquidacionautocomplete) {
            data.idliquidacion = idliquidacionautocomplete;
            gestionarliquidacionModelo.idLiquidacionParametrizada = idliquidacionautocomplete;
        }
        gestionarliquidacionControl.consultarLiquidacionesParametrizadas(data, that.onConsultarLiquidacionParametrizadaCompleto);
    },
    /** Hace petición ajax para consultar los municipios que se podrán eliminar 
     * @returns {void}
     **/
    consultarMunicipiosPorUsuario: function () {
        gestionarliquidacionControl.consultarMunicipiosPorUsuario(that.onConsultarMunicipiosPorUsuarioCompleto);
    },
    /**
     * Consulta las suscripciones  que coincidan con los campos diligenciados.
     * Se debe eleligir una suscripción de la cual se tomará el id para mostrarlo 
     * en el campo correpondiente
     * @returns {void}
     */
    consultarSuscripcion: function () {
        var divBuscarSuscripcion = $('#divBuscarSuscripcion');
        var idsuscripcion = divBuscarSuscripcion.find('#txtIdSuscripcion').val().trim();
        var cedula = divBuscarSuscripcion.find('#txtDocumento').val().trim();
        var codigoanterior = divBuscarSuscripcion.find('#txtCodigoAnterior').val().trim();
        var municipiosModelo = gestionarliquidacionModelo.municipios;
        if (idsuscripcion === '' && cedula === '' && codigoanterior === '') {
            gestionarliquidacionModelo.suscripcion = null;
            $('#pMensajeSuscripcion').text(__app.mensajes.camposInvalidosFiltro);
            return;
        }
        var municipios = '';
        $.each(municipiosModelo, function (index, municipio) {
            municipios = (index === municipiosModelo.length - 1) ? municipios + municipio.idmunicipio : municipios + municipio.idmunicipio + ',';
        });
        var data = {
            'idsuscripcion': idsuscripcion,
            'cedula': cedula,
            'codigoanterior': codigoanterior,
            'municipios': municipios
        };
        gestionarliquidacionControl.consultarSuscripciones(data, that.onConsultarSuscripcionesCompleto);
    },
    /**
     * Consulta los tipos de documento asociados al documento seleccionado.
     * @returns {void}
     */
    consultarTiposDocumento: function () {
        $('#fieldsetLiquidacion').find('#cboTipoDocumento').find('option').remove();
        var iddocumento = $('#fieldsetLiquidacion').find('#cboDocumento').val();
        if (iddocumento < 0 || iddocumento === null) {
            return;
        }
        var data = {'iddocumento': iddocumento};
        gestionarliquidacionControl.consultarTiposDocumento(data, that.onConsultarTiposDocumentoCompleto);
    },
    /**
     * Consulta los tipos de uso disponibles en la base de datos.
     * @returns {void}
     */
    consultarTiposUso: function () {
        gestionarliquidacionControl.consultarTiposUso(that.onConsultarTiposUsoCompleto);
    },
    /**
     * Consulta al backend si es posible eliminar el concepto seleccionado en la
     * tabla de conceptos.
     * @param  {Number} idconcepto Identificador del concepto a eliminar.
     * @returns {void}
     */
    consultarValidacionEliminarConcepto: function (idconcepto) {
        var idliquidacion = gestionarliquidacionModelo.idLiquidacion;
        var data = {'idliquidacion': idliquidacion, 'idconcepto': idconcepto};
        if (gestionarliquidacionModelo.accion === 'I') {
            gestionarliquidacionControl.validarEliminarConcepto(data, that.onConsultarValidacionEliminarConceptoCompleto);
        } else {
            that.onConsultarValidacionEliminarConceptoCompleto({codigoRespuesta: 0});
        }

    },
    /**
     * Consulta al backend si es posible eliminar el tipo de uso seleccionado en la
     * tabla de tipos de uso.
     * @param  {Number} idtipouso Identificador del tipo de uso a eliminar.
     * @returns {void}
     */
    consultarValidacionEliminarTipoUso: function (idtipouso) {
        var idliquidacion = gestionarliquidacionModelo.idLiquidacion;
        var data = {'idliquidacion': idliquidacion, 'idtipouso': idtipouso};
        if (gestionarliquidacionModelo.accion === 'I') {
            gestionarliquidacionControl.validarEliminarTipoUso(data, that.onConsultarValidacionEliminarTipoUsoCompleto);
        } else {
            that.onConsultarValidacionEliminarTipoUsoCompleto({codigoRespuesta: 0});
        }
    },
    /**
     * Consulta al backend si es posible eliminar el municipio seleccionado en la
     * tabla de municipios.
     * @param  {Number} idmunicipio Identificador del municipio a eliminar.
     * @returns {void}
     */
    consultarValidacionEliminarMunicipio: function (idmunicipio) {
        var idliquidacion = gestionarliquidacionModelo.idLiquidacion;
        var data = {'idliquidacion': idliquidacion, 'idmunicipio': idmunicipio};
        if (gestionarliquidacionModelo.accion === 'I') {
            gestionarliquidacionControl.validarEliminarMunicipio(data, that.onConsultarValidacionEliminarMunicipioCompleto);
        } else {
            that.onConsultarValidacionEliminarMunicipioCompleto({codigoRespuesta: 0});
        }
    },
    /**
     * Consulta al backend los municipios que puede seleccionar
     * @returns {undefined}
     */
    consultarMunicipios: function () {
        gestionarliquidacionControl.consultarMunicipios({}, that.mostrarResultadoMunicipio);
    },
    /**
     * Valida que estén diligenciado los campos obligatorios y construye un objeto 
     * JSON con toda la información necesaria para guardar la liquidación.
     * @returns {void}
     */
    grabarOperacion: function () {
        var accion = gestionarliquidacionModelo.accion;
        if (accion === '') {
            __dom.lanzarAlerta(__app.mensajes.sinCambios, __app.mensajes.atencion);
            return;
        }
        var fieldsetLiquidacion = $('#fieldsetLiquidacion');
        var clasificacion = fieldsetLiquidacion.find('#cboClasificacion').val();
        
        var camposSinValidacion = '#txtDiaSuspension, #txtDiaVencimiento, #txtFinVigencia, #cboPermiteVenta';
        if( clasificacion !== 'FI'){
            camposSinValidacion += ', #cboTipoCuota';
        }
        var camposValidar = fieldsetLiquidacion.find('input[type = text], select').not(camposSinValidacion);
        var camposInvalidos = '';
        $.each(camposValidar, function (index, elemento) {
            var campo = $(elemento);
            if (campo.val() === '' || campo.val() === '-1' || campo.val() === null) {
                var label = $('label[for =' + campo[0].id + ']').html();
                camposInvalidos += label.replace(':', '');
            }
        });
        if (camposInvalidos !== '') {
            __dom.lanzarAlerta('Debe diligenciar los siguientes campos de liquidación: ' + camposInvalidos, __app.mensajes.atencion);
            return;
        }
        //Validar que existe almenos un concepto
        if (gestionarliquidacionModelo.conceptos.length === 0) {
            __dom.lanzarAlerta('La liquidación debe tener al menos un concepto', __app.mensajes.atencion);
            return;
        }

        var controlVentas = 'N';
        if(clasificacion === 'VE' || clasificacion === 'CA' || clasificacion === 'CO' ){
            controlVentas = $('#cboPermiteVenta').val();
        }
        var idliquidacion = gestionarliquidacionModelo.idLiquidacion;
        var nombreliquidacion = fieldsetLiquidacion.find('#txtLiquidacion').val().trim();
        var idestructura = gestionarliquidacionModelo.idestructura;
        var iddocumento = fieldsetLiquidacion.find('#cboDocumento').val();
        var idtipdocumento = fieldsetLiquidacion.find('#cboTipoDocumento').val();
        var inivigencia = fieldsetLiquidacion.find('#txtInicioVigencia').val();
        var finvigencia = fieldsetLiquidacion.find('#txtFinVigencia').val();
        var tipocuota = ( clasificacion === 'FI') ? $('#cboTipoCuota').val(): 'N';
        var historico = fieldsetLiquidacion.find('input[name = rbtnGuardarHistorico]:checked').val();
        var diavencimiento = fieldsetLiquidacion.find('#txtDiaVencimiento').val();
        var diasuspension = fieldsetLiquidacion.find('#txtDiaSuspension').val();
        var conceptosModelo = gestionarliquidacionModelo.conceptos;//accion === 'I' ? gestionarliquidacionModelo.conceptos : gestionarliquidacionModelo.conceptosEliminar;
        var conceptos = [];
        $.each(conceptosModelo, function (index, concepto) {
            if (concepto.idconcepto && concepto.accion) {
                var idconcepto = concepto.idconcepto;
                var imprimir = concepto.imprimir;
                var accion = concepto.accion;
                conceptos.push({'idconcepto': idconcepto, 'imprimir': imprimir, 'accion': accion});
            }
        });
        if (accion !== 'I') {
            $.each(gestionarliquidacionModelo.conceptosEliminar, function (index, concepto) {
                if (concepto.idconcepto) {
                    conceptos.push(concepto);
                }
            });
        }

        var municipios = that.construirMunicipiosFinales();

        var tiposuso = [];
        $.each(gestionarliquidacionModelo.tiposUso, function (index, tipouso) {
            if (tipouso.idtipouso) {
                tiposuso.push({'idtipouso': tipouso.idtipouso,
                    'accion': tipouso.accion,
                    'idregistrotipouso': tipouso.idregistrotipouso});
            }
        });
        $.each(gestionarliquidacionModelo.tiposUsoEliminar, function (index, tipouso) {
            if (tipouso.idtipouso) {
                var idtipouso = tipouso.idtipouso;
                var accion = tipouso.accion;
                tiposuso.push({'idtipouso': tipouso.idtipouso,
                    'accion': tipouso.accion,
                    'idregistrotipouso': tipouso.idregistrotipouso});
            }
        });
        var liquidacionespecialModelo = gestionarliquidacionModelo.liquidacionesEspeciales;
        var liquidacionespecial = [];
        if (liquidacionespecialModelo.length > 0) {
            $.each(liquidacionespecialModelo, function (index, liquidacion) {
                if (liquidacion.idmunicipio) {
                    var objeto = {
                        'idmunicipio': liquidacion.idmunicipio,
                        'idbarrio': liquidacion.idbarrio,
                        'idtipouso': liquidacion.idtipouso,
                        'estrato': liquidacion.estrato,
                        'valorlimite': liquidacion.valorlimite,
                        'idsuscripcion': liquidacion.idsuscripcion,
                        'idregistroliquidacionespecial': !!liquidacion.idregistroliquidacionespecial ? liquidacion.idregistroliquidacionespecial : null,
                        'accion': !!liquidacion.idregistroliquidacionespecial ? 'A' : liquidacion.accion
                    };
                    liquidacionespecial.push(objeto);
                }
            });
        }
        var especialesEliminar = gestionarliquidacionModelo.liquidacionesEspecialesEliminar;
        if (especialesEliminar.length > 0) {
            $.each(especialesEliminar, function (i, eliminado) {
                liquidacionespecial.push(eliminado);
            })
        }
        
        
        
        
        var jsonGrabar = gestionarliquidacionModelo.jsonGrabar = {};
        jsonGrabar.idliquidacion = idliquidacion;
        jsonGrabar.nombreliquidacion = nombreliquidacion;
        jsonGrabar.idestructura = idestructura;
        jsonGrabar.iddocumento = iddocumento;
        jsonGrabar.idtipdocumento = idtipdocumento;
        jsonGrabar.inivigencia = inivigencia;
        jsonGrabar.finvigencia = finvigencia;
        jsonGrabar.clasificacion = clasificacion;
        jsonGrabar.historico = historico;
        jsonGrabar.diavencimiento = diavencimiento;
        jsonGrabar.diasuspension = diasuspension;
        jsonGrabar.accion = accion;
        jsonGrabar.conceptos = conceptos;
        jsonGrabar.municipios = municipios;
        jsonGrabar.tiposusos = tiposuso;
        jsonGrabar.tipocuota = tipocuota;
        jsonGrabar.liquidacionespecial = liquidacionespecial;
        jsonGrabar.controlVenta = controlVentas;
        var data = {'liquidacion': jsonGrabar};
        gestionarliquidacionControl.grabarOperacion(data, that.onGrabarOperacionCompleto);
    },
    /**
     * Valida que municipios se eliminan y cuales se insertan 
     * @returns {Array}
     */
    construirMunicipiosFinales: function () {
        var originales = gestionarliquidacionModelo.municipiosOriginales;
        originales.map(function (dato) {
            dato['accion'] = 'E';
        });
        var actuales = gestionarliquidacionModelo.municipios;
        var nuevos = [];
        var eliminado = [];
        for (var i = 0; i < actuales.length; i++) {
            var actual = actuales[i];
            var existe = false;
            for (var j = 0; j < originales.length; j++) {
                var original = originales[j];
                if (original.idmunicipio == actual.idmunicipio) {
                    existe = true;
                    delete original['accion'];
                    break;
                }
            }
            if (!existe) {
                nuevos.push(actual);
            }
        }
        var arrayFinal = originales.concat(nuevos);
        return arrayFinal;

    },
    /**
     * Reinicia la operación, habilita los campos del fieldset liquidación y 
     * muestra el botón de agregar conceptos.
     * @returns {void}
     */
    iniciarNuevoProceso: function () {
        var accion = gestionarliquidacionModelo.accion;
        if (accion === 'A') {
            __dom.lanzarAlerta(__app.mensajes.confirmacionCancelacion,
                    __app.mensajes.atencion,
                    that.inicio,
                    function () {
                        return null;
                    }
            );
        } else {
            that.inicio();
        }
    },
    inicio: function () {
        that.reiniciarProceso();
        var camposLiquidacion = $('#fieldsetLiquidacion').find('input, select').not('input[type = button]');
        camposLiquidacion.prop('disabled', false);
        $('#fieldsetLiquidacion').find('#btnAgregarConceptos').show();
        gestionarliquidacionModelo.accion = 'I';
        var dat = __app.obtenerFechaSistema(); // new Date(); -- Se reemplaza fecha del cliente por fecha del servidor
        var mes = (dat.getMonth() + 1).toString();
        mes = (mes.length < 2 ? "0" + mes : mes);
        var dia = (dat.getDate()).toString();
        dia = (dia.length < 2 ? "0" + dia : dia);
        var fecha = dat.getFullYear() + "-" + mes + "-" + dia;
        $('#txtInicioVigencia').val(fecha).blur();
    },
    /**
     * Muestra el fieldset "agregar conceptos". Si no se ha seleccionado una liquidación
     * se muestra una alerta.
     * @returns {void}
     */
    mostrarAgregarConceptos: function () {
        var idLiquidacion = gestionarliquidacionModelo.idLiquidacion;
        if (idLiquidacion || idLiquidacion === 0) {
            $('#fieldsetAgregarConceptos').show();
            return;
        }
        __dom.lanzarAlerta(__app.mensajes.seleccionarLiquidacion, __app.mensajes.atencion);
    },
    /**
     * Muestra la ventana emergente "buscar suscripción".
     * @returns {void}
     */
    mostrarBuscarSuscripcion: function () {
        var dialogo = $('#divBuscarSuscripcion');
        that.dialogoActual = dialogo.dialogo({
            modal: true,
            width: 850,
            title: 'Buscar una suscripción'
        });
    },
    /**
     * Muestra la ventana emergente "buscar liquidación".
     * @returns {void}
     */
    mostrarBuscarLiquidacion: function () {
        var dialogo = $('#divBuscarLiquidacion');
        dialogo.find('input[type = text]').val('');
        that.dialogoActual = dialogo.dialogo({
            modal: true,
            width: 700,
            title: 'Buscar una liquidación parametrizada'
        });
    },
    /**
     * Muestra el fieldset "liquidación especial".
     * @returns {void}
     */
    mostrarLiquidacionEspecial: function () {
        $('#fieldsetLiquidacionEspecial').show();
    },
    /**
     * Muestra el fieldset "otras vinculaciones".
     * Si no se han agregado conceptos se muestra una alerta.
     * @returns {void}
     */
    mostrarOtrasVinculaciones: function () {
        var conceptos = gestionarliquidacionModelo.conceptos;
        if (conceptos.length > 0) {
            $('#fieldsetOtrasVinculaciones').show();
            return;
        }
        __dom.lanzarAlerta('La liquidación debe tener al menos un concepto', __app.mensajes.atencion);
    },
    /**
     * Gestiona el arreglo de barrios que se obtuvo de la consulta para mostrarlo como
     * una lista de opciones en el combo de barrio.
     * @param  {Object} data Respuesta del servidor al consultar los barrios.
     * @returns {void}
     */
    mostrarResultadoBarrio: function (data) {
        if (data.codigoRespuesta == 1) {
            var result = [];
            $.each(data.datos, function (i, item) {
                result.push({
                    label: item.barrio,
                    value: item.barrio,
                    idVal: item.idbarrio
                });
            });
            that.response(result);
        }
    },
    /**
     * Gestiona el arreglo de conceptos que se obtuvo de la consulta para mostrarlo como
     * una lista de opciones en el combo de concepto.
     * @param  {Object} data Respuesta del servidor al consultar los conceptos.
     * @returns {void}
     */
    mostrarResultadoConcepto: function (data) {
        if (data.codigoRespuesta === 1) {
            var result = [];
            $.each(data.datos, function (i, item) {
                result.push({
                    label: item.concepto,
                    value: item.concepto,
                    idVal: item.idconcepto
                });
            });
            that.response(result);
        }
    },
    /**
     * Gestiona el arreglo de municipios que se obtuvo de la consulta para mostrarlo 
     * cargarlos en un popup.
     * @param  {Object} data Respuesta del servidor al consultar los municipios.
     * @returns {void}
     */
    mostrarResultadoMunicipio: function (data) {
        if (data.codigoRespuesta === 1) {
            gestionarliquidacionModelo.municipiosParaSelecionar = data.datos;
            console.log(gestionarliquidacionModelo.municipiosParaSelecionar);
            that.llenarTablaMunicipiosParaSeleccionar();
        }
    },
    /**
     * Gestiona el arreglo de liquidaciones que se obtuvo de la consulta para mostrarlo como
     * una lista de opciones en el combo de liquidación.
     * @param  {Object} data Respuesta del servidor al consultar las liquidaciones.
     * @returns {void}
     */
    mostrarResultadoLiquidacion: function (data) {
        if (data.codigoRespuesta === 1) {
            var result = [];
            $.each(data.datos, function (i, item) {
                result.push({
                    label: item.liquidacion,
                    value: item.liquidacion,
                    idVal: item.idliquidacion,
                    idestructura: item.idestructura
                });
            });
            that.response(result);
        }
    },
    /**
     * Gestiona el arreglo de liquidaciones que se obtuvo de la consulta para mostrarlo como
     * una lista de opciones en el combo de liquidación.
     * @param  {Object} data Respuesta del servidor al consultar las liquidaciones.
     * @returns {void}
     */
    mostrarResultadoLiquidacionParametrizada: function (data) {
        if (data.codigoRespuesta) {
            var result = [];
            $.each(data.datos, function (i, item) {
                result.push({
                    label: item.liquidacion,
                    value: item.liquidacion,
                    idVal: item.idliquidacion
                });
            });
            that.response(result);
        }
    },
    /**
     * Llena el combo de municipios a partir de un arreglo almacenado en el modelo
     * @returns {void}
     */
    llenarComboMunicipioSeleccionado: function () {
        var cboMunicipioSelecionado = $('#fieldsetLiquidacionEspecial #cboMunicipioSelecionado').empty();
        __dom.llenarCombo(cboMunicipioSelecionado, gestionarliquidacionModelo.municipios, 'idmunicipio', 'municipio');
    },
    /** Permite editar el barrio para una liquidación especial
     * @returns {void}
     */
    cambiarMunicipio: function () {
        var _this = $(this);
        gestionarliquidacionModelo.idBarrio = null;
        $('#txtIdBarrio, #txtBarrio').val('');
        if (_this.val() === '-1') {
            $('#txtBarrio').attr('disabled', true);
        } else {
            gestionarliquidacionModelo.municipioSeleccionado = _this.val();
            $('#txtBarrio').attr('disabled', false);
        }
    },
    /**
     * Llena el combo de tipos de uso a partir de un arreglo almacenado en el modelo
     * @returns {void}
     */
    llenarComboTipoUsoSeleccionado: function () {
        var cboTipoUsoSeleccionado = $('#fieldsetLiquidacionEspecial').find('#cboTipoUsoSeleccionado');
        cboTipoUsoSeleccionado.find('option').remove();
        cboTipoUsoSeleccionado.append($('<option>').text('Seleccione').val(-1));
        $.each(gestionarliquidacionModelo.tiposUso, function (index, tipouso) {
            cboTipoUsoSeleccionado.append($('<option>').text(tipouso.tipouso).val(tipouso.idtipouso));
        });

    },
    /**
     * Llena la tabla de conceptos a partir de un formato y un arreglo de conceptos 
     * definidos en el modelo.
     * @returns {void}
     */
    llenarTablaConceptos: function () {
        fillTable('tblConceptos', 'formatoConceptos', 'gestionarliquidacionModelo.conceptos', '');
        $('#tblConceptos').show();
    },
    /**
     * Llena la tabla de liquidaciones especiales a partir de un formato y un arreglo de liquidaciones especiales
     * definidas en el modelo.
     * @returns {void}
     */
    llenarTablaLiquidacionesEspeciales: function () {
        fillTable('tblLiquidacionesEspeciales', 'formatoLiquidacionesEspeciales', 'gestionarliquidacionModelo.liquidacionesEspeciales', '');
        $('#tblLiquidacionesEspeciales').show();
    },
    /**
     * Llena la tabla de municipios a partir de un formato y un arreglo de municipios 
     * definidos en el modelo.
     * @returns {void}
     */
    llenarTablaMunicipios: function () {
        var tablaMunicipos = fillTable('tblMunicipios', 'formatoMunicipios', 'gestionarliquidacionModelo.municipios', '');
        var municipiosEliminables = gestionarliquidacionModelo.municipiosEliminables;
        var municipios = gestionarliquidacionModelo.municipios;
        var indicesMunicipiosEliminables = [];
        for (var i = 0; i < municipiosEliminables.length; i++) {
            for (var j = 0; j < municipios.length; j++) {
                if (municipiosEliminables[i].idmunicipio === municipios[j].idmunicipio) {
                    indicesMunicipiosEliminables.push(j);
                }
            }
        }
        gestionarliquidacionModelo.indicesMunicipiosEliminables = indicesMunicipiosEliminables;
        tablaMunicipos.find('input[type = checkbox]').attr('disabled', 'disabled');
        $.each(indicesMunicipiosEliminables, function (index, item) {
            tablaMunicipos.find('tr[data-fila = ' + item + ']').find('input[type = checkbox]').removeAttr('disabled');
        });
        tablaMunicipos.show();
    },
    /**
     * Se llena los municipios para seleccionar
     * @returns {undefined}
     */
    llenarTablaMunicipiosParaSeleccionar: function () {
        fillTable('tblMunicipiosParaSeleccionar', 'formatoMunicipiosParaSelecionar', 'gestionarliquidacionModelo.municipiosParaSelecionar', '');
    },
    /**
     * Carga los municipios selecionado
     * @returns {undefined}
     */
    llenarlistaMunicipios: function (municipios) {
        var seleccionados = '';
        for (var i = 0; i < municipios.length; i++) {
            seleccionados += '<li>' + municipios[i].municipio + '</li>';
        }
        $('#ulMunicipios').html(seleccionados);
    },
    /**
     * Llena la tabla de tipos de uso a partir de un formato y un arreglo de tipos de uso 
     * definidos en el modelo.
     * @returns {void}
     */
    llenarTablaTiposUso: function () {
        fillTable('tblTiposUso', 'formatoTiposUso', 'gestionarliquidacionModelo.tiposUso', '');
        var tiposuso = gestionarliquidacionModelo.tiposUso;
        var tiposUsoEliminables = gestionarliquidacionModelo.tiposUsoEliminables;
        var indicesTiposusoEliminables = [];
        for (var i = 0; i < tiposuso.length; i++) {
            for (var j = 0; j < tiposUsoEliminables.length; j++) {
                if (tiposuso[i].idtipouso === tiposUsoEliminables[j].idtipouso) {
                    indicesTiposusoEliminables.push(i);
                }
            }
        }
        gestionarliquidacionModelo.indicesTiposusoEliminables = indicesTiposusoEliminables;
        $('table#tblTiposUso').find('input[type = checkbox]').prop('disabled', true);
        $.each(indicesTiposusoEliminables, function (index, item) {
            $('table#tblTiposUso').find('tr[data-fila = ' + item + ']').find('input[type = checkbox]').prop('disabled', false);
        });
        $('#tblTiposUso').show();
    },
    /**
     * Función de callback para llenar el combo de documentos a partir de la respuesta
     * obtenida del servidor.
     * @param  {Object} data Respuesta del servidor al consultar los documentos.
     * @returns {void}
     */
    onConsultarDocumentosCompleto: function (data) {
        var cboDocumento = $('#fieldsetLiquidacion').find('#cboDocumento');
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(__app.mensajes.sinResultados, __app.mensajes.atencion);
                break;
            case 1:
                var iddocumentoActualizar = gestionarliquidacionModelo.iddocumentoActualizar;
                cboDocumento.append($('<option>').text('Seleccione').val(-1));
                $.each(data.datos, function (index, documento) {
                    cboDocumento.append($('<option>').text(documento.documento).val(documento.iddocumento));
                });
                if (iddocumentoActualizar !== '') {
                    cboDocumento.val(iddocumentoActualizar);
                    that.consultarTiposDocumento();
                }
                if (cboDocumento.val() === null) {
                    cboDocumento.val(-1);
                }
                break;
        }
    },
    /**
     * Función de callback para mostrar toda la información de la liquidación obtenida
     * en la respuesta del servidor.
     * @param  {Object} data Respuesta del servidor al consultar una liquidación parametrizada.
     * @returns {void}
     */
    onConsultarLiquidacionParametrizadaCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(__app.mensajes.sinResultados, __app.mensajes.atencion);
                break;
            case 1:
                that.reiniciarProceso();

                var datosLiquidacion = data.datos[0];

                gestionarliquidacionModelo.accion = 'A';
                gestionarliquidacionModelo.idLiquidacion = datosLiquidacion.idliquidacion;
                gestionarliquidacionModelo.iddocumentoActualizar = datosLiquidacion.iddocumento;
                gestionarliquidacionModelo.idtipdocumentoActualizar = datosLiquidacion.idtipdocumento;

                var fielset = $('#fieldsetLiquidacion').show();

                //cargar fieldset liquidación
                fielset.find('#txtLiquidacion').val(datosLiquidacion.nombreliquidacion);
                fielset.find('#cboClasificacion').val(datosLiquidacion.clasificacion);
                fielset.find('input, select').not('input:button').prop('disabled', false);
                fielset.find('#txtInicioVigencia').val(datosLiquidacion.inivigencia);
                fielset.find('#txtFinVigencia').val(datosLiquidacion.finvigencia);
                fielset.find('#txtDiaVencimiento').val(datosLiquidacion.diavencimiento);
                fielset.find('#txtDiaSuspension').val(datosLiquidacion.diasuspension);
                fielset.find('input[type = radio][value = ' + datosLiquidacion.historico + ']').prop('checked', true);
                fielset.find('#cboTipoCuota').val(datosLiquidacion.tipocuota);
                fielset.find('#cboPermiteVenta').val(datosLiquidacion.controlventas);
                //cargar fieldset agregar conceptos
                if (!!data.datos.conceptos) {
                    if (data.datos.conceptos.length > 0) {
                        gestionarliquidacionModelo.conceptos = data.datos.conceptos;
                        that.llenarTablaConceptos();
                        $('#fieldsetOtrasVinculaciones').show();
                    }
                } else {
                    $('#fieldsetOtrasVinculaciones').hide();
                }
                $('#btnQuitarConceptos').show();
                $('#fieldsetAgregarConceptos').show();

                //cargar fieldset otras vinculaciones
                $('#ulMunicipios').empty();
                if (data.datos.municipios !== undefined && data.datos.municipios.length > 0) {
                    gestionarliquidacionModelo.municipios = data.datos.municipios;
                    gestionarliquidacionModelo.municipiosOriginales = data.datos.municipios;
                    that.llenarlistaMunicipios(data.datos.municipios);
                    that.llenarComboMunicipioSeleccionado();
                    $('#btnQuitarMunicipio').show();
                }
                if (data.datos.tiposusos !== undefined && data.datos.tiposusos.length > 0) {
                    gestionarliquidacionModelo.tiposUso = data.datos.tiposusos;
                    that.llenarTablaTiposUso();
                    that.llenarComboTipoUsoSeleccionado();
                    $('#btnQuitarTipoUso').show();
                }

                that.consultarDocumentos();
                //cargar fieldset liquidación especial
                if (data.datos.liquidacionespecial !== undefined && data.datos.liquidacionespecial.length > 0) {
                    gestionarliquidacionModelo.liquidacionesEspeciales = data.datos.liquidacionespecial;
                    that.llenarTablaLiquidacionesEspeciales();
                    $('#btnQuitarLiquidacionEspecial, #fieldsetLiquidacionEspecial').show();
                } else {
                    $('#btnQuitarLiquidacionEspecial, #fieldsetLiquidacionEspecial').hide();
                }

                break;
        }
    },
    /** Captura la respuesta del servidor cuando se consultan municipios que 
     * los municipios que puede eliminar el usuario
     * @para {object} data - Respuesta del servidor con municipios que se pueden eliminar
     * @returns {void}
     **/
    onConsultarMunicipiosPorUsuarioCompleto: function (data) {
        if (data.codigoRespuesta === 1) {
            gestionarliquidacionModelo.municipiosEliminables = data.datos;
        }
    },
    /**
     * Función de callback para establecer el valor del campo "código suscripción"
     * a partir de la respuesta obtenida del servidor
     * @param  {Object} data Respuesta del servidor al consultar las suscripciones.
     * @returns {void}
     */
    onConsultarSuscripcionesCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(__app.mensajes.sinResultados, __app.mensajes.atencion);
                break;
            case 1:
                gestionarliquidacionModelo.suscripcion = data.datos;
                if (data.datos.length > 1) {
                    that.dialogoActual.find('div.listaSeleccion').remove();
                    var divSuscripciones = $('<div>').addClass('listaSeleccion');
                    $.each(data.datos, function (index, suscripcion) {
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
                    var btn = $('<button>').text('Finalizar').addClass('btnSimple');
                    btn.on('click', function () {
                        var suscSeleccionada = that.dialogoActual.find('input[name="radio_suscripciones"]:checked');
                        if (suscSeleccionada.length > 0) {
                            var suscripcion = gestionarliquidacionModelo.suscripcion = data.datos[suscSeleccionada.attr('data-indice')];
                            $('#divBuscarSuscripcion input:text').val('');
                            that.dialogoActual.find('#spanMensaje').hide();
                            that.dialogoActual.dialog('close');
                            divSuscripciones.remove();
                            $('#fieldsetLiquidacionEspecial').find('#txtCodigoSuscripcion').val(suscripcion.idsuscripcion);
                            that.bloquearCamposLiquidacionEspecial();
                            gestionarliquidacionModelo.municipios = [];
                        } else {
                            that.dialogoActual.find('#spanMensaje').text(__app.mensajes.seleccionarOpcion).show();
                        }
                    });
                    divSuscripciones.insertAfter(that.dialogoActual.find('#spanMensaje'));
                    divSuscripciones.append(btn);
                } else {
                    var suscripcion = gestionarliquidacionModelo.suscripcion = data.datos[0];
                    that.dialogoActual.find('#spanMensaje').hide();
                    that.dialogoActual.dialog('close');
                    $('#fieldsetLiquidacionEspecial').find('#txtCodigoSuscripcion').val(suscripcion.idsuscripcion);
                    that.bloquearCamposLiquidacionEspecial();
                }
                break;
        }
    },
    /**
     * Limpia la información de la liquidación especial y son deshabilitados
     */
    bloquearCamposLiquidacionEspecial: function () {
        $('#divBuscarSuscripcion input:text').val('');
        var fieldset = $('#fieldsetLiquidacionEspecial');
        fieldset.find('select').val('-1').attr('disabled', true);
        fieldset.find('#txtBarrio').val('').attr('disabled', true);
    },
    /**
     * Función de callback para llenar el combo de tipos de documento a partir de la respuesta
     * obtenida del servidor.
     * @param  {Object} data Respuesta del servidor al consultar los tipos de documento.
     * @returns {void}
     */
    onConsultarTiposDocumentoCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(__app.mensajes.sinResultados, __app.mensajes.atencion);
                break;
            case 1:
                var idtipdocumentoActualizar = gestionarliquidacionModelo.idtipdocumentoActualizar;
                var cboTipoDocumento = $('#fieldsetLiquidacion #cboTipoDocumento');
                cboTipoDocumento.find('option').remove();
                __dom.llenarCombo(cboTipoDocumento, data.datos, 'idtipodocumento', 'tipodocumento');
                if (idtipdocumentoActualizar !== '') {
                    cboTipoDocumento.val(idtipdocumentoActualizar);
                }
                if (cboTipoDocumento.val() === null) {
                    cboTipoDocumento.val(-1);
                }
                break;
        }
    },
    /**
     * Función de callback para llenar el combo de tipos de uso a partir de la respuesta
     * obtenida del servidor.
     * @param  {Object} data Respuesta del servidor al consultar los tipos de uso.
     * @returns {void}
     */
    onConsultarTiposUsoCompleto: function (data) {
        if (data.codigoRespuesta === 1) {
            var cboTipoUso = $('#fieldsetOtrasVinculaciones').find('#cboTipoUso');
            __dom.llenarCombo(cboTipoUso, data.datos, 'idtipouso', 'tipouso');
            //se guarda el arreglo de tipos de uso en el modelo
            gestionarliquidacionModelo.tiposUsoEliminables = data.datos;

        }
    },
    /**
     * Función de callback para gestionar la validación de eliminar concepto.
     * Si el codigoRespuesta es 0 significa que se puede eliminar el concepto y
     * se procede a eliminarlo. Si la acción actual es 'A'(actualizar), se guardará
     * el concepto en otro arreglo con la acción 'E'(eliminar) para su posterior 
     * eliminación de la base de datos.
     * Si el codigoRespuesta es 1, no se podrá eliminar el concepto y se bloqueará
     * el check box correspondiente.
     * @param  {Object} data Respuesta del servidor al consultar la validación de
     * eliminar concepto.
     * @returns {void}
     */
    onConsultarValidacionEliminarConceptoCompleto: function (data) {
        var fila = gestionarliquidacionModelo.filaValidada;
        switch (data.codigoRespuesta) {
            case 0:
                var concepto = gestionarliquidacionModelo.conceptos[fila];
                concepto.accion = 'E';
                var conceptosEliminar = {
                    'accion': 'E',
                    'idconcepto': concepto.idconcepto,
                    'idregistroconcepto': concepto.idregistroconcepto
                };
                gestionarliquidacionModelo.conceptosEliminar.push(conceptosEliminar);
                gestionarliquidacionModelo.conceptos.splice(fila, 1);
                if (gestionarliquidacionModelo.conceptos.length === 0) {
                    $('#tblConceptos, #btnQuitarConceptos').hide();
                    return;
                }
                that.llenarTablaConceptos();
                break;
            case 1:
                var box = gestionarliquidacionModelo.boxValidado;
                $('table#tblConceptos').find('tr[data-fila = ' + box + ']').find('input[type = checkbox]').prop('disabled', true);
                if (data.tipo === 'opcional') {
                    __dom.lanzarAlerta('<strong> No se puede eliminar </strong>: El concepto se encuentra vinculado a una o más facturas',
                            __app.mensajes.atencion);
                } else {
                    var data = {codigoRespuesta: 0}
                    __dom.lanzarAlerta('El concepto se encuentra vinculado a una suscripción, <br> ¿Desea eliminarlo?',
                            __app.mensajes.atencion, function () {
                                onConsultarValidacionEliminarConceptoCompleto({codigoRespuesta: 0});
                            }, true);
                }

                break;
        }
    },
    /**
     * Función de callback para gestionar la validación de eliminar municipio.
     * Si el codigoRespuesta es 0 significa que se puede eliminar el municipio y
     * se procede a eliminarlo. Si la acción actual es 'A'(actualizar), se guardará
     * el municipio en otro arreglo con la acción 'E'(eliminar) para su posterior 
     * eliminación de la base de datos.
     * Si el codigoRespuesta es 1, no se podrá eliminar el municipio y se bloqueará
     * el check box correspondiente.
     * @param  {Object} data Respuesta del servidor al consultar la validación de
     * eliminar municipio.
     * @returns {void}
     */
    onConsultarValidacionEliminarMunicipioCompleto: function (data) {
        var municipios = gestionarliquidacionModelo.municipios;
        var fila = gestionarliquidacionModelo.filaValidada;
        switch (data.codigoRespuesta) {
            case 0:
                var municipio = municipios[fila];
                municipio.accion = 'E';
                var municipioEliminar = {
                    'accion': 'E',
                    'idmunicipio': municipio.idmunicipio,
                    'idregistromunicipio': municipio.idregistromunicipio
                };
                gestionarliquidacionModelo.municipiosEliminar.push(municipioEliminar);
                gestionarliquidacionModelo.municipios.splice(fila, 1);
                if (municipios.length === 0) {
                    $('#tblMunicipios').hide();
                    $('#fieldsetOtrasVinculaciones').find('#btnQuitarMunicipio').hide();
                    return;
                }
                that.llenarComboMunicipioSeleccionado();
                that.llenarTablaMunicipios();
                break;
            case 1:
                gestionarliquidacionModelo.conceptosNoEliminar.push(municipios[fila]);
                municipios[fila].accion = 'NE';
                $('table#tblMunicipios').find('tr[data-fila = ' + fila + ']').find('input[type = checkbox]').prop('disabled', true);
                __dom.lanzarAlerta('<strong> No se puede eliminar </strong>: El(los) municipio(s) se encuentra(n) vinculado(s) a una o más facturas',
                        __app.mensajes.atencion);
                break;
        }
    },
    /**
     * Función de callback para gestionar la validación de eliminar tipo de uso.
     * Si el codigoRespuesta es 0 significa que se puede eliminar el tipo de uso y
     * se procede a eliminarlo. Si la acción actual es 'A'(actualizar), se guardará
     * el tipo de uso en otro arreglo con la acción 'E'(eliminar) para su posterior 
     * eliminación de la base de datos.
     * Si el codigoRespuesta es 1, no se podrá eliminar el tipo de uso y se bloqueará
     * el check box correspondiente.
     * @param  {Object} data Respuesta del servidor al consultar la validación de
     * eliminar tipo de uso.
     * @returns {void}
     */
    onConsultarValidacionEliminarTipoUsoCompleto: function (data) {
        var tiposUso = gestionarliquidacionModelo.tiposUso;
        var fila = gestionarliquidacionModelo.filaValidada;
        switch (data.codigoRespuesta) {
            case 0:
                var tipoUso = tiposUso[fila];
                tipoUso.accion = 'E';
                var tipoUsoEliminar = {
                    'accion': 'E',
                    'idtipouso': tipoUso.idtipouso,
                    'idregistrotipouso': tipoUso.idregistrotipouso
                };
                gestionarliquidacionModelo.tiposUsoEliminar.push(tipoUsoEliminar);
                gestionarliquidacionModelo.tiposUso.splice(fila, 1);
                if (tiposUso.length === 0) {
                    $('#tblTiposUso').hide();
                    $('#fieldsetOtrasVinculaciones').find('#btnQuitarTipoUso').hide();
                    return;
                }
                that.llenarComboTipoUsoSeleccionado();
                that.llenarTablaTiposUso();
                break;
            case 1:
                gestionarliquidacionModelo.conceptosNoEliminar.push(tiposUso[fila]);
                tiposUso[fila].accion = 'NE';
                $('table#tblTiposUso').find('tr[data-fila = ' + fila + ']').find('input[type = checkbox]').prop('disabled', true);
                __dom.lanzarAlerta('<strong> No se puede eliminar</strong>: El(los) tipo uso(s) se encuentra(n) vinculado a una o más facturas',
                        __app.mensajes.atencion);
                break;
        }
    },
    /**
     * Función de callback para notificar que la operación ha sido grabada exitosamente
     * y reiniciar el proceso.
     * @param  {Object} data Respuesta del servidor al grabar la operación.
     * @returns {void}
     */
    onGrabarOperacionCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 1:

                __dom.lanzarAlerta(data.mensaje, __app.mensajes.tituloExito, function () {
                    location.reload();
                });
                break;
        }
    },
    /**
     * Identifica los conceptos seleccionados en la tabla de conceptos y los quita
     * del modelo y de la tabla.
     * @returns {void}
     */
    quitarConceptos: function () {
        var conceptos = gestionarliquidacionModelo.conceptos;
        var boxes = $('#fieldsetAgregarConceptos').find('input.tblCheck[type="checkbox"]:checked');
        for (var i = boxes.length - 1; i >= 0; i--) {
            var box = boxes[i];
            var fila = $(box).parents('tr').attr('data-fila');
            var concepto = conceptos[fila];
            gestionarliquidacionModelo.filaValidada = fila;
            if (gestionarliquidacionModelo.accion === 'A') {
                that.consultarValidacionEliminarConcepto(concepto.idconcepto);
            } else {
                conceptos.splice(fila, 1);
            }
        }
        if (conceptos.length === 0) {
            $('#tblConceptos, #btnQuitarConceptos').hide();
            return;
        }
        that.llenarTablaConceptos();
    },
    /**
     * Identifica las liquidaciones especiales seleccionadas en la tabla de liquidaciones especiales y las quita
     * del modelo y de la tabla.
     * @returns {void}
     */
    quitarLiquidacionesEspeciales: function () {
        var boxes = $('#fieldsetLiquidacionEspecial').find('table#tblLiquidacionesEspeciales input.tblCheck[type = checkbox]:checked');
        for (var i = boxes.length - 1; i >= 0; i--) {
            var box = boxes[i];
            var fila = $(box).parents('tr').attr('data-fila');
            var idRegistroLiquidacion = gestionarliquidacionModelo.liquidacionesEspeciales[fila].idregistroliquidacionespecial;
            if (idRegistroLiquidacion) {
                gestionarliquidacionModelo.liquidacionesEspecialesEliminar.push({
                    idregistroliquidacionespecial: idRegistroLiquidacion,
                    accion: 'E'
                });
            }

            gestionarliquidacionModelo.liquidacionesEspeciales.splice(fila, 1);
        }
        if (gestionarliquidacionModelo.liquidacionesEspeciales.length === 0) {
            $('#tblLiquidacionesEspeciales ').hide();
            $('#fieldsetLiquidacionEspecial').find('#btnQuitarLiquidacionEspecial').hide();
            return;
        }
        that.llenarTablaLiquidacionesEspeciales();
    },
    /**
     * Identifica los municipios seleccionados en la tabla de municipios y los quita
     * del modelo y de la tabla.
     * @returns {void}
     */
    quitarMunicipios: function () {
        var municipios = gestionarliquidacionModelo.municipios;
        var boxes = $('#fieldsetOtrasVinculaciones').find('table#tblMunicipios input.tblCheck[type = checkbox]:checked');
        for (var i = boxes.length - 1; i >= 0; i--) {
            var box = boxes[i];
            var fila = $(box).parents('tr').attr('data-fila');
            var municipio = municipios[fila];
            gestionarliquidacionModelo.filaValidada = fila;
            if (gestionarliquidacionModelo.accion === 'A') {
                that.consultarValidacionEliminarMunicipio(municipio.idmunicipio);
            } else {
                gestionarliquidacionModelo.municipios.splice(fila, 1);
                if (municipios.length === 0) {
                    $('#tblMunicipios').hide();
                    $('#fieldsetOtrasVinculaciones').find('#btnQuitarMunicipio').hide();
                    return;
                }
            }
        }
        if (municipios.length === 0) {
            $('#tblMunicipios').hide();
            $('#fieldsetOtrasVinculaciones').find('#btnQuitarMunicipio').hide();
            return;
        }
        that.llenarComboMunicipioSeleccionado();
        that.llenarTablaMunicipios();
    },
    /**
     * Identifica los tipos de uso seleccionados en la tabla de tipos de uso y los quita
     * del modelo y de la tabla.
     * @returns {void}
     */
    quitarTiposUso: function () {
        var tiposUso = gestionarliquidacionModelo.tiposUso;
        var boxes = $('#fieldsetOtrasVinculaciones').find('table#tblTiposUso input.tblCheck[type = checkbox]:checked');
        for (var i = boxes.length - 1; i >= 0; i--) {
            var box = boxes[i];
            var fila = $(box).parents('tr').attr('data-fila');
            var tipoUso = tiposUso[fila];
            gestionarliquidacionModelo.filaValidada = fila;
            if (gestionarliquidacionModelo.accion === 'A') {
                that.consultarValidacionEliminarTipoUso(tipoUso.idtipouso);
            } else {
                gestionarliquidacionModelo.tiposUso.splice(fila, 1);
                if (tiposUso.length === 0) {
                    $('#tblTiposUso, #btnQuitarTipoUso').hide();
                    return;
                }
            }
        }
        if (tiposUso.length === 0) {
            $('#tblTiposUso, #btnQuitarTipoUso').hide();
            return;
        }
        that.llenarComboTipoUsoSeleccionado();
        that.llenarTablaTiposUso();
    },
    /**
     * Carga los municipios selecionado
     * @returns {undefined}
     */
    selecionarMunicipios: function () {
        var filas = $('#divDialogoMunicipios tbody tr.selected');
        var agregados = [];
        var seleccionados = '';
        if (filas.length != 0) {
            for (var i = 0; i < filas.length; i++) {
                var fila = $(filas[i]);
                var idmunicipio = fila.find('td input').val();
                var nombreMunicipio = fila.find('td[header="thMunicipio"]').text().trim();
                var objeto = {
                    'idmunicipio': idmunicipio,
                    'municipio': nombreMunicipio,
                    'accion': 'I'
                };
                agregados.push(objeto);
                seleccionados += '<li>' + nombreMunicipio + '</li>';
            }
            gestionarliquidacionModelo.municipios = agregados;
            that.llenarComboMunicipioSeleccionado();
            $('#ulMunicipios').html(seleccionados);
            $('#divDialogoMunicipios').dialog('close');
            return;
        }
        __dom.lanzarAlerta("Debe seleccionar almenos un municipio", __app.mensajes.atencion);
    },
    /**
     * Borra el contenido de las variables temporales del modelo, limpia y establece 
     * todos los campos y tablas a su estado inicial.
     * @returns {void}
     */
    reiniciarProceso: function () {
        //inicializar variables del modelo
        var tiposuso = gestionarliquidacionModelo.tiposUsoEliminables;
        var municipios = gestionarliquidacionModelo.municipiosEliminables;
        gestionarliquidacionModelo = {
            accion: '',
            conceptos: [],
            municipios: [],
            tiposUso: [],
            tiposUsoEliminar: [],
            conceptosEliminar: [],
            municipiosEliminar: [],
            tiposUsoNoEliminar: [],
            conceptosNoEliminar: [],
            municipiosNoEliminar: [],
            municipiosOriginales: [],
            iddocumentoActualizar: '',
            liquidacionesEspeciales: [],
            idtipdocumentoActualizar: '',
            liquidacionesEspecialesEliminar: [],
            municipiosEliminables: municipios,
            tiposUsoEliminables: tiposuso
        };
        if (municipios === null || tiposuso === null) {
            if (municipios === null && tiposuso === null) {
                var mensaje = "municipios ni tipos de uso";
            } else {
                var mensaje = (municipios === null) ? "municipios" : "tipos de uso";
            }
            __dom.lanzarAlerta("El usuario no tiene asignado " + mensaje + " para parametrizar una liquidación", __app.mensajes.atencion);
        }
        //ocultar fieldsets y botones
        var ocultos = $('#fieldsetAgregarConceptos,#fieldsetOtrasVinculaciones, #fieldsetLiquidacionEspecial, #btnAgregarConceptos, #btnQuitarConceptos, #btnQuitarMunicipio, #btnQuitarTipoUso, #btnQuitarLiquidacionEspecial');
        var camposLiquidacion = $('#fieldsetLiquidacion').find('input, select').not('input[type = button]');
        ocultos.hide();
        camposLiquidacion.prop('disabled', true);

        //poner radios en Si 
        $('input#rbtnGuardarHistoricoSi').prop('checked', true);
        $('input#rbtnImprimirReciboSi').prop('checked', true);

        //reiniciar valores de campos
        $('fieldset').find('input[type = text]').val('');
        $('fieldset').find('select').val(-1);

        $('#txNombreLiquidacion').removeAttr('data-id');
        //limpiar combos dependientes de otros parámetros
        $('#fieldsetLiquidacion').find('#cboDocumento, #cboTipoDocumento').empty();
        $('#fieldsetOtrasVinculaciones').find('#cboTipoUso').val('-1');
        //limpiar tablas
        $('#tblLiquidacionesEspeciales,#tblConceptos,#tblMunicipios,#tblTiposUso').empty();
    },
    /**
     * Función de callback que consulta los barrios y llama a la función que 
     * muestra el resultado en el autocomplete "Barrio".
     * @param  {Object} data Respuesta del servidor al consultar los barrios.
     * @returns {void}
     */
    sourceAutoCompleteBarrio: function (request, response) {
        that.request = request;
        that.response = response;
        var data = {};
        data.municipios = gestionarliquidacionModelo.municipioSeleccionado;
        if (request.term.trim() !== '') {
            data.barrio = request.term;
            gestionarliquidacionControl.consultarBarrios(data, that.mostrarResultadoBarrio);
        }
    },
    /**
     * Función de callback que consulta los conceptos y llama a la función que 
     * muestra el resultado en el autocomplete "Concepto".
     * @param  {Object} data Respuesta del servidor al consultar los conceptos.
     * @returns {void}
     */
    sourceAutoCompleteConcepto: function (request, response) {
        that.request = request;
        that.response = response;
        var data = {};
        data.idliquidacion = gestionarliquidacionModelo.idLiquidacion;
        if (request.term.trim() !== '') {
            data.concepto = request.term;
            gestionarliquidacionControl.consultarConceptos(data, that.mostrarResultadoConcepto);
        }
    },
    /**
     * Función de callback que consulta las liquidaciones no parametrizadas y llama
     * a la función que muestra el resultado en el autocomplete "Liquidación".
     * @param  {Object} data Respuesta del servidor al consultar las liquidaciones
     * no parametrizadas.
     * @returns {void}
     */
    sourceAutoCompleteLiquidacion: function (request, response) {
        that.request = request;
        that.response = response;
        var data = {};
        if (request.term.trim() !== '') {
            data.liquidacion = request.term;
            gestionarliquidacionControl.consultarLiquidaciones(data, that.mostrarResultadoLiquidacion);
        }
    },
    /**
     * Función de callback que consulta las liquidaciones parametrizadas y llama
     * a la función que muestra el resultado en el autocomplete "Nombre Liquidación".
     * @param  {Object} data Respuesta del servidor al consultar las liquidaciones
     * parametrizadas
     * @returns {void}
     */
    sourceAutoCompleteLiquidacionParametrizada: function (request, response) {
        that.request = request;
        that.response = response;
        var data = {};
        if (request.term.trim() !== '') {
            data.liquidacion = request.term;
            gestionarliquidacionControl.consultarLiquidacionesParametrizadasAutocomplete(data, that.mostrarResultadoLiquidacionParametrizada);
        }
    },
    /**
     * Valida si el autocomplete "Concepto" está vacío para borrar el id del
     * concepto consultado anteriormente
     * @returns {void}
     */
    validarCampoConcepto: function () {
        if ($(this).val().trim() === '') {
            gestionarliquidacionModelo.idConcepto = null;
        }
    },
    /**
     * Valida que se haya diligenciado la fecha de inicio antes de diligenciar 
     * la fecha de fin de vigencia. También valida que la fecha de fin de vigencia
     * no sea anterior a la fecha de inicio de vigencia.
     * @returns {void}
     */
    validarCampoFinVigencia: function () {
        var inicioVigencia = $('#fieldsetLiquidacion #txtInicioVigencia').val().trim();
        var finVigencia = $(this).val().trim();
        if (inicioVigencia === '') {
            __dom.lanzarAlerta('Debe elegir primero la fecha de inicio de vigencia', __app.mensajes.atencion);
            $(this).val('');
            return;
        }
        if (finVigencia < inicioVigencia) {
            __dom.lanzarAlerta('La fecha de fin de vigencia no puede ser anterior a la fecha de inicio de vigencia', __app.mensajes.atencion);
            $(this).val('');
        }
    },
    /**
     * Valida que la fecha de inicio no sea anterior a la fecha actual
     * @returns {void}
     */
    validarCampoInicioVigencia: function () {
        // var date = new Date().dateFormat('Y/m/d'); -- se reemplaza fecha del cliente por fecha del servidor
        var date = __app.obtenerFechaSistema().dateFormat('Y/m/d');
        
        var inicioVigencia = $(this).val().trim();
        var finVigencia = $('#fieldsetLiquidacion #txtFinVigencia');

        finVigencia.datepicker('option', 'minDate', new Date(inicioVigencia)).val('');
        if (inicioVigencia < date) {
            __dom.lanzarAlerta('La fecha de inicio de vigencia no puede ser anterior a ' + date, __app.mensajes.atencion);
            $(this).val('');
        }
    },
    /**
     * Valida si el autocomplete "Liquidación" está vacío para borrar el id de la
     * liquidación consultada anteriormente
     * @returns {void}
     */
    validarCampoLiquidacion: function () {
        if ($(this).val().trim() === '') {
            gestionarliquidacionModelo.idLiquidacion = null;
        }
    },
    /**
     * Valida si el autocomplete "Municipio" está vacío para borrar el id del 
     * municipio consultado anteriormente
     * @returns {void}
     */
    validarCampoMunicipio: function () {
        if ($(this).val().trim() === '') {
            gestionarliquidacionModelo.idMunicipio = null;
        }
    }
};
gestionarliquidacionVista.init();
