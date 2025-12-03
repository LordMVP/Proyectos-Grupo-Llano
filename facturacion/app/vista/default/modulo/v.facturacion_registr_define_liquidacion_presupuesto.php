<form name="facturacion_registr_define_liquidacion_presupuesto" id="facturacion_registr_define_liquidacion_presupuesto" method="POST">
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
	<div id="divLocal"><!-- Acciones Particulares o especiales de este formuario-->
	</div>
</div>
<h2>Definición de presupuesto</h2>
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
	<label for="uni_tipdocument">Documento</label>
	<input type="hidden" id="est_documento" name="est_documento" value="7" readonly="readonly" />
	<input type="text" id="uni_documento" name="uni_documento" value="" />
	<script type="text/javascript">var doc_unidad=new comboUnidad('est_documento','uni_documento');</script>
</div>	

<div class="campo"> 
 <label for="uni_documento">Tipo Documento</label>
	<select name="uni_tipdocument" id="uni_tipdocument">
	</select> 
 </div>

<div class="campo"> 
 <label for="uni_liquidacion">Liquidacion</label>
 <select name="uni_liquidacion" id="uni_liquidacion"></select> 
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
				<th>Cta_Ide</th>
				<th>TarCodi</th>
				<th>Codigo</th>
				<th>Nombre</th> 
			</tr>
		</thead>		
	</table>
</div>
<div  class="espacioAdicion">
		<br><br>
		<div class="campo">	    
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
				<th>Ide_Cta</th> 
				<th>TarCodi</th>				
				<th>Cuenta</th> 					
				<th>Porcentaje</th>	
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
				<th>Ide Codo</th> 
				<th>Documento</th> 
				<th>Tipo Documento</th>					
				<th>Cta</th>					
				<th>TarCodi</th>	
				<th>%</th> 
				<th>Liquidacion</th>																				
				
																		
			</tr>
		</thead>		
	</table>	
 </div>


</form>

<div id="divForms">
</div>

<div id="divReportes">
</div>	