/**
 * @fileOverview Archivo de modelo para seguimiento de suscripción
 * @author angelicaGomez
 * @version 1.0.0
 */
/** @namespace */
var seguimientoModelo = {
    documentosNotas: []
};
/**
 * Formato para llenar la tabla de propiedades asignadas a una suscripción
 * @type {Object}
 */
var formatoPropiedadesAsignadas = {
    thead: [
        {'id': 'thTipoPropiedad', 'text': 'Tipo Propiedad', 'sort': false, 'refer': 'tipopropiedad', 'type': 'text'},
        {'id': 'thIdPropiedad', 'text': 'Id Propiedad', 'sort': false, 'refer': 'idpropiedad', 'type': 'text'},
        {'id': 'thMunicipio', 'text': 'Municipio', 'sort': false, 'refer': 'municipio', 'type': 'text'},
        {'id': 'thBarrio', 'text': 'Barrio', 'sort': false, 'refer': 'barrio', 'type': 'text'},
        {'id': 'thDireccion', 'text': 'Dirección', 'sort': false, 'refer': 'direccion', 'type': 'text'},
        {'id': 'thIdSuscripcion', 'text': 'Id Suscripción', 'sort': false, 'refer': 'idsuscripcion', 'type': 'text'},
        {'id': 'thCodigoAnterior', 'text': 'Código Anterior', 'sort': false, 'refer': 'codigoanterior', 'type': 'text'}
    ]
};
/**
 * Formato para llenar la tabla de facturas
 * @type {Object}
 */
var formatoFacturas = {
    thead: [
        {'id': 'thIdFactura', 'text': 'Cód. Factura', 'sort': false, 'refer': 'idfactura', 'type': 'text'},
        {'id': 'thNumFactura', 'text': 'Núm. Factura', 'sort': false, 'refer': 'numero', 'type': 'text'},
        {'id': 'thFechaEmisión', 'text': 'Emisión', 'sort': false, 'refer': 'fecha', 'type': 'function', 'tdCallback': 'seguimientoVista.validarFechaEmision'},
        {'id': 'thVencimiento', 'text': 'Fecha Venc.', 'sort': false, 'refer': 'fechavencimiento', 'type': 'text'},
        {'id': 'thSuspension', 'text': 'Fecha Susp', 'sort': false, 'refer': 'fechasuspension', 'type': 'text'},
        {'id': 'thIdSuscripcion', 'text': 'Cód. Suscripción', 'sort': false, 'refer': 'idsuscripcion', 'type': 'text'},
        {'id': 'thCiclo', 'text': 'Ciclo - Periodo', 'sort': false, 'refer': 'cicloperiodo', 'type': 'text'},
        {'id': 'thTipoDocumento', 'text': 'Tipo Documento', 'sort': false, 'refer': 'nombretipodocumento', 'type': 'text'},
        {'id': 'thValorTotal', 'text': 'Valor Total', 'sort': false, 'refer': 'valortotal', 'type': 'currency'},
        {'id': 'thValorPagado', 'text': 'Valor Pagado', 'sort': false, 'refer': 'valorpagadofactura', 'type': 'currency'},
        {'id': 'thSaldoFactura', 'text': 'Saldo', 'sort': false, 'refer': 'saldofactura', 'type': 'currency'},
        {'id': 'thDetalle', 'text': 'Conceptos', 'sort': false, 'refer': 'idfactura', 'type': 'button', 'style': {'width': '10%'}},
        {'id': 'thVerRecaudos', 'text': 'Ver recaudos', 'sort': false, 'refer': 'idfactura', valueField: 'numero', 'type': 'button', 'style': {'width': '10%'}}
    ]
};
/**
 * Formato para llenar la tabla de facturas (provisión, reclasificacion, castigo y recuperación)
 * @type {Object}
 */
var formatoFacturasP = {
    thead: [
        {'id': 'thTipFactura', 'text': 'Tip Factura', 'sort': false, 'refer': 'doc_nombre', 'type': 'text'},
        {'id': 'thIdFactura', 'text': 'Cód. Factura', 'sort': false, 'refer': 'idfactura', 'type': 'text'},
        {'id': 'thNumFactura', 'text': 'Núm. Factura', 'sort': false, 'refer': 'numero', 'type': 'text'},
        {'id': 'thFechaEmisión', 'text': 'Emisión', 'sort': false, 'refer': 'fecha', 'type': 'function', 'tdCallback': 'seguimientoVista.validarFechaEmision'},
        {'id': 'thCiclo', 'text': 'Ciclo - Periodo', 'sort': false, 'refer': 'cicloperiodo', 'type': 'text'},
        {'id': 'thValorTotal', 'text': 'Valor Total', 'sort': false, 'refer': 'valortotal', 'type': 'currency'},
        {'id': 'thValorPagado', 'text': 'Valor Pagado', 'sort': false, 'refer': 'valorpagadofactura', 'type': 'currency'},
        {'id': 'thSaldoFactura', 'text': 'Saldo', 'sort': false, 'refer': 'saldofactura', 'type': 'currency'},
        {'id': 'thFacPadre', 'text': 'Factura Padre', 'sort': false, 'refer': 'facturapadre', 'type': 'text'},
        {'id': 'thVlrFacPadre', 'text': 'Vlr Fac Padre', 'sort': false, 'refer': 'totalfacpadre', 'type': 'currency'},
        {'id': 'thDetalle', 'text': 'Conceptos', 'sort': false, 'refer': 'idfactura', 'type': 'button', 'style': {'width': '10%'}},
        {'id': 'thVerRecaudos', 'text': 'Ver recaudos', 'sort': false, 'refer': 'idfactura', valueField: 'numero', 'type': 'button', 'style': {'width': '10%'}}
    ]
};
/**
 * Formato para llenar la tabla de conceptos
 * @type {Object}
 */
var formatoConceptos = {
    thead: [
        {'id': 'thIdFactura', 'text': 'Cód. Factura', 'sort': false, 'refer': 'idfactura', 'type': 'text'},
        {'id': 'thCodConcepto', 'text': 'Cod. Concepto', 'sort': false, 'refer': 'idconcepto', 'type': 'text'},
        {'id': 'thDescripcion', 'text': 'Descripción', 'sort': false, 'refer': 'concepto', 'type': 'text'},
        {'id': 'thValorCanceado', 'text': 'Valor Liquidado', 'sort': false, 'refer': 'valortotal', 'type': 'function', 'tdCallback':'vista.validarConceptoPorTipo'},
        {'id': 'thValorCanceado', 'text': 'Valor a Pagar', 'sort': false, 'refer': 'valorreal', 'type': 'function', 'tdCallback':'vista.validarConceptoPorTipo'},
        {'id': 'thValorTotal', 'text': 'Valor Pagado', 'sort': false, 'refer': 'valorpagado', 'type': 'function', 'tdCallback':'vista.validarConceptoPorTipo'},
        {'id': 'thSaldo', 'text': 'Saldo', 'sort': false, 'refer': 'saldo', 'type': 'function', 'tdCallback':'vista.validarConceptoPorTipo'}
    ]
};
/**
 * Formato para llenar la tabla de conceptos
 * @type {Object}
 */
var formatoDetalleNota = {
    thead: [
        {'id': 'thIdFactura', 'text': 'Cód. Factura', 'sort': false, 'refer': 'idfactura', 'type': 'text'},
        {'id': 'thCodConcepto', 'text': 'Cod. Concepto', 'sort': false, 'refer': 'idconcepto', 'type': 'text'},
        {'id': 'thDescripcion', 'text': 'Descripción', 'sort': false, 'refer': 'concepto', 'type': 'text'},
        {'id': 'thValorLiquidado', 'text': 'Valor Liquidado', 'sort': false, 'refer': 'valorliquidado', 'type': 'function', 'tdCallback':'vista.validarConceptoPorTipo'},
        {'id': 'thValorPagado', 'text': 'Valor Pagado', 'sort': false, 'refer': 'valorpagado', 'type': 'function', 'tdCallback':'vista.validarConceptoPorTipo'},
        {'id': 'thValorNota', 'text': 'Valor Nota', 'sort': false, 'refer': 'valornota', 'type': 'function', 'tdCallback':'vista.validarConceptoPorTipo'},
        {'id': 'thSaldo', 'text': 'Saldo', 'sort': false, 'refer': 'saldo', 'type': 'function', 'tdCallback':'vista.validarConceptoPorTipo'},
        {'id': 'thNotaSaldoFavor', 'text': 'Nota Saldo Favor', 'sort': false, 'refer': 'notasaldofavor', 'type': 'function', 'tdCallback':'vista.validarConceptoPorTipo'}
    ]
};

/**
 * Formato para llenar la tabla de conceptos
 * @type {Object}
 */
var formatoDetalleRecaudo = {
    thead: [
        {'id': 'thIdRecaudo', 'text': 'Id. recaudo', 'sort': false, 'refer': 'iddetallerecaudo', 'type': 'text'},
        {'id': 'thFactura', 'text': 'Id. factura', 'sort': false, 'refer': 'idfactura', 'type': 'text'},
        {'id': 'thDocumento', 'text': 'Documento', 'sort': false, 'refer': 'documento', 'type': 'text'},
        {'id': 'thTipoDocumento', 'text': 'Tipo documento', 'sort': false, 'refer': 'tipodocumento', 'type': 'text'},
        {'id': 'thFecha', 'text': 'Fecha', 'sort': false, 'refer': 'fecha', 'type': 'function', 'tdCallback': 'seguimientoVista.validarFechaCompleta'},
        {'id': 'thValorTotal', 'text': 'Vlr. Total', 'sort': false, 'refer': 'valortotal', 'type': 'currency'},
        {'id': 'thValorreal', 'text': 'Vlr. Real', 'sort': false, 'refer': 'valorreal', 'type': 'currency'},
        {'id': 'thCicloPeriodo', 'text': 'Ciclo- periodo', 'sort': false, 'refer': 'cicloperiodo', 'type': 'text'},
    ]
};

/**
 * Formato para llenar la tabla de recaudos que afectados por una factura
 * @type {Object}
 */
var formatoRecaudoFactura = {
    thead: [
        {'id': 'thIdFactura', 'text': 'Id. factura', 'sort': false, 'refer': 'idfactura', 'type': 'text'},
        {'id': 'thNumFactura', 'text': 'Núm. factura', 'sort': false, 'refer': 'numero', 'type': 'text'},
        {'id': 'thIdRecaudo', 'text': 'Id. recaudo', 'sort': false, 'refer': 'idrecaudo', 'type': 'text'},
        {'id': 'thFechaRegistro', 'text': 'Fecha registro', 'sort': false, 'refer': 'fecharegistro', 'type': 'function', 'tdCallback': 'seguimientoVista.validarFechaCompleta'},
        {'id': 'thFechaAplicado', 'text': 'Fecha aplicado', 'sort': false, 'refer': 'fechaaplicado', 'type': 'function', 'tdCallback': 'seguimientoVista.validarFechaCompleta'},
        {'id': 'thFechaPago', 'text': 'Fecha pago', 'sort': false, 'refer': 'fechapago', 'type': 'function', 'tdCallback': 'seguimientoVista.validarFechaCompleta'},
        {'id': 'thValorPago', 'text': 'Valor pagado', 'sort': false, 'refer': 'valorpagadofactura', 'type': 'currency'},
        {'id': 'thSucursal', 'text': 'Sucursal', 'sort': false, 'refer': 'sucursal', 'type': 'text'},
        {'id': 'thMedioPago', 'text': 'Medio pago', 'sort': false, 'refer': 'mediopago', 'type': 'text'},
        {'id': 'thClasePago', 'text': 'Clase pago', 'sort': false, 'refer': 'clasepago', 'type': 'text'},
        {'id': 'thUsuario', 'text': 'Usuario registro', 'sort': false, 'refer': 'usuario', 'type': 'text'}

    ]
};
/**
 * Formato para llenar la tabla de recaudos
 * @type {Object}
 */
var formatoRecaudo = {
    thead: [
        {'id': 'thIdRecaudo', 'text': 'Id Recaudo', 'sort': false, 'refer': 'idrecaudo', 'type': 'text'},
        {'id': 'thFechaRegistro', 'text': 'Fecha registro', 'sort': false, 'refer': 'fecharegistro', 'type': 'function', 'tdCallback': 'seguimientoVista.validarFechaCompleta'},
        {'id': 'thFechaPago', 'text': 'Fecha pago', 'sort': false, 'refer': 'fechapago', 'type': 'function', 'tdCallback': 'seguimientoVista.validarFechaCompleta'},
        {'id': 'thValorPago', 'text': 'Valor Total', 'sort': false, 'refer': 'valortotalrecaudo', 'type': 'currency'},
        {'id': 'thSucursal', 'text': 'Sucursal', 'sort': false, 'refer': 'sucursal', 'type': 'text'},
        {'id': 'thMedioPago', 'text': 'Medio pago', 'sort': false, 'refer': 'mediopago', 'type': 'text'},
        {'id': 'thClasePago', 'text': 'Clase pago', 'sort': false, 'refer': 'clasepago', 'type': 'text'},
        {'id': 'thNombreTipoDocumento', 'text': 'Tipo documento', 'sort': false, 'refer': 'tidonombre', 'type': 'text'},
        {'id': 'thNombreDocumento', 'text': 'Documento', 'sort': false, 'refer': 'docnombre', 'type': 'text'},
        {'id': 'thNombreConcepto', 'text': 'Concepto', 'sort': false, 'refer': 'nombreconcepto', 'type': 'text'},
        {'id': 'thUsuario', 'text': 'Usuario registro', 'sort': false, 'refer': 'usuario', 'type': 'text'},
        {'id': 'thValorPago', 'text': 'Valor disponible ', 'sort': false, 'refer': 'valordisponible', 'type': 'currency'},
        {'id': 'thDetalle', 'text': 'Ver detalles', 'sort': false, 'refer': 'idrecaudo', 'type': 'button', 'style': {'width': '10%'}}
    ]
};
/**
 * Formato para llenar la tabla de facturas que afectan un recaudo
 * @type {Object}
 */
var formatoFacturaRecaudo = {
    thead: [
        {'id': 'thEmpresa', 'text': 'Empresa', 'sort': false, 'refer': 'empresa', 'type': 'text'},
        {'id': 'thFecha', 'text': 'Fecha', 'sort': false, 'refer': 'fecha', 'type': 'function', 'tdCallback': 'seguimientoVista.validarFechaCompleta'},
        {'id': 'thFechaAplicado', 'text': 'Fecha Aplicado', 'sort': false, 'refer': 'fechaaplicado', 'type': 'function', 'tdCallback': 'seguimientoVista.validarFechaCompleta'},
        {'id': 'thNumFactura', 'text': 'Núm. Factura', 'sort': false, 'refer': 'numero', 'type': 'text'},
        {'id': 'thCiclo', 'text': 'Ciclo - Periodo', 'sort': false, 'refer': 'cicloperiodo', 'type': 'text'},
        {'id': 'thValorTotal', 'text': 'Valor Total', 'sort': false, 'refer': 'valortotal', 'type': 'currency'},
        {'id': 'thValorPagado', 'text': 'Valor Pagado', 'sort': false, 'refer': 'valorpagado', 'type': 'currency'},
        {'id': 'thSaldo', 'text': 'Saldo', 'sort': false, 'refer': 'saldo', 'type': 'currency'},
        {'id': 'thLiquidacion', 'text': 'Liquidación', 'sort': false, 'refer': 'liquidacion', 'type': 'text'},
        {'id': 'thDocumento', 'text': 'Documento', 'sort': false, 'refer': 'documento', 'type': 'text'},
        {'id': 'thTipoDocumento', 'text': 'Tipo documento', 'sort': false, 'refer': 'tipodocumento', 'type': 'text'},
        {'id': 'thConcepto', 'text': 'Concepto', 'sort': false, 'refer': 'idfactura', 'type': 'button', 'style': {'width': '10%'}}
    ]
};

/**
 * Formato para llenar la tabla de financiaciones de una suscripción
 * @type {Object}
 */
var formatoFinanciacion = {
    thead: [
        {'id': 'thFinanciacion', 'text': 'Financiación', 'sort': false, 'refer': 'idfinanciacion', 'type': 'text'},
        {'id': 'thFecha', 'text': 'Fecha', 'sort': false, 'refer': 'fecha', 'type': 'function', 'tdCallback': 'seguimientoVista.validarFechaCompleta'},
        {'id': 'thBanco', 'text': 'Banco', 'sort': false, 'refer': 'banco', 'type': 'text'},
        {'id': 'thSolicitante', 'text': 'Solicitante', 'sort': false, 'refer': 'nombresolicitante', 'type': 'text'},
        {'id': 'thLiquidacion', 'text': 'Liquidación', 'sort': false, 'refer': 'liquidacion', 'type': 'text'},
        {'id': 'thDocumento', 'text': 'Documento', 'sort': false, 'refer': 'documento', 'type': 'text'},
        {'id': 'thTipoDocumento', 'text': 'Tipo documento', 'sort': false, 'refer': 'tipodocumento', 'type': 'text'},
        {'id': 'thCapitalInicial', 'text': 'Capital inicial ', 'sort': false, 'refer': 'capitalinicial', 'type': 'currency'},
        {'id': 'thSaldoCapital', 'text': 'Saldo capital', 'sort': false, 'refer': 'saldocapital', 'type': 'currency'},
        {'id': 'thNumeroCuotas', 'text': 'Núm. cuotas', 'sort': false, 'refer': 'numerocuotas', 'type': 'text'},
        {'id': 'thCuotasPendientes', 'text': 'Cuotas pendientes', 'sort': false, 'refer': 'cuotaspendiente', 'type': 'text'},
        {'id': 'thFactura', 'text': 'Ver factura', 'sort': false, 'refer': 'idfinanciacion', 'type': 'button', 'style': {'width': '10%'}},
        {'id': 'thAmortizaciones', 'text': 'Ver amortización', 'sort': false, 'refer': 'idfinanciacion', 'type': 'button', 'style': {'width': '10%'}}
    ]
};

/**
 * Formato para llenar la tabla de amortizaión de una financiación
 * @type {Object}
 */
var formatoAmortizacion = {
    thead: [
        {'id': 'thEmpresa', 'text': 'Empresa', 'sort': false, 'refer': 'empresa', 'type': 'text'},
        {'id': 'thFecha', 'text': 'Fecha', 'sort': false, 'refer': 'fecha', 'type': 'text'},
        {'id': 'thNumFactura', 'text': 'Núm. Factura', 'sort': false, 'refer': 'numerofactura', 'type': 'text'},
        {'id': 'thCiclo', 'text': 'Ciclo - Periodo', 'sort': false, 'refer': 'cicloperiodo', 'type': 'text'},
        {'id': 'thValorTotal', 'text': 'Valor Total', 'sort': false, 'refer': 'valortotal', 'type': 'currency'},
        {'id': 'thValorPagado', 'text': 'Valor Pagado', 'sort': false, 'refer': 'valorpagado', 'type': 'currency'},
        {'id': 'thSaldo', 'text': 'Saldo', 'sort': false, 'refer': 'saldo', 'type': 'currency'},
        {'id': 'thLiquidacion', 'text': 'Liquidación', 'sort': false, 'refer': 'liquidacion', 'type': 'text'},
        {'id': 'thDocumento', 'text': 'Documento', 'sort': false, 'refer': 'documento', 'type': 'text'},
        {'id': 'thTipoDocumento', 'text': 'Tipo documento', 'sort': false, 'refer': 'tipodocumento', 'type': 'text'}
    ]
};
/**
 * Formato para llenar la tabla de cartera
 * @type {Object}
 */
 var formatoCartera = {
    thead: [
        {'id': 'thFecha', 'text': 'Fecha', 'sort': false, 'refer': 'fecha', 'type': 'text'},
        {'id': 'thFechaVencimiento', 'text': 'Fecha Vencimiento', 'sort': false, 'refer': 'fechavencimiento', 'type': 'text'},
        {'id': 'thNumFactura', 'text': 'Núm. Factura', 'sort': false, 'refer': 'numerofactura', 'type': 'text'},
        {'id': 'thCiclo', 'text': 'Ciclo - Periodo', 'sort': false, 'refer': 'cicloperiodo', 'type': 'text'},
        {'id': 'thValorTotal', 'text': 'Valor total', 'sort': false, 'refer': 'valortotal', 'type': 'currency'},
        {'id': 'thValorPagado', 'text': 'Valor pagado', 'sort': false, 'refer': 'valorpagado', 'type': 'currency'},
        {'id': 'thSaldo', 'text': 'Saldo', 'sort': false, 'refer': 'saldo', 'type': 'currency'},
        {'id': 'thLiquidacion', 'text': 'Liquidación', 'sort': false, 'refer': 'liquidacion', 'type': 'text'},
        {'id': 'thDocumento', 'text': 'Documento', 'sort': false, 'refer': 'documento', 'type': 'text'},
        {'id': 'thTipoDocumento', 'text': 'Tipo documento', 'sort': false, 'refer': 'tipodocumento', 'type': 'text'},
        {'id': 'thEdadCartera', 'text': 'Edad cartera', 'sort': false, 'refer': 'edadcartera', 'type': 'text'},
        {'id': 'thConcepto', 'text': 'Concepto', 'sort': false, 'refer': 'idfactura', 'type': 'button', 'style': {'width': '10%'}}
    ]
};  


/**
 * Formato para llenar las tablas de notas de factura y/o recaudo
 * @type {Object}
 */
var formatoNotaFactura = {
    thead: [
        {'id': 'thIdNota', 'text': 'Id. Nota', 'sort': false, 'refer': 'not_ideregistro', 'type': 'text'},
        {'id': 'thNota', 'text': 'Nota', 'sort': false, 'refer': 'not_comentario', 'type': 'text'},
        {'id': 'thFactura', 'text': 'Factura', 'sort': false, 'refer': 'fac_ideregistro', 'type': 'text'},
        {'id': 'thFacturaNumero', 'text': 'Factura Número', 'sort': false, 'refer': 'numerofactura', 'type': 'text'},
        {'id': 'thValor', 'text': 'Valor', 'sort': false, 'refer': 'valornota', 'type': 'currency'},
        {'id': 'thFecha', 'text': 'Fecha', 'sort': false, 'refer': 'fac_fecha', 'type': 'function', 'tdCallback': 'seguimientoVista.validarFechaCompleta'},
        {'id': 'thUsuario', 'text': 'Usuario registro', 'sort': false, 'refer': 'usuarioregistro', 'type': 'text'},
        {'id': 'thCiclo', 'text': 'Ciclo - Periodo', 'sort': false, 'refer': 'cicloperiodo', 'type': 'text'},
        {'id': 'thDocumento', 'text': 'Documento', 'sort': false, 'refer': 'documento', 'type': 'text', 'valueField': 'iddocumento'},
        {'id': 'thTipoDocumento', 'text': 'Tipo documento', 'sort': false, 'refer': 'tipodocumento', 'type': 'text'},
        {'id': 'thDetalle', 'text': 'Detalles', 'sort': false, 'refer': 'fac_ideregistro', 'type': 'button', 'style': {'width': '10%'}}
    ]
};

/**
 * Formato para llenar las tablas de notas de factura y/o recaudo
 * @type {Object}
 */
var formatoNotaRecaudo = {
    thead: [
        {'id': 'thIdNota', 'text': 'Id. Nota', 'sort': false, 'refer': 'not_ideregistro', 'type': 'text'},
        {'id': 'thNota', 'text': 'Motivo', 'sort': false, 'refer': 'motivo', 'type': 'text'},
        {'id': 'thRecaudo', 'text': 'Recaudo', 'sort': false, 'refer': 'idrecaudo', 'type': 'text'},
        {'id': 'thValor', 'text': 'Valor', 'sort': false, 'refer': 'valornota', 'type': 'currency'},
        {'id': 'thFecha', 'text': 'Fecha', 'sort': false, 'refer': 'rec_fecha', 'type': 'function', 'tdCallback': 'seguimientoVista.validarFechaCompleta'},
        {'id': 'thUsuario', 'text': 'Usuario registro', 'sort': false, 'refer': 'usuarioregistro', 'type': 'text'},
        {'id': 'thCiclo', 'text': 'Ciclo - Periodo', 'sort': false, 'refer': 'cicloperiodo', 'type': 'text'},
        {'id': 'thDocumento', 'text': 'Documento', 'sort': false, 'refer': 'documento', 'type': 'text', 'valueField': 'iddocumento'},
        {'id': 'thTipoDocumento', 'text': 'Tipo documento', 'sort': false, 'refer': 'tipodocumento', 'type': 'text'},
        {'id': 'thDetalle', 'text': 'Detalles', 'sort': false, 'refer': 'idrecaudo', 'type': 'button', 'style': {'width': '10%'}}
    ]
};
/**
 * Formato para llenar la tabla de lecturas / consumo
 * @type {Object}
 */
var formatoLectura = {
    thead: [
        {'id': 'thLecturaEstado', 'text': 'Lectura Estado', 'sort': false, 'refer': 'lecturaestado', 'type': 'text'},
        {'id': 'thFecha', 'text': 'Fecha', 'sort': false, 'refer': 'fecha', 'type': 'function', 'tdCallback': 'seguimientoVista.validarFechaCompleta'},
        {'id': 'thLecturaAnterior', 'text': 'Lectura Anterior', 'sort': false, 'refer': 'lecturaanterior', 'type': 'text'},
        {'id': 'thLecturaActual', 'text': 'Lectura Actual', 'sort': false, 'refer': 'lecturaactual', 'type': 'text'},
        {'id': 'thConsumo', 'text': 'Consumo', 'sort': false, 'refer': 'consumo', 'type': 'text'},
        {'id': 'thObservaciones', 'text': 'Observaciones', 'sort': false, 'refer': 'observacion', 'type': 'text'},
        {'id': 'thVer', 'text': 'Ver', 'sort': false, 'refer': 'idlectura', 'type': 'button', 'style': {'width': '10%'}},
        {'id': 'thDetalle', 'text': 'Detalle', 'sort': false, 'refer': 'idlectura', 'type': 'button', 'style': {'width': '10%'}}
    ]
};
/**
 * Formato para llenar la tabla de detalles de consumo
 * @type {Object}
 */
var formatoDetalleConsumo = {
    thead: [
        {'id': 'thMedidor', 'text': 'Medidor', 'sort': false, 'refer': 'numeromedidor', 'type': 'text'},
        {'id': 'thFechaA', 'text': 'Fecha Aprobación', 'sort': false, 'refer': 'fechaaprobacion', 'type': 'function', 'tdCallback': 'seguimientoVista.validarFechaCompleta'},
        {'id': 'thLecturaAnterior', 'text': 'Lectura Anterior', 'sort': false, 'refer': 'lecturaanterior', 'type': 'text'},
        {'id': 'thLecturaActual', 'text': 'Lectura Actual', 'sort': false, 'refer': 'lecactual', 'type': 'text'},
        {'id': 'thConsumo', 'text': 'Consumo', 'sort': false, 'refer': 'lecturaconsumo', 'type': 'text'},
        {'id': 'thPromedioConsumo', 'text': 'Promedio de Consumo', 'sort': false, 'refer': 'consumopromedio', 'type': 'text'},
        {'id': 'thCiclo', 'text': 'Ciclo - Periodo', 'sort': false, 'refer': 'cicloperiodo', 'type': 'text'},
        {'id': 'thEmpresa', 'text': 'Empresa', 'sort': false, 'refer': 'empresa', 'type': 'text'},
        {'id': 'thFactor', 'text': 'Factor', 'sort': false, 'refer': 'factor', 'type': 'text'},
        {'id': 'thObservaciones', 'text': 'Observaciones', 'sort': false, 'refer': 'observacion', 'type': 'text'}
    ]
};
/**
 * Formato para llenar la tabla de detalles de una lectura
 * @type {Object}
 */
var formatoDetalleLectura ={
    thead: [
        {'id': 'thEstado', 'text': 'Estado', 'sort': false, 'refer': 'estado', 'type': 'text'},
        {'id': 'thFechaA', 'text': 'Fecha Aprobación', 'sort': false, 'refer': 'fechaaprobacion','type': 'function', 'tdCallback': 'seguimientoVista.validarFechaCompleta'},
        {'id': 'thFechaP', 'text': 'Fecha Programación', 'sort': false, 'refer': 'fechaprogramacion', 'type': 'function', 'tdCallback': 'seguimientoVista.validarFechaCompleta'},
        {'id': 'thLectura', 'text': 'Lectura Actual', 'sort': false, 'refer': 'lecturaactual', 'type': 'text'},
        {'id': 'thLecturaReal', 'text': 'Lectura Real', 'sort': false, 'refer': 'lecturareal', 'type': 'text'},
        {'id': 'thConsumo', 'text': 'Consumo', 'sort': false, 'refer': 'consumo', 'type': 'text'},
        {'id': 'thEjecutor', 'text': 'Ejecutor', 'sort': false, 'refer': 'ejecutor', 'type': 'text'},
        {'id': 'thAnterior', 'text': 'Anterior', 'sort': false, 'refer': 'anterior', 'type': 'text'},
        {'id': 'thEmpresa', 'text': 'Empresa que Reconecta', 'sort': false, 'refer': 'nombreempresa', 'type': 'text'},
        {'id': 'thRealizada', 'text': 'Realizada', 'sort': false, 'refer': 'realizada', 'type': 'text'},
        {'id': 'thNovedad', 'text': 'Novedad', 'sort': false, 'refer': 'novedad', 'type': 'text'},
        {'id': 'thObservacion', 'text': 'Observación', 'sort': false, 'refer': 'observacion', 'type': 'text'},
        {'id': 'thAutor', 'text': 'Autor', 'sort': false, 'refer': 'autor', 'type': 'text'}
    ]
};
/**
 * Formato para llenar la tabla de encabezado de suspesiones / reconexiones
 * @type {Object}
 */
var formatoEncabezado ={
    thead: [
        {'id': 'thEstado', 'text': 'Estado', 'sort': false, 'refer': 'estado', 'type': 'text'},
        {'id': 'thCiclo', 'text': 'Ciclo - Periodo', 'sort': false, 'refer': 'cicloperiodo', 'type': 'text'},
        {'id': 'thFechaG', 'text': 'Fecha Generación', 'sort': false, 'refer': 'fechageneracion', 'type': 'text'},
        {'id': 'thFechaA', 'text': 'Fecha Aprobación', 'sort': false, 'refer': 'fechaaprobacion', 'type': 'text'},
        {'id': 'thFechaP', 'text': 'Fecha Procesado', 'sort': false, 'refer': 'fechaprocesado', 'type': 'text'},
        {'id': 'thObservacion', 'text': 'Observación', 'sort': false, 'refer': 'observacion', 'type': 'text'},
        {'id': 'thVer', 'text': 'Ver', 'sort': false, 'refer': 'idsuspensionreconexion', 'type': 'button', 'style': {'width': '10%'}}
    ]
};

/**
 * Formato para llenar la tabla de suspensiones de una suscripción
 * @type {Object}
 */
var formatoSuspension ={
    thead: [
        {'id': 'thEstado', 'text': 'Estado', 'sort': false, 'refer': 'estado', 'type': 'text'},
        {'id': 'thMotivo', 'text': 'Motivo', 'sort': false, 'refer': 'motivo', 'type': 'text'},
        {'id': 'thNovedad', 'text': 'Novedad', 'sort': false, 'refer': 'novedad', 'type': 'text'},
        {'id': 'thFechaA', 'text': 'Fecha Aprobación', 'sort': false, 'refer': 'fechaaprobacion', 'type': 'text'},
        {'id': 'thFechaE', 'text': 'Fecha Ejecución', 'sort': false, 'refer': 'fechaejecucion', 'type': 'text'},
        {'id': 'thEmpresa', 'text': 'Empresa que Suspende', 'sort': false, 'refer': 'empresasuspende', 'type': 'text'},
        {'id': 'thLectura', 'text': 'Lectura', 'sort': false, 'refer': 'lectura', 'type': 'text'},
        {'id': 'thObservacion', 'text': 'Observación', 'sort': false, 'refer': 'observacion', 'type': 'text'},
        {'id': 'thValor', 'text': 'Valor total', 'sort': false, 'refer': 'vlrtotal', 'type': 'text'},
        {'id': 'thPdf', 'text': 'Pdf', 'sort': false, 'refer': 'href', 'type': 'href'}    
    ]
};
/**
 * Formato para llenar la tabla de reconexiones de una suscripción
 * @type {Object}
 */
var formatoReconexion ={
    thead: [
        {'id': 'thEstado', 'text': 'Estado', 'sort': false, 'refer': 'estado', 'type': 'text'},
        {'id': 'thMotivo', 'text': 'Motivo', 'sort': false, 'refer': 'motivorx', 'type': 'text'},
        {'id': 'thNovedad', 'text': 'Novedad', 'sort': false, 'refer': 'novedad', 'type': 'text'},
        {'id': 'thFechaA', 'text': 'Fecha Aprobación', 'sort': false, 'refer': 'fechaaprobacion', 'type': 'text'},
        {'id': 'thFechaE', 'text': 'Fecha Ejecución', 'sort': false, 'refer': 'fechaejecucion', 'type': 'text'},
        {'id': 'thFechaP', 'text': 'Fecha Programación', 'sort': false, 'refer': 'fechaprogramacion', 'type': 'text'},
        {'id': 'thEmpresa', 'text': 'Empresa que Reconecta', 'sort': false, 'refer': 'empresareconexion', 'type': 'text'},
        {'id': 'thLectura', 'text': 'Lectura', 'sort': false, 'refer': 'lectura', 'type': 'text'},
        {'id': 'thValor', 'text': 'Valor total', 'sort': false, 'refer': 'valortotal', 'type': 'text'},
        {'id': 'thObservacion', 'text': 'Observación', 'sort': false, 'refer': 'observacion', 'type': 'text'},
        {'id': 'thPdf', 'text': 'Pdf', 'sort': false, 'refer': 'href', 'type': 'href'}
    ]
};


/**
 * Formato para llenar la tabla de encabezado de seguimientos de certificación TECHSOFT
 * @type {Object}
 */
var formatoSeguimiento ={
    thead: [
        {'id': 'thFecha', 'text': 'Fecha Certificación', 'refer': 'fechacertificacion', 'type': 'text'},
        {'id': 'thFechaProxima', 'text': 'Fecha Próxima Certificación', 'refer': 'fechaproximacertificacion', 'type': 'text'},
        {'id': 'thNumeroActa', 'text': 'Número Acta', 'refer': 'numeroacta', 'type': 'text'},
        {'id': 'thLinea', 'text': 'Linea Pertenece  ', 'refer': 'linea_pertence', 'type': 'text'},
        {'id': 'thEnteCertificador', 'text': 'Ente Certificador', 'refer': 'ente_certificador', 'type': 'text'}
    ]
};

/**
 * Formato para llenar la tabla de encabezado de PQR
 * @type {Object}
 */
var formatoPQR ={
    thead: [
        {'id': 'thNumero', 'text': 'Número PQR', 'refer': 'numeropqr', 'type': 'text'},
        {'id': 'thFechaSolicitud', 'text': 'Fecha Solicitud', 'refer': 'fechasolicitud', 'type': 'text'},
        {'id': 'thEstado', 'text': 'Estado', 'refer': 'estado', 'type': 'text'},
        {'id': 'thPretencion', 'text': 'Observación', 'refer': 'pretencion', 'type': 'text'}
    ]
};


/**
 * Formato que llena la tabla de tarifas
 * @type {Objetc}
 */

var formatoTarifas = {
    thead:[
        {'id': 'thIdFactura', 'text': 'Cód. Factura', 'sort': false, 'refer': 'idfactura', 'type': 'text'},
        {'id': 'thTipoUso', 'text': 'Tipo Uso', 'sort': false, 'refer': 'tipouso', 'type': 'text'},
        {'id': 'thMesAno', 'text': 'Mes Año', 'sort': false, 'refer': 'mesano', 'type': 'text'},
        {'id': 'thMtrConsumo', 'text': 'Mtr Consumo', 'sort': false, 'refer': 'mtrconsumo', 'type': 'text'},
        {'id': 'thEstrato', 'text': 'Estrato', 'sort': false, 'refer': 'estrato', 'type': 'text'},
        {'id': 'thVlrtotalSinoOpcion', 'text': 'Vlr Total Sin Opción', 'sort': false, 'refer': 'vlrtotalsinopcion', 'type': 'text'},
        {'id': 'thVlrtotalConOpcion', 'text': 'Vlr Total Con Opción', 'sort': false, 'refer': 'vlrtotalconopcion', 'type': 'text'},
        {'id': 'thvlraplicafactura', 'text': 'Vlr Aplica Factura', 'sort': false, 'refer': 'vlraplicafactura', 'type': 'text'},
        {'id': 'thPagoRetroactivo', 'text': 'Pago Retroactivo', 'sort': false, 'refer': 'pagoretroactivo', 'type': 'text'},
        {'id': 'thVlrAplicaDiferido', 'text': 'Vlr Aplica Diferido', 'sort': false, 'refer': 'vlraplicadiferido', 'type': 'text'},
        {'id': 'thInteresCausado', 'text': 'Interes Causado', 'sort': false, 'refer': 'interescausado', 'type': 'text'},
        {'id': 'thSaldoMes', 'text': 'Saldo Mes', 'sort': false, 'refer': 'saldomes', 'type': 'text'},
        {'id': 'thSaldoAcumulado', 'text': 'Saldo Acumulado', 'sort': false, 'refer': 'saldoacumulado', 'type': 'text'},
        {'id': 'thSaldoFavor', 'text': 'Saldo Favor', 'sort': false, 'refer': 'saldofavor', 'type': 'text'},
        {'id':'thDetallesTarifas', 'text':'Detalles', 'sort':false, 'type':'button','refer': 'idfactura' ,'valueField':'idfactura', 'style':{'width':'10%'}}
    ]
};

/**
 * Formato para llenar la tabla de conceptos
 * @type {Object}
 */
var formatoAllConceptos = {
    thead: [
        {'id': 'thIdFactura', 'text': 'Cód. Factura', 'sort': false, 'refer': 'idfactura', 'type': 'text'},
        {'id': 'thCodConcepto', 'text': 'Cod. Concepto', 'sort': false, 'refer': 'idconcepto', 'type': 'text'},
        {'id': 'thDescripcion', 'text': 'Descripción', 'sort': false, 'refer': 'concepto', 'type': 'text'},
        {'id': 'thValorCanceado', 'text': 'Valor Liquidado', 'sort': false, 'refer': 'valortotal', 'type': 'function', 'tdCallback':'vista.validarConceptoPorTipo'},
        {'id': 'thValorCanceado', 'text': 'Valor a Pagar', 'sort': false, 'refer': 'valorreal', 'type': 'function', 'tdCallback':'vista.validarConceptoPorTipo'},
        {'id': 'thValorTotal', 'text': 'Valor Pagado', 'sort': false, 'refer': 'valorpagado', 'type': 'function', 'tdCallback':'vista.validarConceptoPorTipo'},
        {'id': 'thSaldo', 'text': 'Saldo', 'sort': false, 'refer': 'saldo', 'type': 'function', 'tdCallback':'vista.validarConceptoPorTipo'}
    ]
};



/**
 * Formato que llena la tabla de tarifas
 * @type {Objetc}
 */

var formatoAuditoriaSuscripcion = {
    thead:[
        {'id': 'thFecha', 'text': 'Fecha', 'sort': false, 'refer': 'fecha', 'type': 'text'},
        {'id': 'thEstratoOld', 'text': 'Estrato Anterior', 'sort': false, 'refer': 'estratoold', 'type': 'text'},
        {'id': 'thEstratoNew', 'text': 'Estrato Nuevo', 'sort': false, 'refer': 'estratonew', 'type': 'text'},
        {'id': 'thTipoUsoOld', 'text': 'Tipo Uso Anterior', 'sort': false, 'refer': 'usoold', 'type': 'text'},
        {'id': 'thTipoUsoNew', 'text': 'Tipo Uso Nuevo', 'sort': false, 'refer': 'usonew', 'type': 'text'},
        {'id': 'thCicloAnterior', 'text': 'Ciclo Anterior', 'sort': false, 'refer': 'cicloold', 'type': 'text'},
        {'id': 'thCicloNuevo', 'text': 'Ciclo Nuevo', 'sort': false, 'refer': 'ciclonew', 'type': 'text'},
        {'id': 'thEstadoAnterior', 'text': 'Estado Anterior', 'sort': false, 'refer': 'estadoold', 'type': 'text'},
        {'id': 'thEstadoNuevo', 'text': 'Estado Nuevo', 'sort': false, 'refer': 'estadonew', 'type': 'text'},
        {'id': 'thIdUsuario', 'text': 'Usuario', 'sort': false, 'refer': 'nombreusuario', 'type': 'text'}
    ]
};


var formatoAuditoriaTercero = {
    thead:[
        {'id': 'thFecha', 'text': 'Fecha', 'sort': false, 'refer': 'fecha', 'type': 'text'},
        {'id': 'thDocumentoOld', 'text': 'Documento Anterior', 'sort': false, 'refer': 'documentoold', 'type': 'text'},
        {'id': 'thDocumentoNew', 'text': 'Documento Nuevo', 'sort': false, 'refer': 'documentonew', 'type': 'text'},
        {'id': 'thNombreOld', 'text': 'Nombre Anterior', 'sort': false, 'refer': 'nombreold', 'type': 'text'},
        {'id': 'thNombreNew', 'text': 'Nombre Nuevo', 'sort': false, 'refer': 'nombrenew', 'type': 'text'},
        {'id': 'thIdUsuarioTer', 'text': 'Usuario', 'sort': false, 'refer': 'usuaute_nomusuario', 'type': 'text'}
    ]
};



var formatoAuditoriaPropiedad = {
    thead:[
        {'id': 'thFecha', 'text': 'Fecha', 'sort': false, 'refer': 'fecha', 'type': 'text'},
        {'id': 'thMedidorOld', 'text': 'Medidor Anterior', 'sort': false, 'refer': 'medidorold', 'type': 'text'},
        {'id': 'thMedidorNew', 'text': 'Medidor Nuevo', 'sort': false, 'refer': 'medidornew', 'type': 'text'},
        {'id': 'thDigitosOld', 'text': 'Digito Anterior', 'sort': false, 'refer': 'digitosold', 'type': 'text'},
        {'id': 'thDigitosNew', 'text': 'Digito Nuevo', 'sort': false, 'refer': 'digitosnew', 'type': 'text'},
        {'id': 'thZonaAnterior', 'text': 'Zona Anterior', 'sort': false, 'refer': 'zonaold', 'type': 'text'},
        {'id': 'thZonaNuevo', 'text': 'Zona Nuevo', 'sort': false, 'refer': 'zonanew', 'type': 'text'},
        {'id': 'thCatastralAnterior', 'text': 'Catastral Anterior', 'sort': false, 'refer': 'catastralold', 'type': 'text'},
        {'id': 'thCatastralNuevo', 'text': 'Catastral Nuevo', 'sort': false, 'refer': 'catastralnew', 'type': 'text'},
        {'id': 'thCatastralNalAnterior', 'text': 'Catastral Nacional Anterior', 'sort': false, 'refer': 'catastralnacionalold', 'type': 'text'},
        {'id': 'thCatastralNalNuevo', 'text': 'Catastral Nacional Nuevo', 'sort': false, 'refer': 'catastralnacionalnew', 'type': 'text'},
        {'id': 'thDireccionAnterior', 'text': 'Dirección Anterior', 'sort': false, 'refer': 'direccionold', 'type': 'text'},
        {'id': 'thDireccionNuevo', 'text': 'Dirección Nuevo', 'sort': false, 'refer': 'direccionnew', 'type': 'text'},
        {'id': 'thIdUsuarioPr', 'text': 'Usuario', 'sort': false, 'refer': 'usuaupr_nomusuario', 'type': 'text'}
    ]
};


var formatoAuditoriaConceptoExento = {
    thead:[
        {'id': 'thFecha', 'text': 'Fecha', 'sort': false, 'refer': 'fecha', 'type': 'text'},
        {'id': 'thconcepto', 'text': 'Concepto', 'sort': false, 'refer': 'nombreconcepto', 'type': 'text'},
        {'id': 'thFechaInicialAnt', 'text': 'Fecha Inicial Anterior', 'sort': false, 'refer': 'fechainicialanterior', 'type': 'text'},
        {'id': 'thFechaFinalAnt', 'text': 'Fecha Final Anterior', 'sort': false, 'refer': 'fechafinalanterior', 'type': 'text'},
        {'id': 'thFechaInicialNue', 'text': 'Fecha Inicial Nueva', 'sort': false, 'refer': 'fechainicialnueva', 'type': 'text'},
        {'id': 'thFechaFinalNue', 'text': 'Fecha Final Nueva', 'sort': false, 'refer': 'fechafinalnueva', 'type': 'text'},
        {'id': 'thIdUsuarioTer', 'text': 'Usuario', 'sort': false, 'refer': 'usu_nomusuario', 'type': 'text'}
    ]
};

var formatoAuditoriaRuta = {
    thead:[
        {'id': 'thFecha', 'text': 'Fecha', 'sort': false, 'refer': 'fecha', 'type': 'text'},
        {'id': 'thRutaAnt', 'text': 'Ruta Anterior', 'sort': false, 'refer': 'rutaanterior', 'type': 'text'},
        {'id': 'thRutanew', 'text': 'Ruta Nueva', 'sort': false, 'refer': 'rutanueva', 'type': 'text'},
        {'id': 'thSecuenciaAnt', 'text': 'Secuencia Anterior', 'sort': false, 'refer': 'secuenciaanterior', 'type': 'text'},
        {'id': 'thSeciuenciaNue', 'text': 'Secuencia Nueva', 'sort': false, 'refer': 'secuencianueva', 'type': 'text'},
        {'id': 'thIdUsuarioTer', 'text': 'Usuario', 'sort': false, 'refer': 'usu_nomusuario', 'type': 'text'}
    ]
};

