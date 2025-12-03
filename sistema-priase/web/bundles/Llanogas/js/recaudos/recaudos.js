/*
 * Archivo para controlar acciones generales ejecutadas en los programas de recaudo
 * Abonos, Pagos, Anticipos y Cartera Castigada
 */

/**
 * Almacena en tiempo de ejecución la lista de bancos.
 * @type {Array}
 */
bancos = null;

/**
 * Carga la lista de bancos del servidor de BD
 * @returns {object} El resultado de la consulta de bancos.
 */
function cargarBancosGlobal(){
    var resultado =  __cnn.ajax({
        'url':'../consultar_bancos/',
        'async':false,
        'background':true
    });
    return resultado;
}


/**
 * Muestra el filtro de suscriptores para todas las interfaces de recaudos (abonos, anticipos, pagos y cartera castigada)
 * @param  {string | object}   dialogo  El selector u objeto jQuery del dialogo que se debe desplegar
 * @param  {Function} callback función de callback que se invoca cuando se presiona el botón aceptar
 * @returns {void}
 */
function mostrarFiltroSuscriptores(dialogo, callback){
  var filtro = __app.esObjJquery(dialogo);
  filtro.find('#btnBuscar').off('click').on('click', callback);
  that.dialogoActual = filtro.dialogo({
      modal:true,
      width:850,
      title:'Buscar un suscriptor'
  });
}


/**
 * Almacena la lista de bancos en una variable global
 * @returns {void}
 */
function cargarBancos(){
    if (bancos==null) {
        var listaBancos = cargarBancosGlobal();
        if (listaBancos.codigoRespuesta==1) {
            bancos = __dom.crearCombo('cmbBanco', listaBancos.bancos, 'idtercero', 'nombretercero');
        }
    }
}


/**
 * calcula la deuda del usuario de acuerdo a la cantidad de facturas con saldo
 * @param  {object} modelo El modelo donde se encuentran las facturas
 * @returns {int}        La sumatoria de los saldos de las facturas.
 */
function calcularSaldoActual(modelo){
    var saldo = 0;
    $.each(modelo.facturas, function(i, item){
        saldo = parseFloat( saldo + parseFloat(item.saldofactura) );
    });
    return saldo;
}


/**
* Calcula la ponderación con que se debe aplicar el recaudo, de acuerdo al
* convenio o al tipo de recaudo
* @param  {array} facturas - El arreglo con todas las facturas de la suscripción seleccionada
* @param  {array} conceptos - El arreglo con todos los conceptos de todas las facturas de la suscripción seleccionada
* @param  {int} valor - El valor total de la sumatoria del saldo de las facturas
* @returns {void}
*/
function calcularPonderacion(facturas, conceptos, valor){
    //recorrer los conceptos y las facturas y se elimina la propiedad abono
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

    //se almacena la información del valor del pago y se va restando a medida que se va descontando valor por cada concepto
    var saldo = parseFloat(valor);
    //se recorren cada una de las facturas
    for (var i = 0; i < facturas.length; i++) {
        var factura = facturas[i];

        factura.abono = 0; //se reinicia el valor del abono y del nuevo saldo
        factura.nuevosaldo = parseFloat( factura.saldofactura );

        //se obtiene el saldo de la factura de la iteración
        var saldoFactura = parseFloat(factura.saldofactura);

        //si hay saldo restante tras haber aplicado algunos descuentos, siga descontando
        if (saldo > 0) {
            //se recorren los conceptos de la factura y se empiezan a descontar los saldos de cada concepto

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

            factura.nuevosaldo = parseFloat(saldoFactura) - parseFloat(factura.abono);
        }
    }
    return;
}
/**
 * Recorre la lista de formas de pago y construye un objeto JSON para enviarlo a la base de datos cuando se almacena un recaudo.
 * esta operación se realiza cuando se efectua el recaudo.
 * @param {Array} arregloFormas - Formas de pago asignadas al recaudo que se está guardando
 * @returns {Array}
 */
function almacenarFormasPago(arregloFormas){
    var formasPagos = [];
    $.each(arregloFormas, function(i, forma){
        var nuevaForma = {};
        nuevaForma.formaPago = parseFloat(forma.tipo);
        nuevaForma.valor = !isNaN(parseFloat(forma.valor)) ? parseFloat(forma.valor) : 0;
        if (forma.tipo!=75) {
            nuevaForma.idBanco = forma.detalles.idBanco;
            nuevaForma.informacionAdicional = [];
            var nombreGirador = { informacion: forma.detalles.nombre,
                                      tipificacion:'13',
                                      nombreTipificacion:'Nombre Tercero Girador'};

            var docGirador = {informacion: forma.detalles.doc,
                              tipificacion:'12',
                              nombreTipificacion:'Nit tercero Girador'};


            var banco = {informacion: forma.detalles.banco,
                         tipificacion:'9',
                         nombreTipificacion:'Banco'};

            nuevaForma.informacionAdicional.push(nombreGirador);
            nuevaForma.informacionAdicional.push(docGirador);
            nuevaForma.informacionAdicional.push(banco);


            //En caso de ser tarjeta de credito o debito:
            if(forma.tipo==76 || forma.tipo==77) {
                var franquicia = {informacion: forma.tarjeta.franquicia,
                                  tipificacion:'14',
                                  nombreTipificacion:'Franquicia'};

                var numTarjeta = {informacion: forma.tarjeta.numero,
                                  tipificacion:'15',
                                  nombreTipificacion:'Numero de Tarjeta'};

                var fechaExpiracion = {informacion: forma.tarjeta.vencimiento,
                                       tipificacion:'16',
                                       nombreTipificacion:'Fecha Vencimiento'};

                nuevaForma.informacionAdicional.push(franquicia);
                nuevaForma.informacionAdicional.push(numTarjeta);
                nuevaForma.informacionAdicional.push(fechaExpiracion);

            }else if(forma.tipo==78){
                var numeroCheque = {informacion: forma.cheque.numCheque,
                                    tipificacion:'11',
                                    nombreTipificacion:'Numero de Cheque'};

                var numeroCuenta = {informacion: forma.cheque.numCuenta,
                                    tipificacion:'10',
                                    nombreTipificacion:'Numero de Cuenta'};

                nuevaForma.informacionAdicional.push(numeroCheque);
                nuevaForma.informacionAdicional.push(numeroCuenta);
            }
        }
        formasPagos.push(nuevaForma);
    });
    return formasPagos;
}

/**
 * Valida que las fechas de expiración de las tarjetas de crédito y débito sean correctas y no se hayan vencido hasta el momento
 * @param input
 * @returns {boolean}
 */
function validarFechaExpiracion(input){
    var _this = $(input);
    var texto = _this.val();
    var fechas = texto.split('/');
    var mes = parseInt(fechas[0]);
    var anio = parseInt(fechas[1]);
    var d = __app.obtenerFechaSistema();
    var mesActual = parseInt(d.getMonth()+1);
    var anioActual = parseInt(d.getFullYear().toString().substring(2,4));
    if(_this.val()===""){
        _this.addClass('campoInvalido').removeClass('campoValido');
       _this.focus();
       return false;
    }else{
        if (_this.val()==="" || (parseInt(anio+''+fechas[0]) < parseInt(anioActual+''+mesActual)) || mes>12 || anio<anioActual ) {
           _this.addClass('campoInvalido').removeClass('campoValido');
           _this.focus();
           return false;
       }else{
           _this.removeClass('campoInvalido').addClass('campoValido');
           return true;
       }
    }
}

/**
 * Agrega una nueva forma de pago en el dialgo de las formas de pago para las interfaces de recaudos.
 * @param {jQuery} divFormas - División donde se encuentran los controles que se van a configurar
 * @param {number} indice - Cantidad de formas de pago que se han cargado hasta el momento en que se agrega la actual
 */
function configurarNuevaFormaPago(divFormas, indice){
    divFormas.find('input#txtFechaExpiracion'+indice)
                .mask('99/99')
                .focusout(function(){
                    validarFechaExpiracion($(this));
                });

       divFormas.find('input#txtNumTarjeta'+indice).mask('9999');
       __dom.configurarTextoNumerico('txtDocGirador'+indice);
       __dom.configurarTextoNumerico('txtValor'+indice, false, true, true);
       __dom.configurarTextoNumerico('txtNumCheque'+indice);
       __dom.configurarTextoNumerico('txtNumCuenta'+indice);

       divFormas.find('select#cmbFormaPago'+indice)
                       .on('change', function(){
           var _this = $(this);
           switch (parseInt(_this.val())) {
               case 0:
                   divFormas.find('#divdetallesFormaPago'+indice+', #divDetallesCheque'+indice+', #divDetallesTarjeta'+indice)
                       .hide()
                           .find('input[type="textbox"]')
                               .val('');
                   break;
               case 75:
                   divFormas.find('#divdetallesFormaPago'+indice+', #divDetallesCheque'+indice+', #divDetallesTarjeta'+indice)
                       .hide()
                           .find('input[type="textbox"]')
                               .val('');
                   break;
               case 76:
                   divFormas.find('#divdetallesFormaPago'+indice+', #divDetallesTarjeta'+indice)
                       .show();
                   divFormas.find('#divDetallesCheque'+indice).hide()
                               .find('input[type="textbox"]')
                                           .val('');
                   break;
               case 77:
                   divFormas.find('#divdetallesFormaPago'+indice+', #divDetallesTarjeta'+indice)
                       .show();
                   divFormas.find('#divDetallesCheque'+indice).hide()
                               .find('input[type="textbox"]')
                                           .val('');
                   break;
               case 78:
                   divFormas.find('#divdetallesFormaPago'+indice+', #divDetallesCheque'+indice)
                       .show();
                   divFormas.find('#divDetallesTarjeta'+indice).hide()
                               .find('input[type="textbox"]')
                                           .val('');
                   break;
           }
       }).focus();
    return ;
}


/**
 * Recorre las formas de pago de un modelo y son almacenadas en un objeto JSON
 * @param {Object} modelo - Objeto "modelo" donde se guarda la información de cada vista
 * @returns {boolean}
 */
function guardarFormasDePago(modelo){
    var contenedor = $('div#divFormasPago');
    var controles = contenedor.find('#controlesFormasPago');
    var errores = 0;
    var efectivos = 0;
    var formacheques = 0;
    var formadebito = 0;
    var formacredito = 0;
    $.each(modelo.formasPago, function(i, forma){
        var indice = forma.indice;
        var divForma = controles.find("#divFormaPago"+indice);
        var txtValor = divForma.find('#txtValor'+indice);
        var valor = txtValor.val().trim();
        if (valor!=="") {
            forma.valor = parseFloat(valor);
            forma.tipo = divForma.find('#cmbFormaPago'+indice+' option:selected').val();
            txtValor.addClass('campoValido').removeClass('campoInvalido');
        }else{
            txtValor.focus().addClass('campoInvalido').removeClass('campoValido');
            errores++;
        }


        if (forma.tipo!=='75') { //75:Efectivo
            divForma.find('#divdetallesFormaPago'+indice+' input[type="text"]').each(function(j, textbox){
                if(textbox.value.trim()===""){
                    $(textbox).focus().addClass('campoInvalido').removeClass('campoValido');
                    errores++;
                }else{
                    $(textbox).addClass('campoValido').removeClass('campoInvalido');
                }
            });

            forma.detalles = {
                doc:divForma.find('#txtDocGirador'+indice).val(),
                nombre:divForma.find('#txtNombreGirador'+indice).val(),
                idBanco:divForma.find('#cmbBanco'+indice+' option:selected').val(),
                banco:divForma.find('#cmbBanco'+indice+' option:selected').text()
            };
        }else{
            if (!!forma.detalles) {
                delete forma.detalles;
            }
            if (!!forma.tarjeta) {
                delete forma.tarjeta;
            }
            if (!!forma.cheque) {
                delete forma.cheque;
            }
            efectivos++;
            if(efectivos > 1){
              __dom.lanzarAlerta(__app.mensajes.mismaFormaPago, __app.mensajes.atencion);
              errores++;
              return false;
            }
        }

        if(forma.tipo==='77' || forma.tipo==='76') {  //76:Credito | 77:Debito
            divForma.find('#divDetallesTarjeta'+indice+' input[type="text"]').each(function(j, textbox){
                if(textbox.value.trim()===""){
                    $(textbox).focus().addClass('campoInvalido').removeClass('campoValido');
                    errores++;
                }else{
                    $(textbox).addClass('campoValido').removeClass('campoInvalido');
                }

                if (textbox.id.search('txtFechaExpiracion')!==-1) {
                    errores +=  validarFechaExpiracion(textbox)?0:1;
                }
            });
            forma.tarjeta = {
                franquicia:divForma.find('#cmbFranquicia'+indice+' option:selected').val(),
                numero:divForma.find('#txtNumTarjeta'+indice).val(),
                vencimiento:divForma.find('#txtFechaExpiracion'+indice).val()
            };
        }else if(forma.tipo==='78'){ //78:Cheque
            divForma.find('#divDetallesCheque'+indice+' input[type="text"]').each(function(j, textbox){
                if(textbox.value.trim()===""){
                    $(textbox).focus().addClass('campoInvalido').removeClass('campoValido');
                    errores++;
                }else{
                    $(textbox).addClass('campoValido').removeClass('campoInvalido');
                }
            });

            if (!!forma.tarjeta) {
                delete forma.tajeta;
            }

            forma.cheque = {
                numCuenta:divForma.find('#txtNumCuenta'+indice).val(),
                numCheque:divForma.find('#txtNumCheque'+indice).val()
            };

        }
    });

    return (errores>0)?false:true;
}

/**
 * Muestra la lista de suscripciones cuando se hace el filtro de terceros, suscripciones y suscriptores
 * @param  {Array}   suscripciones Colección de suscripciones
 * @param  {Object}   dialogo       Dialogo que se está visualizando en el momento en la aplicación
 * @param  {Object}   modelo        Objeto donde se deben almacenar la información de las suscripciones y el suscriptor
 * @param  {Function} callback      Función de callback que se invoca cuando el usuario selecciona una suscripción.
 * @returns {void}
 */
function mostrarListaSuscripciones(suscripciones, dialogo, modelo, callback){

    dialogo.find('div.listaSeleccion, .btn-seleccionar').remove();

    var divSuscriptores = $('<div>').addClass('listaSeleccion');
    $.each(suscripciones, function(s, susc) {
        var div = $('<div>');
        var radio = $('<input type="radio">');
        radio.val(susc.idsuscripcion);
        radio.attr('id', 'radio_susc_' + s);
        radio.attr('data-indice', s);
        radio.attr('name', 'radio_suscripciones');
        var label = $('<label>').attr('for', 'radio_susc_' + s);
        label.text(susc.nombretercero  + ' - documento: ' + susc.cedula + ' - Suscripción: ' + susc.idsuscripcion + ' - Código Anterior: ' + susc.codanterior);
        div.append(radio).append(label);
        divSuscriptores.append(div);
    });

    var btn = $('<button>').text('seleccionar').addClass('btnSimple').addClass('btn-seleccionar');

    btn.on('click', function () {
        var suscSeleccionada = that.dialogoActual.find('input[name="radio_suscripciones"]:checked');
        if (suscSeleccionada.length > 0) {
            sus = modelo.suscripcion = suscripciones[parseInt(suscSeleccionada.attr('data-indice'))];
            dialogo.find('#spanMensaje').hide();
            dialogo.dialog('close');
            divSuscriptores.remove();
            btn.remove();
            callback(sus);
        } else {
            dialogo.find('#spanMensaje').text(__app.mensajes.seleccionarOpcion).show();
        }
    });
    divSuscriptores.insertAfter(dialogo.find('#btnBuscar'));
    dialogo.append(btn);
}


/**
 * Imprime el resultado del recaudo
 * @returns {void}
 */
function imprimirTimbre(iframe, datos){
    var obj = {
        idrecaudo:datos.idrecaudo,
        empresa:datos.empresa,
        mediopago:datos.mediopago,
        fechapago:datos.fechapago,
        sucursal:datos.sucursal,
        valorpagado:datos.valorpagado.toCurrency(),
        cifrado:datos.cifrado
    };

    obj.distribucion = (function(dis){
        var d = [];
        var total = 0;
        for (var i = 0; i < dis.length; i++) {
            d.push({empresa:dis[i].empresa, valorrecaudo:dis[i].valorrecaudo.toCurrency()});
            total += dis[i].valorrecaudo
        }
        return d;
    })(datos.distribucion);

    var frame = document.getElementById(iframe).contentWindow;
    var c = frame.document.getElementById('contenido');
    var template = '<p>{{empresa}}<br />'+
                    '{{mediopago}} - {{fechapago}} | {{mediopago}} - {{sucursal}}<br />'+
                    '{{#distribucion}}'+
                    '{{empresa}}: {{valorrecaudo}}<br class="brEmpresas"/>'+
                    '{{/distribucion}}'+
                    '<br />Total: {{valorpagado}} - Ide Recaudo: {{idrecaudo}}<br/><span style="letter-spacing:1.2px; font-weight:normal; font-size:9pt;">{{cifrado}}</span></p>';
    var info = $(Mustache.render(template, obj));
    info.find('br.brEmpresas:last').remove();
    c.innerHTML = info.html();
    frame.focus();
    frame.print();
    return;
}
