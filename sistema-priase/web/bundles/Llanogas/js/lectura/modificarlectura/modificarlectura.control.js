/** @namespace */
var modificarLecturaControl = {
    /** Guarda las lecturas modificadas, agregadas o eliminadas
     * @param  {object} data - Parámetros que se envían al servidor (datos)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor 
     * (gestionarlecturaVista.guardarOperacionCompleto)
     * @returns {void}
     */
    guardarOperacion: function (data, completado){
        __cnn.ajax({
            'url':'registrar_modificacion_lectura/',
            'data':data,
            'completado':completado
        });
    },
    /**
     * Consulta las suscripciones que coincidan con los parámetros de búsquedas.
     * @param  {object} data - Parámetros que se envían al servidor (idsuscripcion,documento,codigoanterior)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor 
     * (gestionarlecturaVista.consultaSuscripcionCompleto)
     * @returns {void}
     */
    consultarSuscriptor: function (data, completado){
        __cnn.ajax({
            'url':'filtrar/',
            'data':data,
            'completado':completado
        });
    },
    /**
     * Consulta la lectura con sus detalles
     * @param {Object} data - Información necesaria para la consulta (idsuscripcion, idlectura)
     * @param {Function} completado - Función que obtiene la respuesta del servidor y la muestra al usuario(onConsultarLecturaCompleto)
     */
    consultarInformacionLectura:function(data, completado){
        __cnn.ajax({
            'url':'obtener_informacion/',
            'data':data,
            'completado':completado 
        });
    },
    /**
     * Consulta la lectura de una suscripción
     * @param  {object} data - Parámetros que se envían al servidor (idsuscripcion)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor 
     * (gestionarlecturaVista.consultarLecturaActualCompleto)
     * @returns {void}
     */
    consultarLecturaActual: function (data, completado){
        __cnn.ajax({
            'url':'obtenerencabezadolectura/',
            'data':data,
            'completado':completado
        });
    },
    /**
     * Consulta datos básicos de los terceros que hacen una solicitud
     * @param  {object} data - Los parámetros que se envían al servidor (nombre)
     * @param  {function} completado - Función invocada cuando cargan datos desde 
     * servidor (generarFinanciacionVista.mostrarResultado)
     * @returns {void}
     */
    buscarEmpresaLectura:function(data, success){
        __cnn.ajax({
            url:'../consultar_terceros/',
            data:data,
            completado:success
        });
    },
    /**
     * Consulta la información de un medidor
     * @param  {object} data - Los parámetros que se envían al servidor (idmedidor)
     * @param  {function} completado - Función invocada cuando cargan datos desde 
     * servidor (generarFinanciacionVista.consultarDetalleMedidorCompleto)
     * @returns {void}
     */
    consultarDetalleMedidor: function (data, completado){
        __cnn.ajax({
            'url':'../registrar_lectura/detallemedidor/',
            'data':data,
            'completado':completado
        });
    },
    /**
     * Consulta el historial de lecturas de  un medidor
     * @param  {object} data - Los parámetros que se envían al servidor (idsuscripcion,fechainicial, fechafinal)
     * @param  {function} completado - Función invocada cuando cargan datos desde 
     * servidor (generarFinanciacionVista.onConsultarHistorialCompleto)
     * @returns {void}
     */
    consultarHistorial: function (data, completado){
        __cnn.ajax({
            'url':'../registrar_lectura/encabezadohistorico/',
            'data':data,
            'completado':completado
        });
    },
    /**
     * Consulta las novedades que puede presentar una lectura
     * @param  {function} completado - Función invocada cuando cargan datos desde 
     * servidor (generarFinanciacionVista.onConsultarNovedadesCompleto)
     * @returns {void}
     */
    consultarNovedades: function (completado){
        __cnn.ajax({
            'url':'../registrar_lectura/obtenernovedad/',
            'completado':completado
        });
    },
    /**
     * Consulta las anomalías que puede presentar una lectura
     * @param  {function} completado - Función invocada cuando cargan datos desde 
     * servidor (generarFinanciacionVista.onConsultarAnomaliasCompleto)
     * @returns {void}
     */
    consultarAnomalias: function (completado){
        __cnn.ajax({
            'url':'../registrar_lectura/obteneranomalia/',
            'completado':completado
        });
    },
    
    validaTipoUsoSuscripcion: function (data, completado){
        __cnn.ajax({
            'url':'valida_tipo_uso_factura/',
            'data':data,
            'completado':completado
        });
    },
    
};