/**
 * @fileOverview Archivo de control para gestionar la parametrización de una liquidación
 * @author AppFuture
 * @requires gestionarliquidacion.control.js
 * @version 1.0.0
 */

/** @namespace */
var gestionarliquidacionControl = {
    /**
     * Consulta los barrios según el municipio seleccionado y el texto ingresado
     * @param  {object} data - Parámetros que se envían al servidor (municipios, barrio)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor (gestionarliquidacionVista.mostrarResultadoBarrio)
     * @returns {void}
     */
    consultarBarrios: function (data, completado) {
        __cnn.ajax({
            'url': 'obtener_barrios/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta los conceptos según la liquidación seleccionada y el texto ingresado
     * @param  {object} data - Parámetros que se envían al servidor (idliquidacion, concepto)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor (gestionarliquidacionVista.mostrarResultadoConcepto)
     * @returns {void}
     */
    consultarConceptos: function (data, completado) {
        __cnn.ajax({
            'url': 'obtener_conceptos/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta los documentos según la clasificación seleccionada
     * @param  {object} data - Parámetros que se envían al servidor (idclasificacion)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor (gestionarliquidacionVista.onConsultarDocumentosCompleto)
     * @returns {void}
     */
    consultarDocumentos: function (data, completado) {
        __cnn.ajax({
            'url': 'obtener_documentos/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta municipios para autocomplete
     * @param  {object} data - Parámetros que se envían al servidor (municipio ingresado)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor (gestionarliquidacionVista.mostrarResultadoMunicipio)
     * @returns {void}
     */
    consultarMunicipios: function (data, completado) {
        __cnn.ajax({
            'url': 'obtener_municipios/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta las liquidaciones en autocomplete para su parametrización
     * @param  {object} data - Parámetros que se envían al servidor (liquidacion ingresada)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor (gestionarliquidacionVista.mostrarResultadoLiquidacion)
     * @returns {void}
     */
    consultarLiquidaciones: function (data, completado) {
        __cnn.ajax({
            'url': 'obtener_liquidaciones/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta la información de parametrización de una liquidación
     * @param  {object} data - Parámetros que se envían al servidor (idliquidacion ingresada)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor (gestionarliquidacionVista.onConsultarLiquidacionParametrizadaCompleto)
     * @returns {void}
     */
    consultarLiquidacionesParametrizadas: function (data, completado) {
        __cnn.ajax({
            'url': 'obtener_liquidacion/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta las liquidaciones que ya están parametrizadas en autocomplete
     * @param  {object} data - Parámetros que se envían al servidor (liquidacion ingresada)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor (gestionarliquidacionVista.mostrarResultadoLiquidacionParametrizada)
     * @returns {void}
     */
    consultarLiquidacionesParametrizadasAutocomplete: function (data, completado) {
        __cnn.ajax({
            'url': 'liquidaciones_parametrizadas/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta los muncipios por usuario logueado que se podrán elimianr
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor (gestionarliquidacionVista.onConsultarMunicipiosPorUsuarioCompleto)
     * @returns {void}
     */
    consultarMunicipiosPorUsuario: function (completado) {
        __cnn.ajax({
            'url': 'obtener_municipios_usuario/',
            'completado': completado
        });
    },
    /**
     * Consulta las suscripciones a las que se aplicará la liquidación especial
     * @param  {object} data - Parámetros que se envían al servidor (codigoanterior, idsuscripcion, cedula, municipios)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor (gestionarliquidacionVista.onConsultarSuscripcionesCompleto)
     * @returns {void}
     */
    consultarSuscripciones: function (data, completado) {
        __cnn.ajax({
            'url': 'obtener_suscripciones/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta los tipos de documentos según el documento seleccionado
     * @param  {object} data - Parámetros que se envían al servidor (iddocumeto)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor (gestionarliquidacionVista.onConsultarTiposDocumentoCompleto)
     * @returns {void}
     */
    consultarTiposDocumento: function (data, completado) {
        __cnn.ajax({
            'url': 'obtener_tipos_documentos/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta los tipos de uso para cargar un combo
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor (gestionarliquidacionVista.onConsultarTiposUsoCompleto)
     * @returns {void}
     */
    consultarTiposUso: function (completado) {
        __cnn.ajax({
            'url': 'obtener_tipos_usos/',
            'completado': completado
        });
    },
    /**
     * Graba toda la parametrización que se haya hecho de la liquidación
     * @param  {object} data - Parámetros que se envían al servidor (liquidacion)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor (gestionarliquidacionVista.onGrabarOperacionCompleto)
     * @returns {void}
     */
    grabarOperacion: function (data, completado) {
        __cnn.ajax({
            'data': data,
            'url': 'guardar_liquidacion/',
            'completado': completado
        });
    },
    /**
     * Valida si se puede eliminar un concepto en la base de datos
     * @param  {object} data - Parámetros que se envían al servidor (idliquidacion, idconcepto)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor (gestionarliquidacionVista.onConsultarValidacionEliminarConceptoCompleto)
     * @returns {void}
     */
    validarEliminarConcepto: function (data, completado) {
        __cnn.ajax({
            'data': data,
            'url': 'concepto_eliminar/',
            'completado': completado
        });
    },
    /**
     * Valida si se puede eliminar un municipio en la base de datos
     * @param  {object} data - Parámetros que se envían al servidor (idliquidacion, idmunicipio)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor (gestionarliquidacionVista.onConsultarValidacionEliminarMunicipioCompleto)
     * @returns {void}
     */
    validarEliminarMunicipio: function (data, completado) {
        __cnn.ajax({
            'data': data,
            'url': 'municipio_eliminar/',
            'completado': completado
        });
    },
    /**
     * Valida si se puede eliminar un tipo de uso en la base de datos
     * @param  {object} data - Parámetros que se envían al servidor (idliquidacion, idtipouso)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor (gestionarliquidacionVista.onConsultarValidacionEliminarTipoUsoCompleto)
     * @returns {void}
     */
    validarEliminarTipoUso: function (data, completado) {
        __cnn.ajax({
            'data': data,
            'url': 'tipouso_eliminar/',
            'completado': completado
        });
    }
};