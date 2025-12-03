/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.psews.negocio.procesos;

import com.gell.psews.negocio.constantes.EEstado;
import com.gell.psews.negocio.delegado.RecaudoDelegado;
import com.gell.psews.negocio.delegado.RecaudoWebDelegado;
import com.gell.psews.negocio.excepcion.NegocioExcepcion;
import com.gell.psews.negocio.servlet.PagoServlet;
import com.gell.psews.negocio.servlet.ServletGenerico;
import com.gell.psews.negocio.util.EnviarCorreo;
import com.gell.psews.negocio.util.LogUtil;
import com.gell.psews.persistencia.basedatos.ConexionBD;
import com.gell.psews.persistencia.dao.ParametroDAO;
import com.gell.psews.persistencia.dto.DetalleRecaudoWebDTO;
import com.gell.psews.persistencia.dto.RecaudoWebDTO;
import com.gell.psews.persistencia.dto.UsuarioDTO;
import com.gell.psews.persistencia.dto.pse.ConfiguracionDTO;
import com.gell.psews.persistencia.exception.PersistenciaExcepcion;
import com.gell.psews.vista.excepcion.AplicacionExcepcion;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.sql.Connection;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 *
 * Clase encargada de aplicar el pago en el sistema de prisma
 *
 * @author lrey
 */
@SuppressWarnings("UseSpecificCatch")
public class ProcesoAplicacionRecaudo implements Runnable
{

  private static boolean ejecutar = true;
  private StringBuilder mensajeErrores;
  private StringBuilder mensajeCorrectamente;

  private static ProcesoAplicacionRecaudo instancia = new ProcesoAplicacionRecaudo();

  private ProcesoAplicacionRecaudo()
  {
  }

  public static ProcesoAplicacionRecaudo getInstancia()
  {
    return instancia;
  }

  public void iniciarProceso()
  {
    if (PagoServlet.proceso != null && PagoServlet.proceso.isAlive()) {
      return;
    }
    detener();
    ejecutar = true;
    PagoServlet.proceso = new Thread(this);
    PagoServlet.proceso.start();
  }

  @Override
  public void run()
  {
    LogUtil.info("Proceso de aplicación de pago iniciado correctamente ");

    while (ejecutar) {
      LogUtil.info("INICIA PROCESO DE VERIFICACION PSE REC " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
      int cantidad = 0;
      mensajeErrores = new StringBuilder();
      mensajeCorrectamente = new StringBuilder();
      Connection cnn = null;
      ConfiguracionDTO configuracion = ServletGenerico.getConfiguracionDefecto();
      try {
        cnn = ConexionBD.conectar();
       long idControl = activarControlAplicacionRecaudo(cnn);
        LogUtil.info("IDCONTROL->"+idControl);
        if (idControl > 0) {
          RecaudoWebDelegado recaudoWebDelegado = new RecaudoWebDelegado(cnn);
          List<RecaudoWebDTO> listaPendientes = recaudoWebDelegado.consultarPendientesPago();
          LogUtil.info("Lista de recaudos pendientes: " + listaPendientes);
          for (RecaudoWebDTO recaudoWeb : listaPendientes) {
                configuracion = ServletGenerico.getConfiguracion(recaudoWeb.getTicketOfficeId());
                UsuarioDTO usuario = getUsuarioDTO(recaudoWeb, configuracion);            
                LogUtil.info("APLICACION DE PAGOS->"+usuario.getNombres());
                aplicarRecaudo(usuario, cnn, recaudoWeb, configuracion);
            cantidad++;
          }
          inactivarControlAplicacionRecaudo(cnn, idControl);
        }

      } catch (AplicacionExcepcion e) {
        LogUtil.error(e);
        EnviarCorreo.enviar(configuracion.getCorreo(), e.getMensaje());
      } catch (Exception e) {
        LogUtil.error(e);
        EnviarCorreo.enviar(configuracion.getCorreo(), e.getMessage());
      } finally {
        ConexionBD.cerrar(cnn);
      }
      if (cantidad > 0) {
        String plantilla = configuracion.getCorreo().getPlantilla();
        String mensaje = plantilla.replaceAll(" __SUSCRIPCIONESOK__", mensajeCorrectamente.toString());
        mensaje = mensaje.replaceAll("__SUSCRIPCIONESERROR__", mensajeErrores.toString());
        EnviarCorreo.enviar(configuracion.getCorreo(), mensaje);
      }
      esperar();
    }
  }

  private UsuarioDTO getUsuarioDTO(RecaudoWebDTO recaudoWeb, ConfiguracionDTO configuracion)
  {
    UsuarioDTO usuario = new UsuarioDTO();
    usuario.setValorAseo(0D);
    usuario.setValorGas(0D);
    for (DetalleRecaudoWebDTO detalleRecaudo : recaudoWeb.getListaDetalles()) {
        
        if (detalleRecaudo.getIdEmpresa() == configuracion.getEmpresa().getIdEmpresaSegunda()) {
        usuario.setIdSuscripcion(detalleRecaudo.getIdSuscripcion());
        usuario.setValorAseo(detalleRecaudo.getValorPago());
        continue;
      }
        if (detalleRecaudo.getIdEmpresa() == configuracion.getEmpresa().getIdEmpresaPrincipal()) {
        usuario.setValorGas(detalleRecaudo.getValorPago());
      }       
       //JLMENDOZA
        /*if (detalleRecaudo.getIdEmpresa() == configuracion.getEmpresa().getIdEmpresaPrincipal()) {
        usuario.setIdSuscripcion(detalleRecaudo.getIdSuscripcion());
        usuario.setValorGas(detalleRecaudo.getValorPago());
        continue;
      }
      if (detalleRecaudo.getIdEmpresa() == configuracion.getEmpresa().getIdEmpresaSegunda()) {
        usuario.setValorAseo(detalleRecaudo.getValorPago());
      }]*/
    }
    return usuario;
  }

  private void esperar()
  {
    Long tiempoEspera = ServletGenerico.getTiempoProcesoPSE() / 1000;
    for (int i = 0; i < tiempoEspera; i++) {
      try {
        Thread.sleep(1000);
      } catch (Exception e) {
        LogUtil.error(e);
      }
      if (!ejecutar) {
        throw new RuntimeException("El proceso se ha detenido a solicitud ");
      }
    }

  }

  private void aplicarRecaudo(UsuarioDTO usuario, Connection cnn, RecaudoWebDTO recaudoWeb, ConfiguracionDTO configuracion)
          throws PersistenciaExcepcion
  {
    RecaudoWebDelegado recaudoWebDelegado = new RecaudoWebDelegado(cnn);
    String estado = EEstado.DetalleRecaudoWeb.Aplicacion.APLICADO_EXITOSAMENTE;
    try {
      RecaudoDelegado recaudoDelegado = new RecaudoDelegado(cnn, usuario, configuracion, recaudoWeb);
      System.out.println("APLICARARECAUDO");
      recaudoDelegado.aplicarRecaudo();
      recaudoWebDelegado.actualizarDetallesRecaudoPago(estado, recaudoWeb, "Se aplicó correctamente el recaudo");
      System.out.println("PROCESADOOOO");
      ConexionBD.commit(cnn);
      mensajeCorrectamente.append(crearFila(usuario, estado, recaudoWeb));
    } catch (AplicacionExcepcion ex) {
      estado = EEstado.DetalleRecaudoWeb.Aplicacion.ERROR_APLICACION;
      mensajeErrores.append(crearFila(usuario, ex.getMensaje(), recaudoWeb));
      ConexionBD.rollbackSinError(cnn);
      recaudoWebDelegado.actualizarDetallesRecaudoPago(estado, recaudoWeb, ex.getMensaje());
      ConexionBD.commit(cnn);
    }
  }

  public static void detener()
  {
    if (PagoServlet.proceso != null) {
      LogUtil.info("Se procede a detener el subproceso");
      ejecutar = false;
      PagoServlet.proceso.interrupt();
      PagoServlet.proceso.stop();
      PagoServlet.proceso = null;
    }
  }

  private String crearFila(UsuarioDTO usuario, String mensaje, RecaudoWebDTO recaudoWeb)
  {
    StringBuilder fila = new StringBuilder();
    fila.append("<tr>");
    fila.append("<td>");
    fila.append(usuario.getIdSuscripcion());
    fila.append("</td>");
    fila.append("<td>");
    fila.append(recaudoWeb.getIdRecaudoWeb());
    fila.append("</td>");
    fila.append("<td>");
    fila.append(usuario.getValorGas());
    fila.append("</td>");
    fila.append("<td>");
    fila.append(usuario.getValorAseo());
    fila.append("</td>");
    fila.append("<td>");
    fila.append(mensaje);
    fila.append("</td>");
    fila.append("</tr>");
    return fila.toString();
  }

  private long activarControlAplicacionRecaudo(Connection cnn)
          throws PersistenciaExcepcion, NegocioExcepcion, UnknownHostException
  {
    /*  Consultar control de Proceso , si esta activo inserta nuevo estado A y retorna id de Control  */
    ParametroDAO parametros = new ParametroDAO(cnn);
    String host;
    long idControl;
    host = InetAddress.getLocalHost().toString();
    idControl = parametros.controlProceso(host);
    return idControl;
  }

  private boolean inactivarControlAplicacionRecaudo(Connection cnn, long idControl)
          throws PersistenciaExcepcion, NegocioExcepcion
  {
    /*  Inativar Id Proceso que se activo ,actualiza estado a I */
    boolean respuesta = false;
    ParametroDAO parametros = new ParametroDAO(cnn);
    respuesta = parametros.ActualizarControlProceso("I", idControl);
    return respuesta;
  }

}
