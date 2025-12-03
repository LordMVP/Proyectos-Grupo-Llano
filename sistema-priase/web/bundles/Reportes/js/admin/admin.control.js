/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var adminControl = {
    cargarArchivo: function (idForm) {
        var url = $("#" + idForm).attr("action");   
        if($("#fileReport").val()==''){
            __dom.lanzarAlerta("Debe seleccionar un archivo para enviar","Archivo requerido");
            return;
        }
        var data = new FormData($("#" + idForm)[0]);
        $.ajax({
            type: "POST",
            url: url,
            data: data,
            contentType: false,
            processData: false,
            success: function (response) {
                __dom.ocultarCargador();
                if(response.error){
                    __dom.lanzarAlerta("No se logro cargar el archivo: "+response.message,"Error al cargar el archivo");
                }else{
                    __dom.lanzarAlerta("Archivo cargado con exito","Cargue exitoso");
                }
            }, beforeSend: function () {
                __dom.mostrarCargador();
            },error: function () {
                __dom.ocultarCargador();
                __dom.lanzarAlerta("Error al lazar la peticion de envio","Error de envio");
            }
        });
    }
};
