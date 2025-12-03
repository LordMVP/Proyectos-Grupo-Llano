/**
 * @fileOverview Archivo de vista para el proceso de reconexiones
 * @author AppFuture
 * @requires proceso.reconexion.control.js
 * @requires proceso.reconexion.modelo.js
 * @version 1.1.0
 */

/**
 * Objeto que hace referencia al namespace procesoReconexionVista
 * @type {object}
 */
var that = null;

/** @namespace */
var procesoReconexionVista = {
    /**
     * Inicializa el programa de generar reconexiones y asigna listeners a controles.
     * @returns {void}
     */
    init: function (opcion, arrayTiposdeUso, arrayMunicipios) {
        that = this;
        if (opcion === 0) {
            fillTable('tblTipoUso', 'formatoTiposDeUso', arrayTiposdeUso, 'Tipos de uso');
            fillTable('tblmunicipios', 'formatoMunicipios', arrayMunicipios, '');
            procesoReconexionControl.consultarResumen(that.onConsultarResumenCompleto);
        } else {
            that.consultarProgreso();
            $('#divCampos, #divDialogoResumen, #divComandos').hide();
            that.intervalProgreso = setInterval(that.consultarProgreso, 10000);
        }
        __dom.configurarCalendario("fecIniSuspension");
        __dom.configurarCalendario("fecFinSuspension");
        $("#btnSuspension").on("click", that.prepararProcesoSuspension);
        $("#facVencidasDesde").on("change", that.validarCantidadFacturas);
    },
    /** Valida que el número de facturas 
     * @returns {void}
     **/
    validarCantidadFacturas: function () {
        if ($(this).val() > 1) {
            $("#fecIniSuspension").prop("disabled", true).val("");
            $("#fecFinSuspension").prop("disabled", true).val("");
        } else {
            $("#fecIniSuspension").prop("disabled", false);
            $("#fecFinSuspension").prop("disabled", false);
        }
    },
    /** Valida que la información necesaria para ejecturar el proceso sea correcta, y ejecuta el proceso 
     * @returns {void}
     **/
    prepararProcesoSuspension: function () {
        var chkTipoUso = $('#tblTipoUso tbody tr input:checked');
        var chkMunicipios = $('#tblmunicipios tbody tr input:checked');
        if (chkTipoUso.length === 0) {
            __dom.lanzarAlerta(__app.mensajes.seleccionarTipoUsoSuscripcion, __app.mensajes.atencion);
            return;
        }
        var strMunicipios='';
        for(var indice = 0; indice < chkMunicipios.length; indice++){
            strMunicipios += chkMunicipios[indice].value + ',';
        }
        strMunicipios = strMunicipios.substring(0, strMunicipios.length -1);
        

        var strTiposUso = '';
        for (var indice = 0; indice < chkTipoUso.length; indice++) {
            strTiposUso += chkTipoUso[indice].value + ',';
        }
        strTiposUso = strTiposUso.substring(0, strTiposUso.length - 1);
        var data = {
            tipodeuso: strTiposUso,
            municipios: strMunicipios
            
        };
        procesoReconexionControl.aplicarSuspensiones(data, that.ejecutoProceso);
    },
    /** Hace petición ajax para consultar el progreso del proceso de generar reconexiones.
     *@return {void}
     **/
    consultarProgreso: function () {
        procesoReconexionControl.consultarProgreso(that.actualizarProgreso);
    },
    /** Captura la respuesta del servidor cuando se consulta la información del proceso
     * @param {object} data - Información sobre el proceso en ejecución
     * @returns {void}
     **/
    ejecutoProceso: function (data) {
        switch (data.codigoRespuesta) {
            case 1:
                __dom.lanzarAlerta(__app.mensajes.procesoLanzado, __app.mensajes.atencion, function () {
                    location.reload()
                });
                break;
        }
    },
    /** Actualiza la barra de progreso del informe de la ejecución del proceso.
     * @returns {void}
     **/
    actualizarProgreso: function (data) {
        if (data.codigoRespuesta > 0) {
            if (data.progreso && data.progreso.idProceso) {
                $('#divCampos, #divDialogoResumen').hide();
                $('#numeroRegistrosProcesados').text(data.progreso.numeroRegistrosProcesados);
            } else {
                /*$('#divProgreso').hide();
                 clearInterval(that.intervalProgreso);
                 $('#divCampos, #divDialogoResumen, #divComandos').show();
                 procesoReconexionControl.consultarResumen(that.onConsultarResumenCompleto);*/
                window.location.reload();
            }
        }
    },
    /**
     * Recibe la información del resultado del proceso agrupados por el municipio cargando la información entre
     * las suspensiones canceladas, reconexiones canceladas y las generadas
     * @param {Object} data - Respuesta del servidor
     */
    onConsultarResumenCompleto: function (data) {
        var tbl = $('#tblSuspensiones, #tblResumen, #tblReconexiones').empty();
        if (data.codigoRespuesta !== 1 || !data.datos) {
            return;
        }
        $('#divDialogoResumen').show();
        var resumenExiste = 0;
        var correcto = data.datos.generadas;
        var suspensiones = data.datos.sspcanceladas;
        var reconexiones = data.datos.rcocanceladas;
        var cantSuscripciones = data.datos.cantidadSuscripcionesModificadas;
        if (!!cantSuscripciones && cantSuscripciones > 0) {
            var pMensaje = $('#pMensajeCantidadSuscripciones').show();
            pMensaje.find('span').text(data.datos.cantidadSuscripcionesModificadas);
        }
        if (suspensiones.length > 0) {
            resumenExiste++;
            fillTable('tblSuspensiones', 'formatoErrores', suspensiones, 'Suspensiones canceladas');
        }
        if (reconexiones.length > 0) {
            resumenExiste++;
            fillTable('tblReconexiones', 'formatoErrores', reconexiones, 'Reconexiones canceladas');
        }
        if (correcto.length > 0) {
            resumenExiste++;
            fillTable('tblResumen', 'formatoGeneradas', correcto, 'Reconexiones generadas');
        }


        if (resumenExiste === 0) {
            $('#divDialogoResumen').hide();
        }
        if (resumenExiste > 1) {
            tbl.parent().css('width', '49%');
        } else {
            tbl.parent().css('width', '100%');
        }
    }

};