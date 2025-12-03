/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.jsps.llanogas.jasperbridge.test;

import com.google.gson.Gson;
import org.jsps.llanogas.jasperbridge.model.JsonReportRequest;

/**
 *
 * @author jpsierra
 */
public class Main {
    
    public static void main(String[] args) {
        String message = "{'user':'kio','password':'kio','parameters':{'p1':1,'p2':'p2'}}";
        Gson gson = new Gson();
        JsonReportRequest g = gson.fromJson(message,JsonReportRequest.class);
        System.out.println("User: "+g.getUser());
        System.out.println("Param :"+g.getParameters().get("p1").getClass().getSimpleName());
    }
    
}
