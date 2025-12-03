import {
  CONSULTA_GET,
  POST_SERVICE,
  PUT_SERVICE,
} from "../actions/TiposAcciones";

const initialState = {};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case CONSULTA_GET:
      return {
        ...state,
        [action.reduxName]: { data: action.data },
      };
    case POST_SERVICE:
      return {
        ...state,
        [action.reduxName]: action.response,
      };
    case PUT_SERVICE:
      return {
        ...state,
        [action.reduxName]: { data: action.data },
      };
    default:
      return state;
  }
}
