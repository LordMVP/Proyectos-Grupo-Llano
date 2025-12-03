/**
 * @fileOverview Archivo de control de financiación
 * @author angelicaGomez
 * @requires notasautomaticas.modelo.js
 * @version 1.0.0
 */

/** @namespace */
var notasrControl = {
    /** Consulta información de uan suscripción según información del filtro
     * @param {object} data - Información para consultar suscripción (idmunicipio, idsuscripcion, cedula, codigoanterior, idpropiedad)
     * @param {int} completado - Función callback notasVista.onFiltrarSuscripcionCompleto
     * @returns {void}
     */
    consultarSuscripciones: function (data, completado) {
        __cnn.ajax({
            data: data,
            completado: completado,
            url: 'buscar/'
        });
    },
    /** Consulta municipios que coincidan con lo digitado para autocomplete
     * @param {int} data - nombre del municipio a consultar
     * @param {int} completado - Función callback notasVista.mostrarResultado
     * @returns {void}
     */
    consultarMunicipio: function (data, completado) {
        __cnn.ajax({
            data: data,
            completado: completado,
            url: 'municipios/'
        });
    },
    /** Consulta facturas por suscripción o por otro filtro
     * @param {int} data - Información que se enviará al servidor (idsuscripcion ó parametros)
     * @param {int} completado - Función callback notasVista.onConsultarFacturasCompleto
     * @returns {void}
     */
    consultarNotasR: function (data, completado) {
        __cnn.ajax({
            data: data,
            completado: completado,
            url: 'notasr/'
        });
    },
    /** Consulta conceptos según tipo documento y documento seleccionado en el filtro para autocomplete
     * @param {int} data - Información que se enviará al servidor (iddocumento, idtipodocumento)
     * @param {int} completado - Función callback notasVista.mostrarResultadoConcepto
     * @returns {void}
     */
    consultarConceptosAutocomplete: function (completado) {
        __cnn.ajax({
            completado: completado,
            url: 'conceptos/complete/'
        });
    },
    /** Consulta facturas de las facturas seleccionadas anteriormente con un filtro
     * @param {int} data - Información que se enviará al servidor (iddocumento, idtipodocumento, conceptos)
     * @param {int} completado - Función callback notasVista.onAplicarFiltroFacturaCompleto
     * @returns {void}
     */    
    consultarNotasRFiltro: function (data, completado) {
        __cnn.ajax({
            data: data,
            completado: completado,
            url: 'notasr/filtrar/'
        });
    },

    /** Consulta conceptos-detalles relacionados de una Nota en Reclamacion
     * @param {int} data - Información que se enviará al servidor (idfactura)
     * @param {int} completado - Función callback notasVista.onConsultarDetalleNotaRCompleto
     * @returns {void}
     */
    consultarDetallesNotasR: function (data, completado) {
        __cnn.ajax({
            data: data,
            completado: completado,
            url: 'notasr/detalles/'
        });
    },
    eliminarSesion:function(){
        __cnn.ajax({
            async: false,
            url:'eliminarsesion/',
            completado:function(data){
                console.log(data);
            }
        });
    },
    
    /**
     * Consulta información de un detalle de la nota en reclamacion según su iddetalle
     * @param {int} id - Id del detalle que desea consultar
     * @returns {object} Información del Detalle 
     */
    obtenerDetallePorId: function (id) {        
        for (var i = 0; i <notasrModel.conceptos.length; i++) {
            if (notasrModel.conceptos[i].iddetallefactura == id) {
                return notasrModel.conceptos[i];
            }
        }
        return null;
    },
    
    /**
     * Remueve de la lista de facturas seleccionadas, la factura que corresponde al parámetro id
     * @param  {int} id id de la factura que se va a remover del arreglo
     * @returns {bool}    Verdadero si puede eliminar la factura, false si no hay nada qué eliminar
     */
    removerDetalleAplicadoPorId:function(id){
        if (!notasrModel.valores) {
            notasrModel.valores = [];
        }
        for (var i = notasrModel.valores.length-1; i >= 0; i--) {
            if(id == notasrModel.valores[i].iddetallefactura){
                notasrModel.valores.splice(i, 1);
                return true;
            }
        }
        return false;
    },
    
    
    /**
     * Consulta información de una factura según su id
     * @param {int} id - Id de la factura que desea consultar
     * @returns {object} Información de la factura
     */
    obtenerFacturaPorId: function (id) {
        for (var i = 0; i < notasrModel.facturas.length; i++) {
            if (notasrModel.facturas[i].idfactura == id) {
                return notasrModel.facturas[i];
            }
        }
        return null;
    },
    /**
     * Obtiene las facturas que tienen el atributo 'Seleccionado'
     * @returns {array} Arreglo con id de factura y idsuscripcion de las filas selecscionadas en interfaz
     */
    obtenerNotasRSeleccionadas: function(){
        var facturas = '';
        for (var i = 0; i < notasrModel.facturas.length; i++) {
            var fac = notasrModel.facturas[i];
            if (fac.seleccionado) {
                facturas += fac.idfactura+',';
            }
        }
        if (facturas.length>0) {
            facturas = facturas.substring(0, facturas.length-1);
        }
        return facturas;
    },

    /**
     * Remueve de la lista de facturas seleccionadas, la factura que corresponde al parámetro id
     * @param  {int} id id de la factura que se va a remover del arreglo
     * @returns {bool}    Verdadero si puede eliminar la factura, false si no hay nada qué eliminar
     */
    removerFacturaSeleccionadaPorId:function(id){

        if (!notasrModel.facturasSeleccionadas) {
            notasrModel.facturasSeleccionadas = [];
        }        
        if (!notasrModel.valores) {
            notasrModel.valores = [];
        }
        for (var i = notasrModel.valores.length-1; i >= 0; i--) {
            if(id === notasrModel.valores[i].idfactura){
                notasrModel.valores.splice(i, 1);
            }
        }
        for (var i = notasrModel.facturasSeleccionadas.length-1; i >= 0; i--) {
            if(id === notasrModel.facturasSeleccionadas[i]){
                notasrModel.facturasSeleccionadas.splice(i, 1);
                return true;
            }
        }
        
        return false;
    },

    /**
     * Valida si la factura no está en el arreglo, en caso de no existir, la agrega al arreglo.
     * @param  {int} id Id que se va a agregar al arreglo de facturas
     * @returns {bool}    Verdadero si agrega una nueva factura, false si la factura ya estaba en el arreglo
     */
    agregarFacturaSeleccionada:function (id) {

        if (!notasrModel.facturasSeleccionadas) {
            notasrModel.facturasSeleccionadas = [];
        }

        for (var i = 0; i < notasrModel.facturasSeleccionadas.length; i++) {
            if(id === notasrModel.facturasSeleccionadas[i]){
                return false;
            }
        }
        notasrModel.facturasSeleccionadas.push(id);
    },

    /** Inicia procesamiento de las facturas con el nuevo valor del concepto
     * @param {int} data - Información que se enviará al servidor (conceptos, facturas)
     * @param {function} completado - Función callback notasVista.onProcesarNotasCompleto
     * @returns {void}
     */
    procesaraNotasR: function (data, completado) {
        __cnn.ajax({
            data: data,
            completado: completado,
            url: 'procesar/'
        });
    },

    /**
     * Aplica las notas reclamación
     * @param  {Object} data       Datos de la petición (idmotivo, comentario)
     * @param  {Functión} completado Callback: onAplicarNotasCompleto
     * @returns {void}            
     */
    aplicarNotas:function(data, completado){
        __cnn.ajax({
            data: data,
            completado: completado,
            url: 'aplicar/'
        });
    },

    /**
     * Verifica la nota por su reclamación
     * @param  {Object} data       Datos de la petición (idnotar)
     * @param  {Functión} completado Callback: onVerificarNotaRCompleto
     * @returns {void}            
     */
    verificarNotaR:function(data, completado){
        __cnn.ajax({
            data: data,
            completado: completado,
            url: 'verificar/'
        });
    },    

    /**
     * Busca un concepto por su id en la lista de filtrofactura
     * @param  {Number} idConcepto Id del concepto a buscar
     * @returns {Boolean}            True si se encuentra, false de lo contrario
     */
    buscarConceptoFiltro:function(idConcepto){
        for(var i = 0;i<notasrModel.filtroFactura.length; i++){
            if(notasrModel.filtroFactura[i].idConcepto == idConcepto){
                return true;
            }
        }
        return false;
    },

    /**
     * Consulta los motivos de las notas de reclamación
     * @param  {Functión} completado Callback: onConsultarMotivosCompleto
     * @returns {void}            
     */
    consultarMotivos:function(completado){
        __cnn.ajax({
            completado: completado,
            url: '../notas_automaticas/motivos/'
        });
    },
}
