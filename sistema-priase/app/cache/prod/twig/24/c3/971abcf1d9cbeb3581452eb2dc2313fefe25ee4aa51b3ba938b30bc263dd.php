<?php

/* ReportesBundle:Recaudo:movimientoContable.html.twig */
class __TwigTemplate_24c3971abcf1d9cbeb3581452eb2dc2313fefe25ee4aa51b3ba938b30bc263dd extends Twig_Template
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
        echo "Reporte Movimiento Contable -";
        echo twig_escape_filter($this->env, (isset($context["empresa"]) ? $context["empresa"] : $this->getContext($context, "empresa")), "html", null, true);
        echo " ";
    }

    // line 9
    public function block_body($context, array $blocks = array())
    {
        // line 10
        echo "    <div style=\"display: none\" id=\"module\" ng-app=\"myApp\" ng-controller=\"MovimientoContableController\">
        <form name=\"reporte\" id=\"reporte\" method=\"post\" novalidate>
            <fieldset>
                <legend>Parametros del reporte</legend>
                <div class=\"col-md-12\">
                    <div class=\"panel panel-default\">
                        <div class=\"panel-body\">
                            <div class=\"row\">
                                <div class=\"col-md-4 form-group\" show-errors>
                                        <label>Movimiento Contable</label>
                                        <select type=\"text\" name=\"mvi2\" id=\"mvi2\" ng-model=\"info.mvi2\" class=\"form-control input-sm\">                      
                                            <option value=\"-1\">Todos</option>
                                            <option ng-repeat=\"mv in mvi2\" ng-value=\"mv.idemvi\">
                                                {[{mv.fecha}]}
                                            </option>                                            
                                        </select>
                                        
                                </div>
                                <div class=\"col-md-4 form-group\" show-errors>
                                    <label for=\"fechaConsulta1\">Fecha Inicial Consulta (yyyy-mm-dd):</label>
                                    <input class=\"form-control datepicker input-sm\" ng-model=\"info.fechaConsulta1\" id=\"fechaConsulta1\" name=\"fechaConsulta1\"  />
                                   
                                </div>
                                 <div class=\"col-md-4 form-group\" show-errors>
                                    <label for=\"fechaConsulta2\">Fecha Final Consulta (yyyy-mm-dd):</label>
                                    <input class=\"form-control datepicker input-sm\" ng-model=\"info.fechaConsulta2\" id=\"fechaConsulta2\" name=\"fechaConsulta2\"  />
                                   
                                </div>
                                
                                <div class=\"form-group col-md-4\" show-errors>
                                        <label>Proyecto</label>
                                        <select id=\"proyecto\" name=\"proyecto\" ng-model=\"info.proyecto\" class=\"form-control\">
                                            <option value=\"-1\">Todos</option>
                                            <option ng-repeat=\"proyecto in proyectos\" ng-value=\"proyecto.proyecto_id\">
                                                {[{proyecto.proyecto_nombre}]}
                                            </option>
                                        </select>
                                        
                                    </div>                                                                
                                <div class=\"form-group col-md-4\" show-errors>
                                        <label>Tipo de Movimiento</label>
                                        <select id=\"tipo\" name=\"tipo\" ng-model=\"info.tipo\" class=\"form-control\">                  
                                            <option value=\"1\">Causación</option>
                                            <option value=\"2\">Recaudo</option>
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
                                <button type=\"button\" ng-click=\"generarReporte()\" class=\"btn btn-primary btn-sm pull-right\">
                                    <i class=\"fa fa-gears fa-lg\"></i> Generar el reporte
                                </button>
                            </div>               
                            <div class=\"clearfix\"></div>
                        </div>
                    </div>
                </div>                
            </fieldset>
            <fieldset>
                <legend>Movimiento Contable Detallado</legend>
                <div class=\"col-md-12\">
                    <div class=\"panel panel-default\">
                        
                        <div class=\"panel-body\">
                            <div class=\"row\">
                                <div class=\"col-lg-12\">
                                    <div class=\"col-md-4 form-group\" show-errors>
                                        <label>Movimiento Contable</label>
                                        <select type=\"text\" name=\"mvi\" id=\"mvi\" ng-model=\"info.mvi\" class=\"form-control input-sm\">                      
                                            <option value=\"-1\">Todos</option>
                                            <option ng-repeat=\"mv in mvi\" ng-value=\"mv.idemvi\">
                                                {[{mv.fecha}]}
                                            </option>                                            
                                        </select>
                                        
                                    </div>
                                     <div class=\"col-md-4 form-group\" show-errors>
                                    <label for=\"fechaConsulta3\">Fecha Inicial Consulta (yyyy-mm-dd):</label>
                                    <input class=\"form-control datepicker input-sm\" ng-model=\"info.fechaConsulta3\" id=\"fechaConsulta3\" name=\"fechaConsulta3\" />
                                    
                                </div>
                                 <div class=\"col-md-4 form-group\" show-errors>
                                    <label for=\"fechaConsulta4\">Fecha Final Consulta (yyyy-mm-dd):</label>
                                    <input class=\"form-control datepicker input-sm\" ng-model=\"info.fechaConsulta4\" id=\"fechaConsulta4\" name=\"fechaConsulta4\" />
                                    
                                </div>                                   
                                    <div class=\"col-md-4 form-group\" show-errors>
                                        <label>Proyecto</label>
                                        <select type=\"text\" name=\"municipio\" id=\"municipio\" ng-model=\"info.municipio\" class=\"form-control input-sm\">
                                            <option value=\"-1\">Todos los municipios</option>
                                            <option ng-repeat=\"item in municipios\" ng-value=\"item.idmunicipio\">{[{item.municipio}]}</option>                                            
                                        </select>
                                        
                                    </div>
                                    
                                    <div class=\"col-md-4 form-group\" show-errors>
                                        <label>Tipo de Movimiento</label>
                                        <select id=\"tipo2\" name=\"tipo2\" ng-model=\"info.tipo2\" class=\"form-control\">                  
                                            <option value=\"1\">Causación</option>
                                            <option value=\"2\">Recaudo</option>
                                        </select>                                        
                                    </div> 
                                    
                                    
                                    <div class=\"col-md-4 form-group\" show-errors>
                                        <label>Documento</label>
                                        <select multiple id=\"documento\" name=\"documento\" ng-model=\"info.documento\" class=\"form-control\">                  
                                            <option ng-repeat=\"doc in documentos\" ng-value=\"doc.id\">
                                                {[{doc.nombre}]}
                                            </option>
                                        </select>                                        
                                    </div> 
                                    
                                    
                                    <div class=\"col-md-4 form-group\" show-errors>
                                        <label>Tipo Documento</label>
                                        <select multiple id=\"tipoDocumento\" name=\"tipoDocumento\" ng-model=\"info.tipoDocumento\" class=\"form-control\">                  
                                            <option ng-repeat=\"tipoDoc in tiposDocumento\" ng-value=\"tipoDoc.id\">
                                                {[{tipoDoc.nombre}]}
                                            </option>
                                        </select>                                        
                                    </div> 
                                    
                                    <div class=\"col-md-4 form-group\" show-errors>
                                        <label>Concepto</label>
                                        <select multiple id=\"concepto\" name=\"concepto\" ng-model=\"info.concepto\" class=\"form-control\">                  
                                            <option ng-repeat=\"concepto in conceptos\" ng-value=\"concepto.id\">
                                                {[{concepto.nombre}]}
                                            </option>
                                        </select>                                        
                                    </div> 
                                    
                                   
                                    <div class=\"col-md-4 form-group\">
                                        <label>Buscar</label>
                                        <button ng-click=\"download=true;buscarEmv()\" class=\"form-control input-sm\">
                                            <i class=\"fa fa-search fa-1x\"></i> Buscar 
                                        </button>
                                    </div>
                                    
                                </div>
                                <div class=\"col-md-12\" uib-collapse=\"todasEmv==1\">
                                    <div class=\"col-lg-6\">
                                        <label>Seleccionar Movimiento</label> &nbsp;
                                        <table ng-table=\"ngTable\" class=\"table table-condensed table-responsive\">                                    
                                            <tr ng-show=\"!\$data || \$data.length==0\">
                                                <td colspan=\"4\">No hay resultados para mostrar</td>
                                            </tr>
                                            <tr ng-repeat=\"row in \$data\">
                                                <td data-title=\"'Id Movi'\">{[{row.idemv}]}</td>
                                                <td data-title=\"'Fecha'\" >{[{row.fecha}]}</td>
                                                <td data-title=\"'Opcion'\" >
                                                    <a ng-click=\"agregarRuta(row)\">
                                                        <span class=\"glyphicon glyphicon-plus\" aria-hidden=\"true\"></span> Agregar
                                                    </a>
                                                </td>
                                            </tr>
                                        </table> 
                                    </div>
                                    <div class=\"col-lg-6\">
                                        <label>Movimientos Seleccionados</label> &nbsp;
                                        <table ng-table=\"ngTable2\" class=\"table table-condensed table-responsive\">                                    
                                            <tr ng-repeat=\"row in \$data\">
                                                <td data-title=\"'Id Movi'\">{[{row.idemv}]}</td>
                                                <td data-title=\"'Fecha'\" >{[{row.fecha}]}</td>
                                                <td data-title=\"'Opcion'\" >
                                                    <a ng-click=\"removerRuta(row)\">
                                                        <span class=\"glyphicon glyphicon-minus\" aria-hidden=\"true\"></span> Remover
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class=\"panel-footer\">    
                            
                            <div class=\"row\">
                                <div class=\"col-md-9\">
                                    <div class=\"alert-box info\">
                                        Importante: este archivo puede tomar tiempo en ser generado
                                    </div>  
                                </div>
                                <div class=\"col-md-3\">
                                    <!--button type=\"button\" class=\"btn btn-primary btn-sm\" ng-click=\"generarReporte2()\">
                                        <i class=\"fa fa-file-excel-o fa-lg\"></i>Generar Reporte Detallado
                                    </button-->
                                    
                                    <div class=\"btn-group\">
                                        <button type=\"button\" class=\"btn btn-primary btn-sm pull-right\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">
                                            <i class=\"fa fa-gears fa-lg\"></i> Generar el reporte <span class=\"caret\"></span>
                                        </button>
                                        <ul class=\"dropdown-menu\">
                                            <li>
                                                <a ng-click=\"download=true;generarReporte2(false)\">
                                                    <i class=\"fa fa-file-pdf-o fa-lg\"></i> Generar Reporte Detallado
                                                </a>
                                            </li>
                                            <li>
                                                <a ng-click=\"download=true;generarReporte2(true)\">
                                                    <i class=\"fa fa-file-excel-o fa-lg\"></i> Generar Reporte Agrupado
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
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

    // line 238
    public function block_javascripts($context, array $blocks = array())
    {
        // line 239
        echo "    <script type=\"text/javascript\" src=\"";
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/main/angular.min.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 240
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/main/showErrors.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 241
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/main/bootstrap.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 242
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/main/ui-bootstrap-tpls-1.3.2.min.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 243
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/main/angular-animate.min.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 244
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/main/ng-table.mod.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 245
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/main/main.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 246
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Reportes/js/cartera/movimiento.contable.angular.js"), "html", null, true);
        echo "\"></script>
";
    }

    public function getTemplateName()
    {
        return "ReportesBundle:Recaudo:movimientoContable.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  322 => 246,  318 => 245,  314 => 244,  310 => 243,  306 => 242,  302 => 241,  298 => 240,  293 => 239,  290 => 238,  60 => 10,  57 => 9,  49 => 7,  43 => 5,  39 => 4,  34 => 3,  31 => 2,);
    }
}
