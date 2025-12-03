/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var firmasinstaladorasControl = {
    autocompletartercero: function (data, completado) {
        __cnn.ajax({
            url: 'terceros/',
            data: data,
            completado: completado
        });

    },
    consultarEmpleadosCertificaciones : function (data, completado){
        __cnn.ajax({
            url: 'empleadoscertificaciones/',
            data: data,
            completado: completado
        });
        
    } ,
    consultarCompetencias : function (completado){
        __cnn.ajax({
            url: 'consultacompetencias/',
            completado: completado
        });
        
    },
    grabar : function (Data,completado){
        __cnn.ajax({
            url: 'grabar/',
            data: Data,
            completado: completado
        });
    },
    consultarPermisosGrabar: function (Data,completado){
         __cnn.ajax({
            url: 'consultapermisosgrabar/',
            data: Data,
            completado: completado
        });
    }
}

