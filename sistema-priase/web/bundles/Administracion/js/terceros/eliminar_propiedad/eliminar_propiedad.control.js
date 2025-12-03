/**
 */

/** @namespace */
var eliminarPropiedadControl = {
    buscarTercero: function (data, success) {
        __cnn.ajax({
            url: '../cambio_propiedad/autocompletar_tercero/',
            data: data,
            completado: success
        });
    },
    buscarMunicipio: function (data, success) {
        __cnn.ajax({
            url: '../cambio_propiedad/filtrar/consultar_municipios/',
            data: data,
            completado: success
        });
    }
    ,
    buscarBarrio: function (data, success) {
        __cnn.ajax({
            url: '../cambio_propiedad/filtrar/consultar_barrios/',
            data: data,
            completado: success
        });
    },
    filtrarTerceroPropiedad: function (data, success) {
        __cnn.ajax({
            url: '../eliminar_propiedad/consultar_terceropropiedad/',
            data: data,
            completado: success
        });
    },
    filtrarPropiedad: function (data, success) {
        __cnn.ajax({
            url: '../eliminar_propiedad/consultar_propiedad/',
            data: data,
            completado: success
        });
    },
    grabarPropiedad: function (data, success) {
        __cnn.ajax({
            url: '../eliminar_propiedad/grabar_propiedad/',
            data: data,
            completado: success
        });
    }

};
