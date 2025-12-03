<?php

/* LlanogasLlanogasBundle:Recaudos:recaudorapido.html.twig */
class __TwigTemplate_3aced4c9ca7df970f296bb6fd3c8b27a6f51919371c3ecac4d92f76a16ec023c extends Twig_Template
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

    // line 2
    public function block_stylesheets($context, array $blocks = array())
    {
        // line 3
        echo "

    <link rel=\"stylesheet\" type=\"text/css\" href=\"";
        // line 5
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/theme/jquery.ui.all.css"), "html", null, true);
        echo "\" />
    <link rel=\"stylesheet\" type=\"text/css\" href=\"";
        // line 6
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/recaudos/abonos.estilo.css"), "html", null, true);
        echo "\" />
    <link rel=\"stylesheet\" type=\"text/css\" href=\"";
        // line 7
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/theme/jquery.datetimepicker.css"), "html", null, true);
        echo "\" />

";
    }

    // line 11
    public function block_scripts($context, array $blocks = array())
    {
        // line 12
        echo "
";
    }

    // line 15
    public function block_titulo($context, array $blocks = array())
    {
        echo "Recaudos: Recaudo Rápido - ";
        echo twig_escape_filter($this->env, (isset($context["empresa"]) ? $context["empresa"] : $this->getContext($context, "empresa")), "html", null, true);
        echo "  ";
    }

    // line 16
    public function block_body($context, array $blocks = array())
    {
        // line 17
        echo "

    <div id=\"divComandos\">
        <div class=\"divBotones\">
            <input type=\"button\" value=\"grabar\" id=\"btnGrabar\" class=\"btn\" />
            <input type=\"button\" value=\"imprimir\" id=\"btnImprimir\" class=\"btn\" style=\"display:none;\" />
            <input type=\"button\" value=\"cancelar\" id=\"btnCancelar\" class=\"btn\" />
        </div>
    </div>

    <div id=\"divPanelContenedor\">

        <div id=\"divCabecera\">
            <div class=\"divIzquierda\">
                <fieldset>
                    <legend>Información</legend>
                    <div class=\"campoCorto\">
                        <label for=\"txtSuscripcion\">Suscripción:</label>
                        <input type=\"text\" id=\"txtSuscripcion\" autofocus />
                    </div>

                    <div class=\"campo\">
                        <label for=\"txtFactura\">Factura:</label>
                        <input type=\"text\" id=\"txtFactura\" maxlength=\"18\" disabled=\"disabled\"/>
                    </div>

                    <div class=\"campo\">
                        <label for=\"txtFechaVencimiento\">Fecha Vencimiento:</label>
                        <input type=\"text\" id=\"txtFechaVencimiento\" disabled=\"disabled\" />
                    </div>
                    <div class=\"campoCorto\">
                        <label for=\"txtValorPagado\">Valor por Pagar:</label>
                        <input type=\"text\" id=\"txtValorPagado\" disabled=\"disabled\" />
                    </div>
                </fieldset>
                <div id=\"divDetalles\">
                    <div id=\"divFacturas\">
                        <table id=\"tblFacturas\" class=\"tabla\"></table>
                        <div class=\"campo\">
                                <label for=\"txtSaldoActual\">Saldo Actual: </label>
                                <input type=\"text\" id=\"txtSaldoActual\" disabled=\"disabled\" />
                            </div>
                    </div>
                </div>
            </div>
            <div class=\"divDerecha\">
                <fieldset>
                    <legend>Información del Pago</legend>
                    <div class=\"campoBusqueda\">
                        <label for=\"btnFormaPago\">Valor y formas de Pago:</label>
                        <input type=\"text\" id=\"txtFormaPago\" disabled=\"disabled\" />
                        <button id=\"btnFormaPago\"></button>
                    </div>
                   
                    
                    <div class=\"campo\">
                        <label for=\"cmbClasePago\">Clase de Pago:</label>
                        ";
        // line 74
        echo (isset($context["cmbClasePago"]) ? $context["cmbClasePago"] : $this->getContext($context, "cmbClasePago"));
        echo "
                    </div>
                    <div class=\"campo\">
                        <label for=\"cmbMedioPago\">Medio de pago:</label>
                        ";
        // line 78
        echo (isset($context["cmbMedioPago"]) ? $context["cmbMedioPago"] : $this->getContext($context, "cmbMedioPago"));
        echo "
                    </div>
                    <div class=\"campo\">
                        <label for=\"cmbSucursal\">Sucursal:</label>
                        ";
        // line 82
        echo (isset($context["cmbSucursal"]) ? $context["cmbSucursal"] : $this->getContext($context, "cmbSucursal"));
        echo "
                    </div>
                     <div id=\"divOcultar\">
                        <div class=\"campo\" id=\"divRadioTimbre\">
                            <label>Imprimir timbre</label>
                            <label style=\"display : inline\" for=\"rbtnS\">
                                <input type=\"radio\" id=\"rbtnS\" name=\"radioTimbre\" checked/> Sí
                            </label>
                            <label style=\"display : inline\" for=\"rbtnN\">
                                <input type=\"radio\" id=\"rbtnN\" name=\"radioTimbre\"/> No
                            </label>
                        </div>
                        <div class=\"campoBusqueda\">
                            <label for=\"btnBuscarEmpresa\">Empresa:</label>
                            <input type=\"text\" id=\"txtEmpresa\" disabled=\"disabled\" />
                            <button id=\"btnBuscarEmpresa\"></button>
                        </div>
                        <p class=\"pMensaje\" id=\"pMensajeEmpresa\"></p>
                        <div class=\"campo\">
                            <label for=\"txtFechaPago\">Fecha pago:</label>
                            <input type=\"text\" id=\"txtFechaPago\" value=\"";
        // line 102
        echo twig_escape_filter($this->env, (isset($context["fechasugerida"]) ? $context["fechasugerida"] : $this->getContext($context, "fechasugerida")), "html", null, true);
        echo "\" />
                        </div>
                        <fieldset>
                            <legend>Información anticipo</legend>
                            <div class=\"campo\">
                                <label for=\"cmbTiposDocumento\">Tipo Documento:</label>
                                <select id=\"cmbTiposDocumento\"></select>
                            </div>

                            <div class=\"campo\">
                                <label for=\"cmbDocumentos\">Clase de pago:</label>
                                ";
        // line 113
        echo (isset($context["cmbDocumentos"]) ? $context["cmbDocumentos"] : $this->getContext($context, "cmbDocumentos"));
        echo "
                            </div>
                        </fieldset>
                    </div>
                    <input type=\"button\" value=\"Grabar\" id=\"btnGrabarFinal\" class=\"btnSimple\" />
                </fieldset>
            </div>
        </div>

    </div>
    <hr class=\"limpiar\" />
    <input type=\"hidden\"  value=\"";
        // line 124
        echo twig_escape_filter($this->env, (isset($context["idempresa"]) ? $context["idempresa"] : $this->getContext($context, "idempresa")), "html", null, true);
        echo "\" id=\"txtIdEmpresaHide\"/>


    <!-- Division de Formas de pago -->
    <div id=\"divFormasPago\" style=\"display: none;\">
        <div id=\"controlesFormasPago\" style=\"max-height: 350px;overflow-y: scroll;\"></div>
        <div style=\"margin-top: 15px;\">
            <button id=\"btnAgregarForma\" class=\"btnSimple\">Agregar Forma</button>
            <label for=\"txtSumatoria\" style=\"display:inline !important;\">Total:</label>
            <input type=\"text\" id=\"txtSumatoria\" disabled=\"disabled\" />
        </div>
    </div>
    <div id=\"divEmpresaConvenio\" style=\"display:none;\">
        <div class=\"listaSeleccion\" id=\"divEmpresas\"></div>
    </div>
    <div id=\"divPagoError\" style=\"display:none;\">
        <p>
            No se puede efectuar este pago porque el valor de las facturas no es igual al valor registrado.
        </p>
        <div>
            <p id=\"pValor\"><strong>Valor registrado: </strong> <span></span></p>
            <p id=\"pValorFact\"><strong>Valor de la factura: </strong> <span></span></p>
        </div>
    </div>
    <!-- Iframe para el timbre -->
    <div id=\"divTimbre\" style=\"display:none;\">
        <iframe id=\"iFrameTimbre\" frameborder=\"0\" src=\"";
        // line 150
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/templates/frametimbre.html"), "html", null, true);
        echo "\"></iframe>
    </div>
";
    }

    // line 154
    public function block_javascripts($context, array $blocks = array())
    {
        // line 155
        echo "    <script type=\"text/javascript\" src=\"";
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/cartera/financiacion/convertirPrecios.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 156
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/recaudos.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 157
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/rapido/rapido.control.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 158
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/rapido/rapido.modelo.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 159
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/rapido/rapido.vista.js"), "html", null, true);
        echo "\"></script>
";
    }

    public function getTemplateName()
    {
        return "LlanogasLlanogasBundle:Recaudos:recaudorapido.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  253 => 159,  249 => 158,  245 => 157,  241 => 156,  236 => 155,  233 => 154,  226 => 150,  197 => 124,  183 => 113,  169 => 102,  146 => 82,  139 => 78,  132 => 74,  73 => 17,  70 => 16,  62 => 15,  57 => 12,  54 => 11,  47 => 7,  43 => 6,  39 => 5,  35 => 3,  32 => 2,);
    }
}
