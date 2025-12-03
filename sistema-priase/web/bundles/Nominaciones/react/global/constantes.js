export const TECLAS = {
  ENTER: 13
};

export const CLASES_UNIDADES = {
  PUNTO_ENTRADA: 66,
  TIPO_USO_CONTRATO: 67,
  TIPO_DEMANDA_MERCADO: 65,
  TIPO_MERCADO: 68,
  TIPO_CONTRATO: 69,
  MODALIDAD_CONTRATO_RUEDA: 70,
  TIPOS_MODALIDAD_CONTRATO: 71,
  ESTADOS_CONTRATO: 72,
  PERIODO_ENTREGA: 73,
  RUTA_GNC_CONEXION: 74,
  FUENTES_SUMINISTRO: 75,
  VARIABLES_NOMINACIONES: 76,
  TIPO_INYECCION: 77,
  TIPO_CONTACTO: 78,
  RUTA_TRANSPORTE: 79,
  UNIDAD_MEDIDA: 80,
  TIPO_VARIABLE: 81,
  TIPO_GARANTIA: 82,
  TIPO_ARCHIVO_DOCUMENTO: 83,
  CLASE_CONTRATO: 84,
  ACTIVIDADES: 92,
  PROCESOS: 85,
  TIPO_CONSUMO: 88,
  TRM: 2615,
  TIPOS_NEGOCIACION: 84,
  MOTIVOS_ANULACION: 98,
};

export const PROGRAMAS = {
  REGISTRO_TRM_DENSIDAD: 543,
  VARIABLES: 58,
  CONTRATOS: 533,
};

export const TIPO_EVENTO_PRONOSTICO = {
  FESTIVO: 'FES',
  DIA_SIN_CARRO: 'DSC',
  FERIAS_Y_FIESTAS: 'FYF'
};

export const UNIDADES_CALCULO_VOLUMEN = {
  UNIDAD_TEMPERATURA: '°C',
  UNIDAD_DIAMETRO: 'Pulgada',
  UNIDAD_LONGITUD: 'Metros',
  UNIDAD_PRESION: 'PSI',
}

export const ABREVIATURAS_CONTRATO = {
  VALOR_FIJO_COBERTURA: 'VFC-CONTRATOS',
  VALOR_FIJO_TRANSPORTE: 'VFT-CONTRATOS',
  VALOR_FIJO_CONEXIONGNC: 'VFCGNC-CONTRATOS',
  VALOR_VARIABLE_TRANSPORTE: 'VVT-CONTRATOS',
}

export const ESTADOS_NOMINACIONES = {
  GUARDADO: 'G',
  APROBADO: 'A',
  CERRADO: 'C',
  SIN_RESULTADOS_DESVIO: 'SRD',
  NO_CALCULO: 'NC'
}

export const TIPOS_NEGOCIO = {
  VENTA: 'V',
  COMPRA: 'C'
}

export const ESTADOS_CRUCE = {
  PENDIENTE: 'P',
  APROBADO: 'A',
  RECHAZADO: 'R',
  AGREGAR: 'AG',
  ELIMINAR: 'EL',
  GUARDADO: 'G',
  CERTIFICAR: 'C',
}

export const ESTADOS_COMPENSACION_CUENTA = {
  APROBADO: 'A',
  PENDIENTE: 'P',
  ANULADO: 'R'
}

export const ESTADOS_INDICE_PERDIDAS = {
  GENERADO: 'G',
  APROBADO: 'A',
  ERROR_PUNTOS_CONSUMO: -582,
  ERROR_PUNTOS_SALIDA: -580,
}

export const CONCEPTOS_VALIDACION_FACTURA = {
  SERVICIO_TRANSPORTE_FIRME_PESOS: 'servicioTransporteFirmePesos',
  SERVICIO_TRANSPORTE_FIRME_DOLAR: 'servicioTransporteFirmeDolar',
  CUOTA_FOMENTO_BASE_USD: 'cuotaFomentoBaseusd',
  CUOTA_FOMENTO_BASE_$: 'cuotaFomentoBase$',
  IMPUESTO_TRANSPORTE_BASE_USD: 'impuestoTransporteBaseusd',
  IMPUESTO_TRANSPORTE_BASE_$: 'impuestoTransporteBase$',
  DESCUENTOS: 'descuentos',
  DESVIOS: 'desvios',
}

export const CONCEPTOS_CUSIANA = {
  TRM: {
    nombre: 'TRM',
    abreviatura: 'TRM'
  },
  CUSIANA_NOMINACION_GNV: {
    abreviatura: 'CNG-',
    nombre: 'Cusiana Nominación GNV'
  },
  CUSIANA_NOMINACION_REG: {
    abreviatura: 'CNR-',
    nombre: 'Cusiana Nominación REG'
  },
  CUSIANA_TOTAL_NOMINADO: {
    abreviatura: 'CTN-',
    nombre: 'Cusiana Total Nominado'
  },
  CUSIANA_CANTIDAD_CONTRATADA_GNV: {
    abreviatura: 'CCCG-',
    nombre: 'Cusiana Cantidad Contratada GNV'
  },
  CUSIANA_CANTIDAD_CONTRATADA_REG: {
    abreviatura: 'CCCR-',
    nombre: 'Cusiana Cantidad Contratada REG'
  },
  CUSIANA_CANTIDAD_LECTURA_GNV: {
    abreviatura: 'CCLG-',
    nombre: 'Cusiana Cantidad Lectura GNV'
  },
  CUSIANA_CANTIDAD_LECTURA_REG: {
    abreviatura: 'CCLR-',
    nombre: 'Cusiana Cantidad Lectura REG'
  },
  LLANOGAS_CANTIDAD_CONTRATADA_GNV: {
    abreviatura: 'LCCG-',
    nombre: 'Llanogas Cantidad Contratada GNV'
  },
  LLANOGAS_CANTIDAD_CONTRATADA_REG: {
    abreviatura: 'LCCR-',
    nombre: 'Llanogas Cantidad Contratada REG'
  },
  CUSIANA_FIRMEZA_GNV: {
    abreviatura: 'CFG-',
    nombre: 'Cusiana Firmeza GNV'
  },
  CUSIANA_FIRMEZA_REG: {
    abreviatura: 'CFR-',
    nombre: 'Cusiana Firmeza REG'
  },
  LLANOGAS_FIRMEZA_GNV: {
    abreviatura: 'LFG-',
    nombre: 'Llanogas Firmeza GNV'
  },
  LLANOGAS_FIRMEZA_REG: {
    abreviatura: 'LFR-',
    nombre: 'Llanogas Firmeza REG'
  },
  CUSIANA_EXCEDENTE_REAL_GNV: {
    abreviatura: 'CERG-',
    nombre: 'Cusiana Excendente Real GNV'
  },
  LLANOGAS_NOMINACION_REG: {
    abreviatura: 'LNR-',
    nombre: 'Llanogas Nominación REG'
  },
  LLANOGAS_NOMINACION_GNV: {
    abreviatura: 'LNG-',
    nombre: 'Llanogas Nominación GNV'
  },
  LLANOGAS_LECTURA_GNV: {
    abreviatura: 'LLG-',
    nombre: 'Llanogas Lectura GNV'
  },
  LLANOGAS_LECTURA_REG: {
    abreviatura: 'LLR-',
    nombre: 'Llanogas Lectura REG'
  },
  LLANOGAS_EXCEDENTE_REG: {
    abreviatura: 'LER-',
    nombre: 'Llanogas Excedente REG'
  },
  LLANOGAS_EXCEDENTE_GNV: {
    abreviatura: 'LEG-',
    nombre: 'Llanogas Excedente GNV'
  },
  LLANOGAS_DEFICIENTE_GNV: {
    abreviatura: 'LDG-',
    nombre: 'Llanogas Deficiente GNV'
  },
  LLANOGAS_DEFICIENTE_REG: {
    abreviatura: 'LDR-',
    nombre: 'Llanogas Deficiente REG'
  },
  CUSIANA_EXCEDENTE_REAL_REG: {
    abreviatura: 'CERR-',
    nombre: 'Cusiana Excedente Real REG'
  },
  LLANOGAS_EXCEDENTE_ASUME_GNV: {
    abreviatura: 'LEAG-',
    nombre: 'Llanogas Excedente Asume GNV'
  },
  LLANOGAS_EXCEDENTE_ASUME_REG: {
    abreviatura: 'LEAR-',
    nombre: 'Llanogas Excedente Asume REG'
  },
  CUSIANA_EXCEDENTE_ASUME_GNV: {
    abreviatura: 'CEAG-',
    nombre: 'Cusiana Excedente Asume GNV'
  },
  CUSIANA_EXCEDENTE_ASUME_REG: {
    abreviatura: 'CEAR-',
    nombre: 'Cusiana Excedente Asume REG'
  },
  CUSIANA_VALOR_MEDIDOR_USD_GNV: {
    abreviatura: 'CVMUG-',
    nombre: 'Cusiana Valor Medidor USD GNV'
  },
  CUSIANA_VALOR_MEDIDOR_USD_REG: {
    abreviatura: 'CVMUR-',
    nombre: 'Cusiana Valor Medidor USD REG'
  },
  CUSIANA_VALOR_MEDIDOR_PESOS_GNV: {
    abreviatura: 'CVMPG-',
    nombre: 'Cusiana Valor Medidor Pesos GNV'
  },
  CUSIANA_VALOR_MEDIDOR_PESOS_REG: {
    abreviatura: 'CVMPR-',
    nombre: 'Cusiana Valor Medidor Pesos REG'
  },
  CUSIANA_TOTAL_DIA_USD_GNV: {
    abreviatura: 'CTDUG-',
    nombre: 'Cusiana Valor Día Cusiana USD GNV'
  },
  CUSIANA_TOTAL_DIA_USD_REG: {
    abreviatura: 'CTDUR-',
    nombre: 'Cusiana Valor Día Cusiana USD REG'
  },
  CUSIANA_TOTAL_FACTURA_USD: {
    abreviatura: 'CTFU-',
    nombre: 'Cusiana Total Factura USD'
  },
  LLANOGAS_VALOR_MEDIDOR_USD_GNV: {
    abreviatura: 'LVMUG-',
    nombre: 'Llanogas Valor Medidor USD GNV'
  },
  LLANOGAS_VALOR_MEDIDOR_USD_REG: {
    abreviatura: 'LVMUR-',
    nombre: 'Llanogas Valor Medidor USD REG'
  },
  LLANOGAS_TOTAL_DIA_USD_REG: {
    abreviatura: 'LTDUG-',
    nombre: 'Llanogas Total Día USD GNV'
  },
  LLANOGAS_TOTAL_DIA_USD_GNV: {
    abreviatura: 'LTDUR-',
    nombre: 'Llanogas Total Dia USD REG'
  },
  LLANOGAS_TOTAL_FACTURA_USD: {
    abreviatura: 'LTFU-',
    nombre: 'Llanogas Total Factura USD'
  },
  CUSIANA_CANTIDAD_FIRME_GNV: {
    abreviatura: 'CCFG-',
    nombre: 'Cusiana Cantidad Firme GNV'
  },
  CUSIANA_CANTIDAD_FIRME_REG: {
    abreviatura: 'CCFR-',
    nombre: 'Cusiana Cantidad Firme REG'
  },
}
