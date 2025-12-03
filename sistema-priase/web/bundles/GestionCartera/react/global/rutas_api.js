const RUTAS_API = {

  MENU: {
    CONSULTAR_MENU: 'global/menu',
  },

  GLOBAL: {
    CONSULTAR_FECHA_ACTUAL: 'global/fechasistema',
    SUBIR_ARCHIVOS: 'global/archivo/adjuntar',
    CONSULTAR_ARCHIVO_GRANDE : 'global/archivo/grande'
  },

  // EJEMPLO DE RUTA
  DATOS_GENERALES: {
    CONSULTA_DATOS_GENERALES_EJECUTIVO: 'datogeneral/ejecutivo/datoGeneral',
    CONSULTA_DATOS_GENERALES_VARIABLE_GLOBAL: 'datogeneral/vglobal/datoGeneral',
    CONSULTA_DATOS_DATOS_GENERALES: 'datogeneral/general'
  },

  EDAD_CARTERA: {
    CONSULTA_EDAD_CARTERA: 'edadcartera/getEdadCarteraEmpresa',
    GUARDAR_EDAD_CARTERA: 'edadcartera/guardarEdadCartera'
  },

  NOVEDAD_VISITA: {
    CONSULTA_NOVEDAD_VISITA: 'nvisita/getNovedadVisitaEmpresa',
    GUARDAR_NOVEDAD_VISITA: 'nvisita/guardarNovedadVisita',
    CONSULTA_NOVEDAD_VISITA_RECURSO: 'nvisita/getNovedadVisitaRecurso',
    GUARDAR_NOVEDAD_VISITA_RECURSO: 'nvisita/guardarNovedadVisitaDetalle',
    ELIMINAR_NOVEDAD_VISITA_RECURSO: 'nvisita/eliminarNovedadVisitaDetalle'
  },

  METAS_GESTION: {
    CONSULTA_METAS_GESTION: 'mgestion/getMGestionEmpresa',
    GUARDAR_METAS_GESTION: 'mgestion/guardarMGestion',
    CONSULTA_METAS_GESTION_DETALLE: 'mgestion/getMGestionDetalle',
    GUARDAR_METAS_GESTION_DETALLE: 'mgestion/guardarMGestionDetalle',
    ELIMINAR_METAS_GESTION_DETALLE: 'mgestion/eliminarMGestionaDetalle'
  },

  ESTRATEGIA: {
    CONSULTA_ESTRATEGIA: 'estrategia/getEstrategiaEmpresa',
    GUARDAR_ESTRATEGIA: 'estrategia/guardarEstrategia'
  },

  ORIENTACION: {
    CONSULTA_ORIENTACION: 'orientacion/getOrientacionEmpresa',
    GUARDAR_ORIENTACION: 'orientacion/guardarOrientacion'
  },

  CONDONACION: {
    CONSULTA_CONDONACION: 'condonacion/getCondonacion',
    GUARDAR_CONDONACION: 'condonacion/guardarCondonacion'
  },

  CLASIFICACION: {
    CONSULTA_CLASIFICACION: 'clasificacion/getClasificacionEmpresa',
    GUARDAR_CLASIFICACION: 'clasificacion/guardarClasificacion'
  },

  ESTADO_CARTERA: {
    CONSULTA_ESTADO_CARTERA: 'estadocartera/getEstadoCarteraEmpresa',
    GUARDAR_ESTADO_CARTERA: 'estadocartera/guardarEstadoCartera'
  },

  EJECUTIVO: {
    CONSULTA_EJECUTIVO: 'ejecutivo/getEjecutivoEmpresa',
    GUARDAR_EJECUTIVO: 'ejecutivo/guardarEjecutivo',
    CONSULTA_DATOS_DATOS_GENERALES: 'ejecutivo/general'
  },

  VARIABLE_GLOBAL: {
    CONSULTA_VARIABLE_GLOBAL: 'vglobal/getVGlobalEmpresaDto',
    GUARDAR_VARIABLE_GLOBAL: 'vglobal/guardarVGlobal',
    CONSULTA_VARIABLE_GLOBAL_INPUT: 'vglobal/getVGlobal',
    CONSULTA_DATOS_DATOS_GENERALES: 'vglobal/general'
  },

  TABLA_COMISIONAL: {
    CONSULTA_TABLA_COMISONAL_EMPRESA: 'tcomisional/getTComisionalEmpresa',
    GUARDAR_TABLA_COMISIONAL: 'tcomisional/guardarTComisional',
    CONSULTA_TABLA_COMISIONAL_DETALLE: 'tcomisional/getTComisionalDetalle',
    GUARDAR_TABLA_COMISIONAL_DETALLE: 'tcomisional/guardarTComisionalDetalle',
    ELIMINAR_TABLA_COMISIONAL_DETALLE: 'tcomisional/eliminarTComisionalDetalle'
  },

  UNIDAD: {
    CONSULTA_UNIDAD: 'unidad/getUnidad'
  },

  META_GESTION: {
    CONSULTA_META_GESTION: 'mgestion/getMGestionEmpresa'
  },

  SECTOR_COMUNA: {
    CONSULTA_SECTOR_COMUNA: 'sector/getSector'
  },

  TERCERO: {
    CONSULTA_TERCERO_NOMBRE: 'tercero/getNombre', 
    CONSULTA_TERCERO_DOCUMENTO: 'tercero/getDocumento'
  },

  MAESTRO_GESTION:{
    GUARDAR_MAESTRO_GESTION: 'filtro/guardarFiltro',
    CONSULTA_DATOS_FILTROS: 'filtro/getFiltroUserEmpresa',
    BUSQUEDA_DATOS_FILTRO: 'filtro/getFiltro',
    DATOS_GENERALES: 'mgdatogeneral/general',
    CIUDADES_POR_DEPARTAMENTO: 'mgdatogeneral/ciudad',
    BARRIOS_POR_CIUDADES: 'mgdatogeneral/barrio',
    EJECUTIVOS_POR_ESTRATEGIA: 'mgdatogeneral/ejecutivo',
    EJECUTAR_FILTRO: 'maestrogestion/consultarmaestro',
    LIST_MAESTRO_DETALLE: 'maestrogestion/consultarmaestrodetalle',
    ASIGNACION_DISTRIBUCION: 'maestrogestion/inicializar/asignacion',
    EJECUTAR_BUSQUEDA_TERCERO: 'maestrogestion/consultar/tercero',
    GENERAR_CARTAS: 'maestrogestion/asignacion/generarcartas',
    GENERAR_IVR: 'maestrogestion/asignacion/generarivr',
    GENERAR_EXCEL: 'maestrogestion/consultar/exportarexcel',
    GENERAR_EXCELIVR: 'maestrogestion/consultar/exportargestionivrcsv',
  },
  
  INICIALIZAR_GESTION:{
    DATOS_GENERALES: 'maestrogestion/consultar',
    INICIALIZAR_GESTION: 'maestrogestion/inicializar',
    CAMBIO_ESTADOS: 'maestrogestion/procesar'
   },
  
  LIQUIDAR_COMISION:{
    DATOS_GENERALES: 'gestioncomision/consultar',
    INICIALIZAR_LIQUIDACION: 'gestioncomision/inicializar',
    GUARDAR_ABONO: 'gestioncomision/guardarabono',
    DATOS_DETALLE: 'gestioncomision/consultardetalle',
    CONSULTAR_LIQUIDACION: 'gestioncomision/consultarliq',
    RECALCULAR_LIQUIDACION: 'gestioncomision/recalcular',
    CONFIRMAR_LIQUIDACION: 'gestioncomision/procesar',
    CERRAR_LIQUIDACION: 'gestioncomision/procesar',
    ELIMINAR_VACIOS: 'gestioncomision/eliminar',
   },

  GESTION_VISITA:{
    CONSULTA_NRECURSO: 'maestrogestion/consultarnovedadrecurso',
    GUARDAR_GESTION_VISITA: 'maestrogestion/gestionvisita/crear',
    GUARDAR_ARCHIVO: 'maestrogestion/gestionvisita/archivo',
    CONSULTAR_GESTION_VISITA: 'maestrogestion/consultargestionvisita',
    ELIMINAR_REGISTRO: 'maestrogestion/gestionvisita/archivo/eliminar',
  },

  INICIA_DETERIORO_NIFF:{
    DATOS_GENERALES: 'gestionniff/datogeneral',
    CONSULTAR_INICIACION: 'gestionniff/consultar',
    INICIALIZAR_DETERIORO: 'gestionniff/inicializar',
    CAMBIO_ESTADOS: 'gestionniff/procesar',
    CONSULTA_DETALLE_CONCEPTOS: 'gestionniff/consultardetalle',
    CONSULTA_DETERIORO: 'gestionniff/consultarresumen',
    COMPARACION_DETERIORO: 'gestionniff/consultarcomparativo',
    GENERAR_EXCEL: 'gestionniff/consultarresumenexportar',
    GENERAR_EXCEL_COMPARATIVO: 'gestionniff/consultarcomparativoexportar'
   },

   EXPORTAR_KACTUS:{
    DATOS_GENERALES: 'kactus/consultar',
    CONSULTAR_COMISION: 'kactus/consultardetalle',
    ENVIAR_KACTUS: 'kactus/procesar',
   
   },
   
   CUMPLIMIENTO_METAS:{
    DATOS_GENERALES: 'cumplimientometa/datogeneral',
    CONSOLIDAR_METAS: 'cumplimientometa/inicializar',
    DATOS_DETALLE: 'cumplimientometa/consultardetalle',
    CONSULTAR_BASICAMETAS: 'cumplimientometa/consultar',
    RECALCULAR_METAS: 'cumplimientometa/recalcular',
    CONFIRMAR_META: 'cumplimientometa/procesar',
    CERRAR_METAS: 'cumplimientometa/procesar',
    DATOS_GENERALES_CONSULTAR_METAS: 'cumplimientometa/consultar/datogeneral',
    CONSULTAR_HISTORICOS_METAS: 'cumplimientometa/consultar/historico',
   }
};

export default RUTAS_API;
