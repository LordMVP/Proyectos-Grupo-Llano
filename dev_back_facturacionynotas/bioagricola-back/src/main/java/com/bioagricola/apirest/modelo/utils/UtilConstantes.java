package com.bioagricola.apirest.modelo.utils;

/**
 * Clase con constantes consultadas por diferentes clases de la aplicaciÃ³n
 *
 * @author GeneradorCRUD
 */
public class UtilConstantes {

    public static final String SEPARADOR_HTTP_ORDER_BY = "$";
    public static final String CARACTER_DE_ESCAPE = "\\";
    public static final String SEPARADOR_PARAMETROS_CONSULTA = "&";

    //ManejadorCrud
    public static final String NULL_VALUE = "NULL";
    public static final String NOT_NULL_VALUE = "NOT NULL";

    //UtilReflection
    public static final String LONG_PRIMITIVE = "long";
    public static final String INT_PRIMITIVE = "int";

    //Tipos de datos consumidos o producidos por los servicios
    public static final String APPLICATION_JSON = "application/json";
    public static final String APPLICATION_X_WWW_FORM_URLENCODED = "application/x-www-form-urlencoded";
    public static final String TEXT_PLAIN = "text/plain";
    public static final String NONE = "NONE";

    //Tipos de metodos petición
    public static final String POST = "POST";
    public static final String GET = "GET";
    public static final String PUT = "PUT";
    public static final String DELETE = "DELETE";

    private UtilConstantes() {
    }

}
