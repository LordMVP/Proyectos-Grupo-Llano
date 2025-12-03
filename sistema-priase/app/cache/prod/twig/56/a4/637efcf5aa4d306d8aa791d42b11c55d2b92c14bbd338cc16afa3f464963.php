<?php

/* ReportesBundle:Facturacion:recaudoAce.html.twig */
class __TwigTemplate_56a4637efcf5aa4d306d8aa791d42b11c55d2b92c14bbd338cc16afa3f464963 extends Twig_Template
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
        echo "Reporte - Recaudos Ace Seguros ";
        echo twig_escape_filter($this->env, (isset($context["empresa"]) ? $context["empresa"] : $this->getContext($context, "empresa")), "html", null, true);
        echo " ";
    }

    // line 8
    public function block_body($context, array $blocks = array())
    {
        // line 9
        echo "    <div ng-app=\"myApp\" ng-controller=\"recaudoAceController\">
        <form name=\"reporte\" id=\"reporte\" method=\"post\" novalidate>
            <fieldset>
                <legend>Filtro de búsqueda</legend>
                <div class=\"col-md-12\">
                    <div class=\"panel panel-default\">
                        <div class=\"panel-body\">
                            <div class=\"form-group col-md-4\" show-errors>
                                <label>Años</label>
                                <select required=\"true\" id=\"cmbAnos\" name=\"anos\" ng-model=\"info.anos\" class=\"form-control\" ng-change=\"cargarPeriodosAnoAce()\">
                                    <option ng-repeat=\"ano in anos\" ng-value=\"ano.anos\">
                                        {[{ano.anos}]}
                                    </option>
                                </select>
                                <p class=\"help-block\" ng-if=\"reporte.anos.\$error.required\">
                                    El año es requerido.
                                </p>
                            </div>   
                            <div class=\"form-group col-md-4\" show-errors>
                                <label>Periodo</label>
                                <select id=\"cmbPeriodo\" required=\"true\" name=\"periodo\" ng-model=\"info.periodo\" class=\"form-control\">
                                    <option ng-repeat=\"periodo in periodos\" ng-value=\"periodo.idorden\">{[{periodo.nombre}]}</option>
                                    <!--option ng-repeat=\"periodo in periodos\" ng-value=\"periodo.idorden\">
                                        {[{periodo.nombre}]}
                                    </option-->
                                </select>    
                                <p class=\"help-block\" ng-if=\"reporte.periodo.\$error.required\">
                                    El periodo es requerido.
                                </p>
                            </div>                                                                        
                        </div>
                        <div class=\"panel-footer\">    
                            <div class=\"col-md-9\">
                                <div class=\"alert-box info\">
                                    Seleccione los filtros de consulta y de clic sobre el botón <b>Generar reporte</b>
                                </div>  
                            </div>
                            <div class=\"col-md-3\">
                                <button type=\"button\" ng-click=\"generarReporte()\" class=\"btn btn-primary btn-sm pull-right\">
                                    <i class=\"fa fa-gears fa-lg\"></i> Generar reporte
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

    // line 60
    public function block_javascripts($context, array $blocks = array())
    {
        echo "     
    <script type=\"text/javascript\" src=\"";
        // line 61
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/main/angular.min.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 62
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/main/showErrors.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 63
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/main/main.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 64
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/facturacion/recaudoAce.angular.js"), "html", null, true);
        echo "\"></script>
";
    }

    public function getTemplateName()
    {
        return "ReportesBundle:Facturacion:recaudoAce.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  131 => 64,  127 => 63,  123 => 62,  119 => 61,  114 => 60,  60 => 9,  57 => 8,  49 => 7,  43 => 5,  39 => 4,  34 => 3,  31 => 2,);
    }
}
