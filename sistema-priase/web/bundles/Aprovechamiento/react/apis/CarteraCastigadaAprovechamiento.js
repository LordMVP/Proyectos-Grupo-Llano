import axios from "axios";
import { toast } from "react-toastify";
import {
  URL_BACKEND_BIOAGRICOLA_PRUEBAS,
  TAMANO_TABLAS,
} from "../global/constantes";
import RUTAS_API from "../global/rutas_api";
const BASE_URL = URL_BACKEND_BIOAGRICOLA_PRUEBAS;
const PATHS = RUTAS_API.CARTERA_CASTIGADA;

export const getReportPunished = async (queryFilter) => {
  const { filter, page, incentivo } = queryFilter;
  const path = PATHS.REPORTE_APROVECHADOR;
  const data = await axios
    .post(
      `${BASE_URL}${path}?incentivo=${incentivo}&page=${page}&size=${TAMANO_TABLAS}`,
      filter
    )
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
