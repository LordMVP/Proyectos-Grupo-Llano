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
var registroUsuariosVista = {
    /**
     * Inicializa el programa para el registro de ventas y asigna listeners a controles.
     * @returns {void}
     */
    init: function () {
        that = registroUsuariosVista;
        registroUsuariosModel.unidadEliminar = [];
        registroUsuariosModel.unidadNueva = [];
        __dom.configurarTextoNumerico('txtCedula, #txtTopeFinanciar');
        __dom.configurarColapsable('.divContenedorColapsable');
        __dom.loginUsuario('txtCorreo');
        $('#txtTopeFinanciar').val(0);
        $('#btnGrabar').on('click', that.grabarUsuario);
        //$('#btnNuevo').on('click', that.nuevoUsuario);
        $('#btnFiltrar').on('click', that.mostrarBuscarUsuario);
        $('#checkUnidades').on('click', that.getUsuario);
        $('#divBuscarColaborador #btnBuscarColaborador').on('click', that.onBuscaUsuario);
        $('#divBuscarUsuarios #btnGetUsuario').on('click', that.onGetUsuario);
        $('#cboProgramaAsignar').on('change', that.buscaEstructuraLogin);
        $('#cboProgramaAsignarProyecto').on('change', that.buscaProyectos);
        $('#cboEstructura').on('change', that.buscaUnidadesLoginAsignar);
        $('#btnAsignar').on('click', that.asignarUnidades);
        $('#btnRetirar').on('click', that.retirarUnidades);
        $('#btnAsignarMediosPagos').on('click', that.asignarMediosPagos);
        $('#btnRetirarMediosPagos').on('click', that.retirarMediosPagos);
        $('#btnAsignarRutas').on('click', that.asignarRutas);
        $('#btnRetirarRutas').on('click', that.retirarRutas);
        $('#btnProyectoAsignar').on('click', that.asignarProyectos);
        $('#btnProyectoRetirar').on('click', that.retirarProyectos);
        $('#txtCorreo').on('blur', that.loginUsuario);
        $('#btnUnidades').on('click', that.getAllUnidades);

    },

    /**
     * Solicita confirmación para enviar el cargue másivo
     * @returns {void} 
     */
    confirmarEnviar: function () {
        var tabActivo = $('#tabs').tabs('option', 'active');
        var operador = $($('div#tabs li a')[tabActivo]).attr('data');
        if (operador === "C") {
            that.dialogoActual = $('#divConfirmaEliminar').dialogo({
                resizable: false,
                heigth: 140,
                modal: true,
                title: 'Continuar con el Cargue Masivo',
                buttons: {
                    Reemplazar: function () {
                        that.dialogoActual.dialog('close');
                        that.asignaUnidadProyecto(1);
                    },
                    Complementar: function () {
                        that.dialogoActual.dialog('close');
                        that.asignaUnidadProyecto(0);
                    }
                }
            });
        } else {
            that.subirAdjunto();
        }
    },

    getAllUnidades: function () {
        var ideprograma = $("select#cboProgramaAsignar option:selected").val();
        if (ideprograma == -1) {
            __dom.lanzarAlerta("Seleccione un Programa ");
            return;
        }
        var datos = {
            ideprograma: ideprograma,
            idusuarioAsignar: $('input#txtIdeUsuario').val()
        };
        registroUsuariosControl.buscaAllUnidades(datos, that.onResultadoUnidades);
    },
    grabarUsuario: function () {
        if (registroUsuariosModel.unidadNueva.length === 0 &&
                registroUsuariosModel.unidadEliminar.length === 0 &&
                registroUsuariosModel.proyectosNuevos.length === 0 &&
                registroUsuariosModel.proyectosEliminar.length === 0 &&
                registroUsuariosModel.mediosPagosNuevos.length === 0 &&
                registroUsuariosModel.mediosPagosEliminar.length === 0 &&
                registroUsuariosModel.rutasNuevos.length === 0 &&
                registroUsuariosModel.rutasEliminar.length === 0) {
            return;
        }
        var datos = {
            idusuarioAsignar: $('input#txtIdeUsuario').val(),
            unidadesNuevas: registroUsuariosModel.unidadNueva,
            unidadesEliminadas: registroUsuariosModel.unidadEliminar,
            proyectoNuevos: registroUsuariosModel.proyectosNuevos,
            proyectosEliminados: registroUsuariosModel.proyectosEliminar,
            mediosPagoNuevos: registroUsuariosModel.mediosPagosNuevos,
            mediosPagoEliminar: registroUsuariosModel.mediosPagosEliminar,
            rutasNuevas: registroUsuariosModel.rutasNuevos,
            rutasEliminar: registroUsuariosModel.rutasEliminar
        };
        registroUsuariosControl.grabaPermisoUsuario(datos, that.onResultadoGrabar);
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
                    }, 500);
                }, 1000);

                break;

            case 0:
                __dom.lanzarAlerta('no se completo la transacción', 'Advertencia');
                break;

                break;
        }
    },

    loginUsuario: function () {
        var regex = /^[a-z]*$/;
        if (!regex.test($('#txtCorreo').val())) {
            __dom.lanzarAlerta('Por favor digite solo letras, en el campo correo', 'ERROR');
            return;
        }
        if ($('#txtCorreo').val() == null || $('#txtCorreo').val() == '') {
            return;
        }
        var data = {
            idusuarioCorreo: $('#txtCorreo').val()
        };
        registroUsuariosControl.validacionLoginUsuario(data, that.onResultadoLogin);
    },

    onResultadoLogin: function (data) {
        switch (data.codigoRespuesta) {
            case - 1:
                __dom.lanzarAlerta(data.mensaje, 'ERROR');
                break;

            case 1:
                __dom.lanzarAlerta('Por favor agrege o quite una letra del nombre correo', 'Advertencia');
                return;
                break;

            case 0:
                break;

                break;
        }
    },

    nuevoUsuario: function () {
        that.limpiaCampos();
        that.habilitarCampos();
        registroUsuariosModel.insert = 1;
        registroUsuariosModel.actualiza = null;
    },
    habilitarCampos: function () {
        var campos = $('div#divUsuarios').find('input[type=text] ,select');

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
        registroUsuariosModel.actualiza = [];
        registroUsuariosModel.insert = [];
        registroUsuariosModel.usuarios = [];
        registroUsuariosModel.programaAsignar = [];
        registroUsuariosModel.estructuraLogin = [];
        registroUsuariosModel.unidadesSinAsignarLogin = [];
        registroUsuariosModel.unidadesAsignadas = [];
        registroUsuariosModel.unidadesAsignadasEliminar = [];
        registroUsuariosModel.unidadesAsignadasNuevas = [];
        registroUsuariosModel.mediosPagosSinAsignarLogin = [];
        registroUsuariosModel.mediosPagosAsignados = [];
        registroUsuariosModel.mediosPagosEliminar = [];
        registroUsuariosModel.mediosPagosNuevos = [];
        registroUsuariosModel.rutasSinAsignarLogin = [];
        registroUsuariosModel.rutasAsignados = [];
        registroUsuariosModel.rutasEliminar = [];
        registroUsuariosModel.rutasNuevos = [];
        registroUsuariosModel.proyectosSinAsignarLogin = [];
        registroUsuariosModel.proyectosAsignados = [];
        registroUsuariosModel.proyectosEliminar = [];
        registroUsuariosModel.proyectosNuevos = [];
        $('table#tblResultadoFiltro').hide();
        $('#divColapsable').hide();

    },
    
    getUsuario: function () {
        
        if ($('#checkUnidades').prop('checked')) {
            if($('#txtIdeUsuario').val() == '' || $('#txtIdeUsuario').val() == null){
                __dom.lanzarAlerta('Por favor seleccione un colaborador','Advertencia');
                $('#checkUnidades').removeAttr('checked');
                return;
            }
            var dialogo = $('#divBuscarUsuarios');
            dialogo.find('input[type = text]').val('');
            that.dialogoActual = dialogo.dialogo({
                modal: true,
                width: 600,
                title: 'Buscar un Colaborador',
                buttons: {
                    Asignar: that.confirmarEnviar
                }

            });
        }
    },
    /**
     * Solicita confirmación para enviar el cargue másivo
     * @returns {void} 
     */
    confirmarEnviar: function () {
        
            that.dialogoActual = $('#divConfirma').dialogo({
                resizable: false,
                heigth: 140,
                modal: true,
                title: 'Asigna todos los Permisos?.',
                buttons: {
                    Reemplaza: function () {
                        that.dialogoActual.dialog('close');
                        that.asignaUnidadProyecto(1);
                    },
                    Complementa: function () {
                        that.dialogoActual.dialog('close');
                        that.asignaUnidadProyecto(0);
                    }
                }
            });
        
    },

    asignaUnidadProyecto: function (data) {

        var posicion = $('table#tblResultadoUsuario input[type=radio]:checked').parent().parent().attr('data-fila');
        var resultadoUsuarios = registroUsuariosModel.usuarios[posicion];
        var datos = {
            ideColaboradorAsignar: $('#txtIdeUsuario').val(),
            ideColaboradorOrigen: resultadoUsuarios.ideusuario,
            idePerfil : $('#txtIdePerfil').val(),
            accion : data
        };
        registroUsuariosControl.grabaPermisoUsuarioCompleto(datos, that.onResultadoGrabaPermisos);

    },
    onResultadoGrabaPermisos: function (data){
        switch (data.codigoRespuesta) {
            case 1:
                __dom.lanzarAlerta(data.mensaje,'');
                location.reload();
                break;
                
            case -1:
                __dom.lanzarAlerta(data.mensaje,'Error');
                break;
                
            default:
                
                break;
        }
    },
    /**
     * Ventana emergente de "buscar Usuario".
     * @returns {void}
     */
    mostrarBuscarUsuario: function () {
        registroUsuariosModel.actualiza = 1;
        registroUsuariosModel.insert = null;
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
        registroUsuariosControl.consultarUsuario(data, that.onResultadoConsultarUsuario);
    },

    onGetUsuario: function () {
        $('#mensajeAlertaDialogo').text('');
        if ($('#txtCedulaUsu').val() == '' && $('#txtNombreUsu').val() == '') {
            $('#mensajeAlertaDialogo').text('Digite, Nombre ó Cédula  ');
            $('#txtCedula').focus();
            return;
        }
        var data = {
            'idedocumento': $('#txtCedulaUsu').val(),
            'nombre': $('#txtNombreUsu').val()
        };
        registroUsuariosControl.usariosBuscar(data,that.onGetUsuarioArma);
    },

    onGetUsuarioArma: function (data) {        
         $('#tblResultadoUsuario').empty();
         __dom.ocultarCargador();
         registroUsuariosModel.usuarios = data.data.usuarios;
         if (parseInt(data.codigoRespuesta) === 0) {
         var pmensaje = $('#mensajeAlertaDialogo').text(data.mensaje);
         return;
         }
         var tablaUsuarios = fillTable("tblResultadoUsuario", "formatoUsuario", data.data.usuarios, '').show();
         var divRsultados = $('#divResultadosUsuario').show();
    },

    onResultadoConsultarUsuario: function (data) {
        $('#tblResultadoFiltro').empty();
        __dom.ocultarCargador();
        registroUsuariosModel.usuarios = data.data.usuarios;
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
        registroUsuariosModel.insert = null;
        registroUsuariosModel.actualiza = 1;
        that.dialogoActual.dialog('close');
        var posicion = $('table#tblResultadoFiltro input[type=radio]:checked').parent().parent().attr('data-fila');
        var resultadoUsuarios = registroUsuariosModel.usuarios[posicion];
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
            $('#divProgramaUnidades').show();
            $('#divProgramaProyectos').show();
            $('#divMediosPago').show();
            $('#divRutas').show();
            that.buscaProgramasAsignar();
            that.buscaProgramasAsignarProyecto();
            that.buscaMediosPagos();
            that.getRutas();
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
        registroUsuariosControl.crearPerfilAutoriza(data, that.onResultadoAutorizaPerfil);
    },

    onResultadoAutorizaPerfil: function (data) {

        switch (data.codigoRespuesta) {
            case 1:
                $('#divProgramaUnidades').show();
                $('#divProgramaProyectos').show();
                $('#divMediosPago').show();
                $('#divRutas').show();
                that.buscaProgramasAsignar;
                that.buscaProgramasAsignarProyecto;
                that.buscaMediosPagos;
                that.getRutas;
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

    buscaProgramasAsignar: function () {
        var data = {
            idusuarioAsignar: $('input#txtIdeUsuario').val()
        };
        registroUsuariosControl.programaUsuarioAsignar(data, that.onResultadoProgramaAsignar);
    },

    onResultadoProgramaAsignar: function (data) {

        switch (data.codigoRespuesta) {
            case 1:
                $('#cboEstructura').empty();
                $('#cboProgramaAsignar').empty();
                that.armaProgramaAsignar(data);
                break;
            case - 1:
                 $('#cboEstructura').empty();
                $('#cboProgramaAsignar').empty();
                __dom.lanzarAlerta(data.mensaje, "Error");
                break;
            case 0:
                 $('#cboEstructura').empty();
                $('#cboProgramaAsignar').empty();
                __dom.lanzarAlerta(data.mensaje, "Error");
                break;


            default:

                break;
        }
    },

    armaProgramaAsignar: function (data) {
        var cboProgramaAsignar = $("#cboProgramaAsignar");
        cboProgramaAsignar.empty();
        var option = $("<option>").val(-1).text("Selecione un Programa");
        cboProgramaAsignar.append(option);
        for (var i = 0; i < data.programas.length; i++) {
            var programa = data.programas[i];
            var option = $("<option>").val(programa.ideprograma).text(programa.programa);
            cboProgramaAsignar.append(option);
        }
    },

    buscaProgramasAsignarProyecto: function () {
        var data = {
            idusuarioAsignar: $('input#txtIdeUsuario').val()
        };
        registroUsuariosControl.programaUsuarioAsignarProyectos(data, that.onResultadoProgramaAsignarProyecto);
    },

    onResultadoProgramaAsignarProyecto: function (data) {

        switch (data.codigoRespuesta) {
            case 1:
                that.armaProgramaAsignarProyecto(data);
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

    armaProgramaAsignarProyecto: function (data) {
        var cboProgramaAsignar = $("#cboProgramaAsignarProyecto");
        cboProgramaAsignar.empty();
        var option = $("<option>").val(-1).text("Selecione un Programa");
        cboProgramaAsignar.append(option);
        for (var i = 0; i < data.programas.length; i++) {
            var programa = data.programas[i];
            var option = $("<option>").val(programa.ideprograma).text(programa.programa);
            cboProgramaAsignar.append(option);
        }
    },

    buscaEstructuraLogin: function () {
        $('#cboEstructura').empty();
        var ideprograma = $("select#cboProgramaAsignar option:selected").val();
        if (ideprograma == -1) {
            __dom.lanzarAlerta("Seleccione un Programa");
            return;
        }
        var data = {
            idprograma: ideprograma
        };
        registroUsuariosControl.estructuraUsuarioLogin(data, that.onResultadoBusquedaEstructura);
    },
    onResultadoBusquedaEstructura: function (data) {
        switch (data.codigoRespuesta) {
            case 1:
                that.onResultadoEstructura(data);
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

    onResultadoEstructura: function (data) {

        $('#divcboEstructura').show();
        var cboEstructura = $('#cboEstructura');
        cboEstructura.empty();
        var option = $('<option>').val(-1).text("Seleccione una opción");
        cboEstructura.append(option);
        $.each(data.estructuras, function (item, estructura) {
            var option = $('<option>').val(estructura.ideestructura).text(estructura.nombre);
            cboEstructura.append(option);
        });
    },
    buscaUnidadesLoginAsignar: function () {
        var ideprograma = $("select#cboProgramaAsignar option:selected").val();
        var idestructura = $("select#cboEstructura option:selected").val();
        if (ideprograma == -1) {
            __dom.lanzarAlerta("Seleccione un Programa ");
            return;
        }
        if (idestructura == -1) {
            __dom.lanzarAlerta("Seleccione una estructura");
            return;
        }
        var data = {
            idprograma: ideprograma,
            idusuarioAsignar: $('input#txtIdeUsuario').val(),
            idestructura: idestructura
        };
        registroUsuariosControl.buscaUnidadesUsuario(data, that.onResultadoUnidades);
    },

    onResultadoUnidades: function (data) {
        var indice = $("select#cboProgramaAsignar option:selected").val() + $('#cboEstructura option:selected').val() + 'u';
        registroUsuariosModel.unidadesAsignadasNuevas = [];
        registroUsuariosModel.unidadesAsignadasEliminar = [];
        registroUsuariosModel.unidadesAsignadas[indice] = [];
        registroUsuariosModel.unidadesSinAsignarLogin[indice] = [];
        registroUsuariosModel.unidadesAsignadas[indice] = data.unidades.unidadesAsignar;
        registroUsuariosModel.unidadesSinAsignarLogin[indice] = data.unidades.unidadesLogin;
        var resultado = registroUsuariosControl.validacionUnidadesAsignadas(indice);
        if (resultado >= 0) {
            that.armaTablaUnidades();
        }
    },

    armaTablaUnidades: function () {
        var indice = $("select#cboProgramaAsignar option:selected").val() + $('#cboEstructura option:selected').val() + 'u';
        $('#tblProgramaUnidadesSinAsignarLogin').empty();
        $('#tblProgramaUnidadesAsignadasUsuario').empty();
        if (registroUsuariosModel.unidadesSinAsignarLogin[indice].length > 0) {
            var tblProgramaUnidadesSinAsignarLogin = fillTable("tblProgramaUnidadesSinAsignarLogin", "formatoUnidadesSinAsignarLogin", registroUsuariosModel.unidadesSinAsignarLogin[indice], "Unidades Sin Asignar");
            $('#btnAsignar').show();
        }
        if (registroUsuariosModel.unidadesAsignadas[indice].length > 0) {
            var tblProgramaUnidadesSinAsignarLogin = fillTable("tblProgramaUnidadesAsignadasUsuario", "formatoUnidadesAsignadas", registroUsuariosModel.unidadesAsignadas[indice], "Unidades Asignadas");
            $('#btnRetirar').show();
        }
    },

    asignarUnidades: function () {
        var indice = $("select#cboProgramaAsignar option:selected").val() + $('#cboEstructura option:selected').val() + 'u';
        registroUsuariosModel.unidadesAsignadasNuevas = [];
        var filasTblUnidadesSinAsignar = $('#tblProgramaUnidadesSinAsignarLogin tbody tr.selected');
        if (filasTblUnidadesSinAsignar.length > 0) {
            for (var i = filasTblUnidadesSinAsignar.length - 1; i >= 0; i--) {
                var fila = $(filasTblUnidadesSinAsignar[i]);
                var posicion = fila.attr('data-fila');
                registroUsuariosModel.unidadesAsignadas[indice].push(registroUsuariosModel.unidadesSinAsignarLogin[indice][posicion]);
                registroUsuariosModel.unidadesAsignadasNuevas.push(registroUsuariosModel.unidadesSinAsignarLogin[indice][posicion]);
                registroUsuariosModel.unidadesSinAsignarLogin[indice].splice(posicion, 1);
            }
            registroUsuariosModel.unidadNueva.push(registroUsuariosModel.unidadesAsignadasNuevas);
            that.armaTablaUnidades();
        }
    },
    retirarUnidades: function () {
        var indice = $("select#cboProgramaAsignar option:selected").val() + $('#cboEstructura option:selected').val() + 'u';
        registroUsuariosModel.unidadesAsignadasEliminar = [];
        var tblProgramaUnidadesAsignadasUsuario = $('#tblProgramaUnidadesAsignadasUsuario tbody tr.selected');
        if (tblProgramaUnidadesAsignadasUsuario.length > 0) {
            for (var i = tblProgramaUnidadesAsignadasUsuario.length - 1; i >= 0; i--) {
                var fila = $(tblProgramaUnidadesAsignadasUsuario[i]);
                var posicion = fila.attr('data-fila');
                registroUsuariosModel.unidadesSinAsignarLogin[indice].push(registroUsuariosModel.unidadesAsignadas[indice][posicion]);
                registroUsuariosModel.unidadesAsignadasEliminar.push(registroUsuariosModel.unidadesAsignadas[indice][posicion]);
                registroUsuariosModel.unidadesAsignadas[indice].splice(posicion, 1);
            }
            registroUsuariosModel.unidadEliminar.push(registroUsuariosModel.unidadesAsignadasEliminar);
            that.armaTablaUnidades();
        }
    },

    buscaMediosPagos: function () {
        var data = {
            idusuarioAsignar: $('input#txtIdeUsuario').val()
        };
        registroUsuariosControl.mediosDePago(data, that.onResultadoMediosPagos);
    },

    onResultadoMediosPagos: function (data) {

        switch (data.codigoRespuesta) {
            case 1:
                that.onResultadoMediosdePagos(data);
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

    onResultadoMediosdePagos: function (data) {
        registroUsuariosModel.mediosPagosNuevos = [];
        registroUsuariosModel.mediosPagosEliminar = [];
        registroUsuariosModel.mediosPagosAsignados = [];
        registroUsuariosModel.mediosPagosSinAsignarLogin = [];
        registroUsuariosModel.mediosPagosAsignados = data.mediospagos.mediospagosAsignar
        registroUsuariosModel.mediosPagosSinAsignarLogin = data.mediospagos.mediospagosLogin;
        ;
        var resultado = registroUsuariosControl.validacionMediosPagos();
        if (resultado >= 0) {
            that.armaTablaMediosPagos();
        }
    },

    armaTablaMediosPagos: function () {
        $('#tblMediosPagosLogin').empty();
        $('#tblMediosPagosAsignados').empty();
        if (registroUsuariosModel.mediosPagosSinAsignarLogin.length > 0) {
            var tblMediosPagosLogin = fillTable("tblMediosPagosLogin", "formatoMedioPagoSinAsignarLogin", registroUsuariosModel.mediosPagosSinAsignarLogin, "Medios de Pago Sin Asignar");
            $('#btnAsignarMediosPagos').show();
        }
        if (registroUsuariosModel.mediosPagosAsignados.length > 0) {
            var tblMediosPagosAsignados = fillTable("tblMediosPagosAsignados", "formatoMedioPagoAsignadas", registroUsuariosModel.mediosPagosAsignados, "Medios de Pago Asignados");
            $('#btnRetirarMediosPagos').show();
        }
    },

    asignarMediosPagos: function () {
        var filasTblUnidadesSinAsignar = $('#tblMediosPagosLogin tbody tr.selected');
        if (filasTblUnidadesSinAsignar.length > 0) {
            for (var i = filasTblUnidadesSinAsignar.length - 1; i >= 0; i--) {
                var fila = $(filasTblUnidadesSinAsignar[i]);
                var posicion = fila.attr('data-fila');
                registroUsuariosModel.mediosPagosAsignados.push(registroUsuariosModel.mediosPagosSinAsignarLogin[posicion]);
                registroUsuariosModel.mediosPagosNuevos.push(registroUsuariosModel.mediosPagosSinAsignarLogin[posicion]);
                registroUsuariosModel.mediosPagosSinAsignarLogin.splice(posicion, 1);
            }
            that.armaTablaMediosPagos();
        }
    },
    retirarMediosPagos: function () {
        var tblMediosPagosAsignados = $('#tblMediosPagosAsignados tbody tr.selected');
        if (tblMediosPagosAsignados.length > 0) {
            for (var i = tblMediosPagosAsignados.length - 1; i >= 0; i--) {
                var fila = $(tblMediosPagosAsignados[i]);
                var posicion = fila.attr('data-fila');
                registroUsuariosModel.mediosPagosSinAsignarLogin.push(registroUsuariosModel.mediosPagosAsignados[posicion]);
                registroUsuariosModel.mediosPagosEliminar.push(registroUsuariosModel.mediosPagosAsignados[posicion]);
                registroUsuariosModel.mediosPagosAsignados.splice(posicion, 1);
            }
            that.armaTablaMediosPagos();
        }
    },

    getRutas: function () {
        var data = {
            idusuarioAsignar: $('input#txtIdeUsuario').val()
        };
        registroUsuariosControl.getRutas(data, that.onResultadoRutas);
    },

    onResultadoRutas: function (data) {

        switch (data.codigoRespuesta) {
            case 1:
                that.onResultadoGetRutas(data);
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

    onResultadoGetRutas: function (data) {
        registroUsuariosModel.rutasNuevos = [];
        registroUsuariosModel.rutasEliminar = [];
        registroUsuariosModel.rutasAsignados = [];
        registroUsuariosModel.rutasSinAsignarLogin = [];
        registroUsuariosModel.rutasAsignados = data.rutas.rutasAsignar;
        registroUsuariosModel.rutasSinAsignarLogin = data.rutas.rutasLogin;
        var resultado = registroUsuariosControl.validacionRutas();
        if (resultado >= 0) {
            that.armaTablaRutas();
        }
    },

    armaTablaRutas: function () {
        $('#tblRutasLogin').empty();
        $('#tblRutasAsignados').empty();
        if (registroUsuariosModel.rutasSinAsignarLogin.length > 0) {
            var tblMediosPagosLogin = fillTable("tblRutasLogin", "formatoRutasLogin", registroUsuariosModel.rutasSinAsignarLogin, "Rutas Sin Asignar");
            $('#btnAsignarRutas').show();
        }
        if (registroUsuariosModel.rutasAsignados.length > 0) {
            var tblMediosPagosAsignados = fillTable("tblRutasAsignados", "formatoRutasAsignadas", registroUsuariosModel.rutasAsignados, "Rutas Asignadas");
            $('#btnRetirarRutas').show();
        }
    },

    asignarRutas: function () {
        var filasTblUnidadesSinAsignar = $('#tblRutasLogin tbody tr.selected');
        if (filasTblUnidadesSinAsignar.length > 0) {
            for (var i = filasTblUnidadesSinAsignar.length - 1; i >= 0; i--) {
                var fila = $(filasTblUnidadesSinAsignar[i]);
                var posicion = fila.attr('data-fila');
                registroUsuariosModel.rutasAsignados.push(registroUsuariosModel.rutasSinAsignarLogin[posicion]);
                registroUsuariosModel.rutasNuevos.push(registroUsuariosModel.rutasSinAsignarLogin[posicion]);
                registroUsuariosModel.rutasSinAsignarLogin.splice(posicion, 1);
            }
            that.armaTablaRutas();
        }
    },
    retirarRutas: function () {
        var tblMediosPagosAsignados = $('#tblRutasAsignados tbody tr.selected');
        if (tblMediosPagosAsignados.length > 0) {
            for (var i = tblMediosPagosAsignados.length - 1; i >= 0; i--) {
                var fila = $(tblMediosPagosAsignados[i]);
                var posicion = fila.attr('data-fila');
                registroUsuariosModel.rutasSinAsignarLogin.push(registroUsuariosModel.rutasAsignados[posicion]);
                registroUsuariosModel.rutasEliminar.push(registroUsuariosModel.rutasAsignados[posicion]);
                registroUsuariosModel.rutasAsignados.splice(posicion, 1);
            }
            that.armaTablaRutas();
        }
    },

    buscaProyectos: function () {
        if ($("select#cboProgramaAsignarProyecto option:selected").val() == -1 || $("select#cboProgramaAsignarProyecto option:selected").val() == '')
            return;
        var data = {
            idusuarioAsignar: $('input#txtIdeUsuario').val(),
            ideprograma: $("select#cboProgramaAsignarProyecto option:selected").val()
        };
        registroUsuariosControl.proyectoUsuarioPrograma(data, that.onResultadoProyectoUsuarioPrograma);
    },

    onResultadoProyectoUsuarioPrograma: function (data) {
        switch (data.codigoRespuesta) {
            case 1:
                that.onResultadoProyectos(data);
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

    onResultadoProyectos: function (data) {
        var indice = $('#cboProgramaAsignarProyecto option:selected').val() + 's';
        registroUsuariosModel.proyectosAsignadosEliminar = [];
        registroUsuariosModel.proyectosAsinadosNuevos = [];
        registroUsuariosModel.proyectosAsignados[indice] = [];
        registroUsuariosModel.proyectosSinAsignarLogin[indice] = [];
        registroUsuariosModel.proyectosAsignados[indice] = data.proyectos.proyectosAsignar;
        registroUsuariosModel.proyectosSinAsignarLogin[indice] = data.proyectos.proyectosLogin;
        var resultado = registroUsuariosControl.validacionProyectosAsignados(indice);
        if (resultado >= 0) {
            that.armaTablaProyectos();
        }
    },

    armaTablaProyectos: function () {
        var indice = $('#cboProgramaAsignarProyecto option:selected').val() + 's';
        $('#tblProgramaProyectosSinAsignarLogin').empty();
        $('#tblProgramaProyectosAsignadasUsuario').empty();
        if (registroUsuariosModel.proyectosSinAsignarLogin[indice].length > 0) {
            var tblProgramaProyectosSinAsignarLogin = fillTable("tblProgramaProyectosSinAsignarLogin", "formatoProyectosLogin", registroUsuariosModel.proyectosSinAsignarLogin[indice], "Proyectos Sin Asignar");
            $('#btnProyectoAsignar').show();
        }
        if (registroUsuariosModel.proyectosAsignados[indice].length > 0) {
            var tblProgramaProyectosAsignadasUsuario = fillTable("tblProgramaProyectosAsignadasUsuario", "formatoProyectosAsignados", registroUsuariosModel.proyectosAsignados[indice], "Proyectos Asignados");
            $('#btnProyectoRetirar').show();
        }
    },

    asignarProyectos: function () {
        var indice = $('#cboProgramaAsignarProyecto option:selected').val() + 's';
        registroUsuariosModel.proyectosAsignadosNuevos = [];
        var filasTblProgramaProyectosSinAsignarLogin = $('#tblProgramaProyectosSinAsignarLogin tbody tr.selected');
        if (filasTblProgramaProyectosSinAsignarLogin.length > 0) {
            for (var i = filasTblProgramaProyectosSinAsignarLogin.length - 1; i >= 0; i--) {
                var fila = $(filasTblProgramaProyectosSinAsignarLogin[i]);
                var posicion = fila.attr('data-fila');
                registroUsuariosModel.proyectosAsignados[indice].push(registroUsuariosModel.proyectosSinAsignarLogin[indice][posicion]);
                registroUsuariosModel.proyectosAsignadosNuevos.push(registroUsuariosModel.proyectosSinAsignarLogin[indice][posicion]);
                registroUsuariosModel.proyectosSinAsignarLogin[indice].splice(posicion, 1);
            }
            registroUsuariosModel.proyectosNuevos.push(registroUsuariosModel.proyectosAsignadosNuevos);
            that.armaTablaProyectos();
        }
    },
    retirarProyectos: function () {
        var indice = $('#cboProgramaAsignarProyecto option:selected').val() + 's';
        registroUsuariosModel.proyectosAsignadosEliminar = [];
        var tblProgramaProyectosAsignadasUsuario = $('#tblProgramaProyectosAsignadasUsuario tbody tr.selected');
        if (tblProgramaProyectosAsignadasUsuario.length > 0) {
            for (var i = tblProgramaProyectosAsignadasUsuario.length - 1; i >= 0; i--) {
                var fila = $(tblProgramaProyectosAsignadasUsuario[i]);
                var posicion = fila.attr('data-fila');
                registroUsuariosModel.proyectosSinAsignarLogin[indice].push(registroUsuariosModel.proyectosAsignados[indice][posicion]);
                registroUsuariosModel.proyectosAsignadosEliminar.push(registroUsuariosModel.proyectosAsignados[indice][posicion]);
                registroUsuariosModel.proyectosAsignados[indice].splice(posicion, 1);
            }
            registroUsuariosModel.proyectosEliminar.push(registroUsuariosModel.proyectosAsignadosEliminar)
            that.armaTablaProyectos();
        }
    }


};
registroUsuariosVista.init();