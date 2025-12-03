/**
 * @fileOverview Archivo de vista de cartera castigada
 * @author angelicaGomez
 * @version 1.0.0
 */

/**
 * Objeto que hace referencia al namespace amortizador
 * @type {object}
 */
var _that = null;
/** @namespace*/
var amortizador = {
    /**
     * Inicializa el prorama de amortización de financiaciaciones
     * @returns {void}
     **/
    init: function () {
        _that = amortizador;
        $('#divTbl').empty();
    },
    /** Calcula la amortización de acuerdo a los parámetros digitados para la financiación e
     * invoca función para la correcta visualización
     * @param {objetc} modelo - Modelo donde se podrá almacenar información (opcional)
     * @param {boolena} agregarTabla - Evalúa si desea agregar la tabla a #divTbl
     * @returns {void}
     */
    calcularAmortizacion: function (modelo, sinAgregar) {
        var txtInteres = $('#txtIntereses');
        var txtCapital = $('#txtCapitalInicial');
        _that.capitalInicial = parseFloat(txtCapital.val());
        txtCapital.val(_that.capitalInicial.toString().toCurrency());

        if (txtInteres.val() === '') {
            __dom.lanzarAlertaOk('Ingrese tasa de interés');
            return false;
        }
        if (!(__dom.validarNumeroDecimal($('#txtIntereses').val()))) {
            __dom.lanzarAlertaOk(__app.mensajes.intereses, __app.mensajes.atencion);
            return false;
        }
        _that.listadoAmortizacion = [];
        var tipoCuota = txtInteres.attr('tipo-cuota');
        _that.tasaInteres = parseFloat(txtInteres.val()) / 100;
        var numeroCuotas = parseInt($('#txtNumeroCuotas').val());
        var cuotasAmortizadas = parseInt($('#txtCuotasAmortizadas').val());
        _that.interesiva = txtInteres.attr('data-iva') ? txtInteres.attr('data-iva') : 0;
        _that.valorCuotaGlobal = _that.calcularValorCuota(_that.capitalInicial, _that.tasaInteres, numeroCuotas);
        _that.totalCuotas = 0;
        _that.totalCapital = 0;
        _that.totalIntereses = 0;
        _that.totalInteresIva = 0;
        var saldo = _that.capitalInicial;

        //console.log(cuotasAmortizadas);

        if (modelo.diasterminoperiodo < 30 && modelo.diasterminoperiodo > 0 
                && (cuotasAmortizadas == 0 || isNaN(cuotasAmortizadas))){
            var detalleAmortizacion;
            var interes = ((saldo * _that.tasaInteres) / 30) * modelo.diasterminoperiodo;
            var vlrinteresiva = (interes * _that.interesiva);

            _that.totalIntereses += _that.convertirValorFloat(interes);
            _that.totalInteresIva += _that.convertirValorFloat(vlrinteresiva);
            detalleAmortizacion = _that.crearObjetoDetalle(0, saldo, '-', interes, '-', vlrinteresiva);
            _that.listadoAmortizacion.push(detalleAmortizacion);
        }

        for (var i = 0; i < numeroCuotas; i++) {
            _that.ultimaCuota = i === (numeroCuotas - 1);
            if (i > 0) {
                var indiceMenor = (modelo.diasterminoperiodo < 30 && modelo.diasterminoperiodo > 0 
                        && (cuotasAmortizadas == 0 || isNaN(cuotasAmortizadas))) ? i : i - 1;
                var saldoAnterior = (_that.listadoAmortizacion[indiceMenor].saldo);
                saldo = (saldoAnterior - _that.listadoAmortizacion[indiceMenor].capital);
            }
            if (tipoCuota === 'V') {
                _that.crearNuevaCuotaVariable(saldo, i + 1, numeroCuotas - i);
                continue;
            }
            _that.crearNuevaCuota(saldo, i + 1);
        }

        detalleAmortizacion = _that.crearObjetoDetalle('Total', 0, _that.totalCapital, _that.totalIntereses, _that.totalCuotas, _that.totalInteresIva);
        if (!!modelo) {
            var indiceCuota = (modelo.diasterminoperiodo < 30 && modelo.diasterminoperiodo > 0 
                    && (cuotasAmortizadas == 0 || isNaN(cuotasAmortizadas))) ? 1 : 0;
            modelo.totalIntereses = parseFloat(_that.totalIntereses);
            modelo.valorCuota = parseFloat(_that.listadoAmortizacion[indiceCuota].cuota);
        }
        _that.listadoAmortizacion.push(detalleAmortizacion);
        var table = _that.mostrarTabla(_that.listadoAmortizacion);
        if (!sinAgregar) {
            $("#divTbl").empty().append(table);
        }
        return table;
    },

    /**
     * Calcula y configura una nueva fila con base en el saldo
     * @param  {Number} saldo      Saldo con el que se hará un nuevo cálculo
     * @param  {Number} numeroFila Número de la nueva cuota
     * @returns {void}
     */
    crearNuevaCuota: function (saldo, numeroFila) {
        var detalleAmortizacion;

        var interes = (saldo * _that.tasaInteres);
        var vlrinteresiva = (interes * _that.interesiva);
        var aporteCapita = _that.convertirValorFloat((_that.valorCuotaGlobal - interes));
        var valorCuota = (_that.valorCuotaGlobal + vlrinteresiva);

        _that.totalIntereses += _that.convertirValorFloat(interes);
        _that.totalCuotas += _that.convertirValorFloat(valorCuota);
        _that.totalCapital += aporteCapita;
        _that.totalInteresIva += _that.convertirValorFloat(vlrinteresiva);

        if (_that.ultimaCuota) {
            var diferenciaCapital = _that.capitalInicial - _that.totalCapital;
            aporteCapita += diferenciaCapital;
            _that.totalCapital += diferenciaCapital;
        }
        detalleAmortizacion = _that.crearObjetoDetalle(numeroFila, saldo, aporteCapita, interes, valorCuota, vlrinteresiva);
        _that.listadoAmortizacion.push(detalleAmortizacion);
    },

    /**
     * Crea una nueva cuota variable con base en el saldo y las cuotas pendientes
     * @param  {Number} saldo           Saldo con el que se hará un nuevo cálculo
     * @param  {Number} numeroFila      Número de la nueva cuota
     * @param  {Number} cuotaspendiente Número de cuotas pendientes
     * @returns {void}
     */
    crearNuevaCuotaVariable: function (saldo, numeroFila, cuotaspendiente) {

        var interes = (saldo * _that.tasaInteres);
        var vlrinteresiva = (interes * _that.interesiva);
        var valorCuota = saldo / (cuotaspendiente);

        _that.totalIntereses += _that.convertirValorFloat(interes);
        _that.totalCuotas += _that.convertirValorFloat(valorCuota + interes);
        _that.totalCapital += valorCuota;
        _that.totalInteresIva += _that.convertirValorFloat(vlrinteresiva);

        detalleAmortizacion = _that.crearObjetoDetalle(numeroFila, saldo, valorCuota, interes, (valorCuota + interes), vlrinteresiva);
        _that.listadoAmortizacion.push(detalleAmortizacion);
    },

    /**
     * Convierte un valor numérico a un valor flotante con 2 decimales
     * @param  {Number|String} valor Valor que se va a convertir
     * @returns {Number}       Valor en formato decimal
     */
    convertirValorFloat: function (valor) {
        var strValor = valor.toString().substring(0, valor.toString().lastIndexOf('.') + 3);
        strValor = parseFloat(strValor).toFixed(2);
        return parseFloat(strValor);
    },

    /**
     * Construye un objeto con base en los parámetros enviados
     * @param  {Number} numero
     * @param  {Number} saldo
     * @param  {Number} capital
     * @param  {Numbetr} interes 
     * @param  {Number} cuota   
     * @param  {Number} iva     
     * @returns {Object}
     */
    crearObjetoDetalle: function (numero, saldo, capital, interes, cuota, iva) {
        return {
            'numero': numero,
            'interesiva': iva,
            'cuota': parseFloat(cuota),
            'saldo': parseFloat(saldo),
            'capital': parseFloat(capital),
            'interes': parseFloat(interes)
        };
    },
    /** Calcula valor por cuota para amortización.
     * @param {int} capitalInicial - Total de la Financiación
     * @param {float} intereses - Porcentaje de interés de la financiación
     * @param {int} numeroCuotas - Cantidad de cuotas que se pagrán de la financiación
     * @returns {int} Valor de cada cuota
     */
    calcularValorCuota: function (capitalInicial, intereses, numeroCuotas) {
        if (intereses === 0) {
            return (capitalInicial / numeroCuotas);
        }
        var p = capitalInicial;
        var i = intereses;
        var n = numeroCuotas;
        var numerador = (p * i);
        var denominador = 1 - (Math.pow(1 + i, -n));
        return (numerador / denominador);
    },
    /** Compone la tabla de amortizaciones 
     * @param {object} listadoAmortizacion - Arreglo con la información de la amortización
     * @returns {void}
     */

    mostrarTabla: function (listadoAmortizacion) {
        var tbl = $('<table>').addClass('tabla');
        var thead = $('<thead>').append(
                $('<tr>').append($('<th>').text('No.').css({width: '65px'}),
                $('<th>').text('Saldo').css({width: '100px'}),
                $('<th>').text('Capital').css({width: '100px'}),
                $('<th>').text('Interés').css({width: '93px'}),
                $('<th>').text('Iva Interés').css({width: '100px'}),
                $('<th>').text('Cuota').css({width: '93px'}),
                $('<th>').text('Nvo Saldo').css({width: '100px'})
                ));
        var tbody = $('<tbody>');
        for (var i = 0; i < listadoAmortizacion.length; i++) {

            var item = listadoAmortizacion[i];
            var capital = isNaN(parseInt(item.capital)) ? 0 : item.capital;
            var col1 = $('<td>').css({'text-align': 'center'}).text(item.numero);
            var saldoCapital = item.saldo - capital;
            var trCuota = $('<td>').addClass('td-currency').text(item.cuota.toString().toCurrency());
            var trCapital = $('<td>').addClass('td-currency').text(item.capital.toString().toCurrency());
            var trInteres = $('<td>').addClass('td-currency').text(item.interes.toString().toCurrency());
            var trSaldo = $('<td>').addClass('td-currency').text((item.saldo > 0) ? item.saldo.toString().toCurrency() : '-');
            var trInteresIva = $('<td>').addClass('td-currency').text(item.interesiva >= 0 ? item.interesiva.toString().toCurrency() : '-');
            var trNvoSaldo = $('<td>').addClass('td-currency').text((saldoCapital >= 0) ? saldoCapital.toString().toCurrency() : '0'.toCurrency());

            var fila = $('<tr>').append(col1, trSaldo, trCapital, trInteres, trInteresIva, trCuota, trNvoSaldo);
            tbody.append(fila);
        }

        //var trRelleno = $('<tr>').addClass('tr-imprimir-salto').append(  $('<td colspan="8">').text(' - ')  ).hide();
        //trRelleno.insertBefore(  $(tbody.find('tr')[9])  );
        tbl.append(thead, tbody);
        return tbl;
    }
};

amortizador.init();