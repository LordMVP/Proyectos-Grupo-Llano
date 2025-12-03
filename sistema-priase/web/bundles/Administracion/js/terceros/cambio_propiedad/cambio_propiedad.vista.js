var that = null;

/** @namespace */
var cambioPropiedadVista = {
    /**
     * hace referencia al último dialogo abierto en la aplicación
     * @type {object}
     */
    dialogoActual: null,
    /**
     * inicializa el programa de abonos
     * @return {void}
     */
    init: function () {
        that = this;
        __app.vistaActual = cambioPropiedadVista;
        __app.controlActual = cambioPropiedadControl;
        var comandos = $('div#divComandos');
        comandos.find('#btnGrabar').on('click', that.confirmarGrabarPropiedad);
        comandos.find('#btnCancelar').on('click', that.cancelarcambiopropiedad);
        comandos.find('#btnBuscar').on('click', that.buscarterceropropiedad);
        $('div#propiedades_relacionadas_botonera button#cmdTrasladar').on('click', that.trasladarPropiedad);
        $('#cmdSeleccionarTerceroDestino').on('click', that.FiltroTercerodestino);
        $('#cmdQuitarPropiedadDestino').on('click', that.QuitarPropiedadDestino);
        $('#btnCrearTercero').on('click', that.creartercero);
        $('#b_ter_documento').on('keypress', that.validaNumeroEspaciado);
        $('#b_ter_documento_destino').on('keypress', that.validaNumeroEspaciado);
        $('#b_ter_documento_destino,#b_ter_nombre_destino').on('keypress', that.limpiarDivCrearTerceroDestino);
        
        that.configurarAutoCompleteTercero();
        that.configurarAutoCompleteMunicipio();
        that.configurarAutoCompleteTerceroDestino();

    },
    limpiarDivCrearTerceroDestino: function(e){
         $('div#divLlamarTercero').hide();
         $('div#divLlamarTercero p#mterceronoexiste').text('');
         
    },
    validaNumeroEspaciado: function (e) {
//          alert("prueba");
        var val = document.all;
        var key = val ? e.keyCode : e.which;
        var jchar = String.fromCharCode(key);
        var jrex = /^([0-9\s])/;
        if (!(jrex.test(jchar)) && (key !== 8 && key !== 0))
        {
            e.stopPropagation();
            e.preventDefault();
        }
    },
    inializaFiltroConsulta: function () {
        cambioPropiedadModel.terceropropiedad = [];
        cambioPropiedadModel.terceroorigen = null;
        cambioPropiedadModel.tercerodestino = null;
        cambioPropiedadModel.terceropropiedadSeleccionado = [];
        that.limpiarTerceroPropiedadDestino();
        $('div#resultadosconsulta').hide();
        $('table#tblresultadosconsulta').empty();

    },
    buscarterceropropiedad: function () {
        $('#propiedades_relacionadas button#cmdSeleccionarTerceroDestino').prop('disabled', 'disabled');
        $('#propiedades_relacionadas button#cmdTrasladar').prop('disabled', 'disabled');
        $('div#tercero_destino').hide();
        $('div#propiedades_relacionadas').hide();
        $('div#TercActual input').val('');
        $('div#tercero_destino input').val('');
        $('div#Filtro_Tercero input').val('');
        $('div#Filtro_Tercero_Destino input').val('');
        that.inializaFiltroConsulta();
        var DialogoFiltro = $('div#Filtro_Tercero');
        that.dialogoActual = DialogoFiltro.dialog({
            modal: true,
            width: 850,
            title: 'Filtrar Tercero',
            buttons: {
                buscar: that.lanzarConsulta,
                cancelar: function () {
                    that.dialogoActual.dialog('close');
                }
            }
        });
    },
    lanzarConsulta: function () {
        var Data = {};
        that.inializaFiltroConsulta();
        Data.tercero = cambioPropiedadModel.terceroseleccionado;
        Data.documento = $('div#Filtro_Tercero input#b_ter_documento').val();
        Data.nrocatastral = $('div#Filtro_Tercero input#b_pro_numcatastral').val();
        Data.propiedad = $('div#Filtro_Tercero input#b_pro_idepropieda').val();
        Data.municipio = cambioPropiedadModel.municipioseleccionado;
        Data.barrio = cambioPropiedadModel.barrioseleccionado;
        Data.direccion = $('div#Filtro_Tercero input#b_pro_direccion').val();
        Data.codigoanterior = $('div#Filtro_Tercero input#b_codigo_anterior').val();
        cambioPropiedadControl.filtrarTerceroPropiedad(Data, that.mostrarResultadosTercero);

    },
    cargarResultados: function () {
        var posicion = $('table#tblresultadosconsulta tbody tr input[type=radio]:checked').parent().parent().attr('data-fila');
        var terceroActual = $('div#TercActual');
        cambioPropiedadModel.terceroorigen = cambioPropiedadModel.terceropropiedad[posicion].idtercero;
        cambioPropiedadModel.terceropropiedadSeleccionado = cambioPropiedadModel.terceropropiedad[posicion];
        terceroActual.find('#ter_ideregistro_act').val(cambioPropiedadModel.terceropropiedad[posicion].idtercero);
        terceroActual.find('#ter_documento_act').val(cambioPropiedadModel.terceropropiedad[posicion].documento);
        terceroActual.find('#ter_nomcompleto_act').val(cambioPropiedadModel.terceropropiedad[posicion].nombretercero);
        terceroActual.find('#uni_tiptercero_act').val(cambioPropiedadModel.terceropropiedad[posicion].tipotercero);
        terceroActual.find('#ter_telfijo_act').val(cambioPropiedadModel.terceropropiedad[posicion].telefonofijo);
        terceroActual.find('#ter_telcelular_act').val(cambioPropiedadModel.terceropropiedad[posicion].telefonocelular);
        terceroActual.find('#ter_sexo_act').val(cambioPropiedadModel.terceropropiedad[posicion].sexo);
        terceroActual.find('#convenio').val(cambioPropiedadModel.terceropropiedad[posicion].sus_descripcion);
        var data = {};
        data.idtercero = cambioPropiedadModel.terceropropiedad[posicion].idtercero;
        data.suscriptor = cambioPropiedadModel.terceropropiedad[posicion].suscriptor;
        cambioPropiedadControl.filtrarPropiedad(data, that.mostrarResultadosPropiedades);
    },
    mostrarResultadosTercero: function (Data) {
        switch (parseInt(Data.codigoRespuesta)) {
            case 1:
                cambioPropiedadModel.terceropropiedad = Data.terceropropiedad;
                that.cargarTablaTercero();
                break;
            case -1 :
                __dom.lanzarAlerta(Data.mensaje, " Error ");
                break;
            default  :
                __dom.lanzarAlerta(Data.mensaje, " Mensaje");
        }
    },
    cargarTablaTercero: function () {
        if (cambioPropiedadModel.terceropropiedad.length > 0)
        {
            $('div#resultadosconsulta').show();
            fillTable("tblresultadosconsulta", "formatoterceropropiedad", "cambioPropiedadModel.terceropropiedad", 'Resultados');
            $('table#tblresultadosconsulta tbody tr input[type=radio]').on('click', that.cargarResultados);
            if (cambioPropiedadModel.terceropropiedad.length === 1) {
                $('table#tblresultadosconsulta tbody tr input[type=radio]').prop('checked', 'checked');
                that.cargarResultados();
            }
        }
    },
    mostrarResultadosPropiedades: function (Data) {
        switch (parseInt(Data.codigoRespuesta)) {
            case 1:
                cambioPropiedadModel.propiedad = Data.propiedad;
                that.cargarTablaPropiedades();
                break;
            case -1:
                __dom.lanzarAlerta(Data.mensaje, " Error ");
                break;
            default :
                __dom.lanzarAlerta(Data.mensaje, " Mensaje");
        }
    },
    cargarTablaPropiedades: function () {
        $('table#PropTerActual').empty();
        $('div#propiedades_relacionadas').hide();
        if (cambioPropiedadModel.propiedad.length > 0)
        {
            $('div#propiedades_relacionadas').show();
            var Propiedades = fillTable("PropTerActual", "formatopropiedad", "cambioPropiedadModel.propiedad", 'Propiedades Relacionadas');
            Propiedades.find('tbody tr input[type="checkbox"]').on('click', that.habilitarTerceroDestino);
            that.dialogoActual.dialog('close');
            if (cambioPropiedadModel.propiedad.length === 1)
            {
                Propiedades.find('tbody tr input[type="checkbox"]').prop('checked', 'checked');
                Propiedades.find('tbody tr input[type="checkbox"]').parent().parent().addClass('selected');
            }

        }
        that.habilitarTerceroDestino();
    },
    habilitarTerceroDestino: function () {
        var listacheck = $('table#PropTerActual tbody tr input[type="checkbox"]:checked');
        if (listacheck.length > 0)
        {
            $('#propiedades_relacionadas_botonera button#cmdSeleccionarTerceroDestino').removeAttr('disabled');
            if (cambioPropiedadModel.tercerodestino)
                $('div#propiedades_relacionadas_botonera button#cmdTrasladar').removeAttr('disabled');
            else
                $('div#propiedades_relacionadas_botonera button#cmdTrasladar').prop('disabled', 'disabled');
        }
        else
        {
            $('div#propiedades_relacionadas_botonera button#cmdTrasladar').prop('disabled', 'disabled');
            $('div#propiedades_relacionadas_botonera button#cmdSeleccionarTerceroDestino').prop('disabled', 'disabled');
        }
    },
    confirmarGrabarPropiedad: function () {
        if (cambioPropiedadModel.tercerodestino === null)
        {
            __dom.lanzarAlerta("No hay un tercero destino seleccionado", "Error");
            return false;
        }

        if (!cambioPropiedadModel.terceropropiedadSeleccionado)
        {
            __dom.lanzarAlerta("No hay tercero de origen seleccionado", "Error");
            return false;
        }
        if (cambioPropiedadModel.propiedaddestino.length <= 0)
        {
            __dom.lanzarAlerta("No hay propiedades seleccionadas para trasladar ", "Error");
            return false;
        }
        __dom.lanzarAlerta("Confirma cambio de propiedad? ", "Advertencia", that.grabarcambiopropiedad);

    },
    grabarcambiopropiedad: function () {
        var Data = {};

        Data.tercerodestino = cambioPropiedadModel.tercerodestino;
        Data.terceroorigen = cambioPropiedadModel.terceropropiedadSeleccionado;
        Data.propiedades = cambioPropiedadModel.propiedaddestino;
        cambioPropiedadControl.grabarPropiedad(Data, that.mostrarResultadosGrabacion);

    }
    ,
    mostrarResultadosGrabacion: function (Data) {
        switch (parseInt(Data.codigoRespuesta)) {
            case 1:
                __dom.lanzarAlerta(Data.mensaje, " Respuesta ", that.recargar);
                break;
            case -1:
                __dom.lanzarAlerta(Data.mensaje, " Error ");
                break;
            default :
                __dom.lanzarAlerta(Data.mensaje, " Mensaje");
        }
    },
    cancelarcambiopropiedad: function () {
        __dom.lanzarAlerta("Confirma cancenlar transacción actual ? ", "Advertencia", that.recargar);
    },
    configurarAutoCompleteTercero: function () {
        __dom.configurarAutocomplete(
                $('div#Filtro_Tercero input#b_ter_nombre'),
                that.sourceAutoCompleteTercero,
                function (event, ui) {
                    $('input#b_ter_nombre').val(ui.item ? ui.item.value : '');
                    cambioPropiedadModel.terceroseleccionado = ui.item.idVal;
                },
                function () {
                    cambioPropiedadModel.terceroseleccionado = undefined;
                }
        );
    },
    sourceAutoCompleteTercero: function (request, response) {
        that.request = request;
        that.response = response;
        var datos = {};
        datos.nombre = request.term;
        cambioPropiedadModel.terceroseleccionado = null
        cambioPropiedadControl.buscarTercero(datos, that.mostrarResultadoTercero);
    },
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
    configurarAutoCompleteMunicipio: function () {
        // Autocompletado de terceros
        __dom.configurarAutocomplete(
                $('div#Filtro_Tercero input#b_uni_municipio'),
                that.sourceAutoCompleteMuncipio,
                function (event, ui) {
                    $('input#b_uni_municipio').val(ui.item ? ui.item.value : '');
                    cambioPropiedadModel.municipioseleccionado = ui.item.idVal;
                },
                function () {
                    cambioPropiedadModel.municipioseleccionado = undefined;
                }
        );
    },
    sourceAutoCompleteMuncipio: function (request, response) {
        that.request = request;
        that.response = response;
        var datos = {};
        datos.nombreMunicipio = request.term;
        cambioPropiedadControl.buscarMunicipio(datos, that.mostrarResultadomunicipio);
    },
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
                $('div#Filtro_Tercero input#b_uni_barrio'),
                that.sourceAutoCompleteBarrio,
                function (event, ui) {
                    $('input#b_uni_barrio').val(ui.item ? ui.item.value : '');
                    cambioPropiedadModel.barrioseleccionado = ui.item.idVal;
                },
                function () {
                    cambioPropiedadModel.barrioseleccionado = undefined;
                }
        );
    },
    sourceAutoCompleteBarrio: function (request, response) {

        if (cambioPropiedadControl.municipioseleccionado === '') {
            __dom.lanzarAlerta('Debe seleccionar un municipio', 'Error');
            return;
        }
        that.request = request;
        that.response = response;
        var datos = {};
        datos.nombreBarrio = request.term;
        datos.idMunicipio = cambioPropiedadModel.municipioseleccionado;
        cambioPropiedadControl.buscarBarrio(datos, that.mostrarResultadoBarrio);
    },
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
    FiltroTercerodestino: function () {
        $('#mconsultatercerodestino').text('');
        $('div#divLlamarTercero').hide();
        that.cargarTablaPropiedadDestino();
        var terceroDestino = $('div#tercero_destino');
        terceroDestino.find('input').val('');
        terceroDestino.hide();
        $('table#tblresultadosconsulta_destino').empty();
        $('div#Filtro_Tercero_Destino input').val('');
        cambioPropiedadModel.tercerodestino = null;
        $('div#propiedades_relacionadas_botonera button#cmdTrasladar').prop('disabled', 'disabled');
        var filtroTerceroDestino = $('div#Filtro_Tercero_Destino');
        that.dialogo_actual = filtroTerceroDestino.dialog({
            modal: true,
            width: 850,
            title: 'Tercero Destino',
            buttons: {
                buscar: that.lanzarConsultaTerceroDestino,
                cancelar: function () {
                    that.dialogo_actual.dialog('close')
                }
            }
        });
    },
    configurarAutoCompleteTerceroDestino: function () {
        __dom.configurarAutocomplete(
                $('input#b_ter_nombre_destino'),
                that.sourceAutoCompleteTerceroDestino,
                function (event, ui) {
                    $('input#b_ter_nombre_destino').val(ui.item ? ui.item.value : '');
                    $('input#b_ter_documento_destino').val(ui.item ? ui.item.documento : '');
                    cambioPropiedadModel.terceroDestinoseleccionado = ui.item.idVal;
                },
                function () {
                    cambioPropiedadModel.terceroDestinoseleccionado = undefined;
                }
        );
    },
    sourceAutoCompleteTerceroDestino: function (request, response) {
        that.request = request;
        that.response = response;
        var datos = {};
        datos.nombre = request.term;
        cambioPropiedadModel.terceroDestinoseleccionado = null
        cambioPropiedadControl.buscarTercero(datos, that.mostrarResultadoTerceroDestino);
    },
    mostrarResultadoTerceroDestino: function (data) {
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
    lanzarConsultaTerceroDestino: function () {
        cambioPropiedadModel.tercerodestino = null;
        $('#mconsultatercerodestino').text('');
        $('div#resultadosconsulta_destino').hide();
        var Data = {};
        Data.tercero = cambioPropiedadModel.terceroDestinoseleccionado;
        Data.documento = $('div#Filtro_Tercero_Destino input#b_ter_documento_destino').val();

        if (Data.documento == '')
        {
            $('#mconsultatercerodestino').text('No se ingreso información del tercero  destino');
            return false;
        }
        Data.excluirtercero = cambioPropiedadModel.terceroorigen;
        cambioPropiedadControl.filtrarTerceroPropiedad(Data, that.mostrarResultadosTerceroDestino);
    },
    mostrarResultadosTerceroDestino: function (Data) {
        var divCrearTercero = $('div#divLlamarTercero');
        divCrearTercero.hide();
        switch (parseInt(Data.codigoRespuesta)) {
            case 1:
                cambioPropiedadModel.terceropropiedaddestino = Data.terceropropiedad;
                that.cargarTablaTerceroDestino();
                break;
            case -1 :
                __dom.lanzarAlerta(Data.mensaje, " Error ");
                break;
            case 0 :
                $('div#divLlamarTercero #mterceronoexiste').empty();
                $('div#divLlamarTercero #mterceronoexiste').text(Data.mensaje);
                divCrearTercero.show();
                break;
            default  :
                __dom.lanzarAlerta(Data.mensaje, " Mensaje");
        }
    },
    cargarTablaTerceroDestino: function () {
        $('div#resultadosconsulta_destino').hide();
        $('table#tblresultadosconsulta_destino').empty();
        $('div#propiedades_destino_botonera button#cmdQuitarPropiedadDestino').prop('disabled', 'disabled');
        if (cambioPropiedadModel.terceropropiedaddestino.length > 0)
        {
            $('div#resultadosconsulta_destino').show();
            fillTable("tblresultadosconsulta_destino", "formatoterceropropiedad", "cambioPropiedadModel.terceropropiedaddestino", 'Resultados');
            $('table#tblresultadosconsulta_destino tbody tr input[type=radio]').on('click', that.cargarDatosTercerosDestino);
            if (cambioPropiedadModel.terceropropiedaddestino.length === 1)
            {
                $('table#tblresultadosconsulta_destino tbody tr input[type=radio]').prop('checked', 'checked');
                that.cargarDatosTercerosDestino();
            }
        }
    },
    cargarDatosTercerosDestino: function () {
        that.dialogo_actual.dialog("close");

        var posicion = $('table#tblresultadosconsulta_destino tbody tr input[type=radio]:checked').parent().parent().attr('data-fila');
        var terceroDestino = $('div#tercero_destino');
        terceroDestino.show();
        cambioPropiedadModel.tercerodestino = cambioPropiedadModel.terceropropiedaddestino[posicion].idtercero;
        terceroDestino.find('#ter_ideregistro_new').val(cambioPropiedadModel.terceropropiedaddestino[posicion].idtercero);
        terceroDestino.find('#ter_documento_new').val(cambioPropiedadModel.terceropropiedaddestino[posicion].documento);
        terceroDestino.find('#ter_nomcompleto_new').val(cambioPropiedadModel.terceropropiedaddestino[posicion].nombretercero);
        terceroDestino.find('#uni_tiptercero_new').val(cambioPropiedadModel.terceropropiedaddestino[posicion].tipotercero);
        terceroDestino.find('#ter_telfijo_new').val(cambioPropiedadModel.terceropropiedaddestino[posicion].telefonofijo);
        terceroDestino.find('#ter_telcelular_new').val(cambioPropiedadModel.terceropropiedaddestino[posicion].telefonocelular);
        terceroDestino.find('#ter_sexo_new').val(cambioPropiedadModel.terceropropiedaddestino[posicion].sexo);
//        terceroDestino.find('#codigo_anterior_new').val(cambioPropiedadModel.terceropropiedaddestino[posicion].codigoanterior);
        $('div#propiedades_relacionadas_botonera button#cmdTrasladar').removeAttr('disabled');
    },
    trasladarPropiedad: function () {
        var propiedadesTrasladar = $('table#PropTerActual tbody tr input[type="checkbox"]:checked');
        for (var x = 0; x < propiedadesTrasladar.length; x++)
        {
            var posicion = propiedadesTrasladar.parent().parent().attr('data-fila');
            console.log("Posicion traslado " + posicion);
            var Data = [];
            Data = cambioPropiedadModel.propiedad[posicion];
            cambioPropiedadModel.propiedaddestino.push(Data);
            cambioPropiedadModel.propiedad.splice(posicion, 1);
        }
        that.cargarTablaPropiedades();
        that.cargarTablaPropiedadDestino();
    },
    cargarTablaPropiedadDestino: function () {
        $('div#propiedades_relacionadas_destino').hide();
        $('table#tblPropTerDestino').empty();
        if (cambioPropiedadModel.propiedaddestino.length > 0)
        {
            $('div#propiedades_relacionadas_destino').show();
            var PropiedadesDestino = fillTable("tblPropTerDestino", "formatopropiedad", "cambioPropiedadModel.propiedaddestino", 'Resultados');
            PropiedadesDestino.find('tbody tr input[type="checkbox"]').on('click', that.habilitarQuitarPropiedadDestino);
        }

    },
    habilitarQuitarPropiedadDestino: function () {
        var listacheck = $('table#tblPropTerDestino tbody tr input[type="checkbox"]:checked');
        if (listacheck.length > 0)
            $('div#propiedades_destino_botonera button#cmdQuitarPropiedadDestino').removeAttr('disabled');
        else
            $('div#propiedades_destino_botonera button#cmdQuitarPropiedadDestino').prop('disabled', 'disabled');

    },
    limpiarTerceroPropiedadDestino: function () {
        cambioPropiedadModel.propiedaddestino = [];
        cambioPropiedadModel.tercerodestino = null;

    },
    QuitarPropiedadDestino: function () {
        var propiedadesTrasladar = $('table#tblPropTerDestino tbody tr input[type="checkbox"]:checked');
        $('table#tblPropTerDestino').empty();
        for (var x = 0; x < propiedadesTrasladar.length; x++)
        {
            var posicion = propiedadesTrasladar.parent().parent().attr('data-fila');
            console.log("Posicion " + posicion);
            var Data = [];
            Data = cambioPropiedadModel.propiedaddestino[posicion];
            cambioPropiedadModel.propiedad.push(Data);
            cambioPropiedadModel.propiedaddestino.splice(posicion, 1);
        }
        that.cargarTablaPropiedades();
        that.cargarTablaPropiedadDestino();

    },
    recargar: function () {
        location.reload();
    },
    creartercero: function () {
        var tercero = $('#b_ter_documento_destino').val();
        window.open('/achagua/facturacion/?modulo=administracion_registr_tercero&ter_documento=' + tercero, '_blank');

    }

};
cambioPropiedadVista.init();