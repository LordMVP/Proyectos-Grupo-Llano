/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.psews.negocio.util;

import com.gell.psews.persistencia.dto.pse.CorreoDTO;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.NoSuchProviderException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

/**
 *
 * @author progredi1
 */
public class EnviarCorreo
{

  private Transport transport;
  private Session session;
  public static EnviarCorreo instancia = new EnviarCorreo();

  private EnviarCorreo()
  {

  }

  @SuppressWarnings("UseSpecificCatch")
  public static String enviar(CorreoDTO correo, String mensaje)
  {
    try {
      instancia.conectarCorreo(correo);
      instancia.enviarCorreos(correo, mensaje);
      instancia.cerrarConexion();
      return "";
    } catch (Exception e) {
      LogUtil.error(e);
      return LogUtil.getTraza(e);
    }
  }

  private void conectarCorreo(CorreoDTO correo)
          throws NoSuchProviderException, MessagingException
  {
    Properties propiedades = new Properties();
    propiedades.setProperty("mail.smtp.host", correo.getServidor());
    propiedades.setProperty("mail.smtp.starttls.enable", correo.getStartTls());
    propiedades.setProperty("mail.smtp.port", correo.getPuerto() + "");
    propiedades.setProperty("mail.smtp.auth", correo.getAutenticacion());
    session = Session.getDefaultInstance(propiedades);
    transport = session.getTransport("smtp");
    transport.connect(correo.getMail(), null);
  }

  public void enviarCorreos(CorreoDTO correo, String mensaje)
          throws MessagingException
  {
    MimeMessage message = new MimeMessage(session);
    message.setFrom(new InternetAddress(correo.getMail()));
    String correoDestino = correo.getCorreoDestino();
    String correoDestinoCopia = correo.getCorreoDestinoCopia();
    message.addRecipients(Message.RecipientType.TO, InternetAddress.parse(correoDestino));
    if (!correoDestinoCopia.trim().isEmpty()) {
      message.addRecipients(Message.RecipientType.CC, InternetAddress.parse(correoDestinoCopia));
    }
    message.setSubject(correo.getAsunto());
    MimeBodyPart messageBodyPart = new MimeBodyPart();
    messageBodyPart.setContent(mensaje, "text/html;charset=UTF-8");
    Multipart multipart = new MimeMultipart();
    multipart.addBodyPart(messageBodyPart);
    message.setContent(multipart);
    transport.sendMessage(message, message.getAllRecipients());
  }

  public void cerrarConexion()
  {
    try {
      transport.close();
    } catch (MessagingException ex) {
      Logger.getLogger(EnviarCorreo.class.getName()).log(Level.SEVERE, null, ex);
    }
  }

}
