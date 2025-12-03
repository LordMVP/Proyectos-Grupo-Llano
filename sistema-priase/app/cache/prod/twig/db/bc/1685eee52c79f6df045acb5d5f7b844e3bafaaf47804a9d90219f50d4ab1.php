<?php

/* LlanogasLlanogasBundle:Recaudos:modificarRecaudo.html.twig */
class __TwigTemplate_dbbc1685eee52c79f6df045acb5d5f7b844e3bafaaf47804a9d90219f50d4ab1 extends Twig_Template
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
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/recaudos/modificar.estilo.css"), "html", null, true);
        echo "\" />
    <link rel=\"stylesheet\" type=\"text/css\" href=\"";
        // line 6
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/theme/jquery.datetimepicker.css"), "html", null, true);
        echo "\" />
";
    }

    // line 9
    public function block_scripts($context, array $blocks = array())
    {
        // line 10
        echo "
";
    }

    // line 13
    public function block_titulo($context, array $blocks = array())
    {
        echo " Modificar Recaudo  ";
    }

    // line 15
    public function block_body($context, array $blocks = array())
    {
        // line 16
        echo "
    <div id=\"divComandos\">

        <div class=\"divBotones\">
            <input type=\"button\" value=\"buscar\" id=\"btnBuscar\" class=\"btn\" />
            <input type=\"button\" value=\"grabar\" id=\"btnGrabar\" class=\"btn\" />
            <input type=\"button\" value=\"cancelar\" id=\"btnCancelar\" class=\"btn\" />
        </div>
    </div>

    <div id=\"divPanelContenedor\">


        <div id=\"divCabecera\">
            <div class=\"divIzquierda\">

                <!-- Emergente para confirmar cancelación de la operación-->
                <div id=\"divConfirmarCancelar\">
                    <p>¿Está seguro de cancelar la operación?</p>
                </div>

                <!-- Emergente para buscar un recaudo-->
                <div id=\"divBuscarRecaudo\">

                    <div class=\"campo\">
                        <label for=\"txtMunicipio\">Municipio:</label>
                        <input type=\"text\" id=\"txtMunicipio\"/>
                    </div>

                    <div class=\"campo\">
                        <label for=\"txtFechaInicio\">Fecha Inicio:</label>
                        <input type=\"text\" id=\"txtFechaInicio\"/>
                    </div>

                    <div class=\"campo\">
                        <label for=\"txtFechaFin\">Fecha Fin:</label>
                        <input type=\"text\" id=\"txtFechaFin\"/>
                    </div>

                    <div class=\"campo\">
                        <label for=\"cboClasePago\">Clase Pago:</label>
                        <select id=\"cboClasePago\" >
                            <option value=\"-1\">Seleccione</option>
                            ";
        // line 59
        $context['_parent'] = (array) $context;
        $context['_seq'] = twig_ensure_traversable((isset($context["listaclases"]) ? $context["listaclases"] : $this->getContext($context, "listaclases")));
        foreach ($context['_seq'] as $context["_key"] => $context["clasepago"]) {
            // line 60
            echo "                                <option value=\"";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["clasepago"]) ? $context["clasepago"] : $this->getContext($context, "clasepago")), "idclase"), "html", null, true);
            echo "\">";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["clasepago"]) ? $context["clasepago"] : $this->getContext($context, "clasepago")), "clase"), "html", null, true);
            echo "</option>
                            ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['clasepago'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 62
        echo "                        </select>
                    </div>

                    <div class=\"campo\">
                        <label for=\"txtSuscripcion\">Suscripción:</label>
                        <input type=\"text\" id=\"txtSuscripcion\"/>
                    </div>

                    <div class=\"campo\">
                        <label for=\"txtCedula\">Cédula:</label>
                        <input type=\"text\" id=\"txtCedula\" />
                    </div>

                    <div class=\"campo\">
                        <label for=\"txtCodigoAnterior\">Código Anterior:</label>
                        <input type=\"text\" id=\"txtCodigoAnterior\" />
                    </div>        
                    <div class=\"campo\">
                        <label for=\"txtIdRegistroFiltro\">Id Recaudo:</label>
                        <input type=\"text\" id=\"txtIdRegistroFiltro\" />
                    </div>

                    <input type =\"button\" id=\"btnBuscar\" class=\"btnSimple\" value=\"Buscar\"/>

                    <span id=\"spanMensaje\" class=\"pMensaje\"></span>

                    <div class=\"listaSeleccion\"></div> 



                </div>

                <!--Fieldset para mostrar información del suscriptor-->
                <fieldset id=\"fieldsetInformacionSuscriptor\">
                    <legend>Información del Recaudo</legend>
                    <div class=\"campoCorto\">
                        <label for=\"txtIdRecaudo\">ID del Recaudo:</label>
                        <input type=\"text\" id=\"txtIdRecaudo\" disabled=\"disabled\" />
                    </div>

                    <div class=\"campoCorto\">
                        <label for=\"txtFecha\">Fecha:</label>
                        <input type=\"text\" id=\"txtFecha\" disabled=\"disabled\" />
                    </div>

                    <div class=\"campoCorto\">
                        <label for=\"txtDocumento\">NIT/CC:</label>
                        <input type=\"text\" id=\"txtDocumento\" disabled=\"disabled\" />
                    </div>
                    <div class=\"campo\">
                        <label for=\"txtNombreTercero\">Nombre del Tercero:</label>
                        <input type=\"text\" id=\"txtNombreTercero\" disabled=\"disabled\" />
                    </div>
                    <div class=\"campoCorto\">
                        <label for=\"txtConvenio\">Convenio:</label>
                        <input type=\"text\" id=\"txtConvenio\" disabled=\"disabled\" />
                    </div>

                    <div id=\"divSuscripciones\">
                        <table id=\"tblSuscripciones\" class=\"tabla\"></table>
                    </div>

                    <div id=\"divFacturas\">
                        <table id=\"tblFacturas\" class=\"tabla\"></table>
                    </div>

                </fieldset>

                <fieldset id=\"fieldsetEditarFormasPago\" >
                    <div id=\"divFormasPago\">
                        <table id=\"tblFormasPago\" class=\"tabla\"></table>
                        <button id=\"btnAgregarFormaPago\" class=\"btnSimple\">Agregar Forma Pago</button>
                    </div>
                    <div id=\"divDistribucionRecaudo\">
                        <table id=\"tblDistribucionRecaudo\" class=\"tabla\"></table>
                    </div>
                    <div class=\"campo\">
                        <label for=\"txtValorTotalRecaudo\">Valor Total Recaudo:</label>
                        <input type=\"text\" id=\"txtValorTotalRecaudo\" disabled=\"disabled\" />
                    </div>

                    <div class=\"campo\">
                        <label for=\"txtValorParcial\">Valor Parcial:</label>
                        <input type=\"text\" id=\"txtValorParcial\" disabled=\"disabled\" />
                    </div>
                </fieldset>

            </div>


          

            <div class=\"divDerecha\">
                <fieldset id=\"fieldsetModificarRecaudo\">
                    <legend>Modificación del Recaudo</legend>

                    <div class=\"campo\">
                        <label for=\"cmbMedioPago\">Medio de pago:</label>
                        <select id=\"cmbMedioPago\">
                            <option value=\"-1\">Seleccione</option>
                            ";
        // line 162
        $context['_parent'] = (array) $context;
        $context['_seq'] = twig_ensure_traversable((isset($context["listamediopago"]) ? $context["listamediopago"] : $this->getContext($context, "listamediopago")));
        foreach ($context['_seq'] as $context["_key"] => $context["mediopago"]) {
            // line 163
            echo "                                <option value=\"";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["mediopago"]) ? $context["mediopago"] : $this->getContext($context, "mediopago")), "id"), "html", null, true);
            echo "\">";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["mediopago"]) ? $context["mediopago"] : $this->getContext($context, "mediopago")), "nombre"), "html", null, true);
            echo "</option>
                            ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['mediopago'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 165
        echo "                        </select> 
                    </div>

                    <div class=\"campo\">
                        <label for=\"cmbSucursal\">Sucursal:</label>
                        <select id=\"cmbSucursal\">
                            <option value=\"-1\">Seleccione</option>
                            ";
        // line 172
        $context['_parent'] = (array) $context;
        $context['_seq'] = twig_ensure_traversable((isset($context["listasucursales"]) ? $context["listasucursales"] : $this->getContext($context, "listasucursales")));
        foreach ($context['_seq'] as $context["_key"] => $context["sucursal"]) {
            // line 173
            echo "                                <option value=\"";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["sucursal"]) ? $context["sucursal"] : $this->getContext($context, "sucursal")), "idsucursal"), "html", null, true);
            echo "\">";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["sucursal"]) ? $context["sucursal"] : $this->getContext($context, "sucursal")), "sucursal"), "html", null, true);
            echo "</option>
                            ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['sucursal'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 175
        echo "                        </select> 
                    </div>

                    <div class=\"campo\">
                        <label for=\"txtFechaPago\">Fecha de Pago:</label>
                        <input type=\"text\" id=\"txtFechaPago\" />
                    </div>
                    <div class=\"campo\">
                        <label for=\"cboDocumentoValido\">Documento:</label>
                        <select id=\"cboDocumentoValido\" >
                        </select>
                    </div>                                             

                    <div id=\"mensajeRecaudoConsignado\" class=\"campo\">
                        <p>El recaudo ya ha sido consignado, no es posile realizar modificaciones.</p>
                    </div>


                </fieldset>
            </div>
        </div>

        <!-- Division de Agregar Forma de pago -->
        <div id=\"dialogoAgregarFormaPago\" style=\"display: none;\">
            <div id=\"controlesFormasPago\" style=\"max-height: 350px;overflow-y: scroll;\">
                <div id=\"divFormaPago\">
                    <div class=\"campo\">
                        <label for=\"cmbFormaPago\">Forma de Pago</label>
                        <select id=\"cmbFormaPago\">
                            <option value=\"75\">Efectivo</option>
                            <option value=\"76\">Tarjeta Crédito</option>
                            <option value=\"77\">Tarjeta Débito</option>
                            <option value=\"78\">Cheque</option>
                        </select>
                    </div>

                    <div class=\"campo\">
                        <label for=\"txtValor\">Valor:</label>
                        <input type=\"text\" id=\"txtValor\" />
                    </div>

                    <div class=\"campo\">
                        <label for=\"txtSaldoPendiente\">Saldo Pendiente:</label>
                        <input type=\"text\" id=\"txtSaldoPendiente\" disabled=\"disabled\"/>
                    </div>

                    <div id=\"divdetallesFormaPago\" style=\"display:none;\">
                        <div class=\"campo\">
                            <label for=\"txtDocGirador\">NIT/CC Girador:</label>
                            <input type=\"text\" id=\"txtDocGirador\" maxlength=\"10\" />    
                        </div>
                        <div class=\"campo\">
                            <label for=\"txtNombreGirador\">Nombre Girador:</label>
                            <input type=\"text\" id=\"txtNombreGirador\" maxlength=\"50\" />
                        </div>
                        <div class=\"campo\">
                            <label for=\"cmbBanco\">Banco:</label>
                            <select id=\"cmbBanco\"></select>
                        </div>
                    </div>

                    <div id=\"divDetallesTarjeta\" style=\"display:none;\">
                        <div class=\"campo\">
                            <label for=\"cmbFranquicia\">Franquicia:</label>
                            <select id=\"cmbFranquicia\">
                                <option value=\"Visa\">Visa</option>
                                <option value=\"MasterCard\">MasterCard</option>
                                <option value=\"American Express\">American Express</option>
                                <option value=\"Diners Club\">Diners Club</option>
                            </select>
                        </div>
                        <div class=\"campo\">
                            <label for=\"txtNumTarjeta\">Número de Tarjeta:</label>
                            <input id=\"txtNumTarjeta\" type=\"text\" placeholder=\"0000-0000-0000-0000\" />
                        </div>
                        <div class=\"campo\">
                            <label for=\"txtFechaExpiracion\">Fecha de Vencimiento Tarjeta:</label>
                            <input id=\"txtFechaExpiracion\" type=\"text\" placeholder=\"mm/aa\" />
                        </div>  
                    </div>

                    <div id=\"divDetallesCheque\" style=\"display:none;\">
                        <div class=\"campo\">
                            <label for=\"txtNumCuenta\">Número de la cuenta:</label>
                            <input type=\"text\" id=\"txtNumCuenta\" maxlength=\"10\" />    
                        </div>
                        <div class=\"campo\">
                            <label for=\"txtNumCheque\">Número de cheque:</label>
                            <input type=\"text\" id=\"txtNumCheque\" maxlength=\"4\" />    
                        </div>
                    </div>
                </div>
            </div>
        </div>
  <!-- Division de adicion de anticipo -->
            <div id=\"divAnticipo\" style=\"display: none;\">
                <div class=\"campo\">
                    <label for=\"cmbTipoDocumento\">Tipo de Documento:</label>
                    <select id=\"cmbTipoDocumento\"></select>
                </div>
                <div class=\"campo\">
                    <label for=\"cmbDocumentos\">Documentos:</label>
                    <select id=\"cmbDocumentos\"></select>
                </div>
                <div class=\"campo\">
                    <label for=\"cmbTipoLiquidacion\">Tipo de Liquidación:</label>
                    <select id=\"cmbTipoLiquidacion\"></select>
                </div>
                <div class=\"campo\">
                    <label for=\"cmbConcepto\">Concepto:</label>
                    <select id=\"cmbConcepto\"></select> 
                </div>               
                <div class=\"campo\">
                    <label for=\"cmbPeriodos\">Periodos:</label>
                    <select id=\"cmbPeriodos\"></select> 
                </div>               
                <p class=\"pMensaje\"></p>
            </div>   
  




    ";
    }

    // line 299
    public function block_javascripts($context, array $blocks = array())
    {
        // line 300
        echo "        <script type=\"text/javascript\" src=\"";
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/recaudos.js"), "html", null, true);
        echo "\"></script>
        <script type=\"text/javascript\" src=\"";
        // line 301
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/modificar/modificarrecaudo.modelo.js"), "html", null, true);
        echo "\"></script>
        <script type=\"text/javascript\" src=\"";
        // line 302
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/modificar/modificarrecaudo.control.js"), "html", null, true);
        echo "\"></script>
        <script type=\"text/javascript\" src=\"";
        // line 303
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/modificar/modificarrecaudo.vista.js"), "html", null, true);
        echo "\"></script>
    ";
    }

    public function getTemplateName()
    {
        return "LlanogasLlanogasBundle:Recaudos:modificarRecaudo.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  411 => 303,  407 => 302,  403 => 301,  398 => 300,  395 => 299,  268 => 175,  257 => 173,  253 => 172,  244 => 165,  233 => 163,  229 => 162,  127 => 62,  116 => 60,  112 => 59,  67 => 16,  64 => 15,  58 => 13,  53 => 10,  50 => 9,  44 => 6,  40 => 5,  35 => 4,  32 => 3,);
    }
}
