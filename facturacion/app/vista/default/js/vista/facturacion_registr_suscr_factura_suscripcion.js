//var tablaForm=new Array('nov_novedad','dsus_detsuscrip','dnov_detnovedad');	//array de tablas existentes en el documento

var f=$(location).attr('search'); f=f.substr(1);	f=f.split('&');	var formulario; for(var k=0;k<f.length;k++){f[k]=f[k].split("=");f[k][0]==='modulo' ? formulario=f[k][1] : f;}
$(function(){
	inicializarForm();	
	cargarEventos();
	cargarEventosGenerales();
	});

var inicializarForm=function(){// lista de campos con algun comportamiento especial
	cconcurr=new contConcurr();
	delete sessionStorage.facturacion_registr_suscr_factura_suscripcion;
	$('#nov_fecha,#pro_catestrato,#dsus_pcodigo').attr('onkeypress','numerico(event)');
	$('#cic_ideregistro').removeAttr('disabled');
	$('#dsus_fecinicio').val(fecha.hoy);
	$('#dsus_iniEstado').val(fecha.hoy);
	$('#dsus_finEstado').val(fecha.hoy);
	$('#tsu_persuspend').attr('readonly',true);	
	consultarSuscr();
	consultarPropiedades();
	//consultardSusdet();
	return true;
	}
var cargarEventos=function(){
	$('#uni_liquidacion').on('change',function(){
		$('#cic_ideregistro').empty();
		new Combo('ciclo','cic_ideregistro',false,'liquidacion',$(this).val());
		});
	$('#opEditar').on('click',function(){if ($('#dsus_ideregistr').val().trim()===''){alert('Por favor seleccione un registro para poder editarlo.');setTimeout(function(){$('#opCancelar').trigger('click');},20);
			return false;};	cconcurr.br('Yw0K','dsus_detsuscrip',$('#dsus_ideregistr').val());});

	$('#' + formulario).on('submit',function(){// envío del formulario
		if (!validaFormulario()) return false;
		var pro_propiedad=$('input[name=PropTer_ide]:checked').val();
		var ter_tercero=urlVariables.ter_ideregistro;
		var sus_suscripcion=urlVariables.idereferencia ? urlVariables.idereferencia : $('input[name=suscr_ide]:checked').val();
		var est_liquidacion=datos_uni_liquidacion[$('#uni_liquidacion').val()];
		var est_tipsuscripc=datos_uni_tipsuscripc[$('#uni_tipsuscripc').val()][1];
		
		var argumentos='ter_ideregistro=' + ter_tercero + '&sus_ideregistro=' + sus_suscripcion + '&pro_ideregistro=' + pro_propiedad;
		argumentos+='&est_liquidacion=' + est_liquidacion;
		argumentos+='&est_tipsuscripc=' + est_tipsuscripc;
		argumentos+='&uni_tipsuscripc=' + $('#uni_tipsuscripc').val();
		if ($('#dsus_ideregistr').val()!==''){
			argumentos+='&accion=e';
			argumentos+='&dsus_ideregistr=' + $('#dsus_ideregistr').val();
			}
		else{
			argumentos+='&accion=s';
			}
		//alert(argumentos);
		var a=new consultaAjax(formulario,true,argumentos);
		var respuesta=a.success(function(response){
			$('#divRespuesta').html(response);
			$('dsus_ideregistr').val(response);
			consultardSusdet();
			});		
		return false;	
		});
	//*****************************************************************Botones de Formulario --INICIO
	
	//*****************************************************************Botones de Formulario --FIN	 
	}
var validaFormulario=function(){
	if ($('#dsus_iniestado').val()===''){
		$('#divRespuesta').html('Debe indicar un inicio de vigencia de la suscripcion');
		return false;
		}
	if ($('#dsus_finestado').val()===''){
		$('#divRespuesta').html('Debe indicar un fin de vigencia de la suscripción. ');
		return false;
		}
	
	return true;
	}
var navegaRegistro=function(formulario){//navegacion de registros
	$.ajax({
		type:"POST",
		url:"app/controlador/c." + formulario + ".php",
		dataType:"html",
		data:"navac=" + $('#navac').val() + "&accion=n&idreg=" + $('#dsus_ideregistr').val(),	   
		success:function(response){
			if (response.length>0){
				cargarDatos(response);
				//$('#divRespuesta').html(response);
				}
			else{
				$('#' + formulario)[0].reset();
				$('#divRespuesta').html("No hay más datos.");
				$('#PropTer').find('tbody').empty();
				}			
			}
		});			
	}


var consultarSuscr=function(){
	var tablaCarga='suscr';
	var ter_tercero=urlVariables.ter_ideregistro;
	var sus_suscripcion=urlVariables.idereferencia;
	if (!ter_tercero && !sus_suscripcion){ return false;}
	var datos='accion=c&accion_m=sus_suscripcion&ter_ideregistro=' + ter_tercero + '&sus_ideregistro=' + sus_suscripcion;
	var respuesta= new consultaAjax(formulario,false,datos).success(function(response){		
		cargarTabla(response,tablaCarga,'radio');
		ajustaTabla(tablaCarga);
		});
	}

var consultardSusdet=function(suscr){
	var tablaCarga='dsusDet';
	var ter_tercero=urlVariables.ter_ideregistro;
	var sus_suscripcion=urlVariables.idereferencia;
	if (!ter_tercero && !sus_suscripcion){ return false;}
	var datos='accion=c&accion_m=dsus_detsuscripcion';
	if (urlVariables.idereferencia || $('input[name=suscr_ide]:checked').val())
		datos+='&sus_ideregistro=' + (urlVariables.idereferencia ? urlVariables.idereferencia : $('input[name=suscr_ide]:checked').val()) ;
	datos+='&ter_ideregistro=' + urlVariables.idereferencia;
	datos+='&pro_ideregistro=' + $('[name=suscr_ide]:selected').val();
	var respuesta= new consultaAjax(formulario,false,datos).success(function(response){		
		//$('#divRespuesta').html(response);
		cargarTabla(response,tablaCarga,'radio');
		ajustaTabla(tablaCarga);		
		});
	}
var consultarPropiedades=function(){
	var tablaCarga='PropTer';
	var ter_tercero=urlVariables.ter_ideregistro;
	var datos='accion=c&accion_m=pro_propiedad&ter_ideregistro=' + ter_tercero;
	var respuesta= new consultaAjax(formulario,false,datos).success(function(response){
		//$('#divRespuesta').html(response);
		cargarTabla(response,tablaCarga,'radio');		
		ajustaTabla(tablaCarga);
		});	
	}
var onUnidSeleccion=function(unidad,estructura){
	switch(+estructura){
		case 2:
			$('#uni_liquidacion').empty();
			new Combo('liquidacion','uni_liquidacion',true,'tipo_uso',unidad);
			break;
		}	
	}
var onUnidRefresca=function(unidad,estructura){
	switch(+estructura){
		case 2:
			$('#uni_liquidacion').empty();
			new Combo('liquidacion','uni_liquidacion',true,'tipo_uso',unidad);
			
			$('#uni_tipsuscripc').empty();
			new Combo('tipo_suscripcion','uni_tipsuscripc',false,false,'N');
			break;
		}
	}
var datos_uni_tipsuscripc,datos_uni_liquidacion;
var onComboLoad=function(datos,campo){
	switch (campo){
		case 'uni_liquidacion':
			//alert(datos)
			datos_uni_liquidacion=datos;
			$('#cic_ideregistro').empty();
			new Combo('ciclo','cic_ideregistro',false,'liquidacion',$('#uni_liquidacion').val());
			break;
		case 'uni_tipsuscripc':
			datos_uni_tipsuscripc=datos;
			$('#tsu_persuspend').val(datos[+$('#uni_tipsuscripc').val()][0]);
			break;
		}
	comboTipoSuscripcion=datos;
	}
var cargarDsusSeleccion=function(dsus_ideregistr){	
	var datos='accion=c&accion_m=suscripcion_seleccionada&dsus_ideregistr=' + dsus_ideregistr;
	var respuesta= new consultaAjax(formulario,false,datos).success(function(response){
		//$('#divRespuesta').html(response);
		cargarDatos(response);
		});	
	}
var onCargarDatos=function(){	
	unid2.refrescar();
	}

var ajustaTabla=function(Tabla){
	var t=$('#' + Tabla);
	switch(Tabla){
		case 'suscr':
			t.find('input[name=suscr_ide]').on('click',function(){
				consultardSusdet();
				});
			break;
		case 'PropTer':
			t.find('input[name=PropTer_ide]').on('click',function(){
				$('#uni_tipsuscripc').empty()
				new Combo('tipo_suscripcion','uni_tipsuscripc',false,$(this).val(),'S');
				consultardSusdet();
				});
			break;
		case 'dsusDet':
			t.find('input[name=dsusDet_ide]').on('click',function(){
				sessionStorage.facturacion_registr_suscr_factura_suscripcion=$(this).val();
				cargarDsusSeleccion($(this).val());
				parent.actualizarDependencias(0);
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
	,dsus_ideregistr\
	,dsus_fecinicio\
	,dsus_descripcion\
	,uni_tipsuscripc\
	,est_tipsuscripc\
	,uni_tipusosuscr\
	,est_tipusosuscr\
	,uni_liquidacion\
	,est_liquidacion\
	,cic_ideregistro\
	,dsus_pcodigo\
	,dsus_estado\
	,pro_catestrato\
	,dsus_iniestado\
	,dsus_finestado\
	';

	for (var Campo in formCampos){
		var C=formCampos[Campo];
		C=C.split(',');
		for(var k=0;k<C.length;k++) C[k]=C[k].trim();C=C.slice(1);
		camposCaso.push(C);
		}
	
	return camposCaso[nForm];
	}
		
		        	