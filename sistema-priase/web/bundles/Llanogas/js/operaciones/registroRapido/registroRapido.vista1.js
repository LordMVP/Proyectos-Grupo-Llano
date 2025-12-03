/**
 * @fileOverview Archivo de vista y control de registro rápido de reconexión y suspensión
 * @author AppFuture
 * @requires registroRapido.control.js
 * @requires registroRapido.modelo.js
 * @version 1.3.0
 * @namespace registroVista
 */
/**
 * Objeto que hace referencia al namespace registroVista
 * @type {Object}
 */
var that = null;
/** @namespace */
var registroVista = {
    SUSPENSION_EXITOSA: 311, //código de la novedad de suspensión exitosa al momento de desarrollar se llama Suspensión Ejecutada - Cobrar con código 311
    RECONEXION_EXITOSA: 93, //código de la novedad de reconexión exitosa al momento de desarrollar se llama Reconexión Ejecutada - Cobrar con código 93

    /** Inicializa el programa de registro rápido, y asigna listeners a los controles
     * @returns {void}
     */
    init: function () {
        that = registroVista;
        // eventos click de botones
        that.consultarListas();
        that.configurarAutoComplete();
        $("#btnBuscar").attr("disabled", "disabled")
                .on("click", that.buscarTabla);
//        var fechaactual = new Date($('#txtFechaActual').val());
        var fechaactualSuspension = new Date($('#txtFechaactualSuspension').val());
        var fechaactualReconexion = new Date($('#txtFechaactualReconexion').val());
        fechaactualSuspension.setDate(fechaactualSuspension.getDate() + 1);
        fechaactualReconexion.setDate(fechaactualReconexion.getDate() + 1);
        $("input[name='radFiltrar']").on("change", that.cambiarBuscar);
        $('.btnLimpiarRealizado').on('click', that.limpiarRelizado);
        $("#btnGuardarSus").on("click", function () {
            that.armarObjetoEnviar('suspensiones')
        });
        $("#btnGuardarRec").on("click", function () {
            that.armarObjetoEnviar('reconexiones')
        });
        $("#btnAplicarSuspension").on("click", function () {
            that.aplicarCampos('Suspension');
        });
        $("#btnAplicarReconexion").on("click", function () {
            that.aplicarCampos('Reconexion');
        });
        __dom.configurarCalendario('txtFechaProgramacion, #txtFechaEjecucionSuspension, #txtFechaEjecucionReconexion');
        __dom.configurarColapsable('.divContenedorColapsable');
        $('#txtFechaEjecucionSuspension').datepicker('option', 'minDate', fechaactualSuspension).val('');
        $('#txtFechaEjecucionReconexion').datepicker('option', 'minDate', fechaactualReconexion).val('');
        $('#divSuspension a, #divReconexion a').on('click', that.mostrarOcultarColumna);
        //$(window).on('resize', that.onVentanaResize);
    },
    /**
     * Limpia la selección del radio button de la cabecera de realizado
     */
    limpiarRelizado: function () {
        $('[name="radSusRealizado"]').prop('checked', false);
    },
    /**
     * Agrega los valores de cada fila en la información de apptable
     * @param {Object} item - Información de la fila puede ser detalle de suspensión o reconexión
     */
    agregarAtControlFila: function (item) {
        if (item.valores) {
            var idfila = item.at_id;
            var valores = item.valores;

            item.at_controls['__span_fecha__' + idfila] = valores.fecha;
            item.at_controls['__checkbox_realizada__' + idfila] = valores.realizada;
            item.at_controls['__input_tercero__' + idfila] = valores.tercero;
            item.at_controls['__hide_idtercero__' + idfila] = valores.idtercero;
            item.at_controls['__select_idnovedad__' + idfila] = valores.idnovedad;
            item.at_controls['__input_observacion__' + idfila] = valores.observacion;
            item.at_controls['__select_idtiposuspension__' + idfila] = valores.idtiposuspension;

            delete item.valores;
        }
    },
    /**
     * Configura los controles de las filas de las tablas dispuestaas para suspensiones o reconexiones
     * @param {Object} item - Información cargada en la fila que se está configurando
     * @param {jQuery} fila - Fila del DOM de la que se configuran los controles
     */
    onFilaSuspensionReconexionCompleta: function (item, fila) {
        var id = item.at_id;
        that.agregarAtControlFila(item);
        var horaActual = item.at_controls['__input_hora__' + item.at_id];
        var observacionActual = item.at_controls ? item.at_controls['__input_observacion__' + item.at_id] : (valores ? valores.observacion : null);
        item.cambios = {
            'lectura': (item.lectura),
            'observacion': item.cambios ? item.cambios.observacion : false, //(observacionActual !== '' && item.at_controls),
            'novedad': item.cambios ? item.cambios.novedad : false, //(item.idnovedad && item.idnovedad !== '0' && item.at_controls),
            'hora': (horaActual !== '__:__' && horaActual !== '' && horaActual !== '00:00')
        };
        //configuracion de la lectura
        var txtLectura = fila.find('td[headers="thLectura"] input');
        __dom.configurarTextoNumerico(txtLectura, false, false, false);
        txtLectura.on('blur', function () {
            if ($(this).val() !== '') {
                var valorLectura = $(this).val();
                item.cambios.lectura = true;
                that.validarSuspensionReconexionExitosa(fila);
                item.at_controls['__input_lectura__' + id] = valorLectura;
                item.lectura = valorLectura
            } else {
                item.cambios.lectura = false;
            }
        });

        //configuración de la hora de ejecución
        that.configurarHoraEjecucion(item, fila);

        //configuración del combo de realizada
        var cmbRealizada = fila.find('td[headers="thRealizada"] select').val(item.realizada === true ? 'S' : 'N');
        cmbRealizada.on('change', function () {
            var cmb = $(this);
            var item = that.apptable.getObjectById(id);
            if (cmb.val() === 'N') { //si realizada es igual a N, la novedad no puede ser la 311: Suspensión exitosa
                fila.find('td[headers="thNovedad"] select option[value="' + that.SUSPENSION_EXITOSA + '"]')
                        .attr('disabled', 'disabled')
                        .siblings('option:first').prop('selected', 'selected').change();
                item.realizada = false;
            } else {
                var opt = fila.find('td[headers="thNovedad"] select option[value="' + that.SUSPENSION_EXITOSA + '"]').removeAttr('disabled').parent().val(that.SUSPENSION_EXITOSA).change();
                that.validarSuspensionReconexionExitosa(fila);
                item.realizada = true;
            }
        });

        //configuracion del combo de novedades
        fila.find('td[headers="thNovedad"] select').on('change', function () {
            var item = that.apptable.getObjectById(fila.attr('id'));
            if ($(this).val() !== '0') {
                item.cambios.novedad = true;
                item.idnovedad = $(this).val();
            } else {
                item.cambios.novedad = false;
            }
        });

        //configuracion de las observaciones
        fila.find('td[headers="thObsevaciones"] input').on('blur', function () {
            var item = that.apptable.getObjectById(fila.attr('id'));
            if ($(this).val().trim() !== '') {
                item.cambios.observacion = true;
            } else {
                item.cambios.observacion = false;
            }
        });
    },
    /**
     * Configura el control de hora para las filas teniendo en cuenta la máscara o posibles valores
     * @param item
     * @param fila
     */
    configurarHoraEjecucion: function (item, fila) {
        //configuración de la fecha de ejecución
        var tdFechaEjecucion = fila.find('td[headers="thFechaEjecucion"]');
        var txtFechaEjecucion = tdFechaEjecucion.find('input');
        txtFechaEjecucion.mask('99:99').addClass('txtFechaRequerido');

        if (!item.at_controls['__input_hora__' + item.at_id]) {
            item.at_controls['__input_hora__' + item.at_id] = '00:00';
            txtFechaEjecucion.val('00:00');
        }

        txtFechaEjecucion.on('blur', function () {
            //<editor-fold desc="Cuando sale de la caja de texto se valida el texto ingresado y de no ser válido se asigna un valor válido" defaultstate="collapse">
            var _this = $(this);
            var txtHora = _this.val();
            
            if (!_this.attr('data-valor')) {
                var valor = _this.val();
                valor = valor.split(':');
                valor = (isNaN(parseInt(valor[0])) ? '' : parseInt(valor[0])) + ':' + (isNaN(parseInt(valor[1])) ? '' : parseInt(valor[1]));
                valor = valor.endsWith(':') ? valor.substring(0, valor.length - 1) : valor;
                _this.attr('data-valor', valor);
            }
            
            if (_this.attr('data-valor').length === 1 || _this.attr('data-valor').length === 2) {
                txtHora = parseInt(_this.attr('data-valor'));
                txtHora = (txtHora < 10 ? '0' + txtHora : txtHora) + ':00';
            }

            if (txtHora === '__:__' || txtHora === '' || txtHora === '00:00') {
                item.at_controls['__input_hora__' + item.at_id] = '00:00';
                item.cambios.hora = false;
                _this.val('00:00');
                return;
            }


            var tiempos = txtHora.split(':');
            if (parseInt(tiempos[0]) > 23) {
                tiempos[0] = 23;
            }
            if (parseInt(tiempos[1]) > 59) {
                tiempos[1] = 59;
            }

            var hora = tiempos[0] + ':' + tiempos[1];
            _this.val(hora);
            item.cambios.hora = true;
            that.validarSuspensionReconexionExitosa(fila);
            item.at_controls['__input_hora__' + item.at_id] = hora;
            //</editor-fold>
        });

        txtFechaEjecucion.on('keypress', function () {
            var valor = $(this).val();
            valor = valor.split(':');
            valor = (isNaN(parseInt(valor[0])) ? '' : parseInt(valor[0])) + ':' + (isNaN(parseInt(valor[1])) ? '' : parseInt(valor[1]));
            valor = valor.endsWith(':') ? valor.substring(0, valor.length - 1) : valor;
            $(this).attr('data-valor', valor);
        });
        tdFechaEjecucion.on('focus', function () {
            $(this).find('input')[0].focus();
        });
    },
    /**
     * Valida que si la suspensión cumple que no tiene hora, ni novedad pero si lectura entonces ayuda al poner que
     * está realizada con novedad de éxito
     * @param fila
     */
    validarSuspensionReconexionExitosa: function (fila) {
        var txtFechaEjecucion = fila.find('td[headers="thFechaEjecucion"] input');
        var txtLectura = fila.find('td[headers="thLectura"] input');

        var cmbRealizada = fila.find('td[headers="thRealizada"] select');
        var cmbNovedad = fila.find('td[headers="thNovedad"] select');

        var hora = txtFechaEjecucion.val().trim();
        var lectura = txtLectura.val().trim();
        var item = that.apptable.getObjectById(fila.attr('id'))

        if (hora !== '00:00' && hora !== '__:__' && lectura !== '' && cmbNovedad.val() === '0') {
            var codigoExitoso = $("input[name='radFiltrar']:checked").attr("data-val") === 'S' ? that.SUSPENSION_EXITOSA : that.RECONEXION_EXITOSA;
            cmbRealizada.val('S');
            cmbNovedad.val(codigoExitoso);
            item.cambios.novedad = true;
            item.idnovedad = codigoExitoso;
            item.realizada = true;
            item.at_controls['__select_idnovedad__' + item.at_id] = codigoExitoso;
            item.at_controls['__select_realizada__' + item.at_id] = 'S';
        }
    },
    /** Hace petición ajax para consultar novedades y tipo de suspensión 
     * @returns {void}
     **/
    consultarListas: function () {
        registroControl.consultarNovedadesSusLista(function (data) {
            var opcionNula = {id: 0, nombre: 'Seleccione una opción'};

            for (var i in data.datos) {
                data.datos[i].nombre = data.datos[i].id + ' - ' + data.datos[i].nombre;
            }

            data.datos.splice(0, 0, opcionNula);
            registroModelo.novedadesSusLista = data.datos;
        });

        registroControl.consultarNovedadesRecLista(function (data) {
            var opcionNula = {id: 0, nombre: 'Seleccione una opción'};

            for (var i in data.datos) {
                data.datos[i].nombre = data.datos[i].id + ' - ' + data.datos[i].nombre;
            }

            data.datos.splice(0, 0, opcionNula);
            registroModelo.novedadesRecLista = data.datos;
        });

        registroControl.consultarTipoSuspensionLista(function (data) {
            var opcionNula = {idtiposuspension: 0, tiposuspension: 'Seleccione una opción'};

            for (var i in data.datos) {
                data.datos[i].nombre = data.datos[i].idtiposuspension + ' - ' + data.datos[i].tiposuspension;
            }

            data.datos.splice(0, 0, opcionNula);
            registroModelo.tipoSusLista = data.datos;
        });
    },
    /** Cambia la interfaz según la operación que se vaya a realizar (reconexión o suspensión)
     * @returns {void}
     **/
    cambiarBuscar: function () {
        var accion = $("input[name='radFiltrar']:checked").attr("data-val");
        var controlSus = $("#lCmbMotivoSus, #cmbMotivoSus");
        var controlRec = $("#lCmbMotivoReconexion, #cmbMotivoReconexion");
        switch (accion) {
            case "S":
                controlSus.show();
                controlRec.hide();
                break;
            case "R":
                controlSus.hide();
                controlRec.show();
                break;
        }
        $("#btnBuscar").removeAttr("disabled");
        that.limpiarFormulario();
        $('#tabsOperaciones, #fsParametros').show();
    },
    /**
     * Muestra o visualiza objetos para el registro ya sea de reconexiones o suspensiones
     * @returns {void}
     */
    buscarTabla: function () {
        var status = $("input[name='radFiltrar']:checked").attr("data-val");
        if (status !== undefined) {
            var modulo = status === 'S' ? 'suspension' : 'reconexion';
            that.buscarTablaCompleto(modulo);
        } else {
            __dom.lanzarAlerta(__app.mensajes.seleccionarTipoOperacion, __app.mensajes.atencion);
            $('#fsParametros').hide();
        }
    },
    /** Valida la información del filtro y hace petición ajax para consultar las suspensiones 
     * @returns {void}
     **/
    buscarTablaCompleto: function (modulo) {
        var barrio = registroModelo.idBarrio;
        var tercero = registroModelo.idTercero;
        var municipio = registroModelo.idMunicipio;
        var zona = $("#cmbZona").val() !== "-1" ? $("#cmbZona").val() : null;
        var altoRiesgo = $("input[name='radAltoRiesgo']:checked").length > 0 ?
                $("input[name='radAltoRiesgo']:checked").attr("data-val") : null;
        var realizado = $("input[name='radRealizado']:checked").length > 0 ?
                $("input[name='radRealizado']:checked").attr("data-val") : null;
        var motivo = (modulo === 'suspension') ? $("#cmbMotivoSus").val() : $("#cmbMotivoReconexion").val()
        
        if (!municipio || motivo === '-1') {
            __dom.lanzarAlerta("El municipio y el motivo  son obligatorios", __app.mensajes.atencion);
            return;
        }
        if (modulo==='suspension' && ( !municipio || $("#cmbRuta").val() === "-1" || motivo === '-1' )) {
            __dom.lanzarAlerta("El municipio, el motivo y la ruta son obligatorios", __app.mensajes.atencion);
            return;
        }
        var data = {
            zona: zona,
            barrio: barrio,
            tercero: tercero,
            realizada: realizado,
            municipio: municipio,
            altoriesgo: altoRiesgo,
            ruta: $("#cmbRuta").val(),
            motivo: motivo,
            desde: $("#txtSecuenciaDesde").val(),
            hasta: $("#txtSecuenciaHasta").val(),
            fechaprogramacion: $("#txtFechaProgramacion").val()
        };
        if (modulo === 'suspension') {
            registroControl.consultarTablaSuspensiones(data, that.buscarSuspensionesTablaCompletado);
        } else {
            registroControl.consultarTablaReconexiones(data, that.buscarReconexionesTablaCompletado);
        }
    },
    /** Captura la respuesta del servidor cuando se consultan suspensiones
     * @param {object} data - Información de las suspensiones a posibles cambios
     * @returns {void}
     **/
    buscarSuspensionesTablaCompletado: function (data) {
        if (data.codigoRespuesta > 0) {
            registroModelo.suspension = data.datos;
            for (var j = 0; j < data.datos.length; j++) {
                var info = data.datos[j];
                info.realizada = info.realizada === 'S';
            }
            $('#tabsOperaciones #divSuspension').show();
            $('#tabsOperaciones #divReconexion').hide();
            that.generarTablaSuspensiones();
        } else {
            __dom.lanzarAlerta("No se encontraron suspensiones, intente nuevamente", __app.mensajes.atencion);
            $('#tabsOperaciones #divSuspension').hide();
        }
    },
    /**
     * Configura las columnas que tendrá la tabla de suspensiones y carga la información
     * @returns {void}
     **/
    generarTablaSuspensiones: function () {

        $('#spanGuardars').text('');
        //var table = $('#tblSuspension').empty();

        var columnasSuspensiones = [
            {type: 'text', text: 'Suscripción', headers: 'thSuscripcion', data: 'idsuscripcion', class: 'number td-suspension', sortType: 'number'},
            {type: 'text', text: 'Suspensión', headers: 'thSuspension', data: 'idsuspension', class: 'number td-suspension', sortType: 'number'},
            {type: 'text', text: 'Dirección', headers: 'thDireccion', data: 'direccion', class: 'td-direccion'},
            {type: 'text', text: 'Cód. Anterior', headers: 'thCodAnterior', data: 'codigoanterior', class: 'number', sortType: 'number'},
            {type: 'text', text: 'Ruta.Sec', headers: 'thSecuencuaRuta', data: 'idrutasecuencia', class: 'number td-secuencia', sortType: 'number'},
//            {type: 'text', text: 'Sec. Ruta', headers: 'thSecuencuaRuta', data: 'secuencia', class: 'number td-secuencia', sortType: 'number'},
            {type: 'text', text: 'Medidor', headers: 'thMedidor', data: 'medidor', class: 'number', sortType: 'number'},
            {type: 'text', text: 'Lectura Actual', headers: 'thLecturaActual', data: 'lecturaactual', sortable: false},
            {type: 'input', text: 'Lectura', headers: 'thLectura', data: 'lectura', class: 'controlTable', sortable: false},
            //{type:'td-function', text:'Fecha Ejecución', headers:'thFechaEjecucion', data:'fechaejecucion', tdCallback: that.configurarFechaEjecucion, sortable:false}, 
            {type: 'input', text: 'Hora Ejecución', headers: 'thFechaEjecucion', data: 'hora', sortable: false},
            //{type:'checkbox', title:'Realizada', headers:'thRealizada', text: 'Sí', sortable:false, data: 'realizada'}, //tdCallback:configurarInputRealizada},
            {type: 'select', title: 'Efectiva', headers: 'thRealizada', sortable: false, data: 'realizada', items: [{valor: 'N', texto: 'No'}, {valor: 'S', texto: 'Sí'}], itemvalue: 'valor', itemtext: 'texto', class: 'td-efectiva'},
            {type: 'select', text: 'Novedad', headers: 'thNovedad', data: 'idnovedad', items: registroModelo.novedadesSusLista, itemvalue: 'id', itemtext: 'nombre', class: 'controlTable', sortable: false, selectCallback: that.actualizarNovedad},
            {type: 'select', text: 'Tipo Suspensión', headers: 'thTipoSuspension', data: 'idtiposuspension', items: registroModelo.tipoSusLista, itemvalue: 'idtiposuspension', itemtext: 'tiposuspension', class: 'controlTable', sortable: false, selectCallback: that.actualizarTipoSuspension, 'keyUpDownDisabled': true},
            {type: 'td-function', text: 'Tercero Ejecuta', headers: 'thTerceroEjecuta', tdCallback: that.configurarAutoCompleteTabla, sortable: false, 'keyUpDownDisabled': true},
            {type: 'input', text: 'Observaciones', headers: 'thObsevaciones', data: 'observacion', sortable: false, class: 'controlTable td-observaciones'}
        ];

        var config = {
            title: 'Suspensiones',
            pagination: true,
            cellNavigable: true,
            searchableMinLength: 1,
            columns: columnasSuspensiones,
            linesPageRange: [10, 20, 30, 50, 100],
            onRowComplete: that.onFilaSuspensionReconexionCompleta,
            lg: lenguajeTabla
        };

        if (that.apptable) {
            //that.apptable.destroy();
            if (that.apptable.selector === '#tblSuspension') {
                that.apptable.fillTable(registroModelo.suspension);
                return;
            }
        }
        that.apptable = new Apptable('#tblSuspension', config, registroModelo.suspension);
    },
    /**
     * Actualiza la novedad en la información del apptable
     * @param {Event} e - Evento que dispara a la función
     */
    actualizarNovedad: function (e) {
        var cmb = $(this);
        var id = cmb.parent().parent().attr('id');
        that.apptable.getObjectById(id).idnovedad = cmb.val();
    },
    /**
     * Actualiza el tipo de suspensión en la información del apptable
     * @param {Event} e - Evento que dispara la función
     */
    actualizarTipoSuspension: function (e) {
        var cmb = $(this);
        var id = cmb.parent().parent().attr('id');
        that.apptable.getObjectById(id).idtiposuspension = cmb.val();
    },
    /** Captura la respuesta del servidor cuando se consultan reconexiones
     * @param {object} data - Información de las reconexiones para posibles registros
     * @returns {void}
     **/
    buscarReconexionesTablaCompletado: function (data) {
        if (data.codigoRespuesta > 0) {
            for (var i = 0; i < data.datos.length; i++) {
                var fila = data.datos[i];
                fila.realizada = fila.realizada === 'S';
            }
            registroModelo.reconexion = data.datos;
            $('#tabsOperaciones #divSuspension').hide();
            $('#tabsOperaciones #divReconexion').show();

            that.generarTablaReconexiones();
        } else {
            __dom.lanzarAlerta("No se encontraron reconexiones, intente nuevamente", __app.mensajes.atencion);
            $('#tabsOperaciones #divReconexion').hide();
        }
    },
    /**
     * Configura las columnas que tendrá la tabla de reconexiones y carga la información
     * @returns {void}
     **/
    generarTablaReconexiones: function () {
        $('#spanGuardarr').text('');
        var table = $('#tblSuspension').empty();
        var columnasSuspensiones = [
            {type: 'text', text: 'Suscripción', headers: 'thSuscripcion', data: 'idsuscripcion', class: 'number td-suspension', sortType: 'number'},
            {type: 'text', text: 'Reconexión', headers: 'thReconexion', data: 'idreconexion', class: 'number td-suspension', sortType: 'number'},
            {type: 'text', text: 'Dirección', headers: 'thDireccion', data: 'direccion', class: 'td-direccion'},
            {type: 'text', text: 'Cód. Anterior', headers: 'thCodAnterior', data: 'codigoanterior', class: 'number', sortType: 'number'},
            {type: 'text', text: 'Ruta.Sec', headers: 'thRuta', data: 'idrutasecuencia', class: 'number td-secuencia', sortType: 'string'},
//            {type: 'text', text: 'Sec. Ruta', headers: 'thSecuencuaRuta', data: 'secuencia', class: 'number td-secuencia', sortType: 'number'},
            {type: 'text', text: 'Medidor', headers: 'thMedidor', data: 'medidor', class: 'number', sortType: 'number'},
            {type: 'text', text: 'Lectura Actual', headers: 'thLecturaActual', data: 'lecturaactual', sortable: false},
            {type: 'input', text: 'Lectura', headers: 'thLectura', data: 'lectura', class: 'controlTable', sortable: false},
            //{type:'td-function', text:'Fecha Ejecución', headers:'thFechaEjecucion', data:'fechaejecucion', tdCallback: that.configurarFechaEjecucion, sortable:false}, 
            {type: 'input', text: 'Hora Ejecución', headers: 'thFechaEjecucion', data: 'hora', sortable: false},
            //{type:'checkbox', title:'Realizada', headers:'thRealizada', text: 'Sí', sortable:false, data: 'realizada'}, //tdCallback:configurarInputRealizada},
            {type: 'select', title: 'Efectiva', headers: 'thRealizada', sortable: false, data: 'realizada', items: [{valor: 'N', texto: 'No'}, {valor: 'S', texto: 'Sí'}], itemvalue: 'valor', itemtext: 'texto', class: 'td-efectiva'},
            {type: 'select', text: 'Novedad', headers: 'thNovedad', data: 'idnovedad', items: registroModelo.novedadesRecLista, itemvalue: 'id', itemtext: 'nombre', class: 'controlTable', sortable: false, selectCallback: that.actualizarNovedad},
            {type: 'td-function', text: 'Tercero Ejecuta', headers: 'thTerceroEjecuta', tdCallback: that.configurarAutoCompleteTabla, sortable: false, 'keyUpDownDisabled': true},
            {type: 'input', text: 'Observaciones', headers: 'thObsevaciones', data: 'observacion', sortable: false, class: 'controlTable '}
        ];
        var config = {
            title: 'Reconexiones ',
            pagination: true,
            cellNavigable: true,
            searchableMinLength: 1,
            columns: columnasSuspensiones,
            linesPageRange: [10, 20, 30, 50, 100],
            onRowComplete: that.onFilaSuspensionReconexionCompleta,
            lg: lenguajeTabla
        }   ;

        if (that.apptable) {
            //that.apptable.destroy();
            if (that.apptable.selector === '#tblReconexion') {
                that.apptable.fillTable(registroModelo.reconexion);
                return;
            }
        }
        that.apptable = new Apptable('#tblReconexion', config, registroModelo.reconexion);
    },
    /**
     * Configura las cajas de texto que están dentro de la tabla para que tengan la funcionalidad de autocomplete
     * @param {undefined} value - No llega porque la configuración de las tablas no definen data
     * @param {Object} item - Información completa de la fila que se está cargando
     * @param {Object} col - Información de la configuración de la fila
     * @param {jQuery} td - Elemento del DOM donde se cargaría la información
     */
    configurarAutoCompleteTabla: function (value, item, col, td) {
        if (!item.at_controls) {
            item.at_controls = {};
        }
        //Crea input de tipo texto
        var txt = $('<input>').attr('type', 'text');
        var controlInputId = '__input_tercero__' + item.at_id;
        var controlId = '__hide_idtercero__' + item.at_id;
        var valuecontrol = item.at_controls[controlId];
        if (!valuecontrol) {
            var tercero = (item.tercero) ? item.tercero : '';
            var idtercero = (item.idtercero) ? item.idtercero : false;
            txt.val(tercero);
            txt.attr('data-id', idtercero);
            item.at_controls[controlId] = idtercero;
            item.at_controls[controlInputId] = tercero;
        } else {
            txt.attr('data-id', valuecontrol)
            txt.val(item.at_controls[controlInputId]);
        }

        //Asigna funcionalidad
        __dom.configurarAutocomplete(
                txt, that.sourceAutoCompleteTerceros,
                function (event, ui) {
                    var _this = $(event.target);
                    var id = _this.parents('tr')[0].id;
                    _this.attr('data-id', ui.item.idVal);
                    that.apptable.getObjectById(id).at_controls['__input_tercero__' + id] = ui.item.label;
                    that.apptable.getObjectById(id).at_controls['__hide_idtercero__' + id] = ui.item.idVal;
                },
                function () {
                    txt.attr('data-id', undefined);
                }
        );
        td.append(txt);
    },
    /**
     * Asigna la información que está en la cabecera de aplicación a las filas de la tabla que está cargada
     * Cuando la fila tiene at_controls quiere decir que ya ha sido visualizada y se puede guardar ahí en caso contrario será guardada en el objeto de valores
     * @param {string} modulo - Define la pestaña en la que se encuentran (suspension - reconexion)
     */
    aplicarCampos: function (modulo) {
        var actualizarTabla = false;
        var filasOcultar = [];
        var tercero = $("#txtTercero" + modulo);
        var tipoSus = $("#cmbTipo" + modulo).val();
        var novedad = $("#cmbNovedad" + modulo).val();
        var fecha = $("#txtFechaEjecucion" + modulo).val();
        if (fecha !== '') {
            fecha = fecha.split(' ')[0].replace(/\//g, '-');
        }

        var observacion = $("#txtObservacion" + modulo).val();
        var realizada = $("#div" + modulo + " input[name='radSusRealizado']:checked");
        var object = modulo.toLowerCase();

        for (var i = 0; i < registroModelo[object].length; i++) {
            var datos = registroModelo[object][i];
            var idfila = datos.at_id;
            if (!datos.at_controls && !datos.valores) {
                datos.valores = {};
            }
            if (novedad > 0) {
                datos.idnovedad = novedad;
                if (datos.at_controls) {
                    datos.at_controls['__select_idnovedad__' + idfila] = novedad;
                } else {
                    datos.valores['idnovedad'] = novedad;
                }
                actualizarTabla = true;
            }
            if (tipoSus > 0 && modulo === 'Suspension') {
                datos.idtiposuspension = tipoSus;
                if (datos.at_controls) {
                    datos.at_controls['__select_idtiposuspension__' + idfila] = tipoSus;
                } else {
                    datos.valores['idtiposuspension'] = tipoSus;
                }
                actualizarTabla = true;
            }
            if (observacion !== '') {
                datos.observacion = observacion;
                if (datos.at_controls) {
                    datos.at_controls['__input_observacion__' + idfila] = observacion;
                } else {
                    datos.valores['observacion'] = observacion;
                }
                actualizarTabla = true;
            }
            if (tercero.val() !== '') {
                datos.tercero = tercero.val();
                datos.idtercero = tercero.attr('data-id');
                if (datos.at_controls) {
                    datos.at_controls['__input_tercero__' + idfila] = tercero.val();
                    datos.at_controls['__hide_idtercero__' + idfila] = tercero.attr('data-id');
                } else {
                    datos.valores['tercero'] = tercero.val();
                    datos.valores['idtercero'] = tercero.attr('data-id');
                }
                actualizarTabla = true;
            }
            if (fecha !== '') {
                datos.fechaejecucion = fecha;
                actualizarTabla = true;
                if (datos.at_controls) {
                    datos.at_controls['__span_fecha__' + idfila] = fecha;
                } else {
                    datos.valores['fecha'] = fecha;
                }
            }
            if (realizada.length > 0) {
                var boolRealizada = (realizada.attr('data-val') === 'S');
                datos.realizada = boolRealizada;
                if (datos.at_controls) {
                    datos.at_controls['__checkbox_realizada__' + idfila] = boolRealizada;
                } else {
                    datos.valores['realizada'] = boolRealizada;
                }
                actualizarTabla = true;
            }
        }
        if (actualizarTabla) {
            that.apptable.fillTable(registroModelo[object]);
        }
    },
    /** Se hace la configuración de las cajas de texto para funcionalidad de autocomplete
     * @returns {void}
     **/
    configurarAutoComplete: function () {

        __dom.configurarAutocomplete(
                'input#txtMunicipio, input#row1age',
                that.sourceAutoCompleteMunicipios,
                function (event, ui) {
                    registroModelo.idMunicipio = ui.item.idVal;
                    $('input#txtBarrio').removeAttr('disabled');
                },
                function () {
                    registroModelo.idMunicipio = undefined;
                }
        );

        __dom.configurarAutocomplete(
                'input#txtBarrio',
                that.sourceAutoCompleteBarrios,
                function (event, ui) {
                    registroModelo.idBarrio = ui.item.idVal;
                },
                function () {
                    registroModelo.idBarrio = undefined;
                }
        );
        __dom.configurarAutocomplete(
                'input#txtTerceroRealiza',
                that.sourceAutoCompleteTerceros,
                function (event, ui) {
                    registroModelo.idTercero = ui.item.idVal;
                },
                function () {
                    registroModelo.idTercero = undefined;
                }
        );

        __dom.configurarAutocomplete(
                '#txtTerceroSuspension, #txtTerceroReconexion',
                that.sourceAutoCompleteTerceros,
                function (event, ui) {
                    $(event.target).attr("data-id", ui.item.idVal);
                },
                function (txt) {
                    $(txt).removeAttr('data-id');
                }
        );
    },
    /** Realiza la petición AJAX para consultar los municipios del filtro
     * @param {object} request - Información de la petición
     * @param {object} response - Información de la respuesta
     * @returns {void}
     */
    sourceAutoCompleteMunicipios: function (request, response) {
        that.request = request;
        that.response = response;
        var datos = {};
        datos.municipio = request.term.trim();
        registroControl.consultarMunicipios(datos, that.mostrarResultadoMunicipios);
    },
    /** Muestra el resultado de la consulta de los municipios en la lista desplegable.
     * @param {object} data - Arreglo de municipios
     * @returns {void}
     */
    mostrarResultadoMunicipios: function (data) {
        __dom.ocultarCargador();
        switch (data.codigoRespuesta) {
            case 1:
                var result = [];
                $.each(data.datos, function (i, item) {
                    result.push({
                        label: item.municipio,
                        value: item.municipio,
                        idVal: item.idmunicipio
                    });
                });
                that.response(result);
                break;
        }
    },
    /** Realiza la petición AJAX para consultar los barrios del filtro
     * @param {object} request - Información de la petición
     * @param {object} response - Información de la respuesta
     * @returns {void}
     */
    sourceAutoCompleteBarrios: function (request, response) {
        that.request = request;
        that.response = response;
        var barrio = $("#txtBarrio");
        var municipios = registroModelo.idMunicipio;
        if (municipios) {
            var data = {
                "barrio": barrio.val(),
                "municipios": municipios
            };
            registroControl.consultarBarrios(data, that.onConsultarBarriosCompleto);
        } else {
            barrio.attr('disabled', 'disabled');
        }
    },
    /**
     *  Captura la respuesta enviada por el servidor, sí llega 
     *  información de barrios los muestra en un combo
     * @param  {object} data - El resultado de la petición ajax para mostrar barrios
     * @returns {void}
     */
    onConsultarBarriosCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 1:
                var result = [];
                $.each(data.datos, function (i, item) {
                    result.push({
                        label: item.barrio,
                        value: item.barrio,
                        idVal: item.idbarrio
                    });
                });
                that.response(result);
                break;
        }
    },
    /** Realiza la petición AJAX para consultar los terceros que puede ejecutar (firmas instaladoras)
     * @param {object} request - Información de la petición
     * @param {object} response - Información de la respuesta
     * @returns {void}
     */
    sourceAutoCompleteTerceros: function (request, response) {
        that.request = request;
        that.response = response;
        var datos = {};
        datos.nombre = request.term.trim();
        registroControl.consultarTerceros(datos, that.mostrarResultadoTerceros);
    },
    /** Muestra el resultado de la consulta de los terceros en la lista desplegable.
     * @param {object} data - Arreglo de terceros (firmas instaladoras)
     * @returns {void}
     */
    mostrarResultadoTerceros: function (data) {
        if (data.codigoRespuesta) {
            var result = [];
            $.each(data.datos, function (i, item) {
                result.push({
                    label: item.nombretercero,
                    value: item.nombretercero,
                    documento: item.documento,
                    idVal: item.idtercero
                });
            });
            that.response(result);
        }
    },
    /**
     * Verifica que la fila tenga cambios en la información el objeto cambios es guardado en el momento que ocurre algún cambio en alguna fila
     * @param {Object} fila - Información guardada en el apptable de la fila
     * @returns {boolean} true si hubo cambios
     */
    validarSinHayCambioEnFila: function (fila) {
        if (fila.at_controls) {
            for (var i in fila.cambios) {
                if (fila.cambios[i]) {
                    return true;
                }
            }
        }
        return false;
    },
    /**
     * Valida que las filas de las tablas cumplan con los requerimientos según las reglas de negocio teniendo sólo en cuenta las filas que sufrieron cambios
     * @param {string} modulo - Define la pestaña en la que se encuentran (suspension - reconexion)
     */
    armarObjetoEnviar: function (modulo) {
        //Se asignan variables según el modulo (Reconexion - Suspension)
        if (modulo === 'suspensiones') {
            var id = 'idsuspension';
            var funcion = registroControl.guardarSuspensiones;
        } else if (modulo === 'reconexiones') {
            var id = 'idreconexion';
            var funcion = registroControl.guardarReconexiones;
        }

        var datos = [];
        var info = that.apptable.data;
        for (var x = 0; x < info.length; x++) {

            if (!that.validarSinHayCambioEnFila(info[x])) {
                //si no se ha modificado la suspension o la reconexión, pasar al siguiente registro.
                continue;
            }
            if (modulo === 'reconexiones') {
                info[x].cambios.lectura
            }


            var mensaje = '';
            var idfila = info[x].at_id;
            var modificadas = info[x].at_controls;
            if (modificadas) {
                var realizada = info[x].realizada;
                var fecha = modificadas['__span_fecha__' + idfila];
                var hora = modificadas['__input_hora__' + idfila];
                var lectura = modificadas['__input_lectura__' + idfila];
                var observacion = modificadas['__input_observacion__' + idfila];
                var novedad = modificadas['__select_idnovedad__' + idfila];
                var tiposuspension = modificadas['__select_idtiposuspension__' + idfila];
                var idtercero = modificadas['__hide_idtercero__' + idfila];

                //if (fecha && realizada) {
                //<editor-fold desc="Valida los campos obligatorios" defaultstate="collapse">
                if (!fecha || fecha === '') {
                    mensaje += 'No se ha seleccionado una fecha de ejecución.<br />';
                }

                if (hora === '00:00' || hora === '' || hora === '__:__' || !hora) {
                    mensaje += 'No se ha seleccionado una hora de ejecución.<br />';
                }

                if (realizada && lectura === '') {
                    mensaje += 'Debe reportar una lectura para la suspensión. <br />';
                }

                if (info[x].idnovedad === '0' || info[x].idnovedad === null) {
                    mensaje += 'Debe seleccionar una novedad. <br />';
                }

                if (!realizada && ((modulo === 'suspensiones' && info[x].idnovedad == that.SUSPENSION_EXITOSA) || (modulo === 'reconexiones' && info[x].idnovedad == that.RECONEXION_EXITOSA))) {
                    var operacion = (modulo === 'suspensiones') ? 'suspensión' : 'reconexión';
                    var msg = 'La novedad seleccionada para la ' + operacion + ' no es válida. <br />';
                    mensaje += msg;
                }

                if (modulo === 'suspensiones' && (info[x].idtiposuspension === '0' || info[x].idtiposuspension === null) && realizada) {
                    mensaje += 'Debe seleccionar un tipo de suspensión.<br />';
                }

                if (idtercero === null || idtercero === '' || idtercero === undefined || idtercero === false) {
                    mensaje += 'Debe seleccionar un tercero. <br />';
                }

                if (mensaje.length > 0) {
                    var inicio = modulo === 'suspensiones'
                            ? 'Se encontraron los siguientes errores en la suscripción <b>' + info[x].idsuscripcion + '</b>, en la suspensión <b>' + info[x].idsuspension + '</b>.<br />'
                            : 'Se encontraron los siguientes errores en la suscripción <b>' + info[x].idsuscripcion + '</b>, en la reconexión <b>' + info[x].idreconexion + '</b>.<br />';
                    __dom.lanzarAlerta(inicio + mensaje, __app.mensajes.errorValidacion);
                    return;
                }
                //</editor-fold>

                var object = {
                    fechaejecucion: fecha + ' ' + hora,
                    lectura: lectura,
                    observacion: observacion,
                    idnovedad: novedad,
                    idtiposuspension: tiposuspension,
                    idtercero: idtercero,
                    realizada: realizada ? 'S' : 'N'
                };
            } else {
                var object = info[x];
                var realizada = object.realizada;
                object.realizada = realizada ? 'S' : 'N';
            }
            object[id] = info[x][id];
            datos.push(object);
        }

        if (datos.length === 0) {
            __dom.lanzarAlerta('No hay cambios para guardar', __app.mensajes.atencion);
        } else {
            var data = {};
            data[modulo] = datos;
            funcion(data, that.onGuardarCompleto);
        }
    },
    /** Captura la respuesta del servidor cuando se graba la información de las suspensiones o reconexiones 
     * @param {object} data - Respuesta del registro realizado
     * @returns {void}
     **/
    onGuardarCompleto: function (data) {
        if (data.datos > 0) {
            //$('input[name="radFiltrar"').prop('checked', false);
            var accion = that.apptable.selector === '#tblSuspension' ? 'suspensiones' : 'reconexiones';
            var fxRecargar = function () {
                that.limpiarTabla();
//                window.location.reload();
            };
            __dom.lanzarAlerta("La información de las " + accion + " han sido cargadas correctamente.", __app.mensajes.atencion, fxRecargar, null, fxRecargar);
            //that.limpiarFormulario();
            //that.buscarTabla();
        } else {
            __dom.lanzarAlerta(__app.mensajes.errorGuardarInformacion, __app.mensajes.atencion);
        }
    },
    /** Limpia toda la información del formulario y modelo
     * @returns {void}
     **/
    limpiarFormulario: function () {
        $('#tabsOperaciones input[name="radSusRealizado"]').prop('checked', false);
        $('#tabsOperaciones input:text, #tabsOperaciones textarea').val('');
        $('#fsParametros input:text').val('').removeClass('campoInvalido');
        $('#tabsOperaciones select, #fsParametros select').val('-1');
        $('#divSuspension, #divReconexion, #fsParametros').hide();
        $('input[name="radAltoRiesgo"').prop('checked', false);
        $('input[name="radRealizado"').prop('checked', false);
        registroModelo.idMunicipio = null;
        registroModelo.idTercero = null;
        registroModelo.idBarrio = null;
        that.limpiarTabla();
    },
    /**
     * Limpia las tablas de suspensión y reconexión
     */
    limpiarTabla: function () {
        if (that.apptable !== null || that.apptable !== undefined) {
            registroModelo.suspension = null;
            registroModelo.reconexion = null;
            if (that.apptable) {
                that.apptable = that.apptable.destroy();
            }

        }
    },
    /**
     * Muestra u oculta una columna de la tabla según se requiera
     * @param {Event} e - Evento que dispara la función (click que genera toggle)
     */
    mostrarOcultarColumna: function (e) {
        __app.cancelarEvento(e);
        var link = $(this);
        var refer = link.attr('data-refer');
        var visible = link.find('i.fa').hasClass('fa-eye-slash') ? true : false;
        link.find('i.fa').toggleClass('fa-eye-slash').toggleClass('fa-eye');
        var index = -1;
        if (that.apptable !== null || that.apptable !== undefined) {
            for (var i = 0; i < that.apptable.op.columns.length; i++) {
                if (that.apptable.op.columns[i].headers === refer) {
                    if (visible) {
                        that.apptable.hideColumn(i);
                    } else {
                        that.apptable.showColumn(i);
                    }
                    return;
                }
            }
        }
    }
};
registroVista.init();




