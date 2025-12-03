/**
 * @fileOverview Archivo de vista de Autorizar programas por perifl
 * @author Oscar Baquero
 * @requires registroProgramasUsuarios.model.js
 * @version 1.0.0
 */

/** @namespace */

var registroProgramasUsuariosControl = {
    /**
     * Consulta usuarios x empresa 
     * @param  {object} data - Parámetros que se envían al servidor (cedula,nombre)
     * @param  {function} completado - envoco (registroBarriosVista.onConsultarBarrio)
     * @returns {void}
     */
    consultarUsuario: function (data, completado) {
        __cnn.ajax({
            'url': '../consulta_usuario/',
            'data': data,
            'completado': completado
        });
    },

    crearPerfilAutoriza: function (data, completado) {
        __cnn.ajax({
            'url': '../registrar_perfilAutoriza/',
            'data': data,
            'completado': completado
        });
    },

    getMenusContro: function (data, completado) {
        __cnn.ajax({
            'url': '../busca_menu/',
            'data': data,
            'completado': completado
        });
    },
    opcionesMenu: function (data, completado) {
        __cnn.ajax({
            'url': '../opciones_menu/',
            'data': data,
            'completado': completado
        });
    },
    
    buscaProgramasUsuarios: function (data, completado) {
        __cnn.ajax({
            'url': '../busca_programasUsuarios/',
            'data': data,
            'completado': completado
        });
    },

    
    buscaTodosProgramasUsuarios: function (data, completado) {
        __cnn.ajax({
            'url': '../busca_todosprogramasUsuarios/',
            'data': data,
            'completado': completado
        });
    },
    
    validacionLoginUsuario: function (data, completado) {
        __cnn.ajax({
            'url': '../validacion_login/',
            'data': data,
            'completado': completado
        });
    },
    grabaProgramasUsuario: function (data, completado) {
        __cnn.ajax({
            'url': '../grabar_permisoProgramaUsuario/',
            'data': data,
            'completado': completado
        });
    },
    
    validacionProgramasAsignados: function () { 
        if (registroProgramasUsuariosModel.programasAsignados.length > 0) {
            for (var i = 0; i < registroProgramasUsuariosModel.programasAsignados.length; i++) {
                for (var j = 0; j < registroProgramasUsuariosModel.programasLogin.length; j++) {
                    if (registroProgramasUsuariosModel.programasAsignados[i].ideopc === registroProgramasUsuariosModel.programasLogin[j].ideopc) {
                        registroProgramasUsuariosModel.programasLogin.splice(j, 1);
                        break;
                    }
                }
            }
            return 1;
        }
        return 0;
    }
    
    ,
    
    validacionProgramasNuevos: function () { 
        if (registroProgramasUsuariosModel.programasEliminar.length > 0) {
            for (var i = 0; i < registroProgramasUsuariosModel.programasEliminar.length; i++) {
                for (var j = 0; j < registroProgramasUsuariosModel.programasNuevos.length; j++) {
                    if (registroProgramasUsuariosModel.programasEliminar[i].ideopc === registroProgramasUsuariosModel.programasNuevos[j].ideopc) {
                        registroProgramasUsuariosModel.programasNuevos.splice(j, 1);
                        break;
                    }
                }
            }
            return 1;
        }
        return 0;
    },
    
    actualizaProgramasUsuarios: function(data, completado){
        __cnn.ajax({
            'url': '../actualiza_permisoProgramaUsuario/',
            'data': data,
            'completado': completado
        });
    }, 
    
    getPerfiles:function(data, completado){
        __cnn.ajax({
            'url': '../busca_perfiles/',
            'data': data,
            'completado': completado
        });
    },
    
    grabaProgramaNuevoPerfil: function(data, completado){
        __cnn.ajax({
            'url': '../guarda_NuevoPerfil/',
            'data': data,
            'completado': completado
        });
    }

    /*,
     validausuarios: function(id){
     
     for (var i = 0; i < crearBarriosModel.rutasVinculadas.length; i++) {
     if(registroUsuariosModel.usuarios[i].idruta == id){
     return true;
     }
     }    
     return false;
     }*/
}