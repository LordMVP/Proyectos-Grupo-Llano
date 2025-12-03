var f=$(location).attr('search'); f=f.substr(1);	f=f.split('&');	var formulario; for(var k=0;k<f.length;k++){f[k]=f[k].split("=");f[k][0]==='modulo' ? formulario=f[k][1] : f;}
$(function(){
	inicializarForm();	
	cargarEventos();
	cargarEventosGenerales();
	cargarPeriodo();

	});

var inicializarForm=function(){// lista de campos con algun comportamiento especial
	cconcurr=new contConcurr();
	$('#opNuevo').prop('disabled',true);
	return true;
	}
var cargarEventos=function(){

	$('#per_nombre').on('blur',function(){ // concatena nombre completo
		$(this).val($(this).val().toUpperCase());
		});

	$('#' + formulario).on('submit',function(){// env�o del formulario

	   //alert("Va a grabar");		
	   var argumentos="accion=e";
		var a=new consultaAjax(formulario,true,argumentos);
		var respuesta=a.success(function(response){
			$('#divRespuesta').html(response);
			});	

		return false;	
		});
	//*****************************************************************Botones de Formulario --INICIO
	
	//*****************************************************************Botones de Formulario --FIN	 
	}
var cargarPeriodo=function(){
	var datos='accion=c&cic_ideregistro=' + urlVariables.idereferencia+'&per_ideregistro='+urlVariables.per_ideregistro ;
	var respuesta= new consultaAjax(formulario,false,datos).success(function(response){
		var datosTabla=response.substring(response.indexOf('||->')+4,response.indexOf('<-||'));
		var valuesTabla=datosTabla.split('|__|');
		var	values=valuesTabla[0].split('c_@');
		$('#id_edper').val(values[0]);
		$('#edper_fecinicial').val(values[2]);
		$('#edper_fecfinal').val(values[3]);
		$('#edestado').val(values[6]);
		});
	}
