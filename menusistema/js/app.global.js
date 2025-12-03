/**
 * @fileOverview Archivo para validaciones de objetos y errores
 * @author appfuture
 * @version 1.0.0
 */

/** @namespace */
function App() {};

App.vistaActual = null;
App.controlActual = null;

/** 
 * Valida si una expresion es un arreglo
 * @para {object} data - Cualquier objeto o string que puede ser un arreglo
 * @return {Boolean} - Variable con true si es un arreglo
 **/
App.prototype.esArreglo = function(data) {
    return (Object.prototype.toString.call(data) === "[object Array]") ? true : false;
};

/**
 * Valida si una expresion es instancia de jQuery o un String
 * @param  {string | object} selector puede ser un String con formato de selector o un objeto de jQuery
 * @return {object}          instancia de jquery basada en el selector
 */
App.prototype.esObjJquery = function(selector){
    return ( selector instanceof jQuery )?selector:$(selector);
};

/** Cierra la sesión actual y redirecciona al login
 * @return {void}
 **/
App.prototype.cerrarSesion = function() {
    window.location.assign('/achagua');
    //ojo borrar historial
};

/** 
 * Oculta cargador y muestra error por consola
 * @param {object} err - Información del error provocado
 * @return {Boolean} true;
 **/
App.prototype.controlarErrorGeneral = function(err){
    __dom.ocultarCargador();
    __app.imprimirDataConsola(arguments);
    return true;
}

/** 
 * Visualiza mensaje de error general cuando se produce un error en el servidor
 * @param {object} err - Información del error provocado
 * @return {void}
 **/
App.prototype.controlarError = function(error) {
    __app.imprimirDataConsola(arguments);
    var mensaje = "";
    if (error.mensajeError) {
        mensaje = error.mensajeError;
    } else if(error.mensaje){
        mensaje = error.mensaje;
    }else{
        mensaje = 'Ocurrió un error inesperado en la aplicación, intente de nuevo más tarde o comuníquese con el personal de soporte.';

        if (error[0]!==undefined && error[0].status) {
            switch(error[0].status){
                case 404:
                    mensaje = 'No se ha podido ejecutar la tarea, ya que no se encuentra el recurso de red solicitado.<br/>Intente de nuevo más tarde o comuníquese con el personal de soporte.<br/>Error 404';
                break;
            }
        }
    }
    __dom.toastError(mensaje);
    __dom.ocultarCargador();
};

/**
 * Calcula el cambio y ajuste según el saldo actual y el pago hecho
 * @param {number} saldo - Saldo actual 
 * @param {number} pago - Valor del pago realizado
 * @return {object} - Información de cambio y ajuste cuando se realiza el pago
 **/

App.prototype.calcularCambio = function(saldo, pago) {
    var resultado = {};
    var cambio = 0;
    var ajuste = 0;
    if (pago > saldo) {
        cambio = pago - saldo;
    }
    resultado.cambioReal = cambio;
    var y = cambio.toFixed();
    var decenas = parseInt(y.substring(y.length - 2, y.length));
    if (decenas > 0 && decenas != this.valorAjuste && decenas % this.valorAjuste != 0) {
        if (decenas < this.valorAjuste) {
            ajuste = decenas;
            cambio = cambio - decenas;
        } else {
            ajuste = decenas - this.valorAjuste;
            cambio -= ajuste;
        }
    }
    resultado.cambio = cambio;
    resultado.ajuste = ajuste;
    return resultado;
}

/**
 * Objeto con mensaje utilizados en la aplicación
 * @type {object}
 */
App.prototype.mensajes = {
    camposInvalidosFiltro: 'Debe diligenciar al menos uno de los campos',
    sinResultados: 'No se encontraron resultados',
    cambiarSuscripcionRadio: 'Si cambia la suscripción actual, se perderán los valores del anticipo.\n¿Realmente desea cambiar la suscripción seleccionada?',
    seleccionarOpcion: 'Debe seleccionar una opción al menos',
    diligenciarCampos: 'Debe diligenciar como mínimo 2 campos',
    anticipoGuardado: 'El anticipo ha sido registrado exitosamente',
    tituloExito: 'Operación Exitosa',
    errorGuardarAnticipo: 'Ocurrió un error mientras se intentaba registrar el anticipo, intente de nuevo',
    errorGuardarInformacion: 'Ocurrió un error mientras se intentaba registrar la información, intente de nuevo',
    errorGuardarRecaudo: 'Ocurrió un error mientras se registraba el recaudo, intente de nuevo',
    tituloErrorInesperado: 'Error inesperado',
    camposIncompletosBuscarRecaudo: 'Debe digitar un id de recaudo o id de suscripción o suscriptor',
    confirmacionCancelacion: 'Se cancelará la operación actual ¿Desea continuar?',
    tituloConfirmacion: 'Confirmación',
    seleccionarSuscripcion: 'Debe seleccionar una suscripción para ejecutar esta tarea',
    seleccionarTercero: 'Debe seleccionar una suscripción para ejecutar esta tarea',
    atencion: 'Atención',
    seleccionarFacturas: 'Debe seleccionar al menos una factura',
    seleccionarSolicitante: 'Debe seleccionar un solicitante para esta operación',
    seleccionarBanco: 'Debe seleccionar un banco o entidad financiera para esta operación',
    seleccionarFinanciacion: 'Debe seleccionar al menos una financiación',
    seleccionarOpcionPago: 'Debe seleccionar al menos una forma de pago',
    agregarFormaPago: 'Debe agregar al menos una forma de pago',
    escogerCuotasFinanciacion: 'Para generar la financiación, debe escoger una cantidad de cuotas entre 1 y 24',
    requiereValorFinanciarMayor: 'Debe seleccionar facturas para financiar y el valor a financiar debe ser superior a 0',
    errorGuardarReestructuracion: 'Ocurrió un error al grabar la reestructuración, intente de nuevo',
    registroExitoso: 'Se ha guardado el registro de forma exitosa',
    seleccionarTipoSuscripcion: 'Debe seleccionar un tipo de suscripción',
    seleccionarTipoUsoSuscripcion: 'Debe seleccionar un tipo de uso de suscripción',
    morosidadInvalida: 'Los valores de morosidad deben ser numéricos y son requeridos',
    morosidadRangoInvalido: 'El valor de la morosidad mínima debe ser inferior al valor de morosidad máxima',
    saldoInvalido: 'Los valores del saldo deben ser numéricos y son requeridos',
    salodRangoInvalido: 'El valor del saldo mínimo debe ser inferior al valor del saldo máximo',
    errorValidacion: 'Error en el formulario',
    procesoLanzado: 'Se inició correctamente el proceso',
    errorTraslado: 'Error al realizar el traslado',
    intereses: 'Error al ingresar la tasa de interés',
    seleccionarCiclo: 'Debe seleccionar el ciclo',
    seleccionarFechaCorte:'Debe seleccionar una fecha de corte',
    sinDocumentosTiposDoc:'No se encontraron documentos ni tipos de documento',
    tipoLiquidacion:'Debe seleccionar un tipo de liquidación',
    seleccionarLiquidacion:'Debe seleccionar una liquidación',
    valorPagadoMayorDeuda:'La sumatoria de las formas de pago debe ser igual al saldo actual',
    valorPagadoMayorPagado:'La sumatoria de las formas de pago debe ser igual al valor por pagar',
    valorPagadoDiferenteAnticipo:'La sumatoria de las formas de pago debe ser igual al total del anticipo',
    sinDetallesLectura:'La suscripción seleccionada no tiene detalles de lectura',
    suscripcionSinFacturas:'La suscripción seleccionada no tiene facturas con saldo',
    facturasSinSaldo:'No hay facturas con saldo',
    confirmaCancelarFormasPago:'Se eliminarán las formas de pago ¿Desea continuar?',
    suscripcionSinDevoluciones:'La suscripción seleccionada no cuenta con devoluciones registradas',
    seleccionarDevoluciones:'Debe seleccionar al menos una devolución',
    seleccionarMotivo:'Debe seleccionar un motivo antes de continuar',
    escribirObservacion:'Debe escribir una observación',
    escribirDescripcion:'Debe escribir una descripción',
    errorCamposConsultarFinanciaciones:'Para consultar una financiación, escriba ide de la financiación. También puede consultar por un id de suscripción o código anterior e incluir un rango de fechas.',
    seleccionarDocumentos: 'Debe seleccionar tipo documento y documento.', 
    sinArchivos: 'No se han subido archivos',
    seleccionarFechaInicioSuspension: 'Debe seleccionar una fecha de inicio y una fecha de fin de suspensión para ejecutar el proceso',
    fechaDesdeMenorQueHastaProcesoSuspension: 'Debe seleccionar un numero máximo de cantidad de facturas vencidas superior al nímero mínimo',
    seleccionarConceptoDocumento: 'Debe seleccionar conceptos y/o documentos',
    sinCambios: 'No se han detectado cambios, no se realizará ninguna acción', 
    seleccionarVenta: 'Debe seleccionar una venta para ejecutar esta tarea',
    mismaFormaPago: 'No se pueden definir dos formas de pago del mismo tipo. Revise las formas de pago e intente de nuevo.',
    seleccionarMunicipio: 'El municipio es obligatorio',
    seleccionarTipoOperacion: 'Debe seleccionar el tipo de operación a realizar',
    valorPagarMenorDeuda: 'El valor que desea pagar es mayor al valor de la deuda, intente nuevamente'
};


App.prototype.valorAjuste = 50;
/**
 * Detiene el evento de los botones en los diferentes navegadores
 * @param {object} e - Evento que se deterndrá
 * @return{void}
 **/
App.prototype.cancelarEvento = function(e) {
    if (e.preventDefault) {
        e.preventDefault();
    } else if (e.stopPropagation) {
        e.stopPropagation();
    } else if (e.returnValue) {
        e.returnValue = false;
    }
};

/** 
 * Duplica la información de un objeto y este queda independiente
 * @param {object} obj- Objeto que se desea duplicar
 * @return {object} temp - Nuevo objeto generado 
 **/
App.prototype.clonarObjeto = function(obj){
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    var temp = obj.constructor(); // give temp the original obj's constructor
    for (var key in obj) {
        temp[key] = cloneObject(obj[key]);
    }
    return temp;
};

/** 
 * Imprime los errores producidos en la aplicación de una forma organizada y entendible
 * @param {object} data - Información sobre el error que se generó
 * @return {void} 
 **/
App.prototype.imprimirDataConsola = function(data){
    //debugger;
    function ErrorJS(err, archivo, linea, col) {
        this.err = err;
        this.archivo = archivo.split('script')[1];
        this.linea = linea;
        this.col = col
    }

    var errors = {};

    if (typeof data[0] === 'string') {
        console.groupCollapsed('%cError: '+data[0], 'color:#D57370;');
        errors.err = new ErrorJS(data[0], data[1], data[2], data[3]);
        console.table(errors, ["err", "archivo", "linea", "col"]);
        console.log('Link al archivo: ', data[1]+':'+data[2]);
        console.log('Detalles:', data[4].stack);
        console.groupEnd();
    }

    if (typeof data[0] === 'object') {
        var error = data[0];

        if (error.mensaje || error.mensajeError || error.mensajeRespuesta) {
            detalle1 = 'Error de la aplicación, código '+error.codigoRespuesta;
            detalle2 = error.mensaje || error.mensajeError || error.mensajeRespuesta;
        }else{
            var detalle1 = error[1]?error[1]:error[0].statusText;
            var detalle2 = error[2]?error[2]:error[0].status;
        }

        detalle2 = detalle2.toString().substring(0, 100)+'...';


        console.groupCollapsed('%cMensaje -> '+ detalle1 +': '+ detalle2, 'color:#D57370;');
        console.log('Detalles:', error);
        console.groupEnd();
    }
}

App.prototype.onResize = function() {
    var dialogo = $('.ui-dialog');
    if (dialogo.length>0) {
        dialogo.css('top', ($(window).scrollTop()+100)+'px');
    }
    var h = $('#divGeneral').height()+25;
    $('#divBarraOcultarMenu').height( h ).find('#btnOcultarMenu').height( h );
};

App.prototype.ajustarAnchoMenu = function() {
    var menu = $('#menu');
    var divGeneral = $('#divGeneral');
    var divAppContainer = $('#divAppContainer');
    var wMenu = menu.width();

    var wWindow = $(window).width();
    if (!menu.is(':visible')) {
        if (wWindow>=1200) {
            divGeneral.width( divAppContainer.width()-20 );
        }else if(wWindow<=1199 && wWindow>=992){
            divGeneral.width( divAppContainer.width()-20 );
        }else if(wWindow<=991 && wWindow>=768){
            divGeneral.width( divAppContainer.width()-30 );
        }else{ //inferior a 767
            divGeneral.width( divAppContainer.width()-30 );
        }
    }else{
        if (wWindow>=1200) {
            divGeneral.width( divAppContainer.width()-(wMenu+60) );
        }else if(wWindow<=1199 && wWindow>=992){
            divGeneral.width( divAppContainer.width()-(wMenu+60) );
        }else if(wWindow<=991 && wWindow>=768){
            divGeneral.width( divAppContainer.width()-(wMenu+60) );
        }else{ //inferior a 767
            divGeneral.width( divAppContainer.width()-(wMenu+60) );
        }
    }
    __app.onResize();
};

App.prototype.obtenerFechaSistema = function(){
    var respuesta = __cnn.ajax({
        url:'/achagua/sistema/web/app.php/util/obtener_fecha/',
        async:false,
        background:true
    });
    return new Date(respuesta.fecha);
}

/**
 * Aplica el formato de dinero a una cadena de texto
 * return {string} Cadena de texto con formato de texto
 **/
String.prototype.toCurrency = function () {
    if (! isNaN(this)) {
        strValor = '';
        if(this.toString().indexOf('.')!==-1){
            strValor = parseFloat(this.toString().substring(0, this.toString().lastIndexOf('.')+3));
        }else{
            strValor = parseFloat(this);
        }
        return ('$'+parseFloat(strValor).toFixed(2)).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }else{
        return '-';
    }
};

/** 
 * Obtiene la última letra de una cadena de texto 
 * return{string} Último caracter del string
 **/
if (!String.prototype.endsWith) {
  String.prototype.endsWith = function(searchString, position) {
      var subjectString = this.toString();
      if (position === undefined || position > subjectString.length) {
        position = subjectString.length;
      }
      position -= searchString.length;
      var lastIndex = subjectString.indexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
  };
}

/** 
 * Duplica la información de un arreglo y este queda independiente
 * @param {object} obj- Arreglo que se desea duplicar
 * @return {object} temp - Nuevo arreglo generado 
 **/
App.prototype.clonarArreglo = function(arreglo){
    if(__app.esArreglo(arreglo)){
        var nuevoArreglo = [];
        for(var indice = 0; indice < arreglo.length; indice++){
            nuevoArreglo.push(arreglo[indice]);
        }
        return nuevoArreglo;
    }
}