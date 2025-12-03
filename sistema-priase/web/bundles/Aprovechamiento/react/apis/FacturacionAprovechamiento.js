import axios from "axios";
import {
  URL_BACKEND_BIOAGRICOLA_PRUEBAS,
  TAMANO_TABLAS,
} from "../global/constantes";
import RUTAS_API from "../global/rutas_api";

const BASE_URL = URL_BACKEND_BIOAGRICOLA_PRUEBAS;

const PATHS = RUTAS_API.FACTURACION_APROVECHAMIENTO;
/**
 *
 * @param {object} queryFilter objeto con los filtros de busqueda
 * @param {object} page  numero de pagina
 * @returns {object}
 * @description Funcion que retorna la lista de los reportes
 */
export const getReportDefault = async (queryFilter, page) => {
  const path = PATHS.CONSULTA_RESPORTE_CONSOLIDADO_APROVECHAMIENTO;
  const data = await axios.post(
    `${BASE_URL}${path}?page=${page}&size=${TAMANO_TABLAS}`,
    queryFilter
  );
  return data;
};
/**
 *
 * @returns {object[]}
 * @description Funcion que retorna la lista de los periodos
 */
export const getReportPeriods = async () => {
  const path = PATHS.COSULTA_REPORTE_COSOLIDADO_PERIODOS;
  const data = await axios.get(`${BASE_URL}${path}`);
  return data;
};
/**
 *
 * @param {string} filter tipo de terceros a solicitar
 * @returns {object[]}
 * @description Funcion que retorna la lista de los terceros/aprovechadores
 */

export const getNamesExploitation = async (filter) => {
  const path = PATHS.CONSULTA_REPORTE_TERCEROS_APROVECHAMIENTO_NOMBRE;
  const data = await axios.get(`${BASE_URL}${path}${filter}`);
  return data;
};
