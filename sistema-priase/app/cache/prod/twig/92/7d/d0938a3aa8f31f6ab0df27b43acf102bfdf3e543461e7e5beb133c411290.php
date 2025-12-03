<?php

/* ::base.html.twig */
class __TwigTemplate_927dd0938a3aa8f31f6ab0df27b43acf102bfdf3e543461e7e5beb133c411290 extends Twig_Template
{
    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        $this->parent = false;

        $this->blocks = array(
            'title' => array($this, 'block_title'),
            'stylesheets' => array($this, 'block_stylesheets'),
            'scripts' => array($this, 'block_scripts'),
            'titulo' => array($this, 'block_titulo'),
            'body' => array($this, 'block_body'),
            'javascripts' => array($this, 'block_javascripts'),
        );
    }

    protected function doDisplay(array $context, array $blocks = array())
    {
        // line 1
        echo "<!DOCTYPE html>
<html lang=\"es\">
    <head>
        <meta charset=\"UTF-8\" />
        <title>";
        // line 5
        $this->displayBlock('title', $context, $blocks);
        echo "</title>

        <link rel=\"stylesheet\" type=\"text/css\" href=\"";
        // line 7
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/estilo.layout.css"), "html", null, true);
        echo "\" />
        <link rel=\"stylesheet\" type=\"text/css\" href=\"";
        // line 8
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/estilo.ui.css"), "html", null, true);
        echo "\" />
        <link rel=\"stylesheet\" type=\"text/css\" href=\"/achagua/css/style.css\" />
        <link rel=\"stylesheet\" type=\"text/css\" href=\"/achagua/css/Apptable.css\" />
        <link rel=\"stylesheet\" type=\"text/css\" href=\"/achagua/css/appload.css\" />

        <link rel=\"stylesheet\" type=\"text/css\" href=\"/achagua/css/override_appload.css\" />
        <link rel=\"stylesheet\" type=\"text/css\" href=\"/achagua/css/override_apptable.css\" />

        <link rel=\"stylesheet\" type=\"text/css\" href=\"";
        // line 16
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/font-awesome.min.css"), "html", null, true);
        echo "\" />

        <link rel=\"stylesheet\" media=\"print\" type=\"text/css\" href=\"";
        // line 18
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/css/estilo_imprimir.css"), "html", null, true);
        echo "\" />
\t<link rel=\"stylesheet\" href=\"https://js.arcgis.com/4.24/esri/themes/light/main.css\">

    ";
        // line 21
        $this->displayBlock('stylesheets', $context, $blocks);
        // line 22
        echo "    <script type=\"text/javascript\" src=\"/achagua/js/app.prototypes.js\"></script>
    <script type=\"text/javascript\" src=\"/achagua/js/jquery-1.10.2.js\"></script>
    <script type=\"text/javascript\" src=\"/achagua/js/jquery.plugins.js\"></script>
    <script type=\"text/javascript\" src=\"/achagua/js/jquery-ui-1.10.4.custom.min.js\"></script>
    <script type=\"text/javascript\" src=\"/achagua/js/ui/jquery.ui.core.js\"></script>
    <script type=\"text/javascript\" src=\"/achagua/js/ui/jquery.ui.widget.js\"></script>
    <script type=\"text/javascript\" src=\"/achagua/js/ui/jquery.ui.datepicker.js\"></script>
    <script type=\"text/javascript\" src=\"/achagua/js/ui/jquery.datetimepicker.js\"></script>
    <script type=\"text/javascript\" src=\"/achagua/js/maskedinput.min.js\"></script>
    <script type=\"text/javascript\" src=\"/achagua/js/mustache.js\"></script>
    <script type=\"text/javascript\" src=\"/achagua/js/ui/jquery.ui.tabs.js\"></script>
    <script type=\"text/javascript\" src=\"/achagua/js/ui/jquery.ui.autocomplete.js\"></script>
    <script type=\"text/javascript\" src=\"/achagua/js/jquery.tree.js\"></script>
    <script type=\"text/javascript\" src=\"/achagua/js/jquery.cookie.js\"></script>
    <script type=\"text/javascript\" src=\"/achagua/js/EventTarget.js\"></script>
    <script type=\"text/javascript\" src=\"/achagua/js/Apptable.js\"></script>
    <script type=\"text/javascript\" src=\"/achagua/js/Appload.js\"></script>

    <script type=\"text/javascript\" src=\"/achagua/js/app.funciones.js\"></script>
    <script type=\"text/javascript\" src=\"/achagua/js/app.global.js\"></script>
    <script type=\"text/javascript\" src=\"/achagua/js/app.ui.js\"></script>
    <script type=\"text/javascript\" src=\"/achagua/js/app.tabla.js\"></script>
    <script type=\"text/javascript\">

        var esAppload = {
            versionError: 'Appload.js no es compatible con esta versión del navegador.',
            labelInput: 'Seleccionar archivos',
            fileTypesErrorDeclaration: 'Los tipos de archivos deben ser declarados de tipo String o Array. Definición de tipo indefinida',
            removeAllFilesBtn: 'Remover todos los archivos',
            uploadAllFilesBtn: 'Subir todos los archivos',
            singleUploadBtn: 'Subir este archivo',
            singleDiscardBtn: 'Descartar este archivo',
            singleDownloadBtn: 'Descargar este archivo',
            singleDeleteBtn: 'Borrar este archivo del servidor',
            fileNotExists: 'El archivo seleccionado no existe o está corrupto',
            notEspecifiedURL: 'Debe especificar una URL',
            errorUploadingFile: 'Ocurrió un problema al subir los archivos',
            uploading: 'Cargando...',
            fileTypeError: 'El archivo no se pudo subir, error de tipo, ',
            mustSelectFile: 'Debe seleccionar al menos un archivo',
            uploadComplete: 'Los archivos se han subido correctamente',
            filesNotLoaded: 'Hay <b>#</b> archivos que no se pueden cargar.<br />',
            allowedExtensions: 'Solo están permitidos archivos con extensión <b>#</b>.<br />',
            fileSizeExceeded: 'Los archivos no pueden exceder los <b>#Kb.</b><br>',
            summaryFileErrors: '<br>Estos son los archivos con errores:'
        };

        var lenguajeTabla = {//lenguaje
            linesPerPage: 'Líneas por página:',
            totalItems: 'Cantidad de Registros: #',
            currentPage: 'Página _# de #_ ',
            seachInputPlaceHolder: 'Buscar y presionar Enter',
            noFilteredDataMessage: 'No se encontraron resultados'
        };

        var __app = new App();
        var __cnn = new Cnn();
        var __dom = new Dom();
        window.onerror = __app.controlarErrorGeneral;
        window.onresize = __app.ajustarAnchoMenu;
        window.onscroll = __app.ajustarAnchoMenu;
        /*
         window.onbeforeunload = confirmExit;
         function confirmExit() {
         return 'Está a punto de cerrar la aplicación, si no ha guardado cambios éstos se perderán ¿Realmente desea cerrar esta ventana?';
         }
         */
    </script>

    <script type=\"text/javascript\" src=\"/achagua/js/menu/menu.model.js\"></script>
    <script type=\"text/javascript\" src=\"/achagua/js/menu/menu.control.js\"></script>
    <script type=\"text/javascript\" src=\"/achagua/js/menu/menu.vista.js\"></script>


    <style type=\"text/css\">
        .ui-autocomplete { z-index:1000 !important; }
    </style>

";
        // line 100
        $this->displayBlock('scripts', $context, $blocks);
        // line 101
        echo "
</head>
<body>

    <div id=\"divDialogoCargador\"></div>


    <div id=\"divCortinaModal\"></div>

    <div id=\"divCargador\" tabindex=\"0\">
        <img src=\"";
        // line 111
        echo twig_escape_filter($this->env, $this->env->getExtension('assets')->getAssetUrl("bundles/Llanogas/img/cargando2.gif"), "html", null, true);
        echo "\" />
        <span>Cargando...</span>
        <input type=\"text\" id=\"txtTrampaFoco\" style=\"position: absolute; top:-10000px; opacity: 0;\">
    </div>

    <div id=\"divDialogo\">
    </div>

    <div id=\"contenedor\">
        <div id=\"divTitulo\">
            <h1 id=\"h1_base_titulo_app\">Sistema de información de ";
        // line 121
        echo twig_escape_filter($this->env, (isset($context["empresa"]) ? $context["empresa"] : $this->getContext($context, "empresa")), "html", null, true);
        echo "</h1>
        </div>
        <div id=\"divAppContainer\" style=\"position:relative;\">
            <div id=\"menu\">
                <div id=\"userData\">
                    <p>Bienvenido: </p>
                    <p id=\"nomUsuarioTxt\"></p>
                    <a href=\"/achagua/index.html\">Cerrar Sesión</a>
                </div>
                <!-- para crear el menu -->
                <div class=\"filtroBusqueda\">
                    <input type=\"text\"
                           id=\"txtFiltroMenu\"
                           placeholder=\"Buscar...\" autofocus=\"autofocus\">
                </div>
                <div class=\"tree contentMenu\" id=\"contenedorOpcionesMenu\">
                    <ul id='menuItems'>

                    </ul>
                </div>
            </div>


            <div id=\"divGeneral\">
                <div id=\"divBarraOcultarMenu\">
                    <button id=\"btnOcultarMenu\" data-visible=\"true\">
                        <i class=\"fa fa-chevron-left\"></i>
                    </button>
                </div>

                <h2>";
        // line 151
        $this->displayBlock('titulo', $context, $blocks);
        echo "</h2>
                <div id=\"divFormulario\">";
        // line 152
        $this->displayBlock('body', $context, $blocks);
        echo "</div>
            </div>
            <hr class=\"limpiar\" />
        </div>
        <hr class=\"limpiar\" />
        <div id=\"piePagina\">
        </div>
        <div style=\"display:none;\">
            <input type=\"hidden\" id=\"hiddenEmpresa\" value=\"";
        // line 160
        echo twig_escape_filter($this->env, (isset($context["empresa"]) ? $context["empresa"] : $this->getContext($context, "empresa")), "html", null, true);
        echo "\" />
            <input type=\"hidden\" id=\"hiddenFechaActualServidor\" value=\"";
        // line 161
        echo twig_escape_filter($this->env, twig_date_format_filter($this->env, "now", "m/d/Y"), "html", null, true);
        echo "\" />
        </div>
    </div>
    <script type=\"text/javascript\">
        (function (\$) {
        for(var key in localStorage){\t
            sessionStorage.setItem(key, localStorage[key]);
        }
            \$('#btnOcultarMenu').on('click', function () {
                \$(this).find('.fa').toggleClass('fa-chevron-left').toggleClass('fa-chevron-right');
                if (\$(this).attr('data-visible') === 'true') {
                    \$(this).attr('data-visible', false);
                    \$('#menu').hide();
                    __app.ajustarAnchoMenu();
                    /*
                     \$('#divGeneral').width(  \$('#divAppContainer').width()-20  );
                     */
                    return;
                }
                \$(this).attr('data-visible', true);
                \$('#menu').show()//.width('15%');
                //\$('#divGeneral').width('80%');
                __app.ajustarAnchoMenu();
            });

            menuVista.init();
            __app.ajustarAnchoMenu();
            //console.clear();
        })(jQuery);
    </script>
";
        // line 191
        $this->displayBlock('javascripts', $context, $blocks);
        // line 192
        echo "</body>
</html>
";
    }

    // line 5
    public function block_title($context, array $blocks = array())
    {
        echo "ACHAGUA";
    }

    // line 21
    public function block_stylesheets($context, array $blocks = array())
    {
    }

    // line 100
    public function block_scripts($context, array $blocks = array())
    {
    }

    // line 151
    public function block_titulo($context, array $blocks = array())
    {
    }

    // line 152
    public function block_body($context, array $blocks = array())
    {
    }

    // line 191
    public function block_javascripts($context, array $blocks = array())
    {
    }

    public function getTemplateName()
    {
        return "::base.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  290 => 191,  285 => 152,  280 => 151,  275 => 100,  270 => 21,  264 => 5,  258 => 192,  256 => 191,  223 => 161,  219 => 160,  208 => 152,  204 => 151,  171 => 121,  158 => 111,  146 => 101,  144 => 100,  64 => 22,  62 => 21,  56 => 18,  51 => 16,  40 => 8,  36 => 7,  25 => 1,  129 => 62,  125 => 61,  121 => 60,  117 => 59,  112 => 58,  109 => 57,  60 => 10,  57 => 9,  49 => 7,  43 => 5,  39 => 4,  34 => 3,  31 => 5,);
    }
}
