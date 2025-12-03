/**
 * @fileOverview Archivo para funcionalidad de petición ajax
 * @author appfuture
 * @version 1.0.0
 */

/** @namespace */
function Cnn(){};

/** 
 * Función global para hacer construir petición ajax
 * @param {object} args - Información de petición ajax (puede ser null y tomará valores por defecto)
 * @return {object} result - Respuesta del servidor
 **/
Cnn.prototype.ajax = function(args) {
    var caller = this;
    var result = undefined;
    var defecto = {
        'url':args.url,
        'data':(args.data)?args.data:null,
        'type': (args.metodo)?args.metodo : 'POST',
        'async': (args.async!==null || args.async!==undefined)?args.async:true,
        'dataType': (args.tipo)?args.tipo:'json',
        'success': function(data){
            __dom.ocultarCargador();
            __app.ajustarAnchoMenu();
            if(args.async!==undefined && args.async===false){
                result = data;
                return;
            }
            switch(data.codigoRespuesta){
                case -2:
                    __app.cerrarSesion();
                break;
                case -1:
                    __app.controlarError(data);
                break;
            }
            args.completado(data);
        },
        'error': function(error){
            __app.ajustarAnchoMenu();
            caller.capturarError(error);
            if(args.error){
                args.error(error);
            }
        },
        'beforeSend': function(){
            if(!args.background){
                __dom.mostrarCargador(args.modal);
            }
            return;
        },
        'timeout':180000000
    };
    try{
        $.ajax(defecto);
    }catch(Err){
        console.info(Err);
    }
    return result;
};

/** 
 * Captura el error cuando se hace petición ajax 
 * @param {object} _error, error captura
 * @return {void}
 **/

Cnn.prototype.capturarError = function(_error) {
    __dom.ocultarCargador();
    __app.controlarError(arguments);
};
