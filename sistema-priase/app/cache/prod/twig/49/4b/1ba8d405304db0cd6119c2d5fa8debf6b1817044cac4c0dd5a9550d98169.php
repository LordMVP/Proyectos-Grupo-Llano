<?php

/* LlanogasLlanogasBundle:Cartera:GenerarFinanciacion.html.twig */
class __TwigTemplate_494b1ba8d405304db0cd6119c2d5fa8debf6b1817044cac4c0dd5a9550d98169 extends Twig_Template
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
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/cartera/financiacion.css"), "html", null, true);
        echo "\" />
    <link rel=\"stylesheet\" type=\"text/css\" href=\"";
        // line 6
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/archivos.css"), "html", null, true);
        echo "\" />
    <link rel=\"stylesheet\" type=\"text/css\" href=\"";
        // line 7
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/contratos.css"), "html", null, true);
        echo "\" />
    <link type=\"text/css\" rel=\"stylesheet\" href=\"";
        // line 8
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/recaudos/fileinput.min.css"), "html", null, true);
        echo "\" />
    <style type=\"text/css\">

        div.conceptos{
            display: inline-block;
            width: 49%;
            vertical-align: top;
        }

        .rows-3{width: calc(100%/3.3); padding-left: 0;}
        .rows-4{width: calc(100%/4.3); padding-left: 0;}
        .input-width-max{width: 100%;}
        .genNumPagare{width: 100%; display: flex; justify-content: end;}
        .form-check{display: flex; justify-content: space-around;}
        .border{border-width: 1px; border-radius: 2px; border-style: double; border-image: initial;}
    </style>


";
    }

    // line 28
    public function block_scripts($context, array $blocks = array())
    {
        // line 29
        echo "
";
    }

    // line 31
    public function block_titulo($context, array $blocks = array())
    {
        echo "Cartera: Generar Financiación - ";
        echo twig_escape_filter($this->env, (isset($context["empresa"]) ? $context["empresa"] : $this->getContext($context, "empresa")), "html", null, true);
        echo "  ";
    }

    // line 33
    public function block_body($context, array $blocks = array())
    {
        // line 34
        echo "
    <div id=\"divComandos\">
        <div class=\"divBotones\">
            <input type=\"button\" value=\"grabar\" id=\"btnGrabar\" class=\"btn\" />
            <input type=\"button\" value=\"cancelar\" id=\"btnCancelar\" class=\"btn\" />
        </div>
    </div>

    <div id=\"divFormulario\">

        <fieldset id=\"divCabecera\">
            <legend>Suscripción</legend>
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
                <label for=\"txtEstadoSuscripcion\">Estado:</label>
                <input type=\"text\" id=\"txtEstadoSuscripcion\" disabled=\"disabled\" />
            </div>

            <div class=\"campo\" id=\"divSelSeg\">
                <label for=\"cmbSegmento\">Segmento:</label>
                <select id=\"cmbSegmento\">
                    <option value=\"-2\">Seleccione una opción</option>
                </select>
            </div>

            <div class=\"campo\" id=\"divSelTipDoc\" style=\"display: none;\">
                <label for=\"cmbTipoDocumento\">Tipo de documento:</label>
                <select id=\"cmbTipoDocumento\" class=\"form-select\" multiple  style=\"overflow-x: scroll; height: fit-content; vertical-align: middle;\"></select>
            </div>

            <div class=\"campo\" id=\"divSelDoc\" style=\"display: none;\">
                <label for=\"cmbDocumento\">Documento:</label>
                <select id=\"cmbDocumento\">
                    <option value=\"-1\">Seleccione una opción</option>
                </select>
            </div>
            <div class=\"campo\">
                <input type=\"button\" id=\"btnCargarFacturas\" value=\"Ver facturas\" class=\"btnSimple\"/>
                <input type=\"button\" id=\"btnDescartaFacturas\" value=\"Descartar facturas\" class=\"btnSimple\"/>
            </div>
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
        <table id=\"tblConceptos\" class=\"tabla\"></table>


        <fieldset id=\"divFinanciacion\" style=\"display: none\">
            <legend>Financiación</legend>
            <div class=\"campo\">
                <label for=\"cmbTipoLiquidacion\">Tipo de liquidación:</label>
                <select id=\"cmbTipoLiquidacion\"></select>
            </div>
            <div class=\"campoCorto\" style=\"display:none\">
                <label for=\"txtNumFinanciacion\">Núm. financiación:</label>
                <input type=\"text\" id=\"txtNumFinanciacion\" disabled=\"disabled\" />
            </div>

            <div class=\"campo\">
                <label for=\"txtCiclo\">Ciclo:</label>
                <input type=\"text\" id=\"txtCiclo\" disabled=\"disabled\" />
            </div>

            <div class=\"campoCorto\">
                <label for=\"txtPeriodo\">Periodo:</label>
                <input type=\"text\" id=\"txtPeriodo\" disabled=\"disabled\" />
            </div>

            <div class=\"campoCorto\">
                <label for=\"txtFecha\">Fecha:</label>
                <p id=\"pFechaActual\" style=\"display:none\">";
        // line 141
        echo twig_escape_filter($this->env, (isset($context["fecha"]) ? $context["fecha"] : $this->getContext($context, "fecha")), "html", null, true);
        echo "</p>
                <input type=\"text\" id=\"txtFecha\" disabled=\"disabled\" value=\"";
        // line 142
        echo twig_escape_filter($this->env, twig_date_format_filter($this->env, (isset($context["fecha"]) ? $context["fecha"] : $this->getContext($context, "fecha")), "y-m-d"), "html", null, true);
        echo "\" />
            </div>

            <div class=\"campo\">
                <label for=\"txtDocSolicitante\">NIT/CC Solicitante:</label>
                <input type=\"text\" id=\"txtDocSolicitante\" disabled=\"disabled\" />
            </div>

            <div class=\"campo\">
                <label for=\"txtNombreSolicitante\">Nombre o Cédula Solicitante:</label>
                <input type=\"text\" id=\"txtNombreSolicitante\" />
            </div>
            <div class=\"campo\">
                <label for=\"cmbParentesco\">Parentesco:</label>
                <select id=\"cmbParentesco\"></select>
            </div>
            <div class=\"campo\">
                <label for=\"txtBanco\">Financiera:</label>
                <input type=\"text\" id=\"txtBanco\" />
            </div>

            <div class=\"campo\">
                <label for=\"txtValorMinPago\">Valor mínimo de pago:</label>
                <input type=\"text\" id=\"txtValorMinPago\" disabled=\"disabled\" />
            </div>

            <div class=\"campoCorto\">
                <label for=\"txtCuotaInicial\">Cuota Inicial(%):</label>
                <input type=\"text\" id=\"txtCuotaInicial\" disabled=\"disabled\" />
            </div>

            <div class=\"campoCorto\">
                <label for=\"txtCuotaFinan\">Cuota Financiacion(%):</label>
                <input type=\"text\" id=\"txtCuotaFinan\" disabled=\"disabled\" />
            </div>

            <div class=\"campo\">
                <label for=\"txtValorFinanciable\">Valor financiable:</label>
                <input type=\"text\" id=\"txtValorFinanciable\" disabled=\"disabled\"/>
            </div>

            <div class=\"campo\">
                <label for=\"txtValorFinanciar\">Valor a financiar:</label>
                <input type=\"text\" id=\"txtValorFinanciar\" disabled=\"disabled\" />
            </div>

            <div class=\"campoCorto\">
                <label for=\"txtNumCuotas\">Cuotas:</label>
                <input type=\"text\" id=\"txtNumCuotas\" maxlength=\"2\" />
            </div>
            <div class=\"campoCorto\">
                <label for=\"txtInteres\">Interés:</label>
                <input type=\"text\" id=\"txtInteres\" disabled=\"disabled\" />
            </div>
            <br>
            <br>
            <div class=\"campo\">
                <span>Documentos:</span>
                <div class=\"form-check border\">
                    <div class=\"form-check\">
                        <input type=\"radio\" value=\"si\" id=\"checkDocumentosSi\">
                        <label for=\"checkDocumentosSi\">Si</label>
                    </div>
                    <div class=\"form-check\">
                        <input type=\"radio\" value=\"no\" id=\"checkDocumentosNo\">
                        <label for=\"checkDocumentosNo\">No</label>
                    </div>
                </div>
            </div>
            <br>
            <input type=\"button\" value=\"Ver Simulador\" id=\"btnCargarSimulador\" class=\"btnSimple\"/>
            <input type=\"button\" value=\"Agregar información financiera\" id=\"btnAgregarInformacionFinanciera\" class=\"btnSimple\"/>

        </fieldset>
        <div id=\"divAdjuntosFinanciacion\" style=\"display: none;\">
            <ul>
                <li id=\"liFormatos\"><a href=\"#divArchivosContrato\"> Formatos </a></li>
                <li><a href=\"#divArchivos\"> Adjuntos  </a></li>
            </ul>
            <div id=\"divArchivosContrato\" data-id=\"fin\">
                <a href=\"../ventas/financiacion/exportar_autorizacion/\" target=\"_blank\" id=\"linkFormato\" ></a>
                <div style=\"display: flex;align-items: end;\">
                    <div>
                        <label for=\"txtNumPagare\">Numero Pagaré</label>
                        <input type=\"text\" id=\"txtNumPagare\" disabled=\"disabled\">
                    </div>
                    <div class=\"genNumPagare\">
                        <button class=\"btnSimple\" id=\"btnGenerarNumeroPagare\">Generar Núm. Pagaré</button>
                    </div>
                </div>
                <div class=\"archivoSubido\">
                    <button class=\"btnSimple\" data-id=\"PagarePersonaNaturalFinal\"><i class=\"fa fa-file-text-o fa-lg\"></i></button>
                    <strong>Pagaré persona natural</strong>
                </div>
                <div class=\"archivoSubido\">
                    <button class=\"btnSimple\" data-id=\"PagarePersonaJuridicaFinal\"><i class=\"fa fa-file-text-o fa-lg\"></i></button>
                    <strong>Pagaré persona jurídica</strong>
                </div>
                <div class=\"archivoSubido\">
                    <button class=\"btnSimple\" data-id=\"TratamientoDatos\"><i class=\"fa fa-file-text-o fa-lg\"></i></button>
                    <strong>Autorización Tratamiento de Datos Personales y Centrales de riesgo</strong>
                </div>
                <div class=\"archivoSubido\">
                    <button class=\"btnSimple\" data-id=\"FinanciacionDeuda\"><i class=\"fa fa-file-text-o fa-lg\"></i></button>
                    <strong>Formato de Financiacion de Deuda</strong>
                </div>
            </div>
            <div id=\"divArchivos\">
                <div style=\"margin: 20px 20px\">
                    <div><input type=\"file\" id=\"txtArchivo\" multiple></div>
                    <button class=\"btnSimple\" id=\"btnSubirArchivos\" style=\"display: none;\"> <i class=\"fa fa-upload\"></i> Adjuntar archivos de financiacion </button>
                </div>
            </div>
        </div>

        <div id=\"divNatural\" style=\"display: none;\">
            <ul>
                <li><a href=\"#divLaboral\">Laboral</a></li>
                <li><a href=\"#divJuridica\">Jurídica</a></li>
                <li><a href=\"#divFinanciera\">Financiera</a></li>
            </ul>
            <div id=\"divJuridica\">
                <h2 style=\"font-size: 1.6em; font-weight: normal;\">Información empresarial</h2>
                <div class=\"campo\">
                    <label for=\"txtActividadEmpresarial\"> Actividad Económica: </label>
                    <!--<input type=\"text\" id=\"txtActividadEmpresarial\" disabled=\"disabled\" />-->
                    <select id=\"txtActividadEmpresarial\" data-reference=\"idactividadeconomica\">
                        <option value=\"-1\">Seleccione una opción </option>
                        ";
        // line 270
        $context['_parent'] = (array) $context;
        $context['_seq'] = twig_ensure_traversable((isset($context["actividadeconomica"]) ? $context["actividadeconomica"] : $this->getContext($context, "actividadeconomica")));
        foreach ($context['_seq'] as $context["_key"] => $context["actividad"]) {
            // line 271
            echo "                            <option value=\"";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["actividad"]) ? $context["actividad"] : $this->getContext($context, "actividad")), "idunidad"), "html", null, true);
            echo "\">";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["actividad"]) ? $context["actividad"] : $this->getContext($context, "actividad")), "nombre"), "html", null, true);
            echo " </option>
                        ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['actividad'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 273
        echo "                    </select>
                </div>
                <div class=\"campo\">
                    <label for=\"cmbTipoSociedad\">Tipo de sociedad: </label>
                    <select id=\"cmbTipoSociedad\" data-reference=\"idtiposociedad\">
                        <option value=\"-1\">Seleccione una opción</option>
                        ";
        // line 279
        $context['_parent'] = (array) $context;
        $context['_seq'] = twig_ensure_traversable((isset($context["tiposociedad"]) ? $context["tiposociedad"] : $this->getContext($context, "tiposociedad")));
        foreach ($context['_seq'] as $context["_key"] => $context["sociedad"]) {
            // line 280
            echo "                            <option value=\"";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["sociedad"]) ? $context["sociedad"] : $this->getContext($context, "sociedad")), "idunidad"), "html", null, true);
            echo "\">";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["sociedad"]) ? $context["sociedad"] : $this->getContext($context, "sociedad")), "nombre"), "html", null, true);
            echo " </option>
                        ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['sociedad'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 282
        echo "                    </select>
                </div>
                <div class=\"campo\">
                    <label for=\"\">Años Experiencia </label>
                    <div class=\"campoMitad\" style=\"width: 46%\">
                        <label for=\"txtAnioExperienciaEmpresarial\">Años :</label>
                        <input type=\"text\" id=\"txtAnioExperienciaEmpresarial\" maxlength=\"2\"  data-reference=\"aniolaborado\">
                    </div>

                    <div class=\"campoMitad\" style=\"width: 46%\">
                        <label for=\"txtMesesExperienciaEmpresarial\" >Meses:</label>
                        <input type=\"text\" id=\"txtMesesExperienciaEmpresarial\" maxlength=\"2\" data-reference=\"meslaborado\">
                    </div>
                </div>
                <div class=\"campo\">
                    <label for=\"txtDireccionEmpresarial\">Dirección: </label>
                    <input type=\"text\" id=\"txtDireccionEmpresarial\" disabled=\"disabled\">
                </div>

                <div class=\"campo\">
                    <label for=\"txtBarrioEmpresarial\">Barrio: </label>
                    <input type=\"text\" id=\"txtBarrioEmpresarial\" disabled=\"disabled\">
                </div>
                <div class=\"campo\">
                    <label for=\"txtMunicipioEmpresarial\">Municipio:</label>
                    <input type=\"text\" id=\"txtMunicipioEmpresarial\" disabled=\"disabled\">
                </div>
                <div class=\"campo\">
                    <label for=\"txtDepartamentoEmpresarial\">Departamento: </label>
                    <input type=\"text\" id=\"txtDepartamentoEmpresarial\" disabled=\"disabled\">
                </div>
                <div class=\"campo\">
                    <label for=\"txtEstratoCat\">Estrato/Categoría: </label>
                    <input type=\"text\" id=\"txtEstratoCat\" disabled=\"disabled\">
                </div>
                <div class=\"campo\">
                    <label for=\"txtCorreoEmpresarial\">Correo electrónico: </label>
                    <input type=\"text\" id=\"txtCorreoEmpresarial\" disabled=\"disabled\">
                </div>
                <div class=\"campo\">
                    <label for=\"txtTelefono1Empresarial\">Teléfono 1</label>
                    <input type=\"text\" id=\"txtTelefono1Empresarial\" data-caja=\"number\" data-reference=\"telefono1\" maxlength=\"10\">
                </div>
                <div class=\"campo\">
                    <label for=\"txtTelefono2Empresarial\">Teléfono 2</label>
                    <input type=\"text\" id=\"txtTelefono2Empresarial\" data-caja=\"number\" data-reference=\"telefono2\" maxlength=\"10\">
                </div>
            </div>
            <div id=\"divLaboral\">
                <h2 style=\"font-size: 1.6em; font-weight: normal;\">Información laboral</h2>
                <div class=\"campo\">
                    <label for=\"cmbOcupacionLaboral\">Ocupación:</label>
                    <select id=\"txtOcupacionLaboral\" data-reference=\"idactividadeconomica\">
                        <option value=\"-1\">Seleccione una opción </option>
                        ";
        // line 336
        $context['_parent'] = (array) $context;
        $context['_seq'] = twig_ensure_traversable((isset($context["actividadeconomica"]) ? $context["actividadeconomica"] : $this->getContext($context, "actividadeconomica")));
        foreach ($context['_seq'] as $context["_key"] => $context["actividad"]) {
            // line 337
            echo "                            <option value=\"";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["actividad"]) ? $context["actividad"] : $this->getContext($context, "actividad")), "idunidad"), "html", null, true);
            echo "\">";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["actividad"]) ? $context["actividad"] : $this->getContext($context, "actividad")), "nombre"), "html", null, true);
            echo " </option>
                        ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['actividad'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 339
        echo "                    </select>
                </div>
                <div class=\"campo\">
                    <label for=\"txtNombreEmpresaLaboral\">Nombre Empresa: </label>
                    <input type=\"text\" id=\"txtNombreEmpresaLaboral\" data-reference=\"nombreempresalaboral\">
                </div>
                <div class=\"campo\">
                    <label for=\"txtFechaIngresoLaboral\">Fecha Ingreso: </label>
                    <input type=\"text\" id=\"txtFechaIngresoLaboral\" data-reference=\"fechaingreso\">
                </div>
                <div class=\"campo\">
                    <label for=\"\">Años Experiencia </label>
                    <div class=\"campoMitad\" style=\"width: 46%\">
                        <label for=\"txtAnioExperienciaLaboral\">Años :</label>
                        <input type=\"text\" id=\"txtAnioExperienciaLaboral\" data-caja=\"number\" data-reference=\"aniolaborado\" maxlength=\"3\">
                    </div>

                    <div class=\"campoMitad\" style=\"width: 46%\">
                        <label for=\"txtMesesExperienciaLaboral\">Meses:</label>
                        <input type=\"text\" id=\"txtMesesExperienciaLaboral\" data-caja=\"number\" data-reference=\"meslaborado\" maxlength=\"2\">
                    </div>
                </div>
                <div class=\"campo\">
                    <label for=\"cmbCargoLaboral\">Cargo: </label>
                    <select id=\"cmbCargoLaboral\" data-reference=\"cargolaboral\">
                        <option value=\"-1\">Seleccione una opción</option>
                        ";
        // line 365
        $context['_parent'] = (array) $context;
        $context['_seq'] = twig_ensure_traversable((isset($context["cargos"]) ? $context["cargos"] : $this->getContext($context, "cargos")));
        foreach ($context['_seq'] as $context["_key"] => $context["cargo"]) {
            // line 366
            echo "                            <option value=\"";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["cargo"]) ? $context["cargo"] : $this->getContext($context, "cargo")), "idunidad"), "html", null, true);
            echo "\">";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["cargo"]) ? $context["cargo"] : $this->getContext($context, "cargo")), "nombre"), "html", null, true);
            echo " </option>
                        ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['cargo'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 368
        echo "                    </select>
                </div>
                <div class=\"campo\">
                    <label for=\"txtTelefono1Laboral\">Teléfono 1: </label>
                    <input type=\"text\" id=\"txtTelefono1Laboral\" data-caja=\"number\" data-reference=\"telefono1\" maxlength=\"10\">
                </div>
                <div class=\"campo\">
                    <label for=\"txtTelefono2Laboral\">Teléfono 2: </label>
                    <input type=\"text\" id=\"txtTelefono2Laboral\" data-caja=\"number\" data-reference=\"telefono1\" maxlength=\"10\">
                </div>
            </div>
            <div id=\"divFinanciera\">
                <h2 style=\"font-size: 1.6em; font-weight: normal;\">Información financiera</h2>
                <fieldset>
                    <legend>Ingresos Mensuales</legend>
                    <div class=\"campo\">
                        <label for=\"txtSalarioFijo\">Salario Fijo: </label>
                        <input type=\"text\" id=\"txtSalarioFijo\" data-caja=\"number\" data-reference=\"salariofijo\">
                    </div>
                    <div class=\"campo\">
                        <label for=\"txtSalarioVariable\">Salario Variable: </label>
                        <input type=\"text\" id=\"txtSalarioVariable\" data-caja=\"number\" data-reference=\"salariovariable\">
                    </div>
                    <div class=\"campo\">
                        <label for=\"txtArrendamiento\">Arrendamiento: </label>
                        <input type=\"text\" id=\"txtArrendamiento\" data-caja=\"number\" data-reference=\"ingresoarriendo\">
                    </div>
                    <div class=\"campo\">
                        <label for=\"txtVentas\">Ventas: </label>
                        <input type=\"text\" id=\"txtVentas\" data-caja=\"number\" data-reference=\"ingresoventa\">
                    </div>
                    <div class=\"campo\">
                        <label for=\"txtNomOtroIngreso\">Detalle Otro Ingreso: </label>
                        <input type=\"text\" id=\"txtNomOtroIngreso\"  data-reference=\"otroingreso\">
                    </div>
                    <div class=\"campo\">
                        <label for=\"txtVlrOtroIngreso\">Valor otro ingreso: </label>
                        <input type=\"text\" id=\"txtVlrOtroIngreso\" data-caja=\"number\" data-reference=\"valorotroingreso\">
                    </div>
                    <div class=\"campo\">
                        <label for=\"txtTotIngresos\">Total Ingresos: </label>
                        <input type=\"text\" id=\"txtTotIngresos\" disabled=\"disabled\" data-reference=\"totalingreso\" data-caja=\"total\">
                    </div>
                </fieldset>
                <fieldset>
                    <legend>Egresos mensuales </legend>
                    <div class=\"campo\">
                        <label for=\"txtGastoFamiliar\">Gastos generales:</label>
                        <input type=\"text\" id=\"txtGastoFamiliar\" data-caja=\"number\" data-reference=\"gastofamiliar\">
                    </div>
                    <div class=\"campo\">
                        <label for=\"txtArriendo\">Arrendamiento: </label>
                        <input type=\"text\" id=\"txtArriendo\" data-caja=\"number\" data-reference=\"gastoarriendo\">
                    </div>
                    <div class=\"campo\">
                        <label for=\"txtGastoFinanciera\">Financieros: </label>
                        <input type=\"text\" id=\"txtGastoFinanciera\" data-caja=\"number\" data-reference=\"gastofinanciero\">
                    </div>
                    <div class=\"campo\">
                        <label for=\"txtCompras\">Compras: </label>
                        <input type=\"text\" id=\"txtCompras\" data-caja=\"number\" data-reference=\"gastocompra\">
                    </div>
                    <div class=\"campo\">
                        <label for=\"txtNomOtroEgreso\">Detalle Otro egreso: </label>
                        <input type=\"text\" id=\"txtNomOtroEgreso\" data-reference=\"otrogasto\">
                    </div>
                    <div class=\"campo\">
                        <label for=\"txtVlrOtroEgreso\">Valor otro egreso: </label>
                        <input type=\"text\" id=\"txtVlrOtroEgreso\" data-caja=\"number\" data-reference=\"valorotrogasto\">
                    </div>
                    <div class=\"campo\">
                        <label for=\"txtTotEgreso\">Total egresos: </label>
                        <input type=\"text\" id=\"txtTotEgreso\" disabled=\"disabled\" data-reference=\"totalgasto\" data-caja=\"total\">
                    </div>
                </fieldset>
                <fieldset>
                    <legend>Efectivo y Activos</legend>
                    <div class=\"campo\">
                        <label for=\"txtEfectivo\">Efectivo disponible: </label>
                        <input type=\"text\" id=\"txtEfectivo\" data-caja=\"number\" data-reference=\"efectivo\" disabled=\"disabled\">
                    </div>
                    <div class=\"campo\">
                        <label for=\"txtActivoCorriente\">Activo corriente: </label>
                        <input type=\"text\" id=\"txtActivoCorriente\" data-caja=\"number\" data-reference=\"activocorriente\">
                    </div>
                    <div class=\"campo\">
                        <label for=\"txtVehiculos\">Vehículos:</label>
                        <input type=\"text\" id=\"txtVehiculos\" data-caja=\"number\" data-reference=\"vehiculo\">
                    </div>
                    <div class=\"campo\">
                        <label for=\"txtOtrasPropiedades\">Otras propiedades:</label>
                        <input type=\"text\" id=\"txtOtrasPropiedades\" data-caja=\"number\" data-reference=\"propiedad\">
                    </div>
                    <div class=\"campo\">
                        <label for=\"txtTotalActivos\">Total Activos: </label>
                        <input type=\"text\" id=\"txtTotalActivos\" disabled=\"disabled\" data-reference=\"totalactivo\" data-caja=\"total\">
                    </div>
                </fieldset>
            </div>
        </div>
    </div>
</div>




<!-- Division para filtro -->
<div id=\"camposBuscarSuscripcion\" style=\"display:none;\" >
    <div class=\"campoMitad\">
        <label for=\"txtFiltroSus\">Suscripción:</label>
        <input type=\"text\" id=\"txtFiltroSus\" data-attr=\"suscripcion\" maxlength=\"15\" />
    </div>
    <div class=\"campoMitad\">
        <label for=\"txtFiltroCodAnt\">Código Anterior:</label>
        <input type=\"text\" id=\"txtFiltroCodAnt\" data-attr=\"codAnterior\" maxlength=\"30\" />
    </div>
    <span id=\"spanMensaje\" class=\"pMensaje\"></span>
</div>
<!-- Division para simulador -->
<div id=\"divSimulador\" style=\"display:none;\" >
    <div style=\"display: flex; justify-content: space-between;\">
        <div class=\"rows-3\" style=\"display: none\" id=\"divSuscripcionImprimir\">
            <label for=\"txtSuscripcionImprimir\" ><strong>Código de Usuario:</strong></label>
            <input type=\"text\" id=\"txtSuscripcionImprimir\" class=\"inputImpresion input-width-max\" disabled=\"disabled\"/>
        </div>
        <div class=\"rows-3\" style=\"display: none\" >
            <label for=\"txtPeriodoImprimir\"><strong>Periodo Facturado:</strong></label>
            <input type=\"text\" id=\"txtPeriodoImprimir\" class=\"inputImpresion input-width-max\" disabled=\"disabled\"/>
        </div>
        <div class=\"rows-3\" style=\"display: none\" >
            <label for=\"txtNumFinanciacionImprimir\"><strong>Financiación N°:</strong></label>
            <input type=\"text\" id=\"txtNumFinanciacionImprimir\" class=\"inputImpresion input-width-max\" disabled=\"disabled\"/>
        </div>
    </div>

    <div style=\"display: flex; justify-content: space-between;\">
        <div class=\"rows-3\" style=\"display: none\" >
            <label for=\"txtUsuarioImprimir\"><strong>Suscriptor / Usuario:</strong></label>
            <input type=\"text\" id=\"txtUsuarioImprimir\" class=\"inputImpresion input-width-max\" disabled=\"disabled\"/>
        </div>
        <div class=\"rows-3\" style=\"display: none\" >
            <label for=\"txtTipoSolicitanteImprimir\"><strong>Tipo de Solicitante:</strong></label>
            <input type=\"text\" id=\"txtTipoSolicitanteImprimir\" class=\"inputImpresion input-width-max\" disabled=\"disabled\"/>
        </div>
        <div class=\"rows-3\" style=\"display: none\" >
            <label for=\"txtDireccionImprimir\"><strong>Dirección del Predio:</strong></label>
            <input type=\"text\" id=\"txtDireccionImprimir\" class=\"inputImpresion input-width-max\" disabled=\"disabled\"/>
        </div>
    </div>

    <div style=\"display: flex; justify-content: space-between;\">
        <div class=\"rows-3\" style=\"display: none\" id=\"divFechaActualImprimir\">
            <label for=\"txtFechaActualImprimir\"><strong>Fecha de Financiación:</strong></label>
            <input type=\"text\" id=\"txtFechaActualImprimir\" class=\"inputImpresion input-width-max\" disabled=\"disabled\"/>
        </div>
        <div class=\"rows-3\" style=\"display: none\" >
            <label for=\"txtValorFacturaImprimir\"><strong>Valor Factura:</strong></label>
            <input type=\"text\" id=\"txtValorFacturaImprimir\" class=\"inputImpresion input-width-max\" disabled=\"disabled\"/>
        </div>
        <div class=\"rows-3\" style=\"display: none\">
            <label for=\"txtCuotaInicialImprimir\"><strong>Vlr Cuota Inicial:</strong></label>
            <input type=\"text\" id=\"txtCuotaInicialImprimir\" class=\"inputImpresion input-width-max\" disabled=\"disabled\"/>
        </div>
    </div>

    <div style=\"display: flex; justify-content: space-between;\">
        <div class=\"rows-4\" >
            <label for=\"txtCapitalInicialImprimir\" ><strong>Valor Saldo:</strong></label>
            <input type=\"text\" id=\"txtCapitalInicialImprimir\" placeholder=\"Capital inicial\" value=\"200000\" class=\"inputImpresion input-width-max\" disabled=\"disabled\"/>
        </div>
        <div class=\"rows-4\">
            <label for=\"txtNumeroCuotas\"><strong>Número de Cuotas:</strong></label>
            <input type=\"text\" id=\"txtNumeroCuotas\" maxlength=\"2\" placeholder=\"Número cuotas\"  value=\"10\" class=\"inputImpresion input-width-max\" disabled=\"disabled\"/>
        </div>
        <div class=\"rows-4\" style=\"display: none\" >
            <label for=\"txtVlrPrimerCuotaImprimir\"><strong>Valor Cuota:</strong></label>
            <input type=\"text\" id=\"txtVlrPrimerCuotaImprimir\" class=\"inputImpresion input-width-max\" disabled=\"disabled\"/>
        </div>
        <div class=\"rows-4\">
            <label for=\"txtIntereses\">Tasa de Interes: </label>
            <input type=\"text\" id=\"txtIntereses\" placeholder=\"El valor se divide por 100\" maxlength=\"100\" class=\"inputImpresion input-width-max\" disabled=\"disabled\"/>
        </div>
    </div>
    
    <div class=\"txtAreaFacturas\" style=\"display: none\">
        <label for=\"txtFacturas\">Facturas: </label>
        <textarea id=\"txtFacturas\" style=\"border: 1px solid #000 !important\" placeholder=\"Facturas\" class=\"inputImpresion input-width-max\" disabled=\"disabled\"></textarea>
    </div>

    <p style=\"margin-top: 5px;\"><strong>Nota:</strong> Los Valores de la cuota son aproximados ya que la tasa de interés varia mensualmente.</p>
    <p>Con la firma del presente documento, me comprometo firme y solidariamente a pagar la deuda de la siguiente forma, más el valor del mes:</p>
    <p style=\"margin-top: 10px;\">Nota: Para los usuarios con segmento Cartera G no aplica valor del mes.</p>
    <div style=\"margin-top: 20px;\" id=\"divTbl\"></div>
    <p style=\"margin-top: 10px;\"><strong>Cláusula Aceleratoria: </strong>Conforme con lo establecido en el articulo 69 de la Ley 45 de 1990, ante el incumplimiento de pago, se hará exigible la totalidad de la obligación en la factura de servicio.</p>
</div>
<div id=\"contentFrame\" style=\"display:none;\">
    <iframe frameborder=\"0\" src=\"/achagua/sistema/web/bundles/Llanogas/templates/contenidoframe.html\" id=\"iframePrint1\"></iframe>
    <iframe frameborder=\"0\" src=\"/achagua/sistema/web/bundles/Llanogas/templates/formatoBio.html\" id=\"iframePrint2\"></iframe>
</div>

<!-- Division de conceptos por validar -->
<div id=\"divConceptos\" style=\"display:none;\">
    <h3>Estos conceptos no hacen base para la financiación</h3>
    <div class=\"listaSeleccion\"></div>
</div>



<div id=\"divEliminarArchivo\" style=\"display: none\">
    <p>Se eliminará el archivo, ¿Desea continuar?</p>
</div>

<!-- Div para los detalles de la factura -->
<div id=\"divDetallesFactura\" style=\"display:none;\">
    <div>
        <div class=\"campo\">
            <label for=\"txtDetNumFactura\">Núm. Factura:</label>
            <input type=\"text\" id=\"txtDetNumFactura\" disabled=\"disabled\" />
        </div>
        <div class=\"campo\">
            <label for=\"txtDetValorFinanciable\">Total Financiable:</label>
            <input type=\"text\" id=\"txtDetValorFinanciable\" disabled=\"disabled\" />
        </div>
        <div class=\"campo\">
            <label for=\"txtDetValorNoFinanciable\">Total No Financiable:</label>
            <input type=\"text\" id=\"txtDetValorNoFinanciable\" disabled=\"disabled\" />
        </div>
    </div>
    <div class=\"conceptos\">
        <table class=\"tabla\" id=\"tblConceptosFinanciables\"></table>
    </div>

    <div class=\"conceptos\">
        <table class=\"tabla\" id=\"tblConceptosNoFinanciables\"></table>
    </div>

</div>
<!-- Div para Descartar Conceptos -->
<div id=\"divDescarteConcepto\" style=\"display:none;\">
   
    <div class=\"conceptos\">
        <table class=\"tabla\" id=\"tblDescarteConceptos\"></table>
    </div>


</div>
";
    }

    // line 617
    public function block_javascripts($context, array $blocks = array())
    {
        // line 618
        echo "    <script type=\"text/javascript\" src=\"";
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/cartera/amortizador.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 619
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/cartera/NumberFormatter.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 620
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/cartera/financiacion/convertirPrecios.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 621
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/cartera/impresionformatos.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 622
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/cartera/financiacion/control.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 623
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/cartera/financiacion/modelo.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 624
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/cartera/financiacion/vista.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\">generarFinanciacionVista.init();</script>
";
    }

    public function getTemplateName()
    {
        return "LlanogasLlanogasBundle:Cartera:GenerarFinanciacion.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  768 => 624,  764 => 623,  760 => 622,  756 => 621,  752 => 620,  748 => 619,  743 => 618,  740 => 617,  490 => 368,  479 => 366,  475 => 365,  447 => 339,  436 => 337,  432 => 336,  376 => 282,  365 => 280,  361 => 279,  353 => 273,  342 => 271,  338 => 270,  207 => 142,  203 => 141,  94 => 34,  91 => 33,  83 => 31,  78 => 29,  75 => 28,  52 => 8,  48 => 7,  44 => 6,  40 => 5,  35 => 4,  32 => 3,);
    }
}
