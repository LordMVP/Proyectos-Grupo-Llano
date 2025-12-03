var f=$(location).attr('search'); f=f.substr(1);	f=f.split('&');	var formulario; for(var k=0;k<f.length;k++){f[k]=f[k].split("=");f[k][0]==='modulo' ? formulario=f[k][1] : f;}
$(function(){
    console.log(" Recargando facturas ");
    localStorage.removeItem('facturacion_registr_factura_mifactura');
    inicializarForm();
    cargarEventos();
    cargarEventosGenerales();
	//consultarFactura();
});
var inicializarForm=function(){// lista de campos con algun comportamiento especial
	cconcurr=new contConcurr();
    bloqueaInput(true);
    actualizarDependencias();
	this.formatoMoneda('fac_vlrreal');
    return true;
}

var cargarEventos=function(){
	$('#opNuevo,#opEditar').prop('disabled',true);
	$('#opNuevo').on('click', function(){setTimeout(actualizarDependencias,250);});	
	$('#' + formulario).on('submit',function(){// envío del formulario
		var argumentos="accion=s";
		var a=new consultaAjax(formulario,true,argumentos);
		var respuesta=a.success(function(response){
			//cargarConcepto();
    });
        return false;
    });
}
var eliminarRegistro=function(){
	var idereg=$('input[name=Conceptos_ide]:checked').val();
	var datos='accion=x&uni_concepto=' + idereg;
	var respuesta= new consultaAjax(formulario,false,datos).success(function(response){
        //cargarConcepto();
        $('#divRespuesta').html(response);
    });
}
var consultarFactura=function(){
	var datos='accion=c&accion_m=fac_factura&fac_ideregistro=' + $('#fac_ideregistro').val();
	var respuesta= new consultaAjax(formulario,false,datos).success(function(response){
        cargarDatos(response);
//            sessionStorage.setItem('facturacion_registr_factura_mifactura',$('#fac_ideregistro').val());
//	    alert("SESION STORAGE navega registro" +sessionStorage.facturacion_registr_factura_mifactura);	
        bloqueaInput(true);
    });
}
var onCargarDatos=function(){
    actualizarDependencias()

}

var onUnidSeleccion=function(){
    $('#con_nombre,#con_abreviatura').val(arguments[2]);
}
var ajustaTabla=function(){
	$('input[name=Conceptos_ide]').on('click',function(){
//		sessionStorage[formulario]=$(this).val();
//                console.log(sessionStorage);
        consultarFactura($(this).val());
        parent.actualizarDependencias(0);
    });
}
//actualización de dependencias de los registros
var iframeSrc=new Array();
iframeSrc.push('programa.php?modulo=facturacion_registr_factura_conceptos');
iframeSrc.push('programa.php?modulo=facturacion_registr_factura_documentos')
        ;

var actualizarDependencias=function(evitar){
	var k=0;
	$('iframe').each(function(){
		//alert(evitar);
		if (k!==evitar){
			$(this).attr('src',iframeSrc[k] + '&idereferencia=' + $("#fac_ideregistro").val());
        }
        k++;
    });
}

var bloqueaInput=function(opcion){
	var c=camposFormulario();
	for(var k in c){
		$('#' + c[k]).attr("disabled",opcion);
    }
}
var onCargarBusqueda=function(a,b,c){
	switch(b){
        case 0:
	    localStorage.setItem('facturacion_registr_factura_mifactura',$('#fac_ideregistro').val());
            var bandera =localStorage.getItem('facturacion_registr_factura_mifactura'); 
            console.log("Valor Factura oncargarbusqueda: "+  bandera);
            actualizarDependencias();
            break;
    }
}
var cargadoBusca=false;
var onCargarCuadroBusqueda=function(sel){
	if (cargadoBusca) return false;
	switch (+sel){
        case 0:
			var campoest=$('<input>').attr('type','hidden').attr('id','b_est_tipusosuscr').val('2');
			$('input[name=b_uni_tipusosuscr]').attr('id','b_uni_tipusosuscr').after(campoest);
			new comboUnidad('b_est_tipusosuscr','b_uni_tipusosuscr');

			campoest=$('<input>').attr('type','hidden').attr('id','b_est_liquidacion').val('3');
			$('input[name=b_uni_liquidacion]').attr('id','b_uni_liquidacion').after(campoest);
			new comboUnidad('b_est_liquidacion','b_uni_liquidacion');

			var campocont=$('input[name=b_uni_documento]').parents('.campo');
            $('input[name=b_uni_documento]').remove();
			$('<select>').attr('id','b_uni_documento').attr('name','b_uni_documento').on('change',function(){
                $('#b_uni_tipdocument').empty();
				new Combo('tipo_documento','b_uni_tipdocument',true,$(this).val());
            }).appendTo(campocont);
			new Combo('documento','b_uni_documento',true);
			var campocont=$('input[name=b_uni_tipdocument]').parents('.campo');
            $('input[name=b_uni_tipdocument]').remove();
			$('<select>').attr('id','b_uni_tipdocument').attr('name','b_uni_tipdocument').appendTo(campocont);
			cargadoBusca=true;
            break;
    }
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

var camposFormulario=function(nForm){
	var nForm=(nForm || 0);
	var camposCaso=new Array();
	var formCampos=new Array();
		
    //----------------------------------- SE REGISTRAN TODOS LOS CAMPOS CON EL MISMO NOMBRE DE LA DB Y EN MISMO ORDEN
	formCampos[0]='\
	,fac_ideregistro\
	,fac_estado\
	,emp_ideRegistro\
	,fac_numero\
	,uni_documento\
	,fac_fecha\
	,cic_ideRegistro\
	,per_ideRegistro\
	,uni_tipDocument\
	,sus_ideRegistro\
        ,dsus_ideRegistr\
        ,dsus_Pcodigo\
	,fac_ideOrigen\
	,fac_ideActual\
	,ter_nomcompleto\
	,tsu_nombre\
	,est_nombre\
	,pro_catestrato\
	,cic_nombre\
	,fac_vlrreal\
	';
	for (var Campo in formCampos){
		var C=formCampos[Campo];
		C=C.split(',');
		for(var k=0;k<C.length;k++) C[k]=C[k].trim();C=C.slice(1);
        camposCaso.push(C);
    }
    return camposCaso[nForm];
}

var ic=0;cuadrosBusqueda.campos.push({llave:'fac_ideregistro',accionm:'cargarResultado',columnas:new Array()});
cuadrosBusqueda.campos[ic].columnas.push('ter_nombre,Nombre');
cuadrosBusqueda.campos[ic].columnas.push('ter_documento,Cedula / Nit');
cuadrosBusqueda.campos[ic].columnas.push('pro_direccion,Dirección');
cuadrosBusqueda.campos[ic].columnas.push('sus_ideregistro,ID Suscriptor');
cuadrosBusqueda.campos[ic].columnas.push('dsus_ideregistr,ID Suscripción');
cuadrosBusqueda.campos[ic].columnas.push('nov_ideregistro,ID Novedad');
cuadrosBusqueda.campos[ic].columnas.push('uni_tipusosuscr,Tipo de uso');
cuadrosBusqueda.campos[ic].columnas.push('uni_liquidacion,Tipo de liquidación');
cuadrosBusqueda.campos[ic].columnas.push('uni_documento,Documento');
cuadrosBusqueda.campos[ic].columnas.push('uni_tipdocument,Tipo de Documento');
cuadrosBusqueda.campos[ic].columnas.push('dsus_pcodigo,Codigo Anterior');
cuadrosBusqueda.campos[ic].params={
	columnasTabla:"#,Numero,Documento,Fecha,Ciclo,Periodo,Tipo de Documento"
};