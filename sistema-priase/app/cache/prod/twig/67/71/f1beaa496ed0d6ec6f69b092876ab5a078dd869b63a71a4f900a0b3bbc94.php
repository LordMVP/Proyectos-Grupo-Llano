<?php

/* LlanogasLlanogasBundle:Ventas:registrar_barrios.html.twig */
class __TwigTemplate_6771f1beaa496ed0d6ec6f69b092876ab5a078dd869b63a71a4f900a0b3bbc94 extends Twig_Template
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
        // line 4
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/theme/jquery.ui.all.css"), "html", null, true);
        echo "\" />
    <link rel=\"stylsheet\" type=\"text/css\" href=\"";
        // line 5
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/font-awesome.min.css"), "html", null, true);
        echo "\" />
    <style>
        .uploaded-item{

        }
        #divArchivos .appload-input{
            color: #FFF !important;
        }
    </style>
";
    }

    // line 16
    public function block_scripts($context, array $blocks = array())
    {
        // line 17
        echo "
";
    }

    // line 20
    public function block_titulo($context, array $blocks = array())
    {
        echo " Registrar : Barrios - ";
        echo twig_escape_filter($this->env, (isset($context["empresa"]) ? $context["empresa"] : $this->getContext($context, "empresa")), "html", null, true);
        echo "  ";
    }

    // line 21
    public function block_body($context, array $blocks = array())
    {
        // line 22
        echo "
    <div id=\"divComandos\">
        <div class=\"divBotones\">            
            <input type=\"button\" value=\"Nuevo\" id=\"btnNuevo\" class=\"btn\"  />
            <input type=\"button\" value=\"Grabar\" id=\"btnGrabar\" class=\"btn\" />            
            <input type=\"button\" value=\"Buscar\" id=\"btnBuscar\" class=\"btn\" />   
        </div>
    </div>

    <div id=\"divPanelContenedor\">
        <div id=\"divBarrio\">
            <fieldset>
                <legend>Información del Barrio</legend>
                <div class=\"campoCorto\">
                    <label for=\"txtCodigo\">Código</label>
                    <input type=\"text\" id=\"txtCodigo\" required=\"required\" disabled=\"disabled\"/>
                </div>
                <div class=\"campo\">
                    <label for=\"cmbMunicipio\">Municipio:</label>
                    <select id=\"cmbMunicipio\" required=\"required\" disabled=\"disabled\">
                        <option value=\"-1\"> Seleccione una opción</option>
                        ";
        // line 43
        $context['_parent'] = (array) $context;
        $context['_seq'] = twig_ensure_traversable((isset($context["listamunicipios"]) ? $context["listamunicipios"] : $this->getContext($context, "listamunicipios")));
        foreach ($context['_seq'] as $context["_key"] => $context["municipio"]) {
            // line 44
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
        // line 46
        echo "                    </select>
                </div>
                <div class=\"campo\">
                    <label for=\"txtNombre\">Nombre Barrio:</label>
                    <input type=\"text\" id=\"txtNombre\" required=\"required\" disabled=\"disabled\"/>
                </div>              

                <button id=\"btnExisteBarrio\" class=\"btnSimple\" >Validar Existencia</button>

                <div class=\"campo\">

                    <label for=\"txtTercerizado\">Tercerizado</label>
                    <select id=\"txtTercerizado\" required=\"required\" disabled=\"disabled\">                        
                        <option value='true'>Si</option>
                        <option value='false'>No</option>
                    </select>
                </div>
                <div class=\"campoCorto\">
                    <label for=\"txtSector\">Sector:</label>
                    <input type=\"text\" id=\"txtSector\" required=\"required\" disabled=\"disabled\"/>

                </div>


                <span id=\"mensajeAlerta\" class=\"pMensaje\"></span>

            </fieldset>

            <fieldset>
                <legend>Vincular Rutas</legend>


                <div class=\"campo\">
                    <label for=\"cmbRuta\">Ruta:</label>
                    <select id=\"cmbRuta\" disabled=\"disabled\">
                       
                    </select>
                </div>
                <button id=\"btnAdicionarRuta\" class=\"btnSimple\" >Adicionar Ruta</button>



            </fieldset>

            <fieldset>
                <legend>Rutas Vinculadas</legend>
                <div id=\"divRutasVinculadas\" >
                    <table id=\"tblRutasVinculadas\" class=\"tabla\" style=\"display:none;\"></table>    
                </div>
            </fieldset>
        </div>


        <div id=\"divBuscarBarrio\" style=\"display: none;\">

            <div class=\"campo\" >
                <label for=\"cmbMunicipioBarrio\">Municipio:</label>
                <select id=\"cmbMunicipioBarrio\" required=\"required\">
                    <option value=\"-1\"> Seleccione una opción</option>
                    ";
        // line 105
        $context['_parent'] = (array) $context;
        $context['_seq'] = twig_ensure_traversable((isset($context["listamunicipios"]) ? $context["listamunicipios"] : $this->getContext($context, "listamunicipios")));
        foreach ($context['_seq'] as $context["_key"] => $context["municipio"]) {
            // line 106
            echo "                        <option value=\"";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["municipio"]) ? $context["municipio"] : $this->getContext($context, "municipio")), "idmunicipio"), "html", null, true);
            echo "\">";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["municipio"]) ? $context["municipio"] : $this->getContext($context, "municipio")), "municipio"), "html", null, true);
            echo "</option>
                    ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['municipio'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 108
        echo "                </select>
            </div>

            <div class=\"campo\">
                <label for=\"txtCodBarrio\">Código Barrio:</label>
                <input type=\"text\" id=\"txtCodBarrio\" maxlength=\"15\" />
            </div>

            <div class=\"campo\">
                <label for=\"txNombreBarrio\">Nombre Barrio:</label>
                <input type=\"text\" id=\"txNombreBarrio\" maxlength=\"20\" />
            </div>

            <input type =\"button\" id=\"btnBuscarBarrio\" class=\"btnSimple\" value=\"Buscar\"/>

            <div id=\"divResultadosFiltro\" style=\"display:none;\">
                <table id=\"tblResultadoFiltro\" class=\"tabla\"></table>    
            </div>

            <span id=\"mensajeAlertaDialogo\" class=\"pMensaje\"></span>
        </div>


    </div>



";
    }

    // line 137
    public function block_javascripts($context, array $blocks = array())
    {
        // line 138
        echo "    <script type=\"text/javascript\" src=\"";
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/ventas/crearbarrios/crearbarrios.model.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 139
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/ventas/crearbarrios/crearbarrios.control.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 140
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/js/ventas/crearbarrios/crearbarrios.vista.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\">
        crearBarriosVista.init();
    </script>
";
    }

    public function getTemplateName()
    {
        return "LlanogasLlanogasBundle:Ventas:registrar_barrios.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  232 => 140,  228 => 139,  223 => 138,  220 => 137,  189 => 108,  178 => 106,  174 => 105,  113 => 46,  102 => 44,  98 => 43,  75 => 22,  72 => 21,  64 => 20,  59 => 17,  56 => 16,  42 => 5,  38 => 4,  35 => 3,  32 => 2,);
    }
}
