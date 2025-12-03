<br>
<form name="facturacion_registr_ciclo_factura_liquidacion" id="facturacion_registr_ciclo_factura_liquidacion" method="POST">
<input type="hidden" name="navac" id="navac" value="">
<div id="divComandos">
	<div class="divBotones"><!-- Acciones Base de cualquier formuario-->
            <button type="button" id="opNuevo" class="btn">Nuevo</button>
		<button type="button" id="opEditar" class="btn">Editar</button>
		<button type="button" id="opGrabar" class="btn">Grabar</button>
		<button type="button" id="opCancelar" class="btn">Cancelar</button>
		<button type="button" id="opEliminar" class="btn">Eliminar</button>
		<button type="button" id="naBusca" class="btn" >Filtro</button>
	</div>
<!--	<div id="divNavegacion"> Acciones de Navegación de cualquier formuario</div>
	<div id="divLocal"> Acciones Particulares o especiales de este formuario</div>-->
</div>
<fieldset><legend>Administraci&oacute;n de Ciclo Liquidacion</legend>
<div class="campo">
    <label for="cic_ideregistro">ID Ciclo</label><input type="text" name="cic_ideregistro" id="cic_ideregistro"  />          
</div>
<div class="campo">
	<label for="uni_liquidacion">Liquidacion</label>
	<select id="uni_liquidacion" name="uni_liquidacion"></select>
</div>
<div class="campo">
    <label for="empresa_nom">Nombre de la empresa</label><input type="text" name="empresa_nom" id="empresa_nom" readonly="readonly" />          
</div>
</fieldset>
<h3>Liquidaciones Relacionadas al Ciclo</h3>
<table id="LiquidacionesRelacionadas">
	<tbody>
	</tbody>
	<thead>
	<tr>		
		<th>Id. Liquidación</th>
		<th>Tipo de Liquidacion</th>
		<th>Empresa</th>
		<th>Edicion</th>		
	</tr>
	</thead>
</table>


</form>

<div id="divForms">

</div>

<div id="divReportes">
</div>
<!--SELECT "cic_ideregistro"
		,"per_ideregistro"
		,"dper_actividad"
		,"dper_mesinicio"
		,"dper_diainicio"
		,"dper_mesfinal"
		,"dper_diafinal"
		,"dper_estado"
		,"prg_ideregistro"
		,"dper_fecActiva"
		,"dper_feccierre"
	FROM "public"."dper_detperiodo"-->