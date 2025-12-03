/**
 * @fileOverview Archivo de vista y control de contabilizar concepto
 * @author appFuture
 * @requires contabilizarConcepto.control.js
 * @requires contabilizarConcepto.modelo.js
 * @version 1.0.0
 */
/**
 * Objeto que hace referencia al namespace contabilizarVista
 * @type {Object}
 */
var that = null;

/** @namespace */
var contabilizarVista = {
    /** Hace referencia al último dialogo abierto en la aplicación
     * @type {object}
     */
    dialogoActual: null,
    /** Inicializa el programa de contabilizar concepto, y asigna listeners a los controles
     * @returns {void}
     */
    init: function () {
        that = contabilizarVista;
        $('#divPenstanias').tabs();
        that.consultarDocumentos();
        that.configurarAutoComplete();
        $('.porcentaje').val('100');
        $('.porcentaje').on('blur', that.validarPorcentaje);
        $('#btnCancelar').on('click', that.confirmarCancelar);
        __dom.configurarColapsable('.divContenedorColapsable');
        $('#btnGrabar').on('click', that.validarContabilizacion);
        $('#cmbDocumento').on('change', that.validarDocumento);
        $('#btnCancelarArea').on('click', that.limpiarFormularioArea);
        $('#cmbMedioPago').on('change', that.cambiarMedioPagoRecaudo);
        contabilizarControl.consultarEmpresas(that.onConsultarEmpresa);
        $('#cmbTipoDocumento').on('change', that.mostrarOcultarPestañas);
        $('#btnAgregarConceptoFlujo').on('click', that.validarConceptoFlujo);
        $('#cmbMedioPagoCsg').on('change', that.cambiarMedioPagoConsignacion);
        $('input:radio[name="empresa"]').on('change', that.seleccionarEmpresa);
        $('#btnCancelarCentroCostos').on('click', that.limpiarFormularioCentro);
        __dom.configurarTextoNumerico('txtPorcentaje, .porcentaje', false, true);
        $('#btnAgregarConceptoContable').on('click', that.validarConceptoContable);
        $('#btnCancelarContabilizacion').on('click', that.limpiarFormularioContabilizacion);
        $('#btnAgregarDiferenciaFlujo, #btnAgregarConsignacionFlujo').on('click', that.validarConsignacionFlujo);
        $('#btnAgregarConsignacionContable, #btnAgregarDiferenciaContable').on('click', that.validarConsignacionContable);
        $('#btnAgregarArea').on('click', function(){
            var indice = $(this).attr('data-indice');
            that.guardarArea(indice);
        });
        $('#btnAgregarContabilizacion').on('click', function(){
            var _this = $(this);
            var indice = _this.attr('data-indice');
            that.validarEditarContabilizacion(indice);
        });
        $('#btnAgregarCentroCostos').on('click', function(){
            var index = $(this).attr('data-indice');
            that.guardarCentroCosto(index);
        });
    },

    /** Muestra/ oculta las pestañas para hacer la contabilización de un concepto según si 
     * los campos obligatorios ya están completos, en caso de que hayan cambios valida si desea eliminar información actual
     * @returns {void}
     */
    mostrarOcultarPestañas: function(){
        var tipo = $('#cmbTipoDocumento');
        if(contabilizarModelo.cambiosGlobal > 0){
            __dom.lanzarAlerta('Se eliminarán todos los cambios hechos, ¿Desea continuar?', 
                    __app.mensajes.atencion, 
                    function(){
                        that.limpiarFormulario();
                        that.validarTipoDocumento();
                    },
                    function(){
                        tipo.val(contabilizarModelo.tipodocumento);
                        that.validarTipoDocumento();
                        return;
                    });
        }else{
            that.limpiarFormulario();
            that.validarTipoDocumento();
        }
    },

    /** Valida combo tipo de documento y documento para la visualización de las pestañas
     * @returns {void}
     **/
    validarTipoDocumento: function(){
        var tipo = $('#cmbTipoDocumento');
        if(tipo.val() !== '-1' && tipo.val() !== null && tipo.val() !== '' && $('#cmbDocumento').val !== '-1'){
            $('#divPenstanias').show();
            var documento = contabilizarControl.consultarDocumentoPorId($('#cmbDocumento').val());
            if(documento.causacioncontable === 'N'){
                $('#aCausacion').hide();
            }
            if(documento.recaudo === 'N'){
                $('#aRecaudo').hide();
            }
            if(documento.consignacion === 'N'){
                $('#aConsignacion').hide();
            }
                
            contabilizarModelo.tipodocumento = tipo.val();
        }else{
            $('#divPenstanias').hide();
        }
    },
    /** Valida si la contabilización del concepto se hará según la empresa logueada o una con la que se tenga convenio
     * @returns {void}
     **/
    seleccionarEmpresa: function(){
        var rbtn = $('input:radio[name="empresa"]:checked');
        var id = $(rbtn[0]).attr('id');
        contabilizarModelo.tipoempresa = id;
        if(contabilizarModelo.cambiosGlobal > 0){
            __dom.lanzarAlerta('Se eliminarán todos los cambios hechos, ¿Desea continuar?', 
                               __app.mensajes.atencion, 
                               function(){
                                   $('#cmbDocumento, #cmbTipoDocumento').empty();
                                   that.limpiarFormulario();
                                   that.ocultarPorEmpresa(id);
                               }, //Limpiar todas las pestañas
                               function(){
                                   rbtn.prop('checked', false);
                                   $('input:radio').not('input:radio[id="'+contabilizarModelo.tipoempresa+'"]').prop('checked', true);
                                   return;
                               });
        }else{
            that.ocultarPorEmpresa(id);
        }
    },

    /**
     * Limpia los combos de documento y tipo de documento y configura la interfaz de usuario dependiendo de la selección
     * @param  {Number} id Id del radio que dispara la Función
     * @returns {void}
     */
    ocultarPorEmpresa: function(id){
        $('#cmbDocumento, #cmbTipoDocumento').empty();
        $('#divPenstanias').hide();
        if(id === 'rbtnPrincipal'){
            that.consultarDocumentos();
           $('#cmbEmpresa').val('-1').attr('disabled', true);
           $('#aCausacion').show().click();
        }else{
            $('#aRecaudo').click();
            $('#cmbEmpresa').attr('disabled', false);
            $('#aCausacion').hide();
        }
    },
    /** Captura la respuesta del servidor, cuando se consultan empresas y medios de pago.
     * y la información es cargada en los respectivos combos
     * @param  {object} data - El resultado de la petición ajax con empresas del convenio y medios de pago
     * @returns {void}
     */
    onConsultarEmpresa: function(data){
        var span = $('#spanEmpresa').text('');
        switch(data.codigoRespuesta){
            case 0:
                span.text('No hay empresas convenio');
            break;
            case 1: 

                var select = $('#cmbEmpresa').empty();
                var comboMedio = $('#cmbMedioPago').empty();
                var mediosPago = $('#cmbMedioPagoCsg').empty();
                contabilizarModelo.mediosPago = data.mediospago;
                select.on('change', function(){
                    that.consultarDocumentos();
                    $('#cmbTipoDocumento').empty();
                });
                comboMedio.on('change', function(){
                    $('.medio').val(comboMedio.val());
                });

                comboMedio.append(
                    $('<option>').val('-1').text('Seleccione una opción')
                );
                for(var i = 0; i < data.mediospago.length; i++){
                    var medio = data.mediospago[i];
                    if(medio.tipo === 'I'){
                        comboMedio.append($('<option>').val(medio.id).text(medio.nombre));
                    }
                }
                __dom.llenarCombo(mediosPago, data.mediospago, 'id', 'nombre');
                __dom.llenarCombo(select, data.empresasconvenio, 'idempresa', 'empresa_nom');

            break;
        }
    },

    /** Hace petición ajax para consultar conceptos según medio de pago seleccionado
     * @returns {void}
     **/
    cambiarMedioPagoConsignacion: function(){
        var _this = $(this);
        
        if(contabilizarModelo.flujoconsignacion.length > 0 || contabilizarModelo.contableconsignacion.length > 0){
            __dom.lanzarAlerta('Se perderá la información actual, ¿Desea continuar?', __app.mensajes.atencion, 
                        function(){
                            that.limpiarConsignacion();
                            that.validarMedioPagoConsignacion(_this);
                        },
                        function(){
                            _this.val(_this.attr('data-id'));
                        }
            );
        }else{
            that.validarMedioPagoConsignacion(_this);
        }
    },

    /** Verifica el tipo de medio de pago que se a seleccionado para mostrar división en pestaña de consignación
     * @returns {void}
     **/
    validarMedioPagoConsignacion: function(_this){
        var csg = $('#divConsignacionConsginacion');
        var dif = $('#divConsignacionDiferencia');
        if(_this.val() !== '-1'){
            _this.attr('data-id', _this.val());
            var tipo = contabilizarControl.consultarMedioPagoPorId(_this.val());
            var data = {
                iddocumento : $('#cmbDocumento').val(),
                idtipodocumento : $('#cmbTipoDocumento').val(),
                idmediopago : _this.val()
            }
            contabilizarControl.consultarContabilizacionConsignacion(data, that.onConsultarConsignacion);
            if(tipo === 'E'){
                dif.hide();
                csg.show();
            }else if(tipo === 'I'){
                dif.show();
                csg.hide();
            }
        }else{
                dif.hide();
                csg.hide();
        }
    },

    /** Captura la respuesta del servidor cuando se consultan conceptos pestaña recaudos
     * @param {object} data - Respuesta del servidor con conceptos
     * @returns {void}
     **/
     onConsultarConceptoRecaudo: function(data){
        if(data.codigoRespuesta === 1){
            var rec = data.recaudo;
            var comboFlujo = $('#cmbConceptoFlujo').empty();
            var comboContable = $('#cmbConceptoContable').empty();
            contabilizarModelo.flujocontable = rec.flujocontable;
            contabilizarModelo.conceptocontable = rec.conceptocontable;
            that.validarConceptosPorTipo(rec, comboFlujo, comboContable);
            
            that.cargarTablaConceptoFlujo();
            that.cargarTablaConceptoContable();
        }
    },
    /** Captura la respuesta del servidor cuando se consultan conceptos pestaña consignación
     * @param {object} data - Respuesta del servidor con conceptos
     * @returns {void}
     **/
    onConsultarConsignacion: function(data){
        var _this = $('#cmbMedioPagoCsg');
        if(data.codigoRespuesta === 1){
            var info = data.consignacion;
            var comboFlujo = $('#cmbDiferenciaFlujo, #cmbConsignacionFlujo').empty();
            var comboContable = $('#cmbDiferenciaContable, #cmbConsignacionContable').empty();
            that.validarConceptosPorTipo(info, comboFlujo, comboContable);
            var tipo = contabilizarControl.consultarMedioPagoPorId(_this.val());
            if(tipo === 'E'){
                contabilizarModelo.flujoconsignacion = info.consignacion.conceptoflujo;                
                contabilizarModelo.contableconsignacion = info.consignacion.conceptocontable;
            }else{
                contabilizarModelo.flujoconsignacion = info.diferencia.conceptoflujo;                
                contabilizarModelo.contableconsignacion = info.diferencia.conceptocontable;
            }
            that.cargarTablaConsignacionFlujo();
            that.cargarTablaConsignacionContable();
        }
    },
    /** Clasifica los conceptos contables según su tipo 'F' ó 'C' para cargar combos
     * @returns {void}
     **/
    validarConceptosPorTipo: function(data, comboFlujo, comboContable){
        var arrayFlujo = [];
        var arrayContable = [];
        for(var c = 0; c < data.conceptoflujo.length; c++){
            var concepto = data.conceptoflujo[c];
            if(concepto.tipo === 'F'){
                arrayFlujo.push(concepto);
            }else if(concepto.tipo === 'C'){
                arrayContable.push(concepto);
            }
        }
        
        __dom.llenarCombo(comboFlujo, arrayFlujo, 'idflujoconcepto', 'nombre');
        __dom.llenarCombo(comboContable, arrayContable, 'idflujoconcepto', 'nombre');
    },
    /**
     * Hace petición ajax para consultar los documentos de la empresa seleccionada
     * return {void}
     **/
    consultarDocumentos: function () {
        var rbtn = $('input:radio[name="empresa"]:checked');
        var data = {};
        if($(rbtn[0]).attr('id') === 'rbtnConvenio'){
            data.idempresa = $('#cmbEmpresa').val() !== '-1' ? $('#cmbEmpresa').val() : null;
        }
        contabilizarControl.consultarDocumento(data, that.onConsultarDocumento);
    },
    /**
     * Captura la respuesta del servidor cuando se consultan documentos y se muestra en combo
     * @param {object} data - Resultado de petición ajax con documentos según empresa
     * @returns {void}
     **/
    onConsultarDocumento: function (data) {
        var combo = $('#cmbDocumento').empty();
        switch (data.codigoRespuesta) {
            case 1:
                contabilizarModelo.documentos = data.documento;
                __dom.llenarCombo(combo, data.documento, 'iddocumento', 'documento');
                break;
        }
    },
    /**
     * Hace petición ajax para consultar los tipos de documentos según el documento seleccionado
     * valida si se desea eliminar la información actual (si se tiene)
     * return {void}
     **/
    
    validarDocumento: function () {
        var documento = $('#cmbDocumento');
        if(contabilizarModelo.cambiosGlobal > 0){
            __dom.lanzarAlerta('Se eliminarán todos los cambios hechos, ¿Desea continuar?', 
                               __app.mensajes.atencion, 
                               function(){
                                   $('#cmbTipoDocumento').empty();
                                   that.limpiarFormulario();
                               }, //Limpiar todas las pestañas
                               function(){
                                   documento.val(contabilizarModelo.documentoSeleccionado);
                                   that.consultarTipoDocumento();
                                   //documento.val(txtDoc[0].getAttribute('data-id'));
                                   return;
                               });
            return;
        }else{
            that.limpiarFormulario();
            that.consultarTipoDocumento();
        }        
    },
    consultarTipoDocumento: function(){
        var documento = $('#cmbDocumento');
        if (documento.val() !== '-1' && documento.val() !== '' && documento.val() !== null) {
            contabilizarModelo.documentoSeleccionado = documento.val();
            //$('#divPenstanias').show();
            
            var empresa = $('#cmbEmpresa').val() !== '-1' ? $('#cmbEmpresa').val() : '';
            contabilizarControl.consultarTiposDocumento(
                {iddocumento: documento.val(), idempresa: empresa}, 
                that.onConsultarTiposDoc);
        }else{
            $('#cmbTipoDocumento').empty();
            $('#divPenstanias').hide();
            that.limpiarFormulario();
        }
    },
    /** Captura la respuesta del servidor cuando se consultan tipos de documento 
     * @returns {void}
     **/
    onConsultarTiposDoc : function(data){
        switch (data.codigoRespuesta) {
            case 1:
                var combo = $('#cmbTipoDocumento').empty();
                __dom.llenarCombo(combo, data.tipodocumento, 'idtipodocumento', 'tipodocumento')
                if (contabilizarModelo.idtipodoccontablizacion)
                    combo.val(contabilizarModelo.idtipodoccontablizacion);
            break;
        }
    },
    /**
     * Asigna funcionalidad a cajas de texto para autocompletar con sus respectivas propiedades y recursos.
     * @returns {void}
     */
    configurarAutoComplete: function () {

        __dom.configurarAutocomplete(
            '#txtNombreConcepto',
            that.sourceAutoComplete, 
            function (event, ui) {
                $('input#txtNombreConcepto').val(ui.item.value);
                contabilizarModelo.idConcepto = ui.item.idVal;
                that.mostrarConceptoCompleto(ui.item.todo);
                that.limpiarCausacion();
            }, 
            function () {
                that.limpiarCausacion();
               // $('input#txtNombreConcepto').val('');                
                $('#txtAlias, #txtAbreviatura').val('');
                contabilizarModelo.idConcepto = undefined;
            }
        );
        
        __dom.configurarAutocomplete(
            '#txtAreaNegocio', 
            that.sourceAutoCompleteCuentas,
            function (event, ui) {
                $('input#txtAreaNegocio').val(ui.item.value).attr('data-id', ui.item.idcuenta);
                $('input#txtCodigoArea').val(ui.item.idVal).removeClass('campoInvalido');
            }, 
            function (event, ui) {
                $('input#txtAreaNegocio').removeAttr('data-id');
                $('input#txtCodigoArea').val('').removeClass('campoInvalido');
            }
        );
        __dom.configurarAutocomplete(
            '#txtCodigoArea', 
            that.sourceAutoCompleteCodigo, 
            function (event, ui) {
                $('input#txtAreaNegocio').val(ui.item.nombrecuenta).attr('data-id', ui.item.idcuenta);
            }, 
            function (event, ui) {
                $('input#txtAreaNegocio').val('').removeAttr('data-id');
            }
        );
        __dom.configurarAutocomplete(
          '#txtCodigo',   that.sourceAutoCompleteCodigo, 
          function (event, ui) {
              $('input#txtCuenta').val(ui.item.nombrecuenta).attr('data-id', ui.item.idcuenta);
          }, 
          function (event, ui) {
              $('input#txtCuenta').val('').removeAttr('data-id');
          }
        );
        __dom.configurarAutocomplete(
          '#txtCuenta',   that.sourceAutoCompleteCuentas, 
          function (event, ui) {
              $('input#txtCuenta').val(ui.item.value).attr('data-id', ui.item.idcuenta);
              $('input#txtCodigo').val(ui.item.idVal).removeClass('campoInvalido');
          }, 
          function (event, ui) {
              $('input#txtCuenta').removeAttr('data-id');
              $('input#txtCodigo').val('').removeClass('campoInvalido');
          }
        );

        __dom.configurarAutocomplete(
          '#txtCodCentroCosto',   that.sourceAutoCompleteCodigo, 
          function (event, ui) {
              $('input#txtCentroCosto').val(ui.item.nombrecuenta).attr('data-id', ui.item.idcuenta);
          }, 
          function (event, ui) {
              $('input#txtCentroCosto').val('').removeAttr('data-id');
          }
        );

        __dom.configurarAutocomplete(
          '#txtCentroCosto',   that.sourceAutoCompleteCuentas, 
          function (event, ui) {
              $('input#txtCentroCosto').val(ui.item.value).attr('data-id', ui.item.idcuenta);
              $('input#txtCodCentroCosto').val(ui.item.idVal).removeClass('campoInvalido');
          }, 
          function (event, ui) {
              $('input#txtCentroCosto').removeAttr('data-id');
              $('input#txtCodCentroCosto').val('').removeClass('campoInvalido');
          }
        );
    },
    /** Realiza la petición AJAX para consultar los terceros que pueden solicitar financiación 
     * del autocomplete 
     * @returns {void}
     */
    sourceAutoComplete: function (request, response) {
        that.request = request;
        that.response = response;
        var datos = {};
        datos.nombre = request.term;
        contabilizarControl.consultarConceptoNombre(datos, that.mostrarResultado);
    },
    /** Muestra el resultado de la consulta de los conceptos en la lista desplegable.
     * @returns {void}
     */
    mostrarResultado: function (data) {
        switch (data.codigoRespuesta) {
            case 1:
                var result = [];
                $.each(data.conceptos, function (i, item) {
                    result.push({
                        label: item.nombre,
                        value: item.nombre,
                        idVal: item.idconcepto,
                        todo: item
                    });
                });
                that.response(result);
                break;
        }
    },
    /** Realiza la petición AJAX para consultar las cuentas según ...
     * del autocomplete 
     * @returns {void}
     */
    sourceAutoCompleteCuentas: function (request, response) {
        var _this = $(this.element[0]);
        that.request = request;
        that.response = response;
        var datos = {
            nombre: request.term,
            accion: $(_this[0]).attr('data-accion')
        };
        contabilizarControl.consultarCuenta(datos, that.mostrarResultadoCuentas);
    },
    /** Muestra el resultado de la consulta las cuentas en la lista desplegable.
     * @returns {void}
     */
    mostrarResultadoCuentas: function (data) {
        switch (data.codigoRespuesta) {
            case 1:
                var result = [];
                $.each(data.cuentas, function (i, item) {
                    result.push({
                        label: item.nombrecuenta,
                        value: item.nombrecuenta,
                        idVal: item.codigocuenta,
                        idcuenta: item.idcuenta,
                        nombrecuenta: item.nombrecuenta
                    });
                });
                that.response(result);
                break;
        }
    },
    /** Realiza la petición AJAX para consultar las cuentas según ...
     * del autocomplete 
     * @returns {void}
     */
    sourceAutoCompleteCodigo: function (request, response) {
        var _this = $(this.element[0]);
        that.request = request;
        that.response = response;
        var datos = {
            nombre: request.term,
            accion: $(_this[0]).attr('data-accion')
        };
        contabilizarControl.consultarCuenta(datos, that.mostrarResultadoCodigo);
    },
    /** Muestra el resultado de la consulta las cuentas en la lista desplegable.
     * @returns {void}
     */
    mostrarResultadoCodigo: function (data) {
        switch (data.codigoRespuesta) {
            case 1:
                var result = [];
                $.each(data.cuentas, function (i, item) {
                    result.push({
                        label: item.codigocuenta,
                        value: item.codigocuenta,
                        idVal: item.codigocuenta,
                        idcuenta: item.idcuenta,
                        nombrecuenta: item.nombrecuenta
                    });
                });
                that.response(result);
                break;
        }
    },
    /**
     * Hace petición ajax para consultar la contabilización de un concepto
     * return {void}
     **/
    mostrarConceptoCompleto: function (data) {
        $('#txtAlias').val(data.alias).attr('data-alias', data.alias);
        $('#txtAbreviatura').val(data.abreviatura);
    
        contabilizarControl.consultarContabilizacion(
            {
                idconcepto: data.idconcepto,
                iddocumento: $('#cmbDocumento').val(),
                idtipodocumento: $('#cmbTipoDocumento').val()
            }, 
            that.onConsultarContabilizacionCompleto
        );
    },
    /**
     * Captura la respuesta del servidor cuando se consulta causación contable de un concepto
     * la información se mostrada en tablas y respectivo combo
     * @param {object} data - Resultado de petición ajax con causación contable del concepto
     * @returns {void}
     **/
    onConsultarContabilizacionCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                $('#divContenedorCausion').hide();
                that.limpiarFormulario();
                __dom.lanzarAlerta(__app.mensajes.sinResultados, __app.mensajes.atencion);
                break;
            case 1:
                $('#divContenedorCausion').show();
                var contable = data.causioncontable;
                contabilizarModelo.areanegocio = contable.areanegocio;
                contabilizarModelo.contabilizacion = contable.contabilizacion;
                contabilizarModelo.centrocosto = contable.centrocosto;
                __dom.llenarCombo($('#cmbTipoSuscripcion'), contable.tiposuscripcion, 'idtiposuscripcion', 'nombre');
                __dom.llenarCombo($('#cmbDepartamentoCC'), contable.departamentoempresa, 'iddepartamento', 'departamento');
                that.cargarTablaArea();
                that.cargarTablaContabilizacion();
                that.cargarTablaCentroCosto();

                break;
        }
    },
    /**
     * Carga la información de la contabilización de un concepto, información guardada en modelo actual
     * asigna eventos a controles de la tabla
     * @returns {void}
     **/
  
    cargarTablaContabilizacion: function () {
        if (contabilizarModelo.contabilizacion.length > 0) {
            var table = fillTable('tblContabilizacion', formatoContabilizacion, contabilizarModelo.contabilizacion, '');
            table.find('tbody tr td[header="thEditar"] input').on('click', that.abrirEditarContabilizacion);
            table.find('tbody tr td[header="thEliminar"] input').on('click', function(){ 
                
                that.confirmarEliminar($(this), 'contabilizacion');
            });
        }else{
            $('#tblContabilizacion').empty();
        }
    },
    /**
     * Buscar la información de la contabilización que se desea editar
     * @returns {void}
     **/
    abrirEditarContabilizacion: function () {
        var _this = $(this);
        var id = _this.attr('data-id');
        var div = $('#divFormularioCausacion');
        div.find('#spanContabilizacion').text('');
        var indice = parseInt(_this.parent().attr('data-value'));
        div.find('#btnAgregarContabilizacion').text('Editar contabilización');
        
        //Valida que se va a editar ya que puede ser uno existente, creado o para agregar.
        var opcion = !isNaN(parseInt(id)) ?
                contabilizarControl.consultarContabilizacionPorId(id) :
                (!isNaN(indice) ? contabilizarModelo.contabilizacion[indice] : false);
        !!opcion ? that.cargarContabilizacioEditar(opcion.contabilizacion ? opcion.contabilizacion : opcion) : 
                    div.find('input:text').not('#txtDocumento, #txtTipoDocumento').val('');

        div.find('#btnAgregarContabilizacion').attr('data-indice', !!opcion ? opcion.indice : 'N');

    },
    /**
     * Muestra en formulario información de la contabilización para editar
     * @param {object} data - Información de la contabilización a mostrar
     * @returns {void}
     **/
    cargarContabilizacioEditar: function (data) {
        contabilizarModelo.idtipodoccontablizacion = data.idtipodocumento;
        $('#txtCuenta').val(data.cuenta).attr('data-id', data.codigo);
        $('#txtCodigo').val(data.numerocuenta);
        $('#txtPorcentaje').val(data.porcentaje);
        $('#cmbNaturaleza').val(data.naturaleza);
    },
    /**
     * Valida la información de la contabilización a guardar o actualizar en caso de 
     * ser correcta es guardada en el arreglo
     * @param {int} indice -Posición en la que está el objeto a actualizar en el arreglo contabilizarModelo.contabilizacion
     * @returns {void}
     **/
    validarEditarContabilizacion: function (indice) {
        var div = $('#divFormularioCausacion');
        var validacion = that.validarCamposEditar(div);
        if (validacion) {
            var documento = $('#cmbDocumento').val();
            var tipodocumento = $('#cmbTipoDocumento').val();
            var cuenta = div.find('#txtCuenta');
            var codigo = cuenta.attr('data-id');
            var valPorcentaje = parseFloat(div.find('#txtPorcentaje').val());
            var datosCombinacion = {
                codigo: codigo, 
                tabla: that.cargarTablaContabilizacion,
                idenviar: 'idcontabilizacion',
                porcentaje: valPorcentaje, 
                naturaleza: div.find('#cmbNaturaleza').val(),
                index: indice, tipo: 'contabilizacion', span: $('#spanContabilizacion')};
            var validacionCombinacion = that.validarCombinacion(datosCombinacion, contabilizarModelo.contabilizacion);
            if (validacionCombinacion) {
                that.guardarContabilizacionTabla(indice, div, validacionCombinacion);
            }
        } else {
            $('#spanContabilizacion').text('Todos los campos son obligatorios');
        }
    },
    /**
     * Guarda la información de la nueva-actualizada contabilización
     * @param {int} indice - Posición que se va a afectar
     * @param {object} div - División HTML del formulario
     * @returns {void}
     **/
    guardarContabilizacionTabla: function(indice, div, existencia){
        var data = {
            cuenta: div.find('#txtCuenta').val(),
            codigo: div.find('#txtCuenta').attr('data-id'),
            numerocuenta: div.find('#txtCodigo').val(),
            porcentaje: parseFloat(div.find('#txtPorcentaje').val()),
            naturaleza: div.find('#cmbNaturaleza').val(),
            iddocumento: $('#cmbDocumento').val(),
            idtipodocumento: $('#cmbTipoDocumento').val(),
            idconcepto: contabilizarModelo.idConcepto, 
        };
        data.idempresa = $('#cmbEmpresa').val() !== '-1' ? $('#cmbEmpresa').val() : null;
        //Valida si es nueva o actualizada
        var boolExistencia = !isNaN(parseInt(existencia.indice)) || !isNaN(parseInt(existencia.id));
        if (!isNaN(parseInt(indice)) || boolExistencia) {

            if(!isNaN(parseInt(existencia.id))){
                var contabilizacion = contabilizarControl.consultarContabilizacionPorId(existencia.id).contabilizacion;
            }else{
                var contabilizacion = contabilizarModelo.contabilizacion[!isNaN(parseInt(existencia.indice)) ? parseInt(existencia.indice) : indice];    
            }
            
            data.idcontabilizacion = contabilizacion.idcontabilizacion;
            data.indice = contabilizacion.indice;
            data.accion = !isNaN(parseInt(contabilizacion.idcontabilizacion)) ? 'A' : 'I';
            data.porcentaje = (boolExistencia) ? contabilizacion.porcentaje : data.porcentaje;
            //Valida si ya se había hecho cambios sobre la contabilización
            var e = that.validarExistenciaAccion('idcontabilizacion', contabilizacion.idcontabilizacion, indice, contabilizarModelo.accionContabilizacion, data);
            if(e.length === 0 && isNaN(parseInt(existencia.indice))){
                contabilizarModelo.accionContabilizacion.push(data);
            }else{
                contabilizarModelo.cambiosGlobal -= 1;
            }

            contabilizarModelo.contabilizacion[indice] = data;
        } else {
            data.accion = 'I';
            data.idcontabilizacion = 'N';
            data.indice = contabilizarModelo.contabilizacion.length;
            contabilizarModelo.contabilizacion.push(data);
            contabilizarModelo.accionContabilizacion.push(data);
        }

        that.cargarTablaContabilizacion();
        that.limpiarFormularioContabilizacion();
        contabilizarModelo.cambiosGlobal++;
        
    },
    /**
     * Limpia cajas de texto del formulario de la contabilización
     * @retun {void}
     **/
    limpiarFormularioContabilizacion: function(){
      var div = $('#divFormularioCausacion');

      div.find('input:text').val('').removeClass('campoInvalido');
      div.find('#cmbNaturaleza').val('-1');
      div.find('.porcentaje').val('100');
      div.find('#spanContabilizacion').text('');
      div.find('#btnAgregarContabilizacion')
         .attr('data-indice', 'N')
         .text('Agregar contabilización');
    },
    /**
     * Carga la información de area de negocio de un concepto, información guardada en modelo actual
     * asigna eventos a controles de la tabla
     * @returns {void}
     **/
    cargarTablaArea: function () {
        if (contabilizarModelo.areanegocio.length > 0) {
            var table = fillTable('tblAreas', formatoAreaNegocio, contabilizarModelo.areanegocio, '');
            table.find('tbody tr td[header="thEditar"] input').on('click', that.abrirEditarArea);
            table.find('tbody tr td[header="thEliminar"] input').on('click', function(){ 
                that.confirmarEliminar($(this), 'area');
            });
        }else{
            $('#tblAreas').empty();
        }
    },
    /**
     * Buscar la información del área de negocio que se desea editar
     * @returns {void}
     **/
    abrirEditarArea: function () {
        var _this = $(this);
        var id = _this.attr('data-id');
        var div = $('#divFormularioArea');
        var indice = parseInt(_this.parent().attr('data-value'));
        div.find('#spanAreaNegocio').text('');
        div.find('#btnAgregarArea').text('Editar área de negocio');
        
        //Valida que se va a editar ya que puede ser uno existente, creado o para agregar.
        var opcion = !isNaN(parseInt(id)) ?
                contabilizarControl.consultarAreaPorId(id) :
                (!isNaN(indice) ? contabilizarModelo.areanegocio[indice] : false);

        !!opcion ? that.cargarAreaNegocioEditar(opcion.areanegocio ? opcion.areanegocio : opcion) : div.find('input:text').val('');
        div.find('#btnAgregarArea').attr('data-indice', !!opcion ? opcion.indice : 'N');
        
    },
    /**
     * Muestra en formulario información del área de negocio para editar
     * @param {object} data - Información del área de negocio a mostrar
     * @returns {void}
     **/
    cargarAreaNegocioEditar: function (data) {
        var div = $('#divFormularioArea');
        div.find('#cmbTipoSuscripcion').val(data.idtiposusucripcion)
        //.attr('data-id', data.idtiposuscripcion);
        div.find('#txtAreaNegocio').val(data.nombrearea).attr('data-id', data.idcuenta);
        div.find('#txtCodigoArea').val(data.codigoarea);
        div.find('#txtPorcentajeArea').val(data.porcentaje);
    },
     /**
     * Valida la información del área de negocio a guardar o actualizar en caso de 
     * ser correcta es guardada en el arreglo
     * @param {int} indice -Posición en la que está el objeto a actualizar en el arreglo contabilizarModelo.areanegocio
     * @returns {void}
     **/
    guardarArea: function (indice) {
        var div = $('#divFormularioArea');
        var validar = that.validarCamposEditar(div);
        if (validar) {
            var idtiposus = div.find('#cmbTipoSuscripcion').val();
            var idarea = div.find('#txtCodigoArea').val();
            var valPorcentaje = parseFloat(div.find('#txtPorcentajeArea').val());
            var existencia = that.validarCombinacion(
                                {idtiposusucripcion: idtiposus, tabla: that.cargarTablaArea,
                                 codigoarea: idarea, tipo: 'area', idenviar: 'idarea',
                                 span: $('#spanAreaNegocio'), porcentaje: valPorcentaje, index: indice}, 
                                 contabilizarModelo.areanegocio);


            if(!!existencia){

                var data = {
                    idtiposusucripcion: idtiposus,
                    tiposuscripcion: div.find('#cmbTipoSuscripcion option:selected').text(),
                    nombrearea: div.find('#txtAreaNegocio').val(),
                    idcuenta: div.find('#txtAreaNegocio').attr('data-id'),
                    codigoarea: idarea,
                    porcentaje: valPorcentaje,
                    idconcepto: contabilizarModelo.idConcepto
                };
                data.idempresa = $('#cmbEmpresa').val() !== '-1' ? $('#cmbEmpresa').val() : null;
                //Valida si es existente
                var boolExistencia = !isNaN(parseInt(existencia.indice)) || !isNaN(parseInt(existencia.id));
                if (!isNaN(parseInt(indice)) || boolExistencia) {

                    if(!isNaN(parseInt(existencia.id))){
                        var area = contabilizarControl.consultarAreaPorId(existencia.id).areanegocio;
                    }else{
                        var area = contabilizarModelo.areanegocio[!isNaN(parseInt(existencia.indice)) ? parseInt(existencia.indice) : indice];    
                    }


                    data.idareanegocio = area.idareanegocio;
                    data.indice = area.indice;
                    data.accion = !isNaN(parseInt(area.idareanegocio)) ? 'A' : 'I';
                    data.porcentaje = (boolExistencia) ? area.porcentaje : data.porcentaje;
                    var e = that.validarExistenciaAccion('idareanegocio', data.idareanegocio, indice, contabilizarModelo.accionArea, data);
                    if(e.length === 0 && isNaN(parseInt(existencia.indice))){
                        contabilizarModelo.accionArea.push(data);
                    }else{
                        contabilizarModelo.cambiosGlobal -= 1;
                    }
                    contabilizarModelo.areanegocio[indice] = data;
                } else {
                    data.accion = 'I'
                    data.idarea = 'N';
                    data.indice = contabilizarModelo.areanegocio.length;
                    contabilizarModelo.areanegocio.push(data);
                    contabilizarModelo.accionArea.push(data);
                }
                that.cargarTablaArea();
                that.limpiarFormularioArea();
                contabilizarModelo.cambiosGlobal++;
            }
            
        } else {
            $('#spanAreaNegocio').text('Todos los campos son obligatorios');
        }
    },
    /**
     * Limpia cajas de texto del formulario del área de negocio
     * @retun {void}
     **/
    limpiarFormularioArea: function(){
      var div = $('#divFormularioArea');

      div.find('input:text').val('').removeClass('campoInvalido');
      div.find('#cmbTipoSuscripcion').val('-1');
      div.find('.porcentaje').val('100');
      div.find('#spanAreaNegocio').text('');
      div.find('#btnAgregarArea')
         .attr('data-indice', 'N')
         .text('Agregar área de negocio');
    },
    /**
     * Carga la información de centro de consto de un concepto, información guardada en modelo actual
     * asigna eventos a controles de la tabla
     * @returns {void}
     **/
    cargarTablaCentroCosto: function () {
        if (contabilizarModelo.centrocosto.length > 0) {
            var table = fillTable('tblCentro', formatoCentroCostos, contabilizarModelo.centrocosto, '');
            table.find('tbody tr td[header="thEditar"] input').on('click', that.abrirEditarCentroCosto);
            table.find('tbody tr td[header="thEliminar"] input').on('click', function(){ 
                
                that.confirmarEliminar($(this), 'centrocosto');
            });
        }else{
            $('#tblCentro').empty();
        }
    },
    
    /**
     * Buscar la información del centro de costo que se desea editar
     * @returns {void}
     **/
    abrirEditarCentroCosto: function () {
        var _this = $(this);
        var id = _this.attr('data-id');
        var div = $('#divFormularioCentroCosto');
        var indice = parseInt(_this.parent().attr('data-value'));
        div.find('#spanCentroCosto').text('');
        var opcion = !isNaN(parseInt(id)) ?
                contabilizarControl.consultarCentroPorId(id) :
                (!isNaN(indice)) ? contabilizarModelo.centrocosto[indice]: false;

        !!opcion ? that.cargarCentroCostoEditar(opcion.centrocosto ? opcion.centrocosto : opcion) : div.find('input:text').val('');
        $('#btnAgregarCentroCostos')
                    .attr('data-indice', !!opcion ? opcion.indice : 'N')
                    .text('Editar centro de costos');
        
    },
    /**
     * Muestra en formulario información del centro de costo para editar
     * @param {object} data - Información del centro de costo a mostrar
     * @returns {void}
     **/
    cargarCentroCostoEditar: function (data) {
        $('#cmbDepartamentoCC').val(data.codigoempresa);
        $('#txtCentroCosto').val(data.cuenta).attr('data-id', data.idcuenta);
        $('#txtCodCentroCosto').val(data.codigo);
        $('#txtPorcentajeCCosto').val(data.porcentaje);
    },
     /**
     * Valida la información del centro de costo a guardar o actualizar en caso de 
     * ser correcta es guardada en el arreglo
     * @param {int} indice -Posición en la que está el objeto a actualizar en el arreglo contabilizarModelo.centrocosto
     * @returns {void}
     **/
    guardarCentroCosto: function (indice) {
        var div = $('#divFormularioCentroCosto');
        var validacion = that.validarCamposEditar(div);
        if (validacion) {
            var departamento = div.find('#cmbDepartamentoCC');
            var cuenta = div.find('#txtCentroCosto');
            var codCuenta = div.find('#txtCodCentroCosto').val();
            var codigo = cuenta.attr('data-id');
            var valPorcentaje = parseFloat(div.find('#txtPorcentajeCCosto').val());
            var datosCombinacion = {
                codigoempresa: departamento.val(), 
                codigo: codCuenta, 
                tabla: that.cargarTablaCentroCosto,
                idenviar: 'idcentrocosto',
                porcentaje: valPorcentaje, 
                index: indice, tipo: 'centrocosto', span: $('#spanCentroCosto')};
            var existencia = that.validarCombinacion(datosCombinacion, contabilizarModelo.centrocosto);

            if (existencia) {
                var data = {
                    proceso: departamento.find('option:selected').text(),
                    codigoempresa: departamento.val(),
                    cuenta: cuenta.val(),
                    idcuenta: cuenta.attr('data-id'),
                    codigo: codCuenta,
                    porcentaje: valPorcentaje,
                    idconcepto: contabilizarModelo.idConcepto
                };
                data.idempresa = $('#cmbEmpresa').val() !== '-1' ? $('#cmbEmpresa').val() : null;
                var boolExistencia = !isNaN(parseInt(existencia.indice)) || !isNaN(parseInt(existencia.id));
                if (!isNaN(parseInt(indice)) || boolExistencia) {
                    if(!isNaN(parseInt(existencia.id))){
                        var contabilizacion = contabilizarControl.consultarCentroPorId(existencia.id).centrocosto;
                    }else{
                        var contabilizacion = contabilizarModelo.centrocosto[!isNaN(parseInt(existencia.indice)) ? parseInt(existencia.indice) : indice];    
                    }

                    data.idcentrocosto = contabilizacion.idcentrocosto;
                    data.accion = !isNaN(parseInt(contabilizacion.idcentrocosto)) ? 'A' : 'I';
                    data.porcentaje = (boolExistencia) ? contabilizacion.porcentaje : data.porcentaje;
                    var e = that.validarExistenciaAccion(contabilizacion.idcentrocosto, indice, contabilizarModelo.accionCentroCosto, data);
                    if(e.length === 0 && isNaN(parseInt(existencia.indice))){
                        contabilizarModelo.accionCentroCosto.push(data);
                    }else{
                        contabilizarModelo.cambiosGlobal -= 1;
                    }
                    contabilizarModelo.centrocosto[indice] = data;
                } else {
                    data.accion = 'I';
                    data.idcentrocosto = 'N';
                    data.indice = contabilizarModelo.centrocosto.length;
                    contabilizarModelo.centrocosto.push(data);
                    contabilizarModelo.accionCentroCosto.push(data);
                }

                that.cargarTablaCentroCosto();
                that.limpiarFormularioCentro();
                contabilizarModelo.cambiosGlobal++;
            }
        } else {
            $('#spanCentroCosto').text('Todos los campos son obligatorios');
        }
    },
    /**
     * Limpia cajas de texto del formulario del centro de costo
     * @retun {void}
     **/
    limpiarFormularioCentro: function(){
      var div = $('#divFormularioCentroCosto');

      div.find('input:text').val('').removeClass('campoInvalido');
      div.find('#cmbDepartamentoCC').val('-1');
      div.find('.porcentaje').val('100');
      div.find('#spanCentroCosto').text('');
      div.find('#btnAgregarCentroCostos')
         .attr('data-indice', 'N')
         .text('Agregar centro de costos');
    },
    /**
     * Cambia las columnas de medio de pago de las tablas de recaudos
     * @returns {void}
     **/
    cambiarMedioPagoRecaudo: function(){
        var _this = $(this);
        if(_this.val() !== '-1'){
            $('#divContenedorRecaudo').show();
            var data = {
                iddocumento : $('#cmbDocumento').val(),
                idtipodocumento : $('#cmbTipoDocumento').val(),
                idmediopago : _this.val()
            }
            contabilizarControl.consultarConceptoRecaudo(data, that.onConsultarConceptoRecaudo);
            var tablas = $('#tblConceptoContable, #tblConceptoFlujo');
            var medioPago = _this.find('option:selected').text();
            tablas.find('tbody tr td[header="thMedioPago"]').text(medioPago);
        }else{
            $('#divContenedorRecaudo').hide();
        }
    },
    /**
     * Carga la información de un concepto, información guardada en modelo actual
     * asigna eventos a controles de la tabla
     * @returns {void}
     **/
    cargarTablaConceptoFlujo: function () {
        if (contabilizarModelo.flujocontable.length > 0) {
            var table = fillTable('tblConceptoFlujo', formatoConceptoFlujo, contabilizarModelo.flujocontable, '');
            var medioPago = $('#cmbMedioPago').val() !== '-1' ? $('#cmbMedioPago option:selected').text() : '';

            table.find('tbody tr td[header="thTipo"]').text('No aplica');
            table.find('tbody tr td[header="thMedioPago"]').text(medioPago);
           // table.find('tbody tr td[header="thEditar"] input').on('click', that.abrirEditarFlujo);
            table.find('tbody tr td[header="thEliminar"] input').on('click', function(){ 
                that.confirmarEliminar($(this), 'flujo');
            });
        }else{
            $('#tblConceptoFlujo').empty();
        }
    },

    /**
     * Valida la información del concepto de flujo y guarda el concepto si la validación es correcta.
     * @returns {void} 
     */
    validarConceptoFlujo: function () {
        var div = $('#divFormularioConceptoFlujo');
        var validacion = that.validarCamposEditar(div);
        var span = $('#spanConceptoFlujo').text('');
        if (validacion) {
            var concepto = div.find('#cmbConceptoFlujo').val();
            var datosCombinacion = {
                idconcepto: concepto,
                tabla: that.cargarTablaConceptoFlujo,
                idenviar: 'idconceptoflujo',
                porcentaje: $('#txtPorcentajeFlujo').val(),
                tipo: 'flujo', span: span};
            var validacionCombinacion = that.validarCombinacion(datosCombinacion, contabilizarModelo.flujocontable);
            if (validacionCombinacion) {
                that.guardarConceptoFlujoTabla(div, validacionCombinacion);
            }

        } else {
            span.show().text('Todos los campos son obligatorios');
        }
    },
     /**
     * Valida la información de la contabilización a guardar o actualizar en caso de 
     * ser correcta es guardada en el arreglo
     * @param {int} indice -Posición en la que está el objeto a actualizar en el arreglo contabilizarModelo.contabilizacion
     * @returns {void}
     **/
    guardarConceptoFlujoTabla: function(div, existencia){
        var cmbConcepto = div.find('#cmbConceptoFlujo');
        var data = {
            tipo: 'N', 
            accion: 'I',
            porcentaje: $('#txtPorcentajeFlujo').val(),
            idconcepto:cmbConcepto.val(),
            mediopagoid: $('#cmbMedioPago').val(),
            iddocumento: $('#cmbDocumento').val(),
            idtipodocumento: $('#cmbTipoDocumento').val(),
            conceptocontable: cmbConcepto.find('option:selected').text(),
        };
        data.idempresa = $('#cmbEmpresa').val() !== '-1' ? $('#cmbEmpresa').val() : null;
        //BUSCAR 
        var boolExistencia = !isNaN(parseInt(existencia.indice)) || !isNaN(parseInt(existencia.id));
        if(boolExistencia){
            if(!isNaN(parseInt(existencia.id))){
                var flujo = contabilizarControl.consultarConceptoFlujoPorId(existencia.id).conceptoflujo;
                data.accion = 'A';
                
                data.idconceptoflujo = flujo.idconceptoflujo;
            }else{
                var flujo = contabilizarModelo.flujocontable[parseInt(existencia.indice)];    
            }
            
            data.porcentaje = (boolExistencia) ? flujo.porcentaje : data.porcentaje;
            data.indice = (boolExistencia) ? flujo.indice : data.indice;
            var e = that.validarExistenciaAccion('idconceptoflujo', flujo.idconceptoflujo, existencia.indice, contabilizarModelo.accionConceptoFlujo, data);
            if(e.length === 0 && isNaN(parseInt(existencia.indice))){
                contabilizarModelo.accionConceptoFlujo.push(data)
            }else{
                contabilizarModelo.cambiosGlobal -= 1;
            }
        }else{
            data.indice = contabilizarModelo.flujocontable.length;
            contabilizarModelo.flujocontable.push(data);
            contabilizarModelo.accionConceptoFlujo.push(data);
        }
        that.cargarTablaConceptoFlujo();
        that.limpiarFlujoContable();
        contabilizarModelo.cambiosGlobal++;
    },

    /**
     * Limpia las cajas de texto del formulario para agregar concepto flujo
     * @returns {void}
     **/

     limpiarFlujoContable: function(){  
        var div = $('#divFormularioConceptoFlujo');
        div.find('#cmbConceptoFlujo').val('-1');
        div.find('#spanConceptoFlujo').text('');
        $('#txtPorcentajeFlujo').val('100');
        //div.find('#btnAgregarConceptoFlujo')

     },

     /**
     * Carga la información de un concepto, información guardada en modelo actual
     * asigna eventos a controles de la tabla
     * @returns {void}
     **/
    cargarTablaConceptoContable: function () {
        if (contabilizarModelo.conceptocontable.length > 0) {
            var table = fillTable('tblConceptoContable', formatoConceptoContable, contabilizarModelo.conceptocontable, '');
            var medioPago = $('#cmbMedioPago').val() !== '-1' ? $('#cmbMedioPago option:selected').text() : '';

            table.find('tbody tr td[header="thTipo"]').text('No aplica');
            table.find('tbody tr td[header="thMedioPago"]').text(medioPago);
           // table.find('tbody tr td[header="thEditar"] input').on('click', that.abrirEditarFlujo);
            table.find('tbody tr td[header="thEliminar"] input').on('click', function(){ 
                that.confirmarEliminar($(this), 'contable');
            });
        }else{
            $('#tblConceptoContable').empty();
        }
    },

    /**
     * Valida la información del concepto contable y guarda si la información es válida.
     * @returns {void}
     */
    validarConceptoContable: function () {
        var div = $('#divFormularioConceptoContable');
        var validacion = that.validarCamposEditar(div);
        var span = $('#spanConceptoContable').text('');
        if (validacion) {
            var concepto = div.find('#cmbConceptoContable').val();
            var datosCombinacion = {
                idconcepto: concepto,
                idenviar: 'idconceptocontable',
                tabla: that.cargarTablaConceptoContable,
                porcentaje: $('#txtPorcentajeContable').val(),
                tipo: 'contable', span: span};
            var validacionCombinacion = that.validarCombinacion(datosCombinacion, contabilizarModelo.conceptocontable);
            if (validacionCombinacion) {
                that.guardarConceptoContableTabla(div, validacionCombinacion);
            }

        } else {
            span.show().text('Todos los campos son obligatorios');
        }
    },
     /**
     * Valida la información de la contabilización a guardar o actualizar en caso de 
     * ser correcta es guardada en el arreglo
     * @param {int} indice -Posición en la que está el objeto a actualizar en el arreglo contabilizarModelo.contabilizacion
     * @returns {void}
     **/
    guardarConceptoContableTabla: function(div, existencia){
        var cmbConcepto = div.find('#cmbConceptoContable');
        var data = {
            tipo: 'N', 
            accion: 'I',
            porcentaje: div.find('#txtPorcentajeContable').val(),
            idconcepto:cmbConcepto.val(),
            mediopagoid: $('#cmbMedioPago').val(),
            iddocumento: $('#cmbDocumento').val(),
            idtipodocumento: $('#cmbTipoDocumento').val(),
            conceptocontable: cmbConcepto.find('option:selected').text(),
        };
        data.idempresa = $('#cmbEmpresa').val() !== '-1' ? $('#cmbEmpresa').val() : null;


        var boolExistencia = !isNaN(parseInt(existencia.indice)) || !isNaN(parseInt(existencia.id));
        if(boolExistencia){
            if(!isNaN(parseInt(existencia.id))){
                var concepto = contabilizarControl.consultarConceptoContablePorId(existencia.id).conceptocontable;
                data.accion = 'A';
                data.idconceptocontable = concepto.idconceptocontable;
            }else{
                var concepto = contabilizarModelo.conceptocontable[parseInt(existencia.indice)];    
            }
            data.indice = (boolExistencia) ? concepto.indice : data.indice;
            data.porcentaje = (boolExistencia) ? concepto.porcentaje : data.porcentaje;

            var e = that.validarExistenciaAccion('idconceptocontable', concepto.idconceptocontable, existencia.indice, contabilizarModelo.accionConceptoContable, data);
            if(e.length === 0 && isNaN(parseInt(existencia.indice))){
                contabilizarModelo.accionConceptoContable.push(data)
            }else{
                contabilizarModelo.cambiosGlobal -= 1;
            }
        }else{
            data.indice = contabilizarModelo.conceptocontable.length;
            contabilizarModelo.conceptocontable.push(data);
            contabilizarModelo.accionConceptoContable.push(data);
        }

        contabilizarModelo.cambiosGlobal++;
        that.cargarTablaConceptoContable();
        that.limpiarConceptoContable();

        //that.dialogoActual.dialog('close');
    },

    /**
     * Limpia las cajas de texto del formulario para agregar concepto flujo
     * @returns {void}
     **/
     limpiarConceptoContable: function(){  
        var div = $('#divFormularioConceptoContable');
        div.find('#cmbConceptoContable').val('-1');
        div.find('#spanConceptoContable').text('');
        div.find('#txtPorcentajeContable').val('100');
     },

     /**
     * Carga la información de un concepto, información guardada en modelo actual
     * asigna eventos a controles de la tabla
     * @returns {void}
     **/
    cargarTablaConsignacionFlujo: function () {
        var tbl = $('#divConsignacionConsginacion:hidden').length > 0 ? 'tblDiferenciaFlujo' : 'tblConsignacionFlujo';
        if (contabilizarModelo.flujoconsignacion.length > 0) {
            var table = fillTable(tbl, formatoConceptoFlujo, contabilizarModelo.flujoconsignacion, 'Flujo contable');
            var medioPago = $('#cmbMedioPagoCsg').val() !== '-1' ? $('#cmbMedioPagoCsg option:selected').text() : '';

            var tdTipos = table.find('tbody tr td[header="thTipo"]');
            for(var t = 0; t < tdTipos.length; t++){
                var td = $(tdTipos[t]);
                var text = td.text() === 'F'? 'Faltante' : (td.text() === 'S' ? 'Sobrante' : (td.text() === 'G') ? 'Gasto' : 'No aplica');
                $(tdTipos[t]).text(text);
            }
            table.find('tbody tr td[header="thMedioPago"]').text(medioPago);
           // table.find('tbody tr td[header="thEditar"] input').on('click', that.abrirEditarFlujo);
            table.find('tbody tr td[header="thEliminar"] input').on('click', function(){ 
                that.confirmarEliminar($(this), 'flujocsg');
            });
        }else{
            $('#'+tbl).empty();
        }
    },
     /**
     * Valida la información del flujo contable a guardar para ser guardada
     * @returns {void}
     **/
    validarConsignacionFlujo: function () {
        var div = $('#divConsignacionConsginacion:hidden').length > 0 ? $('#divDiferenciaConceptoFlujo') : $('#divConsignacionConceptoFlujo');
        var validacion = that.validarCamposEditar(div);
        var span = div.find('#spanConsignacionFlujo').text('');
        if (validacion) {
            var concepto = div.find('#cmbConsignacionFlujo').val();
            var datosCombinacion = {
                idconcepto: concepto,
                idenviar: 'idconceptoflujo',
                tabla: that.cargarTablaConsignacionFlujo,
                porcentaje: div.find('#txtPorcentajeConsignacionFlujo').val(),
                'tipocsg': $('#divConsignacionConsginacion:hidden').length === 0 ? 'N' : $('#cmbTipoDiferencia').val(),
                tipo: 'flujocsg', span: span};
            var validacionCombinacion = that.validarCombinacion(datosCombinacion, contabilizarModelo.flujoconsignacion);
            if (validacionCombinacion) {
                that.guardarConsignacionFlujoTabla(div, validacionCombinacion);
            }

        } else {
            span.show().text('Todos los campos son obligatorios');
        }
    },
     /**
     * Guarda y actualiza tabla de flujo contable en pestaña de consignación
     * @param {object} div - División donde se encuentra la información cargada del nuevo concepto
     * @returns {void}
     **/
    guardarConsignacionFlujoTabla: function(div, existencia){
        var cmbConcepto = div.find('#cmbConsignacionFlujo');
        var tipo = $('#divConsignacionConsginacion:hidden').length === 0 ? 'N' : $('#cmbTipoDiferencia').val();
        var data = {
            tipo: tipo, 
            accion: 'I',
            porcentaje: div.find('#txtPorcentajeConsignacionFlujo').val(),
            idconcepto:cmbConcepto.val(),
            mediopagoid: $('#cmbMedioPagoCsg').val(),
            iddocumento: $('#cmbDocumento').val(),
            idtipodocumento: $('#cmbTipoDocumento').val(),
            conceptocontable: cmbConcepto.find('option:selected').text(),

        };
        data.idempresa = $('#cmbEmpresa').val() !== '-1' ? $('#cmbEmpresa').val() : null;

        var boolExistencia = !isNaN(parseInt(existencia.indice)) || !isNaN(parseInt(existencia.id));
        if(boolExistencia){
            if(!isNaN(parseInt(existencia.id))){
                var flujo = contabilizarControl.consultarConsignacionFlujoPorId(existencia.id).conceptoflujo;
                data.accion = 'A';
                data.idconceptoflujo = flujo.idconceptoflujo;
            }else{
                var flujo = contabilizarModelo.flujoconsignacion[parseInt(existencia.indice)];    
            }
            data.indice = (boolExistencia) ? flujo.indice : data.indice;
            data.porcentaje = (boolExistencia) ? flujo.porcentaje : data.porcentaje;

            var e = that.validarExistenciaAccion('idconceptoflujo', flujo.idconceptoflujo, existencia.indice, contabilizarModelo.accionConceptoFlujo, data);
            if(e.length === 0 && isNaN(parseInt(existencia.indice))){
                contabilizarModelo.accionFlujoConsignacion.push(data)
            }else{
                contabilizarModelo.cambiosGlobal -= 1;
            }
        }else{
            data.indice = contabilizarModelo.flujoconsignacion.length;
            contabilizarModelo.flujoconsignacion.push(data);
            contabilizarModelo.accionFlujoConsignacion.push(data);
        }
        that.cargarTablaConsignacionFlujo();
        that.limpiarFlujoConsignacion();
        contabilizarModelo.cambiosGlobal++;
    },

    /**
     * Limpia las cajas de texto del formulario para agregar concepto flujo
     * @returns {void}
     **/
     limpiarFlujoConsignacion: function(){  
        var div = $('#divConsignacionConsginacion:hidden').length > 0 ? $('#divDiferenciaConceptoFlujo') : $('#divConsignacionConceptoFlujo');
        div.find('#cmbConsignacionFlujo').val('-1');
        div.find('#spanConsignacionFlujo').text('');
        div.find('#txtPorcentajeConsignacionFlujo').val('100');
     },

     /**
     * Carga la información de un concepto, información guardada en modelo actual
     * asigna eventos a controles de la tabla
     * @returns {void}
     **/
    cargarTablaConsignacionContable: function () {
        var tbl = $('#divConsignacionConsginacion:hidden').length > 0 ? 'tblDiferenciaContable' : 'tblConsignacionContable';
        if (contabilizarModelo.contableconsignacion.length > 0) {
            var table = fillTable(tbl, formatoConceptoContable, contabilizarModelo.contableconsignacion, 'Conceptos contables');
            var medioPago = $('#cmbMedioPagoCsg').val() !== '-1' ? $('#cmbMedioPagoCsg option:selected').text() : '';

            var tdTipos = table.find('tbody tr td[header="thTipo"]');
            for(var t = 0; t < tdTipos.length; t++){
                var td = $(tdTipos[t]);
                var text = td.text() === 'F'? 'Faltante' : (td.text() === 'S' ? 'Sobrante' : (td.text() === 'G') ? 'Gasto' : 'No aplica');
                $(tdTipos[t]).text(text);
            }
            table.find('tbody tr td[header="thMedioPago"]').text(medioPago);
           // table.find('tbody tr td[header="thEditar"] input').on('click', that.abrirEditarFlujo);
            table.find('tbody tr td[header="thEliminar"] input').on('click', function(){ 
                that.confirmarEliminar($(this), 'contablecsg');
            });
        }else{
            $('#'+tbl).empty();
        }
    },
    /**
     * Valida la información del concepto contable a guardar para ser guardada
     * @returns {void}
     **/
    validarConsignacionContable: function () {
        var div = $('#divConsignacionConsginacion:hidden').length > 0 ? $('#divDiferenciaConceptoContable') : $('#divConsignacionConceptoContable');
        var validacion = that.validarCamposEditar(div);
        var span = $('#spanConsignacionContable').text('');
        if (validacion) {
            var concepto = div.find('#cmbConsignacionContable').val();
            var datosCombinacion = {
                idconcepto: concepto,
                idenviar: 'idconceptocontable',
                tabla: that.cargarTablaConsignacionContable,
                porcentaje: div.find('#txtPorcentajeConsignacionContable').val(),
                'tipocsg': $('#divConsignacionConsginacion:hidden').length === 0 ? null : $('#cmbTipoDiferenciaContable').val(),
                tipo: 'contablecsg', span: span};
            var validacionCombinacion = that.validarCombinacion(datosCombinacion, contabilizarModelo.contableconsignacion);
            if (validacionCombinacion) {
                that.guardarConsignacionContableTabla(div, validacionCombinacion);
            }

        } else {
            span.show().text('Todos los campos son obligatorios');
        }

    },
    /**
     * Guarda y actualiza tabla de conceptos contable en pestaña de consignación
     * @param {object} div - División donde se encuentra la información cargada del nuevo concepto
     * @returns {void}
     **/
    guardarConsignacionContableTabla: function(div, existencia){
        var cmbConcepto = div.find('#cmbConsignacionContable');
        var tipo = $('#divConsignacionConsginacion:hidden').length === 0 ? 'N' : $('#cmbTipoDiferenciaContable').val();
        var data = {
            tipo: tipo, 
            accion: 'I',
            porcentaje: div.find('#txtPorcentajeConsignacionContable').val(),
            idconcepto: cmbConcepto.val(),
            mediopagoid: $('#cmbMedioPagoCsg').val(),
            iddocumento: $('#cmbDocumento').val(),
            idtipodocumento: $('#cmbTipoDocumento').val(),
            conceptocontable: cmbConcepto.find('option:selected').text(),
        };
        data.idempresa = $('#cmbEmpresa').val() !== '-1' ? $('#cmbEmpresa').val() : null;

        var boolExistencia = !isNaN(parseInt(existencia.indice)) || !isNaN(parseInt(existencia.id));
        if(boolExistencia){
            if(!isNaN(parseInt(existencia.id))){
                data.accion = 'A';
                data.idconceptocontable = flujo.idconceptocontable;
                var flujo = contabilizarControl.consultarConsignacionContablePorId(existencia.id).conceptocontable;
            }else{
                var flujo = contabilizarModelo.contableconsignacion[parseInt(existencia.indice)];    
            }
            data.indice = (boolExistencia) ? flujo.indice : data.indice;
            data.porcentaje = (boolExistencia) ? flujo.porcentaje : data.porcentaje;
            var e = that.validarExistenciaAccion('idconceptocontable', flujo.idconceptocontable, existencia.indice, contabilizarModelo.accionConsignacionContable, data);

            if(e.length === 0 && isNaN(parseInt(existencia.indice))){
                contabilizarModelo.accionConsignacionContable.push(data)
            }else{
                contabilizarModelo.cambiosGlobal -= 1;
            }
        }else{
            data.indice = contabilizarModelo.contableconsignacion.length;
            contabilizarModelo.contableconsignacion.push(data);
            contabilizarModelo.accionConsignacionContable.push(data);
        }
        contabilizarModelo.cambiosGlobal++;

        that.cargarTablaConsignacionContable();
        that.limpiarConsignacionContable();
    },

    /**
     * Limpia las cajas de texto del formulario para agregar concepto contable
     * @returns {void}
     **/
     limpiarConsignacionContable: function(){  
        var div = $('#divConsignacionConsginacion:hidden').length > 0 ? $('#divDiferenciaConceptoContable') : $('#divConsignacionConceptoContable');
        div.find('#cmbConsignacionContable').val('-1');
        div.find('#spanConsignacionContable').text('');
        div.find('#txtPorcentajeConsignacionContable').val('100');

     },
    /** Valida toda la información que se haya actualizado/agregado en las pestañas de la interfaz y las empaqueta
     * para ser enviado al servidor y ser guardadad
     * @returns {void}
     **/
    validarContabilizacion: function () {

        if (contabilizarModelo.cambiosGlobal > 0) {
            var consignacion = $('#divConsignacionConsginacion:hidden').length > 0 ? 'diferencia' : 'consignacion';
            var data = {
                causioncontable: {
                    contabilizacion: contabilizarModelo.accionContabilizacion,
                    areanegocio: contabilizarModelo.accionArea,
                    centrocosto: contabilizarModelo.accionCentroCosto
                }, 
                recaudo: {
                    conceptoflujo: contabilizarModelo.accionConceptoFlujo,
                    conceptocontable: contabilizarModelo.accionConceptoContable
                }
            };

            data[consignacion] = {
                    conceptoflujo: contabilizarModelo.accionFlujoConsignacion ,
                    conceptocontable: contabilizarModelo.accionConsignacionContable
            };
            contabilizarControl.guardarContabilizacion({contabilizarconceptos: data}, that.onGuardarContabilizacionCompleto)
        }else{
            __dom.lanzarAlerta(__app.mensajes.sinCambios, __app.mensajes.atencion);
        }
    },
    /** Captura la respuesta del servidor cuando se guarda la información en base de datosCombinacion
     * @returns {void}
     **/
    onGuardarContabilizacionCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 1:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion, function(){location.reload();});
                break;
        }
    },

    /** Valida que todos los campos del formulario estén completos
     * @param {object} div - División donde está el formulario a validar
     * @returns {void}
     **/
    validarCamposEditar: function (div) {
        var campos = div.find('input:text, select').not('.tipodocumento');
        for (var c = 0; c < campos.length; c++) {
            campo = campos[c];
            if (campo.tagName === 'SELECT' && (campo.value === '-1' || campo.value === null)) {
                return false;
            } else if (campo.tagName === 'INPUT' && campo.value === '') {
                return false;
            }
        }
        return true;
    },
    /** Valida que las cajas de texto donde se ingresa un porcentaje sean máximo 100 ni menor a 0
     * @returns {void}
     **/
    validarPorcentaje: function () {
        var _this = $(this);
        var valor = parseFloat(_this.val());
        if (valor > 100) {
            _this.val(100);
            _this.focus().select();
        } else if (valor < 0) {
            _this.val(0);
            _this.focus().select();
        }
    },
    /** Función ejecutada por filltable formatoContabilizacion
     * @returns {string} Nombre del tipo de naturaleza de una contabilización
     **/
    tipoNaturaleza: function (value) {
        if (value === 'D') {
            return 'Dédito';
        } else if (value === 'C') {
            return 'Crédito';
        }
    },
    /** Limpia toda la información que hay en la pestaña de consignación
     * @returns {void}
     **/
    limpiarConsignacion: function(){
        var cont = 0;
        that.limpiarConsignacionContable();
        that.limpiarFlujoConsignacion();
        cont += contabilizarModelo.accionFlujoConsignacion.length;
        cont += contabilizarModelo.accionConsignacionContable.length;

        contabilizarModelo.cambiosGlobal -= cont;
        contabilizarModelo.accionFlujoConsignacion = [];
        contabilizarModelo.accionConsignacionContable = [];
        contabilizarModelo.contableconsignacion = [];
        contabilizarModelo.flujoconsignacion = [];
        var div =$('#divConsignacionConsginacion, #divConsignacionDiferencia').hide();
        div.find('table').empty();
    },
    /** Limpia toda la información que hay en la pestaña de recaudos
     * @returns {void}
     **/
    limpiarRecaudos: function(){
        var cont = 0;
        that.limpiarConceptoContable();
        that.limpiarFlujoContable();
        cont += contabilizarModelo.accionConceptoFlujo.length;
        cont += contabilizarModelo.accionConceptoContable.length;

        contabilizarModelo.cambiosGlobal -= cont;
        contabilizarModelo.accionConceptoFlujo = [];
        contabilizarModelo.accionConceptoContable = [];
        var div =$('#divContenedorRecaudo').hide();
        div.find('table').empty();
    },
    /** Limpia toda la información que hay en la pestaña de causación contable
     * @returns {void}
     **/
    limpiarCausacion: function(){
        var group = $('#divContenedorCausion').hide();
        var contador = 0;
        group.find('table').empty();
        group.find('input:text').not('.noclear').val('');
        group.find('select').val('-1');
        contador += contabilizarModelo.accionContabilizacion.length;
        contador += contabilizarModelo.accionArea.length;
        contador += contabilizarModelo.accionCentroCosto.length;

        contabilizarModelo.area = [];
        contabilizarModelo.accionArea = [];
        contabilizarModelo.centrocosto = [];
        contabilizarModelo.contabilizacion = [];
        contabilizarModelo.accionCentroCosto = [];
        contabilizarModelo.accionContabilizacion = [];
        
        contabilizarModelo.cambiosGlobal -= contador;
    },

    /** Limpia toda la información que hay en la interfaz  de contabilización
     * @returns {void}
     **/
    limpiarFormulario: function () {
        var medios = contabilizarModelo.mediosPago;
        var documentos = contabilizarModelo.documentos;
        contabilizarModelo = {
            accionContabilizacion: [],
            accionArea: [], 
            accionCentroCosto: [], 
            accionConceptoFlujo: [], 
            accionConceptoContable: [], 
            accionFlujoConsignacion: [],
            accionConsignacionContable: [],
            flujoconsignacion: [],
            contableconsignacion: [],
            mediosPago : medios,
            documentos: documentos,
            cambiosGlobal: 0
        };
        var div = $('#divPenstanias, #divContenedorRecaudo').hide();
        $('#divConsignacionDiferencia, divConsignacionConsginacion').hide();
        div.find('table').empty();
        div.find('select').val('-1');
        div.find('input:text').not('.noclear').val('');
        $('.porcentaje').val('100');
        that.limpiarCausacion();
        that.limpiarRecaudos();
        that.limpiarConsignacion();
    },

    /**Confirma si el usuario desea cancelar las operaciones actuales
     *@return {void}
     **/
     confirmarCancelar: function(){
         if(contabilizarModelo.cambiosGlobal > 0){
             __dom.lanzarAlerta('Se eliminarán todos los cambios hechos, ¿Desea continuar?', 
                __app.mensajes.atencion, 
                function(){
                    that.limpiarFormulario();
                    $('#cmbDocumento').val('-1');
                    $('#cmbTipoDocumento').empty();
                }, true
            );             
         }
     },

    /** Valida la información que se desea eliminar de una tabla, según la información propia
     * @returns {void}
     **/
    confirmarEliminar: function (button, accion) {
        var _this = button;
        contabilizarModelo.idEliminar = _this.attr('data-id');
        var mensaje = "", opc = "", modelo = "";
        var consultar;
        var tabla;

        switch (accion) {
            case 'contabilizacion':
                mensaje = "la contabilización";
                consultar = contabilizarControl.consultarContabilizacionPorId;
                modelo = contabilizarModelo.accionContabilizacion;
                todos = contabilizarModelo.contabilizacion;
                opc = "contabilizacion";
                tabla = that.cargarTablaContabilizacion;
                break;
            case 'area':
                mensaje = "el área de negocio ";
                consultar = contabilizarControl.consultarAreaPorId;
                modelo = contabilizarModelo.accionArea;
                todos = contabilizarModelo.areanegocio;
                opc = "areanegocio";
                tabla = that.cargarTablaArea;
                break;
           
            case 'centrocosto':
                mensaje = "el centro de costo ";
                consultar = contabilizarControl.consultarCentroPorId;
                modelo = contabilizarModelo.accionCentroCosto;
                todos = contabilizarModelo.centrocosto;
                opc = "centrocosto";
                tabla = that.cargarTablaCentroCosto;
                break;
            case 'flujo': 
                mensaje = "el concepto flujo ";
                consultar =  contabilizarControl.consultarConceptoFlujoPorId;
                modelo = contabilizarModelo.accionConceptoFlujo;
                todos = contabilizarModelo.flujocontable;
                opc = "conceptoflujo";
                tabla = that.cargarTablaConceptoFlujo;
                break;
            case 'contable': 
                mensaje = "el concepto contable ";
                consultar =  contabilizarControl.consultarConceptoContablePorId;
                modelo = contabilizarModelo.accionConceptoContable;
                todos = contabilizarModelo.conceptocontable;
                opc = "conceptocontable";
                tabla = that.cargarTablaConceptoContable;
                break;
            case 'flujocsg':
                mensaje = "el flujo contable ";
                consultar = contabilizarControl.consultarConsignacionFlujoPorId;
                modelo = contabilizarModelo.accionFlujoConsignacion;
                todos = contabilizarModelo.flujoconsignacion;
                opc = "conceptoflujo";
                tabla = that.cargarTablaConsignacionFlujo;
                break;
            case 'contablecsg':
                mensaje = "el concepto contable ";
                consultar = contabilizarControl.consultarConsignacionContablePorId;
                modelo = contabilizarModelo.accionConsignacionContable;
                todos = contabilizarModelo.contableconsignacion;
                opc = "conceptocontable";
                tabla = that.cargarTablaConsignacionContable;
                break;
        }


        __dom.lanzarAlerta('Esto eliminará '+ mensaje +' ¿Desea eliminarlo? ', 'Atención',
                function () {
                    var id = contabilizarModelo.idEliminar;
                    
                    if (!isNaN(parseInt(id))) {
                        var opcion = consultar(id);
                        var indexDelete = opcion.indice;
                        var ido = "id"+opc;
                        var id = opcion[opc][ido];
                        var data = {accion: 'E'};
                        data[ido] = id;
                        data.idempresa = $('#cmbEmpresa').val() !== '-1' ? $('#cmbEmpresa').val() : null;
                        var ex = that.validarExistenciaAccion(ido, id, null, modelo, data);

                        if(ex.length === 0){
                            modelo.push(data);
                            contabilizarModelo.cambiosGlobal++;
                        }
                    } else {
                        var indexDelete = parseInt(_this.parent().parent().attr('data-fila'));
                        for(var m = 0; m < modelo.length; m++){
                            if(parseInt(modelo[m].indice) === parseInt(indexDelete)){
                                modelo.splice(m, 1);
                                contabilizarModelo.cambiosGlobal -= 1;
                            }
                        }
                    }
                    //Se cambian los indices de los demás registros

                    
                    todos.splice(indexDelete, 1);
                    tabla();
                    
                }, true);
    },

    validarCombinacion: function (data, modelo) {
        var div = $(data.span[0]).parent();


        var combinacion = $.grep(modelo, function (obj, i) {
            switch(data.tipo){
            case 'contabilizacion':
                 return parseInt(data.codigo) === parseInt(obj.codigo) &&
                        data.naturaleza  === obj.naturaleza  &&
                        parseInt(data.index) !== i;
                break;
            case 'area':
                return parseInt(data.index) !== i;
                break;
           
            case 'centrocosto':
                return parseInt(data.index) !== i;
                break;
            case 'flujo': case 'contable': 
                return parseInt(data.idconcepto) === parseInt(obj.idconcepto);
                break;
            case 'flujocsg': case 'contablecsg': 
                if(!!data.tipocsg){
                    return parseInt(data.idconcepto) === parseInt(obj.idconcepto) && data.tipocsg === obj.tipo;    
                }else{
                    return parseInt(data.idconcepto) === parseInt(obj.idconcepto);
                }
                break;
        }
        });
        if (combinacion.length > 0) {
            if(data.tipo === 'area'){
                var areaCombinacion = $.grep(combinacion, function (obj, i) {
                    return parseInt(data.codigoarea) === parseInt(obj.codigoarea) && 
                       parseInt(data.idtiposusucripcion) === parseInt(obj.idtiposusucripcion);
                });
                if(areaCombinacion.length > 0){
                    data.span.text('Ya existe el tipo de suscripción '+combinacion[0].tiposuscripcion+ ' con el área '+ combinacion[0].nombrearea);
                    return false;
                }
            }

            var sumPorcentaje = 0;
            for (var i = 0; i < combinacion.length; i++) {
                sumPorcentaje += parseFloat(combinacion[i].porcentaje);
            }
            if (sumPorcentaje >= 100) {
                data.span.text('La causación contable está en el 100%');
                return false;
            } else if ((sumPorcentaje + parseFloat(data.porcentaje)) > 100) {
                restante = parseInt(100 - sumPorcentaje);
                div.find('input:text.porcentaje').val(restante);
                div.find('input:text.porcentaje').focus().select();
                data.span.text('La sumatoria del porcentaje debe ser 100');
                return false;
            }
            if(data.tipo !== 'area'){
                if(data.tipo === 'centrocosto'){
                    var comb = $.grep(combinacion, function (obj, i) {
                       return parseInt(data.codigo) === parseInt(obj.codigo) && 
                       parseInt(data.codigoempresa) === parseInt(obj.codigoempresa); 
                    });
                    if(comb.length > 0){
                        combinacion = comb;
                    }else{
                        return true;    
                    }
                }
                combinacion[0].porcentaje = parseFloat(combinacion[0].porcentaje) + parseFloat(data.porcentaje);
                data.tabla();
                //En caso de que sea un registro recien creado no lo sumará como un cambio.
                contabilizarModelo.cambiosGlobal -= !isNaN(parseInt(combinacion[0].indice)) ? 1 : 0;
                return !isNaN(parseInt(combinacion[0].indice)) ? {indice: combinacion[0].indice} : {id: combinacion[0][data.idenviar]};    
            }
        }
        return true;
    },

    /**
     * Valida si hay cambios en las acciones que se han hecho sobre la información del modelo.
     * @param  {Number} idbuscar
     * @param  {Number} id
     * @param  {Number} index    
     * @param  {Object} modelo   
     * @param  {Object} data     
     * @returns {Object}          
     */
    validarExistenciaAccion: function (idbuscar, id, index, modelo, data) {
        var e = [];
        if (!isNaN(parseInt(id))) {
            for(var indiceModelo = 0; indiceModelo < modelo.length; indiceModelo++){
                var registro = modelo[indiceModelo];
                if(parseInt(registro[idbuscar]) === parseInt(id)){
                    return modelo[indiceModelo] = data;
                }
            }
        } else {
            for(var indiceModelo = 0; indiceModelo < modelo.length; indiceModelo++){
                var registro = modelo[indiceModelo];
                if(parseInt(registro.indice) === parseInt(index)){
                    return modelo[indiceModelo] = data;
                }
            }
        }
        return e;
    }
};
contabilizarVista.init();