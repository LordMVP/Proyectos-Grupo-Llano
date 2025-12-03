/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.jsps.llanogas.jasperbridge.model;

import java.util.Arrays;
import java.util.Iterator;
import java.util.Map;

/**
 *
 * @author jpsierra
 */
public class JsonReportRequest extends JsonSimpleRequestMessage {

    private String reportName;
    private Map<String, Object> parameters;
    private String format = "pdf";

    public JsonReportRequest() {
        this.format = "pdf";
    }

        public String getReportName() {
        return reportName;
    }

    public void setReportName(String reportName) {
        this.reportName = reportName;
    }

    public Map getParameters() {
        return parameters;
    }

    public void setParameters(Map parameters) {
        this.parameters = parameters;
    }

    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }

    public void parseParameters() {
        Iterator<String> keys = parameters.keySet().iterator();
        while (keys.hasNext()) {
            String key = keys.next();
            if (key.matches("PR_INT_.*")) {
                parameters.put(key, ((Double)parameters.get(key)).intValue());
            }else if(key.matches("PR_STR_.*")){
                parameters.put(key,parameters.get(key).toString());
            }else if(key.matches("PR_DOU_.*")){
                parameters.put(key, ((Double)parameters.get(key)));
            }else if(key.matches("PR_LIST_INT_.*")){
            }
        }
    }

}
