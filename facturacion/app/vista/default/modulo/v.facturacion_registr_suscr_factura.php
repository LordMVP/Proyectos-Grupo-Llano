<form name="facturacion_registr_suscr_factura" id="facturacion_registr_suscr_factura" method="POST">
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
<h2>Suscriptor</h2>
<h3>Buscar por suscripcion</h3>
<div class="campo"> 
	<label for="dsus_ideregistr_busca">Ide de Suscripción</label><input type="text" id="dsus_ideregistr_busca"/> 
</div>
ó
<div class="campo"> 
	<label for="dsus_pcodigo_busca">Codigo Anterior de suscr.</label><input type="text" id="dsus_pcodigo_busca"/> 
</div>
<div class="campo"> 
	<label for="buscar_dsus">Buscar</label><button type="button" id="buscar_dsus">Buscar...</button> 
</div>
<h3>Datos del Tercero</h3>
<div class="campo">
    <label for="ter_documento">Documento</label><input type="text" name="ter_documento" id="ter_documento"/>          
</div>
<div class="campo">
    <label for="ter_nomcompleto">Nombre Completo</label><input type="text" name="ter_nomcompleto" id="ter_nomcompleto" readonly="readonly" />          
</div>
<div class="campo">
    <label for="ter_ideregistro">ID</label><input type="text" name="ter_ideregistro" id="ter_ideregistro" readonly="readonly" />          
</div>
<div class="campo">
    <label for="ter_telfijo">Tel. Fijo</label><input type="text" name="ter_telfijo" id="ter_telfijo" />          
</div>
<div class="campo">
    <label for="ter_telcelular">Tel. Celular</label><input type="text" name="ter_telcelular" id="ter_telcelular" />          
</div>
<div class="campo">
    <label for="sus_ideregistro">ID Suscripcion</label><input type="text" name="sus_ideregistro" id="sus_ideregistro" />          
</div>
<div class="campo">
    <label for="cnre_ideregistro">Convenio</label>
    <select name="cnre_ideregistro" id="cnre_ideregistro"><script type="text/javascript">new Combo('convenio','cnre_ideregistro',false);</script></select>          
</div>
</form>
<div id="divForms">
<div class="pestana_enc">
	<ul>
		<li><a href="#">Suscripción</a></li>
		<li><a href="#">Conceptos</a></li>				
	</ul>		
</div>
<div class="hoja">
	<iframe src="" id="facturacion_registr_suscr_factura_suscripcion"></iframe>
</div>
<div class="hoja">
	<iframe src="" id="facturacion_registr_suscr_factura_concepto"></iframe>
</div>
</div>

<div id="divReportes">
</div>
