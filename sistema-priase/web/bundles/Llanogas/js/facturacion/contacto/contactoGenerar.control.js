//Objeto para gestionar las peticiones AJAX Suscripción
var contactoGenerarControl = {
  
    //Consulta suscriptores que coincidan con los campos de búsqueda
    generarPlano: function (data, completado){
        __cnn.ajax({
            'url':'generar_plano_contacto/',
            'data':data,
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