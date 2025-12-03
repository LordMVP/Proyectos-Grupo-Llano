/**
* @fileOverview Archivo de control para contabilizar concepto
* @author AngélicaGómez
* @requires contabilizarConcepto.modelo.js
* @version 1.0.0
*/

/** @namespace */
var contabilizarControl = {
    /**
     * Se consultan empresas con las que tiene convenio la empresa logueada
     * @param {function} success - Función callback cuando el servidor da respuesta (contabilizarVista.onConsultarEmpresa)
     * @returns {void}
     */
    consultarEmpresas: function(completado) {
        __cnn.ajax({
            'url': 'obtener/empresas_convenio/',
            'completado': completado
        });
    },
    /** 
     * Consulta documentos según la empresa seleccionada o la logueada
     * @param {object} data - Información para consultar suscripción (idempresa - opcional)
     * @param {function} completado - Función callback contabilizarVista.onConsultarDocumento
     * @returns {void}
     */
    consultarDocumento: function(data, completado) {
        __cnn.ajax({
            'url': 'obtener/documentos/',
            'data': data,
            'completado': completado
        });
    },
    /** 
     * Consulta conceptos flujo y conceptos contables
     * @param {function} completado - Función callback contabilizarVista.onConsultarConceptoRecaudo
     * @returns {void}
     */
     consultarConceptoRecaudo: function(data, completado){
         __cnn.ajax({
            'url': 'obtener/recaudos/',
            'data': data,
            'completado': completado
        });
     },

    /** 
     * Consulta medios de pago según el usuario logueado
     * @param {function} completado - Función callback contabilizarVista.onConsultarDocumento
     * @returns {void}
     */

    consultarMedioPago: function(completado) {

        __cnn.ajax({
            'url': 'obtener/medio_pago/',
            'completado': completado
        });
    },
    /** 
     * Consulta los concepto con coincidencia en el texto escrito
     * @param {string} data - Posible nombre de un concepto
     * @param {function} completado - Función callback contabilizarVista.onConsultarDocumento
     * @returns {void}
     */
    consultarConceptoNombre: function(data, completado) {
        __cnn.ajax({
            'url': '../consultar/concepto/nombre',
            'data': data,
            'completado': completado
        });
    },

    /** 
     * Consulta la contabilización de un concepto
     * @param {object} data - Información que se envía al servidor (idconcepto)
     * @param {function} completado - Función callback contabilizarVista.onConsultarContabilizacionCompleto
     * @returns {void}
     */
    consultarContabilizacion: function(data, completado) {
        __cnn.ajax({
            'url': 'obtenercontabilizacion/',
            'data': data,
            'completado': completado
        });
    },

    /** 
     * Consulta los conceptos de flujo y conceptos contables de un concepto
     * @param {object} data - Información que se envía al servidor (idconcepto)
     * @param {function} completado - Función callback contabilizarVista.onConsultarRecaudoCompleto
     * @returns {void}
     */
    consultarRecaudo: function(data, completado) {
        __cnn.ajax({
            'url': 'obtenerrecaudos/',
            'data': data,
            'completado': completado
        });
    },
     /** 
     * Consulta las cuentas según la acción a realizar
     * @param {object} data - Información que se envía al servidor (acción - nombreconcepto)
     * @param {function} completado - Función callback contabilizarVista.onConsultarDocumento
     * @returns {void}
     */
    consultarCuenta: function(data, completado) {
        __cnn.ajax({
            'url': 'cuentas/',
            'data': data,
            'completado': completado
        });
    },
    
    /**
     * Consulta los tipos de documento
     * @param  {Object} data       Los datos que se envían a la petición
     * @param  {Function} completado Functión de callback que se ejecuta con la respuesta del servidor
     * @returns {void}
     */
    consultarTiposDocumento: function(data, completado) {
        __cnn.ajax({
            'url': 'obtener/tipodocumentos/',
            'data': data,
            'completado': completado
        });
    },


    /**
     * Consulta la contabilización de una consignación
     * @param  {Object} data       Los datos que se envían a la petición
     * @param  {Function} completado Callback que se invoca con la respuesta del servidor
     * @returns {void}            
     */
    consultarContabilizacionConsignacion: function(data, completado) {
        __cnn.ajax({
            'url': 'obtener/consignacion/',
            'data': data,
            'completado': completado
        });
    },
    
    /**
     * Consulta una contabilización por su id, en la lista de contabilizaciones de
     * contabilizarModelo.contabilizacion
     * @param  {Number} id Id de la contabilización
     * @returns {Object}    un objeto con la información de la contabilización
     */
    consultarContabilizacionPorId: function(id){
        id = parseInt(id);
        for(var i = 0; i < contabilizarModelo.contabilizacion.length; i++ ){
            var cont = contabilizarModelo.contabilizacion[i];
            var idcont = parseInt(cont.idcontabilizacion);
            if(id === idcont){
                return {contabilizacion: cont, indice: i};
            }
        }
    }, 


    /**
     * Consulta un área por su id, de la conelección de contabilizarModelo.areanegocio
     * @param  {Number} id Id del área
     * @returns {object}    Objeto con la información del área.
     */
    consultarAreaPorId: function(id){
        id = parseInt(id);
        for(var i = 0; i < contabilizarModelo.areanegocio.length; i++ ){
            var area = contabilizarModelo.areanegocio[i];
            var idarea = parseInt(area.idareanegocio);
            if(id === idarea){
                return {areanegocio: area, indice: i};
            }
        }
    }, 

    /**
     * Consulta un centro de costos por su id en la colección de contabilizarModelo.centrocosto
     * @param  {Number} id Id del centro de costo
     * @returns {Object}    Información del centro de costo.
     */
    consultarCentroPorId: function(id){
        id = parseInt(id);
        for(var i = 0; i < contabilizarModelo.centrocosto.length; i++ ){
            var centro = contabilizarModelo.centrocosto[i];
            var idcentro = parseInt(centro.idcentrocosto);
            if(id === idcentro){
                return {centrocosto: centro, indice: i};
            }
        }
    }, 

    /**
     * Consulta un concepto de flujo por su id
     * @param  {Number} id Id del flujo contable
     * @returns {Object}    Información del flujo contable.
     */
    consultarConceptoFlujoPorId: function(id){
        id = parseInt(id);
        for(var c = 0; c < contabilizarModelo.flujocontable.length; c++){
            var concepto = (contabilizarModelo.flujocontable[c]);
            var idconcepto = parseInt(concepto.idconceptoflujo );
            if(id === idconcepto){
                return {conceptoflujo: concepto, indice: c};
            }
        } 
    },


    /**
     * Consulta un concepto contable por su ID
     * @param  {Number} id Id del concepto contable
     * @returns {Object}    Información del concepto contable.
     */
    consultarConceptoContablePorId: function(id){
        id = parseInt(id);
        for(var c = 0; c < contabilizarModelo.conceptocontable.length; c++){
            var concepto = (contabilizarModelo.conceptocontable[c]);
            var idconcepto = parseInt(concepto.idconceptocontable );
            if(id === idconcepto){
                return {conceptocontable: concepto, indice: c};
            }
        } 
    },

    /**
     * Consulta un flujo de consignación por su ID
     * @param  {Number} id Id del flujo de consignación
     * @returns {Object}    Información del dlujo de consignación.
     */
    consultarConsignacionFlujoPorId: function(id){
        id = parseInt(id);
        for(var c = 0; c < contabilizarModelo.flujoconsignacion.length; c++){
            var concepto = (contabilizarModelo.flujoconsignacion[c]);
            var idconcepto = parseInt(concepto.idconceptoflujo );
            if(id === idconcepto){
                return {conceptoflujo: concepto, indice: c};
            }
        } 
    },


    /**
     * Consulta una consignación contable por su id
     * @param  {Number} id Id de la consignación contable
     * @returns {Object}    Información de la contabilización contable.
     */
    consultarConsignacionContablePorId: function(id){
        id = parseInt(id);
        for(var c = 0; c < contabilizarModelo.contableconsignacion.length; c++){
            var concepto = (contabilizarModelo.contableconsignacion[c]);
            var idconcepto = parseInt(concepto.idconceptocontable );
            if(id === idconcepto){
                return {conceptocontable: concepto, indice: c};
            }
        } 
    },

    /**
     * Consulta un medio de pago por su ID
     * @param  {Number} id Id del medio de pago
     * @returns {Object|String}    Información del tipo del medio de pago
     */
    consultarMedioPagoPorId: function(id){
        id = parseInt(id);
        for(var c = 0; c < contabilizarModelo.mediosPago.length; c++){
            var mediopago = (contabilizarModelo.mediosPago[c]);
            var idmedio = parseInt(mediopago.id );
            if(id === idmedio){
                return mediopago.tipo;
            }
        } 
    },

    /**
     * Consulta un documento por su ID
     * @param  {Number} id Id del documento
     * @returns {Object}    Un objeto con el documento.
     */
    consultarDocumentoPorId: function(id){
        id = parseInt(id);
        for(var c = 0; c < contabilizarModelo.documentos.length; c++){
            var documento = (contabilizarModelo.documentos[c]);
            var iddocumento = parseInt(documento.iddocumento);
            if(id === iddocumento){
                return documento;
            }
        } 
    },

    /**
     * Guarda la información de la cotabilización.
     * @param  {Object} data       La información de la petición.
     * @param  {Fucntion} completado Función de callback que se ejecuta con la respuesta del servidor.
     * @returns {void}
     */
    guardarContabilizacion: function(data, completado) {
        __cnn.ajax({
            'url': 'actualizar/',
            'data': data,
            'completado': completado
        });
    },
};