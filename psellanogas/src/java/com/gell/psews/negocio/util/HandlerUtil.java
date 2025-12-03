/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.psews.negocio.util;

import com.gell.psews.persistencia.basedatos.ConexionBD;
import com.gell.psews.persistencia.dao.RecaudoWebLogDAO;
import com.gell.psews.persistencia.dto.RecaudoWebLogDTO;
import java.io.ByteArrayOutputStream;
import java.security.cert.X509Certificate;
import java.sql.Connection;
import java.text.SimpleDateFormat;
import java.util.Base64;
import java.util.Calendar;
import java.util.Date;
import java.util.Set;
import javax.xml.namespace.QName;
import javax.xml.soap.SOAPElement;
import javax.xml.soap.SOAPEnvelope;
import javax.xml.soap.SOAPException;
import javax.xml.soap.SOAPHeader;
import javax.xml.soap.SOAPMessage;
import javax.xml.ws.handler.MessageContext;
import javax.xml.ws.handler.soap.SOAPHandler;
import javax.xml.ws.handler.soap.SOAPMessageContext;

/**
 *
 * @author lrey
 */
public class HandlerUtil implements SOAPHandler<SOAPMessageContext> {

    private final String SECURITY_TOKEN = "_0Sahwev58iYfewi7gYLx9g22";

    @Override
    public Set<QName> getHeaders() {
        return null;
    }

    @Override
    public boolean handleMessage(SOAPMessageContext contexto) {
        try {
            CertificadoUtil.validarCertificados();
            SOAPMessage mensaje = contexto.getMessage();
            Boolean escritura = (Boolean) contexto.get(MessageContext.MESSAGE_OUTBOUND_PROPERTY);/*
            if (escritura) {
                LogUtil.info("-----  Agregando Cabecera -----------------");
                SOAPEnvelope envelope = mensaje.getSOAPPart().getEnvelope();
                envelope.setAttribute("xmlns:wsu", "http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd");
                envelope.setAttribute("xmlns:S", "http://schemas.xmlsoap.org/soap/envelope/");
                envelope.getBody().setAttribute("wsu:Id", "body");
                SOAPHeader header = envelope.getHeader();
                if (header == null) {
                    header = envelope.addHeader();
                }
                agregarAutenticacion(header);
            }*/
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            mensaje.writeTo(out);
            LogUtil.info("-----  SOAP Message -----------------");
            LogUtil.info();
            String traza = out.toString("UTF-8");
            LogUtil.info(traza);
            if (escritura) {
                crearLog(traza);
            }
            out.close();
            return true;
        } catch (Exception e) {
            LogUtil.error(e);
            return false;
        }

    }

    private void crearLog(String traza) {
        Connection cnn = null;
        try {
            int posInicial = traza.indexOf("<paymentID>");
            int posFinal = traza.indexOf("</paymentID>");
            if (posInicial < 0 || posFinal < 0) {
                return;
            }
            String paymentId = traza.substring(posInicial + 11, posFinal);
            RecaudoWebLogDTO recaudoWebLog = new RecaudoWebLogDTO();
            recaudoWebLog.setIdRecaudoWeb(Long.parseLong(paymentId));
            recaudoWebLog.setXmlInicio(traza);
            cnn = ConexionBD.conectar();
            RecaudoWebLogDAO logDAO = new RecaudoWebLogDAO(cnn);
            logDAO.actualizarLogEnvio(recaudoWebLog);
            ConexionBD.commit(cnn);
        } catch (Exception e) {
            LogUtil.error(e);
            ConexionBD.rollbackSinError(cnn);
        } finally {
            ConexionBD.cerrar(cnn);
        }
    }

    private void agregarAutenticacion(SOAPHeader cabecera) {
        try {
            Date fechaInicial = new Date();
            SOAPElement seguridad = getSecurity(cabecera);
            SOAPElement timestamp = getTimestamp(seguridad, fechaInicial);
            //getSignature(seguridad, fechaInicial);
            seguridad.addChildElement(timestamp);
            /*cabecera.addChildElement("WorkContext", "work", "http://oracle.com/weblogic/soap/workarea/")
                    .addTextNode(Base64.getEncoder().encodeToString(CertificadoUtil.sign(SECURITY_TOKEN)));*/
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private SOAPElement getTimestamp(SOAPElement security, Date fechaInicial) throws SOAPException {
        SOAPElement timestamp = security.addChildElement("Timestamp", "wsu");
        timestamp.setAttribute("wsu:Id", "timestamp");
        timestamp.addChildElement("Created", "wsu").addTextNode(getFechaFormato(fechaInicial, 0));
        timestamp.addChildElement("Expires", "wsu").addTextNode(getFechaFormato(fechaInicial, 8));
        return timestamp;
    }

    private SOAPElement getSecurity(SOAPHeader cabecera) throws Exception {
        X509Certificate certificado = CertificadoUtil.getCertificado();
        SOAPElement security = cabecera.addChildElement("Security", "wsse", "http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd");
        security.setAttribute("S:mustUnderstand", "1");
        SOAPElement binarySecurityToken = security.addChildElement("BinarySecurityToken", "wsse");
        binarySecurityToken.setAttribute("wsu:Id", SECURITY_TOKEN);
        binarySecurityToken.setAttribute("ValueType", "http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509v3");
        binarySecurityToken.addTextNode(Base64.getEncoder().encodeToString(certificado.getEncoded()));
        return security;
    }

    private void getSignature(SOAPElement security, Date fechaInicial) throws Exception {

        SOAPElement signature = security.addChildElement("Signature", "", "http://www.w3.org/2000/09/xmldsig#");
        SOAPElement signedInfo = signature.addChildElement("SignedInfo");
        signedInfo.addChildElement("CanonicalizationMethod")
                .setAttribute("Algorithm", "http://www.w3.org/2001/10/xml-exc-c14n#");
        signedInfo.addChildElement("SignatureMethod")
                .setAttribute("Algorithm", "http://www.w3.org/2000/09/xmldsig#rsa-sha1");

        SOAPElement reference = signedInfo.addChildElement("Reference");
        reference.setAttribute("URI", "#body");

        SOAPElement transforms = reference.addChildElement("Transforms");
        transforms.addChildElement("Transform")
                .setAttribute("Algorithm", "http://www.w3.org/2001/10/xml-exc-c14n#");
        reference.addChildElement("DigestMethod")
                .setAttribute("Algorithm", "http://www.w3.org/2000/09/xmldsig#sha1");
        reference.addChildElement("DigestValue")
                .addTextNode(Base64.getEncoder().encodeToString(CertificadoUtil.sign(SECURITY_TOKEN)));
        signature.addChildElement("SignatureValue")
                .addTextNode(CertificadoUtil.getSignature(null));

        SOAPElement keyInfo = signature.addChildElement("KeyInfo");
        SOAPElement securityTokenReference = keyInfo.addChildElement("SecurityTokenReference", "wsse");
        SOAPElement referenceToken = securityTokenReference.addChildElement("Reference", "wsse");
        referenceToken.setAttribute("URI", "#" + SECURITY_TOKEN);
        referenceToken.setAttribute("ValueType", "http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509v3");
    }

    private String getDataSha1RSA(String valor) throws Exception {
        X509Certificate certificado = CertificadoUtil.getCertificado();
        SignatureMethodRsaSha1 signature = new SignatureMethodRsaSha1(CertificadoUtil.getLlavePrivada(), certificado.getPublicKey());
        return signature.sign(valor);
    }

    private String getDataSha1RSA(Date fechaInicial) throws Exception {
        X509Certificate certificado = CertificadoUtil.getCertificado();
        String data = "<wsu:Timestamp wsu:Id=\"timestamp\"><wsu:Created>" + getFechaFormato(fechaInicial, 0) + "</wsu:Created><wsu:Expires>" + getFechaFormato(fechaInicial, 8) + "</wsu:Expires></wsu:Timestamp>";
        SignatureMethodRsaSha1 signature = new SignatureMethodRsaSha1(CertificadoUtil.getLlavePrivada(), certificado.getPublicKey());
        return signature.sign(data);
        /*
        String data = "<wsu:Timestamp wsu:Id=\"timestamp\"><wsu:Created>" + getFechaFormato(fechaInicial, 0) + "</wsu:Created><wsu:Expires>" + getFechaFormato(fechaInicial, 8) + "</wsu:Expires></wsu:Timestamp>";
        LogUtil.info("Data: " + data);
        MessageDigest messageDigest = MessageDigest.getInstance("SHA1");
        byte dataCifrada[] = messageDigest.digest(data.getBytes("UTF-8"));
        return org.postgresql.util.Base64.encodeBytes(dataCifrada);*/
    }

    private String getFechaFormato(Date fecha, int hours) {
        Calendar calendario = Calendar.getInstance();
        calendario.setTime(fecha);
        calendario.add(Calendar.HOUR, hours);
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        return dateFormat.format(calendario.getTime());
    }

    @Override
    public boolean handleFault(SOAPMessageContext context) {
        LogUtil.info("ERROR->>>>>");
        handleMessage(context);
        return true;
    }

    @Override
    public void close(MessageContext context) {

    }

}
