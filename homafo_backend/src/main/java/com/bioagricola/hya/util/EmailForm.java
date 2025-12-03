package com.bioagricola.hya.util;

import org.springframework.util.MultiValueMap;

/**
 * Clase que define los parametros del correo electronico.
 * @author cperez@progracol.com
 */
public class EmailForm {

    private String emailTo;

    private String subject;

    private String link;

    private MultiValueMap<String, String> params;

    public String getEmailTo() {
        return emailTo;
    }

    public void setEmailTo(String emailTo) {
        this.emailTo = emailTo;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public MultiValueMap<String, String> getParams() {
        return params;
    }

    public void setParams(MultiValueMap<String, String> params) {
        this.params = params;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }
}
