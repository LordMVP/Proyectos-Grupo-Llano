/**
 * @fileOverview Archivo de vista para cargar factor corrección
 * @author angelicaGomez
 * @requires cargarfactorcorreccion.control.js
 * @requires cargarfactorcorreccion.modelo.js
 * @version 1.0.0
 */

/**
 * Objeto que hace referencia al namespace cargarfactorcorreccionVista
 * @type {object}
 */
var that = null; 
/** @namespace*/
var cargarfactorcorreccionVista = {
    /**
    * Último dialogo abierto en la aplicación
    * @returns {void}
    **/
    dialogoActual: null,
    /**
    * Inicializa el prorama de cargar factor corrección
    * @returns {void}
    **/
    init: function() {
        that = this;
        $('#btnCargar').on('click', that.cargarFactorCorreccion);
        
        that.appload = new Appload();
    },
    /**
     * Inicia proceso de cargar factor corrección
     * @returns {void}
     **/
    cargarFactorCorreccion: function (e) {
        if($('#txtArchivo').val() !== ""){
            var archivo = $('#txtArchivo').prop('files')[0];
            var data = new FormData();
            var cargueIndustrial = [];
            
            data.append('archivo', archivo);
          
            if( $('#checkIndustrial').prop('checked') ) {
               $('#checkIndustrial').attr('checked', true);
                var cargueIndustrial = {
                    cargueIndustrial: 1
                };              
                
              that.appload.uploadFiles(cargueIndustrial);
            }
            $('#btnSubmit').click();
            var proceso = $('#divInfoProceso');
            proceso.show();
       }else{
           __dom.lanzarAlerta("Debe seleccionar un archivo", __app.mensajes.atencion);
           e.preventDefault();
       }
        
    }
    
};
cargarfactorcorreccionVista.init();