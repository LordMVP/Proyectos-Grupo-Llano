<?php

/* LlanogasLlanogasBundle:Recaudos:anular.html.twig */
class __TwigTemplate_e19689a41a104d9fb9858c0aaf7d020e9481c1d89d514773858ec8a07ab4271f extends Twig_Template
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
        echo "<link rel=\"stylesheet\" type=\"text/css\" href=\"";
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/theme/jquery.ui.all.css"), "html", null, true);
        echo "\" />
<link rel=\"stylesheet\" type=\"text/css\" href=\"";
        // line 4
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/recaudos/anular.estilo.css"), "html", null, true);
        echo "\" />
<link rel=\"stylesheet\" type=\"text/css\" href=\"";
        // line 5
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/theme/jquery.datetimepicker.css"), "html", null, true);
        echo "\" />
";
    }

    // line 7
    public function block_scripts($context, array $blocks = array())
    {
    }

    // line 9
    public function block_titulo($context, array $blocks = array())
    {
        echo "Recaudos: Anular Recaudo - ";
        echo twig_escape_filter($this->env, (isset($context["empresa"]) ? $context["empresa"] : $this->getContext($context, "empresa")), "html", null, true);
        echo "  ";
    }

    // line 10
    public function block_body($context, array $blocks = array())
    {
        // line 11
        echo "
    <div id=\"divComandos\">
        <div class=\"divBotones\">
            <input type=\"button\" value=\"buscar\" id=\"btnBuscar\" class=\"btn\" />
            <input type=\"button\" value=\"grabar\" id=\"btnGrabar\" class=\"btn\" />
            <input type=\"button\" value=\"cancelar\" id=\"btnCancelar\" class=\"btn\" />
        </div>
    </div>


    <div id=\"divPanelContenedor\">
        <fieldset id=\"fieldCabecera\">
            <legend>Información del Recaudo</legend>
            <div class=\"campoCorto\">
                <label for=\"txtIdRecaudo\">ID del Recaudo:</label>
                <input type=\"text\" id=\"txtIdRecaudo\" disabled=\"disabled\" />
            </div>

            <div class=\"campoCorto\">
                <label for=\"txtFecha\">Fecha:</label>
                <input type=\"text\" id=\"txtFecha\" disabled=\"disabled\" />
            </div>

            <div class=\"campoCorto\">
                <label for=\"txtDocumento\">NIT/CC:</label>
                <input type=\"text\" id=\"txtDocumento\" disabled=\"disabled\" />
            </div>
            <div class=\"campo\">
                <label for=\"txtNombreTercero\">Nombre del Tercero:</label>
                <input type=\"text\" id=\"txtNombreTercero\" disabled=\"disabled\" />
            </div>
            <div class=\"campoCorto\">
                <label for=\"txtConvenio\">Convenio:</label>
                <input type=\"text\" id=\"txtConvenio\" disabled=\"disabled\" />
            </div>
            <button id=\"btnVerFormasPago\" class=\"btnSimple\">Ver Formas de Pago</button>
        </fieldset>
        
        <div id=\"divSuscripciones\">
            <table id=\"tblSuscripciones\" class=\"tabla\"></table>
        </div>
        
        <div id=\"divFacturas\">
            <table id=\"tblFacturas\" class=\"tabla\"></table>
        </div>
        
    </div>


<div id=\"divFiltro\">
    <div>
        <div class=\"campo\">
            <label for=\"txtIdRegistroFiltro\">Id Recaudo:</label>
            <input type=\"text\" id=\"txtIdRegistroFiltro\" />
        </div>
        <div class=\"campo\">
            <label for=\"txtIdSuscripcionFiltro\">Id Suscripción:</label>
            <input type=\"text\" id=\"txtIdSuscripcionFiltro\" />
        </div>
        <div class=\"campo\">
            <label for=\"txtIdSuscriptorFiltro\">Id Suscriptor:</label>
            <input type=\"text\" id=\"txtIdSuscriptorFiltro\" />
        </div>
        <div class=\"campo\">
            <label for=\"txtCodAnteriorFiltro\">Cód Anterior:</label>
            <input type=\"text\" id=\"txtCodAnteriorFiltro\" />
        </div>
        <div class=\"campo\">
            <label for=\"txtFechaInicio\">Fecha de Inicio:</label>
            <input type=\"text\" id=\"txtFechaInicio\" />
        </div>
        <div class=\"campo\">
            <label for=\"txtFechaFin\">Fecha de Fin:</label>
            <input type=\"text\" id=\"txtFechaFin\" />
        </div>
    </div>
    <p class=\"pMensaje\"></p>
    <div id=\"divResultadoFiltro\" class=\"listaSeleccion\"></div>
</div>

<div id=\"divMotivos\">
    <label for=\"cmbMotivo\">Motivo de la anulación:</label>
    ";
        // line 93
        echo (isset($context["cmbMotivos"]) ? $context["cmbMotivos"] : $this->getContext($context, "cmbMotivos"));
        echo "
    <label for=\"txtObservacion\">Observaciones:</label>
    <textarea id=\"txtObservacion\"></textarea>
</div>

<div id=\"divFormasPago\">
    
</div>

";
    }

    // line 104
    public function block_javascripts($context, array $blocks = array())
    {
        // line 105
        echo "<script type=\"text/javascript\" src=\"";
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/anular/anular.control.js"), "html", null, true);
        echo "\"></script>
<script type=\"text/javascript\" src=\"";
        // line 106
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/anular/anular.modelo.js"), "html", null, true);
        echo "\"></script>
<script type=\"text/javascript\" src=\"";
        // line 107
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/anular/anular.vista.js"), "html", null, true);
        echo "\"></script>
";
    }

    public function getTemplateName()
    {
        return "LlanogasLlanogasBundle:Recaudos:anular.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  176 => 107,  172 => 106,  167 => 105,  164 => 104,  150 => 93,  66 => 11,  63 => 10,  55 => 9,  50 => 7,  44 => 5,  40 => 4,  35 => 3,  32 => 2,);
    }
}
