/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.psews.negocio.servlet;

import com.gell.psews.negocio.constantes.EEmpresa;
import com.gell.psews.negocio.constantes.EEstado;
import com.gell.psews.negocio.constantes.ERutas;
import com.gell.psews.negocio.delegado.RecaudoWebDelegado;
import com.gell.psews.negocio.util.EnviarCorreo;
import com.gell.psews.negocio.util.LogUtil;
import com.gell.psews.persistencia.basedatos.ConexionBD;
import com.gell.psews.persistencia.dto.pse.ConfiguracionDTO;
import com.gell.psews.vista.excepcion.AplicacionExcepcion;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author lrey
 */
@WebServlet(name = "ResumenServlet", urlPatterns = {
  ERutas.Cliente.CONFIRMAR_PAGO
})
public class ResumenServlet extends ServletGenerico
{

  /**
   * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
   * methods.
   *
   * @param request servlet request
   * @param response servlet response
   * @throws ServletException if a servlet-specific error occurs
   * @throws IOException if an I/O error occurs
   */
  @Override
  protected void processRequest(HttpServletRequest request, HttpServletResponse response)
          throws ServletException, IOException
  {
    response.setContentType("text/html;charset=UTF-8");
    request.setCharacterEncoding("UTF-8");
    response.setCharacterEncoding("UTF-8");
    Connection cnn = null;
    try (PrintWriter out = response.getWriter()) {
      String ruta = "";
      try {

        cnn = ConexionBD.conectar();
        ruta = procesarConfirmarPago(request, response, cnn);
        ConexionBD.commit(cnn);
      } catch (Exception ex) {
        out.print(ex);
        Logger.getLogger(ResumenServlet.class.getName()).log(Level.SEVERE, null, ex);
        ConexionBD.rollbackSinError(cnn);
      } finally {
        ConexionBD.cerrar(cnn);
      }
      request.getRequestDispatcher(ruta).forward(request, response);
    }
  }

  private String procesarConfirmarPago(HttpServletRequest request, HttpServletResponse response, Connection cnn)
          throws IOException, ServletException
  {
    int idEmpresaPrincipal = request.getParameter("idEmpresa") == null ? EEmpresa.ID_LLANOGAS : EEmpresa.ID_CUSIANAGAS;
    ConfiguracionDTO configuracion = LISTA_CONFIGURACION.get(idEmpresaPrincipal);
    try {
      Long paymentId = Long.parseLong(request.getParameter("ID"));
      if (idEmpresaPrincipal == EEmpresa.ID_CUSIANAGAS) {
        return procesarConfirmarPagoGenerico(request, response, cnn, configuracion);
      }

      RecaudoWebDelegado recaudoWebDelegado = new RecaudoWebDelegado(cnn);
      request.setAttribute("nombreCliente", recaudoWebDelegado.consultarNombreSuscripcion(paymentId, configuracion));

      request.setAttribute("ID", paymentId);
      request.setAttribute("estadoOK", EEstado.DetalleRecaudoWeb.Pago.OK);
      request.setAttribute("estadoPendiente", EEstado.DetalleRecaudoWeb.Pago.PENDIENTE);
      request.setAttribute("estadoRechazado", EEstado.DetalleRecaudoWeb.Pago.RECHAZADO);

      request.setAttribute("idEmpresaLlanogas", configuracion.getEmpresa().getIdEmpresaPrincipal());
      request.setAttribute("idEmpresaBioagricola", configuracion.getEmpresa().getIdEmpresaSegunda());

      request.setAttribute("resumen", recaudoWebDelegado.consultarEstadoRecaudo(paymentId));
      request.setAttribute("listaDetalles", recaudoWebDelegado.consultarDetallesRecaudo(paymentId));
    } catch (AplicacionExcepcion ex) {
      EnviarCorreo.enviar(configuracion.getCorreo(), ex.getMensaje());
      LogUtil.error(ex);
    }
    return "../resumen.jsp";

  }

  private String procesarConfirmarPagoGenerico(HttpServletRequest request, HttpServletResponse response, Connection cnn, ConfiguracionDTO configuracion)
          throws IOException, ServletException
  {
    try {
      Long paymentId = Long.parseLong(request.getParameter("ID"));

      RecaudoWebDelegado recaudoWebDelegado = new RecaudoWebDelegado(cnn);
      request.setAttribute("nombreCliente", recaudoWebDelegado.consultarNombreSuscripcion(paymentId, configuracion));

      request.setAttribute("ID", paymentId);
      request.setAttribute("estadoOK", EEstado.DetalleRecaudoWeb.Pago.OK);
      request.setAttribute("estadoPendiente", EEstado.DetalleRecaudoWeb.Pago.PENDIENTE);
      request.setAttribute("estadoRechazado", EEstado.DetalleRecaudoWeb.Pago.RECHAZADO);

      request.setAttribute("idEmpresaPrincipal", configuracion.getEmpresa().getIdEmpresaPrincipal());
      request.setAttribute("idEmpresaSegunda", configuracion.getEmpresa().getIdEmpresaSegunda());

      request.setAttribute("resumen", recaudoWebDelegado.consultarEstadoRecaudo(paymentId));
      request.setAttribute("listaDetalles", recaudoWebDelegado.consultarDetallesRecaudo(paymentId));
    } catch (AplicacionExcepcion ex) {
      EnviarCorreo.enviar(configuracion.getCorreo(), ex.getMensaje());
      LogUtil.error(ex);
    }
    return "../cusiana/resumen.jsp";

  }

  // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
  /**
   * Handles the HTTP <code>GET</code> method.
   *
   * @param request servlet request
   * @param response servlet response
   * @throws ServletException if a servlet-specific error occurs
   * @throws IOException if an I/O error occurs
   */
  @Override
  protected void doGet(HttpServletRequest request, HttpServletResponse response)
          throws ServletException, IOException
  {
    processRequest(request, response);
  }

  /**
   * Handles the HTTP <code>POST</code> method.
   *
   * @param request servlet request
   * @param response servlet response
   * @throws ServletException if a servlet-specific error occurs
   * @throws IOException if an I/O error occurs
   */
  @Override
  protected void doPost(HttpServletRequest request, HttpServletResponse response)
          throws ServletException, IOException
  {
    processRequest(request, response);
  }

  /**
   * Returns a short description of the servlet.
   *
   * @return a String containing servlet description
   */
  @Override
  public String getServletInfo()
  {
    return "Short description";
  }// </editor-fold>

}
