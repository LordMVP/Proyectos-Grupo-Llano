//
export type formDataSearchInterface = {
  docThird: string;
  nameThird: string;
  code: string;
  idSuscription: string;
};

export type dataResultSearchInterface = {
  typeDocument: string;
  document: string;
  name: string;
};

type clatercerostype = {
  uniClatercero: number;
}[];
type contactosTercerostype = { uniUnidadId: number; contValor: string }[];
export type formDataThird = {
  terIderegistro: string | null;
  terDocumento: string;
  terDigverificacion: string | null;
  terNombre: string;
  terApellido: string;
  terSexo: string;
  uniTiptercero: number | null;
  ciudadCod: string;

  terDocexpedicion: string;
  uniTipidentifica: number | null;
  terFecnacimiento: string;
  terInfoadicional: string | null;
  claterceros: clatercerostype;
  contactosTercero: contactosTercerostype;
  ciudadNombre: string;
};
export type formDataThirdDef = {
  terIderegistro: string | null;
  terDocumento: string;
  terDigverificacion: string | null;
  terNombre: string;
  terApellido: string;
  terSexo: string;
  uniTiptercero: number | null;
  ciudadCod: string;

  terDocexpedicion: string;
  uniTipidentifica: number | null;
  terFecnacimiento: string;
  terInfoadicional: string | null;
  claterceros: clatercerostype;
  contactosTercero: contactosTercerostype;
};

export type formDataProperty = {
  terIderegistro: number;
  uniMunicipioNombre: string; // no def
  uniMunicipio: number;
  uniBarrio: number;
  uniBarrioNombre: string; // no def
  uniCmpdireccion: number;
  uniCmpdireccionNombre: string; // no def
  proDireccion: string;
  proNummatriculainmobiliaria: string;
  proNumcatastral: string;
  proNumcatastralnacional: string;
  proDigitos: number | string;
  proZona: string;
  uniTippropieda: number;
  mubaSector: number;
  proSeccion: number;
  proManzana: number;
  proGpsaltitud: string;
  proGpslatitud: string;
  proGpslongitud: string;
  proAltriesgo: string;
};

export type formDataPropertyDef = {
  terIderegistro: number;
  uniMunicipio: number;
  uniBarrio: number;
  uniCmpdireccion: number;
  proDireccion: string;
  proNummatriculainmobiliaria: string;
  proNumcatastral: string;
  proNumcatastralnacional: string;
  proDigitos: number;
  proZona: string;
  uniTippropieda: number;
  mubaSector: number;
  proSeccion: number;
  proManzana: number;
  proGpsaltitud: string;
  proGpslatitud: string;
  proGpslongitud: string;
  proAltriesgo: string;
  clasificacionViviendaDTOS: {
    uniIderegistro: string;
    uniNombre1: string;
  }[];
  proIdpadre: number | null;
};
export type formDataPropertyResultSearch = {
  proIderegistro: number;
  proIdepropieda: string;
  proEstado: string; // no front
  proDescripcion: string; // no front
  terIderegistro: number;
  uniMunicipioNombre: string;
  uniMunicipio: number;
  uniBarrio: number;
  uniBarrioNombre: string;
  uniCmpdireccion: number;
  uniCmpdireccionNombre: string;
  proDireccion: string;
  proNummatriculainmobiliaria: string;
  proNumcatastral: string;
  proResolcatastral: any; // no front
  proFecha: any; // no front
  uniTipovivienda: any; // no front
  proNumcatastralnacional: string;
  proDigitos: number | string;
  proZona: string;
  usuIderegistro: number; // no front
  uniTippropieda: number;
  estTippropieda: number; // no front
  mubaSector: number;
  proSeccion: number;
  proManzana: number;
  proGpsaltitud: string;
  proGpslatitud: string;
  proGpslongitud: string;
  proAltriesgo: string;
  uniClasificacionvivienda: {
    uni_ideregistro: string;
    uni_nombre1: string;
  }[];
  tippropiedaNombre: string;
};

export type formDataSuscriptionInterface = {
  dsusIderegistr: any;
  susIderegistro: any;
  terIderegistro: number;
  proIderegistro: number;
  uniTipsuscripc: number;
  uniActsuscripc: null | number;
  cicIderegistro: number;
  uniTipusosuscr: number;
  uniLiquidacion: number;
  proCatestrato: number;
  dsusEstado: string;
  dsusFecinicio: string;
  dsusDescripcion: string;
  dsusIniestado: string;
  dsusFinestado: string;
  dsusFactor: number;
  dsusPcodigo: any;
  empAlternasId: number[];
  empIderegistro: number | null;
  perIderegistro: any | null;
  inforadicionalsuscripcionDTO: {
    iasusIderegistro: any;
    iasusCobrojuridico: boolean;
    iasusPagapeaje: boolean;
    iasusReferenciacomercial: string;
  };
  recoleccionBarridoDTO: {
    rrbaIdRegistro: any;
    rutIderegistro: number;
    rutIdMacroRuta: number;

    rutEstado: string;

    rutIderegistroBar: number; //rutIderegistroBar
    rrbaIdRegistroBar: any;

    rutEstadoBar: "A";
  };
  rutaAprovechamientoDTO: {
    rutaPrIdRegistro: any;
    rutIderegistro: number | null;
    terIderegistro: number;
    terAprovechamiento: number | null;
    incentivo: boolean;
    aforado: boolean;
    rutEstado: string;
  };

  conceptos: {
    cosuIdregistr: any;
    uniConcepto: number;
    fecInicio: string;
    fecFinal: string;
  }[];
};

export type conceptInterface = {
  cosuIdregistr: any;
  uniConcepto: number;
  fecInicio: string;
  fecFinal: string;
};

export type formDataHomologacionInterface = {
  ghomIderegistr: any;
  susIderegistro: number;
  perIderegistro: number;
  observaciones: string;
  dsusIderegistr: number;
  cnreIderegistr: number;
  detalles: {
    dghoIderegistr: any;
    ghomIderegistr: any;
    dsusIderegistr: number;
    dsusPcodigo: string;
    dghoConsumo: number[];
    dghoObservaciones: string;
    dghoNumeromedidor: string;
    susIderegistroHomologa: any;
    susIderegistroHomologados: any;
  }[];
};
export type formDataHomologacionOldInterface = {
  nuevoConvenio: number;
  nombreNuevoConvenio: string;
  nuevoTercero: number;
  usuario: number | null;
  empresaHomologa: number;
  periodoHomologa: number;
  dsusHomologa: number;
  dsusHomologador: number;
  empresaHomologador: number;
  pcodigoHomologador: string;
  suscripcion1: number;
  suscripcion2: number;
  consumo: string;
  medidor: string;
  observaciones: string;
  deshomologacion: boolean;
};
export type filterHomologacionInterface = {
  dsus9dsus_pcodigo: string;
  ter9ter_ideregistro: string;
  ter9ter_documento: string;
  pro9uni_tipovivienda: string;
  dsus9pro_catestrato: string;
  pro9ñpro_direccion: string;
  pro9pro_idepropieda: string;
  proyecto9proyecto_ideregistro: string;
  dsus9uni_barrio: string;
  dsus9dsus_ideregistr: string;
  dsus9uni_tipusosuscr: string;
  pro9pro_numcatastral: string;
  cic9cic_ideregistro: string;
  rut9rut_ideregistro: string;
  dsus9dsus_estado: string;
  empresa: null | number;
  proidepropieda: string;
  dsusIderegistr: string;
  dsusPcodigo: string;
  empresaSession: string;
  dsus8dsus_fecinicio: string;
  dsus9dsus_fecinicio: string;
};

export type filterSusHomologacion = {
  pcodigo: string;
  medidor: string;
  idsus: string | number | null;
  idempresa: number;
  deshomologacion: boolean;
};
