package com.bioagricola.hya.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

@Component
public class EmailUtil {

    @Value(value = "${spring.mail.username}")
    private String emailFrom;

    private final JavaMailSender javaMailSender;

    public EmailUtil(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    public void sendEmailRememberPass(EmailForm emailForm) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper messageHelper = new MimeMessageHelper(message, false);

        messageHelper.setFrom(this.emailFrom);
        messageHelper.setSubject(emailForm.getSubject());
        messageHelper.setTo(emailForm.getEmailTo());
        messageHelper.setText(
               "<html>\n" +
                       "<body>\n" +
                       "<p>Para continuar con el proceso de restauración de contraseña, ingrese a el siguiente link desde su dispositivo movil:</p>\n" +
                       "<a href=\""+emailForm.getEmailTo()+"\">app://homafo.bocetos.co/password-reset/4b3aa3325ee32842e0dc5cb51e66a84c/username/usertest</a>\n" +
                       "</body>\n" +
                       "</html>", true);
        javaMailSender.send(message);
    }

}
