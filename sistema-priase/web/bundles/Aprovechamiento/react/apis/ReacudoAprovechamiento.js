import axios from "axios";

import {
  URL_BACKEND_BIOAGRICOLA_PRUEBAS,
  TAMANO_TABLAS,
} from "../global/constantes";
import RUTAS_API from "../global/rutas_api";

import { toast } from "react-toastify";
const BASE_URL = URL_BACKEND_BIOAGRICOLA_PRUEBAS;

const PATHS = RUTAS_API.REACUDO_APROVECHAMIENTO;
/**
 *
 * @param {object} queryFilter objeto con los filtros de busqueda
 * @param {number} page numero de pagina
 * @returns {object}
 * @description Funcion que retorna la lista de aprovechamientos
 */
export const getReportReacudo = async (queryFilter, page) => {
  const path = PATHS.CONSULTA_RESPORTE_RECAUDO_APROVECHAMIENTO;
  const data = await axios
    .post(`${BASE_URL}${path}?page=${page}&size=${TAMANO_TABLAS}`, queryFilter)
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
/**
 *
 * @param {object} object objecto que compone el filtro
 * @param {object} object.id id del aprovechamiento
 *  @param {object} object.period perido de busqueda
 * @param {object} object.dateDate array de los peridos de loquidacion
 * @returns  {object}
 * @description Funcion que retorna el detalle del soporte de pado delaprovechamiento
 */
export const getSoportePago = async ({ id, period, dateDate }) => {
  const path = PATHS.SOPORTES_PAGOS_TERCEROS;
  const data = await axios
    .post(`${BASE_URL}${path}${id}`, {
      period,
      dateDate,
    })
    .catch((err) => {
      try {
        toast.error(err.response.data.mensaje);
      } catch (error) {
        toast.error(
          "Error al consultar los datos por favor intentelo mas tarde"
        );
      }
    });
  return data;
};
/**
 *
 * @param {number} id id del aprovechamiento
 * @returns {object}
 * @description Funcion que retorna el detalle del aprovechador
 */
export const getdetalleAprovechador = async (id) => {
  const path = PATHS.DETALLE_RECAUDO_APROVECHADOR;
  const data = await axios.post(`${BASE_URL}${path}${id}`).catch((err) => {
    try {
      toast.error(err.response.data.mensaje);
    } catch (error) {
      toast.error("Error al consultar los datos por favor intentelo mas tarde");
    }
  });
  return data;
};
/**
 *
 * @param {object} querry querry de busqueda al back
 * @returns {object}
 * @description Funcion que retorna el detalle del aprovechador por periodos
 */
export const getdetalleAprovechadorPeriodos = async (querry) => {
  const path = PATHS.DETALLE_RECAUDO_APROVECHADOR_PERIODOS;
  const data = await axios.post(`${BASE_URL}${path}`, querry).catch((err) => {
    try {
      toast.error(err.response.data.mensaje);
    } catch (error) {
      toast.error("Error al consultar los datos por favor intentelo mas tarde");
    }
  });
  return data;
};
/**
 *
 * @param {object} querry querry de busqueda al back
 * @returns {object}
 * @description Funcion que retorna el objeto con el base 64 del archivo
 */
export const getoficioTercero = async (querry) => {
  const path = PATHS.GENEARAR_OFICIO_TERCERO;
  const data = await axios.post(`${BASE_URL}${path}`, querry).catch((err) => {
    try {
      toast.error(err.response.data.mensaje);
    } catch (error) {
      toast.error("Error al consultar los datos por favor intentelo mas tarde");
    }
  });
  return data;
};
/**
 *
 * @param {object} object objecto con los datos para el filtro de notas recaudo
 * @param {object} object.tercero id del tercero
 * @param {object} object.aforado valor del aforado
 * @returns {object}
 * @description Funcion que retorna el información de las notas de recaudo
 */
export const getNotasRecaudoTerceros = ({
  querry,
  aforado,
  page,
  incentivo,
}) => {
  const path = PATHS.NOTAS_RECAUDO_TERCEROS;
  const data = axios
    .post(
      `${BASE_URL}${path}?aforado=${aforado}&incentivo=${incentivo}&page=${page}&size=10`,
      querry
    )
    .catch((err) => {
      try {
        toast.error(err.response.data.mensaje);
      } catch (error) {
        toast.error(
          "Error al consultar los datos por favor intentelo mas tarde"
        );
      }
    });
  return data;
};

/**
 *
 * @param {object} object objecto con los datos para el filtro de notas recaudo
 * @param {object} object.tercero id del tercero
 * @param {object} object.aforado valor del aforado
 * @returns {object}
 * @description Funcion que retorna el información del reporte recaudo tercero
 */
export const getReportReacudoTerceros = async ({
  querry,
  aforado,
  page = 0,
}) => {
  const path = PATHS.REPORTE_CRUCE_RECAUDO;
  const data = await axios
    .post(`${BASE_URL}${path}?aforado=${aforado}&page=${page}&size=3`, querry)
    .catch((err) => {
      try {
        toast.error(err.response.data.mensaje);
      } catch (error) {
        toast.error(
          "Error al consultar los datos por favor intentelo mas tarde"
        );
      }
    });
  return data;
};

export const getDetalleRecaudoAlcaldia = async (querry) => {
  const path = PATHS.DETALLE_RECAUDO_APROVECHADOR_ALCALDIA;
  const { page = 0 } = querry;
  const data = await axios
    .post(`${BASE_URL}${path}?page=${page}&size=10`, querry)
    .catch((err) => {
      try {
        toast.error(err.response.data.mensaje);
      } catch (error) {
        toast.error(
          "Error al consultar los datos por favor intentelo mas tarde"
        );
      }
    });
  return data;
};

export const getDetalleRecaudoAlcaldiaMes = async (querry) => {
  const { page = 0 } = querry;
  const path = PATHS.DETALLE_MES_RECAUDO_APROVECHADOR_ALCALDIA;

  const data = await axios
    .post(`${BASE_URL}${path}?page=${page}&size=10`, querry)
    .catch((err) => {
      try {
        toast.error(err.response.data.mensaje);
      } catch (error) {
        toast.error(
          "Error al consultar los datos por favor intentelo mas tarde"
        );
      }
    });
  return data;
};
//FACTURA_CASTIGADA
export const getFacturaCastigada = async ({
  querry,

  page,
  incentivo,
}) => {
  const path = PATHS.FACTURA_CASTIGADA;
  const data = await axios
    .post(
      `${BASE_URL}${path}?incentivo=${incentivo}&page=${page}&size=5`,
      querry
    )
    .catch((err) => {
      try {
        toast.error(err.response.data.mensaje);
      } catch (error) {
        toast.error(
          "Error al consultar los datos por favor intentelo mas tarde"
        );
      }
    });
  return data;
};
