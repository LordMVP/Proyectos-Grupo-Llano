var f = $(location).attr('search');
f = f.substr(1);
f = f.split('&');
var formulario;
for (var k = 0; k < f.length; k++) {
    f[k] = f[k].split("=");
    f[k][0] === 'modulo' ? formulario = f[k][1] : f;
}
var pkant = 0;
var pkselect = 0;
mmensaje = '';
$(function () {
    //***************************************************************** Reglas de los campos -- INICIO
    //Almacpen de campos que necesiten un comportamiento particular
    inicializarForm();
    //***************************************************************** Reglas de los campos -- FIN	
    //*****************************************************************Eventos de Formulario --INICIO	
    cargarEventos();
    cargarEventosGenerales();
    cargarAgenda();
    //*****************************************************************Eventos de Formulario --INICIO FIN    
    cconcurr = new contConcurr();
});

var inicializarForm = function () {

    //alert('recarga agenda');
    $('#cic_ideregistro').val(urlVariables.idereferencia);
    $('#per_ideregistro').val(urlVariables.per_ideregistro);
    $('#prg_ideregistro').removeAttr('disabled');

    if ($('#per_ideregistro').val() === '') {
        $('#divRespuesta').html('Debe seleccionar un periodo para registrar agendamiento.');
    }
    var fini = urlVariables.fi;
    var ffin = urlVariables.ff;
    new Calendario('dper_fecinicial', fini + '~' + ffin);
    new Calendario('dper_fecfinal', fini + '~' + ffin);
    return true;
}

var cargarEventos = function () {
    $('#dper_actividad').on('blur', function () { // concatena nombre completo
        $(this).val($(this).val().toUpperCase());
    });
    $('#' + formulario).on('submit', function () {// envío del formulario
        var fechaini = $('#dper_fecinicial').val();
        var fechafin = $('#dper_fecfinal').val();
        fechaini = fechaini.replace('-', '');
        fechaini = fechaini.replace('-', '');
        fechafin = fechafin.replace('-', '');
        fechafin = fechafin.replace('-', '');

        if (+fechafin < +fechaini) {
            alert('No puede seleccionar una fecha final menor a la fecha de inicio.');
            return false;
        }
        var dpersel = $('input[name=Agendas_ide]:checked').val();
        if (!isNaN(dpersel)) {
            var argumentos = "accion=e&dper_ideregistr=" + dpersel;
        }
        else {
            $('#cic_ideregistro').val(urlVariables.idereferencia);
            $('#per_ideregistro').val(sessionStorage['facturacion_registr_ciclo_factura_periodo']);
            var argumentos = "accion=s&cic_ideregistro=" + $('#cic_ideregistro').val() + "&per_ideregistro=" + $('#per_ideregistro').val();
        }
        var a = new consultaAjax(formulario, true, argumentos);
        var respuesta = a.success(function (response) {
            $('#divRespuesta').html(response);
            cargarAgenda();
        });
        return false;
    });
    $('#' + formulario).on('reset', function () {
        if ($('#dper_actividad').val() !== '' || $('#dper_fecinicial').val() !== '' || $('#dper_fecfinal').val() !== '') {
            if (!confirm('Desea borrar los datos que están diligenciados?'))
                return false;
        }
        setTimeout(function () {
            inicializarForm();
        }, 150);
    });

}

var cargarAgenda = function () {
    var datos = 'accion=c&accion_m=agendas&cic_ideregistro=' + urlVariables.idereferencia + '&per_ideregistro=' + $('#per_ideregistro').val();
    var respuesta = new consultaAjax(formulario, false, datos).success(function (response) {
        cargarTabla(response, 'Agendas', 'radio');
        ajustaTabla('Agendas');
    });
}
var ajustaTabla = function (tabla, idreg) {
    var depact = $('#depactividad :selected').html();
    var t = $('#' + tabla);
    switch (tabla) {
        case 'Agendas':
            $('#Agendas tbody').find('tr').each(function () {
                $(this).attr('draggable','true');
                $(this).attr('ondragstart','start()');
                $(this).attr('ondragover','dragover()');
                var pk = $(this).find("td").eq(1).html();
                valorden = 1;
                total = (parseInt(pk) + parseInt(valorden));
                var depende = $(this).find("td").eq(8).html();
                $(this).find("td").eq(8).hide();
                if ($(this).find("td").eq(6).html() == 'C') {
                    $(this).find("td").css("color", "red");
                }
                $(this).find("td").eq(1).hide();
                $(this).find("td").eq(10).hide();
                $(this).find('td').eq(9).each(function () {
                    var iDependen = $('<button type="button">Actividades depende</button>').attr('id', 'activi_' + pk);
                    var cerrarActividad = $('<button type="button">Cerrar Actividad</button>').attr('id', 'activi_' + pk + 1);
                    var editarActividad = $('<button type="button">Editar Actividad</button>').attr('id', 'edactivi_' + pk);
                    var eliminarActividad = $('<button type="button">Eliminar</button>').attr('id', 'delactivi_' + pk);

                    cerrarActividad = cerrarActividad.on('click', function () {
                        //new Combo("cerraractividad","Oscar",true,pk);
                        $.ajax({
                            type: "POST",
                            url: "app/controlador/c.ap.combo.php",
                            dataType: "html",
                            data: {accion:'cerraractividad', param1:pk},
                            success: function (response) {
                              //  alert(reponse);
                                if (response==='OK') {
                                    cargarAgenda();
                                }
                                else {
                                    alert("Hay Actividades Pendiente por Procesar.");
                                }
                            }
                        });


                    });
                    eliminarActividad = eliminarActividad.attr('disabled', 'true');
                    eliminarActividad = eliminarActividad.on('click', function () {
                        $.ajax({
                            type: "POST",
                            url: "app/controlador/c.ap.combo.php",
                            dataType: "html",
                            data: {accion:'eliminaractividad', param1:pk},
                            success: function (response) {
                               alert(response);
                                if (response==='OK') {
                                    cargarAgenda();
                                }
                                else {
                                    alert("Hay Actividades Pendiente por Procesar.");
                                }
                            }
                        });
                    });

                    editarActividad = editarActividad.attr('disabled', 'true');
                    editarActividad = editarActividad.on('click', function () {
                        var datos = "accion=c&accion_m=idepactiv&dper_ideregistr=" + pk;
                            var a = new consultaAjax(formulario, false, datos);
                            var respuesta = a.success(function (response) {
                                var datosTabla=response.substring(response.indexOf('||->')+4,response.indexOf('<-||'));
                                var valuesTabla=datosTabla.split('|__|');
                                var	valuesProg=valuesTabla[0].split('c_@');
                        var argumentos = "accion=c&accion_m=agenda_seleccionada&dper_ideregistr=" + pk;
                            var a = new consultaAjax(formulario, false, argumentos);
                            var respuesta = a.success(function (response) {
                                var datosTabla=response.substring(response.indexOf('||->')+4,response.indexOf('<-||'));
                                var valuesTabla=datosTabla.split('|__|');
                                var	values=valuesTabla[0].split('c_@');
                        $('#activi_' + pk).attr('disabled', 'true');// Inactivo el boton de adicion de dependientes
                        $('#edactivi_' + pk).attr('disabled', 'true');// Inactivo el boton de editar actividad
                        var cont = $('#dependientes_' + pk).parents("td");
                        $('<fieldset id= "ed">').appendTo(cont);
                        $('<legend>').html('Editar Actividad').appendTo(cont.find('fieldset'));
                        var divCamp = $('<div>').attr('class', 'campo');

                        var campoNombre = divCamp.clone();
                        campoNombre.appendTo(cont.find('fieldset'));
                        $('<label>').attr('for', 'nom_act').html('Nombre:').appendTo(campoNombre);
                        $('<input>').attr('id', 'nom_act').attr('name', 'nom_act').val(values[2]).appendTo(campoNombre);

                        var campoFeini = divCamp.clone();
                        campoFeini.appendTo(cont.find('fieldset'));
                        $('<label>').attr('for', 'fech_ini').html('Fecha Inicial:').appendTo(campoFeini);
                        $('<input>').attr('id', 'fech_ini').attr('name', 'fech_ini').attr('type', 'date').val(values[3]).appendTo(campoFeini);

                        var campoFefin = divCamp.clone();
                        campoFefin.appendTo(cont.find('fieldset'));
                        $('<label>').attr('for', 'fech_fin').html('Fecha Final:').appendTo(campoFefin);
                        $('<input>').attr('id', 'fech_fin').attr('name', 'fech_fin').attr('type', 'date').val(values[4]).appendTo(campoFefin);

                        var campoProg = divCamp.clone();
                        campoProg.appendTo(cont.find('fieldset'));
                        $('<label>').attr('for', 'prog').html('Programa Control:').appendTo(campoProg);
                       $(function () {
                        var selPr = $('<select>').attr('id', 'prog').attr('name', 'prog').appendTo(campoProg);
                            selPr.append($('<option>').attr('value',values[6]).html(valuesProg[3]).appendTo(campoProg));
                            new Combo('programa','prog',false);
                        });               

                        var campoEs = divCamp.clone();
                        campoEs.appendTo(cont.find('fieldset'));
                        $('<label>').attr('for', 'estado').html('Estado:').appendTo(campoEs);
                        var selEs =$('<select>').attr('id', 'estado').attr('name', 'estado').appendTo(campoEs);
                        if (values[5] == 'A') {
                            selEs.append($('<option>').attr('value','A').html('Activo').appendTo(campoEs));
                            selEs.append($('<option>').attr('value','C').html('Cerrado').appendTo(campoEs));
                        } else {
                            selEs.append($('<option>').attr('value','C').html('Cerrado').appendTo(campoEs));
                            selEs.append($('<option>').attr('value','A').html('Activo').appendTo(campoEs));
                        }
                        var campoEs = divCamp.clone();
                        campoEs.appendTo(cont.find('fieldset'));
                        $('<button>').attr('type', 'button').html('Grabar').on('click', function () {
                            if ($('#edactivid').val() !== '') {
                                var datos = 'accion=u&accion_u=update&idreg=' + pk + '&nombre=' + $('#nom_act').val() + '&feini=' + $('#fech_ini').val()  + '&fefin=' + $('#fech_fin').val() + '&prog=' + $('#prog').val() + '&estado=' + $('#estado').val();
                                var respuesta = new consultaAjax(formulario, false, datos).success(function (response) {
                                    cargarAgenda();
                                    $('#edactivi_' + pk).removeAttr('disabled');
                                });
                                $('#ed').remove();
                            }
                            else
                            {
                                alert('No selecciono ninguna actividad!')
                            }

                        }).appendTo(campoEs);
                        $('<button>').attr('type', 'button').html('Salir').on('click', function () {
                            $('#edactivi_' + pk).removeAttr('disabled');
                            $('#activi_' + pk).removeAttr('disabled');
                            $('#ed').remove();
                        }).appendTo(campoEs);
                    });
                    });
                    });

                    iDependen = iDependen.attr('disabled', 'true');
                    iDependen = iDependen.on('click', function () {
                        $('#activi_' + pk).attr('disabled', 'true');// Inactivo el boton de adicion de dependientes
                        $('#edactivi_' + pk).attr('disabled', 'true');// Inactivo el boton de adicion de dependientes
                        var contenedor = $('#dependientes_' + pk).parents("td");
                        $('<fieldset>').appendTo(contenedor);
                        $('<legend>').html('Adicionar Dependientes').appendTo(contenedor.find('fieldset'));
                        var divCampo = $('<div>').attr('class', 'campo');

                        var campoCiclo = divCampo.clone();
                        campoCiclo.appendTo(contenedor.find('fieldset'));
                        $('<label>').attr('for', 'cicloper').html('Ciclo:').appendTo(campoCiclo);
                        $('<select>').attr('id', 'cicloper').attr('name', 'cicloper').on('change', function () {
                            $('#periodo').empty();
                            new Combo("periodo", "periodo", true, $(this).val(), 'AG');
                        }).appendTo(campoCiclo);
                        new Combo("ciclo", "cicloper", true, 'agendamiento');


                        var campoPeriodo = divCampo.clone();
                        campoPeriodo.appendTo(contenedor.find('fieldset'));
                        $('<label>').attr('for', 'periodo').html('Periodo:').appendTo(campoPeriodo);
                        $('<select>').attr('id', 'periodo').attr('name', 'periodo').on('change', function () {
                            if ($(this).val() === '') {
                                $('#activid').empty();
                                return false
                            }
                            ;
                            $('#activid').empty();
                            new Combo("actividad", "activid", true, $(this).val());
                        }).appendTo(campoPeriodo);
                        //new Combo("periodo","periodo",true,urlVariables.idereferencia);

                        var campoActividad = divCampo.clone();
                        campoActividad.appendTo(contenedor.find('fieldset'));
                        $('<label>').attr('for', 'activid').html('Actividad:').appendTo(campoActividad);
                        $('<select>').attr('id', 'activid').attr('name', 'activid').on('change', function () {
                            if ($('#activid').val() === pk) {
                                alert('No puede seleccionar la misma actividad');
                                $('#activid').val('');
                            }
                        }).appendTo(campoActividad);

                        var campoActividad = divCampo.clone();
                        campoActividad.appendTo(contenedor.find('fieldset'));
                        $('<button>').attr('type', 'button').html('Grabar').on('click', function () {
                            if ($('#activid').val() !== '') {
                                var datos = 'accion=d&accion_m=dependientes&idreg=' + pk + '&padre=' + $('#activid').val() + '&usuario=1';
                                var respuesta = new consultaAjax(formulario, false, datos).success(function (response) {
                                    cargarAgenda();
                                    $('#activi_' + pk).removeAttr('disabled');
                                });
                                var contenedor = $('#dependientes_' + pk).parents("td");
                                contenedor.find('fieldset').remove();
                            }
                            else
                            {
                                alert('No selecciono ninguna actividad!')
                            }

                        }).appendTo(campoActividad);
                        $('<button>').attr('type', 'button').html('Salir').on('click', function () {
                            $('#activi_' + pk).removeAttr('disabled');
                            $('#edactivi_' + pk).removeAttr('disabled');
                            var contenedor = $('#dependientes_' + pk).parents("td");
                            contenedor.find('fieldset').remove();
                        }).appendTo(campoActividad);
                    });

                    $(this).html('');
                    $(this).append(iDependen, cerrarActividad, editarActividad, eliminarActividad);
                });
                $(this).find('td').eq(0).each(function () {
                    var jRadio = $(this).find('input').map(function () {
                        return this;
                    });
                    $(jRadio).on('click', function () {
                        pk = $(this).val();
                        pkselect = pk;
                        //alert (pkant);
                        if (pkant !== 0 && pk !== pkant) {
                            $('#activi_' + pkant).attr('disabled', true);
                            $('#edactivi_' + pkant).attr('disabled', true);
                        }
                        $('#edactivi_' + pk).removeAttr('disabled');
                        cargarAgendaSeleccionada($(this).val());

                        if (depende === "S") {
                            $('#activi_' + pk).removeAttr('disabled');
                        } else {
                            $('#delactivi_' + pk).removeAttr('disabled');
                        }
                        $('.tbldependiente').parents('td').hide();
                        $('#dependientes_' + pk).parents("td").show();
                        $('#edactivi_' + pk).parents("td").show();
                        pkant = pk;
                    });

                });

                var tbldependiente = $('<table>').attr('style', 'color:#C3C3C3;background-color:lightblue;margin:0px;').attr('id', 'dependientes_' + pk).attr('class', 'tbldependiente');
                var ctd = $('<td>').attr('colspan', '8').append(tbldependiente);
                $(this).after($('<tr>').append(ctd));
                cargarDepactividad(pk);
            });
            $('#ordguardar').remove();
            $('<button>').attr('type', 'button').attr('id', 'ordguardar').html('Guardar Orden').on('click', function () {
                var pk = $(this).find("td").eq(0).html();
                const data = $('#Agenda tbody').find('tr').map(function() {
                    return $(this).text()
                  }).get();
                  var datosag = 'accion=c&accion_m=agendas&cic_ideregistro=' + urlVariables.idereferencia + '&per_ideregistro=' + $('#per_ideregistro').val();
                  var respuesta = new consultaAjax(formulario, false, datosag).success(function (response) {
                    var datosTabla=response.substring(response.indexOf('||->')+4,response.indexOf('<-||'));
                                var valuesTabla=datosTabla.split('|__|');
                                valuesTabla.forEach(element => {
                                    var	values=element.split('c_@');
                        var datos = 'accion=u&accion_u=order&idper=' + urlVariables.per_ideregistro + '&orden='+values[10];
                        var respuesta = new consultaAjax(formulario, false, datos).success(function (response) {
                            $('#divRespuesta').html(response);
                        });
                    });
                    cargarAgenda();
                });
            }).appendTo(t);
            break;

        case 'tbldependiente':
            $('.tbldependiente').parents('td').hide();

            $('#dependientes_' + idreg).find('tr').each(function () {
                //$(this).find("td").eq(0).hide();
                var pkdea = $(this).find("td").eq(0).html();
                $(this).find('td').eq(4).each(function () {
                    //alert('Columna 2'+$(this).html()) ;
                    var Depborra = $('<button type="button">Borrar</button>').attr('id', 'borradea_' + pkdea);
                    Depborra = Depborra.on('click', function () {
                        //alert('va a borraR:'+pkdea);  idreg=id de la actividad usada en el nimero del boton
                        eliminar_dea(pkdea, idreg);
                    });
                    Depborra.appendTo($(this));
                });
            });
            break;

    }
}
var cargarAgendaSeleccionada = function (pid) {
    var argumentos = "accion=c&accion_m=agenda_seleccionada";
    argumentos += '&dper_ideregistr=' + pid;
    var a = new consultaAjax(formulario, false, argumentos);
    var respuesta = a.success(function (response) {
        cargarDatos(response);
    });
}
//Lum add 
var cargarDepactividad = function (pk) {
    var datos = 'accion=c&accion_m=idepactiv&dper_ideregistr=' + pk;
    var respuesta = new consultaAjax(formulario, false, datos).success(function (response) {
        if (response.trim() !== "sinDatos") {
            cargarTabla(response, 'dependientes_' + pk);
            ajustaTabla('tbldependiente', pk);
        }
        else {
            // $('#dependientes_'+pk).parents('td').remove();		
        }
    });
}
var eliminar_dea = function (pkdea, pk) {
    var datos = 'accion=x&accion_m=dea_depactividad&dea_ideregistro=' + pkdea;
    var respuesta = new consultaAjax(formulario, false, datos).success(function (response) {
        //$('#divRespuesta').html(response);
        cargarDepactividad(pk); //recargo los dependientes
        cargarAgenda();
    });
}
var eliminarRegistro = function () {
    valida();
}

var valida = function () {
    var argumentos = "accion=c&accion_m=deapadre&dper_ideregistr=" + pkselect;
    var a = new consultaAjax(formulario, false, argumentos);
    var respuesta = a.success(function (response) {
        if (response.trim() !== "sinDatos") {
            $('#divRespuesta').html('No puede eliminar al registro....desvinculelo del registro padre');
        }
        else {
            validahijos();
        }
    });
}

var validahijos = function () {
    var argumentos = "accion=c&accion_m=deahijo&dper_ideregistr=" + pkselect;
    var a = new consultaAjax(formulario, false, argumentos);
    var respuesta = a.success(function (response) {
        if (response.trim() !== "sinDatos") {
            $('#divRespuesta').html(' \n No puede eliminar el registro.... esta relacionado como padre de otra actividad');
        }
        else {
            var datos = 'accion=x&accion_m=dper_detperiodo&dper_ideregistr=' + pkselect;
            var respuesta = new consultaAjax(formulario, false, datos).success(function (response) {
                $('#divRespuesta').html(response);
                cargarAgenda();
            });
        }

    });
}

var onComboLoad = function (d, c) {
    switch (c) {
        case 'cicloper':
            $('#cicloper').val(urlVariables.idereferencia);
            break;
    }
}
var camposFormulario = function (nForm) {
    var nForm = (nForm || 0);
    var camposCaso = new Array();
    var formCampos = new Array();
    //----------------------------------- SE REGISTRAN TODOS LOS CAMPOS CON EL MISMO NOMBRE DE LA DB Y EN MISMO ORDEN

    formCampos[0] = '\
	,dper_ideregistr\
	,per_ideregistro\
	,dper_actividad\
	,dper_fecinicial\
	,dper_fecfinal\
	,dper_estado\
	,prg_ideregistro\
	,dper_ctrfecha\	,dper_ctrdependen\
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