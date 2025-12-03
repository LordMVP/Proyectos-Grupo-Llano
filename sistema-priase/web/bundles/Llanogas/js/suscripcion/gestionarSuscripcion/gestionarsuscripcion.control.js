/**
 * @fileOverview Archivo de control de Gestionar Suscripción
 * @author jeissonBarriga
 * @requires gestionarsuscripcion.control.js
 * @requires gestionarsuscripcion.modelo.js
 * @version 1.0.0
 */
var gestionarsuscripcionControl = {
    /**
     * Consulta los barrios correspondientes al municipio seleccionado
     * @param  {object} data   Los parámetros de la consulta (idmunicipio)
     * @param  {function} completado Función de callback ejecutada al finalizar 
     * la consulta (gestionarsuscripcionVista.onConsultarBarriosCompleto)
     * @returns {void}
     */
    consultarBarrios: function (data, completado) {
        __cnn.ajax({
            'url': 'barrios/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta el ciclo y la ruta correspondientes al municipio y al barrio 
     * seleccionados
     * @param  {object} data Los parámetros de la consulta (idmunicipio, 
     * idbarrio)
     * @param  {function} completado Función de callback ejecutada al finalizar 
     * la consulta (gestionarsuscripcionVista.onConsultarCicloRutaCompleto)
     * @returns {void}
     */
    consultarCicloRuta: function (data, completado) {
        __cnn.ajax({
            'url': 'cicloruta/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta los conceptos relacionados a la suscripción en función de la
     * loquidación seleccionada
     * @param  {object} data Los parámetros de la consulta (idmunicipio, 
     * idbarrio)
     * @param  {function} completado Función de callback ejecutada al finalizar 
     * la consulta (gestionarsuscripcionVista.onConsultarCicloRutaCompleto)
     * @returns {void}
     */
    consultarConceptos: function (data, completado) {
        __cnn.ajax({
            'url': 'conceptos/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta los conceptos relacionados a la suscripción
     * @param  {object} data Los parámetros de la consulta (idmunicipio, 
     * idbarrio)
     * @param  {function} completado Función de callback ejecutada al finalizar 
     * la consulta (gestionarsuscripcionVista.onConsultarCicloRutaCompleto)
     * @returns {void}
     */
    consultarConceptosDesdeModificar: function (data, completado) {
        __cnn.ajax({
            'url': '../modificar_suscripcion/conceptos/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta toda la información detallada de una suscripción
     * @param {Object} data - Parámetros para enviar al servido (idsuscripcion)
     * @param {Function} completado - FUnción que recibe la respuesta del servidor
     */
    consultarDetalleSuscripcion: function (data, completado) {
        __cnn.ajax({
            'url': 'detalle/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta en el servidor si se puede eliminar un concepto
     * @param {Object} data -
     * @deprecated
     * @param {Function} completado - Recibe la información del servidor (onConsultarEliminarConceptoCompleto)
     */
    consultarEliminarConcepto: function (data, completado) {
        __cnn.ajax({
            'url': 'concepto/eliminar/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta las liquidaciones que cumplan con los parámetros
     * @param {Object} data - Parámetros del filtro (idciclo, idtipousosuscripcion, idmunicipio)
     * @param {Function} completado - FUnción que procesa la información recibida (onConsultarLiquidacionesCompleto)
     */
    consultarLiquidaciones: function (data, completado) {
        __cnn.ajax({
            'url': 'liquidaciones/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta la información básica de los terceros
     * @param {Object} data - Información enviada al servidor (nombre)
     * @param {Function} completado - Función que procesa la información (mostrarResultado)
     */
    consultarTerceros: function (data, completado) {
        __cnn.ajax({
            'url': 'terceros/',
            'data': data,
            'completado': completado
        });
    },
    //consulta los tipos de suscripcion existentes
    consultarTiposSuscripcion: function (data, completado) {
        __cnn.ajax({
            'url': 'tipos_suscripcion/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * consulta los tipos de uso de suscripcion existentes
     * @deprecated Ahora se utiliza el método (consultarTiposUsoCiclo)
     * @param {Object} data
     * @param completado
     */
    consultarTiposUsoSuscripcion: function (data, completado) {
        __cnn.ajax({
            'url': 'tipos_uso_suscripcion/',
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
            'url': 'tipos_uso_ciclo/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta suscriptores que coincidan con los campos de búsqueda
     * @param {Object} data - Posibles filtros de suscriptores (idsuscriptor, idtercero o cedula)
     * @param {Function} completado -Función que procesa la información recibida (onConsultarSuscriptorCompleto)
     */
    consultarSuscriptor: function (data, completado) {
        __cnn.ajax({
            'url': 'filtrar_suscriptor/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta una o varias suscripciones en funcion de la combinación de campos de búsqueda
     * @param {Object} data - (idmunicipio, idtercero, cedula, direccion, numerocatastral, idbarrio, numeropropiedad, idsuscripcion, codigoanterior o ruta)
     * @param {Function} completado - Función que valida las suscripciones recibidas y así mostrar al usuario (onConsultarSuscripcionCompleto)
     */
    consultarSuscripcion: function (data, completado) {
        __cnn.ajax({
            'url': 'buscar/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta las propiedades asignadas y sin asignar de un tercero
     * @param {Object} data - Información de filtro en la información idtercero
     * @param {Function} completado - Función que recibe la información y la procesa según se necesite (onConsultarPropiedadCompleto)
     */
    consultarPropiedad: function (data, completado) {
        __cnn.ajax({
            'url': 'buscar_propiedad/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Guarda la información completa de la suscripción
     * @param {Object} data - Información de la suscripción que se desea guardar el objeto padre se llama datos
     * @param {Function} completado - FUnción que verifica el éxito en la acción
     */
    grabarSuscripcion: function (data, completado) {
        __cnn.ajax({
            'url': 'grabar/',
            'data': data,
            'completado': completado
        });
    },
    ///NO SE ESTÁ USANDO
    consultarEditables: function (id) {
        for (var i = 0; i < gestionarsuscripcionModelo.conceptosEditables.length; i++) {
            var concepto = gestionarsuscripcionModelo.conceptosEditables[i];
            if (parseInt(concepto.idconcepto) === parseInt(id)) {
                return {concepto: concepto, indice: i};
            }
        }
    },
    /**
     * Consulta las avtividades relacionados a la suscripción
     * @returns {undefined}
     */
    consultarActividadEconomica: function (completado) {
        __cnn.ajax({
            'url': 'actividadeconomica/',
            'completado': completado
        });
    },
    /**
     * Consulta un concepto según su id 
     * @param  {object} data - Parámetros que se envían al servidor (idconcepto)
     * @param  {function} completado - Función callback (modificarsuscripcionVista.cargarConceptoSinAsignar)
     * @returns {void}
     */
    consultarConceptoPorId: function (data, completado) {
        __cnn.ajax({
            'url': 'conceptos/info/',
            'data': data,
            'completado': completado
        });
    }
};