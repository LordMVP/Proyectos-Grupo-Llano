//Objeto para gestionar las peticiones AJAX Modificar Suscripción
var modificarsuscripcionControl = {
    /**
     * Consulta los barrios correspondientes al municipio seleccionado
     * @param  {object} data - Parámetros que se envían al servidor (idmunicipio)
     * @param  {function} completado - Función callback (modificarsuscripcionVista.onConsultarBarriosCompleto)
     * @returns {void}
     */
    consultarBarrios: function(data, completado) {
        __cnn.ajax({
            'url': '../gestionar_suscripcion/barrios/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta los ciclos en función del ciclo de la suscripción
     * @param  {object} data - Parámetros que se envían al servidor (idruta, idciclo)
     * @param  {function} completado - Función callback (modificarsuscripcionVista.onConsultarCiclosCompleto)
     * @returns {void}
     */
    consultarCiclos: function(data, completado) {
        __cnn.ajax({
            'url': 'ciclos/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta el ciclo y la ruta correspondiente al municipio y al barrio
     * @param  {object} data - Parámetros que se envían al servidor (idmunicipio, idbarrio)
     * @param  {function} completado - Función callback (modificarsuscripcionVista.onConsultarCicloRutaCompleto)
     * @returns {void}
     */
    consultarCicloRuta: function(data, completado) {
        __cnn.ajax({
            'url': '../gestionar_suscripcion/cicloruta/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta los conceptos que tiene asociados actualmente la suscripción
     * @param  {object} data - Parámetros que se envían al servidor (idsuscripcion)
     * @param  {function} completado - Función callback (modificarsuscripcionVista.onConsultarConceptosDesdeModificarCompleto)
     * @returns {void}
     */
    consultarConceptosDesdeModificar: function(data, completado) {
        __cnn.ajax({
            'url': 'conceptos/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta los conceptos de una liquidación y el programa
     * @param  {object} data - Parámetros que se envían al servidor (idliquidacion, idprograma(58) )
     * @param  {function} completado - Función callback (modificarsuscripcionVista.onConsultarConceptosCompleto)
     * @returns {void}
     */
    consultarConceptos: function(data, completado) {
        __cnn.ajax({
            'url': '../gestionar_suscripcion/conceptos/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta un concepto según su id 
     * @param  {object} data - Parámetros que se envían al servidor (idconcepto)
     * @param  {function} completado - Función callback (modificarsuscripcionVista.cargarConceptoSinAsignar)
     * @returns {void}
     */
    consultarConceptoPorId: function(data, completado) {
        __cnn.ajax({
            'url': '../gestionar_suscripcion/conceptos/info/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta las suscripciones que coincidan con los parámetros de búsquedas.
     * @param  {object} data - Parámetros que se envían al servidor (idsuscripcion)
     * @param  {function} completado - Función callback (modificarsuscripcionVista.onconsultarDetalleSuscripcionCompleto)
     * @returns {void}
     */
    consultarDetalleSuscripcion: function(data, completado) {
        __cnn.ajax({
            'url': '../gestionar_suscripcion/detalle/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta las liquidaciones según ciclo, tipo uso y municipio
     * @param  {object} data - Parámetros que se envían al servidor (idmunicipio, idtipousosuscripcion, idciclo)
     * @param  {function} completado - Función callback (modificarsuscripcionVista.onConsultarLiquidacionesCompleto)
     * @returns {void}
     */
    consultarLiquidaciones: function(data, completado) {
        __cnn.ajax({
            'url': '../gestionar_suscripcion/liquidaciones/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta los ciclos en función del ciclo y la ruta de la suscripción
     * @param  {object} data - Parámetros que se envían al servidor (idsuscripcion)
     * @param  {function} completado - Función callback (modificarsuscripcionVista.onconsultarDetalleSuscripcionCompleto)
     * @returns {void}
     */
    consultarTerceros: function(data, completado) {
        __cnn.ajax({
            'url': '../gestionar_suscripcion/terceros/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta los tipos de suscripcion existentes
     * @param  {object} data - Parámetros que se envían al servidor (idconvenio, idmunicipio)
     * @param  {function} completado - Función callback (modificarsuscripcionVista.onConsultarTiposSuscripcionCompleto)
     * @returns {void}
     */
    consultarTiposSuscripcion: function(data, completado) {
        __cnn.ajax({
            'url': '../gestionar_suscripcion/tipos_suscripcion/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta tipos de uso de suscripción según el ciclo
     * @param  {object} data - Parámetros que se envían al servidor (idciclo)
     * @param  {function} completado - Función callback (modificarsuscripcionVista.onConsultarTiposUsoSuscripcionCompleto)
     * @returns {void}
     */
    consultarTiposUsoSuscripcion: function(data, completado) {
        __cnn.ajax({
            'url': '../gestionar_suscripcion/tipos_uso_suscripcion/',
            'data': data,
            'completado': completado
        });
    },
    
    
    /**
     * Consulta tipos de uso de suscripción según el ciclo
     * @param  {object} data - Parámetros que se envían al servidor (idciclo)
     * @param  {function} completado - Función callback (modificarsuscripcionVista.onConsultarTiposUsoSuscripcionCompleto)
     * @returns {void}
     */
    consultarTiposUsoCiclo: function(data, completado) {
        __cnn.ajax({
            'url': '../gestionar_suscripcion/tipos_uso_ciclo/',
            'data': data,
            'completado': completado
        });
    },
    
    
    /**
     * Consulta una o varias suscripciones en funcion de la combinación de campos de búsqueda
     * @param  {object} data - Parámetros que se envían al servidor 
     * @param  {function} completado - Función callback (modificarsuscripcionVista.onConsultarSuscripcionCompleto)
     * @returns {void}
     */
    consultarSuscripcion: function(data, completado) {
        __cnn.ajax({
            'url': '../gestionar_suscripcion/buscar/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta las propiedades asignadas y sin asignar
     * @param  {object} data - Parámetros que se envían al servidor (idsuscripcion)
     * @param  {function} completado - Función callback (modificarsuscripcionVista.onconsultarDetalleSuscripcionCompleto)
     * @returns {void}
     */
    consultarPropiedad: function(data, completado) {
        __cnn.ajax({
            'url': '../gestionar_suscripcion/buscar_propiedad/',
            'data': data,
            'completado': completado
        });
    },
    
    /**
     * Guarda la información de la suscripción actualizada
     * @param  {object} data - Parámetros que se envían al servidor (datos)
     * @param  {function} completado - Función callback (modificarsuscripcionVista.onGrabarSuscripcionCompleto)
     * @returns {void}
     */
    grabarSuscripcion: function(data, completado) {
        __cnn.ajax({
            'url': '../gestionar_suscripcion/grabar/',
            'data': data,
            'completado': completado
        });
    }, 
    /**
     * Consulta y validar si un concepto se puede eliminar
     * @param  {object} data - Parámetros que se envían al servidor (idconcepto)
     * @param  {function} completado - Función callback (modificarsuscripcionVista.onConsultarEliminarConceptoCompleto)
     * @returns {void}
     */
    consultarEliminarConcepto: function(data, completado) {
        __cnn.ajax({
            'url': '../gestionar_suscripcion/concepto/eliminar/',
            'data': data,
            'completado': completado
        });
    },
    
    /**
     * Consulta las avtividades relacionados a la suscripción
     * @returns {undefined}
     */
    consultarActividadEconomica: function (completado) {
        __cnn.ajax({
            'url': '../gestionar_suscripcion/actividadeconomica/',
            'completado': completado
        });
    },
    
    getClienteLineaMatriz: function(data, completado) {
        __cnn.ajax({
            'url': 'clienteslineamatriz/',
            'data': data,
            'completado': completado
        });
    },
    
    setRetiraClienteLineaMatriz: function(data, completado) {
        __cnn.ajax({
            'url': 'clienteslineamatrizretira/',
            'data': data,
            'completado': completado
        });
    },
    
    getClienteLineaMatrizParaVincular: function(data, completado) {
        __cnn.ajax({
            'url': 'buscaclienteslineamatriz/',
            'data': data,
            'completado': completado
        });
    },
    
    insertaClienteLineaMatrizAVincular: function(data, completado) {
        __cnn.ajax({
            'url': 'insertaclientelineamatrizavincular/',
            'data': data,
            'completado': completado
        });
    }
    
};

