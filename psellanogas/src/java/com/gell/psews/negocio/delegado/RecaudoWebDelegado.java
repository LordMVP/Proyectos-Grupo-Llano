/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.psews.negocio.delegado;

import com.gell.psews.negocio.constantes.EEstado;
import com.gell.psews.negocio.excepcion.NegocioExcepcion;
import com.gell.psews.negocio.procesos.ProcesoVerificacionPSE;
import com.gell.psews.persistencia.dao.DetalleRecaudoWebDAO;
import com.gell.psews.persistencia.dao.RecaudoWebDAO;
import com.gell.psews.persistencia.dao.RecaudoWebLogDAO;
import com.gell.psews.persistencia.dao.SuscripcionDAO;
import com.gell.psews.persistencia.dto.DetalleAplicacionRecaudoDTO;
import com.gell.psews.persistencia.dto.DetalleRecaudoWebDTO;
import com.gell.psews.persistencia.dto.RecaudoWebDTO;
import com.gell.psews.persistencia.dto.RecaudoWebLogDTO;
import com.gell.psews.persistencia.dto.pse.ConfiguracionDTO;
import com.gell.psews.persistencia.exception.PersistenciaExcepcion;
import java.sql.Connection;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author lrey
 */
public class RecaudoWebDelegado
{

  private final Connection cnn;
  private final RecaudoWebDAO recaudoWebDAO;

  public RecaudoWebDelegado(Connection cnn)
  {
    this.cnn = cnn;
    recaudoWebDAO = new RecaudoWebDAO(cnn);
  }

  /**
   * Consulta la cantidad de transacciones pendientes que tenga una suscripción
   *
   * @param idSuscripcion
   * @return
   * @throws PersistenciaExcepcion Error al ejecutar la consulta
   */
  public int consultarCantidadTransaccionesPendientes(Long idSuscripcion)
          throws PersistenciaExcepcion
  {
    return new DetalleRecaudoWebDAO(cnn).consultarTransaccionesPendientes(idSuscripcion);
  }

  /**
   * Ingresa un nuevo registro del recaudo web
   *
   * @param recaudoWeb
   * @throws PersistenciaExcepcion
   */
  
  
  public  DetalleAplicacionRecaudoDTO obtenerFacturasSeleccionadas(String id,int suscriptor) throws PersistenciaExcepcion{
      
     
      return  recaudoWebDAO.obtenerFacturas(id,suscriptor);
  
  
  }
  
  public void insertarRecaudoWeb(RecaudoWebDTO recaudoWeb)
          throws PersistenciaExcepcion
  {
    recaudoWebDAO.insertarRecaudoWeb(recaudoWeb);
  }
  
   public void insertarRecaudoWeb2(RecaudoWebDTO recaudoWeb,String FacturasJson)
          throws PersistenciaExcepcion
  {
    recaudoWebDAO.insertarRecaudoWeb2(recaudoWeb,FacturasJson);
  }

  /**
   * Actualizar la información del recaudo
   *
   * @param recaudoWeb
   * @param estadoDetalle
   * @throws PersistenciaExcepcion
   */
  public void actualizarRecaudoWeb(RecaudoWebDTO recaudoWeb, String estadoDetalle)
          throws PersistenciaExcepcion
  {
    List<DetalleRecaudoWebDTO> listaDetalles = new DetalleRecaudoWebDAO(cnn).consultar(recaudoWeb.getIdRecaudoWeb());
    recaudoWeb.setListaDetalles(listaDetalles);
    actualizarDetallesRecaudo(estadoDetalle, recaudoWeb, null);
    recaudoWebDAO.actualizarRecaudoWeb(recaudoWeb);
  }

  public void actualizarDetallesRecaudo(String estado, RecaudoWebDTO recaudo, String mensaje)
  {
    DetalleRecaudoWebDAO detalleDAO = new DetalleRecaudoWebDAO(cnn);
    for (DetalleRecaudoWebDTO detalle : recaudo.getListaDetalles()) {
      detalle.setMensaje(mensaje);
      detalle.setEstadoPago(estado);
      detalleDAO.actualizar(detalle);
    }
  }

  public void actualizarDetallesRecaudoPago(String estado, RecaudoWebDTO recaudo, String mensaje)
  {
    DetalleRecaudoWebDAO detalleDAO = new DetalleRecaudoWebDAO(cnn);
    for (DetalleRecaudoWebDTO detalle : recaudo.getListaDetalles()) {
      detalle.setMensaje(mensaje);
      detalle.setEstadoAplicacionPago(estado);
      detalleDAO.actualizar(detalle);
    }
  }

  /**
   * Consulta la información de un solo recaudo
   *
   * @param idWebRecaudo
   * @return
   * @throws NegocioExcepcion
   * @throws PersistenciaExcepcion
   */
  public RecaudoWebDTO consultar(Long idWebRecaudo)
          throws NegocioExcepcion, PersistenciaExcepcion
  {
    return recaudoWebDAO.consultar(idWebRecaudo);
  }

  /**
   * Consulta todas las transacciones que están pendientes por responder PSE
   *
   * @return lista de los registros pendientes
   * @throws PersistenciaExcepcion
   */
  public List<RecaudoWebDTO> consultarPendientes()
          throws PersistenciaExcepcion
  {
    return recaudoWebDAO.consultarPendientes();
  }

  public List<RecaudoWebDTO> consultarPendientesPago()
          throws PersistenciaExcepcion
  {
    List<RecaudoWebDTO> listaPendientes = recaudoWebDAO.consultarPendientesPago();
    for (RecaudoWebDTO recaudo : listaPendientes) {
      recaudo.setListaDetalles(consultarDetallesRecaudo(recaudo.getIdRecaudoWeb()));
    }
    return listaPendientes;
  }

  public RecaudoWebLogDTO consultarEstadoRecaudo(Long idRecaudoWeb)
          throws PersistenciaExcepcion, NegocioExcepcion
  {
    RecaudoWebLogDAO recaudoWebLogDAO = new RecaudoWebLogDAO(cnn);
    RecaudoWebLogDTO recaudoWEBDTO = recaudoWebLogDAO.consultar(idRecaudoWeb);
    RecaudoWebDTO recaudoWeb = consultar(idRecaudoWeb);
    boolean pendiente = recaudoWeb.getEstado().equalsIgnoreCase(EEstado.RecaudoWeb.PENDIENTE);
    if (pendiente) {
      ProcesoVerificacionPSE.getInstancia().procesarRegistro(cnn, recaudoWeb);
    }
    return recaudoWEBDTO;
  }

  public List<DetalleRecaudoWebDTO> consultarDetallesRecaudo(Long idRecaudoWeb)
          throws PersistenciaExcepcion
  {
    DetalleRecaudoWebDAO detalleRecaudoWebDAO = new DetalleRecaudoWebDAO(cnn);
    return detalleRecaudoWebDAO.consultar(idRecaudoWeb);
  }

  public String consultarNombreSuscripcion(Long idRecaudoWeb, ConfiguracionDTO configuracion)
          throws PersistenciaExcepcion
  {
    SuscripcionDAO suscripcionDAO = new SuscripcionDAO(cnn);
    return suscripcionDAO.consultarNombreSuscripcion(idRecaudoWeb, configuracion.getEmpresa().getIdEmpresaPrincipal());
  }
/*
  public boolean controlEstadoProceso()
          throws PersistenciaExcepcion
  {
    SuscripcionDAO suscripcionDAO = new SuscripcionDAO(cnn);
    return true;
  }*/
}
