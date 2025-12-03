package com.gell.estandar.util;

import com.gell.estandar.excepcion.AplicacionExcepcion;
import java.util.Arrays;

/**
 *
 * @author lrey
 */
public class LogUtil
{

  private String nombreClase = "";

  public LogUtil()
  {
  }

  public void i(String mensaje)
  {
    System.out.println("Nombre Clase: " + nombreClase + ":" + mensaje);
  }

  public void i(Object... mensaje)
  {
    if (mensaje == null) {
      return;
    }
    for (Object valor : mensaje) {
      if (valor == null) {
        System.out.print(String.valueOf(valor) + " ");
        continue;
      }
      if (valor.getClass().isArray()) {
        Object[] valores = (Object[]) valor;
        System.out.print(Arrays.toString(valores));
        continue;
      }
      System.out.print(String.valueOf(valor) + " ");
    }
    System.out.println();
  }

  public LogUtil(String nombreClase)
  {
    this.nombreClase = nombreClase;
  }

  public void e(Throwable e)
  {
    e.printStackTrace();
  }

  public void e(Throwable e, String mensaje)
  {
    System.err.println("" + mensaje);
    e.printStackTrace();
  }

  public void e(AplicacionExcepcion ex)
  {
    if (ex.getCodigo() >= 0) {
      System.err.println(ex.getMensaje());
      return;
    }
    ex.printStackTrace();
  }

  public void e(String mensaje)
  {
    System.err.println(mensaje);
  }

  public static void error(Throwable e)
  {
    e.printStackTrace();
  }

  public static void error(Throwable e, String mensaje)
  {
    System.err.println("" + mensaje);
    e.printStackTrace();
  }

  public static void error(AplicacionExcepcion ex)
  {
    System.err.println(ex.getMensaje());
  }

  public static void info(String mensaje)
  {
    System.out.println(mensaje);
  }

  public static void info(Object... mensaje)
  {
    System.out.println(Arrays.toString(mensaje));
  }

  public static void infoError(Object obj)
  {
    System.err.println(obj);
  }

}
