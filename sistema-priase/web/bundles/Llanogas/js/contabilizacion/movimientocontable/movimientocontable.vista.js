/**
 * @fileOverview Archivo de vista y control de generar movimiento contable
 * @author AngelicaGomez
 * @requires movimientocontable.control.js
 * @version 1.0.0
 */
/**
 * Objeto que hace referencia al namespace movimientoVista
 * @type {Object}
 */
var that = null;
/** @namespace */
var movimientoVista = {
    dialogoActual: null,
    /**Inicializa el programa de movimiento contable, y asigna listeners a los controles
     * @returns {void}
     */
    init: function () {
        that = movimientoVista;
        that.cargando = true;
        $('#btnGenerarMovimiento').on('click', that.confirmarGenerar);
        $('#btnRecargar').on('click', that.recargar);
        $('#checkServicio').on('change', that.cargaCiclos);
        $('#cmbCiclo').on('change', that.consultarPeriodo);
        movimientoControl.consultarMovimiento(that.generarMovimiento);
        movimientoModelo.interval = setInterval(function () {
            movimientoControl.consultarMovimiento(that.generarMovimiento);
        }, 5000);
    },
    
    /**
     * Recarga la página web
     * @returns {void}
     */
    recargar: function () {
        window.location.reload();
    },
    /** Se consulta si hay procesos en ejecución en caso de no ser así, confirma
     * si el usuario desea iniciar un nuevo proceso
     *  @return {void}
     **/
    confirmarGenerar: function () {
        movimientoControl.consultarMovimiento(function (data) {
            if (data.movimiento == null || data.movimiento.fechafinal !== null || data.movimiento.estado === 'I') {
                if ($('#cmbCiclo').val() == '-1') {
                    $('#divCargando').hide();
                    __dom.lanzarAlerta(__app.mensajes.seleccionarCiclo, __app.mensajes.atencion);
                    return;
                }
                that.dialogoActual = $('#divConfirmar').dialogo({
                    resizable: false,
                    heigth: 350,
                    modal: true,
                    title: 'Procesar movimientos',
                    buttons: {
                        "Sí": function () {
                            $('#divControles').hide();
                            $('#divCargando').show();
                            movimientoModelo.interval = setInterval(function () {
                                movimientoControl.consultarMovimiento(that.generarMovimiento);
                            }, 5000);
                            var dataEnviar = {
                                                idciclo: $('select#cmbCiclo').val(),
                                                idperiodo: $('select#cmbPeriodos').val()
                                            }
                            movimientoControl.generarMovimiento(
                                    dataEnviar,
                                    that.onGenerarCompleto
                                    );
                            that.dialogoActual.dialog('close');

                        }, Cancelar: function () {
                            that.dialogoActual.dialog("close");
                        }
                    }
                });
            } else {
                that.generarMovimiento(data);
            }
        });
    },
    /** Captura la respuesta del servidor cuando se generó un nuevo movimiento
     * @param {object} data - Respuesta del servidor con movimientos generados
     * @return{void}
     **/
    onGenerarCompleto: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                break;
            case 1:
                movimientoControl.consultarMovimiento(that.generarMovimiento);
                $('#divCargando').show();
                $('#divControles').hide();
                break;
            case -1:
                var funcionRecargar = function () {
                    window.location.reload();
                }
                __dom.ocultarToast();
                __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion, funcionRecargar, null, funcionRecargar);
                break;
        }
    },
    /** Captura la respuesta del servidor cuando se consultan la ejecución en proceso
     * @param {object} data - Respuesta del servidor por información de la ejecución
     * @returns {void}
     */
    generarMovimiento: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                if(!that.cargando){
                    __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                }
                $('#btnGenerarMovimiento').attr('disabled', false);
                $('#divControles').show();
                break;
            case 1:
                if (!!data.mensaje) {
                    __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                }
                if (data.movimiento !== null) {
                    $('#divCargando').show();
                    $('#divControles').hide();
                    $('#btnGenerarMovimiento').attr('disabled', true);
                    movimientoModelo.estado = [];
                    movimientoModelo.estado.push(data.movimiento);
                    fillTable("tblMovimiento", "formatoMovimiento", "movimientoModelo.estado", "");
                    if ((data.movimiento.fechafinal || data.movimiento.estado === 'I')) {
                        that.limpiarProgreso();
                        (!that.cargando) ? __dom.lanzarAlerta('Se ha finalizado el proceso', __app.mensajes.atencion): null;
                    }
                    that.cargando = false;
                    return;
                }

                that.limpiarProgreso();
                break;
            default:
                $('#btnGenerarMovimiento').attr('disabled', false);
                $('#divControles').show();
                $('#tblMovimiento').empty();
                break;
        }
        that.cargando = false;
    },

    /**
     * Limpia las partes de la interfaz que tienen que ver con la consulta del progreso.
     * @returns {void}
     */
    limpiarProgreso: function () {
        $('#btnGenerarMovimiento').attr('disabled', false);
        $('#divCargando').hide();
        $('#divControles').show();
        $('#tblMovimiento').empty();
        clearInterval(movimientoModelo.interval);
    },
    /*
     * Evalua si selecciona para cargar los ciclos 
     * @param {type} data
     * @returns {void}
     */
    cargaCiclos: function(){ 
         if( $('#checkServicio').prop('checked')){
                      $('#cmbCiclo').empty();
                      $('#cmbPeriodo').show();
            
               var data = {
                   idempresa: 322
               };
               movimientoControl.consultaCiclos(data, that.onConsultarCiclos);
            
     }else{
         
         $('#cmbPeriodos').val(-1)
         $('#cmbPeriodo').hide();
         $('#cmbCiclo').empty();
         
         var data = {
                   idempresa: 322
               };
         movimientoControl.consultaCiclosGeneral(data, that.onConsultarCiclos);
     }
    },
     /**
     * Se ejecuta cuando consulta los ciclos y carga un select con los datos.
     * @param  {Object} data Respuesta del servidor
     * @returns {void}      
     */
    onConsultarCiclos: function (data) {
        console.log(data);
        switch (data.codigoRespuesta) {
            case 1:
                var cmbCiclos = $('#cmbCiclo');
                cmbCiclos.append($('<option>').val('-1').text('Seleccione una opción'));
                for (var i = 0; i < data.ciclos.length; i++) {
                    var ciclo = data.ciclos[i];
                    var opcion = $('<option>').val(ciclo.idciclo).text( ciclo.ciclo);
                    cmbCiclos.append(opcion);
                }
                break;
        }
    },
    
    consultarPeriodo: function () {
        var _this = $(this).val();
        $('#cmbPeriodos').empty();

        if (_this && _this !== '-1') {
            var dataEnviar = {
                idciclo: _this
            };
        if($('#cmbCiclo').val()!=38){
               movimientoControl.consultarPeriodoAnterior(dataEnviar, that.onConsultarPeriodoAnt);
        }
        }
    },

    /**
     * Se ejecuta cuando se selecciona un ciclo se carga el periodo anterior al activo
     * @param  {Object} data Respuesta del servidor
     * @returns {void}      
     */
    onConsultarPeriodoAnt: function (data) {
        switch (data.codigoRespuesta) {
            case 1:
                var cmbPeriodos = $('#cmbPeriodos');
                cmbPeriodos.append($('<option>').val('-1').text('Seleccione una opción'));
                for (var i = 0; i < data.periodos.length; i++) {
                    var periodo = data.periodos[i];
                    var opcion = $('<option selected=true>').val(periodo.idperiodo).text(periodo.idperiodo + ' - ' + periodo.periodo);
                    
                    cmbPeriodos.append(opcion);
                }
                break;
        }
    }
};
movimientoVista.init();