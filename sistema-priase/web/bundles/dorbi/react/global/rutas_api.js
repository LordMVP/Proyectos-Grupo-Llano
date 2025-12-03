const RUTAS_API = {
  MENU: {
    CONSULTAR_MENU: "global/menu",
  },

  GLOBAL: {
    CONSULTAR_FECHA_ACTUAL: "global/fechasistema",
    SUBIR_ARCHIVOS: "global/archivo/adjuntar",
    CONSULTAR_ARCHIVO_GRANDE: "/global/archivo/grande",
  },

  // EJEMPLO DE RUTA
  MODULO: {
    END_POINT: "ruta/servidor",
  },

  CONFIGURACION: {
    CONSULTA_CONFIGURACION: "configuracion/consultar",
    CONSULTAR_TIPOS: "configuracion/tipos/consultar",
    CONSULTAR_POR_TIPO: "configuracion/consultar",
    REGISTRAR: "configuracion/guardar",
    CONSULTA_UNIDAD_PROGRAMA: "configuracion/consultarunidadprograma",
    CONSULTAR_UNIDAD: "configuracion/consultarunidad",
  },

  DOCUMENTOS: {
    DESCARGAR_ARCHIVO: "global/archivo/consultar",
    SUBIR_ARCHIVO: "global/archivo/adjuntar",
  },

  PARAMETRIZACION: {
    GESTION_MENU: {
      OBTENER_SESION: "obtener/sesion",
    },

    REGIMEN_TARIFAS: {
      REGIMEN_TARIFAS: "regimen/tarifas",
      CONSULTA_REGIMEN_TARIFAS: "regimentarifario/consultar",
      CONSULTA_ENTIDAD: "terceros/consultar/entidad",
      GUARDAR_REGIMEN_TARIFAS: "regimentarifario/guardar",
    },

    AREAS_PRESTACION: {
      GUARDAR: "areaprestacion/guardar",
      CONSULTAR_REGIMEN_TARIFARIO: "regimentarifario/consultar",
      CONSULTAR_PROYECTOS: "proyectos/consultar",
      CONSULTAR_ESTRATOS: "areaprestacion/consultar/estratos",
      CONSULTAR_LIQUIDACION: "liquidacion/consultar",
      FILTRO: "areaprestacion/consultar",
    },

    ADMINISTRAR_RUTAS: {
      CONSULTAR_RUTAS: "ruta/consultar",
      CONSULTAR_CICLO: "ruta/ciclo/consultar",
      CONSULTAR_EMPRESAS: "ruta/consultar/empresas",
      CONSULTAR_TIPO_RUTA: "ruta/consultar/tiporuta",
      CONSULTAR_RUTAS_INDICADORES_CERTIFICADOS: "ruta/rna/certificados",
      GUARDAR: "ruta/guardar",
    },

    ADMINISTRAR_RUTAS_RECOLECCION: {
      CONSULTAR_TIPO_RUTA: "rutarecoleccion/consultar/tiporuta",
      CONSULTAR_MICRO_RUTA: "rutarecoleccion/consultar/microruta",
      CONSULTAR_RUTA_RECOLECCION: "rutarecoleccion/consultar",
      GUARDAR: "rutarecoleccion/guardar",
    },

    CREAR_PERIODOS: {
      GUARDAR: "periodos/guardar",
      CONSULTAR_PERIODO: "periodos/consultar",
      CONSULTAR_ANIO: "periodos/anio",
      CONSULTAR_SEMESTRE: "periodos/semestre",
      CONSULTAR_PERIODOS_MESES: "periodos/meses",
    },

    CARGAR_PERIODOS: {
      CONSULTAR_VARIABLES: "variables/consultar/variables/periodos",
      CONSULTAR_PERIODOS: "periodos/consultar/periodos/semestrales/area",
      CONSULTAR_PERIODOS_SEMESTRALES: "periodos/consultar/semestres/area",
      CONSULTAR_PERIODOS_SEMESTRALES_REGIMEN:
        "periodos/consultar/semestres/regimen",
      CONSULTAR_CONCEPTOS: "generico/consultar/concepto",
      CONSULTAR_CONCEPTOS_BASE: "recalculo/variables/obtenerConceptosBase",
      CONSULTAR_CONCEPTOS_INDICADORES: "generico/consultar/concepto/indicadores",
      CONSULTAR_VARIABLES_PENDIENTES:
        "variables/consultar/variables/pendientes",
      GUARDAR: "variables/guardar/variables/periodos",
      GUARDAR_MICRO: "variables/guardar/variables/periodos/micro",
      CONSULTAR_MESES_PERIODO: "periodos/semestre/meses",

      CONSULTAR_CONCEPTOS_INDICADOR_PRODUCTIVIDAD: "getion/consultar/concepto/indicador/productividad",
    },

    CARGAR_PERIODOS_APROVECHAMINETO: {
      CONSULTAR_APROVECHADORES: "terceros/consultar/aprovechador",
      CONSULTAR_VARIABLES_APROVECHAMIENTO:
        "variables/consultar/variables/periodos/aprovechamiento",
      GUARDAR: "variables/guardar/variables/periodos/aprovechamiento",
      CONSULTAR_VARIABLES_PENDIENTES:
        "/variables/consultar/variables/aprovechamiento/pendiente",
    },
  },
  CALCULO_TARIFAS: {
    CALCULO_SEMESTRAL: {
      CERTIFICAR_VARIABLES: "variables/certificar/variables/calculadas",
      CALCULAR: "liquidacion/calcular/variables",
      BALANCE_MASAS: "liquidacion/calcular/balance/masas",
      CONSULTAR_VARIABLES_BASE: "/variables/consultar/variables/base",
      CONSULTAR_VARIABLES_CALCULADAS: "/variables/consultar/variables/calculadas",
      CONSULTAR_PORCENTAJES_CALCULADOS: "/variables/consultar/porcentajes",
    },
    CERRAR_SEMESTRE: {
      CERRAR_PERIODO_SEMESTRAL: "periodos/cerrar/semestre",
    },
  },
  PRIORIZACION: {
    CONCEPTOS: "priorizar/concepto",
    DOCUMENTOS: "priorizar/documento",
    TIPO_DOCUMENTOS: "priorizar/tipoDocumento",
    CONVENIOS_HOMOLOGADOS: "priorizar/disconven",
  },
  COMISION: {
    TERCEROS: "comision/terceros",
    COVEN: "comision/convenios",
    CTAS: "comision/cuentas",
    RANGOS: "comision/cartera/rangos",
    IMPUESTOS: "comision/impuestos",
    RECAUDOS: "comision/recaudos",
    REC_CARTERA: "comision/cartera",
  },
  GEN_COMISION: {
    RECAUDOS: "generacion/comision/recaudo",
    NOVEDADES_REC_CONSULTAR: "observacion/recaudo/3",
    NOVEDADES_REC_CREAR: "observacion/recaudo/1",
    NOVEDADES_REC_ELIMINAR: "observacion/recaudo/2",
    NOVEDADES_REC_MODIFICAR: "observacion/recaudo/5",
    PERIODO_REC: "periodo/202",
    PERIODO_REC_CERRAR: "periodo/cerrar/202",
    ARCHIVO_REC_CREAR: "archivo/recaudo/1",
    ARCHIVO_REC_ELIMINAR: "archivo/recaudo/2",
    CARTERA: "generacion/comision/cartera",
    NOVEDADES_CARTERA_CONSULTAR: "observacion/cartera/3",
    NOVEDADES_CARTERA_CREAR: "observacion/cartera/1",
    NOVEDADES_CARTERA_ELIMINAR: "observacion/cartera/2",
    NOVEDADES_CARTERA_MODIFICAR: "observacion/cartera/5",
    PERIODO_CARTERA: "periodo/203",
    PERIODO_CARTERA_CERRAR: "periodo/cerrar/203",
    ARCHIVO_CARTERA_CREAR: "archivo/cartera/1",
    ARCHIVO_CARTERA_ELIMINAR: "archivo/cartera/2",
    ARCHIVO: "archivo",
    SEG_RECAUDOS: "recaudo/seguimiento",
  },
  GESTION_COSTOS_PRODUCTIVIDAD: {
    OBTENER_VARIACIONES: "gestion/costos/obtenervariaciones",
    INSERTAR_VALORES: "gestion/costos/insertarvariacion",
    CAMBIO_BASE_VARIACIONES: "gestion/costos/cambiobasevariaciones",
    OBTENER_VARIACIONES_TOTALES: "gestion/costos/obtenervariacionestotales",
  },
  RECALCULO_APROVECHAMIENTO: {
    OBTENER_HISTORICO_TONELADAS: "recalculo/aprovechamiento/obtenertoneladas",
    INSERTAR_TONELADAS: "recalculo/aprovechamiento/insertartoneladas",
    VERIFICAR_TA_INICIAL: "recalculo/aprovechamiento/validarTA",
    CALCULAR_TA_INICIAL: "recalculo/aprovechamiento/calculaPrimerTA",
    RECALCULAR: "recalculo/aprovechamiento/recalcular",
    OBTENER_CONCEPTOS_RECALCULO: "recalculo/aprovechamiento/obtenerConcepto",
    OBTENER_HISTORICO_RECALCULO: "recalculo/aprovechamiento/obtenerHistoricoRecalculoidPeriodo",
    OBTENER_VALORES_RECALCULO: "recalculo/aprovechamiento/obtenerConceptoCalculado",
    OBTENER_PORCENTAJES_RECALCULADOS: "recalculo/aprovechamiento/porcentajesCalculados",
    OBTENER_PORCENTAJES_UNO_DOS: "recalculo/consultar/porcentajespromedios"
  },
  RECALCULO_VARIABLE: {
    OBTENER_CONCEPTOS_CONSTANTES: "recalculo/variables/obtenerConceptosConstante",
    ACTUALIZAR_CONCEPTOS_CONSTANTES: "recalculo/variables/actualizarConstantes",
    OBTENER_CONCEPTOS_BASE: "recalculo/variables/obtenerConceptosBase",
    ACTUALIZAR_CONCEPTOS_BASE: "recalculo/variables/actualizarBases",
    HISTORICO_DEVOLUCIONES: "recalculo/variables/obtenerHistoricoDevoluciones",
    DEVOLUCIONES_RECALCULAR: "recalculo/variables/recalcular",
	OBTENER_CONCEPTOS_CALCULADOS: "recalculo/variables/obtenerConceptoCalculado",
    ACTUALIZAR_HISTORICO_DEVOLUCION: "recalculo/variables/actualizarHistorico"
  }
};

export default RUTAS_API;
