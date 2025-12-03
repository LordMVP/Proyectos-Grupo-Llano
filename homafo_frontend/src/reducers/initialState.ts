// const token = localStorage.getItem('jdzlToken')

export interface IRootState {
  user: any;
  aforos: any[];
  aforosMulti: any[];
  AforosVisitas: any[];
  selects: any[];
  selectsMulti: any[];
  aforosHistoricos: any[];
  suscription: any;
  suscriptionTercero: any;
  suscriptionSuscripcion: any;
  homologacion: any;
  tablasGestion: any;
}

const initialState = {
  user: { authenticated: true },
  aforos: [],
  aforosMulti: [],
  AforosVisitas: [],
  aforosHistoricos: [],
  selects: {
    //aforo Normal

    tiposAforo: [],
    frecuenciaRecoleccion: [],
    Barrio: [],
    conceptoAforo: [],
    tecnicoAforador: [],
    Municipio: [],
    Actividad: [],
    tipoGenerador: [],
    Estado: [],
    Departamento: [],
    tipoUso: [],
    Ciclo: [],
    Ruta: [],
    Estrato: [],
    Ubicacion: [],
  },
  selectsMulti: {
    //aforo multi

    tiposAforoMulti: [],
    tiposDistribucion: [],
    nombresMulti: [],
    departamentosMulti: [],
    MunicipiosMulti: [],
    barriosMulti: [],
    NuevoSuscripcionList: [],
    Estado: [],
    tecnicoAforador: [],
  },
  suscription: {
    ciudades: [],
    tipos_indentificacion: [],
    tipos_persona: [],
    municipios: [],
    barrios: [],
  },
  suscriptionTercero: {
    resultSearch: null,
    clasificaciones: [],
    crear: null,
    actualizar: null,
    complementos_direccion: [],
    token_mapa: null,
    geo_data: null,
    geo_data_caracteristicas: null,
    lista_capas: [],
    tipos_propiedad: [],
    tipos_vivienda: [],
    crear_propiedad: null,
    update_propiedad: null,
    clonar_propiedad: null,
    delete_propiedad: null,
    lista_propiedades_tercero: [],
    propiedad: null,
  },
  suscriptionSuscripcion: {
    convenios: null,
    crear_suscriptor: null,
    crear_suscripcion: null,
    edit_suscripcion: null,
    search_id: null,
    detalles: null,
    propiedades: null,
    suscripcion_by_tercero: null,
    filtrar_suscripcion: null,
    estados: null,
    estratos: null,
    tipos_uso: null,
    liquidaciones: null,
    ciclos: null,
    rutas: null,
    rutasAprovechamiento: null,
    macroRutas: null,
    macroRutas_by_id: null,
    horarios: null,
    horarios_rutas: null,
    actividad_economica: null,
    tipos_suscripcion: null,
    conceptos: null,
    empresas: null,
  },
  homologacion: {
    buscar: null,
    buscarHomologaciones: null,
    detalle_sus: null,
    convenios: null,
    empreas_convenios: null,
    convenios_empresas: null,
    actualizar: null,
    susHomologacion: null,
    empresas: null,
    empresasHologables: null,
  },
  tablasGestion: {
    listaBarriosAseo: [],
    listaUnidadesEdit: [],
    listaActualizacionOthers: [],
    listaActualizacionPunto: [],
    listaNovedad: [],
    actualizacion: null,
    imagenesActualizacion: [],
    updateActualizacion: null,
    aprobarActualizacion: null,
    borrarActualizacion: null,
    borrarNovedad: null,
    aprobarNovedad: null,
    imagenesNovedad: [],
  },
};

export default initialState;
