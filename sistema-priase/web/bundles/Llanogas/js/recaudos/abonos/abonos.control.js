/**
* @fileOverview Archivo de control de abonos
* @author svanegas
* @requires recaudos.js
* @requires abonos.modelo.js
* @version 1.0.0
*/

/** @namespace */
var abonosControl = {

    /**
     * Consulta los suscriptores que tengan saldo en sus facturas
     * @param  {object} data       Los parámetros que se envían al servidor (idsuscripción, documento del tercero o código anterior)
     * @param  {function} completado función de callback que se invoca cuando se cargan los datos desde el servidor (abonosVista.consultaSuscripcionCompleto)
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
     * @param  {function} completado función de callback abonosVista.cargarFacturasCompleto
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
     * guarda la información del recaudo de tipo abono
     * @param  {object} data       envía el objeto json para guardar la información del abono
     * @param  {function} completado función de callback abonosVista.onGuardarCompleto
     * @returns {void}
     */
    guardarRecaudo:function(data, completado){
        __cnn.ajax({
            'url':'../registrar_recaudo_abono',
            'data':data,
            'completado':completado
        });
    },
    /**
     * Actualiza la cantidad de impresiones autorizadas por usuario
     * @param  {object} data Datos enviados al servidor (idimpresion)
     * @param  {function} completado función de callback (función anónima)
     * @returns {void}
     */
    actualizarAutorizacion:function(data, completado){
        __cnn.ajax({
            'url':'../impresiones/actualizar_impresion/',
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
        $.each(abonosModel.facturas, function(i, item){
            saldo += parseInt(item.saldofactura);
        });
        return saldo;
    },
    /**
     * Consulta la información de una factura según su id
     */
    consultarFacturaPorId: function(id){
        id = parseInt(id);
        for(var i = 0; i < abonosModel.facturas.length; i++){
            var factura = abonosModel.facturas[i];
            if(parseInt(factura.idfactura) === id){
                return factura;
            }
        }
    },

    /**
     * Obtiene los índices de los conceptos de la factura seleccionada
     * @param  {Object} factura Factura de la cual se deben obtener los índices de los conceptos
     * @returns {Array|Boolean}  Si la factura tiene conceptos, se retorna un arreglo con los índices, de lo contrario retorna false.
     */
    obtenerIndicesConceptosFactura:function(factura){
        var indices = [];
        for (var i = 0; i < abonosModel.conceptos.length; i++) {
            var concepto = abonosModel.conceptos[i];
            if (concepto.idfactura === factura.idfactura) {
                indices.push(i);
            }
        }
        if (indices.length>0) {
            return indices;
        }
        return false;
    },


    /**
     * Calcula la distribución del abono y modifica los arreglos de facturas y de conceptos del modelo
     * para que sea nuevamente mostrado en la interfaz, con la distribución del recaudo.
     * @param  {Number} valorAbono El valor que se va a abonar
     * @returns {void}
     */
    calcularDistribucionAbono:function(valorAbono){
        var facturas = abonosModel.facturas;
        abonosControl.limpiarAbonosAnteriores();
        var discriminacion = abonosControl.obtenerFacturasVencidasYNoVencidas();
        var facturasVencidas = discriminacion.facturasVencidas;
        var facturasNoVencidas = discriminacion.facturasNoVencidas;
        //se almacena la información del valor del pago y se va restando a medida que se va descontando valor por cada concepto
        var saldo = parseFloat(valorAbono);
        saldo = abonosControl.aplicarSaldoAFacturas(facturasVencidas, saldo);
        if (saldo>0) {
            saldo = abonosControl.aplicarSaldoAFacturas(facturasNoVencidas, saldo, true);
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
                saldo = abonosControl.aplicarSaldoConceptosDeFactura(factura, saldo);
				factura.nuevosaldo = parseFloat(saldoFactura) - parseFloat(factura.abono);
			}
		}
		return saldo;
	},

	/**
	 * Aplica el saldo a los conceptos a los que se pueda, de la factura que se envía como parámetro
	 * @param {Object} factura la factura de la que se buscarán los conceptos
	 * @param {Number} saldo que se aplicará a los conceptos
	 * @returns {Number} nuevo saldo después de aplicar a los conceptos
	 */
    aplicarSaldoConceptosDeFactura:function(factura, saldo){
        var conceptos = abonosModel.conceptos;
        for (var j = 0; j < conceptos.length; j++) {
            var concepto = conceptos[j];
            var saldoConcepto = parseFloat(concepto.saldo);
            if (factura.idfactura === concepto.idfactura  &&  saldoConcepto > 0) {
                concepto.abono = 0;
                concepto.nuevosaldo = parseFloat(concepto.saldo);
                if(saldo >= saldoConcepto){
                    saldo = parseFloat(saldo - saldoConcepto);
                    concepto.abono = parseFloat(saldoConcepto);
                    concepto.nuevosaldo = parseFloat(concepto.abono - concepto.saldo);
                }else{
                    concepto.abono = parseFloat(saldo);
                    saldo  = 0;
                    concepto.nuevosaldo = parseFloat(saldoConcepto - concepto.abono);
                }
                factura.abono = parseFloat(factura.abono + concepto.abono);
            }
        }
		return saldo;
	},

    /**
     * Remueve los atributos de abonos anteriores de todas las facturas y conceptos
     * @returns {void}
     */
    limpiarAbonosAnteriores:function(){
        var facturas = abonosModel.facturas;
        var conceptos = abonosModel.conceptos;

        for (var a = 0; a < facturas.length; a++) {
            if(facturas[a].abono || facturas[a].abono==0){
                delete facturas[a].abono;
            }
            if (facturas[a].nuevosaldo || facturas[a].nuevosaldo==0) {
                delete facturas[a].nuevosaldo;
            }
        }

        for (var b = 0; b < conceptos.length; b++) {
            if(conceptos[b].abono || conceptos[b].abono==0){
                delete conceptos[b].abono;
            }
            if (conceptos[b].nuevosaldo || conceptos[b].nuevosaldo==0) {
                delete conceptos[b].nuevosaldo;
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
        for (var i = 0; i < abonosModel.facturas.length; i++) {
            var factura = abonosModel.facturas[i];
            if (factura.facturaVencida) {
                facturasVencidas.push(factura);
            }else{
                facturasNoVencidas.push(factura);
            }
        }

        facturasNoVencidas = abonosControl.ordenarFacturasVencimiento(facturasNoVencidas);
        return {
            facturasVencidas:facturasVencidas,
            facturasNoVencidas: facturasNoVencidas
        };
    },

    /**
     * Ordena las facturas por la fecha de vencimiento, de la más antigua a la más reciente
     * @param  {Array} facturas Arreglo de facturas que se quieren ordenar por fecha.
     * @returns {Array} Retorna un nuevo arreglo con los mismos elementos del parámetro de entrada, pero ordenados por fecha
     */
    ordenarFacturasVencimiento:function(facturas){

        //referencia al objeto abonosControl, de forma local
        var _ = abonosControl;

        if (facturas.length<=1) {
            return facturas;
        }

        var semilla = facturas[0];
        var fechaSemilla = _.parseFecha(semilla.fechavencimiento);

        var facturasIzquierda = [];
        var facturasDerecha = [];

        for (var i = 1; i < facturas.length; i++) {

            ( _.parseFecha(facturas[i].fechavencimiento) < fechaSemilla )
                ? facturasIzquierda.push( facturas[i] )
                : facturasDerecha.push( facturas[i] );
        }

        return _.ordenarFacturasVencimiento(facturasIzquierda).concat(semilla, _.ordenarFacturasVencimiento(facturasDerecha));
    },

    /**
     * Crea una fecha a partir de un string y le agrega un día
     * @param {string} fecha - Fecha a la que se desea agregar un día
     * @returns {Date}
     */
    parseFecha:function(fecha){
        var _fecha = new Date(fecha);
        _fecha.setDate(_fecha.getDate()+1);
        return _fecha;
    },
    /**
     * Calcula la sumatoria del valor de las facturas seleccionadas por el usuario
     * @returns {Number} Total del valor de las facturas seleccionadas
     */
    calcularTotalFacturasSeleccionadas:function(){
        var total = 0;
        for (var i = 0; i < abonosModel.facturas.length; i++) {
            var factura = abonosModel.facturas[i];
            if (factura.seleccionada) {
                total += parseFloat(factura.saldofactura);
            }
        }
        return total;
    }
};
