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
    cargarDatosIniciales();
    cargarEventos();
    cargarEventosGenerales();
});

var inicializarForm = function () {

    $('#uni_municipio').empty();
    $('div#div_pro_descripcion').hide();
    cconcurr = new contConcurr();
    if (urlVariables.pro_ideregistro) {
        $('#pro_ideregistro').val(urlVariables.pro_ideregistro);
        $('#opNuevo').prop('disabled', true);
        consultarPropiedad();
    }
    else {
        setTimeout(function () {
            $('#opNuevo').trigger('click');
        }, 100);
    }
    return true;
}
var cargarDatosIniciales = function () {
    $('#pro_estado').attr('disabled', true);
    $('#pro_digitos').attr('onkeypress', 'entero(event)');
    $('#ter_ideregistro').attr('value', urlVariables.ter_ideregistro);
    $('#muba_sector').attr('disabled', true);
    $('#uni_municipio').empty();
    new Combo('proyecto', 'uni_municipio', true, 'administracion_registr_tercero');
}
var cargarEventos = function () {
//    alert("Cargando evento de propiedades");
    $('#opCopiar').on('click', function () {
//        $('#opCopiar').prop('disabled', 'disabled');
        $('#pro_ideregistro').val('');
        $('#pro_idepropieda').val('');

    });
    $('#opEditar').on('click', function () {
        var campo = 'pro_ideregistro';
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
    $('#uni_municipio').on('change', function () {
        if ($(this).val() === '')
            return false;
        $('#uni_barrio').empty();
        new Combo('barrio', 'uni_barrio', false, $(this).val());
    });
    $('#uni_barrio').on('change', function () {
        $('#muba_sector').empty();
        new Combo('sector', 'muba_sector', false, $('#uni_municipio').val(), $(this).val());
        $('#uni_cmpdireccion').empty();
        new Combo('complementodireccion', 'uni_cmpdireccion', true, $('#uni_municipio').val(), $('#uni_barrio').val(), $(this).val());
    });
    $('').on('keypress')



    $('#pro_numcatastral').on('keypress', function (tecla) {
        if (tecla.charCode < 48 || tecla.charCode > 57)
        {
            $('#divRespuesta').html("Caracteres especiales no permitidos");
            return false;
        }
        if ($('#pro_numcatastral').val().length > 15)
        {   
            $('#divRespuesta').html("Máximo 15 Caracteres");
            return false;

        }

    });
    $('#pro_numcatastralnacional').on('keypress', function (tecla) {
        if (tecla.charCode < 48 || tecla.charCode > 57)
        {
            $('#divRespuesta').html("Caracteres especiales no permitidos");
            return false;
        }
        if ($('#pro_numcatastralnacional').val().length > 30)
        {   
            $('#divRespuesta').html("Máximo 30 Caracteres");
            return false;

        }

    });

    $('#pro_numcatastral').on('blur', function () {
        verificarNumcatastral($(this).val());
    });
    $('#pro_numcatastralnacional').on('blur', function () {
        verificarNumcatastralNacional($(this).val());
    });
    $('#' + formulario).on('submit', function () {// envío del formulario
        if (!validarFormulario())
            return false;
        var idereg = $('#pro_ideregistro').val();
        var argumentos;
        var accion;
        if (idereg === '') {
            argumentos = "&accion=s&ter_ideregistro=" + $('#ter_ideregistro').val();
            accion = 's';
        }
        else {
            argumentos = "&accion=e&pro_ideregistro=" + idereg;
            accion = 'e';
        }
        argumentos += '&muba_sector=' + $('#muba_sector').val();
        var a = new consultaAjax(formulario, true, argumentos);
        var respuesta = a.success(function (response) {
            $('#divRespuesta').html(response);
            if (accion === 's') {
                if (isNaN(+response)) {
                    //$('#divRespuesta').html('No se ha podido gruardar el Registro, por favor verifique la información');
                    $('#divRespuesta').html(response);
                }
                else {
                    $('#pro_ideregistro').val(response);
                    $('#divRespuesta').html(response);
                    if ($('#pro_idepropieda').val() === '') {
                        $('#pro_idepropieda').val(response.trim());
                    }
                }
            }
            else {
                $('#divRespuesta').html(response);
            }
        });
        return false;
    });
    $('#' + formulario).on('reset', function () {
        if ($('#pro_idepropieda').val() !== '' || $('#pro_descripcion').val() !== '' || $('#pro_direccion').val() !== '' || $('#pro_numcatastral').val() !== '') {
            if (!confirm('Desea borrar los datos que están diligenciados?'))
                return false;
        }
    });
}
var validarFormulario = function () {
    if ($('#pro_direccion').val() === '') {
        { $('#divRespuesta').html("Debe seleccionar la 'Dirección'");
        return false;}
    }
    console.log(" Resultado validacion direccion"+validarDireccion($('#pro_direccion').val()))  ;
    if(!validarDireccion($('#pro_direccion').val())) {
         $('#divRespuesta').html("La Dirección contiene caracteres no válidos");
       return false; }
    
    if ($('#uni_tippropieda').val() === '') {
        $('#divRespuesta').html("Debe seleccionar 'Tipo de Propiedad'");
        return false;
    }
    else
    {
        $('#pro_descripcion').val($('#uni_tippropiedalabel').val());

    }
    if ($('#pro_numcatastral').val() === '') {
        $('#divRespuesta').html("Debe diligenciar el campo 'Numero Catastral'");
        return false;
    }
    if ($('#pro_numcatastralnacional').val() === '') {
        $('#divRespuesta').html("Debe diligenciar el campo 'Numero Catastral Nacional'");
        return false;
    }
    if ($('#pro_digitos').val() === '') {
        $('#divRespuesta').html("Debe diligenciar el campo 'Digitos'");
        return false;
    }
    if ($('#uni_municipio').val() === '') {
        $('#divRespuesta').html("Debe seleccionar 'Municipio'");
        return false;
    }
    if ($('#pro_seccion').val() === '') {
        $('#divRespuesta').html("Debe diligenciar el campo 'Sección'");
        return false;
    }
    if ($('#pro_manzana').val() === '') {
        $('#divRespuesta').html("Debe diligenciar el campo 'Manzana'");
        return false;
    }
    if ($('#pro_zona').val() === '') {
        $('#divRespuesta').html("Debe diligenciar el campo 'Zona'");
        return false;
    }
    if ($('#pro_altriesgo').val() === '') {
        $('#divRespuesta').html("Debe diligenciar el campo 'Acceso Restringido?'");
        return false;
    }
     if ($('#pro_numcatastral').val().length > 15 || $('#pro_numcatastral').val().length < 15)
        {   
            $('#divRespuesta').html("Máximo 15 caracteres en número catastral");
            return false;

        }
     if ($('#pro_numcatastralnacional').val().length > 30  || $('#pro_numcatastralnacional').val().length < 30)
        {   
            $('#divRespuesta').html("Máximo 30 caracteres en número catastral Nacional");
            return false;

        }
    return true;
}
var consultarPropiedad = function () {
    var argumentos = "accion=c&accion_m=pro_propiedad&pro_ideregistro=" + $('#pro_ideregistro').val();
    var a = new consultaAjax(formulario, false, argumentos);
    var respuesta = a.success(function (response) {
        cargarDatos(response);
    });
}
var verificarNumcatastral = function (v) {

    if ($('#pro_numcatastral').val() !== '')
    {
        var jrex = /^([0-9])/;
        if (!(jrex.test(v)))
        {
            $('#divRespuesta').html("El Número Catastral ingresado contiene caracteres no válidos ");
            $('#pro_numcatastral').val('');
            $('#pro_numcatastral').focus();
            return false;
        }
    } else if (v.length > 13)
    {
        $('#divRespuesta').html("El Numero Catastral ingresado supera los 13 Caracteres ");
        $('#pro_numcatastral').val($('#pro_numcatastral').val().substr(0, 13));
        $('#pro_numcatastral').focus();
        return false;
    }

    if ($('#pro_ideregistro').val().trim() !== '') {
        return false
    }
    ;
    var argumentos = "accion=verificar_numcatastral&pro_numcatastral=" + v;
    var a = new consultaAjax(formulario, false, argumentos);
    var respuesta = a.success(function (response) {
        $('#divRespuesta').html(response);
    });
}
var verificarNumcatastralNacional = function (v) {
console.log(v);
    if ($('#pro_numcatastralnacional').val() !== '')
    {
        var jrex = /^([0-9])/;
        if (!(jrex.test(v)))
        {
            $('#divRespuesta').html("El Número Catastral ingresado contiene caracteres no válidos ");
            $('#pro_numcatastralnacional').val('');
            $('#pro_numcatastralnacional').focus();
            return false;
        }
    } else if (v.length > 29)
    {
        $('#divRespuesta').html("El Numero Catastral ingresado supera los 30 Caracteres ");
        $('#pro_numcatastralnacional').val($('#pro_numcatastralnacional').val().substr(0, 29));
        $('#pro_numcatastralnacional').focus();
        return false;
    }

    if ($('#pro_ideregistro').val().trim() !== '') {
        return false
    }
    ;
    var argumentos = "accion=verificar_numcatastralnacional&pro_numcatastralnacional=" + v;
    var a = new consultaAjax(formulario, false, argumentos);
    var respuesta = a.success(function (response) {
        $('#divRespuesta').html(response);
    });
}
var onCargarDatos = function () {
    unid.refrescar();
}
var datosMuba;
var onComboLoad = function (datos, campo) {
    switch (campo) {
        case 'muba_sector':
            datosMuba = datos;
            break;
    }
}
var onUnidSeleccion = function (unid_id, est_id) {
}
var camposFormulario = function (nForm) {
    var nForm = (nForm || 0);
    var camposCaso = new Array();
    var formCampos = new Array();
    //----------------------------------- SE REGISTRAN TODOS LOS CAMPOS CON EL MISMO NOMBRE DE LA DB Y EN MISMO ORDEN
    formCampos[0] = '\
	,pro_idepropieda\
	,pro_estado\
	,pro_descripcion\
	,pro_direccion\
	,pro_ideregistro\
	,ter_ideregistro\
	,uni_tippropieda\
	,est_tippropieda\
	,pro_digitos\
	,muba_sector\
	,pro_seccion\
	,pro_manzana\
	,uni_municipio\
	,uni_barrio\
	,pro_altriesgo\
	,pro_gpslatitud\
	,pro_gpsaltitud\
	,pro_gpslongitud\
	,pro_numcatastral\
	,pro_zona\
        ,uni_cmpdireccion\
	,pro_numcatastralnacional\
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
	        	