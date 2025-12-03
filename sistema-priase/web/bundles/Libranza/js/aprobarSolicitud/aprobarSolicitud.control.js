var aprobacionControl = {
    aprobarSolicitud: function (data, success) {
        __cnn.ajax({
            url: 'aprobarsolicitud/',
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
    }
};