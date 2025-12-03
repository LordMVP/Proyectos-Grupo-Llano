var f=$(location).attr('search'); f=f.substr(1);	f=f.split('&');	var formulario; for(var k=0;k<f.length;k++){f[k]=f[k].split("=");f[k][0]==='modulo' ? formulario=f[k][1] : f;}
var ctasGraba='';
$(function(){
	inicializarForm();	
	cargarEventos();
	cargarEventosGenerales();
	});

var inicializarForm=function(){// lista de campos con algun comportamiento especial
	cconcurr=new contConcurr();
	cargarConceptoSeleccionado();
	if($('#uni_concepto_nombre')) cargarCuentas();
	//cargarCuentas();
	return true;
	}
	
var cargarEventos=function(){
	$('#opNuevo').on('click',function(){cargarConceptoSeleccionado();cargarCuentas();});
	$('#opEditar').on('click',function(){if ($('#uni_concepto').val().trim()===''){alert('Por favor seleccione un registro para poder editarlo.');setTimeout(function(){$('#opCancelar').trigger('click');},20);
			return false;};	cconcurr.br('Yw0K','cocc_concencost',$('#uni_concepto').val());});
	$('#getContab').on('click',function(){window.open('programa.php?modulo=facturacion_registr_define_liquidacion_contabiliza','_self')});
	$('#getArea').on('click',function(){window.open('programa.php?modulo=facturacion_registr_define_liquidacion_contabarea','_self')});
	$('#getCco').on('click',function(){window.open('programa.php?modulo=facturacion_registr_define_liquidacion_contabccto','_self')}).css({'background' : '#CADCFE','color' : '#0066CC'});
    $('#getPres').on('click',function(){window.open('programa.php?modulo=facturacion_registr_define_liquidacion_presupuesto','_self')});
	$('#btAdicionar').on('click',function(){
		var t1=$('<tr>').html('<td>'+ selId +'</td><td>'+ selTarCodi +'</td><td>'+ selCuenta +'</td><td><input type="text"  id="inputdeb" value="100" size="3"/></td>');
			$('#CuentaSelect').append(t1);
			$('#inputdeb').attr('onkeypress','decimal(event)');
        	if(selId===undefined)
        		ReiniciarCtas();
		});	
    $('#btConfirma').on('click',function(){
    	(ctasGrabar()) ? $('#opGrabar').prop('disabled', false):$('#opGrabar').prop('disabled', true);
		});
    $('#btReinicia').on('click',function(){
    	ReiniciarCtas();
    	bloqueaInput(false);	
    	//alert('Cuentas:'+ctasGraba);
		});		
	$('#uni_documento').on('change',function(){
		$('#uni_liquidacion').empty();
		new Combo('liquidacion','uni_liquidacion',false, $(this).val());
		});

		// al seleccionar debito o credito prende los botones y bloquea los campos delformulari
		
	$('#' + formulario).on('submit',function(){// envío del formulario
		var idereg='';//$('#codo_ideregistr').val();
		var argumentos;
		var accion;
		if(idereg===''){
			argumentos="&accion=s";
			accion='s';
			argumentos+='&emp_ideregistro=' + $('#emp_ideregistro').val();
			//argumentos+='&uni_concepto=' + $('#uni_concepto').val();
			argumentos+='&ctasGraba=' + ctasGraba;
			//alert("Accion="+accion+"  ARG="+argumentos);			
			}
			
	    a=new consultaAjax(formulario,true,argumentos);
		var respuesta=a.success(function(response){
		if (accion==='s') {
		 	$('#opGrabar').prop('disabled', true);
	 		cargarCuentas();
			}
		$('#divRespuesta').html(response);			
		});		
		 return false;	
		});
		
	//*****************************************************************Botones de Formulario --INICIO
	
	//*****************************************************************Botones de Formulario --FIN	 
	}
var cargarConceptoSeleccionado=function(){
	var argumentos="accion=c&accion_m=concepto_prin&uni_concepto=" + sessionStorage.facturacion_registr_define_liquidacion_conceptos;
	//alert(argumentos);
	var a=new consultaAjax(formulario,false,argumentos);
	var respuesta=a.success(function(response){
		//$('#divRespuesta').html(response);
		cargarDatos(response,1);
		});
		

  	$('#opGrabar').prop('disabled', true);
  	$('#opEliminar').prop('disabled', true);
	  	
	if (sessionStorage.facturacion_registr_define_liquidacion_conceptos){	
		$('#btConfirma').prop('disabled', false);	
		$('#btAdicionar').prop('disabled', false);	
		}
	else {
		$("#divRespuesta").html('Por favor complete la información antes de seleccionar cuentas!!');
		$('#btConfirma').prop('disabled', true);	
    	$('#btAdicionar').prop('disabled', true);	
		}		
	}
var cargarCuentas=function(){
	var datos='accion=c&accion_m=Cuentas&cue_ideregistro=1' ;
	var respuesta= new consultaAjax(formulario,false,datos).success(function(response){
		cargarTabla(response,'Cuentas','radio');
		ajustaTabla();
		});
//alert (sessionStorage.facturacion_registr_define_liquidacion_conceptos);
		if 	(sessionStorage.facturacion_registr_define_liquidacion_conceptos)	{
			datos='accion=c&accion_m=tablaDoc&uni_concepto='+sessionStorage.facturacion_registr_define_liquidacion_conceptos;
			respuesta= new consultaAjax(formulario,false,datos).success(function(response){
			//$('#divRespuesta').html(response);
			cargarTabla(response,'tablaDoc');
			ajustaTabla2();
		});
		$("#divRespuesta").html('Por favor complete la información antes de seleccionar cuentas!!');
		}
		else
			$("#divRespuesta").html('Para accesar esta opcion debe Seleccionar un Concepto!!');
	}
var selCuenta;
var selId;
var selTarCodi
var ajustaTabla=function(){
	$('#Cuentas').find('tr').each(function(){
		var k=0;
		$(this).find('td').each(function(){
			switch(k){
				case 0:
					var jRadio=$(this).find('input').map(function(){return this;});
					$(jRadio).on('click',function(){
						var contColumna=0;
						var abuelo=$(this).parent().parent();
						$(abuelo).find('td').each(function(){							
							if(contColumna===3){
								selCuenta=$(this).html();
								}
							if(contColumna===2){
								selTarCodi=$(this).html();
								}								
							if(contColumna===1){
								selId=$(this).html();
								}
							contColumna++;							
							});												
						//buscaConceptos($(this).val());
						});
					break;

				}
			k++;
			})
		});
	}

var ajustaTabla2=function(){
	$('#tablaDoc').find('tr').each(function(){
		var k=0;
		$(this).find('td').each(function(){
			switch(k){
				case 0:
					var jRadio=$(this).find('input').map(function(){return this;});
					$(jRadio).on('click',function(){
						//alert($(this).val());
						//buscaConceptos($(this).val());
						});
					break;
				

				}
			k++;
			})
		});
	}	

//aqui se cargan los datos al formulario


var onCargarDatos=function(){
	
	}
var onUnidSeleccion=function(){
	$('#uni_documento').empty();
	new Combo('documento','uni_documento',false, arguments[0]);
	}
var datosComboDocumento,datosComboLiquidacion;
var onComboLoad=function(){
	if(arguments[1]==='uni_documento'){
		var datos=arguments[0];
		datosComboDocumento=datos;
		new Combo('liquidacion','uni_liquidacion',false, $('#uni_documento').val());
		}
	if(arguments[1]==='uni_liquidacion'){
		var datos=arguments[0];
		datosComboLiquidacion=datos;
		}
	}

var ctasGrabar=function(){
    ctasGraba="";
	var totalDeb = 0,  msgError="";    
	$('#CuentaSelect tr').each(function () {
		var pk = $(this).find("td").eq(0).html();
		if (!isNaN(pk)){
			var cTar = $(this).find("td").eq(1).html();	
			var cPor = $($($(this).find("td").eq(3)).find('input')[0]).val();			
			if (cPor<1 || cPor>100){
			    msgError="Hay porcentajes fuera de Rango..";
				}
			if($(this).find("td").eq(2).html()){
				totalDeb+=+cPor;
				ctasGraba+=":"+pk+';'+cTar+';NULL;0;' + cPor;
				}
			}
		});
	if(totalDeb!=100 ){
        msgError+="...Pocentaje Diferente al 100%";	
		}
	$('#divRespuesta').html('*TOTAL %:'+totalDeb +' '+msgError);
	if(msgError==="")
	   return true;
	else
	   return false;	
	}

var ReiniciarCtas=function(){
	$('#CuentaSelect').find("tbody").empty();
	}
	
var camposFormulario=function(nForm){
	var nForm=(nForm || 0);
	var camposCaso=new Array();
	var formCampos=new Array();
	//----------------------------------- SE REGISTRAN TODOS LOS CAMPOS CON EL MISMO NOMBRE DE LA DB Y EN MISMO ORDEN
	formCampos[0]='\
	cocc_ideregistr\
	,uni_concepto\
	,emp_ideregistro\
	,cue_tarcodi\
	,cue_ideregistro\
	,cocc_porcentaje\
	,est_concepto\
	';
	formCampos[1]='\
	cocc_ideregistr\
	,uni_concepto\
	,est_concepto\
	,uni_concepto_nombre\
	';	
	for (var Campo in formCampos){
		var C=formCampos[Campo];
		C=C.split(',');
		for(var k=0;k<C.length;k++) C[k]=C[k].trim();C=C.slice(1);
		camposCaso.push(C);
		}
	
	return camposCaso[nForm];
	}
	
/*
<!--
Tabla cocc_concencost  cocc_ideregistr,uni_concepto,emp_ideregistro,cue_tarcodi,cue_ideregistro,cocc_porcentaje,est_concepto
SELECT "emp_ideregistro"
		,"cue_tarcodi"
		,"cue_codigo"
		,"cue_nombre"
		,"cue_conseven"
		,"cue_ideregistro"
	FROM "public"."cue_cuenta"
"emp_ideregistro" = empresa
,"uni_documento" = documento seleccionado
,"uni_tipdocument" = tipo de documento seleccionado
,"cue_idedebito" = cue_tarcodi
,"cue_tardebito" = cue_tarcodi
,"cue_idecredito" = cue_tarcodi
,"codo_porcentaje" = por ahora dejar 100%
,"cue_tarcredito" = cue_tarcodi
,"uni_concepto" = codigo de concepto que agarra desde el sessionStorage.concepto
,"uni_liquidacion" = codigo de la liquidacion, haciendo consulta a liq_liquidacion con el tipo de documento y documento seleccionados
,"codo_ideregistr" = consec
,"est_documento" = estructura del documento
,"est_tipdocument" = estructura del tipo de documento, en el formulario est_unitipdocumento
,"est_concepto" = consulta a la tabla de conceptos donde el codigo del concepto sea = al codigo de sessionStorage.concepto
,"est_liquidacion" = codigo de estructura que trae de la liquidacion	-->"*/
		        	