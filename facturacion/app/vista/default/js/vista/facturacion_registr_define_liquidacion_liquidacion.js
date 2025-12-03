var f=$(location).attr('search'); f=f.substr(1);	f=f.split('&');	var formulario; for(var k=0;k<f.length;k++){f[k]=f[k].split("=");f[k][0]==='modulo' ? formulario=f[k][1] : f;}
$(function(){
	inicializarForm();	
	cargarEventos();
	cargarEventosGenerales();
	});

var inicializarForm=function(){// lista de campos con algun comportamiento especial
	cconcurr=new contConcurr();
	return true;
	}
var cargarEventos=function(){
	$('#uni_documento').on('change',function(){
		$('#uni_tipdocument').empty();
		new Combo('tipo_documento','uni_tipdocument',false,$(this).val());
		});
	$('#opEditar').on('click',function(){if ($('#uni_concepto').val().trim()===''){alert('Por favor seleccione un registro para poder editarlo.');setTimeout(function(){$('#opCancelar').trigger('click');},20);
			return false;};	cconcurr.br('Yw0K','coli_conliquida',$('#uni_concepto').val());});

	$('#borraConc').on('click',function(){
		quitarConcepto();
		});
	$('#' + formulario).on('submit',function(){// envío del forulario
		var argumentos="accion=s";		
		var a=new consultaAjax(formulario,true,argumentos);		
		var respuesta=a.success(function(response){			
			$('#divRespuesta').html(response);
			cargarLiquidacionesConcepto();
			});		
		return false;	
		});
	//*****************************************************************Botones de Formulario --INICIO
	
	//*****************************************************************Botones de Formulario --FIN	 
	}

var onUnidSeleccion=function(uni_liquidacion,est_liquidacion,c){
	var est_liquidacion=est_liquidacion.trim() + "";
	switch (est_liquidacion){
		case "3":
			cargarLiquidacionesConcepto();	
			new Combo('documento','uni_documento');
			new Combo('venclasific','liq_venclasific');
			var argumentos="accion=c&accion_m=liq_liquidacion&uni_liquidacion=" + $('#uni_liquidacion').val();
			var a=new consultaAjax(formulario,false,argumentos);
			var respuesta=a.success(function(response){
				cargarDatos(response,1);		
				});
			break;
		case "6":
			verificarConceptoExiste();					
			break;
		}
	
	}
var verificarConceptoExiste=function(){
	var unicon=$('#uni_concepto').val();
	var uniliq=$('#uni_liquidacion').val();
	if (!unicon || !uniliq){
		$('#divRespuesta').html('Debe seleccionar una Liquidación y un Concepto para relacionarlos');
		return false;
		}
	var argumentos="accion=c&accion_m=ideconcliq&uni_concepto=" + unicon + "&uni_liquidacion=" + uniliq;
	//alert(argumentos);
	new consultaAjax(formulario,false,argumentos).success(function(response){
		//var coliId=response.substring(response.indexOf('>')+1,response.indexOf('<'));
		//alert(response.trim());
		if (response.trim()!=='sinDatos'){
			$('#divRespuesta').html('El concepto que ha seleccionado ya se encuentra registrado en esta liquidación.');
			}
		});	
	}
var cargarLiquidacionesConcepto=function(){
	var argumentos="accion=c&accion_m=concepto_liquidacion&uni_liquidacion=" + $('#uni_liquidacion').val();
	var a=new consultaAjax(formulario,false,argumentos);
	var respuesta=a.success(function(response){
		cargarTabla(response,'Liqs','radio');		
		});
	}
var quitarConcepto=function(){
	var unicon=$("input[name='Liqs_ide']:checked").val();
	if (!unicon){
		$('#divRespuesta').html('Debe seleccionar un concepto de la siguiente lista.');
		return false;
		}
	var argumentos="accion=x&coli_ideregistr=" + unicon;
	var a=new consultaAjax(formulario,false,argumentos);
	var respuesta=a.success(function(response){
		cargarLiquidacionesConcepto();	
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
	,con_valor\
	,con_formula\
	';
	
	formCampos[1]='\
	,uni_documento\
	,uni_tipdocument\
	,liq_inivigencia\
	,liq_finvigencia\
	,liq_venclasific\
	,liq_estado\
	,liq_historico\
	';
	
	for (var Campo in formCampos){
		var C=formCampos[Campo];
		C=C.split(',');
		for(var k=0;k<C.length;k++) C[k]=C[k].trim();C=C.slice(1);
		camposCaso.push(C);
		}
	
	return camposCaso[nForm];
	}
    	
		        	