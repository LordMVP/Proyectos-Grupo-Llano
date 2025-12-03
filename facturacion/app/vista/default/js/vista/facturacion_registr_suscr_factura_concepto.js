var f=$(location).attr('search'); f=f.substr(1);	f=f.split('&');	var formulario; for(var k=0;k<f.length;k++){f[k]=f[k].split("=");f[k][0]==='modulo' ? formulario=f[k][1] : f;}
$(function(){
	inicializarForm();	
	cargarEventos();
	cargarEventosGenerales();
	cargarSuscripcion();
	});
var inicializarForm=function(){// lista de campos con algun comportamiento especial
	cconcurr=new contConcurr();
	$('#uni_concepto,#con_tipregistro').attr('disabled',true);
	$('#cosu_vlrunitari,#cosu_cantidad').attr('onkeypress','decimal(event)');
	$('#cosu_vlrtotal').attr('readonly',true).on('click',function(){
		if (!isNaN($('#cosu_vlrunitario,#cosu_cantidad').val()) && $('#cosu_vlrunitario,#cosu_cantidad').val().length>0){
			$('#cosu_vlrtotal').val(+($('#cosu_vlrunitari').val()) * (+($('#cosu_cantidad').val())));
			}		
		});
	$('#cosu_fecinicio').val(fecha.hoy);
	return true;
	}
var cargarEventos=function(){
	$('#opNuevo').on('click',function(){
		cargarSuscripcion();
		});
	$('#opEditar').on('click',function(){if ($('#dsus_ideregistr').val().trim()===''){alert('Por favor seleccione un registro para poder editarlo.');setTimeout(function(){$('#opCancelar').trigger('click');},20);
			return false;};	cconcurr.br('Yw0K','cosu_consuscrip',$('#dsus_ideregistr').val());});

	$('#fac_ideregistro').on('change',function(){
		cargarConcepto();
		});
	$('#' + formulario).on('submit',function(){// envío del formulario
		var argumentos="accion=s";
		argumentos+='&dsus_ideregistr=' + $('#dsus_ideregistr').val();
		argumentos+='&uni_concepto=' + $('#uni_concepto').val();

		var a=new consultaAjax(formulario,true,argumentos);
		var respuesta=a.success(function(response){
			$('#divRespuesta').html(response);
			cargarConceptoRelacion();
			});		
		return false;	
		});
	//*****************************************************************Botones de Formulario --INICIO
	
	//*****************************************************************Botones de Formulario --FIN	 
	}
var cargarSuscripcion=function(){	
	var dsus_ideregistr=sessionStorage.facturacion_registr_suscr_factura_suscripcion;
	if (!dsus_ideregistr){
		$('#divRespuesta').html('Debe seleccionar la pestaña de suscripciones y seleccionar una de la tabla inferior.');
		return false;
		}
	$('#divRespuesta').hide()
	var datos='accion=c&accion_m=suscripcion';
	datos+='&dsus_ideregistr=' + dsus_ideregistr;
	var respuesta= new consultaAjax(formulario,false,datos).success(function(response){
		cargarDatos(response,1);
		buscaConceptoDisponible($('#uni_liquidacion').val());
		cargarConceptoRelacion();
		});
	}
var buscaConceptoDisponible=function(uni_liquidacion){	
	var argumentos="accion=c&accion_m=concepto_disponible&sus_ideregistro=" + sessionStorage.facturacion_registr_suscr_factura_suscripcion;
	argumentos+='&uni_liquidacion=' + uni_liquidacion;
	var a=new consultaAjax(formulario,true,argumentos);
		var respuesta=a.success(function(response){
			cargarTabla(response,'conceptoDisponible','radio');	
			ajustaTabla('conceptoDisponible');		
			});
	return true;
	}

var cargarConceptoRelacion=function(){
	var argumentos="accion=c&accion_m=concepto_relacion&dsus_ideregistr=" + $('#dsus_ideregistr').val();
	var a=new consultaAjax(formulario,true,argumentos);
	var respuesta=a.success(function(response){
		//$('#divRespuesta').html(response);
		cargarTabla(response,'conceptoRelacionado','radio');	
		ajustaTabla('conceptoRelacionado');		
		});
	return true;
	}
var onCargarDatos=function(){
	unid.refrescar();
	}
	

var onUnidSeleccion=function(){
	$('#con_nombre,#con_abreviatura').val(arguments[2]);
	}
var ajustaTabla=function(Tabla){
	var t=$('#' + Tabla);
	switch(Tabla){
		case 'conceptoDisponible':
			t.find('input[name=conceptoDisponible_ide]').on('click',function(){
				$('#uni_concepto').val($(this).val());
				$('#cosu_vlrunitari,#cosu_vlrtotal,#cosu_cantidad').val('').removeAttr('readonly');
				$('#con_tipregistro').val($(this).parents('tr').find('td').eq(4).html());
				var valor=$(this).parents('tr').find('td').eq(3).html();
				switch($('#con_tipregistro').val()){
					case 'T':
						if (valor){
							$('#cosu_vlrunitari').val(valor).attr('readonly',true);
							$('#cosu_cantidad').attr('readonly',false);						
							}
						else{
							$('#cosu_vlrunitari').attr('readonly',false);
							$('#cosu_cantidad').attr('readonly',false);	
							}											
						$('#cosu_vlrtotal').attr('readonly',true);	
						
												
						break;
					case 'C':
						if (valor){
							$('#cosu_cantidad').val(valor).attr('readonly',true);							
							}
						else{
							$('#cosu_cantidad').attr('readonly',false);
							}											
						$('#cosu_vlrunitari').val(1).attr('readonly',true);	
						$('#cosu_vlrtotal').attr('readonly',true);
						break;
					case 'U':
						if (valor){
							$('#cosu_vlrunitari').val(valor).attr('readonly',true);	
							}
						else{
							$('#cosu_vlrunitari').attr('readonly',false);
							}											
						$('#cosu_cantidad').val(1).attr('readonly',true);
						$('#cosu_vlrtotal').attr('readonly',true);
						break;
					}				

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
	,dsus_detsuscrip\
	,emp_ideregistro\
	,nov_estado\
	,nov_genera\
	,nov_fecProcesad\
	,nov_observacion\
	,emp_ideregistro\
	,cic_ideregistro\
	,per_ideregistro\
	,tor_nomtabla\
	';
	
	formCampos[1]='\
	,dsus_ideregistr\
	,uni_liquidacion\
	,uni_liquidacion_nombre\
	';

	for (var Campo in formCampos){
		var C=formCampos[Campo];
		C=C.split(',');
		for(var k=0;k<C.length;k++) C[k]=C[k].trim();C=C.slice(1);
		camposCaso.push(C);
		}
	
	return camposCaso[nForm];
	}