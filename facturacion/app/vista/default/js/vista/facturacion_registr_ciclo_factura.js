//var tablaForm=new Array('cic_ciclo');	//array de tablas existentes en el documento
var f = $(location).attr('search');
f = f.substr(1);
f = f.split('&');
var formulario;
for (var k = 0; k < f.length; k++) {
    f[k] = f[k].split("=");
    f[k][0] === 'modulo' ? formulario = f[k][1] : f;
}
var inicializando = true ;
$(function () {
    inicializarForm();
    cargarEventos();
    cargarEventosGenerales();
});

var inicializarForm = function () {// lista de campos con algun comportamiento especial
    cconcurr = new contConcurr();
    //$('#cic_nombre').attr('onkeypress','palabraNumero(event)');
    $('#cic_diafinaliza,#cic_anoactual').attr('readonly', 'readonly');
    $('#cic_anoactual').attr('value', new Date().getFullYear());
    actualizarDependencias();
    return true;
}
var cargarEventos = function () {
    $('#opNuevo').on('click', function () {
        setTimeout(actualizarDependencias, 250);
    });
    $('#opEditar').on('click', function () {
        if ($('#cic_ideregistro').val().trim() === '') {
            alert('Por favor seleccione un registro para poder editarlo.');
            setTimeout(function () {
                $('#opCancelar').trigger('click');
            }, 20);
            return false;
        }
        ;
        cconcurr.br('Yw0K', 'cic_ciclo', $('#cic_ideregistro').val());
    });
    $('#cic_diainicia').on('change', function () {
        if (+($(this).val()) > 0) {
            if (+$(this).val() > 1)
                $('#cic_diafinaliza').val(+$(this).val() - 1);
            else
                $('#cic_diafinaliza').val('31');
        } else {
            $('#divRespuesta').html('Debe seleccionar un Dia inicial para el Ciclo.');
            $('#cic_diafinaliza').val('');
        }
    })

    $('#' + formulario).on('submit', function () {
        if ($('#cic_nombre').val().length < 3) {
            $('#divRespuesta').html('El nombre de ciclo debe ser significativo y no puede ser un texto vacio.');
            return false;
        }
        var argumentos = "accion=s";
        if ($('#cic_ideregistro').val() !== '') {
            argumentos = "accion=e";
            argumentos += "&cic_ideregistro=" + $('#cic_ideregistro').val();
        }
        var a = new consultaAjax(formulario, true, argumentos);
        var respuesta = a.success(function (response) {
            var cicide = response.substring(response.indexOf('|-|->') + 5, response.indexOf('<-|-|'));
            if (isNaN(+cicide)) {
                $('#divRespuesta').html(response);
            } else {
                $('#divRespuesta').html('Se han creado los periodos para este ciclo. Diríjase a la ventana inferior para ver y editar los periodos.');
                $('#cic_ideregistro').val(cicide);
                actualizarDependencias();
            }

        });
        return false;
    });
    $('#' + formulario).on('reset', function () {
        if ($('#cic_nombre').val() !== '') {
            if (!confirm('Desea borrar los datos que están diligenciados?'))
                return false;
        }
        setTimeout(function () {
            $('#cic_diainicia').trigger('change');
        }, 150);
    });
    $('#cmbanociclo').on('change', function () {
        console.log("inicializando combo:"+ inicializando);
        if ($('#cic_ideregistro').val() === '' && inicializando==true) {
            return false;
        }
        actualizarDependencias();

    });

}
var consultarCiclo = function () {
    alert("Consultando ciclo ");
    var argumentos = "accion=c&cic_ideregistro=" + $('#cic_ideregistro').val();
    var a = new consultaAjax(formulario, false, argumentos);
    var respuesta = a.success(function (response) {
        cargarDatos(response);
    });
}
var navegaRegistro = function (formulario) {//navegacion de registros	
    sessionStorage.removeItem(formulario + '_periodo');
    $.ajax({
        type: "POST",
        url: "app/controlador/c." + formulario + ".php",
        dataType: "html",
        data: "navac=" + arguments[1] + "&accion=n&idreg=" + $('#cic_ideregistro').val(),
        success: function (response) {
            if (response.length > 0) {
                cargarDatos(response);
            } else {
                $('#' + formulario)[0].reset();
                $('#divRespuesta').html("No hay más datos.");

            }
        }
    });
}


//actualización de dependencias de los registros
var iframeSrc = new Array();
iframeSrc.push('programa.php?modulo=facturacion_registr_ciclo_factura_periodo');
iframeSrc.push('programa.php?modulo=facturacion_registr_ciclo_factura_liquidacion');
iframeSrc.push('programa.php?modulo=facturacion_registr_ciclo_factura_empresa');

var actualizarDependencias = function (evitar) {
    var k = 0;

    $('iframe').each(function () {
        //alert($("#cic_ideregistro").val());
        if (k !== evitar) {
            $(this).attr('src', iframeSrc[k] + '&idereferencia=' + $("#cic_ideregistro").val() + '&ano=' + $("#cmbanociclo").val());
        }
        k++;
    });
}
//aqui se cargan los datos al formulario
var onCargarDatos = function () {
    inicializando=true;
    $('#cmbanociclo').empty();
    Combo('anosciclos', 'cmbanociclo', false, $("#cic_ideregistro").val());
//    actualizarDependencias();
    inicializando=false;
}
var camposFormulario = function (nForm) {
    var nForm = (nForm || 0);
    var camposCaso = new Array();
    var formCampos = new Array();
    //----------------------------------- SE REGISTRAN TODOS LOS CAMPOS CON EL MISMO NOMBRE DE LA DB Y EN MISMO ORDEN
    formCampos[0] = '\
	,cic_ideregistro\
	,cic_nombre\
	,cic_diainicia\
	,cic_diafinaliza\
	,cic_estado\
	,cic_periodos\
	,cic_anoactual\
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
var ic = 0;
cuadrosBusqueda.campos.push({llave: 'cic_ideregistro', accionm: 'cargarResultado', columnas: new Array()});
cuadrosBusqueda.campos[ic].columnas.push('cic_ideregistro,ID de ciclo');
cuadrosBusqueda.campos[ic].columnas.push('cic_nombre,Descripción de ciclo');
cuadrosBusqueda.campos[ic].params = {
    tituloTabla: "Ciclos de factura encontrados",
    columnasTabla: "#,Descripción,Dia de inicio,Dia que finaliza,Año de ciclo"
};