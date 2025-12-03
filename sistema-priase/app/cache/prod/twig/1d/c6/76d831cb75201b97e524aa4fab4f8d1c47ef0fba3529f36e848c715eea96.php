<?php

/* LlanogasLlanogasBundle:Recaudos:consultar.html.twig */
class __TwigTemplate_1dc676d831cb75201b97e524aa4fab4f8d1c47ef0fba3529f36e848c715eea96 extends Twig_Template
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
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/recaudos/anular.estilo.css"), "html", null, true);
        echo "\" />
    <!--
    <link rel=\"stylesheet\" media=\"print\" type=\"text/css\" href=\"";
        // line 8
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/recaudos/estilo_imprimir.css"), "html", null, true);
        echo "\" />
    -->
";
    }

    // line 12
    public function block_scripts($context, array $blocks = array())
    {
        // line 13
        echo "
";
    }

    // line 16
    public function block_titulo($context, array $blocks = array())
    {
        echo "Recaudos: Consultas - ";
        echo twig_escape_filter($this->env, (isset($context["empresa"]) ? $context["empresa"] : $this->getContext($context, "empresa")), "html", null, true);
        echo "  ";
    }

    // line 18
    public function block_body($context, array $blocks = array())
    {
        // line 19
        echo "
    <div id=\"divComandos\">
        <div class=\"divBotones\">
            <input type=\"button\" value=\"buscar\" id=\"btnBuscar\" class=\"btn\" />
            <input type=\"button\" value=\"cancelar\" id=\"btnCancelar\" class=\"btn\" />
            <input type=\"button\" value=\"imprimir timbre\" id=\"btnImprimirTimbre\" class=\"btn ocultar\" />
            <input type=\"button\" value=\"imprimir\" id=\"btnImprimir\" class=\"btn ocultar\" />
        </div>
    </div>

    <div id=\"divPanelContenedor\">
        <fieldset id=\"fieldCabecera\">
            <legend>Información del Recaudo</legend>
            <div class=\"campoCorto campo-impresion-30pto\">
                <label for=\"txtIdRecaudo\">Id Recaudo:</label>
                <input type=\"text\" id=\"txtIdRecaudo\" disabled=\"disabled\" />
            </div>

            <div class=\"campoCorto campo-impresion-30pto\">
                <label for=\"txtFecha\">Fecha:</label>
                <input type=\"text\" id=\"txtFecha\" disabled=\"disabled\" />
            </div>
            <div class=\"campoCorto campo-impresion-30pto\">
                <label for=\"txtFechaOPago\">Fecha Pago:</label>
                <input type=\"text\" id=\"txtFechaPago\" disabled=\"disabled\" />
            </div>

            <div class=\"campoCorto campo-impresion-30pto\">
                <label for=\"txtValorPagado\">Valor Pagado:</label>
                <input type=\"text\" id=\"txtValorPagado\" disabled=\"disabled\" />
            </div>
            <div class=\"campoCorto campo-impresion-10pto\">
                <label for=\"txtCambio\">Cambio:</label>
                <input type=\"text\" id=\"txtCambio\" disabled=\"disabled\" />
            </div>
            <div class=\"campoCorto campo-impresion-10pto\">
                <label for=\"txtAjuste\">Ajuste:</label>
                <input type=\"text\" id=\"txtAjuste\" disabled=\"disabled\" />
            </div>
            <div class=\"campo campo-impresion-40pto\">
                <label for=\"txtMedioPago\">Medio de Pago:</label>
                <input type=\"text\" id=\"txtMedioPago\" disabled=\"disabled\" />
            </div>
            <div class=\"campo campo-impresion-30pto\">
                <label for=\"txtDocumento\">NIT/CC:</label>
                <input type=\"text\" id=\"txtDocumento\" disabled=\"disabled\" />
            </div>
            <div class=\"campo campo-impresion-50pto\">
                <label for=\"txtNombreTercero\">Nombre del Tercero:</label>
                <input type=\"text\" id=\"txtNombreTercero\" disabled=\"disabled\" />
            </div>
            <div class=\"campo campo-impresion-50pto\">
                <label for=\"txtConvenio\">Convenio:</label>
                <input type=\"text\" id=\"txtConvenio\" disabled=\"disabled\" />
            </div>

            <div class=\"campo campo-impresion-30pto\">
                <label for=\"txtClasePago\">Clase Pago:</label>
                <input type=\"text\" id=\"txtClasePago\" disabled=\"disabled\" />
            </div>
            <div class=\"campo campo-impresion-30pto\">
                <label for=\"txtSucursal\">Sucursal:</label>
                <input type=\"text\" id=\"txtSucursal\" disabled=\"disabled\" />
            </div>
            <div class=\"campo campo-impresion-50pto\">
                <label for=\"txtCifrado\">Cifrado:</label>
                <input type=\"text\" id=\"txtCifrado\" disabled=\"disabled\" />
            </div>


            <button id=\"btnVerFormasPago\" class=\"btnSimple ocultar\">Ver Formas de Pago</button>
        </fieldset>

        <div id=\"divSuscripciones\">
            <table id=\"tblSuscripciones\" class=\"tabla\"></table>
        </div>

        <div id=\"divFacturas\">
            <table id=\"tblFactura\" class=\"tabla\"></table>
        </div>

        <div id=\"divConceptos\">
            <table id=\"tblConceptos\" class=\"tabla\"></table>
        </div>
    </div>


    <div id=\"divFiltro\">
        <div class=\"campo\">
            <label for=\"txtIdRegistroFiltro\">Id Recaudo:</label>
            <input type=\"text\" id=\"txtIdRegistroFiltro\" />
        </div>
        <div class=\"campo\">
            <label for=\"txtIdSuscripcionFiltro\">Id Suscripción:</label>
            <input type=\"text\" id=\"txtIdSuscripcionFiltro\" />
        </div>
        <div class=\"campo\">
            <label for=\"txtFechaInicio\">Fecha de Inicio:</label>
            <input type=\"text\" id=\"txtFechaInicio\" />
        </div>
        <div class=\"campo\">
            <label for=\"txtFechaFin\">Fecha de Fin:</label>
            <input type=\"text\" id=\"txtFechaFin\" />
        </div>
        <div class=\"campo\">
            <label for=\"\$txtCodigoAnterior\">Código Anterior</label>
            <input type=\"text\" id=\"txtCodigoAnterior\" />
        </div>
        <p class=\"pMensaje\"></p>
        <div id=\"divResultadoFiltro\" class=\"listaSeleccion\"></div>
    </div>

    <div id=\"divFormasPago\"></div>
    <div id=\"divFormaPImprimir\" align=\"center\" style=\"display:none\">
        <table id=\"tblFormaPago\" class=\"tabla\">
            <caption>Formas de pago</caption>
            <thead><tr>
                    <th>Forma</th>
                    <th>Valor</th>
                </tr></thead>
            <tbody></tbody>
        </table>
    </div>
<!-- Iframe para el timbre -->
    <div id=\"divTimbre\" style=\"display:none;\">
        <iframe id=\"iFrameTimbre\" frameborder=\"0\" src=\"";
        // line 144
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/templates/frametimbre.html"), "html", null, true);
        echo "\"></iframe>
    </div>


";
    }

    // line 150
    public function block_javascripts($context, array $blocks = array())
    {
        // line 151
        echo "    <script type=\"text/javascript\" src=\"";
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/recaudos.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 152
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/consultar/consultar.control.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 153
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/consultar/consultar.modelo.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 154
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/consultar/consultar.vista.js"), "html", null, true);
        echo "\"></script>
";
    }

    public function getTemplateName()
    {
        return "LlanogasLlanogasBundle:Recaudos:consultar.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  226 => 154,  222 => 153,  218 => 152,  213 => 151,  210 => 150,  201 => 144,  74 => 19,  71 => 18,  63 => 16,  58 => 13,  55 => 12,  48 => 8,  43 => 6,  39 => 5,  35 => 3,  32 => 2,);
    }
}
