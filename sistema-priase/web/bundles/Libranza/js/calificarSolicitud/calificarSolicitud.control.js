var calificarControl = {
    actualizarSolicitud: function (data, success) {
        __cnn.ajax({
            url: 'actualizarinformacion/',
            data: data,
            completado: success
        });
    },
    consultarCalificaciones: function (data, success) {
        __cnn.ajax({
            url: 'obtener/calificacion/',
            data: data,
            completado: success
        });
    },
    calificarSolicitud: function (data, success) {
        __cnn.ajax({
            url: 'validarcalificacion/',
            data: data,
            completado: success
        });
    },
    validarSolicitud: function (data, success) {
        __cnn.ajax({
            url: 'validarcalificacion/',
            data: data,
            completado: success
        });
    },
    aprobarSolicitud: function (data, success) {
        __cnn.ajax({
            url: 'registrar/',
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