/**
 * @fileOverview Archivo de vista y control Habilitar Ventas
 * @author oabaquero
 * @requires habilitarVenta.control.js
 * @version 1.0.0
 */
/**
 * Objeto que hace referencia al namespace habilitaVentaVista
 * @type {Object}
 */
var that = null;
/** @namespace */

var habilitaVentaVista = {
    dialogoActual: null,
    
    /**Inicializa el programa de habilitar venta, y asigna listeners a los controles
     * @returns {void}
     */
   
    init: function () {
       
        that = habilitaVentaVista;
        that.cargando = true;
        $('select#cmbIdVenta').on('blur', that.mostarComentarios);
        $('#btnHabilitarVenta').on('click', that.cambiarEstadoVenta);
  
    },
    
     /**
     * Recarga la página web
     * @returns {void}
     */
    recargar: function () {
        window.location.reload();
    },
    
    /*
     * Muestara los comentarios de las ventas Habilitadas 
     * @returns {type} 
     */
    mostarComentarios: function(){
        $('#txtObservacionesActual').val("");
        $('#btnHabilitarVenta').attr('disabled',true);
        var idVenta = $('#cmbIdVenta').val();
        
           if ($('#cmbIdVenta').val() == '-1') {
                    $('#divCargando').hide();
                    __dom.lanzarAlerta("Por favor Seleccione un Número de Venta", __app.mensajes.atencion);
                    return;
           }
                
        habilitaVentaControl.buscarComentarios({idVenta}, that.onRespuestaComentario);
    },
    
    onRespuestaComentario : function(data){
       $('#txtObservacionesVesiones').val("");
       var contador = 0;
       var concatenaCadena ="";
        for(i=0;i<data.comentario.length;i++){
            var comentario = data.comentario;
            concatenaCadena += comentario[i]['comentario']+"\n";
            contador ++;
        }
        for(i=0;i<data.infousuario.length;i++){
            var infoUsuario = data.infousuario;
            console.log(infoUsuario);
            $("#txtpcodigo").val(infoUsuario[0]['pcodigo']);
            $("#txtIdSuscriptor").val(infoUsuario[0]['suscriptor']);
            $("#txtIdSuscripcion").val(infoUsuario[0]['idsuscripcion']);
            $("#txtNombre").val(infoUsuario[0]['nombre_completo']);
            $("#txtDocumento").val(infoUsuario[0]['documento']);
            $("#txtConvenio").val(infoUsuario[0]['tipouso']);
        }
        $('#obsComentario').show();
         $('textarea#txtObservacionesVesiones').val(concatenaCadena);
        if(contador<data.version){
            $('#btnHabilitarVenta').removeAttr('disabled');            
        }
    },
    
    cambiarEstadoVenta: function(){
        
        if ($('#cmbIdVenta').val() == '-1') {
                    $('#divCargando').hide();
                    __dom.lanzarAlerta("Por favor Seleccione un Número de Venta", __app.mensajes.atencion);
                    return;
        }
        if($('#txtObservacionesActual').val()=='' || $('#txtObservacionesActual').val() == null){
            
            __dom.lanzarAlerta("Por favor digite minimo 10 caracteres", __app.mensajes.atencion);
        }else{
            var cuentaCaractere=0;
            for(i=0;i<$('textarea#txtObservacionesActual').val().length;i++){
             cuentaCaractere ++;   
            }
            
            if(cuentaCaractere<10){
                 __dom.lanzarAlerta("Por favor digite minimo 10 caracteres", __app.mensajes.atencion);
                return
            }
            that.dialogoActual = $('#divConfirmar').dialogo({
                    resizable: false,
                    heigth: 350,
                    modal: true,
                    title: 'Habilitar Venta No. '+$('#cmbIdVenta').val(),
                    buttons: {
                        "Sí": function () {
                            $('#btnHabilitarVenta').attr('disabled',true);
                            $('#divCargando').show();
                            
                            var datos = {     idVenta: $('select#cmbIdVenta').val(),
                                                observacion: $('#txtObservacionesActual').val()
                                            }
                                console.log(datos);
                            that.dialogoActual.dialog('close');
                            habilitaVentaControl.guardarVenta(datos,that.respuestaVentaGuarda)

                        }, Cancelar: function () {
                            that.dialogoActual.dialog("close");
                        }
                    }
                });
        }
    },
    
    respuestaVentaGuarda: function(data){
        
        switch (data.codigoRespuesta){
            case 1:
                 __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                that.recargar();
                break;
            case -1:
                 __dom.lanzarAlerta(data.mensaje, __app.mensajes.atencion);
                that.recargar();
                break;
        }
    }
    
};
habilitaVentaVista.init();