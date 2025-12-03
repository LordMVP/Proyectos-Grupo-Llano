var validacionControl = {
    validarSolicitud: function (data, success) {
        __cnn.ajax({
            url: 'validarcredito/',
            data: data,
            completado: success
        });
    },
    consultarTerceros: function (data, success) {
        __cnn.ajax({
            url: '../terceros/',
            data: data,
            completado: success
        });
    },
    imprimirFormulario: function (data, success) {
        __cnn.ajax({
            url: '../exportar/cargardatos/',
            data: data,
            completado: success
        });
    }
};
