import axios from "axios";
import {
  URL_BACKEND_BIOAGRICOLA_PRUEBAS,
  TAMANO_TABLAS,
} from "../global/constantes";
import RUTAS_API from "../global/rutas_api";

const BASE_URL = URL_BACKEND_BIOAGRICOLA_PRUEBAS;

const PATHS = RUTAS_API.SALDO_CARTERA_APROVECHAMIENTO;

export const getReportDefaultSaldoCartera = async (queryFilter) => {
  const { body, incentive } = queryFilter;
  const path = PATHS.REPORTE_CONSOLIDADO;
  const data = await axios.post(
    `${BASE_URL}${path}?incentivo=${incentive}`,
    body
  );
  return data;
};
