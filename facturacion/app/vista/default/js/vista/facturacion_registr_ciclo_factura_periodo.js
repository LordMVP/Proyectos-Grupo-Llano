var f=$(location).attr('search'); f=f.substr(1);	f=f.split('&');	var formulario; for(var k=0;k<f.length;k++){f[k]=f[k].split("=");f[k][0]==='modulo' ? formulario=f[k][1] : f;}
$(function(){
	inicializarForm();	
	cargarEventos();
	cargarEventosGenerales();
	cargarPeriodo();

	});

var inicializarForm=function(){// lista de campos con algun comportamiento especial
	cconcurr=new contConcurr();
	$('#opNuevo').prop('disabled',true);
	return true;
	}
var cargarEventos=function(){

	$('#per_nombre').on('blur',function(){ // concatena nombre completo
		$(this).val($(this).val().toUpperCase());
		});

	$('#' + formulario).on('submit',function(){// env�o del formulario

	   //alert("Va a grabar");		
	   var argumentos="accion=e";
		var a=new consultaAjax(formulario,true,argumentos);
		var respuesta=a.success(function(response){
			$('#divRespuesta').html(response);
			});	

		return false;	
		});
	//*****************************************************************Botones de Formulario --INICIO
	
	//*****************************************************************Botones de Formulario --FIN	 
	}
var cargarPeriodo=function(){
	var datos='accion=c&cic_ideregistro=' + urlVariables.idereferencia+'&ano='+urlVariables.ano ;
	var respuesta= new consultaAjax(formulario,false,datos).success(function(response){
		//alert(response);
		cargarTabla(response,'Periodos');
		ajustaTabla();
		});
	}
var ajustaTabla=function(){
	$('#Periodos').height(+$('#Periodos').height() + 200);
	$('#Periodos').find('tr').each(function(){
		var k=0;
		var ideReg;
		var fecini;
		$(this).find('td').each(function(){
			switch(k){
				case 0:
					//var jRadio=$(this).find('input').map(function(){return this;});
					ideReg=$(this).html();
					break;
				case 1:
					var iNombre=$('<input>').attr('type','text').attr('id','periodo_' + ideReg).attr('name','periodo_' + ideReg).val($(this).html());
					$(this).html('');
					$(this).append(iNombre);
					break;
				case 2:
					fecini=	$(this).html();
					break;			
				case 4:
					$(this).hide();
					break;
				case 5:
					$(this).hide();
					break;
				case 6:
					$(this).html(obtieneEstado[$(this).html()]);
					var iEstado = $(this).html();
					if (iEstado != 'Cerrado') {
						var iEditar=$('<button style="float: right;" type="button">Editar</button>').attr('id','edit_' + ideReg).on('click',function(){
							sessionStorage['facturacion_registr_ciclo_factura_edperiodo']=ideReg;
							var args='&per_ideregistro=' + ideReg+'&idereferencia='+urlVariables.idereferencia;
							args+='&fi=' + $(this).parents('tr').find('td').eq(2).html();
							args+='&ff=' + $(this).parents('tr').find('td').eq(3).html();
							formPopup(urlVariables.modulo.replace("_periodo", "_edperiodo"),args);
							});
						$(this).append(iEditar);
					}
					break;
				case 7:
					var iActividad=$('<button type="button">Actividades</button>').attr('id','activi_' + ideReg).on('click',function(){
						sessionStorage['facturacion_registr_ciclo_factura_periodo']=ideReg;
						var args='&per_ideregistro=' + ideReg+'&idereferencia='+urlVariables.idereferencia;
						args+='&fi=' + $(this).parents('tr').find('td').eq(2).html();
						args+='&ff=' + $(this).parents('tr').find('td').eq(3).html();
		            	formPopup(urlVariables.modulo.replace("_periodo", "_agenda"),args);
						});
						$(this).html('');
						$(this).append(iActividad);
					break;
				}
			k++;
			})
		});
	}


	        	