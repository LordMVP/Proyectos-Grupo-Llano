<?php

/* LlanogasLlanogasBundle:Recaudos:cartera_castigada.html.twig */
class __TwigTemplate_d890547619932988c441684f907def1bdc8c7340ef959495e1612ba7c95f737f extends Twig_Template
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
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/theme/jquery.ui.all.css"), "html", null, true);
        echo "\" />
    
    <link rel=\"stylesheet\" type=\"text/css\" href=\"";
        // line 5
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/recaudos/abonos.estilo.css"), "html", null, true);
        echo "\" />
";
    }

    // line 8
    public function block_scripts($context, array $blocks = array())
    {
        // line 9
        echo "
";
    }

    // line 12
    public function block_titulo($context, array $blocks = array())
    {
        echo "Recaudos: Cartera Castigada - ";
        echo twig_escape_filter($this->env, (isset($context["empresa"]) ? $context["empresa"] : $this->getContext($context, "empresa")), "html", null, true);
        echo "  ";
    }

    // line 14
    public function block_body($context, array $blocks = array())
    {
        // line 15
        echo "

    <div id=\"divComandos\">
        <div class=\"divBotones\">
            <input type=\"button\" value=\"nuevo\" id=\"btnNuevo\" class=\"btn\" />
            <input type=\"button\" value=\"grabar\" id=\"btnGrabar\" class=\"btn\" />
            <input type=\"button\" value=\"imprimir\" id=\"btnImprimir\" class=\"btn\" style=\"display:none;\" />
            <input type=\"button\" value=\"cancelar\" id=\"btnCancelar\" class=\"btn\" />
        </div>
    </div>

    <div id=\"divPanelContenedor\">
        <div id=\"divCabecera\">
            <div class=\"divIzquierda\">
                <fieldset>
                    <legend>Información del Suscriptor</legend>

                    <div class=\"campo\">
                        <label for=\"txtIdSuscriptor\">Suscriptor:</label>
                        <input type=\"text\" id=\"txtIdSuscriptor\" disabled=\"disabled\" />
                    </div>

                    <div class=\"campo\">
                        <label for=\"txtNombre\">Nombre:</label>
                        <input type=\"text\" id=\"txtNombre\" disabled=\"disabled\" />
                    </div>

                    <div class=\"campo\">
                        <label for=\"txtDocumento\">NIT/CC:</label>
                        <input type=\"text\" id=\"txtDocumento\" disabled=\"disabled\" />
                    </div>
                </fieldset>

                <div id=\"divDetalles\">
                    <table id=\"tblSuscripciones\" class=\"tabla\"></table>
                    <button id=\"btnCargarFacturas\" class=\"btnSimple\">Cargar Facturas</button>
                    <div id=\"divFacturas\">
                        <table id=\"tblFacturas\" class=\"tabla\"></table>

                        <div>
                            <div class=\"campo\">
                                <label for=\"txtSaldoActual\">Saldo Actual: </label>
                                <input type=\"text\" id=\"txtSaldoActual\" disabled=\"disabled\" />
                            </div>
                            <div class=\"campo\">
                                <label for=\"txtNuevoSaldo\">Nuevo Saldo: </label>
                                <input type=\"text\" id=\"txtNuevoSaldo\" disabled=\"disabled\" />
                            </div>
                        </div>

                        <table id=\"tblConceptos\" class=\"tabla\"></table>
                    </div>
                </div>
            </div>
            <div class=\"divDerecha\">
                <fieldset>
                    <legend>Recaudo</legend>
                    <div class=\"campo\">
                        <label for=\"txtMedioPago\">Medio de Pago:</label>
                        ";
        // line 74
        echo (isset($context["cmbMedioPago"]) ? $context["cmbMedioPago"] : $this->getContext($context, "cmbMedioPago"));
        echo "
                    </div>

                    <div class=\"campo\">
                        <label for=\"txtMedioPago\">Clase de Pago:</label>
                        ";
        // line 79
        echo (isset($context["cmbClasePago"]) ? $context["cmbClasePago"] : $this->getContext($context, "cmbClasePago"));
        echo "
                    </div>
                    <div class=\"campo\">
                        <label for=\"cmbSucursal\">Sucursal: </label>
                        ";
        // line 83
        echo (isset($context["cmbSucursal"]) ? $context["cmbSucursal"] : $this->getContext($context, "cmbSucursal"));
        echo "
                    </div>
                    <div class=\"campoBusqueda\">
                        <label for=\"btnFormaPago\">Valor y formas de Pago:</label>
                        <input type=\"text\" id=\"txtFormaPago\" disabled=\"disabled\" />
                        <button id=\"btnFormaPago\"></button>
                    </div>
                    <div class=\"campo\">
                        <label for=\"txtCambio\">Cambio:</label>
                        <input type=\"text\" id=\"txtCambio\" disabled=\"disabled\">
                    </div>
                    <div class=\"campo\">
                        <label for=\"txtAjuste\">Ajuste:</label>
                        <input type=\"text\" id=\"txtAjuste\" disabled=\"disabled\">
                    </div>
                </fieldset>
            </div>
        </div>
    </div>



    <!-- Division para filtro -->
    <div id=\"camposBuscarSuscripcion\" style=\"display:none;\" >
        <div class=\"campo\">
            <label for=\"txtFiltroSus\">Suscripción:</label>
            <input type=\"text\" id=\"txtFiltroSus\" data-attr=\"suscripcion\" maxlength=\"15\" />
        </div>
        <div class=\"campo\">
            <label for=\"txtFiltroDoc\">Cédula/NIT:</label>
            <input type=\"text\" id=\"txtFiltroDoc\" data-attr=\"documento\" maxlength=\"20\" />
        </div>
        <div class=\"campo\">
            <label for=\"txtFiltroCodAnt\">Código Anterior:</label>
            <input type=\"text\" id=\"txtFiltroCodAnt\" data-attr=\"codAnterior\" maxlength=\"30\" />
        </div>
        <span id=\"spanMensaje\" class=\"pMensaje\"></span>
        <button id=\"btnBuscar\" class=\"btnSimple\">Buscar</button>
    </div>

    <!-- Confirmación de cancelación -->
    <div id=\"divConfirmCancelar\">
        <p>Se cancelará el pago actual ¿Desea continuar con la cancelación?</p>
    </div>

    <!-- Division de Formas de pago -->
    <div id=\"divFormasPago\" style=\"display: none;\">
        <div id=\"controlesFormasPago\" style=\"max-height: 350px;overflow-y: scroll;\"></div>
        <div style=\"margin-top: 15px;\">
            <button id=\"btnAgregarForma\" class=\"btnSimple\">Agregar Forma</button>
            <label for=\"txtSumatoria\" style=\"display:inline !important;\">Total:</label>
            <input type=\"text\" id=\"txtSumatoria\" disabled=\"disabled\" />
        </div>
    </div>

    <!-- Iframe para el timbre -->
    <div id=\"divTimbre\" style=\"display:none;\">
        <iframe id=\"iFrameTimbre\" frameborder=\"0\" src=\"";
        // line 140
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/templates/frametimbre.html"), "html", null, true);
        echo "\"></iframe>
    </div>

";
    }

    // line 146
    public function block_javascripts($context, array $blocks = array())
    {
        // line 147
        echo "    <script type=\"text/javascript\" src=\"";
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/recaudos.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 148
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/cartera_castigada/carteracast.model.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 149
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/cartera_castigada/carteracast.control.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 150
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/cartera_castigada/carteracast.vista.js"), "html", null, true);
        echo "\"></script>
";
    }

    public function getTemplateName()
    {
        return "LlanogasLlanogasBundle:Recaudos:cartera_castigada.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  226 => 150,  222 => 149,  218 => 148,  213 => 147,  210 => 146,  202 => 140,  142 => 83,  135 => 79,  127 => 74,  66 => 15,  63 => 14,  55 => 12,  50 => 9,  47 => 8,  41 => 5,  35 => 3,  32 => 2,);
    }
}
