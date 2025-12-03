var f=$(location).attr('search'); f=f.substr(1);	f=f.split('&');	var formulario; for(var k=0;k<f.length;k++){f[k]=f[k].split("=");f[k][0]==='modulo' ? formulario=f[k][1] : f;}
$(function(){
	inicializarForm();	
	cargarEventos();
	cargarEventosGenerales();
//	cconcurr=new contConcurr();
	});

var inicializarForm=function(){// lista de campos con algun comportamiento especial
	fieldsets.noCollapse();
	
	setTimeout(function(){$('#uni_tipsuscripc,#uni_liquidacion').parents('.campo').find('img').hide();},500);
	var cmsus=camposFormulario(1);
	for(var i in cmsus){
		$('#' + cmsus[i]).prop('readonly',true);
		}
	$('#tbl_dnovDetnovedad tbody').empty();
	$('#dsus_ideregistr').hide();
        $('#txt_saldo').val(0);
        this.formatoMoneda('valor_total');
        this.formatoMoneda('txt_saldo');
	$('#dsus_ideregistr_busca,#dsus_pcodigo_busca').attr('onkeypress','numerico(event)').removeAttr('disabled');
	$('#uni_concepto,#con_tipregistro').attr('disabled',true);
	$('#dsus_ideregistr_busca').removeAttr('disabled');
	$('#cic_ideregistro,#per_ideregistro').removeAttr('disabled');
	$('#nov_fecaprovac,#nov_fecprocesad,#nov_genera').attr('disabled',true);
	$('#dnov_vlrunitari,#dnov_cantidad').attr('onkeypress','decimal(event)');
	$('#dnov_vlrtotal').attr('readonly',true).on('click',function(){
		if (!isNaN($('#dnov_vlrunitario,#dnov_cantidad').val()) && $('#dnov_vlrunitario,#dnov_cantidad').val().length>0){
			$('#dnov_vlrtotal').val(+($('#dnov_vlrunitari').val()) * (+($('#dnov_cantidad').val())));
			}
		});
	$('#nov_estado,#cic_ideregistro,#per_ideregistro').empty();
	new Combo('estado','nov_estado',false,'AE');

	$('#' + formulario).on('reset',function(){
//		if ($('#ter_nomcompleto').val()!==''){
//			if (!confirm('Desea borrar los datos que están diligenciados?'))
//				return false;
//			}
		inicializarForm();
		cuadrosBusqueda.cuadros[1].mostrarBusqueda()
		});
	return true;
	}
var cargarDatosIniciales=function(){
	
	};
var mostrarAlertaSaldo=function(){
     var saldo = $('#txt_saldo').val() ; 
     saldo=saldo.replace("$","");
     saldo=saldo.replace(",","");
     saldo=saldo.replace(".","");
     console.log("Ingresando a Alerta de Saldo "+saldo) ;
     if (parseInt(saldo)>=0)
     {
         if(!confirm(" Suscripción con saldo de:  "+ $('#txt_saldo').val() + "  vencido a la fecha, desea continuar con la transacción ? ")){
             return false ;             
         } 
     }
     return true ;
};
        
var cargarEventos=function(){
    
        
	$('#opEditar').on('click',function(){if ($('#nov_ideregistro').val().trim()===''){alert('Por favor seleccione un registro para poder editarlo.');setTimeout(function(){$('#opCancelar').trigger('click');},20);
			return false;};	cconcurr.br('Yw0K','nov_novedad',$('#nov_ideregistro').val());});
	$('#cic_ideregistro').on('change',function(){
		$('#per_ideregistro').empty();
		new Combo('periodo','per_ideregistro',false,$(this).val());
		});
	$('#abrirDetalleNovedad').on('click',function(){
               
                if(!mostrarAlertaSaldo())
                    return false;
                
		if (!$('#nov_ideregistro').val()){$('#divRespuesta').html('No existe una novedad seleccionada o creada para esta acción.');return false};
		var args='&nov_ideregistro=' + $('#nov_ideregistro').val();
		args+='&cic_ideregistro=' + $('#cic_ideregistro').val();
		args+='&per_ideregistro=' + $('#per_ideregistro').val();
		args+='&dsus_ideregistr=' + $('#dsus_ideregistr').val();
                args+='&uni_liquidacion=' + $('#uni_liquidacion').val();
		formPopup(urlVariables.modulo + '_detalle',args);
		});
	$('#' + formulario).on('submit',function(){// envío del formulario	
		if($("#dsus_ideregistr").val().trim()===''){
			$('#divRespuesta').html('Debe seleccionar una suscripción.');
			return false;
			}
	    var args="accion=s";
	    if ($('#nov_ideregistro').val()!==''){args="accion=e";}
		args+='&nov_ideregistro=' + $('#nov_ideregistro').val();
		args+='&nov_fecaprovac=' + $('#nov_fecaprovac').val();
		args+='&nov_observacion=' + $('#nov_observacion').val();
		args+='&cic_ideregistro=' + $('#cic_ideregistro').val();
		args+='&per_ideregistro=' + $('#per_ideregistro').val();
                args+='&dsus_ideregistr=' + $('#dsus_ideregistr').val();
		new consultaAjax(formulario,false,args).success(function(response){
			if (isNaN(response)){
				$('#divRespuesta').html('No se ha podido completar la accion, Suscripcion ya tiene un registro para el periodo actual');
				}
			else{
				$('#nov_ideregistro').val(response.trim());
				$('#divRespuesta').html('Se grabó la novedad, ya puede adicionar conceptos.');
				}
			});
		return false;	
		});
	$('#' + formulario).on('reset',function(){$('#tbl_dnovDetnovedad').find('tbody').empty();});
	}

var buscarSuscripcionNovedad=function(){
	var args="accion=c&accion_m=Suscripcion";
	args+='&nov_ideregistro=' + $('#nov_ideregistro').val();
	new consultaAjax(formulario,false,args).success(function(response){
		cargarDatos(response,1);
                $('#cic_ideregistro').empty();
		new Combo('ciclo','cic_ideregistro',false,'suscripcion',$('#dsus_ideregistr').val());
		});
	}
var cargarDetalleNovedad=function(){
	var args="accion=c&accion_m=DetalleNovedad";
	args+='&nov_ideregistro=' + $('#nov_ideregistro').val();
	new consultaAjax(formulario,false,args).success(function(response){
		cargarTabla(response,'tbl_dnovDetnovedad');
		ajustaTabla('tbl_dnovDetnovedad');
		});
	}
var eliminarDetalleNovedad=function(args){
         $('#valor_total').val(0); 
	var args="accion=x&accion_m=eliminarDetalleNovedad"+args;
        if(confirm("Confirma la Eliminación de la Novedad")){
	new consultaAjax(formulario,false,args).success(function(response){
		cargarDetalleNovedad();
		});      
                } }
            
var ajustaTabla=function(tabla){
	if ($('#'+tabla).find('td[alt=Vacio]').length===1){return false;}
        var valorTotal=0 ;
        $('#valor_total').val(0); 
	switch(tabla){
		case 'tbl_dnovDetnovedad':
			$('#tbl_dnovDetnovedad tbody tr').each(function(){				
				$(this).find('td').eq(0).hide();
				var ntd=$('<td>');
                                valorTotal += parseInt(($(this).find('td').eq(6).html()));                                
                                $('#valor_total').val(valorTotal); 
				var espedit=$(this).find('td').eq(6).after(ntd);
				var idereg=$(this).find('td').eq(0).html();				
				var bnEditar=$('<button>').attr('type','button').html('Editar').on('click',function(){					
					var args='&nov_ideregistro=' + $('#nov_ideregistro').val() + '&dnov_ideregistr=' + idereg;
					args+='&cic_ideregistro=' + $('#cic_ideregistro').val();
					args+='&per_ideregistro=' + $('#per_ideregistro').val();
					args+='&dsus_ideregistr=' + $('#dsus_ideregistr').val();
					formPopup(urlVariables.modulo + '_detalle',args);
					}).appendTo(ntd);
                              	var bnEliminar=$('<button>').attr('type','button').html('Eliminar').on('click',function(){					
					var args='&nov_ideregistro=' + $('#nov_ideregistro').val() + '&dnov_ideregistr=' + idereg;
					eliminarDetalleNovedad(args,idereg);
					}).appendTo(ntd);	         
				});
			break;	
		}	
	
	}

//aqui se cargan los datos al formulario
var onCargarDatos=function(c){
	switch(+c){
		case 0:			
			buscarSuscripcionNovedad();
			cargarDetalleNovedad();
			break;
		case 1:
			und_tipsuscripc.refrescar();
			und_liquidacion.refrescar();
			break;
		}	
	}
var onCargarBusqueda=function(a,b,c){
	switch(b){
		case 1:
			cargarCicloPeriodoSuscripcion(a);
			break;
		}
	}
var cargarCicloPeriodoSuscripcion=function(dsus_ideregistr){
	new Combo('ciclo','cic_ideregistro',false,'suscripcion',dsus_ideregistr);
	}
var onCargarCuadroBusqueda=function(s){
	$('input[name=b_dsus_iniestado]').attr('id','b_dsus_iniestado');
	$('input[name=b_dsus_finestado]').attr('id','b_dsus_finestado');
	new Calendario('b_dsus_iniestado');
	new Calendario('b_dsus_finestado');
	$('input[name=b_ter_documento],input[name=b_dsus_ideregistr],input[name=b_sus_ideregistro],input[name=b_nov_ideregistro],input[name=b_uni_liquidacion]').attr('onkeypress','entero(event)')
	}
var onCierraFormPopup=function(){
	cargarDetalleNovedad();
	}
var camposFormulario=function(nForm){
	var nForm=(nForm || 0);
	var camposCaso=new Array();
	var formCampos=new Array();
	//----------------------------------- SE REGISTRAN TODOS LOS CAMPOS CON EL MISMO NOMBRE DE LA DB Y EN MISMO ORDEN
	formCampos[0]='\
	,nov_ideregistro\
	,nov_fecaprovac\
	,nov_fecprocesad\
	,nov_observacion\
	,cic_ideregistro\
	,per_ideregistro\
	';
	
	formCampos[1]='\
	,dsus_ideregistr\
	,uni_tipsuscripc\
	,dsus_pcodigo\
	,ter_nomcompleto\
	,pro_idepropieda\
	,uni_liquidacion\
	,uni_municipio\
	,uni_barrio\
	,cnre_nombre\
	,txt_saldo\
        ';

	for (var Campo in formCampos){
		var C=formCampos[Campo];
		C=C.split(',');
		for(var k=0;k<C.length;k++) C[k]=C[k].trim();C=C.slice(1);
		camposCaso.push(C);
		}
	
	return camposCaso[nForm];
	}
 var formatoMoneda= function (nombreSelector){
        $('#' + nombreSelector).inputmask('decimal',
                {'alias': 'numeric',
                    'groupSeparator': ',',
                    'autoGroup': true,
                    'digits': 0,
                    'radixPoint': ".",
                    'digitsOptional': false,
                    'allowMinus': false,
                    'prefix': '$',
                    'placeholder': '0'
                });

    };        
//El push es un string. Blanco para omitir temporalmente. formato 'xxxxxx,yyyyyy' obligatorio. No habrá soporte para cualquier otro formato de valor.	
var ic=0;cuadrosBusqueda.campos.push({llave:'nov_ideregistro',accionm:'cargarResultadoNovedad',columnas:new Array(),params:undefined});
cuadrosBusqueda.campos[ic].columnas.push('ter_nombre,Nombre');
cuadrosBusqueda.campos[ic].columnas.push('ter_documento,Cedula / Nit');
cuadrosBusqueda.campos[ic].columnas.push('dsus_ideregistr,Id de Suscripción');
cuadrosBusqueda.campos[ic].columnas.push('dsus_pcodigo,Codigo Anterior');
cuadrosBusqueda.campos[ic].columnas.push('sus_ideregistro,Id de Suscriptor');
cuadrosBusqueda.campos[ic].columnas.push('uni_liquidacion,Id de Liquidación');
cuadrosBusqueda.campos[ic].columnas.push('dsus_iniestado,Fecha de inicio');
cuadrosBusqueda.campos[ic].columnas.push('dsus_finestado,Fecha finaliza');
cuadrosBusqueda.campos[ic].params={
	ayudaCuadro:"Use los criterios de búsqueda para encontrar las novedades.",
	tituloTabla:"Novededades",
	columnasTabla:"#,Nombre de Tercero,Fecha de Novedad,Liquidación"
	};
ic++;cuadrosBusqueda.campos.push({llave:'dsus_ideregistr',accionm:'cargarResultadoSuscripcion',accionmb:'cuadroBusquedaConsultaSus',columnas:new Array(),params:undefined});
cuadrosBusqueda.campos[ic].columnas.push('ter_nombre,Nombre');
cuadrosBusqueda.campos[ic].columnas.push('ter_documento,Cedula / Nit');
cuadrosBusqueda.campos[ic].columnas.push('dsus_ideregistr,Id de Suscripción');
cuadrosBusqueda.campos[ic].columnas.push('dsus_pcodigo,Codigo Anterior');
cuadrosBusqueda.campos[ic].columnas.push('sus_ideregistro,Id de Suscriptor');
cuadrosBusqueda.campos[ic].columnas.push('uni_liquidacion,Id de Liquidación');
cuadrosBusqueda.campos[ic].params={
	ayudaCuadro:"Use los criterios de búsqueda para encontrar la suscripción.",
	tituloTabla:"Suscripciones",
	columnasTabla:"#,Nombre de Tercero,Liquidación,Codigo Anterior"
	};