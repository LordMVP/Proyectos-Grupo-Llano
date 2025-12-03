/**
 * @fileOverview Archivo de control de registro de ventas
 * @author Angélica Gómez
 * @requires registroventas.modelo.js
 * @version 1.0.0
 */

/** @namespace */

var registroVentasControl = {
    /**
     * Consulta los barrios de un municipio
     * @param  {object} data - Parámetros que se envían al servidor (idmunicipio)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor (registroVentasVista.onConsultarBarriosCompleto)
     * @returns {void}
     */
    consultarBarrios: function (data, completado) {
        __cnn.ajax({
            'url': '../../suscripcion/gestionar_suscripcion/barrios/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Muestra datos básicos de los terceros que coincidan
     * @param  {object} data - Los parámetros que se envían al servidor (nombre)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor (registroVentasVista.mostrarResultadoTercero)
     * @returns {void}
     */
    consultarTerceros: function (data, completado) {
        __cnn.ajax({
            'url': '../../operaciones/suspensiones/consultar_terceros',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Carga suscripciones que coincidan con los parámetros de búsquedas
     * @param  {object} data - Parámetros que se envían al servidor (idmunicipio,idtercero,cedula,direccion,
     * numerocatastral,idbarrio, numeropropiedad,idsuscripcion,codigoanterior,idsuscripcion)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor (registroVentasVista.onConsultarSuscripcionCompleto)
     * @returns {void}
     */
    consultarSuscripcion: function (data, completado) {
        __cnn.ajax({
            'url': 'suscripcion/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Carga información de las propiedades, suscripción y detalle de venta que coincidan 
     * con los parámetros de búsquedas.
     * @param  {object} data - Parámetros que se envían al servidor (estado,nombretercero
     * cedula, numeroventa, idepropiedad,idsuscripcion,fechainicio. fechafin)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor 
     * (financiarVista.onConsultarVentaCompleto)
     * @returns {void}
     */
    consultarVenta: function (data, completado) {
        __cnn.ajax({
            'url': '../buscar/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta las ventas que tiene una suscripción hasta el momento
     * @param {object} data - Información enviada al servidor (idsuscripcion)
     * @param {function} completado - FUnción callback
     * @returns {void}
     */
    consultarVentaSuscripcion: function (data, completado) {
        __cnn.ajax({
            'url': '../buscar/venta_suscripcion/',
            'data': data,
            'completado': completado
        });
    },
    
    /**
     * Muestra todos los datos de la susucripción que se haya elegido para buscar
     * @param  {object} data - Los parámetros que se envían al servidor (idsuscripcion)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor (registroVentasVista.onconsultarDetalleSuscripcionCompleto)
     * @returns {void}
     */
    consultarDetalleSuscripcion: function (data, completado) {
        __cnn.ajax({
            'url': '../../suscripcion/gestionar_suscripcion/detalle/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Muestra datos básicos de las firmas instaladoras que coincidan
     * @param  {object} data - Los parámetros que se envían al servidor (nombrefirmainstaladora)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor (registroVentasVista.mostrarResultado)
     * @returns {void}
     */
    consultarEmpresasInstaladora: function (data, completado) {
        __cnn.ajax({
            'url': '../firmasinstaldoras',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Muestra información de los funcionarios que pertenezcan a una empresa
     * @param  {object} data - Los parámetros que se envían al servidor (idfirmainstaladora)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor (registroVentasVista.consultarFuncionario)
     * @returns {void}
     */
    consultarFuncionarios: function (data, completado) {
        __cnn.ajax({
            'url': '../firmasinstaldoras/funcionarios/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Muestra información del funcionario con id específico
     * @param  {int} id - El número de id que se compara
     * @returns {object} funcionario - Objeto JSON con información del funcionario.
     */
    consultarFuncionariosPorId: function (id) {
        for (var i = 0; i < registroVentasModelo.funcionarios.length; i++) {
            var funcionario = registroVentasModelo.funcionarios[i];
            if (funcionario.cedulafuncionario == id) {
                return funcionario;
            }
        }
        ;
    },
    /**
     * Muestra datos básicos de los asesores que coincidan
     * @param  {object} data - Los parámetros que se envían al servidor (nombreasesor)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor (registroVentasVista.mostrarResultadoAsesor)
     * @returns {void}
     */
    consultarAsesores: function (data, completado) {
        __cnn.ajax({
            'url': 'asesores/',
            'data': data,
            'completado': completado
        });
    },
    consultarOrganismos: function (data, completado) {
        __cnn.ajax({
            'url': 'organismos/',
            'data': data,
            'completado': completado
        });
    },
    /** Consulta los tipos documentos por tipo de suscripción
     * @param  {object} data - Parámetros que se envían al servidor (idtipodocumento)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor (registroVentasVista.consultarDocumento)
     * @returns {void}
     */
    consultarTipoDocumento: function (data, completado) {
        __cnn.ajax({
            'url': 'tiposdocumentos/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta los documentos por tipo de documento
     * @param  {object} data - Parámetros que se envían al servidor (idtipodocumento)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor (registroVentasVista.consultarDocumento)
     * @returns {void}
     */
    consultarDocumento: function (data, completado) {
        __cnn.ajax({
            'url': 'documentos/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta las liquidaciones por suscripción y tipo documento
     * @param  {object} data - Parámetros que se envían al servidor (idsuscripcion, idtipodocumento)
     * @param  {function} completado - Función invocada cuando cargan datos desde servidor (registroVentasVista.consultarLiquidacionesCompleto)
     * @returns {void}
     */
    consultarLiquidacion: function (data, completado) {
        __cnn.ajax({
            'url': 'liquidaciones/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Consulta los conceptos por liquidaciones
     * @param  {object} data - Parámetros que se envían al servidor (liquidaciones)
     * @returns {void}
     */
    consultarConcepto: function (data, completado) {
        __cnn.ajax({
            'url': 'conceptos/',
            'data': data,
            'completado': completado
        });
    },
    /**
     * Muestra información de un concepto con id específico
     * @param  {int} id - El número de id que se compara
     * @returns {object} infoConcepto - Objeto JSON con información del concepto y posición en el arreglo de conceptos.
     */
    consultarConceptoPorId: function (id) {
        id = parseInt(id);
        for (var i = 0; i < registroVentasModelo.conceptos.length; i++) {
            var concepto = registroVentasModelo.conceptos[i];
            if (parseInt(concepto.idconcepto) === id) {
                return infoConcepto = {concepto: concepto, indice: i};
            }
        }
    },
    /**
     * Muestra información de una liquidación de una venta con id específico
     * @param  {int} id - El número de id que se compara
     * @returns {object} Objeto JSON con información de la liquidación
     */
    consultarLiquidacionVentaPorId: function (id) {
        id = parseInt(id);
        for (var i = 0; i < registroVentasModelo.venta.liquidaciones.length; i++) {
            var liq = registroVentasModelo.venta.liquidaciones[i];
            if (parseInt(liq.idliquidacion) === id) {
                return liq;
            }
        }
    },
    /**
     * Muestra información de un concepto liquidado con id específico
     * @param  {int} id - El número de id que se compara
     * @returns {object} infoConcepto - Objeto JSON con información del concepto y posición en el arreglo de conceptos.
     */
    consultarConceptoLiquidadoPorId: function (id) {
        id = parseInt(id);
        for (var i = 0; i < registroVentasModelo.conceptosLiquidados.length; i++) {
            var concepto = registroVentasModelo.conceptosLiquidados[i];
            if (parseInt(concepto.idconcepto) === id) {
                return infoConcepto = {concepto: concepto, indice: i};
            }
        }
    },
    /**
     * Muestra el índice de ubicación de un concepto en el arreglo de los conceptos eliminados
     * @param  {number} id -  Id del cocnepto que se está buscando
     * @returns {number}
     */
    consultarConceptoEliminadosPorId: function (id) {
        id = parseInt(id);
        for (var i = 0; i < registroVentasModelo.conceptosEliminados.length; i++) {
            var idconcepto = registroVentasModelo.conceptosEliminados[i];
            if (parseInt(idconcepto) === id) {
                return i;
            }
        }
    },
    /** 
     * Muestra información de un archivo con id específico
     * @param  {int} id - El número de id que se compara
     * @returns {object} infoConcepto - Objeto JSON con información del archivo y posición en el arreglo de archivos.
     */
    consultarArchivoPorId: function (id) {
        id = parseInt(id);
        for (var i = 0; i < registroVentasModelo.archivos.length; i++) {
            var archivo = registroVentasModelo.archivos[i];
            if (parseInt(archivo.idarchivo) === id) {
                return infoArchivo = {archivo: archivo, indice: i};
            }
        }
    },
    /**
     * Elimina un archivo que haya sido subido al servidor
     * @param  {int} data - id del archivo que se desea eliminar (idarchivo)
     * @param  {function} success - Función invocada cuando cargan datos desde servidor 
     (registroVentasVista.funcionanónima)
     * @returns {void}
     */
    eliminarArchivo: function (data, success) {
        __cnn.ajax({
            url: '../eliminar_adjunto/',
            data: data,
            completado: success
        });
    },
    /** Liquidar conceptos seleccionados
     * @param  {int} data - Parámetros que se envían al servidor (conceptos)
     * @param  {function} success - Función invocada cuando cargan datos desde servidor 
     (registroVentasVista.onLiquidarConceptoCompleto)
     * @returns {void}
     */
    liquidarConcepto: function (data, success) {
        __cnn.ajax({
            url: 'liquidar/',
            data: data,
            completado: success
        });
    },
    /** Elimina un concepto de las liquidaciones
     * @param  {int} data - Parámetros que se envían al servidor (idconcepto)
     * @param  {function} success - Función invocada cuando cargan datos desde servidor 
     (registroVentasVista.funcionanónima)
     * @returns {void}
     */
    eliminarConcepto: function (data, success) {
        __cnn.ajax({
            url: 'conceptos/validar/',
            data: data,
            completado: success
        });
    },
    /** Grabar la venta que se a digitado
     * @param  {int} data - Parámetros que se envían al servidor (numeroventa, idtipodocumento, iddocumento
     * observacion, metodopago, idcompetenciafirma, idsuscripcion, idasesor, idciclo, idperiodo, cicloanio, detalleventa)
     * @param  {function} success - Función invocada cuando cargan datos desde servidor 
     (registroVentasVista.onGrabarVentaCompleto)
     * @returns {void}
     */
    grabarVenta: function (data, success) {
        __cnn.ajax({
            url: 'registrar/',
            data: data,
            completado: success
        });
    },
    /** Graba los archivos de la venta 
     * @param  {int} data - Lista de identificador de archivos subidos 
     * @param  {function} success - Función invocada cuando cargan datos desde servidor 
     * @returns {void}
     */
    grabarArchivos: function (data, success) {
        __cnn.ajax({
            url: 'actualizar_adjuntos/',
            data: data,
            completado: success
        });
    },
    /** Exporta archivo de excel con la información de la venta cargada
     * @param  {object} data - Información de la venta cargada
     * @param  {function} success - Función invocada cuando cargan datos desde servidor 
     * @returns {void}
     */
    exportarAutorizacion: function (data, success) {
        __cnn.ajax({
            url: 'informacion_autorizacion/',
            data: data,
            completado: success
        });
    },
    /**
     * Consulta si un botón ya se a presionado y está grabado en el arreglo de botones
     * @param {string} nombre - Nombre del botón que se presiona
     * @returns {Boolean}
     */
    consultarBotonPorNombre: function(nombre){
        for(var j = 0; j < registroVentasModelo.botonesformatos.length; j++){
            var boton = registroVentasModelo.botonesformatos[j];
            if(boton.btn === nombre){
                return true;
            }
        }
    },
    /**
     * Consulta los conceptos que tiene asociados una financiación según el idfinanciacion
     * @param  {number} idfinanciacion - Id de la financiación que se está consultando
     * @returns {Array}
     */
    consultarConceptoFinanciacionPorId: function(idfinanciacion){
        var id = parseInt(idfinanciacion);
        for(var i = 0; i < registroVentasModelo.financiaciones.length; i++){
            var financiacion = registroVentasModelo.financiaciones[i];
            if(parseInt(financiacion.idventafinanciacion) === id){
                return financiacion.conceptos;
            }
        }
    },
    /**
     * Hace petición al servidor para consultar si la resolución vigente puede realizar la venta sin problemas
     * @param  {Object} - Parámetros para buscar la resolución (iddocumento)
     * @param  {Function} - Función que recibe la respuesta
     * @returns {void}
     */
    validarResolucionFacturacion: function(data, success){
        __cnn.ajax({
            url: 'validar_resolucion/',
            data: data,
            completado: success
        });
    },
    
    detallesCambioVentas: function(data, success){
        console.log(data);
        __cnn.ajax({
            url: 'detalles_cambioventas/',
            data: data,
            completado: success
        });
    },
    consultarPermisosGrabar: function (Data,completado){
         __cnn.ajax({
            url: '../firmasinstaladoras/consultapermisosgrabar/',
            data: Data,
            completado: completado
        });
    }
};