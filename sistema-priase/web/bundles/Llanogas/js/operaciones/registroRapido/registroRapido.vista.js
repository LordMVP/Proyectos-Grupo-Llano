        
/**
 * @fileOverview Archivo de vista y control de registro rápido de reconexión y suspensión DEPRECATED
 * @author AppFuture
 * @requires control.js
 * @requires modelo.js
 * @version 1.0.0
 * @deprecated Se reemplazó el archivo con registroRapido.vista1.js
 */
/**
 * Objeto que hace referencia al namespace registroVista
 * @type {Object}
 */
var that = null;
var registroVista = {
    /** Inicializa el programa de registro rápido, y asigna listeners a los controles
     * @returns {void}
     */
    init: function () {
        that = registroVista;
        
        // eventos click de botones
        that.consultarListas();
        that.configurarAutoComplete();
        $("#btnBuscar").attr("disabled", "disabled");
        $("#btnBuscar").on("click", that.buscarTabla);
        $("#btnGuardarRec").on("click", that.guardarReconexiones);
        $("input[name='radFiltrar']").on("change", that.cambiarBuscar);
        $('.btnLimpiarRealizado').on('click', that.limpiarRelizado);
        $("#btnGuardarSus").on("click", function(){that.armarObjetoEnviar('Suspension')});
        $("#btnGuardarRec").on("click", function(){that.armarObjetoEnviar('Reconexion')});
        $("#btnAplicarSuspension").on("click", function(){that.aplicarCampos('Suspension');});
        $("#btnAplicarReconexion").on("click", function(){that.aplicarCampos('Reconexion');});
        __dom.configurarCalendario('txtFechaProgramacion, #txtFechaEjecucionSuspension, #txtFechaEjecucionReconexion');
        $('#txtFechaEjecucionSuspension').datepicker('option', 'minDate', new Date()).val('');
        $('#txtFechaEjecucionReconexion').datepicker('option', 'minDate', new Date()).val('');
        $(window).on('resize', that.onVentanaResize);
    },
    limpiarRelizado: function(){
        $('[name="radSusRealizado"]').prop('checked', false);
    },
    /** Ajusta tamaño de tabla e interfaz según tamaño de pantalla
     * @returns {void}
     **/
    onVentanaResize:function(){
        var margenLateral = (parseFloat($('#contenedor').css('margin-left').replace('px',''))*2)+20;
        var anchoMenu = $('#menu').width();
        var anchoBody = $('body').width();
        $('#tblSuspension_wrapper, #tblReconexion_wrapper').width((anchoBody-margenLateral)-(anchoMenu+100));
    },
    /** Hace petición ajax para consultar novedades y tipo de suspensión 
     * @returns {void}
     **/
    consultarListas: function(){
        registroControl.consultarNovedadesSusLista(function(data){
            registroModelo.novedadesSusLista = data.datos;
        });
        registroControl.consultarNovedadesRecLista(function(data){
            registroModelo.novedadesRecLista = data.datos;
        });
        registroControl.consultarTipoSuspensionLista(function(data){
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
        that.reiniciarFiltroForm();
    },
    /** Limpia toda la información de la interfaz cuando se cambia de operación
     * @returns {void}
     **/
    reiniciarFiltroForm: function () {
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
            status === 'S' ? that.buscarSuspensionesTabla() : that.buscarReconexionesTabla();
        } else {
            __dom.lanzarAlerta(__app.mensajes.seleccionarTipoOperacion, __app.mensajes.atencion);
            $('#fsParametros').hide();
        }
    },
    /** Valida la información del filtro y hace petición ajax para consultar las suspensiones 
     * @returns {void}
     **/
    buscarSuspensionesTabla: function () {
        var barrio = $('#txtBarrio').val()!==''?registroModelo.idBarrio:'';
        var tercero = $('#txtTerceroRealiza').val() !== '' ? registroModelo.idTercero : '';
        var municipio = $('#txtMunicipio').val().trim() !== '' ? registroModelo.idMunicipio : null;
        var zona = $("#cmbZona").val() !== "-1" ? $("#cmbZona").val() : null;
        
        var altoRiesgo = $("input[name='radAltoRiesgo']:checked").length > 0 ? 
                        $("input[name='radAltoRiesgo']:checked").attr("data-val") : null;
        var realizado = $("input[name='radRealizado']:checked").length > 0 ? 
                        $("input[name='radRealizado']:checked").attr("data-val") : null;
        if (!municipio  || $("#cmbRuta").val() === "-1" || $("#cmbMotivoSus").val() === '-1') {
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
            motivo: $("#cmbMotivoSus").val(),
            desde: $("#txtSecuenciaDesde").val(),
            hasta: $("#txtSecuenciaHasta").val(),
            fechaprogramacion: $("#txtFechaProgramacion").val()
        };
        registroControl.consultarTablaSuspensiones(data, that.buscarSuspensionesTablaCompletado);
    },
    /** Captura la respuesta del servidor cuando se consultan suspensiones
     * @param {object} data - Información de las suspensiones a posibles cambios
     * @returns {void}
     **/
    buscarSuspensionesTablaCompletado: function (data) {
        if (data.codigoRespuesta > 0) {
            for(var i = 0; i < data.datos.length; i++){
                var fila = data.datos[i];
                fila.fechaejecucion = !!(fila.fechaejecucion) ? fila.fechaejecucion : false;
                fila.lectura = !!(fila.lectura) ? fila.lectura : false;
                fila.observacion = !!(fila.observacion) ? fila.observacion : false;
                fila.idnovedad = !!(fila.idnovedad) ? fila.idnovedad : false;
                fila.idtiposuspension = !!(fila.idtiposuspension) ? fila.idtiposuspension : false;
                fila.tercero = !!(fila.tercero) ? fila.tercero : false;
                fila.realizada = !!(fila.realizada) ? fila.realizada : false;
                fila.valortotal = !!(fila.valortotal) ? fila.valortotal : false;
            }
            registroModelo.suspension = data.datos;
            $('#tabsOperaciones #divSuspension').show();
            $('#tabsOperaciones #divReconexion').hide();
            that.generarTablaSuspensiones();
        } else {
            __dom.lanzarAlerta("No se encontraron suspensiones, intente nuevamente", __app.mensajes.atencion);
            that.limpiarValores();
        }
    },
    /** Oculta las columnas de las tablas según se haya configurado su información anteriormente
     * @returns {void}
     **/
    ocultarColumnasSuspension: function(){
        var id = $(this)[0].id;
        if(id === 'tblSuspension'){
            var table = registroModelo.tablaSuspension;
            var modulo = 'Suspension';
        }else if(id === 'tblReconexion'){
            var table = registroModelo.tablaReconexion;
            var modulo = 'Reconexion';
        }

        var dataTable = table.DataTable();
        dataTable.columns().visible(true);
        setTimeout(function(){
            dataTable.column(10).visible( registroModelo.observacionHide );
            dataTable.column(11).visible(registroModelo.novedadHide);
            dataTable.column(13).visible( registroModelo.terceroHide );
            dataTable.column(12).visible( registroModelo.tipoSusHide );
            dataTable.column(14).visible( registroModelo.realizadaHide);    
        }, 10);
        
    },
    /** Carga la información de las suspensiones para posibles registro y configura controles
     * @returns {void}
     **/    generarTablaSuspensiones: function(){
        $('#spanGuardars').text('');
        var table = $('#tblSuspension').empty();
        if ($.fn.dataTable.isDataTable(registroModelo.tablaSuspension)) {
            registroModelo.tablaSuspension.DataTable().columns().visible(true);
            registroModelo.tablaSuspension.DataTable().destroy();
        }
        registroModelo.novedadHide = true;
        registroModelo.terceroHide = true;
        registroModelo.tipoSusHide = true;
        registroModelo.realizadaHide = true;
        registroModelo.observacionHide = true;
        registroModelo.tablaSuspension = table.dataTable({
            scrollX: true,
            scrollCollapse: true,

            "bScrollCollapse": true,
            "data": registroModelo.suspension,
            "columns": formatoSuspension,
            "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                that.renderFilaSuspensiones(nRow, aData);
            },
            "language": {
                        url: "/achagua/sistema/web/bundles/Llanogas/js/facturacion/Spanish.json"
            },
            "destroy": true,
            "initComplete":function(){
                that.onVentanaResize();
            }
        }).off('order.dt').off('page.dt').off('length.dt').off('search.dt')
          .on('order.dt', that.ocultarColumnasSuspension)
          .on('page.dt', that.ocultarColumnasSuspension)
          .on('length.dt', that.ocultarColumnasSuspension)
          .on('search.dt', that.ocultarColumnasSuspension);
    },

    /** Aplica valores por defecto a todas las filas de la tabla que se esté modificando
     * además oculta las columnas según convenga
     * @returns {void}
     **/
    aplicarCampos: function(modulo){
        
        var table = (modulo === 'Suspension') ? registroModelo.tablaSuspension : 
                    ((modulo === 'Reconexion') ? registroModelo.tablaReconexion : 0);
        table.DataTable().columns().visible(true);
        var tipoSus = $("#cmbTipo"+modulo);
        var tercero= $("#txtTercero"+modulo);
        var novedad = $("#cmbNovedad"+modulo);
        var fecha = $("#txtFechaEjecucion"+modulo);
        var observacion = $("#txtObservacion"+modulo); 
        var realizada = $("#div"+modulo+" input[name='radSusRealizado']:checked");

        var dataTable = table.DataTable();
        var registros = dataTable.data();
        for(var i = 0; i< registros.length; i ++){
            var datos = registros[i];
            if (novedad.val() > 0) datos.idnovedad = novedad.val();
            if (tipoSus.val() > 0) datos.idtiposuspension = tipoSus.val();
            if (realizada.length > 0) datos.realizada = realizada.attr('data-val');
            if(fecha.val() !== '') datos.fechaejecucion = fecha.val()+ " 00:00:00";
            if(observacion.val() !== '') datos.observacion = observacion.val();
            if (tercero.val() !== ''){
                datos.tercero = tercero.val();
                datos.idtercero =tercero.attr('data-indice');
            }
        }

        registroModelo.novedadHide = !(novedad.val() > 0);
        registroModelo.terceroHide = !(tercero.val() !== '');
        registroModelo.tipoSusHide = !(tipoSus.val() > 0);
        registroModelo.realizadaHide = !(realizada.attr("data-val") !== undefined);
        registroModelo.observacionHide = !(observacion.val() !== '');

        //El indice de las columnas Depende del orden de columnas en formatoSuspension
        dataTable.column(11).visible(!(novedad.val() > 0));
        dataTable.column(13).visible( !(tercero.val() !== ''));
        dataTable.column(12).visible( !(tipoSus.val() > 0));
        dataTable.column(14).visible(!(realizada.attr("data-val") !== undefined));
        dataTable.column(10).visible(!(observacion.val() !== ''));
        dataTable.draw();
    },
    /** Carga los controles de una fila, asignándoles eventos y configuraciones
     * @param {object} nRow - Fila de la tabla que se carga
     * @param {object} aData - Información de la fila que se está cargando
     **/
    renderFilaSuspensiones:function(nRow, aData, callback){
        nRow = $(nRow);
        var fecha = that.configurarFecha(!aData.fechaejecucion ? null : aData.fechaejecucion, 's');
        var nov = $("<select>").addClass("sNovedad");
        var tipoSus = $("<select>").addClass("sTiposuspension");
        var lec = $("<input>").attr("type","text").addClass("sLectura").val(!!aData.lectura ? aData.lectura : null).css("width","4.5em");
        var obs = $("<input>").attr("type","text").addClass("sObservacion").val(!!aData.observacion ? aData.observacion : null);
        var ter = $("<input>").addClass("sTercero")
                              .val(!!aData.tercero ? aData.tercero : null)
                              .attr({'data-indice' : aData.idtercero, 'type': 'text'});

        var real = $("<input>").addClass("sRealizada").val(aData.realizada)
                               .attr({'type': 'text', 'maxlength': 1})
                               .css("width","1.5em")
                               .on('keypress', registroControl.validacionSoloCaracter); 

        
        that.cargarAutocompleteTercerosTabla(ter, 'S');
        __dom.configurarTextoNumerico(lec);
        
        lec.on('blur', that.eventoBlurSelector);
        nov.on('blur', that.eventoBlurSelector);
        obs.on('blur', that.eventoBlurSelector);
        real.on('blur', that.eventoBlurSelector);
        tipoSus.on('blur', that.eventoBlurSelector);

        var tds = nRow.find('td');
        $(tds[7]).addClass('sFechaprogramacion');
        $(tds[8]).empty()
                 .addClass('sFechaejecucion')
                 .append(fecha.span, fecha.min);
        $(tds[9]).empty().append(lec);
        $(tds[10]).empty().append(obs);
        $(tds[11]).empty().append(nov);
        $(tds[12]).empty().append(tipoSus);
        $(tds[13]).empty().append(ter);
        $(tds[14]).empty().append(real);
        __dom.llenarCombo(nov, registroModelo.novedadesSusLista, 'id', 'nombre').val(!aData.idnovedad  ? '-1': aData.idnovedad);
        __dom.llenarCombo(tipoSus, registroModelo.tipoSusLista, 'idtiposuspension', 'tiposuspension').val(!aData.idtiposuspension ? '-1' : aData.idtiposuspension);


    },
    /** Valida la información del filtro y hace petición ajax para consultar reconexiones
     * @returns {void}
     **/
    buscarReconexionesTabla: function () {
        var municipio = registroModelo.idMunicipio;
        var barrio = registroModelo.idBarrio;
        var fechaprogramacion = $("#txtFechaProgramacion").val();
        var ruta = $("#cmbRuta").val() !== "-1" ? $("#cmbRuta").val() : null;
        var zona = $("#cmbZona").val() !== "-1" ? $("#cmbZona").val() : null;
        var motivo = $("#cmbMotivoReconexion").val() !== "-1" ? $("#cmbMotivoReconexion").val() : null;
        var desde = $("#txtSecuenciaDesde").val();
        var hasta = $("#txtSecuenciaHasta").val();
        var tercero = registroModelo.idTercero;
        var altoRiesgo = $("input[name='radAltoRiesgo']:checked").attr("data-val") !== undefined ? $("input[name='radAltoRiesgo']:checked").attr("data-val") : null;
        var realizado = $("input[name='radRealizado']:checked").attr("data-val") !== undefined ? $("input[name='radRealizado']:checked").attr("data-val") : null;
        if (!municipio || !ruta || !motivo) {
            __dom.lanzarAlerta("El municipio el motivo y la ruta son datos obligatorios", __app.mensajes.atencion);
            return;
        }
        var data = {
            municipio: municipio,
            ruta: ruta,
            barrio: barrio,
            desde: desde,
            hasta: hasta,
            altoriesgo: altoRiesgo,
            zona: zona,
            motivo: motivo,
            tercero: tercero,
            realizada: realizado,
            fechaprogramacion: fechaprogramacion
        };
        registroControl.consultarTablaReconexiones(data, that.buscarReconexionesTablaCompletado);
    },
    /** Captura la respuesta del servidor cuando se consultan reconexiones
     * @param {object} data - Información de las reconexiones para posibles registros
     * @returns {void}
     **/
    buscarReconexionesTablaCompletado: function (data) {
        if (data.codigoRespuesta > 0) {
            for(var i = 0; i < data.datos.length; i++){
                var fila = data.datos[i];
                fila.fechaejecucion = !!(fila.fechaejecucion) ? fila.fechaejecucion : false;
                fila.fechaprogramacion  = !!(fila.fechaprogramacion ) ? fila.fechaprogramacion : false;
                fila.lectura = !!(fila.lectura) ? fila.lectura : false;
                fila.observacion = !!(fila.observacion) ? fila.observacion : false;
                fila.idnovedad = !!(fila.idnovedad) ? fila.idnovedad : false;
                fila.tercero = !!(fila.tercero) ? fila.tercero : false;
                fila.realizada = !!(fila.realizada) ? fila.realizada : false;
                fila.valortotal = !!(fila.valortotal) ? fila.valortotal : false;
            }
            registroModelo.reconexiones = data.datos;
            $('#tabsOperaciones #divSuspension').hide();
            $('#tabsOperaciones #divReconexion').show();

            that.generarTablaReconexiones();
        } else {
            __dom.lanzarAlerta("No se encontraron reconexiones, intente nuevamente", __app.mensajes.atencion);
            that.limpiarValores();
        }
    },
    /** Carga la información de las reconexiones en una tabla y configura controles
     * @returns {void}
     **/
    generarTablaReconexiones: function(){
        $('#spanGuardarr').text('');
        $('#spanGuardars').text('');
        var table = $('#tblReconexion').empty();
        if ($.fn.dataTable.isDataTable(registroModelo.tablaReconexion)) {
            registroModelo.tablaReconexion.DataTable().columns().visible(true);
            registroModelo.tablaReconexion.DataTable().destroy();
        }

        registroModelo.novedadHide = true;
        registroModelo.terceroHide = true;
        registroModelo.tipoSusHide = true;
        registroModelo.realizadaHide = true;
        registroModelo.observacionHide = true;
        registroModelo.tablaReconexion = table.dataTable({
            scrollX:true,
            scrollCollapse: true,
            "data": registroModelo.reconexiones,
            "columns": formatoReconexion,
            "destroy": true,
            "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                that.rowCallbackReconexion(nRow, aData);
            },
            "language": {
                        url: "/achagua/sistema/web/bundles/Llanogas/js/facturacion/Spanish.json"
            },
            "initComplete":function(){
                that.onVentanaResize();
            }
        }).off('order.dt').off('page.dt').off('length.dt').off('search.dt')
          .on('order.dt', that.ocultarColumnasSuspension)
          .on('page.dt', that.ocultarColumnasSuspension)
          .on('length.dt', that.ocultarColumnasSuspension)
          .on('search.dt', that.ocultarColumnasSuspension);
    },   
    /** Carga los controles de una fila, asignándoles eventos y configuraciones
     * @param {object} nRow - Fila de la tabla que se carga
     * @param {object} aData - Información de la fila que se está cargando
     **/ 
    rowCallbackReconexion: function(nRow, aData, callback){
        nRow = $(nRow);
       var fecha = that.configurarFecha(!aData.fechaejecucion ? null : aData.fechaejecucion, 'r');
        var nov = $("<select>").addClass("rNovedad");
        var obs = $("<input>").attr("type","text").addClass("rObservacion").val(!!aData.observacion ? aData.observacion : null);
        var lec = $("<input>").attr("type","text").addClass("rLectura").val(!!aData.lectura ? aData.lectura : null).css("width","4.5em");
        var ter = $("<input>").addClass("rTercero")
                              .val(!!aData.tercero ? aData.tercero : null)
                              .attr({'data-indice' : aData.idtercero, 'type': 'text'});
        
        var real = $("<input>").addClass("rRealizada").val(aData.realizada)
                               .attr({'type': 'text', 'maxlength': 1})
                               .css("width","1.5em")
                               .on('keypress', registroControl.validacionSoloCaracter); 
        that.cargarAutocompleteTercerosTabla(ter, 'R');
        
        lec.on('blur', that.eventoBlurReconexion);
        nov.on('blur', that.eventoBlurReconexion);
        obs.on('blur', that.eventoBlurReconexion);
        real.on('blur', that.eventoBlurReconexion);

        var tds = nRow.find('td');
        $(tds[7]).addClass('rFechaprogramacion').text(aData.fechaprogramacion ? aData.fechaprogramacion : null);
        $(tds[8]).empty()
                 .addClass('rFechaejecucion')
                 .append(fecha.span, fecha.min);
        $(tds[9]).empty().append(lec);
        $(tds[10]).empty().append(obs);
        $(tds[11]).empty().append(nov);
        $(tds[12]).empty().append(ter);
        $(tds[13]).empty().append(real);
        __dom.configurarTextoNumerico(lec);
        __dom.llenarCombo(nov, registroModelo.novedadesRecLista, 'id', 'nombre').val(!aData.idnovedad ? '-1' : aData.idnovedad);

    },
    /** Cuando se cambia algún dato en la tabla de la suspensión de inmediato se cambia
     * en la información interna de la tabla y se recarga la fila
     * @returns {void}
     **/
    eventoBlurSelector: function(){       
        var _this = $(this);
        var td = _this.parent();
        var tr = td.parent();
        var celda = registroModelo.tablaSuspension.DataTable().cell(td);
        celda.data(_this.val());
        //Retorna el objeto completo de la fila de DataTable
        var trData = registroModelo.tablaSuspension.DataTable().row(tr).data();
        that.renderFilaSuspensiones(tr, trData);
    },
    /** Cuando se cambia algún dato en la tabla de la reconexión de inmediato se cambia
     * en la información interna de la tabla y se recarga la fila
     * @returns {void}
     **/
    eventoBlurReconexion: function(){       
        var _this = $(this);
        var td = _this.parent();
        var tr = td.parent();
        var celda = registroModelo.tablaReconexion.DataTable().cell(td);
        celda.data(_this.val());
        //Retorna el objeto completo de la fila de DataTable
        var trData = registroModelo.tablaReconexion.DataTable().row(tr).data();
        that.rowCallbackReconexion(tr, trData);
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
            },
            function() {
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
            'input#txtTerceroRealiza, #txtTerceroSuspension',
            that.sourceAutoCompleteTerceros,
            function (event, ui) {
                registroModelo.idTercero = ui.item.idVal;
            },
            function() {
                registroModelo.idTercero = undefined;
            }
        );

        __dom.configurarAutocomplete(
            '#txtTerceroSuspension, #txtTerceroReconexion',
            that.sourceAutoCompleteTerceros,
            function (event, ui) {
                $(this).attr("data-indice", ui.item.idVal);
            },
            function(txt) {
                $(txt).removeAttr('data-indice');
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
        var barrio = $("#txtBarrio").val();
        var municipios = registroModelo.idMunicipio;
        var data = {
            "barrio": barrio,
            "municipios": municipios + ""
        };
        registroControl.consultarBarrios(data, that.onConsultarBarriosCompleto);
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
    
    cargarAutocompleteTercerosTabla: function (selector, modulo) {
        var tabla = modulo === 'S' ? registroModelo.tablaSuspension : registroModelo.tablaReconexion;
        var render = modulo === 'S' ? that.renderFilaSuspensiones : that.rowCallbackReconexion;
        selector.autocomplete({
            source: that.sourceAutoCompleteTerceros,
            minLength: 3,
            select: function (event, ui) {
                var txt = $(this);
                var td = txt.parent();
                var tr = txt.parent().parent();

                var celda = tabla.DataTable().cell(txt.parent());
                celda.data(ui.item.label);
                
                txt.attr("data-indice", ui.item.idVal);
                var trData = tabla.DataTable().row(tr).data();
                trData.idtercero = ui.item.idVal;
                render(tr, trData);

            },
            open: function () {
                $(this).removeClass("ui-corner-all").css('z-index', '9999');
            }
        });
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
        if(data.codigoRespuesta){
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
    /** Valida la información que se enviará al servidor dependiendo de la operación que se realiza
     * @param {string} modulo - Letra inicial de la operación actual
     * @returns {void}
     **/
    armarObjetoEnviar: function(modulo){
        //Se asignan variables según el modulo (Reconexion - Suspension)
        if(modulo === 'Suspension'){
            var dataTable = registroModelo.tablaSuspension.DataTable();
            dataTable.columns().visible(true);
            registroModelo.accion = 'suspensiones';
            var tabla = $("#tblSuspension tbody tr");
            var letra = 's';
            var id = 'idsuspension';
            var funcion = registroControl.guardarSuspensiones;
        }else if(modulo === 'Reconexion'){
            var dataTable = registroModelo.tablaReconexion.DataTable();
            dataTable.columns().visible(true);
            registroModelo.accion = 'reconexiones';
            var tabla = $("#tblReconexion tbody tr");
            var letra = 'r';
            var id = 'idreconexion';
            var funcion =registroControl.guardarReconexiones;
        }


        var span = $('#spanGuardar'+letra).text('');
        var datos = [];
        //Recorre las filas para validar campos e ir formando el json a enviar

        var registros = dataTable.data();
        for(var d = 0; d < registros.length; d++){
            var fila = registros[d];
            if(fila.realizada === 'S'){
                //idnovedad = tr.find("."+letra+"Novedad").val();
                //idtiposuspension = tr.find("."+letra+"Tiposuspension").val();
                /*if(tr.find("span."+letra+"spanFechaEjec").text().match("____-__-__")){
                    span.text('La fecha de ejecución es obligatorio si a sido realizada');
                    continue;
                }*/
                if((fila.idnovedad === '-1' || fila.idnovedad === null ) || (fila.idtiposuspension === '-1' && letra === 's')){
                    __dom.lanzarAlerta('Las novedades y tipos de suspensión son campos obligatorios en la suspensión: '+fila.idsuspension);
                    return;
                }
            }
            var object = {
                //idsuspension : fila.idsuspension,
                fechaprogramacion: fila.fechaprogramacion ? fila.fechaprogramacion : '',
                fechaejecucion: fila.fechaejecucion ? fila.fechaejecucion : '',
                lectura: fila.lectura ? fila.lectura : null,
                observacion: fila.observacion ?fila.observacion : null,
                idnovedad: fila.idnovedad ? fila.idnovedad : null,
                idtiposuspension: fila.idtiposuspension ? fila.idtiposuspension : null,
                idtercero: fila.tercero ? fila.idtercero : null,
                realizada: fila.realizada,
            };
            object[id] = fila[id];
            datos.push(object);
        }

        var data = {};
        data[registroModelo.accion] = datos;
        funcion(data, that.onGuardarCompleto);
    }, 
    /** Captura la respuesta del servidor cuando se graba la información de las suspensiones o reconexiones 
     * @param {object} data - Respuesta del registro realizado
     * @returns {void}
     **/
    onGuardarCompleto: function (data) {
        if(data.datos > 0){
            that.limpiarFormulario();
            $('input[name="radFiltrar"').prop('checked', false);
            __dom.lanzarAlerta("La información de las "+registroModelo.accion+" ha sido cargada correctamente", __app.mensajes.atencion);
        } else{
            __dom.lanzarAlerta(__app.mensajes.errorGuardarInformacion, __app.mensajes.atencion);
        }
    }, 

    /** Hace la configuración de la columna en las tablas que visualiza la fecha de ejecución
     * @param {string} fecha - Fecha que se mostrará
     * @param {string} opcion - Letra inicial de la operación que se está realizando
     * @returns {object} Objetos HTML para ser agregados en tds
     **/
    configurarFecha: function(fecha, opcion){
        
        fecha = (fecha === null || !fecha) ?  "____-__-__ 00:00:00" : fecha;

        var fechaeje = fecha.toString().split(" ");
        var spanfecha = $("<span>").addClass(opcion+"spanFechaEjec").text(fechaeje[0]);
        var minutos = fechaeje[1].split(":");

        var min = $("<input>").addClass(opcion+"HoraEjec")
                              .val(minutos[0]).css("width","1.5em")
                              .attr({'maxlength': 2, 'type': "text"});

        var seg = $("<input>").addClass(opcion+"MinEjec")
                              .val(minutos[1]).css("width","1.5em")
                              .attr({'maxlength': 2, 'type': "text"});
        __dom.configurarTextoNumerico(min);
        __dom.configurarTextoNumerico(seg);
        var divTiempo = $('<div>').css({width: '90%'}).append(min, $('<span>').text(':'), seg);
        if(spanfecha.text() === '____-__-__'){
            min.attr('disabled', true);
            seg.attr('disabled', true);
        }
        return {'span': spanfecha, 'min': divTiempo};
    },
    /** Limpia toda la información del formulario y modelo
     * @returns {void}
     **/
    limpiarFormulario: function(){
        $('#fsParametros input:text').val('').removeClass('campoInvalido');
        $('#divSuspension, #divReconexion, #fsParametros').hide();
        $('#tabsOperaciones select, #fsParametros select').val('-1');
        $('#tabsOperaciones input:text, #tabsOperaciones textarea').val('');
        $('#tabsOperaciones input[name="radSusRealizado"]').prop('checked', false);
        $('input[name="radAltoRiesgo"').prop('checked', false);
        $('input[name="radRealizado"').prop('checked', false);
        registroModelo.idMunicipio = null;
        registroModelo.idBarrio = null;
        registroModelo.idTercero = null;
    }, 

    /** Limpia valores de las tablas 
     * @returns {void}
     **/ 
    limpiarValores: function(){
        var status = $("input[name='radFiltrar']:checked").attr("data-val");
        $('#tabsOperaciones #divSuspension').hide();
            $('#tabsOperaciones #divReconexion').hide();
        if (status !== undefined) {
            if(status === 'S'){
                if ($.fn.dataTable.isDataTable(registroModelo.tablaSuspension)) {
                    registroModelo.tablaSuspension.DataTable().columns().visible(true);
                    registroModelo.tablaSuspension.DataTable().destroy();
                }
                //registroModelo.tablaSuspension.DataTable().destroy();  
            } else{
                if ($.fn.dataTable.isDataTable(registroModelo.tablaReconexion)) {
                    registroModelo.tablaReconexion.DataTable().columns().visible(true);
                    registroModelo.tablaReconexion.DataTable().destroy();
                }
            } 
        }
    }

};
registroVista.init();