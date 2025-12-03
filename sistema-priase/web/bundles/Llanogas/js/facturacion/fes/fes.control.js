//Objeto para gestionar las peticiones AJAX Suscripción
var fesControl = {
  
    //Consulta suscriptores que coincidan con los campos de búsqueda
    generarPlano: function (data, completado){
        __cnn.ajax({
            'url':'generar_plano/',
            'data':data,
            'completado':completado
        });
    },
    consultarEjecucion: function (completado){
       
        __cnn.ajax({
            'url':'consultar_proceso/',
            'completado':completado
        });
    } ,
    consultarArchivos: function (completado){
        __cnn.ajax({
            'url':'consultar_archivos/',
            'completado':completado
        });
    }
};