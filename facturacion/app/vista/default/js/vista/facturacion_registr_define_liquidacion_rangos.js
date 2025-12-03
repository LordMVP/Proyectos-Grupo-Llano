var f=$(location).attr('search'); f=f.substr(1);	f=f.split('&');	var formulario; for(var k=0;k<f.length;k++){f[k]=f[k].split("=");f[k][0]==='modulo' ? formulario=f[k][1] : f;}
var conformula;
$(function(){
	inicializarForm();	
	cargarEventos();
	cargarEventosGenerales();
	});

var inicializarForm=function(){// lista de campos con algun comportamiento especial
	cconcurr=new contConcurr();
	$('#con_nombre,#raco_formula').attr('readonly',true);
	$('#con_tipcalculo').parents('.campo').hide();
	$('#raco_raninicial,#raco_ranfinal,#raco_valor').attr('onkeypress','decimal(event)');
	$('#conceptosFormulacion').hide();
	cargarConceptoSeleccionado();
	conformula=new ConceptoFormula();
	return true;
	}
var cargarEventos=function(){
	$('#opEditar').on('click',function(){if ($('#uni_concepto').val().trim()===''){alert('Por favor seleccione un registro para poder editarlo.');setTimeout(function(){$('#opCancelar').trigger('click');},20);
			return false;};	cconcurr.br('Yw0K','raco_ranconcept',$('#uni_concepto').val());});
	$('#acAgregar').on('click',function(){
		if (conformula.validar()){
			var formulaHTML=$('#formula').html();
			var blanco=/\s/g;
			formulaHTML=formulaHTML.replace(blanco,'');
			$('#raco_formula').val(formulaHTML);
			}
		});
	$('#raco_accion').on('change',function(){
		if ($(this).val()==="F"){
			$('#conceptosFormulacion').fadeIn();
			$('#raco_formula').attr('disabled',false).parents('.campo').show();
			$('#raco_valor').attr('disabled',true).parents('.campo').hide();
			}
		else{
			$('#conceptosFormulacion').fadeOut();
			$('#raco_formula').attr('disabled',true).parents('.campo').hide();
			$('#raco_valor').attr('disabled',false).parents('.campo').show();
			}	
		});
	$('#' + formulario).on('submit',function(){// envío del formulario
				
		if(!validaFormulario()){
			return false;
			}
		var argumentos="accion=s";
		if($('input[name=Rangos_ide]:checked').val()){
			argumentos='accion=e';
			}
				
		var a=new consultaAjax(formulario,true,argumentos);
		var respuesta=a.success(function(response){
			$('#divRespuesta').html(response);
			cargarRangosConcepto();
			});		
		return false;	
		});
	//*****************************************************************Botones de Formulario --INICIO
	
	//*****************************************************************Botones de Formulario --FIN	 
	}
var fun_funcion_datos;
var onComboLoad=function(datos,campo){
	switch(campo){
		case 'formula_selFun_ideregistro':
			fun_funcion_datos=datos;
			break;		
		}
	}

var buscaConceptoDisponible=function(uni_liquidacion){
	if (!sessionStorage.facturacion_registr_define_liquidacion_conceptos){
		$('#divRespuesta').html("No ha seleccionado ningún concepto. Diríjase a la pestaña de conceptos y elija uno para poder trabajar.");
		return false;
		}
	var argumentos="accion=c&accion_m=concepto_disponible&uni_concepto=" + sessionStorage.facturacion_registr_define_liquidacion_conceptos;
	argumentos+='&uni_liquidacion=' + uni_liquidacion;
	var a=new consultaAjax(formulario,true,argumentos);
		var respuesta=a.success(function(response){
			cargarTabla(response,'conceptoDisponible','checkbox');
			
			var concepindex;
			$('input[name=conceptoDisponible_ide]').on('click',function(){
				if($(this).attr('checked')){					
					conformula.addConcepto($(this).val());
					}
				else{					
					conformula.dropConcepto($(this).val());
					}				
				});
			});
	return true;
	}
var cargarRangosConcepto=function(){
	var argumentos="accion=c&accion_m=rangos_relacion&uni_concepto=" + sessionStorage.facturacion_registr_define_liquidacion_conceptos;
	var a=new consultaAjax(formulario,false,argumentos);
	var respuesta=a.success(function(response){
		//$('#divRespuesta').html(response);
		cargarTabla(response,'Rangos','radio');
		ajustaTabla('Rangos');
		});
	}
var cargarConceptoSeleccionado=function(){
	var argumentos="accion=c&accion_m=concepto_prin&uni_concepto=" + sessionStorage.facturacion_registr_define_liquidacion_conceptos;
	var a=new consultaAjax(formulario,false,argumentos);
	var respuesta=a.success(function(response){
		cargarDatos(response,1);
		if ($('#con_tipcalculo').val()==='V'){
			$('#divRespuesta').html('Este concepto es un valor. No puede ser relacionado ni modificado en este formulario.');
			$('#divFormActions').hide();
			return false;
			}
		if ($('#uni_liquidacion').val()===''){
			$('#divRespuesta').html('Este concepto no se ha vinculado a una liquidación. No se puede procesar.');
			$('#divFormActions').hide();
			return false;
			}
		buscaConceptoDisponible($('#uni_liquidacion').val());
		cargarRangosConcepto();
		});
	}


var validaFormulario=function(){
	if ($('#raco_raninicial').val()===''){
		$('#divRespuesta').html('Tiene que diligenciar un rango inicial.');
		return false;
		}
	if ($('#raco_ranfinal').val()===''){
		$('#divRespuesta').html('Tiene que diligenciar un rango final.');
		return false;
		}
	if ($('#raco_valor').val()==='' && $('#raco_formula').val()===''){
		$('#divRespuesta').html('Tiene que digitar un valor o crear una formula.');
		return false;
		}
	return true;
	}

var cargarRangoSeleccionado=function(rid){
	var argumentos="accion=c&accion_m=rango_seleccionado";
	argumentos+='&raco_ideregistr=' + rid;
	var a=new consultaAjax(formulario,false,argumentos);
	var respuesta=a.success(function(response){
		//$('#divRespuesta').html(response);
		cargarDatos(response);
		if ($('#raco_valor').val()!==''){
			$('#raco_accion').val('V').trigger('change');
			}
		else{
			$('#raco_accion').val('F').trigger('change');
			}		
		});
	}
var ajustaTabla=function(tabla){
	var t=$('#' + tabla);
	switch(tabla){
		case 'Rangos':
			t.find('input[name=Rangos_ide]').on('click',function(){			    
				cargarRangoSeleccionado($('input[name=Rangos_ide]:checked').val());
				});
			break;
		}
	}
var camposFormulario=function(nForm){
	var nForm=(nForm || 0);
	var camposCaso=new Array();
	var formCampos=new Array();
	//----------------------------------- SE REGISTRAN TODOS LOS CAMPOS CON EL MISMO NOMBRE DE LA DB Y EN MISMO ORDEN
	formCampos[0]='\
	,raco_raninicial\
	,raco_ranfinal\
	,raco_valor\
	,raco_formula\
	';
	
	formCampos[1]='\
	codo_ideregistr\
	,uni_concepto\
	,est_concepto\
	,uni_concepto_nombre\
	,con_formula\
	,con_tipcalculo\
	,uni_liquidacion\
	';

	for (var Campo in formCampos){
		var C=formCampos[Campo];
		C=C.split(',');
		for(var k=0;k<C.length;k++) C[k]=C[k].trim();C=C.slice(1);
		camposCaso.push(C);
		}
	
	return camposCaso[nForm];
	}	        	