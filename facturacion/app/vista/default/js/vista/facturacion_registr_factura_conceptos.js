var f=$(location).attr('search'); f=f.substr(1);	f=f.split('&');	var formulario; for(var k=0;k<f.length;k++){f[k]=f[k].split("=");f[k][0]==='modulo' ? formulario=f[k][1] : f;}
$(function(){
	inicializarForm();	
	cargarEventos();
	cargarEventosGenerales();
        var facturaId = localStorage.getItem('facturacion_registr_factura_mifactura');
        console.log("Rargando conceptos , RECIBIDO facturaid:"+facturaId);
        cargarConcepto(facturaId);
	
	});
var inicializarForm=function(){// lista de campos con algun comportamiento especial
	$('#prg_ideregistro').removeAttr('disabled');
	$('#con_nombre').attr('readonly',true);
	$('#con_inivigencia').val(fecha.hoy)
	return true;
	}
var cargarEventos=function(){
	$('#opNuevo').on('click', function(){setTimeout(actualizarDependencias,250);});	
	$('#fac_ideregistro').on('change',function(){
		cargarConcepto();
		});
//                debugger;
	$('#' + formulario).on('submit',function(){// env�o del formulario
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
	if (!idbuscado) return false;
	delete localStorage.facturacion_registr_factura_mifactura;	
	var datos='accion=c&accion_m=tabla&idbuscado=' + idbuscado;
	var respuesta= new consultaAjax(formulario,false,datos).success(function(response){
                cargarTabla(response,'Conceptos','radio');
		ajustaTabla();
		localStorage.removeItem(formulario);	
		});
	}
var onUnidSeleccion=function(){
	$('#con_nombre,#con_abreviatura').val(arguments[2]);
	}
var ajustaTabla=function(){
	$('input[name=Conceptos_ide]').on('click',function(){
		localStorage[formulario]=$(this).val();
//		consultarConcepto($(this).val());
		parent.actualizarDependencias(0);		
		});	
	}
//var consultarConcepto=function(uni_concepto){
//	var datos='accion=c&accion_m=con_concepto&uni_concepto=' + uni_concepto;
//	var respuesta= new consultaAjax(formulario,false,datos).success(function(response){
//		//$('#divRespuesta').html(response);
//		cargarDatos(response);
//		});
//	}
//aqui se cargan los datos al formulario


	/*
	// fac_ideRegistro,fac_estado,uni_tipSuscripc,emp_ideRegistro,fac_numero,uni_documento,fac_fecha,cic_ideRegistro,per_ideRegistro,uni_tipDocument,ter_ideRegistro,sus_ideRegistro,fac_ideOrigen,fac_ideActual

	*/	        	