/**
 * @fileOverview Archivo de control de financiación
 * @author AngélicaG.
 * @requires consignaciones.modelo.js
 * @version 1.0.0
 */

/** @namespace */
var consignacionesControl = {
    /** Consulta recaudos que 
     * @param  {object} data - Parámetros que se envían al servidor (idmediopago,idsucursal)
     * @param  {function} success - Función invocada cuando cargan datos desde servidor 
     * (consignacionesVista.onConsultarRecaudoCompleto)
     * @returns {void}
     */
    consultaRecaudos: function (data, completado) {
        __cnn.ajax({
            'url': 'consolidado/',
            'data': data,
            'completado': completado
        });
    },
    /** Consulta recaudos por empresa y valor
     * @param  {object} data - Parámetros que se envían al servidor (idmediopago,idsucursal, fecha)
     * @param  {function} success - Función invocada cuando cargan datos desde servidor 
     * (consignacionesVista.onConsultarRecaudosEmpresa)
     * @returns {void}
     */
    consultarEmpresasRecaudo: function (data, completado) {
        __cnn.ajax({
            'url': 'consolidadoempresa/',
            'data': data,
            'completado': completado
        });
    },
    /** Consulta toda la información de un recaudo, además formas de pago
     * @param  {object} data - Parámetros que se envían al servidor (idmediopago,idsucursal, fecha)
     * @param  {function} success - Función invocada cuando cargan datos desde servidor (Función anónima)
     * @returns {void}
     */
    consultarDetallesRecaudo: function (data, completado) {

        __cnn.ajax({
            'url': 'recaudosdetalles/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta los cheques de la consignación
     * @param {Object} data - Información enviada al servidor como filtro (idconsignacion)
     * @param {Function} completado - Función que recibre la información (agregarCheque)
     */
    consultarCheques: function (data, completado) {

        __cnn.ajax({
            'url': 'recaudoscheques/',
            'data': data,
            'completado': completado
        });
    },
    /** Consulta los bancos que tiene convenio con la empresa seleccionada
     * @param  {object} data - Parámetros que se envían al servidor (idmediopago,idsucursal, idempresa)
     * @param  {function} success - Función invocada cuando cargan datos desde servidor 
     * (consignacionesVista.onConsultarBancosCompleto)
     * @returns {void}
     */
    consultarBancos: function (data, completado) {
        __cnn.ajax({
            'url': 'bancos/',
            'data': data,
            'completado': completado
        });
    },
    /** Consulta los tipos de cuenta que ofrece un banco seleccionado
     * @param  {object} data - Parámetros que se envían al servidor (idmediopago,idsucursal, idbanco)
     * @param  {function} success - Función invocada cuando cargan datos desde servidor 
     * (consignacionesVista.onConsultarTipoCuentaCompleto)
     * @returns {void}
     */
    consultarTipoCuenta: function (data, completado) {
        __cnn.ajax({
            'url': 'tipocuentas/',
            'data': data,
            'completado': completado
        });
    },
    /** Consulta las cuentas con cierto tipo de cuenta de un banco
     * @param  {object} data - Parámetros que se envían al servidor (idmediopago,idsucursal, idbanco, tipocuenta)
     * @param  {function} success - Función invocada cuando cargan datos desde servidor 
     * (consignacionesVista.onConsultarCuentasCompleto)
     * @returns {void}
     */
    consultarCuentas: function (data, completado) {
        __cnn.ajax({
            'url': 'cuentas/',
            'data': data,
            'completado': completado
        });
    },
    /** Graba en la base de datos la nueva consignaicón
     * @param  {object} data - Parámetros que se envían al servidor (datos)
     * @param  {function} success - Función invocada cuando cargan datos desde servidor 
     * (consignacionesVista.onGrabarCompleto)
     * @returns {void}
     */
    grabarConsignacion: function (data, completado) {
        __cnn.ajax({
            'url': 'grabar/',
            'data': data,
            'completado': completado
        });
    },
    /** Elimina un archivo del servidor
     * @param  {object} data - Parámetros que se envían al servidor (idarchivo)
     * @param  {function} success - Función invocada cuando cargan datos desde servidor 
     * (consignacionesVista.onEliminarArchivoCompleto)
     * @returns {void}
     */
    eliminarArchivo: function (data, completado) {
        __cnn.ajax({
            'url': 'eliminararchivo/',
            'data': data,
            'completado': completado
        });
    },
    /** Consulta las consignaciones que coincidan con los parámetros de búsquedas.
     * @param  {object} data - Parámetros que se envían al servidor (idmediopago, fechainicio, fechafin, idconsignacion)
     * @param  {function} success - Función invocada cuando cargan datos desde servidor 
     * (consignacionesVista.onConsultarConsignacionCompleto)
     * @returns {void}
     */
    buscarConsignacion: function (data, completado) {
        __cnn.ajax({
            'url': 'buscar/',
            'data': data,
            'completado': completado
        });
    },
    /** Consulta todos los detalles e información de una consignación
     * @param  {object} data - Parámetros que se envían al servidor (idconsignacion)
     * @param  {function} success - Función invocada cuando cargan datos desde servidor 
     * (consignacionesVista.onConsultarDetalleConsignacionCompleto)
     * @returns {void}
     */
    consultarDetalleConsignacion: function (data, completado) {
        __cnn.ajax({
            'url': 'informacionconsolidado/',
            'data': data,
            'completado': completado
        });
    },
    /** Consulta la información de la empresa actual
     * @param  {function} success - Función invocada cuando cargan datos desde servidor 
     * (consignacionesVista.onConsultarEmpresaCompleto)
     * @returns {void}
     */
    consultarEmpresaActual: function (completado) {
        __cnn.ajax({
            'url': 'consultar_empresa/',
            'completado': completado
        });
    },
    /**
     * Consulta las empresas que existen en las fechas de recaudos seleccionadas y que son diferentes a la empresa actual
     */
    consultarEmpresasPermitidasConsignacion: function () {
        var arrayEmpresas = [];
        var empresaActual = consignacionesModel.informacionEmpresaActual;
        for (var indice = 0; indice < consignacionesModel.recaudosEmpresa.length; indice++) {
            var empresa = consignacionesModel.recaudosEmpresa[indice];
            if (parseInt(empresa.idempresa) !== parseInt(empresaActual.idempresa)) {
                arrayEmpresas.push(empresa);
            }
        }
        arrayEmpresas.push(empresaActual);
        consignacionesModel.empresasDisponibles = arrayEmpresas;
    },
    /**
     * Valida si una empresa existe en el objeto guardado de las otras empresas que están en fechas de recaudo
     * @param {number} id - Id de la empresa que se está buscando
     * @returns {boolean}
     */
    validarExistenciaEmpresa: function(id){
        id = parseInt(id);
        for(var i = 0; i < consignacionesModel.empresasDisponibles.lenght; i++){
            var empresa = consignacionesModel.empresasDisponibles[i];
            if(id === parseInt(empresa.idempresa)){
                return true;
            }
        }
        return false;
    }
};