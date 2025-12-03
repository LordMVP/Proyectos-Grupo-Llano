<?php

/* ReportesBundle:Recaudo:consignacionRecaudo.html.twig */
class __TwigTemplate_e66442d6301935fbc7caeb44b5c2cfd39f777b5c68cd2c8984b0019737d857c2 extends Twig_Template
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
        echo "Reporte Consignacion Recaudo -";
        echo twig_escape_filter($this->env, (isset($context["empresa"]) ? $context["empresa"] : $this->getContext($context, "empresa")), "html", null, true);
        echo " ";
    }

    // line 9
    public function block_body($context, array $blocks = array())
    {
        // line 10
        echo "    <div style=\"display: none\" id=\"module\" ng-app=\"myApp\" ng-controller=\"ConsignacionRecaudoController\">
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
                                        La fecha de consulta es requerida
                                    </p>
                                </div>
                                 <div class=\"col-md-4 form-group\" show-errors>
                                    <label for=\"fechaConsulta2\">Fecha Final Consulta (yyyy-mm-dd):</label>
                                    <input class=\"form-control datepicker input-sm\" ng-model=\"info.fechaConsulta2\" id=\"fechaConsulta2\" name=\"fechaConsulta2\" required=\"true\" />
                                    <p class=\"help-block\" ng-if=\"reporte.fechaConsulta2.\$error.required\" >
                                        La fecha de consulta es requerida
                                    </p>
                                </div> 
                                
                                <div class=\"col-md-4 form-group\" show-errors>
                                    <label>Metodo de Pago</label>
                                    <select type=\"text\" name=\"metodosPago\" id=\"metodosPago\" ng-model=\"info.metodosPago\" class=\"form-control input-sm\">                      
                                        <option value=\"-1\">Todos</option>
                                        <option ng-repeat=\"metodoPago in metodosPago\" ng-value=\"metodoPago.id\">
                                            {[{metodoPago.nombre}]}
                                        </option>                                            
                                    </select>                                        
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
                                <!--button type=\"button\" ng-click=\"generarReporte()\" class=\"btn btn-primary btn-sm pull-right\"-->
                                <button type=\"button\" class=\"btn btn-primary btn-sm pull-right\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">
                                    <i class=\"fa fa-gears fa-lg\"></i> Generar el reporte <span class=\"caret\"></span>
                                </button>
                                <ul class=\"dropdown-menu\">
                                    <li>
                                        <a ng-click=\"info.formato='pdf'; generarReporte()\">
                                            <i class=\"fa fa-file-pdf-o fa-lg\"></i> Archivo PDF
                                        </a>
                                    </li>
                                    <li>
                                        <a ng-click=\"info.formato='xlsx';generarReporte()\">
                                            <i class=\"fa fa-file-excel-o fa-lg\"></i> Archivo Excel
                                        </a>
                                    </li>

                                </ul>
                                
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

    // line 82
    public function block_javascripts($context, array $blocks = array())
    {
        // line 83
        echo "    <script type=\"text/javascript\" src=\"";
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/main/angular.min.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 84
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/main/showErrors.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 85
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/main/bootstrap.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 86
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/main/main.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 87
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/cartera/consignacion.recaudo.angular.js"), "html", null, true);
        echo "\"></script>
";
    }

    public function getTemplateName()
    {
        return "ReportesBundle:Recaudo:consignacionRecaudo.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  154 => 87,  150 => 86,  146 => 85,  142 => 84,  137 => 83,  134 => 82,  60 => 10,  57 => 9,  49 => 7,  43 => 5,  39 => 4,  34 => 3,  31 => 2,);
    }
}
