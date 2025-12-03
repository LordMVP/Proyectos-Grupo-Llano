/**
 * @fileOverview Archivo de vista para registrar Usuarios
 * @author Oscar Baquero
 * @requires registroUsuarios.control.js
 * @requires registroUsuarios.model.js
 * @version 1.0.0
 */

/**
 * Objeto que hace referencia al namespace registroUsuariosVista
 * @type {Object}
 */

var that = null;
/** @namespace */

var registroProgramasUsuariosVista = {
    /**
     * Inicializa el programa para el registro de ventas y asigna listeners a controles.
     * @returns {void}
     */
    init: function () {
        that = registroProgramasUsuariosVista;
        __dom.configurarTextoNumerico('txtCedula, #txtTopeFinanciar');
        __dom.loginUsuario('txtCorreo');
        $("#pestanias").tabs();
        $('#txtTopeFinanciar').val(0);
        $('#btnGrabar').on('click', that.grabarUsuario);
        $('#btnNuevo').on('click', that.nuevoUsuario);
        $('#btnFiltrar').on('click', that.mostrarBuscarUsuario);
        $('#divBuscarColaborador #btnBuscarColaborador').on('click', that.onBuscaUsuario);
        $('#txtCorreo').on('blur', that.loginUsuario);
        $('#cboMenu').on('change', that.buscaOpcionesMenu);
        $('#cboOpcionesMenu').on('change', that.onbuscaProgramas);
        $('#txtFiltroProgramas').on('keyup', self.filtrarProgramas);
        $('button[data-funcion="listas"]').on('click', that.mostrarProgramasAsignados);
        $('#txtPasswordConfirmar').on('blur', that.onValidaClave);
        $('#txtPassword').on('click', that.onMensajeClave);
        $('#checkPerfil').on('click', that.onGetPerfiles);
        $('#checkPerfilNuevo').on('click', that.onPerfilNuevo);
        $('#btnAllProgramas').on('click', that.onGetAllProgramas);
    },
    
   
    onPerfilNuevo: function () {
        that.onInvalidaCampos();
    },
    onInvalidaCampos: function () {
        registroProgramasUsuariosModel.perfilNuevo = 1;
        registroProgramasUsuariosModel.insert = null;
        registroProgramasUsuariosModel.actualiza = null;
        $('#divcboPerfilActual').hide();
        $('#txtPerfil').val("");
        $('#divOpcionesMenuPrograma').show();
        $('#checkPerfil').removeAttr('checked');
        var camposInvalidos = $('div#divUsuarios').find('input').not('#txtPerfil');
        $('select#cboRecaudoExterno').attr('disabled', true)
        for (var i = 0; i < camposInvalidos.length; i++) {
            var campo = $(camposInvalidos[i]);
            campo.val('');
            campo.attr('disabled', true);
        }
    },
    onGetPerfiles: function () {
        var data = {
            a: 1
        };
        if ($('#checkPerfil').prop('checked')) {
            $('#pestanias').hide();
            $('div#divOpcionesMenuPrograma').hide();
            $('#txtPerfil').val(" ");
            registroProgramasUsuariosControl.getPerfiles(data, that.onResultadoPerfiles);
        } else {
            $('div#divcboPerfilActual').hide();
            $('div select#cboPerfilActual').val(-1);
        }
    },

    onResultadoPerfiles: function (data) {
        var divPerfilAutorizaEmpresa = $('div select#cboPerfilActual');
        $('div#divcboPerfilActual').show();
        divPerfilAutorizaEmpresa.empty();
        divPerfilAutorizaEmpresa.append($('<option>').text('Seleccione un perfil').val(-1));
        $.each(data.perfiles, function (index, perfiles) {
            divPerfilAutorizaEmpresa.append($('<option>').text(perfiles.perfilnombre).val(perfiles.ideperfil));
        });
    },

    onMensajeClave: function () {
        $('#mensajeAlerta').text('');
        $('#mensajeAlerta').text('Digite más de 8 caracteres  ');
    },

    onValidaClave: function () {
        if (($('#txtPassword').val() !== $('#txtPasswordConfirmar').val()) || ($('#txtPassword').val() == '' || $('#txtPasswordConfirmar').val() == '')) {
            $('#txtPasswordConfirmar').val('');
            __dom.lanzarAlerta('La clave asignada no es igual ó no debe estar vacia', 'Advertencia');
            return true;
        }
        return false;
    },

    onValidaCampos: function () {
        $('#mensajeAlerta').text('');
        var campos = $('div#divUsuarios').find('input[type=text]');
        for (var i = 0; i < campos.length; i++) {
            var campo = $(campos[i]);
            var requerido = campo.attr('required');
            if ((campo.val() === '') && requerido === 'required')
            {
                var idCampo = campo.attr('id');
                var ValLabelCampo = $('div#divUsuarios').find('label[for=' + idCampo + ']').text();
                $('#mensajeAlerta').text('El campo ' + ValLabelCampo + ' es requerido  ');
                campo.focus();
                return true;
            }
            return false;
        }
    },

    grabarUsuario: function () {
        if (registroProgramasUsuariosModel.insert === null && registroProgramasUsuariosModel.actualiza === null && registroProgramasUsuariosModel.perfilNuevo == 1) {
            var perfilNombre = $('#txtPerfil').val();
            if ($('#txtPerfil').val() === '' || $('#txtPerfil').val() === null) {
                __dom.lanzarAlerta('Por digite el Campo Perfil', 'Advertencia');
                return;
            }
            if (registroProgramasUsuariosModel.programasNuevos === null || registroProgramasUsuariosModel.programasNuevos.length === 0) {
                __dom.lanzarAlerta('Por favor seleccione los Programas', 'Advertencia');
                return ;
            }
            if (registroProgramasUsuariosModel.programasEliminar.length > 0) {
                    registroProgramasUsuariosControl.validacionProgramasNuevos();
                }
            var data = {                
                perfil: $('#txtPerfil').val(),
                programaNuevos: registroProgramasUsuariosModel.programasNuevos
            };
            
            registroProgramasUsuariosControl.grabaProgramaNuevoPerfil(data, that.onResultadoGrabar);
        }
        if (registroProgramasUsuariosModel.insert === 1 && registroProgramasUsuariosModel.actualiza === null) {
            if (that.onValidaClave()) {
                return;
            }
            if (that.onValidaCampos()) {
                return;
            }
            if ($('#txtPasswordConfirmar').val().length < 8) {
                __dom.lanzarAlerta('Digite más de 8 caracteres, Clave invalida ', 'Advertencia');
                return;
            }
            var encript = $().crypt({
                method: 'md5',
                source: $('#txtPasswordConfirmar').val()
            });
            var idePerfil = 0;
            if ($('#checkPerfil').prop('checked')) {
                idePerfil = $('select#cboPerfilActual option:selected').val();

                if (idePerfil == -1 || idePerfil == '') {
                    __dom.lanzarAlerta('Por favor seleccione un Perfil', '');
                    return;
                }
            } else {
                if (registroProgramasUsuariosModel.programasEliminar.length > 0) {
                    registroProgramasUsuariosControl.validacionProgramasNuevos();
                }
            }

            var data = {
                ideCedula: $('#txtCedula').val(),
                nombreUsuario: $('#txtNombreUsuario').val(),
                correo: $('#txtCorreo').val(),
                topeFinanciar: $('#txtTopeFinanciar').val(),
                password: encript,
                perfil: $('#txtPerfil').val(),
                idePerfil: idePerfil,
                recaudoExterno: $('select#cboRecaudoExterno option:selected').val(),
                programaNuevos: registroProgramasUsuariosModel.programasNuevos
            };
            registroProgramasUsuariosControl.grabaProgramasUsuario(data, that.onResultadoGrabar);
        }
        if (registroProgramasUsuariosModel.insert === null && registroProgramasUsuariosModel.actualiza === 1) {
           
            if ($('#checkPerfil').prop('checked')) {
                idePerfil = $('select#cboPerfilActual option:selected').val();

                if (idePerfil == -1 || idePerfil == '') {
                    __dom.lanzarAlerta('Por favor seleccione un Perfil', '');
                    return;
                }
            } else {
                if (registroProgramasUsuariosModel.programasEliminar.length > 0) {
                    registroProgramasUsuariosControl.validacionProgramasNuevos();
                }
            }
            var datos = {
                nombreUsuario: $('#txtNombreUsuario').val(),
                topeFinanciar: $('#txtTopeFinanciar').val(),
                ideUsuarioColaborador: $('#txtIdeUsuario').val(),
                idePerfilAsignar: idePerfil,
                idePerfilColaborador: $('#txtIdePerfil').val(),
                recaudoExterno: $('select#cboRecaudoExterno option:selected').val(),
                programaNuevos: registroProgramasUsuariosModel.programasNuevos,
                programaElimina: registroProgramasUsuariosModel.programasEliminar
            };
            registroProgramasUsuariosControl.actualizaProgramasUsuarios(datos, that.onResultadoGrabar);
        }
    },

    onResultadoGrabar: function (data) {
        switch (data.codigoRespuesta) {
            case - 1:
                __dom.lanzarAlerta(data.mensaje, 'ERROR');
                break;

            case 1:
                setTimeout(function () {
                    __dom.lanzarAlerta(data.mensaje, '', '', true, true);
                    setTimeout(function () {
                        location.reload();
                    }, 800);
                }, 1500);

                break;

            case 0:
                __dom.lanzarAlerta(data.mensaje, 'Advertencia');
                break;

                break;
        }
    },

    loginUsuario: function () {
        var regex = /^[a-z]*$/;
        if (!regex.test($('#txtCorreo').val())) {
            $('#txtCorreo').val("");
            __dom.lanzarAlerta('Por favor digite solo letras, en el campo correo', 'ERROR');
            return;
        }
        if ($('#txtCorreo').val() == null || $('#txtCorreo').val() == '') {
            return;
        }
        var data = {
            idusuarioCorreo: $('#txtCorreo').val()
        };
        registroProgramasUsuariosControl.validacionLoginUsuario(data, that.onResultadoLogin);
    },

    onResultadoLogin: function (data) {
        switch (data.codigoRespuesta) {
            case - 1:
                __dom.lanzarAlerta(data.mensaje, 'ERROR');
                break;

            case 1:
                $('#txtCorreo').val('')
                __dom.lanzarAlerta('Por favor agrege o quite una letra del nombre correo, ya existe el usuario', 'Advertencia');
                return;
                break;

            case 0:
                break;

                break;
        }
    },

    nuevoUsuario: function () {
        $('div#divUsuarios').show();
        $('#divIdeUsuario').hide();
        $('#divcboPerfilActual').hide();
        $('#divPassword').show();
        $('#checkPerfil').removeAttr('checked');
        $('#checkPerfilNuevo').removeAttr('checked');
        $('#divPasswordConfirmar').show();        
        $('#divcheckPerfilNuevo').show();
        that.limpiaCampos();
        that.habilitarCampos();

        registroProgramasUsuariosModel.insert = 1;
        registroProgramasUsuariosModel.actualiza = null;
        registroProgramasUsuariosModel.perfilNuevo = null;
        that.buscaMenus();
        $('#divOpcionesMenuPrograma').show();
    },
    habilitarCampos: function () {
        var campos = $('div#divUsuarios').find('input ,select');

        for (var i = 0; i < campos.length; i++) {
            var campo = $(campos[i]);
            campo.removeAttr('disabled');
        }
    },

    limpiaCampos: function () {
        var campos = $('div#divUsuarios').find('input[type=text]');
        for (var i = 0; i < campos.length; i++) {
            var campo = $(campos[i]);
            campo.val('');
        }
        registroProgramasUsuariosModel.actualiza = [];
        registroProgramasUsuariosModel.insert = [];
        registroProgramasUsuariosModel.perfilNuevo = [];
        registroProgramasUsuariosModel.usuarios = [];
        registroProgramasUsuariosModel.programasAsignados = [];
        registroProgramasUsuariosModel.programasLogin = [];
        registroProgramasUsuariosModel.programasNuevos = [];
        registroProgramasUsuariosModel.programasEliminar = [];
        $('table#tblResultadoFiltro').hide();
        $('#listaProgramasSeleccionada .listaSeleccion').empty();
        $('#listaProgramasSeleccion .listaSeleccion').empty();
        $('#pestanias').hide();
    },

    /**
     * Ventana emergente de "buscar Usuario".
     * @returns {void}
     */
    mostrarBuscarUsuario: function () {
        registroProgramasUsuariosModel.actualiza = 1;
        registroProgramasUsuariosModel.insert = null;
        registroProgramasUsuariosModel.perfilNuevo = null;
        var dialogo = $('#divBuscarColaborador');
        dialogo.find('input[type = text]').val('');
        that.dialogoActual = dialogo.dialogo({
            modal: true,
            width: 600,
            title: 'Buscar un Colaborador',
            buttons: {
                Finalizar: that.CargarResultadoUsuarios
            }

        });
    },

    onBuscaUsuario: function () {
        $('#mensajeAlertaDialogo').text('');
        if ($('#txtCedulaColaborador').val() == '' && $('#txtNombreColaborador').val() == '') {
            $('#mensajeAlertaDialogo').text('Digite, Nombre ó Cédula  ');
            $('#txtCedulaColaborador').focus();
            return;
        }
        var data = {
            'idedocumento': $('#txtCedulaColaborador').val(),
            'nombre': $('#txtNombreColaborador').val()
        };
        registroProgramasUsuariosControl.consultarUsuario(data, that.onResultadoConsultarUsuario);
    },

    onResultadoConsultarUsuario: function (data) {
        $('#tblResultadoFiltro').empty();
        __dom.ocultarCargador();
        registroProgramasUsuariosModel.usuarios = data.data.usuarios;
        if (parseInt(data.codigoRespuesta) === 0) {
            var pmensaje = $('#mensajeAlertaDialogo').text(data.mensaje);
            return;
        }
        var tablaUsuarios = fillTable("tblResultadoFiltro", "formatoUsuario", data.data.usuarios, '').show();
        var divRsultados = $('#divResultadosFiltro').show();
        var divPerfilAutorizaEmpresa = $('div#divAutorizacionPerfil select#cboPerfil');
        divPerfilAutorizaEmpresa.empty();
        divPerfilAutorizaEmpresa.append($('<option>').text('Seleccione un perfil').val(-1));
        $.each(data.data.perfiles, function (index, perfiles) {
            divPerfilAutorizaEmpresa.append($('<option>').text(perfiles.perfilnombre).val(perfiles.ideperfil));
        });
    },

    CargarResultadoUsuarios: function () {
        that.habilitarCampos();
        $('#pestanias').hide();
        $('#divcheckPerfilNuevo').hide();
        registroProgramasUsuariosModel.insert = null;
        registroProgramasUsuariosModel.actualiza = 1;
        that.dialogoActual.dialog('close');
        var posicion = $('table#tblResultadoFiltro input[type=radio]:checked').parent().parent().attr('data-fila');
        var resultadoUsuarios = registroProgramasUsuariosModel.usuarios[posicion];
        var divUsuarios = $('div#divUsuarios');
        divUsuarios.find('input#txtCedula').val(resultadoUsuarios.nit).attr('disabled', true);
        divUsuarios.find('input#txtNombreUsuario').val(resultadoUsuarios.nombrecolaborador);
        divUsuarios.find('input#txtCorreo').val(resultadoUsuarios.usulogin).attr('disabled', true);
        divUsuarios.find('input#txtTopeFinanciar').val(resultadoUsuarios.topefinan);
        if (resultadoUsuarios.topefinan === '' || resultadoUsuarios.topefinan === null) {
            $('input#txtTopeFinanciar').val(0);
        }
        divUsuarios.find('input#txtIdePerfil').val(resultadoUsuarios.ideperfil).attr('disabled', true);
        divUsuarios.find('input#txtPerfil').val(resultadoUsuarios.nombreperfil).attr('disabled', true);
        divUsuarios.find('input#txtIdeUsuario').val(resultadoUsuarios.ideusuario).attr('disabled', true);
        divUsuarios.find('select#cboRecaudoExterno').val(resultadoUsuarios.externo);
        if (resultadoUsuarios.usem == "" || resultadoUsuarios.usem == null) {
            var dialogo = $('div#divAutorizacionPerfil');
            that.dialogoActual = dialogo.dialogo({
                modal: true,
                width: 600,
                title: 'Autorizar Perfil',
                buttons: {
                    Autorizar: that.autorizaPerfil,
                    Cancelar: function () {
                        $(this).dialog('close');
                        location.reload();
                    }
                }
            });
        } else {
            $('#divOpcionesMenuPrograma').show();
            that.buscaMenus();
        }
    },

    autorizaPerfil: function () {
        if ($('select#cboPerfil option:selected').val() == -1 || $('select#cboPerfil option:selected').val() == null) {
            __dom.lanzarAlerta("Seleccione un perfil", "Error");
            return;
        }
        $('#txtPerfil').val($('select#cboPerfil option:selected').text());
        $('#txtIdePerfil').val($('select#cboPerfil option:selected').val());
        var data = {
            idPerfilAutorizada: $('select#cboPerfil option:selected').val(),
            idColaborador: $('input#txtIdeUsuario').val()
        };
        registroProgramasUsuariosControl.crearPerfilAutoriza(data, that.onResultadoAutorizaPerfil);
    },

    onResultadoAutorizaPerfil: function (data) {

        switch (data.codigoRespuesta) {
            case 1:
                $('#divProgramaUnidades').show();
                $('#divProgramaProyectos').show();
                $('#divMediosPago').show();
                $('#divRutas').show();
                that.buscaMenus;
                break;
            case - 1:
                __dom.lanzarAlerta(data.mensaje, "Error");
                break;
            case 0:
                __dom.lanzarAlerta(data.mensaje, "Error");
                break;


            default:

                break;
        }
    },

    buscaMenus: function () {
        var data = {
            idusuarioAsignar: $('input#txtIdeUsuario').val()
        };
        registroProgramasUsuariosControl.getMenusContro(data, that.onResultadoMenu);
    },

    onResultadoMenu: function (data) {

        switch (data.codigoRespuesta) {
            case 1:
                $('#cboOpcionesMenu').empty();
                that.armaMenu(data);
                break;
            case - 1:
                __dom.lanzarAlerta(data.mensaje, "Error");
                break;
            case 0:
                __dom.lanzarAlerta(data.mensaje, "Error");
                break;


            default:

                break;
        }
    },

    armaMenu: function (data) {
        var cboMenu = $("#cboMenu");
        cboMenu.empty();
        var option = $("<option>").val(-1).text("Selecione una opción");
        cboMenu.append(option);
        for (var i = 0; i < data.menus.length; i++) {
            var menu = data.menus[i];
            var option = $("<option>").val(menu.ideopc).text(menu.nombre);
            cboMenu.append(option);
        }
    },

    buscaOpcionesMenu: function () {
        $('#cboOpcionesMenu').empty();
        var idepadreMenu = $("select#cboMenu option:selected").val();
        if (idepadreMenu == -1) {
            __dom.lanzarAlerta("Seleccione Opcion Menú");
            return;
        }
        var data = {
            idpadreMenu: idepadreMenu
        };
        registroProgramasUsuariosControl.opcionesMenu(data, that.onResultadoBusquedaMenu);
    },
    onResultadoBusquedaMenu: function (data) {
        switch (data.codigoRespuesta) {
            case 1:
                that.onResultadoOpcionesMenus(data);
                break;
            case - 1:
                __dom.lanzarAlerta(data.mensaje, "Error");
                break;
            case 0:
                __dom.lanzarAlerta(data.mensaje, "Error");
                break;


            default:

                break;
        }
    },

    onResultadoOpcionesMenus: function (data) {

        $('#divcboOpcionesMenu').show();
        var cboOpcionesMenu = $('#cboOpcionesMenu');
        cboOpcionesMenu.empty();
        var option = $('<option>').val(-1).text("Seleccione una opción");
        cboOpcionesMenu.append(option);
        $.each(data.opcionesMenus, function (item, opcionesMenus) {
            var option = $('<option>').val(opcionesMenus.ideopc).text(opcionesMenus.nombre);
            cboOpcionesMenu.append(option);
        });
    },

    onbuscaProgramas: function () {
        $('#listaProgramasSeleccionada .listaSeleccion').empty();
        $('#listaProgramasSeleccion .listaSeleccion').empty();
        var ideOpcionesMenu = $("select#cboOpcionesMenu option:selected").val();
        if (ideOpcionesMenu == -1) {
            __dom.lanzarAlerta("Seleccione un Programa ");
            return;
        }

        var data = {
            ideOpcionesMenu: ideOpcionesMenu,
            idusuarioAsignar: $('input#txtIdeUsuario').val()
        };
        registroProgramasUsuariosControl.buscaProgramasUsuarios(data, that.onResultadoProgramas);
    },
    
     onGetAllProgramas: function(){
        $('#listaProgramasSeleccionada .listaSeleccion').empty();
        $('#listaProgramasSeleccion .listaSeleccion').empty();
        var ideOpcionesMenu = $("select#cboMenu option:selected").val();
        if (ideOpcionesMenu == -1) {
            __dom.lanzarAlerta("Seleccione un opción de Menú ");
            return;
        }

        var data = {
            ideOpcionesMenu: ideOpcionesMenu,
            idusuarioAsignar: $('input#txtIdeUsuario').val()
        };
        registroProgramasUsuariosControl.buscaTodosProgramasUsuarios(data,that.onResultadoProgramas);
    },

    onResultadoProgramas: function (data) {
        switch (data.codigoRespuesta) {
            case 1:
                $('#pestanias').show();
                that.armaProgramas(data);
                break;
            case - 1:
                __dom.lanzarAlerta(data.mensaje, "Error");
                break;
            case 0:
                __dom.lanzarAlerta(data.mensaje, "Error");
                break;


            default:

                break;
        }
    },

    armaProgramas: function (data) {

        registroProgramasUsuariosModel.programasAsignados = [];
        registroProgramasUsuariosModel.programasLogin = [];
        registroProgramasUsuariosModel.programasAsignados = data.programas.programasAsignados;
        registroProgramasUsuariosModel.programasLogin = data.programas.programasLogin;
        var resultado = registroProgramasUsuariosControl.validacionProgramasAsignados();
        if (resultado >= 0) {
            that.armaDivisionProgramas();
        }
    },

    armaDivisionProgramas: function () {
        if (registroProgramasUsuariosModel.programasAsignados.length > 0) {
            var divProgAsignado = $('#listaProgramasSeleccionada .listaSeleccion');
            for (var i = 0; i < registroProgramasUsuariosModel.programasAsignados.length; i++) {
                var programaAsignado = registroProgramasUsuariosModel.programasAsignados[i];
                var divProgramas = that.agregarDivListaProgramas(programaAsignado);
                divProgAsignado.append(divProgramas);
            }
        }
        if (registroProgramasUsuariosModel.programasLogin.length > 0) {
            var divProgSinAsignar = $('#listaProgramasSeleccion .listaSeleccion');
            for (var i = 0; i < registroProgramasUsuariosModel.programasLogin.length; i++) {
                var programaSinAsignar = registroProgramasUsuariosModel.programasLogin[i];
                var divProgramas = that.agregarDivListaProgramas(programaSinAsignar);
                divProgSinAsignar.append(divProgramas);
            }
        }
    },

    agregarDivListaProgramas: function (data) {
        var label = $('<label>');
        var id = data.ideopc;
        var check = $('<input type="checkbox">');

        check.val(id);
        check.attr('data-indice', id);
        check.attr('id', 'check_programa_' + id);
        label.attr('for', 'check_programa_' + id);
        label.text(id + ' - ' + data.nombre);
        var select = $('<div>').append(check, label);
        return select;
    },

    /**
     * Filtra los Programas consultadas según el valor del campo de texto txtFiltroProgramas
     * @returns {void}
     */
    filtrarProgramas: function () {
        $('#listaProgramasSeleccion .listaSeleccion div').hide();
        var nombre = $('#txtFiltroProgramas').val().trim().toUpperCase();
        $('#listaProgramasSeleccion div label').each(function (i, item) {
            item = $(item);
            if (item.text().toUpperCase().indexOf(nombre) !== -1) {
                item.parent().show();
            }
        });
    },

    mostrarProgramasAsignados: function () {
        var accion = $(this).attr('data-id');
        var origen = accion === 'seleccionar' ? 'listaProgramasSeleccion' : 'listaProgramasSeleccionada';
        var destino = accion === 'seleccionar' ? 'listaProgramasSeleccionada' : 'listaProgramasSeleccion';
        if (this.id === 'btnAllProgramasSeleccion' || this.id === 'btnAllProgramasDeseleccion') {
            var divisiones = $('#' + origen + ' .listaSeleccion div');
            divisiones.find('input[type="checkbox"]').removeAttr('checked');
            $('#' + destino + ' .listaSeleccion').append(divisiones);

            if (destino === 'listaProgramasSeleccion' && registroProgramasUsuariosModel.programasAsignados.length > 0) {
                for (var it = registroProgramasUsuariosModel.programasAsignados.length - 1; it >= 0; it--) {
                    registroProgramasUsuariosModel.programasEliminar.push(registroProgramasUsuariosModel.programasAsignados[it]);
                    registroProgramasUsuariosModel.programasLogin.push(registroProgramasUsuariosModel.programasAsignados[it]);
                    registroProgramasUsuariosModel.programasAsignados.splice(it, 1);
                }
            }
            if (destino === 'listaProgramasSeleccionada' && registroProgramasUsuariosModel.programasLogin.length > 0) {
                for (var lt = registroProgramasUsuariosModel.programasLogin.length - 1; lt >= 0; lt--) {
                    registroProgramasUsuariosModel.programasNuevos.push(registroProgramasUsuariosModel.programasLogin[lt]);
                    registroProgramasUsuariosModel.programasAsignados.push(registroProgramasUsuariosModel.programasLogin[lt]);
                    registroProgramasUsuariosModel.programasLogin.splice(lt, 1)
                }
            }
        } else {
            var selector = $('#' + origen + ' div input:checked').parent();
            $.each(selector, function (i, check) {
                var opcide = [];
                opcide = parseInt($(check).find('input').val());
                console.log(opcide);
                if (destino === 'listaProgramasSeleccionada') {
                    for (var l = registroProgramasUsuariosModel.programasLogin.length - 1; l >= 0; l--) {
                        if (registroProgramasUsuariosModel.programasLogin[l].ideopc === opcide) {
                            registroProgramasUsuariosModel.programasNuevos.push(registroProgramasUsuariosModel.programasLogin[l]);
                            registroProgramasUsuariosModel.programasAsignados.push(registroProgramasUsuariosModel.programasLogin[l]);
                            registroProgramasUsuariosModel.programasLogin.splice(l, 1);
                        }
                    }
                } else {
                    for (var j = registroProgramasUsuariosModel.programasAsignados.length - 1; j >= 0; j--) {
                        if (registroProgramasUsuariosModel.programasAsignados[j].ideopc === opcide) {
                            registroProgramasUsuariosModel.programasEliminar.push(registroProgramasUsuariosModel.programasAsignados[j]);
                            registroProgramasUsuariosModel.programasLogin.push(registroProgramasUsuariosModel.programasAsignados[j])
                            registroProgramasUsuariosModel.programasAsignados.splice(j, 1);
                        }
                    }
                }
                var div = check.cloneNode(true);
                $('#' + destino + ' .listaSeleccion').append(div);
                $(div).find('input:checked').attr('checked', false);
                check.remove();
            });
        }
    }




};
registroProgramasUsuariosVista.init();