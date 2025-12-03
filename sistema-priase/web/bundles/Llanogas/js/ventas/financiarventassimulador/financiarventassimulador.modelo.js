/**
 * @fileOverview Archivo de modelo de financiar ventas
 * @author angelicaGomez
 * @version 1.0.0
 */
/** @namespace */
var financiarModeloSimulador ={
    archivos : [],
    interesmaximo: 0,
    indiceFinanciacion: 0,
    valorNoFinanciable: 0,
    archivosEliminados: [],
    conceptoLiquidacion: [],
    liquidacionesUtilizadas: []
};
/**
 * Template para mostrar las financiaciones
 * @type {Object}
 */
var formatoTemplateFinanciacion = 
        '<div class="divContenedorColapsable" style="margin-right: 10px;">'+
        '<div class="divColapsable"><h4 class="tituloColapsable">Financiación <span class="spanTipoFinanciacion"></span> </h4><div class="btnColapsable"><a href="" class="fa fa-minus" tabindex="-1"></a><a href="" class="fa fa-times" tabindex="-2" style="margin-left: 8px;" data-indice="{{i}}"></a></div></div>'+
        '<div class="contenidoColapsable">'+
            '<div class="campo"><label for="cmbTipoFinanciacion_{{i}}">Tipo de financiación:</label><select id="cmbTipoFinanciacion_{{i}}" class="tipofinanciacion" data-indice="{{i}}"></select></div>'+
            '<div class="campo"><label for="txtInteresFinanciacion_{{i}}">Interés:</label><input type="text" id="txtInteresFinanciacion_{{i}}" class="interesfinanciacion" disabled="disabled" data-caja="number"/></div>'+
            '<table class="tabla" id="tblConceptosFinanciacion_{{i}}"></table>'+
            '<div class="campo"><label for="txtVlrFinanciableFinanciacion_{{i}}">Valor financiable:</label><input type="text" id="txtVlrFinanciableFinanciacion_{{i}}" disabled="disabled"/></div>'+
            '<div class="campo"><label for="txtVlrCuotaFinanciacion_{{i}}">Cuota inicial:</label><input type="text" id="txtVlrCuotaFinanciacion_{{i}}" disabled="disabled" /></div>'+
            '<div class="campo"><label for="txtVlrFinanciarFinanciacion_{{i}}">Valor a financiar:</label><input type="text" id="txtVlrFinanciarFinanciacion_{{i}}" class="valorafinanciar" disabled="disabled" /></div>'+
        '</div></div>';