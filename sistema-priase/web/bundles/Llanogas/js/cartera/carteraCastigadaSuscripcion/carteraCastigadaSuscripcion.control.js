/**
* @fileOverview Archivo de control de cartera castigada
* @author angelicaGomez
* @requires carteraCastigada.modelo.js
* @version 1.0.0
*/

/** @namespace */
var carteraControl ={

  /** Inicia proceso de castigar cartera por suscripción
   * @param  {object} data - Los parámetros que se envían al servidor (idsuscripcion)
   * @param  {function} completado - Función invocada cuando cargan datos desde servidor (carteraVista.onProcesarCompleto)
   * @returns {void}
   */
  procesarCartera: function(data, completado) {
      __cnn.ajax({
          'url': 'procesar/',
          'data': data,
          'completado': completado
      });
  },

  /** Consulta detalles de una suscripción según su id
  * @param  {object} data - Los parámetros que se envían al servidor (idsuscripcion, codigoanterior)
  * @param  {function} completado - Función invocada cuando cargan datos desde servidor (carteraVista.consultaSuscripcionCompleto)
  * @returns {void}
  */
  consultarSuscripciones: function(data, completado) {
      __cnn.ajax({
          'url': 'cargar/',
          'data': data,
          'completado': completado
      });
  },

  /** Consulta si una suscripción tiene o no deuda antes de castigar la cartera
   * @param  {object} data - Los parámetros que se envían al servidor {idsuscripcion}
   * @param  {function} completado - Función de callback
   * @returns {void}
   */
  validarSuscripcion:function(data, completado){
      __cnn.ajax({
          'url':'validar/usuario/',
          'data':data,
          'completado':completado
      })
  }
};
