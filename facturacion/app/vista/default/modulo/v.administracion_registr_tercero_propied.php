<br>
<form name="administracion_registr_tercero_propied" id="administracion_registr_tercero_propied" method="POST">
    <div id="divComandos">
        <div class="divBotones"><!-- Acciones Base de cualquier formuario-->
            <button type="button" id="opNuevo" class="btn">Nuevo</button>
            <button type="button" id="opCopiar" class="btn">Copiar Registro</button>
            <button type="button" id="opEditar" class="btn">Editar</button>
            <button type="button" id="opGrabar" class="btn">Grabar</button>
            <button type="button" id="opCancelar" class="btn">Cancelar</button>
            <button type="button" id="opEliminar" class="btn">Eliminar</button>
            <button type="button" id="naBusca" class="btn">Filtro</button>
        </div>
    </div>    
    <!--<div id="divFormActions">
        <div id="divOperacion"> Acciones Base de cualquier formuario
                <button type="button" id="opNuevo">Nuevo</button>
                <button type="button" id="opEditar">Editar</button>
                <button type="button" id="opGrabar">Grabar</button>
                <button type="button" id="opCancelar">Cancelar</button>
                <button type="button" id="opEliminar">Eliminar</button>
                <button type="button" id="naBusca">Filtro</button>
        </div>
        <div id="divLocal"> Acciones Particulares o especiales de este formuario
        </div>
</div>-->
    <input type="hidden" name="navac" id="navac" value="">
    <h2>Administraci&oacute;n de Terceros: Propiedades</h2>
    <fieldset><legend>Información de la propiedad</legend>
        <div class="campo">
            <label for="pro_ideregistro">ID</label><input type="text" name="pro_ideregistro" id="pro_ideregistro">          
        </div>
        <div class="campo">
            <label for="ter_ideregistro">Tercero</label><input type="text" name="ter_ideregistro" id="ter_ideregistro">          
        </div>
        <div class="campo">
            <label for="pro_idepropieda">Ide Propiedad</label><input type="text" name="pro_idepropieda" id="pro_idepropieda">          
        </div>
        <div class="campo">
            <label for="uni_municipio">Municipio</label>
            <select name="uni_municipio" id="uni_municipio"></select>  
        </div>
        <div class="campo">
            <label for="uni_barrio">Barrio</label>       
            <select name="uni_barrio" id="uni_barrio"></select>
        </div>
        <div class="campo">
            <label for="pro_numcatastral">Número Catastral</label><input type="text" name="pro_numcatastral" id="pro_numcatastral">          
        </div>
        <div class="campo">
            <label for="pro_numcatastralnacional">Número Catastral Nacional</label><input type="text" name="pro_numcatastralnacional" id="pro_numcatastralnacional">          
        </div>
        <div class="campodoble">
            <label for="pro_direccion">Dirección</label><input type="text" name="pro_direccion" id="pro_direccion" class="nomenclatura">          
            <script type="text/javascript">new Direccion('pro_direccion')</script>
        </div>
        <div class="campo">
            <label for="uni_cmpdireccion">Complemento Dirección</label>       
            <select name="uni_cmpdireccion" id="uni_cmpdireccion"></select>
        </div>
        <div class="campo">
            <label for="uni_tippropieda">Tipo de Propiedad</label>
            <input type="hidden" id="est_tippropieda" name="est_tippropieda" value="4" readonly="readonly">
            <input type="text" id="uni_tippropieda" name="uni_tippropieda" value="">
            <script type="text/javascript">var unid = new comboUnidad('est_tippropieda', 'uni_tippropieda');</script>
        </div>
        <div class="campo">
            <label for="muba_sector">Sector</label>
            <select name="muba_sector" id="muba_sector"></select>         
        </div>
        <div class="campo">
            <label for="pro_seccion">Sección</label><input type="text" name="pro_seccion" id="pro_seccion">          
        </div>
        <div class="campo">
            <label for="pro_manzana">Manzana</label><input type="text" name="pro_manzana" id="pro_manzana">          
        </div>
        <div class="campo">
            <label for="pro_zona">Zona</label>
            <select name="pro_zona" id="pro_zona"></select> 
            <script type="text/javascript">new Combo('zonaprop', 'pro_zona', true);</script>      
        </div>
        <div class="campo">
            <label for="pro_altriesgo">Acceso Restringido?</label>
            <select name="pro_altriesgo" id="pro_altriesgo"></select>
            <script type="text/javascript">new Combo('sino', 'pro_altriesgo', true);</script>         
        </div>
        <div class="campo">
            <label for="pro_digitos">Dígitos</label><input type="text" name="pro_digitos" id="pro_digitos">          
        </div>
        <div class="campo" id="div_pro_descripcion">
            <label for="pro_descripcion">Descripción</label><input type="text" name="pro_descripcion" id="pro_descripcion">          
        </div>
        <div class="campo">
            <label for="pro_gpsaltitud">Altitud GPS</label><input type="text" name="pro_gpsaltitud" id="pro_gpsaltitud" onkeypress="decimal(event)">          
        </div>
        <div class="campo">
            <label for="pro_gpslatitud">Latitud GPS</label><input type="text" name="pro_gpslatitud" id="pro_gpslatitud" onkeypress="decimal(event)">          
        </div>
        <div class="campo">
            <label for="pro_gpslongitud">Longitud GPS</label><input type="text" name="pro_gpslongitud" id="pro_gpslongitud" onkeypress="decimal(event)">          
        </div>
    </fieldset>
</form>

