var impresionVista = {
    accion: null,
    /** Válida que la información esté completa para imprimir y según el modelo envía la información
     * @returns {void}
     */
    validarInfoImprimirContrato: function (_this, modelo, modulo) {
        var nombre = _this.attr('data-id');
        if (!modelo.idfinanciacion) {
            __dom.lanzarAlerta('No se encontró una financiación para descargar formatos', __app.mensajes.atencion);
            return;
        }
        switch (modulo) {
            case 'venta':
                if (!modelo.detallesSuscripcion) {
                    __dom.lanzarAlerta(__app.mensajes.seleccionarSuscripcion, __app.mensajes.atencion);
                    return;
                }
                var venta = modelo.detallesVenta.venta;
                var tercero = modelo.detallesSuscripcion.tercero;
                impresionVista.idfinanciacion = modelo.idfinanciacion;
                var suscripcion = modelo.detallesSuscripcion.suscripcion;
                suscripcion.municipio = modelo.detallesSuscripcion.propiedad.municipio;
                break;
            case 'financiacion':
                if (!modelo.suscripcion) {
                    __dom.lanzarAlerta(__app.mensajes.seleccionarSuscripcion, __app.mensajes.atencion);
                    return;
                }
                var venta = {idventa: 0};
                var tercero = modelo.idSolicitante;
                tercero.cedula = tercero.documento;
                var suscripcion = modelo.suscripcion;
                impresionVista.idfinanciacion = modelo.numeropagare;
                if (nombre === 'PagarePersonaJuridicaFinal') {
                    tercero = modelo.suscripcion;
                    var firma = modelo.idSolicitante;
                }
                break;
            case 'financiacionPostventa':
                if (!modelo.detallesSuscripcion) {
                    __dom.lanzarAlerta(__app.mensajes.seleccionarSuscripcion, __app.mensajes.atencion);
                    return;
                }
                var venta = {idventa: 0};
                var tercero = modelo.idSolicitante;
                tercero.cedula = tercero.documento;
                var suscripcion = modelo.detallesSuscripcion.suscripcion;
                impresionVista.idfinanciacion = modelo.numeropagare;
                //if (nombre === 'PagarePersonaJuridicaFinal') {
                //tercero = modelo.idSolicitante;
                var firma = modelo.idSolicitante;
                //}
                break;
        }
        var solicitante = modelo.idSolicitante;
        impresionVista.enviarInformacionPorFormato(nombre, venta, suscripcion, tercero, solicitante, firma);
    },
    /**
     * Valida el tipo de formato que se desea descargar y envía la información pertinente
     * @returns {void}
     */
    enviarInformacionPorFormato: function (nombre, venta, suscripcion, tercero, solicitante, firma) {
        impresionVista.accion = 'imprimir';
        var fechaActual = $('#pFechaActual').text();
        var fecha = convertirPrecios.convertirFecha(fechaActual);
        var datos = {informacion: {
                dias: fecha.dia,
                anioactual: fecha.anio,
                mesactual: fecha.mesletras,
                nombreformato: nombre,
                numeroventa: venta.numeroventa,
                idventa: venta.idventa,
                estrato: suscripcion.estrato,
                municipio: suscripcion.municipio,
                documentotercero: tercero.cedula,
                nombretercero: tercero.nombretercero,
                lugarexpedicion: tercero.lugarexpedicion,
                idsuscripcion: suscripcion.idsuscripcion,
                idfinanciacion: impresionVista.idfinanciacion,
                fechaactual: fecha.dia + '-' + fecha.mesletras + '-' + fecha.anio
            }};
        switch (nombre) {
            case 'VinculacionGasNatural':
                if (!impresionVista.agregarInformacionContratoVinculacion(datos)) {
                    return;
                }
                break;
            case 'PagareyVinculacionGasNaturalDomiciliarioPersonaJuridica':
                impresionVista.agregarInformacionContratoVinculacion(datos);
                datos.informacion.documentosolicitante = solicitante.cedula;
                datos.informacion.nombresolicitante = solicitante.nombretercero;
                datos.informacion.lugarsolicitante = solicitante.lugarexpedicion;
                datos.informacion.documentofirmante = firma ? firma.cedula : tercero.cedula;
                datos.informacion.firmante = firma ? firma.nombretercero : tercero.nombretercero;
            case 'PagareyVinculacionGasNaturalDomiciliariaPersonaNatural':
                impresionVista.agregarInformacionContratoVinculacion(datos);
                break;
            case 'Autorizacion':
            case 'AutorizacionyContrato':
                datos.informacion.dias = fecha.dia;
                datos.informacion.anioactual = fecha.anio;
                datos.informacion.mesactual = fecha.mesletras;
                break;
            case 'PagarePersonaJuridicaFinal':
                datos.informacion.documentosolicitante = solicitante.cedula;
                datos.informacion.nombresolicitante = solicitante.nombretercero;
                datos.informacion.lugarsolicitante = solicitante.lugarexpedicion;
                datos.informacion.documentofirmante = firma ? firma.cedula : tercero.cedula;
                datos.informacion.firmante = firma ? firma.nombretercero : tercero.nombretercero;
                break;
        }
        __cnn.ajax({
            'url': 'informacion_autorizacion/',
            data: datos,
            completado: function () {
                $('#linkFormato')[0].click();
            }
        });
    },
    /**
     * Valida la información que se agregará al contrato
     * @returns {void}
     */
    agregarInformacionContratoVinculacion: function (datos) {

        if (impresionVista.accion === 'imprimir') {
            var venta = financiarModelo.detallesVenta.venta;
            var tercero = financiarModelo.detallesSuscripcion.tercero;
            var propiedad = financiarModelo.detallesSuscripcion.propiedad;
            var suscripcion = financiarModelo.detallesSuscripcion.suscripcion;
            var genero = (tercero.sexo === 'F') ? 'Femenino' : (tercero.sexo === 'M' ? 'Masculino' : 'No Aplica');
            datos['informacion']['sexo'] = genero;
            datos['informacion']['barrio'] = propiedad.barrio;
            datos['informacion']['nombrestercero'] = tercero.nombres;
            datos['informacion']['celulartercero'] = tercero.telefonofijo;
            datos['informacion']['interes'] = financiarModelo.interesmaximo;
            datos['informacion']['telefonotercero'] = tercero.telefonocelular;
            datos['informacion']['apellidostercero'] = tercero.apellidos;
            datos['informacion']['tipodocumento'] = tercero.tipodocumento;
            datos['informacion']['direccion'] = propiedad.direccion;
            datos['informacion']['municipio'] = propiedad.municipio;
            datos['informacion']['departamento'] = propiedad.departamento;
            datos['informacion']['numerocuota'] = $('#txtNumCuotas').val();
            datos['informacion']['tipodeuso'] = suscripcion.tipousosuscripcion;
            datos['informacion']['correoelectronico'] = tercero.correoelectronico;
            datos['informacion']['valorfinanciar'] = $('#txtValorFinanciar').val();
            datos['informacion']['cuotainicial'] = $('#txtValorCuotaInicial').val();
            datos['informacion']['valorventa'] = venta.valortotal.toString().toCurrency();
            datos['informacion']['metododepago'] = venta.metodopago === 'F' ? 'Financiado' : 'Contado';
        }

        if ($('#divInfoFinanciera').is(':hidden')) {
            (impresionVista.accion === 'imprimir') ? __dom.lanzarAlerta('No hay información suficiente para descargar el formato', __app.mensajes.atencion) : null;
            return false;
        }
        if ($('#divLaboral').is(':hidden') && $('#divJuridica').is(':visible')) {
            var informacionCorrecta = impresionVista.agregarInformacionPersonaJuridica(datos);
            if (!informacionCorrecta) {
                __dom.lanzarAlerta('No hay información suficiente para descargar el formato', __app.mensajes.atencion);
            }
            if (impresionVista.accion === 'imprimir') {
                datos['informacion']['nombrestercero'] = tercero.nombretercero;
            }
            return informacionCorrecta;
        }
        var objeto = datos['informacion']['personanatural'] = {
            diaingreso: '',
            mesingreso: '',
            anioingreso: ''
        };
        return impresionVista.agregarInformacionPersonaNatural(objeto);
    },
    /**
     * Valida y/o agrega la información de la persona natural y su información financiera 
     * @param {object} datos - Objeto donde se guardará la información
     * @param {string} accion - Valida la acción por la que se ejecuta el método (imprimir - guardar)
     * @returns {Boolean}
     */
    agregarInformacionPersonaNatural: function (objeto) {
        var cambiados = 0;
        if ($('#divNatural').is(':hidden')) {
            return false;
        }
        var cajatotal = $('input[data-caja="total"]');
        var txtfechaingreso = $('#txtFechaIngresoLaboral').val();

        var campos = $('#divNatural input:text, #divNatural select').not(cajatotal);
        var cantExperiencia = impresionVista.calcularExperienciaEnDias($('#txtAnioExperienciaLaboral'), $('#txtMesesExperienciaLaboral'));


        for (var indice = 0; indice < campos.length; indice++) {
            cambiados += impresionVista.validarValorCaja($(campos[indice]), objeto) ? 1 : 0;
        }
        if (cambiados === 0 && txtfechaingreso.trim() === '') {
            (impresionVista.accion === 'imprimir') ? __dom.lanzarAlerta('No hay información suficiente para el formato', __app.mensajes.atencion) : null;
            return false;
        }
        if (txtfechaingreso.trim() !== '') {
            var fechaingreso = convertirPrecios.convertirFecha(txtfechaingreso);
            objeto.diaingreso = fechaingreso.dia;
            objeto.mesingreso = fechaingreso.mes;
            objeto.anioingreso = fechaingreso.anio;
        }
        objeto.cantidadexperiencia = cantExperiencia;
        if (impresionVista.accion === 'imprimir') {
            objeto.meslaborado = (objeto.meslaborado) ? objeto.meslaborado + ' Meses' : null;
            objeto.aniolaborado = (objeto.aniolaborado) ? objeto.aniolaborado + ' Años' : null;
            for (var index = 0; index < cajatotal.length; index++) {
                var caja = $(cajatotal[index]);
                objeto[caja.attr('data-reference')] = caja.val();
            }
        }
        //objeto.idactividadeconomica = $('#txtOcupacionLaboral').attr('data-id');
        return true;
    },
    /**
     * Valida y/o agrega la información jurídica de una empresa
     * @param {object} datos - Objeto donde se guardará la información
     * @returns {Boolean} - Informa si se agregó información jurídica
     */
    agregarInformacionPersonaJuridica: function (datos) {
        //Carga información empresarial 
        var tiposociedad = $('#cmbTipoSociedad');
        var cajas = $('#divFinanciera input[data-caja]');
        var informacion = datos['informacion']['personajuridica'] = {};
        //var actividadeconomica = $('#txtActividadEmpresarial').attr('data-id'); --En el caso de que se tome de la suscripción
        var telefonofijo = $('#txtTelefono1Empresarial').val();
        var telefonocelular = $('#txtTelefono2Empresarial').val();
        var cmbActividadeconomica = $('#txtActividadEmpresarial');
        var mesexperiencia = $('#txtMesesExperienciaEmpresarial');
        var aniosexperiencia = $('#txtAnioExperienciaEmpresarial');

        var campossincambiar = (tiposociedad.val() === '-1' && cmbActividadeconomica.val() === '-1' && mesexperiencia.val().trim() === '' && aniosexperiencia.val().trim() === '' && telefonofijo.trim() === '' && telefonocelular.trim() === '');

        var cambiados = 0;
        for (var indice = 0; indice < cajas.length; indice++) {
            var caja = $(cajas[indice]);
            if (!isNaN(parseInt(caja.attr('title')))) {
                var boolValorInt = impresionVista.accion === 'imprimir';
                var valor = boolValorInt ? caja.val() : caja.attr('title');
                informacion[caja.attr('data-reference')] = valor;
                cambiados++;
            }
        }

        campossincambiar = campossincambiar && cambiados === 0;

        if ($('#divJuridica').is(':hidden') || campossincambiar) {
            return false;
        }

        if (impresionVista.accion === 'imprimir') {
            informacion.mesesexperiencia = mesexperiencia.val() + ' Meses';
            informacion.anioexperiencia = aniosexperiencia.val() + ' Años';
            informacion.idtiposociedad = (tiposociedad.val() !== '-1') ? tiposociedad.find('option:selected').text() : null;
            informacion.idactividadeconomica = (cmbActividadeconomica.val() !== '-1') ? cmbActividadeconomica.find('option:selected').text() : null;
        } else {
            informacion.mesesexperiencia = mesexperiencia.val();
            informacion.anioexperiencia = aniosexperiencia.val();
            informacion.idtiposociedad = (tiposociedad.val() !== '-1') ? tiposociedad.val() : null;
            informacion.idactividadeconomica = (cmbActividadeconomica.val() !== '-1') ? cmbActividadeconomica.val() : null;
        }

        var cantidadexperiencia = impresionVista.calcularExperienciaEnDias(aniosexperiencia, mesexperiencia);
        informacion.cantidadexperiencia = cantidadexperiencia;
        informacion.telefono2 = telefonocelular;
        informacion.telefono1 = telefonofijo;
        //informacion.idtiposociedad = tiposociedad.val() !== '-1' ? tiposociedad.find('option:selected').text() : '';
        return true;
    },
    /**
     * Calcula la cantidad de experiencia financiera o laboral en días
     * @param {object} anio - Caja de texto donde ingresan experiencia en años
     * @param {object} mes - Caja de texto donde ingresan experiencia en meses
     * @returns {int} Días de experiencia
     */
    calcularExperienciaEnDias: function (txtAnio, txtMes) {
        var dias = 0;
        var mes = parseInt(txtMes.val());
        var anio = parseInt(txtAnio.val());

        (!isNaN(mes)) ? dias += mes * 30 : 0;
        (!isNaN(anio)) ? dias += anio * 360 : 0;
        return dias;
    },
    /**
     * Valida la información de una caja de texto y es guardada en un objeto
     * @returns {void}
     */
    validarValorCaja: function (caja, obj) {
        var modificado = true;
        var valormoneda = caja.parents('div:eq(1)').attr('id') === 'divFinanciera';
        switch (caja[0].tagName) {
            case 'INPUT':
                modificado = caja.val().trim() !== '';
                if (modificado) {
                    if (!caja.attr('data-caja')) {
                        obj[caja.attr('data-reference')] = caja.val();
                    } else {

                        if (isNaN(parseInt(caja.attr('title'))) && valormoneda) {
                            return false;
                        }
                        var boolValorInt = impresionVista.accion === 'imprimir' || !valormoneda;
                        var valor = boolValorInt ? caja.val() : caja.attr('title');
                        obj[caja.attr('data-reference')] = valor;
                    }
                }
                break;
            case 'SELECT':
                modificado = caja.val() !== '-1' && caja.val();
                if (modificado) {
                    var valor = impresionVista.accion === 'imprimir' ? caja.find('option:selected').text() : caja.val();
                    obj[caja.attr('data-reference')] = valor;
                }
                break;
        }
        return modificado;
    }
};