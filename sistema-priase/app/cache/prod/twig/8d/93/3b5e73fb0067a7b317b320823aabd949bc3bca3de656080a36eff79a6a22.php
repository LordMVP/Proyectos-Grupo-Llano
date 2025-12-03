<?php

/* LlanogasLlanogasBundle:Recaudos:trasladar_recaudo.html.twig */
class __TwigTemplate_8d933b5e73fb0067a7b317b320823aabd949bc3bca3de656080a36eff79a6a22 extends Twig_Template
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
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/recaudos/pagos.estilo.css"), "html", null, true);
        echo "\" />
";
    }

    // line 6
    public function block_scripts($context, array $blocks = array())
    {
    }

    // line 8
    public function block_titulo($context, array $blocks = array())
    {
        echo "Trasladar Recaudos - ";
        echo twig_escape_filter($this->env, (isset($context["empresa"]) ? $context["empresa"] : $this->getContext($context, "empresa")), "html", null, true);
        echo "  ";
    }

    // line 9
    public function block_body($context, array $blocks = array())
    {
        // line 10
        echo "<div id=\"divComandos\">
    <div class=\"divBotones\">
        <input type=\"button\" value=\"buscar\" id=\"btnMostrarFiltroRecaudos\" class=\"btn\" />
        <input type=\"button\" value=\"grabar\" id=\"btnGrabar\" class=\"btn\" />
        <input type=\"button\" value=\"cancelar\" id=\"btnCancelar\" class=\"btn\" />
    </div>
</div>

<div id=\"divPanelContenedor\">
    <fieldset>
        <legend>Información del Recaudo</legend>
        
        <div>
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
            <div class=\"campoCorto\">
                <label for=\"txtValorTotal\">Total Recaudo:</label>
                <input type=\"text\" id=\"txtValorTotal\" disabled=\"disabled\" />
            </div>

            <button id=\"btnVerFormasPago\" class=\"btnSimple\">Ver Formas de Pago</button>  
        </div>
    </fieldset>

    <div id=\"divSuscripciones\">
        <table id=\"tblSuscripciones\" class=\"tabla\"></table>
        <table id=\"tblFacturas\" class=\"tabla\"></table>
    </div>

    <fieldset>
        <legend>Suscripción de Destino</legend>
        <div class=\"campoBusqueda\">
            <label for=\"txtIdSuscripcionDestino\">Id Suscriptor:</label>
            <input type=\"text\" id=\"txtIdSuscripcionDestino\" disabled=\"disabled\" />    
            <button id=\"btnSuscripcion\" title=\"Buscar Suscripción Destino\"></button>
        </div>

        <div class=\"campo\">
            <label for=\"txtSuscriptorDestino\">Nombre Suscriptor:</label>
            <input type=\"text\" id=\"txtSuscriptorDestino\" disabled=\"disabled\" />
        </div>
        
        <div class=\"campo\">
            <label for=\"txtDocSuscriptor\">Documento:</label>
            <input type=\"text\" id=\"txtDocSuscriptor\" disabled=\"disabled\" />
        </div>
        
        <div style=\"margin-right:20px;\">
            <table id=\"tblSuscripcionesTransferir\" class=\"tabla\"></table>
            <div class=\"campo\">
                <label for=\"txtTotalDestino\">Total Asignado:</label>
                <input type=\"text\" id=\"txtTotalDestino\" disabled=\"disabled\" />
            </div>
        </div>
        
    </fieldset>
</div>

      
<div id=\"divFiltro\" style=\"display:none;\">
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
    </div>
    <div>
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
    <button id=\"btnBuscarRecaudo\" class=\"btnSimple\">Buscar</button>
    <div id=\"divResultadoFiltro\" class=\"listaSeleccion\"></div>
</div>

<div id=\"divMotivos\" style=\"display:none;\">
    <label for=\"cmbMotivo\">Motivo de la anulación:</label>
    ";
        // line 121
        echo (isset($context["cmbMotivos"]) ? $context["cmbMotivos"] : $this->getContext($context, "cmbMotivos"));
        echo "
    <label for=\"txtObservacion\">Observaciones:</label>
    <textarea id=\"txtObservacion\"></textarea>
</div>

<div id=\"divFormasPago\" style=\"display:none;\">
    
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

<!--División para alerta -->

<div id=\"divAlertaTotales\" style=\"display:none;\">
    <p>
        La sumatoria de valores asignados a las suscripciones de destino,debe ser igual al valor del recaudo. <br>
        <strong>Valor Esperado: </strong> <span id=\"spanEsperado\"></span> - <strong>Valor Recibido: </strong> <span id=\"spanRecibido\"></span>
    </p>
</div>


";
    }

    // line 161
    public function block_javascripts($context, array $blocks = array())
    {
        // line 162
        echo "<script type=\"text/javascript\" src=\"";
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/recaudos.js"), "html", null, true);
        echo "\"></script>
<script type=\"text/javascript\" src=\"";
        // line 163
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/traslado/traslado.model.js"), "html", null, true);
        echo "\"></script>
<script type=\"text/javascript\" src=\"";
        // line 164
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/traslado/traslado.control.js"), "html", null, true);
        echo "\"></script>
<script type=\"text/javascript\" src=\"";
        // line 165
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/traslado/traslado.vista.js"), "html", null, true);
        echo "\"></script>
";
    }

    public function getTemplateName()
    {
        return "LlanogasLlanogasBundle:Recaudos:trasladar_recaudo.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  233 => 165,  229 => 164,  225 => 163,  220 => 162,  217 => 161,  175 => 121,  62 => 10,  59 => 9,  51 => 8,  46 => 6,  40 => 4,  35 => 3,  32 => 2,);
    }
}
