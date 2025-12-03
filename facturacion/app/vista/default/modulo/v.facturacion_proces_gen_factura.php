<form name="facturacion_proces_gen_factura" id="facturacion_proces_gen_factura" method="POST">
<input type="hidden" name="navac" id="navac" value="">
<h2>Generación de Facturas</h2>
<div class="campo">
    <label for="uni_tipsuscripc">Tipo de Suscripción</label>
	<select id="uni_tipsuscripc" name="uni_tipsuscripc">
	<script type="text/javascript">new Combo('tipo_suscripcion','uni_tipsuscripc',true,null,'N');</script></select>    
</div>
<div class="campo">
	<label for="uni_tipusosuscr">Tipo de Uso</label>
	<input type="hidden" id="est_tipusosuscr" name="est_tipusosuscr" value="2" readonly="readonly" />
	<input type="text" id="uni_tipusosuscr" name="uni_tipusosuscr" value="" />
	<script type="text/javascript">var unid2=new comboUnidad('est_tipusosuscr','uni_tipusosuscr');</script>
</div>
<div class="campo">
    <label for="cic_ideregistro">Ciclo a procesar</label>
	<select id="cic_ideregistro" name="cic_ideregistro"></select>
	<script type="text/javascript">new Combo('ciclo','cic_ideregistro',true);</script>    
</div>
<div class="campo">
    <label for="per_ideregistro">Periodo</label>
	<select id="per_ideregistro" name="per_ideregistro"></script></select>    
</div>
<div class="campo">
    <label for="conpreliq">Calcular en Preliquidación</label>
	<select id="conpreliq" name="conpreliq"></select>   
	<script type="text/javascript">new Combo('sino','conpreliq',false);</script>
</div>


<div class="botonera">
	<button type="submit">Generar</button>
	<button type="button" id="cmdApobar">Aprobar</button>
</div>

</form>
<div id="divForms">

</div>

<div id="divReportes">
<table id="suscripciones">
	<thead>
		<tr>
			<th>sus <sub>[0]</sub></th>
			<th>dsus_des <sub>[1]</sub></th>
			<th>dsus <sub>[2]</sub></th>
			<th>ter <sub>[3]</sub></th>
			<th>pro <sub>[4]</sub></th>
			<th>uni_tipsu <sub>[5]</sub></th>			
			<th>uni_tipus <sub>[6]</sub></th>
			<th>uni_liq <sub>[7]</sub></th>			
			<th>cic <sub>[8]</sub></th>
			<th>est_liq <sub>[9]</sub></th>
			<th>est_tipsu <sub>[10]</sub></th>
			<th>est_tipus <sub>[11]</sub></th>
		</tr>
	</thead>
	<tbody>
	</tbody>
</table>
