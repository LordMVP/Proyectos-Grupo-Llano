var f=$(location).attr('search'); f=f.substr(1);	f=f.split('&');	var formulario; for(var k=0;k<f.length;k++){f[k]=f[k].split("=");f[k][0]==='modulo' ? formulario=f[k][1] : f;}
$(function(){
	inicializarForm();	
	cargarEventos();
	cargarEventosGenerales();
	});

var inicializarForm=function(){// campos con algun comportamiento especial
	$('#cic_ideregistro,#con_ideregistro_sel').removeAttr('disabled');
	$('#concepto_vlrunitari,#concepto_cantidad,#concepto_vlrtotal').attr('onkeypress','decimal(event)');
	$('#documentos').hide();
	
	return true;
	}
var cargarEventos=function(){
	$('#con_ideregistro_sel').on('change',function(){
		cargarConcepto($(this).val());
		});
	$('#cmdBuscar').on('click',function(){
		if ($('#cic_ideregistro').val()!='' && $('#uni_liquidacion').val()!=''){
			cargarPeriodos();
			cargarDocumentos();
			}
		else{
			$('#divRespuesta').html('Para la búsqueda es necesario que seleccione al menos un ciclo y una liquidación.');
			}
		});
	
	$('#cmdAceptarConc').on('click',function(){
		aceptarConcepto();
		});
	
	$('#metodo_selec').on('change',function(){		
		switch($(this).val()){
			case 'P':
				$('#periodos').fadeIn();
				$('#documentos').hide();
				break;
			case 'F':
				$('#periodos').hide();
				$('#documentos').fadeIn();
				break;
			}
		});
	$('#cmdEliminarConc').on('click',function(){
		$('#concepto_vlrunitari,#concepto_cantidad,#concepto_vlrtotal,#con_ideregistro_sel').val('');
		$('#conceptoRelacionado tbody').fadeOut(function(){$(this).empty().show();});
		});	
	$('#' + formulario).on('submit',function(){// envío del formulario
		var argumentos='accion=g';
		if ($('#metodo_selec').val()==='P'){
			argumentos+='&tipsel=P';
			//argumentos+='&periodos=' + $('input[name=periodos_ide]:checked').val();
			}
		else if ($('#metodo_selec').val()==='F'){
			argumentos+='&tipsel=F';
			}
		var conceptos='';
		$('#conceptoRelacionado').find('tbody tr').each(function(){
			$(this).find('td').each(function(){
				conceptos+=$(this).html() + '||';
				});
			conceptos=conceptos.substr(0,conceptos.length-2);
			conceptos+='@_@';
			});
		conceptos=conceptos.substr(0,conceptos.length-3);
		argumentos+='&conceptos=' + conceptos;
		if (validaFormulario()){
			new consultaAjax(formulario,true,argumentos).success(function(response){			
				//$('#divRespuesta').html(response);
				});	
			}
		return false;
		});
	}
var aceptarConcepto=function(){
	if (isNaN($('#concepto_vlrunitari').val()) || isNaN($('#concepto_cantidad').val()) || $('#concepto_vlrunitari').val()==='' || $('#concepto_cantidad').val()===''){
		$('#divRespuesta').html('Debe completar los campos de concepto y cantidad correctamente.');		
		return false;
		}
	$('#concepto_vlrtotal').val(+$('#concepto_cantidad').val() * (+$('#concepto_vlrunitari').val()));
	var conid=$('#con_ideregistro_sel').val();
	var rep=false;
	$('#conceptoRelacionado tbody tr').each(function(){if ($(this).find('td').eq(0).html()===conid) {$('#divRespuesta').html('No puede registrar de nuevo este concepto.');rep=true;return false;}});
	if (rep) return false; 
	var fila='<td>' + conid  + '</td>';
	fila+='<td>' + $('#con_ideregistro_sel option:selected').text() + '</td>';
	fila+='<td>' + $('#concepto_vlrunitari').val() + '</td>';
	fila+='<td>' + $('#concepto_cantidad').val() + '</td>';
	fila+='<td>' + $('#concepto_vlrtotal').val() + '</td>';
	fila='<tr>' + fila + '</tr>';
	$('#conceptoRelacionado tbody').html($('#conceptoRelacionado tbody').html() + fila);
	}
var validaFormulario=function(){	
	return true;
	}
var datos_concepto;

var onComboLoad=function(datos,campo){
	switch(campo){
		case 'con_ideregistro_sel':
			datos_concepto=datos;
			break;			
		}
	}
var onUnidSeleccion=function(a,b,c){
	switch (+b){
		case 3:
			$('#con_ideregistro_sel').empty();
			new Combo('concepto','con_ideregistro_sel',true,'V',a);
			break;
		}
	}
var cargarConcepto=function(val){
	if (!val) return false;
	var tipregistro=datos_concepto[+val][0];
	
	var valor=datos_concepto[+val][1];
	$('#concepto_vlrunitari,#concepto_cantidad,#concepto_vlrtotal').val('');
	switch(tipregistro){
		case 'T':
			if (valor){
				$('#concepto_vlrunitari').val(valor).attr('readonly',true);
				$('#concepto_cantidad').attr('readonly',false);						
				}
			else{
				$('#concepto_vlrunitari').attr('readonly',false);
				$('#concepto_cantidad').attr('readonly',false);	
				}											
			$('#concepto_vlrtotal').attr('readonly',true);
			break;
		case 'C':
			$('#concepto_cantidad').val(valor).attr('readonly',false);								
			$('#concepto_vlrunitari').val('1').attr('readonly',true);	
			$('#concepto_vlrtotal').attr('readonly',true);
			break;
		case 'U':
			$('#concepto_vlrunitari').val(valor).attr('readonly',false);
			$('#concepto_cantidad').val('1').attr('readonly',true);
			$('#concepto_vlrtotal').attr('readonly',true);
			break;
		}	
	}
	
var cargarPeriodos=function(){	
	var argumentos='accion=c&accion_m=periodo&cic_ideregistro=' + $('#cic_ideregistro').val();
	new consultaAjax(formulario,true,argumentos).success(function(response){			
		cargarTabla(response,'periodos','checkbox');
		});
	}

var cargarDocumentos=function(){
	var argumentos='accion=c&accion_m=documentos&cic_ideregistro=' + $('#cic_ideregistro').val();
	argumentos+='&uni_liquidacion=' + $('#uni_liquidacion').val();
	argumentos+='&uni_tipsuscripc=' + $('#uni_tipsuscripc').val();
	argumentos+='&uni_tipusosuscr=' + $('#uni_tipusosuscr').val();
	new consultaAjax(formulario,true,argumentos).success(function(response){
		//$('#divRespuesta').html(response);
		cargarTabla(response,'documentos','checkbox');
		});
	}
/**/