/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var that = null;
generarAgendavista = {
    init: function () {
        that = this;
        __app.vistaActual = generarAgendavista;
        __app.controlActual = generarAgendaControl;
        $('#btnGenerarAgenda').on('click', that.confirmagenerarAgenda);

    },
    confirmagenerarAgenda: function () {
        
        if($("#cboContrato").val()=="")
        __dom.lanzarAlerta("Debe seleccionar un contrato", "Error");
        else 
        __dom.lanzarAlerta("Confirma generación de Agenda", "Confirmación", that.generarAgenda);
            

    },
    generarAgenda: function () {
        var Data = {};
        Data.contrato = $("#cboContrato").val();
        generarAgendaControl.generarAgenda(Data, that.mostrarResultados);
    },
    mostrarResultados: function (Data) {
        if (Data.codigoRespuesta == 1)
        {
            __dom.lanzarAlerta(Data.mensaje, " Resultado", that.recargar);
        } else
        {
            __dom.lanzarAlerta(Data.mensaje, " Error");
        }
    },
    recargar: function () {
        location.reload();
    }



}
generarAgendavista.init();



