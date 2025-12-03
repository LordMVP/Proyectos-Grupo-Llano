<form name="facturacion_registr_define_liquidacion_contabccto" id="facturacion_registr_define_liquidacion_contabccto" method="POST">
<div class="botonera">
	<button type="button" id="getContab">Contabilización</button>
	<button type="button" id="getArea">Area de negocio</button>
	<button type="button" id="getCco">Centros de Costo</button>
	<button type="button" id="getPres">Presupuesto</button>
</div>
<input type="hidden" name="navac" id="navac" value="">
<div id="divFormActions">
	<div id="divOperacion"><!-- Acciones Base de cualquier formuario-->
		<button type="button" id="opNuevo">Nuevo</button>
		<button type="button" id="opGrabar">Grabar</button>
		<button type="button" id="opEliminar">Eliminar</button>
	</div>
	<div id="divNavegacion" >
	</div>
	<div id="divLocal"><!-- Acciones Particulares o especiales de este formuario-->
	</div>
</div>
<h2>Contabilizaci&oacute;n Conceptos Centro de Costo </h2>
<div class="campo">
	<label for="uni_concepto">Concepto</label>
	<input type="text" id="uni_concepto_nombre" disabled="disabled" />
	<input type="hidden" id="est_concepto" name="est_concepto" value="6" readonly="readonly" />
	<input type="hidden" id="uni_concepto" name="uni_concepto" value="" />	
</div>

<div class="campo"> 
 <label for="emp_ideregistro">Empresa</label><input type="text" name="emp_ideregistro" id="emp_ideregistro" value="322"/> 
</div>

<div class="campo">
    <label for="uni_municipio">Municipio</label>
    <select name="uni_municipio" id="uni_municipio"></select>  <script type="text/javascript">new Combo('proyecto','uni_municipio',true);</script>        
</div>

<div class="contenedorDesborda">
 <div class="espacioAdicion">
	<h3>Cuentas Disponibles </h3>	
	<table border="0" cellspacing="1" cellpadding="0" id="Cuentas">
		<tbody>
		</tbody>
		<thead>
			<tr>
				<th>&nbsp</th> 					
				<th>Ide Cuenta</th>
				<th>Tar Codi</th>
				<th>Codigo</th>
				<th>Nombre</th> 
			</tr>
		</thead>		
	</table>
</div>
<div  class="espacioAdicion">	
		<div class="campo">Adiciona Cuenta<br>
	  		<button type="button" id="btAdicionar">Adicionar</button>		
		</div>
</div>
 <div id="" class="espacioAdicion">
 	<h3>Cuentas Seleccionadas </h3>
	<table border="0" cellspacing="1" cellpadding="0" id="CuentaSelect">
		<tbody>
		</tbody>
		<thead>
			<tr>
				<th>Ide Cuenta</th> 
				<th>Tar Codi</th>				
				<th>Cuenta</th> 
				<th>%</th>	
			</tr>
		</thead>		
	</table>	
 </div>
<div class="botonera"> 
	<button type="button" id="btConfirma">Confirmar</button>	 
	<button type="button" id="btReinicia">Reinicia</button>	
</div>	 
</div>
<div class="contenedorDesborda">
 	<h3>Documentos Contabilizacion </h3>
	<table border="0" cellspacing="1" cellpadding="0" id="tablaDoc">
		<tbody>
		</tbody>
		<thead>
			<tr>
				<th>Ide Ccto</th> 
				<th>Cta Tarcodi</th>	
				<th>Cta ID</th>
				<th>%</th>
				<th>Municipio</th>	
			</tr>
		</thead>		
	</table>	
 </div>


</form>

<div id="divForms">
</div>

<div id="divReportes">
</div>
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
,"est_liquidacion" = codigo de estructura que trae de la liquidacion	-->

	