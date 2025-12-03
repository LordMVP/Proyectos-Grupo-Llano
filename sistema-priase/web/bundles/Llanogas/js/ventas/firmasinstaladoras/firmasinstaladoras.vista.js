/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var that = null
var firmasinstaladorasVista = {
    init: function () {
        that = this;
        var DivComandos = $('div#divComandos');
        DivComandos.find('#btnBuscar').on('click', that.buscar);
        DivComandos.find('#btnGrabar').on('click', that.grabar);
        DivComandos.find('#btnCancelar').on('click', that.cancelar);
        $('#btnAdicionarEmpleado').on('click', that.adicionarEmpleadosCertificaciones);
        __dom.configurarTextoNumerico('txtCodigo');
        __dom.configurarCalendario('txtVigenciaInicial, #txtVigenciaFinal, #txtVigenciaInicialSIC, #txtVigenciaFinalSIC');
        $('#txtVigenciaInicial').on('change', that.configurarFechaFin);
        __dom.configurarTextoNumerico('txtCodigo', false, true, true);
        __dom.configurarTextoNumerico('txtCodigoSIC', false, true, true);
        $('#txtNombreEmpleado').on('blur',that.cambiarMayuscula);
        that.autocompletarTercero();
        that.cargaCboCompetencias();
        that.validarPermisosGrabar();
    },
    /** Configurar que la fecha final no sea menos a la de inicio
     * @returns {void}
     */
    configurarFechaFin: function() {
        var _this = $(this);
        var fi = new Date(_this.val().replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3"));
        $('#txtVigenciaFinal').datepicker('option', 'minDate', fi).val('');
    },
    /** Permite hacer la búsqueda de un tercero por su nombre
     * @returns {void}
     */
    buscar: function () {
        $('#txtNombre').removeAttr('disabled');
        $('#txtNombre').focus();
    },
    /** Válida la información a guardar y hace petición ajax para grabar la firma instaladora
     * @returns {void}
     */
    grabar: function () {
        if (firmasinstaladorasModelo.tercero == null || firmasinstaladorasModelo.tercero == '')
        {
            __dom.lanzarAlerta(__app.mensajes.seleccionarTercero, __app.mensajes.atencion);
            return;
        }
        firmasinstaladorasModelo.empleadoscertificacionesGrabar = [];
        var colaboradorCertificaciones = {};
        var Data = {};
        $.each(firmasinstaladorasModelo.empleadoscertificaciones, function (i, item) {

            colaboradorCertificaciones = {};
            colaboradorCertificaciones.fin_vigencia = item.cofi_finvigencia;
            colaboradorCertificaciones.idregistro = item.cofi_ideregistr;
            colaboradorCertificaciones.inicio_vigencia = item.cofi_inivigencia;
            colaboradorCertificaciones.nit_empleado = item.cofi_nitempleado;
            colaboradorCertificaciones.nombre_empleado = item.cofi_nomempleado;
            colaboradorCertificaciones.competencia = item.idcompetencia;
            colaboradorCertificaciones.tercero = item.ter_ideregistro;
            colaboradorCertificaciones.codigosic = item.cofi_codigosic;
            colaboradorCertificaciones.inicio_vigenciasic = item.cofi_inivigenciasic;
            colaboradorCertificaciones.fin_vigenciasic = item.cofi_finvigenciasic;

            firmasinstaladorasModelo.empleadoscertificacionesGrabar.push(colaboradorCertificaciones);
        });
        Data.colaboradorcertificacion = firmasinstaladorasModelo.empleadoscertificacionesGrabar;
        firmasinstaladorasControl.grabar(Data, that.mostrarresultadoGrabar);
    },
    /** Captura la respuesta del servidor cuando se graba la firma instaladora
     * @param {object} Data - Respuesta del servidor cuando se graba
     * @returns {void}
     **/
    mostrarresultadoGrabar: function (Data) {
        if (Data.codigorespuesta === 1){
            __dom.lanzarAlerta(Data.mensaje, "Respuesta Exitosa", that.recargar);
        } else{
            __dom.lanzarAlerta(Data.mensaje, "Error");
        }
    },
    /** Confirma si el usuario desea cancelar la operación actual
     * @return{void}
     **/
    cancelar: function () {
        __dom.lanzarAlerta(__app.mensajes.confirmacionCancelacion, "Confirmar", that.recargar)
    },
    /** Recarga la página actual
     * @returns {void}
     **/
    recargar: function () {
        location.reload();
    },

    /** Configura la caja de texto para consultar terceros
     * @returns {void}
     **/
    autocompletarTercero: function () {
        $('#txtNombre').autocomplete({
            source: that.sourceAutoCompleteTercero,
            minLength: 3,
            select: function (event, ui) {
                $('input#txtNombre').val(ui.item ? ui.item.value : '');
                $('input#txtNit').val(ui.item ? ui.item.documento : '');
                $('input#txtTipo').val(ui.item ? ui.item.tipotercero : '');
                $('input#txtTelefonoFijo').val(ui.item ? ui.item.telefonofijo : '');
                $('input#txtTelefonoCelular').val(ui.item ? ui.item.telefonocelular : '');
                firmasinstaladorasModelo.tercero = ui.item.idVal;
                if (firmasinstaladorasModelo.tercero != null)
                {
                    var Data = {};
                    Data.tercero = firmasinstaladorasModelo.tercero;
                    firmasinstaladorasControl.consultarEmpleadosCertificaciones(Data, that.mostrarEmpleadosCertificaciones);
                }
            },
            open: function () {
                $(this).removeClass("ui-corner-all").css('z-index', '999999999');
            }
        });
    },
    /** Hace petición ajax para consultar las firmas instaladoras 
     * @param {request} 
     * @returns {void}
     **/
    sourceAutoCompleteTercero: function (request, response) {
        that.request = request;
        that.response = response;
        var datos = {};
        datos.nombre = request.term;
        firmasinstaladorasModelo.tercero = null
        firmasinstaladorasModelo.empleadoscertificaciones = [];
        firmasinstaladorasControl.autocompletartercero(datos, that.mostrarResultadoTercero);
    },
    /** Captura la respuesta del servidor cuando se consultan terceros 
     * @param {object} data - Respuesta del servidor con información de terceros
     * @returns {void}
     **/
    mostrarResultadoTercero: function (Data)
    {
        if (Data.codigorespuesta === 1){
            var result = [];
            $.each(Data.terceros, function (i, item) {
                result.push({
                    label: item.nombretercero,
                    value: item.nombretercero,
                    idVal: item.idtercero,
                    documento: item.documento,
                    telefonofijo: item.telefonofijo,
                    telefonocelular: item.telefonocelular,
                    tipotercero: item.tipotercero
                });
            });
            that.response(result);
        }
    },
    /** Captura la respuesta del servidor cuando se consultan empleados de una firma
     * @param {object} Data - Respuesta del servidor con empleados de la firma instaladora seleccionada
     * @returns {void}
     **/
    mostrarEmpleadosCertificaciones: function (Data) {
        if (Data.codigorespuesta == 1)
        {
            firmasinstaladorasModelo.empleadoscertificaciones = Data.empleadoscertificaciones;
            that.cargaTablaEmpleadosCertificaciones();
        } else
        {
            __dom.lanzarAlerta(Data.mensaje, "Notificación");
        }
    },
    /** Carga la tabla de empleados con la información consultada por firma 
     * @returns {void}
     **/
    cargaTablaEmpleadosCertificaciones: function () {
        var divEmpleadosCertificaciones = $('div#EmpleadosCertificaciones');
        var tablaEmpleadosCertificaciones = fillTable("tblEmpleadosCertificaciones", "formatoEmpleadosCertficaciones", "firmasinstaladorasModelo.empleadoscertificaciones", "");
        divEmpleadosCertificaciones.fadeIn(400);
        tablaEmpleadosCertificaciones.find('tbody tr').on('click', that.eventoSobreFilaEmpleadosCertificaciones);
    },
    /** Evento cuando clickean sobre una fila de la tabla de empleados 
     * y carga la información de la fila en cajas de texto para su edición
     * @returns {void}
     **/
    eventoSobreFilaEmpleadosCertificaciones: function () {
        that.fila = $(this).attr('data-fila');
        var div = $('div#edicionEmpleadosCertificaciones');
        var firma = firmasinstaladorasModelo.empleadoscertificaciones[that.fila];
        div.find('#pMensaje').html('');
        div.find('#txtCodigo').val(firma.cofi_nitempleado);
        div.find('#txtNombreEmpleado').val(firma.cofi_nomempleado);
        div.find('#cboCompetencia').val(firma.idcompetencia);
        div.find('#txtVigenciaInicial').val(firma.cofi_inivigencia);
        div.find('#txtVigenciaFinal').val(firma.cofi_finvigencia);
        div.find('#txtCodigoSIC').val(firma.cofi_codigosic);
        div.find('#txtVigenciaInicialSIC').val(firma.cofi_inivigenciasic);
        div.find('#txtVigenciaFinalSIC').val(firma.cofi_finvigenciasic);
        that.dialogoActual = div.dialogo({
            modal: true,
            width: 850,
            title: 'Edición Firmas Instaladoras',
            buttons: {Modificar: that.modificarEmpleadosCertificaciones , 
                      Adicionar: that.guardaradicionarEmpleadosCertificaciones
            }
        });
    },
    /** Valida la información del empleado cuando se está modificando
     * @returns {void}
     **/
    modificarEmpleadosCertificaciones: function () {
        $('#pMensaje').html('');
        var Resultados = that.validacionDatosEmpleadosCertificaciones();
        if (!Resultados.validacion)
        {
            $('#pMensaje').html("Falta diligenciar el campo :" +  $('label[for="' + Resultados.campo + '"]').html());
            $('#' + Resultados.campo).focus();
            return false;
        }

        var divEdicion = $('div#edicionEmpleadosCertificaciones');
        var fila = firmasinstaladorasModelo.empleadoscertificaciones[that.fila];
        fila.cofi_nitempleado = divEdicion.find('#txtCodigo').val();
        fila.cofi_nomempleado = divEdicion.find('#txtNombreEmpleado').val();
        fila.idcompetencia = parseInt(divEdicion.find('#cboCompetencia').val());
        fila.nombrecompetencia = divEdicion.find('#cboCompetencia :selected').text();
        fila.cofi_inivigencia = divEdicion.find('#txtVigenciaInicial').val();
        fila.cofi_finvigencia = divEdicion.find('#txtVigenciaFinal').val();
        fila.cofi_codigosic = divEdicion.find('#txtCodigoSIC').val();
        fila.cofi_inivigenciasic = divEdicion.find('#txtVigenciaInicialSIC').val();
        fila.cofi_finvigenciasic = divEdicion.find('#txtVigenciaFinalSIC').val();
        that.cargaTablaEmpleadosCertificaciones();
        that.dialogoActual.dialog('close');
    },
    /** Abre cuadro de diálogo para hacer la adición de un nuevo empleado
     * @returns {void}
     **/
    adicionarEmpleadosCertificaciones: function () {
        $('#pMensaje').html('');
        if (firmasinstaladorasModelo.tercero == null) {
            __dom.lanzarAlerta(__app.mensaje.seleccionarTercero, __app.mensajes.atencion);
            return;
        }
        var divedicionEmpleadosCertificaciones = $('div#edicionEmpleadosCertificaciones');
        var campos = divedicionEmpleadosCertificaciones.find('input[type=text], select');
        $.each(campos, function (i, item) {
            $(item).val('');
        });
        that.dialogoActual = divedicionEmpleadosCertificaciones.dialogo({
            modal: true,
            width: 850,
            title: 'Adición empleados y certificaciones',
            buttons: {guardar: that.guardaradicionarEmpleadosCertificaciones
            }
        });
    },
    /** Valida la información del nuevo empleado a adicionar en caso de ser correcta es agregado
     * @returns {void}
     **/
    guardaradicionarEmpleadosCertificaciones: function () {
        var Resultados = that.validacionDatosEmpleadosCertificaciones();
        if (!Resultados.validacion)
        {
            $('#pMensaje').html("Falta diligenciar el campo :" + $('label[for="' + Resultados.campo + '"]').html());
            $('#' + Resultados.campo).focus();
            return false;
        }

        var Data = {};
        var divedicionEmpleadosCertificaciones = $('div#edicionEmpleadosCertificaciones');
        Data.cofi_ideregistr = null;
        Data.cofi_nitempleado = divedicionEmpleadosCertificaciones.find('#txtCodigo').val();
        Data.cofi_nomempleado = divedicionEmpleadosCertificaciones.find('#txtNombreEmpleado').val();
        Data.idcompetencia = parseInt(divedicionEmpleadosCertificaciones.find('#cboCompetencia').val());
        Data.cofi_inivigencia = divedicionEmpleadosCertificaciones.find('#txtVigenciaInicial').val();
        Data.cofi_finvigencia = divedicionEmpleadosCertificaciones.find('#txtVigenciaFinal').val();
        Data.cofi_codigosic = divedicionEmpleadosCertificaciones.find('#txtCodigoSIC').val();
        Data.cofi_inivigenciasic = divedicionEmpleadosCertificaciones.find('#txtVigenciaInicialSIC').val();
        Data.cofi_finvigenciasic = divedicionEmpleadosCertificaciones.find('#txtVigenciaFinalSIC').val();
        Data.nombrecompetencia = divedicionEmpleadosCertificaciones.find('#cboCompetencia :selected').text();
        Data.ter_ideregistro = firmasinstaladorasModelo.tercero;
        firmasinstaladorasModelo.empleadoscertificaciones.push(Data);
        that.cargaTablaEmpleadosCertificaciones();
        that.dialogoActual.dialog('close');
    },
    /** Hace petición ajax para consultar las competencias para los empleados
     * @returns {void}
     **/
    cargaCboCompetencias: function () {
        firmasinstaladorasControl.consultarCompetencias(that.mostrarResultadoCompetencias);
    },
    /** Captura la respuesta del servidor  cuando se consultan competencias
     * @param {object} Data - Respuesta del servidor con competencias para empleados
     * @returns {void}
     **/
    mostrarResultadoCompetencias: function (Data) {
        if (Data.codigorespuesta == 1)
        {
            var html = '';
            $('#cboCompetencia').html('');
            $.each(Data.competencias, function (i, item) {
                html += '<option value ="' + item.idcompetencia + '"  >' + item.nombrecompetencia + '</option>';
            });
            $('#cboCompetencia').html(html);
        }
    },
    /** Valida el formulario de adición de empleados
     * @returns {bool} - Booleano si está completo el formulario
     **/
    validacionDatosEmpleadosCertificaciones: function () {
        var resultado = {};
        resultado.validacion = true;
        var divedicionEmpleadosCertificaciones = $('div#edicionEmpleadosCertificaciones');
        var campos = divedicionEmpleadosCertificaciones.find('input[type=text],select');
        $.each(campos, function (i, item) {
            if ($(item).val() == '' || $(item).val() == null)
            {
                resultado.validacion = false;
                resultado.campo = $(item).attr('id');
                return false;
            }
        });
        return resultado;
    },
    cambiarMayuscula : function(){
        $(this).val($(this).val().toUpperCase()) ;
    },
    
    validarPermisosGrabar : function(){
        var data = {idPrograma: 25, idUnidad: 1367};
        firmasinstaladorasControl.consultarPermisosGrabar(data,that.ResultadoPermisosGrabar);
    },
    /** Captura la respuesta del servidor  cuando se consultan si usuario tiene permisos de grabación
     * @param {object} Data - Respuesta del servidor si usuario tiene permisos de grabación
     * @returns {void}
     * Oscar Baquero
     **/
    ResultadoPermisosGrabar:function (data){
        
        switch (data.codigorespuesta) {
            case 0:
                $('#btnGrabar').attr('disabled','disabled');
                $('#btnAdicionarEmpleado').attr('disabled','disabled');
                break;
            case -1:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                break;
               
            default:
                
                break;
        }
    }
};
firmasinstaladorasVista.init();