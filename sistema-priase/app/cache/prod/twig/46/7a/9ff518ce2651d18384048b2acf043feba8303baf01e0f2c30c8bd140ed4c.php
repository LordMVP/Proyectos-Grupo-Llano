<?php

/* LlanogasLlanogasBundle:Cartera:FacturarInteresMora.html.twig */
class __TwigTemplate_467a9ff518ce2651d18384048b2acf043feba8303baf01e0f2c30c8bd140ed4c extends Twig_Template
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
    <style type=\"text/css\">
        div#divFiltro, div#divFiltroFacturas{
            display:none;
        }
        div.divlista{
            display: inline-block;
            width: 48%;
            margin-right: 1%;
        }
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
        echo " Facturar interés mora  ";
    }

    // line 45
    public function block_body($context, array $blocks = array())
    {
        // line 46
        echo "    <div id=\"divComandos\">
        <div class=\"divBotones\">
            <input type=\"button\" id=\"btnFacturarInteresMora\" value=\"Facturar interés mora\" class=\"btn\"/>
            <input type=\"button\" id=\"btnAprobar\" value=\"aprobar facturas\" class=\"btn\"/>
        </div>
    </div>
    <div id=\"tabs\" style=\"margin: 10px;\">
        <ul>
            <li><a id=\"aCiclo\" data=\"C\" href=\"#divCiclo\">Ciclo</a></li>
            <li><a id=\"aSuscripcion\" data=\"S\" href=\"#divCabecera\">Suscripción</a></li>
        </ul>
        <div id=\"divCiclo\">
            <div class=\"campoMitad\" id=\"divComboCiclo\" >
                <label>Ciclo: </label>
                <select id=\"cboCiclo\">
                    <option value=\"-1\"> Seleccione una opción</option>
                    ";
        // line 62
        $context['_parent'] = (array) $context;
        $context['_seq'] = twig_ensure_traversable((isset($context["ciclos"]) ? $context["ciclos"] : $this->getContext($context, "ciclos")));
        foreach ($context['_seq'] as $context["_key"] => $context["ciclo"]) {
            // line 63
            echo "                        <option value=\"";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["ciclo"]) ? $context["ciclo"] : $this->getContext($context, "ciclo")), "idciclo"), "html", null, true);
            echo "\">";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["ciclo"]) ? $context["ciclo"] : $this->getContext($context, "ciclo")), "ciclo"), "html", null, true);
            echo "</option>
                    ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['ciclo'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 65
        echo "                </select>
            </div>
            <div id=\"divInfoProceso\" style=\"display:none\">
                <div id=\"divCargando\"> 
                    <img src=\"/achagua/sistema/web/bundles/Llanogas/img/cargando2.gif\">
                    <p>Se está ejecutando el proceso, <br>esto puede tardar unos minutos...</p>                
                </div>
                <table id=\"tblProceso\" class=\"tabla\" style=\"width: 70%; display: inline-table; margin: 20px 20px;\"></table>
            </div>
            <div id=\"divResumenProceso\" style=\"display:none;\">
                <table id=\"tblResumen\" class=\"tabla\"></table>
                <table id=\"tblErrores\" class=\"tabla\"></table>
            </div>
        </div>
        <div id=\"divCabecera\">
            <div class=\"campoBusqueda\">
                <label for=\"btnFormaPago\">Suscripción:</label>
                <input type=\"text\" id=\"txtSuscripcion\" disabled=\"disabled\" />
                <button id=\"btnSuscripcion\" title=\"Buscar una suscripción\"></button>
            </div>

            <div class=\"campoCorto\">
                <label for=\"txtDocumento\">NIT/CC:</label>
                <input type=\"text\" id=\"txtDocumento\" disabled=\"disabled\" />
            </div>

            <div class=\"campo\">
                <label for=\"txtNombre\">Nombre completo:</label>
                <input type=\"text\" id=\"txtNombre\" disabled=\"disabled\" />
            </div>
            <div class=\"campo\">
                <label for=\"txtCodAnterior\">Código anterior:</label>
                <input type=\"text\" id=\"txtCodAnterior\" disabled=\"disabled\" />
            </div>
            <div class=\"campo\">
                <label for=\"txtMunicipio\">Municipio:</label>
                <input type=\"text\" id=\"txtMunicipio\" disabled=\"disabled\" />
            </div>
            <div class=\"campo\">
                <label for=\"txtBarrio\">Barrio:</label>
                <input type=\"text\" id=\"txtBarrio\" disabled=\"disabled\" />
            </div>
            <div class=\"campo\">
                <label for=\"txtDireccion\">Dirección:</label>
                <input type=\"text\" id=\"txtDireccion\" disabled=\"disabled\" />
            </div>
        </div>
    </div>
    <div style=\"display: none\" id=\"camposBuscarSuscripcion\">
        <div class=\"campo\">
            <label for=\"txtMunicipioFiltro\">Municipio: </label>
            <input id=\"txtMunicipioFiltro\" type=\"text\"/>
        </div>
        <div class=\"campo\">
            <label for=\"txtSuscripcionFiltro\">Id suscripción: </label>
            <input id=\"txtSuscripcionFiltro\" type=\"text\"/>
        </div>
        <div class=\"campo\">
            <label for=\"txtCodAnterior\">Código anterior: </label>
            <input id=\"txtCodAnterior\" type=\"text\"/>
        </div>
        <span id=\"spanMensaje\" class=\"pMensaje\"></span>
    </div>

    <div style=\"display:none;\" id=\"divContinuar\">
        <p style=\"margin-bottom: 15px;\">
            Se generará interés por mora a las facturas con los siguientes documentos y tipos de documentos 
            <span></span>
        </p>
        <div id=\"contenedorDocumentos\">
            <table class=\"tabla\" id=\"tblDocumentos\"></table>
        </div>
        <div id=\"contenedorConceptos\">
            <p style=\"margin-bottom: 15px;\">
                Los conceptos que no hacen base con los documentos documentos y tipos de documentos anteriores son: 
                <span></span>
            </p>
            <div style=\"max-height: 45vh; overflow: auto\">
                <table class=\"tabla\" id=\"tblConceptosNoBase\"></table>
            </div>
        </div>
    </div>

    <div style=\"display: none;\" id=\"divResultado\">
        <p style=\"margin-bottom: 15px;\"></p>
        <div style=\"max-height: 350px; overflow-y: auto;\">
            <table class=\"tabla\" id=\"tblResultado\"></table>
        </div>
    </div>
";
    }

    // line 155
    public function block_javascripts($context, array $blocks = array())
    {
        // line 156
        echo "    <script type=\"text/javascript\" src=\"";
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/cartera/facturar_interes_mora/facturar.interes.mora.modelo.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 157
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/cartera/facturar_interes_mora/facturar.interes.mora.control.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 158
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/cartera/facturar_interes_mora/facturar.interes.mora.vista.js"), "html", null, true);
        echo "\"></script>
    <script>
        facturarInteresMoraVista.init(";
        // line 160
        echo twig_escape_filter($this->env, (isset($context["procesoActivo"]) ? $context["procesoActivo"] : $this->getContext($context, "procesoActivo")), "html", null, true);
        echo ");

    </script>

";
    }

    public function getTemplateName()
    {
        return "LlanogasLlanogasBundle:Cartera:FacturarInteresMora.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  234 => 160,  229 => 158,  225 => 157,  220 => 156,  217 => 155,  124 => 65,  113 => 63,  109 => 62,  91 => 46,  88 => 45,  82 => 43,  77 => 40,  74 => 39,  35 => 4,  32 => 3,);
    }
}
