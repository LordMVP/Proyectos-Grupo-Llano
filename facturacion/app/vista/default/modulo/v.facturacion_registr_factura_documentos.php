<form name="facturacion_registr_factura_documentos" id="facturacion_registr_factura_documentos" method="POST">
<input type="hidden" name="navac" id="navac" value="">
<div class="campo">
	<label for="uni_liquidacion">Liquidacion</label>
	<input type="hidden" id="est_liquidacion" name="est_liquidacion" value="3" readonly="readonly" />
	<input type="text" id="uni_liquidacion" name="uni_liquidacion" value="" />
	<script type="text/javascript">var unid;$(function(){unid=new comboUnidad('est_liquidacion','uni_liquidacion');});</script>
</div>
<div class="campo">
    <label for="uni_documento">Documento</label>
    <select name="uni_documento" id="uni_documento"></select>          
</div>
<div class="campo">
    <label for="uni_tipdocument">Tipo de documento</label>
    <select name="uni_tipdocument" id="uni_tipdocument"></select>          
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
<div class="botonera">
	<button type="button" id="cmdFiltrar">Filtrar</button>
</div>
<div class="contenedorDesborda">
	<div class="espacioAdicion">
		<h3>Conceptos a ajustar</h3>
		<table id="Conceptos">
			<tbody>
			</tbody>
			<thead>
			<tr>
				<th>Sel</th>
				<th>Estado</th>
				<th>Fecha aprobación</th>
				<th>Id Suscripción</th>
				<th>Ciclo</th>
				<th>Periodo</th>
				<th>Val. Real $</th>
			</tr>
			</thead>
		</table>
	</div>    
  
</div>

</form>

<div id="divForms">
</div>

<div id="divReportes">
</div>
<!--
SELECT "dfac_ideregistr","dfac_estado","dfac_cantidad","dfac_vlrunitari","dfac_vlrtotal","uni_concepto","est_concepto"
	FROM "public"."dfac_detfactura"
// fac_ideRegistro,fac_estado,uni_tipSuscripc,emp_ideRegistro,fac_numero,uni_documento,fac_fecha,cic_ideRegistro,per_ideRegistro,uni_tipDocument,ter_ideRegistro,sus_ideRegistro,fac_ideOrigen,fac_ideActual
-->