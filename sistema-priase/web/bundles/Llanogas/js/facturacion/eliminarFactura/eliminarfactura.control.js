/**
* @fileOverview Archivo de control de eliminarfactura
* @author svanegas
* @requires recaudos.js
* @requires eliminarfactura.modelo.js
* @version 1.0.0
*/

/** @namespace */
var eliminarfacturaControl = {

    /**
     * Consulta los suscriptores que tengan saldo en sus facturas
     * @param  {object} data       Los parámetros que se envían al servidor (idsuscripción, documento del tercero o código anterior)
     * @param  {function} completado función de callback que se invoca cuando se cargan los datos desde el servidor (eliminarfacturaVista.consultaSuscripcionCompleto)
     * @returns {void}
     */
    consultarSuscriptor: function (data, completado){
        __cnn.ajax({
            'url':'../consultar_suscriptor/',
            'data':data,
            'completado':completado
        });
    },

    /**
     * Consulta las facturas de una suscripción
     * @param  {Object} data       Los parámetros de la consulta (idsuscripcion)
     * @param  {function} completado función de callback eliminarfacturaVista.cargarFacturasCompleto
     * @returns {void}
     */
    consultarFacturas:function(data, completado){
        __cnn.ajax({
            'url':'factura_suscripcion/',
            'data':data,
            'completado':completado
        });
    },

    /**
     * Actualiza la informacion de la facturas seleccionadas
     * @param  {object} data       envía el objeto json para guardar la información del abono
     * @param  {function} completado función de callback eliminarfacturaVista.onGuardarCompleto
     * @returns {void}
     */
    actualizaFacturasuscripcion:function(data, completado){
      
        __cnn.ajax({
            'url':'../eliminar_factura_suscripcion/',
            'data':data,
            'completado':completado
        });
    },
    
    /**
     * Calcula el saldo de las facturas seleccionadas
     * @returns {int} calcula el saldo de las facturas seleccionadas
     */
    calcularSaldoActual:function(){
        var saldo = 0;
        $.each(eliminarfacturaModel.facturas, function(i, item){
            saldo += parseInt(item.saldofactura);
        });
        return saldo;
    },
    /**
     * Consulta la información de una factura según su id
     */
    consultarFacturaPorId: function(id){
        id = parseInt(id);
        for(var i = 0; i < eliminarfacturaModel.facturas.length; i++){
            var factura = eliminarfacturaModel.facturas[i];
            if(parseInt(factura.idfactura) === id){
                return factura;
            }
        }
    },

   


   

    /**
     * Aplica el saldo especificado a las facturas que se envían como parámetro
     * @param  {Array} facturas Arreglo de facturas que se deben recorrer
     * @param  {Number} saldo    Valor del saldo que se va a aplicar
     * @param {Boolean} facturaSeleccionada Si este parámetro es verdadero, sólo aplicará el saldo a las facturas cuya propiedad 'seleccionada' sea true
     * @returns {Number}          Nuevo saldo
     */
    aplicarSaldoAFacturas:function(facturas, saldo, facturaSeleccionada){
		//se recorren cada una de las facturas
		for (var i = 0; i < facturas.length; i++) {
			var factura = facturas[i];
            if (facturaSeleccionada === true && factura.seleccionada === false) {
                continue;
            }
			factura.abono = 0; //se reinicia el valor del abono y del nuevo saldo
			factura.nuevosaldo = parseFloat( factura.saldofactura );
			//se obtiene el saldo de la factura de la iteración
			var saldoFactura = parseFloat(factura.saldofactura);
			//si hay saldo restante tras haber aplicado algunos descuentos, siga descontando
			if (saldo > 0) {
				//se recorren los conceptos de la factura y se empiezan a descontar los saldos de cada concepto
                saldo = eliminarfacturaControl.aplicarSaldoConceptosDeFactura(factura, saldo);
				factura.nuevosaldo = parseFloat(saldoFactura) - parseFloat(factura.abono);
			}
		}
		return saldo;
	},

	

    /**
     * Remueve los atributos de eliminarfactura anteriores de todas las facturas y conceptos
     * @returns {void}
     */
    limpiarAbonosAnteriores:function(){
        var facturas = eliminarfacturaModel.facturas;
        

        for (var a = 0; a < facturas.length; a++) {
            if(facturas[a].abono || facturas[a].abono==0){
                delete facturas[a].abono;
            }
            if (facturas[a].nuevosaldo || facturas[a].nuevosaldo==0) {
                delete facturas[a].nuevosaldo;
            }
        }

     
    },


    /**
     * Discrimina las facturas del modelo entre las que están vencidas y las que no.
     * @returns {Object} Objeto con dos arreglos, uno de factuas vencidas otra de facturas no vencidas.
     */
    obtenerFacturasVencidasYNoVencidas:function(){
        var facturasVencidas = [];
        var facturasNoVencidas = [];
        for (var i = 0; i < eliminarfacturaModel.facturas.length; i++) {
            var factura = eliminarfacturaModel.facturas[i];
            if (factura.facturaVencida) {
                facturasVencidas.push(factura);
            }else{
                facturasNoVencidas.push(factura);
            }
        }

        facturasNoVencidas = eliminarfacturaControl.ordenarFacturasVencimiento(facturasNoVencidas);
        return {
            facturasVencidas:facturasVencidas,
            facturasNoVencidas: facturasNoVencidas
        };
    },


    /**
     * Calcula la sumatoria del valor de las facturas seleccionadas por el usuario
     * @returns {Number} Total del valor de las facturas seleccionadas
     */
    calcularTotalFacturasSeleccionadas:function(){
        var total = 0;
        for (var i = 0; i < eliminarfacturaModel.facturas.length; i++) {
            var factura = eliminarfacturaModel.facturas[i];
            if (factura.seleccionada) {
                total += parseFloat(factura.saldofactura);
            }
        }
        return total;
    }
};
