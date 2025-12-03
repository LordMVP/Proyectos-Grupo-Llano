export const TECLAS = {
  ENTER: 13,
};

export const ERRORES_PQR = {
  BUSQUEDA_EXITOSA: "Búsqueda exitosa",
  ERROR_PQR_DESCARTADO:
    "El código de PQR ingresado se encuentra descartado, por favor ingrese otro e intente nuevamente",
  ERROR_DATOS_PQR:
    "El código de PQR existe, pero no corresponde a los criterios seleccionados, ¿Desea reemplazarlos?",
  ERROR_SIN_RESULTADOS:
    "No existen resultados para el número de PQR consultado",
  CODIGO_RESPUESTA_EXITOSA: "0",
  CODIGO_RESPUESTA_FALLIDA: "1",
  CODIGO_SIN_RESULTADOS: "2",
};

export const CONCEPTO_NOTA = {
  DESCUENTO_POR_DESHABITADO: 1000,
  DESCUENTO_PUERTA_PUERTA: 1001,
};

export const SERVICIO_RELIQUIDACION = {
  RELIQUIDAR_SUSCRIPCIONES: "S",
  NO_RELIQUIDAR_SUSCRIPCIONES: "N",
};

export const TIPO_FORMULARIO_SOLICITUD = {
  DESCUENTO_POR_DESHABITADO: 1,
  DESCUENTO_PUERTA_PUERTA: 2,
  CAMBIO_ESTRATO: 3,
};

export const ACCIONES_A_REALIZAR_GENERAL = [
  {
    id: "1",
    descripcion: "Retroactivo",
  },
  {
    id: "2",
    descripcion: "Tarifa",
  },
];

export const ACCIONES_A_REALIZAR_DESHABITADO = [
  {
    id: "1",
    descripcion: "Descuentos por Deshabitado (retroactivo)",
  },
  {
    id: "2",
    descripcion: "Aplicación Tarifa Deshabitado",
  },
];

export const ACCIONES_A_REALIZAR_PUERTA_PUERTA = [
  {
    id: "1",
    descripcion: "Descuentos Puerta a Puerta (retroactivo)",
  },
  {
    id: "2",
    descripcion: "Aplicar marcación de tarifa Puerta a Puerta",
  },
];

export const ACCIONES_A_REALIZAR_CAMBIO_ESTRATO = [
  {
    id: "1",
    descripcion: "Cambio estrato (retroactivo)",
  },
];

export const ACCIONES_A_REALIZAR_CAMBIO_TIPOUSO = [
  {
    id: "1",
    descripcion: "Cambio tipo de uso (retroactivo)",
  },
];

export const ACCIONES_A_REALIZAR_AFORO = [
  {
    id: "1",
    descripcion: "Cambio aforado extraordinario",
  },
];

export const ACCIONES_A_REALIZAR_DEUDA = [
  {
    id: "1",
    descripcion: "Inclusión de deuda",
  },
  {
    id: "2",
    descripcion: "Eliminación de deuda",
  },
];

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

export const TIPO_ATENCION_NOTAS = {
  ATENCION_CORREO: "004",
  ATENCION_ESCRITA: "003",
};

export const PROGRAMAS = {
  // AGREGAR LOS PROGRAMAS QUE CORRESPONDAN
  DESCUENTO_DESHABITADO: 712,
  DESCUENTO_PUERTA_PUERTA: 713,
  DESCUENTO_INDICADORES: 714,
  CAMBIO_ESTRATO: 715,
  CAMBIO_TIPOUSO: 716,
  AFORO_EXTRAORDINARIO: 722,
  ADICION_ELIMINACION_DEUDA: 758,
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

export const URL_AXIOS = "http://10.43.51.29:8080/dorbitaras/api/";
export const URL_BACKEND_REPORTES =
  "http://10.43.51.29:8080/bioagricola-servicios-1.0-SNAPSHOT/webresources/servicios/";
export const URL_BACKEND_REPORTES_JASPER =
  "http://10.43.51.121:8080/JasperBridge-1.0-SNAPSHOT//JasperBridge-1.0-SNAPSHOT/";  
export const URL_BACKEND_BIOAGRICOLA =
  "http://10.43.51.30:9090/webresources/servicios/";
//Direccion para QA
// "http://localhost:8080/bioagricola-servicios-1.0-SNAPSHOT/webresources/servicios/";
//Para Servidor
//"http://192.168.3.7:8080/bioagricola-servicios-1.0-SNAPSHOT/webresources/servicios/";
export const URL_BACKEND_BIOAGRICOLA_PRUEBAS =
  "http://10.43.51.20:8080/bioagricola-servicios/webresources/servicios/";
