/**
 * @fileOverview Archivo de control de habilitar Ventas
 * @author oabaquero
 * @requires habilitarVenta.modelo.js
 * @version 1.0.0
 */

/** @namespace */

var habilitaVentaControl = {
   
   buscarComentarios: function (data,success){
       __cnn.ajax({
            url:'busca_comentarios/',
            data: data,
            completado:success       
        });
   },
   
   guardarVenta: function(data, success){
       __cnn.ajax({
          url:"graba_venta_historica/",
          data: data,
          completado:success
       });
   }
};