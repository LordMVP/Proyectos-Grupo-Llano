var f=$(location).attr('search'); f=f.substr(1);	f=f.split('&');	var formulario; for(var k=0;k<f.length;k++){f[k]=f[k].split("=");f[k][0]==='modulo' ? formulario=f[k][1] : f;}
var ctasGraba='';
$(function(){
	inicializarForm();	
	cargarEventos();
	cargarEventosGenerales();
	});

var inicializarForm=function(){// lista de campos con algun comportamiento especial
	cconcurr=new contConcurr();
	cargarConceptoSeleccionado();
	if($('#uni_concepto_nombre')) cargarCuentas();
  	$('#opGrabar').attr('disabled', true);
  	$('#opEliminar').attr('disabled', true);
  	$('#btAdicionar').attr('disabled', true);
	return true;
	}
	
var cargarEventos=function(){	
	$('#opNuevo').on('click',function(){cargarConceptoSeleccionado();cargarCuentas();});
	$('#opEditar').on('click',function(){if ($('#uni_concepto').val().trim()===''){alert('Por favor seleccione un registro para poder editarlo.');setTimeout(function(){$('#opCancelar').trigger('click');},20);
			return false;};	cconcurr.br('Yw0K','codo_condocumen',$('#uni_concepto').val());});
	$('#getContab').on('click',function(){window.open('programa.php?modulo=facturacion_registr_define_liquidacion_presupuesto','_self')})
	$('#getArea').on('click',function(){window.open('programa.php?modulo=facturacion_registr_define_liquidacion_contabarea','_self')});
	$('#getCco').on('click',function(){window.open('programa.php?modulo=facturacion_registr_define_liquidacion_contabccto','_self')});
	$('#getPres').on('click',function(){window.open('programa.php?modulo=facturacion_registr_define_liquidacion_presupuesto','_self')}).css({'background' : '#CADCFE','color' : '#0066CC'});;
	//cargarCuentas();
    $('#btAdicionar').on('click',function(){
		/*if ($('#ndebcre').val()===' '){
			$("#divRespuesta").html('Debe Seleccionar Debito o Credito.');
			return false;
			}*/
			// numero elementos de la tabla var n = $('tr:last td', $("#CuentaSelect")).length;
			
		var t1=$('<tr>').html('<td>'+ selId +'</td><td>'+ selTarCodi +'</td><td>'+ selCuenta +'</td><td><input type="text" value="100" size="3"/></td>');
		$("#divRespuesta").html('Selecciono Cuenta.'+ selCuenta);
		$('#CuentaSelect').append(t1);
		$('#inputdeb').attr('onkeypress','decimal(event)');
      	if(selId===undefined)
      	ReiniciarCtas();
		bloqueaInput(true);
		});
			
    $('#btConfirma').on('click',function(){
    	(ctasGrabar()) ? $('#opGrabar').attr('disabled', false):$('#opGrabar').attr('disabled', true);
		});
    $('#btReinicia').on('click',function(){
    	ReiniciarCtas();
    	bloqueaInput(false);	
    	//alert('Cuentas:'+ctasCodo);
		});		
									
	$('#uni_documento').on('change',function(){
		$('#uni_liquidacion').empty();
		new Combo('liquidacion','uni_liquidacion',false, $(this).val());
		});
	
	$('#uni_liquidacion').on('change',function(){
			// al seleccionar debito o credito prende los botones y bloquea los campos delformulari
		if ($('#uni_liquidacion').val() && $('#uni_concepto_nombre').val()){	
		    //alert('Cuentas:'+$('#uni_liquidacion').val()+':');
			$('#btConfirma').attr('disabled', false);	
			$('#btAdicionar').attr('disabled', false);
			ReiniciarCtas();			
			}
		else {
			$("#divRespuesta").html('Por favor complete la información antes de seleccionar cuentas!!');
			$('#btConfirma').attr('disabled', true);	
	    	$('#btAdicionar').attr('disabled', true);
			$('#opNuevo').attr('disabled', true);
	    	$('#opEliminar').attr('disabled', true);	
			return false;	
			}
		});	

	$('#' + formulario).on('submit',function(){// envío del formulario
		var argumentos="&accion=s";
		var a;
		var accion='s';
		argumentos+='&est_tipdocument=' + datosComboTipoDocumento[+$('#uni_tipdocument').val()];
		argumentos+='&est_liquidacion=' + datosComboLiquidacion[+$('#uni_liquidacion').val()];
		argumentos+='&emp_ideregistro=' + $('#emp_ideregistro').val();
		argumentos+='&uni_liquidacion=' + $('#uni_liquidacion').val();
		argumentos+='&uni_tipdocument=' + $('#uni_tipdocument').val();
		argumentos+='&ctasGraba=' + ctasGraba;
		alert(argumentos);
		//return false;
		var a=new consultaAjax(formulario,true,argumentos);
		var respuesta=a.success(function(response){
		if (accion==='s') {
		 	//$('#opGrabar').attr('disabled', true);
	 		cargarCuentas();
			}
		$('#divRespuesta').html(response);	
			});		
		return false;	
		});
		
		
	//*****************************************************************Botones de Formulario --INICIO
	
	//*****************************************************************Botones de Formulario --FIN	 
	}

var cargarConceptoSeleccionado=function(){
	var argumentos="accion=c&accion_m=concepto_prin&uni_concepto=" + sessionStorage.facturacion_registr_define_liquidacion_conceptos;
	//alert(argumentos);
	var a=new consultaAjax(formulario,false,argumentos);
	var respuesta=a.success(function(response){
		//$('#divRespuesta').html(response);
		cargarDatos(response,1);
		});
		
	}
var cargarCuentas=function(){
	var datos='accion=c&accion_m=Cuentas&cue_ideregistro=1' ;
	var respuesta= new consultaAjax(formulario,false,datos).success(function(response){
		//$('#divRespuesta').html(response);
		cargarTabla(response,'Cuentas','radio');
		ajustaTabla();
		});

		//datos='accion=c&accion_m=tablaDoc&codo_ideregistr=1' ;
		if 	(sessionStorage.facturacion_registr_define_liquidacion_conceptos)	{
			datos='accion=c&accion_m=tablaDoc&uni_concepto='+sessionStorage.facturacion_registr_define_liquidacion_conceptos;
			respuesta= new consultaAjax(formulario,false,datos).success(function(response){
			//$('#divRespuesta').html(response);
			cargarTabla(response,'tablaDoc');
			ajustaTabla2();
		});
		$("#divRespuesta").html('Por favor complete la información antes de seleccionar cuentas!!');
		}
		else
			$("#divRespuesta").html('Para accesar esta opcion debe Seleccionar un Concepto!!');
	}
var selCuenta;
var selId;
var selTarCodi
var ajustaTabla=function(){
	$('#Cuentas').find('tr').each(function(){
		var k=0;
		$(this).find('td').each(function(){
			switch(k){
				case 0:
					var jRadio=$(this).find('input').map(function(){return this;});
					$(jRadio).on('click',function(){
						var contColumna=0;
						var abuelo=$(this).parent().parent();
						$(abuelo).find('td').each(function(){							
							if(contColumna===3){
								selCuenta=$(this).html();
								}
							if(contColumna===2){
								selTarCodi=$(this).html();
								}								
							if(contColumna===1){
								selId=$(this).html();
								}
							contColumna++;							
							});												
						//buscaConceptos($(this).val());
						});
					break;

				}
			k++;
			})
		});
	}

var ajustaTabla2=function(){
	$('#tablaDoc').find('tr').each(function(){
		var k=0;
		$(this).find('td').each(function(){
			switch(k){
				case 0:
					var jRadio=$(this).find('input').map(function(){return this;});
					$(jRadio).on('click',function(){
						});
					break;
				

				}
			k++;
			})
		});
	}	

var onCargarDatos=function(response){
	con_unidad.refrescar();
	}
var onUnidSeleccion=function(){
	$('#uni_tipdocument').empty();
	new Combo('tipo_documento','uni_tipdocument',false, arguments[0]);
	}
var datosComboTipoDocumento,datosComboLiquidacion;
var onComboLoad=function(){
	if(arguments[1]==='uni_tipdocument'){
		var datos=arguments[0];
		datosComboTipoDocumento=datos;
		$('#uni_liquidacion').empty();
		new Combo('liquidacion','uni_liquidacion',false, $('#uni_documento').val());
		}
	if(arguments[1]==='uni_liquidacion'){
		var datos=arguments[0];
		datosComboLiquidacion=datos;
		}
	}
	

var ctasGrabar=function(){
    ctasGraba="";
	var totalDeb = 0,msgError="";    
	$('#CuentaSelect tr').each(function () {
		var pk = $(this).find("td").eq(0).html();
		if (!isNaN(pk)){
			var cTar = $(this).find("td").eq(1).html();	
			var cPor = $($($(this).find("td").eq(3)).find('input')[0]).val();			
			if (cPor<1 || cPor>100){
			    msgError="Hay porcentajes fuera de Rango..";
				}
			if($(this).find("td").eq(2).html()){
				totalDeb+=+cPor;
				ctasGraba+=":"+pk+';NULL;'+cTar+';0;' + cPor;
				}			
			}
		});
	if(totalDeb!=100){
        msgError+="...Distribución de cuentas Diferentes al 100%";	
		}
	$('#divRespuesta').html('*TOTAL Cuentas:'+totalDeb+', '+msgError);	
	if(msgError==="")
	   return true;
	else
	   return false;
	}
var ReiniciarCtas=function(){
	$('#CuentaSelect').find("tbody").empty();
	}	
var bloqueaInput=function(opcion){
	//var c=camposFormulario();
	$('#uni_liquidacion').attr("disabled",opcion);
	$('#uni_tipdocument').attr("disabled",opcion);				

	}		

var camposFormulario=function(nForm){
	var nForm=(nForm || 0);
	var camposCaso=new Array();
	var formCampos=new Array();
	//----------------------------------- SE REGISTRAN TODOS LOS CAMPOS CON EL MISMO NOMBRE DE LA DB Y EN MISMO ORDEN
	formCampos[0]='\
	codo_ideregistr\
	,uni_concepto\
	,est_concepto\
	,uni_concepto_nombre\
	,emp_ideregistro\
	,uni_documento\
	,uni_tipdocument\
	,cue_idedebito\
	,cue_tardebito\
	,cue_idecredito\
	,codo_porcentaje\
	,cue_tarcredito\
	,uni_liquidacion\
	,est_documento\
	,est_tipdocument\
	,est_liquidacion\
	';
	
	formCampos[1]='\
	codo_ideregistr\
	,uni_concepto\
	,est_concepto\
	,uni_concepto_nombre\
	';
	
	for (var Campo in formCampos){
		var C=formCampos[Campo];
		C=C.split(',');
		for(var k=0;k<C.length;k++) C[k]=C[k].trim();C=C.slice(1);
		camposCaso.push(C);
		}
	
	return camposCaso[nForm];
	}
	