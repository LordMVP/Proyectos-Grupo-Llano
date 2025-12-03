<?php

/* LlanogasLlanogasBundle:Recaudos:abonos.html.twig */
class __TwigTemplate_5e36c8f05509a1c981f24742d1f3796f32e1e2efb6e0ca169d80963e267838b2 extends Twig_Template
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
        echo "

    <link rel=\"stylesheet\" type=\"text/css\" href=\"";
        // line 5
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/theme/jquery.ui.all.css"), "html", null, true);
        echo "\" />
    <link rel=\"stylesheet\" type=\"text/css\" href=\"";
        // line 6
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/recaudos/abonos.estilo.css"), "html", null, true);
        echo "\" />

";
    }

    // line 10
    public function block_scripts($context, array $blocks = array())
    {
        // line 11
        echo "
";
    }

    // line 14
    public function block_titulo($context, array $blocks = array())
    {
        echo "Recaudos: Abonos - ";
        echo twig_escape_filter($this->env, (isset($context["empresa"]) ? $context["empresa"] : $this->getContext($context, "empresa")), "html", null, true);
        echo "  ";
    }

    // line 15
    public function block_body($context, array $blocks = array())
    {
        // line 16
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
                    <div class=\"campoCorto\">
                        <label for=\"txtIdSuscriptor\">Suscriptor:</label>
                        <input type=\"text\" id=\"txtIdSuscriptor\" disabled=\"disabled\" />
                    </div>

                    <div class=\"campo\">
                        <label for=\"txtNombre\">Nombre:</label>
                        <input type=\"text\" id=\"txtNombre\" disabled=\"disabled\" />
                    </div>

                    <div class=\"campoCorto\">
                        <label for=\"txtDocumento\">NIT/CC:</label>
                        <input type=\"text\" id=\"txtDocumento\" disabled=\"disabled\" />
                    </div>
                    <div class=\"campo\">
                        <label for=\"txtConvenio\">Convenio:</label>
                        <input type=\"text\" id=\"txtConvenio\" disabled=\"disabled\" />
                    </div>
                </fieldset>
                <div id=\"divDetalles\">
                    <table id=\"tblSuscripciones\" class=\"tabla\"></table>
                    <button id=\"btnCargarFacturas\" class=\"btnSimple\">Cargar Facturas</button>
                    <div id=\"divFacturas\">
                        <table id=\"tblFacturas\" class=\"tabla\"></table>

                        <div>
                            <div class=\"campo\">
                                <label for=\"txtSaldoActual\">Saldo Actual:</label>
                                <input type=\"text\" id=\"txtSaldoActual\" disabled=\"disabled\" />
                            </div>
                            <div class=\"campo\">
                                <label for=\"txtTotalFacturasSeleccionadas\">Total Facturas Seleccionadas:</label>
                                <input type=\"text\" id=\"txtTotalFacturasSeleccionadas\" disabled=\"disabled\" />
                            </div>
                            <div class=\"campo\">
                                <label for=\"txtNuevoSaldo\">Nuevo Saldo:</label>
                                <input type=\"text\" id=\"txtNuevoSaldo\" disabled=\"disabled\" />
                            </div>
                        </div>

                        <table id=\"tblConceptos\" class=\"tabla\">
                        </table>
                    </div>
                </div>
            </div>
            <div class=\"divDerecha\">
                <fieldset>
                    <legend>Información del Abono</legend>
                    <div class=\"campo\">
                        <label for=\"cmbMedioPago\">Medio de pago:</label>
                        ";
        // line 82
        echo (isset($context["cmbMedioPago"]) ? $context["cmbMedioPago"] : $this->getContext($context, "cmbMedioPago"));
        echo "
                    </div>
                    <div class=\"campo\">
                        <label for=\"cmbClasePago\">Clase de Pago:</label>
                        ";
        // line 86
        echo (isset($context["cmbClasePago"]) ? $context["cmbClasePago"] : $this->getContext($context, "cmbClasePago"));
        echo "
                    </div>
                    <div class=\"campo\">
                        <label for=\"cmbSucursal\">Sucursal</label>
                        ";
        // line 90
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
        <p>Se eliminará el abono ¿Desea continuar?</p>
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
        // line 147
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/templates/frametimbre.html"), "html", null, true);
        echo "\"></iframe>
    </div>

";
    }

    // line 152
    public function block_javascripts($context, array $blocks = array())
    {
        // line 153
        echo "    <script type=\"text/javascript\" src=\"";
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/recaudos.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 154
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/abonos/abonos.control.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 155
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/abonos/abonos.model.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 156
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/abonos/abonos.vista.js"), "html", null, true);
        echo "\"></script>
";
    }

    public function getTemplateName()
    {
        return "LlanogasLlanogasBundle:Recaudos:abonos.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  235 => 156,  231 => 155,  227 => 154,  222 => 153,  219 => 152,  211 => 147,  151 => 90,  144 => 86,  137 => 82,  69 => 16,  66 => 15,  58 => 14,  53 => 11,  50 => 10,  43 => 6,  39 => 5,  35 => 3,  32 => 2,);
    }
}
