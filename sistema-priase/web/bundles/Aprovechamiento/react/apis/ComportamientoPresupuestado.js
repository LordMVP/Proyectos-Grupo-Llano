import axios from "axios";
import { URL_BACKEND_BIOAGRICOLA_PRUEBAS } from "../global/constantes";
import RUTAS_API from "../global/rutas_api";

const BASE_URL = URL_BACKEND_BIOAGRICOLA_PRUEBAS;

const PATHS = RUTAS_API.COMPORTAMIENTO_PRESUPUESTADO;

export const getSearchReportInvoicing = async (queryFilter) => {
  const path = PATHS.CRITERIO_BUSQUEDA_REPORTE_FACTURA;
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
