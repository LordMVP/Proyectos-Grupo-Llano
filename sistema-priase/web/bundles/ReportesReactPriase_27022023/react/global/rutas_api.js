const RUTAS_API = {
  MENU: {
    CONSULTAR_MENU: "global/menu",
  },

  GLOBAL: {
    CONSULTAR_FECHA_ACTUAL: "global/fechasistema",
    SUBIR_ARCHIVOS: "global/archivo/adjuntar",
    CONSULTAR_ARCHIVO_GRANDE: "global/archivo/grande",
  },

  // EJEMPLO DE RUTA
  MODULO: {
    END_POINT: "ruta/servidor",
  },

  DETALLE_SUSCRIPCION: {
    CONSULTA_DETALLE_SUSCRIPCION: "dsusdetsuscrip/consultaDetalle",
    CONSULTA_DETALLE_SUSCRIPCION_ESTRATO:
      "dsusdetsuscrip/consultaDetalleEstrato",
    CONSULTA_DETALLT_SUSCIPCION_TIPO_USO:
      "dsusdetsuscrip/consultaDetalleTipoUso",
    CONSULTA_DETALLE_SUSCIPCION_AFORO: "dsusdetsuscrip/consultaDetalleAforados",
    CONSULTA_POR_MEDIDOR: "dsusdetsuscrip/consultaPorMedidor",
    CONSULTA_DETALLE_DESHABITADO: "dsusdeshabitado/consultaDeshabitado",
    CONSULTA_DESHABITADO_CONCEPTO: "dsusdeshabitado/consultaConceptoDeshab",
    CONSULTA_MARCACION_TARIFA: "dsusdetsuscrip/consultaMarcacionTarifa",
    CONSULTA_SUSCRIPCIONES_RELIQUIDADAS:
      "dsusdetsuscrip/consultaSuscripReliquidadas",
    CONSULTA_CONCEPTOS_SUSCRIPCIONES_RELIQUIDADAS:
      "dsusdetsuscrip/consultaConceptosSuscripReliquidada",
    CONSULTA_DETALLE_DEUDA: "dsusdetsuscrip/consultaDetalleNotaDeuda",
    CONSULTA_CONCEPTOS_FACTURA_DEUDA:
      "dsusdetsuscrip/consultaConceptosDeuda",
    CONSULTA_DETALLE_CONCEPTOS_FACTURA_DEUDA:
      "dsusdetsuscrip/consultaConceptosDeudaReliq",
    GUARDAR_CONCEPTOS_FACTURA_DEUDA:
      "dsusdetsuscrip/insertarDeudaTmp",
  },

  DOCUMENTO: {
    CONSULTA_DOCUMENTOS: "docdocumento/consultaDocumentos",
    CONSULTA_TIPO_DOCUMENTOS: "tidotipdocumen/tipoDocumento",
  },

  PERMISOS_USUARIO: {
    CONSULTA_PERMISOS: "uspuusuprgunid/consultaPrivilegios",
  },

  PAR_PARAMETRO: {
    CONSULTA_ACCIONES_DESHABITADO: "parparametro/consultaAccionesDeshabitado",
    CONSULTA_HOLGURA_INICIO_VIGENCIA: "parparametro/consultaHolgIniVigen",
  },

  CICLO: {
    CONSULTA_CICLOS: "cicciclo/consultaCiclos",
  },

  LIQUIDACION: {
    RELIQUIDACION: "liquidacion/Reliquidacion",
    CANCELAR_RELIQUIDACION: "liquidacion/cancelarReliquidacion",
    CONSULTA_PROCESO_RELIQUIDACION: "liquidacion/consultarProcesoEjecucionReliquidacion",
    RELIQUIDACION_ADICION_ELIMINACION_DEUDA: "liquidacion/gestionDeuda",
    CONSULTA_PROCESO_DESCUENTO_CALIDAD: "liquidacion/consultarProcesoCalidad",
  },

  COSU_CONSUSCRIP: {
    MARCACION_TARIFA: "cosuconsuscrip/marcacionTarifa",
  },

  PQR: {
    CONSULTA_PQR: "reclamos/consultaPqr",
    MODIFICAR_OBSERVACION_PQR: "reclamos/modificarPqr",
  },

  NOTAS: {
    AGREGAR_VISITAS_SOL: "visitasSol/agregar",
    AGREGAR_NOTA_NOFA: "notNota/agregarNota",
    TIPO_NOTAS: "parparametro/consultaTipoNota",
    MOTIVO_NOTAS: "parparametro/consultaMotivoNota",
    CODIGO_NOVEDAD: "novedadesradicado/codigoNovedad",
    LIQUIDAR_NOTA: "liquidacion/GenerarNota",
  },

  EMPRESAS: {
    LIST_EMPRESAS: "empresas/listaHomologada",
    ATRIBUTO: "empresas/lista",
  },

  DOWNLOADFILES: {
    LIQUIDACIONESSIMULACION: "reportes/facturasLiquidadas",
    LIQUIDACIONESTRATOS: "reportes/facturasLiquidadasEstrato",
    LIQUIDACIONESFUTURO: "reportes/facturasLiquidadasFuturo",
    LIQUIDACIONESTIPOUSO: "reportes/facturasLiquidadasTipoUso",
    LIQUIDACIONESAFORO: "reportes/facturasLiquidadasAforo",
    LIQUIDACIONESDEUDA: "reportes/notasInclusionEliminacionDeuda",
  },

  INDICADOR_CALIDAD: {
    PERIODO: "parparametro/consultaPeriodoIndicadorCalidad",
    HABILITAR_DESCUENTO: "parparametro/habilitarPeriodoIndicadorCalidad",
  },

  DESCUENTO_CALIDAD: {
    APLICAR_DESCUENTO: "decadesccalidad/descuentoCalidad",
  },

  TERCEROS: {
    CONSULTAR_NOMBRES: "tertercero/nombresPorEmpresa",
  },
  REPORTES: {
    CONSULTAR_REPORTES: "reportes",
    CONSULTAR_REPORTE: "reportes/getByPriase",
  },
};

export default RUTAS_API;
