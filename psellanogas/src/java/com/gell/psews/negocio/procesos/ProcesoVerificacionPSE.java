/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.psews.negocio.procesos;

import com.gell.psews.negocio.constantes.EEstado;
import com.gell.psews.negocio.delegado.RecaudoWebDelegado;
import com.gell.psews.negocio.excepcion.NegocioExcepcion;
import com.gell.psews.negocio.servicio.PSEHostingTransactionInformationReturn;
import com.gell.psews.negocio.servicio.PSEHostingTransactionInformationReturnCode;
import com.gell.psews.negocio.servicio.PSEHostingTransactionState;
import com.gell.psews.negocio.servlet.ServletGenerico;
import com.gell.psews.negocio.util.LogUtil;
import com.gell.psews.negocio.util.ServicioPSE;
import com.gell.psews.persistencia.basedatos.ConexionBD;
import com.gell.psews.persistencia.dao.RecaudoWebLogDAO;
import com.gell.psews.persistencia.dto.RecaudoWebDTO;
import com.gell.psews.persistencia.dto.RecaudoWebLogDTO;
import com.gell.psews.persistencia.dto.pse.ConfiguracionDTO;
import com.gell.psews.persistencia.exception.PersistenciaExcepcion;
import com.google.gson.Gson;
import java.math.BigDecimal;
import java.sql.Connection;
import java.util.Date;
import java.util.List;
import javax.xml.datatype.DatatypeFactory;

/**
 *
 * @author lrey
 */
@SuppressWarnings("UseSpecificCatch")
public class ProcesoVerificacionPSE implements Runnable
{

  private static boolean ejecutar = true;
  private static final Object BLOQUEO = new Object();
  private static Thread proceso;
  private static final ProcesoVerificacionPSE procesoVerificacion = new ProcesoVerificacionPSE();

  private ProcesoVerificacionPSE()
  {
  }

  public static ProcesoVerificacionPSE getInstancia()
  {
    return procesoVerificacion;
  }

  public void iniciarProceso()
  {
    if (proceso != null && proceso.isAlive()) {
      return;
    }
    proceso = new Thread(this);
    proceso.start();
  }

  public static void detener()
  {
    if (proceso != null) {
      ejecutar = false;
      proceso.stop();
      proceso = null;
    }
  }

  @Override
  public void run()
  {
    while (ejecutar) {
      try {
        procesarLista();
      } catch (Throwable ex) {
        LogUtil.error(ex);
      }
      esperar();
    }
  }

  private void procesarLista()
          throws PersistenciaExcepcion
  {
    Connection cnn = null;
    try {
      cnn = ConexionBD.conectar();
      RecaudoWebDelegado recaudoWebDelegado = new RecaudoWebDelegado(cnn);
      List<RecaudoWebDTO> listaPendientes = recaudoWebDelegado.consultarPendientes();
      LogUtil.info("Lista de recaudos por verificar en PSE: " + listaPendientes);
      for (RecaudoWebDTO recaudoWeb : listaPendientes) {
        try {
          procesarRegistro(cnn, recaudoWeb);
          ConexionBD.commit(cnn);
        } catch (Exception ex) {
          LogUtil.error(ex);
          ConexionBD.rollback(cnn);
        }
      }
    } finally {
      ConexionBD.cerrar(cnn);
    }
  }

  private void esperar()
  {
    try {
      Thread.sleep(ServletGenerico.getTiempoProcesoPSE());
    } catch (Exception e) {
      LogUtil.error(e);
    }
  }

  public void procesarRegistro(Connection cnn, RecaudoWebDTO recaudoWebDTO)
          throws NegocioExcepcion, PersistenciaExcepcion
  {
    synchronized (BLOQUEO) {
      String respuesta = "";
      try {
        RecaudoWebLogDTO recaudoWebLog = guardarLog(recaudoWebDTO, cnn);
        RecaudoWebDelegado recaudoWebDelegado = new RecaudoWebDelegado(cnn);
        //Se valida que la información del webrecaudo no haya cambiado
        RecaudoWebDTO infoActual = recaudoWebDelegado.consultar(recaudoWebDTO.getIdRecaudoWeb());
        if (!EEstado.RecaudoWeb.PENDIENTE.equals(infoActual.getEstado())) {
          LogUtil.info("IdwebRecaudo:" + recaudoWebDTO.getIdRecaudoWeb() + " ya fue procesado por otro proceso ");
          return;
        }
        ConfiguracionDTO configuracion = ServletGenerico.getConfiguracion(infoActual.getTicketOfficeId());
        PSEHostingTransactionInformationReturn infoTransaccion = new PSEHostingTransactionInformationReturn(); //ServicioPSE.getTransactionInformationHosting(infoActual.getPaymentId(), configuracion);
        infoTransaccion.setPaymentID(infoActual.getPaymentId());
        infoTransaccion.setServiceCode(recaudoWebDTO.getServiceCode());        
        infoTransaccion.setState(PSEHostingTransactionState.OK);
        infoTransaccion.setReturnCode(PSEHostingTransactionInformationReturnCode.OK);
        infoTransaccion.setAmount(BigDecimal.ZERO);
        infoTransaccion.setVATAmount(BigDecimal.ZERO);
        //infoTransaccion.setSolicitedDate(DatatypeFactory.newInstance().newXMLGregorianCalendar(new Date().toString()));
        PSEHostingTransactionInformationReturnCode returnCode = infoTransaccion.getReturnCode();
        LogUtil.info("RETURN CODE"+returnCode.toString());
        respuesta = new Gson().toJson(infoTransaccion);
        LogUtil.info("RespuestaPSE idRecaudoWeb: " + recaudoWebDTO.getIdRecaudoWeb() + " Respuesta" + respuesta);
        actualizarLogRespuesta(respuesta, recaudoWebDTO, cnn);
        switch (returnCode) {
          case ERRORS:
          case INVALIDTICKETORPASSWORD:
            return;
          case INVALIDPAYMENTID:
            recaudoWebDTO.setEstado(EEstado.RecaudoWeb.ERROR);
            recaudoWebDelegado.actualizarRecaudoWeb(recaudoWebDTO, EEstado.DetalleRecaudoWeb.Pago.RECHAZADO);
            break;
          case OK:
            procesarTransaccionExitosa(infoTransaccion, recaudoWebDTO, cnn, recaudoWebLog);
            break;
        }
      } catch (Exception e) {
        ConexionBD.rollback(cnn);
        respuesta = LogUtil.getTraza(e);
        actualizarLogRespuesta(respuesta, recaudoWebDTO, cnn);
      }
    }
  }

  private void procesarTransaccionExitosa(PSEHostingTransactionInformationReturn infoTransaccion,
          RecaudoWebDTO recaudoWebDTO,
          Connection cnn,
          RecaudoWebLogDTO recaudoWebLogDTO)
          throws PersistenciaExcepcion
  {
    RecaudoWebDelegado recaudoWebDelegado = new RecaudoWebDelegado(cnn);
    switch (infoTransaccion.getState()) {
      case CREATED:
      case PENDING:
        break;
      case FAILED:
        recaudoWebDTO.setEstado(EEstado.RecaudoWeb.RECHAZADO);
        recaudoWebDelegado.actualizarRecaudoWeb(recaudoWebDTO, EEstado.DetalleRecaudoWeb.Pago.RECHAZADO);
        break;
      case NOT_AUTHORIZED:
        recaudoWebDTO.setEstado(EEstado.RecaudoWeb.DECLINADO);
        recaudoWebDelegado.actualizarRecaudoWeb(recaudoWebDTO, EEstado.DetalleRecaudoWeb.Pago.RECHAZADO);
        break;
      case OK:
        recaudoWebDTO.setEstado(EEstado.RecaudoWeb.ENVIADO);
        recaudoWebDelegado.actualizarRecaudoWeb(recaudoWebDTO, EEstado.DetalleRecaudoWeb.Pago.OK);
        break;
    }
    /**
     * Se inicia el proceso de crear el log cuando la petición se ha hecho
     * correctamente
     */
    recaudoWebLogDTO.setIdRecaudoWeb(recaudoWebDTO.getIdRecaudoWeb());
    recaudoWebLogDTO.setReturnCode(infoTransaccion.getReturnCode().toString());
    recaudoWebLogDTO.setState(infoTransaccion.getState().toString());
    recaudoWebLogDTO.setPaymentId(infoTransaccion.getPaymentID());
    recaudoWebLogDTO.setAmount(infoTransaccion.getAmount().doubleValue());
    recaudoWebLogDTO.setVatAmount(infoTransaccion.getVATAmount().doubleValue());
    recaudoWebLogDTO.setBankCode(infoTransaccion.getBankCode() + ":" + infoTransaccion.getBankName());
    recaudoWebLogDTO.setServiceCode(infoTransaccion.getServiceCode());
    recaudoWebLogDTO.setTrazabilityCode(infoTransaccion.getTrazabilityCode());
    recaudoWebLogDTO.setCycleNumber(infoTransaccion.getCycleNumber());
    recaudoWebLogDTO.setReferenceNumber3(infoTransaccion.getReference3());
    recaudoWebLogDTO.setReferenceNumber2(infoTransaccion.getReference2());
    recaudoWebLogDTO.setReferenceNumber1(infoTransaccion.getReference1());
    recaudoWebLogDTO.setSolicitedDate( new Date());
            //infoTransaccion.getSolicitedDate().toGregorianCalendar().getTime());
    recaudoWebLogDTO.setRespuesta(new Gson().toJson(infoTransaccion));
    new RecaudoWebLogDAO(cnn).actualizarRecaudoLog(recaudoWebLogDTO);

  }

  private RecaudoWebLogDTO guardarLog(RecaudoWebDTO recaudoWebDTO, Connection cnn)
          throws PersistenciaExcepcion
  {
    RecaudoWebLogDTO recaudoWebLogDTO = new RecaudoWebLogDTO();
    recaudoWebLogDTO.setIdRecaudoWeb(recaudoWebDTO.getIdRecaudoWeb());
    new RecaudoWebLogDAO(cnn).insertarRecaudoLog(recaudoWebLogDTO);
    ConexionBD.commit(cnn);
    return recaudoWebLogDTO;
  }

  private void actualizarLogRespuesta(String respuesta, RecaudoWebDTO recaudoWebDTO, Connection cnn)
  {
    try {
      RecaudoWebLogDTO recaudoWebLogDTO = new RecaudoWebLogDTO();
      recaudoWebLogDTO.setIdRecaudoWeb(recaudoWebDTO.getIdRecaudoWeb());
      recaudoWebLogDTO.setRespuesta(respuesta);
      new RecaudoWebLogDAO(cnn).actualizarLogRespuesta(recaudoWebLogDTO);
      ConexionBD.commit(cnn);
    } catch (PersistenciaExcepcion ex) {
      LogUtil.error(ex);
      ConexionBD.rollbackSinError(cnn);
    }
  }

}
