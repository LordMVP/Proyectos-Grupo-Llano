/**
 * @fileOverview Archivo de control de financiación
 * @author angelicaGomez
 * @requires notasautomaticas.modelo.js
 * @version 1.0.0
 */

/** @namespace */
var notasControl = {
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
    /** Consulta barrios que coincidan con lo digitado y el municipio para autocomplete
     * @param {int} data - Información que se enviará al servidor (barrio, idmunicipio)
     * @param {int} completado - Función callback notasVista.mostrarResultadoBarrio
     * @returns {void}
     */
    consultarBarrio: function (data, completado) {
        __cnn.ajax({
            data: data,
            completado: completado,
            url: 'barrios/'
        });
    },
    /** Consulta facturas por suscripción o por otro filtro
     * @param {int} data - Información que se enviará al servidor (idsuscripcion ó parametros)
     * @param {int} completado - Función callback notasVista.onConsultarFacturasCompleto
     * @returns {void}
     */
    consultarFacturas: function (data, completado) {
        __cnn.ajax({
            data: data,
            completado: completado,
            url: 'facturas/'
        });
    },
    /** Consulta facturas de las facturas seleccionadas anteriormente con un filtro
     * @param {int} data - Información que se enviará al servidor (iddocumento, idtipodocumento, conceptos)
     * @param {int} completado - Función callback notasVista.onAplicarFiltroFacturaCompleto
     * @returns {void}
     */
    consultarFacturasFiltro: function (data, completado) {
        __cnn.ajax({
            data: data,
            completado: completado,
            url: 'facturas/filtrar/'
        });
    },
    /** Consulta conceptos-detalles relacionados de una factura
     * @param {int} data - Información que se enviará al servidor (idfactura)
     * @param {int} completado - Función callback notasVista.onConsultarDetalleFacturaCompleto
     * @returns {void}
     */
    consultarDetallesFacturas: function (data, completado) {
        __cnn.ajax({
            data: data,
            completado: completado,
            url: 'facturas/detalles/'
        });
    },
    /** Consulta tipos de documentos de las facturas consultadas
     * @param {int} completado - Función anónima que se ejecuta cuando llegue la información
     * @returns {void}
     */
    consultarTiposDocumentos: function (completado) {
        __cnn.ajax({
            completado: completado,
            url: 'tiposdocumentos/'
        });
    },
    /** Consulta los documentos según tipo de documento y facturas consultadas
     * @param {int} data - Información que se enviará al servidor (idtipodocumento)
     * @param {int} completado - Función anónima que se ejecuta cuando llegue la información
     * @returns {void}
     */
    consultarDocumentos: function (data, completado) {
        __cnn.ajax({
            data: data,
            completado: completado,
            url: 'documentos/',
            modal: true
        });
    },

    /**
     * Verifica una factura por su id
     * @param  {Object} data       Datos de la petición (idfactura)
     * @param  {Function} completado Callback: onVerificarFacturaCompleto
     * @returns {void}            
     */
    verificarFactura: function (data, completado) {
        __cnn.ajax({
            data: data,
            completado: completado,
            url: 'verificar/'
        });
    },


    /**
     * Consulta los motivos para las notas
     * @param  {Function} completado Invoca a onConsultarMotivosCompleto
     * @returns {void}            
     */
    consultarMotivos: function (completado) {
        __cnn.ajax({
            completado: completado,
            url: 'motivos/'
        });
    },


    /**
     * Invoca la aplicación de notas
     * @param  {Object} data       Datos de la petición (idmotivo, comentario, reclamacion)
     * @param  {Function} completado Callback: onAplicarNotasCompleto
     * @returns {void}            
     */
    aplicarNotas: function (data, completado) {
        __cnn.ajax({
            data: data,
            completado: completado,
            url: 'aplicar/'
        });
    },

    /** Confirma que no exista una combinación en el arreglo de filtros
     * @param {int} doc - iddocumento de la combinación a verificar
     * @param {int} tipodoc - idtipodocumento de la combinación a verificar
     * @param {int} conc - idconcepto de la combinación a verificar
     * @returns {bool} Si existe o no la combinación
     */
    consultarCombinacion: function (doc, tipodoc, conc) {
        for (var com = 0; com < notasModel.filtroFactura.length; com++) {
            var filtro = notasModel.filtroFactura[com];
            if (doc === filtro.iddocumento && tipodoc === filtro.idtipodocumento) {
                if (filtro.idconcepto === conc)
                    return false;
            }
        }
        return true;
    },
    /** Confirma que no exista una combinación en el arreglo de valores
     * @param {int} liq - idliquidacion de la combinación a verificar
     * @param {int} conc - idconcepto de la combinación a verificar
     * @returns {bool} Si existe o no la combinación
     */
    consultarCombinacionLiquidacion: function (liq, conc) {
        for (var com = 0; com < notasModel.valores.length; com++) {
            var filtro = notasModel.valores[com];
            if (liq === filtro.idliquidacion && conc === filtro.idconcepto)
                return false;
        }
        return true;
    },
    /** Consulta los conceptos de una liquidación según tipo de notas
     * @param {int} data - Información que se enviará al servidor (idliquidacion, tiponota)
     * @param {int} completado - Función anónima
     * @returns {void}
     */
    consultarConceptos: function (data, completado) {
        __cnn.ajax({
            data: data,
            completado: completado,
            url: 'conceptos/'
        });
    },
    /** Consulta las liquidaciones según el documento y tipoi de documento selsccionado
     * @param {int} data - Información que se enviará al servidor (iddocumento, idtipodocumento)
     * @param {int} completado - Función anónima
     * @returns {void}
     */
    consultarLiquidacion: function (data, completado) {
        __cnn.ajax({
            data: data,
            completado: completado,
            url: 'liquidacion/',
            modal: true
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
    /** Inicia procesamiento de las facturas con el nuevo valor del concepto
     * @param {int} data - Información que se enviará al servidor (conceptos, facturas)
     * @param {function} completado - Función callback notasVista.onProcesarNotasCompleto
     * @returns {void}
     */
    procesaraFacturas: function (data, completado) {
        __cnn.ajax({
            data: data,
            completado: completado,
            url: 'procesar/'
        });
    },

    /** Muestra las facturas procesadas en un archivo excel
     * @param {function} completado - Función callback notasVista.onProcesarNotasCompleto
     * @returns {void}
     */
    archivoExcel: function (completado) {
        __cnn.ajax({
            completado: completado,
            url: 'archivo/'
        });
    },
    /** Consulta el proceso que se está ejecutando
     * @param {function} completado - Función callback (función anónima)
     * @returns {void}
     */
    consultarProceso: function (completado, errorCallback) {
        __cnn.ajax({
            completado: completado,
            url: 'consultar_proceso/',
            error: errorCallback,
            background: true
        });
    },


    /**
     * Consulta los errores de la aplicación de notas
     * @param  {Function} completado Función anónima invocada desde la vista
     * @returns {void}            
     */
    consultarErrores: function (completado) {
        __cnn.ajax({
            completado: completado,
            url: 'errores/'
        });
    },

    /**
     * Consulta los tipos de documento de la suscripción
     * @param  {Object} data    Parámetros de la petición (idsuscripcion)
     * @param  {Function} success Callback que se ejecuta: onConsultarTipoDocumentoCompleto
     * @returns {void}         
     */
    consultarTipoDocumentoSuscripcion: function (data, success) {
        __cnn.ajax({
            url: 'tiposdocumentos/',
            data: data,
            completado: success
        });
    },

    /**
     * Elimina las tablas temporales antes de iniciar la aplicación
     * @param  {Functión} completado Callback: función anónima invocada desde la vista.
     * @returns {void}            
     */
    eliminarTablas: function (completado) {
        __cnn.ajax({
            url: 'eliminartablas/',
            completado: completado
        });
    },
      /**
     * Consulta si usuario tiene permiso para registrar notas por saldo a favor por cambio de estrato o error de lectura
     * @param  {Object} data    Parámetros de la petición (idestructura, idPrograma)
     * @param  {Function} success Callback que se ejecuta:
     * @returns {void}         
     */
    controlComboContabilizacion: function (data, success) {
        __cnn.ajax({
            url: 'controlcombocontabilizacion/',
            data: data,
            completado: success
        });
    },

    /**
     * Consulta información de una factura según su id
     * @param {int} id - Id de la factura que desea consultar
     * @returns {object} Información de la factura
     */
    obtenerFacturaPorId: function (id) {
        for (var i = 0; i < notasModel.facturas.length; i++) {
            if (notasModel.facturas[i].idfactura == id) {
                return notasModel.facturas[i];
            }
        }
        return null;
    },
    /**
     * Obtiene las facturas que tienen el atributo 'Seleccionado'
     * @returns {array} Arreglo con id de factura y idsuscripcion de las filas selecscionadas en interfaz
     */
    obtenerFacturaSeleccionada: function () {
        var facturas = '';
        for (var i = 0; i < notasModel.facturas.length; i++) {
            var fac = notasModel.facturas[i];
            if (fac.seleccionado) {
                facturas += fac.idfactura + ',';
            }
        }
        if (facturas.length > 0) {
            facturas = facturas.substring(0, facturas.length - 1);
        }
        return facturas;
    },

    /**
     * Remueve de la lista de facturas seleccionadas, la factura que corresponde al parámetro id
     * @param  {int} id id de la factura que se va a remover del arreglo
     * @returns {bool}    Verdadero si puede eliminar la factura, false si no hay nada qué eliminar
     */
    removerFacturaSeleccionadaPorId: function (id) {

        if (!notasModel.facturasSeleccionadas) {
            notasModel.facturasSeleccionadas = [];
        }

        for (var i = notasModel.facturasSeleccionadas.length - 1; i >= 0; i--) {
            if (id === notasModel.facturasSeleccionadas[i]) {
                notasModel.facturasSeleccionadas.splice(i, 1);
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
    agregarFacturaSeleccionada: function (id) {

        if (!notasModel.facturasSeleccionadas) {
            notasModel.facturasSeleccionadas = [];
        }

        for (var i = 0; i < notasModel.facturasSeleccionadas.length; i++) {
            if (id === notasModel.facturasSeleccionadas[i]) {
                return false;
            }
        }
        notasModel.facturasSeleccionadas.push(id);
    },

    /**
     * Busca en el arreglo de facturas por un concepto determinado por su id
     * @param  {Number} idConcepto Id del concepto que se buscará
     * @returns {Boolean}            True si encuentra, de lo contrario false.
     */
    buscarConceptoFiltro: function (idConcepto) {
        for (var i = 0; i < notasModel.filtroFactura.length; i++) {
            if (notasModel.filtroFactura[i].idConcepto == idConcepto) {
                return true;
            }
        }
        return false;
    },
    /**
     * Hace la petición al servidor para consultar conceptos informativos de un concepto
     * @param {Object} data - idconcepto del que se consulta los conceptos
     * @param {Function} success - FUnciòn que se ejecuta una vez responde el servidor
     * @returns {void}
     */
    consultarConceptosInformativos: function (data, success) {
        __cnn.ajax({
            url: 'conceptosrelacionados/',
            data: data,
            completado: success
        });
    },
    /**
     * Obtiene un concepto por id del arreglo 
     * @param {Array|null} conceptos - Arreglo de busqueda si es nulo es el actual de los informativos
     * @param {number} idconcepto - Concepto que se busca
     * @returns {Object}
     */
    consultarConceptoPorId: function (conceptos, idconcepto) {
        if(!conceptos){
            conceptos = notasModel.conceptosInformativos[notasModel.idconceptoSeleccionado];
        }
        idconcepto = parseInt(idconcepto);
        for (var i = 0; i < conceptos.length; i++) {
            var concepto = conceptos[i];
            if (parseInt(concepto.idconcepto) === idconcepto) {
                return concepto;
            }
        }
    }
}
