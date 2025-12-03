/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.psews.negocio.util;

import com.gell.psews.negocio.servicio.ArrayOfPSEHostingField;
import com.gell.psews.negocio.servicio.ArrayOfPSEHostingMemberService;
import com.gell.psews.negocio.servicio.PSEHostingCreateTransactionReturn;
import com.gell.psews.negocio.servicio.PSEHostingTransactionInformationReturn;
import com.gell.psews.negocio.servicio.PSEHostingWS;
import com.gell.psews.negocio.servicio.PSEHostingWSSoap;
import com.gell.psews.persistencia.dto.RecaudoWebDTO;
import com.gell.psews.persistencia.dto.pse.ConfiguracionDTO;
import com.gell.psews.persistencia.dto.pse.DatosPSE;
import java.math.BigDecimal;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.UUID;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author lrey
 */
public class ServicioPSE
{

  public static PSEHostingCreateTransactionReturn createTransactionPaymentMulticreditHosting(
          RecaudoWebDTO recaudoWebDTO,
          ArrayOfPSEHostingField fields,
          ArrayOfPSEHostingMemberService memberservices,
          String ip,
          ConfiguracionDTO configuracion)
  {
    LogUtil.info("************************************* START [paymentID=" + recaudoWebDTO.getPaymentId() + "][] *******************************************");
    int ticketOfficeID = recaudoWebDTO.getTicketOfficeId();
    String serviceCode = recaudoWebDTO.getServiceCode();
    LogUtil.info("ServiceCode:" + serviceCode);
    String entityURL = configuracion.getDatosPSE().getEntityURL(ip);
    String entityUrl = entityURL + "?ID=" + recaudoWebDTO.getPaymentId();
    BigDecimal vatAmount = new BigDecimal(recaudoWebDTO.getVatAmount());
    BigDecimal amount = new BigDecimal(recaudoWebDTO.getValorPagoTotal());
    URL url = getURL(configuracion);
    LogUtil.info("[paymentID=" + recaudoWebDTO.getPaymentId() + "] URL: " + url);
    PSEHostingWS service = new PSEHostingWS(url);
    PSEHostingWSSoap port = service.getPSEHostingWSSoap12();

    PSEHostingCreateTransactionReturn response = port.createTransactionPaymentMulticreditHosting(ticketOfficeID, amount,
            vatAmount, recaudoWebDTO.getPaymentId(),
            recaudoWebDTO.getPaymentDescription(),
            recaudoWebDTO.getReferenceNumber1(),
            recaudoWebDTO.getReferenceNumber2(),
            recaudoWebDTO.getReferenceNumber3(),
            serviceCode, recaudoWebDTO.getEmail(),
            fields, memberservices, entityUrl);
    LogUtil.info("************************************* END [paymentID=" + recaudoWebDTO.getPaymentId() + "] *******************************************");

    return response;
  }

  public static PSEHostingTransactionInformationReturn getTransactionInformationHosting(String paymentID, ConfiguracionDTO configuracion)
  {
    DatosPSE datosPSE = configuracion.getDatosPSE();
    URL url = getURL(configuracion);
    LogUtil.info("[paymentID=" + paymentID + "] URL: " + url);
    PSEHostingWS service = new PSEHostingWS(url);
    PSEHostingWSSoap port = service.getPSEHostingWSSoap12();
    int ticketOfficeID = datosPSE.getTicketOfficeId();
    String password = datosPSE.getPassword();
    return port.getTransactionInformationHosting(ticketOfficeID, password, paymentID);
  }

  public static PSEHostingCreateTransactionReturn createTransactionPaymentHosting(ConfiguracionDTO configuracion,
          RecaudoWebDTO recaudoWebDTO,
          String ip,
          ArrayOfPSEHostingField fields)
  {
    LogUtil.info("************************************* START [paymentID=" + recaudoWebDTO.getPaymentId() + "] *******************************************");
    URL url = getURL(configuracion);
    LogUtil.info("[paymentID=" + recaudoWebDTO.getPaymentId() + "] URL: " + url);
    PSEHostingWS service = new PSEHostingWS(url);
    PSEHostingWSSoap port = service.getPSEHostingWSSoap12();
    String serviceCode = recaudoWebDTO.getServiceCode();
    LogUtil.info("[paymentID=" + recaudoWebDTO.getPaymentId() + "] ServiceCode:" + serviceCode);
    BigDecimal vatAmount = new BigDecimal(recaudoWebDTO.getVatAmount());
    BigDecimal amount = new BigDecimal(recaudoWebDTO.getValorPagoTotal());
    String entityURL = configuracion.getDatosPSE().getEntityURL(ip);
    String entityUrl = entityURL + "?ID=" + recaudoWebDTO.getPaymentId() + "&idEmpresa=" + UUID.randomUUID().toString();
    int ticketOfficeID = recaudoWebDTO.getTicketOfficeId();
    LogUtil.info("[paymentID=" + recaudoWebDTO.getPaymentId() + "] entityURL: " + entityURL + " ticketOfficeID: " + ticketOfficeID);
    PSEHostingCreateTransactionReturn response = port.createTransactionPaymentHosting(ticketOfficeID, amount,
            vatAmount, recaudoWebDTO.getPaymentId(),
            recaudoWebDTO.getPaymentDescription(),
            recaudoWebDTO.getReferenceNumber1(),
            recaudoWebDTO.getReferenceNumber2(),
            recaudoWebDTO.getReferenceNumber3(),
            serviceCode, recaudoWebDTO.getEmail(),
            fields, entityUrl);
    LogUtil.info("************************************* Response [paymentID=" + recaudoWebDTO.getPaymentId() + "] *******************************************");
    return response;
  }

  public static URL getURL(ConfiguracionDTO configuracion)
  {
    try {
      return new URL(configuracion.getDatosPSE().getUrlPSE());
    } catch (MalformedURLException ex) {
      Logger.getLogger(ServicioPSE.class.getName()).log(Level.SEVERE, null, ex);
      throw new RuntimeException("La URL de PSE no está parametrizada para la emprea " + configuracion.getEmpresa().getIdEmpresaPrincipal());
    }
  }

}
