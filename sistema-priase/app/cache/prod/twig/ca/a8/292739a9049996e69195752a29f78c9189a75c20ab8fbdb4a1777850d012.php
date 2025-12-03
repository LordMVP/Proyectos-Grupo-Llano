<?php

/* ReportesBundle:Financiaciones:financiacionConcepto.html.twig */
class __TwigTemplate_caa8292739a9049996e69195752a29f78c9189a75c20ab8fbdb4a1777850d012 extends Twig_Template
{
    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        $this->parent = $this->env->loadTemplate("::base.html.twig");

        $this->blocks = array(
            'stylesheets' => array($this, 'block_stylesheets'),
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
    <link rel=\"stylesheet\" type=\"text/css\" href=\"";
        // line 4
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/css/main/main.css"), "html", null, true);
        echo "\" />
    <link rel=\"stylesheet\" type=\"text/css\" href=\"";
        // line 5
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/css/main/bootstrap.css"), "html", null, true);
        echo "\" />
";
    }

    // line 7
    public function block_titulo($context, array $blocks = array())
    {
        echo "Reporte financiacion por conceptos -";
        echo twig_escape_filter($this->env, (isset($context["empresa"]) ? $context["empresa"] : $this->getContext($context, "empresa")), "html", null, true);
        echo " ";
    }

    // line 9
    public function block_body($context, array $blocks = array())
    {
        // line 10
        echo "    <div style=\"display: none\" id=\"module\" ng-app=\"myApp\" ng-controller=\"FinanciacionController\">
        <form name=\"reporte\" id=\"reporte\" method=\"post\" novalidate>
            <fieldset>
                <legend>Reporte financiacion por conceptos</legend>
                <div class=\"col-md-12\">
                    <div class=\"panel panel-default\">
                        <div class=\"panel-body\">
                            <div class=\"row\">
                                <div class=\"col-md-3 form-group\" show-errors>
                                    <label for=\"fechaConsulta1\">Fecha de Corte (yyyy-mm-dd):</label>
                                    <input class=\"form-control datepicker input-sm\" ng-model=\"info.fechaCorte\" id=\"fechaCorte\" required=\"required\" name=\"fechaCorte\" />
                                </div>
                                <div class=\"col-md-3 form-group \" show-errors>
                                    <label for=\"codigoProyecto\">Proyecto</label>
                                    <select ng-disabled=\"filtrosEspeciales==1\" class=\"form-control input-sm\" ng-model=\"info.codigoProyecto\" id=\"codigoProyecto\" required=\"required\" name=\"codigoProyecto\">
                                        <option value=\"-1\">Todos los proyectos</option>
                                        ";
        // line 26
        $context['_parent'] = (array) $context;
        $context['_seq'] = twig_ensure_traversable((isset($context["municipios"]) ? $context["municipios"] : $this->getContext($context, "municipios")));
        foreach ($context['_seq'] as $context["_key"] => $context["municipio"]) {
            // line 27
            echo "                                            <option value=\"";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["municipio"]) ? $context["municipio"] : $this->getContext($context, "municipio")), "idmunicipio"), "html", null, true);
            echo "\">";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["municipio"]) ? $context["municipio"] : $this->getContext($context, "municipio")), "municipio"), "html", null, true);
            echo "</option>
                                        ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['municipio'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 28
        echo "                        
                                    </select>
                                    <p class=\"help-block\" ng-if=\"reporte.codigoProyecto.\$error.required\" >
                                        El proyecto es requerido
                                    </p>
                                </div>                                    
                                <div class=\"form-group col-md-3\" show-errors>
                                    <label>Tipo de uso</label>
                                    <select ng-disabled=\"filtrosEspeciales==1\" ng-model=\"info.tipoUso\" name=\"tipoUso\" required=\"false\" class=\"form-control input-sm\" placeholder=\"Seleccione el tipo de uso\">
                                        <option value=\"-1\" selected=\"true\">Todos los tipos de uso</option>
                                        ";
        // line 38
        $context['_parent'] = (array) $context;
        $context['_seq'] = twig_ensure_traversable((isset($context["tiposUso"]) ? $context["tiposUso"] : $this->getContext($context, "tiposUso")));
        foreach ($context['_seq'] as $context["_key"] => $context["tipoUso"]) {
            // line 39
            echo "                                            <option value=\"";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["tipoUso"]) ? $context["tipoUso"] : $this->getContext($context, "tipoUso")), "tipo_uso_id"), "html", null, true);
            echo "\">";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["tipoUso"]) ? $context["tipoUso"] : $this->getContext($context, "tipoUso")), "tipo_uso_nombre"), "html", null, true);
            echo "</option>
                                        ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['tipoUso'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 41
        echo "                                    </select>
                                    <p class=\"help-block\" ng-if=\"reporte.tipoUso.\$error.required\">
                                        El tipo de uso es requerido
                                    </p>
                                </div>
                                <div class=\"form-group col-md-3\" show-errors>
                                    <label>Ciclo</label>
                                    <select ng-disabled=\"filtrosEspeciales==1\" ng-model=\"info.ciclo\" name=\"ciclo\" required=\"false\" class=\"form-control input-sm\" placeholder=\"Seleccione el ciclo\">
                                        <option value=\"-1\" selected=\"true\">Todos los ciclos</option>
                                        ";
        // line 50
        $context['_parent'] = (array) $context;
        $context['_seq'] = twig_ensure_traversable((isset($context["ciclos"]) ? $context["ciclos"] : $this->getContext($context, "ciclos")));
        foreach ($context['_seq'] as $context["_key"] => $context["ciclo"]) {
            // line 51
            echo "                                            <option value=\"";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["ciclo"]) ? $context["ciclo"] : $this->getContext($context, "ciclo")), "idciclo"), "html", null, true);
            echo "\">";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["ciclo"]) ? $context["ciclo"] : $this->getContext($context, "ciclo")), "ciclo"), "html", null, true);
            echo "</option>
                                        ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['ciclo'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 53
        echo "                                    </select>
                                    <p class=\"help-block\" ng-if=\"reporte.ciclo.\$error.required\">
                                        El ciclo es requerido
                                    </p>
                                </div>    
                                    
                            </div>
                            <hr/>                            
                            <div class=\"row\">
                                <div class=\"col-md-2 form-group\">
                                    <label>Filtros especiales</label>
                                    <select ng-model=\"filtrosEspeciales\" class=\"form-control input-sm\">
                                        <option value='0'>NO</option>
                                        <option value='1'>SI</option>                                            
                                    </select>                                    
                                </div>
                                <div class=\"col-md-5 form-group \" show-errors>
                                    <label for=\"suscripcion\">Id de suscripcion (no obligatorio)</label>
                                    <input ng-disabled=\"filtrosEspeciales==0\" type=\"number\" id=\"suscripcion\" ng-model=\"info.suscripcion\" name=\"suscripcion\" class=\"form-control\"/>
                                </div>
                                <div class=\"col-md-5 form-group \" show-errors>
                                    <label for=\"suscripcion\">Numero de financiacion (no obligatorio)</label>
                                    <input ng-disabled=\"filtrosEspeciales==0\" type=\"number\" id=\"financiacion\" ng-model=\"info.financiacion\" name=\"financiacion\" class=\"form-control\"/>
                                </div>
                            </div>
                        </div>
                        <div class=\"panel-footer\">    
                            <div class=\"row\">
                                <div class=\"col-md-12\">
                                    <div class=\"alert-box info\">
                                        El id de la suscripcion no es obligatorio, se debe ingresar solo si se quiere filtrar por una suscripcion especifica.
                                        <br/>
                                    </div>  
                                </div>
                            </div>
                            <hr/>
                            <div class=\"row\">
                                <div class=\"col-md-4 col-md-offset-2\">
                                    <button type=\"button\" class=\"btn btn-primary btn-sm\" ng-click=\"generarReporte(1)\">
                                        <i class=\"fa fa-file-excel-o fa-lg\"></i> Reporte Detallado
                                    </button>
                                </div>
                                <div class=\"col-md-4\">
                                    <button type=\"button\" class=\"btn btn-primary btn-sm\" ng-click=\"generarReporte(2)\">
                                        <i class=\"fa fa-file-pdf-o fa-lg\"></i> Reporte Consolidado
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>                
            </fieldset>
        </form>
    </div>
";
    }

    // line 109
    public function block_javascripts($context, array $blocks = array())
    {
        // line 110
        echo "    <script type=\"text/javascript\" src=\"";
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/main/angular.min.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 111
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/main/showErrors.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 112
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/main/bootstrap.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 113
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/main/main.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 114
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/cartera/financiacion.concepto.angular.js"), "html", null, true);
        echo "\"></script>
";
    }

    public function getTemplateName()
    {
        return "ReportesBundle:Financiaciones:financiacionConcepto.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  224 => 114,  220 => 113,  216 => 112,  212 => 111,  207 => 110,  204 => 109,  146 => 53,  135 => 51,  131 => 50,  120 => 41,  109 => 39,  105 => 38,  93 => 28,  82 => 27,  78 => 26,  60 => 10,  57 => 9,  49 => 7,  43 => 5,  39 => 4,  34 => 3,  31 => 2,);
    }
}
