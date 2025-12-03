
<form name="facturacion_registr_factura_conceptos" id="facturacion_registr_factura_conceptos" method="POST">
<input type="hidden" name="navac" id="navac" value="">
<div class="contenedorDesborda">
	<h3>Conceptos</h3>
	<table id="Conceptos">
		<tbody>
		</tbody>
		<thead>
		<tr>
			<th>Sel</th>
			<th>Estado</th>
			<th>Cantidad</th>
                        <th title="Campo dfac_vlrtotal">Vlr. Liquidado</th>
                        <th title="Campo dfac_vlrreal">Vlr. Pagar</th>
			<th>Concepto</th>
			
		</tr>
		</thead>
	</table>
	     
	<div class="botonera">
	
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