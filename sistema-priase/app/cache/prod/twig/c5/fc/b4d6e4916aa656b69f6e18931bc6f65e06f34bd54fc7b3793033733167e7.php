<?php

/* BioagricolaBioagricolaBundle:Financiacion:consultarFinan.html.twig */
class __TwigTemplate_c5fcb4d6e4916aa656b69f6e18931bc6f65e06f34bd54fc7b3793033733167e7 extends Twig_Template
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
    <link rel=\"stylesheet\" type=\"text/css\" href=\"";
        // line 5
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/archivos.css"), "html", null, true);
        echo "\" />

    <style>
        #divCargando {
            min-width: 100px;
            max-width: 300px;
            min-height: 40px;
            background-color: #8AB6D9;
            color: #FFF;
            font-size: 12px;
            margin: 0 auto;
            margin-right: 55px;
            display: inline-block;
            width: 40%;
            position: relative;
            top: 16px;
            border-radius: 20px;
            text-align: center;
            padding-top: 3px;
        }
        #divCargando p{
            margin: 7px 0px 0px 10px;
            display: inline-block;
        }
    </style>
";
    }

    // line 32
    public function block_scripts($context, array $blocks = array())
    {
    }

    // line 35
    public function block_titulo($context, array $blocks = array())
    {
        echo " Financiaciones: Consultar  -  ";
        echo twig_escape_filter($this->env, (isset($context["empresa"]) ? $context["empresa"] : $this->getContext($context, "empresa")), "html", null, true);
        echo "  ";
    }

    // line 36
    public function block_body($context, array $blocks = array())
    {
        // line 37
        echo "
    <div id=\"divComandos\">
        <div class=\"divBotones\">
            <input type=\"button\" value=\"Consultar\" id=\"btnConsultar\" class=\"btn\" />
        </div>
    </div>

    <div id=\"divPanelContenedor\">
        <fieldset>
            <legend>Financiaciones Especiales</legend>
            <div class=\"campo\">
                <label for=\"txtCodigoUsuario\">Ingrese el Codigo de Usuario: </label>
                <input type=\"text\" id=\"txtCodUsuario\"/>
            </div>
            <div class=\"campo\">
                <label for=\"txtCodigoUsuario\">Ingrese el Id Financiación: </label>
                <input type=\"text\" id=\"txtIdFinanciacion\"/>
            </div>
            <div id=\"divResultados\">
                <div style=\"width: 100%; display: inline-block; margin-top: 10px;\">
                    <table id=\"tblFinanciaciones\" class=\"tabla\"></table>
                </div>
                <div id=\"divPagos\" style=\"width: 100%; display: inline-block; margin-top: 10px;\">
                    <table id=\"tblPagos\" class=\"tabla\"></table>
                </div>
                <div id=\"divAmortizaciones\" style=\"width: 100%; display: inline-block; margin-top: 10px;\">
                    <table id=\"tblAmortizaciones\" class=\"tabla\"></table>
                </div>
                <div id=\"divTerceros\" style=\"width: 100%; display: inline-block; margin-top: 10px;\">
                    <table id=\"tblTerceros\" class=\"tabla\"></table>
                </div>
                
            </div>
        </fieldset>
    </div>

";
    }

    // line 74
    public function block_javascripts($context, array $blocks = array())
    {
        // line 75
        echo "    <script type=\"text/javascript\" src=\"";
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Bioagricola/js/Financiacion/consultar/consultarFinan.modelo.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 76
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Bioagricola/js/Financiacion/consultar/consultarFinan.control.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 77
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Bioagricola/js/Financiacion/consultar/consultarFinan.vista.js"), "html", null, true);
        echo "\"></script>
";
    }

    public function getTemplateName()
    {
        return "BioagricolaBioagricolaBundle:Financiacion:consultarFinan.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  138 => 77,  134 => 76,  129 => 75,  126 => 74,  86 => 37,  83 => 36,  75 => 35,  70 => 32,  40 => 5,  35 => 4,  32 => 3,);
    }
}
