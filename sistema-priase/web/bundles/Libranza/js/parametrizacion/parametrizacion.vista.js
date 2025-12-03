var that = null;
var parametrizacionVista = {
    init: function () {
        that = parametrizacionVista;
        that.consultarFunciones();
        that.consultarFormularios();
        __dom.configurarCalendario('txtFechaFin, #txtFechaInicio');
        $('#btnGrabar').on('click', that.guardarVariables);
        $('#btnCancelar').on('click', that.cancelarOperacion);
        $('#cmbFormulario').on('change', that.consultarVariables);
        $('#btnAgregarVariable').on('click', that.agregarVariables);
        $('#btnAgregarFormulario').on('click', that.abrirDialogoFormulario);
        $('#cmbProductoFinanciero').on('change', that.consultarFormularios);
        
    },
    consultarFormularios: function() {
      var _this = $('#cmbProductoFinanciero');
      if(_this.val() !== '-1' && _this.val()){
        var infoEnviar = {idproducto: _this.val()};
        parametrizacionControl.consultarFormularioProducto(infoEnviar, function(data){
          if(data.codigoRespuesta === 1 && data.datos.length > 0){
            $('#cmbFormulario').val(data.datos[0].idformulario).change();
          }else{
            $('#cmbFormulario').val('-1');
          }
        });
      }
    },
    consultarFunciones: function(){
      parametrizacionControl.consultarFunciones(function(data){
        parametrizacionModel.funciones = data.funciones;
        parametrizacionModel.variables = data.variables;
      });
    },
    consultarVariables: function(){
      var _this = $(this).val();
      if(_this && _this !== '-1'){        
        parametrizacionControl.consultarVariables({idformulario: _this}, that.onConsultarVariablesCompleto);
      }else{
        $('#tblVariables').empty();
      }
    },
    onConsultarVariablesCompleto: function(data){
      if(data.codigoRespuesta === 1 && data.datos.length > 0){
        var tbl = fillTable('tblVariables', formatoVariables, data.datos, 'Variables parametrizadas');
        tbl.find('input:button').css({'width': '8vw'}).on('click', that.eliminarFila);
      }else{
        $('#tblVariables').empty();
      }
    },
    abrirDialogoFormulario: function(){
        that.dialogoActual = $('#divDialogoFormulario').dialog({
           modal: true,
           width: '850px',
           title: 'Nuevo Formulario',
           buttons: {
               'Guardar': that.guardarFormulario,
               'Cancelar': function(){
                   that.dialogoActual.dialog('close');
               }
           }
        });
    },
    guardarFormulario: function(){
      var div = $('#divDialogoFormulario');
      var nombre = div.find('#txtFormularioCrear').val();
      var inicio = div.find('#txtFechaInicio').val();
      var fin = div.find('#txtFechaFin').val();
      if(nombre.trim() === '' || inicio.trim() === '' || fin.trim() === ''){
          $('#spanMensaje').text('Toda la información es obligatoria');
      }else{
          var infoEnviar = {
              fechafinal: fin,
              nombre: nombre,
              fechainicial: inicio
          };
          $('#cmbFormulario').append( $('<option>').text(nombre));
          parametrizacionControl.guardarFormulario(infoEnviar, that.guardarCompleto);
      }
    },
    guardarCompleto: function(data){
        if(data.codigoRespuesta === 1){
            //that.consultarFormularios();
            $('#cmbFormulario').find('option:last').attr('value', data.datos);
            that.dialogoActual.dialog('close');
        }else{
            $('#spanMensaje').text(data.mensaje);
        }
    },
    agregarVariables: function(data){
      var idformulario = $('#cmbFormulario').val();
      var idproducto = $('#cmbProductoFinanciero').val();
      if(!idformulario || idformulario === '-1' || !idproducto  || idproducto === '-1'){
        __dom.lanzarAlerta('Debe seleccionar el producto financiero y un formulario', 'Atención');
        return;
      }
      var head = $('<thead><tr><th>Variable</th><th>Tipo</th><th>Función</th><th>Eliminar</th></tr></thead><tbody></tbody>');
      var tr = $('<tr data-objeto="nuevo"><td><select class="cmbVariables tblCmb"></select></td><td><select class="tblCmb"><option value="F">Función</option><option value="I">Caja de texto</option></select></td><td><select class="tblCmb funciones" ></select></td><td><input type="button" style="width: 8vw" class="tblBtn" value="Eliminar"></td></tr>');
      var tbl = $('#tblVariables');
      if(tbl.find('tr').length === 0){
        tbl.append(head);
      }
      tbl.find('tbody').append(tr);
      tr.find('select, input:text').css({'width': '20vw'});
      tr.find('input:button').on('click', that.eliminarFila);
      __dom.llenarCombo(tr.find('select.funciones'), parametrizacionModel.funciones, 'idfuncion', 'descripcion');
      __dom.llenarCombo(tr.find('select.cmbVariables'), parametrizacionModel.variables, 'idunidad', 'nombre');
    },
    eliminarFila: function(){
      var _this = $(this);
      var tr = $(_this.parents('tr')[0]);
      var tbl = $(tr.parents('table')[0]);
      if(tr.find('select').length === 0){
        var idform = $('#cmbFormulario').val();
        parametrizacionModel.variablesEnviar.push({estado: 'E', idregistro: _this.attr('data-id')});
      }
      tr.remove();
      if(tbl.find('tr').length <= 0){
        tbl.empty();
      }
    },
    guardarVariables: function(){
      var errores = 0;
      var mensaje = '';
      var tbl = $('#tblVariables tbody tr');
      var idformulario = $('#cmbFormulario').val();
      var idproducto = $('#cmbProductoFinanciero').val();
      if(!idformulario || idformulario === '-1' || !idproducto  || idproducto === '-1' || tbl.length === 0){
        __dom.lanzarAlerta('Todos los campos son obligatorios y debe agregar variables', 'Atención');
        return;
      }

      for(var i = 0; i < tbl.length; i++){
        var tr = $(tbl[i]);
        if(tr.find('select').length > 0){
          var idvariable = tr.find('td').eq(0).find('select').val();
          var idfuncion = tr.find('td').eq(2).find('select').val();
          if(idvariable && idvariable !== '-1' && idfuncion && idfuncion !== '-1'){
          parametrizacionModel.variablesEnviar.push({
            estado: 'A',
            idvariable: idvariable,
            tipo: tr.find('td').eq(1).find('select').val(),
            idfuncion: idfuncion
          });
        }else{
          errores++;
          mensaje += 'Hay problemas en la <b> fila '+ (i+1) + ' </b>  todos los campos son obligatorios <br/>';
        }
        }
        
      }
      if(errores === 0){
      var infoEnviar = {
        idproductofinanciero: idproducto,
        idformulario: idformulario,
        variables: parametrizacionModel.variablesEnviar
      };
      parametrizacionControl.guardarVariables(infoEnviar, that.guardarParametrizacionCompleto);
    }else{
      __dom.lanzarAlerta(mensaje, __app.mensajes.atecion);
    }
    },
    guardarParametrizacionCompleto: function(data){
      var fx = function(){ window.location.reload(); };
      __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion, fx, null, fx);
    },
    
    
    cancelarOperacion: function(){
      if($('#tblVariables tbody tr').length > 0){
        __dom.lanzarAlerta('Se borrará toda la información cargada ¿Desea continuar?', 'Atención',
        function(){location.reload()}, true);
      } 
    },
    tipoVariable: function(value){
      if(value === 'F'){
        return 'Función';
      }else if( value === 'I'){
        return 'Caja de texto';
      }
    }
};
parametrizacionVista.init();