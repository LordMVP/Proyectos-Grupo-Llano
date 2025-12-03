<form name="facturacion_proces_gen_nota_autom" id="facturacion_proces_gen_nota_autom" method="POST">
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


<h3>Registro de la Nota</h3>

<div class="campo">
	<label for="uni_motnota">Motivo</label>
	<input type="hidden" id="est_motnota" name="est_motnota" value="19" readonly="readonly" />
	<input type="text" id="uni_motnota" name="uni_motnota" value="" />
	<script type="text/javascript">var unid2=new comboUnidad('est_motnota','uni_motnota');</script>
</div>
<div class="campo">
    <label for="not_comentario">Comentario</label><input type="text" name="not_comentario" id="not_comentario" />          
</div>
<div class="campo">
	<label for="uni_liquidacion">Liquidacion</label>
	<input type="hidden" id="est_liquidacion" name="est_liquidacion" value="3" />
	<input type="text" id="uni_liquidacion" name="uni_liquidacion" value="" />
	<script type="text/javascript">var unid=new comboUnidad('est_liquidacion','uni_liquidacion');</script>
</div>
<div class="campo">
    <label for="cic_ideregistro">Ciclo a procesar</label>
	<select id="cic_ideregistro" name="cic_ideregistro"></select>
	<script type="text/javascript">new Combo('ciclo','cic_ideregistro',true);</script>    
</div>

<div class="campo">
    <label for="cmdBuscar">Buscar documentos..</label><button type="button" id="cmdBuscar">Buscar</button>       
</div>
<h3>Selección de Documentos a procesar</h3>
<div class="campo">
    <label for="metodo_selec">Tipo de selección</label>
	<select id="metodo_selec"><option value="P">Periodos</option><option value="F">Facturas</option></select>
</div>
<div class="contenedorDesborda">
<table border="0" cellspacing="1" cellpadding="0" id="periodos">
	<tbody>
	</tbody>
	<thead>
		<tr>
			<th>#</th> 
			<th>Periodo</th>																
		</tr>
	</thead>
</table>
<table border="0" cellspacing="1" cellpadding="0" id="documentos">
	<tbody>
	</tbody>
	<thead>
		<tr>
			<th>#</th> 
			<th>Numero</th>
			<th>Fecha</th>
			<th>Suscripcion</th>
			<th>Liquidación</th>													
		</tr>
	</thead>
</table>
</div>
<h3>Conceptos</h3>
<div class="campo">
    <label for="con_ideregistro_sel">Concepto</label>
	<select id="con_ideregistro_sel" name="con_ideregistro_sel"></select>
</div>
<div class="campo">
  	<label for="concepto_vlrunitari">Valor Unitario</label><input type="text" name="concepto_vlrunitari" id="concepto_vlrunitari"/>          
</div>
<div class="campo">
  	<label for="concepto_cantidad">Cantidad</label><input type="text" name="concepto_cantidad" id="concepto_cantidad"/>          
</div>
<div class="campo">
  	<label for="concepto_vlrtotal">Valor Total</label><input type="text" name="concepto_vlrtotal" id="concepto_vlrtotal"/>          
</div>
<div class="campo">
  	<label for="cmdAceptarConc">Calcular y Aceptar</label><button id="cmdAceptarConc" type="button">Calcular</button>     
</div>
<div class="campo">
  	<label for="cmdEliminarConc">Reiniciar conceptos</label><button id="cmdEliminarConc" type="button">Borrar</button>     
</div>
<table border="0" cellspacing="1" cellpadding="0" id="conceptoRelacionado">
	<tbody>
	</tbody>
	<thead>
		<tr>
			<th>#</th> 
			<th>Concepto</th>
			<th>Valor Unitario</th>
			<th>Cantidad</th>
			<th>Valor Total</th>													
		</tr>
	</thead>
</table>
<div class="botonera">
	<button type="submit">Generar</button>

</div>

</form>
<div id="divForms"> 

</div>

<div id="divReportes">
<table id="documentos">
	<thead>
		<tr>
			
		</tr>
	</thead>
	<tbody>
	</tbody>
</table>
</div>