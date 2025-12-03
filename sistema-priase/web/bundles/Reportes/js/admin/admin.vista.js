// Autor : Jimmy Starwin Pardo sierra
// Fecha : 2015-10-15

var that = null;
/** Inicializa comportamiento de Botones de comandos 
 * @return {void}
 */
var adminVista = {
    init: function () {
        that = this;
        $('#btnCargarArchivo').on('click', that.cargarArchivo);
        $("#fileReport").change(function () {
            var filename = $(this).val();
            var extension = filename.replace(/^.*\./, '');
            if(extension!="jasper"&&extension!="jrxml" && extension!="png" && extension!="jpg" && extension!="jpeg"){
                __dom.lanzarAlerta("El archivo seleccionado no es valido, solo se permiten archivos con extension jrxml,jasper,png,jpg","Error de archivo");
                $(this).val(null);
            }            
        });
    },
    cargarArchivo: function () {
        adminControl.cargarArchivo("cargarArchivo");
    }
};
adminVista.init();

