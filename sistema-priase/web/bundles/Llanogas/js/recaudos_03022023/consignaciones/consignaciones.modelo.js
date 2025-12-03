/**
 * Formato para cargar las fechas de recaudos a consignar
 * @type {Object}
 */
var formatoFechaRecaudo = {
    thead: [
        {'id': 'thSeleccionar', 'text': 'Seleccionar', 'sort': false, 'refer': 'fecha', 'type': 'check'},
        {'id': 'thFechaRecaudo', 'text': 'Fecha', 'sort': false, 'refer': 'fecha', 'type': 'text'},
        {'id': 'thValor', 'text': 'Valor', 'sort': false, 'refer': 'valor', 'type': 'currency'}
    ]
};
/**
 * Formato para cargar los valores de los recaudos de las fechas seleccionadas según la empresa
 * @type {Object}
 */
var formatoRecaudoEmpresa = {
    thead: [
        {'id': 'thEmpresa', 'text': 'Empresa', 'sort': false, 'refer': 'empresa', 'type': 'text'},
        {'id': 'thValor', 'text': 'Valor', 'sort': false, 'refer': 'valor', 'type': 'currency'}
    ]
};
/**
 * Formato para cargar los cheques
 * @deprecated Ahora se utiliza el objeto formatoPagoCheque
 * @type {Object}
 */
var formatoCheque = {
    thead: [
        {'id': 'thSeleccionar', 'text': 'Seleccionar', 'sort': false, 'refer': 'idinfo', 'type': 'check'},
        {'id': 'thValor', 'text': 'Valor', 'sort': false, 'refer': 'informacion', 'type': 'text'},
        {'id': 'thNumero', 'text': 'Nro', 'sort': false, 'refer': 'estado', 'type': 'text'}
    ]
};
/**
 * Formato para cargar los pagos en efectivos de una consignación (Sólo cuando se va a actualizar)
 * @type {Object}
 */
var formatoPagoEfectivo = {
    thead: [
        {'id': 'thEmpresaEfectivo', 'text': 'Empresa', 'sort': false, 'refer': 'empresa', 'type': 'text'},
        {'id': 'thBancoEfectivo', 'text': 'Banco', 'sort': false, 'refer': 'banco', 'type': 'text'},
        {'id': 'thTipoCuentaEfectivo', 'text': 'Tipo cuenta', 'sort': false, 'refer': 'tipocuenta', 'type': 'function', 'tdCallback': 'consignacionesVista.validarTipoCuenta'},
        {'id': 'thCuentaEfectivo', 'text': 'Cuenta', 'sort': false, 'refer': 'numerocuenta', 'type': 'text'},
        {'id': 'thValorEfectivo', 'text': 'Valor', 'sort': false, 'refer': 'valor', 'type': 'currency', 'style': {'max-width': '100px', 'word-wrap': 'break-word'}},
        {'id': 'thFechaEfectivo', 'text': 'Fecha', 'sort': false, 'refer': 'fecha', 'type': 'text', 'style': {'max-width': '100px', 'word-wrap': 'break-word'}},
        {'id': 'thEliminarCheque', 'text': 'Eliminar', 'sort': false, 'refer': 'iddetalleconsignacion', 'type': 'button', 'style': {'width': '10%'}}
    ]
};
/**
 * Formato para cargar los cheques de la consignación (sólo cuando se va a actualizar)
 * @type {Object}
 */
var formatoPagoCheque = {
    thead: [
        {'id': 'thEmpresaCheque', 'text': 'Empresa', 'sort': false, 'refer': 'empresa', 'type': 'text'},
        {'id': 'thBancoCheque', 'text': 'Banco', 'sort': false, 'refer': 'banco', 'type': 'text'},
        {'id': 'thTipoCuentaCheque', 'text': 'Tipo cuenta', 'sort': false, 'refer': 'tipocuenta', 'type': 'function', 'tdCallback': 'consignacionesVista.validarTipoCuenta'},
        {'id': 'thCuentaCheque', 'text': 'Cuenta', 'sort': false, 'refer': 'numerocuenta', 'type': 'text'},
        {'id': 'thValorCheque', 'text': 'Valor', 'sort': false, 'refer': 'valor', 'type': 'currency', 'style': {'max-width': '100px', 'word-wrap': 'break-word'}},
        {'id': 'thFechaCheque', 'text': 'Fecha', 'sort': false, 'refer': 'fecha', 'type': 'text', 'style': {'max-width': '100px', 'word-wrap': 'break-word'}},
        {'id': 'thInformacionCheque', 'text': 'Información', 'sort': false, 'refer': 'iddetalleconsignacion', 'type': 'button', 'style': {'width': '10%'}},
        {'id': 'thEliminarCheque', 'text': 'Eliminar', 'sort': false, 'refer': 'iddetalleconsignacion', 'type': 'button', 'style': {'width': '10%'}}
    ]
};
/**
 * @fileoverview Archivo modelo de la consignación es donde se guarda información
 * @author AppFuture
 * @version 1.0.0
 */
/** @namespace */
var consignacionesModel = {
    informacionEmpresaActual: null,
    cantBancoEfectivo: 0,
    cantBancoCheque: 0,
    numFormaPago: 0,
    formasPago: [],
    detalle: [],
    consignaciones: [],
    archivos: [],
    accionGeneral: 'I', // I = insertar y A = Actualizar
    detallesEliminar: []

};

/**
 * Template para guardar la información adicional del cheque
 * @type {string}
 */
var tplFormaPagoCheque = '<div id="divFormaPago{{i}}"><div class="campo" style="display:none"><label for="cmbFormaPago{{i}}">Forma de Pago</label><select id="cmbFormaPago{{i}}">' +
        '<option value="78" selected>Cheque</option></select></div><div class="campo"><label for="txtValor{{i}}">Valor:</label><input type="text" id="txtValor{{i}}" /></div>' +
        '<div id="divdetallesFormaPago{{i}}"><div class="campo"><label for="txtDocGirador{{i}}">NIT/CC Girador:</label><input type="text" id="txtDocGirador{{i}}" maxlength="10" /></div>' +
        '<div class="campo"><label for="txtNombreGirador{{i}}">Nombre Girador:</label><input type="text" id="txtNombreGirador{{i}}" maxlength="50" /></div>' +
        '<div class="campo"><label for="cmbBanco{{i}}">Banco:</label><select id="cmbBanco{{i}}"></select></div></div><div id="divDetallesCheque{{i}}"><div class="campo">' +
        '<label for="txtNumCuenta{{i}}">Número de la cuenta:</label><input type="text" id="txtNumCuenta{{i}}" maxlength="12" /></div><div class="campo">' +
        '<label for="txtNumCheque{{i}}">Número de cheque:</label><input type="text" id="txtNumCheque{{i}}" maxlength="4" /></div></div><div>' +
        '<button id="btnRemoverForma{{i}}" class="btnSimple">Remover Forma</button></div><hr style="margin:10px 0px 5px 0px; width: 95%;" /></div>';