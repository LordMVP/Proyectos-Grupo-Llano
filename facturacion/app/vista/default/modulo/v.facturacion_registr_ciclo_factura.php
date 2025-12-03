<form name="facturacion_registr_ciclo_factura" id="facturacion_registr_ciclo_factura" method="POST">
    <h2>Ciclos de Factura</h2>
    <div id="divComandos">
        <div class="divBotones"><!-- Acciones Base de cualquier formuario-->
            <button type="button" id="opNuevo" class="btn">Nuevo</button>
            <button type="button" id="opEditar" class="btn">Editar</button>
            <button type="button" id="opGrabar" class="btn">Grabar</button>
            <button type="button" id="opCancelar" class="btn">Cancelar</button>
            <button type="button" id="opEliminar" class="btn">Eliminar</button>
            <button type="button" id="naBusca" class="btn">Filtro</button>
        </div>
        <!--	<div id="divNavegacion"> Acciones de Navegación de cualquier formuario</div>
                <div id="divLocal"> Acciones Particulares o especiales de este formuario</div>-->
    </div>
    <fieldset><legend>Información del ciclo</legend>
        <div class="campo">
            <label for="cic_ideregistro">ID</label><input type="text" name="cic_ideregistro" id="cic_ideregistro"  />          
        </div>
        <div class="campo">
            <label for="cic_nombre">Nombre</label><input type="text" name="cic_nombre" id="cic_nombre" maxlenght="28" >          
        </div>
        <div class="campo">
            <label for="cic_diainicia">Dia inicial</label><select id="cic_diainicia" name="cic_diainicia"><script type="text/javascript">new Combo('rango', 'cic_diainicia', false, '1~31');</script></select>         
        </div>
        <div class="campo">
            <label for="cic_diafinaliza">Dia final</label><input type="text" name="cic_diafinaliza" id="cic_diafinaliza" readonly="readonly"/>          
        </div>
        <div class="campo">
            <label for="cic_anoactual">A&ntilde;o</label><input type="text" name="cic_anoactual" id="cic_anoactual"  />          
        </div>
        <div class="campo">
            <label for="cic_periodos">Periodicidad</label>
            <select id="cic_periodos" name="cic_periodos">
                <script type="text/javascript">new Combo('periodicidad', 'cic_periodos', false);</script>
            </select>	       
        </div>

        <div class="campo">
            <label for="cic_estado">Estado</label>
            <select id="cic_estado" name="cic_estado">
                <script type="text/javascript">new Combo('estado', 'cic_estado', false, 'ABE');</script>
            </select>          
        </div>  
        <div class="campo">
            <label for="cmbanociclo">Años Anteriores</label>
            <select  id="cmbanociclo" name="cmbanociclo"><script type="text/javascript">
                new Combo('anosciclos', 'cmbanociclo',false); </script>
            </select>		      
        </div>
        <div class="campo" style="
    padding-top: 30px;
    font-size: 17px;
">
           <a href="/achagua/sistema/web/app.php/administracion/replicaciclo_795?ciclo=216"><button type="button" class="btn divBotones" style="display: block;">Replicar</button></a>
        </div>

        <div class="botonera">

        </div>
    </fieldset>
</form>
<div id="divForms">
    <div class="pestana_enc">
        <ul>
            <li><a href="#">Periodos</a></li>
            <li><a href="#">Relacionar liquidación</a></li>
            <li><a href="#">Relacionar empresa</a></li>
        </ul>		
    </div>
    <div class="hoja">
        <iframe src="" id="facturacion_registr_ciclo_factura_periodo"></iframe>
    </div>
    <div class="hoja">
        <iframe src="" id="facturacion_registr_ciclo_factura_liquida"></iframe>
    </div>
    <div class="hoja">
        <iframe src="" id="facturacion_registr_ciclo_factura_empresa"></iframe>
    </div>	
</div>
<div id="divReportes">
</div>