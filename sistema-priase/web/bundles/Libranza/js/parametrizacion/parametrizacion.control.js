var parametrizacionControl = {
    guardarFormulario: function (data, success) {
        __cnn.ajax({
            url: 'formulario/crear/',
            data: data,
            completado: success
        });
    },
    consultarFormularioProducto: function(data, completado) {
        __cnn.ajax({
            url: 'formularios/',
            data: data, 
            completado: completado
        });
    },
    consultarVariables: function(data, success){
        __cnn.ajax({
            url: 'variables/',
            data: data,
            completado: success
        });
    },
    consultarFunciones: function(success){
        __cnn.ajax({
            url: 'funciones_variables/',
            completado: success
        });
    },
    guardarVariables: function(data, success){
        __cnn.ajax({
            url: 'formulario/crear/parametrizacion/',
            data: data,
            completado: success
        });
    }
};