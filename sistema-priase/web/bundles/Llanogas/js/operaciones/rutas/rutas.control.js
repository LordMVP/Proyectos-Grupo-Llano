/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var rutasControl = {
    consultarTerceros: function (datos, funcion) {
        __cnn.ajax({
            'url': '../../operaciones/suspensiones/consultar_terceros',
            'data': datos,
            'completado': funcion
        });
    },
    consultarSuscriptores: function (datos, funcion) {
        __cnn.ajax({
            'url': 'filtrar/consultar_suscriptores',
            'data': datos,
            'completado': funcion
        });
    },
    consultarRutasSin: function (datos, funcion) {
        __cnn.ajax({
            'url': 'filtrar/consultar_sinrutas',
            'data': datos,
            'completado': funcion
        });
    },
    grabarRutaSin: function (datos, funcion) {
        __cnn.ajax({
            'url': 'rutas/grabar_rutassin',
            'data': datos,
            'completado': funcion
        });
    },
    consultarRutasAsi: function (datos, funcion) {
        __cnn.ajax({
            'url': 'filtrar/consultar_asirutas',
            'data': datos,
            'completado': funcion
        });
    },
    grabarBDRutasSin: function (datos,sucess) {
         __cnn.ajax({
            'url': 'rutas/grabarbd_rutassin',
            'data': datos,
            'completado':sucess
        });
    },
    grabarBDRutasAsi: function (datos,sucess) {
        return  __cnn.ajax({
            'url': 'rutas/grabarbd_rutasasi',
            'data': datos,
            'completado':sucess
        });

    },
    grabarTrasladaRutas: function (datos, funcion) {
        __cnn.ajax({
            'url': 'rutas/grabarTrasladaRutas',
            'data': datos,
            'completado': funcion
        });
    },
    actualizaConsecutivoRuta: function (datos, success) {
        __cnn.ajax({
            'url': 'rutas/actualizaconsecutivoruta',
            'data': datos,
            'completado': success
        });
    }
};