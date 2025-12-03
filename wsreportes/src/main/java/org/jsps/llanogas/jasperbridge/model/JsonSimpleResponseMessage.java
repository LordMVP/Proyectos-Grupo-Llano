/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.jsps.llanogas.jasperbridge.model;

import java.io.Serializable;

/**
 *
 * @author jpsierra
 */
public class JsonSimpleResponseMessage implements Serializable {

    private String message;
    private int statusCode;
    private boolean error;
    private long timeExecution;
    private boolean noContent;

    public JsonSimpleResponseMessage() {
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
    }

    public boolean isError() {
        return error;
    }

    public void setError(boolean error) {
        this.error = error;
    }

    public long getTimeExecution() {
        return timeExecution;
    }

    public void setTimeExecution(long timeExecution) {
        this.timeExecution = timeExecution;
    }

    public boolean isNoContent() {
        return noContent;
    }

    public void setNoContent(boolean noContent) {
        this.noContent = noContent;
    }
    

}
