//var tablaForm=new Array('ter_tercero');	//array de tablas existentes en el documento
var f=$(location).attr('search'); f=f.substr(1);	f=f.split('&');	var formulario; for(var k=0;k<f.length;k++){f[k]=f[k].split("=");f[k][0]==='modulo' ? formulario=f[k][1] : f;}
$(function(){
	inicializarForm();	
	cargarEventos();
	cargarEventosGenerales();
	});

var inicializarForm=function(){// lista de campos con algun comportamiento especial
	cconcurr=new contConcurr();
	$('#ter_documento').attr('onkeypress','numerico(event)');
	$('#cnre_ideregistro,#dsus_ideregistr_busca').removeAttr('disabled');
	actualizarDependencias();
	return true;
	}
var cargarEventos=function(){
	$('#ter_documento').on('blur',function(){
		consultaDocumento($(this));
		});
	$('#opEditar').on('click',function(){if ($('#ter_ideregistro').val().trim()===''){alert('Por favor seleccione un registro para poder editarlo.');setTimeout(function(){$('#opCancelar').trigger('click');},20);
			return false;};	cconcurr.br('Yw0K','sus_suscripcion',$('#ter_ideregistro').val());});

	$('#dsus_ideregistr_busca').on('focus',function(){$('#dsus_pcodigo_busca').val('');});
    $('#dsus_pcodigo_busca').on('focus',function(){$('#dsus_ideregistr_busca').val('');});
    $('#buscar_dsus').on('click',function(){
		if ($('#dsus_ideregistr_busca').val()==='' && $('#dsus_pcodigo_busca').val()===''){
			$("#divRespuesta").html('Debe ingresar un codigo para la busqueda de la suscripcion, ya sea el identificador nuevo o el anterior.');
			return false;
			}
		buscaSuscripciones();
		});
	
	$('#' + formulario).on('submit',function(){// envío del formulario
		var argumentos='accion=s&ter_ideregistro=' + $('#ter_ideregistro').val() + '&cnre_ideregistr=' + $('#cnre_ideregistro').val();
		var a=new consultaAjax(formulario,false,argumentos);
		var respuesta=a.success(function(response){
			if (!isNaN(+response)){
				$('#sus_ideregistro').val(response);
				actualizarDependencias();
				}
			$('#divRespuesta').html(response);
			});		
		return false;	
		});
	//*****************************************************************Botones de Formulario --INICIO
	
	//*****************************************************************Botones de Formulario --FIN	 
	}
var navegaRegistro=function(formulario){//navegacion de registros
	var argumentos="navac=" + $('#navac').val() + "&accion=n&idreg=" + $('#ter_ideregistro').val();
	var a=new consultaAjax(formulario,false,argumentos);
	var respuesta=a.success(function(response){
		//$('#divRespuesta').html(response);
		if (response.length>0){
			cargarDatos(response);
			actualizarDependencias();
			}
		else{
			$('#' + formulario)[0].reset();
			$('#divRespuesta').html("No hay más datos.");
			$('#PropTer').find('tbody').empty();
			}
		});				
	}

//actualización de dependencias de los registros
var iframeSrc=new Array();
iframeSrc.push('programa.php?modulo=facturacion_registr_suscr_factura_suscripcion');
iframeSrc.push('programa.php?modulo=facturacion_registr_suscr_factura_concepto');

var consultaDocumento=function(doccampo){//consultar si existe el documento que se va a ingresar
	var argumentos="accion=c&accion_m=ter_documento&ter_documento=" + doccampo.val();
	var a=new consultaAjax(formulario,false,argumentos);
	var respuesta=a.success(function(response){
		//$('#divRespuesta').html(response);
		if (response!=='sinDatos'){
			cargarDatos(response);
			actualizarDependencias();			
			}
		else{
			cargarDatos(null);
			}
		});
	}
	
var actualizarDependencias=function(evitar){
	var k=0;
	$('iframe').each(function(){
		//alert($("#cic_ideregistro").val());
		if (k!==evitar){
			$(this).attr('src',iframeSrc[k] + '&idereferencia=' + $("#sus_ideregistro").val() + '&ter_ideregistro=' + $('#ter_ideregistro').val());
			}		
		k++;
		});
	}
//aqui se cargan los datos al formulario
var onCargarDatos=function(){

	}
var buscaSuscripciones=function(){
	var ideregistr=$('#dsus_ideregistr_busca').val();
	var pcodigo=$('#dsus_pcodigo_busca').val();
	var argumentos="accion=c&accion_m=buscaSuscripcion&dsus_ideregistr=" + ideregistr + '&dsus_pcodigo=' + pcodigo;
	var a=new consultaAjax(formulario,false,argumentos);
	var respuesta=a.success(function(response){
		response=response.trim();
		var doc=response.substr(4,response.length-8)
		$('#ter_documento').val(doc).trigger('blur');
		
		});
	}
var conCarg
var camposFormulario=function(nForm){
	var nForm=(nForm || 0);
	var camposCaso=new Array();
	var formCampos=new Array();
	//----------------------------------- SE REGISTRAN TODOS LOS CAMPOS CON EL MISMO NOMBRE DE LA DB Y EN MISMO ORDEN
	formCampos[0]='\
	,ter_documento\
	,ter_nomcompleto\
	,ter_ideregistro\
	,ter_telcelular\
	,ter_telfijo\
	';
	for (var Campo in formCampos){
		var C=formCampos[Campo];
		C=C.split(',');
		for(var k=0;k<C.length;k++) C[k]=C[k].trim();C=C.slice(1);
		camposCaso.push(C);
		}
	
	return camposCaso[nForm];
	}