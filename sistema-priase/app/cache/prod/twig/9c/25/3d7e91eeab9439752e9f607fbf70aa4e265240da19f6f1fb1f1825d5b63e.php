<?php

/* ReportesBundle:Facturacion:duplicadoFacturaLocal.html.twig */
class __TwigTemplate_9c253d7e91eeab9439752e9f607fbf70aa4e265240da19f6f1fb1f1825d5b63e extends Twig_Template
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
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/css/main/main.css"), "html", null, true);
        echo "\" />    
    <link rel=\"stylesheet\" type=\"text/css\" href=\"";
        // line 4
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/css/main/ng-table.min.css"), "html", null, true);
        echo "\" />    
    <link rel=\"stylesheet\" type=\"text/css\" href=\"";
        // line 5
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/css/main/bootstrap.css"), "html", null, true);
        echo "\" />    
";
    }

    // line 7
    public function block_scripts($context, array $blocks = array())
    {
        // line 8
        echo "    <script type=\"text/javascript\" src=\"/achagua/js/jquery.dataTables.min.js\"></script>
";
    }

    // line 10
    public function block_titulo($context, array $blocks = array())
    {
        echo "Reporte Duplicado de Factura  -";
        echo twig_escape_filter($this->env, (isset($context["empresa"]) ? $context["empresa"] : $this->getContext($context, "empresa")), "html", null, true);
        echo " ";
    }

    // line 12
    public function block_body($context, array $blocks = array())
    {
        // line 13
        echo "    <div style=\"display: none\" id=\"module\" ng-app=\"myApp\" ng-controller=\"DuplicadoController\">
        <form name=\"reporte\" id=\"reporte\" method=\"post\" novalidate>
            
            ";
        // line 16
        $context['_parent'] = (array) $context;
        $context['_seq'] = twig_ensure_traversable((isset($context["permisos"]) ? $context["permisos"] : $this->getContext($context, "permisos")));
        foreach ($context['_seq'] as $context["_key"] => $context["permiso"]) {
            // line 17
            echo "                ";
            if (($this->getAttribute((isset($context["permiso"]) ? $context["permiso"] : $this->getContext($context, "permiso")), "ideunidad") == 3850)) {
                // line 18
                echo "                    <fieldset>
                        <legend>Reporte Duplicado Varias Suscripciones</legend>
                        
                        <div id=\"divControlesVarias\">

                                <div class=\"col-md-12\">
                                <div>
                                    <label for=\"txtSuscripciones\">Suscripciones:</label>
                                    <textarea  rows=\"3\"   ng-change=\"actualizarSuscripcion()\" id=\"idSuscripciones\" ng-model=\"info.idSuscripciones\" placeholder=\"Ingrese las Suscripciones a generar el Duplicado separados por coma (,).\"></textarea>
                                    <button  type=\"button\" class=\"btn btn-primary btn-sm pull-left\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">
                                            <i class=\"fa fa-gears fa-lg\"></i> Generar Duplicados  <span class=\"caret\"></span>
                                    </button>
                                        <ul class=\"dropdown-menu\">                                                                              
                                            <li>
                                                <a ng-click=\"download=true;generarReporte3(0)\">
                                                    <i class=\"fa fa-file-pdf-o fa-lg\"></i> Imprimir Varias Factura
                                                </a>
                                            </li> 
                                        </ul>
                                </div>
                                </div>
                        </div>
                        
                        
                    </fieldset>
                ";
            }
            // line 44
            echo "            ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['permiso'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        echo "   
            <fieldset>
                <legend>Reporte Duplicado de Factura</legend>
                <div class=\"col-md-12\">
                    <div class=\"panel panel-default\">
                        <div class=\"panel-body\">
                            <div class=\"row\">
                                <div class=\"col-lg-12\">
                                    <div class=\"form-group col-md-3\" show-errors>
                                        <label>Codigo Actual</label>
                                        <input required=\"true\" ng-change=\"actualizarAnno()\"  name=\"idSuscripcion\" id=\"idSuscripcion\" ng-model=\"info.idSuscripcion\"   class=\"form-control input-sm\" placeholder=\"# Suscripcion\"  value=";
        // line 54
        echo "idSuscripcion";
        echo "/>
                                        <p class=\"help-block\" ng-if=\"reporte.idSuscripcion.\$error.required\">
                                            El numero de Cliente es requerido
                                        </p>
                                    </div>
                            ";
        // line 59
        $context['_parent'] = (array) $context;
        $context['_seq'] = twig_ensure_traversable((isset($context["permisos"]) ? $context["permisos"] : $this->getContext($context, "permisos")));
        foreach ($context['_seq'] as $context["_key"] => $context["permiso"]) {
            // line 60
            echo "                                ";
            if (($this->getAttribute((isset($context["permiso"]) ? $context["permiso"] : $this->getContext($context, "permiso")), "ideunidad") == 1217)) {
                // line 61
                echo "                                    <div class=\"form-group col-md-6\" show-errors>
                                         <label for=\"fechaConsulta\">Año Consulta (yyyy):</label>
                                         <select id=\"fechaConsulta\" name=\"fechaConsulta\" ng-model=\"info.fechaConsulta\" class=\"form-control\">
                                            <option ng-repeat=\"anno in annos\" ng-value=\"anno.anno\">
                                                {[{anno.anno}]}
                                            </option>
                                        </select>
                                        <p class=\"help-block\" ng-if=\"reporte.fechaConsulta.\$error.required\">
                                            El Año es requerido.
                                        </p> 
                                    </div>     
                                        <div class=\"col-md-2 form-group\">
                                            <label>Generar</label>
                                            <button ng-click=\"download=true;buscarPeriodos()\" class=\"form-control input-sm\">
                                                <i class=\"fa fa-search fa-1x\"></i> Buscar 
                                            </button>
                                        </div>                                    
                                    </div>


                                    <div class=\"form-group col-md-12\" uib-collapse=\"todos==1\">

                                        <label>Periodos Facturados</label> &nbsp;
                                        <table ng-table-dynamic=\"ngTable with columnas\" class=\"table table-condensed table-responsive\">                                    
                                            <tr ng-show=\"!agrupados || agrupados.length==0\">
                                                <td colspan=\"4\">No hay resultados para mostrar</td>
                                            </tr>
                                            <thead>
                                            <th>Id Periodo</th>
                                            <th>Mes</th>
                                            </thead>
                                            <tr ng-repeat=\"row in \$data\" ng-click=\"seleccionarFila(row)\" id=\"tr_{[{row.ide}]}\">
                                                <td>{[{row.ide}]}</td>
                                                <td>{[{row.nombre}]}</td>                                                
                                            </tr>
                                        </table>

                                    </div>  
                                ";
            }
            // line 100
            echo "                            ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['permiso'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 101
        echo "                            </div>
                        </div>
                        <div class=\"panel-footer\">    
                            <div class=\"col-md-9\">
                                <div ng-show=\"total!=0\" class=\"alert-box info\">
                                    Seleccione un perido o imprima factura actual.
                                </div>
                                <div ng-show=\"total==0\" class=\"alert-box error\">
                                    No se encontraron resultados para el numero nit o documento [ {[{info.numero_orden}]} {[{info.numeroDocumento}]} ]
                                </div>
                            </div>
                            
                            
                            <div class=\"col-md-2\">
                                    <button ng-disabled=\"selected==null\" type=\"button\" class=\"btn btn-primary btn-sm pull-right\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">
                                        <i class=\"fa fa-gears fa-lg\"></i> Generar reporte  <span class=\"caret\"></span>
                                    </button>
                                    <ul class=\"dropdown-menu\">                                                                              
                                        <li>
                                            <a ng-click=\"download=true;generarReporte2(0)\">
                                                <i class=\"fa fa-file-pdf-o fa-lg\"></i> Imprimir Factura
                                            </a>
                                        </li> 
                                        
                                        <li>
                                            <a ng-click=\"download=true;generarReporte2(1)\">
                                                <i class=\"fa fa-file-pdf-o fa-lg\"></i> Imprimir Factura Pagos
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

    // line 143
    public function block_javascripts($context, array $blocks = array())
    {
        // line 144
        echo "    <script type=\"text/javascript\" src=\"";
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/main/angular.min.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 145
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/main/ng-table.mod.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 146
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/main/autocomplete/ui-bootstrap-tpls-0.14.3.min.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 147
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/main/showErrors.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 148
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/main/bootstrap.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 149
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/main/main.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 150
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/facturacion/duplicadoFacturaLocal.angular.js"), "html", null, true);
        echo "\"></script>
";
    }

    public function getTemplateName()
    {
        return "ReportesBundle:Facturacion:duplicadoFacturaLocal.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  260 => 150,  256 => 149,  252 => 148,  248 => 147,  244 => 146,  240 => 145,  235 => 144,  232 => 143,  188 => 101,  182 => 100,  141 => 61,  138 => 60,  134 => 59,  126 => 54,  109 => 44,  81 => 18,  78 => 17,  74 => 16,  69 => 13,  66 => 12,  58 => 10,  53 => 8,  50 => 7,  44 => 5,  40 => 4,  35 => 3,  32 => 2,);
    }
}
