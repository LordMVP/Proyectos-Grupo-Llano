<form name="facturacion_proces_inicia_ciclo" id="facturacion_proces_inicia_ciclo" method="POST">
<h2>Iniciar Ciclos de Facturación</h2>
<div class="campo">
    <label for="cic_ideregistro">Inicialización de Ciclos</label>
	<select id="cic_ideregistro" name="cic_ideregistro">
	<script type="text/javascript">new Combo('ciclo','cic_ideregistro',true,'cerrados');</script></select>    
</div>
<div class="campo">
    <label for="cic_anosiguiente">Año a procesar</label>
	<input type="text" name="cic_anosiguiente" id="cic_anosiguiente">  
</div>
<div class="botonera">
	<button type="submit">Inicializar</button>
</div>
<h3>Registros en conflicto</h3>
<table id="regConflicto">
<thead>
</thead>
<tbody>
</tbody>
</table>

</form>
<div id="divForms">

</div>
