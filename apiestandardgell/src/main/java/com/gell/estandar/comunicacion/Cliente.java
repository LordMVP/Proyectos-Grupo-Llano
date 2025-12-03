/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.estandar.comunicacion;

import com.gell.estandar.constante.EMensajeEstandar;
import com.gell.estandar.dto.PeticionDTO;
import com.gell.estandar.dto.RespuestaDTO;
import com.gell.estandar.excepcion.AplicacionExcepcion;
import com.gell.estandar.util.LogUtil;
import com.google.gson.Gson;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

/**
 *
 * @author God
 */
class Cliente
{

  private Cliente()
  {
  }

  /**
   * Método encargado de realizar la conexión al servidor de archivos
   *
   * @param peticion .
   * @return Respuesta del servidor
   * @throws com.gell.estandar.excepcion.AplicacionExcepcion
   */
  public static <T extends Object> RespuestaDTO<T> conectar(PeticionDTO peticion)
          throws AplicacionExcepcion
  {
    if (peticion == null) {
      throw new AplicacionExcepcion(EMensajeEstandar.ERROR_VALIDACION_MENSAJE,
              "Debe ingresar la información de la petición");
    }
    peticion.validar();
    HttpURLConnection cnn = null;
    try {
      URL url = new URL(peticion.getRuta());
      LogUtil.info(url.toString());
      cnn = (HttpURLConnection) url.openConnection();
      cnn.setRequestMethod(peticion.getMetodo());
      cnn.setRequestProperty("Content-Type", peticion.getTipoContenido());
      cnn.setRequestProperty("Aplicacion", peticion.getNombreAplicacion());
      if (peticion.getToken() != null && !peticion.getToken().isEmpty()) {
        cnn.setRequestProperty("Authorization", peticion.getToken());
      }
      cnn.setDoOutput(true);
      cnn.setDoInput(true);
      try (PrintStream salida = new PrintStream(cnn.getOutputStream())) {
        salida.print(peticion.getParametros());
        salida.flush();
      }
      StringBuilder contenido = new StringBuilder();
      try (BufferedReader lector = new BufferedReader(new InputStreamReader(cnn.getInputStream(), "UTF-8"))) {
        String linea = lector.readLine();
        while (linea != null) {
          contenido.append(linea);
          linea = lector.readLine();
        }
      }
      RespuestaDTO<T> respuesta = new Gson().fromJson(contenido.toString(), peticion.getTipo());
      if (respuesta.getCodigo() < 0) {
        throw new AplicacionExcepcion(respuesta.getCodigo(), respuesta.getMensaje());
      }
      return respuesta;
    } catch (MalformedURLException ex) {
      LogUtil.error(ex);
    } catch (IOException ex) {
      LogUtil.error(ex);
    } finally {
      if (cnn != null) {
        cnn.disconnect();
      }
    }
    throw new AplicacionExcepcion(EMensajeEstandar.ERROR_CONECTAR);
  }
}
