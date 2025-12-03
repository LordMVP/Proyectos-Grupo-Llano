import React, { Component, lazy, Suspense } from "react";
import { Switch, Route } from "react-router-dom";
import requireAuth from "./Auth/requireAuth";
import AuthenticatedContainer from "./Auth/AuthenticatedContainer";

import Login from "./Auth/Login";
// import NotFound from './Error/NotFound'

// import Multiusuarios from './aforos/MultiUsuarios'
// import Usuarios from './aforos/Usuarios'
// import Maestro from './aforos/Maestro'
// import Liquida from './aforos/Liquida'
// import Consulta from './aforos/Consulta'

// import DevoLiquidarIntereses from './devoluciones/LiquidarIntereses'
// import DevoParametrizacion from './devoluciones/Parametrizacion'
// import DevoConsulta from './devoluciones/Consulta'
// import DevoNotas from './devoluciones/Notas'
// import DevoRecalcularTipoInteres from './devoluciones/RecalcularTipoInteres'
// import DevoAbonos from './devoluciones/Abonos'
// import DevoDirectas from './devoluciones/Directas'

// import AprovLiquidacion from './aprovechamiento/Liquidacion'
// import AprovParametrizacion from './aprovechamiento/Parametrizacion'

import Loading from "../components/loader/Init";
import Home from "./Home";
import EditarAforo from "./aforos/normal/EditarAforo";
import EditarAforoMulti from "./aforos/multiusuario/EditarAforoMulti";
import ParametrizacionGeneralPage from "pages/homologaciones/parametrizacion-general/ParametrizacionGeneralPage";
import MultiUsuarioNuevo from "./aforos/multiusuario/Nuevo";

const NotFound = lazy(() => import("./Error/NotFound"));
const AforoNormal = lazy(() => import("./aforos/Normales"));
const MultiUsuarios = lazy(() => import("./aforos/Multiusuarios"));
const Liquidacion = lazy(() => import("./aforos/liquidacion/liquidacion"));
const Visitas = lazy(() => import("./aforos/Visitas"));
const Historicos = lazy(() => import("./aforos/historicos/Consultar"));
//const Homologacion = lazy(() => import('./homologaciones/Actualizacion'))
const ActualizacionPage = lazy(
  () => import("pages/homologaciones/actualizacion/ActualizacionPage")
);
const CruceInformacion = lazy(
  () => import("pages/homologaciones/cruceInformacion/CruceInformacion")
);
const GeneracionCartas = lazy(
  () => import("pages/homologaciones/generacionCartas/GeneracionCartas")
);
const ActualizacionRapida = lazy(
  () => import("pages/homologaciones/actualizacionRapida/ActualizacionRapida")
);
const ImportacionEmpAlterna = lazy(
  () =>
    import("pages/homologaciones/importacionEmpAlterna/ImportacionEmpAlterna")
);
const ParametrizacionImportacion = lazy(
  () =>
    import(
      "pages/homologaciones/parametrizacionImportacion/ParametrizacionImportacion"
    )
);
const Suscripcion = lazy(() => import("pages/suscripcion/Suscripcion"));

class MainContainer extends Component {
  render() {
    return (
      <main>
        <Suspense fallback={<Loading />}>
          <Switch>
            <Route exact path="/" component={AuthenticatedContainer(Login)} />
            <Route path="/home" component={requireAuth(Home)} />
            <Route path="/aforos/normal" component={requireAuth(AforoNormal)} />
            <Route
              exact
              path="/aforos/normal/editar/:id"
              component={requireAuth(EditarAforo)}
            />
            <Route
              path="/aforos/multiusuario"
              component={requireAuth(MultiUsuarios)}
            />
            <Route
              path="/aforos/multiusuario/nuevo"
              component={requireAuth(MultiUsuarioNuevo)}
            />
            <Route
              path="/aforos/multiusuario/editar"
              component={requireAuth(EditarAforoMulti)}
            />
            <Route
              path="/aforos/liquidacion"
              component={requireAuth(Liquidacion)}
            />
            <Route path="/aforos/visitas" component={requireAuth(Visitas)} />
            <Route
              path="/aforos/historicosConsolidados"
              component={requireAuth(Historicos)}
            />
            <Route
              path="/homologaciones/actualizacion"
              component={requireAuth(ActualizacionPage)}
            />
            <Route
              path="/homologaciones/parametrizacion-general"
              component={requireAuth(ParametrizacionGeneralPage)}
            />
            <Route
              path="/homologaciones/CruceInformacion"
              component={requireAuth(CruceInformacion)}
            />
            <Route
              path="/homologaciones/GeneracionCartas"
              component={requireAuth(GeneracionCartas)}
            />
            <Route
              path="/homologaciones/ActualizacionRapida"
              component={requireAuth(ActualizacionRapida)}
            />
            <Route
              path="/homologaciones/ImportacionEmpAlterna"
              component={requireAuth(ImportacionEmpAlterna)}
            />
            <Route exact path="*" component={NotFound} />
            <Route
              path="/homologaciones/ParametrizacionImportacion"
              component={requireAuth(ParametrizacionImportacion)}
            />
            <Route path="/suscripcion" component={Suscripcion} />
          </Switch>
        </Suspense>
      </main>
    );
  }
}
export default MainContainer;
