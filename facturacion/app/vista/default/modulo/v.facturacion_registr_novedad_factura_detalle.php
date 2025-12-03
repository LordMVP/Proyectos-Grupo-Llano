<form name="facturacion_registr_novedad_factura_detalle" id="facturacion_registr_novedad_factura_detalle" method="POST">
<h2>Novedades Factura</h2>
<div id="divComandos">
	<div class="divBotones"><!-- Acciones Base de cualquier formuario-->
		<button type="button" id="opNuevoNovedad" class="btn">Nuevo</button>
		<!--<button type="button" id="opEditar" class="btn">Editar</button>-->
		<button type="button" id="opGrabar" class="btn">Grabar</button>
		
		<!--<button type="button" id="opEliminar" class="btn">Eliminar</button>-->		
                <button type="button" id="opListarSolicitudes" class="btn">Ver Solicitudes</button>                
<!--                <button type="button" id="naBusca" class="btn">Filtro</button>-->
                <button type="button" id="opCancelar" class="btn">Cancelar</button>
	</div>
<!--<div id="divFormActions">
	<div id="divOperacion"> Acciones Base de cualquier formuario
		<button type="button" id="opNuevo">Nuevo</button>
		<button type="button" id="opEditar">Editar</button>
		<button type="button" id="opGrabar">Grabar</button>
		<button type="button" id="opCancelar">Cancelar</button>
		<button type="button" id="opEliminar">Eliminar</button>
		<button type="button" id="naBusca">Filtro</button>
	</div>
	<div id="divNavegacion"> Acciones de Navegación de cualquier formuario</div>
	<div id="divLocal"> Acciones Particulares o especiales de este formuario</div>
</div>-->
<fieldset><legend>Detalle de la Novedad</legend>
	<input type="text" name="dnov_ideregistr" id="dnov_ideregistr">
	<div class="campo">
		<label for="nov_ideregistro">ID Novedad</label>
		<input type="text" name="nov_ideregistro" id="nov_ideregistro">
	</div>
	<div class="campo"> 
		<label for="cic_nombre">Ciclo</label>
		<input type="text" name="cic_nombre" id="cic_nombre">
	</div>
	<div class="campo"> 
		<label for="per_nombre">Periodo</label>
		<input type="text" name="per_nombre" id="per_nombre">
	</div>
	<div class="campodoble">
		<label for="uni_liquidacion">Tipo de Liquidación</label>
		<select name="uni_liquidacion" id="uni_liquidacion"></select>
	</div>
	<div class="campodoble"> 
		<label for="uni_concepto">Concepto</label>
		<select id="uni_concepto" name="uni_concepto"></select>
	</div>
	<div class="campo"> 
		<label for="dnov_cantidad">Cantidad/Volumen</label>
		<input type="text" name="dnov_cantidad" id="dnov_cantidad">
	</div>
	<div class="campo"> 
		<label for="dnov_vlrunitari">Valor Unitario</label>
		<input type="text" name="dnov_vlrunitari" id="dnov_vlrunitari">
	</div>
	<div class="campo"> 
		<label for="dnov_vlrtotal">Valor Total</label>
		<input type="text" name="dnov_vlrtotal" id="dnov_vlrtotal">                
                <input type="hidden" name="dnov_vlrtotal_model" id="dnov_vlrtotal_model">
                <input type="hidden" name="dataSolicitudes" id="dataSolicitudes">
                
	</div>
</fieldset>

<fieldset id="fieldSetNovedadesSolicitudesRelacionadas"><legend>Solicitudes Relacionadas</legend>
	<table border="0" cellspacing="1" cellpadding="0" id="tbl_dnovDetnovedadSolicitudesRelacionadas">
		<tbody>
		</tbody>
		<thead>
			<tr>     
				<th hidden>#</th>
                                <th>Id</th>
				<th>Descripción</th>
				<th>Fecha Solicitud</th>
                                <th>Solicitante</th>
                                <th>Usuario Graba </th>
                                <th>Edición</th>
			</tr>
		</thead>
	</table>
	
</fieldset>

<fieldset id="fieldSetNovedadesSolicitudesRadicadas"><legend>Solicitudes Radicadas</legend>
	<table border="0" cellspacing="1" cellpadding="0" id="tbl_dnovDetnovedadSolicitudesRadicadas">
		<tbody>
		</tbody>
		<thead>
			<tr>     
				
                                <th hidden>#</th>
                                <th>Id</th>
				<th>Descripción</th>
				<th>Fecha Solicitud</th>
                                <th>Solicitante</th>
                                <th>Usuario Graba </th>
                                <th>Edición</th>
			</tr>
		</thead>
	</table>
	
</fieldset>

</form>

<div id="divForms">
</div>

<div id="divReportes">
</div>
