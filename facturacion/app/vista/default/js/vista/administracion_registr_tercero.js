var f = $(location).attr('search');
f = f.substr(1);
f = f.split('&');
var formulario;
for (var k = 0; k < f.length; k++) {
    f[k] = f[k].split("=");
    f[k][0] === 'modulo' ? formulario = f[k][1] : f;
}
$(function () {
    inicializarForm();
    cargarEventos();
    cargarEventosGenerales();
});
var inicializarForm = function () {// lista de campos con algun comportamiento especial
    cconcurr = new contConcurr();
    if ($('#ter_documento').val() != '')
    {
        $('#opGrabar,#opCancelar').show();
        $('#opGrabar,#opCancelar').removeAttr('disabled');
        $('#opEditar,#opNuevo,#naBusca').attr('disabled', 'disabled');
        $('#' + formulario)[0].reset();
        fieldsets.mostrar();
    }

    $('#ter_documento').attr('onkeypress', ' entero(event)');
    $('#ter_digverificacion').attr('onkeypress', ' entero(event)');
    $('#ter_telcelular').attr('onkeypress', 'numerico_espaciado(event)');
    $('#ter_telfijo').attr('onkeypress', 'numerico_espaciado(event)');
    $('#ter_nombre').attr('onkeypress', 'palabra(event)');
    $('#ter_apellido').attr('onkeypress', 'palabra(event)');
    $('#ter_correo').attr('onkeypress', 'email(event)');
    $('#divter_nomcompleto').hide();   
    new Calendario('ter_docexpedicion');
    new Calendario('ter_fecnacimiento');
    unid_clasetercero = new comboUnidad('est_clatercero', 'uni_clatercero', 30);
    ciudadAutoComplete();
    return true;
}
var cargarEventos = function () {
    $('#op_nuevo').on('click');
    $('#opEditar').on('click', function () {
        var campo = 'ter_ideregistro';
        if ($('#' + campo).val().trim() === '') {
            $('#divRespuesta').html('Por favor seleccione un registro para poder editarlo.');
            setTimeout(function () {
                $('#opCancelar').trigger('click');
            }, 20);
            return false;
        }
        ;
        cconcurr.br('Yw0K', campo, $('#' + campo).val());
    });
    $('#ter_nombre').on('blur', function () { // concatena nombre completo
        $('#ter_nombre').val($('#ter_nombre').val().toUpperCase().trim());
        $('#ter_nomcompleto').val($('#ter_nombre').val().toUpperCase().trim() + " " + $('#ter_apellido').val().toUpperCase().trim());
        $(this).val($(this).val().toUpperCase());
    });
    $('#crearPropiedad').on('click', function () { // concatena nombre completo
        if (!$('#ter_ideregistro').val()) {
            $('#divRespuesta').html('No existe un tercero seleccionado para esta acción.');
            return false
        }
        ;
        var args = '&ter_ideregistro=' + $('#ter_ideregistro').val() + '&doc=' + $('#ter_documento').val();
        formPopup(urlVariables.modulo + '_propied', args);
    });

    $('#ter_apellido').on('blur', function () { // concatena nombre completo
        $('#ter_apellido').val($('#ter_apellido').val().toUpperCase().trim())
        $('#ter_nomcompleto').val($('#ter_nombre').val().toUpperCase().trim() + " " + $('#ter_apellido').val().toUpperCase().trim());
        $(this).val($(this).val().toUpperCase());
    });
    $('#asignarClaseTercero').on('click', function () {
        relacionarClaseTercero();
    });
    $('#mostrar1').on('click', function () {
        fieldsets.mostrar('fst1');
    });
    $('#mostrar2').on('click', function () {
        fieldsets.mostrar('fst2');
    });
    if (urlVariables.doc) {
        $('#ter_documento').val(urlVariables.doc).trigger('blur');
    }
    $('#' + formulario).on('submit', function () {// envío del formulario
        var validacion = validarFormulario();
        console.log("validacion :" + validacion);
        if(!validarCampoNumerico($('#ter_documento').val())){
            return false;
        }
        if (!validacion)
            return false;
        $('#opGrabar').hide();
        var idereg = $('#ter_ideregistro').val();
        var argumentos;
        var accion;
        if (idereg === '') {
            argumentos = "&accion=s";
            accion = 's';
        } else {
            argumentos = "&accion=e&ter_ideregistro=" + idereg;
            accion = 'e';
        }
        var a = new consultaAjax(formulario, true, argumentos);

        var respuesta = a.success(function (response) {
            if (accion === 's') {
                var teride = response.substring(response.indexOf('||->') + 4, response.indexOf('<-||'));
                if (!isNaN(+teride.trim()))
                    $('#ter_ideregistro').val(teride);
                console.log("terideregistro :" + teride);
                if (response.indexOf('||->') > 0)
                    response = response.substring(0, response.indexOf('||->')) + response.substring(response.indexOf('<-||') + 5, response.lenght);
                $('#divRespuesta').html(response);
            } else {
                $('#divRespuesta').html(response);
            }


        });
        return false;
    });
    $('#' + formulario).on('reset', function () {
        if ($('#ter_documento').val() !== '' || $('#ter_nombre').val() !== '' || $('#ter_apellido').val() !== '') {
            if (!confirm('Desea borrar los datos que están diligenciados?'))
                return false;
        }
        $('#PropTer').find('tbody').empty();
    });
}
var validarFormulario = function () {
    $('#divRespuesta').hide();
    if ($('#uni_tipidentifica').val() === '') {
        $('#divRespuesta').html("Debe seleccionar 'Tipo de documento'");
        $('#ter_documento').focus();
        return false;
    } else
    if ($('#ter_documento').val() === '') {
        $('#divRespuesta').html('Debe escribir un documento válido');
        $('#ter_documento').focus();
        return false;
    } else
    {
        var campo = $('#ter_documento');
        if (!validanumeroespacio(campo))
            return false;

    }
    if ($('#ciudad_cod').val() === '') {
        $('#divRespuesta').html("Debe seleccionar la 'Ciudad de Expedición'");
        $('#ciudad_cod').focus();
        return false;
    }

    if ($('#ter_docexpedicion').val() === '')
    {
        $('#divRespuesta').html("Debe diligenciar  'Fecha Expedición'");
        $('#ter_docexpedicion').focus();
        return false;

    } else
    {
        var FechaA = $('#ter_docexpedicion').val();
        var f = new Date();
        var mes = f.getMonth() + 1;
        if (mes <= 9)
            mes = "0" + mes;
        var FechaB = f.getDate() + "-" + mes + "-" + f.getFullYear()
        var validacion = true
        var afechaA = FechaA.split("-");
        var afechaB = FechaB.split("-");
        var rfechaA = afechaA[1] + "/" + afechaA[2] + "/" + afechaA[0];
        var rfechaB = afechaB[1] + "/" + afechaB[0] + "/" + afechaB[2];
        /** Require en formato mm/dd/YYYY          */
        if (Date.parse(rfechaA) > Date.parse(rfechaB))
        {
            console.log("fecha aaaaaaa:" + rfechaA + " fecha b : " + rfechaB);
            $('#divRespuesta').html("EL campo 'Fecha Expedición' no puede ser mayor a la fecha Actual del sistema");
            $('#ter_docexpedicion').focus();
            return false;
        }
    }
    
    if ($('#ter_fecnacimiento').val() === '')
    {
        $('#divRespuesta').html("Debe diligenciar  'Fecha Nacimiento'");
        $('#ter_fecnacimiento').focus();
        return false;

    } else
    {
        var FechaA = $('#ter_fecnacimiento').val();
        var f = new Date();
        var mes = f.getMonth() + 1;
        if (mes <= 9)
            mes = "0" + mes;
        var FechaB = f.getDate() + "-" + mes + "-" + f.getFullYear()
        var validacion = true
        var afechaA = FechaA.split("-");
        var afechaB = FechaB.split("-");
        var rfechaA = afechaA[1] + "/" + afechaA[2] + "/" + afechaA[0];
        var rfechaB = afechaB[1] + "/" + afechaB[0] + "/" + afechaB[2];
        /** Require en formato mm/dd/YYYY          */
        if (Date.parse(rfechaA) > Date.parse(rfechaB))
        {
            console.log("fecha aaaaaaa:" + rfechaA + " fecha b : " + rfechaB);
            $('#divRespuesta').html("EL campo 'Fecha Nacimiento' no puede ser mayor a la fecha Actual del sistema");
            $('#ter_fecnacimiento').focus();
            return false;
        }
    }
    
    
    if ($('#ter_nombre').val() === '') {
        $('#divRespuesta').html("Debe diligenciar el campo 'Nombre'");
        $('#ter_nombre').focus();
        return false;
    } else {
        var campo = $('#ter_nombre');
        if (!validapalabraespacio(campo))
        {
            $('#divRespuesta').html("'Nombre' debe contener solo letras o espacios");
            return false;
        }
    }
    if ($('#ter_apellido').val() === '') {
        $('#divRespuesta').html("Debe diligenciar el campo 'Apellido'");
        $('#ter_apellido').focus();
        return false;
    } else {
        var campo = $('#ter_apellido');
        if (!validapalabraespacio(campo))
            return false;
    }
    if ($('#uni_tiptercero').val() === '') {
        $('#divRespuesta').html("Debe seleccionar un 'Tipo de Tercero'");
        return false;
    }
    if ($('#ter_correo').val() !== '') {
        var campo = $('#ter_correo');
//        //validación email en caso de que no se digite nada 
//        if($('#ter_correo').val()==='' || length(trim($('#ter_correo').val()))==0 )
//        {
//            $('#ter_correo').val('');
//            return true ;
//        }
        //si se digito algo debe validar que cumpla el formato de correo 
        if (!validaemail(campo))
        {
            $('#ter_correo').focus();
            return false;
        }
    }
    if ($('#ter_telcelular').val() === '') {
        $('#divRespuesta').html("Debe diligenciar un 'Número de celular'");
        $('#ter_telcelular').focus();
        return false;
    } else {
        var campo = $('#ter_telcelular');
        if (!validanumeroespacio(campo))
            return false;
        else if (campo.val().length < 10 || campo.val().length > 10)
        {
            $('#divRespuesta').html("El 'Número de celular' debe tener mínimo 10 Caracteres  ");
            return false
        }
    }
    if ($('#ter_telfijo').val() !== '') {
        var campo = $('#ter_telfijo');
        if (!validanumeroespacio(campo))
            return false;
    }


    return true;
}
var unid_clasetercero;
var unid_tipodocumento;
var navegaRegistro = function (formulario, accion) {//navegacion de registros
    $.ajax({
        type: "POST",
        url: "app/controlador/c." + formulario + ".php",
        dataType: "html",
        data: "navac=" + accion + "&accion=n&idreg=" + $('#ter_ideregistro').val(),
        success: function (response) {
            if (response.trim().length > 0) {
                cargarDatos(response);
                unid.refrescar();
                //$('#divRespuesta').html(response);
            } else {
                $('#' + formulario)[0].reset();
                $('#divRespuesta').html("No hay más datos.");
                $('#PropTer').find('tbody').empty();
            }

        }
    });
}
var borrarRegistro = function () {
    var argumentos = "accion=x&ter_ideregistro=" + $('#ter_ideregistro').val();
    var a = new consultaAjax(formulario, false, argumentos);
    var respuesta = a.success(function (response) {
        cargarTabla(response, 'PropTer')
    });
}
var buscaPropiedades = function () {
    if (!$('#ter_ideregistro').val()) {
        return false
    }
    ;
    sessionStorage.removeItem(formulario + '_propied');
    var argumentos = "accion=c&accion_m=propiedad&ter_ideregistro=" + $('#ter_ideregistro').val();
    argumentos += '&modulo=' + urlVariables.modulo;
    argumentos += '&' + localStorage.getItem('argumentos_busqueda');
    var a = new consultaAjax(formulario, true, argumentos);
    var respuesta = a.success(function (response) {
        cargarTabla(response, 'PropTer');
        ajustaTabla('PropTer');
    });
}
var cargarClaseTercero = function () {
    var argumentos = "accion=c&accion_m=clase_tercero&ter_ideregistro=" + $('#ter_ideregistro').val();
    var a = new consultaAjax(formulario, false, argumentos);
    var respuesta = a.success(function (response) {
        cargarTabla(response, 'ClasTer');
        ajustaTabla('ClasTer');
    });
}
var relacionarClaseTercero = function () {
    if (!$('#ter_ideregistro').val()) {
        $('#divRespuesta').html('Por favor, seleccione un tercero para relacionar una clase de tercero.');
        return false;
    }
    var argumentos = "accion=clte&accion_m=relacionar";
    argumentos += "&uni_clatercero=" + $('#uni_clatercero').val();
    argumentos += "&ter_ideregistro=" + $('#ter_ideregistro').val();
    var a = new consultaAjax(formulario, false, argumentos);
    var respuesta = a.success(function (response) {
        cargarClaseTercero();
        $('#divRespuesta').html(response);
    });
}
var eliminarClaseTercero = function (_conse) {
    if (!_conse) {
        return false;
    }
    if (!confirm('Está seguro que desea eliminar el registro?')) {
        return false
    }
    ;
    var argumentos = "accion=clte&accion_m=eliminar&clte_ideregistr=" + _conse;
    var a = new consultaAjax(formulario, false, argumentos);
    var respuesta = a.success(function (response) {
        $('#divRespuesta').html(response);
        cargarClaseTercero();
    });
}
var ajustaTabla = function (tabla) {
    if ($('#' + tabla).find('td[alt=Vacio]').length === 1) {
        return false;
    }
    switch (tabla) {
        case 'PropTer':
            $('#PropTer').find('tbody tr').each(function () {
                $(this).find('td').eq(0).hide();
                var uni_tippropieda = $(this).find('td').eq(6).html();
                $(this).find('td').eq(6).hide();
                var est_tippropieda = $(this).find('td').eq(7).html();
                $(this).find('td').eq(7).hide();
                var ntd = $('<td>');
                var espedit = $(this).find('td').eq(5).after(ntd);
                var idereg = $(this).find('td').eq(0).html();
                var bnEditar = $('<button>').attr('type', 'button').html('Editar').on('click', function () {
                    var args = '&ter_ideregistro=' + $('#ter_ideregistro').val() + '&doc=' + $('#ter_documento').val();
                    args += '&pro_ideregistro=' + idereg;
                    formPopup(urlVariables.modulo + '_propied', args);
                }).appendTo(ntd);
                var bnInfo = $('<button>').attr('type', 'button').attr('alt', 'Registrar Información Adicional').attr('title', 'Registrar Información Adicional').html('Info').on('click', function () {
                    var args = '&pro_ideregistro=' + idereg;
                    args += '&uni_tippropieda=' + uni_tippropieda;
                    args += '&est_tippropieda=' + est_tippropieda;
                    formPopup(urlVariables.modulo + '_propied_info', args);
                }).appendTo(ntd);
            });
            break;
        case 'ClasTer':
            $('#ClasTer').find('tbody tr').each(function () {
                $(this).find('td').eq(0).hide();
                var ntd = $('<td>');
                var espedit = $(this).find('td').eq(1).after(ntd);
                var idereg = $(this).find('td').eq(0).html();
                var bnEditar = $('<button>').attr('type', 'button').html('Eliminar').on('click', function () {
                    eliminarClaseTercero(idereg);
                }).appendTo(ntd);
            });
            break;
    }
}
var escrituraActiva;
var ciudadAutoComplete = function (t) {
    var inicializar = function () {
        var campolabel = $('<input>').attr('type', 'text').attr('id', 'ciudad_cod_label').on('keyup', function () {
            ciudadAutoComplete($(this));
        });
        $('#ciudad_cod').after(campolabel);
        $('#ciudad_cod').hide();
    }
    clearTimeout(escrituraActiva);
    var crearAutoHTML = function () {
        var cont = $('<div>').attr('class', 'umCuadroBusqueda divautocomplete').css({'top': '60px'});
        //   var cont = $('<div>').attr('class', 'umCuadroBusqueda divautocomplete');
        $('<table>').attr('id', 'autocompleteTerNombre').html('<tbody></tbody>').appendTo(cont);
        cont.appendTo(t.parents('.campo'));
    }
    var destruirHTML = function () {
        $('.divautocomplete').fadeOut({complete: function () {
                $(this).remove()
            }});
    }
    var consultar = function () {
        var args = 'accion=ciudadAutoComplete&ciudnombrebusca=' + t.val();
        new consultaAjax(formulario, false, args, true).success(function (response) {
            cargarTabla(response, 'autocompleteTerNombre');
            $('.divautocomplete table').find('tr').each(function () {
                $(this).find('td').eq(0).hide();
                $(this).on('click', function () {
                    $('#ciudad_cod').val($(this).find('td').eq(0).html());
                    var nom = $(this).find('td').eq(1).html()
                    nom = nom.substr(nom.indexOf('-') + 2, nom.lenght);
                    t.val(nom);
                    //  destruirHTML();
                })
            });
        });
    }
    if (!t) {
        inicializar();
        return false;
    }
    if (t.val().length >= 3) {
        if (!$('.divautocomplete')[0]) {
            crearAutoHTML();
        }
        ;
        escrituraActiva = setTimeout(function () {
            consultar();
        }, 500);
    }
    t.on('blur', function () {
        destruirHTML()
    });
}

var cargarNombreCiudad = function () {
    if ($('#ciudad_cod').val().trim() === '')
        return false;
    var argumentos = "accion=c&accion_m=ciudad_nom&ciudad_cod=" + $('#ciudad_cod').val();
    new consultaAjax(formulario, false, argumentos).success(function (response) {
        var nom = response.substring(response.indexOf('||->') + 4, response.indexOf('<-||'));
        $('#ciudad_cod_label').val(nom);
    });
}
var eliminarRegistro = function () {
    if ($('#ter_ideregistro').val().trim() === '') {
        $('#divRespuesta').html('Debe seleccionar un tercero para ejecutar esta acción.');
        return false;
    }
    ;
    var argumentos = "accion=x&ter_ideregistro=" + $('#ter_ideregistro').val();
    new consultaAjax(formulario, false, argumentos).success(function (response) {
        if (response.trim() !== 'OK') {
            $('#divRespuesta').html('El registro no se puede eliminar. Elimine todas las dependencias antes de ejecutar esta acción.');
        } else {
            $('#divRespuesta').html('Registro eliminado satisfactoriamente');
        }
    });
}
var onCargarDatos = function () {
    buscaPropiedades();
    cargarClaseTercero();
    unid.refrescar();
    cargarNombreCiudad();
    cargarTipoDocumento();
}
var cargarTipoDocumento = function () {
    var argumentos = "accion=c&accion_m=tipo_documento&uni_tipidentifica=" + $('#uni_tipidentifica').val();
    var a = new consultaAjax(formulario, false, argumentos);
    var respuesta = a.success(function (response) {
        if (response) {
            var datosTabla = response.substring(response.indexOf('||->') + 4, response.indexOf('<-||'));
            var valuesForm = datosTabla.split('c_@');
        }
        console.log(valuesForm);
        $('#uni_tipidentificalabel').val(valuesForm[1]);
        console.log(response);
    });
}


var onCierraFormPopup = function () {
    buscaPropiedades();
}
var camposFormulario = function (nForm) {
    var nForm = (nForm || 0);
    var camposCaso = new Array();
    var formCampos = new Array();
    //----------------------------------- SE REGISTRAN TODOS LOS CAMPOS CON EL MISMO NOMBRE DE LA DB Y EN MISMO ORDEN
 
    formCampos[0] = '\
	,ter_documento\
	,ter_nombre\
	,ter_apellido\
	,ter_nomcompleto\
	,ter_sexo\
	,ter_correo\
	,ter_telcelular\
	,ter_telfijo\
	,ter_ideregistro\
	,uni_tiptercero\
	,ciudad_cod\
	,ter_docexpedicion\
	,uni_tipidentifica\
        ,ter_fecnacimiento\
        ,ter_digverificacion\
        ,ter_idaprovechador\
        ';
    for (var Campo in formCampos) {
        var C = formCampos[Campo];
        C = C.split(',');
        for (var k = 0; k < C.length; k++)
            C[k] = C[k].trim();
        C = C.slice(1);
        camposCaso.push(C);
    }
    return camposCaso[nForm];
}
var validapalabraespacio = function (objeto) {
    var jrex = /^[a-zA-Z\s]*$/;
    var v = objeto.val();
    console.log("valor :" + v);
    if (!(jrex.test(v)))
    {
        var idCampo = objeto.attr('id');
        var ValLabelCampo = $('label[for=' + idCampo + ']').text();
        $('#divRespuesta').html("Valor en campo '" + ValLabelCampo + "' no cumple con caracteres permitidos (Solo letras y espacios) ");
        objeto.focus();
        return false;
    }
    return true;
}
var validanumeroespacio = function (objeto) {
    var jrex = /^[0-9\s]*$/;
    var v = objeto.val();
    console.log("objetco :" + objeto.attr('id') + " valor a validar :" + v + " resultado valudacion: " + jrex.test(v));
    if (!(jrex.test(v)))
    {
        var idCampo = objeto.attr('id');
        var ValLabelCampo = $('label[for=' + idCampo + ']').text();
        $('#divRespuesta').html("Valor en campo '" + ValLabelCampo + "' no cumple con caracteres permitidos (Solo números) ");
        objeto.focus();
        return false;
    }
    return true;
}
var validaemail = function (objeto) {
//    ^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$  
    var jrex = /^[a-z0-9]+([a-z0-9-_\.])+@[a-z]+[_a-z0-9-]*[a-z]?[\.]?([a-z]{2,3})*(\.?[a-z]{2,3})$/;
    var v = objeto.val();
    v = v.toLowerCase();
    if (!(jrex.test(v)))
    {
        var idCampo = objeto.attr('id');
        var ValLabelCampo = $('label[for=' + idCampo + ']').text();
        $('#divRespuesta').html("Valor en campo '" + ValLabelCampo + "' no cumple formato de correo");
        objeto.focus();
        return false;
    }
    return true;
}
// validacion 

//El push es un string. Blanco para omitir temporalmente. formato 'xxxxxx,yyyyyy' obligatorio. No habrá soporte para cualquier otro formato de valor.	
var ic = 0;
cuadrosBusqueda.campos.push({llave: 'ter_ideregistro', accionm: 'cargarResultado', columnas: new Array()});
cuadrosBusqueda.campos[ic].columnas.push('ter_nombre,Nombre');
cuadrosBusqueda.campos[ic].columnas.push('ter_documento,Cedula / Nit');
cuadrosBusqueda.campos[ic].columnas.push('codigo_anterior,Código Anterior');
cuadrosBusqueda.campos[ic].columnas.push('pro_numcatastral,Número Catastral');
cuadrosBusqueda.campos[ic].columnas.push('pro_idepropieda,Numero de Propiedad');
cuadrosBusqueda.campos[ic].columnas.push('uni_municipio,Municipio');
cuadrosBusqueda.campos[ic].columnas.push('pro_direccion,Dirección');
