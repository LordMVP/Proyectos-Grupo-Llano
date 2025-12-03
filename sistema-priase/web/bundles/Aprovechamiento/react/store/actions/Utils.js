import {CONSULTA_GET, CONSULTA_GET_APROVECHAMIENTO, POST_SERVICE } from './TiposAcciones';
import { getService  } from '../servicios/Services';
import {getServiceAprovechamiento, postServiceAprovechamiento} from "../servicios/ServicesAprovechamiento";

//metodos sincronos
export const saveConsultaGet = (data, reduxName) => {
  return {
    type: CONSULTA_GET,
    data,
    reduxName,
  };
};

export const saveConsultaGetAprovechamiento = (data, reduxName) => {
  return {
    type: CONSULTA_GET_APROVECHAMIENTO,
    data,
    reduxName,
  };
};

export const savePostService = (data, reduxName) => {
  return {
    type: POST_SERVICE,
    data,
    reduxName,
  };
};

//Métodos asíncronos

export const consultaGet = (route, params, headers, reduxName) => async (
  dispatch
) => {
  let response = await getService(route, params, headers);
  dispatch(saveConsultaGet(!!response.data ? response.data : [], reduxName));
  return !!response.data ? response.data : [];
};

export const consultaGetAprovechamiento = (route, params, headers, reduxName) => async (
  dispatch
) => {
  let response = await getServiceAprovechamiento(route, params, headers);
  dispatch(saveConsultaGetAprovechamiento(!!response.data ? response.data : [], reduxName));
  return !!response.data ? response.data : [];
};

export const postServiceR = (route, params, headers, reduxName) => async (
  dispatch
) => {
  let response = await postServiceAprovechamiento(route, params, headers);
  dispatch(savePostService(!!response.data ? response.data : [], reduxName));
  return !!response.data ? response.data : [];
};
