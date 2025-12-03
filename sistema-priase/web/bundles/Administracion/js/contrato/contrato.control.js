/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var contratoControl = {
    consultarFinanciaciones: function (data, completado) {
        __cnn.ajax({
            'url': '../../../venta/financiacion/contrato/consultarEmpresas',
            'data': data,
            'completado': completado
        });
    },
    ejecutarContrato: function (idfirmas, completado) {
        __cnn.ajax({
            'url': '../../../venta/financiacion/contrato/generarcontrato',
            'data': idfirmas,
            'completado': completado
        });
    },
    
    consultarContrato: function (idfirmas, completado) {
        __cnn.ajax({
            'url': '../../../venta/financiacion/contrato/consultarcontrato',
            'data': idfirmas,
            'completado': completado
        });
    }
};