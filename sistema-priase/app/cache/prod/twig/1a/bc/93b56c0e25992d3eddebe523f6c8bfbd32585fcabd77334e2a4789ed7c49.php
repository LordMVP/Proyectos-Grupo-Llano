<?php

/* LlanogasLlanogasBundle:Recaudos:Consignaciones.html.twig */
class __TwigTemplate_1abc93b56c0e25992d3eddebe523f6c8bfbd32585fcabd77334e2a4789ed7c49 extends Twig_Template
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
    <link type=\"text/css\" rel=\"stylesheet\" href=\"";
        // line 8
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/recaudos/fileinput.min.css"), "html", null, true);
        echo "\" />

";
    }

    // line 12
    public function block_scripts($context, array $blocks = array())
    {
        // line 13
        echo "
";
    }

    // line 16
    public function block_titulo($context, array $blocks = array())
    {
        echo "Recaudos: Consignaciones - ";
        echo twig_escape_filter($this->env, (isset($context["empresa"]) ? $context["empresa"] : $this->getContext($context, "empresa")), "html", null, true);
        echo "  ";
    }

    // line 17
    public function block_body($context, array $blocks = array())
    {
        // line 18
        echo "
    <div id=\"divComandos\">
        <div class=\"divBotones\">
            <input type=\"button\" value=\"buscar\" id=\"btnEditar\" class=\"btn\" />
            <input type=\"button\" value=\"grabar\" id=\"btnGrabar\" class=\"btn\" />
            <input type=\"button\" value=\"cancelar\" id=\"btnCancelar\" class=\"btn\" />
        </div>
    </div>

    <div id=\"divPanelContenedor\">
        <div class=\"divRecaudos\">
            <fieldset>
                <legend>Recaudos</legend>
                <input type=\"text\" style=\"display: none;\" id=\"txtIdConsignacion\" data-id=\"\"/>
                <div class=\"campoCorto\">
                    <label for=\"cmbMedioPago\">Medio de pago:</label>
                    <select id=\"cmbMedioPago\">
                        <option value=\"-1\">Seleccione una opción</option>
                        ";
        // line 36
        $context['_parent'] = (array) $context;
        $context['_seq'] = twig_ensure_traversable((isset($context["listamediospagos"]) ? $context["listamediospagos"] : $this->getContext($context, "listamediospagos")));
        foreach ($context['_seq'] as $context["_key"] => $context["medio"]) {
            // line 37
            echo "                            <option value=\"";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["medio"]) ? $context["medio"] : $this->getContext($context, "medio")), "id"), "html", null, true);
            echo "\" data-tipo=\"";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["medio"]) ? $context["medio"] : $this->getContext($context, "medio")), "tipo"), "html", null, true);
            echo "\">";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["medio"]) ? $context["medio"] : $this->getContext($context, "medio")), "nombre"), "html", null, true);
            echo "</option>
                        ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['medio'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 39
        echo "                    </select>
                </div>
                <div class=\"campo\">
                    <label for=\"cmbSucursal\">Sucursal:</label>
                    <select id=\"cmbSucursal\">
                        <option value=\"-1\">Seleccione una opción</option>
                        ";
        // line 45
        $context['_parent'] = (array) $context;
        $context['_seq'] = twig_ensure_traversable((isset($context["listasucursales"]) ? $context["listasucursales"] : $this->getContext($context, "listasucursales")));
        foreach ($context['_seq'] as $context["_key"] => $context["sucursal"]) {
            // line 46
            echo "                            <option value=\"";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["sucursal"]) ? $context["sucursal"] : $this->getContext($context, "sucursal")), "idsucursal"), "html", null, true);
            echo "\">";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["sucursal"]) ? $context["sucursal"] : $this->getContext($context, "sucursal")), "sucursal"), "html", null, true);
            echo "</option>
                        ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['sucursal'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 48
        echo "                    </select>
                </div>
                <div class=\"campo\">
                    <label for=\"cmbDocumento\">Documento:</label>
                    <select id=\"cmbDocumento\">
                        ";
        // line 53
        $context['_parent'] = (array) $context;
        $context['_seq'] = twig_ensure_traversable((isset($context["listadocumentos"]) ? $context["listadocumentos"] : $this->getContext($context, "listadocumentos")));
        foreach ($context['_seq'] as $context["_key"] => $context["documento"]) {
            // line 54
            echo "                            <option value=\"";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["documento"]) ? $context["documento"] : $this->getContext($context, "documento")), "iddocumento"), "html", null, true);
            echo "\">";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["documento"]) ? $context["documento"] : $this->getContext($context, "documento")), "documento"), "html", null, true);
            echo "</option>
                        ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['documento'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 56
        echo "                    </select>
                </div>
                <div class=\"campoCorto\">
                    <label for=\"txtFecha\">Fecha:</label>
                    <input type=\"text\" id=\"txtFecha\" disabled=\"disabled\" value=\"";
        // line 60
        echo twig_escape_filter($this->env, (isset($context["fecha"]) ? $context["fecha"] : $this->getContext($context, "fecha")), "html", null, true);
        echo "\" />
                </div>
                <p id=\"pMensaje\" class=\"pMensaje\"></p>
                <div class=\"divCabecera\" id=\"divCabecera\">
                    <div class=\"divIzquierda\">
                        <div id=\"divFechasRecaudo\" style=\"display: none;\">
                            <table id=\"tblFechaRecaudo\" class=\"tabla\">

                            </table>
                            <button id=\"btnVerRecaudos\" class=\"btnSimple\">Cargar recaudos</button>
                        </div>
                    </div>
                    <div class=\"divDerecha\" >
                        <div id=\"divRecaudoEmpresa\" style=\"display: none;\">
                            <table id=\"tblRecaudoEmpresa\" class=\"tabla\"></table>
                            <div class=\"campo\">
                                <label for=\"txtTotalRecaudoEmpresa\">Total:</label>
                                <input type=\"text\" id=\"txtTotalRecaudoEmpresa\" class=\"campo\" disabled=\"disabled\"/>
                                <button id=\"btnVerRecaudoEmpresa\" class=\"btnSimple\">Ver recaudo</button>
                            </div>
                        </div>


                    </div>
                </div>
            </fieldset>
        </div>
        <div id=\"divConsignacion\" style=\"display: none;\">
            <fieldset>
                <legend>Consignación</legend>


                <div id=\"divConsignaciones\" >

                    <div id=\"controlesFormasPago\">
                        <div id=\"divEfectivo\" data-forma=\"Efectivo\" class=\"contenedorFormaPago\">
                            <div class=\"cabeceraForma\">
                                <div class=\"title\" id=\"titleEfectivo\">
                                    <h3>Forma pago <strong>Efectivo, Cheque, Tarjeta</strong> <span></span></h3>
                                </div>
                            </div>

                            <div class=\"divCabecera\" id=\"contenidoEfectivo\">
                                <div class=\"divIzquierda\" style=\"width: 20%\">
                                    <div id=\"divValorFormaPagoEfectivo\" class=\"campo\" style=\"width: 50%\">
                                        <label>Valor: </label>
                                        <input type=\"text\" id=\"txtValorFormaPagoEfectivo\"/>
                                    </div>
                                    <button id=\"btnAgregarBancoEfectivo\" class=\"btnSimple\">Agregar banco</button>
                                </div>

                                <div class=\"divDerecha\" style=\"width: 80%\">
                                    <table id=\"tblBancosEfectivo\" class=\"tabla\" style=\"display: none;\">
                                        <thead>
                                            <tr>
                                                <th id=\"thEmpresaEfectivo\">Empresa</th>
                                                <th id=\"thBancoEfectivo\">Banco</th>
                                                <th id=\"thTipoCuentaEfectivo\">Tipo cuenta</th>
                                                <th id=\"thCuentaEfectivo\">Cuenta</th>
                                                <th id=\"thValorEfectivo\">Valor</th>
                                                <th id=\"thFechaEfectivo\">Fecha</th>
                                                <th id=\"thEliminarEfectivo\">Eliminar</th>
                                            </tr>
                                        </thead>
                                        <tbody></tbody>
                                    </table>
                                    <table id=\"tblEfectivo\" class=\"tabla\" style=\"display: none\"></table>
                                    <div class=\"campo\" style=\"display: none\" id=\"divTotalEfectivo\">
                                        <label for=\"txtTotalEfectivo\">Total: </label>
                                        <input type=\"text\" disabled=\"disabled\" id=\"txtTotalEfectivo\"/>
                                    </div>
                                </div>
                            </div>
                        </div>



                        <div id=\"divCheque\" data-forma=\"Cheque\" class=\"contenedorFormaPago\">
                            <div class=\"cabeceraForma\">
                                <div class=\"title\" id=\"titleCheque\">
                                    <h3>Forma pago <strong>Cheque</strong><span></span></h3>
                                </div>
                            </div>

                            <div class=\"divCabecera\" id=\"contenidoCheque\">
                                <div class=\"divIzquierda\" style=\"width: 20%\">
                                    <div id=\"divValorFormaPagoCheque\" class=\"campo\" style=\"width: 50%\">
                                        <label>Valor: </label>
                                        <input type=\"text\" id=\"txtValorFormaPagoCheque\"/>
                                    </div>
                                    <button id=\"btnAgregarBancoCheque\" class=\"btnSimple\">Agregar banco</button>
                                </div>

                                <div class=\"divDerecha\" style=\"width: 80%\">
                                    <table id=\"tblBancosCheque\" class=\"tabla\" style=\"display: none;\">
                                        <thead>
                                            <tr>
                                                <th id=\"thEmpresaCheque\">Empresa</th>
                                                <th id=\"thBancoCheque\">Banco</th>
                                                <th id=\"thTipoCuentaCheque\">Tipo cuenta</th>
                                                <th id=\"thCuentaCheque\">Cuenta</th>
                                                <th id=\"thValorCheque\">Valor</th>
                                                <th id=\"thFechaCheque\">Fecha</th>
                                                <th id=\"thInformacionCheque\">Información adicional</th>
                                                <th id=\"thEliminarCheque\">Eliminar</th>
                                            </tr>
                                        </thead>
                                        <tbody></tbody>
                                    </table>
                                    <table id=\"tblCheque\" class=\"tabla\" style=\"display: none\"></table>
                                    <div class=\"campo\" style=\"display: none\" id=\"divTotalCheque\">
                                        <label for=\"txtTotalCheque\">Total: </label>
                                        <input type=\"text\" disabled=\"disabled\" id=\"txtTotalCheque\"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </fieldset>
            <fieldset>
                <legend>Resumen</legend>
                <div id=\"divOpciones\">
                    <div class=\"campoCorto\">
                        <label for=\"txtTotal\">Total Recaudado: </label>
                        <input type=\"text\" id=\"txtTotalRecaudado\" disabled=\"disabled\" />
                    </div>
                    <div class=\"campoCorto\">
                        <label for=\"txtTotalConsignado\">Total Consignado: </label>
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
                        <label for=\"txtGasto\">Gasto: </label>
                        <input type=\"text\" id=\"txtGasto\" disabled=\"disabled\" value=\"0\"/>
                    </div>
                    <div class=\"campoCorto\">
                        <label for=\"txtCuentaPorPagar\">Cuenta por Pagar: </label>
                        <input type=\"text\" id=\"txtCuentaPorPagar\" disabled=\"disabled\" value=\"0\"/>
                    </div>

                </div>
            </fieldset>
            <fieldset>
                <legend>Soportes</legend>
                <div>
                    <button id=\"btnAdjuntarArchivo\" class=\"btnSimple\">Adjuntar archivo</button>
                </div>
                <div id=\"archivoAdjunto\" style=\"display: none;\">
                    <input type=\"file\" id=\"txtArchivo\" multiple/>
                </div>
                <div id=\"divArchivos\">

                </div>
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
        // line 238
        $context['_parent'] = (array) $context;
        $context['_seq'] = twig_ensure_traversable((isset($context["listamediospagos"]) ? $context["listamediospagos"] : $this->getContext($context, "listamediospagos")));
        foreach ($context['_seq'] as $context["_key"] => $context["medio"]) {
            // line 239
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
        // line 241
        echo "            </select>
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
            <button id=\"btnAgregarForma\" class=\"btnSimple\">Agregar cheque</button>
            <label for=\"txtSumatoria\" style=\"display:inline !important;\">Total:</label>
            <input type=\"text\" id=\"txtSumatoria\" disabled=\"disabled\" />
        </div>
        <hr/>
        <div style=\"text-align: right\">
            <button id=\"btnAceptarFormasPago\" class=\"btnSimple\">Aceptar</button>
            <button id=\"btnCancelarFormasPago\" class=\"btnSimple\">Cancelar</button>
        </div>
    </div>

    <div id=\"divRecaudos\" style=\"display: none;\">
    </div>
    <div id=\"divCheques\" style=\"display: none;\">
        <table id=\"tblCheques\" class=\"tabla\"></table>
    </div>


    <!-- Confirmación de cancelación -->
    <div id=\"divConfirmCancelar\" style=\"display: none;\">
        <p>Se eliminará la consignación ¿Desea continuar?</p>
    </div>

    <div id=\"divEliminarArchivo\" style=\"display: none\">
        <p>Se eliminará el archivo ¿Desea continuar?</p>
    </div>
    <div id=\"divEliminarConsignacion\" style=\"display: none\">
        <p>Se eliminará la información de la consignación, ¿Desea continuar?</p>
    </div>

";
    }

    // line 296
    public function block_javascripts($context, array $blocks = array())
    {
        // line 297
        echo "    <script type=\"text/javascript\" src=\"";
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/recaudos.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 298
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/consignaciones/fileinput.min.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 299
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/consignaciones/consignaciones.control.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 300
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/consignaciones/consignaciones.modelo.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 301
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/recaudos/consignaciones/consignaciones.vista.js"), "html", null, true);
        echo "\"></script>
";
    }

    public function getTemplateName()
    {
        return "LlanogasLlanogasBundle:Recaudos:Consignaciones.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  434 => 301,  430 => 300,  426 => 299,  422 => 298,  417 => 297,  414 => 296,  357 => 241,  346 => 239,  342 => 238,  161 => 60,  155 => 56,  144 => 54,  140 => 53,  133 => 48,  122 => 46,  118 => 45,  110 => 39,  97 => 37,  93 => 36,  73 => 18,  70 => 17,  62 => 16,  57 => 13,  54 => 12,  47 => 8,  43 => 7,  39 => 6,  35 => 4,  32 => 3,);
    }
}
