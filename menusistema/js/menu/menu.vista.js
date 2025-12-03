var menu;
var estadoMenu = 'normal';

var menuVista = {
    menuItems: null,
    init: function () {
        menu = this;
        menu.menuItems = $('#menuItems');
        var val = menu.llamarNombreUsuario();
        if (val != undefined) {
            menu.invocarMenu();
            //DEPRECATED: menu.configMenu();
        } else {

                     window.location = '/achagua/index.html';
         }

        /*****DEPRICATED ajustar el alto de la página ***
         var contenedor = $('#contenedor').css('min-height', window.innerHeight - 70);
         var divisionMenu = $('#menu').css('min-height', contenedor.height()-20);
         window.addEventListener("resize", function() {
         contenedor.css('min-height', window.innerHeight - 70);
         divisionMenu.css('min-height', contenedor.height()-20);
         });
         */

    $('#txtFiltroMenu')
            //.enterKey(menu.filtrarMenu)
            .on('click', function () {
                $('#txtFiltroMenu').select();
            })
            .on('keyup', function (e) {
                var tam = $(this).val().length;
                if (tam >= 3 || tam == 0) {
                    menu.filtrarMenu();
                }

                /*if(tam >= 3 ){
                 menu.filtrarMenu();
                 }else if(tam === 0){
                 estadoMenu = 'normal';
                 menu.renderMenu(menuModel.opciones);
                 //menu.renderMenu(menuModel.opciones);
                 }*/

            });
    },
    /****deprecated***
     
     configMenu: function() {
     $('ul#menuItems').tree();
     },
     */

    invocarMenu: function () {
        var data = {i: 0};
        //menuModel.itemsMenu = menuControl.obtenerMenu(data).menu;
        //menu.renderMenu(menuModel.itemsMenu);
        menuControl.obtenerMenu(data, function (_data) {
            menuModel.opciones = _data.menu;
            menu.renderMenu(menuModel.opciones, false);
        });
    },
    renderMenu: function (items, colapsado) {
        /*
         $.each(items, function(i, item) {
         menu.crearItemCont(item, $('ul#menuItems'));
         });*/

        var ulMenu = menu.menuItems.html('');

        if (items && items.length > 0) {
            //$.each(items, function(i, item) {
            for (var i = 0; i < items.length; i++) {
                menu.crearItemCont(items[i], ulMenu);
            }

            //});
            menu.configurarMenu(colapsado);
        } else {
            menu.menuItems.html('No se encontraron opciones');
        }
    },
    crearItemCont: function (val, parent) {
        /*if (val.menuItem === undefined) {
         var li = $('<li>');
         var a = $('<a>').attr('href', val.prg_localiza).html(val.opc_nombre).attr('title', val.opc_nombre);
         patern.append(li.append(a));
         } else {
         var newUl = $('<ul>');
         var li = $('<li>');
         var a = $('<a>').html(val.opc_nombre).attr('title', val.opc_nombre);
         patern.append(li.append(a).append(newUl));
         $.each(val.menuItem, function(i, item) {
         menu.crearItemCont(item, newUl);
         });
         }*/
        var li = $('<li>');
        if (val.menuItem == undefined) {
            var a = null;
            if (val.prg_localiza) {
                a = $('<a>').attr('href', val.prg_localiza)
                        .text(val.opc_nombre)
                        .attr('title', val.opc_descripcion);
            }
            parent.append(li.append(a));
        } else {
            var newUl = $('<ul>').attr('class', 'nav nav-list tree ul-visible');
            var label = $('<a>')
                    .html('<i class="fa fa-caret-down preicon"></i> ' + val.opc_nombre)
                    .attr({
                        'title': val.opc_descripcion,
                        'class': 'tree-toggler nav-header parent'
                    });
            parent.append(li.addClass('titleMenu').append(label).append(newUl));
            $.each(val.menuItem, function (i, item) {
                menu.crearItemCont(item, newUl);
            });
        }
    },
    configurarMenu: function (colapsado) {
        var menuItems = menu.menuItems;
        menuItems.find('a.tree-toggler.nav-header.parent').on('click', menu.onVinculoClick); // function (e) {
        var padres = $('#menuItems>li.titleMenu');
        if (!colapsado) {
            for (var i = 0; i < padres.length; i++) {
                var padre = $(padres[i]);
                padre.children('ul.tree').hide(0).removeClass('ul-visible');
                padre.find('.preicon:first').removeClass('fa-caret-down').addClass('fa-caret-right');
            }

            setTimeout(function () {
                var nodosPadre = $('#menuItems ul.ul-visible');
                nodosPadre.hide(0).removeClass('ul-visible');
                nodosPadre.prev().find('i.preicon').removeClass('fa-caret-down').addClass('fa-caret-right');
            }, 600);

        }
    },
    onVinculoClick: function (e) {
        menu.detenerEvento(e);
        var _this = $(this);
        _this.parent().children('ul.tree').toggle(300).toggleClass('ul-visible');
        _this.find('.preicon').toggleClass('fa-caret-right').toggleClass('fa-caret-down');

        /*
         var linksAbiertos = menu.menuItems.find('ul[style="display: block;"] a');
         var maxWidth = 0;
         for(var i = 0; i<linksAbiertos.length; i++){
         var w = $(linksAbiertos[i]).text().length*3.2;
         if (w>maxWidth) {
         maxWidth = w;
         }
         }
         menu.menuItems.width( $('#contenedorOpcionesMenu').width() + maxWidth );
         */
    },
    filtrarMenu: function (e) {
        //recorrer el menú
        var filtro = compact($('#txtFiltroMenu').val().simplificarMayus().split(/\s+/));
        if (filtro.length > 0) {
            menuModel.menuTemporal = menu.crearMenuTemporal(filtro, menuModel.opciones);
            estadoMenu = 'filtrado';
            menu.renderMenu(menuModel.menuTemporal, true);
        } else {
            estadoMenu = 'normal';
            menu.renderMenu(menuModel.opciones);
        }
    },
    crearMenuTemporal: function (q, opciones) {
        var temp = [];
        for (var i = 0; i < opciones.length; i++) {
            var nodoRaiz = opciones[i];
            //if (nodoRaiz.opcion.simplificarMayus().indexOf(q)!==-1) {
            
            if ( validarExistenciaStrings(compact( nodoRaiz.opc_nombre.simplificarMayus().split(/\s+/) ), q)) {
                temp.push(nodoRaiz);
            } else {
                var nuevoNodoRaiz = {};
                nuevoNodoRaiz.opc_nombre = nodoRaiz.opc_nombre;
                nuevoNodoRaiz.opc_ideregistro = nodoRaiz.opc_ideregistro;
                nuevoNodoRaiz.opc_descripcion = nodoRaiz.opc_descripcion;
                nuevoNodoRaiz.menuItem = [];
                if (nodoRaiz.menuItem) {
                    var tempHijos = menu.crearMenuTemporal(q, nodoRaiz.menuItem);
                    if (tempHijos.length > 0) {
                        nuevoNodoRaiz.menuItem = tempHijos;
                        temp.push(nuevoNodoRaiz);
                    }
                }
            }
        }
        return temp;
    },
    llamarNombreUsuario: function () {
        var data = {
            i: 3,
            url: $(location).attr('pathname') + $(location).attr('search')
        };
        var respuesta = menuControl.obtenerNombreUsuario(data);
        if (respuesta.codigoRespuesta == 0) {

            //Mientras se hace corrección de error 
           // window.location = '/achagua/index.html';
        }
        var nombre = respuesta.usuario;
        var fechasistema = respuesta.fechasistema ; 
        $('#nomUsuarioTxt').html(nombre);
        $('#fechaSistemaTxt').html(fechasistema);
        return nombre;
    },
    detenerEvento: function (e) {
        if (e.preventDefault) {
            e.preventDefault();
        } else if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.returnValue = false;
        }
    }
};

String.prototype.simplificarMayus = function () {
    var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç",
            to = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
            mapping = {},
            str = this;
    for (var i = 0, j = from.length; i < j; i++) {
        mapping[ from.charAt(i) ] = to.charAt(i);
    }
    var ret = [];
    for (var i = 0, j = str.length; i < j; i++) {
        var c = str.charAt(i);
        if (mapping.hasOwnProperty(str.charAt(i))) {
            ret.push(mapping[c]);
        }
        else {
            ret.push(c);
        }
    }
    var simple = ret.join('');
    return simple.toUpperCase();
};
compact = function (arr) {
    var item, _i, _len, _results;
    _results = [];
    for (_i = 0; _i < arr.length; _i++) {
        item = arr[_i];
        if (item) {
            _results.push(item);
        }
    }
    return _results;
};

validarExistenciaStrings = function(arr, arrayComparar){
    var coincidencias = 0;
    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < arrayComparar.length; j++) {
            if (arr[i].indexOf(arrayComparar[j])!==-1) {
                coincidencias++;
            }
        }
    }
    //return (coincidencias === arrayComparar.length);
    return (coincidencias >= arrayComparar.length);
};