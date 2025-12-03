<?php

/* LlanogasLlanogasBundle:Facturacion:ejecutaProcesoFacturacion.html.twig */
class __TwigTemplate_be2af848cb8c84c15c2567a50e6d5df92ec1b747ab5aded8777eb5fc944c3ef3 extends Twig_Template
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
    <link href=\"";
        // line 5
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/facturacion/dataTables.css"), "html", null, true);
        echo "\" media=\"screen\" type=\"text/css\" rel=\"stylesheet\" />
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
            padding-left: 20px;
            text-align: center;
            padding-top: 3px;
        }

        #divCargando p{
            margin: 7px 0px 0px 10px;
            display: inline-block;
        }

        #divFacturasConError, #divFacturasProcesadasCorrectas{
            max-height: 200px;
            overflow-y:auto;
        }

    </style>
";
    }

    // line 34
    public function block_titulo($context, array $blocks = array())
    {
        echo "Ejecuta Proceso facturación - ";
        echo twig_escape_filter($this->env, (isset($context["empresa"]) ? $context["empresa"] : $this->getContext($context, "empresa")), "html", null, true);
        echo "  ";
    }

    // line 35
    public function block_body($context, array $blocks = array())
    {
        // line 36
        echo "    <div id=\"divProceso\">
        <fieldset>
            <legend>Información proceso: </legend>
            <div id=\"divCombo\">
                <div class=\"campoMitad\" style=\"margin: 0 auto !important\">
                    <label for=\"cmbProceso\">Tipo de proceso: </label>
                    <select id=\"cmbProceso\">
                        <option value=\"masivo\">Procesos masivos</option>
                        <option value=\"suscripcion\">Suscripción específica</option>
                        <option value=\"variasSuscripciones\">Varias Suscripciones</option>
                    </select>
                </div>
            <div class=\"campoMitad\">
                <label for=\"cmbPreliquidar\">¿Obligar calculo de conceptos preliquidables? </label>
                <select id=\"cmbPreliquidar\">
                    <option value=\"S\">Si</option>
                    <option value=\"N\">No</option>
                </select>
            </div>
                
            </div>
            <div id=\"divProcesando\" style=\"margin: 10px;\">
                <div id=\"divCargando\" style=\"margin-bottom: 25px\"> 
                    <img src=\"/achagua/sistema/web/bundles/Llanogas/img/cargando2.gif\">
                    <p>Procesando facturación, <br>esto puede tardar unos minutos...</p>                
                </div>
                <table id=\"tblEjecucion\" class=\"tabla\"></table>
            </div>
        </fieldset>
    </div>
    <div id=\"divVariasSuscripciones\" >
        <fieldset>
            <legend>Digite las Suscripciones</legend>
            <div id=\"divControlesVarias\">
                
                    <div>
                <label for=\"txtSuscripciones\">Id Suscripciones:</label>
                <textarea  rows=\"4\" id=\"txtSuscripciones\" placeholder=\"Ingrese las Suscripciones a Liquidar separados por coma (,).\"></textarea>
            </div>
                <button class=\"btnSimple\" id=\"btnLiquidarVarias\">Liquidar</button>
            <button class=\"btnSimple\" id=\"btnAprobarLiquidacionVarias\">Aprobar liquidación</button>
            <button class=\"btnSimple\" id=\"btnEliminarLiquidacionVarias\">Eliminar liquidación pendiente</button>
\t    <button class=\"btnSimple\" id=\"btnExportarPreLiquidacion\">Exportar Preliquidacion</button>
            </div>
        </fieldset>
        <div id=\"divErroresProcesoVarias\" style=\"display:none;\">
            <fieldset id=\"fsErroresProceso\">
                <legend>Errores del proceso</legend>
                <div id=\"divFacturasConErrorVarias\">
                    <table id=\"tblErroresProcesoVarias\" class=\"tabla\"></table>
                </div>
            </fieldset>
            <fieldset id=\"fsCorrectasProcesoVarias\">
                <legend>Facturas procesadas correctamente</legend>
                <div id=\"divFacturasProcesadasCorrectasVarias\">
                    <table id=\"tblFacturasCorrectasVarias\" class=\"tabla\"></table>
                </div>
            </fieldset>
        </div>
    </div>
    <div id=\"divCabecera\" >
        <fieldset>
            <legend>Seleccione el ciclo</legend>
            <div id=\"divControles\">
                <div class=\"campo\" style=\"margin-bottom: 10px;\">
                    <label for=\"cmbCiclo\">Ciclo: </label>
                    <select id=\"cmbCiclo\">
                        ";
        // line 103
        $context['_parent'] = (array) $context;
        $context['_seq'] = twig_ensure_traversable((isset($context["ciclos"]) ? $context["ciclos"] : $this->getContext($context, "ciclos")));
        foreach ($context['_seq'] as $context["_key"] => $context["ciclo"]) {
            // line 104
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
        // line 106
        echo "                    </select>
                </div>
                <button class=\"btnSimple\" id=\"btnEjecutarProceso\">Ejecutar proceso facturación</button>
                <button class=\"btnSimple\" id=\"btnAprobarLiquidacion\">Aprobar liquidación</button>
                <button class=\"btnSimple\" id=\"btnEliminarLiquidacion\">Eliminar liquidación pendiente</button>
\t\t<button class=\"btnSimple\" id=\"btnExportarPreLiquidacion\">Exportar Preliquidacion</button>
            </div>
        </fieldset>
        <div id=\"divErroresProceso\" style=\"display:none;\">
            <fieldset id=\"fsErroresProceso\">
                <legend>Errores del proceso</legend>
                <div id=\"divFacturasConError\">
                    <table id=\"tblErroresProceso\" class=\"tabla\"></table>
                </div>
            </fieldset>
            <fieldset id=\"fsCorrectasProceso\">
                <legend>Facturas procesadas correctamente</legend>
                <div id=\"divFacturasProcesadasCorrectas\">
                    <table id=\"tblFacturasCorrectas\" class=\"tabla\"></table>
                </div>
            </fieldset>
        </div>
    </div>
    <div id=\"divEspecifica\" style=\"display:none;\">
        <fieldset id=\"fieldsetDetallesSuscripcion\">
            <legend>Detalles de Suscripción</legend>

            <div class=\"campoBusqueda\">
                <label for=\"txtIdSuscripcion\">Id Suscripción:</label>
                <input type=\"text\" id=\"txtIdSuscripcion\" disabled=\"disabled\" />
                <button id=\"btnBuscarSuscripcion\"></button>
            </div>
            <div class=\"campo\">
                <label for=\"txtNombreTercero\">Nombre Tercero:</label>
                <input type=\"text\" id=\"txtNombreTercero\" disabled=\"disabled\" />
            </div>
            <div class=\"campo\">
                <label for=\"txtDocumentoTercero\">Nit/CC:</label>
                <input type=\"text\" id=\"txtDocumentoTercero\" disabled=\"disabled\" />
            </div>
            <div class=\"campo\">
                <label for=\"txtCodigoAnterior\">Código Anterior:</label>
                <input type=\"text\" id=\"txtCodigoAnterior\" disabled=\"disabled\" />
            </div>

            <div class=\"campo\">
                <label for=\"txtFechaInicio\">Fecha de Inicio:</label>
                <input type=\"text\" id=\"txtFechaInicio\" disabled=\"disabled\" />
            </div>

            <div class=\"campo\">
                <label for=\"txtDescripcion\">Descripción:</label>
                <input type=\"text\" id=\"txtDescripcion\" disabled=\"disabled\"/>
            </div>

            <div class=\"campo\">
                <label for=\"txtTipoSuscripcion\">Tipo Suscripción:</label>
                <input type=\"text\" id=\"txtTipoSuscripcion\" disabled=\"disabled\"/>
            </div>

            <div class=\"campo\">
                <label for=\"txtRuta\">Ruta:</label>
                <input type=\"text\" id=\"txtRuta\" disabled=\"disabled\"/>
            </div>

            <div class=\"campo\">
                <label for=\"txtCiclo\">Ciclo:</label>
                <input type=\"text\" id=\"txtCiclo\" disabled=\"disabled\" />
            </div>

            <div class=\"campo\">
                <label for=\"cboTipoUso\">Tipo Uso:</label>
                <input type=\"text\" id=\"txtTipoUso\" disabled=\"disabled\"/>
            </div>

            <div class=\"campo\">
                <label for=\"txtLiquidacion\">Liquidación:</label>
                <input type=\"text\" id=\"txtLiquidacion\" disabled=\"disabled\"/>
            </div>

            <div class=\"campo\">
                <label for=\"txtEstrato\">Estrato:</label>
                <input type=\"text\" id=\"txtEstrato\" disabled=\"disabled\"/>
            </div>

            <div class=\"campo\">
                <label for=\"txtEstado\">Estado:</label>
                <input type=\"text\" id=\"txtEstado\" disabled=\"disabled\"/>
            </div>  

            <div class=\"campo\">
                <label for=\"txtFactorCorreccion\">Factor Corrección:</label>
                <input type=\"text\" id=\"txtFactorCorreccion\" disabled=\"disabled\" />
            </div>
            <button class=\"btnSimple\" id=\"btnLiquidar\">Liquidar</button>
            <button class=\"btnSimple\" id=\"btnAprobarLiquidacionUnica\">Aprobar liquidación</button>
            <button class=\"btnSimple\" id=\"btnEliminarLiquidacionUnica\">Eliminar liquidación pendiente</button>
\t    <button class=\"btnSimple\" id=\"btnExportarPreLiquidacion\">Exportar Preliquidacion</button>
        </fieldset>
        <div id=\"divFacturas\" style=\"display:none;\">
            <fieldset>
                <legend>Factura</legend>
                <div class=\"campo\">
                    <label for=\"txtNumFactura\">Núm factura:</label>
                    <input type=\"text\" id=\"txtNumFactura\" disabled=\"disabled\" />
                </div>
                <div class=\"campo\">
                    <label for=\"txtFechaVen\">Fecha vencimiento:</label>
                    <input type=\"text\" id=\"txtFechaVen\" disabled=\"disabled\" />
                </div>
                <div class=\"campo\">
                    <label for=\"txtSuscripcion\">Suscripción:</label>
                    <input type=\"text\" id=\"txtSuscripcion\" disabled=\"disabled\" />
                </div>
                <div class=\"campo\">
                    <label for=\"txtCicloPeriodo\">Ciclo/Periodo:</label>
                    <input type=\"text\" id=\"txtCicloPeriodo\" disabled=\"disabled\" />
                </div>
                <div class=\"campo\">
                    <label for=\"txtValorTotal\">Valor total:</label>
                    <input type=\"text\" id=\"txtValorTotal\" disabled=\"disabled\" />
                </div>
                <div class=\"campo\">
                    <label for=\"txtSaldo\">Saldo:</label>
                    <input type=\"text\" id=\"txtSaldo\" disabled=\"disabled\" />
                </div>
            </fieldset>
            <table id=\"tblDetalle\" class=\"tabla\"></table>
            <button class=\"btnSimple\" id=\"btnAprobar\">Aprobar liquidación</button>
        </div>
    </div>

    <div style=\"display: none\" id=\"camposBuscarSuscripcion\">
        <div class=\"campo\">
            <label for=\"txtSuscripcionFiltro\">Id suscripción: </label>
            <input id=\"txtSuscripcionFiltro\" type=\"text\"/>
        </div>
        <div class=\"campo\">
            <label for=\"txtCodAnterior\">Código anterior: </label>
            <input id=\"txtCodAnterior\" type=\"text\"/>
        </div>
        <div class=\"campo\">
            <label for=\"txtDocumentoTer\">Nit/CC: </label>
            <input id=\"txtDocumentoTer\" type=\"text\"/>
        </div>
        <span id=\"spanMensaje\" class=\"pMensaje\"></span>
    </div>


    <div id=\"divTablaErrores\" style=\"display:none;\">
        <h2>Errores encontrados al aprobar la Liquidación</h2>
        <div style=\"max-height: 65vh; overflow: auto;\">
            <table id=\"tblErrores\" class=\"tabla\"></table>
        </div>
    </div>

<div style=\"display: none\" id=\"camposFiltroReporte\">
        <div class=\"campo\">
            <label for=\"txtSuscripcionFiltro\">Id suscripci�n: </label>
            <input id=\"txtSuscripcionFiltro\" type=\"text\"/>
        </div>
        <div class=\"campo\">
            <label for=\"txtFechaInicial\">Fecha Inicial:</label>
            <input id=\"txtFechaInicial\" type=\"text\"  required=\"required\" />
        </div>
        <div class=\"campo\">
            <label for=\"txtFechaFinal\">Fecha Final:</label>
            <input id=\"txtFechaFinal\" type=\"text\"   required=\"required\" />
        </div>
        <div class=\"campo\" style=\"margin-bottom: 10px;\">
            <label for=\"cmbCiclo\">Ciclo: </label>
                <select id=\"cmbCiclo\">
                        ";
        // line 278
        $context['_parent'] = (array) $context;
        $context['_seq'] = twig_ensure_traversable((isset($context["ciclos"]) ? $context["ciclos"] : $this->getContext($context, "ciclos")));
        foreach ($context['_seq'] as $context["_key"] => $context["ciclo"]) {
            // line 279
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
        // line 281
        echo "                </select>
        </div>
        <span id=\"spanMensaje\" class=\"pMensaje\"></span>
    </div>


";
    }

    // line 289
    public function block_javascripts($context, array $blocks = array())
    {
        // line 290
        echo "    <script type=\"text/javascript\" src=\"";
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/facturacion/dataTables.min.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 291
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/facturacion/jquery.dataTables.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 292
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/facturacion/dataTables.tableTool.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 293
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/facturacion/ejecutarProceso/ejecutarProceso.modelo.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 294
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/facturacion/ejecutarProceso/ejecutarProceso.control.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 295
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/facturacion/ejecutarProceso/ejecutarProceso.vista.js"), "html", null, true);
        echo "\"></script>
";
    }

    public function getTemplateName()
    {
        return "LlanogasLlanogasBundle:Facturacion:ejecutaProcesoFacturacion.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  390 => 295,  386 => 294,  382 => 293,  378 => 292,  374 => 291,  369 => 290,  366 => 289,  356 => 281,  345 => 279,  341 => 278,  167 => 106,  156 => 104,  152 => 103,  83 => 36,  80 => 35,  72 => 34,  39 => 5,  34 => 4,  31 => 3,);
    }
}
