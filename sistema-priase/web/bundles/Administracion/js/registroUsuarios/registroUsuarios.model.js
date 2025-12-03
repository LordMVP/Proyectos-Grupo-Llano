

var formatoUsuario = {
    thead: [
        {'id': 'thSelector', 'text': 'Seleccionar', 'sort': false, 'refer': null, 'type': 'radio'},
        {'id': 'thCedula', 'text': 'Cédula', 'sort': false, 'refer': 'nit', 'type': 'text'},
        {'id': 'thNombre', 'text': 'Nombre', 'sort': false, 'refer': 'nombrecolaborador', 'type': 'text'},
        {'id': 'thEmpresa', 'text': 'Perfil x Empresa', 'sort': false, 'refer': 'empresa', 'type': 'text'}
    ]
};

var formatoUnidadesSinAsignarLogin = {
    thead: [
        {'id': 'thSelector', 'text': '', 'sort': false, 'refer': 'ideprun', 'type': 'check'},
        {'id': 'thUnidad', 'text': 'Unidades', 'sort': false, 'refer': 'nombreunidad', 'type': 'text'}
    ]
};

var formatoUnidadesAsignadas = {
    thead: [
        {'id': 'thSelector', 'text': '', 'sort': false, 'refer': 'ideprun', 'type': 'check'},
        {'id': 'thUnidad', 'text': 'Unidades', 'sort': false, 'refer': 'nombreunidad', 'type': 'text'}
    ]
};


var formatoMedioPagoSinAsignarLogin = {
    thead: [
        {'id': 'thSelector', 'text': '', 'sort': false, 'refer': 'idemediopago', 'type': 'check'},
        {'id': 'thUnidad', 'text': 'Unidades', 'sort': false, 'refer': 'nombreunidad', 'type': 'text'}
    ]
};

var formatoMedioPagoAsignadas = {
    thead: [
        {'id': 'thSelector', 'text': '', 'sort': false, 'refer': 'idemediopago', 'type': 'check'},
        {'id': 'thUnidad', 'text': 'Unidades', 'sort': false, 'refer': 'nombreunidad', 'type': 'text'}
    ]
};


var formatoRutasLogin = {
    thead: [
        {'id': 'thSelector', 'text': '', 'sort': false, 'refer': 'ideruta', 'type': 'check'},
        {'id': 'thUnidad', 'text': 'Unidades', 'sort': false, 'refer': 'nombre', 'type': 'text'}
    ]
};

var formatoRutasAsignadas = {
    thead: [
        {'id': 'thSelector', 'text': '', 'sort': false, 'refer': 'ideruta', 'type': 'check'},
        {'id': 'thUnidad', 'text': 'Unidades', 'sort': false, 'refer': 'nombre', 'type': 'text'}
    ]
};


var formatoProyectosLogin = {
    thead: [
        {'id': 'thSelector', 'text': '', 'sort': false, 'refer': 'ideproyecto', 'type': 'check'},
        {'id': 'thUnidad', 'text': 'Unidades', 'sort': false, 'refer': 'nombreproyecto', 'type': 'text'}
    ]
};

var formatoProyectosAsignados = {
    thead: [
        {'id': 'thSelector', 'text': '', 'sort': false, 'refer': 'ideproyecto', 'type': 'check'},
        {'id': 'thUnidad', 'text': 'Unidades', 'sort': false, 'refer': 'nombreproyecto', 'type': 'text'}
    ]
};

var registroUsuariosModel = {
    actualiza: [], insert: [], usuarios: [], programaAsignar: [], estructuraLogin:[], 
    unidadesSinAsignarLogin:[], unidadesAsignadas:[], unidadesAsignadasEliminar:[], unidadesAsignadasNuevas: [],
    mediosPagosSinAsignarLogin:[], mediosPagosAsignados:[], mediosPagosEliminar:[], mediosPagosNuevos:[],
    rutasSinAsignarLogin:[], rutasAsignados:[], rutasEliminar:[], rutasNuevos:[],
    proyectosSinAsignarLogin:[], proyectosAsignados:[], proyectosEliminar:[], proyectosNuevos:[],
    unidadNueva:[], unidadEliminar:[], proyectosAsignadosEliminar:[], proyectosAsignadosNuevos: []
    
};