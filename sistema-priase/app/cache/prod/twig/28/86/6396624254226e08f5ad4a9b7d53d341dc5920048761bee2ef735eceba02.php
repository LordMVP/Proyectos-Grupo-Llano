<?php

/* LlanogasLlanogasBundle:Cartera:CondonarCarteraCorriente.html.twig */
class __TwigTemplate_28866396624254226e08f5ad4a9b7d53d341dc5920048761bee2ef735eceba02 extends Twig_Template
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
    <link rel=\"stylesheet\" media=\"print\" type=\"text/css\" href=\"";
        // line 5
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/cartera/estado_cuenta_impresion.css"), "html", null, true);
        echo "\" />
    <style type=\"text/css\">
        div#divFiltro, div#divFiltroFacturas{
            display:none;
        }
    </style>

";
    }

    // line 14
    public function block_scripts($context, array $blocks = array())
    {
    }

    // line 17
    public function block_titulo($context, array $blocks = array())
    {
        echo " Condonar Cartera Corriente - ";
        echo twig_escape_filter($this->env, (isset($context["empresa"]) ? $context["empresa"] : $this->getContext($context, "empresa")), "html", null, true);
        echo "  ";
    }

    // line 19
    public function block_body($context, array $blocks = array())
    {
        // line 20
        echo "<div id=\"divComandos\">
    <div class=\"divBotones\">
        <input type=\"button\" value=\"grabar\" id=\"btnGrabar\" class=\"btn\" />
        <input type=\"button\" value=\"cancelar\" id=\"btnCancelar\" class=\"btn\" />
        <input type=\"button\" value=\"imprimir\" id=\"btnImprimir\" class=\"btn\" disabled=\"true\"/>
    </div>
</div>

<fieldset id=\"divCabecera\">
        <legend>Suscripción</legend>
        <div class=\"campoBusqueda campo\">
            <label for=\"btnFormaPago\">Suscripción:</label>
            <input type=\"text\" id=\"txtSuscripcion\" disabled=\"disabled\" />
            <button id=\"btnSuscripcion\" title=\"Buscar una suscripción\"></button>
        </div>

        <div class=\"campo\">
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
        <div class=\"campo\">
            <label for=\"txtTelefono\">Teléfono:</label>
            <input type=\"text\" id=\"txtTelefono\" disabled=\"disabled\" />
        </div>
        <div class=\"campo\">
            <label for=\"txtCelular\">Celular:</label>
            <input type=\"text\" id=\"txtCelular\" disabled=\"disabled\" />
        </div>
        <div class=\"campo valoresCondonacion\" style=\"display: none;\">
            <label for=\"txtInteresTotal\">Interes Total Liquidado: </label>
            <input type=\"text\" id=\"txtInteresTotal\" maxlength=\"30\" disabled=\"disabled\"  />
        </div>
        <div class=\"campo valoresCondonacion\" style=\"display: none;\">
            <label for=\"txtSaldoCondonable\">Saldo Condonable: </label>
            <input type=\"text\" id=\"txtSaldoCondonable\" maxlength=\"30\" disabled=\"disabled\"  />
        </div>
        <div class=\"campo valoresCondonacion\" style=\"display: none;\">
            <label for=\"txtPorcentajeCondonable\">Porcentaje Condonable: </label>
            <input type=\"text\" id=\"txtPorcentajeCondonable\" maxlength=\"3\" disabled=\"disabled\"  />
        </div>
        <div class=\"campo\" id=\"divSelSeg\">
            <label for=\"cmbSegmento\">Segmento:</label>
            <select id=\"cmbSegmento\">
                <option value=\"-2\">Seleccione una opción</option>
            </select>
        </div>
        <input type=\"button\" id=\"btnCargarFacturas\" value=\"Facturas Interes Mora\" class=\"btnSimple\" disabled=\"disabled\" />\t
        <input type=\"button\" id=\"btnCargarFacturasIntCorriente\" value=\"Facturas Interes Corriente\" class=\"btnSimple\" disabled=\"disabled\" />
      
    </fieldset>

    <!--Nueva sección para selección automática por monto-->
        <div id=\"divSelAutomatica\" style=\"display: none\">
            <fieldset id=\"divCabecera\">
            <legend>Selección Automática</legend>
            <div class=\"campo\">
                <label for=\"txtPorcentaje\">Porcentaje:</label>
                <input type=\"text\" id=\"txtPorcentaje\" class=\"numbersPor\" data-reference=\"ingresoporcentaje\"/>
            </div>
            <div class=\"campo\">
                <label for=\"txtMonto\">Monto:</label>
                <input type=\"text\" id=\"txtMonto\" class=\"numbersDec\" data-reference=\"ingresomonto\"/>
            </div>
            <div class=\"campo\">
                <input type=\"button\" id=\"btnSeleccionAutomatica\" value=\"Seleccion Automática\" class=\"btnSimple\"/>
            </div>
        </fieldset>
    </div>

    <table id=\"tblFacturas\" class=\"tabla\"></table>
    <table id=\"tblConceptosCompletos\" class=\"tabla\"></table>
   
<!-- Division para filtro -->
<div id=\"camposBuscarSuscripcion\" style=\"display:none;\" >
    <div class=\"campo\">
        <label for=\"txtMunicipio\">Municipio: </label>
        <input type=\"text\" id=\"txtMunicipio\" maxlength=\"30\" />
    </div>
    <div class=\"campo\">
        <label for=\"txtFiltroSus\">Suscripción:</label>
        <input type=\"text\" id=\"txtFiltroSus\" data-attr=\"suscripcion\" maxlength=\"15\" />
    </div>
    <div class=\"campo\">
        <label for=\"txtFiltroCodAnt\">Código Anterior:</label>
        <input type=\"text\" id=\"txtFiltroCodAnt\" data-attr=\"codAnterior\" maxlength=\"30\" />
    </div>
    <span id=\"spanMensaje\" class=\"pMensaje\"></span>
    <div id=\"divListaSelección\"></div>
</div>

<div id=\"contentFrame\" style=\"display:none;\">
    <iframe frameborder=\"0\" src=\"/achagua/sistema/web/bundles/Llanogas/templates/formatoCondonacionBio.html\" id=\"iframePrint\"></iframe>
</div>

<!--División para consulta de conceptos de factura -->

<div id=\"divConceptosFactura\" style=\"display:none;\">
    <table id=\"tblConceptosCondonable\" class=\"tabla\"></table>
    <table id=\"tblConceptosNoCondonable\" class=\"tabla\"></table>
</div>
<div id=\"divConfirmCancelar\" style=\"display:none\">
    <p>Se cancelará la condonación actual ¿Desea continuar?</p>
</div>
<div id=\"divMotivos\" style=\"display:none\">
    <label for=\"cmbMotivo\">Motivo de condonación:</label>
    ";
        // line 146
        echo (isset($context["cmbMotivosNota"]) ? $context["cmbMotivosNota"] : $this->getContext($context, "cmbMotivosNota"));
        echo "
    <label for=\"txtDescripcion\">Descripción:</label>
    <textarea id=\"txtDescripcion\" maxlength=\"255\"></textarea>
</div>
";
    }

    // line 151
    public function block_javascripts($context, array $blocks = array())
    {
        // line 152
        echo "    <script type=\"text/javascript\" src=\"";
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/cartera/condonarCartera/condonarCartera.modelo.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 153
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/cartera/condonarCartera/condonarCartera.control.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 154
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/cartera/impresionformatos.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 155
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/cartera/condonarCartera/condonarCartera.vista.js"), "html", null, true);
        echo "\"></script>
    
";
    }

    public function getTemplateName()
    {
        return "LlanogasLlanogasBundle:Cartera:CondonarCarteraCorriente.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  221 => 155,  217 => 154,  213 => 153,  208 => 152,  205 => 151,  196 => 146,  68 => 20,  65 => 19,  57 => 17,  52 => 14,  40 => 5,  35 => 4,  32 => 3,);
    }
}
