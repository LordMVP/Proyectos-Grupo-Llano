<?php

/* LlanogasLlanogasBundle:Recaudos:anticipos.html.twig */
class __TwigTemplate_1242a63a58338b313c7a4a176a7a80f1b48a7d806bde3f8b567b97f30f5e924b extends Twig_Template
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
        // line 4
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/recaudos/anticipos.estilo.css"), "html", null, true);
        echo "\" />
";
    }

    // line 6
    public function block_scripts($context, array $blocks = array())
    {
        // line 7
        echo "
";
    }

    // line 9
    public function block_titulo($context, array $blocks = array())
    {
        echo "Recaudos: Anticipos - ";
        echo twig_escape_filter($this->env, (isset($context["empresa"]) ? $context["empresa"] : $this->getContext($context, "empresa")), "html", null, true);
        echo "  ";
    }

    // line 10
    public function block_body($context, array $blocks = array())
    {
        // line 11
        echo "    <div id=\"divComandos\">
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
                    <div>
                        <input type=\"button\" value=\"Agregar Anticipo\" id=\"btnAgregarAnticipo\" class=\"btnSimple\" />
                    </div>
                    <div id=\"divConceptos\">
                        <table id=\"tblAnticipo\" class=\"tabla\"></table>
                        <div>
                            <label for=\"txtSumatoriaAnticipos\">Total Anticipo</label>
                            <input type=\"text\" id=\"txtSumatoriaAnticipos\" disabled=\"disabled\" />
                        </div>
                    </div>
                </div>
            </div>
            <div class=\"divDerecha\">
                <fieldset>
                    <legend>Información del Anticipo</legend>

                    <div class=\"campo\">
                        <label for=\"cmbMedioPago\">Medio de pago:</label>
                        ";
        // line 61
        echo (isset($context["cmbMedioPago"]) ? $context["cmbMedioPago"] : $this->getContext($context, "cmbMedioPago"));
        echo "
                    </div>
                    <div class=\"campo\">
                        <label for=\"cmbClasePago\">Clase de Pago:</label>
                        ";
        // line 65
        echo (isset($context["cmbClasePago"]) ? $context["cmbClasePago"] : $this->getContext($context, "cmbClasePago"));
        echo "
                    </div>
                    <div class=\"campo\">
                        <label for=\"cmbSucursal\">Sucursal</label>
                        ";
        // line 69
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
    <hr class=\"limpiar\" />


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
        <p>Se eliminará el anticipo ¿Desea continuar?</p>
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


    <!-- Division de adicion de anticipo -->
    <div id=\"divAnticipo\" style=\"display: none;\">
        <div class=\"campo\">
            <label for=\"cmbTipoDocumento\">Tipo de Documento:</label>
            <select id=\"cmbTipoDocumento\"></select>
        </div>
        <div class=\"campo\">
            <label for=\"cmbDocumentos\">Documentos:</label>
            <select id=\"cmbDocumentos\"></select>
        </div>
        <div class=\"campo\">
            <label for=\"cmbTipoLiquidacion\">Tipo de Liquidación:</label>
            <select id=\"cmbTipoLiquidacion\"></select>
        </div>
        <div class=\"campo\">
            <label for=\"cmbConcepto\">Concepto:</label>
            <select id=\"cmbConcepto\"></select>
        </div>
        <div class=\"campo\">
            <label for=\"cmbPeriodos\">Periodos:</label>
            <select id=\"cmbPeriodos\"></select>
        </div>
        <div class=\"campo\">
            <label for=\"txtValorAnticipo\">Valor:</label>
            <input type=\"text\" id=\"txtValorAnticipo\" />
        </div>
        <p class=\"pMensaje\"></p>
    </div>

    <!-- Iframe para el timbre -->
    <div id=\"divTimbre\" style=\"display:none;\">
        <iframe id=\"iFrameTimbre\" frameborder=\"0\" src=\"";
        // line 158
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/templates/frametimbre.html"), "html", null, true);
        echo "\"></iframe>
    </div>

";
    }

    // line 163
    public function block_javascripts($context, array $blocks = array())
    {
        // line 164
        echo "    <script type=\"text/javascript\" src=\"";
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/recaudos.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 165
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/anticipos/anticipos.control.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 166
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/anticipos/anticipos.model.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 167
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/anticipos/anticipos.vista.js"), "html", null, true);
        echo "\"></script>
";
    }

    public function getTemplateName()
    {
        return "LlanogasLlanogasBundle:Recaudos:anticipos.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  247 => 167,  243 => 166,  239 => 165,  234 => 164,  231 => 163,  223 => 158,  131 => 69,  124 => 65,  117 => 61,  65 => 11,  62 => 10,  54 => 9,  49 => 7,  46 => 6,  40 => 4,  35 => 3,  32 => 2,);
    }
}
