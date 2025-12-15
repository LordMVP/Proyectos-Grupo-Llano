package com.bioagricola.apirest.aprovechamiento.dto;

/**
 * @author nagredo
 * @project dev_back_aprovechamiento
 * @class JasperResponseDto
 */
public class JasperResponseDto {
    private String jndi;
    private String format;
    private String reportName;
    private JasperParametersDto parameters;
    private String user;
    private String password;

    public String getJndi() {
        return jndi;
    }

    public void setJndi(String jndi) {
        this.jndi = jndi;
    }

    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }

    public String getReportName() {
        return reportName;
    }

    public void setReportName(String reportName) {
        this.reportName = reportName;
    }

    public JasperParametersDto getParameters() {
        return parameters;
    }

    public void setParameters(JasperParametersDto parameters) {
        this.parameters = parameters;
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
}
