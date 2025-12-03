<form name="facturacion_registr_factura" id="facturacion_registr_factura" method="POST">
<input type="hidden" name="navac" id="navac" value="">
<h2>Registro de Facturas</h2>
<div id="divComandos">
	<div class="divBotones"><!-- Acciones Base de cualquier formuario-->
            <button type="button" id="opNuevo" class="btn" >Nuevo</button>
		<button type="button" id="opEditar" class="btn" >Editar</button>
		<button type="button" id="opGrabar" class="btn">Grabar</button>
		<button type="button" id="opCancelar" class="btn" >Cancelar</button>
		<button type="button" id="opEliminar" class="btn">Eliminar</button>
		<button type="button" id="naBusca" class="btn" >Filtro</button>
	</div>
<!--	<div id="divNavegacion"> Acciones de Navegación de cualquier formuario</div>
	<div id="divLocal"> Acciones Particulares o especiales de este formuario</div>-->
</div>
<fieldset><legend>Encabezado de la factura</legend>
<div class="campo"> 
 <label for="fac_ideregistro">Fac IDE</label><input type="text" name="fac_ideregistro" id="fac_ideregistro"/> 
 </div>

<div class="campo">
    <label for="fac_estado">Estado</label>
    <select name="fac_estado" id="fac_estado"><script type="text/javascript">new Combo('estado','fac_estado',true,'FAC');</script></select>
</div> 
<div class="campo"> 
 <label for="tsu_nombre">Tipo Suscripción</label><input type="text" name="tsu_nombre" id="tsu_nombre"/> 
 </div>
<div class="campo"> 
 <label for="emp_ideRegistro">Empresa</label><input type="text" name="emp_ideRegistro" id="emp_ideRegistro"/> 
 </div>
<div class="campo"> 
 <label for="fac_numero">Fac Numero</label><input type="text" name="fac_numero" id="fac_numero"/> 
 </div>

<div class="campo"> 
 <label for="uni_documento">Uni Documento</label><input type="text" name="uni_documento" id="uni_documento"/> 
 </div>
 <div class="campo"> 
 <label for="uni_tipDocument">Tipo Documento</label><input type="text" name="uni_tipDocument" id="uni_tipDocument"/> 
 </div> 
<div class="campo"> 
 <label for="fac_fecha">Factura Fecha</label><input type="text" name="fac_fecha" id="fac_fecha"/> 
 </div> 
<div class="campo"> 
 <label for="cic_ideRegistro">Ciclo IDE</label><input type="text" name="cic_ideRegistro" id="cic_ideRegistro"/> 
 </div>
<div class="campo"> 
 <label for="per_ideRegistro">Periodo IDE</label><input type="text" name="per_ideRegistro" id="per_ideRegistro"/> 
 </div>  



<div class="campo"> 

 <label for="ter_nomcompleto">Tercero</label><input type="text" name="ter_nomcompleto" id="ter_nomcompleto"/> 
 </div>  
<div class="campo"> 
 <label for="sus_ideRegistro">Suscriptor</label><input type="text" name="sus_ideRegistro" id="sus_ideRegistro"/> 
 </div> 
<div class="campo"> 
 <label for="dsus_ideRegistr">Suscripción</label><input type="text" name="dsus_ideRegistr" id="dsus_ideRegistr"/> 
 </div> 
<div class="campo"> 
 <label for="dsus_Pcodigo">Codigo Anterior</label><input type="text" name="dsus_Pcodigo" id="dsus_Pcodigo"/> 
 </div> 

<div class="campo"> 
 <label for="fac_ideOrigen">Factura Origen</label><input type="text" name="fac_ideOrigen" id="fac_ideOrigen"/> 
 </div>
<div class="campo"> 
 <label for="fac_ideActual">Factura Actual</label><input type="text" name="fac_ideActual" id="fac_ideActual"/> 
 </div>  

 <div class="campo"> 
 <label for="est_nombre">Tipo de uso</label><input type="text" name="est_nombre" id="est_nombre"/> 
 </div>  

 <div class="campo"> 
 <label for="pro_catestrato">Estracto/Categoria</label><input type="text" name="pro_catestrato" id="pro_catestrato"/> 
 </div>  

 <div class="campo"> 
 <label for="cic_nombre">Ciclo Factura</label><input type="text" name="cic_nombre" id="cic_nombre"/> 
 </div> 

 <div class="campo"> 
 <label for="fac_vlrreal">Total Factura</label><input type="text" style="font-weight:bold;"  name="fac_vlrreal" id="fac_vlrreal"/> 
 </div> 

      
<div class="botonera">

</div>
</fieldset>
</form>

<div id="divForms">
	<div class="pestana_enc">
		<ul>
			<li><a href="#">Conceptos</a></li>
			<li><a href="#">Documentos Vinculados</a></li>
		</ul>		
	</div>
	<div class="hoja">
		<iframe src="" id="facturacion_registr_factura_conceptos"></iframe>
	</div>
	<div class="hoja">
		<iframe src="" id="facturacion_registr_factura_documentos"></iframe>
	</div>
</div>

<div id="divReportes">
</div>