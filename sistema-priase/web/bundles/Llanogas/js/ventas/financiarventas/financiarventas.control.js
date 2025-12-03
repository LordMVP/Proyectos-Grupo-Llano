/**
* @fileOverview Archivo de control de financiación de ventas
* @author Angélica Gómez
* @requires financiarventas.modelo.js
* @version 1.0.0
*/

/** @namespace */
var financiarControl ={
    /**
     * Consulta el consecutivo correspondiente en la base de datos de la financiación
     * @param  {function} success - Función invocada cuando cargan datos desde servidor (Función anónima)
     * @returns {void}
     */
    consultarIdFinanciacion: function(success){
        __cnn.ajax({
            url:'../../cartera/generarfinanciacion/secuencia',
            completado:success
        });
    },
    /**
     * Consulta datos básicos de los terceros que coincidan
     * @param  {object} data - Los parámetros que se envían al servidor (nombre)
     * @param  {function} completado - Función invocada cuando cargan datos desde 
     * servidor (financiarVista.mostrarResultadoTercero)
     * @returns {void}
     */
    consultarTerceros: function(data, completado) {
        __cnn.ajax({
            'url': '../../operaciones/suspensiones/consultar_terceros',
            'data': data,
            'completado': completado
        });
    },

    /**
     * Carga información de las propiedades, suscripción y detalle de venta que coincidan 
     * con los parámetros de búsquedas.
     * @param  {object} data - Parámetros que se envían al servidor (estado,nombretercero
     * cedula, numeroventa, idepropiedad,idsuscripcion,fechainicio. fechafin)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor 
     * (financiarVista.onConsultarVentaCompleto)
     * @returns {void}
     */
    consultarSuscripcion: function(data, completado) {
        __cnn.ajax({
            'url': '../buscar/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Muestra información de una venta con id específico
     * @param  {int} id - El número de id que se compara
     * @returns {object} venta - Objeto JSON con información de la venta y suscripción.
     */
    consultarVentaPorId: function(id){
        for (var i = 0; i< financiarModelo.informacionVenta.length; i++) {
            var venta  = financiarModelo.informacionVenta[i];
            if (venta.infoventa.venta.idventa == id) {
                return venta[i];
                break;
            }
        };
    },
    /**
     * Consulta la factura relacionada con la venta que se haya buscado
     * @param  {object} data - Parámetros que se envían al servidor (idventa)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor 
     * (financiarVista.onConsultarFacturaCompleto)
     * @returns {void}
     */
    consultarFacturas: function(data, completado) {
        __cnn.ajax({
            'url': 'conceptos/',
            'data': data,
            'completado': completado
        });
    },

    /**
     * Consulta valor financiable y valor no financiable de una factura
     * @param  {object} data - Parámetros que se envían al servidor (idfactura)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor 
     * (financiarVista.onConsultarDetallesFacturaCompleto)
     * @returns {void}
     */
    consultarDetallesFactura:function(data, success){
        __cnn.ajax({
            url:'../../cartera/generarfinanciacion/consultar_facturas_detalles',
            data:data,
            completado:success
        });
    },

    /**
     * Consulta datos básicos de los terceros que pueden estar solicitando la financiación
     * @param  {object} data - Los parámetros que se envían al servidor (nombre)
     * @param  {function} completado - Función invocada cuando cargan datos desde 
     * servidor (financiarVista.mostrarResultado)
     * @returns {void}
     */
    buscarSolicitante:function(data, success){
        __cnn.ajax({
            url:'../../operaciones/suspensiones/consultar_terceros',
            data:data,
            completado:success
        });
    },

    /**
     * Consulta datos básicos de las entidades financieras
     * @param  {object} data - Los parámetros que se envían al servidor (nombre)
     * @param  {function} completado - Función invocada cuando cargan datos desde 
     * servidor (financiarVista.mostrarResultadoBanco)
     * @returns {void}
     */
    buscarBanco:function(data, success){
        __cnn.ajax({
            url:'../../cartera/generarfinanciacion/consultar_bancos   ',
            data:data,
            completado:success
        });
    },
    /**
     * Elimina un archivo que haya sido subido al servidor
     * @param  {int} idarchivo - id del archivo que se desea eliminar
     * @param  {function} success - Función invocada cuando cargan datos desde servidor 
     (financiarVista.funcionanónima)
     * @returns {void}
     */ 
    eliminarArchivo:function(data, success){
        __cnn.ajax({
            url:'../eliminar_adjunto/',
            data:data,
            completado:success
        });
    },
    /** Consulta liquidaciones según el tipo de documento
     * @param  {int} data - Parámetros que se envían al servidor (idtipodocumento)
     * @param  {function} success - Función invocada cuando cargan datos desde servidor 
     (financiarVista.onConsultarLiquidacionCompleto)
     * @returns {void}
     */ 
    consultarLiquidacion:function(data, success){
        __cnn.ajax({
            url:'liquidaciones/',
            data:data,
            completado:success
        });
    },
    /**
     * Guarda todos los datos de la financiación digitada.
     * @param  {object} data - Los parámetros que se envían al servidor (idsuscripcion, idliquidacion)
     * @param  {function} completado - Función invocada cuando cargan datos desde 
     * servidor (financiarVista.guardarFinanciacionCompleta)
     * @returns {void}
     */
    guardarFinanciacion:function(data, success){
        __cnn.ajax({
            url:'grabar/',
            data:data,
            completado:success
        });
    },
    /** Graba los archivos de la venta 
     * @param  {int} data - Lista de identificador de archivos subidos 
     * @param  {function} success - Función invocada cuando cargan datos desde servidor 
     * @returns {void}
     */
    grabarArchivos: function (data, success) {
        __cnn.ajax({
            url: 'actualizar_adjuntos/',
            data: data,
            completado: success
        });
    },
    /**
     * Consulta tasa de interés por liquidación seleccionada
     * @param  {object} data - Los parámetros que se envían al servidor (idliquidacion)
     * @returns {object} ajax - Respuesta del servidor
     */
    consultarInteres: function (data, success) {
        return __cnn.ajax({
            'url': '../../cartera/generarfinanciacion/obtener/interes',
            data: data,
            completado: success
        });
    },
    /**
     * Consulta los conceptos financiables de un liquidación
     * @param  {object} data - Los parámetros que se envían al servidor (idliquidacion, idventa)
     * @param {function} success Función de Callback
     * @returns {object} ajax - Respuesta del servidor
     */
    consultarConceptoLiquidacion: function (data, success) {
        return __cnn.ajax({
            'url': 'conceptos_liquidacion/',
            data: data,
            completado: success
        });
    },
    
    /**
     * Consulta los conceptos financiables de un liquidación
     * @param  {object} data - Los parámetros que se envían al servidor (idliquidacion, idventa)
     * @param {function} success Función de Callback
     * @returns {object} ajax - Respuesta del servidor
     */
    consultarConceptosFinanciacion: function (data) {
        return __cnn.ajax({
            'url': 'conceptos_liquidacion/',
            data: data,
            async: false
        });
    },
    consultarInteresFinanciacion: function (data) {
        return __cnn.ajax({
            'url': '../../cartera/generarfinanciacion/obtener/interes',
            data: data,
            async: false
        });
    },
    
    /**
     * Consulta tasa de interés por liquidación seleccionada
     * @param  {object} data - Los parámetros que se envían al servidor (idliquidacion)
     * @returns {object} ajax - Respuesta del servidor
     */
    consultarParentescos: function (completado) {
        __cnn.ajax({
            'url': 'obtener/parentescos/',
            'completado': completado
        });
    },
    /**
     * Obtiene las liquidaciones que han sido utilizadas
     * @param {int} indice
     * @returns {object} utilizada
     */
    consultarUtilizadasPorIndice: function(indice){
        for (var j = 0; j < financiarModelo.liquidacionesUtilizadas.length; j++) {
            var utilizada = financiarModelo.liquidacionesUtilizadas[j];
            if(parseInt(utilizada.posicion) === parseInt(indice)){
                return utilizada;
            }
        }
    },
    /**
     * Muestra información de una liquidación con id específico (Arreglo de liquidaciones usadas)
     * @param  {int} id - El número de id que se compara
     * @returns {object} venta - Objeto JSON con información de la liquidación.
     */
    consultarLiquidacionUtilizadaPorId: function(id){
        id = parseInt(id);
        for (var i = 0; i< financiarModelo.liquidacionesUtilizadas.length; i++) {
            var liq  = financiarModelo.liquidacionesUtilizadas[i];
            if (parseInt(liq.idliquidacion) === id) {
                return {liquidacion: liq, indice: i};
            }
        };
    },
    /**
     * Muestra información de una liquidación con id específico (Todas las liquidaciones bsucadas)
     * @param  {int} id - El número de id que se compara
     * @returns {object} venta - Objeto JSON con información de la liquidación.
     */
    consultarLiquidacionPorId: function(id){
        id = parseInt(id);
        for (var i = 0; i< financiarModelo.liquidaciones.length; i++) {
            var liq  = financiarModelo.liquidaciones[i];
            if (parseInt(liq.idliquidacion) === id) {
                return liq;
            }
        };
    },
    
    /**
     * Se consulta los conceptos de una liquidación
     * @param {int} id
     * @returns {pbject} Conceptos por liquidación
     */
    consultarConceptosPorLiquidacion: function(id){
        id = parseInt(id);
        for(var i = 0; i < financiarModelo.conceptoLiquidacion.length; i++){
            var conceptos = financiarModelo.conceptoLiquidacion[i];
            if(parseInt(conceptos.idliquidacion) === id){
                return {info: conceptos, index: i};
            }
        }
    },
    /**
     * Se busca un concepto en una arreglo según su id
     * @param {array} array - Arreglo de conceptos de una liquidación
     * @param {int} id - Identificador del concepto que se está buscando
     * @returns {object} Información del concepto
     */
    consultarConceptosPorId: function(array, id){
        id = parseInt(id);
        for(var i = 0; i < array.length; i++){
            if(parseInt(array[i].idconcepto) === id){
                return array[i];
            }
        }
    },
    
    consultarConceptoPorIdyIdLiquidacion: function(idliquidacion, idconcepto){
        var conceptos = financiarControl.consultarConceptosPorLiquidacion(idliquidacion);
        if (conceptos) {
            var arrayConceptos = conceptos.info.conceptos;
            return financiarControl.consultarConceptosPorId(arrayConceptos, idconcepto);
        }
    
    },
    /**
     * Se guarda la información necesaria para exportar un archivo
     */
    cargarInformacionContrato: function(data, success){
       __cnn.ajax({
            'url': 'informacion_autorizacion/',
            data: data,
            completado: success
        }); 
    },
    /** 
     * Muestra información de un archivo con id específico
     * @param  {int} id - El número de id que se compara
     * @returns {object} infoConcepto - Objeto JSON con información del archivo y posición en el arreglo de archivos.
     */
    consultarArchivoPorId: function (id) {
        for (var i = 0; i < financiarModelo.archivos.length; i++) {
            var archivo = financiarModelo.archivos[i];
            if (parseInt(archivo.idarchivo) === parseInt(id)) {
                return infoArchivo = {archivo: archivo, indice: i};
            }
        }
    }, 
    
    /**
     * Consulta el siguiente número de pagaré disponible
     * @param {function} success - Función anónima
     * @returns {void}
     */
    consultarNumeroPagare: function(data, success){
        __cnn.ajax({
           url: 'generarfinanciacion/generarnumeropagare/',
           data: data,
           completado: success
        });
    },
};