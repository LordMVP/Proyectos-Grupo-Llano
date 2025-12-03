/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.archivos.negocio.servicio;

import com.gell.archivos.negocio.util.SoapUtil;
import com.gell.estandar.constante.EAplicacion;
import com.gell.estandar.excepcion.AplicacionExcepcion;
import com.gell.estandar.constante.EMensajeEstandar;
import com.gell.estandar.dto.ArchivoDTO;
import com.gell.estandar.dto.AuditoriaDTO;
import java.util.List;
import org.springframework.stereotype.Service;

/**
 *
 * @author God
 */
@SuppressWarnings("UseSpecificCatch")
@Service
public class ArchivoServicio extends GenericoServicio
{

//  String ruta = "/opt/archivos";

  /**
   * Método encargado de guardar el archivo en el programa de AZDigital
   *
   * @param listaArchivos Listado de archivos a guardar
   * @return información del archivo que se almacenó
   * @throws AplicacionExcepcion
   */
  public List<ArchivoDTO> guardar(List<ArchivoDTO> listaArchivos)
          throws AplicacionExcepcion
  {
    if (listaArchivos == null) {
      throw new AplicacionExcepcion(EMensajeEstandar.ERROR_ADJUNTAR_ARCHIVO);
    }
    EAplicacion aplicacion = EAplicacion.convertir(auditoria()
            .getParametro(AuditoriaDTO.PARAMETRO_APLICACION));
    for (ArchivoDTO archivo : listaArchivos) {
      SoapUtil.cargarArchivo(archivo, aplicacion);
    }
    return listaArchivos;
  }

  /**
   * Método encargado de consultar los archivos que están almacenados en el
   * programa de AZDigital
   *
   * @param id identificador del archivo o documento
   * @return
   * @throws AplicacionExcepcion
   */
  public ArchivoDTO consultar(String id)
          throws AplicacionExcepcion
  {
    return SoapUtil.solicitarArchivo(id);
  }
  
  
//  /**
//   * Método encargado de guardar el archivo en el programa de AZDigital
//   *
//   * @param listaArchivos Listado de archivos a guardar
//   * @param ruta Ubicación del archivo
//   * @return información del archivo que se almacenó
//   * @throws AplicacionExcepcion
//   */
//  public List<ArchivoDTO> guardar(List<ArchivoDTO> listaArchivos)
//          throws AplicacionExcepcion
//  {
//    if (listaArchivos == null) {
//      throw new AplicacionExcepcion(EMensajeEstandar.ERROR_ADJUNTAR_ARCHIVO);
//    }
//
//    for (ArchivoDTO archivo : listaArchivos) {
//      try {
//        String id = UUID.randomUUID().toString();
//        String extension = NombreUtil.getExtension(archivo.getNombreOriginal());
//        String nombreArchivo = ruta + "/" + id + "." + extension;
//        LogUtil.info("Nombre Archivo: " + nombreArchivo);
//        File rutaArchivo = new File(nombreArchivo);
//        byte[] data = ArchivoUtil.convertirArchivo(archivo.getContenido());
//        Files.write(rutaArchivo.toPath(), data);
//        archivo.setContenido(null)
//                .setId(id);
//      } catch (Exception e) {
//        LogUtil.error(e);
//        throw new AplicacionExcepcion(EMensajeEstandar.ERROR_ADJUNTAR_ARCHIVO);
//      }
//    }
//    return listaArchivos;
//  }
//
//  /**
//   * Método encargado de consultar los archivos que están almacenados en el
//   * programa de AZDigital
//   *
//   * @param id
//   * @param ruta
//   * @return
//   * @throws AplicacionExcepcion
//   */
//  public ArchivoDTO consultar(String id)
//          throws AplicacionExcepcion
//  {
//    try {
//
//      File[] listaArchivos = new File(ruta).listFiles((File pathname) -> {
//        return pathname.getName().contains(id);
//      });
//      if (listaArchivos == null || listaArchivos.length == 0) {
//        throw new AplicacionExcepcion(EMensajeEstandar.ERROR_ARCHIVO_NO_EXISTE);
//      }
//      File archivoEncontrado = listaArchivos[0];
//      byte[] data = Files.readAllBytes(archivoEncontrado.toPath());
//      String archivoBase64 = Base64.getEncoder().encodeToString(data);
//      return new ArchivoDTO()
//              .setContenido(archivoBase64);
//    } catch (IOException ex) {
//      LogUtil.error(ex);
//      throw new AplicacionExcepcion(EMensajeEstandar.ERROR_ARCHIVO_NO_EXISTE);
//    }
//  }  

}
