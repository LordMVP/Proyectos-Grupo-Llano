/**
 * @fileOverview Archivo de control de registrar rápido suspensiones y reconexiones
 * @author AppFuture
 * @version 1.0.0
 */
/** @namespace */
var registroControl = {
    /**
     * Consulta los municipios que cumplan con el texto
     * @param  {object} data - Los parámetros que se envían al servidor (municipio)
     * @param  {function} completado - función de callback (registroVista.mostrarResultadoMunicipios)
     * @returns {void}
     */
    consultarMunicipios: function (data, completado) {
        __cnn.ajax({
            "url": "obtener_municipios/",
            "data": data,
            "completado": completado
        });
    },
    /**
     * Consulta barrios por municipio
     * @param  {object} data - Los parámetros que se envían al servidor (idmunicipio)
     * @param  {function} completado - función de callback que se invoca cuando 
     * se cargan los datos desde el servidor (registroVista.onConsultarBarriosCompleto)
     * @returns {void}
     */
    consultarBarrios: function (data, completado) {
        __cnn.ajax({
            "url": "../../liquidacion/gestionar_liquidacion/obtener_barrios/",
            "data": data,
            "completado": completado
        });
    },
    /**
     * Muestra datos básicos de los terceros que coincidan
     * @param  {object} data - Los parámetros que se envían al servidor (nombre)
     * @param  {function} completado - función de callback que se invoca cuando 
     * se cargan los datos desde el servidor (registroVista.mostrarResultadoTerceros)
     * @returns {void}
     */
    consultarTerceros: function (data, completado) {
        __cnn.ajax({
            "url": "../suspensiones/consultar_terceros_suspension",
            "data": data,
            "completado": completado
        });
    },
    /**
     * Consulta las novedades de suspensión
     * @param  {function} completado - función anónima
     * @returns {void}
     */
    consultarNovedadesSusLista: function (completado) {
        __cnn.ajax({
            "url": "novedades_suspension/",
            "completado": completado
        });
    },
    /**
     * Consulta las novedades de reconexión
     * @param  {function} completado - función anónima
     * @returns {void}
     */
    consultarNovedadesRecLista: function (completado) {
        __cnn.ajax({
            "url": "novedades_reconexion/",
            "completado": completado
        });
    },
    /**
     * Consulta los tipos de suspensión
     * @param  {function} completado - función anónima
     * @returns {void}
     */
    consultarTipoSuspensionLista: function ( completado) {
        __cnn.ajax({
            "url": "tipos_suspension/",
            "completado": completado
        });
    },
    /**
     * Consulta la información de las suspensiones a registrar
     * @param  {object} data - Los parámetros que se envían al servidor
     * @param  {function} completado - función de callback (registroVista.buscarSuspensionesTablaCompletado)
     * @returns {void}
     */
    consultarTablaSuspensiones:function(data, completado){
        __cnn.ajax({
            "url": "tabla_suspensiones/",
            "data": data,
            "completado": completado
        });
    },
    /**
     * Consulta la información de las reconexiones a registrar
     * @param  {object} data - Los parámetros que se envían al servidor
     * @param  {function} completado - función de callback (registroVista.buscarReconexionesTablaCompletado)
     * @returns {void}
     */
    consultarTablaReconexiones:function(data, completado){
        __cnn.ajax({
            "url": "tabla_reconexiones/",
            "data": data,
            "completado": completado
        });
    },

    /**
     * Guarda la información de las suspensiones que fue modificada en la interfaz
     * @param  {object} data - Los parámetros que se envían al servidor (suspension)
     * @param  {function} completado - función de callback (registroVista.onGuardarCompleto)
     * @returns {void}
     */
    guardarSuspensiones:function(data, completado){
        __cnn.ajax({
            "url": "info_suspensiones/",
            "data": data,
            "completado": completado
        });
    },
    /**
     * Guarda la información de reconexiones que fue modificada en la interfaz
     * @param  {object} data - Los parámetros que se envían al servidor (reconexion)
     * @param  {function} completado - función de callback (registroVista.onGuardarCompleto)
     * @returns {void}
     */
    guardarReconexiones:function(data, completado){
        __cnn.ajax({
            "url": "info_reconexiones/",
            "data": data,
            "completado": completado
        });
    },
    
    /** Valida que una caja de texto sólo acepte el ingreso de letras
     * @param {object} e - Caja de texto que se valida
     * @returns {void}
     **/
    validacionSoloCaracter: function (e) {
        var theEvent = e || window.event;
        var key = theEvent.keyCode || theEvent.which;
        if (key === 37 || key === 38 || key === 39 || key === 40 || key === 8 || key === 46) { // Left / Up / Right / Down Arrow, Backspace, Delete keys
            return;
        }
        key = String.fromCharCode(key);
        key.toUpperCase();
        var regex = /([NSns])/;
        if (!regex.test(key)) {
            theEvent.returnValue = false;
            if (theEvent.preventDefault){
                theEvent.preventDefault();
            }
        }
    },
    /**
     * Consulta las filas que han sufrido cambios
     */
    consultarObjetosCambiado: function(){
        for(var indice = 0; indice < registroModelo.suspension.length; indice++){
            var suspension = registroModelo.suspension[indice];
            
                for(i in suspension.cambios){
                    if(suspension.cambios[i]){
                        console.log('Cambió: '+ i + ' En la fila '+ indice);
                    }
                }
            
        }
    }
    
};