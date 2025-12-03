/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
generarAgendaControl = {
    generarAgenda: function (data,completado) {
        __cnn.ajax({
            url: 'procesar_Agenda/',
            data: data,
            completado: completado
        });
        return;
    }
}


