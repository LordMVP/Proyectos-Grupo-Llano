<form name="facturacion_registr_ciclo_factura_edperiodo" id="facturacion_registr_ciclo_factura_edperiodo" method="POST">
	<input type="hidden" name="navac" id="navac" value="">
	<div id="divFormActions">
		<div id="divBotones">
			<!-- Acciones Base de cualquier formuario-->
			<button type="button" id="opGrabar">Guardar</button>
			<!-- <button type="button" id="opCancelar">Cancelar</button> -->
		</div>
		<div id="divNavegacion">
			<!-- Acciones de Navegación de cualquier formuario-->
		</div>
		<div id="divLocal">
			<!-- Acciones Particulares o especiales de este formuario-->
		</div>
	</div>
	<fieldset hidden></fieldset>
	<fieldset>
		<legend>Edición de Periodo</legend>
		<div class="campo">
			<label for="edper_fecinicial">Fecha inicial</label>
			<input type="date" name="edper_fecinicial" id="edper_fecinicial" value="" />
		</div>

		<div class="campo">
			<label for="edper_fecfinal">Fecha final</label>
			<input type="date" name="edper_fecfinal" id="edper_fecfinal" value="" />

		</div>

		<div class="campo">
			<label for="edestado">Estado</label>
			<select name="edestado" id="edestado">
				<option value="A">Activo</option>
				<option value="B">Bloqueado</option>
			</select>
		</div>
		<input type="text" name="id_edper" id="id_edper" value="" hidden/>
	</fieldset>
</form>