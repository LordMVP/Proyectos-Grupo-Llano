var that = null;

var fesCargaVista = {
    dialogoActual: null,
    init: function () {
        that = this;
        $('#btnCargar').on('click', that.cargaLoginIniciar);
        $('#btnDetenerProceso').on('click', that.cargaLoginDetener);
        fesCargaControl.consultarEjecucion(that.consultarEjecucion);
        fesCargaModelo.interval = setInterval(function () {
            fesCargaControl.consultarEjecucion(that.consultarEjecucion);
        }, 20000);

    },
    cargaLoginIniciar: function () {
        fesCargaModelo.accion = 1;
        that.cargaLogin();
    },
    cargaLoginDetener: function () {
        fesCargaModelo.accion = 0;
        that.cargaLogin();
    },
    cargaLogin: function () {
        var divFiltro = $('#divlogin');
        that.dialogoActual = divFiltro.dialogo({
            modal: true,
            width: 400,
            title: 'Autenticación Proceso',
            buttons: {
                Procesar: that.confirmarEjecucion
            }
        });
    },
    procesarFes: function () {
//        fesCargaControl.invocarws(that.mostrarResultados);
       
        var Data = {};
        Data.usuario = fesCargaModelo.usu_ideregistro;
        console.log("Usuario ideregistro "+fesCargaModelo.usu_ideregistro);
        var encript = $().crypt({
            method: 'md5',
            source: $('#key').val()
        });
        Data.key = encript;
        Data.accion = fesCargaModelo.accion;
        Data.idacceso = fesCargaModelo.idacceso ;
        Data.idempresa = fesCargaModelo.idempresa ;
        Data.idprograma = fesCargaModelo.idprograma ;
        Data
        fesCargaControl.invocarws(Data, that.mostrarResultados);

    },
    confirmarEjecucion: function () {
            that.dialogoActual.dialog('close');
            __dom.lanzarAlerta('¿Está seguro de Iiniciar el proceso de Carga de la Información Fes',
                    'Ejectutar proceso',
                    that.procesarFes, true);
    },
    confirmarCancelacion: function () {

            __dom.lanzarAlerta('¿Está seguro de cancelar el proceso de Carga de la Información Fes',
                    'Cancelar proceso',
                    that.procesarFes, true);
    },
    mostrarResultados: function (Data)
    {
        if (Data == "1")
        {
            __dom.lanzarAlerta(" Se proceso correctamente la transacción  ", "Respuesta",that.recargar, true);
        } else if (Data =="-1")  {
            __dom.lanzarAlerta(" Error Procesando petición , Ya hay un proceso en ejecución ", "Error",that.recargar,true);
           } else {
            __dom.lanzarAlerta(" Error Procesando petición , valida credenciales de Acceso Suministrada ", "Error");
               
           } 
               
    },
    recargar : function()
    {
            location.reload();
        
    },
    
    /** Captura la respuesta del servidor cuando se consulta el proceso en ejecución
     * @param {object} data - Respuesta del servidor con información del progreso del proceso en ejecución
     * @returns {void}
     **/
    consultarEjecucion: function (data) {
        //alart("RESULTADO CONSULTA EJECUCION "+ data.codigoRespuesta)
        fesCargaModelo.usu_ideregistro = data.usu_ideregistro;
        fesCargaModelo.idempresa = data.idempresa;
        fesCargaModelo.idacceso = parseInt(data.idacceso);
        fesCargaModelo.idprograma = data.idprograma;
        switch (data.codigoRespuesta) {
            case 0:
                clearInterval(fesCargaModelo.interval);
                $('#divProcesando').hide();
                $('#divProceso').hide();
                $('#divCabecera').show();
                break;
            case 1:
                $('#divCabecera').hide();
                $('#divProcesando, #divCargando,#divProceso').show();
                fesCargaModelo.ejecucion = [];

                $.each(data.datos, function (i, item) {
                    fesCargaModelo.ejecucion.push(item);
                });

                fillTable("tblEjecucion", "formatoProceso", "fesModelo.ejecucion", "");
                break;
            default:
                $('#divProceso').hide();
                $('#divProcesando').hide();
                $('#cboCicloActivo').change();
                break;
        }
    }
};
fesCargaVista.init();