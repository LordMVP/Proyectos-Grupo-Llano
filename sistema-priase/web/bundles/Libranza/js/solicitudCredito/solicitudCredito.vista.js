/**
 * @fileOverview Archivo de vista y control para registrar una solicitud de crédito
 * @author AppFuture
 * @requires solicitudCredito.control.js
 * @version 1.0.0
 */
/**
 * Objeto que hace referencia al namespace solicitudVista
 * @type {Object}
 */
var that = null;
var solicitudModel = {
    cantidadActividadesEconomicas: 0
};
/* @namespace */
var solicitudVista = {
    alFormato: null,
    alVistoBno: null,
    alDocumento: null,
    alCertificado: null,
    alDesprendible: null,
    boolGuardarStorage: true,
    archivos: [],
    /**
     * Función que inicializa el programa para hacer el registro de una solicitud de crédito
     * Se asigna listeners a campos y funcionalidad para subir archivos.
     * @return {void}
     */
    init: function () {
        that = solicitudVista;
        $('#divTabs').tabs();

        $('#divTabs ul li').on('click', 'a', that.cambiarTipoRegistro);
        __dom.configurarCalendario('txtFechaNacimiento');
        __dom.configurarTextoNumerico($('input:text.number'));
        __dom.configurarColapsable('.divContenedorColapsable');
        __dom.configurarTextoNumerico($('input[data-caja="number"]'));
        __dom.configurarTextoNumerico($('input:text.number-float'), false, true);
        that.configurarFileApploads();
        that.consultarInformacionInicial();
        that.configurarControlesFormulario();
    },
    /**
     * Configura los eventos de los controles del formulario
     * @return {void}
     */
    configurarControlesFormulario: function () {
        //$('#txtMesTiempo').on('blur', that.validarMeses);
        $('#btnGrabar').on('click', that.validarFormulario);
        $('#btnCancelar').on('click', that.limpiarFormulario);
        $('#btnImprimir').on('click', that.imprimirFormulario);
        $('#cmbMunicipio').on('change', that.consultarBarrios);
        $('#btnAgregarActivo').on('click', that.agregarActivo);
        $('#cmbEstadoCivil').on('change', that.validarEstadoCivil);
        $('#cmbTipoVivienda').on('change', that.validarTipoVivienda);
        $('#btnAgregarActividad').on('click', that.agregarActividad);
        $('#cmbDepartamento').on('change', that.consultarMunicipios);
        $('#txtFechaNacimiento').datepicker('option', 'maxDate', '-1D');
        $('#txtMontoSolicitado').on('blur', that.validarMontoSolicitado);
        $('input:text[data-id="gasto"]').on('blur', that.actualizarGastos);
        $('#cmbDepartamentoNacimiento').on('change', that.consultarCiudades);
        $('input:text[data-id="ingreso"]').on('blur', that.actualizarIngresos);
        $("#txtFechaNacimiento").datepicker("option", "yearRange", "-100:+0");
        $('select[data-cargar="paises"]').on('change', that.consultarDepartamentos);
        $('input[data-caja="currency"]').textoNumerico(false, false, true, '$', true);
        $('input:radio[name="rbtnTrabaja"]').on('change', that.validarConyugueTrabaja);
        $('#divValoresFinanciacion input:text[data-caja="number"]').textoNumerico(false, false, true, '$', true);
        $('#btnAgregarRefPersonal, #btnAgregarRefFamiliar').on('click', that.agregarReferencia);
        $('.divColapsable:not(.divColapsable:eq(0), .divColapsable:eq(1))').find('.btnColapsable a').click();
    },
    /** Pide confirmación para eliminar un archivo en caso de ser "Sí"
     * Elimina un archivo de la lista de archivos y hace petición AJAX para eliminar el archivo del servidor.
     * @return {void}
     */
    eliminarArchivo: function () {
        var _this = $(this);
        var id = _this.attr('data-id');
        __dom.lanzarAlerta('Se eliminará el archivo subido ¿Desea continuar?', __app.mensajes.atencion, function () {
            solicitudControl.eliminarArchivo({accion: 'E', idarchivo: id}, function (data) {
                if (data.codigoRespuesta === 1) {
                    var nombreappload = _this.parents().eq(3).prev().prev()[0].id;
                    nombreappload = nombreappload.replace('txtArchivo', 'al');
                    that[nombreappload]['files'] = [];
                    var archivo = solicitudControl.consultarArchivoPorId(id);
                    that.archivos.splice(archivo.indice, 1);
                    $(_this.parents('.file-item')[0]).remove();
                } else {
                    __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                }
            });
        }, true);
    },
    /**
     * Hace petición ajax para consultar la información inicial de combos y radiobuttons
     * @return {void}
     */
    consultarInformacionInicial: function () {
        __cnn.ajax({
            url: '../informacion/',
            completado: that.onConsultarCompleto
        });
    },
    /**
     * Obtiene la respuesta del servidor cuando se consulta la información incial y llena los  combos 
     * que tengan el atributo data-cargar, valida si hay información en localStorage para ser cargada
     * @param {object} data - Arreglos enviados por el servidor con información para llenas combos
     * @return {void}
     */
    onConsultarCompleto: function (data) {
        if (data.codigoRespuesta === 1) {
            var informacion = data.datos;
            var contenedor = $('#contenedor');
            solicitudModel.informacionInicial = informacion;
            that.cargarCorrespondecia(informacion.correspondencia);
            that.cargarExperienciaFinanciera(informacion.experienciafinanciera);
            for (var i in informacion) {
                var jcontrol = contenedor.find('*[data-cargar="' + i + '"]');
                var control = jcontrol[0];
                if (__app.esArreglo(informacion[i]) && control) {
                    if (control.tagName === 'SELECT') {
                        __dom.llenarCombo(jcontrol, informacion[i], control.attributes['data-value'].value, control.attributes['data-text'].value);
                    }
                }
            }
            that.agregarActivo();

            if (localStorage.getItem('form')) {
                that.cargarInfoFormulario(localStorage.getItem('form'));
            } else {
                that.guardarInformacionSesion();
                $('#btnAgregarActividad').click();
                $('#btnAgregarRefPersonal, #btnAgregarRefFamiliar').click();
            }
        }
    },
    /**
     * Carga posibles envíos de correspondencia en radio button
     * @param {array} informacion - Tipos de envíos que se puede hacer
     * @return {void}
     */
    cargarCorrespondecia: function (informacion) {
        for (var x = 0; x < informacion.length; x++) {
            var html = $('<label class="label-enlinea"><input type="radio" name="chckEnvioCorrespondencia" required="required" data-value="' + informacion[x].idunidad + '" data-reference="enviocorrespondencia">' + informacion[x].nombre + '</label>');
            $('#divCorrespondencia').append(html);
        }
    },
    /**
     * Carga las posibles experiencias financieras de una persona en checks
     * @param {array} informacion - Posible experiencia financiera de una persona 
     * @return {void}
     */
    cargarExperienciaFinanciera: function (informacion) {
        for (var j = 0; j < informacion.length; j++) {
            var lbl = $('<div class="campo"><label>' + informacion[j].nombre + '</label><input type="text" maxlength="2" data-caja="number" value="0" data-id="' + informacion[j].idunidad + '"></div>');
            $('#divExperienciaFinanciera').append(lbl);
        }
        __dom.configurarTextoNumerico($('#divExperienciaFinanciera input[data-caja="number"]'));
    },
    /**
     * Valida la pestaña actual para visualizar los soportes a subir
     */
    cambiarTipoRegistro: function (e) {
        var div = $('#divSubirSoportes');
        if (e.target.id === 'aPrincipal') {
            div.show();
        } else {
            div.hide();
        }
    },
    /**
     * Valida que la caja de meses no acepte más de 11 meses 
     * @return {void}
     */
    validarMeses: function () {
        var txt = $('#txtMesTiempo');
        if (parseInt(txt.val()) > 11) {
            txt.val('11').select().focus();
        }
    },
    /**
     * Valida que el moento solicitado sea mayor a 0
     * @returns {void}
     */
    validarMontoSolicitado: function () {
        var _this = $('#txtMontoSolicitado');
        if (isNaN(parseInt(_this.val())) || parseInt(_this.val()) < 1) {
            _this.focus().select().val(1);
        }
    },
    /**
     * Valida que un correo electrónico tenga la estructura correcta
     * @param {string} mail Texto que se validará
     * @return {bool}
     */
    validarCorreoElectronico: function (mail) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        //var re = /^[_a-z0-9-]+(\\.[_a-z0-9-]+)*@[a-z0-9-]+(\\.[a-z0-9-]+)*(\\.[a-z]{2,3})$/
        return re.test(mail);
    },
    /**
     * Valida el estado civil en caso de ser 853 (SOLTERO) no permite ingresar información del conyugue
     * @return {void}
     */
    validarEstadoCivil: function () {
        var _this = $(this);
        var div = $('#divConyugue');
        var campos = div.find('input:text, select, input:radio');
        if (_this.val() === '853') {
            campos.attr('disabled', 'disabled');
            $('[name="rbtnTrabaja"][data-value="N"]').prop('checked', 'checked').change();
        } else {
            campos.removeAttr('disabled');
            $('[name="rbtnTrabaja"][data-value="N"]').prop('checked', 'checked').change();
        }
    },
    /**
     * Valida el estado civil en caso de ser 853 (SOLTERO) no permite ingresar información del conyugue
     * @return {void}
     */
    validarTipoVivienda: function () {
        var _this = $(this);
        var txtArriendo = $('#txtArriendo');
        if (_this.val() !== '867') {
            txtArriendo.val(0);
            txtArriendo.removeAttr('required');
            txtArriendo.attr('disabled', 'disabled');
        } else {
            txtArriendo.removeAttr('disabled');
            txtArriendo.attr('required', "required");
        }
    },
    /**
     * Valida que si el conyugue no trabaja no se pueda diligenciar información de laboral del conyugue
     * @return {void
     */
    validarConyugueTrabaja: function () {
        var _this = $(this);
        var campos = $('#divConyugue input:text[data-info="trabaja-empresa"]');
        if (_this.attr('data-value') === 'N') {
            campos.removeAttr('required');
            campos.attr('disabled', 'disabled');
        } else if (_this.attr('data-value') === 'S') {
            campos.attr('required');
            campos.removeAttr('disabled');
        }
    },
    /**
     * Hace petición ajax para consultar los departamentos de un país
     * es utiliza por el combo de país de nacimiento y país en ubicación
     * @return {void}
     */
    consultarDepartamentos: function () {
        var _this = $(this).val();
        var nameid = this.id !== 'cmbPais' ? 'coddepartamento' : 'iddepartamento';
        var cmb = $(this).parent().next().find('select');
        if (_this !== '-1' && _this) {
            solicitudControl.consultarDepartamentos({idpais: _this}, function (data) {
                if (data.codigoRespuesta === 1 && data.datos.length > 0) {
                    __dom.llenarCombo(cmb, data.datos, nameid, 'nombre');
                    if (cmb.attr('data-valor')) {
                        cmb.val(cmb.attr('data-valor')).change();
                        cmb.removeAttr('data-valor');
                    }
                } else {
                    cmb.empty().change();
                }
            });
        } else {
            cmb.empty().val('-1').change();
        }
    },
    /**
     * Hace petición ajax para consultar las ciudades de un departamento
     * @return {void}
     **/
    consultarCiudades: function () {
        var _this = $(this);
        if (_this.val() && _this.val() !== '-1') {
            solicitudModel.cambiado = _this;
            solicitudControl.consultarCiudades({iddepartamento: _this.val()}, that.onConsultarCiudadesCompleto);
        } else {
            solicitudModel.cambiado = null;
            _this.parent().next().find('select').empty().change();
        }
    },
    onConsultarCiudadesCompleto: function (data) {
        if (data.codigoRespuesta === 1) {
            if (data.datos.length > 0) {
                var _this = solicitudModel.cambiado;
                var control = _this.parent().next().find('select');
                __dom.llenarCombo(control, data.datos, 'idciudad', 'nombre');
                if (control.attr('data-valor')) {
                    control.val(control.attr('data-valor')).change();
                    control.removeAttr('data-valor');
                }
            }
        }
    },
    consultarMunicipios: function () {
        var _this = $(this).val();
        if (_this && _this !== '-1') {
            solicitudControl.consultarMunicipios({iddepartamento: _this}, function (data) {
                if (data.codigoRespuesta === 1 && data.datos.length > 0) {
                    var cmb = $('#cmbMunicipio');
                    __dom.llenarCombo(cmb, data.datos, 'idmunicipio', 'municipio');
                    if (cmb.attr('data-valor')) {
                        cmb.val(cmb.attr('data-valor')).change();
                        cmb.removeAttr('data-valor');
                    }
                } else {
                    $('#cmbMunicipio').empty().change();
                }
            });
        } else {
            $('#cmbMunicipio').empty().change();
        }
    },
    consultarBarrios: function () {
        var _this = $(this).val();
        var cmb = $('#cmbBarrio');
        if (_this && _this !== '-1') {
            var info = {'idmunicipio': _this};
            solicitudControl.consultarBarrios(info, function (data) {
                if (data.codigoRespuesta === 1) {
                    __dom.llenarCombo(cmb, data.datos, 'idbarrio', 'barrio');
                    if (cmb.attr('data-valor')) {
                        cmb.val(cmb.attr('data-valor')).change();
                        cmb.removeAttr('data-valor');
                    }
                }
            });
        } else {
            cmb.empty().change();
        }
    },
    agregarActivo: function () {
        var tbl = $('#tblActivos').show();
        var tr = $('<tr><td><select class="cmbActivo" obligatory="required"></select></td><td><input maxlength="250" type="text"></td><td><input type="text" maxlength="250"></td><td><select class="cmbDep"></select></td><td><select class="cmbCiudad"></select></td><td><input type="text" class="txtValorActivo"></td><td><button tittle="eliminar" class="btnSimple"><i class="fa fa-times"></i></button></td></tr>');
        tr.find('button').on('click', function () {
            var btn = $(this);
            btn.parent().parent().remove();
            if (tbl.find('tbody tr').length === 0) {
                tbl.hide();
            }
        });
        var cmb = tr.find('select.cmbDep');
        cmb.on('change', that.consultarCiudades);
        var cmbActivo = tr.find('select.cmbActivo');
        __dom.llenarCombo(cmbActivo, solicitudModel.informacionInicial.tiposactivos, 'idunidad', 'nombre');
        tr.find('input.txtValorActivo').textoNumerico(false, false, true, '$', true).on('blur', that.calcularActivos);
        __dom.llenarCombo(cmb, solicitudModel.informacionInicial.departamentos, 'coddepartamento', 'nombre').change();
        $('#tblActivos tbody').append(tr);
    },
    calcularActivos: function () {
        var valorActivo = 0;
        var tr = $('#tblActivos tbody tr input.txtValorActivo');
        for (var i = 0; i < tr.length; i++) {
            var dataValor = !isNaN(parseInt($(tr[i]).attr('data-valor'))) ? parseInt($(tr[i]).attr('data-valor')) : false;
            valorActivo += dataValor ? dataValor : (!isNaN(parseInt($(tr[i]).val())) ? parseInt($(tr[i]).val()) : 0);
        }
        $('#txtTotalActivos, #txtTotalActivos1').val(valorActivo.toString().toCurrency()).attr('data-valor', valorActivo);
    },
    agregarActividad: function () {
        var div = $('div#divContenidoActividades');
        var cant = solicitudModel.cantidadActividadesEconomicas++;
        var informacionInicial = solicitudModel.informacionInicial;

        var data = {
            indice: cant,
            //nombreactividad: seleccionado.text(),
            empresas: informacionInicial.empresas,
            tipocargo: informacionInicial.tipocargo,
            //idactividadeconomica: seleccionado.val(),
            tipocontrato: informacionInicial.tipocontrato,
            actividadeseconomicas: informacionInicial.actividadeseconomicas
        };
        $.get('/achagua/sistema/web/bundles/Libranza/template/tplActividadEconomica.html', function (_template) {
            var template = $(_template).filter('#tplActividadEconomica').html();
            var info = $(Mustache.to_html(template, data));
            div.append(info);
            var divPrincipal = div.find('div.divContenedorColapsable:last');
            that.configurarActividad(divPrincipal, cant);
            divPrincipal.find('select[id^="cmbActividad"]').change();
        });
    },
    configurarActividad: function (divPrincipal, complemento) {
        var cmbActividad = divPrincipal.find('select[id^="cmbActividad"]');
        var inputValor = divPrincipal.find('input[data-currency]');
        var inputNumber = divPrincipal.find('input:text.number');
        var linkDelete = divPrincipal.find('a.fa-times');

        __dom.configurarColapsable(divPrincipal);
        __dom.configurarTextoNumerico(inputNumber);
        inputValor.textoNumerico(false, false, true, '$', true);
        __dom.configurarCalendario('fechaIngreso' + complemento);

        linkDelete.off().on('click', that.eliminarCollapsable);
        cmbActividad.on('change', that.actualizarInfoActividad);
        $('#fechaIngreso' + complemento).datepicker('option', 'maxDate', '1');
        divPrincipal.find('.icondeduccion').on('click', function(){that.mostrarDialogoInformativo('Todos los descuentos + Parafiscales');});
        divPrincipal.find('.iconsalarioBasico').on('click', function(){that.mostrarDialogoInformativo('Salario Básico + Auxilio de Transporte.');});
        $('#fechaIngreso' + complemento).datepicker('option', "yearRange", "-100:+0");

        divPrincipal.find('select[id^="cmbEmpresa"]').on('change', that.agregarNitEmpresa).change();
        divPrincipal.find('input:text[id^="txtSalarioBasico"]').on('blur', function(){
            that.actualizarSumatoriaSalario();
            that.actualizarSalarioNeto($(this));
        });
        divPrincipal.find('input:text[id^="txtDeduccionesNomina"]').on('blur', function(){
            that.actualizarSalarioNeto($(this));
        });
    },
    mostrarDialogoInformativo: function(mensaje){
      var _this = $(this);
      if(!mensaje){  
            mensaje = _this.attr('title');
      }
      __dom.lanzarAlerta(mensaje, __app.mensajes.atencion);
    },
    
    actualizarInfoActividad: function () {
        var _this = $(this);
        var div = _this.parents('.divContenedorColapsable:eq(0)');
        var title = div.find('h4.tituloColapsable').text('');

        if (_this.val() !== '-1') {
            title.text(_this.find('option:selected').text());
        }
    },
    /**
     * Valida la empresa seleccionada para visualizar su respectivo nit
     * @return {void}
     */
    agregarNitEmpresa: function () {
        var _this = $(this);
        var txtnit = _this.parent().next().find('input:text');
        if (_this.val() && _this.val() !== '-1') {
            txtnit.val(_this.find('option:selected').attr('data-id'));
        } else {
            txtnit.val('');
        }
    },
    actualizarSalarioNeto: function (_this) {
        var divMayor = _this.parents('div.contenidoColapsable');
        var txtSalarioNeto = divMayor.find('input[id^="txtSalarioNeto"]');
        var txtDeduccion = divMayor.find('input[id^="txtDeduccionesNomina"]');
        var salario = divMayor.find('input[id^="txtSalarioBasico"]').attr('data-valor');
        var deduccion = !isNaN(parseInt(txtDeduccion.attr('data-valor'))) ? parseInt(txtDeduccion.attr('data-valor')) : 0;
        salario = !isNaN(parseInt(salario)) ? parseInt(salario) : 0;
        if (deduccion > salario) {
            txtSalarioNeto.val(0);
            txtDeduccion.val(salario).attr('data-valor', salario).focus().select();
            return;
        }
        var total = salario - deduccion;
        total = isNaN(total) ? 0 : total;
        txtSalarioNeto.val(total).attr('data-valor', total).toTxtCurrency();
    },
    actualizarSumatoriaSalario: function () {
        var _this = $(this);
        var valorSalario = 0;
        _this.parent().next().find('input:text').blur();
        var divActividades = $('#divContenidoActividades');
        var inputSalarios = divActividades.find('input:text[id^="txtSalarioBasico"]');
        for (var i = 0; i < inputSalarios.length; i++) {
            var txt = $(inputSalarios[i]);
            var valorCaja = !isNaN(parseFloat(txt.attr('data-valor'))) ? parseFloat(txt.attr('data-valor')) : 0;
            valorSalario += valorCaja;
        }
        $('#txtSalarioBasico').val(valorSalario)
                .attr('data-valor', valorSalario)
                .blur().toTxtCurrency();
    },
    actualizarIngresos: function () {
        var _this = $(this);
        var TotIngresos = 0;
        var controles = $('input:text[data-id="ingreso"]');
        if (_this[0].tagName === 'INPUT') {
            controles = controles.not(_this);
            TotIngresos += !isNaN(parseInt(_this.val())) ? parseInt(_this.val()) : 0;
        }
        for (var i = 0; i < controles.length; i++) {
            TotIngresos += $(controles[i]).attr('data-valor') ? parseInt($(controles[i]).attr('data-valor')) : 0;
        }

        $('#txtTotalIngresosMes').attr('data-valor', TotIngresos)
                .val(TotIngresos.toString().toCurrency());
    },
    actualizarGastos: function () {
        var TotGastos = 0;
        var _this = $(this);

        var controles = $('input:text[data-id="gasto"]');
        if (_this[0].tagName === 'INPUT') {
            controles = controles.not(_this);
            TotGastos += !isNaN(parseInt(_this.val())) ? parseInt(_this.val()) : 0;
        }
        for (var i = 0; i < controles.length; i++) {
            TotGastos += $(controles[i]).attr('data-valor') ? parseInt($(controles[i]).attr('data-valor')) : 0;
        }
        $('#txtTotalGastos').attr('data-valor', TotGastos)
                .val(TotGastos.toString().toCurrency());
    },
    eliminarCollapsable: function (e) {
        __app.cancelarEvento(e);
        var cambios = 0;
        var _this = $(this);
        var titulo = _this.parent().prev('h4:contains(Referencia)');
        var mensaje = (titulo.length > 0) ? ' referencia ' : 'actividad económica';
        var div = _this.parents('div[required="required"] div.divContenedorColapsable');
        var cuerpo = div.find('input:text');
        for (var x = 0; x < cuerpo.length; x++) {
            cambios += cuerpo[x].value.trim() !== '' ? 1 : 0;
        }
        if (cambios > 0) {
            __dom.lanzarAlerta('Se eliminará la ' + mensaje + ' actual, ¿Desea continuar?', 'Atención', function () {
                div.remove();
            }, true);
            return;
        }
        div.remove();
    },
    agregarReferencia: function () {
        var _this = this;
        var id = _this.id;
        if (id === 'btnAgregarRefFamiliar') {
            var div = $('#divReferenciaFamiliares');
            var cant = div.find('div.divContenedorColapsable').length;
            var data = {
                indice: cant,
                tiporeferencia: 'familiar'
            };
        } else {
            var div = $('#divReferenciaPersonales');
            var cant = div.find('div.divContenedorColapsable').length;
            var data = {
                indice: cant,
                tiporeferencia: 'personal'
            };
        }
        $.get('/achagua/sistema/web/bundles/Libranza/template/tplReferencias.html', function (_template) {
            template = $(_template).filter('#tplReferencias').html();
            var info = $(Mustache.to_html(template, data));
            div.append(info);
            var divPrincipal = div.find('div.divContenedorColapsable:last');
            that.configurarReferencia(divPrincipal);
        });
    },
    configurarReferencia: function (divPrincipal, cargarInformacion, data) {
        var tiporeferencia = divPrincipal.find('.tituloColapsable').attr('data-tipo');
        var infoInicial = solicitudModel.informacionInicial;
        var ocupaciones = infoInicial.profesiones;
        var departamentos = infoInicial.departamentos;
        var parentesco = infoInicial.parentesco;
        
        
        var cmbDepartamento = divPrincipal.find('[id^="cmbDepartamento_"]');
        var cmbParentesco = divPrincipal.find('[id^="cmbParentescoRef_"]');
        var cmbOcupacion = divPrincipal.find('[id^="cmbOcupacion_"]');
        var inputNumber = divPrincipal.find('input:text.number');
        var btnDelete = divPrincipal.find('a.fa-times');

        cmbDepartamento.on('change', that.consultarCiudadesReferencia);
        //Agrega el nombre de la persona que servirá como referencia en el título del colapsable
        divPrincipal.find('input:text[id^="txtNombre"]').on('blur', function () {
            divPrincipal.find('h4 span[data-id="spanNombre"]').text($(this).val());
        });
        divPrincipal.find('input:text[id^="txtApellido"]').on('blur', function () {
            divPrincipal.find('h4 span[data-id="spanApellido"]').text($(this).val());
        });

        __dom.configurarColapsable(divPrincipal);
        __dom.configurarTextoNumerico(inputNumber);
        __dom.llenarCombo(cmbDepartamento, departamentos, 'coddepartamento', 'nombre');
        __dom.llenarCombo(cmbOcupacion, ocupaciones, 'idunidad', 'nombre');
        __dom.llenarCombo(cmbParentesco, parentesco, 'idunidad', 'nombre');
        if(tiporeferencia === 'personal'){
            cmbParentesco.parent().remove();
        }
        btnDelete.off('click').on('click', that.eliminarCollapsable);
        if (cargarInformacion && data) {
            that.cargarInformacionReferencia(data, divPrincipal);
        }
    },
    consultarCiudadesReferencia: function () {
        var _this = $(this);
        if (_this.val() && _this.val() !== '-1') {
            solicitudModel.cambiadoreferencia = _this;
            solicitudControl.consultarCiudades({iddepartamento: _this.val()}, that.onConsultarCiudadesReferencia);
        } else {
            solicitudModel.cambiadoreferencia = null;
            _this.parent().next().find('select').empty();
        }
    },
    onConsultarCiudadesReferencia: function (data) {
        if (data.codigoRespuesta === 1) {
            if (data.datos.length > 0) {
                var _this = solicitudModel.cambiadoreferencia;
                var control = _this.parent().next().find('select');
                __dom.llenarCombo(control, data.datos, 'idciudad', 'nombre');
                if (control.attr('data-valor')) {
                    control.val(control.attr('data-valor')).change();
                    control.removeAttr('data-valor');
                }
            }
        }
    },
    limpiarFormulario: function () {
        __dom.lanzarAlerta('Se borrará toda la información ingresada ¿Desea continuar?', 'Atención', function () {
            that.boolGuardarStorage = false;
            window.location.reload();
            localStorage.removeItem('form');
        }, true);
    },
    imprimirFormulario: function () {
        that.validarFormulario('imprimir');
    },
    validarFormulario: function (accion) {
        var errores = 0;
        var mensaje = '';
        var requeridos = $('#contenedor *[required]');
        for (var i = 0; i < requeridos.length; i++) {
            var control = requeridos[i];
            var jcontrol = $(control);
            var tagname = control.tagName;
            switch (tagname) {
                case 'INPUT':

                    switch (control.type) {
                        case 'radio':
                            var name = control.name;
                            var checked = jcontrol.parent().parent().find('input[name="' + name + '"]:checked');
                            var controllabel = (jcontrol.prev().length > 0) ? jcontrol.prev().siblings('label') : jcontrol.parent().parent().find('label');
                            if (checked.length === 0) {
                                errores++;
                                requeridos = requeridos.not(jcontrol.parent().parent().find('input[name="' + name + '"]'));
                                mensaje += 'Debe seleccionar una opción de <b>' + controllabel.eq(0).text().replace(':', '') + '</b>.<br />';
                                continue;
                            }
                            break;
                        case 'checkbox':
                            var name = control.name;
                            var checked = jcontrol.parent().parent().find('input[name="' + name + '"]:checked');
                            if (checked.length === 0) {
                                mensaje += 'Debe seleccionar al menos una opción de <b>' + jcontrol.prev().siblings('label').eq(0).text().replace(':', '') + '</b>.<br />';
                                errores++;
                                continue;
                            }
                            break;
                        case 'text':
                            if (control.value.trim() === '') {
                                mensaje += 'El campo <b>' + jcontrol.prev().text().replace(':', '') + '</b> es obligatorio.<br />';
                                errores++;
                                continue;
                            }
                            if (control.id === 'txtCorreo' && !that.validarCorreoElectronico(control.value)) {
                                mensaje += 'El campo <b>' + jcontrol.prev().text().replace(':', '') + '</b> no es válido.<br />';
                                errores++;
                                continue;
                            }
                            if (control.id === 'txtMontoSolicitado' && parseInt(jcontrol.attr('data-valor')) < 1) {
                                mensaje += 'El campo <b>' + jcontrol.prev().text().replace(':', '') + '</b> debe ser mayor.<br />';
                                errores++;
                                continue;
                            }
                            break;
                    }

                    break;
                case 'SELECT':
                    if (!control.value || control.value === '-1') {
                        mensaje += 'El campo <b>' + jcontrol.prev().text().replace(':', '') + '</b> es obligatorio.<br />';
                        errores++;
                        continue;
                    }
                    break;
                case 'TABLE':
                    var obligatorios = jcontrol.find('tbody tr td *[obligatory]');
                    for (var x = 0; x < obligatorios.length; x++) {
                        var campo = obligatorios[x];
                        if (campo.tagName === 'SELECT' && (campo.value === '-1' || !campo.value)) {
                            errores++;
                            var indice = $(campo).parent().parent().index();
                            mensaje += 'Verifique la información del <b>activo</b> en la fila ' + indice + '</br>';

                        }
                    }
                    break;
                case 'DIV':
                    if (control.children.length === 0) {
                        mensaje += 'Debe agregar una opción <b>' + jcontrol.prev().prev().find('label').eq(0).text().replace(':', '') + ' </b> <br>'
                        errores++;
                        continue;
                    }
                    var erroresActual = 0;
                    var mensajeActual = '';
                    var obligatorios = $(jcontrol.find('*[obligatory]'));
                    for (var j = 0; j < obligatorios.length; j++) {
                        var campo = obligatorios[j];
                        var error = false;

                        error = (campo.tagName === 'INPUT' && campo.value.trim() === '');
                        error = error || (campo.tagName === 'SELECT' && (!campo.value || campo.value === '-1'));
                        if (error) {
                            mensajeActual += '<span style="margin-left: 15px"> El campo <b>' + $(campo).prevAll('label').text().replace(':', '') + '</b> es obligatorio.<br /> </span>';
                            erroresActual++;
                            errores++;
                            continue;

                        }
                    }
                    if (erroresActual > 0) {
                        mensaje += '<b> ' + jcontrol.prev().prev().find('label').text().replace(':', '') + '</b><br>';
                        mensaje += mensajeActual;
                    }
                    break;
            }
        }
        var booldocumento = that.alDocumento.files.length === 0;
        var boolcertificado = that.alCertificado.files.length === 0;
        var booldesprendible = that.alDesprendible.files.length === 0;

        if ((booldocumento || booldesprendible || boolcertificado) && accion !== 'imprimir') {
            mensaje += 'Hacen falta soportes, verifique que se han subido todos los soportes necesarios.';
            errores++;
        }
        
        if($('#rbtnNo').is(':checked')){
            mensaje += '<p>Para continuar con la solicitud, debe autorizar el tratamiento de datos <b>' + controllabel.eq(0).text().replace(':', '') + '</b>.<p/>';
            errores++;
        }
        
        if (errores > 0) {
            __dom.lanzarAlerta(mensaje, __app.mensajes.atencion);
            return;
        }

        that.guardarObjetoLibranza(typeof accion === 'string' ? accion : 'guardar');
    },
    guardarObjetoLibranza: function (accion) {
        if (!that.boolGuardarStorage) {
            return;
        }
        var data = {};
        var contenedor = $('#contenedor');
        var controles = contenedor.find('*[data-reference]');
        for (var i = 0; i < controles.length; i++) {
            var control = controles[i];
            var tagname = control.tagName;
            var dataId = $(control).attr('data-id');
            switch (tagname) {
                case 'INPUT':
                    switch (control.type) {
                        case 'radio':
                            var name = control.name;
                            var chequeado = $(control).parent().parent().find('input[name="' + name + '"]:checked');
                            data[control.attributes['data-reference'].value] = chequeado.length > 0 ? chequeado.attr('data-value') : '';
                            if (accion === 'imprimir') {
                                data[control.attributes['data-reference'].value] = chequeado.length > 0 ? $(chequeado).parent().text() : '';
                            }
                            break;
                        case 'checkbox':
                            var name = control.name;
                            var chequeados = $(control).parent().parent().find('input[name="' + name + '"]:checked');
                            if (chequeados.length > 0) {
                                data[control.attributes['data-reference'].value] = [];
                                for (var j = 0; j < chequeados.length; j++) {
                                    var obj = (accion === 'imprimir') ? $(chequeados[j]).parent().text() : chequeados[j].attributes['data-value'].value;
                                    data[control.attributes['data-reference'].value].push(obj);
                                }
                            } else {
                                data[control.attributes['data-reference'].value] = '';
                            }
                            break;
                        case 'text':
                            var textoNumerico = ($(control).parents('div#divValoresFinanciacion').length > 0 && $(control).attr('data-caja') === 'number');
                            if ($(control).attr('data-tipo') === "tocurrency" || textoNumerico || $(control).attr('data-caja') === "currency") {
                                var valor = $(control).attr('data-valor');
                                data[control.attributes['data-reference'].value] = !isNaN(parseInt(valor)) ? parseInt(valor) : '0';
                                continue;
                            }
                            data[control.attributes['data-reference'].value] = control.value;
                            break;
                    }
                    break;
                case 'DIV':
                    //data[control.attributes['data-reference'].value] = [];
                    var namereference = control.attributes['data-info'].value;
                    var divchildren = $(control).find('div.divContenedorColapsable');
                    data[control.attributes['data-reference'].value] = that.guardarObjetoDivision(namereference, divchildren, accion);
                    break;
                case 'TEXTAREA':
                    data[control.attributes['data-reference'].value] = control.value;
                    break;
                case 'SELECT':
                    data[control.attributes['data-reference'].value] = (accion === 'imprimir') ? $(control).find('option:selected').text() : control.value;
                    break;
            }
        }

        data.archivos = that.archivos;
        var tblActivos = $('#tblActivos');
        var activos = [];
        if (tblActivos.find('tbody tr').length > 0) {
            var filas = tblActivos.find('tbody tr');
            for (var f = 0; f < filas.length; f++) {
                var fila = $(filas[f]);
                var tdciudad = fila.find('td').eq(4).find('select');
                var tdtipoactivo = fila.find('td').eq(0).find('select');
                var tddepartamento = fila.find('td').eq(3).find('select');
                var valorcomercial = fila.find('td').eq(5).find('input:text');
                var ciudad = (accion === 'imprimir') ? tdciudad.find('option:selected').text() : tdciudad.val();
                var activo = (accion === 'imprimir') ? tdtipoactivo.find('option:selected').text() : tdtipoactivo.val();
                var departamento = (accion === 'imprimir') ? tddepartamento.find('option:selected').text() : tddepartamento.val();
                activos.push({
                    tipoactivo: activo,
                    idciudad: ciudad !== '-1' ? ciudad : '',
                    detalle: fila.find('td').eq(1).find('input').val(),
                    placadireccion: fila.find('td').eq(2).find('input').val(),
                    iddepartamento: departamento !== '-1' ? departamento : '',
                    valorcomercial: (accion === 'imprimir') ? valorcomercial.val() : (valorcomercial.attr('data-valor') ? valorcomercial.attr('data-valor') : 0)
                });
            }
        }

        data.experienciafinanciera = [];
        var divExperiencia = $('#divExperienciaFinanciera div.campo input');
        for (var indiceexperiencia = 0; indiceexperiencia < divExperiencia.length; indiceexperiencia++) {
            var control = $(divExperiencia[indiceexperiencia]);

            var objeto = {
                idproducto: control.attr('data-id'),
                cantidad: !isNaN(parseInt(control.val())) ? control.val() : 0
            };
            if (accion === 'imprimir') {
                objeto.idproducto = control.parent().find('label').text();
            }
            data.experienciafinanciera.push(objeto);
        }

        data.activos = activos;
        localStorage.setItem('form', JSON.stringify(data));
        if (typeof accion === 'string') {
            data.accion = accion;
            that.insertarInformacion(data);
        }
    },
    guardarObjetoDivision: function (namereference, divchildren, accion) {
        var objeto = [];
        for (var k = 0; k < divchildren.length; k++) {
            var informaciondiv = {};
            var camposdiv = $(divchildren[k]).find('*[data-reference-' + namereference + ']');

            for (var j = 0; j < camposdiv.length; j++) {
                var campo = $(camposdiv[j]);
                var tagname = camposdiv[j].tagName;
                switch (tagname) {
                    case 'INPUT':
                        informaciondiv[campo.attr('data-reference-' + namereference)] = campo.val();
                        if (campo.attr('data-currency')) {
                            informaciondiv[campo.attr('data-reference-' + namereference)] = !isNaN(parseInt(campo.attr('data-valor'))) ? campo.attr('data-valor') : '0';
                        }
                        break;
                    case 'SELECT':
                        informaciondiv[campo.attr('data-reference-' + namereference)] = campo.val();
                        if (accion === 'imprimir') {
                            informaciondiv.actividadeconomica = $(divchildren[k]).find('.tituloColapsable').text();
                            informaciondiv[campo.attr('data-reference-' + namereference)] = campo.find('option:selected').text();
                        }
                        break;
                }
            }
            objeto.push(informaciondiv);
        }
        return objeto;
    },
    insertarInformacion: function (data) {
        var nombre = $('#txtPrimerNombre').val() + ' ' + $('#txtPrimerApellido').val() + ' ' + $('#txtSegundoApellido').val();
        nombre = nombre.trim();
        data.tipodocumento = $('#cmbTipoDocumento option:selected').text();
        var infoEnviar = {
            estado: 'R',
            nombre: nombre,
            informacion: data,
            fecha: $('#txtFechaSolicitud').val(),
            documento: $('#txtNumDocumento').val()
        };
        if (data.accion === 'guardar') {
            solicitudControl.insertarInformacion({solicitudCredito: infoEnviar}, that.onGuardarCompleto);
        } else {
            console.log(JSON.stringify(infoEnviar));
            solicitudControl.imprimirFormulario({solicitudCredito: infoEnviar}, that.onImprimirCompleto);
        }

    },
    onImprimirCompleto: function (data) {
        if (data.codigoRespuesta === 1) {
            $('#linkExportar')[0].click();
        }
    },
    onGuardarCompleto: function (data) {
        if (data.codigoRespuesta >= 1) {
            var link = $('#linkExportar');
            link.attr('href', 'http://10.43.51.171:8180/libranza/archivo/exportararchivopdf?solicitud='+data.codigo);
            
            link[0].click();
            var fxRecargar = function () {
                window.location.reload();
                localStorage.removeItem('form');
            };

            __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion, fxRecargar, null, fxRecargar);
        }
    },
    /**
     * Agrega un interval para guardar la información de la solicitud que se está registrando en storage
     * @returns {void}
     */
    guardarInformacionSesion: function () {
        setInterval(that.guardarObjetoLibranza, 1000);
    },
    /**
     * Carga toda la información del local storage
     * @param {object} form - Información guardada en el storage
     * @returns {void}
     */
    cargarInfoFormulario: function (form) {
        var contenedor = $('#contenedor');
        form = JSON.parse(form);
        for (var i in form) {
            var jcontrol = contenedor.find('*[data-reference="' + i + '"]');
            var control = jcontrol[0];
            if (control) {
                if (control.tagName === 'INPUT' || control.tagName === 'TEXTAREA') {
                    switch (control.type) {
                        case 'checkbox':
                            for (var j = 0; j < form[i].length; j++) {
                                for (var k = 0; k < jcontrol.length; k++) {
                                    if (jcontrol[k].attributes['data-value'].value === form[i][j]) {
                                        jcontrol[k].checked = true;
                                        break;
                                    }
                                }
                            }
                            break;
                        case 'radio':
                            for (var k = 0; k < jcontrol.length; k++) {
                                if (jcontrol[k].attributes['data-value'].value === form[i]) {
                                    jcontrol[k].checked = true;
                                    $(jcontrol[k]).change();
                                    break;
                                }
                            }
                            break;
                        default:
                            var valor = form[i];
                            jcontrol.val(valor);
                            if ((jcontrol.parents('div#divValoresFinanciacion').length > 0 && jcontrol.attr('data-caja') === 'number') || control.id === 'txtMontoSolicitado') {
                                valor = (!!valor && parseInt(valor) > 0) ? valor : 0;
                                jcontrol.val(valor.toString().toCurrency()).attr('data-valor', valor);
                            }
                            
                            if(control.id === 'txtTelefonoFijo'){
                                jcontrol.val((!!valor && parseInt(valor) > 0) ? valor : 0);
                            }
                            break;
                    }
                } else if (control.tagName === 'SELECT') {
                    jcontrol.val(form[i]);
                    if (!jcontrol.val()) {
                        jcontrol.attr('data-valor', form[i]);
                    } else {
                        jcontrol.change();
                    }
                } else if (control.tagName === 'TABLE') {
                    if (i === 'activos') {
                        $('#tblActivos tbody').empty();
                        var totActivos = 0;
                        for (var indice = 0; indice < form[i].length; indice++) {
                            $('#btnAgregarActivo').click();
                            that.cargarInformacionActivo(form[i][indice]);
                            totActivos += parseInt(form[i][indice].valorcomercial);
                        }
                        (form[i].length === 0) ? $('#tblActivos').hide() : $('#tblActivos').show();
                        $('#txtTotalActivos, #txtTotalActivos1').val(totActivos.toString().toCurrency());
                    }
                } else if (control.tagName === 'DIV') {
                    jcontrol.empty();
                    if (i === 'referenciafamiliar') {
                        for (var z = 0; z < form.referenciafamiliar.length; z++) {
                            that.agregarReferenciaInformacion(jcontrol, 'familiar', form[i][z]);
                        }
                    }
                    if (i === 'referenciapersonal') {
                        for (var z = 0; z < form[i].length; z++) {
                            that.agregarReferenciaInformacion(jcontrol, 'personal', form[i][z]);
                        }
                    }
                    if (i === 'actividadeconomica') {
                        if (form[i].length === 0) {
                            $('#btnAgregarActividad').click();
                        }
                        for (var j = 0; j < form[i].length; j++) {
                            //var existe = solicitudControl.validarExistenciaActividadEconomica(form[i], form[i][j]['actividadeconomica'], j);
                            that.agregarActividadCompleto(jcontrol, form[i][j]);
                        }
                    }
                }
            }
        }

        that.actualizarGastos();
        that.actualizarIngresos();
        that.cargarInfoExperiencia(form.experienciafinanciera);
        that.guardarInformacionSesion();
    },
    cargarInfoExperiencia: function (informacion) {
        for (var indice = 0; indice < informacion.length; indice++) {
            var info = informacion[indice];
            $('#divExperienciaFinanciera input[data-id="' + info.idproducto + '"]').val(info.cantidad);
        }
    },
    cargarInformacionActivo: function (item) {
        var fila = $('#tblActivos tbody tr:last');
        var cmbCiudad = fila.find('td').eq(4).find('select');
        fila.find('td').eq(1).find('input').val(item.detalle);
        fila.find('td').eq(0).find('select').val(item.tipoactivo);
        fila.find('td').eq(2).find('input').val(item.placadireccion);
        fila.find('td').eq(3).find('select').val(item.iddepartamento);
        fila.find('td').eq(5).find('input:text').val(item.valorcomercial);
        var ciudad = solicitudControl.consultarCiudadesSyncrono({iddepartamento: item.iddepartamento});
        __dom.llenarCombo(cmbCiudad, ciudad.datos, 'idciudad', 'nombre').val(item.idciudad);
    },
    /**
     * Agrega una división de actividad económica cargada con la información respectiva
     * @param {object} div - División general donde se agregará la referencia (divContenidoActividades)
     * @param {object} data - Información de la activida económica que se carga
     * @return {void}
     */
    agregarActividadCompleto: function (div, data) {
        var cant = solicitudModel.cantidadActividadesEconomicas++;
        var informacionInicial = solicitudModel.informacionInicial;

        var infoTpl = {
            indice: cant,
            empresas: informacionInicial.empresas,
            tipocargo: informacionInicial.tipocargo,
            tipocontrato: informacionInicial.tipocontrato,
            actividadeseconomicas: informacionInicial.actividadeseconomicas
        };
        $.get('/achagua/sistema/web/bundles/Libranza/template/tplActividadEconomica.html', function (_template) {
            var template = $(_template).filter('#tplActividadEconomica').html();
            var info = $(Mustache.to_html(template, infoTpl));
            div.append(info);
            var divPrincipal = div.find('div.divContenedorColapsable:last');
            that.configurarActividad(divPrincipal, cant);

            for (var indice in data) {
                var control = divPrincipal.find('*[data-reference-actividad="' + indice + '"]');
                control.val(data[indice]);
            }
            divPrincipal.find('select[id^="cmbEmpresa"]').val(data.empresaempleado);
            divPrincipal.find('input[id^="txtNIT"]').val(data.nitempresaempleado);
            divPrincipal.find('select[id^="cmbActividad"]').change();
            divPrincipal.find('input[data-currency="true"]').blur();

        });
    },
    /**
     * Agrega una división de referencias para cargar la información de la misma
     * @param {object} div - División general donde se agregará la referencia (divReferenciaFamiliares - divReferenciaPersonales)
     * @param {string} tiporeferencia (personal - familiar)
     * @param {object} data - Información de la referencia que se carga
     * @return {void}
     */
    agregarReferenciaInformacion: function (div, tiporeferencia, data) {
        var cant = $(div).find('div.divContenedorColapsable').length;
        var infoTpl = {
            indice: cant,
            tiporeferencia: tiporeferencia
        };
        $.get('/achagua/sistema/web/bundles/Libranza/template/tplReferencias.html', function (_template) {
            var template = $(_template).filter('#tplReferencias').html();
            var info = $(Mustache.to_html(template, infoTpl));
            div.append(info);
            var divPrincipal = div.find('div.divContenedorColapsable:last');
            that.configurarReferencia(divPrincipal, true, data);
        });
    },
    /**
     * Carga la información de una referencia personal o familiar en una división
     * @param {object} data - Información que se cargará
     * @param {object} div - División donde se carga la información
     * @return {void}
     */
    cargarInformacionReferencia: function (data, div) {
        var tipo = $(div).find('.tituloColapsable').attr('data-tipo');
        for (var c in data) {
            var campo = $(div).find('div.contenidoColapsable:last *[data-reference-referencia="' + c + '"]');
            if (campo) {
                campo.val(data[c]);
                if (c.startsWith('departamento')) {
                    campo.attr('data-valor', data[c]);
                    var ciudades = solicitudControl.consultarCiudadesSyncrono({iddepartamento: data[c]});
                    __dom.llenarCombo(campo.parent().next().find('select'), ciudades.datos, 'idciudad', 'nombre');
                }
            }
        }
        div.find('span[data-id="spanNombre"]').text(data['nombrereferencia' + tipo]);
        div.find('span[data-id="spanApellido"]').text(data['apellidoreferencia' + tipo]);
    },
    configurarFileApploads: function () {
        var es = {
            versionError: 'Appload.js no es compatible con esta versión del navegador.',
            labelInput: 'Seleccionar archivos',
            fileTypesErrorDeclaration: 'Los tipos de archivos deben ser declarados de tipo String o Array. Definición de tipo indefinida',
            removeAllFilesBtn: 'Remover todos los archivos',
            uploadAllFilesBtn: 'Subir todos los archivos',
            singleUploadBtn: 'Subir este archivo',
            singleDiscardBtn: 'Descartar este archivo',
            singleDownloadBtn: 'Descargar este archivo',
            singleDeleteBtn: 'Borrar este archivo del servidor',
            fileNotExists: 'El archivo seleccionado no existe o está corrupto',
            notEspecifiedURL: 'Debe especificar una URL',
            errorUploadingFile: 'Ocurrió un problema al subir los archivos',
            uploading: 'Cargando...',
            fileTypeError: 'El archivo no se pudo subir, error de tipo, ',
            mustSelectFile: 'Debe seleccionar al menos un archivo',
            uploadComplete: 'Los archivos se han subido correctamente',
            filesNotLoaded: 'Hay <b>#</b> archivos que no se pueden cargar.<br />',
            allowedExtensions: 'Solo están permitodos archivos con extensión <b>#</b>.<br />',
            fileSizeExceeded: 'Los archivos no pueden exceder los <b>#Kb.</b><br>',
            summaryFileErrors: '<br>Estos son los archivos con errores:'
        };

        var apploadconfig = {
            lg: es,
            url: 'adjuntar/',
            multiple: false,
            autoUpload: true,
            showErrors: true,
            traceErrors: true,
            showDeleteBtn: true,
            maxSize: (1024 * 1024) * 3,
            showDownloadBtn: true,
            showUploadButton: false,
            showFilesSummary: false,
            showDiscardButton: false,
            showSingleUploadBtn: false,
            showSingleDiscardButton: true,
            fileTypes: ['doc', 'docx', 'pdf', 'jpg', 'png', 'opt']
        };

        that.alFormato = new Appload('#txtArchivoFormato', apploadconfig);
        that.alDocumento = new Appload('#txtArchivoDocumento', apploadconfig);
        that.alCertificado = new Appload('#txtArchivoCertificado', apploadconfig);
        that.alDesprendible = new Appload('#txtArchivoDesprendible', apploadconfig);
        that.alCentralRiesgo = new Appload('#txtArchivoCentralRiesgo', apploadconfig);
        that.alVistoBno = new Appload('#txtArchivoVistoBno', apploadconfig);

        that.alFormato.addListener('onsingleupload', function (data) {
            data = data.data;
            var containerAppload = that.alFormato.container;
            if (data.codigoRespuesta === 1) {
                that.archivos.push({tipo: 'Formato', archivo: data.archivos[0], idarchivo: data.archivos['idarchivo']});
                containerAppload.find('.files-list .span-uploading').remove();

                containerAppload.find('button.appload-btn-upload').attr('disabled', 'disabled');
                containerAppload.find('button.appload-btn-discard').attr('disabled', 'disabled');
                var descargarBtn = containerAppload.find('.appload-btn-download').removeAttr('disabled');
                var eliminarBtn = containerAppload.find('button.appload-btn-delete').removeAttr('disabled');
                eliminarBtn.attr('data-id', data.archivos['idarchivo']);
                descargarBtn.attr('data-url', data.archivos[0].ruta);
                eliminarBtn.on('click', that.eliminarArchivo);
            } else {
                containerAppload.find('.appload-btn-discard').removeAttr('disabled');
                __dom.lanzarAlerta('No se pudo subir el archivo, intente nuevamente', __app.mensajes.atencion);
            }
        });
        that.alFormato.addListener('onFileSelected', function (data) {
            that.alFormato.singleUpload(data.data);
        });

        that.alDocumento.addListener('onsingleupload', function (data) {
            data = data.data;
            var containerAppload = that.alDocumento.container;
            if (data.codigoRespuesta === 1) {
                that.archivos.push({tipo: 'Documento', archivo: data.archivos[0], idarchivo: data.archivos['idarchivo']});
                containerAppload.find('.files-list .span-uploading').remove();

                containerAppload.find('button.appload-btn-upload').attr('disabled', 'disabled');
                containerAppload.find('button.appload-btn-discard').attr('disabled', 'disabled');
                var descargarBtn = containerAppload.find('.appload-btn-download').removeAttr('disabled');
                var eliminarBtn = containerAppload.find('button.appload-btn-delete').removeAttr('disabled');
                eliminarBtn.attr('data-id', data.archivos['idarchivo']);
                descargarBtn.attr('data-url', data.archivos[0].ruta);
                eliminarBtn.on('click', that.eliminarArchivo);
            } else {
                containerAppload.find('.appload-btn-discard').removeAttr('disabled');
                __dom.lanzarAlerta('No se pudo subir el archivo, intente nuevamente', __app.mensajes.atencion);
            }
        });
        that.alDocumento.addListener('onFileSelected', function (data) {
            that.alDocumento.singleUpload(data.data);
        });

        that.alCertificado.addListener('onsingleupload', function (data) {
            data = data.data;
            var containerAppload = that.alCertificado.container;
            if (data.codigoRespuesta === 1) {
                that.archivos.push({tipo: 'CertLab', archivo: data.archivos[0], idarchivo: data.archivos['idarchivo']});
                containerAppload.find('.files-list .span-uploading').remove();
                containerAppload.find('button.appload-btn-upload').attr('disabled', 'disabled');
                containerAppload.find('button.appload-btn-discard').attr('disabled', 'disabled');
                var descargarBtn = containerAppload.find('.appload-btn-download').removeAttr('disabled');
                var eliminarBtn = containerAppload.find('button.appload-btn-delete').removeAttr('disabled');
                eliminarBtn.attr('data-id', data.archivos['idarchivo']);
                descargarBtn.attr('data-url', data.archivos[0].ruta);
                eliminarBtn.on('click', that.eliminarArchivo);
            } else {
                containerAppload.find('.appload-btn-discard').removeAttr('disabled');
                __dom.lanzarAlerta('No se pudo subir el archivo, intente nuevamente', __app.mensajes.atencion);
            }
        });
        that.alCertificado.addListener('onFileSelected', function (data) {
            that.alCertificado.singleUpload(data.data);
        });

        that.alDesprendible.addListener('onsingleupload', function (data) {
            data = data.data;
            var containerAppload = that.alDesprendible.container;
            if (data.codigoRespuesta === 1) {
                that.archivos.push({tipo: 'DespPago', archivo: data.archivos[0], idarchivo: data.archivos['idarchivo']});
                containerAppload.find('.files-list .span-uploading').remove();
                containerAppload.find('button.appload-btn-upload').attr('disabled', 'disabled');
                containerAppload.find('button.appload-btn-discard').attr('disabled', 'disabled');
                var descargarBtn = containerAppload.find('.appload-btn-download').removeAttr('disabled');
                var eliminarBtn = containerAppload.find('button.appload-btn-delete').removeAttr('disabled');
                eliminarBtn.attr('data-id', data.archivos['idarchivo']);
                descargarBtn.attr('data-url', data.archivos[0].ruta);
                eliminarBtn.on('click', that.eliminarArchivo);
            } else {
                containerAppload.find('.appload-btn-discard').removeAttr('disabled');
                __dom.lanzarAlerta('No se pudo subir el archivo, intente nuevamente', __app.mensajes.atencion);
            }
        });
        that.alDesprendible.addListener('onFileSelected', function (data) {
            that.alDesprendible.singleUpload(data.data);
        });


        that.alVistoBno.addListener('onsingleupload', function (data) {
            data = data.data;
            var containerAppload = that.alVistoBno.container;
            if (data.codigoRespuesta === 1) {
                that.archivos.push({tipo: 'VistoBno', archivos: data.archivos[0], idarchivo: data.archivos['idarchivo']});
                containerAppload.find('.files-list .span-uploading').remove();
                containerAppload.find('button.appload-btn-upload').attr('disabled', 'disabled');
                containerAppload.find('button.appload-btn-discard').attr('disabled', 'disabled');
                var descargarBtn = containerAppload.find('.appload-btn-download').removeAttr('disabled');
                var eliminarBtn = containerAppload.find('button.appload-btn-delete').removeAttr('disabled');
                eliminarBtn.attr('data-id', data.archivos['idarchivo']);
                descargarBtn.attr('data-url', data.archivos[0].ruta);
                eliminarBtn.on('click', that.eliminarArchivo);
            } else {
                containerAppload.find('.appload-btn-discard').removeAttr('disabled');
                __dom.lanzarAlerta('No se pudo subir el archivo, intente nuevamente', __app.mensajes.atencion);
            }
        });
        that.alVistoBno.addListener('onFileSelected', function (data) {
            that.alVistoBno.singleUpload(data.data);
        });
        that.alCentralRiesgo.addListener('onsingleupload', function (data) {
            data = data.data;
            var containerAppload = that.alCentralRiesgo.container;
            if (data.codigoRespuesta === 1) {
                that.archivos.push({tipo: 'Centrales', archivos: data.archivos[0], idarchivo: data.archivos['idarchivo']});
                containerAppload.find('.files-list .span-uploading').remove();
                containerAppload.find('button.appload-btn-upload').attr('disabled', 'disabled');
                containerAppload.find('button.appload-btn-discard').attr('disabled', 'disabled');
                var descargarBtn = containerAppload.find('.appload-btn-download').removeAttr('disabled');
                var eliminarBtn = containerAppload.find('button.appload-btn-delete').removeAttr('disabled');
                eliminarBtn.attr('data-id', data.archivos['idarchivo']);
                descargarBtn.attr('data-url', data.archivos[0].ruta);
                eliminarBtn.on('click', that.eliminarArchivo);
            } else {
                containerAppload.find('.appload-btn-discard').removeAttr('disabled');
                __dom.lanzarAlerta('No se pudo subir el archivo, intente nuevamente', __app.mensajes.atencion);
            }
        });
        that.alCentralRiesgo.addListener('onFileSelected', function (data) {
            that.alCentralRiesgo.singleUpload(data.data);
        });
    }
};

solicitudVista.init();
