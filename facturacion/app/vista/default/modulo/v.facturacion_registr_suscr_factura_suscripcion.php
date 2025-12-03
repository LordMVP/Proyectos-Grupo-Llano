<form name="facturacion_registr_suscr_factura_suscripcion" id="facturacion_registr_suscr_factura_suscripcion" method="POST">
<input type="hidden" name="navac" id="navac" value="">
<div id="divFormActions">
	<div id="divOperacion"><!-- Acciones Base de cualquier formuario-->
		<button type="button" id="opNuevo">Nuevo</button>
		<button type="button" id="opGrabar">Grabar</button>
		<button type="button" id="opEliminar">Eliminar</button>
	</div>	
	<div id="divLocal"><!-- Acciones Particulares o especiales de este formuario-->
	</div>
</div>
<h2>Registro de Suscripci&oacute;n </h2>
<div class="contenedorDesborda">
	<h3>Suscripciones del Tercero</h3>	
	<table border="0" cellspacing="1" cellpadding="0" id="suscr">
		<tbody></tbody>
		<thead>
		<tr>     
			<th>Seleccion</th>
			<th>Convenio de Pago</th>			
		</tr>
		</thead>		
	</table>
	<h3>Seleccione Propiedad</h3>	
	<table border="0" cellspacing="1" cellpadding="0" id="PropTer">
		<tbody></tbody>
		<thead>
			<tr>     
				<th>Seleccion</th>
				<th>Tipo de Propiedad</th>
				<th>Ide Propiedad</th>
				<th>Municipio</th>
				<th>Barrio</th>
				<th>Direccion</th>
				<th>Seccion</th>
				<th>Manzana</th>
			</tr>
		</thead>		
	</table>
	<div id="formDetSuscripcion">
		<h3>Detalle de la Suscripcion</h3>
		<div class="campo">
	    	<label for="dsus_ideregistr">ID</label><input type="text" name="dsus_ideregistr" id="dsus_ideregistr"/>          
		</div>
		<div class="campo">
	    	<label for="dsus_fecinicio">Fecha de inicio</label>
			<input type="text" name="dsus_fecinicio" id="dsus_fecinicio"/>     
			<script type="text/javascript">new Calendario('dsus_fecinicio',fecha.hoy);</script>
		</div>
		<div class="campo">
	    	<label for="dsus_descripcion">Descripción</label><input type="text" name="dsus_descripcion" id="dsus_descripcion"/>          
		</div>
		<div class="campo">
			<label for="uni_tipsuscripc">Tipo de suscripción</label>
			<select id="uni_tipsuscripc" name="uni_tipsuscripc"></select> 
		</div>
		<div class="campo">
			<label for="uni_tipusosuscr">Tipo de Uso</label>
			<input type="hidden" id="est_tipusosuscr" name="est_tipusosuscr" value="2" readonly="readonly" />
			<input type="text" id="uni_tipusosuscr" name="uni_tipusosuscr" value="" />
			<script type="text/javascript">var unid2=new comboUnidad('est_tipusosuscr','uni_tipusosuscr');</script>
		</div>
		<div class="campo">
			<label for="uni_liquidacion">Liquidacion</label>
			<select id="uni_liquidacion" name="uni_liquidacion"></select>
		</div>
		<div class="campo">
	    	<label for="cic_ideregistro">Ciclo</label>
			<select id="cic_ideregistro" name="cic_ideregistro">
			</select>            
		</div>
		<div class="campo">
	    	<label for="dsus_pcodigo">Codigo Anterior</label><input type="text" name="dsus_pcodigo" id="dsus_pcodigo"/>          
		</div>
		<div class="campo">
	    	<label for="dsus_estado">Estado</label>
			<select id="dsus_estado" name="dsus_estado">
				<script type="text/javascript">new Combo('estado','dsus_estado',false);</script>
			</select>             
		</div>
		<div class="campo">
	    	<label for="pro_catestrato">Estrato</label><input type="text" name="pro_catestrato" id="pro_catestrato"/>          
		</div>
		<div class="campo">
	    	<label for="dsus_iniestado">Vigencia inicio</label><input type="text" name="dsus_iniestado" id="dsus_iniestado"/>          
			<script type="text/javascript">new Calendario('dsus_iniestado',fecha.hoy);</script>
		</div>
		<div class="campo">
	    	<label for="dsus_finestado">Vigencia Fin</label><input type="text" name="dsus_finestado" id="dsus_finestado"/>          
			<script type="text/javascript">new Calendario('dsus_finestado',fecha.hoy);</script>
		</div>
		<div class="campo">
	    	<label for="tsu_persuspend">Suspende</label><input type="text" name="tsu_persuspend" id="tsu_persuspend"/>          
		</div>
	</div>
	<table border="0" cellspacing="1" cellpadding="0" id="dsusDet">
		<tbody>
		</tbody>
		<thead>
			<tr>     
				<th>#</th>
				<th>Codigo Anterior</th>
				<th>Fecha Suscrip</th>				
				<th>Tipo Suscripcion</th>
				<th>Tipo Liquidacion</th>
				<th>Ciclo</th>							
				<th>Estado</th>
				<th>Vigencia</th>
				<th>Ruta</th>
			</tr>
		</thead>		
	</table>
</div>
</form>

<div id="divForms">
</div>

<div id="divReportes">
</div>