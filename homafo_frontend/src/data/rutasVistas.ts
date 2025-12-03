import React from "react";
import AforoNormal from "../containers/aforos/Normales";
import MultiUsuarios from "../containers/aforos/Multiusuarios";
import Visitas from "../containers/aforos/Visitas";
import VisitasConsultar from "../containers/aforos/visitas/Consultar";
import EditarAforoMulti from "../containers/aforos/multiusuario/EditarAforoMulti";
import EditarAforo from "../containers/aforos/normal/EditarAforo";
import EditarVisitas from "../containers/aforos/visitas/RegistroVisitas";
import ConsolidadoHistorico from "../containers/aforos/historicos/Consultar";
import visualizarAforoHistorico from "../containers/aforos/historicos/Visualizar";

//import ParametrizacionGeneralPage from '../pages/homologaciones/parametrizacion-general/ParametrizacionGeneralPage'
/*import ActualizacionPage from "../pages/homologaciones/actualizacion/ActualizacionPage";
import CruceInformacion from "../pages/homologaciones/cruceInformacion/CruceInformacion";
import GeneracionCartas from "../pages/homologaciones/generacionCartas/GeneracionCartas";
import ActualizacionRapida from "../pages/homologaciones/actualizacionRapida/ActualizacionRapida";
import ImportacionEmpAlterna from "../pages/homologaciones/importacionEmpAlterna/ImportacionEmpAlterna";*/
import LoginPage from "../pages/login/LoginPage";
import AforosParametrizacionPage from "../pages/aforos/AforosParametrizacion/AforosParametrizacionPage";
import LiquidacionAforoPage from "../pages/aforos/LiquidacionAforoPage/LiquidacionAforoPage";

const ParametrizacionGeneralPage = React.lazy(
  () =>
    import(
      "../pages/homologaciones/parametrizacion-general/ParametrizacionGeneralPage"
    )
);
const ActualizacionPage = React.lazy(
  () => import("../pages/homologaciones/actualizacion/ActualizacionPage")
);
const CruceInformacion = React.lazy(
  () => import("../pages/homologaciones/cruceInformacion/CruceInformacion")
);
const GeneracionCartas = React.lazy(
  () => import("../pages/homologaciones/generacionCartas/GeneracionCartas")
);
const ActualizacionRapida = React.lazy(
  () =>
    import("../pages/homologaciones/actualizacionRapida/ActualizacionRapida")
);
const ImportacionEmpAlterna = React.lazy(
  () =>
    import(
      "../pages/homologaciones/importacionEmpAlterna/ImportacionEmpAlterna"
    )
);
const ParametrizacionImportacion = React.lazy(
  () =>
    import(
      "../pages/homologaciones/parametrizacionImportacion/ParametrizacionImportacion"
    )
);
const ProcesarImport = React.lazy(
  () => import("../pages/homologaciones/importacionEmpAlterna/ProcesarImport")
);
const TableNewness = React.lazy(
  () => import("../pages/homologaciones/tablaNovedad")
);
const TableUpdate = React.lazy(
  () => import("../pages/homologaciones/tablaActualizacion")
);
const Suscripcion = React.lazy(
  () => import("../pages/suscripcion/Suscripcion")
);
export const RUTAS_VISTA = {
  RAIZ: { url: "/", componente: LoginPage },
  LOGIN: { url: "/login", componente: LoginPage },
  VISTA_NO_PERMITIDA: { url: "/no_autorizado", componente: AforoNormal },
  AFOROS_EDITAR: { url: "/aforos/normal/editar/:id", componente: EditarAforo },
  AFOROS_NORMAL: { url: "/aforos/normal", componente: AforoNormal },
  AFOROS_NORMAL_CONSULTA: {
    url: "/aforos/normal/consultar",
    componente: AforoNormal,
    menu: false,
  },
  AFOROS_NORMAL_LISTADO: {
    url: "/aforos/normal/listado",
    componente: AforoNormal,
    menu: false,
  },
  AFOROS_NORMAL_NUEVO: {
    url: "/aforos/normal/nuevo",
    componente: AforoNormal,
    menu: false,
  },
  AFOROS_MULTIUSUARIOS: {
    url: "/aforos/multiusuario",
    componente: MultiUsuarios,
  },
  AFOROS_MULTIUSUARIOS_NUEVO: {
    url: "/aforos/multiusuario/nuevo",
    componente: MultiUsuarios,
    menu: false,
  },
  AFOROS_MULTIUSUARIOS_CONSULTA: {
    url: "/aforos/multiusuario/consultar",
    componente: MultiUsuarios,
    menu: false,
  },
  AFOROS_EDITAR_MULTIUSUARIOS: {
    url: "/aforos/multiusuario/editar",
    componente: EditarAforoMulti,
  },
  AFOROS_LIQUIDACION: {
    url: "/aforos/liquidacion",
    componente: LiquidacionAforoPage,
  },
  AFOROS_VISITAS: { url: "/aforos/visitas", componente: Visitas },
  AFOROS_VISITAS_CONSULTAR: {
    url: "/aforos/visitas/consultar",
    componente: VisitasConsultar,
    menu: false,
  },
  AFOROS_VISITAS_EDITAR: {
    url: "/aforos/visitas/RegistroVisitas/:id",
    componente: EditarVisitas,
    menu: false,
  },
  AFOROS_HISTORICOS_CONSOLIDADOS: {
    url: "/aforos/historicosConsolidados",
    componente: ConsolidadoHistorico,
  },
  AFOROS_HISTORICOS: {
    url: "/aforos/historicos",
    componente: ConsolidadoHistorico,
  },
  AFOROS_HISTORICOS_VISUALIZAR: {
    url: "/aforos/historicos/visualizar",
    componente: visualizarAforoHistorico,
  },
  AFOROS_PARAMETRIZACION: {
    url: "/aforos/parametrizacion",
    componente: AforosParametrizacionPage,
  },

  HOMOLOGACIONES_PARAMETRIZACION: {
    url: "/homologaciones/parametrizacion-general",
    componente: ParametrizacionGeneralPage,
  },
  HOMOLOGACIONES_ACTUALIZACION: {
    url: "/homologaciones/actualizacion",
    componente: ActualizacionPage,
  },
  HOMOLOGACIONES_CRUCE_INFO: {
    url: "/homologaciones/CruceInformacion",
    componente: CruceInformacion,
  },
  HOMOLOGACIONES_GENERACION_CARTAS: {
    url: "/homologaciones/GeneracionCartas",
    componente: GeneracionCartas,
  },
  HOMOLOGACIONES_ACTUALIZACION_RAPIDA: {
    url: "/homologaciones/ActualizacionRapida",
    componente: ActualizacionRapida,
  },
  HOMOLOGACIONES_IMPORTACION: {
    url: "/homologaciones/importacion",
    componente: ImportacionEmpAlterna,
  },
  HOMOLOGACIONES_IMPORTACION_PARAMETRIZACION: {
    url: "/homologaciones/importacion/parametrizacion",
    componente: ParametrizacionImportacion,
  },
  HOMOLOGACIONES_IMPORTACION_NEW: {
    url: "/homologaciones/importacion/importacion2",
    componente: ProcesarImport,
  },
  SUSCRIPCIONES: {
    url: "/homologaciones/registroSuscripcionSoloAseo_796",
    componente: Suscripcion,
  },
  ACTUALIZACION_TABLA: {
    url: "/homologaciones/importacion/actualizacion_994",
    componente: TableUpdate,
  },
  NOVEDAD_TABLA: {
    url: "/homologaciones/importacion/novedad_993",
    componente: TableNewness,
  },
};

export default RUTAS_VISTA;
