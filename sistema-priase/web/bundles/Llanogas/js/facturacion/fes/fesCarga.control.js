//Objeto para gestionar las peticiones AJAX Suscripción
var fesCargaControl = {
  
    //Consulta suscriptores que coincidan con los campos de búsqueda
    invocarws: function (data,completado){
     $.ajax({
            type:'POST' ,
            contentType: 'application/x-www-form-urlencoded',
            url:'http://10.43.51.150/AchaguaServices/webresources/iniciaActualizacionFesComercial',
            data:data ,
            success: completado
            
        });
    },
    consultarEjecucion: function (completado){
        __cnn.ajax({
            'url':'consultar_proceso/',
            'completado':completado
        });
    } 
};
