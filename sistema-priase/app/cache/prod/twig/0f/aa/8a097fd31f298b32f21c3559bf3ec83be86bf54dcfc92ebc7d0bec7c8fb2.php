<?php

/* LlanogasLlanogasBundle:Recaudos:ProcesoCerrarRecaudos.html.twig */
class __TwigTemplate_0faa8a097fd31f298b32f21c3559bf3ec83be86bf54dcfc92ebc7d0bec7c8fb2 extends Twig_Template
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
        echo "

    <link rel=\"stylesheet\" type=\"text/css\" href=\"";
        // line 6
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/theme/jquery.ui.all.css"), "html", null, true);
        echo "\" />
    <link rel=\"stylesheet\" type=\"text/css\" href=\"";
        // line 7
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/recaudos/abonos.estilo.css"), "html", null, true);
        echo "\" />
    <link rel=\"stylesheet\" type=\"text/css\" href=\"";
        // line 8
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/progreso.css"), "html", null, true);
        echo "\" />

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
        echo "Proceso Cerrar Recaudos - ";
        echo twig_escape_filter($this->env, (isset($context["empresa"]) ? $context["empresa"] : $this->getContext($context, "empresa")), "html", null, true);
        echo "  ";
    }

    // line 18
    public function block_body($context, array $blocks = array())
    {
        // line 19
        echo "    <div id=\"divCabecera\">
        <fieldset id=\"fieldCabecera\" style=\"margin: 0 auto; width: 60%;\">
            <div id=\"divCamposCierre\">
                <legend>Información Suscripción</legend>
                <div style=\"margin: 0 auto; width: 60%;\" >
                    <label>Ciclo</label>
                    <select id=\"cmbCiclo\">
                        <option value=\"-1\"> Seleccione una opción </option>
                        ";
        // line 27
        $context['_parent'] = (array) $context;
        $context['_seq'] = twig_ensure_traversable((isset($context["ciclos"]) ? $context["ciclos"] : $this->getContext($context, "ciclos")));
        foreach ($context['_seq'] as $context["_key"] => $context["ciclo"]) {
            // line 28
            echo "                            <option value=\"";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["ciclo"]) ? $context["ciclo"] : $this->getContext($context, "ciclo")), "idciclo"), "html", null, true);
            echo "\">";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["ciclo"]) ? $context["ciclo"] : $this->getContext($context, "ciclo")), "ciclo"), "html", null, true);
            echo "</option>
                        ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['ciclo'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 30
        echo "                    </select>
                    <div>
                        <input type=\"button\" id=\"btnAplicarRecaudos\" value=\"Aplicar Recaudos\" class=\"btnSimple\"/>
                    </div>
                </div>
            </div>
                    
            <div id=\"divResumenProceso\" style=\"display:none;\">
                <div style=\"max-height: 65vh; overflow: auto\">
                    <table class=\"tabla\" id=\"tblResumen\"></table>
                </div>
            </div>
            
            <div id=\"divCamposProgreso\">
                <legend>Progreso de la aplicación del Recaudo</legend>
                <div id=\"divProgreso\">
                    <p>Fecha de Inicio: ";
        // line 46
        if (((isset($context["procesoActivo"]) ? $context["procesoActivo"] : $this->getContext($context, "procesoActivo")) != 0)) {
            echo " ";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["proceso"]) ? $context["proceso"] : $this->getContext($context, "proceso")), "fechaInicio"), "html", null, true);
            echo "  ";
        }
        echo "</p>
                    <p>Usuario: ";
        // line 47
        if (((isset($context["procesoActivo"]) ? $context["procesoActivo"] : $this->getContext($context, "procesoActivo")) != 0)) {
            echo " ";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["proceso"]) ? $context["proceso"] : $this->getContext($context, "proceso")), "usuario"), "html", null, true);
            echo "  ";
        }
        echo "</p>
                    <p>Número de Registros Procesados: <span id=\"numeroRegistrosProcesados\" > ";
        // line 48
        if (((isset($context["procesoActivo"]) ? $context["procesoActivo"] : $this->getContext($context, "procesoActivo")) != 0)) {
            echo " ";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["proceso"]) ? $context["proceso"] : $this->getContext($context, "proceso")), "numeroRegistrosProcesados"), "html", null, true);
            echo "  ";
        }
        echo "</span></p>
                    <progress id=\"progress\"/>
                </div>
            </div>

        </fieldset>
            

    </div>
";
    }

    // line 59
    public function block_javascripts($context, array $blocks = array())
    {
        // line 60
        echo "    <script type=\"text/javascript\" src=\"";
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/proceso_cerrar/cerrar.control.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 61
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/proceso_cerrar/cerrar.model.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 62
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/proceso_cerrar/cerrar.vista.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\">
        cerrarVista.init(";
        // line 64
        echo twig_escape_filter($this->env, (isset($context["procesoActivo"]) ? $context["procesoActivo"] : $this->getContext($context, "procesoActivo")), "html", null, true);
        echo ");
    </script>
";
    }

    public function getTemplateName()
    {
        return "LlanogasLlanogasBundle:Recaudos:ProcesoCerrarRecaudos.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  167 => 64,  162 => 62,  158 => 61,  153 => 60,  150 => 59,  132 => 48,  124 => 47,  116 => 46,  98 => 30,  87 => 28,  83 => 27,  73 => 19,  70 => 18,  62 => 16,  57 => 13,  54 => 12,  47 => 8,  43 => 7,  39 => 6,  35 => 4,  32 => 3,);
    }
}
