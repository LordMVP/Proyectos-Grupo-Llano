<?php

/* LlanogasLlanogasBundle:Operaciones:registroRapido.html.twig */
class __TwigTemplate_cd4344832beb966199e6fe12abb776f7f8cac585f4af51c0d53e47a700e80aff extends Twig_Template
{
    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        $this->parent = $this->env->loadTemplate("::base.html.twig");

        $this->blocks = array(
            'stylesheets' => array($this, 'block_stylesheets'),
            'scripts' => array($this, 'block_scripts'),
            'titulo' => array($this, 'block_titulo'),
            'body' => array($this, 'block_body'),
            'javascripts' => array($this, 'block_javascripts'),
        );
    }

    protected function doGetParent(array $context)
    {
        return "::base.html.twig";
    }

    protected function doDisplay(array $context, array $blocks = array())
    {
        $this->parent->display($context, array_merge($this->blocks, $blocks));
    }

    // line 2
    public function block_stylesheets($context, array $blocks = array())
    {
        // line 3
        echo "    <link rel=\"stylesheet\" type=\"text/css\" href=\"";
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/theme/jquery.ui.all.css"), "html", null, true);
        echo "\" />
    <link href=\"";
        // line 4
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/facturacion/dataTables.css"), "html", null, true);
        echo "\" media=\"screen\" type=\"text/css\" rel=\"stylesheet\" />
    <link rel=\"stylesheet\" type=\"text/css\" href=\"";
        // line 5
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/theme/jquery.datetimepicker.css"), "html", null, true);
        echo "\" />
    <style>
        .controlTable input, .controlTable select{
            width: 7.5em;
        }
        .btnDerecha{
            text-align: right; 
            padding-right: 35px;
        }

        .td-direccion{
            min-width: 170px;
        }

        .td-valor{
            min-width: 70px;
        }

        .td-observaciones{
            min-width: 200px;
        }
            .td-observaciones input{
                width: 95%;
            }

        .td-secuencia,
        .td-suspension{
            min-width: 50px;
        }

        .at-data-table{
            max-height: 800px;
        }

        .td-efectiva{
            min-width: 50px;
        }

        #divSuspension a, 
        #divReconexion a{
            color:#408BC4;
        }
    
            #divSuspension a i, 
            #divReconexion a i{
                font-size:13px; 
                margin-left:5px;
            }

        #divSuspension a:hover, 
        #divReconexion a:hover{
            text-decoration: none;
        }

        .txtFechaRequerido{
            width:60px; 
            text-align:center; 
            padding-left:0px;
        }

    </style>

";
    }

    // line 69
    public function block_scripts($context, array $blocks = array())
    {
    }

    // line 72
    public function block_titulo($context, array $blocks = array())
    {
        echo "Registro rápido de suspensiones y reconexiones - ";
        echo twig_escape_filter($this->env, (isset($context["empresa"]) ? $context["empresa"] : $this->getContext($context, "empresa")), "html", null, true);
        echo "  ";
    }

    // line 74
    public function block_body($context, array $blocks = array())
    {
        // line 76
        echo "    <input type=\"hidden\" style=\"display: none;\" value=\"";
        echo twig_escape_filter($this->env, (isset($context["fechaactualSuspension"]) ? $context["fechaactualSuspension"] : $this->getContext($context, "fechaactualSuspension")), "html", null, true);
        echo "\" id=\"txtFechaactualSuspension\" />
    <input type=\"hidden\" style=\"display: none;\" value=\"";
        // line 77
        echo twig_escape_filter($this->env, (isset($context["fechaactualReconexion"]) ? $context["fechaactualReconexion"] : $this->getContext($context, "fechaactualReconexion")), "html", null, true);
        echo "\" id=\"txtFechaactualReconexion\" />
    <div class=\"divContenedorColapsable\">
        <div class=\"divColapsable\">
            <h3 class=\"tituloColapsable\">Cabecera de las suspensiones y reconexiones</h3>
            <div class=\"btnColapsable\"><a href=\"\" class=\"fa fa-minus\"></a></div>
        </div>
        <div class=\"contenidoColapsable\">
            <div id=\"divFiltro\">
                <fieldset>
                    <legend>Buscar:</legend>
                    <label style=\"display: inline;\" for=\"rbtnSus\"><input name=\"radFiltrar\" type=\"radio\" data-val=\"S\" id=\"rbtnSus\"/> Suspensiones</label>
                    <label style=\"display: inline;\" for=\"rbtnRec\"><input name=\"radFiltrar\" type=\"radio\" data-val=\"R\" id=\"rbtnRec\"/> Reconexiones</label>
                </fieldset>
                <fieldset id=\"fsParametros\" style=\"display: none;\">
                    <legend>Filtro</legend>
                    <div class=\"campo\">
                        <label for=\"txtMunicipio\">Municipio:</label>
                        <input type=\"text\" id=\"txtMunicipio\" placeholder=\"Municipio\"/>
                    </div>

                    <div class=\"campo\">
                        <label for=\"txtBarrio\">Barrio:</label>
                        <input type=\"text\" id=\"txtBarrio\" placeholder=\"Barrio\" disabled=\"disabled\" />
                    </div>

                    <div class=\"campo\">
                        <label for=\"txtFechaProgramacion\">Fecha de Programación:</label>
                        <input type=\"text\" id=\"txtFechaProgramacion\" placeholder=\"Fecha de Programación\"/>
                    </div>

                    <div class=\"campo\">
                        <label for=\"cmbRuta\">Ruta:</label>
                        <select id=\"cmbRuta\">
                            <option value=\"-1\" >Seleccione una opción</option>
                            ";
        // line 111
        $context['_parent'] = (array) $context;
        $context['_seq'] = twig_ensure_traversable((isset($context["listarutas"]) ? $context["listarutas"] : $this->getContext($context, "listarutas")));
        foreach ($context['_seq'] as $context["_key"] => $context["rutas"]) {
            // line 112
            echo "                                <option value=\"";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["rutas"]) ? $context["rutas"] : $this->getContext($context, "rutas")), "idruta"), "html", null, true);
            echo "\">";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["rutas"]) ? $context["rutas"] : $this->getContext($context, "rutas")), "ruta"), "html", null, true);
            echo "</option>
                            ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['rutas'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 114
        echo "                        </select>
                    </div>

                    <div class=\"campo\">
                        <label for=\"cmbZona\">Zona:</label>
                        <select id=\"cmbZona\">
                            <option value=\"-1\" >Seleccione una opción</option>
                            <option value=\"R\">Rural</option>
                            <option value=\"U\">Urbana</option>
                        </select>
                    </div>

                    <div class=\"campo\">
                        <label for=\"cmbMotivoSus\" id=\"lCmbMotivoSus\" style=\"display: none;\">Motivo:</label>
                        <select id=\"cmbMotivoSus\" style=\"display: none;\">
                            <option value=\"-1\" >Seleccione una opción</option>
                            ";
        // line 130
        $context['_parent'] = (array) $context;
        $context['_seq'] = twig_ensure_traversable((isset($context["listamotivosuspension"]) ? $context["listamotivosuspension"] : $this->getContext($context, "listamotivosuspension")));
        foreach ($context['_seq'] as $context["_key"] => $context["motivosus"]) {
            // line 131
            echo "                                <option value=\"";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["motivosus"]) ? $context["motivosus"] : $this->getContext($context, "motivosus")), "idmotivo"), "html", null, true);
            echo "\">";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["motivosus"]) ? $context["motivosus"] : $this->getContext($context, "motivosus")), "motivo"), "html", null, true);
            echo "</option>
                            ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['motivosus'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 133
        echo "                        </select>
                        <label for=\"cmbMotivoReconexion\" id=\"lCmbMotivoReconexion\"style=\"display: none;\">Motivo:</label>
                        <select id=\"cmbMotivoReconexion\" style=\"display: none;\">
                            <option value=\"-1\" >Seleccione una opción</option>
                            ";
        // line 137
        $context['_parent'] = (array) $context;
        $context['_seq'] = twig_ensure_traversable((isset($context["listamotivoreconexion"]) ? $context["listamotivoreconexion"] : $this->getContext($context, "listamotivoreconexion")));
        foreach ($context['_seq'] as $context["_key"] => $context["motivorec"]) {
            // line 138
            echo "                                <option value=\"";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["motivorec"]) ? $context["motivorec"] : $this->getContext($context, "motivorec")), "idmotivo"), "html", null, true);
            echo "\">";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["motivorec"]) ? $context["motivorec"] : $this->getContext($context, "motivorec")), "motivo"), "html", null, true);
            echo "</option>
                            ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['motivorec'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 140
        echo "                        </select>
                    </div>

                    <div class=\"campo\">
                        <label for=\"txtTerceroRealiza\">Tercero que ejecuta:</label>
                        <input type=\"text\" id=\"txtTerceroRealiza\" placeholder=\"Tercero que ejecuta\"/>
                    </div>

                    <div class=\"campo\">
                        <fieldset>
                            <legend>Alto riesgo:</legend>
                            <label style=\"display: inline;\" for=\"rbtnS\">
                                <input name=\"radAltoRiesgo\" type=\"radio\" data-val=\"S\" id=\"rbtnS\"/>Sí
                            </label>
                            <label style=\"display: inline;\" for=\"rbtnN\">
                                <input id=\"rbtnN\" name=\"radAltoRiesgo\" type=\"radio\" data-val=\"N\"/>No 
                            </label>
                        </fieldset>
                    </div>
                    <div class=\"campo\">
                        <fieldset>
                            <legend>Efectiva</legend>
                            <label style=\"display: inline;\" for=\"rbtnSReal\">
                                <input name=\"radRealizado\" type=\"radio\" data-val=\"S\" id=\"rbtnSReal\"/>Sí
                            </label>
                            <label style=\"display: inline;\" for=\"rbtnNReal\">
                                <input name=\"radRealizado\" type=\"radio\" data-val=\"N\" id=\"rbtnNReal\"/>No
                            </label>
                        </fieldset>
                    </div>

                    <div class=\"campo\">
                        <fieldset>
                            <legend>Secuencia de ruta</legend>
                            <div class=\"campo\">
                                <label for=\"txtSecuenciaDesde\">Desde:</label>
                                <input type=\"text\" id=\"txtSecuenciaDesde\" placeholder=\"Desde\"/>
                            </div>
                            <div class=\"campo\">
                                <label for=\"txtSecuenciaHasta\">Hasta:</label>
                                <input type=\"text\" id=\"txtSecuenciaHasta\" placeholder=\"Hasta\"/>
                            </div>
                        </fieldset>
                    </div>

                    <button class=\"btnSimple\" id=\"btnBuscar\">Buscar</button>

                </fieldset>
            </div>        
        </div>
    </div>



    

    <div id=\"tabsOperaciones\">

        <div id=\"divSuspension\" style=\"display: none;\">

            <div class=\"divContenedorColapsable\">
                <div class=\"divColapsable\">
                    <h3 class=\"tituloColapsable\">Valor por defecto para suspensiones</h3>
                    <div class=\"btnColapsable\"><a href=\"\" class=\"fa fa-minus\"></a></div>
                </div>
                <div class=\"contenidoColapsable\">
                    <fieldset>
                        <legend>Valores por defecto para suspensiones</legend>
                        <div id=\"divLlenar\">
                            <div class=\"campo\">
                                <label for=\"txtFechaEjecucionSuspension\">Fecha de Ejecución: <a href=\"#\" data-refer=\"thFechaEjecucion\" title=\"Ver/Ocultar Columna\"><i class=\"fa fa-eye-slash\"></i></a></label>
                                <input type=\"text\" id=\"txtFechaEjecucionSuspension\" placeholder=\"Fecha de Ejecución\" data-column=\"8\" data-refer=\".sspanFechaEjec\"/>
                            </div>
                            <div class=\"campo\">
                                <label for=\"cmbNovedadSuspension\">Novedad: <a href=\"#\" data-refer=\"thNovedad\" title=\"Ver/Ocultar Columna\"><i class=\"fa fa-eye-slash\"></i></a></label>
                                <select id=\"cmbNovedadSuspension\" data-column=\"11\" data-refer=\".sNovedad\">
                                    <option value=\"-1\" >Seleccione una opción</option>
                                    ";
        // line 217
        $context['_parent'] = (array) $context;
        $context['_seq'] = twig_ensure_traversable((isset($context["listanovedadsuspension"]) ? $context["listanovedadsuspension"] : $this->getContext($context, "listanovedadsuspension")));
        foreach ($context['_seq'] as $context["_key"] => $context["novedadsus"]) {
            // line 218
            echo "                                        <option value=\"";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["novedadsus"]) ? $context["novedadsus"] : $this->getContext($context, "novedadsus")), "id"), "html", null, true);
            echo "\">";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["novedadsus"]) ? $context["novedadsus"] : $this->getContext($context, "novedadsus")), "nombre"), "html", null, true);
            echo "</option>
                                    ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['novedadsus'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 220
        echo "                                </select>
                            </div>
                            <div class=\"campo\">
                                <label for=\"txtTerceroSuspension\">Tercero que ejecuta: <a href=\"#\" data-refer=\"thTerceroEjecuta\" title=\"Ver/Ocultar Columna\"><i class=\"fa fa-eye-slash\"></i></a></label>
                                <input type=\"text\" id=\"txtTerceroSuspension\" placeholder=\"Tercero que ejecuta\" data-column=\"13\" data-refer=\".sTercero\"/>
                            </div>
                            <div class=\"campo\">
                                <label for=\"cmbTipoSuspension\">Tipo de suspensión: <a href=\"#\" data-refer=\"thTipoSuspension\" title=\"Ver/Ocultar Columna\"><i class=\"fa fa-eye-slash\"></i></a></label>
                                <select id=\"cmbTipoSuspension\" data-column=\"12\" data-refer=\".sTiposuspension\">
                                    <option value=\"-1\" >Seleccione una opción</option>
                                    ";
        // line 230
        $context['_parent'] = (array) $context;
        $context['_seq'] = twig_ensure_traversable((isset($context["listatiposuspension"]) ? $context["listatiposuspension"] : $this->getContext($context, "listatiposuspension")));
        foreach ($context['_seq'] as $context["_key"] => $context["tiposus"]) {
            // line 231
            echo "                                        <option value=\"";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["tiposus"]) ? $context["tiposus"] : $this->getContext($context, "tiposus")), "idtiposuspension"), "html", null, true);
            echo "\">";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["tiposus"]) ? $context["tiposus"] : $this->getContext($context, "tiposus")), "tiposuspension"), "html", null, true);
            echo "</option>
                                    ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['tiposus'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 233
        echo "                                </select>
                            </div>
                            <div class=\"campo\">
                                <label>Efectiva: <a href=\"#\" data-refer=\"thRealizada\" title=\"Ver/Ocultar Columna\"><i class=\"fa fa-eye-slash\"></i></a></label>
                                    <label style=\"display: inline;\" for=\"rbtnSSuspension\">
                                        <input type=\"radio\" name=\"radSusRealizado\" data-column=\"14\" data-refer=\".sRealizada\" data-val=\"S\" id=\"rbtnSSuspension\"/>Sí
                                    </label>
                                    <label style=\"display: inline; margin-left: 50px;\" for=\"rbtnNSuspension\">
                                        <input type=\"radio\" name=\"radSusRealizado\" data-column=\"14\" data-refer=\".sRealizada\" data-val=\"N\" id=\"rbtnNSuspension\"/>No
                                    </label>
                                    <button class=\"btnSimple btnLimpiarRealizado\" style=\"margin-left: 20px;\">Limpiar campo</button>
                            </div>
                            <div class=\"campo\">
                                <label for=\"txtObservacionSuspension\">Observación: <a href=\"#\" data-refer=\"thObsevaciones\" title=\"Ver/Ocultar Columna\"><i class=\"fa fa-eye-slash\"></i></a></label>
                                <textarea id=\"txtObservacionSuspension\" placeholder=\"Observacion\" style=\"max-height: 25px; min-height: 1px;\"></textarea>
                            </div>
                            <div class=\"btnDerecha\">
                                <button id=\"btnAplicarSuspension\" class=\"btnSimple\">Aplicar a todos</button>
                            </div>
                        </div>
                    </fieldset>
                </div>
            </div>



            <div style=\"position:relative;\">
                <div id=\"divtblSuspension\">
                    <table id=\"tblSuspension\" class=\"tabla\" ></table>
                </div>
                <span id=\"spanGuardars\" class=\"pMensaje\"></span>
                <div class=\"btnDerecha\">
                    <button id=\"btnGuardarSus\" class=\"btnSimple\">Guardar información</button>
                </div>
            </div>
        </div>




        <div id=\"divReconexion\" style=\"display: none;\">

            <div class=\"divContenedorColapsable\">
                <div class=\"divColapsable\">
                    <h3 class=\"tituloColapsable\">Valores por defecto para reconexiones</h3>
                    <div class=\"btnColapsable\"><a href=\"\" class=\"fa fa-minus\"></a></div>
                </div>
                <div class=\"contenidoColapsable\">
                    
                    <div id=\"divLlenar\">
                        <div class=\"campo\">
                            <label for=\"txtFechaEjecucionReconexion\">Fecha de Ejecución: <a href=\"#\" data-refer=\"thFechaEjecucion\" title=\"Ver/Ocultar Columna\"><i class=\"fa fa-eye-slash\"></i></a></label>
                            <input type=\"text\" id=\"txtFechaEjecucionReconexion\" placeholder=\"Fecha de Ejecución\" data-refer=\".rspanFechaEjec\"/>
                        </div>
                        <div class=\"campo\">
                            <label for=\"cmbNovedadReconexion\">Novedad: <a href=\"#\" data-refer=\"thNovedad\" title=\"Ver/Ocultar Columna\"><i class=\"fa fa-eye-slash\"></i></a></label>
                            <select id=\"cmbNovedadReconexion\" data-column=\"11\" data-refer=\".rNovedad\">
                                <option value=\"-1\" >Seleccione una opción</option>
                                ";
        // line 291
        $context['_parent'] = (array) $context;
        $context['_seq'] = twig_ensure_traversable((isset($context["listanovedadreconexion"]) ? $context["listanovedadreconexion"] : $this->getContext($context, "listanovedadreconexion")));
        foreach ($context['_seq'] as $context["_key"] => $context["novedadrec"]) {
            // line 292
            echo "                                    <option value=\"";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["novedadrec"]) ? $context["novedadrec"] : $this->getContext($context, "novedadrec")), "id"), "html", null, true);
            echo "\">";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["novedadrec"]) ? $context["novedadrec"] : $this->getContext($context, "novedadrec")), "nombre"), "html", null, true);
            echo "</option>
                                ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['novedadrec'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 294
        echo "                            </select>
                        </div>
                        <div class=\"campo\">
                            <label for=\"txtTerceroReconexion\">Tercero que ejecuta: <a href=\"#\" data-refer=\"thTerceroEjecuta\" title=\"Ver/Ocultar Columna\"><i class=\"fa fa-eye-slash\"></i></a></label>
                            <input type=\"text\" id=\"txtTerceroReconexion\" data-column=\"12\" data-refer=\".rTercero\" placeholder=\"Tercero que ejecuta\"/>
                        </div>
                        
                        
                        <div class=\"campo\">
                            <label for=\"txtObservacionReconexion\">Observación: <a href=\"#\" data-refer=\"thObsevaciones\" title=\"Ver/Ocultar Columna\"><i class=\"fa fa-eye-slash\"></i></a></label>
                            <textarea id=\"txtObservacionReconexion\" placeholder=\"Observacion\" style=\"max-height: 25px; min-height: 1px;\"></textarea>
                        </div>
                        <div class=\"campo\">
                            <label>Efectiva: <a href=\"#\" data-refer=\"thRealizada\" title=\"Ver/Ocultar Columna\"><i class=\"fa fa-eye-slash\"></i></a></label>
                                <label style=\"display: inline;\" for=\"rbtnSReconexion\">
                                    <input type=\"radio\" name=\"radSusRealizado\" data-val=\"S\" id=\"rbtnSReconexion\"/>Sí
                                </label>
                                <label style=\"display: inline; margin-left: 50px;\" for=\"rbtnNReconexion\">
                                    <input type=\"radio\" name=\"radSusRealizado\" data-val=\"N\" id=\"rbtnNReconexion\"/>No
                                </label>
                                <button class=\"btnSimple btnLimpiarRealizado\" style=\"margin-left: 20px;\">Limpiar campo</button>
                        </div>
                        <div class=\"btnDerecha\">
                            <button id=\"btnAplicarReconexion\" class=\"btnSimple\">Aplicar a todos</button>
                        </div>
                    </div>

                </div>
            </div>

                
            <div id=\"divtblReconexion\">
                <table id=\"tblReconexion\" class=\"tabla\"></table>
            </div>
            <span id=\"spanGuardarr\" class=\"pMensaje\"></span>
            <div class=\"btnDerecha\">
                <button id=\"btnGuardarRec\" class=\"btnSimple\">Guardar información</button>
            </div>
            
        </div>
    </div>

";
    }

    // line 338
    public function block_javascripts($context, array $blocks = array())
    {
        // line 339
        echo "    <script type=\"text/javascript\" src=\"";
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/operaciones/registroRapido/registroRapido.control.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 340
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/operaciones/registroRapido/registroRapido.modelo.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 341
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/operaciones/registroRapido/registroRapido.vista1.js"), "html", null, true);
        echo "\"></script>
";
    }

    public function getTemplateName()
    {
        return "LlanogasLlanogasBundle:Operaciones:registroRapido.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  492 => 341,  488 => 340,  483 => 339,  480 => 338,  434 => 294,  423 => 292,  419 => 291,  359 => 233,  348 => 231,  344 => 230,  332 => 220,  321 => 218,  317 => 217,  238 => 140,  227 => 138,  223 => 137,  217 => 133,  206 => 131,  202 => 130,  184 => 114,  173 => 112,  169 => 111,  132 => 77,  127 => 76,  124 => 74,  116 => 72,  111 => 69,  44 => 5,  40 => 4,  35 => 3,  32 => 2,);
    }
}
