<?php

/* LlanogasLlanogasBundle:Recaudos:pagos.html.twig */
class __TwigTemplate_a64edfbedf48ca657bdf66a539b848152f9c4ac36269ed077f410899e55d9ac5 extends Twig_Template
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
        // line 4
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/theme/jquery.ui.all.css"), "html", null, true);
        echo "\" />
    <link rel=\"stylesheet\" type=\"text/css\" href=\"";
        // line 5
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
        echo "Recaudos: Pagos - ";
        echo twig_escape_filter($this->env, (isset($context["empresa"]) ? $context["empresa"] : $this->getContext($context, "empresa")), "html", null, true);
        echo "  ";
    }

    // line 16
    public function block_body($context, array $blocks = array())
    {
        // line 17
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
                                <label for=\"txtSaldoActual\">Total de Facturas:</label>
                                <input type=\"text\" id=\"txtSaldoActual\" disabled=\"disabled\" />
                            </div>
                            <div class=\"campo\">
                                <label for=\"txtNuevoSaldo\">Nuevo Saldo de Facturas:</label>
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
                    <legend>Información del Pago</legend>
                    <div class=\"campo\">
                        <label for=\"cmbMedioPago\">Medio de pago:</label>
                        ";
        // line 79
        echo (isset($context["cmbMedioPago"]) ? $context["cmbMedioPago"] : $this->getContext($context, "cmbMedioPago"));
        echo "
                    </div>
                    <div class=\"campo\">
                        <label for=\"cmbClasePago\">Clase de Pago:</label>
                        ";
        // line 83
        echo (isset($context["cmbClasePago"]) ? $context["cmbClasePago"] : $this->getContext($context, "cmbClasePago"));
        echo "<!--<select id=\"cmbClasePago\"></select>-->
                    </div>
                    <div class=\"campo\">
                        <label for=\"cmbSucursal\">Sucursal:</label>
                        ";
        // line 87
        echo (isset($context["cmbSucursal"]) ? $context["cmbSucursal"] : $this->getContext($context, "cmbSucursal"));
        echo "
                    </div>
                    <div class=\"campoBusqueda\">
                        <label for=\"btnFormaPago\">Valor y formas de Pago:</label>
                        <div style=\"margin-top: 5px;\">
                            <input type=\"text\" id=\"txtFormaPago\" disabled=\"disabled\" />
                            <button id=\"btnFormaPago\"></button>
                        </div>
                    </div>
                    <div class=\"campo\">
                        <label for=\"txtCambio\">Cambio:</label>
                        <input type=\"text\" id=\"txtCambio\" disabled=\"disabled\" />
                    </div>

                    <div class=\"campo\">
                        <label for=\"txtAjuste\">Ajuste:</label>
                        <input type=\"text\" id=\"txtAjuste\" disabled=\"disabled\" />
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

    <!-- División para los detalles de la factura -->
    <div id=\"divDetallesFactura\">
        <div class=\"campoCorto\">
            <label for=\"txtIdFactura\">Id de Factura:</label>
            <input type=\"text\" id=\"txtIdFactura\" disabled=\"disabled\" />
        </div>
        <div class=\"campoCorto\">
            <label for=\"txtNumFactura\">Número de Factura:</label>
            <input type=\"text\" id=\"txtNumFactura\" disabled=\"disabled\" />
        </div>
        <div class=\"campoCorto\">
            <label for=\"txtFechaVencimiento\">Fecha Vencimiento:</label>
            <input type=\"text\" id=\"txtFechaVencimiento\" disabled=\"disabled\" />
        </div>
        <div class=\"campoCorto\">
            <label for=\"txtTipoSuscripcion\">Tipo de Suscripción:</label>
            <input type=\"text\" id=\"txtTipoSuscripcion\" disabled=\"disabled\" />
        </div>
        <div class=\"campoCorto\">
            <label for=\"txtTipoUso\">Tipo de Uso:</label>
            <input type=\"text\" id=\"txtTipoUso\" disabled=\"disabled\" />
        </div>
        <div class=\"campoCorto\">
            <label for=\"txtTipoLiquidacion\">Tipo de Liquidación:</label>
            <input type=\"text\" id=\"txtTipoLiquidacion\" disabled=\"disabled\" />
        </div>
        <div class=\"campoCorto\">
            <label for=\"txtCicloPeriodoFactura\">Ciclo y Periodo:</label>
            <input type=\"text\" id=\"txtCicloPeriodoFactura\" disabled=\"disabled\" />
        </div>
        <div class=\"campoCorto\">
            <label for=\"txtSaldo\">Saldo:</label>
            <input type=\"text\" id=\"txtSaldo\" disabled=\"disabled\" />
        </div>
    </div>

    <!-- Confirmación de cancelación -->
    <div id=\"divConfirmCancelar\">
        <p>Se cancelará el pago ¿Desea cancelar el pago?</p>
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
        // line 182
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/templates/frametimbre.html"), "html", null, true);
        echo "\"></iframe>
    </div>

";
    }

    // line 188
    public function block_javascripts($context, array $blocks = array())
    {
        // line 189
        echo "    <script type=\"text/javascript\" src=\"";
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/recaudos.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 190
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/pagos/pagos.model.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 191
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/pagos/pagos.control.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 192
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/pagos/pagos.vista.js"), "html", null, true);
        echo "\"></script>
";
    }

    public function getTemplateName()
    {
        return "LlanogasLlanogasBundle:Recaudos:pagos.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  269 => 192,  265 => 191,  261 => 190,  256 => 189,  253 => 188,  245 => 182,  147 => 87,  140 => 83,  133 => 79,  69 => 17,  66 => 16,  58 => 14,  53 => 11,  50 => 10,  42 => 5,  38 => 4,  35 => 3,  32 => 2,);
    }
}
