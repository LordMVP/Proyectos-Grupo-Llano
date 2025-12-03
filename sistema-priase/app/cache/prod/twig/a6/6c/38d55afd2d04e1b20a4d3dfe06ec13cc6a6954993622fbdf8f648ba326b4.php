<?php

/* LlanogasLlanogasBundle:Recaudos:flujoAprobacion.html.twig */
class __TwigTemplate_a66c38d55afd2d04e1b20a4d3dfe06ec13cc6a6954993622fbdf8f648ba326b4 extends Twig_Template
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
        echo "    <!-- Latest compiled and minified CSS -->

    <link rel=\"stylesheet\" type=\"text/css\" href=\"";
        // line 6
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/theme/jquery.ui.all.css"), "html", null, true);
        echo "\" />
    <link href=\"";
        // line 7
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/recaudos/consignaciones.css"), "html", null, true);
        echo "\" media=\"screen\" type=\"text/css\" rel=\"stylesheet\" />

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
        echo "Recaudos: Flujo de aprobación - ";
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
            <button id=\"btnBuscar\" class=\"btn\"> buscar</button>
            <button id=\"btnAprobar\" data-id=\"A\" class=\"btn\"> aprobar</button>
            <button id=\"btnEliminar\" data-id=\"E\" class=\"btn\"> eliminar</button>
            <button id=\"btnCancelar\" class=\"btn\"> cancelar</button>
        </div>
    </div>

    <div id=\"divPanelContenedor\">
        <div class=\"divRecaudos\">
            <fieldset>
                <legend>Recaudos</legend>
                <div class=\"campoCorto\">
                    <label for=\"txtMedioPago\">Medio de pago:</label>
                    <input type=\"text\" id=\"txtMedioPago\" disabled=\"disabled\" />
                </div>
                <div class=\"campo\">
                    <label for=\"txtSucursal\">Sucursal:</label>
                    <input type=\"text\" id=\"txtSucursal\" disabled=\"disabled\"/>
                </div>
                <div class=\"campo\">
                    <label for=\"txtDocumento\">Documento:</label>
                    <input type=\"text\" id=\"txtDocumento\" disabled=\"disabled\"/>
                </div>
                <div class=\"campoCorto\">
                    <label for=\"txtFecha\">Fecha:</label>
                    <input type=\"text\" id=\"txtFecha\" disabled=\"disabled\" />
                </div>
                <p id=\"pMensaje\" class=\"pMensaje\"></p>
                <div class=\"divCabecera\" id=\"divCabecera\">
                    <div class=\"divIzquierda\">
                        <div id=\"divFechasRecaudo\">
                            <table id=\"tblFechaRecaudo\" class=\"tabla\"></table>
                        </div>
                    </div>
                    <div class=\"divDerecha\" >
                        <div id=\"divRecaudoEmpresa\">
                            <table id=\"tblRecaudoEmpresa\" class=\"tabla\"></table>
                            <div id=\"divValor\" style=\"text-align:right;padding-right:20px;\">
                                <label for=\"txtTotalRecaudoEmpresa\">Total: </label>
                                <input type=\"text\" id=\"txtTotalRecaudoEmpresa\" class=\"campo\" disabled=\"disabled\"/>
                                <div>
                                    <button id=\"btnVerRecaudoEmpresa\" class=\"btnSimple\">Ver recaudo</button>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </fieldset>
        </div>
        <div id=\"divConsignacion\" style=\"display:none;\">
            <fieldset>
                <legend>Consignación</legend>
                <div id=\"divConsignaciones\" >

                    <div id=\"controlesFormasPago\">
                        <div id=\"divEfectivo\" data-forma=\"Efectivo\" class=\"contenedorFormaPago\" style=\"display:none\">
                            <div class=\"cabeceraForma\">
                                <div class=\"title\" id=\"titleEfectivo\">
                                    <h3>Forma pago <strong>Efectivo</strong></h3>
                                </div>
                            </div>

                            <div class=\"divCabecera\" id=\"contenidoEfectivo\">
                                <div class=\"divIzquierda\" style=\"width: 20%\">
                                    <div id=\"divValorFormaPagoEfectivo\" style=\"vertical-align:top;margin-top:20px;\">
                                        <label>Valor: </label>
                                        <input type=\"text\" id=\"txtValorFormaPagoEfectivo\" disabled=\"disabled\"/>
                                    </div>
                                </div>

                                <div class=\"divDerecha\" style=\"width: 80%\">
                                    <table id=\"tblBancosEfectivo\" class=\"tabla\"></table>

                                </div>
                            </div>
                        </div>



                        <div id=\"divCheque\" data-forma=\"Cheque\" class=\"contenedorFormaPago\" style=\"display:none\">
                            <div class=\"cabeceraForma\">
                                <div class=\"title\" id=\"titleCheque\">
                                    <h3>Forma pago <strong>Cheque</strong></h3>
                                </div>
                            </div>

                            <div class=\"divCabecera\" id=\"contenidoCheque\">
                                <div class=\"divIzquierda\" style=\"width: 20%\">
                                    <div id=\"divValorFormaPagoCheque\" style=\"vertical-align:top;margin-top:20px;\">
                                        <label>Valor: </label>
                                        <input type=\"text\" id=\"txtValorFormaPagoCheque\" disabled=\"disabled\"/>
                                    </div>
                                </div>

                                <div class=\"divDerecha\" style=\"width: 80%\">
                                    <table id=\"tblBancosCheque\" class=\"tabla\"></table>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </fieldset>
            <fieldset id=\"divResumen\" style=\"display:none;\">
                <legend>Resumen</legend>
                <div id=\"divOpciones\">
                    <div class=\"campo\">
                        <label for=\"txtTotal\">Total Recaudado: </label>
                        <input type=\"text\" id=\"txtTotalRecaudado\" disabled=\"disabled\" />
                    </div>
                    <div class=\"campo\">
                        <label for=\"txtTotal\">Total Consignado: </label>
                        <input type=\"text\" id=\"txtTotalConsignado\" disabled=\"disabled\" />
                    </div>
                    <div class=\"campoCorto\">
                        <label for=\"txtFaltante\">Faltante: (CxCobrar)</label>
                        <input type=\"text\" id=\"txtFaltante\" disabled=\"disabled\" value=\"0\"/>
                    </div>

                    <div class=\"campoCorto\">
                        <label for=\"txtSobrante\">Sobrante: (Aprovechamiento)</label>
                        <input type=\"text\" id=\"txtSobrante\" disabled=\"disabled\" value=\"0\"/>
                    </div>
                    <div class=\"campoCorto\">
                        <label for=\"txtGastos\">Gasto: </label>
                        <input type=\"text\" id=\"txtGasto\" disabled=\"disabled\" value=\"0\"/>
                    </div>
                    <div class=\"campoCorto\">
                        <label for=\"txtCuentaPorPagar\">Cuenta por Pagar: </label>
                        <input type=\"text\" id=\"txtCuentaPorPagar\" disabled=\"disabled\" value=\"0\"/>
                    </div>
                    <div class=\"campo\">
                        <label for=\"cmbResponsable\">Responsable: </label>
                        <select id=\"cmbResponsable\">
                            <option value=\"-1\">Seleccione una opción</option>
                        </select>
                    </div>
                    <div class=\"campo\">
                        <label for=\"cmbTipoDocumento\">Tipo documento: </label>
                        <select id=\"cmbTipoDocumento\">
                            <option value=\"-1\">Seleccione una opción</option>
                        </select>
                    </div>
                    <div>
                        <label for=\"txtdescripcionseven\">Descripción seven</label>
                        <textarea id=\"txtdescripcionseven\" maxlength=\"200\" ></textarea>
                    </div>
                </div>
            </fieldset>
            <fieldset id=\"divSoporte\" style=\"display:none;\">
                <legend>Soportes</legend>
                <div id=\"divArchivos\"></div>
                <p id=\"pMensajeArchivo\" class=\"pMensaje\"></p>
            </fieldset>
        </div>
    </div>


    <div id=\"camposBuscarSuscripcion\" style=\"display:none;\" >
        <div class=\"campo\">
            <label for=\"txtNroConsignacion\">Número consignación:</label>
            <input type=\"text\" id=\"txtNroConsignacion\" data-attr=\"nroConsignacion\" maxlength=\"20\" />
        </div>
        <div class=\"campo\">
            <label for=\"cmbMedioPagoFiltro\">Medio de pago:</label>
            <select id=\"cmbMedioPagoFiltro\">
                <option value=\"-1\">Seleccione una opción</option>
                ";
        // line 190
        $context['_parent'] = (array) $context;
        $context['_seq'] = twig_ensure_traversable((isset($context["listamediospagos"]) ? $context["listamediospagos"] : $this->getContext($context, "listamediospagos")));
        foreach ($context['_seq'] as $context["_key"] => $context["medio"]) {
            // line 191
            echo "                    <option value=\"";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["medio"]) ? $context["medio"] : $this->getContext($context, "medio")), "id"), "html", null, true);
            echo "\">";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["medio"]) ? $context["medio"] : $this->getContext($context, "medio")), "nombre"), "html", null, true);
            echo "</option>
                ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['medio'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 193
        echo "
            </select>
        </div>
        <div class=\"campo\">
            <label for=\"txtFecha\">Fecha inicial:</label>
            <input type=\"text\" id=\"txtFechaIFiltro\" data-attr=\"fecha\" maxlength=\"15\" />
        </div>
        <div class=\"campo\">
            <label for=\"txtFecha\">Fecha final:</label>
            <input type=\"text\" id=\"txtFechaFFiltro\" data-attr=\"fecha\" maxlength=\"15\" />
        </div>
        <button id=\"btnBuscarFiltro\" class=\"btnSimple\">Buscar</button>
        <span id=\"spanMensaje\" class=\"pMensaje\"></span>
        <div id=\"divListaSelección\"></div>
    </div>

    <div id=\"divErrores\">
        <p id=\"pErrorGlobal\"></p>
    </div>
    <!-- Division de Formas de pago -->
    <div id=\"divFormasPago\" style=\"display: none;\">
        <div id=\"controlesFormasPago\" style=\"max-height: 350px;overflow-y: scroll;\"></div>
        <div style=\"margin-top: 15px;\">
            <label for=\"txtSumatoria\" style=\"display:inline !important;\">Total:</label>
            <input type=\"text\" id=\"txtSumatoria\" disabled=\"disabled\" />
        </div>
    </div>

    <div id=\"divRecaudos\" style=\"display: none;\">
    </div>


    <!-- Confirmación de cancelación -->
    <div id=\"divConfirmCancelar\" style=\"display: none;\">
        <p>Se cancelará la consignación, ¿Desea continuar?</p>
    </div>

    <div id=\"divCambioConsignacion\" style=\"display: none\">
        <p>La consignación se va a <span></span> ¿Desea continuar?</p>
    </div>
";
    }

    // line 235
    public function block_javascripts($context, array $blocks = array())
    {
        // line 236
        echo "    <script type=\"text/javascript\" src=\"";
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/recaudos.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 237
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/flujoAprobacion/flujoAprobacion.control.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 238
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/flujoAprobacion/flujoAprobacion.modelo.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 239
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/flujoAprobacion/flujoAprobacion.vistaa.js"), "html", null, true);
        echo "\"></script>
";
    }

    public function getTemplateName()
    {
        return "LlanogasLlanogasBundle:Recaudos:flujoAprobacion.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  319 => 239,  315 => 238,  311 => 237,  306 => 236,  303 => 235,  259 => 193,  248 => 191,  244 => 190,  69 => 17,  66 => 16,  58 => 15,  53 => 12,  50 => 11,  43 => 7,  39 => 6,  35 => 4,  32 => 3,);
    }
}
