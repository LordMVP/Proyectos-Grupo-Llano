<?php

/* AdministracionAdministracionBundle:Parametrizacion:administracionRegistroUsuarios.html.twig */
class __TwigTemplate_a7c0f355592c78c044ec5190c438ce3b8bbc8793cf5eaaf80eb9c5b71640b239 extends Twig_Template
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
        echo "    <link rel=\"stylesheet\" type=\"text/css\" href=\"";
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/theme/jquery.ui.all.css"), "html", null, true);
        echo "\" />
    <link rel=\"stylsheet\" type=\"text/css\" href=\"";
        // line 4
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/font-awesome.min.css"), "html", null, true);
        echo "\" />
    <link rel=\"stylesheet\" type=\"text/css\" href=\"";
        // line 5
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/archivos.css"), "html", null, true);
        echo "\" />
    <link rel=\"stylesheet\" type=\"text/css\" href=\"";
        // line 6
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/jquery.dataTables.min.css"), "html", null, true);
        echo "\" />
    <style>
        .campoMitad{
            width: 49%;
            display: inline-table;
            vertical-align: top !important; 
        }
        .tblSinAsignar{            
            display: block;
            height: 500px;
            overflow: scroll;
            overflow-x:hidden;
            width: 100%;
        }
        .tblAsignadas{
            display: block;
            height: 500px;
            overflow: scroll;
            overflow-x:hidden;
            width: 100%;
        }



    </style>
";
    }

    // line 33
    public function block_scripts($context, array $blocks = array())
    {
        // line 34
        echo "    <script type=\"text/javascript\" src=\"/achagua/js/jquery.dataTables.min.js\"></script>
";
    }

    // line 37
    public function block_titulo($context, array $blocks = array())
    {
        echo "Administración - Registro Permiso Por Programa ";
        echo twig_escape_filter($this->env, (isset($context["empresa"]) ? $context["empresa"] : $this->getContext($context, "empresa")), "html", null, true);
        echo "  ";
    }

    // line 39
    public function block_body($context, array $blocks = array())
    {
        // line 40
        echo "
    <div id=\"divComandos\">
        <!-- Division Mostrar Botones Administracion usuarios  Oscar Baquero-->
        <div class=\"divBotones\">
            <input type=\"button\" value=\"Grabar\" id=\"btnGrabar\" class=\"btn\" />
            <input type=\"button\" value=\"Buscar\" id=\"btnFiltrar\" class=\"btn\" />
        </div>
    </div>
    <div id=\"divPanelContenedor\">
        <div id=\"divCabecera\">
            <!-- Div Usuarios --> 
            <div id=\"divUsuarios\">
                <fieldset>
                    <legend>Datos del Colaborador</legend>
                    <!-- Division Mostrar Información Ruta -->
                    <div class=\"campo\" >
                        <label for=\"txtCedula\">Cedula:</label>
                        <input type=\"text\" id=\"txtCedula\" disabled=\"disabled\" />
                    </div>
                    <div class=\"campo\">
                        <label for=\"txtNombreUsuario\">Nombre:</label>
                        <input type=\"text\" id=\"txtNombreUsuario\" disabled=\"disabled\"/>
                    </div>
                    <div class=\"campo\">
                        <label for=\"txtCorreo\">Correo:</label>
                        <input type=\"text\" id=\"txtCorreo\" disabled=\"disabled\"/>
                    </div>
                    <div class=\"campo\">
                        <label for=\"txtTopeFinanciar\">Tope de Financiación:</label>
                        <input type=\"text\" id=\"txtTopeFinanciar\" disabled=\"disabled\"/>
                    </div>
                    <div class=\"campo\"  style=\"display: none;\">
                        <label for=\"txtIdePerfil\">Ide Perfil:</label>
                        <input type=\"text\" id=\"txtIdePerfil\" disabled=\"disabled\"/>
                    </div>
                    <div class=\"campo\">
                        <label for=\"txtPerfil\">Perfil:</label>
                        <input type=\"text\" id=\"txtPerfil\" disabled=\"disabled\"/>
                    </div>
                    <div class=\"campo\">
                        <label for=\"txtIdeUsuario\">Ide Usuario:</label>
                        <input type=\"text\" id=\"txtIdeUsuario\" disabled=\"disabled\"/>
                    </div>
                    <div class=\"campo\">
                        <label for=\"cboRecaudoExterno\">Recaudo Externo:</label>
                        <select id=\"cboRecaudoExterno\" disabled=\"disabled\">                            
                            <option value=\"S\">SI</option>
                            <option value=\"N\">NO</option>

                        </select>
                    </div>
                    <div class=\"campo\">
                        <input type=\"checkbox\" name=\"checkUnidades\" value=\"\" id=\"checkUnidades\">Asignar todos los permisos.
                    </div>
                </fieldset>

            </div>
            <div id=\"divColapsable\">
                <div  id=\"divProgramaUnidades\" style=\"display:none\">
                    <fieldset>
                        <legend>Programa - Unidades</legend>
                        <div id=\"divcboProgramas\" class=\"campo\" style=\"margin: 0px 10px 10px 0px;\">
                            <label for=\"cboProgramaAsignar\">Programas:</label>
                            <select id=\"cboProgramaAsignar\"></select>
                        </div>
                        <div id=\"divcboEstructura\" class=\"campo\" style=\"margin: 0px 10px 10px 0px;\" style=\"display:none\">
                            <label for=\"cboEstructura\">Estructuras de Unidades:</label>
                            <select id=\"cboEstructura\"></select>
                        </div>
                        <div id=\"divbtnUnidades\" class=\"campo\">                                       
                            <input type =\"button\" id=\"btnUnidades\" class=\"btnSimple\" value=\"Todas las unidades\" />
                        </div>
                        <div class=\"divContenedorColapsable\" id=\"contenedorUsuarioLogin\" style=\"margin-right: 42px;\">
                            <div class=\"divColapsable\">
                                <h4 class=\"tituloColapsable\" id=\"unidadesLogin\"><span>Unidades</span></h4>
                                <div class=\"btnColapsable\">
                                    <a href=\"\" class=\"fa fa-minus\" tabindex=\"-1\"></a>
                                </div>
                            </div>
                            <div class=\"contenidoColapsable\">
                                <div class=\"campoMitad campos\">
                                    <div class=\"tblSinAsignar\">
                                        <table class=\"tabla\" id=\"tblProgramaUnidadesSinAsignarLogin\"></table>
                                        <input type =\"button\" id=\"btnAsignar\" class=\"btnSimple\" value=\"Asignar\" style=\"display:none\"/>
                                    </div>
                                </div>
                                <div class=\"campoMitad campos\">
                                    <div class=\"tblAsignadas\">
                                        <table class=\"tabla\" id=\"tblProgramaUnidadesAsignadasUsuario\"></table>
                                        <input type =\"button\" id=\"btnRetirar\" class=\"btnSimple\" value=\"Retirar\" style=\"display:none\"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                </div>    


                <div  id=\"divProgramaProyectos\" style=\"display:none\">
                    <fieldset>
                        <legend>Programa - Proyectos</legend>
                        <div id=\"divcboProgramasProyectos\" class=\"campo\" style=\"margin: 0px 10px 10px 0px;\">
                            <label for=\"cboProgramaAsignarProyecto\">Programas:</label>
                            <select id=\"cboProgramaAsignarProyecto\"></select>
                        </div>

                        <div class=\"divContenedorColapsable\" id=\"contenedorUsuarioLogin\" style=\"margin-right: 42px;\">
                            <div class=\"divColapsable\">
                                <h4 class=\"tituloColapsable\" id=\"proyectosLogin\"><span>Proyectos</span></h4>
                                <div class=\"btnColapsable\">
                                    <a href=\"\" class=\"fa fa-minus\" tabindex=\"-1\"></a>
                                </div>
                            </div>
                            <div class=\"contenidoColapsable\">
                                <div class=\"campoMitad campos\">
                                    <div class=\"tblSinAsignar\">
                                        <table class=\"tabla\" id=\"tblProgramaProyectosSinAsignarLogin\"></table>
                                        <input type =\"button\" id=\"btnProyectoAsignar\" class=\"btnSimple\" value=\"Asignar\" style=\"display:none\"/>
                                    </div>
                                </div>
                                <div class=\"campoMitad campos\">
                                    <div class=\"tblAsignadas\">
                                        <table class=\"tabla\" id=\"tblProgramaProyectosAsignadasUsuario\"></table>
                                        <input type =\"button\" id=\"btnProyectoRetirar\" class=\"btnSimple\" value=\"Retirar\" style=\"display:none\"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                </div>           



                <div  id=\"divMediosPago\" style=\"display:none\">
                    <fieldset>
                        <legend>Recaudadores Externos e Internos</legend>

                        <div class=\"divContenedorColapsable\" id=\"contenedorMediosPagos\" style=\"margin-right: 42px;\">
                            <div class=\"divColapsable\">
                                <h4 class=\"tituloColapsable\" id=\"mediosPagos\">Medios de <span>Pagos</span></h4>
                                <div class=\"btnColapsable\">
                                    <a href=\"\" class=\"fa fa-minus\" tabindex=\"-1\"></a>
                                </div>
                            </div>
                            <div class=\"contenidoColapsable\">
                                <div class=\"campoMitad campos\">
                                    <div class=\"tblSinAsignar\">
                                        <table class=\"tabla\" id=\"tblMediosPagosLogin\"></table>
                                        <input type =\"button\" id=\"btnAsignarMediosPagos\" class=\"btnSimple\" value=\"Asignar\" style=\"display:none\"/>
                                    </div>
                                </div>
                                <div class=\"campoMitad campos\">
                                    <div class=\"tblAsignadas\">
                                        <table class=\"tabla\" id=\"tblMediosPagosAsignados\"></table>
                                        <input type =\"button\" id=\"btnRetirarMediosPagos\" class=\"btnSimple\" value=\"Retirar\" style=\"display:none\"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                </div>     

                <div  id=\"divRutas\" style=\"display:none\">
                    <fieldset>
                        <legend>Rutas</legend>

                        <div class=\"divContenedorColapsable\" id=\"contenedorMediosPagos\" style=\"margin-right: 42px;\">
                            <div class=\"divColapsable\">
                                <h4 class=\"tituloColapsable\" id=\"rutasLogin\"><span>Rutas</span></h4>
                                <div class=\"btnColapsable\">
                                    <a href=\"\" class=\"fa fa-minus\" tabindex=\"-1\"></a>
                                </div>
                            </div>
                            <div class=\"contenidoColapsable\">
                                <div class=\"campoMitad campos\">
                                    <div class=\"tblSinAsignar\">
                                        <table class=\"tabla\" id=\"tblRutasLogin\"></table>
                                        <input type =\"button\" id=\"btnAsignarRutas\" class=\"btnSimple\" value=\"Asignar\" style=\"display:none\"/>
                                    </div>
                                </div>
                                <div class=\"campoMitad campos\">
                                    <div class=\"tblAsignadas\">
                                        <table class=\"tabla\" id=\"tblRutasAsignados\"></table>
                                        <input type =\"button\" id=\"btnRetirarRutas\" class=\"btnSimple\" value=\"Retirar\" style=\"display:none\"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                </div>     
            </div>
            <div id=\"divBuscarColaborador\" style=\"display: none;\">

                <div class=\"campo\">
                    <label for=\"txtCedulaColaborador\">Cedula Colaborador:</label>
                    <input type=\"text\" id=\"txtCedulaColaborador\" maxlength=\"15\" />
                </div>
                <div class=\"campo\">
                    <label for=\"txtNombreColaborador\">Nombre:</label>
                    <input type=\"text\" id=\"txtNombreColaborador\" maxlength=\"20\" />
                </div>


                <input type =\"button\" id=\"btnBuscarColaborador\" class=\"btnSimple\" value=\"Buscar\"/>

                <div id=\"divResultadosFiltro\" style=\"display:none;\">
                    <table id=\"tblResultadoFiltro\" class=\"tabla\"></table>    
                </div>

                <span id=\"mensajeAlertaDialogo\" class=\"pMensaje\"></span>
            </div>
            
            <div id=\"divBuscarUsuarios\" style=\"display: none;\">

                <div class=\"campo\">
                    <label for=\"txtCedulaUsu\">Cedula Colaborador:</label>
                    <input type=\"text\" id=\"txtCedulaUsu\" maxlength=\"15\" />
                </div>
                <div class=\"campo\">
                    <label for=\"txtNombreUsu\">Nombre:</label>
                    <input type=\"text\" id=\"txtNombreUsu\" maxlength=\"20\" />
                </div>


                <input type =\"button\" id=\"btnGetUsuario\" class=\"btnSimple\" value=\"Buscar\"/>

                <div id=\"divResultadosUsuario\" style=\"display:none;\">
                    <table id=\"tblResultadoUsuario\" class=\"tabla\"></table>    
                </div>

                <span id=\"mensajeAlertaDialogo\" class=\"pMensaje\"></span>
            </div>
            <div id=\"divConfirma\" style=\"display: none;\">
             <p>Por favor confirme la acción de los Permisos al Colaborador</p>
        </div> 

            <div id=\"divAutorizacionPerfil\" style=\"display:none\">
                <div>
                    <h2>Él colaborador no tiene perfil para Prisma. Autorice la creación de perfil</h2>
                </div>
                <div>
                    <label for=\"cboPerfil\">Perfiles:</label>
                    <select id=\"cboPerfil\">

                    </select>
                </div>
            </div>
        </div >           

    </div>


";
    }

    // line 294
    public function block_javascripts($context, array $blocks = array())
    {
        // line 295
        echo "    <script type=\"text/javascript\" src=\"";
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Administracion/js/registroUsuarios/registroUsuarios.model.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 296
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Administracion/js/registroUsuarios/registroUsuarios.control.js"), "html", null, true);
        echo "\"></script>
    <script type=\"text/javascript\" src=\"";
        // line 297
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Administracion/js/registroUsuarios/registroUsuarios.vista.js"), "html", null, true);
        echo "\"></script>
";
    }

    public function getTemplateName()
    {
        return "AdministracionAdministracionBundle:Parametrizacion:administracionRegistroUsuarios.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  365 => 297,  361 => 296,  356 => 295,  353 => 294,  97 => 40,  94 => 39,  86 => 37,  81 => 34,  78 => 33,  48 => 6,  44 => 5,  40 => 4,  35 => 3,  32 => 2,);
    }
}
