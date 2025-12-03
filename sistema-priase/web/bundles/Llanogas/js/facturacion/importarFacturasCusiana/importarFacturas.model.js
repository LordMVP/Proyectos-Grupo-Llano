/**
 * @fileOverview Archivo de modelo para importar facturas
 * @author angelicaGomez
 * @version 1.0.0
 */
/** @namespace */
var importarFacturasModelo = {
	archivos: [] 
};
/**
 * Formato para visualizar el progreso de la subido de los recaudos
 * @type {Object}
 */
var formatoProgreso = {
    thead: [
        {'id': 'thIdProceso', 'text': 'Id proceso', 'sort': false, 'refer': 'idacceso', 'type': 'text'},
        {'id': 'thFecha', 'text': 'Fecha', 'sort': false, 'refer': 'fechainicio', 'type': 'text'},
        {'id': 'thNumRegistros', 'text': 'Registros afectados', 'sort': false, 'refer': 'cantidad', 'type': 'text'},
        {'id': 'thUsuario', 'text': 'Usuario', 'sort': false, 'refer': 'usuario', 'type': 'text'},
    ]
};
/**
 * Formato que muestra el total de los recaudos subidos por municipio
 * @type {Object}
 */
var formatoResumen = {
    thead: [
        {'id': 'thMensaje', 'text': 'Mensaje', 'sort': false, 'refer': 'mensaje', 'type': 'text'},
        {'id': 'thProcesadas', 'text': 'Procesadas', 'sort': false, 'refer': 'cantidad_facturas', 'type': 'text'},
        {'id': 'thTotalCargado', 'text': 'Total Facturación', 'sort': true, 'refer': 'total_facturacion_cargada', 'type': 'currency'},
    ]
};
/**
 * Formato que muestra el total de los recaudos que no se pudieron subir por municipio
 * @type {Object}
 */
var formatoResumenErrores = {
    thead: [
        {'id': 'thSuscripcionGas', 'text': 'Id. Suscripción --', 'sort': false, 'refer': 'idgas', 'type': 'text'},
        {'id': 'thSuscripcionBio', 'text': 'Id. Suscripción Bio-Ace', 'sort': false, 'refer': 'idbio', 'type': 'text'},
        {'id': 'thMensaje', 'text': 'Mensaje', 'sort': false, 'refer': 'mensaje', 'type': 'text'}
    ]
};