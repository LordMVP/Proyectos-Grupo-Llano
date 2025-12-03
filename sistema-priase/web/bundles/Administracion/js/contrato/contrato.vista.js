/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * 
 * liquidaciones de crédito financiación.
 */

$(function () {
    var contratoVista = {
        variables: {
            listaContratos: null,
        },
        controles: {
            cmbFirmaInstaladora: $('#cmbFirmaInstaladora'),
            btnGenerarContrato: $('#btnGenerarContrato'),
            btnConsultarContrato: $('#btnConsultarContrato'),
            contentContratos: $('#listaContratos'),
        },
        init: function () {
            contratoVista.consultas.cargarListaFinanciaciones();
            contratoVista.eventos();
        },
        eventos: function () {
            contratoVista.controles.btnGenerarContrato.on('click', contratoVista.funcionesEventos.onClickBtnGenerarContrato);
            contratoVista.controles.contentContratos.on('click', '.link-ver-contrato', contratoVista.funcionesEventos.onClickBtnVerContrato);
            contratoVista.controles.btnConsultarContrato.on('click', contratoVista.funcionesEventos.onClickBtnConsultarContrato);
        },
        funcionesEventos: {
            onClickBtnGenerarContrato: function () {
                contratoVista.controles.contentContratos.addClass('hidden');
                if (!$('#cmbFirmaInstaladora').val()) {
                    __dom.lanzarAlerta("Debe seleccionar como mínimo una firma instaladora.", "Atención");
                    return;
                }
                var idfirmas = {idfirmas: $('#cmbFirmaInstaladora').val().join(",")};
                contratoVista.consultas.ejecutarContrato(idfirmas);
            },
             onClickBtnVerContrato: function () {
               var link = $(this);
               var tercero = $('#cmbFirmaInstaladora').val();
               var index = link.attr('data-index');
               var contrato = contratoVista.variables.listaContratos[index];
               var numContrato = contrato.numerocontrato;
               var url = '../../../venta/financiacion/contrato/generarreportecontrato?numerocontrato=' + numContrato + '&idfirmas=' + tercero;
               window.open(url, '_blank');
           },
            onClickBtnConsultarContrato: function () {
                contratoVista.controles.contentContratos.addClass('hidden');
                if (!$('#cmbFirmaInstaladora').val()) {
                    __dom.lanzarAlerta("Debe seleccionar como mínimo una firma instaladora.", "Atención");
                    return;
                }
                var idfirmas = {idfirmas: $('#cmbFirmaInstaladora').val().join(",")};
                contratoVista.consultas.consultarContratos(idfirmas);
            }
        },
        consultas: {
            /**
             * Ejecutará la consulta que nos cargará el combo #cmbFirmaInstaladora...
             */
            cargarListaFinanciaciones: function () {
                contratoControl.consultarFinanciaciones(null, contratoVista.funcionesConsultas.onResultadoCargarListaFinanciaciones);
            },
            ejecutarContrato: function (idfirmas) {
                contratoControl.ejecutarContrato(idfirmas, contratoVista.funcionesConsultas.onResultadoGenerarContrato);
            },
            consultarContratos: function (idfirmas) {
                contratoControl.consultarContrato(idfirmas, contratoVista.funcionesConsultas.onResultadoConsultarContrato);
            }
        },
        funcionesConsultas: {
            /**
             * Recibe la respuesta de la consulta de financiaciones y llena el combo 
             * #cmbFirmaInstaladora.
             * @param {Object} respuesta
             */
            onResultadoCargarListaFinanciaciones: function (respuesta) {
                var cmb = contratoVista.controles.cmbFirmaInstaladora;
                cmb.html('');
                if (respuesta && respuesta.codigo > 0) {
                    for (var i = 0; i < respuesta.datos.length; i++) {
                        var obj = respuesta.datos[i];
                        cmb.append(new Option(obj.nombrefirma, obj.idfirmainstaladora));
                    }
                    cmb.multipleSelect();
                } else {
                    cmb.append(new Option("No hay registros", ""));
                }
                if (cmb.find('option').length == 2) {
                    cmb.val(cmb.find('option:eq(1)').attr('value'));
                }
            },
            /**
             * Recibe la respuesta de la solicitud generar contrato y muestra al usuario
             * si el proceso ha sido éxitoso.
             * @param {type} respuesta
             * @returns {undefined}
             */
            onResultadoGenerarContrato: function (respuesta) {
                if (respuesta.codigo > 0) {
                    console.log(respuesta);
                    contratoVista.utiles.llenarTablaContratos(respuesta);
                } else if (respuesta.codigo == 0) {
                    __dom.lanzarAlerta("No se encontraron ventas asociadas a las firmas seleccionadas para generar el contrato.", "Atención");
                } else {
                    __dom.lanzarAlerta("Se ha producido un error al generar el contrato para las firmas seleccionadas.", "Atención");
                }
            },
            onResultadoConsultarContrato: function (respuesta) {
                if (respuesta.codigo > 0) {
                    console.log(respuesta);
                    contratoVista.utiles.llenarTablaContratos(respuesta);
                } else if (respuesta.codigo == 0) {
                    __dom.lanzarAlerta("No se encontraron ventas asociadas a las firmas seleccionadas.", "Atención");
                } else {
                    __dom.lanzarAlerta("Se ha producido un error al consultar los contratos de las firmas seleccionadas.", "Atención");
                }
            },
        },
        utiles: {
            llenarTablaContratos: function (respuesta) {
                if (Array.isArray(respuesta.datos) && respuesta.datos.length > 0) {
                    var max = respuesta.datos.length;
                    contratoVista.controles.contentContratos.removeClass('hidden');
                    var content = contratoVista.controles.contentContratos.find('table tbody');
                    content.html('');
                    contratoVista.variables.listaContratos = respuesta.datos;
                    for (var i = 0; i < max; i++) {
                        var obj = respuesta.datos[i];
                        //Agregar item...
                        var item = $('<tr>'
                                + '<td>' + obj.nombrefirma + '</td>'
                                + '<td>' + obj.nitfirma + '</td>'
                                + '<td>$' + contratoVista.utiles.formatearMonedaGeneral(obj.valorcontrato) + '</td>'
                                + '<td>' + obj.numerocontrato + '</td>'
                                + '<td>' + '<a href="javascript:;" data-index="'
                                + i + '" class="link-ver-contrato" ><i class="fa fa-fw fa-eye"></i> Ver</a>' + '</td>'
                                + '<tr>');
                        content.append(item);
                    }
                }
            },
            formatearMonedaGeneral: function (n) {
                return contratoVista.utiles.formatearMoneda(parseFloat(n), 0, ',', '.');
            },
            formatearMoneda: function (n, c, d, t) {
                if (typeof n != "number") {
                    return "-";
                }
                var
                        c = isNaN(c = Math.abs(c)) ? 2 : c,
                        d = d == undefined ? "." : d,
                        t = t == undefined ? "," : t,
                        s = n < 0 ? "-" : "",
                        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
                        j = (j = i.length) > 3 ? j % 3 : 0;
                return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
            }
        }
    };

    contratoVista.init();
});