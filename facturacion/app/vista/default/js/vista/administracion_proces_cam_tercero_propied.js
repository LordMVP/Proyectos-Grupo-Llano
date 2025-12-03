var f=$(location).attr('search'); f=f.substr(1);	f=f.split('&');	var formulario; for(var k=0;k<f.length;k++){f[k]=f[k].split("=");f[k][0]==='modulo' ? formulario=f[k][1] : f;}
var valida=false;
var noSuscrip=false;
$(function(){
	inicializarForm();	
	cargarEventos();
	cargarEventosGenerales();
	});
var inicializarForm=function(){
	$('#ter_ideregistro_act,#ter_ideregistro_new').hide();
	cconcurr=new contConcurr();
	$('#opNuevo,#opEditar').prop('disabled',true);
	$('#opEditar').hide();
	var btnProcesar=$('<button>').attr('type','button').attr('id','opProcesar').html('Procesar').on('click',function(){trasladar();});
	$('#opNuevo').after(btnProcesar);
	$('#' + formulario + ' input[type=text]').prop('readonly',true);
	}
var cargarEventos=function(){
	$('#cmdTrasladarPropiedad').on('click',function(){
		if ($('#PropTerActual input[type=radio]:checked').length===0){
			$('#divRespuesta').html('No ha seleccionado ninguna propiedad para el traslado');
			return false;
			}				
		cuadrosBusqueda.cuadros[1].mostrarBusqueda();
		});	
	$('#cmdCambiarSeleccionPropidad').on('click',function(){
		fieldsets.mostrar('fst1');
		if ($('#ter_ideregistro_new').val()===''){return false;};
		var cmdcp=$('<button>').attr('type','button').on('click',function(){
			var bt=$(this);
			cargarBusqueda($('#ter_ideregistro_new').val(),1);
			setTimeout(function(){bt.remove()},1000);
			}).html('Trasladar al tercero seleccionado');
		$('#cmdTrasladarPropiedad').before(cmdcp);
		});
	$('#cmdCambiarSeleccionTercero').on('click',function(){
		for(var i in camposFormulario(1)){
			$('#' + camposFormulario(1)[i]).val('');
			}
		$('#SuscriptorTerceroOrigenCont').remove();
		$('#PropTerActual tr').show();
		$('#PropTerDestino tbody').empty();
		fieldsets.mostrar('fst1');
		});
	
	}
var pretrasladar=function(){
	var proptr=$('#PropTerActual input[type=radio]:checked').parents('tr').clone().css({'background':'initial'});
	$('#PropTerActual tr').show();
	$('#PropTerActual input[type=radio]:checked').parents('tr').hide();
	proptr.find('td').eq(0).hide();
	proptr.find('td').eq(8).hide();
	proptr.find('td').eq(0).before('<td>');
	$('#PropTerDestino tbody').empty();
	$('#PropTerDestino').append(proptr);
	consultarSuscripcion();	
	}
var consultarSuscripcion=function(){
	var args='accion=c&accion_m=suscripcionPropiedadOrigen&pro_ideregistro=' + $('#PropTerDestino input[type=radio]').val();
	var respuesta= new consultaAjax(formulario,false,args).success(function(response){
		$('<table>').attr('id','dsusPropTerDestino').css({'margin':'0px','border':'0px'}).appendTo($('#PropTerDestino tbody tr').find('td').eq(0));
		cargarTabla(response,'dsusPropTerDestino');
		ajustaTabla('dsusPropTerDestino');
		});
	}
var consultarSuscriptoresDestino=function(){
	if ($('#ter_ideregistro_new').val()==='') {$('#divRespuesta').html('No ha seleccionado un tercero de destino.');return false;};
	var dcc=$('<div class="campo" id="SuscriptorTerceroOrigenCont">').appendTo('#TercNuevo');
	$('<label>').attr('for','sus_suscriptor_new').html('Suscriptor de destino').appendTo(dcc);
	$('<select>').attr('id','sus_suscriptor_new').attr('name','sus_suscriptor_new').appendTo(dcc);
	new Combo('selSuscriptorTercero','sus_suscriptor_new',true,$('#ter_ideregistro_new').val(),$('#dsusPropTerDestino tbody tr td').eq(3).html(),$('#dsusPropTerDestino tbody tr td').eq(4).html());
	}
var trasladar=function(){
	var tienesus=false;
	if ($('#PropTerDestino tbody tr').length===0){$('#divRespuesta').html('No ha seleccionado una propiedad para el traslado.');return false;};
	if ($('#sus_suscriptor_new').length>0 && $('#sus_suscriptor_new').val()===''){$('#divRespuesta').html('La propiedad está asociada a una Suscripción. Por favor seleccione un Suscriptor en el formulario de "Tercero de Destino".<br></br>Si no puede seleccionar un suscriptor se debe a que el traslado de la propiedad no está autorizado para su perfil.');return false;}
	if (!confirm('Está seguro que desea continuar con el proceso?')){return false;};
	var args;
	if ($('#sus_suscriptor_new').length>0){tienesus=true};
	if (!tienesus){
		args='accion=t&accion_m=tpns&pro_ideregistro=' + $('#PropTerDestino input[type=radio]').val();
		args+='&ter_ideregistro=' + $('#ter_ideregistro_new').val();
		new consultaAjax(formulario,false,args).success(function(response){
			if (response.trim()==='OK'){
				$('#divRespuesta').html('La propiedad ha sido trasladada.');
				reiniciarForm();
				}
			else{
				$('#divRespuesta').html(response);
				}
			});
		}
	else{
		args='accion=t&accion_m=tps&pro_ideregistro=' + $('#PropTerDestino input[type=radio]').val();
		args+='&ter_ideregistro=' + $('#ter_ideregistro_new').val();
		args+='&sus_ideregistro=' + $('#sus_suscriptor_new').val();
		args+='&dsus_ideregistr=' + $('#dsusPropTerDestino tr td').eq(0).html();
		new consultaAjax(formulario,false,args).success(function(response){
			if (response.trim()==='OK'){
				$('#divRespuesta').html('La propiedad ha sido trasladada.');
				reiniciarForm();
				}
			else{
				$('#divRespuesta').html(response);
				}
			});
		}
	return true;
	}
var reiniciarForm=function(){
	for(var i in camposFormulario(0)){$('#' + camposFormulario(0)[i]).val('');};
	for(var i in camposFormulario(1)){$('#' + camposFormulario(1)[i]).val('');};
	$('#PropTerActual tbody').empty();
	$('#PropTerDestino tbody').empty();
	$('#sus_suscriptor_new').remove();
	}
var consultarPropiedades=function(ter_ideregistro){
	var args='accion=c&accion_m=propiedadOrigen&ter_ideregistro=' + ter_ideregistro;
	new consultaAjax(formulario,false,args).success(function(response){
		cargarTabla(response,'PropTerActual','radio');
		fieldsets.mostrar('fst1');
		ajustaTabla('PropTerActual');
		});	
	}
var onCargarDatos=function(cn){
	switch(cn){
		case 0:
			setTimeout(function(){$('#cmdCambiarSeleccionTercero').trigger('click')},1000);
			break;
		case 1:
			if ($('#ter_ideregistro_act').val()===$('#ter_ideregistro_new').val()){
				$('#divRespuesta').html('El tercero de destino debe ser diferente al tercero de origen. Verifique su selección');
				setTimeout(function(){$('#cmdCambiarSeleccionTercero').trigger('click')},1000);
				return false;
				}
			break;							
		}
	return true;
	}
var onCargarBusqueda=function(a,b){
	switch(b){
		case 0:
			consultarPropiedades(a);
			break;
		case 1:
			fieldsets.mostrar('fst2');
			pretrasladar();
			break;
		}
	}
var ajustaTabla=function(tabla){
	switch(tabla){
		case 'PropTerActual':
			$('#PropTerActual tbody').find('tr').each(function(){
				var rid=$(this).find('td').eq(0);
				rid.find('input').on('click',function(){
					$('#PropTerActual tbody tr').each(function(){$(this).css({'background':'initial'});});
					rid.parents('tr').css({'background':'#D2D9FF'});
					});
				});
			break;
		case 'dsusPropTerDestino':
			$('#SuscriptorTerceroOrigenCont').remove();
			if ($('#dsusPropTerDestino tbody tr').length===0){
				$('#dsusPropTerDestino').append('<tr><td colspan="2">Sin suscripción</td></tr>');				
				}
			else{
				$('#dsusPropTerDestino tr td').eq(0).hide();
				$('#dsusPropTerDestino tr td').eq(2).hide();
				$('#dsusPropTerDestino tr td').eq(3).hide();
				$('#dsusPropTerDestino tr td').eq(4).hide();
				consultarSuscriptoresDestino();
				}
			break;
		}
	}

var camposFormulario=function(nForm){
	var nForm=(nForm || 0);
	var camposCaso=new Array();
	var formCampos=new Array();
	formCampos[0]='\
	,ter_ideregistro_act\
	,ter_documento_act\
	,ter_nomcompleto_act\
	,uni_tiptercero_act\
	,ter_telfijo_act\
	,ter_telcelular_act\
	,ter_sexo_act\
	';
	formCampos[1]='\
	,ter_ideregistro_new\
	,ter_documento_new\
	,ter_nomcompleto_new\
	,uni_tiptercero_new\
	,ter_telfijo_new\
	,ter_telcelular_new\
	,ter_sexo_new\
	';	
	for (var Campo in formCampos){
		var C=formCampos[Campo];
		C=C.split(',');
		for(var k=0;k<C.length;k++) C[k]=C[k].trim();C=C.slice(1);
		camposCaso.push(C);
		}	
	return camposCaso[nForm];
	}

var ic=0;cuadrosBusqueda.campos.push({llave:'ter_ideregistro_act',accionm:'cargarResultadoAct',columnas:new Array()});
cuadrosBusqueda.campos[ic].columnas.push('ter_nombre,Nombre');
cuadrosBusqueda.campos[ic].columnas.push('ter_documento,Cedula / Nit');
cuadrosBusqueda.campos[ic].columnas.push('pro_numcatastral,Número Catastral');
cuadrosBusqueda.campos[ic].columnas.push('pro_idepropieda,Numero de Propiedad');
cuadrosBusqueda.campos[ic].columnas.push('uni_municipio,Municipio');
cuadrosBusqueda.campos[ic].columnas.push('pro_direccion,Dirección');
ic++;cuadrosBusqueda.campos.push({llave:'ter_ideregistro_new',accionm:'cargarResultadoNew',columnas:new Array()});
cuadrosBusqueda.campos[ic].columnas.push('ter_nombre,Nombre');
cuadrosBusqueda.campos[ic].columnas.push('ter_documento,Cedula / Nit');