/**
 * @fileOverview Archivo de vista y control Habilitar Ventas
 * @author Oscar A. Baquero
 * @requires gestionruta.control.js
 * @version 1.0.0
 */

var that = null;
/** @namespace */

var gestionrutaVista = {

    /**Inicializa el programa de registro maestro Rutas
     * @returns {void}
     */
    /**
     * Guarda una referencia al dialogo actual de la interfaz, al diálogo que esté abierto.
     * @type {Object}
     */
    dialogoActual: null,

    init: function () {

        that = gestionrutaVista;
        that.aliasRutasNumeros('txtAliasRuta');
        $('#txtAliasRuta').on('blur', that.aliasRutasLongitud);
        $('#btnNuevo').on('click', that.nuevosData);
        $('#btnFiltrar').on('click', that.buscarRutas);
        $('#btnBuscarRuta').on('click', that.onBuscaBarrios);
        $('#btnVencimientoSuspension').on('click', that.onArmaPeriodosRutas);
        $('#btnGrabar').on('click', that.grabaRutasPeriodos);
        $('#cboAno').on('change', that.OnConsultaPeriodoVencimiento);

    },

    grabaRutasPeriodos: function () {
        
        if (gestionrutaModel.insert === 1 && gestionrutaModel.update === null) {
            if ($('select#cboCiclo').val() == -1 || $('select#cboCiclo').val() == null || $('select#cboCiclo').val() == '') {
                __dom.lanzarAlerta('Seleccione un Ciclo', 'Advertencia');
                return;
            }
            if ($('#txtidRuta').val() !== "") {
                __dom.lanzarAlerta('Codigo de ruta ya esta creado', 'Advertencia');
                return;
            }
            if ($('#txtNombreRuta').val() === "") {
                __dom.lanzarAlerta('Por favor digite el nombre de la ruta', 'Advertencia');
                return;
            }
            if (that.aliasRutasLongitud() === 1){
                return;
            } 
            var data = {
                nombreRuta: $('#txtNombreRuta').val(),
                aliasRuta: $('#txtAliasRuta').val(),
                idTipoRuta: $('select#cboTipoRuta').val(),
                idCiclo: $('select#cboCiclo').val()
            };
            gestionrutaControl.grabarRuta({parametros: data}, that.onResultadoGrabar);
        }

        if (gestionrutaModel.insert === null && gestionrutaModel.update === 1) {
            if (gestionrutaModel.periodoVencimiento.length > 0) {
                that.onActualizaPeriodoVencimiento();
                var contador = 0;
                for (var i = 0; i < gestionrutaModel.periodoVencimiento.length; i++) {
                    if ((gestionrutaModel.periodoVencimiento[i]['fecvencimiento'] != '' && gestionrutaModel.periodoVencimiento[i]['fecsuspension'] != '')) {
                        contador++;
                    }
                }

                if (contador === 0) {
                    __dom.lanzarAlerta('Error, No hay fechas (suspension ó vencimiento) digitadas', 'Advertencia');
                    return;
                }
                if (contador < 11) {
                    that.dialogoActual = $('#divConfirma').dialogo({
                        resizable: false,
                        heigth: 250,
                        width: 500,
                        modal: true,
                        title: 'Continuar con el Cargue de Fechas',
                        buttons: {
                            Continuar: function () {
                                that.dialogoActual.dialog('close');
                                that.onCargaActualizacionFechas();
                            },
                            Cancelar: function () {
                                that.dialogoActual.dialog('close');
                            }
                        }
                    });
                }

            }
        }
    },

    onCargaActualizacionFechas: function () {
        that.onArmaMesesReplicarRuta();
        var data = {
            periodoreplicar: gestionrutaModel.periodoReplicar,
            rutasReplicar: gestionrutaModel.rutasReplicar,
            periodovencimiento: gestionrutaModel.periodoVencimiento,
            idciclo: $('select#cboCiclo').val(),
            idruta: $('#txtidRuta').val()
        };
        gestionrutaControl.actualizaRutaPeriodosFechas({parametros: data}, that.onResultadoActualizacion);
    },

    onResultadoActualizacion: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(data.mensaje, 'Error Actualizando');
                setTimeout(function () {
                    location.reload();
                }, 1000);
                break;
            case 1:
                __dom.lanzarAlerta(data.mensaje, 'Registro Grabado Correctamente');
                setTimeout(function () {
                    location.reload();
                }, 500);
                break;
            case - 1:
                __dom.lanzarAlerta(data.mensaje, 'Error en la Aplicación');
                setTimeout(function () {
                    location.reload();
                }, 1000);
                break;

            default:

                break;
        }
    },

    onArmaMesesReplicarRuta: function () {
        gestionrutaModel.periodoReplicar = [];
        gestionrutaModel.rutasReplicar = [];
        var tblPeriodos = $('#tblPeriodos tbody tr input:checked');
        var periodoReplicar = '';
        for (var i = 0; i < tblPeriodos.length; i++) {
            periodoReplicar += tblPeriodos[i].value + ',';
        }
        periodoReplicar = periodoReplicar.substring(0, periodoReplicar.length - 1);
        gestionrutaModel.periodoReplicar = periodoReplicar;

        var tblRutas = $('#tblRutas tbody tr input:checked');
        var rutasReplicar = '';
        for (var i = 0; i < tblRutas.length; i++) {
            rutasReplicar += tblRutas[i].value + ',';
        }
        rutasReplicar = rutasReplicar.substring(0, rutasReplicar.length - 1);
        gestionrutaModel.rutasReplicar = rutasReplicar;
    },

    onActualizaPeriodoVencimiento: function () {
        var tblRutaPeriodos = $('#tblRutaPeriodos tbody tr ');
        for (var i = 0; i < tblRutaPeriodos.length; i++) {
            var fila = $(tblRutaPeriodos[i]).attr('data-fila');
            var idPeriodo = $(tblRutaPeriodos[i]).find('td[header="thIdCodigo"]').text();
            var fechaVencimiento = $(tblRutaPeriodos[i]).find('td[header="thFechaVencimiento"] input').val();
            var fechaSuspension = $(tblRutaPeriodos[i]).find('td[header="thFechaSS"] input').val();
            gestionrutaModel.periodoVencimiento[fila]['fecvencimiento'] = fechaVencimiento;
            gestionrutaModel.periodoVencimiento[fila]['fecsuspension'] = fechaSuspension;
        }
    },

    onResultadoGrabar: function (data) {

        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(data.mensaje, 'Error');
                break;
            case 1:
                $('#txtidRuta').val(data.data.idRuta);
                __dom.lanzarAlerta(data.mensaje + ';  idCódigo de ruta ' + data.data.idRuta + '.<br>\n\nA continuación, si desea elija un año; para parametrizar Fechas Vencimientos y Suspensión ', 'Registro Grabado Correctamente');
                that.armaDataMunicipio(data);
                /* setTimeout(function () {
                 location.reload();
                 }, 1000);*/
                break;
            case - 1:
                __dom.lanzarAlerta(data.mensaje, 'Error');
                break;

            default:

                break;
        }
    },

    nuevosData: function () {
        that.limpiaCampos();
        gestionrutaModel.insert = 1;
        gestionrutaModel.update = null;
        $('#txtNombreRuta').removeAttr('disabled');
        $('#txtAliasRuta').removeAttr('disabled');
        $('#cboCiclo').removeAttr('disabled');
        $('#btnVencimientoSuspension').hide();
        $('#cboTipoRuta').removeAttr('disabled');
    },

    armarcboMunicipios: function (data) {
        var cboMunicipio = $('#cboMunicipio');
        cboMunicipio.empty();
        var opcion = $('<option>').val(-1).text('Selecciona un Municipio ..');
        cboMunicipio.append(opcion);
        for (var i = 0; i < data.municipios.length; i++) {
            var municipio = data.municipios[i];
            var opcion = $('<option>').val(municipio.idmunicipio).text(municipio.municipio);
            cboMunicipio.append(opcion);
        }
    },

    buscarRutas: function () {
        that.limpiaCampos();
        gestionrutaModel.update = 1;
        gestionrutaModel.insert = null;
        $('#btnVencimientoSuspension').show();
        var dialogo = $('#divBuscarRuta');
        dialogo.find('input[type = text]').val('');
        that.dialogoActual = dialogo.dialogo({
            modal: true,
            width: 700,
            title: 'Buscar Rutas',
            buttons: {
                Finalizar: that.finalizaResultadoRutas
            }
        });
    },

    onBuscaBarrios: function () {


        $('#mensajeAlertaDialogo').text('');

        if ($('#cboCicloBuscar').val() == '-1' && $('#txtNombreRutaD').val() == "" && $('#txtCodRutaD').val() == "") {
            $('#mensajeAlertaDialogo').text('Seleccione o digite un campo ');
            $('#cboCicloBuscar').focus();
            return;
        }

        var data = {
            'ideruta': $('#txtCodRutaD').val(),
            'rutnombre': $('#txtNombreRutaD').val(),
            'idciclo': $('#cboCicloBuscar').val(),
            'dialogo': 'dialogo'
        };
        gestionrutaControl.buscarRutas({parametros: data}, that.onCargaResultadoRutas);
    },

    onCargaResultadoRutas: function (data) {
        switch (data.codigoRespuesta) {
            case 1:
                that.onResultadoRutas(data);
                break;
            case 0:
                __dom.lanzarAlerta(data.mensaje, 'Advertencia');
                break;
            default:

                break;
        }
    },

    onResultadoRutas: function (data) {

        $('#tblResultadoFiltro').empty();
        __dom.ocultarCargador();
        gestionrutaModel.rutas = data.rutas;
        if (parseInt(data.codigoRespuesta) === 0) {
            var pmensaje = $('#mensajeAlertaDialogo').text(data.mensaje);
            return;
        }
        var tablaRutas = fillTable("tblResultadoFiltro", "formatoRutas", data.rutas, ' ');
        tablaRutas.find('thead tr th[id="thSelector"] input:checkbox').remove();
        var divRsultados = $('#divResultadosFiltro').show();

    },

    finalizaResultadoRutas: function () {
        $('#fieldCabecera').hide();
        $('#tblRutaPeriodos').hide();
        gestionrutaModel.insert = null;
        gestionrutaModel.update = 1;
        that.dialogoActual.dialog('close');
        var posicion = $('table#tblResultadoFiltro input[type=radio]:checked').parent().parent().attr('data-fila');
        var resultado = gestionrutaModel.rutas[posicion];
        $('#txtidRuta').val(resultado.idruta).attr('disabled', true);
        $('#txtNombreRuta').val(resultado.nomruta).attr('disabled', true);
        $('#txtAliasRuta').val(resultado.alias).attr('disabled', true);
        $('select#cboTipoRuta').attr('disabled', true);
        var data = {
            'idruta': resultado.idruta
        };
        gestionrutaModel.periodoVencimiento = [];
        gestionrutaModel.rutasCiclo = [];
        gestionrutaModel.periodoRutas = [];
        gestionrutaControl.buscaMunicipiosBarrios(data, that.onFinalizaConsulta);
    },

    onFinalizaConsulta: function (data) {
        switch (data.codigoRespuesta) {
            case 1:
                that.armaDataMunicipio(data)
                break;

            case 0:
                __dom.lanzarAlerta(data.mensaje, 'Advertencia');
                break;

            default:

                break;
        }
    },

    armaDataMunicipio: function (data) {
        gestionrutaModel.insert = null;
        gestionrutaModel.update = 1;
        if (data.data.municipiobarrio.length > 0) {

            var tablaMunicipioBarrio = fillTable("tblMunicipioBarrio", "formatoRutasBarrios", data.data.municipiobarrio, '').show();
            $('div#municipioBarrio').show();
        }
        if (data.data.anos.length > 0) {
            //$('select#cboCiclo').val(parseInt($('#cboCicloBuscar').val())).attr('disabled', true);
            console.log(data.data.municipiobarrio);
            $('select#cboCiclo').val(data.data.municipiobarrio[0]['idciclo']).attr('disabled', true);
            var divAnos = $('select#cboAno');
            divAnos.empty();
            divAnos.append($('<option>').text('Seleccione').val(-1));
            $.each(data.data.anos, function (index, anos) {
                divAnos.append($('<option>').text(anos.ano).val(anos.ano));
            });
        }
        $('#divAno').show();
    },

    OnConsultaPeriodoVencimiento: function () {
        if ($('#txtidRuta').val() == null || $('#txtidRuta').val() == "") {
            return;
        }
        if ($('select#cboAno').val() == null || $('select#cboAno').val() == "" || $('select#cboAno').val() == -1) {
            __dom.lanzarAlerta('Por favor seleccionar Año', 'Advertencia');
            return;
        }
        var data = {
            idruta: $('#txtidRuta').val(),
            ano: $('select#cboAno').val(),
            idciclo: $('select#cboCiclo').val()
        };
        gestionrutaControl.consultaPeriodoVencimiento({parametros: data}, that.OnResultadoPeriodoVencimiento);
    },

    OnResultadoPeriodoVencimiento: function (data) {

        switch (data.codigoRespuesta) {
            case - 1:
                __dom.lanzarAlerta(data.mensaje, 'Error');
                break;
            case 0:
                __dom.lanzarAlerta(data.mensaje, 'Advertencia');
                break;
            case 1:
                that.OnArmaResultadoPeriodoVencimiento(data);
                break;

            default:

                break;
        }
    },

    OnArmaResultadoPeriodoVencimiento: function (data) {
        $('#fieldCabecera').hide();
        gestionrutaModel.periodoVencimiento = [];
        gestionrutaModel.rutasCiclo = [];
        gestionrutaModel.periodoRutas = [];
        if (data.data.periodovencimiento.length > 0) {
            gestionrutaModel.periodoVencimiento = data.data.periodovencimiento;
            gestionrutaModel.rutasCiclo = data.data.idRutasCiclo;
            var tblPeriodos = fillTable("tblRutaPeriodos", "formatoPeriodoVencimiento", data.data.periodovencimiento, 'Periodos').show();

            var filas = $('#tblRutaPeriodos tbody tr');
            filas.find('td[header="thFechaIni"] input').attr('disabled', true);
            filas.find('td[header="thFechaFin"] input').attr('disabled', true);
            filas.find('td[header="thFechaVencimiento"] input').on('change', that.onValidaFecha);
            filas.find('td[header="thFechaSS"] input').on('change', that.onValidaFecha);
            for (var i = 0; i < filas.length; i++) {
                var fila = $(filas[i]);
                __dom.configurarCalendarioGuion(fila.find('td[header="thFechaIni"] input').attr('id'));
                __dom.configurarCalendarioGuion(fila.find('td[header="thFechaFin"] input').attr('id'));
                __dom.configurarCalendarioGuion(fila.find('td[header="thFechaVencimiento"] input').attr('id'));
                __dom.configurarCalendarioGuion(fila.find('td[header="thFechaSS"] input').attr('id'));
            }
        }
    },

    onValidaFecha: function () {
        var _this = $(this);
        var trSeleccionado = _this.parent().parent();
        var idPosicion = trSeleccionado.attr('data-fila');
        var fechaFinal = trSeleccionado.find('td[header="thFechaFin"] input').attr('value');
        var fechaSSVen = (_this.val());
        if (that.resultadoValidacionFecha(fechaFinal, fechaSSVen)) {
            _this.val('');
            __dom.lanzarAlerta('La fecha ' + fechaSSVen + ' seleccionada; no se encuentra en el rango para el periodo de ' + gestionrutaModel.periodoVencimiento[idPosicion]['nombre'], 'Advertencia');
            gestionrutaModel.periodoVencimiento[idPosicion]['fecvencimiento'] = '';
            gestionrutaModel.periodoVencimiento[idPosicion]['fecsuspension'] = '';
            return;
        }
        gestionrutaModel.periodoVencimiento[idPosicion]['fecvencimiento'] = trSeleccionado.find('td[header="thFechaVencimiento"] input ').val();
        gestionrutaModel.periodoVencimiento[idPosicion]['fecsuspension'] = trSeleccionado.find('td[header="thFechaSS"] input ').val();
    },

    resultadoValidacionFecha: function (fechaFinal, fechaSSVen) {
        var resultadoFecInicial = fechaFinal.split("-");
        var fechaInicialDate = new Date(resultadoFecInicial[0], resultadoFecInicial[1] - 1, resultadoFecInicial[2]);
        var resultadoFecFinal = fechaFinal.split("-");
        var fechaFinalDate = new Date(resultadoFecFinal[0], resultadoFecFinal[1], resultadoFecFinal[2]);
        var resultadoFecSSven = fechaSSVen.split("-");
        var fechaSSVenDate = new Date(resultadoFecSSven[0], resultadoFecSSven[1] - 1, resultadoFecSSven[2]);
        if (fechaSSVenDate > fechaFinalDate || fechaSSVenDate < fechaInicialDate) {
            return true;
        }
        return false;
    },

    onArmaPeriodosRutas: function () {
        that.onActualizaPeriodoVencimiento();
        $('#fieldCabecera').hide();
        $('#tblPeriodos').empty();
        $('#tblRutas').empty();
        gestionrutaModel.periodoRutas = [];
        for (var i = 0; i < gestionrutaModel.periodoVencimiento.length; i++) {
            if ((gestionrutaModel.periodoVencimiento[i]['fecvencimiento'] == null || gestionrutaModel.periodoVencimiento[i]['fecvencimiento'] == '')
                    && (gestionrutaModel.periodoVencimiento[i]['fecsuspension'] == '' || gestionrutaModel.periodoVencimiento[i]['fecsuspension'] == null)) {
                __dom.lanzarAlerta('Hay campos de "Fecha Vencimiento"  ó  "Fecha Suspencion" sin diligenciar ', 'Advertencia');
                continue;
            }
            gestionrutaModel.periodoRutas.push(gestionrutaModel.periodoVencimiento[i]);
        }
        if (gestionrutaModel.periodoRutas.length > 0) {
            $('#fieldCabecera').show();
            var tblPeriodos = fillTable("tblPeriodos", "formatoPeriodo", gestionrutaModel.periodoRutas, 'Meses a Replicar');
            var tblPeriodos = fillTable("tblRutas", "formatoRutasPeriodo", gestionrutaModel.rutasCiclo, 'Rutas');
        }
    },

    limpiaCampos: function () {

        gestionrutaModel.periodoRutas = [];
        gestionrutaModel.idRuta = [];
        gestionrutaModel.periodoVencimiento = [];
        gestionrutaModel.rutas = [];
        gestionrutaModel.rutasCiclo = [];
        var campos = $('div#divPanelContenedor').find('input[type=text]');
        var selectores = $('div#divPanelContenedor').find('select').not("select#cboTipoRuta");
        for (var i = 0; i < campos.length; i++) {
            var campo = $(campos[i]);
            campo.val('');
        }
        for (var i = 0; i < selectores.length; i++) {
            var selector = $(selectores[i]);
            selector.val(-1);
        }
        $('#fieldCabecera').hide();
        $('#tblRutaPeriodos').hide();
        $('#municipioBarrio').hide();
        $('#divAno').hide();
        $('#divResultadosFiltro').hide();

    },
    
     aliasRutasLongitud: function () {
        var aliasLongitud =  $('#txtAliasRuta').val();
        if(aliasLongitud.length < 3 ){
            $('#txtAliasRuta').val("");
            __dom.lanzarAlerta('Por favor dígite minimo 3 Dígitos, en el campo alias Ruta', 'ERROR');
           // $('#txtAliasRuta').focus();
            return 1;
        }
                    
    },
    
    
    aliasRutasNumeros:function (selector) {
    var input = selector;
    if (!(selector instanceof jQuery)) {
        var input = $('#' + selector);
    }

    var regex = /^[0-9]*$/;

    var eventos = {};
    eventos.keypress = function (e) {
        if (e.which === 32) {
            return false;
        }
        if (!regex.test(String.fromCharCode(e.which))) {
            return false;
        } 
    };
    return input.on(eventos);
}

};
gestionrutaVista.init();