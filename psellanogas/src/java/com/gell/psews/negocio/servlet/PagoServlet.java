/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.psews.negocio.servlet;

import com.gell.psews.negocio.constantes.EEmpresa;
import com.gell.psews.negocio.constantes.EMensajes;
import com.gell.psews.negocio.constantes.ERutas;
import com.gell.psews.negocio.delegado.CargarInformacionDelegado;
import com.gell.psews.negocio.delegado.PSEDelegado;
import com.gell.psews.negocio.delegado.SuscripcionDelegado;
import static com.gell.psews.negocio.servlet.ServletGenerico.LISTA_CONFIGURACION;
import com.gell.psews.negocio.util.EnviarCorreo;
import com.gell.psews.negocio.util.LogUtil;
import com.gell.psews.persistencia.dto.PagadorDTO;
import com.gell.psews.persistencia.dto.RespuestaDTO;
import com.gell.psews.persistencia.dto.pse.ConfiguracionDTO;
import com.gell.psews.vista.excepcion.AplicacionExcepcion;
import com.google.gson.Gson;
import java.sql.Connection;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Se encarga de procesar todas las peticiones como consulta de las facturas con
 * mora, el listado de bancos por parte de PSE y demás peticiones requeridas
 * para el procesamiento del pago 334615
 *
 * @author lrey
 */
@WebServlet(name = "PagoServlet",
        urlPatterns = {
          ERutas.Cliente.CONSULTAR_FACTURA,
          ERutas.Cliente.CONSULTAR_FACTURACONPAGOADICIONAL,  
          ERutas.Cliente.PAGAR,
           ERutas.Cliente.PAGAR2,
          ERutas.Cliente.CONSULTAR_AUTORIZACION_TRATAMIENTO,
          ERutas.Cliente.CONSULTAR_POLITICA_TRATAMIENTO,
          ERutas.Configuracion.CARGAR_CONFIGURACION,
          ERutas.Configuracion.PROCESO_DETENER,
          ERutas.Configuracion.PROCESO_ENVIAR_CORREO
        }
)
public class PagoServlet extends ServletEstandarJSON
{

  public static Thread proceso;

  @Override
  public RespuestaDTO procesarPeticionJSON(HttpServletRequest request, HttpServletResponse response, String accion, Connection cnn)
          throws AplicacionExcepcion
  {
    String idEmpresa = request.getParameter("idEmpresa");
    int idEmpresaRecaudadora = idEmpresa == null ? EEmpresa.ID_BIOAGRICOLA : EEmpresa.ID_LLANOGAS;    
    ConfiguracionDTO configuracion = ServletGenerico.LISTA_CONFIGURACION.get(idEmpresaRecaudadora);
    switch (accion) {
      case ERutas.Cliente.CONSULTAR_FACTURA:
        String codigoUsuario = request.getParameter("codigoCliente");
        return new SuscripcionDelegado(cnn).consultarPago(codigoUsuario, idEmpresaRecaudadora);
         case ERutas.Cliente.CONSULTAR_FACTURACONPAGOADICIONAL:
         codigoUsuario = request.getParameter("codigoCliente");
        return new SuscripcionDelegado(cnn).consultarPagoConPagoAdicional(codigoUsuario, idEmpresaRecaudadora);
      case ERutas.Cliente.CONSULTAR_AUTORIZACION_TRATAMIENTO:
        return new SuscripcionDelegado(cnn).consultarAutorizacionTratamientoDatos(configuracion);
      case ERutas.Cliente.CONSULTAR_POLITICA_TRATAMIENTO:
        return new SuscripcionDelegado(cnn).consultarPoliticaTratamientoDatos(configuracion);
      case ERutas.Cliente.PAGAR:
        return procesarPagar(request, cnn, configuracion);
            case ERutas.Cliente.PAGAR2:
        return procesarPagarAdicional(request, cnn, configuracion);
      case ERutas.Configuracion.CARGAR_CONFIGURACION:
        LogUtil.info("Cargando configuración");
        LISTA_CONFIGURACION.clear();
        LISTA_CONFIGURACION.put(EEmpresa.ID_LLANOGAS,
                new CargarInformacionDelegado(EEmpresa.ID_LLANOGAS).cargar(getPlantilla()));
        LISTA_CONFIGURACION.put(EEmpresa.ID_CUSIANAGAS,
                new CargarInformacionDelegado(EEmpresa.ID_CUSIANAGAS).cargar(getPlantilla()));
      case ERutas.Configuracion.PROCESO_DETENER:
        detener();
        return new RespuestaDTO(EMensajes.Ok);
      case ERutas.Configuracion.PROCESO_ENVIAR_CORREO:
        String mensaje = EnviarCorreo.enviar(configuracion.getCorreo(), "Esto es una prueba desde el webservices de PSE");
        return new RespuestaDTO().setMensaje(mensaje);

    }
    throw new AplicacionExcepcion(EMensajes.ERROR_NEGOCIO_RUTA_NO_ENCONTRADA);
  }

  private RespuestaDTO procesarPagar(HttpServletRequest request, Connection cnn, ConfiguracionDTO configuracion)
          throws AplicacionExcepcion
  {              
System.out.println("entro a pagar sin adicional");
    String ip = obtenerIp(request);
    String codigoCliente = request.getParameter("codigoCliente");
    String infoPagador = request.getParameter("pagador");
    
      
    PagadorDTO pagador = new Gson().fromJson(infoPagador, PagadorDTO.class);
    pagador.setIp(ip);
    PSEDelegado pseDelegado = new PSEDelegado(cnn);
    int idEmpresaRecaudadora = configuracion.getEmpresa().getIdEmpresaPrincipal();
     
    int idEmpresa = configuracion.getEmpresa().getIdEmpresaPrincipal();
    if (idEmpresa == EEmpresa.ID_CUSIANAGAS) {
      return pseDelegado.createTransactionPaymentHostingCusiana(codigoCliente, pagador, idEmpresaRecaudadora);
    }
    return pseDelegado.createTransactionPaymentMulticreditHosting(codigoCliente, pagador, idEmpresaRecaudadora);
  }
  
  private RespuestaDTO procesarPagarAdicional(HttpServletRequest request, Connection cnn, ConfiguracionDTO configuracion)
          throws AplicacionExcepcion
  {
      
            

    String ip = obtenerIp(request);
    String codigoCliente = request.getParameter("codigoCliente");
    System.out.println("---"+codigoCliente);
    String infoPagador = request.getParameter("pagador");
    String tramaPpa_ideregistro = request.getParameter("tramaPpa_ideregistro");
        float pagoAdiciona = Float.parseFloat( request.getParameter("pagoAdicional"));
          float pagoadiciongas = Float.parseFloat( request.getParameter("pagoadiciongas"));
          float  pagoadicionaseo = Float.parseFloat( request.getParameter("pagoadicionaseo"));
    //System.out.println("trama "+tramaPpa_ideregistro);
    
    System.out.println("pago adicional "+pagoAdiciona+" pago adicional gas "+pagoadiciongas+" pago adicional aseo"+pagoadicionaseo);

    PagadorDTO pagador = new Gson().fromJson(infoPagador, PagadorDTO.class);
    pagador.setIp(ip);
    PSEDelegado pseDelegado = new PSEDelegado(cnn);
    /*int idEmpresaRecaudadora = configuracion.getEmpresa().getIdEmpresaPrincipal();
    int idEmpresa = configuracion.getEmpresa().getIdEmpresaPrincipal();*/
    int idEmpresaRecaudadora = configuracion.getEmpresa().getIdEmpresaSegunda();
    int idEmpresa = configuracion.getEmpresa().getIdEmpresaSegunda();
    if (idEmpresa == EEmpresa.ID_CUSIANAGAS) {
      return pseDelegado.createTransactionPaymentHostingCusiana(codigoCliente, pagador, idEmpresaRecaudadora);
    }
    LogUtil.error("ingresando el pagador");
    return pseDelegado.createTransactionPaymentMulticreditHostingConAdicional(pagoadicionaseo,pagoadiciongas,tramaPpa_ideregistro,pagoadiciongas+pagoadicionaseo,codigoCliente, pagador, idEmpresaRecaudadora);
  }

}
