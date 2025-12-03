<?php

/* LlanogasLlanogasBundle:Suscripcion:gestionarSuscripcion.html.twig */
class __TwigTemplate_fa0c11472fc7345b450d86df375d65a34c5fe4d61b23df394c2ed2d0021611fa extends Twig_Template
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
        echo "<link rel=\"stylesheet\" type=\"text/css\" href=\"";
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/theme/jquery.ui.all.css"), "html", null, true);
        echo "\" />
<link rel=\"stylesheet\" type=\"text/css\" href=\"";
        // line 5
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/suscripciones/gestionar.estilo.css"), "html", null, true);
        echo "\" />
<link rel=\"stylesheet\" type=\"text/css\" href=\"";
        // line 6
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/theme/jquery.datetimepicker.css"), "html", null, true);
        echo "\" />

<style type=\"text/css\">
\t#btnVerConceptos{
\t\tdisplay: none !important;
\t}

\t.listaSeleccion{
\t\tmax-height: 200px;
\t\toverflow-y:auto;
\t}

</style>
";
    }

    // line 21
    public function block_scripts($context, array $blocks = array())
    {
        // line 22
        echo "
";
    }

    // line 25
    public function block_titulo($context, array $blocks = array())
    {
        echo " Gestionar Suscripción - ";
        echo twig_escape_filter($this->env, (isset($context["empresa"]) ? $context["empresa"] : $this->getContext($context, "empresa")), "html", null, true);
        echo " ";
    }

    // line 27
    public function block_body($context, array $blocks = array())
    {
        // line 28
        echo "<div id=\"divComandos\">

    <div class=\"divBotones\">
        <input type=\"button\" value=\"nuevo\" id=\"btnNuevo\" class=\"btn\" />
        <input type=\"button\" value=\"buscar\" id=\"btnBuscar\" class=\"btn\" />
        <input type=\"button\" value=\"grabar\" id=\"btnGrabar\" class=\"btn\" />
        <input type=\"button\" value=\"cancelar\" id=\"btnCancelar\" class=\"btn\" />
    </div>
</div>
";
        // line 37
        $this->env->loadTemplate("LlanogasLlanogasBundle:Suscripcion:registrarSuscripcion.html.twig")->display($context);
    }

    // line 39
    public function block_javascripts($context, array $blocks = array())
    {
    }

    public function getTemplateName()
    {
        return "LlanogasLlanogasBundle:Suscripcion:gestionarSuscripcion.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  96 => 39,  92 => 37,  81 => 28,  78 => 27,  70 => 25,  65 => 22,  62 => 21,  44 => 6,  40 => 5,  35 => 4,  32 => 3,);
    }
}
