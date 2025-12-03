var formatoContactos = {
    thead: [
        {'id': 'thIdContacto', 'text': 'Id. Contacto', 'sort': false, 'refer': 'idContacto', 'type': 'text'},
        {'id': 'thNombre', 'text': 'Nombre', 'sort': false, 'refer': 'nombreContacto', 'type': 'text'},
        {'id': 'thCargo', 'text': 'Cargo', 'sort': false, 'refer': 'cargoContacto', 'type': 'text'},
        {'id': 'thTelefonoFijo', 'text': 'TelefonoFijo', 'sort': false, 'refer': 'telefonoFijo', 'type': 'text'},
        {'id': 'thTelefonoCelular', 'text': 'TelefonoCelular', 'sort': false, 'refer': 'telefonoCelular', 'type': 'text'},
        {'id': 'thCorreo', 'text': 'Correo', 'sort': false, 'refer': 'correo', 'type': 'text'}
    ]
};

var formatoServiciosContratados = {
    thead: [
        {'id': 'thLiquidacion', 'text': 'Liquidacion', 'sort': false, 'refer': 'liquidaciontext', 'type': 'text'},
        {'id': 'thDocumento', 'text': 'Documento', 'sort': false, 'refer': 'documento', 'type': 'text'},
        {'id': 'thTipoDocumento', 'text': 'Tipo de Documento', 'sort': false, 'refer': 'tipoDocumento', 'type': 'text'},
        {'id': 'thMetodoConstructivo', 'text': 'Metodo Construtivo', 'sort': false, 'refer': 'metodotext', 'type': 'text'},
        {'id': 'thAgenda', 'text': 'Agenda', 'sort': false, 'refer': 'agendatext', 'type': 'text'},
        {'id': 'thPeso', 'text': 'Peso', 'sort': false, 'refer': 'peso', 'type': 'text'},
        {'id': 'btnEditar', 'text': 'Editar', 'sort': false, 'refer': 'btnEditar', 'type': 'button'},
        {'id': 'btnInformacionAdicional', 'text': 'Informacion Adicional', 'sort': false, 'refer': 'btnInformacionAdicional', 'type': 'button'},
        {'id': 'btnConceptos', 'text': 'Conceptos', 'sort': false, 'refer': 'btnConceptos', 'type': 'button'}
    ]
};


var formatoConstructora = {
    thead: [
        {'id': 'thIdContacto', 'text': 'Id. Contacto', 'sort': false, 'refer': 'IdContacto', 'type': 'text'},
        {'id': 'thNombre', 'text': 'Nombre', 'sort': false, 'refer': 'Nombre', 'type': 'text'},
        {'id': 'thCargo', 'text': 'Cargo', 'sort': false, 'refer': 'Cargo', 'type': 'text'},
        {'id': 'thTelefonoFijo', 'text': 'TelefonoFijo', 'sort': false, 'refer': 'TelefonoFijo', 'type': 'text'},
        {'id': 'thTelefonoCelular', 'text': 'TelefonoCelular', 'sort': false, 'refer': 'TelefonoCelular', 'type': 'text'},
        {'id': 'thCorreo', 'text': 'Correo', 'sort': false, 'refer': 'Correo', 'type': 'text'}
    ]
};
var formatoContratos = {
    thead: [
        {'id': 'thSelector', 'text': 'Seleccionar', 'sort': false, 'refer': null, 'type': 'radio'},
        {'id': 'thContrato', 'text': 'Contrato', 'sort': false, 'refer': 'contrato', 'type': 'text'},
        {'id': 'thNombreConstructora', 'text': 'Constructora', 'sort': false, 'refer': 'nombreConstructora', 'type': 'text'},
        {'id': 'thlicencia', 'text': 'Licencia', 'sort': false, 'refer': 'licencia', 'type': 'text'},
        {'id': 'thestado', 'text': 'Estado', 'sort': false, 'refer': 'estado', 'type': 'text'},
        {'id': 'thnombreMunicipio', 'text': 'Municipio', 'sort': false, 'refer': 'nombreMunicipio', 'type': 'text'},
        {'id': 'thnombreBarrio', 'text': 'Barrio', 'sort': false, 'refer': 'nombreBarrio', 'type': 'text'},
        {'id': 'thfechaInicio', 'text': 'Fecha Inicio', 'sort': false, 'refer': 'vigenciaInicio', 'type': 'text'}
    ]
};

var formatoPolizas = {
    thead: [
        {'id': 'pco_ideregistro', 'text': 'Num. Poliza', 'sort': false, 'refer': 'nroPoliza', 'type': 'text' ,'idpoliza': 'pco_ideregistro'},
        {'id': 'thNomAseguradora', 'text': 'Aseguradora', 'sort': false, 'refer': 'NomAseguradora', 'type': 'text'},
        {'id': 'thValor', 'text': 'Valor Asegurado', 'sort': false, 'refer': 'aseguradoraValor', 'type': 'currency'},
        {'id': 'thObjeto', 'text': 'Amparo', 'sort': false, 'refer': 'aseguradoraOjbeto', 'type': 'text'},
        {'id': 'thObjeto', 'text': 'Vigente Desde', 'sort': false, 'refer': 'vigenteDesde', 'type': 'text'},
        {'id': 'thObjeto', 'text': 'Vigente Hasta', 'sort': false, 'refer': 'vigenteDesde', 'type': 'text'}
    ]
};

var formatoUnidadesConstructivas = {
    thead: [
        {'id': 'thUniConstructiva', 'text': 'Uni. Constructiva', 'sort': false, 'refer': 'UniConstructiva', 'type': 'text'},
        {'id': 'thInfAdicional', 'text': 'Info. Adicional', 'sort': false, 'refer': null, 'type': 'input', 'style': {'width': '10%'}},
        {'id': 'thObrasConstructivas', 'text': 'Obr. Constructivas', 'sort': false, 'refer': null, 'type': 'input', 'style': {'width': '10%'}}
    ]
};



var formatoAmortizacion = {
    thead: [
        {'id': 'thNumero', 'text': 'Numero', 'sort': false, 'refer': 'Numero', 'type': 'input'},
        {'id': 'thLiquidacion', 'text': 'Liquidacion', 'sort': false, 'refer': 'Liquidacion', 'type': 'input'},
        {'id': 'thDocumento', 'text': 'Documento', 'sort': false, 'refer': 'Documento', 'type': 'input'},
        {'id': 'thTipoDocumento', 'text': 'Tipo Documento', 'sort': false, 'refer': 'TipoDocumento', 'type': 'input'},
        {'id': 'thFecha', 'text': 'Fecha', 'sort': false, 'refer': 'Fecha', 'type': 'input'},
        {'id': 'thValor', 'text': 'Valor', 'sort': false, 'refer': 'Valor', 'type': 'input'},
        {'id': 'btnVerDetalle', 'text': 'Ver Detalle', 'sort': false, 'refer': 'Detalle', 'type': 'button'}
    ]
};

var constructorasModel = {
    suscriptor: null,
    municipioseleccionado: null,
    barrioseleccionado: null,
    terceroseleccionado: null,
    aseguradoraseleccionada: null,
    constructoraseleccionada: null,
    contratoideregistro: null,
    contactos: [],
    polizas: [],
    unidadesconstrutivas: [],
    suscripciones: [],
    suscripcionesEliminar:[],
    contratos: [],
    adicionamunicipioseleccionado: null,
    contactoseliminar: [],
    servicioscontratados: [],
    servicioscontratadosGrabar: [],
    servicioscontratadosElminar:[],
    amortizacion: [{'Numero': '1', 'Liquidacion': '2'}],
    polizaseliminar: [],
    liquidacionseleccionada : null ,
    iddocumento : null ,
    idtipodocumento : null ,
    suscripcionesrelacionadas: [],
    informacionadicional:[] ,
    estadoContratoNoEditable : [{'id':'E'},{'id':'P'},{'id':'I'},{'id':'T'}],
    estadoContrato:null ,
    archivos:[],
    archivosgrabar:[],
    finagenda: false,
    permisosEdicion:null, 
    proyecto:[],
    detDistribucionPago: []

};
