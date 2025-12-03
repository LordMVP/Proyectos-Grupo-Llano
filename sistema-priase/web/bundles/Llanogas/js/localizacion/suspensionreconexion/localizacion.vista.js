/**
 * @fileOverview Archivo de vista y control para el proceso que genera suspensiones
 * @author AppFuture
 * @requires proceso.suspension.control.js
 * @requires proceso.suspension.modelo.js
 * @version 1.1.0
 * @namespace procesoSuspensionVista
 */

/**
 * Objeto que hace referencia al namespace procesoSuspensionVista
 * @type {Object}
 */
var that = null;
var localizacionVista = {
    /**
     * Inicializa la página y asigna los listeners de los controles
     * @param {number} opcion - Verifica la cantidad de procesos activos en el momento
     * @param {Array} arrayTiposDeUso - Arreglo de los tipos de uso que tiene una empresa
     */
    init: function () {
        that = this;
        $("#btnConsultar").on("click", that.onConsultarPuntosGPS);
        $("#tipoLocalizacion").on("change", that.onActualizarVista);
        //__dom.configurarCalendario("fecIniSuspension, #fecFinSuspension");
    },
    
    onActualizarVista: function () {
      
        var localizar = $("#tipoLocalizacion option:selected").val();
      
        if (localizar == 1){
            $("#tipoActividad ").prop("disabled",false);
        } else {
            $("#tipoActividad ").prop("disabled","disabled");
        }
        
    },
    
    /**
     * Consulta los tipos de uso de la empresa
     * @deprecated version 1.0.0 Ahora se envía en el index del twig
     * @param {Object} data - Respuesta del servidor
     */
    onConsultarPuntosGPS: function () {
        //alert("Consultando puntos GPS");
        
        var fecha = $("#fechaConsulta").val();
        var localizar = $("#tipoLocalizacion option:selected").val();
        var actividad = $("#tipoActividad option:selected").val();
        var cuadrilla = $("#cuadrilla option:selected").val();
        
        console.log("Localizacion "+localizar);
        console.log("Fecha Consulta "+fecha);
        console.log("Tipo Actividad "+actividad);
        console.log("Cuadrilla "+cuadrilla);
        
        localizacionControl.consultarLocalizacionCuadrilla(
                {"fecha":fecha, "localizar":localizar, "actividad":actividad, "cuadrilla":cuadrilla}, that.finalizacionConsulta);
        
        
        /*if (data.codigoRespuesta === 1) {
            procesoSuspensionModel.tiposDeUso = data.datos;
            fillTable('tblTiposuso', 'formatoTipoUso', data.datos, '');
        }*/
    }, 
    
    finalizacionConsulta: function (data) {
        console.log(data);
        
    }
};
localizacionVista.init();