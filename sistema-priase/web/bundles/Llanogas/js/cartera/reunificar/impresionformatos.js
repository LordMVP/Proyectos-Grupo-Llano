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
        return impresionVista.enviarInformacionPorFormato(nombre, venta, suscripcion, tercero, solicitante, firma, modelo);
    },
    /**
     * Valida el tipo de formato que se desea descargar y envía la información pertinente
     * @returns {void}
     */
    enviarInformacionPorFormato: function (nombre, venta, suscripcion, tercero, solicitante, firma, modelo) {
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
                codigoAnterior: suscripcion.codigoanterior,
                idfinanciacion: impresionVista.idfinanciacion,
                fechaactual: fecha.dia + '-' + fecha.mesletras + '-' + fecha.anio,
                barrio: suscripcion.barrio,
                direccion: suscripcion.direccion,
                fechaFinanciacion: modelo.fechaFinanciacion,
                periodo: modelo.cicloPeriodo.periodo,
                cuotas: modelo.cuotas,
                parentesco: modelo.parentesco,
                totalFacturas: formatNumber(modelo.totalFacturas),
                totalFinanciar: formatNumber(modelo.totalFinanciar),
                totalCuotaInicial: formatNumber(modelo.totalCuotaInicial),
                valorCuota: formatNumber(modelo.valorCuota),
                tasaInteres: modelo.interes,
                numerosFacturas: modelo.numeros_facturas,
                totalFinanciarLetters: modelo.totalFinanciarLetters,
                formato: {}
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
            case 'PagarePersonaNaturalFinal':
                let info1 = impresionVista.infoFormatoPersonaNaturalBio(datos.informacion);
                datos.informacion.formato["parrafo1"] = info1.parrafo1;
                datos.informacion.formato["parrafo2"] = info1.parrafo2;   
                break;
            case 'PagarePersonaJuridicaFinal':
                datos.informacion.documentosolicitante = solicitante.cedula;
                datos.informacion.nombresolicitante = solicitante.nombretercero;
                datos.informacion.lugarsolicitante = solicitante.lugarexpedicion;
                datos.informacion.documentofirmante = firma ? firma.cedula : tercero.cedula;
                datos.informacion.firmante = firma ? firma.nombretercero : tercero.nombretercero;
                let info2 = impresionVista.infoFormatoPersonaJuridicaBio(datos.informacion);
                datos.informacion.formato["parrafo1"] = info2.parrafo1;
                datos.informacion.formato["parrafo2"] = info2.parrafo2; 
                
                break;
            case 'TratamientoDatos':
                let info3 = impresionVista.infoFormatoTratamientoDatosBio(datos.informacion);
                datos.informacion.formato["parrafo0"] = info3.parrafo0;
                datos.informacion.formato["parrafo1"] = info3.parrafo1;
                datos.informacion.formato["parrafo2"] = info3.parrafo2;  
                break;
        }
        return datos.informacion;
        /*__cnn.ajax({
            'url': 'informacion_autorizacion/',
            data: datos,
            completado: function () {
                $('#linkFormato')[0].click();
            }
        });*/
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
    },
    /**
     * Retorna el contenido del formato para el pagare persona natural final de bioagricola
     * @returns {void}
     */
    infoFormatoPersonaNaturalBio: function (datos) {
        let parrafo1 = 
            "Yo, "+datos.nombretercero+" identificado con Cédula de Ciudadanía No. "+datos.documentotercero+" expedida en "+datos.lugarexpedicion+" en calidad de deudor, con domicilio en \
            "+datos.municipio+" por medio del presente escrito DECLARO que por virtud del presente título valor pagaré incondicional e indivisiblemente, a la orden de BIOAGRICOLA DEL LLANO S.A. \
            EMPRESA DE SERVICIOS PÚBLICOS BIC en adelante BIOAGRICOLA DEL LLANO S.A. E.S.P. BIC persona jurídica de derecho privado, identificada con NIT N°822.000.268-9, con domicilio \
            en la ciudad de Villavicencio (Meta),  o a quien represente sus derechos, en la ciudad de______________ el día_________(____) del mes de _____________ del \
            año__________(20___), la suma de_____________________________________________________  PESOS ($_____________) MONEDA LEGAL, que reconozco tener a título de \
            deuda, más la suma de __________________________________________ PESOS ($_____________) MONEDA LEGAL que a la fecha adeudo por concepto de intereses, que pagaré \
            a las tasas pactadas o a las que estuvieren vigentes como límite máximo a cobrar de acuerdo con la ley mercantil, para cada periodo en que persista la mora. Acepto \
            incondicionalmente todo endoso o cesión que BIOAGRICOLA DEL LLANO S.A. E.S.P. BIC haga del presente pagaré, así como de las garantías que lo amparan, sin que para su efectividad \
            sean necesarias, nuevas autorizaciones o aceptaciones. \
            <br/><br/>\
            En caso de incumplimiento en el pago de la deuda, la obligación se hará exigible en su totalidad, sin necesidad de requerimiento previo. En caso de prórroga, novación o \
            modificación de cualquiera de las obligaciones contenidas en este Pagaré a cargo del Deudor, éste manifiesta desde ahora que acepta expresamente que continúen vigentes todas y \
            cada una de las garantías reales o personales que están amparando las obligaciones a su cargo, garantías que se entenderán ampliadas a las nuevas obligaciones que puedan surgir \
            conforme a lo previsto en el artículo 1708 del Código Civil colombiano. \
            <br/><br/>\
            En tal caso, BIOAGRICOLA DEL LLANO S.A. E.S.P. BIC o cualquier tenedor legítimo del presente título valor, podrá cobrar judicial o extrajudicialmente la totalidad de la deuda, \
            más los intereses y gastos de cobranza incluyendo honorarios de abogado, efecto para el cual renunció a requerimientos judiciales o privados. \
            <br/><br/>\
            El presente pagaré se suscribe en blanco, y autorizo irrevocablemente a ____________________________ de conformidad con el artículo 622 del Código de Comercio para llenar, sin \
            previo aviso, y en cualquier tiempo los espacios que figuran en blanco en el presente título valor, de acuerdo con las instrucciones estipuladas en la carta de instrucciones \
            que se anexa.";
        
        let parrafo2 =
        "Señores\
        <br/>\
        BIOAGRICOLA DEL LLANO S.A. EMPRESA DE SERVICIOS PÚBLICOS BIC.\
        <br/>\
        Ciudad\
        <br/><br/>\
        Respetados Señores:\
        <br/><br/>\
        "+datos.nombretercero+", identificado con cédula de ciudadanía No. "+datos.documentotercero+" expedida en "+datos.lugarexpedicion+", por medio de la presente autorizo expresamente a BIOAGRICOLA DEL LLANO S.A. EMPRESA DE SERVICIOS PÚBLICOS BIC, o cualquier tenedor legítimo del presente título valor, para que haciendo uso de sus facultades conferidas por el Art. 622 del Código de Comercio llene sin previo aviso los espacios que se han dejado en blanco en el Pagaré Nº "+datos.idfinanciacion+" adjunto, cuando exista cualquier obligación a mí cargo, para lo cual deberá ceñirse a las siguientes instrucciones:\
        <br/><br/>\
        1. BIOAGRICOLA DEL LLANO S.A. E.S.P. BIC podrá llenar y utilizar dicho Pagaré cuando a su juicio fuere necesario, para efectuar el cobro de cualquier suma de dinero que resulte deber por incumplimiento derivado del pago del servicio que prestará BIOAGRICOLA DEL LLANO S.A E.S.P. BIC.\
        <br/>\
        2. La cuantía del Pagaré será igual al monto total o parcial del valor de las obligaciones exigibles a nuestro cargo y a favor de BIOAGRICOLA DEL LLANO S.A E.S.P. BIC existan al momento de ser llenado, incluidos pero no limitados al valor principal, portes, impuestos, gastos de cobranza, y cualquier otra suma que llegáramos a adeudar a BIOAGRICOLA DEL LLANO S.A E.S.P. BIC en razón al pago de multas, intereses, penalizaciones, compensaciones, cargos y sobrecostos derivados del incumplimiento que estén insolutas a la fecha de llenarse el Pagaré por cualquier motivo, de conformidad con el documento que contenga  la liquidación efectuada por BIOAGRICOLA DEL LLANO S.A E.S.P. BIC.\
        <br/>\
        3. La tasa de los intereses de mora será la máxima permitida por las disposiciones vigentes el día que se diligencie el título.\
        <br/>\
        4. Acepto incondicionalmente todo traspaso, endoso o cesión que BIOAGRICOLA DEL LLANO SA E.S.P. BIC haga del presente instructivo junto con el pagaré al cual corresponde y de las garantías que lo amparan, sin que para su efectividad sean necesarias, nuevas autorizaciones o aceptaciones.\
        <br/>\
        5. La fecha de vencimiento será la misma en que sea llenado el documento adjunto, y serán exigibles inmediatamente todas las obligaciones a mi cargo, sin necesidad que me requieran judicial o extrajudicialmente, para su cumplimiento.\
        <br/>\
        6. El pagaré así llenado presta mérito ejecutivo, pudiendo BIOAGRICOLA DEL LLANO S.A E.S.P. BIC o su tenedor legítimo exigir su pago, sin perjuicio de las demás acciones que pueda ejercer.\
        <br/>\
        7. Que las presentes instrucciones se imparten de conformidad con lo expuesto en el artículo 622, inciso 2º del Código de Comercio y para todos los efectos allí previstos ...\
        <br/>\
        8. Realizó expreso reconocimiento de que he leído y conservo copia de estas instrucciones, y que en señal de conformidad las suscribo.\
        <br/><br/>\
        INCORPORACIÓN DEL PAGARÉ: Se adjunta al presente documento el Pagaré en blanco arriba enunciado, el cual  BIOAGRICOLA DEL LLANO S.A. E.S.P. BIC declara haber recibido, comprometiéndose a custodiarlo y a utilizarlo conforme a lo aquí dispuesto.Se deja constancia que el Pagaré en blanco corresponde al Número "+datos.idfinanciacion+".\
        <br/><br/>\
        En la fecha he recibido copia de esta carta de instrucciones y la acepto sin reserva alguna.\
        <br/><br/>\
        Atentamente,";

        return {parrafo1, parrafo2};
    },

    /**
     * Retorna el contenido del formato para el pagare persona natural final de bioagricola
     * @returns {void}
     */
    infoFormatoPersonaJuridicaBio: function (datos) {
        let parrafo1 = "\
        "+datos.nombresolicitante+", identificado con cédula de ciudadanía No. "+datos.documentosolicitante+", expedida en "+datos.lugarsolicitante+",  actuando en calidad de Gerente y Representante Legal de "+datos.nombretercero+", persona jurídica de derecho privado, identificada con NIT N° "+datos.documentotercero+", con domicilio en la ciudad de "+datos.municipio+"; por medio del presente escrito DECLARO que por virtud del presente título valor pagaré incondicional e indivisiblemente, a la orden de BIOAGRICOLA DEL LLANO S.A. EMPRESA DE SERVICIOS PÚBLICOS BIC, persona jurídica de derecho privado, \
        identificada con NIT N°822.000.268-9, con domicilio en la ciudad _________________,  o a quien represente sus derechos, en la ciudad de _________________ el día ______________ (____) del mes de _____________- del año _________________ (20___), la suma de ______________________________________________________  PESOS ($______________) MONEDA LEGAL, que reconozco tener a título de deuda, más la suma de  ____________________________________________________________PESOS ($________________) MONEDA LEGAL que a la fecha adeudo por concepto de intereses, que pagaré a las tasas pactadas o a las que estuvieren \
        vigentes como límite máximo a cobrar de acuerdo con la ley mercantil, para cada periodo en que persista la mora. Acepto incondicionalmente todo endoso o cesión que BIOAGRICOLA DEL LLANO S.A. E.S.P. BIC haga del presente pagaré, así como de las garantías que lo amparan, sin que para su efectividad sean necesarias, nuevas autorizaciones o aceptaciones.\
        <br/><br/>\
        En caso de incumplimiento en el pago de la deuda, la obligación se hará exigible en su totalidad, sin necesidad de requerimiento previo. En caso de prórroga, novación o modificación de cualquiera de las obligaciones contenidas en este Pagaré a cargo del Deudor, éste manifiesta desde ahora que acepta expresamente que continúen vigentes todas y cada una de las garantías reales o personales que están amparando las obligaciones a su cargo, garantías que se entenderán ampliadas a las nuevas obligaciones que puedan surgir conforme a lo previsto en el artículo 1708 del Código Civil colombiano.\
        <br/><br/>\
        En tal caso, BIOAGRICOLA DEL LLANO S.A. E.S.P. BIC o cualquier tenedor legítimo del presente título valor, podrá cobrar judicial o extrajudicialmente la totalidad de la deuda, más los intereses y gastos de cobranza incluyendo honorarios de abogado, efecto para el cual renunció a requerimientos judiciales o privados.\
        <br/><br/>\
        El presente pagaré se suscribe en blanco, y autorizo irrevocablemente a ____________________________ de conformidad con el artículo 622 del Código de Comercio para llenar, sin previo aviso, y en cualquier tiempo los espacios que figuran en blanco en el presente título valor, de acuerdo con las instrucciones estipuladas en la carta de instrucciones que se anexa.\
        ";

        let parrafo2 = "\
        Señores\
        <br/>\
        BIOAGRICOLA DEL LLANO S.A. EMPRESA DE SERVICIOS PÚBLICOS BIC.\
        <br/>\
        Ciudad\
        <br/><br/>\
        Respetados Señores:\
        <br/><br/>\
        "+datos.nombresolicitante+", identificado con cédula de ciudadanía No. "+datos.documentosolicitante+" expedida en "+datos.lugarsolicitante+",  actuando en calidad de Representante Legal de "+datos.nombretercero+", persona jurídica de derecho privado, identificada con NIT "+datos.documentotercero+", con domicilio en la ciudad de "+datos.municipio+"; por medio de la presente autorizo expresamente a BIOAGRICOLA DEL LLANO S.A. EMPRESA DE SERVICIOS PÚBLICOS BIC, o cualquier tenedor legítimo del presente título valor, para que haciendo uso de sus facultades conferidas por el Art. 622 del Código de Comercio \
        llene sin previo aviso los espacios que se han dejado en blanco en el Pagaré Nº "+datos.idfinanciacion+" adjunto, cuando exista cualquier obligación a mí cargo, para lo cual deberá ceñirse a las siguientes instrucciones:\
        <br/><br/>\
        1. BIOAGRICOLA DEL LLANO S.A. E.S.P. BIC podrá llenar y utilizar dicho Pagaré cuando a su juicio fuere necesario, para efectuar el cobro de cualquier suma de dinero que resulte deber por incumplimiento derivado del pago de cualquier producto o servicio que prestaré BIOAGRICOLA DEL LLANO S.A E.S.P. BIC.\
        <br/>\
        2. La cuantía del Pagaré será igual al monto total o parcial del valor de las obligaciones exigibles que a nuestro cargo y a favor de BIOAGRICOLA DEL LLANO S.A E.S.P. BIC existan al momento de ser llenado, incluidos pero no limitados al valor principal, portes, impuestos, gastos de cobranza, y cualquier otra suma que llegáramos a adeudar a BIOAGRICOLA DEL LLANO S.A E.S.P. BIC en razón al pago de multas, intereses, penalizaciones, compensaciones, cargos y sobrecostos derivados del incumplimiento que estén insolutas a la fecha de llenarse el Pagaré por cualquier motivo, de conformidad con el documento que contenga  la liquidación efectuada por BIOAGRICOLA DEL LLANO S.A . E.S.P. BIC\
        <br/>\
        3. La tasa de los intereses de mora será la máxima permitida por las disposiciones vigentes el día que se diligencie el título.\
        <br/>\
        4. Acepto incondicionalmente todo traspaso, endoso o cesión que BIOAGRICOLA DEL LLANO SA E.S.P. BIC haga del presente instructivo junto con el pagaré al cual corresponde y de las garantías que lo amparan, sin que para su efectividad sean necesarias, nuevas autorizaciones o aceptaciones.\
        <br/>\
        5. La fecha de vencimiento será la misma en que sea llenado el documento adjunto, y serán exigibles inmediatamente todas las obligaciones a mi cargo, sin necesidad que me requieran judicial o extrajudicialmente, para su cumplimiento.\
        <br/>\
        6. El pagaré así llenado presta mérito ejecutivo, pudiendo BIOAGRICOLA DEL LLANO S.A E.S.P. BIC o su tenedor legítimo exigir su pago, sin perjuicio de las demás acciones que pueda ejercer.\
        <br/>\
        7. Que las presentes instrucciones se imparten de conformidad con lo expuesto en el artículo 622, inciso 2º del Código de Comercio y para todos los efectos allí previstos ...\
        <br/>\
        8. Realizó expreso reconocimiento de que he leído y conservo copia de estas instrucciones, y que en señal de conformidad las suscribo.\
        <br/><br/>\
        INCORPORACIÓN DEL PAGARÉ: Se adjunta al presente documento el Pagaré en blanco arriba enunciado, el cual BIOAGRICOLA DEL LLANO S.A. E.S.P. BIC declara haber recibido, comprometiéndose a custodiarlo y a utilizarlo conforme a lo aquí dispuesto.\
        <br/>\
        Se deja constancia que el Pagaré en blanco corresponde al Número "+datos.idfinanciacion+".\
        <br/><br/>\
        En la fecha he recibido copia de esta carta de instrucciones y la acepto sin reserva alguna.\
        <br/><br/>\
        Atentamente,\
        ";
        return {parrafo1, parrafo2};
    },

    infoFormatoTratamientoDatosBio: function (datos) {
        let parrafo0 = "\
        El deudor reconoce de manera voluntaria deber a Bioagricola del Llano S.A Empresa de Servicios Públicos BIC una obligación por valor de $"+datos.totalFinanciar+", Valor en letras "+datos.totalFinanciarLetters+" ,  $("+datos.totalFinanciar+"), correspondiente a la prestación del servicio de aseo, recibido al inmueble ubicado (Dirección "+datos.direccion+" Barrio "+datos.barrio+" del municipio de "+datos.municipio+"). Identificado con código de usuario N° "+datos.codigoAnterior+" y Facturas N° ["+datos.numerosFacturas+"].\
        ";

        let parrafo1 = "\
        Lea cuidadosamente la siguiente cláusula y pregunte lo que no comprenda.  \
        <br/><br/>\
        El abajo firmante, en su propio nombre o en nombre de la entidad que representa, declara que la información suministrada es verídica y da su consentimiento expreso e irrevocable a Bioagricola del Llano S.A. E.S.P. BIC, o a quien en el futuro haga sus veces como titular del crédito o servicio solicitado, para: a) Consultar, en cualquier tiempo, en las centrales de riesgo o en cualquier otra base de datos manejada por un operador, toda la información relevante para conocer su desempeño como deudor, su capacidad de pago, \
        la viabilidad para entablar o mantener una relación contractual y en general para la gestión del riesgo financiero y crediticio, esto es, la iniciación, mantenimiento y recuperación de cartera, actividades relacionadas con la prevención del lavado de activos y financiación del terrorismo, y prevención del fraude. b) Reportar a las centrales de riesgo o a cualquier otra base de datos manejada por un operador datos, tratados o sin tratar, sobre el cumplimiento o incumplimiento de sus obligaciones crediticias, sus deberes \
        legales de contenido patrimonial, sus datos de ubicación y contacto, sus solicitudes de crédito así como otros atinentes a sus relaciones comerciales, financieras y en general socioeconómicas que haya entregado o que consten en registros públicos, bases de datos públicas o documentos públicos. El reporte de la mencionada información tendrá como finalidad que los diferentes usuarios realicen actividades relacionadas con la gestión del riesgo financiero y crediticio, esto es, la iniciación, mantenimiento y recuperación de \
        cartera, actividades relacionadas con la prevención del lavado de activos y financiación del terrorismo, prevención del fraude y los demás autorizados por la ley. \
        <br/><br/>\
        La autorización anterior no impedirá al abajo firmante o su representada ejercer el derecho a corroborar en cualquier tiempo en Bioagricola del llano S.A. E.S.P. BIC o en la central de información de riesgo a la cual se hayan suministrado los datos, que la información suministrada es veraz, completa, exacta y actualizada, y en caso de que no lo sea, a que se deje constancia de su desacuerdo, a exigir la rectificación y a ser informado sobre las correcciones efectuadas.\
        <br/><br/>\
        En constancia de haber sido suficientemente informado del contenido y alcance de esta autorización se firma a los "+datos.dias+" días del mes de "+datos.mesactual+" del "+datos.anioactual+".\
        ";

        let parrafo2 = "\
        De conformidad con lo dispuesto en la Ley 1581 de 2012 y sus decretos reglamentarios y/o cualquiera que la adicione o modifique o derogue, mediante el registro de mis datos personales autorizo a Bioagricola del llano S.A. E.S.P. BIC para la recolección, almacenamiento, uso, circulación y supresión de los mismos para el mantenimiento, desarrollo y gestión de la presente relación contractual y adicionalmente para las siguientes finalidades: inscripción para solicitud de crédito, financiación, iniciación, mantenimiento y recuperación de cartera, ofrecer servicios y campañas comerciales, ofertar servicios de valor agregado, participar en programas de beneficios y fidelización, consultar hábitos de consumo y aficiones, promociones, contactarme para realizar estudios de mercado y encuestas de satisfacción, actualización de datos, gestionar trámites como solicitudes, servicios, peticiones, quejas, reclamos, recursos, revocatorias y acciones de tutela, a través de medios como correos electrónicos, SMS, MMS, llamadas telefónicas, redes sociales, aplicaciones móviles, además de compartir mis datos con su matriz y empresas filiales, así como empresas contratistas para efecto de cumplir con la prestación del servicio público de aseo y demás actividades relacionadas con el objeto social de la empresa, para la oferta de servicios en los términos de la Política de tratamiento de datos personales de Bioagricola del llano SA ESP BIC, la cual podré consultar en la página web de la compañía.\
        <br/><br/>\
        <a href='https://www.bioagricoladelllano.com.co/' target='_blank'>\
        Como titular de mi información tengo derecho a conocer, actualizar y rectificar mis datos personales, solicitar prueba de la autorización otorgada para su tratamiento, ser informado sobre el uso que se ha dado a los mismos, presentar quejas ante la SIC por infracción a la ley, revocar la autorización y/o solicitar la supresión de mis datos en los casos en que sea procedente y acceder de forma gratuita a los mismos. Bioagricola del llano SA ESP BIC dispone de los siguientes medios de atención: Sede administrativa ubicada en la Carrera 38 N° 26C - 95 Maizaro sur - Villavicencio/Meta, teléfono (608) 6819081, www.bioagricoladelllano.com.co y protecciondedatosbioagricola@grupodellano.com\
        </a>\
        <br/><br/>\
        Con la firma de esta autorización entiendo y acepto el registro y uso de mis datos personales como se estipula anteriormente. \
        ";

        return {parrafo0, parrafo1, parrafo2};
    },

    imprimirFormatoCondonacion: function(facturas){
        let info = impresionVista.infoFormatoCondonacionBio(facturas);
        let contenido = {
            parrafoPrincipal: info.parrafo0,
            tblFacturas: info.tblFacturas
        };
        return contenido;
    },

    infoFormatoCondonacionBio: function (facturas) {
        let parrafo0 = "\
            La presente solicitud será resuelta en los términos de la Ley 142 de 1994. Con la firma de este documento autorizo a Bioagricola del Llano S.A. E.S.P. BIC a realizar una visita al bien inmueble si fuese necesario. \
            Mediante el registro de mis datos personales autorizo a Bioagricola del Llano S.A. ESP. BIC para la recolección, almacenamiento, uso y circulación de los mismos para las siguientes finalidades: inscripción para solicitud \
            de crédito y financiación, iniciación, mantenimiento y recuperación de cartera, ofrecer servicios y campañas comerciales, ofertar servicios de valor agregado, participar en programas de beneficios y fidelización, consultar \
            hábitos de consumo y aficiones, promociones, contactarme para realizar estudios de mercado y encuestas de satisfacción, actualización de datos, gestionar trámites como solicitudes, peticiones, quejas, reclamos, recursos, \
            revocatorias y acciones de tutela, a través de medios como correos electrónicos, SMS, MMS, llamadas telefónicas, redes sociales, aplicaciones móviles, además de compartir mis datos con su matriz y empresas filiales, así \
            como empresas contratistas para efecto de cumplir con la prestación del servicio público de aseo y demás actividades relacionadas con el objeto social de la empresa, para la oferta de servicios en los términos de la \
            Política de tratamiento de datos personales de Bioagricola S.A. ESP. BIC, la cual podré consultar en la página web de la compañía. Como titular de mi información tengo derecho a conocer, actualizar y rectificar mis datos \
            personales, solicitar prueba de la autorización otorgada para su tratamiento, ser informado sobre el uso que se ha dado a los mismos, presentar quejas ante la SIC por infracción a la ley, revocar la autorización y/o \
            solicitar la supresión de mis datos en los casos en que sea procedente y acceder de forma gratuita a los mismos. De conformidad con lo dispuesto en la ley 1581 de 2012 y sus decretos reglamentarios y/o cualquiera que la \
            adicione o modifique o derogue, Bioagricola del Llano S.A. ESP. BIC dispone de los siguientes medios de atención: Sede administrativa ubicada en la Carrera 38 N° 26C - 95 Maizaro sur - Villavicencio/Meta, teléfono (608) \
            6819081, www.bioagricoladelllano.com.co y protecciondedatosbioagricola@grupodellano.com.\
            <br><br>\
            Con la firma de esta autorización entiendo y acepto el registro y uso de mis datos personales como se estipula anteriormente.\
        ";

        function extraerFacturas(){
            let rows = "";

            for (let i = 0; i < facturas.length; i++) {
                const factura = facturas[i];
                rows += "\
                    <tr>\
                        <td>" + factura.numerofactura + "</td>\
                        <td>" + factura.fechavencimiento === null ? "-" : factura.fechavencimiento + "</td>\
                        <td>" + factura.fechafactura + "</td>\
                        <td>" + "-" + "</td>\
                        <td>" + factura.periodo + "</td>\
                        <td>" + factura.interestotal + "</td>\
                        <td>" + factura.condonarinteres + "</td>\
                    </tr>\
                ";
            }
            return rows;
        }

        let tblFacturas = "\
            <table id='tblDiv' class='div-container tabla'>\
                <thead>\
                    <tr>\
                        <th scope='col'>NUM. FACTURA</th>\
                        <th scope='col'>F.V</th>\
                        <th scope='col'>FECHA FACTURA</th>\
                        <th scope='col'>SEGMENTO</th>\
                        <th scope='col'>PERIODO</th>\
                        <th scope='col'>VLR. TOTAL DE INTERES</th>\
                        <th scope='col'>VLR. A CONDONAR INTERES</th>\
                    </tr>\
                </thead>\
                <tbody>"
                +
                extraerFacturas();
                +
                "</tbody>\
            </table>\
        ";

        return {parrafo0,tblFacturas};
    },
};