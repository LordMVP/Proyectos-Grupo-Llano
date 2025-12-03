/**
* @fileOverview Archivo de control de Gestionar Suscripción
* @author jeissonBarriga
* @requires gestionarsuscripcion.control.js
* @requires gestionarsuscripcion.modelo.js
* @version 1.0.0
*/
var gestionarsuscriptorControl = {
    
    consultarDetalleSuscripcion: function(data, completado) {
        __cnn.ajax({
            'url': 'detalle/',
            'data': data,
            'completado': completado
        });
    },
    //consulta en la tabla de terceros, para seleccionar a la persona encarga de hacer la solicitud de la financiación REUTILIZADA LMR
    consultarTercerosAutocompletar: function(data, completado) {
        __cnn.ajax({
            'url': '../operaciones/suspensiones/consultar_terceros',
            'data': data,
            'completado': completado
        });
    },
    //Consulta suscriptores que coincidan con los campos de búsqueda REUTILIZADA LMR
    consultarConvenios: function(data, completado) {
        __cnn.ajax({
            'url': 'gestionar_suscriptor/buscar/',
            'data': data,
            'completado': completado
        });
    },
    //consulta una o varias suscripciones en funcion de la combinación de campos de búsqueda
    consultarParametros: function(data, completado) {
        __cnn.ajax({
            'url': 'gestionar_suscriptor/buscar/',
            'data': data,
            'completado': completado
        });
    },
    consultarSuscriptor : function(data, completado) {
        __cnn.ajax({
            'url': '../suscripcion/gestionar_suscripcion/filtrar_suscriptor/',
            'data': data,
            'completado': completado
        });
    },
    
    getInformacionDetalleSuscripciones: function(data) {
       var resultado =  __cnn.ajax({
            'url': '../suscripcion/gestionar_suscripcion/detalle/',
            'data': data,
            'async' : false 
        });
        return resultado ;
    },
    //consulta una o varias suscripciones en funcion de la combinación de campos de búsqueda
    consultarSuscripcion: function(data, completado) {
        __cnn.ajax({
            'url': '/buscar',
            'data': data,
            'completado': completado
        });
    },
  
    grabar: function(data, completado) {
        __cnn.ajax({
            'url': 'gestionar_suscriptor/grabar/',
            'data': data,
            'completado': completado
        });
    }
};