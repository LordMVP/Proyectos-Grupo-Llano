var f=$(location).attr('search'); f=f.substr(1);	f=f.split('&');	var formulario; for(var k=0;k<f.length;k++){f[k]=f[k].split("=");f[k][0]==='modulo' ? formulario=f[k][1] : f;}
$(function(){
	var argumentos="accion=i";
	var a=new consultaAjax(formulario,false,argumentos).success(function(response){
		//alert(response);
		});
});