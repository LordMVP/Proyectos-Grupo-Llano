/***********************************************************************************************************************************************************
FUNCION PARA LISTAS DESPLEGABLES
************************************************************************************************************************************************************/
var Combo=function(accion,campo){
	var opcion_0=arguments[2];        
	var datos=new Object();
	var jClass=this;
	var parametros='';
	for(var i=3;i<arguments.length; i++){
		parametros+='&param' + (i-2) + '=' + arguments[i];
		}
	 $.ajax({
		type:"POST",
		url:"app/controlador/c.ap.combo.php",
		dataType:"html",
		data:"accion=" + accion + parametros,
		success:function(response){
			/*if (campo==='uni_concepto'){
				alert(response);
				}*/
			var response=response.trim();
			crearComboHTML(response,campo,opcion_0);
			setTimeout(function(){$('#' + campo).trigger('change');},350);
			}
		});
	
	var crearComboHTML=function(response,campo,opcion_0){
		var contenedor=$('#' + campo);
		var combo=response.split("@__@");
		if (opcion_0){
			var o0=$('<option>').attr('value','').html('Seleccione...');
			contenedor.append(o0);
			}
		for (var i in combo){
			var opcion=combo[i].split("@-@");
			var datosRow=new Array();		
			for (var j=2;j<opcion.length;j++){
				datosRow.push(opcion[j]);				
				}
			if (datosRow.length>1){
				datos[opcion[0]]=datosRow;
				}
			else{
				datos[opcion[0]]=datosRow[0];
				}		
			var option=$('<option>')
				.attr('value',opcion[0])
				.html(opcion[1]);
			if (asincDatos[campo]===opcion[0]){
				option.attr('selected','selected');
				}
			contenedor.append(option);
			
			}
		try{onComboLoad(datos,campo)} catch(e){}
		}	
	}
/***********************************************************************************************************************************************************
FUNCION PARA CARGAR UNIDADES
************************************************************************************************************************************************************/
//debe ser declarado como objeto
var comboUnidad=function(est_id,nombre){
	var est2=arguments[2];
	this.estructura=undefined;
	var campoTexto=undefined;
	var campoUnidad=undefined;	
	var contened;
	var jClase=this;
	this.crear=function(est_id,nombre){
		var nombre=(nombre||"uni_ideregistro");
		$('#' + nombre).hide();
		campoUnidad=nombre;
		campoTexto=nombre + 'label';
		if (!est_id){
			alert("Error: La estructura para esta tabla, no ha sido definida.");
			return false;
			}
		else{
			this.estructura=est_id;
			var contenedor=$('#' + est_id).parent();
//                        console.log(contenedor);
                        
			contened=contenedor;			
			var div_app=$('<div>').load('app/vista/default/aplicacion/ap.arbol.php',function(){
				contenedor.find('button:contains("Aceptar")').on('click',function(){seleccionar()});
				;}).attr('id','comboUnidadDiv').attr('class','comboUnidadDiv');
			var div_app_label=$('<input>').attr('type','text').attr('id',nombre + 'label').attr('disabled','disabled').css({'width':'80%'});
			var div_app_lupa=$('<img>').attr('src','app/vista/default/images/lupa.png').attr('alt','Seleccionar...').attr('title','Seleccionar...').css({"float" : "right"}).on('click',function(){div_app.fadeToggle();});
			div_app_label.appendTo(contenedor);div_app_lupa.appendTo(contenedor);div_app.appendTo(contenedor);
			div_app.hide();
			this.cargar();		
			}
		return true;
		}
	this.cargar=function(){
		var k=0;
		var jData=new Array();
		var comb;	
		while (comb=contened.find('#combo_' + k)[0]){
			jData.push(new Array(comb,comb.value));
			k++;
			}	
		var nivelesString='';

		for (var k in jData){
			nivelesString+=jData[k][1].trim() + ';';			
			}		
		nivelesString=nivelesString.substr(0,nivelesString.length-1);
		setTimeout(function(){
			var args='unidAccion=e&clase=' + $('#' + jClase.estructura).val() + '&niveles=' + nivelesString + (est2 ? '&estructura=' + est2 : '');
			$.ajax({
				type:'post',
				dataType:'html',
				context: window,
				url:'app/controlador/c.ap.unidad.php',
				data:args,
				success:function(success){imprimir(success,jData);}
				});},500);		
		}
	var imprimir=function(response,jData){
		//$('#divRespuesta').html($('#divRespuesta').html() + response);
		response=response.trim();
		response=response.substring(response.indexOf('||R||>')+6,response.indexOf('<||R||'));
		contened.find('[id="ap_arbol_sel_box"]').empty();
		contened.find('#cierra_ap_arbol').on('click',function(){contened.find('#comboUnidadDiv').fadeOut();});
		var resTML="";
		var combos=response.split("|__|");
		for(var k in combos){
			combos[k]=combos[k].split("@__@");	
			var select=$('<select>').attr('id','combo_' + k).on('change',function(){
				jClase.cargar();
				});
			var option=$('<option>').attr('value','').html('Seleccione...');
			option.appendTo(select);
			for (var i in combos[k]){
				var opcion=combos[k][i].split("@-@");
				var option=$('<option>').attr('value',opcion[0]).html(opcion[1]);
				select.append(option);
				}
			contened.find('#ap_arbol_sel_box').append(select);
			if(jData[k]){
				select.val(jData[k][1]);
				}			
			}
		}
	var seleccionar=function(){		
		var strID='';
		var ids=contened.find('#ap_arbol').find('select').map(function(){this.value!=='-1' ? strID+=this.value + ';' : false;});
		strID=strID.substr(0,strID.length-1);
		//alert($('#' + jClase.estructura).val());
		$.ajax({
			type:'post',
			dataType:'html',
			context: window,
			url:'app/controlador/c.ap.unidad.php',
			data:'unidAccion=s&seleccionados=' + strID + '&est=' + $('#' + jClase.estructura).val(),
			success:function(success){
				//alert(success);
				var seleccion=success.split(";");
				contened.find('#' + campoUnidad).val(seleccion[0].trim());
				contened.find('#' + campoTexto).val(seleccion[1]);
				contened.find('#comboUnidadDiv').fadeOut();
				try{onUnidSeleccion(seleccion[0],$('#' + est_id).val(),seleccion[1])}catch(e){};
				}
			});		
		}
	this.cargarArbol=function(){
		$.ajax({
			type:'post',
			dataType:'html',
			context: window,
			url:'app/controlador/c.ap.unidad.php',
			data:'unidAccion=a&estructura=' + $('#' + this.estructura).val(),
			success:function(response){			 
				}
			});	
		}
	this.refrescar=function(){
		if ($('#' + campoUnidad).val()===''){return false;}
		$.ajax({
			type:'post',
			dataType:'html',
			context: window,
			url:'app/controlador/c.ap.unidad.php',
			data:'unidAccion=r&uni_ideregistro=' + $('#' + campoUnidad).val(),
			success:function(response){
				contened.find('#' + campoTexto).val(response.trim());
				try{onUnidRefresca(contened.find('#' + campoUnidad).val(),$('#' + est_id).val())}catch(e){};
				}
			});
		}
	this.crear(est_id,nombre);
	
	}
//---------------------------------------CLASE - CARGUE DE UNIDADES
/***********************************************************************************************************************************************************
CLASE PARA MANEJO DE DIRECCIONES
************************************************************************************************************************************************************/
var Direccion=function(campo){
	var campoID=campo;
	var tablaCarga=undefined;
	var timerBusca=0;
	var jText;
	var Nomenclatura=function(campo){		
		var jDiv=$('<div>').attr('class','direccion').html('<h4>Normalizada</h4>');
		var cerrar=$('<div>').attr('id','cierra_direccion').html('x').on('click',function(){
			campo.parent().find('div').remove();
			}).appendTo(jDiv);
		tablaCarga=campo.attr('id') + '_tabla';	
		var jTabla=$('<table>').attr('id',tablaCarga);
		var jTablaHeader=$('<thead>');
		jTabla.append(jTablaHeader);		
		jTablaHeader.append('<th width="5px">#</th>');
		jTablaHeader.append('<th>Opcion</th>');
		jTabla.append('<tbody></tbody>');							
		jText=$('<input>').attr('type','text').attr('size','10').attr('id',campo.attr('id')+'_buscaNom').val(campo.val()).attr('onkeypress','palabraNumeroSinGuion(event)').on('keyup',function(){$(this).val($(this).val().toUpperCase());buscaPalabra($(this).val())});
		jText.appendTo(jDiv);
		campo.parent().find('div').remove();
		jDiv.append(jTabla);
		//jDiv.append('<h4>Complete...</h4>');
		//jDiv.append('<table class="titulo"><tr><th>#</th><th>A</th><th>Sel..</th><th>#</th></tr></table>');
		var numero=$('<input>').attr('type','input').attr('style','width:30px').attr('id','numero').attr('onkeypress','numerico(event)');
		var letra=$('<input>').attr('type','input').attr('style','width:30px').attr('id','letra').attr('onkeypress','letra(event)').attr('maxlength','1');	
		var complemento=$('<select>').attr('style','width:90px').html('<option value=""></option><option value="Bis">Bis</option><option value="Sur">Sur</option><option value="Este">Este</option><option value="Interior">Interior</option><option value="Apto">Apto</option>');
		var numero2=$('<input>').attr('type','input').attr('style','width:30px').attr('id','numero2').attr('onkeypress','numerico(event)');
		var boton=$('<button>').attr('type','button').html('Aceptar').on('click',function(){
			var c1=numero.val().length>0 ? numero.val() + ' ' : '';
			var c2=letra.val().length>0 ? letra.val() + ' ' : '';
			var c3=complemento.val().length>0 ? complemento.val() + ' ' : '';
			var c4=numero2.val().length>0 ? numero2.val() + ' ' : '';
			campo.val(campo.val().trim());
			campo.val(jText.val());	
			campo.val(campo.val().trim());
			cerrar.trigger('click');
			}).appendTo(jDiv);
		campo.after(jDiv);	
		}
	
	var buscaPalabra=function(palabra){		
		var p;
		if (palabra.indexOf(' ')>=0){
			p=palabra.substring(palabra.lastIndexOf(' ')+1,palabra.length-1);
			}
		else{
			p=palabra;
			}
		p=p.trim();
		if (p==='') return false;
		clearTimeout(timerBusca);
		timerBusca=setTimeout(function(){buscar()},1500);
		var datos='accion=n&busca=' + p;
		//alert(datos);
		function buscar(){
			new consultaAjax('ap.direccion',false,datos,-1).success(function(response){
				if (response!=='sinDatos'){
					cargarTabla(response,tablaCarga);
					ajustaTabla(tablaCarga);
					}
				else{
					cargarTabla(null,tablaCarga);
					}			
				});
			}

		}
	var ajustaTabla=function(Tabla){
		$('#' + Tabla).find('tr').each(function(){var campo=$('#' + campo);
			var k=0;
			$(this).find('td').each(function(){
 			switch(k){
			 	case 0:
					//$(this).html($('<a>').attr('href','#').attr('onclick',campoID + '.value="' + $('#' + campoID).val() + $(this).html()+'";return false;').html($(this).html()));
 					$(this).html($('<a>').attr('href','#').html($(this).html()).on('click',function(){
 						var texto=jText.val().trim();
 						texto=texto.substr(0,texto.lastIndexOf(' ')+1);
 						texto+=$(this).html();
 						jText.val(texto);
						}));
					 /*$(this).find('a').on('click',function(){
					 	$('#' + Tabla).parents('.direccion').parent().find('.direccion').fadeOut();
						});*/
					break;
 				}
 			k++;			
 			});		
		});	}
	campo=$('#' + campo);
	campo.on('focus',function(){
			Nomenclatura(campo);
		});
	
	campo.on('keypress',function(e){		
		var val = document.all;
    	var key = val ? e.keyCode : e.which;
    	//alert(key);
		if (key!==32 && key!==8 && key!==0){			
			e.stopPropagation();
        	e.preventDefault();
			}
		else{
			$(this).val($(this).val().trim());			
			}
		});	
	}
//new Archivero('archivo','attachments/inpr_infpropie/certificado/','doc;pdf','5');	
var Archivero=function(input,dir,exten,prefijo){
	var fechaMarca=new Date().getFullYear() + '' + (new Date().getMonth()+1 < 10 ? '0' + (new Date().getMonth()+1) : (new Date().getMonth()+1)) + '' + (new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()) + '' + (new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours() ) + '' + (new Date().getMinutes()<10 ? '0' + new Date().getMinutes() : new Date().getMinutes()) + '' + (new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds());
	$('#' + input).attr('readonly',true);
	$('#' + input).attr('class','boton_carga_campo');
	var prefijo=prefijo? prefijo + '_' + fechaMarca + '_' : fechaMarca + '_';		
	var divboton=$('#' + input).siblings('div.boton_carga')[0];
	var extOpc, extStr='';
	if (exten){
		extOpc=exten.split(';')
		var extOpc=exten.split(';');
		var extStr='';
		for(var k in extOpc){
			extStr+=' .' + extOpc[k] + ',';
			}
		extStr=extStr.substr(0,extStr.length-1);
		}

	new AjaxUpload(divboton,{
		action: 'app/controlador/c.ap.upload.php', onSubmit : function(file,ext){
		if (exten && extOpc.indexOf(ext.toString())<0){
			alert('Error: Solo se permiten archivos los formatos:' + extStr);
			return false;
			}
		else{
			$(divboton).html('Cargando');
			this.disable();
			}
		},
		data:{destino : dir, pfx : prefijo, accion:'c'},
		onComplete: function(file, response){
			if (response!=='error'){
				$(divboton).html('Elegir...');
				this.enable();
				$('#' + input).val(response);
				$('#' + input).on('click',function(){
					window.open(dir + '/' + response,'_blank');
					});
				try{onArchiveroCargado(input,response)} catch(e){}
				}
			else{
				alert('No se ha podido cargar el archivo. Contactese con el administrador del sistema.' + response);
				this.enable();
				}			
			}
		});
	}

var ConceptoFormula=function(){
	var jClass=this;
	var formula=new Array();
	var operaReq=false;
	this.reiniciarFormula=function(){formula.pop();formula=new Array();
		var ultimoElemento=formula[formula.length-1];		
		if (ultimoElemento === '*' || ultimoElemento === '+' || ultimoElemento === '-' || ultimoElemento === '/' || !ultimoElemento){operaReq=false;}else{operaReq=true;};
		$(cnFml).html(actualizarFormula);}
	this.getConceptos=function(){return conceptos;};
	this.getConceptosAlias=function(){return conceptosAlias;};
	this.addConcepto=function(val){quitarValor(conceptos,val);conceptos.push(val);getAlias(val);try{onChangeConcepto()}catch(e){}};
	this.dropConcepto=function(val){var concepindex=conceptos.indexOf(val);	quitarValor(conceptos,val);quitarValor(conceptosAlias,conceptosAlias[concepindex]);jClass.refrescarConceptosHTML();cnFml.html('');jClass.reiniciarFormula();try{onChangeConcepto()}catch(e){};};
	this.validar=function(){var numAbre=0, numCierra=0;	for(var k in formula){if (formula[k]==='('){numAbre++;} else if(formula[k]===')'){numCierra++;}};if (numCierra!==numAbre){$('#divRespuesta').html('Error de sintáxis. Existen paréntesis sin cerrar. Por favor verifique');return false}
		var ultimoElemento=formula[formula.length - 1];
		if(ultimoElemento==='+' || ultimoElemento==='-' || ultimoElemento==='*' || ultimoElemento==='/'){
			$('#divRespuesta').html('La formula no puede terminar en un operador. Se requiere un operando, o remover el último operador.');
			return false;
			}
		if (formula.length === 0){
			$('#divRespuesta').html('La formula no puede estar vacía.');
			return false;
			}
		try{onValidaConceptos()}catch(e){};
		//$('input[name=conceptoDisponible_ide]').attr('disabled',true);
		return true;
		}
	var conceptos=new Array();
	var conceptosAlias=new Array();	
	var cnCtr=$('#constuctorFormula');
	var cnCon=$('#conceptos');
	var cnOpe=$('#operacion');
	var cnFml=$('#formula');
	var cnHrm=$('#herramientas');
	var btSuma=$('#formula_cmdSuma');$(btSuma).on('click',function(){colocarOperador($(this).html())});
	var btResta=$('#formula_cmdResta');$(btResta).on('click',function(){colocarOperador($(this).html())});
	var btMultiplica=$('#formula_cmdMultiplica');$(btMultiplica).on('click',function(){colocarOperador($(this).html())});
	var btDivide=$('#formula_cmdDivide');$(btDivide).on('click',function(){colocarOperador($(this).html())});
	var btAbrepar=$('#formula_cmdAbrirParentesis');$(btAbrepar).on('click',function(){colocarOperador($(this).html())});
	var btCierrapar=$('#formula_cmdCerrarParentesis');$(btCierrapar).on('click',function(){colocarOperador($(this).html())});
	var txNumero=$('#formula_txtNumero');$(txNumero).attr('onkeypress','numerico(event)');
	var btNumero=$('#formula_cmdNumero');$(btNumero).on('click',function(){colocarNumero($(txNumero).val())});	
	var btRemover=$('#formula_cmdRemover');$(btRemover).on('click',function(){remover()});
	var slFuncion=$('#formula_selFun_ideregistro');$(slFuncion).removeAttr('disabled');slFuncion.empty();new Combo('funcion','formula_selFun_ideregistro',false);
	$(slFuncion).on('change',function(){$(this).val()!=='3' ? componerFuncion(+fun_funcion_datos[$(this).val()]) : false;});
	var getAlias=function(uni_concepto){
		var argumentos="accion=c&accion_m=concepto_alias&uni_concepto=" + uni_concepto;
		var a=new consultaAjax(formulario,true,argumentos);
		var respuesta=a.success(function(response){
			var res=response.substring(response.indexOf('||->')+4,response.indexOf('<-||'));
			quitarValor(conceptosAlias,res);
			conceptosAlias.push(res);
			jClass.refrescarConceptosHTML();
			return res;
			});
		}
	this.refrescarConceptosHTML=function(){
		$(cnCon).empty();
		for (var k in conceptosAlias){
			var boton=$('<button>').attr('type','button').html(conceptosAlias[k]);
			boton.on('click',function(){colocarConcepto($(this).html())});
			boton.appendTo(cnCon);
			}
		}
	var colocarConcepto=function(html){
		if(!operaReq){
			formula.push(html);
			operaReq=true;		
			}
		else{
			$('#divRespuesta').html('Debe seleccionar un operador en el Panel de Operaciones');
			}	
		
		$(cnFml).html(actualizarFormula);
		}
	var colocarOperador=function(html){
		var ultimoElemento=formula[formula.length - 1];
		if (operaReq || html==="(" || html===")" || formula[formula.lastIndexOf(')')]===ultimoElemento){			
			if ((html==="(" && formula[formula.lastIndexOf('(')]===ultimoElemento) || (html==="(" && operaReq)){				
				$('#divRespuesta').html('Error de sintáxis. Antes de abrir un Paréntesis, debe escojer otro operador.');
				return false;
				}
			else if(html===")"){
				if(ultimoElemento==='+' || ultimoElemento==='-' || ultimoElemento==='*' || ultimoElemento==='/' || ultimoElemento==='('){
					$('#divRespuesta').html('Error de sintáxis. El cierre de paréntesis no puede anteceder un operador');
					return false;
					}
				var numAbre=0, numCierra=0;
				for(var k in formula){
					if (formula[k]==='('){
						numAbre++;
						}
					else if(formula[k]===')'){
						numCierra++;
						}
					}
				if (numCierra>=numAbre){
					$('#divRespuesta').html('Error de sintáxis. No se encontraron más paréntesis para cerrar.');
					operaReq=true;
					return false;
					}
				formula.push(html);
				$(cnFml).html(actualizarFormula);
				operaReq=true;
				return false;
				}
			formula.push(html);
			$(cnFml).html(actualizarFormula);
			operaReq=false;
			}
		
		}
	var colocarNumero=function(val){
		if(!operaReq){
			if(!isNaN(+val) && +val>0){
				formula.push(+val);
				operaReq=true;	
				$(txNumero).val('');
				}
			else{
				$('#divRespuesta').html('El valor numérico debe ser mayor a 0 y debe ser estrictamente numérico');
				}	
			}
		else{
			$('#divRespuesta').html('Debe seleccionar un operador en el Panel de Operaciones');
			}	
		
		$(cnFml).html(actualizarFormula);
		}
	var componerFuncion=function(cantParams){
		if(operaReq){
			$('#divRespuesta').html('Debe seleccionar un operador en el Panel de Operaciones');
			$('#formula_selFun_ideregistro').val('3');
			return false;
			}			
		var fondo=$('<div>').attr('class','funcion_fondo');
		var cont=$('<div>').attr('class','funcion').html('<h3>Funciones</h3><span id="cierraFunciones">[X]</span>');
		var txtParams='';
		$(cnCtr).find('.funcion_fondo').remove();
		var nomFuncion=$('#formula_selFun_ideregistro :selected').text();			
		var paramCont=$('<div>').attr('class','contParams');
		var paramDest,paramDestIndex;
		var paramDestArgs=new Array();
		
		for(var k=0; k<(+cantParams); k++){
			txtParams+='arg' + (k + 1) + ',';
			paramDestArgs.push('arg' + (k + 1));
			var campo=$('<input>').attr('type','text').attr('id','txFunArg_' + k).attr('class','txtParam').attr('placeholder','Argumento ' + (k+1) + '').attr('readonly',true)
				.on('click',function(){
					paramDest=this;									
					$(this).parent().find('input').each(function(){
						$(this).attr('class','txtParam')
						});
					$(this).attr('class','txtParamSel')});
			campo.appendTo(paramCont);
			}		
		txtParams=txtParams.substr(0,txtParams.length-1);
		nomFuncion+= '(' + txtParams + ')';
		$(cont).html($(cont).html() + '<div class="funcionTxt">' + nomFuncion + '</div>');
		paramCont.appendTo(cont);
		if (+cantParams>0){
			var availConcepto=$('<div>').attr('class','funcionConceptos').html('<h5>Agregar Conceptos</h5>');
			$(cnCon).find('button').each(function(){			
				var boton=$(this).clone();
				boton.appendTo(availConcepto);
				boton.on('click',function(){
					if(paramDest){
						$(paramDest).val($(this).html());
						var nom=$('.funcionTxt').html();
						var idCampoSel=$(paramDest).attr('id');
						idCampoSel=idCampoSel.substr(idCampoSel.indexOf('_')+1,idCampoSel.length);
						var palact=paramDestArgs[idCampoSel];
						$('.funcionTxt').html(nom.replace(palact,$(this).html()));
						paramDestArgs[idCampoSel]=$(this).html();
						}
					else{
						$('#divRespuesta').html('Debe seleccionar un campo de argumento para poder introducir este Concepto.');
						}
					
					});
				});
			var numerosCont=$('<div>').attr('class','numeros').html('<h5>Agregar valor numérico</h5>');
			var numTx=$(cnHrm).find('#formula_txtNumero').clone();
			var numBt=$(cnHrm).find('#formula_cmdNumero').clone();
			numTx.attr('onkeypress','numerico(event)');
			numBt.on('click',function(){				
				if(paramDest){
						if(!isNaN(+numTx.val()) && +numTx.val()>0){
							$(paramDest).val($(paramDest).val(numTx.val()));
							var nom=$('.funcionTxt').html();
							var idCampoSel=$(paramDest).attr('id');
							idCampoSel=idCampoSel.substr(idCampoSel.indexOf('_')+1,idCampoSel.length);
							var palact=paramDestArgs[idCampoSel];
							$('.funcionTxt').html(nom.replace(palact,numTx.val()));
							paramDestArgs[idCampoSel]=$(paramDest).val(numTx.val());
							}
						else{
							numTx.val('');
							}
						
						}
					else{
						$('#divRespuesta').html('Debe seleccionar un campo de argumento para poder introducir este Concepto.');
						}
				
				});
			numTx.appendTo(numerosCont);numBt.appendTo(numerosCont);
			availConcepto.appendTo(cont);
			numerosCont.appendTo(cont);
			}
		var aceptar=$('<button>').attr('type','button').attr('id','funAceptar').html('aceptar').on('click',function(){
			var evalAceptar=$('.contParams').find('input').each(function(){return this}).get();
			for (var k in evalAceptar){
				if ($(evalAceptar)[k].value===''){
					$('#divRespuesta').html('Debe completar todos los argumentos de la funcion para poder continuar.');
					return false;
					}
				}
			
			var html=$('.funcionTxt').html();
			formula.push(html);
			operaReq=true;
			$(fondo).fadeOut();
			$(cnFml).html(actualizarFormula);			
			});
		aceptar.appendTo(cont);
		cont.appendTo(fondo);
		operaReq=true;
		$(cnCtr).append(fondo);
		$(fondo).fadeIn();
		$('#formula_selFun_ideregistro').val('3');
		$('#cierraFunciones').on('click',function(){
			$(fondo).fadeOut();
			var ultimoElemento=formula[formula.length-1];		
			if (ultimoElemento === '*' || ultimoElemento === '+' || ultimoElemento === '-' || ultimoElemento === '/' || !ultimoElemento){
				operaReq=false;
				}
			else{
				operaReq=true;
				}
			$('#formula_selFun_ideregistro').val('3');
			})
		}
	var remover=function(){
		formula.pop();
		var ultimoElemento=formula[formula.length-1];		
		if (ultimoElemento === '*' || ultimoElemento === '+' || ultimoElemento === '-' || ultimoElemento === '/' || !ultimoElemento){
			operaReq=false;
			}
		else{
			operaReq=true;
			}
		$(cnFml).html(actualizarFormula);
		}
	var actualizarFormula=function(){
		var formulaTexto='';
		for (var k in formula){
			formulaTexto+=formula[k] + ' ';
			}
		return formulaTexto;
		}
	}
//funcion para concurrencia
var	contConcurr=function(){
	this.br=function(x,a,b){//accion,tabla,id
		if (!a) {return false};
		var b=b.trim();
		$.ajax({
			type:"POST",
			url:"app/controlador/c.ap.concurrencia.php",
			dataType:"html",
			data:"accion=" + x + "&tabla=" + a + "&campo=" + b,
			success:function(response){
				window.onbeforeunload=confirmarsalir;
				var resp=response.split('|');
				if (resp[0].trim()==='0'){
					setTimeout(function(){$('#opCancelar').trigger('click');},15);
					}			
				$('#divRespuesta').html(resp[1]);
				}
			});
		}
	this.lr=function(){
		$.ajax({
			type:"POST",
			url:"app/controlador/c.ap.concurrencia.php",
			dataType:"html",
			data:"accion=cx"
			});
		}
	var confirmarsalir=function(){
		if (blokpagout)
			return 'Esta seguro de que quiere salir? perdera los cambios al hacerlo.';
		}	
	var cambiarBotonera=function(){
		var btnGrabar=$('#opGrabar,#opEliminar');btnGrabar.hide();
		$('#opCancelar').hide();
		}();
	this.btnModoCrear=function(){
		$('#opGrabar,#opCancelar').show();
		$('#opCancelar').css({'border-radius':'0px 10px 10px 0px'});
		$('#opEditar,#opNuevo,#naBusca').hide();
		}
	this.btnModoEditar=function(){
		$('#opGrabar,#opEliminar,#opCancelar').show();
		$('#opCancelar').css({'border-radius':'0px'});
		$('#opEditar,#opNuevo,#naBusca').hide();
		}
	this.lr();
	}
var umBusqueda=function(sel){//campos / tabla / params
	var sel=sel || 0;
        //console.log(sel);
	var c=cuadrosBusqueda.campos[sel].columnas;
	var campos=new Array();for(var i in c){campos.push(c[i].split(','));};
	var params=cuadrosBusqueda.campos[sel].params;
	var accionmb=cuadrosBusqueda.campos[sel].accionmb;	
	var c,fnOcultarBusqueda;
	var funcionesCarga=new Array();	
	var escrituraActiva=0;
	
	var crearHTML=function(){
		var c1=$('<div>').attr('class','umCuadroBusqueda');
		$('<h4>').html('Búsqueda de ' + $('form h2').html()).appendTo(c1);
		$('<div>').attr('id','umCuadroBusquedaIntro').appendTo(c1);
		var f1=$('<form>').attr('name','umBusquedaForm').attr('id','umBusquedaForm');
		var bn=$('<div>').attr('class','umCuadroBusquedaBotonera');
		$('<button>').attr('type','button').html('Buscar').on('click',function(){consultarDB();}).appendTo(bn);
		$('<button>').attr('type','button').html('Cancelar').on('click',function(){fnOcultarBusqueda()}).appendTo(bn);
		f1.appendTo(c1);
		bn.appendTo(c1);
		$('<table>').attr('id','umBusquedaResult').html('<tbody></tbody>').appendTo(c1);
		if (params){
			if (params.tituloTabla){
				funcionesCarga.push(function(){
					$('#umBusquedaResult caption').remove();
					$('<caption>').html(params.tituloTabla).appendTo('#umBusquedaResult');
					});
				
				}
			if (params.columnasTabla){				
				funcionesCarga.push(function(){
					$('#umBusquedaResult thead').remove();
					$('<thead>').appendTo('#umBusquedaResult');
					$('<tr>').appendTo('#umBusquedaResult thead');
					var cols=params.columnasTabla.split(',');
					for(var i in cols){
						$('<th>').html(cols[i]).appendTo('#umBusquedaResult thead tr');
						}
					});				
				}
			if (params.ayudaCuadro){
				funcionesCarga.push(function(){
					$('#umCuadroBusquedaIntro').html(params.ayudaCuadro);
					});				
				}
			}
		for(var i in campos){
			var cm=$('<div>').attr('class','campo');
			var cm2=false;
			switch(campos[i][0]){
				case '':
					continue;
					break;
				case 'uni_municipio':
					cm2=cm.clone();
					$('<label>').attr('for','b_uni_municipio').html(campos[i][1]).appendTo(cm);
					var sel=$('<select>').attr('id','b_uni_municipio').attr('name','b_uni_municipio').on('change',function(){
						$('#b_uni_barrio').empty();	new Combo('barrio','b_uni_barrio',true,$(this).val());
						});
					sel.appendTo(cm);
					funcionesCarga.push(function(){$('#b_uni_municipio').empty();new Combo('proyecto','b_uni_municipio',true,urlVariables.modulo);});															
					$('#b_uni_municipio').empty();
					$('<label>').attr('for','b_uni_barrio').html('Barrio').appendTo(cm2);
					$('<select>').attr('id','b_uni_barrio').attr('name','b_uni_barrio').appendTo(cm2);					
					break;
				case 'ter_nombre':
					$('<label>').attr('for','b_' + campos[i][0]).html(campos[i][1]).appendTo(cm);;
					$('<input>').attr('type','text').attr('name','b_' + campos[i][0]).appendTo(cm).on('keyup',function(){
						nombreAutoComplete($(this));
						});					
					break;
				default:
					$('<label>').attr('for','b_' + campos[i][0]).html(campos[i][1]).appendTo(cm);
					$('<input>').attr('type','text').attr('name','b_' + campos[i][0]).appendTo(cm);
					break;
				}
			if (cm.html()!==''){
				cm.appendTo(f1);
				}
			if (cm2) cm2.appendTo(f1);
			}		
		return c1;
		}
	var consultarDB=function(){
		var am='cuadroBusquedaConsulta';
		if (accionmb){am=accionmb};
		var args=$('#umBusquedaForm').serialize() + '&accion=c&accion_m=' + am;
		new consultaAjax(formulario,false,args).success(function(response){
			if(response.trim()===''){$('#divRespuesta').html('La búsqueda no ha devuelto ningún resultado.');return false;}
			cargarTabla(response,'umBusquedaResult','radio');
			$('input[name=umBusquedaResult_ide]').on('click',function(){
				cargarBusqueda($(this).val(),sel,$('#umBusquedaForm').serialize());
				fnOcultarBusqueda();
				});
			});
		}
	var nombreAutoComplete=function(t){
		clearTimeout(escrituraActiva);
		var crearAutoHTML=function(){
			var cont=$('<div>').attr('class','divautocomplete');
			$('<table>').attr('id','autocompleteTerNombre').html('<tbody></tbody>').appendTo(cont);
			cont.appendTo(t.parents('.campo'));			
			}
		var destruirHTML=function(){
			$('.divautocomplete').fadeOut({complete:function(){$(this).remove()}});			
			}
		var consultar=function(){
			var args='accion=nombreAutoComplete&ternombrebusca=' + t.val();			
			$.ajax({
			type:"POST",
			url:"app/controlador/c.ap.umbusqueda.php",
			dataType:"html",
			data:args,
			success:function(response){
				cargarTabla(response,'autocompleteTerNombre');
				$('.divautocomplete table').find('tr').each(function(){$(this).find('td').eq(0).hide();
					$(this).on('click',function(){
						$('input[name=b_ter_documento]').val($(this).find('td').eq(0).html());
						t.val($(this).find('td').eq(1).html());
						destruirHTML();
						})
					});
				}
			});
			}
		if (t.val().length>=3){
			if (!$('.divautocomplete')[0]){crearAutoHTML();};
			escrituraActiva=setTimeout(function(){consultar();},500);			
			}
		t.on('blur',function(){destruirHTML()});
		}
	this.mostrarBusqueda=function(){
			
		$('div.col2').block({
			message:c,
			css:{
				top:'0px',
				marginTop:$('body').scrollTop() + 'px',
				cursor:'default',
				width:'650px',
				minHeight:'250px',
				border:'none'
				},
			centerY:false,
			onBlock:function(){
				for(var i in funcionesCarga){
					funcionesCarga[i]();
					}
				try{onCargarCuadroBusqueda(sel)}catch(e){};
				}
			});
		}
	this.ocultarBusqueda=function(){
		$('div.col2').unblock();
		$('.umCuadroBusqueda form')[0].reset();
		$('.umCuadroBusqueda table tbody').html('');
		$('#b_uni_municipio').empty();
		}
	c=crearHTML();	
	fnOcultarBusqueda=this.ocultarBusqueda;
	}