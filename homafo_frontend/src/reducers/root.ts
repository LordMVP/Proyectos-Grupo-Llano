import { combineReducers } from "redux";
import { loadingBarReducer } from "react-redux-loading-bar";
import { reducer as notifications } from "react-notification-system-redux";
import user from "./user";
import aforos_result from "./aforos/aforos";
import selects from "./aforos/selects";
import aforosMulti_result from "./aforos/aforosMulti";
import aforosHistoricos_result from "./aforos/aforosHistoricos";
import selectsMulti from "./aforos/selectsMulti";
import aforosVisitas from "./aforos/aforosVisitas";
import suscripcionReducer from "./suscription/suscripcionReducer";
import suscripcionTerceroReducer from "./suscription/suscripcionTerceroReducer";
import suscripcionSuscriptorReducer from "./suscription/suscripcionSuscriptorReducer";
import suscripcionHomologacionReducer from "./suscription/suscripcionHomologacionReducer";
import tablasGestion from "./tablasGestion/tablasGestion";
export default combineReducers({
  loadingBar: loadingBarReducer,
  notifications,
  aforos_result,
  user,
  selects, //aforo normal
  aforosMulti_result,
  selectsMulti, //aforo multi
  aforosVisitas,
  aforosHistoricos_result,
  suscripcionReducer,
  suscripcionTerceroReducer,
  suscripcionSuscriptorReducer,
  suscripcionHomologacionReducer,
  tablasGestion,
});
