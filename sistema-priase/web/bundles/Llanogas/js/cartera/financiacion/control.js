/**
* @fileOverview Archivo de control de financiación
* @author AppFuture
* @requires model.js
* @version 1.0.0
*/

/** @namespace */
var controlFinanciacion = {
    
    /**
     * Consulta las suscripciones que coincidan con los parámetros de búsquedas.
     * @param  {object} data - Parámetros que se envían al servidor (idSuscripcion,codigoAnterior)
     * @param  {function} success - Función invocada cuando cargan datos desde servidor 
     * (generarFinanciacionVista.consultaSuscripcionCompleto)
     * @returns {void}
     */
    consultarSuscripciones:function(data, success){
        __cnn.ajax({
            url:'generarfinanciacion/filtrar',
            data:data,
            completado:success            
        });
    },
    
    /**
     * Consulta las facturas de la suscripción seleccionada
     * @param  {object} data - Parámetros que se envían al servidor (idsuscripcion,iddocumento, idtipodocumento)
     * @param  {function} success - Función invocada cuando cargan datos desde servidor 
     * (generarFinanciacionVista.cargarFacturasCompleto)
     * @returns {void}
     */
    consultarFacturas:function(data, success){
        __cnn.ajax({
            url:'generarfinanciacion/consultar_facturas',
            data:data,
            completado:success
        });
    },
    
    /**
     * Guarda la nueva financiación
     * @param  {object} data - Parámetros que se envían al servidor (idfinanciacion,idsuscripcion,iddocumento, idtipodocumento,
     * idciclo, idperiodo, idsolicitante, identidad, numerocuotas, idliquidacion, valortotalfinanciar, valorfinanciable, archivos, facturas)
     * @param  {function} success - Función invocada cuando cargan datos desde servidor 
     * (generarFinanciacionVista.guardarFinanciacionCompleta)
     * @returns {void}
     */
    guardarFinanciacion:function(data, success){
        __cnn.ajax({
            url:'generarfinanciacion/guardar',
            data:data,
            modal: true,
            completado:success
        });
    },
    
    /**
     * Valida conceptos financiables y no financiables de acuerdo a tipo liquidación y facturas seleccionadas
     * @param  {object} data - Parámetros que se envían al servidor (idLiquidacion,facturas)
     * @param  {function} success - Función invocada cuando cargan datos desde servidor 
     * (generarFinanciacionVista.validarConceptosCompleto)
     * @returns {void}
     */
    validarConceptos:function(data, success){
        __cnn.ajax({
            url:'generarfinanciacion/validar_conceptos',
            data:data,
            completado:success
        });
    },

    /**
     * Consulta datos básicos de los terceros que pueden estar solicitando la financiación
     * @param  {object} data - Los parámetros que se envían al servidor (nombre)
     * @param  {function} success - Función invocada cuando cargan datos desde 
     * servidor (generarFinanciacionVista.mostrarResultado)
     * @returns {void}
     */
    buscarSolicitante:function(data, success){
        __cnn.ajax({
            url:'../operaciones/suspensiones/consultar_terceros',
            data:data,
            completado:success
        });
    },
    /**
     * Consulta datos básicos de las entidades financieras
     * @param  {object} data - Los parámetros que se envían al servidor (nombre)
     * @param  {function} success - Función invocada cuando cargan datos desde 
     * servidor (generarFinanciacionVista.mostrarResultadoBanco)
     * @returns {void}
     */
    buscarBanco:function(data, success){
        __cnn.ajax({
            url:'generarfinanciacion/consultar_bancos   ',
            data:data,
            completado:success
        });
    },
    /**
     * Consulta valor financiable y valor no financiable de una factura
     * @param  {object} data - Parámetros que se envían al servidor (idfactura)
     * @param  {function} success - Función invocada cuando cargan datos desde servidor 
     * (generarFinanciacionVista.onConsultarDetallesCompleto)
     * @returns {void}
     */
    consultarDetallesFactura:function(data, success){
        __cnn.ajax({
            url:'generarfinanciacion/consultar_facturas_detalles',
            data:data,
            completado:success
        });
    },

    /**
     * Consulta la factura con id específico
     * @param  {object} id - El id por el cuál se busca la factura
     * @returns {object} factura - Objeto con información de la factura
     */
    obtenerFacturaPodId:function(id){
        id = parseInt(id);
        if (financiacionModel.facturas!==null && financiacionModel.facturas.length > 0) {
            for (var i = 0; i < financiacionModel.facturas.length; i++) {
                var factura = financiacionModel.facturas[i];
                factura.idfactura = parseInt(factura.idfactura);
                if (factura.idfactura === id) {
                    return factura;
                };
            };
        }else{
            return null;
        }
    },
    /**
     * Consulta las liquidaciones por tipo documento y documento
     * @param  {object} data - Parámetros que se envían al servidor (iddocumento,idtipodocumento)
     * @param  {function} success - Función invocada cuando cargan datos desde servidor 
     * (generarFinanciacionVista.onConsultarLiquidacionCompleto)
     * @returns {void}
     */
    consultarLiquidacion:function(data, success){
        __cnn.ajax({
            url:'generarfinanciacion/consultar_liquidaciones',
            data:data,
            completado:success
        });
    },
    /**
     * Consulta los documentos por tipo documento
     * @param  {object} data - Parámetros que se envían al servidor (idsuscripcion,idtipodocumento)
     * @param  {function} success - Función invocada cuando cargan datos desde servidor (Función anónima)
     * @returns {void}
     */
    consultarDocumento:function(data, success){
        __cnn.ajax({
            url:'generarfinanciacion/consultar_documentos',
            data:data,
            completado:success
        });
    },
    /**
     * Elimina un archivo que haya sido subido al servidor
     * @param  {int} data - id del archivo que se desea eliminar (idarchivo)
     * @param  {function} success - Función invocada cuando cargan datos desde servidor (Función anónima)
     * @returns {void}
     */ 
    eliminarArchivo:function(data, success){
        __cnn.ajax({
            url:'generarfinanciacion/eliminar_adjunto',
            data:data,
            completado:success
        });
    },
    /** 
     * Muestra información de un archivo con id específico
     * @param  {int} id - El número de id que se compara
     * @returns {object} infoConcepto - Objeto JSON con información del archivo y posición en el arreglo de archivos.
     */
    consultarArchivoPorId: function (id) {
        for (var i = 0; i < financiacionModel.archivos.length; i++) {
            var archivo = financiacionModel.archivos[i];
            if (parseInt(archivo.idarchivo) === parseInt(id)) {
                return infoArchivo = {archivo: archivo, indice: i};
            }
        }
    },
    /**
     * Consulta el porcentaje de interés según la liquidación seleccionada
     * @param  {int} data - Parámetros que se envían al servidor (idliquidacion)
     * @param  {function} success - Función invocada cuando cargan datos desde servidor (Función anónima)
     * @returns {void}
     */ 
    consultarInteres:function(data, success){
        __cnn.ajax({
            url:'generarfinanciacion/obtener/interes',
            data:data,
            completado:success
        });
    },
    /**
     * Consulta tasa de interés por liquidación seleccionada
     * @param  {object} data - Los parámetros que se envían al servidor (idliquidacion)
     * @returns {object} ajax - Respuesta del servidor
     */
    consultarParentescos: function (completado) {
        __cnn.ajax({
            'url': '../ventas/financiacion/obtener/parentescos/',
            'completado': completado
        });
    },
    /** Graba los archivos de una financiación
     * @param  {int} data - Lista de identificador de archivos subidos 
     * @param  {function} success - Función invocada cuando cargan datos desde servidor 
     * @returns {void}
     */
    grabarArchivos: function (data, success) {
        __cnn.ajax({
            url: 'generarfinanciacion/actualizar_adjuntos/',
            data: data,
            completado: success
        });
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

    /**
     * Consulta los días del período seleccionado
     * @param  {Object} data    Los datos que se envían al servidor, con la información del período
     * @param  {function} success Función de callback que se ejecuta con la respuesta del servidor.
     * @returns {void}
     */
    consultarDiasPeriodo: function(data, success){
        __cnn.ajax({
            url: 'consultas_dias/',
            data:data,
            completado: success
        });
    },
    
    /**
     * Consulta las facturas de la suscripción seleccionada
     * @param  {object} data - Parámetros que se envían al servidor (idsuscripcion,iddocumento, idtipodocumento)
     * @param  {function} success - Función invocada cuando cargan datos desde servidor 
     * (generarFinanciacionVista.cargarFacturasCompleto)
     * @returns {void}
     */
    consultarFacturaDescarteConcepto: function(data, success){
        __cnn.ajax({
            url:'generarfinanciacion/consultar_facturasDescarte',
            data:data,
            completado:success
        });
    }
    
};

