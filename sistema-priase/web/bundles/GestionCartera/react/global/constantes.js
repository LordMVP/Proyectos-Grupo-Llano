export const TECLAS = {
  ENTER: 13,
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

export const MENSAJES_GESTION_CARTERA = {
  MSN_BUSQUEDA_TERCERO:
    " No se encuentra tercero, por favor verifique los datos ingresados.",
  MSN_AMBIGUO: " Hay ambiguedades en los valores desde y hasta.",
  MSN_COMPARACION_FECHA:
    " Recuerde que la fecha de vencimiento no puede ser menor a la fecha de ingreso.",
  MSN_DUPLICIDAD_EJECUTIVO: " Duplicidad de Ejecutivo",
  MSN_DUPLICIDAD_RESTRICCION_FINANCIACION:
    " El Registro ya existe para el proceso y usuario seleccionado.",
};

export const URL_AXIOS = "http://10.43.51.29:8080/dorbitaras/api/";

export const URL_API_GC =
  "http://10.43.51.30:8080/gestioncartera-0.0.1-SNAPSHOT/api/v1/";

export const URL_PRIORI =
  "//10.43.51.29:8080/microservicio-0.0.1-SNAPSHOT/"; /* //10.43.51.29:8080/microservicio/; */
export const URL_COM =
  "//10.43.51.29:8080/microservicio-0.0.1-SNAPSHOT/"; /* //10.43.51.29:8080/microservicio/; */
export const URL_GEN_COM =
  "http://10.43.51.29:8080/microservicio-0.0.1-SNAPSHOT/"; /* //10.43.51.29:8080/microservicio/; */
