<?php

/* LlanogasLlanogasBundle:Facturacion:importarFacturas.html.twig */
class __TwigTemplate_55537e4dc8a20a6066ae1c3005b12eb7cff2c1fa6f053eef6a20869c97e8a4df extends Twig_Template
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

    // line 3
    public function block_stylesheets($context, array $blocks = array())
    {
        // line 4
        echo "    <link rel=\"stylesheet\" type=\"text/css\" href=\"";
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/theme/jquery.ui.all.css"), "html", null, true);
        echo "\" />
    <link rel=\"stylesheet\" type=\"text/css\" href=\"";
        // line 5
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/liquidaciones/gestionar.estilo.css"), "html", null, true);
        echo "\" />
    <link rel=\"stylesheet\" media=\"print\" type=\"text/css\" href=\"";
        // line 6
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/cartera/estado_cuenta_impresion.css"), "html", null, true);
        echo "\" />
    <link rel=\"stylesheet\" type=\"text/css\" href=\"";
        // line 7
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/archivos.css"), "html", null, true);
        echo "\" />
    <style type=\"text/css\">
        #divCargando {
            min-width: 100px;
            max-width: 300px;
            min-height: 40px;
            background-color: #8AB6D9;
            color: #FFF;
            font-size: 12px;
            margin: 0 auto;
            margin-left: 370px;
            display: inline-block;
            width: 40%;
            position: relative;
            top: 16px;
            border-radius: 20px;
            text-align: center;
            padding-top: 3px;
        }
        #divCargando p{
            margin: 7px 0px 0px 10px;
            display: inline-block;
        }
    </style>
";
    }

    // line 33
    public function block_scripts($context, array $blocks = array())
    {
        // line 34
        echo "
";
    }

    // line 37
    public function block_titulo($context, array $blocks = array())
    {
        echo " Importar facturas- ";
        echo twig_escape_filter($this->env, (isset($context["empresa"]) ? $context["empresa"] : $this->getContext($context, "empresa")), "html", null, true);
        echo "  ";
    }

    // line 39
    public function block_body($context, array $blocks = array())
    {
        // line 40
        echo "
           
            <div id=\"divComandos\">
                <div class=\"divBotones\">
                    <input type=\"button\" value=\"cargar\" id=\"btnCargar\" class=\"btn\" />
                    <input type=\"button\" value=\"cancelar\" id=\"btnCancelar\" class=\"btn\" />
                </div>
            </div>
        

        <div id=\"divPanelContenedor\">
            <fieldset id=\"fieldsetLiquidacion\">
                <legend>Informacion de la Importación</legend>
                ";
        // line 53
        if (((isset($context["opcion"]) ? $context["opcion"] : $this->getContext($context, "opcion")) == 0)) {
            // line 54
            echo "                    <input type=\"hidden\" id=\"txtOperacion\" name=\"operacion\"/>
<div id=\"tabs\" style=\"margin: 10px;\">
                <ul>
                    ";
            // line 57
            $context['_parent'] = (array) $context;
            $context['_seq'] = twig_ensure_traversable((isset($context["tipoimportacion"]) ? $context["tipoimportacion"] : $this->getContext($context, "tipoimportacion")));
            foreach ($context['_seq'] as $context["_key"] => $context["tipo"]) {
                echo " 
                        ";
                // line 58
                if (($this->getAttribute((isset($context["tipo"]) ? $context["tipo"] : $this->getContext($context, "tipo")), "idunidad") == 1123)) {
                    // line 59
                    echo "                            <li><a id=\"aCiclo\" data=\"C\" href=\"#divCiclo\">Masiva por Ciclo</a></li>
                        ";
                } elseif (($this->getAttribute((isset($context["tipo"]) ? $context["tipo"] : $this->getContext($context, "tipo")), "idunidad") == 1125)) {
                    // line 61
                    echo "                            <li><a id=\"aSuscripcion\" data=\"S\" href=\"#divCabecera\">Suscripción</a></li>
                        ";
                }
                // line 63
                echo "                    ";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['_key'], $context['tipo'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 64
            echo "                </ul>
        ";
            // line 65
            $context['_parent'] = (array) $context;
            $context['_seq'] = twig_ensure_traversable((isset($context["tipoimportacion"]) ? $context["tipoimportacion"] : $this->getContext($context, "tipoimportacion")));
            foreach ($context['_seq'] as $context["_key"] => $context["tipo"]) {
                echo " 
                ";
                // line 66
                if (($this->getAttribute((isset($context["tipo"]) ? $context["tipo"] : $this->getContext($context, "tipo")), "idunidad") == 1123)) {
                    // line 67
                    echo "                    <div id=\"divCiclo\">
                       <div class=\"campoMitad\" id=\"divComboCiclo\" >
                                       <label>Ciclo: </label>
                                       <select id=\"cboCiclo\"  name=\"cboCiclo\">
                                           <option value=\"-1\"> Seleccione una opción</option>
                                           ";
                    // line 72
                    $context['_parent'] = (array) $context;
                    $context['_seq'] = twig_ensure_traversable((isset($context["ciclos"]) ? $context["ciclos"] : $this->getContext($context, "ciclos")));
                    foreach ($context['_seq'] as $context["_key"] => $context["ciclo"]) {
                        // line 73
                        echo "                                               <option value=\"";
                        echo twig_escape_filter($this->env, $this->getAttribute((isset($context["ciclo"]) ? $context["ciclo"] : $this->getContext($context, "ciclo")), "idciclo"), "html", null, true);
                        echo "\">";
                        echo twig_escape_filter($this->env, $this->getAttribute((isset($context["ciclo"]) ? $context["ciclo"] : $this->getContext($context, "ciclo")), "ciclo"), "html", null, true);
                        echo "</option>
                                           ";
                    }
                    $_parent = $context['_parent'];
                    unset($context['_seq'], $context['_iterated'], $context['_key'], $context['ciclo'], $context['_parent'], $context['loop']);
                    $context = array_intersect_key($context, $_parent) + $_parent;
                    // line 75
                    echo "                                       </select>
                       </div>                                                   
                                       
                   </div>
        ";
                }
                // line 80
                echo "                    ";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['_key'], $context['tipo'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 81
            $context['_parent'] = (array) $context;
            $context['_seq'] = twig_ensure_traversable((isset($context["tipoimportacion"]) ? $context["tipoimportacion"] : $this->getContext($context, "tipoimportacion")));
            foreach ($context['_seq'] as $context["_key"] => $context["tipo"]) {
                echo " 
                ";
                // line 82
                if (($this->getAttribute((isset($context["tipo"]) ? $context["tipo"] : $this->getContext($context, "tipo")), "idunidad") == 1125)) {
                    // line 83
                    echo "                        <div id=\"divCabecera\">

                        </div>
                ";
                }
                // line 87
                echo "                    ";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['_key'], $context['tipo'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 88
            echo "                     <div id=\"divArchivo\" class=\"campo\">
                                   <input type=\"file\" multiple id=\"txtArchivo\" accept=\".xml\" name=\"txtArchivo\"/>
                               </div>
        <div id=\"divConfirmaEliminar\" style=\"display: none;\">
             <p>Se eliminaran las facturas del ciclo seleccionado</p>
        </div>  
</div>
                   
                ";
        } elseif (($this->getAttribute((isset($context["respuesta"]) ? $context["respuesta"] : $this->getContext($context, "respuesta")), "codigoRespuesta") == (-3))) {
            // line 97
            echo "
                    <table class=\"tabla\">
                        <caption> Listado de errores </caption>
                        <thead>
                            <tr>
                                <th>Línea</th>
                                <th>Código Anterior</th>
                            </tr>
                        </thead>
                        <tbody>
                            ";
            // line 107
            $context['_parent'] = (array) $context;
            $context['_seq'] = twig_ensure_traversable($this->getAttribute((isset($context["respuesta"]) ? $context["respuesta"] : $this->getContext($context, "respuesta")), "errorlineas"));
            foreach ($context['_seq'] as $context["_key"] => $context["error"]) {
                // line 108
                echo "                                <tr>
                                    <td>";
                // line 109
                echo twig_escape_filter($this->env, $this->getAttribute((isset($context["error"]) ? $context["error"] : $this->getContext($context, "error")), "linea"), "html", null, true);
                echo "</td>
                                    <td>";
                // line 110
                echo twig_escape_filter($this->env, $this->getAttribute((isset($context["error"]) ? $context["error"] : $this->getContext($context, "error")), "codigoanterior"), "html", null, true);
                echo "</td>
                                </tr>
                            ";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['_key'], $context['error'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 113
            echo "                        </tbody>
                    </table>  
                    <h4>
                        ";
            // line 116
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["respuesta"]) ? $context["respuesta"] : $this->getContext($context, "respuesta")), "mensaje"), "html", null, true);
            echo "
                    </h4>
                    <div>
                        <a href=\"./\">Regresar</a>      
                    </div>
                ";
        } elseif (($this->getAttribute((isset($context["respuesta"]) ? $context["respuesta"] : $this->getContext($context, "respuesta")), "codigoRespuesta") == (-1))) {
            // line 122
            echo "                    <h2 style=\"color:#F90;font-weight: bold;\">
                        ";
            // line 123
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["respuesta"]) ? $context["respuesta"] : $this->getContext($context, "respuesta")), "mensaje"), "html", null, true);
            echo "
                    </h2>
                    <div>
                        <a href=\"./\">Regresar</a>      
                    </div> 
                ";
        } elseif (($this->getAttribute((isset($context["respuesta"]) ? $context["respuesta"] : $this->getContext($context, "respuesta")), "codigoRespuesta") == 1)) {
            // line 129
            echo "                    <h2 style=\"color:#F90; font-weight: bold;\"> ";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["respuesta"]) ? $context["respuesta"] : $this->getContext($context, "respuesta")), "mensaje"), "html", null, true);
            echo " </h2>
                    <span data=\"1\" id=\"spanCodigo\"></span>
                    <p>
                        <strong>Facturas procesadas: </strong> ";
            // line 132
            echo twig_escape_filter($this->env, $this->getAttribute($this->getAttribute((isset($context["respuesta"]) ? $context["respuesta"] : $this->getContext($context, "respuesta")), "datos"), "facturascargadas"), "html", null, true);
            echo "<br>
                        <strong>Total Facturación Cargada: </strong> ";
            // line 133
            echo twig_escape_filter($this->env, (isset($context["totalfacturado"]) ? $context["totalfacturado"] : $this->getContext($context, "totalfacturado")), "html", null, true);
            echo "<br>
                        <strong>Facturas con problemas: </strong> ";
            // line 134
            echo twig_escape_filter($this->env, twig_length_filter($this->env, $this->getAttribute($this->getAttribute((isset($context["respuesta"]) ? $context["respuesta"] : $this->getContext($context, "respuesta")), "datos"), "facturasnocargadas")), "html", null, true);
            echo "
                    </p>
                    <div>
                        ";
            // line 137
            if ((twig_length_filter($this->env, $this->getAttribute($this->getAttribute((isset($context["respuesta"]) ? $context["respuesta"] : $this->getContext($context, "respuesta")), "datos"), "facturasnocargadas")) > 0)) {
                // line 138
                echo "                            
                            <table class=\"tabla\" style=\"margin: 15px;\" id=\"tblResultado\">
                                <thead>
                                    <tr>
                                        <th colspan=\"3\">Suscripciones que no se pudieron cargar</th>
                                    </tr>
                                    <tr>
                                    <th>Suscripción Gas</th><th>Suscripción ";
                // line 145
                echo twig_escape_filter($this->env, (isset($context["empresa"]) ? $context["empresa"] : $this->getContext($context, "empresa")), "html", null, true);
                echo "</th><th>Mensaje</th>
                                    </tr>
                                </thead>
                                <tbody>
                                   
                                    ";
                // line 150
                $context['_parent'] = (array) $context;
                $context['_seq'] = twig_ensure_traversable($this->getAttribute($this->getAttribute((isset($context["respuesta"]) ? $context["respuesta"] : $this->getContext($context, "respuesta")), "datos"), "facturasnocargadas"));
                foreach ($context['_seq'] as $context["_key"] => $context["factura"]) {
                    // line 151
                    echo "                                    <tr>
                                        <td> ";
                    // line 152
                    echo twig_escape_filter($this->env, $this->getAttribute((isset($context["factura"]) ? $context["factura"] : $this->getContext($context, "factura")), "suscripcion"), "html", null, true);
                    echo " </td><td>";
                    echo twig_escape_filter($this->env, $this->getAttribute((isset($context["factura"]) ? $context["factura"] : $this->getContext($context, "factura")), "codigo"), "html", null, true);
                    echo "</td><td> ";
                    echo twig_escape_filter($this->env, $this->getAttribute((isset($context["factura"]) ? $context["factura"] : $this->getContext($context, "factura")), "mensaje"), "html", null, true);
                    echo " </td>
                                    </tr>
                                    ";
                }
                $_parent = $context['_parent'];
                unset($context['_seq'], $context['_iterated'], $context['_key'], $context['factura'], $context['_parent'], $context['loop']);
                $context = array_intersect_key($context, $_parent) + $_parent;
                // line 155
                echo "                                </tbody>
                            </table> 

                            <button id=\"btnImprimir\" class=\"btnSimple\"> Imprimir </button>
                        ";
            }
            // line 160
            echo "                    </div>
                    <div>
                        <a href=\"./\">Regresar</a>      
                    </div> 
                ";
        }
        // line 164
        echo "  
            <div>
                <div style=\"width: 50%; display: inline-block; margin-top: 10px;\">
                    <table id=\"tblResumen\" class=\"tabla\"></table>
                </div>
                <div style=\"width: 49%; display: inline-block; margin-top: 10px;\">
                    <table id=\"tblResumenConProblemas\" class=\"tabla\"></table>
                </div>
               
            </div>
            </fieldset>
        </div>
             
    <fieldset id=\"divInfoProceso\" style=\"display:none\">
        <legend> Proceso importar Facturas</legend>
        <div id=\"divCargando\"> 
            <img src=\"/achagua/sistema/web/bundles/Llanogas/img/cargando2.gif\">
            <p>Se está ejecutando el proceso, <br>esto puede tardar unos minutos...</p>                
        </div>
        <table id=\"tblProceso\" class=\"tabla\" style=\"width: 70%; display: inline-table; margin: 20px 20px;\"></table>
    </fieldset>

    <div id=\"divConfirmarCancelar\" style=\"display: none;\">
        <p>Se cancelará la operación actual ¿Desea continuar?</p>
    </div>
";
    }

    // line 190
    public function block_javascripts($context, array $blocks = array())
    {
        // line 191
        echo "    <script type=\"text/javascript\" src=\"";
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/facturacion/importarFacturas/importarFacturas.model.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 192
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/facturacion/importarFacturas/importarFacturas.control.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 193
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/facturacion/importarFacturas/importarFacturas.vista.js"), "html", null, true);
        echo "\"></script>
";
    }

    public function getTemplateName()
    {
        return "LlanogasLlanogasBundle:Facturacion:importarFacturas.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  390 => 193,  386 => 192,  381 => 191,  378 => 190,  349 => 164,  342 => 160,  335 => 155,  322 => 152,  319 => 151,  315 => 150,  307 => 145,  298 => 138,  296 => 137,  290 => 134,  286 => 133,  282 => 132,  275 => 129,  266 => 123,  263 => 122,  254 => 116,  249 => 113,  240 => 110,  236 => 109,  233 => 108,  229 => 107,  217 => 97,  206 => 88,  200 => 87,  194 => 83,  192 => 82,  186 => 81,  180 => 80,  173 => 75,  162 => 73,  158 => 72,  151 => 67,  149 => 66,  143 => 65,  140 => 64,  134 => 63,  130 => 61,  126 => 59,  124 => 58,  118 => 57,  113 => 54,  111 => 53,  96 => 40,  93 => 39,  85 => 37,  80 => 34,  77 => 33,  48 => 7,  44 => 6,  40 => 5,  35 => 4,  32 => 3,);
    }
}
