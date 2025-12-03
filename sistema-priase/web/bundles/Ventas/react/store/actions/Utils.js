import { CONSULTA_GET, POST_SERVICE, PUT_SERVICE } from "./TiposAcciones";
import { getService, postService, putService } from "../servicios/Services";

//metodos sincronos
export const saveConsultaGet = (data, reduxName) => {
  return {
    type: CONSULTA_GET,
    data,
    reduxName,
  };
};

export const savePostService = (response, reduxName) => {
  return {
    type: POST_SERVICE,
    response,
    reduxName,
  };
};

export const savePutService = (data, reduxName) => {
  return {
    type: PUT_SERVICE,
    data,
    reduxName,
  };
};

//Métodos asíncronos
export const consultaGet = (route, params, headers, reduxName) => async (
  dispatch
) => {
  let response = await getService(route, params, headers);
  dispatch(
    saveConsultaGet(
      typeof response.data === "boolean"
        ? response.data
        : !!response.data
        ? response.data
        : [],
      reduxName
    )
  );
  return !!response.data ? response.data : [];
};

export const postServiceR = (route, params, headers, reduxName) => async (
  dispatch
) => {
  let response = await postService(route, params, headers);
  let responseRedux = {
    data: !!response.data ? response.data : [],
    status: !!response.status ? response.status : 500,
  };
  dispatch(savePostService(responseRedux, reduxName));
  return !!response.data ? response.data : [];
};

export const putServiceR = (route, params, headers, reduxName) => async (
  dispatch
) => {
  let response = await putService(route, params, headers);
  dispatch(savePutService(!!response.data ? response.data : [], reduxName));
  return !!response.data ? response.data : [];
};
