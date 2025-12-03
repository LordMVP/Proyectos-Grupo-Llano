import axios from "axios";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { NOCOM_CONTANTS } from "../../global/constantes";
import RUTAS_API from "../../global/rutas_api";
//constants
const BaseUrl = NOCOM_CONTANTS.apiBase;
const urlApi = RUTAS_API.NOCOM.REPORTES;

// private methods
function showToastError(err) {
  let msj = "Error del servidor";
  if (err && err.response && err.response.data && err.response.data.message)
    msj = err.response.data.message;

  toast.error(msj);
}

// hooks
export function getInformacionOperativa() {
  const { mutate, data, isSuccess, isLoading, isError, error } = useMutation(
    async (form) => {
      JSON.stringify("formulario->"+form);
      const data = await axios
        .post(BaseUrl + urlApi.INFORMEACION_OPERATIVA, form)
        .catch((err) => {
          showToastError(err);
        });

      if (data && data.data) return data.data;
      return data;
    }
  );

  return { mutate, data, isSuccess, isLoading, isError, error };
}
export function getLiquidacionEDS() {
  console.log("base url->"+BaseUrl+"\n urlApi.LIQUIDACION_EDS->"+urlApi.LIQUIDACION_EDS+"\n");
  const { mutate, data, isSuccess, isLoading, isError, error } = useMutation(
    async (form) => {
      console.log("formulario->",JSON.stringify(form));
      const data = await axios
        .post(BaseUrl + urlApi.LIQUIDACION_EDS, form)
        .catch((err) => {
          console.error(err);
          showToastError(err);
        });

      if (data && data.data) return data.data;
      return data;
    }
  );

  return { mutate, data, isSuccess, isLoading, isError, error };
}
export function getMedicionEDSATR() {
  const { mutate, data, isSuccess, isLoading, isError, error } = useMutation(
    async (form) => {
      const data = await axios
        .post(BaseUrl + urlApi.MEDICION_EDS_ATR, form)
        .catch((err) => {
          console.error(err);
          showToastError(err);
        });

      if (data && data.data) return data.data;
      return data;
    }
  );

  return { mutate, data, isSuccess, isLoading, isError, error };
}
export function getComprensionDistribucion() {
  const { mutate, data, isSuccess, isLoading, isError, error } = useMutation(
    async (form) => {
      const data = await axios
        .post(BaseUrl + urlApi.REPORTE_COMPRESION_DISTRIBUCION, form)
        .catch((err) => {
          console.error(err);
          showToastError(err);
        });

      if (data && data.data) return data.data;
      return data;
    }
  );

  return { mutate, data, isSuccess, isLoading, isError, error };
}
