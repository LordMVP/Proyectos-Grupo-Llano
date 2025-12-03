import {
  RIndexVista,
  RConsultaConfiguracion,
  RGestionConfiguracion,
  VistaNoPermitida,
  DescuentoPuertaPuerta,
  DescuentoDeshabitado,
  IndicadoresDeCalidad,
  CambiosEstrato,
  CambiosTipoDeUso,
  AforoExtraordinario,
  AdicionEliminacionDeuda,
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
  NOTA_DESCUENTO_PUERTA_A_PUERTA: {
    url: "/descuento_puerta_713",
    componente: DescuentoPuertaPuerta,
  },
  NOTA_DESCUENTO_DESHABITADOS: {
    url: "/descuento_deshabitados_712",
    componente: DescuentoDeshabitado,
  },
  DESCUENTO_INDICADORES: {
    url: "/descuento_indicadores_714",
    componente: IndicadoresDeCalidad,
  },
  DESCUENTO_CAMBIOS_ESTRATO: {
    url: "/cambio_estrato_715",
    componente: CambiosEstrato,
  },
  DESCUENTO_TIPO_DE_USO: {
    url: "/cambio_tipo_uso_716",
    componente: CambiosTipoDeUso,
  },
  DESCUENTO_AFORO_EXTRAORDINARIO: {
    url: "/descuento_aforo_722",
    componente: AforoExtraordinario,
  },
  ADICION_ELIMINACION_DEUDA: {
    url: "/eliminacion_deuda_758",
    componente: AdicionEliminacionDeuda,
  },
};

export default RUTAS_VISTA;
