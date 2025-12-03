<form name="facturacion_proces_gen_noved_factu" id="facturacion_proces_gen_noved_factu" method="POST">
<h2>Novedades de Facturación</h2>
<div class="campo">
    <label for="uni_tipsuscripc">Tipo de Suscripción</label>
	<select id="uni_tipsuscripc" name="uni_tipsuscripc">
	<script type="text/javascript">new Combo('tipo_suscripcion','uni_tipsuscripc',true,null,'N');</script></select>    
</div>
<div class="campo">
    <label for="cic_ideregistro">Ciclo a procesar</label>
	<select id="cic_ideregistro" name="cic_ideregistro">
	<script type="text/javascript">new Combo('ciclo','cic_ideregistro',true);</script></select>    
</div>
<div class="campo">
    <label for="per_ideregistro">Periodo</label>
	<select id="per_ideregistro" name="per_ideregistro"></script></select>    
</div>
<div class="campo">
    <label for="fun_ideregistro">Función para procesar</label>
	<select id="fun_ideregistro" name="fun_ideregistro">
	<script type="text/javascript">new Combo('funcion','fun_ideregistro',true,'R');</script></select>    
</div>
<div class="botonera">
	<button type="submit">Generar</button>
</div>

</form>
<div id="divForms">

</div>

<div id="divReportes">
<table id="suscripciones">
	<thead>
		<tr>
			<th>sus_ideregistro</th>
			<th>dsus_descripcion</th>
			<th>dsus_ideregistr</th>
			<th>ter_ideregistro</th>
			<th>pro_ideregistro</th>
			<th>uni_tipusosuscr</th>
			<th>uni_liquidacion</th>			
			<th>cic_ideregistro</th>
		</tr>
	</thead>
	<tbody>
	</tbody>
</table>
</div>
