
<form name="facturacion_registr_define_liquidacion_conceptos" id="facturacion_registr_define_liquidacion_conceptos" method="POST">
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
<h2>Conceptos </h2>
<div class="campo">
	<label for="uni_concepto">Concepto</label>
	<input type="hidden" id="est_concepto" name="est_concepto" value="6" readonly="readonly" />
	<input type="text" id="uni_concepto" name="uni_concepto" value="" />
	<script type="text/javascript">var unid;$(function(){unid=new comboUnidad('est_concepto','uni_concepto');});</script>
</div>
<div class="campo">
    <label for="con_nombre">Nombre</label><input type="text" name="con_nombre" id="con_nombre"  />          
</div>
<div class="campo">
    <label for="con_alias">Alias</label><input type="text" name="con_alias" id="con_alias"  />          
</div>
<div class="campo">
    <label for="con_abreviatura">Abreviatura</label><input type="text" name="con_abreviatura" id="con_abreviatura"  />          
</div>
<div class="campo">
    <label for="con_tipcalculo">Tip. Calculo</label>
	<select name="con_tipcalculo" id="con_tipcalculo"><script type="text/javascript">new Combo('valorformula','con_tipcalculo');</script></select>          
</div>
<div class="campo">
    <label for="con_operacion">Operacion</label>
	<select name="con_operacion" id="con_operacion"><script type="text/javascript">new Combo('operacion','con_operacion');</script></select>          
</div>
<div class="campo">
    <label for="con_preliquidar">preliquidar</label>
    <select name="con_preliquidar" id="con_preliquidar"><script type="text/javascript">new Combo('sino','con_preliquidar');</script></select>
</div>
<div class="campo">
    <label for="con_anticipo">Anticipo</label>
    <select name="con_anticipo" id="con_anticipo"><script type="text/javascript">new Combo('sino','con_anticipo');</script></select>          
</div>
<div class="campo">
    <label for="con_pagpriori">Pag Prioridad</label>
    <select name="con_pagpriori" id="con_pagpriori"><script type="text/javascript">new Combo('rango','con_pagpriori',false,'0~3');</script></select>          
</div>
<div class="campo">
    <label for="con_financiable">Financiable</label>
    <select name="con_financiable" id="con_financiable"><script type="text/javascript">new Combo('sino','con_financiable');</script></select>          
</div>
<div class="campo">
    <label for="prg_ideregistro">Programa Aplica</label>
    <select name="prg_ideregistro" id="prg_ideregistro"><script type="text/javascript">new Combo('programa','prg_ideregistro',false,'CO');</script></select>          
</div>
<div class="campo">
    <label for="con_tipregistro">Función</label>
    <select name="con_tipregistro" id="con_tipregistro"><script type="text/javascript">new Combo('funcion_concepto','con_tipregistro',false);</script></select>          
</div>
<div class="campo">
    <label for="con_inivigencia">Ini vigencia</label><input type="text" name="con_inivigencia" id="con_inivigencia" /> 
	<script type="text/javascript">new Calendario('con_inivigencia',fecha.hoy);</script>        
</div>
<div class="campo">
    <label for="con_finvigencia">Fin vigencia</label><input type="text" name="con_finvigencia" id="con_finvigencia" />
    <script type="text/javascript">new Calendario('con_finvigencia',fecha.hoy);</script>     
</div>
<div class="campo">
    <label for="con_valor">Valor</label>
	<input type="text" name="con_valor" id="con_valor"  />     
</div>
<div class="campo">
    <label for="con_estado">Estado</label>
    <select name="con_estado" id="con_estado"><script type="text/javascript">new Combo('estado','con_estado',false,'AE');</script></select>          
</div>
<div class="campo">
    <label for="tor_nomtabla">Tabla origen</label>
    <select name="tor_nomtabla" id="tor_nomtabla"><script type="text/javascript">new Combo('tor_nomtabla','tor_nomtabla',true)</script></select>          
</div>
<div class="campo">
    <label for="dtor_nomcampo">Campo</label>
    <select name="dtor_nomcampo" id="dtor_nomcampo"></select>          
</div>
<table id="Conceptos">
	<tbody>
	</tbody>
	<thead>
	<tr>
		<th>Sel</th>
		<th>Concepto</th>
		<th>Alias</th>
		<th>Abreviatura</th>
		<th>Valor/Formula</th>
		<th>Efecto</th>		
		<th>Financiar</th>
		<th>Programa</th>
	</tr>
	</thead>
</table>
     
<div class="botonera">

</div>
</form>

<div id="divForms">
</div>

<div id="divReportes">
</div>
