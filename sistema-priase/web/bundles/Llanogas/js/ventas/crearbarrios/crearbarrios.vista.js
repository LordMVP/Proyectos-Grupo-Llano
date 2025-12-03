/**
 * @fileOverview Archivo de vista de crear barrios
 * @author Oscar Baquero
 * @requires crearBarrios.control.js
 * @requires crearBarrios.model.js
 * @version 1.0.0
 */

/**
 * Objeto que hace referencia al namespace registroBarriosVista
 * @type {Object}
 */
var that = null;

/** @namespace */
var crearBarriosVista = {
   
    /**
     * Inicializa el programa para el registro de ventas y asigna listeners a controles.
     * @returns {void}
     */
    init: function () {
        that = crearBarriosVista;
        __dom.configurarTextoNumerico('txtCodigo, #txtSector');
        
        
        $('#btnGrabar').on('click', that.grabarBarrio);
        $('#btnNuevo').on('click', that.nuevoBarrio);
        $('#btnExisteBarrio').on('click', that.existeBarrio);
        $('#btnBuscar').on('click', that.mostrarBuscarBarrio);
        $('#btnAdicionarRuta').on('click', that.onVinculaRuta);
        $('#divBuscarBarrio #btnBuscarBarrio').on('click', that.onBuscaBarrios);
        $('#cmbMunicipio').on('change',that.buscaRutasMunicipio)
        __dom.configurarAutocomplete(
                $('div#divBarrio input#txtNombre'),
                that.sourceAutoCompleteBarrio,
                function (event, ui) {
                    $('div#divBarrio input#txtNombre').val(ui.item ? ui.item.value : '');   
                },
                function () {
                }
        );
       
    },
    nuevoBarrio: function(){
        that.limpiaCampos();
        that.habilitarCampos();
        $('#txtCodigo').attr('disabled','disabled');
        crearBarriosModel.insert = 1;
        crearBarriosModel.actualiza = null;
    },
    grabarBarrio: function(){
        var idcodigo = $('#txtCodigo').val();
        var nombre = $('#txtNombre').val();
        var idmunicipio = $('#cmbMunicipio').val();
        var tercerizado = $('#txtTercerizado').val();
        var sector = $('#txtSector').val();
        var idruta = $('#cmbRuta').val();
        
        $('#mensajeAlerta').text('');
        
        
        
        var campos = $('div#divBarrio').find('input[type=text] ,select');
        
        for (var i = 0; i < campos.length; i++) {
            var campo = $(campos[i]);
            var requerido = campo.attr('required');
            if ((campo.val() === '' || campo.val() === '-1') && requerido === 'required')
            {
                var idCampo = campo.attr('id');
                var ValLabelCampo = $('div#divBarrio').find('label[for=' + idCampo + ']').text();
                
                $('#mensajeAlerta').text('El campo ' + ValLabelCampo + ' es requerido  ');
                campo.focus();
                return;
            }
        }
        if(crearBarriosModel.rutasVinculadas.length === 0){
            __dom.lanzarAlerta('Error, Por favor vincular rutas', 'Advertencia');
            return;
        }
        
        var data = {
            'idcodigo': idcodigo,
            'nombre': nombre,
            'idmunicipio': idmunicipio,
            'tercerizado': tercerizado,
            'sector': sector,
            'rutasVinculadasNuevas': crearBarriosModel.rutasVinculadasNuevas,
            'rutasVinculadasEliminadas': crearBarriosModel.rutasVinculadasEliminadas,
            'insert': crearBarriosModel.insert,
            'actualiza': crearBarriosModel.actualiza,
            'idmuba': crearBarriosModel.idmuba
        };
        
        crearBarriosControl.grabarBarrio({parametros: data}, that.onResultadoBarrio);
    },
    
    existeBarrio: function(){
         var data = {
            'idcodigo': $('#txtCodigo').val(),
            'nombre': $('#txtNombre').val(),
            'idmunicipio': $('#cmbMunicipio').val(),
            'tercerizado': $('#txtTercerizado').val(),
            'sector': $('#txtSector').val(),
            'idruta': $('#cmbRuta').val()
        };
        $('#mensajeAlerta').text('');
        if( ($('#txtCodigo').val() == '' || $('#txtCodigo').val() == null ) ){
            $('#mensajeAlerta').text('El campo código es requerido  ');
             $('#txtCodigo').focus();
            return;
        }
        if($('#cmbMunicipio').val() == '-1'){
           $('#mensajeAlerta').text('El campo municipio es requerido  ');
            $('#cmbMunicipio').focus();
            return;
        }
        crearBarriosControl.consultarBarrios({parametros: data}, that.onConsultarBarrio);
    },
    
    onConsultarBarrio: function (data){
        if(data.barrios.length>0){            
            __dom.lanzarAlerta('Ya existe el código del barrio con el municipio referenciado', 'Advertencia');
        }       
    },
    
    onResultadoBarrio: function (data){
        switch (data.codigoRespuesta) {
            case -1:
                __dom.lanzarAlerta(data.mensaje, 'Advertencia');
            break;
                
            case 1:
                __dom.lanzarAlerta(data.mensaje);
                location.reload();
            break;
            
            case 0:
                __dom.lanzarAlerta(data.mensaje, 'Advertencia');
            break;
                
                break;
        }            
    },
    
     /**
     * Si ya se ha seleccionado el campo de municipio y se han ingresado información en el nombre del barrio se envia 
     * petición al controlador para que busque los barrios que cumplan con estos filtrados 
     * @param {type} request
     * @param {type} response
     * @returns {void}
     */
    sourceAutoCompleteBarrio: function (request, response) {

        if ($('#cmbMunicipio').val() == '-1') {
            __dom.lanzarAlerta('Debe seleccionar un municipio', 'Error');
            return;
        }
        that.request = request;
        that.response = response;
        var datos = {};
        datos.nombre = request.term;
        datos.idmunicipio = $('#cmbMunicipio').val() ;
        crearBarriosControl.consultarBarrios({parametros: datos}, that.mostrarResultadoBarrio);
    },
    
     /**
     * Muestra los datos del barrio que se seleccionó y el identificador del barrio para que sea almacenado en 
     * el modelo Js 
     * @param {type} data
     * @returns {void}
     */
    mostrarResultadoBarrio: function (data) {
        __dom.ocultarCargador();
        if (data.codigoRespuesta === 0)
            return;
        var result = [];
        $.each(data.barrios, function (i, item) {
            result.push({
                label:  item.barrio_nom,
                value: item.barrio_nom,
                idVal: item.barrio_nom
            });
        });
        that.response(result);
    },
    
    /**
     * Ventana emergente de "buscar Barrios".
     * @returns {void}
     */
    mostrarBuscarBarrio: function () {
        
        crearBarriosModel.actualiza = 1;
        var dialogo = $('#divBuscarBarrio');
        dialogo.find('input[type = text]').val('');
        that.dialogoActual = dialogo.dialogo({
            modal: true,
            width: 700,
            title: 'Buscar un barrio',
            buttons: {
                Finalizar: that.CargarResultadoBarrios
            }
        });
    },
    
    onBuscaBarrios: function(){
        
       
        $('#mensajeAlertaDialogo').text('');       
       
        if($('#cmbMunicipioBarrio').val() == '-1'){
           $('#mensajeAlertaDialogo').text('El campo municipio es requerido  ');
            $('#cmbMunicipioBarrio').focus();
            return;
        }
        
        if( $('#txtCodBarrio').val()=='' && $('#txNombreBarrio').val()=='' ){
            $('#mensajeAlertaDialogo').text('Digite, Nombre ó Código  '); 
            return
        }
         var data = {
            'idcodigo': $('#txtCodBarrio').val(),
            'nombre': $('#txNombreBarrio').val(),
            'idmunicipio': $('#cmbMunicipioBarrio').val(),
            'dialogo': 'dialogo'
        };
        crearBarriosControl.consultarBarrios({parametros: data}, that.onResultadoConsultarBarrio);
    },
    
    onResultadoConsultarBarrio: function(data){
       $('#tblResultadoFiltro').empty();
        __dom.ocultarCargador();
        crearBarriosModel.barrios = data.barrios ;
        if (parseInt(data.codigoRespuesta) === 0) {
            var pmensaje = $('#mensajeAlertaDialogo').text(data.mensaje);
            return;
        }
        var tablaBarrios = fillTable("tblResultadoFiltro", "formatoBarrios", data.barrios, ' ');
        var divRsultados = $('#divResultadosFiltro').show();
    
    },
    
    CargarResultadoBarrios: function(){
        that.habilitarCampos();
        crearBarriosModel.insert = null;
        crearBarriosModel.actualiza = 1;
        that.dialogoActual.dialog('close');
        var posicion = $('table#tblResultadoFiltro input[type=radio]:checked').parent().parent().attr('data-fila');
        var resultadoBarrios = crearBarriosModel.barrios[posicion];
        crearBarriosModel.idmuba = resultadoBarrios.idmuba;
        that.cargaRutasVinculadas( resultadoBarrios.idmuba );
        var divBuscarBarrio = $('div#divBarrio');
        divBuscarBarrio.find('input#txtCodigo').val(resultadoBarrios.codigo).attr('disabled', true);
        divBuscarBarrio.find('input#txtNombre').val(resultadoBarrios.barrio_nom);
        divBuscarBarrio.find('select#cmbMunicipio').val(resultadoBarrios.idmunicipio).attr('disabled', true);
        divBuscarBarrio.find('select#txtTercerizado').val(resultadoBarrios.tercerizado);
        divBuscarBarrio.find('input#txtSector').val(resultadoBarrios.sector);
        divBuscarBarrio.find('select#cmbRuta').val(-1);
        that.buscaRutasMunicipio();
        
        
    },
    
    cargaRutasVinculadas: function (datos){
         var data = {
            'idmuba': datos
        };
        crearBarriosControl.consultarRutasVinculadas({parametros: data}, that.onResultadoRutasVinculadas);
    },
    
    onResultadoRutasVinculadas:function(data){
        
        crearBarriosModel.rutaCargue = data.rutasVinculadas;
        $('table#tblRutasVinculadas').empty();
        var tblRutVinculadas = fillTable("tblRutasVinculadas", "formatoRutasVinculadas", data.rutasVinculadas, "Rutas Vinculadas"); 
            tblRutVinculadas.find('tbody tr td[header="thSelector"]  input').on('mousedown', that.habilitaEliminar);
            tblRutVinculadas.find('tbody tr td[header="thEliminar"] input').on('click', that.onEliminaRutasVinculadas).attr('disabled', true);
            tblRutVinculadas.find('thead tr th[id="thSelector"] input:checkbox').remove();
            tblRutVinculadas.show();
             crearBarriosModel.rutasVinculadas = [];
            for (var rv = 0; rv < crearBarriosModel.rutaCargue.length; rv++) {
                crearBarriosModel.rutasVinculadas.push(crearBarriosModel.rutaCargue[rv]);
            }
        
    },
    
    onEliminaRutasVinculadas: function(){
        var check = $(this);
        var trSeleccionada = check.parent().parent();
        var posicion = parseInt(trSeleccionada.attr('data-fila'));        
        if (!check.prop('checked')) {
           if(crearBarriosModel.rutasVinculadas[posicion].idmubarut != null){
                crearBarriosModel.rutasVinculadasEliminadas.push(crearBarriosModel.rutasVinculadas[posicion]);
           } 
                crearBarriosModel.rutasVinculadas.splice(posicion, 1);
        }
        that.onResultadoRutasVinculadas(crearBarriosModel);
    },
    
    habilitaEliminar: function(){
        
        var check = $(this);        
        var trSeleccionada = check.parent().parent();        
        if (!check.prop('checked')) {
            trSeleccionada.addClass('selected').find('td[header="thEliminar"] input').attr('disabled', false);
        }else{
            trSeleccionada.addClass('selected').find('td[header="thEliminar"] input').attr('disabled', true);
        }
              
    },
    
    onVinculaRuta: function(){
        var idRuta = $('#cmbRuta').val();
        var rutNombre = $('#cmbRuta option:selected').text();
        var data = [];
        if(idRuta == -1){
            __dom.lanzarAlerta('Error, Debe seleccionar una opción de ruta', 'Error');
            return;
        }
        if(crearBarriosControl.validaRutasVinculadas(idRuta)){
            __dom.lanzarAlerta('Error, Ya se vinculo la ruta seleccionada  '+ rutNombre, 'Error');
            return ;
        }
        data.push({
            idmubarut:null,
            idruta:idRuta,
            rutnombre:rutNombre
        });
         for (var rv = 0; rv < data.length; rv++) {
                crearBarriosModel.rutasVinculadas.push(data[rv]);
                crearBarriosModel.rutasVinculadasNuevas.push(data[rv]);
            }
        
        that.onResultadoRutasVinculadas(crearBarriosModel);
        
    },
    
    habilitarCampos: function (){
       var campos = $('div#divBarrio').find('input[type=text] ,select');
        
        for (var i = 0; i < campos.length; i++) {
            var campo = $(campos[i]);
             campo.removeAttr('disabled');
        } 
    },
    
    limpiaCampos: function(){
        var campos = $('div#divBarrio').find('input[type=text]');
        var selectores = $('div#divBarrio').find('select');
        
        for (var i = 0; i < campos.length; i++) {
            var campo = $(campos[i]);
             campo.val('');         
        } 
        for (var i = 0; i < selectores.length; i++) {
            var selector = $(selectores[i]);
            selector.val(-1);
         
        }
        crearBarriosModel.barrios = [];
        crearBarriosModel.rutasVinculadas =  []
        crearBarriosModel.rutasVinculadasEliminadas = [];
        crearBarriosModel.rutaCargue = [];
        crearBarriosModel.rutasVinculadasNuevas = [];
        crearBarriosModel.actualiza = [];
        crearBarriosModel.insert = [];
        that.onResultadoRutasVinculadas(crearBarriosModel);
        $('table#tblRutasVinculadas').hide();
        
    },
    
    buscaRutasMunicipio: function(){   
        var idmunicipio = $('#cmbMunicipio option:selected').val();      
        var data = {
            'idmunicipio': idmunicipio
        };
        that.consultaConsecutivo();
        crearBarriosControl.buscaRutasMunicipio(data, that.onResultadoRutasPorMunicipio);
    },
    
    onResultadoRutasPorMunicipio: function(data){
        
        var divBuscarBarrio = $('select#cmbRuta');
        divBuscarBarrio.empty();
        divBuscarBarrio.append($('<option>').text('Seleccione').val(-1));
                $.each(data.rutas, function (index, ruta) {
                    divBuscarBarrio.append($('<option>').text(ruta.nombre).val(ruta.idruta));
                });
    },
    consultaConsecutivo:function(){
        var idmunicipio=$('#cmbMunicipio option:selected').val();
        var data = {
            'idmunicipio': idmunicipio
        };
        crearBarriosControl.consultarConsecutivo(data,that.onResultadoConsecutivoBarrio);
    },
    onResultadoConsecutivoBarrio:function(data){
        $('#txtCodigo').val(data.consecutivo[0].consecutivo);
    }             
    
};
