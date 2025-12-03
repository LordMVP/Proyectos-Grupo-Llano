<form name="facturacion_registr_novedad_factura" id="facturacion_registr_novedad_factura" method="POST">
<h2>Novedades Factura</h2>
<div id="divComandos">
	<div class="divBotones"><!-- Acciones Base de cualquier formuario-->
		<button type="button" id="opNuevo" class="btn">Nuevo</button>
		<button type="button" id="opEditar" class="btn">Editar</button>
		<button type="button" id="opGrabar" class="btn">Grabar</button>
		<button type="button" id="opCancelar" class="btn">Cancelar</button>		
		<button type="button" id="naBusca" class="btn">Filtro</button>
	</div>
</div>

<fieldset><legend>Información de la Suscripción</legend>
	<input type="text" name="dsus_ideregistr" id="dsus_ideregistr"> 
	<div class="campo">
		<label for="uni_tipsucripc">Tipo de Suscripción</label>
		<input type="hidden" id="est_tipsuscripc" name="est_tipsuscripc" value="1" readonly="readonly" />
		<input type="text" id="uni_tipsuscripc" name="uni_tipsuscripc" value="" />
		<script type="text/javascript">var und_tipsuscripc;$(function(){und_tipsuscripc=new comboUnidad('est_tipsuscripc','uni_tipsuscripc');});</script>
	</div>
	<div class="campo"> 
		<label for="dsus_pcodigo">Codigo anterior</label>
		<input type="text" name="dsus_pcodigo" id="dsus_pcodigo"> 
	</div>
	<div class="campo"> 
		<label for="ter_nomcompleto">Nombre del tercero</label>
		<input type="text" name="ter_nomcompleto" id="ter_nomcompleto"> 
	</div>
	<div class="campo"> 
		<label for="pro_idepropieda">Ide Propiedad</label>
		<input type="text" name="pro_idepropieda" id="pro_idepropieda"> 
	</div>
	<div class="campodoble">
		<label for="uni_liquidacion">Liquidación</label>
		<input type="hidden" id="est_liquidacion" name="est_liquidacion" value="3" readonly="readonly" />
		<input type="text" id="uni_liquidacion" name="uni_liquidacion" value="" />
		<script type="text/javascript">var und_liquidacion;$(function(){und_liquidacion=new comboUnidad('est_liquidacion','uni_liquidacion');});</script>
	</div>
	<div class="campo"> 
		<label for="uni_municipio">Municipio</label>
		<input type="text" name="uni_municipio" id="uni_municipio"> 
	</div>
	<div class="campo"> 
		<label for="uni_barrio">Barrio</label>
		<input type="text" name="uni_barrio" id="uni_barrio"> 
	</div>
	<div class="campodoble"> 
		<label for="cnre_nombre">Convenio Suscriptor</label>
		<input type="text" name="cnre_nombre" id="cnre_nombre"> 
	</div>
        <div class="campo"> 
		<label for="txt_saldo">Saldo Vencido</label>
                <input type="text" name="txt_saldo" id="txt_saldo" value="0"> 
	</div>
        
</fieldset>

<fieldset><legend>Información de la novedad</legend>
	<div class="campo"> 
		<label for="nov_ideregistro">ID</label>
		<input type="text" name="nov_ideregistro" id="nov_ideregistro"/> 
	</div>	
	<div class="campodoble"> 
		<label for="nov_observacion">Observación</label>
		<input type="text" name="nov_observacion" id="nov_observacion"> 
	</div>
	<div class="campo"> 
		<label for="cic_ideregistro">Ciclo</label>
		<select name="cic_ideregistro" id="cic_ideregistro"></select> 
	</div>	
	<div class="campo"> 
		<label for="per_ideregistro">Periodo</label>
		<select name="per_ideregistro" id="per_ideregistro"></select> 
	</div>
	<div class="campo"> 
		<label for="nov_fecaprovac">Fecha Aprobación</label><input type="text" name="nov_fecaprovac" id="nov_fecaprovac"> 
		<script type="text/javascript">new Calendario('nov_fecaprovac');</script>
	</div>
	<div class="campo"> 
		<label for="nov_fecprocesad">Fecha Procesado</label>
		<input type="text" name="nov_fecprocesad" id="nov_fecprocesad"> 
	</div>
</fieldset>
<fieldset><legend>Detalle de la novedad</legend>
	<table border="0" cellspacing="1" cellpadding="0" id="tbl_dnovDetnovedad">
		<tbody>
		</tbody>
		<thead>
			<tr>     
				<th hidden>#</th>
				<th>Liquidación</th>
                                <th>Solicitud</th>
				<th>Concepto</th>
				<th>Cantidad</th>
				<th>Valor Unitario</th>
				<th>Valor Total</th>
				<th>Edición</th>
			</tr>
		</thead>
	</table>
     
		
	
	<div class="botonera">
               <label for="valor_total">Valor Total Servicios</label>
               <input type="text" readonly="readonly" name="valor_total" id="valor_total" value="0"> 
		<button type="button" id="abrirDetalleNovedad">Adicionar</button>
	</div>
</fieldset>
</form>

<div id="divForms">
</div>

<div id="divReportes">
</div>
