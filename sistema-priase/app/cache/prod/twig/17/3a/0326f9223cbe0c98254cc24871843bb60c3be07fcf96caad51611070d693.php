<?php

/* HomafoHomafoBundle:Default:index.html.twig */
class __TwigTemplate_173a0326f9223cbe0c98254cc24871843bb60c3be07fcf96caad51611070d693 extends Twig_Template
{
    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        $this->parent = $this->env->loadTemplate("base.react.html.twig");

        $this->blocks = array(
            'stylesheets' => array($this, 'block_stylesheets'),
            'body' => array($this, 'block_body'),
            'javascripts' => array($this, 'block_javascripts'),
        );
    }

    protected function doGetParent(array $context)
    {
        return "base.react.html.twig";
    }

    protected function doDisplay(array $context, array $blocks = array())
    {
        $this->parent->display($context, array_merge($this->blocks, $blocks));
    }

    // line 3
    public function block_stylesheets($context, array $blocks = array())
    {
        // line 4
        echo "<link href=\"";
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("homafo.bundle.css"), "html", null, true);
        echo "?v=";
        echo twig_escape_filter($this->env, (isset($context["version"]) ? $context["version"] : $this->getContext($context, "version")), "html", null, true);
        echo "\" stylesheets=\"stylesheets\" type=\"text/css\" />
";
    }

    // line 7
    public function block_body($context, array $blocks = array())
    {
        // line 8
        echo "    <div id=\"root\"></div>
";
    }

    // line 11
    public function block_javascripts($context, array $blocks = array())
    {
        // line 12
        echo "    <script src=\"";
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("homafo.bundle.js"), "html", null, true);
        echo "?v=";
        echo 1;
        echo "\" type=\"text/javascript\"></script>
";
    }

    public function getTemplateName()
    {
        return "HomafoHomafoBundle:Default:index.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  53 => 12,  50 => 11,  45 => 8,  42 => 7,  33 => 4,  30 => 3,);
    }
}
