
var that;
var rutasVista =
        {
            
            dialogoActual: null,
    
            init: function () {
                that = this;
                $('div#divComandos input#btnNuevo').on('click', that.eventoNuevo);
                $('div#divComandos input#btnGrabar').on('click', that.confirmarGrabar);
                $('div#Rutas input#btnVerSuscripcionesRuta').on('click', that.mostrarTablaRutas);
                $('div#Rutas input#btnActualizacionMasiva').on('click', that.confirmaActualizacionMasiva);

                //$('div#buscaSuscripcion input#btnBuscaSuscripcion').on('click', that.mostrarBuscaRutas);

                that.configurarAutoComplete();
                $(window).on('resize', that.onVentanaResize);
            },
            /** Ajusta tamaño de tabla e interfaz según tamaño de pantalla
             * @returns {void}
             **/
            onVentanaResize: function () {
                var margenLateral = (parseFloat($('#contenedor').css('margin-left').replace('px', '')) * 2) + 20;
                var anchoMenu = $('#menu').width();
                var anchoBody = $('body').width();

                ///OJO TABLAS A REAJUSTAR
                $('#tblRutasSin_wrapper, #tblRutasAsi_wrapper').width((anchoBody - margenLateral) - (anchoMenu + 100));
            },
            mostrarTablaRutas: function ()
            {
                $('div#divComandos input#btnNuevo').attr("disabled", false);
                var divSuscriptores2 = $('div#Rutas');
                var idRuta = divSuscriptores2.find('#cboRutas');
                var datos = {};
                var datos1 = {};
                var idSecuencia = 0;
                rutasModel.ideRuta = idRuta.val();

                datos.idRuta = idRuta.val();
                datos.idSecuencia = idSecuencia;

                rutasControl.consultarRutasSin(datos, that.mostrarResultadoRutaSin);
                idSecuencia = 1;
                datos1.idRuta = idRuta.val();
                datos1.idSecuencia = idSecuencia;
                rutasControl.consultarRutasAsi(datos1, that.mostrarResultadoRutaAsi);
                //$("div#buscaSuscripcion").show();
                $("div#detalleRutasSin").show();
            },
            mostrarResultadoRutaSin: function (data) {
                __dom.ocultarCargador();

                rutasModel.informacionRutasSin = data.rutas;
                var divRutasSin = $('div#RutasSin');

                var tblRutasSin = divRutasSin.find('#tblRutasSin');
                tblRutasSin.dataTable({
                    data: rutasModel.informacionRutasSin,
                    columns: [
                        {title: 'Suscripción', data: 'idsuscripcion'},
                        {title: 'Código', data: 'pcodigo'},
                        {title: 'Nombre Tercero', data: 'tercero'},
                        {title: 'N° Medidor', data: 'idpropiedad'},
                        {title: 'Dirección', data: 'direccion'},
                        {title: 'Barrio', data: 'barrio'},
                        {title: 'Municipio', data: 'municipio'},
                        {title: 'Asignar', data: null}
                    ],
                    language: {
                        url: '/achagua/js/Spanish.json'
                    },
                    fnRowCallback: function (fila, item, idx) {
                        //idx tiene el indice de cada fila
                        fila = $(fila);

                        var btn = $('<button>').text('Asignar').attr('data-id', item.idsuscripcion);
                        //var txt = $('<input>');
                        //fila.find('td:last').html('').append(txt).append(btn);
                        fila.find('td:last').html('').append(btn);
                        btn.on('click', function () {
                            that.onAsignar(item, $(this), idx);
                        });
                    },
                    destroy: true
                });
            },
            onQuitar: function (item, _this, idx) {
                var indiceParaQuitar = that.obtenerIndicePorId(item.idsuscripcion, rutasModel.informacionRutasAsignadas);
                rutasModel.informacionRutasSin.push(
                        rutasModel.informacionRutasAsignadas.splice(indiceParaQuitar, 1)[0]
                        );

                that.mostrarResultadoRutaSin({rutas: rutasModel.informacionRutasSin});
                that.mostrarResultadoRutaAsi({rutas: rutasModel.informacionRutasAsignadas});
            },
            obtenerIndicePorId: function (id, ar) {
                for (var i = 0; i < ar.length; i++) {
                    if (ar[i].idsuscripcion == id) {
                        return i;
                    }
                }
            },
            onAsignar: function (item, _this, idx) {
                var idSeleccionado = $('#tblRutasAsi tbody tr td input[type="radio"]:checked').attr('data-id');
                var indiceParaInsertar = that.obtenerIndicePorId(idSeleccionado, rutasModel.informacionRutasAsignadas);
                var indiceRemover = that.obtenerIndicePorId(item.idsuscripcion, rutasModel.informacionRutasSin);
                rutasModel.informacionRutasSin[indiceRemover].rusu_rutsecuen = null;
                rutasModel.informacionRutasAsignadas.splice(
                        indiceParaInsertar,
                        0,
                        rutasModel.informacionRutasSin.splice(indiceRemover, 1)[0]
                        );

                that.mostrarResultadoRutaSin({rutas: rutasModel.informacionRutasSin});
                that.mostrarResultadoRutaAsi({rutas: rutasModel.informacionRutasAsignadas});
            },
            onTrasladar: function (item, _this, idx) {
                __dom.ocultarCargador();

                rutasModel.informacionTrasladaRutas = [];
                var divRutas = $('div#Rutas');
                var divTraslada = $("div#trasladarSuscripciones");
                var pMensaje = divTraslada.find('p');

                var idRutaAnt = divRutas.find('#cboRutas');
                var idRuta = divRutas.find('#cboRutas').clone().attr("id", "ArmacboRuta");

                divTraslada.find('#ArmcboRutas').html('').append(idRuta);
                divTraslada.find('#ArmacboRuta option[value=' + idRutaAnt.val() + ']').remove();



                var itempos = $('#tblRutasAsi tbody tr td input[type="radio"]:checked').attr('data-id');
                var pos = that.obtenerIndicePorId(itempos, rutasModel.informacionRutasAsignadas);
                rutasModel.postra = pos;

                rutasModel.informacionTrasladaRutas.push(
                        rutasModel.informacionRutasAsignadas[pos]
                        );
                pMensaje.text('');
                that.dialogoActual = divTraslada.dialogo({
                    modal: true,
                    width: 850,
                    title: 'Trasladar Suscripciones',
                    buttons: {
                        Trasladar: that.eventotrasladarRuta


                    }
                });
                that.configurarTablaTraslada();
            },
            eventotrasladarRuta: function ()
            {
                __dom.ocultarCargador();

                var divTraslada = $('div#trasladarSuscripciones');
                var pMensaje = divTraslada.find('p');
                var idRuta = divTraslada.find('#ArmacboRuta');
                var registro = rutasModel.informacionTrasladaRutas[0];

                var datos = {};
                datos.idSuscripcion = registro['idsuscripcion'];
                datos.ideRuta = rutasModel.ideRuta;
                datos.idRuta = idRuta.val();
                datos.idSecuencia = 0;

                rutasControl.grabarTrasladaRutas(datos, function (respuesta) {
                    __dom.ocultarCargador();

                    if (respuesta.rutas != -2)
                    {
                        rutasModel.informacionRutasAsignadas.splice(rutasModel.postra, 1)[0]
                        that.mostrarResultadoRutaAsi({rutas: rutasModel.informacionRutasAsignadas});
                        that.dialogoActual.dialog('close');
                    }
                    else {
                        pMensaje.text('No se Pudo realizar la Transacción, El Mes del Periodo Activo No coincide');
                        that.dialogoActual = divTraslada.dialogo({
                            modal: true,
                            width: 850,
                            title: 'Trasladar Suscripciones',
                        });
                    }
                });

            },
            mostrarResultadoRutaAsi: function (data) {
                __dom.ocultarCargador();

                rutasModel.informacionRutasAsignadas = data.rutas;

                var divRutasAsi = $('div#RutasAsi');
                var tbl = divRutasAsi.find('#tblRutasAsi');

                tbl.dataTable({
                    data: rutasModel.informacionRutasAsignadas,
                    columns: [
                        {title: '', data: null},
                        {title: 'Secuencia.', data: 'rusu_rutsecuen'},
                        {title: 'Suscrip', data: 'idsuscripcion'},
                        {title: 'Código', data: 'pcodigo'},
                        {title: 'Nombre Tercero', data: 'tercero'},
                        {title: 'N° Medidor', data: 'idpropiedad'},
                        {title: 'Dirección', data: 'direccion'},
                        {title: 'Barrio', data: 'barrio'},
                        {title: 'Municipio', data: 'municipio'},
                        {title: '', data: null}

                    ],
                    fnRowCallback: function (fila, item, idx, idxFull) {
                        //idx tiene el indice de cada fila

                        fila = $(fila);
                        var btnq = $('<button>').text('Quitar').attr('data-id', item.idsuscripcion);
                        var btnt = $('<button>').text('Trasladar').attr('data-id', idx);
                        var btn = $('<input>').text('').attr({type: 'radio', name: 'btnsel', 'data-id': item.idsuscripcion});
                        fila.find('td:last').html('').append(btn);
//                        fila.find('td:eq(1)').html(idxFull);
                        fila.find('td:first').html('').append(btnq).append(btnt);

                        btnq.on('click', function () {
                            that.onQuitar(item, $(this));
                        });

                        btnt.on('click', function () {
                            that.onTrasladar(item, $(this), 2);
                        });
                    },
                    language: {
                        url: '/achagua/js/Spanish.json'
                    },
                    bSort: false,
                    destroy: true
                });

            },
            eventoNuevo: function () {
                __dom.ocultarCargador();

                var divSuscripcion = $("div#Suscripcion");

                that.dialogoActual = divSuscripcion.dialogo({
                    modal: true,
                    width: 850,
                    title: 'Buscar Suscripciones',
                    buttons: {
                        Consultar: that.eventobuscarSuscripcion
                    }
                });
            },
            eventobuscarSuscripcion: function ()
            {
                __dom.ocultarCargador();
                var divSuscriptores = $('div#Suscripcion');
                var divSuscriptores2 = $('div#Rutas');
                var pMensaje = divSuscriptores.find('p');
                var idSuscripcion = divSuscriptores.find('#txtideSuscripcion');
                var idPropiedad = divSuscriptores.find('#txtidePropiedad');
                var idTercero = divSuscriptores.find('#txtideTercero');
                var idRuta = divSuscriptores2.find('#cboRutas');
                var idTipoSus = Array();

                var campos = $('div#Rutas input[type=checkbox]:checked');
                //var idTercero = rutasModel.idTercero;
                if (campos.length === 0) {
                    pMensaje.text('Debe seleccionar al menos un tipo de suscripción');
                    return;
                }
                var valores = "";
                $.each(campos, function (i, item) {
                    valores += "" + $(item).val();
                    if (i < campos.length - 1) {
                        valores += ",";
                    }
                });

                if ($.trim(idSuscripcion.val()) === "" && $.trim(idPropiedad.val()) === "" && $.trim(idTercero.val()) === "") {
                    pMensaje.text('Debe diligenciar al menos un campo');
                    return;
                }
                var datos = {};
                datos.idSuscripcion = idSuscripcion.val();
                datos.idPropiedad = idPropiedad.val();
                datos.idTercero = rutasModel.idTercero;//idTercero.val();
                datos.idRuta = idRuta.val();
                datos.idTipoSus = valores;

                rutasControl.consultarSuscriptores(datos, that.mostrarResultadoSuscriptores);


            },
            mostrarResultadoSuscriptores: function (data) {
                __dom.ocultarCargador();
                rutasModel.informacionSuscriptores = [];
                var divSuscriptores = $('div#Suscripcion');
                var pMensaje = divSuscriptores.find('p');
                pMensaje.text('');
                $.each(data.suscripciones, function (i, item) {
                    var suscriptores = {};

                    suscriptores.idsuscripcion = item.idsuscripcion;
                    suscriptores.pcodigo = item.pcodigo;
                    suscriptores.tercero = item.tercero;
                    suscriptores.tipopropiedad = item.tipopropiedad;
                    suscriptores.idpropiedad = item.idpropiedad;
                    suscriptores.direccion = item.direccion;
                    suscriptores.municipio = item.municipio;
                    suscriptores.barrio = item.barrio;

                    rutasModel.informacionSuscriptores.push(suscriptores);


                });

                if (parseInt(data.codigoRespuesta) === 0) {
                    pMensaje.text('No Hay Información con estos parámetros');
                }
                that.configurarTablaSuscriptores();

                divSuscriptores.find('input[type=text]').val('');

            },
            configurarAutoComplete: function () {
                // Autocompletado de Terceros
                __dom.configurarAutocomplete(
                        'input#txtideTercero', that.sourceAutocompleteTercero,
                        function (event, ui) {
                            $('input#txtideTercero').val(ui.item ? ui.item.value : '');
                            rutasModel.idTercero = ui.item.idVal;
                        },
                        function () {
                            rutasModel.idTercero = undefined;
                        }
                );
                __dom.configurarAutocomplete(
                        'input#txtFiltroideTercero',
                        that.sourceAutocompleteTercero,
                        function (event, ui) {
                            $('input#txtFiltroideTercero').val(ui.item ? ui.item.value : '');
                            rutasModel.idTercero = ui.item.idVal;
                        },
                        function () {
                            rutasModel.idTercero = undefined;
                        }
                );

            },
            sourceAutocompleteTercero: function (request, response) {
                that.request = request;
                that.response = response;
                var datos = {};
                datos.nombre = request.term;
                rutasControl.consultarTerceros(datos, that.mostrarTerceros);

            },
            mostrarTerceros: function (data) {
                __dom.ocultarCargador();
                var result = [];
                if (data.codigoRespuesta === 1) {
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
            configurarTablaSuscriptores: function () {

                var tablaSuscriptor = fillTable(
                        "tblSuscriptores", // El id del elemento HTML que se llenara
                        "rutasModel.formatoTablaSuscriptores", // El nombre de la variable que contiene el formato de la tabla
                        "rutasModel.informacionSuscriptores", // El nombre de la variable que contiene los datos para llenar la tabla
                        "Lista de Suscripciones"              // El titulo que se mostrara en la tabla
                        );

                //para agregar funcionalidad al check
                tablaSuscriptor.find('tbody tr').on('click', that.eventoClickenSuscriptores);


            },
            configurarTablaTraslada: function () {
                $('#tblTrasladaSuscripcion').html('');
                var tablaTrasladar = fillTable(
                        "tblTrasladaSuscripcion", // El id del elemento HTML que se llenara
                        "rutasModel.formatoTablaSuscriptores", // El nombre de la variable que contiene el formato de la tabla
                        "rutasModel.informacionTrasladaRutas", // El nombre de la variable que contiene los datos para llenar la tabla
                        ""              // El titulo que se mostrara en la tabla
                        );


            },
            configurarTablaRutasSin: function () {
                $('#tblRutasSA').html('');
                var tablaRutaSin = fillTable(
                        "tblRutasSA", // El id del elemento HTML que se llenara
                        "rutasModel.formatoTablaRutasSin", // El nombre de la variable que contiene el formato de la tabla
                        "rutasModel.informacionRutasSin", // El nombre de la variable que contiene los datos para llenar la tabla
                        ""              // El titulo que se mostrara en la tabla
                        );

                //para agregar funcionalidad al check
                tablaRutaSin.find('tbody tr').on('click', that.eventoClickenRutas);


            },
            eventoClickenSuscriptores: function () {
                __dom.ocultarCargador();
                var divSuscriptor = $('div#Rutas');
                var idRuta = divSuscriptor.find('#cboRutas');

                var divRutasSin = $('div#RutasSin');
                var pos = $(this).attr('data-fila');
                var rutanueva = {};
                rutasModel.posi = pos;
                var ruta = rutasModel.informacionSuscriptores[pos];
                rutanueva.idRuta = idRuta.val();
                rutanueva.idSuscripcion = ruta.idsuscripcion;
                rutanueva.idSecuencia = 0;
                //console.log('--'+rutanueva.idRuta+'--');
                rutasControl.grabarRutaSin(rutanueva, function (respuesta) {
                    __dom.ocultarCargador();
                    if (respuesta.codigoRespuesta === 1) {
                        rutasModel.informacionRutasAsignadas.splice(
                                0,
                                0,
                                rutasModel.informacionSuscriptores.splice(pos, 1)[0]
                                );
                        that.mostrarResultadoSuscriptores({suscripciones: rutasModel.informacionSuscriptores});
                    }

                });
            },
            confirmarGrabar: function ()
            {
                __dom.lanzarAlerta("Confirma que desea continuar con la Transacción", " Respuesta", that.eventoGrabar);
            },
            eventoGrabar: function ()
            {
                var datos = rutasModel.informacionRutasSin;
                var registros = {};
                registros.datos = datos;
                registros.rutas = rutasModel.ideRuta;
                rutasControl.grabarBDRutasSin(registros, that.resultadoGrabarRutasSin);

            },
            recargar: function () {
                that.mostrarTablaRutas();
            },
            resultadoGrabarRutasSin: function (Data) {
                var registros = {};
                var datos = rutasModel.informacionRutasAsignadas;
                registros.datos = datos;
                registros.rutas = rutasModel.ideRuta;
                rutasControl.grabarBDRutasAsi(registros, that.resultadoGrabarRutasAsi);
            },
            resultadoGrabarRutasAsi: function (Data) {
                __dom.lanzarAlerta(Data.mensaje, " Respuesta", that.recargar);
            },
            
            confirmaActualizacionMasiva: function (){
                that.dialogoActual = $('#divConfirmaActualizar').dialogo({
                resizable: false,
                heigth: 140,
                modal: true,
                title: 'Continuar con la Actualización Masiva',
                buttons: {
                    Continuar: function () {
                                               
                        that.dialogoActual.dialog('close');
                        that.actualizarConsecutivoRutas();
                        
                        
                    },
                    Cancelar: function () {
                        that.dialogoActual.dialog('close');
                    }
                }
            });
            },
             
             actualizarConsecutivoRutas:function (){
                var idRuta = $('select#cboRutas').val();
                var data = {
                    idruta: idRuta
                };
                 rutasControl.actualizaConsecutivoRuta(data, that.resultadoActualizarRuta);
             },
             
             resultadoActualizarRuta:function (data){
                 switch (data.codigoRespuesta){
                     case 1 :
                        __dom.lanzarAlerta("Se Actualizo la información", "Atencion");
                         break;
                     case -1 :
                        __dom.lanzarAlerta("No se pudo realizar la Acualizacion", null);
                 }
                 
             }
        };

rutasVista.init();