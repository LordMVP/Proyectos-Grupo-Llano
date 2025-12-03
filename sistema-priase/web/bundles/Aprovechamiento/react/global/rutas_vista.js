import {
  RIndexVista,
  RConsultaConfiguracion,
  RGestionConfiguracion,
  VistaNoPermitida,
  ReporteFacturasCastigadas,
  ConsolidadoPagoAprovechador,
  ParamLiquidacion,
  RTablaConsolidadoFacturas,
  FacturacionAprovechamiento,
  RecaudoPorAprovechador,
  ComportamientoPresupuestado,
  DetalleGirosPorAsociacion,
  SalsoCarteraAprovechamiento,
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
  REPORTE_FACTURAS_CASTIGADAS: {
    url: "/carta_castigada_742",
    componente: ReporteFacturasCastigadas,
  },
  LIQUIDACION_PAGO_APROVECHADOR: {
    url: "/liquidacion_aprove_736",
    componente: ConsolidadoPagoAprovechador,
  },
  LIQUIDACION_PAGO_INCENTIVO_APROVECHADOR: {
    url: "/liquidacion_incen_aprove_737",
    componente: ConsolidadoPagoAprovechador,
  },
  PARAMETRIZACION_LIQUIDACION: {
    url: "/par_liquidacion_aprove_717",
    componente: ParamLiquidacion,
  },
  FACTURACION_APROCHAMIENTO: {
    url: "/fac_aprovecha_741",
    componente: FacturacionAprovechamiento,
  },
  RECAUDO_POR_APROVECHADOR: {
    url: "/recaudo_aprovechador_740",
    componente: RecaudoPorAprovechador,
  },
  COMPORTAMIENTO_PRESUPUESTADO: {
    url: "/comportamiento_presupuesto_744",
    componente: ComportamientoPresupuestado,
  },
  DETALLE_GIROS_POR_ASOCIACION: {
    url: "/detalle_giros_745",
    componente: DetalleGirosPorAsociacion,
  },
  SALSO_CARTERA_APROVECHAMIENTO: {
    url: "/saldo_cartera_aprov_746",
    componente: SalsoCarteraAprovechamiento,
  },
};

export default RUTAS_VISTA;
