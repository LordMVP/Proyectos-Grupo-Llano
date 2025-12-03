export const TECLAS = {
  ENTER: 13,
};
export const TAMANO_TABLAS = 10;
export const COLUMNS_TABLA_DETAILS = [
  "Aprovechador",
  "Periodo Prestación",
  "Perido Liquidación",
  "Valor CC",
  "CC%",
  "Valor TA",
  "TA%",
  "Valor TA Aforado",
  "Totales",
  "Valor Ajuste CC",
  "Ajuste CC%",
  "Valor Ajuste TA",
  "Ajuste TA%",
  "Totales",
  "DINC",
  "Total Facturacion",
  "Acción",
];
export const COLUMNS_TABLA_SELECTION = [
  "Nit",
  "Digito de verificación ",
  "Nombre",
  "Documento",
  "Selección",
];

export const INITIALFORM_RECAUDACION_POR_APROVECHADOR = {
  dsusId: [],
  codBefore: [],
  period: 0,
  dateDate: [],
};
export const CLASES_UNIDADES = {
  // AGREGAR LAS CLASES QUE CORRESPONDAN
  CONCEPTOS_ASEO_APROVECHADORES: 76,
  TIPO_REGIMEN: 56,
  TIPO_RUTA: 57,
  TIPO_DOCUMENTOS_GENERALES: 58,
  ENTIDAD_EMISORA: 61,
  CICLOS: 62,
  ESTRATOS: 63,
  SEMESTRES: 89,
  MESES: 90,
};

export const PROGRAMAS = {
  // AGREGAR LOS PROGRAMAS QUE CORRESPONDAN
  CONCEPTOS: 670,
  DOCUMENTOS: 671,
  TIPO_DOCUMENTOS: 672,
  CONVENIOS_HOMOLOGAODS: 673,
  COM_RECAUDO: 674,
  COM_REC_CARTERA: 675,
  GEN_RECAUDO: 988,
  GEN_REC_CARTERA: 989,
  PAR_LIQ_APROVE: 717,
  PAR_LIQ_INCEN_APROVE: 717,
};

export const COSTOS = {
  TRANSACCION: 3415,
  PORCENTAJE: 3416,
  NA: 3417,
};

export const NOV_TIPOS = [
  {
    id: 3463,
    tipo: "Error en valor",
  },
  {
    id: 3464,
    tipo: "Reportado en entidad recaudadora",
  },
  {
    id: 3465,
    tipo: "Faltante/Sobrante",
  },
  {
    id: 3466,
    tipo: "Error en referencia de pagos",
  },
];

export const VARIABLES_APROVECHAMIENTO = {
  maximoDiasConsultaCastigo: "maximo_dias_consulta_castigo",
};

export const URL_AXIOS = "http://10.43.51.30:8080/dorbitaras/api/";
export const URL_BACKEND_BIOAGRICOLA =
  "http://localhost:8080/bioagricola-aprovechamiento/webresources/servicios/";
export const URL_BACKEND_APROVECHAMIENTO =
  "http://localhost:8080/bioagricola-aprovechamiento/webresources/servicios/";
export const URL_BACKEND_BIOAGRICOLA_PRUEBAS = "http://localhost:9091/";
export const URL_BACKEND_BIOAGRICOLA_PRUEBAS2 = "http://localhost:9091/";
export const APROVECHAMIENTO_CONS = {
  ESTADO_COLI_CONLIQUIDA: "A",
};

export const REMOVE_DUPLICATES = (array) => {
  let result = [];

  array.forEach((item) => {
    if (!result.includes(item)) {
      result.push(item);
    }
  });

  return result;
};
export const REMOVE_DUPLICATES_OBJECTS = (array) => {
  const arrayString = new Set(array.map(JSON.stringify));
  const newArray = Array.from(arrayString);
  const newArrayStrings = REMOVE_DUPLICATES(newArray);
  return newArrayStrings.map(JSON.parse);
};
export const REORDER_PAGES_DATA = (data) => {
  let infoData = [];
  let arrayTemp = [];

  let num = 0;
  /**
   * Este for lo que hace es dividir el array en un array bidimenciona
   * la primera dimencion se vuelve la pagina
   * y la segunda un dato en concreto
   * ejemplo => var arrayBi = [[1,2,3] , [4,5,6]]
   * console.log(arrayBi[0]) => [1,2,3]
   * console.log(arrayBi[0][0]) => 1
   */
  for (let i = 0; i < data.length; i++) {
    arrayTemp.push(data[i]);
    if ((i + 1) % TAMANO_TABLAS === 0 && data.length > TAMANO_TABLAS) {
      if (arrayTemp.length !== 0) {
        infoData[num] = arrayTemp;
        arrayTemp = [];
        num++;
      }
    }
    if (i + 1 === data.length && data.length < TAMANO_TABLAS + 1) {
      if (arrayTemp.length !== 0) {
        infoData[num] = arrayTemp;
        arrayTemp = [];
        num++;
      }
    }
    if ((i + 1) % TAMANO_TABLAS !== 0 && i === data.length - 1) {
      if (arrayTemp.length !== 0) {
        infoData[num] = arrayTemp;
        arrayTemp = [];
        num++;
      }
    }
  }
  return infoData;
};
