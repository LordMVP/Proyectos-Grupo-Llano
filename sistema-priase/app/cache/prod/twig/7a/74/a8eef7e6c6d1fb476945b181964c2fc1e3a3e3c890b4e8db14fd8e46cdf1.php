<?php

/* LlanogasLlanogasBundle:MovimientosContables:movimientocontable.html.twig */
class __TwigTemplate_7a74a8eef7e6c6d1fb476945b181964c2fc1e3a3e3c890b4e8db14fd8e46cdf1 extends Twig_Template
{
    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        $this->parent = $this->env->loadTemplate("::base.html.twig");

        $this->blocks = array(
            'stylesheets' => array($this, 'block_stylesheets'),
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
    <style type=\"text/css\">
        #divCargando {
            min-width: 100px;
            max-width: 300px;
            min-height: 40px;
            background-color: #8AB6D9;
            color: #FFF;
            font-size: 12px;
            margin: 0 auto;
            display: none;
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

    // line 26
    public function block_titulo($context, array $blocks = array())
    {
        echo "Movimientos Contables - ";
        echo twig_escape_filter($this->env, (isset($context["empresa"]) ? $context["empresa"] : $this->getContext($context, "empresa")), "html", null, true);
        echo "  ";
    }

    // line 27
    public function block_body($context, array $blocks = array())
    {
        // line 28
        echo "    <div id=\"divCabecera\" style=\"margin: 0 auto; width: 60%;\">


        <fieldset>
            <legend>Proceso movimiento contable</legend>
            <div id=\"divControles\">
                <div class=\"campo\" style=\"margin-bottom: 10px;\">
                    <label for=\"cmbCiclo\">Seleccione ciclo: </label>
                    <select id=\"cmbCiclo\">
                        ";
        // line 37
        $context['_parent'] = (array) $context;
        $context['_seq'] = twig_ensure_traversable((isset($context["ciclos"]) ? $context["ciclos"] : $this->getContext($context, "ciclos")));
        foreach ($context['_seq'] as $context["_key"] => $context["ciclo"]) {
            // line 38
            echo "                            <option value=\"";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["ciclo"]) ? $context["ciclo"] : $this->getContext($context, "ciclo")), "idciclo"), "html", null, true);
            echo "\" >";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["ciclo"]) ? $context["ciclo"] : $this->getContext($context, "ciclo")), "ciclo"), "html", null, true);
            echo "</option>
                        ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['ciclo'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 40
        echo "                    </select>
                </div>
                     <div class=\"campo\" id=\"cmbPeriodo\" style=\"display:none\">
                        <label for=\"cmbPeriodos\">Periodo: </label>
                        <select id=\"cmbPeriodos\"></select>   
                    </div>
                <button class=\"btnSimple\" id=\"btnGenerarMovimiento\">Generar movimientos contables</button>
            </div>
                    <div class=\"campo\">
                        <input type=\"checkbox\" name=\"checkServicio\" value=\"\" id=\"checkServicio\">Generar Contabilización del Servicio x Ciclo  (Solo Funciona para Facturas de Servicio)
                    </div>
                   
            <div id=\"divCargando\" style=\"margin-bottom: 25px\"> 
                <img src=\"/achagua/sistema/web/bundles/Llanogas/img/cargando2.gif\">
                <p>Contabilizando información, <br>esto puede tardar unos minutos...</p>        \t\t
            </div>
            <table id=\"tblMovimiento\" class=\"tabla\"></table>
            <div style=\"text-align:center; display:block\">
                <button class=\"btnSimple\" style=\"display: none;\" id=\"btnRecargar\">Finalizar</button>
            </div>
        </fieldset>
    </div>

    <div id=\"divConfirmar\" style=\"display: none;\">
        <p>Se procesarán los movimientos contables, ¿Desea procesarlos?</p>
    </div>
";
    }

    // line 68
    public function block_javascripts($context, array $blocks = array())
    {
        // line 69
        echo "    <script type=\"text/javascript\" src=\"";
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/contabilizacion/movimientocontable/movimientocontable.modelo.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 70
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/contabilizacion/movimientocontable/movimientocontable.control.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 71
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/contabilizacion/movimientocontable/movimientocontable.vista.js"), "html", null, true);
        echo "\"></script>
";
    }

    public function getTemplateName()
    {
        return "LlanogasLlanogasBundle:MovimientosContables:movimientocontable.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  140 => 71,  136 => 70,  131 => 69,  128 => 68,  98 => 40,  87 => 38,  83 => 37,  72 => 28,  69 => 27,  61 => 26,  34 => 4,  31 => 3,);
    }
}
