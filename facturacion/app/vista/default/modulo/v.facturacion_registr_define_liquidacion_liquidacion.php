<form name="facturacion_registr_define_liquidacion_liquidacion" id="facturacion_registr_define_liquidacion_liquidacion" method="POST">
<input type="hidden" name="navac" id="navac" value="">
<div id="divFormActions">
	<div id="divOperacion"><!-- Acciones Base de cualquier formuario-->
		<button type="button" id="opNuevo">Nuevo</button>
		<button type="button" id="opGrabar">Grabar</button>
	</div>
	<div id="divNavegacion"><!-- Acciones de Navegación de cualquier formuario-->

	</div>
	<div id="divLocal"><!-- Acciones Particulares o especiales de este formuario-->
	</div>
</div>
<h2>Vincular a Liquidaci&oacute;n </h2>
<h3>Liquidacion </h3>
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
    <label for="liq_inivigencia">Ini vigencia</label><input type="text" name="liq_inivigencia" id="liq_inivigencia" /> 
	<script type="text/javascript">new Calendario('liq_inivigencia');</script>        
</div>
<div class="campo">
    <label for="liq_finvigencia">Fin vigencia</label><input type="text" name="liq_finvigencia" id="liq_finvigencia" />
    <script type="text/javascript">new Calendario('liq_finvigencia');</script>     
</div>
<div class="campo">
    <label for="liq_venclasific">Clasificacion ventas</label>
    <select name="liq_venclasific" id="liq_venclasific"></select>          
</div>
<div class="campo">
    <label for="liq_estado">Estado</label>
    <select name="liq_estado" id="liq_estado"><script type="text/javascript">new Combo('estado','liq_estado',false,'AE');</script></select>          
</div>

<h3>Conceptos </h3>
<div class="campo">
	<label for="uni_concepto">Concepto</label>
	<input type="hidden" id="est_concepto" name="est_concepto" value="6" readonly="readonly" />
	<input type="text" id="uni_concepto" name="uni_concepto" value="" />
	<script type="text/javascript">var unid;$(function(){unid=new comboUnidad('est_concepto','uni_concepto');});</script>
</div>
<div class="campo">
    <label for="coli_imprimir">Imprimir Recibo</label>
	<select name="coli_imprimir" id="coli_imprimir"><script type="text/javascript">new Combo('sino','coli_imprimir');</script></select>          
</div>

<div>
	<div class="campo">
	    <label for="borraConc">Quitar conceptos</label>
		<button type="button" id="borraConc">Eliminar</button>          
	</div>	
</div>

<table border="0" cellspacing="1" cellpadding="0" id="Liqs">
		<tbody>
		</tbody>
		<thead>
			<tr>
				<th>#</th> 
				<th>Concepto</th>
				<th>Imprimir Recibo</th>
			</tr>
		</thead>		
	</table>
</form>

<div id="divForms">
</div>

<div id="divReportes">
</div>
