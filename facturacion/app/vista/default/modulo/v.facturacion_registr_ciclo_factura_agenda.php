<form name="facturacion_registr_ciclo_factura_agenda" id="facturacion_registr_ciclo_factura_agenda" method="POST">
<input type="hidden" name="navac" id="navac" value="">
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
<fieldset hidden></fieldset>
<fieldset><legend>Administraci&oacute;n de Agenda</legend>
    
<div class="campo">
    <label for="cic_ideregistro">ID Ciclo</label><input type="text" name="cic_ideregistro" id="cic_ideregistro"  />          
</div>
<div class="campo">
    <label for="per_ideregistro">ID Periodo</label><input type="text" name="per_ideregistro" id="per_ideregistro"  />          
</div>
<div class="campo">
    <label for="dper_actividad">Actividad</label><input type="text" name="dper_actividad" id="dper_actividad"  />          
</div>
<div class="campo">
    <label for="dper_fecinicial">Fecha inicial</label>
 	<input type="text" name="dper_fecinicial" id="dper_fecinicial"  />  
</div>

<div class="campo">
    <label for="dper_fecfinal">Fecha final</label>
    <input type="text" name="dper_fecfinal" id="dper_fecfinal"  />  

</div>
<div class="campo">
    <label for="prg_ideregistro">ID Programa</label>
	<select id="prg_ideregistro" name="prg_ideregistro">
	<script type="text/javascript">new Combo('programa','prg_ideregistro',false);</script></select>             
</div>
<div class="campo">
    <label for="dper_estado">Estado</label>
	<select name="dper_estado" id="dper_estado">
		<option value="A">Activo</option>
		<option value="B">Bloqueado</option>
		<option value="E">Eliminado</option>
	</select>           
</div>  
<div class="campo">
	<label for="dper_ctrfecha">Control Fecha</label>
	<select name="dper_ctrfecha" id="dper_ctrfecha"><script type="text/javascript">new Combo('sino','dper_ctrfecha');</script></select> 
	</select>   
</div>
<div class="campo">
	<label for="dper_ctrdependen">Depende de Actividad</label>
    <select name="dper_ctrdependen" id="dper_ctrdependen"><script type="text/javascript">new Combo('sino','dper_ctrdependen');</script></select>
</div>
</fieldset>

<div class="botonera">

</div>
<div id="divForms">
</div>

<div id="divReportes">
</div>
<div id="agendasCollapse">
<table id="Agendas">
	<tbody>
	</tbody>
	<thead>
	<tr>	
		<th>#</th>	
		<th>Nombre</th>
		<th>Fecha Inicia</th>
		<th>Fecha final</th>
		<th>Programa Control</th>
		<th>Estado</th>
		<th>Fecha</th>
		<th>Edicion</th>
	</tr>
	</thead>
</table>
<style>body{color:white;}td,tr,th{border:1px solid white;border-collapse: collapse;cursor:all-scroll;}table{border-collapse: collapse;-webkit-user-select: none; /* Safari *-ms-user-select: none; /* IE 10+ and Edge */user-select: none; /* Standard syntax */}</style>
</div>
</form>


