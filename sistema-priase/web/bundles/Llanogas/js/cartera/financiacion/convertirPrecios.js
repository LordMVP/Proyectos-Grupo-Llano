/**
 * Objeto que hace referencia al namespace convertirPrecios
 * @type {Object}
 */
var este = null;

/** @namespace */
var convertirPrecios = {
    /**
     * Desglosa un número por unidades
     * @param {int} valor - Número a desglosar
     * @returns {object} Número desglosado
     */
    desglosarNumero: function (valor) {
        var mill = Math.floor(valor / 1000000);
        valor = valor % 1000000;
        var m = Math.floor(valor / 1000);
        valor = valor % 1000;
        var cienes = Math.floor(valor / 1);
        var c = Math.floor(valor / 100);
        valor = valor % 100;
        var d = Math.floor(valor / 10);
        valor = valor % 10;
        var u = Math.floor(valor / 1);
        valor = valor % 1;
        return {millon: mill, miles: m, cienes: cienes, centenas: c, decenas: d, unidades: u};
    },
    /**
     * Convierte un número a letras.
     * @param {int} numero - Número a convertir en letras
     * @returns {String} Número escrito.
     */
    convercionLetras: function (numero) {
        var valorLetras = '';
        var valor = este.desglosarNumero(numero);
        centenas = valor.centenas;
        decenas = valor.decenas;
        unidades = valor.unidades;
        var arregloCentenas = ["CIEN", "CIENTO", "DOSCIENTOS", 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS',
            'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];

        var arregloDecenas = ['VEINTI', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA',
            'OCHENTA', 'NOVENTA'];
        var arregloUnaDecena = ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISEIS', 'DIECIOCHO', 'DIECINUEVE'];
        var arregloUnidades = ['UN', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];

        if (centenas == 1 && decenas == 0 && unidades == 0) {
            valorLetras = arregloCentenas[0];
        } else {
            if (centenas > 0) {
                valorLetras = arregloCentenas[centenas] + " ";
            }
            if (decenas > 0) {
                if (decenas == 1) {
                    valorLetras += arregloUnaDecena[unidades];
                } else if (unidades == 0) {
                    if (decenas == 2) {
                        valorLetras += "VEINTE ";
                    } else {
                        valorLetras += arregloDecenas[(decenas - 2)];
                    }
                } else {
                    valorLetras += arregloDecenas[(decenas - 2)] + " " + arregloUnidades[unidades - 1];
                }
            } else {
                valorLetras += arregloUnidades[(unidades - 1)];
            }
        }
        return valorLetras;
    },
    /**
     * Escribe el sonido de un número determinado
     * @param {string} numero
     * @returns {String} Número escrito.
     */
    conformarPrecio: function (numero) {
        este = convertirPrecios;
        if (numero > 0) {
            var num = numero.toString();
            var millonesString, milesString, centenasString, descripM = '';
            var valor = este.desglosarNumero(numero);
            millon = valor.millon;
            miles = valor.miles;
            cienes = valor.cienes;
            if (millon > 0) {
                millonesString = millon > 1 ? este.convercionLetras(millon) + ' MILLONES ' : 'UN MILLON ';
            }
            descripM = '';
            if (miles > 0) {
                milesString = miles > 1 ? este.convercionLetras(miles) + ' MIL' : 'UN MIL';
            }

            centenasString = cienes > 0 ? este.convercionLetras(cienes) : '';
            return (millonesString && millonesString != '' ? millonesString : '') + ' ' +
                    (milesString && milesString != '' ? milesString : '') + ' ' + centenasString;
        } else {
            return " CERO ";
        }
    },
    /**
     * Convierte una fecha en un objeto desglosado
     * @param {String} fecha - Fecha que se desea convertir
     * @returns {object} Fecha desglosada.
     **/
    convertirFecha: function (fecha) {
        este = convertirPrecios;
        var meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        var diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
        var f = new Date(fecha);
        var fecha = {dialetras: diasSemana[f.getDay()],
            dia: f.getUTCDate(),
            mes: f.getUTCMonth() + 1,
            mesletras: meses[f.getUTCMonth()],
            anioletras: este.conformarPrecio(f.getFullYear()),
            aniodigito: f.getFullYear().toString().substring(2, 4),
            anio: f.getFullYear() ? f.getFullYear() : ''
        };
        return fecha;
    }
};