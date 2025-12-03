<?php

/* LlanogasLlanogasBundle:Liquidacion:gestionarLiquidacion.html.twig */
class __TwigTemplate_6002b5575f8ade1719c9b65ff565befe3b69ee8f980c82527ea63942170d0812 extends Twig_Template
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

    // line 3
    public function block_stylesheets($context, array $blocks = array())
    {
        // line 4
        echo "    <link rel=\"stylesheet\" type=\"text/css\" href=\"";
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/theme/jquery.ui.all.css"), "html", null, true);
        echo "\" />
    <link rel=\"stylesheet\" type=\"text/css\" href=\"";
        // line 5
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/liquidaciones/gestionar.estilo.css"), "html", null, true);
        echo "\" />
    <link rel=\"stylesheet\" type=\"text/css\" href=\"";
        // line 6
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/theme/jquery.datetimepicker.css"), "html", null, true);
        echo "\" />

    <style>
        #divMunicipios{
            float:left;
            width: 25%;
            min-height: 150px;
            padding-top: 15px;
        }

        #divMunicipios ul{
            margin-top:7px;
            margin-left:20px;
        }

        #divTiposUso{
            float:left;
            width: 70%;
            min-height: 150px;
        }
    </style>
";
    }

    // line 29
    public function block_scripts($context, array $blocks = array())
    {
        // line 30
        echo "
";
    }

    // line 33
    public function block_titulo($context, array $blocks = array())
    {
        echo " Gestionar Liquidación ";
    }

    // line 35
    public function block_body($context, array $blocks = array())
    {
        // line 36
        echo "
    <div id=\"divComandos\">

        <div class=\"divBotones\">
            <input type=\"button\" value=\"nuevo\" id=\"btnNuevo\" class=\"btn\" />
            <input type=\"button\" value=\"buscar\" id=\"btnBuscar\" class=\"btn\" />
            <input type=\"button\" value=\"grabar\" id=\"btnGrabar\" class=\"btn\" />
            <input type=\"button\" value=\"cancelar\" id=\"btnCancelar\" class=\"btn\" />
        </div>
    </div>

    <div id=\"divPanelContenedor\">


        <div id=\"divCabecera\">
            <div class=\"divIzquierda\">

                <!-- Emergente para confirmar cancelación de la operación-->
                <div id=\"divConfirmarCancelar\">
                    <p>¿Está seguro de cancelar la operación?</p>
                </div>
                <!-- Emergente para buscar una suscripción -->
                <div id=\"divBuscarSuscripcion\" >
                    <div class=\"campo\">
                        <label for=\"txtIdSuscripcion\">Id Suscripción:</label>
                        <input type=\"text\" id=\"txtIdSuscripcion\" maxlength=\"15\" />
                    </div>
                    <div class=\"campo\">
                        <label for=\"txtDocumento\">Cédula/NIT:</label>
                        <input type=\"text\" id=\"txtDocumento\" maxlength=\"20\" />
                    </div>
                    <div class=\"campo\">
                        <label for=\"txtCodigoAnterior\">Código Anterior:</label>
                        <input type=\"text\" id=\"txtCodigoAnterior\" maxlength=\"30\" />
                    </div>
                    <input type =\"button\" id=\"btnBuscarSuscripcion\" class=\"btnSimple\" value=\"Buscar\"/>
                    <span id=\"spanMensaje\" class=\"pMensajeSuscripcion\"></span>
                </div>

                <!-- Emergente para buscar una liquidación parametrizada -->
                <div id=\"divBuscarLiquidacion\" >
                    <div class=\"campo\">
                        <label for=\"txNombreLiquidacion\">Nombre Liquidación:</label>
                        <input type=\"text\" id=\"txNombreLiquidacion\" maxlength=\"20\" />
                    </div>
                    <div class=\"campo\">
                        <label for=\"txtIdLiquidacion\">Id Liquidación:</label>
                        <input type=\"text\" id=\"txtIdLiquidacion\" maxlength=\"15\" />
                    </div>
                    <input type =\"button\" id=\"btnBuscarLiquidacion\" class=\"btnSimple\" value=\"Buscar\"/>
                    <span id=\"spanMensaje\" class=\"pMensaje\"></span>
                </div>

                <!--Fieldset para mostrar datos de la liquidación-->
                <fieldset id=\"fieldsetLiquidacion\">
                    <legend>Liquidación</legend>

                    <div class=\"campo\">
                        <label for=\"txtLiquidacion\">Liquidación:</label>
                        <input type=\"text\" id=\"txtLiquidacion\" />
                    </div>

                    <div class=\"campo\">
                        <label for=\"cboClasificacion\">Clasificación:</label>
                        <select id=\"cboClasificacion\">
                            <option value=\"-1\">Seleccione una opción</option>
                            ";
        // line 102
        $context['_parent'] = (array) $context;
        $context['_seq'] = twig_ensure_traversable((isset($context["listaclasificaciones"]) ? $context["listaclasificaciones"] : $this->getContext($context, "listaclasificaciones")));
        foreach ($context['_seq'] as $context["_key"] => $context["clasificacion"]) {
            // line 103
            echo "                                <option value=\"";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["clasificacion"]) ? $context["clasificacion"] : $this->getContext($context, "clasificacion")), "idclasificacion"), "html", null, true);
            echo "\">";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["clasificacion"]) ? $context["clasificacion"] : $this->getContext($context, "clasificacion")), "clasificacion"), "html", null, true);
            echo "</option>
                            ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['clasificacion'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 105
        echo "                        </select>
                    </div>
                        
                    <div class=\"campo\" id=\"divCboTipoCuota\">
                        <label for=\"cboTipoCuota\">Tipo cuota:</label>
                        <select id=\"cboTipoCuota\"> 
                            <option value=\"-1\">Seleccione una opción </option>
                            <option value=\"F\">Fijo</option>
                            <option value=\"V\">Variable</option>
                        </select>
                    </div>

                    <div class=\"campo\">
                        <label for=\"cboDocumento\">Documento:</label>
                        <select id=\"cboDocumento\"> </select>
                    </div>

                    <div class=\"campo\">
                        <label for=\"cboTipoDocumento\">Tipo Documento:</label>
                        <select id=\"cboTipoDocumento\"> </select>
                    </div>

                    <div class=\"campo\">
                        <label for=\"txtInicioVigencia\">Inicio Vigencia:</label>
                        <input type=\"text\" id=\"txtInicioVigencia\" />
                    </div>

                    <div class=\"campo\">
                        <label for=\"txtFinVigencia\">Fin Vigencia:</label>
                        <input type=\"text\" id=\"txtFinVigencia\" />
                    </div>

                    <div class=\"campo\">
                        <label for=\"txtDiaVencimiento\">Días Vencimiento:</label>
                        <input type=\"text\" id=\"txtDiaVencimiento\" />
                    </div>

                    <div class=\"campo\">
                        <label for=\"txtDiaSuspension\">Días Suspensión:</label>
                        <input type=\"text\" id=\"txtDiaSuspension\" />
                    </div>

                    <div class=\"campo\" id=\"divCboPermiteVenta\">
                        <label for=\"cboPermiteVenta\">Permitir Liquidación Más de Una Vez al Mismo Cliente:</label>
                        <select id=\"cboPermiteVenta\">                            
                            <option value=\"N\">No</option>
                            <option value=\"S\">Si</option>
                        </select>
                    </div>
                        
                    <div class=\"campo campoRadio\">
                        <fieldset>
                            <legend>Guardar parametrización en histórico</legend>
                            <label for=\"rbtnEjecudataS\">
                                <input type=\"radio\" id=\"rbtnGuardarHistoricoSi\" title=\"S\" name=\"rbtnGuardarHistorico\" value=\"S\"  checked=\"true\"/>
                                Sí
                            </label>
                            <label for=\"rbtnEjecudataN\">
                                <input type=\"radio\" id=\"rbtnGuardarHistoricoNo\" title=\"N\" name=\"rbtnGuardarHistorico\" value=\"N\"  />
                                No
                            </label>
                        </fieldset>
                    </div>
                        
                    <input type=\"button\" value=\"Agregar Conceptos\" id=\"btnAgregarConceptos\" class=\"btnSimple\">

                </fieldset>

                <!--Fieldset oculto para agregar conceptos a la liquidación-->
                <fieldset id=\"fieldsetAgregarConceptos\">
                    <legend>Agregar Conceptos</legend>

                    <div class=\"campo\">
                        <label for=\"txtConcepto\">Concepto:</label>
                        <input type=\"text\" id=\"txtConcepto\" />
                    </div>

                    <div class=\"campo campoRadio\">
                        <fieldset>
                            <legend>Imprimir Recibo</legend>
                            <label for=\"rbtnEjecudataS\">
                                <input type=\"radio\" id=\"rbtnImprimirReciboSi\" title=\"Sí\" name=\"rbtnImprimirRecibo\" value=\"S\" checked=\"true\"  />
                                Sí
                            </label>
                            <label for=\"rbtnEjecudataN\">
                                <input type=\"radio\" id=\"rbtnImprimirReciboNo\" title=\"No\" name=\"rbtnImprimirRecibo\" value=\"N\"  />
                                No
                            </label>
                        </fieldset>
                    </div>

                    <div class=\"campo\">
                        <input type=\"button\" id=\"btnAgregar\" value=\"Agregar\" class=\"btnSimple\">
                    </div>

                    <table id=\"tblConceptos\" class=\"tabla\"></table>
                    <input type=\"button\" id=\"btnQuitarConceptos\" value=\"Quitar Conceptos\" class=\"btnSimple\">
                    <input type=\"button\" id=\"btnOtrasVinculaciones\" value=\"Otras Vinculaciones\" class=\"btnSimple\">

                </fieldset>

                <!--Fieldset oculto para otras vinculaciones-->
                <fieldset id=\"fieldsetOtrasVinculaciones\">
                    <legend>Otras Vinculaciones</legend>




                    <div id=\"divMunicipios\">
                        <input type=\"button\" id=\"btnAgregarMunicipio\" value=\"Agregar/Eliminar Municipio\" class=\"btnSimple agregar\">
                        <ul id=\"ulMunicipios\"></ul>
                    </div>

                    <div id=\"divTiposUso\">
                        <label for=\"cboTipoUso\">Tipo Uso:</label>
                        <select id=\"cboTipoUso\" >
                            <option value=\"-1\">Seleccione una opción</option>
                        </select>
                        <input type=\"button\" id=\"btnAgregarTipoUso\" value=\"Agregar Tipo Uso\" class=\"btnSimple agregar\">
                        <input type=\"button\" id=\"btnQuitarTipoUso\" value=\"Quitar Tipos Uso\" class=\"btnSimple agregar\">
                        <table id=\"tblTiposUso\" class=\"tabla\"></table>
                    </div>


                    <input type=\"button\" id=\"btnLiquidacionEspecial\" value=\"Liquidación Especial\" class=\"btnSimple especial\">

                    <hr class=\"limpiar\" />
                </fieldset>

                <!--Fieldset oculto para definir una liquidación especial-->
                <fieldset id=\"fieldsetLiquidacionEspecial\">
                    <legend>Liquidación Especial</legend>

                    <div class=\"campo\">
                        <label for=\"cboMunicipioSelecionado\">Municipio:</label>
                        <select id=\"cboMunicipioSelecionado\">
                        </select>
                    </div>

                    <div class=\"campo\">
                        <label for=\"cboTipoUsoSeleccionado\">Tipo Uso:</label>
                        <select id=\"cboTipoUsoSeleccionado\">
                        </select>
                    </div>

                    <div class=\"campo\">
                        <label for=\"cboEstrato\">Estrato:</label>
                        <select id=\"cboEstrato\">
                            <option value=\"-1\">Seleccione una opción</option>
                            <option value=\"1\">1</option>
                            <option value=\"2\">2</option>
                            <option value=\"3\">3</option>
                            <option value=\"4\">4</option>
                            <option value=\"5\">5</option>
                            <option value=\"6\">6</option>
                        </select>
                    </div>

                    <div class=\"campo\">
                        <label for=\"txtBarrio\">Barrio:</label>
                        <input type=\"text\" id=\"txtBarrio\" disabled=\"disabled\"/>
                        <input type=\"hidden\" id=\"txtIdBarrio\" /> 
                    </div>

                    <div class=\"campo\">
                        <label for=\"txtValorLimiteAprobado\">Valor Límite Aprobado:</label>
                        <input type=\"text\" id=\"txtValorLimiteAprobado\" />
                    </div>

                    <div class=\"campoBusqueda\">
                        <label for=\"btnBuscarSuscripcion\">Código Suscripción:</label>
                        <div style=\"margin-top: 5px;\">
                            <input type=\"text\" id=\"txtCodigoSuscripcion\" disabled=\"disabled\" />
                            <button id=\"btnBuscarSuscripcion\"></button>
                        </div>
                    </div>
                    <div> 
                        <input type=\"button\" id=\"btnAgregarLiquidacionEspecial\" value=\"Agregar Liquidación Especial\" class=\"btnSimple agregar\">
                        <input type=\"button\" id=\"btnReiniciarLiquidacionEspecial\" value=\"Reiniciar Liquidación Especial\" class=\"btnSimple\">
                    </div>
                    <table id=\"tblLiquidacionesEspeciales\" class=\"tabla\"></table>
                    <input type=\"button\" id=\"btnQuitarLiquidacionEspecial\" value=\"Quitar Liquidaciones Especiales\" class=\"btnSimple\">

                </fieldset>
            </div>
        </div>
    </div>
    <!-- Dialogos  -->
    <div id=\"divDialogoMunicipios\" style=\"display: none;\">
        <div style=\"max-height: 400px;  overflow-y: auto;\">
            <table id=\"tblMunicipiosParaSeleccionar\" class=\"tabla\"></table>
        </div>
    </div>

";
    }

    // line 300
    public function block_javascripts($context, array $blocks = array())
    {
        // line 301
        echo "    <script type=\"text/javascript\" src=\"";
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/liquidacion/gestionarLiquidacion/gestionarliquidacion.modelo.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 302
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/liquidacion/gestionarLiquidacion/gestionarliquidacion.control.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 303
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/liquidacion/gestionarLiquidacion/gestionarliquidacion.vista.js"), "html", null, true);
        echo "\"></script>
";
    }

    public function getTemplateName()
    {
        return "LlanogasLlanogasBundle:Liquidacion:gestionarLiquidacion.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  380 => 303,  376 => 302,  371 => 301,  368 => 300,  170 => 105,  159 => 103,  155 => 102,  87 => 36,  84 => 35,  78 => 33,  73 => 30,  70 => 29,  44 => 6,  40 => 5,  35 => 4,  32 => 3,);
    }
}
