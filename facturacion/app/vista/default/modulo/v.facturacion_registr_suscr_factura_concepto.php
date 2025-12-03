<form name="facturacion_registr_suscr_factura_concepto" id="facturacion_registr_suscr_factura_concepto" method="POST">
<input type="hidden" name="navac" id="navac" value="">
<div id="divFormActions">
	<div id="divOperacion"><!-- Acciones Base de cualquier formuario-->
		<button type="button" id="opNuevo">Nuevo</button>
		<button type="button" id="opGrabar">Grabar</button>
		<button type="button" id="opEliminar">Eliminar</button>
	</div>
	<div id="divNavegacion"><!-- Acciones de Navegación de cualquier formuario-->
		
	</div>
	<div id="divLocal"><!-- Acciones Particulares o especiales de este formuario-->
	</div>
</div>

<h2>Conceptos </h2>

<div class="campo">
	<label for="dsus_ideregistr">Suscripcion</label>
	<input type="text" id="dsus_ideregistr" name="dsus_ideregistr" />	
</div>
<div class="campo">
	<label for="uni_liquidacion">Liquidacion</label>
	<input type="text" id="uni_liquidacion_nombre" disabled="disabled" />
	<input type="hidden" id="uni_liquidacion" name="uni_liquidacion" value="" />	
</div>
<div class="campo">
  	<label for="uni_concepto">Concepto</label><input type="text" name="uni_concepto" id="uni_concepto"/>          
</div>
<div class="campo">
  	<label for="con_tipregistro">Función </label><select name="con_tipregistro" id="con_tipregistro"></select>   <script type="text/javascript">new Combo('estado','cosu_estado',false,'AI'); </script>   
</div>
<div class="campo">
  	<label for="cosu_vlrunitari">Valor Unitario</label><input type="text" name="cosu_vlrunitari" id="cosu_vlrunitari"/>          
</div>
<div class="campo">
  	<label for="cosu_cantidad">Cantidad</label><input type="text" name="cosu_cantidad" id="cosu_cantidad"/>          
</div>
<div class="campo">
  	<label for="cosu_vlrtotal">Valor Total</label><input type="text" name="cosu_vlrtotal" id="cosu_vlrtotal"/>          
</div>
<div class="campo">
  	<label for="cosu_fecinicio">Fecha de Inicio</label><input type="text" name="cosu_fecinicio" id="cosu_fecinicio"/>          
	<script type="text/javascript">new Calendario('cosu_fecinicio');</script>
</div>
<div class="campo">
  	<label for="cosu_fecfinal">Fecha Final</label><input type="text" name="cosu_fecfinal" id="cosu_fecfinal"/>          
	<script type="text/javascript">new Calendario('cosu_fecfinal');</script>
</div>
<div class="campo">
  	<label for="cosu_estado">Estado</label><select name="cosu_estado" id="cosu_estado"></select><script type="text/javascript">new Combo('funcion_concepto','con_tipregistro',false); </script>         
</div>
<div class="contenedorDesborda">
	<table border="0" cellspacing="1" cellpadding="0" id="conceptoDisponible">
		<tbody>
		</tbody>
		<thead>
			<tr>
				<th>Seleccion</th> 
				<th>Nombre</th>
				<th>Alias</th>
				<th>Valor</th>
				<th>Función</th>										
			</tr>
		</thead>		
	</table>
	
	<table border="0" cellspacing="1" cellpadding="0" id="conceptoRelacionado">
		<tbody>
		</tbody>
		<thead>
			<tr>
				<th>#</th> 
				<th>Valor Unitario</th>
				<th>Cantidad</th>
				<th>Valor Total</th>
				<th>Fecha de inicio</th>										
				<th>Fecha final</th>
				<th>Estado</th>
			</tr>
		</thead>		
	</table>
</div>
</form>

<div id="divForms">
</div>

<div id="divReportes">
</div>