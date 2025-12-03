/**
 * @fileOverview Archivo de vista y control para gestionar suscriptor
 * @author lmrubio
 * @requires gestionarsuscriptor.control.js
 * @requires gestionarsuscriptor.modelo.js
 * @version 1.0.0
 */

/**
 * Objeto que hace referencia al namespace gestionarsuscripcionVista
 * @type {object}
 */
var that = null;

/** @namespace */
var gestionarsuscriptorVista = {
    /**
     * hace referencia al último diálogo abierto en la aplicación
     * @type {object}
     */
    dialogoActual: null,
    /**
     * Función que se invoca al inciar el objeto gestionarsuscripcionVista, asigna comportamientos para los eventos de los controles.
     * @returns {void}
     */
    init: function () {
        that = this;
        __app.vistaActual = gestionarsuscriptorVista;
        __app.controlActual = gestionarsuscriptorControl;
        var comandos = $('div#divComandos');
        comandos.find('#btnBuscar').on('click', that.buscar);
        comandos.find('#btnGrabar').on('click', that.grabar);
        comandos.find('#btnCancelar').on('click', that.cancelar);
        $('#btnCancelar').on('click', that.cancelar);
        $('#btnBuscarSuscriptor').on('click', that.buscarTercero);
        $('#btnAdicionarSuscriptor').on('click', that.AdicionarSuscriptor);
        that.autocompletarTercero();
    },
    /**
     * Verifica que se quiera cancelar la operacion actual
     * @returns {void}
     */
    cancelar: function () {
        var divCancelar = $('div#divCancelar');
        that.dialogoActual = divCancelar.dialogo({
            modal: true,
            width: 850,
            title: 'Cancelar',
            buttons: {
                Aceptar: function () {
                    location.reload();
                }
            }
        });
    },
    /**
     * Se limpia la información y abre cuadro de diálogo para que se busque a un suscriptor.
     */
    buscar: function () {
        $('#divSuscriptor').hide()
        $('#divSuscripciones').hide();
        $('#tblDatosSuscriptor').empty();
        $('#tblDatosSuscripciones').empty();
        gestionarSuscriptorModel.suscripcionesTrasladar = [];
        gestionarSuscriptorModel.suscriptores = [];
        gestionarSuscriptorModel.terceros = [];
        gestionarSuscriptorModel.convenios = [];
        gestionarSuscriptorModel.suscripcionesTrasladar = [];

        var divSuscriptor = $('div#divSuscriptor');
        divSuscriptor.hide();
        var divSuscripciones = $('div#divSuscripciones');
        divSuscripciones.hide();
        var divBuscar = $("div#divFiltroBuscar");
        divBuscar.find("input").removeAttr("disabled");
        divBuscar.find("input[type=text]").val('');
        var divResultados = $('div#divFiltroBuscarResultados');
        divResultados.hide();
        var divTercero = $('div#divTercero');
        divTercero.find('input').val('');
        gestionarSuscriptorModel.idTercero = null;
        that.dialogoActual = divBuscar.dialogo({
            modal: true,
            width: 850,
            title: 'Buscar Suscriptores',
            buttons: {
                Finalizar: that.mostrarRegistroSeleccionado
            }
        });
    },
    /**
     * Guarda en el modelo la información del suscriptor Seleccionado y carga información basica en cajas de texto
     */
    mostrarRegistroSeleccionado: function () {
        var posicion = $('table#tblSuscriptoresResultado input[type=radio]:checked').parent().parent().attr('data-fila');
        var divTercero = $('div#divTercero');
        gestionarSuscriptorModel.idTercero  = gestionarSuscriptorModel.terceros[posicion].idtercero;
        divTercero.find('input#txtDocumento').val(gestionarSuscriptorModel.terceros[posicion].documento);
        divTercero.find('input#txtNombre').val(gestionarSuscriptorModel.terceros[posicion].nombretercero);
        divTercero.find('input#txtIdTercero').val(gestionarSuscriptorModel.terceros[posicion].idtercero);
        divTercero.find('input#txtTelefonoFijo').val(gestionarSuscriptorModel.terceros[posicion].fijo);
        divTercero.find('input#txtTelefonoCelular').val(gestionarSuscriptorModel.terceros[posicion].celular);
        var divSuscriptor = $('div#divSuscriptor');
        divSuscriptor.show();
        var divSuscripciones = $('div#divSuscripciones');
        divSuscripciones.hide();
        that.terceroSeleccionado = gestionarSuscriptorModel.terceros[posicion].idtercero;
        that.getSuscriptores();
        that.dialogoActual.dialog('close');
    },
    /**
     * Valida los parámetros para filtrar los terceros y envía al servidor
     */
    buscarTercero: function () {
        var divBuscar = $("div#divFiltroBuscar");
        var MensajeBuscar = $("#pMensajeBuscar");
        MensajeBuscar.text("");
        var continuar = false;
        $.each((divBuscar.find('input[type=text]')), function (i, item) {
            if ($(item).val() != '')
                continuar = true;
        });
        if (divBuscar.find('#txtFiltDocumento').val() === '' && gestionarSuscriptorModel.idTercero === null)
        {
            continuar = false;
        }

        if (continuar) {
            var Data = {};
            Data.idtercero = gestionarSuscriptorModel.idTercero;
            Data.cedula = divBuscar.find('input#txtFiltDocumento').val();
            Data.opcion = "TER";
            gestionarsuscriptorControl.consultarParametros(Data, that.mostrarConsultarTercero);
        } else {
            MensajeBuscar.text(" Se debe ingresar al menos un parametro de Búsqueda");
        }
    },
    /**
     * Recibe la respuesta del servidor cuando se filtran los terceros
     * @param {number} Data - información enviada por el servidor
     */
    mostrarConsultarTercero: function (Data) {
        if (Data.codigoRespuesta === 1) {
            gestionarSuscriptorModel.terceros = Data.terceros;
            var divResultados = $('div#divFiltroBuscarResultados');
            divResultados.show();
            if (gestionarSuscriptorModel.terceros.length > 0) {
                var tablaContactos = fillTable("tblSuscriptoresResultado", "formatoTerceros", "gestionarSuscriptorModel.terceros");
                divResultados.fadeIn(400);
            } else {
                divResultados.hide();
            }
        }
    },

    AdicionarSuscriptor: function () {
        var Documento = $('input#txtDocumento').val();
        $('input#ClonetxtDocumento').val(Documento);
        var Nombre = $('input#txtNombre').val();
        $('input#ClonetxtNombre').val(Nombre);
        that.getconvenios();
        var divAdicionarSuscriptor = $('div#divAdicionarSuscriptor');
        divAdicionarSuscriptor.find('select#cboConvenio').val('-1');
        divAdicionarSuscriptor.find('textarea#txtDescripcion').val('');
        that.dialogoActual = divAdicionarSuscriptor.dialogo({
            modal: true,
            width: 850,
            title: 'Adicionar Suscriptor',
            buttons: {
                Grabar: that.AdicionarSuscriptorGrabar
            }
        });
    },
    AdicionarSuscriptorGrabar: function () {
        var continuar = true;
        var divAdicionar = $('div#divAdicionarSuscriptor');
        var MensajeAdicionar = $('#pmensajeAdicionar').text('');
        if (gestionarSuscriptorModel.idTercero === null) {
            continuar = false;
            MensajeAdicionar.text('No hay ningún tercero seleccionado ');
        }
        if ($('div#divAdicionarSuscriptor select#cboConvenio').val() === '-1' && continuar) {
            MensajeAdicionar.text('No hay ningún convenio seleccionado ');
            $('div#divAdicionarSuscriptor select#cboConvenio').focus();
            continuar = false;
        }
        if ($('div#divAdicionarSuscriptor textarea#txtDescripcion').val() === '' && continuar) {
            MensajeAdicionar.text('No ha diligenciado la descripción');
            $('div#divAdicionarSuscriptor textarea#txtDescripcion').focus();
            continuar = false;
        }
        if (continuar)
        {
            var Data = {};
            Data.tercero = gestionarSuscriptorModel.idTercero;
            Data.idconvenio = $('div#divAdicionarSuscriptor select#cboConvenio').val();
            Data.idsuscriptor = null;
            Data.convenio = $('div#divAdicionarSuscriptor select#cboConvenio :selected').text();
            Data.descripcion = $('div#divAdicionarSuscriptor textarea#txtDescripcion').val();
            gestionarSuscriptorModel.suscriptores.push(Data);
            that.mostrartablaSuscriptores();
            that.dialogoActual.dialog('close');
        }
    },
    mostrartablaSuscriptores: function (Data) {
        var tablaSuscriptores = fillTable('tblDatosSuscriptor', 'formatoSuscriptor', 'gestionarSuscriptorModel.suscriptores');
        var seleccion = $('table#tblDatosSuscriptor tbody tr td[header=thSeleccionar] input[type=radio]');
        seleccion.on('click', that.getSuscripciones);
        var divSuscripciones = $('div#divSuscripciones');
        divSuscripciones.hide();
    },
    autocompletarTercero: function () {
        __dom.configurarAutocomplete(
            $('div#divFiltroBuscar input#txtFiltNombre'),
            that.sourceautocompletarTercero,
            function (event, ui) {
                $('div#divFiltroBuscar input#txtFiltNombre').val(ui.item.label);
                gestionarSuscriptorModel.idTercero = ui.item.idval;
            },
            function () {
                $('div#divFiltroBuscar input#txtFiltNombre').val(ui.item.label);
                gestionarSuscriptorModel.idTercero = ui.item.idval;
            }
        );
    },
    sourceautocompletarTercero: function (request, response) {
        that.request = request;
        that.response = response;
        var Datos = {};
        __dom.mostrarCargador();
        Datos.nombre = $('div#divFiltroBuscar input#txtFiltNombre').val();
        gestionarsuscriptorControl.consultarTercerosAutocompletar(Datos, that.mostrarTerceros);
    },
    mostrarTerceros: function (Data) {
        if (Data.codigoRespuesta === 1) {
            var result = [];
            $.each(Data.datos, function (i, item) {
                result.push({
                    label: item.nombretercero,
                    value: item.nombretercero,
                    idval: item.idtercero,
                    documento: item.documento
                });
            });
            that.response(result);
        }
    },
    getconvenios: function () {
        var Data = {opcion: 'CON'};
        gestionarsuscriptorControl.consultarParametros(Data, that.mostrarConsultarConvenios);
    },
    mostrarConsultarConvenios: function (Data) {
        if (Data.codigoRespuesta === 1)
        {
            var opcion = "<option value='-1'>Seleccione Convenio</option>";
            $('div#divAdicionarSuscriptor select#cboConvenio').html('');
            $.each(Data.convenios, function (i, item) {
                opcion += "<option value='" + item.idconvenio + "'>" + item.convenio + "</option>";
            });
            $('div#divAdicionarSuscriptor select#cboConvenio').html(opcion);
        }
    },
    getSuscriptores: function () {
        var Data = {};
        Data.idtercero = that.terceroSeleccionado;
        gestionarsuscriptorControl.consultarSuscriptor(Data, that.mostrarSuscriptores);
    },
    mostrarSuscriptores: function (Data) {
        if (Data.codigoRespuesta === 1)
        {
            gestionarSuscriptorModel.suscriptores = Data.suscriptores;
            that.mostrartablaSuscriptores();
//
//            var tablaSuscriptores = fillTable('tblDatosSuscriptor', 'formatoSuscriptor', 'gestionarSuscriptorModel.suscriptores');
//            var seleccion = $('table#tblDatosSuscriptor tbody tr td[header=thSeleccionar] input[type=radio]');
//            seleccion.on('click', that.getSuscripciones);
        }
    },
    getSuscripciones: function () {
        var divSuscripciones = $('div#divSuscripciones');
        divSuscripciones.hide();
        that.posicion = $('table#tblDatosSuscriptor input[type=radio]:checked').parent().parent().attr('data-fila');
        if (gestionarSuscriptorModel.suscriptores[that.posicion ].idsuscriptor != null) {
            var Data = {};
            Data.opcion = 'SUS';
            Data.estado = 'A';
            Data.idsuscriptor = gestionarSuscriptorModel.suscriptores[that.posicion ].idsuscriptor;
            if (gestionarSuscriptorModel.suscriptores[that.posicion].suscripciones === undefined)
            {
                gestionarsuscriptorControl.consultarParametros(Data, that.consolidaInformacionSuscripciones);
            } else {
                that.mostrarTablaSuscripciones();
            }

        }
    },
    consolidaInformacionSuscripciones: function (Data) {
        var divSuscripciones = $('div#divSuscripciones');
        divSuscripciones.hide();

        if (Data.codigoRespuesta === 1)
        {
            var DataDetalle = {};
            gestionarSuscriptorModel.suscriptores[that.posicion].suscripciones = Data.suscripciones;
            $.each(gestionarSuscriptorModel.suscriptores[that.posicion].suscripciones, function (i, item) {

                if (gestionarSuscriptorModel.suscriptores[that.posicion].suscripciones[i].propiedades === undefined ||
                        gestionarSuscriptorModel.suscriptores[that.posicion].suscripciones[i].detalles === undefined) {

                    gestionarSuscriptorModel.suscriptores[that.posicion].suscripciones[i].propiedades = [];
                    gestionarSuscriptorModel.suscriptores[that.posicion].suscripciones[i].detalles = [];
                }

                if (gestionarSuscriptorModel.suscriptores[that.posicion].suscripciones[i].propiedades.length === 0 ||
                        gestionarSuscriptorModel.suscriptores[that.posicion].suscripciones[i].detalles.length === 0)
                {
                    var DataParametros = {};
                    DataParametros.idsuscripcion = item.idsuscripcion;
                    DataDetalle = gestionarsuscriptorControl.getInformacionDetalleSuscripciones(DataParametros);
                    gestionarSuscriptorModel.suscriptores[that.posicion].suscripciones[i].propiedades.push(DataDetalle.resumensuscripcion.propiedad);
                    gestionarSuscriptorModel.suscriptores[that.posicion].suscripciones[i].detalles.push(DataDetalle.resumensuscripcion.suscripcion);
                }



            });
            that.mostrarTablaSuscripciones();

        }
    },
    mostrarTablaSuscripciones: function () {
        var divSuscripciones = $('div#divSuscripciones');
//        alert("llenando tabla suscripciones");
        var tablaSuscripciones = fillTable('tblDatosSuscripciones', 'formatoSuscripciones', ' gestionarSuscriptorModel.suscriptores[' + that.posicion + '].suscripciones');
        var btnDetalles = $('table#tblDatosSuscripciones tbody tr td[header=btnDetalles] input[type=button]');
        var btnPropiedad = $('table#tblDatosSuscripciones tbody tr td[header=btnPropiedad] input[type=button]');
        var btnTrasladar = $('table#tblDatosSuscripciones tbody tr td[header=btnTrasladar] input[type=button]');
        btnDetalles.on('click', that.getDetallesSuscripciones);
        btnPropiedad.on('click', that.getPropiedadSuscripciones);
        btnTrasladar.on('click', that.TrasladarSuscripciones);
        divSuscripciones.show();
    },
    getDetallesSuscripciones: function () {

        var a = $('table#tblDatosSuscriptor input[type=radio]:checked').parent().parent().attr('data-fila');
        var b = $(this).parent().parent().attr('data-fila');
        var divDetalles = $('div#divDetallesSuscripcion');
        divDetalles.find('input#txtIdSuscripcion').val(gestionarSuscriptorModel.suscriptores[a].suscripciones[b].detalles[0].idsuscripcion);
        divDetalles.find('input#txtFechaInicio').val(gestionarSuscriptorModel.suscriptores[a].suscripciones[b].detalles[0].fechainicio);
        divDetalles.find('input#txtTipoSuscripcion').val(gestionarSuscriptorModel.suscriptores[a].suscripciones[b].detalles[0].tiposuscripcion);
        divDetalles.find('input#txtRuta').val(gestionarSuscriptorModel.suscriptores[a].suscripciones[b].detalles[0].ruta);
        divDetalles.find('input#txtCiclo').val(gestionarSuscriptorModel.suscriptores[a].suscripciones[b].detalles[0].ciclo);
        divDetalles.find('input#txtTipoUso').val(gestionarSuscriptorModel.suscriptores[a].suscripciones[b].detalles[0].tipousosuscripcion);
        divDetalles.find('input#txtLiquidacion').val(gestionarSuscriptorModel.suscriptores[a].suscripciones[b].detalles[0].liquidacion);
        divDetalles.find('select#cboEstrato').val(gestionarSuscriptorModel.suscriptores[a].suscripciones[b].detalles[0].estrato);
        divDetalles.find('input#txtEstado').val(gestionarSuscriptorModel.suscriptores[a].suscripciones[b].detalles[0].estado);
        divDetalles.find('input#txtFactorCorreccion').val(gestionarSuscriptorModel.suscriptores[a].suscripciones[b].detalles[0].factorcorreccion);
        that.dialogoActual = divDetalles.dialogo({
            modal: true,
            width: 850,
            title: 'Detalles  Suscripción'
        });

    },
    getPropiedadSuscripciones: function () {
        var a = $('table#tblDatosSuscriptor input[type=radio]:checked').parent().parent().attr('data-fila');
        var b = $(this).parent().parent().attr('data-fila');
        var divPropiedades = $('div#divInformacionPropiedades');
        divPropiedades.find('input#txtNumeroPropiedad').val(gestionarSuscriptorModel.suscriptores[a].suscripciones[b].propiedades[0].numeropropiedad);
        divPropiedades.find('input#txtTipoPropiedad').val(gestionarSuscriptorModel.suscriptores[a].suscripciones[b].propiedades[0].tipopropiedad);
        divPropiedades.find('input#txtMunicipio').val(gestionarSuscriptorModel.suscriptores[a].suscripciones[b].propiedades[0].municipio);
        divPropiedades.find('input#txtBarrio').val(gestionarSuscriptorModel.suscriptores[a].suscripciones[b].propiedades[0].barrio);
        divPropiedades.find('input#txtDireccion').val(gestionarSuscriptorModel.suscriptores[a].suscripciones[b].propiedades[0].direccion);
        divPropiedades.find('input#txtSeccion').val(gestionarSuscriptorModel.suscriptores[a].suscripciones[b].propiedades[0].seccion);
        divPropiedades.find('input#txtManzana').val(gestionarSuscriptorModel.suscriptores[a].suscripciones[b].propiedades[0].manzana);
        divPropiedades.find('input#txtAltoRiesgo').val(gestionarSuscriptorModel.suscriptores[a].suscripciones[b].propiedades[0].altoriesgo);
        divPropiedades.find('input#txtNumeroCatastral').val(gestionarSuscriptorModel.suscriptores[a].suscripciones[b].propiedades[0].numerocatastral);
        divPropiedades.find('input#txtZona').val(gestionarSuscriptorModel.suscriptores[a].suscripciones[b].propiedades[0].zona);
        divPropiedades.find('textarea#txtDescripcion').val(gestionarSuscriptorModel.suscriptores[a].suscripciones[b].propiedades[0].descripcion);
        that.dialogoActual = divPropiedades.dialogo({
            modal: true,
            width: 850,
            title: 'Información Propiedades'
        });
    },
    TrasladarSuscripciones: function () {

        that.a = $('table#tblDatosSuscriptor input[type=radio]:checked').parent().parent().attr('data-fila');
        that.b = $(this).parent().parent().attr('data-fila');
        var Data = {};
        Data.opcion = 'DES';
        Data.tercero = gestionarSuscriptorModel.suscriptores[that.a].suscripciones[that.b].idtercero;
        Data.suscriptor = gestionarSuscriptorModel.suscriptores[that.a].suscripciones[that.b].idsuscriptor;
        Data.tiposuscripcion = gestionarSuscriptorModel.suscriptores[that.a].suscripciones[that.b].idtiposuscripcion;
        Data.suscripcion = gestionarSuscriptorModel.suscriptores[that.a].suscripciones[that.b].idsuscripcion;
        ;
        gestionarsuscriptorControl.consultarParametros(Data, that.mostrarInformacionTrasladar);
    },
    mostrarInformacionTrasladar: function (Data) {
        if (Data.codigoRespuesta === 1) {
            var divTrasladar = $('div#divTrasladarSuscripcion');

            var opciones = '<option value=-1>Seleccione Destino</option>';

            if (gestionarSuscriptorModel.suscripcionesTrasladar.length === 0)
            {
                $.each(Data.conveniostrasladar, function (i, item) {
                    opciones += '<option value=' + item.suscriptor + '>' + item.suscriptor + " " + item.convenio + '</option>';
                });
            } else {
                $.each(gestionarSuscriptorModel.suscriptores, function (i, suscriptores) {
                    if (suscriptores.idsuscriptor !== gestionarSuscriptorModel.suscriptores[that.a].idsuscriptor)
                        opciones += '<option value=' + suscriptores.idsuscriptor + '>'+ suscriptores.idsuscriptor + " " + suscriptores.convenio + '</option>';
                });

            }

            divTrasladar.find('select#cboDestino').html('');
            divTrasladar.find('select#cboDestino').html(opciones);
            divTrasladar.find('input#txtIdSuscripcion').val(gestionarSuscriptorModel.suscriptores[that.a].suscripciones[that.b].idsuscripcion);
            divTrasladar.find('input#txtCodigoAnterior').val(gestionarSuscriptorModel.suscriptores[that.a].suscripciones[that.b].codigoanterior);
            divTrasladar.find('input#txtNombreTercero').val(gestionarSuscriptorModel.suscriptores[that.a].suscripciones[that.b].nombretercero);
            divTrasladar.find('input#txtIdMedidor').val(gestionarSuscriptorModel.suscriptores[that.a].suscripciones[that.b].numeropropiedad);
            divTrasladar.find('input#txtMunicipio').val(gestionarSuscriptorModel.suscriptores[that.a].suscripciones[that.b].municipio);
            divTrasladar.find('input#txtDireccion').val(gestionarSuscriptorModel.suscriptores[that.a].suscripciones[that.b].direccion);
            divTrasladar.find('input#txtBarrio').val(gestionarSuscriptorModel.suscriptores[that.a].suscripciones[that.b].propiedades[0].barrio);
            divTrasladar.find('input#txtTipoUso').val(gestionarSuscriptorModel.suscriptores[that.a].suscripciones[that.b].detalles[0].tipousosuscripcion);
            divTrasladar.find('input#txtNumeroCatastral').val(gestionarSuscriptorModel.suscriptores[that.a].suscripciones[that.b].numerocatastral);
            var divTrasladar = $('div#divTrasladarSuscripcion');
            that.dialogoActual = divTrasladar.dialogo({
                modal: true,
                width: 850,
                title: 'Trasladar Suscripcion',
                buttons: {grabar: that.informacionTrasladarGrabar}
            });
        }
    },
    informacionTrasladarGrabar: function () {
//        alert(" grabando traslado ");
        var divTrasladar = $('div#divTrasladarSuscripcion');
        var continuar = true;
        if (divTrasladar.find('select#cboDestino').val() === '-1')
        {
            continuar = false;
        }
        if (continuar)
        {
            var SuscripcionesTrasladar = {};
            SuscripcionesTrasladar.idsuscritorNuevo = parseInt(divTrasladar.find('select#cboDestino').val());
            SuscripcionesTrasladar.idsuscritorAnterior = gestionarSuscriptorModel.suscriptores[that.a].suscripciones[that.b].idsuscriptor;
            SuscripcionesTrasladar.idsuscripcion = gestionarSuscriptorModel.suscriptores[that.a].suscripciones[that.b].idsuscripcion;
            SuscripcionesTrasladar.tipoTraslado = divTrasladar.find('input[type=radio]:checked').val();

            /**
             * Actualizando Modelo JS de movmiento de suscripcion
             */
            var SuscripcionActual = {};
            SuscripcionActual = gestionarSuscriptorModel.suscriptores[that.a].suscripciones[that.b];
            SuscripcionActual.idSuscriptor = SuscripcionesTrasladar.idsuscritorNuevo;
            $.each(gestionarSuscriptorModel.suscriptores, function (i, suscriptores) {
//                alert ("validando  suscriptor antes "+suscriptores.idsuscriptor + " nuevo :" +SuscripcionesTrasladar.idsuscritorNuevo);
                if (parseInt(suscriptores.idsuscriptor) === SuscripcionesTrasladar.idsuscritorNuevo) {
                    if (gestionarSuscriptorModel.suscriptores[i].suscripciones === undefined) {
                        gestionarSuscriptorModel.suscriptores[i].suscripciones = [];
                    }
                    gestionarSuscriptorModel.suscriptores[i].suscripciones.push(SuscripcionActual);
                    gestionarSuscriptorModel.suscripcionesTrasladar.push(SuscripcionesTrasladar);
                    gestionarSuscriptorModel.suscriptores[that.a].suscripciones.splice(that.b, 1);
                    return true;
                }
            });

            that.posicion = that.a;
            that.mostrarTablaSuscripciones();
            that.dialogoActual.dialog('close');
        }
        /**
         *  Si es temporal en el sus_suscripcion sus_modconvenio = 'S'
         *     y se registro como esta actualmente la suscripcion a trasladar tal cual como esta a tabla trds_tradetsuscrip (suscriptor, suscripcion)
         *     cambiar el suscriptor en la suscripcion
         */
// pendiente programar

    },
    grabar: function () {
        var Datos = {};
        Datos.nuevosuscriptor = [];
        Datos.trasladarSuscripciones = gestionarSuscriptorModel.suscripcionesTrasladar;
        $.each(gestionarSuscriptorModel.suscriptores, function (i, item) {
               console.log(item);
            if (item.idsuscriptor === null)
            {   var info ={} ;
                info.convenio = item.convenio ;
                info.idconvenio = item.idconvenio ;
                info.descripcion = item.descripcion ;
                info.tercero = item.tercero ;
                Datos.nuevosuscriptor.push(info);
            }
        });
        if (Datos.nuevosuscriptor.length > 0 || Datos.trasladarSuscripciones.length > 0)
        {
            console.log(Datos) ;
            gestionarsuscriptorControl.grabar(Datos, that.mostrarResultadosGrabar);
        } else {
            __dom.lanzarAlerta("No hay información para procesar", "Error");
        }
    },
    mostrarResultadosGrabar: function (Data) {
        if (Data.codigoRespuesta === 1)
        {
            __dom.lanzarAlerta(Data.mensaje, "Resultado", that.recarga);
        }
    },
    recarga: function () {
        location.reload();
    }


};
gestionarsuscriptorVista.init();
