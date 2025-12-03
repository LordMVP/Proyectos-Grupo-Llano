// Autor : Leonardo Malaver Rubio
// Fecha : 2014-12-01
var that = null;
/** Inicializa comportamiento de Botones de comandos 
 * @returns {void}
 */
var constructorasVista = {
    dialogoActual: null,
    init: function () {
        that = this;
        __app.vistaActual = constructorasVista;
        __app.controlActual = constructorasControl;
        var comandosfiltro = $('div#camposBuscarContratosConstructoras');
        var comandosInfContraactual = $('div#divInformacionContraActual');
        var comandos = $('div#divComandos');
        var objtabs = $('div#tabs').tabs();
        $('#btnAdicionarContacto').on('click', that.adicionarContacto);
        comandosInfContraactual.find('#btnInformacionGeneral').on('click', that.cargaInformacionGeneral);
        comandos.find('#btnNuevo').on('click', that.nuevoConstructora);
        comandos.find('#btnFiltrar').on('click', that.filtrarConstructora);
        comandos.find('#btnGrabar').on('click', that.grabarConstructora);
        comandos.find('#btnModificar').on('click', that.modificarConstructora);
        $('#btnVerSuscripciones').on('click', that.verSuscripciones);

        $("#txtArchivo").fileinput({
            uploadUrl: "subir_archivo/",
            allowedFileExtensions: ['pdf','dwg','xlsx','xls'],
            uploadAsync: true,
            showUpload: true,
            showRemove: true,
            maxFileSize: 5120}).on('fileuploaded', that.subirCompleto);

        __dom.configurarCalendario('txtFiltroVigenciaInicio');
        __dom.configurarCalendario('txtFiltroVigenciaFin');
        __dom.configurarCalendario('txtFechaActaIncio');
        __dom.configurarCalendario('txtFechaActaFin');
        __dom.configurarCalendario('txtVigenciaDesde');
        __dom.configurarCalendario('txtVigenciaHasta');
        __dom.configurarCalendario('txtVigenteDesde');
        __dom.configurarCalendario('txtVigenteHasta');

        __dom.configurarCalendario('txtFecFacturaAnticipo');
        __dom.configurarCalendario('txtFecFacturaPagoParcial1');
        __dom.configurarCalendario('txtFecFacturaPagoParcial2');
        __dom.configurarCalendario('txtFecFacturaPagoParcial3');
        __dom.configurarCalendario('txtFecFacturaPagoFinal');

        __dom.configurarCalendario('txtLicenciaVigenciaDesde');
        __dom.configurarCalendario('txtLicenciaVigenciaHasta');

        $('#btnAdicionarPoliza').on('click', that.adicionarPoliza);
        $('div#tabUnidadesConstructivas input#btnAdicionarUnidadConstrutiva').on('click', that.adicionarUnidadConstrutiva);
        $('div#tabSuscripciones input#btnVincularSuscriptor').on('click', that.vincularSuscriptor);
        $('div#tabServiciosContratados input#btnAdicionarServicioContratados').on('click', that.AdicionarServicioContratados);
        $('div#tabSuscripcionesVincularSuscriptor input#btnVincularSuscriptor').on('click', that.VincularSuscriptor);
        $('div#divInformacionContraActual input#txtvalorAntesIva').on('change', that.CalculaValorSaldoNegocio);
        $('div#divInformacionContraActual input#txtvalorIva').on('change', that.CalculaValorSaldoNegocio);
        $('div#divInformacionContraActual input#txtvalorAnticipo').on('change', that.CalculaValorSaldoNegocio);
        $('#btnBuscar').on('click', that.filtrarConstructoraResultados);
        /**
         * Mascaras a Campos Numericos 
         * 900815 - 1121867629
         * codigo : 0140301305001
         */
        /*that.formatoMoneda('txtvalorAntesIva');
        that.formatoMoneda('txtvalorIva');
        that.formatoMoneda('txtvalorProyecto');
        that.formatoMoneda('txtvalorAnticipo');
        that.formatoMoneda('txtsaldoNegocio');
        that.formatoMoneda('txtvalorPagoParcial');
        that.formatoMoneda('txtvalorPagoFinal');
        that.formatoMoneda('txtaseguradoraValor');*/

        that.formatoMoneda('txtvalorAntesIva');
        that.formatoMoneda('txtvalorIva');
        that.formatoMoneda('txtvalorProyecto');
        
        that.formatoMoneda('txtVlrPagoAnticipo');
        that.formatoMoneda('txtVlrPagoPagoParcial1');
        that.formatoMoneda('txtVlrPagoPagoParcial2');
        that.formatoMoneda('txtVlrPagoPagoParcial3');
        
        that.formatoMoneda('txtVlrPagoFinal');
        that.formatoMoneda('txtVlrPagoTotal');
        
        
        that.formatoMoneda('txtaseguradoraValor');
        
        that.configurarAutoCompleteTercero();
        that.configurarAutoComplete();
        that.cargarTablaSuscripciones();
        that.configurarAutoCompleteAseguradora();
        that.cargarTablaServiciosContratados();
        that.cargarTablaAmortizacion();
        that.configurarAutoCompleteLiquidaciones();
        that.consultarMetodoConstrutivo();
        that.validarPermisosGrabar();
        //that.consultarProyectosPadre();


        __dom.configurarAutocomplete(
                $('div#divInformacionContraActual input#textMunicipio'),
                that.sourceAutoCompleteMuncipio,
                function (event, ui) {
                    $('div#divInformacionContraActual input#textMunicipio').val(ui.item ? ui.item.value : '');
                    constructorasModel.municipioseleccionado = ui.item.idVal;
                },
                function () {
                    constructorasModel.municipioseleccionado = undefined;
                }
        );

        __dom.configurarAutocomplete(
                $('div#divInformacionContraActual input#textBarrio'),
                that.sourceAutoCompleteBarrio,
                function (event, ui) {
                    $('div#divInformacionContraActual input#textBarrio').val(ui.item ? ui.item.value : '');
                    constructorasModel.barrioseleccionado = ui.item.idVal;
                },
                function () {
                    constructorasModel.barrioseleccionado = undefined;
                }
        );

        __dom.configurarAutocomplete(
                $('div#divConstructora input#txtNombreConstructora'),
                that.sourceAutoCompleteTercero,
                function (event, ui) {
                    $('div#divConstructora input#txtNombreConstructora').val(ui.item ? ui.item.value : '');
                    $('div#divConstructora input#txtNit').val(ui.item.documento);
                    constructorasModel.constructoraseleccionada = ui.item.idVal;
                    that.cargarCboSuscriptor();
                },
                function () {
                    $('div#divConstructora input#txtNit').val('');
                    constructorasModel.constructoraseleccionada = undefined;
                }
        );
        //$('#txtporcentajeAnticipo, #txtporcentajePagoParcial, #txtporcentajePagoFinal').on('blur', that.ActualizarDetallePago);
        $('#txtPorcentajePagoAnticipo, #txtPorcentajePagoPagoParcial1, #txtPorcentajePagoPagoParcial2, \n\
            #txtPorcentajePagoPagoParcial3, #txtPorcentajePagoPagoFinal').on('blur', that.ActualizarDetallePago);

        $('#txtPorcentajeAvanceAnticipo, #txtPorcentajeAvancePagoParcial1, \n\
            #txtPorcentajeAvancePagoParcial2, #txtPorcentajeAvancePagoParcial3, \n\
            #txtPorcentajeAvancePagoFinal').on('blur', that.ActualizarAvanceGeneral);
        
        //constructorasControl.consultarProyectos(that.motrarResultadoProyectos);
    },
    /** Calcula campos de Valor del Proyecto y Saldo Final en la Sección de Información Contraactual    
     ** @returns {void}
     */
    CalculaValorSaldoNegocio: function () {

        var valorAntesIva = that.depurarCamposNumericos('txtvalorAntesIva');
        var valorIva = that.depurarCamposNumericos('txtvalorIva');
        var valorProyecto = parseFloat(parseFloat(valorAntesIva) + parseFloat(valorIva));
        $('div#divInformacionContraActual input#txtvalorProyecto').val(valorProyecto);
        var valorAnticipo = that.depurarCamposNumericos('txtvalorAnticipo');
        var valorAnticipo = that.depurarCamposNumericos('txtvalorAnticipo');

        var valorsaldo = parseFloat(parseFloat(valorProyecto) - parseFloat(valorAnticipo));
        $('div#divInformacionContraActual input#txtsaldoNegocio').val(valorsaldo);
    },
    /** Activa Formulario para registro de Nuevo Contrato, inicialiando valores del Modelo y capas de diseño  
     ** @returns {void}
     */
    nuevoConstructora: function () {
        that.inicializaModeloJs();
        __dom.inicializarValorSelectores('div#divConstructora input[type=text]');
        var divContactos = $('div#divInformacionContactos');
        divContactos.hide();
        $('div#ArchivosAdjuntos').show();
        __dom.controlActivacionSelectores($('div#divConstructora input#txtNombreConstructora'), 'A');
        __dom.controlActivacionSelectores($('div#divConstructora select#cmbClasifiLiq'), 'A');
        __dom.controlActivacionSelectores($('div#divConstructora select#cmbProyectoSeven'), 'A');
        
        var divdivInformacionGeneral = ($("div#divInformacionGeneral"));
        var divInformacionContraactual = ($('div#divInformacionContraActual'));
        var divtabSuscripcionesSuscriptorVinculado = ($("div#tabSuscripcionesSuscriptorVinculado"));
        var divtabSuscripcionesVincularSuscriptor = ($("div#tabSuscripcionesVincularSuscriptor"));
        var divtabSuscripcionesTablaSuscripciones = ($("div#tabSuscripcionesTablaSuscripciones"));
        __dom.inicializarValorSelectores(divInformacionContraactual.find('input[type=text],input[type=number],textarea'));
        divInformacionContraactual.find('input[type=number]').val("0");
        divtabSuscripcionesSuscriptorVinculado.find('select').val('-1');
        __dom.inicializarValorSelectores(divtabSuscripcionesSuscriptorVinculado.find('input[type=text],select,textarea'));
        divtabSuscripcionesSuscriptorVinculado.hide();
        divtabSuscripcionesTablaSuscripciones.hide();
        divtabSuscripcionesVincularSuscriptor.hide();
        divdivInformacionGeneral.hide();
        constructorasModel.suscripciones = [];
        that.cargarTablaSuscripciones();
        $('div#divConstructora input#txtNombreConstructora').focus();
        var Constructora = $('div#divConstructora');
        __dom.controlActivacionSelectores($('div#divInformacionContraActual input[type=text],input[type=number], textarea ,select'), 'A');
        
        $('#txtvalorProyecto').attr('disabled', 'disabled');        
        
        $('#txtVlrPagoAnticipo').attr('disabled', 'disabled');
        $('#txtVlrPagoPagoParcial1').attr('disabled', 'disabled');
        $('#txtVlrPagoPagoParcial2').attr('disabled', 'disabled');
        $('#txtVlrPagoPagoParcial3').attr('disabled', 'disabled');
        $('#txtVlrPagoFinal').attr('disabled', 'disabled');
        
        $('#txtPorcentajePagoTotal').attr('disabled', 'disabled');
        $('#txtPorcentajeAvanceTotal').attr('disabled', 'disabled');
        $('#txtVlrPagoTotal').attr('disabled', 'disabled');
        
        /*$('#txtsaldoNegocio').attr('disabled', 'disabled')
        $('#txtvalorProyecto').attr('disabled', 'disabled')
        $('#txtvalorAnticipo').attr('disabled', 'disabled')
        $('#txtvalorPagoParcial').attr('disabled', 'disabled')
        $('#txtvalorPagoFinal').attr('disabled', 'disabled')*/


    },
    /** Consulta en el Modelo Suscriptores vinculados al tercero seleccionado  en la informació Contraactual (Constructoras )
     ** @returns {void}
     */
    cargarCboSuscriptor: function () {
        var Datos = {};
        Datos.idTercero = constructorasModel.constructoraseleccionada;
        constructorasControl.consultarTercerosSuscriptor(Datos, that.cargarCboSuscriptorOpciones);
        constructorasControl.consultarProyectosPadre(Datos, that.mostrarResultadoProyectosPadre);
    },
    /** Carga en Combo el resultado de la peticion al Modelo de Los suscriptores vinculados en la Funcion cargarCboSuscriptor
     ** @returns {void}
     */
    cargarCboSuscriptorOpciones: function (Data) {
        var cboSuscriptor = $('#cboSuscriptor');
        if (Data.terceros.length == 0)
        {
            __dom.lanzarAlerta("El tercero seleccionado no tiene  ningún suscriptor asociado", "Error");
            return false;
        }
        cboSuscriptor.html('');
        var OpcionesHtml = '';
        $.each(Data.terceros, function (j, obj) {
            OpcionesHtml += "<option value=" + obj.susIderegistro + ">" + obj.susconvNombre + ' ' + obj.susDescripcion + "</option>";
        });
        cboSuscriptor.html(OpcionesHtml);
        var divtabSuscripcionesVincularSuscriptor = $("div#tabSuscripcionesVincularSuscriptor");
        divtabSuscripcionesVincularSuscriptor.show();
        __dom.ocultarCargador();
    },
    /** Carga Valores por defecto en el Modelo de la Información que se ingresa en la seccion de Información Contraactual 
     * y la Seccion de Filtro de los Datos 
     ** @returns {void}
     */
    inicializaModeloJs: function () {
        constructorasModel.constructoraseleccionada = null;
        constructorasModel.terceroseleccionado = null;
        constructorasModel.contactos = [];
        constructorasModel.contactoseliminar = [];
        constructorasModel.contratos = [];
        constructorasModel.barrioseleccionado = null;
        constructorasModel.municipioseleccionado = null;
        constructorasModel.contratoideregistro = null;
        constructorasModel.estadoContrato = null;
        constructorasModel.estadoContrato = null;
        constructorasModel.polizas = [];
        constructorasModel.polizaseliminar = [];
        constructorasModel.servicioscontratados = [];
        constructorasModel.servicioscontratadosEliminar = [];
        constructorasModel.servicios = [];
        constructorasModel.suscripcionesEliminar = [];
        constructorasModel.suscripcionesrelacionadas = [];
        constructorasModel.contactoseliminar = [];
        constructorasModel.suscriptor = null;


        $('#legidcontrato').text('Información Contractual');
        $('#pMensajeInfocontraactual').text('');



        that.cargarTablaPolizas();
        that.cargarTablaServiciosContratados();
        /*
         * Incializa y ocula Seccion Arcivos Adjuntos 
         */
        $('#divArchivos').html('');

    },
    inicializaConstructora: function () {
        __dom.inicializarValorSelectores('div#divConstructora input[type=text]');
        that.inicializaModeloJs();
        $('div#divInformacionGeneral').hide();
        var divInformaciónContraActual = $('div#divInformacionContraActual');
        var divFiltro = $('#camposBuscarContratosConstructoras');
        var divAdicionarContactos = $('div#divAdicionarContactos');
        var divContactos = $('div#divInformacionContactos');
        divContactos.hide();
        __dom.inicializarValorSelectores(divFiltro.find('input[type=text], select, textarea'));
        __dom.inicializarValorSelectores(divAdicionarContactos.find('input[type=text], select, textarea'));
        __dom.inicializarValorSelectores($('#camposBuscarContratosConstructoras input[type=text]'));
        __dom.inicializarValorSelectores(divInformaciónContraActual.find('input[type=text],input[type=number], select, textarea'));
        __dom.controlActivacionSelectores(divInformaciónContraActual.find('input[type=text],input[type=number], select, textarea'), 'I');
        __dom.controlActivacionSelectores($('div#divConstructora input'), 'I');
        __dom.controlActivacionSelectores($('div#divConstructora select'), 'I');
        $('div#ArchivosAdjuntos').hide();

    },
    /** Mostrar Seccion de Campos para filtrar Información de los Contratos Con las Constructoras  
     * y la Seccion de Filtro de los Datos 
     ** @returns {void}
     */
    filtrarConstructora: function () {
        that.inicializaConstructora();
        var pmensaje = $('p#pMensaje').text('');
        var divFiltro = $('#camposBuscarContratosConstructoras');
        var divRsultados = $('#divResultadosFiltro').hide();
        that.dialogoActual = divFiltro.dialogo({
            modal: true,
            width: 850,
            title: 'Buscar Contratos Constructoras',
            buttons: {
                Finalizar: that.CargarConstructorasResultados
            }
        });
    },
    /** Valida que se haya ingresado al menos un parametro de busqueda en la secccion de filtrado de dateos  
     * y genera la peticion al Controlador 
     *  envia @Parametros ingresados 
     ** @returns {void}
     */
    filtrarConstructoraResultados: function () {
        var divRsultados = $('#divResultadosFiltro').hide();
        var pmensaje = $('p#pMensaje').text('');
        var continuar = false;
        var divFiltro = $('#camposBuscarContratosConstructoras');
        var campos = divFiltro.find('input[type=text],textarea,select');
        constructorasModel.archivos = [];
        $.each(campos, function (i, item) {
            if ($(item).val() != '' && $(item).val() != '-1') {
                continuar = true;
            }
            if ($(item).attr('id') === 'txtFiltroTercero' && $(item).val() === '')
            {
                constructorasModel.terceroseleccionado = null;
            }
        });
        if (continuar) {
            var datos = {};
            datos.idContrato = divFiltro.find('#txtFiltroContrato').val();
            datos.idMunicipio = constructorasModel.municipioseleccionado;
            datos.idBarrio = constructorasModel.barrioseleccionado;
            datos.estado = divFiltro.find('#cboFiltroEstado').val();
            datos.fechaInicial = divFiltro.find('#txtFiltroVigenciaInicio').val();
            datos.fechaFinal = divFiltro.find('#txtFiltroVigenciaFin').val();
            datos.idTercero = constructorasModel.terceroseleccionado;
            datos.opcion = 'ENC';
            constructorasControl.consultarContratos(datos, that.mostrarConstructorasResultados);
        } else
            var pmensaje = $('p#pMensaje').text('Debe ingresar al menos un parametro de Consulta');
    },
    /** Obtiene los datos que retorna la Peticion que se lanza en el metodo  filtrarConstructoraResultados 
     *  y los muestra en forma de tabla con campo de seleccion para ubicarse sobre un registro espeficio 
     *  recibe JSON  @data.contratos  
     ** @returns {void}
     */
    mostrarConstructorasResultados: function (data) {
        __dom.ocultarCargador();
        constructorasModel.contratos = data.contratos;
        if (parseInt(data.codigoRespuesta) === 0) {
            var pmensaje = $('p#pMensaje').text(data.mensajeError);
            return;
        }
        var tablaContratos = fillTable("tblResultadoFiltro", "formatoContratos", "constructorasModel.contratos", ' ');
        var divRsultados = $('#divResultadosFiltro').show();
    },
    /** Una vez se recibe el resultado del filtro de la consulta y se selecciona uno de los registros al 
     *  dar clic sobre el boton de finalizar se carga la informacion a la seccion de informacion Contractual 
     *  con los datos que se retornan en el documento JSON 
     ** @returns {void}
     */
    CargarConstructorasResultados: function () {
        var posicion = $('table#tblResultadoFiltro input[type=radio]:checked').parent().parent().attr('data-fila');
        var tabSuscripciones = $('div#tabSuscripciones');
        var ResultContratos = constructorasModel.contratos[posicion];
        var informacionContraactual = $('div#divInformacionContraActual');
        var informacionConstructura = $('div#divConstructora');
        $('div#ArchivosAdjuntos').show();
        informacionConstructura.find('input#txtNombreConstructora').val(ResultContratos.nombreConstructora);
        informacionConstructura.find('input#txtNit').val(ResultContratos.nit);
        constructorasModel.constructoraseleccionada = ResultContratos.terIderegistro;
//        $('#legidcontrato').text($('#legidcontrato').text() + '  Registro Nro. ' + ResultContratos.idRegistro);
        $('#legidcontrato').text($('#legidcontrato').text() + '  Registro Nro. ' + ResultContratos.Consecutivo);
        informacionContraactual.find('input#txtContrato').val(ResultContratos.contrato);
        informacionContraactual.find('input#txtLicencia').val(ResultContratos.licencia);

        informacionContraactual.find('input#txtLicenciaVigenciaDesde').val(ResultContratos.licenciavigentedesde);
        informacionContraactual.find('input#txtLicenciaVigenciaHasta').val(ResultContratos.licenciavigentehasta);

        informacionContraactual.find('input#txtVigenciaDesde').val(ResultContratos.vigenciaInicio);
        informacionContraactual.find('input#txtVigenciaHasta').val(ResultContratos.vigenciaFinal);
        informacionContraactual.find('input#txtNumeroActaInicio').val(ResultContratos.actaInicial);
        informacionContraactual.find('input#txtFechaActaIncio').val(ResultContratos.fechaInicio);
        informacionContraactual.find('input#txtNumeroActaFin').val(ResultContratos.actaFinal);
        informacionContraactual.find('input#txtFechaActaFin').val(ResultContratos.fechaFinal);
        informacionContraactual.find('select#EstadoContrato').val(ResultContratos.estado);
        informacionContraactual.find('select#diaActivacion').val(ResultContratos.diaactivacion);
        informacionContraactual.find('input#textMunicipio').val(ResultContratos.nombreMunicipio);
        constructorasModel.municipioseleccionado = ResultContratos.codigoMunicipio;
        informacionContraactual.find('input#textBarrio').val(ResultContratos.nombreBarrio);
        constructorasModel.barrioseleccionado = ResultContratos.codigoBarrio;
        informacionContraactual.find('input#textDireccion').val(ResultContratos.Direccion);
        informacionContraactual.find('select#cboMetodoConstructivo').val(ResultContratos.metodoConstructivo);
        informacionContraactual.find('input#txtvalorAntesIva').val(ResultContratos.valorAntesIva);
        informacionContraactual.find('input#txtvalorIva').val(ResultContratos.ivaProyecto);
        informacionContraactual.find('input#txtvalorProyecto').val(parseFloat(parseFloat(ResultContratos.valorAntesIva) + parseFloat(ResultContratos.ivaProyecto)));
        informacionContraactual.find('input#txtVlrPagoAnticipo').val(ResultContratos.antProyecto);

        informacionContraactual.find('input#txtporcentajeAnticipo').val(ResultContratos.porcentajeAnticipo);
        informacionContraactual.find('input#txtporcentajePagoParcial').val(ResultContratos.porcentajePagoParcial);
        informacionContraactual.find('input#txtvalorPagoParcial').val(ResultContratos.vlrPagoParcial);
        informacionContraactual.find('input#txtporcentajePagoFinal').val(ResultContratos.porcentajePagoFinal);
        informacionContraactual.find('input#txtvalorPagoFinal').val(ResultContratos.vlrPagoFinal);

        informacionContraactual.find('input#txtsaldoNegocio').val(
                parseFloat(ResultContratos.antProyecto) + parseFloat(ResultContratos.vlrPagoParcial) + parseFloat(ResultContratos.vlrPagoFinal));

        informacionContraactual.find('input#txtinfoFacturaSeven').val(ResultContratos.sevFactura);
        informacionContraactual.find('textarea#txtObjeto').val(ResultContratos.objeto);
        if (ResultContratos.idRegistro !== '')
        {
            constructorasModel.estadoContrato = ResultContratos.estado;

            if (that.validarContratoEditable()) {
                informacionContraactual.find('input,textarea, select').removeAttr('disabled');
            }
            if (constructorasModel.permisosEdicion == 1) {
                $('#txtFechaActaIncio').removeAttr('disabled');
                $('#txtFechaActaFin').removeAttr('disabled');
            }
            constructorasModel.contratoideregistro = ResultContratos.idRegistro;
            constructorasModel.suscripcionesrelacionadas = [];
            var datos = {};
            datos.idRegistro = ResultContratos.idRegistro;
            datos.opcion = 'DET';
            constructorasControl.consultarContactos(datos, that.CargarConstructorasResultadosContactos);
            constructorasControl.consultarContratos(datos, that.CargarConstructorasResultadosContratos);
            that.cargaInformacionGeneral();

        }
        var tabSuscripcionesSuscriptorVinculado = $("div #tabSuscripcionesSuscriptorVinculado");
        var tabSuscripcionesVincularSuscriptor = $("div #tabSuscripcionesVincularSuscriptor");
        if (ResultContratos.susIderegistro !== '')
        {
            tabSuscripcionesSuscriptorVinculado.show();
            tabSuscripcionesVincularSuscriptor.hide();
            tabSuscripciones.find('input#txtIdeSuscriptor').val(ResultContratos.susConvenio);
            tabSuscripciones.find('input#txtDesSuscriptor').val(ResultContratos.susDescripcion);
            constructorasModel.suscriptor = ResultContratos.susIderegistro;
        } else {
            tabSuscripcionesSuscriptorVinculado.hide();
            tabSuscripcionesVincularSuscriptor.show();
            constructorasModel.suscriptor = null;
            tabSuscripciones.find('input#txtIdeSuscriptor').val('');
            tabSuscripciones.find('input#txtDesSuscriptor').val('');
        }
        $('input#txtvalorProyecto,input#txtsaldoNegocio').attr('disabled', 'disabled');
        $('input#txtsaldoNegocio').attr('disabled', 'disabled')
        $('input#txtvalorProyecto').attr('disabled', 'disabled')
        $('input#txtvalorAnticipo').attr('disabled', 'disabled')
        $('input#txtvalorPagoParcial').attr('disabled', 'disabled')
        $('input#txtvalorPagoFinal').attr('disabled', 'disabled')
        that.dialogoActual.dialog('close');
    },
    CargarConstructorasResultadosContratos: function (Data) {

        constructorasModel.proyecto = Data.proyecto;
        constructorasModel.polizas = Data.polizas;
        constructorasModel.archivos = Data.archivos;
        that.mostrarArchivos(constructorasModel.archivos);
        
        constructorasModel.servicioscontratados = Data.serviciosContratados;
        $.each(constructorasModel.servicioscontratados, function (i, item) {
            $.each(constructorasModel.servicioscontratados[i].suscripciones, function (s, suscripciones) {
                constructorasModel.suscripcionesrelacionadas.push(suscripciones);
            });
        });
        that.cargarTablaPolizas();
        that.cargarTablaServiciosContratados();

        $('#cmbClasifiLiq').val(Data.proyecto[0].liq_venclasific);
        $('#cmbProyectoSeven').val(Data.proyecto[0].proyectoseven);
        
        constructorasModel.detDistribucionPago = Data.detDistribucionPago;
        
        $("#txtPorcentajePagoAnticipo").val(Data.detDistribucionPago[0].porcentajePago);
        $("#txtPorcentajeAvanceAnticipo").val(Data.detDistribucionPago[0].porcentajeAvance);
        $("#txtFecFacturaAnticipo").val(Data.detDistribucionPago[0].fechaFactura);
        $("#txtFacSevenAnticipo").val(Data.detDistribucionPago[0].facturaSeven);
        
        $("#txtPorcentajePagoPagoParcial1").val(Data.detDistribucionPago[1].porcentajePago);
        $("#txtPorcentajeAvancePagoParcial1").val(Data.detDistribucionPago[1].porcentajeAvance);
        $("#txtFecFacturaPagoParcial1").val(Data.detDistribucionPago[1].fechaFactura);
        $("#txtFacSevenPagoParcial1").val(Data.detDistribucionPago[1].facturaSeven);
        
        $("#txtPorcentajePagoPagoParcial2").val(Data.detDistribucionPago[2].porcentajePago);
        $("#txtPorcentajeAvancePagoParcial2").val(Data.detDistribucionPago[2].porcentajeAvance);
        $("#txtFecFacturaPagoParcial2").val(Data.detDistribucionPago[2].fechaFactura);
        $("#txtFacSevenPagoParcial2").val(Data.detDistribucionPago[2].facturaSeven);
        
        $("#txtPorcentajePagoPagoParcial3").val(Data.detDistribucionPago[3].porcentajePago);
        $("#txtPorcentajeAvancePagoParcial3").val(Data.detDistribucionPago[3].porcentajeAvance);
        $("#txtFecFacturaPagoParcial3").val(Data.detDistribucionPago[3].fechaFactura);
        $("#txtFacSevenPagoParcial3").val(Data.detDistribucionPago[3].facturaSeven);
        
        $("#txtPorcentajePagoPagoFinal").val(Data.detDistribucionPago[4].porcentajePago);
        $("#txtPorcentajeAvancePagoFinal").val(Data.detDistribucionPago[4].porcentajeAvance);
        $("#txtFecFacturaPagoFinal").val(Data.detDistribucionPago[4].fechaFactura);
        $("#txtFacSevenPagoFinal").val(Data.detDistribucionPago[4].facturaSeven);        
        
        that.ActualizarDetallePago();
        that.ActualizarAvanceGeneral();
    },
    /** Metodo que valida los campos requeridos en la seccion de informacion Contraactual y se encarga de 
     *  preparar la información que se envia en JSON al controlador para que cargue los datos en la Base de datos 
     *  entrega JSON  @data.contratos , @data.contactos, @data.servicioscontratados , @data.polizas 
     ** @returns {Mensaje con el Id del Contrato que se inserto }
     */
    grabarConstructora: function () {
       
        if(!that.validaPesoConceptos())
            return;
        
        if (!that.validarContratoEditable())
            return;
        
        var divConstructora = $('div#divConstructora');
        var divInformacionContraactual = $('div#divInformacionContraActual');
        var informacionContrato = {};
        var infDistribucionPagos = [];
        var continuar = true;
        constructorasModel.archivosgrabar = [];
        var campos = divInformacionContraactual.find('input[type=text] :not(.novalidar),select,textarea');
        $('#pMensajeInfocontraactual').text('');
        
        if (constructorasModel.constructoraseleccionada === null) {
            continuar = false;
            __dom.lanzarAlerta('No se ha seleccionado Constructora Válida', 'Error');
            $('div#divConstructora input#txtNombreConstructora').focus();
            return;
        }
        
        for (var i = 0; i < campos.length; i++) {
            var campo = $(campos[i]);
            var requerido = campo.attr('required');
            if ((campo.val() === '' || campo.val() === '-1') && requerido === 'required')
            {
                var idCampo = campo.attr('id');
                var ValLabelCampo = divInformacionContraactual.find('label[for=' + idCampo + ']').text();
                continuar = false;
                $('#pMensajeInfocontraactual').text('Campo ' + ValLabelCampo + ' es requerido y no esta Diligenciado ');
                campo.focus();
                return;
            }
        }
        
        if (constructorasModel.municipioseleccionado === null ||
                constructorasModel.barrioseleccionado === null)
        {
            continuar = false;
            $('<p>#MensajeInfocontraactual').text('Campo ' + ValLabelCampo + ' es requerido y no esta Diligenciado ');
        }
        /*
         *  Validacion Fechas  
         *  txtLicenciaVigenciaDesde
         */
        if (that.validarFechaMayor($('input#txtVigenciaDesde').val(), $('input#txtVigenciaHasta').val()))
        {
            $('#pMensajeInfocontraactual').text('Fecha Contrato Vigente Desde debe ser menor a Fecha Contrato Vigente Hasta ');
            continuar = false;
        }
        
        if (that.validarFechaMayor($('input#txtLicenciaVigenciaDesde').val(), $('input#txtLicenciaVigenciaHasta').val()))
        {
            $('#pMensajeInfocontraactual').text('Fecha Licencia vigencia Desde debe ser menor a Fecha Licencia Vigencia Hasta ');
            continuar = false;
        }
//      Se cambia por solicitud de Andrea
//         if (that.validarFechaMayor($('input#txtVigenciaDesde').val(), $('input#txtLicenciaVigenciaDesde').val()))
//        {
//            $('#pMensajeInfocontraactual').text('Fecha Licencia vigencia Desde debe ser mayor a Fecha Contrato Vigente Desde ');
//            continuar = false;
//        }

        if (that.validarFechaMayor($('input#txtFechaActaIncio').val(), $('input#txtFechaActaFin').val())
                && $('input#txtFechaActaFin').val() != '')
        {
            $('#pMensajeInfocontraactual').text('Fecha Acta Inicio  debe ser menor a Fecha Acta Fin ');
            continuar = false;
        }
//        if (that.validarFechaMayor($('input#txtVigenciaDesde').val(), $('input#txtFechaActaIncio').val()))
//
//        {
//            $('#pMensajeInfocontraactual').text('Fecha Contrato Vigente desde debe ser menor a Fecha Acta Inicio ');
//            continuar = false;
//        }
        if (continuar)
        {
            informacionContrato.contrato = divInformacionContraactual.find('input#txtContrato').val();
            informacionContrato.Licencia = divInformacionContraactual.find('input#txtLicencia').val();
            informacionContrato.licfechainicio = divInformacionContraactual.find('input#txtLicenciaVigenciaDesde').val();
            informacionContrato.licfecchafin = divInformacionContraactual.find('input#txtLicenciaVigenciaHasta').val();
            informacionContrato.VigenciaDesde = divInformacionContraactual.find('input#txtVigenciaDesde').val();
            informacionContrato.VigenciaHasta = divInformacionContraactual.find('input#txtVigenciaHasta').val();
            informacionContrato.NumeroActaInicio = divInformacionContraactual.find('input#txtNumeroActaInicio').val();
            informacionContrato.FechaActaIncio = divInformacionContraactual.find('input#txtFechaActaIncio').val();
            informacionContrato.NumeroActaFin = divInformacionContraactual.find('input#txtNumeroActaFin').val();
            informacionContrato.FechaActaFin = divInformacionContraactual.find('input#txtFechaActaFin').val();
            informacionContrato.EstadoContrato = divInformacionContraactual.find('select#EstadoContrato').val();
            informacionContrato.Municipio = constructorasModel.municipioseleccionado;
            informacionContrato.Barrio = constructorasModel.barrioseleccionado;
            informacionContrato.diaActivacion = divInformacionContraactual.find('select#diaActivacion').val();
            informacionContrato.Direccion = divInformacionContraactual.find('input#textDireccion').val();
            ;
            informacionContrato.vlrAntesIva = that.depurarCamposNumericos('txtvalorAntesIva');
            informacionContrato.vlrIva = that.depurarCamposNumericos('txtvalorIva');

            /*informacionContrato.porcentajeAnticipo = that.depurarCamposNumericos('txtporcentajeAnticipo');
            informacionContrato.vlrAnticipo = that.depurarCamposNumericos('txtvalorAnticipo');

            informacionContrato.porcentajePagoParcial = that.depurarCamposNumericos('txtporcentajePagoParcial');
            informacionContrato.vlrPagoParcial = that.depurarCamposNumericos('txtvalorPagoParcial');
            informacionContrato.porcentajePagoFinal = that.depurarCamposNumericos('txtporcentajePagoFinal');
            informacionContrato.vlrPagoFinal = that.depurarCamposNumericos('txtvalorPagoFinal');

            informacionContrato.infFacturaSeven = divInformacionContraactual.find('input#txtinfoFacturaSeven').val();
            informacionContrato.Objeto = divInformacionContraactual.find('textarea#txtObjeto').val();
            informacionContrato.susIdeRegistro = constructorasModel.suscriptor;
            informacionContrato.porcanticipo = constructorasModel.suscriptor;

            informacionContrato.clasifiLiq = divConstructora.find('select#cmbClasifiLiq').val();
            informacionContrato.proyectoSeven = divConstructora.find('select#cmbProyectoSeven').val();*/

            /**
             * Informacion con la nueva distribucion de pagos
             */
            
            var detInfDistribucionPago = {};           
            detInfDistribucionPago.porcentajePago   = that.depurarCamposNumericos('txtPorcentajePagoAnticipo');
            detInfDistribucionPago.porcentajeAvance = that.depurarCamposNumericos('txtPorcentajeAvanceAnticipo');
            detInfDistribucionPago.fechaFactura     = that.depurarCamposNumericos('txtFecFacturaAnticipo');
            detInfDistribucionPago.facturaSeven     = that.depurarCamposNumericos('txtFacSevenAnticipo');
            infDistribucionPagos.push(detInfDistribucionPago);
            
            detInfDistribucionPago = {};
            detInfDistribucionPago.porcentajePago   = that.depurarCamposNumericos('txtPorcentajePagoPagoParcial1');
            detInfDistribucionPago.porcentajeAvance = that.depurarCamposNumericos('txtPorcentajeAvancePagoParcial1');
            detInfDistribucionPago.fechaFactura     = that.depurarCamposNumericos('txtFecFacturaPagoParcial1');
            detInfDistribucionPago.facturaSeven     = that.depurarCamposNumericos('txtFacSevenPagoParcial1');            
            infDistribucionPagos.push(detInfDistribucionPago);
            
            detInfDistribucionPago = {};
            detInfDistribucionPago.porcentajePago   = that.depurarCamposNumericos('txtPorcentajePagoPagoParcial2');
            detInfDistribucionPago.porcentajeAvance = that.depurarCamposNumericos('txtPorcentajeAvancePagoParcial2');
            detInfDistribucionPago.fechaFactura     = that.depurarCamposNumericos('txtFecFacturaPagoParcial2');
            detInfDistribucionPago.facturaSeven     = that.depurarCamposNumericos('txtFacSevenPagoParcial2');            
            infDistribucionPagos.push(detInfDistribucionPago);
            
            detInfDistribucionPago = {};
            detInfDistribucionPago.porcentajePago   = that.depurarCamposNumericos('txtPorcentajePagoPagoParcial3');
            detInfDistribucionPago.porcentajeAvance = that.depurarCamposNumericos('txtPorcentajeAvancePagoParcial3');
            detInfDistribucionPago.fechaFactura     = that.depurarCamposNumericos('txtFecFacturaPagoParcial3');
            detInfDistribucionPago.facturaSeven     = that.depurarCamposNumericos('txtFacSevenPagoParcial3');            
            infDistribucionPagos.push(detInfDistribucionPago);
            
            detInfDistribucionPago = {};
            detInfDistribucionPago.porcentajePago   = that.depurarCamposNumericos('txtPorcentajePagoPagoFinal');
            detInfDistribucionPago.porcentajeAvance = that.depurarCamposNumericos('txtPorcentajeAvancePagoFinal');
            detInfDistribucionPago.fechaFactura     = that.depurarCamposNumericos('txtFecFacturaPagoFinal');
            detInfDistribucionPago.facturaSeven     = that.depurarCamposNumericos('txtFacSevenPagoFinal');            
            infDistribucionPagos.push(detInfDistribucionPago);
            
            informacionContrato.infFacturaSeven = divInformacionContraactual.find('input#txtinfoFacturaSeven').val();
            informacionContrato.Objeto = divInformacionContraactual.find('textarea#txtObjeto').val();
            informacionContrato.susIdeRegistro = constructorasModel.suscriptor;
            informacionContrato.porcanticipo = constructorasModel.suscriptor;

            informacionContrato.clasifiLiq = divConstructora.find('select#cmbClasifiLiq').val();
            informacionContrato.proyectoSeven = divConstructora.find('select#cmbProyectoSeven').val();


            var datos = {};
            datos.contratoideregistro = constructorasModel.contratoideregistro;
            datos.contrato = informacionContrato;
            datos.infDistribucionPago = infDistribucionPagos;
            datos.contactos = constructorasModel.contactos;
            datos.contactoseliminar = constructorasModel.contactoseliminar;
            datos.idConstructora = constructorasModel.constructoraseleccionada;
            
            if (constructorasModel.polizas.length > 0) {
                datos.polizas = constructorasModel.polizas;
            }
            
            if (constructorasModel.polizaseliminar.length > 0) {
                datos.polizaseliminar = constructorasModel.polizaseliminar;
            }
            
            if (constructorasModel.suscriptor === null) {
                __dom.lanzarAlerta("No se ha Relacionado Ningun Suscriptor");
                continuar = false;
            }
            /*
             *  Se quita condición paraa grabar constructoras si no se ha relacionado ningún servicio 
             *  contratado
             */
            if (constructorasModel.servicioscontratados.length > 0) {

                constructorasModel.servicioscontratadosGrabar = [];
                $.each(constructorasModel.servicioscontratados, function (i, item) {
                    var serviciosGrabar = {};
                    serviciosGrabar.uco_ideregistro = (item.uco_ideregistro === undefined) ? '' : item.uco_ideregistro;
                    serviciosGrabar.liquidacion = item.liquidacion;
                    serviciosGrabar.agenda = item.agenda;
                    serviciosGrabar.metodo = item.metodo;
                    serviciosGrabar.peso = item.peso;
                    serviciosGrabar.iddocumento = item.iddocumento;
                    serviciosGrabar.idtipodocumento = item.idtipodocumento;
                    serviciosGrabar.informacionAdicional = item.informacionAdicional;
                    serviciosGrabar.conceptos = item.conceptos;
                    serviciosGrabar.suscripciones = item.suscripciones;
                    constructorasModel.servicioscontratadosGrabar.push(serviciosGrabar);
                });
                datos.servicioscontratados = constructorasModel.servicioscontratadosGrabar;
            }

            datos.servicioscontratadosEliminar = constructorasModel.servicioscontratadosEliminar;
            datos.suscripcionesEliminar = constructorasModel.suscripcionesEliminar;

            $.each(constructorasModel.archivos, function (i, item) {
                var dataarchivos = {};
                dataarchivos.idarchivo = item.idarchivo;
                constructorasModel.archivosgrabar.push(dataarchivos);
            });
            datos.archivosgrabar = constructorasModel.archivosgrabar;
            if (continuar) {
                continuar = that.ActualizarDetallePago();
            }
            if (continuar) {
                constructorasControl.grabar(datos, that.grabarConstructoraRespuesta);
            }
        }
    },
    /** Procesa respuesta de la transaccion de guardar por parte del Controlador  
     *  y los muestra en forma dialogo modal  
     *  recibe JSON  {respuesta.mensajeError} , inializa Seccion de Informacion Contraactual si la respuesta es positiva  
     ** @returns {void}
     */
    grabarConstructoraRespuesta: function (respuesta) {

        if (respuesta.codigoRespuesta === 0 || respuesta.codigoRespuesta === -1)
            __dom.lanzarAlerta(respuesta.mensaje, 'Error', '');
        else
            __dom.lanzarAlerta(respuesta.mensaje, 'Resultado', that.recargar);
        __dom.ocultarCargador();
    },
    recargar: function ()
    {
        location.reload();
    },
    /** Complementa la Peticion del FIltro de las Constructoras ,recibiendo el objeto contactos cargandolo al modelo de js del caso de uso
     *   y  luego lanza peticion  a la funcion cargarTablaContactos para que esta despliegue los datos  en modo de tabla 
     ** @returns {void}
     */
    CargarConstructorasResultadosContactos: function (data) {
        __dom.ocultarCargador();
        if (data.codigoRespuesta == 0) {
            constructorasModel.contactos = [];
        } else
        {
            constructorasModel.contactos = data.contactos;
        }
        that.cargarTablaContactos();
    },
    /** Llena objeto tabla en seccion de Informacion contraactual del registro seleccionado en la Constructora
     ** @returns {void}
     */
    cargarTablaContactos: function () {
        var divContactos = $('div#divInformacionContactos');
        if (constructorasModel.contactos.length > 0) {
            var tablaContactos = fillTable("tblContactos", "formatoContactos", "constructorasModel.contactos", "Contactos");
            divContactos.fadeIn(400);
            tablaContactos.find('tbody tr').on('click', that.eventoSobreFilaContactos);
        } else {
            divContactos.hide();
        }
    },
    /** Adiciona Evento al ubicar el cursor sobre una fila de los contactos  y dar clic sobre esta, despliega seccion de vista de datos
     *  en formulario , presenta opcion de Elminar y Moficar el registro selecconado de contactos 
     *@return {void}
     */
    eventoSobreFilaContactos: function () {
        $('#pMensajeInfoconceptos').text('');
        var filaSeleccionada = $(this).attr('data-fila');
        that.filaSeleccionada = filaSeleccionada;
        var Contacto = constructorasModel.contactos[filaSeleccionada];
        var divAdicionarContactos = $('div#divAdicionarContactos');
        divAdicionarContactos.find('input').removeAttr('disabled');
        divAdicionarContactos.find('#txtNombre').val(Contacto.nombreContacto);
        divAdicionarContactos.find('#txtCargo').val(Contacto.cargoContacto);
        divAdicionarContactos.find('#txtTelefonoFijo').val(Contacto.telefonoFijo);
        divAdicionarContactos.find('#txtTelefonoCelular').val(Contacto.telefonoCelular);
        divAdicionarContactos.find('#txtCorreo').val(Contacto.correo);
        that.dialogoActual = divAdicionarContactos.dialogo({
            modal: true,
            width: 850,
            title: 'Adicionar Contactos',
            buttons: {
                Eliminar: that.eliminarContactoModelConfirma,
                Modificar: that.modificarContactoModel
            }
        });
    },
    /** Modifica los datos del Contacto seleccionado  a nivel del modelo de JavaScript 
     *  e invoca nuevamente el metodo de cargartablaContactos para que a nivel de vista se puedan ver los cambios realizados 
     *@return {void}
     */
    modificarContactoModel: function () {
        if (constructorasModel.estadoContrato === 'T' && constructorasModel.permisosEdicion === -1)
            return;

        if (!that.validarContacto())
            return;
        var divAdicionarContactos = $('div#divAdicionarContactos');
        $('#pMensajeInfoconceptos').text('');
        constructorasModel.contactos[that.filaSeleccionada].nombreContacto = divAdicionarContactos.find('#txtNombre').val();
        constructorasModel.contactos[that.filaSeleccionada].cargoContacto = divAdicionarContactos.find('#txtCargo').val();
        constructorasModel.contactos[that.filaSeleccionada].telefonoFijo = divAdicionarContactos.find('#txtTelefonoFijo').val();
        constructorasModel.contactos[that.filaSeleccionada].telefonoCelular = divAdicionarContactos.find('#txtTelefonoCelular').val();
        constructorasModel.contactos[that.filaSeleccionada].correo = divAdicionarContactos.find('#txtCorreo').val();
        divAdicionarContactos.find('input[type=text]').val('');
        that.cargarTablaContactos();
        that.dialogoActual.dialog('close');
    },
    /** Muestra alerta modal solitando confirmar la eliminacion del registro , si la respuesta es positiva , invoca metodo eliminarcontactoModelCOnfirma 
     *  para hacer efectiva la eiminación del registro en el modelo js 
     * @returns {void}
     */
    eliminarContactoModelConfirma: function () {
        if (!that.validarContratoEditable())
            return;
        __dom.lanzarAlerta('Confirma Eliminación del Contacto', 'Confirmar', that.eliminarContactoModel);
    },
    /** Elmina el regitro una vez confirmada la transaccion de elminacion en el Modelo js, invoca cartaTablaContactos, para mostrar 
     *  el contenido actualizado posterior a la elminacion, se genera replica de registro eliminado en modelo para proceder a confirmar la
     *  elminación del(los) contactos en la base de datos definitivamente una vez se aplica el boton de transaccion grabar 
     *@return {void}
     */
    eliminarContactoModel: function () {
        var DatosEliminar = {};
        $('#pMensajeInfoconceptos').text('');
        DatosEliminar = constructorasModel.contactos[that.filaSeleccionada];
        constructorasModel.contactoseliminar.push(DatosEliminar);
        constructorasModel.contactos.splice(that.filaSeleccionada, 1);
        that.cargarTablaContactos();
        that.dialogoActual.dialog('close');
    },
    /** Incializar seccion de Polizas y carga Dialogo Modal para capturar la información que se desea cargar en la
     *  seccion de polizas del contrato que se este editando 
     *@return {void}
     */
    adicionarPoliza: function () {
        if (constructorasModel.estadoContrato === 'T' && constructorasModel.permisosEdicion === -1)
            return;
        if (constructorasModel.constructoraseleccionada === null)
        {
            __dom.lanzarAlerta('Debe seleccionar una Constructora', 'Error');
            return;
        }


        var divadicionarPoliza = $('div#divInformacionGeneralAdicionarPoliza');
        $('#pmensajePolizas').text('');
        divadicionarPoliza.find('input').removeAttr('disabled');
        divadicionarPoliza.find('textarea').removeAttr('disabled');
        divadicionarPoliza.find('input[type=text]').val('');
        divadicionarPoliza.find('textarea').val('');
        divadicionarPoliza.find('#txtVigenteDesde').val('');
        divadicionarPoliza.find('#txtVigenteHasta').val('');
        that.dialogoActual = divadicionarPoliza.dialogo({
            modal: true,
            width: 850,
            title: 'Adicionar Pólizas',
            buttons: {
                Grabar: that.adicionarPolizaGrabar
            }
        });
    },
    /** Graba informacion ingresada en Seccion de polizas al modelo js , carga informacion registrada con metodo cargarTablaPolizas 
     *@return {void}
     */
    adicionarPolizaGrabar: function () {
        if (constructorasModel.estadoContrato === 'T' && constructorasModel.permisosEdicion === -1)
            return;
        var divadicionarPoliza = $('div#divInformacionGeneralAdicionarPoliza');
        $('#pmensajePolizas').text('');
        var continuar = true;
        var Polizas = {};
        if (!that.validarPolizas())
        {
            return;
        }


        if (continuar) {
            Polizas.NomAseguradora = divadicionarPoliza.find('#txtAseguradora').val();
            Polizas.nroPoliza = divadicionarPoliza.find('#txtnroPoliza').val();
            Polizas.aseguradoraValor = that.depurarCamposNumericos('txtaseguradoraValor');
            Polizas.aseguradoraOjbeto = divadicionarPoliza.find('#txtobjetoPoliza').val();
            Polizas.vigenteDesde = divadicionarPoliza.find('#txtVigenteDesde').val();
            Polizas.vigenteHasta = divadicionarPoliza.find('#txtVigenteHasta').val();

            Polizas.terideRegistro = constructorasModel.aseguradoraseleccionada;
            constructorasModel.polizas.push(Polizas);
            that.cargarTablaPolizas();
        }

    },
    validarPolizas: function () {

        var divadicionarPoliza = $('div#divInformacionGeneralAdicionarPoliza');
        $('#pmensajePolizas').text('');
        var continuar = true;
        $.each(divadicionarPoliza.find('input,textarea'), function (i, item) {
            var valor = $(item).val();
            if (valor === '' || valor === null)
            {
                var idCampo = $(item).attr('id');
                var ValLabelCampo = divadicionarPoliza.find('label[for=' + idCampo + ']').text();
                $('#pmensajePolizas').text("No se ha diligenciado el campo " + ValLabelCampo);
                $(item).focus();
                continuar = false;

            }
            if (!continuar) {
                return false;
            }
        });
        if (!constructorasModel.aseguradoraseleccionada && (continuar))
        {
            $('#pmensajePolizas').text("La aseguradora seleccionada no es Válida ");
            $('#txtAseguradora').focus();
            continuar = false;
        }

        if (parseFloat(that.depurarCamposNumericos(('txtaseguradoraValor')) < 0)) {
            $('#pmensajePolizas').text("Valor de la póliza no puede ser negativo");
            $('#txtaseguradoraValor').focus();
            continuar = false;
        }
        return continuar;


    }



    ,
    /** Cargar en forma de tabla los datos almacenados en el modelo js relacioados con el objeto polizas , inicializa datos 
     *  de cajones de texto de la seccion de polizas 
     *@return {void}
     */
    cargarTablaPolizas: function () {
        var divPoliza = $('div#tabPolizasTabla');
        var divadicionarPoliza = $('div#divInformacionGeneralAdicionarPoliza');
        divadicionarPoliza.find('input[type=text]').val('');
        divadicionarPoliza.find('input[type=number]').val('');
        divadicionarPoliza.find('textarea').val('');
        divadicionarPoliza.find('#txtVigenteDesde').val('');
        divadicionarPoliza.find('#txtVigenteHasta').val('');
        if (constructorasModel.polizas.length > 0) {
            var tablaPolizas = fillTable("tblPolizas", "formatoPolizas", "constructorasModel.polizas");
            divPoliza.fadeIn(400);
            tablaPolizas.find('tbody tr').on('click', that.eventoSobreFilaPolizas);
            constructorasModel.aseguradoraseleccionada = null;
        } else {
            divPoliza.hide();
        }
    },
    /** Adiciona evento para modificar el registro de polizas sobre el que se ubica el cursos y se da clic , 
     *  cargando dialogo modal para modificar o elminar el registro del modelo .
     *@return {void}
     */
    eventoSobreFilaPolizas: function () {
        
        console.log("Ingreso evento sobre fila polizas");
        var filaSeleccionada = $(this).attr('data-fila');
        that.filaSeleccionada = filaSeleccionada;
        var Polizas = constructorasModel.polizas[filaSeleccionada];
        constructorasModel.aseguradoraseleccionada = Polizas.terideRegistro;
        var divEditarPolizas = $('div#divInformacionGeneralAdicionarPoliza');
        divEditarPolizas.find('input').removeAttr('disabled');
        divEditarPolizas.find('#txtnroPoliza').val(Polizas.nroPoliza);
        divEditarPolizas.find('#txtAseguradora').val(Polizas.NomAseguradora);
        divEditarPolizas.find('#txtaseguradoraValor').val(Polizas.aseguradoraValor);
        divEditarPolizas.find('#txtobjetoPoliza').val(Polizas.aseguradoraOjbeto);
        divEditarPolizas.find('#txtVigenteDesde').val(Polizas.vigenteDesde);
        divEditarPolizas.find('#txtVigenteHasta').val(Polizas.vigenteHasta);
        that.dialogoActual = divEditarPolizas.dialogo({
            modal: true,
            width: 850,
            title: 'Edicion Polizas',
            buttons: {
                Eliminar: that.eliminarPolizaConfirma,
                Modificar: that.modificarPoliza
            }
        });
    },
    /** Lanza mensaje de confirmación de eliminación del regitro poliza del modelo js a
     *@return {void}
     */
    eliminarPolizaConfirma: function () {
        if (!that.validarContratoEditable())
            return;
        __dom.lanzarAlerta('Confirma Eliminación del Contacto', 'Confirmar', that.eliminarPolizaModel);
    },
    /** Elmina registro de poliza en el modelo js  y crear replica del registro elminado para elminarlo definitivamente 
     *  una vez se aplique la opción de grabar para confirmar la transacción en la base datos, recarga la tabla de Polizas para 
     *  ver la informació actualizada de polizas
     *@return {void}
     */
    eliminarPolizaModel: function () {
        var DatosEliminar = {};
        DatosEliminar = constructorasModel.polizas[that.filaSeleccionada];
        constructorasModel.polizaseliminar.push(DatosEliminar);
        constructorasModel.polizas.splice(that.filaSeleccionada, 1);
        that.cargarTablaPolizas();
        that.dialogoActual.dialog('close');
    },
    /** Modifica poliza seleccionada , y aplica los cambios en el modelo, recarga la tabla de Polizas para ver la 
     *  información actualizada
     *@return {void}
     */
    modificarPoliza: function () {
        if (constructorasModel.estadoContrato === 'T' && constructorasModel.permisosEdicion === -1)
            return;

        if (!that.validarPolizas())
            return;
        var divadicionarPoliza = $('div#divInformacionGeneralAdicionarPoliza');
        constructorasModel.polizas[that.filaSeleccionada].terideRegistro = constructorasModel.aseguradoraseleccionada;
        constructorasModel.polizas[that.filaSeleccionada].NomAseguradora = divadicionarPoliza.find('#txtAseguradora').val();
        constructorasModel.polizas[that.filaSeleccionada].nroPoliza = divadicionarPoliza.find('#txtnroPoliza').val();
        constructorasModel.polizas[that.filaSeleccionada].aseguradoraValor = that.depurarCamposNumericos('txtaseguradoraValor');
        constructorasModel.polizas[that.filaSeleccionada].aseguradoraOjbeto = divadicionarPoliza.find('#txtobjetoPoliza').val();
        constructorasModel.polizas[that.filaSeleccionada].vigenteDesde = divadicionarPoliza.find('#txtVigenteDesde').val();
        constructorasModel.polizas[that.filaSeleccionada].vigenteHasta = divadicionarPoliza.find('#txtVigenteHasta').val();

        that.cargarTablaPolizas();
        that.dialogoActual.dialog('close');
    },
    /** Modifica poliza seleccionada , y aplica los cambios en el modelo, recarga la tabla de Polizas para ver la 
     *  información actualizada
     *@return {void}
     */
    adicionarUnidadConstrutiva: function () {
        var divadicionarUnidadConstructiva = $('div#divInformacionGeneralAdicionarUnidadConstructiva');
        divadicionarUnidadConstructiva.find('input').removeAttr('disabled');
        divadicionarUnidadConstructiva.find('textarea').removeAttr('disabled');
        that.dialogoActual = divadicionarUnidadConstructiva.dialogo({
            modal: true,
            width: 850,
            title: 'Adicionar Pólizas',
            buttons: {
                Finalizar: that.filtrarConstructora
            }
        });
    },
//    cargarTablaUnidadesConstrutivas: function () {
//        var tbl4 = fillTable("tblUnidadesConstructivas", "formatoUnidadesConstructivas", "constructorasModel.unidadesconstrutivas");
//    },
    /**
     * LLena tabla de Servicios Contratados de acuerdo a lo que haya en el modelo de JS , si hay registros se adicional los botones 
     * de edición del servicio contratado , edicion de conceptos relacionados en la liquidación del servicio , y el boton 
     * de campos adicionales el cual tambien esta sujeto a la liquidación y se muestra de manera dinámica , según los campos
     * que se hayan definido para la unidad a la cual este relacionada la liquidación 
     * @returns {undefined}
     */
    cargarTablaServiciosContratados: function () {
        var tbl5 = fillTable("tblServiciosContratados", "formatoServiciosContratados", "constructorasModel.servicioscontratados");
        var thBotones = $('div#tabServiciosContratados th[id ^= btn]');
        thBotones.html('');
        var botonesconceptos = $('table#tblServiciosContratados tbody tr td[header=btnConceptos] input[type=button]');
        botonesconceptos.on('click', that.editarConceptos);
        var botoneseditarsuscripcion = $('table#tblServiciosContratados tbody tr td[header=btnEditar] input[type=button]');
        botoneseditarsuscripcion.on('click', that.editarserviciosContratados);
        var botoneseditarsuscripcion = $('table#tblServiciosContratados tbody tr td[header=btnInformacionAdicional] input[type=button]');
        botoneseditarsuscripcion.on('click', that.cargarCamposInformacionAdiconalServicios);
    },
    /** 
     * PENDIENTE POR ELABORAR MODELO DE AMORTIZACIÓN 
     * @returns {undefined}
     */

    cargarTablaAmortizacion: function () {
        var tbl6 = fillTable("tblAmortizacion", "formatoAmortizacion", "constructorasModel.amortizacion");
        var thBotones = $('div#tabAmortizacion th[id ^= btn]');
        thBotones.html('');
    },
    /**
     * Muestra sección para editar información de los contactos 
     * @returns {void}
     */

    adicionarContacto: function () {
        if (!that.validarContratoEditable())
            return;
        $('#pMensajeInfoconceptos').text('');
        if (constructorasModel.constructoraseleccionada === null)
        {
            __dom.lanzarAlerta('Debe seleccionar una Constructora', 'Error');
            return;
        }
        $('pMensajeInfoconceptos').text('');
        var divAdicionarContactos = $('div#divAdicionarContactos');
        divAdicionarContactos.find("input[type='text']").removeAttr('disabled');



        divAdicionarContactos.on('dialogclose', function () {
            __dom.inicializarValorSelectores($('div#divAdicionarContactos input[type=text]'));
        });
        that.dialogoActual = divAdicionarContactos.dialogo({
            modal: true,
            width: 850,
            title: 'Adicionar Contactos',
            buttons: {
                Guardar: that.adicionarContactoModel
            }
        });
    },
    validarContacto: function () {
        $('#pMensajeInfoconceptos').text('');
        var divAdicionarContactos = $('div#divAdicionarContactos');
        var campos = divAdicionarContactos.find("input[type='text']");
        var Validacion = true;
        $.each($(campos), function (i, item) {
            var requerido = $(item).attr('required');
            if ($(item).val() === '' && requerido === 'required')
            {
                var idCampo = $(item).attr('id');
                var ValLabelCampo = divAdicionarContactos.find('label[for=' + idCampo + ']').text();
                continuar = false;
                $('#pMensajeInfoconceptos').text('Campo ' + ValLabelCampo + ' es requerido y no esta Diligenciado ');
                $(item).focus();
                Validacion = false;

            }
            if (!Validacion)
                return false;
        }

        );
        return Validacion;


    },
    /**
     * Toma la información que se ingreso en la sección de edición de contactos  y los inserta en el modelo JS 
     * e inconva el método para cargar la información que esta actualmente almacenada en el modelo JS 
     * @returns {undefined}
     */
    adicionarContactoModel: function () {
        $('#pMensajeInfoconceptos').text('');
        var DatosContactos = {};
        var FuenteDataContactos = $('div#divAdicionarContactos');
        if (!that.validarContacto()) {
            return;
        }

        DatosContactos.idContacto = '';
        DatosContactos.nombreContacto = FuenteDataContactos.find('#txtNombre').val();
        DatosContactos.cargoContacto = FuenteDataContactos.find('#txtCargo').val();
        DatosContactos.telefonoFijo = FuenteDataContactos.find('#txtTelefonoFijo').val();
        DatosContactos.telefonoCelular = FuenteDataContactos.find('#txtTelefonoCelular').val();
        DatosContactos.correo = FuenteDataContactos.find('#txtCorreo').val();
        constructorasModel.contactos.push(DatosContactos);
        FuenteDataContactos.find('input#txtNombre').focus();
        __dom.inicializarValorSelectores($('div#divAdicionarContactos input[type=text]'));
        that.cargarTablaContactos();
    },
    /**
     * Muesta sección de Pestañas relacionadas a la información contraactual, validando que al menos haya selecccionada 
     * una constructora valida 
     * @returns {void}
     */
    cargaInformacionGeneral: function () {
        if (constructorasModel.constructoraseleccionada === null)
        {
            __dom.lanzarAlerta('Debe seleccionar una Constructora', 'Error');
            return;
        }
        $("#tabs").tabs("option", "active", 0);
        $('div#divInformacionGeneral').show();
    },
    /**
     * Adiciona atributo de autocompletado al campo de Aseguradora en la sección de adicionar polizas , invocando metodo de configuración
     * que llama al controlador de consulta de aseguradoras , una vez recibe lod datos almacena en el modelo el identificador de la 
     * aseguradora seleccionada 
     * @returns {void}
     */
    configurarAutoCompleteAseguradora: function () {
        // Autocompletado de terceros divInformacionGeneralAdicionarPoliza
        __dom.configurarAutocomplete(
                $('div#divInformacionGeneralAdicionarPoliza input#txtAseguradora'),
                that.sourceAutoCompleteTerceroAseguradora,
                function (event, ui) {
                    $('div#divInformacionGeneralAdicionarPoliza input#txtAseguradora').val(ui.item ? ui.item.value : '');
                    constructorasModel.aseguradoraseleccionada = ui.item.idVal;
                },
                function () {
                    constructorasModel.aseguradoraseleccionada = undefined;
                }
        );
    },
    /**
     * Adiciona atributo de autocompletado al campo de Constructora en la sección de filtrar 
     * @returns {undefined}
     */
    configurarAutoCompleteTercero: function () {
        __dom.configurarAutocomplete(
                $('div#camposBuscarContratosConstructoras input#txtFiltroTercero'),
                that.sourceAutoCompleteTercero,
                function (event, ui) {
                    $('input#txtFiltroTercero').val(ui.item ? ui.item.value : '');
                    constructorasModel.terceroseleccionado = ui.item.idVal;
                },
                function () {
                    constructorasModel.terceroseleccionado = undefined;
                }
        );
    },
    /**
     * Crea el objeto a enviar con los parametros de consulta(nombre de la constructora)
     * e invoca la petición al controlador para obtener los resultados .
     * @param {datos} 
     * @returns {void}
     */
    sourceAutoCompleteTercero: function (request, response) {
        that.request = request;
        that.response = response;
        var datos = {};
        datos.nombre = request.term;
        constructorasModel.terceroseleccionado = null
        constructorasControl.buscarTercero(datos, that.mostrarResultadoTercero);
    },
    /**
     * Crea el objeeto a enviar  con los paraetros de consulta(nombre aseguradora) e invoca el controlador
     * para otener el listado de aseguradoras posibles a seleccionar
     * @param {datos} 
     * @returns {void}
     */
    sourceAutoCompleteTerceroAseguradora: function (request, response) {
        that.request = request;
        that.response = response;
        var datos = {};
        datos.nombre = request.term;
        constructorasControl.buscarTerceroAseguradora(datos, that.mostrarResultadoTercero);
    },
    /**
     * Cargo el tecero seleccionado (aseguradora, tercero constructora) según el campo autocompletar que se haya diligenciado y
     * que este invocando este metodo 
     * @param {data} array terceros 
     * @returns {Object}
     */
    mostrarResultadoTercero: function (data) {
        __dom.ocultarCargador();
        var result = [];
        $.each(data.terceros, function (i, item) {
            result.push({
                label: item.nombretercero,
                value: item.nombretercero,
                idVal: item.idtercero,
                documento: item.documento
            });
        });
        that.response(result);
    },
    /**
     * Adiciona evento de autocompletar al campo de  Municipio , una vez recibe el resultado del modelo posterior a la consulta que se lanza
     * al controlador carga al modelo js el  codigo del Municipio que se selecciono del listado 
     * @returns {void}
     */
    configurarAutoComplete: function () {
        // Autocompletado de terceros
        __dom.configurarAutocomplete(
                $('div#camposBuscarContratosConstructoras input#txtFiltroMunicipio'),
                that.sourceAutoCompleteMuncipio,
                function (event, ui) {
                    $('input#txtFiltroMunicipio').val(ui.item ? ui.item.value : '');
                    constructorasModel.municipioseleccionado = ui.item.idVal;
                },
                function () {
                    constructorasModel.municipioseleccionado = undefined;
                }
        );
    },
    /**
     * Lanza petición al controlador para mostrar los municipios según valores ingresados en el nombre de municipio 
     * @param {type} request
     * @param {type} response
     * @returns {void}
     */
    sourceAutoCompleteMuncipio: function (request, response) {
        that.request = request;
        that.response = response;
        var datos = {};
        datos.nombreMunicipio = request.term;
        constructorasControl.buscarMunicipio(datos, that.mostrarResultadomunicipio);
    },
    /**
     * Muestra los datos del municipio delseccionado y devuelve los valores que se requieren para que se guarden en el 
     * modelo js el identificador del municipio  .
     * @param {type} data
     * @returns {void}
     */
    mostrarResultadomunicipio: function (data) {
        __dom.ocultarCargador();
        var result = [];
        if (data.codigoRespuesta === 1) {
            $.each(data.municipios, function (i, item) {
                result.push({
                    label: item.idMunicipio + '  ' + item.nombreMunicipio,
                    value: item.nombreMunicipio,
                    idVal: item.idMunicipio
                });
            });
        }

        that.response(result);
        __dom.configurarAutocomplete(
                $('div#camposBuscarContratosConstructoras input#txtFiltroBarrio'),
                that.sourceAutoCompleteBarrio,
                function (event, ui) {
                    $('input#txtFiltroBarrio').val(ui.item ? ui.item.value : '');
                    constructorasModel.barrioseleccionado = ui.item.idVal;
                },
                function () {
                    constructorasModel.barrioseleccionado = undefined;
                }
        );
    },
    /**
     * Si ya se ha seleccionado el campo de municipio y se han ingresado información en el nombre del barrio se envia 
     * petición al controlador para que busque los barrios que cumplan con estos filtrados 
     * @param {type} request
     * @param {type} response
     * @returns {void}
     */
    sourceAutoCompleteBarrio: function (request, response) {

        if (constructorasModel.municipioseleccionado === '') {
            __dom.lanzarAlerta('Debe seleccionar un municipio', 'Error');
            return;
        }
        that.request = request;
        that.response = response;
        var datos = {};
        datos.nombreBarrio = request.term;
        datos.idMunicipio = constructorasModel.municipioseleccionado;
        constructorasControl.buscarBarrio(datos, that.mostrarResultadoBarrio);
    },
    /**
     * Muestra los datos del barrio que se seleccionó y el identificador del barrio para que sea almacenado en 
     * el modelo Js 
     * @param {type} data
     * @returns {void}
     */
    mostrarResultadoBarrio: function (data) {
        __dom.ocultarCargador();
        if (data.codigoRespuesta === 0)
            return;
        var result = [];
        $.each(data.barrios, function (i, item) {
            result.push({
                label: item.idBarrio + '  ' + item.nombreBarrio,
                value: item.nombreBarrio,
                idVal: item.idBarrio
            });
        });
        that.response(result);
    },
    /**
     * Muestra en sección de Suscripciones Relacionadas al Sucriptor, los resultados de de la consulta de suscripciones según corresponda
     * si hay sucripciones actualmente relacionadas en el modelo JS , o si simplemente son todas las suscripciones que esten 
     * relacionadas al suscriptor que se haya elejido, las muestra en forma de tabla  
     * @returns {void}
     */
    verSuscripciones: function () {
        that.DivDestino = $('div#tabSuscripcionesTablaSuscripciones');
        that.ConsultarSuscripciones('V');
        that.cargarTablaSuscripciones();
        __dom.ocultarCargador();
    },
    /** 
     * Muestra sección para adicionar  servicios contratados , incluyendo el listado de ls posibles sucripciones que se pueden vincular y 
     * que se encuentran activas 
     * @returns {void}
     */
    AdicionarSuscripcionListaSuscripciones: function () {
        that.DivDestino = $('div#tabServiciosContratosAdicionarServicios');
        that.ConsultarSuscripciones('A');
        that.ServiciosContratosVincularSuscripciones();
        __dom.ocultarCargador();
    },
// Consultar las suscripciones que estan pendientes por vincular, trayendo del Modelo yas que se hayan vinculado 
// Con el arreglo suscripcionesrelacionadas 
    /**
     * Obtiene dato de suscripciones relacionadas actualmente en el modelo JS , o si no se ha vinculado ninguna suscripciones
     * lanza petición al controlador para obtener esta información del modelo , enviando como parámetro el codigo del suscriptor
     * @param {type} Opcion
     * @returns {void}
     */
    ConsultarSuscripciones: function (Opcion) {
        var Datos = {};
        Datos.ideSuscriptor = constructorasModel.suscriptor;
//        if (Opcion === 'A') {
//            Datos.suscripcionesRelacionadas = constructorasModel.suscripcionesrelacionadas;
//        }

        var data = constructorasControl.versuscripciones(Datos, null);
        constructorasModel.suscripciones = data.suscripciones;
    },
    /**
     * Muesta tabla de suscripciones de manera informativa que estan vinculadas al sucriptor relacionado al tecero constructora 
     * @returns {void}
     */
    cargarTablaSuscripciones: function () {
        var divtabSuscripcionesVincularSuscriptor = $('div#tabSuscripcionesTablaSuscripciones');
        if (constructorasModel.suscripciones.length > 0)
        {
            divtabSuscripcionesVincularSuscriptor.show();
            var Tbl = $("#tblSuscripciones");
            Tbl.dataTable({
                data: constructorasModel.suscripciones,
                columns: [
                    {'title': 'Suscriptor', data: 'ternombretercero'},
                    {'title': 'Cod. Anterior', data: 'CodAnterior'},
                    {'title': 'Direccion', data: 'Direccion'},
                    {'title': 'Tipo Suscripcion', data: 'TipSuscripcion'},
                    {'title': 'Tipo Uso', data: 'TipUso'},
                    {'title': 'Estado', data: 'Estado'},
                    {'title': 'Ide Propiedad', data: 'IdePropiedad'}
                ],
                fnRowCallback: function (fila, item, idx) {
                },
                language: {
                    url: '/achagua/js/Spanish.json'
                },
                bSort: true,
                destroy: true,
                lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "Todo"]]
            });
        } else {
            divtabSuscripcionesVincularSuscriptor.hide();
        }
    },
    /**
     * Activa sección para vincular servicios contratados , despliega ventana de Dialogo modal , con todo el contenido requerido para
     * registrar un nuevo servicio contratado 
     * @returns {void}
     */
    AdicionarServicioContratados: function () {

        if (!that.validarContratoEditable())
        {
            return;
        }

        if (constructorasModel.suscriptor === null)
        {
            __dom.lanzarAlerta('Tercero no esta vinculado a algún Suscriptor', 'Error');
            return;
        }
        if (constructorasModel.constructoraseleccionada === null)
        {
            __dom.lanzarAlerta('Debe seleccionar una Constructora', 'Error');
            return;
        }
        var Tbl = $('#tblServiciosContratadosSuscripcionEditar');
        Tbl.dataTable({
            data: [],
            columns: [
                {'title': 'Eliminar', data: null, type: 'check'},
                {'title': 'Suscriptor', data: 'ternombretercero'},
                {'title': 'Cod. Anterior', data: 'CodAnterior'},
                {'title': 'Direccion', data: 'Direccion'},
                {'title': 'Tipo Suscripcion', data: 'TipSuscripcion'},
                {'title': 'Tipo Uso', data: 'TipUso'},
                {'title': 'Estado', data: 'Estado'},
                {'title': 'Ide Propiedad', data: 'IdePropiedad'}
            ],
            fnRowCallback: function (fila, item, idx) {
                fila = $(fila);
                var btn = $('<input>').text('').attr({type: 'button', name: 'btnsel', value: 'Eliminar', class: 'btnSimple', data_id: idx});
                btn.on('click', that.editarserviciosContratadosEliminarSuscripcion);
                fila.find('td:first').html('').append(btn);
            },
            language: {
                url: '/achagua/js/Spanish.json'
            },
            bSort: false,
            destroy: true,
            lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "Todo"]]

        });

        that.AdicionarSuscripcionListaSuscripciones();
        constructorasModel.liquidacionseleccionada = null;

//        $('div#tabServiciosContratosAdicionarServiciosTablaSuscripciones').hide();
        var divAdicionarServiciosContratadosDialogo = $('div#tabAdicionarServiciosContratadosDialogo');
        var divAdicionarServiciosContratados = $('div#tabServiciosContratadosAdicionar');
        divAdicionarServiciosContratados.find("input#txtLiquidacion").removeAttr('disabled');
        divAdicionarServiciosContratados.find("select").removeAttr('disabled');
        divAdicionarServiciosContratados.find("input[type=number]").removeAttr('disabled');
        __dom.inicializarValorSelectores($('div#tabServiciosContratadosAdicionar input[type=text],div#tabServiciosContratadosAdicionar input[type=number]'));
//        divAdicionarServiciosContratados.on('dialogclose', function () {
//            __dom.inicializarValorSelectores($('div#tabServiciosContratadosAdicionar input[type=text],div#tabServiciosContratadosAdicionar input[type=number]'));
//        });








        that.dialogoActual = divAdicionarServiciosContratadosDialogo.dialogo({
            modal: true,
            width: 1000,
            title: 'Adicionar Servicios Contratados',
            buttons: {
                Guardar: that.AdicionarServicioContratadosGuardar
            }
        });
    },
    /**
     * Valida que se haya registrado la información requerida para adicionar un servicio , incluyendo validación maxima
     * del 100% del peso que se le asigna a cada servicio contratado , si se cumplen las condiciones, se invoca metodo 
     * para poder guardar la información ingresada en el modelo JS 
     * @returns {undefined}
     */

    AdicionarServicioContratadosGuardar: function () {

        that.mensaje = "";
        if (!that.validarContratoEditable())
            return;
        if (!that.validarServicioContratado('A'))
            return;
        that.cargarDatosGuardarServiciosContratados();
        __dom.lanzarAlerta('Confirma Insersion de Datos ? ', 'Confirmar', that.confirmarGuardarServicioContratado);

    },
    validarServicioContratado: function (Opcion) {
        var divValidar = $('div#tabServiciosContratadosAdicionar');

        var total = parseInt(divValidar.find('input#txtpeso').val());
        ;

        if (Opcion == 'E')
            total = 0;


        var campos = divValidar.find('input[type=text],input[type=number],select#cboMetodConstructivo ,select#cboAgenda');
        that.fila = $('table#tblvinvularSuscripciones tbody input[type=checkbox]:checked').attr('data_id');
        var continuar = true;
        that.mensaje = "";
        if (that.fila === undefined && Opcion == 'A')
        {
            that.mensaje = " No se ha Seleccionado Ninguna Suscripcion ";
            continuar = false;
        }
        if (continuar) {
            $.each(campos, function (i, item) {
                if ($(item).val() === '' || $(item).val() === null)
                {
                    continuar = false;
                    that.mensaje = " Hay campos sin Diligenciar";
                }
            });
        }
        if (continuar) {
            $.each(constructorasModel.servicioscontratados, function (i, item) {
                var valor = 0;
                valor = parseInt(item.peso);
                total = valor + total;
                console.log('total :' + total);
            });
            if (total > 100 || total <= 0) {
                continuar = false;
                that.mensaje += " El Peso total Registrado no debe superar el 100% ni ser inferior a 0 , valor :" + total + "% .";
            }
        }
        /*
         * Adición Condicion para adicionar nuevos registrod de servicios contratados en el modelo 
         */

        if (continuar && parseInt(divValidar.find('input#txtpeso').val()) <= 0)
        {
            continuar = false;
            that.mensaje += " EL valor del peso no puede ser menor o igual a 0 ";

        }

        if (continuar && (constructorasModel.liquidacionseleccionada == null || constructorasModel.liquidacionseleccionada == '')) {
            continuar = false;
            that.mensaje = " No se ha seleccionado una Liquidación Válida ";
        }

        if (!continuar)
            __dom.lanzarAlerta(that.mensaje, 'error');
        return continuar;

    },
    /**
     * Obtiene los datos ingresados en la sección de adicionar servicios contratados, y los carga al modelo Js 
     * @returns {void}
     */
    cargarDatosGuardarServiciosContratados: function () {
        that.DatosGuardar = {};
        that.DatosGuardar.liquidacion = constructorasModel.liquidacionseleccionada;
        that.DatosGuardar.liquidaciontext = constructorasModel.liquidacionseleccionadatext;

        that.DatosGuardar.iddocumento = constructorasModel.iddocumento;
        that.DatosGuardar.idtipodocumento = constructorasModel.idtipodocumento;

        that.DatosGuardar.documento = $('#txtDocumento').val();
        that.DatosGuardar.tipoDocumento = $('#txtTipoDocumento').val();
        that.DatosGuardar.metodo = $('#cboMetodConstructivo :selected').val();
        that.DatosGuardar.metodotext = $('#cboMetodConstructivo :selected').text();
        that.DatosGuardar.agenda = $('#cboAgenda').val();
        that.DatosGuardar.agendatext = $('#cboAgenda :selected').text();
        that.DatosGuardar.peso = $('#txtpeso').val();
        that.DatosGuardar.suscripciones = [];
        var suscripcionessseleccionables = $('table#tblvinvularSuscripciones tbody input[type=checkbox]:checked');
        //console.log(suscripcionessseleccionablesus);
        $.each($(suscripcionessseleccionables), function (i, item) {
            var suscripcion = -1;
            suscripcion = $(item).attr('data_id');

            var pos = constructorasControl.indexSuscripcion(suscripcion);
            that.DatosGuardar.suscripciones.push(constructorasModel.suscripciones[pos]);
        });
    },
    /** 
     * Cada vez que se haga alguna modificación en los datos almacenados en el Modelo JS de los servicios contratados , este 
     * metodo asegura la información modificada y refresca la tabla de servicios contragados con la nueva información 
     * @returns {void}
     */
    confirmarGuardarServicioContratado: function () {


        constructorasModel.servicioscontratados.push(that.DatosGuardar);
        $.each(that.DatosGuardar.suscripciones, function (i, item) {
            constructorasModel.suscripcionesrelacionadas.push(that.DatosGuardar.suscripciones[i]);
        });
        that.AdicionarSuscripcionListaSuscripciones();
        that.cargarTablaServiciosContratados();
        that.dialogoActual.dialog('close');
    },
    /**
     * Muestra en modo de tabla las sucripciones que se pueden vincular al servicio contratado que se esta editando , con la 
     * posibilidad de selccionar una o varias suscripciones 
     * @returns {undefined}
     */
    ServiciosContratosVincularSuscripciones: function () {
        var divtabServiciosContratadosAdicionar = $("div#tabServiciosContratosAdicionarServicios");
//        divtabServiciosContratadosAdicionar.show();
        var Tbl = $("#tblvinvularSuscripciones");
        Tbl.dataTable({
            data: constructorasModel.suscripciones,
            columns: [
                {'title': '<input type="checkbox" id="chkadicionarsuscripcion"/>', data: 'idetipousu'},
                {'title': 'Suscriptor', data: 'ternombretercero'},
                {'title': 'Cod. Anterior', data: 'CodAnterior'},
                {'title': 'Direccion', data: 'Direccion'},
                {'title': 'Tipo Suscripcion', data: 'TipSuscripcion'},
                {'title': 'Tipo Uso', data: 'TipUso'},
                {'title': 'Estado', data: 'Estado'},
                {'title': 'Ide Propiedad', data: 'IdePropiedad'}
            ],
            fnRowCallback: function (fila, item, idx) {
                fila = $(fila);
                var btn = $('<input>').text('').attr({type: 'checkbox', name: 'btnsel', data_id: item.susidesuscripcion});
                fila.find('td:first').html('').append(btn);
                $("#chkadicionarsuscripcion").on('change', function () {
                    var selector = $(this);
                    if (selector.prop('checked')) {
                        var check = $("#tblvinvularSuscripciones tbody tr td input[type=checkbox]");
                        check.attr('checked', true);
                    } else {
                        var check = $("#tblvinvularSuscripciones tbody tr td input[type=checkbox]");
                        check.attr('checked', false);
                    }
                });
            },
            language: {
                url: '/achagua/js/Spanish.json'
            },
            bSort: true,
            destroy: true,
            lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "Todo"]]
        });
    },
    /**
     * Actualiza en el modelo Js el suscriptor al cual se desea vincular el nuevo contrato de constructoras 
     * @returns {void}
     */
    VincularSuscriptor: function () {
        if (!that.validarContratoEditable())
            return;
        constructorasModel.suscriptor = $("div#tabSuscripcionesVincularSuscriptor select#cboSuscriptor").val();
        that.verSuscripciones();

    },
    /**
     * Adiciona propieda de autocompletar al campod e Liquidaciones en los servicios contratados
     * @returns {void }
     */
    configurarAutoCompleteLiquidaciones: function () {
        // Autocompletado de Liquidaciones
        var cboAgenda = $('#cboAgenda');
        constructorasModel.liquidacionseleccionada = null;
        cboAgenda.html('');
        __dom.configurarAutocomplete(
                $('div#tabServiciosContratadosAdicionar input#txtLiquidacion'),
                that.sourceAutocompletarLiquidaciones,
                function (event, ui) {
                    $('div#tabServiciosContratadosAdicionar input#txtLiquidacion').val(ui.item ? ui.item.value : '');
                    $('div#tabServiciosContratadosAdicionar input#txtDocumento').val(ui.item.documento);
                    $('div#tabServiciosContratadosAdicionar input#txtTipoDocumento').val(ui.item.tipdocumento);
                    constructorasModel.liquidacionseleccionada = ui.item.idVal;
                    constructorasModel.liquidacionseleccionadatext = ui.item.value;
                    constructorasModel.iddocumento = ui.item.iddocumento;
                    constructorasModel.idtipodocumento = ui.item.idtipodocumento;
                    that.consultarAgenda();
                },
                function () {
                    $('div#tabServiciosContratadosAdicionar input#txtDocumento').val('');
                    $('div#tabServiciosContratadosAdicionar input#txtTipoDocumento').val('');
                    constructorasModel.liquidacionseleccionada = undefined;
                    constructorasModel.liquidacionseleccionadatext = undefined;
                    constructorasModel.iddocumento = undefined;
                    constructorasModel.idtipodocumento = undefined;
                }
        );
    },
    sourceAutocompletarLiquidaciones: function (request, response) {
        that.request = request;
        that.response = response;

        var divConstructora = $('div#divConstructora');
        var clasifiLiq = divConstructora.find('select#cmbClasifiLiq').val();
        var proyectoSeven = divConstructora.find('select#cmbProyectoSeven').val();
        //console.log(clasifLiq);

        var Liquidacion = {};
        Liquidacion = $("div#tabServiciosContratadosAdicionar input#txtLiquidacion").val();

        //clasifLiq = $
        //var suscripcionessseleccionables = $('table#tblvinvularSuscripciones input[type=checkbox]:checked');
        var fila = $('table#tblvinvularSuscripciones tbody input[type=checkbox]:checked').attr('data_id');
        //console.log('fila -->  '+fila);

        if (fila === undefined) {
            var mensaje = " No se ha Seleccionado Ninguna Suscripcion ";
            __dom.lanzarAlerta(mensaje, 'Error', '');
            return;
        }

        var suscripcionessseleccionables = $('table#tblvinvularSuscripciones tbody tr td input[type=checkbox]:checked');

        var tipoUso = [];
        $.each($(suscripcionessseleccionables), function (i, item) {
            var suscripcion = -1;
            suscripcion = $(item).attr('data_id');
            var pos = constructorasControl.indexSuscripcion(suscripcion);
            if(pos >= 0){
                tipoUso.push(constructorasModel.suscripciones[pos]['idetipousu']);
            }
        });
        
        if(tipoUso.length > 0){
            tipoUso = constructorasControl.consultarTipoUsoRepetidos(tipoUso);
            constructorasControl.autocompletarLiquidaciones({Liquidacion, tipoUso, clasifiLiq}, that.mostrarLiquidaciones);
        }
    },
    
    mostrarLiquidaciones: function (data) {
        if (data.codigoRespuesta == 1) {
            var result = [];
            $.each(data.datos, function (i, item) {
                result.push({
                    label: item.idliquidacion + '  ' + item.liquidacion,
                    value: item.liquidacion,
                    idVal: item.idliquidacion,
                    documento: item.documento,
                    tipdocumento: item.tipdocumento,
                    iddocumento: item.iddocumento,
                    idtipodocumento: item.idtipodocumento
                });
            });
            that.response(result);
        } else {
            __dom.lanzarAlerta(data.mensaje, "Atencion");
            $('#cboAgenda').html('');
            $('#txtDocumento').val('');
            $('#txtTipoDocumento').val('');
        }

    },
    /**
     * Invoca metodo al Controlador enviadole como parametro "MCO" que condiciona al controlador a consultar solo los metodos constructivos 
     * según la empresa 
     * @returns {void}
     */

    consultarMetodoConstrutivo: function () {
        var Datos = {};
        Datos.opcion = "MCO";
        constructorasControl.consultaParametrosServiciosContratados(Datos, that.mostrarMetodoConstructivo);
    },
    /**
     * Construye tags HTML para pintarlo sobre el Combo de selección de los Metodos Constructivos que se pintan en la sección de edición de servicios
     * contratados 
     * @param {type} Data
     * @returns {void}
     */
    mostrarMetodoConstructivo: function (Data) {
        var cboMetodoConstructivo = $('#cboMetodConstructivo');
        cboMetodoConstructivo.html('');
        var OpcionesHtml = '';
        $.each(Data.datos, function (j, obj) {
            OpcionesHtml += "<option value=" + obj.idmetodo + ">" + obj.metodo + "</option>";
        });
        cboMetodoConstructivo.html(OpcionesHtml);
    },
    /**
     * Invoca Metodo al controlador que consulta Agendas enviandole como parametro AGE y la liquidación seleccionada , 
     * para filtrar las agendas relacionadas a la liquidación 
     * @returns {void}
     */
    consultarAgenda: function () {
        var Datos = {};
        Datos.opcion = "AGE";
        Datos.liquidacion = constructorasModel.liquidacionseleccionada;
        constructorasControl.consultaParametrosServiciosContratados(Datos, that.mostrarAgenda);
    },
    /**
     * 
     * @param {type} Data
     * @returns {undefined}
     */
    mostrarAgenda: function (Data) {
        constructorasModel.finagenda = false;
        var cboAgenda = $('#cboAgenda');
        cboAgenda.html('');
        var OpcionesHtml = '';
        $.each(Data.datos, function (j, obj) {
            OpcionesHtml += "<option value=" + obj.idagenda + ">" + obj.agenda + "</option>";
        });
        cboAgenda.html(OpcionesHtml);
        constructorasModel.finagenda = true;
        $('#cboAgenda').val(constructorasModel.servicioscontratados[that.posicion].agenda);
    },
    /**
     * 
     * @returns {undefined}
     */
    editarConceptos: function () {
        that.posicion = parseInt($(this).parent().parent().attr('data-fila'));
        var Datos = {};
        Datos.opcion = 'CON';
        Datos.liquidacion = constructorasModel.servicioscontratados[that.posicion].liquidacion;
        constructorasControl.consultaParametrosServiciosContratados(Datos, that.mostrarConceptos);
    },
    /**
     * 
     * @param {type} Datos
     * @returns {undefined}
     */
    mostrarConceptos: function (Datos) {
        $('#pmensajeConceptosliquidacion').text('');
        that.valor = 0;
        var divtabServiciosContratosConceptos = $('div#divTablaConceptosliquidacionServiciosContratados');
        divtabServiciosContratosConceptos.find('input#txtLiquidacionSeleccionada').val(Datos.datos[0].liquidacion);
        divtabServiciosContratosConceptos.find('input#txtporcentajeDistribucionmaximo').val(constructorasModel.servicioscontratados[that.posicion].peso);
        var Tbl = $('#tblconceptosliquidacionServiciosContratados');
        var ConceptosLiquidacion = [];
        ConceptosLiquidacion = Datos.datos;
        if (constructorasModel.servicioscontratados[that.posicion].conceptos === undefined)
        {
            constructorasModel.servicioscontratados[that.posicion].conceptos = [];
            $.each(ConceptosLiquidacion, function (i, item) {
                constructorasModel.servicioscontratados[that.posicion].conceptos.push(item);
            });
        }
        Tbl.dataTable({
            data: constructorasModel.servicioscontratados[that.posicion].conceptos,
            columns: [
                {'title': 'Peso', data: 'peso'},
                {'title': 'Concepto ', data: 'concepto'}
            ],
            fnRowCallback: function (fila, item, idx) {

                fila = $(fila);
                fila.find('td:first').html('');
                that.posicicionconcepto = idx;
                var valor = 0;
                $.each(constructorasModel.servicioscontratados[that.posicion].conceptos, function (b, itemb) {
                    if (item.idconcepto === itemb.idconcepto)
                    {
                        valor = constructorasModel.servicioscontratados[that.posicion].conceptos[b].peso;
                    }
                });
                var inputtext = $('<input>').text('').attr({type: 'number', name: 'txtPesoConcepto',
                    data_id: item.idconcepto,
                    value: valor});
                inputtext.on('change', that.calcularSumatoria);
                fila.find('td:first').append(inputtext);
            },
            language: {
                url: '/achagua/js/Spanish.json'
            },
            bSort: false,
            destroy: true
        });
        that.validacion = false;
        that.validarSumatoria();
        that.dialogoActual = divtabServiciosContratosConceptos.dialogo({
            modal: true,
            width: 850,
            title: 'Edicion Conceptos Servicios Contratados',
            buttons: {Guardar: that.guardarConceptos
            }
        });
    },
    /**
     * 
     * @returns {undefined}
     */
    guardarConceptos: function () {
        that.conceptoGlobal = null;
        that.guardar = 1;
        that.valor = 0;
        if (!that.validarContratoEditable())
            return;
        that.validacion = false;
        that.validarSumatoria();
        if (that.validacion) {
            that.dialogoActual.dialog('close');
        }
    },
    /**
     * 
     * @returns {undefined}
     */
    calcularSumatoria: function () {

        if (!that.validarContratoEditable())
            return;

        var ConceptoActualizar = parseInt($(this).attr('data_id'));
        that.conceptoGlobal = ConceptoActualizar;
        that.valor = parseFloat($(this).val());
        var valor_maximo = parseFloat($('div#divTablaConceptosliquidacionServiciosContratados input#txtporcentajeDistribucionmaximo').val());
        if (that.valor < 0 || that.valor > valor_maximo)
        {
            $(this).val("0");
            $('#pmensajeConceptosliquidacion').text('No se permiten valores Negativos');
            return
        }

        if (that.valor > valor_maximo)
        {
            $(this).val("0");
            $('#pmensajeConceptosliquidacion').text('Valor ingresado:(' + that.valor + ') supera el total  Máximo:(' + valor_maximo + ')');
            return
        }
        that.validacion = false;
        that.validarSumatoria();
        if (that.validacion) {
            $.each(constructorasModel.servicioscontratados[that.posicion].conceptos, function (indice, items)
            {
                if (items.idconcepto === ConceptoActualizar) {
                    constructorasModel.servicioscontratados[that.posicion].conceptos[indice].peso = that.valor;
                }
            });
        } else {
            $(this).val('0');
        }
    },
    /**
     * 
     * @returns {undefined}
     */
    validarSumatoria: function () {
        $('#pmensajeConceptosliquidacion').text('');
        var Sumatoria = that.valor;
        that.validacion = false;
        var botonesconceptos = $('table#tblconceptosliquidacionServiciosContratados tr input[type=number]');
        var valor_maximo = parseFloat($('div#divTablaConceptosliquidacionServiciosContratados input#txtporcentajeDistribucionmaximo').val());
        $.each(constructorasModel.servicioscontratados[that.posicion].conceptos, function (indice, items)
        {
            if (that.conceptoGlobal != constructorasModel.servicioscontratados[that.posicion].conceptos[indice].idconcepto)
            {
                Sumatoria += parseFloat(constructorasModel.servicioscontratados[that.posicion].conceptos[indice].peso);
            }

            if (Sumatoria > valor_maximo || Sumatoria < 0)
            {
                that.validacion = false;
                $('#pmensajeConceptosliquidacion').text("Porcentaje de Distribución:(" + parseFloat(Sumatoria) + ") no acorde a valor de Distribución Máximo:(" + valor_maximo + ") o es inferior a 0");
            } else {
                $('div#divTablaConceptosliquidacionServiciosContratados input#txtsumaporcentajeDistribucion').val(parseFloat(Sumatoria));
                that.validacion = true;
            }
            if (that.guardar === 1 && Sumatoria === valor_maximo) {
                that.validacion = true;
            } else if (that.guardar === 1)
            {
                that.validacion = false;
                $('#pmensajeConceptosliquidacion').text("Porcentaje de Distribución:(" + parseFloat(Sumatoria) + ") es inferior al valor  de Distribución Máximo:(" + valor_maximo + ")");
            }


        });
        that.conceptoGlobal = null;
        that.guardar = 0;

    },
    /**
     * 
     * @returns {undefined}
     */
    editarserviciosContratados: function () {
        that.posicion = parseInt($(this).parent().parent().attr('data-fila'));
        var divAdicionarServiciosContratadosDialogo = $('div#tabAdicionarServiciosContratadosDialogo');
//        divAdicionarServiciosContratadosDialogo.show();
        var divEdicion = $('div#tabServiciosContratadosAdicionar');
//        divEdicion.show();
//       $('div#tabServiciosContratosAdicionarServicios').hide();
//        $('div#tabServiciosContratosAdicionarServiciosTablaSuscripciones').show();
        divEdicion.find('#txtLiquidacion').val(constructorasModel.servicioscontratados[that.posicion].liquidaciontext);
        /*
         * Correccion para mostrar el nombre de la liquidacion correctamente despues de editar un servicio contratado
         */
        constructorasModel.liquidacionseleccionadatext = constructorasModel.servicioscontratados[that.posicion].liquidaciontext;
        constructorasModel.liquidacionseleccionada = constructorasModel.servicioscontratados[that.posicion].liquidacion;
        that.consultarAgenda();
        divEdicion.find('#txtDocumento').val(constructorasModel.servicioscontratados[that.posicion].documento);
        divEdicion.find('#txtTipoDocumento').val(constructorasModel.servicioscontratados[that.posicion].tipoDocumento);
        divEdicion.find('#cboMetodConstructivo').val(constructorasModel.servicioscontratados[that.posicion].metodo);

        divEdicion.find('#txtpeso').val(constructorasModel.servicioscontratados[that.posicion].peso);
        var Tbl = $('#tblServiciosContratadosSuscripcionEditar');
        Tbl.dataTable({
            data: constructorasModel.servicioscontratados[that.posicion].suscripciones,
            columns: [
                {'title': '', data: null},
                {'title': 'Suscriptor', data: 'ternombretercero'},
                {'title': 'Cod. Anterior', data: 'CodAnterior'},
                {'title': 'Direccion', data: 'Direccion'},
                {'title': 'Tipo Suscripcion', data: 'TipSuscripcion'},
                {'title': 'Tipo Uso', data: 'TipUso'},
                {'title': 'Estado', data: 'Estado'},
                {'title': 'Ide Propiedad', data: 'IdePropiedad'}
            ],
            fnRowCallback: function (fila, item, idx) {
                fila = $(fila);
                var btn = $('<input>').text('').attr({type: 'button', name: 'btnsel', value: 'Eliminar', class: 'btnSimple', data_id: idx});
                btn.on('click', that.editarserviciosContratadosEliminarSuscripcion);
                fila.find('td:first').html('').append(btn);
            },
            language: {
                url: '/achagua/js/Spanish.json'
            },
            bSort: true,
            destroy: true,
            lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "Todo"]]
        });
        that.AdicionarSuscripcionListaSuscripciones();

        that.dialogoActual = divAdicionarServiciosContratadosDialogo.dialogo({
            modal: true,
            width: 950,
            title: 'Edicion Servicios Contratados',
            buttons: {
                Guardar: that.editarserviciosContratadosGuardar,
                Eliminar: that.editarserviciosContratadosEliminarServicioContratado
            }
        });
    },
    editarserviciosContratadosGuardar: function () {
        if (!that.validarContratoEditable())
            return;
        /*
         * Inclusion de validacion de Negativos a la hora de editar los servicios contratados
         */
        if (!that.validarServicioContratado('E'))
            return;

        that.DatosEditar = {};
        that.DatosEditar.suscripciones = [];
        var suscripcionesseleccionables = $('table#tblvinvularSuscripciones tbody input[type=checkbox]:checked');

        $.each($(suscripcionesseleccionables), function (i, item) {
            var suscripcion = -1;
            suscripcion = $(item).attr('data_id');

            var pos = constructorasControl.indexSuscripcion(suscripcion);
            that.DatosEditar.suscripciones.push(constructorasModel.suscripciones[pos]);


        });

        constructorasModel.servicioscontratados[that.posicion].liquidacion = constructorasModel.liquidacionseleccionada;
        constructorasModel.servicioscontratados[that.posicion].liquidaciontext = constructorasModel.liquidacionseleccionadatext;
        constructorasModel.servicioscontratados[that.posicion].documento = $('#txtDocumento').val();
        constructorasModel.servicioscontratados[that.posicion].tipoDocumento = $('#txtTipoDocumento').val();
        constructorasModel.servicioscontratados[that.posicion].metodo = $('#cboMetodConstructivo :selected').val();
        constructorasModel.servicioscontratados[that.posicion].metodotext = $('#cboMetodConstructivo :selected').text();
        constructorasModel.servicioscontratados[that.posicion].agenda = $('#cboAgenda').val();
        constructorasModel.servicioscontratados[that.posicion].agendatext = $('#cboAgenda :selected').text();
        constructorasModel.servicioscontratados[that.posicion].peso = $('#txtpeso').val();

        $.each(that.DatosEditar.suscripciones, function (i, item) {
            constructorasModel.suscripcionesrelacionadas.push(that.DatosEditar.suscripciones[i]);
            constructorasModel.servicioscontratados[that.posicion].suscripciones.push(that.DatosEditar.suscripciones[i]);

        });



        that.cargarTablaServiciosContratados();
        that.dialogoActual.dialog('close');
    },
    editarserviciosContratadosEliminarSuscripcion: function () {
        if (!that.validarContratoEditable())
            return;
        var fila = $(this).attr('data_id');
        $.each(constructorasModel.suscripcionesrelacionadas, function (i, item) {
            if (constructorasModel.servicioscontratados[that.posicion].suscripciones[fila].susidesuscripcion === item.susidesuscripcion)
            {
                if (constructorasModel.servicioscontratados[that.posicion].suscripciones[fila].sco_ideregistro != undefined)
                {
                    constructorasModel.suscripcionesEliminar.push(constructorasModel.servicioscontratados[that.posicion].suscripciones[fila].sco_ideregistro);
                }
                constructorasModel.suscripcionesrelacionadas.splice(i, 1);
            }

        });
        constructorasModel.servicioscontratados[that.posicion].suscripciones.splice(fila, 1);
        that.AdicionarSuscripcionListaSuscripciones();
        that.cargarTablaServiciosContratados();
        that.dialogoActual.dialog('close');
    },
    editarserviciosContratadosEliminarServicioContratado: function () {
        if (!that.validarContratoEditable())
            return;
        $.each(constructorasModel.servicioscontratados[that.posicion].suscripciones, function (i, item) {
            $.each(constructorasModel.suscripcionesrelacionadas, function (y, item2) {
                if (item.susidesuscripcion === item2.susidesuscripcion)
                {
                    constructorasModel.suscripcionesrelacionadas.splice(y, 1);
                }

            });
        });
        if (constructorasModel.servicioscontratados[that.posicion].uco_ideregistro != undefined) {
            constructorasModel.servicioscontratadosEliminar.push(constructorasModel.servicioscontratados[that.posicion].uco_ideregistro);
        }
        constructorasModel.servicioscontratados.splice(that.posicion, 1);
        that.cargarTablaServiciosContratados();
        that.dialogoActual.dialog('close');
    },
    /**
     * Invoca la petición al controlador con el parametro de opcion = INF y el codigo de la liquidación seleccionada , lo cual condiciona el controlador a buscar todos 
     * los campos adicionales relacionados a la liquidación 
     * @returns {void}
     */
    cargarCamposInformacionAdiconalServicios: function () {
        that.posicion;
        that.posicion = parseInt($(this).parent().parent().attr('data-fila'));
        var Datos = {};
        Datos.opcion = "INF";
        Datos.liquidacion = constructorasModel.servicioscontratados[that.posicion].liquidacion;
        constructorasControl.consultaParametrosServiciosContratados(Datos, that.mostrarCamposInformacionAdicionalServicios);
    },
    /** 
     * Muestra en seccion de formulario los campos parametrizados con Adicionales a la Liquidacion seleccionada en los servicios
     * contratados 
     * @param {type} Liquidacion 
     * @returns {void}
     */
    mostrarCamposInformacionAdicionalServicios: function (Data) {
        if (Data.codigoRespuesta == -1)
        {
            __dom.lanzarAlerta(Data.mensaje, "Error");
            return;
        }
        that.Datos = Data.datos;
        var DivContenedor = $('div#divInformacionAdicionalLiquidacion');
        $('#pMensajeInformacionAdicional').text('');
        __dom.CrearObjHtml(Data, DivContenedor);
        if (constructorasModel.servicioscontratados[that.posicion].informacionAdicional === undefined)
        {
            constructorasModel.servicioscontratados[that.posicion].informacionAdicional = [];
        } else if (constructorasModel.servicioscontratados[that.posicion].informacionAdicional[0] !== undefined)
        {
            $.each(Data.datos, function (i, item) {
                var valorcampo = "";
                var valoresMultiple = [];
                var cont = 0;
                $.each(constructorasModel.servicioscontratados[that.posicion].informacionAdicional, function (c, itemc) {
                    if (item.tipoideregistro === itemc.tipoideregistro)
                    {
                        valoresMultiple[cont] = itemc.informacion;
                        valorcampo = itemc.informacion;
                        cont++;
                    }
                });
                if (cont > 1) {
                    $('#' + item.tipoideregistro).val(valoresMultiple);
                } else {
                    $('#' + item.tipoideregistro).val(valorcampo);
                }
            });
        }
        that.dialogoActual = DivContenedor.dialogo({
            modal: true,
            width: 850,
            title: 'Informacion Adicional Servicios Contratados',
            buttons: {guardar: that.mostrarCamposInformacionAdicionalServiciosGuardar}
        });
    },
    /**
     *  Valida la información que se ingresa en los campos adicionales incluyendo aquellos que estan vinculados a una expresión regular ,
     *  si se cumplen todas las condiciones requeridas carga la información al modelo Js 
     * @returns {void}
     */
    mostrarCamposInformacionAdicionalServiciosGuardar: function () {
        if (!that.validarContratoEditable())
            return;
        var continuar = true;
        var informacionAdicional = [];
        $.each(that.Datos, function (i, item) {
            var valorValidar = $('#' + item.tipoideregistro).val();
            var expresionRegular = $('#' + item.tipoideregistro).attr('expresion_regular');
            if ((item.obligatorio === 'S') && (valorValidar === '' || valorValidar === null))
            {
                continuar = false;
                $('#pMensajeInformacionAdicional').text("EL campo " + item.tiponombre + " es obligatorio");
                $('#' + item.tipoideregistro).focus();
                return false;
            }
            if (item.restringe === 'S' && expresionRegular != undefined)
            {
                var expregular = new RegExp(expresionRegular);
                continuar = expregular.test(valorValidar);
                if (!continuar)
                {
                    $('#pMensajeInformacionAdicional').text("EL campo " + item.tiponombre + " No cumple expresion Regular Ejemplo:(" + $('#' + item.tipoideregistro).attr('placeHolder') + ")");
                    $('#' + item.tipoideregistro).focus();
                    return false;
                }
            }
            if (continuar) {
                if (Array.isArray($("#" + item.tipoideregistro).val())) {
                    $.each($("#" + item.tipoideregistro).val(), function (v, valor) {
                        var DataVariable = {};
                        DataVariable.tipoideregistro = item.tipoideregistro;
                        DataVariable.informacion = valor;
                        DataVariable.estado = 'A';
                        DataVariable.iddetalle = valor;
                        DataVariable.liquidacion = constructorasModel.servicioscontratados[that.posicion].liquidacion;
                        DataVariable.nombre = item.tiponombre;
                        informacionAdicional.push(DataVariable);
                    });
                } else {
                    var DataVariable = {};
                    DataVariable.tipoideregistro = item.tipoideregistro;
                    DataVariable.informacion = $("#" + item.tipoideregistro).val();
                    DataVariable.estado = 'A';
                    DataVariable.liquidacion = constructorasModel.servicioscontratados[that.posicion].liquidacion;
                    DataVariable.nombre = item.tiponombre;
                    informacionAdicional.push(DataVariable);
                }
            }
        });
        if (continuar) {
            constructorasModel.servicioscontratados[that.posicion].informacionAdicional = [];
            constructorasModel.servicioscontratados[that.posicion].informacionAdicional = informacionAdicional;
            __dom.lanzarAlerta(" Información Adicional Registrada Completamente ");
            that.dialogoActual.dialog('close');
        }
    },
    validarContratoEditable: function () {
        var Edicion = true;
        $.each(constructorasModel.estadoContratoNoEditable, function (i, item) {
            if (constructorasModel.estadoContrato === item.id)
            {
                __dom.lanzarAlerta("Contrato seleccionado no es Editable Estado: " + item.id);
                Edicion = false;
            }
        });
        return Edicion;
    },
    subirCompleto: function (e, data) {
        $('#pMensaje').html('');
        switch (parseInt(data.response.codigoRespuesta)) {
            case 0:
                break;
            case 1:
                for (var i = 0; i < data.response.documentosadjuntos.length; i++) {
                    var archivo = data.response.documentosadjuntos[i].idarchivo;
                    constructorasModel.archivos.push({idarchivo: archivo});
                }
                that.mostrarArchivos(data.response.documentosadjuntos);
                break;
        }
    },
    mostrarArchivos: function (data) {

        var div = $('#divArchivos').show();
        $('#divArchivos').html('');
        for (var i = 0; i < data.length; i++) {
            var info = data[i];
            var a = $('<a>').text(info.nombrearchivo).attr('href', info.ruta).
                    attr('target', '_blank').attr('data-id', info.idarchivo);
            var eliminar = $('<button>').on('click', that.eliminarArchivo).addClass('btnSimple').append($('<i>').addClass('fa fa-trash'));
            var archivo = $('<div>').addClass('archivoSubido').append($('<i>').addClass('fa fa-file-pdf-o fa-lg'), a, eliminar);
            div.append(archivo);
        }
    },
    eliminarArchivo: function () {
        if (!that.validarContratoEditable())
            return;
        var _this = $(this);
        var id = _this.parent().children(':first').next().attr('data-id');
        $('div#divEliminarArchivo').dialogo({
            resizable: false,
            heigth: 140,
            modal: true,
            title: 'Eliminar archivo',
            buttons: {
                "Sí": function () {
                    $(this).dialog('close');
                    constructorasControl.eliminarArchivo({accion: 'E', idarchivo: id}, function (data) {
                        if (data.codigoRespuesta == 1) {
                            for (var i = 0; i < constructorasModel.archivos.length; i++) {
                                var archivo = constructorasModel.archivos[i];
                                if (archivo.idarchivo === id) {
                                    constructorasModel.archivos.splice(i, 1);
                                }
                            }
                            ;
                            _this.parent().remove();
                        }
                    });
                }, Cancelar: function () {
                    $(this).dialog("close");
                }
            }
        });
    },
    formatoMoneda: function (nombreSelector) {
        $('#' + nombreSelector).inputmask('decimal',
                {'alias': 'numeric',
                    'groupSeparator': '.',
                    'autoGroup': true,
                    'digits': 2,
                    'radixPoint': ",",
                    'digitsOptional': false,
                    'allowMinus': false,
                    'prefix': '$ ',
                    'placeholder': '0'
                });

    },
    depurarCamposNumericos: function (campo) {
        var valor = $('#'
                + campo).val();
        valor = valor.replace(/\./g, "");
        valor = valor.replace(/\,/g, ".");
        valor = valor.replace("$ ", "");
        valor = valor.replace("$", "");
        if (valor == "")
            valor = 0;
        return valor;
    },
    validarFechaMayor: function (FechaA, FechaB) {

        var afechaA = FechaA.split("/");
        var afechaB = FechaB.split("/");
        var rfechaA = afechaA[1] + "/" + afechaA[2] + "/" + afechaA[0];
        var rfechaB = afechaB[1] + "/" + afechaB[2] + "/" + afechaB[0];
        var validacion = true;
        /*
         * Require en formato mm/dd/YYYY
         */
        if (Date.parse(rfechaA) < Date.parse(rfechaB))
        {
            validacion = false;
        }

        return validacion;
    },
    
    
    ActualizarDetallePago: function () {
        $('#pMensajevalorcontrato').html('');
        var poranticipo = parseFloat(that.depurarCamposNumericos('txtPorcentajePagoAnticipo'));
        var porpagoparcial1 = parseFloat(that.depurarCamposNumericos('txtPorcentajePagoPagoParcial1'));
        var porpagoparcial2 = parseFloat(that.depurarCamposNumericos('txtPorcentajePagoPagoParcial2'));
        var porpagoparcial3 = parseFloat(that.depurarCamposNumericos('txtPorcentajePagoPagoParcial3'));
        //var porpagoparcial = parseFloat(that.depurarCamposNumericos('txtporcentajePagoParcial'));
        var porpagofinal = parseFloat(that.depurarCamposNumericos('txtPorcentajePagoPagoFinal'));

        if (isNaN(poranticipo)) {
            poranticipo = 0;
        }
        /*if (isNaN(porpagoparcial)) {
            porpagoparcial = 0;
        }*/
        
        if (isNaN(porpagofinal)) {
            porpagofinal = 0;
        }

        if (isNaN(porpagoparcial1)) {
            porpagoparcial1 = 0;
        }
        
        if (isNaN(porpagoparcial2)) {
            porpagoparcial2 = 0;
        }
        
        if (isNaN(porpagoparcial3)) {
            porpagoparcial3 = 0;
        }

        if (isNaN(porpagofinal)) {
            porpagofinal = 0;
        }
        
        if (poranticipo != 0)
            $('#txtVlrPagoAnticipo').val(poranticipo / 100 * parseFloat(that.depurarCamposNumericos('txtvalorProyecto')));
        else
            $('#txtVlrPagoAnticipo').val(0);

        /*if (porpagoparcial != 0)
            $('#txtvalorPagoParcial').val(porpagoparcial / 100 * parseFloat(that.depurarCamposNumericos('txtvalorProyecto')));
        else
            $('#txtvalorPagoParcial').val(0);*/

        if (porpagoparcial1 != 0)
            $('#txtVlrPagoPagoParcial1').val(porpagoparcial1 / 100 * parseFloat(that.depurarCamposNumericos('txtvalorProyecto')));
        else
            $('#txtVlrPagoPagoParcial1').val(0);

        if (porpagoparcial2 != 0)
            $('#txtVlrPagoPagoParcial2').val(porpagoparcial2 / 100 * parseFloat(that.depurarCamposNumericos('txtvalorProyecto')));
        else
            $('#txtVlrPagoPagoParcial2').val(0);
        
        if (porpagoparcial3 != 0)
            $('#txtVlrPagoPagoParcial3').val(porpagoparcial3 / 100 * parseFloat(that.depurarCamposNumericos('txtvalorProyecto')));
        else
            $('#txtVlrPagoPagoParcial3').val(0);
        
        if (porpagofinal != 0)
            $('#txtVlrPagoFinal').val(porpagofinal / 100 * parseFloat(that.depurarCamposNumericos('txtvalorProyecto')));
        else
            $('#txtVlrPagoFinal').val(0);
        
        let TotPorcPago = poranticipo + porpagoparcial1 + 
        porpagoparcial2 + porpagoparcial3 + porpagofinal;

        if(TotPorcPago>100){
            __dom.lanzarAlerta("Sobreasignación porcentual del pago", "Error");
        }
        
        $("#txtPorcentajePagoTotal").val(TotPorcPago);
        

        var anticipo = parseFloat(that.depurarCamposNumericos('txtVlrPagoAnticipo'));
        var pagoparcial1 = parseFloat(that.depurarCamposNumericos('txtVlrPagoPagoParcial1'));
        var pagoparcial2 = parseFloat(that.depurarCamposNumericos('txtVlrPagoPagoParcial2'));
        var pagoparcial3 = parseFloat(that.depurarCamposNumericos('txtVlrPagoPagoParcial3'));
        //var pagoparcial = parseFloat(that.depurarCamposNumericos('txtvalorPagoParcial'));
        var pagofinal = parseFloat(that.depurarCamposNumericos('txtVlrPagoFinal'));
        if (isNaN(anticipo))
            anticipo = 0;
        //if (isNaN(pagoparcial))
        //    pagoparcial = 0;
        if (isNaN(pagoparcial1))
            pagoparcial1 = 0;
        if (isNaN(pagoparcial2))
            pagoparcial2 = 0;
        if (isNaN(pagoparcial3))
            pagoparcial3 = 0;
        if (isNaN(pagofinal))
            pagoparcial = 0;
        
        //$('#txtsaldoNegocio').val(parseFloat(anticipo + pagoparcial + pagofinal));
        $('#txtVlrPagoTotal').val(parseFloat(anticipo + pagoparcial1 + pagoparcial2 + pagoparcial3 + pagofinal));

        /*if (parseFloat(poranticipo + porpagoparcial + porpagofinal) !== 100)
        {
            $('#pMensajevalorcontrato').html('No se ha Asignado el 100% del valor del Negocio en los pagos , porcentaje distribuido:' + parseFloat(poranticipo + porpagoparcial + porpagofinal));
            return false;
        } else
            return true;*/
        if (parseFloat(poranticipo + porpagoparcial1 + porpagoparcial2 + porpagoparcial3 + 
                porpagofinal) !== 100){
            
            $('#pMensajevalorcontrato').html('No se ha Asignado el 100% del valor \n\
                del Negocio en los pagos, porcentaje distribuido:' + parseFloat(poranticipo + 
                porpagoparcial1 + porpagoparcial2 + porpagoparcial3 + porpagofinal));
            return false;
        } else
            return true;
    },
    
    
    ActualizarAvanceGeneral: function () {
        $('#pMensajevalorcontrato').html('');
        var porAvanceAnticipo = parseFloat(that.depurarCamposNumericos('txtPorcentajeAvanceAnticipo'));
        var porAvanceParcial1 = parseFloat(that.depurarCamposNumericos('txtPorcentajeAvancePagoParcial1'));
        var porAvanceParcial2 = parseFloat(that.depurarCamposNumericos('txtPorcentajeAvancePagoParcial2'));
        var porAvanceParcial3 = parseFloat(that.depurarCamposNumericos('txtPorcentajeAvancePagoParcial3'));
        var porAvanceFinal = parseFloat(that.depurarCamposNumericos('txtPorcentajeAvancePagoFinal'));

        if (isNaN(porAvanceAnticipo)) {
            porAvanceAnticipo = 0;
        }
        
        if (isNaN(porAvanceParcial1)) {
            porAvanceParcial1 = 0;
        }
        
        if (isNaN(porAvanceParcial2)) {
            porAvanceParcial2 = 0;
        }
        
        if (isNaN(porAvanceParcial3)) {
            porAvanceParcial3 = 0;
        }
        
        if (isNaN(porAvanceFinal)) {
            porAvanceFinal = 0;
        }

        $("#txtPorcentajeAvanceTotal").val(Math.max(porAvanceAnticipo,porAvanceParcial1, 
                porAvanceParcial2, porAvanceParcial3,porAvanceFinal));
        
        if (parseFloat(Math.max(porAvanceAnticipo, porAvanceParcial1, porAvanceParcial2, 
                porAvanceParcial3, porAvanceFinal)) !== 100){
            
            $('#pMensajevalorcontrato').html('No se ha Asignado el 100% del \n\
                valor del Negocio en los avances , porcentaje distribuido:' + parseFloat(porAvanceAnticipo + porAvanceParcial1 + porAvanceParcial2 + 
                porAvanceParcial3 + porAvanceFinal));
            return false;
        } else
            return true;
    },
    
    /*consultarProyectosPadre: function () {
        constructorasControl.consultarProyectosPadre(constructorasModel.suscriptor, that.mostrarResultadoProyectosPadre);
    },
    mostrarResultadoProyectosPadre: function (data) {
        var cmbPryPadre = $('#cmbPryPadre');

        if (data.datos.length === 0) {
            return false;
        }
        cmbPryPadre.html('');
        var OpcionesHtml = '<option value="-1">Proyecto Padre</option>';
        $.each(data.datos, function (j, obj) {
            OpcionesHtml += "<option value=" + obj.gco_numcontrato + ">" + obj.gco_numcontrato + ' ' + obj.gco_objeto + "</option>";
        });
        cmbPryPadre.html(OpcionesHtml);
    },*/
    validarPermisosGrabar: function () {
        var data = {idPrograma: 48};
        constructorasControl.consultarPermisosGrabar(data, that.ResultadoPermisosGrabar);
    },
    /** Captura la respuesta del servidor  cuando se consultan si usuario tiene permisos de grabación
     * @param {object} Data - Respuesta del servidor si usuario tiene permisos de grabación
     * @returns {void}
     * Oscar Baquero
     **/
    ResultadoPermisosGrabar: function (data) {

        switch (data.codigorespuesta) {
            case 1:
                constructorasModel.permisosEdicion = 1;
                if (constructorasModel.estadoContrato === 'T') {
                    $('#btnGrabar').attr('disabled', 'disabled');
                }
                break;
            case 0:
                constructorasModel.permisosEdicion = -1;
                $('#btnGrabar').attr('disabled', 'disabled');
                $('#btnModificar').hide();
                break;
            case -1:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                break;

            default:

                break;
        }
    },
    modificarConstructora: function () {
        if (!constructorasModel.permisosEdicion == 1) {
            __dom.lanzarAlerta('No tiene permisos para Modificar', __app.mensajes.atencion);
            return;
        }
        if (constructorasModel.estadoContrato !== 'T') {
            __dom.lanzarAlerta('Error, solo se modifica cuando contrato ha sido transladado', __app.mensajes.atencion);
            return;
        }
//        console.log(constructorasModel.polizas);
//        console.log(constructorasModel.archivos);
//        console.log(constructorasModel.polizaseliminar);
//        console.log(constructorasModel.contactos);
//        console.log(constructorasModel.contactoseliminar);
        var divInformacionContraactual = $('div#divInformacionContraActual');
        var informacionContrato = {};
        informacionContrato.idecontrato = constructorasModel.contratoideregistro;
        informacionContrato.contrato = divInformacionContraactual.find('input#txtContrato').val();
        informacionContrato.FechaActaIncio = divInformacionContraactual.find('input#txtFechaActaIncio').val();
        informacionContrato.FechaActaFin = divInformacionContraactual.find('input#txtFechaActaFin').val();
        //        console.log(informacionContrato);

        var datos = {};
        datos.contratoideregistro = constructorasModel.contratoideregistro;
        datos.contratos = informacionContrato;
        datos.contactos = constructorasModel.contactos;
        datos.idConstructora = constructorasModel.constructoraseleccionada;
        if (constructorasModel.polizas.length > 0) {
            datos.polizas = constructorasModel.polizas;
        }
        if (constructorasModel.archivos.length > 0) {
            datos.archivos = constructorasModel.archivos;
        }
        constructorasControl.actualizarInformacionContrato(datos, that.ResultadoActualizarInformacionContrato);

    },
    ResultadoActualizarInformacionContrato: function (data) {
        alert("llego algo");
//        console.log(data.contactos[0].nombreContacto);

    },
   validaPesoConceptos:function(){
        var tableServiciosContratados = $('table#tblServiciosContratados tbody tr');
        
        for(var i = 0; i < tableServiciosContratados.length; i++ ){
            var pesoServicio = 0;
        
            if(constructorasModel.servicioscontratados[i].conceptos == undefined){
                __dom.lanzarAlerta("El porcentaje del peso de los conceptos por servicio no es Igual al Contratado" );
                return false;
            }
            pesoServicio = constructorasModel.servicioscontratados[i].peso;    
            console.log(pesoServicio);
            var pesoConcepto = 0;
            for(var is = 0; is < constructorasModel.servicioscontratados[i].conceptos.length; is++){
                console.log(pesoConcepto);    
                console.log(constructorasModel.servicioscontratados[i].conceptos[is].peso);
                pesoConcepto = pesoConcepto + parseFloat(constructorasModel.servicioscontratados[i].conceptos[is].peso);
            }
                if(pesoConcepto !== parseFloat(pesoServicio)){
                    __dom.lanzarAlerta("El porcentaje del peso de los conceptos por servicio no es Igual al Contratado" );
                    return false;
                }
        }        
        
        return true;
    }        
};
constructorasVista.init();
