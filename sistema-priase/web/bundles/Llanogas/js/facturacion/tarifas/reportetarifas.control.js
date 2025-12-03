//Objeto para gestionar las peticiones AJAX Suscripción
var reporteTarifasControl = {
  
    //Consulta suscriptores que coincidan con los campos de búsqueda
    consultar: function (data, completado){
        __cnn.ajax({
            'url':'../reporte_tarifas/consultar/',
            'data':data,
            'completado':completado
        });
    } ,
    consultarXls: function (data, completado){
        $.ajax({
        
            url:'../reporte_tarifas/consultar_xls/',
            data:data,
            success:completado
        });
    }
};