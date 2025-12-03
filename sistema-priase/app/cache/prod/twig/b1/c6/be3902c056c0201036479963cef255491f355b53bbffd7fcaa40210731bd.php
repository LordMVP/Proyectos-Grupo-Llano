<?php

/* ReportesBundle:Cartera:validacionRecaudosCaja.html.twig */
class __TwigTemplate_b1c6be3902c056c0201036479963cef255491f355b53bbffd7fcaa40210731bd extends Twig_Template
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
        echo "Reporte validación recaudos caja -";
        echo twig_escape_filter($this->env, (isset($context["empresa"]) ? $context["empresa"] : $this->getContext($context, "empresa")), "html", null, true);
        echo " ";
    }

    // line 9
    public function block_body($context, array $blocks = array())
    {
        // line 10
        echo "    <div style=\"display: none\" id=\"module\" ng-app=\"myApp\" ng-controller=\"ValidacionRecaudosCajaController\">
        <form name=\"reporte\" id=\"reporte\" method=\"post\" novalidate>
            <fieldset>
                <legend>Filtros de búsqueda</legend>
                <div class=\"col-md-12\">
                    <div class=\"panel panel-default\">
                        <div class=\"panel-body\">
                            <div class=\"col-md-12\">
                                <div class=\"form-group col-md-4\" show-errors>
                                    <label>Cajero</label>
                                    <select required=\"true\" id=\"cajero\" ng-change=\"\" name=\"cajero\" ng-model=\"info.cajero\" class=\"form-control\">
                                        <option ng-repeat=\"cajero in cajeros\" ng-value=\"cajero.idcajero\">{[{cajero.nombrecajero}]}</option>
                                    </select>
                                    <p class=\"help-block\" ng-if=\"reporte.cajero.\$error.required\">
                                        El cajero es requerido
                                    </p>
                                </div>
                                <div class=\"col-md-4 form-group\" show-errors>
                                    <label for=\"dia\">Dia (yyyy-mm-dd):</label>
                                    <input required=\"true\" class=\"form-control datepicker input-sm\" ng-model=\"info.dia\" id=\"dia\" name=\"dia\" />
                                    <p class=\"help-block\" ng-if=\"reporte.dia.\$error.required\">
                                        La fecha del día es requerida
                                    </p>
                                </div> 
                                <div class=\"col-md-4\">
                                    <button class=\"btn btn-primary\" style=\"margin-top: 25px\" ng-click=\"abrirDialogoMunicipios()\">Seleccionar Sucursales</button>
                                </div>
                            </div>
                            <div class=\"col-md-12\">
                                <div class=\"col-md-4\">
                                    <button class=\"btn btn-primary\" style=\"margin-top: 25px\" ng-click=\"abrirDialogoMediosPagos()\">Seleccionar Medios Pagos</button>
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
                                        <i class=\"fa fa-gears fa-lg\"></i> Generar reporte
                                    </button>
                                </div>               
                                <div class=\"clearfix\"></div>
                        </div>
                    </div>
                </div>                
            </fieldset>
        </form>

        {[{municipios}]}
        
        <script type=\"text/ng-template\" id=\"municipios.html\">
            <div class=\"modal fade\">
                <div class=\"modal-dialog\">
                    <div class=\"modal-content\">
                        <div class=\"modal-header\">
                            <button type=\"button\" class=\"close\" ng-click=\"close(false)\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>
                            <h4 class=\"modal-title\">Selecione las sucursales a consultar</h4>
                        </div>
                        <div class=\"modal-body\" style=\"max-height:200px; overflow-y:auto;\">
                            
                            <div class=\"standard\" flex=\"50\">
                                ";
        // line 76
        $context['_parent'] = (array) $context;
        $context['_seq'] = twig_ensure_traversable((isset($context["municipios"]) ? $context["municipios"] : $this->getContext($context, "municipios")));
        foreach ($context['_seq'] as $context["_key"] => $context["municipio"]) {
            echo " 
                                <label>
                                    <input type=\"checkbox\" ng-click=\"onMunicipioSeleccionado(\$event, ";
            // line 78
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["municipio"]) ? $context["municipio"] : $this->getContext($context, "municipio")), "idmunicipio"), "html", null, true);
            echo ")\" ng-checked=\"exists(municipio.idmunicipio)\"/>
                                    ";
            // line 79
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["municipio"]) ? $context["municipio"] : $this->getContext($context, "municipio")), "municipio"), "html", null, true);
            echo "
                                </label>
                                ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['municipio'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 82
        echo "                            </div>
                            
                        </div>
                        <div class=\"modal-footer\">
                            <button type=\"button\" ng-click=\"close(false)\" class=\"btn btn-default\" data-dismiss=\"modal\">Cancelar</button>
                            <button type=\"button\" ng-click=\"close(true)\" class=\"btn btn-primary\" data-dismiss=\"modal\">Aceptar</button>
                        </div>
                    </div>
                </div>
            </div>
        </script>
        
        <script type=\"text/ng-template\" id=\"mediosPagos.html\">
        <div class=\"modal fade\">
            <div class=\"modal-dialog\">
                <div class=\"modal-content\">
                    <div class=\"modal-header\">
                        <button type=\"button\" class=\"close\" ng-click=\"close(false)\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>
                        <h4 class=\"modal-title\">Selecione los medios de pagos a consultar</h4>
                    </div>
                    <div class=\"modal-body\" style=\"max-height:200px; overflow-y:auto;\">
                        <div ng-repeat=\"mediopago in modelo.medospagos\" class=\"standard\" flex=\"50\">
                            <label>
                                <input type=\"checkbox\" ng-click=\"onMediosPagosSeleccionado(\$event, mediopago.id)\" ng-checked=\"exists(mediopago.id)\"/>
                                {[{mediopago.nombre}]}
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

    // line 122
    public function block_javascripts($context, array $blocks = array())
    {
        echo "     
    <script type=\"text/javascript\" src=\"";
        // line 123
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/main/angular.min.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 124
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/main/angular-modal-service.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 125
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/main/showErrors.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 126
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/main/bootstrap.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 127
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/main/main.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 128
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/cartera/validacionRecaudosCaja.angular.js"), "html", null, true);
        echo "\"></script>
";
    }

    public function getTemplateName()
    {
        return "ReportesBundle:Cartera:validacionRecaudosCaja.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  216 => 128,  212 => 127,  208 => 126,  204 => 125,  200 => 124,  196 => 123,  191 => 122,  148 => 82,  139 => 79,  135 => 78,  128 => 76,  60 => 10,  57 => 9,  49 => 8,  43 => 6,  39 => 5,  34 => 4,  31 => 3,);
    }
}
