<form name="administracion_registr_tercero" id="administracion_registr_tercero" method="POST">
<input type="hidden" name="navac" id="navac" value="">
<h2>Administración de Terceros</h2>
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
<fieldset><legend>Información del Tercero</legend>
<div class="campo">
    <label for="ter_ideregistro">ID</label><input type="text" name="ter_ideregistro" id="ter_ideregistro" readonly="readonly" />          
</div>
<div class="campo">
        <label for="uni_tipidentifica">Tipo Documento</label>
	<input type="hidden" id="est_tipidentifica" name="est_tipidentifica" value="40" readonly="readonly" />
	<input type="text" id="uni_tipidentifica" name="uni_tipidentifica" value="" />
	<script type="text/javascript">var unid_tipodocumento = new comboUnidad('est_tipidentifica','uni_tipidentifica');</script>
</div>
<div class="campo">
        <label for="ter_documento">Documento</label><input type="text" name="ter_documento" id="ter_documento" value="#valor_ter_documento#"/>  
</div>
<div class="campo">
        <label for="ter_digverificacion">Digito Verificacion</label>
        <input type="text" name="ter_digverificacion" id="ter_digverificacion" disabled="disabled" style="width: 120px"/>  
</div>
<div class="campo">
    <label for="ciudad_cod">Ciudad de Expedición</label><input type="text" name="ciudad_cod" id="ciudad_cod" />          
</div>
<div class="campo">
    <label for="ter_docexpedicion">Fecha de Expedición</label><input type="text" name="ter_docexpedicion" id="ter_docexpedicion" />          
</div>
<div class="campodoble">
    <label for="ter_nombre">Nombre</label><input type="text" name="ter_nombre" id="ter_nombre"  />          
</div>
<div class="campodoble">
    <label for="ter_apellido">Apellido</label><input type="text" name="ter_apellido" id="ter_apellido"  />          
</div>
<div class="campo">
	<label for="uni_tiptercero">Tipo de Tercero</label>
	<input type="hidden" id="est_tiptercero" name="est_tiptercero" value="5" readonly="readonly" />
	<input type="text" id="uni_tiptercero" name="uni_tiptercero" value="" />
	<script type="text/javascript">var unid=new comboUnidad('est_tiptercero','uni_tiptercero');</script>
</div>
<div class="campo" id="divter_nomcompleto">
    <label for="ter_nomcompleto">Nombre Completo</label><input type="text" name="ter_nomcompleto" id="ter_nomcompleto" readonly="readonly" />          
</div>
<div class="campo">
    <label for="ter_correo">Correo Electrónico</label><input type="text" name="ter_correo" id="ter_correo"  />          
</div>
<div class="campo">
    <label for="ter_fecnacimiento">Fecha Nacimiento</label><input type="text" name="ter_fecnacimiento" id="ter_fecnacimiento"  />          
</div>
<div class="campo">
    <label for="ter_sexo">Genero</label>
	<select name="ter_sexo" id="ter_sexo">
		<option value="M">M</option>
		<option value="F">F</option>
		<option value="N">N/A</option>
	</select>           
</div>
<div class="campo">
    <label for="ter_telcelular">Tel. Celular</label><input type="text" name="ter_telcelular" id="ter_telcelular" />          
</div>
<div class="campo">
    <label for="ter_telfijo">Tel. Fijo</label><input type="text" name="ter_telfijo" id="ter_telfijo" />          
</div>
<div class="campo">
    <label for="ter_idaprovechador">Id Tercero Aprovechamiento</label><input type="text" name="ter_idaprovechador" id="ter_idaprovechador" />          
</div>    
<div class="botonera">
	<button type="button" id="mostrar1">Propiedades</button>
	<button type="button" id="mostrar2">Clasificación</button>
</div>
</fieldset>
<fieldset><legend>Relaci&oacute;n de Propiedades</legend>
<div style="max-height:200px; overflow-y:auto;">
	<table border="0" cellspacing="1" cellpadding="0" id="PropTer">
		<tbody>
		</tbody>
		<thead>
			<tr>     
				<th hidden>#</th>
				<th>Ide Propiedad</th>
				<th>Tipo Unid</th>
				<th>Municipio</th>
				<th>Barrio</th>
				<th>Dirección</th>
				<th>Edición</th>
				<th>Sec.</th>
			</tr>
		</thead>
	</table>
</div>    
<div class="botonera">
	<button type="button" id="crearPropiedad">Adicionar</button>
</div>
</fieldset>

<fieldset><legend>Clasificación del tercero</legend>
	<div class="campo">
		<label for="uni_clatercero">Clase</label>
		<input type="hidden" id="est_clatercero" name="est_clatercero" value="22" readonly="readonly" />
		<input type="text" id="uni_clatercero" name="uni_clatercero" value="" />
	</div>
	<div class="campo">
		<label for="asignarClaseTercero"></label>
		<button type="button" id="asignarClaseTercero">Asignar</button>
	</div>
	
	<table border="0" cellspacing="1" cellpadding="0" id="ClasTer">
		<tbody>
		</tbody>
		<thead>
			<tr>     
				<th hidden>#</th>
				<th>Clase a la que pertenece</th>	
				<th>Edición</th>			
			</tr>
		</thead>		
	</table>
</fieldset>
</form>
<!--<div id="divForms">
</div>

<div id="divReportes">
</div>-->
