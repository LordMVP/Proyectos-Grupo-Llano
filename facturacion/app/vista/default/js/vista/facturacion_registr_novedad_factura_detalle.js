var f=$(location).attr('search');
f=f.substr(1);f=f.split('&');	var formulario; for(var k=0;k<f.length;k++){f[k]=f[k].split("=");f[k][0]==='modulo' ? formulario=f[k][1] : f;}
var dataSolicitudes=[];
$(function(){
	inicializarForm();	
	cargarEventos();
	cargarEventosGenerales();
	cargarDatosIniciales();
	});

var inicializarForm=function(){
	cconcurr=new contConcurr();
	$('#dnov_ideregistr').hide();
        $('#dnov_vlrtotal_model').hide();
        $('#dnov_cantidad,#dnov_vlrunitari,#dnov_vlrtotal,#dnov_vlrtotal_model').val('');   
        this.formatoMoneda('dnov_vlrtotal');        
        this.formatoCantidad('dnov_cantidad');
        this.formatoCantidad('dnov_vlrtotal_model');
	$('#cic_nombre,#per_nombre').prop('readonly',true);
	$('#dnov_cantidad,#dnov_vlrunitari').attr('onkeypress','numerico(event)');
	$('#opNuevo').prop('disabled',true);
	$('#dnov_vlrtotal').on('focus',function(){
		calcularValorTotal();
		});
	$('#dnov_cantidad,#dnov_vlrunitari').on('keyup',function(){
		$('#opCancelar').prop('disabled',true);
		calcularValorTotal();
		});	
	if (!urlVariables.dnov_ideregistr){
		cconcurr.btnModoCrear();
		}
	else{
		cargarDnov();
                mostrarSolicitudesRelacionadas();
		}
	$('#uni_liquidacion').empty();
	new Combo('liquidacion','uni_liquidacion',false,'liquidacion',urlVariables.dsus_ideregistr);
        
        $('#fieldSetNovedadesSolicitudesRadicadas').hide();
        $('#opNuevoNovedad').attr('disabled','disabled'); 
	return true;
	}

var cargarDatosIniciales=function(){		
	$('#nov_ideregistro').val(urlVariables.nov_ideregistro);
	if (urlVariables.cic_ideregistro && urlVariables.per_ideregistro){		
		cargarCicloPeriodo();
		}
	if (urlVariables.dnov_ideregistro){
		$('#dnov_ideregistro').val(urlVariables.dnov_ideregistro);		
		}
	
	}
var cargarEventos=function(){	
	$('#uni_concepto').on('change',function(){
		if ($(this).val()!==''){
			actualizarReglasConcepto($(this).val());			
			}
		      calcularValorTotal();       
		});
	$('#uni_liquidacion').on('change',function(){
		if ($(this).val()==='') return false;
		$('#uni_concepto').empty();
		new Combo('concepto','uni_concepto',true,'V',$(this).val(),'S');
		});
	$('#' + formulario).on('submit',function(){
		if ($('#dnov_vlrtotal,#uni_concepto').val()===''){
			$('#divRespuesta').html('Debe seleccionar un concepto y calcular el valor total antes de guardar.');
			if (!urlVariables.dnov_ideregistr){
				setTimeout(function(){cconcurr.btnModoCrear();},150);
				}
			return false;
			}
		if ($('#dnov_vlrtotal').val()===''){
			$('#divRespuesta').html('Por favor seleccione un concepto y calcule el valor total.');
			setTimeout(function(){inicializarForm()},150);
			return false;
			}
		var idereg=$('#dnov_ideregistr').val();
		var args;
		var accion;
		if(idereg===''){
			args='&accion=s';
			}
		else{
			args="&accion=e&dnov_ideregistr=" + idereg;
			}
		args+='&cic_ideregistro=' + urlVariables.cic_ideregistro;
		args+='&per_ideregistro=' + urlVariables.per_ideregistro;
		args+='&nov_ideregistro=' + urlVariables.nov_ideregistro;
		args+='&dsus_ideregistr=' + urlVariables.dsus_ideregistr;
		new consultaAjax(formulario,true,args).success(function(response){                      
                      let data= JSON.parse(response);                      
		     $('#divRespuesta').html(data.mensaje);
                 switch (data.codigoRespuesta) {
                     case 1 : 
                          $('#opGrabar').attr('disabled','disabled'); 
                          $('#opNuevoNovedad').removeAttr('disabled'); 
                          break; 
                      default:
                           $('#opGrabar').removeAttr('disabled'); 
                           $('#opNuevoNovedad').attr('disabled','disabled'); 
                      } 
                     
			});
		return false;		
		});
         $('#opListarSolicitudes').on('click', mostarSolicitudes );       
         $('#opNuevoNovedad').on('click',nuevaNovedad);        
	};
var nuevaNovedad= function(){
           $(this).attr('disabled','disabled');
           $('#opGrabar').removeAttr('disabled'); 
           $('#dnov_cantidad').val(1);
           $('#uni_concepto').val('');
           $('#dnov_vlrunitari').val('');
           $('#dnov_vlrunitari').val('');
           $('#dnov_ideregistr').val('');
    
} ;       
        
var mostarSolicitudes= function(){
      var args; 
      args = 'accion=c&accion_m=peticiones&dsus_ideregistr='+ urlVariables.dsus_ideregistr;
    new consultaAjax(formulario,true,args).success(function(response){
			cargarTabla(response,'tbl_dnovDetnovedadSolicitudesRadicadas');
                        ajustaTabla('tbl_dnovDetnovedadSolicitudesRadicadas');	
			}); 
    $('#fieldSetNovedadesSolicitudesRadicadas').show();
    
} ;    
var mostrarSolicitudesRelacionadas = function(){
      var args; 
      args = 'accion=c&accion_m=peticionesRelacionadas&dnov_ideregistr='+ urlVariables.dnov_ideregistr + '&dsus_ideregistr=' + urlVariables.dsus_ideregistr;
    new consultaAjax(formulario,true,args).success(function(response){
			if(response && response !=='sinDatos')
                        { 
                        cargarTabla(response,'tbl_dnovDetnovedadSolicitudesRelacionadas');
                        ajustaTabla('tbl_dnovDetnovedadSolicitudesRelacionadas');	
                        }
			});    
    
} ; 

var validaValorUnitario=function (){
     var cantidadAbsoluta  = Math.abs($('#dnov_cantidad').val()) ;     
     if(+($('#dnov_cantidad').val())< 0)
     { $('#dnov_cantidad').focus();
       $('#dnov_cantidad').val(cantidadAbsoluta);
       $('#divRespuesta').html('No se permiten valores Negativos en Cantidad/Volumen ');
			setTimeout(function(){inicializarForm()},150);			
     }
     return cantidadAbsoluta;
 };

 var formatoMoneda= function (nombreSelector){
        $('#' + nombreSelector).inputmask('decimal',
                {'alias': 'numeric',
                    'groupSeparator': ',',
                    'autoGroup': true,
                    'digits': 0,
                    'radixPoint': ".",
                    'digitsOptional': false,
                    'allowMinus': false,
                    'prefix': '$',
                    'placeholder': '0'
                });

    };

var formatoCantidad= function (nombreSelector){
        $('#' + nombreSelector).inputmask('decimal',
                {'alias': 'numeric',
                    'groupSeparator': '',
                    'autoGroup': true,
                    'digits': 3,
                    'radixPoint': ".",
                    'digitsOptional': false,
                    'allowMinus': false,
                    'prefix': '',
                    'placeholder': '0'
                });

    };
    
var depurarCamposNumericos = function (campo) {
        var valor = $('#'
                + campo).val();
        valor = valor.replace(/\./g, "");
        valor = valor.replace(/\,/g, ".");
        valor = valor.replace("$ ", "");
        valor = valor.replace("$", "");
        if (valor == "")
            valor = 0;
        return valor;
 };
var calcularValorTotal=function(){
        var cantidadAbosluta = this.validaValorUnitario();
	var resultado=Math.round(+(cantidadAbosluta) * (+$('#dnov_vlrunitari').val()));        
	$('#dnov_vlrtotal').val(resultado);
        $('#dnov_vlrtotal_model').val(resultado); 
	}
var cargarCicloPeriodo=function(){
	var args="accion=c&accion_m=cicloPeriodo";
	args+='&per_ideregistro=' + urlVariables.per_ideregistro;
	new consultaAjax(formulario,false,args).success(function(response){
		cargarDatos(response,1);
		})
	}
var cargarDnov=function(){
	var args="accion=c&accion_m=cargarDnov";
	args+='&dnov_ideregistr=' + urlVariables.dnov_ideregistr;
	new consultaAjax(formulario,false,args).success(function(response){
		cargarDatos(response);
		});
	}
var actualizarReglasConcepto=function(uni_concepto){
	var valor=cmbConceptoDatos[uni_concepto][1] || false;
	var tipReg=cmbConceptoDatos[uni_concepto][0];
        
	switch(tipReg){
		case 'T':
			if (valor){
				$('#dnov_vlrunitari').val(valor).attr('readonly',true);
				$('#dnov_cantidad').attr('readonly',false);
				
				}
			else{
				$('#dnov_vlrunitari').attr('readonly',false);
				$('#dnov_cantidad').attr('readonly',false);
				$('#dnov_vlrtotal').val('');
				}											
			$('#dnov_vlrtotal').attr('readonly',true);	
			break;
		case 'C':
			if (valor && !urlVariables.dnov_ideregistr){
				$('#dnov_cantidad').val(valor).attr('readonly',true);							
				}
			else{  
				$('#dnov_cantidad').attr('readonly',false);
				}											
			$('#dnov_vlrunitari').val(1).attr('readonly',true);	
			$('#dnov_vlrtotal').attr('readonly',true);
			break;
		case 'U':
			if (valor && !urlVariables.dnov_ideregistr){
				$('#dnov_vlrunitari').val(valor).attr('readonly',true);	
				}
			else{
				$('#dnov_vlrunitari').attr('readonly',false);
				}											
			$('#dnov_cantidad').val(1).attr('readonly',true);
			$('#dnov_vlrtotal').attr('readonly',true);
			break;
		}
	} ;
        
            
var ajustaTabla=function(tabla){
	if ($('#'+tabla).find('td[alt=Vacio]').length===1){return false;}
        var valorTotal = 0 ; 
	switch(tabla){
		case 'tbl_dnovDetnovedadSolicitudesRadicadas':
			$('#'+tabla+' tbody tr').each(function(){				
				
				var ntd=$('<td>');                                
                                var espedit=$(this).find('td').eq(4).after(ntd);                              
				var idereg=$(this).find('td').eq(0).html();
                                 $(this).attr('id-Fila',idereg);
				var bnEditar=$('<button>').attr('type','button')
                                        .attr('id',idereg).html('Relacionar').on('click',
                                            relacionarSolicitud
					).appendTo(ntd);

				});
			break;	
                case 'tbl_dnovDetnovedadSolicitudesRelacionadas':
                        
			$('#'+tabla+ ' tbody tr').each(function(){				
				
				var ntd=$('<td>');
                                var espedit=$(this).find('td').eq(4).after(ntd);				
				var idereg=$(this).find('td').eq(0).html();				
				var bnEditar=$('<button>').attr('type','button').html('Eliminar').on('click',function(){															
				$(this).parent().parent().remove(); 
                                    }).appendTo(ntd);                              	
                                
				});
			break;	        
                        
		}	
	
	}  ;      
        
var relacionarSolicitud= function(){
    var idFila= +$(this).attr('id');
    var tabla = 'tbl_dnovDetnovedadSolicitudesRelacionadas';
    
    var FilaDuplicada = false ;
    var Fila = 0; 
    $('#'+tabla+ ' tbody tr').each(function(){
        Fila = +$(this).attr('id-Fila') ;        
        
         if (idFila === Fila)
         {  FilaDuplicada = true ; 
           return ; 
        }         
                                        
    }) ;
    
    if (FilaDuplicada===true)
    { $('#divRespuesta').html('La solicitud ya estaba relacionada') ;   
      return false;
    }
    var filaReplicar = $(this).parent().parent();
    var objetodestino = $('#'+tabla); 
    var ntd=$('<td>');
    $(filaReplicar).find('td').eq(5).html('');
    $(filaReplicar).find('td').eq(4).after(ntd);    
    var bnEditar=$('<button>').attr('type','button').html('Eliminar').on('click',function(){
                                var filarelacionada = $(this).parent().parent();
				$(filarelacionada).remove(); 
                               }).appendTo(ntd);                              	                             				
    $(filaReplicar).appendTo($(objetodestino));   
    dataSolicitudes.push(idFila);   
    $('#dataSolicitudes').val(dataSolicitudes);
    
} ;

//aqui se cargan los datos al formulario
var onCargarDatos=function(c){
	switch(c){
		case 0:
			und_tipliquidacion.refrescar();
			$('#uni_concepto').empty();
			new Combo('concepto','uni_concepto',true,'V',$('#uni_liquidacion').val(),'S');
			break;
		}	
	}
var onCargarBusqueda=function(){}
var onCargarCuadroBusqueda=function(s){}
var cmbConceptoDatos=null;
var onUnidSeleccion=function(a,b){}
var onComboLoad=function(a,b){
	switch(b){
		case 'uni_concepto':
			cmbConceptoDatos=a;
			break;
		}
	}
var camposFormulario=function(nForm){
	var nForm=(nForm || 0);
	var camposCaso=new Array();
	var formCampos=new Array();
	//----------------------------------- SE REGISTRAN TODOS LOS CAMPOS CON EL MISMO NOMBRE DE LA DB Y EN MISMO ORDEN
	formCampos[0]='\
	,dnov_ideregistr\
	,cic_nombre\
	,per_nombre\
	,uni_liquidacion\
	,uni_concepto\
	,dnov_cantidad\
	,dnov_vlrunitari\
	,dnov_vlrtotal\
	';
	formCampos[1]='\
	,cic_nombre\
	,per_nombre\
	';
	for (var Campo in formCampos){
		var C=formCampos[Campo];
		C=C.split(',');
		for(var k=0;k<C.length;k++) C[k]=C[k].trim();C=C.slice(1);
		camposCaso.push(C);
		}	
	return camposCaso[nForm];
	}
