var urlVariables;
var showmenu=false;
var controlarConcurrencia;
var controlarProceso;
var cconcurr;
var blokpagout=false;
var cuadrosBusqueda={cuadros:new Array(),campos:new Array()};
var fieldsets;
var ic;
$(function(){
	$('#divRespuesta').hide();
	$('#cerrarRespuesta').on('click',function(){$('#divRespuesta').fadeOut();});
	pestanas();
	$('[id*="ideregistr"]').attr('disabled','disabled');
	$('.col2').css({'min-height' : ($('.col1').height()-50)});
	var urlSearch=location.search.substr(1,location.search.length);
        console.log("variables urlsearch :"+urlSearch);
	var getVariables=urlSearch.split('&');
	urlVariables=new Object();
	var stringEval='{';
	for (var k in getVariables){
		var variable=getVariables[k].split('=')[0];
		var valor=getVariables[k].split('=')[1];
		urlVariables[variable]=valor;
		}	
	showmenu ? ($('.cabecera,.col1').show()) : ($('.cabecera').hide());
	fieldsets=new colapsarFielsets();
	for (var k=0;k<=ic;k++){cuadrosBusqueda.cuadros[k]=new umBusqueda(k)};
	});

$.fn.getCursorPosition = function() {
        var el = $(this).get(0);
        var pos = 0;
        if('selectionStart' in el) {
            pos = el.selectionStart;
        } else if('selection' in document) {
            el.focus();
            var Sel = document.selection.createRange();
            var SelLength = document.selection.createRange().text.length;
            Sel.moveStart('character', -el.value.length);
            pos = Sel.text.length - SelLength;
        }
        return pos;
    }
var quitarValor = function(matriz,val) {
    for (var i = 0; i < matriz.length; i++) {
        if (matriz[i] === val) {
            matriz.splice(i, 1);
            i--;
        }
    }
    return matriz;
}
var obtieneMes=new Array("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
var obtieneDia=new Array("Domingo","Lunes","Martes","Miercoles","Jueves","Viernes","Sabado");
var obtieneEstado={A:"Activo",B:"Bloqueado",C:"Cerrado",I:"Inactivo",E:'Eliminado'};
var fecha={
	hoy:new Date().getFullYear() + '-' + (((new Date().getMonth()+1)<10) ? '0' + (new Date().getMonth()+1) : (new Date().getMonth()+1)) + '-' + (((new Date().getDate())<10) ? '0' + (new Date().getDate()) : (new Date().getDate())),
	anyo:new Date().getFullYear(),
	mes:new Date().getMonth()+1,
	dia:new Date().getDate(),
	hora:new Date().getHours(),
	minuto:new Date().getMinutes(),
	mesTexto:obtieneMes[new Date().getMonth()],
	diaSemana:obtieneDia[new Date().getDay()]
	};
/***********************************************************************************************************************************************************
FUNCION PARA VALIDAR CAMPOS UNICAMENTE CIFRAS EN PESOS CON DOS DECIMALES
************************************************************************************************************************************************************/

function formatoValores(donde,caracter)
{
	var decimales = false
	dec =2

		if (dec != 0)
			{decimales = true}
	pat = /[\*,\+,\(,\),\?,\\,\$,\[,\],\^]/
	valor = donde.value
	largo = valor.length
	crtr = true
	if(isNaN(caracter) || pat.test(caracter) == true)
		{
		if (pat.test(caracter)==true) 
			{caracter = "\\" + caracter}
		carcter = new RegExp(caracter,"g")
		valor = valor.replace(carcter,"")
		donde.value = valor
		crtr = false
		}
	else
		{
		var nums = new Array()
		cont = 0
		for(m=0;m<largo;m++)
			{
			if(valor.charAt(m) == "." || valor.charAt(m) == " " || valor.charAt(m) == ",")
				{continue;}
			else{
				nums[cont] = valor.charAt(m)
				cont++
				}
			
			}
		}

	if(decimales == true) {
		ctdd = eval(1 + dec);
		nmrs = 1
		}
	else {
		ctdd = 1; nmrs = 3
		}
	var cad1="",cad2="",cad3="",tres=0
	if(largo > nmrs && crtr == true)
		{
		for (k=nums.length-ctdd;k>=0;k--){
			cad1 = nums[k]
			cad2 = cad1 + cad2
			tres++
			if((tres%3) == 0){
				if(k!=0){
					cad2 = "." + cad2
					}
				}
			}
			
		for (dd = dec; dd > 0; dd--)	
		{cad3 += nums[nums.length-dd] }
		if(decimales == true)
		{cad2 += "," + cad3}
		 donde.value = cad2
		}
	donde.focus()
}	


/***********************************************************************************************************************************************************
FUNCION PARA VALIDAR CAMPOS UNICAMENTE NUMERICOS COMO DOCUMENTO
************************************************************************************************************************************************************/
function numerico(e){//funcion que permite numeros y el simbolo '-'
	var val = document.all;
    var key = val ? e.keyCode : e.which;
	var jchar=String.fromCharCode(key); 
	var jrex=/^([0-9\-.\s])/; 
    if (!(jrex.test(jchar)) && (key!==8 && key!==0)) {
        e.stopPropagation();
        e.preventDefault();
        }
	}
function numerico_espaciado(e){//funcion que permite numeros y el simbolo '-'
	var val = document.all;
    var key = val ? e.keyCode : e.which;
	var jchar=String.fromCharCode(key); 
	var jrex=/^([0-9\s])/; 
    if (!(jrex.test(jchar)) && (key!==8 && key!==0)) {
        e.stopPropagation();
        e.preventDefault();
        }
	}
function entero(e){//funcion que permite numeros estrictamente enteros
	var val = document.all;
    var key = val ? e.keyCode : e.which;
	var jchar=String.fromCharCode(key); 
	var jrex=/^([0-9])/;
    if (!(jrex.test(jchar)) && (key!==8 && key!==0)) {
        e.stopPropagation();
        e.preventDefault();
        }
	}
function decimal(e){//funcion que permite numeros con el signo '.'
	var val = document.all;
    var key = val ? e.keyCode : e.which;
	var jchar=String.fromCharCode(key); 
	var jrex=/^([0-9\.?])/; 
    if (!(jrex.test(jchar)) && (key!==8 && key!==0)) {
        e.stopPropagation();
        e.preventDefault();
        }
	}
function palabraNumero(e){//funcion que permite caracteres y numeros
	var val = document.all;
    var key = val ? e.keyCode : e.which;
	var jchar=String.fromCharCode(key); 
	var jrex=/^([a-zA-Z0-9\-\s])/;  
    if (!(jrex.test(jchar)) && (key!==8 && key!==0)) {
        e.stopPropagation();
        e.preventDefault();
        }
	}
        
function palabraNumeroSinGuion(e){//funcion que permite caracteres y numeros
	var val = document.all;
    var key = val ? e.keyCode : e.which;
	var jchar=String.fromCharCode(key); 
	var jrex=/^([a-zA-ZñÑ0-9\s])/;  
    if (!(jrex.test(jchar)) && (key!==8 && key!==0)) {
        e.stopPropagation();
        e.preventDefault();
        }
	}

function palabra(e){//funcion que permite solo caracteres
	var val = document.all;
    var key = val ? e.keyCode : e.which;
	var jchar=String.fromCharCode(key); 
//        ^([0-9\s?])/; 
	var jrex=/^([a-zA-Z\Ñ\ñ\s])/;   
    if (!(jrex.test(jchar)) && (key!==8 && key!==0)) {
        e.stopPropagation();
        e.preventDefault();
        }
	}
function letra(e){//funcion que permite solo caracteres
	var val = document.all;
    var key = val ? e.keyCode : e.which;
	var jchar=String.fromCharCode(key); 
	var jrex=/^([a-zA-Z\s?])/;  
    if (!(jrex.test(jchar)) && (key!==8 && key!==0)) {
        e.stopPropagation();
        e.preventDefault();
        }
	}
function email(e){//funcion que permite solo caracteres
	var val = document.all;
    var key = val ? e.keyCode : e.which;
	var jchar=String.fromCharCode(key); 
	var jrex=/^[-_a-zA-Z0-9\.\@]/;  
    if (!(jrex.test(jchar)) && (key!==8 && key!==0)) {
        e.stopPropagation();
        e.preventDefault();
        }
	}
//valor , expresionRegular^:banderas
function evaluarRegExp(e,v){
	var r;
	var e=e.split('~:')
	var expresion=e[0];
	var banderas=e[1];
	if(!(r=new RegExp(expresion,banderas))){
		alert('No se puede crear la expresion regular');
		return false;
		}
	return r.test(v);
	}
//evaluar con onkeyup
function validarRegExp(campo,e){
	var v=$(campo).val();
	if (!evaluarRegExp(e,v)){
		$(campo).css({'border-color':'#f00'});
		return true;
		}
	else{
		$(campo).css({'border-color':'#eee'});
		return false;
		}	
	}
        
function validarDireccion(valor)
{
    var jrex=/^([a-zA-ZnÑ0-9\s])/;  
    for(i=0;i<valor.length;i++) {
       if(!jrex.test(valor[i])){
           return false;
       }  
   }
   return true ;
    
    
    
}

function validarCampoNumerico(valor)
{
    var jrex=/^([0-9])/;
    for(i=0;i<valor.length;i++) {
       if(!jrex.test(valor[i])){
  
           return false;
       }  
   }
    
   return true ;  
}
/***********************************************************************************************************************************************************
FIN FUNCION PARA VALIDAR CAMPOS UNICAMENTE NUMERICOS COMO DOCUMENTO
************************************************************************************************************************************************************/
/***********************************************************************************************************************************************************
FUNCION PARA ARRASTRAS ORDEN DE ACTIVIDADES
************************************************************************************************************************************************************/

var row;
function start(){
  row = event.target;
}
function dragover(){
  var e = event;
  e.preventDefault();

  let children= Array.from(e.target.parentNode.parentNode.children);
  if(children.indexOf(e.target.parentNode)>children.indexOf(row))
    e.target.parentNode.after(row);
  else
    e.target.parentNode.before(row);
}
/***********************************************************************************************************************************************************
FIN FUNCION PARA ARRASTRAS ORDEN DE ACTIVIDADES
************************************************************************************************************************************************************/


/***********************************************************************************************************************************************************
FUNCION PARA ABRIR EL POPUP DE MENSAJES
************************************************************************************************************************************************************/
var openPopup=function(objeto){
    switch(objeto.id){
        case "divRespuesta":
            // __dom.lanzarAlerta($("#" + objeto.id).html(),'Atención') ;   
        	$("#divRespuesta").fadeIn();        				
            /*$.blockUI({ 
                message: $("#" + objeto.id).html()
                }); */
            $("span").attr("id","cerrarRespuesta").html('[x]').on('click',function(){$("#divRespuesta").fadeOut()}).appendTo('#divRespuesta');
            //setTimeout($.unblockUI, 5000);
            setTimeout(function(){$("#divRespuesta").fadeOut()},20000);
            return false;
            break;
        }
    }
/***********************************************************************************************************************************************************
FUNCION PARA EVENTOS GENERALES DE BOTONES DE FORMULARIO
************************************************************************************************************************************************************/
var noetmot=0;//timeout liberar registro
var cargarEventosGenerales=function(){ 
        $('#opGrabar,#opCancelar,#opEditar,#opNuevo,#naBusca').show();
	$('#opNuevo').on('click',function(){
		$('#opGrabar,#opCancelar').show();		
		$('#opGrabar,#opCancelar').removeAttr('disabled');
		$('#opEditar,#opNuevo,#naBusca').attr('disabled','disabled');
		$('#' + formulario)[0].reset();
		fieldsets.mostrar();
		return false;
		});
	$('#opGrabar').on('click',function(){
		$('#' + formulario).submit();
		blokpagout=false;
		$('#opEliminar,#opCancelar').attr('disabled','disabled');
//                $('#opGrabar').css({'border-radius':'0px'}); 
		$('#opEditar,#opNuevo,#naBusca').removeAttr('disabled');
//		cconcurr.lr();	
		return false;
		});
	$('#opEliminar').on('click',function(){
		if (!confirm('Está seguro de continuar?')){return false};
		try{eliminarRegistro();} catch(e){$('#divRespuesta').html('Esta función no está permitida en su rol de usuario. Comuníquese con el administrador del sistema.');}
		return false;
		});
	$('#opEditar').on('click',function(){
		blokpagout=true;
		$('#opGrabar,#opEliminar,#opCancelar').removeAttr('disabled');
		$('#opGrabar').show();
//		$('#opCancelar').css({'border-radius':'0px'});
		$('#opEditar,#opNuevo,#naBusca').attr('disabled','disabled');
		return false;
		});
	$('#opCancelar').on('click',function(){
		blokpagout=false;
		$('#opGrabar,#opEliminar,#opCancelar').attr('disabled','disabled');
		$('#opEditar,#opNuevo,#naBusca').removeAttr('disabled');
		$(this).css({'border-radius':'0px'});
//		cconcurr.lr();
		return false;
		});
	$('#naFirst').on('click',function(){
		$('#navac').val('f');
		navegaRegistro(formulario);
		return false;
		});
	$('#naPrev').on('click',function(){
		$('#navac').val('p');
		navegaRegistro(formulario);
		return false;
		});
	$('#naNext').on('click',function(){
		$('#navac').val('n');
		navegaRegistro(formulario);
		return false;
		});
	$('#naLast').on('click',function(){
		$('#navac').val('l');
		navegaRegistro(formulario);
		return false;
		});
	$('#naBusca').on('click',function(){
		try{cuadrosBusqueda.cuadros[0].mostrarBusqueda();}catch(e){$('#divRespuesta').html('Filtro de busquedas no permitido.')}
		});
	}

/***********************************************************************************************************************************************************
FUNCION PARA CARGAR TABLAS DE DATOS TABULADOS
************************************************************************************************************************************************************/
var consultaAjax=function(f,s,a,b){
	var b=b||1;
	if (b===1) $.blockUI({ message: 'Procesando' });
	if(!f){f='inicio'};
	var s=(false||s);
	var serializa=s ? $('#' + f).serialize() : '';
	var respuesta=null;
	return jAjax=$.ajax({
		type:"POST",
		url:"app/controlador/c." + f + ".php",
		dataType:"html",
		data:s? ($('#' + f).serialize() + '&' +  a) : a,
		success:function(){
			$.unblockUI();
			}	
		});
	}

var testpage=function(a){$.ajax({data:a,type:"POST",url:"app/modelo/test.php",dataType:"html",success:function(response){alert(response);}});}
var sessionVariables=function(a){$.ajax({data:a,type:"POST",url:"app/modelo/session.php",dataType:"html",success:function(response){alert(response);}});}	
/***********************************************************************************************************************************************************
FUNCION PARA CARGAR DATOS DE FORMULARIO
************************************************************************************************************************************************************/
var asincDatos=new Object();
var cargarDatos=function(response,camposNum){
	var camposNum=(camposNum || 0);
	var valuesForm;
	var fieldsForm=camposFormulario(camposNum);
	if(response){
		var datosTabla=response.substring(response.indexOf('||->')+4,response.indexOf('<-||'));
		valuesForm=datosTabla.split('c_@');
		}
	else{valuesForm='';}
	for (var i in fieldsForm){
		asincDatos[fieldsForm[i]]=valuesForm[i];
		$('#' + fieldsForm[i]).val(valuesForm[i]);				
		}
	try{onCargarDatos(camposNum)} catch(e){}
	return true;
	}
/***********************************************************************************************************************************************************
FUNCION PARA CARGAR TABLAS DE DATOS TABULADOS
************************************************************************************************************************************************************/

var cargarTabla=function(response,tc){
	if(response===null || response.trim()==='sinDatos'){
		$('#' + tc).find('tbody').empty();
		var numcols=$('#' + tc).find('thead tr th').length;
		$('#' + tc).find('tbody').append('<tr><td colspan=' + numcols + ' alt="Vacio">No se han encontrado registros.</tr>');
		return false;
		}
	var datosTabla=response.substring(response.indexOf('||->')+4,response.indexOf('<-||'));
	var valuesTabla=datosTabla.split('|__|');
	for (var i in valuesTabla){
		valuesTabla[i]=valuesTabla[i].split('c_@');
		}
	
	$('#' + tc).find('tbody').empty();
	for(var i in valuesTabla){
		var jTR=$('<tr>');
		for(var k in valuesTabla[i]){
			var jTD=$('<td>');
			if (k<=0 && arguments[2]){
				var esarr='';
				if (arguments[2]==='checkbox') esarr='[]';
				var jSelector=$('<input>').attr('type',arguments[2]).attr('name',tc + '_ide' + esarr).attr('value',valuesTabla[i][k]);
				jSelector.appendTo(jTD);					
				}
			else{
				jTD.html(valuesTabla[i][k]);
				}			
			jTR.append(jTD);			
			}
		$('#' + tc).append(jTR);
		}
	var eliminaRespuesta=response.substr(0,response.indexOf('||->')) + response.substr(response.indexOf('<-||')+4,response.length);
	if (eliminaRespuesta.trim()!=='') $('#divRespuesta').html(eliminaRespuesta);
	
	}
/***********************************************************************************************************************************************************
FUNCION PARA MANEJO DE PESTAÑAS
************************************************************************************************************************************************************/
	
var registrados=new Array();
var pestanas=function(){
	var pestDiv=$('.pestana_enc').map(function(){var act=$(this);agregarPestana(act.parent());}).get();
	
	function agregarPestana(pestana){
		var estaRegistrado=false;
		for(var k in registrados){
			if( pestana.attr('id')===registrados[k])
				estaRegistrado=true;
			}
		if (!estaRegistrado) {
			registrados.push(pestana.attr('id'));
		var k=0;
		var jLinks=pestana.find('.pestana_enc').map(function(){$(this).find('a')
			.map(function(){
				if (k===0){
					$(this).css({"background":'#000099','color':'#CADCFE'});
					}
				$(this).attr('id','pestana_enc_' + k);
				$(this).attr('onclick','pestanas.call(cambiaPestana(this,' + k + '))');
				k++;
				}
				)});
		var k=0;
		pestana.find('.hoja').map(function(){k>0 ? $(this).hide() : $(this).show(); k++});
		}}
	this.cambiaPestana=function(jLink,dID){
		var jLink=$(jLink);	
								
		var jLinkPadre=jLink.parent().parent().parent().parent();
		var k=0;
		jLinkPadre.find('.hoja').map(function(){k===dID ? $(this).show() : $(this).hide(); k++; return false});
		jLinkPadre.find('.pestana_enc').find('a').css({"background":'#CADCFE','color':'#0066CC'});
		jLink.css({"background":'#000099','color':'#CADCFE'});					
		return false;
		}
	}	
/***********************************************************************************************************************************************************
FUNCION PARA MANEJO DE FORMULARIOS EMERGENTES
************************************************************************************************************************************************************/
var formPopup=function(m,a){
	var a=a || '';
	var ind=window.location.toString();var prog=ind.substr(ind.lastIndexOf('/')+1);
	var r='programa.php?modulo=' + m + a;
	var contenedor;
	prog.substring(0,prog.indexOf('.'))==='programa' ? contenedor=$('#contenedor',parent.document) : contenedor=$('#contenedor');
	var btnCerrar=$('<div>').attr('class','frmPopupCerrar').html('[x]').on('click',function(){contenedor.unblock();try{onCierraFormPopup()} catch(e){}});
	var c=$('<iframe>').attr('src',r).load(function(){
		var frm=$(this).contents().find('form')
		var altura=frm.height();
		frm.append(btnCerrar);
		$(this).height(altura + 50);
		frm.find('#opCancelar').on('click',function(){$('#contenedor').unblock();});
		});		
	contenedor.block({
		message:c,
		css:{
			width:'85%',
			top:'5%',
			border:'0px'
			},
		centerY:false		
		});
	}
/***********************************************************************************************************************************************************
FUNCION PARA COLAPSAR GRUPOS DE INFORMACIÓN
************************************************************************************************************************************************************/
var colapsarFielsets=function(){
	var colapsar=true;
	var working=false;
	var activo;
	var alturas=new Array()
	this.mostrar=function(o){
		if (!colapsar){return false;};
		if (working){return false;};
		working=true;
		if (o===activo){
			cerrar();
			activo=undefined;
			return false;
			}
		activo=o;		
		$('#' + o).animate({
			'height':alturas[o] + 'px'
			},700,function(){
				$('#' + o).css({'overflow':'visible','height':'100%'});
				working=false;
				});
		cerrar(o);
		}
	var mostrar=this.mostrar;
	function cerrar(o){
		if (!colapsar){return false;};
		if (!o){working=false}
		$('form').find('fieldset').each(function(k){
			if(k>0){
				if ($(this).attr('id')!==o && k>0){
					$(this).css({'overflow':'hidden'}).animate({
						'height':'17px'					
						},500);
					}				
				}
			});
		}
	function inicializar(){
		$('form').find('fieldset').each(function(k){
			if(k>0){
				$(this).attr('id','fst' + k);
				alturas["" + $(this).attr('id')]=$(this).height();
				$(this).css({
					'height':'17px',
					'overflow':'hidden'
					});
				$(this).find('legend').css({'cursor':'pointer'}).on('click',function(){
					mostrar($(this).parent().attr('id'));
					});				
				}		
			});
		};
	this.noCollapse=function(){
		colapsar=false;
		$('form').find('fieldset').each(function(k){
			if(k>0){
				alturas["" + $(this).attr('id')]=$(this).height();
				$(this).css({
					'height':'initial',
					'overflow':'initial'
					});
				$(this).find('legend').css({'cursor':'default'}).off();				
				}		
			});
		}
	var ind=window.location.toString();
	var prog=ind.substr(ind.lastIndexOf('/')+1);
	if (prog.substring(0,prog.indexOf('.'))==='programa'){
		if (formulario!=='facturacion_registr_ciclo_factura_agenda')
		return false;
		};
	inicializar();
	};
/***********************************************************************************************************************************************************
FUNCION PARA CARGAR RESULTADOS DE BUSQUEDA EN FORMULARIO
************************************************************************************************************************************************************/
var cargarBusqueda=function(_ideregistro,c,s){
	var c=c || 0;
	var args='accion=c&accion_m=' + cuadrosBusqueda.campos[c].accionm;
	args+='&' + cuadrosBusqueda.campos[c].llave + '=' + _ideregistro ;
        localStorage.removeItem('argumentos_busqueda');
        localStorage.setItem('argumentos_busqueda',s);
        var argumentos = localStorage.getItem('argumentos_busqueda');
	var a=new consultaAjax(formulario,false,args).success(function(response){
		try{cargarDatos(response,c);}catch(e){};
		try{onCargarBusqueda(_ideregistro,c,s);}catch(e){};
		});
	}
/***********************************************************************************************************************************************************
MISCELANEO
************************************************************************************************************************************************************/

var Calendario=function(z,A){var u,v;if(A){var g=A.split("~"),x;void 0!==g[0]&&0<g[0].length?(x=g[0].split("-"),u=new Date(+x[0],+x[1]-1,+x[2],0,0,0)):u=null;void 0!==g[1]?(g=g[1].split("-"),v=new Date(+g[0],+g[1]-1,+g[2],0,0,0)):v=null}else u=v=null;var y=document.getElementById(z),g=y.value||(new Date).getFullYear()+"-"+((new Date).getMonth()+1)+"-"+(new Date).getDate(),m=+g.split("-")[0],e=+g.split("-")[1],p=+g.split("-")[2],q=null,B=null,h=null,l=void 0,n=void 0,r=void 0,C="Enero Febrero Marzo Abril Mayo Junio Julio Agosto Septiembre Octubre Noviembre Diciembre".split(" ");
y.addEventListener("click",function(){if("block"===h.style.display)try{$(h).hide(400)}catch(c){h.style.display="none"}else{for(var a=document.getElementsByClassName("jeusCalendar"),f=0;f<a.length;f++)try{$(a[f]).hide(400)}catch(d){a[f].style.display="none"}try{$(h).show(400)}catch(e){h.style.display="block"}}});y.setAttribute("readonly","readonly");var w=function(){n.innerHTML=l.innerHTML=r.innerHTML="";D();E();F()},G=function(){r.innerHTML="";for(var c="do lu ma mi ju vi sa".split(" "),a=0;7>a;a++){var f=
document.createElement("div");f.setAttribute("class","calCuadDiaTitulo");f.innerHTML=c[a];r.appendChild(f)}c=Array(6);for(a=0;a<c.length;a++)c[a]=Array(7);for(a=0;a<c.length;a++)for(f=0;f<c[a].length;f++){var d=document.createElement("div");d.setAttribute("class","cuadroDia");r.appendChild(d)}},D=function(){l.innerHTML="";var c=document.createElement("div"),a=document.createElement("select");a.setAttribute("class","inputAnyo");for(var f=(new Date).getFullYear()+10,d=(new Date).getFullYear()-118;d<=
f;d++){var e=document.createElement("option");e.value=d;e.innerHTML=d;d===+m&&e.setAttribute("selected","selected");a.appendChild(e)}a.addEventListener("change",function(){m=+this.value;w()});c.appendChild(a);l.appendChild(c)},E=function(){var c=document.createElement("div");c.innerHTML="<span>&gt;&gt;</span>";c.setAttribute("class","flechaDer");var a=document.createElement("div");a.innerHTML="<span>&lt;&lt;</span>";a.setAttribute("class","flechaIzq");n.appendChild(a);n.appendChild(c);var f=document.createElement("select"),
d;for(d in C){var h=document.createElement("option");h.setAttribute("value",d);h.innerHTML=C[d];d==e-1&&h.setAttribute("selected","selected");f.appendChild(h)}f.addEventListener("change",function(){e=+this.value+1;w()});n.appendChild(f);c.addEventListener("click",function(){g("d")});a.addEventListener("click",function(){g("i")});var g=function(a){switch(a){case "d":12>+e?e=+e+1:(e=1,m=+m+1);break;case "i":1<+e?e=+e-1:(e=12,m=+m-1)}w()}},F=function(){G();var c=new Date;c.setFullYear(m);c.setMonth(e-
1);c.setDate(1);var a=c.getDay(),f=a-1;0>f&&(a=7,f=a-1);var d=new Date;d.setMonth(c.getMonth());d.setMonth(d.getMonth()+1);d.setDate(0);for(var c=d.getDate(),d=[],g=1,n=1,k=r.getElementsByClassName("cuadroDia"),l=function(a){p=+this.innerHTML;w();y.value=m+"-"+(10>+e?"0"+e:e)+"-"+(10>+p?"0"+p:p);try{$(h).hide(400)}catch(b){h.style.display="none"}},b=0;42>b;b++)k[b].removeEventListener("click",l,!1);for(b=0;42>b;b++){if(b<a){k[b].className+=" cuadroDiaBloqueado";k[b].removeEventListener("click",l);
var t=new Date;t.setMonth(e-1);t.setDate(-f);f--;d[b]=t.getDate()}else if(g>c)k[b].className+=" cuadroDiaBloqueado",k[b].removeEventListener("click",l),d[b]=n,n++;else{d[b]=g;g++;k[b].className=d[b]===+p?"cuadroDia cuadroDiaSeleccion":"cuadroDia";var t=!0,q=new Date(m,+e-1,d[b],0,0,0);u&&q<u&&(k[b].className+=" cuadroDiaBloqueado",k[b].removeEventListener("click",l),t=!1);v&&v<q&&(k[b].removeEventListener("click",l),k[b].className+=" cuadroDiaBloqueado",t=!1);t&&k[b].addEventListener("click",l)}k[b].innerHTML=
d[b]}return!1};this.obtenerFecha=function(){return m+"-"+(10>e?"0"+e:e)+"-"+(10>p?"0"+p:p)};q=document.getElementById(z);B=q.parentNode;(function(){var c=document.getElementById("cal_"+z);c&&c.parentNode.removeChild(c);h=document.createElement("div");h.setAttribute("class","jeusCalendar");l=document.createElement("div");l.setAttribute("class","divAnyo");n=document.createElement("div");n.setAttribute("class","divMes");r=document.createElement("div");r.setAttribute("class","divDias");h.appendChild(l);
h.appendChild(n);h.appendChild(r);B.appendChild(h);h.style.left=q.offsetLeft+"px";h.style.top=q.offsetTop+q.offsetHeight+"px"})();w()};


var imprimir=function(contenido){
	$("#divRespuesta").html('Enviando a PDF...');
	//window.open('data:application/pdf');
	new consultaAjax('imprimir',false,'accion=i&contenido=' + contenido).success(function(response){
			//$("#divRespuesta").html(response);
			window.open('data:application/pdf,' + encodeURIComponent(response));
			});
	}

