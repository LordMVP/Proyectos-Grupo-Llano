/**
* @fileOverview Archivo de control de financiación de ventas
* @author Angélica Gómez
* @requires financiarventas.modelo.js
* @version 1.0.0
*/

/** @namespace */
var financiarControlSimulador ={
   
   
  
    /**
     * Consulta tasa de interés por liquidación seleccionada
     * @param  {object} data - Los parámetros que se envían al servidor (idliquidacion)
     * @returns {object} ajax - Respuesta del servidor
     */
    consultarInteres: function (data, success) {
        return __cnn.ajax({
            'url': '../../cartera/generarfinanciacion/obtener/interes',
            data: data,
            completado: success
        });
    },
   
    consultarInteresFinanciacion: function (data) {
        return __cnn.ajax({
            'url': '../../cartera/generarfinanciacion/obtener/interes',
            data: data,
            async: false
        });
    },
     /**
     * Muestra información de una liquidación con id específico (Todas las liquidaciones bsucadas)
     * @param  {int} id - El número de id que se compara
     * @returns {object} venta - Objeto JSON con información de la liquidación.
     */
    consultarLiquidacionPorId: function(id){
        id = parseInt(id);
        for (var i = 0; i< financiarModeloSimulador.liquidaciones.length; i++) {
            var liq  = financiarModeloSimulador.liquidaciones[i];
            if (parseInt(liq.idliquidacion) === id) {
                return liq;
            }
        }
    }

    
  
};