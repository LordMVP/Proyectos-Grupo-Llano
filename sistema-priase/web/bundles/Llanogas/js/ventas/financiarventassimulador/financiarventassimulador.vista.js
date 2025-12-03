/**
 * @fileOverview Archivo de vista y control de financiación de ventas
 * @author Angélica Gómez
 * @requires financiarventas.control.js
 * @requires financiarventas.modelo.js
 * @version 1.0.0
 */

/**
 * Objeto que hace referencia al namespace financiarVista
 * @type {Object}
 */
var vista = null;
/** @namespace */
var financiarVistaSimulador = {
    /** Hace referencia al último dialogo abierto en la aplicación
     * @type {object}
     */
    dialogoActual: null,
    /**Inicializa el programa para la financiación de ventas
     * @returns {void}
     */
    init: function () {
        vista = financiarVistaSimulador;
        $('#divNatural').tabs();
        $('#divTabFinanciaciones').tabs();
        $('#divAdjuntosFinanciacion').tabs();
  
        $('#btnVerSimulador').on('click', vista.mostrarSimulador);
        $('#txtValorCuotaInicial').on('blur', vista.validarCuotaInicial);
        //$('input[data-caja="number"]').on('blur', vista.actualizarTotales);
        $('#txtValorCuotaInicial').on('focus', vista.asignarValorCuotaInicial);
        
        $('select.tipofinanciacion').on('change', function () {
            vista.consultarInfoLiquidacion($(this));
        });
        $('#txtIntereses').attr('disabled', 'disabled')
      
        $('a.appload-input').css({color: '#FFF'});
        
        __dom.configurarTextoNumerico('txtNumCuotas').on('blur', vista.validarCuotas);
        __dom.configurarTextoNumerico('txtFiltroIdPropiedad, #txtFiltroIdSuscripcion');
        __dom.configurarTextoNumerico('txtValorCuotaInicial, input[data-caja="number"]');
    },
 
   
    /** Valida que las cuotas estén entre 1 y el máximo de cuotas posibles
     * @returns {void}
     */
    validarCuotas: function (e) {
        var _this = $(this);
        var cuotas = parseInt(_this.val());
        if (cuotas > financiarModeloSimulador.plazomaximo) {
            _this.val(financiarModeloSimulador.plazomaximo).focus().select();
            return;
        }
        if (cuotas < 1) {
            _this.val('1').focus().select();
            return;
        }
        $('#txtNumCuotasImpresion').val(cuotas);
    },
    /**
     * Valida que el campo de meses no sea mayor a 11
     * @returns {void}
     */
    validarMeses: function () {
        var _this = $(this);
        if (!isNaN(parseInt(_this.val()))) {
            if (parseInt(_this.val()) > 11) {
                _this.val(11).focus().select();
            }
        }
    },

    
    /**
     * Carga la información en cajas de texto que se muestran al imprimir simulador de amortización
     * @param {object} data - Información que se cargará
     * @returns {void}
     */
    onCargarInformaconImpresion: function (data) {
        var venta = data.venta;
        var resumen = data.infosuscripcion;
        var suscripcion = resumen.suscripcion;
        var div = $('#divImpresionAmortizaciones');
        div.find('#txtDireccionImpresion').val(resumen.propiedad.direccion);
        div.find('#txtIdSuscripcionImpresion').val(suscripcion.idsuscripcion);
        div.find('#NombrePropietarioImpresion').val(resumen.tercero.nombretercero);
        div.find('#txtValorVentaImpresion').val(venta.valortotal.toString().toCurrency());
    },
  
    /**
     * Valida que hayan liquidaciones para agregar una financiación de ser así agrega una división para digitar la financiación
     * @returns {object} Devuelve la última división creada para guardar una financiación
     */
    agregarDivisionFinanciacion: function () {
        if (!vista.validarFinanciacionesCompletas()) {
            return false;
        }
        return vista.renderizarTemplateFinanciacion();
    },
  
  
    /**
     * Valida cual es el máximo plazo entre las financiaciones guardadas
     * @param {object} liquidaciones - Información de las liquidaciones seleccionadas
     * @returns {void}
     */
    validarMaximoPlazo: function (liquidaciones) {
        var maximo = 100;
        for (var i = 0; i < liquidaciones.length; i++) {
            maximo = parseInt(liquidaciones[i].maximoplazo) < maximo ? parseInt(liquidaciones[i].maximoplazo) : maximo;
        }
        $('#txtNumCuotas').val(maximo);
        financiarModeloSimulador.plazomaximo = maximo ? maximo : 1;
    },
  
   
    /**
     * Le asigna el valor a la cuota inicicial numérica
     * @returns {void}
     */
    asignarValorCuotaInicial: function () {
        var _this = $(this);
        if (_this.attr('title')) {
            _this.val(_this.attr('title'));
        }
    },
    /**
     * Valida la mayor valor primera cuota según la cuota inicial digitada
     * @returns {void}
     */
    validarCuotaInicial: function () {
        var _this = $('#txtValorCuotaInicial');
        var vlrTxt = parseInt(_this.attr('title'));
        var vlrNoFinanciable = financiarModeloSimulador.valorConceptosNoFinanciable;
        var vlrCuotaInicial = isNaN(parseInt(_this.val())) ? (isNaN(vlrTxt) ? 0 : vlrTxt) : parseInt(_this.val());

        var vlrMayorPrimeraCuota = vlrNoFinanciable;
        if (parseInt(_this.val()) > 0) {
            vlrMayorPrimeraCuota = (vlrCuotaInicial >= vlrNoFinanciable) ? 0 : (vlrNoFinanciable - vlrCuotaInicial);
        }
        $('#txtValorCuotaInicial, #txtValorCuotaImpresion').val(vlrCuotaInicial).toTxtCurrency();
        $('#txtVlrMinimoPago').val(vlrMayorPrimeraCuota).toTxtCurrency();
        vista.asignarValoresFinanciacion();
    },
 
   
  
    /** Válida la información de la financiación y en caso de ser correcta visualiza el simulador
     * @returns {void}
     **/
    simulador: function () {
        var _this = $(this);
        var divPadre = _this.parents().eq(2);
        var conceptos = divPadre.find('table tbody input:checked');
        if (conceptos.length === 0) {
            __dom.lanzarAlerta('Debe seleccionar conceptos a financiar.', __app.mensajes.atencion);
            return;
        }
        if ($('#txtNumCuotas').val().trim() === '') {
            var mensaje = __app.mensajes.escogerCuotasFinanciacion.replace('24', financiarModeloSimulador.plazomaximo);
            __dom.lanzarAlerta(mensaje, __app.mensajes.atencion);
            return;
        }
        if ($('#txtValorFinanciar').val().trim() === '') {
            __dom.lanzarAlerta(__app.mensajes.requiereValorFinanciarMayor, __app.mensajes.atencion);
            return;
        }
        if (divPadre.find('.interesfinanciacion').val().trim() === '') {
            var liq = divPadre.find('.tipofinanciacion');
            if (liq.val() !== '-1' && liq.val() !== '') {
                var nombreLiq = liq.find('option:selected').text();
                __dom.lanzarAlerta('La liquidación <b>' + nombreLiq + '</b> no tiene tasa de interés asociada, </br> Comuníquese con soporte');
            } else {
                __dom.lanzarAlerta(__app.mensajes.tipoFinanciacion, __app.mensajes.atencion);
            }
            return;
        }

        $('#txtNumeroCuotas').val($('#txtNumCuotas').val());
        $('#txtIntereses').val(divPadre.find('.interesfinanciacion').val());
        $('#txtCapitalInicial').val(divPadre.find('.valorafinanciar').attr('title'));
        $('#txtIntereses').attr('data-iva', divPadre.find('.interesfinanciacion').attr('data-iva'));
        vista.calcularAmortizacion();

    },
    /**
     * Permite visualizar la posible amortización  de la financiación
     * @returns {void}
     */
    mostrarSimulador: function () {
     
financiarModeloSimulador.diasterminoperiodo = 30;

   var vlrFinanciar = $('#txtCapitalInicial').val();
        financiarModeloSimulador.txtcapitalInicial = vlrFinanciar;
        $('#txtcapitalInicial').empty();
        $('#txtcapitalInicial').text("");
        $('#txtcapitalInicial').text(financiarModeloSimulador.txtcapitalInicial);
        
        var vlrCuotas = 0;
        var divPrincipal = $('#divSimulador');
        var divTablas = $('#divTabFinanciaciones');
var divs = $('#divFinanciaciones');

        divTablas.find('div').remove();
        var tabs = divTablas.find('.ui-tabs-nav').empty();
            var divamortizacion = vista.crearDivisionAmortizada();
          
            var liquidacion = divs.find('.tipofinanciacion');
            
            
            var nombreliquidacion = liquidacion.find('option:selected').text();
            
            var nameliquidacionmostrar = nombreliquidacion.substr(0, 15);
            tabs.append($('<li><a href="#divLiquidacion' + liquidacion.val() + '" title="' + nombreliquidacion + '">' + nameliquidacionmostrar + '</a></li>'));
            divTablas.append(divamortizacion);
        
        
        divTablas.tabs("refresh");
        divTablas.tabs("option", "active", 0);
        vista.dialogoActual = divPrincipal.dialogo({
            modal: true,
            width: 980,
            position: {my: "center", at: "top+30", of: "body"},
            title: 'Simulador de financiación',
            buttons: {
                Imprimir: vista.cargaramortizaciones,
                Cerrar: function () {
                    vista.dialogoActual.dialog('close');
                }
            }
        });
    },
    /**
     * Carga en tablas los simuladores de amortización de la financiación para imprimir
     * @returns {void}
     */
    cargaramortizaciones: function () {
      
        $('#txtcapitalInicial').empty();
        $('#txtcapitalInicial').text("");
        $('#txtcapitalInicial').text(financiarModeloSimulador.txtcapitalInicial);
        var vlrCuotas = 0;
        var divPrincipal = $('#divImpresionAmortizaciones');
        var divTablas = divPrincipal.find('#divTablasAmortizacion').empty();
        var divFinanciaciones = $('#divFinanciaciones');
        var valorAproximadoPrimeraCuota = 0 ;//parseInt($('#txtVlrMinimoPago').attr('title'));

        for (var index = 0; index < divFinanciaciones.length; index++) {
            
            
            var divamortizacion = vista.crearDivisionAmortizada();
            
            if (divamortizacion) {
                divTablas.append(divamortizacion);
                vlrCuotas += financiarModeloSimulador.vlrCuota;
            }
        }

        valorAproximadoPrimeraCuota += parseFloat(vlrCuotas);
        $('#txtNumCuotasImpresion').val($('#txtNumCuotas').val());
        $('#txtVlrAproxCuotaImpresion').val(vlrCuotas).toTxtCurrency();
        $('#txtVlrAproxPrimerCuotaImpresion').val(valorAproximadoPrimeraCuota).toTxtCurrency();
        vista.imprimirSimulador();
    },
    /**
     * Configura la vista para mostrar las amortizaciones de las financiaciones
     * @param  {jQuery} div - División de la financiación
     * @returns {boolean|jQuery}
     */
    crearDivisionAmortizada: function () {
        var cantidadCuotas = $('#txtNumeroCuotas').val();
        var vlrFinanciar = financiarModeloSimulador.txtcapitalInicial;
        var txtinteres = $('#txtIntereses').val();
        var txtLiquidacion = $('#cmbTipoFinanciacion').val();
        var tabla = vista.calcularAmortizacion(financiarModeloSimulador, true);
        return vista.crearHtmlSimulador(txtLiquidacion, txtinteres, vlrFinanciar, cantidadCuotas, tabla);
    },
 
    /**
     * Genera el HTML para pintar la amortización de cada una de las financiaciones
     * @param  {jQuery} liquidacion - Combo de la liquidación que se Válida
     * @param  {number}  interes - Porcentaje de interés generado por la liquidación
     * @param  {number} valor - Valor total financiada con ésta liquidación
     * @param  {number} cantidadCuotas - Cantidad de cuotas en la que se hizo ésta financiación
     * @param  {jQuery} tabla - Tabla de la amortización
     * @returns {jQuery}
     */
    crearHtmlSimulador: function (liquidacion, interes, valor, cantidadCuotas, tabla) {
        
        var nombreliquidacion = $('#cmbTipoFinanciacion').find('option:selected').text();
        var hr = $('<hr style="margin: 20px 0px; ">');
        var divTabla = $('<div>').css({'margin-top': '10px'}).append(tabla);
        var txtInteres = $('<div class="campo"><label>Intereses: </label><input type="text" class="inputImpresion" value="' + interes + '" disabled="disabled"></div>');
        var txtValor = $('<div class="campo"><label>Valor Financiado: </label><input type="text" class="inputImpresion" value="' + valor + '" disabled="disabled"></div>');
        var txtLiquidacion = $('<div class="campo"><label>Liquidación: </label><input type="text" class="inputImpresion" value="' + nombreliquidacion + '" disabled="disabled"></div>');
        var txtNumeroCuotas = $('<div class="campo"><label for="txtNumeroCuotas">Número de cuotas:</label><input type="text" id="txtNumeroCuotas" class="inputImpresion"  disabled="disabled"  value="' + cantidadCuotas + '" class="inputImpresion"/></div>');

        return $('<div>').attr('id', 'divLiquidacion' + liquidacion).addClass('.divFinanciacionImpresion').append(hr, txtLiquidacion, txtInteres, txtValor, txtNumeroCuotas, divTabla);
    },
    /**
     * Imprime las tablas de amortizacionez de todas las financiaciones
     * @returns {void}
     */
    imprimirSimulador: function () {
        var frame = document.getElementById('iframePrint');
        var c = frame.contentDocument.getElementById('contenido');
        frame.contentDocument.getElementById('title').innerText = 'FINANCIACIÓN DE LA VENTA  ' ;
        var cp = document.getElementById('divImpresionAmortizaciones').cloneNode(true);
        while (c.firstChild) {
            c.removeChild(c.firstChild);
        }
        c.appendChild(cp);
        $(c).find('#divImpresionAmortizaciones').removeAttr('style');
        var w = frame.contentWindow;
        w.focus();
        w.print();
    },
   
    
   
    /** Limpia el dialogo de búsqueda
     * @returns {void}
     */
    limpiarFiltro: function () {
        var filtro = $('#divBuscarVenta');
        filtro.find('input[type="text"]').val('');
        $('#btnSubirArchivos').hide();
    },
    /** Quita toda la información mostrada en la pantalla
     * @returns {void}
     */
    limpiarFormulario: function () {
        $('#cmbParentesco').val('-1');
        $('input[type="text"]').val('');
        $('#divFinanciaciones').empty();
        $('#divArchivoVinculacion').hide();
        $('#divAdjuntosFinanciacion').hide();
        $('#btnGrabar').removeAttr('disabled');
        $('#tblConceptoNoFinanciable').empty();
        $('#divFinanciacion legend span').text('');
        var divFinanciera = $('#divInfoFinanciera').hide();
        $('#txtFecha, #txtFechaActualImpresion').val(vista.fechaactual);
        divFinanciera.find('input:text, select').val('').removeAttr('title');
        $('#divDetallesFactura, #divFinanciacion, #divArchivo, #divContrato').hide();
        $('#btnAgregarInfoFinanciera, #btnVerSimulador').attr('disabled', 'disabled');
        $('#btnVerDetalleVenta, #btnAgregarFinanciacion').attr('disabled', 'disabled');
        if (vista.appload.container) {
            vista.appload.container.find('.files-list').empty();
        }
        var plazo = financiarModeloSimulador.plazomaximo;
        var interes = financiarModeloSimulador.interesmaximo;
        financiarModeloSimulador = {
            archivos: [],
            plazomaximo: plazo,
            interesmaximo: interes,
            valorNoFinanciable: 0,
            archivosEliminados: [],
            conceptoLiquidacion: [],
            indiceFinanciacion: 0, liquidacionesUtilizadas: []};
    },
    
     /** Calcula la amortización de acuerdo a los parámetros digitados para la financiación e
     * invoca función para la correcta visualización
     * @param {objetc} modelo - Modelo donde se podrá almacenar información (opcional)
     * @param {boolena} agregarTabla - Evalúa si desea agregar la tabla a #divTbl
     * @returns {void}
     */
    calcularAmortizacion: function (modelo, sinAgregar) {
        var txtInteres = $('#txtIntereses');
        var txtCapital = $('#txtCapitalInicial');
        _that.capitalInicial = parseFloat(txtCapital.val());
       // txtCapital.val(_that.capitalInicial.toString().toCurrency());

        if (txtInteres.val() === '') {
            __dom.lanzarAlertaOk('Ingrese tasa de interés');
            return false;
        }
        if (!(__dom.validarNumeroDecimal($('#txtIntereses').val()))) {
            __dom.lanzarAlertaOk(__app.mensajes.intereses, __app.mensajes.atencion);
            return false;
        }
        _that.listadoAmortizacion = [];
        var tipoCuota = txtInteres.attr('tipo-cuota');
        _that.tasaInteres = parseFloat(txtInteres.val()) / 100;
        var numeroCuotas = parseInt($('#txtNumeroCuotas').val());
        var cuotasAmortizadas = parseInt($('#txtCuotasAmortizadas').val());
        _that.interesiva = txtInteres.attr('data-iva') ? txtInteres.attr('data-iva') : 0;
        _that.valorCuotaGlobal = _that.calcularValorCuota(_that.capitalInicial, _that.tasaInteres, numeroCuotas);
        _that.totalCuotas = 0;
        _that.totalCapital = 0;
        _that.totalIntereses = 0;
        _that.totalInteresIva = 0;
        var saldo = _that.capitalInicial;

        //console.log(cuotasAmortizadas);

        if (modelo.diasterminoperiodo < 30 && modelo.diasterminoperiodo > 0 
                && (cuotasAmortizadas == 0 || isNaN(cuotasAmortizadas))){
            var detalleAmortizacion;
            var interes = ((saldo * _that.tasaInteres) / 30) * modelo.diasterminoperiodo;
            var vlrinteresiva = (interes * _that.interesiva);

            _that.totalIntereses += _that.convertirValorFloat(interes);
            _that.totalInteresIva += _that.convertirValorFloat(vlrinteresiva);
            detalleAmortizacion = _that.crearObjetoDetalle(0, saldo, '-', interes, '-', vlrinteresiva);
            _that.listadoAmortizacion.push(detalleAmortizacion);
        }

        for (var i = 0; i < numeroCuotas; i++) {
            _that.ultimaCuota = i === (numeroCuotas - 1);
            if (i > 0) {
                var indiceMenor = (modelo.diasterminoperiodo < 30 && modelo.diasterminoperiodo > 0 
                        && (cuotasAmortizadas == 0 || isNaN(cuotasAmortizadas))) ? i : i - 1;
                var saldoAnterior = (_that.listadoAmortizacion[indiceMenor].saldo);
                saldo = (saldoAnterior - _that.listadoAmortizacion[indiceMenor].capital);
            }
            if (tipoCuota === 'V') {
                _that.crearNuevaCuotaVariable(saldo, i + 1, numeroCuotas - i);
                continue;
            }
            _that.crearNuevaCuota(saldo, i + 1);
        }

        detalleAmortizacion = _that.crearObjetoDetalle('Total', 0, _that.totalCapital, _that.totalIntereses, _that.totalCuotas, _that.totalInteresIva);
        if (!!modelo) {
            var indiceCuota = (modelo.diasterminoperiodo < 30 && modelo.diasterminoperiodo > 0 
                    && (cuotasAmortizadas == 0 || isNaN(cuotasAmortizadas))) ? 1 : 0;
            modelo.totalIntereses = parseFloat(_that.totalIntereses);
            modelo.valorCuota = parseFloat(_that.listadoAmortizacion[indiceCuota].cuota);
        }
        _that.listadoAmortizacion.push(detalleAmortizacion);
        var table = _that.mostrarTabla(_that.listadoAmortizacion);
        if (!sinAgregar) {
            $("#divTbl").empty().append(table);
        }
        return table;
    },
    
     /** Hace petición ajax para consultar la tasa de interés según el tipo de liquidación seleccionada
     * @returns {void}
     **/
    consultarInfoLiquidacion: function () {
        var _this = $('.tipofinanciacion');


        if (_this.val() !== '-1' && _this.val()) {

            var infoEnviar = {idliquidacion: _this.val()};
            financiarControlSimulador.consultarInteres(infoEnviar, function (data) {
                if (data.codigoRespuesta !== 1) {
                    __dom.ocultarToast();
                    __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                    return;
                }
                $('#txtIntereses').val(data.interes)
            });
        }
    }
    
};
financiarVistaSimulador.init();
