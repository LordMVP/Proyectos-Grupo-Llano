/**
 * @fileOverview Archivo para el control de peticiones al servidor del programa de suspensiones y reconexiones
 * @author AppFuture
 * @requires suspension.modelo.js
 * @version 1.0.0
 */
var suspensionControl = {
    /**
     * Consulta todos los terceros que cumplan con los filtros
     * @param {Object} data - Filtro enviado al servidor (nombre)
     * @param {Function} completado - Función que recibe la respuesta del servidor
     */
    cargarAutoCompleteRec: function (data, completado) {
        __cnn.ajax({
            'url': 'consultar_terceros_suspension',
            'data': data, 
            'completado': completado
        });
    },
    /**
     * Consulta las suscripciones que cumplen con los filtros
     * @param {Object} data - Filtro de vista para las suscripciones (idsuscripcion, codanterior, documento, municipio)
     * @param {Function} completado - Función que recibe la información de la suscripción buscada
     */
    consultarSuscripciones: function (data, completado) {
        __cnn.ajax({
            'url': 'consultar_suscripcion',
            'data': data,
            "completado": completado
        });
    },
    /**
     * Consulta el ciclo y período actual de una suscripción
     * @param {Object} data - Información para la consulta (idsuscripcion)
     * @param {Function} success - FUnción ejecutada cuando llegue la información  (Función anónima)
     */
    consultarCicloPeriodo: function (data, success) {
         __cnn.ajax({
            'url': 'consultar_ciclo_periodo',
            'data': data, 
            'completado': success
        });
    },
    /**
     * Consulta los detalles de una suscripción
     * @param {Object} data - Información que se envía (idSuscripcion)
     * @param {Function} completado - Función ejecutada una vez el servidor responde (Función anónima)
     */
    consultarDetalleSuscripcion: function (data, completado) {
        __cnn.ajax({
            'url': 'detalles_suscripcion',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta información que configura la funcionalidad de la vista (Función sincrona)
     * @param {string} url - Ruta a la que se le está haciendo la petición
     * @returns {Object} Respuesta del servidor con información según se necesita
     */
    consultarParametros: function (url) {
        return __cnn.ajax({
            'url': url,
            'async': false
        });
    },
    /**
     * Consulta los encabezados de suspensiones de una suscripción
     * @param {Object} data - Información necesaria para la consulta (idsuscripcion)
     * @param {Function} completado - Función que recibe la información enviada por el servidor y la procesa según se necesite
     */
    consultarSuspensiones: function (data, completado) {
        __cnn.ajax({
            'url': 'consultar_suspensiones',
            'data': data, 
            'completado': completado
        });
    },
    /**
     * Consulta los detalles de reconexión que tiene un encabezado (Función síncrona)
     * @param {Object} data - Información enviada al servidor (idsuspension)
     * @returns {Object} Respuesta del servidor
     */
    consultarDetallesReconexiones: function (data) {
        return __cnn.ajax({
            'url': 'consultar_reconexiones',
            'async': false,
            'data': data
        });
    },
    /**
     * Consulta los detalles de suspensión que tiene un encabezado de una suscripción
     * @param {Object} data  Información necesaria para la consulta (idsuspension)
     * @param {Function} completado - FUnción que procesa la información y la muestra al usuario (Función Anónima)
     */
    consultarDetallesSuspensiones: function (data, completado) {
        __cnn.ajax({
            'url': 'consultar_detalles_suspension/' + data.idsuspension,
            'completado': completado,
            'data': data
        });
    },
    /**
     * Edita la información de un detalle de suspensión en el servidor (Función síncrona)
     * @param {Object} data - Información que se edita (idsuspension, idregistrodetalle y otros campos por editar)
     * @returns {Object} Respuesta del servidor
     */
    editarDetalleSuspension: function (data) {
        return __cnn.ajax({
            'url': 'editar_detalle',
            'async': false,
            'data': data
        });
    },
    /**
     * Agrega nuevo detalle de suspensión en el servidor (FUnción síncrona)
     * @param {Object} data - Información obligatoria y opcional para agregar (idsuspension*, idmotivosuspension, idnovedadsuspension,
     * idtiposuspension, idtercerosuspension, lectura, fechaprogramacion, fechaejecucion, observacion, idconceptosuspension)
     * @returns {Object} - Respuesta del servidor
     */
    nuevoDetalleSuspension: function (data) {
        return __cnn.ajax({
            'url': 'nuevo_detalle',
            'async': false,
            'data': data
        });
    },
    /**
     * Elimina un detalle de suspensión en el servidor (Función síncrona)
     * @param {Object} data - Información necesaria para realizar la acción (idregistrodetalle)
     * @returns {Object} - Respuesta del servidor con registrosAfectados
     */
    eliminarDetallesSuspensiones: function (data) {
        return __cnn.ajax({
            'url': 'eliminar_detalle_suspension',
            'async': false,
            'data': data
        });
    },
    /**
     * Agrega nuevo detalle de reconexión en el servidor (Función síncrona)
     * @param {Object} data - Información obligatoria y opcional para agregar (idsuspension*, iddetallesuspension*, Opcionales)
     * @returns {Object} - Respuesta del servidor
     */
    nuevaReconexion: function (data) {
        return __cnn.ajax({
            'url': 'insertar_reconexion',
            'async': false,
            'data': data
        });
    },
    /**
     * Edita la información de un detalle de reconexión en el servidor (Función síncrona)
     * @param {Object} data - Información obligatoria y opcional para actualizar (idsuspension*, iddetallesuspension*, idregistrodetalle*, Opcionales)
     * @returns {Object} - Respuesta del servidor
     */
    editarReconexion: function (data) {
        return __cnn.ajax({
            'url': 'actualizar_reconexion',
            'async': false,
            'data': data
        });
    },
    /**
     * Elimina un detalle de rexonexión en el servidor (Función síncrona)
     * @param {Object} data - Información necesaria para realizar la acción (idregistrodetalle)
     * @returns {Object} - Respuesta del servidor con registrosAfectados
     */
    eliminarReconexion: function (data) {
        return __cnn.ajax({
            'url': 'eliminar_reconexion',
            'async': false,
            'data': data
        });
    },
    /**
     * Envía petición para guardar encabezado de suspensiones y reconexiones
     * @param {Object} data - Información necesaria para guardar y opcional (idsuscripcion*, idpropiedad*, cicanio*, opcionales*)
     * @param {Function} completado - Función que verifica si se realizó la operación exitosamente (onGrabarNuevaSuspensionCompleto)
     */
    insertarNuevaSuspension: function (data, completado) {
        __cnn.ajax({
            'url': 'nueva_suspension',
            'completado': completado,
            'data': data
        });
    },
    /**
     * Elimina el encabezado de suspensión
     * @deprecated version 1.1.0
     * @param {Object} data
     */
    eliminarSuspension: function (data) {
        return __cnn.ajax({
            'url': 'eliminar_suspension',
            'async': false,
            'data': data
        });
    },
    /**
     * Consulta los municipios que coinciden con el texto
     * @param {Object} data - Información de filtro (municipio)
     * @param {Function} completado - Función que recibe la información del servidor (mostrarResultadoMunicipio)
     */
    consultarMunicipios: function (data, completado) {
        __cnn.ajax({
            'url': 'consultar_municipios',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta los motivos de reconexión según la suspensión a la que se está agregando
     * @param {Object} data - Parámentros de búsqueda (idsuspension*, iddetallesuspension*)
     * @param {Function} completado - Función que recibe la respuesta del servidor
     */
    consultarMotivosReconexion: function (data, completado) {
        __cnn.ajax({
            'url': 'consultar_motivos_reconexion',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta el valor de un concepto
     * @param {Object} data - Información de filtro (idconcepto)
     * @deprecated version 1.1.0 Se utiliza (consultarValorSuspension, consultarValorReconexion respectivamente)
     * @param completado
     */
    consultarValorConcepto:function(data, completado){
        __cnn.ajax({
            'url': 'consultar_valor_concepto',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta la última suspensión realizada en un encabezado verificando que esté realizada
     * @param {Object} data - FIltro de búsqueda (idsuspension)
     * @param {Function} completado - Función que obtiene la respuesta del servidor (validarSuspensionParaNuevaReconexionCompletado)
     */
    consultarSuspensionParaReconexion:function(data, completado){
        __cnn.ajax({
            'url': 'ultima_suspension',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta el valor que tiene  una suspensións según la novedad seleccionada
     * @param {Object} data - Información que se envía al servidor (idnovedad)
     * @param {Function} completado - Función callback (Función anónima)
     */
    consultarValorSuspension:function(data, completado){
        __cnn.ajax({
            'url': 'valor_suspension',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta el valor que tiene  una reconexión según la novedad seleccionada
     * @param {Object} data - Información que se envía al servidor (idnovedad)
     * @param {Function} completado - Función callback (Función anónima)
     */
    consultarValorReconexion:function(data, completado){
        __cnn.ajax({
            'url': 'valor_reconexion',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta el valor que tiene  una reconexión según la novedad seleccionada
     * @param {Object} data - Información que se envía al servidor (idnovedad)
     * @param {Function} completado - Función callback (Función anónima)
     */
    habilitarSSRX:function(data, completado){
         __cnn.ajax({
            'url': 'habilitar_ssp_rco',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta si un cliente tiene facturas o financiaciones con saldo
     * @param {Object} data - Información que se envía al servidor (idnovedad)
     * @param {Function} completado - Función callback (Función anónima)
     */
    getInfFacturaFinancia:function(data, completado){
         __cnn.ajax({
            'url': 'getinfofacturafinancia',
            'data': data,
            'completado': completado
        });
    }
};