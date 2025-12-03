var formatoFacturas = {
    thead: [
        {'id': 'thIdFactura', 'text': 'Cod. Factura', 'sort': false, 'refer': 'idfactura', 'type': 'text'},
        {'id': 'thNumFactura', 'text': 'Num. Factura', 'sort': false, 'refer': 'numero', 'type': 'text'},
        {'id': 'thVencimiento', 'text': 'Fecha Venc.', 'sort': false, 'refer': 'fechavencimiento', 'type': 'text'},
        {'id': 'thIdSuscripcion', 'text': 'Cod. Suscripción', 'sort': false, 'refer': 'idsuscripcion', 'type': 'text'},
        {'id': 'thTipoSuscripcion', 'text': 'Suscripción', 'sort': false, 'refer': 'tiposuscripcion', 'type': 'text'},
        {'id': 'thCiclo', 'text': 'Ciclo - Periodo', 'sort': false, 'refer': 'cicloperiodo', 'type': 'text'},
        {'id': 'thValorTotal', 'text': 'Valor Total', 'sort': false, 'refer': 'valortotal', 'type': 'currency'},
        {'id': 'thValorPagado', 'text': 'Valor Pagado', 'sort': false, 'refer': 'valorpagado', 'type': 'currency'},
        {'id': 'thSaldoFactura', 'text': 'Saldo', 'sort': false, 'refer': 'saldofactura', 'type': 'currency'}
    ]
};

var formatoterceropropiedad = {
    thead: [
        {'id': 'thseleccione', 'text': '', 'sort': false, 'refer': null, 'type': 'radio'},
        {'id': 'thDocumento', 'text': 'Documento', 'sort': false, 'refer': 'documento', 'type': 'text'},
        {'id': 'thNombre', 'text': 'Nombre Completo', 'sort': false, 'refer': 'nombretercero', 'type': 'text'},
        {'id': 'thCelular', 'text': 'Celular', 'sort': false, 'refer': 'telefonocelular', 'type': 'text'},
        {'id': 'thFijo', 'text': 'Fijo', 'sort': false, 'refer': 'telefonofijo', 'type': 'text'}
    ]
};
var formatopropiedad = {
    thead: [
        {'id': 'thSeleccion', 'text': '', 'sort': false, 'refer': null, 'type': 'check'},
        {'id': 'thIde', 'text': 'Ide', 'sort': false, 'refer': 'pro_ideregistro', 'type': 'text'},
        {'id': 'thTipopropiedad', 'text': 'Tipo Propiedad', 'sort': false, 'refer': 'uni_nombre1', 'type': 'text'},
        {'id': 'thNumCatastral', 'text': 'Num. Catastral', 'sort': false, 'refer': 'pro_numcatastral', 'type': 'text'},
        {'id': 'thDescripcion', 'text': 'Descripcion', 'sort': false, 'refer': 'pro_descripcion', 'type': 'text'},
        {'id': 'thMunicipio', 'text': 'Municipio', 'sort': false, 'refer': 'proyecto_nom', 'type': 'text'},
        {'id': 'thBarrio', 'text': 'Barrio', 'sort': false, 'refer': 'barrio_nom', 'type': 'text'},
        {'id': 'thDireccion', 'text': 'Direccion', 'sort': false, 'refer': 'pro_direccion', 'type': 'text'},
    ]
}
/** @namespace */
var eliminarPropiedadModel = {
    terceropropiedad: [],
    terceropropiedadSeleccionado: [],
    propiedad:[],
    terceropropiedaddestino:[],
    propiedaddestino:[],
    terceroorigen:null,
    tercerodestino:null
};
