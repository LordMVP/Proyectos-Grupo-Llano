

var formatoUsuario = {
    thead: [
        {'id': 'thSelector', 'text': 'Seleccionar', 'sort': false, 'refer': null, 'type': 'radio'},
        {'id': 'thCedula', 'text': 'Cédula', 'sort': false, 'refer': 'nit', 'type': 'text'},
        {'id': 'thNombre', 'text': 'Nombre', 'sort': false, 'refer': 'nombrecolaborador', 'type': 'text'},
        {'id': 'thEmpresa', 'text': 'Perfil x Empresa', 'sort': false, 'refer': 'empresa', 'type': 'text'}
    ]
};


var registroProgramasUsuariosModel = {
    actualiza: [], insert: [], usuarios: [], programasAsignados: [], programasLogin: [], programasNuevos: [], programasEliminar:[], perfilNuevo:[]    
};