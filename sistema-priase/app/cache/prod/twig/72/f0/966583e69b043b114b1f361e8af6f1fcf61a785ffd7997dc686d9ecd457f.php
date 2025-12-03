<?php

/* ReportesBundle:Cartera:arqueoCaja.html.twig */
class __TwigTemplate_72f0966583e69b043b114b1f361e8af6f1fcf61a785ffd7997dc686d9ecd457f extends Twig_Template
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
        echo "Reporte de arqueo de caja - ";
        echo twig_escape_filter($this->env, (isset($context["empresa"]) ? $context["empresa"] : $this->getContext($context, "empresa")), "html", null, true);
        echo "  ";
    }

    // line 9
    public function block_body($context, array $blocks = array())
    {
        // line 10
        echo "    <div style=\"display: none\" id=\"module\" ng-app=\"myApp\" ng-controller=\"ArqueoController\">
        <form name=\"reporte\" id=\"reporte\" method=\"post\" novalidate>
            <fieldset>
                <legend>Parametros del reporte</legend>
                <div class=\"col-md-12\">
                    <div class=\"panel panel-default\">
                        <div class=\"panel-heading\">
                            <h3> Ingrese los datos necesarios para la generacion del formato de arqueo de caja.</h3>
                        </div>
                        <div class=\"panel-body\">
                            <div class=\"row\">
                                <div class=\"col-md-6 form-group\" show-errors>
                                    <label for=\"fechaConsulta\">Fecha Consulta</label>
                                    <input class=\"form-control datepicker input-sm\" ng-model=\"info.fechaConsulta\" id=\"fechaConsulta\" name=\"fechaConsulta\" required=\"true\" />
                                    <p class=\"help-block\" ng-if=\"reporte.fechaConsulta.\$error.required\" >
                                        La fecha de consulta es requerida
                                    </p>
                                </div>
                                <div class=\"col-md-6 form-group \" show-errors>
                                    <label for=\"codigoProyecto\">Proyecto</label>
                                    <select class=\"form-control input-sm\" ng-model=\"info.codigoProyecto\" id=\"codigoProyecto\" required=\"required\" name=\"codigoProyecto\">
                                        <option value=\"\" disabled selected>Seleccione Proyecto</option>
                                        ";
        // line 32
        $context['_parent'] = (array) $context;
        $context['_seq'] = twig_ensure_traversable((isset($context["municipios"]) ? $context["municipios"] : $this->getContext($context, "municipios")));
        foreach ($context['_seq'] as $context["_key"] => $context["municipio"]) {
            // line 33
            echo "                                            <option value=\"";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["municipio"]) ? $context["municipio"] : $this->getContext($context, "municipio")), "idmunicipio"), "html", null, true);
            echo "\" data-proyecto=\"";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["municipio"]) ? $context["municipio"] : $this->getContext($context, "municipio")), "municipio"), "html", null, true);
            echo "\">";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["municipio"]) ? $context["municipio"] : $this->getContext($context, "municipio")), "municipio"), "html", null, true);
            echo "</option>
                                        ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['municipio'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 34
        echo "                        
                                    </select>
                                    <p class=\"help-block\" ng-if=\"reporte.codigoProyecto.\$error.required\" >
                                        El proyecto es requerido
                                    </p>
                                </div>
                            </div>
                            <div class=\"row\">
                                <div class=\"col-md-6 form-group\" show-errors >
                                    <label for=\"medioPago\">Medio Pago</label>
                                    <select class=\"form-control input-sm\" ng-model=\"info.medioPago\" ng-change=\"updateCajeros()\" id=\"medioPago\" required=\"required\" name=\"medioPago\">
                                        <option value=\"\" disabled selected>Seleccione medio de pago</option>
                                        <option ng-repeat=\"medioPago in mediosPago\" ng-value=\"medioPago.id\">{[{medioPago.nombre}]}</option>
                                    </select>
                                    <p class=\"help-block\" ng-if=\"reporte.medioPago.\$error.required\" >
                                        El medio de pago es requerido
                                    </p>
                                </div>
                                <div class=\"col-md-6 form-group\" show-errors >
                                    <label for=\"idcajero\">Cajero</label>
                                    <select class=\"form-control input-sm\" ng-model=\"info.idcajero\" id=\"idcajero\" name=\"idcajero\">
                                        <option value=\"\" disabled selected>Seleccione cajero</option>
                                        <option ng-repeat=\"cajero in cajeros2\" data-cargo = \"{[{cajero.cajero_cargo}]}\" ng-value=\"cajero.cajero_id\">{[{cajero.cajero_nombre}]}</option>
                                    </select>
                                    
                                </div>    
                            </div>
                        </div>
                        <div class=\"panel-footer\">    
                            <div class=\"col-md-9\">
                                <div class=\"alert-box info\">
                                        El reporte por cajero solo tomara los recaudos del cajero seleccionado y generara el reporte para ese cajero,
                                        el consolidado tomara los recaudos de todos los cajeros y generara el reporte a nombre del cajero seleccionado.
                                    </ul>
                                </div>  
                            </div>
                            <div class=\"col-md-3\">
                                <div class=\"btn-group\">
                                    <button type=\"button\" class=\"btn btn-primary btn-sm pull-right\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">
                                        <i class=\"fa fa-gears fa-lg\"></i> Generar el reporte <span class=\"caret\"></span>
                                    </button>
                                    <ul class=\"dropdown-menu\">
                                        <li>
                                            <a ng-click=\"info.consolidado=false;generarReporte()\">
                                                <i class=\"fa fa-file-pdf-o fa-lg\"></i> Por cajero
                                            </a>
                                        </li>
                                        <li>
                                            <a ng-click=\"info.consolidado=true;generarReporte2()\">
                                                <i class=\"fa fa-file-excel-o fa-lg\"></i> Consolidado
                                            </a>
                                        </li>

                                    </ul>
                                </div>                                
                            </div>               
                            <div class=\"clearfix\"></div>
                        </div>
                    </div>
                </div>                
            </fieldset>
        </form>
    </div>
";
    }

    // line 99
    public function block_javascripts($context, array $blocks = array())
    {
        // line 100
        echo "    <script type=\"text/javascript\" src=\"";
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/main/angular.min.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 101
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/main/showErrors.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 102
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/main/bootstrap.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 103
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/main/main.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 104
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/cartera/arqueo.control.angular.js"), "html", null, true);
        echo "\"></script>
";
    }

    public function getTemplateName()
    {
        return "ReportesBundle:Cartera:arqueoCaja.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  188 => 104,  184 => 103,  180 => 102,  176 => 101,  171 => 100,  168 => 99,  101 => 34,  88 => 33,  84 => 32,  60 => 10,  57 => 9,  49 => 7,  43 => 5,  39 => 4,  34 => 3,  31 => 2,);
    }
}
