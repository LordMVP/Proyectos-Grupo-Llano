/**
 * Formato para cargar la tabla de  fechas de recaudo consignadas
 * @type {Object}
 */
var formatoFechaRecaudo = {
    thead:[
        {'id':'thFechaRecaudo', 'text':'Fecha','sort':false,  'refer':'fecha', 'type':'text'}, 
        {'id':'thValor', 'text':'Valor', 'sort':false, 'refer':'valor', 'type':'currency'}
    ]
};
/**
 * Formato para cargar la tabla de los recaudos por empresa de la consignación
 * @type {Object}
 */
var formatoRecaudoEmpresa={
    thead:[
        {'id':'thEmpresa', 'text':'Empresa','sort':false,  'refer':'empresa', 'type':'text'}, 
        {'id':'thValor', 'text':'Valor', 'sort':false, 'refer':'valor', 'type':'currency'}
    ]
};
/**
 * Formato para cargar la tabla de los pagos realizados por efectivo
 * @type {Object}
 */
var formatoPagoEfectivo ={
    thead:[
        {'id':'thEmpresaEfectivo', 'text':'Empresa', 'sort':false,  'refer':'empresa', 'type':'text'}, 
        {'id':'thBancoEfectivo', 'text':'Banco', 'sort':false, 'refer':'banco', 'type':'text'},
        {'id':'thTipoCuentaEfectivo', 'text':'Tipo cuenta','sort':false,  'refer':'tipocuenta', 'type':'function','tdCallback': 'flujoVista.validarTipoCuenta'},
        {'id':'thCuentaEfectivo', 'text':'Cuenta','sort':false,  'refer':'numerocuenta', 'type':'text'},
        {'id':'thValorEfectivo', 'text':'Valor','sort':false,  'refer':'valor', 'type':'currency'}
    ]
};
/**
 * Formato para cargar la tabla de los pagos realizados mediando cheques
 * @type {Object}
 */
var formatoPagoCheque ={
    thead:[
        {'id':'thEmpresaCheque', 'text':'Empresa', 'sort':false,  'refer':'empresa', 'type':'text'}, 
        {'id':'thBancoCheque', 'text':'Banco', 'sort':false, 'refer':'banco', 'type':'text'},
        {'id':'thTipoCuentaCheque', 'text':'Tipo cuenta','sort':false,  'refer':'tipocuenta','type':'function','tdCallback': 'flujoVista.validarTipoCuenta'},
        {'id':'thCuentaCheque', 'text':'Cuenta','sort':false,  'refer':'numerocuenta', 'type':'text'},
        {'id':'thValorCheque', 'text':'Valor','sort':false,  'refer':'valor', 'type':'currency'},
        {'id':'thInformacionCheque', 'text':'Información','sort':false,  'refer':'iddetalleconsignacion', 'type': 'button', 'style': {'width': '10%'}}
    ]
};
/** @namespace flujoModelo */
/**
 * @fileOverview Archivo modelo para flujo de aprobación de consignaciones
 * @author AppFuture
 * */
var flujoModelo ={
    formasPago: []
};
/**
 * Template para mostrar las formas de pago de un cheque
 * @type {string}
 */
var tplCheque = '<div id="divFormaPago{{indice}}">'+
       '<div class="campo" style="display:none">'+
            '<label for="cmbFormaPago{{indice}}">Forma de Pago</label>'+
            '<select id="cmbFormaPago{{indice}}">'+
                '<option value="78" selected>Cheque</option>'+
            '</select>'+
        '</div>'+
        '<div class="campo">'+
            '<label for="txtValor{{indice}}">Valor:</label>'+
            '<input type="text" id="txtValor{{indice}}" />'+
        '</div>'+
        '<div id="divdetallesFormaPago{{indice}}">'+
            '<div class="campo">'+
                '<label for="txtDocGirador{{indice}}">NIT/CC Girador:</label>'+
                '<input type="text" id="txtDocGirador{{indice}}" maxlength="10" />    '+
            '</div>'+
            '<div class="campo">'+
                '<label for="txtNombreGirador{{indice}}">Nombre Girador:</label>'+
                '<input type="text" id="txtNombreGirador{{indice}}" maxlength="50" />'+
            '</div>'+
            '<div class="campo">'+
                '<label for="cmbBanco{{indice}}">Banco:</label>'+
                '<select id="cmbBanco{{indice}}"></select>'+
            '</div>'+
        '</div>'+
        '<div id="divDetallesCheque{{indice}}">'+
            '<div class="campo">'+
                '<label for="txtNumCuenta{{indice}}">Número de la cuenta:</label>'+
                '<input type="text" id="txtNumCuenta{{indice}}" maxlength="10" />    '+
            '</div>'+
            '<div class="campo">'+
                '<label for="txtNumCheque{{indice}}">Número de cheque:</label>'+
                '<input type="text" id="txtNumCheque{{indice}}" maxlength="4" />    '+
            '</div>'+
        '</div>'+
        '<div>'+
            '<button id="btnRemoverForma{{indice}}" class="btnSimple">Remover Forma</button>'+
        '</div>'+
        '<hr style="margin:10px 0px 5px 0px; width: 95%;" />'+
    '</div>';