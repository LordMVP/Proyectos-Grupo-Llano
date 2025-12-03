import {
  RIndexVista,
  RConsultaConfiguracion,
  RGestionConfiguracion,
  RegimenTarifas,
  RConsultaRegimenTarifas,
  RAreasPrestacion,
  VistaNoPermitida,
  RGestionReporteador,
  RGestionAdministrarRutas,
  RGestionAdministrarRutasRecoleccion,
  RGestionCrearPeriodos,
  RGestionInterfazActualizacion,
  RGestionGestionInformacionOperativa,
  RGestionCargarVariablesPeriodos,
  RCargarVariablesAprovechamiento,
  RCertificarVariablesAprovechamiento,
  RCertificarVariablesTarifas,
  RGestionCalculoTarifasMensuales,
  RGestionCalculoTarifasSemestrales,
  RGestionCerrarSemestre,
  RPriorizacionConceptos,
  RPriorizacionDocumentos,
  RPriorizacionTipoDocumentos,
  RPriorizacionConHomologados,
  RComRecaudo,
  RComRecCartera,
  RGenComRecaudo,
  RGenComRecCartera,
  //RSegRecaudo,
  RGestionActualizacionCostos,
  RIngresoToneladas,
  RRecalculoAprovechamiento,
  RIndicadoresCalidad,
  RIngresoVariablesBase,
  RCalculoAjustesDevoluciones
} from "../vistas/index";

const RUTAS_VISTA = {
  RAIZ: { url: "/", componente: RIndexVista },
  VISTA_NO_PERMITIDA: { url: "/no_autorizado", componente: VistaNoPermitida },
  CONSULTA_CONFIGURACION: {
    url: "/consultar_configuracion",
    componente: RConsultaConfiguracion,
  },
  GESTION_CONFIGURACION: {
    url: "/gestion_configuracion",
    componente: RGestionConfiguracion,
  },
  REGIMEN_TARIFAS: { url: "/regimen_tarifas", componente: RegimenTarifas },
  CONSULTA_REGIMEN_TARIFAS: {
    url: "/consulta_regimen_tarifas",
    componente: RConsultaRegimenTarifas,
  },
  AREAS_PRESTACION: { url: "/areas_prestacion", componente: RAreasPrestacion },
  REPORTEADOR: { url: "/reporteador", componente: RGestionReporteador },
  ADMINISTRAR_RUTAS: {
    url: "/administrar_rutas",
    componente: RGestionAdministrarRutas,
  },
  ADMINISTRAR_RUTAS_RECOLECCION: {
    url: "/administrar_rutas_recoleccion",
    componente: RGestionAdministrarRutasRecoleccion,
  },
  CREAR_PERIODOS: { url: "/crear_periodos", componente: RGestionCrearPeriodos },
  INTERFAZ_ACTUALIZACION: {
    url: "/interfaz_actualizacion",
    componente: RGestionInterfazActualizacion,
  },
  GESTOR_INFORMACION_OPERATIVA: {
    url: "/gestor_informacion_operativa",
    componente: RGestionGestionInformacionOperativa,
  },
  GESTION_CARGAR_PERIODOS: {
    url: "/gestion_cargar_variables_periodos",
    componente: RGestionCargarVariablesPeriodos,
  },
  GESTION_CARGAR_PERIODOS_APROVECHAMIENTO: {
    url: "/gestion_cargar_variables_aprovechamiento",
    componente: RCargarVariablesAprovechamiento,
  },
  CERTIFICAR_VARIABLES_APROVECHAMIENTO: {
    url: "/certificar_variables_aprovechamiento",
    componente: RCertificarVariablesAprovechamiento,
  },
  CERTIFICAR_VARIABLES_TARIFAS: {
    url: "/certificar_variables_tarifas",
    componente: RCertificarVariablesTarifas,
  },
  CALCULAR_TARIFAS_MENSUALES: {
    url: "/calcular_tarifas_mensuales",
    componente: RGestionCalculoTarifasMensuales,
  },
  CALCULAR_TARIFAS_SEMESTRALES: {
    url: "/calcular_tarifas_semestrales",
    componente: RGestionCalculoTarifasSemestrales,
  },
  CERRAR_SEMESTRE: {
    url: "/cerrar_semestre",
    componente: RGestionCerrarSemestre,
  },
  PRIORIZACION_CONCEPTOS: {
    url: "/priorizacion_conceptos",
    componente: RPriorizacionConceptos,
  },
  PRIORIZACION_DOCUMENTOS: {
    url: "/priorizacion_documentos",
    componente: RPriorizacionDocumentos,
  },
  PRIORIZACION_TIPO_DOCUMENTOS: {
    url: "/priorizacion_tipo_documentos",
    componente: RPriorizacionTipoDocumentos,
  },
  PRIORIZACION_CONVENIOS_HOMOLOGAODS: {
    url: "/priorizacion_convenios_homologados",
    componente: RPriorizacionConHomologados,
  },
  COMISION_RECAUDO: { url: "/comision_recaudo_759", componente: RComRecaudo },
  COMISION_RECUPERACION_CARTERA: {
    url: "/comision_recuperacion_cartera_760",
    componente: RComRecCartera,
  },
  GEN_COMISION_RECAUDO: {
    url: "/gen_comision_recaudo_988",
    componente: RGenComRecaudo,
  },
  GEN_COMISION_RECUPERACION_CARTERA: {
    url: "/gen_comision_recuperacion_cartera_989",
    componente: RGenComRecCartera,
  },
  
  INDICADORES_CALIDAD: {
    url: "/IndicadoresCalidad",
    componente: RIndicadoresCalidad,
  },
  ACTUALIZACION_COSTOS: {
    url: "/ActualizacionCostos",
    componente: RGestionActualizacionCostos,
  },
  GESTION_CARGAR_TONELADAS: {
    url: "/GestionCargarToneladas",
    componente: RIngresoToneladas,
  },
  GESTION_CALCULO_APROVECHAMIENTO: {
    url: "/RecalculoAprovechamiento",
    componente: RRecalculoAprovechamiento,
  },
  GESTION_ACTUALIZAR_VARIABLES_BASE: {
    url: "/IngresoVariablesBase",
    componente: RIngresoVariablesBase,
  },
  GESTION_CALCULO_AJUSTES_DEVOLUCIONES: {
    url: "/CalculoAjustesDevoluciones",
    componente: RCalculoAjustesDevoluciones,
  },
};

export default RUTAS_VISTA;
