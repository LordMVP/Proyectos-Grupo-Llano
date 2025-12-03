import { SAVE_ITEM } from "../actions/TiposAcciones";

const initialState = {};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SAVE_ITEM:
      return {
        ...state,
        [action.reduxName]: action.data,
      };
    default:
      return state;
  }
}
