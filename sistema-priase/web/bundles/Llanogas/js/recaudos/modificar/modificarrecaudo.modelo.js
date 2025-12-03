/**
 * @fileOverview Archivo de modelo para modificar recaudo
 * @author jeissonBarriga
 * @version 1.0.0
 */
var modificarrecaudoModelo = {};
/**
 * Formato para llenar la tabla de suscripciones
 * @type {Object}
 */
var formatoSuscripciones = {
    thead: [
        {'id': 'thIdSuscripcion', 'text': 'ID de Suscripción', 'sort': false, 'refer': 'idsuscripcion', 'type': 'text'},
        {'id': 'thCodigoAnterior', 'text': 'Código Anterior', 'sort': false, 'refer': 'codigoanterior', 'type': 'text'},
        {'id': 'thTipoSuscripcion', 'text': 'Id Tipo Suscripción', 'sort': false, 'refer': 'idtiposuscripcion', 'type': 'text'},
        {'id': 'thTipoSuscripcion', 'text': 'Tipo Suscripción', 'sort': false, 'refer': 'tiposuscripcion', 'type': 'text'}
    ]
};
/**
 * Formato para llenar la tabla de facturas
 * @type {Object}
 */
var formatoFacturas = {
    thead: [
        {'id': 'thCodigoFactura', 'text': 'Cod.factura', 'sort': false, 'refer': 'idfactura', 'type': 'text'},
        {'id': 'thNumeroFactura', 'text': 'Num.factura', 'sort': false, 'refer': 'numerofactura', 'type': 'text'},
        {'id': 'thFechaVencimiento', 'text': 'Fecha.venc', 'sort': false, 'refer': 'fechavencimiento', 'type': 'text'},
        {'id': 'thCodigoSuscripcion', 'text': 'Cod.suscripción', 'sort': false, 'refer': 'idsuscripcion', 'type': 'text'},
        {'id': 'thSuscripcion', 'text': 'Suscripción', 'sort': false, 'refer': 'idtiposuscripcion', 'type': 'text'},
        {'id': 'thCicloPeriodo', 'text': 'Tip. suscripcion', 'sort': false, 'refer': 'tiposuscripcion', 'type': 'text'},
        {'id': 'thValorTotal', 'text': 'Ciclo-periodo', 'sort': false, 'refer': 'cicloperiodo', 'type': 'text'},
        {'id': 'thValorPagado', 'text': 'Valor Pagado', 'sort': false, 'refer': 'totalpagadorecaudo', 'type': 'currency'}
    ]
};
/**
 * Formato para llenar la tabla de formas de pago
 * @type {Object}
 */
var formatoFormasPagoRecaudoConsignado = {
    thead: [
        {'id': 'thFormaPago', 'text': 'Forma Pago', 'sort': false, 'refer': 'nombretipoformapago', 'type': 'text'},
        {'id': 'thValorPago', 'text': 'Valor', 'sort': false, 'refer': 'valorpagado', 'type': 'text'},
    ]
};
/**
 * Formato para llenar la tabla de las formas de pago que no han sido consignadas
 * @type {Object}
 */
var formatoFormasPagoRecaudoSinConsignar = {
    thead: [
        {'id': 'thFormaPago', 'text': 'Forma Pago', 'sort': false, 'refer': 'nombretipoformapago', 'type': 'text'},
        {'id': 'thValorPago', 'text': 'Valor', 'sort': false, 'refer': 'valorpagado', 'type': 'text'},
        {'id':'thEditarFormaPago', 'text':'Editar','sort':false,  'refer':'idformapago', 'type': 'button', 'style': {'width': '10%'}},
        {'id':'thEliminarFormaPago', 'text':'Eliminar','sort':false,  'refer':'idformapago', 'type': 'button', 'style': {'width': '10%'}}
    ]
};
/**
 * Formato para llenar la tabla distribucion recaudos
 * @type {Object}
 */
var formatoDistribucionRecaudo = {
    thead: [
        {'id': 'thIdRecaudo', 'text': 'Id Recaudo', 'sort': false, 'refer': 'idrecaudo', 'type': 'text'},
        {'id': 'thValorPago', 'text': 'Valor Total', 'sort': false, 'refer': 'valortotalrecaudo', 'type': 'currency'},
        {'id': 'thSucursal', 'text': 'Sucursal', 'sort': false, 'refer': 'sucursal', 'type': 'text'},
        {'id': 'thMedioPago', 'text': 'Medio pago', 'sort': false, 'refer': 'mediopago', 'type': 'text'},
        {'id': 'thNombreDocumento', 'text': 'Documento', 'sort': false, 'refer': 'docnombre', 'type': 'text'},
        {'id': 'thNombreTipoDocumento', 'text': 'Tipo documento', 'sort': false, 'refer': 'tidonombre', 'type': 'text'},
        {'id': 'thNombreConcepto', 'text': 'Concepto', 'sort': false, 'refer': 'nombreconcepto', 'type': 'text'},
        {'id': 'thPeriodo', 'text': 'Periodo', 'sort': false, 'refer': 'periodo', 'type': 'text', 'valueField':'idPeriodo'},
        {'id': 'thUsuario', 'text': 'Usuario registro', 'sort': false, 'refer': 'usuario', 'type': 'text'},
        {'id': 'thValorPago', 'text': 'Valor disponible ', 'sort': false, 'refer': 'valordisponible', 'type': 'currency'},
        {'id': 'thModifica', 'text': 'Modificar', 'sort': false, 'refer': 'idrecaudo', 'type': 'button', 'style': {'width': '10%'}}
    ]
};

var formasPagoAgregar = [];
