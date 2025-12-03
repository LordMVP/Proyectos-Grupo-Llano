/**
 * @fileOverview Archivo de vista y control para el proceso que genera suspensiones
 * @author AppFuture
 * @requires proceso.suspension.control.js
 * @requires proceso.suspension.modelo.js
 * @version 1.1.0
 * @namespace procesoSuspensionVista
 */

/**
 * Objeto que hace referencia al namespace procesoSuspensionVista
 * @type {Object}
 */
var that = null;
var procesoSuspensionVista = {
    /**
     * Inicializa la página y asigna los listeners de los controles
     * @param {number} opcion - Verifica la cantidad de procesos activos en el momento
     * @param {Array} arrayTiposDeUso - Arreglo de los tipos de uso que tiene una empresa
     */
    init: function (opcion, arrayTiposDeUso, arrayMunicipios) {
        that = this;
        if (opcion === 0) {
            procesoSuspensionControl.consultarResultado(that.consultarResultadoCompleto, true);
        } else {
            $('.campos').hide();
            that.consultarProgreso();
            that.intervalProgreso = setInterval(that.consultarProgreso, 10000);
        }
        fillTable('tblTiposuso', 'formatoTipoUso', arrayTiposDeUso, '');
        fillTable('tblmunicipios', 'formatoMunicipios', arrayMunicipios, '');
        //procesoSuspensionControl.consultarTipoUso(that.onConsultarTiposUsoCompleto);
        $('#fecIniSuspension').on('change', that.configurarFechaFin);
        $("#btnSuspension").on("click", that.prepararProcesoSuspension);
        $("#facVencidasDesde").on("blur", that.validarCantidadFacturas);
        $('#facVencidasHasta').on('blur', that.vallidarMaximoFacturas);
        __dom.configurarCalendario("fecIniSuspension, #fecFinSuspension");
    },
    /**
     * Valida que el máximo de facturas no sea mayor a 24
     */
    vallidarMaximoFacturas: function () {
        var _this = $(this);
        if (_this !== '') {
            if (parseInt(_this) > 24) {
                _this.val(24).focus().select();
            }
        }
    },
    //<editor-fold desc="Funciones que ya no son utilizadas" defaultstate="collapse">
    /**
     * Consulta los tipos de uso de la empresa
     * @deprecated version 1.0.0 Ahora se envía en el index del twig
     * @param {Object} data - Respuesta del servidor
     */
    onConsultarTiposUsoCompleto: function (data) {
        if (data.codigoRespuesta === 1) {
            procesoSuspensionModel.tiposDeUso = data.datos;
            fillTable('tblTiposuso', 'formatoTipoUso', data.datos, '');
        }
    },
    configurarAutoCompleto: function () {
        $('input#txtTipoUsoSuscripcion').autocomplete({
           source:  procesoSuspensionModel.tiposDeUso
        });
        
    },
    sourceAutoCompleteSus: function (request, response) {
        
        var result = [];
        if (!request.term.trim() == "") {
            //var informacion = that.validarCoincidencia(request.term);
            for (var indice = 0; indice < informacion.length; indice++) {
                var item = informacion[indice];
                result.push({
                    label: item.tipouso,
                    value: item.tipouso,
                    idVal: item.idtipouso
                });
            }
        }
        response = result;
    },
    validarCoincidencia: function (nombreTipoUso) {
        var coincidencia = [];
        nombreTipoUso = nombreTipoUso.toLowerCase();
        for (var index = 0; index < procesoSuspensionModel.tiposDeUso.length; index++) {
            var tipoUso = procesoSuspensionModel.tiposDeUso[index];
            var nombre = tipoUso.tipouso.toLowerCase();
            if (nombre.indexOf(nombreTipoUso) > 1) {
                coincidencia.push(tipoUso);
            }
        }
        return coincidencia;
    },
    mostrarResultadoSus: function (data) {
        if (data.codigoRespuesta === 1) {
            var result = [];
            $.each(data.datos, function (i, item) {
                result.push({
                    label: item.nombretercero,
                    value: item.nombretercero,
                    idVal: item.idtercero
                });
            });
            that.response(result);
        }
    },
    //</editor-fold>
    /**Configura la fecha de fin para que no sea inferior a la fecha de incio
     * @returns {void}
     */
    configurarFechaFin: function () {
        var _this = $(this);
        var fi = new Date(_this.val().replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3"));
        $('#fecFinSuspension').datepicker('option', 'minDate', fi)
                .val('');
    },
    /**
     * Verifica la cantidad de facturas seleccionadas y ayuda al usuario a completar la siguiente caja de texto
     */
    validarCantidadFacturas: function () {
        var desde = $("#facVencidasDesde").val();
        var hasta = $('#fecFinSuspension').val();
        if (desde > 1 || desde === '0') {
             hasta = desde == 999 ? 999 : desde == 2 ? 24 : (desde === '0' ? 0 : hasta );
            $('#facVencidasHasta').val(hasta);
            $('#facVencidasHasta').prop("disabled", true);
            $("#fecIniSuspension, #fecFinSuspension").prop("disabled", true).val("");
        } else {
            $('#facVencidasHasta').val(1);
            $("#fecIniSuspension, #fecFinSuspension").prop("disabled", false);
        }
    },
    /**
     * Valida la información del proceso y se procesa para enviarla al servidor y que inicie el proceso de generación de suspensiones
     */
    prepararProcesoSuspension: function () {
        var chkTipoUso = $('#tblTiposuso tbody tr input:checked');
        var chkMunicipios = $('#tblmunicipios tbody tr input:checked');
        var desde = parseInt($("#facVencidasDesde").val());
        var hasta = parseInt($("#facVencidasHasta").val());
        if (chkTipoUso.length === 0) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarTipoUsoSuscripcion, __app.mensajes.atencion);
            return;
        }
        if (isNaN(desde) || hasta < desde) {
            __dom.lanzarAlerta(__app.mensajes.fechaDesdeMenorQueHastaProcesoSuspension, __app.mensajes.atencion);
            return;
        }
        if (desde === 1) {
            if ($("#fecIniSuspension").val() === '' || $("#fecFinSuspension").val() === '') {
                __dom.lanzarAlerta(__app.mensajes.seleccionarFechaInicioSuspension, __app.mensajes.atencion);
                return;
            }
        }
        var strMunicipios='';
        for(var indice = 0; indice < chkMunicipios.length; indice++){
            strMunicipios += chkMunicipios[indice].value + ',';
        }
        strMunicipios = strMunicipios.substring(0, strMunicipios.length -1);
        
        var strTiposUso = '';
        for(var indice = 0; indice < chkTipoUso.length; indice++){
            strTiposUso += chkTipoUso[indice].value + ',';
        }
        strTiposUso = strTiposUso.substring(0, strTiposUso.length -1);
        var data = {
            tipodeuso: strTiposUso,
            municipios: strMunicipios,
            desde: $("#facVencidasDesde").val() !== "" ? $("#facVencidasDesde").val() : 1,
            hasta: $("#facVencidasHasta").val() !== "" ? $("#facVencidasHasta").val() : 1,
            fechaini: $("#fecIniSuspension").val() !== "" ? $("#fecIniSuspension").val() : "0000/00/00",
            fechafin: $("#fecFinSuspension").val() !== "" ? $("#fecFinSuspension").val() : "0000/00/00"
        };
        procesoSuspensionControl.aplicarSuspensiones(data, that.ejecutoProceso);
    },
    /**
     * Consulta el progreso del proceso de generar suspensiones y reconexiones al servidor
     */
    consultarProgreso: function () {
        procesoSuspensionControl.consultarProgreso(that.actualizarProgreso);
    },
    /**
     * Verifica que se haya iniciado el proceso de suspensiones y actualiza la página para mostrar el progreso
     * @param data
     */
    ejecutoProceso: function (data) {
        switch (data.codigoRespuesta) {
            case 1:
                __dom.lanzarAlerta(__app.mensajes.procesoLanzado, __app.mensajes.atencion, function () {
                    location.reload();
                });
                break;
        }
        __dom.ocultarCargador();
    },
    /**
     * Actualiza la barra de progreso y muestra la cantidad de registros afectados
     * cuando ya se haya terminado se podrá consultar el resumen
     * @param {Object} data - Respuesta del servidor
     */
    actualizarProgreso: function (data) {
        if (data.codigoRespuesta > 0) {
            if (data.progreso && data.progreso.idProceso) {
                $('.campos, #fsResultados').hide();
                $('#numeroRegistrosProcesados').text(data.progreso.numeroRegistrosProcesados);
            } else {
                $('.campos, #fsResultados').show();
                $('#divInfoProgreso').hide();
                clearInterval(that.intervalProgreso);
                procesoSuspensionControl.consultarResultado(that.consultarResultadoCompleto);
            }

        }
    },
    /**
     * Recibe la información del resultado del proceso agrupados por el municipio y el estado (generado o no generadas)
     * @param {Object} data - Respuesta del servidor
     */
    consultarResultadoCompleto: function (data) {
        //if (data.codigoRespuesta === 1) {
        switch(data.codigoRespuesta){
            case -3:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
            break;
            case 1:
            $('#fsResultados').show();
            var tbl = $('#tblErrores, #tblResumen').empty();
            if (data.datos) {
                var resumenExiste = false;
                var error = data.datos.nogeneradas;
                var correcto = data.datos.generadas;
                if (error.length > 0) {
                    resumenExiste = true;
                    fillTable('tblErrores', 'formatoGeneradas', error, 'Suspensiones no generadas');
                }
                if (correcto.length > 0) {
                    resumenExiste = true;
                    fillTable('tblResumen', 'formatoGeneradas', correcto, 'Suspensiones generadas');
                }
                if (!resumenExiste) {
                    $('#fsResultados').hide();
                }
                if (error.length > 0 && correcto.length > 0) {
                    tbl.parent().css('width', '49%');
                } else {
                    tbl.parent().css('width', '100%');
                }
            }
            break;
        }
    },
    /**
     * Limpia formulario
     */
    limpiarFormulario: function () {

    }
};