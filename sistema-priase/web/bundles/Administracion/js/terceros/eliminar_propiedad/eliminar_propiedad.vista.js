var that = null;

/** @namespace */
var eliminarPropiedadVista = {
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
        __app.vistaActual = eliminarPropiedadVista;
        __app.controlActual = eliminarPropiedadControl;
        var comandos = $('div#divComandos');
        comandos.find('#btnGrabar').on('click', that.confirmarGrabarPropiedad);
        comandos.find('#btnCancelar').on('click', that.cancelarcambiopropiedad);
        comandos.find('#btnBuscar').on('click', that.buscarterceropropiedad);
        $('div#propiedades_relacionadas_botonera button#cmdEliminar').on('click', that.trasladarPropiedad);
        $('#cmdSeleccionarTerceroDestino').on('click', that.FiltroTercerodestino);
        $('#cmdQuitarPropiedadEliminar').on('click', that.QuitarPropiedadDestino);
        $('#btnCrearTercero').on('click', that.creartercero);
        $('#b_ter_documento').on('keypress', that.validaNumeroEspaciado);
        $('#b_ter_documento_destino').on('keypress', that.validaNumeroEspaciado);
        $('#b_ter_documento_destino,#b_ter_nombre_destino').on('keypress', that.limpiarDivCrearTerceroDestino);

        that.configurarAutoCompleteTercero();
        that.configurarAutoCompleteMunicipio();
        that.configurarAutoCompleteTerceroDestino();

    },
    limpiarDivCrearTerceroDestino: function (e) {
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
        eliminarPropiedadModel.terceropropiedad = [];
        eliminarPropiedadModel.terceroorigen = null;
        eliminarPropiedadModel.tercerodestino = null;
        eliminarPropiedadModel.terceropropiedadSeleccionado = [];
//        that.limpiarTerceroPropiedadDestino();
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
        Data.tercero = eliminarPropiedadModel.terceroseleccionado;
        Data.documento = $('div#Filtro_Tercero input#b_ter_documento').val();
        Data.nrocatastral = $('div#Filtro_Tercero input#b_pro_numcatastral').val();
        Data.propiedad = $('div#Filtro_Tercero input#b_pro_idepropieda').val();
        Data.municipio = eliminarPropiedadModel.municipioseleccionado;
        Data.barrio = eliminarPropiedadModel.barrioseleccionado;
        Data.direccion = $('div#Filtro_Tercero input#b_pro_direccion').val();
        eliminarPropiedadControl.filtrarTerceroPropiedad(Data, that.mostrarResultadosTercero);

    },
    cargarResultados: function () {
        var posicion = $('table#tblresultadosconsulta tbody tr input[type=radio]:checked').parent().parent().attr('data-fila');
        var terceroActual = $('div#TercActual');
        eliminarPropiedadModel.terceroorigen = eliminarPropiedadModel.terceropropiedad[posicion].idtercero;
        eliminarPropiedadModel.terceropropiedadSeleccionado = eliminarPropiedadModel.terceropropiedad[posicion];
        terceroActual.find('#ter_ideregistro_act').val(eliminarPropiedadModel.terceropropiedad[posicion].idtercero);
        terceroActual.find('#ter_documento_act').val(eliminarPropiedadModel.terceropropiedad[posicion].documento);
        terceroActual.find('#ter_nomcompleto_act').val(eliminarPropiedadModel.terceropropiedad[posicion].nombretercero);
        terceroActual.find('#uni_tiptercero_act').val(eliminarPropiedadModel.terceropropiedad[posicion].tipotercero);
        terceroActual.find('#ter_telfijo_act').val(eliminarPropiedadModel.terceropropiedad[posicion].telefonofijo);
        terceroActual.find('#ter_telcelular_act').val(eliminarPropiedadModel.terceropropiedad[posicion].telefonocelular);
        terceroActual.find('#ter_sexo_act').val(eliminarPropiedadModel.terceropropiedad[posicion].sexo);
        terceroActual.find('#convenio').val(eliminarPropiedadModel.terceropropiedad[posicion].sus_descripcion);
        var data = {};
        data.idtercero = eliminarPropiedadModel.terceropropiedad[posicion].idtercero;
        data.suscriptor = eliminarPropiedadModel.terceropropiedad[posicion].suscriptor;
        eliminarPropiedadControl.filtrarPropiedad(data, that.mostrarResultadosPropiedades);
    },
    mostrarResultadosTercero: function (Data) {
        switch (parseInt(Data.codigoRespuesta)) {
            case 1:
                eliminarPropiedadModel.terceropropiedad = Data.terceropropiedad;
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
        if (eliminarPropiedadModel.terceropropiedad.length > 0)
        {
            $('div#resultadosconsulta').show();
            fillTable("tblresultadosconsulta", "formatoterceropropiedad", "eliminarPropiedadModel.terceropropiedad", 'Resultados');
            $('table#tblresultadosconsulta tbody tr input[type=radio]').on('click', that.cargarResultados);
            if (eliminarPropiedadModel.terceropropiedad.length === 1) {
                $('table#tblresultadosconsulta tbody tr input[type=radio]').prop('checked', 'checked');
                that.cargarResultados();
            }
        }
    },
    mostrarResultadosPropiedades: function (Data) {
        switch (parseInt(Data.codigoRespuesta)) {
            case 1:
                eliminarPropiedadModel.propiedad = Data.propiedad;
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
        if (eliminarPropiedadModel.propiedad.length > 0)
        {
            $('div#propiedades_relacionadas').show();
            var Propiedades = fillTable("PropTerActual", "formatopropiedad", "eliminarPropiedadModel.propiedad", 'Propiedades Relacionadas');
            Propiedades.find('tbody tr input[type="checkbox"]').on('click', that.habilitarEliminarPropiedad);
            that.dialogoActual.dialog('close');
            if (eliminarPropiedadModel.propiedad.length === 1)
            {
                Propiedades.find('tbody tr input[type="checkbox"]').prop('checked', 'checked');
                Propiedades.find('tbody tr input[type="checkbox"]').parent().parent().addClass('selected');
            }

        }
        that.habilitarEliminarPropiedad();
    },
    habilitarEliminarPropiedad: function () {
        var listacheck = $('table#PropTerActual tbody tr input[type="checkbox"]:checked');
        if (listacheck.length > 0)
            $('div#propiedades_relacionadas_botonera button#cmdEliminar').removeAttr('disabled');
        else
            $('div#propiedades_relacionadas_botonera button#cmdEliminar').prop('disabled', 'disabled');
    },
    confirmarGrabarPropiedad: function () {
        if (!eliminarPropiedadModel.terceropropiedadSeleccionado)
        {
            __dom.lanzarAlerta("No hay tercero de origen seleccionado", "Error");
            return false;
        }
        if (eliminarPropiedadModel.propiedaddestino.length <= 0)
        {
            __dom.lanzarAlerta("No hay propiedades seleccionadas para trasladar ", "Error");
            return false;
        }
        __dom.lanzarAlerta("Confirma eliminación de propiedad? ", "Advertencia", that.grabarcambiopropiedad);

    },
    grabarcambiopropiedad: function () {
        var Data = {};

        Data.tercero = eliminarPropiedadModel.terceropropiedadSeleccionado;
        Data.propiedades = eliminarPropiedadModel.propiedaddestino;
        eliminarPropiedadControl.grabarPropiedad(Data, that.mostrarResultadosGrabacion);

    }
    ,
    mostrarResultadosGrabacion: function (Data) {
        switch (parseInt(Data.codigoRespuesta)) {
            case 1:
                __dom.lanzarAlerta(Data.mensaje, " Error ", that.recargar);
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
                    eliminarPropiedadModel.terceroseleccionado = ui.item.idVal;
                },
                function () {
                    eliminarPropiedadModel.terceroseleccionado = undefined;
                }
        );
    },
    sourceAutoCompleteTercero: function (request, response) {
        that.request = request;
        that.response = response;
        var datos = {};
        datos.nombre = request.term;
        eliminarPropiedadModel.terceroseleccionado = null
        eliminarPropiedadControl.buscarTercero(datos, that.mostrarResultadoTercero);
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
                    eliminarPropiedadModel.municipioseleccionado = ui.item.idVal;
                },
                function () {
                    eliminarPropiedadModel.municipioseleccionado = undefined;
                }
        );
    },
    sourceAutoCompleteMuncipio: function (request, response) {
        that.request = request;
        that.response = response;
        var datos = {};
        datos.nombreMunicipio = request.term;
        eliminarPropiedadControl.buscarMunicipio(datos, that.mostrarResultadomunicipio);
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
                    eliminarPropiedadModel.barrioseleccionado = ui.item.idVal;
                },
                function () {
                    eliminarPropiedadModel.barrioseleccionado = undefined;
                }
        );
    },
    sourceAutoCompleteBarrio: function (request, response) {

        if (eliminarPropiedadControl.municipioseleccionado === '') {
            __dom.lanzarAlerta('Debe seleccionar un municipio', 'Error');
            return;
        }
        that.request = request;
        that.response = response;
        var datos = {};
        datos.nombreBarrio = request.term;
        datos.idMunicipio = eliminarPropiedadModel.municipioseleccionado;
        eliminarPropiedadControl.buscarBarrio(datos, that.mostrarResultadoBarrio);
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
        eliminarPropiedadModel.tercerodestino = null;
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
                    eliminarPropiedadModel.terceroDestinoseleccionado = ui.item.idVal;
                },
                function () {
                    eliminarPropiedadModel.terceroDestinoseleccionado = undefined;
                }
        );
    },
    sourceAutoCompleteTerceroDestino: function (request, response) {
        that.request = request;
        that.response = response;
        var datos = {};
        datos.nombre = request.term;
        eliminarPropiedadModel.terceroDestinoseleccionado = null
        eliminarPropiedadControl.buscarTercero(datos, that.mostrarResultadoTerceroDestino);
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
        eliminarPropiedadModel.tercerodestino = null;
        $('#mconsultatercerodestino').text('');
        $('div#resultadosconsulta_destino').hide();
        var Data = {};
        Data.tercero = eliminarPropiedadModel.terceroDestinoseleccionado;
        Data.documento = $('div#Filtro_Tercero_Destino input#b_ter_documento_destino').val();

        if (Data.documento == '')
        {
            $('#mconsultatercerodestino').text('No se ingreso información del tercero  destino');
            return false;
        }
        Data.excluirtercero = eliminarPropiedadModel.terceroorigen;
        eliminarPropiedadControl.filtrarTerceroPropiedad(Data, that.mostrarResultadosTerceroDestino);
    },
    trasladarPropiedad: function () {
        var propiedadesTrasladar = $('table#PropTerActual tbody tr input[type="checkbox"]:checked');
        for (var x = 0; x < propiedadesTrasladar.length; x++)
        {
            var posicion = propiedadesTrasladar.parent().parent().attr('data-fila');
            console.log("Posicion traslado " + posicion);
            var Data = [];
            Data = eliminarPropiedadModel.propiedad[posicion];
            eliminarPropiedadModel.propiedaddestino.push(Data);
            eliminarPropiedadModel.propiedad.splice(posicion, 1);
        }
        that.cargarTablaPropiedades();
        that.cargarTablaPropiedadDestino();
    },
    cargarTablaPropiedadDestino: function () {
        $('div#propiedades_relacionadas_eliminar').hide();
        $('table#tblPropTerDestino').empty();
        if (eliminarPropiedadModel.propiedaddestino.length > 0)
        {
            $('div#propiedades_relacionadas_eliminar').show();
            var PropiedadesDestino = fillTable("tblPropTerDestino", "formatopropiedad", "eliminarPropiedadModel.propiedaddestino", 'Resultados');
            PropiedadesDestino.find('tbody tr input[type="checkbox"]').on('click', that.habilitarQuitarPropiedadDestino);
        }

    },
    QuitarPropiedadDestino: function () {
        var propiedadesTrasladar = $('table#tblPropTerDestino tbody tr input[type="checkbox"]:checked');
        $('table#tblPropTerDestino').empty();
        for (var x = 0; x < propiedadesTrasladar.length; x++)
        {
            var posicion = propiedadesTrasladar.parent().parent().attr('data-fila');
            console.log("Posicion " + posicion);
            var Data = [];
            Data = eliminarPropiedadModel.propiedaddestino[posicion];
            eliminarPropiedadModel.propiedad.push(Data);
            eliminarPropiedadModel.propiedaddestino.splice(posicion, 1);
        }
        that.cargarTablaPropiedades();
        that.cargarTablaPropiedadDestino();

    },
    recargar: function () {
        location.reload();
    },
    habilitarQuitarPropiedadDestino: function () {
        var listacheck = $('table#tblPropTerDestino tbody tr input[type="checkbox"]:checked');
        if (listacheck.length > 0)
            $('div#propiedades_destino_botonera button#cmdQuitarPropiedadEliminar').removeAttr('disabled');
        else
            $('div#propiedades_destino_botonera button#cmdQuitarPropiedadEliminar').prop('disabled', 'disabled');
    },
};
eliminarPropiedadVista.init();