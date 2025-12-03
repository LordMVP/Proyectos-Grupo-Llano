<?php

/* LlanogasLlanogasBundle:Recaudos:Devoluciones.html.twig */
class __TwigTemplate_b752eff17bd06de7714d8a6afec06b8c1125672a42053499ca4d56d150620cc3 extends Twig_Template
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
        echo "Recaudos: Devoluciones - ";
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
            <input type=\"button\" value=\"cancelar\" id=\"btnCancelar\" class=\"btn\" />
        </div>
    </div>

    <div id=\"divPanelContenedor\">
        <div id=\"divCabecera\">
            <fieldset>
                <legend>Información del suscriptor</legend>

                <div class=\"campoCorto\">
                    <label for=\"txtIdSuscripcion\">Id Suscripción:</label>
                    <input type=\"text\" id=\"txtIdSuscripcion\" disabled=\"disabled\" />
                </div>
                <div class=\"campo\">
                    <label for=\"txtSuscripcion\">Suscripción:</label>
                    <input type=\"text\" id=\"txtSuscripcion\" disabled=\"disabled\" />
                </div>
                <div class=\"campo\">
                    <label for=\"txtDocumento\">NIT/CC:</label>
                    <input type=\"text\" id=\"txtDocumento\" disabled=\"disabled\" />
                </div>

                <div class=\"campo\">
                    <label for=\"txtCodigoAnterior\">Cód. Anterior:</label>
                    <input type=\"text\" id=\"txtCodigoAnterior\" disabled=\"disabled\" />
                </div>
                <div class=\"campo\">
                    <label for=\"txtNombre\">Nombre:</label>
                    <input type=\"text\" id=\"txtNombre\" disabled=\"disabled\" />
                </div>

            </fieldset>
            <div>
                <table id=\"tblDevoluciones\" class=\"tabla\"></table>
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
    <!-- División para completar información de la devolución-->
    <div id=\"divDetallesDevolucion\" style=\"display:none;\">
        <label for=\"cmbMotivoNota\">Motivos:</label>
        <select id=\"cboMotivoNota\">
            <option value=\"-1\"> Seleccione una opción</option>
            ";
        // line 82
        $context['_parent'] = (array) $context;
        $context['_seq'] = twig_ensure_traversable((isset($context["motivos"]) ? $context["motivos"] : $this->getContext($context, "motivos")));
        foreach ($context['_seq'] as $context["_key"] => $context["motivo"]) {
            // line 83
            echo "                <option value=\"";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["motivo"]) ? $context["motivo"] : $this->getContext($context, "motivo")), "idmotivo"), "html", null, true);
            echo "\">";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["motivo"]) ? $context["motivo"] : $this->getContext($context, "motivo")), "nombre"), "html", null, true);
            echo "</option>
            ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['motivo'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 85
        echo "        </select>
        <div>
            <label for=\"txtObservaciones\">Observaciones:</label>
            <textarea id=\"txtObservaciones\"></textarea>
        </div>
        <span class=\"pMensaje\" id=\"pMensajeGrabar\"></span>
    </div>
    
    <!-- Confirmación de cancelación -->
    <div id=\"divConfirmCancelar\">
        <p>Se cancelará la devolución ¿Desea continuar?</p>
    </div>
    <!-- Dialogo para mostrar detalles de una devolución-->
    <div id=\"divDetallesDevolucionDialog\" style=\"display:none;\">
        <table class=\"tabla\" id=\"tblDetalleFactura\"></table>
        <table class=\"tabla\" id=\"tblDetalleRecaudo\"></table>
    </div>

";
    }

    // line 105
    public function block_javascripts($context, array $blocks = array())
    {
        // line 106
        echo "
    <script type=\"text/javascript\" src=\"";
        // line 107
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/recaudos.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 108
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/devoluciones/devoluciones.control.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 109
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/devoluciones/devoluciones.modelo.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 110
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/devoluciones/devoluciones.vista.js"), "html", null, true);
        echo "\"></script>
";
    }

    public function getTemplateName()
    {
        return "LlanogasLlanogasBundle:Recaudos:Devoluciones.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  191 => 110,  187 => 109,  183 => 108,  179 => 107,  176 => 106,  173 => 105,  151 => 85,  140 => 83,  136 => 82,  69 => 17,  66 => 16,  58 => 14,  53 => 11,  50 => 10,  43 => 6,  39 => 5,  35 => 3,  32 => 2,);
    }
}
