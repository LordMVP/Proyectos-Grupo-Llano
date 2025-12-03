var that = null;
var fesVista = {
    dialogoActual: null,
    init: function () {
        that = this;
        $('#btnCargar').on('click', that.confirmarEjecución);
        fesControl.consultarEjecucion(that.consultarEjecucion);
        fesModelo.interval = setInterval(function () {
            fesControl.consultarEjecucion(that.consultarEjecucion);
        }, 20000);
        that.consultarArchivos();
    },
    generarPlanoFes: function () {
        var Data = {};
        Data.idCiclo = $('#cboCicloActivo').val();
        Data.nombreArchivo = $('#txtnombreArchivo').val();
        fesControl.generarPlano(Data, that.mostrarResultados);
    },
    confirmarEjecución: function () {

        if ($('#cboCicloActivo').val() != '' && $('#txtnombreArchivo').val() != '') {
            __dom.lanzarAlerta('¿Está seguro de generar el archivo plano Fes',
                    'Ejectutar proceso',
                    that.generarPlanoFes, true);
        } else
        {
            __dom.lanzarAlerta("No hay ciclos disponibles para procesar o no se ha ingresado el nombre del archivo");
        }
    },
    mostrarResultados: function (Data)
    {
        $('div#diverrores').hide();
        if (Data.codigoRespuesta == 1)
        {
            location.reload();
        } else if (Data.codigoRespuesta == 3)
        {
            $('div#diverrores').show();
            var Tbl = $("#tblerrores");
            Tbl.dataTable({
                data: Data.errores,
                columns: [
                    {'title': 'Suscripcion', data: 'idsuscripcion'},
                    {'title': 'Codigo anterior', data: 'codigoanterior'},
                    {'title': 'Factura', data: 'idfactura'},
                    {'title': 'Campo', data: 'campo'},
                    {'title': 'Valor', data: 'valor'},
                    {'title': 'Error', data: 'error'},
                    {'title': 'Fecha', data: 'fecha'}
                ],
                fnRowCallback: function (fila, item, idx) {
                    fila = $(fila);
                    var link = $('<a>').text(item.nombre).attr({href: item.url});
                },
                language: {
                    url: '/achagua/js/Spanish.json'
                },
                bSort: false,
                destroy: true
            });
        } else
        {
            __dom.lanzarAlerta(Data.mensaje, "Atención");
        }
    },
    /** Captura la respuesta del servidor cuando se consulta el proceso en ejecución
     * @param {object} data - Respuesta del servidor con información del progreso del proceso en ejecución
     * @returns {void}
     **/
    consultarEjecucion: function (data) {
        switch (data.codigoRespuesta) {
            case 0:
                clearInterval(fesModelo.interval);
                $('#divProcesando').hide();
                $('#divProceso').hide();
                that.consultarArchivos();
                $('#divCabecera').show();

                break;
            case 1:
                $('#divCabecera').hide();
                $('#divProcesando, #divCargando,#divProceso').show();
                fesModelo.ejecucion = [];
                $.each(data.datos, function (i, item) {
                    fesModelo.ejecucion.push(item);
                });
                fillTable("tblEjecucion", "formatoProceso", "fesModelo.ejecucion", "");
                break;
            case 3:
                clearInterval(fesModelo.interval);
                $('#divCabecera').show();
                if (Array.isArray(data.errores))
                    that.mostrarTablaErrores(data);


            default:
                $('#divProceso').hide();
                $('#divProcesando').hide();
                $('#cboCicloActivo').change();
                break;
        }
    },
    consultarArchivos: function () {
        fesControl.consultarArchivos(that.cargarTablaArchivos);
    },
    cargarTablaArchivos: function (Data) {
        if (Data.codigoRespuesta == 1) {
            var Tbl = $("#tblArchivos");
            Tbl.dataTable({
                data: Data.archivos,
                columns: [
                    {'title': 'Archivo', data: 'nombre'},
                    {'title': 'Fecha', data: 'fecha'},
                    {'title': 'Parametros', data: 'parametros'}
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
    },
    mostrarTablaErrores: function (Data) {
        $('div#diverroresproceso').show();
        var Tbl = $("#tblerroresproceso");
        Tbl.dataTable({
            data: Data.errores,
            columns: [
                {'title': 'Suscripcion', data: 'idsuscripcion'},
                {'title': 'Codigo anterior', data: 'codigoanterior'},
                {'title': 'Factura', data: 'idfactura'},
                {'title': 'Campo', data: 'campo'},
                {'title': 'Valor', data: 'valor'},
                {'title': 'Error', data: 'error'},
                {'title': 'Fecha', data: 'fecha'}
            ],
            fnRowCallback: function (fila, item, idx) {
                fila = $(fila);
                var link = $('<a>').text(item.nombre).attr({href: item.url});
            },
            language: {
                url: '/achagua/js/Spanish.json'
            },
            bSort: false,
            destroy: true
        });

    }
};
fesVista.init();