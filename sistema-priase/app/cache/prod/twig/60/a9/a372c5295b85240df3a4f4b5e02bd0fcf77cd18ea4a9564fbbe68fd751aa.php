<?php

/* LlanogasLlanogasBundle:Suscripcion:registrarSuscripcion.html.twig */
class __TwigTemplate_60a9a372c5295b85240df3a4f4b5e02bd0fcf77cd18ea4a9564fbbe68fd751aa extends Twig_Template
{
    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        $this->parent = false;

        $this->blocks = array(
        );
    }

    protected function doDisplay(array $context, array $blocks = array())
    {
        // line 1
        echo "
<div id=\"divPanelContenedor\">


    <div id=\"divCabecera\">
        <div class=\"divIzquierda\">
            <!-- Emergente para confirmar eliminación de concepto -->
            <div id=\"divConfirmarEliminar\">
                <p>¿Está seguro de eliminar el registro?</p>
            </div>
            <!-- Emergente para confirmar búsqueda y cancelación de la operación actual -->
            <div id=\"divConfirmarBuscarSuscripcion\">
                <p>Al buscar se cancelará la operación actual si no ha sido guardada... ¿Iniciar búsqueda?</p>
            </div>
            <!-- Emergente para confirmar cancelación de la operación-->
            <div id=\"divConfirmarCancelar\">
                <p>¿Está seguro de cancelar la operación?</p>
            </div>

            <!--Emergente para seleccionar propiedad-->
            <div id=\"divSeleccionarPropiedad\">
                <fieldset id=\"propiedadesAsignadas\">
                    <legend>Propiedades Asignadas</legend>
                    <span id=\"mensaje\">No hay propiedades asignadas</span>
                    <div style=\"max-height: 40vh; overflow-y: auto\">
                        <table id=\"tblPropiedadesAsignadas\" class=\"tabla\"></table>
                    </div>
                </fieldset>
                <fieldset id=\"propiedadesSinAsignar\">
                    <legend>Propiedades Sin Asignar</legend>
                    <span id=\"mensaje\">No hay propiedades sin asignar</span>
                    <div style=\"max-height: 40vh; overflow-y: auto\">
                        <table id=\"tblPropiedadesSinAsignar\" class=\"tabla\"></table>
                    </div>
                </fieldset>
            </div>

            <!--Emergente para editar el concepto-->
            <div id=\"divEditarConcepto\">

                <div class=\"campo\">
                    <label for=\"txtIdConcepto\">Id Concepto:</label>
                    <input type=\"text\" id=\"txtIdConcepto\" disabled=\"disabled\"/>
                </div>

                <div class=\"campo\">
                    <label for=\"txtConcepto\">Concepto:</label>
                    <input type=\"text\" id=\"txtConcepto\" disabled=\"diabled\"/>
                </div>

                <div class=\"campo\">
                    <label for=\"txtCantidad\">Cantidad:</label>
                    <input type=\"text\" id=\"txtCantidad\"/>
                </div>

                <div class=\"campo\">
                    <label for=\"txtValorUnitario\">Valor Unitario:</label>
                    <input type=\"text\" id=\"txtValorUnitario\" />
                </div>

                <div class=\"campo\">
                    <label for=\"txtValorTotal\">Valor Total:</label>
                    <input type=\"text\" id=\"txtValorTotal\" disabled=\"diabled\" />
                </div>

                <div class=\"campo\">
                    <label for=\"txtFechaInicial\">Fecha Inicial:</label>
                    <input type=\"text\" id=\"txtFechaInicial\"/>
                </div>

                <div class=\"campo\">
                    <label for=\"txtFechaFinal\">Fecha Final:</label>
                    <input type=\"text\" id=\"txtFechaFinal\"/>
                </div>
            </div>

            <!-- Emergente para buscar suscripción-->
            <div id=\"divBuscarSuscripcion\">

                <div class=\"campo\">
                    <label for=\"cboMunicipio\">Municipio:</label>
                    <select id=\"cboMunicipio\" >
                        <option value=\"-1\"> Seleccione </option>
                        ";
        // line 84
        $context['_parent'] = (array) $context;
        $context['_seq'] = twig_ensure_traversable((isset($context["listamunicipios"]) ? $context["listamunicipios"] : $this->getContext($context, "listamunicipios")));
        foreach ($context['_seq'] as $context["_key"] => $context["municipio"]) {
            // line 85
            echo "                            <option value=\"";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["municipio"]) ? $context["municipio"] : $this->getContext($context, "municipio")), "idmunicipio"), "html", null, true);
            echo "\">";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["municipio"]) ? $context["municipio"] : $this->getContext($context, "municipio")), "municipio"), "html", null, true);
            echo "</option>
                        ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['municipio'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 87
        echo "                    </select>
                </div>

                <div class=\"campo\">
                    <label for=\"cboBarrio\">Barrio:</label>
                    <select id=\"cboBarrio\" >
                    </select>
                </div>

                <div class=\"campo\">
                    <label for=\"txtNombreTerceroBuscar\">Nombre Tercero:</label>
                    <input type=\"text\" id=\"txtNombreTerceroBuscar\" data-attr=\"nombreTercero\"/>
                    <input type=\"hidden\" id=\"idTercero\" data-attr=\"idTercero\"/>
                </div>

                <div class=\"campo\">
                    <label for=\"txtDocumentoTerceroBuscar\">NIT/CC:</label>
                    <input type=\"text\" id=\"txtDocumentoTerceroBuscar\" />
                </div>

                <div class=\"campo\">
                    <label for=\"txtDireccionBuscar\">Dirección:</label>
                    <input type=\"text\" id=\"txtDireccionBuscar\" />
                </div>

                <div class=\"campo\">
                    <label for=\"txtNumeroCatastralBuscar\">Número Catastral:</label>
                    <input type=\"text\" id=\"txtNumeroCatastralBuscar\" />
                </div>

                <div class=\"campo\">
                    <label for=\"txtNumeroRuta\">Ruta:</label>
                    <input type=\"text\" id=\"txtNumeroRuta\" />
                </div>

                <div class=\"campo\">
                    <label for=\"txtNumeroPropiedad\">Número Propiedad:</label>
                    <input type=\"text\" id=\"txtNumeroPropiedad\" />
                </div>

                <div class=\"campo\">
                    <label for=\"txtIdSuscripcion\">Id Suscripción:</label>
                    <input type=\"text\" id=\"txtIdSuscripcion\" />
                </div>

                <div class=\"campo\">
                    <label for=\"txtCodigoAnterior\">Código Anterior:</label>
                    <input type=\"text\" id=\"txtCodigoAnterior\" />
                </div>
                <div class=\"listaSeleccion\"></div> 
                <span id=\"spanMensaje\" class=\"pMensaje\"></span>

            </div>

            <!-- Emergente para buscar suscriptor-->
            <div id=\"divBuscarSuscriptor\">

                <div class=\"campo\">
                    <label for=\"txtNombreTerceroNuevo\">Nombre Tercero:</label>
                    <input type=\"text\" id=\"txtNombreTerceroNuevo\" maxlength=\"30\" />
                </div>

                <div class=\"campo\">
                    <label for=\"txtIdSuscriptorNuevo\">Id Suscriptor:</label>
                    <input type=\"text\" id=\"txtIdSuscriptorNuevo\" maxlength=\"20\" />
                </div>

                <div class=\"campo\">
                    <label for=\"txtDocumentoTerceroNuevo\">NIT/CC:</label>
                    <input type=\"text\" id=\"txtDocumentoTerceroNuevo\" maxlength=\"20\" />
                </div>

                <input type=\"button\" value=\"Buscar\" id=\"btnBuscarSuscriptor\" class=\"btnSimple\">

                <span id=\"spanMensaje\" class=\"pMensaje\"></span>

                <div class=\"listaSeleccion\"></div> 

            </div>

            <!--Fieldset para mostrar datos del tercero-->
            <fieldset id=\"fieldsetDatosTercero\">
                <legend>Datos del Tercero</legend>

                <div class=\"campo\">
                    <label for=\"txtDocumento\">NIT/CC:</label>
                    <input type=\"text\" id=\"txtDocumento\" disabled=\"disabled\" />
                </div>

                <div class=\"campo\">
                    <label for=\"txtNombre\">Nombre:</label>
                    <input type=\"text\" id=\"txtNombre\" disabled=\"disabled\" />
                </div>

                <div class=\"campo\">
                    <label for=\"txtIdTercero\">Id Tercero:</label>
                    <input type=\"text\" id=\"txtIdTercero\" disabled=\"disabled\" />
                </div>

                <div class=\"campo\">
                    <label for=\"txtTelefonoFijo\">Teléfono Fijo:</label>
                    <input type=\"text\" id=\"txtTelefonoFijo\" disabled=\"disabled\" />
                </div>

                <div class=\"campo\">
                    <label for=\"txtTelefonoCelular\">Teléfono Celular:</label>
                    <input type=\"text\" id=\"txtTelefonoCelular\" disabled=\"disabled\" />
                </div>

                <div class=\"campo\">
                    <label for=\"txtIdSuscriptor\">Id Suscriptor:</label>
                    <input type=\"text\" id=\"txtIdSuscriptor\" disabled=\"disabled\" />
                </div>

                <div class=\"campo\">
                    <label for=\"txtConvenio\">Convenio:</label>
                    <input type=\"text\" id=\"txtConvenio\" disabled=\"disabled\" />
                </div>

                <div>
                    <label for=\"txtDescripcion\">Descripción:</label>
                    <textarea id=\"txtDescripcion\" disabled=\"disabled\" ></textarea>
                </div>

                <input type=\"button\" value=\"Buscar Propiedad\" id=\"btnBuscarPropiedad\" class=\"btnSimple\">

            </fieldset>

            <!--Fieldset oculto para mostrar datos de la propiedad seleccionada-->
            <fieldset id=\"fieldsetPropiedad\">
                <legend>Propiedad</legend>

                <div class=\"campo\">
                    <label for=\"txtNumeroPropiedad\">Número Propiedad:</label>
                    <input type=\"text\" id=\"txtNumeroPropiedad\" disabled=\"disabled\" />
                </div>

                <div class=\"campo\">
                    <label for=\"txtTipoPropiedad\">Tipo Propiedad:</label>
                    <input type=\"text\" id=\"txtTipoPropiedad\" disabled=\"disabled\" />
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
                    <label for=\"txtSeccion\">Sección:</label>
                    <input type=\"text\" id=\"txtSeccion\" disabled=\"disabled\" />
                </div>

                <div class=\"campo\">
                    <label for=\"txtManzana\">Manzana:</label>
                    <input type=\"text\" id=\"txtManzana\" disabled=\"disabled\" />
                </div>

                <div class=\"campo\">
                    <label for=\"txtAltoRiesgo\">Alto Riesgo:</label>
                    <input type=\"text\" id=\"txtAltoRiesgo\" disabled=\"disabled\" />
                </div>

                <div class=\"campo\">
                    <label for=\"txtNumeroCatastral\">Número Catastral:</label>
                    <input type=\"text\" id=\"txtNumeroCatastral\" disabled=\"disabled\" />
                </div>

                <div class=\"campo\">
                    <label for=\"txtZona\">Zona:</label>
                    <input type=\"text\" id=\"txtZona\" disabled=\"disabled\" />
                </div>

                <div>
                    <label for=\"txtDescripcion\">Descripción:</label>
                    <textarea id=\"txtDescripcion\" disabled=\"disabled\" ></textarea>
                </div>

                <input type=\"button\" value=\"Agregar Detalles\" id=\"btnAgregarDetalles\" class=\"btnSimple\">

            </fieldset>

            <!--Fieldset oculto para agregar detalles de la suscripción-->
            <fieldset id=\"fieldsetDetallesSuscripcion\">
                <legend>Detalles de Suscripción</legend>

                <div class=\"campo oculto\">
                    <label for=\"txtIdSuscripcion\">Id Suscripción:</label>
                    <input type=\"text\" id=\"txtIdSuscripcion\" disabled=\"disabled\" />
                </div>

                <div class=\"campo\">
                    <label for=\"txtCodigoAnterior\">Código Anterior:</label>
                    <input type=\"text\" id=\"txtCodigoAnterior\" disabled=\"disabled\" />
                </div>

                <div class=\"campo\">
                    <label for=\"txtFechaInicio\">Fecha de Inicio:</label>
                    <input type=\"text\" id=\"txtFechaInicio\" class=\"sinBloqueo\" />
                </div>

                <div class=\"campo\">
                    <label for=\"txtDescripcion\">Descripción:</label>
                    <input type=\"text\" id=\"txtDescripcion\" class=\"sinBloqueo\"/>
                </div>

                <div class=\"campo\">
                    <label for=\"cboTipoSuscripcion\">Tipo Suscripción:</label>
                    <select id=\"cboTipoSuscripcion\" class=\"sinBloqueo\" >
                    </select>
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
                    <select id=\"cboTipoUso\" class=\"sinBloqueo\" >
                    </select>
                </div>

                <div class=\"campo\">
                    <label for=\"cboLiquidacion\">Liquidación:</label>
                    <select id=\"cboLiquidacion\" class=\"sinBloqueo\" >
                    </select>
                </div>

                <div class=\"campo\">
                    <label for=\"cboEstrato\">Estrato/Categoría:</label>
                    <select id=\"cboEstrato\" class=\"sinBloqueo\" >
                        <option value=\"-1\">Seleccione</option>
                        <option value=\"1\">1</option>
                        <option value=\"2\">2</option>
                        <option value=\"3\">3</option>
                        <option value=\"4\">4</option>
                        <option value=\"5\">5</option>
                        <option value=\"6\">6</option>
                    </select>
                </div>

                <div class=\"campo\">
                    <label for=\"cboEstado\">Estado:</label>
                    <select id=\"cboEstado\" class=\"sinBloqueo\" >
                        <option value=\"-1\">Seleccione</option>
                        <option value=\"A\">Activa</option>
                        <option value=\"U\">Suspensión Usuario</option>
                        <option value=\"E\">Eliminada</option>
                        <option value=\"R\">Suspensión Remodelación</option>
                    </select>
                </div>  

                <div class=\"campo\">
                    <label for=\"txtFactorCorreccion\">Factor Corrección:</label>
                    <input type=\"text\" id=\"txtFactorCorreccion\" disabled=\"disabled\" />
                </div>
                <div class=\"campo\">
                    <label for=\"cboActividadEconimica\">Actividad Economica:</label>
                    <select id=\"cboActividadEconimica\" class=\"sinBloqueo\" >

                    </select>
                </div>  

                <input type=\"button\" value=\"Conceptos\" id=\"btnVerConceptos\" class=\"btnSimple\">
                <div>
                    <button class=\"btnSimple\" id=\"btnAgregarConceptos\">Agregar Conceptos</button>
                </div>
            </fieldset>

            <!--Fieldset oculto para ver los conceptos-->
            <fieldset id=\"fieldsetConceptos\">
                <legend>Conceptos</legend>
                <table id=\"tblConceptos\" class=\"tabla\"></table>
            </fieldset>

        </div>
    </div>
</div>

<div id=\"divDialogoConceptos\" style=\"display:none;\">
    <div id=\"divListaConceptos\">
    </div>
</div>
<script type=\"text/javascript\" src=\"";
        // line 385
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/suscripcion/gestionarSuscripcion/gestionarsuscripcion.modelo.js"), "html", null, true);
        echo "\"></script>
<script type=\"text/javascript\" src=\"";
        // line 386
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/suscripcion/gestionarSuscripcion/gestionarsuscripcion.control.js"), "html", null, true);
        echo "\"></script>
<script type=\"text/javascript\" src=\"";
        // line 387
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/suscripcion/gestionarSuscripcion/gestionarsuscripcion.vista.js"), "html", null, true);
        echo "\"></script>
";
    }

    public function getTemplateName()
    {
        return "LlanogasLlanogasBundle:Suscripcion:registrarSuscripcion.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  427 => 387,  423 => 386,  419 => 385,  119 => 87,  108 => 85,  104 => 84,  19 => 1,  96 => 39,  92 => 37,  81 => 28,  78 => 27,  70 => 25,  65 => 22,  62 => 21,  44 => 6,  40 => 5,  35 => 4,  32 => 3,);
    }
}
