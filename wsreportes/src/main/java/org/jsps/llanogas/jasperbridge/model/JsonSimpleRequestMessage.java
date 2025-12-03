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
public class JsonSimpleRequestMessage implements Serializable {
    
    private String motorBD;
    private String user;
    private String password;
    private String jndi;
    private boolean valideUser;

    public JsonSimpleRequestMessage() {
    }

    public String getMotorBD() {
        return motorBD;
    }

    public void setMotorBD(String motorBD) {
        this.motorBD = motorBD;
    }
    
    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getJndi() {
        return jndi;
    }

    public void setJndi(String jndi) {
        this.jndi = jndi;
    }      

    public boolean isValideUser() {
        return valideUser;
    }

    public void setValideUser(boolean valideUser) {
        this.valideUser = valideUser;
    }
    
 
}
