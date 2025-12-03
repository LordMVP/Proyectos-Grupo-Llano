var f=$(location).attr('search'); f=f.substr(1);	f=f.split('&');	var formulario; for(var k=0;k<f.length;k++){f[k]=f[k].split("=");f[k][0]==='modulo' ? formulario=f[k][1] : f;}
var nomempresa='';
$(function(){
	//***************************************************************** Reglas de los campos -- INICIO
	//Almacpen de campos que necesiten un comportamiento particular
	inicializarForm();	
	//***************************************************************** Reglas de los campos -- FIN	
	//*****************************************************************Eventos de Formulario --INICIO	
	
	cargarEventos();
	cargarEventosGenerales();
	cargarLiquidacion();
	//*****************************************************************Eventos de Formulario --INICIO FIN    
	});

var inicializarForm=function(){
	$('#opNuevo').prop('disabled',true);
	cconcurr=new contConcurr();// OJO desactiva o quita el boton de grabar esta OK??
	$('#cic_ideregistro').val(urlVariables.idereferencia);
	cargarEmpresa();
	//alert($('#empresa_nom').val());	
	return true;
	}
	
var cargarEventos=function(){	

	$('#' + formulario).on('submit',function(){// envío del formulario
		var argumentos="accion=s&cic_ideregistro=" + $('#cic_ideregistro').val() + "&emp_ideregistro=" + $('#emp_ideregistro').val();
		var a=new consultaAjax(formulario,true,argumentos);
		var respuesta=a.success(function(response){
			$('#divRespuesta').html(response);
			cargarLiquidacion();
			});		
		return false;	
		});
	}

var cargarLiquidacion=function(){
	var datos='accion=c&accion_m=relacion&cic_ideregistro=' + urlVariables.idereferencia;
	var respuesta= new consultaAjax(formulario,false,datos).success(function(response){
		//alert(response);
		cargarTabla(response,'EmpresasRelacionadas');
		ajustaTabla();
		});
	}
var cargarEmpresa=function(){
	var datos='accion=c&accion_m=empresa&empresa_sevemp=' + $('#emp_ideregistro').val();
	var respuesta= new consultaAjax(formulario,false,datos).success(function(response){
		var resp=response.substring(response.indexOf("||->")+4,response.indexOf("<-||"));//response.indexOf("<-||");//,response.indexOf("<-||");
		$('#empresa_nom').val(resp);
		});
	}	
//aqui se cargan los datos al formulario
var ajustaTabla=function(){
	$('#EmpresasRelacionadas').find('tr').each(function(){
			var pk=$(this).find("td").eq(0).html();
		    $(this).find('td').eq(2).each(function(){
	    	    var iRetira=$('<button type="button">Retirar</button>').attr('id','retira_' + pk);
				iRetira=iRetira.on('click',function(){
					valida_dsus(pk);	
					});
				$(this).html('');
	    		$(this).append(iRetira);
			});
		});
	}

var valida_dsus=function(pk){
	var datos='accion=c&accion_m=dsus_detsuscrip&emp_ideregistro=' + $('#emp_ideregistro').val()+'&cic_ideregistro='+urlVariables.idereferencia;
	var respuesta= new consultaAjax(formulario,false,datos).success(function(response){
		//alert(response);
			if (response.trim()!=="sinDatos") {
				$('#divRespuesta').html('No puede eliminar al registro....Existe una suscripcion relacionada');
				}
			else {
				eliminar_ciem(pk);
				}
		});
}
var eliminar_ciem=function(pk){
	var datos='accion=x&accion_m=ciem_cicempresa&ciem_ideregistr=' + pk;
	var respuesta= new consultaAjax(formulario,false,datos).success(function(response){
		$('#divRespuesta').html(response);
		cargarLiquidacion();
		});
}	
var camposFormulario=function(nForm){
	var nForm=(nForm || 0);
	var camposCaso=new Array();
	var formCampos=new Array();
	//----------------------------------- SE REGISTRAN TODOS LOS CAMPOS CON EL MISMO NOMBRE DE LA DB Y EN MISMO ORDEN

	formCampos[0]='\
	,cic_ideregistro\
	,emp_ideregistro\
	,ciem_ideregistr\
	,usu_ideregistro\
	';

	for (var Campo in formCampos){
		var C=formCampos[Campo];
		C=C.split(',');
		for(var k=0;k<C.length;k++) C[k]=C[k].trim();C=C.slice(1);
		camposCaso.push(C);
		}
	
	return camposCaso[nForm];
	}	        	