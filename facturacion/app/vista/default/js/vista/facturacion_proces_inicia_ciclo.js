var f=$(location).attr('search'); f=f.substr(1);	f=f.split('&');	var formulario; for(var k=0;k<f.length;k++){f[k]=f[k].split("=");f[k][0]==='modulo' ? formulario=f[k][1] : f;}
$(function(){
	inicializarForm();	
	cargarEventos();
	cargarEventosGenerales();
	});

var inicializarForm=function(){// campos con algun comportamiento especial
	$('#cic_ideregistro').removeAttr('disabled');
	$('#cic_anosiguiente').attr('disabled',true);
	return true;
	}
var cargarEventos=function(){
	$('#cic_ideregistro').on('change',function(){
		if ($(this).val()!==''){
			$('#cic_anosiguiente').val(+datos_cic_ciclo[+$(this).val()]+1);
			}		
		});
	$('#' + formulario).on('submit',function(){// envío del formulario
		var argumentos='accion=s&cic_anosiguiente=' + $('#cic_anosiguiente').val();
		if (validaFormulario()){
			new consultaAjax(formulario,true,argumentos).success(function(response){			
				$('#divRespuesta').html(response);
				cargarTabla(response,'regConflicto');			
				$('#cic_ideregistro').empty();
				new Combo('ciclo','cic_ideregistro',true,'cerrados');													
				});	
			}			
		return false;
		});
	}


//actualización de dependencias de los registros

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


