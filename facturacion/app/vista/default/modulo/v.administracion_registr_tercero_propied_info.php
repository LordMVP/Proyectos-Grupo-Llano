<br>
<form name="administracion_registr_tercero_propied_info" id="administracion_registr_tercero_propied_info" method="POST">
<input type="hidden" name="navac" id="navac" value="">
    <div id="divComandos">
        <div class="divBotones"><!-- Acciones Base de cualquier formuario-->
            <button type="button" id="opNuevo" class="btn">Nuevo</button>
            <button type="button" id="opEditar" class="btn">Editar</button>
            <button type="button" id="opGrabar" class="btn">Grabar</button>
            <button type="button" id="opCancelar" class="btn">Cancelar</button>
            <button type="button" id="opEliminar" class="btn">Eliminar</button>
            <button type="button" id="naBusca" class="btn">Filtro</button>
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
	<div id="divLocal"> Acciones Particulares o especiales de este formuario
	</div>
</div>-->
<h2>Administraci&oacute;n de Terceros: Información adicional de Propiedades</h2>
<fieldset><legend>Información adicional para la propiedad</legend>
<div class="campo">
    <label for="inpr_ideregistr">ID</label><input type="text" name="inpr_ideregistr" id="inpr_ideregistr"/>          
</div>
<div class="campo">
    <label for="inf_ideregistro">Tipo de Información</label>
    <input type="hidden" name="uni_tippropieda" id="uni_tippropieda"/>    
    <input type="hidden" name="est_tippropieda" id="est_tippropieda"/>
	<select name="inf_ideregistro" id="inf_ideregistro"></select>          
</div>
<div class="campo">
    <label for="tip_ideregistro">Tipificación</label>
	<select name="tip_ideregistro" id="tip_ideregistro"><script type="text/javascript"></script></select>          
</div>
<div class="campo" id="campo_informacion">
          
</div>
<div class="campo">
    <label for="inpr_descripcio">Descripción</label><input type="text" name="inpr_descripcio" id="inpr_descripcio"/>          
</div>
<div class="campo">
     <label for="pro_ideregistro">Propiedad</label><input type="text" name="pro_ideregistro" id="pro_ideregistro"/>          
</div>
<div class="campo">
    <label for="tip_nombre">Nombre de la Tipificación</label><input type="text" name="tip_nombre" id="tip_nombre"/>          
</div>
<div class="campo">
    <label for="inpr_estado">Estado</label>
	<select name="inpr_estado" id="inpr_estado"><script type="text/javascript">new Combo('estado','inpr_estado',false,'AE');</script></select>  
</div>
</fieldset>

<fieldset><legend>Grupos de Información</legend>
<div id="divFormActions">
<label for="grpinform">Seleccione Grupo</label>
<button type="button" id="opAgregarGrupo">+ Grupo</button>
<select id="grpinform"></select>
</div>
<div class="contenedorDesborda">
	<table border="0" cellspacing="1" cellpadding="0" id="Info">
		<tbody>
		</tbody>
		<thead>
			<tr>
				<th>Selección</th>
				<th>Grupo</th>
				<th>Tipificación</th>
				<th>Información</th>
				<th>Descripción</th>				
				<th>Dato</th>					
			</tr>
		</thead>		
	</table>
</div>
</fieldset>
</form>

<div id="divForms">
</div>

<div id="divReportes">
</div>
