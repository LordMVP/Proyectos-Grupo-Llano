/**
 * @fileOverview Archivo de control para generar gestión de cartera
 * @author AppFuture
 * @requires model.js
 * @version 1.0.0
 */

/** @namespace */
var generarControl = {
    /**
     * Consulta las suscripciones que coincidan con los parámetros de búsquedas.
     * @param  {object} data - Parámetros que se envían al servidor (idSuscripcion,idTipoSuscripcion,idTipoDocumento
     * idDocumento, morosidad, saldo)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor 
     * (generarGestionVista.consultarSuscripcionesCompleto)
     * @returns {void}
     */
    consultarSuscripciones: function (data, success) {
        return __cnn.ajax({
            'url': 'consultar_suscripciones',
            data: data,
            'async': true,
            completado: success
        });
    },
    /**
     * Consulta los municipios de un programa (autocomplete)
     * @param  {object} data - Parámetros que se envían al servidor (municipio)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor 
     * (generarGestionVista.mostrarResultadoMunicipio)
     * @returns {void}
     */
    consultarMunicipios: function (data, completado) {
        __cnn.ajax({
            'url': 'consultar_municipios',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta los documentos por tipo de documento
     * @param  {object} data - Parámetros que se envían al servidor (idTipoDocumento)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor (generarGestionVista.cargarDocumentosCompleto)
     * @returns {void}
     */
    consultarDocumentos: function (data, success) {
        __cnn.ajax({
            url: 'consultar_documentos',
            data: data,
            completado: success
        });
    },
    /**
     * Genera gestiones de cartera para las suscripciones
     * @param  {object} data - Parámetros que se envían al servidor (suscripciones)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor (generarGestionVista.generarGestionCompleto)
     * @returns {void}
     */
    generarGestion: function (data, success) {
        __cnn.ajax({
            url: 'grabar_gestion',
            data: data,
            completado: success
        });
    },
    /**
     * Consulta suscripción según su id específico
     * @param  {object} id - El id por el cuál se busca la factura
     * @returns {object} factura - Objeto con información de la suscripción 
     */
    obtenerSuscripcionPorId: function (id) {
        id = parseInt(id);
        for (var i = 0; i < generarModel.suscripciones.length; i++) {
            if (parseInt(generarModel.suscripciones[i].idsuscripcion) === id) {
                return generarModel.suscripciones[i];
            }
        }
        return null;
    }, 

    /** 
     * Obtiene las suscripciones que tienen el atributo 'Seleccionado'
     * @returns {array} Arreglo con id de factura y idsuscripcion de las filas selecscionadas en interfaz
     */
    obtenerSuscripcionesSeleccionada: function(){
        
        var suscripciones = [];
        for (var i = 0; i < generarModel.suscripciones.length; i++) {
            var suscrip = generarModel.suscripciones[i];
            if (suscrip.seleccionado) {
                var facturas = [];
                for(var f = 0; f < suscrip.facturas.length; f++){
                    facturas.push({
                        idfactura: suscrip.facturas[f].idfactura
                    });
                }
                suscripciones.push({
                    facturas: facturas,
                    idsuscripcion: suscrip.idsuscripcion
                });
            }
        }
        return suscripciones;
    }
};