var that = null;
var contactoGenerarVista = {
    dialogoActual: null,
    init: function () {
        that = this;
        $('#btnGenerar').on('click', that.confirmarEjecución);
        __dom.configurarCalendario('txtFechaInicial');
        __dom.configurarCalendario('txtFechaFinal');

//        
//        fesControl.consultarEjecucion(that.consultarEjecucion);
//        fesModelo.interval = setInterval(function () {
//            fesControl.consultarEjecucion(that.consultarEjecucion);
//        }, 20000);
//        that.consultarArchivos();
    },
    generarPlanoContacto: function () {
        var Data = {};
        Data.fechaInicial = $('#txtFechaInicial').val();
        Data.fechaFinal = $('#txtFechaFinal').val();
        contactoGenerarControl.generarPlano(Data, that.mostrarResultados);
    },
    confirmarEjecución: function () {

        if ($('#txtFechaFinal').val() != '' && $('#txtFechaInicial').val() != '') {
            __dom.lanzarAlerta('¿Está seguro de generar el archivo de Contacto',
                    'Ejectutar proceso',
                    that.generarPlanoContacto, true);
        } else
        {
            __dom.lanzarAlerta("No hay ciclos disponibles para procesar o no se ha ingresado el nombre del archivo");
        }
    },
    mostrarResultados: function (Data)
    {
        console.log(Data);
        if (Data.codigoRespuesta == 1) {
            that.cargarTablaArchivos(Data);
        } else {
            __dom.lanzarAlerta(Data.mensaje, "Atención");
        }
    },
    consultarArchivos: function () {
        contactoGenerarControl.consultarArchivos(that.cargarTablaArchivos);
    },
    cargarTablaArchivos: function (Data) {
        if (Data.codigoRespuesta == 1) {
            var Tbl = $("#tblArchivos");
            Tbl.dataTable({
                data: Data.archivos,
                columns: [
                    {'title': 'Archivo', data: 'nombre'},
                    {'title': 'Fecha', data: 'fecha'}
                ],
                fnRowCallback: function (fila, item, idx) {
                    fila = $(fila);
                    var link = $('<a>').text(item.nombre).attr({href: item.url});
                    fila.find('td:first').html('').append(link);
                },
                language: {
                    url: '/achagua/js/Spanish.json'
                },
                bSort: false,
                destroy: true
            });
        } else
        {
            __dom.lanzarAlerta(Data.mensaje, "Notificacion");
        }
    }
};
contactoGenerarVista.init();