<?php

/* ReportesBundle:Ventas:cambioTercero.html.twig */
class __TwigTemplate_2cac3448a4753be45d8ea9e47a80a6d6be0186a9fc8d6fe695a54e0145b410a9 extends Twig_Template
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
        echo "Reporte Cambio Tercero -";
        echo twig_escape_filter($this->env, (isset($context["empresa"]) ? $context["empresa"] : $this->getContext($context, "empresa")), "html", null, true);
        echo " ";
    }

    // line 9
    public function block_body($context, array $blocks = array())
    {
        // line 10
        echo "    <div style=\"display: none\" id=\"module\" ng-app=\"myApp\" ng-controller=\"CambioTerceroController\">
        <form name=\"reporte\" id=\"reporte\" method=\"post\" novalidate>
            <fieldset>
                <legend>Parametros del reporte</legend>
                <div class=\"col-md-12\">
                    <div class=\"panel panel-default\">
                        <div class=\"panel-body\">
                            <div class=\"row\">
                                <div class=\"col-md-4 form-group\" show-errors>
                                    <label for=\"fechaConsulta1\">Fecha Inicial Consulta (yyyy-mm-dd):</label>
                                    <input class=\"form-control datepicker input-sm\" ng-model=\"info.fechaConsulta1\" id=\"fechaConsulta1\" name=\"fechaConsulta1\" required=\"true\" />
                                    <p class=\"help-block\" ng-if=\"reporte.fechaConsulta1.\$error.required\" >
                                        La fecha inicial de consulta es requerida
                                    </p>
                                </div>
                                 <div class=\"col-md-4 form-group\" show-errors>
                                    <label for=\"fechaConsulta2\">Fecha Final Consulta (yyyy-mm-dd):</label>
                                    <input class=\"form-control datepicker input-sm\" ng-model=\"info.fechaConsulta2\" id=\"fechaConsulta2\" name=\"fechaConsulta2\" required=\"true\" />
                                    <p class=\"help-block\" ng-if=\"reporte.fechaConsulta2.\$error.required\" >
                                        La fecha final de consulta es requerida
                                    </p>
                                </div>  
                            </div>
                           
                                                             
                           
                        </div>
                        <div class=\"panel-footer\">    
                            <div class=\"col-md-9\">
                                <div class=\"alert-box info\">
                                    Al ingresar y validar todos los parametros necesarios y correctos, de clic en el boton Generar Reporte.
                                </div>  
                            </div>
                            <div class=\"col-md-3\">
                                <button type=\"button\" ng-click=\"generarReporte()\" class=\"btn btn-primary btn-sm pull-right\">
                                    <i class=\"fa fa-gears fa-lg\"></i> Generar el reporte
                                </button>
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

    // line 57
    public function block_javascripts($context, array $blocks = array())
    {
        // line 58
        echo "    <script type=\"text/javascript\" src=\"";
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/main/angular.min.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 59
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/main/showErrors.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 60
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/main/bootstrap.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 61
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/main/main.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 62
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/ventas/cambio.tercero.angular.js"), "html", null, true);
        echo "\"></script>
";
    }

    public function getTemplateName()
    {
        return "ReportesBundle:Ventas:cambioTercero.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  129 => 62,  125 => 61,  121 => 60,  117 => 59,  112 => 58,  109 => 57,  60 => 10,  57 => 9,  49 => 7,  43 => 5,  39 => 4,  34 => 3,  31 => 2,);
    }
}
