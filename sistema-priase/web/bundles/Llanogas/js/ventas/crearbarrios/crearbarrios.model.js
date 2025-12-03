

var formatoBarrios = {
    thead: [
        {'id': 'thSelector', 'text': 'Seleccionar', 'sort': false, 'refer': null, 'type': 'radio'},
        {'id': 'thCodigo', 'text': 'Codigo', 'sort': false, 'refer': 'codigo', 'type': 'text'},
        {'id': 'thNombre', 'text': 'Nombre', 'sort': false, 'refer': 'barrio_nom', 'type': 'text'}
    ]
};

var formatoRutasVinculadas = {
    thead: [
        {'id': 'thSelector', 'text': '', 'sort': false, 'refer': null, 'type': 'check'},
        {'id': 'thIdRuta', 'text': 'Codigo Ruta', 'sort': false, 'refer': 'idruta', 'type': 'text'},
        {'id': 'thNombre', 'text': 'Nombre Ruta', 'sort': false, 'refer': 'rutnombre', 'type': 'text'},
        {'id': 'thEliminar', 'text': 'Eliminar', 'sort': false, 'type': 'button', 'valueField': 'idmubarut', 'style': {'width': '10%'}}
    ]
};

var crearBarriosModel = {
    barrios: [], rutasVinculadas: [], rutasVinculadasEliminadas: [], rutaCargue: [], rutasVinculadasNuevas: [], actualiza: [], insert: [], idmuba: []
};
