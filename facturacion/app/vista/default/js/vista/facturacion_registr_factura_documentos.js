var f=$(location).attr('search'); f=f.substr(1);	f=f.split('&');	var formulario; for(var k=0;k<f.length;k++){f[k]=f[k].split("=");f[k][0]==='modulo' ? formulario=f[k][1] : f;}
$(function(){
	inicializarForm();	
	cargarEventos();
	cargarEventosGenerales();
	cargarConcepto(urlVariables.idereferencia);
	delete sessionStorage.facturacion_registr_factura_mifactura;
	
	});
var inicializarForm=function(){// lista de campos con algun comportamiento especial
	$('#prg_ideregistro,#cic_ideregistro').removeAttr('disabled');
	$('#con_nombre').attr('readonly',true);
	$('#con_inivigencia').val(fecha.hoy);
	new Combo('documento','uni_documento',true,'F',urlVariables.idereferencia);
	return true;
	}
var cargarEventos=function(){
	$('#cmdFiltrar').on('click',function(){
		filtrarDocumentos();
		});
	$('#uni_documento').on('change',function(){
		$('#uni_tipdocument').empty();
		new Combo('tipo_documento','uni_tipdocument',true,$(this).val());
		});
	$('#opNuevo').on('click', function(){setTimeout(actualizarDependencias,250);});	
	$('#fac_ideregistro').on('change',function(){
		cargarConcepto();
		});
    $('#btConfirma').on('click',function(){
     //tblAjustes();
		});		
		
		
	$('#' + formulario).on('submit',function(){// envío del formulario
		var argumentos="accion=s";
		var a=new consultaAjax(formulario,true,argumentos);
		var respuesta=a.success(function(response){
			$('#divRespuesta').html(response);
			cargarConcepto();
			});		
		return false;	
		});
	//*****************************************************************Botones de Formulario --INICIO
	
	//*****************************************************************Botones de Formulario --FIN	 
	}
var eliminarRegistro=function(){
	var idereg=$('input[name=Conceptos_ide]:checked').val();
	var datos='accion=x&uni_concepto=' + idereg;
	var respuesta= new consultaAjax(formulario,false,datos).success(function(response){
		cargarConcepto();
		$('#divRespuesta').html(response);
		});
	}

var onCargarDatos=function(){

	}

var cargarConcepto=function(idbuscado){	
	var datos='accion=c&accion_m=tabla&idbuscado=' + idbuscado;
	var respuesta= new consultaAjax(formulario,false,datos).success(function(response){
		cargarTabla(response,'Conceptos');
		//ajustaTabla();
		sessionStorage.removeItem(formulario);	
		});
	}

var ajustaTabla=function(){
	$('input[name=Conceptos_ide]').on('click',function(){
		sessionStorage[formulario]=$(this).val();
		consultarConcepto($(this).val());
		parent.actualizarDependencias(0);		
		});	
	}
var filtrarDocumentos=function(){
	var liq,doc,tid,tiu,cic;
	liq=$('#uni_liquidacion').val();
	doc=$('#uni_documento').val();
	tid=$('#uni_tipdocument').val();
	tiu=$('#uni_tipusosuscr').val();
	cic=$('#cic_ideregistro').val();
	var args='accion=c&accion_m=filtrar&idbuscado=' + urlVariables.idereferencia;
	if (liq){args+='&uni_liquidacion=' + liq;}
	if (doc){args+='&uni_documento=' + doc;}
	if (tid){args+='&uni_tipdocument=' + tid;}
	if (tiu){args+='&uni_tipusosuscr=' + tiu;}
	if (cic){args+='&cic_ideregistro=' + cic;}
	new consultaAjax(formulario,false,args).success(function(response){
		cargarTabla(response,'Conceptos');
		});
	}
/*var tblAjustes=function(){
	$('#Conceptos tbody tr').each(function(){
		var t1=$('<tr>').html('<td>'+ $(this).find('td').eq(0).html() +'</td><td><input type="text"  id="sumar" value="0" /></td><td><input type="text"  id="restar" value="0" /></td><td>'+ $(this).find('td').eq(4).html() +'</td>');
		$('#Ajustes').append(t1);	
	});
	}	*/
	
	//$('#CuentaSelect tr').each(function () {
	//	var pk = $(this).find("td").eq(0).html();	
	
//aqui se cargan los datos al formulario


	/*
	// fac_ideRegistro,fac_estado,uni_tipSuscripc,emp_ideRegistro,fac_numero,uni_documento,fac_fecha,cic_ideRegistro,per_ideRegistro,uni_tipDocument,ter_ideRegistro,sus_ideRegistro,fac_ideOrigen,fac_ideActual

	*/	        	