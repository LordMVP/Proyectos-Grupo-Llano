import { SAVE_ITEM } from "./TiposAcciones";

export const saveItem = (data, reduxName) => {
  return {
    type: SAVE_ITEM,
    data,
    reduxName,
  };
};
