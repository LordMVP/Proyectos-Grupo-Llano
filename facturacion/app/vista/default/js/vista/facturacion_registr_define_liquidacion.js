//var tablaForm=new Array('liq_liquidacion');	//array de tablas existentes en el documento
var f=$(location).attr('search'); f=f.substr(1);	f=f.split('&');	var formulario; for(var k=0;k<f.length;k++){f[k]=f[k].split("=");f[k][0]==='modulo' ? formulario=f[k][1] : f;}
$(function(){
	//sessionStorage[formulario + 'Consulta']="select * from " + tablaForm[0];
	inicializarForm();	
	});

var inicializarForm=function(){// lista de campos con algun comportamiento especial
	actualizarDependencias();
	return true;
	}

//actualización de dependencias de los registros
var iframeSrc=new Array();
iframeSrc.push('programa.php?modulo=facturacion_registr_define_liquidacion_conceptos');
iframeSrc.push('programa.php?modulo=facturacion_registr_define_liquidacion_relconceptos');
iframeSrc.push('programa.php?modulo=facturacion_registr_define_liquidacion_rangos');
iframeSrc.push('programa.php?modulo=facturacion_registr_define_liquidacion_contabiliza');
iframeSrc.push('programa.php?modulo=facturacion_registr_define_liquidacion_liquidacion');

var actualizarDependencias=function(evitar){
	var k=0;
	$('iframe').each(function(){
		//alert(evitar);
		if (k!==evitar){
			$(this).attr('src',iframeSrc[k] + '&idereferencia=' + $("#cic_ideregistro").val());
			}		
		k++;
		});
	}
 	