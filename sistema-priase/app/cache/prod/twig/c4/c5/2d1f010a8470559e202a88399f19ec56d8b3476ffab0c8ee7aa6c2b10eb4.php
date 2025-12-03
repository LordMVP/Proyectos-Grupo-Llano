<?php

/* LlanogasLlanogasBundle:Cartera:FacturarFinanciacion.html.twig */
class __TwigTemplate_c4c52d1f010a8470559e202a88399f19ec56d8b3476ffab0c8ee7aa6c2b10eb4 extends Twig_Template
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
<link href=\"";
        // line 5
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/facturacion/dataTables.css"), "html", null, true);
        echo "\" media=\"screen\" type=\"text/css\" rel=\"stylesheet\" />
<style type=\"text/css\">
    #divCargando {
        min-width: 100px;
        max-width: 310px;
        min-height: 40px;
        background-color: #8AB6D9;
        color: #FFF;
        font-size: 12px;
        margin: 0 auto;
        border-radius: 20px;
        text-align: center;
        padding: 5px 15px 5px 28px;
    }
    #divCargando p{
        margin: 5px 15px 5px 28px;
        display: inline-block;
    }
    #divCargando img {
        padding: 5px 5px 5px 34px;
    }
    .divContenedorColapsable {
        padding-right: 10px;
    }

    #divResultadosConError,
    #divResultadosProcesadasCorrectas{
        max-height: 200px;
        overflow-y:auto;
    }
</style>

";
    }

    // line 39
    public function block_scripts($context, array $blocks = array())
    {
        // line 40
        echo "
";
    }

    // line 43
    public function block_titulo($context, array $blocks = array())
    {
        echo " Facturar Financiación  ";
    }

    // line 45
    public function block_body($context, array $blocks = array())
    {
        // line 46
        echo "
<fieldset id=\"fsInfoSuscripcion\">
    <legend> Criterios  </legend>
    <div id=\"divCamposProceso\">
        <div class=\"campoMitad\"  >
            <label>Ciclo</label>
            <select id=\"cboCiclo\">
                <option value=\"-1\"> Seleccione una opción</option>
                ";
        // line 54
        $context['_parent'] = (array) $context;
        $context['_seq'] = twig_ensure_traversable((isset($context["ciclos"]) ? $context["ciclos"] : $this->getContext($context, "ciclos")));
        foreach ($context['_seq'] as $context["_key"] => $context["ciclo"]) {
            // line 55
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
        // line 57
        echo "            </select>
        </div>
        <div>
            <input type=\"button\" id=\"btnFacturarFinanciacion\" value=\"Facturar Financiación\" class=\"btnSimple\"/>
            <button class=\"btnSimple\" id=\"btnAprobarFac\">Aprobar facturación</button>
        </div>
    </div>
    <div style=\" display: none;\" id=\"divProgreso\">
        <div style=\"width: 100%;display:block; \">
            <div id=\"divCargando\"> 
                <img src=\"/achagua/sistema/web/bundles/Llanogas/img/cargando2.gif\">
                <p>Facturando financiaciones, <br>esto puede tardar unos minutos...</p>                
            </div>    
        </div>
        
        <div id=\"divTbl\" style=\"display: block; width: 100%; margin-top: 15px;\">
            <table id=\"tblProgreso\" class=\"tabla\"></table>    
        </div>
        
    </div>
</fieldset>

<div id=\"divErroresProceso\" style=\"display:none;\">
    <fieldset id=\"fsResultadosConError\">
        <legend>Errores del proceso</legend>
        <div id=\"divResultadosConError\">
            <table id=\"tblErroresProceso\" class=\"tabla\"></table>
        </div>
    </fieldset>
    <fieldset id=\"fsResultadosCorrectas\">
        <legend>Financiaciones facturadas correctamente</legend>
        <div id=\"divResultadosProcesadasCorrectas\">
            <table id=\"tblFacturasCorrectas\" class=\"tabla\"></table>
        </div>
    </fieldset>
</div>

<fieldset id=\"fsResumen\" style=\"display: none;\">
    <legend>Resumen de la facturación</legend>
    <div>
        <p id=\"pResultado\" class=\"pMensaje\" style=\"font-size: 14px;\"></p>
        <div class=\"divContenedorColapsable\">
            <div class=\"divColapsable\">
                <h3 class=\"tituloColapsable\"><span id=\"spanCorrectas\"></span> financiaciones procesadas correctamente </h3>
                <div class=\"btnColapsable\"><a class=\"fa fa-minus\"></a></div>
            </div>
            <div class=\"divContenidoColapsable\">
                <table id=\"tblCompletadas\" class=\"tabla\"></table>    
            </div>  
        </div>
        <div class=\"divContenedorColapsable\">
            <div class=\"divColapsable\">
                <h3 class=\"tituloColapsable\">
                    <span id=\"spanErrores\"></span> financiaciones con problemas
                </h3>
                <div class=\"btnColapsable\"><a class=\"fa fa-minus\"></a></div>
            </div>
            <div class=\"divContenidoColapsable\">
            <table id=\"tblResultado\" class=\"tabla\"></table>    
        </div>
        </div>
        
        
        
    </div>
</fieldset>
<div id=\"diConfirmacion\" style=\"display: none;\">
    <label id=\"pInformacion\"></label>
    <table class=\"tabla\" id=\"tblLiquidacion\"></table>
</div>

";
    }

    // line 129
    public function block_javascripts($context, array $blocks = array())
    {
        // line 130
        echo "
<script type=\"text/javascript\" src=\"";
        // line 131
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/facturacion/dataTables.min.js"), "html", null, true);
        echo "\"></script>
<script type=\"text/javascript\" src=\"";
        // line 132
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/facturacion/jquery.dataTables.js"), "html", null, true);
        echo "\"></script>
<script type=\"text/javascript\" src=\"";
        // line 133
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/facturacion/dataTables.tableTool.js"), "html", null, true);
        echo "\"></script>
<script type=\"text/javascript\" src=\"";
        // line 134
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/cartera/facturar_financiacion/facturar.financiacion.modelo.js"), "html", null, true);
        echo "\"></script>
<script type=\"text/javascript\" src=\"";
        // line 135
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/cartera/facturar_financiacion/facturar.financiacion.control.js"), "html", null, true);
        echo "\"></script>
<script type=\"text/javascript\" src=\"";
        // line 136
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/cartera/facturar_financiacion/facturar.financiacion.vista.js"), "html", null, true);
        echo "\"></script>
<script type=\"text/javascript\">
    (
        function(){
            facturarFinanciacionModel.interval = setInterval(that.consultarProgreso, 5000);
            that.consultarProgreso();    
        }
    )();
</script>
";
    }

    public function getTemplateName()
    {
        return "LlanogasLlanogasBundle:Cartera:FacturarFinanciacion.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  220 => 136,  216 => 135,  212 => 134,  208 => 133,  204 => 132,  200 => 131,  197 => 130,  194 => 129,  119 => 57,  108 => 55,  104 => 54,  94 => 46,  91 => 45,  85 => 43,  80 => 40,  77 => 39,  40 => 5,  35 => 4,  32 => 3,);
    }
}
