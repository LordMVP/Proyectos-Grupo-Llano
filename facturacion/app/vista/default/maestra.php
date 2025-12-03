<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="generator" content="JorgeUbaque">
        <title>#TITLE#</title>
        <script id="script_2101" type="text/javascript" src="app/vista/default/js/jquery.min.js"></script> 
        <!--<script id="script_2101"  type="text/javascript" src="/achagua/js/jquery-1.10.2.js"></script>  -->
        <script id="script_2102"  type="text/javascript" src="app/vista/default/js/AjaxUpload.2.0.min.js"></script>
        <script id="script_2103"  type="text/javascript" src="app/vista/default/js/funciones_generales.js"></script>
        <script id="script_2104"  type="text/javascript" src="app/vista/default/js/aplicacion.js"></script>
        <script id="script_2105"  type="text/javascript" src="app/vista/default/js/blockUI.js"></script>  
        <script id="script_2106"  type="text/javascript" src="app/vista/default/js/vista/#JSFORM#.js"></script>   
          <script id="script_2109" type="text/javascript" src="app/vista/default/js/inputmask.min.js"></script>
  <script id="script_2110" type="text/javascript" src="app/vista/default/js/inputmask.dependencyLib.jquery.min.js"></script>
  <script id="script_2111" type="text/javascript" src="app/vista/default/js/inputmask.numeric.extensions.min.js"></script>
  <script id="script_2112" type="text/javascript" src="app/vista/default/js/jquery.inputmask.bundle.js"></script>
        <link rel="stylesheet" type="text/css" href="/achagua/css/style.css" />
        <script type="text/javascript" src="/achagua/js/app.funciones.js"></script>

        <script type="text/javascript" src="/achagua/js/app.ui.js"></script>
        <script type="text/javascript" src="/achagua/js/app.global.js"></script>
        <script type="text/javascript" src="/achagua/js/jquery.tree.js"></script>
        <script type="text/javascript" src="/achagua/js/jquery.cookie.js"></script>
        <script type="text/javascript" src="/achagua/js/menu/menu.model.js"></script>
        <script type="text/javascript" src="/achagua/js/menu/menu.control.js"></script>
        <script type="text/javascript" src="/achagua/js/menu/menu.vista.js"></script>
        <link id="link_2107"  rel="stylesheet" href="app/vista/default/css/style.css" type="text/css" />
        <link id="link_2108"  rel="stylesheet" href="app/vista/default/css/formulario.css" type="text/css" /> 
        <link rel="stylesheet" type="text/css" href="/achagua/sistema/web/bundles/Llanogas/css/theme/jquery.ui.all.css">
        <link rel="stylesheet" type="text/css" href="/achagua/sistema/web/bundles/Llanogas/css/font-awesome.min.css" />
        <script type="text/javascript"> var __dom = new Dom();
            var __app = new App();</script>  
    </head>
    <body> 
        <div id="divCargador">
            <img src="/achagua/sistema/web/bundles/Llanogas/img/cargando2.gif" />
            <span>Cargando...</span>
        </div>
        <div id="divDialogo"></div>
        <div id="contenedor" class="col2">
            <!-- ################################################   TITULO-->
            <div id="divTitulo">
            #HEADER#
            </div>
            <!-- ################################################   TITULO FIN-->   
            <div id="divAppContainer" style="position:relative;">
                <!--<div class="contenido">-->
                <div id="menu">
                    <!-- ################################################   MENU PRINCIPAL-->
                    #MENULEFT#
                </div>
                <div id="divGeneral">
                    <div id="divBarraOcultarMenu">
                        <button id="btnOcultarMenu" data-visible="true">
                            <i class="fa fa-chevron-left"></i>
                        </button>
                    </div>
                    <div id="divRespuesta" style="display:none"></div>
                    <!-- ################################################   CONTENIDOS Y REPORTES-->
                    #CONTENIDO#
                    <!-- ################################################   FIN CONTENIDOS Y REPORTES-->
                    <div id="divFormulario"></div>
                </div>

            </div>
            <hr class="limpiar" />
            <div id="piePagina">
            </div>
            <div style="display:none;">
                <input type="hidden" id="hiddenEmpresa" value="{{empresa}}" />
            </div>
        </div>
        <script type="text/javascript">
            (function ($) {

                $('#btnOcultarMenu').on('click', function () {
                    $(this).find('.fa').toggleClass('fa-chevron-left').toggleClass('fa-chevron-right');
                    if ($(this).attr('data-visible') === 'true') {
                        $(this).attr('data-visible', false);
                        $('#menu').hide();
//                    $('#col1').hide();
                        __app.ajustarAnchoMenu();
                        /*
                         $('#divGeneral').width(  $('#divAppContainer').width()-20  );
                         */
                        return;
                    }
                    $(this).attr('data-visible', true);
                    $('#menu').show()//.width('15%');
//                $('#col1').show()//.width('15%');
                    //$('#divGeneral').width('80%');
                    __app.ajustarAnchoMenu();
                });

                menuVista.init();
                //console.clear();
            })(jQuery);
        </script>
    </body>
</html>


