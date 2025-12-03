<form name="administracion_proces_cam_tercero_propied" id="administracion_proces_cam_tercero_propied" method="POST">
<h2>Cambio de Propiedades de Tercero</h2>
<div id="divFormActions">
	<div id="divOperacion"><!-- Acciones Base de cualquier formuario-->
		<button type="button" id="opNuevo">Nuevo</button>
		<button type="button" id="opEditar">Editar</button>
		<button type="button" id="opGrabar">Grabar</button>
		<button type="button" id="opCancelar">Cancelar</button>
		<button type="button" id="opEliminar">Eliminar</button>
		<button type="button" id="naBusca">Filtro</button>
	</div>
	<div id="divNavegacion"><!-- Acciones de Navegación de cualquier formuario--></div>
	<div id="divLocal"><!-- Acciones Particulares o especiales de este formuario--></div>
</div>
<fieldset><legend>Información del Tercero de Origen</legend>
<div id="TercActual">
	<input type="text" name="ter_ideregistro_act" id="ter_ideregistro_act">
	<div class="campo">
	    <label for="ter_documento_act">Nit/Ced</label><input type="text" name="ter_documento_act" id="ter_documento_act">          
	</div>
	<div class="campo">
	    <label for="ter_nomcompleto_act">Nombre completo</label><input type="text" name="ter_nomcompleto_act" id="ter_nomcompleto_act">          
	</div>
	<div class="campo">
	    <label for="uni_tiptercero_act">Tipo</label><input type="text" name="uni_tiptercero_act" id="uni_tiptercero_act">          
	</div>
	<div class="campo">
	    <label for="ter_telfijo_act">Teléfono</label><input type="text" name="ter_telfijo_act" id="ter_telfijo_act">          
	</div>
	<div class="campo">
	    <label for="ter_telcelular_act">Celular</label><input type="text" name="ter_telcelular_act" id="ter_telcelular_act">          
	</div>
	<div class="campo">
	    <label for="ter_sexo_act">Sexo</label><input type="text" name="ter_sexo_act" id="ter_sexo_act">          
	</div>
</div>
</fieldset>
<fieldset><legend>Propiedades Relacionadas</legend>
<table id="PropTerActual">
	<tbody></tbody>
	<thead>
		<tr>     
			<th>#</th>
			<th>Ide</th>
			<th>Tipo de Propiedad</th>
			<th>Num. Catastral</th>
			<th>Descripcion</th>
			<th>Municipio</th>
			<th>Barrio</th>
			<th>Direccion</th>
			<th alt="Identifica si el registro está asociado a una suscripción." title="Identifica si el registro está asociado a una suscripción.">Sus?</th>
		</tr>
	</thead>
</table>
<div class="botonera">
<button type="button" id="cmdTrasladarPropiedad">Trasladar</button>
</div>
</fieldset>

<fieldset><legend>Información del Tercero de Destino</legend>
<div id="TercNuevo">
	<input type="text" name="ter_ideregistro_new" id="ter_ideregistro_new">
	<div class="campo">
	    <label for="ter_documento_new">Nit/Ced</label><input type="text" name="ter_documento_new" id="ter_documento_new">          
	</div>
	<div class="campo">
	    <label for="ter_nomcompleto_new">Nombre completo</label><input type="text" name="ter_nomcompleto_new" id="ter_nomcompleto_new">          
	</div>
	<div class="campo">
	    <label for="uni_tiptercero_new">Tipo</label><input type="text" name="uni_tiptercero_new" id="uni_tiptercero_new">          
	</div>
	<div class="campo">
	    <label for="ter_telfijo_new">Teléfono</label><input type="text" name="ter_telfijo_new" id="ter_telfijo_new">          
	</div>
	<div class="campo">
	    <label for="ter_telcelular_new">Celular</label><input type="text" name="ter_telcelular_new" id="ter_telcelular_new">          
	</div>
	<div class="campo">
	    <label for="ter_sexo_new">Sexo</label><input type="text" name="ter_sexo_new" id="ter_sexo_new">          
	</div>
</div>
<h3>Propiedad seleccionada</h3>
<table id="PropTerDestino">
	<tbody></tbody>
	<thead>
		<tr>     
			<th hidden>#</th>
			<th>Suscriptor</th>
			<th>Ide</th>
			<th>Tipo de Propiedad</th>
			<th>Num. Catastral</th>
			<th>Descripcion</th>
			<th>Municipio</th>
			<th>Barrio</th>
			<th>Direccion</th>
		</tr>
	</thead>
</table>
<div class="botonera">
	<button type="button" id="cmdCambiarSeleccionTercero">Elegir tercero de destino diferente</button>
	<button type="button" id="cmdCambiarSeleccionPropidad">Elegir propiedad diferente</button>
</div>
</fieldset>
<div id="divForms">
</div>
<div id="divReportes">
</div>
</form>


