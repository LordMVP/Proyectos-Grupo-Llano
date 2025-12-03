import { Util } from "appfuture-react";
import CryptoJS from "crypto-js";

const CLAVE_ENCRIPTACION = "$Gell$239.";
export const validarOR = (valor, opciones) => {
  if (!opciones || !Array.isArray(opciones)) {
    return false;
  }

  for (let i = 0; i < opciones.length; i++) {
    if (valor === opciones[i]) {
      return true;
    }
  }
  return false;
};

export const validarAND = (valor, opciones) => {
  if (!opciones || !Array.isArray(opciones)) {
    return false;
  }

  for (let i = 0; i < opciones.length; i++) {
    if (valor !== opciones[i]) {
      return false;
    }
  }
  return true;
};

export const parsearJSON = (padre, json, propiedad, valorDefecto) => {
  if (!padre || !json || !padre[json] || typeof padre[json] !== "string") {
    return null;
  }
  try {
    const objetoConvertido = JSON.parse(padre[json]);
    if (propiedad && objetoConvertido.hasOwnProperty(propiedad)) {
      return objetoConvertido[propiedad];
    }
    if (!propiedad && objetoConvertido) {
      return objetoConvertido;
    }
    return valorDefecto !== undefined ? valorDefecto : objetoConvertido;
  } catch (err) {
    return null;
  }
};

export const esperar = (tiempo, callback, params) => {
  let temporizador = setTimeout(() => {
    clearTimeout(temporizador);
    temporizador = null;
    callback(params);
  }, tiempo);
  return temporizador;
};

export const parsearJSONUniPropiedad = (datos) => {
  if (!Util.validarArreglo(datos)) {
    return datos;
  }
  return datos.map((obj) => ({
    ...obj,
    uniPropiedad: parsearJSON(obj, "uniPropiedad", null, null),
  }));
};

export const formatearArray = (array) => {
  if (!array) {
    return [];
  }
  return array;
};

export const TIPOS_UNIDADES_MEDIDA = {
  MONEDA: "MONEDA",
  CANTIDAD: "CANTIDAD",
  PRECIO_CAPACIDAD: "PRECIO_CAPACIDAD",
  UNIDAD_MEDIDA: "UNIDAD_MEDIDA",
};

export const TIPOS_VARIABLES = {
  VARIABLES_PUNTO_LECTURA: "VARIABLES_PUNTO_LECTURA",
  VARIABLES_PUNTO_NOMINACION: "VARIABLES_PUNTO_NOMINACION",
  VARIABLES_PUNTO_INDICE: "VARIABLES_PUNTO_INDICE",
  VARIABLES_PUNTO_GASIFICACION: "VARIABLES_PUNTO_GASIFICACION",
};

export const limpiarDatosHistorico = (locale, props) => {
  props.history.replace({ state: null });
};

export const limpiarHistorico = (props) => {
  props.history.replace({ state: null });
};

export const esObjetoVacio = (obj) => {
  return !obj || Object.keys(obj).length === 0;
};

export const validarNumero = (numero) => {
  return /^([0-9.])*$/.test(numero);
};

export const obtenerDatosRespuesta = (response, defaultData = []) => {
  return response.data.codigo > 0 ? response.data.datos : defaultData;
};

export const limpiarJson = (data) => {
  let objeto = JSON.stringify(data);
  objeto = objeto.replace(/\[\]/g, "null");
  objeto = objeto.replace(/\{\}/g, "null");
  objeto = JSON.parse(objeto);
  return objeto;
};

export const limpiarObjeto = (data) => {
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const dato = data[key];
      data[key] =
        typeof dato == "string" || typeof dato == "number" ? "" : null;
    }
  }
};

export const descargarArchivo = (data) => {
  let a = document.createElement("a");
  a.href =
    "data:" +
    { type: "Content-Type: application/vnd.ms-excel" } +
    ";base64," +
    data;
  a.download = "archivo";
  a.target = "_blank";
  a.click();
};
export const getToken = () => {
  let token = localStorage.getItem("datos_prisma");
  if (token == null) {
    location.href = "/achagua/";
    return;
  }
  token = JSON.parse(token).token;
  token = CryptoJS.AES.decrypt(token, CLAVE_ENCRIPTACION).toString(
    CryptoJS.enc.Utf8
  );

  return token;
};
export const validarEstado = (estado) => {
  if (estado == "G") {
    return true;
  }
  return false;
};

export const formatter = (locale, currency) => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    // These options are needed to round to whole numbers if that's what you want.
    minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    maximumFractionDigits: 3, // (causes 2500.99 to be printed as $2,501)
  });
};
