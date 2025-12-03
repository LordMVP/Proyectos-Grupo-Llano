/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.estandar.util;

import com.gell.estandar.constante.EMensajeEstandar;
import com.gell.estandar.dto.ArchivoDTO;
import com.gell.estandar.excepcion.AplicacionExcepcion;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author God
 */
public class ArchivoUtil {

  /**
   * Convierte un archivo que está almacenado en Base64 y lo devuelve en un
   * arreglo
   *
   * @param archivo Información del archivo
   * @return archivo en arreglo de byte
   */
  public static byte[] convertirArchivo(String archivo)
  {
    return Base64.getDecoder().decode(archivo);
  }

  /**
   * Convierte un archivo que está almacendado en byte y lo pasa a un String
   * base64
   *
   * @param data contenido del archivo
   * @return String en Base64
   */
  public static String convertirBase64(byte[] data)
  {
    return Base64.getEncoder().encodeToString(data);
  }

  /**
   * Convierte un Archvo de tipo spring a un Archivo de tipo AzDigital
   *
   * @param archivo Información del archivo
   * @return Archivo con el formato de AZDigital
   * @throws AplicacionExcepcion Error al realizar la conversión
   */
  public static ArchivoDTO convertir(MultipartFile archivo)
          throws AplicacionExcepcion
  {
    try {
      String contenido = convertirBase64(archivo.getBytes());
      return new ArchivoDTO()
              .setContenido(contenido)
              .setNombre(archivo.getName())
              .setNombreOriginal(archivo.getOriginalFilename())
              .setTipo(archivo.getContentType());
    } catch (IOException ex) {
      LogUtil.error(ex);
      throw new AplicacionExcepcion(EMensajeEstandar.ERROR_CONVERTIR_ARCHIVO);
    }
  }

  /**
   * Convierte un Archvo de tipo spring a un Archivo de tipo AzDigital
   *
   * @param lista Lista de archivos con el formato de SpringBoot
   * @return Lista de archivo con el formato de AZDigital
   * @throws AplicacionExcepcion Error al realizar la conversión
   */
  public static List<ArchivoDTO> convertir(MultipartFile[] lista)
          throws AplicacionExcepcion
  {
    try {
      List<ArchivoDTO> listaArchivos = new ArrayList<>();
      for (MultipartFile archivo : lista) {
        String contenido = convertirBase64(archivo.getBytes());
        ArchivoDTO infoArchivo = new ArchivoDTO()
                .setContenido(contenido)
                .setNombre(archivo.getName())
                .setNombreOriginal(archivo.getOriginalFilename())
                .setTipo(archivo.getContentType());
        listaArchivos.add(infoArchivo);
      }
      return listaArchivos;
    } catch (IOException ex) {
      LogUtil.error(ex);
      throw new AplicacionExcepcion(EMensajeEstandar.ERROR_CONVERTIR_ARCHIVO);
    }
  }

}
