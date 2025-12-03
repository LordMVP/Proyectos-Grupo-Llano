import { Util } from 'appfuture-react';
import CryptoJS from 'crypto-js';
import {URL_AXIOS} from  './constantes';
import RUTAS_API from './rutas_api';

const CLAVE_ENCRIPTACION = '$Gell$239.';

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
  if (!padre || !json || !padre[json] || typeof padre[json] !== 'string') {
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
}

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
  return datos.map(obj => (
    { ...obj, uniPropiedad: parsearJSON(obj, 'uniPropiedad', null, null) }
  ));
};


export const formatearArray = (array) => {
  if (!array) {
    return [];
  }
  return array;
};

export const limpiarDatosHistorico = (locale, props) => {
  props.history.push({
    pathname: locale,
    state: null
  });
};


export const esObjetoVacio = (obj) => {
  return !obj || Object.keys(obj).length === 0;
};

export const validarNumero = (numero) => {
  return /^([0-9.])*$/.test(numero);
};

export const getToken = () => {
  let token = localStorage.getItem('datos_prisma');
  if (token == null) {
    location.href = '/achagua/';
    return;
  }
  token = JSON.parse(token).token;
  token = CryptoJS.AES.decrypt(token, CLAVE_ENCRIPTACION).toString(CryptoJS.enc.Utf8);
  return token;
}

export const setToken = (nuevoToken) => {
  var tokenEncriptado = CryptoJS.AES.encrypt(nuevoToken.split(' ')[1], CLAVE_ENCRIPTACION);
  let objecto = localStorage.getItem('datos_prisma'); 
  let empresa = JSON.parse(objecto).empresa;
  let usuario = JSON.parse(objecto).usuario;
  let datos_prisma = {
    token : tokenEncriptado.toString(),
    usuario : usuario,
    empresa : empresa
  }
  localStorage.setItem('datos_prisma', JSON.stringify(datos_prisma));
}

export const descargarArchivo = (idArchivo) => {
  const token = getToken();
  let a = document.createElement('a');
  a.href = URL_AXIOS + RUTAS_API.GLOBAL.CONSULTAR_ARCHIVO_GRANDE + '?idArchivo=' + idArchivo + '&token=' + token;
  a.download = 'archivo';
  a.target = '_blank';
  a.click();
}