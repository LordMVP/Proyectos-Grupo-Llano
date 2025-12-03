$(function () {
    reporteVentasVista = {
        /***
         * En este objeto se encontrarán las referencias a los controles del módulo.
         */
        controles: {
            cmbFirmaInstaladora: $('#cmbFirmaInstaladora'),
            txtFechaInicio: $('#txtFechaInicio'),
            txtFechaFin: $('#txtFechaFin'),
            cmbEstadoVenta: $('#cmbEstadoVenta'),
            txtRadicado: $('#txtRadicado'),
            txtFechaPago: $('#txtFechaPago'),
        },
        /**
         * Se invoca para iniciar el programa.
         */
        init: function () {
            reporteVentasVista.configurarEventos();
            reporteVentasVista.configurarVista();
            reporteVentasVista.consultas.cargarListaFinanciaciones();
        },
        /**
         * Configura los eventos de los controles del módulo.
         */
        configurarEventos: function () {
            $('.btnGenerarReporte').on('click', reporteVentasVista.funcionesEventos.onClickBtnGenerarReporte);
            $('input, select').on('change', reporteVentasVista.onChangeInput);
            $('.dropdown-btn').on('click', reporteVentasVista.funcionesEventos.onClickDropdownBtn);
            $('body').on('click', reporteVentasVista.funcionesEventos.onClickDocument);
        },
        /**
         * Conrfigura los plugins, carácteristicas y comportamientos de los controles del módulo,
         * en este caso configurará los calendarios...
         */
        configurarVista: function () {
            __dom.configurarCalendario(reporteVentasVista.controles.txtFechaInicio.attr('id'));
            __dom.configurarCalendario(reporteVentasVista.controles.txtFechaFin.attr('id'));
            __dom.configurarCalendario(reporteVentasVista.controles.txtFechaPago.attr('id'));
        },
        /**
         * En este objeto se encontrarán todas las funciones para los eventos de los elementos de la vista.
         */
        funcionesEventos: {
            onClickBtnGenerarReporte: function () {
                if (!reporteVentasVista.validarFormulario()) {
                    __dom.lanzarAlerta("Debe completar correctamente los campos.", "Atención");
                    return;
                }
                var obj = reporteVentasVista.obtenerObjetoFormulario();
                obj.opcion = $(this).attr('data-target');
                reporteVentasControl.generarReporte(obj, reporteVentasVista.funcionesConsulta.onGenerarReporteCompleto);
            },
            onChangeInput: function () {
                $(this).parent().removeClass('has-error');
            },
            onClickDropdownBtn: function () {
                var menu = $(this).next('.dropdown-menu');
                if (menu.hasClass('active')) {
                    menu.removeClass('active');
                } else {
                    menu.addClass('active');
                }
            },
            onClickDocument: function (e) {
                console.log(e.target);
                if ($(e.target).hasClass('dropdown-btn')) {
                    return;
                }
                $('.dropdown-menu').removeClass('active');
            }
        },
        /**
         * En este objeto se encontarán todas las consultas que realiza y/o ejecuta el módulo.
         */
        consultas: {
            /**
             * Ejecutará la consulta que nos cargará el combo #cmbFirmaInstaladora...
             */
            cargarListaFinanciaciones: function () {
                reporteVentasControl.consultarFinanciaciones(null, reporteVentasVista.funcionesConsulta.onResultadoCargarListaFinanciaciones);
            },
        },
        /**
         * En este objeto se encontarán todas las funciones que ejecutarán al finalizar las consultas del módulo.
         */
        funcionesConsulta: {
            /**
             * Recibe la respuesta de la consulta de financiaciones y llena el combo 
             * #cmbFirmaInstaladora.
             * @param {Object} respuesta
             */
            onResultadoCargarListaFinanciaciones: function (respuesta) {
                var cmb = reporteVentasVista.controles.cmbFirmaInstaladora;
                cmb.html('');
                if (respuesta && respuesta.codigo > 0) {
                    for (var i = 0; i < respuesta.datos.length; i++) {
                        var obj = respuesta.datos[i];
                        cmb.append(new Option(obj.nombrefirma, obj.idfirmainstaladora));
                    }
                    //Invoca el prototipo del plugin multipleselect js para habilitar la selección múltiple...
                    cmb.multipleSelect();

                } else {
                    cmb.append(new Option("No hay registros", ""));
                }
                if (cmb.find('option').length == 2) {
                    cmb.val(cmb.find('option:eq(1)').attr('value'));
                }
            },
            onGenerarReporteCompleto: function (respuesta) {
                if (respuesta != null && respuesta.id != null && respuesta.id.trim() != "") {
                    window.open("../../../../../reportes/admin/download/" + respuesta.id);
                } else {
                    __dom.lanzarAlerta("Lo sentimos, no se pudo generar el reporte.", "Error");
                }
            }
        },
        /**
         * Valida el formulario.
         * @returns {Boolean}
         */
        validarFormulario: function () {
            var valid = 0;
            (!reporteVentasVista.utils.validarCampo(reporteVentasVista.controles.cmbFirmaInstaladora)) && (valid--);
            (!reporteVentasVista.utils.validarCampo(reporteVentasVista.controles.txtFechaInicio, true)) && (valid--);
            (!reporteVentasVista.utils.validarCampo(reporteVentasVista.controles.txtFechaFin, true)) && (valid--);
            return valid == 0;
        },
        /**
         * Retorna un objeto con los datos del formulario.º
         * @returns {Object}
         */
        obtenerObjetoFormulario: function () {
            var obj = {
                firmaInstaladora: reporteVentasVista.controles.cmbFirmaInstaladora.val(),
                fechainicio: reporteVentasVista.controles.txtFechaInicio.val(),
                fechafin: reporteVentasVista.controles.txtFechaFin.val(),
                numeropqr: reporteVentasVista.utils.asignarValorDefecto(reporteVentasVista.controles.txtRadicado.val()),
                ventaestado: reporteVentasVista.utils.asignarValorDefecto(reporteVentasVista.controles.cmbEstadoVenta.val()),
                fechapago: reporteVentasVista.utils.asignarValorDefecto(reporteVentasVista.controles.txtFechaPago.val()),
            };

            return obj;
        },
        /**
         * Utilerías del módulo.
         */
        utils: {
            /**
             * Recibe el valor de un campo y retorna -1 si está vacío.
             * @param {String} valor
             * @returns {String}
             */
            asignarValorDefecto: function (valor) {
                if (valor == null || valor.trim() == "") {
                    return "-1";
                } else {
                    return valor;
                }
            },
            /**
             * Valida si un campo de tipo input o select está vacio y si recibe 
             * el segundo parámetro en true, validará si es una fecha.
             * @param {Element} campo
             * @param {Boolean} esFecha
             * @returns {Boolean}
             */
            validarCampo: function (campo, esFecha) {
                if (esFecha == true) {
                    if (reporteVentasVista.utils.validarFecha(campo.val())) {
                        campo.parent().removeClass('has-error');
                        return true;
                    } else {
                        campo.parent().addClass('has-error');
                        return false;
                    }
                }
                if (campo.val().trim() == "") {
                    campo.parent().addClass('has-error');
                    return false;
                } else {
                    campo.parent().removeClass('has-error');
                    return true;
                }
            },
            /**
             * Validará una fecha en el formato YYYY/MM/DD.
             * @param {type} fecha
             * @returns {Boolean}
             */
            validarFecha: function (fecha) {
                var RegExPattern = /^\d{2,4}\/\d{1,2}\/\d{1,2}$/;
                if ((fecha.match(RegExPattern)) && (fecha != '')) {
                    return true;
                } else {
                    return false;
                }
            },
            /**
             * Valida si una fecha es mayhor que otra.
             * @param {Date(yyyy/mm/dd)} fechaInicial
             * @param {Date(yyyy/mm/dd)} fechaFinal
             * @returns {Number}
             */
            validarfechaMayorQue: function (fechaInicial, fechaFinal) {
                valuesStart = fechaInicial.split("/");
                valuesEnd = fechaFinal.split("/");

                // Verificamos que la fecha no sea posterior a la actual
                var dateStart = new Date(valuesStart[0], (valuesStart[1] - 1), valuesStart[2]);
                var dateEnd = new Date(valuesEnd[0], (valuesEnd[1] - 1), valuesEnd[2]);
                if (dateStart >= dateEnd)
                {
                    return 0;
                }
                return 1;
            }
        },
    };
    reporteVentasVista.init();
});