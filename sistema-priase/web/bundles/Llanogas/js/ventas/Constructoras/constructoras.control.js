var constructorasControl = {
    
    consultarProyectosPadre: function (data, completado){
        __cnn.ajax({
            'url': '../consultar_proyectos_infra/',
            'data': data,
            'completado': completado
        });
        return;
    },    
    consultarSuscriptor: function (data, completado) {
        __cnn.ajax({
            'url': '../consultar_suscriptor/',
            'data': data,
            'completado': completado
        });
        return;
    },
    cargarMunipios: function () {
        var resultado = __cnn.ajax({
            'url': '/filtrar/consultar_municipios/',
            'async': false,
            'background': true
        });
        return resultado;
    },
    buscarMunicipio: function (data, success) {
        __cnn.ajax({
            url: 'filtrar/consultar_municipios/',
            data: data,
            completado: success
        });
    }
    ,
    buscarBarrio: function (data, success) {
        __cnn.ajax({
            url: 'filtrar/consultar_barrios/',
            data: data,
            completado: success
        });
    },
    buscarTercero: function (data, success) {
        __cnn.ajax({
            url: '../constructoras/terceros/',
            data: data,
            completado: success
        });
    
    },
    buscarTerceroAseguradora: function (data, success) {
        __cnn.ajax({
            url: 'filtrar/consultar_tercero_aseguradora/',
            data: data,
            completado: success
        });
    },
    consultarContratos: function (data, success) {
        __cnn.ajax({
            url: 'filtrar/consultar_contratos/',
            data: data,
            completado: success
        });

    },
    consultarContactos: function (data, success) {
        __cnn.ajax({
            url: 'filtrar/consultar_contactos/',
            data: data,
            completado: success
        });

    },
    consultarTercerosSuscriptor: function (data, success) {
        __cnn.ajax({
            url: 'filtrar/consultar_tercero_suscriptor/',
            data: data,
            completado: success
        });

    },
    grabar: function (data, success) {
        __cnn.ajax({
            url: 'grabar/',
            data: data,
            completado: success
        })
    
    },
    versuscripciones: function (data, success) {
       return __cnn.ajax({
            url: 'filtrar/consultar_suscripciones_suscriptor/',
            'async': false,
            data: data,
            completado: success
        });
    },
    autocompletarLiquidaciones: function (data, success) {
       __cnn.ajax({
            url: 'filtrar/consultar_liquidaciones/',
            data: data,
            completado: success
        });
    } ,
    consultaParametrosServiciosContratados: function (data, success) {
       __cnn.ajax({
            url: 'filtrar/consultar_parametros_servicios_contratados/',
            'async': true,
            data: data,           
            completado: success
            
            
        });
    } ,
     eliminarArchivo:function(data, success){
        __cnn.ajax({
            url:'eliminar_Archivo/',
            data:data,
            completado:success
        });
    },
    consultarPermisosGrabar: function (data,completado){
         __cnn.ajax({
            url: '../firmasinstaladoras/consultapermisosgrabar/',
            data:data,
            completado: completado
        });
    }
    ,
      actualizarInformacionContrato: function (data,completado){
        __cnn.ajax({
            url: 'filtrar/actualizar_informacion_contrato/',
            data:data,
            completado: completado
        });
    } ,
    /** recorre los tipo de uso 
     * @returns {void}
     */
    consultarTipoUsoRepetidos : function(tipoUso){
        return tipoUso.filter((v, i, a) => a.indexOf(v) === i);
    }, 
    
    indexSuscripcion : function (idsuscripcion){
        for( var i = 0; i < constructorasModel.suscripciones.length; i++){
            if(constructorasModel.suscripciones[i].susidesuscripcion == idsuscripcion){                
                return i;
            }
        }
        return -1;
    }    
};
