//el objeto gestionarsuscripcionModelo , almacena la información de las suscripciones de la aplicación.
var gestionarSuscriptorModel = {
    idTercero : null ,
    suscriptores : [],
    convenios :[],
    terceros:[],
    suscripcionesTrasladar :[]
};

var formatoTerceros= {
    thead: [
        {'id': 'thseleccionar', 'text': 'Seleccionar', 'sort': false, 'refer': '', 'type': 'radio'},
        {'id': 'thCedula', 'text': 'Cédula', 'sort': false, 'refer': 'documento', 'type': 'text'},
        {'id': 'thNombre', 'text': 'Nombre', 'sort': false, 'refer': 'nombretercero', 'type': 'text'}
    ]
};

var formatoSuscriptor = {
    thead: [
        {'id': 'thSeleccionar', 'text': 'Seleccionar', 'sort': false, 'refer': '', 'type': 'radio'},
        {'id': 'thIdSuscriptor', 'text': 'Ide Suscriptor', 'sort': false, 'refer': 'idsuscriptor', 'type': 'text'},
        {'id': 'thDescripcion', 'text': 'Descripción', 'sort': false, 'refer': 'descripcion', 'type': 'text'},
        {'id': 'thConvenio', 'text': 'Convenio', 'sort': false, 'refer': 'convenio', 'type': 'text'}
    ]
};
var formatoSuscripciones = {
    thead: [
        {'id': 'thIde', 'text':'ide', 'sort': false, 'refer': 'idsuscripcion', 'type': 'text'},
        {'id': 'thCodigoAnterior', 'text': 'Codigo Anterior', 'sort': false, 'refer': 'codigoanterior', 'type': 'text'},
        {'id': 'thTipoPropiedad', 'text': 'Tipo Propiedad', 'sort': false, 'refer': 'descripcionpropiedad', 'type': 'text'},
        {'id': 'thIdPropiedad', 'text': 'Número Propiedad', 'sort': false, 'refer': 'numeropropiedad', 'type': 'text'},
        {'id': 'thMunicipio', 'text': 'Municipio', 'sort': false, 'refer': 'municipio', 'type': 'text'},
        {'id': 'thBarrio', 'text': 'Barrio', 'sort': false, 'refer': 'barrio', 'type': 'text'},
        {'id': 'thDireccion', 'text': 'Dirección', 'sort': false, 'refer': 'direccion', 'type': 'text'},
        {'id': 'btnDetalles', 'text': 'Detalles', 'sort': false, 'refer': 'Detalles', 'type': 'button'},
        {'id': 'btnPropiedad', 'text': 'Propiedad', 'sort': false, 'refer': 'Propiedad', 'type': 'button'},
        {'id': 'btnTrasladar', 'text': 'Trasladar', 'sort': false, 'refer': 'Trasladar', 'type': 'button'}
    ]
};
