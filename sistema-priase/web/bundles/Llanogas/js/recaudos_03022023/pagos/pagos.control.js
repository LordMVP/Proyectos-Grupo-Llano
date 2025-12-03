/**
 * Objeto para enviar las peticiones AJAX al servidor: Recaudos/Pagos
 * @type {Object}
 * @namespace pagosControl
 */
var pagosControl = {

    /**
     * Consulta los suscriptores que tengan saldo en sus facturas
     * @param  {object} data       Los parámetros que se envían al servidor (idsuscripción, documento del tercero o código anterior)
     * @param  {function} completado función de callback que se invoca cuando se cargan los datos desde el servidor (pagosVista.consultaSuscripcionCompleto)
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
     * Consulta las suscripciones de un suscriptor dependiendo de su convenio
     * @param  {Object} data       Parámetros que se envían al servidor para hacer la consulta (idsuscriptor)
     * @param  {Function} completado Función de callback que se invoca cuando se consultan las suscripciones de un suscriptor
     * @returns {void}
     */
    consultarSuscripciones: function(data, completado){
        __cnn.ajax({
            'url':'suscripciones/',
            'data':data,
            'completado':completado
        });
    },

    /**
     * Consulta las facturas de una suscripción
     * @param  {Object} data       Los parámetros de la consulta (idsuscripcion)
     * @param  {function} completado función de callback pagosVista.cargarFacturasCompleto
     * @returns {void}
     */
    consultarFacturas:function(data, completado){
        __cnn.ajax({
            'url':'../abonos/factura_suscripcion/',
            'data':data,
            'completado':completado
        });
    },

    /**
     * guarda la información del recaudo de tipo pago
     * @param  {object} data       envía el objeto json para guardar la información del abono
     * @param  {function} completado función de callback pagosVista.onGuardarCompleto
     * @returns {void}
     */
     guardarRecaudo:function(data, completado){
        __cnn.ajax({
            'url':'../registrar_recaudo_pago',
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
        $.each(pagosModel.facturas, function(i, item){
            if (item.seleccionado===true) {
                saldo += parseInt(item.saldoFactura);
            }
        });
        return saldo;
    },

    /**
     * Calcula la ponderación del recaudo en caso de que el pago sea por convenio
     * @param {array} Suscripciones del suscriptor seleccionado
     * @param {array} Facturas de las suscripciones encontradas
     * @param {number} Valor del recaudo a registrar
     * @returns {void}
     */
    calcularPonderacion:function(suscripciones, facturas, conceptos, valor){
        var ponderados = [];
        var totales = [];
        var sumatoria = 0; //almacena el valor total de la deuda del usuario
        for (var i = 0; i< suscripciones.length; i++) {
            if (suscripciones[i].seleccionado===true) {
                for (var j = 0; j< facturas.length; j++) {
                    if (facturas[j].idSuscripcion === suscripciones[i].idRegistro) {
                        if (totales[i]!==undefined) {
                            totales[i] += parseInt(facturas[j].saldoFactura);
                            sumatoria += parseInt(facturas[j].saldoFactura);
                        }else{
                            totales[i] = parseInt(facturas[j].saldoFactura);
                            sumatoria += parseInt(facturas[j].saldoFactura);
                        }
                    }
                }
            }else{
                totales[i]=undefined;
            }
        }

        for (var k in totales) {
            if (totales[k]!=undefined) {
                var porcentaje = (totales[k]*100)/sumatoria;
                var equivalencia = Math.round((valor*porcentaje)/100);
                ponderados[k] = {
                    'suscripcion':suscripciones[k].idRegistro,
                    'empresa':suscripciones[k].empresa,
                    'porcentaje':porcentaje,
                    'equivalencia':equivalencia,
                    'deudaSuscripcion':totales[k]
                };

            }else{
                ponderados[k] = undefined;
            }
        }

        $.each(suscripciones, function(a, sus){
            if(sus.seleccionado===true){
                if(ponderados[a]!==undefined){
                    var saldoSus = ponderados[a].equivalencia;
                    $.each(facturas, function(b, fac){
                        var saldoFac = parseInt(fac.saldoFactura);
                        if(saldoSus > 0){
                            if(sus.idRegistro===fac.idSuscripcion){
                                $.each(conceptos, function(c, con){
                                    if(con.idFactura === fac.idFactura){
                                        if(saldoSus>=con.saldo){
                                            saldoSus -= parseInt(con.saldo);
                                            conceptos[c].abono = con.saldo;
                                            conceptos[c].nuevoSaldo = conceptos[c].abono - con.saldo;
                                        }else{
                                            conceptos[c].abono = saldoSus;
                                            saldoSus = 0;
                                            conceptos[c].nuevoSaldo = con.saldo - conceptos[c].abono;
                                        }
                                        saldoFac -= parseInt(conceptos[c].abono);
                                    }
                                });
                                facturas[b].nuevoSaldo = saldoFac;
                            }
                        }
                    });
                }
            }
        });
        pagosModel.informacionPago = null;
        pagosModel.informacionPago = ponderados;
        return;
    },
    /**
     * Consulta la información de una factura según su id
     * @param {number} id - Id de la factura que se desea consultar
     */
    consultarFacturaPorId: function(id){
        id = parseInt(id);
        for(var i = 0; i < pagosModel.facturas.length; i++){
            var factura = pagosModel.facturas[i];
            if(parseInt(factura.idfactura) === id){
                return factura;
            }
        }
    }
};
