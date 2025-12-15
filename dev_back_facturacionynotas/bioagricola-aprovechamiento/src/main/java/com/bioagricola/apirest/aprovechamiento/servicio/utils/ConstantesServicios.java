package com.bioagricola.apirest.aprovechamiento.servicio.utils;

/**
 * Constantes utilizadas en los servicios.
 * @author GeneradorCRUD
 */

public class ConstantesServicios {


    //Tipos de datos consumidos o producidos por los servicios
    public static final String APPLICATION_JSON = "application/json";
    public static final String TEXT_PLAIN = "text/plain";

    //Respuestas del servicio de consulta PQR
    public static final String BUSQUEDA_EXITOSA = "Búsqueda exitosa";
    public static final String ERROR_DATOS_PQR = "El código de PQR existe, pero no corresponde a los criterios seleccionados, ¿Desea reemplazarlos?";
    public static final String ERROR_CONSULTA_RESULTADOS = "No se encontraron resultados para la búsqueda";
    public static final String CODIGO_RESPUESTA_EXITOSA = "0";
    public static final String CODIGO_RESPUESTA_FALLIDA = "1";
    public static final String CODIGO_SIN_RESULTADOS = "2";

    //URL's del proyecto
    public static final String URL_SERVICIO_TOKEN = "http://localhost:8080";

    //Formatos requeridos en conversiones para los servicios
    public static final String TIMESTAMP_FORMAT = "yyyy-MM-dd";

    //Variables de aprovechamiento
    public static final String UNIDAD_APROVECHAMIENTO = "APROVECHAMIENTO";
    public static final String CLASIFICACION_TERCERO_APROVECHADOR = "uni_clatercero_aprovechador";
    public static final String CLASIFICACION_TERCERO_INCENTIVO_APROVECHADOR = "uni_clatercero_incentivoaprovechador";
    public static final String PARAM_PERMISOS = "unidad_edicion_parametrizacion_concepto";
    public static final String CICLO_LIQUIDACION = "ciclo_control";
    public static final String CLASIFICACION_LIQUIDACION= "liquidacion_clasificacion";

    //Variables tercero aprovechador
    public static final String INFO_TERCEROAPROVECHADOR = "incentivo_aprovechamiento_municipios_prestacion";
    public static final String PERMISOS_PARAMETRIZACION = "unidad_edicion_parametrizacion_concepto";
    public static final String LIQUIDACION_AFORADOS = "liquidacion_aforados";
    public static final String PORCENTAJE_PARTICIPACION_AFORO_APROVECHAMIENTO = "PORCENTAJE_PARTICIPACION_AFORO_APROVECHAMIENTO";

    //Constantes coli_conliquida_aprovechamiento
    public static final String COLI_APROV_ESTADO = "A";

    //Constantes con_concepto
    public static final String CON_CONPROPIEDAD = "con_propiedad";
    public static final String APROVECHAMIENTO = "%\"aprovechamiento\"%";
    public static final String INCENTIVO_APROVECHAMIENTO = "%\"incentivo_aprovechamiento\"%";

    public static final String [] MESES = {"01","02","03","04","05","06","07","08","09","10","11","12"};

    private ConstantesServicios() {
    }

    //Estados facturas liquidacion aprovechamiento
    public static final String FAC_EST_ACTIVA = "A";
    public static final String FAC_EST_CASTIGADA = "C";
    public static final String FAC_EST_FINANCIADA = "F";
    public static final String FAC_EST_PARAM = "N";
    public static final String PARAMETERS = "parameters";
    public static final String UNI_CONCEPTO_TAFA = "UNI_CONCEPTO_TAFA";
    public static final String REPORTE_PRESUPUESTO_APROVECHAMIENTO = "reporte_presupuesto_aprovechamiento";

    public static final String UNI_DOCUMENTO_NOTA_DEBITO = "uni_documento_nota_debito";
    public static final String UNI_DOCUMENTO_NOTA_CREDITO = "uni_documento_nota_credito";
    public static final String UNI_DOCUMENTO_NOTA_CREDITO_SALDO_FAVOR = "uni_documento_nota_credito_saldo_favor";


    public static final String TIPO_APROVECHAMIENTO = "'aprovechamiento'";
    public static final String NUMERO_HILOS_APROVECHAMIENTO = "NUMERO_HILOS_APROVECHAMIENTO";
    public static final String TIPO_INCENTIVO_APROVECHAMIENTO = "'incentivo_aprovechamiento'";
    public static final String ERROR_CONCEPTOS = "No existen conceptos de aprovechamiento parametrizados para realizar la consolidación de pago a terceros aprovechadores, cartera pendiente y cartera castigada. Verifique e intente de nuevo";

    public static final String ERROR_FORMATO_FECHA = "El formato de fecha es incorrecto";


}
