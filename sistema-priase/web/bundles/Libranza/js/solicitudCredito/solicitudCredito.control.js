var solicitudControl = {
    consultarCiudades: function (data, success) {
        __cnn.ajax({
            url: '../ciudades/',
            data: data,
            completado: success
        });
    },
    
    consultarCiudadesSyncrono: function (data) {
        return __cnn.ajax({
            url: '../ciudades/',
            data: data,
            async:false
        });
    },
    
    insertarInformacion: function (data, success) {
        __cnn.ajax({
            url: 'insertar/',
            data: data,
            completado: success
        });
    },
    consultarDepartamentos: function (data, success) {
        __cnn.ajax({
            url: '../departamentos/',
            data: data,
            completado: success
        });
    },
    consultarMunicipios: function (data, success) {
        __cnn.ajax({
            url: '../municipios/',
            data: data,
            completado: success
        });
    },
    consultarBarrios: function (data, success) {
        __cnn.ajax({
            url: '../barrios/',
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
    },
    eliminarArchivo: function (data, success) {
        __cnn.ajax({
            url: 'eliminaradjunto/',
            data: data,
            completado: success
        });
    },
    consultarArchivoPorId: function(id){
        id = parseInt(id);
        for(var i = 0; i < that.archivos.length; i++){
            if(id === parseInt(that.archivos[i].idarchivo)){
                return {archivo: that.archivos[i], indice: i};
            }
        }
    },
    validarExistenciaActividadEconomica: function(array, id, index){
        var cont = 0;
        for(var i = 0; i < index; i++){
          var actividad = array[i];
          if(parseInt(actividad.actividadeconomica) === parseInt(id)){
              cont++;
          }
        }
        return cont;
    }
};