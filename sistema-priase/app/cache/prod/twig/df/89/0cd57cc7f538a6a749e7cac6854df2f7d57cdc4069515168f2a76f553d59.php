<?php

/* LlanogasLlanogasBundle:Recaudos:Aplicar.html.twig */
class __TwigTemplate_df890cd57cc7f538a6a749e7cac6854df2f7d57cdc4069515168f2a76f553d59 extends Twig_Template
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
    <link rel=\"stylesheet\" type=\"text/css\" href=\"";
        // line 7
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/progreso.css"), "html", null, true);
        echo "\" />

";
    }

    // line 10
    public function block_scripts($context, array $blocks = array())
    {
    }

    // line 13
    public function block_titulo($context, array $blocks = array())
    {
        echo "Aplicar Recaudos - ";
        echo twig_escape_filter($this->env, (isset($context["empresa"]) ? $context["empresa"] : $this->getContext($context, "empresa")), "html", null, true);
        echo "  ";
    }

    // line 15
    public function block_body($context, array $blocks = array())
    {
        // line 16
        echo "    <div id=\"divCabecera\">
        <fieldset id=\"fieldCabecera\" style=\"margin: 0 auto; width: 60%;\">
            <div id=\"divCamposAplicar\">
                <legend>Información Suscripción</legend>
                <div class=\"campoMitad\">
                    <label>Tipo de Suscripción</label>
                    <select id=\"cboTipoSuscripcion\">
                        <option value=\"-1\"> Seleccione una opción</option>
                        ";
        // line 24
        $context['_parent'] = (array) $context;
        $context['_seq'] = twig_ensure_traversable((isset($context["tiposSuscripcion"]) ? $context["tiposSuscripcion"] : $this->getContext($context, "tiposSuscripcion")));
        foreach ($context['_seq'] as $context["_key"] => $context["tipo"]) {
            // line 25
            echo "                            <option value=\"";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["tipo"]) ? $context["tipo"] : $this->getContext($context, "tipo")), "idtiposuscripcion"), "html", null, true);
            echo "\">";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["tipo"]) ? $context["tipo"] : $this->getContext($context, "tipo")), "tiposuscripcion"), "html", null, true);
            echo "</option>
                        ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['tipo'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 27
        echo "                    </select>
                </div>
                <div>
                    <input type=\"button\" id=\"btnAplicarRecaudos\" value=\"Aplicar Recaudos\" class=\"btnSimple\"/>
                </div>
            </div>
            <div id=\"divResumenProceso\" style=\"display: none;\">
                <div  style=\"max-height: 65vh !important; overflow: auto;\">
                    <table class=\"tabla\" id=\"tblResumen\"></table>
                </div>
            </div>
            <div id=\"divCamposProgreso\">
                <legend>Progreso de la aplicación del Recaudo</legend>
                <div id=\"divProgreso\">
                    <p>Fecha de Inicio: <span id=\"spanFecha\"> ";
        // line 41
        if (((isset($context["procesoActivo"]) ? $context["procesoActivo"] : $this->getContext($context, "procesoActivo")) != 0)) {
            echo " ";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["proceso"]) ? $context["proceso"] : $this->getContext($context, "proceso")), "fechaInicio"), "html", null, true);
            echo " ";
        }
        echo " </span></p>
                    <p>Usuario: <span id=\"spanUsuario\">  ";
        // line 42
        if (((isset($context["procesoActivo"]) ? $context["procesoActivo"] : $this->getContext($context, "procesoActivo")) != 0)) {
            echo " ";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["proceso"]) ? $context["proceso"] : $this->getContext($context, "proceso")), "usuario"), "html", null, true);
            echo " ";
        }
        echo "</span></p>
                    <p>Número de Registros Procesados: <span id=\"numeroRegistrosProcesados\" > ";
        // line 43
        if (((isset($context["procesoActivo"]) ? $context["procesoActivo"] : $this->getContext($context, "procesoActivo")) != 0)) {
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["proceso"]) ? $context["proceso"] : $this->getContext($context, "proceso")), "numeroRegistrosProcesados"), "html", null, true);
            echo " ";
        }
        echo "</span></p>
                    <progress id=\"progress\"/>
                </div>
            </div>
        </fieldset>

    </div>
";
    }

    // line 52
    public function block_javascripts($context, array $blocks = array())
    {
        // line 53
        echo "    <script type=\"text/javascript\" src=\"";
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/aplicar/aplicar.control.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 54
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/aplicar/aplicar.model.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 55
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/aplicar/aplicar.vista.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\">
    aplicarVista.init(";
        // line 57
        echo twig_escape_filter($this->env, (isset($context["procesoActivo"]) ? $context["procesoActivo"] : $this->getContext($context, "procesoActivo")), "html", null, true);
        echo ");
    </script>
";
    }

    public function getTemplateName()
    {
        return "LlanogasLlanogasBundle:Recaudos:Aplicar.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  159 => 57,  154 => 55,  150 => 54,  145 => 53,  142 => 52,  127 => 43,  119 => 42,  111 => 41,  95 => 27,  84 => 25,  80 => 24,  70 => 16,  67 => 15,  59 => 13,  54 => 10,  47 => 7,  43 => 6,  39 => 5,  35 => 3,  32 => 2,);
    }
}
