<?php

/* ReportesBundle:Cartera:anticiposPendintesCruzar.html.twig */
class __TwigTemplate_182055ec84087edf2d36b87383236f66f078c6278eaa0efb860a512fca63aba8 extends Twig_Template
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
        echo "Reporte anticipos pendintes por cruzar -";
        echo twig_escape_filter($this->env, (isset($context["empresa"]) ? $context["empresa"] : $this->getContext($context, "empresa")), "html", null, true);
        echo " ";
    }

    // line 9
    public function block_body($context, array $blocks = array())
    {
        // line 10
        echo "    <div style=\"display: none\" id=\"module\" ng-app=\"myApp\" ng-controller=\"AnticiposPendientesCruzarControllerAngular\">
        <form name=\"reporte\" id=\"reporte\" method=\"post\" novalidate>
            <fieldset>
                <legend>Filtros de búsqueda</legend>
                <div class=\"col-md-12\">
                    <div class=\"panel panel-default\">
                        <div class=\"panel-body\">
                            <div class=\"row\">
                                <div class=\"col-md-4 form-group\" show-errors>
                                    <label for=\"fechaConsulta1\">Fecha Inicio (yyyy-mm-dd):</label>
                                    <input required=\"true\" class=\"form-control datepicker input-sm\" ng-model=\"info.fechaInicio\" id=\"fechaInicio\" name=\"fechaInicio\" />
                                    <p class=\"help-block\" ng-if=\"reporte.fechaInicio.\$error.required\">
                                        La fecha inicio es requerida
                                    </p>
                                </div> 
                                <div class=\"col-md-4 form-group\" show-errors>
                                    <label for=\"fechaConsulta1\">Fecha Fin (yyyy-mm-dd):</label>
                                    <input required=\"true\" class=\"form-control datepicker input-sm\" ng-model=\"info.fechaFin\" id=\"fechaFin\" name=\"fechaFin\" />
                                    <p class=\"help-block\" ng-if=\"reporte.fechaFin.\$error.required\">
                                        La fecha fin es requerida
                                    </p>
                                </div>
                                <div class=\"col-md-4 form-group\" >
                                    <button class=\"btn btn-primary\" style=\"margin-top: 25px\" ng-click=\"abrirDialogoCiclos()\">Seleccionar Ciclos</button>
                                </div>
                            </div>    
                        </div>
                        <div class=\"panel-footer\">    
                            <div class=\"col-md-9\">
                                <div class=\"alert-box info\">
                                    Toda la informacion sera generada en un archivo .xlsx
                                </div>  
                            </div>
                            <div class=\"col-md-3\">
                                <button type=\"button\" ng-click=\"generarReporte()\" class=\"btn btn-primary btn-sm pull-right\">
                                    <i class=\"fa fa-gears fa-lg\"></i> Generar reporte regulados
                                </button>
                            </div>               
                            <div class=\"clearfix\"></div>
                        </div>
                    </div>
                </div>                
            </fieldset>
        </form>
        
        <script type=\"text/ng-template\" id=\"ciclos.html\">
        <div class=\"modal fade\">
            <div class=\"modal-dialog\">
                <div class=\"modal-content\">
                    <div class=\"modal-header\">
                        <button type=\"button\" class=\"close\" ng-click=\"close(false)\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>
                        <h4 class=\"modal-title\">Selecione los municipios a consiltar</h4>
                    </div>
                    <div class=\"modal-body\" style=\"max-height:200px; overflow-y:auto;\">
                        <div ng-repeat=\"ciclo in modelo.ciclos\" class=\"standard\" flex=\"50\">
                             <label>
                               <input type=\"checkbox\" ng-click=\"onCicloSeleccionado(\$event, ciclo.idciclo)\" ng-checked=\"exists(ciclo.idciclo)\"/>
                               {[{ciclo.ciclo}]}
                             </label>
                           </div>
                    </div>
                    <div class=\"modal-footer\">
                        <button type=\"button\" ng-click=\"close(false)\" class=\"btn btn-default\" data-dismiss=\"modal\">Cancelar</button>
                        <button type=\"button\" ng-click=\"close(true)\" class=\"btn btn-primary\" data-dismiss=\"modal\">Aceptar</button>
                    </div>
                </div>
            </div>
        </div>
        </script>
    </div>

";
    }

    // line 82
    public function block_javascripts($context, array $blocks = array())
    {
        echo "     
    <script type=\"text/javascript\" src=\"";
        // line 83
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/main/angular.min.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 84
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/main/angular-modal-service.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 85
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/main/showErrors.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 86
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/main/bootstrap.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 87
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/main/main.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 88
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/cartera/anticipioPendintesCruzar.angular.js"), "html", null, true);
        echo "\"></script>
";
    }

    public function getTemplateName()
    {
        return "ReportesBundle:Cartera:anticiposPendintesCruzar.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  160 => 88,  156 => 87,  152 => 86,  148 => 85,  144 => 84,  140 => 83,  135 => 82,  60 => 10,  57 => 9,  49 => 8,  43 => 6,  39 => 5,  34 => 4,  31 => 3,);
    }
}
