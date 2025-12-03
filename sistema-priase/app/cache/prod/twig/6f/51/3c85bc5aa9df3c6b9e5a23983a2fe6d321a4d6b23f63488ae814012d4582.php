<?php

/* LlanogasLlanogasBundle:Cartera:GenerarGestionCartera.html.twig */
class __TwigTemplate_6f513c85bc5aa9df3c6b9e5a23983a2fe6d321a4d6b23f63488ae814012d4582 extends Twig_Template
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
        echo "    <link rel=\"stylesheet\" type=\"text/css\" href=\"";
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/theme/jquery.ui.all.css"), "html", null, true);
        echo "\" />
    <link media=\"screen\" type=\"text/css\" rel=\"stylesheet\" href=\"";
        // line 5
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/facturacion/dataTables.css"), "html", null, true);
        echo "\"  />
    <link rel=\"stylesheet\" type=\"text/css\" href=\"";
        // line 6
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/cartera/financiacion.css"), "html", null, true);
        echo "\" />
";
    }

    // line 9
    public function block_scripts($context, array $blocks = array())
    {
        // line 10
        echo "
";
    }

    // line 12
    public function block_titulo($context, array $blocks = array())
    {
        echo "Cartera: Generar Gestión de Cartera - ";
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
            <input type=\"button\" value=\"filtrar\" id=\"btnFiltrar\" class=\"btn\" />
            <input type=\"button\" value=\"generar\" id=\"btnGuardar\" class=\"btn\" />
        </div>
    </div>
    <div id=\"divTablaSuscripciones\" style=\"display:none;\">
        <table id=\"tblSuscripciones\" class=\"tabla\"></table>
    </div>


    <div id=\"divFiltro\">
        <div class=\"campo\">
            <label for=\"txtMunicipio\">Municipio:</label>
            <input type=\"text\" id=\"txtMunicipio\" />
        </div>
        <div class=\"campo\">
            <label for=\"cmbTipoSuscripcion\">Tipo de Suscripción:</label>
            ";
        // line 34
        echo (isset($context["cmbTipoSuscripcion"]) ? $context["cmbTipoSuscripcion"] : $this->getContext($context, "cmbTipoSuscripcion"));
        echo "
        </div>
        <div class=\"campo\">
            <label for=\"cmbCicloActivo\">Ciclo:</label>
            <select id=\"cmbCicloActivo\">
                <option value=\"-1\">Seleccione una opción </option>
                ";
        // line 40
        $context['_parent'] = (array) $context;
        $context['_seq'] = twig_ensure_traversable((isset($context["ciclos"]) ? $context["ciclos"] : $this->getContext($context, "ciclos")));
        foreach ($context['_seq'] as $context["_key"] => $context["ciclo"]) {
            // line 41
            echo "                    <option value=\"";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["ciclo"]) ? $context["ciclo"] : $this->getContext($context, "ciclo")), "idciclo"), "html", null, true);
            echo "\">";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["ciclo"]) ? $context["ciclo"] : $this->getContext($context, "ciclo")), "ciclo"), "html", null, true);
            echo "</option>
                ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['ciclo'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 43
        echo "            </select>
        </div>
        <div class=\"campo\">
            <label for=\"txtIdSuscripcion\">Id Suscripción:</label>
            <input type=\"text\" id=\"txtIdSuscripcion\" />
        </div>

        <div class=\"campo\">
            <label for=\"cmbTipoDocumento\">Tipo de Documento:</label>
            ";
        // line 52
        echo (isset($context["cmbTipoDocumento"]) ? $context["cmbTipoDocumento"] : $this->getContext($context, "cmbTipoDocumento"));
        echo "
        </div>
        <div class=\"campo\">
            <label for=\"cmbDocumento\">Documento:</label>
            <select id=\"cmbDocumento\"></select>
        </div>

        <div class=\"campo\">
            <fieldset>
                <legend>Morosidad</legend>
                <div class=\"campoMitad\">
                    <label for=\"txtMorosidadInicial\">Desde:</label>
                    <input type=\"number\" id=\"txtMorosidadInicial\" min=\"0\" />
                </div>

                <div class=\"campoMitad\">
                    <label for=\"txtMorosidadFinal\">Hasta:</label>
                    <input type=\"number\" id=\"txtMorosidadFinal\" min=\"0\" max=\"4\"/>
                </div>
            </fieldset>
        </div>
        <div class=\"campo\">
            <fieldset>
                <legend>Saldo</legend>
                <div class=\"campo\">
                    <label for=\"txtSaldoInicial\">Desde:</label>
                    <input type=\"number\" id=\"txtSaldoInicial\" min=\"1\" />
                </div>

                <div class=\"campoMitad\">
                    <label for=\"txtSaldoFinal\">Hasta:</label>
                    <input type=\"number\" id=\"txtSaldoFinal\" min=\"0\" />
                </div>
            </fieldset>
        </div>
    </div>
    <div id=\"divFacturas\" style=\"display:none;\">
        <table class=\"tabla\" id=\"tblFacturas\"></table>
    </div>


";
    }

    // line 96
    public function block_javascripts($context, array $blocks = array())
    {
        // line 97
        echo "    <script type=\"text/javascript\" src=\"";
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/facturacion/dataTables.min.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 98
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/cartera/generar_gestion/generar.control.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 99
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/cartera/generar_gestion/generar.modelo.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 100
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/cartera/generar_gestion/generar.vista.js"), "html", null, true);
        echo "\"></script>
";
    }

    public function getTemplateName()
    {
        return "LlanogasLlanogasBundle:Cartera:GenerarGestionCartera.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  187 => 100,  183 => 99,  179 => 98,  174 => 97,  171 => 96,  125 => 52,  114 => 43,  103 => 41,  99 => 40,  90 => 34,  69 => 15,  66 => 14,  58 => 12,  53 => 10,  50 => 9,  44 => 6,  40 => 5,  35 => 4,  32 => 3,);
    }
}
