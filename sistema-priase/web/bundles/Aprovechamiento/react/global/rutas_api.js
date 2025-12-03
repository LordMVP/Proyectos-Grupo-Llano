const dominion = ``;
//bioagricola-aprovechamiento/
const RUTAS_API = {
  MENU: {
    CONSULTAR_MENU: `global/menu`,
  },

  GLOBAL: {
    CONSULTAR_FECHA_ACTUAL: `global/fechasistema`,
    SUBIR_ARCHIVOS: `global/archivo/adjuntar`,
    CONSULTAR_ARCHIVO_GRANDE: `global/archivo/grande`,
  },

  // EJEMPLO DE RUTA
  MODULO: {
    END_POINT: `ruta/servidor`,
  },

  PAR_PARAMETRO: {
    CONSULTA_PARAMETROS_APROVECHAMIENTO: `parparametro/consultaParametrosAprovechamiento`,
  },

  TER_TERCERO: {
    CONSULTA_APROVECHADORES_POR_NOMBRE: `tertercero/consultaTercerosAprovechadoresPorNombre`,
    CONSULTA_APROVECHADORES_POR_DOCUMENTO_Y_DIGITO: `tertercero/consultaTercerosAprovechadoresPorDocumentoYDigito`,
    CONSULTA_APROVECHADORES_POR_CLASIFICACION: `tertercero/consultaTercerosAprovechadoresPorClasificacion`,
    CONSULTA_APROVECHADORES_INCENTIVO_POR_NOMBRE: `tertercero/consultaTercerosIncentivoAprovechadorPorNombre`,
  },
  LIQUIDACION_APROVECHAMIENTO: {
    CONSULTA_PERIODO_LIQUIDAR: `liquidacion/periodo`,
    INICIAR_LIQUIDACION: `liquidacion/iniciarproceso`,
    PROGRESO_LIQUIDACION: `liquidacion/progreso`,
  },

  COLI_CONLIQUIDA_APROVECHAMIENTO: {
    CONSULTA_LIQUIDACIONES: `parparametrizacion/conceptosParametrizacion`,
    CONSULTA_MUNICIPIOS: `parparametrizacion/municipioTerceroAprovechador`,
    CONSULTA_CON_CONCEPTOS: `parparametrizacion/conceptosAprovechamiento`,
    CONSULTA_CONCEPTOS_LIQU: `parparametrizacion/listaConceptosParam`,
    CONSULTA_INSERTAR_CONCEPTO: `parparametrizacion`,
    CONSULTA_PERMISOS: `parparametrizacion/privilegios`,
  },

  COAP_CONSOLIDADOAPRO: {
    CONSULTA_FILTROS_PERIODO_CONSOLIDADO: `resumen-liquidacion/filtro-periodo`,
    CONSULTA_FILTRO_PERIODO_FACTURACION: `resumen-liquidacion/filtro-periodoFac`,
    CONSULTA_TERCERO_PERIODO_FACTURACION: `resumen-liquidacion/filtro-tercero`,
    CONSULTA_RESUMEN_CONSOLIDADO: `resumen-liquidacion/consulta`,
    CONSULTA_RESUMEN_CONSOLIDADO_INCENTIVO_APRO: `resumen-liquidacion/consulta-incentivoA`,
    CONSULTA_DETALLE_RESUMEN_CONSOLIDADO: `resumen-liquidacion/detalle`,
  },
  FACTURACION_APROVECHAMIENTO: {
    CONSULTA_RESPORTE_CONSOLIDADO_APROVECHAMIENTO: `${dominion}webresources/servicios/consolidacion/reporte-consolidado-aprovechamiento`,
    COSULTA_REPORTE_COSOLIDADO_PERIODOS: `${dominion}webresources/servicios/liquidacion/lista-periodos`,
    CONSULTA_REPORTE_TERCEROS_APROVECHAMIENTO_NOMBRE: `${dominion}webresources/servicios/tertercero/consultaTercerosAprovechadoresPorClasificacion?clasificacion=`,
  },

  REACUDO_APROVECHAMIENTO: {
    CONSULTA_RESPORTE_RECAUDO_APROVECHAMIENTO: `${dominion}webresources/servicios/consolidacion/reporte-recaudo-aprovechador`,
    SOPORTES_PAGOS_TERCEROS: `${dominion}webresources/servicios/soportes/pago-terceros?ideconsolidacion=`,
    DETALLE_RECAUDO_APROVECHADOR: `${dominion}webresources/servicios/consolidacion/detalle-recaudo-aprovechador?tercero=`,
    GENEARAR_OFICIO_TERCERO: `${dominion}webresources/servicios/consolidacion/generar-oficio-tercero-aprovechador`,
    DETALLE_RECAUDO_APROVECHADOR_PERIODOS: `${dominion}webresources/servicios/consolidacion/detalle-recaudo-aprovechador-periodos`,
    NOTAS_RECAUDO_TERCEROS: `${dominion}webresources/servicios/consolidacion/notas-recaudo-terceros`,
    REPORTE_CRUCE_RECAUDO: `${dominion}webresources/servicios/consolidacion/reporte-cruce-recaudo`,
    DETALLE_RECAUDO_APROVECHADOR_ALCALDIA: `${dominion}webresources/servicios/consolidacion/detalle-recaudo-alcaldia`,
    DETALLE_MES_RECAUDO_APROVECHADOR_ALCALDIA: `${dominion}webresources/servicios/consolidacion/detalle-mes-recaudo-alcaldia`,
    FACTURA_CASTIGADA: `${dominion}webresources/servicios/consolidacion/reporte-facturas-castigadas`,
  },

  CARTERA_CASTIGADA: {
    REPORTE_APROVECHADOR: `${dominion}webresources/servicios/consolidacion/reporte-consolidado-aprovechador-facturas-castigadas`,
  },
  COMPORTAMIENTO_PRESUPUESTADO: {
    CRITERIO_BUSQUEDA_REPORTE_FACTURA: `webresources/servicios/consolidacion/criterios-busqueda-reporte-facturacion`,
  },
  GIROS_POR_ASOCIACION: {
    CONSULTA_GIROS_POR_ASOCIACION: `${dominion}webresources/servicios/consolidacion/reporte-detalle-giros-tercero-aprovechador`,
    DETALLE_GIROS_POR_ASOCIACION: `${dominion}webresources/servicios/consolidacion/detalle-giros-aprovechadores_periodos`,
  },
  SALDO_CARTERA_APROVECHAMIENTO: {
    REPORTE_CONSOLIDADO: `${dominion}webresources/servicios/consolidacion/reporte-saldo-cartera_terceros`,
  },
};

export default RUTAS_API;
