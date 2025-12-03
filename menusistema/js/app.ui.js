/**
 * @fileOverview Archivo para funcionalidades genéricas de vistas
 * @author appfuture
 * @version 1.0.0
 */

/** @namespace */
function Dom() {}
;

/**
 * Función que muestra cargador en la parte superior de la página
 * @return {void}
 **/
Dom.prototype.mostrarCargador = function (modal) {

    var divCargador = $('div#divCargador')

    if (modal) {
        window.cargadorModalActivo = true;
        window.controlActual = $('*:focus');
        $('#divDialogoCargador').dialog({modal: true}).parent().css({'top': '-10000px', 'opacity': '0'});

        $('body').addClass('no-scroll');
    }

    if (!this.divCargador)
        this.divCargador = divCargador;
    this.divCargador.slideDown('fast');
};

/** 
 * Función que oculta el cargador en la parte superior de la página
 * @return {void}
 **/
Dom.prototype.ocultarCargador = function () {
    $('div#divCargador').slideUp('fast', function () {

        if (window.cargadorModalActivo) {
            $('#divDialogoCargador').dialog('close');
            if (window.controlActual && window.controlActual.length > 0) {
                window.controlActual.focus();
                delete window.controlActual;
            }
            window.cargadorModalActivo = false;
        }

        $('body').removeClass('no-scroll');
    });
};

/** 
 * Muestra cuadro de diálogo en una página
 * @param {object} contenido - Cuerpo del cuadro de diálogo que se mostrará
 * @param {string} titulo - Título del cuadro de diálogo
 * @return {void}
 **/
Dom.prototype.mostrarDialogo = function (contenido, titulo) {
    if (!this.divDialogo) {
        this.divDialogo = $("#divDialogo");
    }
    this.divDialogo.html(contenido.show()).dialog({
        'minWidth': 960,
        'minHeight': 200,
        'title': titulo,
        'modal': true
    });
};
/** 
 * Cierra cuadro de diálogo actual
 * @return {void}
 **/
Dom.prototype.ocultarDialogo = function () {
    this.divDialogo.dialog("close");
};

Dom.prototype.ajustarContenido = function (e) {};

/** 
 * Función que carga una lista html con radio button para seleccionar una opción
 * @param {array}  datos - Listado con la información que se mostrará
 * @param {string} val - Atributo de cada objeto que es la llave
 * @param {array} args - Nombre de los atrinbutos de cada objeto que se desea mostrar
 * @return {objet} div - Lista html
 **/
Dom.prototype.crearLista = function (datos, val, args) {
    var div = $('<div>').addClass('listaSeleccion');
    $.each(datos, function (i, item) {
        var divItem = $('<div>');
        var radio = $('<input type="radio" >').val(item[val]).attr({
            'data-index': i,
            'id': 'radio' + i,
            'name': 'radioGroup'
        });
        var label = $("<label>").attr('for', 'radio' + i);
        var texto = "";
        for (var x in args) {
            texto += item[args[x]] + " - ";
        }
        label.text(texto.substring(0, texto.length - 2));
        divItem.append(radio).append(label);
        div.append(divItem);
    });
    return div;
};

/**
 * Función que abre una cuadro de diálogo para hacer la búsqueda de objetos
 * cuando se termina de hacer petición ajax la información se carga en una lista
 * @param{string} titulo - Título del cuadro de diálogo
 * @param{object} _campos -  html de los campos que estarán dentro del cuadro
 * @param{function} _invocacion - Función a la que se hará petición ajax
 * @param{object} argumentos - Información que se debe mostrar en la lista final
 * @param{function} _invocacionFinal - Función que se ejecutará cuando se selecciona una opción de la lista
 * @param{object} coleccion - Información específica que se obtendrá de la consulta y será guardada
 * @return{void}
 **/
Dom.prototype.crearDialogoBusqueda = function (titulo, _campos, _invocacion, argumentos, _invocacionFinal, coleccion) {

    var div = $('<div>').css({
        'width': '960',
        'min-height': '400'
    }).attr('id', 'divFiltro');
    var divCampos = $('#' + _campos).html();
    var campos = $('<div>').addClass('divCampos').html(divCampos);
    var divMensaje = $('<div>');
    var pMensaje = $('<p>').addClass('pMensaje');
    var btnFiltrar = $('<input>').attr({
        'type': 'button',
        'value': 'Buscar',
        'class': 'btnSimple'
    });
    var resultado = $('<div>').css({
        'width': '95%',
        'border': 'solid 1px #333'
    });
    var btnFinalizar = $('<input>').attr({
        'type': 'button',
        'value': 'Finalizar',
        'class': 'btnSimple'
    }).css('display', 'none');

    var data = {};
    var jsonResultado = null;

    btnFiltrar.on('click', function () {
        var inputs = campos.find('div.campo input');
        //construir el objeto json que sera enviado a la peticion
        inputs.each(function (i, input) {
            var _input = $(input);
            data[_input.attr('data-attr')] = _input.val();
        });

        //validar que los campos esten llenos
        var camposIncorrectos = 0;

        for (var prop in data) {
            if (prop !== undefined || prop !== null) {
                camposIncorrectos += (data[prop].trim() === '') ? 1 : 0;
            }
        }

        if (camposIncorrectos === inputs.length) {
            pMensaje.text('Debe llenar al menos un campo');
        } else {
            pMensaje.text('Enviando los parámetros de búsqueda');
            jsonResultado = _invocacion(data, false);
            __dom.ocultarCargador();

            if (jsonResultado !== undefined) {
                switch (parseInt(jsonResultado.codigoRespuesta)) {
                    case 1:
                        pMensaje.text("Registros encontrados:");
                        if (jsonResultado[coleccion] !== null) {
                            resultado.html(__dom.crearLista(jsonResultado[coleccion], argumentos.val, argumentos.args));
                            btnFinalizar.show();
                            btnFinalizar.on('click', function () {
                                var selected = resultado.find('input[type="radio"]:checked');
                                if (selected.length > 0) {
                                    __app.modelo = jsonResultado[coleccion][parseInt(selected.attr('data-index'))];
                                    _invocacionFinal();
                                    __dom.ocultarDialogo();
                                } else {
                                    alert('debe seleccionar una opción');
                                }
                            });
                        } else {
                            __app.modelo = jsonResultado.datos[parseInt(selected.attr('data-index'))];
                            _invocacionFinal();
                            __dom.ocultarDialogo();

                        }
                        break;
                    case 0:
                        pMensaje.text("No se encontraron registros, intente con otro parámetro de búsqueda");
                        resultado.html('');
                        btnFinalizar.hide();
                        break;
                    case - 1:
                        pMensaje.text(jsonResultado.mensajeError);
                        resultado.html('');
                        btnFinalizar.hide();
                        break;
                    case - 2:
                        resultado.html('');
                        btnFinalizar.hide();
                        __app.cerrarSesion();
                        break;
                }
            } else {
                __dom.ocultarCargador();
                $('.pMensaje').text('Ocurrió un error enviando la solicitud, intente de nuevo más tarde');
            }
        }
    });
    div.append(campos);
    div.append('<hr class="limpiar" />');

    divMensaje.append(pMensaje);
    divMensaje.append(btnFiltrar);
    div.append(divMensaje);
    div.append('<hr class="limpiar" />');

    div.append(resultado);
    div.append('<hr class="limpiar" />');
    div.append(btnFinalizar);
    div.append('<hr class="limpiar" />');
    this.mostrarDialogo(div, titulo);
};

/** 
 * Configura los eventos listeners de los botones de cabecera
 * @param {object} config - Nombre del evento asignado según el botón
 **/
Dom.prototype.configurarBotonera = function (config) {
    var divComandos = $('#divComandos');
    var botones = divComandos.find('.btn');
    //eliminar eventos asociados a los botones
    botones.each(function (i, btn) {
        $(btn).off('click');
    });

    //JSON ESPERADO {'nuevo':'', 'grabar':'', 'eliminar':'', 'primero':'', 'anterior':'', 'siguiente':'', 'ultimo':'', 'filtrar':''}
    divComandos.find('#btnNuevo').on('click', config.nuevo);
    divComandos.find('#btnGrabar').on('click', config.grabar);
    divComandos.find('#btnPrimero').on('click', config.primero);
    divComandos.find('#btnAnterior').on('click', config.anterior);
    divComandos.find('#btnSiguiente').on('click', config.siguiente);
    divComandos.find('#btnUltimo').on('click', config.ultimo);
    divComandos.find('#btnFiltrar').on('click', config.filtrar);
    divComandos.find('#btnEliminar').on('click', config.eliminar);
};
/** 
 * Función que configura una caja de texto para funcionalidad de fechas mayores al año 1980
 * @param {object} selector - Cajas de texto a las que se le aplicará la funcionalidad
 * @return {object} datePicker - Caja de texto con funcionalidad
 * 
 **/
Dom.prototype.configurarCalendario = function (selector) {
    var maxYear = new Date().getFullYear() + 5;
    $.datepicker.setDefaults($.datepicker.regional.es);
    var datePicker = $('#' + selector).datepicker({
        dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
        dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"],
        monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
        dateFormat: 'yy/mm/dd',
        yearRange: '1960:' + maxYear,       
        changeYear: true,
        changeMonth: true//,
                //minDate:new Date(1980, 00, 01),
                //maxDate:new Date(maxYear, 11, 31)
    });
    datePicker.mask('9999/99/99');
    return datePicker;
};
/** 
 * Función que configura una caja de texto para funcionalidad de fechas mayores al año 1980
 * @param {object} selector - Cajas de texto a las que se le aplicará la funcionalidad
 * @return {object} datePicker - Caja de texto con funcionalidad
 * 
 **/
Dom.prototype.configurarCalendario = function (selector) {
    var maxYear = new Date().getFullYear() + 5;
    $.datepicker.setDefaults($.datepicker.regional.es);
    var datePicker = $('#' + selector).datepicker({
        dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
        dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"],
        monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
        dateFormat: 'yy/mm/dd',
        yearRange: '1960:' + maxYear,
        
        changeYear: true,
        changeMonth: true//,
                //minDate:new Date(1980, 00, 01),
                //maxDate:new Date(maxYear, 11, 31)
    });
    datePicker.mask('9999/99/99');
    return datePicker;
};
/** 
 * Función que configura una caja de texto para funcionalidad de fechas  restricción de fecha max al dia de registro
 * @param {object} selector - Cajas de texto a las que se le aplicará la funcionalidad
 * @return {object} datePicker - Caja de texto con funcionalidad
 **/
Dom.prototype.configurarCalendarioMaxFecha = function (selector) {
    $.datepicker.setDefaults($.datepicker.regional.es);
    var datePicker = $('#' + selector).datepicker({
        dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
        dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"],
        monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
        dateFormat: 'yy/mm/dd',
        maxDate: '+0m +0d' ,
        changeYear: true,
        changeMonth: true
    });
    datePicker.mask('9999/99/99');
    return datePicker;
};
/** 
 * Función que configura una caja de texto para funcionalidad de fechas  restricción de fecha max al dia de registro
 * @param {object} selector - Cajas de texto a las que se le aplicará la funcionalidad
 * @return {object} datePicker - Caja de texto con funcionalidad
 **/
Dom.prototype.configurarCalendarioMaxFecha = function (selector) {
    $.datepicker.setDefaults($.datepicker.regional.es);
    var datePicker = $('#' + selector).datepicker({
        dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
        dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"],
        monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
        dateFormat: 'yy-mm-dd',
        maxDate: '+0m +0d',
        changeYear: true,
        changeMonth: true
    });
    datePicker.mask('9999-99-99');
    return datePicker;
};

/**
 * Función que configura cajas de texto para funcionalidad de fecha - tiempo
 * @param {object} - Objeto jQuery al que se le aplicará funcionalidad
 * @return {object} - Caja de texto configurada
 **/
Dom.prototype.configurarCalendarioTiempo = function (selector) {
    var datePicker = $('#' + selector).datetimepicker({
        lang: 'es'
    });
    return datePicker;
};
/**
 * Función que configura una caja de texto para funcionalidad de fecha - tiempo
 * @param {object} - Objeto jQuery al que se le aplicará funcionalidad
 * @return {object} - Caja de texto configurada
 **/
Dom.prototype.configurarCalendarioTiempoClass = function (selector) {
    var datePicker = $(selector).datetimepicker({
        lang: 'es'
    });
    return datePicker;
};
/** 
 * Función que muestra información importante en cuadro de diálogo
 * @param{string} message - Mensaje que se debe visualizar 
 * @param{string} title - Título del cuadro de diálogo
 * @param{function} oKFuncion - Función que se dispara al oprimir primer botón
 * @param{function} cancelFuncion - Función que se dispara si hay un segundo botón
 * @param{function} closeFunction - Función ejecutada cuando el cuadro de diálogo se dispara
 * @return{void}
 **/
Dom.prototype.lanzarAlerta = function (message, title, okFuncion, cancelFuncion, closeFunction) {
    var botones = {
        "Aceptar": function () {
            $(this).dialog("close");
            if (okFuncion && (typeof okFuncion === 'function')) {
                okFuncion();
            }
        }
    };
    if (!!cancelFuncion) {
        botones.Cancelar = function () {
            $(this).dialog("close");
            if (typeof cancelFuncion === 'function') {
                cancelFuncion();
            }
        };
    }
    $('body').addClass('no-scroll');
    $("<div>").dialog({
        buttons: botones,
        close: function (event, ui) {
            $('body').removeClass('no-scroll');
            $(this).remove();
            if (closeFunction) {
                closeFunction();
            }
        },
        resizable: false,
        title: title,
        width: 550,
        modal: true
    }).html(message);
    $('.ui-dialog').css('top', ($(window).scrollTop() + 200) + 'px');
};
/** 
 * Mostrar cuadro de diálogo con mensaje y sin funcionalidad
 * @param{string} message - Mensaje que se mostrará
 * @param{string} title - Título del cuadro de diálogo
 * @return{void}
 **/
Dom.prototype.lanzarAlertaOk = function (message, title) {
    var botones = {
        "Aceptar": function () {
            $(this).dialog("close");
        }
    };
    $("<div>").dialog({
        buttons: botones,
        close: function (event, ui) {
            $(this).remove();
        },
        resizable: false,
        title: title,
        width: '550px',
        modal: true
    }).text(message);
};

Dom.prototype.configurarTextoNumerico = function (selector, aceptaNegativo, aceptaDecimales, validaEnBlur) {
    var input = selector;
    if (!(selector instanceof jQuery)) {
        var input = $('#' + selector);
    }

    var eventos = {};
    eventos.keypress = function (e) {
        var _input = e.currentTarget;
        var texto = _input.value;
        if (aceptaDecimales && e.which === 46) {

            if (texto.trim() === '') {  //evita que se ponga un . al iniciar la caja
                return false;
            }

            if (texto.indexOf('.') !== -1) { //evita que se ponga más de un signo .
                return false;
            }

            if (!isNaN(texto) && parseInt(texto) === 0) {
                if (texto.startsWith('-')) {
                    e.currentTarget.value = '-0.';
                } else {
                    e.currentTarget.value = '0.';
                }
                return false;
            }

            return true; //se agrega un punto normalmente
        }
        if (aceptaNegativo && e.which === 45) {
            if (_input.selectionStart === 0) {
                return true;  //evita que se ponga el guión, si no es la en la primera posición.
            }

            if (texto.indexOf('-') !== -1) {
                return false;  //evita que se pueda agregar más de un guión
            }

            if (texto.trim().length > 0) { //evita que se ponga un guión, si no es el primer carácter
                return false;
            }

            return true;
        }
        if (e.which !== 8 && e.which !== 0 && (e.which < 48 || e.which > 57)) {
            return false;
        }
    };


    if (validaEnBlur) {
        eventos.blur = function () {
            var _this = $(this);
            var valor = _this.val();
            var title = _this.attr('title') !== undefined ? _this.attr('title') : '';
            var toolTipTexto = 'Solo se admiten valores numéricos positivos';
            var regex = /[0-9]/;
            if (aceptaNegativo && aceptaDecimales) {
                regex = /^-?[0-9]\d*(\.\d+)?$/;
                toolTipTexto += ', decimales y negativos';
            } else if (aceptaNegativo && !aceptaDecimales) {
                regex = /^-?[0-9]\d?$/;
                toolTipTexto += ' y negativos';
            } else if (!aceptaNegativo && aceptaDecimales) {
                regex = /^([0-9])*.([0-9])*$/;
                toolTipTexto += ' y decimales, no negativos';
            } else {
                regex = /^\d+$/;
            }

            if (!regex.test(valor)) {
                _this.val('').addClass('campoInvalido');
                _this.attr('title', toolTipTexto);
                _this.prev().attr('title', title + ' \n ' + toolTipTexto);
                return false;
            } else {
                var _val = _this.val();
                if (parseFloat(valor) === 0) {
                    _this.val('0');
                }

                if (valor.endsWith('.')) {
                    _this.val(valor.substring(0, valor.length - 1))
                }

                if (aceptaDecimales) {
                    _this.val(parseFloat(valor));
                }

                _this.attr('title', title);
                _this.removeClass('campoInvalido');
                return true;
            }
        };
    }

    return input.on(eventos);
};

Dom.prototype.crearCombo = function (id, datos, valor, texto) {
    var combo = $('<select>').attr('id', id);
    $.each(datos, function (i, item) {
        var opcion = $('<option>');
        opcion.attr('value', item[valor]);
        opcion.text(item[texto]);
        combo.append(opcion);
    });
    return combo;
};

Dom.prototype.toastError = function (mensaje) {
    var toast = $('.toast');
    if (toast.length === 0) {
        toast = $('<div>').addClass('toast').append('<p>');
        $('body').append(toast);
    }
    toast.find('p').html(mensaje);
    toast.fadeIn('slow').delay(12000).fadeOut('slow');
};

Dom.prototype.ocultarToast = function () {
    var toast = $('.toast').hide();
};

Dom.prototype.validarNumeroDecimal = function (valor) {
    return /^([0-9])*.([0-9])*$/.test(valor);
};

// Metodo Personalizado
// Autor : Leonardo Malaver Rubio
// Fecha : 2014-12-11
// Funcionalidad : Activar o Inactivar un selecttor(es) , Recibe el grupo de Selectores en parametro SelectorControl, y parametro
// Tipo que indica A si es para activar o I para Inactivar
Dom.prototype.controlActivacionSelectores = function (SelectorControl, Tipo) {
    switch (Tipo) {
        case('A') :
            $(SelectorControl).removeAttr('disabled');
            break;
        case('I') :
            $(SelectorControl).attr('disabled', 'disabled');
            break;
    }
};
// Metodo Personalizado
// Autor : Leonardo Malaver Rubio
// Fecha : 2014-12-11
// Funcionalidad : Incializar Valor de selector(es) , Recibe el grupo de Selectores en parametro SelectorInicializar
Dom.prototype.inicializarValorSelectores = function (SelectorInicializar) {
    $(SelectorInicializar).val('');

};

Dom.prototype.configurarColapsable = function (contenedor) {
    if (!(contenedor instanceof jQuery)) {
        contenedor = $(contenedor);
    }

    var titulo = contenedor.find('.divColapsable');
    var contenido = contenedor.find('.contenidoColapsable');

    //titulo.find('.btnColapsable a').on('click', function (e) {
    var toggleColapse = function (e) {
        if (e.keyCode && (e.keyCode !== 13 && e.keyCode !== 32)) {
            return;
        }

        if (e.target.tagName === 'A' || (e.keyCode && e.keyCode === 32)) {
            __app.cancelarEvento(e);
            if (e.target.tagName === 'A' && e.target.classList.contains('fa-times')) {
                return;
            }
        }

        var divBarra = $(this);
        divBarra.find('.fa:not(.fa-times)').toggleClass('fa-minus').toggleClass('fa-plus');
        var contenido = $(this).next();
        contenido.slideToggle('fast');
    };

    titulo.attr('tabIndex', 0)
            .on({
                'click': toggleColapse,
                'keypress': toggleColapse
            });
};

Dom.prototype.llenarCombo = function (combo, data, valor, texto) {
    combo = __app.esObjJquery(combo);
    combo.html('');
    combo.append($('<option value="-1">').text('Seleccione una opción'));
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        var opcion = $('<option>').attr('value', item[valor]).text(item[texto]);
        combo.append(opcion);
    }
    combo.val('-1');
    return combo;
};


Dom.prototype.configurarAutocomplete = function (selector, source, selectCallback, clearCallback) {
    selector = __app.esObjJquery(selector);
    selector.autocomplete({
        source: source,
        minLength: 3,
        select: function (event, ui) {
            $(this).val(ui.item ? ui.item.value : '').attr('data-value', ui.item.value);
            $(this).removeAttr('title').removeClass('campoInvalido');
            selectCallback(event, ui);
        },
        open: function () {
            $(this).css('z-index', '999999999');
        }
    }).on('keyup', function () {
        var txt = $(this);
        var val = txt.val().trim();
        if (txt.val().trim() == '') {
            txt.removeAttr('data-value');
            txt.attr('title', 'Debe seleccionar una opción válida').addClass('campoInvalido');
            clearCallback(txt);
            return;
        }
        if (txt.attr('data-value') !== undefined && txt.val().trim() !== txt.attr('data-value')) {
            txt.removeAttr('data-value');
            txt.attr('title', 'Debe seleccionar una opción válida').addClass('campoInvalido');
            clearCallback(txt);
        }
    }).on('blur', function () {
        var txt = $(this);

        if (txt.attr('data-value') === undefined) {
            txt.attr('title', 'Debe seleccionar una opción.').addClass('campoInvalido');
            return;
        }

        if (txt.attr('data-value') !== undefined && txt.val().trim() !== txt.attr('data-value')) {
            txt.removeAttr('data-value');
            txt.attr('title', 'Debe seleccionar una opción válida').addClass('campoInvalido');
            return;
        }
    });
};




Dom.prototype.CrearObjHtml = function (parametros, DivContenedor)
{
    $(DivContenedor).html('');
    $.each(parametros.datos, function (i, item) {
        if (item.tipo === 'T' || item.tipo === 'N' || item.tipo === 'F')
        {
            var DivCampos = $('<div>');
            DivCampos.html('');
            DivCampos.attr('class', 'campo');
            var Labelcampo = $('<label>');
            Labelcampo.attr('for', item.tipoideregistro);
            Labelcampo.text(item.tiponombre);
            var campoTextoGenerico = $('<input>').attr('id', item.tipoideregistro);
        }
        switch (item.tipo) {
            case ("M") :
                var DivCampos = $('<div>');
                DivCampos.html('');
                DivCampos.attr('class', 'campo');
                var Labelcampo = $('<label>');
                Labelcampo.attr('for', item.tipoideregistro);
                Labelcampo.text(item.tiponombre);
                var combo = $('<select>').attr('id', item.tipoideregistro);
                combo.attr('multiple', 'multiple');
                combo.attr('size', 5);
                combo.html('');
                $.each(item.opciones, function (x, itemx) {
                    var opcion = $('<option>');
                    opcion.attr('value', itemx.dtip_ideregistr);
                    opcion.text(itemx.dtip_valor);
                    combo.append(opcion);
                });
                Labelcampo.append(combo);
                DivCampos.append(Labelcampo);
                $(DivContenedor).append(DivCampos);
                break;
            case ("O") :
                if (item.opciones.length > 0) {
                    var DivCampos = $('<div>');
                    DivCampos.html('');
                    DivCampos.attr('class', 'campo');
                    var Labelcampo = $('<label>');
                    Labelcampo.attr('for', item.tipoideregistro);
                    Labelcampo.text(item.tiponombre);
                    var combo = $('<select>').attr('id', item.tipoideregistro);
                    combo.html('');
                    $.each(item.opciones, function (x, itemx) {
                        var opcion = $('<option>');
                        opcion.attr('value', itemx.dtip_ideregistr);
                        opcion.text(itemx.dtip_valor);
                        combo.append(opcion);
                    });
                    Labelcampo.append(combo);
                    DivCampos.append(Labelcampo);
                    $(DivContenedor).append(DivCampos);
                }
                break;
            case ("T") :
                campoTextoGenerico.attr('type', 'text');
                Labelcampo.append(campoTextoGenerico);
                DivCampos.append(Labelcampo);
                $(DivContenedor).append(DivCampos);
                break;
            case ("F") :
                campoTextoGenerico.attr('type', 'text');
                Labelcampo.append(campoTextoGenerico);
                DivCampos.append(Labelcampo);
                $(DivContenedor).append(DivCampos);
                __dom.configurarCalendario(item.tipoideregistro);
                break;
            case ("N") :
                campoTextoGenerico.attr('type', 'number');
                Labelcampo.append(campoTextoGenerico);
                DivCampos.append(Labelcampo);
                $(DivContenedor).append(DivCampos);
                break;
            case ("A") :
                break;
        }


    });

};

Dom.prototype.CrearObjHtml = function (parametros, DivContenedor)
{
    $(DivContenedor).html('');
    $.each(parametros.datos, function (i, item) {
        var DivCampos = $('<div>');
        DivCampos.html('');
        DivCampos.attr('class', 'campo');
        var Labelcampo = $('<label>');
        Labelcampo.attr('for', item.tipoideregistro);
        Labelcampo.text(item.tiponombre + '_codigoBD_' + item.tipoideregistro);
        if (item.tipo === 'T' || item.tipo === 'N' || item.tipo === 'F')
        {
            var campoTextoGenerico = $('<input>').attr('id', item.tipoideregistro);
            if (item.restringe === 'S') {
                $.each(item.opciones, function (a, itema) {
                    campoTextoGenerico.attr('expresion_regular', itema.dtip_formato);
                });
            }
        }
        switch (true) {
            case (item.tipo === "M" || item.tipo === "O") :
                var combo = $('<select>').attr('id', item.tipoideregistro);
                if (item.tipo === "M") {
                    combo.attr('multiple', 'multiple');
                    combo.attr('clase', 'listaSeleccion');
                    combo.attr('size', 5);
                }
                combo.attr('obligatorio', item.obligatorio);
                combo.html('');
                $.each(item.opciones, function (x, itemx) {
                    var opcion = $('<option>');
                    opcion.attr('value', itemx.dtip_ideregistr);
                    opcion.text(itemx.dtip_valor);
                    combo.append(opcion);
                });
                Labelcampo.append(combo);
                DivCampos.append(Labelcampo);
                $(DivContenedor).append(DivCampos);
                break;
            case (item.tipo === "A") :
                break;
            default:
                if (item.tipo === 'T' || item.tipo === 'F') {
                    campoTextoGenerico.attr('type', 'text');
                    campoTextoGenerico.attr('obligatorio', item.obligatorio);
                }
                if (item.tipo === 'N') {
                    campoTextoGenerico.attr('type', 'number');
                }
                Labelcampo.append(campoTextoGenerico);
                DivCampos.append(Labelcampo);
                $(DivContenedor).append(DivCampos);
                if (item.tipo === 'F') {
                    __dom.configurarCalendario(item.tipoideregistro);
                }
                break;
        }
    });
};

$.fn.dialogo = function (opt) {
    return this.each(function () {

        _this = $(this);

        var altoInicial = 0;
        var scrollInicial = null;

        //$('body').addClass('no-scroll');
        $('.ui-dialog').css('top', ($(window).scrollTop() + 200) + 'px');

        var funcionCierre = null;
        if (opt.beforeClose) {
            var funcionCierre = opt.beforeClose;
            delete opt.beforeClose;
        }

        var valoresDefecto = {
            resizable: false,
            modal: true,
            beforeClose: function (evt, ui) {
                var _this = $(this);
                $('body').removeClass('no-scroll');
                _this.css('max-height', altoInicial);
                _this.css('overflow-y', scrollInicial);
                if (funcionCierre) {
                    funcionCierre(evt, ui);
                }
            },
            open: function (evt, ui) {
                var _this = $(this);
                altoInicial = _this.css('max-height');
                scrollInicial = _this.css('overflow-y');
                _this.css('max-height', '60vh');
                var altoVentana = $(window).height();
                if (_this.height() > (altoVentana - 150)) {
                    _this.css('overflow-y', 'scroll');
                    $('.ui-dialog').css('top', ($(window).scrollTop() + 50) + 'px');
                }
            }
        };

        $.extend(opt, valoresDefecto);
        _this.dialog(opt);
    });
};


$.fn.toTxtCurrency = function (fnc) {
    return this.each(function () {
        var _this = $(this);
        var valorOriginal = _this.val();
        var valor = _this.val();
        if (valor.startsWith('$')) {
            valor = valor.replace(/\$/g, '');
        }
        if (isNaN(valor)) {
            _this.val(valorOriginal);
        } else {
            _this.val(valor.toCurrency()).attr('title', valorOriginal);
        }
    });
};
$.fn.textoNumerico = function (aceptaNegativo, aceptaDecimales, formatear, moneda, validarOnBlur) {
    aceptaNegativo = aceptaNegativo ? aceptaNegativo : false;
    aceptaDecimales = aceptaDecimales ? aceptaDecimales : false;
    formatear = formatear ? formatear : false;
    moneda = moneda ? moneda : null;
    validarOnBlur = validarOnBlur ? validarOnBlur : false;

    return this.each(function () {
        var txt = $(this);
        txt.addClass('numeric-input');
        var eventos = {};
        eventos.keypress = function (e) {
            var _input = e.currentTarget;
            var texto = _input.value;
            if (aceptaDecimales && e.which === 46) {
                if (texto.trim() === '') {  //evita que se ponga un . al iniciar la caja
                    return false;
                }
                if (texto.indexOf('.') !== -1) { //evita que se ponga más de un signo .
                    return false;
                }
                if (!isNaN(texto) && parseInt(texto) === 0) {
                    if (texto.startsWith('-')) {
                        e.currentTarget.value = '-0.';
                    } else {
                        e.currentTarget.value = '0.';
                    }
                    return false;
                }
                return true; //se agrega un punto normalmente
            }
            if (aceptaNegativo && e.which === 45) {
                if (_input.selectionStart === 0) {
                    return true;  //evita que se ponga el guión, si no es la en la primera posición.
                }
                if (texto.indexOf('-') !== -1) {
                    return false;  //evita que se pueda agregar más de un guión
                }
                if (texto.trim().length > 0) { //evita que se ponga un guión, si no es el primer carácter
                    return false;
                }
                return true;
            }
            if (e.which !== 8 && e.which !== 0 && (e.which < 48 || e.which > 57)) {
                return false;
            }
        };
        if (validarOnBlur) {
            eventos.blur = function () {
                var _this = $(this);
                var valor = _this.val();
                var title = _this.attr('title') !== undefined ? _this.attr('title') : '';
                var toolTipTexto = 'Solo se admiten valores numéricos positivos';
                var regex = /[0-9]/;
                if (aceptaNegativo && aceptaDecimales) {
                    regex = /^-?[0-9]\d*(\.\d+)?$/;
                    toolTipTexto += ', decimales y negativos';
                } else if (aceptaNegativo && !aceptaDecimales) {
                    regex = /^-?[0-9]\d?$/;
                    toolTipTexto += ' y negativos';
                } else if (!aceptaNegativo && aceptaDecimales) {
                    regex = /^([0-9])*.([0-9])*$/;
                    toolTipTexto += ' y decimales, no negativos';
                } else {
                    regex = /^\d+$/;
                }
                if (!regex.test(valor)) {
                    _this.val('').parent().addClass('has-error');
                    _this.attr('title', toolTipTexto);
                    _this.prev().attr('title', title + ' \n ' + toolTipTexto);
                    return false;
                } else {
                    var _val = _this.val();
                    if (parseFloat(valor) === 0) {
                        _this.val('0');
                    }
                    if (valor.endsWith('.')) {
                        _this.val(valor.substring(0, valor.length - 1))
                    }
                    if (aceptaDecimales) {
                        _this.val(parseFloat(valor));
                    }
                    _this.attr('title', title);
                    _this.parent().removeClass('has-error');
                    if (formatear === true) {
                        _this.attr('data-valor', _this.val()).val(_this.val().toFormatNumber(moneda));
                    }
                    return true;
                }
            };
        }
        if (formatear === true) {
            if (!validarOnBlur) {
                eventos.blur = function (ev) {
                    var txt = $(this);
                    txt.attr('data-valor', txt.val()).val(txt.val().toFormatNumber(moneda));
                };

            }
            eventos.focus = function (ev) {
                var txt = $(this);
                if (txt.attr('data-valor') === undefined) {
                    txt.attr('data-valor', txt.val());
                }
                txt.val(txt.attr('data-valor')).attr('data-valor', '');
            };
        }
        txt.on(eventos);
    });
};

String.prototype.toFormatNumber = function (currency, decimal) {
    var sign = (currency) ? currency : '';
    if (!isNaN(this)) {
        var strVal = '';
        if (this.toString().indexOf('.') !== -1) {
            strVal = parseFloat(this.toString().substring(0, this.toString().lastIndexOf('.') + 3));
        } else {
            strVal = parseFloat(this);
        }

        var floatNumbers = !isNaN(decimal) ? decimal : 2;

        var result = (sign + parseFloat(strVal).toFixed(floatNumbers)).replace(/\d(?=(\d{3})+\.)/g, '$&,');

        if (!decimal) {
            return result.substring(0, result.indexOf('.'));
        }

        return result;
    } else {
        return '-';
    }
};

/** 
 * Función que configura una caja de texto para funcionalidad de fechas mayores al año 1980
 * @param {object} selector - Cajas de texto a las que se le aplicará la funcionalidad
 * @return {object} datePicker - Caja de texto con funcionalidad
 * 
 **/
Dom.prototype.configurarCalendarioGuion = function (selector) {
    var maxYear = new Date().getFullYear() + 5;
    $.datepicker.setDefaults($.datepicker.regional.es);
    var datePicker = $('#' + selector).datepicker({
        dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
        dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"],
        monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
        dateFormat: 'yy-mm-dd',
        yearRange: '2015:' + maxYear,
        changeYear: true,
        changeMonth: true//,
                //minDate:new Date(1980, 00, 01),
                //maxDate:new Date(maxYear, 11, 31)
    });
    datePicker.mask('9999-99-99');
    return datePicker;
};


Dom.prototype.loginUsuario = function (selector) {
    var input = selector;
    if (!(selector instanceof jQuery)) {
        var input = $('#' + selector);
    }

    var regex = /^[a-z]*$/;

    var eventos = {};
    eventos.keypress = function (e) {
        if (e.which === 32) {
            return false;
        }
        if (!regex.test(String.fromCharCode(e.which))) {
            return false;
        } 
    };
    return input.on(eventos);
};
