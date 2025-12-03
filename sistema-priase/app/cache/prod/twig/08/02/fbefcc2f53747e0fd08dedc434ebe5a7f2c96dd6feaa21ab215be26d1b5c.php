<?php

/* ReportesBundle:Facturacion:pagosFacturacion.html.twig */
class __TwigTemplate_0802fbefcc2f53747e0fd08dedc434ebe5a7f2c96dd6feaa21ab215be26d1b5c extends Twig_Template
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

    // line 3
    public function block_stylesheets($context, array $blocks = array())
    {
        // line 4
        echo "    <link rel=\"stylesheet\" type=\"text/css\" href=\"";
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/theme/jquery.ui.all.css"), "html", null, true);
        echo "\" />
    <link rel=\"stylesheet\" type=\"text/css\" href=\"";
        // line 5
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/css/main/main.css"), "html", null, true);
        echo "\" />
    <link rel=\"stylesheet\" type=\"text/css\" href=\"";
        // line 6
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/css/main/bootstrap.css"), "html", null, true);
        echo "\" />
";
    }

    // line 8
    public function block_titulo($context, array $blocks = array())
    {
        echo "Reporte de pagos y anticipos -";
        echo twig_escape_filter($this->env, (isset($context["empresa"]) ? $context["empresa"] : $this->getContext($context, "empresa")), "html", null, true);
        echo " ";
    }

    // line 9
    public function block_body($context, array $blocks = array())
    {
        // line 10
        echo "    <div style=\"display: none\" id=\"module\" ng-app=\"myApp\" ng-controller=\"PagosFacturacionControllerAngular\">
        <form name=\"reporte\" id=\"reporte\" method=\"post\" novalidate>
            <fieldset>
                <legend>Filtros de búsqueda</legend>
                <div class=\"col-md-12\">
                    <div class=\"panel panel-default\">
                        <div class=\"panel-body\">
                            <div class=\"row\">
                                <div class=\"form-group col-md-4\" show-errors>
                                    <label>Año</label>
                                    <select id=\"anos\"  name=\"anos\" ng-model=\"info.anos\" class=\"form-control\" ng-change=\"cargarPeriodos()\">
                                        <option ng-repeat=\"ano in anos\" ng-value=\"ano.anos\">{[{ano.anos}]}</option>
                                    </select>   
                                    <p class=\"help-block\" ng-if=\"reporte.anos.\$error.required\">
                                        * El años es obligatorio
                                    </p>
                                </div>
                                <div class=\"form-group col-md-4\" show-errors >
                                    <label>Periodo</label>
                                    <select id=\"periodo\"  name=\"periodo\" ng-model=\"info.idordenperiodo\"  class=\"form-control\">
                                        <option ng-repeat=\"periodo in periodos\" ng-value=\"periodo.idorden\">{[{periodo.nombre}]}</option>
                                    </select> 
                                    <p class=\"help-block\" ng-if=\"reporte.anos.\$error.required\">
                                        * El periodo es obligatorio
                                    </p>
                                </div>
                            </div>
                            <div class=\"panel-footer\">    
                                <div class=\"col-md-9\">
                                    <div class=\"alert-box info\">
                                        Toda la informacion sera generada en un archivo .xlsx
                                    </div>  
                                </div>                            
                                                              
                                <div class=\"btn-group col-md-3\">
                                    <button type=\"button\" class=\"btn btn-primary btn-sm pull-right\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">
                                        <i class=\"fa fa-gears fa-lg\"></i> Reporte Pagos  <span class=\"caret\"></span>
                                    </button>
                                    <ul class=\"dropdown-menu\">                                                                              
                                        <li>
                                            <a ng-click=\"download=true;generarReporte(1)\">
                                                <i class=\"fa fa-file-excel-o fa-lg\"></i> Cx Cobrar y Tar. Basica
                                            </a>
                                        </li>    
                                        <li>
                                            <a ng-click=\"download=true;generarReporte(2)\">
                                                <i class=\"fa fa-file-excel-o fa-lg\"></i> Todo Concepto
                                            </a>
                                        </li> 
                                    </ul>
                                </div>                            
                                <div class=\"clearfix\"></div>
                            </div>
                        </div>
                    </div>
                </div>                
            </fieldset>
            <fieldset>
                <legend>Parametros del reporte Anticipos</legend>
                <div class=\"col-md-12\">
                    <div class=\"panel panel-default\">
                        <div class=\"panel-body\">
                            <div class=\"row\">
                                <!--div class=\"col-md-4 form-group\" show-errors>
                                    <label for=\"fechaConsulta1\">Fecha Inicial Consulta (yyyy-mm-dd):</label>
                                    <input class=\"form-control datepicker input-sm\" ng-model=\"info.fechaConsulta1\" id=\"fechaConsulta1\" name=\"fechaConsulta1\" />
                                    <p class=\"help-block\" ng-if=\"reporte.fechaConsulta1.\$error.required\" >
                                        La fecha de consulta es requerida
                                    </p>
                                </div-->
                                <div class=\"col-md-4 form-group\" show-errors>
                                    <label for=\"fechaConsulta2\">Periodo de Consulta (yyyy-mm-dd):</label>
                                    <input class=\"form-control datepicker input-sm\" ng-model=\"info.fechaConsulta2\" id=\"fechaConsulta2\" name=\"fechaConsulta2\" />
                                    <p class=\"help-block\" ng-if=\"reporte.fechaConsulta2.\$error.required\" >
                                        La fecha de consulta es requerida
                                    </p>
                                </div>
                                <div class=\"form-group col-md-3\" show-errors>
                                    <label>Municipio</label>
                                    <select type=\"text\" name=\"municipio\" id=\"municipio\" ng-model=\"info.municipio\" class=\"form-control input-sm\">                                            
                                        <option ng-repeat=\"item in municipios\" ng-value=\"item.idmunicipio\">{[{item.municipio}]}</option>                                            
                                    </select>
                                    <p class=\"help-block\" ng-if=\"reporte.municipio.\$error.required\">
                                        El municipio es requerido
                                    </p>
                                </div>
                            </div>                                                                                                                 
                        </div>
                        <div class=\"panel-footer\">    
                            <div class=\"col-md-9\">
                                <div class=\"alert-box info\">
                                    Generar reporte formato xlsx.
                                </div>  
                            </div>

                            <div class=\"btn-group col-md-3\">
                                <button type=\"button\" class=\"btn btn-primary btn-sm pull-right\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">
                                    <i class=\"fa fa-gears fa-lg\"></i> Reporte Anticipos  <span class=\"caret\"></span>
                                </button>
                                <ul class=\"dropdown-menu\">                                                                              
                                    <li>
                                        <a ng-click=\"download=true;generarReporte2()\">
                                            <i class=\"fa fa-file-excel-o fa-lg\"></i> Anticipos
                                        </a>
                                    </li>                                    
                                    <li>
                                        <a ng-click=\"download=true;generarReporte3()\">
                                            <i class=\"fa fa-file-excel-o fa-lg\"></i> Anticipos Conciliacion
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

    // line 132
    public function block_javascripts($context, array $blocks = array())
    {
        echo "     
    <script type=\"text/javascript\" src=\"";
        // line 133
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/main/angular.min.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 134
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/main/angular-modal-service.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 135
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/main/showErrors.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 136
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/main/bootstrap.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 137
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/main/main.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 138
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/facturacion/pagosFacturacion.angular.js"), "html", null, true);
        echo "\"></script>
";
    }

    public function getTemplateName()
    {
        return "ReportesBundle:Facturacion:pagosFacturacion.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  210 => 138,  206 => 137,  202 => 136,  198 => 135,  194 => 134,  190 => 133,  185 => 132,  60 => 10,  57 => 9,  49 => 8,  43 => 6,  39 => 5,  34 => 4,  31 => 3,);
    }
}
