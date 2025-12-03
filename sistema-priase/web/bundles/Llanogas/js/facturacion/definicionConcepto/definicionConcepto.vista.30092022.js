/**
* @fileOverview Archivo de vista de definición de conceptos
* @author Appfuture 
* @requires definicionConcepto.modelo.js
* @requires definicionConcepto.control.js
* @version 1.0.0
*/

var that = null;

/** @namespace*/
var definicionVista = {

    /**
     * Variable que indica si en la fórmula que se construye, se aceptan operadores o es necesario agregar un concepto, valor o fórmula.
     * @type {Boolean}
     */
    aceptaOperador:false,

    /**
     * Contenedor actual, para reducir la búsqueda de elementos HTML
     * @type {Object}
     */
    divFormulaActual:$('#divPanelFormula .divFormula'),

    /**
     * Contenedor de la fórumula principal
     * @type {Object}
     */
    divContenedorFormula:$('#divPanelFormula'),

    /**
     * Variable para guardar referencia a la fórmula que está en el modelo
     * @type {Object}
     */
    formulaActual:definicionModelo.formula,

    /**
     * Guarda la contabilización actual del concepto principal
     * @type {Object}
     */
    contabilizacionActual:null,

    /**
     * Guarda una referencia al área de negocio actual
     * @type {Object}
     */
    areaNegocioActual:null,

    /**
     * Guarda una referencia al centro de costos actual
     * @type {Object}
     */
    centroCostoActual:null,

    /**
     * Guarda la contabilización de cruce Actual
     * @type {Object}
     */
    contabilizacionCruceActual:null,

    /**
     * Guarda una referencia a la contabilización de anticipo actual
     * @type {Object}
     */
    contabilizacionAnticipoActual:null,

    /**
     * Inicia la aplicación, cargando los datos generales y  configurando todos los eventos de la interfaz.
     * @returns {void} [description]
     */
    init: function(){
        that = definicionVista;
        that.configurarFiltroConceptos();

        //__dom.configurarTextoNumerico('txtCantAcumula, #txtValorNumerico');   ///YA NO HAY cantidadAcumula ni txtValorNumerico

        __dom.configurarTextoNumerico('txtValor', false, true);
        __dom.configurarCalendario('txtFechaInicial, #txtFechaFinal');
        __dom.llenarCombo('#cmbAcumula', definicionModelo.tipoAcumulacion, 'valor', 'nombre');

        $('#txtAlias').keydown(function (e) { if (e.keyCode === 32) { return false; }}).on('blur', that.validarAlias);
        $('#cmbTipoCalculo').on('change', that.mostrarPanelConstruirFormula);
        $('#cmbAcumula').on('change', that.valirComoAcumula);
        $('#txtFechaInicial').on('change', that.configurarFechaFin);
        $('#btnBuscar, #btnNuevo').on('click', function(){
            that.confirmarCancelarEdicion( $(this).attr('id')==='btnBuscar' ?   that.habilitarFiltroConceptos : that.habilitarNuevoConcepto );
        });

        $('#cmbConceptosNuevos').on('change', that.onConceptoNuevoSeleccionado);

        //botones del generador de formulas
        $('.botonesOperaciones button').on('click', that.agregarOperadorAFormula);
        $('.divParentesis button').on('click', that.agregarParentesis);
        $('.btnCE').on('click', that.borrarValorAFormula);
        $('.txtValorNumerico').on('keydown', function(e){ if(e.keyCode === 13) { that.agregarValorAFormula( $(this).val() ); }});
        $('.btnAgregaValor').on('click', that.agregarValorAFormula);
        $('.btnAgregarConcepto').on('click', that.agregarConceptoAFormula);
        $('.cmbConceptos').on('dblclick', that.agregarConceptoAFormula).on('keydown', function(e){ if(e.keyCode === 13) { that.agregarConceptoAFormula(e); }});
        $('.btnAgregarFuncion').on('click', that.agregarFuncionAFormula);
        $('.cmbFunciones').on('dblclick', that.agregarFuncionAFormula).on('keydown', function(e){ if(e.keyCode === 13) { that.agregarFuncionAFormula(e); }});
        $('#btnAgregarFormula').on('click', that.validarAgregarFormula);
        $('#btnGrabar').on('click', that.guardarConcepto);
        $('#btnCancelar').on('click', that.confirmarCancelar);
        //configuración de los rangos
        $('#cmbAccionRango').on('change', that.validarAccionRango);
        $('#btnEditarFormulaRango').on('click', that.mostrarDialogoFormula);
        $('#btnAgregarRango').on('click', that.agregarRango);
        __dom.configurarTextoNumerico('txtRangoInicial, #txtRangoFinal, #txtValorFormula, .txtValorNumerico', true, true);
        $('#btnActualizarRango').on('click', that.actualizarRango);
        $('#btnCancelarActualizarRango').on('click', that.cancelarActualizacionRango);
        $('#cmDocumento, #cmbLiquidacion, #cmbDocumentoContabilizacion, #cmbDocumentoConCruce').on('change', that.consultarTipoDocumento);
        $('#cmbAjuste').on('change', that.validarTipoAjusteRedondeo);

        //configuración de las pestanas de contabilizacion
        $('#divPenstanias').tabs();
        $('#btnAgregarContabilizacion').on('click', that.agregarContabilizacion);
        $('#btnAgregarArea').on('click', that.agregarAreaNegocio);
        $('#btnAgregarCentroCostos').on('click', that.agregarCentroCostos);
        $('#btnAgregarCuentaCruce').on('click', that.agregarContabilizacionCruce);
        $('#btnAgregarCuentaAnticipo').on('click', that.agregarContabilizacionAnticipo);

        var txtPorcentaje = __dom.configurarTextoNumerico('txtPorcentaje, #txtPorcentajeAN, #txtPorcentajeDEP, #txtPorcentajeConCruce');
        txtPorcentaje.on('blur', function(){
            var _txt = $(this);
            if (_txt.val()==='') {
                _txt.val(100);
                return;
            }
            if (parseInt(_txt.val())>100) {
                _txt.val(100);
                return;
            }
        });

        that.autocompleteContabilizaciones();
        //definicionControl.consultarDocumento({accion:'T'}, that.onConsultarDocumentoCompleto);
        definicionControl.consultarParametrosIniciales(that.onConsultarParametrosCompleto);
        __dom.configurarColapsable('.divContenedorColapsable');
        $('#divPestanias .divColapsable .btnColapsable .fa-minus').click();
    },


    /**
     * Valida el tipo de redondeo del valor del concepto, según la precisión seleccionada
     * @returns {void}
     */
    validarTipoAjusteRedondeo:function(){
        var cmb = $(this);
        var cmbPrecision = $('#cmbPrecision');
        switch(cmb.val()){
            case '-1':
            case 'N':
            case 'T':
                cmbPrecision.val('').attr('disabled', 'disabled').removeAttr('required');
            break;
            case 'R':
                cmbPrecision.val('0').removeAttr('disabled').attr('required', 'required');
            break;
        }
    },

    /** Configurar que la fecha final no sea menos a la de inicio
     * @returns {void}
     */
    configurarFechaFin: function() {
        var _this = $(this);  //input de lafecha de inicio
        var fi = new Date(_this.val().replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3"));
        $('#txtFechaFinal').datepicker('option', 'minDate', fi).val('');
    },

    /**
     * Se ejecuta cuando se ejecuta un concepto seleccionado y se consultan todos los detalles del concepto.
     * @returns {void}
     */
    onConceptoNuevoSeleccionado:function(){
        var _this = $(this);
        if(_this.val()!==null){
            definicionModelo.conceptoPrincipal = {
                nombre:_this.find('option:selected').text(),
                idconcepto:_this.val(),
                accion:'I',
                estructura:_this.attr('data-estconcepto')
            };
            definicionControl.consultarConcepto({idconcepto:_this.val(), esnuevo:true}, that.onConsultarDetallesConceptoCompleto);
        }
    },

    /**
     * Muestra una alerta para confirmar la cancelación de la edición o inserción del concepto. 
     * @param  {Function} callback Función de callback que se ejecuta cuando el usuario acepta cancelar el programa.
     * @returns {void}
     */
    confirmarCancelarEdicion:function(callback){
        if(definicionModelo.conceptoPrincipal){
            __dom.lanzarAlerta('¿Desea cancelar la edición del concepto actual?', __app.mensajes.atencion,
                function(){
                    callback();
                },
                true
            );
        }else{
            callback();
        }
    },

    /**
     * Habilita y muestra el filtro de Conceptos.
     * @returns {void}
     */
    habilitarFiltroConceptos:function(){
        that.limpiarFormulario();
        $('#txtConcepto').removeAttr('disabled').show();
        $('#cmbConceptosNuevos').hide();
    },

    /**
     * Habilita el combo para seleccionar conceptos, para crear uno nuevo.
     * @returns {void}
     */
    habilitarNuevoConcepto:function(){
        that.limpiarFormulario();
        $('#txtConcepto').attr('disabled', 'disabled').hide();
        $('#cmbConceptosNuevos').show().removeAttr('disabled');
        var cabecera = $('#divConceptoPrincipal');
        cabecera.find('input[type="text"]').val('').removeAttr('disabled');
        cabecera.find('select').val('-1').removeAttr('disabled');
        cabecera.find('select option[value="N"]').parent().val('N');
        cabecera.find('select#cmbAjuste').val('-1').change();
        //cabecera.find('select#cmbPrecision').val('').attr('disabled');
    },


    /**
     * Valida la información del concepto principal, confirma todos los campos y el tipo de concepto. Si todo está válido,
     * invoca la función del servidor para guardar el concepto.
     * @returns {void}
     */
    guardarConcepto:function(){
        if(!definicionModelo.conceptoPrincipal){
            __dom.lanzarAlerta('Debe seleccionar un concepto', __app.mensajes.atencion);
            return;
        }

        var tipoCalculo = $('#cmbTipoCalculo').val();

        var cp = that.validarCabeceraConcepto();
        if(typeof cp !== 'object'){
            __dom.lanzarAlerta(cp, __app.mensajes.atencion);
            return;
        }

        var nuevoConcepto = { 'definicionesconceptos': { 'conceptos': cp } };

        if(tipoCalculo === 'F'){
            if(definicionModelo.conceptosRelacionados && definicionModelo.conceptosRelacionados.length > 0){
                var validacionConceptosRelacionados = definicionControl.validarConceptosRelacionados();
                if(validacionConceptosRelacionados.codigo === -1){
                    __dom.lanzarAlerta(validacionConceptosRelacionados.mensaje, __app.mensajes.atencion);
                    return;
                }
                nuevoConcepto.definicionesconceptos.relacionconceptos = definicionModelo.conceptosRelacionados;
            }
            if(definicionModelo.conceptosRelacionadosEliminar && definicionModelo.conceptosRelacionadosEliminar.length > 0){
                if(!nuevoConcepto.definicionesconceptos.relacionconceptos){
                    nuevoConcepto.definicionesconceptos.relacionconceptos = [];
                }
                for(var i in definicionModelo.conceptosRelacionadosEliminar){
                    nuevoConcepto.definicionesconceptos.relacionconceptos.push(
                        definicionModelo.conceptosRelacionadosEliminar[i]
                    );
                }
            }
            if(definicionModelo.rangos && definicionModelo.rangos.length>0){
                nuevoConcepto.definicionesconceptos.rangosconceptos = definicionModelo.rangos;
            }
            if(definicionModelo.rangosEliminar && definicionModelo.rangosEliminar.length > 0){
                if(!nuevoConcepto.definicionesconceptos.rangosconceptos){
                    nuevoConcepto.definicionesconceptos.rangosconceptos = [];
                }
                for(var k in definicionModelo.rangosEliminar){
                    nuevoConcepto.definicionesconceptos.rangosconceptos.push(definicionModelo.rangosEliminar[k]);
                }
            }
        }

        definicionControl.crearConcepto(nuevoConcepto, that.onGuardarConceptoCompleto);
    },


    /**
     * Se ejecuta cuando se termina de guardar el concepto y recarga la página.
     * @param  {Object} data Respuesta del servidor
     * @returns {void}
     */
    onGuardarConceptoCompleto:function(data){
        if(data.codigoRespuesta===1){
            var fxCerrar = function(){
                window.location.replace('../definicion/');
            }
            __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion, fxCerrar, null, fxCerrar);    
        }
    },


    /**
     * Valida la información del concepto en la cabecera.
     * @returns {Object|String}  si todo es correcto retorna el Concepto principal, de lo contrario retorna un string con los errores que encontraron
     */
    validarCabeceraConcepto:function(){
        var mensaje = '';
        var errores = 0;
        var cp = definicionModelo.conceptoPrincipal;  //CP: se usa como abreviatura de Concepto Principal

        var cabecera = $('#divConceptoPrincipal');
        var camposRequeridos = cabecera.find('*[required="required"]');

        var nombrePropiedades = [];
        var validacion = null;

        for (var i = 0; i < camposRequeridos.length; i++) {
            var item = $(camposRequeridos[i]);
            validacion = that.validarControl(item);
            if (validacion === true) {
                cp[item.attr('data-prop')] = item.val();
            } else {
                errores++;
                mensaje += validacion + '<br />';
            }
        }
        var ini = cp.fechainicialvigencia = $('#txtFechaInicial').val().trim();
        var fin = cp.fechafinalvigencia = $('#txtFechaFinal').val().trim();
        if(fin!=='' && (new Date(ini)>new Date(fin))){
            errores++;
            mensaje += 'La fecha final vigente debe ser mayor <br />';
        }
        
        var tipoCalculo = cabecera.find('#cmbTipoCalculo');
        if( tipoCalculo.val() === 'V' ){
            cp.valor = cabecera.find('#txtValor').val();
        }else if(tipoCalculo.val() === 'F'){
            var erroresFormula = 0;
            if (definicionModelo.formula.length===0){
                mensaje += 'Debe agregar una fórmula<br />';
                errores++;
                erroresFormula++;
            }
            try{
                if(!that.validarEstructuraFormula(definicionModelo.formula)){
                    mensaje += 'Debe agregar una fórmula válida<br />';
                    errores++;
                    erroresFormula++;
                }
            }catch(err){
                mensaje += err+'<br />';
                errores++;
                erroresFormula++;
            }


            if(definicionModelo.conceptosRelacionados){
                var erroresConcepto = 0;
                $.each(definicionModelo.conceptosRelacionados, function(i, item){
                    if (item.idfuncion===null){
                        erroresConcepto++;
                    }
                });
                if(erroresConcepto>0){
                    mensaje += 'No todos los conceptos relacionados tienen una función asociada, debe agregar una función a cada concepto relacionado<br />';
                    errores++;
                    erroresFormula++;
                }
            }

            if(erroresFormula===0){
                cp.formula = JSON.stringify(definicionModelo.formula);
            }


        }else{
            errores++;
            mensaje += 'Debe seleccionar un tipo de cálculo<br />';
        }
        return errores > 0 ? mensaje : cp;
    },

    /**
     * Valida la información del elemento HTML que se envía por parámetro, esta función se ejecuta para los controles que tienen el atributo required.
     * @param  {Object} control Objeto jQuere con el control que se va a validar.
     * @returns {Boolean|String}         Si el campo es válido retorna true; de lo contrario, retorna un string con el mensaje de error del control que se valida.
     */
    validarControl: function (control) {
        var valor = control.val();
        var resultado = '';
        switch (control.prop('tagName')) {
            case 'INPUT':
                if (valor.trim() === '') {
                    resultado = 'El campo <strong>{{item}}</strong> no puede estar vacío';
                } else {
                    return true;
                }
                break;
            case 'SELECT':
                if (valor === '' || valor === null || valor==='-1') {
                    resultado = 'Debe seleccionar una opción para <strong>{{item}}</strong>';
                } else {
                    return true;
                }
                break;
        }
        return Mustache.render(resultado, {item: $('label[for="' + control.attr('id') + '"]').text().replace(':', '').replace('(*)', '').replace('/', '-')});
    },

    /**
     * Se ejecuta cuando se terminan de consultar todos los datos iniciales de la aplicacion, es decir
     * la informción que se requiere para editar o insertar un concepto como funciones y conceptos parametrizables.
     * @param  {Object} data La respuesta del servidor
     * @returns {void}
     */
    onConsultarParametrosCompleto:function(data){
        switch(data.codigoRespuesta){
            case 0:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
            break;
            case 1:
                __dom.llenarCombo('#cmbAplica', data.conceptos.programa, 'idpgrograma', 'nombre');
                __dom.llenarCombo('#cmbMedioPagoConCruce', data.conceptos.mediospago, 'id', 'nombre');

                definicionModelo.conceptosParametrizables = data.conceptosparametrizables;
                var cmbConceptosNuevos = $('#cmbConceptosNuevos');
                for (var i = 0; i < data.conceptos.conceptosparametrizables.length; i++) {
                    var con = data.conceptos.conceptosparametrizables[i];
                    cmbConceptosNuevos.append(
                        $('<option>').attr({'data-estconcepto':con.estconcepto, value:con.idconcepto}).text(con.concepto)
                    );
                }

                var cmbFunciones = $('.cmbFunciones');
                for (var i = 0; i < data.conceptos.funciones.length; i++) {
                    var item = data.conceptos.funciones[i];
                    cmbFunciones.append(
                        $('<option>').attr({title:item.descripcion, 'data-parametros':item.parametro, value:item.idfuncion}).text(item.nombre)
                    );
                }

                var cmbFuncionConcepto = $('#cmbFuncionConcepto');
                cmbFuncionConcepto.append( $('<option>').val(-1).text('Seleccione una opción') );
                for(var j=0;j<data.conceptos.funcionesencabezado.length;j++){
                    var funEncabezado = data.conceptos.funcionesencabezado[j];
                    cmbFuncionConcepto.append(
                        $('<option>').attr({title:funEncabezado.descripcion, value:funEncabezado.idfuncion}).text(funEncabezado.nombre)
                    );
                }

                definicionModelo.funcionesconceptos = data.conceptos.funcionesconceptos;
                var cmbFuncionesConceptos = $('#cmbFuncionesConceptos');
                cmbFuncionesConceptos.append( $('<option>').val(-1).text('Seleccione una opción') );
                for(var k=0;k<data.conceptos.funcionesconceptos.length;k++){
                    var item = data.conceptos.funcionesconceptos[k];
                    cmbFuncionesConceptos.append(
                        $('<option>').attr({title:item.descripcion, value:item.idfuncion}).text(item.nombre)
                    );
                }
            break;
        }
    },

    /**
     * Configura el autocomplete para buscar los conceptos que ya están parametrizados y se pueden editar.
     * @returns {void}
     */
    configurarFiltroConceptos:function(){
        var txtConcepto = $('#txtConcepto');
        __dom.configurarAutocomplete(
            txtConcepto,
            that.fuenteAutoCompleteConceptos,
            function(event, ui) {
                definicionModelo.idConcepto = ui.item.idVal;
                that.mostrarConceptosCompleto(ui.item.todo);
            },
            function(txt) {
                var valTemp = txt.val();
                that.limpiarFormulario();
                definicionModelo.idConcepto = null;
                txt.val(valTemp);
            }
        );
    },

    /**
     * Valida que un concepto esté seleccionado en el filtro de conceptos (en el autocomplete)
     * @returns {void}
     */
    validarExistencia: function() {
        if (definicionModelo.idConcepto === null || definicionModelo.idConcepto === undefined) {
            __dom.lanzarAlerta('Debe seleccionar un concepto.', __app.mensajes.atencion, function(){
                that.limpiarFormulario();
                $('#txtConcepto').click();
            });
        }
    },

    /**
     * Valida el Alias que se asigna al concepto, para que no se pueda duplicar en la base de datos.
     * @returns {void}
     */
    validarAlias:function(){
        var alias = $('#txtAlias').val();
        var aliasOriginal = $('#txtAlias').attr('data-alias');
        if (alias !== '') {
            if (alias !== aliasOriginal) {
                definicionControl.validarAlias({alias:alias}, function(data){
                    if (data.codigoRespuesta===-1) {
                        $('#txtAlias').focus().select();
                        return;
                    }
                });
            }
        }else{
            __dom.lanzarAlerta('El alias no puede estar vacío', __app.mensajes.atencion);
        }
    },

    /**
     * Se ejecuta cuando se despliega el autocomplete del filtro de conceptos.
     * @param  {Object} data Respuesta del servidor
     * @returns {void}
     */
    mostrarResultadoFiltroConceptos: function(data) {
         switch(data.codigoRespuesta){
             case 1:
                 var result = [];
                 $.each(data.conceptos, function(i, item) {
                     result.push({
                         label: item.nombre,
                         value: item.nombre,
                         idVal: item.idconcepto,
                         todo: item
                     });
                 });
                 that.response(result);
             break;
             case 0:
                     __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
             break;
         }
    },


    /**
     * Toma la información del concepto seleccionado y la carga en los controles de la interfaz.
     * @param  {Object} data Respuesta del servidor con la información del concepto.
     * @returns {void}
     */
    mostrarConceptosCompleto: function(data) {

        that.limpiarFormulario();

        definicionModelo.conceptoPrincipal = data;
        definicionModelo.conceptoPrincipal.accion = 'A';
        definicionControl.consultarConcepto({idconcepto:data.idconcepto}, that.onConsultarDetallesConceptoCompleto);
        that.cargarTablaConceptos();

        var cabecera = $('#divConceptoPrincipal');
        cabecera.find('input[type=text], select').removeAttr('disabled');

        $('#txtAlias').val(data.alias).attr('data-alias', data.alias);
        $('#txtAbreviatura').val(data.abreviatura);
        $('#cmbTipoCalculo').val(data.tipcalculo);
        $('#cmbOperacion').val(data.operacion);
        $('#cmbPreliquidar').val(data.preliquidar);
        $('#cmbAnticipo').val(data.anticipo);
        $('#cmbPrioridad').val( (data.pagprioridad===null || data.pagprioridad===undefined) ? '-1' : data.pagprioridad );
        $('#cmbFinanciable').val(data.financiable);
        $('#cmbAplica').val('-1');
        $('#cmbConcepto').val(data.campoconcepto);
        $('#cmbEstado').val(data.estado);
        $('#txtValor').val(data.valor);
        $('#cmbCondonable').val(data.condonable);
        $('#cmbNulo').val(data.nulo);
        $('#cmbAplica').val(data.idprograma);
        $('#cmbConceptoInteres').val(data.interes);
        $('#cmbSuspende').val(data.suspende);
        $('#cmbFuncionConcepto').val((data.idfuncion)?data.idfuncion:-1);
        
        ////Valida la fecha inicial cuando se consulta el concepto
        definicionControl.obtenerFechaConcepto(data.fechainicialvigencia, $('#txtFechaInicial')).change();
        
        ////Valida la fecha final cuando se consulta el concepto
        definicionControl.obtenerFechaConcepto(data.fechafinalvigencia, $('#txtFechaFinal'));
        
        if (data.tipcalculo === 'F') {
            $('#txtValor').attr('disabled', 'disabled');
            if (data.formula) {
                that.consutrirFormulaDesdeJSON( JSON.parse(data.formula) );
                definicionModelo.formula = that.formulaActual;
            }
            $('#txtConceptoRango').val(data.nombre);
        } else {
            $('#txtValor').removeAttr('disabled');
        }

        $('#cmbAjuste').val(data.ajuste).change();
        
        if (data.ajuste === 'R') {
            $('#cmbPrecision').val(data.redondeo);
        }


        that.mostrarPanelConstruirFormula();
        //$('#divPestanias').show();
    },


    /**
     * Se ejecuta cuando se termina de cargar los detalles del concepto seleccionado y carga la información del modelo.
     * @param  {Object} data Respuesta del servidor con los datos del concepto
     * @returns {void}
     */
    onConsultarDetallesConceptoCompleto:function(data){
        switch(data.codigoRespuesta){
            case 0:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
            break;
            case 1:
                definicionModelo.conceptosRelacionados = data.conceptos.conceptosrelacionados;
                definicionModelo.conceptosSeleccionar = data.conceptos.listaconceptosdiferentes;
                definicionModelo.rangos = data.conceptos.rangoconceptos;
                /*
                definicionModelo.contabilizaciones = data.conceptos.causioncontable.contabilizacion;
                definicionModelo.areasdenegocio = data.conceptos.causioncontable.areanegocio;
                definicionModelo.tiposSuscripcion = data.conceptos.causioncontable.tiposuscripcion;
                definicionModelo.centrosdecosto = data.conceptos.causioncontable.centrocosto;
                definicionModelo.contabilizacionesCruce = data.conceptos.recaudo.contabilizacioncruce;
                definicionModelo.contabilizacionesAnticipos = data.conceptos.recaudo.contabilizacionanticipo;
                */
                $('#divRangos').show();

                if (definicionModelo.conceptosRelacionados && definicionModelo.conceptosRelacionados.length>0) {
                    //that.cargarTablaConceptos();
                    for(var i in definicionModelo.conceptosRelacionados){
                        definicionModelo.conceptosRelacionados[i].accion = 'A';
                    }
                    that.cargarTablaConceptosRelacionados();
                }

                if (definicionModelo.conceptosSeleccionar && definicionModelo.conceptosSeleccionar.length>0) {
                    that.cargarTablaConceptos();
                }

                if (definicionModelo.rangos && definicionModelo.rangos.length>0) {
                    for(var j in definicionModelo.rangos){
                        definicionModelo.rangos[j].accion = 'A';
                        definicionModelo.rangos[j].persiste = true;
                        definicionModelo.rangos[j].idconcepto = definicionModelo.conceptoPrincipal.idconcepto;
                    }
                    that.llenarTablaRangos();
                }
                /*
                if(definicionModelo.contabilizaciones && definicionModelo.contabilizaciones.length > 0){
                    that.cargarTablaContabilizaciones();
                }

                if(definicionModelo.areasdenegocio && definicionModelo.areasdenegocio.length > 0){
                    that.cargarTablaAreasNegocio();
                }

                if(definicionModelo.tiposSuscripcion && definicionModelo.tiposSuscripcion.length > 0){
                    __dom.llenarCombo('#cmbTipoSuscripcionAN', definicionModelo.tiposSuscripcion, 'idtiposuscripcion', 'nombre');
                }

                if(definicionModelo.centrosdecosto && definicionModelo.centrosdecosto.length > 0){
                    that.cargarTablaCentrosCosto();
                }

                if(definicionModelo.contabilizacionesCruce && definicionModelo.contabilizacionesCruce.length > 0){
                    that.cargarTablaContabilizacionesCruce();
                }

                if(definicionModelo.contabilizacionesAnticipos && definicionModelo.contabilizacionesAnticipos.length > 0){
                    that.cargarTablaContabilizacionesCruce();
                }
                */
            break;
        }
    },


    /**
     * Carga la tabla de conceptos que se pueden relacionar al concepto principal|
     * @returns {void}
     */
    cargarTablaConceptos:function(){
        that.mostrarPanelConstruirFormula();
        $('.cmbConceptos').html('');

        if(definicionModelo.conceptosRelacionados){
            for (var i = 0; i < definicionModelo.conceptosRelacionados.length; i++) {
                var concepto = definicionControl.obtenerConceptoPorId(definicionModelo.conceptosRelacionados[i].idconceptorelacionado);
                if(concepto){
                    concepto.accion = 'A';
                    that.actualizarPanelFormulas(definicionModelo.conceptosRelacionados[i].idconceptorelacionado, 'A'); //agregar boton
                }else{
                    console.info('El concepto relacionado '+definicionModelo.conceptosRelacionados[i].idconceptorelacionado+' no está en la lista de conceptos a seleccionar<br />');
                }
            }
        }

        $('#botonesConcepto, #divParametrosConceptos').html('');
        $('#tblAgregarConcepto').dataTable({
            'data':definicionModelo.conceptosSeleccionar,
            'columns':definicionModelo.colsConceptosAsociar,
            'language':{ url: '/achagua/sistema/web/bundles/Llanogas/js/facturacion/Spanish.json' },
            'fnRowCallback':that.onRenderFilaConceptosAsociar,
            'destroy':true
        });
        $('#divConceptosRelacionados').show();
    },


    /**
     * Carga la tabla de conceptos relacionados al concepto principal
     * @param  {null} data Parámetro no utilizado
     * @returns {void}
     */
    cargarTablaConceptosRelacionados:function(data){
        if(definicionModelo.conceptosRelacionados && definicionModelo.conceptosRelacionados.length>0){
            $('#divConceptosRelacionados').show();
            var tabla = fillTable('tblConceptosSeleccinados', 'formatoConceptoSeleccionado', definicionModelo.conceptosRelacionados);
            tabla.find('tbody tr td[header="thFuncionConcepto"] select').on('change', that.actualizarFuncionConceptoSeleccionado);    
        }else{
            $('#tblConceptosSeleccinados').empty();
        }
    },

    /**
     * Actualiza la referencia de la función de un concepto seleccionado en el modelo
     * @returns {void}
     */
    actualizarFuncionConceptoSeleccionado:function(){
        var cmb = $(this);
        if(cmb.val()!=='-1'){
            var indice = parseInt(cmb.parent().parent().attr('data-fila'));
            definicionModelo.conceptosRelacionados[indice].idfuncion = parseInt(cmb.val());
            return;
        }

    },


    /**
     * Llena la tabla de rangos y configura los botones de editar y borrar de la misma tabla.
     * @returns {void}
     */
    llenarTablaRangos:function(){
        if(definicionModelo.rangos.length > 0){
            var tabla = fillTable('tblRangos', 'formatoRango', 'definicionModelo.rangos', '').show();
            tabla.find('td[header="thEditar"] input[type="button"]').on('click', that.editarRango);
            tabla.find('td[header="thBorrar"] input[type="button"]').on('click', that.borrarRango);
        }else{
            $('#tblRangos').empty();
        }
    },

    /**@deprecated Candidato a Borrar */
    mostrarAreaNegocio:function(data){
        switch(data.codigoRespuesta){
            case 1:
                 // FIXME: pendiente
            break;
            case 0:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
            break;
        }
    },

    /**@deprecated Candidato a Borrar */
    mostrarCentroCosto:function(data){
        switch(data.codigoRespuesta){
            case 1:
                 // FIXME: pendiente
            break;
            case 0:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
            break;
        }
    },

    /**
     * Muestra el panel para construir fórmulas, si el tipo de cálculo es F, de lo contrario lo oculta.
     * @returns {void}
     */
    mostrarPanelConstruirFormula: function() {
        if(definicionModelo.conceptoPrincipal || $('#cmbConceptosNuevos').val() !== null ){

            if ($('#cmbTipoCalculo').val() === 'F') {
                $('#divConstructor').show();
                $('#txtValor').attr('disabled', 'disabled').val('');
                $('#txtConceptoRango').val(definicionModelo.conceptoPrincipal.nombre);
                $('#divRangos').show();

            } else {
                $('#divConstructor').hide();
                $('#divRangos').hide();
                $('#txtValor').removeAttr('disabled');
            }
        }
    },

    /**
     * Se ejecuta cuando un concepto es seleccionado, actualiza el panel de fórmulas y la tabla de conceptos relaciondos.
     * También valida si se quita la selección del concepto, entonces valida la fórmula e indica las consecuencias de borrar el concepto, con respecto a la fórmula existente
     * @returns {void}
     */
    onConceptoChequeado:function(){
        var check = $(this);
        var idConcepto = parseInt(check.attr('data-idconcepto'));
        var persiste = (check.attr('data-persiste')!==undefined) ? true : false;
        check.parent().parent().toggleClass('selected');
        if (check.prop('checked')) {
            definicionControl.agregarConceptoRelacionado(idConcepto, persiste);
            that.actualizarPanelFormulas(idConcepto, 'A'); //agregar boton
            that.cargarTablaConceptosRelacionados();
        }else{
            definicionModelo.formula = that.formulaActual; //se actualiza la fórmula del modelo para hacer la validacion de los conceptos
            var conceptosUsandosEnFormula = definicionControl.contarConceptoFormulaPorId(idConcepto, definicionModelo.formula);

            var conceptosUsadosEnRangos = 0;
            var rangosConConcepto = '';
            var indicesRangos = [];

            if(definicionModelo.rangos && definicionModelo.rangos.length>0){
                for(var r in definicionModelo.rangos){
                    var rango = definicionModelo.rangos[r];
                    if(rango.formula){
                        var re = definicionControl.contarConceptoFormulaPorId(idConcepto, JSON.parse(rango.formula));
                        if(re>0){
                            rangosConConcepto += '<li> &nbsp;&nbsp;'+ (parseInt(r)+1) +'. Entre '+rango.rangoinicial+' y '+rango.rangofinal+'</li>';
                            conceptosUsadosEnRangos += re;
                            indicesRangos.push(r);
                        }
                    }
                }
            }

            if (conceptosUsandosEnFormula > 0 || conceptosUsadosEnRangos > 0) {
                var _dialogo = $('#divConfimacionQuitarConcepto');
                _dialogo.find('p').html(
                        ((conceptosUsandosEnFormula > 0) ? 'Se encontraron <b>'+ conceptosUsandosEnFormula +'</b> coincidencias del concepto en la fórmula principal <br/>' : '' )+
                        ((conceptosUsadosEnRangos > 0) ? 'Se encontraron <b>'+conceptosUsadosEnRangos+'</b> coincidencias  en los siguientes rangos: <ul>'+rangosConConcepto+'</ul>' : '' )+
                        ('Si acepta remover, <b>la(s) fómula(s) y/o los rangos con este concepto será(n) eliminada(as/os)</b>.<br/>Se recomienda modificar la(s) fórmula(s) antes de remover el concepto.'));
                _dialogo.dialogo({
                    modal: true,
                    width: 650,
                    title: 'Precaución',
                    buttons: {
                        Aceptar: function(){
                            definicionModelo.formula = that.formulaActual = [];
                            $('.divFormula').html('');
                            that.aceptaOperador = false;
                            that.actualizarPanelFormulas(idConcepto, 'E');
                            //////quitar el concepto del arreglo de conceptos relacionados y llenar la tabla de conceptos relacionados
                            definicionControl.removerConceptoSeleccionado(idConcepto, persiste, (indicesRangos.length>0)?indicesRangos:undefined );
                            if(conceptosUsadosEnRangos > 0){
                                that.llenarTablaRangos();
                            }
                            that.cargarTablaConceptosRelacionados();
                            _dialogo.dialog('close');
                        },
                        Cancelar: function() {
                            _dialogo.dialog('close');
                            check.click();
                            return;
                        }
                    }
                });
            }else{
                definicionControl.removerConceptoSeleccionado(idConcepto, persiste);
                that.cargarTablaConceptosRelacionados();
                that.actualizarPanelFormulas(idConcepto, 'E');
            }
        }
        that.actualizarPanelFormulas();
    },


    /**
     * Valida la acción que se envía y agrega o remueve el concepto al panel de fórmulas.
     * @param  {Number} idConcepto El id del concepto que se va a agregar
     * @param  {String} accion     A: para agregar un concepto, de lo contrario se borra
     * @returns {void}
     */
    actualizarPanelFormulas:function(idConcepto, accion){
        var content = $('.cmbConceptos');
        if (accion==='A') {
            //agregar el concepto al combo
            if (content.find('option[data-idconcepto="'+idConcepto+'"]').length===0) {
                var concepto = definicionControl.obtenerConceptoPorId(idConcepto);
                if(concepto){
                    var opcion = $('<option>').text(concepto.nombre);
                    opcion.attr({'data-idconcepto': idConcepto, 'data-alias':concepto.alias});
                    content.append(opcion);
                }else{
                    console.info('error con el concepto '+idConcepto);
                }

            }
        }else{
            content.find('option[data-idconcepto="'+idConcepto+'"]').remove();
        }
    },

    /**
     * Valida el concepto seleccionado y el objto que invoca al método, para agregar el concepto a la fórmula.
     * También valida si es posible agregar el concepto en la fórmula por la sintaxis actual o si se agrega como parámetro de una función.
     * @param  {Object} _con Objeto con la información del concepto
     * @returns {void}
     */
    agregarConceptoAFormula:function(_con){
        var concepto = {};
        var _concepto = that.divContenedorFormula.find('.cmbConceptos option:selected');
        if (_con instanceof jQuery.Event) {
            if (_concepto.length>0) {
                concepto.alias = _concepto.attr('data-alias');
                concepto.idconcepto = _concepto.attr('data-idconcepto');
            }else{
                return;
            }
        }else{
            concepto = _con;
            concepto.alias = _con.valor;
        }
        var inputSeleccionado = that.divFormulaActual.find('input.inputSeleccionado');
        if (inputSeleccionado.length > 0 && inputSeleccionado.attr('data-tipo') === 'parametro') {
            inputSeleccionado.val(concepto.alias)
                             .attr('data-campo', 'concepto')
                             .attr('data-idconcepto', concepto.idconcepto)
                             .removeClass('inputSeleccionado');
            that.actualizarItemsFormulaPorInput(inputSeleccionado);
            return;
        }

        if (!that.aceptaOperador) {
            that.formulaActual.push({valor:concepto.alias, tipo:'con', idconcepto:concepto.idconcepto});
            var span = $('<span>').text(concepto.alias);
            span.addClass('concepto');
            span.attr({'data-alias':concepto.alias, 'data-idconcepto':concepto.idconcepto});
            that.divFormulaActual.append(span);
            that.aceptaOperador = true;
        }
    },

    /**
     * Valida si la sintaxis de la fórmula permite agregar un nuevo concepto a la fórmula y si es válido, agrega el operador como HTML y al objeto formulaActual 
     * @param  {Object} _op Objeto con la información del operador aritmético.
     * @returns {void}     
     */
    agregarOperadorAFormula:function(_op){
        var op = ( (typeof _op) === 'object' )? $(this).text() : _op;
        if (that.aceptaOperador && that.formulaActual[that.formulaActual.length-1].tipo!=='parAbre'&& that.formulaActual[that.formulaActual.length-1].tipo!=='op') {
            var divFormula = that.divFormulaActual;
            that.formulaActual.push({valor:op, tipo:'op'});
            var nuevoOperador = $('<span>').addClass('operador').text(op);
            divFormula.append(nuevoOperador);
            that.aceptaOperador = false;
        }
        return;
    },

    /**
     * Valida la fórmula y agrega un paréntesis de apertura o cierre
     * @param  {Object|String} _par Objeto que puede ser un evento de jQuery o un String
     * @returns {void}
     */
    agregarParentesis:function(_par){
        var txt = (_par instanceof jQuery.Event)? $(this).text(): _par;
        var tam = that.formulaActual.length;
        var ultimoItemFormula = that.formulaActual[tam-1];
        if ( txt===')' && (tam===0 || ultimoItemFormula.tipo==='op') ) {
            return false;
        }
        if ( txt ==='(' && (tam > 0 && (ultimoItemFormula.tipo!=='op' && ultimoItemFormula.tipo!=='parAbre')) ) {
            return false;
        }
        that.divFormulaActual.append($('<span>').addClass('parentesis').text(txt));
        that.formulaActual.push({valor:txt, tipo:(txt==='(')?'parAbre':'parCierra'});
    },

    /**
     * Remueve el último valor agregado a la fórmula, puede ser un concepto, un número, un paréntesis, un operador o una función.
     * @returns {void}
     */
    borrarValorAFormula:function(){
        if (that.formulaActual.length>0) {
            that.divFormulaActual.find('span:last').remove();
            that.formulaActual.pop();
            var ultimoItemFormula = that.formulaActual[that.formulaActual.length-1];
            if (!!ultimoItemFormula && ultimoItemFormula.tipo !== 'op') {
                that.aceptaOperador = true;
            }else{
                that.aceptaOperador = false;
            }
        }
    },


    /**
     * Agrega un valor numérico a la fórmula
     * @param  {Object|Number} _valor Puede ser un evento de jQuery o un texto que se agrega directamente a la fórmula.
     * @returns {void}
     */
    agregarValorAFormula:function(_valor){
        var txtValorNumerico = that.divContenedorFormula.find('.txtValorNumerico');
        var valor = 0;
        if (_valor instanceof jQuery.Event) {
            valor = txtValorNumerico.val();
        }else{
            valor = _valor;
        }
        var inputSeleccionado = that.divFormulaActual.find('input.inputSeleccionado');
        if (inputSeleccionado.length > 0) {
            inputSeleccionado.val(valor).attr('data-campo', 'valor').removeClass('inputSeleccionado');
            inputSeleccionado.removeAttr('data-idconcepto');
            that.actualizarItemsFormulaPorInput(inputSeleccionado);
            txtValorNumerico.val('');
            return;
        }

        if (!that.aceptaOperador && valor!=='') {
            that.formulaActual.push({valor:valor, tipo:'valor'});
            var pos = that.formulaActual.length-1;
            txtValorNumerico.val('');
            var contentValor = $('<span>').addClass('valor');
            var input = $('<input>').attr({type:'input', 'data-indice': pos, 'data-tipo':'valor', 'readonly':'readonly'});
            input.on('click', that.onClickInputFormula);

            __dom.configurarTextoNumerico(input, true, true, true);
            input.val(valor);
            contentValor.append(input);
            that.divFormulaActual.append(contentValor);
            that.actualizarItemsFormulaPorInput(input);
            that.aceptaOperador = true;
        }
        return;
    },

    /**
     * Ajusta el ancho de los inputs de la la fórmula
     * @param  {Object} input Elemento convertido a objeto de jQuery
     * @returns {void}
     */
    ajustarAnchoInput:function(input){
        var ancho = 8;
        var val = input.val().length;
        input.css('width', (ancho*val<20)?20:ancho*val);
    },

    /**
     * Actualiza un elemento de la fórmula de acuerdo a la información del input que dispara el evento de actualización.
     * @param  {Object} input El input que dispara el evento.
     * @returns {void}
     */
    actualizarItemsFormulaPorInput:function(input){
        if (input.attr('data-tipo')==='valor') {
            that.formulaActual[parseInt(input.attr('data-indice'))].valor = input.val();
        }else{
            var strIndice = input.attr('data-indice').split('-');
            var indiceFx = parseInt(strIndice[0]);
            var indiceParam = parseInt(strIndice[1]);
            that.formulaActual[indiceFx].params[indiceParam] = {valor:input.val(), tipo:input.attr('data-campo')};
            if (input.attr('data-campo') === 'concepto') {
                that.formulaActual[indiceFx].params[indiceParam].idconcepto = input.attr('data-idconcepto');
            }
        }
        input.removeClass('inputSeleccionado');
        that.ajustarAnchoInput(input);
    },

    /**
     * Se ejecuta cuando un input de la fómula es seleccionado, esto se hace para actualizar la información del input en la fórmula actual
     * @returns {void}
     */
    onClickInputFormula:function(){
        var input = $(this);
        var esValor = (input.attr('data-campo') === 'valor' || input.attr('data-tipo') === 'valor');
        if (input.hasClass('inputSeleccionado')) {
            input.removeClass('inputSeleccionado');
            if (esValor) {
                that.divContenedorFormula.find('.txtValorNumerico').val('');
            }
            return;
        }
        that.divFormulaActual.find('.inputSeleccionado').removeClass('inputSeleccionado');
        input.addClass('inputSeleccionado');
        that.divContenedorFormula.find('.txtValorNumerico').val( esValor ? input.val() : '');
    },

    /**
     * Valida la fórmula para determinar si por sintaxis es posible agregar una función
     * Si todo es correcto, entonces agrega la función a la fórmula
     * @param  {object} _fun La información de la función que se va a agregar
     * @returns {void}
     */
    agregarFuncionAFormula:function(_fun){
        var _fx = {};
        if (_fun instanceof jQuery.Event) {
            funcion = that.divContenedorFormula.find('.cmbFunciones option:selected');
            if (funcion.length > 0) {
                _fx.valor = funcion.text();
                _fx.params = new Array( parseInt(funcion.attr('data-parametros')) );
                _fx.tipo = 'fun';
            }else{
                return;
            }
        }else{
            _fx = _fun;
        }

        if (!that.aceptaOperador) {
            var pos = that.formulaActual.length;
            var spanFx = $('<span>').addClass('funcion').attr('data-funcion', _fx.valor);
            spanFx.append( $('<i>').text(_fx.valor+'(') );
            if (_fx.params.length>0) {
                for (var i = 0; i < _fx.params.length; i++) {
                    var parametro = _fx.params[i];
                    var input = $('<input>').attr({'data-indice': pos+'-'+i, 'type':'text', 'data-tipo':'parametro', 'readonly':'readonly'});
                    if (parametro!==undefined) {
                        input.attr('data-campo', parametro.tipo);
                        input.val(parametro.valor);
                        that.ajustarAnchoInput(input);
                    }else{
                        _fx.params[i] = {'tipo':'valor', 'valor':0 };
                        input.attr('data-campo', 'param');
                        input.val(0);
                    }
                    __dom.configurarTextoNumerico(input, true, true, false);
                    input.on({
                        'click': that.onClickInputFormula
                    });
                    spanFx.append(input);
                    if (i+1 < _fx.params.length) {
                        spanFx.append( $('<i>').text(', ') );
                    }
                }
            }
            that.formulaActual.push(_fx);
            spanFx.append( $('<i>').text(')') );
            that.divFormulaActual.append(spanFx);
            that.aceptaOperador = true;
        }
    },

    /**
     * Se ejecuta cuando se termina de cargar la fila de los conceptos que se pueden asociar al concepto principal,
     * Sirve para configurar los eventos de la fila de la tabla.
     * @param  {Objet} fila La fila donde se agrega el concepto
     * @param  {Object} data La información del concepto
     * @returns {void}
     */
    onRenderFilaConceptosAsociar:function(fila, data){
        fila = $(fila);
        fila.attr('data-id', data.idconcepto);
        var check = fila.find('input[type="checkbox"]');
        if (check.attr('data-idconcepto')===undefined) {
            check.on('click', that.onConceptoChequeado);
            check.attr('data-idconcepto', data.idconcepto);

            if(definicionModelo.conceptosRelacionados){
                for (var i = 0; i < definicionModelo.conceptosRelacionados.length; i++) {
                    var concepto = definicionModelo.conceptosRelacionados[i];
                    if (concepto.idconceptorelacionado === data.idconcepto) {
                        check.attr('data-persiste', true);
                        check.prop('checked', true);
                        fila.toggleClass('selected');
                        break;
                    }
                }
            }
        }
    },

    /**
     * Valida la fórmula, para determinar si la sintaxis es correcta y si se está haciendo uso de los conceptos relacionados.
     * @returns {void}
     */
    validarAgregarFormula:function(){
        definicionModelo.formula = that.formulaActual;
        if (definicionModelo.formula.length>0) {
            try{
                that.validarEstructuraFormula(that.formulaActual);
            }catch(error){
                __dom.lanzarAlerta(error, __app.mensajes.atencion);
                that.limpiarTablaConceptosRelacionados();
                return;
            }

            var conceptosSinUsar = definicionControl.contarConceptosSinUsar();
            if (conceptosSinUsar!==true && conceptosSinUsar.length>0) {
                var mensaje = 'Hay '+conceptosSinUsar.length+' conceptos sin usar: ';
                for (var i = 0; i < conceptosSinUsar.length; i++) {
                    mensaje += '<br/>'+(i+1)+'. <b>'+conceptosSinUsar[i].conceptorelacionado+'</b>';
                }
                mensaje += '<br />Si desea agregar la fórmula sin estos conceptos, presione clic en Aceptar, de lo contrario presione Cancelar y vuelva a validar la fórmula';
                __dom.lanzarAlerta(mensaje, __app.mensajes.atencion,
                    function(){  //ACEPTAR
                        definicionModelo.formula = that.formulaActual;
                        //se debe cargar la tabla con los conceptos que hacen parte de la fórmula
                        that.cargarTablaConceptosRelacionados();
                    },
                    function(){  //CANCELAR
                        that.limpiarTablaConceptosRelacionados();
                        return;
                    });
            }
            //se carga la tabla con todos los conceptos seleccionados
            that.cargarTablaConceptosRelacionados();
            __dom.lanzarAlerta('La fórmula es correcta', __app.mensajes.atencion);

        }else{
            __dom.lanzarAlerta('Debe agregar una fórmula', __app.mensajes.atencion);
            that.limpiarTablaConceptosRelacionados();
            return;
        }
    },


    /**
     * Limpia la tabla de conceptos relacionados
     * @returns {void}
     */
    limpiarTablaConceptosRelacionados:function(){
        $('#tblConceptosSeleccinados').html('');
    },


    /**
     * Valida la sintaxis de la fórmula, evaluándola y esperando como resultado un valor numérico.
     * @param  {Array} formula El arreglo que tiene todos los datos separados de la fórmula actual
     * @returns {Boolean}         Si es válida, retorna true, de lo contrario lanza una excepción.
     */
    validarEstructuraFormula:function(formula){
        var str = '';
        for(var i=0;i<formula.length;i++){
            var item = formula[i];
            if(item.tipo==='valor' || item.tipo==='op' || item.tipo==='parAbre' || item.tipo==='parCierra'){
                str += item.valor;
            }else if(item.tipo === 'con'){
                str += 1;
            }else if(item.tipo==='fun'){

                for(var j=0;j<item.params;j++){
                    if(item.params[j].valor===''){
                        throw new Error('El '+j+'º parámetro de la función '+item.valor+' está vacío');
                    }
                }

                str += 1;

            }else{
                throw new Error('Hay un valor errado en la fórmula');
            }
        }

        try{
            var resultado = eval(str);
            if(typeof resultado === 'number'){
                return true;
            }
        }catch(error){
            throw new Error('Fórmula inválida, revísela e intente de nuevo');
        }
    },

    /**
     * Determina la forma en que se debe acumular el concepto
     * @returns {void}
     */
    valirComoAcumula:function(){
        var cmbAcumula = $(this);
        var opcion = cmbAcumula.val();
        var txtAcumula = $('#txtCantAcumula');
        switch (opcion) {
            case 'I':
                txtAcumula.attr('disabled', 'disabled').val('');
                break;
            case 'A':
                txtAcumula.attr('disabled', 'disabled').val('0');
                break;
            case '-1':
                txtAcumula.attr('disabled', 'disabled').val('');
                break;
            default:
                txtAcumula.removeAttr('disabled').val('');
                break;
        }
    },


    /********************** FUENTES DE DATOS PARA AUTOCOMPLETE *********************/

    /**
     * Función para controlar el origgen de datos del autocomplete de filtro de conceptos por nombre
     * @param  {Object} request  
     * @param  {Object} response 
     * @returns {void}          
     */
    fuenteAutoCompleteConceptos:function (request, response) {
        that.request = request;
        that.response = response;
        var datos = {};
        datos.nombre = request.term.trim();
        definicionControl.consultarConceptoNombre(datos, that.mostrarResultadoFiltroConceptos);
    },

    /**
     * Se ejecuta cuando se terminan de consultar las liquidaciones, llena el combo de liquidaciones.
     * @param  {Object} data Respuesta del servidor
     * @returns {void}      
     */
    onConsultarLiquidacionCompleto:function(data){
        switch(data.codigoRespuesta){
            case 1:
                definicionModelo.liquidaciones = data.liquidacion;
                __dom.llenarCombo('#cmbLiquidacion', data.liquidacion, 'idliquidacion', 'nombre');
            break;
            case 0:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
            break;
        }
    },

    /**
     * Se ejecuta cuando se terminan de consultar los documentos, llena el combo de documentos. 
     * @param  {Object} data Respuesta del servidor.
     * @returns {void}
     */
    onConsultarDocumentoCompleto:function(data){
        switch(data.codigoRespuesta){
            case 1:
                __dom.llenarCombo('#cmDocumento', data.documentos, 'iddocumento', 'documento');
            break;
            case 0:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
            break;
        }
    },

    /**
     * Se ejecuta cuando se terminan de consultar los tipos de documento, llena el combo de tipos de documentos. 
     * @param  {Object} data Respuesta del servidor.
     * @returns {void}
     */
    onConsultarTipoDocumentoCompleto:function(data){
        switch(data.codigoRespuesta){
            case 1:
                __dom.llenarCombo('#cmbTipoDocumento', data.tipodocumento, 'idtipodocumento', 'tipodocumento');
            break;
            case 0:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
            break;
        }
    },

    /**
     * Agrega un nuevo rango a la colección de rangos del concepto principal
     * @returns {void} 
     */
    agregarRango:function(){
        var valorFormula = $('#txtValorFormula').val().trim();
        var accion = $('#cmbAccionRango').val();
        var rangoIncicial = parseFloat( $('#txtRangoInicial').val() );
        var rangoFinal = parseFloat( $('#txtRangoFinal').val() );
        if (that.validarRangos(rangoIncicial, rangoFinal, accion, valorFormula)) {
            var rango = {
                idrango:null,
                accion: 'I',
                rangoinicial: rangoIncicial,
                rangofinal: rangoFinal,
                idconcepto: definicionModelo.conceptoPrincipal.idconcepto
            };
            if (accion==='F') {
                rango.formula = $('#txtValorFormula').attr('data-text');
                rango.valor = null;
            }else{
                rango.formula = null;
                rango.valor = parseFloat(valorFormula);
            }

            rango.tipo = accion;
            definicionModelo.rangos.push(rango);
            that.llenarTablaRangos();

            $('#txtRangoInicial, #txtRangoFinal').val('');
            $('#cmbAccionRango').val('-1');
            $('#txtValorFormula').val('').attr('data-text', '');
        }
    },

    /**
     * Edita un rango seleccionado de la tabla de rangos.
     * @returns {void} 
     */
    editarRango:function(){
        var btn = $(this);
        var indiceRango = parseInt( btn.parent().parent().attr('data-fila') );
        $('#btnActualizarRango, #btnCancelarActualizarRango').show();
        var rangoEditar = definicionModelo.rangos[indiceRango];

        $('#txtRangoInicial').val(rangoEditar.rangoinicial);
        $('#txtRangoFinal').val(rangoEditar.rangofinal);
        if (rangoEditar.valor !== null) {
            $('#cmbAccionRango').val('V');
            $('#txtValorFormula').val(rangoEditar.valor).removeAttr('disabled');
            $('#btnEditarFormulaRango').hide();
        }else{
            $('#cmbAccionRango').val('F');
            $('#txtValorFormula').val( that.formulaJSONAaString(rangoEditar.formula) ).attr('disabled', 'disabled').attr('data-text', rangoEditar.formula);
            $('#btnEditarFormulaRango').show();
        }

        if (btn.attr('data-id') !== null) {
            $('#btnActualizarRango').attr('data-indice', indiceRango);
        } else {
            $('#btnActualizarRango').attr('data-indice', 'null');
        }
    },


    /**
     * Actualiza un rango determinado con base en los valores de rango inicial y rango final
     * @returns {void}
     */
    actualizarRango:function(){
        var rangoIncicial = parseFloat($('#txtRangoInicial').val());
        var rangoFinal = parseFloat($('#txtRangoFinal').val());
        var valorFormula = $('#txtValorFormula').val().trim();
        var accion = $('#cmbAccionRango').val();
        var _this = $(this);
        var indiceRangoEditar = _this.attr('data-indice');
        if (that.validarRangos(rangoIncicial, rangoFinal, accion, valorFormula, indiceRangoEditar)) {
            var rango = {
                rangoinicial: rangoIncicial,
                rangofinal: rangoFinal,
                idconcepto: definicionModelo.conceptoPrincipal.idconcepto
            };

            if (definicionModelo.rangos[indiceRangoEditar].idrango!==null) {
                rango.idrango = definicionModelo.rangos[indiceRangoEditar].idrango;
                rango.accion = 'A';
                rango.persiste = true;
            }


            if (accion==='F') {
                rango.formula = $('#txtValorFormula').attr('data-text');
                rango.valor = null;
            }else{
                rango.formula = null;
                rango.valor = valorFormula;
            }
            rango.tipo = accion;
            definicionModelo.rangos[indiceRangoEditar] = rango;
            that.llenarTablaRangos();
            that.cancelarActualizacionRango();
        }
    },

    /**
     * Limpia la información de los rangos que haya en los formularios para agregar rangos.
     * @returns {void}
     */
    cancelarActualizacionRango:function(){
        $('#txtRangoInicial, #txtRangoFinal').val('');
        $('#cmbAccionRango').val('-1');
        $('#txtValorFormula').val('').attr('data-text', '');
        $('#btnActualizarRango, #btnCancelarActualizarRango').hide();
    },

    /**
     * Valida los valores de los rangos del concepto principal con base en los valores de inicio, fin y fórmula
     * @param  {Number} rangoIncicial     Valor del rango inicial
     * @param  {Number} rangoFinal        Valor del rango final
     * @param  {String} accion            -1: No hay acción seleccionada; V: Valor numérico; F: Fórmula
     * @param  {String} valorFormula      El valor o la fórmula que se validará
     * @param  {Number} indiceRangoOmitir Determina si un índice del arreglo de rangos debe ser omitido o no validado.
     * @returns {Boolean}                   True si el rango es válido, de lo contrario false.
     */
    validarRangos: function(rangoIncicial, rangoFinal, accion, valorFormula, indiceRangoOmitir) {
        $('#pMensajeRango').text('');
        if (rangoFinal < rangoIncicial || isNaN(rangoIncicial) || isNaN(rangoFinal)) {
            $('#pMensajeRango').text('Rango no válido');
            return false;
        }

        if (accion==='-1') {
            $('#pMensajeRango').text('Debe seleccionar una acción');
            return false;
        }else{
            if (accion==='V' && (valorFormula === '')) {
                $('#pMensajeRango').text('El valor debe ser numérico y diferente de vacío');
                return false;
            }else if(accion==='F' && valorFormula===''){
                $('#pMensajeRango').text('Debe diligenciar una fórmula' );
                return false;
            }
        }

        if($('#cmbAccionRango').val() === 'V' && isNaN(valorFormula)){
            $('#pMensajeRango').text('El valor del rango no es válido' );
            return false;
        }

        if(!definicionModelo.rangos){
            definicionModelo.rangos = [];
        }

        for (var i = 0; i < definicionModelo.rangos.length; i++) {
            var rango = definicionModelo.rangos[i];
            if (!!indiceRangoOmitir && i==indiceRangoOmitir) {
                continue;
            }
            if ( (rangoIncicial >= rango.rangoinicial && rangoIncicial <= rango.rangofinal) || ( rangoFinal <= rango.rangofinal && rangoFinal >= rango.rangoinicial ) || (rangoIncicial <= rango.rangoIncicial && rangoFinal >= rango.rangofinal)) {
                $('#pMensajeRango').html('').text('El rango ya existe o entra en conflicto con el rango cuyo Rango Inicial es '+rango.rangoinicial+' y Rango Final es '+rango.rangofinal);
                return false;
            }
        }

        return true;
    },

    /**
     * Solicita una confirmación al usuario para eliminar un rango determinado, si el usuario aprueba, se elimina el rango.
     * @returns {void}
     */
    borrarRango:function(){
        var _this = $(this);
        var tr = _this.parent().parent();
        var indiceFila = parseInt( tr.attr('data-fila') );
        var dialogo = $('div#divConfirmaRango');
        dialogo.dialogo({
            resizable: false,
            heigth: 150,
            modal: true,
            title: 'Confirmar eliminar',
            buttons: {
                'Eliminar': function() {
                    if (!!_this.attr('data-id')) {
                        var rango = {
                            idconcepto:definicionModelo.conceptoPrincipal.idconcepto,
                            accion: 'E',
                            idrango: _this.attr('data-id')
                        };
                        definicionModelo.rangosEliminar.push(rango);
                    }
                    definicionModelo.rangos.splice(indiceFila, 1);
                    that.llenarTablaRangos();
                    dialogo.dialog('close');
                }, Cancelar: function() {
                    $(this).dialog("close");
                }
            }
        });
    },

    /**
     * Valida la acción que se puede hacer con los rangos
     * @returns {void}
     */
    validarAccionRango:function(){
        var cmb = $(this);
        if (cmb.val()==='F') {
            $('#btnEditarFormulaRango').show();
            $('#txtValorFormula').val('').attr('disabled', 'disabled').attr('data-text', '');
        }else if(cmb.val() === 'V'){
            $('#txtValorFormula').val('').removeAttr('disabled').attr('data-text', '');
            $('#btnEditarFormulaRango').hide();
        }else{
            $('#txtValorFormula').val('').attr({'disabled': 'disabled', 'data-text':''});
            $('#btnEditarFormulaRango').hide();
        }
    },

    /**
     * Muestra el dialogo para las fórmulas de los rangos.
     * @returns {void}
     */
    mostrarDialogoFormula:function(){
        that.divContenedorFormula = $('div#divConstructorFormulaModal');
        that.divFormulaActual = that.divContenedorFormula.find('.divFormula');
        var txtFormula = $('#txtValorFormula');

        var btn = $(this);
        if (btn.attr('data-accion')==='I') {
            if (txtFormula.attr('data-text')!=='') {
                that.formulaActual = JSON.parse(txtFormula.attr('data-text'));
                that.consutrirFormulaDesdeJSON(that.formulaActual);
            }else{
                that.divFormulaActual.html('');
                that.formulaActual = [];
                that.validarOperadorActual();
            }
        }

        that.divContenedorFormula.dialogo({
            modal: true,
            width: 950,
            title: 'Fórmula',
            buttons: {
                Agregar: function() {
                    try{
                        if (that.validarEstructuraFormula(that.formulaActual)) {
                            txtFormula
                                .val( that.formulaJSONAaString( that.formulaActual ) )
                                .attr('data-text', JSON.stringify(that.formulaActual));
                            that.divContenedorFormula = $('#divPanelFormula');
                            that.formulaActual = definicionModelo.formula;
                            that.validarOperadorActual();
                            that.divFormulaActual = $('#divPanelFormula .divFormula');
                            $(this).dialog("close");
                        }
                    }catch(error){
                        __dom.lanzarAlerta(error, __app.mensajes.atencion);
                        return;
                    }

                },
                Cancelar: function() {
                    that.divContenedorFormula = $('#divPanelFormula');
                    that.formulaActual = definicionModelo.formula;
                    that.validarOperadorActual();
                    that.divFormulaActual = $('#divPanelFormula .divFormula');
                    $(this).dialog('close');
                }
            }
        });
    },

    /**
     * Valida el operador que se encuentra al final de la fórmula, para determinar si es posible agregar un valor numérico, concepto o función.
     * @returns {Boolean}
     */
    validarOperadorActual:function(){
        if (that.formulaActual.length > 0 && that.formulaActual[that.formulaActual.length-1].tipo!=='parAbre' && that.formulaActual[that.formulaActual.length-1].tipo!=='op') {
            that.aceptaOperador = true;
        }else{
            that.aceptaOperador = false;
        }
    },

    /**
     * Solicita confirmación para eliminar toda la información del formulario y limpiar todos los controles de la interfaz.
     * @returns {void} 
     */
    confirmarCancelar : function(){
        if(!!definicionModelo.conceptoPrincipal){
            var _this = $(this);
            var dialogo = $('div#divConfirmCancelar');
            dialogo.dialogo({
                resizable: false,
                heigth: 150,
                modal: true,
                title: 'Confirmar cancelar',
                buttons: {
                    'Aceptar': function() {
                        that.limpiarFormulario();
                        dialogo.dialog('close');
                    }, Cancelar: function() {
                        $(this).dialog("close");
                    }
                }
            });
        }
    },

    /**
     * Limpia toda la información de todos los controles de la interfaz y del modelo.
     * @returns {void}
     */
    limpiarFormulario:function(){
        that.aceptaOperador = false;
        definicionModelo.conceptoPrincipal = null;
        definicionModelo.conceptosRelacionados = [];
        definicionModelo.conceptosRelacionadosEliminar = [];
        definicionModelo.rangosEliminar = [];

        definicionModelo.formula = [];
        that.formulaActual = [];

        //definicionModelo.idcuentacontabilizacion = null;
        //definicionModelo.contabilizaciones = [];
        //definicionModelo.contablizacionesEliminar = [];
        formula = [];
        idConcepto = 0;

        $('#divConceptoPrincipal input[type=text]').val('');
        $('#cmbTipoCalculo, #cmbOperacion, #cmbEstado, #cmbPrioridad').val('-1');
        $('#cmbPreliquidar,#cmbAnticipo,#cmbFinanciable,#cmbConcepto').val('N');
        $('.divFormula').html('');
        $('#txtAlias').attr('data-alias', '');
        $('#txtValorNumerico').val('');
        $('.cmbConceptos').html('');
        $('#pErrorEditar').html('');
        $('#tblConceptosSeleccinados').empty();
        $('#divConceptoPrincipal input[type=text]').attr('disabled', true);
        $('#divConceptoPrincipal  select').attr('disabled', true);
        $('#txtConcepto').attr('disabled', false);
        $('#divConstructor').hide();
        $('#divRangos').hide();
        $('#tblRangos').empty().hide();
        $('#divConstructor').hide();

    },

    /**
     * Recorre un objeto json con la fórmula y agrega los elementos HTML al panel de fórmulas con base en los tipos de datos que haya en el JSON.
     * @param  {Object} formula Objeto con la información de la fórmula.
     * @returns {void}         
     */
    consutrirFormulaDesdeJSON:function(formula){
        var divFormula = that.divFormulaActual;
        divFormula.html('');
        that.formulaActual = [];
        that.validarOperadorActual();
        if(typeof formula === 'object'){
            for (var i = 0; i < formula.length; i++) {
                var item = formula[i];
                switch (item.tipo) {
                    case 'valor':
                        that.agregarValorAFormula(item.valor);
                        break;
                    case 'op':
                        that.agregarOperadorAFormula(item.valor);
                        break;
                    case 'parAbre':
                        that.agregarParentesis(item.valor);
                    break;
                    case 'parCierra':
                        that.agregarParentesis(item.valor);
                    break;
                    case 'con':
                        that.agregarConceptoAFormula(item);
                    break;
                    case 'fun':
                        that.agregarFuncionAFormula(item);
                    break;
                }
            }
        }else{
            that.agregarValorAFormula(formula);
        }

    },

    /**
     * Consulta los tipos de documento por el control que invoca a la función, puede ser por liquidación, documento de contabilización o documento con cruce.
     * @returns {void}
     */
    consultarTipoDocumento:function(){
        var id = $(this).attr('id');
        if (id === 'cmbLiquidacion') {
            definicionControl.consultarTipoDocumentoLiquidacion({idliquidacion: $('#' + id).val()},that.onConsultarTipoDocumentoCompleto);
        } else if (id === 'cmbDocumentoContabilizacion') {
            definicionControl.consultarTipoDocumento({iddocumento: $('#' + id).val()}, that.onConsultarTipoDocumentoContabilizacionCompleto);
        } else if (id === 'cmbDocumentoConCruce'){
            definicionControl.consultarTipoDocumento({iddocumento: $('#' + id).val()}, that.onConsultarTipoDocumentoContabilizacionCruceCompleto);
        } else {
            definicionControl.consultarTipoDocumento({iddocumento: $('#' + id).val()}, that.onConsultarTipoDocumentoCompleto);
        }
    },

    /**
     * Llena el combo de documentos de contabilización.
     * @param  {Number} iddocumento Id del documento
     * @returns {void}             
     */
    llenarComboDocumentosContabilizacion:function(iddocumento){
        var cmbDocumentoContabilizacion = $('#cmbDocumentoContabilizacion');
        if(cmbDocumentoContabilizacion.html()===''){
            definicionControl.consultarDocumento({accion:'CC'}, function(data){
                switch(data.codigoRespuesta){
                    case 1:
                        __dom.llenarCombo('#cmbDocumentoContabilizacion', data.documentos, 'iddocumento', 'documento');
                        if (iddocumento) {
                            cmbDocumentoContabilizacion.val(iddocumento).change();
                        }
                    break;
                    case 0:
                        __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                    break;
                }
            });
        }else{
            if(iddocumento){
                cmbDocumentoContabilizacion.val(iddocumento);
            }else{
                cmbDocumentoContabilizacion.val('-1');
            }
        }
    },


    /**
     * Llena el combo de documentos de documentos con cruce.
     * @param  {Number} iddocumento Id del documento
     * @returns {void}             
     */
    llenarComboDocumentosContabilizacionCruce:function(iddocumento){
        var cmbDocumentoContabilizacion = $('#cmbDocumentoConCruce');
        if(cmbDocumentoContabilizacion.html()===''){
            definicionControl.consultarDocumento({accion:'R'}, function(data){
                switch(data.codigoRespuesta){
                    case 1:
                        __dom.llenarCombo('#cmbDocumentoConCruce', data.documentos, 'iddocumento', 'documento');
                        if (iddocumento) {
                            cmbDocumentoContabilizacion.val(iddocumento).change();
                        }
                    break;
                    case 0:
                        __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                    break;
                }
            });
        }else{
            if(iddocumento){
                cmbDocumentoContabilizacion.val(iddocumento);
            }else{
                cmbDocumentoContabilizacion.val('-1');
            }
        }
    },

    /**
     * Se ejecuta cuando se terminan de consultar los documentos contabilización y llena el combo de tipos de documento contabilización.
     * @param  {Object} data Respuesta del servidor
     * @returns {void}      
     */
    onConsultarTipoDocumentoContabilizacionCompleto: function(data) {
        switch (data.codigoRespuesta) {
            case 0:
                $('#pNotificacion').text(__app.mensajes.sinResultados + ' de tipos de documento.');
                break;
            case 1:
                __dom.llenarCombo('#cmbTipoDocumentoContabilizacion', data.tipodocumento, 'idtipodocumento', 'tipodocumento');
                break;
        }
    },


    /**
     * Se ejecuta cuando se terminan de consultar los documentos contabilización con cruce y llena el combo de tipos de documento con cruce.
     * @param  {Object} data Respuesta del servidor
     * @returns {void}      
     */
    onConsultarTipoDocumentoContabilizacionCruceCompleto:function(data){
        switch(data.codigoRespuesta){
            case 0:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
            break;
            case 1:
                 __dom.llenarCombo('#cmbTipoDocumentoConCruce', data.tipodocumento, 'idtipodocumento', 'tipodocumento');
            break;
        }
    },

    /**
     * Recorre el JSON que tiene la fórmula y la transforma en un string
     * @param  {Object} jsonFormula Objeto con los datos de la fórmula
     * @returns {String}             String con la fórmula en texto natural.
     */
    formulaJSONAaString:function(jsonFormula){
        if(!jsonFormula){
            return '';
        }
        var formula =  (typeof jsonFormula === 'string') ? JSON.parse(jsonFormula) : jsonFormula;
        var result  = '';
        for (var i = 0; i < formula.length; i++) {
            var item = formula[i];
            if (item.tipo==='fun') {
                result += item.valor;
                for (var j = 0; j < item.params.length; j++) {
                    var param = item.params[j];
                    result += param.valor;
                    if (j+1 < item.params.length) {
                        result += ', ';
                    }
                }
            }else{
                result += item.valor;
            }
        }
        return result;
    },

    /**
     * Configura los controles de las pestañas y autocomplete relacionados a la contabilización del concepto
     * @returns {void} 
     */
    autocompleteContabilizaciones: function() {
        var txtCuentasContabilizacion = $('#txtCodCuentaCZ, #txtNombreCuentaCZ');
        var txtCodCuenta = $('#txtCodCuentaCZ');
        var txtNombreCuentaCZ = $('#txtNombreCuentaCZ');

        __dom.configurarAutocomplete(
            txtCuentasContabilizacion,
            that.sourceAutoCompleteCuenta,
            function(event, ui) {
                ui.item.value = ($(this).attr('id')==='txtCodCuentaCZ')?ui.item.codigocuenta : ui.item.nombrecuenta;
                definicionModelo.idcuentacontabilizacion = ui.item.idVal;
                txtCodCuenta.val(ui.item.codigocuenta).attr('data-codcuenta', ui.item.codigocuenta);
                txtNombreCuentaCZ.val(ui.item.nombrecuenta);
            },
            function(txt) {
                definicionModelo.idcuentacontabilizacion = undefined;
                txtCodCuenta.val('').removeAttr('data-codcuenta');
                txtNombreCuentaCZ.val('');
            }
        );


        var txtAutoCompleteAN = $('#txtAreaAN, #txtNombreAreaAN');
        var txtAreaAN = $('#txtAreaAN');
        txtNombreAreaAN = $('#txtNombreAreaAN');

        __dom.configurarAutocomplete(
            txtAutoCompleteAN,
            that.sourceAutoCompleteAreaNegocioAN,
            function(event, ui) {
                ui.item.value = ($(this).attr('id')==='txtAreaAN') ? ui.item.codigocuenta : ui.item.nombrecuenta;
                txtAreaAN.val(ui.item.codigocuenta).attr('data-idarea', ui.item.codigocuenta);
                txtNombreAreaAN.val(ui.item.nombrecuenta);
            },
            function(txt) {
                txtAreaAN.val('').removeAttr('data-idarea');
                txtNombreAreaAN.val('');
            }
        );

        /*
        __dom.configurarAutocomplete(
            txtAutoCompleteCentroCostos,
            that.sourceAutoCompleteCentroCosto,
            function(event, ui) {
                ui.item.value = ($(this).attr('id')==='txtCodEmpresa') ? ui.item.codigocuenta : ui.item.nombrecuenta;
                txtCodEmpresa.val(ui.item.codigocuenta).attr('data-idcentrocosto', ui.item.codigocuenta);
                txtNombreEmpresa.val(ui.item.nombrecuenta);
            },
            function(txt) {
                txtCodEmpresa.val('').removeAttr('data-idcentrocosto');
                txtNombreEmpresa.val('');
            }
        );
        */



        //-------------------
        var txtCuentasRecaudo = $('#txtCodCuentaConCruce, #txtNombreCuentaConCruce');
        var txtCodCuentaRec = $('#txtCodCuentaConCruce');
        var txtNombreCuentaRec = $('#txtNombreCuentaConCruce');

        __dom.configurarAutocomplete(
            txtCuentasRecaudo,
            that.sourceAutoCompleteCuentaRecaudo,
            function(event, ui) {
                ui.item.value = ($(this).attr('id')==='txtCodCuentaConCruce')?ui.item.codigocuenta : ui.item.nombrecuenta;
                txtCodCuentaRec.val(ui.item.codigocuenta).attr('data-codcuenta', ui.item.codigocuenta);
                txtNombreCuentaRec.val(ui.item.nombrecuenta);
            },
            function(txt) {
                txtCodCuentaRec.val('').removeAttr('data-codcuenta');
                txtNombreCuentaRec.val('');
            }
        );

    },

    /**
     * Origen de datos para el control de cuentas.
     * @param  {Object} request  
     * @param  {Object} response 
     * @returns {void}          
     */
    sourceAutoCompleteCuenta: function(request, response) {
        that.request = request;
        that.response = response;
        var datos = {accion:'CZ', cuenta:request.term.trim()};
        definicionControl.consultarCuentaContabilizacion(datos, that.mostrarResultadoCuenta);
    },

    /**
     * Origen de datos para el control de áreas de negocios.
     * @param  {Object} request  
     * @param  {Object} response 
     * @returns {void}          
     */
    sourceAutoCompleteAreaNegocioAN: function(request, response) {
        that.request = request;
        that.response = response;
        var datos = {accion:'AN', cuenta:request.term.trim()};
        definicionControl.consultarCuentaContabilizacion(datos, that.mostrarResultadoCuenta);
    },

    /**
     * Origen de datos para el control de los centros de costos.
     * @param  {Object} request  
     * @param  {Object} response 
     * @returns {void}          
     */
    sourceAutoCompleteCentroCosto: function(request, response) {
        that.request = request;
        that.response = response;
        var datos = {accion:'CC', cuenta:request.term.trim()};
        definicionControl.consultarCuentaContabilizacion(datos, that.mostrarResultadoCuenta);
    },

    /**
     * Origen de datos para el control cuentas de recaudo.
     * @param  {Object} request  
     * @param  {Object} response 
     * @returns {void}          
     */
    sourceAutoCompleteCuentaRecaudo: function(request, response) {
        that.request = request;
        that.response = response;
        var datos = {accion:'R', cuenta:request.term.trim()};
        definicionControl.consultarCuentaContabilizacion(datos, that.mostrarResultadoCuenta);
    },

    /**
     * Muestra los resultados de los controles de autocomplete, para los campos de contabilización del concepto.
     * @param  {Object} data
     * @returns {void}      
     */
    mostrarResultadoCuenta:function(data){
        switch(data.codigoRespuesta){
            case 0:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
            break;
            case 1:
            var result = [];
                $.each(data.cuentas, function(i, item) {
                    result.push({
                        label: item.nombrecuenta +' - '+item.codigocuenta,
                        idVal: item.idcuenta,
                        codigocuenta: item.codigocuenta,
                        nombrecuenta: item.nombrecuenta,
                        todo: item
                    });
                });
                that.response(result);
            break;
        }
    },

    /**
     * Solicita una confirmación y agrega una contabilización al concepto.
     * @returns {void} 
     */
    agregarContabilizacion: function() {
        that.llenarComboDocumentosContabilizacion();
        var _dialogo = $('#divAgregarContabilizacionModal');
        _dialogo.find('input').val('');
        _dialogo.find('select').val('-1');
        _dialogo.find('#txtPorcentaje').val(100);
        that.contabilizacionActual = null;
        that.dialogoActual = _dialogo.dialogo({
            modal: true,
            width: 850,
            title: 'Contabilización',
            buttons: {
                'Aceptar': that.onAgregarContabilizacionCompleto,
                'Cancelar': function() {
                    that.dialogoActual.dialog('close');
                }
            }
        });
    },

    /**
     * Agrega un área de negocio a la contabilizació y al concepto.
     * @returns {void} 
     */
    agregarAreaNegocio:function(){
        var _dialogo = $('#divAgregarAreaModal');
        _dialogo.find('input').val('');
        _dialogo.find('#txtAreaAN').removeAttr('data-idarea');
        _dialogo.find('select').val('-1');
        _dialogo.find('#txtPorcentajeAN').val(100);
        that.areaNegocioActual = null;
        that.dialogoActual = _dialogo.dialogo({
            modal: true,
            width: 850,
            title: 'Área de Negocio',
            buttons: {
                'Aceptar': that.onAgregarAreaNegocioCompleto,
                'Cancelar': function() {
                    that.dialogoActual.dialog('close');
                }
            }
        });
    },

    /**
     * Agrega un centro de costos al concepto
     * @returns {void} 
     */
    agregarCentroCostos:function(){
        var _dialogo = $('#divAgregarDepartamentoModal');
        _dialogo.find('input').val('');
        _dialogo.find('#txtDepartamento').removeAttr('data-iddepartamento');
        _dialogo.find('#txtCodEmpresa').removeAttr('data-idcentrocosto');
        _dialogo.find('select').val('-1');
        _dialogo.find('#txtPorcentajeDEP').val(100);
        that.centroCostoActual = null;
        that.dialogoActual = _dialogo.dialogo({
            modal: true,
            width: 850,
            title: 'Centros de Costos',
            buttons: {
                'Aceptar': that.onAgregarCentroCostosCompleto,
                'Cancelar': function() {
                    that.dialogoActual.dialog('close');
                }
            }
        });
    },

    /**
     * Agrega una contabilización con cruce.
     * @returns {void} 
     */
    agregarContabilizacionCruce: function() {
        that.llenarComboDocumentosContabilizacionCruce();
        var _dialogo = $('#divAgregarContabilizacionCruceModal');
        _dialogo.find('input').val('');
        _dialogo.find('select').val('-1');
        _dialogo.find('#txtPorcentajeConCruce').val(100);
        that.contabilizacionActual = null;
        that.dialogoActual = _dialogo.dialogo({
            modal: true,
            width: 850,
            title: 'Contabilización Cruce',
            buttons: {
                'Aceptar': that.onAgregarContabilizacionCruceCompleto,
                'Cancelar': function() {
                    that.dialogoActual.dialog('close');
                }
            }
        });
    },

    /**
     * Agrega una contabilización con anticipo
     * @returns {void} 
     */
    agregarContabilizacionAnticipo:function(){
        that.llenarComboDocumentosContabilizacionCruce();
        var _dialogo = $('#divAgregarContabilizacionCruceModal');
        _dialogo.find('input').val('');
        _dialogo.find('select').val('-1');
        _dialogo.find('#txtPorcentajeConCruce').val(100);
        that.contabilizacionActual = null;
        that.dialogoActual = _dialogo.dialogo({
            modal: true,
            width: 850,
            title: 'Contabilización Anticipo',
            buttons: {
                'Aceptar': that.onAgregarContabilizacionAnticipoCompleto,
                'Cancelar': function() {
                    that.dialogoActual.dialog('close');
                }
            }
        });
    },

    /**
     * Se ejecuta cuando se ha terminado de agregar una contabilización y recarga la tabla de contabilizaciones.
     * @returns {void} 
     */
    onAgregarContabilizacionCompleto:function(){
        var cmbDocumentoContabilizacion = $('#cmbDocumentoContabilizacion');
        var cmbTipoDocumentoContabilizacion = $('#cmbTipoDocumentoContabilizacion');
        var cmbNaturaleza = $('#cmbNaturaleza');
        var txtCodCuenta = $('#txtCodCuentaCZ');
        var txtNombreCuentaCZ = $('#txtNombreCuentaCZ');

        if(cmbDocumentoContabilizacion.val()==='-1'){
            __dom.lanzarAlerta('Debe seleccionar un documento', __app.mensajes.atencion);
            return;
        }

        if(cmbTipoDocumentoContabilizacion.val()==='-1' || cmbTipoDocumentoContabilizacion.val() === null){
            __dom.lanzarAlerta('Debe seleccionar un tipo de documento', __app.mensajes.atencion);
            return;
        }

        if(txtCodCuenta.attr('data-codcuenta')===undefined){
            __dom.lanzarAlerta('Debe seleccionar una cuenta', __app.mensajes.atencion);
            return;
        }

        if(cmbNaturaleza.val()==='-1'){
            __dom.lanzarAlerta('Debe seleccionar si la contabilización es de naturaleza Débito o Crédito', __app.mensajes.atencion);
            return;
        }

        var contabilizacion = {
            codigo: txtCodCuenta.val(),
            cuenta: txtNombreCuentaCZ.val(),
            documento: cmbDocumentoContabilizacion.find('option:selected').text(),
            iddocumento: cmbDocumentoContabilizacion.val(),
            idtipodocumento: cmbTipoDocumentoContabilizacion.val(),
            naturaleza: cmbNaturaleza.val(),
            porcentaje: $('#txtPorcentaje').val(),
            tipodocumento: cmbTipoDocumentoContabilizacion.find('option:selected').text()
        };

        if(that.contabilizacionActual !== null){
            that.contabilizacionActual.codigo = txtCodCuenta.val();
            that.contabilizacionActual.cuenta = txtNombreCuentaCZ.val();
            that.contabilizacionActual.documento =  cmbDocumentoContabilizacion.find('option:selected').text();
            that.contabilizacionActual.iddocumento = cmbDocumentoContabilizacion.val();
            that.contabilizacionActual.idtipodocumento = cmbTipoDocumentoContabilizacion.val();
            that.contabilizacionActual.naturaleza = cmbNaturaleza.val();
            that.contabilizacionActual.porcentaje = $('#txtPorcentaje').val();
            that.contabilizacionActual.tipodocumento =  cmbTipoDocumentoContabilizacion.find('option:selected').text();
            that.contabilizacionActual.accion = that.contabilizacionActual.idcontabilizacion?'A':'I';
        }else{
            contabilizacion.idcontabilizacion = null;
            contabilizacion.accion = 'I';
            definicionModelo.contabilizaciones.push(contabilizacion);
        }
        that.cargarTablaContabilizaciones();
        that.dialogoActual.dialog('close');
    },

    /**
     * Agrega una nueva área de negocio al modelo y recarga la tabla de áreas de negocio
     * @returns {void} 
     */
    onAgregarAreaNegocioCompleto:function(){
        var cmbTipoSuscripcionAN = $('#cmbTipoSuscripcionAN');
        var txtAreaAN = $('#txtAreaAN');
        var txtNombreAreaAN = $('#txtNombreAreaAN');
        var txtPorcentajeAN = $('#txtPorcentajeAN');

        if(cmbTipoSuscripcionAN.val()==='-1'){
            __dom.lanzarAlerta('Debe seleccionar un tipo de suscripción', __app.mensajes.atencion);
            return;
        }

        if (txtAreaAN.attr('data-idarea')===undefined) {
            __dom.lanzarAlerta('Debe seleccionar un área', __app.mensajes.atencion);
            return;
        }

        var areanegocio = {
            'idtiposusucripcion': cmbTipoSuscripcionAN.val(),
            'tiposuscripcion': cmbTipoSuscripcionAN.find('option:selected').text(),
            'porcentaje': parseInt( txtPorcentajeAN.val() ),
            'nombrearea': txtNombreAreaAN.val(),
            'codigoarea': txtAreaAN.val(),
        };

        if(that.areaNegocioActual !== null){
            that.areaNegocioActual.idtiposusucripcion = cmbTipoSuscripcionAN.val();
            that.areaNegocioActual.tiposuscripcion =  cmbTipoSuscripcionAN.find('option:selected').text();
            that.areaNegocioActual.porcentaje = parseInt( txtPorcentajeAN.val() );
            that.areaNegocioActual.nombrearea = txtNombreAreaAN.val();
            that.areaNegocioActual.codigoarea = txtAreaAN.val();
            that.areaNegocioActual.accion = that.areaNegocioActual.idareanegocio?'A':'I';
        }else{
            areanegocio.idareanegocio = null;
            areanegocio.accion = 'I';
            definicionModelo.areasdenegocio.push(areanegocio);
        }
        that.cargarTablaAreasNegocio();
        that.dialogoActual.dialog('close');
    },

    /**
     * Agrega un nuevo centro de costos al modelo y recarga la tabla de centro de costos.
     * @returns {void} 
     */
    onAgregarCentroCostosCompleto:function(){
        var txtCodEmpresa = $('#txtCodEmpresa');
        var txtDepartamento = $('#txtDepartamento');

        if (txtCodEmpresa.attr('data-idcentrocosto')===undefined) {
            __dom.lanzarAlerta('Debe seleccionar un centro de costos', __app.mensajes.atencion);
            return;
        }

        // FIXME: FALTA VALIDAR txtDepartamento

        var centrocosto = {
          'codigoempresa': txtCodEmpresa.val(),
          'nombrecuenta': $('#txtNombreEmpresa').val(),
          'departamentoempresa': txtDepartamento.val(),
          'porcentaje': $('#txtPorcentajeDEP').val(),
      };
      if(that.centroCostoActual !== null){
          that.centroCostoActual.codigoempresa = txtCodEmpresa.val();
          that.centroCostoActual.departamentoempresa =  txtDepartamento.text();
          that.centroCostoActual.nombrecuenta = $('#txtNombreEmpresa').val();
          that.centroCostoActual.porcentaje = parseInt( $('#txtPorcentajeDEP').val() );
      }else{
          centrocosto.idcentrocosto = null;
          centrocosto.accion = 'I';
          definicionModelo.centrosdecosto.push(centrocosto);
      }
      that.cargarTablaCentrosCosto();
      that.dialogoActual.dialog('close');

    },

    /**
     * Agrega una contabilidad con cruce al modelo y recargala tabla de Contabilizaciones Cruce.
     * @returns {void} 
     */
    onAgregarContabilizacionCruceCompleto:function(){
        var cmbDocumentoContabilizacion = $('#cmbDocumentoConCruce');
        var cmbTipoDocumentoContabilizacion = $('#cmbTipoDocumentoConCruce');
        var cmbMedioPagoConCruce = $('#cmbMedioPagoConCruce');
        var cmbNaturaleza = $('#cmbNaturalezaConCruce');
        var txtCodCuenta = $('#txtCodCuentaConCruce');
        var txtNombreCuentaCZ = $('#txtNombreCuentaConCruce');

        if(cmbDocumentoContabilizacion.val()==='-1'){
            __dom.lanzarAlerta('Debe seleccionar un documento', __app.mensajes.atencion);
            return;
        }

        if(cmbTipoDocumentoContabilizacion.val()==='-1' || cmbTipoDocumentoContabilizacion.val() === null){
            __dom.lanzarAlerta('Debe seleccionar un tipo de documento', __app.mensajes.atencion);
            return;
        }

        if(cmbMedioPagoConCruce.val()==='-1'){
            __dom.lanzarAlerta('Debe seleccionar un medio de pago', __app.mensajes.atencion);
            return;
        }

        if(txtCodCuenta.attr('data-codcuenta')===undefined){
            __dom.lanzarAlerta('Debe seleccionar una cuenta', __app.mensajes.atencion);
            return;
        }

        if(cmbNaturaleza.val()==='-1'){
            __dom.lanzarAlerta('Debe seleccionar si la contabilización es de naturaleza Débito o Crédito', __app.mensajes.atencion);
            return;
        }

        var contabilizacion = {
            codigo: txtCodCuenta.val(),
            cuenta: txtNombreCuentaCZ.val(),
            documento: cmbDocumentoContabilizacion.find('option:selected').text(),
            iddocumento: cmbDocumentoContabilizacion.val(),
            idtipodocumento: cmbTipoDocumentoContabilizacion.val(),
            mediopago: cmbMedioPagoConCruce.val(),
            naturaleza: cmbNaturaleza.val(),
            porcentaje: $('#txtPorcentajeConCruce').val(),
            tipodocumento: cmbTipoDocumentoContabilizacion.find('option:selected').text()
        };

        if(that.contabilizacionCruceActual !== null){
            that.contabilizacionCruceActual.codigo = txtCodCuenta.val();
            that.contabilizacionCruceActual.cuenta = txtNombreCuentaCZ.val();
            that.contabilizacionCruceActual.documento =  cmbDocumentoContabilizacion.find('option:selected').text();
            that.contabilizacionCruceActual.iddocumento = cmbDocumentoContabilizacion.val();
            that.contabilizacionCruceActual.idtipodocumento = cmbTipoDocumentoContabilizacion.val();
            that.contabilizacionCruceActual.mediopago = cmbMedioPagoConCruce.val();
            that.contabilizacionCruceActual.naturaleza = cmbNaturaleza.val();
            that.contabilizacionCruceActual.porcentaje = $('#txtPorcentajeConCruce').val();
            that.contabilizacionCruceActual.tipodocumento =  cmbTipoDocumentoContabilizacion.find('option:selected').text();
            that.contabilizacionCruceActual.accion = that.contabilizacionCruceActual.idcontabilizacion?'A':'I';
        }else{
            contabilizacion.idcontabilizacion = null;
            contabilizacion.accion = 'I';
            definicionModelo.contabilizacionesCruce.push(contabilizacion);
        }
        that.cargarTablaContabilizacionesCruce();
        that.dialogoActual.dialog('close');
    },

    /**
     * Agrega una nueva contabilización anticipo y recarga la página de contabilizaciones con anticipo.
     * @returns {void} 
     */
    onAgregarContabilizacionAnticipoCompleto:function(){
        var cmbDocumentoContabilizacion = $('#cmbDocumentoConCruce');
        var cmbTipoDocumentoContabilizacion = $('#cmbTipoDocumentoConCruce');
        var cmbMedioPagoConCruce = $('#cmbMedioPagoConCruce');
        var cmbNaturaleza = $('#cmbNaturalezaConCruce');
        var txtCodCuenta = $('#txtCodCuentaConCruce');
        var txtNombreCuentaCZ = $('#txtNombreCuentaConCruce');

        if(cmbDocumentoContabilizacion.val()==='-1'){
            __dom.lanzarAlerta('Debe seleccionar un documento', __app.mensajes.atencion);
            return;
        }

        if(cmbTipoDocumentoContabilizacion.val()==='-1' || cmbTipoDocumentoContabilizacion.val() === null){
            __dom.lanzarAlerta('Debe seleccionar un tipo de documento', __app.mensajes.atencion);
            return;
        }

        if(cmbMedioPagoConCruce.val()==='-1'){
            __dom.lanzarAlerta('Debe seleccionar un medio de pago', __app.mensajes.atencion);
            return;
        }

        if(txtCodCuenta.attr('data-codcuenta')===undefined){
            __dom.lanzarAlerta('Debe seleccionar una cuenta', __app.mensajes.atencion);
            return;
        }

        if(cmbNaturaleza.val()==='-1'){
            __dom.lanzarAlerta('Debe seleccionar si la contabilización es de naturaleza Débito o Crédito', __app.mensajes.atencion);
            return;
        }

        var contabilizacion = {
            codigo: txtCodCuenta.val(),
            cuenta: txtNombreCuentaCZ.val(),
            documento: cmbDocumentoContabilizacion.find('option:selected').text(),
            iddocumento: cmbDocumentoContabilizacion.val(),
            idtipodocumento: cmbTipoDocumentoContabilizacion.val(),
            mediopago: cmbMedioPagoConCruce.val(),
            naturaleza: cmbNaturaleza.val(),
            porcentaje: $('#txtPorcentajeConCruce').val(),
            tipodocumento: cmbTipoDocumentoContabilizacion.find('option:selected').text()
        };

        if(that.contabilizacionAnticipoActual !== null){
            that.contabilizacionAnticipoActual.codigo = txtCodCuenta.val();
            that.contabilizacionAnticipoActual.cuenta = txtNombreCuentaCZ.val();
            that.contabilizacionAnticipoActual.documento =  cmbDocumentoContabilizacion.find('option:selected').text();
            that.contabilizacionAnticipoActual.iddocumento = cmbDocumentoContabilizacion.val();
            that.contabilizacionAnticipoActual.idtipodocumento = cmbTipoDocumentoContabilizacion.val();
            that.contabilizacionAnticipoActual.mediopago = cmbMedioPagoConCruce.val();
            that.contabilizacionAnticipoActual.naturaleza = cmbNaturaleza.val();
            that.contabilizacionAnticipoActual.porcentaje = $('#txtPorcentajeConCruce').val();
            that.contabilizacionAnticipoActual.tipodocumento =  cmbTipoDocumentoContabilizacion.find('option:selected').text();
            that.contabilizacionAnticipoActual.accion = that.contabilizacionAnticipoActual.idcontabilizacion?'A':'I';
        }else{
            contabilizacion.idcontabilizacion = null;
            contabilizacion.accion = 'I';
            definicionModelo.contabilizacionesAnticipos.push(contabilizacion);
        }
        that.cargarTablaContabilizacionesAnticipos();
        that.dialogoActual.dialog('close');
    },

    /**
     * Carga la tabla de contabilizaciones y configura los eventos de la tabla.
     * @returns {void} 
     */
    cargarTablaContabilizaciones:function(){
        var tblContabilizacion = fillTable('tblContabilizacion', formatoContabilizacion, definicionModelo.contabilizaciones);
        tblContabilizacion.find('tbody tr td[header="thEditar"] input').on('click', that.editarContabilizacion);
        tblContabilizacion.find('tbody tr td[header="thBorrar"] input').on('click', that.borrarContabilizacion);
    },


    /**
     * Carga la tabla de áreas de negocio y configura los eventos de la tabla.
     * @returns {void} 
     */
    cargarTablaAreasNegocio:function(){
        var tblAreasNegocio = fillTable('tblAreas', formatoAreaNegocio, definicionModelo.areasdenegocio);
        tblAreasNegocio.find('tbody tr td[header="thEditar"] input').on('click', that.editarAreaNegocio);
        tblAreasNegocio.find('tbody tr td[header="thBorrar"] input').on('click', that.borrarAreaNegocio);
    },

    /**
     * Carga la tabla de centros de costos y configura los eventos de la tabla.
     * @returns {void} 
     */
    cargarTablaCentrosCosto:function(){
        var tblCentroCosto = fillTable('tblCentro', formatoCentroCostos, definicionModelo.centrosdecosto);
        tblCentroCosto.find('tbody tr td[header="thEditar"] input').on('click', that.editarCentroCosto);
        tblCentroCosto.find('tbody tr td[header="thBorrar"] input').on('click', that.borrarCentroCosto);
    },

    /**
     * Carga la tabla de contabilizaciones con cruce y configura los eventos de la tabla.
     * @returns {void} 
     */
    cargarTablaContabilizacionesCruce:function(){
        var tblConCruce = fillTable('tblContabilizacionCruce', formatoContabilizacionCruce, definicionModelo.contabilizacionesCruce);
        tblConCruce.find('tbody tr td[header="thEditar"] input').on('click', that.editarCcontabilizacionCruce);
        tblConCruce.find('tbody tr td[header="thBorrar"] input').on('click', that.borrarCcontabilizacionCruce);
    },

    /**
     * Carga la tabla de contabilizaciones de anticipos y configura los eventos de la tabla.
     * @returns {void} 
     */
    cargarTablaContabilizacionesAnticipos:function(){
        var tbl = fillTable('tblContabilizacionAnticipo', formatoContabilizacionCruce, definicionModelo.contabilizacionesAnticipos);
        tbl.find('tbody tr td[header="thEditar"] input').on('click', that.editarContabilizacionAnticipo);
        tbl.find('tbody tr td[header="thBorrar"] input').on('click', that.borrarContabilizacionAnticipo);
    },

    /**
     * Muestra un dialog para editar la contabilización seleccionada.
     * @returns {void} 
     */
    editarContabilizacion:function(){
        that.contabilizacionActual = definicionModelo.contabilizaciones[ parseInt( $(this).parent().parent().attr('data-fila') )];
        var _dialogo = $('#divAgregarContabilizacionModal');
        var con = that.contabilizacionActual;
        that.llenarComboDocumentosContabilizacion(con.iddocumento);
        setTimeout(function(){
            _dialogo.find('#cmbTipoDocumentoContabilizacion').val(con.idtipodocumento);
        }, 1000);
        _dialogo.find('#txtCodCuentaCZ').val(con.codigo);
        _dialogo.find('#txtNombreCuentaCZ').val(con.cuenta);
        _dialogo.find('#cmbNaturaleza').val(con.naturaleza);
        _dialogo.find('#txtPorcentaje').val(con.porcentaje);
        that.dialogoActual = _dialogo.dialogo({
            modal: true,
            width: 850,
            title: 'Contabilización',
            buttons: {
                'Aceptar': that.onAgregarContabilizacionCompleto,
                'Cancelar': function() {
                    that.dialogoActual.dialog('close');
                }
            }
        });
    },

    /**
     * Muestra un dialog para editar el área de negocio seleccionada.
     * @returns {void} 
     */
    editarAreaNegocio:function(){
        that.areaNegocioActual = definicionModelo.areasdenegocio[ parseInt( $(this).parent().parent().attr('data-fila') )];
        var _dialogo = $('#divAgregarAreaModal');
        var areanegocio = that.areaNegocioActual;

        _dialogo.find('#cmbTipoSuscripcionAN').val(areanegocio.idtiposusucripcion);
        _dialogo.find('#txtAreaAN').val(areanegocio.codigoarea).attr('data-idarea', areanegocio.codigoarea);
        _dialogo.find('#txtNombreAreaAN').val(areanegocio.nombrearea);
        _dialogo.find('#txtPorcentajeAN').val(areanegocio.porcentaje);

        that.dialogoActual = _dialogo.dialogo({
            modal: true,
            width: 850,
            title: 'Área de Negocio',
            buttons: {
                'Aceptar': that.onAgregarAreaNegocioCompleto,
                'Cancelar': function() {
                    that.dialogoActual.dialog('close');
                }
            }
        });
    },

    /**
     * Muestra un dialog para editar el centro de costos seleccionado.
     * @returns {void} 
     */
    editarCentroCosto:function(){
        that.centroCostoActual = definicionModelo.centrosdecosto[ parseInt( $(this).parent().parent().attr('data-fila') )];
        var _dialogo = $('#divAgregarDepartamentoModal');
        var centrocosto = that.centroCostoActual;

        // FIXME: OJO hace falta cambiar este valor
        _dialogo.find('#txtDepartamento').val(centrocosto.departamentoempresa).attr('data-iddepartamento', centrocosto.departamentoempresa);
        _dialogo.find('#txtCodEmpresa').val(centrocosto.codigoempresa).attr('data-idcentrocosto', centrocosto.codigoempresa);
        _dialogo.find('#txtNombreEmpresa').val(centrocosto.nombrecuenta);
        _dialogo.find('#txtPorcentajeDEP').val(centrocosto.porcentaje);

        that.dialogoActual = _dialogo.dialogo({
            modal: true,
            width: 850,
            title: 'Centro de Costos',
            buttons: {
                'Aceptar': that.onAgregarCentroCostosCompleto,
                'Cancelar': function() {
                    that.dialogoActual.dialog('close');
                }
            }
        });
    },

    /**
     * Muestra un dialog para editar la contabilización cruce seleccionada.
     * @returns {void} 
     */
    editarCcontabilizacionCruce:function(){
        that.contabilizacionCruceActual = definicionModelo.contabilizacionesCruce[ parseInt( $(this).parent().parent().attr('data-fila') )];
        var _dialogo = $('#divAgregarContabilizacionCruceModal');
        var con = that.contabilizacionCruceActual;

        _dialogo.find('#cmbMedioPagoConCruce').val(con.mediopago);
        that.llenarComboDocumentosContabilizacionCruce(con.iddocumento);
        setTimeout(function(){
            _dialogo.find('#cmbTipoDocumentoConCruce').val(con.idtipodocumento);
        }, 1000);
        _dialogo.find('#txtCodCuentaConCruce').val(con.codigo).attr('data-codcuenta', con.codigo);
        _dialogo.find('#txtNombreCuentaConCruce').val(con.cuenta);
        _dialogo.find('#cmbNaturalezaConCruce').val(con.naturaleza);
        _dialogo.find('#txtPorcentajeConCruce').val(con.porcentaje);

        that.dialogoActual = _dialogo.dialogo({
            modal: true,
            width: 850,
            title: 'Contabilización Cruce',
            buttons: {
                'Aceptar': that.onAgregarContabilizacionCruceCompleto,
                'Cancelar': function() {
                    that.dialogoActual.dialog('close');
                }
            }
        });
    },

    /**
     * Muestra un dialog para editar la contabilización anticipo seleccionada.
     * @returns {void} 
     */
    editarContabilizacionAnticipo:function(){
        that.contabilizacionAnticipoActual = definicionModelo.contabilizacionesAnticipos[ parseInt( $(this).parent().parent().attr('data-fila') )];
        var _dialogo = $('#divAgregarContabilizacionCruceModal');
        var con = that.contabilizacionAnticipoActual;

        _dialogo.find('#cmbMedioPagoConCruce').val(con.mediopago);
        that.llenarComboDocumentosContabilizacionCruce(con.iddocumento);
        setTimeout(function(){
            _dialogo.find('#cmbTipoDocumentoConCruce').val(con.idtipodocumento);
        }, 1000);
        _dialogo.find('#txtCodCuentaConCruce').val(con.codigo).attr('data-codcuenta', con.codigo);
        _dialogo.find('#txtNombreCuentaConCruce').val(con.cuenta);
        _dialogo.find('#cmbNaturalezaConCruce').val(con.naturaleza);
        _dialogo.find('#txtPorcentajeConCruce').val(con.porcentaje);

        that.dialogoActual = _dialogo.dialogo({
            modal: true,
            width: 850,
            title: 'Contabilización Anticipo',
            buttons: {
                'Aceptar': that.onAgregarContabilizacionAnticipoCompleto,
                'Cancelar': function() {
                    that.dialogoActual.dialog('close');
                }
            }
        });
    },

    /**
     * Solicita la confirmación del borrado de la contabilización seleccionada
     * @returns {void} 
     */
    borrarContabilizacion:function(){
        var indiceEliminar = parseInt($(this).parent().parent().attr('data-fila'));
        var conEliminar = definicionModelo.contabilizaciones[ indiceEliminar ];
        __dom.lanzarAlerta('¿Cofirma eliminar el área de negocio '+conEliminar.nombrearea+'?', 'atención', function(){
            if (conEliminar.accion === 'I') {
                definicionModelo.contabilizaciones.splice(indiceEliminar, 1);
            }else{
                definicionModelo.contablizacionesEliminar.push(conEliminar);
                conEliminar.accion = 'E';
                definicionModelo.contabilizaciones.splice(indiceEliminar, 1);
            }
            that.cargarTablaContabilizaciones();
        }, true);
    },

    /**
     * Solicita la confirmación del borrado del área de negocio seleccionada
     * @returns {void} 
     */
    borrarAreaNegocio:function(){
        var indiceEliminar = parseInt($(this).parent().parent().attr('data-fila'));
        var areaEliminar = definicionModelo.areasdenegocio[ indiceEliminar ];
        __dom.lanzarAlerta('¿Cofirma eliminar el área de negocio '+areaEliminar.nombrearea+'?', 'atención', function(){

            if (areaEliminar.accion === 'I') {
                definicionModelo.areasdenegocio.splice(indiceEliminar, 1);
            }else{
                definicionModelo.areasdenegocioEliminar.push(areaEliminar);
                areaEliminar.accion = 'E';
                definicionModelo.areasdenegocio.splice(indiceEliminar, 1);
            }
            that.cargarTablaAreasNegocio();

        }, true);
    },

    /**
     * Solicita la confirmación del borrado del centro de costo seleccionado
     * @returns {void} 
     */
    borrarCentroCosto:function(){
        var indiceEliminar = parseInt($(this).parent().parent().attr('data-fila'));
        var centroCostoEliminar = definicionModelo.centrosdecosto[ indiceEliminar ];
        __dom.lanzarAlerta('¿Cofirma eliminar el área de negocio '+centroCostoEliminar.nombrearea+'?', 'atención', function(){
            if (centroCostoEliminar.accion === 'I') {
                definicionModelo.centrosdecosto.splice(indiceEliminar, 1);
            }else{
                definicionModelo.centrosdecostoEliminar.push(centroCostoEliminar);
                centroCostoEliminar.accion = 'E';
                definicionModelo.centrosdecosto.splice(indiceEliminar, 1);
            }
            that.cargarTablaCentrosCosto();
        }, true);
    },

    /**
     * Solicita la confirmación del borrado de la contabilización cruce seleccionada
     * @returns {void} 
     */
    borrarCcontabilizacionCruce:function(){
        var indiceEliminar = parseInt($(this).parent().parent().attr('data-fila'));
        var conEliminar = definicionModelo.contabilizacionesCruce[ indiceEliminar ];
        __dom.lanzarAlerta('¿Cofirma eliminar la contabilización?', 'atención', function(){
            if (conEliminar.accion === 'I') {
                definicionModelo.contabilizacionesCruce.splice(indiceEliminar, 1);
            }else{
                definicionModelo.contabilizacionesCruceEliminar.push(conEliminar);
                conEliminar.accion = 'E';
                definicionModelo.contabilizacionesCruce.splice(indiceEliminar, 1);
            }
            that.cargarTablaContabilizacionesCruce();
        }, true);
    },

    /**
     * Solicita la confirmación del borrado de la contabilización anticipo seleccionada
     * @returns {void} 
     */
    borrarContabilizacionAnticipo:function(){
        var indiceEliminar = parseInt($(this).parent().parent().attr('data-fila'));
        var conEliminar = definicionModelo.contabilizacionesAnticipos[ indiceEliminar ];
        __dom.lanzarAlerta('¿Cofirma eliminar la contabilización de anticipo?', 'atención', function(){
            if (conEliminar.accion === 'I') {
                definicionModelo.contabilizacionesAnticipos.splice(indiceEliminar, 1);
            }else{
                definicionModelo.contabilizacionesAnticiposEliminar.push(conEliminar);
                conEliminar.accion = 'E';
                definicionModelo.contabilizacionesAnticipos.splice(indiceEliminar, 1);
            }
            that.cargarTablaContabilizacionesAnticipos();
        }, true);
    },

    /**
     * Retorna el texto adecuado de acuerdo al tipo de naturaleza de la transacción (crédito o débito)
     * @param  {String} txt texto que se va a evaluar   
     * @returns {String}     
     */
    tdCallbackMostrarNaturaleza:function(txt){
        if(txt === 'D'){
            return 'Débito';
        }else if(txt === 'C'){
            return 'Crédito';
        }else{
            return '-';
        }
    },

};

definicionVista.init();