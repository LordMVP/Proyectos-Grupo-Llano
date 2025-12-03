import {
  RIndexVista,

  VistaNoPermitida,
  Reportes,

} from "../vistas/index";

const RUTAS_VISTA = {
  RAIZ: { url: "/", componente: RIndexVista },
  VISTA_NO_PERMITIDA: { url: "/no_autorizado", componente: VistaNoPermitida },
  
  HOMO_DESHOMO: {
    url: "/:id_reporte",
    componente: Reportes,
  },
};

export default RUTAS_VISTA;
