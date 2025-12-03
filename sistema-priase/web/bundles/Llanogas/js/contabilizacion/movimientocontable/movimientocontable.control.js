/**
* @fileOverview Archivo de control de generar movimiento contable
* @author AngelicaGomez
* @version 1.0.0
*/

/** @namespace */
var movimientoControl = {
    /**
     * Inicia proceso para generar movimientos contables
     * @param  {object} data - Parámetros que se envían al servidor (idciclo)
     * @param  {function} completado - Función callback (movimientoVista.onGenerarCompleto)
     * @returns {void}
     */
    generarMovimiento:function(data, success){
        console.log(data);
        __cnn.ajax({
            url:'procesar/',
            data: data,
            completado:success, 
            background: true        
        });
    },
    /**
     * Consulta progreso del proceso de movimientos contables
     * @param  {object} data - Parámetros que se envían al servidor (idciclo)
     * @param  {function} completado - Función callback (movimientoVista.onGenerarCompleto)
     * @returns {void}
     */
    consultarMovimiento:function(success){
        __cnn.ajax({
            url:'estado',
            completado:success,
            background:true
        });
    },
     /**
     * Consulta los ciclos por empresa y programa
     * @param  {object} data - Parámetros que se envían al servidor (idciclo)
     * @param  {function} completado - Función callback (movimientoVista.onGenerarCompleto)
     * @returns {void}
     */
    consultaCiclos: function(data,success){
       __cnn.ajax({
            url:'consultaciclos/',
            data: data,
            completado:success, 
            background: true        
        }); 
    },
    consultarPeriodoAnterior: function(data,success){
        __cnn.ajax({
            url:'consultaperiodos/',
            data: data,
            completado:success, 
            background: true        
        }); 
    },
    consultaCiclosGeneral: function (data,success){
        __cnn.ajax({
            url:'consultaciclogeneral/',
            data: data,
            completado:success, 
            background: true        
        }); 
    }
};