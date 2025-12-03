/**
 * @fileOverview Archivo de vista y control de autorizaciones de impresión
 * @author AppFuture
 * @requires autorizacion_impresion.control.js
 * @version 1.0.0
 * @namespace formatoImpresiones
 */
/**
 * Objeto que hace referencia al namespace autorizacionModel
 * @type {Object}
 */
var self = null;
var formatoImpresiones = {
    thead: [
    {'id':'thFecha', 'text':'Fecha Registro', 'sort':false, 'refer':'fechaimpresion', 'type':'text'}, 
    {'id':'thEstado', 'text':'Estado', 'sort':false, 'refer':'estadoimpresion', 'type':'text'}, 
    {'id':'thDisponibles', 'text':'Imp. Autorizadas', 'sort':false, 'refer':'impresionesauth', 'type':'text'}, 
    {'id':'thRealizada', 'text':'Imp. Realizadas', 'sort':false, 'refer':'impresionesreal', 'type':'text'}, 
    ]
};
var autorizacionModel = {};
/** @namespace */
var autorizacionVista = {
    /** Hace referencia al último dialogo abierto en la aplicación
     * @type {object}
     */
    dialogoActual: null,
    /**
     * Inicializa la función del programa para autorizar cantidad de impresiones por usuario
     * @returns {void}
     */
    init: function () {
        self = autorizacionVista;
        self.configurarAutoComplete();
        consultarModel.accion = 'autorizacion';
        __dom.configurarTextoNumerico('txtCantImpresiones');
        $('#btnGrabar').on('click', self.validarAutorizacion);
        $('#txtCantImpresiones').on('blur', self.validarLimite);
    },
    /**
     * Valida que la cantidad autorizada sea menor a la catidad permitida por recaudo
     * @returns {void}
     */
    validarLimite: function () {
        var _this = $(this);
        if (isNaN(parseInt(autorizacionModel.cantpermitida)) && consultarModel.recaudo) {
            consultarControl.consultarLimite({idrecaudo: consultarModel.recaudo.idRecaudo}, function (data) {
                autorizacionModel.cantpermitida = parseInt(data.datos.impresiones);
                
                if (parseInt(_this.val()) > autorizacionModel.cantpermitida) {
                    _this.val(autorizacionModel.cantpermitida).focus().select();
                }
            });
            return;
        }
        if (parseInt(_this.val()) > autorizacionModel.cantpermitida) {
            _this.val(autorizacionModel.cantpermitida).focus().select();
        }
    },
    /**
     * Asigna funcionalidad a caja de texto para autocompletar
     * @returns {void}
     */
    configurarAutoComplete: function () {
        __dom.configurarAutocomplete(
                $('#txtUsuario'), self.sourceAutoComplete,
                function (event, ui) {
                    autorizacionModel.idusuario = ui.item.idVal;
                    $('#txtDocumentoUsuario').val(ui.item.documento);
                    var data = {
                        idusuario: autorizacionModel.idusuario,
                        idrecaudo : consultarModel.recaudo.idRecaudo
                    };
                    consultarControl.consultarImpresiones(data, self.onConsultarImpresiones);
                },
                function () {
                    $('#tblImpresiones').empty();
                    $('#txtDocumentoUsuario').val('');
                    autorizacionModel.idusuario = undefined;
                }
        );
    },
    /**
     * Obtiene las autorizaciones de impresión de un usuario respecto a los recaudos
     * @param {Object} data - Información enviada por el servidor de las autorizaciones de impresión
     */
    onConsultarImpresiones: function(data){
        $('#tblImpresiones').empty();
        $('#btnGrabar').removeAttr('disabled');
        if(data.codigoRespuesta === 1 && data.datos.estadoimpresion === 'A'){
            $('#btnGrabar').attr('disabled', 'disabled');
            fillTable('tblImpresiones', 'formatoImpresiones', [data.datos], 'Impresiones disponibles');
        }
    },
    /**
     * Se valida la información de txtEmpresaInstaladora y hace la petición al servidor.
     * @param  {object} req - (Request) Valor actual de la entrada de texto para petición.
     * @param  {object} res - (Response) Lo que se genera a partir de la respuesta del servidor.
     * @returns {void}
     */
    sourceAutoComplete: function (req, res) {
        self.request = req;
        self.response = res;
        if (req.term.trim() !== "") {
            consultarControl.consultarDetallesUsuario({parametro: req.term}, self.mostrarResultado);
        }
    },
    /**
     * Captura la respuesta del servidor y la muestra de forma gráfica en el campo de texto.
     * @param {object} data - Información de la firmas instaladoras enviada por el servidor
     * @returns {void}
     */
    mostrarResultado: function (data) {
        var result = [];
        if (data.codigoRespuesta === 1) {
            $.each(data.datos, function (i, item) {
                result.push({
                    label: item.nombreusuario,
                    documento: item.documento,
                    idVal: item.idusuario
                });
            });
        }
        self.response(result);
    },
    /**
     * Valida que la información que se grabará esté correcta, en caso de ser así 
     * hace petición de ajax para registrar el crédito en base de datos
     * @returns {void}
     */
    validarAutorizacion: function () {
        if (consultarModel.recaudo && autorizacionModel.idusuario) {
            var cant = $('#txtCantImpresiones');
            if (cant.val().trim() === '' || parseInt(cant.val()) <= 0) {
                __dom.lanzarAlerta('Debe digitar la cantidad de impresiones del recaudo autorizadas para el usuario mayor a 0', __app.mensajes.atencion,
                        function () {
                            cant.focus().select();
                            if(autorizacionModel.cantpermitida >= 1){
                                cant.val(1);
                            }
                        });
                return;
            }
            var data = {
                idrecaudo: parseInt(consultarModel.recaudo.idRecaudo),
                idusuario: parseInt(autorizacionModel.idusuario),
                impautorizadas: !isNaN(parseInt(cant.val())) ? parseInt(cant.val()) : 0
            };
            consultarControl.registrarAutorizacionImpresion(data, self.registrarCompleto);
        } else {
            __dom.lanzarAlerta('Debe seleccionar un recaudo y un usuario para ejecutar esta acción', __app.mensajes.atencion,
                    function () {
                        var txt = $('#txtUsuario');
                        (txt.is(':disabled')) ? $('#btnBuscar').focus() : txt.focus();
                    });
        }
    },
    /**
     * Recibe la respuesta del servidor cuando se registra una autorización
     * @returns {void}
     */
    registrarCompleto: function (data) {
        if (data.codigoRespuesta === 1) {
            that.limpiarFormulario();
            __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
            autorizacionModel = {};
            $('#tblImpresiones').empty();
            $('#btnGrabar').removeAttr('disabled');
            $('#txtDocumentoUsuario, #txtUsuario, #txtCantImpresiones').val('').attr('disabled', 'disabled');
        }
    }
};
autorizacionVista.init();