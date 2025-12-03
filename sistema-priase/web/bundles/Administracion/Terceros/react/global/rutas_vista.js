import {
  RIndexVista,
  RConsultaConfiguracion,
  RGestionConfiguracion,
  VistaNoPermitida
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
  }
  
};

export default RUTAS_VISTA;
