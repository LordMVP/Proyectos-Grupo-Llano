var f=$(location).attr('search'); f=f.substr(1);	f=f.split('&');	var formulario; for(var k=0;k<f.length;k++){f[k]=f[k].split("=");f[k][0]==='modulo' ? formulario=f[k][1] : f;}
$(function(){
	inicializarForm();	
	cargarEventos();
	cargarEventosGenerales();
	});

var inicializarForm=function(){// campos con algun comportamiento especial
	$('#cic_ideregistro,#fun_ideregistro').removeAttr('disabled');
	return true;
	}
var cargarEventos=function(){
	$('#cic_ideregistro').on('change',function(){
		$('#per_ideregistro').empty();
		new Combo('periodo','per_ideregistro',false,$(this).val());
		});
	$('#' + formulario).on('submit',function(){// envío del formulario
		var argumentos='accion=s&per_ideregistro=' + $('#per_ideregistro').val();
		if (validaFormulario()){
			new consultaAjax(formulario,true,argumentos).success(function(response){			
				//$('#divRespuesta').html(response);
				cargarTabla(response,'suscripciones');
				});	
			}			
		return false;
		});
	}


//actualización de dependencias de los registros

//aqui se cargan los datos al formulario
var validaFormulario=function(){
	if ($('#uni_tipsuscripc').val()===''){
		$('#divRespuesta').html('Debe seleccionar un tipo de suscripción.');
		return false;
		}
	if ($('#cic_ideregistro').val()===''){
		$('#divRespuesta').html('Debe seleccionar un ciclo.');
		return false;
		}
	if ($('#per_ideregistro').val()==='' && $('#cic_ideregistro').val()!=='TODO'){
		$('#divRespuesta').html('El ciclo seleccionado no tiene un periodo activo. No puede continuar.');
		return false;
		}
	if ($('#fun_ideregistro').val()===''){
		$('#divRespuesta').html('Debe seleccionar una funcion para procesar.');
		return false;
		}
	return true;
	}
var onComboLoad=function(datos,campo){
	var s=$('#' + campo);
	switch(campo){
		case 'uni_tipsuscripc':
			s.find('option[value=""]').after('<option value="TODO">Todos</option>');
			break;
		case 'cic_ideregistro':
			s.find('option[value=""]').after('<option value="TODO">Todos</option>');
			break;
		}
	}


