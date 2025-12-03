var f=$(location).attr('search'); f=f.substr(1);	f=f.split('&');	var formulario; for(var k=0;k<f.length;k++){f[k]=f[k].split("=");f[k][0]==='modulo' ? formulario=f[k][1] : f;}
$(function(){
	inicializarForm();	
	cargarEventos();
	cargarDatosIniciales();
	cargarEventosGenerales();
	});

var inicializarForm=function(){		
	$('#inpr_ideregistr').attr('disabled','disabled');
	$('#tip_nombre').attr('readonly','readonly');
	$('#inf_ideregistro').removeAttr('disabled');
	$('#tip_ideregistro').removeAttr('disabled');
	$('#inf_informacion').empty().trigger('c');;	
	$('#inf_ideregistro,#tip_ideregistro,').attr('disabled',false);
	$('#inf_ideregistro').empty();
	$('#pro_ideregistro').attr('value',urlVariables.pro_ideregistro);
	$('#uni_tippropieda').attr('value',urlVariables.uni_tippropieda);
	$('#est_tippropieda').attr('value',urlVariables.est_tippropieda);
	new Combo('inf_informacion','inf_ideregistro',false,urlVariables.uni_tippropieda);	
	cargarGrupos();
	cconcurr=new contConcurr();
	return true;
	}
var cargarDatosIniciales=function(){
	
	}
var cargarEventos=function(){
	$('#opAgregarGrupo').on('click',function(){
		var gract=$('#grpinform').val();
		if (!gract){
			$('#grpinform').empty().append($('<option>').val('1').html('1'));
			
			}
		else if($('#Info tbody').find('tr').length===0){
			$('#divRespuesta').html('No puede agregar más grupos hasta que no haya incorporado al menos un registro al ultimo grupo creado.');
			return false;
			}
		else{
			$('#grpinform').append($('<option>').val(+gract+1).html(+gract+1));
			$('#grpinform').val(+gract+1);
			$('#Info').find('tbody').empty();
			}		
		});
	$('#inf_ideregistro').on('change',function(){
		$('#tip_ideregistro').empty();
		tip_tipifica=new Combo('tip_tipifica','tip_ideregistro',false,$('#inf_ideregistro').val());
		});
	
	$('#tip_ideregistro').on('change',function(){				
		if ($(this).find('option:selected').val().length>0 || $(this).find('option:selected').val()!==""){
			$('#tip_nombre').val($(this).find('option:selected').text())
			restringirInformacion();
			}
		});
	$('#' + formulario).on('reset',function(){
		inicializarForm();
		});
	$('#' + formulario).on('submit',function(){// envío del formulario
		if ($('#inf_ideregistro').val()===''){
			$('#divRespuesta').html('Este tipo de propiedad no tiene información adicional.');
			return false;
			}
		if (!$('#grpinform').val()){
			$('#divRespuesta').html('Debe seleccionar un grupo antes de proceder.');
			return false;
			}
		var idereg=$('#inpr_ideregistr').val();
		var argumentos;
		var accion;
		
		if(idereg===''){
			argumentos="&accion=s&inpr_ideregistr=" + $('#inpr_ideregistr').val() + '&pro_ideregistro=' + $('#pro_ideregistro').val();accion='s';
			argumentos+='&inpr_grpinform=' + $('#grpinform').val();
			}
		else{
			argumentos="&accion=e&inpr_ideregistr=" + idereg;accion='e';
			}
		if($('#inpr_informacio').attr('multiple')){
			argumentos+='&inpr_informacio_mult=' + $("#inpr_informacio option:selected").map(function(){ return $(this).html()}).get().join(",");
			}
		var a=new consultaAjax(formulario,true,argumentos);
			
		var respuesta=a.success(function(response){
			if(accion==='s'){
				$('#divRespuesta').html(response);
				
				
				}
			else{
				$('#divRespuesta').html(response);
				}
			cargarInfo();
			});
		return false;
		});
	//*****************************************************************Botones de Formulario --INICIO
	
	//*****************************************************************Botones de Formulario --FIN	 
	$('#opAgregarGrupo').on('click',function(){
		
		});
	$('#grpinform').on('change',function(){
		cargarInfo();
		});
	$('#' + formulario).on('reset',function(){
		if ($('#inpr_archivo').val()!=='' || $('#inpr_informacio').val()!==''){
			if (!confirm('Desea borrar los datos que están diligenciados?'))
				return false;
			}
		});
	}

var cargarGrupos=function(){
	$('#grpinform').empty();
	var argumentos="accion=c&accion_m=inpr_grpinform&pro_ideregistro=" + $('#pro_ideregistro').val();
	var a=new consultaAjax(formulario,false,argumentos);
	var respuesta=a.success(function(response){
		$('#grpinform').empty();
		if(response=='sinDatos'){
                    return ; }
                new Combo('rango','grpinform',false,'1~' + response);
		cargarInfo();
		});
	}

var consultarInfo=function(){
	var argumentos="accion=c&accion_m=inpr_infpropie&inpr_ideregistr=" + $('input[name=Info_ide]:checked').val();
	var a=new consultaAjax(formulario,false,argumentos);
	var respuesta=a.success(function(response){
		cargarDatos(response);
		restringirInformacion();
		});
	}
var cargarInfo=function(){
	var argumentos="accion=c&accion_m=info&pro_ideregistro=" + $('#pro_ideregistro').val();
	argumentos+='&grupo=' + $('#grpinform').val();
	var a=new consultaAjax(formulario,false,argumentos);
	var respuesta=a.success(function(response){	
		cargarTabla(response,'Info','radio');
		ajustaTabla('Info');
		});
	}
var ajustaTabla=function(tabla){
	switch(tabla){
		case 'Info':
			$('input[name=Info_ide]').on('click',function(){
				consultarInfo();
				$('#inf_ideregistro,#tip_ideregistro,').attr('disabled',true);
				});
			$('#Info tbody tr').each(function(){
				var jtd=$(this).find('td');
				jtd.eq(6).hide();
				if(jtd.eq(5).html()==='A'){
					var en=$('<a>').attr('href',jtd.eq(6).html() + jtd.eq(2).html()).attr('target','_blank').html(jtd.eq(2).html());
					$(this).find('td').eq(2).html(en);
					}
				});
			break;
		}
	}
var onCargarDatos=function(){
	unid.refrescar();
	}
var datos_tip_tipifica;
var onComboLoad=function(datos,campo){
	switch(campo){
		case 'tip_ideregistro':
			datos_tip_tipifica=datos;
			break;
		}
	}

var restringirInformacion=function(){
	var valCarga=$('#inpr_informacio').val();
	var targetDiv=$('#campo_informacion');
	targetDiv.empty();
	var d=datos_tip_tipifica;
	var v=$('#tip_ideregistro').val();
	var campoTex=$('<input>').val('');
	var lbl=$('<label>');
	switch (d[v][0]){
		case 'T':
			lbl.attr('for','inpr_informacio').html('Información').appendTo(targetDiv);
			campoTex.attr('id','inpr_informacio').attr('name','inpr_informacio').appendTo(targetDiv).val(valCarga);
			if(d[v][1]){
				var argumentos="accion=c&accion_m=dtip_formato&tip_ideregistro=" + $('#tip_ideregistro').val();
				var a=new consultaAjax(formulario,false,argumentos);
				var respuesta=a.success(function(response){
					var formato=response.split(';');
					for(var k in formato){
						var cab,con;
						cab=formato[k].substr(0,formato[k].indexOf(':'))
						con=formato[k].substr(formato[k].indexOf(':')+1,formato[k].length);
						formato[k]=new Array(cab,con);
						}
					crearCampo(formato);
					});
				
				var crearCampo=function(f){
					for(var k in f){
						switch(f[k][0]){
							case 'L':
								campoTex.attr('maxlength',f[k][1]);
								break;
							case 'T':
								switch(f[k][1]){
									case 't':
										campoTex.attr('onkeypress','palabra(event)');
										break;
									case 'n':
										campoTex.attr('onkeypress','numerico(event)');										
										break;
									case 'tn':
										campoTex.attr('onkeypress','palabraNumero(event)');
										break;
									case 'z':
										campoTex.attr('onkeypress','entero(event)');
										break;
									case 'r':
										campoTex.attr('onkeypress','decimal(event)');
										break;
									}
								break;
							case 'R':																
								campoTex.attr('onkeyup','validarRegExp(this,\'' + f[k][1] + '\')');
								break;
							}
						}
					}
				}
			break;
		case 'N':
			lbl.attr('for','inpr_informacio').html('Información').appendTo(targetDiv);
			campoTex.attr('id','inpr_informacio').attr('name','inpr_informacio').attr('onkeypress','numerico(event)').val('').appendTo(targetDiv).val(valCarga);
			break;
		case 'A':
			lbl.attr('for','inpr_archivo').html('Archivo adjunto').appendTo(targetDiv);
			campoTex.attr('id','inpr_archivo').attr('name','inpr_archivo').attr('onkeypress','numerico(event)').appendTo(targetDiv).val(valCarga);
			$('<div>').attr('class','boton_carga').html('Elegir...').appendTo(targetDiv);
			$('<input>').attr('type','text').attr('id','inpr_informacio').attr('name','inpr_informacio').val('').css({'display':'none'}).appendTo(targetDiv).val(valCarga);
			new Archivero('inpr_archivo',d[v][8],d[v][6]);
			break;
		case 'O':
			lbl.attr('for','inpr_informacio').html('Seleccione').appendTo(targetDiv);
			campoTex.remove();
			$('<select>').attr('id','inpr_informacio').attr('name','inpr_informacio').appendTo(targetDiv).val(valCarga);
			new Combo('dettipifica','inpr_informacio',false,$('#tip_ideregistro').val());
			break;
		case 'M':
			lbl.attr('for','inpr_informacio').html('Seleccione. Use Ctrl + BIM').appendTo(targetDiv);
			campoTex.remove();
			$('<select>').attr('id','inpr_informacio').attr('name','inpr_informacio').attr('multiple',true).height(35).appendTo(targetDiv).val(valCarga);
			new Combo('dettipifica','inpr_informacio',false,$('#tip_ideregistro').val());
			break;
		case 'F':
			lbl.attr('for','inpr_informacio').html('Información').appendTo(targetDiv);
			campoTex.attr('id','inpr_informacio').attr('name','inpr_informacio').appendTo(targetDiv).val('');
			new Calendario('inpr_informacio');
			break;
		default:
			$('#divRespuesta').html('Este tipo de información no se ha especificado, por favor consulte al administrador del sistema.');
			return false;
			break;
		}
	campoTex.val('');
	}
var onArchiveroCargado=function(campo,archivo){
	switch(campo){
		case 'inpr_archivo':
			$('#inpr_informacio').val(archivo);
			break;	
		}
	}
	
var camposFormulario=function(nForm){
	var nForm=(nForm || 0);
	var camposCaso=new Array();
	var formCampos=new Array();
	//----------------------------------- SE REGISTRAN TODOS LOS CAMPOS CON EL MISMO NOMBRE DE LA DB Y EN MISMO ORDEN
	formCampos[0]='\
	,inpr_ideregistr\
	,inpr_informacio\
	,inpr_estado\
	,inpr_descripcio\
	,inpr_archivo\
	,pro_ideregistro\
	,est_tippropieda\
	,uni_tippropieda\
	,inpr_grpInform\
	,tip_ideregistro\
	,tip_nombre\
	';
	
	for (var Campo in formCampos){
		var C=formCampos[Campo];
		C=C.split(',');
		for(var k=0;k<C.length;k++) C[k]=C[k].trim();C=C.slice(1);
		camposCaso.push(C);
		}
	
	return camposCaso[nForm];
	}
	
		        	