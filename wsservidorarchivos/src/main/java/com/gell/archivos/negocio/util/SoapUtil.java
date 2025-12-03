/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.archivos.negocio.util;

import com.gell.estandar.constante.EAplicacion;
import com.gell.estandar.constante.EMensajeEstandar;
import com.gell.estandar.dto.ArchivoDTO;
import com.gell.estandar.excepcion.AplicacionExcepcion;
import com.gell.estandar.util.LogUtil;
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.xml.soap.MessageFactory;
import javax.xml.soap.SOAPFault;
import javax.xml.soap.SOAPMessage;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

/**
 *
 * @author God
 */
@SuppressWarnings("UseSpecificCatch")
public class SoapUtil {

  private static final Map<String, String> METODOS = new HashMap<>();
  
  //CONSTANTES PRUEBAS
  /*
  private static String ID_DIR_NOCON = "30003";
  private static String ID_DIR_AGAU = "30001";
  private static String ID_DIR_VEPOS = "29999";
  private static String ID_DIR_REIAL = "30005";
  private static String ID_DIR_PAWEB = "30007";
  private static String ID_DIR_RUGII = "42370";
  private static String ID_DIR_SURES = "41235";
  private static String ID_DIR_DORBI = "45182";
  private static String ID_DIR_RISISE = "45115";
  private static String ID_DIR_PRISMA = "45113";
  private static String ID_DIR_HOMAFO = "45177";
  private static String ID_DIR_TARGAS = "45150";
  private static String ID_DIR_EMERGENCIAS = "45175";
  private static String ID_DIR_NOVECO = "45180";
  */

  //CONSTANTES PRODUCCION
  private static String ID_DIR_NOCON = "30003";
  private static String ID_DIR_AGAU  = "30001";
  private static String ID_DIR_VEPOS = "29999";
  private static String ID_DIR_REIAL = "30005";
  private static String ID_DIR_PAWEB = "30007";
  private static String ID_DIR_RUGII = "42370";
  private static String ID_DIR_SURES = "41235";
  private static String ID_DIR_HOMAFO = "58370";
  private static String ID_DIR_DORBI = "58372";
  private static String ID_DIR_RISISE = "53712";
  private static String ID_DIR_PRISMA = "53710";
  private static String ID_DIR_TARGAS = "58374";
  private static String ID_DIR_EMERGENCIAS = "62774";
  private static String ID_DIR_NOVECO = "58367";
  /**
   * Inicializa todos los métodos de cargar archivo y solicitar archivo
   *
   * @throws IOException
   */

  public static void configurar()
          throws IOException
  {
    String rutaArchivo = "/azdigital/MetodosAZDigital.god";
    try (InputStream archivo = SoapUtil.class.getResourceAsStream(rutaArchivo);
            BufferedReader lector = new BufferedReader(new InputStreamReader(archivo))) {
      String linea = lector.readLine();
      StringBuilder contenido = new StringBuilder();
      while (linea != null) {
        contenido.append(linea);
        linea = lector.readLine();
      }
      procesarArchivo(contenido.toString());
    }
    LogUtil.info("Métodos SOAP: " + METODOS.toString());
  }

  /**
   * Toma el archivo de configuraciones que está dentro de la carpeta de
   * resource/azdigital y procesa los métodos
   *
   * @param archivo Nombre del archivo a procesar
   */
  private static void procesarArchivo(String archivo)
  {
    archivo = archivo.replaceAll("\n", "");
    Pattern pattern = Pattern.compile("(.*?)(=>)(\\[.*?\\])");
    Matcher matcher = pattern.matcher(archivo);
    while (matcher.find()) {
      String nombre = matcher.group(1);
      String valor = matcher.group(3);
      valor = valor.replaceAll(Pattern.quote("["), "");
      valor = valor.replaceAll(Pattern.quote("]"), "");
      METODOS.put(nombre.trim(), valor.trim());
    }
  }

  /**
   * Realiza la petición a AZDigital
   *
   * @param peticion información de la petición
   * @return
   * @throws AplicacionExcepcion
   */
  private static SOAPMessage invocar(String peticion)
          throws AplicacionExcepcion
  {
    try {
      String urlServidor = System.getProperty("servidor.ip.azdigital");
      URL url = new URL(urlServidor);
      HttpURLConnection conexion = (HttpURLConnection) url.openConnection();
      conexion.setRequestMethod("POST");
      conexion.setDoInput(true);
      conexion.setDoOutput(true);
      try (PrintStream salida = new PrintStream(conexion.getOutputStream())) {
        salida.println(peticion);
      }
      StringBuilder contenido = new StringBuilder();
      try (BufferedReader lector = new BufferedReader(new InputStreamReader(conexion.getInputStream()))) {
        String linea = lector.readLine();
        while (linea != null) {
          contenido.append(linea);
          linea = lector.readLine();
        }
      }
      conexion.disconnect();
      return procesarRespuesta(contenido.toString());
    } catch (AplicacionExcepcion ex) {
      throw ex;
    } catch (Exception ex) {
      LogUtil.error(ex);
      throw new AplicacionExcepcion(EMensajeEstandar.ERROR_INVOCAR_SERVICIO);
    }
  }

  /**
   * Valida si la respuesa tiene errores
   *
   * @param contenido respuesta por parte de AZDigital
   * @return
   * @throws Exception
   */
  private static SOAPMessage procesarRespuesta(String contenido)
          throws Exception
  {
    try (ByteArrayInputStream in = new ByteArrayInputStream(contenido.getBytes())) {
      SOAPMessage message = MessageFactory.newInstance().createMessage(null, in);
      SOAPFault error = message.getSOAPBody().getFault();
      if (error != null) {
        String mensaje = error.getFaultCode() + " " + error.getFaultString();
        throw new AplicacionExcepcion(EMensajeEstandar.ERROR_SOAP_METODO, mensaje);
      }
      return message;
    }
  }

  /**
   * Carga el arhivo a AZDigital
   *
   * @param archivo información del archivo a cargar
   * @param aplicacion Información de la aplicación que está solicitando el
   * archivo
   * @throws AplicacionExcepcion Error al subir el archivo a AZDigital
   */
  public static void cargarArchivo(ArchivoDTO archivo, EAplicacion aplicacion)
          throws AplicacionExcepcion
  {
    String peticion = METODOS.get("CargarArchivo");
    Map<String, String> propiedades = new HashMap<>();
    propiedades.put("IdDirectorio", getDirectorio(aplicacion));
    if (archivo.getPathRelativoAZ() != null) {
      propiedades.put("PathRelativoAZ", archivo.getPathRelativoAZ());
    }
    propiedades.put("Nombre", archivo.getNombreOriginal());
    propiedades.put("Codificacion", "Base64");
    StringBuilder contenidoPropiedades = new StringBuilder();
    Set<String> listaNombrePorpiedades = propiedades.keySet();
    //Se procesan los atributod a AZDigital
    for (String nombrePropiedad : listaNombrePorpiedades) {
      String valor = propiedades.get(nombrePropiedad);
      contenidoPropiedades.append(nombrePropiedad)
              .append("=\"")
              .append(valor)
              .append("\" ");
    }
    peticion = peticion.replaceAll("__PROPIEDADES__", contenidoPropiedades.toString());
    peticion = peticion.replaceAll("__ARCHIVO__", archivo.getContenido());
    SOAPMessage mensaje = invocar(peticion);
    try {
      Document documento = mensaje.getSOAPBody().extractContentAsDocument();
      documento.normalizeDocument();
      Element elemento = documento.getDocumentElement();
      String idArchivo = elemento.getAttribute("NuevoArId");
      archivo.setId(idArchivo)
              .setContenido(null);
    } catch (Exception e) {
      LogUtil.error(e);
      throw new AplicacionExcepcion(EMensajeEstandar.ERROR_SOAP_RESPUESTA);
    }
  }

  /**
   * Consulta un archivo por el ID
   *
   * @param idArchivo Identificador del archivo
   * @return información total del archivo
   * @throws AplicacionExcepcion
   */
  public static ArchivoDTO solicitarArchivo(String idArchivo)
          throws AplicacionExcepcion
  {
    String peticion = METODOS.get("SolicitarArchivo");
    peticion = peticion.replaceAll("__IDARCHIVO__", "Id = \"" + idArchivo + "\"");
    SOAPMessage mensaje = invocar(peticion);
    try {
      Document documento = mensaje.getSOAPBody().extractContentAsDocument();
      documento.normalizeDocument();
      Element elemento = documento.getDocumentElement();
      String nombre = elemento.getAttribute("Nombre");
      String tipo = elemento.getAttribute("TipoMime");
      String contenido = elemento.getElementsByTagName("Archivo")
              .item(0).getTextContent();
      return new ArchivoDTO()
              .setId(idArchivo)
              .setNombre(nombre)
              .setNombreOriginal(nombre)
              .setTipo(tipo)
              .setContenido(contenido);
    } catch (Exception e) {
      LogUtil.error(e);
      throw new AplicacionExcepcion(EMensajeEstandar.ERROR_SOAP_RESPUESTA);
    }
  }

  /**
   * De acuuerdo a la aplicación devuelve el directorio que pertenece
   *
   * @param aplicacion Nombre de la aplicación que está subiendo el archivo
   * @return Directorio al que se va a subir el archivo
   * @throws AplicacionExcepcion
   */
  private static String getDirectorio(EAplicacion aplicacion)
          throws AplicacionExcepcion {

    switch (aplicacion) {
        case NOCON:       
            return ID_DIR_NOCON;
        case AGAU:        
            return ID_DIR_AGAU;
        case VEPOS:       
            return ID_DIR_VEPOS;
        case REIAL:       
            return ID_DIR_REIAL;
        case PAWEB:       
            return ID_DIR_PAWEB;
        case RUGII:
            return ID_DIR_RUGII;
        case SURES:
            return ID_DIR_SURES;
        case DORBI:
            return ID_DIR_DORBI;
        case HOMAFO:
            return ID_DIR_HOMAFO;
      case PRISMA:
        return ID_DIR_PRISMA;
      case RISISE:
        return ID_DIR_RISISE;
      case TARGAS:
        return ID_DIR_TARGAS;
      case EMERGENCIAS:
        return ID_DIR_EMERGENCIAS;
      case NOVECO:
        return ID_DIR_NOVECO;
    }
    throw new AplicacionExcepcion(
            EMensajeEstandar.ERROR_APLICACION_NO_ENTRADA,
            aplicacion.getNombreAplicacion());
  }

}
