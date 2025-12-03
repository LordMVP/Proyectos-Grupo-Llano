<form name="facturacion_registr_define_liquidacion_rangos" id="facturacion_registr_define_liquidacion_rangos" method="POST">
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

<h2>Relación de Rangos</h2>
<div class="campo">
	<label for="uni_concepto">Concepto</label>
	<input type="text" id="uni_concepto_nombre" disabled="disabled" />
	<input type="hidden" id="est_concepto" name="est_concepto" value="6" readonly="readonly" />
	<input type="hidden" id="uni_concepto" name="uni_concepto" value="" />	
</div>

<div class="campo">
    <label for="con_tipcalculo">Tipo de Cálculo</label>
	<select name="con_tipcalculo" id="con_tipcalculo"><script type="text/javascript">new Combo('valorformula','con_tipcalculo');</script></select>          
</div>
<div class="campo">
    <label for="raco_raninicial">Rango Inicial</label><input type="text" name="raco_raninicial" id="raco_raninicial"  />          
</div>
<div class="campo">
    <label for="raco_ranfinal">Rango Final</label><input type="text" name="raco_ranfinal" id="raco_ranfinal"  />          
</div>
<div class="campo">
    <label for="raco_accion">Accion</label><select id="raco_accion"></select>
	<script type="text/javascript">new Combo('valorformula','raco_accion');</script>        
</div>
<div class="campo">
    <label for="raco_valor">valor</label><input type="text" name="raco_valor" id="raco_valor"  />          
</div>

<div class="campo">
    <label for="raco_formula">Formula</label><input type="text" name="raco_formula" id="raco_formula"  />          
</div>

<div class="contenedorDesborda">
<h3>Rangos Relacionados</h3>
	<div id="conceptoRelacion">
	<table border="0" cellspacing="1" cellpadding="0" id="Rangos">
		<tbody>
		</tbody>
		<thead>
			<tr>
				<th>#</th>
				<th>Rango Inicial</th>
				<th>Rango Final</th>
				<th>Valor</th>
				<th>Formula</th>				
			</tr>
		</thead>		
	</table>
	</div>
<div id="conceptosFormulacion">
	<h3>Conceptos Disponibles</h3>
	<p>Por favor seleccione cuidadosamente los conceptos que va a utilizar en la formulación. 
		Es recomendable que previamente haya planeado el resultado de esta. 
		Cada vez que usted quite conceptos, la formula será eliminada.</p>
	<table border="0" cellspacing="1" cellpadding="0" id="conceptoDisponible">
		<tbody>
		</tbody>
		<thead>
			<tr>
				<th>Seleccion</th> 
				<th>Nombre</th>
				<th>Alias</th>
				<th>Valor</th>
				<th>Operacion</th>										
			</tr>
		</thead>		
	</table>
	<div id="constuctorFormula">
		<h3>Constructor de Formula</h3>
		<div class="contDatos">
			<div class="conceptos">
				<h4>Panel Conceptos Seleccionados</h4>
				<hr />			
				<div id="conceptos">
				</div>
			</div>
			
			<div class="formula">
				<h4>Panel de Formula</h4>
				<hr />
				<div id="formula">	
				</div>
			</div>
		</div>
		<div class="contHerramienta">		
			<div id="operacion">
				<h4>Panel de Operaciones</h4>
				<button type="button" id="formula_cmdSuma" alt="Más" title="Más">+</button>
				<button type="button" id="formula_cmdResta" alt="Menos" title="Menos">-</button>
				<button type="button" id="formula_cmdMultiplica" alt="Por" title="Por">*</button>
				<button type="button" id="formula_cmdDivide" alt="Sobre" title="Sobre">/</button>
				<button type="button" id="formula_cmdAbrirParentesis" alt="Abrir Paréntesis" title="Abrir Paréntesis">(</button>
				<button type="button" id="formula_cmdCerrarParentesis" alt="Cerrar Paréntesis" title="Cerrar Paréntesis">)</button>
			</div>

			<div id="herramientas">
				<h4>Panel de Herramientas</h4>
				<h5>Valor Numérico</h5>
				<input type="text" id="formula_txtNumero" alt="Valor Numérico" title="Valor Numérico">
				<button type="button" id="formula_cmdNumero" alt="Agregar Valor Numérico" title="Agregar Valor Numérico">Agregar</button>
				<h5>Borrar último</h5>
				<button type="button" id="formula_cmdRemover" alt="Quitar último elemento" title="Quitar último elemento">&laquo; Retroceder</button>
				<h5>Agregar Funcion</h5>
				<select id="formula_selFun_ideregistro">	
				</select>
			</div>
		</div>	
		
		
	</div>
	<div><button type="button" id="acAgregar">Validar y Aceptar Formula</button></div>
</div>
</div>
</form>

<div id="divForms">
</div>

<div id="divReportes">
</div>