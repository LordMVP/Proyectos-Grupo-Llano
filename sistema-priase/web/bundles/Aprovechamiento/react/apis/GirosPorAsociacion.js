import axios from "axios";
import { toast } from "react-toastify";
import { URL_BACKEND_BIOAGRICOLA_PRUEBAS } from "../global/constantes";
import RUTAS_API from "../global/rutas_api";

const BASE_URL = URL_BACKEND_BIOAGRICOLA_PRUEBAS;
const PATHS = RUTAS_API.GIROS_POR_ASOCIACION;

export const getGirosPorAsociacion = async (queryFilter) => {
  const path = PATHS.CONSULTA_GIROS_POR_ASOCIACION;
  const data = await axios
    .post(`${BASE_URL}${path}`, queryFilter)
    .catch((err) => {
      try {
        toast.error(err.response.data.mensaje);
      } catch (error) {
        toast.error(
          "Error al consultar los datos por favor intentelo mas tarde o contacte con soporte"
        );
      }
    });
  return data;
};

export const getDetailGirosPorAsociacion = async (queryFilter) => {
  const path = PATHS.DETALLE_GIROS_POR_ASOCIACION;
  const data = await axios

    .post(`${BASE_URL}${path}`, queryFilter)
    .catch((err) => {
      try {
        toast.error(err.response.data.mensaje);
      } catch (error) {
        toast.error(
          "Error al consultar los datos por favor intentelo mas tarde o contacte con soporte"
        );
      }
    });
  return data;
};
