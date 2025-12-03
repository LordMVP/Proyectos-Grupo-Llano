var f=$(location).attr('search'); f=f.substr(1);	f=f.split('&');	var formulario; for(var k=0;k<f.length;k++){f[k]=f[k].split("=");f[k][0]==='modulo' ? formulario=f[k][1] : f;}
$(function(){
	inicializarForm();	
	cargarEventos();
	cargarEventosGenerales();
	});

var inicializarForm=function(){// campos con algun comportamiento especial
	$('#cic_ideregistro').removeAttr('disabled');
	return true;
	}
var cargarEventos=function(){
	$('#cic_ideregistro').on('change',function(){
		if ($(this).val()!==''){
			$('#per_ideregistro').empty();
			new Combo('periodo','per_ideregistro',false,$(this).val());	
			}
		else{
			$('#per_ideregistro').empty();
			}		
		});
	$('#' + formulario).on('submit',function(){// env�o del formulario
		var argumentos='accion=s';
		if (validaFormulario()){
			new consultaAjax(formulario,true,argumentos).success(function(response){			
				$('#divRespuesta').html(response);				
				$('#cic_ideregistro').empty();
				new Combo('ciclo','cic_ideregistro',true, 'cipr_cicprograma');
				$('#per_ideregistro').empty();												
				});	
			}			
		return false;
		});
	}


//actualizaci�n de dependencias de los registros

//aqui se cargan los datos al formulario
var validaFormulario=function(){
	if ($('#cic_ideregistro').val()===''){
		$('#divRespuesta').html('Debe seleccionar un ciclo.');
		return false;
		}
	return true;
	}
var datos_cic_ciclo;
var onComboLoad=function(datos,campo){
	var s=$('#' + campo);
	switch(campo){		
		case 'cic_ideregistro':			
			datos_cic_ciclo=datos;
			break;
		}
	}


