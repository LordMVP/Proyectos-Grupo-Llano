var menu;
var menuVista = {
    init: function() {
        menu = this;
        menu.invocarMenu();
        menu.configMenu();
    },
    configMenu: function() {
        $('ul#menuItems').tree();
    },
    invocarMenu: function() {
        var data = {i: 0};
        menuModel.itemsMenu = menuControl.obtenerMenu(data).menu;
        console.log(menuModel.itemsMenu);
        menu.renderMenu(menuModel.itemsMenu);
    },
    renderMenu: function(items) {
        $.each(items, function(i, item) {
            menu.crearItemCont(item, $('ul#menuItems'));
        });
    },
    crearItemCont: function(val, patern) {
        if (val.menuItem === undefined) {
            var li = $('<li>');
            var a = $('<a>').attr('href', val.prg_localiza).html(val.opc_nombre);
            patern.append(li.append(a));
        } else {
            var newUl = $('<ul>');
            var li = $('<li>');
            var a = $('<a>').html(val.opc_nombre);
            patern.append(li.append(a).append(newUl));
            $.each(val.menuItem, function(i, item) {
                menu.crearItemCont(item, newUl);
            });
        }
    }
};