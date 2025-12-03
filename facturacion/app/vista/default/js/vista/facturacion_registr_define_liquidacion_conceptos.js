var f=$(location).attr('search'); f=f.substr(1);	f=f.split('&');	var formulario; for(var k=0;k<f.length;k++){f[k]=f[k].split("=");f[k][0]==='modulo' ? formulario=f[k][1] : f;}
$(function(){
	inicializarForm();	
	cargarEventos();
	cargarEventosGenerales();
	cargarConcepto();
	});
var inicializarForm=function(){// lista de campos con algun comportamiento especial
	cconcurr=new contConcurr();
	$('#prg_ideregistro').removeAttr('disabled');
	$('#con_nombre').attr('readonly',true);
	$('#con_inivigencia').val(fecha.hoy)
	return true;
	}
var cargarEventos=function(){
	$('#opNuevo').on('click', function(){setTimeout(function(){parent.actualizarDependencias(0)},250);});
	$('#opEditar').on('click',function(){if ($('#uni_concepto').val().trim()===''){alert('Por favor seleccione un registro para poder editarlo.');setTimeout(function(){$('#opCancelar').trigger('click');},20);
		return false;};	cconcurr.br('Yw0K','con_concepto',$('#uni_concepto').val());});
	
	$('#tor_nomtabla').on('change',function(){
		$('#dtor_nomcampo').empty();
		new Combo('dtor_dettaborig','dtor_nomcampo',false,$(this).val());
		});
	$('#con_tipcalculo').on('change',function(){
		if($(this).val()==='F'){
			$('#con_valor').attr('disabled',true);
			}
		else{
			$('#con_valor').removeAttr('disabled');
			}
		});
	$('#' + formulario).on('submit',function(){// env�o del formulario
		var argumentos="accion=s";
		var a=new consultaAjax(formulario,true,argumentos);
		var respuesta=a.success(function(response){
			$('#divRespuesta').html(response);
			cargarConcepto();
			});		
		return false;	
		});
	//*****************************************************************Botones de Formulario --INICIO
	
	//*****************************************************************Botones de Formulario --FIN	 
	}
var eliminarRegistro=function(){
	var idereg=$('input[name=Conceptos_ide]:checked').val();
	var datos='accion=x&uni_concepto=' + idereg;
	var respuesta= new consultaAjax(formulario,false,datos).success(function(response){
		cargarConcepto();
		$('#divRespuesta').html(response);
		});
	}
var consultarConcepto=function(uni_concepto){
	var datos='accion=c&accion_m=con_concepto&uni_concepto=' + uni_concepto;
	var respuesta= new consultaAjax(formulario,false,datos).success(function(response){
		//$('#divRespuesta').html(response);
		cargarDatos(response);
		});
	}

var onCargarDatos=function(){
	unid.refrescar();
	}
	
var cargarConcepto=function(){	
	var datos='accion=c&accion_m=tabla';
	var respuesta= new consultaAjax(formulario,false,datos).success(function(response){
		cargarTabla(response,'Conceptos','radio');
		ajustaTabla();
		sessionStorage.removeItem(formulario);	
		});
	}
var onUnidSeleccion=function(){
	$('#con_nombre,#con_abreviatura').val(arguments[2]);
	}
var ajustaTabla=function(){
	$('input[name=Conceptos_ide]').on('click',function(){
		sessionStorage[formulario]=$(this).val();
		consultarConcepto($(this).val());
		parent.actualizarDependencias(0);		
		});	
	}



//aqui se cargan los datos al formulario

var camposFormulario=function(nForm){
	var nForm=(nForm || 0);
	var camposCaso=new Array();
	var formCampos=new Array();
	//----------------------------------- SE REGISTRAN TODOS LOS CAMPOS CON EL MISMO NOMBRE DE LA DB Y EN MISMO ORDEN
	formCampos[0]='\
	,uni_concepto\
	,est_concepto\
	,con_nombre\
	,con_alias\
	,con_abreviatura\
	,con_tipcalculo\
	,con_operacion\
	,con_preliquidar\
	,con_anticipo\
	,con_pagpriori\
	,con_financiable\
	,prg_ideregisrtro\
	,con_tipregistro\
	,con_inivigencia\
	,con_finvigencia\
	,con_valor\
	,con_estado\
	,tor_nomtabla\
	,dtor_nomcampo\
	';
	
	for (var Campo in formCampos){
		var C=formCampos[Campo];
		C=C.split(',');
		for(var k=0;k<C.length;k++) C[k]=C[k].trim();C=C.slice(1);
		camposCaso.push(C);
		}
	
	return camposCaso[nForm];
	}		        	