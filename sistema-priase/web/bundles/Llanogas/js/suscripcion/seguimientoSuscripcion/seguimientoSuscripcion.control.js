/**
* @fileOverview Archivo de control de generar documento de pago
* @author angelicaGomez
* @requires seguimientoSuscripcion.modelo.js
* @version 1.0.0
*/

/** @namespace */
var seguimientoControl ={
    
    /**
     * Consulta barrios por municipio
     * @param  {object} data - Los parámetros que se envían al servidor (idmunicipio)
     * @param  {function} completado - función de callback que se invoca cuando 
     * se cargan los datos desde el servidor (seguimientoVista.onConsultarBarriosCompleto)
     * @returns {void}
     */
    consultarBarrios: function(data, completado) {
        __cnn.ajax({
            'url': '../../suscripcion/gestionar_suscripcion/barrios/',
            'data': data,
            'completado': completado
        });
    },
    
    /**
     * Muestra datos básicos de los terceros que coincidan
     * @param  {object} data - Los parámetros que se envían al servidor (nombre)
     * @param  {function} completado - función de callback que se invoca cuando 
     * se cargan los datos desde el servidor (seguimientoVista.mostrarResultado)
     * @returns {void}
     */
    consultarTerceros:function(data, completado){
        __cnn.ajax({
            'url':'../../operaciones/suspensiones/consultar_terceros',
            'data':data,
            'completado':completado
        });
    },
   
   /**
     * Carga suscripciones que coincidan con los parámetros de búsquedas
     * @param  {object} data - Los parámetros que se envían al servidor 
     * (idmunicipio,idtercero,cedula,direccion,numerocatastral,idbarrio,
     * numeropropiedad,idsuscripcion,codigoanterior,idsuscripcion)
     * @param  {function} completado - función de callback que se invoca cuando 
     * se cargan los datos desde el servidor (seguimientoVista.mostrarResultado)
     * @returns {void}
     */
    consultarSuscripcion: function(data, completado) {
        __cnn.ajax({
            'url': '../../suscripcion/gestionar_suscripcion/buscar/',
            'data': data,
            'completado': completado
        });
    },
    
    /**
     * Muestra todos los datos de la susucripción que se haya elegido para buscar
     * @param  {object} data - Los parámetros que se envían al servidor (idsuscripcion)
     * @param  {function} completado - función de callback que se invoca cuando 
     * se cargan la respuesta dels servidor (seguimientoVista.onconsultarDetalleSuscripcionCompleto)
     * @returns {void}
     */
    consultarDetalleSuscripcion: function(data, completado) {
        __cnn.ajax({
            'url': '../../suscripcion/gestionar_suscripcion/detalle/',
            'data': data,
            'completado': completado
        });
    },
    
   
    /**
     * Consulta las facturas de la suscripción que están en el rango de fechas
     * @param  {object} data - Los parámetros que se envían al servidor (idsuscripcion, 
     * fechainicio, fechafin)
     * @param  {function} completado - función de callback que se invoca cuando 
     * se cargan los datos desde el servidor (seguimientoVista.onConsultarFacturaCompleto)
     * @returns {void}
     */
     consultarFactura: function (data, completado){
        __cnn.ajax({
            'url':'facturas/',
            'data':data,
            'completado':completado
        });
    },
   
    /**
     * Consulta las facturas de (provisión, reclasificacion, castigo y recuperación) de 
     * la suscripción que están en el rango de fechas
     * @param  {object} data - Los parámetros que se envían al servidor (idsuscripcion, 
     * fechainicio, fechafin)
     * @param  {function} completado - función de callback que se invoca cuando 
     * se cargan los datos desde el servidor (seguimientoVista.onConsultarProvisionCompleto)
     * @returns {void}
     */
     consultarProvision: function (data, completado){
        __cnn.ajax({
            'url':'facturasProvision/',
            'data':data,
            'completado':completado
        });
    },
    
     /**
     * Muestra detalles de la factura que se haya seleccionado
     * @param  {object} data - Los parámetros que se envían al servidor (idfactura)
     * @param  {function} completado - función de callback que se invoca cuando 
     * se cargan los datos desde el servidor (seguimientoVista.onConsultarConceptosFactura)
     * @returns {void}
     */
    consultarConcepto: function (data, completado){
        __cnn.ajax({
            'url':'facturas/conceptos/',
            'data':data,
            'completado':completado
        });
    },
     /**
     * Muestra detalles de la factura (Provision- Reclasificacion- Castigo)que se haya seleccionado
     * @param  {object} data - Los parámetros que se envían al servidor (idfactura)
     * @param  {function} completado - función de callback que se invoca cuando 
     * se cargan los datos desde el servidor (seguimientoVista.onConsultarConceptosFactura)
     * @returns {void}
     */
    consultarConceptoP: function (data, completado){
        __cnn.ajax({
            'url':'facturas/conceptosP/',
            'data':data,
            'completado':completado
        });
    },
     /**
     * Muestra detalles de la factura que se haya seleccionado
     * @param  {object} data - Los parámetros que se envían al servidor (idfactura)
     * @param  {function} completado - función de callback que se invoca cuando 
     * se cargan los datos desde el servidor (seguimientoVista.onConsultarConceptosFactura)
     * @returns {void}
     */
    consultarConcepto: function (data, completado){
        __cnn.ajax({
            'url':'facturas/conceptos/',
            'data':data,
            'completado':completado
        });
    },


    /**
     * Consulta los conceptos de una nota
     * @param{Object} data - Parámetros de filtro (idfactura)
     * @param{Function} completado - Función que se recibe la información
     */
    consultarConceptosNotasFactura: function (data, completado){
        __cnn.ajax({
            'url':'facturas/notas/conceptos/',
            'data':data,
            'completado':completado
        });
    },

    /**
     * Consulta los concepto a los que se le aplico un recaudo
     * @param data - Parámetros enviados al servidor {idrecaudo}
     * @param completado - Función que recibe la información
     */
    consultarConceptoRecaudo:function(data, completado){
        __cnn.ajax({
            'url':'recaudos/conceptos/',
            'data':data,
            'completado':completado
        });
    },
    /**
     * Muestra los recaudos que afectan a la factura
     * @param  {object} data - Los parámetros que se envían al servidor (idfactura)
     * @param  {function} completado - función de callback que se invoca cuando 
     * se cargan los datos desde el servidor (seguimientoVista.onConsultarRecaudoFacturaCompleto)
     * @returns {void}
     */
    consultarRecaudoFactura: function(data, completado){
        __cnn.ajax({
            'url':'facturas/recaudos/',
            'data':data,
            'completado':completado
        });
        
    },
    
    /**
     * Muestra los recaudos por suscripción en un rango de fechas
     * @param  {object} data - Los parámetros que se envían al servidor (idsuscripcion, 
     * fechainicio, fechafin)
     * @param  {function} completado - función de callback que se invoca cuando 
     * se cargan los datos desde el servidor (seguimientoVista.onConsultarRecaudosCompleto)
     * @returns {void}
     */
    consultarRecaudo: function(data, completado){
        __cnn.ajax({
            'url':'recaudos/',
            'data':data,
            'completado':completado
        });
    },
    
    /**
     * Muestra las facturas que han sido afectadas por un recaudo
     * @param  {object} data - Los parámetros que se envían al servidor (idrecaudo)
     * @param  {function} completado - función de callback que se invoca cuando 
     * se cargan los datos desde el servidor (seguimientoVista.onConsultarFacturaRecaudoCompleto)
     * @returns {void}
     */
    consultarFacturaRecaudo: function(data, completado){
        __cnn.ajax({
            'url': 'recaudos/facturas/',
            'data': data,
            'completado': completado
        });
    },
    
    /**
     * Muestra financiaciones según el id de suscripción en un rango de fechas
     * @param  {object} data - Los parámetros que se envían al servidor (idsuscripcion, 
     * fechainicio, fechafin)
     * @param  {function} completado - función de callback que se invoca cuando 
     * se cargan los datos desde el servidor (seguimientoVista.onConsultarFinanciacionCompleto)
     * @returns {void}
     */
    consultarFinanciaciones: function (data, completado){
        __cnn.ajax({
            'url': 'financiaciones/',
            'data': data,
            'completado': completado
        });
    },
    
    /**
     * Muestra las facturas....
     * @param  {object} data - Los parámetros que se envían al servidor (idfinanciacion, 
     * fechainicio, fechafin)
     * @param  {function} completado - función de callback que se invoca cuando 
     * se cargan los datos desde el servidor (seguimientoVista.onConsultarFacturaRecaudoCompleto)
     * @returns {void}
     */
    consultarFacturaFinanciaciones: function (data, completado){
        __cnn.ajax({
            'url': 'financiaciones/facturas/',
            'data': data,
            'completado': completado
        });
    },
    
    /**
     * Muestra las amortizaciones de una financiación.
     * @param  {object} data - Los parámetros que se envían al servidor (idfinanciacion, 
     * fechainicio, fechafin)
     * @param  {function} completado - función de callback que se invoca cuando 
     * se cargan los datos desde el servidor (seguimientoVista.onConsultarAmortizacionCompleto)
     * @returns {void}
     */
    consultarAmortizaciones: function (data, completado){
        __cnn.ajax({
            'url': 'financiaciones/amortizacion/',
            'data': data,
            'completado': completado
        });
    },
    
    
    /**
     * Muestra la cartera de la suscripción en un rango de fechas
     * @param  {object} data - Los parámetros que se envían al servidor (idsuscripcion, 
     * fechainicio, fechafin)
     * @param  {function} completado - función de callback que se invoca cuando 
     * se cargan los datos desde el servidor (seguimientoVista.onConsultarAmortizacionCompleto)
     * @returns {void}
     */
    consultarCartera: function (data, completado){
        __cnn.ajax({
            'url': 'cartera/',
            'data': data,
            'completado': completado
        });
    },
    
    /**
     * Consulta las facturas de otras empresas
     * @param  {object} data - Los parámetros que se envían al servidor (idempresa, 
     * idsuscripcion, fechainicio, fechafin)
     * @param  {function} completado - función de callback que se invoca cuando 
     * se cargan los datos desde el servidor (seguimientoVista.onConsultarOtrasFacturaCompleto)
     * @returns {void}
     */
    consultarOtrasFacturas: function (data, completado){
        __cnn.ajax({
            'url': 'otrasempresas/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta las notas generadas por una factura
     * @param{Object} data - Parámetros de filtro (idsuscripcion, fechainicio, fechafin)
     * @param{Function} completado, Función invocada cuando se cargan los datos desde el servidor
     */
    consultarNotasFactura: function(data, completado){
        __cnn.ajax({
            'url': 'notasfacturas/',
            'data': data,
            'completado': completado
        });
    },

    /**
     * Consulta las notas generadas por una recuado
     * @param{Object} data - Parámetros de filtro (idsuscripcion, fechainicio, fechafin)
     * @param{Function} completado, Función invocada cuando se cargan los datos desde el servidor
     */
    consultarNotasRecaudo: function(data, completado){
        __cnn.ajax({
            'url': 'notasrecaudos/',
            'data': data,
            'completado': completado
        });
    },
    
    /**
     * Consulta lectura/consumo según la suscripción
     * @param  {object} data - Los parámetros que se envían al servidor (idsuscripcion, 
     * fechainicio, fechafin)
     * @param  {function} completado - función de callback que se invoca cuando 
     * se cargan los datos desde el servidor (seguimientoVista.onConsultarLecturaConsumoCompleto)
     * @returns {void}
     */
    consultarLecturaConsumo: function(data, completado){
        __cnn.ajax({
            'url': 'lecturas/',
            'data': data,
            'completado': completado
        });
    },
    
    /**
     * Consulta los detalles de una lectura específica
     * @param  {object} data - Los parámetros que se envían al servidor (idlectura)
     * @param  {function} completado - función de callback que se invoca cuando 
     * se cargan los datos desde el servidor (seguimientoVista.onConsultarDetalleLecturaConsumoCompleto)
     * @returns {void}
     */
    consultarDetalleLectura: function(data, completado){
        __cnn.ajax({
            'url': 'detallelectura/',
            'data': data,
            'completado': completado
        });
    },

    /**
     * Consulta en detalle el consumo de una lectura
     * @param{Object} data - Parámetros de filtro (idlectura)
     * @param{Function} completado, Función invocada cuando se cargan los datos desde el servidor
     */
    ConsultarDetalleConsumo: function(data, completado){
        __cnn.ajax({
            'url': 'detallevista/',
            'data': data,
            'completado': completado
        });
    },
    
    /**
     * Consulta encabezado de suspensiones y reconexiones según la suscripción
     * @param  {object} data - Los parámetros que se envían al servidor (idsuscripcion, 
     * fechainicio, fechafin)
     * @param  {function} completado - función de callback que se invoca cuando 
     * se cargan los datos desde el servidor (seguimientoVista.onConsultarEncabezadoCompleto)
     * @returns {void}
     */
    consultarEncabezado: function(data, completado){
        
        __cnn.ajax({
            'url': 'datossuspension/',
            'data': data,
            'completado': completado
        });
    },
    
    /**
     * Consulta suspensión
     * @param  {object} data - Los parámetros que se envían al servidor (idsuspensionreconexion)
     * @param  {function} completado - función de callback que se invoca cuando 
     * se cargan los datos desde el servidor (seguimientoVista.onConsultarSuspensionCompleto)
     * @returns {void}
     */
    consultarSuspension: function(data, completado){
        
        __cnn.ajax({
            'url': 'suspension/',
            'data': data,
            'completado': completado
        });
    },
    
    /**
     * Consulta reconexión
     * @param  {object} data - Los parámetros que se envían al servidor (idsuspensionreconexion)
     * @param  {function} completado - función de callback que se invoca cuando 
     * se cargan los datos desde el servidor (seguimientoVista.onConsultarReconexionCompleto)
     * @returns {void}
     */
    consultarReconexion: function(data, completado){
        __cnn.ajax({
            'url': 'reconexion/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta las solicitudes PQR de una suscripción
     * @param  {object} data - Los parámetros que se envían al servidor (idsuscripcion, fechainicio, fechafin)
     * @param  {function} completado - función que recibe la información del servidor (seguimientoVista.onConsultarSolicitudesCompleto)
     * @returns {void}
     */
    consultarPQR: function(data, completado){
        __cnn.ajax({
            'url': 'PQR/',
            'data': data,
            'completado': completado
        });
    },

    /**
     * Consulta las certificaciones de una suscripción
     * @param  {object} data - Los parámetros que se envían al servidor (idsuscripcion, fechainicio, fechafin)
     * @param  {function} completado - función que recibe la información del servidor (seguimientoVista.onConsultarSolicitudesCompleto)
     */
    consultarCertificaciones: function(data, completado){
        __cnn.ajax({
            'url': 'Certificaciones/',
            'data': data,
            'completado': completado
        });
    },
    consultarInfoPorId: function(id, model, nameid){
        id = parseInt(id);
        for(var indice = 0; indice < model.length; indice++){
            var object = model[indice];
            if(parseInt(object ['nameid']) === id){
                return object;
            }
        }
    },
    /**
     * Consulta el documento que generó la nota
     * @param{Object} id - Id del documento que se está buscando
     * @returns {Object}
     */
    consultarDocumentosNotaPorId: function(id){
        id = parseInt(id);
        for(var indiceDocumento =0; indiceDocumento < seguimientoModelo.documentosNotas.length; indiceDocumento++ ){
            var documento = seguimientoModelo.documentosNotas[indiceDocumento];
            if(parseInt(documento.iddocumento) === id){
                return documento;
            }
        }
        return false;
    },
    
    consultarTarifas: function (data, completado){
        __cnn.ajax({
            'url':'consultatarifas/',
            'data':data,
            'completado':completado
        });
    },
    consultarAuditoria: function (data, completado){
        __cnn.ajax({
            'url':'consultaauditoria/',
            'data':data,
            'completado':completado
        });
    },
     /**
     * Muestra detalles de la factura (Provision- Reclasificacion- Castigo)que se haya seleccionado
     * @param  {object} data - Los parámetros que se envían al servidor (idfactura)
     * @param  {function} completado - función de callback que se invoca cuando 
     * se cargan los datos desde el servidor (seguimientoVista.onConsultarConceptosFactura)
     * @returns {void}
     */
    consultarAllConcepto: function (data, completado){
        __cnn.ajax({
            'url':'facturas/allconceptos/',
            'data':data,
            'completado':completado
        });
    }
};