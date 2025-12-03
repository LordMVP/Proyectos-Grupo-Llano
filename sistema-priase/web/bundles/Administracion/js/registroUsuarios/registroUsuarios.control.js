/**
 * @fileOverview Archivo de vista de crear Registro Usuarios
 * @author Oscar Baquero
 * @requires registroUsuarios.model.js
 * @version 1.0.0
 */

/** @namespace */

var registroUsuariosControl = {
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

    programaUsuarioAsignar: function (data, completado) {
        __cnn.ajax({
            'url': '../programa_usuarioAsignar/',
            'data': data,
            'completado': completado
        });
    },

    programaUsuarioAsignarProyectos: function (data, completado) {
        __cnn.ajax({
            'url': '../programa_usuarioAsignarProyecto/',
            'data': data,
            'completado': completado
        });
    },

    proyectoUsuarioPrograma: function (data, completado) {
        __cnn.ajax({
            'url': '../proyecto_usuarioPrograma/',
            'data': data,
            'completado': completado
        });
    },

    estructuraUsuarioLogin: function (data, completado) {
        __cnn.ajax({
            'url': '../estructura_usuarioLogin/',
            'data': data,
            'completado': completado
        });
    },

    buscaUnidadesUsuario: function (data, completado) {
        __cnn.ajax({
            'url': '../busca_unidadesUsuario/',
            'data': data,
            'completado': completado
        });
    },
    buscaAllUnidades: function (data, completado) {
        __cnn.ajax({
            'url': '../busca_allUnidades/',
            'data': data,
            'completado': completado
        });
    },
    grabaPermisosUsuario: function (data, completado) {
        __cnn.ajax({
            'url': '../grabar_permisosUsuarios/',
            'data': data,
            'completado': completado
        });
    },

    validacionUnidadesAsignadas: function (estructura) { 
        if (registroUsuariosModel.unidadesAsignadas[estructura].length > 0) {
            for (var i = 0; i < registroUsuariosModel.unidadesAsignadas[estructura].length; i++) {
                for (var j = 0; j < registroUsuariosModel.unidadesSinAsignarLogin[estructura].length; j++) {
                    if (registroUsuariosModel.unidadesAsignadas[estructura][i].ideprun === registroUsuariosModel.unidadesSinAsignarLogin[estructura][j].ideprun) {
                        registroUsuariosModel.unidadesSinAsignarLogin[estructura].splice(j, 1);
                        break;
                    }
                }
            }
            return 1;
        }
        return 0;
    },

    validacionMediosPagos: function () {
        if (registroUsuariosModel.mediosPagosAsignados.length > 0) {
            for (var i = 0; i < registroUsuariosModel.mediosPagosAsignados.length; i++) {
                for (var j = 0; j < registroUsuariosModel.mediosPagosSinAsignarLogin.length; j++) {
                    if (registroUsuariosModel.mediosPagosAsignados[i].idemediopago === registroUsuariosModel.mediosPagosSinAsignarLogin[j].idemediopago) {
                        registroUsuariosModel.mediosPagosSinAsignarLogin.splice(j, 1);
                        break;
                    }
                }
            }
            return 1;
        }
        return 0;
    },

    validacionRutas: function () {
        if (registroUsuariosModel.rutasAsignados.length > 0) {
            for (var i = 0; i < registroUsuariosModel.rutasAsignados.length; i++) {
                for (var j = 0; j < registroUsuariosModel.rutasSinAsignarLogin.length; j++) {
                    if (registroUsuariosModel.rutasAsignados[i].ideruta === registroUsuariosModel.rutasSinAsignarLogin[j].ideruta) {
                        registroUsuariosModel.rutasSinAsignarLogin.splice(j, 1);
                        break;
                    }
                }
            }
            return 1;
        }
        return 0;
    },

    validacionProyectosAsignados: function (estructura) {
        if (registroUsuariosModel.proyectosAsignados[estructura].length > 0) {
            for (var i = 0; i < registroUsuariosModel.proyectosAsignados[estructura].length; i++) {
                for (var j = 0; j < registroUsuariosModel.proyectosSinAsignarLogin[estructura].length; j++) {
                    if (registroUsuariosModel.proyectosAsignados[estructura][i].ideproyecto === registroUsuariosModel.proyectosSinAsignarLogin[estructura][j].ideproyecto) {
                        registroUsuariosModel.proyectosSinAsignarLogin[estructura].splice(j, 1);
                        break;
                    }
                }
            }
            return 1;
        }
        return 0;
    },

    mediosDePago: function (data, completado) {
        __cnn.ajax({
            'url': '../busca_mediospagos/',
            'data': data,
            'completado': completado
        });
    },

    getRutas: function (data, completado) {
        __cnn.ajax({
            'url': '../busca_rutas/',
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
    grabaPermisoUsuario: function (data, completado) {
        __cnn.ajax({
            'url': '../grabar_permisoUsuario/',
            'data': data,
            'completado': completado
        });
    },
    grabaPermisoUsuarioCompleto: function (data, completado) {
        __cnn.ajax({
            'url': '../grabar_permisoUsuarioCompleto/',
            'data': data,
            'completado': completado
        });
    },
    
    usariosBuscar : function (data, completado) {
        __cnn.ajax({
            'url': '../get_usuarioall/',
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