/**
 * @fileOverview Archivo de vista para cargar actualizacion Estratificacion y numeros catatrales
 * @author angelicaGomez
 * @requires cargarestratocatastral.control.js
 * @requires cargarestratocatastral.modelo.js
 * @version 1.0.0
 */

/**
 * Objeto que hace referencia al namespace cargarestratocatastralVista
 * @type {object}
 */
var that = null; 
/** @namespace*/
var cargarestratocatastralVista = {
    /**
    * Último dialogo abierto en la aplicación
    * @returns {void}
    **/
    dialogoActual: null,
    /**
    * Inicializa el prorama de cargar estrato catastral
    * @returns {void}
    **/
    init: function() {
        that = this;
        $('#btnCargar').on('click', that.cargarestratocatastral);
        $('#btnResultado').on('click', that.mostrarresultadoactualizacionestratocatastral);        
        $('#btnResumen').on('click', function(){
            cargarestratocatastralControl.consultaresumentablatemporal(that.descargaArchivoResumen);
        }); 
    },
    /**
     * Inicia proceso de cargar estrato catastral
     * @returns {void}
     **/
    cargarestratocatastral: function (e) {
        if($('#txtArchivo').val() !== "" && $('#txtResolucion').val().length >10 && $('#txtResolucion').val().length <=50 ){
            var archivo = $('#txtArchivo').prop('files')[0];
            var data = new FormData();
            var resolucion = new array();
            data.append('archivo', archivo);
             var resolucion = {
                resolucion: $('#txtResolucion').val(),
             };              
             that.appload.uploadFiles(resolucion);
             
            var proceso = $('#divInfoProceso');
            proceso.show();
       }else{
           if($('#txtArchivo').val() == ""){
           __dom.lanzarAlerta("Debe seleccionar un archivo", __app.mensajes.atencion);
           e.preventDefault();
            }else if($('#txtResolucion').val().length <10 || $('#txtResolucion').val().length >50){
                    __dom.lanzarAlerta("Cantidad de caracteres en Resolucion/Decreto NO Valido (Digite minimo 10 y maximo 50 caracteres)", __app.mensajes.atencion);
                    e.preventDefault();
            }
       }
        
    },
    mostrarresultadoactualizacionestratocatastral:function(){
        var data = 1;
        cargarestratocatastralControl.consultartablatemporal(data,that.mostraresultado);
        
    },    
    mostraresultado : function (data){
        console.log(data);
       var mostrarResultado = $('#mostrarResultado'); 
    },
    
    descargaArchivoResumen : function (data){
        console.log(data);
        downloadFileDirect(data);
    }
};
cargarestratocatastralVista.init();