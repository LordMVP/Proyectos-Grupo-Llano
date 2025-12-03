<?php

/* BioagricolaBioagricolaBundle:Financiacion:importar.html.twig */
class __TwigTemplate_63d105a6b6ffcee7ed7b7d0fda1b2f5a11c12eaba5e32e2b492161d920acd0c6 extends Twig_Template
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
        echo " Financiaciones: Importar  -  ";
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
            <input type=\"button\" value=\"cargar\" id=\"btnCargar\" class=\"btn\" />
            <input type=\"button\" value=\"cancelar\" id=\"btnCancelar\" class=\"btn\" />
        </div>
    </div>

    <div id=\"divPanelContenedor\">
        <fieldset>
            <legend>Financiaciones Especiales</legend>
            <div class=\"campo\">
                <label for=\"txtFechaPago\">Selecciona el Mes a Cargar: </label>
                <input type=\"text\" id=\"txtFechaPago\"/>
            </div>
            <div>
                <div id=\"divArchivo\" style=\"margin-top: 15px\">
                    <input type=\"file\" id=\"txtArchivo\"/>
                </div>
            </div>
            <div>
                <div style=\"width: 100%; display: inline-block; margin-top: 10px;\">
                    <table id=\"tblResumen\" class=\"tabla\"></table>
                </div>
                <div style=\"width: 100%; display: inline-block; margin-top: 10px;\">
                    <table id=\"tblResumenConProblemas\" class=\"tabla\"></table>
                </div>
                <div style=\"width: 100%; display: inline-block;\">
                    <button class=\"btnSimple\" id=\"btnEliminarResumen\">Eliminar resumen</button>
                </div>
            </div>
        </fieldset>
    </div>
    <fieldset id=\"divInfoProceso\" style=\"display:none\">
        <legend> Proceso cargar Financiaciones</legend>
        <div id=\"divCargando\"> 
            <img src=\"/achagua/sistema/web/bundles/Llanogas/img/cargando2.gif\">
            <p>Se está ejecutando el proceso, <br>esto puede tardar unos minutos...</p>                
        </div>
        <table id=\"tblProceso\" class=\"tabla\" style=\"width: 70%; display: inline-table; margin: 20px 20px;\"></table>
    </fieldset>
    <div id=\"divCancelarOpe\" style=\"display: none;\">
        <p>Se cancelará la importación actual, ¿Desea continuar?</p>
    </div>

";
    }

    // line 83
    public function block_javascripts($context, array $blocks = array())
    {
        // line 84
        echo "    <script type=\"text/javascript\" src=\"";
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Bioagricola/js/Financiacion/importar/importar.modelo.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 85
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Bioagricola/js/Financiacion/importar/importar.control.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 86
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Bioagricola/js/Financiacion/importar/importar.vista.js"), "html", null, true);
        echo "\"></script>
";
    }

    public function getTemplateName()
    {
        return "BioagricolaBioagricolaBundle:Financiacion:importar.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  147 => 86,  143 => 85,  138 => 84,  135 => 83,  86 => 37,  83 => 36,  75 => 35,  70 => 32,  40 => 5,  35 => 4,  32 => 3,);
    }
}
