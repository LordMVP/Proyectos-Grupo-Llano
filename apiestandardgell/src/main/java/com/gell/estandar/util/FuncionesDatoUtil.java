/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.estandar.util;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gell.estandar.constante.EMensajeEstandar;
import com.gell.estandar.excepcion.AplicacionExcepcion;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Properties;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import org.apache.commons.validator.routines.DateValidator;
import org.apache.commons.validator.routines.DoubleValidator;
import org.apache.commons.validator.routines.EmailValidator;
import org.apache.commons.validator.routines.LongValidator;

/**
 * Clase que tiene todas las funciones básicas que se pueden hacer un un dato
 *
 * @author god
 */
public class FuncionesDatoUtil
{

  /**
   * Elimina los espacios al inicio y al final de una cadena
   *
   * @param valor cadena sin espacios o null si el dato no llega
   * @return
   */
  public static String trim(String valor)
  {
    return (valor == null) ? null : valor.trim();
  }

  /**
   * Quita los espacios del inicio y al final de la cadena y lo convierte en un
   * double
   *
   * @param valor Devuelve el valor, pero si llega un nulo devuelve un nulo
   * @return Valor convertido
   */
  public static Double parseDouble(String valor)
  {
    if (trim(valor) == null) {
      return null;
    }
    return Double.parseDouble(valor);
  }

  /**
   * Genera un error por caga de archivo con la estructura básica
   *
   * @param indice
   * @param mensaje
   * @return
   */
  public static Properties errorLinea(int indice, String mensaje)
  {
    Properties error = new Properties();
    error.put("linea", String.valueOf(indice));
    error.put("mensaje", mensaje);
    return error;
  }

  /**
   * Convierte una cada de texto con formato JSON devuelto por la base de datos
   * a una cadena de texto con formato JSON a clases JAVA
   *
   * @param json
   * @return
   */
  public static String deSeparadoPorGuionesACamelCase(String json)
  {
    StringBuffer sb = new StringBuffer();
    Matcher m = Pattern.compile("(_[a-z]{1})([a-z]*)", Pattern.CASE_INSENSITIVE).matcher(json);
    while (m.find()) {
      String x = (m.group(1).toUpperCase() + m.group(2).toLowerCase());
      m.appendReplacement(sb, x);
    }
    json = m.appendTail(sb).toString().replaceAll("_", "");
    return json;
  }

//    public static String deCamelCaseASeparadoPorGuiones(String texto) {
//        String regex = "([a-z])([A-Z]+)";
//        String replacement = "$1_$2";
//        return texto
//                .replaceAll(regex, replacement)
//                .toLowerCase();
//    }
  /**
   * Método encargado de convertir un json en un Map se debe de asegurar que el
   * json sea un objeto y no una lista
   *
   * @param json Objeto que se quiere convertir en un mapa de llave - valor
   * @return
   * @throws AplicacionExcepcion
   */
  public static Map<String, String> jsonMap(String json)
          throws AplicacionExcepcion
  {
    if (json == null || "".equalsIgnoreCase(json.trim())) {
      return new HashMap<>();
    }
    TypeReference<Map<String, String>> tipo = new TypeReference<Map<String, String>>()
    {
    };
    try {
      return new ObjectMapper().readValue(json, tipo);
    } catch (IOException ex) {
      LogUtil.error(ex);
      throw new AplicacionExcepcion(EMensajeEstandar.ERROR_JSON_MAP);
    }
  }

  /**
   * Método encargado de convertir un json en un Map se debe de asegurar que el
   * json sea un objeto y no una lista
   *
   * @param json Objeto que se quiere convertir en un mapa de llave - valor
   * @return
   * @throws AplicacionExcepcion
   */
  public static Map<String, Object> jsonMapObject(String json)
          throws AplicacionExcepcion
  {
    if (json == null || "".equalsIgnoreCase(json.trim())) {
      return new HashMap<>();
    }
    TypeReference<Map<String, Object>> tipo = new TypeReference<Map<String, Object>>()
    {
    };
    try {
      return new ObjectMapper().readValue(json, tipo);
    } catch (IOException ex) {
      LogUtil.error(ex);
      throw new AplicacionExcepcion(EMensajeEstandar.ERROR_JSON_MAP);
    }
  }

  /**
   * Convierte un objeto en un string en formato JSON
   *
   * @param data Objeto que se quiere convertir en un JSON
   * @return String con la información convertidad
   * @throws AplicacionExcepcion Error al convertir
   */
  public static String json(Object data)
          throws AplicacionExcepcion
  {
    try {
      if (data == null) {
        return null;
      }
      return new ObjectMapper().writeValueAsString(data);
    } catch (IOException ex) {
      LogUtil.error(ex);
      throw new AplicacionExcepcion(EMensajeEstandar.ERROR_JSON);
    }
  }

  /**
   * Genera un json apartir de un objecto
   *
   * @param data objeto a convertir
   * @return Json con la información o null si no se puede convertir
   */
  public static String jsonDefecto(Object data)
  {
    try {
      return new ObjectMapper().writeValueAsString(data);
    } catch (IOException ex) {
      LogUtil.error(ex);
      return null;
    }
  }

  /**
   * Validar que el campo tenga un valor
   *
   * @param <T>
   * @param valor campo o atributo a validar
   * @param mensaje campo de la interfaz
   * @return
   * @throws AplicacionExcepcion
   */
  @SuppressWarnings("UseOfObsoleteCollectionType")
  public static <T extends Object> T validarRequerido(Object valor, String mensaje)
          throws AplicacionExcepcion
  {
    if (valor == null) {
      throw new AplicacionExcepcion(EMensajeEstandar.ERROR_VALIDACION_MENSAJE, mensaje);
    }
    Class claseValor = valor.getClass();
    if (claseValor == List.class
            || ArrayList.class == claseValor) {
      ValidacionObjeto.listaObligatoria((List) valor, mensaje);
    }
    String valorTexto = valor.toString().trim();
    if (valorTexto.equalsIgnoreCase("")) {
      throw new AplicacionExcepcion(EMensajeEstandar.ERROR_VALIDACION_MENSAJE, mensaje);
    }
    return (T) valor;
  }

  /**
   * Validar la fecha de un atributo o campo
   *
   * @param valor Información o dato a validar
   * @param mensaje campo de la interfaz a validar
   * @return
   * @throws AplicacionExcepcion
   */
  public static Date validarFecha(Object valor, String mensaje)
          throws AplicacionExcepcion
  {
    if (valor == null) {
      return null;
    }

    if (valor instanceof Date) {
      return (Date) valor;
    }

    String valorTexto = valor.toString().trim();
    if (valorTexto.equalsIgnoreCase("")) {
      return null;
    }

    DateValidator validator = DateValidator.getInstance();
    Date fechaCorta = validator.validate(valorTexto, "yyyy-MM-dd");
    if (fechaCorta != null) {
      return fechaCorta;
    }
    Date fechaLarga = validator.validate(valorTexto, "yyyy-MM-dd hh:mm:ss");
    if (fechaLarga != null) {
      return fechaLarga;
    }
    throw new AplicacionExcepcion(EMensajeEstandar.ERROR_VALIDACION_MENSAJE, mensaje);
  }

  /**
   * Verifica si el valor es un correo válido
   *
   * @param valor texto a validar si es un correo
   * @param mensaje nombre del campo de la interfaz
   * @return
   * @throws AplicacionExcepcion
   */
  public static String validarCorreo(Object valor, String mensaje)
          throws AplicacionExcepcion
  {
    if (valor == null) {
      return null;
    }
    String valorTexto = valor.toString().trim();
    if (valorTexto.equalsIgnoreCase("")) {
      return null;
    }
    boolean esCorreo = EmailValidator.getInstance().isValid(valorTexto);
    if (esCorreo) {
      return valorTexto;
    }
    throw new AplicacionExcepcion(EMensajeEstandar.ERROR_VALIDACION_MENSAJE, mensaje);
  }

  /**
   * Valida que el valor sea un número, double o long
   *
   * @param <T>
   * @param valor
   * @param mensaje
   * @return
   * @throws AplicacionExcepcion
   */
  public static <T extends Number> T validarNumero(Object valor, String mensaje)
          throws AplicacionExcepcion
  {
    if (valor == null) {
      return null;
    }
    String valorTexto = valor.toString().trim();
    if (valorTexto.equalsIgnoreCase("")) {
      return null;
    }
    LongValidator validacionEnteroLargo = LongValidator.getInstance();
    Long numeroEnteroLargo = validacionEnteroLargo.validate(valorTexto);
    if (numeroEnteroLargo != null) {
      return (T) numeroEnteroLargo;
    }
    DoubleValidator validacion = DoubleValidator.getInstance();
    Double numero = validacion.validate(valorTexto);
    if (numero != null) {
      return (T) numero;
    }
    throw new AplicacionExcepcion(EMensajeEstandar.ERROR_VALIDACION_MENSAJE, mensaje);
  }

  /**
   * Verfica si el valor del valor es nulo devuelvo el valor por defecto
   *
   * @param valor Valor a evaluar
   * @param defecto Valor que se devuelve si se encuentra nulo
   * @return valor por defecto o el mismo valor
   */
  public static String valorPorDefecto(String valor, String defecto)
  {
    return (valor == null) ? defecto : valor;
  }

  /**
   * Verfica si el valor de la variable es nulo si es así devuelve un string
   * vacío
   *
   * @param valor Valor a evaluar
   * @return Valor o un string vacío
   */
  public static String valorPorDefecto(String valor)
  {
    return FuncionesDatoUtil.valorPorDefecto(valor, "");
  }

  /**
   * Verifica si una cadena de texto está vacía
   *
   * @param parametro Cadena a evaluar
   * @return TRUE está vacía
   */
  public static boolean vacio(String parametro)
  {
    return parametro == null || parametro.trim().isEmpty();
  }

  /**
   * Valida si el objeto está vacío
   *
   * @param valor Información a validar
   * @return TREU Está vacío.
   */
  public static boolean vacio(Object valor)
  {
    if (valor == null) {
      return true;
    }
    if (valor instanceof String) {
      return vacio(valor.toString());
    }
    if (valor instanceof List) {
      return ((List) valor).isEmpty();
    }
    return false;
  }

  /**
   * Valida que el parámetro tenga un valor
   *
   * @param parametro
   * @return TRUE tiene valor FALSE está vacío
   */
  public static boolean tieneValor(String parametro)
  {
    return !vacio(parametro);
  }

  public static boolean nulo(Object data)
  {
    return data == null;
  }

  public static boolean tieneValor(Object data)
  {
    return !vacio(data);
  }

  /**
   * Obtiene una lista vacía cuando el valor del parámetro esté vacío
   *
   * @param <T> Entidad u Objeto que se va a llenar la clase
   * @param lista Lista vacía o el parámetro con su valor a evaluar
   * @return
   */
  public static <T extends Object> List<T> valorPorDefecto(List<T> lista)
  {
    return lista == null ? new ArrayList<>() : lista;
  }

  /**
   * Verifica si el valor está en los parámetros dinámicos, si alguno de los
   * parámetros es nulo el método retorna FALSO y si el valor que está buscando
   * se encuentra el retorna un TRUE
   *
   * @param valor valor a buscar
   * @param valores posibles opciones de valores de búsqueda
   * @return FALSE si no lo encuentra o alguno de los dos párametros es nulo, de
   * lo contrario devuelve TRUE
   */
  public static boolean verificarValor(String valor, String... valores)
  {
    if (valores == null || valor == null) {
      return false;
    }
    for (String parametro : valores) {
      if (Objects.equals(valor, parametro)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Convierte una cadena con formato JSON y lo devuelve en la clase que se
   * desea realizar la conversión
   *
   * @param <T> Clase a la que se quiere convertir
   * @param json Cadena de caracteres con el formato json
   * @param referencia {@code  new TypeReference<List<Clase>>() }
   * @return Objeto con la información del json
   * @throws AplicacionExcepcion Error al realizar la conversión
   */
  public static <T extends Object> T jsonObjeto(String json, TypeReference<T> referencia)
          throws AplicacionExcepcion
  {
    if (tieneValor(json) && referencia != null) {
      try {
        ObjectMapper objeto = new ObjectMapper();
        return objeto.readValue(json, referencia);
      } catch (IOException ex) {
        LogUtil.error(ex);
      }
    }
    throw new AplicacionExcepcion(EMensajeEstandar.ERROR_JSON);
  }

  /**
   * Convierte una cadena con formato JSON y lo devuelve en la clase que se
   * desea realizar la conversión
   *
   * @param <T> Clase a la que se quiere convertir
   * @param json Cadena de caracteres con el formato json
   * @param clase ClassName.class
   * @return Objeto con la información del json
   * @throws AplicacionExcepcion Error al realizar la conversión
   */
  public static <T extends Object> T jsonObjeto(String json, Class<T> clase)
          throws AplicacionExcepcion
  {
    if (tieneValor(json) && clase != null) {
      try {
        ObjectMapper objeto = new ObjectMapper();
        return objeto.readValue(json, clase);
      } catch (IOException ex) {
        LogUtil.error(ex);
      }
    }
    throw new AplicacionExcepcion(EMensajeEstandar.ERROR_JSON);
  }

  /**
   * Convierte una cadena con formato JSON y lo devuelve en la clase que se
   * desea realizar la conversión
   *
   * @param <T> Clase a la que se quiere convertir
   * @param json Cadena de caracteres con el formato json
   * @param referencia {@code  new TypeReference<List<Clase>>() }
   * @param defecto Valor que se quiere devolver en dado caso que no se puede
   * convertir el json
   * @return Objeto con la información del json
   */
  public static <T extends Object> T jsonObjetoPorDefecto(String json, TypeReference<T> referencia, Object defecto)
  {
    try {
      return jsonObjeto(json, referencia);
    } catch (AplicacionExcepcion ex) {
      LogUtil.info(ex.getMensaje(), json, referencia);
      return (T) defecto;
    }
  }

  /**
   * Convierte una cadena con formato JSON y lo devuelve en la clase que se
   * desea realizar la conversión
   *
   * @param <T> Clase a la que se quiere convertir
   * @param json Cadena de caracteres con el formato json
   * @param clase {@code  new TypeReference<List<Clase>>() }
   * @param defecto Valor que se quiere devolver en dado caso que no se puede
   * convertir el json
   * @return Objeto con la información del json
   */
  public static <T extends Object> T jsonObjetoPorDefecto(String json, Class<T> clase, Object defecto)
  {
    try {
      return jsonObjeto(json, clase);
    } catch (AplicacionExcepcion ex) {
      LogUtil.info(ex.getMensaje(), json, clase);
      return (T) defecto;
    }
  }

  /**
   * Método encargado de obtener un recurso
   *
   * @param recurso Nombre del recurso
   * @return
   */
  public static InputStream getRecurso(String recurso)
  {
    return FuncionesDatoUtil.class.getResourceAsStream(recurso);
  }

  /**
   * Separa una lista de objectos a un string separados por comas
   *
   * @param lista Lista a convertir a un string
   * @return
   */
  public static String separarComa(List lista)
  {
    if (lista == null || lista.isEmpty()) {
      return null;
    }
    Object datos = lista.stream()
            .map(String::valueOf)
            .collect(Collectors.joining(","));
    return datos.toString();
  }

  /**
   * Redondea un número a una cantidad específica de decimales
   *
   * @param value valor a redondear
   * @param places número de decimales que se quiere
   * @return
   */
  public static Double round(Double value, Integer places)
  {
    if (places < 0 || value == null) {
      throw new IllegalArgumentException();
    }
    long factor = (long) Math.pow(10, places);
    value = value * factor;
    long tmp = Math.round(value);
    return (double) tmp / factor;
  }

  public static double ceil(int decimales, double value)
  {
    return new BigDecimal(value)
            .setScale(decimales, RoundingMode.CEILING)
            .doubleValue();
  }

  /**
   * Valida que dos strings sean iguales sin importar mayúsculas y ninúsculas
   *
   * @param valor cadena a comparar
   * @param valor2 cadena a comparar
   * @return TRUE son iguales, FALSE no son iguales
   */
  public static boolean igual(String valor, String valor2)
  {
    if (nulo(valor) && nulo(valor2)) {
      return true;
    }
    if (nulo(valor) && tieneValor(valor2)) {
      return false;
    }
    return valor.equalsIgnoreCase(valor2);
  }

  /**
   * Método encargado de obtener el mensaje de la base de datos
   *
   * @param ex Excepción que lanza la base de datos
   * @return Mensaje con la descripción del error
   */
  public static String mensaje(SQLException ex)
  {
    if (ex == null) {
      return "";
    }
    String mensaje = ex.getMessage();
    if (mensaje == null) {
      return "";
    }
    int inicio = mensaje.indexOf("ERROR:");
    int fin = mensaje.indexOf("Where:");
    if (inicio < 0 || fin < 0) {
      return mensaje;
    }
    return mensaje.substring(inicio, fin);
  }

  /**
   * Valida un valor
   *
   * @param dato Valor a validar
   * @param validaciones Restricciones que se van a aplicar (requerido, fecha,
   * numero)
   * @param mensaje Mensaje si el valor no cumple
   * @throws AplicacionExcepcion Error que se produce por no cumplir
   */
  public static void validar(Object dato, String validaciones, String mensaje)
          throws AplicacionExcepcion
  {
    ValidarDato.validar(dato, validaciones, mensaje);
  }

  public static double menor(double... valores)
  {
    double valorMenor = valores[0];
    for (int i = 0; i < valores.length; i++) {
      double valor = valores[i];
      if (valorMenor > valor) {
        valorMenor = valor;
      }
    }
    return valorMenor;
  }

  public static void error(String mensaje)
          throws AplicacionExcepcion
  {
    throw new AplicacionExcepcion(EMensajeEstandar.ERROR_VALIDACION_MENSAJE, mensaje);
  }

  public Double sumar(double... valores)
  {
    double suma = 0;
    for (double valor : valores) {
      suma += valor;
    }
    return suma;
  }

}
