var f=$(location).attr('search'); f=f.substr(1);	f=f.split('&');	var formulario; for(var k=0;k<f.length;k++){f[k]=f[k].split("=");f[k][0]==='modulo' ? formulario=f[k][1] : f;}
var conformula;
var permiteGuardar=false;
var datosConceptos;
$(function(){
	inicializarForm();	
	cargarEventos();
	cargarEventosGenerales();
	});

var inicializarForm=function(){// lista de campos con algun comportamiento especial
	$('#con_nombre,#con_formula').attr('readonly',true);
	$('#con_formula').parents('.campo').hide();
	cconcurr=new contConcurr();
	$('#con_tipcalculo').attr('disabled',true);
	cargarConceptoSeleccionado();
	buscaConceptoDisponible();
	conformula=new ConceptoFormula();
	return true;
	}
var cargarEventos=function(){
	$('#opEditar').on('click',function(){if ($('#uni_concepto').val().trim()===''){alert('Por favor seleccione un registro para poder editarlo.');setTimeout(function(){$('#opCancelar').trigger('click');},20);
			return false;};	cconcurr.br('Yw0K','core_conrelacio',$('#uni_concepto').val());});
	$('#acAgregar').on('click',function(){
		if (conformula.validar()){
			var formulaHTML=$('#formula').html();
			var blanco=/\s/g;
			formulaHTML=formulaHTML.replace(blanco,'');
			$('#con_formula').val(formulaHTML);
			}
		});
	
	$('#' + formulario).on('submit',function(){// envío del formulario
		if (!permiteGuardar){
			$('#divRespuesta').html('Debe validar la formulación y completar los parámetros para la relación de conceptos antes de continuar.');
			return false;
			}
		
		if(!validaFormulario()){
			return false;
			}
		var argumentos="accion=s";
		argumentos+='&conceptos=' + datosConceptos;
		var a=new consultaAjax(formulario,true,argumentos);
		var respuesta=a.success(function(response){
			$('#divRespuesta').html(response);
			//window.location.reload();
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

var buscaConceptoDisponible=function(){
	if (!sessionStorage.facturacion_registr_define_liquidacion_conceptos){
		$('#divRespuesta').html("No ha seleccionado ningún concepto. Diríjase a la pestaña de conceptos y elija uno para poder trabajar.");
		return false;
		}
	var argumentos="accion=c&accion_m=concepto_disponible&uni_concepto=" + sessionStorage.facturacion_registr_define_liquidacion_conceptos;

	var a=new consultaAjax(formulario,true,argumentos);
		var respuesta=a.success(function(response){

			cargarTabla(response,'conceptoDisponible','checkbox');
			var concepindex;
			$('input[name="conceptoDisponible_ide[]"]').on('click',function(){
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
		if ($('#con_formula').val()){
			$('#formulaCompleta').css({'font-weight':'bold'}).html($('#con_formula').val());
			$('#divRespuesta').html('Este concepto ya tiene una formulación predefinida. No es posible cambiarlo. Si es necesario elimine el concepto y vuelva a crear la relación');
			$('#divFormActions').hide();
			cargarConceptosRelacionado();
			return false;
			}
		});
	}


var cargarConceptosRelacionado=function(){
	var argumentos="accion=c&accion_m=concepto_relacionado&uni_concepto=" + sessionStorage.facturacion_registr_define_liquidacion_conceptos;
	var a=new consultaAjax(formulario,true,argumentos);
	var respuesta=a.success(function(response){
		cargarTabla(response,'conceptosRelacionados');
		});
	}

var ajustaTabla=function(Tabla){
	
	}
var onValidaConceptos=function(){
	$('#conceptoRelacion').empty();
	var con=conformula.getConceptos();
	for(var k=0;k<con.length;k++){
		var cont=k;
		var fila=$('<div>').attr('class','marco_item');
		$('<div>').attr('class','campo').append($('<label>').attr('for','uni_conrelacion_' + con[k]).html('Ide Concepto')).append($('<input>').attr('id','uni_conrelacion_' + con[k]).attr('readonly',true).val(con[k])).appendTo(fila);
		$('<div>').attr('class','campo').append($('<label>').attr('for','nom_concepto_' + con[k]).html('Nombre de Concepto')).append($('<input>').attr('id','nom_concepto_' + con[k]).attr('readonly',true).val($('#conceptoDisponible').find('input[value=' + con[k] + ']').parents('tr').find('td').eq(1).html())).appendTo(fila);
		$('<div>').attr('class','campo').append($('<label>').attr('for','core_tipacumula_' + con[k]).html('Cómo acumula')).append($('<select>').attr('id','core_tipacumula_' + con[k])).appendTo(fila);new Combo('tipacumula','core_tipacumula_' + con[k],false);
		$('<div>').attr('class','campo').append($('<label>').attr('for','core_canacumula_' + con[k]).html('Cantidad acumula')).append($('<input>').attr('type','text').attr('id','core_canacumula_' + con[k]).val('0')).attr('onkeypress','entero(event)').appendTo(fila);
		$('<div>').attr('class','campo').append($('<label>').attr('for','tor_nomtabla_' + con[k]).html('Archivo')).append($('<select>').attr('id','tor_nomtabla_' + con[k]).on('change',function(){
			var tid=$(this).attr('id').substr($(this).attr('id').lastIndexOf('_')+1,$(this).attr('id').length);
			$('#dtor_nomcampo_' + tid).empty();
			new Combo('dtor_dettaborig','dtor_nomcampo_' + tid,false,$(this).val(),'A');
			})).appendTo(fila);new Combo('tor_nomtabla','tor_nomtabla_' + con[k],false);		
		$('<div>').attr('class','campo').append($('<label>').attr('for','dtor_nomcampo_' + con[k]).html('Campo')).append($('<select>').attr('id','dtor_nomcampo_' + con[k])).appendTo(fila);
		$('<div>').attr('class','campo').append($('<label>').attr('for','uni_documento_' + con[k]).html('Documento')).append($('<select>').attr('id','uni_documento_' + con[k]).on('change',function(){
			var tid=$(this).attr('id').substr($(this).attr('id').lastIndexOf('_')+1,$(this).attr('id').length);
			$('#uni_tipdocument_' + tid).empty();
			new Combo('tipo_documento',('uni_tipdocument_' + tid),false,$(this).val());
			})).appendTo(fila);new Combo('documento','uni_documento_' + con[k],true);
		$('<div>').attr('class','campo').append($('<label>').attr('for','uni_tipdocument_' + con[k]).html('Tipo de Documento')).append($('<select>').attr('id','uni_tipdocument_' + con[k])).appendTo(fila);
		$('<div>').attr('class','campo').append($('<label>').attr('for','uni_liquidacion_' + con[k]).html('Liquidacion')).append($('<select>').attr('id','uni_liquidacion_' + con[k])).appendTo(fila);
		new Combo('liquidacion','uni_liquidacion_' + con[k],true,'C',con[k]);
		$('#conceptoRelacion').append(fila);
		}
	permiteGuardar=true;
	return false;
	}


var validaFormulario=function(){
	datosConceptos='';
	var cantAcumula=$('input[id^="core_canacumula_"]');
	cantAcumula.each(function(){
		datosConceptos.length>0 ? datosConceptos+='|_|' : datosConceptos;
		var tid=$(this).attr('id').substr($(this).attr('id').lastIndexOf('_')+1,$(this).attr('id').length);
		
		if ($('#uni_documento_' + tid).val()!=='' && $('#uni_tipdocument_' + tid).val()===''){
			$('#divRespuesta').html('Concepto ' + tid + '. Si ha seleccionado un documento, debe completar el tipo de documento');
			datosConceptos='';
			return false;
			}
		else if (isNaN($('#core_canacumula_' + tid).val()) || $('#core_canacumula_' + tid).val()===''){
			$('#divRespuesta').html('Concepto ' + tid + '. La cantidad de periodos acumulados debe ser un dato numérico.');
			datosConceptos='';
			return false;
			}
		else{
			datosConceptos+=$('#uni_conrelacion_' + tid).val() + ',';
			datosConceptos+=$('#tor_nomtabla_' + tid).val() + ',';
			datosConceptos+=$('#dtor_nomcampo_' + tid).val() + ',';
			datosConceptos+=$('#uni_documento_' + tid).val() + ',';
			datosConceptos+=$('#uni_tipdocument_' + tid).val() + ',';
			datosConceptos+=$('#core_tipacumula_' + tid).val() + ',';
			datosConceptos+=$('#core_canacumula_' + tid).val();
			}				
		});
	return true;
	}
var onCargarDatos=function(response){

	}
	
var camposFormulario=function(nForm){
	var nForm=(nForm || 0);
	var camposCaso=new Array();
	var formCampos=new Array();
	//----------------------------------- SE REGISTRAN TODOS LOS CAMPOS CON EL MISMO NOMBRE DE LA DB Y EN MISMO ORDEN
	formCampos[0]='\
	,uni_concepto\
	,est_concepto\
	,con_formula\
	,con_tipcalculo\
	';
	
	formCampos[1]='\
	codo_ideregistr\
	,uni_concepto\
	,est_concepto\
	,uni_concepto_nombre\
	,con_formula\
	,con_tipcalculo\
	';
	for (var Campo in formCampos){
		var C=formCampos[Campo];
		C=C.split(',');
		for(var k=0;k<C.length;k++) C[k]=C[k].trim();C=C.slice(1);
		camposCaso.push(C);
		}
	
	return camposCaso[nForm];
	}	        	