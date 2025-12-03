import { Util } from 'appfuture-react';

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
