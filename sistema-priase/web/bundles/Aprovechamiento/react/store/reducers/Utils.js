import { CONSULTA_GET, CONSULTA_GET_APROVECHAMIENTO, POST_SERVICE } from "../actions/TiposAcciones";

const initialState = {};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case CONSULTA_GET:
      return {
        ...state,
        [action.reduxName]: { data: action.data },
      };
    case CONSULTA_GET_APROVECHAMIENTO:
      return {
        ...state,
        [action.reduxName]: { data: action.data },
      };
    case POST_SERVICE:
      return {
        ...state,
        [action.reduxName]: { data: action.data },
      };
    default:
      return state;
  }
}
